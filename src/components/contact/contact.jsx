import { useState } from "react";
import GitHubIcon from "@mui/icons-material/GitHub";
import EmailIcon from "@mui/icons-material/Email";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import ImageIcon from "@mui/icons-material/Image";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

function Contact({ id }) {
  // Estilos compartidos para los botones para mantener el código DRY
  const buttonSx = {
    borderRadius: 2,
    "&:hover": {
      backgroundColor: "primary.main",
      color: "primary.contrastText",
      "& .MuiListItemIcon-root": {
        color: "primary.contrastText",
      },
    },
  };

  // Estilo compartido para reducir el espacio del icono al texto
  const iconSx = {
    minWidth: "38px",
  };

  return (
    <section id={id}>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",

          gap: 5,
          backgroundColor: "fondoTarjetitas.fondo",
          py: 5,
          border: "1px solid",
          borderColor: "fondoTarjetitas.borde",
          boxShadow: `0px 2px 14px 10px fondoTarjetitas.sombra`,
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px",
        }}
      >
        <Typography variant="h5">
          Please do not hesitate on contact me!
        </Typography>

        <List
          sx={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {/* BOTÓN DE EMAIL */}
          <ListItem disablePadding sx={{ width: "auto" }}>
            <ListItemButton
              component="a"
              href="mailto:rominarao96@gmail.com" // Abre directamente el gestor de correo del usuario
              sx={buttonSx}
            >
              <ListItemIcon sx={iconSx}>
                <EmailIcon />
              </ListItemIcon>
              <ListItemText primary="rominarao96@gmail.com" />
            </ListItemButton>
          </ListItem>

          {/* BOTÓN DE BEHANCE */}
          <ListItem disablePadding sx={{ width: "auto" }}>
            <ListItemButton
              component="a"
              href="https://www.behance.net/rominayazmnrao" // <-- REEMPLAZA ESTO
              target="_blank"
              rel="noopener noreferrer"
              sx={buttonSx}
            >
              <ListItemIcon sx={iconSx}>
                <ImageIcon />
              </ListItemIcon>
              <ListItemText primary="Behance" />
            </ListItemButton>
          </ListItem>

          {/* BOTÓN DE LINKEDIN */}
          <ListItem disablePadding sx={{ width: "auto" }}>
            <ListItemButton
              component="a"
              href="https://www.linkedin.com/in/romina-rao-50a61a1ba/"
              target="_blank"
              rel="noopener noreferrer"
              sx={buttonSx}
            >
              <ListItemIcon sx={iconSx}>
                <LinkedInIcon />
              </ListItemIcon>
              <ListItemText
                primary="Romina Yazmín Rao"
                primaryTypographyProps={{ whiteSpace: "nowrap" }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </section>
  );
}

export default Contact;
