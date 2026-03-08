// Avatar upload functionality
function uploadAvatar(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('avatarPreview').src = e.target.result;
            localStorage.setItem('avatarImage', e.target.result);
        };
        reader.readAsDataURL(file);
    }
}

// Load avatar from localStorage
window.addEventListener('load', function() {
    const savedAvatar = localStorage.getItem('avatarImage');
    if (savedAvatar) {
        document.getElementById('avatarPreview').src = savedAvatar;
    }
    createSnowflakes();
});

// Create falling snowflakes
function createSnowflakes() {
    const snowContainer = document.getElementById('snowContainer');
    const snowflakeCount = 50;

    function createSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        snowflake.style.left = Math.random() * 100 + '%';
        snowflake.style.animationDuration = (Math.random() * 5 + 8) + 's';
        snowflake.style.animationDelay = Math.random() * 2 + 's';
        snowContainer.appendChild(snowflake);

        setTimeout(() => {
            snowflake.remove();
        }, 13000);
    }

    // Create initial snowflakes
    for (let i = 0; i < snowflakeCount; i++) {
        setTimeout(createSnowflake, i * 100);
    }

    // Continuously create snowflakes
    setInterval(createSnowflake, 500);
}

// Avatar hover effect
const avatar = document.getElementById('avatarPreview');
if (avatar) {
    avatar.addEventListener('click', function() {
        document.getElementById('avatarUpload').click();
    });
}

// Social links smooth animation
const socialLinks = document.querySelectorAll('.social-link');
socialLinks.forEach(link => {
    link.addEventListener('mouseenter', function() {
        this.style.animation = 'none';
        setTimeout(() => {
            this.style.animation = '';
        }, 10);
    });
});
