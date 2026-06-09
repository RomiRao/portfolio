import { useState } from "react";
import { useFadeIn } from "../../hooks/useFadeIn";
import {
  Box,
  Typography,
  Chip,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import nanzasLogo from "../../assets/nanzas-logo.png";

// ─── Mock data ────────────────────────────────────────────────────────────────
const projects = [
  // {
  //   id: 1,
  //   variant: "vertical", // image on top
  //   category: "Case study",
  //   role: "Product design",
  //   year: "2024",
  //   title: "Rediseño de onboarding para app financiera",
  //   description:
  //     "Investigación de usuarios, mapeo de pain points y prototipado de alta fidelidad para reducir la tasa de abandono en el flujo de registro en un 38%.",
  //   tools: ["Figma", "Maze", "Miro"],
  //   link: "#",
  //   image: null, // replace with your image URL
  // },
  {
    id: 2,
    variant: "horizontal", // image on left
    category: "Case study",
    role: "UX Design / FrontEnd",
    year: "2026",
    title: 'Finances App "Nanzas"',
    description:
      "Designed and developed a personal finance app from scratch mobile and web, covering the full product cycle from UX research and wireframing to a fully responsive React interface.",
    tools: ["Figma", "Design system", "React"],
    link: "#",
    image: nanzasLogo,
  },
];

// ─── Shared palette ───────────────────────────────────────────────────────────
const purple = {
  light: "#EEEDFE",
  mid: "#7f77dd",
  strong: "#534AB7",
  dark: "#3C3489",
};

// ─── Mockup placeholder (replaces a real screenshot) ─────────────────────────
function MockupPlaceholder() {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        bgcolor: "#12122a",
        borderRadius: "10px",
        border: "1px solid rgba(255,255,255,0.08)",
        p: 1,
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        boxSizing: "border-box",
      }}
    >
      {/* topbar */}
      <Box
        sx={{
          height: 20,
          bgcolor: "rgba(255,255,255,0.05)",
          borderRadius: "5px",
          display: "flex",
          alignItems: "center",
          px: 1,
          gap: "5px",
          flexShrink: 0,
        }}
      >
        {[
          purple.strong,
          "rgba(255,255,255,0.15)",
          "rgba(255,255,255,0.08)",
        ].map((c, i) => (
          <Box
            key={i}
            sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: c }}
          />
        ))}
      </Box>

      {/* body */}
      <Box sx={{ flex: 1, display: "flex", gap: "6px", minHeight: 0 }}>
        {/* sidebar */}
        <Box
          sx={{
            width: "30%",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            pt: "2px",
          }}
        >
          {[
            { w: "75%", bg: purple.mid },
            { w: "100%", bg: "rgba(255,255,255,0.1)" },
            { w: "55%", bg: "rgba(255,255,255,0.1)" },
            { w: "100%", bg: "rgba(255,255,255,0.1)" },
            { w: "55%", bg: "rgba(255,255,255,0.1)" },
          ].map((s, i) => (
            <Box
              key={i}
              sx={{ height: 7, width: s.w, borderRadius: "4px", bgcolor: s.bg }}
            />
          ))}
        </Box>

        {/* main blocks */}
        <Box
          sx={{ flex: 1, display: "flex", flexDirection: "column", gap: "5px" }}
        >
          <Box
            sx={{
              flex: 0.7,
              bgcolor: "rgba(127,119,221,0.25)",
              border: "1px solid rgba(127,119,221,0.4)",
              borderRadius: "5px",
            }}
          />
          <Box
            sx={{
              flex: 1,
              bgcolor: "rgba(255,255,255,0.05)",
              borderRadius: "5px",
            }}
          />
          <Box
            sx={{
              flex: 1,
              bgcolor: "rgba(255,255,255,0.05)",
              borderRadius: "5px",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

// ─── Card: image on TOP (vertical) ───────────────────────────────────────────
function ProjectCardVertical({ project }) {
  return (
    <Card
      elevation={0}
      sx={{
        width: 400,
        borderRadius: "20px",
        border: "0.5px solid",
        borderColor: "divider",
        overflow: "hidden",
        transition: "transform 0.2s ease, border-color 0.2s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          borderColor: "action.hover",
        },
      }}
    >
      {/* Image area */}
      <Box
        sx={{
          bgcolor: "#1a1a2e",
          width: "100%",
          height: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
          boxSizing: "border-box",
        }}
      >
        {project.image ? (
          <Box
            component="img"
            src={project.image}
            alt={project.title}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "10px",
            }}
          />
        ) : (
          <MockupPlaceholder />
        )}
      </Box>

      <CardContent sx={{ p: "20px 24px 22px" }}>
        {/* Meta */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap",
            mb: 1.25,
          }}
        >
          <Chip
            label={project.category}
            size="small"
            sx={{
              bgcolor: purple.light,
              color: purple.dark,
              fontWeight: 500,
              fontSize: 10.5,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              borderRadius: "20px",
              height: 22,
            }}
          />
          <Chip
            label={project.role}
            size="small"
            sx={{
              bgcolor: "action.hover",
              color: "text.secondary",
              fontSize: 10.5,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              borderRadius: "20px",
              height: 22,
            }}
          />
          <Typography variant="caption" color="text.disabled" sx={{ ml: 0.5 }}>
            {project.year}
          </Typography>
        </Box>

        {/* Title */}
        <Typography
          sx={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 20,
            fontWeight: 500,
            lineHeight: 1.3,
            mb: 1,
            color: "text.primary",
          }}
        >
          {project.title}
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ lineHeight: 1.7, mb: 2.25 }}
        >
          {project.description}
        </Typography>

        {/* Footer */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
            {project.tools.map((t) => (
              <Chip
                key={t}
                label={t}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: 10.5,
                  height: 22,
                  borderColor: "divider",
                  color: "text.secondary",
                }}
              />
            ))}
          </Box>
          <Button
            href={project.link}
            endIcon={<ArrowForwardIcon sx={{ fontSize: "14px !important" }} />}
            sx={{
              bgcolor: purple.light,
              color: purple.dark,
              fontWeight: 500,
              fontSize: 12,
              borderRadius: "10px",
              px: 1.75,
              py: 0.75,
              textTransform: "none",
              whiteSpace: "nowrap",
              ml: 1,
              "&:hover": { bgcolor: "#CECBF6" },
            }}
          >
            Ver proyecto
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

