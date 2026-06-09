import { Box, Typography } from "@mui/material";
import { useState } from "react";

function Header() {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        height: "100vh",
        alignItems: "center",
      }}
    >
      <Box my={5}>
        <Typography variant="h4" color="secondary">
          Hi! I'm
        </Typography>
        <Typography variant="h3" color="primary">
          Romina Rao
        </Typography>
        <Typography variant="h5" color="inherit">
          UX Designer, Artist and Developer.
        </Typography>
      </Box>
    </Box>
  );
}

export default Header;
