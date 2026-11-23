"use strict";
(() => {
  const init = () => {
    // Avoid dead social links that lead to the Telegram home page.
    document.querySelectorAll('a[href="https://t.me/"]').forEach(link => {
      link.removeAttribute("href");
      link.setAttribute("aria-disabled", "true");
      link.title = "Ссылка пока не добавлена";
    });
    // Make the copy action work in browsers without Clipboard API.
    const handle = document.getElementById("copyHandle");
    if (handle && !navigator.clipboard?.writeText) {
      handle.addEventListener("click", () => {
        const field = document.createElement("textarea");
        field.value = "@Toolgool";
        field.style.position = "fixed";
        field.style.opacity = "0";
        document.body.append(field);
        field.select();
        try { document.execCommand("copy"); } catch {}
        field.remove();
      });
    }
    // Mark failed decorative/social images without displaying broken-image icons.
    document.querySelectorAll(".social-card img,.team-avatar").forEach(img => {
      img.addEventListener("error", () => {
        img.style.visibility = "hidden";
        img.closest("a,button")?.classList.add("tl-image-unavailable");
      }, {once:true});
    });
    // Count actual visible people, not placeholder records.
    const peopleCount = document.querySelector('.tl-hero-metrics a[href="#people"] strong');
    if (peopleCount && typeof teamMembers !== "undefined") {
      peopleCount.textContent = String(teamMembers.filter(m => m && m.name?.trim() && m.avatar).length).padStart(2,"0");
    }
    // Honor the user's preference for reduced animation.
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.documentElement.classList.add("tl-cinema-off");
    }
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded",init,{once:true});
  else init();
})();