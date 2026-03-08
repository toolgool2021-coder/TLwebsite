// Falling Snow Animation
function createSnowflakes() {
    const snowflakeCount = 100;
    const snowContainer = document.createElement("div");
    document.body.appendChild(snowContainer);

    for (let i = 0; i < snowflakeCount; i++) {
        const snowflake = document.createElement("div");
        snowflake.className = "snowflake";
        snowflake.style.position = "absolute";
        snowflake.style.top = `${Math.random() * 100}vh`;
        snowflake.style.left = `${Math.random() * 100}vw`;
        snowflake.style.opacity = Math.random();
        snowContainer.appendChild(snowflake);

        // Animate snowflakes
        snowflake.animate([
            { transform: 'translateY(0)' },
            { transform: `translateY(${window.innerHeight}px)` }
        ], {
            duration: (Math.random() * 5 + 5) * 1000,
            easing: 'linear',
            iterations: Infinity
        });
    }
}
createSnowflakes();

// Avatar Upload Functionality
document.getElementById('avatarUpload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('avatarPreview').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Social Links Data
const socialLinks = [
    { platform: 'Facebook', url: 'https://www.facebook.com/' },
    { platform: 'Twitter', url: 'https://www.twitter.com/' },
    { platform: 'Instagram', url: 'https://www.instagram.com/' },
];

// Function to render social links
function renderSocialLinks() {
    const socialContainer = document.getElementById('socialLinks');
    socialLinks.forEach(link => {
        const anchor = document.createElement('a');
        anchor.href = link.url;
        anchor.textContent = link.platform;
        anchor.target = '_blank';
        socialContainer.appendChild(anchor);
    });
}
renderSocialLinks();