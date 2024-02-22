import axios from "axios";
import { competitors } from "./competitors";
import { processFile } from "./readInput";
import { writeOutput } from "./writeOutput";
import { AllianzQuote } from "./competitors/allianz/types";

const scrape = async () => {
  const records = await processFile();
  await getCompetitorPrices(records);
  await writeOutput();
};

const defaultHeaders = {
  "Content-Type": "application/json",
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
};

async function getCompetitorPrices(records: any[]) {
  const competitorScrapePromises = Object.entries(competitors).map(async ([k, v]) => {
    console.log("processing competitor: ", k);
    let quoteHeaders: Record<string, string> = { ...defaultHeaders };
    if (v.requiresAuth) {
      let token: string;
      try {
        const authResult = await axios.post(v.endpoints.auth.url, v.endpoints.auth.body, {
          headers: { ...defaultHeaders },
        });
        token = v.authTokenAdapter(authResult);

        if (!token) {
          throw Error("Missing auth token!");
        }

        quoteHeaders = { ...quoteHeaders, Authorization: `Bearer ${token}` };
      } catch (e) {
        console.error("auth error:", e);
        throw e;
      }
    }

    // remove slice from this loop to run once for each record instead of just one row
    const quotePromises = records.slice(1, 2).map(async (record: any) => {
      try {
        const quoteRequestBody = v.inputAdapter(record);
        const quote = await axios.post(v.endpoints.quote.url, quoteRequestBody, {
          headers: quoteHeaders,
        });
        const prices = v.quoteAdapter(quote.data as AllianzQuote);
        console.log(prices);
      } catch (e) {
        console.error("quote error:", e, "for record", record);
      }
    });
    await Promise.allSettled(quotePromises);
  });
  await Promise.allSettled(competitorScrapePromises);
}

scrape();
