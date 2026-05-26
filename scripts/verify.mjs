const API_URL = process.env.VITE_API_URL || 'http://localhost:3010/productos'
const VITE_URL = process.env.VITE_URL || 'http://localhost:5180'

const checks = []

function ok(name, detail = '') {
  checks.push({ name, status: 'OK', detail })
  console.log(`  ✅ ${name}${detail ? ` — ${detail}` : ''}`)
}

function fail(name, detail = '') {
  checks.push({ name, status: 'FAIL', detail })
  console.log(`  ❌ ${name}${detail ? ` — ${detail}` : ''}`)
}

async function testApi() {
  console.log('\n📡 API (JSON Server / MockAPI)')
  try {
    const res = await fetch(API_URL)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    if (!Array.isArray(data)) throw new Error('La respuesta no es un array')
    ok('GET /productos', `${data.length} productos`)
    if (data.length > 0) {
      const p = data[0]
      const fields = ['id', 'nombre', 'precio', 'categoria', 'stock', 'imagen']
      const missing = fields.filter((f) => p[f] === undefined)
      if (missing.length) fail('Campos del producto', `Faltan: ${missing.join(', ')}`)
      else ok('Estructura producto', fields.join(', '))
    }
    return data
  } catch (err) {
    fail('GET /productos', err.message)
    return null
  }
}

async function testCrud(sampleId) {
  console.log('\n🔄 CRUD (lectura + prueba POST/DELETE)')
  if (!sampleId) {
    fail('CRUD', 'Sin productos de referencia')
    return
  }

  try {
    const getOne = await fetch(`${API_URL}/${sampleId}`)
    if (!getOne.ok) throw new Error(`GET by id HTTP ${getOne.status}`)
    ok('GET /productos/:id', `id=${sampleId}`)
  } catch (err) {
    fail('GET /productos/:id', err.message)
  }

  const testProduct = {
    nombre: '[TEST] Producto verificación',
    precio: 1000,
    categoria: 'Hogar',
    stock: 1,
    imagen: 'https://placehold.co/100x100',
  }

  let createdId = null
  try {
    const postRes = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testProduct),
    })
    if (!postRes.ok) throw new Error(`POST HTTP ${postRes.status}`)
    const created = await postRes.json()
    createdId = created.id
    ok('POST /productos', `id creado=${createdId}`)
  } catch (err) {
    fail('POST /productos', err.message)
  }

  if (createdId) {
    try {
      const putRes = await fetch(`${API_URL}/${createdId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...testProduct, id: createdId, stock: 2 }),
      })
      if (!putRes.ok) throw new Error(`PUT HTTP ${putRes.status}`)
      ok('PUT /productos/:id', 'stock actualizado a 2')
    } catch (err) {
      fail('PUT /productos/:id', err.message)
    }

    try {
      const delRes = await fetch(`${API_URL}/${createdId}`, { method: 'DELETE' })
      if (!delRes.ok && delRes.status !== 204) throw new Error(`DELETE HTTP ${delRes.status}`)
      ok('DELETE /productos/:id', 'producto de prueba eliminado')
    } catch (err) {
      fail('DELETE /productos/:id', err.message)
    }
  }
}

async function testVite() {
  console.log('\n🌐 Frontend (Vite)')
  const url = 'http://localhost:5180'
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(2000) })
    if (res.ok) ok('Servidor Vite activo', url)
    else fail('Servidor Vite', `HTTP ${res.status} en ${url}`)
  } catch (err) {
    fail('Servidor Vite', `${url} — ${err.message}`)
  }
}

async function main() {
  console.log('═══════════════════════════════════════════')
  console.log('  VERIFICACIÓN — Panel E-Commerce Inventario')
  console.log('═══════════════════════════════════════════')
  console.log(`  API URL: ${API_URL}`)

  const products = await testApi()
  await testCrud(products?.[0]?.id)
  await testVite()

  const passed = checks.filter((c) => c.status === 'OK').length
  const failed = checks.filter((c) => c.status === 'FAIL').length

  console.log('\n═══════════════════════════════════════════')
  console.log(`  Resultado: ${passed} OK · ${failed} FAIL · ${checks.length} pruebas`)
  console.log('═══════════════════════════════════════════\n')

  if (failed > 0) {
    console.log('  💡 Ejecuta: npm run dev  →  http://localhost:5180/login')
    process.exit(1)
  }
}

main()
