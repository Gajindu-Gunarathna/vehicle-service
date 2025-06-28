import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

export default function Appbar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#010a17", // dark ambient
          boxShadow: "0 4px 12px rgba(0,0,0,0.6)",
          borderBottom: "1px solid #1B263B",
        }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            sx={{
              mr: 2,
              "&:hover": {
                color: "#1B98E0",
              },
            }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: "bold",
              letterSpacing: 1,
              cursor: "pointer",
              color: "#E0E1DD",
              "&:hover": {
                color: "#1B98E0",
              },
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
              borderRadius: "4px", // small rounded corners
              transition: "0.3s",
              "&:hover": {
                backgroundColor: "#1B98E0",
                color: "#ffffff",
              },
            }}
          >
            Login
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
