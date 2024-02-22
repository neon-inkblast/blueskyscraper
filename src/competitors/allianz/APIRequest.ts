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

    // only take top record for now
    records = records.slice(0, 1);

    // remove slice from this loop to run once for each record instead of just one row
    const quotePromises = records.map(async (record: QuoteRecord) => {
      console.log("processing record: ", record.id);
      try {
        const quoteRequestBody = v.inputAdapter(record);
        let realQuoteHeader : any;
        if (!v.requiresQuoteHeader) {
          realQuoteHeader = quoteHeaders;
        }
        else {
          realQuoteHeader = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer hTgGFoifdF5TCn3-5Lp2lst0QSqF5wVhiO7PrFyuRaVxmU4RKYZumj7bbdKl7PuGHSe88wqXvueeIe9Re3FUGyQIGLqfJONL7W52-xZiKBsbtb39KbN89whAlf6JbDf90jP6VxPfL3ai1UPI18WCZjpPNtUmao4j4imN-yvKReTd06t-0zPRXJLob8ZtP7AzonGz3gEs7EmvUJfb6HU2-GSiom602pu3rZ333mIMsXYgtshde-2K9H5yohs527dgmX1rWwaOxC82LuT7iXruDZEVSE7cjsFX84EKCj3LQfhjpDO-'
          };
        }
        const quote = await axios.post(v.endpoints.quote.url, quoteRequestBody, {
          headers: realQuoteHeader,
        });
        const prices = v.quoteAdapter(quote.data as AllianzQuote);
        return { prices, recordId: record.id };
      } catch (e) {
        console.error("quote error:", e, "for record", records);
      }
    });
    const results = await Promise.all(quotePromises);
    return [k, results];
  });
  const results = await Promise.all(competitorScrapePromises);

  return results;
}
