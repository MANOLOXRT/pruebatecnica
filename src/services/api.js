const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/productos'

async function handleResponse(response) {
  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText)
    throw new Error(message || `Error HTTP ${response.status}`)
  }
  if (response.status === 204) return null
  return response.json()
}

export async function fetchProducts() {
  const response = await fetch(API_URL)
  return handleResponse(response)
}

export async function fetchProductById(id) {
  const response = await fetch(`${API_URL}/${id}`)
  return handleResponse(response)
}

export async function createProduct(product) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  })
  return handleResponse(response)
}

export async function updateProduct(id, product) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...product, id }),
  })
  return handleResponse(response)
}

export async function deleteProduct(id) {
  const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
  return handleResponse(response)
}

export { API_URL }
