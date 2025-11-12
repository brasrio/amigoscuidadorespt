// Serverless function para Vercel
// Importa o app Express do backend e o exporta para o Vercel

const app = require('../backend/server');

// Exportar para Vercel serverless
module.exports = app;

