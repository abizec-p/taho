"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

/* ---------- Types ---------- */
type Allergen = "gluten" | "dairy" | "nuts" | "eggs" | "shellfish" | "soy";
type Diet = "vegan" | "vegetarian" | "halal";
type Category = "Mains" | "Salads" | "Breakfast" | "Desserts" | "Asian";

interface Food {
  id: number;
  name: string;
  seller: string;
  price: number;
  rating: number;
  prepMins: number;
  category: Category;
  allergens: Allergen[];
  diets: Diet[];
  image: string;
}

interface Ad {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  image: string;
}

type FeedItem =
  | { key: string; type: "food"; food: Food }
  | { key: string; type: "ad"; ad: Ad };

/* ---------- Data ---------- */
const u = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;

const FOODS: Food[] = [
  { id: 1, name: "Wood-Fired Margherita", seller: "Napoli Corner", price: 16.5, rating: 4.8, prepMins: 25, category: "Mains", allergens: ["gluten", "dairy"], diets: ["vegetarian"], image: u("photo-1565299624946-b28f40a0ae38") },
  { id: 2, name: "Classic Smash Burger", seller: "Grill House", price: 14.0, rating: 4.6, prepMins: 20, category: "Mains", allergens: ["gluten", "dairy", "eggs"], diets: [], image: u("photo-1568901346375-23c9450c58cd") },
  { id: 3, name: "Rainbow Veggie Bowl", seller: "Green Table", price: 12.5, rating: 4.7, prepMins: 15, category: "Salads", allergens: [], diets: ["vegan", "vegetarian", "halal"], image: u("photo-1512621776951-a57141f2eefd") },
  { id: 4, name: "Fresh Garden Salad", seller: "Green Table", price: 9.5, rating: 4.4, prepMins: 10, category: "Salads", allergens: ["nuts"], diets: ["vegan", "vegetarian", "halal"], image: u("photo-1540189549336-e6e99c3679fe") },
  { id: 5, name: "Fluffy Pancake Stack", seller: "Sunny Side Café", price: 11.0, rating: 4.9, prepMins: 15, category: "Breakfast", allergens: ["gluten", "dairy", "eggs"], diets: ["vegetarian"], image: u("photo-1567620905732-2d1ec7ab7445") },
  { id: 6, name: "Avocado Egg Toast", seller: "Sunny Side Café", price: 10.5, rating: 4.5, prepMins: 12, category: "Breakfast", allergens: ["gluten", "eggs"], diets: ["vegetarian"], image: u("photo-1482049016688-2d3e1b311543") },
  { id: 7, name: "Tonkotsu Ramen", seller: "Ramen Ya", price: 17.0, rating: 4.8, prepMins: 30, category: "Asian", allergens: ["gluten", "soy", "eggs"], diets: [], image: u("photo-1569718212165-3a8278d5f624") },
  { id: 8, name: "Creamy Tomato Pasta", seller: "Napoli Corner", price: 15.0, rating: 4.3, prepMins: 22, category: "Mains", allergens: ["gluten", "dairy"], diets: ["vegetarian"], image: u("photo-1473093295043-cdd812d0e601") },
  { id: 9, name: "Grilled Chicken Skewers", seller: "Spice Route", price: 13.5, rating: 4.6, prepMins: 25, category: "Asian", allergens: ["soy"], diets: ["halal"], image: u("photo-1555939594-58d7cb561ad1") },
  { id: 10, name: "Chocolate Layer Cake", seller: "Sweet Tooth", price: 7.5, rating: 4.9, prepMins: 5, category: "Desserts", allergens: ["gluten", "dairy", "eggs", "nuts"], diets: ["vegetarian"], image: u("photo-1565958011703-44f9829ba187") },
  { id: 11, name: "Sprinkle Donuts (6)", seller: "Sweet Tooth", price: 9.0, rating: 4.2, prepMins: 5, category: "Desserts", allergens: ["gluten", "dairy", "eggs"], diets: ["vegetarian"], image: u("photo-1551024601-bec78aea704b") },
  { id: 12, name: "Maple French Toast", seller: "Sunny Side Café", price: 12.0, rating: 4.5, prepMins: 15, category: "Breakfast", allergens: ["gluten", "dairy", "eggs"], diets: ["vegetarian"], image: u("photo-1484723091739-30a097e8f929") },
];

