export interface QuoteRecord {
  id: number;
  plan: string;
  travellerAge1: number;
  travellerAge2: number;
  destination: string;
  duration: number;
  leadDays: number;
  excess: string | number;
  cancellationCover: string | number;
  timestamp: string | number;
  IMG: string | number;
  SafetyWing: string | number;
  Allianz: string | number;
  Battleface: string | number;
  TravelGuard: string | number;
}
