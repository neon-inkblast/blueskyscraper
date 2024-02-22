import { competitors } from "./competitors";
import { getCompetitorPrices } from "./competitors/allianz/APIRequest";
import { processFile } from "./readInput";
import { writeOutput } from "./writeOutput";

export const scrape = async () => {
  const rawRecords = await processFile();

  let requestedCompetitors: any = [];
  let compAdd = false;

  const headerRow = rawRecords[0];
  const records = rawRecords.slice(1);

  let results = await getCompetitorPrices(records);

  // results = results.filter((r) => r != null);
  console.log("mr");
  results.forEach((r) => {
    console.log(JSON.stringify(r));
  });
  await writeOutput();
};
