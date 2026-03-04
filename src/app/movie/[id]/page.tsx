import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

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
    <div className={styles.container}>
      <Link href="/" className={styles.backLink}>
        ← Back to Search
      </Link>
      <div className={styles.movieContent}>
        <div className={styles.posterWrapper}>
          <Image
            src={movie.Poster !== "N/A" ? movie.Poster : "/placeholder.png"}
            width={300}
            height={450}
            alt={movie.Title}
            className={styles.poster}
          />
        </div>
        <div className={styles.details}>
          <h1 className={styles.title}>{movie.Title}</h1>

          <p className={styles.info}>
            <span className={styles.label}>Year:</span> {movie.Year}
          </p>
          <p className={styles.info}>
            <span className={styles.label}>Rated:</span> {movie.Rated}
          </p>
          <p className={styles.info}>
            <span className={styles.label}>Runtime:</span> {movie.Runtime}
          </p>
          <p className={styles.info}>
            <span className={styles.label}>Genre:</span> {movie.Genre}
          </p>
          <p className={styles.info}>
            <span className={styles.label}>Director:</span> {movie.Director}
          </p>
          <p className={styles.info}>
            <span className={styles.label}>Actors:</span> {movie.Actors}
          </p>
          <p className={styles.info}>
            <span className={styles.label}>IMDb Rating:</span>{" "}
            <span className={styles.rating}>{movie.imdbRating}/10</span>
          </p>

          <p className={styles.plot}>{movie.Plot}</p>
        </div>
      </div>
    </div>
  );
}
