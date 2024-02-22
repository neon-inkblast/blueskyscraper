import axios from "axios";
import { AllianzQuote } from "./types";
import { competitors } from "../../competitors";
import { QuoteRecord } from "../../types";

const defaultHeaders = {
  "Content-Type": "application/json",
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
};

export async function getCompetitorPrices(records: QuoteRecord[]) {
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

    // records = records.slice(0,1);
    records = records.slice(0, 1);

    // remove slice from this loop to run once for each record instead of just one row
    const quotePromises = records.map(async (record: QuoteRecord) => {
      console.log("processing record: ", record.id);
      try {
        const quoteRequestBody = v.inputAdapter(record);
        const quote = await axios.post(v.endpoints.quote.url, quoteRequestBody, {
          headers: quoteHeaders,
        });
        const prices = v.quoteAdapter(quote.data as AllianzQuote);
        return { prices, recordId: record.id };
      } catch (e) {
        console.error("quote error:", e, "for record", records);
      }
    });
    const results = await Promise.all(quotePromises);
    return { [k]: results };
  });
  const results = await Promise.all(competitorScrapePromises);
  return results;
}
