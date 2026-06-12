/**
 * Basic validation helper
 */

exports.isValidAmount = (amount) => {
  return typeof amount === "number" && amount > 0;
};

exports.isValidType = (type) => {
  return ["income", "expense"].includes(type);
};