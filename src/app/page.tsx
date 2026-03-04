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
    <div style={{ padding: "20px" }}>
      <h1>Movie Search</h1>
      <form action="/" method="get" style={{ marginBottom: "20px" }}>
        <input
          name="searchTerm"
          type="text"
          defaultValue={searchTerm}
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
