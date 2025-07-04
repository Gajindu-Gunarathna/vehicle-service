const USER_BASE_URL = "http://localhost:8080/service-app/users";
const PRODUCT_BASE_URL = "http://localhost:8083/vehicle-service/products";

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
