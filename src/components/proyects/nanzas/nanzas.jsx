import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  Stack,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useDarkMode } from "../../../context/themeContext";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import phoneMockup from "../../../assets/nanzas/phone-mockup-1.png";
import logo from "../../../assets/nanzas/logo.svg";
import logoFondo from "../../../assets/nanzas/fondo-leaf.svg";
import logoFondoWhite from "../../../assets/nanzas/fondo-leaf-white.svg";
import taskFlow from "../../../assets/nanzas/task-flow.svg";
import phoneGrid from "../../../assets/nanzas/phone-grid.png";
import mujerF from "../../../assets/nanzas/mujer-financiera.svg";
import monefy from "../../../assets/nanzas/monefy.svg";
import ahorradas from "../../../assets/nanzas/ahorradas.svg";
import cardsHighMock from "../../../assets/nanzas/mockups/cards-high.png";
import cardsLowMock from "../../../assets/nanzas/mockups/cards-low.png";
import dashboardHighMock from "../../../assets/nanzas/mockups/dashboard-high.png";
import dashboardLowMock from "../../../assets/nanzas/mockups/dashboard-low.png";
import historyLowMock from "../../../assets/nanzas/mockups/history-low.png";
import newTransHighMock from "../../../assets/nanzas/mockups/new-trans.png";
import paymentsHighMock from "../../../assets/nanzas/mockups/payment-high.png";
import paymentsLowMock from "../../../assets/nanzas/mockups/payments-low.png";
import PhoneMockup from "./phone";

const green = {
  primary: "#396C3A",
  light: "#EAF3DE",
  lightGreen: "#D2E3D3",
  mid: "#639922",
  dark: "#27500A",
  deep: "#1E3F16",
  soft: "#f4f8f0",
};

const surface = {
  white: "#FFFFFF",
  paper: "#FAFAF7",
};

const Container = ({ children, sx = {}, ...props }) => (
  <Box
    sx={{
      width: "100%",
      maxWidth: 1180,
      mx: "auto",
      px: { xs: 3, sm: 5, md: 8 },
      ...sx,
    }}
    {...props}
  >
    {children}
  </Box>
);

// Small uppercase label used above section titles ("eyebrow" text)
const Eyebrow = ({ children, color = green.mid }) => (
  <Typography
    sx={{
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color,
      mb: 1.5,
    }}
  >
    {children}
  </Typography>
);

const SectionTitle = ({ children, color = green.dark, barColor }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1.5 }}>
    <Box
      sx={{
        width: 4,
        height: 30,
        bgcolor: barColor || green.primary,
        borderRadius: 1,
        flexShrink: 0,
      }}
    />
    <Typography
      sx={{
        fontWeight: 500,
        fontSize: { xs: 24, md: 30 },
        color,
        lineHeight: 1.25,
      }}
    >
      {children}
    </Typography>
  </Box>
);

const SectionSubtitle = ({ children, color = "#5C6B57", sx = {} }) => (
  <Typography
    sx={{
      fontSize: 15,
      lineHeight: 1.75,
      color,

      ml: { xs: 0, sm: "24px" },
      ...sx,
    }}
  >
    {children}
  </Typography>
);

