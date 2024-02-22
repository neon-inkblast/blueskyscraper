import { QuoteRecord } from "../../types";
import { getCompetitorPrices } from "./APIRequest";
import { AllianzQuote } from "./types";

export const countryCodeMap: Record<string, string> = {
  Indonesia: "IDN",
  Philippines: "PHL",
  Turkey: "TUR",
  "United Arab Emirates": "ARE",
  "Sri Lanka": "LKA",
  USA: "USA",
  France: "FRA",
};

export const ALLIANZ = {
  requiresAuth: true,
  requiresQuoteHeader: false,
  requestor: async function (records) {
    return await getCompetitorPrices(records);
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

function allianzQuoteInputAdapter(record: QuoteRecord) {
  // convert CSV row to Allianz quote input
  const curDate = new Date();
  const leadTime = record.leadDays;
  const duration = record.duration;
  const startDate = new Date(curDate.getTime() + leadTime * 24 * 60 * 60 * 1000);
  const endDate = new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000);

  return {
    destinationIds: [countryCodeMap[record.destination]],
    startDate,
    endDate,
    ageOfAdults: [record.travellerAge1, record.travellerAge2].filter((age) => age != null),
    ageOfDependants: [],
    answeredQuestions: [{ id: "RESID", answer: { id: "Y" } }],
  };
}

function allianzQuoteOutputAdapter(input: AllianzQuote) {
  return input.entities[0].entities.map((entity) => {
    const price = entity.properties.price.sellingPrice;
    const plan = entity.properties.planName;
    return { price, plan };
  });
}