const ADS: Ad[] = [
  { id: "ad1", title: "Free delivery this week", subtitle: "On all orders over $25 from local sellers", cta: "Order now", image: u("photo-1504674900247-0877df9cc836") },
  { id: "ad2", title: "Sell your homemade food", subtitle: "Join 2,000+ home chefs on TasteHome", cta: "Become a seller", image: u("photo-1476224203421-9ac39bcb3327") },
  { id: "ad3", title: "20% off your first order", subtitle: "Use code TASTE20 at checkout", cta: "Claim offer", image: u("photo-1546069901-ba9599a7e63c") },
];

const ALLERGENS: Allergen[] = ["gluten", "dairy", "nuts", "eggs", "shellfish", "soy"];
const DIETS: Diet[] = ["vegan", "vegetarian", "halal"];
const CATEGORIES: ("All" | Category)[] = ["All", "Mains", "Salads", "Breakfast", "Asian", "Desserts"];

/* ---------- Filters ---------- */
interface Filters {
  search: string;
  category: "All" | Category;
  maxPrice: number;
  avoid: Allergen[];
  diets: Diet[];
  minRating: number;
  maxPrep: number;
  sort: "popular" | "price-asc" | "price-desc" | "fastest";
}

const DEFAULT_FILTERS: Filters = {
  search: "",
  category: "All",
  maxPrice: 20,
  avoid: [],
  diets: [],
  minRating: 0,
  maxPrep: 60,
  sort: "popular",
};

function applyFilters(foods: Food[], f: Filters): Food[] {
  const q = f.search.trim().toLowerCase();

  const result = foods.filter((food) => {
    if (q && !`${food.name} ${food.seller}`.toLowerCase().includes(q)) return false;
    if (f.category !== "All" && food.category !== f.category) return false;
    if (food.price > f.maxPrice) return false;
    if (food.rating < f.minRating) return false;
    if (food.prepMins > f.maxPrep) return false;
    if (f.avoid.some((a) => food.allergens.includes(a))) return false;
    if (f.diets.length && !f.diets.every((d) => food.diets.includes(d))) return false;
    return true;
  });

  switch (f.sort) {
    case "price-asc": return [...result].sort((a, b) => a.price - b.price);
    case "price-desc": return [...result].sort((a, b) => b.price - a.price);
    case "fastest": return [...result].sort((a, b) => a.prepMins - b.prepMins);
    default: return [...result].sort((a, b) => b.rating - a.rating);
  }
}

/* ---------- Mapping function: foods + ads -> feed ---------- */
function buildFeed(foods: Food[], ads: Ad[], every = 5): FeedItem[] {
  const feed: FeedItem[] = [];
  let adCount = 0;

  foods.forEach((food, i) => {
    feed.push({ key: `food-${food.id}`, type: "food", food });

    const isAdSlot = (i + 1) % every === 0 && i !== foods.length - 1;
    if (isAdSlot && ads.length) {
      const ad = ads[adCount % ads.length];
      feed.push({ key: `ad-${adCount}-${ad.id}`, type: "ad", ad });
      adCount++;
    }
  });

  return feed;
}

