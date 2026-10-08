import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export function Layout() {
  const { isAuthenticated, user, logout } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-black/5 bg-background/80 backdrop-blur sticky top-0 z-10">
        <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-extrabold text-lg tracking-tight text-ink">
            E-commerce
          </Link>

          <div className="flex items-center gap-6 text-sm font-medium text-ink/70">
            <Link to="/" className="hover:text-ink transition">Produtos</Link>
            {isAuthenticated && (
              <Link to="/orders" className="hover:text-ink transition">Pedidos</Link>
            )}
            <Link to="/cart" className="hover:text-ink transition relative">
              Carrinho
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-4 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            {user?.role === 'admin' && (
              <>
                <Link to="/admin/dashboard" className="hover:text-ink transition">Admin</Link>
                <Link to="/admin/categories" className="hover:text-ink transition">Categorias</Link>
                <Link to="/admin/products" className="hover:text-ink transition">Produtos</Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-ink/70">Olá, {user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-ink/70 hover:text-ink transition"
                >
                  Sair
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-accent hover:bg-accent-hover text-white text-sm font-medium px-4 py-2 rounded-xl transition"
              >
                Entrar
              </Link>
            )}
          </div>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}