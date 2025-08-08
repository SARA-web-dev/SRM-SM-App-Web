// Configuration globale

const CONFIG = {
    API_BASE_URL: window.location.origin + '/api',
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_FILE_TYPES: ['application/pdf'],
    TOAST_DURATION: 5000
};


// État global de l'application
const AppState = {
    currentUser: null,
    userType: null,
    token: null,
    isLoading: false,
    currentView: 'auth',
    demandes: [],
    adminDemandes: []
};

// Utilitaires
const Utils = {
    show(element) {
        if (typeof element === 'string') {
            element = document.getElementById(element);
        }
        if (element) {
            element.classList.remove('hidden');
            element.style.display = '';
        }
    },

    hide(element) {
        if (typeof element === 'string') {
            element = document.getElementById(element);
        }
        if (element) {
            element.classList.add('hidden');
            element.style.display = 'none';
        }
    },

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    clearForm(formId) {
        const form = document.getElementById(formId);
        if (form) {
            form.reset();
            const previews = form.querySelectorAll('.file-preview');
            previews.forEach(preview => {
                preview.classList.add('hidden');
            });
        }
    },

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

};

// Service API
const ApiService = {
    getHeaders(includeAuth = false, isFormData = false) {
        const headers = {};
        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
        }
        if (includeAuth && AppState.token) {
            headers['Authorization'] = `Bearer ${AppState.token}`;
        }
        return headers;
    },

    async handleResponse(response) {
        try {
            const data = await response.json();
            return response.ok ? { success: true, data } : { success: false, message: data.message || 'Erreur serveur' };
        } catch (error) {
            return { success: false, message: 'Erreur de communication avec le serveur' };
        }
    },

    async registerCandidat(formData) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/candidat/inscription`, {
                method: 'POST',
                body: formData
            });
            return await this.handleResponse(response);
        } catch (error) {
            return { success: false, message: 'Erreur de connexion au serveur' };
        }
    },

    async loginCandidat(email, motDePasse) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/candidat/login`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({ email, motDePasse })
            });
            return await this.handleResponse(response);
        } catch (error) {
            return { success: false, message: 'Erreur de connexion au serveur' };
        }
    },

    async loginAdmin(email, motDePasse) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/admin/login`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({ email, motDePasse })
            });
            return await this.handleResponse(response);
        } catch (error) {
            return { success: false, message: 'Erreur de connexion au serveur' };
        }
    },

    async submitDemande(formData) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/demande`, {
                method: 'POST',
                headers: this.getHeaders(true, true),
                body: formData
            });
            return await this.handleResponse(response);
        } catch (error) {
            return { success: false, message: 'Erreur de connexion au serveur' };
        }
    },

    async getCandidatDemandes() {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/candidat/demandes`, {
                headers: this.getHeaders(true)
            });
            return await this.handleResponse(response);
        } catch (error) {
            return { success: false, message: 'Erreur de connexion au serveur' };
        }
    },

    async getAdminDemandes(filters = {}) {
        try {
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });

            const response = await fetch(`${CONFIG.API_BASE_URL}/admin/demandes?${params}`, {
                headers: this.getHeaders(true)
            });
            return await this.handleResponse(response);
        } catch (error) {
            return { success: false, message: 'Erreur de connexion au serveur' };
        }
    },
    
    async updateDemandeDecision(id, decisionRH, motifRejet = '') {
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/admin/demandes/${id}`, {
            method: 'PUT',
            headers: this.getHeaders(true),
            body: JSON.stringify({ decisionRH, motifRejet })
        });

        // 🔥 Vérifie le statut HTTP
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || 'Erreur serveur');
        }

        // 🔥 Parse la réponse JSON
        const data = await response.json();

        // 🔥 Retourne toujours un objet avec `success`
        return {
            success: true,
            message: data.message || 'Succès'
        };
    } catch (error) {
        console.error("❌ Erreur réseau ou serveur :", error);
        return {
            success: false,
            message: 'Erreur de connexion au serveur'
        };
    }
}, 

    async getMessages(idDemande) {
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/messages/${idDemande}`, {
        headers: this.getHeaders(true)
        });
        const result = await response.json();
        return Array.isArray(result) ? result : result?.data || [];
    } catch (error) {
        console.error('❌ Erreur récupération messages:', error);
        return [];
    }
    },

    async sendMessage(idDemande, message) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/messages`, {
                method: 'POST',
                headers: this.getHeaders(true),
                body: JSON.stringify({ idDemande, message })
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('❌ Erreur envoi message:', error);
            return { success: false, message: 'Erreur réseau' };
        }
    },


    async getAdminDemandesWithMessages() {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/admin/demandes/with-messages`, {
                headers: this.getHeaders(true)
            });
            return await this.handleResponse(response);
        } catch (error) {
            return { success: false, message: 'Erreur de connexion au serveur' };
        }
    },
   

};

// Gestionnaire de messages toast
const ToastManager = {
    queue: [],
    isShowing: false,

    show(message, type = 'success', duration = CONFIG.TOAST_DURATION) {
        this.queue.push({ message, type, duration });
        this.processQueue();
    },

    processQueue() {
        if (this.isShowing || this.queue.length === 0) return;

        this.isShowing = true;
        const { message, type, duration } = this.queue.shift();

        const toast = document.getElementById('messageToast');
        const toastMessage = document.getElementById('toastMessage');
        const toastIcon = toast.querySelector('.toast-icon i');

        toastMessage.textContent = message;
        toast.className = `message-toast ${type}`;

        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        toastIcon.className = `fas ${icons[type] || 'fa-info-circle'}`;

        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
            this.isShowing = false;
            setTimeout(() => this.processQueue(), 300);
        }, duration);
    },

    hide() {
        const toast = document.getElementById('messageToast');
        toast.classList.remove('show');
    }
};  

// ===== NOTIFICATION SERVICE =====
const NotificationService = {
    send(type, recipientId, recipientRole, data) {
        const payload = {
            type,
            recipientId,
            recipientRole,
            data,
            timestamp: new Date().toISOString(),
            read: false
        };

        const key = `pending_notifications_${recipientRole}_${recipientId}`;
        const pending = JSON.parse(localStorage.getItem(key) || '[]');
        pending.push(payload);
        localStorage.setItem(key, JSON.stringify(pending));
    }
}; 

const NotificationManager = {
    showPendingNotifications(role, userId) {
        const key = `pending_notifications_${role}_${userId}`;
        const pending = JSON.parse(localStorage.getItem(key) || '[]');

        if (pending.length === 0) return;

        pending.forEach(n => {
            if (n.type === 'new_demand' && role === 'admin') {
                ToastManager.show(`📄 ${n.data.nom} a soumis une demande (${n.data.domaine})`, 'info');
            }

            if (n.type === 'status_change' && role === 'candidat') {
                ToastManager.show(` Votre demande ${n.data.domaine} est ${n.data.statut}`, 'success');
            }
        });

        // Nettoie après affichage
        localStorage.removeItem(key);
    }
};

// Gestionnaire d'authentification
const AuthManager = {
    checkAuth() {
        const token = localStorage.getItem('token');
        const userType = localStorage.getItem('userType');
        const userData = localStorage.getItem('userData');

        if (token && userType && userData) {
            try {
                AppState.token = token;
                AppState.userType = userType;
                AppState.currentUser = JSON.parse(userData);
                this.showDashboard();
                return true;
            } catch (error) {
                console.error('Erreur récupération données utilisateur:', error);
                this.logout();
                return false;
            }
        }
        
        this.showAuth();
        return false;
    },

    login(userData, token, userType) {
        AppState.currentUser = userData;
        AppState.token = token;
        AppState.userType = userType;

        localStorage.setItem('token', token);
        localStorage.setItem('userType', userType);
        localStorage.setItem('userData', JSON.stringify(userData));

        this.showDashboard();
    },

    logout() {
        AppState.currentUser = null;
        AppState.token = null;
        AppState.userType = null;
        AppState.demandes = [];
        AppState.adminDemandes = [];

        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        localStorage.removeItem('userData');

        this.showAuth();
        ToastManager.show('Déconnexion réussie', 'success');
    },

    showAuth() {
        document.getElementById('mainHeader').classList.add('hidden');
        document.getElementById('dashboardContainer').classList.add('hidden');
        document.getElementById('authContainer').style.display = 'flex';
        
        document.querySelectorAll('.dashboard-content').forEach(el => {
            el.classList.remove('active');
            el.classList.add('hidden');
        });
    }, 


    showDashboard() {
            document.getElementById('authContainer').style.display = 'none';
            document.getElementById('mainHeader').classList.remove('hidden');
            document.getElementById('dashboardContainer').classList.remove('hidden');

            document.getElementById('mainContainer').classList.remove('hidden');
            document.getElementById('dashboardContainer').style.display = 'block';

            this.updateUserInfo();
                
            if (AppState.userType === 'candidat') {
                this.showCandidatSection();
            } else if (AppState.userType === 'admin') {
                this.showAdminSection(); 
            } 

    }, 


    showCandidatSection() {
        document.getElementById('candidatDashboard').classList.remove('hidden');
        document.getElementById('candidatDashboard').classList.add('active');
        document.getElementById('adminDashboard').classList.add('hidden');
        document.getElementById('adminDashboard').classList.remove('active');
        document.getElementById('nouvelleDemandeContainer').classList.add('hidden');
        DashboardManager.loadCandidatDemandes(); 
        NotificationManager.showPendingNotifications('candidat', AppState.currentUser?.id);
    },

    showAdminSection() {
        document.getElementById('adminDashboard').classList.remove('hidden');
        document.getElementById('adminDashboard').classList.add('active');
        document.getElementById('candidatDashboard').classList.add('hidden');
        document.getElementById('candidatDashboard').classList.remove('active');
        document.getElementById('nouvelleDemandeContainer').classList.add('hidden');
        DashboardManager.loadAdminDemandes(); 
        //NotificationManager.showPendingNotifications('admin', AppState.currentUser?.id);
        NotificationManager.showPendingNotifications('admin', 'admin');
    },



    updateUserInfo() {
        const userName = document.getElementById('userName');
        const userRole = document.getElementById('userRole');

        if (AppState.currentUser) {
            if (AppState.userType === 'candidat') {
                userName.textContent = `${AppState.currentUser.prenom} ${AppState.currentUser.nom}`;
                userRole.textContent = 'Candidat';
            } else {
                userName.textContent = AppState.currentUser.nom;
                userRole.textContent = 'Administrateur';
            }
        }
    }
};

// Gestionnaire de tableau de bord
const DashboardManager = { 
    async loadCandidatDemandes() {
        try {
            const result = await ApiService.getCandidatDemandes();
            
            if (result.success) {
                AppState.demandes = result.data || [];
                this.updateCandidatStats();
                this.renderCandidatDemandes();
            } else {
                ToastManager.show(result.message || 'Erreur lors du chargement des demandes', 'error');
            }
        } catch (error) {
            ToastManager.show('Erreur de connexion au serveur', 'error');
        }
    },

    async loadAdminDemandes(filters = {}) {
        try {
            const btnRefresh = document.getElementById('btnRefreshAdmin');
            if (btnRefresh) {
                btnRefresh.disabled = true;
                btnRefresh.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            }

            const result = await ApiService.getAdminDemandes(filters);
            
            if (result.success) {
                AppState.adminDemandes = result.data.demandes || [];
                this.updateAdminStats();
                this.renderAdminDemandes();
            } else {
                ToastManager.show(result.message || 'Erreur lors du chargement des demandes', 'error');
            }
        } catch (error) {
            ToastManager.show('Erreur de connexion au serveur', 'error');
        } finally {
            const btnRefresh = document.getElementById('btnRefreshAdmin');
            if (btnRefresh) {
                btnRefresh.disabled = false;
                btnRefresh.innerHTML = '<i class="fas fa-sync-alt"></i> Actualiser';
            }
        }
    },

    updateCandidatStats() {
        const total = AppState.demandes.length;
        const enAttente = AppState.demandes.filter(d => d.statut === 'En attente').length;
        const acceptees = AppState.demandes.filter(d => d.statut === 'Accepté').length;
        const rejetees = AppState.demandes.filter(d => d.statut === 'Rejeté').length;

        document.getElementById('totalDemandes').textContent = total;
        document.getElementById('demandesEnAttente').textContent = enAttente;
        document.getElementById('demandesAcceptees').textContent = acceptees;
        document.getElementById('demandesRejetees').textContent = rejetees;
    },

    updateAdminStats() {
        const total = AppState.adminDemandes.length;
        const enAttente = AppState.adminDemandes.filter(d => d.statut === 'En attente').length;
        const acceptees = AppState.adminDemandes.filter(d => d.statut === 'Accepté').length;
        const rejetees = AppState.adminDemandes.filter(d => d.statut === 'Rejeté').length;

        document.getElementById('adminTotalDemandes').textContent = total;
        document.getElementById('adminDemandesEnAttente').textContent = enAttente;
        document.getElementById('adminDemandesAcceptees').textContent = acceptees;
        document.getElementById('adminDemandesRejetees').textContent = rejetees;
    },

    renderCandidatDemandes() {
        const container = document.getElementById('demandesList');
        
        if (AppState.demandes.length === 0) {
            container.innerHTML = `
                <div class="text-center" style="padding: 3rem;">
                    <i class="fas fa-file-alt" style="font-size: 3rem; color: var(--gray-300); margin-bottom: 1rem;"></i>
                    <h3 style="color: var(--gray-500); margin-bottom: 0.5rem;">Aucune demande trouvée</h3>
                    <p style="color: var(--gray-400);">Commencez par soumettre votre première demande de stage</p>
                </div>
            `;
            return;
        }

        container.innerHTML = AppState.demandes.map(demande => `
            <div class="demande-card">
                <div class="demande-header">
                    <h3 class="demande-title">
                        <i class="fas fa-briefcase"></i>
                        ${demande.domaine} - ${demande.etablissement}
                    </h3>
                    <span class="status-badge ${this.getStatusClass(demande.statut)}">
                        ${demande.statut}
                    </span>
                </div>
                
                <div class="demande-details">  
                    <div class="detail-item"> 
                        <span class="detail-label">Niveau</span>
                        <span class="detail-value">${demande.niveau}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Date de dépôt</span>
                        <span class="detail-value">${Utils.formatDate(demande.dateDepot)}</span>
                    </div>
                </div>

                ${demande.competencesML && demande.competencesML.length > 0 ? `
                    <div class="skills-container">
                        <span class="detail-label">Compétences détectées:</span>
                        <div class="skills-list">
                            ${demande.competencesML.map(skill => `
                                <span class="skill-tag">${skill}</span>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <div class="demande-actions">
                    <a href="${CONFIG.API_BASE_URL.replace('/api', '')}${demande.cvUrl}" target="_blank" class="action-btn">
                        <i class="fas fa-download"></i> CV
                    </a>
                    <a href="${CONFIG.API_BASE_URL.replace('/api', '')}${demande.lettreUrl}" target="_blank" class="action-btn">
                        <i class="fas fa-download"></i> Lettre
                    </a>
                    <button class="action-btn contact-btn" data-id="${demande.idDemande}">
                        <i class="fas fa-comment"></i> Contacter
                    </button>
                </div>
        `).join('');
    }, 
    
    renderAdminDemandes() {
    const container = document.getElementById('adminDemandesContainer');
    
    if (AppState.adminDemandes.length === 0) {
        container.innerHTML = `
            <div class="text-center" style="padding: 3rem;">
                <i class="fas fa-users" style="font-size: 3rem; color: var(--gray-300); margin-bottom: 1rem;"></i>
                <h3 style="color: var(--gray-500); margin-bottom: 0.5rem;">Aucune demande à gérer</h3>
                <p style="color: var(--gray-400);">Les nouvelles demandes apparaîtront ici</p>
            </div>
        `;
        return;
    }

    // Tableau uniquement (sans graphiques)
    container.innerHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>Candidat</th>
                    <th>Domaine</th>
                    <th>Statut</th>
                    <th>Score ML</th>
                    <th>Date</th>
                    <th>Décision</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${AppState.adminDemandes.map(demande => `
                    <tr data-id="${demande.idDemande}">
                        <td>
                            <div>
                                <div style="font-weight: 600;">${demande.prenom} ${demande.nom}</div>
                                <div style="font-size: 0.875rem; color: var(--gray-600);">${demande.email}</div>
                            </div>
                        </td>
                        <td>
                            <div>${demande.domaine}</div>
                            <div style="font-size: 0.875rem; color: var(--gray-600);">${demande.niveau}</div>
                        </td>
                        <td>
                            <span class="status-badge ${this.getStatusClass(demande.statut)}">
                                ${demande.statut}
                            </span>
                        </td>
                        <td>${demande.scoreML ? `${Math.round(demande.scoreML * 100)}%` : '-'}</td>
                        <td>${Utils.formatDate(demande.dateDepot)}</td>
                        <td>
                            <select class="decision-select" data-id="${demande.idDemande}">
                                <option value="En attente" ${demande.decisionRH === 'En attente' ? 'selected' : ''}>En attente</option>
                                <option value="Accepté" ${demande.decisionRH === 'Accepté' ? 'selected' : ''}>Accepté</option>
                                <option value="Rejeté" ${demande.decisionRH === 'Rejeté' ? 'selected' : ''}>Rejeté</option>
                            </select>
                        </td>
                        <td>
                            <div class="table-actions">
                                <button class="save-btn" data-id="${demande.idDemande}">
                                    <i class="fas fa-save"></i> Enregistrer
                                </button> 
                                <!-- ✅ Bouton Contacter -->
                                <button class="contact-btn" data-id="${demande.idDemande}" data-candidat="${demande.idCandidat}">
                                    <i class="fas fa-comment"></i> Contacter
                                </button>
                                <a href="${CONFIG.API_BASE_URL.replace('/api', '')}${demande.cvUrl}" target="_blank" class="action-btn">
                                    <i class="fas fa-download"></i> CV
                                </a>
                                <a href="${CONFIG.API_BASE_URL.replace('/api', '')}${demande.lettreUrl}" target="_blank" class="action-btn">
                                    <i class="fas fa-download"></i> Lettre
                                </a>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    // ✅ Attacher le clic sur les boutons "Contacter"
    document.addEventListener('click', async (e) => {
    const btn = e.target.closest('.contact-btn');
    if (btn) {
        e.preventDefault();
        const idDemande = btn.dataset.id;
        await openMessageModal(idDemande);
    }
});



    // 🎯 Affichage des graphiques dans la section Analytics 
    this.attachAdminEventListeners();
    this.renderAnalytics();
},

    renderAnalytics() {
    // Vérifier si Chart.js est chargé
    if (typeof Chart === 'undefined') {
        console.error('Chart.js non chargé');
        return;
    }

    // 🔥 Nettoyer complètement le conteneur
    const analyticsSection = document.getElementById('analyticsSection');
    analyticsSection.innerHTML = '';

    // 🔥 Recréer les conteneurs frais
    const container1 = document.createElement('div');
    container1.className = 'chart-container';
    const canvas1 = document.createElement('canvas');
    canvas1.id = 'demandesChart';
    canvas1.width = 400;
    canvas1.height = 200;
    container1.appendChild(canvas1);

    const container2 = document.createElement('div');
    container2.className = 'chart-container';
    const canvas2 = document.createElement('canvas');
    canvas2.id = 'acceptationChart';
    canvas2.width = 400;
    canvas2.height = 200;
    container2.appendChild(canvas2);

    analyticsSection.appendChild(container1);
    analyticsSection.appendChild(container2);

    this.loadRealData();
}, 


async loadRealData() {
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/admin/analytics`, {
            headers: ApiService.getHeaders(true)
        });
        const result = await response.json();
        
        if (result.success) {
            this.renderRealCharts(result.data);
        } else {
            this.renderRealCharts(result.data); // Fallback
        }
    } catch (error) {
        console.error('Erreur chargement données réelles:', error);
        this.renderRealCharts({
            demandesParMois: [
                { mois: 'Jan', acceptes: 0, rejetes: 0, enAttente: 0 }
            ],
            tauxAcceptation: [
                { domaine: 'En attente de données', taux: 0 }
            ]
        });
    }
}, 



renderRealCharts(data) { 

    // 🔥 Détruire les instances Chart.js existantes
    Chart.helpers.each(Chart.instances, (chart) => {
        chart.destroy();
    });

    // 🔥 Forcer le nettoyage des canvas
    const canvas1 = document.getElementById('demandesChart');
    const canvas2 = document.getElementById('acceptationChart');
    
    if (canvas1) {
        canvas1.remove();
        const newCanvas1 = document.createElement('canvas');
        newCanvas1.id = 'demandesChart';
        newCanvas1.width = 400;
        newCanvas1.height = 200;
        document.querySelector('.chart-container').appendChild(newCanvas1);
    }
    
    if (canvas2) {
        canvas2.remove();
        const newCanvas2 = document.createElement('canvas');
        newCanvas2.id = 'acceptationChart';
        newCanvas2.width = 400;
        newCanvas2.height = 200;
        document.querySelectorAll('.chart-container')[1].appendChild(newCanvas2);
    }

    // Graphique 1 : Demandes par mois
    const ctx1 = document.getElementById('demandesChart');
    if (ctx1 && data.demandesParMois?.length > 0) {
        new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: data.demandesParMois.map(item => item.mois),
                datasets: [{
                    label: 'Acceptés',
                    data: data.demandesParMois.map(item => item.acceptes),
                    backgroundColor: '#10b981'
                }, {
                    label: 'Rejetés',
                    data: data.demandesParMois.map(item => item.rejetes),
                    backgroundColor: '#ef4444'
                }, {
                    label: 'En attente',
                    data: data.demandesParMois.map(item => item.enAttente),
                    backgroundColor: '#f59e0b'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: `Demandes (${data.demandesParMois.reduce((sum, item) => sum + item.total, 0)} au total)`
                    }
                }
            }
        });
    }

    // Graphique 2 : Taux par domaine
    const ctx2 = document.getElementById('acceptationChart');
    if (ctx2 && data.tauxAcceptation?.length > 0) {
        new Chart(ctx2, {
            type: 'doughnut',
            data: {
                labels: data.tauxAcceptation.map(item => item.domaine),
                datasets: [{
                    data: data.tauxAcceptation.map(item => item.taux),
                    backgroundColor: ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#820273', '#9333ea']
                }] 
            
            }, 
            
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Taux d\'acceptation par domaine (%)'
                    }
                }
            }
        });
    } 
},
    attachAdminEventListeners() {

        // Gestionnaires pour les boutons de sauvegarde
document.querySelectorAll('.save-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
        e.preventDefault();

        const btn = e.target;
        const id = btn.dataset.id;
        const row = btn.closest('tr');
        
        const decisionSelect = row.querySelector(`.decision-select[data-id="${id}"]`);
        const motifInput = row.querySelector(`.motif-input[data-id="${id}"]`);
        
        const decision = decisionSelect?.value || '';
        const motif = motifInput?.value || ''; // ✅ protégé

        if (decision === 'Rejeté' && !motif.trim()) {
            ToastManager.show('Motif de rejet requis', 'warning');
            motifInput?.focus();
            return;
        }

        try {
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

            const result = await ApiService.updateDemandeDecision(id, decision, motif);

            if (result.success) {
                ToastManager.show(' Décision enregistrée', 'success'); 
                // 🔥 Stockage côté frontend pour le candidat
                // 🔥 Récupère l'ID du candidat depuis la ligne du tableau
                const idCandidat = row.dataset.idCandidat || row.querySelector('.save-btn')?.dataset.id;
                const candidatRow = AppState.adminDemandes.find(d => d.idDemande == idCandidat);
                if (!candidatRow) return;

                const key = `pending_notifications_candidat_${candidatRow.idCandidat}`; 
                const pending = JSON.parse(localStorage.getItem(key) || '[]');
                pending.push({
                    type: 'status_change',
                    data: {
                        domaine: candidatRow.domaine,
                        statut: decision
                    },
                    timestamp: new Date().toISOString()
                });
                localStorage.setItem(key, JSON.stringify(pending));
               

                // 🔥 Mettre à jour l’affichage localement
                const statusBadge = row.querySelector('.status-badge');
                if (statusBadge) {
                    statusBadge.textContent = decision;
                    statusBadge.className = `status-badge ${DashboardManager.getStatusClass(decision)}`;
                }

                // 🔥 Recharger les stats sans recharger toute la page
                await DashboardManager.loadAdminDemandes();
            } else {
                ToastManager.show(result.message || 'Erreur', 'error');
            }
        } catch (error) {
            console.error("❌ Erreur réseau :", error);
            ToastManager.show('Erreur réseau', 'error');
        } finally {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-save"></i> Enregistrer';
        }
    });
}); 



    
// ✅ Attacher le clic sur TOUS les boutons "Contacter"
document.addEventListener('click', (e) => {
    if (e.target.matches('#closeModalBtn') || e.target.closest('#closeModalBtn')) {
        const modal = document.getElementById('messagerieModal');
        modal.classList.add('hidden');
        modal.style.display = 'none'; 
    }
});

        // Gestionnaires pour les changements de décision
        document.querySelectorAll('.decision-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const id = e.target.dataset.id;
                const row = e.target.closest('tr');
                const motifInput = row.querySelector(`.motif-input[data-id="${id}"]`);
                
                if (e.target.value === 'Rejeté') {
                    if (!motifInput) {
                        const newMotifInput = document.createElement('input');
                        newMotifInput.type = 'text';
                        newMotifInput.placeholder = 'Motif de rejet';
                        newMotifInput.className = 'motif-input';
                        newMotifInput.dataset.id = id;
                        newMotifInput.style.cssText = 'margin-top: 0.5rem; padding: 0.5rem; border: 1px solid var(--gray-300); border-radius: 0.25rem; width: 100%;';
                        e.target.parentNode.appendChild(newMotifInput);
                    }
                } else {
                    if (motifInput) {
                        motifInput.remove();
                    }
                }
            });
        });
    },

    getStatusClass(statut) {
        switch (statut?.toLowerCase()) {
            case 'accepté': return 'success';
            case 'rejeté': return 'danger';
            default: return 'pending';
        }
    },  
    
};

class DashboardCharts {
    constructor() {
        this.init();
    }

    async init() {
        if (AppState.userType !== 'admin') return;
        
        // Attendre que le DOM soit prêt
        setTimeout(() => {
            this.loadRealData();
        }, 500);
    }

    async loadRealData() {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/admin/analytics`, {
                headers: ApiService.getHeaders(true)
            });
            
            const result = await response.json();
            const data = result.success ? result.data : this.getFallbackData();
            
            this.renderRealCharts(data);
            
        } catch (error) {
            console.error('Erreur chargement données:', error);
            this.renderRealCharts(this.getFallbackData());
        }
    }

    getFallbackData() {
        return {
            demandesParMois: [
                { mois: 'Aucune données', acceptes: 0, rejetes: 0, enAttente: 0 }
            ],
            tauxAcceptation: [
                { domaine: 'En attente', taux: 0 }
            ]
        };
    } 

   
    renderRealCharts(data) { 
    // Vérifier si Chart.js est chargé 
    if (typeof Chart === 'undefined') {
        console.error('Chart.js non chargé');
        return;
    } 

    const analyticsSection = document.getElementById('analyticsSection');
    if (!analyticsSection) return;  

    // 🔥 1. Détruire TOUTES les instances existantes
     Chart.helpers.each(Chart.instances, (chart) => {
        chart.destroy();
    });

    // Nettoyer et recréer conteneurs
    analyticsSection.innerHTML = `
        <div class="chart-container">
            <canvas id="demandesChart" width="400" height="200"></canvas>
        </div>
        <div class="chart-container">
            <canvas id="acceptationChart" width="400" height="200"></canvas>
        </div>
    `;

    // Graphique 1 : Demandes par mois
    if (data.demandesParMois?.length > 0) {
        const ctx1 = document.getElementById('demandesChart');
        new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: data.demandesParMois.map(item => item.mois),
                datasets: [{
                    label: 'Acceptés',
                    data: data.demandesParMois.map(item => item.acceptes),
                    backgroundColor: '#10b981'
                }, {
                    label: 'Rejetés',
                    data: data.demandesParMois.map(item => item.rejetes),
                    backgroundColor: '#ef4444'
                }, {
                    label: 'En attente',
                    data: data.demandesParMois.map(item => item.enAttente),
                    backgroundColor: '#f59e0b'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: `Total: ${data.demandesParMois.reduce((sum, item) => sum + item.total || 0, 0)} demandes`
                    }
                }
            }
        });
    }

    // Graphique 2 : Taux par domaine
    if (data.tauxAcceptation?.length > 0) {
        const ctx2 = document.getElementById('acceptationChart');
        new Chart(ctx2, {
            type: 'doughnut',
            data: {
                labels: data.tauxAcceptation.map(item => item.domaine),
                datasets: [{
                    data: data.tauxAcceptation.map(item => item.taux),
                    backgroundColor: ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#9333ea']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Taux d\'acceptation par domaine (%)'
                    }
                }
            }
        });
    }
}
    
    // Méthode pour rafraîchir les graphiques
    async refresh() {
        await this.loadRealData();
    } 

    // Fonction pour ordonner les mois correctement
