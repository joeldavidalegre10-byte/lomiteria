import { useState, useEffect } from 'react';
import { X, Check, CreditCard, Smartphone, Banknote, UtensilsCrossed, Bike } from 'lucide-react';
import type { ActiveOrder, PaymentMethod } from '../types';
import { formatPrice } from '../utils/currency';

interface PaymentModalProps {
  order: ActiveOrder;
  onConfirm: (paymentMethod: PaymentMethod, cashReceived?: number, change?: number) => void;
  onClose: () => void;
}

export function PaymentModal({ order, onConfirm, onClose }: PaymentModalProps) {
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('efectivo');
  const [cashReceived, setCashReceived] = useState('');
  const [change, setChange] = useState(0);

  const isMesa = order.orderType === 'mesa';
  const orderLabel = isMesa ? `Mesa ${order.tableNumber}` : `Pedido ${order.deliveryNumber ?? ''}`;
  const OrderIcon = isMesa ? UtensilsCrossed : Bike;
  const iconColor = isMesa ? 'text-[#ff5722]' : 'text-[#3b82f6]';

  const paymentMethods = [
    { id: 'efectivo' as PaymentMethod, name: 'Efectivo', icon: Banknote, color: 'bg-green-500' },
    { id: 'tarjeta' as PaymentMethod, name: 'Tarjeta', icon: CreditCard, color: 'bg-blue-500' },
    { id: 'transferencia' as PaymentMethod, name: 'Transferencia', icon: Smartphone, color: 'bg-purple-500' },
  ];

  // Calculate change automatically when cash received changes
  useEffect(() => {
    if (selectedPayment === 'efectivo' && cashReceived) {
      const received = parseFloat(cashReceived);
      if (!isNaN(received) && received >= order.total) {
        setChange(received - order.total);
      } else {
        setChange(0);
      }
    } else {
      setChange(0);
    }
  }, [cashReceived, selectedPayment, order.total]);

  const handleConfirm = () => {
    if (selectedPayment === 'efectivo') {
      const received = parseFloat(cashReceived);
      if (!cashReceived || isNaN(received) || received < order.total) {
        alert(`El efectivo recibido debe ser mayor o igual a ${formatPrice(order.total)}`);
        return;
      }
      onConfirm(selectedPayment, received, change);
    } else {
      onConfirm(selectedPayment);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#111111] rounded-2xl border border-[#1e1e1e] max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="p-6 border-b border-[#1a1a1a] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isMesa ? 'bg-[#ff5722]/12 border border-[#ff5722]/20' : 'bg-[#3b82f6]/12 border border-[#3b82f6]/20'}`}>
              <OrderIcon size={20} className={iconColor} />
            </div>
            <div>
              <h3 className="text-[#d0d0d0]">Confirmar Venta</h3>
              <p className={`text-sm ${iconColor}`}>{orderLabel}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#444] hover:text-[#d0d0d0] transition-colors">
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <h4 className="text-[#999] text-xs uppercase tracking-wider mb-3">Resumen del Pedido</h4>
          <div className="space-y-2 mb-6">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-start text-sm">
                <div className="flex-1">
                  <span className="text-[#d0d0d0]">{item.name}</span>
                  <span className="text-[#444] ml-2">×{item.quantity}</span>
                  {item.modifiers && item.modifiers.length > 0 && (
                    <p className="text-xs text-[#444] mt-0.5">{item.modifiers.join(', ')}</p>
                  )}
                </div>
                <span className="text-[#ff5722] text-sm">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="bg-[#0d0d0d] p-4 rounded-xl border border-[#1a1a1a] space-y-2 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-[#444]">Subtotal</span>
              <span className="text-[#d0d0d0]">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#444]">IVA (21%)</span>
              <span className="text-[#d0d0d0]">{formatPrice(order.iva)}</span>
            </div>
            <div className="flex justify-between border-t border-[#1a1a1a] pt-2">
              <span className="text-[#d0d0d0]">Total</span>
              <span className="text-[#ff5722] text-2xl">{formatPrice(order.total)}</span>
            </div>
          </div>

          <h4 className="text-[#999] text-xs uppercase tracking-wider mb-3">Método de Pago</h4>
          <div className="space-y-2.5 mb-6">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              return (
                <button
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedPayment === method.id
                      ? 'border-[#ff5722] bg-[#ff5722]/8'
                      : 'border-[#1a1a1a] hover:border-[#252525] bg-[#0d0d0d]'
                  }`}
                >
                  <div className={`w-11 h-11 rounded-xl ${method.color} flex items-center justify-center shrink-0`}>
                    <Icon className="text-white" size={22} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-[#d0d0d0] text-sm">{method.name}</div>
                  </div>
                  <div className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedPayment === method.id ? 'bg-[#ff5722] border-[#ff5722]' : 'border-[#333]'
                  }`}>
                    {selectedPayment === method.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Cash Payment Section */}
          {selectedPayment === 'efectivo' && (
            <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-4 space-y-4">
              <div>
                <label className="text-[#999] text-xs uppercase tracking-wider mb-2 block">
                  Efectivo Recibido
                </label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#ff5722] text-xl">₲</span>
                  <input
                    type="number"
                    step="1"
                    min={Math.round(order.total)}
                    value={cashReceived}
                    onChange={(e) => setCashReceived(e.target.value)}
                    placeholder="0"
                    className="w-full bg-[#111111] border-2 border-[#1e1e1e] focus:border-[#ff5722] text-[#f0f0f0] text-2xl placeholder-[#333] rounded-xl pl-10 pr-6 py-4 focus:outline-none transition-colors text-center"
                    autoFocus
                  />
                </div>
              </div>

              {/* Change Display */}
              {cashReceived && parseFloat(cashReceived) >= order.total && (
                <div className="bg-green-500/8 border border-green-500/20 rounded-xl p-4">
                  <div className="text-[#999] text-xs uppercase tracking-wider mb-1">Cambio / Vuelto</div>
                  <div className="text-green-400 text-3xl">
                    {formatPrice(change)}
                  </div>
                </div>
              )}

              {/* Insufficient cash warning */}
              {cashReceived && parseFloat(cashReceived) < order.total && (
                <div className="bg-red-500/8 border border-red-500/20 rounded-xl p-3 text-center">
                  <span className="text-red-400 text-xs">
                    El efectivo recibido es menor al total de la venta
                  </span>
                </div>
              )}
            </div>
          )}
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
            className="flex-1 bg-[#ff5722] hover:bg-[#e64a19] text-white py-3 rounded-xl transition-all duration-200 shadow-lg shadow-[#ff5722]/25 hover:shadow-[#ff5722]/40 flex items-center justify-center gap-2 text-sm"
          >
            <Check size={18} />
            Confirmar Venta
          </button>
        </div>
      </div>
    </div>
  );
}