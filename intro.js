const intro =
    document.getElementById("intro");

const lines =
    document.getElementById("lines");

const left =
    document.getElementById("leftDoor");

const right =
    document.getElementById("rightDoor");

let started = false;


/* задержка */

const sleep = ms =>
    new Promise(resolve =>
        setTimeout(resolve, ms)
    );


/* новая строка */

function line(className = "line") {

    const element =
        document.createElement("div");

    element.className =
        className;

    lines.appendChild(element);

    return element;
}


/* печать текста */

async function type(
    text,
    className = "line",
    speed = 13
) {

    const element =
        line(className);

    for (const character of text) {

        element.textContent +=
            character;

        await sleep(speed);
    }

    return element;
}


/* загрузка \ | / — */

async function loader(
    text,
    duration = 260
) {

    const element =
        line();

    const frames = [
        "\\",
        "|",
        "/",
        "—"
    ];

    let index = 0;

    const interval =
        setInterval(() => {

            element.textContent =
                text + " " +
                frames[index];

            index =
                (index + 1) %
                frames.length;

        }, 55);


    await sleep(duration);

    clearInterval(interval);

    element.textContent =
        text + " ✓";
}


/* исправление ника */

async function correction() {

    const element =
        line("line error");

    element.textContent =
        "account: Toolgo0l";

    await sleep(180);


    element.textContent =
        "account: Toolgo";

    await sleep(110);


    element.textContent =
        "account: Toolg";

    await sleep(100);


    element.textContent =
        "account: Toolgo";

    await sleep(100);


    element.textContent =
        "account: Toolgool";

    await sleep(180);


    element.className =
        "line ok";
}


/* исправление пароля */

async function password() {

    const element =
        await type(
            "Password: ********",
            "line error",
            12
        );

    await sleep(160);


    element.textContent =
        "Password: *****";

    await sleep(100);


    element.textContent =
        "Password: ***";

    await sleep(120);


    element.textContent =
        "Password: ******";

    element.className =
        "line ok";
}


/* ввод IP */

async function ip() {

    const element =
        line();

    const value =
        "192:168:0:24";

    for (const character of value) {

        element.textContent +=
            character;

        await sleep(48);
    }

    element.textContent =
        "IP-address: " + value;
}


/* =========================
   ГЛАВНАЯ ПОСЛЕДОВАТЕЛЬНОСТЬ
========================= */

async function startIntro() {

    if (started)
        return;

    started = true;


    await sleep(180);


    await type(
        "BOOT SEQUENCE // START"
    );


    await loader(
        "Loading secure kernel"
    );


    await loader(
        "Checking access modules"
    );


    await correction();


    await password();


    await ip();


    await loader(
        "Resolving network identity"
    );


    await loader(
        "Encrypting connection"
    );


    await loader(
        "Verifying credentials"
    );


    await type(
        "Access denied: 1 invalid attempt",
        "line error",
        9
    );


    await sleep(260);


    await loader(
        "Retrying authentication"
    );


    await type(
        "Credentials accepted",
        "line ok",
        10
    );


    await loader(
        "Loading interface"
    );


    await loader(
        "Mounting user environment"
    );


    await loader(
        "Starting TLwebsite"
    );


    await type(
        "ACCESS GRANTED // WELCOME, TOOLGOOL",
        "line ok",
        10
    );


    await sleep(300);


    /*
       СНАЧАЛА скрываем терминал
       ПОТОМ открываем двери
    */

    intro.classList.add("done");


    left.classList.add("open");

    right.classList.add("open");


    /*
       После полной анимации
       intro исчезает полностью
    */

    await sleep(1150);

    intro.classList.add("hide");
}


/* запускаем только один раз */

window.addEventListener(
    "load",
    startIntro,
    { once: true }
);
