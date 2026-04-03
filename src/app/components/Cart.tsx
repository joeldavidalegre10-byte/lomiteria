import { Minus, Plus, ShoppingCart, Trash2, Store, Truck, Receipt } from 'lucide-react';
import type { CartItem, OrderType, Sale } from '../types';
import { formatPrice } from '../utils/currency';

interface CartProps {
  items: CartItem[];
  orderType: OrderType;
  onOrderTypeChange: (type: OrderType) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
  lastSale?: Sale | null;
}

export function Cart({
  items,
  orderType,
  onOrderTypeChange,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  lastSale
}: CartProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const iva = subtotal * 0.21; // 21% IVA Argentina
  const total = subtotal + iva;

  return (
    <aside className="w-80 bg-[#0d0d0d] border-l border-[#161616] flex flex-col shrink-0">
      <div className="p-5 border-b border-[#161616]">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingCart className="text-[#ff5722]" size={20} />
          <h2 className="text-[#d0d0d0]">Pedido Actual</h2>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onOrderTypeChange('mesa')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 text-sm ${
              orderType === 'mesa'
                ? 'bg-[#ff5722] text-white shadow-lg shadow-[#ff5722]/25'
                : 'bg-[#111111] text-[#444] hover:text-[#d0d0d0] border border-[#1e1e1e]'
            }`}
          >
            <Store size={15} />
            <span>Mesa</span>
          </button>
          <button
            onClick={() => onOrderTypeChange('delivery')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 text-sm ${
              orderType === 'delivery'
                ? 'bg-[#3b82f6] text-white shadow-lg shadow-[#3b82f6]/25'
                : 'bg-[#111111] text-[#444] hover:text-[#d0d0d0] border border-[#1e1e1e]'
            }`}
          >
            <Truck size={15} />
            <span>Delivery</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <ShoppingCart className="text-[#1e1e1e] mb-4" size={56} />
            <p className="text-[#333] text-sm">Sin productos en el pedido</p>
            <p className="text-xs text-[#2a2a2a] mt-1">Seleccioná del menú</p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="bg-[#111111] rounded-xl p-3 border border-[#1a1a1a]">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[#d0d0d0] text-sm truncate">{item.name}</h4>
                    {item.modifiers && item.modifiers.length > 0 && (
                      <p className="text-xs text-[#444] mt-0.5 truncate">
                        {item.modifiers.join(', ')}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-[#333] hover:text-red-500 transition-colors ml-2 shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 bg-[#161616] rounded-lg p-1">
                    <button
                      onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                      className="text-[#555] hover:text-[#ff5722] transition-colors p-0.5"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="text-[#d0d0d0] text-sm w-5 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="text-[#555] hover:text-[#ff5722] transition-colors p-0.5"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                  <span className="text-[#ff5722] text-sm">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="border-t border-[#161616] p-4">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-xs">
              <span className="text-[#444]">Subtotal</span>
              <span className="text-[#d0d0d0]">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#444]">IVA (21%)</span>
              <span className="text-[#d0d0d0]">{formatPrice(iva)}</span>
            </div>
            <div className="flex justify-between border-t border-[#1a1a1a] pt-2">
              <span className="text-[#d0d0d0] text-sm">Total</span>
              <span className="text-[#ff5722]">{formatPrice(total)}</span>
            </div>
          </div>

          <button
            onClick={onCheckout}
            className="w-full bg-[#ff5722] hover:bg-[#e64a19] text-white py-3 rounded-xl transition-all duration-200 shadow-lg shadow-[#ff5722]/25 hover:shadow-[#ff5722]/35 text-sm"
          >
            Confirmar Pedido
          </button>
        </div>
      )}

      {/* Last Sale Summary */}
      {items.length === 0 && lastSale && (
        <div className="border-t border-[#161616] p-4">
          <div className="bg-green-500/8 border border-green-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Receipt className="text-green-400" size={16} />
              <span className="text-green-400 text-xs uppercase tracking-wider">Última Venta</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-[#888] text-sm">Total Cobrado</span>
                <span className="text-[#d0d0d0]">{formatPrice(lastSale.total)}</span>
              </div>
              {lastSale.paymentMethod === 'efectivo' && lastSale.change !== undefined && (
                <div className="flex justify-between border-t border-green-500/20 pt-2">
                  <span className="text-green-400 text-sm">Cambio</span>
                  <span className="text-green-400 text-lg">{formatPrice(lastSale.change)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}