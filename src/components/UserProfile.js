import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { getUserByEmail, updateUser } from "./api"; // add these in api.js

export default function UserProfile() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    contact: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState("");
  const [successSnack, setSuccessSnack] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      // Fetch user data dynamically from backend
      getUserByEmail(email)
        .then((data) => {
          setUser(data);
        })
        .catch(() => {
          setError("Failed to load user data!");
        });
    }
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!user.name || !user.email || !user.contact) {
      setError("All fields are required!");
      return;
    }

    // Call API to update user data
    updateUser(user)
      .then(() => {
        setError("");
        setSuccessSnack(true);
        setEditMode(false);
      })
      .catch(() => {
        setError("Failed to update profile!");
      });
  };

  return (
    <>
      <style>
        {`
          body {
            margin: 0;
            padding: 0;
            background-color: #0A1626;
            font-family: 'Roboto', sans-serif;
            overflow: hidden;
            height: 100vh;
            width: 100vw;
          }
        `}
      </style>

      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#0A1626",
          color: "#F5F7FA",
          p: 2,
        }}
      >
        <Box
          sx={{
            maxWidth: 480,
            width: "100%",
            p: 3,
            bgcolor: "#0A1626",
            borderRadius: 3,
            boxShadow:
              "0 0 20px 4px rgba(27, 152, 224, 0.6), 0 8px 30px rgba(0,0,0,0.8)",
            color: "#F5F7FA",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              mb: 4,
              fontWeight: "bold",
              textAlign: "center",
              color: "#1B98E0",
            }}
          >
            User Profile
          </Typography>

          <TextField
            label="Name"
            name="name"
            fullWidth
            variant="filled"
            value={user.name}
            onChange={handleChange}
            disabled={!editMode}
            sx={{
              mb: 3,
              input: { color: "#F5F7FA" },
              bgcolor: "#0D1B2A",
              borderRadius: 1,
              "& .MuiInputLabel-root": { color: "#A3BFFA" },
              "& .MuiInputBase-input": {
              color: "#F5F7FA", // Normal text color
              },
              "& .Mui-disabled": {
                color: "#A3BFFA", // Label text color
                WebkitTextFillColor: "#A3BFFA", // Actual input text color when disabled
              },  

              "& .MuiFilledInput-input.Mui-disabled": {
                color: "#F5F7FA !important",
                WebkitTextFillColor: "#F5F7FA !important",
              },
              
            }}
          />

          <TextField
            label="Email"
            name="email"
            fullWidth
            variant="filled"
            value={user.email}
            onChange={handleChange}
            disabled
            sx={{
              mb: 3,
              input: { color: "#F5F7FA" },
              bgcolor: "#0D1B2A",
              borderRadius: 1,
              "& .MuiInputLabel-root": { color: "#A3BFFA" },
              "& .MuiInputBase-input": {
              color: "#F5F7FA", // Normal text color
              },
              "& .Mui-disabled": {
                color: "#A3BFFA", // Label text color
                WebkitTextFillColor: "#A3BFFA", // Actual input text color when disabled
              },  
              
              // Conditionally hide text when editMode is true
              "& .MuiFilledInput-input.Mui-disabled": {
                color: editMode ? "transparent" : "#F5F7FA",
                WebkitTextFillColor: editMode ? "transparent" : "#F5F7FA",
              },
              
            }}
          />

          <TextField
            label="Contact"
            name="contact"
            fullWidth
            variant="filled"
            value={user.contact}
            onChange={handleChange}
            disabled={!editMode}
            sx={{
              mb: 4,
              input: { color: "#F5F7FA" },
              bgcolor: "#0D1B2A",
              borderRadius: 1,
              "& .MuiInputLabel-root": { color: "#A3BFFA" },
              "& .MuiInputBase-input": {
              color: "#F5F7FA", // Normal text color
              },
              "& .Mui-disabled": {
                color: "#A3BFFA", // Label text color
                WebkitTextFillColor: "#A3BFFA", // Actual input text color when disabled
              },  
              
              "& .MuiFilledInput-input.Mui-disabled": {
                color: "#F5F7FA !important",
                WebkitTextFillColor: "#F5F7FA !important",
              },
            }}
          />

          {error && (
            <Typography
              sx={{
                color: "#FF6B6B",
                mb: 2,
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              {error}
            </Typography>
          )}

          {!editMode ? (
            <Button
              fullWidth
              variant="contained"
              onClick={() => setEditMode(true)}
              sx={{
                bgcolor: "#1B98E0",
                "&:hover": { bgcolor: "#1177BB" },
                fontWeight: "bold",
              }}
            >
              Edit Profile
            </Button>
          ) : (
            <Button
              fullWidth
              variant="contained"
              onClick={handleSave}
              sx={{
                bgcolor: "#1B98E0",
                "&:hover": { bgcolor: "#1177BB" },
                fontWeight: "bold",
              }}
            >
              Save Changes
            </Button>
          )}

          <Snackbar
            open={successSnack}
            autoHideDuration={3000}
            onClose={() => setSuccessSnack(false)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              severity="success"
              onClose={() => setSuccessSnack(false)}
              sx={{ width: "100%" }}
            >
              Profile updated successfully!
            </Alert>
          </Snackbar>
        </Box>
      </Box>
    </>
  );
}
