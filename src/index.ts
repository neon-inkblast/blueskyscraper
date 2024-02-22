import axios from "axios";
import { competitors } from "./competitors";
import { processFile } from "./readInput";
import { JSONData, writeOutput } from "./writeOutput";
import { AllianzQuote } from "./competitors/allianz/types";

export const countryCodeMap : Record<string, string> = {
  'Indonesia': 'IDN',
  'Philippines': 'PHL',
  'Turkey' : 'TUR',
  'United Arab Emirates' : 'ARE',
  'Sri Lanka' : 'LKA',
  'USA' : 'USA',
  'France' : 'FRA'
}

export const extractQuoteInfo = (record: any) => {
  const curDate = new Date()
  const leadTime = record[5]
  const duration = record[4]
  const startDate = new Date(curDate.getTime() + (leadTime * 24 * 60 * 60 * 1000));
  const endDate = new Date(startDate.getTime() + (duration * 24 * 60 * 60 * 1000));
  const ageOfAdults = [record[1], record[2]]
  const destinationIds = countryCodeMap[record[3]];
  const quoteInfo = {
    startDate,
    endDate,
    ageOfAdults,
    destinationIds
  }
  console.log(quoteInfo)
   
  return quoteInfo;
}



/*
{
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
    }

    */

const scrape = async () => {
  const records = await processFile();

  let output = {};

  let first = true;
  let requestedCompetitors : any = [];
  let compAdd = false;

  // console.log(records[0]);

  records[0].forEach((record) => {
    if(compAdd){
      requestedCompetitors.push(record);
    }
    if(record == "Timestamp (issue date)"){
      compAdd = true;
    }
  });

    console.log("requestedCompetitors");
    console.log(requestedCompetitors);

    console.log("competitors");
    console.log(competitors);


    requestedCompetitors.forEach(function(request){
      if(!!competitors[request]){
        competitors[request].requestor();
      }
    })




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

scrape();
