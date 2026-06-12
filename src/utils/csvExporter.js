const { Parser } = require("json2csv");

/**
 * Converts transactions to CSV format
 */
exports.exportToCSV = (data) => {
  const fields = ["type", "amount", "category", "createdAt"];
  const parser = new Parser({ fields });
  return parser.parse(data);
};