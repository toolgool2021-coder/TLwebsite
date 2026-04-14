// ===== USER DATA =====
const USERS = [
    {
        id: "toolgool",
        name: "Toolgool",
        username: "@Toolgool",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=toolgool",
        description: "Developer | Creator | Maker of Cool Projects",
        effect: "lightning",
        color: "#6366f1"
    }
// ===== USER MANAGER =====
class UserManager {
    constructor() {
        this.users = USERS;
        this.currentIndex = 0;
    }

    getCurrentUser() {
        return this.users[this.currentIndex];
    }

    getUser(id) {
        return this.users.find(u => u.id === id);
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.users.length;
        return this.getCurrentUser();
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.users.length) % this.users.length;
        return this.getCurrentUser();
    }

    getAll() {
        return this.users;
    }
}

const userManager = new UserManager();