/* ---------- Small helpers ---------- */
function toggle<T>(list: T[], item: T): T[] {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full border px-3 py-1 text-sm capitalize transition ${
        active ? "border-orange-500 bg-orange-500 text-white" : "border-gray-300 bg-white text-gray-700 hover:border-orange-400"
      }`}
    >
      {children}
    </button>
  );
}

/* ---------- Cards ---------- */
function FoodCard({ food }: { food: Food }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative h-44 overflow-hidden">
        <Image
          src={food.image}
          alt={food.name}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <span className="absolute right-3 top-3 rounded-full bg-white/95 px-2 py-0.5 text-xs font-semibold">
          ⭐ {food.rating}
        </span>
      </div>
      <div className="space-y-2 p-4">
        <div>
          <h3 className="font-semibold text-gray-900">{food.name}</h3>
          <p className="text-sm text-gray-500">{food.seller} · {food.prepMins} min</p>
        </div>
        <div className="flex flex-wrap gap-1">
          {food.diets.map((d) => (
            <span key={d} className="rounded bg-green-100 px-1.5 py-0.5 text-[11px] capitalize text-green-700">{d}</span>
          ))}
          {food.allergens.map((a) => (
            <span key={a} className="rounded bg-red-50 px-1.5 py-0.5 text-[11px] capitalize text-red-600">{a}</span>
          ))}
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-lg font-bold">${food.price.toFixed(2)}</span>
          <button className="rounded-full bg-orange-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-orange-600">
            Add
          </button>
        </div>
      </div>
    </article>
  );
}

function AdCard({ ad }: { ad: Ad }) {
  return (
    <article className="relative min-h-[22rem] overflow-hidden rounded-2xl">
      <Image src={ad.image} alt={ad.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <span className="absolute left-3 top-3 rounded bg-white/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-700">
        Ad
      </span>
      <div className="absolute bottom-0 p-4 text-white">
        <h3 className="text-lg font-bold">{ad.title}</h3>
        <p className="text-sm text-white/85">{ad.subtitle}</p>
        <button className="mt-3 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-100">
          {ad.cta}
        </button>
      </div>
    </article>
  );
}

function FilterPanel({ filters, setFilters }: { filters: Filters; setFilters: (f: Filters) => void }) {
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    setFilters({ ...filters, [key]: value });

  return (
    <aside className="space-y-6 rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Filters</h2>
        <button onClick={() => setFilters(DEFAULT_FILTERS)} className="text-sm text-orange-600 hover:underline">
          Reset
        </button>
      </div>

      <div>
        <label className="mb-2 flex justify-between text-sm font-medium">
          Max price <span className="text-orange-600">${filters.maxPrice}</span>
        </label>
        <input type="range" min={5} max={20} step={0.5} value={filters.maxPrice}
          onChange={(e) => set("maxPrice", Number(e.target.value))} className="w-full accent-orange-500" />
      </div>

      <div>
        <p className="mb-2 text-sm font-medium">Avoid allergens</p>
        <div className="flex flex-wrap gap-2">
          {ALLERGENS.map((a) => (
            <Chip key={a} active={filters.avoid.includes(a)} onClick={() => set("avoid", toggle(filters.avoid, a))}>
              {a}
            </Chip>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium">Dietary</p>
        <div className="flex flex-wrap gap-2">
          {DIETS.map((d) => (
            <Chip key={d} active={filters.diets.includes(d)} onClick={() => set("diets", toggle(filters.diets, d))}>
              {d}
            </Chip>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium">Minimum rating</p>
        <div className="flex gap-2">
          {[0, 4, 4.5].map((r) => (
            <Chip key={r} active={filters.minRating === r} onClick={() => set("minRating", r)}>
              {r === 0 ? "Any" : `${r}+`}
            </Chip>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 flex justify-between text-sm font-medium">
          Max prep time <span className="text-orange-600">{filters.maxPrep} min</span>
        </label>
        <input type="range" min={5} max={60} step={5} value={filters.maxPrep}
          onChange={(e) => set("maxPrep", Number(e.target.value))} className="w-full accent-orange-500" />
      </div>
    </aside>
  );
}

/* ---------- Listing page ---------- */
export default function Listing() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => applyFilters(FOODS, filters), [filters]);
  const feed = useMemo(() => buildFeed(filtered, ADS, 5), [filtered]);

  return (
    <section className="mx-auto max-w-7xl space-y-5 px-4 py-6">
      {/* Search + mobile filter toggle */}
      <div className="flex items-center gap-3">
        <input
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          placeholder="Search dishes or sellers…"
          className="flex-1 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-orange-400"
        />
        <button
          onClick={() => setShowFilters((s) => !s)}
          className="rounded-full border bg-white px-4 py-2 text-sm lg:hidden"
        >
          Filters
        </button>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((c) => (
          <Chip key={c} active={filters.category === c} onClick={() => setFilters({ ...filters, category: c })}>
            {c}
          </Chip>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Filters */}
        <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
          <div className="lg:sticky lg:top-4">
            <FilterPanel filters={filters} setFilters={setFilters} />
          </div>
        </div>

        {/* Results */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">{filtered.length} dishes found</p>
            <select
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value as Filters["sort"] })}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm"
            >
              <option value="popular">Top rated</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="fastest">Fastest</option>
            </select>
          </div>

          {feed.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-12 text-center text-gray-500">
              No dishes match your filters. Try loosening them.
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {feed.map((item) =>
                item.type === "food" ? (
                  <FoodCard key={item.key} food={item.food} />
                ) : (
                  <AdCard key={item.key} ad={item.ad} />
                )
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}