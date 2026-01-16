"use client"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

type Item = { id: string; slug: string; title: string; url?: string }
type Attachment = { id: string; lesson_id: string; type: "podcast" | "article" | "analysis"; title?: string; url?: string; content_id?: string; content_slug?: string }

function useAdminKey() {
  const [key, setKey] = useState<string>(() => {
    try {
      const k = sessionStorage.getItem("admin:key") || ""
      return k
    } catch {
      return ""
    }
  })
  function set(k: string) {
    setKey(k)
    try {
      sessionStorage.setItem("admin:key", k)
    } catch {}
  }
  return { key, set }
}

function apiHeaders(key: string) {
  return { "Content-Type": "application/json", "x-admin-key": key }
}

function validateUrl(u: string) {
  if (!u) return true
  try {
    const x = new URL(u)
    return !!x.protocol && !!x.host
  } catch {
    return false
  }
}

export default function AdminPanelPage() {
  const { key, set } = useAdminKey()
  const [authorized, setAuthorized] = useState(false)
  const [pass, setPass] = useState("")
  const [tab, setTab] = useState<"podcasts" | "articles" | "analyses" | "lessons" | "users">("podcasts")
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(false)
  const [q, setQ] = useState("")
  const [limit, setLimit] = useState(20)
  const [offset, setOffset] = useState(0)
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [formTitle, setFormTitle] = useState("")
  const [formUrl, setFormUrl] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [okMsg, setOkMsg] = useState("")
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [attachType, setAttachType] = useState<"podcast" | "article" | "analysis">("podcast")
  const [attachTitle, setAttachTitle] = useState("")
  const [attachUrl, setAttachUrl] = useState("")
  const [attachLessonId, setAttachLessonId] = useState<string>("")
  const [usersActive, setUsersActive] = useState<Array<{ user_id: string; total_views: number; last_seen_at: string | null }>>([])
  const [usersInactive, setUsersInactive] = useState<Array<{ user_id: string; days_since_seen: number; last_seen_at: string | null }>>([])
  const [inactiveDays, setInactiveDays] = useState(14)
  const [botToken, setBotToken] = useState("")
  const [botStatus, setBotStatus] = useState<string>("")
  const [manualUid, setManualUid] = useState<string>("")
  const [manualTrackMsg, setManualTrackMsg] = useState<string>("")
  const [seeding, setSeeding] = useState(false)
  const [fallbackMode, setFallbackMode] = useState(false)

  useEffect(() => {
    setAuthorized(!!key)
  }, [key])

  function login() {
    const k = pass.trim()
    if (!k) return
    set(k)
    setAuthorized(true)
  }

  async function loadItems() {
    setLoading(true)
    setErrorMsg("")
    setFallbackMode(false)
    if (tab === "users") {
      try {
        const r = await fetch(`/api/admin/analytics/users?limit=${limit}&inactiveDays=${inactiveDays}`, { headers: apiHeaders(key) })
        const j = await r.json()
        if (!r.ok) throw new Error(j?.error || "error")
        setUsersActive(Array.isArray(j?.topActive) ? j.topActive : [])
        setUsersInactive(Array.isArray(j?.topInactive) ? j.topInactive : [])
      } catch (e: any) {
        setErrorMsg(String(e?.message || e))
      } finally {
        setLoading(false)
      }
      return
    }
    let endpoint = `/api/admin/${tab}?limit=${limit}&offset=${offset}`
    if (q) endpoint += `&q=${encodeURIComponent(q)}`
    try {
      const r = await fetch(endpoint, { headers: apiHeaders(key) })
      const j = await r.json()
      if (!r.ok) throw new Error(j?.error || "error")
      const arr = Array.isArray(j?.items) ? j.items : []
      if (q) {
        const qq = q.toLowerCase()
        setItems(arr.filter((it: any) => String(it?.title || "").toLowerCase().includes(qq)))
      } else {
        setItems(arr)
      }
    } catch (e: any) {
      setErrorMsg(String(e?.message || e))
      try {
        function slugifyLocal(s: string) {
          return s.toLowerCase().replace(/[,.:?«»"']/g, "").replace(/\s+/g, "-")
        }
        if (tab === "podcasts") {
          const raw = localStorage.getItem("podcasts:items")
          const arr = raw ? JSON.parse(raw) : []
          let itemsLocal: Item[] = []
          if (Array.isArray(arr) && arr.length) {
            itemsLocal = arr.map((it: any) => {
              const title = String(it?.title || "")
              const url = String(it?.url || "")
              const slug = slugifyLocal(title)
              return { id: slug, slug, title, url }
            })
          } else {
            const LINK = "https://t.me/c/2474417642/542"
            const topics = [
              "Почему опасно объединять рода и бездумно делать детей",
              "Живые/мёртвые энергии в натальной карте",
              "Бесхребетные женщины",
              "Личные границы",
              "Как перестать выбирать жестоких мужчин?",
              "Уровни дохода",
              "Подкаст с Косенко",
              "Про богатых мужчин",
              "Моя философия жизни",
              "Как найти идеального мужчину?",
              "Секреты больших денег",
              "Релокация",
              "Как не выбрасывать деньги на обучения?",
              "Как уйти из найма?",
              "Как общаться с мужем, чтобы вас слышали?",
              "Беременность, дети",
              "Как научиться работать за деньги",
              "Как я научилась быть слабой",
              "Как справиться с критикой?",
              "Про обучение",
              "Любовь или деньги?",
              "Труп моего бизнеса",
              "Как сливают продажи и клиентов?",
              "Почему вы НЕ зарабатываете много",
              "Как не разрушать жизнь на эмоциях",
              "Почему я ушла от мужа",
            ]
            itemsLocal = topics.map((t) => {
              const slug = slugifyLocal(t)
              return { id: slug, slug, title: t, url: LINK }
            })
          }
          setItems(itemsLocal)
          setFallbackMode(true)
        } else if (tab === "articles") {
          const rawTopics = localStorage.getItem("astrostati:topics")
          const rawLinks = localStorage.getItem("astrostati:links")
          const topicsArr = rawTopics ? JSON.parse(rawTopics) : []
          const linksMap = rawLinks ? JSON.parse(rawLinks) : {}
          let itemsLocal: Item[] = []
          if (Array.isArray(topicsArr) && topicsArr.length) {
            itemsLocal = topicsArr.map((t: any) => {
              const title = String(t || "")
              const slug = slugifyLocal(title)
              const url = linksMap ? String(linksMap[slug] || "") : ""
              return { id: slug, slug, title, url }
            })
          } else {
            const LINK = "https://t.me/c/2474417642/542"
            const fallback = [
              "От кого зависит ваш социальный статус и успех?",
              "Голубая кровь в роду",
              "Семья или карьера",
              "Родовые сценарии в личной жизни",
              "Идеальный мужчина или абъюзер?",
              "Что будет, если не выполнять предназначение",
              "Фундамент вашей жизни",
              "Сфера твоего везения",
              "Кому необходимо переехать из своего города, а кому остаться, чтобы много зарабатывать?",
              "Почему вы годами не можете встретить партнёра",
            ]
            itemsLocal = fallback.map((t) => {
              const slug = slugifyLocal(t)
              return { id: slug, slug, title: t, url: LINK }
            })
          }
          setItems(itemsLocal)
          setFallbackMode(true)
        } else if (tab === "lessons") {
          const raw = localStorage.getItem("lessons:items")
          const arr = raw ? JSON.parse(raw) : []
          let itemsLocal: Item[] = []
          if (Array.isArray(arr) && arr.length) {
            itemsLocal = arr.map((it: any) => {
              const title = String(it?.title || "")
              const slug = slugifyLocal(title)
              return { id: slug, slug, title }
            })
          } else {
            const fallback = ["Лилит в натальной карте: теневая сторона личности", "Венера в натальной карте"]
            itemsLocal = fallback.map((t) => {
              const slug = slugifyLocal(t)
              return { id: slug, slug, title: t }
            })
          }
          setItems(itemsLocal)
          setFallbackMode(true)
        } else if (tab === "analyses") {
          const raw = localStorage.getItem("analyses:items")
          const arr = raw ? JSON.parse(raw) : []
          let itemsLocal: Item[] = []
          if (Array.isArray(arr) && arr.length) {
            itemsLocal = arr.map((it: any) => {
              const title = String(it?.title || "")
              const url = String(it?.url || "")
              const slug = slugifyLocal(title)
              return { id: slug, slug, title, url }
            })
          }
          setItems(itemsLocal)
          setFallbackMode(true)
        }
      } catch {}
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authorized) return
    loadItems()
  }, [authorized, tab, limit, offset])
  useEffect(() => {
    if (tab === "lessons") {
      setLimit(1000)
      setOffset(0)
    } else {
      setLimit(50)
      setOffset(0)
    }
  }, [tab])

  async function createItem() {
    setErrorMsg("")
    setOkMsg("")
    const title = formTitle.trim()
    const url = formUrl.trim()
    if (!title) {
      setErrorMsg("Название обязательно")
      return
    }
    if (url && !validateUrl(url)) {
      setErrorMsg("Некорректный URL")
      return
    }
    try {
      const r = await fetch(`/api/admin/${tab}`, { method: "POST", headers: apiHeaders(key), body: JSON.stringify({ title, url }) })
      const j = await r.json()
      if (!r.ok) throw new Error(j?.error || "error")
      setOkMsg("Создано")
      setFormTitle("")
      setFormUrl("")
      await fetch("/api/admin/log", { method: "POST", headers: apiHeaders(key), body: JSON.stringify({ action: `create:${tab}`, details: j?.item || {} }) })
      loadItems()
    } catch (e: any) {
      setErrorMsg(String(e?.message || e))
    }
  }

  async function seedFromApp() {
    if (!authorized) return
    setErrorMsg("")
    setOkMsg("")
    setSeeding(true)
    try {
      const makeReq = async (payload: { title: string; url?: string }, endpoint: string) => {
        const r = await fetch(endpoint, { method: "POST", headers: apiHeaders(key), body: JSON.stringify(payload) })
        const j = await r.json()
        if (!r.ok) throw new Error(j?.error || "error")
      }
      if (tab === "podcasts") {
        let items: Array<{ title: string; url: string }> = []
        try {
          const raw = localStorage.getItem("podcasts:items")
          const arr = raw ? JSON.parse(raw) : []
          if (Array.isArray(arr)) items = arr.map((it: any) => ({ title: String(it?.title || ""), url: String(it?.url || "") })).filter((it) => it.title)
        } catch {}
        if (!items.length) {
          const LINK = "https://t.me/c/2474417642/542"
          const topics = [
            "Почему опасно объединять рода и бездумно делать детей",
            "Живые/мёртвые энергии в натальной карте",
            "Бесхребетные женщины",
            "Личные границы",
            "Как перестать выбирать жестоких мужчин?",
            "Уровни дохода",
            "Подкаст с Косенко",
            "Про богатых мужчин",
            "Моя философия жизни",
            "Как найти идеального мужчину?",
            "Секреты больших денег",
            "Релокация",
            "Как не выбрасывать деньги на обучения?",
            "Как уйти из найма?",
            "Как общаться с мужем, чтобы вас слышали?",
            "Беременность, дети",
            "Как научиться работать за деньги",
            "Как я научилась быть слабой",
            "Как справиться с критикой?",
            "Про обучение",
            "Любовь или деньги?",
            "Труп моего бизнеса",
            "Как сливают продажи и клиентов?",
            "Почему вы НЕ зарабатываете много",
            "Как не разрушать жизнь на эмоциях",
            "Почему я ушла от мужа",
          ]
          items = topics.map((t) => ({ title: t, url: LINK }))
        }
        for (const it of items) await makeReq({ title: it.title, url: it.url }, "/api/admin/podcasts")
        await fetch("/api/admin/log", { method: "POST", headers: apiHeaders(key), body: JSON.stringify({ action: "seed:podcasts", details: { count: items.length } }) })
      } else if (tab === "articles") {
        let items: Array<{ title: string; url: string }> = []
        try {
          const rawTopics = localStorage.getItem("astrostati:topics")
          const rawLinks = localStorage.getItem("astrostati:links")
          const topicsArr = rawTopics ? JSON.parse(rawTopics) : []
          const linksMap = rawLinks ? JSON.parse(rawLinks) : {}
          if (Array.isArray(topicsArr)) {
            items = topicsArr
              .map((t: any) => {
                const title = String(t || "")
                const slug = title.toLowerCase().replace(/[,.:?«»"']/g, "").replace(/\s+/g, "-")
                const url = linksMap ? String(linksMap[slug] || "") : ""
                return { title, url }
              })
              .filter((it) => it.title)
          }
        } catch {}
        if (!items.length) {
          const LINK = "https://t.me/c/2474417642/542"
          items = [
            { title: "От кого зависит ваш социальный статус и успех?", url: LINK },
            { title: "Голубая кровь в роду", url: LINK },
            { title: "Семья или карьера", url: LINK },
            { title: "Родовые сценарии в личной жизни", url: LINK },
            { title: "Идеальный мужчина или абъюзер?", url: LINK },
            { title: "Что будет, если не выполнять предназначение", url: LINK },
            { title: "Фундамент вашей жизни", url: LINK },
            { title: "Сфера твоего везения", url: LINK },
            { title: "Кому необходимо переехать из своего города, а кому остаться, чтобы много зарабатывать?", url: LINK },
            { title: "Почему вы годами не можете встретить партнёра", url: LINK },
          ]
        }
        for (const it of items) await makeReq({ title: it.title, url: it.url }, "/api/admin/articles")
        await fetch("/api/admin/log", { method: "POST", headers: apiHeaders(key), body: JSON.stringify({ action: "seed:articles", details: { count: items.length } }) })
      } else if (tab === "lessons") {
        let items: Array<{ title: string }> = []
        try {
          const raw = localStorage.getItem("lessons:items")
          const arr = raw ? JSON.parse(raw) : []
          if (Array.isArray(arr)) items = arr.map((it: any) => ({ title: String(it?.title || "") })).filter((it) => it.title)
        } catch {}
        if (!items.length) {
          items = [
            { title: "Лилит в натальной карте: теневая сторона личности" },
            { title: "Венера в натальной карте" },
          ]
        }
        for (const it of items) await makeReq({ title: it.title }, "/api/admin/lessons")
        await fetch("/api/admin/log", { method: "POST", headers: apiHeaders(key), body: JSON.stringify({ action: "seed:lessons", details: { count: items.length } }) })
      } else if (tab === "analyses") {
        let items: Array<{ title: string; url: string }> = []
        try {
          const raw = localStorage.getItem("analyses:items")
          const arr = raw ? JSON.parse(raw) : []
          if (Array.isArray(arr)) items = arr.map((it: any) => ({ title: String(it?.title || ""), url: String(it?.url || "") })).filter((it) => it.title)
        } catch {}
        for (const it of items) await makeReq({ title: it.title, url: it.url }, "/api/admin/analyses")
        await fetch("/api/admin/log", { method: "POST", headers: apiHeaders(key), body: JSON.stringify({ action: "seed:analyses", details: { count: items.length } }) })
      }
      setOkMsg("Импорт завершён")
      loadItems()
    } catch (e: any) {
      setErrorMsg(String(e?.message || e))
    } finally {
      setSeeding(false)
    }
  }
  async function updateItem(id: string, payload: Partial<Item>) {
    setErrorMsg("")
    try {
      const r = await fetch(`/api/admin/${tab}/${encodeURIComponent(id)}`, { method: "PUT", headers: apiHeaders(key), body: JSON.stringify(payload) })
      const j = await r.json()
      if (!r.ok) throw new Error(j?.error || "error")
      await fetch("/api/admin/log", { method: "POST", headers: apiHeaders(key), body: JSON.stringify({ action: `update:${tab}`, details: j?.item || {} }) })
      setOkMsg("Сохранено")
      loadItems()
    } catch (e: any) {
      setErrorMsg(String(e?.message || e))
    }
  }

  async function deleteItem(id: string) {
    const ok = confirm("Удалить элемент?")
    if (!ok) return
    setErrorMsg("")
    try {
      const r = await fetch(`/api/admin/${tab}/${encodeURIComponent(id)}`, { method: "DELETE", headers: apiHeaders(key) })
      const j = await r.json()
      if (!r.ok) throw new Error(j?.error || "error")
      await fetch("/api/admin/log", { method: "POST", headers: apiHeaders(key), body: JSON.stringify({ action: `delete:${tab}`, details: { id } }) })
      setOkMsg("Удалено")
      loadItems()
    } catch (e: any) {
      setErrorMsg(String(e?.message || e))
    }
  }

  async function bulkDelete() {
    const ids = Object.entries(selected).filter(([, v]) => v).map(([id]) => id)
    if (!ids.length) return
    const ok = confirm(`Удалить выбранные (${ids.length})?`)
    if (!ok) return
    setErrorMsg("")
    try {
      const r = await fetch(`/api/admin/${tab}`, { method: "DELETE", headers: apiHeaders(key), body: JSON.stringify({ ids }) })
      const j = await r.json()
      if (!r.ok) throw new Error(j?.error || "error")
      await fetch("/api/admin/log", { method: "POST", headers: apiHeaders(key), body: JSON.stringify({ action: `bulk-delete:${tab}`, details: { ids } }) })
      setOkMsg("Удалено")
      setSelected({})
      loadItems()
    } catch (e: any) {
      setErrorMsg(String(e?.message || e))
    }
  }

  async function loadAttachments(lessonId: string) {
    setAttachLessonId(lessonId)
    setAttachments([])
    try {
      const r = await fetch(`/api/admin/lessons/${encodeURIComponent(lessonId)}/attachments`, { headers: apiHeaders(key) })
      const j = await r.json()
      if (!r.ok) throw new Error(j?.error || "error")
      setAttachments(Array.isArray(j?.items) ? j.items : [])
    } catch (e: any) {
      setErrorMsg(String(e?.message || e))
    }
  }

  async function addAttachment() {
    if (!attachLessonId) return
    if (attachUrl && !validateUrl(attachUrl)) {
      setErrorMsg("Некорректный URL")
      return
    }
    setErrorMsg("")
    try {
      const r = await fetch(`/api/admin/lessons/${encodeURIComponent(attachLessonId)}/attachments`, {
        method: "POST",
        headers: apiHeaders(key),
        body: JSON.stringify({ type: attachType, title: attachTitle.trim(), url: attachUrl.trim() }),
      })
      const j = await r.json()
      if (!r.ok) throw new Error(j?.error || "error")
      await fetch("/api/admin/log", { method: "POST", headers: apiHeaders(key), body: JSON.stringify({ action: "attach:add", details: j?.item || {} }) })
      setAttachTitle("")
      setAttachUrl("")
      loadAttachments(attachLessonId)
    } catch (e: any) {
      setErrorMsg(String(e?.message || e))
    }
  }

  async function deleteAttachment(attId: string) {
    if (!attachLessonId) return
    const ok = confirm("Удалить прикрепление?")
    if (!ok) return
    try {
      const r = await fetch(`/api/admin/lessons/${encodeURIComponent(attachLessonId)}/attachments/${encodeURIComponent(attId)}`, {
        method: "DELETE",
        headers: apiHeaders(key),
      })
      const j = await r.json()
      if (!r.ok) throw new Error(j?.error || "error")
      await fetch("/api/admin/log", { method: "POST", headers: apiHeaders(key), body: JSON.stringify({ action: "attach:delete", details: { attId } }) })
      loadAttachments(attachLessonId)
    } catch (e: any) {
      setErrorMsg(String(e?.message || e))
    }
  }

  const isLessons = tab === "lessons"
  const titleLabel = isLessons ? "Название урока" : tab === "podcasts" ? "Название подкаста" : tab === "articles" ? "Название статьи" : "Название разбора"
  const showUrl = tab !== "lessons"

  return (
    <div className="app-stars min-h-screen w-full flex flex-col items-center px-6 py-6">
      <nav className="w-full max-w-[1200px] flex justify-start mb-2">
        <Link
          href="/home"
          prefetch={false}
          onClick={(e) => {
            e.preventDefault()
            try {
              window.location.assign("/home")
            } catch {
              window.location.href = "/home"
            }
          }}
          style={{
            width: "82px",
            height: "21px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            textDecoration: "none",
            fontFamily: "var(--font-family)",
            fontWeight: 300,
            fontSize: "10px",
            lineHeight: "130%",
            color: "#fff",
            background: "#192656",
            borderRadius: "5px",
          }}
        >
          <svg width="3" height="5" viewBox="0 0 3 5" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.37549 0.312988L0.641113 2.47421L2.37549 4.63426" stroke="white" strokeWidth="1" />
          </svg>
          назад
        </Link>
      </nav>
      <div className="relative w-full max-w-[1200px] mx-auto mb-0">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", width: "100%", minHeight: "127px", borderRadius: "20px", background: "linear-gradient(180deg, #08102D 0%, #1A285B 100%)" }}>
          <img src="/Group 454.svg" alt="decor" width={172} height={34} style={{ objectFit: "contain" }} />
        </div>
      </div>
      {!authorized ? (
        <div className="relative w-full max-w-[1200px] mx-auto mb-0" style={{ marginTop: "15px" }}>
          <div style={{ width: "100%", borderRadius: "20px", background: "linear-gradient(180deg, #08102d 0%, #1a285b 100%)", padding: "16px", color: "#fff" }}>
            <div className="font-libertinus" style={{ fontSize: "16px", lineHeight: "95%", textTransform: "uppercase", background: "linear-gradient(90deg, #f4d990 0%, #cb9b3d 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Вход</div>
            <div style={{ marginTop: "10px" }}>
              <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="ключ администратора" style={{ width: "100%", fontSize: "12px", lineHeight: "120%", padding: "8px", borderRadius: "6px", border: "1px solid #2f3a6b", background: "#0c1638", color: "#fff" }} />
              <button onClick={login} style={{ marginTop: "10px", padding: "8px 12px", borderRadius: "6px", background: "linear-gradient(90deg, #f4d990 0%, #cb9b3d 100%)", color: "#091130", fontWeight: 600, fontSize: "12px" }}>Войти</button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="relative w-full max-w-[1200px] mx-auto mb-0" style={{ marginTop: "15px" }}>
              <div style={{ width: "100%", borderRadius: "20px", background: "linear-gradient(180deg, #08102d 0%, #1a285b 100%)", padding: "16px", color: "#fff" }}>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <button onClick={() => setTab("podcasts")} style={{ padding: "8px 12px", borderRadius: "6px", background: tab === "podcasts" ? "linear-gradient(90deg, #f4d990 0%, #cb9b3d 100%)" : "#192656", color: "#fff", fontSize: "12px" }}>Подкасты</button>
                  <button onClick={() => setTab("articles")} style={{ padding: "8px 12px", borderRadius: "6px", background: tab === "articles" ? "linear-gradient(90deg, #f4d990 0%, #cb9b3d 100%)" : "#192656", color: "#fff", fontSize: "12px" }}>Статьи</button>
                  <button onClick={() => setTab("analyses")} style={{ padding: "8px 12px", borderRadius: "6px", background: tab === "analyses" ? "linear-gradient(90deg, #f4d990 0%, #cb9b3d 100%)" : "#192656", color: "#fff", fontSize: "12px" }}>Разборы</button>
                  <button onClick={() => setTab("lessons")} style={{ padding: "8px 12px", borderRadius: "6px", background: tab === "lessons" ? "linear-gradient(90deg, #f4d990 0%, #cb9b3d 100%)" : "#192656", color: "#fff", fontSize: "12px" }}>Уроки</button>
                  <button onClick={() => setTab("users")} style={{ padding: "8px 12px", borderRadius: "6px", background: tab === "users" ? "linear-gradient(90deg, #f4d990 0%, #cb9b3d 100%)" : "#192656", color: "#fff", fontSize: "12px" }}>Пользователи</button>
                </div>
              <div style={{ marginTop: "10px", display: "grid", gridTemplateColumns: "1fr auto auto", columnGap: "8px", alignItems: "center" }}>
                <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if ((e as any).key === "Enter") loadItems() }} placeholder="поиск" style={{ width: "100%", fontSize: "12px", lineHeight: "120%", padding: "8px", borderRadius: "6px", border: "1px solid #2f3a6b", background: "#0c1638", color: "#fff" }} />
                <button onClick={loadItems} style={{ padding: "8px 12px", borderRadius: "6px", background: "#192656", color: "#fff", fontSize: "12px" }}>Найти</button>
                <button onClick={bulkDelete} style={{ padding: "8px 12px", borderRadius: "6px", background: "#a23b3b", color: "#fff", fontSize: "12px" }}>Удалить выбранные</button>
              </div>
              {errorMsg && <div style={{ marginTop: "8px", fontSize: "11px", color: "#a23b3b" }}>{errorMsg}</div>}
              <div style={{ marginTop: "10px", display: "grid", gridTemplateColumns: "2fr 1fr", columnGap: "12px" }}>
                <div>
                  <div style={{ fontFamily: "var(--font-family)", fontSize: "12px", color: "#fff" }}>{tab === "users" ? "Статистика" : "Список"}</div>
                  <div style={{ marginTop: "6px", border: "1px solid #2f3a6b", borderRadius: "8px", padding: "8px" }}>
                    {loading ? (
                      <div style={{ fontSize: "12px", color: "#fff" }}>Загрузка...</div>
                    ) : (
                      tab === "users" ? (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: "12px" }}>
                          <div>
                            <div className="font-libertinus" style={{ fontSize: "14px", lineHeight: "95%", textTransform: "uppercase", background: "linear-gradient(90deg, #f4d990 0%, #cb9b3d 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", textAlign: "left" }}>Самые активные</div>
                            <ul className="space-y-2" style={{ marginTop: "8px" }}>
                              {usersActive.map((u, idx) => (
                                <li key={idx} style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", columnGap: "8px", alignItems: "center" }}>
                                  <span style={{ fontFamily: "var(--font-family)", fontSize: "11px", color: "#fff" }}>{u.user_id}</span>
                                  <span className="font-libertinus" style={{ fontSize: "12px", color: "#fff" }}>{u.total_views}</span>
                                  <span style={{ fontFamily: "var(--font-family)", fontSize: "11px", color: "#fff" }}>{u.last_seen_at || ""}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <div className="font-libertinus" style={{ fontSize: "14px", lineHeight: "95%", textTransform: "uppercase", background: "linear-gradient(90deg, #f4d990 0%, #cb9b3d 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", textAlign: "left" }}>Неактивные</div>
                            <ul className="space-y-2" style={{ marginTop: "8px" }}>
                              {usersInactive.map((u, idx) => (
                                <li key={idx} style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", columnGap: "8px", alignItems: "center" }}>
                                  <span style={{ fontFamily: "var(--font-family)", fontSize: "11px", color: "#fff" }}>{u.user_id}</span>
                                  <span className="font-libertinus" style={{ fontSize: "12px", color: "#fff" }}>{u.days_since_seen} дн.</span>
                                  <span style={{ fontFamily: "var(--font-family)", fontSize: "11px", color: "#fff" }}>{u.last_seen_at || ""}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ) : (
                        <>
                          <ul className="space-y-2">
                            {items.length ? items.map((it) => (
                              <li key={it.id} style={{ display: "grid", gridTemplateColumns: "18px 1fr auto", columnGap: "8px", alignItems: "center" }}>
                                <input type="checkbox" disabled={fallbackMode} checked={!!selected[it.id]} onChange={(e) => setSelected((s) => ({ ...s, [it.id]: e.target.checked }))} />
                                <div className="font-libertinus" style={{ fontSize: "12px", lineHeight: "120%", wordBreak: "break-word" }}>{it.title}</div>
                                <div style={{ display: "inline-flex", gap: "8px" }}>
                                  {!fallbackMode && <button onClick={() => deleteItem(it.id)} style={{ padding: "6px 10px", borderRadius: "6px", background: "#a23b3b", color: "#fff", fontSize: "12px" }}>Удалить</button>}
                                </div>
                                {tab !== "lessons" ? (
                                  <div style={{ gridColumn: "2 / span 2", display: "grid", gridTemplateColumns: "1fr auto", columnGap: "8px", marginTop: "6px" }}>
                                    <input
                                      defaultValue={it.url || ""}
                                      onBlur={(e) => {
                                        const v = e.target.value.trim()
                                        if (v && !validateUrl(v)) {
                                          setErrorMsg("Некорректный URL")
                                          return
                                        }
                                        if (!fallbackMode) updateItem(it.id, { url: v })
                                      }}
                                      placeholder="https://..."
                                      style={{ width: "100%", fontSize: "12px", lineHeight: "120%", padding: "8px", borderRadius: "6px", border: "1px solid #2f3a6b", background: "#0c1638", color: "#fff" }}
                                    />
                                  </div>
                                ) : (
                                  <div style={{ gridColumn: "2 / span 2", display: "grid", gridTemplateColumns: "1fr auto", columnGap: "8px", marginTop: "6px" }}>
                                    <input
                                      defaultValue={it.title}
                                      onBlur={(e) => {
                                        const v = e.target.value.trim()
                                        if (!v) {
                                          setErrorMsg("Название обязательно")
                                          return
                                        }
                                        if (!fallbackMode) updateItem(it.id, { title: v })
                                      }}
                                      placeholder={titleLabel}
                                      style={{ width: "100%", fontSize: "12px", lineHeight: "120%", padding: "8px", borderRadius: "6px", border: "1px solid #2f3a6b", background: "#0c1638", color: "#fff" }}
                                    />
                                    {!fallbackMode && <button onClick={() => loadAttachments(it.id)} style={{ padding: "8px 12px", borderRadius: "6px", background: "#192656", color: "#fff", fontSize: "12px" }}>Материалы</button>}
                                  </div>
                                )}
                              </li>
                            )) : (
                              <div style={{ fontSize: "12px", color: "#fff" }}>Нет элементов. Создайте новый справа.</div>
                            )}
                          </ul>
                          {fallbackMode && <div style={{ marginTop: "6px", fontSize: "11px", color: "#d3b589" }}>Показан локальный список из приложения. Действия отключены.</div>}
                        </>
                      )
                    )}
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-family)", fontSize: "12px", color: "#fff" }}>{tab === "users" ? "Инструменты" : "Создать"}</div>
                  <div style={{ marginTop: "6px", border: "1px solid #2f3a6b", borderRadius: "8px", padding: "8px" }}>
                    {tab === "users" ? (
                      <div style={{ display: "grid", rowGap: "8px" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", columnGap: "8px" }}>
                          <input value={inactiveDays} onChange={(e) => setInactiveDays(Number((e.target as any).value || 14))} type="number" min={1} max={365} placeholder="Дней без активности" style={{ width: "100%", fontSize: "12px", lineHeight: "120%", padding: "8px", borderRadius: "6px", border: "1px solid #2f3a6b", background: "#0c1638", color: "#fff" }} />
                          <button onClick={loadItems} style={{ padding: "8px 12px", borderRadius: "6px", background: "#192656", color: "#fff", fontSize: "12px" }}>Обновить</button>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", columnGap: "8px" }}>
                          <input value={botToken} onChange={(e) => setBotToken(e.target.value)} placeholder="Токен бота" style={{ width: "100%", fontSize: "12px", lineHeight: "120%", padding: "8px", borderRadius: "6px", border: "1px solid #2f3a6b", background: "#0c1638", color: "#fff" }} />
                          <button
                            onClick={async () => {
                              setBotStatus("")
                              if (!botToken.trim()) return
                              try {
                                const r = await fetch("/api/admin/telegram/verify", { method: "POST", headers: apiHeaders(key), body: JSON.stringify({ token: botToken.trim() }) })
                                const j = await r.json()
                                setBotStatus(j?.ok ? "OK" : String(j?.error || "ошибка"))
                              } catch {
                                setBotStatus("ошибка")
                              }
                            }}
                            style={{ padding: "8px 12px", borderRadius: "6px", background: "linear-gradient(90deg, #f4d990 0%, #cb9b3d 100%)", color: "#091130", fontWeight: 600, fontSize: "12px" }}
                          >
                            Проверить токен
                          </button>
                        </div>
                        <div style={{ fontSize: "11px", color: "#d3b589" }}>{botStatus}</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", columnGap: "8px" }}>
                          <input value={manualUid} onChange={(e) => setManualUid(e.target.value)} placeholder="Telegram ID пользователя" style={{ width: "100%", fontSize: "12px", lineHeight: "120%", padding: "8px", borderRadius: "6px", border: "1px solid #2f3a6b", background: "#0c1638", color: "#fff" }} />
                          <button
                            onClick={async () => {
                              setManualTrackMsg("")
                              const uid = manualUid.trim()
                              if (!uid) return
                              try {
                                await fetch("/api/subscription/track", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ userId: uid, source: "admin" }),
                                })
                                setManualTrackMsg("Активность обновлена")
                                loadItems()
                              } catch {
                                setManualTrackMsg("Ошибка")
                              }
                            }}
                            style={{ padding: "8px 12px", borderRadius: "6px", background: "linear-gradient(90deg, #f4d990 0%, #cb9b3d 100%)", color: "#091130", fontWeight: 600, fontSize: "12px" }}
                          >
                            Обновить активность
                          </button>
                        </div>
                        <div style={{ fontSize: "11px", color: "#d3b589" }}>{manualTrackMsg}</div>
                      </div>
                    ) : (
                      <>
                        <div style={{ display: "grid", rowGap: "8px" }}>
                          <input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder={titleLabel} style={{ width: "100%", fontSize: "12px", lineHeight: "120%", padding: "8px", borderRadius: "6px", border: "1px solid #2f3a6b", background: "#0c1638", color: "#fff" }} />
                          {showUrl && (
                            <input value={formUrl} onChange={(e) => setFormUrl(e.target.value)} placeholder="https://..." style={{ width: "100%", fontSize: "12px", lineHeight: "120%", padding: "8px", borderRadius: "6px", border: "1px solid #2f3a6b", background: "#0c1638", color: "#fff" }} />
                          )}
                          <button onClick={createItem} style={{ padding: "8px 12px", borderRadius: "6px", background: "linear-gradient(90deg, #f4d990 0%, #cb9b3d 100%)", color: "#091130", fontWeight: 600, fontSize: "12px" }}>Создать</button>
                          <button
                            onClick={seedFromApp}
                            disabled={seeding}
                            style={{ padding: "8px 12px", borderRadius: "6px", background: "#192656", color: "#fff", fontSize: "12px" }}
                          >
                            {seeding ? "Импорт..." : "Импорт из приложения"}
                          </button>
                        </div>
                        <div style={{ marginTop: "8px", fontSize: "11px", color: "#a23b3b" }}>{errorMsg}</div>
                        <div style={{ marginTop: "4px", fontSize: "11px", color: "#d3b589" }}>{okMsg}</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              {isLessons && attachLessonId && (
                <div style={{ marginTop: "12px" }}>
                  <div className="font-libertinus" style={{ fontSize: "14px", lineHeight: "95%", textTransform: "uppercase", background: "linear-gradient(90deg, #f4d990 0%, #cb9b3d 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", textAlign: "left" }}>
                    Материалы урока
                  </div>
                  <ul className="space-y-2" style={{ marginTop: "8px" }}>
                    {attachments.map((a) => (
                      <li key={a.id} style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", columnGap: "8px", alignItems: "center" }}>
                        <span style={{ fontFamily: "var(--font-family)", fontSize: "11px", color: "#fff" }}>{a.type}</span>
                        <span className="font-libertinus" style={{ fontSize: "12px", lineHeight: "120%", wordBreak: "break-word", color: "#fff" }}>{a.title || a.url || a.content_slug || a.content_id || ""}</span>
                        <button onClick={() => deleteAttachment(a.id)} style={{ padding: "6px 10px", borderRadius: "6px", background: "#a23b3b", color: "#fff", fontSize: "12px" }}>Удалить</button>
                      </li>
                    ))}
                  </ul>
                  <div style={{ marginTop: "10px", display: "grid", gridTemplateColumns: "auto 1fr 1fr auto", columnGap: "8px" }}>
                    <select value={attachType} onChange={(e) => setAttachType(e.target.value as any)} style={{ padding: "8px", borderRadius: "6px", background: "#0c1638", color: "#fff", border: "1px solid #2f3a6b", fontSize: "12px" }}>
                      <option value="podcast">подкаст</option>
                      <option value="article">статья</option>
                      <option value="analysis">разбор</option>
                    </select>
                    <input value={attachTitle} onChange={(e) => setAttachTitle(e.target.value)} placeholder="Название" style={{ fontSize: "12px", lineHeight: "120%", padding: "8px", borderRadius: "6px", border: "1px solid #2f3a6b", background: "#0c1638", color: "#fff" }} />
                    <input value={attachUrl} onChange={(e) => setAttachUrl(e.target.value)} placeholder="https://..." style={{ fontSize: "12px", lineHeight: "120%", padding: "8px", borderRadius: "6px", border: "1px solid #2f3a6b", background: "#0c1638", color: "#fff" }} />
                    <button onClick={addAttachment} style={{ padding: "8px 12px", borderRadius: "6px", background: "linear-gradient(90deg, #f4d990 0%, #cb9b3d 100%)", color: "#091130", fontWeight: 600, fontSize: "12px" }}>Прикрепить</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
