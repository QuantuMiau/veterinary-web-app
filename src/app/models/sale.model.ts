export interface Sale {
  sale_id: number;
  employee_id: number;
  employee_name: string;
  date: string;
  amount: string | number;
  payment_method: 'Efectivo' | 'Credito' | 'Transferencia' | 'Stripe';
}

export interface SaleDetailItem {
  sale_id: number;
  employee_id: number;
  employee_name: string;
  date: string;
  amount: string;
  payment_method: string;
  sale_detail_id: number;
  concept_id: number;
  concept_name: string;
  quantity: number;
  price: string;
  subtotal: string;
}

export interface SaleItem {
  concept_id: number;
  quantity: number;
  price: number | string;
  name?: string;
}

export interface CreateSaleRequest {
  clientId?: number;
  paymentMethod: 'Efectivo' | 'Credito';
  items: SaleItem[];
}
