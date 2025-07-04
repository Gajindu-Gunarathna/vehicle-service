        import React, { useEffect, useState } from "react";
        import {
        Box, Button, Card, Typography, IconButton, Modal,
        TextField, Snackbar, Alert,
        } from "@mui/material";
        import {
        Add as AddIcon,
        Edit as EditIcon,
        Delete as DeleteIcon,
        Visibility as VisibilityIcon
        } from "@mui/icons-material";
        import {
        fetchServiceCenters,
        createServiceCenter,
        updateServiceCenter,
        deleteServiceCenter,
        } from "./api"; 

        export default function ServiceCenters(){
            const role = localStorage.getItem("role") || "user";

            // States for service centers, modals, and forms
            const [centers, setCenters] = useState([]); // All service centers
            const [modalOpen, setModalOpen] = useState(false); // For add/edit modal
            const [viewOpen, setViewOpen] = useState(false); // For view modal
            const [confirmOpen, setConfirmOpen] = useState(false); // For delete confirm
            const [selected, setSelected] = useState(null); // Center selected to view
            const [deleteId, setDeleteId] = useState(null); // ID of center to delete

            const [loading, setLoading] = useState(false);
            
            // Snackbar for showing feedback messages
            const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

            // State for the form fields
            const [centerForm, setCenterForm] = useState({
                id: null,
                name: "",
                address: "",
                contact: ""
            });
            
            // Load service centers from backend on mount
            useEffect(() => {
                const loadCenters = async () => {
                setLoading(true);
                try {
                    const data = await fetchServiceCenters();
                    setCenters(data);
                } catch {
                    showSnack("Failed to load service centers", "error");
                } finally {
                    setLoading(false);
                }
                };
                loadCenters();
            }, []);


            // Show a message to user
            const showSnack = (message, severity = "success") =>
                setSnack({ open: true, message, severity });

            // Handle form input changes
            const handleChange = (e) => {
                const { name, value } = e.target;
                setCenterForm({ ...centerForm, [name]: value });
            };

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
                if (!name.trim() || !address.trim() || !contact.trim()) {
                return showSnack("All fields are required", "error");
                }
                
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
                    const refreshed = await fetchServiceCenters();
                    setCenters(refreshed);
                } catch {
                    showSnack("Error saving service center", "error");
                } finally {
                    setLoading(false);
                }
            };

            // Ask for delete confirmation
            const handleDelete = (id) => {
                setDeleteId(id);
                setConfirmOpen(true);
            };

            // Perform delete after confirmation
            const confirmDelete = async () => {
                setConfirmOpen(false);
                if (!deleteId) return;
            
                setLoading(true);
                try {
                await deleteServiceCenter(deleteId);
                showSnack("Deleted successfully");
                const refreshed = await fetchServiceCenters();
                setCenters(refreshed);
                } catch {
                showSnack("Failed to delete", "error");
                } finally {
                setDeleteId(null);
                setLoading(false);
                }
            };

            return (
                <Box sx={{  p: 3, minHeight: "100vh", bgcolor: "linear-gradient(to right, #0F2027, #203A43, #2C5364)" }}>
                <Typography variant="h5" mb={2}>Service Centers</Typography>
            
                {role === "admin" && (
                    <Button variant="contained" startIcon={<AddIcon />} onClick={handleNew}>
                    Add Service Center
                    </Button>
                )}
            
                <Box display="grid" gap={2} mt={2}>
                    {centers.map((center) => (
                    <Card key={center.id} sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
                        <Box>
                        <Typography variant="h6">{center.name}</Typography>
                        <Typography variant="body2">📍 {center.address}</Typography>
                        <Typography variant="body2">📞 {center.contact}</Typography>
                        </Box>
            
                        <Box>
                        {role === "admin" ? (
                            <>
                            <IconButton onClick={() => handleEdit(center)}><EditIcon /></IconButton>
                            <IconButton onClick={() => handleDelete(center.id)}><DeleteIcon /></IconButton>
                            </>
                        ) : (
                            <IconButton onClick={() => { setSelected(center); setViewOpen(true); }}>
                            <VisibilityIcon />
                            </IconButton>
                        )}
                        </Box>
                    </Card>
                    ))}
                </Box>
            
                {/* Add/Edit Modal */}
                <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                    <Box sx={{
                    p: 3, bgcolor: "#fff", position: "absolute", top: "50%", left: "50%",
                    transform: "translate(-50%, -50%)", width: 400, borderRadius: 2
                    }}>
                    <Typography variant="h6" mb={2}>
                        {centerForm.id ? "Edit" : "New"} Service Center
                    </Typography>
                    <TextField label="Name" name="name" fullWidth value={centerForm.name} onChange={handleChange} margin="normal" />
                    <TextField label="Address" name="address" fullWidth value={centerForm.address} onChange={handleChange} margin="normal" />
                    <TextField label="Contact" name="contact" fullWidth value={centerForm.contact} onChange={handleChange} margin="normal" />
                    <Box mt={2} display="flex" justifyContent="space-between">
                        <Button onClick={handleSave} variant="contained" disabled={loading}>Save</Button>
                        <Button onClick={() => setModalOpen(false)} variant="outlined" disabled={loading}>Cancel</Button>
                    </Box>
                    </Box>
                </Modal>
            
                {/* View Modal */}
                <Modal open={viewOpen} onClose={() => setViewOpen(false)}>
                    <Box sx={{
                    p: 3, bgcolor: "#fff", position: "absolute", top: "50%", left: "50%",
                    transform: "translate(-50%, -50%)", width: 400, borderRadius: 2
                    }}>
                    <Typography variant="h6">{selected?.name}</Typography>
                    <Typography>📍 {selected?.address}</Typography>
                    <Typography>📞 {selected?.contact}</Typography>
                    <Box mt={2} textAlign="right">
                        <Button onClick={() => setViewOpen(false)} variant="outlined">Close</Button>
                    </Box>
                    </Box>
                </Modal>
            
                {/* Confirm Delete Modal */}
                <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                    <Box sx={{
                    p: 3, bgcolor: "#fff", position: "absolute", top: "50%", left: "50%",
                    transform: "translate(-50%, -50%)", width: 300, borderRadius: 2, textAlign: "center"
                    }}>
                    <Typography>Delete this service center?</Typography>
                    <Box mt={2} display="flex" justifyContent="space-around">
                        <Button color="error" variant="contained" onClick={confirmDelete}>Delete</Button>
                        <Button variant="outlined" onClick={() => setConfirmOpen(false)}>Cancel</Button>
                    </Box>
                    </Box>
                </Modal>
            
                <Snackbar
                    open={snack.open}
                    autoHideDuration={3000}
                    onClose={() => setSnack({ ...snack, open: false })}
                >
                    <Alert severity={snack.severity} onClose={() => setSnack({ ...snack, open: false })}>
                    {snack.message}
                    </Alert>
                </Snackbar>
                </Box>
            );
        }

