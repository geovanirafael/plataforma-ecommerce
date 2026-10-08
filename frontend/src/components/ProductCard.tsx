import { Link } from 'react-router-dom'
import type { Product } from '../types/Product'

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="block bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition"
    >
      <div className="aspect-square bg-surface rounded-xl mb-3 flex items-center justify-center text-ink/30 text-sm">
        Sem imagem
      </div>

      {product.category && (
        <span className="inline-block text-xs font-medium text-accent bg-accent/10 px-2.5 py-1 rounded-full mb-2">
          {product.category.name}
        </span>
      )}

      <h3 className="font-semibold text-ink truncate">{product.name}</h3>
      <p className="text-ink/60 text-sm mt-1">
        {product.price.toLocaleString('pt-AO', { minimumFractionDigits: 2 })} Kz
      </p>
    </Link>
  )
}