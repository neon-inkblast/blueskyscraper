import { parse } from "json2csv";
import fs from "fs";
import { QuoteRecord } from "./types";

// Example usage
const exampleData: QuoteRecord[] = [
  {
    id: 19,
    plan: "Comprehensive",
    travellerAge1: 22,
    travellerAge2: 24,
    duration: 30,
    destination: "Indonesia",
    timestamp: 1234125415,
    leadDays: 10,
    excess: 0,
    cancellationCover: 10000,
    IMG: 200,
    SafetyWing: 200,
    Allianz: 200,
    Battleface: 200,
    TravelGuard: 200,
  },
  {
    id: 20,
    plan: "Comprehensive",
    travellerAge1: 22,
    travellerAge2: 24,
    duration: 30,
    destination: "Indonesia",
    timestamp: 1234125415,
    leadDays: 10,
    excess: 0,
    cancellationCover: 5000,
    IMG: 300,
    SafetyWing: 300,
    Allianz: 300,
    Battleface: 300,
    TravelGuard: 300,
  },
  {
    id: 21,
    plan: "Comprehensive",
    travellerAge1: 22,
    travellerAge2: 24,
    duration: 30,
    destination: "Indonesia",
    timestamp: 1234125415,
    leadDays: 10,
    excess: 0,
    cancellationCover: 5000,
    IMG: 150,
    SafetyWing: 150,
    Allianz: 150,
    Battleface: 150,
    TravelGuard: 150,
  },
];

export const writeOutput = async (input: QuoteRecord[] = exampleData) => {
  try {
    const csv = parse(input);
    await fs.writeFileSync("src/output/output.csv", csv);
    console.log("CSV file successfully created");
  } catch (err) {
    console.error("Error converting JSON to CSV:", err);
  }
};
