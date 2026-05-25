import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAuthenticated, saveSession } from '../services/auth'

export default function LoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/productos', { replace: true })
    }
  }, [navigate])

  function handleSubmit(e) {
    e.preventDefault()
    if (!username.trim()) {
      setError('Ingresa tu nombre de usuario')
      return
    }
    if (!pin.trim()) {
      setError('Ingresa tu PIN de acceso')
      return
    }
    saveSession(username.trim(), pin)
    navigate('/productos', { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-800 via-brand-700 to-slate-900 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-2xl font-bold text-white">
            E
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Acceso administrativo</h1>
          <p className="mt-2 text-sm text-slate-500">
            Gestiona el inventario de la tienda en línea
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="mb-1 block text-sm font-medium text-slate-700">
              Nombre de usuario
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                setError('')
              }}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              placeholder="admin"
              autoComplete="username"
            />
          </div>

          <div>
            <label htmlFor="pin" className="mb-1 block text-sm font-medium text-slate-700">
              PIN
            </label>
            <input
              id="pin"
              type="password"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value)
                setError('')
              }}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              placeholder="••••"
              autoComplete="current-password"
            />
            <p className="mt-1 text-xs text-slate-400">Simulación: cualquier PIN es válido</p>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-brand-600 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Ingresar al panel
          </button>
        </form>
      </div>
    </div>
  )
}
