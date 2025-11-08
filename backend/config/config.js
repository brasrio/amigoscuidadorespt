module.exports = {
  // Configurações JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'amigos_cuidadores_secret_2025',
    expiresIn: process.env.JWT_EXPIRE || '7d'
  },
  
  // Configurações de senha
  bcrypt: {
    saltRounds: 10
  },
  
  // Configurações do servidor
  server: {
    port: process.env.PORT || 5000,
    env: process.env.NODE_ENV || 'development'
  }
};
