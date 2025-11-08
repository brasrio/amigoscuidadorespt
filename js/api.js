// Configuração da API
const API_URL = 'http://localhost:5000/api';

// Classe para gerenciar chamadas à API
class AmigosAPI {
    constructor() {
        this.token = localStorage.getItem('authToken');
    }

    // Headers padrão para requisições
    getHeaders(includeAuth = true) {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (includeAuth && this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return headers;
    }

    // Salvar token
    setToken(token) {
        this.token = token;
        localStorage.setItem('authToken', token);
    }

    // Remover token
    clearToken() {
        this.token = null;
        localStorage.removeItem('authToken');
    }

    // Registro de novo usuário
    async register(userData) {
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: this.getHeaders(false),
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (response.ok) {
                this.setToken(data.data.token);
                return { success: true, data: data.data };
            }

            return { success: false, message: data.message, errors: data.errors };
        } catch (error) {
            return { success: false, message: 'Erro de conexão com o servidor' };
        }
    }

    // Login
    async login(email, password) {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: this.getHeaders(false),
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                this.setToken(data.data.token);
                return { success: true, data: data.data };
            }

            return { success: false, message: data.message };
        } catch (error) {
            return { success: false, message: 'Erro de conexão com o servidor' };
        }
    }

    // Logout
    logout() {
        this.clearToken();
        return { success: true };
    }

    // Verificar se está autenticado
    async verifyAuth() {
        if (!this.token) {
            return { success: false, authenticated: false };
        }

        try {
            const response = await fetch(`${API_URL}/auth/verify`, {
                headers: this.getHeaders()
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, authenticated: true, user: data.data.user };
            }

            this.clearToken();
            return { success: false, authenticated: false };
        } catch (error) {
            return { success: false, authenticated: false };
        }
    }

    // Obter perfil do usuário
    async getProfile() {
        try {
            const response = await fetch(`${API_URL}/users/profile`, {
                headers: this.getHeaders()
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, data: data.data };
            }

            return { success: false, message: data.message };
        } catch (error) {
            return { success: false, message: 'Erro ao obter perfil' };
        }
    }

    // Atualizar perfil
    async updateProfile(updateData) {
        try {
            const response = await fetch(`${API_URL}/users/profile`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(updateData)
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, data: data.data };
            }

            return { success: false, message: data.message, errors: data.errors };
        } catch (error) {
            return { success: false, message: 'Erro ao atualizar perfil' };
        }
    }

    // Listar profissionais
    async listProfessionals(filters = {}) {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const url = `${API_URL}/users/professionals${queryParams ? '?' + queryParams : ''}`;

            const response = await fetch(url, {
                headers: this.getHeaders()
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, data: data.data, total: data.total };
            }

            return { success: false, message: data.message };
        } catch (error) {
            return { success: false, message: 'Erro ao listar profissionais' };
        }
    }

    // Obter detalhes de um profissional
    async getProfessionalDetails(id) {
        try {
            const response = await fetch(`${API_URL}/users/professionals/${id}`, {
                headers: this.getHeaders()
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, data: data.data };
            }

            return { success: false, message: data.message };
        } catch (error) {
            return { success: false, message: 'Erro ao obter detalhes do profissional' };
        }
    }

    // Atualizar usuário como admin
    async adminUpdateUser(userId, updateData) {
        try {
            const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(updateData)
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, data: data.data };
            }

            return { success: false, message: data.message, errors: data.errors };
        } catch (error) {
            return { success: false, message: 'Erro ao atualizar usuário' };
        }
    }

    // Excluir usuário como admin
    async adminDeleteUser(userId) {
        try {
            const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
                method: 'DELETE',
                headers: this.getHeaders()
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true };
            }

            return { success: false, message: data.message || 'Erro ao excluir usuário' };
        } catch (error) {
            return { success: false, message: 'Erro ao excluir usuário' };
        }
    }
}

// Instância global da API
const api = new AmigosAPI();

// Exportar para uso em outros scripts
window.AmigosAPI = AmigosAPI;
window.api = api;
