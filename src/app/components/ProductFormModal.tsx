import { useState, useEffect } from 'react';
import { X, Plus, Edit2, Trash2, Check } from 'lucide-react';
import type { Product, Modifier } from '../types';
import { formatPrice } from '../utils/currency';

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

  // Modifiers state
  const [modifiers, setModifiers] = useState<Modifier[]>(product?.modifiers || []);
  const [modifierName, setModifierName] = useState('');
  const [modifierPrice, setModifierPrice] = useState('');
  const [editingModifierIdx, setEditingModifierIdx] = useState<number | null>(null);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price.toString());
      setCategory(product.category);
      setSelectedEmoji(product.emoji);
      setModifiers(product.modifiers || []);
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
      modifiers,
    });
  };

  const handleAddOrUpdateModifier = () => {
    const trimmedName = modifierName.trim();
    if (!trimmedName) {
      alert('El extra debe tener un nombre');
      return;
    }
    const priceVal = parseFloat(modifierPrice) || 0;

    if (editingModifierIdx !== null) {
      // Update existing
      setModifiers(prev =>
        prev.map((m, idx) =>
          idx === editingModifierIdx ? { name: trimmedName, price: priceVal } : m
        )
      );
      setEditingModifierIdx(null);
    } else {
      // Add new
      setModifiers(prev => [...prev, { name: trimmedName, price: priceVal }]);
    }
    setModifierName('');
    setModifierPrice('');
  };

  const handleEditModifier = (idx: number) => {
    const mod = modifiers[idx];
    setModifierName(mod.name);
    setModifierPrice(mod.price.toString());
    setEditingModifierIdx(idx);
  };

  const handleDeleteModifier = (idx: number) => {
    setModifiers(prev => prev.filter((_, i) => i !== idx));
    if (editingModifierIdx === idx) {
      setEditingModifierIdx(null);
      setModifierName('');
      setModifierPrice('');
    }
  };

  const handleCancelModifierEdit = () => {
    setEditingModifierIdx(null);
    setModifierName('');
    setModifierPrice('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#1a1a1a] border-b border-[#2a2a2a] px-6 py-4 flex items-center justify-between z-10">
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
                Precio (₲)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ff5722]">₲</span>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0"
                  className="w-full bg-[#0f0f0f] border border-[#2a2a2a] focus:border-[#ff5722] text-[#f0f0f0] placeholder-[#444] rounded-xl pl-9 pr-4 py-3 focus:outline-none transition-colors"
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

          {/* ── Extras / Modifiers ── */}
          <div className="border-t border-[#2a2a2a] pt-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[#d0d0d0] text-sm">Extras / Modificadores</span>
              <span className="bg-[#ff5722]/15 text-[#ff5722] text-[10px] px-2 py-0.5 rounded-full">
                {modifiers.length}
              </span>
            </div>
            <p className="text-xs text-[#444] mb-4">
              Agregá opciones adicionales al producto (ej: "Añadir aderezo"). El precio puede ser 0 si el extra es sin costo.
            </p>

            {/* Existing modifiers list */}
            {modifiers.length > 0 && (
              <div className="space-y-2 mb-4">
                {modifiers.map((mod, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-colors ${
                      editingModifierIdx === idx
                        ? 'border-[#ff5722]/40 bg-[#ff5722]/5'
                        : 'border-[#2a2a2a] bg-[#0f0f0f]'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <span className="text-[#d0d0d0] text-sm">{mod.name}</span>
                      {mod.price !== 0 && (
                        <span className="text-[#ff5722] text-xs ml-2">
                          +{formatPrice(mod.price)}
                        </span>
                      )}
                      {mod.price === 0 && (
                        <span className="text-[#444] text-xs ml-2">sin costo</span>
                      )}
                    </div>
                    <div className="flex gap-2 shrink-0 ml-3">
                      <button
                        type="button"
                        onClick={() => handleEditModifier(idx)}
                        className="p-1.5 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-[#888] hover:text-[#ff5722] hover:border-[#ff5722]/40 transition-colors"
                        title="Modificar"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteModifier(idx)}
                        className="p-1.5 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-[#888] hover:text-red-400 hover:border-red-400/40 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add / Edit modifier form */}
            <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl p-4">
              <p className="text-xs text-[#555] uppercase tracking-wider mb-3">
                {editingModifierIdx !== null ? '✏️ Editando extra' : '+ Nuevo Extra'}
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={modifierName}
                  onChange={(e) => setModifierName(e.target.value)}
                  placeholder="Nombre del extra (ej: Añadir aderezo)"
                  className="flex-1 bg-[#111111] border border-[#2a2a2a] focus:border-[#ff5722] text-[#f0f0f0] placeholder-[#333] rounded-xl px-3 py-2.5 focus:outline-none transition-colors text-sm"
                />
                <div className="relative w-36 shrink-0">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ff5722] text-xs select-none">₲</span>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={modifierPrice}
                    onChange={(e) => setModifierPrice(e.target.value)}
                    placeholder="0"
                    className="w-full bg-[#111111] border border-[#2a2a2a] focus:border-[#ff5722] text-[#f0f0f0] placeholder-[#333] rounded-xl pl-7 pr-3 py-2.5 focus:outline-none transition-colors text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddOrUpdateModifier}
                  className="shrink-0 bg-[#ff5722] hover:bg-[#ff6b3d] text-white px-3 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 text-sm"
                >
                  {editingModifierIdx !== null ? <Check size={15} /> : <Plus size={15} />}
                  {editingModifierIdx !== null ? 'Guardar' : 'Agregar'}
                </button>
                {editingModifierIdx !== null && (
                  <button
                    type="button"
                    onClick={handleCancelModifierEdit}
                    className="shrink-0 bg-[#1a1a1a] hover:bg-[#252525] text-[#888] hover:text-[#d0d0d0] px-3 py-2.5 rounded-xl transition-colors border border-[#2a2a2a] text-sm"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
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
