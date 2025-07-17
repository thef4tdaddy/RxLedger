import { useEffect, useRef } from 'react';

export default function Turnstile({ onSuccess }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const render = () => {
      if (window.turnstile && containerRef.current) {
        window.turnstile.render(containerRef.current, {
          sitekey: import.meta.env.VITE_TURNSTILE_SITE_KEY,
          callback: onSuccess,
        });
      }
    };

    if (!window.turnstile) {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.onload = render;
      document.body.appendChild(script);
    } else {
      render();
    }
  }, [onSuccess]);

  return <div ref={containerRef} className="my-2" />;
}