sortMonthsByDate(data) {
    const monthsOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Créer un objet avec les mois manquants
    const monthsData = {};
    data.forEach(item => {
        monthsData[item.mois] = item;
    });

    // Retourner dans l'ordre chronologique
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    
    const result = [];
    for (let i = 11; i >= 0; i--) {
        const date = new Date(currentYear, currentMonth - i, 1);
        const monthName = date.toLocaleString('en-US', { month: 'short' });
        const monthYear = date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
        
        if (monthsData[monthName]) {
            result.push(monthsData[monthName]);
        } else {
            // Mois sans données
            result.push({
                mois: monthName,
                total: 0,
                acceptes: 0,
                rejetes: 0,
                enAttente: 0
            });
        }
    }
    
    return result;
}

};


// Gestionnaire de formulaires
const FormManager = {
    init() {
        this.initAuthForms();
        this.initDemandeForm();
        this.initFileUploads();
    },

    initAuthForms() {
        const formInscription = document.getElementById('formInscription');
        if (formInscription) {
            formInscription.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleInscription(e.target);
            });
        }

        const formConnexion = document.getElementById('formConnexion');
        if (formConnexion) {
            formConnexion.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleConnexionCandidat(e.target);
            });
        }

        const formAdmin = document.getElementById('formAdmin');
        if (formAdmin) {
            formAdmin.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleConnexionAdmin(e.target);
            });
        }
    },

    initDemandeForm() {
        const formNouvelleDemande = document.getElementById('formNouvelleDemande');
        if (formNouvelleDemande) {
            formNouvelleDemande.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleNouvelleDemande(e.target);
            });
        }
    },

    initFileUploads() {
        this.initFileUpload('cvFile', 'cvPreview', 'cvUploadArea');
        this.initFileUpload('lettreFile', 'lettrePreview', 'lettreUploadArea');
    },

    initFileUpload(inputId, previewId, areaId) {
        const input = document.getElementById(inputId);
        const preview = document.getElementById(previewId);
        const area = document.getElementById(areaId);

        if (!input || !preview || !area) return;

        input.addEventListener('change', (e) => {
            this.handleFileSelect(e.target.files[0], preview, area);
        });

        ['dragover', 'dragenter'].forEach(event => {
            area.addEventListener(event, (e) => {
                e.preventDefault();
                area.classList.add('dragover');
            });
        });

        ['dragleave', 'dragend', 'drop'].forEach(event => {
            area.addEventListener(event, (e) => {
                e.preventDefault();
                area.classList.remove('dragover');
            });
        });

        area.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                input.files = files;
                this.handleFileSelect(files[0], preview, area);
            }
        });
    },

    handleFileSelect(file, preview, area) {
        if (!file) {
            preview.classList.add('hidden');
            return;
        }

        if (!CONFIG.ALLOWED_FILE_TYPES.includes(file.type)) {
            ToastManager.show('Seuls les fichiers PDF sont acceptés', 'error');
            return;
        }

        if (file.size > CONFIG.MAX_FILE_SIZE) {
            ToastManager.show('Le fichier est trop volumineux (max 5MB)', 'error');
            return;
        }

        preview.innerHTML = `
            <div class="file-info">
                <div class="file-name">${file.name}</div>
                <div class="file-size">${Utils.formatFileSize(file.size)}</div>
            </div>
            <button type="button" class="remove-file" onclick="this.closest('.file-upload-area').querySelector('input').value=''; this.closest('.file-preview').classList.add('hidden');">
                <i class="fas fa-times"></i>
            </button>
        `;
        preview.classList.remove('hidden');
    },

    async handleInscription(form) {
        const submitBtn = form.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('span');
        const btnLoader = submitBtn.querySelector('.btn-loader');

        try {
            btnText.style.opacity = '0';
            btnLoader.classList.remove('hidden');
            submitBtn.disabled = true;

            const formData = new FormData(form);
            
            if (!this.validateInscriptionForm(formData)) return;

            const result = await ApiService.registerCandidat(formData);

            if (result.success) {
                ToastManager.show('Inscription réussie! Vous pouvez maintenant vous connecter.', 'success');
                Utils.clearForm('formInscription');
                TabManager.setActiveTab('connexion');
            } else {
                ToastManager.show(result.message || 'Erreur lors de l\'inscription', 'error');
            }
        } finally {
            btnText.style.opacity = '1';
            btnLoader.classList.add('hidden');
            submitBtn.disabled = false;
        }
    },

  async handleConnexionCandidat(form) {
    const submitBtn = form.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('span');
    const btnLoader = submitBtn.querySelector('.btn-loader');

  try {
    btnText.style.opacity = '0';
    btnLoader.classList.remove('hidden');
    submitBtn.disabled = true;

    const formData = new FormData(form);
    const email = formData.get('email');
    const motDePasse = formData.get('motDePasse');

    if (!email || !motDePasse) {
      ToastManager.show('Veuillez remplir tous les champs', 'warning');
      return;
    }

    // 🔓 Essayer d’abord en tant que candidat
    let result = await ApiService.loginCandidat(email, motDePasse);

    if (!result.success) {
      // 🔓 Sinon, essayer en tant qu’admin
      result = await ApiService.loginAdmin(email, motDePasse);
    }

    if (result.success) {
      const role = result.data.token ? 'candidat' : 'admin'; // ou via userType
      const user = result.data.user || result.data.admin;
      const token = result.data.token;

      AuthManager.login(user, token, role);
      ToastManager.show('Connexion réussie !', 'success');
      Utils.clearForm('formConnexion');
    } else {
      ToastManager.show(result.message || 'Identifiants incorrects', 'error');
    }
  } finally {
    btnText.style.opacity = '1';
    btnLoader.classList.add('hidden');
    submitBtn.disabled = false;
  }
},

    async handleConnexionAdmin(form) {
        const submitBtn = form.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('span');
        const btnLoader = submitBtn.querySelector('.btn-loader');

        try {
            btnText.style.opacity = '0';
            btnLoader.classList.remove('hidden');
            submitBtn.disabled = true;

            const formData = new FormData(form);
            const email = formData.get('email');
            const motDePasse = formData.get('motDePasse');

            if (!email || !motDePasse) {
                ToastManager.show('Veuillez remplir tous les champs', 'warning');
                return;
            }

            const result = await ApiService.loginAdmin(email, motDePasse);

            if (result.success) {
                AuthManager.login(result.data.admin, result.data.token, 'admin');
                ToastManager.show('Connexion administrateur réussie!', 'success');
                Utils.clearForm('formAdmin');
            } else {
                ToastManager.show(result.message || 'Identifiants administrateur incorrects', 'error');
            }
        } finally {
            btnText.style.opacity = '1';
            btnLoader.classList.add('hidden');
            submitBtn.disabled = false;
        }
    },

   async handleNouvelleDemande(form) {
    const submitBtn = form.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('span');
    const btnLoader = submitBtn.querySelector('.btn-loader');

    try {
        btnText.style.opacity = '0';
        btnLoader.classList.remove('hidden');
        submitBtn.disabled = true;

        const formData = new FormData(form);
        if (!this.validateDemandeForm(formData)) return;

        const result = await ApiService.submitDemande(formData);

        if (result.success) {
            ToastManager.show('Demande soumise avec succès!', 'success');

            // 🔥 Notification pour l’admin
            const adminId = 'admin'; // ID fixe de l’admin
            const key = `pending_notifications_admin_${adminId}`;
            const pending = JSON.parse(localStorage.getItem(key) || '[]');

            pending.push({
                type: 'new_demand',
                data: {
                    nom: AppState.currentUser.prenom + ' ' + AppState.currentUser.nom,
                    domaine: formData.get('domaine')
                },
                timestamp: new Date().toISOString()
            });

            localStorage.setItem(key, JSON.stringify(pending));

            Utils.clearForm('formNouvelleDemande');
            AuthManager.showCandidatSection();
        } else {
            ToastManager.show(result.message || 'Erreur lors de la soumission', 'error');
        }
    } finally {
        btnText.style.opacity = '1';
        btnLoader.classList.add('hidden');
        submitBtn.disabled = false;
    }
},

    validateInscriptionForm(formData) {
        const nom = formData.get('nom');
        const prenom = formData.get('prenom');
        const email = formData.get('email');
        const motDePasse = formData.get('motDePasse');
        const etablissement = formData.get('etablissement');
        const domaine = formData.get('domaine');
        const niveau = formData.get('niveau');

        if (!nom || !prenom || !email || !motDePasse || !etablissement || !domaine || !niveau) {
            ToastManager.show('Veuillez remplir tous les champs obligatoires', 'warning');
            return false;
        }

        if (!Utils.isValidEmail(email)) {
            ToastManager.show('Adresse email invalide', 'warning');
            return false;
        }

        if (motDePasse.length < 6) {
            ToastManager.show('Le mot de passe doit contenir au moins 6 caractères', 'warning');
            return false;
        }

        return true;
    },

    validateDemandeForm(formData) {
        const domaine = formData.get('domaine');
        const etablissement = formData.get('etablissement');
        const niveau = formData.get('niveau');
        const cv = formData.get('cv');
        const lettre = formData.get('lettre');

        if (!domaine || !etablissement || !niveau) {
            ToastManager.show('Veuillez remplir tous les champs obligatoires', 'warning');
            return false;
        }

        if (!cv || cv.size === 0) {
            ToastManager.show('Veuillez sélectionner un fichier CV', 'warning');
            return false;
        }

        if (!lettre || lettre.size === 0) {
            ToastManager.show('Veuillez sélectionner une lettre de motivation', 'warning');
            return false;
        }

        return true;
    }
};

