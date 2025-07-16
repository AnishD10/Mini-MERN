const mailer = require("nodemailer")
const crypto = require("crypto")
const User = require('../Model/User')


const generateOtp = () => crypto.randomInt(100000, 999999).toString();

const findUserByOtp = async (otp) =>
  await User.findOne({ otp, otpExpires: { $gt: Date.now() } }).select("+password");

const clearOtpFields = async (resetUser) => {
  resetUser.otp = null;
  resetUser.otpExpires = null;
  await resetUser.save();
};


const transporter = mailer.createTransport({
  service: "gmail", // or smtp.mailtrap.io / SendGrid SMTP
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});


module.exports = { generateOtp, findUserByOtp, clearOtpFields , transporter };