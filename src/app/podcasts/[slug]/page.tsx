import Link from "next/link"

export default function LessonPage({ params }: { params: { slug: string } }) {
  const title = decodeURIComponent(params.slug).replace(/-/g, " ")
  return (
    <div className="app-stars min-h-screen flex flex-col items-center px-4 py-6">
      <nav className="w-full max-w-[343px] flex justify-between gap-2 mb-2">
        <Link
          href="/podcasts"
          className="font-libertinus"
          style={{
            padding: "8px 12px",
            borderRadius: "9999px",
            background: "linear-gradient(90deg, #f4d990 0%, #cb9b3d 100%)",
            color: "#08102d",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          меню подкастов
          <img src="/Vector%2027.svg" alt="arrow" width={18} height={12} />
        </Link>
        <Link
          href="/home"
          className="font-libertinus"
          style={{
            padding: "8px 12px",
            borderRadius: "9999px",
            background: "linear-gradient(90deg, #f4d990 0%, #cb9b3d 100%)",
            color: "#08102d",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          домой
          <img src="/Vector%2027.svg" alt="arrow" width={18} height={12} />
        </Link>
      </nav>
      <div
        className="font-libertinus"
        style={{
          fontWeight: 400,
          fontSize: "18px",
          lineHeight: "95%",
          textTransform: "uppercase",
          background: "linear-gradient(90deg, #f4d990 0%, #cb9b3d 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {title}
      </div>
      <div
        style={{
          marginTop: "18px",
          width: "343px",
          minHeight: "180px",
          borderRadius: "20px",
          background: "linear-gradient(180deg, #08102d 0%, #1a285b 100%)",
        }}
      />
    </div>
  )
}
