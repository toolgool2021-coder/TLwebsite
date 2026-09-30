const intro = document.getElementById("intro");
const introTerminal = document.getElementById("intro-terminal") || document.getElementById("terminal");
const leftDoor = document.querySelector(".intro-door-left") || document.getElementById("leftDoor");
const rightDoor = document.querySelector(".intro-door-right") || document.getElementById("rightDoor");

let introStarted = false;
let introComplete = false;

// tuning
const TYPING_SPEED = 48; // чуть быстрее
const SLOW_SPEED = 80;
const LOADER_SPEED = 70;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function createLine(className = "terminal-line") {
    const line = document.createElement("p");
    line.className = className;

    if (introTerminal) {
        introTerminal.appendChild(line);
    } else {
        const fallback = document.querySelector("#lines");
        (fallback || document.body).appendChild(line);
    }

    return line;
}

async function typeLine(text, className = "terminal-line", speed = TYPING_SPEED) {
    const line = createLine(className);
    for (let i = 0; i <= text.length; i++) {
        line.textContent = text.slice(0, i);
        await sleep(speed);
    }
    return line;
}

async function typeWithMistakes(correct, className = "terminal-line", speed = TYPING_SPEED, mistakes = []) {
    // start green
    const line = createLine(className + " success");

    for (let i = 0; i < correct.length; i++) {
        const m = mistakes.find(item => item.pos === i);
        if (m) {
            // show mistake in red, then remove it
            line.className = "terminal-line error";
            line.textContent += m.wrong;
            await sleep(speed + 40);
            line.textContent = line.textContent.slice(0, -1);
            await sleep(speed - 8);
            // restore green before continuing
            line.className = className + " success";
        }

        line.textContent += correct[i];
        await sleep(speed);
    }

    // final ensure green success
    line.className = className + " success";
    return line;
}

async function showLoader(label, duration = 1000) {
    const line = createLine("terminal-line");
    const frames = ["\\", "|", "/", "—"];
    let index = 0;

    const interval = setInterval(() => {
        line.textContent = `${label} ${frames[index]}`;
        index = (index + 1) % frames.length;
    }, LOADER_SPEED);

    await sleep(duration);
    clearInterval(interval);
    line.textContent = `${label} OK`;
    line.className = "terminal-line";
    return line;
}

async function revealIp() {
    const ip = "192:168:0:24";
    const line = createLine("terminal-line");
    for (let i = 0; i <= ip.length; i++) {
        line.textContent = `IP-address: ${ip.slice(0, i)}`;
        await sleep(SLOW_SPEED);
    }
    return line;
}

async function startIntro() {
    if (introStarted || introComplete) return;
    introStarted = true;

    await sleep(300);

    await typeLine("[ TOOLGOOL SECURITY SYSTEM ]", "terminal-line header", 50);
    await sleep(160);

    await typeLine("BOOT SEQUENCE // START", "terminal-line", 50);
    await sleep(140);

    await showLoader("Loading secure kernel", 1000);
    await sleep(120);
    await showLoader("Checking access modules", 1000);
    await sleep(160);

    // account: show with mistakes (green -> red during mistakes)
    await typeWithMistakes("account: Toolgool", "terminal-line", 60, [
        { pos: 9, wrong: "0" },
        { pos: 11, wrong: "0" },
        { pos: 12, wrong: "0" }
    ]);

    await sleep(220);

    // password: show attempts but remove failed attempts to simulate retry
    const passwordAttempts = [
        "Password: ********",
        "Password: *******",
        "Password: *****",
        "Password: ***",
        "Password: ******",
        "Password: *********" // final - accepted
    ];

    let prevLine = null;
    for (let i = 0; i < passwordAttempts.length; i++) {
        const text = passwordAttempts[i];
        const cls = (i === passwordAttempts.length - 1) ? "terminal-line success" : "terminal-line error";

        // create the attempt
        const attemptLine = createLine(cls);
        attemptLine.textContent = text;
        await sleep(300 + i * 80);

        // if failed attempt, remove it before next try to simulate fresh typing
        if (i < passwordAttempts.length - 1) {
            try { attemptLine.parentNode && attemptLine.parentNode.removeChild(attemptLine); } catch (e) {}
        } else {
            // final accepted - keep it
        }

        prevLine = attemptLine;
    }

    await sleep(200);
    await revealIp();
    await sleep(200);

    await showLoader("Resolving network identity", 1000);
    await sleep(120);
    await showLoader("Encrypting connection", 1000);
    await sleep(120);
    await showLoader("Verifying credentials", 1000);
    await sleep(160);

    const denied = createLine("terminal-line error");
    denied.textContent = "Access denied: 5 invalid attempts";
    await sleep(900);

    await showLoader("Retrying authentication", 1000);
    await sleep(220);

    await typeLine("Credentials accepted", "terminal-line success", 55);
    await sleep(200);

    await showLoader("Loading interface", 1000);
    await sleep(120);
    await showLoader("Mounting user environment", 1000);
    await sleep(120);
    await showLoader("Starting TLwebsite", 1000);
    await sleep(200);

    const granted = createLine("terminal-line granted");
    granted.textContent = "ACCESS GRANTED // WELCOME, TOOLGOOL";
    await sleep(700);

    if (leftDoor) leftDoor.classList.add("open");
    if (rightDoor) rightDoor.classList.add("open");

    await sleep(1200);

    // remove overlay and explicitly restore visibility for site icons
    try {
        if (intro) {
            intro.style.display = "none";
            if (intro.parentNode) intro.parentNode.removeChild(intro);
        }
    } catch (e) {}

    try { document.body.style.overflow = ""; } catch (e) {}

    // restore a broad set of elements — make them visible and bring to front
    const selectors = [
        '.social-link',
        '.social-link img',
        '.social-link-footer',
        '.music-player',
        '.music-player-toggle',
        '.avatar-wrapper',
        '.username',
        '.posts-section',
        '.team-section',
        '.footer',
        '.modal'
    ];

    document.querySelectorAll(selectors.join(',')).forEach(el => {
        try {
            el.style.visibility = 'visible';
            // prefer to restore display to inline-flex or block depending on tag
            const tag = (el.tagName || '').toLowerCase();
            if (tag === 'img' || el.classList.contains('social-link')) el.style.display = 'inline-flex';
            else el.style.display = '';
            el.style.opacity = '1';
            el.style.zIndex = '';
        } catch (e) {}
    });

    // also ensure font awesome icons are visible (sometimes font-load glitch)
    document.querySelectorAll('i.fab, i.fas').forEach(i => { i.style.opacity = '1'; i.style.visibility = 'visible'; });

    introComplete = true;
}

window.addEventListener("load", () => setTimeout(startIntro, 300));

document.addEventListener("keydown", () => {
    if (!introStarted && !introComplete) startIntro();
}, { once: true });
