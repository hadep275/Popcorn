import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import BottomNav from "@/components/BottomNav";
import ContentCard from "@/components/ContentCard";

const mockResults = [
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
];

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(mockResults);

  const handleSearch = (value: string) => {
    setQuery(value);
    // Implement actual search with TMDB API
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Search</h1>
        
        {/* Search Input */}
        <div className="relative mb-8">
          <SearchIcon
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            size={20}
          />
          <Input
            type="text"
            placeholder="Search movies & TV shows..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>

        {/* Results */}
        {query ? (
          <div>
            <h2 className="text-lg font-semibold mb-4">
              Results for "{query}"
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {results.map((item) => (
                <ContentCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground mt-20">
            <SearchIcon size={48} className="mx-auto mb-4 opacity-50" />
            <p>Search for your favorite movies and TV shows</p>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default Search;
