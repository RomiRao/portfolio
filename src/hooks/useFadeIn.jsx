import { useEffect, useRef, useState } from "react";

export function useFadeIn({ threshold = 0.15, delay = 0 } = {}) {
  const ref = useRef(null);

  const getInitialVisibility = () => {
    if (!ref.current) return false;
    const { top } = ref.current.getBoundingClientRect();
    return top < window.innerHeight; // visible si ya está en pantalla o por arriba
  };

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Ajustás el estado inicial según posición real
    const { top } = el.getBoundingClientRect();
    if (top < window.innerHeight) setVisible(true);

    let prevY = window.scrollY;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const currentY = window.scrollY;
        const scrollingUp = currentY < prevY;
        prevY = currentY;

        if (entry.isIntersecting) {
          setVisible(true);
        } else if (scrollingUp && entry.boundingClientRect.top > 0) {
          setVisible(false);
        }
        // Sale por arriba → no hacés nada, queda visible
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const style = {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(32px)",
    transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
  };

  return { ref, style };
}
