const intro = document.getElementById("intro");
const introTerminal = document.getElementById("intro-terminal") || document.getElementById("terminal");
const leftDoor = document.querySelector(".intro-door-left") || document.getElementById("leftDoor");
const rightDoor = document.querySelector(".intro-door-right") || document.getElementById("rightDoor");
const snowCanvas = document.getElementById("snowCanvas");

let introStarted = false;
let introComplete = false;

// tuning - faster typing
const TYPING_SPEED = 20; // was 48
const SLOW_SPEED = 50;
const LOADER_SPEED = 60;

// WebAudio for beeps (fallback safe)
let audioCtx = null;
function ensureAudio() {
    if (audioCtx) return audioCtx;
    try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        return audioCtx;
    } catch (e) {
        audioCtx = null;
        return null;
    }
}

function beep(freq = 800, duration = 60, volume = 0.02) {
    const ctx = ensureAudio();
    if (!ctx) return;
    const now = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(freq, now);
    g.gain.setValueAtTime(volume, now);
    o.connect(g);
    g.connect(ctx.destination);
    o.start(now);
    o.stop(now + duration / 1000);
}

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

async function typeLine(text, className = "terminal-line", speed = TYPING_SPEED, sound = true) {
    const line = createLine(className);
    for (let i = 0; i <= text.length; i++) {
        line.textContent = text.slice(0, i);
        if (sound && i > 0) beep(900 - Math.min(600, i * 8), 18, 0.009);
        await sleep(speed);
    }
    return line;
}

async function typeWithMistakes(correct, className = "terminal-line", speed = TYPING_SPEED, mistakes = []) {
    // start green
    let line = createLine(className + " success");

    for (let i = 0; i < correct.length; i++) {
        const m = mistakes.find(item => item.pos === i);
        if (m) {
            // show mistake in red, then remove it
            line.className = "terminal-line error";
            line.textContent += m.wrong;
            beep(300, 80, 0.015);
            await sleep(speed + 40);

            // remove wrong char
            line.textContent = line.textContent.slice(0, -1);
            await sleep(speed - 8);

            // remove the whole mistaken line and create a new one (different type)
            try { line.parentNode && line.parentNode.removeChild(line); } catch (e) {}
            line = createLine("terminal-line retry");
        }

        line.textContent += correct[i];
        beep(800, 18, 0.008);
        await sleep(speed);
    }

    // final ensure green success
    line.className = className + " success";
    return line;
}

async function showLoader(label, duration = 800) {
    const line = createLine("terminal-line");
    const frames = ["\\", "|", "/", "—"];
    let index = 0;

    const interval = setInterval(() => {
        line.textContent = `${label} ${frames[index]}`;
        index = (index + 1) % frames.length;
    }, LOADER_SPEED);

    const steps = Math.max(1, Math.floor(duration / 200));
    // small rhythmic beeps while loading
    for (let i = 0; i < steps; i++) {
        beep(600 + (i % 2) * 120, 40, 0.01);
        await sleep(duration / steps);
    }

    clearInterval(interval);
    line.textContent = `${label} ✓`;
    line.className = "terminal-line";
    beep(1000, 120, 0.02);
    return line;
}

async function revealIp() {
    const ip = "132:197:0:24";
    const line = createLine("terminal-line");
    for (let i = 0; i <= ip.length; i++) {
        line.textContent = `IP-address: ${ip.slice(0, i)}`;
        await sleep(SLOW_SPEED);
    }
    return line;
}

// shake effect on container
function doShake(duration = 700) {
    const container = document.querySelector('.container') || document.body;
    container.classList.add('shake');
    setTimeout(() => container.classList.remove('shake'), duration);
}

