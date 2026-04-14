// ===== TOAST MANAGER =====
const toastManager = (() => {
    const container = document.getElementById('toastContainer');
    
    function showToast(message, type = 'info') {
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
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('removing');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    return {
        success: (msg) => showToast(msg, 'success'),
        error: (msg) => showToast(msg, 'error'),
        info: (msg) => showToast(msg, 'info')
    };
})();

// ===== LOGIN MODAL =====
const loginModal = (() => {
    const modal = document.getElementById('loginModal');
    const closeBtn = document.querySelector('.modal-close');
    
    closeBtn.addEventListener('click', close);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) close();
    });
    
    function open() {
        modal.classList.add('active');
    }
    
    function close() {
        modal.classList.remove('active');
    }
    
    return { open, close };
})();

// ===== AUTH UI =====
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

// Initialize auth UI
updateAuthUI();
