import { useEffect, useState } from 'react'
import { getProducts } from '../api/products'
import { getCategories } from '../api/categories'
import { useDebounce } from '../hooks/useDebounce'
import { ProductCard } from '../components/ProductCard'
import type { Product } from '../types/Product'
import type { Category } from '../types/Category'

export function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const debouncedSearch = useDebounce(search, 400)

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    setIsLoading(true)
    setError(null)

    getProducts({
      search: debouncedSearch || undefined,
      category_id: categoryId ?? undefined,
      page,
    })
      .then((response) => {
        setProducts(response.data)
        setLastPage(response.meta.last_page)
      })
      .catch(() => setError('Não foi possível carregar os produtos.'))
      .finally(() => setIsLoading(false))
  }, [debouncedSearch, categoryId, page])

  function handleSearchChange(value: string) {
    setSearch(value)
    setPage(1)
  }

  function handleCategoryChange(id: number | null) {
    setCategoryId(id)
    setPage(1)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-ink tracking-tight mb-2">
          Innovative products designed for you
        </h1>
        <p className="text-ink/60">Explora o nosso catálogo.</p>
      </div>

      <input
        type="text"
        placeholder="Procurar produtos..."
        value={search}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="w-full max-w-md border border-black/10 rounded-xl px-4 py-2.5 mb-4 outline-none focus:border-accent transition"
      />

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => handleCategoryChange(null)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
            categoryId === null
              ? 'bg-accent text-white'
              : 'bg-surface text-ink/70 hover:bg-black/5'
          }`}
        >
          Todas
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryChange(category.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              categoryId === category.id
                ? 'bg-accent text-white'
                : 'bg-surface text-ink/70 hover:bg-black/5'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {isLoading && <p className="text-ink/50">A carregar...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!isLoading && !error && products.length === 0 && (
        <p className="text-ink/50">Nenhum produto encontrado.</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {lastPage > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 rounded-xl border border-black/10 disabled:opacity-40 hover:border-accent transition"
          >
            Anterior
          </button>
          <span className="px-4 py-2 text-ink/60 text-sm">
            Página {page} de {lastPage}
          </span>
          <button
            disabled={page === lastPage}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 rounded-xl border border-black/10 disabled:opacity-40 hover:border-accent transition"
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  )
}