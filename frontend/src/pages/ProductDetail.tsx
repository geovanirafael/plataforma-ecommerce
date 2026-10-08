import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getProduct } from '../api/products'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import type { Product } from '../types/Product'

export function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  const { addItem } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!id) return

    setIsLoading(true)
    getProduct(Number(id))
      .then(setProduct)
      .catch(() => setError('Produto não encontrado.'))
      .finally(() => setIsLoading(false))
  }, [id])

  async function handleAddToCart() {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    if (!product) return

    setIsAdding(true)
    try {
      await addItem(product.id, 1)
    } catch {
      setError('Não foi possível adicionar ao carrinho.')
    } finally {
      setIsAdding(false)
    }
  }

  if (isLoading) return <p className="text-ink/50">A carregar...</p>
  if (error) return <p className="text-red-600">{error}</p>
  if (!product) return null

  return (
    <div>
      <Link to="/" className="text-sm text-accent font-medium mb-6 inline-block">
        ← Voltar aos produtos
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square bg-surface rounded-2xl flex items-center justify-center text-ink/30">
          Sem imagem
        </div>

        <div>
          {product.category && (
            <span className="inline-block text-xs font-medium text-accent bg-accent/10 px-2.5 py-1 rounded-full mb-3">
              {product.category.name}
            </span>
          )}

          <h1 className="text-2xl font-extrabold text-ink tracking-tight mb-2">
            {product.name}
          </h1>

          <p className="text-2xl font-bold text-accent mb-4">
            {product.price.toLocaleString('pt-AO', { minimumFractionDigits: 2 })} Kz
          </p>

          <p className="text-ink/70 mb-6">{product.description}</p>

          <p className="text-sm text-ink/50 mb-4">
            {product.stock > 0 ? `${product.stock} em stock` : 'Sem stock'}
          </p>

          <button
            disabled={product.stock === 0 || isAdding}
            onClick={handleAddToCart}
            className="bg-accent hover:bg-accent-hover disabled:opacity-40 text-white font-medium px-6 py-3 rounded-xl transition"
          >
            {isAdding ? 'A adicionar...' : 'Adicionar ao carrinho'}
          </button>
        </div>
      </div>
    </div>
  )
}