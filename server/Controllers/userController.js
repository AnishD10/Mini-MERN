require("dotenv").config();
const user = require("../Model/User"); //User Model is imported for registration
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateOtp, findUserByOtp, clearOtpFields , transporter } = require("../utils/otputils")

const RegisterUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  const exist = await user.findOne({ email });

  if (exist) {
    return res.status(400).json({ message: "User already exist" });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);

    const newUser = new user({ name, email, password: hashed, role });

    await newUser.save();

    res.status(201).json({ message: "User Registered Sucessfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Registration failed", error: err.message });
  }
};

const LoginUser = async (req, res) => {
  try {
    const { email, password, secretKey } = req.body;
    const findUser = await user.findOne({ email }).select("+password");
    if (!findUser) {
      return res.status(201).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, findUser.password); 
    // console.log(isMatch);
    // console.log(findUser.role);
    if (!isMatch) {
      return res.status(201).json({ message: "Password is incorrect" });
    }
    // let userRole = findUser.role;
    // console.log(userRole);
    // console.log(userRole === "admin");
    // if (userRole === "admin") {
    //   const userStatus = secretKey === process.env.JWT_SECRET;
    //   console.log(userStatus);
    //   if (!userStatus) {
    //     return res.status(403).json({ message: "user not authorized" });
    //   }
    // }

    token = jwt.sign(
      { userID: findUser._id, role: findUser.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: findUser._id,
        name: findUser.name,
        role: findUser.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed ", error: err.message });
  }
};

const forgotPassword = async (req ,res) => {
  try {
    const { email } = req.body;
    const forgotUser = await user.findOne({ email });
    if (!forgotUser) return res.status(404).send({ message: "Email not found" });

    forgotUser.otp = generateOtp();
    forgotUser.otpExpires = Date.now() + 10 * 60 * 1000;
    await forgotUser.save();

    await transporter.sendMail({
      to: email,
      subject: "Your OTP",
      text: `Your OTP is ${forgotUser.otp}. It expires in 10 minutes.`,
    });

    res.status(200).send({ message: "OTP sent" , OTP : forgotUser.otp});
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const resetPassword = async (req , res) => {
  try {
    const { otp, newPassword } = req.body;
    if (!otp || !newPassword) {
      return res.status(400).send({ message: "OTP and new password are required" });
    }

    const resetUser = await findUserByOtp(otp);
    if (!resetUser) return res.status(400).send({ message: "Invalid or expired OTP" });

    resetUser.password = await bcrypt.hash(newPassword, 10);
    await clearOtpFields(resetUser);

    res.status(200).send({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports = { RegisterUser, LoginUser , forgotPassword , resetPassword };
