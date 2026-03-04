# Why Are Params Async?

Great question! Next.js made `params` async in version 15 to support **Partial Prerendering (PPR)** and improve performance.

## Why Async Params?

### 1. Partial Prerendering (PPR)
Next.js wants to render parts of your page statically while streaming dynamic parts. By making `params` async, they can:
- Start rendering the static shell of your page immediately
- Stream in the dynamic `params` data when it's ready
- Not block the entire page waiting for route parameters

### 2. Better Streaming
```typescript
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  // Static content can render immediately
  return (
    <div>
      <Header /> {/* Renders right away */}
      <Suspense fallback={<Loading />}>
        <DynamicContent params={params} /> {/* Waits for params */}
      </Suspense>
    </div>
  );
}
```

### 3. Edge Runtime Compatibility
In edge environments, some operations that determine params (like reading cookies or headers) are inherently async. Making everything consistently async simplifies the architecture.

### 4. Future-Proofing
As Next.js adds more advanced features (like resumable rendering), having async primitives gives them more flexibility.

## Before (Next.js 14)
```typescript
params: { id: string } // Synchronous, everything had to wait
```

## After (Next.js 15)
```typescript
params: Promise<{ id: string }> // Async, can stream and optimize
```

---

It's part of Next.js's broader shift toward **streaming** and **progressive rendering** to make apps feel faster!