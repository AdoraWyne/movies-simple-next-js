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