// Gestionnaire d'onglets
const TabManager = {
    init() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabId = e.target.dataset.tab;
                this.setActiveTab(tabId);
            });
        });
    },

    setActiveTab(tabId) {
    if (!tabId || typeof tabId !== 'string') return; // ← Protection

    // Désactiver tous les onglets et formulaires
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });

    // Activer l'onglet et le formulaire sélectionnés
    const activeBtn = document.querySelector(`[data-tab="${tabId}"]`);
    const activeForm = document.getElementById(`form${tabId.charAt(0).toUpperCase() + tabId.slice(1)}`);

    if (activeBtn) activeBtn.classList.add('active');
    if (activeForm) activeForm.classList.add('active');
    }
};

// Gestionnaire de filtres
const FilterManager = {
    init() {
        const btnApplyFilters = document.getElementById('btnApplyFilters');
        if (btnApplyFilters) {
            btnApplyFilters.addEventListener('click', (e) => {
                e.preventDefault();
                this.applyFilters();
            });
        }

        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', Utils.debounce(() => {
                this.applyFilters();
            }, 500));
        }
    },

    async applyFilters() {
        const btnApply = document.getElementById('btnApplyFilters');
        const originalText = btnApply ? btnApply.innerHTML : 'Appliquer';

        try {
            if (btnApply) {
                btnApply.disabled = true;
                btnApply.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Filtrage...';
            }

            const filters = {
                statut: document.getElementById('filterStatut')?.value || '',
                domaine: document.getElementById('filterDomaine')?.value || '',
                search: document.getElementById('searchInput')?.value || ''
            };

            Object.keys(filters).forEach(key => {
                if (!filters[key]) delete filters[key];
            });

            await DashboardManager.loadAdminDemandes(filters);

        } finally {
            if (btnApply) {
                btnApply.disabled = false;
                btnApply.innerHTML = originalText;
            }
        }
    }
}; 


