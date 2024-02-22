import axios from "axios";
import { AllianzQuote } from "./types";
import { extractQuoteInfo } from "../..";
import { competitors } from "../../competitors";


const defaultHeaders = {
  "Content-Type": "application/json",
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
};
export async function getCompetitorPrices(records: any[]) {

  const competitorScrapePromises = Object.entries(competitors).map(async ([k, v]) => {
    console.log("processing competitor: ", k);
    if (v.requiresAuth) {
      let token: string;
      try {

      	console.log("**************");
      	console.log(v.endpoints);
      	console.log("**************");

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
      records.forEach(async (record: any) => {
      try {
        const quoteRequestBody = v.inputAdapter(record);
        const quote = await axios.post(v.endpoints.quote.url, quoteRequestBody, {
          headers: { ...defaultHeaders, Authorization: `Bearer ${token}` },
        });
        const prices = v.quoteAdapter(quote.data as AllianzQuote);
        console.log("prices");
        console.log(prices);
        Promise.resolve(prices);
      } catch (e) {
        console.error("quote error:", e, "for record", records);
      }
      });
    }
  });
  await Promise.allSettled(competitorScrapePromises).then(function(data){
  	console.log("..");
  	console.log(data);
  });
}



function allianzAuthAdapter(input: any) {
  return input.data.properties.accessToken;
}

function allianzQuoteInputAdapter(input: any) {
  const quoteInfo = extractQuoteInfo(input);
  return {
    destinationIds: [quoteInfo.destinationIds],
    startDate: quoteInfo.startDate,
    endDate: quoteInfo.endDate,
    ageOfAdults: quoteInfo.ageOfAdults,
    ageOfDependants: [],
    answeredQuestions: [{ id: "RESID", answer: { id: "Y" } }],
  };
}

function allianzQuoteOutputAdapter(input: AllianzQuote) {
  return input.entities[0].entities.map((entity) => {
    return entity.properties.price.sellingPrice;
  });
}



