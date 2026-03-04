import Image from "next/image";
import Link from "next/link";
import { Movie, MovieSearchResponse } from "@/types/movie";
import styles from "./page.module.css";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ searchTerm?: string }>;
}) {
  const { searchTerm = "Flower" } = await searchParams;

  const response = await fetch(
    `http://www.omdbapi.com/?s=${searchTerm}&apikey=${process.env.OMDB_API_KEY}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch movies from API");
  }

  const data: MovieSearchResponse = await response.json();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Movie Search</h1>
      <form action="/" method="get" className={styles.searchForm}>
        <input
          name="searchTerm"
          type="text"
          defaultValue={searchTerm}
          placeholder="Search for a movie..."
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>
          Search
        </button>
      </form>

      {data.Response === "True" ? (
        <div className={styles.moviesGrid}>
          {data.Search.map((movie: Movie) => (
            <Link
              key={movie.imdbID}
              href={`/movie/${movie.imdbID}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className={styles.movieCard}>
                <Image
                  src={
                    movie.Poster !== "N/A" ? movie.Poster : "/placeholder.png"
                  }
                  alt={movie.Title}
                  width={200}
                  height={300}
                  style={{ width: "100%", height: "300px", objectFit: "cover" }}
                />
                <div className={styles.movieInfo}>
                  <h3 className={styles.movieTitle}>{movie.Title}</h3>
                  <p className={styles.movieYear}>{movie.Year}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className={styles.noResults}>
          No movies found. Try a different search!
        </p>
      )}

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
