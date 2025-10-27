import { Star } from "lucide-react";
import { Link } from "react-router-dom";

interface ContentCardProps {
  item: {
    id: number;
    title: string;
    poster_path: string;
    vote_average: number;
  };
}

const ContentCard = ({ item }: ContentCardProps) => {
  return (
    <Link
      to={`/details/${item.id}`}
      className="flex-shrink-0 w-32 animate-scale-in"
    >
      <div className="relative group cursor-pointer">
        <div className="relative overflow-hidden rounded-lg shadow-card transition-transform duration-300 group-hover:scale-105">
          <img
            src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
            alt={item.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="mt-2">
          <p className="text-sm font-medium line-clamp-2">{item.title}</p>
          <div className="flex items-center gap-1 mt-1">
            <Star size={12} className="fill-primary text-primary" />
            <span className="text-xs text-muted-foreground">
              {item.vote_average.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ContentCard;
