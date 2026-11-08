"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { IoSend, IoArrowBack, IoSearch } from "react-icons/io5";
import Nav from "../components/Nav";

/* ---------- Types ---------- */
interface Message {
  id: number;
  from: "me" | "them";
  text: string;
  time: string;
}

interface Conversation {
  id: number;
  name: string;
  dish: string;
  price: number;
  unread: number;
  online: boolean;
  messages: Message[];
}

/* ---------- Mock data (replace with Supabase) ---------- */
const INITIAL: Conversation[] = [
  {
    id: 1,
    name: "Maria Lopez",
    dish: "Chicken Biryani",
    price: 14.5,
    unread: 2,
    online: true,
    messages: [
      { id: 1, from: "them", text: "Hi! Is the biryani still available for tonight?", time: "4:10 PM" },
      { id: 2, from: "me", text: "Yes, I have 4 portions left.", time: "4:12 PM" },
      { id: 3, from: "them", text: "Great. Does it contain nuts?", time: "4:15 PM" },
      { id: 4, from: "them", text: "My son has an allergy, so I want to be sure.", time: "4:15 PM" },
    ],
  },
  {
    id: 2,
    name: "Sam Patel",
    dish: "Creamy Tomato Pasta",
    price: 15,
    unread: 0,
    online: false,
    messages: [
      { id: 1, from: "them", text: "Can I pick it up at 6?", time: "Yesterday" },
      { id: 2, from: "me", text: "Sure, 6 PM works. I'll send the address.", time: "Yesterday" },
    ],
  },
  {
    id: 3,
    name: "Aisha Khan",
    dish: "Butter Chicken",
    price: 16,
    unread: 1,
    online: true,
    messages: [{ id: 1, from: "them", text: "Loved the butter chicken, thank you!", time: "Mon" }],
  },
];

/* ---------- Helpers ---------- */
const initials = (name: string) =>
  name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

const nowTime = () =>
  new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

function Avatar({
  name,
  online,
  size = "h-12 w-12",
  text = "text-sm",
}: {
  name: string;
  online?: boolean;
  size?: string;
  text?: string;
}) {
  return (
    <div className={`relative shrink-0 ${size}`}>
      <div
        className={`flex h-full w-full items-center justify-center rounded-full bg-green-100 font-bold text-green-800 ${text}`}
      >
        {initials(name)}
      </div>
      {online && (
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
      )}
    </div>
  );
}

