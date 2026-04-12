import { useState } from 'react';
import { X, Store, Truck } from 'lucide-react';
import type { CartItem, OrderType } from '../types';
import { formatPrice } from '../utils/currency';

interface CheckoutModalProps {
  items: CartItem[];
  orderType: OrderType;
  onConfirm: (tableNumber?: number) => void;
  onClose: () => void;
}

export function CheckoutModal({ items, orderType, onConfirm, onClose }: CheckoutModalProps) {
  const [tableNumber, setTableNumber] = useState<number>(1);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal; // Sin IVA: precio exacto

  const handleConfirm = () => {
    onConfirm(orderType === 'mesa' ? tableNumber : undefined);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#111111] rounded-2xl border border-[#1e1e1e] max-w-md w-full overflow-hidden flex flex-col shadow-2xl">
        <div className="p-6 border-b border-[#1a1a1a] flex items-center justify-between">
          <div className="flex items-center gap-3">
            {orderType === 'mesa' ? (
              <Store className="text-[#ff5722]" size={22} />
            ) : (
              <Truck className="text-[#3b82f6]" size={22} />
            )}
            <div>
              <h3 className="text-[#d0d0d0]">Asignar Pedido</h3>
              <p className="text-sm text-[#444]">
                {orderType === 'mesa' ? 'Seleccioná la mesa' : 'Pedido para Delivery'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#444] hover:text-[#d0d0d0] transition-colors">
            <X size={22} />
          </button>
        </div>

        {orderType === 'mesa' && (
          <div className="p-6">
            <label className="block text-xs text-[#444] uppercase tracking-wider mb-3">Número de Mesa</label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                <button
                  key={num}
                  onClick={() => setTableNumber(num)}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                    tableNumber === num
                      ? 'border-[#ff5722] bg-[#ff5722]/10 text-[#ff5722]'
                      : 'border-[#1a1a1a] text-[#444] hover:border-[#252525] hover:text-[#d0d0d0] bg-[#0d0d0d]'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-[10px] text-[#555] mb-0.5">Mesa</div>
                    <div className="text-base">{num}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="p-6 bg-[#0d0d0d] border-t border-[#1a1a1a]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[#444] text-sm">Total del Pedido</span>
            <span className="text-[#ff5722] text-2xl">{formatPrice(total)}</span>
          </div>
          <p className="text-xs text-[#333]">
            El pedido quedará en "{orderType === 'mesa' ? 'Mesas' : 'Delivery'}" hasta confirmar el pago
          </p>
        </div>

        <div className="p-5 border-t border-[#1a1a1a] flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-[#161616] hover:bg-[#1e1e1e] text-[#555] hover:text-[#d0d0d0] py-3 rounded-xl transition-colors text-sm border border-[#1e1e1e]"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className={`flex-1 text-white py-3 rounded-xl transition-all duration-200 shadow-lg text-sm ${
              orderType === 'mesa'
                ? 'bg-[#ff5722] hover:bg-[#e64a19] shadow-[#ff5722]/25'
                : 'bg-[#3b82f6] hover:bg-[#2563eb] shadow-[#3b82f6]/25'
            }`}
          >
            Asignar {orderType === 'mesa' ? `Mesa ${tableNumber}` : 'Delivery'}
          </button>
        </div>
      </div>
    </div>
  );
}