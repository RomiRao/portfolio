import { useMemo } from "react";
import { Box } from "@mui/material";
import star from "../../assets/star.svg";

const STAR_COUNT = 55;

function randomStars(count) {
  return Array.from({ length: count }, () => ({
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: 14 + Math.random() * 32,
    duration: 1 + Math.random() * 2,
    delay: Math.random() * 5,
  }));
}

// Light-mode treatment is still undecided — this is a placeholder (dimmed,
// tinted dark so the same sparkle reads against a light sky) until there's a
// real design for it.
function StarField({ darkMode }) {
  const stars = useMemo(() => randomStars(STAR_COUNT), []);

  return (
    <Box sx={{ position: "absolute", inset: 0 }}>
      {stars.map((s, i) => (
        <Box
          key={i}
          component="img"
          src={star}
          alt=""
          sx={{
            position: "absolute",
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            opacity: darkMode ? 1 : 0.5,
            filter: darkMode ? "none" : "invert(1) brightness(0.7)",
            animation: `star-twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </Box>
  );
}

export default StarField;
