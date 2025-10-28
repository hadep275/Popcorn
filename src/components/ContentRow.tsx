import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ContentCard from "./ContentCard";

interface ContentRowProps {
  title: string;
  items: Array<{
    id: number;
    title: string;
    poster_path: string;
    vote_average: number;
    media_type?: 'movie' | 'tv';
  }>;
}

const ContentRow = ({ title, items }: ContentRowProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 px-6">{title}</h2>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-3 px-6 pb-4">
          {items.map((item) => (
            <ContentCard key={item.id} item={item} />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default ContentRow;
