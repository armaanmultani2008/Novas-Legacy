import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import 'dotenv/config'

const __dirname = dirname(fileURLToPath(import.meta.url))
const CONFIG_PATH = join(__dirname, 'config.json')

const app = express()
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }))
app.use(express.json())

function readConfig() {
  if (!existsSync(CONFIG_PATH)) {
    const defaults = {
      paypalClientId: process.env.PAYPAL_CLIENT_ID || '',
      adminPasswordHash: process.env.ADMIN_PASSWORD_HASH || '',
    }
    writeFileSync(CONFIG_PATH, JSON.stringify(defaults, null, 2))
    return defaults
  }
  return JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'))
}

function writeConfig(data) {
  writeFileSync(CONFIG_PATH, JSON.stringify(data, null, 2))
}

function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Token mancante' })
  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Token non valido o scaduto' })
  }
}

// Pubblico: restituisce il Client ID PayPal attivo
app.get('/api/paypal-config', (_req, res) => {
  const { paypalClientId, adminPasswordHash } = readConfig()
  res.json({ clientId: paypalClientId, needsSetup: !adminPasswordHash })
})

// Prima configurazione: imposta la password admin (solo se non è ancora impostata)
app.post('/api/admin/setup', async (req, res) => {
  const config = readConfig()
  if (config.adminPasswordHash) return res.status(400).json({ error: 'Setup già completato' })
  const { password } = req.body
  if (!password || password.length < 8) {
    return res.status(400).json({ error: 'Password troppo corta (minimo 8 caratteri)' })
  }
  config.adminPasswordHash = await bcrypt.hash(password, 10)
  writeConfig(config)
  res.json({ ok: true })
})

// Login admin
app.post('/api/admin/login', async (req, res) => {
  const config = readConfig()
  if (!config.adminPasswordHash) return res.status(400).json({ error: 'Setup non completato' })
  const valid = await bcrypt.compare(req.body.password || '', config.adminPasswordHash)
  if (!valid) return res.status(401).json({ error: 'Password errata' })
  const token = jwt.sign({ admin: true }, process.env.JWT_SECRET, { expiresIn: '8h' })
  res.json({ token })
})

// Admin: aggiorna il Client ID PayPal
app.put('/api/admin/paypal-config', auth, (req, res) => {
  const { clientId } = req.body
  if (!clientId?.trim()) return res.status(400).json({ error: 'Client ID non valido' })
  const config = readConfig()
  config.paypalClientId = clientId.trim()
  writeConfig(config)
  res.json({ ok: true })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Backend attivo su porta ${PORT}`))