async function openMessageModal(idDemande) {
    console.log("📩 Ouverture conversation pour demande ID :", idDemande);

    Utils.show('messagerieModal');
    const messagesList = document.getElementById('messagesList');
    messagesList.innerHTML = '<p style="padding: 20px; color: #6b7280;">Chargement...</p>';

    const messages = await ApiService.getMessages?.(idDemande) || [];
    renderMessages(messages);

    document.getElementById('messageInput').value = '';
    document.getElementById('sendMessageBtn').onclick = async () => {
        const text = document.getElementById('messageInput').value.trim();
        if (!text) return;
        await ApiService.sendMessage?.(idDemande, text);
        await openMessageModal(idDemande); // recharger
    };
};

function renderMessages(messages) {
    const container = document.getElementById('messagesList');
    if (!container) {
        console.error("Container messagesList introuvable");
        return;
    }

    container.innerHTML = '';

    if (!messages || messages.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #6b7280;">Aucun message dans cette conversation</p>';
        return;
    }

    messages.forEach(msg => {
        const div = document.createElement('div');
        div.className = `message ${msg.roleExpediteur || 'unknown'}`;
        
        const senderName = msg.prenom && msg.nom 
            ? `${msg.prenom} ${msg.nom}` 
            : (msg.roleExpediteur === 'admin' ? 'Administrateur' : 'Candidat');
        
        div.innerHTML = `
            <div class="message-content">
                <strong>${senderName}</strong>
                <p>${msg.message}</p>
                <small>${new Date(msg.dateEnvoi).toLocaleString('fr-FR')}</small>
            </div>
        `;
        
        container.appendChild(div);
    });

    // Scroll vers le bas
    container.scrollTop = container.scrollHeight;
}; 

