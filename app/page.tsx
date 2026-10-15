"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MessageCircle, Phone, Video, ShieldCheck, Stethoscope, Wallet,
  UserCheck, Sparkles, Heart, Loader2,
} from "lucide-react";
import Logo from "../components/Logo";
import CafeScene from "../components/CafeScene";
import { doctors, getDoctor, type Doctor } from "../lib/doctors";

const KEY = "mindcafe:lastDoctor";
const SEARCH_MS = 2000; // matchmaking animation
const REVEAL_MS = 1000; // doctor card dikhne ka time

const options = [
  {
    mode: "text", title: "Text chat", price: "₹299",
    desc: "Write at your own pace. Nobody hears your voice.",
    cta: "Start chatting", Icon: MessageCircle,
    soft: "bg-[#F6E0D6] text-[#C4623A]", solid: "bg-[#C4623A] group-hover:bg-[#A9502E]",
  },
  {
    mode: "voice", title: "Voice call", price: "₹499",
    desc: "Talk it out. Your name and number stay hidden.",
    cta: "Start a call", Icon: Phone,
    soft: "bg-[#DDE9DE] text-[#4D6F51]", solid: "bg-[#5F8663] group-hover:bg-[#4D6F51]",
  },
  {
    mode: "video", title: "Video call", price: "₹799",
    desc: "A real-time video call with your doctor, face to face.",
    cta: "Start video", Icon: Video,
    soft: "bg-[#EFE2CF] text-[#7A5A3A]", solid: "bg-[#8A6540] group-hover:bg-[#6F4F30]",
  },
];

const trust = [
  { Icon: ShieldCheck, text: "Fully anonymous" },
  { Icon: Stethoscope, text: "Qualified psychiatrists" },
  { Icon: Wallet, text: "Lower cost than therapy" },
];

const steps = [
  { Icon: Sparkles, title: "Pick how you want to talk", text: "Text, voice or video. Whatever feels comfortable today." },
  { Icon: UserCheck, title: "Get matched in seconds", text: "We assign a verified psychiatrist, or bring back your previous one." },
  { Icon: Heart, title: "Talk freely", text: "No name, no number. Just a calm conversation." },
];

