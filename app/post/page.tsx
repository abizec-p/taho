"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Nav from "../components/Nav";

/* ---------- Types (move these to a shared types file later) ---------- */
type Allergen = "gluten" | "dairy" | "nuts" | "eggs" | "shellfish" | "soy";
type Diet = "vegan" | "vegetarian" | "halal";
type Category = "Mains" | "Salads" | "Breakfast" | "Desserts" | "Asian";
type Fulfilment = "pickup" | "delivery";

const ALLERGENS: Allergen[] = ["gluten", "dairy", "nuts", "eggs", "shellfish", "soy"];
const DIETS: Diet[] = ["vegan", "vegetarian", "halal"];
const CATEGORIES: Category[] = ["Mains", "Salads", "Breakfast", "Asian", "Desserts"];
const FULFILMENT: Fulfilment[] = ["pickup", "delivery"];

interface FormState {
  name: string;
  description: string;
  category: Category | "";
  price: string;
  prepMins: string;
  quantity: string;
  allergens: Allergen[];
  diets: Diet[];
  fulfilment: Fulfilment[];
}

const INITIAL: FormState = {
  name: "",
  description: "",
  category: "",
  price: "",
  prepMins: "",
  quantity: "",
  allergens: [],
  diets: [],
  fulfilment: ["pickup"],
};

type Errors = Partial<Record<keyof FormState | "image", string>>;

const MAX_IMAGE_MB = 5;

/* ---------- Helpers ---------- */
function toggle<T>(list: T[], item: T): T[] {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
}

function validate(f: FormState, image: File | null): Errors {
  const e: Errors = {};
  if (!image) e.image = "Add a photo of your dish.";
  if (f.name.trim().length < 3) e.name = "Dish name must be at least 3 characters.";
  if (f.description.trim().length < 10) e.description = "Add a short description (10+ characters).";
  if (!f.category) e.category = "Pick a category.";
  const price = Number(f.price);
  if (!f.price || Number.isNaN(price) || price <= 0) e.price = "Enter a valid price.";
  const prep = Number(f.prepMins);
  if (!f.prepMins || !Number.isInteger(prep) || prep <= 0) e.prepMins = "Enter prep time in whole minutes.";
  const qty = Number(f.quantity);
  if (!f.quantity || !Number.isInteger(qty) || qty <= 0) e.quantity = "Enter how many portions you have.";
  if (f.fulfilment.length === 0) e.fulfilment = "Choose pickup, delivery, or both.";
  return e;
}

