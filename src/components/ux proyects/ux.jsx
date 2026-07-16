import React, { useLayoutEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import PhoneMockup3D, {
  DEFAULT_PHONE_PRIMARY_SETTINGS,
  DEFAULT_PHONE_SECONDARY_SETTINGS,
  DEFAULT_CAM_SETTINGS,
} from "./PhoneMockup3D";

// ─── Per-project assets ───────────────────────────────────────────────────────
import portadaNanzasFondo from "../../assets/portada-nanzas-fondo.png";
import screenNanzas1 from "../../assets/screen-nanzas-1.png";
import screenNanzas2 from "../../assets/screen-nanzas-2.png";
import portadaPausaFondo from "../../assets/portada-pausa-fondo.png";
import screenPausa1 from "../../assets/screen-pausa-1.png";
import screenPausa2 from "../../assets/screen-pausa-2.png";

gsap.registerPlugin(ScrollTrigger);

// ─── Mock data ────────────────────────────────────────────────────────────────
// `primarySettings` / `secondarySettings` / `camSettings` are OPTIONAL per
// project — leave them out to use the shared defaults (the exact coordinates
// from the POC, imported above). If one project needs its own phone framing,
// just add the field with the same shape as the defaults — you can spread a
// default and override only the fields you need to tweak, like the
// (commented) example on "Nanzas" below.
const projects = [
  {
    id: 1,
    category: "UX Design",
    role: "Mobile App",
    title: "Nanzas",
    description:
      "Designed a personal finance app from scratch mobile and web, covering the full product cycle from UX research and wireframing to a fully responsive React interface prototype.",
    link: "/project/nanzas",
    backgroundImage: portadaNanzasFondo,
    screens: [screenNanzas1, screenNanzas2],
    bg: "#1f4e3d",
    tint: "#14261d",
    sub: "Nanzas",
    type: "phone",

    // Per-project override example — uncomment and tweak any field you need.
    // Every field is required if you add the object (it fully replaces the
    // default for that phone), so easiest is to spread the default and only
    // change what's different:
    //
    // primarySettings: {
    //   ...DEFAULT_PHONE_PRIMARY_SETTINGS,
    //   endZoom: 1.5, // e.g. bring the primary phone a bit closer at rest
    // },
    // secondarySettings: {
    //   ...DEFAULT_PHONE_SECONDARY_SETTINGS,
    //   endPosX: 0.05, // e.g. nudge the secondary phone sideways
    // },
    // camSettings: {
    //   ...DEFAULT_CAM_SETTINGS,
    //   endCamPosY: 0.05,
    // },
  },
  {
    id: 2,
    category: "UX Design",
    role: "Mobile App",
    title: "Pausa",
    description:
      "Designed a tool to help people with anxiety attacks and be able to track their mental health.",
    link: "/project/pausa",
    backgroundImage: portadaPausaFondo,
    screens: [screenPausa1, screenPausa2],
    bg: "#295f40",
    tint: "#132018",
    sub: "Pausa",
    type: "phone",
  },
  {
    id: 3,
    category: "UX Design",
    role: "Mobile App",
    title: "Nanzas",
    description:
      "Designed a personal finance app from scratch mobile and web, covering the full product cycle from UX research and wireframing to a fully responsive React interface prototype.",
    link: "/project/nanzas",
    backgroundImage: portadaNanzasFondo,
    screens: [screenNanzas1, screenNanzas2],
    bg: "#1f4e3d",
    tint: "#14261d",
    sub: "Nanzas",
    type: "phone",
  },
];

// ─── Meta chips ───────────────────────────────────────────────────────────────
function MetaChips({ project }) {
  return (
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
          bgcolor: "rgba(76, 175, 109, 0.12)",
          color: "#8fd6a4",
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
          bgcolor: "rgba(255,255,255,0.06)",
          color: "text.secondary",
          fontSize: 10.5,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          borderRadius: "20px",
          height: 22,
        }}
      />
    </Box>
  );
}

