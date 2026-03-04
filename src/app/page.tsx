import Image from "next/image";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ searchTerm?: string }>;
}) {
  const { searchTerm = "Batman" } = await searchParams;

  const response = await fetch(
    `http://www.omdbapi.com/?s=${searchTerm}&apikey=${process.env.OMDB_API_KEY}`,
  );
  const data = await response.json();

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>Movie Search</h1>
      <form action="/" method="get" style={{ marginBottom: "30px" }}>
        <input
          name="searchTerm"
          type="text"
          defaultValue={searchTerm}
          placeholder="Search for a movie..."
          style={{
            padding: "10px",
            width: "300px",
            marginRight: "10px",
            fontSize: "16px",
          }}
        />
        <button
          type="submit"
          style={{ padding: "10px 20px", fontSize: "16px" }}
        >
          Search
        </button>
      </form>

      {data.Response === "True" ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "20px",
          }}
        >
          {data.Search.map((movie: any) => (
            <div
              key={movie.imdbID}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <Image
                src={movie.Poster !== "N/A" ? movie.Poster : "/placeholder.png"}
                alt={movie.Title}
                width={200}
                height={300}
                style={{ width: "100%", height: "300px", objectFit: "cover" }}
              />
              <div style={{ padding: "10px" }}>
                <h3 style={{ margin: "0 0 5px 0", fontSize: "16px" }}>
                  {movie.Title}
                </h3>
                <p style={{ margin: 0, color: "#666" }}>{movie.Year}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No movies found. Try a different search!</p>
      )}

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
