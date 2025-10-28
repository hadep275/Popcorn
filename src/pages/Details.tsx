import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useApiKeys } from "@/contexts/ApiKeysContext";
import { tmdbService, Movie, Cast } from "@/services/tmdb";
import BottomNav from "@/components/BottomNav";

const Details = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { apiKeys, hasApiKeys } = useApiKeys();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasApiKeys || !id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [movieData, castData] = await Promise.all([
          tmdbService.getDetails(apiKeys.tmdb, id),
          tmdbService.getCredits(apiKeys.tmdb, id),
        ]);
        setMovie(movieData);
        setCast(castData.slice(0, 6));
      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, apiKeys.tmdb, hasApiKeys]);

  if (!hasApiKeys) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 pb-20">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Please add your API keys first</p>
          <Button onClick={() => navigate("/profile")}>Go to Profile</Button>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <BottomNav />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 pb-20">
        <div className="text-center">
          <p className="text-muted-foreground">Movie not found</p>
          <Button onClick={() => navigate("/")} className="mt-4">Go Home</Button>
        </div>
        <BottomNav />
      </div>
    );
  }

  const title = movie.title || movie.name || "Unknown Title";
  const releaseYear = movie.release_date?.split("-")[0] || movie.first_air_date?.split("-")[0] || "N/A";
  const isTvShow = Boolean(movie.name || movie.number_of_seasons);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-gradient-to-b from-background to-transparent p-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-foreground"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      <ScrollArea className="h-screen">
        {/* Hero Image */}
        <div className="relative h-[50vh]">
          <img
            src={tmdbService.getImageUrl(movie.backdrop_path, 'original')}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-overlay" />
        </div>

        {/* Content */}
        <div className="px-6 -mt-16 relative z-10">
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Star size={16} className="fill-primary text-primary" />
              <span>{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
            </div>
            <span>{releaseYear}</span>
            {isTvShow ? (
              <>
                {movie.number_of_seasons && (
                  <span>{movie.number_of_seasons} Season{movie.number_of_seasons > 1 ? 's' : ''}</span>
                )}
                {movie.number_of_episodes && (
                  <span>{movie.number_of_episodes} Episodes</span>
                )}
                {movie.episode_run_time?.[0] && (
                  <span>{movie.episode_run_time[0]} min/ep</span>
                )}
              </>
            ) : (
              movie.runtime && <span>{movie.runtime} min</span>
            )}
          </div>

          {/* TV Show Status */}
          {isTvShow && movie.status && (
            <div className="mb-4">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                {movie.status}
              </span>
            </div>
          )}

          {/* Genres */}
          {movie.genres && movie.genres.length > 0 && (
            <div className="flex gap-2 mb-6">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 bg-card rounded-full text-xs"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            <Button size="lg" className="flex-1 gap-2 bg-gradient-hero">
              <Play size={20} fill="white" />
              Play
            </Button>
            <Button size="lg" variant="secondary" className="gap-2">
              <Plus size={20} />
            </Button>
          </div>

          {/* Overview */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Overview</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {movie.overview}
            </p>
          </div>

          {/* Cast */}
          {cast.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Cast</h2>
              <div className="grid grid-cols-3 gap-4">
                {cast.map((actor) => (
                  <div key={actor.id} className="text-center">
                    <div className="w-full aspect-square rounded-lg overflow-hidden mb-2 bg-card">
                      <img
                        src={tmdbService.getImageUrl(actor.profile_path, 'w342')}
                        alt={actor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm font-medium line-clamp-1">{actor.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {actor.character}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trailer Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Trailer</h2>
            <div className="aspect-video bg-card rounded-lg flex items-center justify-center">
              <Play size={48} className="text-muted-foreground" />
            </div>
          </div>
        </div>
      </ScrollArea>

      <BottomNav />
    </div>
  );
};

export default Details;
