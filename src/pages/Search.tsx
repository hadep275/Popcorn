import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useApiKeys } from "@/contexts/ApiKeysContext";
import { tmdbService, Movie } from "@/services/tmdb";
import BottomNav from "@/components/BottomNav";
import ContentCard from "@/components/ContentCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const navigate = useNavigate();
  const { apiKeys, hasApiKeys } = useApiKeys();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    
    if (!searchQuery.trim() || !hasApiKeys) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      const data = await tmdbService.search(apiKeys.tmdb, searchQuery);
      setResults(data);
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!hasApiKeys) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="p-6 flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Please add your API keys to search</p>
            <Button onClick={() => navigate("/profile")}>Go to Profile</Button>
          </div>
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
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : results.length > 0 ? (
          <div>
            <h2 className="text-lg font-semibold mb-4">
              Results for "{query}"
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {formatItems(results).map((item) => (
                <ContentCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        ) : query ? (
          <div className="text-center text-muted-foreground mt-20">
            No results found for "{query}"
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
