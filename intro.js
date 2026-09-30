/* =========================
   INTRO ANIMATION LOGIC - TERMINAL SECURITY BOOT
========================= */

const intro = document.getElementById("intro");
const leftDoor = document.getElementById("left-door");
const rightDoor = document.getElementById("right-door");
const terminalContent = document.getElementById("terminal-content");

let introStarted = false;
const loaderSymbols = ["\\", "|", "/", "—"];
let loaderIndex = 0;

function typeLine(text, className = "terminal-default", delay = 25, onComplete = null) {
    const line = document.createElement("div");
    line.className = `terminal-line ${className}`;
    terminalContent.appendChild(line);

    let index = 0;
    const timer = setInterval(() => {
        if (index < text.length) {
            line.textContent += text[index];
            index += 1;
        } else {
            clearInterval(timer);
            if (onComplete) onComplete(line);
        }
    }, delay);

    return line;
}

function writeBlankLine() {
    const line = document.createElement("div");
    line.className = "terminal-line terminal-default";
    line.innerHTML = "&nbsp;";
    terminalContent.appendChild(line);
}

function fixAccountLine(line) {
    const wrong = "account: Toolgo0l";
    const correct = "account: Toolgool";

    line.classList.remove("terminal-error");
    line.classList.add("terminal-success");

    setTimeout(() => {
        line.textContent = "account: Toolgo";
        setTimeout(() => {
            line.textContent = correct;
        }, 180);
    }, 220);

    // keep consistent with intended output even if starting text differs
    if (line.textContent !== wrong) {
        line.textContent = correct;
    }
}

function fixPasswordLine(line) {
    const wrong = "Password: ********";
    const fixed = "Password: ********";

    line.classList.remove("terminal-error");
    line.classList.add("terminal-success");

    setTimeout(() => {
        line.textContent = "Password: *******";
        setTimeout(() => {
            line.textContent = fixed;
        }, 150);
    }, 240);

    if (line.textContent !== wrong) {
        line.textContent = fixed;
    }
}

function showLoader() {
    const loader = document.createElement("span");
    loader.className = "terminal-line terminal-default loader-indicator";
    terminalContent.appendChild(loader);

    const interval = setInterval(() => {
        loader.textContent = `Loading ${loaderSymbols[loaderIndex % loaderSymbols.length]} `;
        loaderIndex += 1;
    }, 60);

    return interval;
}

function startIntro() {
    if (introStarted) return;
    introStarted = true;

    if (!terminalContent) return;
    terminalContent.innerHTML = "";

    const tasks = [
        () => typeLine("[ TOOLGOOL SECURITY SYSTEM ]", "terminal-header", 20),
        () => writeBlankLine(),
        () => typeLine("BOOT SEQUENCE // START", "terminal-default", 28),
        () => typeLine("Loading secure kernel", "terminal-default", 25),
        () => typeLine("Checking access modules", "terminal-default", 25),
        () => writeBlankLine(),
        () => typeLine("account: Toolgo0l", "terminal-error", 22, (line) => {
            setTimeout(() => fixAccountLine(line), 420);
        }),
        () => typeLine("Password: ********", "terminal-error", 22, (line) => {
            setTimeout(() => fixPasswordLine(line), 440);
        }),
        () => typeLine("IP-address: 0:0:0:0", "terminal-default", 18),
        () => {
            const ipLine = typeLine("IP-address: ", "terminal-default", 15);
            let ipValue = "";
            const ipChars = ["1", "9", "2", ":", "1", "6", "8", ":", "0", ":", "2", "4"];
            let ipIndex = 0;
            const ipTimer = setInterval(() => {
                if (ipIndex < ipChars.length) {
                    ipValue += ipChars[ipIndex];
                    ipLine.textContent += ipChars[ipIndex];
                    ipIndex += 1;
                } else {
                    clearInterval(ipTimer);
                }
            }, 80);
        },
        () => writeBlankLine(),
        () => typeLine("Resolving network identity", "terminal-default", 20),
        () => typeLine("Encrypting connection", "terminal-default", 20),
        () => typeLine("Verifying credentials", "terminal-default", 20),
        () => {
            const loaderInterval = showLoader();
            setTimeout(() => {
                clearInterval(loaderInterval);
                const errorLine = typeLine("Access denied: 1 invalid attempt", "terminal-error", 18);
                setTimeout(() => {
                    errorLine.classList.add("terminal-error");
                }, 100);
            }, 700);
        },
        () => writeBlankLine(),
        () => typeLine("Retrying authentication", "terminal-default", 20),
        () => typeLine("Credentials accepted", "terminal-success", 20),
        () => writeBlankLine(),
        () => typeLine("Loading interface", "terminal-default", 20),
        () => typeLine("Mounting user environment", "terminal-default", 20),
        () => typeLine("Starting TLwebsite", "terminal-default", 20),
        () => writeBlankLine(),
        () => typeLine("ACCESS GRANTED // WELCOME, TOOLGOOL", "terminal-access-granted", 20),
    ];

    let delay = 180;
    tasks.forEach((task) => {
        setTimeout(task, delay);
        delay += 300;
    });

    setTimeout(() => {
        leftDoor.classList.add("open");
        rightDoor.classList.add("open");
    }, 9000);

    setTimeout(() => {
        intro.classList.add("hidden");
    }, 10100);
}

window.addEventListener("load", () => {
    const elapsed = performance.now() - startTime;
    const remaining = Math.max(0, 450 - elapsed);
    setTimeout(startIntro, remaining);
});

const startTime = performance.now();

document.addEventListener("keydown", () => {
    if (!introStarted) {
        startIntro();
    } else if (!intro.classList.contains("hidden")) {
        intro.classList.add("hidden");
    }
}, { once: true });
