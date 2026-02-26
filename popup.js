document.addEventListener("DOMContentLoaded", () => {
  const summarizeBtn = document.getElementById("summarize-btn");
  const loadingEl = document.getElementById("loading");
  const resultEl = document.getElementById("result");
  const summaryContent = document.getElementById("summary-content");
  const errorEl = document.getElementById("error");
  const errorMessage = document.getElementById("error-message");
  const copyBtn = document.getElementById("copy-btn");
  const providerSelect = document.getElementById("provider");
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

  openOptions.addEventListener("click", (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });

  summarizeBtn.addEventListener("click", async () => {
    // 重置 UI
    resultEl.classList.add("hidden");
    errorEl.classList.add("hidden");
    loadingEl.classList.remove("hidden");
    summarizeBtn.disabled = true;

    try {
      // 1. 获取当前标签页
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      // 2. 注入内容脚本，提取页面文本
      const [{ result: pageContent }] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: extractPageContent,
      });

      if (!pageContent || pageContent.trim().length === 0) {
        throw new Error("无法提取页面内容。请确认当前页面有可读文本且不是受限页面（如 edge:// 或扩展商店）。");
      }

      // 3. 截断过长文本（避免超出 token 限制）
      const maxLength = 15000;
      const truncated = pageContent.length > maxLength
        ? pageContent.substring(0, maxLength) + "\n\n[内容过长，已截断...]"
        : pageContent;

      // 4. 调用 AI API
      const provider = providerSelect.value;
      const summary = await callAI(provider, truncated, tab.title);

      // 5. 展示结果
      summaryContent.textContent = summary;
      resultEl.classList.remove("hidden");

    } catch (err) {
      errorMessage.textContent = err.message || "发生未知错误";
      errorEl.classList.remove("hidden");
    } finally {
      loadingEl.classList.add("hidden");
      summarizeBtn.disabled = false;
    }
  });

  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(summaryContent.textContent).then(() => {
      copyBtn.textContent = "✅ 已复制";
      setTimeout(() => { copyBtn.textContent = "📋 复制"; }, 2000);
    });
  });
});

// 在页面中执行的函数 - 提取页面文本内容
function extractPageContent() {
  // 移除不需要的元素
  const selectorsToRemove = ["script", "style", "nav", "footer", "header", "noscript", "iframe", "aside", "[role=\"complementary\"]", ".advertisement", ".sidebar"];
  const cloned = document.cloneNode(true);

  selectorsToRemove.forEach((sel) => {
    cloned.querySelectorAll(sel).forEach((el) => el.remove());
  });

  // 尝试获取 article 或 main 内容
  const article = cloned.querySelector("article") || cloned.querySelector("main") || cloned.querySelector("body");

  return article ? article.innerText.replace(/\n{3,}/g, "\n\n").trim() : "";
}

// 调用 AI API
async function callAI(provider, content, pageTitle) {
  const config = await getAPIConfig(provider);

  if (!config.apiKey) {
    throw new Error(`请先在设置页面中配置 ${provider === "deepseek" ? "DeepSeek" : "豆包"} 的 API Key`);
  }

  const prompt = `请用中文总结以下网页内容，要求：
1. 先用一句话概括主旨
2. 然后列出 3-5 个关键要点
3. 如果有重要数据或结论，请特别标注

网页标题：${pageTitle}

网页内容：
${content}`;

  const messages = [
    { role: "system", content: "你是一个专业的内容分析助手，擅长快速总结网页内容的核心要点。" },
    { role: "user", content: prompt },
  ];

  let apiUrl, headers, body;

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
  } else if (provider === "doubao") {
    // 豆包使用火山引擎 Ark API（兼容 OpenAI 格式）
    apiUrl = `https://ark.cn-beijing.volces.com/api/v3/chat/completions`;
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
    throw new Error(`API 请求失败 (${response.status}): ${errData.error?.message || response.statusText}。请检查 API Key 是否正确或服务是否可用。`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "未能获取总结结果";
}

// 从 storage 获取 API 配置
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
