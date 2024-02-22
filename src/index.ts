import { competitors } from "./competitors";
import { processFile } from "./readInput";
import { writeOutput } from "./writeOutput";

const scrape = async () => {
  const rawRecords = await processFile();

  let requestedCompetitors: any = [];
  let compAdd = false;

  const headerRow = rawRecords[0];
  const records = rawRecords.slice(1);

  headerRow.forEach((record, idx) => {
    if (compAdd) {
      requestedCompetitors.push([record, idx]);
    }
    if (record == "Timestamp (issue date)") {
      compAdd = true;
    }
  });

  const prms = requestedCompetitors.map(async function ([competitor, colIndex]) {
    if (competitors[competitor]) {
      let out = await competitors[competitor].requestor(records);
      console.log("pit", out);
      return { ...out, colIndex };
    }
    return null;
  });

  let results = await Promise.all(prms);
  results = results.filter((r) => r != null);
  console.log("mr");
  results.forEach((r) => {
    console.log(r);
  });
  await writeOutput();
};

scrape();
