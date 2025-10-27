import { Play, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative h-[70vh] overflow-hidden">
      {/* Hero Image with Gradient Overlay */}
      <div className="absolute inset-0">
        <img
          src="https://image.tmdb.org/t/p/original/8b2ER2kLZyvUKujIL6RCFaIUWeq.jpg"
          alt="Featured Content"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-overlay" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-6 pb-8">
        <h1 className="text-4xl font-bold mb-2 drop-shadow-lg">
          Stranger Things
        </h1>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          When a young boy vanishes, a small town uncovers a mystery involving
          secret experiments, terrifying supernatural forces, and one strange little girl.
        </p>
        <div className="flex gap-3">
          <Button size="lg" className="flex-1 gap-2 bg-gradient-hero hover:opacity-90">
            <Play size={20} fill="white" />
            Play
          </Button>
          <Button size="lg" variant="secondary" className="flex-1 gap-2">
            <Plus size={20} />
            My List
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
