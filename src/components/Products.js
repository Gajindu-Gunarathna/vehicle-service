import React, { useEffect, useState } from "react";
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
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  fetchProducts,
  uploadImage,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./api";

export default function Products() {
  const role = localStorage.getItem("role") || "user";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [deletingIds, setDeletingIds] = useState([]);
  const [snack, setSnack] = useState({
    open: false,
    severity: "success",
    message: "",
  });
  const [currentProduct, setCurrentProduct] = useState({
    id: null,
    name: "",
    description: "",
    availability: true,
    imageFile: null,
    imageUrl: "",
  });

  const [searchTerm, setSearchTerm] = useState("");

  // Confirmation modal states
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // For view-only modal for users
  const [viewModalOpen, setViewModalOpen] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch {
        showSnack("Failed to load products", "error");
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const showSnack = (message, severity = "success") => {
    setSnack({ open: true, message, severity });
  };

  const handleNewProduct = () => {
    setCurrentProduct({
      id: null,
      name: "",
      description: "",
      availability: true,
      imageFile: null,
      imageUrl: "",
    });
    setModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setCurrentProduct({
      ...product,
      availability: product.availability === 1 || product.availability === true,
      imageFile: null,
      imageUrl: product.imageUrl || "",
    });
    setModalOpen(true);
  };

  const handleViewProduct = (product) => {
    setCurrentProduct(product);
    setViewModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setCurrentProduct({ ...currentProduct, [name]: checked });
    } else if (type === "file") {
      setCurrentProduct({ ...currentProduct, imageFile: files[0] });
    } else {
      setCurrentProduct({ ...currentProduct, [name]: value });
    }
  };

  const handleSave = async () => {
    if (!currentProduct.name.trim() || !currentProduct.description.trim()) {
      showSnack("Name and Description are required", "error");
      return;
    }
    setLoading(true);
    try {
      let imageUrl = currentProduct.imageUrl;
      if (currentProduct.imageFile) {
        imageUrl = await uploadImage(currentProduct.imageFile);
      }
      if (!imageUrl) {
        imageUrl = "/uploads/NoImageAvailable.jpg"; // 📷 Default fallback image path
      }

      const payload = {
        id: currentProduct.id,
        name: currentProduct.name,
        description: currentProduct.description,
        availability: currentProduct.availability ? 1 : 0,
        imageUrl,
      };

      if (currentProduct.id) {
        await updateProduct(payload);
        showSnack("Product updated!");
      } else {
        await createProduct(payload);
        showSnack("Product added!");
      }

      setModalOpen(false);
      const data = await fetchProducts();
      setProducts(data);
    } catch {
      showSnack("Failed to save product", "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
    setDeletingIds([]);
  };

  const handleDelete = (id) => {
    setProductToDelete(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    setConfirmOpen(false);
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete);
      showSnack("Product deleted!");
      const data = await fetchProducts();
      setProducts(data);
    } catch {
      showSnack("Failed to delete product", "error");
    } finally {
      setProductToDelete(null);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Custom character limit:
  // Each uppercase letter = 2 chars, lowercase = 1 char, stop at 14 total "units"
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

  const getImageUrl = (p) => {
    if (!p.imageUrl)
      return "http://localhost:8083/vehicle-service/uploads/NoImageAvailable.jpg";
    return p.imageUrl.startsWith("http")
      ? p.imageUrl
      : `http://localhost:8083/vehicle-service${p.imageUrl}`;
  };

  return (
    <Box sx={{ p: 3, minHeight: "100vh", bgcolor: "#0A1626" }}>
      <Box
        sx={{
          mb: 2,
          display: "flex",
          gap: 2,
          alignItems: "center",
        }}
      >
        {role === "admin" && (
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleNewProduct}
              disabled={loading}
            >
              New Product
            </Button>
            <Button
              variant={deleteMode ? "outlined" : "contained"}
              color="error"
              startIcon={<DeleteIcon />}
              onClick={toggleDeleteMode}
              disabled={loading}
            >
              {deleteMode ? "Cancel Delete" : "Delete Product"}
            </Button>
          </Box>
        )}

        <Box sx={{ marginLeft: "auto", width: 300 }}>
          <TextField
            placeholder="Search products..."
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
        {filteredProducts.map((p) => (
          <Card
            key={p.id}
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
                color={deletingIds.includes(p.id) ? "warning" : "error"}
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
                onClick={() => handleDelete(p.id)}
              >
                <DeleteIcon />
              </IconButton>
            )}

            <CardMedia
              component="img"
              image={`${getImageUrl(p)}?t=${Date.now()}`} // cache bust to force reload
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "http://localhost:8083/vehicle-service/uploads/NoImageAvailable.jpg";
              }}
              alt={p.name}
              sx={{ width: 120, height: 120, objectFit: "cover", m: 1 }}
            />

            <CardContent sx={{ flexGrow: 1 }}>
              <Tooltip title={p.name}>
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
                  {displayName(p.name)}
                </Typography>
              </Tooltip>
              <Typography
                noWrap
                sx={{
                  color: p.availability ? "#4CAF50" : "#FF5252",
                  fontWeight: "bold",
                }}
              >
                {p.availability ? "Available ✅" : "Unavailable ❌"}
              </Typography>
            </CardContent>

            {!deleteMode && (
              <>
                {role === "admin" ? (
                  <IconButton
                    sx={{ position: "absolute", bottom: 8, right: 8 }}
                    onClick={() => handleEditProduct(p)}
                  >
                    <EditIcon sx={{ color: "#A3BFFA" }} />
                  </IconButton>
                ) : (
                  <IconButton
                    sx={{ position: "absolute", bottom: 8, right: 8 }}
                    onClick={() => handleViewProduct(p)}
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
            {currentProduct.id ? "Update Product" : "New Product"}
          </Typography>

          <TextField
            label="Name"
            name="name"
            value={currentProduct.name}
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
            name="description"
            value={currentProduct.description}
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

          <FormControlLabel
            control={
              <Checkbox
                name="availability"
                checked={currentProduct.availability}
                onChange={handleChange}
                color="primary"
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
            {currentProduct.imageUrl && !currentProduct.imageFile && (
              <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
                Current Image: {currentProduct.imageUrl.split("/").pop()}
              </Typography>
            )}
            {currentProduct.imageFile && (
              <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
                New Image: {currentProduct.imageFile.name}
              </Typography>
            )}
          </Box>

          <Box mt={3} display="flex" justifyContent="space-between">
            <Button variant="contained" onClick={handleSave} disabled={loading}>
              {currentProduct.id ? "Update" : "Add"}
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

      {/* View-only Modal for users */}
      <Modal open={viewModalOpen} onClose={() => setViewModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500, // wider
            maxHeight: "60vh", // shorter height
            bgcolor: "#0A1626",
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
            color: "#fff",
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" mb={2}>
            {currentProduct.name}
          </Typography>

          <Box
            component="img"
            src={
              currentProduct.imageUrl ||
              "https://via.placeholder.com/300x200?text=No+Image"
            }
            alt={currentProduct.name}
            sx={{
              maxWidth: 300,
              height: "auto",
              borderRadius: 1,
              mb: 2,
              objectFit: "contain",
            }}
          />

          <Typography
            variant="body1"
            sx={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
          >
            {currentProduct.description}
          </Typography>

          <Typography
            variant="subtitle1"
            mt={2}
            sx={{
              color: currentProduct.availability ? "#4CAF50" : "#FF5252",
              fontWeight: "bold",
            }}
          >
            {currentProduct.availability ? "Available ✅" : "Unavailable ❌"}
          </Typography>

          <Box mt={3} display="flex" justifyContent="flex-end">
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
