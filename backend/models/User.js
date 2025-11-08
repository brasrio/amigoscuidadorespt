const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

class User {
  constructor() {
    this.dataPath = path.join(__dirname, '../data/users.json');
    this.initializeDataFile();
  }

  // Inicializar arquivo de dados se não existir
  async initializeDataFile() {
    try {
      await fs.access(this.dataPath);
    } catch (error) {
      // Criar diretório data se não existir
      const dataDir = path.dirname(this.dataPath);
      await fs.mkdir(dataDir, { recursive: true });
      
      // Criar arquivo users.json vazio
      await fs.writeFile(this.dataPath, JSON.stringify([], null, 2));
    }
  }

  // Ler todos os usuários
  async readUsers() {
    try {
      const data = await fs.readFile(this.dataPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Erro ao ler usuários:', error);
      return [];
    }
  }

  // Salvar usuários
  async saveUsers(users) {
    try {
      await fs.writeFile(this.dataPath, JSON.stringify(users, null, 2));
    } catch (error) {
      console.error('Erro ao salvar usuários:', error);
      throw error;
    }
  }

  // Criar novo usuário
  async create(userData) {
    const users = await this.readUsers();
    
    // Verificar se email já existe
    const emailExists = users.some(user => user.email === userData.email);
    if (emailExists) {
      throw new Error('Email já cadastrado');
    }

    // Salvar senha em texto plano (APENAS PARA DESENVOLVIMENTO - NÃO SEGURO!)
    // const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Criar novo usuário
    const newUser = {
      id: uuidv4(),
      name: userData.name,
      email: userData.email,
      password: userData.password, // Senha em texto plano
      userType: userData.userType || 'client', // client, caregiver, nurse
      phone: userData.phone || '',
      address: userData.address || {},
      avatar: userData.avatar || null,
      profileComplete: false,
      verified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Adicionar campos específicos por tipo de usuário
    if (userData.userType === 'caregiver' || userData.userType === 'nurse') {
      newUser.professional = {
        experience: userData.experience || '',
        specialties: userData.specialties || [],
        certifications: userData.certifications || [],
        availability: userData.availability || {},
        hourlyRate: userData.hourlyRate || null,
        bio: userData.bio || '',
        rating: 0,
        totalReviews: 0
      };
    }

    users.push(newUser);
    await this.saveUsers(users);

    // Retornar usuário sem a senha
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  // Buscar usuário por email
  async findByEmail(email) {
    const users = await this.readUsers();
    return users.find(user => user.email === email);
  }

  // Buscar usuário por ID
  async findById(id) {
    const users = await this.readUsers();
    return users.find(user => user.id === id);
  }

  // Atualizar usuário
  async update(id, updateData) {
    const users = await this.readUsers();
    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex === -1) {
      throw new Error('Usuário não encontrado');
    }

    // Se estiver atualizando a senha, manter em texto plano (NÃO SEGURO!)
    // if (updateData.password) {
    //   updateData.password = await bcrypt.hash(updateData.password, 10);
    // }

    // Atualizar usuário
    users[userIndex] = {
      ...users[userIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    await this.saveUsers(users);

    // Retornar usuário atualizado sem a senha
    const { password, ...userWithoutPassword } = users[userIndex];
    return userWithoutPassword;
  }

  // Deletar usuário
  async delete(id) {
    const users = await this.readUsers();
    const filteredUsers = users.filter(user => user.id !== id);

    if (users.length === filteredUsers.length) {
      throw new Error('Usuário não encontrado');
    }

    await this.saveUsers(filteredUsers);
    return true;
  }

  // Listar todos os usuários (sem senhas)
  async findAll(filters = {}) {
    const users = await this.readUsers();
    let filteredUsers = users;

    // Aplicar filtros
    if (filters.userType) {
      filteredUsers = filteredUsers.filter(user => user.userType === filters.userType);
    }

    if (filters.verified !== undefined) {
      filteredUsers = filteredUsers.filter(user => user.verified === filters.verified);
    }

    // Remover senhas
    return filteredUsers.map(({ password, ...user }) => user);
  }

  // Verificar senha (comparação direta - NÃO SEGURO!)
  async verifyPassword(plainPassword, storedPassword) {
    // return bcrypt.compare(plainPassword, hashedPassword);
    return plainPassword === storedPassword; // Comparação direta de texto
  }
}

module.exports = new User();
