import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  Snackbar,
  Alert,
  Chip,
  Card,
  CardMedia,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import {
  getAppointmentsByUserName,
  getAllAppointments, // add this!
  bookAppointment,
  updateAppointment,
  deleteAppointment,
  updateAppointmentStatus,
  fetchServices,
  fetchServiceCenters,
  fetchMechanics,
} from "./api";

export default function Appointments() {
  const role = localStorage.getItem("role") || "user";
  const rawUsername = localStorage.getItem("username");
  const username = rawUsername ? rawUsername.split("@")[0] : ""; // remove domain part

  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [centers, setCenters] = useState([]);
  const [mechanics, setMechanics] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [miniServicesOpen, setMiniServicesOpen] = useState(false);
  const [miniCentersOpen, setMiniCentersOpen] = useState(false);
  const [miniMechanicsOpen, setMiniMechanicsOpen] = useState(false);

  const [serviceViewOpen, setServiceViewOpen] = useState(false);
  const [serviceDetails, setServiceDetails] = useState(null);

  // Add these new states at the top with useState
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);

  const [appointment, setAppointment] = useState({
    username: username,
    vehicleBrand: "",
    vehicleModel: "",
    services: [],
    serviceCenter: "",
    mechanic: "",
    date: "",
    time: "",
    status: 0,
  });

  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [loading, setLoading] = useState(false);

  const showSnack = (message, severity = "success") =>
    setSnack({ open: true, message, severity });
  const closeSnack = () => setSnack((prev) => ({ ...prev, open: false }));

  // Wrapped loadAll with useCallback and added as useEffect dependency
  const loadAll = useCallback(async () => {
    try {
      if (!username) {
        showSnack("User not logged in", "error");
        return; // stop further calls
      }

      if (role === "admin") {
        const appointments = await getAllAppointments(); // fetch all users' appointments
        setAppointments(appointments);
      } else {
        const appointments = await getAppointmentsByUserName(username);
        setAppointments(appointments);
      }

      const serv = await fetchServices();
      setServices(serv);

      const cent = await fetchServiceCenters();
      setCenters(cent);

      const mechs = await fetchMechanics();
      setMechanics(mechs);
    } catch (error) {
      showSnack("Failed to load data", "error");
    }
  }, [username, role]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  useEffect(() => {
    if (!username) {
      showSnack("User not logged in", "error");
      return;
    }
    loadAll();
  }, [loadAll, username]);

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAppointment((prev) => ({ ...prev, [name]: value }));
  };

  const toggleServiceSelect = (serviceName) => {
    setAppointment((prev) => {
      if (prev.services.includes(serviceName)) {
        return {
          ...prev,
          services: prev.services.filter((s) => s !== serviceName),
          mechanic:
            prev.mechanic && !prev.services.includes(serviceName)
              ? ""
              : prev.mechanic, // reset mechanic if needed
        };
      } else {
        return {
          ...prev,
          services: [...prev.services, serviceName],
        };
      }
    });
  };

  const handleOpenModal = () => {
    setAppointment({
      username: username,
      vehicleBrand: "",
      vehicleModel: "",
      services: [],
      serviceCenter: "",
      mechanic: "",
      date: "",
      time: "",
      status: 0,
    });
    setModalOpen(true);
  };

  const handleEdit = (appt) => {
    const [date, time] = appt.appointmentTime?.split(" ") || ["", ""];

    setAppointment({
      id: appt.id,
      username: appt.username || username, // ✅ fallback to local username if not found
      vehicleBrand: appt.vehicleBrand,
      vehicleModel: appt.vehicleModel,
      services: appt.serviceName ? appt.serviceName.split(",") : [],
      serviceCenter: appt.centerName || "",
      mechanic: appt.mechanicName || "",
      date: date,
      time: time,
      status: appt.status ?? 0, // ✅ if null/undefined, fallback to 0
    });
    setModalOpen(true);
  };

  // Replace handleDelete to open modal instead of confirm
  const handleDelete = (id) => {
    setAppointmentToDelete(id);
    setConfirmOpen(true);
  };

  // Confirm delete function
  const confirmDelete = async () => {
    setConfirmOpen(false);
    if (!appointmentToDelete) return;
    try {
      await deleteAppointment(appointmentToDelete); // your API call
      showSnack("Appointment deleted! ✅");
      loadAll(); // ✅ this refreshes the list without reloading the whole site
    } catch {
      showSnack("Failed to delete appointment ❌", "error");
    } finally {
      setAppointmentToDelete(null);
    }
  };

  const handleSave = async () => {
    setLoading(true);

    // ✅ Check if all required fields are filled
    if (
      !appointment.vehicleBrand.trim() ||
      !appointment.vehicleModel.trim() ||
      appointment.services.length === 0 ||
      !appointment.serviceCenter.trim() ||
      !appointment.date.trim() ||
      !appointment.time.trim()
    ) {
      showSnack("Please fill all required fields ❌", "error");
      setLoading(false);
      return;
    }

    try {
      console.log("🧑‍🔧 Selected mechanic before save:", appointment.mechanic);

      const appointmentData = {
        id: appointment.id,
        username: appointment.username,
        vehicleBrand: appointment.vehicleBrand,
        vehicleModel: appointment.vehicleModel,
        serviceName: appointment.services.join(","), // join services with commas

        centerName: appointment.serviceCenter,
        mechanicName: appointment.mechanic,
        appointmentTime: appointment.date + " " + appointment.time,
        status: isNaN(appointment.status) ? 0 : Number(appointment.status),
      };

      console.log("📦 Sending appointment data:", appointmentData);

      if (appointment.id) {
        await updateAppointment(appointment.id, appointmentData);
        showSnack("Appointment updated ✅");
      } else {
        await bookAppointment(appointmentData);
        showSnack("Appointment created ✅");
      }

      setModalOpen(false);
      loadAll();
    } catch (error) {
      console.error("❌ Save failed:", error);
      showSnack("Save failed ❌", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateAppointmentStatus(id, newStatus);
      showSnack("Status updated");
      loadAll();
    } catch {
      showSnack("Status update failed", "error");
    }
  };

  const handleServiceView = (service) => {
    setServiceDetails(service);
    setServiceViewOpen(true);
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "#fff",
    borderRadius: 2,
    boxShadow: 24,
    p: 3,
  };

  return (
    <Box sx={{ p: 3, minHeight: "100vh", bgcolor: "#0f1d2d" }}>
      <Typography variant="h4" mb={3} color="#E3F2FD">
        Appointments
      </Typography>

      {role !== "admin" && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenModal}
        >
          Book Appointment
        </Button>
      )}

      {/* Appointment List */}
      <Box mt={4}>
        {appointments.length === 0 ? (
          <Typography>No appointments found.</Typography>
        ) : (
          appointments.map((a) => (
            <Box
              key={a.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
                p: 2,
                bgcolor: "#1E2A38",
                borderRadius: 1,
                color: "#fff",
              }}
            >
              <Box>
                <Typography fontWeight="bold">
                  👤 {a.username} | 🚗 {a.vehicleBrand} {a.vehicleModel}
                </Typography>

                <Typography>
                  🛠 Services: {a.serviceName || "No Service"}
                </Typography>
                <Typography>
                  🏢 Center: {a.centerName || "N/A"} | 👨‍🔧 Mechanic:{" "}
                  {a.mechanicName || "Not Assigned"}
                </Typography>

                <Typography>
                  📅{" "}
                  {a.appointmentTime ? a.appointmentTime.split(" ")[0] : "N/A"}{" "}
                  | 🕒{" "}
                  {a.appointmentTime ? a.appointmentTime.split(" ")[1] : "N/A"}
                </Typography>

                <Typography
                  sx={{
                    mt: 1,
                    fontWeight: "bold",
                    color: a.status === 1 ? "#4CAF50" : "#FF5252",
                  }}
                >
                  Status: {a.status === 1 ? "Completed ✅" : "Incomplete ❌"}
                </Typography>

                {role === "admin" && (
                  <Box display="flex" alignItems="center" mt={1}>
                    <Typography mr={1}>Completed:</Typography>
                    <input
                      type="checkbox"
                      checked={a.status === 1}
                      onChange={(e) =>
                        handleStatusUpdate(a.id, e.target.checked ? 1 : 0)
                      }
                    />
                  </Box>
                )}
              </Box>

              <Box display="flex" gap={1}>
                {role === "user" && (
                  <>
                    <Button
                      onClick={() => a.status !== 1 && handleEdit(a)}
                      variant="outlined"
                      color={a.status !== 1 ? "info" : "inherit"}
                      disabled={a.status === 1}
                      sx={{
                        ...(a.status === 1 && {
                          color: "#757575 !important",
                          borderColor: "#757575 !important",
                        }),
                      }}
                    >
                      Update
                    </Button>

                    <Button
                      onClick={() => a.status !== 1 && handleDelete(a.id)} // open modal now
                      variant="outlined"
                      color={a.status !== 1 ? "error" : "inherit"}
                      disabled={a.status === 1}
                      sx={{
                        ...(a.status === 1 && {
                          color: "#757575 !important",
                          borderColor: "#757575 !important",
                        }),
                      }}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          ))
        )}
      </Box>

      {/* Booking Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            ...modalStyle,
            width: 500,
            maxHeight: 500,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            p: 3,
            border: "2px solid #ADD8E6",
            boxSizing: "border-box",
            bgcolor: "#f9f9f9",
          }}
        >
          <Typography variant="h6" mb={2}>
            {appointment.id ? "Update Appointment" : "Book Appointment"}
          </Typography>

          <TextField
            label="Your Name"
            name="username"
            fullWidth
            margin="normal"
            value={appointment.username}
            InputProps={{ readOnly: true }}
          />

          <Box display="flex" gap={2}>
            <TextField
              label="Vehicle Brand"
              name="vehicleBrand"
              value={appointment.vehicleBrand}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Vehicle Model"
              name="vehicleModel"
              value={appointment.vehicleModel}
              onChange={handleChange}
              fullWidth
            />
          </Box>

          {/* Services selection */}
          <Box mt={2}>
            <Typography fontWeight="bold" mb={1}>
              Services:
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {appointment.services.map((service) => (
                <Chip
                  key={service}
                  label={service}
                  onDelete={() =>
                    setAppointment((prev) => ({
                      ...prev,
                      services: prev.services.filter((s) => s !== service),
                    }))
                  }
                />
              ))}
              <Button
                size="small"
                variant="outlined"
                onClick={() => setMiniServicesOpen(true)}
              >
                Select Services
              </Button>
            </Box>
          </Box>

          {/* Service Center */}
          <Box mt={2}>
            <Typography fontWeight="bold" mb={1}>
              Service Center:
            </Typography>
            <Box display="flex" gap={1} alignItems="center">
              <TextField
                value={appointment.serviceCenter}
                InputProps={{ readOnly: true }}
                fullWidth
              />
              <Button
                size="small"
                variant="outlined"
                onClick={() => setMiniCentersOpen(true)}
              >
                Choose
              </Button>
            </Box>
          </Box>

          {/* Mechanic */}
          <Box mt={2}>
            <Typography fontWeight="bold" mb={1}>
              Mechanic (optional):
            </Typography>
            <Box display="flex" gap={1} alignItems="center">
              <TextField
                value={appointment.mechanic}
                InputProps={{ readOnly: true }}
                fullWidth
              />
              <Button
                size="small"
                variant="outlined"
                onClick={() => {
                  if (
                    appointment.services.length === 0 ||
                    appointment.serviceCenter.trim() === ""
                  ) {
                    showSnack(
                      "Please select services and a service center first ❌",
                      "error"
                    );
                  } else {
                    // check if mechanics exist for selected services & center
                    const centerObj = centers.find(
                      (c) => c.name === appointment.serviceCenter
                    );
                    const centerId = centerObj ? centerObj.id : null;

                    const filteredMechanics = mechanics.filter((m) => {
                      const inCenter = !centerId || m.center_id === centerId;

                      const hasSkill = appointment.services.some((s) =>
                        m.skillset
                          .split(",")
                          .map((skill) => skill.trim())
                          .includes(s)
                      );

                      const fallbackToSkillsOnly =
                        mechanics.filter((m) =>
                          appointment.services.some((s) =>
                            m.skillset
                              .split(",")
                              .map((skill) => skill.trim())
                              .includes(s)
                          )
                        ).length > 0 &&
                        mechanics.filter((m) => m.center_id === centerId)
                          .length === 0;

                      return fallbackToSkillsOnly
                        ? hasSkill
                        : inCenter && hasSkill;
                    });

                    if (filteredMechanics.length === 0) {
                      showSnack(
                        "No mechanics available for the selected service(s) or service center ❌",
                        "error"
                      );
                    } else {
                      setMiniMechanicsOpen(true);
                    }
                  }
                }}
              >
                Pick
              </Button>
            </Box>
          </Box>

          {/* Date and Time */}
          <Box mt={2}>
            <TextField
              label="Appointment Date"
              name="date"
              type="date"
              fullWidth
              value={appointment.date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Time"
              name="time"
              type="time"
              fullWidth
              value={appointment.time}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              sx={{ mt: 2 }}
            />
          </Box>

          {/* Save/Cancel Buttons */}
          <Box mt={3} display="flex" justifyContent="space-between">
            <Button onClick={() => setModalOpen(false)} variant="outlined">
              Cancel
            </Button>
            <Button onClick={handleSave} variant="contained" disabled={loading}>
              {appointment.id ? "Update" : "Save"}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Mini Modal: Services */}
      <Modal open={miniServicesOpen} onClose={() => setMiniServicesOpen(false)}>
        <Box
          sx={{
            ...modalStyle,
            width: 600,
            maxHeight: 500,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            p: 3,
            border: "2px solid #ADD8E6",
            boxSizing: "border-box",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
            flexShrink={0}
          >
            <Typography variant="h6">Select Services</Typography>
            <Button
              onClick={() => setMiniServicesOpen(false)}
              variant="contained"
              color="primary"
              size="small"
            >
              Close
            </Button>
          </Box>

          <Box display="grid" gap={1}>
            {services.map((s) => (
              <Card
                key={s.id}
                sx={{
                  p: 1,
                  border: appointment.services.includes(s.name)
                    ? "2px solid green"
                    : "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
                onClick={() => toggleServiceSelect(s.name)}
              >
                <Box
                  component="img"
                  src={
                    s.imageUrl
                      ? s.imageUrl.startsWith("http")
                        ? s.imageUrl
                        : `http://localhost:8083/vehicle-service/${s.imageUrl}`
                      : "https://via.placeholder.com/50"
                  }
                  alt={s.name}
                  sx={{
                    width: 50,
                    height: 50,
                    objectFit: "cover",
                    borderRadius: 1,
                    flexShrink: 0,
                  }}
                />
                <Typography fontWeight="bold" fontSize={14} flexGrow={1}>
                  {s.name.length > 15 ? s.name.slice(0, 15) + "..." : s.name}
                </Typography>
                <Button
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleServiceView(s);
                  }}
                >
                  View
                </Button>
              </Card>
            ))}
          </Box>
        </Box>
      </Modal>

      {/* Mini Modal: Service Centers */}
      <Modal open={miniCentersOpen} onClose={() => setMiniCentersOpen(false)}>
        <Box
          sx={{
            ...modalStyle,
            width: 500,
            maxHeight: 500,
            overflowY: "auto",
            p: 3,
            border: "2px solid #ADD8E6",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
            flexShrink={0}
          >
            <Typography variant="h6">Choose Service Center</Typography>
            <Button
              onClick={() => setMiniCentersOpen(false)}
              variant="contained"
              color="primary"
              size="small"
            >
              Close
            </Button>
          </Box>

          <Box display="grid" gap={1}>
            {centers.map((c) => (
              <Card
                key={c.id}
                sx={{
                  p: 2,
                  border:
                    appointment.serviceCenter === c.name
                      ? "2px solid green"
                      : "none",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setAppointment((prev) => ({
                    ...prev,
                    serviceCenter: c.name,
                    mechanic: "", // reset mechanic on center change
                  }));
                  setMiniCentersOpen(false);
                }}
              >
                <Typography fontWeight="bold">{c.name}</Typography>
                <Typography variant="body2">📍 {c.address}</Typography>
                <Typography variant="body2">📞 {c.contact}</Typography>
              </Card>
            ))}
          </Box>
        </Box>
      </Modal>

      {/* Mini Modal: Mechanics */}
      <Modal
        open={miniMechanicsOpen}
        onClose={() => setMiniMechanicsOpen(false)}
      >
        <Box
          sx={{
            ...modalStyle,
            width: 550,
            height: 450,
            bgcolor: "#1E2A38",
            color: "#E0E0E0",
            p: 3,
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          {/* Close Button */}
          <Button
            variant="text"
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              textTransform: "none",
              fontSize: 14,
              color: "#ADD8E6",
              backgroundColor: "transparent",
              "&:hover": {
                backgroundColor: "rgba(173, 216, 230, 0.1)",
              },
            }}
            onClick={() => setMiniMechanicsOpen(false)}
          >
            Close
          </Button>

          <Typography variant="h6" mb={2} sx={{ color: "#ADD8E6" }}>
            Pick a Mechanic (optional)
          </Typography>

          {(() => {
            console.log("🧪 Selected services:", appointment.services);
            console.log(
              "🧪 Selected service center:",
              appointment.serviceCenter
            );
            console.log(
              "🧪 Mechanics before filtering:",
              mechanics.map((m) => m.name)
            );
          })()}

          <Box
            sx={{
              overflowY: "auto",
              flexGrow: 1,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
              gap: 2,
              pr: 1,
            }}
          >
            {mechanics
              .filter((m) => {
                const centerObj = centers.find(
                  (c) => c.name === appointment.serviceCenter
                );
                const centerId = centerObj ? centerObj.id : null;

                const inCenter = !centerId || m.center_id === centerId;

                const hasSkill = appointment.services.some((s) =>
                  m.skillset
                    .split(",")
                    .map((skill) => skill.trim())
                    .includes(s)
                );

                const fallbackToSkillsOnly =
                  mechanics.filter((m) =>
                    appointment.services.some((s) =>
                      m.skillset
                        .split(",")
                        .map((skill) => skill.trim())
                        .includes(s)
                    )
                  ).length > 0 &&
                  mechanics.filter((m) => m.center_id === centerId).length ===
                    0;

                return fallbackToSkillsOnly ? hasSkill : inCenter && hasSkill;
              })
              .map((m) => {
                const isSelected = appointment.mechanic === m.name;
                const isAvailable = m.availability;

                console.log(
                  "✅ Showing mechanic:",
                  m.name,
                  "with skillset:",
                  m.skillset
                );

                return (
                  <Card
                    key={m.id}
                    sx={{
                      height: 180,
                      width: 100,
                      p: 1,
                      textAlign: "center",
                      bgcolor: isAvailable ? "#264653" : "#3a3a3a",
                      color: isAvailable ? "#E0E0E0" : "#999999",
                      borderRadius: 2,
                      cursor: isAvailable ? "pointer" : "not-allowed",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      border: isSelected ? "2px solid #4CAF50" : "none",
                      "&:hover": {
                        bgcolor: isAvailable ? "#31708E" : "#3a3a3a",
                        boxShadow: isAvailable ? "0 0 8px #4CAF50" : "none",
                      },
                    }}
                    onClick={() => {
                      if (!isAvailable) return;
                      setAppointment((prev) => ({
                        ...prev,
                        mechanic: m.name,
                      }));
                      setMiniMechanicsOpen(false);
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={
                        m.image_url?.startsWith("http")
                          ? m.image_url
                          : `http://localhost:8081/service-app/${m.image_url}`
                      }
                      alt={m.name}
                      sx={{
                        width: 70,
                        height: 70,
                        objectFit: "cover",
                        borderRadius: "50%",
                        mb: 1,
                        opacity: isAvailable ? 1 : 0.5,
                      }}
                    />
                    <Typography fontWeight="bold" fontSize={13} noWrap>
                      {m.name}
                    </Typography>
                    <Typography
                      fontSize={11}
                      sx={{ color: "#A0C4FF", mb: 0.5 }}
                      noWrap
                    >
                      {m.skillset}
                    </Typography>
                    <Typography
                      fontSize={11}
                      color={isAvailable ? "#4CAF50" : "#FF5252"}
                    >
                      {isAvailable ? "Available ✅" : "Unavailable ❌"}
                    </Typography>
                  </Card>
                );
              })}
          </Box>
        </Box>
      </Modal>

      {/* Service Details View Modal */}
      <Modal open={serviceViewOpen} onClose={() => setServiceViewOpen(false)}>
        <Box
          sx={{
            ...modalStyle,
            width: 400,
            height: 500,
            bgcolor: "#13293D", // dark blue background
            color: "#fff", // white text
            p: 3,
            borderRadius: 2,
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" mb={2}>
            {serviceDetails?.name}
          </Typography>

          {serviceDetails?.imageUrl && (
            <Box
              component="img"
              src={
                serviceDetails.imageUrl.startsWith("http")
                  ? serviceDetails.imageUrl
                  : `http://localhost:8081/service-app/${serviceDetails.imageUrl}`
              }
              alt={serviceDetails.name}
              sx={{
                width: "100%",
                height: "auto",
                borderRadius: 1,
                mb: 2,
              }}
            />
          )}

          <Typography
            sx={{
              whiteSpace: "pre-line",
              fontSize: 14,
              mb: 2,
              lineHeight: 1.4,
            }}
          >
            {serviceDetails?.desc}
          </Typography>

          <Typography fontWeight="bold" mb={2}>
            Price: {serviceDetails?.price}
          </Typography>

          <Box textAlign="right">
            <Button
              onClick={() => setServiceViewOpen(false)}
              variant="outlined"
              sx={{ color: "#fff", borderColor: "#fff" }}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Delete Confirmation Modal */}
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
            Are you sure you want to delete this appointment?
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

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={closeSnack}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={closeSnack}
          severity={snack.severity}
          sx={{ width: "100%" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
