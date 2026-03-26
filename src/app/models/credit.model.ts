export interface Credit {
  credit_id: number;
  client_id: number;
  client_name: string;
  sale_id: number;
  date: string;
  concept: string;
  original_balance: string | number;
  total_paid: string | number;
  remaining: string | number;
  paid: boolean;
}

export interface CreditPayment {
  payment_id: number;
  credit_id: number;
  date: string;
  amount: number | string;
}

export interface AddPaymentRequest {
  amount: number;
}
