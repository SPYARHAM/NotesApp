import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import styled, { keyframes } from "styled-components";
import emptyNotesIcon from "./assets/notes.svg";
import emptryNotesIcon2 from "./assets/cork board with notes.svg";
import emptryNotesIcon3 from "./assets/creating new document with button.svg";
import backgroundSVG from "./assets/bg.png";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const AnimatedBox = styled(Box)`
  animation: ${fadeIn} 2s ease-in-out;
`;

const BackgroundSVG = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${backgroundSVG});
  background-size: cover;
  background-repeat: no-repeat;
  opacity: 1; /* Adjust opacity for background effect */
  z-index: -1;
`;

const HomePage = () => {
  return (
    <Box
      sx={{
        height: "240vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <BackgroundSVG />

      <Grid container spacing={0} sx={{ zIndex: 1 }}>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "center", md: "flex-start" },
            justifyContent: "center",
            textAlign: { xs: "center", md: "left" },
            px: { xs: 2, md: 5 },
          }}
        >
          <AnimatedBox>
            <Typography
              variant="h2"
              sx={{
                fontFamily: "fantasy",
                fontWeight: "bold",
                mb: 2,
              }}
            >
              Your Personal Notebook
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontFamily: "fantasy",
                fontWeight: "bold",
                mb: 2,
              }}
            >
              Welcome to NotesApp, your personal space for organizing thoughts
              and ideas. Create and manage multiple notebooks, each with its own
              unique title. Inside each notebook, add and organize notes to
              capture your inspirations, to-dos, and important information.
              Whether it's for personal use, study, or work, NotesApp keeps all
              your notes structured and easily accessible.
            </Typography>
          </AnimatedBox>
        </Grid>

        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AnimatedBox
            component="img"
            src={emptyNotesIcon}
            alt="Logo"
            sx={{
              width: { xs: "80%", md: 600 },
              height: { xs: "auto", md: 600 },
              mr: 1,
            }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AnimatedBox
            component="img"
            src={emptryNotesIcon2}
            alt="Logo"
            sx={{
              width: { xs: "80%", md: 600 },
              height: { xs: "auto", md: 600 },
              mr: 1,
            }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "center", md: "flex-start" },
            justifyContent: "center",
            textAlign: { xs: "center", md: "left" },
            px: { xs: 2, md: 5 },
          }}
        >
          <AnimatedBox>
            <Typography
              variant="h2"
              sx={{
                fontFamily: "fantasy",
                fontWeight: "bold",
                mb: 2,
              }}
            >
              Effortless Note Management
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontFamily: "fantasy",
                fontWeight: "bold",
                mb: 2,
              }}
            >
              Keep your ideas flowing with NotesApp's seamless note management
              system. Create, edit, and delete notes within your notebooks
              effortlessly. Use the intuitive search functionality to find your
              notes quickly, ensuring that no important detail is ever lost.
              With NotesApp, you can focus on your thoughts while we take care
              of the organization.
            </Typography>
          </AnimatedBox>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "center", md: "flex-start" },
            justifyContent: "center",
            textAlign: { xs: "center", md: "left" },
            px: { xs: 2, md: 5 },
          }}
        >
          <AnimatedBox>
            <Typography
              variant="h2"
              sx={{
                fontFamily: "fantasy",
                fontWeight: "bold",
                mb: 2,
              }}
            >
              Stay Organized and Productive
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontFamily: "fantasy",
                fontWeight: "bold",
                mb: 2,
              }}
            >
              NotesApp is designed to boost your productivity by keeping your
              notes well-organized. Categorize your notes by topics, projects,
              or personal interests to maintain clarity and order. With
              real-time syncing across devices, you can access and update your
              notes anytime, anywhere. Stay on top of your tasks and ideas with
              NotesApp's user-friendly interface.
            </Typography>
          </AnimatedBox>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AnimatedBox
            component="img"
            src={emptryNotesIcon3}
            alt="Logo"
            sx={{
              width: { xs: "80%", md: 600 },
              height: { xs: "auto", md: 600 },
              mr: 1,
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage;