async function startIntro() {
    if (introStarted || introComplete) return;
    introStarted = true;

    ensureAudio(); // prepare audio on load (may be blocked until user gesture)

    // make sure snow is visible during intro, then hide later
    if (snowCanvas) snowCanvas.style.pointerEvents = 'none';

    await sleep(200);

    await typeLine("[ TOOLGOOL SECURITY SYSTEM ]", "terminal-line header", 36);
    await sleep(120);

    await typeLine("BOOT SEQUENCE // START", "terminal-line", 36);
    await sleep(120);

    await showLoader("Loading secure kernel", 900);
    await sleep(100);
    await showLoader("Checking access modules", 900);
    await sleep(120);

    await typeWithMistakes("account: Toolgool", "terminal-line", 36, [
        { pos: 9, wrong: "0" },
        { pos: 11, wrong: "0" },
        { pos: 12, wrong: "0" }
    ]);

    await sleep(180);

    const passwordAttempts = [
        "Password: ********",
        "Password: *******",
        "Password: *****",
        "Password: ***",
        "Password: ******",
        "Password: *********"
    ];

    for (let i = 0; i < passwordAttempts.length; i++) {
        const text = passwordAttempts[i];
        const cls = (i === passwordAttempts.length - 1) ? "terminal-line success" : "terminal-line error";
        const attemptLine = createLine(cls);
        attemptLine.textContent = text;
        // small error beep for failed attempts
        if (i < passwordAttempts.length - 1) beep(280, 90, 0.02);
        await sleep(220 + i * 60);
        if (i < passwordAttempts.length - 1) {
            try { attemptLine.parentNode && attemptLine.parentNode.removeChild(attemptLine); } catch (e) {}
        }
    }

    await sleep(160);
    await revealIp();
    await sleep(160);

    await showLoader("Resolving network identity", 900);
    await sleep(100);
    await showLoader("Encrypting connection", 900);
    await sleep(100);
    await showLoader("Verifying credentials", 900);
    await sleep(120);

    const denied = createLine("terminal-line error");
    denied.textContent = "Access denied: 5 invalid attempts";
    beep(220, 160, 0.03);
    await sleep(700);

    await showLoader("Retrying authentication", 900);
    await sleep(160);

    await typeLine("Credentials accepted", "terminal-line success", 36);
    beep(1200, 140, 0.03);
    await sleep(160);

    await showLoader("Loading interface", 900);
    await sleep(80);
    await showLoader("Mounting user environment", 900);
    await sleep(80);
    await showLoader("Starting TLwebsite", 900);
    await sleep(140);

    const granted = createLine("terminal-line granted");
    granted.textContent = "ACCESS GRANTED // WELCOME, TOOLGOOL";
    // do a stronger success sound + shake
    beep(1600, 220, 0.035);
    doShake(700);
    await sleep(600);

    if (leftDoor) leftDoor.classList.add("open");
    if (rightDoor) rightDoor.classList.add("open");

    // quick door-rattle sound
    beep(420, 200, 0.03);

    await sleep(900);

    // remove overlay
    try {
        if (intro) {
            intro.style.transition = 'opacity 250ms ease';
            intro.style.opacity = '0';
            await sleep(260);
            if (intro.parentNode) intro.parentNode.removeChild(intro);
        }
    } catch (e) {}

    // hide snow canvas smoothly
    if (snowCanvas) {
        try {
            snowCanvas.style.transition = 'opacity 400ms ease';
            snowCanvas.style.opacity = '0';
            await sleep(420);
            snowCanvas.style.display = 'none';
        } catch (e) {}
    }

    // restore visibility of icons / content
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
            el.style.display = '';
            el.style.opacity = '1';
            el.style.zIndex = '';
        } catch (e) {}
    });

    // ensure font awesome icons visible
    document.querySelectorAll('i.fab, i.fas').forEach(i => { i.style.opacity = '1'; i.style.visibility = 'visible'; });

    // small flourish sound
    beep(1800, 220, 0.03);

    introComplete = true;
}

window.addEventListener("load", () => setTimeout(startIntro, 180));

document.addEventListener("keydown", () => {
    if (!introStarted && !introComplete) startIntro();
}, { once: true });
