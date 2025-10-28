import { useState, useEffect } from "react";
import { Download, Check, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import BottomNav from "@/components/BottomNav";

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Listen for install prompt
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    
    setDeferredPrompt(null);
  };

  if (isInstalled) {
    return (
      <div className="min-h-screen bg-background pb-20 flex items-center justify-center p-6">
        <Card className="p-8 text-center max-w-md">
          <div className="mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">You're All Set! 🎉</h1>
            <p className="text-muted-foreground">
              Popcorn is already installed on your device
            </p>
          </div>
        </Card>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-6 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <img src="/pwa-192x192.png" alt="Popcorn" className="w-20 h-20 rounded-2xl" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Install Popcorn</h1>
          <p className="text-muted-foreground">
            Get the full app experience on your device
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <Card className="p-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Smartphone size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Works Offline</h3>
                <p className="text-sm text-muted-foreground">
                  Browse your favorites and watchlist even without internet
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Download size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Fast & Lightweight</h3>
                <p className="text-sm text-muted-foreground">
                  Loads instantly and uses minimal storage space
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Check size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Home Screen Access</h3>
                <p className="text-sm text-muted-foreground">
                  Launch directly from your home screen like any other app
                </p>
              </div>
            </div>
          </Card>
        </div>

        {isIOS ? (
          <Card className="p-6 bg-card/50">
            <h3 className="font-semibold mb-3">Install on iOS:</h3>
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li>1. Tap the Share button <span className="text-primary">⎋</span> at the bottom</li>
              <li>2. Scroll down and tap "Add to Home Screen"</li>
              <li>3. Tap "Add" in the top right corner</li>
            </ol>
          </Card>
        ) : deferredPrompt ? (
          <Button 
            size="lg" 
            className="w-full gap-2 bg-gradient-hero"
            onClick={handleInstall}
          >
            <Download size={20} />
            Install App
          </Button>
        ) : (
          <Card className="p-6 bg-card/50">
            <h3 className="font-semibold mb-3">Install on Android:</h3>
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li>1. Tap the menu button (⋮) in your browser</li>
              <li>2. Tap "Install app" or "Add to Home screen"</li>
              <li>3. Tap "Install" when prompted</li>
            </ol>
          </Card>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default Install;
