import type { ActiveOrder, CartItem } from '../types';

export interface ConsolidatedOrder {
  id: string; // ID de la primera orden
  orderType: 'mesa' | 'delivery';
  tableNumber?: number;
  deliveryNumber?: number;
  items: CartItem[];
  subtotal: number;
  iva: number;
  total: number;
  orderIds: string[]; // IDs de todas las órdenes consolidadas
  orderCount: number; // Cantidad de pedidos consolidados
  timestamp: string; // Timestamp de la orden más antigua
}

/**
 * Agrupa pedidos por mesa o número de delivery
 */
export function consolidateOrders(orders: ActiveOrder[]): ConsolidatedOrder[] {
  const grouped = new Map<string, ActiveOrder[]>();

  // Agrupar por identificador
  orders.forEach(order => {
    const key = order.orderType === 'mesa'
      ? `mesa-${order.tableNumber}`
      : `delivery-${order.deliveryNumber}`;

    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(order);
  });

  // Consolidar cada grupo
  const consolidated: ConsolidatedOrder[] = [];

  grouped.forEach(orderGroup => {
    // Ordenar por timestamp (más antiguo primero)
    const sortedOrders = orderGroup.sort((a, b) =>
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    const firstOrder = sortedOrders[0];

    // Combinar todos los items
    const allItems: CartItem[] = [];
    sortedOrders.forEach(order => {
      allItems.push(...order.items);
    });

    // Consolidar items duplicados
    const consolidatedItems = consolidateItems(allItems);

    // Calcular totales (sin IVA: precio exacto del producto)
    const subtotal = consolidatedItems.reduce((sum, item) =>
      sum + item.price * item.quantity, 0
    );
    const iva = 0;
    const total = subtotal;

    consolidated.push({
      id: firstOrder.id,
      orderType: firstOrder.orderType,
      tableNumber: firstOrder.tableNumber,
      deliveryNumber: firstOrder.deliveryNumber,
      items: consolidatedItems,
      subtotal,
      iva,
      total,
      orderIds: sortedOrders.map(o => o.id),
      orderCount: sortedOrders.length,
      timestamp: firstOrder.timestamp,
    });
  });

  return consolidated;
}

/**
 * Consolida items duplicados sumando cantidades
 */
function consolidateItems(items: CartItem[]): CartItem[] {
  const itemMap = new Map<string, CartItem>();

  items.forEach(item => {
    // Crear una key única basada en productId y modifiers
    const modifiersKey = item.modifiers?.sort().join(',') || '';
    const key = `${item.productId}-${modifiersKey}`;

    if (itemMap.has(key)) {
      // Sumar cantidad si ya existe
      const existing = itemMap.get(key)!;
      itemMap.set(key, {
        ...existing,
        quantity: existing.quantity + item.quantity,
      });
    } else {
      // Agregar nuevo item
      itemMap.set(key, { ...item });
    }
  });

  return Array.from(itemMap.values());
}

/**
 * Genera los datos de una prefactura para un pedido consolidado
 */
export interface PreInvoiceData {
  businessName: string;
  date: string;
  time: string;
  orderLabel: string;
  items: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
    modifiers?: string[];
  }>;
  subtotal: number;
  iva: number;
  total: number;
  orderCount: number;
}

export function generatePreInvoiceData(order: ConsolidatedOrder): PreInvoiceData {
  const now = new Date();
  const orderLabel = order.orderType === 'mesa'
    ? `Mesa ${order.tableNumber}`
    : `Pedido Delivery #${order.deliveryNumber}`;

  return {
    businessName: 'Lomitería',
    date: now.toLocaleDateString('es-PY', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }),
    time: now.toLocaleTimeString('es-PY', {
      hour: '2-digit',
      minute: '2-digit'
    }),
    orderLabel,
    items: order.items.map(item => ({
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.price,
      total: item.price * item.quantity,
      modifiers: item.modifiers,
    })),
    subtotal: order.subtotal,
    iva: order.iva,
    total: order.total,
    orderCount: order.orderCount,
  };
}