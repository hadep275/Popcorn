import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Clock, Heart, Bookmark } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import ContentCard from "@/components/ContentCard";
import { useWatchlist } from "@/contexts/WatchlistContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const MyList = () => {
  const navigate = useNavigate();
  const { continueWatching, favorites, watchlist, removeFromContinueWatching, removeFromFavorites, removeFromWatchlist } = useWatchlist();

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">My List</h1>
        
        <Tabs defaultValue="continue" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="continue" className="gap-2">
              <Clock size={16} />
              Continue
            </TabsTrigger>
            <TabsTrigger value="favorites" className="gap-2">
              <Heart size={16} />
              Favorites
            </TabsTrigger>
            <TabsTrigger value="watchlist" className="gap-2">
              <Bookmark size={16} />
              Watchlist
            </TabsTrigger>
          </TabsList>

          {/* Continue Watching */}
          <TabsContent value="continue">
            {continueWatching.length > 0 ? (
              <div className="space-y-4">
                {continueWatching.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 bg-card rounded-lg p-3 cursor-pointer hover:bg-card/80 transition-colors"
                    onClick={() => navigate(`/details/${item.media_type}/${item.id}`)}
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
                      alt={item.title}
                      className="w-24 h-36 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{item.title}</h3>
                      {item.season && item.episode && (
                        <p className="text-sm text-muted-foreground mb-2">
                          S{item.season} E{item.episode}
                        </p>
                      )}
                      {item.progress !== undefined && (
                        <div className="mb-2">
                          <div className="w-full bg-muted rounded-full h-1.5">
                            <div 
                              className="bg-primary h-1.5 rounded-full transition-all"
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{new Date(item.lastWatchedAt).toLocaleDateString()}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromContinueWatching(item.id);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground mt-20">
                <Clock size={48} className="mx-auto mb-4 opacity-50" />
                <p>No items in continue watching</p>
                <p className="text-sm mt-2">Start watching something to see it here</p>
              </div>
            )}
          </TabsContent>

          {/* Favorites */}
          <TabsContent value="favorites">
            {favorites.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {favorites.map((item) => (
                  <div key={item.id} className="relative">
                    <ContentCard item={item} />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeFromFavorites(item.id);
                      }}
                    >
                      <Heart size={16} className="fill-primary text-primary" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground mt-20">
                <Heart size={48} className="mx-auto mb-4 opacity-50" />
                <p>No favorites yet</p>
                <p className="text-sm mt-2">Add movies and shows you love</p>
              </div>
            )}
          </TabsContent>

          {/* Watchlist */}
          <TabsContent value="watchlist">
            {watchlist.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {watchlist.map((item) => (
                  <div key={item.id} className="relative">
                    <ContentCard item={item} />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeFromWatchlist(item.id);
                      }}
                    >
                      <Bookmark size={16} className="fill-primary text-primary" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground mt-20">
                <Bookmark size={48} className="mx-auto mb-4 opacity-50" />
                <p>Your watchlist is empty</p>
                <p className="text-sm mt-2">Add movies and shows to watch later</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <BottomNav />
    </div>
  );
};

export default MyList;
