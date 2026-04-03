import { BarChart2, TrendingUp, CreditCard, Banknote, Smartphone, ShoppingBag, UtensilsCrossed, Bike, Clock } from 'lucide-react';
import type { Sale } from '../types';
import { formatPrice } from '../utils/currency';

interface ReportsViewProps {
  sales: Sale[];
}

function StatCard({ label, value, sub, icon: Icon, color }: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="bg-[#111111] border border-[#1e1e1e] rounded-2xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
      <div className="text-[#f0f0f0] text-2xl mb-1">{value}</div>
      <div className="text-xs text-[#444] uppercase tracking-wider">{label}</div>
      {sub && <div className="text-xs text-[#555] mt-1">{sub}</div>}
    </div>
  );
}

export function ReportsView({ sales }: ReportsViewProps) {
  const today = new Date().toDateString();
  const todaySales = sales.filter(s => new Date(s.timestamp).toDateString() === today);

  const totalRevenue = todaySales.reduce((sum, s) => sum + s.total, 0);
  const totalSubtotal = todaySales.reduce((sum, s) => sum + s.subtotal, 0);
  const totalIva = todaySales.reduce((sum, s) => sum + s.iva, 0);

  // Por método de pago
  const byPayment = {
    efectivo: todaySales.filter(s => s.paymentMethod === 'efectivo'),
    tarjeta: todaySales.filter(s => s.paymentMethod === 'tarjeta'),
    transferencia: todaySales.filter(s => s.paymentMethod === 'transferencia'),
  };

  // Por tipo de orden
  const mesaSales = todaySales.filter(s => s.orderType === 'mesa');
  const deliverySales = todaySales.filter(s => s.orderType === 'delivery');

  // Productos más vendidos
  const productCount: Record<string, { name: string; qty: number; revenue: number }> = {};
  todaySales.forEach(sale => {
    sale.items.forEach(item => {
      if (!productCount[item.productId]) {
        productCount[item.productId] = { name: item.name, qty: 0, revenue: 0 };
      }
      productCount[item.productId].qty += item.quantity;
      productCount[item.productId].revenue += item.price * item.quantity;
    });
  });
  const topProducts = Object.entries(productCount)
    .sort((a, b) => b[1].qty - a[1].qty)
    .slice(0, 5);

  // Últimas ventas
  const recentSales = [...todaySales].sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  ).slice(0, 6);

  const paymentIcons = { efectivo: Banknote, tarjeta: CreditCard, transferencia: Smartphone };
  const paymentColors = { efectivo: 'bg-green-500', tarjeta: 'bg-blue-500', transferencia: 'bg-purple-500' };
  const paymentLabels = { efectivo: 'Efectivo', tarjeta: 'Tarjeta', transferencia: 'Transferencia' };

  if (todaySales.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 gap-4">
        <div className="w-24 h-24 bg-[#111111] rounded-2xl border border-[#1e1e1e] flex items-center justify-center mb-2">
          <BarChart2 className="text-[#2a2a2a]" size={40} />
        </div>
        <p className="text-[#444] text-lg">Sin ventas hoy</p>
        <p className="text-sm text-[#333]">Los reportes del día aparecerán aquí</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#ff5722]/10 rounded-xl flex items-center justify-center border border-[#ff5722]/20">
          <BarChart2 className="text-[#ff5722]" size={20} />
        </div>
        <div>
          <h2 className="text-[#f0f0f0]">Reportes del Día</h2>
          <p className="text-xs text-[#444]">
            {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Facturación Total"
          value={formatPrice(totalRevenue)}
          sub={`IVA incl.`}
          icon={TrendingUp}
          color="bg-[#ff5722]"
        />
        <StatCard
          label="Ventas Cerradas"
          value={String(todaySales.length)}
          sub={`${mesaSales.length} mesa · ${deliverySales.length} delivery`}
          icon={ShoppingBag}
          color="bg-violet-600"
        />
        <StatCard
          label="Neto (sin IVA)"
          value={formatPrice(totalSubtotal)}
          icon={BarChart2}
          color="bg-teal-600"
        />
        <StatCard
          label="IVA Cobrado (21%)"
          value={formatPrice(totalIva)}
          icon={CreditCard}
          color="bg-amber-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Payment methods */}
        <div className="bg-[#111111] border border-[#1e1e1e] rounded-2xl p-5">
          <h3 className="text-[#d0d0d0] mb-4 flex items-center gap-2">
            <CreditCard size={16} className="text-[#ff5722]" />
            Métodos de Pago
          </h3>
          <div className="space-y-3">
            {(Object.keys(byPayment) as Array<keyof typeof byPayment>).map(method => {
              const Icon = paymentIcons[method];
              const count = byPayment[method].length;
              const total = byPayment[method].reduce((s, sale) => s + sale.total, 0);
              const pct = todaySales.length > 0 ? (count / todaySales.length) * 100 : 0;
              return (
                <div key={method}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 ${paymentColors[method]} rounded-lg flex items-center justify-center`}>
                        <Icon size={13} className="text-white" />
                      </div>
                      <span className="text-sm text-[#d0d0d0]">{paymentLabels[method]}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-[#f0f0f0]">{formatPrice(total)}</span>
                      <span className="text-xs text-[#444] ml-2">{count} v.</span>
                    </div>
                  </div>
                  <div className="w-full h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${paymentColors[method]} rounded-full transition-all`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Salón vs Delivery */}
        <div className="bg-[#111111] border border-[#1e1e1e] rounded-2xl p-5">
          <h3 className="text-[#d0d0d0] mb-4 flex items-center gap-2">
            <UtensilsCrossed size={16} className="text-[#ff5722]" />
            Salón vs Delivery
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Mesas', items: mesaSales, Icon: UtensilsCrossed, color: 'bg-[#ff5722]', textColor: 'text-[#ff5722]' },
              { label: 'Delivery', items: deliverySales, Icon: Bike, color: 'bg-[#3b82f6]', textColor: 'text-[#3b82f6]' },
            ].map(({ label, items, Icon, color, textColor }) => {
              const rev = items.reduce((s, sale) => s + sale.total, 0);
              const pct = totalRevenue > 0 ? (rev / totalRevenue) * 100 : 0;
              return (
                <div key={label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 ${color} rounded-lg flex items-center justify-center`}>
                        <Icon size={13} className="text-white" />
                      </div>
                      <span className="text-sm text-[#d0d0d0]">{label}</span>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm ${textColor}`}>{formatPrice(rev)}</span>
                      <span className="text-xs text-[#444] ml-2">{items.length} v.</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#333]">{Math.round(pct)}% del total</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top productos */}
        <div className="bg-[#111111] border border-[#1e1e1e] rounded-2xl p-5">
          <h3 className="text-[#d0d0d0] mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-[#ff5722]" />
            Top Productos
          </h3>
          {topProducts.length === 0 ? (
            <p className="text-sm text-[#333]">Sin datos</p>
          ) : (
            <div className="space-y-2.5">
              {topProducts.map(([id, data], idx) => (
                <div key={id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] shrink-0 ${idx === 0 ? 'bg-[#ff5722] text-white' : 'bg-[#1a1a1a] text-[#555]'}`}>
                      {idx + 1}
                    </span>
                    <span className="text-sm text-[#d0d0d0] truncate max-w-[120px]">{data.name}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm text-[#f0f0f0]">{data.qty} u.</span>
                    <span className="text-xs text-[#444] ml-2">{formatPrice(data.revenue)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent sales */}
      <div className="bg-[#111111] border border-[#1e1e1e] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1a1a1a] flex items-center gap-2">
          <Clock size={15} className="text-[#ff5722]" />
          <h3 className="text-[#d0d0d0]">Últimas Ventas</h3>
        </div>
        <div>
          {recentSales.map((sale, i) => {
            const Icon = paymentIcons[sale.paymentMethod];
            const isLast = i === recentSales.length - 1;
            return (
              <div
                key={sale.id}
                className={`flex items-center justify-between px-5 py-3.5 hover:bg-[#141414] transition-colors ${!isLast ? 'border-b border-[#111111]' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 ${sale.orderType === 'mesa' ? 'bg-[#ff5722]/15' : 'bg-[#3b82f6]/15'} rounded-xl flex items-center justify-center`}>
                    {sale.orderType === 'mesa'
                      ? <UtensilsCrossed size={14} className="text-[#ff5722]" />
                      : <Bike size={14} className="text-[#3b82f6]" />
                    }
                  </div>
                  <div>
                    <div className="text-sm text-[#d0d0d0]">
                      {sale.orderType === 'mesa' ? `Mesa ${sale.tableNumber}` : `Pedido ${sale.deliveryNumber}`}
                    </div>
                    <div className="text-xs text-[#444]">
                      {new Date(sale.completedAt).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                      {' · '}
                      {sale.items.reduce((s, i) => s + i.quantity, 0)} items
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 ${paymentColors[sale.paymentMethod]} rounded-lg flex items-center justify-center`}>
                    <Icon size={13} className="text-white" />
                  </div>
                  <span className="text-[#ff5722]">{formatPrice(sale.total)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
