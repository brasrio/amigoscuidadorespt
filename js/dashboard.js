// Dashboard JavaScript - Amigos Cuidadores

// Estado global
let currentUser = null;
let currentPage = 'home';
let adminUsersCache = [];
let currentAdminUserId = null;

// Inicialização
document.addEventListener('DOMContentLoaded', async function() {
    // Verificar autenticação
    const authResult = await api.verifyAuth();
    
    if (!authResult.authenticated) {
        window.location.href = 'login.html';
        return;
    }
    
    currentUser = authResult.user;
    
    // Configurar UI baseado no tipo de usuário
    setupUserInterface();
    
    // Configurar navegação
    setupNavigation();
    
    // Configurar logout
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    
    // Configurar menu mobile
    setupMobileMenu();
    
    // Carregar página inicial
    loadPage('home');
});

// Configurar interface baseada no tipo de usuário
function setupUserInterface() {
    // Definir tipo de usuário no body para CSS
    document.body.setAttribute('data-user-type', currentUser.userType);
    
    // Atualizar informações do usuário no header
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userType').textContent = getUserTypeLabel(currentUser.userType);
    
    // Atualizar avatar
    updateAvatar('headerAvatar', currentUser.avatar);
    
    // Nome de boas-vindas
    document.getElementById('welcomeName').textContent = currentUser.name.split(' ')[0];
}

// Obter label do tipo de usuário
function getUserTypeLabel(type) {
    const labels = {
        'client': 'Cliente',
        'caregiver': 'Cuidador',
        'nurse': 'Enfermeiro',
        'admin': 'Administrador'
    };
    return labels[type] || type;
}

// Configurar navegação
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.getAttribute('data-page');
            if (page) {
                loadPage(page);
            }
        });
    });
}

// Carregar página
function loadPage(pageName) {
    // Remover classe active de todos os nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Adicionar classe active ao nav item atual
    document.querySelector(`[data-page="${pageName}"]`)?.classList.add('active');
    
    // Esconder todas as páginas
    document.querySelectorAll('.dashboard-page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Mostrar página atual
    const pageElement = document.getElementById(`page-${pageName}`);
    if (pageElement) {
        pageElement.classList.add('active');
        currentPage = pageName;
        
        // Carregar conteúdo específico da página
        loadPageContent(pageName);
    }
}

// Carregar conteúdo específico de cada página
async function loadPageContent(pageName) {
    switch(pageName) {
        case 'home':
            await loadHomePage();
            break;
        case 'search':
            await loadSearchPage();
            break;
        case 'profile':
            await loadProfilePage();
            break;
        case 'users':
            await loadUsersPage();
            break;
        case 'payments':
            await loadPaymentsPage();
            break;
        case 'availability':
            await loadAvailabilityPage();
            break;
        case 'skills':
            await loadSkillsPage();
            break;
        case 'my-clients':
            await loadMyClientsPage();
            break;
    }
}

// Carregar página inicial
async function loadHomePage() {
    const statsGrid = document.getElementById('statsGrid');
    const quickActions = document.getElementById('quickActions');
    
    // Limpar conteúdo anterior
    statsGrid.innerHTML = '';
    quickActions.innerHTML = '';
    
    // Carregar estatísticas baseadas no tipo de usuário
    if (currentUser.userType === 'admin') {
        // Estatísticas do admin
        const stats = await getAdminStats();
        statsGrid.innerHTML = `
            <div class="stat-card">
                <div class="stat-header">
                    <div class="stat-icon primary">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                    </div>
                </div>
                <div class="stat-value">${stats.totalUsers || 0}</div>
                <div class="stat-label">Total de Usuários</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-header">
                    <div class="stat-icon success">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </div>
                </div>
                <div class="stat-value">${stats.activeCaregivers || 0}</div>
                <div class="stat-label">Cuidadores Ativos</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-header">
                    <div class="stat-icon warning">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                    </div>
                </div>
                <div class="stat-value">${stats.totalBookings || 0}</div>
                <div class="stat-label">Agendamentos</div>
            </div>
        `;
        
        // Ações rápidas do admin
        quickActions.innerHTML = `
            <a href="#" class="action-card" onclick="loadPage('users')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <line x1="20" y1="8" x2="20" y2="14"></line>
                    <line x1="23" y1="11" x2="17" y2="11"></line>
                </svg>
                <h3>Adicionar Usuário</h3>
                <p>Criar novo usuário no sistema</p>
            </a>
            
            <a href="#" class="action-card" onclick="loadPage('reports')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <h3>Ver Relatórios</h3>
                <p>Relatórios do sistema</p>
            </a>
        `;
    } else if (currentUser.userType === 'client') {
        // Estatísticas do cliente
        quickActions.innerHTML = `
            <a href="#" class="action-card" onclick="loadPage('search')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                </svg>
                <h3>Buscar Cuidador</h3>
                <p>Encontre o cuidador ideal</p>
            </a>
            
            <a href="#" class="action-card" onclick="loadPage('bookings')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <h3>Meus Agendamentos</h3>
                <p>Ver agendamentos ativos</p>
            </a>
        `;
    } else if (currentUser.userType === 'caregiver') {
        // Estatísticas do cuidador
        quickActions.innerHTML = `
            <a href="#" class="action-card" onclick="loadPage('availability')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <h3>Atualizar Disponibilidade</h3>
                <p>Defina seus horários</p>
            </a>
            
            <a href="#" class="action-card" onclick="loadPage('skills')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <h3>Skills & Certificados</h3>
                <p>Atualize suas qualificações</p>
            </a>
        `;
    }
}

// Obter estatísticas do admin
async function getAdminStats() {
    try {
        const users = await api.findAll();
        const caregivers = users.filter(u => u.userType === 'caregiver' || u.userType === 'nurse');
        const activeCaregivers = caregivers.filter(c => c.verified);
        
        return {
            totalUsers: users.length,
            activeCaregivers: activeCaregivers.length,
            totalBookings: 0 // TODO: Implementar quando tiver sistema de bookings
        };
    } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
        return {};
    }
}

