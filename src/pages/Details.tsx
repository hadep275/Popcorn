import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Plus, Share2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import BottomNav from "@/components/BottomNav";

const Details = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - Replace with actual TMDB API call
  const movie = {
    title: "The Shawshank Redemption",
    backdrop_path: "/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg",
    poster_path: "/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg",
    vote_average: 8.7,
    release_date: "1994-09-23",
    runtime: 142,
    genres: ["Drama", "Crime"],
    overview:
      "Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison, where he puts his accounting skills to work for an amoral warden. During his long stretch in prison, Dufresne comes to be admired by the other inmates.",
    cast: [
      { name: "Tim Robbins", character: "Andy Dufresne" },
      { name: "Morgan Freeman", character: "Ellis Boyd 'Red' Redding" },
      { name: "Bob Gunton", character: "Warden Norton" },
    ],
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
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-overlay" />
        </div>

        {/* Content */}
        <div className="px-6 -mt-16 relative z-10">
          <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Star size={16} className="fill-primary text-primary" />
              <span>{movie.vote_average.toFixed(1)}</span>
            </div>
            <span>{new Date(movie.release_date).getFullYear()}</span>
            <span>{movie.runtime} min</span>
          </div>

          {/* Genres */}
          <div className="flex gap-2 mb-6">
            {movie.genres.map((genre) => (
              <span
                key={genre}
                className="px-3 py-1 bg-card rounded-full text-xs"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            <Button size="lg" className="flex-1 gap-2 bg-gradient-hero">
              <Play size={20} fill="white" />
              Play
            </Button>
            <Button size="lg" variant="secondary" className="gap-2">
              <Plus size={20} />
            </Button>
            <Button size="lg" variant="secondary" className="gap-2">
              <Share2 size={20} />
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
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Cast</h2>
            <div className="grid grid-cols-3 gap-4">
              {movie.cast.map((actor) => (
                <div key={actor.name} className="text-center">
                  <div className="w-full aspect-square bg-card rounded-lg mb-2" />
                  <p className="text-sm font-medium">{actor.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {actor.character}
                  </p>
                </div>
              ))}
            </div>
          </div>

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
