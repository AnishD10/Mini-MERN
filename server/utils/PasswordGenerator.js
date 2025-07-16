const Math = require("math")

module.exports = () => {
  return Math.random().toString(36).slice(-8); // 8-char alphanumeric
};
