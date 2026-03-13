(() => {
  function normalizeSubstitutions(substitutions) {
    if (substitutions === undefined || substitutions === null) {
      return undefined;
    }

    if (Array.isArray(substitutions)) {
      return substitutions.map((item) => String(item));
    }

    return [String(substitutions)];
  }

  function t(key, substitutions) {
    return chrome.i18n.getMessage(key, normalizeSubstitutions(substitutions)) || "";
  }

  function applyText(root = document) {
    const titleKey = document.documentElement.dataset.i18nTitle || document.body?.dataset.i18nTitle;
    if (titleKey) {
      const title = t(titleKey);
      if (title) {
        document.title = title;
      }
    }

    root.querySelectorAll("[data-i18n]").forEach((element) => {
      const message = t(element.dataset.i18n);
      if (message) {
        element.textContent = message;
      }
    });

    root.querySelectorAll("[data-i18n-html]").forEach((element) => {
      const message = t(element.dataset.i18nHtml);
      if (message) {
        element.innerHTML = message;
      }
    });

    root.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
      const message = t(element.dataset.i18nPlaceholder);
      if (message) {
        element.placeholder = message;
      }
    });

    root.querySelectorAll("[data-i18n-title]").forEach((element) => {
      const message = t(element.dataset.i18nTitle);
      if (message) {
        element.title = message;
      }
    });

    root.querySelectorAll("[data-i18n-value]").forEach((element) => {
      const message = t(element.dataset.i18nValue);
      if (message) {
        element.value = message;
      }
    });
  }

  function getLanguageTag() {
    const uiLanguage = chrome.i18n.getUILanguage().replace(/_/g, "-");
    const normalized = uiLanguage.toLowerCase();

    if (normalized.startsWith("zh-tw") || normalized.startsWith("zh-hk") || normalized.startsWith("zh-mo")) {
      return "zh-TW";
    }

    if (normalized.startsWith("zh")) {
      return "zh-CN";
    }

    if (normalized.startsWith("ja")) {
      return "ja";
    }

    if (normalized.startsWith("ko")) {
      return "ko";
    }

    if (normalized.startsWith("ru")) {
      return "ru";
    }

    return "en";
  }

  function isChinese() {
    return /^zh/i.test(chrome.i18n.getUILanguage());
  }

  function applyI18n(root = document) {
    document.documentElement.lang = getLanguageTag();
    applyText(root);
    document.documentElement.setAttribute("data-i18n-ready", "true");
  }

  window.AppI18n = {
    t,
    applyI18n,
    getLanguageTag,
    isChinese,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => applyI18n(), { once: true });
  } else {
    applyI18n();
  }
})();
