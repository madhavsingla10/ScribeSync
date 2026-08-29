import React, { useState, useEffect } from 'react';

export function BackgroundGrid() {
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      if (!isHovering) setIsHovering(true);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isHovering]);

  return (
    <>
      {/* Base Background Dot Grid */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-40"
        style={{
          backgroundImage: 'radial-gradient(circle, #33312e 1.25px, transparent 1.25px)',
          backgroundSize: '28px 28px'
        }}
      />

      {/* Interactive Cursor-Following Dot Pattern */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-500"
        style={{
          opacity: isHovering ? 1 : 0.6,
          backgroundImage: 'radial-gradient(circle, #857f78 1.6px, transparent 1.6px)',
          backgroundSize: '28px 28px',
          maskImage: isHovering 
            ? `radial-gradient(550px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 45%, transparent 100%)`
            : 'radial-gradient(550px circle at 50% 35%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 45%, transparent 100%)',
          WebkitMaskImage: isHovering 
            ? `radial-gradient(550px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 45%, transparent 100%)`
            : 'radial-gradient(550px circle at 50% 35%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 45%, transparent 100%)',
        }}
      />

      {/* Interactive Subtle Cursor Ambient Glow */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-300"
        style={{
          opacity: isHovering ? 1 : 0,
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(214, 211, 209, 0.04) 0%, transparent 100%)`
        }}
      />

      {/* Ambient Radial Vignette */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, transparent 35%, #121110 90%)'
        }}
      />
    </>
  );
}
