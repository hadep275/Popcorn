import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import popcornMascot from "@/assets/popcorn-mascot.png";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center p-6">
        <div className="relative mb-8">
          <img 
            src={popcornMascot} 
            alt="Popcorn Mascot" 
            className="w-32 h-32 mx-auto animate-[wiggle_1s_ease-in-out_infinite]"
            style={{
              animation: 'wiggle 1s ease-in-out infinite, bounce 2s ease-in-out infinite'
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-6xl opacity-20 animate-pulse">🍿</div>
          </div>
        </div>
        <h1 className="mb-4 text-6xl font-bold">404</h1>
        <p className="mb-2 text-xl">Oops! This page ran out of popcorn</p>
        <p className="mb-6 text-muted-foreground">The page you're looking for doesn't exist</p>
        <a 
          href="/" 
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Return to Home
        </a>
      </div>
      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
      `}</style>
    </div>
  );
};

export default NotFound;
