import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Plus, Check, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWatchlist } from "@/contexts/WatchlistContext";
import { tmdbService, Video } from "@/services/tmdb";
import { useApiKeys } from "@/contexts/ApiKeysContext";

interface HeroSectionProps {
  featuredContent?: {
    id: number;
    title: string;
    overview: string;
    backdrop_path: string;
    media_type: 'movie' | 'tv';
  };
}

const HeroSection = ({ featuredContent }: HeroSectionProps) => {
  const navigate = useNavigate();
  const { apiKeys } = useApiKeys();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const [trailer, setTrailer] = useState<Video | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (!featuredContent || !apiKeys.tmdb) return;

    const fetchTrailer = async () => {
      try {
        const videos = await tmdbService.getVideos(
          apiKeys.tmdb,
          featuredContent.id.toString(),
          featuredContent.media_type
        );
        const youtubeTrailer = videos.find(
          (v) => v.type === "Trailer" && v.site === "YouTube"
        );
        if (youtubeTrailer) {
          setTrailer(youtubeTrailer);
          // Start playing video after a short delay
          setTimeout(() => setShowVideo(true), 1000);
        }
      } catch (error) {
        console.error("Error fetching trailer:", error);
      }
    };

    fetchTrailer();
  }, [featuredContent, apiKeys.tmdb]);

  if (!featuredContent) {
    return (
      <section className="relative h-[70vh] overflow-hidden bg-muted animate-pulse">
        <div className="absolute inset-0 bg-gradient-overlay" />
      </section>
    );
  }

  const inWatchlist = isInWatchlist(featuredContent.id);
  const backdropUrl = `https://image.tmdb.org/t/p/original${featuredContent.backdrop_path}`;

  const handlePlay = () => {
    navigate(`/details/${featuredContent.media_type}/${featuredContent.id}`);
  };

  const handleWatchlist = () => {
    if (inWatchlist) {
      removeFromWatchlist(featuredContent.id);
    } else {
      addToWatchlist({
        id: featuredContent.id,
        title: featuredContent.title,
        poster_path: featuredContent.backdrop_path,
        media_type: featuredContent.media_type,
        vote_average: 0,
        addedAt: Date.now(),
      });
    }
  };

  return (
    <section className="relative h-[70vh] overflow-hidden">
      {/* Background: Video or Image */}
      <div className="absolute inset-0">
        {showVideo && trailer ? (
          <div className="relative w-full h-full">
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&showinfo=0&rel=0&loop=1&playlist=${trailer.key}&playsinline=1&enablejsapi=1`}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300%] h-[300%] pointer-events-none"
              allow="autoplay; encrypted-media"
              title="Hero Background Video"
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </Button>
          </div>
        ) : (
          <img
            src={backdropUrl}
            alt={featuredContent.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-overlay" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-6 pb-8 z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 drop-shadow-lg">
          {featuredContent.title}
        </h1>
        <p className="text-sm md:text-base text-gray-200 mb-4 line-clamp-2 max-w-2xl drop-shadow-lg">
          {featuredContent.overview}
        </p>
        <div className="flex gap-3">
          <Button
            size="lg"
            className="flex-1 gap-2 bg-primary text-primary-foreground hover:opacity-90"
            onClick={handlePlay}
          >
            <Play size={20} fill="currentColor" />
            Play
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="flex-1 gap-2"
            onClick={handleWatchlist}
          >
            {inWatchlist ? (
              <>
                <Check size={20} />
                In List
              </>
            ) : (
              <>
                <Plus size={20} />
                My List
              </>
            )}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
