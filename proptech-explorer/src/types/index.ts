export type BER_Rating = 'A1' | 'A2' | 'A3' | 'B1' | 'B2' | 'B3' | 'C1' | 'C2' | 'C3' | 'D1' | 'D2' | 'E1' | 'E2' | 'F' | 'G';

export interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqm: number;
  ber: string;
  latitude: number;
  longitude: number;
  images: string[];
}

export interface FilterState {
  minPrice: number | '';
  maxPrice: number | '';
  bedrooms: number | '';
  berRating: string;
}