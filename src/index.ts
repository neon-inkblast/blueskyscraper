import { processFile } from "./readInput";
import { writeOutput } from "./writeOutput";

const scrape = async () => {
  const records = await processFile();
  records.forEach((record) => {
    console.log(record);
  });
  await writeOutput();
};

scrape();
