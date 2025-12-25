export const env = {
  apiUrl: import.meta.env.VITE_API_URL || 'https://localhost:7001/api',
  stripePublicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY || '',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const;