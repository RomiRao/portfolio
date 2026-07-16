import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useScrollReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: options.y ?? 40 },
        {
          autoAlpha: 1,
          y: 0,
          duration: options.duration ?? 0.8,
          ease: options.ease ?? "power2.out",
          scrollTrigger: {
            trigger: el,
            start: options.start ?? "top 80%",
            toggleActions: options.toggleActions ?? "play reverse play reverse",
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return ref;
}
