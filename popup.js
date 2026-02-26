document.addEventListener("DOMContentLoaded", () => {
  const errorEl = document.getElementById("error");
  const errorMessage = document.getElementById("error-message");
  const providerSelect = document.getElementById("provider");
  const openOptions = document.getElementById("open-options");
  const edgeDiscoverBtn = document.getElementById("edge-discover-btn");
  const actionStatusEl = document.getElementById("action-status");

  // 加载上次选择的 provider
  chrome.storage.sync.get(["provider"], (data) => {
    if (data.provider) {
      providerSelect.value = data.provider;
    }
  });

  providerSelect.addEventListener("change", () => {
    chrome.storage.sync.set({ provider: providerSelect.value });
  });

  openOptions.addEventListener("click", (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });

  edgeDiscoverBtn.addEventListener("click", async () => {
    hideActionStatus(actionStatusEl);
    errorEl.classList.add("hidden");

    edgeDiscoverBtn.disabled = true;

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const pageUrl = tab?.url || "";
      const tabId = tab?.id;
      const windowId = tab?.windowId;

      if (!pageUrl || typeof tabId !== "number" || typeof windowId !== "number") {
        throw new Error("无法获取当前页面地址。请切换到一个普通网页后重试。");
      }

      if (/^(edge|chrome|about|extension):\/\//i.test(pageUrl)) {
        throw new Error("当前是受限页面，无法发送。请在普通网页中使用该功能。");
      }

      await chrome.storage.local.set({
        sidepanel_request: {
          tabId,
          windowId,
          pageUrl,
          pageTitle: tab.title || "",
          provider: providerSelect.value,
          timestamp: Date.now(),
        },
      });

      // Edge 的 popup 上下文中没有 chrome.sidePanel，
      // 因此通过 background 切换为“点图标开侧边栏”模式，
      // 用户再次点击扩展图标即可打开侧边栏。
      const result = await chrome.runtime.sendMessage({ type: "prepare-sidepanel" });

      if (!result?.ok) {
        throw new Error(result?.error || "准备侧边栏失败");
      }

      // 立即尝试关闭 popup，让用户可以再次点击扩展图标
      try { window.close(); } catch (_) {}
      setTimeout(() => {
        try { window.close(); } catch (_) {}
        try { self.close(); } catch (_) {}
      }, 300);

      // 如果 popup 没能关闭（某些 Edge 版本），显示提示
      setTimeout(() => {
        showActionStatus(actionStatusEl, "success",
          "✅ 准备完成！请关闭此弹窗，然后再次点击工具栏上的扩展图标，侧边栏将自动打开并总结当前页面。");
      }, 500);
    } catch (err) {
      errorMessage.textContent = err.message || "打开侧边栏失败";
      errorEl.classList.remove("hidden");
    } finally {
      edgeDiscoverBtn.disabled = false;
    }
  });
});

function hideActionStatus(statusEl) {
  statusEl.textContent = "";
  statusEl.className = "hidden";
}

function showActionStatus(statusEl, type, text) {
  statusEl.textContent = text;
  statusEl.className = "";
  statusEl.classList.add(type);
}
