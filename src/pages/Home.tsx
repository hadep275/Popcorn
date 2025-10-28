import { useEffect, useState } from "react";
import { useApiKeys } from "@/contexts/ApiKeysContext";
import { tmdbService, Movie } from "@/services/tmdb";
import HeroSection from "@/components/HeroSection";
import ContentRow from "@/components/ContentRow";
import BottomNav from "@/components/BottomNav";
import InstallPrompt from "@/components/InstallPrompt";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Home = () => {
  const { apiKeys, hasApiKeys } = useApiKeys();
  const [trending, setTrending] = useState<Movie[]>([]);
  const [popular, setPopular] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [popularTv, setPopularTv] = useState<Movie[]>([]);
  const [topRatedTv, setTopRatedTv] = useState<Movie[]>([]);
  const [action, setAction] = useState<Movie[]>([]);
  const [comedy, setComedy] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasApiKeys) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [
          trendingData,
          popularData,
          topRatedData,
          nowPlayingData,
          upcomingData,
          popularTvData,
          topRatedTvData,
          actionData,
          comedyData,
        ] = await Promise.all([
          tmdbService.getTrending(apiKeys.tmdb),
          tmdbService.getPopular(apiKeys.tmdb),
          tmdbService.getTopRated(apiKeys.tmdb),
          tmdbService.getNowPlaying(apiKeys.tmdb),
          tmdbService.getUpcoming(apiKeys.tmdb),
          tmdbService.getPopular(apiKeys.tmdb, 'tv'),
          tmdbService.getTopRated(apiKeys.tmdb, 'tv'),
          tmdbService.discoverByGenre(apiKeys.tmdb, 28), // Action
          tmdbService.discoverByGenre(apiKeys.tmdb, 35), // Comedy
        ]);
        setTrending(trendingData);
        setPopular(popularData);
        setTopRated(topRatedData);
        setNowPlaying(nowPlayingData);
        setUpcoming(upcomingData);
        setPopularTv(popularTvData);
        setTopRatedTv(topRatedTvData);
        setAction(actionData);
        setComedy(comedyData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiKeys.tmdb, hasApiKeys]);

  if (!hasApiKeys) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 pb-20">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4">Welcome! 🎬✨</h1>
          <p className="text-muted-foreground mb-6 space-y-2">
            <span className="block">To start exploring movies and shows, please add your TMDB API key in your profile to load content.</span>
            <span className="block text-sm">YouTube API key is optional for better trailer support.</span>
          </p>
          <Button asChild className="gap-2">
            <Link to="/profile">Go to Profile →</Link>
          </Button>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  const formatItems = (items: Movie[], mediaType: 'movie' | 'tv' = 'movie') =>
    items.map((item) => ({
      id: item.id,
      title: item.title || item.name || "",
      poster_path: item.poster_path || "",
      vote_average: item.vote_average,
      media_type: mediaType,
    }));

  return (
    <div className="min-h-screen bg-background pb-20">
      <HeroSection />
      <div className="mt-8 animate-fade-in space-y-6">
        <ContentRow title="Trending Now" items={formatItems(trending)} />
        <ContentRow title="Now Playing in Theaters" items={formatItems(nowPlaying)} />
        <ContentRow title="Popular Movies" items={formatItems(popular)} />
        <ContentRow title="Coming Soon" items={formatItems(upcoming)} />
        <ContentRow title="Action Movies" items={formatItems(action)} />
        <ContentRow title="Comedy Movies" items={formatItems(comedy)} />
        <ContentRow title="Top Rated Movies" items={formatItems(topRated)} />
        <ContentRow title="Popular TV Shows" items={formatItems(popularTv, 'tv')} />
        <ContentRow title="Top Rated TV Shows" items={formatItems(topRatedTv, 'tv')} />
      </div>
      <InstallPrompt />
      <BottomNav />
    </div>
  );
};

export default Home;
