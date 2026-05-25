import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { deleteProduct, fetchProducts } from '../services/api'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  const loadProducts = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchProducts()
      setProducts(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'No se pudo cargar el inventario')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return products
    return products.filter(
      (p) =>
        p.nombre?.toLowerCase().includes(term) ||
        p.categoria?.toLowerCase().includes(term),
    )
  }, [products, search])

  async function handleDelete(product) {
    const result = await Swal.fire({
      title: '¿Eliminar producto?',
      html: `Se eliminará <strong>${product.nombre}</strong> del catálogo. Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    })

    if (!result.isConfirmed) return

    setDeletingId(product.id)
    try {
      await deleteProduct(product.id)
      setProducts((prev) => prev.filter((p) => p.id !== product.id))
      await Swal.fire({
        title: 'Eliminado',
        text: 'El producto fue eliminado del catálogo correctamente.',
        icon: 'success',
        confirmButtonColor: '#4f46e5',
      })
    } catch (err) {
      await Swal.fire({
        title: 'Error',
        text: err.message || 'No se pudo eliminar el producto',
        icon: 'error',
        confirmButtonColor: '#4f46e5',
      })
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Inventario de productos</h2>
          <p className="mt-1 text-slate-500">
            {loading ? 'Sincronizando...' : `${products.length} productos en catálogo`}
          </p>
        </div>
        <Link
          to="/productos/nuevo"
          className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          + Nuevo producto
        </Link>
      </div>

      <div className="mb-6">
        <label htmlFor="search" className="sr-only">
          Buscar productos
        </label>
        <input
          id="search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre o categoría..."
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 sm:max-w-md"
        />
      </div>

      {loading && <LoadingSpinner label="Cargando inventario..." />}

      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="font-medium text-red-800">{error}</p>
          <p className="mt-2 text-sm text-red-600">
            Verifica que JSON Server esté activo: <code>npm run api</code>
          </p>
          <button
            type="button"
            onClick={loadProducts}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      )}

      {!loading && !error && filteredProducts.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <p className="text-slate-600">
            {search ? 'No hay productos que coincidan con la búsqueda.' : 'No hay productos registrados.'}
          </p>
          {!search && (
            <Link
              to="/productos/nuevo"
              className="mt-4 inline-block text-sm font-semibold text-brand-600 hover:underline"
            >
              Crear el primer producto
            </Link>
          )}
        </div>
      )}

      {!loading && !error && filteredProducts.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onDelete={deletingId === product.id ? () => {} : handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
