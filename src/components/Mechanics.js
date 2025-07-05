import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Button,
  Card,
  CardMedia,
  Typography,
  IconButton,
  Modal,
  TextField,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
  Tooltip,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import {
  fetchMechanics,
  createMechanic,
  updateMechanic,
  deleteMechanic,
  uploadImage,
  fetchServiceCenters,
  fetchServices, // new function to fetch service names
  searchMechanics,
} from "./api";

export default function Mechanics() {
  const role = localStorage.getItem("role") || "user";

  const [mechanics, setMechanics] = useState([]);
  const [serviceCenters, setServiceCenters] = useState([]);
  const [services, setServices] = useState([]); // for specialization dropdown

  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);

  const [snack, setSnack] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const [currentMechanic, setCurrentMechanic] = useState({
    id: null,
    name: "",
    skillset: "",
    availability: true,
    center_id: "",
    imageFile: null,
    imageUrl: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [mechanicToDelete, setMechanicToDelete] = useState(null);

  const loadMechanics = useCallback(async () => {
    setLoading(true);
    try {
      let data;
      if (searchTerm.trim()) {
        data = await searchMechanics(searchTerm, searchType);
      } else if (availabilityFilter !== "all") {
        data = await fetchMechanics(availabilityFilter === "available");
      } else {
        data = await fetchMechanics();
      }
      setMechanics(data);
    } catch {
      showSnack("Failed to load mechanics", "error");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, searchType, availabilityFilter]);

  useEffect(() => {
    loadMechanics();

    const loadServicesAndCenters = async () => {
      try {
        const centers = await fetchServiceCenters();
        setServiceCenters(centers);
        const svc = await fetchServices(); // fetch service names
        setServices(svc);
      } catch {
        showSnack("Failed to load services or centers", "error");
      }
    };
    loadServicesAndCenters();
  }, [loadMechanics]);

  const showSnack = (message, severity = "success") => {
    setSnack({ open: true, message, severity });
  };

  const handleNewMechanic = () => {
    setCurrentMechanic({
      id: null,
      name: "",
      skillset: "",
      availability: true,
      center_id: "",
      imageFile: null,
      imageUrl: "",
    });
    setModalOpen(true);
  };

  const handleEditMechanic = (mechanic) => {
    setCurrentMechanic({
      id: mechanic.id,
      name: mechanic.name,
      skillset: mechanic.skillset,
      availability:
        mechanic.availability === 1 || mechanic.availability === true,
      center_id: mechanic.center_id || "",
      imageFile: null,
      imageUrl: mechanic.image_url || "",
    });
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setCurrentMechanic({ ...currentMechanic, [name]: checked });
    } else if (type === "file") {
      setCurrentMechanic({ ...currentMechanic, imageFile: files[0] });
    } else {
      setCurrentMechanic({ ...currentMechanic, [name]: value });
    }
  };

  const handleSave = async () => {
    if (!currentMechanic.name.trim() || !currentMechanic.skillset.trim()) {
      showSnack("Name and Specialization are required", "error");
      return;
    }
    if (!currentMechanic.center_id) {
      showSnack("Please select a service center", "error");
      return;
    }

    setLoading(true);
    try {
      let imageUrl = currentMechanic.imageUrl;
      if (currentMechanic.imageFile) {
        imageUrl = await uploadImage(currentMechanic.imageFile);
      }
      if (!imageUrl) {
        imageUrl = "/uploads/NoImageAvailable.jpg";
      }

      const payload = {
        id: currentMechanic.id,
        name: currentMechanic.name,
        skillset: currentMechanic.skillset,
        availability: currentMechanic.availability ? 1 : 0,
        center_id: currentMechanic.center_id,
        image_url: imageUrl, // <-- Correct field name
      };

      if (currentMechanic.id) {
        await updateMechanic(payload);
        showSnack("Mechanic updated!");
      } else {
        await createMechanic(payload);
        showSnack("Mechanic added!");
      }

      setModalOpen(false);
      loadMechanics();
    } catch {
      showSnack("Failed to save mechanic", "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
  };

  const handleDelete = (id) => {
    setMechanicToDelete(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    setConfirmOpen(false);
    if (!mechanicToDelete) return;
    try {
      await deleteMechanic(mechanicToDelete);
      showSnack("Mechanic deleted!");
      loadMechanics();
    } catch {
      showSnack("Failed to delete mechanic", "error");
    } finally {
      setMechanicToDelete(null);
    }
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleSearchTypeChange = (e) => setSearchType(e.target.value);

  const handleAvailabilityFilterChange = async (e) => {
    setAvailabilityFilter(e.target.value);
    await loadMechanics();
  };

  // Character limit with tooltip
  const displayName = (name, limit = 14) => {
    let count = 0;
    let result = "";

    for (const ch of name) {
      const isUpper = ch >= "A" && ch <= "Z";
      count += isUpper ? 2 : 1;
      if (count > limit) {
        result += "…";
        break;
      }
      result += ch;
    }
    return result;
  };

  const getImageUrl = (m) => {
    if (!m.image_url)
      return "http://localhost:8081/service-app/uploads/NoImageAvailable.jpg";
    return m.image_url.startsWith("http")
      ? m.image_url
      : `http://localhost:8081/service-app/${m.image_url}`;
  };

  return (
    <Box sx={{ p: 3, minHeight: "100vh", bgcolor: "#0A1626" }}>
      {/* Top controls: Left - Create, Delete, Availability; Right - Search */}
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Left Controls */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          {role === "admin" && (
            <>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleNewMechanic}
                disabled={loading}
              >
                New Mechanic
              </Button>
              <Button
                variant={deleteMode ? "outlined" : "contained"}
                color="error"
                startIcon={<DeleteIcon />}
                onClick={toggleDeleteMode}
                disabled={loading}
              >
                {deleteMode ? "Cancel Delete" : "Delete Mechanic"}
              </Button>
            </>
          )}

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel sx={{ color: "#A3BFFA" }}>Availability</InputLabel>
            <Select
              value={availabilityFilter}
              onChange={handleAvailabilityFilterChange}
              label="Availability"
              sx={{
                bgcolor: "#13293D",
                color: "#fff",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#4CAF50",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#4CAF50",
                },
              }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="available">Available</MenuItem>
              <MenuItem value="unavailable">Unavailable</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Right Controls */}
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel sx={{ color: "#A3BFFA" }}>Search By</InputLabel>
            <Select
              value={searchType}
              onChange={handleSearchTypeChange}
              label="Search By"
              sx={{
                bgcolor: "#13293D",
                color: "#fff",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#4CAF50",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#4CAF50",
                },
              }}
            >
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="skillset">Specialization</MenuItem>
            </Select>
          </FormControl>

          <TextField
            placeholder={`Search mechanics by ${searchType}...`}
            value={searchTerm}
            onChange={handleSearchChange}
            size="small"
            sx={{
              width: 300,
              bgcolor: "#13293D",
              color: "#fff",
              "& .MuiInputBase-input": { color: "#fff" },
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#4CAF50" },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#4CAF50",
              },
              borderRadius: 1,
            }}
          />
        </Box>
      </Box>

      {/* Mechanics Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: 3,
        }}
      >
        {mechanics.map((m) => (
          <Card
            key={m.id}
            sx={{
              bgcolor: "#13293D",
              color: "#fff",
              borderRadius: 2,
              overflow: "hidden",
              position: "relative",
              animation: deleteMode ? "shake 0.5s infinite" : "none",
              textAlign: "center",
              minHeight: 270,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              p: 1,
            }}
          >
            {deleteMode && role === "admin" && (
              <IconButton
                color="error"
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  bgcolor: "#0A1626",
                  borderTopRightRadius: 8,
                  borderBottomLeftRadius: 8,
                  "&:hover": { bgcolor: "#FF5252" },
                  pointerEvents: "auto",
                  animation: "none",
                }}
                onClick={() => handleDelete(m.id)}
              >
                <DeleteIcon />
              </IconButton>
            )}

            <CardMedia
              component="img"
              image={`${getImageUrl(m)}?t=${Date.now()}`}
              alt={m.name}
              sx={{
                width: 120,
                height: 120,
                objectFit: "cover",
                borderRadius: 1,
                mb: 1,
                mx: "auto",
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "http://localhost:8081/service-app/uploads/NoImageAvailable.jpg";
              }}
            />

            <Tooltip title={m.name}>
              <Typography
                variant="h6"
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "100%",
                }}
              >
                {displayName(m.name)}
              </Typography>
            </Tooltip>

            <Typography
              variant="body2"
              sx={{
                color: m.availability ? "#4CAF50" : "#FF5252",
                fontWeight: "bold",
                mt: 0.5,
              }}
            >
              {m.availability ? "Available ✅" : "Unavailable ❌"}
            </Typography>

            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {serviceCenters.find((c) => c.id === m.center_id)?.name ||
                "Center N/A"}
            </Typography>

            <Tooltip title={m.skillset}>
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "100%",
                  mt: 0.5,
                }}
              >
                {displayName(m.skillset)}
              </Typography>
            </Tooltip>

            {!deleteMode && role === "admin" && (
              <IconButton
                sx={{ position: "absolute", bottom: 8, right: 8 }}
                onClick={() => handleEditMechanic(m)}
              >
                <EditIcon sx={{ color: "#A3BFFA" }} />
              </IconButton>
            )}
          </Card>
        ))}
      </Box>

      {/* Modal for Add/Update */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 350,
            bgcolor: "#0A1626",
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
            color: "#fff",
          }}
        >
          <Typography variant="h6" mb={2}>
            {currentMechanic.id ? "Update Mechanic" : "New Mechanic"}
          </Typography>

          <TextField
            label="Name"
            name="name"
            value={currentMechanic.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ style: { color: "#A3BFFA" } }}
            InputProps={{
              style: { color: "#F5F7FA", backgroundColor: "#0D1B2A" },
            }}
          />

          {/* Specialization as dropdown */}
          <FormControl fullWidth margin="normal">
            <InputLabel sx={{ color: "#A3BFFA" }}>Specialization</InputLabel>
            <Select
              name="skillset"
              value={currentMechanic.skillset}
              onChange={handleChange}
              sx={{
                color: "#F5F7FA",
                backgroundColor: "#0D1B2A",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#1F3B57",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#4CAF50",
                },
              }}
              label="Specialization"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {services.map((s) => (
                <MenuItem key={s.id} value={s.name}>
                  {s.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel sx={{ color: "#A3BFFA" }}>Service Center</InputLabel>
            <Select
              name="center_id"
              value={currentMechanic.center_id}
              onChange={handleChange}
              sx={{
                color: "#F5F7FA",
                backgroundColor: "#0D1B2A",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#1F3B57",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#4CAF50",
                },
              }}
              label="Service Center"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {serviceCenters.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Checkbox
                checked={currentMechanic.availability}
                onChange={handleChange}
                name="availability"
                sx={{ color: "#4CAF50" }}
              />
            }
            label="Available"
          />

          <Box mt={2}>
            <input
              type="file"
              accept="image/*"
              onChange={handleChange}
              style={{ color: "#fff" }}
            />
            {currentMechanic.imageUrl && !currentMechanic.imageFile && (
              <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
                Current Image: {currentMechanic.imageUrl.split("/").pop()}
              </Typography>
            )}
            {currentMechanic.imageFile && (
              <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
                New Image: {currentMechanic.imageFile.name}
              </Typography>
            )}
          </Box>

          {currentMechanic.imageFile && (
            <Typography>{currentMechanic.imageFile.name}</Typography>
          )}

          <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setModalOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Confirm delete modal */}
      {/* Confirmation Modal for Delete */}
      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "#13293D",
            p: 2,
            borderRadius: 2,
            boxShadow: 24,
            color: "#fff",
            width: 280,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" mb={2}>
            Confirm Delete ❓
          </Typography>
          <Typography mb={3}>
            Are you sure you want to delete this product?
          </Typography>
          <Box display="flex" justifyContent="space-around">
            <Button variant="contained" color="error" onClick={confirmDelete}>
              Yes, Delete
            </Button>
            <Button variant="outlined" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnack({ ...snack, open: false })}
          severity={snack.severity}
          sx={{ width: "100%" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>

      <style>{`
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-3px) rotate(-2deg); }
    50% { transform: translateX(3px) rotate(2deg); }
    75% { transform: translateX(-3px) rotate(-2deg); }
  }
`}</style>
    </Box>
  );
}
