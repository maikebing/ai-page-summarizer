const SETTINGS_UPDATED_AT_KEY = "app_settings_updated_at";
const GITHUBCOPILOT_FALLBACK_MODELS = [
  "openai/gpt-4.1-mini",
  "openai/gpt-4.1",
  "openai/gpt-4o-mini",
  "microsoft/phi-4-mini-instruct",
  "deepseek/deepseek-r1",
  "microsoft/phi-4",
];

function initSidepanelPage() {
  const { t } = window.AppI18n;
  const loadingEl = document.getElementById("loading");
  const resultEl = document.getElementById("result");
  const summaryContent = document.getElementById("summary-content");
  const errorEl = document.getElementById("error");
  const errorMessage = document.getElementById("error-message");
  const copyBtn = document.getElementById("copy-btn");
  const providerSelect = document.getElementById("provider");
  const summaryStyleQuickSelect = document.getElementById("summary-style-quick");
  const summarizeBtn = document.getElementById("summarize-btn");
  const toggleConfigBtn = document.getElementById("toggle-config-btn");
  const advancedControls = document.getElementById("sidepanel-advanced-controls");
  const openOptions = document.getElementById("open-options");
  const chatMessages = document.getElementById("chat-messages");
  const chatInput = document.getElementById("chat-input");
  const chatSendBtn = document.getElementById("chat-send-btn");
  const summaryTimer = document.getElementById("summary-timer");
  const providerPill = document.getElementById("sidepanel-provider-pill");
  const providerModePill = document.getElementById("sidepanel-provider-mode-pill");
  const modelPill = document.getElementById("sidepanel-model-pill");
  const LOCAL_PROVIDER_IDS = new Set(["ollama", "dockerai", "foundrylocal", "koboldcpp"]);
  const PROVIDER_MODEL_STORAGE_KEYS = {
    deepseek: "deepseek_model",
    openai: "openai_model",
    gemini: "gemini_model",
    anthropic: "anthropic_model",
    aitdee: "aitdee_model",
    githubcopilot: "githubcopilot_model",
    doubao: "doubao_model",
    ollama: "ollama_model",
    dockerai: "dockerai_model",
    foundrylocal: "foundrylocal_model",
    giteeai: "giteeai_model",
  };
  const SIDEPANEL_UI_STATE_KEY = "sidepanel_ui_state";
  let headerStatusRequestId = 0;

  // 对话历史（包含 system + 页面上下文 + 所有对话）
  let conversationHistory = [];
  // 缓存的页面内容，用于对话上下文
  let cachedPageContent = "";
  let cachedPageTitle = "";
  let cachedPageUrl = "";
  let isChatBusy = false;

  restoreSidepanelUiState();

  loadSidepanelSettings(providerSelect, summaryStyleQuickSelect, updateHeaderStatus);

  providerSelect.addEventListener("change", async () => {
    await persistSettings({ provider: providerSelect.value });
    updateHeaderStatus();
  });

  summaryStyleQuickSelect?.addEventListener("change", async () => {
    await persistSettings({ summary_style: summaryStyleQuickSelect.value || "standard" });
    updateHeaderStatus();
  });

  toggleConfigBtn?.addEventListener("click", () => {
    setAdvancedControlsExpanded(toggleConfigBtn.getAttribute("aria-expanded") !== "true");
  });

  updateHeaderStatus();

  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(summaryContent.innerText).then(() => {
      copyBtn.textContent = t("sidepanelCopySuccessButton");
      setTimeout(() => {
        copyBtn.textContent = t("sidepanelCopyButton");
      }, 2000);
    });
  });

  openOptions.addEventListener("click", (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });

  // ===== 对话输入框自动高度 =====
  chatInput.addEventListener("input", () => {
    chatInput.style.height = "auto";
    chatInput.style.height = Math.min(chatInput.scrollHeight, 100) + "px";
  });

  // Enter 发送，Shift+Enter 换行
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleChatSend();
    }
  });

  chatSendBtn.addEventListener("click", handleChatSend);

  function getSelectedOptionText(select) {
    return select?.selectedOptions?.[0]?.textContent?.trim() || select?.value || "";
  }

  function restoreSidepanelUiState() {
    chrome.storage.local.get([SIDEPANEL_UI_STATE_KEY], (data) => {
      const expanded = Boolean(data?.[SIDEPANEL_UI_STATE_KEY]?.advancedControlsExpanded);
      setAdvancedControlsExpanded(expanded, false);
    });
  }

  function persistSidepanelUiState(advancedControlsExpanded) {
    chrome.storage.local.set({
      [SIDEPANEL_UI_STATE_KEY]: {
        advancedControlsExpanded,
      },
    });
  }

  function setAdvancedControlsExpanded(expanded, persist = true) {
    if (!toggleConfigBtn || !advancedControls) {
      return;
    }

    advancedControls.classList.toggle("hidden", !expanded);
    toggleConfigBtn.setAttribute("aria-expanded", String(expanded));
    toggleConfigBtn.title = t(expanded ? "sidepanelCollapseControlsTitle" : "sidepanelExpandControlsTitle");
    toggleConfigBtn.setAttribute("aria-label", toggleConfigBtn.title);

    if (persist) {
      persistSidepanelUiState(expanded);
    }
  }

  async function getConfiguredModelName(provider) {
    const storageKey = PROVIDER_MODEL_STORAGE_KEYS[provider];
    if (!storageKey) {
      return { name: t("commonUnavailable"), available: false };
    }

    const data = await readSettings([storageKey]);
    const name = String(data?.[storageKey] || "").trim();
    return {
      name: name || t("commonUnavailable"),
      available: Boolean(name),
    };
  }

  async function updateHeaderStatus() {
    if (!providerPill || !providerModePill || !modelPill) {
      return;
    }

    const requestId = ++headerStatusRequestId;
    const currentProvider = providerSelect.value;

    providerPill.textContent = getSelectedOptionText(providerSelect);
    modelPill.textContent = t("optionsStateTesting");
    modelPill.title = t("optionsStateTesting");
    modelPill.className = "sidepanel-status-pill model pending";

    const isLocalProvider = LOCAL_PROVIDER_IDS.has(currentProvider);
    providerModePill.textContent = t(isLocalProvider ? "sidepanelProviderModeLocal" : "sidepanelProviderModeOnline");
    providerModePill.className = `sidepanel-status-pill mode ${isLocalProvider ? "local" : "online"}`;

    const modelInfo = await getConfiguredModelName(currentProvider);
    if (requestId !== headerStatusRequestId) {
      return;
    }

    modelPill.textContent = modelInfo.name;
    modelPill.title = modelInfo.name;
    modelPill.className = `sidepanel-status-pill model ${modelInfo.available ? "available" : "unavailable"}`;
  }

  // ===== 发送对话消息 =====
  async function handleChatSend() {
    const text = chatInput.value.trim();
    if (!text || isChatBusy) return;

    // 如果还没有页面上下文（没做过总结），先提取
    if (!cachedPageContent) {
      appendChatMsg("assistant", t("sidepanelPromptSummarizeFirst"));
      return;
    }

    // 显示用户消息
    appendChatMsg("user", text);
    chatInput.value = "";
    chatInput.style.height = "auto";

    // 添加到对话历史
    conversationHistory.push({ role: "user", content: text });

    // 显示加载动画
    const loadingBubble = appendChatLoading();
    isChatBusy = true;
    chatSendBtn.disabled = true;

    try {
      const provider = providerSelect.value;
      const reply = await callChatAI(provider, conversationHistory);

      // 移除加载动画
      loadingBubble.remove();

      // 添加 AI 回复
      conversationHistory.push({ role: "assistant", content: reply });
      appendChatMsg("assistant", renderMarkdown(reply));

      // 滚动到底部
      scrollChatToBottom();
    } catch (err) {
      loadingBubble.remove();
      let msg = err.message || t("sidepanelReplyFailed");
      if (providerSelect.value === "ollama" &&
          (msg.includes("Failed to fetch") || msg.includes("CORS") || msg.includes("NetworkError") || msg.includes(window.AppI18n.t("commonNetworkRequestFailed")))) {
        msg = t("sidepanelOllamaConnectShort");
      }
      appendChatMsg("assistant", `❌ ${msg}`);
      scrollChatToBottom();
    } finally {
      isChatBusy = false;
      chatSendBtn.disabled = false;
      chatInput.focus();
    }
  }

  function appendChatMsg(role, content) {
    chatMessages.classList.remove("hidden");
    const div = document.createElement("div");
    div.className = `chat-msg ${role}`;
    if (role === "assistant") {
      div.innerHTML = content;
    } else {
      div.textContent = content;
    }
    chatMessages.appendChild(div);
    scrollChatToBottom();
    return div;
  }

  function appendChatLoading() {
    chatMessages.classList.remove("hidden");
    const div = document.createElement("div");
    div.className = "chat-msg assistant chat-msg-loading";
    div.innerHTML = "<span></span><span></span><span></span>";
    chatMessages.appendChild(div);
    scrollChatToBottom();
    return div;
  }

  function scrollChatToBottom() {
    requestAnimationFrame(() => {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    });
  }

  // ===== 总结当前页面 =====
  async function doSummarize() {
    loadingEl.classList.remove("hidden");
    resultEl.classList.add("hidden");
    errorEl.classList.add("hidden");
    chatMessages.classList.add("hidden");
    chatMessages.innerHTML = "";
    conversationHistory = [];
    summarizeBtn.disabled = true;
    summaryTimer.textContent = "";

    try {
      // 先 ping 唤醒 service worker
      await wakeServiceWorker();

      // 通过 background service worker 获取当前标签页
      const tabResult = await sendMessageWithRetry({ type: "get-active-tab" });
      const tab = tabResult?.tab;
      if (!tab?.id || !tab?.url) {
        throw new Error(t("sidepanelCannotGetPageInfo"));
      }
      if (/^(edge|chrome|about|extension):\/\//i.test(tab.url)) {
        throw new Error(t("sidepanelRestrictedPageCannotRead"));
      }
      const [{ result: pageContent }] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: extractPageContent,
      });
      if (!pageContent || pageContent.trim().length === 0) {
        throw new Error(t("sidepanelCannotExtractContent"));
      }
      const maxLength = 15000;
      const truncated =
        pageContent.length > maxLength
          ? pageContent.substring(0, maxLength) + `\n\n${t("sidepanelContentTruncated")}`
          : pageContent;
      cachedPageContent = truncated;
      cachedPageTitle = tab.title || "";
      cachedPageUrl = tab.url || "";
      // 统计耗时
      const start = Date.now();
      const summary = await callAI(providerSelect.value, truncated, cachedPageTitle, cachedPageUrl);
      const end = Date.now();
      summaryContent.innerHTML = renderMarkdown(summary);
      resultEl.classList.remove("hidden");
      summaryTimer.textContent = t("sidepanelSummaryDuration", ((end - start) / 1000).toFixed(3));
      // 初始化对话历史，包含页面上下文和总结
      conversationHistory = [
        {
          role: "system",
            content: t("sidepanelFollowupPageSystemPrompt", [cachedPageTitle || t("commonUnavailable"), cachedPageUrl || t("commonUnavailable"), cachedPageContent])
        },
        { role: "assistant", content: summary },
      ];
    } catch (err) {
      let msg = err.message || t("sidepanelSummaryFailed");
      if (providerSelect.value === "ollama" &&
          (msg.includes("Failed to fetch") || msg.includes("CORS") || msg.includes("NetworkError") || msg.includes(window.AppI18n.t("commonNetworkRequestFailed")))) {
        msg = t("sidepanelOllamaConnectLong");
      }
      errorMessage.textContent = msg;
      errorEl.classList.remove("hidden");
      summaryTimer.textContent = "";
    } finally {
      loadingEl.classList.add("hidden");
      summarizeBtn.disabled = false;
    }
  }

  // 点击按钮重新总结
  summarizeBtn.addEventListener("click", doSummarize);

  // 检查是否有右键选中内容
  chrome.storage.local.get(["sidepanel_selection"], async (data) => {
    if (data.sidepanel_selection && data.sidepanel_selection.text) {
      // 只总结选中内容，不再自动提取页面内容
      loadingEl.classList.remove("hidden");
      resultEl.classList.add("hidden");
      errorEl.classList.add("hidden");
      chatMessages.classList.add("hidden");
      chatMessages.innerHTML = "";
      conversationHistory = [];
      summarizeBtn.disabled = true;
      summaryTimer.textContent = "";
      try {
        await wakeServiceWorker();
        const selection = data.sidepanel_selection;
        cachedPageContent = selection.text;
        cachedPageTitle = selection.pageTitle || "";
        cachedPageUrl = selection.pageUrl || "";
        const start = Date.now();
        const summary = await callAI(providerSelect.value, cachedPageContent, "", "");
        const end = Date.now();
        summaryContent.innerHTML = renderMarkdown(summary);
        resultEl.classList.remove("hidden");
        summaryTimer.textContent = t("sidepanelSummaryDuration", ((end - start) / 1000).toFixed(3));
        conversationHistory = [
          {
            role: "system",
              content: t("sidepanelFollowupSelectionSystemPrompt", [cachedPageTitle || t("commonUnavailable"), cachedPageUrl || t("commonUnavailable"), cachedPageContent])
          },
          { role: "assistant", content: summary },
        ];
        chrome.storage.local.remove("sidepanel_selection");
      } catch (err) {
        let msg = err.message || t("sidepanelSummaryFailed");
        errorMessage.textContent = msg;
        errorEl.classList.remove("hidden");
        summaryTimer.textContent = "";
      } finally {
        loadingEl.classList.add("hidden");
        summarizeBtn.disabled = false;
      }
    } else {
      // 没有选中内容时，才自动提取页面内容
      doSummarize();
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSidepanelPage, { once: true });
} else {
  initSidepanelPage();
}

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
  const { t } = window.AppI18n;
  const config = await getAPIConfig(provider);
  if (!isLocalProvider(provider) && !config.apiKey) {
    throw new Error(t("sidepanelApiKeyMissing", getProviderLabel(provider)));
  }
  const summaryStyle = await getSummaryStyle();
  const prompt = t("sidepanelSummaryModeUserPrompt", [
    pageTitle || t("commonUnavailable"),
    pageUrl || t("commonUnavailable"),
    content,
    getSummaryStyleInstruction(summaryStyle),
  ]);
  const messages = [
    { role: "system", content: t("sidepanelSummaryModeSystemPrompt") },
    { role: "user", content: prompt },
  ];
  return await executeProviderRequest(provider, config, messages, 0.3, "sidepanelNoSummaryResult");
}

