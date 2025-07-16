
const employeeServices = require("../Services/employeeServices");

const CreateEmployee = async (req, res) => {
  if (!req.body.name || !req.body.email) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const emailAlreadyExists = await employeeServices.emailExists(req.body.email);
  if (emailAlreadyExists) {
    return res.status(400).json({ message: "email already exists. Duplicate email" });
  }
  try {
    const newEmployee = await employeeServices.createEmployeeServices(req.body);
    res.status(201).json(newEmployee);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

module.exports = {CreateEmployee}