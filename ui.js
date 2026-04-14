// ===== TOAST NOTIFICATION SYSTEM =====
class ToastManager {
    constructor() {
        this.container = document.getElementById('toastContainer');
    }

    show(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            info: 'fas fa-info-circle'
        };
        
        toast.innerHTML = `
            <i class="toast-icon ${icons[type]}"></i>
            <span class="toast-message">${message}</span>
        `;
        
        this.container.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('removing');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    success(message) {
        this.show(message, 'success');
    }

    error(message) {
        this.show(message, 'error', 4000);
    }

    info(message) {
        this.show(message, 'info');
    }
}

const toastManager = new ToastManager();

// ===== MODAL MANAGER =====
class ModalManager {
    constructor(modalId) {
        this.modal = document.getElementById(modalId);
        this.closeBtn = this.modal.querySelector('.modal-close');
        this.setup();
    }

    setup() {
        this.closeBtn.addEventListener('click', () => this.close());
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) this.close();
        });
    }

    open() {
        this.modal.classList.add('active');
    }

    close() {
        this.modal.classList.remove('active');
    }

    toggle() {
        this.modal.classList.toggle('active');
    }
}

const loginModal = new ModalManager('loginModal');

// ===== USER SESSION ===== 
class UserSession {
    constructor() {
        this.currentUser = null;
        this.loadFromStorage();
    }

    login(account) {
        this.currentUser = account;
        localStorage.setItem('currentUser', JSON.stringify(account));
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }

    loadFromStorage() {
        const stored = localStorage.getItem('currentUser');
        if (stored) {
            this.currentUser = JSON.parse(stored);
        }
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }
}

const userSession = new UserSession();

// ===== UPDATE UI BASED ON SESSION =====
function updateAuthUI() {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (userSession.isLoggedIn()) {
        loginBtn.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
    } else {
        loginBtn.classList.remove('hidden');
        logoutBtn.classList.add('hidden');
    }
}

updateAuthUI();
