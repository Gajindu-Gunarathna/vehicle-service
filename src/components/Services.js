import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import {
  Box,
  Button,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Modal,
  TextField,
  Snackbar,
  Alert,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  fetchServices,
  uploadImage,
  createService,
  updateService,
  deleteService,
} from "./api";

export default function Services() {
  const role = localStorage.getItem("role") || "user";

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [snack, setSnack] = useState({
    open: false,
    severity: "success",
    message: "",
  });
  const [currentService, setCurrentService] = useState({
    id: null,
    name: "",
    desc: "",
    price: "",
    imageFile: null,
    imageUrl: "",
  });

  const [searchTerm, setSearchTerm] = useState("");

  // Confirmation modal states
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  // For view-only modal
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const loadServices = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchServices();
      setServices(data);
    } catch {
      showSnack("Failed to load services", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const showSnack = (message, severity = "success") => {
    setSnack({ open: true, message, severity });
  };

  const handleNewService = () => {
    setCurrentService({
      id: null,
      name: "",
      desc: "",
      price: "",
      imageFile: null,
      imageUrl: "",
    });
    setModalOpen(true);
  };

  const handleEditService = (service) => {
    setCurrentService({
      ...service,
      imageFile: null,
      imageUrl: service.imageUrl || "",
    });
    setModalOpen(true);
  };

  const handleViewService = (service) => {
    setCurrentService(service);
    setViewModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setCurrentService({ ...currentService, imageFile: files[0] });
    } else {
      setCurrentService({ ...currentService, [name]: value });
    }
  };

  const handleSave = async () => {
    if (
      !currentService.name.trim() ||
      !currentService.desc.trim() ||
      !currentService.price.trim()
    ) {
      showSnack("Name, Description, and Price are required", "error");
      return;
    }
    setLoading(true);
    try {
      let imageUrl = currentService.imageUrl;
      if (currentService.imageFile) {
        imageUrl = await uploadImage(currentService.imageFile);
      }
      if (!imageUrl) {
        imageUrl = "/uploads/NoImageAvailable.jpg";
      }

      const payload = {
        id: currentService.id,
        name: currentService.name,
        desc: currentService.desc,
        price: currentService.price,
        imageUrl,
      };

      if (currentService.id) {
        await updateService(payload);
        showSnack("Service updated!");
      } else {
        await createService(payload);
        showSnack("Service added!");
      }

      setModalOpen(false);
      loadServices();
    } catch {
      showSnack("Failed to save service", "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
  };

  const handleDelete = (id) => {
    setServiceToDelete(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    setConfirmOpen(false);
    if (!serviceToDelete) return;
    try {
      await deleteService(serviceToDelete);
      showSnack("Service deleted!");
      loadServices();
    } catch {
      showSnack("Failed to delete service", "error");
    } finally {
      setServiceToDelete(null);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const displayPrice = (price, limit = 10) => {
    if (!price) return "";
    return price.length > limit ? price.slice(0, limit) + "…" : price;
  };

  const getImageUrl = (s) => {
    if (!s.imageUrl)
      return "http://localhost:8081/service-app/uploads/NoImageAvailable.jpg";
    return s.imageUrl.startsWith("http")
      ? s.imageUrl
      : `http://localhost:8081/service-app${s.imageUrl}`;
  };

  // Parse description into rows and columns (assume tab-separated lines)
  const parseDescriptionToTable = (desc) => {
    if (!desc) return [];
    return desc.split("\n").map((line) => line.split("\t")); // or use .split(',') if comma separated
  };

  // Inside Services function, before return:
  const descTableData = parseDescriptionToTable(currentService.desc);

  return (
    <Box sx={{ p: 3, minHeight: "100vh", bgcolor: "#0A1626" }}>
      <Box sx={{ mb: 2, display: "flex", gap: 2, alignItems: "center" }}>
        {role === "admin" && (
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleNewService}
              disabled={loading}
            >
              New Service
            </Button>
            <Button
              variant={deleteMode ? "outlined" : "contained"}
              color="error"
              startIcon={<DeleteIcon />}
              onClick={toggleDeleteMode}
              disabled={loading}
            >
              {deleteMode ? "Cancel Delete" : "Delete Service"}
            </Button>
          </Box>
        )}

        <Box sx={{ marginLeft: "auto", width: 300 }}>
          <TextField
            placeholder="Search services..."
            value={searchTerm}
            onChange={handleSearchChange}
            size="small"
            fullWidth
            InputProps={{
              sx: {
                bgcolor: "#13293D",
                color: "#fff",
                "& .MuiInputBase-input": { color: "#fff" },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#1F3B57",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#4CAF50",
                },
              },
            }}
          />
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 3,
        }}
      >
        {filteredServices.map((s) => (
          <Card
            key={s.id}
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              bgcolor: "#13293D",
              color: "#fff",
              border: "1px solid #1F3B57",
              borderRadius: 2,
              overflow: "hidden",
              position: "relative",
              minHeight: 140,
              animation: deleteMode ? "shake 0.5s infinite" : "none",
            }}
          >
            {deleteMode && role === "admin" && (
              <IconButton
                color="error"
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  zIndex: 20,
                  bgcolor: "#0A1626",
                  borderTopRightRadius: 8,
                  borderBottomLeftRadius: 8,
                  "&:hover": { bgcolor: "#FF5252" },
                  pointerEvents: "auto",
                  animation: "none",
                }}
                onClick={() => handleDelete(s.id)}
              >
                <DeleteIcon />
              </IconButton>
            )}

            <CardMedia
              component="img"
              image={`${getImageUrl(s)}?t=${Date.now()}`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "http://localhost:8081/service-app/uploads/NoImageAvailable.jpg";
              }}
              alt={s.name}
              sx={{ width: 120, height: 120, objectFit: "cover", m: 1 }}
            />

            <CardContent sx={{ flexGrow: 1 }}>
              <Tooltip title={s.name}>
                <Typography
                  variant="h6"
                  color="#A3BFFA"
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "calc(100% - 40px)",
                  }}
                >
                  {displayName(s.name)}
                </Typography>
              </Tooltip>

              <Tooltip title={s.price}>
                <Typography noWrap sx={{ fontWeight: "bold" }}>
                  Price: {displayPrice(s.price)}
                </Typography>
              </Tooltip>
            </CardContent>

            {!deleteMode && (
              <>
                {role === "admin" ? (
                  <IconButton
                    sx={{ position: "absolute", bottom: 8, right: 8 }}
                    onClick={() => handleEditService(s)}
                  >
                    <EditIcon sx={{ color: "#A3BFFA" }} />
                  </IconButton>
                ) : (
                  <IconButton
                    sx={{ position: "absolute", bottom: 8, right: 8 }}
                    onClick={() => handleViewService(s)}
                  >
                    <VisibilityIcon sx={{ color: "#A3BFFA" }} />
                  </IconButton>
                )}
              </>
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
            {currentService.id ? "Update Service" : "New Service"}
          </Typography>

          <TextField
            label="Name"
            name="name"
            value={currentService.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ style: { color: "#A3BFFA" } }}
            InputProps={{
              style: { color: "#F5F7FA", backgroundColor: "#0D1B2A" },
            }}
          />

          <TextField
            label="Description"
            name="desc"
            value={currentService.desc}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            margin="normal"
            InputLabelProps={{ style: { color: "#A3BFFA" } }}
            InputProps={{
              style: { color: "#F5F7FA", backgroundColor: "#0D1B2A" },
            }}
          />

          <TextField
            label="Price"
            name="price"
            value={currentService.price}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ style: { color: "#A3BFFA" } }}
            InputProps={{
              style: { color: "#F5F7FA", backgroundColor: "#0D1B2A" },
            }}
          />

          <Box mt={2}>
            <input
              type="file"
              accept="image/*"
              onChange={handleChange}
              style={{ color: "#fff" }}
            />
            {currentService.imageUrl && !currentService.imageFile && (
              <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
                Current Image: {currentService.imageUrl.split("/").pop()}
              </Typography>
            )}
            {currentService.imageFile && (
              <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
                New Image: {currentService.imageFile.name}
              </Typography>
            )}
          </Box>

          <Box mt={3} display="flex" justifyContent="space-between">
            <Button variant="contained" onClick={handleSave} disabled={loading}>
              {currentService.id ? "Update" : "Add"}
            </Button>
            <Button
              variant="outlined"
              onClick={() => setModalOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* View-only Modal */}
      <Modal open={viewModalOpen} onClose={() => setViewModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 800,
            maxHeight: "60vh",
            bgcolor: "#0A1626",
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
            color: "#fff",
            overflowY: "auto",
          }}
        >
          {/* Name Section */}
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", mb: 1, color: "#A3BFFA" }}
          >
            {currentService.name}
          </Typography>

          {/* Price Section - BIGGER and with margin */}
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", mb: 3, color: "#4CAF50" }}
          >
            Price: {currentService.price}
          </Typography>

          {/* Image Section */}
          <Box
            component="img"
            src={
              currentService.imageUrl ||
              "https://via.placeholder.com/300x200?text=No+Image"
            }
            alt={currentService.name}
            sx={{
              maxWidth: 300,
              height: "auto",
              borderRadius: 1,
              mb: 3,
              objectFit: "contain",
            }}
          />

          {/* Description Table Section */}
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
            Description Details
          </Typography>
          <TableContainer
            component={Paper}
            sx={{ bgcolor: "#0A1626", color: "#fff", mb: 3 }}
          >
            <Table size="small" aria-label="description table">
              <TableHead>
                <TableRow>
                  {descTableData[0]?.map((headCell, idx) => (
                    <TableCell
                      key={idx}
                      sx={{ color: "#A3BFFA", fontWeight: "bold" }}
                    >
                      {headCell}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {descTableData.slice(1).map((row, idx) => (
                  <TableRow key={idx}>
                    {row.map((cell, cIdx) => (
                      <TableCell key={cIdx} sx={{ color: "#fff" }}>
                        {cell}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Close Button */}
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="outlined"
              onClick={() => setViewModalOpen(false)}
              color="primary"
            >
              Close
            </Button>
          </Box>
        </Box>
      </Modal>

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
            Are you sure you want to delete this service?
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
        autoHideDuration={4000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
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
