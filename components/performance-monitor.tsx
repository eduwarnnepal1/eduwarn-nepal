'use client';

import { useEffect } from 'react';

// Declare gtag variable or import it if it's from a module
declare var gtag: Function;

export function PerformanceMonitor() {
  useEffect(() => {
    // Monitor Core Web Vitals
    if ('web-vital' in window) {
      // LCP (Largest Contentful Paint)
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            console.log('[Performance] LCP:', entry.startTime);
          }
        }
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }

    // Navigation Timing
    if (window.performance && window.performance.timing) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = window.performance.timing;
          const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
          const connectTime = perfData.responseEnd - perfData.requestStart;
          const renderTime = perfData.domComplete - perfData.domLoading;
          const domReadyTime = perfData.domContentLoadedEventEnd - perfData.navigationStart;

          console.log('[Performance] Page Load Time:', pageLoadTime, 'ms');
          console.log('[Performance] Connect Time:', connectTime, 'ms');
          console.log('[Performance] Render Time:', renderTime, 'ms');
          console.log('[Performance] DOM Ready Time:', domReadyTime, 'ms');

          // Send to analytics if needed
          if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
              page_load_time: pageLoadTime,
              connect_time: connectTime,
              render_time: renderTime,
            });
          }
        }, 0);
      });
    }

    // Monitor First Input Delay
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log('[Performance] FID:', entry.processingDuration);
        }
      });
      observer.observe({ entryTypes: ['first-input'] });
    }
  }, []);

  return null;
}
