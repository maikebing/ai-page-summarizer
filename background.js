// Service Worker - 后台处理

const t = (key, substitutions) => chrome.i18n.getMessage(key, substitutions) || "";
const LEGACY_PROVIDER_IDS = ["deepseek", "openai", "gemini", "anthropic", "doubao", "ollama", "dockerai", "foundrylocal", "koboldcpp", "giteeai", "githubcopilot"];
const LEGACY_NETWORK_SETTING_KEYS = [
  "relay_endpoint",
  "relay_token",
  "proxy_local_mode",
  "proxy_local_scheme",
  "proxy_local_host",
  "proxy_local_port",
  "proxy_local_username",
  "proxy_local_password",
  "proxy_local_enabled_providers",
  "proxy_online_mode",
  "proxy_online_scheme",
  "proxy_online_host",
  "proxy_online_port",
  "proxy_online_username",
  "proxy_online_password",
  "proxy_online_enabled_providers",
  ...LEGACY_PROVIDER_IDS.flatMap((provider) => [
    `${provider}_proxy_mode`,
    `${provider}_proxy_scheme`,
    `${provider}_proxy_host`,
    `${provider}_proxy_port`,
    `${provider}_proxy_username`,
    `${provider}_proxy_password`,
  ]),
];

cleanupLegacyNetworkSettings();

chrome.runtime.onInstalled.addListener(() => {
  console.log(t("backgroundInstalledLog"));
  cleanupLegacyNetworkSettings();

  if (chrome.sidePanel?.setPanelBehavior) {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {});
  }

  chrome.contextMenus.create({
    id: "summarize-selection",
    title: t("backgroundContextMenuTitle"),
    contexts: ["selection"]
  });

  updateOllamaRules();
});

chrome.runtime.onStartup?.addListener(() => {
  cleanupLegacyNetworkSettings();
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== "summarize-selection") {
    return;
  }

  if (info.selectionText) {
    chrome.storage.local.set({
      sidepanel_selection: {
        text: info.selectionText,
        tabId: tab.id,
        pageUrl: tab.url,
        pageTitle: tab.title || ""
      }
    });
  } else {
    chrome.storage.local.remove("sidepanel_selection");
  }

  chrome.sidePanel.open({ tabId: tab.id });
});

function updateOllamaRules() {
  if (!chrome.declarativeNetRequest) {
    return;
  }

  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [1, 2],
    addRules: [
      {
        id: 1,
        priority: 1,
        action: {
          type: "modifyHeaders",
          requestHeaders: [
            { header: "Origin", operation: "remove" }
          ]
        },
        condition: {
          urlFilter: "||localhost",
          resourceTypes: ["xmlhttprequest"]
        }
      },
      {
        id: 2,
        priority: 1,
        action: {
          type: "modifyHeaders",
          requestHeaders: [
            { header: "Origin", operation: "remove" }
          ]
        },
        condition: {
          urlFilter: "||127.0.0.1",
          resourceTypes: ["xmlhttprequest"]
        }
      }
    ]
  }).catch((err) => {
    console.warn(t("backgroundOllamaRuleWarning"), err);
  });
}

function cleanupLegacyNetworkSettings() {
  chrome.storage.sync.remove(LEGACY_NETWORK_SETTING_KEYS, () => {
    if (chrome.runtime.lastError) {
      console.warn("Failed to clean legacy network settings:", chrome.runtime.lastError.message);
    }
  });
}

function getRequestHost(url) {
  try {
    return new URL(url).host;
  } catch {
    return "";
  }
}

function getNetworkErrorMessage(url, error) {
  const host = getRequestHost(url);

  if (error?.name === "AbortError") {
    return t("backgroundRequestTimedOut", host || t("commonUnavailable"));
  }

  if (host === "models.github.ai") {
    return t("backgroundCannotReachGitHubModels");
  }

  if (host) {
    return t("backgroundCannotReachRemoteHost", host);
  }

  return error?.message || t("commonNetworkRequestFailed");
}

async function performJsonFetch(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000);

  try {
    const response = await fetch(url, {
      method: options.method || "GET",
      headers: options.headers || {},
      body: options.body,
      signal: controller.signal,
    });
    const data = await response.json().catch(() => ({}));

    return {
      ok: response.ok,
      status: response.status,
      data,
      error: data.error?.message || data.message || response.statusText,
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      data: {},
      error: getNetworkErrorMessage(url, error),
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== "background-fetch") {
    return;
  }

  port.onMessage.addListener(async (message) => {
    const { url, options, requestId } = message;

    try {
      const response = await performJsonFetch(url, options);
      if (!response.ok) {
        port.postMessage({
          requestId,
          ok: false,
          status: response.status,
          error: response.error,
        });
        return;
      }

      port.postMessage({ requestId, ok: true, data: response.data });
    } catch (err) {
      port.postMessage({
        requestId,
        ok: false,
        error: err.message || t("commonNetworkRequestFailed"),
      });
    }
  });
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "ping") {
    sendResponse({ ok: true });
    return true;
  }

  if (message?.type === "get-active-tab") {
    chrome.tabs.query({ active: true, lastFocusedWindow: true })
      .then((tabs) => {
        const filtered = tabs.filter((tab) => tab.url && !/^(chrome-extension|extension):\/\//i.test(tab.url));
        sendResponse({ ok: true, tab: filtered[0] || null });
      })
      .catch((err) => {
        sendResponse({ ok: false, error: err.message });
      });
    return true;
  }

  if (message?.type === "background-fetch") {
    performJsonFetch(message.url, message.options)
      .then((response) => {
        sendResponse(response);
      })
    return true;
  }

  if (message?.type === "ollama-list-models") {
    const baseUrl = (message.url || "http://localhost:11434").replace(/\/+$/, "");
    performJsonFetch(`${baseUrl}/api/tags`, { method: "GET" })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.error || `HTTP ${response.status}`);
        }

        const data = response.data || {};
        const models = (data.models || []).map((model) => ({
          name: model.name,
          size: model.size,
          modified: model.modified_at,
        }));
        sendResponse({ ok: true, models });
      })
      .catch((err) => {
        sendResponse({ ok: false, error: err.message || t("backgroundCannotConnectOllama") });
      });
    return true;
  }

  if (message?.type === "ollama-pull-model") {
    const baseUrl = (message.url || "http://localhost:11434").replace(/\/+$/, "");
    const modelName = message.model || "qwen2.5:7b";

    performJsonFetch(`${baseUrl}/api/pull`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: modelName, stream: false }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.error || `HTTP ${response.status}`);
        }

        const data = response.data || {};
        sendResponse({ ok: true, status: data.status || "success" });
      })
      .catch((err) => {
        sendResponse({ ok: false, error: err.message || t("backgroundPullModelFailed") });
      });
    return true;
  }

  return true;
});
