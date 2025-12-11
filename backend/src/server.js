import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"

dotenv.config()
const app = express()
app.disable("x-powered-by")
const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:3000,http://localhost:3001").split(",").map((s) => s.trim()).filter(Boolean)
app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true)
      cb(null, allowedOrigins.includes(origin))
    },
    methods: ["GET", "POST"],
    credentials: false,
  })
)
app.use(express.json({ limit: "100kb" }))
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff")
  res.setHeader("X-Frame-Options", "DENY")
  res.setHeader("Referrer-Policy", "no-referrer")
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin")
  next()
})

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL || "" })
const prisma = new PrismaClient({ adapter })
const PORT = process.env.PORT || 4000
const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  console.error("Missing JWT_SECRET")
  process.exit(1)
}

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })
}
function signAdminToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" })
}

function authMiddleware(req, res, next) {
  try {
    const h = req.headers.authorization || ""
    const token = h.startsWith("Bearer ") ? h.slice(7) : null
    if (!token) return res.status(401).json({ error: "unauthorized" })
    const data = jwt.verify(token, JWT_SECRET)
    req.user = data
    next()
  } catch (e) {
    return res.status(401).json({ error: "unauthorized" })
  }
}

function verifyTelegramInitData(initData, botToken) {
  try {
    const url = new URLSearchParams(initData)
    const hash = url.get("hash")
    url.delete("hash")
    const dataCheckArr = []
    for (const [key, value] of url.entries()) dataCheckArr.push(`${key}=${value}`)
    dataCheckArr.sort()
    const dataCheckString = dataCheckArr.join("\n")
    const secretKey = crypto.createHash("sha256").update(botToken).digest()
    const hmac = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex")
    return hmac === hash
  } catch {
    return false
  }
}

app.post("/api/auth/telegram/verify", rateLimit({ windowMs: 60_000, max: 60 }), async (req, res) => {
  try {
    const { initData } = req.body || {}
    const botToken = process.env.BOT_TOKEN
    if (!initData || !botToken) return res.status(400).json({ error: "bad_request" })
    const ok = verifyTelegramInitData(initData, botToken)
    if (!ok) return res.status(401).json({ error: "invalid_signature" })
    const p = new URLSearchParams(initData)
    const userJson = p.get("user")
    const userObj = userJson ? JSON.parse(userJson) : null
    const telegramId = String(userObj?.id || "")
    if (!telegramId) return res.status(400).json({ error: "no_telegram_id" })
    let user = await prisma.user.findUnique({ where: { telegramId } })
    if (!user) {
      user = await prisma.user.create({ data: { telegramId, displayName: userObj?.first_name || null } })
    }
    const sub = await prisma.subscription.findFirst({ where: { userId: user.id, status: "active" } })
    const token = signToken({ uid: user.id, telegramId })
    return res.json({ token, user: { id: user.id, telegramId, displayName: user.displayName }, subscriptionActive: !!sub })
  } catch (e) {
    return res.status(500).json({ error: "server_error" })
  }
})

app.get("/api/me", authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.uid } })
    if (!user) return res.status(404).json({ error: "not_found" })
    const sub = await prisma.subscription.findFirst({ where: { userId: user.id, status: "active" } })
    return res.json({ user, subscriptionActive: !!sub })
  } catch {
    return res.status(500).json({ error: "server_error" })
  }
})

app.get("/api/podcasts", async (req, res) => {
  const items = await prisma.podcast.findMany({ orderBy: { createdAt: "desc" } })
  return res.json(items)
})

app.post("/api/podcasts", authMiddleware, async (req, res) => {
  try {
    const { slug, title, url } = req.body || {}
    if (!isValidSlug(slug) || !isValidTitle(title) || !isValidUrl(url)) return res.status(400).json({ error: "bad_request" })
    const created = await prisma.podcast.create({ data: { slug, title, url } })
    return res.json(created)
  } catch {
    return res.status(500).json({ error: "server_error" })
  }
})

app.get("/api/astro", async (req, res) => {
  const items = await prisma.astroArticle.findMany({ orderBy: { createdAt: "desc" } })
  return res.json(items)
})

app.post("/api/astro", authMiddleware, async (req, res) => {
  try {
    const { slug, title, url } = req.body || {}
    if (!isValidSlug(slug) || !isValidTitle(title) || !isValidUrl(url)) return res.status(400).json({ error: "bad_request" })
    const created = await prisma.astroArticle.create({ data: { slug, title, url } })
    return res.json(created)
  } catch {
    return res.status(500).json({ error: "server_error" })
  }
})

