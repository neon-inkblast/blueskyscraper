import axios from "axios";
import { competitors } from "./competitors";
import { processFile } from "./readInput";
import { JSONData, writeOutput } from "./writeOutput";
import { AllianzQuote } from "./competitors/allianz/types";

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

const scrape = async () => {
  const records = await processFile();
  await getCompetitorPrices(records);
  await writeOutput(jsonData);
};

const defaultHeaders = {
  "Content-Type": "application/json",
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
};
async function getCompetitorPrices(records: any[]) {
  const competitorScrapePromises = Object.entries(competitors).map(async ([k, v]) => {
    console.log("processing competitor: ", k);
    if (v.requiresAuth) {
      let token: string;
      try {
        const authResult = await axios.post(v.endpoints.auth.url, v.endpoints.auth.body, {
          headers: { ...defaultHeaders },
        });
        token = v.authTokenAdapter(authResult);
      } catch (e) {
        console.error("auth error:", e);
        throw e;
      }

      if (!token) {
        throw Error("Missing auth token!");
      }

      // uncomment this loop to run once for each record instead of just once with dummy data
      // records.forEach(async (record: any) => {
      try {
        const quoteRequestBody = v.inputAdapter({});
        const quote = await axios.post(v.endpoints.quote.url, quoteRequestBody, {
          headers: { ...defaultHeaders, Authorization: `Bearer ${token}` },
        });
        const prices = v.quoteAdapter(quote.data as AllianzQuote);
        console.log(prices);
      } catch (e) {
        console.error("quote error:", e, "for record", records);
      }
      // });
    }
  });
  await Promise.allSettled(competitorScrapePromises);
}

scrape();
