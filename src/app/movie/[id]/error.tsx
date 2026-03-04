"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <h1>Failed to load movie</h1>
      <p style={{ color: "red", marginTop: "20px" }}>
        {error.message || "Something went wrong"}
      </p>
      <button
        onClick={reset}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Try Again
      </button>
    </div>
  );
}
