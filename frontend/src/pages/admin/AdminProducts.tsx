import { useEffect, useState, type FormEvent } from 'react'
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../api/products'
import { getCategories } from '../../api/categories'
import type { Product } from '../../types/Product'
import type { Category } from '../../types/Category'

const emptyForm = { category_id: '', name: '', description: '', price: '', stock: '' }

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)

  useEffect(() => {
    getCategories().then(setCategories)
    loadProducts()
  }, [])

  function loadProducts(targetPage: number = page) {
    setIsLoading(true)
    getProducts({ page: targetPage })
        .then((response) => {
        setProducts(response.data)
        setLastPage(response.meta.last_page)
        setPage(targetPage)
        })
        .finally(() => setIsLoading(false))
    }

  function startEdit(product: Product) {
    setEditingId(product.id)
    setForm({
      category_id: String(product.category?.id ?? ''),
      name: product.name,
      description: product.description ?? '',
      price: String(product.price),
      stock: String(product.stock),
    })
    setError(null)
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(emptyForm)
    setError(null)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const payload = {
      category_id: Number(form.category_id),
      name: form.name,
      description: form.description,
      price: Number(form.price),
      stock: Number(form.stock),
    }

    try {
      if (editingId) {
        await updateProduct(editingId, payload)
      } else {
        await createProduct(payload)
      }
      cancelEdit()
      loadProducts()
    } catch {
      setError('Não foi possível guardar. Verifica os campos.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Apagar este produto? Esta ação não pode ser desfeita.')) return

    try {
      await deleteProduct(id)
      loadProducts()
    } catch {
      alert('Não foi possível apagar este produto.')
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink tracking-tight mb-6">Produtos</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm mb-8 max-w-2xl">
        <h2 className="font-semibold text-ink mb-4">
          {editingId ? `A editar produto #${editingId}` : 'Novo produto'}
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-ink/70 mb-1">Nome</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full border border-black/10 rounded-xl px-4 py-2.5 outline-none focus:border-accent transition"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-ink/70 mb-1">Descrição</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className="w-full border border-black/10 rounded-xl px-4 py-2.5 outline-none focus:border-accent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink/70 mb-1">Categoria</label>
            <select
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              required
              className="w-full border border-black/10 rounded-xl px-4 py-2.5 outline-none focus:border-accent transition"
            >
              <option value="">Selecionar...</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink/70 mb-1">Preço (Kz)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
                className="w-full border border-black/10 rounded-xl px-4 py-2.5 outline-none focus:border-accent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink/70 mb-1">Stock</label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                required
                className="w-full border border-black/10 rounded-xl px-4 py-2.5 outline-none focus:border-accent transition"
              />
            </div>
          </div>
        </div>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-accent hover:bg-accent-hover disabled:opacity-40 text-white font-medium px-5 py-2.5 rounded-xl transition"
          >
            {editingId ? 'Guardar alterações' : 'Criar produto'}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit} className="text-ink/60 hover:text-ink px-3 transition">
              Cancelar
            </button>
          )}
        </div>
      </form>

      {isLoading ? (
        <p className="text-ink/50">A carregar...</p>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between px-5 py-3 border-b border-black/5 last:border-0"
            >
              <div>
                <p className="font-medium text-ink">{product.name}</p>
                <p className="text-xs text-ink/40">
                  {product.category?.name ?? 'Sem categoria'} · {product.price.toLocaleString('pt-AO', { minimumFractionDigits: 2 })} Kz · {product.stock} em stock
                </p>
              </div>
              <div className="flex gap-3 text-sm">
                <button onClick={() => startEdit(product)} className="text-accent hover:underline">
                  Editar
                </button>
                <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:underline">
                  Apagar
                </button>
              </div>
            </div>
          ))}
          {lastPage > 1 && (
  <div className="flex justify-center gap-2 mt-4">
    <button
      disabled={page === 1}
      onClick={() => loadProducts(page - 1)}
      className="px-4 py-2 rounded-xl border border-black/10 disabled:opacity-40 hover:border-accent transition"
    >
      Anterior
    </button>
    <span className="px-4 py-2 text-ink/60 text-sm">
      Página {page} de {lastPage}
    </span>
    <button
      disabled={page === lastPage}
      onClick={() => loadProducts(page + 1)}
      className="px-4 py-2 rounded-xl border border-black/10 disabled:opacity-40 hover:border-accent transition"
    >
      Próxima
    </button>
  </div>
)}
        </div>
      )}
    </div>
  )
}