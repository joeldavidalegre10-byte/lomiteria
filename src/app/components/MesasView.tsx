import { UtensilsCrossed, Clock, CreditCard, Users, Printer } from 'lucide-react';
import type { ActiveOrder } from '../types';
import { formatPrice } from '../utils/currency';
import { consolidateOrders, type ConsolidatedOrder } from '../utils/orderConsolidation';

interface MesasViewProps {
  orders: ActiveOrder[];
  onOrderClick: (order: ActiveOrder) => void;
  onPrintReceipt?: (consolidatedOrder: ConsolidatedOrder) => void;
}

function timeAgo(timestamp: string) {
  const diff = Math.floor((Date.now() - new Date(timestamp).getTime()) / 60000);
  if (diff < 1) return 'Ahora mismo';
  if (diff === 1) return 'Hace 1 min';
  return `Hace ${diff} min`;
}

export function MesasView({ orders, onOrderClick, onPrintReceipt }: MesasViewProps) {
  const consolidatedOrders = consolidateOrders(orders);

  if (consolidatedOrders.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 gap-4">
        <div className="w-24 h-24 bg-[#111111] rounded-2xl border border-[#1e1e1e] flex items-center justify-center mb-2">
          <UtensilsCrossed className="text-[#2a2a2a]" size={40} />
        </div>
        <p className="text-[#444] text-lg">Sin mesas activas</p>
        <p className="text-sm text-[#333]">Los pedidos de salón aparecerán aquí</p>
      </div>
    );
  }

  const totalPending = consolidatedOrders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#ff5722]/10 rounded-xl flex items-center justify-center border border-[#ff5722]/20">
            <UtensilsCrossed className="text-[#ff5722]" size={20} />
          </div>
          <div>
            <h2 className="text-[#f0f0f0]">Mesas Activas</h2>
            <p className="text-xs text-[#444]">{consolidatedOrders.length} mesa{consolidatedOrders.length !== 1 ? 's' : ''} con pedido pendiente</p>
          </div>
          <span className="bg-[#ff5722] text-white text-sm px-3 py-1 rounded-full shadow-lg shadow-[#ff5722]/30">
            {consolidatedOrders.length}
          </span>
        </div>
        <div className="text-right">
          <p className="text-xs text-[#444]">Total pendiente</p>
          <p className="text-[#ff5722] text-xl">{formatPrice(totalPending)}</p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {consolidatedOrders.map((consolidated) => {
          const itemCount = consolidated.items.reduce((s, i) => s + i.quantity, 0);
          const firstOrder = orders.find(o => o.id === consolidated.id);

          return (
            <div
              key={consolidated.id}
              className="bg-[#111111] border border-[#1e1e1e] rounded-2xl overflow-hidden text-left transition-all duration-250 group relative"
            >
              {/* Mesa number banner */}
              <div className="relative bg-gradient-to-br from-[#1a0f08] via-[#130a04] to-[#0d0d0d] px-5 py-6 text-center overflow-hidden">
                <div className="absolute inset-0 bg-[#ff5722]/4 group-hover:bg-[#ff5722]/8 transition-all" />
                <div className="relative">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-[#ff5722]/70 mb-1">Mesa número</div>
                  <div className="text-[64px] leading-none text-[#f0f0f0]" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {consolidated.tableNumber}
                  </div>
                  {consolidated.orderCount > 1 && (
                    <div className="absolute top-2 right-2 bg-[#ff5722] text-white text-xs px-2 py-1 rounded-lg shadow-lg">
                      {consolidated.orderCount} pedidos
                    </div>
                  )}
                </div>
              </div>

              {/* Card body */}
              <div className="p-4">
                {/* Meta */}
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs text-[#3a3a3a] flex items-center gap-1.5">
                    <Clock size={11} />
                    {timeAgo(consolidated.timestamp)}
                  </span>
                  <span className="text-xs text-[#3a3a3a] flex items-center gap-1">
                    <Users size={11} />
                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                  </span>
                </div>

                {/* Items preview */}
                <div className="space-y-1 mb-4 min-h-[48px]">
                  {consolidated.items.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex justify-between text-xs">
                      <span className="text-[#555] truncate flex-1 pr-2">{item.name}</span>
                      <span className="text-[#3a3a3a] shrink-0">×{item.quantity}</span>
                    </div>
                  ))}
                  {consolidated.items.length > 3 && (
                    <p className="text-xs text-[#333]">+{consolidated.items.length - 3} más...</p>
                  )}
                </div>

                {/* Total */}
                <div className="flex justify-between items-center border-t border-[#1a1a1a] pt-3 mb-3">
                  <span className="text-xs text-[#3a3a3a]">Total a cobrar</span>
                  <span className="text-[#ff5722] text-lg">{formatPrice(consolidated.total)}</span>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <button
                    onClick={() => firstOrder && onOrderClick(firstOrder)}
                    className="w-full bg-[#ff5722]/8 border border-[#ff5722]/15 hover:bg-[#ff5722] hover:border-[#ff5722] rounded-xl py-2.5 text-center transition-all duration-200 group/btn"
                  >
                    <span className="text-[#ff5722] group-hover/btn:text-white text-xs flex items-center justify-center gap-2 tracking-wide uppercase">
                      <CreditCard size={13} />
                      Cobrar Mesa {consolidated.tableNumber}
                    </span>
                  </button>

                  {onPrintReceipt && (
                    <button
                      onClick={() => onPrintReceipt(consolidated)}
                      className="w-full bg-[#0f0f0f] border border-[#2a2a2a] hover:border-[#4a4a4a] rounded-xl py-2.5 text-center transition-all duration-200 group/print"
                    >
                      <span className="text-[#888] group-hover/print:text-[#d0d0d0] text-xs flex items-center justify-center gap-2 tracking-wide uppercase">
                        <Printer size={13} />
                        Imprimir Cuenta
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
