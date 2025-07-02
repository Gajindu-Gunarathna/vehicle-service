import React, { useState, useEffect } from "react";
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
  Tabs,
  Tab,
  Paper,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemIcon,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import EventNoteIcon from "@mui/icons-material/EventNote";
import StorefrontIcon from "@mui/icons-material/Storefront";
import BuildIcon from "@mui/icons-material/Build";
import SettingsIcon from "@mui/icons-material/Settings";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import LogoutIcon from "@mui/icons-material/Logout";

import Login from "./Login";
import Singup from "./Singup";
import { useNavigate } from "react-router-dom";

export default function Appbar() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [role, setRole] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) setRole(storedRole);
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setTab(0);
  };

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    setRole(null);
    setDrawerOpen(false);
    navigate("/"); // <-- Redirect to home page after logout
    // window.location.reload();  // Remove reload to keep SPA behavior smooth
  };

  const userMenuItems = [
    { label: "User Profile", icon: <PersonIcon />, path: "/profile" },
    { label: "Appointments", icon: <EventNoteIcon />, path: "/appointments" },
    { label: "Products", icon: <StorefrontIcon />, path: "/products" },
    { label: "Services", icon: <SettingsIcon />, path: "/services" },
    {
      label: "Service Centers",
      icon: <LocationCityIcon />,
      path: "/service-centers",
    },
  ];

  const adminMenuItems = [
    { label: "Appointments", icon: <EventNoteIcon />, path: "/appointments" },
    { label: "Products", icon: <StorefrontIcon />, path: "/products" },
    { label: "Mechanics", icon: <BuildIcon />, path: "/mechanics" },
    { label: "Services", icon: <SettingsIcon />, path: "/services" },
    {
      label: "Service Centers",
      icon: <LocationCityIcon />,
      path: "/service-centers",
    },
  ];

  const menuItems = role === "admin" ? adminMenuItems : userMenuItems;

  const list = () => (
    <Box
      sx={{
        width: 270,
        bgcolor: "rgba(10, 22, 38, 0.85)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backdropFilter: "blur(8px)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
        borderRadius: "0 8px 8px 0",
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box>
        <Typography
          variant="h5"
          sx={{
            color: "#B0CFFF",
            p: 2,
            fontWeight: "bold",
            letterSpacing: 1.5,
            borderBottom: "1px solid #1B98E0",
            mb: 2,
          }}
        >
          Menu
        </Typography>

        <List>
          {menuItems.map((item, index) => (
            <React.Fragment key={item.label}>
              <ListItem
                button
                onClick={() => {
                  navigate(item.path);
                  setDrawerOpen(false);
                }}
                sx={{
                  color: "#F5F7FA",
                  py: 2,
                  px: 4,
                  "&:hover": { bgcolor: "#1B98E0", color: "#fff" },
                  borderRadius: 1,
                  fontSize: "1.1rem",
                  mb: 1,
                }}
              >
                <ListItemIcon
                  sx={{ color: "#B0CFFF", minWidth: 40, fontSize: "1.4rem" }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
              {index !== menuItems.length - 1 && (
                <Divider sx={{ borderColor: "#1B98E0", mx: 4, mb: 2 }} />
              )}
            </React.Fragment>
          ))}
        </List>

        <Divider sx={{ borderColor: "#1B98E0", my: 2 }} />
      </Box>

      <Box sx={{ p: 2 }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            bgcolor: "#FF6B6B",
            "&:hover": { bgcolor: "#D32F2F" },
            fontWeight: "bold",
            letterSpacing: 0.5,
            py: 1.5,
            fontSize: "1.1rem",
            borderRadius: 2,
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    )
      return;
    setDrawerOpen(open);
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
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            sx={{ mr: 2 }}
            onClick={() => {
              if (role) setDrawerOpen(true);
            }}
          >
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
            onClick={() => navigate("/")}
          >
            AutoFix
          </Typography>

          {!role ? (
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
          ) : (
            <Button
              sx={{
                color: "#E0E1DD",
                fontWeight: "bold",
                px: 3,
                py: 1,
                borderRadius: "4px",
                "&:hover": {
                  backgroundColor: "#D32F2F",
                  color: "#fff",
                },
              }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          )}
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
              onChange={(e, newVal) => setTab(newVal)}
              variant="fullWidth"
              TabIndicatorProps={{
                style: { backgroundColor: "#ffffff" }, // White underline
              }}
              sx={{
                mb: 3,
                "& .MuiTab-root": {
                  color: "#ffffff", // White text for all tabs
                  fontWeight: "bold",
                  fontSize: "1rem",
                },
                "& .Mui-selected": {
                  color: "#ffffff", // Ensure selected tab also stays white
                },
              }}
            >
              <Tab label="Login" />
              <Tab label="Signup" />
            </Tabs>
            {tab === 0 && <Login onSuccess={handleClose} />}
            {tab === 1 && <Singup onSuccess={handleClose} />}
          </Paper>
        </Fade>
      </Modal>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {list()}
      </Drawer>
    </Box>
  );
}
