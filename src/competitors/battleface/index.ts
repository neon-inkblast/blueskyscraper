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

type DiscountRequest = {
  start_date: string;
  end_date: string;
  deductibles: { excess_fee: number };
  destinations: string[];
  deposit_date: string;
  discounts: { percentage: number };
  host_country: string;
  host_country_state: string;
  packages: {
    id: number;
    levels?: { id: number }[];
    conditions?: { start_date: string; end_date: string }[];
  }[];
  product: string;
  affliate: number;
  applicants: Applicant[];
  currency: string;
};

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

const getDestinationCountry = async (countryCode: string) => {
  const destinationCountries =
    await axios.get<ApiResponse<DestinationCountry[]>>(destinationCountriesUrl);
  return destinationCountries.data.data.find((dc) => dc.code === countryCode);
};

const getHostCountryAndProvince = async (countryCode: string, provinceCode: string) => {
  const hostCountries = await axios.get<ApiResponse<HostCountry[]>>(hostCountriesUrl);

  const country = hostCountries.data.data.find((hc) => hc.code === countryCode);

  const province = country?.states.find((province) => province.code === provinceCode);

  return { country, province };
};

const getPackages = async (
  productId: number,
  hostCountryId: number,
  hostCountryStateId: number,
) => {
  const packages = await axios.get<ApiResponse<Package[]>>(
    packagesUrl(productId, hostCountryId, hostCountryStateId),
  );

  return packages.data;
};

const getQuote = (
  countryCode: string,
  provinceCode: string,
  destinationCountries: string[],
  startDate: string,
  endDate: string,
  applicants: Applicant[],
) => {
  // TODO: cache countries

  const destinationCountry = await getDestinationCountry(countryCode);
  const { country, province } = await getHostCountryAndProvince(countryCode, provinceCode);
  if (!country || !province) throw new Error("Couldnt get country or province");
  const packages = await getPackages(1001, country?.id, province?.id);

  return {
    affliate: 1,
    host_country: countryCode,
    host_country_state: provinceCode,
    start_date: startDate,
    deductibles: { excess_fee: 100 },
    end_date: endDate,
    destinations: destinationCountries,
    currency: "AUD",
    applicants,
    deposit_date: new Date().toISOString().slice(0, 10),
    packages: packages.data.map((p) => ({ id: p.id })),
  } satisfies DiscountRequest;
};

const exampleRequest = async () => {
  const examplePayload = {
    start_date: "2024-03-21",
    end_date: "2024-04-25",
    deposit_date: "2024-02-22",
    applicants: [{ is_main: true, dob: "1995-01-01", trip_cost: 0 }],
    affiliate: 1,
    product: "1001",
    host_country: "AU",
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
  } satisfies DiscountRequest;

  return axios.post<ApiResponse<DiscountResponse>>(quoteDetailsDiscountsUrl, {
    data: examplePayload,
  });
};
