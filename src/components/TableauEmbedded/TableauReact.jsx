'use client';
import { useEffect } from 'react';

export function TableauReact({ embedUrl, isMaximized, pageNavigation, className }) {
  useEffect(() => {
    const script = document?.createElement('script');
    script.type = 'module';
    script.src = 'https://us-east-1.online.tableau.com/javascripts/api/tableau.embedding.3.latest.min.js';
    script.async = true;

    document?.body.appendChild(script);

    return () => {
      document?.body.removeChild(script);
    };
  }, [isMaximized]);

  return (
    <div className={className}>
      <tableau-viz
        id="tableau-viz"
        src={embedUrl}
        toolbar={pageNavigation ? "bottom" : "hidden"}
      />
    </div>
  );
}
