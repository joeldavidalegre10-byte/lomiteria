import { useState } from 'react';
import { Package, Search, Edit2, Trash2, Plus, LayoutGrid, List } from 'lucide-react';
import { ProductFormModal } from './ProductFormModal';
import { ConfirmModal } from './ConfirmModal';
import type { Product } from '../types';
import { formatPrice } from '../utils/currency';

const CATEGORIES = [
  { id: 'todos', label: 'Todos', emoji: '📋' },
  { id: 'lomitos', label: 'Lomitos', emoji: '🌯' },
  { id: 'hamburguesas', label: 'Hamburguesas', emoji: '🍔' },
  { id: 'papas', label: 'Papas Fritas', emoji: '🍟' },
  { id: 'gaseosas', label: 'Gaseosas', emoji: '🥤' },
  { id: 'cocteles', label: 'Cócteles', emoji: '🍹' },
];

const categoryColors: Record<string, string> = {
  lomitos: 'text-orange-400 bg-orange-400/8 border-orange-400/20',
  hamburguesas: 'text-yellow-400 bg-yellow-400/8 border-yellow-400/20',
  papas: 'text-amber-400 bg-amber-400/8 border-amber-400/20',
  gaseosas: 'text-blue-400 bg-blue-400/8 border-blue-400/20',
  cocteles: 'text-purple-400 bg-purple-400/8 border-purple-400/20',
};

const categoryHeaderColors: Record<string, string> = {
  lomitos: 'border-orange-400/20 text-orange-400',
  hamburguesas: 'border-yellow-400/20 text-yellow-400',
  papas: 'border-amber-400/20 text-amber-400',
  gaseosas: 'border-blue-400/20 text-blue-400',
  cocteles: 'border-purple-400/20 text-purple-400',
};

interface InventoryViewProps {
  products: Product[];
  onProductsChange: (products: Product[]) => void;
}

