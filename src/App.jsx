import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './layouts/DashboardLayout'
import LoginPage from './pages/LoginPage'
import EditProductPage from './pages/EditProductPage'
import NewProductPage from './pages/NewProductPage'
import ProductsPage from './pages/ProductsPage'
import { isAuthenticated } from './services/auth'

function PublicOnly({ children }) {
  if (isAuthenticated()) {
    return <Navigate to="/productos" replace />
  }
  return children
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicOnly>
            <LoginPage />
          </PublicOnly>
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/productos" element={<ProductsPage />} />
        <Route path="/productos/nuevo" element={<NewProductPage />} />
        <Route path="/productos/:id/editar" element={<EditProductPage />} />
      </Route>

      <Route path="/" element={<Navigate to="/productos" replace />} />
      <Route path="*" element={<Navigate to="/productos" replace />} />
    </Routes>
  )
}
