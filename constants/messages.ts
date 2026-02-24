/**
 * Centralized error and success messages for the application
 * 
 * This file contains all user-facing messages to:
 * - Reduce string duplication across the codebase
 * - Make translations easier in the future
 * - Ensure consistency in messaging
 * 
 * Usage:
 * ```typescript
 * import { ErrorMessages, SuccessMessages } from "@/constants/messages";
 * 
 * throw new Error(ErrorMessages.TEAM.ID_REQUIRED);
 * toast.success(SuccessMessages.TEAM.SAVED);
 * ```
 */

export const ErrorMessages = {
  TEAM: {
    ID_REQUIRED: "A csapat azonosító megadása kötelező",
    NOT_FOUND: "A csapat nem található",
    NOT_FOUND_OR_DELETED: "A csapat nem található vagy már törölve lett",
  },
  EMAIL: {
    SEND_FAILED: "Email küldési hiba",
    UNKNOWN_TYPE: "Ismeretlen email típus",
  },
  USER: {
    APPROVAL_FAILED: "User approval failed",
    REJECTION_FAILED: "User rejection failed",
    FETCH_FAILED: "Error fetching users",
  },
  GUEST_USER: {
    FETCH_FAILED: "Error fetching guest users",
  },
  MEDIA: {
    FETCH_FAILED: "Error fetching media",
  },
  CALENDAR: {
    FETCH_FAILED: "Error fetching calendars",
  },
  MATCH: {
    FETCH_FAILED: "Error fetching matches",
    CREATE_FAILED: "Error creating match",
    UPDATE_FAILED: "Error updating match",
    DELETE_FAILED: "Error deleting match",
    NOT_LOGGED_IN: "Not logged in",
  },
  DATABASE: {
    CONNECTION_FAILED: "Adatbázis kapcsolat sikertelen",
  },
  GENERAL: {
    UNKNOWN_ERROR: "Unknown error occurred",
  },
} as const;

export const SuccessMessages = {
  TEAM: {
    SAVED: "Sikeres mentés",
    CREATED: "Csapat sikeresen létrehozva",
    DELETED: "Csapat sikeresen törölve",
  },
  USER: {
    APPROVED: "Felhasználó sikeresen jóváhagyva",
    REJECTED: "Felhasználó sikeresen elutasítva",
  },
  GUEST_USER: {
    CREATED: "Vendég játékvezető sikeresen létrehozva",
  },
  EMAIL: {
    SENT: "Email sikeresen elküldve",
  },
  MATCH: {
    CREATED: "Mérkőzés sikeresen létrehozva",
    UPDATED: "Mérkőzés sikeresen frissítve",
    DELETED: "Mérkőzés sikeresen törölve",
  },
  CALENDAR: {
    CREATED: "Naptár sikeresen létrehozva",
    UPDATED: "Naptár sikeresen frissítve",
    DELETED: "Naptár sikeresen törölve",
  },
  MEDIA: {
    CREATED: "Média sikeresen létrehozva",
    UPDATED: "Média sikeresen frissítve",
    DELETED: "Média sikeresen törölve",
  },
  PROFILE: {
    SAVED: "Profil sikeresen mentve",
    IMAGE_UPDATED: "Profilkép sikeresen frissítve",
  },
} as const;

/**
 * Email subject lines
 */
export const EmailSubjects = {
  REGISTRATION_REJECTED: "Regisztráció elutasítva",
  NEW_USER_NOTIFICATION: "Új felhasználó regisztráció",
  USER_APPROVED: "Regisztráció jóváhagyva",
} as const;

/**
 * UI Button/Action labels
 */
export const ActionLabels = {
  SAVE: "Mentés",
  CANCEL: "Mégse",
  DELETE: "Törlés",
  APPROVE: "Jóváhagyás",
  REJECT: "Elutasítás",
  EDIT: "Szerkesztés",
  CLOSE: "Bezárás",
  CREATE: "Létrehozás",
  UPDATE: "Frissítés",
} as const;

/**
 * Toast notification messages
 */
export const ToastMessages = {
  success: (message: string) => message,
  error: (message: string) => message,
  info: (message: string) => message,
  warning: (message: string) => message,
} as const;
