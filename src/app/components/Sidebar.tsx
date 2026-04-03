import { ShoppingCart, UtensilsCrossed, Bike, Package, BarChart2, LogOut, ChevronRight } from 'lucide-react';
import type { AuthUser } from '../types';

export type AppView = 'ventas' | 'mesas' | 'delivery' | 'inventario' | 'reportes';

interface SidebarProps {
  user: AuthUser;
  activeView: AppView;
  onViewChange: (view: AppView) => void;
  mesaCount: number;
  deliveryCount: number;
  onLogout: () => void;
}

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: number;
  badgeColor?: 'orange' | 'blue';
}

function NavItem({ icon: Icon, label, active, onClick, badge, badgeColor = 'orange' }: NavItemProps) {
  const badgeClasses = badgeColor === 'orange'
    ? 'bg-[#ff5722] text-white shadow-lg shadow-[#ff5722]/40'
    : 'bg-[#3b82f6] text-white shadow-lg shadow-[#3b82f6]/40';

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative ${
        active
          ? 'bg-[#ff5722]/12 border border-[#ff5722]/25 text-[#ff5722]'
          : 'text-[#555] hover:text-[#d0d0d0] hover:bg-[#161616] border border-transparent'
      }`}
    >
      {/* Active indicator */}
      {active && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[#ff5722] rounded-full -ml-px" />
      )}

      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${
        active
          ? 'bg-[#ff5722]/15'
          : 'bg-[#141414] group-hover:bg-[#1a1a1a]'
      }`}>
        <Icon size={16} />
      </div>

      <span className="flex-1 text-left text-sm">{label}</span>

      {/* Badge */}
      {badge !== undefined && badge > 0 && (
        <span className={`min-w-[22px] h-[22px] px-1 rounded-full flex items-center justify-center text-xs shrink-0 ${badgeClasses}`}>
          {badge > 99 ? '99+' : badge}
        </span>
      )}

      {/* Arrow on hover */}
      {!active && (
        <ChevronRight size={13} className="opacity-0 group-hover:opacity-40 transition-opacity shrink-0" />
      )}
    </button>
  );
}

export function Sidebar({ user, activeView, onViewChange, mesaCount, deliveryCount, onLogout }: SidebarProps) {
  const isAdmin = user.role === 'admin';

  const navSections = [
    {
      title: 'Operaciones',
      items: [
        { view: 'ventas' as AppView, icon: ShoppingCart, label: 'Ventas', badge: undefined, badgeColor: undefined },
        { view: 'mesas' as AppView, icon: UtensilsCrossed, label: 'Mesas', badge: mesaCount, badgeColor: 'orange' as const },
        { view: 'delivery' as AppView, icon: Bike, label: 'Delivery', badge: deliveryCount, badgeColor: 'blue' as const },
      ],
    },
    ...(isAdmin ? [{
      title: 'Administración',
      items: [
        { view: 'inventario' as AppView, icon: Package, label: 'Inventario', badge: undefined, badgeColor: undefined },
        { view: 'reportes' as AppView, icon: BarChart2, label: 'Reportes', badge: undefined, badgeColor: undefined },
      ],
    }] : []),
  ];

  return (
    <aside className="w-[220px] shrink-0 bg-[#0d0d0d] border-r border-[#161616] flex flex-col h-screen">
      {/* Brand */}
      <div className="px-4 py-5 border-b border-[#161616]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#ff5722]/12 rounded-xl border border-[#ff5722]/20 flex items-center justify-center shrink-0">
            <span className="text-lg">🌮</span>
          </div>
          <div className="min-w-0">
            <div className="text-[#d0d0d0] text-sm truncate">Lomitería POS</div>
            <div className="text-[10px] text-[#333] uppercase tracking-wider">Terminal 01</div>
          </div>
        </div>
      </div>

      {/* User badge */}
      <div className="px-4 py-3 border-b border-[#161616]">
        <div className="flex items-center gap-2.5 bg-[#111111] rounded-xl px-3 py-2.5 border border-[#1a1a1a]">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0 ${
            isAdmin ? 'bg-[#ff5722]/15' : 'bg-[#3b82f6]/15'
          }`}>
            {isAdmin ? '👑' : '🧑‍💼'}
          </div>
          <div className="min-w-0">
            <div className="text-xs text-[#d0d0d0] truncate">{user.name}</div>
            <div className={`text-[10px] uppercase tracking-wider ${isAdmin ? 'text-[#ff5722]' : 'text-[#3b82f6]'}`}>
              {isAdmin ? 'Administrador' : 'Cajero'}
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {navSections.map((section) => (
          <div key={section.title}>
            <div className="text-[10px] uppercase tracking-[0.15em] text-[#2e2e2e] px-3 mb-2">
              {section.title}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavItem
                  key={item.view}
                  icon={item.icon}
                  label={item.label}
                  active={activeView === item.view}
                  onClick={() => onViewChange(item.view)}
                  badge={item.badge}
                  badgeColor={item.badgeColor}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-[#161616] space-y-1">
        {/* Quick stats if there are active orders */}
        {(mesaCount > 0 || deliveryCount > 0) && (
          <div className="bg-[#111111] rounded-xl px-3 py-2.5 border border-[#1a1a1a] mb-2">
            <div className="text-[10px] text-[#333] uppercase tracking-wider mb-2">Pendientes</div>
            <div className="flex items-center justify-between text-xs">
              {mesaCount > 0 && (
                <span className="flex items-center gap-1.5 text-[#ff5722]">
                  <UtensilsCrossed size={11} />
                  {mesaCount} mesa{mesaCount !== 1 ? 's' : ''}
                </span>
              )}
              {deliveryCount > 0 && (
                <span className="flex items-center gap-1.5 text-[#3b82f6]">
                  <Bike size={11} />
                  {deliveryCount} delivery{deliveryCount !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        )}

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#444] hover:text-red-400 hover:bg-red-500/5 border border-transparent hover:border-red-500/10 transition-all duration-200 group"
        >
          <div className="w-8 h-8 rounded-lg bg-[#141414] group-hover:bg-red-500/8 flex items-center justify-center transition-all">
            <LogOut size={15} />
          </div>
          <span className="text-sm">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
