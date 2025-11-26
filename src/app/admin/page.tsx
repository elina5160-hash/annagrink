"use client"
import { useState } from "react"

type Item = { title: string; description?: string; url: string }

function saveItems(items: Item[]) {
  try {
    localStorage.setItem("podcasts:items", JSON.stringify(items))
  } catch {}
}

function loadItems(): Item[] {
  try {
    const raw = localStorage.getItem("podcasts:items")
    const arr = raw ? JSON.parse(raw) : []
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

export default function AdminPage() {
  const [items, setItems] = useState<Item[]>(() => loadItems())
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [url, setUrl] = useState("")
  const [error, setError] = useState("")
  const [ok, setOk] = useState("")

  function addItem() {
    setError("")
    setOk("")
    if (!title.trim() || !url.trim()) {
      setError("Заполните название и ссылку")
      return
    }
    const next = [{ title: title.trim(), description: description.trim(), url: url.trim() }, ...items]
    setItems(next)
    saveItems(next)
    setTitle("")
    setDescription("")
    setUrl("")
    setOk("Сохранено")
  }

  return (
    <div className="app-stars min-h-screen flex flex-col items-center px-4 py-6">
      <div
        className="font-libertinus"
        style={{
          fontWeight: 400,
          fontSize: "22px",
          lineHeight: "95%",
          textTransform: "uppercase",
          background: "linear-gradient(90deg, #f4d990 0%, #cb9b3d 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Админ панель
      </div>
      <div className="w-full max-w-[343px] mt-4">
        <div
          className="rounded-2xl p-4"
          style={{ background: "linear-gradient(180deg, #08102d 0%, #1a285b 100%)" }}
        >
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Название"
            className="w-full mb-2 rounded-xl px-3 py-2"
            style={{ background: "#0e1538", color: "#fff" }}
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Описание (необязательно)"
            className="w-full mb-2 rounded-xl px-3 py-2"
            style={{ background: "#0e1538", color: "#fff", minHeight: "80px" }}
          />
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Ссылка на материал"
            className="w-full mb-3 rounded-xl px-3 py-2"
            style={{ background: "#0e1538", color: "#fff" }}
          />
          <button
            onClick={addItem}
            className="font-libertinus"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 12px",
              borderRadius: "9999px",
              background: "linear-gradient(90deg, #f4d990 0%, #cb9b3d 100%)",
              color: "#08102d",
              textTransform: "uppercase",
              transition: "transform 150ms ease",
            }}
            onMouseDown={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)"
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"
            }}
          >
            Добавить
          </button>
          {error && <div style={{ color: "#e63946", marginTop: "8px" }}>{error}</div>}
          {ok && <div style={{ color: "#10b981", marginTop: "8px" }}>{ok}</div>}
        </div>
      </div>
      <div className="w-full max-w-[343px] mt-4 mb-24">
        <ul className="space-y-2">
          {items.map((it, idx) => (
            <li key={idx}>
              <div
                className="flex items-center justify-between px-4 py-3 rounded-xl"
                style={{ background: "linear-gradient(180deg, #08102d 0%, #1a285b 100%)", color: "#fff" }}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-libertinus" style={{ fontSize: "14px", lineHeight: "120%", wordBreak: "break-word" }}>{it.title}</div>
                  {it.description ? (
                    <div style={{ fontSize: "12px", opacity: 0.85, marginTop: "4px" }}>{it.description}</div>
                  ) : null}
                </div>
                <a href={it.url} target="_blank" rel="noopener noreferrer" className="font-libertinus" style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 12px",
                  borderRadius: "9999px",
                  background: "linear-gradient(90deg, #f4d990 0%, #cb9b3d 100%)",
                  color: "#08102d",
                  textTransform: "uppercase",
                }}>
                  Открыть
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