// Ajoutez cette fonction pour récupérer et afficher les demandes avec messages
async function loadDemandeMessages() {
    try {
        const result = await ApiService.getAdminDemandesWithMessages();
        if (result.success) {
            renderDemandeCards(result.data);
        }
    } catch (error) {
        console.error('Erreur chargement demandes:', error);
    }
};

function renderDemandeCards(demandes) {
    const container = document.getElementById('adminDemandesContainer');
    
    if (!demandes.length) {
        container.innerHTML = `
            <div class="text-center" style="padding: 3rem;">
                <i class="fas fa-comment" style="font-size: 3rem; color: var(--gray-300); margin-bottom: 1rem;"></i>
                <h3 style="color: var(--gray-500);">Aucune demande avec messages</h3>
                <p style="color: var(--gray-400);">Les demandes avec messages apparaîtront ici</p>
            </div>
        `;
        return;
    }

    container.innerHTML = demandes.map(demande => `
        <div class="demande-card" data-id="${demande.idDemande}">
            <div class="demande-header">
                <h3 class="demande-title">
                    <i class="fas fa-user"></i>
                    ${demande.candidat_prenom} ${demande.candidat_nom}
                </h3>
                <span class="status-badge ${DashboardManager.getStatusClass(demande.statut)}">
                    ${demande.statut}
                </span>
            </div>
            
            <div class="demande-details">
                <div class="detail-item">
                    <span class="detail-label">Email</span>
                    <span class="detail-value">${demande.candidat_email}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Téléphone</span>
                    <span class="detail-value">${demande.candidat_telephone || '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Domaine</span>
                    <span class="detail-value">${demande.domaine}</span>
                </div>
            </div>
            
            <div class="demande-actions">
                <button class="primary-btn contact-btn" data-id="${demande.idDemande}">
                    <i class="fas fa-comment"></i> Voir messages
                </button>
                <a href="${CONFIG.API_BASE_URL.replace('/api', '')}${demande.cvUrl}" target="_blank" class="action-btn">
                    <i class="fas fa-download"></i> CV
                </a>
                <a href="${CONFIG.API_BASE_URL.replace('/api', '')}${demande.lettreUrl}" target="_blank" class="action-btn">
                    <i class="fas fa-download"></i> Lettre
                </a>
            </div>
        </div>
    `).join('');

    // Attacher les événements
    document.querySelectorAll('.contact-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idDemande = e.target.dataset.id;
            openMessageModal(idDemande);
        });
    });
}; 

// 🔧 Ajoute cette fonction pour tester les messages
async function testMessages() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error("❌ Pas de token trouvé dans localStorage");
        return;
    }

    try {
        const res = await fetch('http://localhost:3000/api/messages/1', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!res.ok) {
            console.error("❌ Erreur HTTP:", res.status, res.statusText);
            return;
        }
        
        const data = await res.json();
        console.log("✅ Messages récupérés:", data);
    } catch (err) {
        console.error("❌ Erreur réseau:", err);
    }
};

