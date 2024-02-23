import { competitors } from "./competitors";
import { getCompetitorPrices } from "./competitors/allianz/APIRequest";
import { processFile } from "./readInput";
import { QuoteRecord } from "./types";
import { writeOutput } from "./writeOutput";

export const scrape = async (updateProgress: Function) => {
  const rawRecords = await processFile();

  const headerRow = rawRecords[0];
  const records = rawRecords.slice(1);

  let maxLength = records.length * Object.keys(competitors).length;
  console.log("maxLength:",maxLength);
  let completed = 1;

  let processed = function(){
    updateProgress(completed++/maxLength);
  }

  let results = await getCompetitorPrices(records,processed);
  results.forEach((r) => {
    console.log("setting prices for:", r[0]);
    // console.log(JSON.stringify(r, null, 2));
    switch (r[0]) {
      case "ALLIANZ": {
        setAllianzPrices(records, r[1]);
        break;
      }
      case "IMG": {
        setImgPrices(records, r[1]);
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
  results.forEach((result) => {
    if(result != null){
      const id = result.recordId;
      const price = result.prices[0].price;
      records[id-1].Allianz = price;
      console.log(result)
    }
  });
}

function setImgPrices(records: QuoteRecord[], results) {
  results.forEach((result) => {
    if(result != null){
      const id = result.recordId;
      const price = result.prices[0].price;
      records[id-1].IMG = price;
      console.log(result)
    }
  });
  //console.log(results);
}
