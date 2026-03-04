# Next.js Learning Notes - Movie Search App

## Step 1: Installation & Setup

### Creating a Next.js App

```bash
npx create-next-app@latest movie-search-app
```

### Installation Prompts (Recommended choices):

- **TypeScript?** → Yes ✅
- **ESLint?** → Yes ✅
- **Tailwind CSS?** → No ❌ (had the classic npm/Tailwind issue)
- **`src/` directory?** → Yes ✅ (better organization)
- **App Router?** → Yes ✅ (this is the modern Next.js way!)
- **Turbopack?** → No (optional, can skip for now)
- **customize import alias?** → No (default `@/*` is fine)
- **React Compiler** → No

### What just happened?

- Next.js created a new project with the **App Router** (the newer routing system)
- `src/app` folder - this is where our pages will live
- Each folder in `app/` becomes a route automatically!

### Start the dev server:

```bash
cd movie-search-app
npm run dev
```

### Troubleshooting: Tailwind Native Binding Error

If you get an error about `@tailwindcss/oxide-darwin-arm64` or native bindings:

```bash
# Stop the server (Ctrl+C)
rm -rf node_modules package-lock.json
npm install
npm run dev
```

This is a known npm bug with optional dependencies. Fresh install fixes it!

---

## Key Concept: App Router vs Pages Router

