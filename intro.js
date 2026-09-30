/* =========================
   INTRO ANIMATION LOGIC - CYBERPUNK NEON TERMINAL
   MOBILE OPTIMIZED & WORKING TEXT ANIMATION
========================= */

let introStarted = false;
const loaderSymbols = ["\\", "|", "/", "—"];
let loaderIndex = 0;

async function typeLine(text, className = "terminal-default", delay = 20) {
    return new Promise((resolve) => {
        const terminalContent = document.getElementById("terminal-content");
        if (!terminalContent) {
            resolve(null);
            return;
        }

        const line = document.createElement("div");
        line.className = `terminal-line ${className}`;
        terminalContent.appendChild(line);
        terminalContent.scrollTop = terminalContent.scrollHeight;

        let index = 0;
        const typeChar = () => {
            if (index < text.length) {
                line.textContent += text[index];
                index++;
                terminalContent.scrollTop = terminalContent.scrollHeight;
                setTimeout(typeChar, delay);
            } else {
                resolve(line);
            }
        };
        typeChar();
    });
}

function addBlankLine() {
    const terminalContent = document.getElementById("terminal-content");
    if (!terminalContent) return;

    const line = document.createElement("div");
    line.className = "terminal-line terminal-default";
    line.textContent = " ";
    line.style.minHeight = "0.6em";
    terminalContent.appendChild(line);
    terminalContent.scrollTop = terminalContent.scrollHeight;
}

async function fixAccountError(line) {
    if (!line) return;

    // Show error state for a moment
    await new Promise(resolve => setTimeout(resolve, 300));

    // Backspace
    line.textContent = "account: Toolgo0";
    await new Promise(resolve => setTimeout(resolve, 80));
    line.textContent = "account: Toolgo";
    await new Promise(resolve => setTimeout(resolve, 80));

    // Type correct version
    line.classList.remove("terminal-error");
    line.classList.add("terminal-success");
    line.textContent = "account: Toolgool";
}

async function fixPasswordError(line) {
    if (!line) return;

    // Show error state for a moment
    await new Promise(resolve => setTimeout(resolve, 300));

    // Backspace
    line.textContent = "Password: •••••••";
    await new Promise(resolve => setTimeout(resolve, 80));
    line.textContent = "Password: ••••••";
    await new Promise(resolve => setTimeout(resolve, 80));

    // Type correct version
    line.classList.remove("terminal-error");
    line.classList.add("terminal-success");
    line.textContent = "Password: ••••••••";
}

async function typeIPAddress() {
    const terminalContent = document.getElementById("terminal-content");
    if (!terminalContent) return;

    const line = document.createElement("div");
    line.className = "terminal-line terminal-default";
    terminalContent.appendChild(line);

    // Type "IP-address: " first
    let text = "IP-address: ";
    let index = 0;
    
    await new Promise(resolve => {
        const typeFirst = () => {
            if (index < text.length) {
                line.textContent += text[index];
                index++;
                terminalContent.scrollTop = terminalContent.scrollHeight;
                setTimeout(typeFirst, 16);
            } else {
                resolve();
            }
        };
        typeFirst();
    });

    // Type IP address numbers
    const ipChars = ["1", "9", "2", ":", "1", "6", "8", ":", "0", ":", "2", "4"];
    for (const char of ipChars) {
        line.textContent += char;
        terminalContent.scrollTop = terminalContent.scrollHeight;
        await new Promise(resolve => setTimeout(resolve, 70));
    }
}

async function showLoader() {
    const terminalContent = document.getElementById("terminal-content");
    if (!terminalContent) return null;

    const line = document.createElement("div");
    line.className = "terminal-line terminal-default";
    terminalContent.appendChild(line);

    loaderIndex = 0;
    for (let i = 0; i < 10; i++) {
        line.textContent = `Loading ${loaderSymbols[loaderIndex % loaderSymbols.length]}`;
        loaderIndex++;
        terminalContent.scrollTop = terminalContent.scrollHeight;
        await new Promise(resolve => setTimeout(resolve, 60));
    }

    return line;
}

async function startIntro() {
    if (introStarted) return;
    introStarted = true;

    const terminalContent = document.getElementById("terminal-content");
    const leftDoor = document.getElementById("left-door");
    const rightDoor = document.getElementById("right-door");
    const intro = document.getElementById("intro");

    if (!terminalContent || !leftDoor || !rightDoor || !intro) {
        console.error("Required intro elements missing");
        return;
    }

    terminalContent.innerHTML = "";
    loaderIndex = 0;

    // Sequence of terminal output
    await typeLine("[ TOOLGOOL SECURITY SYSTEM ]", "terminal-header", 15);
    addBlankLine();
    
    await typeLine("BOOT SEQUENCE // START", "terminal-default", 22);
    await new Promise(r => setTimeout(r, 100));
    
    await typeLine("Loading secure kernel", "terminal-default", 20);
    await new Promise(r => setTimeout(r, 100));
    
    await typeLine("Checking access modules", "terminal-default", 20);
    addBlankLine();
    
    const accountLine = await typeLine("account: Toolgo0l", "terminal-error", 20);
    await fixAccountError(accountLine);
    await new Promise(r => setTimeout(r, 150));
    
    const passLine = await typeLine("Password: ••••••••", "terminal-error", 20);
    await fixPasswordError(passLine);
    await new Promise(r => setTimeout(r, 150));
    
    await typeIPAddress();
    addBlankLine();
    
    await typeLine("Resolving network identity", "terminal-default", 18);
    await new Promise(r => setTimeout(r, 100));
    
    await typeLine("Encrypting connection", "terminal-default", 18);
    await new Promise(r => setTimeout(r, 100));
    
    await typeLine("Verifying credentials", "terminal-default", 18);
    await new Promise(r => setTimeout(r, 200));
    
    await showLoader();
    await new Promise(r => setTimeout(r, 100));
    
    await typeLine("Access denied: 1 invalid attempt", "terminal-error", 16);
    addBlankLine();
    await new Promise(r => setTimeout(r, 300));
    
    await typeLine("Retrying authentication", "terminal-default", 18);
    await new Promise(r => setTimeout(r, 100));
    
    await typeLine("Credentials accepted", "terminal-success", 18);
    addBlankLine();
    
    await typeLine("Loading interface", "terminal-default", 18);
    await new Promise(r => setTimeout(r, 80));
    
    await typeLine("Mounting user environment", "terminal-default", 18);
    await new Promise(r => setTimeout(r, 80));
    
    await typeLine("Starting TLwebsite", "terminal-default", 18);
    addBlankLine();
    
    await typeLine("ACCESS GRANTED // WELCOME, TOOLGOOL", "terminal-access-granted", 16);
    
    // Wait before doors open
    await new Promise(r => setTimeout(r, 800));
    
    // Open doors
    leftDoor.classList.add("open");
    rightDoor.classList.add("open");
    
    // Hide intro
    await new Promise(r => setTimeout(r, 1200));
    intro.classList.add("hidden");
}

// Start on page load
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        setTimeout(startIntro, 200);
    });
} else {
    setTimeout(startIntro, 200);
}

// Skip with keyboard or touch
document.addEventListener("keydown", () => {
    if (!introStarted) {
        startIntro();
    }
}, { once: true });

document.addEventListener("touchstart", () => {
    if (!introStarted) {
        startIntro();
    }
}, { once: true });
