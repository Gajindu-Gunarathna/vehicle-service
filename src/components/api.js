const BASE_URL = "http://localhost:8084/service-app/users";

// 🔐 Login Function
export async function loginUser(credentials) {
  const res = await fetch(`${BASE_URL}/login`, {
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

  // 🚫 Check if any field is empty
  if (!name || !email || !password || !contact) {
    return { success: false, message: "All fields are required!" };
  }

  try {
    const res = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await res.json(); // 🎯 Catch message from backend

    // ✅ Signup successful
    if (res.ok) {
      return { success: true, message: data.message || "Signup successful!" };
    } else {
      // ❗ Backend sent an error like "Email already exists"
      return {
        success: false,
        message: data.message || "Signup failed. Please try again.",
      };
    }
  } catch (error) {
    // 🔌 Connection or fetch error
    return {
      success: false,
      message: "Something went wrong. Please check your internet connection.",
    };
  }
}
