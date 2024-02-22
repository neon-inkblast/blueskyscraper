import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse";
// Note, the `stream/promises` module is only available
// starting with Node.js version 16
import { finished } from "stream/promises";

const inputPath = path.join(__dirname, "input", "input.csv");
const processFile = async () => {
  const records: any[] = [];
  const parser = fs.createReadStream(inputPath).pipe(
    parse({
      // CSV options if any
    }),
  );
  parser.on("readable", function () {
    let record;
    while ((record = parser.read()) !== null) {
      // Work with each record
      records.push(record);
    }
  });
  await finished(parser);
  console.log(records);
  return records;
};
// Parse the CSV content
processFile();
