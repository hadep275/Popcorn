import { User, Settings, HelpCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";

const Profile = () => {
  const menuItems = [
    { icon: User, label: "Account", action: () => {} },
    { icon: Settings, label: "Settings", action: () => {} },
    { icon: HelpCircle, label: "Help & Support", action: () => {} },
    { icon: LogOut, label: "Sign Out", action: () => {} },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-8">Profile</h1>

        {/* User Info */}
        <div className="flex items-center gap-4 mb-8 p-4 bg-card rounded-lg">
          <div className="w-20 h-20 bg-gradient-hero rounded-full flex items-center justify-center">
            <User size={40} />
          </div>
          <div>
            <h2 className="text-xl font-semibold">John Doe</h2>
            <p className="text-sm text-muted-foreground">john.doe@example.com</p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map(({ icon: Icon, label, action }) => (
            <Button
              key={label}
              variant="ghost"
              className="w-full justify-start gap-3 h-14"
              onClick={action}
            >
              <Icon size={24} />
              <span className="text-base">{label}</span>
            </Button>
          ))}
        </div>

        {/* App Info */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Version 1.0.0</p>
          <p className="mt-1">© 2025 Streaming App</p>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Profile;