/**
 * 对话模式：发送完整对话历史给 AI
 */
async function callChatAI(provider, messages) {
  const config = await getAPIConfig(provider);
  if (!isLocalProvider(provider) && !config.apiKey) {
    throw new Error(t("sidepanelApiKeyMissing", getProviderLabel(provider)));
  }
  return await executeProviderRequest(provider, config, messages, 0.5, "sidepanelNoReplyResult");
}

function getSummaryStyle() {
  return readSettings(["summary_style"]).then((data) => data.summary_style || "standard");
}

function getSummaryStyleInstruction(style) {
  const { t } = window.AppI18n;

  switch (style) {
    case "compact":
      return t("sidepanelSummaryStyleCompact");
    case "detailed":
      return t("sidepanelSummaryStyleDetailed");
    case "standard":
    default:
      return t("sidepanelSummaryStyleStandard");
  }
}

function isLocalProvider(provider) {
  return provider === "ollama" || provider === "dockerai" || provider === "foundrylocal" || provider === "koboldcpp";
}

async function executeProviderRequest(provider, config, messages, temperature, emptyMessageKey) {
  const { t } = window.AppI18n;
  const request = buildProviderRequest(provider, config, messages, temperature);

  let response = await backgroundFetch(request.apiUrl, {
    method: "POST",
    headers: request.headers,
    body: request.body,
  });

  if (!response.ok && provider === "githubcopilot" && isGitHubCopilotRetryableModelError(response)) {
    const fallbackResult = await retryGitHubCopilotWithFallback(config, messages, temperature);
    if (fallbackResult) {
      if (fallbackResult.model !== String(config.model || "").trim()) {
        await persistSettings({ githubcopilot_model: fallbackResult.model });
      }

      response = fallbackResult.response;
    }
  }

  if (!response.ok) {
    const errorMessage = provider === "githubcopilot" && isGitHubCopilotRetryableModelError(response)
      ? t("githubModelsNoAccessModel", [String(config.model || "openai/gpt-4.1-mini"), GITHUBCOPILOT_FALLBACK_MODELS[0]])
      : getProviderErrorMessage(provider, response.data || { error: { message: response.error } }, response.error);
    if (!response.status) {
      throw new Error(errorMessage || t("commonNetworkRequestFailed"));
    }

    throw new Error(t("sidepanelApiRequestFailed", [response.status, errorMessage]));
  }

  return extractProviderText(provider, response.data, emptyMessageKey);
}

