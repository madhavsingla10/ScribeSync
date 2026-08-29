import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  themeVariables: {
    darkMode: true,
    background: '#181715',
    primaryColor: '#2b2926',
    primaryTextColor: '#FAF8F5',
    primaryBorderColor: '#44403c',
    lineColor: '#a8a29e',
    secondaryColor: '#1c1917',
    tertiaryColor: '#292524',
    fontFamily: 'JetBrains Mono, monospace'
  }
});

interface MermaidProps {
  chart: string;
}

export function Mermaid({ chart }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const renderChart = async () => {
      if (!containerRef.current || !chart) return;
      setError(null);
      try {
        const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
        const { svg } = await mermaid.render(id, chart);
        if (isMounted && containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (err: any) {
        console.error("Mermaid parsing error:", err);
        if (isMounted) {
          setError(err.message || 'Syntax error in generated diagram');
        }
      }
    };

    renderChart();
    return () => {
      isMounted = false;
    };
  }, [chart]);

  if (error) {
    return (
      <div className="text-amber-400 p-4 bg-stone-900/80 rounded-xl border border-stone-800 text-xs font-mono">
        <p className="font-semibold text-stone-200 mb-1">Diagram Render Warning</p>
        <p className="text-stone-400 mb-3">{error}</p>
        <pre className="p-3 bg-stone-950 rounded-lg text-stone-300 overflow-x-auto text-[11px]">
          {chart}
        </pre>
      </div>
    );
  }

  return (
    <div 
      className="flex justify-center items-center p-4 w-full overflow-auto text-stone-200 [&_svg]:max-w-full [&_svg]:h-auto" 
      ref={containerRef} 
    />
  );
}
