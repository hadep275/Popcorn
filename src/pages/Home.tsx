import { useEffect, useState } from "react";
import HeroSection from "@/components/HeroSection";
import ContentRow from "@/components/ContentRow";
import BottomNav from "@/components/BottomNav";

// Mock data - Replace with actual TMDB API calls
const mockMovies = [
  {
    id: 1,
    title: "The Shawshank Redemption",
    poster_path: "/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg",
    vote_average: 8.7,
  },
  {
    id: 2,
    title: "The Dark Knight",
    poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    vote_average: 9.0,
  },
  {
    id: 3,
    title: "Inception",
    poster_path: "/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    vote_average: 8.8,
  },
  {
    id: 4,
    title: "Interstellar",
    poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    vote_average: 8.6,
  },
  {
    id: 5,
    title: "Parasite",
    poster_path: "/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    vote_average: 8.5,
  },
  {
    id: 6,
    title: "Joker",
    poster_path: "/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
    vote_average: 8.4,
  },
];

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <HeroSection />
      <div className="mt-8 animate-fade-in">
        <ContentRow title="Trending Now" items={mockMovies} />
        <ContentRow title="Popular on Streaming" items={mockMovies} />
        <ContentRow title="Top Rated" items={mockMovies} />
        <ContentRow title="Action Movies" items={mockMovies} />
        <ContentRow title="Comedy Movies" items={mockMovies} />
      </div>
      <BottomNav />
    </div>
  );
};

export default Home;