- **App Router** (new, what we're using): Uses `app/` directory, Server Components by default
- **Pages Router** (older): Uses `pages/` directory
- We're using App Router because it's the future of Next.js and makes SSR easier!

---

## Step 2: Understanding the Folder Structure

Open your project in VS Code and let's look at what Next.js created:

```
movie-search-app/
├── src/
│   └── app/
│       ├── page.tsx          ← This is your homepage (localhost:3000)
│       ├── layout.tsx         ← Wraps all pages (like a shell)
│       ├── globals.css        ← Global styles
│       └── favicon.ico
├── public/                    ← Static assets (images, etc.)
├── package.json
└── next.config.ts
```

### Key Files Explained:

**`src/app/page.tsx`** - Your homepage

- Any file named `page.tsx` becomes a route
- This one is at the root, so it's `http://localhost:3000/`

**`src/app/layout.tsx`** - Root layout

- Wraps ALL pages in your app
- Contains `<html>` and `<body>` tags
- Similar to `App.tsx` in Create React App, but more powerful

**Routing in Next.js:**

- Folder-based routing: folder name = route path
- Example: `app/about/page.tsx` → `http://localhost:3000/about`
- No need for React Router! 🎉

### 🔑 Key Concept: Server Components vs Client Components

In Next.js App Router, **components are Server Components by default**. This means:

- They run on the **server**, not in the browser
- They can fetch data directly without `useEffect`
- They're faster and better for SEO
- You opt-in to Client Components with `"use client"` when you need interactivity (useState, onClick, etc.)

We'll see this in action soon!

---

## Step 3: Creating Custom Routes

### Simple Static Route

Create `src/app/about/page.tsx`:

```tsx
export default function AboutPage() {
  return (
    <div>
      <h1>About Movie Search</h1>
      <p>This app helps you search for movies!</p>
    </div>
  );
}
```

Visit `http://localhost:3000/about` - the folder name becomes the URL!

### Dynamic Route with Parameters

Create `src/app/movie/[id]/page.tsx`:

```tsx
export default async function MovieDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <h1>Movie ID: {id}</h1>
      <p>This will show details for movie {id}</p>
    </div>
  );
}
```

**Key concepts:**

- `[id]` folder = dynamic route segment (captures any value in that URL position)
- Visit `/movie/123`, `/movie/456` - the `id` changes dynamically!
- Server Components can be `async` - no `useEffect` needed!

### 🔑 Why is `params` a Promise? (Next.js 15+)

In Next.js 15, `params` became a Promise to enable **Partial Prerendering (PPR)**:

**The goal:** Start sending HTML to the browser as fast as possible, even before all dynamic data is ready.

**How it works:**

- **Old way (Next.js 14):** Wait for params → Render page → Send to browser (slower)
- **New way (Next.js 15):** Start rendering → Stream partial HTML → Params arrive → Fill in the gaps (faster!)

**For developers:** Just `await params` - small API change, big performance win!

This is part of React's **Suspense** and **streaming** architecture, allowing Next.js to deliver pages faster by not blocking on dynamic values. <br>
[More details here](movie-search-app/async-params-explanation.md).

---

## Step 4: Fetching Real Data with SSR

### Setting up OMDB API

1. Get your free API key from https://www.omdbapi.com/apikey.aspx
2. Create `.env.local` in project root (same level as `package.json`):

```
OMDB_API_KEY=your_key_here
```

3. Verify `.env.local` is in `.gitignore` (Next.js adds it by default)
4. Restart dev server after adding env variables

### Fetching Data in a Server Component

Update `src/app/page.tsx`:

```tsx
export default async function HomePage() {
  const response = await fetch(
    `http://www.omdbapi.com/?s=Batman&apikey=${process.env.OMDB_API_KEY}`,
  );
  const data = await response.json();

  return (
    <div style={{ padding: "20px" }}>
      <h1>Movie Search</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
```

### 🔑 What Just Happened? Understanding SSR

**In regular React (Create React App):**

```tsx
// Client-side fetching - the old way
function HomePage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("api-url")
      .then((res) => res.json())
      .then(setData);
  }, []);

  // Handle loading states...
}
```

- Requires `useState` and `useEffect`
- Fetch happens in the browser
- User sees loading spinner
- API call visible in Network tab

**With Next.js SSR:**

```tsx
// Server-side fetching - the new way
async function HomePage() {
  const data = await fetch("api-url");
  // Data is ready immediately!
}
```

- ✅ Just `await fetch()` directly in the component
- ✅ No `useState`, `useEffect`, or loading states needed
- ✅ Fetch happens on the server (not in browser)
- ✅ Data arrives with the HTML
- ✅ **No API call in browser Network tab!**

### Proving SSR Works

Open browser DevTools → Network tab → Refresh page:

1. Click on the `localhost:3000` request
2. Look at the Response tab
3. You'll see the movie data **already in the HTML**!
4. Notice: **No call to `omdbapi.com` in Network tab** - because it happened on the server!

**Traditional React flow:**

```
Browser loads → JS runs → Fetch API → Update DOM
```

**Next.js SSR flow:**

```
Server fetches data → Renders HTML → Sends complete page to browser
```

### Benefits of SSR

1. **Faster perceived load** - Users see content immediately (no loading spinner)
2. **Better SEO** - Search engines can read the data in the HTML
3. **Works without JavaScript** - The HTML already has everything
4. **Secure API keys** - Your API key stays on the server, never exposed to the browser

---

## Step 5: Adding Search Functionality with URL Search Params

### The Challenge

We want a search form (needs interactivity) but data fetching on the server (SSR). How do we connect them?

**Solution: Use URL search params!** When the user searches, update the URL, and Next.js re-fetches with the new search term.

### Update `src/app/page.tsx`:

```tsx
export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const { query = "Batman" } = await searchParams;

  const response = await fetch(
    `http://www.omdbapi.com/?s=${query}&apikey=${process.env.OMDB_API_KEY}`,
  );
  const data = await response.json();

  return (
    <div style={{ padding: "20px" }}>
      <h1>Movie Search</h1>
      <form action="/" method="get" style={{ marginBottom: "20px" }}>
        <input
          name="query"
          type="text"
          defaultValue={query}
          placeholder="Search for a movie..."
          style={{ padding: "8px", width: "300px", marginRight: "10px" }}
        />
        <button type="submit" style={{ padding: "8px 16px" }}>
          Search
        </button>
      </form>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
```

### 🔑 Key Concepts: `searchParams`

**Reserved prop names in Next.js pages:**

- `params` → Dynamic route segments (e.g., `[id]`)
- `searchParams` → URL query strings (e.g., `?query=Batman`)

These are **special prop names** - you MUST name them exactly this. Next.js automatically provides them.

**How it works:**

```
User submits form with name="query"
         ↓
URL becomes: /?query=Superman
         ↓
Next.js reads URL
         ↓
Passes to component: searchParams = { query: "Superman" }
```

**You can customize the query param name:**

```tsx
<input name="movieTitle" />  // Creates ?movieTitle=Batman
<input name="search" />      // Creates ?search=Batman
<input name="q" />           // Creates ?q=Batman

// Then access it:
const { movieTitle } = await searchParams;  // if name="movieTitle"
const { search } = await searchParams;       // if name="search"
```

**The rule:** The `name` attribute in your form must match the property you destructure from `searchParams`.

### Why This Approach?

- ✅ No JavaScript required - works with plain HTML forms!
- ✅ Bookmarkable URLs - users can share `/?query=Inception`
- ✅ Browser back/forward buttons work
- ✅ Server-side rendering on every search
- ✅ SEO-friendly - each search is a unique URL

---

## Step 6: Displaying Movies with Optimized Images

### Using Next.js `<Image>` Component

**Why use `<Image>` instead of `<img>`?**

- ✅ Automatic image optimization (resize, compress)
- ✅ Lazy loading (only loads when scrolled into view)
- ✅ Prevents layout shift
- ✅ Faster page loads
- ✅ Modern formats (WebP, AVIF) automatically

**Import and use:**

```tsx
import Image from "next/image";

<Image
  src={movie.Poster !== "N/A" ? movie.Poster : "/placeholder.png"}
  alt={movie.Title}
  width={200}
  height={300}
  style={{ width: "100%", height: "300px", objectFit: "cover" }}
/>;
```

### Configuring External Image Domains

**The Problem:** Next.js won't optimize external images by default (security).

**The Solution:** Whitelist allowed domains in `next.config.ts`:

```tsx
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https", // Only allow secure HTTPS
        hostname: "m.media-amazon.com", // OMDB poster domain
      },
    ],
  },
};