/* ---------- Page ---------- */
export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL);
  const [activeId, setActiveId] = useState<number | null>(INITIAL[0].id);
  const [showThread, setShowThread] = useState(false); // mobile only
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const active = conversations.find((c) => c.id === activeId) ?? null;

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter((c) =>
      `${c.name} ${c.dish}`.toLowerCase().includes(q)
    );
  }, [conversations, search]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [active?.messages.length, activeId]);

  function openConversation(id: number) {
    setActiveId(id);
    setShowThread(true);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
    );
  }

  function send() {
    const text = draft.trim();
    if (!text || !active) return;

    setConversations((prev) =>
      prev.map((c) =>
        c.id === active.id
          ? {
              ...c,
              messages: [
                ...c.messages,
                { id: Date.now(), from: "me", text, time: nowTime() },
              ],
            }
          : c
      )
    );
    setDraft("");
    // TODO: insert into your Supabase `messages` table
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <>
    <Nav/>
    <main className="flex h-[calc(100dvh-4rem)] w-full overflow-hidden bg-white">
      {/* ---------- Conversation list ---------- */}
      <aside
        className={`${
          showThread ? "hidden" : "flex"
        } min-h-0 w-full flex-col border-r border-gray-200 md:flex md:w-[360px] md:shrink-0`}
      >
        <div className="space-y-3 px-4 pb-3 pt-4">
          <h1 className="text-2xl font-bold">Chats</h1>
          <div className="relative">
            <IoSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Messenger"
              className="w-full rounded-full bg-gray-100 py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <ul className="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
          {visible.length === 0 ? (
            <li className="p-8 text-center text-sm text-gray-500">
              No conversations found.
            </li>
          ) : (
            visible.map((c) => {
              const last = c.messages[c.messages.length - 1];
              const isActive = c.id === activeId;
              return (
                <li key={c.id}>
                  <button
                    onClick={() => openConversation(c.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-gray-100 ${
                      isActive ? "bg-green-50" : ""
                    }`}
                  >
                    <Avatar name={c.name} online={c.online} />
                    <div className="min-w-0 flex-1">
                      <p
                        className={`truncate text-[15px] ${
                          c.unread ? "font-bold" : "font-semibold"
                        } text-gray-900`}
                      >
                        {c.name}
                      </p>
                      <p
                        className={`truncate text-sm ${
                          c.unread ? "font-semibold text-gray-900" : "text-gray-500"
                        }`}
                      >
                        {last?.from === "me" ? "You: " : ""}
                        {last?.text} · {last?.time}
                      </p>
                    </div>
                    {c.unread > 0 && (
                      <span className="h-3 w-3 shrink-0 rounded-full bg-green-600" />
                    )}
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </aside>

      {/* ---------- Thread ---------- */}
      <section
        className={`${showThread ? "flex" : "hidden"} min-h-0 min-w-0 flex-1 flex-col md:flex`}
      >
        {active ? (
          <>
            {/* Header */}
            <header className="flex items-center gap-3 border-b border-gray-200 px-4 py-2.5 shadow-sm">
              <button
                onClick={() => setShowThread(false)}
                aria-label="Back to chats"
                className="rounded-full p-2 text-xl text-green-700 hover:bg-gray-100 md:hidden"
              >
                <IoArrowBack />
              </button>
              <Avatar name={active.name} online={active.online} size="h-10 w-10" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-gray-900">{active.name}</p>
                <p className="truncate text-xs text-gray-500">
                  {active.online ? "Active now" : "Offline"} · {active.dish}
                </p>
              </div>
            </header>

            {/* Messages */}
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
              <div className="mx-auto flex max-w-3xl flex-col">
                {/* Conversation intro, like Messenger */}
                <div className="mb-6 flex flex-col items-center text-center">
                  <Avatar name={active.name} size="h-20 w-20" text="text-2xl" />
                  <p className="mt-2 font-bold text-gray-900">{active.name}</p>
                  <p className="text-sm text-gray-500">
                    About {active.dish} · ${active.price.toFixed(2)}
                  </p>
                </div>

                {active.messages.map((m, i) => {
                  const mine = m.from === "me";
                  const prev = active.messages[i - 1];
                  const next = active.messages[i + 1];
                  const startsGroup = !prev || prev.from !== m.from;
                  const endsGroup = !next || next.from !== m.from;

                  return (
                    <div
                      key={m.id}
                      className={`flex items-end gap-2 ${
                        mine ? "justify-end" : "justify-start"
                      } ${startsGroup ? "mt-3" : "mt-0.5"}`}
                    >
                      {/* Avatar slot keeps bubbles aligned */}
                      {!mine && (
                        <div className="w-7 shrink-0">
                          {endsGroup && (
                            <Avatar name={active.name} size="h-7 w-7" text="text-[10px]" />
                          )}
                        </div>
                      )}
                      <div
                        title={m.time}
                        className={`max-w-[75%] whitespace-pre-wrap break-words rounded-3xl px-4 py-2 text-[15px] ${
                          mine
                            ? "bg-green-700 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>
            </div>

            {/* Composer */}
            <div className="flex items-end gap-2 px-4 py-3">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onKeyDown}
                rows={1}
                placeholder="Aa"
                className="max-h-32 min-h-[2.5rem] flex-1 resize-none rounded-3xl bg-gray-100 px-4 py-2 text-[15px] outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={send}
                disabled={!draft.trim()}
                aria-label="Send message"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl text-green-700 transition hover:bg-green-50 disabled:text-gray-300 disabled:hover:bg-transparent"
              >
                <IoSend />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-sm text-gray-500">
            Select a chat to start messaging.
          </div>
        )}
      </section>

      {/* ---------- Details panel (wide screens only) ---------- */}
      {active && (
        <aside className="hidden w-80 shrink-0 flex-col items-center border-l border-gray-200 px-6 py-8 text-center xl:flex">
          <Avatar name={active.name} online={active.online} size="h-24 w-24" text="text-3xl" />
          <p className="mt-3 text-lg font-bold text-gray-900">{active.name}</p>
          <p className="text-sm text-gray-500">
            {active.online ? "Active now" : "Offline"}
          </p>

          <div className="mt-8 w-full rounded-2xl bg-gray-50 p-4 text-left">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Chatting about
            </p>
            <p className="mt-1 font-semibold text-gray-900">{active.dish}</p>
            <p className="text-sm text-green-700">${active.price.toFixed(2)}</p>
          </div>
        </aside>
      )}
    </main>
    </>
  );
}