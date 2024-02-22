import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse";
// Note, the `stream/promises` module is only available
// starting with Node.js version 16
import { finished } from "stream/promises";
import { QuoteRecord } from "./types";

const inputPath = path.join(__dirname, "input", "input.csv");
export const processFile = async () => {
  const records: any[] = [];
  const parser = fs.createReadStream(inputPath).pipe(parse({}));
  parser.on("readable", function () {
    let record;
    let id = 0;
    while ((record = parser.read()) !== null) {
      const recordDAO = parseRecord(record, id++);
      records.push(recordDAO);
    }
  });
  await finished(parser);

  return records;
};

function parseRecord(record: any[], id) {
  const [
    plan,
    travellerAge1,
    travellerAge2,
    destination,
    duration,
    leadDays,
    excess,
    cancellationCover,
    timestamp,
    IMG,
    SafetyWing,
    Allianz,
    Battleface,
    TravelGuard,
  ] = record;

  const recordDAO: QuoteRecord = {
    id,
    plan,
    travellerAge1,
    travellerAge2,
    destination,
    duration,
    leadDays,
    excess,
    cancellationCover,
    timestamp,
    IMG,
    SafetyWing,
    Allianz,
    Battleface,
    TravelGuard,
  };
  return recordDAO;
}
