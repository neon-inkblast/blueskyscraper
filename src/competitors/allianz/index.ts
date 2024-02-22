import axios from "axios";
import { AllianzQuote } from "./types";
import { extractQuoteInfo } from "../..";
import { competitors } from "../../competitors";
import { getCompetitorPrices } from "./APIRequest";



export const ALLIANZ = {
  requiresAuth: true,
  requestor: function(records){
    console.log("ha");
    // getCompetitorPrices(records);
    return getCompetitorPrices(records);
    // return {
    //   "yo":"yo"
    // }

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



