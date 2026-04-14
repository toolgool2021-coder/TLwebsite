// ===== BADGES DATA (UNLIMITED) =====
const BADGES = [
    {
        userId: "toolgool",
        image: "./images/badges/github.svg",
        link: "https://github.com/toolgool2021-coder"
    },
    {
        userId: "toolgool",
        image: "./images/badges/telegram.svg",
        link: "https://t.me/Toolgool"
    },
    {
        userId: "toolgool",
        image: "./images/badges/youtube.svg",
        link: "https://www.youtube.com/@Toolgool2023"
    },
    {
        userId: "toolgool",
        image: "./images/badges/tiktok.svg",
        link: "https://www.tiktok.com/@Toolgool2023"
    },
    {
        userId: "toolgool",
        image: "./images/badges/instagram.svg",
        link: "https://www.instagram.com/Toolgool2023"
    },
    {
        userId: "toolgool",
        image: "./images/badges/discord.svg",
        link: "https://discord.com/users/Toolgool2023"
    },
    {
        userId: "user2",
        image: "./images/badges/github.svg",
        link: "https://github.com"
    },
    {
        userId: "user2",
        image: "./images/badges/twitter.svg",
        link: "https://twitter.com"
    },
    {
        userId: "user3",
        image: "./images/badges/dribbble.svg",
        link: "https://dribbble.com"
    },
    {
        userId: "user3",
        image: "./images/badges/behance.svg",
        link: "https://behance.net"
    }
];

// ===== BADGE MANAGER =====
class BadgeManager {
    constructor() {
        this.badges = BADGES;
    }

    getBadgesByUserId(userId) {
        return this.badges.filter(b => b.userId === userId);
    }

    addBadge(userId, image, link) {
        this.badges.push({ userId, image, link });
    }

    removeBadge(userId, image) {
        this.badges = this.badges.filter(b => !(b.userId === userId && b.image === image));
    }
}

const badgeManager = new BadgeManager();