async function retryGitHubCopilotWithFallback(config, messages, temperature) {
  const currentModel = String(config.model || "").trim();
  const fallbackModels = GITHUBCOPILOT_FALLBACK_MODELS.filter((model) => model !== currentModel);

  for (const model of fallbackModels) {
    const fallbackRequest = buildProviderRequest("githubcopilot", { ...config, model }, messages, temperature);
    const fallbackResponse = await backgroundFetch(fallbackRequest.apiUrl, {
      method: "POST",
      headers: fallbackRequest.headers,
      body: fallbackRequest.body,
    });

    if (fallbackResponse.ok) {
      return {
        model,
        response: fallbackResponse,
      };
    }

    if (!isGitHubCopilotRetryableModelError(fallbackResponse)) {
      return null;
    }
  }

  return null;
}

function isGitHubCopilotRetryableModelError(response) {
  const message = String(response?.error || response?.data?.error?.message || "").toLowerCase();
  if (response?.status === 403 && /no access to model/.test(message)) {
    return true;
  }

  if (response?.status === 404) {
    return true;
  }

  return /model not found|unknown model|invalid model/i.test(message);
}

function buildProviderRequest(provider, config, messages, temperature) {
  if (provider === "deepseek") {
    return {
      apiUrl: "https://api.deepseek.com/chat/completions",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model || "deepseek-chat",
        messages,
        max_tokens: 2000,
        temperature,
      }),
    };
  }

  if (provider === "openai") {
    return {
      apiUrl: "https://api.openai.com/v1/chat/completions",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model || "gpt-4.1-mini",
        messages,
        max_tokens: 2000,
        temperature,
      }),
    };
  }

  if (provider === "gemini") {
    const { systemInstruction, contents } = convertMessagesForGemini(messages);
    return {
      apiUrl: `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(config.model || "gemini-2.0-flash")}:generateContent?key=${encodeURIComponent(config.apiKey)}`,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...(systemInstruction ? { systemInstruction } : {}),
        contents,
        generationConfig: {
          temperature,
          maxOutputTokens: 2048,
        },
      }),
    };
  }

  if (provider === "anthropic") {
    const { system, messages: anthropicMessages } = convertMessagesForAnthropic(messages);
    return {
      apiUrl: "https://api.anthropic.com/v1/messages",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": config.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: config.model || "claude-3-5-sonnet-latest",
        system,
        messages: anthropicMessages,
        max_tokens: 2000,
        temperature,
      }),
    };
  }

  if (provider === "aitdee") {
    const baseUrl = (config.url || "https://ai.td.ee").replace(/\/+$/, "");
    return {
      apiUrl: `${baseUrl}/v1/chat/completions`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model || "gpt-4.1-mini",
        messages,
        max_tokens: 2000,
        temperature,
      }),
    };
  }

  if (provider === "ollama") {
    const baseUrl = (config.url || "http://localhost:11434").replace(/\/+$/, "");
    return {
      apiUrl: `${baseUrl}/api/chat`,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: config.model || "qwen2.5:7b",
        messages,
        stream: false,
      }),
    };
  }

  if (provider === "dockerai") {
    const baseUrl = (config.url || "http://localhost:8080").replace(/\/+$/, "");
    return {
      apiUrl: `${baseUrl}/v1/chat/completions`,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: config.model || "qwen2.5-7b",
        messages,
        max_tokens: 2000,
        temperature,
      }),
    };
  }

  if (provider === "foundrylocal") {
    const baseUrl = (config.url || "http://127.0.0.1:55928/").replace(/\/+$/, "");
    return {
      apiUrl: `${baseUrl}/v1/chat/completions`,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: config.model || "",
        messages,
        max_tokens: 2000,
        temperature,
      }),
    };
  }

  if (provider === "koboldcpp") {
    const baseUrl = (config.url || "http://localhost:5001").replace(/\/+$/, "");
    return {
      apiUrl: `${baseUrl}/v1/chat/completions`,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: config.model || "llama.cpp",
        messages,
        max_tokens: 2000,
        temperature,
      }),
    };
  }

  if (provider === "giteeai") {
    return {
      apiUrl: "https://ai.gitee.com/v1/chat/completions",
      headers: {
        "Content-Type": "application/json",
        "X-Failover-Enabled": "true",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model || "Qwen3-8B",
        messages,
        stream: false,
        max_tokens: 1024,
        temperature: Math.max(temperature, 0.5),
        top_p: 0.7,
        top_k: 50,
        frequency_penalty: 1,
      }),
    };
  }

  if (provider === "githubcopilot") {
    return {
      apiUrl: "https://models.github.ai/inference/chat/completions",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model || "openai/gpt-4.1-mini",
        messages,
        max_tokens: 2000,
        temperature,
      }),
    };
  }

  return {
    apiUrl: "https://ark.cn-beijing.volces.com/api/v3/chat/completions",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model || "doubao-pro-256k",
      messages,
      max_tokens: 2000,
      temperature,
    }),
  };
}

