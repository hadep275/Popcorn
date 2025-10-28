import { useState, useRef, useEffect } from "react";

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

const PullToRefresh = ({ onRefresh, children }: PullToRefreshProps) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [startY, setStartY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const threshold = 80; // Distance to trigger refresh

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        setStartY(e.touches[0].clientY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isRefreshing || startY === 0) return;
      
      const currentY = e.touches[0].clientY;
      const distance = currentY - startY;
      
      if (distance > 0 && window.scrollY === 0) {
        e.preventDefault();
        setPullDistance(Math.min(distance, threshold * 1.5));
      }
    };

    const handleTouchEnd = async () => {
      if (pullDistance > threshold && !isRefreshing) {
        setIsRefreshing(true);
        try {
          await onRefresh();
        } finally {
          setIsRefreshing(false);
          setPullDistance(0);
          setStartY(0);
        }
      } else {
        setPullDistance(0);
        setStartY(0);
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pullDistance, isRefreshing, startY, threshold, onRefresh]);

  const pullPercentage = Math.min((pullDistance / threshold) * 100, 100);
  const showIndicator = pullDistance > 10;

  return (
    <div ref={containerRef} className="relative">
      {/* Pull Indicator */}
      {showIndicator && (
        <div 
          className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center justify-center transition-transform"
          style={{ 
            transform: `translateY(${Math.min(pullDistance - 20, 60)}px)`,
            opacity: pullDistance / threshold
          }}
        >
          <div className={`text-center ${isRefreshing ? 'pull-indicator' : ''}`}>
            <img 
              src="/pwa-192x192.png" 
              alt="Pull to refresh" 
              className="w-12 h-12 mb-2"
              style={{ 
                transform: `rotate(${pullPercentage * 3.6}deg)`,
                transition: isRefreshing ? 'none' : 'transform 0.2s'
              }}
            />
            <p className="text-xs text-muted-foreground font-medium">
              {isRefreshing 
                ? 'Refreshing...' 
                : pullDistance > threshold 
                  ? 'Release to refresh' 
                  : 'Pull to refresh'
              }
            </p>
          </div>
        </div>
      )}
      
      {children}
    </div>
  );
};

export default PullToRefresh;
