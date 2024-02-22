import { parse } from 'json2csv';
import fs from 'fs';

export interface JSONData {
  [key: string]: any;
}
export const writeOutput = async (input: JSONData[]) => {
  try {
    const csv = parse(input);
    await fs.writeFileSync('src/output/output.csv', csv);
    console.log('CSV file successfully created');
  } catch (err) {
    console.error('Error converting JSON to CSV:', err);
  }
};