const PhonePlaceholder = ({ label, width = "100%", sx = {} }) => (
  <Box
    sx={{
      width,
      aspectRatio: "9 / 19",
      borderRadius: 5,
      bgcolor: surface.white,
      border: `1px dashed ${green.primary}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: green.primary,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: "0.04em",
      textAlign: "center",
      px: 2,
      flexShrink: 0,
      ...sx,
    }}
  >
    {label}
  </Box>
);

/* ------------------------------------------------------------------ */
/*  1. HERO SECTION — light green background                           */
/* ------------------------------------------------------------------ */
const HeroSection = ({ darkMode, handleThemeToggle }) => (
  <Box
    sx={{
      background: `linear-gradient(to left, ${green.light} 0%, #FFFFFF 100%)`,
      position: "relative",
      overflow: "hidden",
    }}
  >
    <Box
      component="img"
      src={logoFondo}
      alt=""
      sx={{
        position: "absolute",
        top: "-25%",
        left: "-25%",
        width: { xs: 600, lg: 1000 },
        display: { xs: "none", md: "block" },
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
    <Container
      sx={{
        pt: { xs: 3, md: 4 },
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        zIndex: 1,
      }}
    >
      {/* Top bar: theme toggle (left) + case study label (right, plain text per reference) */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Typography sx={{ fontSize: 14, color: "#3A4A34" }}>
          Case study | Product design
        </Typography>
      </Box>

      {/* Main hero row: overlapping phones (left) + logo/wordmark column (right) */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: { sx: 2, lg: 20 },
        }}
      >
        <Box
          component="img"
          src={phoneMockup}
          alt="Phone mockup"
          sx={{
            display: { xs: "none", sm: "block" },
            maxWidth: { xs: "400px", lg: "600px" },
            width: "100%",
            height: "auto",
          }}
        />

        <Box
          sx={{
            textAlign: { xs: "center", sm: "right" },
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "center", sm: "flex-end" },
            gap: 3,
            py: { xs: 4, sm: 0 },
          }}
        >
          <img
            src={logo}
            alt="logo"
            style={{ maxWidth: "200px", width: "100%", height: "auto" }}
          />
          <Typography
            sx={{
              fontSize: { xs: 40, sm: 56 },
              fontWeight: 700,
              color: green.primary,
              lineHeight: 1,
              textAlign: { xs: "center", sm: "right" },
            }}
          >
            Nanzas
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: 16, sm: 18 },
              color: "#4E5A49",
              lineHeight: 1.6,
              maxWidth: 380,
              textAlign: { xs: "center", sm: "right" },
            }}
          >
            New design for an app to track your own finances.
          </Typography>
          <Stack
            direction="row"
            spacing={1}
            sx={{ flexWrap: "wrap", justifyContent: "center", rowGap: 1 }}
          >
            {["UX/UI Design", "Mobile App"].map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                sx={{
                  bgcolor: green.lightGreen,
                  color: green.primary,
                  fontWeight: 500,
                  fontSize: 12,
                  px: 0.5,
                }}
              />
            ))}
          </Stack>
          <Button
            sx={{
              bgcolor: green.primary,
              color: surface.white,
              px: 3,
            }}
          >
            See prototype
          </Button>
        </Box>
      </Box>
    </Container>
  </Box>
);

/* ------------------------------------------------------------------ */
/*  2. INTRO SECTION — pure white, dark green text carries the contrast */
/* ------------------------------------------------------------------ */
const IntroSection = () => (
  <Box
    sx={{
      bgcolor: green.primary,
      px: { xs: 2, md: 40 },
      py: { xs: 8, md: 10 },
    }}
  >
    <Typography
      sx={{
        fontSize: { xs: 17, md: 20 },
        lineHeight: 1.8,

        color: surface.white,
        textAlign: "center",
        fontWeight: 400,
      }}
    >
      Nanzas is a project that comes from a necessity to register your own
      economy, giving you the opportunity to identify all those expenses that
      don't let you administrate your money properly.
    </Typography>
  </Box>
);

/* ------------------------------------------------------------------ */
/*  3. ISOMETRIC SHOWCASE SECTION — pure white background               */
/* ------------------------------------------------------------------ */
const IsometricSection = () => (
  <Box
    sx={{
      width: "100%",
      display: "block",
      height: { xs: "auto", lg: "700px" },
      overflow: "hidden",
      // Agregamos la máscara con un gradiente de negro (visible) a transparente (oculto)
      WebkitMaskImage:
        "linear-gradient(to bottom, black 50%, transparent 100%)",
      maskImage: "linear-gradient(to bottom, black 50%, transparent 100%)",
    }}
  >
    <Box
      component="img"
      src={phoneGrid}
      alt="Phone mockup"
      sx={{
        width: "100%",
        display: "block",
      }}
    />
  </Box>
);

/* ------------------------------------------------------------------ */
/*  4. BENCHMARK SECTION — competitor analysis grid                    */
/* ------------------------------------------------------------------ */
const competitors = [
  {
    logo: mujerF,
    name: "Mujer financiera",
    note: "The best feature of this app relay in the card tracking expenses. Also it has a calculator when you register a transaction.",
  },
  {
    logo: monefy,
    name: "Monefy",
    note: "It’s intuitive it has a donut graphic where you can easily check your expenses and incomes. ",
  },
  {
    logo: ahorradas,
    name: "AhorrADAs",
    note: "It has the basic features but it also provide a summary to compare categories, and also filters with a history of all your transactions.",
  },
];

