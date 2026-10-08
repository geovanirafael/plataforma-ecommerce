import { useEffect, useState, type FormEvent } from 'react'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../api/categories'
import type { Category } from '../../types/Category'

export function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [name, setName] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadCategories()
  }, [])

  function loadCategories() {
    setIsLoading(true)
    getCategories()
      .then(setCategories)
      .finally(() => setIsLoading(false))
  }

  function startEdit(category: Category) {
    setEditingId(category.id)
    setName(category.name)
    setError(null)
  }

  function cancelEdit() {
    setEditingId(null)
    setName('')
    setError(null)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      if (editingId) {
        await updateCategory(editingId, name)
      } else {
        await createCategory(name)
      }
      cancelEdit()
      loadCategories()
    } catch {
      setError('Não foi possível guardar. O nome pode já estar em uso.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Apagar esta categoria? Esta ação não pode ser desfeita.')) return

    try {
      await deleteCategory(id)
      loadCategories()
    } catch {
      alert('Não foi possível apagar. Pode haver produtos associados a esta categoria.')
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink tracking-tight mb-6">Categorias</h1>

      <form onSubmit={handleSubmit} className="flex gap-3 mb-8 max-w-md">
        <input
          type="text"
          placeholder="Nome da categoria"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="flex-1 border border-black/10 rounded-xl px-4 py-2.5 outline-none focus:border-accent transition"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-accent hover:bg-accent-hover disabled:opacity-40 text-white font-medium px-5 py-2.5 rounded-xl transition"
        >
          {editingId ? 'Guardar' : 'Adicionar'}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={cancelEdit}
            className="text-ink/60 hover:text-ink px-3 transition"
          >
            Cancelar
          </button>
        )}
      </form>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {isLoading ? (
        <p className="text-ink/50">A carregar...</p>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between px-5 py-3 border-b border-black/5 last:border-0"
            >
              <div>
                <p className="font-medium text-ink">{category.name}</p>
                <p className="text-xs text-ink/40">{category.slug}</p>
              </div>
              <div className="flex gap-3 text-sm">
                <button onClick={() => startEdit(category)} className="text-accent hover:underline">
                  Editar
                </button>
                <button onClick={() => handleDelete(category.id)} className="text-red-600 hover:underline">
                  Apagar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}