/* ---------- UI bits ---------- */
function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3 py-1 text-sm capitalize transition ${
        active
          ? "border-green-500 bg-green-500 text-white"
          : "border-gray-300 bg-white text-gray-700 hover:border-green-400"
      }`}
    >
      {children}
    </button>
  );
}

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-900">{label}</label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-green-500";

/* ---------- Page ---------- */
export default function PostPage() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [posted, setPosted] = useState(false);

  // Create / clean up the preview URL
  useEffect(() => {
    if (!image) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(image);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((p) => ({ ...p, image: "Please choose an image file." }));
      return;
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setErrors((p) => ({ ...p, image: `Image must be under ${MAX_IMAGE_MB} MB.` }));
      return;
    }
    setImage(file);
    setErrors((p) => ({ ...p, image: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found = validate(form, image);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      // TODO: 1) upload `image` to Supabase Storage and get its public URL
      //       2) insert the row into your `foods` table
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        price: Number(form.price),
        prepMins: Number(form.prepMins),
        quantity: Number(form.quantity),
        allergens: form.allergens,
        diets: form.diets,
        fulfilment: form.fulfilment,
      };
      console.log("Posting:", payload, image);
      await new Promise((r) => setTimeout(r, 800)); // fake network delay
      setPosted(true);
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setForm(INITIAL);
    setImage(null);
    setErrors({});
    setPosted(false);
  }

  if (posted) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl text-green-700">
          ✓
        </div>
        <h1 className="text-2xl font-bold">Your dish is live!</h1>
        <p className="mt-2 text-gray-600">
          “{form.name}” has been posted to the marketplace.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-md bg-green-900 px-5 py-2 text-sm font-bold text-white/90 hover:bg-green-800"
          >
            Post another
          </button>
          <a
            href="/listings"
            className="rounded-md border border-gray-300 px-5 py-2 text-sm font-medium hover:bg-gray-50"
          >
            View listings
          </a>
        </div>
      </main>
    );
  }

  return (
    <div>
    <Nav/>
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Post a dish</h1>
        <p className="text-sm text-gray-600">
          Share what you’re cooking. Accurate allergen info helps buyers stay safe.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        {/* ---------- Form ---------- */}
        <form onSubmit={handleSubmit} noValidate className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6">
          {/* Photo */}
          <Field label="Photo" error={errors.image} hint={`JPG or PNG, up to ${MAX_IMAGE_MB} MB.`}>
            <label
              className={`flex h-48 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed text-sm text-gray-500 transition hover:border-green-400 ${
                errors.image ? "border-red-300" : "border-gray-300"
              }`}
            >
              {preview ? (
                <div className="relative h-full w-full">
                  <Image src={preview} alt="Dish preview" fill unoptimized className="object-cover" />
                </div>
              ) : (
                <>
                  <span className="text-3xl">📷</span>
                  <span className="mt-1">Click to upload a photo</span>
                </>
              )}
              <input type="file" accept="image/*" onChange={handleImage} className="sr-only" />
            </label>
            {image && (
              <button
                type="button"
                onClick={() => setImage(null)}
                className="mt-2 text-xs text-red-600 hover:underline"
              >
                Remove photo
              </button>
            )}
          </Field>

          <Field label="Dish name" error={errors.name}>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Homemade Chicken Biryani"
              maxLength={60}
              className={inputClass}
            />
          </Field>

          <Field label="Description" error={errors.description} hint={`${form.description.length}/300`}>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Ingredients, flavours, portion size…"
              rows={4}
              maxLength={300}
              className={inputClass}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category" error={errors.category}>
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value as Category)}
                className={inputClass}
              >
                <option value="">Select…</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>

            <Field label="Price (CAD)" error={errors.price}>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">$</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.5"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  placeholder="0.00"
                  className={`${inputClass} pl-7`}
                />
              </div>
            </Field>

            <Field label="Prep time (minutes)" error={errors.prepMins}>
              <input
                type="number"
                inputMode="numeric"
                min="1"
                value={form.prepMins}
                onChange={(e) => set("prepMins", e.target.value)}
                placeholder="e.g. 30"
                className={inputClass}
              />
            </Field>

            <Field label="Portions available" error={errors.quantity}>
              <input
                type="number"
                inputMode="numeric"
                min="1"
                value={form.quantity}
                onChange={(e) => set("quantity", e.target.value)}
                placeholder="e.g. 10"
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="Contains allergens" hint="Select everything this dish contains.">
            <div className="flex flex-wrap gap-2">
              {ALLERGENS.map((a) => (
                <Chip key={a} active={form.allergens.includes(a)} onClick={() => set("allergens", toggle(form.allergens, a))}>
                  {a}
                </Chip>
              ))}
            </div>
          </Field>

          <Field label="Dietary tags">
            <div className="flex flex-wrap gap-2">
              {DIETS.map((d) => (
                <Chip key={d} active={form.diets.includes(d)} onClick={() => set("diets", toggle(form.diets, d))}>
                  {d}
                </Chip>
              ))}
            </div>
          </Field>

          <Field label="How can buyers get it?" error={errors.fulfilment}>
            <div className="flex gap-2">
              {FULFILMENT.map((o) => (
                <Chip key={o} active={form.fulfilment.includes(o)} onClick={() => set("fulfilment", toggle(form.fulfilment, o))}>
                  {o}
                </Chip>
              ))}
            </div>
          </Field>

          <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-5">
            <button
              type="button"
              onClick={reset}
              className="rounded-md px-4 py-2 text-sm text-gray-600 hover:text-black"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-green-900 px-6 py-2 text-sm font-bold text-white/90 hover:bg-green-800 disabled:opacity-60"
            >
              {submitting ? "Posting…" : "Post dish"}
            </button>
          </div>
        </form>

        {/* ---------- Live preview ---------- */}
        <aside className="lg:sticky lg:top-4 lg:self-start">
          <p className="mb-2 text-sm font-medium text-gray-600">Live preview</p>
          <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="relative flex h-44 items-center justify-center bg-gray-100 text-sm text-gray-400">
              {preview ? (
                <Image src={preview} alt="" fill unoptimized className="object-cover" />
              ) : (
                "No photo yet"
              )}
            </div>
            <div className="space-y-2 p-4">
              <div>
                <h3 className="font-semibold text-gray-900">{form.name || "Your dish name"}</h3>
                <p className="text-sm text-gray-500">
                  {form.category || "Category"} · {form.prepMins || "–"} min
                </p>
              </div>
              {form.description && (
                <p className="line-clamp-2 text-sm text-gray-600">{form.description}</p>
              )}
              <div className="flex flex-wrap gap-1">
                {form.diets.map((d) => (
                  <span key={d} className="rounded bg-sky-100 px-1.5 py-0.5 text-[11px] capitalize text-sky-700">{d}</span>
                ))}
                {form.allergens.map((a) => (
                  <span key={a} className="rounded bg-red-50 px-1.5 py-0.5 text-[11px] capitalize text-red-600">{a}</span>
                ))}
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-lg font-bold">
                  ${form.price ? Number(form.price).toFixed(2) : "0.00"}
                </span>
                <span className="rounded-full bg-green-500 px-4 py-1.5 text-sm font-medium text-white">Add</span>
              </div>
            </div>
          </article>
        </aside>
      </div>
    </main>
    </div>
  );
}