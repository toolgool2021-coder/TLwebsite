/* =========================
   INTRO ANIMATION LOGIC - CYBERPUNK NEON TERMINAL
========================= */

let introStarted = false;
const loaderSymbols = ["\\", "|", "/", "—"];
let loaderIndex = 0;

function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const element = document.querySelector(selector);
        if (element) return resolve(element);

        const observer = new MutationObserver(() => {
            const element = document.querySelector(selector);
            if (element) {
                observer.disconnect();
                resolve(element);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Element ${selector} not found within ${timeout}ms`));
        }, timeout);
    });
}

function typeLine(text, className = "terminal-default", delay = 20, onComplete = null) {
    return new Promise((resolve) => {
        const terminalContent = document.getElementById("terminal-content");
        if (!terminalContent) {
            resolve(null);
            return;
        }

        const line = document.createElement("div");
        line.className = `terminal-line ${className}`;
        line.style.minHeight = "1.5em";
        terminalContent.appendChild(line);

        let index = 0;
        const timer = setInterval(() => {
            if (index < text.length) {
                line.textContent += text[index];
                index += 1;
            } else {
                clearInterval(timer);
                if (onComplete) onComplete(line);
                resolve(line);
            }
        }, delay);
    });
}

function writeBlankLine() {
    const terminalContent = document.getElementById("terminal-content");
    if (!terminalContent) return;

    const line = document.createElement("div");
    line.className = "terminal-line terminal-default";
    line.style.minHeight = "0.8em";
    line.innerHTML = "&nbsp;";
    terminalContent.appendChild(line);
}

function fixAccountLine(line) {
    if (!line) return;
    line.classList.remove("terminal-error");
    line.classList.add("terminal-success");

    setTimeout(() => {
        line.textContent = "account: Toolgo";
        setTimeout(() => {
            line.textContent = "account: Toolgool";
        }, 150);
    }, 180);
}

function fixPasswordLine(line) {
    if (!line) return;
    line.classList.remove("terminal-error");
    line.classList.add("terminal-success");

    setTimeout(() => {
        line.textContent = "Password: *******";
        setTimeout(() => {
            line.textContent = "Password: ********";
        }, 150);
    }, 180);
}

function showLoader() {
    const terminalContent = document.getElementById("terminal-content");
    if (!terminalContent) return null;

    const loader = document.createElement("div");
    loader.className = "terminal-line terminal-default";
    loader.style.minHeight = "1.5em";
    terminalContent.appendChild(loader);

    const interval = setInterval(() => {
        loader.textContent = `Loading ${loaderSymbols[loaderIndex % loaderSymbols.length]}`;
        loaderIndex += 1;
    }, 60);

    return interval;
}

async function startIntro() {
    if (introStarted) return;
    introStarted = true;

    const terminalContent = document.getElementById("terminal-content");
    const leftDoor = document.getElementById("left-door");
    const rightDoor = document.getElementById("right-door");
    const intro = document.getElementById("intro");

    if (!terminalContent || !leftDoor || !rightDoor || !intro) {
        console.error("Required intro elements not found");
        return;
    }

    terminalContent.innerHTML = "";
    loaderIndex = 0;

    const tasks = [
        () => typeLine("[ TOOLGOOL SECURITY SYSTEM ]", "terminal-header", 16),
        () => { writeBlankLine(); return Promise.resolve(); },
        () => typeLine("BOOT SEQUENCE // START", "terminal-default", 24),
        () => typeLine("Loading secure kernel", "terminal-default", 22),
        () => typeLine("Checking access modules", "terminal-default", 22),
        () => { writeBlankLine(); return Promise.resolve(); },
        () => typeLine("account: Toolgo0l", "terminal-error", 20, (line) => {
            setTimeout(() => fixAccountLine(line), 380);
        }),
        () => typeLine("Password: ••••••••", "terminal-error", 20, (line) => {
            setTimeout(() => fixPasswordLine(line), 380);
        }),
        () => {
            return new Promise((resolve) => {
                typeLine("IP-address: ", "terminal-default", 16).then((ipLine) => {
                    if (!ipLine) {
                        resolve();
                        return;
                    }
                    const ipChars = ["1", "9", "2", ":", "1", "6", "8", ":", "0", ":", "2", "4"];
                    let ipIndex = 0;

                    const ipTimer = setInterval(() => {
                        if (ipIndex < ipChars.length) {
                            ipLine.textContent += ipChars[ipIndex];
                            ipIndex += 1;
                        } else {
                            clearInterval(ipTimer);
                            resolve();
                        }
                    }, 70);
                });
            });
        },
        () => { writeBlankLine(); return Promise.resolve(); },
        () => typeLine("Resolving network identity", "terminal-default", 20),
        () => typeLine("Encrypting connection", "terminal-default", 20),
        () => typeLine("Verifying credentials", "terminal-default", 20),
        () => {
            return new Promise((resolve) => {
                const loaderInterval = showLoader();
                setTimeout(() => {
                    if (loaderInterval) clearInterval(loaderInterval);
                    typeLine("Access denied: 1 invalid attempt", "terminal-error", 16).then(() => {
                        resolve();
                    });
                }, 700);
            });
        },
        () => { writeBlankLine(); return Promise.resolve(); },
        () => typeLine("Retrying authentication", "terminal-default", 20),
        () => typeLine("Credentials accepted", "terminal-success", 20),
        () => { writeBlankLine(); return Promise.resolve(); },
        () => typeLine("Loading interface", "terminal-default", 20),
        () => typeLine("Mounting user environment", "terminal-default", 20),
        () => typeLine("Starting TLwebsite", "terminal-default", 20),
        () => { writeBlankLine(); return Promise.resolve(); },
        () => typeLine("ACCESS GRANTED // WELCOME, TOOLGOOL", "terminal-access-granted", 18),
    ];

    let delay = 150;
    for (const task of tasks) {
        await new Promise((resolve) => {
            setTimeout(async () => {
                try {
                    await task();
                } catch (e) {
                    console.error(e);
                }
                resolve();
            }, delay);
        });
        delay += 240;
    }

    setTimeout(() => {
        leftDoor.classList.add("open");
        rightDoor.classList.add("open");
    }, 8800);

    setTimeout(() => {
        intro.classList.add("hidden");
    }, 10000);
}

// Use DOMContentLoaded for better reliability
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        setTimeout(startIntro, 300);
    });
} else {
    setTimeout(startIntro, 300);
}

// Skip intro with any key/touch
document.addEventListener("keydown", () => {
    const intro = document.getElementById("intro");
    if (!introStarted) {
        startIntro();
    } else if (intro && !intro.classList.contains("hidden")) {
        intro.classList.add("hidden");
    }
}, { once: true });

document.addEventListener("touchstart", () => {
    const intro = document.getElementById("intro");
    if (!introStarted) {
        startIntro();
    } else if (intro && !intro.classList.contains("hidden")) {
        intro.classList.add("hidden");
    }
}, { once: true });
