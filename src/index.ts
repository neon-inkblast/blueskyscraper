import { competitors } from "./competitors";
import { processFile } from "./readInput";
import { writeOutput } from "./writeOutput";

const scrape = async () => {
  const records = await processFile();

  let requestedCompetitors: any = [];
  let compAdd = false;

  records[0].forEach((record) => {
    if (compAdd) {
      requestedCompetitors.push(record);
    }
    if (record == "Timestamp (issue date)") {
      compAdd = true;
    }
  });

  const prms = requestedCompetitors.map(async function (request) {
    if (!!competitors[request]) {
      let out = await competitors[request].requestor(records);
      console.log("********** output gathered ***************");
      console.log(out);
    }
  });

  const results = Promise.allSettled(prms);
  console.log(results);

  await writeOutput();
};

scrape();