function extractProviderText(provider, data, emptyMessageKey) {
  const { t } = window.AppI18n;

  if (provider === "ollama") {
    return data.message?.content || t(emptyMessageKey);
  }

  if (provider === "gemini") {
    return data.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("") || t(emptyMessageKey);
  }

  if (provider === "anthropic") {
    return data.content?.map((part) => part.text || "").join("") || t(emptyMessageKey);
  }

  return data.choices?.[0]?.message?.content || t(emptyMessageKey);
}

function getProviderErrorMessage(provider, data, statusText) {
  if (provider === "anthropic") {
    return data.error?.message || data.message || statusText || window.AppI18n.t("commonUnknownError");
  }

  if (provider === "gemini") {
    return data.error?.message || statusText || window.AppI18n.t("commonUnknownError");
  }

  return data.error?.message || statusText || window.AppI18n.t("commonUnknownError");
}

function convertMessagesForGemini(messages) {
  const systemMessages = [];
  const contents = [];

  messages.forEach((message) => {
    if (message.role === "system") {
      systemMessages.push(message.content);
      return;
    }

    contents.push({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    });
  });

  while (contents[0]?.role === "model") {
    const firstModelMessage = contents.shift();
    const modelText = firstModelMessage?.parts?.map((part) => part.text || "").join("") || "";
    if (modelText) {
      systemMessages.push(modelText);
    }
  }

  return {
    systemInstruction: systemMessages.length
      ? { parts: [{ text: systemMessages.join("\n\n") }] }
      : undefined,
    contents,
  };
}

