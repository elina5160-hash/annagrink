export function Logo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <circle cx="100" cy="100" r="22" stroke="currentColor" strokeWidth="3" />
      <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="2" />
      <ellipse cx="100" cy="100" rx="80" ry="35" stroke="currentColor" strokeWidth="2" />
      <ellipse cx="100" cy="100" rx="40" ry="90" stroke="currentColor" strokeWidth="2" />
      <path d="M20 100c0-44 36-80 80-80s80 36 80 80" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}