import { Link, useLocation } from 'react-router-dom'
import { clearSession, getSession } from '../services/auth'

export default function Navbar({ onLogout }) {
  const { username } = getSession() || {}
  const location = useLocation()

  const navLinkClass = (path) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      location.pathname === path
        ? 'bg-brand-600 text-white'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`

  function handleLogout() {
    clearSession()
    onLogout()
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-lg font-bold text-white">
            E
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
              E-Commerce
            </p>
            <h1 className="text-lg font-bold text-slate-900">Panel de inventario</h1>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-2">
          <Link to="/productos" className={navLinkClass('/productos')}>
            Inventario
          </Link>
          <Link to="/productos/nuevo" className={navLinkClass('/productos/nuevo')}>
            Nuevo producto
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-slate-600 sm:inline">
            Hola, <strong className="text-slate-900">{username}</strong>
          </span>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  )
}
