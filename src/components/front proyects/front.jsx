import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  Stack,
} from "@mui/material";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useEffect } from "react";
import { useFadeIn } from "../../hooks/useFadeIn";

function Front({ id }) {
  const { ref, style } = useFadeIn({ delay: 200 });
  const settings = {
    className: "center",
    centerPadding: "60px",
    centerMode: true,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const projects = [
    {
      title: "Movies Browser",
      description:
        "On this project I applied all the knowledge from ADA ITW FrontEnd Developer Career.",
      img: "../../../public/assets-front/movie.png",
      repository: "https://github.com/RomiRao/movies/tree/main",
      deploy: "https://movies-browser-omega.vercel.app/",
      tags: ["ReactJS", "MaterialUI", "JavaScript", "tmdb", "Vercel", "GIT"],
    },
    {
      title: "AhorrADAs",
      description:
        "A virtual wallet to register money movements using localstorage.",
      img: "../../../public/assets-front/ahorradas.png",
      repository: "https://github.com/RomiRao/ahorrADAs-marce-romi",
      deploy: "https://romirao.github.io/ahorrADAs-marce-romi/",
      tags: ["HTML", "CSS", "JavaScript", "GIT"],
    },
    {
      title: "Royal Caribbean Jobs",
      description: "For this project I learned how to use an API with MockAPI",
      img: "../../../public/assets-front/RoyalCar.png",
      repository: "https://github.com/RomiRao/jobs",
      deploy: "https://romirao.github.io/jobs/",
      tags: ["HTML", "CSS", "Bootstrap", "APIREST", "JavaScript", "GIT"],
    },
    {
      title: "Readme - Ecommerce",
      description: "Just a small project to show skills between ecommerce.",
      img: "../../../public/assets-front/readMe.png",
      repository: "https://github.com/RomiRao/READ-ME",
      deploy: "https://read-me-five.vercel.app/",
      tags: [
        "ReactJS",
        "MaterialUI",
        "JavaScript",
        "tmdb",
        "Vercel",
        "GIT",
        "Firebase",
      ],
    },
    {
      title: "ToDo App",
      description: "Just a simple ToDo app, done with react and Materiaul UI.",
      img: "../../../public/assets-front/toDo.png",
      repository: "https://github.com/RomiRao/AdaTasks",
      deploy: "https://ada-tasks.vercel.app/",
      tags: [
        "ReactJS",
        "localStorage",
        "JavaScript",
        "MaterialUI",
        "Vercel",
        "GIT",
      ],
    },
    {
      title: "Meme Generator",
      description: "A fun project using JavaScript for the first time!",
      img: "../../../public/assets-front/meme.png",
      repository: "https://github.com/RomiRao/meme-generator",
      deploy: "https://romirao.github.io/meme-generator/",
      tags: ["HTML", "CSS", "JavaScript", "GIT"],
    },
    {
      title: "Choppify",
      description:
        "Just a very small project playing with javascript. To create your own Chopper.",
      img: "../../../public/assets-front/choppify.png",
      repository: "https://github.com/RomiRao/choppify",
      deploy: "https://romirao.github.io/choppify/",
      tags: ["HTML", "CSS", "JavaScript", "GIT"],
    },
    {
      title: "Restaurant Landing Page",
      description: "A smal landing page done in one day.",
      img: "../../../public/assets-front/landing.png",
      repository: "https://github.com/RomiRao/prueba-landing-page",
      deploy: "https://prueba-landing-page.vercel.app/",
      tags: ["ReactJS", "MaterialUI", "JavaScript", "Vercel", "GIT"],
    },
  ];

  // useEffect(() => {
  //   if (navigator.mediaDevices?.getUserMedia) {
  //     navigator.mediaDevices
  //       .getUserMedia({ video: true, audio: true })
  //       .then((stream) => {
  //         const video = document.querySelector("video");
  //         if (video) {
  //           video.srcObject = stream;
  //         }
  //       })
  //       .catch((err) => {
  //         console.error("Failed to access media devices:", err);
  //       });
  //   }
  // }, []);

  return (
    <section id={id} ref={ref} style={style}>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          borderWidth: 2,
          borderColor: "red",
        }}
      >
        {/* <video autoPlay controls></video> */}
        <Box sx={{ maxWidth: 750 }}>
          <Box sx={{ display: "flex", alignItems: "center", marginBottom: 5 }}>
            <IntegrationInstructionsIcon sx={{ marginRight: 2 }} />
            <Typography variant="h4">Front-End Projects</Typography>
          </Box>
          <div className="slider-container">
            <Slider {...settings}>
              {projects.map((project) => (
                <Card
                  key={project.title}
                  sx={{
                    maxWidth: 300,
                    m: 3,
                    height: 430,
                  }}
                >
                  <CardMedia
                    sx={{ height: 170 }}
                    image={project.img}
                    title={project.title}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {project.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {project.description}
                    </Typography>
                    <Stack direction="row" mt={2} flexWrap="wrap">
                      {project.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          color="primary"
                          size="small"
                          variant="filled"
                          sx={{ mr: "4px", my: "4px" }}
                        />
                      ))}
                    </Stack>
                  </CardContent>

                  <CardActions>
                    {project.repository && (
                      <Button
                        size="small"
                        href={project.repository}
                        target="_blank"
                      >
                        Repository
                      </Button>
                    )}
                    <Button size="small" href={project.deploy} target="_blank">
                      Deploy
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </Slider>
          </div>
        </Box>
      </Box>
    </section>
  );
}

export default Front;