// 🔄 Corrige également la fonction ApiService.getMessages
ApiService.getMessages = async function(idDemande) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("❌ Pas de token pour getMessages");
            return [];
        }

        const response = await fetch(`${CONFIG.API_BASE_URL}/messages/${idDemande}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            console.error("❌ Erreur API:", response.status);
            return [];
        }

        const result = await response.json();
        return result.messages || [];
    } catch (error) {
        console.error("❌ Erreur getMessages:", error);
        return [];
    }
};

// 🔄 Corrige également ApiService.getAdminDemandesWithMessages
ApiService.getAdminDemandesWithMessages = async function() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("❌ Pas de token pour getAdminDemandesWithMessages");
            return { success: false, data: [] };
        }

        const response = await fetch(`${CONFIG.API_BASE_URL}/admin/demandes/with-messages`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return await this.handleResponse(response);
    } catch (error) {
        console.error("❌ Erreur getAdminDemandesWithMessages:", error);
        return { success: false, data: [] };
    }
};

// Fonction de validation du mot de passe
function validatePassword(password) {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    const hasMinLength = password.length >= 8;

    const errors = [];
    if (!hasMinLength) errors.push("8 caractères minimum");
    if (!hasUpperCase) errors.push("une majuscule");
    if (!hasLowerCase) errors.push("une minuscule");
    if (!hasNumbers) errors.push("un chiffre");
    if (!hasSpecialChar) errors.push("un caractère spécial (!@#$...)");

    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// Mise à jour de la validation dans FormManager
FormManager.validateInscriptionForm = function(formData) {
    const nom = formData.get('nom');
    const prenom = formData.get('prenom');
    const email = formData.get('email');
    const motDePasse = formData.get('motDePasse');
    const etablissement = formData.get('etablissement');
    const domaine = formData.get('domaine');
    const niveau = formData.get('niveau');

    if (!nom || !prenom || !email || !motDePasse || !etablissement || !domaine || !niveau) {
        ToastManager.show('Veuillez remplir tous les champs obligatoires', 'warning');
        return false;
    }

    if (!Utils.isValidEmail(email)) {
        ToastManager.show('Adresse email invalide', 'warning');
        return false;
    }

    const passwordValidation = validatePassword(motDePasse);
    if (!passwordValidation.isValid) {
        ToastManager.show(`Mot de passe doit contenir : ${passwordValidation.errors.join(', ')}`, 'error');
        return false;
    }

    return true;
};

// Ajout d'un indicateur visuel de force du mot de passe
const addPasswordStrengthIndicator = () => {
    const passwordInput = document.getElementById('inscMotDePasse');
    if (!passwordInput) return;

    const indicator = document.createElement('div');
    indicator.id = 'password-strength';
    indicator.style.cssText = `
        margin-top: 0.5rem;
        font-size: 0.875rem;
        color: var(--gray-600);
    `;
    passwordInput.parentNode.appendChild(indicator);

    passwordInput.addEventListener('input', (e) => {
        const validation = validatePassword(e.target.value);
        if (e.target.value.length > 0) {
            indicator.innerHTML = validation.isValid 
                ? '<span style="color: var(--success-color)">✓ Mot de passe sécurisé</span>'
                : `⚠ Manque : ${validation.errors.join(', ')}`;
        } else {
            indicator.innerHTML = '';
        }
    });
};

// Appeler cette fonction après le chargement du DOM
document.addEventListener('DOMContentLoaded', addPasswordStrengthIndicator);

// Empêcher la copier/coller du mot de passe
document.getElementById('inscMotDePasse').addEventListener('paste', (e) => {
    e.preventDefault();
    ToastManager.show('Coller interdit pour des raisons de sécurité', 'warning');
});

// Confirmation du mot de passe
const addPasswordConfirmation = () => {
    const form = document.getElementById('formInscription');
    const confirmGroup = document.createElement('div');
    confirmGroup.className = 'form-group';
    confirmGroup.innerHTML = `
        <label for="confirmMotDePasse"><i class="fas fa-lock"></i> Confirmer le mot de passe</label>
        <input type="password" id="confirmMotDePasse" required>
        <small id="confirm-error" style="color: var(--danger-color); display: none;">
            Les mots de passe ne correspondent pas
        </small>
    `;
    
    form.insertBefore(confirmGroup, form.querySelector('.submit-btn'));
    
    document.getElementById('confirmMotDePasse').addEventListener('input', (e) => {
        const password = document.getElementById('inscMotDePasse').value;
        const confirm = e.target.value;
        const error = document.getElementById('confirm-error');
        
        if (confirm && password !== confirm) {
            error.style.display = 'block';
        } else {
            error.style.display = 'none';
        }
    });
}; 

// Toggle mot de passe visible/invisible
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const input = document.getElementById(targetId);
            const icon = button.querySelector('i');

            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}); 

document.getElementById('formEditProfile').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData();
  const cv = document.getElementById('editCvFile').files[0];
  const lettre = document.getElementById('editLettreFile').files[0];

  if (cv) formData.append('cv', cv);
  if (lettre) formData.append('lettre', lettre);

  await fetch('http://localhost:3000/api/candidat/profil/files', {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    body: formData
  });

  alert('Fichiers mis à jour');
  location.reload(); // recharge la page
}); 


// Initialisation de l'application
class App {
    constructor() {
        this.init();
    }

    async init() {
        this.showLoadingScreen();
        await new Promise(resolve => setTimeout(resolve, 1000));

        this.initEventListeners();
        FormManager.init();
        TabManager.init();
        FilterManager.init();

        AuthManager.checkAuth();
        this.hideLoadingScreen();
    }

    showLoadingScreen() {
        document.getElementById('loadingScreen').classList.remove('hidden');
        document.getElementById('mainContainer').classList.add('hidden');
    }

    hideLoadingScreen() {
        setTimeout(() => {
            document.getElementById('loadingScreen').classList.add('hidden');
            document.getElementById('mainContainer').classList.remove('hidden');
        }, 500);
    }

    initEventListeners() { 
    // Déconnexion
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => AuthManager.logout()); 
    }

            // Badge notifications
        const badge = document.getElementById('notificationBadge');
        const panel = document.getElementById('notificationPanel');

        badge?.addEventListener('click', () => {
            panel.classList.toggle('hidden');
            this.renderNotifications();
        });

        this.renderNotifications = () => {
            const notifications = NotificationService.getNotifications();
            const list = document.getElementById('notificationList');
            const count = document.getElementById('notificationCount');
            
            count.textContent = notifications.length;
            badge.classList.toggle('hidden', notifications.length === 0);
            
            list.innerHTML = notifications.map(n => `
                <div class="notification-item">
                    <small>${new Date(n.timestamp).toLocaleString('fr-FR')}</small>
                    <p>${n.data.nom || n.data.message || 'Notification'}</p>
                </div>
            `).join('');
        };

    // Nouvelle demande - Gestionnaire PROPRE
    const btnNouvelleDemande = document.getElementById('btnNouvelleDemande');
    if (btnNouvelleDemande) {
        btnNouvelleDemande.addEventListener('click', (e) => {
            e.preventDefault();
            this.showNouvelleDemandeForm();
        });
    }
    // Boutons Admin - EXPORTER et ACTUALISER
    // Export CSV des demandes
    const btnExportData = document.getElementById('btnExportData');
    if (btnExportData) {
        btnExportData.addEventListener('click', async () => {
            try {
                const result = await ApiService.getAdminDemandes();
                if (result.success) {
                    exportToCSV(result.data.demandes || []);
                } else {
                    ToastManager.show('Erreur lors de l\'export', 'error');
                }
            } catch (error) {
                ToastManager.show('Erreur réseau', 'error');
            }
        });
    }

    function exportToCSV(data) {
    if (!data.length) {
        ToastManager.show('Aucune donnée à exporter', 'warning');
        return;
    }

    const headers = ['Nom', 'Prénom', 'Email', 'Domaine', 'Niveau', 'Statut', 'Date'];
    const rows = data.map(d => [
        d.nom || '',
        d.prenom || '',
        d.email || '',
        d.domaine || '',
        d.niveau || '',
        d.statut || '',
        new Date(d.dateDepot).toLocaleDateString('fr-FR')
    ]);
    
    // Générer le contenu CSV
    let csvContent = [headers, ...rows]
        .map(row => row.join(';'))
        .join('\n');

    // Ajout du BOM UTF-8 pour éviter les problèmes d'accents
    csvContent = '\uFEFF' + csvContent;

    // Création du Blob UTF-8
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `demandes_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
}

    // ACTUALISER admin
    const btnRefreshAdmin = document.getElementById('btnRefreshAdmin');
    if (btnRefreshAdmin) {
        btnRefreshAdmin.addEventListener('click', async () => {
            const originalHTML = btnRefreshAdmin.innerHTML;
            
            try {
                // Afficher le loader
                btnRefreshAdmin.disabled = true;
                btnRefreshAdmin.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Actualisation...';
                
                // Recharger les données
                await DashboardManager.loadAdminDemandes();
                
                ToastManager.show('Données actualisées', 'success');
                
            } catch (error) {
                ToastManager.show('Erreur lors de l\'actualisation', 'error');
                
            } finally {
                // Restaurer le bouton
                btnRefreshAdmin.disabled = false;
                btnRefreshAdmin.innerHTML = originalHTML;
            }
        });
    } 
    // ACTUALISER condidat
    const btnRefreshDemandes = document.getElementById('btnRefreshDemandes');
    if (btnRefreshDemandes) {
        btnRefreshDemandes.addEventListener('click', async () => {
            const originalHTML = btnRefreshDemandes.innerHTML;
            
            try {
                btnRefreshDemandes.disabled = true;
                btnRefreshDemandes.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                
                await DashboardManager.loadCandidatDemandes();
                
                ToastManager.show('Vos demandes ont été actualisées', 'success');
                
            } catch (error) {
                ToastManager.show('Erreur lors de l\'actualisation', 'error');
                
            } finally {
                btnRefreshDemandes.disabled = false;
                btnRefreshDemandes.innerHTML = originalHTML;
            }
        });
    }
    // Retour dashboard
    const btnRetourDashboard = document.getElementById('btnRetourDashboard');
    if (btnRetourDashboard) {
        btnRetourDashboard.addEventListener('click', (e) => {
            e.preventDefault();
            if (AppState.userType === 'admin') {
                AuthManager.showAdminSection();
            } else {
                AuthManager.showCandidatSection();
            }
        });
    } 

