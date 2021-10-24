const fs = require("fs");
const path = require("path");
const json2csv = require("json2csv").parse;

const appendDataToCSV = async (data, columnNames, fileName = "parts.csv") => {
  if (!data || data.length === 0) {
    return;
  }
  try {
    const filePath = path.join(__dirname, fileName);
    fs.stat(filePath, function (err) {
      if (err) {
        fs.writeFile(filePath, columnNames + "\r\n", function (err) {
          if (err) {
            throw err;
          }
        });
      }
      fs.appendFile(
        filePath,
        json2csv(data, { fields: columnNames, header: false, quote: "" }),
        function (err) {
          if (err) {
            throw err;
          }
        }
      );
      fs.appendFile(filePath, "\n", (err) => {
        if (!err) {
          console.log(`${data.length} new entities have been written.`);
        }
      });
    });
  } catch (err) {
    console.error("appendDataToCSV: ", err);
  }
};

module.exports = { appendDataToCSV };
