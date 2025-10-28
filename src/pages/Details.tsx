import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Heart, Bookmark, Star, Check, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApiKeys } from "@/contexts/ApiKeysContext";
import { useWatchlist } from "@/contexts/WatchlistContext";
import { useEpisodeTracking } from "@/contexts/EpisodeTrackingContext";
import { tmdbService, Movie, Cast, Video, Episode } from "@/services/tmdb";
import BottomNav from "@/components/BottomNav";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const Details = () => {
  const { id, mediaType } = useParams<{ id: string; mediaType: 'movie' | 'tv' }>();
  const navigate = useNavigate();
  const { apiKeys, hasApiKeys } = useApiKeys();
  const { 
    isFavorite, 
    addToFavorites, 
    removeFromFavorites,
    isInWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    addToContinueWatching
  } = useWatchlist();
  const {
    getShowProgress,
    updateProgress,
    markEpisodeWatched,
    isEpisodeWatched,
    getSeasonProgress,
  } = useEpisodeTracking();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedEpisode, setSelectedEpisode] = useState<number>(1);
  const [showPlayer, setShowPlayer] = useState(false);
  const [loading, setLoading] = useState(true);

  const isTvShow = mediaType === 'tv';
  const showId = id ? parseInt(id) : 0;

  useEffect(() => {
    if (!hasApiKeys || !id || !mediaType) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [movieData, castData, videosData] = await Promise.all([
          tmdbService.getDetails(apiKeys.tmdb, id, mediaType),
          tmdbService.getCredits(apiKeys.tmdb, id, mediaType),
          tmdbService.getVideos(apiKeys.tmdb, id, mediaType),
        ]);
        setMovie(movieData);
        setCast(castData.slice(0, 6));
        setVideos(videosData.filter(v => v.site === 'YouTube' && v.type === 'Trailer'));
        
        // Load saved progress for TV shows
        if (mediaType === 'tv' && id) {
          const progress = getShowProgress(parseInt(id));
          if (progress) {
            setSelectedSeason(progress.currentSeason);
            setSelectedEpisode(progress.currentEpisode);
          }
        }
      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, mediaType, apiKeys.tmdb, hasApiKeys]);

  // Fetch episodes when season changes (TV shows only)
  useEffect(() => {
    if (!isTvShow || !hasApiKeys || !id || !selectedSeason) return;

    const fetchEpisodes = async () => {
      try {
        const seasonData = await tmdbService.getSeasonDetails(
          apiKeys.tmdb,
          id,
          selectedSeason
        );
        setEpisodes(seasonData.episodes);
        setSelectedEpisode(1);
      } catch (error) {
        console.error("Error fetching episodes:", error);
      }
    };

    fetchEpisodes();
  }, [selectedSeason, id, isTvShow, apiKeys.tmdb, hasApiKeys]);

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
  const trailer = videos[0];
  const progress = isTvShow && id ? getShowProgress(parseInt(id)) : null;
  const seasonProgress = isTvShow && id && episodes.length > 0 
    ? getSeasonProgress(parseInt(id), selectedSeason, episodes.length)
    : null;
  
  const getPlayerUrl = () => {
    if (isTvShow) {
      return `https://vidsrc.to/embed/tv/${id}/${selectedSeason}/${selectedEpisode}`;
    }
    return `https://vidsrc.to/embed/movie/${id}`;
  };

  const handlePlayClick = () => {
    setShowPlayer(true);
    
    // Update episode tracking for TV shows
    if (isTvShow && id) {
      updateProgress(parseInt(id), selectedSeason, selectedEpisode);
    }
    
    // Add to continue watching
    if (movie && id && mediaType) {
      addToContinueWatching({
        id: parseInt(id),
        title: title,
        poster_path: movie.poster_path || '',
        vote_average: movie.vote_average,
        media_type: mediaType,
        season: isTvShow ? selectedSeason : undefined,
        episode: isTvShow ? selectedEpisode : undefined,
        progress: 0,
        addedAt: Date.now(),
        lastWatchedAt: Date.now(),
      });
    }
  };

  const handleEpisodeClick = (episodeNumber: number) => {
    setSelectedEpisode(episodeNumber);
    setShowPlayer(true);
    if (id) {
      updateProgress(parseInt(id), selectedSeason, episodeNumber);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMarkWatched = (episodeNumber: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (id) {
      markEpisodeWatched(parseInt(id), selectedSeason, episodeNumber);
      toast({
        title: "Episode marked as watched",
        description: `S${selectedSeason}E${episodeNumber}`,
      });
    }
  };

  const handleNextEpisode = () => {
    const currentEpisodeIndex = episodes.findIndex(ep => ep.episode_number === selectedEpisode);
    if (currentEpisodeIndex < episodes.length - 1) {
      const nextEp = episodes[currentEpisodeIndex + 1];
      handleEpisodeClick(nextEp.episode_number);
      toast({
        title: "Playing next episode",
        description: `S${selectedSeason}E${nextEp.episode_number}: ${nextEp.name}`,
      });
    } else {
      toast({
        title: "Season complete!",
        description: "You've reached the last episode of this season.",
      });
    }
  };

  const handleStartFromBeginning = () => {
    setSelectedSeason(1);
    setSelectedEpisode(1);
    setShowPlayer(true);
    if (id) {
      updateProgress(parseInt(id), 1, 1);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleFavorite = () => {
    if (!movie || !id || !mediaType) return;
    
    if (isFavorite(parseInt(id))) {
      removeFromFavorites(parseInt(id));
      toast({
        title: "Removed from favorites",
      });
    } else {
      addToFavorites({
        id: parseInt(id),
        title: title,
        poster_path: movie.poster_path || '',
        vote_average: movie.vote_average,
        media_type: mediaType,
        addedAt: Date.now(),
      });
      toast({
        title: "Added to favorites",
      });
    }
  };

  const handleToggleWatchlist = () => {
    if (!movie || !id || !mediaType) return;
    
    if (isInWatchlist(parseInt(id))) {
      removeFromWatchlist(parseInt(id));
      toast({
        title: "Removed from watchlist",
      });
    } else {
      addToWatchlist({
        id: parseInt(id),
        title: title,
        poster_path: movie.poster_path || '',
        vote_average: movie.vote_average,
        media_type: mediaType,
        addedAt: Date.now(),
      });
      toast({
        title: "Added to watchlist",
      });
    }
  };

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
            <Button 
              size="lg" 
              className="flex-1 gap-2 bg-primary text-primary-foreground hover:bg-primary/90" 
              onClick={handlePlayClick}
            >
              <Play size={20} fill="currentColor" />
              <span className="font-semibold">
                {isTvShow && progress 
                  ? `Continue S${progress.currentSeason}E${progress.currentEpisode}`
                  : 'Play'}
              </span>
            </Button>
            {isTvShow && progress && (
              <Button 
                size="lg" 
                variant="secondary" 
                className="gap-2"
                onClick={handleStartFromBeginning}
              >
                <Play size={20} />
                <span className="text-xs">S1E1</span>
              </Button>
            )}
            <Button 
              size="lg" 
              variant="secondary" 
              className="gap-2"
              onClick={handleToggleFavorite}
            >
              <Heart 
                size={20} 
                className={isFavorite(parseInt(id!)) ? 'fill-primary text-primary' : ''} 
              />
            </Button>
            <Button 
              size="lg" 
              variant="secondary" 
              className="gap-2"
              onClick={handleToggleWatchlist}
            >
              <Bookmark 
                size={20} 
                className={isInWatchlist(parseInt(id!)) ? 'fill-primary text-primary' : ''} 
              />
            </Button>
          </div>

          {/* Video Player */}
          {showPlayer && (
            <div className="mb-6">
              <div className="aspect-video bg-card rounded-lg overflow-hidden">
                <iframe
                  src={getPlayerUrl()}
                  className="w-full h-full"
                  allowFullScreen
                  sandbox="allow-scripts allow-same-origin allow-presentation"
                  referrerPolicy="origin"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                />
              </div>
              {/* Next Episode Button for TV Shows */}
              {isTvShow && episodes.length > 0 && (
                <div className="mt-3 flex gap-2">
                  <Button 
                    onClick={handleNextEpisode}
                    className="flex-1 gap-2"
                    variant="secondary"
                  >
                    <SkipForward size={18} />
                    Next Episode
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Season & Episode Selector for TV Shows */}
          {isTvShow && movie.seasons && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Episodes</h2>
                {seasonProgress && (
                  <div className="text-sm text-muted-foreground">
                    {seasonProgress.watched}/{seasonProgress.total} watched
                  </div>
                )}
              </div>
              
              {/* Season Progress Bar */}
              {seasonProgress && seasonProgress.total > 0 && (
                <div className="mb-4">
                  <Progress value={seasonProgress.percentage} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {seasonProgress.percentage}% complete
                  </p>
                </div>
              )}
              
              <div className="flex gap-3 mb-4">
                <Select value={selectedSeason.toString()} onValueChange={(v) => setSelectedSeason(Number(v))}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Season" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border z-50">
                    {movie.seasons
                      .filter(s => s.season_number > 0)
                      .map((season) => (
                        <SelectItem key={season.id} value={season.season_number.toString()}>
                          {season.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Episode List */}
              <div className="space-y-3">
                {episodes.map((episode) => {
                  const watched = isEpisodeWatched(showId, selectedSeason, episode.episode_number);
                  const isCurrent = selectedEpisode === episode.episode_number;
                  
                  return (
                    <div
                      key={episode.id}
                      className={cn(
                        "flex gap-3 rounded-lg p-3 cursor-pointer transition-all",
                        watched 
                          ? "bg-primary/10 border-2 border-primary/30" 
                          : "bg-card hover:bg-card/80",
                        isCurrent && "ring-2 ring-primary"
                      )}
                      onClick={() => handleEpisodeClick(episode.episode_number)}
                    >
                      {episode.still_path && (
                        <div className="relative">
                          <img
                            src={tmdbService.getImageUrl(episode.still_path, 'w342')}
                            alt={episode.name}
                            className="w-32 h-20 object-cover rounded"
                          />
                          {watched && (
                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center rounded">
                              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                                <Check size={18} className="text-primary-foreground" />
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className={cn(
                            "font-medium text-sm",
                            watched && "text-primary"
                          )}>
                            {episode.episode_number}. {episode.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            {episode.vote_average > 0 && (
                              <div className="flex items-center gap-1">
                                <Star size={12} className="fill-primary text-primary" />
                                <span className="text-xs text-muted-foreground">
                                  {episode.vote_average.toFixed(1)}
                                </span>
                              </div>
                            )}
                            <Button
                              size="sm"
                              variant={watched ? "default" : "outline"}
                              className="h-7 px-2"
                              onClick={(e) => handleMarkWatched(episode.episode_number, e)}
                            >
                              <Check size={14} />
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {episode.overview || 'No description available'}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          {episode.air_date && <span>{episode.air_date}</span>}
                          {episode.runtime && <span>• {episode.runtime}min</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

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
          {!showPlayer && trailer && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Trailer</h2>
              <div className="aspect-video bg-card rounded-lg overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <BottomNav />
    </div>
  );
};

export default Details;
