import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await register(name, email, password, passwordConfirmation)
      navigate('/')
    } catch {
      setError('Não foi possível criar a conta. Verifica os dados.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto">
      <h1 className="text-2xl font-extrabold text-ink tracking-tight mb-6">Criar conta</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink/70 mb-1">Nome</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-black/10 rounded-xl px-4 py-2.5 outline-none focus:border-accent transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink/70 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-black/10 rounded-xl px-4 py-2.5 outline-none focus:border-accent transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink/70 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full border border-black/10 rounded-xl px-4 py-2.5 outline-none focus:border-accent transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink/70 mb-1">Confirmar password</label>
          <input
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
            className="w-full border border-black/10 rounded-xl px-4 py-2.5 outline-none focus:border-accent transition"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-accent hover:bg-accent-hover disabled:opacity-50 text-white font-medium py-2.5 rounded-xl transition"
        >
          {isSubmitting ? 'A criar...' : 'Criar conta'}
        </button>
      </form>

      <p className="text-sm text-ink/60 mt-4">
        Já tens conta?{' '}
        <Link to="/login" className="text-accent font-medium">Entrar</Link>
      </p>
    </div>
  )
}