function convertMessagesForAnthropic(messages) {
  const systemParts = messages
    .filter((message) => message.role === "system")
    .map((message) => message.content);

  const nonSystemMessages = messages
    .filter((message) => message.role !== "system")
    .map((message) => ({
      role: message.role === "assistant" ? "assistant" : "user",
      content: message.content,
    }));

  while (nonSystemMessages[0]?.role === "assistant") {
    const firstAssistant = nonSystemMessages.shift();
    if (firstAssistant?.content) {
      systemParts.push(firstAssistant.content);
    }
  }

  return {
    system: systemParts.join("\n\n"),
    messages: nonSystemMessages,
  };
}

function getProviderLabel(provider) {
  const { t } = window.AppI18n;

  switch (provider) {
    case "deepseek":
      return t("providerDeepSeek");
    case "openai":
      return t("providerOpenAI");
    case "gemini":
      return t("providerGemini");
    case "anthropic":
      return t("providerAnthropic");
    case "aitdee":
      return t("providerAiTdEe");
    case "githubcopilot":
      return t("providerGitHubCopilot");
    case "doubao":
      return t("providerDoubao");
    case "ollama":
      return t("providerOllamaLocal");
    case "dockerai":
      return t("providerDockerAI");
    case "foundrylocal":
      return t("providerFoundryLocal");
    case "koboldcpp":
      return t("providerKoboldCppLocal");
    case "giteeai":
      return t("providerGiteeAI");
    default:
      return provider;
  }
}

