import { execSync } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const PROJECT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PORTS = [3010, 5180, 3001, 3002, 5173, 5174, 5175]

function getListeningPids(port) {
  try {
    const output = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8' })
    const pids = new Set()
    for (const line of output.split('\n')) {
      if (!line.includes('LISTENING')) continue
      const parts = line.trim().split(/\s+/)
      const pid = parts[parts.length - 1]
      if (pid && /^\d+$/.test(pid)) pids.add(pid)
    }
    return [...pids]
  } catch {
    return []
  }
}

function getProcessCommand(pid) {
  try {
    const out = execSync(
      `powershell -NoProfile -Command "(Get-CimInstance Win32_Process -Filter 'ProcessId=${pid}').CommandLine"`,
      { encoding: 'utf8' },
    )
    return out.trim()
  } catch {
    return ''
  }
}

function belongsToThisProject(commandLine) {
  const normalized = commandLine.replace(/\\/g, '/').toLowerCase()
  const project = PROJECT_DIR.replace(/\\/g, '/').toLowerCase()
  return normalized.includes(project)
}

console.log('Liberando solo procesos de ESTE proyecto:')
console.log(`  ${PROJECT_DIR}\n`)

let closed = 0

for (const port of PORTS) {
  const pids = getListeningPids(port)
  if (pids.length === 0) {
    console.log(`  Puerto ${port}: libre`)
    continue
  }

  for (const pid of pids) {
    const cmd = getProcessCommand(pid)
    if (!belongsToThisProject(cmd)) {
      console.log(`  Puerto ${port}: PID ${pid} ignorado (otro proyecto)`)
      continue
    }
    try {
      execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' })
      console.log(`  Puerto ${port}: cerrado PID ${pid} (ema.prubatecnica)`)
      closed++
    } catch {
      console.log(`  Puerto ${port}: no se pudo cerrar PID ${pid}`)
    }
  }
}

console.log(`\n${closed} proceso(s) de este proyecto cerrado(s).`)
console.log('Otros proyectos (ej. dechifrom) NO se tocan.\n')
console.log('App: http://localhost:5180/login')
console.log('API: http://localhost:3010/productos\n')
