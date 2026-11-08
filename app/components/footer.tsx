"use client";

import { useState } from "react";

const LINK_GROUPS = [
  {
    title: "Explore",
    links: [
      { label: "Browse dishes", href: "/listings" },
      { label: "Top sellers", href: "/sellers" },
      { label: "New arrivals", href: "/new" },
      { label: "Gift cards", href: "/gift-cards" },
    ],
  },
  {
    title: "Sell",
    links: [
      { label: "Become a seller", href: "/sell" },
      { label: "Seller guide", href: "/sell/guide" },
      { label: "Food safety", href: "/sell/safety" },
      { label: "Seller login", href: "/login" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help centre", href: "/help" },
      { label: "Allergen info", href: "/help/allergens" },
      { label: "Delivery & pickup", href: "/help/delivery" },
      { label: "Contact us", href: "/contact" },
    ],
  },
];

const LEGAL_LINKS = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Cookies", href: "/cookies" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: send to your backend / Supabase
    setSubscribed(true);
    setEmail("");
  }

  return (
    <footer className="mt-16 border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          {/* Brand + newsletter */}
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-green-600">TasteHome</h2>
            <p className="max-w-xs text-sm text-gray-600">
              Home-cooked food from local sellers, delivered fresh to your door.
            </p>

            {subscribed ? (
              <p className="text-sm font-medium text-green-600">
                Thanks for subscribing!
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="flex max-w-sm gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  aria-label="Email address"
                  className="min-w-0 flex-1 rounded-full border border-gray-300 bg-gray-50 px-4 py-2 text-sm outline-none focus:border-green-400"
                />
                <button
                  type="submit"
                  className="rounded-full bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>

          {/* Link columns */}
          {LINK_GROUPS.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h3 className="mb-3 text-sm font-semibold text-gray-900">
                {group.title}
              </h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-600 transition hover:text-green-600"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-6 text-sm text-gray-500 sm:flex-row">
          <p>© {new Date().getFullYear()} TasteHome. All rights reserved.</p>
          <ul className="flex gap-5">
            {LEGAL_LINKS.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="hover:text-green-600">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}