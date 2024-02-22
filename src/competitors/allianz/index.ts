import { AllianzQuote } from "./types";
import { extractQuoteInfo } from "../..";

export const ALLIANZ = {
  requiresAuth: true,
  requestor: function(){
    console.log("ha");
    getCompetitorPrices();
  },
  endpoints: {
    auth: {
      url: "https://allianzassistancetravel.com.au/onex/api/Application/Authenticate",
      body: {
        clientType: "B2CWS",
        clientId: 304,
        brandCode: "ALZC",
        providerCode: "PSXALIAU",
      },
      method: "POST",
    },
    quote: {
      url: "https://allianzassistancetravel.com.au/onex/api/quick-quote/travel",
      body: JSON.stringify({
        destinationIds: ["DEU", "ESP"],
        startDate: "2024-02-24",
        endDate: "2024-02-26",
        ageOfAdults: [22, 24],
        ageOfDependants: [],
        answeredQuestions: [{ id: "RESID", answer: { id: "Y" } }],
      }),
      method: "POST",
    },
  },
  authTokenAdapter: allianzAuthAdapter,
  inputAdapter: allianzQuoteInputAdapter,
  quoteAdapter: allianzQuoteOutputAdapter,
};

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