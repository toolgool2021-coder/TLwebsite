// ===== ACCOUNT MANAGER =====
const accountManager = (() => {
    const accounts = [
        {
            id: 'acc1',
            username: 'toolgool',
            password: '12345',
            avatar: 'https://avatars.githubusercontent.com/u/236378052?v=4',
            rankLevel: 10,
            rankType: 'LEGENDARY'
        },
        {
            id: 'acc2',
            username: 'admin',
            password: 'admin123',
            avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
            rankLevel: 9,
            rankType: 'MASTER'
        },
        {
            id: 'acc3',
            username: 'test',
            password: 'test123',
            avatar: 'https://avatars.githubusercontent.com/u/2?v=4',
            rankLevel: 5,
            rankType: 'NOVICE'
        }
    ];
    
    function login(username, password) {
        const account = accounts.find(acc => acc.username === username && acc.password === password);
        return account || null;
    }
    
    function getRankColor(rankLevel) {
        if (rankLevel >= 9) return '#ff6b35';      // Fire
        if (rankLevel >= 7) return '#00d4ff';      // Lightning
        if (rankLevel >= 5) return '#a0e7e5';      // Wind
        return '#6366f1';                          // Default
    }
    
    return {
        login,
        getRankColor
    };
})();

// ===== USER SESSION =====
const userSession = (() => {
    let currentUser = null;
    
    // Check for saved session
    function init() {
        const saved = localStorage.getItem('userSession');
        if (saved) {
            try {
                currentUser = JSON.parse(saved);
            } catch (e) {
                localStorage.removeItem('userSession');
            }
        }
    }
    
    function login(account) {
        currentUser = {
            id: account.id,
            username: account.username,
            avatar: account.avatar,
            rankLevel: account.rankLevel,
            rankType: account.rankType
        };
        localStorage.setItem('userSession', JSON.stringify(currentUser));
    }
    
    function logout() {
        currentUser = null;
        localStorage.removeItem('userSession');
    }
    
    function isLoggedIn() {
        return currentUser !== null;
    }
    
    // Initialize on load
    init();
    
    return {
        login,
        logout,
        isLoggedIn,
        get currentUser() { return currentUser; }
    };
})();
