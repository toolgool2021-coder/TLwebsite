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
    line.classList.remove("terminal-error");
    line.classList.add("terminal-success");

    setTimeout(() => {
        line.textContent = "account: Toolgo";
        setTimeout(() => {
            line.textContent = "account: Toolgool";
        }, 180);
    }, 220);
}

function fixPasswordLine(line) {
    line.classList.remove("terminal-error");
    line.classList.add("terminal-success");

    setTimeout(() => {
        line.textContent = "Password: *******";
        setTimeout(() => {
            line.textContent = "Password: ********";
        }, 180);
    }, 220);
}

function showLoader() {
    const loader = document.createElement("div");
    loader.className = "terminal-line terminal-default";
    terminalContent.appendChild(loader);

    const interval = setInterval(() => {
        loader.textContent = `Loading ${loaderSymbols[loaderIndex % loaderSymbols.length]}`;
        loaderIndex += 1;
    }, 60);

    return interval;
}

function startIntro() {
    if (introStarted) return;
    introStarted = true;

    if (!terminalContent) return;
    terminalContent.innerHTML = "";

    const sequence = [
        () => typeLine("[ TOOLGOOL SECURITY SYSTEM ]", "terminal-header", 18),
        writeBlankLine,
        () => typeLine("BOOT SEQUENCE // START", "terminal-default", 28),
        () => typeLine("Loading secure kernel", "terminal-default", 25),
        () => typeLine("Checking access modules", "terminal-default", 25),
        writeBlankLine,
        () => typeLine("account: Toolgo0l", "terminal-error", 22, (line) => {
            setTimeout(() => fixAccountLine(line), 420);
        }),
        () => typeLine("Password: ********", "terminal-error", 22, (line) => {
            setTimeout(() => fixPasswordLine(line), 420);
        }),
        () => {
            const ipLine = typeLine("IP-address: ", "terminal-default", 18);
            const ipChars = ["1", "9", "2", ":", "1", "6", "8", ":", "0", ":", "2", "4"];
            let ipIndex = 0;

            const ipTimer = setInterval(() => {
                if (ipIndex < ipChars.length) {
                    ipLine.textContent += ipChars[ipIndex];
                    ipIndex += 1;
                } else {
                    clearInterval(ipTimer);
                }
            }, 80);
        },
        writeBlankLine,
        () => typeLine("Resolving network identity", "terminal-default", 22),
        () => typeLine("Encrypting connection", "terminal-default", 22),
        () => typeLine("Verifying credentials", "terminal-default", 22),
        () => {
            const loaderInterval = showLoader();
            setTimeout(() => {
                clearInterval(loaderInterval);
                typeLine("Access denied: 1 invalid attempt", "terminal-error", 18);
            }, 760);
        },
        writeBlankLine,
        () => typeLine("Retrying authentication", "terminal-default", 22),
        () => typeLine("Credentials accepted", "terminal-success", 22),
        writeBlankLine,
        () => typeLine("Loading interface", "terminal-default", 22),
        () => typeLine("Mounting user environment", "terminal-default", 22),
        () => typeLine("Starting TLwebsite", "terminal-default", 22),
        writeBlankLine,
        () => typeLine("ACCESS GRANTED // WELCOME, TOOLGOOL", "terminal-access-granted", 20),
    ];

    let delay = 180;
    sequence.forEach((task) => {
        setTimeout(task, delay);
        delay += 260;
    });

    setTimeout(() => {
        leftDoor.classList.add("open");
        rightDoor.classList.add("open");
    }, 9100);

    setTimeout(() => {
        intro.classList.add("hidden");
    }, 10250);
}

window.addEventListener("load", () => {
    const startTime = performance.now();
    const remaining = Math.max(0, 450 - (performance.now() - startTime));
    setTimeout(startIntro, remaining);
});

document.addEventListener("keydown", () => {
    if (!introStarted) {
        startIntro();
    } else if (!intro.classList.contains("hidden")) {
        intro.classList.add("hidden");
    }
}, { once: true });
