// Service Worker - 后台处理

const t = (key, substitutions) => chrome.i18n.getMessage(key, substitutions) || "";

chrome.runtime.onInstalled.addListener(() => {
  console.log(t("backgroundInstalledLog"));

  // 点击扩展图标直接打开侧边栏
  if (chrome.sidePanel?.setPanelBehavior) {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {});
  }

  // 添加右键菜单：选中文字后总结
  chrome.contextMenus.create({
    id: "summarize-selection",
    title: t("backgroundContextMenuTitle"),
    contexts: ["selection"]
  });

  // 移除发往 Ollama 的 Origin 请求头，防止 Ollama 返回 403
  updateOllamaRules();
// 监听右键菜单点击，发送选中内容到侧边栏
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "summarize-selection") {
    if (info.selectionText) {
      // 有选中内容，直接总结选中内容
      chrome.storage.local.set({ sidepanel_selection: {
        text: info.selectionText,
        tabId: tab.id,
        pageUrl: tab.url,
        pageTitle: tab.title || ""
      }});
    } else {
      // 没有选中内容，清除 sidepanel_selection，侧边栏自动总结整个页面
      chrome.storage.local.remove("sidepanel_selection");
    }
    chrome.sidePanel.open({ tabId: tab.id });
  }
});
});

/**
 * 使用 declarativeNetRequest 动态规则移除发往 Ollama 的 Origin 头
 * 解决 chrome-extension:// origin 被 Ollama 拒绝的问题
 */
function updateOllamaRules() {
  if (!chrome.declarativeNetRequest) return;

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

// 代理 fetch 请求（解决 Ollama 等本地服务的 CORS 问题）
// 使用长连接端口保持 service worker 存活
chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== "fetch-proxy") return;

  port.onMessage.addListener(async (message) => {
    const { url, options, requestId } = message;
    try {
      // 重新构建 Request，确保在 service worker 上下文中正确发起
      const fetchOptions = {
        method: options.method || "POST",
        headers: options.headers || {},
        body: options.body,
      };
      const res = await fetch(url, fetchOptions);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        port.postMessage({
          requestId,
          ok: false,
          status: res.status,
          error: errData.error?.message || res.statusText,
        });
      } else {
        const data = await res.json();
        port.postMessage({ requestId, ok: true, data });
      }
    } catch (err) {
      port.postMessage({
        requestId,
        ok: false,
        error: err.message || t("commonNetworkRequestFailed"),
      });
    }
  });
});

// 消息处理：ping 唤醒 + 获取当前标签页 + Ollama 模型管理
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "ping") {
    sendResponse({ ok: true });
    return true;
  }

  if (message?.type === "get-active-tab") {
    chrome.tabs.query({ active: true, lastFocusedWindow: true })
      .then((tabs) => {
        const filtered = tabs.filter((t) => t.url && !/^(chrome-extension|extension):\/\//i.test(t.url));
        sendResponse({ ok: true, tab: filtered[0] || null });
      })
      .catch((err) => {
        sendResponse({ ok: false, error: err.message });
      });
    return true;
  }

  // 列出 Ollama 本地模型
  if (message?.type === "ollama-list-models") {
    const baseUrl = (message.url || "http://localhost:11434").replace(/\/+$/, "");
    fetch(`${baseUrl}/api/tags`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const models = (data.models || []).map((m) => ({
          name: m.name,
          size: m.size,
          modified: m.modified_at,
        }));
        sendResponse({ ok: true, models });
      })
      .catch((err) => {
        sendResponse({ ok: false, error: err.message || t("backgroundCannotConnectOllama") });
      });
    return true;
  }

  // 拉取 Ollama 模型（非流式，等待完成）
  if (message?.type === "ollama-pull-model") {
    const baseUrl = (message.url || "http://localhost:11434").replace(/\/+$/, "");
    const modelName = message.model || "qwen2.5:7b";
    fetch(`${baseUrl}/api/pull`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: modelName, stream: false }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        sendResponse({ ok: true, status: data.status || "success" });
      })
      .catch((err) => {
        sendResponse({ ok: false, error: err.message || t("backgroundPullModelFailed") });
      });
    return true;
  }

  return true;
});
