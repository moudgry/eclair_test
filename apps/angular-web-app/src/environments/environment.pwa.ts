// environment.pwa.ts
export const environment = {
  production: true,
  apiUrl: process.env['NX_API_URL'] || 'http://localhost:3000/api',
  pwa: true
};
