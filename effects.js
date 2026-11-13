"use strict";

(() => {
  const root = document.documentElement;

  if (document.getElementById("tlSpaceCanvas")) {
    return;
  }

  const reducedMotion = matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  const finePointer = matchMedia(
    "(hover: hover) and (pointer: fine)"
  );

  // Слои фона.

  const background = document.createElement("div");
  background.className = "fx-background";
  background.setAttribute("aria-hidden", "true");

  const grid = document.createElement("div");
  grid.className = "fx-grid";
  background.append(grid);

  const canvas = document.createElement("canvas");
  canvas.id = "tlSpaceCanvas";
  canvas.setAttribute("aria-hidden", "true");

  const progress = document.createElement("div");
  progress.className = "fx-scroll";
  progress.setAttribute("aria-hidden", "true");

  document.body.prepend(background, canvas, progress);

  const context = canvas.getContext("2d");

  let width = innerWidth;
  let height = innerHeight;

  let stars = [];
  let meteors = [];
  let ripples = [];

  let frame = 0;
  let previousTime = 0;
  let nextMeteor = 0;
  let active = false;

  let pointer = {
    x: width / 2,
    y: height / 2
  };

  let hoveredCard = null;
  let pointerDirty = false;

  const animations = new Set();

  // Управление анимациями элементов.

  function animateElement(element, keyframes, options) {
    if (!active || !element.animate) {
      return;
    }

    const animation = element.animate(keyframes, options);
    animations.add(animation);

    const remove = () => {
      animations.delete(animation);
    };

    animation.addEventListener("finish", remove, {
      once: true
    });

    animation.addEventListener("cancel", remove, {
      once: true
    });
  }

  function resetCard() {
    if (!hoveredCard) {
      return;
    }

    hoveredCard.style.removeProperty("--tilt-x");
    hoveredCard.style.removeProperty("--tilt-y");
    hoveredCard = null;
  }

  function syncMotion() {
    active =
      !root.classList.contains("no-effects") &&
      !reducedMotion.matches &&
      !document.hidden;

    if (root.classList.contains("fx-paused") !== !active) {
      root.classList.toggle("fx-paused", !active);
    }

    if (frame) {
      cancelAnimationFrame(frame);
    }

    frame = 0;

    if (!active) {
      for (const animation of animations) {
        animation.cancel();
      }

      resetCard();
      ripples = [];
      return;
    }

    previousTime = performance.now();
    nextMeteor = previousTime + 1400;

    if (context) {
      frame = requestAnimationFrame(draw);
    }
  }

  // Размеры и количество звёзд.

  function resize() {
    width = Math.max(1, innerWidth);
    height = Math.max(1, innerHeight);

    const ratio = Math.min(devicePixelRatio || 1, 1.5);

    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);

    if (context) {
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    stars = Array.from(
      { length: width < 700 ? 36 : 70 },
      () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: .4 + Math.random() * 1.5,
        speed: 3 + Math.random() * 8,
        phase: Math.random() * Math.PI * 2
      })
    );

    meteors = [];
    updateProgress();
  }

  function updateProgress() {
    const distance = root.scrollHeight - innerHeight;

    const value = distance > 0
      ? Math.min(1, Math.max(0, scrollY / distance))
      : 0;

    progress.style.setProperty("--page-progress", value);
  }

  // Вся отрисовка фона выполняется одним циклом.

  function draw(time) {
    if (!active || !context) {
      frame = 0;
      return;
    }

    const delta = Math.min(
      (time - previousTime) / 1000,
      .05
    );

    previousTime = time;

    context.clearRect(0, 0, width, height);

    // Звёзды и соединения.

    for (let index = 0; index < stars.length; index++) {
      const star = stars[index];

      star.y = (star.y + star.speed * delta) % height;

      const alpha =
        .3 +
        (Math.sin(time / 1700 + star.phase) + 1) * .22;

      context.fillStyle = `rgba(177,224,255,${alpha})`;

      context.beginPath();
      context.arc(
        star.x,
        star.y,
        star.size,
        0,
        Math.PI * 2
      );
      context.fill();

      // Только три соседние частицы для каждой звезды.

      for (let offset = 1; offset <= 3; offset++) {
        const other = stars[index + offset];

        if (!other) {
          break;
        }

        const distance = Math.hypot(
          star.x - other.x,
          star.y - other.y
        );

        if (distance > 150) {
          continue;
        }

        const lineAlpha = (1 - distance / 150) * .18;

        context.strokeStyle =
          `rgba(117,190,255,${lineAlpha})`;

        context.lineWidth = .7;
        context.beginPath();
        context.moveTo(star.x, star.y);
        context.lineTo(other.x, other.y);
        context.stroke();
      }
    }

    // Метеоры.

    if (time > nextMeteor) {
      meteors.push({
        x: Math.random() * width,
        y: -80,
        life: 0
      });

      nextMeteor =
        time + 2600 + Math.random() * 2800;
    }

    meteors = meteors.filter(meteor => meteor.life < 1.8);

    for (const meteor of meteors) {
      meteor.life += delta;
      meteor.x -= 260 * delta;
      meteor.y += 410 * delta;

      const gradient = context.createLinearGradient(
        meteor.x,
        meteor.y,
        meteor.x + 75,
        meteor.y - 120
      );

      gradient.addColorStop(
        0,
        "rgba(168,226,255,.75)"
      );

      gradient.addColorStop(
        1,
        "rgba(168,226,255,0)"
      );

      context.strokeStyle = gradient;
      context.lineWidth = 1.5;

      context.beginPath();
      context.moveTo(meteor.x, meteor.y);
      context.lineTo(
        meteor.x + 75,
        meteor.y - 120
      );
      context.stroke();
    }

    // Волны нажатия на фоне.

    ripples = ripples.filter(ripple => ripple.life < .7);

    for (const ripple of ripples) {
      ripple.life += delta;

      const opacity =
        Math.max(0, 1 - ripple.life / .7) * .6;

      context.strokeStyle =
        `rgba(133,218,255,${opacity})`;

      context.lineWidth = 1;

      context.beginPath();
      context.arc(
        ripple.x,
        ripple.y,
        8 + ripple.life * 100,
        0,
        Math.PI * 2
      );
      context.stroke();
    }

    // Подсветка и наклон карточки под указателем.

    if (pointerDirty && hoveredCard) {
      const box = hoveredCard.getBoundingClientRect();

      const x = Math.max(
        0,
        Math.min(1, (pointer.x - box.left) / box.width)
      );

      const y = Math.max(
        0,
        Math.min(1, (pointer.y - box.top) / box.height)
      );

      hoveredCard.style.setProperty(
        "--spot-x",
        `${x * 100}%`
      );

      hoveredCard.style.setProperty(
        "--spot-y",
        `${y * 100}%`
      );

      hoveredCard.style.setProperty(
        "--tilt-x",
        `${(0.5 - y) * 5}deg`
      );

      hoveredCard.style.setProperty(
        "--tilt-y",
        `${(x - 0.5) * 6}deg`
      );

      pointerDirty = false;
    }

    frame = requestAnimationFrame(draw);
  }

  // Появление карточек при прокрутке.

  const cardSelector = ".project,.social-card,.team-card";
  const prepared = new WeakSet();

  const revealObserver = "IntersectionObserver" in window
    ? new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue;
          }

          animateElement(
            entry.target,
            [
              {
                opacity: .2,
                translate: "0 22px"
              },
              {
                opacity: 1,
                translate: "0 0"
              }
            ],
            {
              duration: 650,
              easing: "cubic-bezier(.2,.7,.2,1)"
            }
          );

          revealObserver.unobserve(entry.target);
        }
      }, {
        threshold: .12
      })
    : null;

  function prepareCards() {
    document.querySelectorAll(cardSelector).forEach(card => {
      if (prepared.has(card)) {
        return;
      }

      prepared.add(card);
      card.classList.add("fx-card");

      if (revealObserver) {
        revealObserver.observe(card);
      }
    });

    updateProgress();
  }

  // Обработчики работают и с динамически созданными карточками.

  document.addEventListener("pointermove", event => {
    if (!active || !finePointer.matches) {
      return;
    }

    const card = event.target.closest(cardSelector);

    if (card !== hoveredCard) {
      resetCard();
    }

    hoveredCard = card;

    pointer = {
      x: event.clientX,
      y: event.clientY
    };

    pointerDirty = true;
  }, {
    passive: true
  });

  document.documentElement.addEventListener(
    "pointerleave",
    resetCard
  );

  document.addEventListener("pointerdown", event => {
    if (!active) {
      return;
    }

    ripples.push({
      x: event.clientX,
      y: event.clientY,
      life: 0
    });

    ripples = ripples.slice(-6);

    const control = event.target.closest("a,button");

    if (control) {
      animateElement(
        control,
        [
          { scale: "1" },
          { scale: ".96" },
          { scale: "1" }
        ],
        {
          duration: 260,
          easing: "ease-out"
        }
      );
    }
  }, {
    passive: true
  });

  // Количество проектов, соцсетей и друзей берётся из страницы.

  const summary = document.createElement("div");
  summary.className = "fx-summary";

  const counts = [
    ["#projects", ".project", "проекта"],
    ["#socials", ".social-card", "соцсетей"],
    ["#people", ".team-card", "в моём круге"]
  ];

  function updateSummary() {
    summary.replaceChildren();

    for (const [href, selector, label] of counts) {
      const count = document.querySelectorAll(selector).length;

      if (!count) {
        continue;
      }

      const link = document.createElement("a");
      link.href = href;

      const value = document.createElement("strong");
      value.textContent = count;

      link.append(
        value,
        document.createTextNode(label)
      );

      summary.append(link);
    }
  }

  document.querySelector(".hero-copy")?.append(summary);

  // Обновление после загрузки заметок или карточек.

  for (const id of ["teamGrid", "postsContainer"]) {
    const container = document.getElementById(id);

    if (container) {
      new MutationObserver(() => {
        prepareCards();
        updateSummary();
      }).observe(container, {
        childList: true,
        subtree: true
      });
    }
  }

  // Синхронизация с существующей кнопкой «Эффекты».

  new MutationObserver(syncMotion).observe(root, {
    attributes: true,
    attributeFilter: ["class"]
  });

  reducedMotion.addEventListener("change", syncMotion);

  document.addEventListener(
    "visibilitychange",
    syncMotion
  );

  window.addEventListener(
    "resize",
    resize,
    { passive: true }
  );

  window.addEventListener(
    "scroll",
    updateProgress,
    { passive: true }
  );

  if ("ResizeObserver" in window) {
    new ResizeObserver(updateProgress).observe(document.body);
  }

  resize();
  syncMotion();
  prepareCards();
  updateSummary();
})();
