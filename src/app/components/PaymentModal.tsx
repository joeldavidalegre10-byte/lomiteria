import { useState, useEffect } from 'react';
import { X, Check, CreditCard, Smartphone, Banknote, UtensilsCrossed, Bike, Shuffle } from 'lucide-react';
import type { ActiveOrder, PaymentMethod, MixedPayment } from '../types';
import { formatPrice } from '../utils/currency';

interface PaymentModalProps {
  order: ActiveOrder;
  onConfirm: (paymentMethod: PaymentMethod, cashReceived?: number, change?: number, mixedPayment?: MixedPayment) => void;
  onClose: () => void;
}

export function PaymentModal({ order, onConfirm, onClose }: PaymentModalProps) {
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('efectivo');
  const [cashReceived, setCashReceived] = useState('');
  const [change, setChange] = useState(0);

  // Mixed payment state
  const [mixEfectivo, setMixEfectivo] = useState('');
  const [mixTarjeta, setMixTarjeta] = useState('');
  const [mixTransferencia, setMixTransferencia] = useState('');

  const isMesa = order.orderType === 'mesa';
  const orderLabel = isMesa ? `Mesa ${order.tableNumber}` : `Pedido ${order.deliveryNumber ?? ''}`;
  const OrderIcon = isMesa ? UtensilsCrossed : Bike;
  const iconColor = isMesa ? 'text-[#ff5722]' : 'text-[#3b82f6]';

  const paymentMethods = [
    { id: 'efectivo' as PaymentMethod, name: 'Efectivo', icon: Banknote, color: 'bg-green-600' },
    { id: 'tarjeta' as PaymentMethod, name: 'Tarjeta', icon: CreditCard, color: 'bg-blue-600' },
    { id: 'transferencia' as PaymentMethod, name: 'Transfer.', icon: Smartphone, color: 'bg-purple-600' },
    { id: 'mixto' as PaymentMethod, name: 'Mixto', icon: Shuffle, color: 'bg-amber-600' },
  ];

  // Calculate change automatically when cash received changes
  useEffect(() => {
    if (selectedPayment === 'efectivo' && cashReceived) {
      const received = parseInt(cashReceived, 10);
      if (!isNaN(received) && received >= order.total) {
        setChange(received - order.total);
      } else {
        setChange(0);
      }
    } else {
      setChange(0);
    }
  }, [cashReceived, selectedPayment, order.total]);

  // Mixed payment sum
  const mixSum =
    (parseInt(mixEfectivo || '0', 10) || 0) +
    (parseInt(mixTarjeta || '0', 10) || 0) +
    (parseInt(mixTransferencia || '0', 10) || 0);
  const mixDiff = Math.round(order.total) - mixSum;
  const mixValid = mixSum === Math.round(order.total);

  const handleConfirm = () => {
    if (selectedPayment === 'efectivo') {
      const received = parseInt(cashReceived, 10);
      if (!cashReceived || isNaN(received) || received < order.total) {
        alert(`El efectivo recibido debe ser mayor o igual a ${formatPrice(order.total)}`);
        return;
      }
      onConfirm(selectedPayment, received, change);
    } else if (selectedPayment === 'mixto') {
      if (!mixValid) {
        alert(`La suma de los métodos de pago (${formatPrice(mixSum)}) debe ser igual al total (${formatPrice(order.total)})`);
        return;
      }
      const mp: MixedPayment = {
        efectivo: parseInt(mixEfectivo || '0', 10) || 0,
        tarjeta: parseInt(mixTarjeta || '0', 10) || 0,
        transferencia: parseInt(mixTransferencia || '0', 10) || 0,
      };
      onConfirm(selectedPayment, undefined, undefined, mp);
    } else {
      onConfirm(selectedPayment);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#111111] rounded-2xl border border-[#1e1e1e] max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
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
          {/* Order summary */}
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

          {/* Total box */}
          <div className="bg-[#0d0d0d] p-4 rounded-xl border border-[#1a1a1a] mb-6">
            <div className="flex justify-between">
              <span className="text-[#d0d0d0] text-sm">Total a Cobrar</span>
              <span className="text-[#ff5722] text-2xl">{formatPrice(order.total)}</span>
            </div>
          </div>

          {/* Payment methods — horizontal row */}
          <h4 className="text-[#999] text-xs uppercase tracking-wider mb-3">Método de Pago</h4>
          <div className="grid grid-cols-4 gap-2 mb-6">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              const isSelected = selectedPayment === method.id;
              return (
                <button
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 ${
                    isSelected
                      ? 'border-[#ff5722] bg-[#ff5722]/8'
                      : 'border-[#1a1a1a] hover:border-[#252525] bg-[#0d0d0d]'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl ${method.color} flex items-center justify-center shrink-0`}>
                    <Icon className="text-white" size={18} />
                  </div>
                  <span className={`text-xs leading-tight text-center ${isSelected ? 'text-[#ff5722]' : 'text-[#888]'}`}>
                    {method.name}
                  </span>
                  <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected ? 'bg-[#ff5722] border-[#ff5722]' : 'border-[#333]'
                  }`}>
                    {isSelected && <div className="w-1 h-1 bg-white rounded-full" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Efectivo: manual cash input + change calculation */}
          {selectedPayment === 'efectivo' && (
            <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-4 space-y-4">
              <div>
                <label className="text-[#999] text-xs uppercase tracking-wider mb-2 block">
                  Monto Entregado por el Cliente
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ff5722] text-xl select-none">₲</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={cashReceived}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setCashReceived(val);
                    }}
                    placeholder="0"
                    className="w-full bg-[#111111] border-2 border-[#1e1e1e] focus:border-[#ff5722] text-[#f0f0f0] text-2xl placeholder-[#333] rounded-xl pl-11 pr-6 py-4 focus:outline-none transition-colors text-center"
                    autoFocus
                  />
                </div>
              </div>

              {cashReceived && parseInt(cashReceived, 10) >= order.total && (
                <div className="bg-green-500/8 border border-green-500/20 rounded-xl p-4">
                  <div className="text-[#999] text-xs uppercase tracking-wider mb-1">Cambio / Vuelto</div>
                  <div className="text-green-400 text-3xl">{formatPrice(change)}</div>
                </div>
              )}

              {cashReceived && parseInt(cashReceived, 10) < order.total && (
                <div className="bg-red-500/8 border border-red-500/20 rounded-xl p-3 text-center">
                  <span className="text-red-400 text-xs">
                    El efectivo recibido es menor al total de la venta
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Mixto: breakdown inputs */}
          {selectedPayment === 'mixto' && (
            <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-4 space-y-4">
              <p className="text-[#999] text-xs uppercase tracking-wider">Desglose del Pago Mixto</p>

              {[
                { label: 'Efectivo', value: mixEfectivo, setter: setMixEfectivo, color: 'text-green-400' },
                { label: 'Tarjeta', value: mixTarjeta, setter: setMixTarjeta, color: 'text-blue-400' },
                { label: 'Transferencia', value: mixTransferencia, setter: setMixTransferencia, color: 'text-purple-400' },
              ].map(({ label, value, setter, color }) => (
                <div key={label}>
                  <label className={`text-xs mb-1.5 block ${color}`}>{label}</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555] select-none">₲</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={value}
                      onChange={(e) => setter(e.target.value.replace(/\D/g, ''))}
                      placeholder="0"
                      className="w-full bg-[#111111] border border-[#1e1e1e] focus:border-[#ff5722] text-[#f0f0f0] placeholder-[#333] rounded-xl pl-9 pr-4 py-3 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              ))}

              {/* Sum status */}
              <div className={`rounded-xl p-3 border text-sm flex justify-between items-center ${
                mixValid
                  ? 'bg-green-500/8 border-green-500/20'
                  : 'bg-[#1a1a1a] border-[#2a2a2a]'
              }`}>
                <span className="text-[#888]">Suma total:</span>
                <div className="text-right">
                  <span className={mixValid ? 'text-green-400' : (mixDiff < 0 ? 'text-red-400' : 'text-amber-400')}>
                    {formatPrice(mixSum)}
                  </span>
                  {!mixValid && (
                    <p className="text-xs text-[#555] mt-0.5">
                      {mixDiff > 0 ? `Falta ${formatPrice(mixDiff)}` : `Excede en ${formatPrice(-mixDiff)}`}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
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