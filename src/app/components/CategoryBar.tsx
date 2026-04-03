const categories = [
  { id: 'lomitos', name: 'Lomitos', emoji: '🥩' },
  { id: 'hamburguesas', name: 'Hamburguesas', emoji: '🍔' },
  { id: 'papas', name: 'Papas Fritas', emoji: '🍟' },
  { id: 'gaseosas', name: 'Gaseosas', emoji: '🥤' },
  { id: 'cocteles', name: 'Cócteles', emoji: '🍹' },
];

interface CategoryBarProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryBar({ activeCategory, onCategoryChange }: CategoryBarProps) {
  return (
    <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[#161616] bg-[#0d0d0d] overflow-x-auto shrink-0">
      <span className="text-xs text-[#333] uppercase tracking-widest mr-1 shrink-0">Menú</span>
      <div className="w-px h-5 bg-[#1e1e1e] mr-1 shrink-0" />
      {categories.map((cat) => {
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all duration-200 shrink-0 text-sm ${
              isActive
                ? 'bg-[#ff5722] text-white shadow-lg shadow-[#ff5722]/25'
                : 'bg-[#111111] text-[#555] hover:text-[#d0d0d0] hover:bg-[#1a1a1a] border border-[#1e1e1e]'
            }`}
          >
            <span className="text-base">{cat.emoji}</span>
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}
