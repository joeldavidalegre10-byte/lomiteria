import { Plus } from 'lucide-react';
import type { Product } from '../types';
import { formatPrice } from '../utils/currency';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="bg-[#111111] rounded-2xl overflow-hidden border border-[#1e1e1e] hover:border-[#ff5722]/50 transition-all duration-200 hover:shadow-xl hover:shadow-[#ff5722]/8 cursor-pointer group">
      <div className="relative h-40 bg-gradient-to-br from-[#161616] to-[#0d0d0d] flex items-center justify-center overflow-hidden">
        <span className="text-6xl group-hover:scale-110 transition-transform duration-200">
          {product.emoji}
        </span>
        {product.popular && (
          <div className="absolute top-2.5 right-2.5 bg-[#ff5722] text-white px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider shadow-lg shadow-[#ff5722]/30">
            Popular
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-[#d0d0d0] mb-1">{product.name}</h3>
        <p className="text-xs text-[#444] mb-3 line-clamp-2 min-h-[2.5rem]">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-[#ff5722]">{formatPrice(product.price)}</span>
          <button
            onClick={() => onAddToCart(product)}
            className="bg-[#ff5722] hover:bg-[#e64a19] text-white p-2 rounded-xl transition-all duration-200 shadow-lg shadow-[#ff5722]/20 hover:shadow-[#ff5722]/35"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}