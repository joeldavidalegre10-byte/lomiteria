export interface AuthUser {
  name: string;
  role: 'admin' | 'user';
}

export interface Modifier {
  name: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  emoji: string;
  popular?: boolean;
  modifiers?: Modifier[];
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  modifiers?: string[];
}

export type OrderType = 'mesa' | 'delivery';
export type PaymentMethod = 'efectivo' | 'tarjeta' | 'transferencia';

export interface ActiveOrder {
  id: string;
  items: CartItem[];
  orderType: OrderType;
  tableNumber?: number;
  deliveryNumber?: number;
  subtotal: number;
  iva: number;
  total: number;
  timestamp: string;
}

export interface Sale extends ActiveOrder {
  paymentMethod: PaymentMethod;
  completedAt: string;
  cashReceived?: number;
  change?: number;
}