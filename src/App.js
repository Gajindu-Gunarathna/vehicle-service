import "./App.css";

// ✅ Import shared components
import Appbar from "./components/Appbar";
import Home from "./components/Home";
import UserProfile from "./components/UserProfile";

// ✅ Import components for other menu pages (create these files)
import Appointments from "./components/Appointments";
import Products from "./components/Products";
import Mechanics from "./components/Mechanics";
import Services from "./components/Services";
import ServiceCenters from "./components/ServiceCenters";

// ✅ Import routing tools
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        {/* 🌐 Enables page navigation using routes */}
        <Appbar /> {/* 📌 Top navbar stays always visible */}
        <Routes>
          {/* 🏠 Default home page */}
          <Route path="/" element={<Home />} />
          {/* 👤 User Profile page (both user/admin can access) */}
          <Route path="/profile" element={<UserProfile />} />
          {/* 📅 Appointments page */}
          <Route path="/appointments" element={<Appointments />} />
          {/* 🛒 Products page */}
          <Route path="/products" element={<Products />} />
          {/* 🧑‍🔧 Mechanics management (admin only) */}
          <Route path="/mechanics" element={<Mechanics />} />
          {/* ⚙️ Services management (admin only) */}
          <Route path="/services" element={<Services />} />
          {/* 🏢 Service Centers management (admin only) */}
          <Route path="/service-centers" element={<ServiceCenters />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
