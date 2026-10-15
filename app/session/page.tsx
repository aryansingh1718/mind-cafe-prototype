"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getDoctor, type Doctor } from "@/lib/doctors";
import {
  ArrowLeft,
  Send,
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  MessageCircle,
  Phone,
  Lock,
  Loader2,
} from "lucide-react";
import Logo from "@/components/Logo";
import { UserAvatar, DoctorAvatar } from "@/components/Avatars";

type Mode = "text" | "voice" | "video";
type Msg = { id: number; from: "me" | "doc"; text: string };
type Ctx = { used: Set<string>; fallbackIdx: number };

// Hard navigation: always works, and also releases the camera stream.
const goHome = () => window.location.assign("/");

const tabs = [
  { mode: "text" as Mode, label: "Text", Icon: MessageCircle },
  { mode: "voice" as Mode, label: "Voice", Icon: Phone },
  { mode: "video" as Mode, label: "Video", Icon: Video },
];

const has = (t: string, words: string[]) => words.some((w) => t.includes(w));

const fallbacks = [
  "I'm listening. Can you tell me a bit more about that?",
  "How has that been affecting your day-to-day life?",
  "When did you first notice it?",
  "What would feel most helpful to talk about first?",
];

function getReply(raw: string, ctx: Ctx): string {
  const t = raw.toLowerCase().trim();

  // 1. safety first: always answered directly, never marked as "used"
  if (
    has(t, [
      "die", "suicide", "kill myself", "end my life", "end it all",
      "hurt myself", "self harm", "self-harm", "don't want to live",
      "dont want to live", "no reason to live",
    ])
  ) {
    return "I'm really glad you told me, and I'm taking it seriously. Right now, are you having thoughts of ending your life, and are you safe where you are? If you might act on these thoughts, please call your local emergency number or go to the nearest hospital, and if someone is nearby, tell them you need company. I'm right here with you.";
  }

  const durationMatch = t.match(
    /(\d+|a|one|two|three|four|five|few|several)\s*(year|month|week|day)s?/
  );

  const rules: { key: string; test: boolean; reply: string }[] = [
    {
      key: "greeting",
      test: /^(hi+|hello|hey+|namaste|hola|good (morning|afternoon|evening))\b/.test(t),
      reply: "Hi, nice to meet you. I'm glad you're here. Take your time. What brings you in today?",
    },
    {
      key: "duration",
      test: !!durationMatch || t.includes("since "),
      reply: durationMatch
        ? `Thank you for telling me. ${durationMatch[0]} is a real stretch to live with this. What does a usual day look like for you right now?`
        : "Thank you for telling me. That's a real stretch to live with this. What does a usual day look like for you right now?",
    },
    {
      key: "emotion",
      test: has(t, [
        "cry", "sad", "low", "depress", "hopeless", "empty", "anxi",
        "panic", "stress", "tired", "lonely", "angry", "scared", "worry",
      ]),
      reply: "I'm sorry you're feeling this way. It's good that you're putting it into words. Is there something that usually sets it off, or does it come without warning?",
    },
    {
      key: "sleep",
      test: has(t, ["sleep", "insomnia", "nightmare"]),
      reply: "Sleep and mood are closely linked. How have your nights been lately, are you falling asleep, staying asleep, or both?",
    },
    {
      key: "work",
      test: has(t, ["work", "job", "boss", "exam", "study", "college", "career"]),
      reply: "That sounds like it's weighing on you. What part of it is hardest right now?",
    },
    {
      key: "people",
      test: has(t, ["family", "parents", "wife", "husband", "girlfriend", "boyfriend", "breakup", "friend"]),
      reply: "Relationships can hold so much of how we feel. Is there someone in your life who knows how you've been doing?",
    },
    {
      key: "short",
      test: t.length <= 6 || ["yes", "no", "ok", "okay", "idk", "hmm"].includes(t),
      reply: "That's okay. There's no rush here. Say as much or as little as you like.",
    },
  ];

  const hit = rules.find((r) => r.test && !ctx.used.has(r.key));
  if (hit) {
    ctx.used.add(hit.key);
    return hit.reply;
  }
  return fallbacks[ctx.fallbackIdx++ % fallbacks.length];
}