function getAPIConfig(provider) {
  if (provider === "ollama") {
    return readSettings(["ollama_url", "ollama_model"]).then((data) => ({
      url: data.ollama_url || "http://localhost:11434",
      model: data.ollama_model || "qwen2.5:7b",
    }));
  }

  if (provider === "dockerai") {
    return readSettings(["dockerai_url", "dockerai_model"]).then((data) => ({
      url: data.dockerai_url || "http://localhost:8080",
      model: data.dockerai_model || "qwen2.5-7b",
    }));
  }

  if (provider === "foundrylocal") {
    return readSettings(["foundrylocal_url", "foundrylocal_model"]).then((data) => ({
      url: data.foundrylocal_url || "http://127.0.0.1:55928/",
      model: data.foundrylocal_model || "",
    }));
  }

  if (provider === "openai") {
    return readSettings(["openai_api_key", "openai_model"]).then((data) => ({
      apiKey: data.openai_api_key || "",
      model: data.openai_model || "gpt-4.1-mini",
    }));
  }

  if (provider === "gemini") {
    return readSettings(["gemini_api_key", "gemini_model"]).then((data) => ({
      apiKey: data.gemini_api_key || "",
      model: data.gemini_model || "gemini-2.0-flash",
    }));
  }

  if (provider === "anthropic") {
    return readSettings(["anthropic_api_key", "anthropic_model"]).then((data) => ({
      apiKey: data.anthropic_api_key || "",
      model: data.anthropic_model || "claude-3-5-sonnet-latest",
    }));
  }

  if (provider === "aitdee") {
    return readSettings(["aitdee_api_key", "aitdee_url", "aitdee_model"]).then((data) => ({
      apiKey: data.aitdee_api_key || "",
      url: data.aitdee_url || "https://ai.td.ee",
      model: data.aitdee_model || "gpt-4.1-mini",
    }));
  }

  if (provider === "giteeai") {
    return readSettings(["giteeai_api_key", "giteeai_model"]).then((data) => ({
      apiKey: data.giteeai_api_key || "",
      model: data.giteeai_model || "Qwen3-8B",
    }));
  }

  if (provider === "githubcopilot") {
    return readSettings(["githubcopilot_api_key", "githubcopilot_model"]).then((data) => ({
      apiKey: data.githubcopilot_api_key || "",
      model: data.githubcopilot_model || "openai/gpt-4.1-mini",
    }));
  }

  return readSettings([`${provider}_api_key`, `${provider}_model`]).then((data) => ({
    apiKey: data[`${provider}_api_key`] || "",
    model: data[`${provider}_model`] || "",
  }));
}

