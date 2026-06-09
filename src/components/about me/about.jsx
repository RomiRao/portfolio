import { Avatar, Box, Chip, styled, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { useState } from "react";
import { useFadeIn } from "../../hooks/useFadeIn";
import HandymanIcon from "@mui/icons-material/Handyman";

const Img = styled("img")({
  width: "100%",
  maxWidth: 330,
  maxHeight: 330,
  borderRadius: "5px",
  marginBottom: 5,
});

function About({ id }) {
  const { ref, style } = useFadeIn({ delay: 200 });
  return (
    <section id={id} ref={ref} style={{ ...style, scrollMarginTop: "64px" }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 4,
          maxWidth: 900,
          mx: "auto",
        }}
      >
        <Box
          sx={{
            flex: "1 1 300px",
            borderRight: { sm: 1 },
            borderColor: "divider",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", marginBottom: 3 }}>
            <PersonIcon sx={{ marginRight: 2 }} />
            <Typography variant="h4">About me</Typography>
          </Box>
          <Typography sx={{ marginBottom: 2 }}>
            I'm an artist that spent some contracts working and travelling for a
            cruise ship company so I got to know to many people and places! But
            now is time to keep working on my life and career.
          </Typography>
          <Typography sx={{ marginBottom: 2 }}>
            As I have always been passionate about solving logic problems, I
            decided to study Front-End Development at ADA ITW in Argentina. I
            have experience in HTML, CSS, JavaScript, GIT, React, and CSS
            frameworks for JS vanilla and for React (like Material UI, the one
            I'm using on this portfolio).
          </Typography>
          <Typography sx={{ marginBottom: 5 }}>
            Besides that, on my previous job I got valuable soft skills that
            contribute to my overall performance with people and projects. Also
            I'm fluent in Spanish and English, with basic Italian.
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 3,
            }}
          >
            <Img src="src\assets\Image-71.jpg" />
          </Box>

          <Box>
            <Typography
              variant="h5"
              sx={{
                marginBottom: 3,
              }}
            >
              Skills
            </Typography>

            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",

                alignItems: "center",
              }}
            >
              <img
                src="https://skillicons.dev/icons?i=git,css,typescript,js,materialui,react,firebase,photoshop,premiere,figma,azure,tailwind,github,angular&perline=7"
                style={{ width: "70%" }}
              />
            </Box>
          </Box>
        </Box>
        <Box sx={{ flex: "1 1 300px" }}>
          <Typography
            variant="h5"
            sx={{
              marginBottom: 3,
            }}
          >
            Work experience
          </Typography>
          <Box
            sx={{
              marginBottom: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: 2,
              }}
            >
              <Avatar
                alt="Microtrack"
                src="https://media.licdn.com/dms/image/v2/C4D0BAQHVpmVuiSQvRQ/company-logo_200_200/company-logo_200_200/0/1631339279741?e=1749686400&v=beta&t=ooD_9meQ99QpBvvgQketQm1O3UqvBGyQxRvf7K6HDvg"
                sx={{
                  marginRight: 2,
                }}
              />
              <Box>
                <Typography variant="h6">Micracel | Frontend Dev</Typography>
                <Typography variant="caption">
                  October 2024 - Present
                </Typography>
              </Box>
            </Box>

            <Box
              variant="body1"
              sx={{
                marginBottom: 2,
                marginLeft: 3,
              }}
            >
              <ul>
                <li>Updates and bug fixes in production</li>
              </ul>
              <ul>
                <li>Project migration</li>
              </ul>
              <ul>
                <li> Layouts with Angular</li>
              </ul>
              <ul>
                <li>Tailwind css and Angular Material styling</li>
              </ul>
              <ul>
                <li>APIs management</li>
              </ul>
            </Box>
            <Chip
              label="Angular"
              sx={{
                marginRight: 2,
              }}
            />
            <Chip
              label="Azure"
              sx={{
                marginRight: 2,
              }}
            />
            <Chip
              label="Tailwind"
              sx={{
                marginRight: 2,
              }}
            />
            <Chip
              label="Swagger"
              sx={{
                marginRight: 2,
              }}
            />
          </Box>
          <Box
            sx={{
              marginBottom: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: 2,
              }}
            >
              <Box>
                <Typography variant="h6">
                  Singulate AI | Frontend Dev
                </Typography>
                <Typography variant="caption">May 2024 - July 2024</Typography>
              </Box>
            </Box>

            <Box
              variant="body1"
              sx={{
                marginBottom: 2,
                marginLeft: 3,
              }}
            >
              <ul>
                <li>Controllers work within Ruby on Rails</li>
              </ul>
              <ul>
                <li>Layouts with viewcomponets</li>
              </ul>
              <ul>
                <li>Tailwind css styling</li>
              </ul>
              <ul>
                <li>Work environment with Docker within WSL</li>
              </ul>
            </Box>
            <Chip
              label="RoR"
              sx={{
                marginRight: 2,
                marginBottom: 1,
              }}
            />
            <Chip
              label="Github"
              sx={{
                marginRight: 2,
                marginBottom: 1,
              }}
            />
            <Chip
              label="ViewComponents"
              sx={{
                marginRight: 2,
                marginBottom: 1,
              }}
            />
            <Chip
              label="Tailwind CSS"
              sx={{
                marginRight: 2,
              }}
            />
          </Box>
          <Box
            sx={{
              marginBottom: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: 2,
              }}
            >
              <Box>
                <Typography variant="h6">
                  Celebrity Cruises | Photographer
                </Typography>
                <Typography variant="caption">
                  August 2019 - January 2023
                </Typography>
              </Box>
            </Box>

            <Box
              variant="body1"
              sx={{
                marginBottom: 2,
                marginLeft: 3,
              }}
            >
              <ul>
                <li>Teamwork and leadership.</li>
              </ul>
              <ul>
                <li>Photography products selling</li>
              </ul>
              <ul>
                <li>Customer Service</li>
              </ul>
              <ul>
                <li>Onboard safety protocols</li>
              </ul>
            </Box>
            <Chip
              label="Nikon D90"
              sx={{
                marginRight: 2,
                marginBottom: 1,
              }}
            />
            <Chip
              label="Studio lights"
              sx={{
                marginRight: 2,
                marginBottom: 1,
              }}
            />
            <Chip
              label="Photoshop"
              sx={{
                marginRight: 2,
                marginBottom: 1,
              }}
            />
          </Box>
        </Box>
      </Box>
    </section>
  );
}

export default About;
