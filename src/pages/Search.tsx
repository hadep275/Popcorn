import { useState, useEffect } from "react";
import { Search as SearchIcon, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useApiKeys } from "@/contexts/ApiKeysContext";
import { tmdbService, Movie } from "@/services/tmdb";
import BottomNav from "@/components/BottomNav";
import ContentCard from "@/components/ContentCard";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Search = () => {
  const navigate = useNavigate();
  const { apiKeys, hasApiKeys } = useApiKeys();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [mediaType, setMediaType] = useState<'movie' | 'tv'>('movie');
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedRating, setSelectedRating] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  // Load genres when media type changes
  useEffect(() => {
    if (!hasApiKeys) return;
    
    const loadGenres = async () => {
      try {
        const genreData = await tmdbService.getGenres(apiKeys.tmdb, mediaType);
        setGenres(genreData);
      } catch (error) {
        console.error("Error loading genres:", error);
      }
    };
    
    loadGenres();
  }, [mediaType, apiKeys.tmdb, hasApiKeys]);

  const handleSearch = async () => {
    if (!hasApiKeys) return;

    try {
      setLoading(true);
      const filters = {
        query: query.trim(),
        mediaType,
        genre: selectedGenre ? parseInt(selectedGenre) : undefined,
        year: selectedYear ? parseInt(selectedYear) : undefined,
        minRating: selectedRating ? parseFloat(selectedRating) : undefined,
      };
      
      const data = await tmdbService.advancedSearch(apiKeys.tmdb, filters);
      setResults(data);
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setLoading(false);
    }
  };

  // Trigger search when filters change
  useEffect(() => {
    if (hasApiKeys && (query || selectedGenre || selectedYear || selectedRating)) {
      handleSearch();
    } else {
      setResults([]);
    }
  }, [query, mediaType, selectedGenre, selectedYear, selectedRating]);

  const clearFilters = () => {
    setSelectedGenre("");
    setSelectedYear("");
    setSelectedRating("");
  };

  // Generate year options (current year to 1900)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i);

  const formatItems = (items: Movie[]) =>
    items.map((item) => ({
      id: item.id,
      title: item.title || item.name || "",
      poster_path: item.poster_path || "",
      vote_average: item.vote_average,
      media_type: mediaType,
    }));

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Search</h1>
        
        {/* Media Type Tabs */}
        <Tabs value={mediaType} onValueChange={(v) => setMediaType(v as 'movie' | 'tv')} className="mb-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="movie">Movies</TabsTrigger>
            <TabsTrigger value="tv">TV Shows</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Search Input */}
        <div className="relative mb-4">
          <SearchIcon
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            size={20}
          />
          <Input
            type="text"
            placeholder={`Search ${mediaType === 'movie' ? 'movies' : 'TV shows'}...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 bg-card border-border"
            maxLength={100}
          />
        </div>

        {/* Filter Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="mb-4 gap-2"
        >
          <Filter size={16} />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>

        {/* Filters */}
        {showFilters && (
          <div className="mb-6 p-4 bg-card rounded-lg space-y-3">
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="text-sm font-medium mb-2 block">Genre</label>
                <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="All Genres" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border z-50 max-h-[300px]">
                    <SelectItem value="all">All Genres</SelectItem>
                    {genres.map((genre) => (
                      <SelectItem key={genre.id} value={genre.id.toString()}>
                        {genre.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Year</label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="All Years" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border z-50 max-h-[300px]">
                    <SelectItem value="all">All Years</SelectItem>
                    {years.slice(0, 50).map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Minimum Rating</label>
                <Select value={selectedRating} onValueChange={setSelectedRating}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Any Rating" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border z-50">
                    <SelectItem value="all">Any Rating</SelectItem>
                    <SelectItem value="7">7+ ⭐</SelectItem>
                    <SelectItem value="8">8+ ⭐⭐</SelectItem>
                    <SelectItem value="9">9+ ⭐⭐⭐</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : results.length > 0 ? (
          <div>
            <h2 className="text-lg font-semibold mb-4">
              {query ? `Results for "${query}"` : 'Results'}
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {formatItems(results).map((item) => (
                <ContentCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        ) : query || selectedGenre || selectedYear || selectedRating ? (
          <div className="text-center text-muted-foreground mt-20">
            No results found
          </div>
        ) : (
          <div className="text-center text-muted-foreground mt-20">
            <SearchIcon size={48} className="mx-auto mb-4 opacity-50" />
            <p>Search for your favorite {mediaType === 'movie' ? 'movies' : 'TV shows'}</p>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default Search;
