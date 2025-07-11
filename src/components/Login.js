import React, { useState } from "react";
import { loginUser } from "./api"; // import your login API function
import { TextField, Button, Box } from "@mui/material";
import { Snackbar, Alert } from "@mui/material";

function Login({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [openSnack, setOpenSnack] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // clear error on each try

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    // Admin check BEFORE backend call
    if (email === "admin@gmail.com" && password === "admin123") {
      localStorage.setItem("email", email);
      localStorage.setItem("username", email);
      localStorage.setItem("role", "admin");

      setOpenSnack(true);
      setTimeout(() => {
        onSuccess();
        window.location.reload();
      }, 1500);
      return; // stop further execution
    }

    // Normal user login
    const res = await loginUser({ email, password });

    if (res.success) {
      setError("");
      setOpenSnack(true);
      localStorage.setItem("email", email);
      localStorage.setItem("username", email);
      localStorage.setItem("role", "user");

      setTimeout(() => {
        onSuccess();
        window.location.reload();
      }, 1500);
    } else {
      setError(res.message || "Invalid email or password.");
      setOpenSnack(false);
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
          Login
        </Button>

        {/* ❌ Error Message */}
        {error && (
          <p style={{ color: "red", marginTop: "10px", textAlign: "center" }}>
            {error}
          </p>
        )}
      </Box>

      {/* ✅ Snackbar Notification */}
      <Snackbar
        open={openSnack}
        autoHideDuration={3000}
        onClose={() => setOpenSnack(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ mt: 2 }}
      >
        <Alert
          severity="success"
          sx={{ width: "100%" }}
          onClose={() => setOpenSnack(false)}
        >
          Login successful!
        </Alert>
      </Snackbar>
    </>
  );
}

export default Login;
