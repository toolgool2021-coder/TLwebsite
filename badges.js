// ===== BADGE MANAGER =====
const badgeManager = (() => {
    const badges = [
        // Toolgool's badges
        {
            id: 'badge1',
            userId: 'toolgool',
            name: 'GitHub',
            image: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
            link: 'https://github.com/toolgool2021-coder'
        },
        {
            id: 'badge2',
            userId: 'toolgool',
            name: 'Telegram',
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/1024px-Telegram_logo.svg.png',
            link: 'https://t.me/Toolgool'
        },
        {
            id: 'badge3',
            userId: 'toolgool',
            name: 'Discord',
            image: 'https://discord.com/api/guilds/123/widget.png',
            link: 'https://discord.gg/toolgool'
        },
        
        // Alex's badges
        {
            id: 'badge4',
            userId: 'user2',
            name: 'GitHub',
            image: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
            link: 'https://github.com/alexdev'
        },
        {
            id: 'badge5',
            userId: 'user2',
            name: 'Portfolio',
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Figma-1.svg/1024px-Figma-1.svg.png',
            link: 'https://alexdev.com'
        },
        
        // Sarah's badges
        {
            id: 'badge6',
            userId: 'user3',
            name: 'Dribbble',
            image: 'https://cdn.dribbble.com/assets/dribbble-ball-mark-2bd45f09c2fb58dbbfb44ec30e70ca60.svg',
            link: 'https://dribbble.com/sarahdesign'
        },
        {
            id: 'badge7',
            userId: 'user3',
            name: 'Behance',
            image: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Behance_logo_%282020%29.svg',
            link: 'https://behance.net/sarahdesign'
        },
        
        // John's badges
        {
            id: 'badge8',
            userId: 'user4',
            name: 'GitHub',
            image: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
            link: 'https://github.com/johncode'
        },
        {
            id: 'badge9',
            userId: 'user4',
            name: 'Stack Overflow',
            image: 'https://stackoverflow.design/assets/img/logos/so/logo-stackoverflow.svg',
            link: 'https://stackoverflow.com/users/johncode'
        },
        
        // Emma's badges
        {
            id: 'badge10',
            userId: 'user5',
            name: 'GitHub',
            image: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
            link: 'https://github.com/emmafront'
        },
        {
            id: 'badge11',
            userId: 'user5',
            name: 'Twitter',
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_of_Twitter.svg/1024px-Logo_of_Twitter.svg.png',
            link: 'https://twitter.com/emmafront'
        },
        
        // Max's badges
        {
            id: 'badge12',
            userId: 'user6',
            name: 'GitHub',
            image: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
            link: 'https://github.com/maxdevops'
        },
        {
            id: 'badge13',
            userId: 'user6',
            name: 'LinkedIn',
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/1024px-LinkedIn_logo_initials.png',
            link: 'https://linkedin.com/in/maxdevops'
        }
    ];
    
    function getBadgesByUserId(userId) {
        return badges.filter(badge => badge.userId === userId);
    }
    
    return {
        getBadgesByUserId
    };
})();
