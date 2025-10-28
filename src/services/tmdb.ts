const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export interface Movie {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  overview: string;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  runtime?: number;
  number_of_seasons?: number;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export const tmdbService = {
  // Helper to get image URL
  getImageUrl: (path: string | null, size: 'w342' | 'w780' | 'original' = 'w342') => {
    if (!path) return '/placeholder.svg';
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
  },

  // Trending movies
  getTrending: async (apiKey: string, mediaType: 'movie' | 'tv' = 'movie') => {
    const response = await fetch(
      `${TMDB_BASE_URL}/trending/${mediaType}/week?api_key=${apiKey}`
    );
    if (!response.ok) throw new Error('Failed to fetch trending');
    const data = await response.json();
    return data.results as Movie[];
  },

  // Popular content
  getPopular: async (apiKey: string, mediaType: 'movie' | 'tv' = 'movie') => {
    const response = await fetch(
      `${TMDB_BASE_URL}/${mediaType}/popular?api_key=${apiKey}`
    );
    if (!response.ok) throw new Error('Failed to fetch popular');
    const data = await response.json();
    return data.results as Movie[];
  },

  // Top rated
  getTopRated: async (apiKey: string, mediaType: 'movie' | 'tv' = 'movie') => {
    const response = await fetch(
      `${TMDB_BASE_URL}/${mediaType}/top_rated?api_key=${apiKey}`
    );
    if (!response.ok) throw new Error('Failed to fetch top rated');
    const data = await response.json();
    return data.results as Movie[];
  },

  // Movie/Show details
  getDetails: async (apiKey: string, id: string, mediaType: 'movie' | 'tv' = 'movie') => {
    const response = await fetch(
      `${TMDB_BASE_URL}/${mediaType}/${id}?api_key=${apiKey}`
    );
    if (!response.ok) throw new Error('Failed to fetch details');
    return await response.json() as Movie;
  },

  // Cast
  getCredits: async (apiKey: string, id: string, mediaType: 'movie' | 'tv' = 'movie') => {
    const response = await fetch(
      `${TMDB_BASE_URL}/${mediaType}/${id}/credits?api_key=${apiKey}`
    );
    if (!response.ok) throw new Error('Failed to fetch credits');
    const data = await response.json();
    return data.cast as Cast[];
  },

  // Videos/Trailers
  getVideos: async (apiKey: string, id: string, mediaType: 'movie' | 'tv' = 'movie') => {
    const response = await fetch(
      `${TMDB_BASE_URL}/${mediaType}/${id}/videos?api_key=${apiKey}`
    );
    if (!response.ok) throw new Error('Failed to fetch videos');
    const data = await response.json();
    return data.results as Video[];
  },

  // Search
  search: async (apiKey: string, query: string, mediaType: 'movie' | 'tv' | 'multi' = 'multi') => {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/${mediaType}?api_key=${apiKey}&query=${encodeURIComponent(query)}`
    );
    if (!response.ok) throw new Error('Failed to search');
    const data = await response.json();
    return data.results as Movie[];
  },

  // Discover by genre
  discoverByGenre: async (
    apiKey: string,
    genreId: number,
    mediaType: 'movie' | 'tv' = 'movie'
  ) => {
    const response = await fetch(
      `${TMDB_BASE_URL}/discover/${mediaType}?api_key=${apiKey}&with_genres=${genreId}`
    );
    if (!response.ok) throw new Error('Failed to discover by genre');
    const data = await response.json();
    return data.results as Movie[];
  },
};
