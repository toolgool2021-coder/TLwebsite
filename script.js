"use strict";

// Короткое приветствие один раз за сессию вкладки.
// Любая клавиша или нажатие пропускает анимацию.

(() => {
  const intro = document.getElementById("intro");

  try {
    const alreadyShown =
      sessionStorage.getItem("tl-intro");

    const reducedMotion = matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const effectsDisabled =
      document.documentElement.classList.contains(
        "no-effects"
      );

    if (
      alreadyShown ||
      reducedMotion ||
      effectsDisabled
    ) {
      return;
    }

    sessionStorage.setItem("tl-intro", "seen");
  } catch {
    return;
  }

  intro.hidden = false;

  const dismiss = () => {
    intro.hidden = true;

    document.removeEventListener(
      "keydown",
      dismiss
    );

    document.removeEventListener(
      "pointerdown",
      dismiss
    );
  };

  document.addEventListener(
    "keydown",
    dismiss,
    { once: true }
  );

  document.addEventListener(
    "pointerdown",
    dismiss,
    { once: true }
  );

  setTimeout(dismiss, 1500);
})();
