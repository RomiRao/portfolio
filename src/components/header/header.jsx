import { Box, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

import avatar from "../../assets/avatar.png";

// Registramos el plugin
gsap.registerPlugin(SplitText, ScrambleTextPlugin);

function Header({ id }) {
  const textRef = useRef(null);

  useEffect(() => {
    // 1. Animamos "Hi! I'm" normalmente
    const splitFirst = new SplitText(
      textRef.current.querySelector(".first-line"),
      { type: "chars" },
    );
    gsap.from(splitFirst.chars, {
      opacity: 0,
      y: 20,
      stagger: 0.05,
      duration: 1,
      ease: "power2.out",
    });

    // 2. Animamos la tercera línea letra por letra, con las palabras juntas
    // (espaciado normal, sin separarlas con flexbox).
    const splitThird = new SplitText(
      textRef.current.querySelector(".third-line"),
      { type: "chars" },
    );

    gsap.from(splitThird.chars, {
      opacity: 0,
      y: 20,
      stagger: 0.03, // Un stagger ligeramente más rápido al ser más caracteres
      duration: 1,
      ease: "power2.out",
    });

    // 3. Scramble text para el nombre
    const scramble = textRef.current.querySelectorAll(".scramble-text");
    gsap.to(scramble, {
      duration: 2,
      scrambleText: "Romina Rao",
    });
  }, []);

  return (
    <Box
      id={id}
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        height: "100vh",
        alignItems: "center",
        flexDirection: { xs: "column-reverse", md: "row" },
        gap: { xs: 0, md: 30 },
      }}
    >
      {/* Contenedor inline-flex para que el ancho total se adapte al elemento más ancho (el de 200px) */}
      <Box
        my={5}
        ref={textRef}
        sx={{
          display: "inline-flex",
          flexDirection: "column",
          width: "fit-content", // Obliga a que el contenedor mida exactamente lo que mida "Romina Rao"
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: 28, sm: 42, md: 55, lg: 70 },
            lineHeight: 0.85, // Acerca el texto hacia abajo
            marginBottom: "0.1em", // Ajuste fino manual
            ml: "10px",
          }}
          color="secondary"
          className="first-line"
        >
          Hi! I'm
        </Typography>

        <Typography
          sx={{
            fontSize: { xs: 56, sm: 92, md: 140, lg: 200 },
            lineHeight: 1, // Reduce el interlineado drásticamente para pegarlo a las otras líneas
            fontWeight: "bold",
            letterSpacing: "-0.02em",
          }}
          color="primary"
          className="scramble-text"
        >
          Romina Rao
        </Typography>

        <Typography
          sx={{
            fontSize: { xs: 16, sm: 22, md: 30, lg: 40 },
            lineHeight: 1,
            marginTop: "0.2em", // Ajuste fino manual para pegarlo al nombre

            textAlign: "center",
            width: "100%",
          }}
          color="inherit"
          className="third-line"
        >
          UX/UI Designer, Artist and Developer.
        </Typography>
      </Box>
    </Box>
  );
}

export default Header;
