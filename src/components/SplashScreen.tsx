import { useEffect, useState } from "react";
import popcornMascot from "@/assets/popcorn-mascot.png";

const SplashScreen = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Check if splash has been shown in this session
    const splashShown = sessionStorage.getItem('splashShown');
    
    if (splashShown) {
      setShow(false);
      return;
    }

    // Hide splash after 2 seconds
    const timer = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem('splashShown', 'true');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-background flex items-center justify-center splash-screen">
      <div className="text-center">
        <img 
          src={popcornMascot}
          alt="Popcorn Mascot" 
          className="w-32 h-32 mx-auto mb-4 splash-logo drop-shadow-2xl"
        />
        <h1 className="text-4xl font-bold text-primary animate-pulse">Popcorn</h1>
        <p className="text-sm text-muted-foreground mt-2">Your Movie Companion</p>
      </div>
    </div>
  );
};

export default SplashScreen;
