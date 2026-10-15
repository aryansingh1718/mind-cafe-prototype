type LogoProps = {
  size?: number;
  showName?: boolean;
};

export default function Logo({ size = 48, showName = true }: LogoProps) {
  return (
    <div className="flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden>
        <circle cx="32" cy="32" r="30" fill="#F6E0D6" />
        {/* steam */}
        <path
          d="M24 20c-3-3 3-5 0-9M32 20c-3-3 3-5 0-9M40 20c-3-3 3-5 0-9"
          stroke="#C4623A"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        {/* cup */}
        <path d="M17 26h30v10a13 13 0 0 1-13 13h-4a13 13 0 0 1-13-13V26z" fill="#C4623A" />
        <path d="M47 29h3a5 5 0 0 1 0 10h-4" stroke="#C4623A" strokeWidth="3" strokeLinecap="round" />
        {/* heart */}
        <path
          d="M32 43c-5-3.5-7-6-7-8.2a3.7 3.7 0 0 1 7-1.6 3.7 3.7 0 0 1 7 1.6c0 2.2-2 4.7-7 8.2z"
          fill="#FFF"
        />
        {/* saucer */}
        <rect x="14" y="52" width="36" height="3.5" rx="1.75" fill="#5F8663" />
      </svg>
      {showName && (
        <span className="font-[family-name:var(--font-display)] text-2xl font-semibold leading-none text-[#2F3837]">
          Mind <span className="text-[#C4623A]">Cafe</span>
        </span>
      )}
    </div>
  );
}