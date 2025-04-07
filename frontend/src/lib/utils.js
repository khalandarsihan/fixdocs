import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility function to combine Tailwind classes
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Format date in a human-readable format
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

// Format currency
export function formatCurrency(amount, currency = 'AED') {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: currency
  }).format(amount);
}

// Calculate days until expiry
export function daysUntilExpiry(expiryDateString) {
  const expiryDate = new Date(expiryDateString);
  const today = new Date();
  
  // Set both dates to midnight for accurate day calculation
  expiryDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  const diffTime = expiryDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}