// ─── Card: image on LEFT (horizontal) ────────────────────────────────────────
function ProjectCardHorizontal({ project }) {
  return (
    <Card
      elevation={0}
      sx={{
        width: 560,
        borderRadius: "20px",
        border: "0.5px solid",
        borderColor: "divider",
        overflow: "hidden",
        display: "flex",
        flexDirection: "row",
        transition: "transform 0.2s ease, border-color 0.2s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          borderColor: "action.hover",
        },
      }}
    >
      {/* Image area */}
      <Box
        sx={{
          bgcolor: "#1a1a2e",
          width: 200,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
          boxSizing: "border-box",
        }}
      >
        {project.image ? (
          <Box
            component="img"
            src={project.image}
            alt={project.title}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "10px",
            }}
          />
        ) : (
          <MockupPlaceholder />
        )}
      </Box>

      <CardContent
        sx={{
          p: "20px 22px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
          "&:last-child": { pb: "20px" },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
          {/* Meta */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              flexWrap: "wrap",
            }}
          >
            <Chip
              label={project.category}
              size="small"
              sx={{
                bgcolor: purple.light,
                color: purple.dark,
                fontWeight: 500,
                fontSize: 10.5,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                borderRadius: "20px",
                height: 22,
              }}
            />
            <Chip
              label={project.role}
              size="small"
              sx={{
                bgcolor: "action.hover",
                color: "text.secondary",
                fontSize: 10.5,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                borderRadius: "20px",
                height: 22,
              }}
            />
            <Typography variant="caption" color="text.disabled">
              {project.year}
            </Typography>
          </Box>

          {/* Title */}
          <Typography
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 17,
              fontWeight: 500,
              lineHeight: 1.3,
              color: "text.primary",
            }}
          >
            {project.title}
          </Typography>

          {/* Description */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: 12.5, lineHeight: 1.65 }}
          >
            {project.description}
          </Typography>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: 2,
          }}
        >
          <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
            {project.tools.map((t) => (
              <Chip
                key={t}
                label={t}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: 10.5,
                  height: 22,
                  borderColor: "divider",
                  color: "text.secondary",
                }}
              />
            ))}
          </Box>
          <Button
            href={project.link}
            endIcon={<ArrowForwardIcon sx={{ fontSize: "14px !important" }} />}
            sx={{
              bgcolor: purple.light,
              color: purple.dark,
              fontWeight: 500,
              fontSize: 12,
              borderRadius: "9px",
              px: 1.75,
              py: 0.75,
              textTransform: "none",
              whiteSpace: "nowrap",
              ml: 1,
              "&:hover": { bgcolor: "#CECBF6" },
            }}
          >
            Ver proyecto
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────
function Ux({ id }) {
  const { ref, style } = useFadeIn({ delay: 200 });

  return (
    <section id={id} ref={ref} style={{ ...style, scrollMarginTop: "64px" }}>
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
        <Typography variant="h4" sx={{ mb: 6 }}>
          Projects that I'm proud of
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            width: "100%",
          }}
        >
          {projects.map((project) =>
            project.variant === "horizontal" ? (
              <ProjectCardHorizontal key={project.id} project={project} />
            ) : (
              <ProjectCardVertical key={project.id} project={project} />
            )
          )}
        </Box>
      </Box>
    </section>
  );
}

export default Ux;
