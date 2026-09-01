import React, { useEffect, useRef } from 'react';
import { Config } from '../../config/appConfig';

/**
 * Cloudflare Turnstile Bot Protection Widget.
 * Automatically verifies genuine human interaction before submission.
 */
export const CloudflareTurnstile = ({ onVerify, onError, onExpire }) => {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);

  useEffect(() => {
    // Load Cloudflare Turnstile script if not already present
    const scriptId = 'cf-turnstile-script';
    let script = document.getElementById(scriptId);

    const renderWidget = () => {
      if (window.turnstile && containerRef.current && !widgetIdRef.current) {
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: Config.TURNSTILE_SITE_KEY,
          theme: 'light',
          callback: (token) => {
            if (onVerify) onVerify(token);
          },
          'error-callback': (err) => {
            if (onError) onError(err);
          },
          'expired-callback': () => {
            if (onExpire) onExpire();
          },
        });
      }
    };

    if (!script) {
      script = document.createElement('script');
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
      if (window.turnstile && widgetIdRef.current) {
        try {
          window.turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        } catch (e) {}
      }
    };
  }, [onVerify, onError, onExpire]);

  return (
    <div className="flex flex-col items-center justify-center my-2 p-2 bg-slate-50 border border-slate-200 rounded-xl">
      <div className="text-[11px] text-slate-500 font-semibold mb-1">
        🔒 Bảo vệ bởi Cloudflare Turnstile
      </div>
      <div ref={containerRef} className="cf-turnstile" />
    </div>
  );
};

export default CloudflareTurnstile;
