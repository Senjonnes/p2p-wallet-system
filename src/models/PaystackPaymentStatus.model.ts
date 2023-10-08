export class PaystackPaymentStatus {
  id: number;
  domain: string;
  status: string;
  reference: string;
  amount: number;
  message: string;
  gateway_response: string;
  paid_at: Date;
  created_at: Date;
  channel: string;
  currency: string;
  ip_address: number;
  metaData: {
    referrer: string;
  };
  log: {
    start_time: number;
    time_spent: number;
    attempts: number;
    errors: number;
    success: boolean;
    mobile: boolean;
    history: History[];
  };
  authorization: {
    authorization_code: string;
    bin: string;
    last4: string;
    exp_month: string;
    exp_year: string;
    channel: string;
    card_type: string;
    bank: string;
    country_code: string;
    brand: string;
    reusable: boolean;
  };
  Customer: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    customer_code: string;
    phone: string;
    risk_action: string;
  };
  paidAt: Date;
  createdAt: Date;
  requested_amount: Date;
  fees_breakdown: FeesBreakdown[];
  transaction_date: Date;
}

class History {
  type: string;
  message: string;
  time: number;
}

class FeesBreakdown {
  amount: number;
  type: string;
}