export default function CafeLobby() {
  const router = useRouter();
  const [lastDoc, setLastDoc] = useState<Doctor | null>(null);
  const [sameDoctor, setSameDoctor] = useState(false);
  const [matching, setMatching] = useState<{
  mode: string;
  doctor: Doctor;
  found: boolean;
} | null>(null);

const startMatch = (mode: string) => {
  if (matching) return;
  const doctor =
    sameDoctor && lastDoc ? lastDoc : doctors[Math.floor(Math.random() * doctors.length)];
  setMatching({ mode, doctor, found: false });
};

useEffect(() => {
  if (!matching) return;

  // phase 1: searching -> found
  if (!matching.found) {
    const t = setTimeout(
      () => setMatching((m) => (m ? { ...m, found: true } : m)),
      SEARCH_MS
    );
    return () => clearTimeout(t);
  }

  // phase 2: doctor card dikha, phir session pe jao
  try { localStorage.setItem(KEY, matching.doctor.id); } catch {}
  const t = setTimeout(
    () => router.push(`/session?mode=${matching.mode}&doctor=${matching.doctor.id}`),
    REVEAL_MS
  );
  return () => clearTimeout(t);
}, [matching, router]);

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* side paint: the two primary colours */}
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
        <div className="absolute -left-40 top-24 h-[420px] w-[420px] rounded-full bg-[#C4623A] opacity-25 blur-3xl" />
        <div className="absolute -left-24 top-[640px] h-[260px] w-[260px] rounded-full bg-[#5F8663] opacity-20 blur-3xl" />
        <div className="absolute -right-40 top-48 h-[420px] w-[420px] rounded-full bg-[#5F8663] opacity-25 blur-3xl" />
        <div className="absolute -right-24 top-[700px] h-[260px] w-[260px] rounded-full bg-[#C4623A] opacity-20 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 pb-10 pt-5 sm:px-8">
        <header className="flex items-center justify-between">
          <Logo size={52} />
          <span className="flex items-center gap-1.5 rounded-full border border-[#E8E2D6] bg-white px-3.5 py-1.5 text-sm text-[#6B7370]">
            <ShieldCheck className="h-4 w-4 text-[#5F8663]" strokeWidth={1.75} />
            Anonymous &amp; secure
          </span>
        </header>

        <section className="mx-auto mt-8 max-w-2xl text-center sm:mt-12">
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Take a seat. Someone is here to listen.
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-[#6B7370] sm:text-lg">
            Talk to a real psychiatrist without sharing who you are, for much less than a clinic visit.
          </p>
        </section>

        {/* cafe scene + hanging board */}
        <section className="relative mx-auto mt-14 w-full max-w-xl">
          <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2">
            <div className="flex justify-between px-8">
              <span className="h-5 w-0.5 bg-[#6F4F30]" />
              <span className="h-5 w-0.5 bg-[#6F4F30]" />
            </div>
            <div className="w-56 rounded-xl border-4 border-[#6F4F30] bg-[#8A6540] px-6 py-2.5 text-center shadow-lg sm:w-64">
              <span className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-wide text-[#FBF3E4] sm:text-3xl">
                Mind Cafe
              </span>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl border border-[#E8E2D6] bg-[#F3EEE3] shadow-[0_18px_40px_-28px_rgba(47,56,55,0.45)]">
            <CafeScene />
          </div>
        </section>

        {/* previous doctor */}
        {lastDoc && (
          <div className="mx-auto mt-10 flex w-full max-w-xl items-center justify-between gap-4 rounded-2xl border border-[#E8E2D6] bg-white px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#DDE9DE] text-[#4D6F51]">
                <UserCheck className="h-5 w-5" />
              </span>
              <div className="text-left">
                <p className="text-sm font-semibold text-[#2F3837]">Continue with {lastDoc.name}?</p>
                <p className="text-xs text-[#6B7370]">Your previous doctor. Pick a mode below.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSameDoctor((v) => !v)}
              aria-pressed={sameDoctor}
              className={`cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition ${
                sameDoctor ? "bg-[#5F8663] text-white" : "border border-[#5F8663] text-[#4D6F51] hover:bg-[#DDE9DE]"
              }`}
            >
              {sameDoctor ? "Same doctor ✓" : "Use same doctor"}
            </button>
          </div>
        )}

        {/* options */}
        <section className="mx-auto mt-12 w-full max-w-4xl">
          <h2 className="mb-6 text-center font-[family-name:var(--font-display)] text-[28px] font-semibold">
            How would you like to talk?
          </h2>
          <div className="flex flex-col items-center justify-center gap-5 sm:flex-row sm:items-stretch">
            {options.map(({ mode, title, price, desc, cta, Icon, soft, solid }) => (
              <button
                key={mode}
                type="button"
                onClick={() => startMatch(mode)}
                className="group flex w-full max-w-[320px] cursor-pointer flex-col items-center rounded-3xl border border-[#E8E2D6] bg-white p-7 text-center text-[#2F3837] shadow-sm transition hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4623A] sm:w-[260px]"
              >
                <span className={`flex h-20 w-20 items-center justify-center rounded-full ${soft}`}>
                  <Icon className="h-9 w-9" strokeWidth={1.6} />
                </span>
                <span className="mt-5 text-xl font-semibold">{title}</span>
                <span className="mt-1.5 text-sm leading-normal text-[#6B7370]">{desc}</span>
                <span className="mt-4 flex items-baseline gap-1">
                  <span className="text-2xl font-bold">{price}</span>
                  <span className="text-xs text-[#6B7370]">/ 30 min session</span>
                </span>
                <span className={`mt-5 inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white transition ${solid}`}>
                  {cta}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* how it works */}
        <section className="mx-auto mt-16 w-full max-w-4xl">
          <h2 className="mb-6 text-center font-[family-name:var(--font-display)] text-[28px] font-semibold">
            How Mind Cafe works
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {steps.map(({ Icon, title, text }, i) => (
              <div key={title} className="rounded-2xl border border-[#E8E2D6] bg-white/80 p-5 text-center">
                <span className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full text-white ${i === 1 ? "bg-[#5F8663]" : "bg-[#C4623A]"}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-3 text-base font-semibold">{title}</p>
                <p className="mt-1 text-sm text-[#6B7370]">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <ul className="mx-auto mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-[#6B7370]">
          {trust.map(({ Icon, text }) => (
            <li key={text} className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-[#5F8663]" strokeWidth={1.75} />
              {text}
            </li>
          ))}
        </ul>

        <p className="mx-auto mt-auto max-w-md pt-10 text-center text-xs text-[#8A918E]">
          If you are in immediate danger, please contact your local emergency number.
        </p>
      </div>

      {/* matchmaking overlay */}
      {matching && (
  <div className="fixed inset-0 z-50 flex cursor-wait items-center justify-center bg-[#2F3837]/70 backdrop-blur-sm">
    <div className="mx-5 w-full max-w-sm rounded-3xl bg-[#FBF7EE] p-8 text-center shadow-2xl">
      {!matching.found ? (
        <>
          <div className="relative mx-auto flex h-28 w-28 items-center justify-center">
            <span className="absolute inset-0 animate-ping rounded-full bg-[#C4623A]/30" />
            <span className="absolute inset-3 animate-ping rounded-full bg-[#5F8663]/30 [animation-delay:300ms]" />
            <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white shadow">
              <Loader2 className="h-9 w-9 animate-spin text-[#C4623A]" />
            </span>
          </div>
          <p className="mt-6 font-[family-name:var(--font-display)] text-2xl font-semibold">
            {sameDoctor && lastDoc
              ? `Reconnecting you with ${lastDoc.name}`
              : "Finding the right doctor for you"}
          </p>
          <p className="mt-2 text-sm text-[#6B7370]">Hang tight, grabbing you a seat…</p>
        </>
      ) : (
        <div className="animate-in fade-in zoom-in-95 duration-300">
          <span className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#5F8663] text-4xl font-semibold text-white shadow-lg">
            {matching.doctor.name.replace("Dr. ", "").charAt(0)}
          </span>
          <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-[#5F8663]">
            You're matched
          </p>
          <p className="mt-1 font-[family-name:var(--font-display)] text-2xl font-semibold">
            {matching.doctor.name}
          </p>
          <p className="mt-1 text-sm text-[#6B7370]">
            {matching.doctor.title} · {matching.doctor.exp} experience
          </p>
          <p className="mt-4 flex items-center justify-center gap-2 text-sm text-[#6B7370]">
            <Loader2 className="h-4 w-4 animate-spin" />
            Joining your session…
          </p>
        </div>
      )}
    </div>
  </div>
)}
    </main>
  );
}