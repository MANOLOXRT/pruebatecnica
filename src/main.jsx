import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { API_URL } from './services/api.js'
import { isAuthenticated, getSession } from './services/auth.js'
import './index.css'
import App from './App.jsx'

if (import.meta.env.DEV) {
  console.log('═══════════════════════════════════════════')
  console.log('  Panel E-Commerce — modo desarrollo')
  console.log('  API:', API_URL)
  console.log('  Sesión:', isAuthenticated() ? getSession()?.username : 'no autenticado')
  console.log('  App:  http://localhost:5180/login')
  console.log('  Rutas: /login · /productos · /productos/nuevo')
  console.log('═══════════════════════════════════════════')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
