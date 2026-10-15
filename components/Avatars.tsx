    export function UserAvatar({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={`overflow-hidden rounded-full ${className}`} aria-hidden="true">
      <circle cx="50" cy="50" r="50" fill="#DCE8DD" />
      <path d="M16 100 a34 34 0 0 1 68 0 z" fill="#86AB89" />
      <circle cx="50" cy="44" r="22" fill="#6F9873" />
      <ellipse cx="51" cy="47" rx="12" ry="14" fill="#F1DFCB" />
    </svg>
  );
}

export function DoctorAvatar({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={`overflow-hidden rounded-full ${className}`} aria-hidden="true">
      <circle cx="50" cy="50" r="50" fill="#F6DDD2" />
      <path d="M16 100 a34 34 0 0 1 68 0 z" fill="#FFFDF8" stroke="#E8E2D6" strokeWidth="1.5" />
      <path d="M42 74 v14 a8 8 0 0 0 16 0 v-14" fill="none" stroke="#2F3837" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="50" cy="40" r="20" fill="#E8B894" />
      <path d="M30 38 a20 20 0 0 1 40 0 q-20 -12 -40 0 z" fill="#2F3837" />
      <circle cx="43" cy="43" r="5" fill="none" stroke="#2F3837" strokeWidth="1.5" />
      <circle cx="57" cy="43" r="5" fill="none" stroke="#2F3837" strokeWidth="1.5" />
      <path d="M44 52 q6 5 12 0" fill="none" stroke="#2F3837" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}