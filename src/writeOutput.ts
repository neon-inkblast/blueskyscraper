import { parse } from "json2csv";
import fs from "fs";

export interface JSONData {
  [key: string]: any;
}

// Example usage
const jsonData: JSONData[] = [
  {
    duration: 30,
    leadDays: 10,
    excess: 0,
    cancellationCover: 10000,
    issueDate: "date",
    img: 200,
    safetyWing: 200,
    allianz: 200,
    battleface: 200,
    travelGuard: 200,
  },
  {
    duration: 30,
    leadDays: 10,
    excess: 100,
    cancellationCover: 5000,
    issueDate: "date",
    img: 300,
    safetyWing: 300,
    allianz: 300,
    battleface: 300,
    travelGuard: 300,
  },
  {
    duration: 30,
    leadDays: 10,
    excess: 150,
    cancellationCover: 20000,
    issueDate: "date",
    img: 150,
    safetyWing: 150,
    allianz: 150,
    battleface: 150,
    travelGuard: 150,
  },
];

export const writeOutput = async (input: JSONData[] = jsonData) => {
  try {
    const csv = parse(input);
    await fs.writeFileSync("src/output/output.csv", csv);
    console.log("CSV file successfully created");
  } catch (err) {
    console.error("Error converting JSON to CSV:", err);
  }
};
