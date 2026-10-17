(() => {
  const consentKey = "language_cookie_consent";
  const languageKey = "site_language";
  const consent = () => {
    try { return localStorage.getItem(consentKey); }
    catch { return null; }
  };

  function readLanguageCookie() {
    const row = document.cookie
        .split(";")
        .map(part => part.trim())
        .find(part => part.startsWith(`${languageKey}=`));
    const language = row ? row.slice(languageKey.length + 1) : "";
    return language === "mk" || language === "en" ? language : null;
  }

  function saveLanguageCookie(language) {
    const secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${languageKey}=${language}; Max-Age=31536000; Path=/; SameSite=Lax${secure}`;
  }

  function clearLanguageCookie() {
    document.cookie = `${languageKey}=; Max-Age=0; Path=/; SameSite=Lax`;
  }

  const styles = document.createElement("style");
  styles.textContent = `
    .language-cookie-banner {
      position: fixed; z-index: 9999; left: 50%; bottom: 20px;
      transform: translateX(-50%); width: min(960px, calc(100% - 32px));
      box-sizing: border-box; padding: 18px 22px;
      color: #f7f4f4; background: linear-gradient(120deg, #101010, #242020);
      border: 1px solid #4b3b3b; border-left: 4px solid #740102;
      border-radius: 12px; box-shadow: 0 12px 36px rgba(0,0,0,.38);
      font: inherit;
    }
    .language-cookie-inner { display: flex; align-items: center; justify-content: space-between; gap: 22px; }
    .language-cookie-copy { margin: 0; color: inherit; font-size: 14px; line-height: 1.55; }
    .language-cookie-copy strong { display: block; margin-bottom: 3px; color: #fff; font-size: 15px; }
    .language-cookie-actions { display: flex; flex: 0 0 auto; gap: 10px; }
    .language-cookie-actions button {
      min-width: 104px; padding: 10px 16px; border: 1px solid #740102;
      border-radius: 7px; font: inherit; font-size: 13px; font-weight: 700;
      cursor: pointer; transition: background .2s, transform .2s;
    }
    .language-cookie-actions button:hover { transform: translateY(-1px); }
    .language-cookie-accept { color: #fff; background: #740102; }
    .language-cookie-accept:hover { background: #940205; }
    .language-cookie-reject { color: #f7f4f4; background: transparent; border-color: #615858 !important; }
    .language-cookie-reject:hover { background: rgba(255,255,255,.08); }
    @media (max-width: 620px) {
      .language-cookie-banner { bottom: 12px; padding: 16px; }
      .language-cookie-inner { align-items: stretch; flex-direction: column; gap: 14px; }
      .language-cookie-actions button { flex: 1; }
    }
  `;
  document.head.appendChild(styles);

  let currentLanguage = document.documentElement.lang === "mk" ? "mk" : "en";

  function showConsentBanner() {
    if (consent() === "accepted" || consent() === "rejected") return;

    document.getElementById("language-cookie-banner")?.remove();
    const isMk = currentLanguage === "mk";
    const banner = document.createElement("aside");
    banner.id = "language-cookie-banner";
    banner.className = "language-cookie-banner";
    banner.setAttribute("aria-label", isMk ? "Согласност за колаче" : "Cookie consent");
    banner.innerHTML = `
      <div class="language-cookie-inner">
        <p class="language-cookie-copy">
          <strong>${isMk ? "Колачиња" : "Cookies"}</strong>
          ${isMk
        ? "Оваа веб-страница користи колачиња. Дали се согласувате?"
        : "This website uses cookies. Do you agree?"}
        </p>
        <div class="language-cookie-actions">
          <button type="button" class="language-cookie-accept">${isMk ? "Прифаќам" : "Accept"}</button>
          <button type="button" class="language-cookie-reject">${isMk ? "Одбивам" : "Reject"}</button>
        </div>
      </div>`;
    document.body.appendChild(banner);

    banner.querySelector(".language-cookie-accept").addEventListener("click", () => {
      try { localStorage.setItem(consentKey, "accepted"); } catch {}
      saveLanguageCookie(currentLanguage);
      banner.remove();
    });
    banner.querySelector(".language-cookie-reject").addEventListener("click", () => {
      try { localStorage.setItem(consentKey, "rejected"); } catch {}
      clearLanguageCookie();
      banner.remove();
    });
  }

  // Capture the language button click before its inline changeLanguage handler runs.
  // This reliably saves the choice even when a page has its own language function.
  document.addEventListener("click", event => {
    const button = event.target.closest(".language-bar button");
    if (!button) return;
    const selected = button.textContent.trim().toLowerCase();
    if (selected !== "mk" && selected !== "en") return;
    currentLanguage = selected;
    if (consent() === "accepted") saveLanguageCookie(selected);
  }, true);

  document.addEventListener("DOMContentLoaded", () => {
    // Page scripts initially select English; apply the saved language after those handlers finish.
    setTimeout(() => {
      const saved = consent() === "accepted" ? readLanguageCookie() : null;
      if (saved && typeof window.changeLanguage === "function") {
        currentLanguage = saved;
        window.changeLanguage(saved);
      } else {
        currentLanguage = document.documentElement.lang === "mk" ? "mk" : "en";
      }
      showConsentBanner();
    }, 0);
  });
})();
