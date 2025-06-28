import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Modal,
  Fade,
  Backdrop,
  TextField,
  Tabs,
  Tab,
  Paper,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { loginUser } from "./api"; // ✅ API function for login

export default function Appbar() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEmail("");
    setPassword("");
  };

  const handleTabChange = (event, newValue) => setTab(newValue);

  const handleLogin = async () => {
    const result = await loginUser({ email, password });
    if (result === true) {
      alert("Login successful!");
      handleClose();
    } else {
      alert("Login failed. Check email or password.");
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#010a17",
          boxShadow: "0 4px 12px rgba(0,0,0,0.6)",
          borderBottom: "1px solid #1B263B",
        }}
      >
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontWeight: "bold",
              letterSpacing: 1,
              cursor: "pointer",
              color: "#E0E1DD",
              "&:hover": { color: "#1B98E0" },
            }}
            onClick={() => window.location.reload()}
          >
            AutoFix
          </Typography>

          <Button
            sx={{
              color: "#E0E1DD",
              fontWeight: "bold",
              px: 3,
              py: 1,
              borderRadius: "4px",
              "&:hover": {
                backgroundColor: "#1B98E0",
                color: "#ffffff",
              },
            }}
            onClick={handleOpen}
          >
            Login
          </Button>
        </Toolbar>
      </AppBar>

      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          sx: { backgroundColor: "rgba(0,0,0,0.8)" },
        }}
      >
        <Fade in={open}>
          <Paper
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "#0A1626",
              color: "#F5F7FA",
              boxShadow:
                "0 0 18px 5px rgba(27, 152, 224, 0.7), 0 6px 24px rgba(0,0,0,0.8)",
              p: 4,
              borderRadius: "12px",
              outline: "none",
            }}
          >
            <Tabs
              value={tab}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{ mb: 3 }}
            >
              <Tab
                label="Login"
                sx={{
                  color: "#B0CFFF",
                  "&.Mui-selected": { color: "#1B98E0", fontWeight: "bold" },
                }}
              />
              <Tab
                label="Signup"
                sx={{
                  color: "#B0CFFF",
                  "&.Mui-selected": { color: "#1B98E0", fontWeight: "bold" },
                }}
              />
            </Tabs>

            {/* Login Form */}
            {tab === 0 && (
              <Box component="form" noValidate autoComplete="off">
                <TextField
                  fullWidth
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  margin="normal"
                  variant="filled"
                  InputProps={{
                    sx: {
                      bgcolor: "#0D1B2A",
                      borderRadius: 1,
                      color: "#F5F7FA",
                    },
                  }}
                  InputLabelProps={{ sx: { color: "#A3BFFA" } }}
                />
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  margin="normal"
                  variant="filled"
                  InputProps={{
                    sx: {
                      bgcolor: "#0D1B2A",
                      borderRadius: 1,
                      color: "#F5F7FA",
                    },
                  }}
                  InputLabelProps={{ sx: { color: "#A3BFFA" } }}
                />
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    mt: 3,
                    borderRadius: 2,
                    bgcolor: "#1B98E0",
                    "&:hover": { bgcolor: "#1177BB" },
                    fontWeight: "bold",
                  }}
                  onClick={handleLogin}
                >
                  Login
                </Button>
              </Box>
            )}

            {/* Signup Placeholder */}
            {tab === 1 && (
              <Typography variant="body2" sx={{ textAlign: "center", mt: 4 }}>
                Signup form coming soon...
              </Typography>
            )}
          </Paper>
        </Fade>
      </Modal>
    </Box>
  );
}
