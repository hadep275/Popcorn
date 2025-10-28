import React, { useEffect, useState } from "react";

interface PopcornSpillProps {
  active: boolean;
}

const kernels = new Array(14).fill(0);

const PopcornSpill: React.FC<PopcornSpillProps> = ({ active }) => {
  const [show, setShow] = useState(active);

  useEffect(() => {
    if (active) {
      setShow(true);
      const t = setTimeout(() => setShow(false), 1800);
      return () => clearTimeout(t);
    }
  }, [active]);

  if (!show) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      {kernels.map((_, i) => {
        const left = Math.random() * 90 + 5; // 5% - 95%
        const delay = i * 60; // staggered
        const size = 12 + Math.round(Math.random() * 8);
        const rotate = Math.random() * 60 - 30;
        return (
          <span
            key={i}
            className="absolute select-none"
            style={{
              left: `${left}%`,
              top: `-10%`,
              fontSize: `${size}px`,
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
              transform: `rotate(${rotate}deg)`,
              animation: `spill-fall 900ms ease-in forwards`,
              animationDelay: `${delay}ms`,
            }}
          >
            🍿
          </span>
        );
      })}
      <style>{`
        @keyframes spill-fall {
          0% { transform: translateY(-40px) scale(0.9) rotate(0deg); opacity: 0; }
          60% { opacity: 1; }
          100% { transform: translateY(90%) scale(1) rotate(8deg); opacity: 0.9; }
        }
      `}</style>
    </div>
  );
};

export default PopcornSpill;
