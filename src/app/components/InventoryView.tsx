import { useState, useEffect } from 'react';
import { Package, Search, Edit2, Trash2, Plus } from 'lucide-react';
import { products as initialProducts } from '../data/products';
import { ProductFormModal } from './ProductFormModal';
import { ConfirmModal } from './ConfirmModal';
import type { Product } from '../types';
import { formatPrice } from '../utils/currency';

const categoryNames: Record<string, string> = {
  lomitos: 'Lomitos',
  hamburguesas: 'Hamburguesas',
  papas: 'Papas Fritas',
  gaseosas: 'Gaseosas',
  cocteles: 'Cócteles',
};

const categoryColors: Record<string, string> = {
  lomitos: 'text-orange-400 bg-orange-400/8',
  hamburguesas: 'text-yellow-400 bg-yellow-400/8',
  papas: 'text-amber-400 bg-amber-400/8',
  gaseosas: 'text-blue-400 bg-blue-400/8',
  cocteles: 'text-purple-400 bg-purple-400/8',
};

export function InventoryView() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'delete' | 'save';
    data?: any;
  } | null>(null);

  // Load products from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('lomiteria_products');
    if (saved) {
      setProducts(JSON.parse(saved));
    } else {
      setProducts(initialProducts);
    }
  }, []);

  // Save products to localStorage
  const saveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem('lomiteria_products', JSON.stringify(newProducts));
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      categoryNames[p.category]?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddProduct = () => {
    setEditingProduct(undefined);
    setShowForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteClick = (product: Product) => {
    setConfirmAction({
      type: 'delete',
      data: product,
    });
  };

  const handleSaveProduct = (productData: Omit<Product, 'id'>) => {
    setConfirmAction({
      type: 'save',
      data: { productData, isEdit: !!editingProduct },
    });
  };

  const confirmDelete = () => {
    if (confirmAction?.type === 'delete') {
      const product = confirmAction.data as Product;
      const newProducts = products.filter(p => p.id !== product.id);
      saveProducts(newProducts);
    }
    setConfirmAction(null);
  };

  const confirmSave = () => {
    if (confirmAction?.type === 'save') {
      const { productData, isEdit } = confirmAction.data;

      if (isEdit && editingProduct) {
        const newProducts = products.map(p =>
          p.id === editingProduct.id ? { ...productData, id: editingProduct.id } : p
        );
        saveProducts(newProducts);
      } else {
        const newId = `prod-${Date.now()}`;
        const newProducts = [...products, { ...productData, id: newId }];
        saveProducts(newProducts);
      }

      setShowForm(false);
      setEditingProduct(undefined);
    }
    setConfirmAction(null);
  };

  const cancelConfirm = () => {
    if (confirmAction?.type === 'save') {
      // Don't close the form, just close the confirm modal
    }
    setConfirmAction(null);
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
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#333]" size={15} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar producto o categoría..."
          className="w-full bg-[#111111] border border-[#1e1e1e] focus:border-[#ff5722] text-[#f0f0f0] placeholder-[#333] rounded-xl pl-10 pr-4 py-3 focus:outline-none transition-colors text-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-[#0f0f0f] rounded-2xl border border-[#1a1a1a] overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[1fr_150px_100px_100px] gap-2 px-4 py-3 border-b border-[#1a1a1a]">
          {['Producto', 'Categoría', 'Precio', 'Acciones'].map((h) => (
            <span key={h} className="text-[10px] uppercase tracking-widest text-[#333]">{h}</span>
          ))}
        </div>

        {/* Rows */}
        {filtered.map((product) => {
          const catColor = categoryColors[product.category] || 'text-[#888] bg-[#1a1a1a]';

          return (
            <div
              key={product.id}
              className="grid grid-cols-[1fr_150px_100px_100px] gap-2 items-center px-4 py-3 border-b border-[#111111] hover:bg-[#141414] transition-colors"
            >
              {/* Product */}
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-2xl shrink-0">{product.emoji}</span>
                <div className="min-w-0">
                  <div className="text-[#d0d0d0] text-sm truncate">{product.name}</div>
                  <div className="text-[10px] text-[#444] truncate">{product.description}</div>
                </div>
              </div>

              {/* Category */}
              <div>
                <span className={`text-[11px] px-2 py-1 rounded-lg ${catColor}`}>
                  {categoryNames[product.category]}
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
        })}

        {filtered.length === 0 && (
          <div className="text-center py-10 text-[#333] text-sm">
            {search ? `No se encontraron productos para "${search}"` : 'No hay productos en el catálogo'}
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
