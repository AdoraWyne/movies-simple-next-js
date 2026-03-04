import Image from "next/image";
import Link from "next/link";

interface MovieDetail {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
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
          textDecoration: "none",
        }}
      >
        ← Back to Search
      </Link>
      <div style={{ display: "flex", gap: "30px" }}>
        <Image
          src={movie.Poster !== "N/A" ? movie.Poster : "/placeholder.png"}
          width={300}
          height={450}
          alt={movie.Title}
          style={{ borderRadius: "10px" }}
        />
        <div style={{ margin: "10px" }}>
          <h1>{movie.Title}</h1>
          <p>
            <strong>Year:</strong> {movie.Year}
          </p>
          <p>
            <strong>Rated:</strong> {movie.Rated}
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