export default nextConfig;
```

**What it means:**

- `images` → Configuration for Next.js Image component
- `remotePatterns` → Whitelist of allowed external image sources
- `protocol: 'https'` → Only allow secure connections
- `hostname` → The specific domain to allow

**Remember:** Restart dev server after changing `next.config.ts`!

### Adding TypeScript Types

Create `src/types/movie.ts`:

```tsx
export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
  Poster: string;
}

export interface MovieSearchResponse {
  Search: Movie[];
  totalResults: string;
  Response: string;
}
```

Use in your components:

```tsx
import { Movie, MovieSearchResponse } from "@/types/movie";

const data: MovieSearchResponse = await response.json();

{data.Search.map((movie: Movie) => (
  // Now fully typed!
))}
```

---

## Step 7: Linking to Movie Details

### Using `<Link>` for Navigation

**Import:**

```tsx
import Link from "next/link";
```

**Wrap movie cards:**

```tsx
{
  data.Search.map((movie: Movie) => (
    <Link
      key={movie.imdbID}
      href={`/movie/${movie.imdbID}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div style={{ cursor: "pointer" }}>{/* Movie card content */}</div>
    </Link>
  ));
}
```

### Creating the Movie Detail Page

Update `src/app/movie/[id]/page.tsx`:

```tsx
import Image from "next/image";
import Link from "next/link";

interface MovieDetail {
  Title: string;
  Year: string;
  Rated: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Actors: string;
  Plot: string;
  Poster: string;
  imdbRating: string;
  imdbID: string;
}

export default async function MovieDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const response = await fetch(
    `http://www.omdbapi.com/?i=${id}&apikey=${process.env.OMDB_API_KEY}`,
  );
  const movie: MovieDetail = await response.json();

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <Link
        href="/"
        style={{
          display: "inline-block",
          marginBottom: "20px",
          color: "#0070f3",
        }}
      >
        ← Back to Search
      </Link>

      <div style={{ display: "flex", gap: "30px" }}>
        <Image
          src={movie.Poster !== "N/A" ? movie.Poster : "/placeholder.png"}
          alt={movie.Title}
          width={300}
          height={450}
          style={{ borderRadius: "8px" }}
        />
        <div>
          <h1>{movie.Title}</h1>
          <p>
            <strong>Year:</strong> {movie.Year}
          </p>
          <p>
            <strong>Runtime:</strong> {movie.Runtime}
          </p>
          <p>
            <strong>Genre:</strong> {movie.Genre}
          </p>
          <p>
            <strong>Director:</strong> {movie.Director}
          </p>
          <p>
            <strong>Actors:</strong> {movie.Actors}
          </p>
          <p>
            <strong>IMDb Rating:</strong> {movie.imdbRating}/10
          </p>
          <p style={{ marginTop: "20px" }}>{movie.Plot}</p>
        </div>
      </div>
    </div>
  );
}
```

### 🔑 How `<Link>` Works: SSR + Client-Side Navigation

**First visit to any page (cold start):**

1. Click `<Link>` → Next.js fetches the page from server
2. Server renders HTML with data (SSR)
3. Sends **full HTML document** (`<html>`, `<head>`, `<body>`, etc.)
4. Browser displays it immediately
5. Then "hydrates" with JS (adds interactivity)

**Subsequent navigations (clicking other `<Link>`s):**

1. Click `<Link>` → Next.js requests page from server
2. Server still does the work (runs component, fetches data)
3. But sends **lightweight data** (page content as JSON/React components)
4. Client-side React renders it into the page
5. No full page reload - smooth and fast!

**Both are still SSR!** The server does the rendering in both cases, just the delivery format changes.

### The Difference:

**SSR + Client-Side Navigation (Next.js `<Link>`):**

```
First visit: Full HTML document with data
Link clicks: Lightweight data (still server-rendered, just sent as JSON)
Result: Fast first load + smooth navigation + SEO-friendly
```

**Pure CSR (Create React App):**

```
First visit: Empty HTML, JS builds everything in browser
Link clicks: Client-side only
Result: Slower first load, poor SEO
```

**Why it's fast:**

- Server does the heavy lifting (data fetching, rendering)
- First load: Complete HTML (instant display)
- Navigation: Only content changes (no full reload)
- Best of both worlds! 🎉

See here for more info: [SSR vs CSR comparison](./SSR_CSR_comparison.md).

---

## Step 8: Adding Loading States

### Next.js Special/Reserved Filenames

Next.js uses specific filenames to automatically wire up functionality:

- `page.tsx` → The actual page/route
- `layout.tsx` → Wraps pages (shared UI across routes)
- `loading.tsx` → Loading UI (shown while page is fetching data)
- `error.tsx` → Error UI (handles errors in the route)
- `not-found.tsx` → 404 page
- `route.ts` → API endpoints

**The pattern:** Just create a file with the right name in the right folder, and Next.js automatically uses it. No imports or configuration needed!

### Creating Loading States

Next.js automatically shows `loading.tsx` while a page component is fetching data. Each route can have its own loading state.

**Homepage loading: `src/app/loading.tsx`**

```tsx
export default function Loading() {
  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>Movie Search</h1>
      <div style={{ marginTop: "30px" }}>
        <p>Loading movies...</p>
      </div>
    </div>
  );
}
```

**Movie detail loading: `src/app/movie/[id]/loading.tsx`**

```tsx
export default function Loading() {
  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <p>Loading movie details...</p>
    </div>
  );
}
```

### How It Works

**File structure:**

```
src/app/
├── loading.tsx              → Loading for homepage (/)
├── page.tsx                 → Homepage
└── movie/
    └── [id]/
        ├── loading.tsx      → Loading for /movie/123
        └── page.tsx         → Movie detail page
```

**Automatic behavior:**

1. User navigates to a route
2. Next.js shows `loading.tsx` immediately
3. Page fetches data (async operations)
4. Once ready, `loading.tsx` is replaced with `page.tsx`

### Why Both Loading Files Are Needed

If you have nested routes, provide loading states for all of them (or none):

- Without `movie/[id]/loading.tsx`: Navigation to movie details can cause errors
- With both files: Smooth loading experience across all routes

**Rule of thumb:** Each route segment should have its own loading state if you use `loading.tsx`.

### What You Get

- ✅ Automatic loading UI - no manual `useState` for loading flags
- ✅ Better UX - users see feedback immediately
- ✅ Route-specific loading - different loading UI for different pages
- ✅ No code changes in your pages - Next.js handles it automatically
