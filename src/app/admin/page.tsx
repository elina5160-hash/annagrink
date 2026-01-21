"use client"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function AdminLinksPage() {
  const [authorized, setAuthorized] = useState(false)
  const [pass, setPass] = useState("")
  useEffect(() => {
    try {
      const ok = sessionStorage.getItem("admin:authorized") === "1"
      if (ok) setAuthorized(true)
    } catch {}
  }, [])
  function tryLogin() {
    try {
      const expected = localStorage.getItem("admin:password") || "club-admin"
      if (pass === expected) {
        sessionStorage.setItem("admin:authorized", "1")
        setAuthorized(true)
      }
    } catch {}
  }
  const astroTopics = [
    "От кого зависит ваш социальный статус и успех?",
    "ГОЛУБАЯ КРОВЬ В РОДУ",
    "Семья или карьера",
    "От кого в роду зависят ваши отношения и какие родовые сценарии у вас есть в личной жизни?",
    "Идеальный мужчина или абъюзер?",
    "Что будет, если не выполнять своё предназначение?",
    "Фундамент вашей жизни: какая сфера будет вашей опорой",
    "Сфера твоего везения в натальной карте",
    "Кому необходимо переехать из своего города, а кому остаться, чтобы много зарабатывать?",
    "Почему вы годами не можете встретить партнёра: указания в карте",
    "Указания в натальной карте на богатого партнёра",
    "Плутон: долги или богатство. Как научиться управлять этой планетой для роста в деньгах?",
    "Денежный маникюр на весь предстоящий год",
    "Какие желания загадывать в новогоднюю ночь, чтобы они сбылись по вашей карте?",
    "Календарь на январь и февраль 2026",
    "Какую аскезу нужно взять, чтобы вырос доход?",
  ]
  function slugifyAstro(s: string) {
    return s.toLowerCase().replace(/[,.:?]/g, "").replace(/\s+/g, "-")
  }
  const podTopics = [
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
    "Про патриархальное общество",
    "Легко ли тебе идти в новое?",
    "Синдром отложенной жизни",
    "Новое название и миссия клуба",
    "Как быть неидеальными?",
    "Делюсь своей болью",
    "Осложнения после установки виниров",
  ]
  function slugifyPod(s: string) {
    return s.toLowerCase().replace(/\?/g, "").replace(/[,.:]/g, "").replace(/\s+/g, "-")
  }
  const [astroLinks, setAstroLinks] = useState<Record<string, string>>({})
  const [astroTitles, setAstroTitles] = useState<string[]>(astroTopics)
  const [astroNewTitle, setAstroNewTitle] = useState("")
  const [astroNewUrl, setAstroNewUrl] = useState("")
  const [podItems, setPodItems] = useState<Array<{ title: string; url: string }>>([])
  const [podNewTitle, setPodNewTitle] = useState("")
  const [podNewUrl, setPodNewUrl] = useState("")
  const [savedAstro, setSavedAstro] = useState(false)
  const [savedPod, setSavedPod] = useState(false)
  const [mode, setMode] = useState<"edit" | "add" | "delete">("edit")
  useEffect(() => {
    try {
      const raw = localStorage.getItem("astrostati:links")
      const map = raw ? JSON.parse(raw) : {}
      const next: Record<string, string> = {}
      const traw = localStorage.getItem("astrostati:topics")
      const arr = traw ? JSON.parse(traw) : []
      const titles = Array.isArray(arr) && arr.length ? arr.map((s: any) => String(s)) : astroTopics
      setAstroTitles(titles)
      titles.forEach((t) => {
        const k = slugifyAstro(t)
        next[k] = map?.[k] || ""
      })
      setAstroLinks(next)
    } catch {}
    try {
      const raw = localStorage.getItem("podcasts:items")
      const arr = raw ? JSON.parse(raw) : []
      if (Array.isArray(arr) && arr.length) {
        setPodItems(arr.map((it: any) => ({ title: String(it.title), url: String(it.url || "") })))
      } else {
        setPodItems(podTopics.map((t) => ({ title: t, url: "" })))
      }
    } catch {}
  }, [])
  function saveAstro() {
    try {
      const next = { ...astroLinks }
      localStorage.setItem("astrostati:links", JSON.stringify(next))
      setSavedAstro(true)
      setTimeout(() => setSavedAstro(false), 1200)
    } catch {}
  }
  function addAstro() {
    try {
      const title = astroNewTitle.trim()
      const url = astroNewUrl.trim()
      if (!title) return
      const traw = localStorage.getItem("astrostati:topics")
      const arr = traw ? JSON.parse(traw) : []
      const current = Array.isArray(arr) ? arr.map((s: any) => String(s)) : []
      const updated = [...current, title]
      localStorage.setItem("astrostati:topics", JSON.stringify(updated))
      try { window.dispatchEvent(new Event("astrostati:topics-change")) } catch {}
      if (url) {
        const lraw = localStorage.getItem("astrostati:links")
        const lmap = lraw ? JSON.parse(lraw) : {}
        lmap[slugifyAstro(title)] = url
        localStorage.setItem("astrostati:links", JSON.stringify(lmap))
      }
      setAstroNewTitle("")
      setAstroNewUrl("")
    } catch {}
  }
  function deleteAstro(title: string) {
    try {
      const traw = localStorage.getItem("astrostati:topics")
      const arr = traw ? JSON.parse(traw) : []
      const current = Array.isArray(arr) ? arr.map((s: any) => String(s)) : []
      const updated = current.filter((t: string) => t !== title)
      localStorage.setItem("astrostati:topics", JSON.stringify(updated))
      try { window.dispatchEvent(new Event("astrostati:topics-change")) } catch {}
      const lraw = localStorage.getItem("astrostati:links")
      const lmap = lraw ? JSON.parse(lraw) : {}
      const key = slugifyAstro(title)
      if (lmap[key]) { delete lmap[key]; localStorage.setItem("astrostati:links", JSON.stringify(lmap)) }
      const wraw = localStorage.getItem("astrostati:watched")
      const w = wraw ? JSON.parse(wraw) : []
      if (Array.isArray(w)) {
        const wn = w.filter((s: string) => s !== key)
        localStorage.setItem("astrostati:watched", JSON.stringify(wn))
        try { window.dispatchEvent(new Event("astrostati:watched-change")) } catch {}
      }
    } catch {}
  }
  function savePod() {
    try {
      const next = podItems.map((it) => ({ title: it.title, url: it.url }))
      localStorage.setItem("podcasts:items", JSON.stringify(next))
      try {
        window.dispatchEvent(new Event("podcasts:items-change"))
      } catch {}
      setSavedPod(true)
      setTimeout(() => setSavedPod(false), 1200)
    } catch {}
  }
  function addPod() {
    try {
      const title = podNewTitle.trim()
      const url = podNewUrl.trim()
      if (!title) return
      const next = [...podItems, { title, url }]
      setPodItems(next)
      localStorage.setItem("podcasts:items", JSON.stringify(next))
      try { window.dispatchEvent(new Event("podcasts:items-change")) } catch {}
      setPodNewTitle("")
      setPodNewUrl("")
    } catch {}
  }
  function deletePod(idx: number) {
    try {
      const next = podItems.filter((_, i) => i !== idx)
      setPodItems(next)
      localStorage.setItem("podcasts:items", JSON.stringify(next))
      try { window.dispatchEvent(new Event("podcasts:items-change")) } catch {}
    } catch {}
  }
  return (
    <div className="app-stars min-h-screen flex flex-col items-center px-4 py-6">
      <nav className="w-full max-w-[343px] flex justify-start mb-2">
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
            width: "62px",
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
      <div className="relative max-w-[343px] mx-auto mb-0">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", width: "342px", height: "127px", borderRadius: "20px", background: "linear-gradient(180deg, #08102D 0%, #1A285B 100%)" }}>
          <img src="/Group 454.svg" alt="decor" width={172} height={34} style={{ objectFit: "contain" }} />
        </div>
      </div>
      {!authorized ? (
        <div className="relative max-w-[343px] mx-auto mb-0" style={{ marginTop: "15px" }}>
          <div style={{ width: "343px", borderRadius: "20px", background: "linear-gradient(180deg, #08102d 0%, #1a285b 100%)", padding: "16px", color: "#fff" }}>
            <div className="font-libertinus" style={{ fontSize: "16px", lineHeight: "95%", textTransform: "uppercase", background: "linear-gradient(90deg, #f4d990 0%, #cb9b3d 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Вход</div>
            <div style={{ marginTop: "10px" }}>
              <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="пароль" style={{ width: "100%", fontSize: "12px", lineHeight: "120%", padding: "8px", borderRadius: "6px", border: "1px solid #2f3a6b", background: "#0c1638", color: "#fff" }} />
              <button onClick={tryLogin} style={{ marginTop: "10px", padding: "8px 12px", borderRadius: "6px", background: "linear-gradient(90deg, #f4d990 0%, #cb9b3d 100%)", color: "#091130", fontWeight: 600, fontSize: "12px" }}>Войти</button>
            </div>
          </div>
        </div>
      ) : (
      <div className="relative max-w-[343px] mx-auto mb-0" style={{ marginTop: "15px" }}>
        <div style={{ width: "343px", borderRadius: "20px", background: "linear-gradient(180deg, #08102d 0%, #1a285b 100%)", padding: "16px", color: "#fff" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
            <div className="font-libertinus" style={{ marginLeft: "0", fontWeight: 400, fontSize: "20px", lineHeight: "95%", textTransform: "uppercase", background: "linear-gradient(90deg, #f4d990 0%, #cb9b3d 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", textAlign: "left" }}>
              Админ панель: ссылки
            </div>
          </div>
          <div style={{ marginTop: "10px", fontSize: "12px", lineHeight: "130%", color: "#fff", textAlign: "left" }}>
            Изменение ссылок для астростатей и подкастов.
          </div>
          <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
            <button onClick={() => setMode("edit")} style={{ padding: "8px 12px", borderRadius: "6px", background: mode === "edit" ? "linear-gradient(90deg, #f4d990 0%, #cb9b3d 100%)" : "#192656", color: "#fff", fontSize: "12px" }}>Изменить ссылки</button>
            <button onClick={() => setMode("add")} style={{ padding: "8px 12px", borderRadius: "6px", background: mode === "add" ? "linear-gradient(90deg, #f4d990 0%, #cb9b3d 100%)" : "#192656", color: "#fff", fontSize: "12px" }}>Добавить</button>
            <button onClick={() => setMode("delete")} style={{ padding: "8px 12px", borderRadius: "6px", background: mode === "delete" ? "linear-gradient(90deg, #f4d990 0%, #cb9b3d 100%)" : "#192656", color: "#fff", fontSize: "12px" }}>Удалить</button>
          </div>
        </div>
        <div className="w-full max-w-[343px]" style={{ marginTop: "12px" }}>
          <div className="rounded-xl" style={{ background: "linear-gradient(180deg, #08102d 0%, #1a285b 100%)", color: "#fff", padding: "12px 16px" }}>
            <div className="font-libertinus" style={{ fontSize: "16px", lineHeight: "95%", textTransform: "uppercase", background: "linear-gradient(90deg, #f4d990 0%, #cb9b3d 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Астростатьи</div>
            {mode === "edit" && (
              <>
                <ul className="space-y-2" style={{ marginTop: "10px" }}>
                  {astroTitles.map((t) => {
                    const k = slugifyAstro(t)
                    const v = astroLinks[k] || ""
                    return (
                      <li key={k}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                          <div className="font-libertinus" style={{ fontSize: "12px", lineHeight: "120%", flex: "0 0 48%", wordBreak: "break-word" }}>{t}</div>
                          <input value={v} onChange={(e) => setAstroLinks((prev) => ({ ...prev, [k]: e.target.value }))} placeholder="https://..." style={{ flex: "1", minWidth: "0", fontSize: "12px", lineHeight: "120%", padding: "8px", borderRadius: "6px", border: "1px solid #2f3a6b", background: "#0c1638", color: "#fff" }} />
                        </div>
                      </li>
                    )
                  })}
                </ul>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
                  <button onClick={saveAstro} style={{ padding: "8px 12px", borderRadius: "6px", background: "linear-gradient(90deg, #f4d990 0%, #cb9b3d 100%)", color: "#091130", fontWeight: 600, fontSize: "12px" }}>Сохранить</button>
                  <span style={{ marginLeft: "8px", opacity: savedAstro ? 1 : 0, transition: "opacity 200ms ease", fontSize: "11px", color: "#d3b589" }}>сохранено</span>
                </div>
              </>
            )}
            {mode === "add" && (
              <>
                <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                  <input value={astroNewTitle} onChange={(e) => setAstroNewTitle(e.target.value)} placeholder="Название" style={{ flex: "1", fontSize: "12px", lineHeight: "120%", padding: "8px", borderRadius: "6px", border: "1px solid #2f3a6b", background: "#0c1638", color: "#fff" }} />
                  <input value={astroNewUrl} onChange={(e) => setAstroNewUrl(e.target.value)} placeholder="https://..." style={{ flex: "1", fontSize: "12px", lineHeight: "120%", padding: "8px", borderRadius: "6px", border: "1px solid #2f3a6b", background: "#0c1638", color: "#fff" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
                  <button onClick={addAstro} style={{ padding: "8px 12px", borderRadius: "6px", background: "linear-gradient(90deg, #f4d990 0%, #cb9b3d 100%)", color: "#091130", fontWeight: 600, fontSize: "12px" }}>Добавить</button>
                </div>
              </>
            )}
            {mode === "delete" && (
              <ul className="space-y-2" style={{ marginTop: "10px" }}>
                {astroTitles.map((t, idx) => (
                  <li key={idx}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                      <div className="font-libertinus" style={{ fontSize: "12px", lineHeight: "120%", flex: "1", wordBreak: "break-word" }}>{t}</div>
                      <button onClick={() => deleteAstro(t)} style={{ padding: "6px 10px", borderRadius: "6px", background: "#a23b3b", color: "#fff", fontSize: "12px" }}>Удалить</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="w-full max-w-[343px]" style={{ marginTop: "12px" }}>
          <div className="rounded-xl" style={{ background: "linear-gradient(180deg, #08102d 0%, #1a285b 100%)", color: "#fff", padding: "12px 16px" }}>
            <div className="font-libertinus" style={{ fontSize: "16px", lineHeight: "95%", textTransform: "uppercase", background: "linear-gradient(90deg, #f4d990 0%, #cb9b3d 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Подкасты</div>
            {mode === "edit" && (
              <>
                <ul className="space-y-2" style={{ marginTop: "10px" }}>
                  {podItems.map((it, idx) => (
                    <li key={idx}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                        <div className="font-libertinus" style={{ fontSize: "12px", lineHeight: "120%", flex: "0 0 48%", wordBreak: "break-word" }}>{it.title}</div>
                        <input value={it.url} onChange={(e) => setPodItems((prev) => prev.map((p, i) => (i === idx ? { ...p, url: e.target.value } : p)))} placeholder="https://..." style={{ flex: "1", minWidth: "0", fontSize: "12px", lineHeight: "120%", padding: "8px", borderRadius: "6px", border: "1px solid #2f3a6b", background: "#0c1638", color: "#fff" }} />
                      </div>
                    </li>
                  ))}
                </ul>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
                  <button onClick={savePod} style={{ padding: "8px 12px", borderRadius: "6px", background: "linear-gradient(90deg, #f4d990 0%, #cb9b3d 100%)", color: "#091130", fontWeight: 600, fontSize: "12px" }}>Сохранить</button>
                  <span style={{ marginLeft: "8px", opacity: savedPod ? 1 : 0, transition: "opacity 200ms ease", fontSize: "11px", color: "#d3b589" }}>сохранено</span>
                </div>
              </>
            )}
            {mode === "add" && (
              <>
                <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                  <input value={podNewTitle} onChange={(e) => setPodNewTitle(e.target.value)} placeholder="Название" style={{ flex: "1", fontSize: "12px", lineHeight: "120%", padding: "8px", borderRadius: "6px", border: "1px solid #2f3a6b", background: "#0c1638", color: "#fff" }} />
                  <input value={podNewUrl} onChange={(e) => setPodNewUrl(e.target.value)} placeholder="https://..." style={{ flex: "1", fontSize: "12px", lineHeight: "120%", padding: "8px", borderRadius: "6px", border: "1px solid #2f3a6b", background: "#0c1638", color: "#fff" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
                  <button onClick={addPod} style={{ padding: "8px 12px", borderRadius: "6px", background: "linear-gradient(90deg, #f4d990 0%, #cb9b3d 100%)", color: "#091130", fontWeight: 600, fontSize: "12px" }}>Добавить</button>
                </div>
              </>
            )}
            {mode === "delete" && (
              <ul className="space-y-2" style={{ marginTop: "10px" }}>
                {podItems.map((it, idx) => (
                  <li key={idx}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                      <div className="font-libertinus" style={{ fontSize: "12px", lineHeight: "120%", flex: "1", wordBreak: "break-word" }}>{it.title}</div>
                      <button onClick={() => deletePod(idx)} style={{ padding: "6px 10px", borderRadius: "6px", background: "#a23b3b", color: "#fff", fontSize: "12px" }}>Удалить</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      )}
    </div>
  )
}
