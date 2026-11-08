"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaRegCommentDots, FaUser, FaBell } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";
import { IoClose } from "react-icons/io5";

const NOTIFICATIONS = [
  {
    id: 1,
    title: "New order",
    body: "Maria ordered your Chicken Biryani.",
    time: "2m ago",
  },
  {
    id: 2,
    title: "New message",
    body: "Sam asked about allergens in your pasta.",
    time: "1h ago",
  },
  {
    id: 3,
    title: "Review received",
    body: "You got a 5-star review on Butter Chicken.",
    time: "Yesterday",
  },
];

function NotificationModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 pt-24"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Notifications"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="text-lg font-bold">Notifications</h2>

          <button
            onClick={onClose}
            aria-label="Close notifications"
            className="rounded-full p-1 text-xl text-black/60 hover:bg-gray-100 hover:text-black"
          >
            <IoClose />
          </button>
        </div>

        <ul className="max-h-96 divide-y divide-gray-100 overflow-y-auto">
          {NOTIFICATIONS.length === 0 ? (
            <li className="p-8 text-center text-sm text-gray-500">
              You&apos;re all caught up.
            </li>
          ) : (
            NOTIFICATIONS.map((n) => (
              <li key={n.id} className="px-5 py-3 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900">
                    {n.title}
                  </p>
                  <span className="text-xs text-gray-400">{n.time}</span>
                </div>

                <p className="text-sm text-gray-600">{n.body}</p>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default function Nav() {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);

  const linkClass = (href: string, size: string) =>
    `${size} px-2 transition ${
      pathname === href ? "text-green-700" : "text-black/80 hover:text-black"
    }`;

  return (
    <>
      <div className="flex px-30 py-3 items-center shadow-sm backdrop-blur-md bg-white/20 justify-between">
        <Link href="/" aria-label="TasteHome home">
          <h1 className="text-2xl gap-2 flex items-center font-bold">
            <Image
              src="/tahoIcon.png"
              alt="Logo Icon"
              height={1000}
              width={1000}
              className="h-10 w-auto"
            />
            TasteHome
          </h1>
        </Link>

        <div className="flex items-center gap-5">
          <Link
            className="flex outline-none items-center bg-green-900 px-5 py-2 text-white/90 font-bold gap-2 rounded-md"
            href="/post"
          >
            Post
          </Link>

          <Link
            href="/messages"
            aria-label="Messages"
            className={linkClass("/messages", "text-xl")}
          >
            <FaRegCommentDots />{" "}
          </Link>

          <button
            type="button"
            onClick={() => setShowNotifications(true)}
            aria-label="Notifications"
            className="relative px-2 text-xl text-black/80 hover:text-black"
          >
            <FaBell />

            {NOTIFICATIONS.length > 0 && (
              <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-500" />
            )}
          </button>

          <Link
            href="/settings"
            aria-label="Settings"
            className={linkClass("/settings", "text-2xl")}
          >
            <IoIosSettings />
          </Link>

          <Link
            href="/login"
            aria-label="Profile"
            className={linkClass("/profile", "text-xl")}
          >
            <FaUser />
          </Link>
        </div>
      </div>

      {showNotifications && (
        <NotificationModal onClose={() => setShowNotifications(false)} />
      )}
    </>
  );
}
