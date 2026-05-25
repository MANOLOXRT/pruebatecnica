import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import ProductForm, {
  formToPayload,
  productToForm,
  validateProductForm,
} from '../components/ProductForm'
import LoadingSpinner from '../components/LoadingSpinner'
import { fetchProductById, updateProduct } from '../services/api'

export default function EditProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError('')
      try {
        const product = await fetchProductById(id)
        if (!cancelled) setForm(productToForm(product))
      } catch (err) {
        if (!cancelled) setError(err.message || 'Producto no encontrado')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [id])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const validation = validateProductForm(form)
    if (Object.keys(validation).length > 0) {
      setErrors(validation)
      return
    }

    setSaving(true)
    try {
      await updateProduct(id, formToPayload(form))
      await Swal.fire({
        title: 'Actualizado',
        text: 'Los datos del producto fueron guardados.',
        icon: 'success',
        confirmButtonColor: '#4f46e5',
      })
      navigate('/productos')
    } catch (err) {
      await Swal.fire({
        title: 'Error',
        text: err.message || 'No se pudo actualizar el producto',
        icon: 'error',
        confirmButtonColor: '#4f46e5',
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingSpinner label="Cargando producto..." />

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
        <p className="font-medium text-red-800">{error}</p>
        <Link to="/productos" className="mt-4 inline-block text-sm font-semibold text-brand-600">
          Volver al inventario
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <Link to="/productos" className="text-sm font-medium text-brand-600 hover:underline">
          ← Volver al inventario
        </Link>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">Editar producto</h2>
        <p className="text-slate-500">Actualiza precio, stock y demás información del artículo.</p>
      </div>

      <ProductForm
        form={form}
        errors={errors}
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitLabel="Guardar cambios"
        loading={saving}
      />
    </div>
  )
}
