import { useState, useEffect } from "react";
import { X, Download, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import popcornMascot from "@/assets/popcorn-mascot.png";

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if prompt was dismissed before
    const dismissed = localStorage.getItem('installPromptDismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) return; // Don't show again for 7 days
    }

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Show prompt after 10 seconds on first visit
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 10000);

    // Listen for install prompt (Android/Desktop)
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowPrompt(false);
      setIsInstalled(true);
    }
    
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('installPromptDismissed', Date.now().toString());
  };

  if (!showPrompt || isInstalled) return null;

  return (
    <div className="fixed bottom-20 left-0 right-0 z-[100] p-4 animate-in slide-in-from-bottom-5">
      <Card className="max-w-md mx-auto p-4 bg-card border-2 border-primary/20 shadow-xl">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted transition-colors"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>

        <div className="flex gap-4 items-start pr-6">
          <div className="w-12 h-12 flex-shrink-0 rounded-xl overflow-hidden bg-muted">
            <img src={popcornMascot} alt="Popcorn Mascot" className="w-full h-full object-cover" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Install Popcorn App</h3>
            
            {isIOS ? (
              <>
                <p className="text-sm text-muted-foreground mb-3">
                  Tap <Share className="inline w-4 h-4 mx-1" /> then "Add to Home Screen"
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDismiss}
                    className="flex-1"
                  >
                    Maybe Later
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-3">
                  Install for the best streaming experience!
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDismiss}
                    className="flex-1"
                  >
                    Not Now
                  </Button>
                  {deferredPrompt && (
                    <Button
                      size="sm"
                      onClick={handleInstall}
                      className="flex-1 gap-2"
                    >
                      <Download size={16} />
                      Install
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InstallPrompt;