const BenchmarkSection = () => (
  <Box
    sx={{
      py: { xs: 8, md: 12 },
      position: "relative",
    }}
  >
    <Box
      component="img"
      src={logoFondo}
      alt=""
      sx={{
        position: "absolute",
        top: "20%",
        left: "-15%",
        width: 500,
        display: { xs: "none", md: "block" },
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
    <Container sx={{ position: "relative" }}>
      <SectionTitle>Benchmark</SectionTitle>
      <SectionSubtitle>
        The first step was researching at least three products that embrace the
        same approach, to see what could be improved for Nanzas.
      </SectionSubtitle>

      <Box
        sx={{
          mt: 6,
          ml: { xs: 0, sm: "24px" },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
          gap: 10,
        }}
      >
        {competitors.map((c) => (
          <Box
            key={c.name}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <Box
              component="img"
              src={c.logo}
              alt="logo"
              sx={{
                width: "100%",
                maxWidth: "250px",
                height: "100px",
                objectFit: "contain",
                display: "block",
                margin: "0 auto",
                bgcolor: green.primary,
                py: 2,
                px: 4,
                borderRadius: 2,
              }}
            />

            <Typography
              sx={{ fontSize: 13.5, lineHeight: 1.7, color: "#5C6B57" }}
            >
              {c.note}
            </Typography>
          </Box>
        ))}
      </Box>
    </Container>
  </Box>
);

/* ------------------------------------------------------------------ */
/*  5. INFORMATION ARCHITECTURE SECTION — sitemap                      */
/* ------------------------------------------------------------------ */
const sitemap = [
  {
    section: "Home",
    items: [
      "Balance",
      "New transaction",
      "Donut graphic",
      "Payment list",
      "Last transactions",
    ],
  },
  {
    section: "Cards",
    items: ["Cards", "Add cards", "Bar graphic", "Add card expense"],
  },
  {
    section: "Categories",
    items: ["Add category", "Categories list", "Edit category"],
  },
  {
    section: "Settings",
    items: ["Currency", "Language", "Dark mode", "Account settings", "Log out"],
  },
];

const IASection = () => (
  <Box
    sx={{
      py: { xs: 8, md: 12 },
      position: "relative",
      overflow: "hidden",
    }}
  >
    <Container sx={{ position: "relative" }}>
      <SectionTitle>Information architecture</SectionTitle>
      <SectionSubtitle>
        After considering the necessities of the user, this led to a detailed
        architecture of the information to define where each feature belongs.
      </SectionSubtitle>

      <Box
        sx={{
          mt: 6,
          ml: { xs: 0, sm: "24px" },
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 3,
        }}
      >
        {sitemap.map((node) => (
          <Box
            key={node.section}
            sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
          >
            <Box
              sx={{
                bgcolor: green.primary,
                color: surface.white,
                borderRadius: 2,
                px: 2.5,
                py: 1.5,
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              {node.section}
            </Box>
            <Stack spacing={1.5} sx={{ mt: 1 }}>
              {node.items.map((item) => (
                <Box
                  key={item}
                  sx={{
                    bgcolor: green.lightGreen,
                    color: green.primary,
                    borderRadius: 2,
                    px: 2.5,
                    py: 1.5,
                    fontSize: 13.5,
                  }}
                >
                  {item}
                </Box>
              ))}
            </Stack>
          </Box>
        ))}
      </Box>
    </Container>
  </Box>
);

/* ------------------------------------------------------------------ */
/*  6. TASK FLOW SECTION — flowchart + single phone mockup             */
/* ------------------------------------------------------------------ */
const TaskFlowSection = () => (
  <Box
    sx={{
      py: { xs: 8, md: 12 },
      position: "relative",
    }}
  >
    <Box
      component="img"
      src={logoFondo}
      alt=""
      sx={{
        position: "absolute",
        top: "-10%",
        right: "-15%",
        width: 500,
        display: { xs: "none", md: "block" },
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
    <Container sx={{ position: "relative" }}>
      <SectionTitle>Task flow: add new transaction</SectionTitle>
      <SectionSubtitle sx={{ mb: 2 }}>
        The most frequent action in the app, mapped step by step to keep it to
        the fewest taps possible including the error-handling path.
      </SectionSubtitle>

      <Box
        sx={{
          mt: 10,
          ml: { xs: 0, sm: "24px" },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 12,
          alignItems: "flex-start",
        }}
      >
        <Box
          component="img"
          src={taskFlow}
          alt="task flow"
          sx={{
            width: "100%",
            maxWidth: "450px",
          }}
        />
        <Box>
          <Typography sx={{ textAlign: "center", mb: 3, color: green.primary }}>
            Prototype design
          </Typography>
          <PhoneMockup />
        </Box>
      </Box>
    </Container>
  </Box>
);

const wireframeScreens = [
  cardsLowMock,
  dashboardLowMock,
  historyLowMock,
  paymentsLowMock,
];
const finalScreens = [
  paymentsHighMock,
  newTransHighMock,
  dashboardHighMock,
  cardsHighMock,
];

const WireframesBand = () => (
  <Box
    sx={{
      background: `linear-gradient(to bottom right, ${green.primary} 0%, #6A926B 100%)`,
      mt: -0.5,
      py: 10,
      position: "relative",
      overflow: "hidden",
      borderRadius: 20,
    }}
  >
    <Box
      component="img"
      src={logoFondoWhite}
      alt=""
      sx={{
        position: "absolute",
        top: "0%",
        left: "-15%",
        width: 500,
        display: { xs: "none", md: "block" },
        zIndex: 0,
        pointerEvents: "none",
      }}
    />

    <Box
      component="img"
      src={logoFondoWhite}
      alt=""
      sx={{
        position: "absolute",
        top: "50%",
        right: "-15%",
        width: 500,
        display: { xs: "none", md: "block" },
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
    <Container sx={{ position: "relative" }}>
      {/* --- First wireframes --- */}
      <SectionTitle color={surface.white} barColor={green.light}>
        First wireframes
      </SectionTitle>
      <SectionSubtitle color="rgba(255,255,255,0.75)">
        Taking the first live wireframes to a low-fidelity pass, focused on
        layout and flow before any visual styling.
      </SectionSubtitle>

      <Box
        sx={{
          mt: 6,

          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 3,
        }}
      >
        {wireframeScreens.map((label) => (
          <Box
            component="img"
            src={label}
            alt="task flow"
            sx={{
              width: "100%",
              maxWidth: "600px",
            }}
          />
        ))}
      </Box>

      {/* --- Final high fidelity wireframes --- */}
      <Box sx={{ mt: { xs: 10, md: 14 } }}>
        <SectionTitle color={surface.white} barColor={green.light}>
          Final high fidelity wireframes
        </SectionTitle>
        <SectionSubtitle color="rgba(255,255,255,0.75)">
          After user testing on the high-fidelity wireframes, a few changes were
          made to reach the final design of Nanzas.
        </SectionSubtitle>

        <Box
          sx={{
            mt: 6,

            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 3,
          }}
        >
          {finalScreens.map((label) => (
            <Box
              component="img"
              src={label}
              alt="task flow"
              sx={{
                width: "100%",
                maxWidth: "600px",
                filter: "drop-shadow(0px 8px 12px rgba(0, 0, 0, 0.3))",
              }}
            />
          ))}
        </Box>
      </Box>
    </Container>
  </Box>
);

/* ------------------------------------------------------------------ */
/*  9. FOOTER — gradient fading from green down to pure white, closing  */
/*  out the "end" zone of the page.                                     */
/* ------------------------------------------------------------------ */
const Footer = () => (
  <Box
    sx={{
      background: `linear-gradient(to left, ${green.light} 0%, #FFFFFF 100%)`,
      mt: -0.5,
      py: { xs: 10, md: 14 },
    }}
  >
    <Typography
      sx={{
        fontSize: { xs: 28, md: 36 },
        fontWeight: 600,
        color: green.dark,
        textAlign: "center",
      }}
    >
      Thank you!
    </Typography>
  </Box>
);

/* ------------------------------------------------------------------ */
/*  PAGE COMPOSITION                                                    */
/* ------------------------------------------------------------------ */
export default function NanzasProject() {
  const { darkMode, handleThemeToggle, theme } = useDarkMode();
  const [activeScreen, setActiveScreen] = useState("login"); // kept for future phone-mockup interactivity

  if (!theme) return null;

  // Tema "hijo": copia el theme global (theme) y le pisa solo la fuente.
  // Todo lo demás (colores, breakpoints, etc.) se mantiene igual.
  const latoTheme = createTheme({
    palette: theme.palette,
    typography: {
      fontFamily: '"Lato", sans-serif',
    },
  });
  return (
    <ThemeProvider theme={latoTheme}>
      <Box sx={{ width: "100%", overflowX: "hidden", bgcolor: surface.white }}>
        <HeroSection
          darkMode={darkMode}
          handleThemeToggle={handleThemeToggle}
        />
        <IntroSection />
        <IsometricSection />
        <BenchmarkSection />
        <IASection />
        <TaskFlowSection />
        <WireframesBand />
        <Footer />
      </Box>
    </ThemeProvider>
  );
}
