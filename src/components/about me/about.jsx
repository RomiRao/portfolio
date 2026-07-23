import {
  Box,
  Button,
  Chip,
  IconButton,
  Typography,
  styled,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import EmailIcon from "@mui/icons-material/EmailOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { FaBehance } from "react-icons/fa";

import romina from "../../assets/Image-71-recortada.jpg";
import renga from "../../assets/avatar.png";
import curriculum from "../../assets/curriculum.pdf";

const Photo = styled("img")({
  width: "100%",
  aspectRatio: "1 / 1",
  objectFit: "contain",
  borderRadius: "16px",
});

const INSTAGRAM_URL = "https://www.instagram.com/renga.art/";
const CV_URL = curriculum;

// Amount row 2 is pushed down from row 1 on desktop — the Renga card cancels
// this (plus a bit extra) with a negative margin so it sits a little higher
// than row 1's bottom edge, while the artist-text block keeps the normal gap.
const ROW_GAP = 6;
const RENGA_LIFT = 22;

function ProfileCard({
  image,
  alt,
  name,
  buttonLabel,
  buttonIcon,
  buttonHref,
  buttonDownload,
  sx,
}) {
  return (
    <Box
      sx={[
        (theme) => ({
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "50px",
          px: "50px",
          py: "33px",
          border: "1px solid",
          borderColor: theme.palette.primary.main,
          borderRadius: "20px",
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Photo src={image} alt={alt} />
        <Typography variant="h7" fontWeight={500} textAlign="center">
          {name}
        </Typography>
      </Box>
      <Button
        variant="contained"
        color="primary"
        startIcon={buttonIcon}
        href={buttonHref}
        download={buttonDownload}
        target={buttonHref.startsWith("http") ? "_blank" : undefined}
        rel={buttonHref.startsWith("http") ? "noopener noreferrer" : undefined}
        sx={{
          borderRadius: "5px",
          textTransform: "none",
          whiteSpace: "nowrap",
        }}
      >
        {buttonLabel}
      </Button>
    </Box>
  );
}

function About({ id }) {
  return (
    <section id={id}>
      <Box
        sx={(theme) => ({
          background: `linear-gradient(180deg, ${theme.palette.fondoTarjetitas.fondo} 0%, ${theme.palette.background.default} 55%, ${theme.palette.fondoTarjetitas.fondo} 100%)`,
          borderRadius: "24px",
          p: { xs: 3, md: 5 },
        })}
      >
        <Box sx={{ maxWidth: 1000, mx: "auto" }}>
          {/* Row 1: photo card + about me. Position:relative so the icon row
              below can anchor to this row's bottom edge (the photo card's
              bottom, since it's the tallest item here). */}
          <Box
            sx={{
              position: "relative",
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "flex-start",
              gap: { xs: 5, md: 6 },
            }}
          >
            <ProfileCard
              image={romina}
              alt="Romina Yazmín Rao"
              name="Romina Yazmín Rao"
              buttonLabel="Download CV"
              buttonIcon={<DownloadIcon />}
              buttonHref={CV_URL}
              buttonDownload="Romina-Yazmin-Rao-CV.pdf"
              sx={{ flex: { xs: "1 1 100%", md: "0 0 340px" } }}
            />

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                flex: "1 1 0%",
              }}
            >
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {["UI Design", "UX Research", "UX Design"].map((label) => (
                  <Chip
                    key={label}
                    label={label}
                    color="primary"
                    sx={{ borderRadius: "8px", px: 2, height: 26 }}
                  />
                ))}
              </Box>

              <Box>
                <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                  About me
                </Typography>
                <Typography color="text.secondary">
                  I design with purpose and with intention behind every choice I
                  make, always seeking to craft experiences that connect in an
                  authentic way and leave a real lasting impression on the
                  people who live and move through them, because to me every
                  detail matters and deserves to be cared for.
                </Typography>
              </Box>
            </Box>

            {/* Straddles the boundary between row 1 and row 2 — its center
                sits exactly on the line where the photo card ends and the
                Renga card begins. */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(4, auto)",
                  md: "repeat(2, auto)",
                },
                gap: 1,
                justifyContent: "center",
                mt: { xs: 3, md: 0 },
                position: { md: "absolute" },
                bottom: { md: 90 },
                left: { md: "50%" },
                transform: { md: "translate(-50%, 50%)" },
                zIndex: 2,
              }}
            >
              <IconButton
                component="a"
                href="mailto:rominarao96@gmail.com"
                color="primary"
              >
                <EmailIcon fontSize="large" />
              </IconButton>
              <IconButton
                component="a"
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
              >
                <InstagramIcon fontSize="large" />
              </IconButton>
              <IconButton
                component="a"
                href="https://www.behance.net/rominayazmnrao"
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
              >
                <FaBehance size={35} />
              </IconButton>
              <IconButton
                component="a"
                href="https://www.linkedin.com/in/romina-rao-50a61a1ba/"
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
              >
                <LinkedInIcon fontSize="large" />
              </IconButton>
            </Box>
          </Box>

          {/* Row 2: artist text + Renga card */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "flex-start",
              gap: { xs: 5, md: 6 },
              mt: { xs: 5, md: ROW_GAP },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {["Visual art", "2d Art", "UI Art"].map((label) => (
                  <Chip
                    key={label}
                    label={label}
                    color="secondary"
                    sx={{ borderRadius: "8px", px: 2, height: 26 }}
                  />
                ))}
              </Box>

              <Box>
                <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                  Me as an artist
                </Typography>
                <Typography color="text.secondary">
                  I'm a 2D artist bringing characters and worlds to life through
                  illustration and design. From concept sketches to polished
                  final pieces, I love shaping color, line, and mood into art
                  that tells a story.
                </Typography>
              </Box>
            </Box>

            <ProfileCard
              image={renga}
              alt="Renga"
              name="Renga"
              buttonLabel="Check my art!"
              buttonIcon={<InstagramIcon />}
              buttonHref={INSTAGRAM_URL}
              sx={{
                flex: { xs: "1 1 100%", md: "0 0 340px" },
                ml: { md: "auto" },
                mt: { md: -(ROW_GAP + RENGA_LIFT) },
              }}
            />
          </Box>
        </Box>
      </Box>
    </section>
  );
}

export default About;
