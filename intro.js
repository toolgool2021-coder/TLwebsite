const intro = document.getElementById("intro");
const introTerminal = document.getElementById("intro-terminal") || document.getElementById("terminal");
const leftDoor = document.querySelector(".intro-door-left") || document.getElementById("leftDoor");
const rightDoor = document.querySelector(".intro-door-right") || document.getElementById("rightDoor");

let introStarted = false;
let introComplete = false;

const TYPING_SPEED = 68;
const SLOW_SPEED = 90;
const LOADER_SPEED = 80;

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
    const line = createLine(className);
    for (let i = 0; i < correct.length; i++) {
        const m = mistakes.find(item => item.pos === i);
        if (m) {
            line.className = "terminal-line error";
            line.textContent += m.wrong;
            await sleep(speed + 60);
            line.textContent = line.textContent.slice(0, -1);
            await sleep(speed - 10);
        }

        line.textContent += correct[i];
        await sleep(speed + 18);
    }

    line.className = className === "terminal-line" ? "terminal-line success" : className + " success";
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

    await sleep(350);

    await typeLine("[ TOOLGOOL SECURITY SYSTEM ]", "terminal-line header", 60);
    await sleep(220);

    await typeLine("BOOT SEQUENCE // START", "terminal-line", 60);
    await sleep(170);
    await showLoader("Loading secure kernel", 1100);
    await sleep(140);
    await showLoader("Checking access modules", 1100);
    await sleep(200);

    await typeWithMistakes("account: Toolgool", "terminal-line", 80, [
        { pos: 9, wrong: "0" },
        { pos: 10, wrong: "0" },
        { pos: 11, wrong: "0" },
        { pos: 12, wrong: "0" },
        { pos: 13, wrong: "0" }
    ]);
    await sleep(300);

    const passwordAttempts = [
        "Password: ********",
        "Password: *******",
        "Password: ******",
        "Password: *****",
        "Password: ******",
        "Password: *********"
    ];

    for (let i = 0; i < passwordAttempts.length; i++) {
        const line = createLine(i === passwordAttempts.length - 1 ? "terminal-line success" : "terminal-line error");
        line.textContent = passwordAttempts[i];
        await sleep(320 + i * 90);
    }

    await sleep(260);
    await revealIp();
    await sleep(200);

    await showLoader("Resolving network identity", 1100);
    await sleep(120);
    await showLoader("Encrypting connection", 1100);
    await sleep(120);
    await showLoader("Verifying credentials", 1100);
    await sleep(180);

    const denied = createLine("terminal-line error");
    denied.textContent = "Access denied: 5 invalid attempts";
    await sleep(1100);

    await showLoader("Retrying authentication", 1100);
    await sleep(260);

    await typeLine("Credentials accepted", "terminal-line success", 65);
    await sleep(220);

    await showLoader("Loading interface", 1100);
    await sleep(120);
    await showLoader("Mounting user environment", 1100);
    await sleep(120);
    await showLoader("Starting TLwebsite", 1100);
    await sleep(200);

    const granted = createLine("terminal-line granted");
    granted.textContent = "ACCESS GRANTED // WELCOME, TOOLGOOL";
    await sleep(900);

    if (leftDoor) leftDoor.classList.add("open");
    if (rightDoor) rightDoor.classList.add("open");

    await sleep(1400);

    try {
        intro && (intro.style.display = "none");
        intro && intro.parentNode && intro.parentNode.removeChild(intro);
    } catch (error) {
        // no-op
    }

    try {
        document.body.style.overflow = "";
    } catch (error) {
        // no-op
    }

    document.querySelectorAll('.social-link, .social-link img, .social-link-footer').forEach(el => {
        el.style.visibility = "";
        el.style.display = "";
        el.style.opacity = "";
    });

    introComplete = true;
}

window.addEventListener("load", () => setTimeout(startIntro, 400));

document.addEventListener("keydown", () => {
    if (!introStarted && !introComplete) {
        startIntro();
    }
}, { once: true });
