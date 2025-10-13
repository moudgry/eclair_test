// environment.ts
export const environment = {
  production: false,
  apiUrl: process.env['NX_API_URL'] || 'http://localhost:3000/api',
  pwa: false
};
