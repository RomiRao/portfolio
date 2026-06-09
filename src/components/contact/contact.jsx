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
import { useFadeIn } from "../../hooks/useFadeIn";

function Contact({ id }) {
  const { ref, style } = useFadeIn({ delay: 200 });
  return (
    <section id={id} ref={ref} style={style}>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: 30,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            marginBottom: 3,
            justifySelf: "left",
          }}
        >
          <AlternateEmailIcon sx={{ marginRight: 2 }} />
          <Typography variant="h4">Contact</Typography>
        </Box>
        <Typography>Please do not hesitate on contact me!</Typography>
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <GitHubIcon />
              </ListItemIcon>
              <ListItemText primary="RomiRao" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <EmailIcon />
              </ListItemIcon>
              <ListItemText primary="rominarao96@gmail.com" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <LinkedInIcon />
              </ListItemIcon>
              <ListItemText primary="Romina Yazmín Rao" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <ImageIcon />
              </ListItemIcon>
              <ListItemText primary="Behance" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </section>
  );
}

export default Contact;
