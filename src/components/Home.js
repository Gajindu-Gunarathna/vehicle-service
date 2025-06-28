import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  Fade,
  Backdrop,
  IconButton,
  Divider,
  Stack,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";

const baseStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "#1B263B",
  color: "#E0E1DD",
  boxShadow: "0 4px 12px rgba(0,0,0,0.6)",
  p: 3,
  borderRadius: "12px",
  maxWidth: 500,
  maxHeight: "80vh",
  overflowY: "auto",
  backdropFilter: "blur(6px)",
  transition: "box-shadow 0.3s ease-in-out",
};

function Home() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        minHeight: "100vh",
        px: 10,
        pt: 10,
        bgcolor: "#010a17",
      }}
    >
      {/* Left Side */}
      <Box sx={{ maxWidth: 600, color: "#FFFFFF", textAlign: "left", mt: 4 }}>
        <Typography variant="h2" gutterBottom>
          Move faster with AutoFix Service Center
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ fontSize: "1.2rem" }}>
          AutoFix offers expert vehicle maintenance, repairs, and diagnostics to
          get you back on the road fast.
          <br />
          Trusted by hundreds — fast, reliable, and friendly every time.
        </Typography>
        <Button
          variant="contained"
          onClick={handleOpen}
          sx={{
            mt: 3,
            bgcolor: "#1B98E0",
            "&:hover": {
              bgcolor: "#1177BB",
            },
            borderRadius: "20px",
            px: 4,
            py: 1,
            fontWeight: "bold",
          }}
        >
          Learn More
        </Button>
      </Box>

      {/* Right Side */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "flex-start",
          pl: 6,
        }}
      >
        <img
          src="/garage.jpg"
          alt="AutoFix Service"
          style={{
            maxWidth: "100%",
            height: "auto",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
            marginTop: "32px",
          }}
        />
      </Box>

      {/* Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={open}>
          <Box
            sx={{
              ...baseStyle,
              "&:hover": {
                boxShadow:
                  "0 0 6px 2px rgba(27, 152, 224, 0.4), 0 0 8px 3px rgba(17, 119, 187, 0.3)",
              },
            }}
          >
            {/* Image */}
            <Box sx={{ mb: 2 }}>
              <img
                src="/CarServiceVista.jpg"
                alt="Service Center"
                style={{
                  width: "100%",
                  borderRadius: "10px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
                }}
              />
            </Box>

            {/* About */}
            <Typography variant="h5" gutterBottom>
              About AutoFix
            </Typography>
            <Typography variant="body1" paragraph>
              AutoFix was founded to deliver dependable automotive care and
              personal service. It has grown into a trusted center for modern
              vehicle needs.
            </Typography>
            <Typography variant="body1" paragraph>
              This site helps with booking appointments, checking product
              availability for service, and choosing preferred mechanics with
              ease.
            </Typography>

            {/* Divider */}
            <Divider sx={{ my: 3, bgcolor: "#E0E1DD" }} />

            {/* Contact Section */}
            <Box
              sx={{
                p: 2,
                borderRadius: "8px",
                bgcolor: "#273947",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Contact Us
              </Typography>

              <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                <EmailIcon />
                <Typography variant="body2">
                  support@autofixservice.com
                </Typography>
              </Stack>

              <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <PhoneIcon />
                <Typography variant="body2">+1 (234) 567-8900</Typography>
              </Stack>

              <Stack direction="row" spacing={2} justifyContent="flex-start">
                <IconButton
                  href="https://facebook.com"
                  target="_blank"
                  sx={{ color: "#E0E1DD" }}
                >
                  <FacebookIcon />
                </IconButton>
                <IconButton
                  href="https://instagram.com"
                  target="_blank"
                  sx={{ color: "#E0E1DD" }}
                >
                  <InstagramIcon />
                </IconButton>
                <IconButton
                  href="https://twitter.com"
                  target="_blank"
                  sx={{ color: "#E0E1DD" }}
                >
                  <TwitterIcon />
                </IconButton>
              </Stack>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
}

export default Home;
