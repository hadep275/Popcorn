import { useEffect, useState } from "react";
import { useApiKeys } from "@/contexts/ApiKeysContext";
import { tmdbService, Movie } from "@/services/tmdb";
import HeroSection from "@/components/HeroSection";
import ContentRow from "@/components/ContentRow";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Home = () => {
  const { apiKeys, hasApiKeys } = useApiKeys();
  const [trending, setTrending] = useState<Movie[]>([]);
  const [popular, setPopular] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasApiKeys) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [trendingData, popularData, topRatedData] = await Promise.all([
          tmdbService.getTrending(apiKeys.tmdb),
          tmdbService.getPopular(apiKeys.tmdb),
          tmdbService.getTopRated(apiKeys.tmdb),
        ]);
        setTrending(trendingData);
        setPopular(popularData);
        setTopRated(topRatedData);
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
          <p className="text-muted-foreground mb-6">
            To start exploring movies and shows, please add your TMDB and YouTube API keys in your profile.
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

  const formatItems = (items: Movie[]) =>
    items.map((item) => ({
      id: item.id,
      title: item.title || item.name || "",
      poster_path: item.poster_path || "",
      vote_average: item.vote_average,
    }));

  return (
    <div className="min-h-screen bg-background pb-20">
      <HeroSection />
      <div className="mt-8 animate-fade-in">
        <ContentRow title="Trending Now" items={formatItems(trending)} />
        <ContentRow title="Popular Movies" items={formatItems(popular)} />
        <ContentRow title="Top Rated" items={formatItems(topRated)} />
      </div>
      <BottomNav />
    </div>
  );
};

export default Home;