async function loadSidepanelSettings(providerSelect, summaryStyleQuickSelect, updateHeaderStatus) {
  const data = await readSettings(["provider", "summary_style"]);
  if (data.provider) {
    providerSelect.value = data.provider;
  }

  if (summaryStyleQuickSelect) {
    summaryStyleQuickSelect.value = data.summary_style || "standard";
  }

  updateHeaderStatus();
}

async function persistSettings(values) {
  const payload = {
    ...values,
    [SETTINGS_UPDATED_AT_KEY]: Date.now(),
  };
  const [localResult, syncResult] = await Promise.all([
    setStorageArea(chrome.storage.local, payload),
    setStorageArea(chrome.storage.sync, payload),
  ]);

  if (!localResult.ok && !syncResult.ok) {
    console.warn("Failed to persist sidepanel settings:", localResult.error || syncResult.error);
  } else if (!syncResult.ok) {
    console.warn("Failed to sync sidepanel settings, fell back to local storage:", syncResult.error);
  }
}

async function readSettings(keys) {
  const requestKeys = Array.from(new Set([...keys, SETTINGS_UPDATED_AT_KEY]));
  const [syncResult, localResult] = await Promise.all([
    getStorageArea(chrome.storage.sync, requestKeys),
    getStorageArea(chrome.storage.local, requestKeys),
  ]);

  const syncData = syncResult.data || {};
  const localData = localResult.data || {};
  const syncTimestamp = Number(syncData[SETTINGS_UPDATED_AT_KEY] || 0);
  const localTimestamp = Number(localData[SETTINGS_UPDATED_AT_KEY] || 0);
  const preferred = localTimestamp > syncTimestamp ? localData : syncData;
  const fallback = localTimestamp > syncTimestamp ? syncData : localData;

  return keys.reduce((result, key) => {
    if (preferred[key] !== undefined) {
      result[key] = preferred[key];
    } else if (fallback[key] !== undefined) {
      result[key] = fallback[key];
    }
    return result;
  }, {});
}

function getStorageArea(area, keys) {
  return new Promise((resolve) => {
    area.get(keys, (data) => {
      resolve({
        data: data || {},
        error: chrome.runtime.lastError?.message || "",
      });
    });
  });
}

function setStorageArea(area, values) {
  return new Promise((resolve) => {
    area.set(values, () => {
      resolve({
        ok: !chrome.runtime.lastError,
        error: chrome.runtime.lastError?.message || "",
      });
    });
  });
}

/**
 * 通过 background service worker 代理 fetch 请求
 * 先 ping 唤醒 worker，再建立长连接，解决 Ollama 长时间推理 + CORS 问题
 */
async function backgroundFetch(url, options) {
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
      const port = chrome.runtime.connect({ name: "background-fetch" });
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
        reject(new Error(err?.message || window.AppI18n.t("sidepanelBackgroundDisconnected")));
      });

      port.postMessage({ url, options, requestId });
    } catch (err) {
      reject(new Error(err.message || window.AppI18n.t("sidepanelCannotConnectBackground")));
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
