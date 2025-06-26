/**
 * Date formatting utilities for WiseTech
 *
 * Provides consistent date formatting across all components
 */

/**
 * Format date to relative time (e.g., "just now", "2 hours ago", "yesterday")
 * @param {string|Date} dateString - The date to format
 * @returns {string} Formatted relative time string
 */
export const formatRelativeTime = (dateString) => {
  try {
    // Parse the date string
    let date;

    // Backend timestamps are stored in UTC but sent without timezone info
    // We need to treat them as UTC and convert to local time
    if (
      dateString.includes("T") &&
      (dateString.includes("Z") || dateString.includes("+"))
    ) {
      // Already has timezone info, use as-is
      date = new Date(dateString);
    } else {
      // Treat as UTC timestamp from backend
      // Convert "2025-06-26 12:18:20.350945" to "2025-06-26T12:18:20.350945Z"
      let isoString = dateString;
      if (!isoString.includes("T")) {
        isoString = isoString.replace(" ", "T");
      }
      if (!isoString.endsWith("Z")) {
        isoString += "Z";
      }
      date = new Date(isoString);
    }

    const now = new Date();

    // Calculate time difference (positive means past, negative means future)
    const diffTime = now - date;
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // If date is in the future, handle it gracefully
    if (diffTime < 0) {
      return "Just now"; // Treat future dates as "just now"
    }

    // Check if it's the same day (today) - compare in local timezone
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      if (diffMinutes < 1) return "Just now";
      if (diffMinutes < 60)
        return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;
      return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
    }

    // Check if it's yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isYesterday) return "Yesterday";
    if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
    if (diffDays < 30)
      return `${Math.ceil(diffDays / 7)} week${
        Math.ceil(diffDays / 7) === 1 ? "" : "s"
      } ago`;

    // For older dates, show full date
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Recently";
  }
};

/**
 * Format date to absolute format (e.g., "January 15, 2024")
 * @param {string|Date} dateString - The date to format
 * @returns {string} Formatted absolute date string
 */
export const formatAbsoluteDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

/**
 * Format date with time (e.g., "January 15, 2024 at 2:30 PM")
 * @param {string|Date} dateString - The date to format
 * @returns {string} Formatted date with time string
 */
export const formatDateWithTime = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

/**
 * Format date for join date (e.g., "Joined January 2024")
 * @param {string|Date} dateString - The date to format
 * @returns {string} Formatted join date string
 */
export const formatJoinDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Recently";
  }
};

/**
 * Check if date is today
 * @param {string|Date} dateString - The date to check
 * @returns {boolean} True if date is today
 */
export const isToday = (dateString) => {
  try {
    const date = new Date(dateString);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  } catch (error) {
    return false;
  }
};

/**
 * Check if date is yesterday
 * @param {string|Date} dateString - The date to check
 * @returns {boolean} True if date is yesterday
 */
export const isYesterday = (dateString) => {
  try {
    const date = new Date(dateString);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.toDateString() === yesterday.toDateString();
  } catch (error) {
    return false;
  }
};

/**
 * Get time ago in human readable format
 * @param {string|Date} dateString - The date to format
 * @returns {string} Human readable time ago string
 */
export const getTimeAgo = (dateString) => {
  return formatRelativeTime(dateString);
};

// Default export for backward compatibility
export default {
  formatRelativeTime,
  formatAbsoluteDate,
  formatDateWithTime,
  formatJoinDate,
  isToday,
  isYesterday,
  getTimeAgo,
};
