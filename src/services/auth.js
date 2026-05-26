const AUTH_KEY = 'ecommerce_admin_session'

export function getSession() {
  const raw = localStorage.getItem(AUTH_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function saveSession(username, pin) {
  const session = {
    username,
    pin,
    loggedAt: new Date().toISOString(),
  }
  localStorage.setItem(AUTH_KEY, JSON.stringify(session))
  if (import.meta.env.DEV) {
    console.log('[Auth] Sesión iniciada:', { username, loggedAt: session.loggedAt })
  }
  return session
}

export function clearSession() {
  localStorage.removeItem(AUTH_KEY)
  if (import.meta.env.DEV) {
    console.log('[Auth] Sesión cerrada')
  }
}

export function isAuthenticated() {
  return Boolean(getSession()?.username)
}
