import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import ProductForm, {
  formToPayload,
  getEmptyProductForm,
  validateProductForm,
} from '../components/ProductForm'
import { createProduct } from '../services/api'

export default function NewProductPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(getEmptyProductForm())
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

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

    setLoading(true)
    try {
      await createProduct(formToPayload(form))
      await Swal.fire({
        title: 'Producto creado',
        text: 'El artículo fue añadido al catálogo.',
        icon: 'success',
        confirmButtonColor: '#4f46e5',
      })
      navigate('/productos')
    } catch (err) {
      await Swal.fire({
        title: 'Error',
        text: err.message || 'No se pudo crear el producto',
        icon: 'error',
        confirmButtonColor: '#4f46e5',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <Link to="/productos" className="text-sm font-medium text-brand-600 hover:underline">
          ← Volver al inventario
        </Link>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">Nuevo producto</h2>
        <p className="text-slate-500">Completa el formulario para añadir un artículo al catálogo.</p>
      </div>

      <ProductForm
        form={form}
        errors={errors}
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitLabel="Crear producto"
        loading={loading}
      />
    </div>
  )
}
