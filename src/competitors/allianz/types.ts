export interface AllianzRequest {
  destinationIds: string[];
  startDate: string;
  endDate: string;
  ageOfAdults: number[];
  ageOfDependants: number[];
  answeredQuestions: { id: string; answer: { id: string } }[];
}

export interface AllianzQuote {
  class: string[];
  properties: Properties;
  entities: Entity[];
  links: Link[];
  actions: Action[];
  rel: string[];
}

export interface Properties {
  disclaimers: Disclaimer[];
}

export interface Disclaimer {
  id: string;
  symbol: string;
  description: string;
}

export interface Entity {
  class: string[];
  entities: Entity2[];
  title: string;
  rel: string[];
}

export interface Entity2 {
  class: string[];
  properties: Properties2;
  entities: Entity3[];
  title: string;
  rel: string[];
}

export interface Properties2 {
  planId: number;
  planName: string;
  coverPeriod: CoverPeriod;
  isPreExistingCoverAvailable: boolean;
  isDefault: boolean;
  promoCode: any;
  price: Price;
  memberNumber: any;
}

export interface CoverPeriod {
  startDate: string;
  endDate: string;
  duration: number;
  durationType: string;
}

export interface Price {
  sellingPrice: number;
  totalPayable: number;
  discountPrice: number;
}

export interface Entity3 {
  class: string[];
  properties?: Properties3;
  rel: string[];
  entities?: Entity4[];
}

export interface Properties3 {
  id: string;
  name: string;
}

export interface Entity4 {
  class: string[];
  properties: Properties4;
  rel: string[];
}

export interface Properties4 {
  id?: string;
  groupId?: string;
  valueType?: string;
  indicativePrice?: number;
  travellerValidation?: TravellerValidation;
  caps?: Cap[];
  benefitScope: any;
  options?: Option[];
  isRequired?: boolean;
  eligibleTravellers?: EligibleTraveller[];
  validation?: Validation;
  amount?: number;
  value?: number;
  displayValue?: string;
  isDefault?: boolean;
  isUnlimited?: boolean;
  disclaimerIds?: string[];
}

export interface TravellerValidation {
  isRequired: boolean;
  isAdultOnly: boolean;
}

export interface Cap {
  id: string;
}

export interface Option {
  value: any;
  isDefault: boolean;
}

export interface EligibleTraveller {
  index: number;
}

export interface Validation {
  minAge: number;
  maxAge: number;
}

export interface Link {
  rel: string[];
  href: string;
}

export interface Action {
  name: string;
  class: string[];
  method: string;
  href: string;
  title: string;
  type: string;
  fields: Field[];
}

export interface Field {
  name: string;
  type: string;
  title: string;
  class?: string[];
}