// Carregar página de busca
async function loadSearchPage() {
    // Carregar distritos
    const distritoSelect = document.getElementById('searchDistrito');
    
    try {
        const response = await fetch('assets/json/portugal_distritos_municipios.json');
        const data = await response.json();
        
        distritoSelect.innerHTML = '<option value="">Todos os distritos</option>';
        data.distritos.forEach(distrito => {
            const option = document.createElement('option');
            option.value = distrito.nome;
            option.textContent = distrito.nome;
            distritoSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar distritos:', error);
    }
    
    // Configurar formulário de busca
    const searchForm = document.getElementById('searchForm');
    searchForm.addEventListener('submit', handleSearch);
}

// Lidar com busca
async function handleSearch(e) {
    e.preventDefault();
    
    const filters = {
        distrito: document.getElementById('searchDistrito').value,
        userType: document.getElementById('searchType').value,
        specialties: document.getElementById('searchSpecialties').value,
        maxRate: document.getElementById('searchMaxRate').value
    };
    
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = '<div class="loading">Buscando...</div>';
    
    try {
        const professionals = await api.listProfessionals(filters);
        
        if (professionals.data.length === 0) {
            resultsContainer.innerHTML = `
                <div class="empty-state">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    <h3>Nenhum cuidador encontrado</h3>
                    <p>Tente ajustar os filtros de busca</p>
                </div>
            `;
        } else {
            resultsContainer.innerHTML = professionals.data.map(prof => `
                <div class="caregiver-card">
                    <img src="${prof.avatar || 'assets/images/default-avatar.png'}" alt="${prof.name}" class="caregiver-avatar">
                    <div class="caregiver-info">
                        <h3 class="caregiver-name">${prof.name}</h3>
                        <p class="caregiver-specialties">${prof.professional?.specialties?.join(', ') || 'Sem especialidades definidas'}</p>
                        <div class="caregiver-rating">
                            <span class="rating-stars">${generateStars(prof.professional?.rating || 0)}</span>
                            <span>(${prof.professional?.totalReviews || 0} avaliações)</span>
                        </div>
                    </div>
                    <div class="caregiver-actions">
                        <div class="caregiver-rate">€${prof.professional?.hourlyRate || '0'}/hora</div>
                        <button class="btn btn-primary" onclick="viewProfessional('${prof.id}')">Ver Perfil</button>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Erro na busca:', error);
        resultsContainer.innerHTML = `
            <div class="empty-state">
                <h3>Erro ao buscar</h3>
                <p>Ocorreu um erro ao buscar cuidadores. Tente novamente.</p>
            </div>
        `;
    }
}

// Gerar estrelas de avaliação
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let stars = '★'.repeat(fullStars);
    if (halfStar) stars += '☆';
    stars += '☆'.repeat(emptyStars);
    
    return stars;
}

// Ver perfil do profissional
async function viewProfessional(id) {
    try {
        const modal = document.getElementById('professionalModal');
        modal.classList.add('active');

        // Estado inicial de carregamento
        document.getElementById('professionalModalAvatar').src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRTVFN0VCIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iMzUiIHI9IjE1IiBmaWxsPSIjOUM5Q0EzIi8+CjxwYXRoIGQ9Ik0yMCA3MFE1MCA1MCA4MCA3MCIgc3Ryb2tlPSIjOUM5Q0EzIiBzdHJva2Utd2lkdGg9IjgiIGZpbGw9Im5vbmUiLz4KPC9zdmc+';
        document.getElementById('professionalModalName').textContent = 'Carregando...';
        document.getElementById('professionalModalType').textContent = '';
        document.getElementById('professionalModalEmail').textContent = '';
        document.getElementById('professionalModalPhone').textContent = '';
        document.getElementById('professionalModalHourlyRate').textContent = '€ 0,00';
        document.getElementById('professionalModalExperience').textContent = '';
        document.getElementById('professionalModalAvailability').innerHTML = '<div class="loading">Carregando...</div>';
        document.getElementById('professionalModalSpecialties').innerHTML = '';
        document.getElementById('professionalModalCertificates').innerHTML = '';
        document.getElementById('professionalContactBtn').style.display = 'none';

        const response = await api.getProfessionalDetails(id);

        if (!response.success) {
            modal.classList.remove('active');
            showNotification(response.message || 'Erro ao carregar profissional', 'error');
            return;
        }

        populateProfessionalModal(response.data);
    } catch (error) {
        console.error('Erro ao carregar profissional:', error);
        showNotification('Erro ao carregar profissional', 'error');
        document.getElementById('professionalModal').classList.remove('active');
    }
}

// Carregar página de perfil
async function loadProfilePage() {
    // Atualizar informações do perfil
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileEmail').textContent = currentUser.email;
    document.getElementById('profileBadge').textContent = getUserTypeLabel(currentUser.userType);
    updateAvatar('profileAvatar', currentUser.avatar);
    
    // Carregar detalhes do perfil
    const detailsContainer = document.getElementById('profileDetails');
    detailsContainer.innerHTML = `
        <div class="detail-group">
            <span class="detail-label">Telefone:</span>
            <span class="detail-value">${currentUser.phone || 'Não informado'}</span>
        </div>
        <div class="detail-group">
            <span class="detail-label">Endereço:</span>
            <span class="detail-value">${formatAddress(currentUser.address) || 'Não informado'}</span>
        </div>
        <div class="detail-group">
            <span class="detail-label">Membro desde:</span>
            <span class="detail-value">${formatDate(currentUser.createdAt)}</span>
        </div>
        ${currentUser.userType === 'caregiver' ? `
            <div class="detail-group">
                <span class="detail-label">Biografia:</span>
                <span class="detail-value">${currentUser.professional?.bio || 'Não informada'}</span>
            </div>
            <div class="detail-group">
                <span class="detail-label">Taxa por hora:</span>
                <span class="detail-value">€${currentUser.professional?.hourlyRate || '0'}</span>
            </div>
            <div class="detail-group">
                <span class="detail-label">Especialidades:</span>
                <span class="detail-value">${currentUser.professional?.specialties?.join(', ') || 'Nenhuma'}</span>
            </div>
        ` : ''}
    `;
    
    // Configurar botão de edição
    const editProfileBtn = document.getElementById('editProfileBtn');
    editProfileBtn.onclick = openEditProfileModal;
    
    // Configurar upload de avatar
    const avatarBtn = document.getElementById('avatarUploadBtn');
    avatarBtn.onclick = () => {
        document.getElementById('avatarInput').click();
    };
    
    document.getElementById('avatarInput').onchange = handleAvatarUpload;
}

// Formatar endereço
function formatAddress(address) {
    if (!address || Object.keys(address).length === 0) return null;
    const parts = [];
    if (address.street) parts.push(address.street);
    if (address.city) parts.push(address.city);
    if (address.state) parts.push(address.state);
    return parts.join(', ');
}

// Formatar data
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
}

// Abrir modal de edição de perfil
function openEditProfileModal() {
    const modal = document.getElementById('editProfileModal');
    
    // Preencher formulário com dados atuais
    document.getElementById('editName').value = currentUser.name;
    document.getElementById('editPhone').value = currentUser.phone || '';
    document.getElementById('editAddress').value = formatAddress(currentUser.address) || '';
    
    if (currentUser.userType === 'caregiver') {
        document.getElementById('editBio').value = currentUser.professional?.bio || '';
        document.getElementById('editHourlyRate').value = currentUser.professional?.hourlyRate || '';
    }
    
    modal.classList.add('active');
    
    // Configurar formulário
    const form = document.getElementById('editProfileForm');
    form.addEventListener('submit', handleEditProfile);
}

// Lidar com edição de perfil
async function handleEditProfile(e) {
    e.preventDefault();
    
    const updateData = {
        name: document.getElementById('editName').value,
        phone: document.getElementById('editPhone').value
    };
    
    // Adicionar endereço se fornecido
    const addressValue = document.getElementById('editAddress').value;
    if (addressValue) {
        // Simplificado - em produção seria melhor ter campos separados
        updateData.address = { street: addressValue };
    }
    
    // Adicionar dados de cuidador se aplicável
    if (currentUser.userType === 'caregiver') {
        updateData.professional = {
            bio: document.getElementById('editBio').value,
            hourlyRate: parseFloat(document.getElementById('editHourlyRate').value) || 0
        };
    }
    
    try {
        const result = await api.updateProfile(updateData);
        
        if (result.success) {
            // Atualizar usuário atual
            currentUser = { ...currentUser, ...result.data };
            
            // Fechar modal
            closeModal('editProfileModal');
            
            // Recarregar página
            loadProfilePage();
            
            // Mostrar mensagem de sucesso
            showNotification('Perfil atualizado com sucesso!', 'success');
        } else {
            showNotification(result.message || 'Erro ao atualizar perfil', 'error');
        }
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        showNotification('Erro ao atualizar perfil', 'error');
    }
}

// Lidar com upload de avatar
async function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
        showNotification('Por favor, selecione uma imagem', 'error');
        return;
    }
    
    // Validar tamanho (máximo 2MB)
    if (file.size > 2 * 1024 * 1024) {
        showNotification('Imagem muito grande. Máximo 2MB', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = async function(e) {
        const imageData = e.target.result;
        
        // Atualizar avatares na UI temporariamente
        updateAvatar('headerAvatar', imageData);
        updateAvatar('profileAvatar', imageData);
        
        // Mostrar botão de salvar
        showSaveAvatarButton(imageData);
    };
    reader.readAsDataURL(file);
}

// Mostrar botão de salvar avatar
function showSaveAvatarButton(imageData) {
    // Verificar se já existe
    let saveBtn = document.getElementById('saveAvatarBtn');
    
    if (!saveBtn) {
        saveBtn = document.createElement('button');
        saveBtn.id = 'saveAvatarBtn';
        saveBtn.className = 'btn btn-success';
        saveBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            Salvar Avatar
        `;
        
        // Adicionar ao lado do botão de editar perfil
        const editBtn = document.getElementById('editProfileBtn');
        editBtn.parentNode.insertBefore(saveBtn, editBtn.nextSibling);
    }
    
    // Configurar evento de clique
    saveBtn.onclick = async () => {
        try {
            const result = await api.updateProfile({ avatar: imageData });
            
            if (result.success) {
                currentUser.avatar = imageData;
                showNotification('Avatar salvo com sucesso!', 'success');
                saveBtn.remove();
            } else {
                showNotification('Erro ao salvar avatar', 'error');
            }
        } catch (error) {
            console.error('Erro ao salvar avatar:', error);
            showNotification('Erro ao salvar avatar', 'error');
        }
    };
}

// Atualizar avatar
function updateAvatar(elementId, avatarUrl) {
    const element = document.getElementById(elementId);
    if (element) {
        // Usar avatar padrão SVG se não houver imagem
        const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRTVFN0VCIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iMzUiIHI9IjE1IiBmaWxsPSIjOUM5Q0EzIi8+CjxwYXRoIGQ9Ik0yMCA3MFE1MCA1MCA4MCA3MCIgc3Ryb2tlPSIjOUM5Q0EzIiBzdHJva2Utd2lkdGg9IjgiIGZpbGw9Im5vbmUiLz4KPC9zdmc+';
        element.src = avatarUrl || defaultAvatar;
    }
}

// Carregar página de usuários (Admin)
async function loadUsersPage() {
    if (currentUser.userType !== 'admin') {
        showNotification('Acesso negado', 'error');
        loadPage('home');
        return;
    }
    
    try {
        const users = await api.findAll();
        adminUsersCache = users;
        const tbody = document.getElementById('usersTableBody');
        
        tbody.innerHTML = users.map(user => `
            <tr>
                <td>
                    <img src="${user.avatar || 'assets/images/default-avatar.png'}" alt="${user.name}" class="user-avatar-cell">
                </td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${getUserTypeLabel(user.userType)}</td>
                <td>
                    <span class="user-status ${user.verified ? 'active' : 'inactive'}">
                        ${user.verified ? 'Ativo' : 'Inativo'}
                    </span>
                </td>
                <td>${formatDate(user.createdAt)}</td>
                <td>
                    <div class="user-actions">
                        <button class="action-btn edit" onclick="openAdminEditUser('${user.id}')">Editar</button>
                        <button class="action-btn delete" onclick="deleteUser('${user.id}')">Excluir</button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        // Configurar busca de usuários
        const searchInput = document.getElementById('userSearch');
        searchInput.oninput = (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const rows = tbody.querySelectorAll('tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        };
        
        // Configurar botão adicionar usuário
        document.getElementById('addUserBtn').onclick = () => {
            window.location.href = 'cadastro.html';
        };
        
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        showNotification('Erro ao carregar usuários', 'error');
    }
}

// Abrir modal de edição (Admin)
function openAdminEditUser(userId) {
    const user = adminUsersCache.find(u => u.id === userId);
    if (!user) {
        showNotification('Usuário não encontrado', 'error');
        return;
    }

    currentAdminUserId = userId;

    document.getElementById('adminEditUserId').value = userId;
    document.getElementById('adminEditName').value = user.name;
    document.getElementById('adminEditEmail').value = user.email;
    document.getElementById('adminEditType').value = user.userType;
    document.getElementById('adminEditVerified').checked = !!user.verified;

    const modal = document.getElementById('adminEditUserModal');
    modal.classList.add('active');

    const form = document.getElementById('adminEditUserForm');
    form.onsubmit = handleAdminEditUserSubmit;
}

// Submeter edição de usuário (Admin)
async function handleAdminEditUserSubmit(e) {
    e.preventDefault();
    if (!currentAdminUserId) return;

    const payload = {
        name: document.getElementById('adminEditName').value.trim(),
        email: document.getElementById('adminEditEmail').value.trim(),
        userType: document.getElementById('adminEditType').value,
        verified: document.getElementById('adminEditVerified').checked
    };

    try {
        const result = await api.adminUpdateUser(currentAdminUserId, payload);

        if (result.success) {
            showNotification('Usuário atualizado com sucesso!', 'success');
            closeModal('adminEditUserModal');
            await loadUsersPage();
        } else {
            const errorMessage = formatValidationErrors(result) || 'Erro ao atualizar usuário';
            showNotification(errorMessage, 'error');
        }
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        showNotification('Erro ao atualizar usuário', 'error');
    }
}

// Excluir usuário (Admin)
async function deleteUser(userId) {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;
    
    try {
        const result = await api.adminDeleteUser(userId);
        if (result.success) {
            showNotification('Usuário excluído com sucesso', 'success');
            await loadUsersPage();
        } else {
            showNotification(result.message || 'Erro ao excluir usuário', 'error');
        }
    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        showNotification('Erro ao excluir usuário', 'error');
    }
}

// Carregar página de pagamentos
async function loadPaymentsPage() {
    // TODO: Implementar sistema de pagamentos
    const paymentCards = document.getElementById('paymentCards');
    paymentCards.innerHTML = `
        <div class="payment-card">
            <div class="card-number">•••• •••• •••• 4242</div>
            <div class="card-info">
                <span>Visa</span>
                <span>12/25</span>
            </div>
        </div>
    `;
    
    const transactionsList = document.getElementById('transactionsList');
    transactionsList.innerHTML = `
        <div class="transaction-item">
            <div class="transaction-details">
                <h4>Pagamento de Serviço</h4>
                <span class="transaction-date">7 Nov 2025</span>
            </div>
            <div class="transaction-amount debit">-€50.00</div>
        </div>
    `;
}

// Carregar página de disponibilidade (Cuidador)
async function loadAvailabilityPage() {
    const page = document.getElementById('page-availability');

    if (currentUser.userType !== 'caregiver') {
        page.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <h3>Disponível apenas para cuidadores</h3>
                <p>Somente perfis de cuidadores podem definir disponibilidade.</p>
            </div>
        `;
        return;
    }

    page.innerHTML = `
        <div class="availability-container">
            <div class="section-header">
                <div>
                    <h2>Minha Disponibilidade</h2>
                    <p>Informe os dias e horários em que está disponível para atender.</p>
                </div>
                <button class="btn btn-primary" id="addAvailabilityBtn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Adicionar horário
                </button>
            </div>

            <div class="availability-list" id="availabilityList"></div>
        </div>

        <div class="modal" id="availabilityModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Adicionar disponibilidade</h2>
                    <button class="modal-close" data-modal="availabilityModal">&times;</button>
                </div>
                <form id="availabilityForm">
                    <div class="form-group">
                        <label>Dia da semana</label>
                        <select id="availabilityDay" required>
                            <option value="">Selecione o dia</option>
                            <option value="Segunda-feira">Segunda-feira</option>
                            <option value="Terça-feira">Terça-feira</option>
                            <option value="Quarta-feira">Quarta-feira</option>
                            <option value="Quinta-feira">Quinta-feira</option>
                            <option value="Sexta-feira">Sexta-feira</option>
                            <option value="Sábado">Sábado</option>
                            <option value="Domingo">Domingo</option>
                        </select>
                    </div>
                    <div class="form-group inline">
                        <div>
                            <label>Horário de início</label>
                            <input type="time" id="availabilityStart" required>
                        </div>
                        <div>
                            <label>Horário de término</label>
                            <input type="time" id="availabilityEnd" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Observações (opcional)</label>
                        <textarea id="availabilityNotes" rows="3" placeholder="Ex: Preferência por atendimentos domiciliares"></textarea>
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary" data-modal="availabilityModal">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Salvar horário</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    renderAvailability();

    document.getElementById('addAvailabilityBtn').addEventListener('click', () => {
        document.getElementById('availabilityForm').reset();
        document.getElementById('availabilityModal').classList.add('active');
    });

    document.getElementById('availabilityForm').addEventListener('submit', handleAvailabilitySubmit);
}

// Carregar página de skills (Cuidador)
async function loadSkillsPage() {
    const page = document.getElementById('page-skills');

    if (currentUser.userType !== 'caregiver') {
        page.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <h3>Disponível apenas para cuidadores</h3>
                <p>Somente perfis de cuidadores podem gerenciar skills e certificados.</p>
            </div>
        `;
        return;
    }

    page.innerHTML = `
        <div class="skills-container">
            <div class="skills-section">
                <div class="section-header">
                    <div>
                        <h2>Especialidades</h2>
                        <p>Adicione as áreas nas quais você possui experiência.</p>
                    </div>
                    <button class="btn btn-primary" id="addSpecialtyBtn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Adicionar especialidade
                    </button>
                </div>
                <div class="tag-list" id="specialtiesList"></div>
            </div>

            <div class="skills-section">
                <div class="section-header">
                    <div>
                        <h2>Certificados</h2>
                        <p>Registre certificados e formações que comprovam sua experiência.</p>
                    </div>
                    <button class="btn btn-primary" id="addCertificateBtn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Adicionar certificado
                    </button>
                </div>
                <div class="certificate-list" id="certificatesList"></div>
            </div>
        </div>

        <div class="modal" id="specialtyModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Nova especialidade</h2>
                    <button class="modal-close" data-modal="specialtyModal">&times;</button>
                </div>
                <form id="specialtyForm">
                    <div class="form-group">
                        <label>Especialidade</label>
                        <input type="text" id="specialtyInput" placeholder="Ex: Alzheimer, Cuidados paliativos" required>
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary" data-modal="specialtyModal">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Adicionar</button>
                    </div>
                </form>
            </div>
        </div>

        <div class="modal" id="certificateModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Novo certificado</h2>
                    <button class="modal-close" data-modal="certificateModal">&times;</button>
                </div>
                <form id="certificateForm">
                    <div class="form-group">
                        <label>Nome do certificado</label>
                        <input type="text" id="certificateName" placeholder="Ex: Curso de Primeiros Socorros" required>
                    </div>
                    <div class="form-group">
                        <label>Instituição (opcional)</label>
                        <input type="text" id="certificateIssuer" placeholder="Ex: Cruz Vermelha Portuguesa">
                    </div>
                    <div class="form-group inline">
                        <div>
                            <label>Data de emissão</label>
                            <input type="date" id="certificateDate">
                        </div>
                        <div>
                            <label>Validade</label>
                            <input type="date" id="certificateExpiry">
                        </div>
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary" data-modal="certificateModal">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Adicionar</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    renderSpecialties();
    renderCertificates();

    document.getElementById('addSpecialtyBtn').addEventListener('click', () => {
        document.getElementById('specialtyForm').reset();
        document.getElementById('specialtyModal').classList.add('active');
    });

    document.getElementById('addCertificateBtn').addEventListener('click', () => {
        document.getElementById('certificateForm').reset();
        document.getElementById('certificateModal').classList.add('active');
    });

    document.getElementById('specialtyForm').addEventListener('submit', handleSpecialtySubmit);
    document.getElementById('certificateForm').addEventListener('submit', handleCertificateSubmit);
}

// Carregar página de clientes (Cuidador)
async function loadMyClientsPage() {
    const page = document.getElementById('page-my-clients');

    if (currentUser.userType !== 'caregiver') {
        page.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <h3>Disponível apenas para cuidadores</h3>
                <p>Somente perfis de cuidadores possuem esta seção.</p>
            </div>
        `;
        return;
    }

    page.innerHTML = `
        <div class="empty-state subtle">
            <h3>Nenhum cliente registrado</h3>
            <p>Futuramente você verá aqui os clientes com agendamentos confirmados.</p>
        </div>
    `;
}

// Renderizar disponibilidade
function renderAvailability() {
    const list = document.getElementById('availabilityList');
    const slots = currentUser.professional?.availability?.slots || [];

    if (!slots.length) {
        list.innerHTML = `
            <div class="empty-state subtle">
                <h3>Nenhum horário cadastrado</h3>
                <p>Adicione seus horários disponíveis para facilitar o agendamento.</p>
            </div>
        `;
        return;
    }

    list.innerHTML = slots.map((slot, index) => `
        <div class="availability-card">
            <div class="card-left">
                <div class="availability-day">${slot.day}</div>
                <div class="availability-time">${slot.start} - ${slot.end}</div>
                ${slot.notes ? `<p class="availability-notes">${slot.notes}</p>` : ''}
            </div>
            <button class="btn btn-secondary btn-small" data-index="${index}" data-action="remove-slot">
                Remover
            </button>
        </div>
    `).join('');

    list.querySelectorAll('[data-action="remove-slot"]').forEach(btn => {
        btn.addEventListener('click', async () => {
            const idx = parseInt(btn.getAttribute('data-index'), 10);
            const updatedSlots = slots.filter((_, i) => i !== idx);
            await saveAvailability(updatedSlots);
        });
    });
}

// Salvar disponibilidade
async function saveAvailability(slots) {
    try {
        const professional = {
            ...(currentUser.professional || {}),
            availability: { slots }
        };

        const result = await api.updateProfile({ professional });

        if (result.success) {
            currentUser = { ...currentUser, ...result.data };
            renderAvailability();
            showNotification('Disponibilidade atualizada!', 'success');
        } else {
            const errorMessage = formatValidationErrors(result) || 'Erro ao salvar disponibilidade';
            showNotification(errorMessage, 'error');
        }
    } catch (error) {
        console.error('Erro ao salvar disponibilidade:', error);
        showNotification('Erro ao salvar disponibilidade', 'error');
    } finally {
        closeModal('availabilityModal');
    }
}

// Submeter disponibilidade
async function handleAvailabilitySubmit(e) {
    e.preventDefault();

    const slot = {
        day: document.getElementById('availabilityDay').value,
        start: document.getElementById('availabilityStart').value,
        end: document.getElementById('availabilityEnd').value,
        notes: document.getElementById('availabilityNotes').value.trim()
    };

    if (!slot.day || !slot.start || !slot.end) {
        showNotification('Preencha todos os campos obrigatórios', 'error');
        return;
    }

    const currentSlots = currentUser.professional?.availability?.slots || [];
    await saveAvailability([...currentSlots, slot]);
}

// Renderizar especialidades
function renderSpecialties() {
    const container = document.getElementById('specialtiesList');
    const specialties = currentUser.professional?.specialties || [];

    if (!specialties.length) {
        container.innerHTML = `
            <div class="empty-state subtle">
                <h3>Nenhuma especialidade cadastrada</h3>
                <p>Adicione as áreas em que você possui experiência.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = specialties.map((specialty, index) => `
        <span class="tag">
            ${specialty}
            <button type="button" data-index="${index}" data-action="remove-specialty">&times;</button>
        </span>
    `).join('');

    container.querySelectorAll('[data-action="remove-specialty"]').forEach(btn => {
        btn.addEventListener('click', async () => {
            const idx = parseInt(btn.getAttribute('data-index'), 10);
            const updated = specialties.filter((_, i) => i !== idx);
            await saveSpecialties(updated);
        });
    });
}

// Salvar especialidades
async function saveSpecialties(specialties) {
    try {
        const professional = {
            ...(currentUser.professional || {}),
            specialties
        };

        const result = await api.updateProfile({ professional });

        if (result.success) {
            currentUser = { ...currentUser, ...result.data };
            renderSpecialties();
            showNotification('Especialidades atualizadas!', 'success');
        } else {
            const errorMessage = formatValidationErrors(result) || 'Erro ao salvar especialidades';
            showNotification(errorMessage, 'error');
        }
    } catch (error) {
        console.error('Erro ao salvar especialidades:', error);
        showNotification('Erro ao salvar especialidades', 'error');
    } finally {
        closeModal('specialtyModal');
    }
}

// Lidar com envio de especialidade
async function handleSpecialtySubmit(e) {
    e.preventDefault();
    const input = document.getElementById('specialtyInput');
    const value = input.value.trim();

    if (!value) return;

    const currentSpecialties = currentUser.professional?.specialties || [];
    await saveSpecialties([...currentSpecialties, value]);
}

// Renderizar certificados
function renderCertificates() {
    const container = document.getElementById('certificatesList');
    const certificates = currentUser.professional?.certifications || [];

    if (!certificates.length) {
        container.innerHTML = `
            <div class="empty-state subtle">
                <h3>Nenhum certificado cadastrado</h3>
                <p>Adicione certificados e cursos que comprovem seu conhecimento.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = certificates.map((cert, index) => `
        <div class="certificate-card">
            <div class="certificate-info">
                <h3>${cert.name}</h3>
                ${cert.issuer ? `<p class="certificate-issuer">${cert.issuer}</p>` : ''}
                <div class="certificate-dates">
                    ${cert.issueDate ? `<span>Emitido em: ${formatDate(cert.issueDate)}</span>` : ''}
                    ${cert.expiryDate ? `<span>Válido até: ${formatDate(cert.expiryDate)}</span>` : '<span>Sem validade definida</span>'}
                </div>
            </div>
            <button class="btn btn-secondary btn-small" data-index="${index}" data-action="remove-certificate">Remover</button>
        </div>
    `).join('');

    container.querySelectorAll('[data-action="remove-certificate"]').forEach(btn => {
        btn.addEventListener('click', async () => {
            const idx = parseInt(btn.getAttribute('data-index'), 10);
            const updated = certificates.filter((_, i) => i !== idx);
            await saveCertificates(updated);
        });
    });
}

// Salvar certificados
async function saveCertificates(certifications) {
    try {
        const professional = {
            ...(currentUser.professional || {}),
            certifications
        };

        const result = await api.updateProfile({ professional });

        if (result.success) {
            currentUser = { ...currentUser, ...result.data };
            renderCertificates();
            showNotification('Certificados atualizados!', 'success');
        } else {
            const errorMessage = formatValidationErrors(result) || 'Erro ao salvar certificados';
            showNotification(errorMessage, 'error');
        }
    } catch (error) {
        console.error('Erro ao salvar certificados:', error);
        showNotification('Erro ao salvar certificados', 'error');
    } finally {
        closeModal('certificateModal');
    }
}

// Lidar com envio de certificado
async function handleCertificateSubmit(e) {
    e.preventDefault();

    const certificate = {
        name: document.getElementById('certificateName').value.trim(),
        issuer: document.getElementById('certificateIssuer').value.trim(),
        issueDate: document.getElementById('certificateDate').value || null,
        expiryDate: document.getElementById('certificateExpiry').value || null
    };

    if (!certificate.name) return;

    const currentCertificates = currentUser.professional?.certifications || [];
    await saveCertificates([...currentCertificates, certificate]);
}

function populateProfessionalModal(professional) {
    const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRTVFN0VCIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iMzUiIHI9IjE1IiBmaWxsPSIjOUM5Q0EzIi8+CjxwYXRoIGQ9Ik0yMCA3MFE1MCA1MCA4MCA3MCIgc3Ryb2tlPSIjOUM5Q0EzIiBzdHJva2Utd2lkdGg9IjgiIGZpbGw9Im5vbmUiLz4KPC9zdmc+';

    document.getElementById('professionalModalAvatar').src = professional.avatar || defaultAvatar;
    document.getElementById('professionalModalName').textContent = professional.name;
    document.getElementById('professionalModalType').textContent = getUserTypeLabel(professional.userType || 'caregiver');
    document.getElementById('professionalModalEmail').textContent = professional.email || 'Email não informado';
    document.getElementById('professionalModalPhone').textContent = professional.phone || 'Telefone não informado';

    const hourlyRate = professional.professional?.hourlyRate;
    document.getElementById('professionalModalHourlyRate').textContent = hourlyRate ? `€ ${Number(hourlyRate).toFixed(2)}` : 'Não informada';

    document.getElementById('professionalModalExperience').textContent = professional.professional?.experience || 'Experiência não informada';

    renderProfessionalAvailability(professional.professional?.availability?.slots || []);
    renderProfessionalSpecialties(professional.professional?.specialties || []);
    renderProfessionalCertificates(professional.professional?.certifications || []);

    const contactBtn = document.getElementById('professionalContactBtn');
    const phoneDigits = (professional.phone || '').replace(/\D/g, '');
    if (phoneDigits.length >= 9) {
        contactBtn.href = `https://wa.me/${phoneDigits.startsWith('0') ? phoneDigits.slice(1) : phoneDigits}`;
        contactBtn.style.display = 'inline-flex';
    } else {
        contactBtn.style.display = 'none';
    }
}

function renderProfessionalAvailability(slots) {
    const container = document.getElementById('professionalModalAvailability');
    if (!slots.length) {
        container.innerHTML = '<span class="detail-value">Disponibilidade não informada</span>';
        return;
    }

    container.innerHTML = slots.map(slot => `
        <div class="availability-card">
            <div class="card-left">
                <div class="availability-day">${slot.day}</div>
                <div class="availability-time">${slot.start} - ${slot.end}</div>
                ${slot.notes ? `<p class="availability-notes">${slot.notes}</p>` : ''}
            </div>
        </div>
    `).join('');
}

function renderProfessionalSpecialties(specialties) {
    const container = document.getElementById('professionalModalSpecialties');
    if (!specialties.length) {
        container.innerHTML = '<div class="empty-state subtle">Nenhuma especialidade informada</div>';
        return;
    }

    container.innerHTML = specialties.map(spec => `
        <span class="tag">${spec}</span>
    `).join('');
}

function renderProfessionalCertificates(certificates) {
    const container = document.getElementById('professionalModalCertificates');
    if (!certificates.length) {
        container.innerHTML = '<div class="empty-state subtle">Nenhum certificado informado</div>';
        return;
    }

    container.innerHTML = certificates.map(cert => `
        <div class="certificate-card">
            <div class="certificate-info">
                <h3>${cert.name}</h3>
                ${cert.issuer ? `<p class="certificate-issuer">${cert.issuer}</p>` : ''}
                <div class="certificate-dates">
                    ${cert.issueDate ? `<span>Emitido em: ${formatDate(cert.issueDate)}</span>` : ''}
                    ${cert.expiryDate ? `<span>Válido até: ${formatDate(cert.expiryDate)}</span>` : '<span>Sem validade definida</span>'}
                </div>
            </div>
        </div>
    `).join('');
}

// Configurar menu mobile
function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
    
    // Fechar menu ao clicar fora
    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    });
}

// Lidar com logout
function handleLogout() {
    if (confirm('Tem certeza que deseja sair?')) {
        api.logout();
        window.location.href = 'index.html';
    }
}

// Fechar modal
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Configurar fechamento de modais
document.querySelectorAll('.modal-close, [data-modal]').forEach(element => {
    element.addEventListener('click', function() {
        const modalId = this.getAttribute('data-modal') || this.closest('.modal').id;
        closeModal(modalId);
    });
});

// Mostrar notificação
function showNotification(message, type = 'info') {
    // TODO: Implementar sistema de notificações mais elaborado
    alert(message);
}

function formatValidationErrors(result) {
    if (result?.errors && result.errors.length) {
        return 'Erros:\n' + result.errors.map(err => `${err.field}: ${err.message}`).join('\n');
    }
    return result?.message || null;
}

// Adicionar método findAll à API
api.findAll = async function() {
    try {
        const response = await fetch('http://localhost:5000/api/users', {
            headers: this.getHeaders()
        });
        
        const data = await response.json();
        
        if (response.ok) {
            return data.data || [];
        }
        
        return [];
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        return [];
    }
};

// Exportar funções globais
window.loadPage = loadPage;
window.viewProfessional = viewProfessional;
window.openAdminEditUser = openAdminEditUser;
window.deleteUser = deleteUser;
