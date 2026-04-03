import { useState } from 'react';
import { X, Check } from 'lucide-react';
import type { Product, Modifier } from '../types';
import { formatPrice } from '../utils/currency';

interface ModifierModalProps {
  product: Product;
  onConfirm: (modifiers: string[]) => void;
  onClose: () => void;
}

export function ModifierModal({ product, onConfirm, onClose }: ModifierModalProps) {
  const [selectedModifiers, setSelectedModifiers] = useState<string[]>([]);

  const toggleModifier = (modifierName: string) => {
    setSelectedModifiers(prev =>
      prev.includes(modifierName)
        ? prev.filter(m => m !== modifierName)
        : [...prev, modifierName]
    );
  };

  const handleConfirm = () => {
    onConfirm(selectedModifiers);
  };

  if (!product.modifiers || product.modifiers.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#111111] rounded-2xl border border-[#1e1e1e] max-w-md w-full overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-[#1a1a1a] flex items-center justify-between">
          <div>
            <h3 className="text-[#d0d0d0]">Personalizar {product.name}</h3>
            <p className="text-xs text-[#444] mt-1">Seleccioná las modificaciones</p>
          </div>
          <button onClick={onClose} className="text-[#444] hover:text-[#d0d0d0] transition-colors">
            <X size={22} />
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="space-y-2.5">
            {product.modifiers.map((modifier) => (
              <button
                key={modifier.name}
                onClick={() => toggleModifier(modifier.name)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                  selectedModifiers.includes(modifier.name)
                    ? 'border-[#ff5722] bg-[#ff5722]/8'
                    : 'border-[#1a1a1a] hover:border-[#252525] bg-[#0d0d0d]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                    selectedModifiers.includes(modifier.name)
                      ? 'border-[#ff5722] bg-[#ff5722]'
                      : 'border-[#2a2a2a]'
                  }`}>
                    {selectedModifiers.includes(modifier.name) && (
                      <Check size={12} className="text-white" />
                    )}
                  </div>
                  <span className="text-[#d0d0d0] text-sm">{modifier.name}</span>
                </div>
                {modifier.price !== 0 && (
                  <span className={`text-sm ${modifier.price > 0 ? 'text-[#ff5722]' : 'text-green-400'}`}>
                    {modifier.price > 0 ? '+' : ''}{formatPrice(Math.abs(modifier.price))}
                  </span>
                )}
              </button>
            ))}
          </div>
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
            className="flex-1 bg-[#ff5722] hover:bg-[#e64a19] text-white py-3 rounded-xl transition-all duration-200 shadow-lg shadow-[#ff5722]/25 text-sm"
          >
            Agregar al Pedido
          </button>
        </div>
      </div>
    </div>
  );
}