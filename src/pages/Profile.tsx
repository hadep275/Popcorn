import { User, Key, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BottomNav from "@/components/BottomNav";
import { useApiKeys } from "@/contexts/ApiKeysContext";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { apiKeys, setApiKeys, userProfile, setUserProfile, hasApiKeys } = useApiKeys();
  const { toast } = useToast();
  
  const [localApiKeys, setLocalApiKeys] = useState(apiKeys);
  const [localProfile, setLocalProfile] = useState(userProfile);

  const handleSaveApiKeys = () => {
    setApiKeys(localApiKeys);
    toast({
      title: "API Keys Saved!",
      description: "Your API keys have been saved locally on your device.",
    });
  };

  const handleSaveProfile = () => {
    setUserProfile(localProfile);
    toast({
      title: "Profile Updated!",
      description: "Your profile has been saved locally on your device.",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-8 text-foreground">Profile & Settings</h1>

        {/* User Info Card */}
        <div className="mb-8 p-6 bg-card rounded-2xl shadow-card border border-border">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gradient-hero rounded-full flex items-center justify-center">
              <User size={40} className="text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-card-foreground">
                {userProfile.name || "Your Name"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {userProfile.email || "your.email@example.com"}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-card-foreground">Name</Label>
              <Input
                id="name"
                value={localProfile.name}
                onChange={(e) => setLocalProfile({ ...localProfile, name: e.target.value })}
                placeholder="Enter your name"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-card-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                value={localProfile.email}
                onChange={(e) => setLocalProfile({ ...localProfile, email: e.target.value })}
                placeholder="Enter your email"
                className="mt-1.5"
              />
            </div>
            <Button onClick={handleSaveProfile} className="w-full gap-2">
              <Save size={18} />
              Save Profile
            </Button>
          </div>
        </div>

        {/* API Keys Section */}
        <div className="mb-8 p-6 bg-card rounded-2xl shadow-card border border-border">
          <div className="flex items-center gap-3 mb-4">
            <Key size={24} className="text-primary" />
            <h2 className="text-xl font-semibold text-card-foreground">API Keys</h2>
          </div>
          
          {!hasApiKeys && (
            <p className="text-sm text-muted-foreground mb-4">
              Please enter your API keys to use the app. All data is stored locally on your device.
            </p>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="tmdb" className="text-card-foreground">TMDB API Key</Label>
              <Input
                id="tmdb"
                type="password"
                value={localApiKeys.tmdb}
                onChange={(e) => setLocalApiKeys({ ...localApiKeys, tmdb: e.target.value })}
                placeholder="Enter your TMDB API key"
                className="mt-1.5 font-mono text-xs"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Get your key from{" "}
                <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  TMDB
                </a>
              </p>
            </div>

            <div>
              <Label htmlFor="youtube" className="text-card-foreground">YouTube API Key</Label>
              <Input
                id="youtube"
                type="password"
                value={localApiKeys.youtube}
                onChange={(e) => setLocalApiKeys({ ...localApiKeys, youtube: e.target.value })}
                placeholder="Enter your YouTube API key"
                className="mt-1.5 font-mono text-xs"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Get your key from{" "}
                <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Google Cloud Console
                </a>
              </p>
            </div>

            <Button onClick={handleSaveApiKeys} className="w-full gap-2">
              <Save size={18} />
              Save API Keys
            </Button>
          </div>
        </div>

        {/* App Info */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Version 1.0.0</p>
          <p className="mt-1">All data stored locally on your device 💖</p>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Profile;
