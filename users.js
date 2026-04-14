// ===== USER MANAGER =====
const userManager = (() => {
    const users = [
        {
            id: 'toolgool',
            name: 'Toolgool',
            username: '@toolgool',
            avatar: 'https://avatars.githubusercontent.com/u/236378052?v=4',
            description: 'Developer & Creator | Building amazing things ⚡',
            effect: 'fire',
            rankLevel: 10
        },
        {
            id: 'user2',
            name: 'Alex Developer',
            username: '@alexdev',
            avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
            description: 'Full-stack developer passionate about web technologies',
            effect: 'lightning',
            rankLevel: 7
        },
        {
            id: 'user3',
            name: 'Sarah Designer',
            username: 'Sarah Design',
            avatar: 'https://avatars.githubusercontent.com/u/2?v=4',
            description: 'UI/UX Designer creating beautiful digital experiences',
            effect: 'wind',
            rankLevel: 6
        },
        {
            id: 'user4',
            name: 'John Backend',
            username: '@johncode',
            avatar: 'https://avatars.githubusercontent.com/u/3?v=4',
            description: 'Backend engineer focusing on scalable systems',
            effect: 'earth',
            rankLevel: 8
        },
        {
            id: 'user5',
            name: 'Emma Frontend',
            username: '@emmafront',
            avatar: 'https://avatars.githubusercontent.com/u/4?v=4',
            description: 'React specialist | Frontend optimization enthusiast',
            effect: 'water',
            rankLevel: 7
        },
        {
            id: 'user6',
            name: 'Max DevOps',
            username: '@maxdevops',
            avatar: 'https://avatars.githubusercontent.com/u/5?v=4',
            description: 'DevOps engineer | Cloud infrastructure specialist',
            effect: 'frost',
            rankLevel: 9
        }
    ];
    
    let currentIndex = 0;
    
    function getAll() {
        return users;
    }
    
    function getCurrent() {
        return users[currentIndex];
    }
    
    function next() {
        currentIndex = (currentIndex + 1) % users.length;
        return users[currentIndex];
    }
    
    function prev() {
        currentIndex = (currentIndex - 1 + users.length) % users.length;
        return users[currentIndex];
    }
    
    return {
        getAll,
        getCurrent,
        next,
        prev,
        get currentIndex() { return currentIndex; },
        set currentIndex(val) { currentIndex = val; }
    };
})();
