export const baseUrl = import.meta.env.VITE_API_URL;
export const siteURL = import.meta.env.VITE_SITE_URL;
export const botUsername = import.meta.env.VITE_BOT_USERNAME;
export const gamePublicKey = (import.meta.env.VITE_GAME_PUBLIC_KEY || "").replace(/\\n/g, "\n");