app.post("/api/progress/view", authMiddleware, async (req, res) => {
  try {
    const { contentType, contentSlug } = req.body || {}
    if (!contentType || !contentSlug) return res.status(400).json({ error: "bad_request" })
    const existing = await prisma.view.findFirst({ where: { userId: req.user.uid, contentType, contentSlug } })
    if (existing) {
      const updated = await prisma.view.update({ where: { id: existing.id }, data: { count: existing.count + 1, lastViewedAt: new Date() } })
      return res.json(updated)
    } else {
      const created = await prisma.view.create({ data: { userId: req.user.uid, contentType, contentSlug, count: 1 } })
      return res.json(created)
    }
  } catch {
    return res.status(500).json({ error: "server_error" })
  }
})

app.get("/api/subscription", authMiddleware, async (req, res) => {
  const sub = await prisma.subscription.findFirst({ where: { userId: req.user.uid, status: "active" } })
  return res.json({ active: !!sub })
})

app.post("/api/subscribe", authMiddleware, async (req, res) => {
  return res.json({ ok: true, message: "init payment placeholder" })
})

app.post("/api/payments/webhook", rateLimit({ windowMs: 60_000, max: 30 }), async (req, res) => {
  try {
    const secret = process.env.WEBHOOK_SECRET
    const sig = req.headers["x-webhook-signature"]
    if (!secret || typeof sig !== "string") return res.status(401).json({ error: "unauthorized" })
    const h = crypto.createHmac("sha256", secret).update(JSON.stringify(req.body || {})).digest("hex")
    if (h !== sig) return res.status(401).json({ error: "unauthorized" })
    return res.json({ ok: true })
  } catch {
    return res.status(500).json({ error: "server_error" })
  }
})

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`)
})
async function ensureAdminCred() {
  try {
    const exists = await prisma.adminCred.findFirst()
    if (!exists) {
      const seed = process.env.ADMIN_SEED_PASS
      if (seed && seed.length >= 6) {
        const hash = bcrypt.hashSync(seed, 10)
        await prisma.adminCred.create({ data: { passHash: hash } })
        console.log("Seeded admin password")
      }
    }
  } catch {}
}

ensureAdminCred()

app.post("/api/admin/login", rateLimit({ windowMs: 10 * 60_000, max: 20 }), async (req, res) => {
  try {
    const { password } = req.body || {}
    if (typeof password !== "string" || !password.length) return res.status(400).json({ error: "bad_request" })
    const cred = await prisma.adminCred.findFirst()
    if (!cred) return res.status(500).json({ error: "no_admin" })
    const ok = bcrypt.compareSync(password, cred.passHash)
    if (!ok) return res.status(401).json({ error: "invalid_password" })
    const token = signAdminToken({ admin: true })
    return res.json({ token })
  } catch {
    return res.status(500).json({ error: "server_error" })
  }
})

function adminMiddleware(req, res, next) {
  try {
    const h = req.headers.authorization || ""
    const token = h.startsWith("Bearer ") ? h.slice(7) : null
    if (!token) return res.status(401).json({ error: "unauthorized" })
    const data = jwt.verify(token, JWT_SECRET)
    if (!data?.admin) return res.status(403).json({ error: "forbidden" })
    next()
  } catch (e) {
    return res.status(401).json({ error: "unauthorized" })
  }
}

app.get("/api/admin/verify", adminMiddleware, async (req, res) => {
  return res.json({ ok: true })
})
const RATE_MAP = new Map()
function rateLimit(opts) {
  const { windowMs, max } = opts
  return function (req, res, next) {
    const key = req.ip + ":" + req.path
    const now = Date.now()
    const entry = RATE_MAP.get(key) || { reset: now + windowMs, count: 0 }
    if (now > entry.reset) {
      entry.reset = now + windowMs
      entry.count = 0
    }
    entry.count += 1
    RATE_MAP.set(key, entry)
    if (entry.count > max) return res.status(429).json({ error: "too_many_requests" })
    next()
  }
}

function isValidSlug(s) {
  return typeof s === "string" && /^[a-z0-9-]{1,64}$/.test(s)
}
function isValidTitle(s) {
  return typeof s === "string" && s.trim().length >= 1 && s.trim().length <= 200
}
function isValidUrl(s) {
  if (typeof s !== "string" || !s) return true
  try {
    const u = new URL(s)
    return u.protocol === "http:" || u.protocol === "https:"
  } catch {
    return false
  }
}
