import { User, Key, Save, Eye, EyeOff, Download, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BottomNav from "@/components/BottomNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useApiKeys } from "@/contexts/ApiKeysContext";
import { countries } from "@/lib/countries";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const Profile = () => {
  const { apiKeys, setApiKeys, userProfile, setUserProfile, hasApiKeys } = useApiKeys();
  const { toast } = useToast();
  
  const [localApiKeys, setLocalApiKeys] = useState(apiKeys);
  const [localProfile, setLocalProfile] = useState(userProfile);
  const [showTmdbKey, setShowTmdbKey] = useState(false);
  const [showYoutubeKey, setShowYoutubeKey] = useState(false);

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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-foreground">Profile & Settings</h1>
          <ThemeToggle />
        </div>

        {/* User Info Card */}
        <div className="mb-8 p-6 bg-card rounded-2xl shadow-card border border-border">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
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
            <div>
              <Label htmlFor="region" className="text-card-foreground flex items-center gap-2">
                <Globe size={16} />
                Region (for streaming availability)
              </Label>
              <Select
                value={localProfile.region}
                onValueChange={(value) => setLocalProfile({ ...localProfile, region: value })}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select your region" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-popover">
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      <span className="flex items-center gap-2">
                        <span>{country.flag}</span>
                        <span>{country.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Used to show which streaming services have content in your region
              </p>
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
              Please enter your TMDB API key to use the app. YouTube key is optional for trailers. All data is stored locally on your device.
            </p>
          )}

          <div className="space-y-4">
          <div>
              <Label htmlFor="tmdb" className="text-card-foreground">TMDB API Key</Label>
              <div className="relative mt-1.5">
                <Input
                  id="tmdb"
                  type={showTmdbKey ? "text" : "password"}
                  value={localApiKeys.tmdb}
                  onChange={(e) => setLocalApiKeys({ ...localApiKeys, tmdb: e.target.value })}
                  placeholder="Enter your TMDB API key"
                  className="font-mono text-xs pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowTmdbKey(!showTmdbKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showTmdbKey ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Get your key from{" "}
                <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  TMDB
                </a>
              </p>
            </div>

            <div>
              <Label htmlFor="youtube" className="text-card-foreground">YouTube API Key (Optional)</Label>
              <div className="relative mt-1.5">
                <Input
                  id="youtube"
                  type={showYoutubeKey ? "text" : "password"}
                  value={localApiKeys.youtube}
                  onChange={(e) => setLocalApiKeys({ ...localApiKeys, youtube: e.target.value })}
                  placeholder="Enter your YouTube API key"
                  className="font-mono text-xs pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowYoutubeKey(!showYoutubeKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showYoutubeKey ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
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
        <div className="mb-8 p-6 bg-card rounded-2xl shadow-card border border-border">
          <Link to="/install">
            <Button variant="outline" className="w-full gap-2">
              <Download size={18} />
              Install App
            </Button>
          </Link>
        </div>

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
