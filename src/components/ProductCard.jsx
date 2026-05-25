import { Link } from 'react-router-dom'

const formatPrice = (value) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value)

export default function ProductCard({ product, onDelete }) {
  const lowStock = product.stock <= 5

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <img
          src={product.imagen}
          alt={product.nombre}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src =
              'https://placehold.co/400x400/e2e8f0/64748b?text=Sin+imagen'
          }}
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-700 shadow">
          {product.categoria}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="line-clamp-2 text-base font-semibold text-slate-900">
          {product.nombre}
        </h3>
        <p className="text-xl font-bold text-brand-700">{formatPrice(product.precio)}</p>
        <p
          className={`text-sm font-medium ${
            lowStock ? 'text-amber-600' : 'text-slate-500'
          }`}
        >
          Stock: {product.stock} unidades
          {lowStock && ' · Bajo inventario'}
        </p>

        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          <Link
            to={`/productos/${product.id}/editar`}
            className="flex-1 rounded-lg bg-brand-600 px-3 py-2 text-center text-sm font-medium text-white transition hover:bg-brand-700"
          >
            Editar
          </Link>
          <button
            type="button"
            onClick={() => onDelete(product)}
            className="flex-1 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            Eliminar
          </button>
        </div>
      </div>
    </article>
  )
}
