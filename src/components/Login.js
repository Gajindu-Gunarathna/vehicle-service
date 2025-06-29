import React, { useState } from "react";
import { loginUser } from "./api"; // import your login API function
import { TextField, Button, Box } from "@mui/material";
import { Snackbar, Alert } from "@mui/material";


function Login({onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [openSnack, setOpenSnack] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const success = await loginUser({ email, password });

    if (success) {
      setError("");
      setOpenSnack(true); // show snackbar first
      console.log("Success");
      setTimeout(() => {
        onSuccess(); // ❗ call this *after* Snackbar is visible
      }, 1500);
      // TODO: redirect or update UI after login
    } else {
      console.log("Login failed");
      setError("Invalid email or password.");
    }
  };

  return (
    <>
    <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
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

      {error && (
        <p style={{ color: "red", marginTop: "10px", textAlign: "center" }}>
          {error}
        </p>
      )}
    </Box>
    {/*  Snackbar Notification */}
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
