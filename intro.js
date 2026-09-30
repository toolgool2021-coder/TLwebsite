const intro = document.getElementById("intro");
const introTerminal = document.getElementById("intro-terminal");
const leftDoor = document.querySelector(".intro-door-left");
const rightDoor = document.querySelector(".intro-door-right");

let introStarted = false;
let introComplete = false;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function createLine(className = "terminal-line") {
    const line = document.createElement("p");
    line.className = className;
    introTerminal.appendChild(line);
    return line;
}

async function typeLine(text, className = "terminal-line", speed = 28) {
    const line = createLine(className);

    for (let i = 0; i <= text.length; i++) {
        line.textContent = text.slice(0, i);
        await sleep(speed);
    }

    return line;
}

async function showLoader(label, duration = 900) {
    const line = createLine("terminal-line");
    const frames = ["\\", "|", "/", "—"];
    let index = 0;

    const interval = setInterval(() => {
        line.textContent = `${label} ${frames[index]}`;
        index = (index + 1) % frames.length;
    }, 60);

    await sleep(duration);
    clearInterval(interval);
    line.textContent = `${label} OK`;
    return line;
}

async function showAccountCorrection() {
    const line = createLine("terminal-line");
    const variants = [
        "account: Toolgo0l",
        "account: Toolg0ol",
        "account: Toolgo0l",
        "account: Toolgool",
        "account: Toolgool"
    ];

    for (const variant of variants) {
        line.textContent = variant;
        line.style.color = "#ff5d5d";
        line.style.textShadow = "0 0 12px rgba(255, 93, 93, 0.9)";
        await sleep(120);
    }

    line.style.color = "#39ff88";
    line.style.textShadow = "0 0 12px rgba(57, 255, 136, 0.9)";
    line.textContent = "account: Toolgool";
    return line;
}

async function showPasswordCorrection() {
    const line = createLine("terminal-line");
    const variants = [
        "Password: ********",
        "Password: *******",
        "Password: ********",
        "Password: *********",
        "Password: *********"
    ];

    for (const variant of variants) {
        line.textContent = variant;
        line.style.color = "#ff5d5d";
        line.style.textShadow = "0 0 12px rgba(255, 93, 93, 0.9)";
        await sleep(120);
    }

    line.style.color = "#39ff88";
    line.style.textShadow = "0 0 12px rgba(57, 255, 136, 0.9)";
    line.textContent = "Password: *********";
    return line;
}

async function revealIp() {
    const line = createLine("terminal-line");
    const ip = "192:168:0:24";

    for (let i = 0; i <= ip.length; i++) {
        line.textContent = `IP-address: ${ip.slice(0, i)}`;
        await sleep(80);
    }

    return line;
}

async function startIntro() {
    if (introStarted || introComplete) return;
    introStarted = true;

    const sequence = [
        { text: "[ TOOLGOOL SECURITY SYSTEM ]", className: "terminal-line header", speed: 22 },
        { text: "BOOT SEQUENCE // START", className: "terminal-line", speed: 24 },
        { text: "Loading secure kernel", className: "terminal-line", speed: 28 },
        { text: "Checking access modules", className: "terminal-line", speed: 28 },
        { text: "", className: "terminal-line", speed: 10 },
        { text: "account: Toolgo0l", className: "terminal-line error", speed: 18 },
        { text: "", className: "terminal-line", speed: 10 }
    ];

    for (const item of sequence) {
        if (!item.text) {
            createLine("terminal-line blank");
            await sleep(180);
            continue;
        }

        await typeLine(item.text, item.className, item.speed);
        await sleep(140);
    }

    await showAccountCorrection();
    await sleep(380);

    const passwordLine = await typeLine("Password: ********", "terminal-line error", 18);
    await sleep(220);
    passwordLine.textContent = "Password: *******";
    await sleep(110);
    passwordLine.textContent = "Password: *********";
    passwordLine.style.color = "#39ff88";
    passwordLine.style.textShadow = "0 0 12px rgba(57, 255, 136, 0.9)";
    await sleep(280);

    await typeLine("IP-address: 0", "terminal-line", 25);
    await sleep(200);
    await revealIp();
    await sleep(180);

    await typeLine("Resolving network identity", "terminal-line", 24);
    await sleep(140);
    await typeLine("Encrypting connection", "terminal-line", 24);
    await sleep(140);
    await typeLine("Verifying credentials", "terminal-line", 24);
    await sleep(260);

    await showLoader("Loading interfaces", 900);
    await sleep(240);

    const deniedLine = createLine("terminal-line error");
    deniedLine.textContent = "Access denied: 1 invalid attempt";
    await sleep(820);

    await typeLine("Retrying authentication", "terminal-line", 18);
    await sleep(260);
    await typeLine("Credentials accepted", "terminal-line success", 18);
    await sleep(300);

    await typeLine("Loading interface", "terminal-line", 22);
    await sleep(140);
    await typeLine("Mounting user environment", "terminal-line", 22);
    await sleep(140);
    await typeLine("Starting TLwebsite", "terminal-line", 22);
    await sleep(360);

    const grantedLine = createLine("terminal-line granted");
    grantedLine.textContent = "ACCESS GRANTED // WELCOME, TOOLGOOL";
    await sleep(900);

    leftDoor.classList.add("open");
    rightDoor.classList.add("open");

    setTimeout(() => {
        intro.classList.add("hidden");
    }, 750);

    introComplete = true;
}

window.addEventListener("load", () => {
    setTimeout(startIntro, 200);
});

document.addEventListener("keydown", () => {
    if (!introStarted && !introComplete) {
        startIntro();
    }
}, { once: true });
