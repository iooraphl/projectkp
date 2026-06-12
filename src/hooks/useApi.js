"use client";

import { useAuth } from "../contexts/AuthContext";

/**
 * Custom hook for making authenticated API calls
 * Automatically includes JWT token in request headers
 */
export const useApi = () => {
  const { token, logout } = useAuth();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  const readJson = async (response) => {
    const text = await response.text();
    return text ? JSON.parse(text) : {};
  };

  const request = async (endpoint, options = {}) => {
    const headers = {
      "Content-Type": "application/json",
      ...options.headers
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers
      });

      const data = await readJson(response);

      // If token expired, logout user
      if (response.status === 401 && token) {
        logout();
        return { error: "Session expired. Please login again." };
      }

      if (!response.ok) {
        return { error: data.message || "An error occurred" };
      }

      return { success: true, data };
    } catch (error) {
      if (error instanceof TypeError) {
        return { error: "Tidak bisa terhubung ke server API. Pastikan aplikasi Next.js berjalan." };
      }

      return { error: error.message || "Network error" };
    }
  };

  const get = (endpoint, options = {}) => 
    request(endpoint, { ...options, method: "GET" });

  const post = (endpoint, body, options = {}) =>
    request(endpoint, { ...options, method: "POST", body: JSON.stringify(body) });

  const put = (endpoint, body, options = {}) =>
    request(endpoint, { ...options, method: "PUT", body: JSON.stringify(body) });

  const patch = (endpoint, body, options = {}) =>
    request(endpoint, { ...options, method: "PATCH", body: JSON.stringify(body) });

  const del = (endpoint, options = {}) =>
    request(endpoint, { ...options, method: "DELETE" });

  return { get, post, put, patch, delete: del };
};

/**
 * Usage examples:
 * 
 * const { get, post } = useApi()
 * 
 * // Get orders
 * const { data, error } = await get('/api/orders')
 * 
 * // Create order
 * const { data, error } = await post('/api/orders', { cart, summary, paymentMethod })
 * 
 * // Update profile
 * const { data, error } = await put('/api/auth/profile', { name, phone, address })
 */
