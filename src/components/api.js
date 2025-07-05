const USER_BASE_URL = "http://localhost:8080/service-app/users";
const PRODUCT_BASE_URL = "http://localhost:8083/vehicle-service/products";
const SERVICE_BASE_URL = "http://localhost:8081/service-app/vehicleservices";
const CENTER_BASE_URL = "http://localhost:8081/service-app/centers";
const MECHANIC_BASE_URL = "http://localhost:8081/service-app/mechanics";

// 🔐 Login Function
export async function loginUser(credentials) {
  const res = await fetch(`${USER_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  const data = await res.json();
  return data; // returns backend response with message
}

// 📝 Signup Function
export async function signupUser(credentials) {
  const { name, email, password, contact } = credentials;

  if (!name || !email || !password || !contact) {
    return { success: false, message: "All fields are required!" };
  }

  try {
    const res = await fetch(`${USER_BASE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await res.json();

    if (res.ok) {
      return { success: true, message: data.message || "Signup successful!" };
    } else {
      return {
        success: false,
        message: data.message || "Signup failed. Please try again.",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong. Please check your internet connection.",
    };
  }
}

// 🔍 Fetch user by email
export async function getUserByEmail(email) {
  const res = await fetch(`${USER_BASE_URL}/email/${email}`);
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

// 🔄 Update user
export async function updateUser(user) {
  const res = await fetch(`${USER_BASE_URL}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error("Failed to update user");
  return res.json();
}

// --------------- Product APIs ------------------

// Fetch all products
export async function fetchProducts() {
  const res = await fetch(PRODUCT_BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

// Upload product image, returns image URL
export async function uploadImage(file) {
  if (!file) return null;
  const formData = new FormData();
  formData.append("file", file); // match backend param

  const res = await fetch(
    "http://localhost:8083/vehicle-service/products/upload",
    {
      method: "POST",
      body: formData,
    }
  );
  if (!res.ok) throw new Error("Image upload failed");
  const data = await res.text(); // backend returns String URL, not JSON
  return data; // URL string
}

// Create new product
export async function createProduct(product) {
  const res = await fetch(PRODUCT_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error("Failed to create product");
  return res.json();
}

// Update existing product
export async function updateProduct(product) {
  const res = await fetch(PRODUCT_BASE_URL, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error("Failed to update product");
  return res.json();
}

// Delete product by ID
export async function deleteProduct(id) {
  const res = await fetch(`${PRODUCT_BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete product");
  return true;
}

// --------------- Services APIs ------------------

// Fetch all services
export async function fetchServices() {
  const res = await fetch(SERVICE_BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch services");
  return res.json();
}

// Upload service image, returns image URL
export async function uploadServiceImage(file) {
  if (!file) return null;
  const formData = new FormData();
  formData.append("image", file); // backend expects "image" param

  const res = await fetch(`${SERVICE_BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Service image upload failed");
  const data = await res.text(); // returns string URL
  return data;
}

// Create new service
export async function createService(service) {
  const res = await fetch(SERVICE_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(service),
  });
  if (!res.ok) throw new Error("Failed to create service");
  return res.json();
}

// Update existing service
export async function updateService(service) {
  const res = await fetch(SERVICE_BASE_URL, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(service),
  });
  if (!res.ok) throw new Error("Failed to update service");
  return res.json();
}

// Delete service by ID
export async function deleteService(id) {
  const res = await fetch(`${SERVICE_BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete service");
  return true;
}

// --------------- Service Center APIs ------------------

//Fetching all service cneters
export async function fetchServiceCenters() {
  const res = await fetch(CENTER_BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch Service Center");
  return res.json();
}

//Create new Service center
export async function createServiceCenter(center) {
  const res = await fetch(CENTER_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(center),
  });
  if (!res.ok) throw new Error("Failed to create service center");
  return res.json();
}

//Updating existing Service centers
export async function updateServiceCenter(center) {
  const res = await fetch(CENTER_BASE_URL, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(center),
  });
  if (!res.ok) throw new Error("Failed to update service center");
  return res.json();
}

//Deleting existing Service center
export async function deleteServiceCenter(id) {
  const res = await fetch(`${CENTER_BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delet service center");
  return true;
}

// --------------- Mechanics APIs ------------------

// 📦 Fetch all mechanics
export async function fetchMechanics(availability) {
  let url = MECHANIC_BASE_URL;
  if (availability === true) {
    url += "/available";
  } else if (availability === false) {
    url += "/unavailable";
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch mechanics");
  return res.json();
}

// 🔍 Search mechanics by query
export async function searchMechanics(query, type) {
  const res = await fetch(
    `${MECHANIC_BASE_URL}/search?query=${encodeURIComponent(
      query
    )}&type=${type}`
  );
  if (!res.ok) throw new Error("Failed to search mechanics");
  return res.json();
}

// 📂 Fetch only available mechanics
export async function fetchAvailableMechanics() {
  const res = await fetch(`${MECHANIC_BASE_URL}/available`);
  if (!res.ok) throw new Error("Failed to fetch available mechanics");
  return res.json();
}

// 📤 Upload mechanic image
export async function uploadMechanicImage(file) {
  if (!file) return null;
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${MECHANIC_BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Mechanic image upload failed");
  const data = await res.text();
  return data;
}

// ➕ Create mechanic
export async function createMechanic(mechanic) {
  const res = await fetch(MECHANIC_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(mechanic),
  });
  if (!res.ok) throw new Error("Failed to create mechanic");
  return res.json();
}

// 🛠 Update mechanic
export async function updateMechanic(mechanic) {
  const res = await fetch(MECHANIC_BASE_URL, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(mechanic),
  });
  if (!res.ok) throw new Error("Failed to update mechanic");
  return res.json();
}

// ❌ Delete mechanic
export async function deleteMechanic(id) {
  const res = await fetch(`${MECHANIC_BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete mechanic");
  return true;
}
