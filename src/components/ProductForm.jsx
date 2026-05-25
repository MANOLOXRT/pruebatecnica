const CATEGORIES = ['Ropa', 'Electrónica', 'Hogar']

const emptyForm = {
  nombre: '',
  precio: '',
  categoria: 'Ropa',
  stock: '',
  imagen: '',
}

export function getEmptyProductForm() {
  return { ...emptyForm }
}

export function productToForm(product) {
  if (!product) return getEmptyProductForm()
  return {
    nombre: product.nombre ?? '',
    precio: String(product.precio ?? ''),
    categoria: product.categoria ?? 'Ropa',
    stock: String(product.stock ?? ''),
    imagen: product.imagen ?? '',
  }
}

export function validateProductForm(form) {
  const errors = {}
  if (!form.nombre.trim()) errors.nombre = 'El nombre es obligatorio'

  const precio = Number(form.precio)
  if (form.precio === '' || Number.isNaN(precio)) {
    errors.precio = 'Ingresa un precio válido'
  } else if (precio < 0) {
    errors.precio = 'El precio no puede ser negativo'
  }

  const stock = Number(form.stock)
  if (form.stock === '' || Number.isNaN(stock)) {
    errors.stock = 'Ingresa un stock válido'
  } else if (stock < 0) {
    errors.stock = 'El stock no puede ser negativo'
  }

  if (!form.categoria) errors.categoria = 'Selecciona una categoría'
  if (!form.imagen.trim()) {
    errors.imagen = 'La URL de imagen es obligatoria'
  }

  return errors
}

export function formToPayload(form) {
  return {
    nombre: form.nombre.trim(),
    precio: Number(form.precio),
    categoria: form.categoria,
    stock: Number(form.stock),
    imagen: form.imagen.trim(),
  }
}

export default function ProductForm({ form, errors, onChange, onSubmit, submitLabel, loading }) {
  return (
    <form onSubmit={onSubmit} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="nombre" className="mb-1 block text-sm font-medium text-slate-700">
            Nombre del producto
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            value={form.nombre}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            placeholder="Ej. Camiseta premium"
          />
          {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
        </div>

        <div>
          <label htmlFor="precio" className="mb-1 block text-sm font-medium text-slate-700">
            Precio (COP)
          </label>
          <input
            id="precio"
            name="precio"
            type="number"
            min="0"
            step="1"
            value={form.precio}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            placeholder="0"
          />
          {errors.precio && <p className="mt-1 text-sm text-red-600">{errors.precio}</p>}
        </div>

        <div>
          <label htmlFor="stock" className="mb-1 block text-sm font-medium text-slate-700">
            Stock disponible
          </label>
          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            step="1"
            value={form.stock}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            placeholder="0"
          />
          {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
        </div>

        <div>
          <label htmlFor="categoria" className="mb-1 block text-sm font-medium text-slate-700">
            Categoría
          </label>
          <select
            id="categoria"
            name="categoria"
            value={form.categoria}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.categoria && (
            <p className="mt-1 text-sm text-red-600">{errors.categoria}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="imagen" className="mb-1 block text-sm font-medium text-slate-700">
            URL de imagen
          </label>
          <input
            id="imagen"
            name="imagen"
            type="url"
            value={form.imagen}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            placeholder="https://..."
          />
          {errors.imagen && <p className="mt-1 text-sm text-red-600">{errors.imagen}</p>}
        </div>
      </div>

      {form.imagen && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Vista previa
          </p>
          <img
            src={form.imagen}
            alt="Vista previa"
            className="mx-auto h-40 w-40 rounded-lg object-cover"
            onError={(e) => {
              e.currentTarget.src =
                'https://placehold.co/160x160/e2e8f0/64748b?text=Preview'
            }}
          />
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-[200px]"
      >
        {loading ? 'Guardando...' : submitLabel}
      </button>
    </form>
  )
}
