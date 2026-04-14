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
    },
    {
        id: "user2",
        name: "Code Wizard",
        username: "@CodeWizard",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=wizard",
        description: "JavaScript Specialist",
        effect: "fire",
        color: "#f97316"
    },
    {
        id: "user3",
        name: "Design Master",
        username: "@DesignMaster",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=designer",
        description: "UI/UX Designer",
        effect: "air",
        color: "#06b6d4"
    },
    {
        id: "user4",
        name: "Web Warrior",
        username: "no-link",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=warrior",
        description: "Full Stack Developer",
        effect: "earth",
        color: "#84cc16"
    },
    {
        id: "user5",
        name: "Backend Pro",
        username: "@BackendPro",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=backend",
        description: "Node.js Expert",
        effect: "lightning",
        color: "#8b5cf6"
    }
];

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
