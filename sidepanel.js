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
    navigator.clipboard.writeText(summaryContent.innerText).then(() => {
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
      // 先 ping 唤醒 service worker
      await wakeServiceWorker();

      // 通过 background service worker 获取当前标签页
      const tabResult = await sendMessageWithRetry({ type: "get-active-tab" });

      const tab = tabResult?.tab;

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

      summaryContent.innerHTML = renderMarkdown(summary);
      resultEl.classList.remove("hidden");
    } catch (err) {
      let msg = err.message || "总结失败";
      // 检测 CORS / 网络连接错误并给出 Ollama 专属提示
      if (providerSelect.value === "ollama" &&
          (msg.includes("Failed to fetch") || msg.includes("CORS") || msg.includes("NetworkError") || msg.includes("网络请求失败"))) {
        msg = "无法连接 Ollama 服务。请检查：\n1. Ollama 是否已启动（ollama serve）\n2. 启动前设置环境变量 OLLAMA_ORIGINS=*\n   Windows: set OLLAMA_ORIGINS=* 然后 ollama serve\n   Mac/Linux: OLLAMA_ORIGINS=* ollama serve";
      }
      errorMessage.textContent = msg;
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

/**
 * 简易 Markdown → HTML 渲染器
 * 支持标题、粗体、斜体、行内代码、代码块、无序/有序列表、链接、分隔线、段落
 */
function renderMarkdown(md) {
  // 先处理代码块（防止内部被其他规则干扰）
  const codeBlocks = [];
  let text = md.replace(/```([\s\S]*?)```/g, (_m, code) => {
    const i = codeBlocks.length;
    codeBlocks.push(`<pre><code>${escapeHtml(code.replace(/^\n/, ""))}</code></pre>`);
    return `\x00CB${i}\x00`;
  });

  // 行内代码
  const inlineCodes = [];
  text = text.replace(/`([^`]+)`/g, (_m, code) => {
    const i = inlineCodes.length;
    inlineCodes.push(`<code>${escapeHtml(code)}</code>`);
    return `\x00IC${i}\x00`;
  });

  // 按行处理
  const lines = text.split("\n");
  const out = [];
  let inList = false;
  let listType = "";

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // 代码块占位符
    if (/^\x00CB\d+\x00$/.test(line.trim())) {
      if (inList) { out.push(listType === "ul" ? "</ul>" : "</ol>"); inList = false; }
      out.push(line.trim().replace(/\x00CB(\d+)\x00/, (_m, idx) => codeBlocks[idx]));
      continue;
    }

    // 分隔线
    if (/^(\*{3,}|-{3,}|_{3,})\s*$/.test(line.trim())) {
      if (inList) { out.push(listType === "ul" ? "</ul>" : "</ol>"); inList = false; }
      out.push("<hr>");
      continue;
    }

    // 标题
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      if (inList) { out.push(listType === "ul" ? "</ul>" : "</ol>"); inList = false; }
      const level = headingMatch[1].length;
      out.push(`<h${level}>${inlineFormat(headingMatch[2])}</h${level}>`);
      continue;
    }

    // 无序列表
    const ulMatch = line.match(/^\s*[-*+]\s+(.+)$/);
    if (ulMatch) {
      if (!inList || listType !== "ul") {
        if (inList) out.push(listType === "ul" ? "</ul>" : "</ol>");
        out.push("<ul>");
        inList = true;
        listType = "ul";
      }
      out.push(`<li>${inlineFormat(ulMatch[1])}</li>`);
      continue;
    }

    // 有序列表
    const olMatch = line.match(/^\s*\d+\.\s+(.+)$/);
    if (olMatch) {
      if (!inList || listType !== "ol") {
        if (inList) out.push(listType === "ul" ? "</ul>" : "</ol>");
        out.push("<ol>");
        inList = true;
        listType = "ol";
      }
      out.push(`<li>${inlineFormat(olMatch[1])}</li>`);
      continue;
    }

    // 非列表行，关闭列表
    if (inList) {
      out.push(listType === "ul" ? "</ul>" : "</ol>");
      inList = false;
    }

    // 空行
    if (line.trim() === "") {
      continue;
    }

    // 普通段落
    out.push(`<p>${inlineFormat(line)}</p>`);
  }

  if (inList) out.push(listType === "ul" ? "</ul>" : "</ol>");

  let html = out.join("\n");

  // 还原占位符
  html = html.replace(/\x00CB(\d+)\x00/g, (_m, idx) => codeBlocks[idx]);
  html = html.replace(/\x00IC(\d+)\x00/g, (_m, idx) => inlineCodes[idx]);

  return html;
}

function inlineFormat(text) {
  // 粗体
  text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/__(.+?)__/g, "<strong>$1</strong>");
  // 斜体
  text = text.replace(/\*(.+?)\*/g, "<em>$1</em>");
  text = text.replace(/_(.+?)_/g, "<em>$1</em>");
  // 链接
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
  // 还原行内代码占位符（保留原样，后面统一替换）
  return text;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

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

  if (provider !== "ollama" && !config.apiKey) {
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
  } else if (provider === "ollama") {
    const baseUrl = (config.url || "http://localhost:11434").replace(/\/+$/, "");
    apiUrl = `${baseUrl}/api/chat`;
    headers = {
      "Content-Type": "application/json",
    };
    body = JSON.stringify({
      model: config.model || "qwen2.5:7b",
      messages,
      stream: false,
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

  const response = await (provider === "ollama"
    ? proxyFetch(apiUrl, { method: "POST", headers, body })
    : fetch(apiUrl, { method: "POST", headers, body }));

  if (!response.ok) {
    const errData = provider === "ollama"
      ? { error: { message: response.error } }
      : await response.json().catch(() => ({}));
    throw new Error(`API 请求失败 (${response.status || "?"}): ${errData.error?.message || response.statusText || response.error || "未知错误"}`);
  }

  const data = provider === "ollama" ? response.data : await response.json();

  // Ollama 返回格式不同
  if (provider === "ollama") {
    return data.message?.content || "未能获取总结结果";
  }
  return data.choices?.[0]?.message?.content || "未能获取总结结果";
}

function getAPIConfig(provider) {
  return new Promise((resolve) => {
    if (provider === "ollama") {
      chrome.storage.sync.get(["ollama_url", "ollama_model"], (data) => {
        resolve({
          url: data.ollama_url || "http://localhost:11434",
          model: data.ollama_model || "qwen2.5:7b",
        });
      });
    } else {
      chrome.storage.sync.get([`${provider}_api_key`, `${provider}_model`], (data) => {
        resolve({
          apiKey: data[`${provider}_api_key`] || "",
          model: data[`${provider}_model`] || "",
        });
      });
    }
  });
}

/**
 * 通过 background service worker 代理 fetch 请求
 * 先 ping 唤醒 worker，再建立长连接，解决 Ollama 长时间推理 + CORS 问题
 */
async function proxyFetch(url, options) {
  // 先 ping 唤醒 service worker
  await new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: "ping" }, () => {
      // 忽略错误，只要发出去就能唤醒 worker
      if (chrome.runtime.lastError) { /* ignore */ }
      resolve();
    });
  });

  // 尝试建立连接，失败则重试一次
  const maxRetries = 2;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await _doPortFetch(url, options);
    } catch (err) {
      if (attempt < maxRetries - 1) {
        // 等待一下再重试
        await new Promise((r) => setTimeout(r, 300));
        continue;
      }
      throw err;
    }
  }
}

function _doPortFetch(url, options) {
  return new Promise((resolve, reject) => {
    try {
      const port = chrome.runtime.connect({ name: "fetch-proxy" });
      const requestId = Date.now() + "_" + Math.random();
      let settled = false;

      const onMessage = (response) => {
        if (response.requestId !== requestId) return;
        settled = true;
        port.onMessage.removeListener(onMessage);
        try { port.disconnect(); } catch (_) {}
        resolve(response);
      };

      port.onMessage.addListener(onMessage);

      port.onDisconnect.addListener(() => {
        if (settled) return;
        const err = chrome.runtime.lastError;
        reject(new Error(err?.message || "后台连接已断开，请重试"));
      });

      port.postMessage({ url, options, requestId });
    } catch (err) {
      reject(new Error(err.message || "无法连接后台服务"));
    }
  });
}

/**
 * 唤醒 service worker
 */
function wakeServiceWorker() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: "ping" }, () => {
      if (chrome.runtime.lastError) { /* ignore */ }
      resolve();
    });
  });
}

/**
 * 发送消息并自动重试（带 ping 唤醒）
 */
async function sendMessageWithRetry(message, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = await new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(message, (response) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
            return;
          }
          resolve(response);
        });
      });
      return result;
    } catch (err) {
      if (attempt < maxRetries - 1) {
        // ping 唤醒后重试
        await wakeServiceWorker();
        await new Promise((r) => setTimeout(r, 200));
        continue;
      }
      throw err;
    }
  }
}
