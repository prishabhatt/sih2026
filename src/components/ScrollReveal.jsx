import React, { useRef, useEffect, useState } from 'react';

export function ScrollReveal({ 
  children, 
  direction = 'up', 
  delay = 0, 
  threshold = 0.12, 
  once = true,
  className = '' 
}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(node);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, once]);

  const dirClass = {
    up: 'sr-fade-up',
    down: 'sr-fade-up',
    left: 'sr-fade-left',
    right: 'sr-fade-right',
    scale: 'sr-scale',
  }[direction] || 'sr-fade-up';

  const delayClass = delay > 0 ? `sr-delay-${Math.min(delay, 8)}` : '';

  return (
    <div
      ref={ref}
      className={`min-w-0 ${dirClass} ${delayClass} ${isVisible ? 'sr-visible' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

export default ScrollReveal;
