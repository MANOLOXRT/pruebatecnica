const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3010/productos'

function logApi(method, detail, data) {
  if (!import.meta.env.DEV) return
  console.log(`[API] ${method}`, detail, data ?? '')
}

async function handleResponse(response, method, url) {
  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText)
    logApi(method, `ERROR ${response.status} ${url}`, message)
    throw new Error(message || `Error HTTP ${response.status}`)
  }
  if (response.status === 204) {
    logApi(method, `OK ${url}`, '(sin contenido)')
    return null
  }
  const data = await response.json()
  logApi(method, `OK ${url}`, data)
  return data
}

export async function fetchProducts() {
  logApi('GET', API_URL)
  const response = await fetch(API_URL)
  return handleResponse(response, 'GET', API_URL)
}

export async function fetchProductById(id) {
  const url = `${API_URL}/${id}`
  logApi('GET', url)
  const response = await fetch(url)
  return handleResponse(response, 'GET', url)
}

export async function createProduct(product) {
  logApi('POST', API_URL, product)
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  })
  return handleResponse(response, 'POST', API_URL)
}

export async function updateProduct(id, product) {
  const url = `${API_URL}/${id}`
  logApi('PUT', url, product)
  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...product, id }),
  })
  return handleResponse(response, 'PUT', url)
}

export async function deleteProduct(id) {
  const url = `${API_URL}/${id}`
  logApi('DELETE', url)
  const response = await fetch(url, { method: 'DELETE' })
  return handleResponse(response, 'DELETE', url)
}

export { API_URL }
