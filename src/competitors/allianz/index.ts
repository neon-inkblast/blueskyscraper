export const ALLIANZ = {
  requiresAuth: true,
  endpoints: {
    auth: {
      url: "https://allianzassistancetravel.com.au/onex/api/Application/Authenticate",
      body: JSON.stringify({
        clientType: "B2CWS",
        clientId: 304,
        brandCode: "ALZC",
        providerCode: "PSXALIAU",
      }),
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
};
