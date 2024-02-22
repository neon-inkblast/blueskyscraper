import axios from "axios";

type DestinationCountry = { id: number; code: string; name: string; is_disabled: boolean };
type HostState = {
  id: number;
  /**
   * ISO 3166-2 Subdivision code
   */
  code: string;
  name: string;
  is_disabled: number;
};
type HostCountry = {
  id: number;
  /**
   * ISO 3166-2 Country code
   */
  code: string;
  name: string;
  states: HostState[];
};

type Package = {
  alias: string;
  attributes: unknown[];
  coverages: unknown[];
  id: number;
  levels: Level[];
  name: string;
  validations: unknown[];
};

type Applicant = { is_main: boolean; dob: string; trip_cost: number };

type DiscountRequest = { affliate: number; applications: Applicant[]; currency: string };

type Level = { amount: number; detail: string; id: number; level_id: number };

type DiscountRate = { amount: number; name: string; package_id: number; levels: Level[] };

type DiscountResponse = {
  discounts: { discount: number; total: number; total_discounted: number };
  rates: DiscountRate[];
};

type ApiResponse<T> = { data: T };

// TODO: find out what a product id means
const productId = 1001;
const destinationCountriesUrl = `https://gateway.battleface.com/api/affiliate/product/${productId}/destination-countries`;
const hostCountriesUrl = `https://gateway.battleface.com/api/product/${productId}/host-countries`;
const packagesUrl = (productId: number, hostCountryId: number, hostCountryStateId: number) =>
  `https://gateway.battleface.com/api/product/${productId}/host-country/${hostCountryId}/host-country-state/${hostCountryStateId}/packages`;
const quoteDetailsDiscountsUrl = "https://gateway.battleface.com/api/quote/details/discounts";

const destinationCountries = async () => { };

const exampleRequest = async () => {
  const examplePayload = {
    start_date: "2024-03-21",
    end_date: "2024-04-25",
    deposit_date: "2024-02-22",
    applicants: [{ is_main: true, dob: "1995-01-01", trip_cost: 0 }],
    affiliate: 1,
    product: "1001",
    host_country: "AU",
    https://gateway.battleface.com/api/quote/details/discounts
      host_country_state: "NSW",
    currency: "AUD",
    destinations: ["LA"],
    packages: [
      { id: 8140, levels: [{ id: 17433 }] },
      { id: 8141, levels: [{ id: 17438 }] },
      { id: 8142, levels: [{ id: 17446 }] },
      { id: 8143, levels: [{ id: 17447 }] },
      { id: 8144, levels: [{ id: 17448 }] },
      { id: 8145, levels: [{ id: 17450 }] },
      { id: 8146, conditions: [{ start_date: "2024-03-21", end_date: "2024-04-25" }] },
      { id: 8147, levels: [{ id: 17823 }] },
      { id: 8148, levels: [{ id: 17824 }] },
      { id: 8149, levels: [{ id: 17825 }] },
      { id: 8150, levels: [{ id: 17826 }] },
    ],
    deductibles: { excess_fee: 100 },
    discounts: { percentage: 0 },
  };

  return axios.post<ApiResponse<DiscountResponse>>(quoteDetailsDiscountsUrl, {
    data: examplePayload,
  });
};
