/**
 * Application constants
 */

export const APP_NAME = "MMM2027";
export const APP_VERSION = "0.1.0";

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REGISTER: "/auth/register",
  },
  USERS: {
    LIST: "/users",
    DETAIL: (id: number) => `/users/${id}`,
  },
} as const;
