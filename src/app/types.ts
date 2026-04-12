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
  price: number;         // precio total (base + modificadores)
  basePrice: number;     // precio base del producto sin extras
  quantity: number;
  modifiers?: string[];
  modifierDetails?: { name: string; price: number }[];
}

export type OrderType = 'mesa' | 'delivery';
export type PaymentMethod = 'efectivo' | 'tarjeta' | 'transferencia' | 'mixto';

export interface MixedPayment {
  efectivo: number;
  tarjeta: number;
  transferencia: number;
}

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
  mixedPayment?: MixedPayment;
}