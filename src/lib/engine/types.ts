export type OrderSide = 'yes' | 'no';
export type OrderType = 'limit' | 'market';
export type OrderStatus = 'open' | 'filled' | 'partial' | 'cancelled';
export type MarketStatus = 'open' | 'resolved_yes' | 'resolved_no' | 'cancelled';

export interface Order {
  id: string;
  user_id: string;
  market_id: string;
  side: OrderSide;
  type: OrderType;
  price: number;
  quantity: number;
  filled_quantity: number;
  status: OrderStatus;
  created_at: string;
}

export interface Trade {
  id: string;
  market_id: string;
  buyer_order_id: string;
  seller_order_id: string;
  price: number;
  quantity: number;
  created_at: string;
}

export interface Market {
  id: string;
  title: string;
  description: string;
  category: string;
  resolution_source: string;
  resolution_date: string;
  status: MarketStatus;
  yes_price: number;
  no_price: number;
  volume: number;
  created_at: string;
}

export interface Position {
  id: string;
  user_id: string;
  market_id: string;
  side: OrderSide;
  shares: number;
  avg_price: number;
  realized_pnl: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  balance: number;
  created_at: string;
}

export interface BookLevel {
  price: number;
  quantity: number;
  orders: Order[];
}

export interface MatchResult {
  trades: Trade[];
  updatedOrders: Order[];
}

export interface PlaceOrderResult {
  order: Order;
  trades: Trade[];
  error?: string;
}
