import { competitors } from "./competitors";
import { getCompetitorPrices } from "./competitors/allianz/APIRequest";
import { processFile } from "./readInput";
import { QuoteRecord } from "./types";
import { writeOutput } from "./writeOutput";

export const scrape = async () => {
  const rawRecords = await processFile();

  const headerRow = rawRecords[0];
  const records = rawRecords.slice(1);

  let results = await getCompetitorPrices(records);
  results.forEach((r) => {
    console.log("setting prices for:", r[0]);
    // console.log(JSON.stringify(r, null, 2));
    switch (r[0]) {
      case "ALLIANZ": {
        setAllianzPrices(records, r[1]);
        break;
      }
      default: {
        console.warn("competitor field not matched");
      }
    }
  });

  await writeOutput(records);
};

function setAllianzPrices(records: QuoteRecord[], results) {
  console.log(results);
  results.forEach((result) => {
    const id = result.recordId;
    const price = result.prices[0].price;
    records[id].Allianz = price;
  });
}
