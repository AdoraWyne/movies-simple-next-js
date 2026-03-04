"use client";

import { useState } from "react";

export default function SearchForm({
  onSearch,
}: {
  onSearch: (query: string) => void;
}) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a movie..."
        style={{ padding: "8px", width: "300px", marginRight: "10px" }}
      />
      <button type="submit" style={{ padding: "8px 16px" }}>
        Search
      </button>
    </form>
  );
}
