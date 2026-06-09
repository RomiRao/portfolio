import { Box, Typography } from "@mui/material";
import HandymanIcon from "@mui/icons-material/Handyman";
import { useState } from "react";
import { useFadeIn } from "../../hooks/useFadeIn";

function Skills({ id }) {
  const { ref, style } = useFadeIn({ delay: 200 });
  return (
    <section id={id} ref={ref} style={style}>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          marginBottom: 30,
          alignItems: "center",
        }}
      >
        <Box sx={{ width: "50%" }}>
          <Box sx={{ display: "flex", alignItems: "center", marginBottom: 5 }}>
            <HandymanIcon sx={{ marginRight: 2 }} />
            <Typography variant="h4">Skills</Typography>
          </Box>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",

              alignItems: "center",
            }}
          >
            <img src="https://skillicons.dev/icons?i=git,css,typescript,js,materialui,react,firebase,photoshop,premiere,figma,azure,tailwind,github,angular&perline=7" />
          </Box>
        </Box>
      </Box>
    </section>
  );
}

export default Skills;