// Navigation principale - version finale  


document.addEventListener('DOMContentLoaded', () => {
    // Tableau de bord
    const navDashboard = document.getElementById('navDashboard');
    const navDemandes  = document.getElementById('navDemandes');
    const navProfil    = document.getElementById('navProfil');

    if (navDashboard) {
        navDashboard.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            navDashboard.classList.add('active');
            if (AppState.userType === 'admin') {
                AuthManager.showAdminSection();
            } else {
                AuthManager.showCandidatSection();
            }
        });
    }

    if (navDemandes) {
        navDemandes.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            navDemandes.classList.add('active');
            alert('Page "Mes Demandes" - À implémenter');
        });
    }

    if (navProfil) {
        navProfil.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            navProfil.classList.add('active');
            alert('Page "Profil" - À implémenter');
        });
    }
});


    // Fermeture toast
    document.getElementById('closeToast')?.addEventListener('click', ToastManager.hide);
};

showNouvelleDemandeForm() {
    document.getElementById('candidatDashboard')?.classList.remove('active');
    document.getElementById('adminDashboard')?.classList.remove('active');
    
    document.getElementById('candidatDashboard')?.classList.add('hidden');
    document.getElementById('adminDashboard')?.classList.add('hidden');
    
    document.getElementById('nouvelleDemandeContainer')?.classList.remove('hidden');
    document.getElementById('nouvelleDemandeContainer')?.classList.add('active');
    
    Utils.clearForm('formNouvelleDemande'); 
};
};

// Service pour le profil
const ProfileService = {
    // Dans ProfileService.loadUserProfile()
async loadUserProfile() {
    try {
        const endpoint = AppState.userType === 'admin' 
            ? '/admin/profil'
            : '/candidat/profil';
            
        console.log("🔄 Tentative chargement profil...");
        
        const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
            headers: ApiService.getHeaders(true)
        });
        
        console.log("📡 Réponse serveur:", response.status, response.statusText);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ Erreur serveur:", errorText);
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        const result = await response.json();
        console.log("✅ Données reçues:", result);
        
        return result;
        
    } catch (error) {
        console.error("💥 Erreur récupération profil:", error);
        return { 
            success: false, 
            message: error.message || 'Erreur de connexion au serveur' 
        };
    } 

    
},

    async updateProfile(profileData) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/candidat/profil`, {
                method: 'PUT',
                headers: ApiService.getHeaders(true),
                body: JSON.stringify(profileData)
            });
            return await ApiService.handleResponse(response);
        } catch (error) {
            return { success: false, message: 'Erreur de connexion au serveur' };
        }
    }
};

// Gestionnaire de profil
const ProfileManager = {
    async showProfileSection() {
        // Masquer toutes les sections
        document.querySelectorAll('.dashboard-content').forEach(sec => {
            sec.classList.remove('active');
            sec.classList.add('hidden');
        });

        // Afficher la section profil
        const section = document.getElementById('profilSection');
        section.classList.remove('hidden');
        section.classList.add('active');

        // Charger les données
        await this.loadProfileData();
    },

    // Dans ProfileManager.loadProfileData() 

async loadProfileData() {
    const result = await ProfileService.loadUserProfile();
    console.log("=== DONNÉES PROFIL ===", result); // Log complet
    
    if (result.success) {
        const user = result.data;
        console.log("=== STRUCTURE USER ===", user); // Structure exacte
        console.table({
            nom: user.nom,
            prenom: user.prenom, 
            email: user.email,
            telephone: user.telephone,
            adresse: user.adresse,
            etablissement: user.etablissement,
            domaine: user.domaine,
            niveau: user.niveau
        });
        
        this.populateProfileForm(user);
    } else {
        ToastManager.show(result.message || 'Erreur lors du chargement du profil', 'error');
    }
},

    // Remplacez populateProfileForm avec :
populateProfileForm(user) {
    console.log("📝 Données reçues:", user);
    
    if (AppState.userType === 'admin') {
        // Admin
        document.getElementById('candidatProfileFields').style.display = 'none';
        document.getElementById('adminProfileFields').style.display = 'block';
        document.getElementById('profilNomAdmin').value = user.nom || '';
        document.getElementById('profilEmailAdmin').value = user.email || '';
    } else {
        // Candidat
        document.getElementById('candidatProfileFields').style.display = 'block';
        document.getElementById('adminProfileFields').style.display = 'none';
        
        // ✅ Accès correct aux données
        const userData = user.data || user;
        
        document.getElementById('profilNom').value = userData.nom || '';
        document.getElementById('profilPrenom').value = userData.prenom || '';
        document.getElementById('profilEmail').value = userData.email || '';
        document.getElementById('profilTelephone').value = userData.telephone || '';
        document.getElementById('profilAdresse').value = userData.adresse || '';
        document.getElementById('profilEtablissement').value = userData.etablissement || '';
        document.getElementById('profilDomaine').value = userData.domaine || '';
        document.getElementById('profilNiveau').value = userData.niveau || ''; 
        document.getElementById('profilCV').href = userData.fichiersCV
        ? `http://localhost:3000/uploads/${userData.fichiersCV}`
        : '#';

        document.getElementById('profilLettre').href = userData.fichiersLettre
        ? `http://localhost:3000/uploads/${userData.fichiersLettre}`
        : '#';
    } 
},

    enableEditMode() {
    if (AppState.userType === 'admin') {
        ToastManager.show('Les administrateurs ne peuvent pas modifier leur profil', 'warning');
        return;
    }
    
    const inputs = document.querySelectorAll('#candidatProfileFields input[readonly]');
    inputs.forEach(input => {
        input.removeAttribute('readonly');
    });
    
    document.getElementById('profileEditButtons').classList.remove('hidden');
    document.getElementById('btnEditProfile').classList.add('hidden'); 
    document.getElementById('fileUpdateSection').classList.remove('hidden');
},

    async checkEditableStatus() {
        try {
            const result = await ApiService.getCandidatDemandes();
            if (result.success) {
                const hasPending = result.data.some(d => d.statut === 'En attente');
                if (!hasPending) {
                    ToastManager.show('Vous ne pouvez modifier que si vous avez des demandes en attente', 'warning');
                    return false;
                }
            }
        } catch (error) {
            console.error('Erreur vérification statut:', error);
        }
        return true;
    },

    disableEditMode() {
        const inputs = document.querySelectorAll('#profilSection input');
        inputs.forEach(input => input.setAttribute('readonly', true));
        document.getElementById('profileEditButtons').classList.add('hidden');
        document.getElementById('btnEditProfile').classList.remove('hidden'); 
        document.getElementById('fileUpdateSection').classList.add('hidden');
    }
};

