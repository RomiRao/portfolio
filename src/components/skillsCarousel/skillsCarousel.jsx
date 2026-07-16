import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Box } from "@mui/material";
import { alpha } from "@mui/material/styles";

import html from "../../assets/svg-icons-general/html.svg";
import css from "../../assets/svg-icons-general/css.svg";
import typescript from "../../assets/svg-icons-general/typescript.svg";
import javascript from "../../assets/svg-icons-general/javascript.svg";
import materialui from "../../assets/svg-icons-general/materialui.svg";
import react from "../../assets/svg-icons-general/reac.svg";
import firebase from "../../assets/svg-icons-general/firebase.svg";
import photoshop from "../../assets/svg-icons-general/photoshop.svg";
import premiere from "../../assets/svg-icons-general/premiere.svg";
import figma from "../../assets/svg-icons-general/figma.svg";
import angular from "../../assets/svg-icons-general/angular.svg";
import tailwind from "../../assets/svg-icons-general/tailwind.svg";
import github from "../../assets/svg-icons-general/github.svg";
import claude from "../../assets/svg-icons-general/claude.svg";

const icons = [
  html,
  css,
  typescript,
  javascript,
  materialui,
  react,
  firebase,
  photoshop,
  premiere,
  figma,
  angular,
  tailwind,
  github,
  claude,
];

export default function SkillsCarousel({ speed = 40 }) {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const ctx = gsap.context(() => {
      // Calculamos la mitad del ancho total (el ancho de un set único de iconos)
      const totalWidth = track.scrollWidth / 2;

      // Animamos desde la posición desplazada (-totalWidth) hacia 0
      // Esto genera el movimiento visual hacia la derecha
      const tween = gsap.fromTo(
        track,
        { x: -totalWidth }, // Estado inicial
        {
          x: 0, // Estado final
          duration: speed,
          ease: "none",
          repeat: -1, // -1 hace que se repita infinitamente
        },
      );

      return () => tween.kill();
    }, track);

    return () => ctx.revert();
  }, [speed]);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1200,
        overflow: "hidden",
        mx: "auto",
        py: 4,

        WebkitMaskImage:
          "linear-gradient(to right, transparent, #000 15%, #000 85%, transparent)",
        maskImage:
          "linear-gradient(to right, transparent, #000 15%, #000 85%, transparent)",
      }}
    >
      <Box
        ref={trackRef}
        sx={{ display: "flex", gap: 6, width: "max-content" }}
      >
        {[...icons, ...icons].map((icon, i) => (
          <Box
            key={i}
            sx={(theme) => ({
              width: 80,
              height: 80,
              alignSelf: "flex-start",
              backgroundColor: theme.palette.fondoTarjetitas.fondo,
              p: 2,
              borderRadius: 7,
              display: "flex",
              border: "1px solid",
              borderColor: theme.palette.fondoTarjetitas.borde,
              boxShadow: `0px 2px 8px 10px ${alpha(theme.palette.fondoTarjetitas.sombra, 0.05)}`,
              transition: " transform 0.3s",
              "&:hover": {
                opacity: 1,
                transform: "scale(1.5)",
              },
            })}
          >
            <Box
              component="img"
              src={icon}
              alt=""
              sx={{
                width: "100%",
                flexShrink: 0,
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