// ─── Card única (todas iguales) ───────────────────────────────────────────────
const ProjectCard = React.forwardRef(({ project, index }, ref) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Box
      ref={ref}
      className="stack-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      tabIndex={0}
      sx={{
        position: "sticky",
        top: { xs: 80 + index * 12, md: 100 + index * 16 },
        width: "100%",
        maxWidth: "1300px",
        mx: "auto",
      }}
    >
      <Card
        elevation={0}
        sx={(theme) => ({
          width: "100%",
          overflow: "hidden",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          backgroundColor: theme.palette.fondoTarjetitas.fondo,
          border: "1px solid",
          borderColor: theme.palette.fondoTarjetitas.borde,
          boxShadow: `0px 2px 14px 10px ${theme.palette.fondoTarjetitas.sombra}`,
          borderRadius: "20px",
        })}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: { xs: "100%", md: 600 },
            minHeight: { xs: 340, md: 500 },

            borderRadius: "15px",
            overflow: "hidden",
          }}
        >
          {project.backgroundImage && (
            <Box
              component="img"
              src={project.backgroundImage}
              alt={project.title}
              sx={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",

                objectPosition: "center",
              }}
            />
          )}

          {/* Secondary phone — a second independent PhoneMockup3D instance,
              same groupId as the primary above. */}
          <Box sx={{ position: "absolute", inset: 0 }}>
            <PhoneMockup3D
              type={project.type}
              groupId={`card-${project.id}`}
              screen={project.screens?.[1]}
              bg={project.bg}
              tint={project.tint}
              title={project.title}
              sub={project.sub}
              isSecondary
              settings={
                project.secondarySettings || DEFAULT_PHONE_SECONDARY_SETTINGS
              }
              camSettings={project.camSettings || DEFAULT_CAM_SETTINGS}
              isHovered={isHovered}
            />
          </Box>
          {/* Primary phone — its own independent PhoneMockup3D instance.
              groupId ties it to its sibling below so the renderer treats
              them as one visual unit (clears together, doesn't erase
              each other) while still isolating this card from others. */}
          <Box sx={{ position: "absolute", inset: 0 }}>
            <PhoneMockup3D
              type={project.type}
              groupId={`card-${project.id}`}
              screen={project.screens?.[0]}
              bg={project.bg}
              tint={project.tint}
              title={project.title}
              sub={project.sub}
              settings={
                project.primarySettings || DEFAULT_PHONE_PRIMARY_SETTINGS
              }
              camSettings={project.camSettings || DEFAULT_CAM_SETTINGS}
              isHovered={isHovered}
            />
          </Box>

          {/*
            To add a laptop mockup later: once its .gltf is wired up in
            PhoneMockup3D's MODEL_CONFIG, just render another instance here,
            reusing the same groupId so it clears/composites correctly with
            the phones above, e.g.:
            <Box sx={{ position: "absolute", inset: 0 }}>
              <PhoneMockup3D
                type="laptop"
                groupId={`card-${project.id}`}
                screen={project.laptopScreen}
                settings={project.laptopSettings}
                camSettings={project.laptopCamSettings}
                isHovered={isHovered}
              />
            </Box>
          */}
        </Box>

        <CardContent
          sx={{
            p: { xs: "24px", md: "40px 48px" },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            gap: 3,
            "&:last-child": { pb: { xs: "24px", md: "40px" } },
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <MetaChips project={project} />

            <Box>
              <Typography
                color="primary"
                sx={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: { xs: 40, md: 80 },
                  fontWeight: 600,
                  lineHeight: 1.1,
                }}
              >
                {project.title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: { xs: 15, md: 20 },
                  lineHeight: 1.7,
                  maxWidth: 520,
                }}
              >
                {project.description}
              </Typography>
            </Box>
          </Box>

          <Button
            href={project.link}
            endIcon={<ArrowForwardIcon sx={{ fontSize: "18px !important" }} />}
            sx={(theme) => ({
              alignSelf: "flex-start",
              backgroundColor: theme.palette.primary.main,
              color: "#eafbee",
              fontWeight: 500,
              fontSize: 16,
              borderRadius: "12px",
              px: 3,
              py: 1.25,
              textTransform: "none",
              whiteSpace: "nowrap",
              "&:hover": { backgroundColor: "#295f40" },
            })}
          >
            View case study
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
});

// ─── Sección principal ─────────────────────────────────────────────────────────
function Ux({ id }) {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  cardsRef.current = [];

  const addCardRef = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current;

      cards.forEach((card, i) => {
        if (i === cards.length - 1) return;
        const nextCard = cards[i + 1];

        ScrollTrigger.create({
          trigger: nextCard,
          start: "top bottom",
          end: "top top",
          scrub: true,
          onUpdate: (self) => {
            const progress = self.progress;
            gsap.set(card, {
              scale: 1 - progress * 0.06,
              transformOrigin: "top center",
            });
          },
        });
      });

      ScrollTrigger.refresh();
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id={id} ref={containerRef}>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: { xs: 8, md: 12 },
          marginBottom: 30,
          px: 2,
        }}
      >
        {projects.map((project, i) => (
          <ProjectCard
            key={project.id}
            ref={addCardRef}
            project={project}
            index={i}
          />
        ))}
      </Box>
    </section>
  );
}

export default Ux;
