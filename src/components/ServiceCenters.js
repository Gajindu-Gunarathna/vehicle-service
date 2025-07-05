import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Typography,
  IconButton,
  Modal,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import {
  fetchServiceCenters,
  createServiceCenter,
  updateServiceCenter,
  deleteServiceCenter,
} from "./api";

export default function ServiceCenters() {
  const role = localStorage.getItem("role") || "user";
  const [centers, setCenters] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [centerForm, setCenterForm] = useState({
    id: null,
    name: "",
    address: "",
    contact: "",
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        setCenters(await fetchServiceCenters());
      } catch {
        showSnack("Failed to load service centers", "error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const showSnack = (msg, severity = "success") =>
    setSnack({ open: true, message: msg, severity });

  const handleChange = (e) =>
    setCenterForm({ ...centerForm, [e.target.name]: e.target.value });

  const handleNew = () => {
    setCenterForm({ id: null, name: "", address: "", contact: "" });
    setModalOpen(true);
  };

  const handleEdit = (center) => {
    setCenterForm(center);
    setModalOpen(true);
  };

  const handleSave = async () => {
    const { id, name, address, contact } = centerForm;
    if (!name.trim() || !address.trim() || !contact.trim())
      return showSnack("All fields are required", "error");

    setLoading(true);
    try {
      if (id) {
        await updateServiceCenter(centerForm);
        showSnack("Service Center updated");
      } else {
        await createServiceCenter(centerForm);
        showSnack("Service Center created");
      }
      setModalOpen(false);
      setCenters(await fetchServiceCenters());
    } catch {
      showSnack("Error saving service center", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    setConfirmOpen(false);
    if (!deleteId) return;
    setLoading(true);
    try {
      await deleteServiceCenter(deleteId);
      showSnack("Deleted successfully");
      setCenters(await fetchServiceCenters());
    } catch {
      showSnack("Failed to delete", "error");
    } finally {
      setDeleteId(null);
      setLoading(false);
    }
  };

  const glassStyle = {
    p: 3,
    bgcolor: "rgba(255, 255, 255, 0.45)",
    backdropFilter: "blur(14px)",
    borderRadius: 3,
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
    color: "#000",
    border: "1px solid rgba(255, 255, 255, 0.4)",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };

  return (
    <Box sx={{ p: 3, minHeight: "100vh", bgcolor: "#0F2027" }}>
      <Typography variant="h5" mb={2} sx={{ color: "#ffffff" }}>
        Service Centers
      </Typography>

      {role === "admin" && (
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleNew}>
          Add Service Center
        </Button>
      )}

      <Box display="grid" gap={2} mt={2}>
        {centers.map((center) => (
          <Card
            key={center.id}
            sx={{ display: "flex", justifyContent: "space-between", p: 2 }}
          >
            <Box>
              <Typography variant="h6">{center.name}</Typography>
              <Typography variant="body2">📍 {center.address}</Typography>
              <Typography variant="body2">📞 {center.contact}</Typography>
            </Box>
            <Box>
              {role === "admin" ? (
                <>
                  <IconButton onClick={() => handleEdit(center)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(center.id)}>
                    <DeleteIcon />
                  </IconButton>
                </>
              ) : (
                <IconButton
                  onClick={() => {
                    setSelected(center);
                    setViewOpen(true);
                  }}
                >
                  <VisibilityIcon />
                </IconButton>
              )}
            </Box>
          </Card>
        ))}
      </Box>

      {/* Add/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={{ ...glassStyle, width: 400 }}>
          <Typography variant="h6" mb={2}>
            {centerForm.id ? "Edit" : "New"} Service Center
          </Typography>
          <TextField
            label="Name"
            name="name"
            fullWidth
            value={centerForm.name}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            label="Address"
            name="address"
            fullWidth
            value={centerForm.address}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            label="Contact"
            name="contact"
            fullWidth
            value={centerForm.contact}
            onChange={handleChange}
            margin="normal"
          />
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button onClick={handleSave} variant="contained" disabled={loading}>
              Save
            </Button>
            <Button
              onClick={() => setModalOpen(false)}
              variant="outlined"
              sx={{
                color: "#333",
                borderColor: "#aaa",
                "&:hover": {
                  bgcolor: "#e0e0e0",
                  borderColor: "#888",
                },
              }}
              disabled={loading}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* View Modal */}
      <Modal open={viewOpen} onClose={() => setViewOpen(false)}>
        <Box sx={{ ...glassStyle, width: 400 }}>
          <Typography variant="h6">{selected?.name}</Typography>
          <Typography>📍 {selected?.address}</Typography>
          <Typography>📞 {selected?.contact}</Typography>
          <Box mt={2} textAlign="right">
            <Button
              onClick={() => setViewOpen(false)}
              variant="outlined"
              sx={{
                color: "#333",
                borderColor: "#aaa",
                "&:hover": {
                  bgcolor: "#e0e0e0",
                  borderColor: "#888",
                },
              }}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Confirm Delete Modal */}
      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <Box sx={{ ...glassStyle, width: 300, textAlign: "center" }}>
          <Typography>Delete this service center?</Typography>
          <Box mt={2} display="flex" justifyContent="space-around">
            <Button
              variant="contained"
              sx={{ bgcolor: "#ff1744", "&:hover": { bgcolor: "#d50000" } }}
              onClick={confirmDelete}
            >
              Delete
            </Button>
            <Button
              variant="outlined"
              sx={{
                color: "#333",
                borderColor: "#aaa",
                "&:hover": {
                  bgcolor: "#e0e0e0",
                  borderColor: "#888",
                },
              }}
              onClick={() => setConfirmOpen(false)}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
      >
        <Alert
          severity={snack.severity}
          onClose={() => setSnack({ ...snack, open: false })}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
