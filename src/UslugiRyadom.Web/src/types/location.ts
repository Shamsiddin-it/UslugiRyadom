export interface City {
  id: number;
  name: string;
}

export interface District {
  id: number;
  cityId: number;
  name: string;
}
