document.addEventListener("DOMContentLoaded", () => {
  const loadingEl = document.getElementById("loading");
  const resultEl = document.getElementById("result");
  const summaryContent = document.getElementById("summary-content");
  const errorEl = document.getElementById("error");
  const errorMessage = document.getElementById("error-message");
  const copyBtn = document.getElementById("copy-btn");
  const providerSelect = document.getElementById("provider");
  const summarizeBtn = document.getElementById("summarize-btn");
  const openOptions = document.getElementById("open-options");

  // 加载上次选择的 provider
  chrome.storage.sync.get(["provider"], (data) => {
    if (data.provider) {
      providerSelect.value = data.provider;
    }
  });

  providerSelect.addEventListener("change", () => {
    chrome.storage.sync.set({ provider: providerSelect.value });
  });

  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(summaryContent.textContent).then(() => {
      copyBtn.textContent = "✅ 已复制";
      setTimeout(() => {
        copyBtn.textContent = "📋 复制";
      }, 2000);
    });
  });

  openOptions.addEventListener("click", (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });

  // 总结当前页面
  async function doSummarize() {
    loadingEl.classList.remove("hidden");
    resultEl.classList.add("hidden");
    errorEl.classList.add("hidden");
    summarizeBtn.disabled = true;

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      if (!tab?.id || !tab?.url) {
        throw new Error("无法获取当前页面信息。请切换到一个普通网页后重试。");
      }

      if (/^(edge|chrome|about|extension):\/\//i.test(tab.url)) {
        throw new Error("当前是受限页面，无法读取内容。请在普通网页中使用。");
      }

      const [{ result: pageContent }] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: extractPageContent,
      });

      if (!pageContent || pageContent.trim().length === 0) {
        throw new Error("无法提取页面内容。请确认当前页面有可读文本。");
      }

      const maxLength = 15000;
      const truncated =
        pageContent.length > maxLength
          ? pageContent.substring(0, maxLength) + "\n\n[内容过长，已截断...]"
          : pageContent;

      const summary = await callAI(providerSelect.value, truncated, tab.title || "", tab.url || "");

      summaryContent.textContent = summary;
      resultEl.classList.remove("hidden");
    } catch (err) {
      errorMessage.textContent = err.message || "总结失败";
      errorEl.classList.remove("hidden");
    } finally {
      loadingEl.classList.add("hidden");
      summarizeBtn.disabled = false;
    }
  }

  // 点击按钮重新总结
  summarizeBtn.addEventListener("click", doSummarize);

  // 侧边栏打开时自动总结
  doSummarize();
});

function extractPageContent() {
  const selectorsToRemove = [
    "script",
    "style",
    "nav",
    "footer",
    "header",
    "noscript",
    "iframe",
    "aside",
    "[role=\"complementary\"]",
    ".advertisement",
    ".sidebar",
  ];

  const cloned = document.cloneNode(true);

  selectorsToRemove.forEach((sel) => {
    cloned.querySelectorAll(sel).forEach((el) => el.remove());
  });

  const article = cloned.querySelector("article") || cloned.querySelector("main") || cloned.querySelector("body");
  return article ? article.innerText.replace(/\n{3,}/g, "\n\n").trim() : "";
}

async function callAI(provider, content, pageTitle, pageUrl) {
  const config = await getAPIConfig(provider);

  if (!config.apiKey) {
    throw new Error(`请先在设置页面中配置 ${provider === "deepseek" ? "DeepSeek" : "豆包"} 的 API Key`);
  }

  const prompt = `请用中文总结以下网页，要求：
1. 先用一句话概括主旨
2. 然后列出 3-5 个关键要点
3. 如果有重要数据或结论，请特别标注

网页标题：${pageTitle || "未获取"}
网页地址：${pageUrl || "未获取"}

网页内容：
${content}`;

  const messages = [
    { role: "system", content: "你是一个专业的内容分析助手，擅长快速总结网页内容的核心要点。" },
    { role: "user", content: prompt },
  ];

  let apiUrl;
  let headers;
  let body;

  if (provider === "deepseek") {
    apiUrl = "https://api.deepseek.com/chat/completions";
    headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    };
    body = JSON.stringify({
      model: config.model || "deepseek-chat",
      messages,
      max_tokens: 2000,
      temperature: 0.3,
    });
  } else {
    apiUrl = "https://ark.cn-beijing.volces.com/api/v3/chat/completions";
    headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    };
    body = JSON.stringify({
      model: config.model || "doubao-pro-256k",
      messages,
      max_tokens: 2000,
      temperature: 0.3,
    });
  }

  const response = await fetch(apiUrl, { method: "POST", headers, body });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(`API 请求失败 (${response.status}): ${errData.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "未能获取总结结果";
}

function getAPIConfig(provider) {
  return new Promise((resolve) => {
    chrome.storage.sync.get([`${provider}_api_key`, `${provider}_model`], (data) => {
      resolve({
        apiKey: data[`${provider}_api_key`] || "",
        model: data[`${provider}_model`] || "",
      });
    });
  });
}
