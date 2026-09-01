import React, { useEffect, useRef } from 'react';
import { Config } from '../../config/appConfig';

/**
 * Cloudflare Turnstile Bot Protection Widget.
 * Uses persistent callback refs to prevent React re-render loops.
 */
export const CloudflareTurnstile = ({ onVerify, onError, onExpire }) => {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const callbacksRef = useRef({ onVerify, onError, onExpire });

  useEffect(() => {
    callbacksRef.current = { onVerify, onError, onExpire };
  });

  useEffect(() => {
    let isMounted = true;
    const scriptId = 'cf-turnstile-script';

    const renderWidget = () => {
      if (!isMounted || !window.turnstile || !containerRef.current || widgetIdRef.current) return;
      try {
        containerRef.current.innerHTML = '';
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: Config.TURNSTILE_SITE_KEY,
          theme: 'light',
          size: 'normal',
          callback: (token) => {
            if (callbacksRef.current.onVerify) callbacksRef.current.onVerify(token);
          },
          'error-callback': (err) => {
            if (callbacksRef.current.onError) callbacksRef.current.onError(err);
          },
          'expired-callback': () => {
            if (callbacksRef.current.onExpire) callbacksRef.current.onExpire();
          },
        });
      } catch (e) {
        console.warn('Turnstile render warning:', e);
      }
    };

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.onload = renderWidget;
      document.head.appendChild(script);
    } else if (window.turnstile) {
      renderWidget();
    }

    return () => {
      isMounted = false;
      if (window.turnstile && widgetIdRef.current) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (e) {}
        widgetIdRef.current = null;
      }
    };
  }, []); // Run once on mount

  return (
    <div className="flex flex-col items-center justify-center my-2 p-2 bg-slate-50 border border-slate-200 rounded-xl">
      <div className="text-[11px] text-slate-500 font-semibold mb-1">
        🔒 Bảo vệ bởi Cloudflare Turnstile
      </div>
      <div ref={containerRef} className="min-h-[65px] flex items-center justify-center" />
    </div>
  );
};

export default CloudflareTurnstile;
