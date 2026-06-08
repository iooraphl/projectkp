import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const readJson = async (response) => {
  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

const getAuthErrorMessage = (error) => {
  if (error instanceof TypeError) {
    return "Tidak bisa terhubung ke server auth. Pastikan backend berjalan di http://127.0.0.1:4000.";
  }

  return error.message || "Terjadi kesalahan. Silakan coba lagi.";
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:4000";

  // Initialize auth from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("authUser");

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
      }
    }

    setLoading(false);
  }, []);

  const register = async (email, password, confirmPassword, name, phone = "", address = "") => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password,
          confirmPassword,
          name,
          phone: phone || null,
          address: address || null
        })
      });

      const data = await readJson(response);

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("authUser", JSON.stringify(data.user));

      setToken(data.token);
      setUser(data.user);

      return { success: true, user: data.user };
    } catch (err) {
      const message = getAuthErrorMessage(err);
      setError(message);
      return { success: false, error: message };
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await readJson(response);

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("authUser", JSON.stringify(data.user));

      setToken(data.token);
      setUser(data.user);

      return { success: true, user: data.user };
    } catch (err) {
      const message = getAuthErrorMessage(err);
      setError(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    setToken(null);
    setUser(null);
    setError(null);
  };

  const getProfile = async () => {
    if (!token) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await readJson(response);

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch profile");
      }

      setUser(data);
      localStorage.setItem("authUser", JSON.stringify(data));

      return data;
    } catch (err) {
      setError(getAuthErrorMessage(err));
      return null;
    }
  };

  const updateProfile = async (name, phone, address) => {
    if (!token) return { success: false, error: "Not authenticated" };

    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, phone, address })
      });

      const data = await readJson(response);

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      setUser(data.user);
      localStorage.setItem("authUser", JSON.stringify(data.user));

      return { success: true, user: data.user };
    } catch (err) {
      const message = getAuthErrorMessage(err);
      setError(message);
      return { success: false, error: message };
    }
  };

  const changePassword = async (currentPassword, newPassword, confirmPassword) => {
    if (!token) return { success: false, error: "Not authenticated" };

    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword })
      });

      const data = await readJson(response);

      if (!response.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      return { success: true, message: data.message };
    } catch (err) {
      const message = getAuthErrorMessage(err);
      setError(message);
      return { success: false, error: message };
    }
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === "ADMIN";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        isAuthenticated,
        isAdmin,
        register,
        login,
        logout,
        getProfile,
        updateProfile,
        changePassword,
        setError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
