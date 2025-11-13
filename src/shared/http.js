import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  timeout: 10000,
});

// --- START: DEV-ONLY AUTO LOGIN ---

// This promise will hold the auth token.
// It's initialized once and then reused.
let authTokenPromise = null;

/**
 * Fetches the auth token by logging in.
 * This function will only execute the login request once.
 * @returns {Promise<string>} A promise that resolves to the auth token.
 */
function getAuthToken() {
  if (!authTokenPromise) {
    console.log("DEV MODE: Attempting to auto-login for development...");
    authTokenPromise = http.post("/api/auth/login", {
      tenDangNhap: "admin",
      matKhau: "admin123",
    }).then(response => {
      const token = response.data?.data?.token;
      if (token) {
        console.log("DEV MODE: Auto-login successful. Token received.");
        return token;
      } else {
        console.error("DEV MODE: Auto-login failed. Could not extract token from response.", response.data);
        // Return a non-functional token to avoid breaking the app completely
        return "DEV_LOGIN_FAILED";
      }
    }).catch(error => {
      console.error("DEV MODE: Auto-login API call failed.", error.response?.data || error.message);
      // Propagate the error to stop subsequent requests that depend on auth
      return Promise.reject("DEV_LOGIN_FAILED");
    });
  }
  return authTokenPromise;
}

// Use an interceptor to attach the token to every request.
http.interceptors.request.use(async (config) => {
  // We don't need to add a token to the login request itself.
  if (config.url === "/api/auth/login") {
    return config;
  }

  try {
    const token = await getAuthToken();
    config.headers.Authorization = `Bearer ${token}`;
  } catch {
    // If login fails, we block the request to make the error obvious.
    console.error("DEV MODE: Request blocked because auto-login failed.", config.url);
    // Cancel the request
    return Promise.reject(new axios.Cancel("Request cancelled due to failed development auto-login."));
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// --- END: DEV-ONLY AUTO LOGIN ---

export default http;