export function InventoryView({ products, onProductsChange }: InventoryViewProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('todos');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'delete' | 'save';
    data?: any;
  } | null>(null);

  // Filter products
  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (CATEGORIES.find(c => c.id === p.category)?.label || '').toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'todos' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Group products by category for "Todos" view
  const grouped: { categoryId: string; label: string; emoji: string; items: Product[] }[] = [];
  if (activeCategory === 'todos') {
    CATEGORIES.filter(c => c.id !== 'todos').forEach(cat => {
      const items = filtered.filter(p => p.category === cat.id);
      if (items.length > 0) grouped.push({ categoryId: cat.id, label: cat.label, emoji: cat.emoji, items });
    });
  }

  const handleAddProduct = () => {
    setEditingProduct(undefined);
    setShowForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteClick = (product: Product) => {
    setConfirmAction({ type: 'delete', data: product });
  };

  const handleSaveProduct = (productData: Omit<Product, 'id'>) => {
    setConfirmAction({ type: 'save', data: { productData, isEdit: !!editingProduct } });
  };

  const confirmDelete = () => {
    if (confirmAction?.type === 'delete') {
      const product = confirmAction.data as Product;
      onProductsChange(products.filter(p => p.id !== product.id));
    }
    setConfirmAction(null);
  };

  const confirmSave = () => {
    if (confirmAction?.type === 'save') {
      const { productData, isEdit } = confirmAction.data;
      if (isEdit && editingProduct) {
        onProductsChange(products.map(p =>
          p.id === editingProduct.id ? { ...productData, id: editingProduct.id } : p
        ));
      } else {
        onProductsChange([...products, { ...productData, id: `prod-${Date.now()}` }]);
      }
      setShowForm(false);
      setEditingProduct(undefined);
    }
    setConfirmAction(null);
  };

  const cancelConfirm = () => setConfirmAction(null);

  const ProductRow = ({ product }: { product: Product }) => {
    const catColor = categoryColors[product.category] || 'text-[#888] bg-[#1a1a1a] border-[#2a2a2a]';
    const catLabel = CATEGORIES.find(c => c.id === product.category)?.label || product.category;
    return (
      <div
        className="grid grid-cols-[1fr_140px_110px_90px] gap-2 items-center px-4 py-3 border-b border-[#111111] hover:bg-[#141414] transition-colors"
      >
        {/* Product */}
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-2xl shrink-0">{product.emoji}</span>
          <div className="min-w-0">
            <div className="text-[#d0d0d0] text-sm truncate">{product.name}</div>
            <div className="text-[10px] text-[#444] truncate">{product.description}</div>
            {product.modifiers && product.modifiers.length > 0 && (
              <div className="text-[10px] text-[#333] mt-0.5">
                {product.modifiers.length} extra{product.modifiers.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>

        {/* Category */}
        <div>
          <span className={`text-[11px] px-2 py-1 rounded-lg border ${catColor}`}>
            {catLabel}
          </span>
        </div>

        {/* Price */}
        <div className="text-[#ff5722] text-sm">{formatPrice(product.price)}</div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => handleEditProduct(product)}
            className="p-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-[#888] hover:text-[#ff5722] hover:border-[#ff5722]/40 transition-colors"
            title="Editar"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => handleDeleteClick(product)}
            className="p-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-[#888] hover:text-red-400 hover:border-red-400/40 transition-colors"
            title="Eliminar"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#ff5722]/10 rounded-xl flex items-center justify-center border border-[#ff5722]/20">
            <Package className="text-[#ff5722]" size={20} />
          </div>
          <div>
            <h2 className="text-[#f0f0f0]">Gestión de Catálogo</h2>
            <p className="text-xs text-[#444]">{products.length} productos en el sistema</p>
          </div>
        </div>

        <button
          onClick={handleAddProduct}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ff5722] hover:bg-[#ff6b3d] text-white transition-colors text-sm"
        >
          <Plus size={16} />
          Nuevo Producto
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#333]" size={15} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar producto..."
          className="w-full bg-[#111111] border border-[#1e1e1e] focus:border-[#ff5722] text-[#f0f0f0] placeholder-[#333] rounded-xl pl-10 pr-4 py-3 focus:outline-none transition-colors text-sm"
        />
      </div>

      {/* Category filter tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => {
          const count = cat.id === 'todos'
            ? products.length
            : products.filter(p => p.category === cat.id).length;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border whitespace-nowrap text-xs transition-all duration-200 shrink-0 ${
                isActive
                  ? 'bg-[#ff5722]/10 border-[#ff5722]/40 text-[#ff5722]'
                  : 'bg-[#111111] border-[#1e1e1e] text-[#444] hover:text-[#888] hover:border-[#2a2a2a]'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-[#ff5722]/20 text-[#ff5722]' : 'bg-[#1a1a1a] text-[#444]'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-[#0f0f0f] rounded-2xl border border-[#1a1a1a] overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[1fr_140px_110px_90px] gap-2 px-4 py-3 border-b border-[#1a1a1a] bg-[#0a0a0a]">
          {['Producto', 'Categoría', 'Precio', 'Acciones'].map((h) => (
            <span key={h} className="text-[10px] uppercase tracking-widest text-[#333]">{h}</span>
          ))}
        </div>

        {/* Grouped by category ("Todos" mode) */}
        {activeCategory === 'todos' && grouped.length > 0 && grouped.map((group) => (
          <div key={group.categoryId}>
            {/* Category header */}
            <div className={`flex items-center gap-2 px-4 py-2 bg-[#0d0d0d] border-b border-t border-[#1a1a1a] ${categoryHeaderColors[group.categoryId] || 'text-[#888]'}`}>
              <span className="text-base">{group.emoji}</span>
              <span className="text-xs uppercase tracking-wider">{group.label}</span>
              <span className="text-[10px] ml-1 opacity-60">({group.items.length})</span>
            </div>
            {group.items.map((product) => (
              <ProductRow key={product.id} product={product} />
            ))}
          </div>
        ))}

        {/* Single category mode */}
        {activeCategory !== 'todos' && filtered.map((product) => (
          <ProductRow key={product.id} product={product} />
        ))}

        {/* Empty states */}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-[#333] text-sm">
            {search
              ? `No se encontraron productos para "${search}"`
              : activeCategory !== 'todos'
                ? `No hay productos en esta categoría`
                : 'No hay productos en el catálogo'}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <ProductFormModal
          product={editingProduct}
          onSave={handleSaveProduct}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(undefined);
          }}
        />
      )}

      {/* Confirmation Modals */}
      {confirmAction?.type === 'delete' && (
        <ConfirmModal
          title="¿Eliminar producto?"
          message={`¿Estás seguro de eliminar "${confirmAction.data.name}"? Esta acción será permanente y no se puede deshacer.`}
          confirmText="Eliminar"
          onConfirm={confirmDelete}
          onCancel={cancelConfirm}
        />
      )}

      {confirmAction?.type === 'save' && (
        <ConfirmModal
          title="¿Guardar cambios?"
          message="¿Estás seguro de realizar esta acción? Los cambios serán permanentes."
          confirmText="Guardar"
          onConfirm={confirmSave}
          onCancel={cancelConfirm}
        />
      )}
    </div>
  );
}
