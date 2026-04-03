import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Product } from '../types';

interface ProductFormModalProps {
  product?: Product;
  onSave: (productData: Omit<Product, 'id'>) => void;
  onClose: () => void;
}

const availableIcons = [
  { id: 'lomito', emoji: '🌯', label: 'Lomito' },
  { id: 'hamburguesa', emoji: '🍔', label: 'Hamburguesa' },
  { id: 'papas', emoji: '🍟', label: 'Papas Fritas' },
  { id: 'gaseosa', emoji: '🥤', label: 'Gaseosa' },
  { id: 'agua', emoji: '💧', label: 'Agua' },
  { id: 'coctel', emoji: '🍹', label: 'Cóctel' },
];

const categories = [
  { id: 'lomitos', label: 'Lomitos' },
  { id: 'hamburguesas', label: 'Hamburguesas' },
  { id: 'papas', label: 'Papas Fritas' },
  { id: 'gaseosas', label: 'Gaseosas' },
  { id: 'cocteles', label: 'Cócteles' },
];

export function ProductFormModal({ product, onSave, onClose }: ProductFormModalProps) {
  const [name, setName] = useState(product?.name || '');
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState(product?.price.toString() || '');
  const [category, setCategory] = useState(product?.category || 'lomitos');
  const [selectedEmoji, setSelectedEmoji] = useState(product?.emoji || '🌯');

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price.toString());
      setCategory(product.category);
      setSelectedEmoji(product.emoji);
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      alert('Por favor ingresa un precio válido');
      return;
    }

    if (!name.trim()) {
      alert('Por favor ingresa un nombre');
      return;
    }

    onSave({
      name: name.trim(),
      description: description.trim(),
      price: priceNum,
      category,
      emoji: selectedEmoji,
      popular: product?.popular || false,
      modifiers: product?.modifiers || [],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#1a1a1a] border-b border-[#2a2a2a] px-6 py-4 flex items-center justify-between">
          <h3 className="text-[#f0f0f0] text-lg">
            {product ? 'Editar Producto' : 'Nuevo Producto'}
          </h3>
          <button
            onClick={onClose}
            className="text-[#666] hover:text-[#ff5722] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Icon Selector */}
          <div>
            <label className="block text-[#d0d0d0] text-sm mb-3">
              Icono del Producto
            </label>
            <div className="grid grid-cols-6 gap-3">
              {availableIcons.map((icon) => (
                <button
                  key={icon.id}
                  type="button"
                  onClick={() => setSelectedEmoji(icon.emoji)}
                  className={`
                    aspect-square rounded-xl flex items-center justify-center text-3xl
                    border-2 transition-all hover:scale-105
                    ${selectedEmoji === icon.emoji
                      ? 'bg-[#ff5722]/10 border-[#ff5722]'
                      : 'bg-[#0f0f0f] border-[#2a2a2a] hover:border-[#ff5722]/40'
                    }
                  `}
                  title={icon.label}
                >
                  {icon.emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-[#d0d0d0] text-sm mb-2">
              Nombre del Producto
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Lomito Completo"
              className="w-full bg-[#0f0f0f] border border-[#2a2a2a] focus:border-[#ff5722] text-[#f0f0f0] placeholder-[#444] rounded-xl px-4 py-3 focus:outline-none transition-colors"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[#d0d0d0] text-sm mb-2">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe los ingredientes o características..."
              className="w-full bg-[#0f0f0f] border border-[#2a2a2a] focus:border-[#ff5722] text-[#f0f0f0] placeholder-[#444] rounded-xl px-4 py-3 focus:outline-none transition-colors resize-none"
              rows={3}
            />
          </div>

          {/* Price and Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#d0d0d0] text-sm mb-2">
                Precio
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ff5722]">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-[#0f0f0f] border border-[#2a2a2a] focus:border-[#ff5722] text-[#f0f0f0] placeholder-[#444] rounded-xl pl-8 pr-4 py-3 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[#d0d0d0] text-sm mb-2">
                Categoría
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#0f0f0f] border border-[#2a2a2a] focus:border-[#ff5722] text-[#f0f0f0] rounded-xl px-4 py-3 focus:outline-none transition-colors"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-[#2a2a2a]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-[#0f0f0f] border border-[#2a2a2a] text-[#d0d0d0] hover:bg-[#1a1a1a] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#ff5722] hover:bg-[#ff6b3d] text-white transition-colors"
            >
              {product ? 'Guardar Cambios' : 'Crear Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
