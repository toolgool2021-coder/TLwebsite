"use strict";

(() => {
  const intro = document.getElementById("intro");

  try {
    const alreadyShown = sessionStorage.getItem("tl-intro");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const effectsDisabled = document.documentElement.classList.contains("no-effects");

    if (alreadyShown || reducedMotion || effectsDisabled) {
      return;
    }

    sessionStorage.setItem("tl-intro", "seen");
  } catch {
    return;
  }

  if (!intro) {
    return;
  }

  intro.hidden = false;

  const dismiss = () => {
    intro.hidden = true;
    document.removeEventListener("keydown", dismiss);
    document.removeEventListener("pointerdown", dismiss);
  };

  document.addEventListener("keydown", dismiss, { once: true });
  document.addEventListener("pointerdown", dismiss, { once: true });
  setTimeout(dismiss, 1500);
})();

(() => {
  const escapeHtml = (value) => {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const formatLabel = (key) => {
    const labels = {
      telegram: "Telegram",
      vk: "VK",
      instagram: "Instagram",
      tiktok: "TikTok",
      youtube: "YouTube",
      x: "X",
      github: "GitHub",
      discord: "Discord",
      twitch: "Twitch",
      facebook: "Facebook",
      snapchat: "Snapchat",
      email: "Email"
    };

    return labels[key] || key.charAt(0).toUpperCase() + key.slice(1);
  };

  const renderTeam = () => {
    const teamGrid = document.getElementById("teamGrid");
    if (!teamGrid || !Array.isArray(window.teamMembers)) {
      return;
    }

    const members = window.teamMembers.filter((member) => {
      return member && member.name && member.name.trim() && member.avatar;
    });

    if (!members.length) {
      teamGrid.innerHTML = "<p>Пока нет людей в круге.</p>";
      return;
    }

    teamGrid.innerHTML = members
      .map((member) => {
        const socials = Object.entries(member.socials || {})
          .filter(([, value]) => typeof value === "string" && value.trim())
          .map(([name, url]) => {
            return `
              <a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">
                ${formatLabel(name)}
              </a>
            `;
          })
          .join("");

        return `
          <button class="team-card" type="button" data-member-id="${member.id}">
            <img class="team-avatar" src="${escapeHtml(member.avatar)}" alt="${escapeHtml(member.name)}" loading="lazy">
            <div>
              <h3>${escapeHtml(member.name)}</h3>
              <small>${escapeHtml(member.relationship || "В моём круге")}</small>
            </div>
            <span class="arrow" aria-hidden="true">→</span>
          </button>
        `;
      })
      .join("");

    teamGrid.querySelectorAll(".team-card").forEach((button) => {
      button.addEventListener("click", () => {
        const member = window.teamMembers.find((item) => String(item.id) === button.dataset.memberId);
        if (!member) {
          return;
        }

        const modal = document.getElementById("profileModal");
        const modalBody = document.getElementById("modalBody");
        const modalTitle = document.getElementById("profileName");

        if (!modal || !modalBody || !modalTitle) {
          return;
        }

        modalTitle.textContent = member.name;
        modalBody.innerHTML = `
          <img class="profile-avatar" src="${escapeHtml(member.avatar)}" alt="${escapeHtml(member.name)}">
          <div class="profile-meta">
            <span>${escapeHtml(member.relationship || "В кругу")}</span>
            <h3 id="profileName">${escapeHtml(member.name)}</h3>
          </div>
          <p>${escapeHtml(member.description || "Описание пока не добавлено.")}</p>
          <div class="profile-links">
            ${Object.entries(member.socials || {})
              .filter(([, value]) => typeof value === "string" && value.trim())
              .map(([name, url]) => {
                return `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${formatLabel(name)}</a>`;
              })
              .join("") || "<span>Ссылки не добавлены.</span>"}
          </div>
        `;

        modal.showModal();
      });
    });
  };

  const renderPosts = async () => {
    const container = document.getElementById("postsContainer");
    const retryButton = document.getElementById("retryPosts");

    if (!container) {
      return;
    }

    const showLoading = () => {
      container.innerHTML = "<p>Загружаем записи…</p>";
      if (retryButton) retryButton.hidden = true;
    };

    const showError = (message) => {
      container.innerHTML = `<p>${escapeHtml(message)}</p>`;
      if (retryButton) retryButton.hidden = false;
    };

    const parsePosts = (text) => {
      const blocks = text
        .split(/\n\s*\n/)
        .map((block) => block.trim())
        .filter(Boolean);

      if (!blocks.length) {
        return "<p>Пока нет заметок.</p>";
      }

      return blocks
        .map((block) => {
          const lines = block
            .split(/\n/)
            .map((line) => line.trim())
            .filter(Boolean);

          const links = lines
            .map((line) => {
              const value = line.replace(/^https?:\/\//i, "").replace(/^www\./i, "");
              if (value.includes(".") && !/\s/.test(value) && value.length > 3) {
                return `https://${value}`;
              }
              return "";
            })
            .filter(Boolean);

          const textContent = lines
            .filter((line) => !links.includes(`https://${line.replace(/^https?:\/\//i, "").replace(/^www\./i, "")}`))
            .join("<br>");

          return `
            <div class="post-item">
              ${textContent ? `<div>${textContent}</div>` : ""}
              ${links.length ? `
                <div class="link-list">
                  ${links
                    .map((url) => `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(url)}</a>`)
                    .join("")}
                </div>
              ` : ""}
            </div>
          `;
        })
        .join("");
    };

    const loadPosts = async () => {
      showLoading();

      try {
        const response = await fetch("posts.txt", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Не удалось получить заметки.");
        }

        const text = await response.text();
        const html = parsePosts(text);
        container.innerHTML = html;
      } catch (error) {
        showError(error.message || "Не удалось загрузить записи.");
      }
    };

    if (retryButton) {
      retryButton.addEventListener("click", loadPosts, { once: true });
    }

    await loadPosts();
  };

  const initCopyHandle = () => {
    const copyHandle = document.getElementById("copyHandle");
    if (!copyHandle) {
      return;
    }

    copyHandle.addEventListener("click", async () => {
      const value = "@Toolgool";
      try {
        await navigator.clipboard.writeText(value);
        const toast = document.getElementById("toast");
        if (toast) {
          toast.textContent = "Ник скопирован";
          toast.classList.add("visible");
          setTimeout(() => toast.classList.remove("visible"), 1800);
        }
      } catch {
        // Silent fallback when clipboard is unavailable.
      }
    });
  };

  const initEffectsToggle = () => {
    const toggle = document.getElementById("effects");
    if (!toggle) {
      return;
    }

    const root = document.documentElement;
    const syncState = () => {
      const active = !root.classList.contains("no-effects");
      toggle.setAttribute("aria-pressed", String(active));
      toggle.querySelector("span")?.textContent = active ? "Эффекты" : "Эффекты off";
    };

    syncState();
    toggle.addEventListener("click", () => {
      root.classList.toggle("no-effects");
      syncState();
    });
  };

  const initYear = () => {
    const yearEl = document.getElementById("year");
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  };

  const initMusicPlayer = () => {
    const playerToggle = document.getElementById("playerToggleBtn");
    const playerBody = document.getElementById("playerBody");
    const audioElement = document.getElementById("audioElement");
    const playBtn = document.getElementById("playBtn");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const volumeInput = document.getElementById("volume");
    const songTitle = document.getElementById("songTitle");
    const miniState = document.getElementById("miniState");
    const status = document.getElementById("audioStatus");

    if (!playerToggle || !playerBody || !audioElement || !playBtn || !prevBtn || !nextBtn || !volumeInput) {
      return;
    }

    const tracks = Array.isArray(window.playlist) ? window.playlist : [];
    if (!tracks.length) {
      return;
    }

    let currentIndex = 0;
    let isPlaying = false;

    const updateStatus = (message) => {
      if (status) {
        status.textContent = message;
      }
    };

    const syncPlayerUI = () => {
      const track = tracks[currentIndex];
      if (track && songTitle) {
        songTitle.textContent = track.title;
      }

      if (miniState) {
        miniState.textContent = isPlaying ? "Воспроизведение" : "Включить музыку";
      }

      playBtn.textContent = isPlaying ? "❚❚" : "▶";
      playBtn.setAttribute("aria-pressed", String(isPlaying));
      playerToggle.closest(".music-player")?.classList.toggle("playing", isPlaying);
    };

    const loadTrack = () => {
      const track = tracks[currentIndex];
      if (!track) {
        return;
      }

      audioElement.src = track.url;
      audioElement.load();
      if (songTitle) {
        songTitle.textContent = track.title;
      }
      updateStatus("Готово к воспроизведению");
    };

    playerToggle.addEventListener("click", () => {
      const hidden = playerBody.hasAttribute("hidden");
      playerBody.toggleAttribute("hidden", !hidden);
      playerToggle.setAttribute("aria-expanded", String(hidden));
    });

    playBtn.addEventListener("click", async () => {
      if (!tracks.length) {
        return;
      }

      try {
        if (audioElement.paused) {
          if (!audioElement.src) {
            loadTrack();
          }
          await audioElement.play();
          isPlaying = true;
        } else {
          audioElement.pause();
          isPlaying = false;
        }
        syncPlayerUI();
      } catch {
        updateStatus("Не удалось запустить воспроизведение");
      }
    });

    nextBtn.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % tracks.length;
      loadTrack();
      if (isPlaying) {
        audioElement.play().catch(() => updateStatus("Не удалось воспроизвести следующий трек"));
      }
      syncPlayerUI();
    });

    prevBtn.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + tracks.length) % tracks.length;
      loadTrack();
      if (isPlaying) {
        audioElement.play().catch(() => updateStatus("Не удалось воспроизвести предыдущий трек"));
      }
      syncPlayerUI();
    });

    volumeInput.addEventListener("input", () => {
      audioElement.volume = Number(volumeInput.value);
    });

    audioElement.addEventListener("ended", () => {
      currentIndex = (currentIndex + 1) % tracks.length;
      loadTrack();
      audioElement.play().catch(() => updateStatus("Не удалось воспроизвести следующий трек"));
      syncPlayerUI();
    });

    audioElement.volume = Number(volumeInput.value || 0.6);
    loadTrack();
    syncPlayerUI();
  };

  renderPosts();
  renderTeam();
  initCopyHandle();
  initEffectsToggle();
  initYear();
  initMusicPlayer();
})();
