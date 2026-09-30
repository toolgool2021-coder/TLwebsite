const intro = document.getElementById("intro");
const introTerminal = document.getElementById("intro-terminal") || document.getElementById("terminal");
const leftDoor = document.querySelector(".intro-door-left") || document.getElementById("leftDoor");
const rightDoor = document.querySelector(".intro-door-right") || document.getElementById("rightDoor");

let introStarted = false;
let introComplete = false;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function createLine(className = "terminal-line") {
    const line = document.createElement("p");
    line.className = className;
    // some page versions use #intro-terminal, others use #terminal > #lines
    if (introTerminal) {
        introTerminal.appendChild(line);
    } else {
        const fallback = document.querySelector("#lines");
        (fallback || document.body).appendChild(line);
    }
    return line;
}

async function typeLine(text, className = "terminal-line", speed = 40) {
    const line = createLine(className);
    for (let i = 0; i <= text.length; i++) {
        line.textContent = text.slice(0, i);
        await sleep(speed);
    }
    return line;
}

// Types with intentional mistakes (insert wrong chars then backspace)
async function typeWithMistakes(correct, className = "terminal-line", speed = 45, mistakes = []) {
    const line = createLine(className);
    for (let i = 0; i < correct.length; i++) {
        // sometimes insert a wrong char
        const m = mistakes.find(m => m.pos === i);
        if (m) {
            line.textContent += m.wrong;
            line.className = "terminal-line error"; // red while wrong
            await sleep(speed * 2);
            // backspace the wrong char
            line.textContent = line.textContent.slice(0, -1);
            await sleep(speed * 1.2);
        }
        line.textContent += correct[i];
        await sleep(speed);
    }
    // mark as ok
    line.className = className === "terminal-line" ? "terminal-line success" : className + " success";
    return line;
}

async function showLoader(label, duration = 900) {
    const line = createLine("terminal-line");
    const frames = ["\\", "|", "/", "—"];
    let index = 0;
    const interval = setInterval(() => {
        line.textContent = `${label} ${frames[index]}`;
        index = (index + 1) % frames.length;
    }, 80);

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
        await sleep(90);
    }
    return line;
}

async function startIntro() {
    if (introStarted || introComplete) return;
    introStarted = true;

    await sleep(300);

    // header (green)
    await typeLine("[ TOOLGOOL SECURITY SYSTEM ]", "terminal-line header", 50);
    await sleep(140);

    await typeLine("BOOT SEQUENCE // START", "terminal-line", 50);
    await showLoader("Loading secure kernel", 900);
    await showLoader("Checking access modules", 900);

    // account with mistakes: inject wrong chars at positions
    // mistakes array: {pos, wrong}
    await sleep(120);
    await typeWithMistakes("account: Toolgool", "terminal-line", 60, [
        { pos: 9, wrong: "0" },   // account: Too0...
        { pos: 11, wrong: "0" },  // account: Toolg0l
        { pos: 12, wrong: "0" }   // random extra mistakes
    ]);

    await sleep(240);

    // password - multiple failed attempts with visible red state
    const pwAttempts = ["Password: ********", "Password: *****", "Password: ***", "Password: ******"];
    for (let i = 0; i < pwAttempts.length; i++) {
        const attempt = createLine(i < pwAttempts.length - 1 ? "terminal-line error" : "terminal-line");
        attempt.textContent = pwAttempts[i];
        if (i < pwAttempts.length - 1) {
            // keep it red for failed ones
            attempt.className = "terminal-line error";
            await sleep(260 + i * 80);
        } else {
            // final (accepted) make it success green
            await sleep(300);
            attempt.className = "terminal-line success";
        }
    }

    await revealIp();

    await showLoader("Resolving network identity", 900);
    await showLoader("Encrypting connection", 900);
    await showLoader("Verifying credentials", 900);

    const denied = createLine("terminal-line error");
    denied.textContent = "Access denied: 2 invalid attempts";
    await sleep(900);

    await showLoader("Retrying authentication", 900);
    await sleep(250);

    await typeLine("Credentials accepted", "terminal-line success", 60);

    await showLoader("Loading interface", 900);
    await showLoader("Mounting user environment", 900);
    await showLoader("Starting TLwebsite", 900);

    const granted = createLine("terminal-line granted");
    granted.textContent = "ACCESS GRANTED // WELCOME, TOOLGOOL";

    await sleep(700);

    // open doors if present
    if (leftDoor) leftDoor.classList.add("open");
    if (rightDoor) rightDoor.classList.add("open");

    // ensure the overlay is completely removed so page elements (icons, fonts) are visible
    await sleep(1200);

    // some page variants set a .hidden class, others expect removal — do both
    try {
        intro && (intro.style.display = "none");
        intro && intro.parentNode && intro.parentNode.removeChild(intro);
    } catch (e) {
        // ignore
    }

    // restore body overflow if it was changed
    try { document.body.style.overflow = ""; } catch (e) {}

    // ensure social imgs / font icons are visible (workaround for styles)
    document.querySelectorAll('.social-link, .social-link img, .social-link-footer').forEach(el => {
        el.style.visibility = '';
        el.style.display = '';
    });

    introComplete = true;
}

window.addEventListener("load", () => setTimeout(startIntro, 300));

// start on key press if user skips
document.addEventListener("keydown", () => {
    if (!introStarted && !introComplete) startIntro();
}, { once: true });
