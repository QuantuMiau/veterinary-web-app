export interface Product {
  concept_id?: number;
  product_id: string;
  name: string;
  description?: string;
  cost?: number | string;
  price: number | string;
  stock: number;
  category?: string;
  subcategory?: string;
  image_url?: string;
  active?: boolean;
  category_id?: number;
  subcategory_id?: number;
  category_name?: string;
  subcategory_name?: string;
}
