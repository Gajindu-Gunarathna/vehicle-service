import React, { useState } from "react";
import { TextField, Button, Box, Snackbar, Alert } from "@mui/material";
import { signupUser } from "./api"; //Need to create this

function Singup({ onSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contact, setContact] = useState("");

  const [error, setError] = useState("");
  const [openSnack, setOpenSnack] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await signupUser({ name, email, password, contact });

    if (success) {
      setError("");
      setOpenSnack(true);
      onSuccess();
    } else {
      setError("Signup failed !!!. Try again. ");
    }
  };

  return (
    <>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <TextField
          fullWidth
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
          type="submit"
          sx={{
            mt: 3,
            borderRadius: 2,
            bgcolor: "#1B98E0",
            "&:hover": { bgcolor: "#1177BB" },
            fontWeight: "bold",
          }}
        >
          Sign Up
        </Button>

        {error && (
          <p style={{ color: "red", marginTop: "10px", textAlign: "center" }}>
            {error}
          </p>
        )}
      </Box>

      {/* Snackbar notification */}
      <Snackbar
        open={openSnack}
        autoHideDuration={3000}
        onClose={() => setOpenSnack(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity="success"
          sx={{ width: "100%" }}
          onClose={() => setOpenSnack(false)}
        >
          Signup successful!
        </Alert>
      </Snackbar>
    </>
  );
}

export default Signup;