function Chat({ doctor }: { doctor: Doctor }) {
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 0,
      from: "doc",
      text: `Hi, I'm ${doctor.name}. This space is private, and I only know you as Guest 4821. What's on your mind today?`,
    },
  ]);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const ctx = useRef<Ctx>({ used: new Set(), fallbackIdx: 0 });

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function send(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setMessages((m) => [...m, { id: Date.now(), from: "me", text }]);
    setDraft("");
    setTyping(true);
    setTimeout(() => {
      const reply = getReply(text, ctx.current);
      setMessages((m) => [...m, { id: Date.now() + 1, from: "doc", text: reply }]);
      setTyping(false);
    }, 1500);
  }

  return (
    <div className="flex h-[calc(100dvh-12rem)] min-h-[420px] flex-col overflow-hidden rounded-3xl border border-[#E8E2D6] bg-white shadow-sm">
      <div className="flex-1 space-y-3 overflow-y-auto p-4 sm:p-6">
        {messages.map((m) =>
          m.from === "doc" ? (
            <div key={m.id} className="flex items-end gap-2">
              <DoctorAvatar className="h-8 w-8 shrink-0" />
              <p className="max-w-[80%] rounded-2xl rounded-bl-md bg-[#F3EEE3] px-4 py-2.5 text-[15px] leading-relaxed">
                {m.text}
              </p>
            </div>
          ) : (
            <div key={m.id} className="flex justify-end">
              <p className="max-w-[80%] rounded-2xl rounded-br-md bg-[#C4623A] px-4 py-2.5 text-[15px] leading-relaxed text-white">
                {m.text}
              </p>
            </div>
          )
        )}
        {typing && (
          <div className="flex items-end gap-2">
            <DoctorAvatar className="h-8 w-8 shrink-0" />
            <div className="flex gap-1 rounded-2xl rounded-bl-md bg-[#F3EEE3] px-4 py-3.5">
              {[0, 150, 300].map((d) => (
                <span
                  key={d}
                  className="h-2 w-2 animate-bounce rounded-full bg-[#9AA19E]"
                  style={{ animationDelay: `${d}ms` }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>
      <form onSubmit={send} className="flex items-center gap-2 border-t border-[#E8E2D6] bg-[#FAF8F3] p-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type what's on your mind..."
          className="flex-1 rounded-full border border-[#E8E2D6] bg-white px-5 py-3 text-[15px] outline-none focus:border-[#C4623A] focus:ring-2 focus:ring-[#C4623A]/20"
        />
        <button
          type="submit"
          aria-label="Send message"
          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-[#C4623A] text-white transition hover:bg-[#A9502E] disabled:cursor-not-allowed disabled:opacity-40"
          disabled={!draft.trim()}
        >
          <Send className="h-5 w-5" strokeWidth={1.75} />
        </button>
      </form>
    </div>
  );
}

function Call({ video, doctor }: { video: boolean; doctor: Doctor }) {
  const [secs, setSecs] = useState(0);
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [camState, setCamState] = useState<"loading" | "ready" | "denied">("loading");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const t = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // real camera for video calls
  useEffect(() => {
    if (!video) return;
    let cancelled = false;
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: "user" }, audio: false })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setCamState("ready");
      })
      .catch(() => !cancelled && setCamState("denied"));
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [video]);

  // camera on/off toggle
  useEffect(() => {
    streamRef.current?.getVideoTracks().forEach((t) => (t.enabled = !camOff));
  }, [camOff, camState]);

  const time = `${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`;
  const ctrl =
    "flex h-14 w-14 cursor-pointer items-center justify-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white";

  return (
    <div className="flex h-[calc(100dvh-12rem)] min-h-[420px] flex-col overflow-hidden rounded-3xl bg-[#2F3837] text-white shadow-sm">
      <div className="flex items-center justify-between px-5 pt-4 text-sm text-white/70">
        <span>
          {video ? "Video call" : "Voice call"} with {doctor.name}
        </span>
        <span className="tabular-nums">{time}</span>
      </div>

      <div className="relative flex flex-1 items-center justify-center">
        {video ? (
          <>
            {/* doctor's side: placeholder until real WebRTC is wired up */}
            <div className="flex flex-col items-center gap-4 text-white/80">
              <span className="flex h-28 w-28 items-center justify-center rounded-full bg-[#3E4A49] text-4xl font-semibold text-white sm:h-36 sm:w-36">
                {doctor.name.replace("Dr. ", "").charAt(0)}
              </span>
              <p className="flex items-center gap-2 text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                Waiting for {doctor.name} to join…
              </p>
            </div>

            {/* your own camera */}
            <div className="absolute bottom-4 right-4 h-36 w-28 overflow-hidden rounded-2xl bg-[#3E4A49] ring-1 ring-white/20 sm:h-44 sm:w-32">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`h-full w-full -scale-x-100 object-cover ${camOff || camState !== "ready" ? "invisible" : ""}`}
              />
              {(camOff || camState !== "ready") && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-2 text-center text-xs text-white/80">
                  {camState === "loading" && !camOff ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <VideoOff className="h-5 w-5" />
                  )}
                  {camState === "denied" && <span>Camera blocked</span>}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-8 sm:gap-16">
            <figure className="flex flex-col items-center gap-3">
              <UserAvatar className="h-24 w-24 sm:h-32 sm:w-32" />
              <figcaption className="text-sm text-white/80">You</figcaption>
            </figure>
            <figure className="flex flex-col items-center gap-3">
              <div className="relative">
                <span className="absolute inset-0 animate-ping rounded-full bg-[#86AB89]/30" />
                <DoctorAvatar className="relative h-24 w-24 sm:h-32 sm:w-32" />
              </div>
              <figcaption className="text-sm text-white/80">{doctor.name}</figcaption>
            </figure>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-4 pb-6">
        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? "Unmute microphone" : "Mute microphone"}
          className={`${ctrl} ${muted ? "bg-white text-[#2F3837]" : "bg-white/15 hover:bg-white/25"}`}
        >
          {muted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        </button>
        {video && (
          <button
            type="button"
            onClick={() => setCamOff((c) => !c)}
            aria-label={camOff ? "Turn camera on" : "Turn camera off"}
            className={`${ctrl} ${camOff ? "bg-white text-[#2F3837]" : "bg-white/15 hover:bg-white/25"}`}
          >
            {camOff ? <VideoOff className="h-6 w-6" /> : <Video className="h-6 w-6" />}
          </button>
        )}
        <button
          type="button"
          onClick={goHome}
          aria-label="End call"
          className={`${ctrl} bg-[#C4623A] hover:bg-[#A9502E]`}
        >
          <PhoneOff className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}

function Session() {
  const params = useSearchParams();
  const p = params.get("mode");
  const doctor = getDoctor(params.get("doctor"));
  const [mode, setMode] = useState<Mode>(p === "voice" || p === "video" ? p : "text");

  return (
    <div className="min-h-screen">
      <header className="border-b border-[#E8E2D6] bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={goHome}
              aria-label="Back to the cafe"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-[#6B7370] transition hover:bg-[#F3EEE3]"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <Logo size={40} showName={false} />
            <div>
              <p className="text-sm font-semibold leading-tight">{doctor.name}</p>
              <p className="flex items-center gap-1.5 text-xs text-[#6B7370]">
                <span className="h-2 w-2 rounded-full bg-[#5F8663]" />
                {doctor.title}, online now
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 text-xs text-[#6B7370] sm:flex">
              <Lock className="h-3.5 w-3.5" />
              You are Guest 4821
            </span>
            <button
              type="button"
              onClick={goHome}
              className="cursor-pointer rounded-full border border-[#E8E2D6] bg-white px-4 py-1.5 text-sm font-medium transition hover:bg-[#F3EEE3]"
            >
              End session
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-5">
        <div className="mx-auto mb-4 flex w-full max-w-sm rounded-full border border-[#E8E2D6] bg-white p-1">
          {tabs.map(({ mode: m, label, Icon }) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full py-2 text-sm font-semibold transition ${
                mode === m ? "bg-[#C4623A] text-white" : "text-[#6B7370] hover:text-[#2F3837]"
              }`}
            >
              <Icon className="h-4 w-4" strokeWidth={2} />
              {label}
            </button>
          ))}
        </div>

        {mode === "text" && <Chat key="text" doctor={doctor} />}
        {mode === "voice" && <Call key="voice" video={false} doctor={doctor} />}
        {mode === "video" && <Call key="video" video doctor={doctor} />}
      </main>
    </div>
  );
}

export default function SessionPage() {
  return (
    <Suspense fallback={null}>
      <Session />
    </Suspense>
  );
}