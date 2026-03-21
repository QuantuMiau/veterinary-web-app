export interface Order {
  full_name: string;
  order_id: number;
  date: string;
  total: string;
  order_status: string;
  image_url: string;
  payment_method?: string;
}

export interface OrderDetail {
  order_id: number;
  user_id: number;
  full_name: string;
  date: string;
  order_status: string;
  payment_method: string;
  order_detail_id: number;
  concept_id: number;
  product_id: string;
  product_name: string;
  product_price: string;
  quantity: number;
  line_total: string;
  order_total: string;
  image_url: string;
}
