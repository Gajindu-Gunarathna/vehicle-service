const BASE_URL = "http://localhost:8080/service-app/users";

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

  if (!name || !email || !password || !contact) {
    return { success: false, message: "All fields are required!" };
  }

  try {
    const res = await fetch(`${BASE_URL}/signup`, {
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
  const res = await fetch(`${BASE_URL}/email/${email}`);
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

// 🔄 Update user
export async function updateUser(user) {
  const res = await fetch(`${BASE_URL}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error("Failed to update user");
  return res.json();
}
