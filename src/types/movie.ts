export interface Movie {
  imdbID: string;
  Poster: string;
  Title: string;
  Type: string;
  Year: string;
}

export interface MovieSearchResponse {
  Response: string;
  Search: Movie[];
  totalResults: string;
}