// Gestionnaire des demandes détaillées
const DetailedDemandsManager = {
    async showDetailedDemands() {
        document.querySelectorAll('.dashboard-content').forEach(sec => {
            sec.classList.remove('active');
            sec.classList.add('hidden');
        });

        document.getElementById('demandesSection').classList.remove('hidden');
        document.getElementById('demandesSection').classList.add('active');

        if (AppState.userType === 'candidat') {
            await this.loadCandidatDetailedDemands();
        } else {
            await this.loadAdminDetailedDemands();
        }
    },

    async loadCandidatDetailedDemands() {
        const result = await ApiService.getCandidatDemandes();
        if (result.success) {
            this.renderDetailedDemands(result.data);
        }
    },


    async loadAdminDetailedDemands() {
    const result = await fetch(`${CONFIG.API_BASE_URL}/admin/demandes/with-messages`, {
        headers: ApiService.getHeaders(true)
    }).then(r => r.json());

    if (result.success) {
        this.renderDetailedDemands(result.data);
    }
},


renderDetailedDemands(demandes) {
    const container = document.getElementById('mesDemandesList');
    
    if (demandes.length === 0) {
        container.innerHTML = `
            <div class="text-center" style="padding: 3rem;">
                <i class="fas fa-file-alt" style="font-size: 3rem; color: var(--gray-300); margin-bottom: 1rem;"></i>
                <h3 style="color: var(--gray-500);">Aucune demande avec messages</h3>
            </div>
        `;
        return;
    }

    container.innerHTML = demandes.map(demande => `
        <div class="demande-card" data-id="${demande.idDemande}">
            <div class="demande-header">
                <h3 class="demande-title">
                    <i class="fas fa-user"></i> ${demande.candidat_prenom || ''} ${demande.candidat_nom || ''}
                </h3>
                <span class="status-badge ${DashboardManager.getStatusClass(demande.statut)}">
                    ${demande.statut}
                </span>
            </div>

            <div class="demande-details">
                <div class="detail-item"><strong>Email :</strong> ${demande.candidat_email || 'Non renseigné'}</div>
                <div class="detail-item"><strong>Téléphone :</strong> ${demande.candidat_telephone || '-'}</div>
                <div class="detail-item"><strong>Domaine :</strong> ${demande.domaine}</div>
                <div class="detail-item"><strong>Date :</strong> ${Utils.formatDate(demande.dateDepot)}</div>
            </div>

            <!-- Messages -->
            <div class="messages-section">
                <h4><i class="fas fa-comments"></i> Messages</h4>
                <div class="messages-container" id="messages-${demande.idDemande}">
                    <i class="fas fa-spinner fa-spin"></i> Chargement...
                </div>
                <textarea class="message-input" 
                          data-id="${demande.idDemande}" 
                          placeholder="Écrire un message..."></textarea>
                <button class="send-btn" data-id="${demande.idDemande}">
                    <i class="fas fa-paper-plane"></i> Envoyer
                </button>
            </div>
        </div>
    `).join('');

    // Attacher les événements après le rendu
    this.attachMessageEvents();
},

attachMessageEvents() {
    // Gestion des boutons "Envoyer"
    document.querySelectorAll('.send-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const idDemande = e.target.dataset.id;
            const input = document.querySelector(`textarea[data-id="${idDemande}"]`);
            const text = input.value.trim();
            
            if (!text) {
                ToastManager.show('Veuillez écrire un message', 'warning');
                return;
            }

            try {
                btn.disabled = true;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

                const result = await ApiService.sendMessage(idDemande, text);
                
                if (result.success) {
                    input.value = '';
                    await this.loadMessagesForDemande(idDemande);
                    ToastManager.show('Message envoyé', 'success');
                } else {
                    ToastManager.show(result.message || 'Erreur', 'error');
                }
            } finally {
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-paper-plane"></i> Envoyer';
            }
        });
    });

    // Charger les messages initiaux
    document.querySelectorAll('.demande-card').forEach(card => {
        const idDemande = card.dataset.id;
        this.loadMessagesForDemande(idDemande);
    });
},

async loadMessagesForDemande(idDemande) {
    const container = document.getElementById(`messages-${idDemande}`);
    if (!container) return;

    try {
        container.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Chargement...';
        
        const messages = await ApiService.getMessages(idDemande);
        
        if (!messages.length) {
            container.innerHTML = '<p style="color: var(--gray-500);">Aucun message</p>';
            return;
        }

        container.innerHTML = messages.map(msg => `
            <div class="message ${msg.roleExpediteur}">
                <strong>${msg.nom || (msg.roleExpediteur === 'admin' ? 'Admin' : 'Candidat')}:</strong>
                <p>${msg.message}</p>
                <small>${new Date(msg.dateEnvoi).toLocaleString('fr-FR')}</small>
            </div>
        `).join('');
    } catch (error) {
        container.innerHTML = '<p style="color: var(--danger-color);">Erreur de chargement</p>';
    }
}};


// Démarrage
document.addEventListener('DOMContentLoaded', () => {
   new App();
}); 

// Navigation ultra-propre
document.addEventListener('DOMContentLoaded', () => {
    const navDashboard = document.getElementById('navDashboard');
    const navDemandes  = document.getElementById('navDemandes');
    const navProfil    = document.getElementById('navProfil');

    const sections = {
        navDashboard: 'candidatDashboard',
        navDemandes:  'demandesSection',
        navProfil:    'profilSection'
    };

    // Fonction de navigation
    function switchSection(sectionId) {
        // Masquer toutes les sections
        Object.values(sections).forEach(id => {
            document.getElementById(id)?.classList.remove('active');
            document.getElementById(id)?.classList.add('hidden');
        });

        // Afficher la section demandée
        const target = sections[sectionId];
        document.getElementById(target)?.classList.remove('hidden');
        document.getElementById(target)?.classList.add('active');
    }

    // Attacher les écouteurs
    [navDashboard, navDemandes, navProfil].forEach(link => {
        if (link) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                switchSection(link.id);
            });
        }
    });
}); 

async function showProfilSection() {
    // Masquer toutes les sections
    document.querySelectorAll('.dashboard-content').forEach(sec => {
        sec.classList.remove('active');
        sec.classList.add('hidden');
    });

    // Afficher la section profil
    const section = document.getElementById('profilSection');
    section.classList.remove('hidden');
    section.classList.add('active');

    // Forcer le scroll en haut
    window.scrollTo(0, 0);

    // Charger les données
    await this.loadProfileData();
};

// Gestion des erreurs globales
window.addEventListener('error', (e) => {
    console.error('Erreur globale:', e.error);
    ToastManager.show('Une erreur inattendue s\'est produite', 'error');
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Promesse rejetée:', e.reason);
    ToastManager.show('Erreur de traitement des données', 'error');
}); 


// === NAVIGATION FIX ULTRA ===
document.addEventListener('DOMContentLoaded', () => {
    const navDashboard = document.getElementById('navDashboard');
    const navDemandes  = document.getElementById('navDemandes');
    const navProfil    = document.getElementById('navProfil');

    [navDashboard, navDemandes, navProfil].forEach(link => {
        if (!link) return; // sécurité
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Retirer l’ancien active
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Action selon le bouton
            switch (link.id) {
                case 'navDashboard':
                    if (AppState.userType === 'admin') {
                        AuthManager.showAdminSection();
                    } else {
                        AuthManager.showCandidatSection();
                    }
                    break;
                case 'navDemandes':
                    document.getElementById('candidatDashboard')?.classList.add('hidden');
                    document.getElementById('adminDashboard')?.classList.add('hidden');
                    document.getElementById('demandesSection')?.classList.remove('hidden');
                    document.getElementById('demandesSection')?.classList.add('active');
                    // Chargez vos demandes ici
                    break;

                case 'navProfil':
                    document.getElementById('candidatDashboard')?.classList.add('hidden');
                    document.getElementById('adminDashboard')?.classList.add('hidden');
                    document.getElementById('profilSection')?.classList.remove('hidden');
                    document.getElementById('profilSection')?.classList.add('active');
                    // Remplissez les champs profil
                    document.getElementById('profilNom').value = AppState.currentUser?.nom || '';
                    document.getElementById('profilEmail').value = AppState.currentUser?.email || '';
                    break; 

                    case 'navProfil':
                    loadAndShowProfil();
                    break;
             }
        });
    });
}); 

// Navigation finale et corrigée
document.addEventListener('DOMContentLoaded', () => {
    const navDashboard = document.getElementById('navDashboard');
    const navDemandes = document.getElementById('navDemandes');
    const navProfil = document.getElementById('navProfil');

    [navDashboard, navDemandes, navProfil].forEach(link => {
        if (link) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Retirer l'ancien active
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                // Action selon le bouton
                switch (link.id) {
                    case 'navDashboard':
                        if (AppState.userType === 'admin') {
                            AuthManager.showAdminSection();
                        } else {
                            AuthManager.showCandidatSection();
                        }
                        break;
                    case 'navDemandes':
                        DetailedDemandsManager.showDetailedDemands();
                        break;  
                        
                    case 'navProfil':
                        document.getElementById('candidatDashboard')?.classList.add('hidden');
                        document.getElementById('adminDashboard')?.classList.add('hidden');
                        document.getElementById('demandesSection')?.classList.add('hidden');
                        document.getElementById('nouvelleDemandeContainer')?.classList.add('hidden');
                        document.getElementById('profilSection')?.classList.remove('hidden');
                        document.getElementById('profilSection')?.classList.add('active');  
                        
    
                // Charger les données du profil
                ProfileManager.showProfileSection();
                        break;
                }
            });
        }
    });

    // Bouton édition profil
    document.getElementById('btnEditProfile')?.addEventListener('click', () => {
        ProfileManager.enableEditMode();
    });

    document.getElementById('btnCancelEdit')?.addEventListener('click', () => {
        ProfileManager.disableEditMode();
    });

    // Formulaire édition profil
    document.getElementById('formEditProfile')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            telephone: document.getElementById('profilTelephone').value,
            adresse: document.getElementById('profilAdresse').value
        };

        const result = await ProfileService.updateProfile(formData);
        if (result.success) {
            ToastManager.show('Profil mis à jour avec succès', 'success');
            ProfileManager.disableEditMode();
            await ProfileManager.loadProfileData();
        } else {
            ToastManager.show(result.message || 'Erreur lors de la mise à jour', 'error');
        }
    });
}); 

// Récupération complète du profil lors du clic
async function loadAndShowProfil() {
    // 1. Vérifier connexion
    if (!AppState.currentUser) {
        ToastManager.show('Veuillez vous reconnecter', 'warning');
        return;
    }

    // 2. Recharger le profil depuis la base
    try {
        const response = await ApiService.getCandidatProfil();
        if (response.success) {
            AppState.currentUser = response.data;
            showProfilSection(); // remplissage avec données fraîches
        } else {
            ToastManager.show('Impossible de charger le profil', 'error');
        }
    } catch (err) {
        ToastManager.show('Erreur réseau', 'error');
    }
};



/*console.log("🔑 Token:", localStorage.getItem('token'));
console.log("👤 User:", localStorage.getItem('userData'));
console.log("🎭 Type:", localStorage.getItem('userType'));*/

