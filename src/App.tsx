import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ApiKeysProvider } from "./contexts/ApiKeysContext";
import { WatchlistProvider } from "./contexts/WatchlistContext";
import Home from "./pages/Home";
import Details from "./pages/Details";
import Search from "./pages/Search";
import MyList from "./pages/MyList";
import Profile from "./pages/Profile";
import Install from "./pages/Install";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ApiKeysProvider>
      <WatchlistProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter basename={import.meta.env.BASE_URL}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/details/:mediaType/:id" element={<Details />} />
              <Route path="/search" element={<Search />} />
              <Route path="/my-list" element={<MyList />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/install" element={<Install />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </WatchlistProvider>
    </ApiKeysProvider>
  </QueryClientProvider>
);

export default App;
