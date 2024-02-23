//import { extractQuoteInfo } from "../..";
import { start } from "repl";
import { QuoteRecord } from "../../types";
import { getCompetitorPrices } from "../allianz/APIRequest";
//import { AllianzQuote } from "./types";

export const IMG = {
  requiresAuth: false,
  requiresQuoteHeader: true,
  requestor: async function (records, updateProgress) {
    return await getCompetitorPrices(records, updateProgress);
  },
  endpoints: {
    auth: {
      url: "",
      body: {
        clientType: "",
        clientId: 0,
        brandCode: "",
        providerCode: "",
      },
      method: "POST",
    },
    quote: {
      url: "https://beta-services.imglobal.com/API/quotes",
      body: JSON.stringify({}),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer hTgGFoifdF5TCn3-5Lp2lst0QSqF5wVhiO7PrFyuRaVxmU4RKYZumj7bbdKl7PuGHSe88wqXvueeIe9Re3FUGyQIGLqfJONL7W52-xZiKBsbtb39KbN89whAlf6JbDf90jP6VxPfL3ai1UPI18WCZjpPNtUmao4j4imN-yvKReTd06t-0zPRXJLob8ZtP7AzonGz3gEs7EmvUJfb6HU2-GSiom602pu3rZ333mIMsXYgtshde-2K9H5yohs527dgmX1rWwaOxC82LuT7iXruDZEVSE7cjsFX84EKCj3LQfhjpDO-'
      },
      method: "POST",
    },
  },
  authTokenAdapter: imgAuthAdapter,
  inputAdapter: imgQuoteInputAdapter,
  quoteAdapter: imgQuoteOutputAdapter,
};

export const countryCodeMap: Record<string, string> = {
  Indonesia: "IDN",
  Philippines: "PHL",
  Turkey: "TUR",
  "United Arab Emirates": "ARE",
  "Sri Lanka": "LKA",
  USA: "USA",
  France: "FRA",
};
  
function imgAuthAdapter(input: any) {
    return input.data.properties.accessToken;
  }

function imgQuoteInputAdapter(record: any) {

    const curDate = new Date();
    const leadTime = record.leadDays;
    const duration = record.duration;
    const startDate = new Date(curDate.getTime() + leadTime * 24 * 60 * 60 * 1000);
    const endDate = new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000);
    const birthDay1 = new Date(curDate.getTime() - record.travellerAge1 * 365.25 * 24 * 60 * 60 * 1000);
    const birthDay2 = new Date(curDate.getTime() - record.travellerAge2 * 365.25 * 24 * 60 * 60 * 1000);
    
    console.log(birthDay1);
    return {
      "producerNumber": "182036",
      "productCode": "TCSE2",
      "appType": "0621",
      "travelInfo": {
          "startDate": startDate,
          "endDate": endDate,
          "destinations": [
            countryCodeMap[record.destination],
          ]
      },
      "residencyCountry": "USA",
      "residencyState": "CT",
      "policyInfo": {
          "currencyCode": "USD",
          "paymentFrequency": "Monthly"
      },
      "riders": [],
      "families": [
          {
              "insureds": [
                  {
                      "firstName": null,
                      "lastName": null,
                      "dateOfBirth": birthDay1,
                      "citizenship": "USA",
                      "residence": "USA",
                      "gender": "Male",
                      "travelerType": 1,
                      "age": record.travellerAge1,
                      "tripCost": 2500,
                      "riders": [],
                      "productOptions": []
                  }
              ]
          },
          {
              "insureds": [
                  {
                      "firstName": null,
                      "lastName": null,
                      "dateOfBirth": birthDay2,
                      "citizenship": "USA",
                      "residence": "USA",
                      "gender": "Female",
                      "travelerType": 1,
                      "age": record.travellerAge2,
                      "tripCost": 2500,
                      "riders": [],
                      "productOptions": []
                  }
              ]
          }
      ]
  };
}

function imgQuoteOutputAdapter(input: any) {

    return [ {price: input.totalPremium, plan: ''} ];
  }

