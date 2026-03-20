export interface Service {
  concept_id?: number;
  id?: number;
  name: string;
  cost?: number | string;
  price: number | string;
  duration: string;
  active?: boolean;
}
