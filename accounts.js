// ===== ACCOUNT DATA =====
const ACCOUNTS = [
    {
        username: "toolgool",
        password: "12345",
        avatar: "./images/avatars/toolgool.jpg",
        rankLevel: 5,
        rankType: "MASTER"
    },
    {
        username: "admin",
        password: "admin123",
        avatar: "./images/avatars/user2.jpg",
        rankLevel: 4,
        rankType: "EXPERT"
    },
    {
        username: "user",
        password: "user123",
        avatar: "./images/avatars/user3.jpg",
        rankLevel: 2,
        rankType: "INTERMEDIATE"
    }
];

// ===== RANK IMAGES (используются из папки images/ranks/) =====
const RANK_IMAGES = {
    1: "./images/ranks/rank-1.png",
    2: "./images/ranks/rank-2.png",
    3: "./images/ranks/rank-3.png",
    4: "./images/ranks/rank-4.png",
    5: "./images/ranks/rank-5.png"
};

const RANK_COLORS = {
    1: "#94a3b8",
    2: "#3b82f6",
    3: "#8b5cf6",
    4: "#ec4899",
    5: "#f59e0b"
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

    getRankImage(level) {
        return RANK_IMAGES[level] || RANK_IMAGES[1];
    }

    getRankColor(level) {
        return RANK_COLORS[level] || RANK_COLORS[1];
    }
}

const accountManager = new AccountManager();
