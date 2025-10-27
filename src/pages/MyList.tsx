import BottomNav from "@/components/BottomNav";
import ContentCard from "@/components/ContentCard";

const mockList = [
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

const MyList = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">My List</h1>
        
        {mockList.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {mockList.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground mt-20">
            <p>Your list is empty</p>
            <p className="text-sm mt-2">Add movies and shows to watch later</p>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default MyList;
