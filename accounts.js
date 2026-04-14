// ===== ACCOUNT DATA =====
const ACCOUNTS = [
    {
        username: "toolgool",
        password: "12345",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=toolgool",
        rankLevel: 5,
        rankType: "MASTER"
    }

// ===== RANK COLORS =====
const RANK_COLORS = {
    1: "#94a3b8",
    2: "#3b82f6",
    3: "#8b5cf6",
    4: "#ec4899",
    5: "#f59e0b"
};

const RANK_NAMES = {
    1: "NOVICE",
    2: "INTERMEDIATE",
    3: "ADVANCED",
    4: "EXPERT",
    5: "MASTER"
};

// ===== ACCOUNT MANAGER =====
class AccountManager {
    constructor() {
        this.accounts = ACCOUNTS;
        this.currentUser = null;
    }

    login(username, password) {
        const account = this.accounts.find(a => a.username === username && a.password === password);
        if (account) {
            this.currentUser = account;
            return account;
        }
        return null;
    }

    logout() {
        this.currentUser = null;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    getRankColor(level) {
        return RANK_COLORS[level] || RANK_COLORS[1];
    }

    getRankName(level) {
        return RANK_NAMES[level] || RANK_NAMES[1];
    }
}

const accountManager = new AccountManager();
