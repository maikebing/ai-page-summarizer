function initOptionsPage() {
  const { t } = window.AppI18n;
  const deepseekKey = document.getElementById("deepseek-key");
  const deepseekModel = document.getElementById("deepseek-model");
  const openaiKey = document.getElementById("openai-key");
  const openaiModel = document.getElementById("openai-model");
  const openaiRefreshModelsBtn = document.getElementById("openai-refresh-models-btn");
  const geminiKey = document.getElementById("gemini-key");
  const geminiModel = document.getElementById("gemini-model");
  const geminiRefreshModelsBtn = document.getElementById("gemini-refresh-models-btn");
  const anthropicKey = document.getElementById("anthropic-key");
  const anthropicModel = document.getElementById("anthropic-model");
  const anthropicRefreshModelsBtn = document.getElementById("anthropic-refresh-models-btn");
  const aitdeeKey = document.getElementById("aitdee-key");
  const aitdeeUrlSelect = document.getElementById("aitdee-url-select");
  const aitdeeUrl = document.getElementById("aitdee-url");
  const aitdeeModel = document.getElementById("aitdee-model");
  const aitdeeRefreshModelsBtn = document.getElementById("aitdee-refresh-models-btn");
  const doubaoKey = document.getElementById("doubao-key");
  const doubaoModel = document.getElementById("doubao-model");
  const doubaoRefreshModelsBtn = document.getElementById("doubao-refresh-models-btn");
  const ollamaUrl = document.getElementById("ollama-url");
  const ollamaModel = document.getElementById("ollama-model");
  const ollamaRefreshBtn = document.getElementById("ollama-refresh-btn");
  const ollamaTestBtn = document.getElementById("ollama-test-btn");
  const ollamaStatusEl = document.getElementById("ollama-status");
  const dockeraiUrl = document.getElementById("dockerai-url");
  const dockeraiModel = document.getElementById("dockerai-model");
  const dockeraiRefreshBtn = document.getElementById("dockerai-refresh-btn");
  const dockeraiTestBtn = document.getElementById("dockerai-test-btn");
  const dockeraiStatusEl = document.getElementById("dockerai-status");
  const foundrylocalUrl = document.getElementById("foundrylocal-url");
  const foundrylocalModel = document.getElementById("foundrylocal-model");
  const foundrylocalRefreshBtn = document.getElementById("foundrylocal-refresh-btn");
  const foundrylocalTestBtn = document.getElementById("foundrylocal-test-btn");
  const foundrylocalStatusEl = document.getElementById("foundrylocal-status");
  const koboldcppUrl = document.getElementById("koboldcpp-url");
  const koboldcppStatusEl = document.getElementById("koboldcpp-status");
  const koboldcppCurrentModel = document.getElementById("koboldcpp-current-model");
  const koboldcppVersion = document.getElementById("koboldcpp-version");
  const koboldcppRefreshBtn = document.getElementById("koboldcpp-refresh-btn");
  const koboldcppTestBtn = document.getElementById("koboldcpp-test-btn");
  const giteeaiKey = document.getElementById("giteeai-key");
  const giteeaiModel = document.getElementById("giteeai-model");
  const giteeaiRefreshModelsBtn = document.getElementById("giteeai-refresh-models-btn");
  const githubcopilotKey = document.getElementById("githubcopilot-key");
  const githubcopilotModel = document.getElementById("githubcopilot-model");
  const githubcopilotRefreshModelsBtn = document.getElementById("githubcopilot-refresh-models-btn");
  const deepseekStatusEl = document.getElementById("deepseek-status");
  const openaiStatusEl = document.getElementById("openai-status");
  const geminiStatusEl = document.getElementById("gemini-status");
  const anthropicStatusEl = document.getElementById("anthropic-status");
  const aitdeeStatusEl = document.getElementById("aitdee-status");
  const giteeaiStatusEl = document.getElementById("giteeai-status");
  const githubcopilotStatusEl = document.getElementById("githubcopilot-status");
  const doubaoStatusEl = document.getElementById("doubao-status");
  const deepseekTestBtn = document.getElementById("deepseek-test-btn");
  const openaiTestBtn = document.getElementById("openai-test-btn");
  const geminiTestBtn = document.getElementById("gemini-test-btn");
  const anthropicTestBtn = document.getElementById("anthropic-test-btn");
  const aitdeeTestBtn = document.getElementById("aitdee-test-btn");
  const giteeaiTestBtn = document.getElementById("giteeai-test-btn");
  const githubcopilotTestBtn = document.getElementById("githubcopilot-test-btn");
  const doubaoTestBtn = document.getElementById("doubao-test-btn");
  const saveBtn = document.getElementById("save-btn");
  const status = document.getElementById("status");
  const pageSaveActions = document.getElementById("page-save-actions");
  const pageSaveActionsPark = document.getElementById("page-save-actions-park");
  const saveActionSlots = {
    local: document.querySelector('[data-save-actions-slot="local"]'),
    online: document.querySelector('[data-save-actions-slot="online"]'),
    "summary-style": document.querySelector('[data-save-actions-slot="summary-style"]'),
  };
  const providerSearchInput = document.getElementById("provider-search");
  const clearSearchBtn = document.getElementById("clear-search-btn");
  const emptyState = document.getElementById("empty-state");
  const toolbar = document.querySelector(".toolbar");
  const summaryStylePanel = document.getElementById("summary-style-panel");
  const summaryStyleSelect = document.getElementById("summary-style");
  const summaryStyleOptions = Array.from(document.querySelectorAll("[data-summary-style-option]"));
  const networkDiagnosticsBtn = document.getElementById("network-diagnostics-btn");
  const networkDiagnosticsPanel = document.getElementById("network-diagnostics-panel");
  const networkDiagnosticsSummary = document.getElementById("network-diagnostics-summary");
  const networkDiagnosticsResults = document.getElementById("network-diagnostics-results");
  const aboutPanel = document.getElementById("about-panel");
  const aboutVersion = document.getElementById("about-version");
  const tabButtons = Array.from(document.querySelectorAll("[data-tab]"));
  const groupSections = Array.from(document.querySelectorAll("[data-group]"));
  const providerCards = Array.from(document.querySelectorAll("[data-provider-id]"));
  const providerStateEls = {
    deepseek: document.getElementById("provider-state-deepseek"),
    openai: document.getElementById("provider-state-openai"),
    gemini: document.getElementById("provider-state-gemini"),
    anthropic: document.getElementById("provider-state-anthropic"),
    aitdee: document.getElementById("provider-state-aitdee"),
    doubao: document.getElementById("provider-state-doubao"),
    ollama: document.getElementById("provider-state-ollama"),
    dockerai: document.getElementById("provider-state-dockerai"),
    foundrylocal: document.getElementById("provider-state-foundrylocal"),
    koboldcpp: document.getElementById("provider-state-koboldcpp"),
    giteeai: document.getElementById("provider-state-giteeai"),
    githubcopilot: document.getElementById("provider-state-githubcopilot"),
  };
  const providerStatusEls = {
    deepseek: deepseekStatusEl,
    openai: openaiStatusEl,
    gemini: geminiStatusEl,
    anthropic: anthropicStatusEl,
    aitdee: aitdeeStatusEl,
    doubao: doubaoStatusEl,
    ollama: ollamaStatusEl,
    dockerai: dockeraiStatusEl,
    foundrylocal: foundrylocalStatusEl,
    koboldcpp: koboldcppStatusEl,
    giteeai: giteeaiStatusEl,
    githubcopilot: githubcopilotStatusEl,
  };
  const GITHUBCOPILOT_RECOMMENDED_MODELS = [
    "openai/gpt-4.1-mini",
    "openai/gpt-4.1",
    "openai/gpt-4o-mini",
    "microsoft/phi-4-mini-instruct",
    "deepseek/deepseek-r1",
  ];
  const GITHUBCOPILOT_FALLBACK_MODELS = mergeModelLists(GITHUBCOPILOT_RECOMMENDED_MODELS, [
    "microsoft/phi-4",
  ]);
  const providerTestBtns = {
    deepseek: deepseekTestBtn,
    openai: openaiTestBtn,
    gemini: geminiTestBtn,
    anthropic: anthropicTestBtn,
    aitdee: aitdeeTestBtn,
    doubao: doubaoTestBtn,
    ollama: ollamaTestBtn,
    dockerai: dockeraiTestBtn,
    foundrylocal: foundrylocalTestBtn,
    koboldcpp: koboldcppTestBtn,
    giteeai: giteeaiTestBtn,
    githubcopilot: githubcopilotTestBtn,
  };
  const REMOTE_MODEL_PRESETS = {
    openai: ["gpt-4.1-mini", "gpt-4.1", "gpt-4o-mini", "gpt-4o", "gpt-5-mini"],
    gemini: ["gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-1.5-pro", "gemini-1.5-flash"],
    anthropic: ["claude-3-5-sonnet-latest", "claude-3-7-sonnet-latest", "claude-3-5-haiku-latest", "claude-3-opus-latest"],
    aitdee: ["gpt-4.1-mini", "gpt-4o-mini", "gemini-2.0-flash", "deepseek-chat", "claude-3-5-sonnet-latest"],
    deepseek: ["deepseek-chat", "deepseek-reasoner"],
    giteeai: ["Qwen3-8B", "Qwen2.5-72B-Instruct", "DeepSeek-R1-Distill-Qwen-7B", "glm-4-9b-chat"],
    githubcopilot: GITHUBCOPILOT_RECOMMENDED_MODELS,
    doubao: ["doubao-pro-256k", "doubao-1-5-pro-32k", "doubao-1-5-lite-32k", "doubao-seed-1-6-thinking"],
  };
  const MODEL_LIST_CONFIG = {
    openai: {
      input: openaiModel,
      button: openaiRefreshModelsBtn,
      getApiKey: () => openaiKey.value.trim(),
      fetcher: fetchOpenAIModelList,
    },
    gemini: {
      input: geminiModel,
      button: geminiRefreshModelsBtn,
      getApiKey: () => geminiKey.value.trim(),
      fetcher: fetchGeminiModelList,
    },
    anthropic: {
      input: anthropicModel,
      button: anthropicRefreshModelsBtn,
      getApiKey: () => anthropicKey.value.trim(),
      fetcher: fetchAnthropicModelList,
    },
    aitdee: {
      input: aitdeeModel,
      button: aitdeeRefreshModelsBtn,
      getApiKey: () => aitdeeKey.value.trim(),
      fetcher: () => fetchAiTdEeModelList(aitdeeKey.value.trim(), getAiTdEeBaseUrl()),
    },
    giteeai: {
      input: giteeaiModel,
      button: giteeaiRefreshModelsBtn,
      getApiKey: () => giteeaiKey.value.trim(),
      fetcher: fetchGiteeAIModelList,
    },
    githubcopilot: {
      input: githubcopilotModel,
      button: githubcopilotRefreshModelsBtn,
      getApiKey: () => githubcopilotKey.value.trim(),
      fetcher: (apiKey, options = {}) => fetchGitHubCopilotModelList(apiKey, options.currentModel, !options.silent),
    },
    doubao: {
      input: doubaoModel,
      button: doubaoRefreshModelsBtn,
      getApiKey: () => doubaoKey.value.trim(),
      fetcher: null,
    },
  };
  const UI_STATE_KEY = "options_ui_state";
  const SETTINGS_UPDATED_AT_KEY = "app_settings_updated_at";
  const defaultUiState = {
    activeTab: "local",
    search: "",
    providerOpen: {},
  };
  let uiState = cloneUiState(defaultUiState);
  const diagnosticCardMap = new Map();

  initializeTabs();
  initializeProviderCards();
  initializeSearch();
  initializeSummaryStyleCards();
  initializeModelPresets();
  initializeModelRefreshButtons();
  initializeProviderIndicators();
  initializeTestButtons();
  initializeNetworkDiagnostics();
  initializeAboutPanel();
  restoreUiState();

  void loadSavedSettings().catch((error) => {
    console.error("Failed to load saved settings:", error);
    showSaveStatus(false, error?.message || t("commonUnknownError"));
  });

  // Ollama 刷新按钮
  ollamaRefreshBtn.addEventListener("click", () => {
    fetchOllamaModels(ollamaModel.value);
  });

  // DockerAI 刷新按钮
  dockeraiRefreshBtn.addEventListener("click", () => {
    fetchDockeraiModels(dockeraiModel.value);
  });

  foundrylocalRefreshBtn.addEventListener("click", () => {
    fetchFoundryLocalModels(foundrylocalModel.value);
  });

  aitdeeUrlSelect?.addEventListener("change", () => {
    if (aitdeeUrlSelect.value !== "__custom__") {
      aitdeeUrl.value = aitdeeUrlSelect.value;
    }
    refreshProviderIndicators();
  });

  aitdeeUrl?.addEventListener("input", () => {
    const normalized = normalizeBaseUrl(aitdeeUrl.value, "https://ai.td.ee");
    const presetValues = ["https://ai.td.ee", "https://shop.pincc.ai"];
    aitdeeUrlSelect.value = presetValues.includes(normalized) ? normalized : "__custom__";
    refreshProviderIndicators();
  });

  koboldcppRefreshBtn.addEventListener("click", () => {
    fetchKoboldcppInfo();
  });

  saveBtn.addEventListener("click", async () => {
    await saveSettings();
  });

  async function saveSettings(callback) {
    saveBtn.disabled = true;

    try {
      const payload = {
        deepseek_api_key: deepseekKey.value.trim(),
        deepseek_model: deepseekModel.value.trim(),
        openai_api_key: openaiKey.value.trim(),
        openai_model: openaiModel.value.trim(),
        gemini_api_key: geminiKey.value.trim(),
        gemini_model: geminiModel.value.trim(),
        anthropic_api_key: anthropicKey.value.trim(),
        anthropic_model: anthropicModel.value.trim(),
        aitdee_api_key: aitdeeKey.value.trim(),
        aitdee_url: getAiTdEeBaseUrl(),
        aitdee_model: aitdeeModel.value.trim(),
        doubao_api_key: doubaoKey.value.trim(),
        doubao_model: doubaoModel.value.trim(),
        ollama_url: ollamaUrl.value.trim(),
        ollama_model: ollamaModel.value,
        dockerai_url: dockeraiUrl.value.trim(),
        dockerai_model: dockeraiModel.value,
        foundrylocal_url: foundrylocalUrl.value.trim(),
        foundrylocal_model: foundrylocalModel.value,
        koboldcpp_url: koboldcppUrl.value.trim(),
        giteeai_api_key: giteeaiKey.value.trim(),
        giteeai_model: giteeaiModel.value.trim(),
        githubcopilot_api_key: githubcopilotKey.value.trim(),
        githubcopilot_model: githubcopilotModel.value.trim(),
        summary_style: summaryStyleSelect.value || "standard",
      };

      await persistSettings(payload);
      showSaveStatus(true);
      refreshProviderIndicators();
      callback?.();
    } catch (error) {
      console.error("Failed to save settings:", error);
      showSaveStatus(false, error?.message || t("commonUnknownError"));
    } finally {
      saveBtn.disabled = false;
    }
  }

  async function loadSavedSettings() {
    const data = await readSettings(
      [
        "deepseek_api_key", "deepseek_model",
        "openai_api_key", "openai_model",
        "gemini_api_key", "gemini_model",
        "anthropic_api_key", "anthropic_model",
        "aitdee_api_key", "aitdee_url", "aitdee_model",
        "doubao_api_key", "doubao_model",
        "ollama_url", "ollama_model",
        "dockerai_url", "dockerai_model",
        "foundrylocal_url", "foundrylocal_model",
        "koboldcpp_url",
        "giteeai_api_key", "giteeai_model",
        "githubcopilot_api_key", "githubcopilot_model",
        "summary_style",
      ]
    );

    const savedOpenAIModel = data.openai_model || "gpt-4.1-mini";
    const savedGeminiModel = data.gemini_model || "gemini-2.0-flash";
    const savedAnthropicModel = data.anthropic_model || "claude-3-5-sonnet-latest";
    const savedAiTdEeModel = data.aitdee_model || "gpt-4.1-mini";
    const savedAiTdEeUrl = data.aitdee_url || "https://ai.td.ee";
    const savedDoubaoModel = data.doubao_model || "doubao-pro-256k";
    const savedGiteeAIModel = data.giteeai_model || "Qwen3-8B";
    const savedGitHubCopilotModel = data.githubcopilot_model || "openai/gpt-4.1-mini";

    deepseekKey.value = data.deepseek_api_key || "";
    deepseekModel.value = data.deepseek_model || "deepseek-chat";
    openaiKey.value = data.openai_api_key || "";
    geminiKey.value = data.gemini_api_key || "";
    anthropicKey.value = data.anthropic_api_key || "";
    aitdeeKey.value = data.aitdee_api_key || "";
    applyAiTdEeUrlSelection(savedAiTdEeUrl);
    doubaoKey.value = data.doubao_api_key || "";
    ollamaUrl.value = data.ollama_url || "http://localhost:11434";
    ollamaModel.value = data.ollama_model || "qwen2.5:7b";
    dockeraiUrl.value = data.dockerai_url || "http://localhost:12434";
    dockeraiModel.value = data.dockerai_model || "docker.io/ai/qwen2.5:7B-Q4_0";
    foundrylocalUrl.value = data.foundrylocal_url || "http://127.0.0.1:55928/";
    foundrylocalModel.value = data.foundrylocal_model || "";
    koboldcppUrl.value = data.koboldcpp_url || "http://localhost:5001";
    giteeaiKey.value = data.giteeai_api_key || "";
    githubcopilotKey.value = data.githubcopilot_api_key || "";
    summaryStyleSelect.value = data.summary_style || "standard";
    renderSummaryStyleSelection();

    setModelSelectOptions(deepseekModel, REMOTE_MODEL_PRESETS.deepseek, deepseekModel.value);
    setModelSelectOptions(openaiModel, REMOTE_MODEL_PRESETS.openai, savedOpenAIModel);
    setModelSelectOptions(geminiModel, REMOTE_MODEL_PRESETS.gemini, savedGeminiModel);
    setModelSelectOptions(anthropicModel, REMOTE_MODEL_PRESETS.anthropic, savedAnthropicModel);
    setModelSelectOptions(aitdeeModel, REMOTE_MODEL_PRESETS.aitdee, savedAiTdEeModel);
    setModelSelectOptions(giteeaiModel, REMOTE_MODEL_PRESETS.giteeai, savedGiteeAIModel);
    setModelSelectOptions(githubcopilotModel, REMOTE_MODEL_PRESETS.githubcopilot, savedGitHubCopilotModel);
    setModelSelectOptions(doubaoModel, REMOTE_MODEL_PRESETS.doubao, savedDoubaoModel);

    refreshProviderIndicators();

    fetchOllamaModels(data.ollama_model || "qwen2.5:7b");
    fetchDockeraiModels(data.dockerai_model || "docker.io/ai/qwen2.5:7B-Q4_0");
    fetchFoundryLocalModels(data.foundrylocal_model || "");
    refreshRemoteModelChoices(true);
    fetchKoboldcppInfo();
  }

  function showSaveStatus(success, message = "") {
    status.classList.remove("hidden");
    status.classList.remove("is-celebrating");

    if (success) {
      status.textContent = t("optionsStatusSaved");
      void status.offsetWidth;
      status.classList.add("is-celebrating");
      setTimeout(() => status.classList.add("hidden"), 3000);
      setTimeout(() => status.classList.remove("is-celebrating"), 500);
      return;
    }

    status.textContent = message;
    setTimeout(() => status.classList.add("hidden"), 5000);
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
      throw new Error(localResult.error || syncResult.error || t("commonUnknownError"));
    }

    if (!syncResult.ok) {
      console.warn("Failed to sync settings, fell back to local storage:", syncResult.error);
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

  function initializeSummaryStyleCards() {
    summaryStyleOptions.forEach((option) => {
      option.addEventListener("click", () => {
        const value = option.dataset.summaryStyleOption;
        if (!value) {
          return;
        }

        summaryStyleSelect.value = value;
        renderSummaryStyleSelection();
      });
    });
  }

  function renderSummaryStyleSelection() {
    const currentValue = summaryStyleSelect.value || "standard";

    summaryStyleOptions.forEach((option) => {
      const isSelected = option.dataset.summaryStyleOption === currentValue;
      option.classList.toggle("is-selected", isSelected);
      option.setAttribute("aria-selected", String(isSelected));
    });
  }

  function initializeTabs() {
    setActiveTab("local", false);

    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        setActiveTab(button.dataset.tab || "local");
      });
    });
  }

  function setActiveTab(activeTab, persist = true) {
    uiState.activeTab = activeTab;

    tabButtons.forEach((button) => {
      const isActive = button.dataset.tab === activeTab;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-selected", String(isActive));
    });

    applyFilters();

    if (persist) {
      persistUiState();
    }
  }

  function initializeSearch() {
    providerSearchInput.addEventListener("input", () => {
      setSearchQuery(providerSearchInput.value);
    });

    clearSearchBtn.addEventListener("click", () => {
      setSearchQuery("");
      providerSearchInput.focus();
    });
  }

  function setSearchQuery(value, persist = true) {
    const normalized = value.trim();
    uiState.search = normalized;
    providerSearchInput.value = normalized;
    clearSearchBtn.classList.toggle("hidden", !normalized);
    applyFilters();

    if (persist) {
      persistUiState();
    }
  }

  function initializeProviderCards() {
    providerCards.forEach((card) => {
      card.addEventListener("toggle", () => {
        const providerId = card.dataset.providerId;
        if (!providerId) {
          return;
        }

        uiState.providerOpen[providerId] = card.open;
        persistUiState();
      });
    });
  }

  function restoreUiState() {
    chrome.storage.local.get([UI_STATE_KEY], (data) => {
      const storedState = data?.[UI_STATE_KEY] || {};

      uiState = {
        activeTab: storedState.activeTab || defaultUiState.activeTab,
        search: typeof storedState.search === "string" ? storedState.search : defaultUiState.search,
        providerOpen: {
          ...(storedState.providerOpen || {}),
        },
      };

      providerCards.forEach((card) => {
        const providerId = card.dataset.providerId;
        if (!providerId) {
          return;
        }

        if (typeof uiState.providerOpen[providerId] === "boolean") {
          card.open = uiState.providerOpen[providerId];
        }
      });

      setSearchQuery(uiState.search, false);
      setActiveTab(uiState.activeTab, false);
    });
  }

  function persistUiState() {
    chrome.storage.local.set({
      [UI_STATE_KEY]: uiState,
    });
  }

  function applyFilters() {
    const activeTab = uiState.activeTab || "local";
    const query = normalizeText(uiState.search || "");
    const isSummaryStyleTab = activeTab === "summary-style";
    const isDiagnosticsTab = activeTab === "diagnostics";
    const isAboutTab = activeTab === "about";
    const isSpecialTab = isSummaryStyleTab || isDiagnosticsTab || isAboutTab;
    let visibleCards = 0;

    if (toolbar) {
      toolbar.classList.remove("hidden");
      toolbar.classList.toggle("is-placeholder", isAboutTab || isSummaryStyleTab);
    }

    if (summaryStylePanel) {
      summaryStylePanel.classList.toggle("hidden", !isSummaryStyleTab);
    }

    relocateSaveActions(activeTab);

    if (networkDiagnosticsPanel) {
      networkDiagnosticsPanel.classList.toggle("hidden", !isDiagnosticsTab);
      if (isDiagnosticsTab) {
        if (!diagnosticCardMap.size) {
          renderNetworkDiagnosticTargets();
        }
        visibleCards = applyDiagnosticFilters(query);
      }
    }

    if (aboutPanel) {
      aboutPanel.classList.toggle("hidden", !isAboutTab);
    }

    groupSections.forEach((section) => {
      const groupName = section.dataset.group;
      const isTabMatch = !isSpecialTab && activeTab === groupName;
      const cards = Array.from(section.querySelectorAll("[data-provider-id]"));
      let visibleInGroup = 0;

      cards.forEach((card) => {
        const matches = !query || normalizeText(card.textContent).includes(query);
        card.hidden = !matches;

        if (matches && isTabMatch) {
          visibleInGroup += 1;
          visibleCards += 1;
        }
      });

      section.hidden = !isTabMatch || visibleInGroup === 0;
    });

    emptyState.classList.toggle("hidden", isAboutTab || isSummaryStyleTab || visibleCards > 0);
  }

  function initializeAboutPanel() {
    if (aboutVersion) {
      aboutVersion.textContent = chrome.runtime.getManifest()?.version || "--";
    }
  }

  function normalizeText(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  function cloneUiState(source) {
    return {
      activeTab: source.activeTab,
      search: source.search,
      providerOpen: { ...source.providerOpen },
    };
  }

  function relocateSaveActions(activeTab) {
    if (!pageSaveActions) {
      return;
    }

    const targetSlot = saveActionSlots[activeTab] || null;

    if (targetSlot) {
      targetSlot.appendChild(pageSaveActions);
      pageSaveActions.classList.remove("hidden");
      return;
    }

    pageSaveActions.classList.add("hidden");
    pageSaveActionsPark?.appendChild(pageSaveActions);
  }

  function initializeModelPresets() {
    setModelSelectOptions(openaiModel, REMOTE_MODEL_PRESETS.openai);
    setModelSelectOptions(geminiModel, REMOTE_MODEL_PRESETS.gemini);
    setModelSelectOptions(anthropicModel, REMOTE_MODEL_PRESETS.anthropic);
    setModelSelectOptions(aitdeeModel, REMOTE_MODEL_PRESETS.aitdee);
    setModelSelectOptions(giteeaiModel, REMOTE_MODEL_PRESETS.giteeai);
    setModelSelectOptions(githubcopilotModel, REMOTE_MODEL_PRESETS.githubcopilot);
    setModelSelectOptions(doubaoModel, REMOTE_MODEL_PRESETS.doubao);
  }

  function initializeModelRefreshButtons() {
    Object.entries(MODEL_LIST_CONFIG).forEach(([provider, config]) => {
      config.button?.addEventListener("click", () => {
        refreshRemoteModelChoicesForProvider(provider);
      });
    });
  }

  function setModelSelectOptions(select, models, selectedValue) {
    if (!select || !Array.isArray(models)) {
      return;
    }

    const normalizedModels = [];
    const seen = new Set();

    models.forEach((model) => {
      const value = String(model || "").trim();
      if (!value || seen.has(value)) {
        return;
      }

      seen.add(value);
      normalizedModels.push(value);
    });

    const currentValue = String(selectedValue ?? select.value ?? "").trim();
    if (currentValue && !seen.has(currentValue)) {
      normalizedModels.unshift(currentValue);
    }

    select.innerHTML = "";
    normalizedModels.forEach((model) => {
      const option = document.createElement("option");
      option.value = model;
      option.textContent = model;
      select.appendChild(option);
    });

    if (currentValue) {
      select.value = currentValue;
    }

    if (!select.value && normalizedModels.length) {
      select.value = normalizedModels[0];
    }
  }

  function backgroundFetchJson(url, options = {}) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        {
          type: "background-fetch",
          url,
          options,
        },
        (response) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
            return;
          }

          resolve(response || { ok: false, error: t("commonUnknownError") });
        }
      );
    });
  }

  function refreshRemoteModelChoices(silent = false) {
    Object.keys(MODEL_LIST_CONFIG).forEach((provider) => {
      refreshRemoteModelChoicesForProvider(provider, { silent });
    });
  }

  async function refreshRemoteModelChoicesForProvider(provider, options = {}) {
    const { silent = false } = options;
    const config = MODEL_LIST_CONFIG[provider];
    if (!config) {
      return;
    }

    const presetModels = REMOTE_MODEL_PRESETS[provider] || [];
    const button = config.button;
    if (button) {
      button.disabled = true;
    }

    try {
      let models = [...presetModels];
      let preferredModel = "";
      if (typeof config.fetcher === "function" && config.getApiKey()) {
        const fetchResult = normalizeModelFetchResult(
          await config.fetcher(config.getApiKey(), {
            currentModel: config.input.value,
            silent,
          })
        );
        models = mergeModelLists(fetchResult.models, presetModels);
        preferredModel = fetchResult.preferredModel;
        setProviderStatus(provider, "success", t("optionsLoadedRemoteModels", models.length));
      } else if (!silent) {
        if (presetModels.length) {
          setProviderStatus(provider, "info", t("optionsLoadedPresetModels", presetModels.length));
        } else {
          setProviderStatus(provider, "info", t("optionsModelListUnavailable"));
        }
      }

      const previousValue = String(config.input.value || "").trim();
      const selectedValue = !silent && preferredModel ? preferredModel : previousValue;
      setModelSelectOptions(config.input, models, selectedValue);

      if (!config.input.value.trim() && models.length) {
        config.input.value = models[0];
      }

      if (String(config.input.value || "").trim() !== previousValue) {
        refreshProviderIndicators();
      }
    } catch (error) {
      setModelSelectOptions(config.input, presetModels, config.input.value);
      if (!silent) {
        const fallbackMessage = presetModels.length
          ? t("optionsModelListFallbackPresets", presetModels.length)
          : (error.message || t("commonUnknownError"));
        setProviderStatus(provider, presetModels.length ? "info" : "error", fallbackMessage);
      }
    } finally {
      if (button) {
        button.disabled = false;
      }
    }
  }

  function mergeModelLists(primary, fallback) {
    const seen = new Set();
    return [...(primary || []), ...(fallback || [])].filter((item) => {
      const value = String(item || "").trim();
      if (!value || seen.has(value)) {
        return false;
      }
      seen.add(value);
      return true;
    });
  }

  function normalizeModelFetchResult(result) {
    if (Array.isArray(result)) {
      return {
        models: result,
        preferredModel: "",
      };
    }

    return {
      models: Array.isArray(result?.models) ? result.models : [],
      preferredModel: String(result?.preferredModel || "").trim(),
    };
  }

  async function fetchOpenAIModelList(apiKey) {
    const response = await backgroundFetchJson("https://api.openai.com/v1/models", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    if (!response.ok) {
      throw new Error(response.error || `HTTP ${response.status}`);
    }
    return (response.data?.data || [])
      .map((item) => item?.id)
      .filter((id) => /^gpt|^o[13]|^chatgpt/i.test(id || ""));
  }

  async function fetchGeminiModelList(apiKey) {
    const response = await backgroundFetchJson(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`, {});
    if (!response.ok) {
      throw new Error(response.error || `HTTP ${response.status}`);
    }
    return (response.data?.models || [])
      .filter((item) => Array.isArray(item?.supportedGenerationMethods) && item.supportedGenerationMethods.includes("generateContent"))
      .map((item) => String(item.name || "").replace(/^models\//, ""))
      .filter(Boolean);
  }

  async function fetchAnthropicModelList(apiKey) {
    const response = await backgroundFetchJson("https://api.anthropic.com/v1/models", {
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
    });
    if (!response.ok) {
      throw new Error(response.error || `HTTP ${response.status}`);
    }
    return (response.data?.data || response.data?.models || [])
      .map((item) => item?.id || item?.name)
      .filter(Boolean);
  }

  async function fetchAiTdEeModelList(apiKey, baseUrl) {
    const response = await backgroundFetchJson(`${normalizeBaseUrl(baseUrl, "https://ai.td.ee")}/v1/models`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    if (!response.ok) {
      throw new Error(response.error || `HTTP ${response.status}`);
    }
    return (response.data?.data || response.data?.models || [])
      .map((item) => item?.id || item?.name)
      .filter(Boolean);
  }

  async function fetchGiteeAIModelList(apiKey) {
    const response = await backgroundFetchJson("https://ai.gitee.com/v1/models", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    if (!response.ok) {
      throw new Error(response.error || `HTTP ${response.status}`);
    }
    return (response.data?.data || response.data?.models || [])
      .map((item) => item?.id || item?.name)
      .filter(Boolean);
  }

  async function fetchGitHubCopilotModelList(apiKey, currentModel, probeAccess = false) {
    const response = await backgroundFetchJson("https://models.github.ai/catalog/models", {
      headers: {
        Accept: "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error(response.error || `HTTP ${response.status}`);
    }

    const rawModels = Array.isArray(response.data)
      ? response.data
      : (response.data?.data || response.data?.models || []);
    const models = sortGitHubCopilotCatalogModels(rawModels);

    if (!probeAccess || !apiKey) {
      return { models };
    }

    const preferredModel = await resolveGitHubCopilotPreferredModel(apiKey, currentModel, models);
    return {
      models,
      preferredModel: preferredModel && preferredModel !== String(currentModel || "").trim() ? preferredModel : "",
    };
  }

  function sortGitHubCopilotCatalogModels(items) {
    const tierOrder = {
      low: 0,
      high: 1,
      custom: 2,
    };
    const priorityOrder = new Map(GITHUBCOPILOT_FALLBACK_MODELS.map((model, index) => [model, index]));

    return (Array.isArray(items) ? items : [])
      .filter((item) => {
        const id = String(item?.id || item?.name || "").trim();
        const outputs = Array.isArray(item?.supported_output_modalities) ? item.supported_output_modalities : [];
        return Boolean(id) && outputs.includes("text");
      })
      .sort((left, right) => {
        const leftId = String(left?.id || left?.name || "").trim();
        const rightId = String(right?.id || right?.name || "").trim();
        const leftPriority = priorityOrder.has(leftId) ? priorityOrder.get(leftId) : Number.MAX_SAFE_INTEGER;
        const rightPriority = priorityOrder.has(rightId) ? priorityOrder.get(rightId) : Number.MAX_SAFE_INTEGER;

        if (leftPriority !== rightPriority) {
          return leftPriority - rightPriority;
        }

        const leftTier = tierOrder[String(left?.rate_limit_tier || "").toLowerCase()] ?? 99;
        const rightTier = tierOrder[String(right?.rate_limit_tier || "").toLowerCase()] ?? 99;
        if (leftTier !== rightTier) {
          return leftTier - rightTier;
        }

        return leftId.localeCompare(rightId);
      })
      .map((item) => item?.id || item?.name)
      .filter(Boolean);
  }

  async function resolveGitHubCopilotPreferredModel(apiKey, currentModel, availableModels = []) {
    const selectedModel = String(currentModel || "").trim();
    if (selectedModel) {
      const selectedModelResponse = await probeGitHubCopilotModelAccess(apiKey, selectedModel);
      if (selectedModelResponse.ok) {
        return selectedModel;
      }

      if (!isGitHubCopilotRetryableModelError(selectedModelResponse)) {
        throw new Error(selectedModelResponse.error || `HTTP ${selectedModelResponse.status}`);
      }
    }

    const fallbackModels = getGitHubCopilotProbeCandidates(selectedModel, availableModels);
    for (const model of fallbackModels) {
      const fallbackResponse = await probeGitHubCopilotModelAccess(apiKey, model);
      if (fallbackResponse.ok) {
        return model;
      }

      if (!isGitHubCopilotRetryableModelError(fallbackResponse)) {
        break;
      }
    }

    return "";
  }

  function getGitHubCopilotProbeCandidates(currentModel, availableModels = []) {
    const extraCandidates = (Array.isArray(availableModels) ? availableModels : [])
      .filter((model) => !GITHUBCOPILOT_FALLBACK_MODELS.includes(model))
      .slice(0, 2);

    return mergeModelLists(
      [
        ...GITHUBCOPILOT_FALLBACK_MODELS,
        ...extraCandidates,
      ].filter((model) => model !== currentModel),
      []
    );
  }

  async function probeGitHubCopilotModelAccess(apiKey, model) {
    return await backgroundFetchJson("https://models.github.ai/inference/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: "ping" }],
        max_tokens: 1,
        temperature: 0,
      }),
    });
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

  function initializeProviderIndicators() {
    [
      deepseekKey,
      deepseekModel,
      openaiKey,
      openaiModel,
      geminiKey,
      geminiModel,
      anthropicKey,
      anthropicModel,
      aitdeeKey,
      aitdeeUrlSelect,
      aitdeeUrl,
      aitdeeModel,
      doubaoKey,
      doubaoModel,
      ollamaUrl,
      ollamaModel,
      dockeraiUrl,
      dockeraiModel,
      foundrylocalUrl,
      foundrylocalModel,
      koboldcppUrl,
      giteeaiKey,
      giteeaiModel,
      githubcopilotKey,
      githubcopilotModel,
    ].forEach((element) => {
      element.addEventListener("input", refreshProviderIndicators);
      element.addEventListener("change", refreshProviderIndicators);
    });

    refreshProviderIndicators();
  }

  function refreshProviderIndicators() {
    setProviderState(
      "deepseek",
      deepseekKey.value.trim() && deepseekModel.value.trim() ? "info" : "warning",
      deepseekKey.value.trim() && deepseekModel.value.trim() ? t("optionsStateConfigured") : t("optionsStateNeedsConfig")
    );
    setProviderState(
      "openai",
      openaiKey.value.trim() && openaiModel.value.trim() ? "info" : "warning",
      openaiKey.value.trim() && openaiModel.value.trim() ? t("optionsStateConfigured") : t("optionsStateNeedsConfig")
    );
    setProviderState(
      "gemini",
      geminiKey.value.trim() && geminiModel.value.trim() ? "info" : "warning",
      geminiKey.value.trim() && geminiModel.value.trim() ? t("optionsStateConfigured") : t("optionsStateNeedsConfig")
    );
    setProviderState(
      "anthropic",
      anthropicKey.value.trim() && anthropicModel.value.trim() ? "info" : "warning",
      anthropicKey.value.trim() && anthropicModel.value.trim() ? t("optionsStateConfigured") : t("optionsStateNeedsConfig")
    );
    setProviderState(
      "aitdee",
      aitdeeKey.value.trim() && getAiTdEeBaseUrl() && aitdeeModel.value.trim() ? "info" : "warning",
      aitdeeKey.value.trim() && getAiTdEeBaseUrl() && aitdeeModel.value.trim() ? t("optionsStateConfigured") : t("optionsStateNeedsConfig")
    );
    setProviderState(
      "giteeai",
      giteeaiKey.value.trim() && giteeaiModel.value.trim() ? "info" : "warning",
      giteeaiKey.value.trim() && giteeaiModel.value.trim() ? t("optionsStateConfigured") : t("optionsStateNeedsConfig")
    );
    setProviderState(
      "githubcopilot",
      githubcopilotKey.value.trim() && githubcopilotModel.value.trim() ? "info" : "warning",
      githubcopilotKey.value.trim() && githubcopilotModel.value.trim() ? t("optionsStateConfigured") : t("optionsStateNeedsConfig")
    );
    setProviderState(
      "doubao",
      doubaoKey.value.trim() && doubaoModel.value.trim() ? "info" : "warning",
      doubaoKey.value.trim() && doubaoModel.value.trim() ? t("optionsStateConfigured") : t("optionsStateNeedsConfig")
    );
    setProviderState("ollama", ollamaUrl.value.trim() ? "info" : "warning", ollamaUrl.value.trim() ? t("optionsStateLocalService") : t("optionsStateNeedsConfig"));
    setProviderState("dockerai", dockeraiUrl.value.trim() ? "info" : "warning", dockeraiUrl.value.trim() ? t("optionsStateLocalService") : t("optionsStateNeedsConfig"));
    setProviderState("foundrylocal", foundrylocalUrl.value.trim() ? "info" : "warning", foundrylocalUrl.value.trim() ? t("optionsStateLocalService") : t("optionsStateNeedsConfig"));
    setProviderState("koboldcpp", koboldcppUrl.value.trim() ? "info" : "warning", koboldcppUrl.value.trim() ? t("optionsStateLocalService") : t("optionsStateNeedsConfig"));
  }

  function initializeTestButtons() {
    Object.entries(providerTestBtns).forEach(([provider, button]) => {
      button?.addEventListener("click", () => {
        runProviderConnectionTest(provider);
      });
    });
  }

  function initializeNetworkDiagnostics() {
    networkDiagnosticsBtn?.addEventListener("click", () => {
      runNetworkDiagnostics();
    });
  }

  async function runNetworkDiagnostics() {
    if (!networkDiagnosticsBtn || !networkDiagnosticsPanel || !networkDiagnosticsSummary || !networkDiagnosticsResults) {
      return;
    }

    const targets = buildNetworkDiagnosticTargets();
    networkDiagnosticsBtn.disabled = true;
    networkDiagnosticsPanel.classList.remove("hidden");
    renderNetworkDiagnosticTargets(targets);
    networkDiagnosticsSummary.textContent = t("optionsNetworkDiagnosticsProgress", [0, targets.length]);

    try {
      const results = [];

      for (let index = 0; index < targets.length; index += 1) {
        const target = targets[index];
        updateNetworkDiagnosticCard(target.provider, {
          type: "info",
          badge: t("optionsStateTesting"),
          message: t("optionsTestingConnection"),
        });
        networkDiagnosticsSummary.textContent = t("optionsNetworkDiagnosticsProgress", [index + 1, targets.length]);

        const result = await diagnoseNetworkTarget(target);
        results.push(result);
        updateNetworkDiagnosticCard(target.provider, result);
      }

      renderNetworkDiagnosticSummary(results);
    } finally {
      networkDiagnosticsBtn.disabled = false;
    }
  }

  function buildNetworkDiagnosticTargets() {
    return [
      { provider: "ollama", url: `${normalizeBaseUrl(ollamaUrl.value, "http://localhost:11434")}/api/tags` },
      { provider: "dockerai", url: `${normalizeBaseUrl(dockeraiUrl.value, "http://localhost:12434")}/v1/models` },
      { provider: "foundrylocal", url: `${normalizeBaseUrl(foundrylocalUrl.value, "http://127.0.0.1:55928/")}/v1/models` },
      { provider: "koboldcpp", url: `${normalizeBaseUrl(koboldcppUrl.value, "http://localhost:5001")}/api/v1/model` },
      { provider: "deepseek", url: "https://api.deepseek.com/chat/completions" },
      { provider: "openai", url: "https://api.openai.com/v1/models" },
      { provider: "gemini", url: "https://generativelanguage.googleapis.com/v1beta/models" },
      { provider: "anthropic", url: "https://api.anthropic.com/v1/models" },
      { provider: "aitdee", url: `${normalizeBaseUrl(getAiTdEeBaseUrl(), "https://ai.td.ee")}/v1/models` },
      { provider: "giteeai", url: "https://ai.gitee.com/v1/models" },
      { provider: "githubcopilot", url: "https://models.github.ai/" },
      { provider: "doubao", url: "https://ark.cn-beijing.volces.com/api/v3/chat/completions" },
    ];
  }

  function normalizeBaseUrl(value, fallback) {
    return String(value || fallback || "").trim().replace(/\/+$/, "");
  }

  async function diagnoseNetworkTarget(target) {
    const providerLabel = getProviderDisplayLabel(target.provider);
    const result = {
      provider: target.provider,
      label: providerLabel,
      endpoint: target.url,
      type: "error",
      badge: t("optionsNetworkDiagnosticsUnreachableBadge"),
      message: t("optionsNetworkDiagnosticsUnreachable"),
    };

    try {
      new URL(target.url);
    } catch {
      result.message = t("optionsNetworkDiagnosticsInvalidUrl");
      return result;
    }

    let response;

    try {
      response = await backgroundFetchJson(target.url, {});
    } catch (error) {
      result.message = error?.message || t("commonNetworkRequestFailed");
      return result;
    }

    if (response.ok) {
      result.type = "success";
      result.badge = t("optionsNetworkDiagnosticsReachableBadge");
      result.message = t("optionsNetworkDiagnosticsReachableStatus", response.status || 200);
      return result;
    }

    if (response.status) {
      result.type = "info";
      result.badge = t("optionsNetworkDiagnosticsReachableBadge");
      result.message = t("optionsNetworkDiagnosticsReachableStatus", response.status);
      return result;
    }

    result.message = response.error || t("commonNetworkRequestFailed");
    return result;
  }

  function renderNetworkDiagnosticTargets(targets = buildNetworkDiagnosticTargets()) {
    if (!networkDiagnosticsResults) {
      return;
    }

    networkDiagnosticsResults.innerHTML = "";
    diagnosticCardMap.clear();

    targets.forEach((target) => {
      const card = document.createElement("div");
      card.className = "diagnostic-item pending";

      const head = document.createElement("div");
      head.className = "diagnostic-item-head";

      const name = document.createElement("div");
      name.className = "diagnostic-name";
      name.textContent = getProviderDisplayLabel(target.provider);

      const badge = document.createElement("span");
      badge.className = "diagnostic-badge";
      badge.textContent = t("optionsNetworkDiagnosticsPendingBadge");

      const message = document.createElement("div");
      message.className = "diagnostic-message";
      message.textContent = t("optionsNetworkDiagnosticsPending");

      const endpoint = document.createElement("div");
      endpoint.className = "diagnostic-endpoint";
      endpoint.textContent = target.url;

      head.appendChild(name);
      head.appendChild(badge);
      card.appendChild(head);
      card.appendChild(message);
      card.appendChild(endpoint);
      networkDiagnosticsResults.appendChild(card);

      card.dataset.provider = target.provider;
      diagnosticCardMap.set(target.provider, { card, badge, message, endpoint });
    });

    if (networkDiagnosticsSummary) {
      networkDiagnosticsSummary.textContent = t("optionsNetworkDiagnosticsIdle");
    }
  }

  function applyDiagnosticFilters(query) {
    let visibleCount = 0;

    diagnosticCardMap.forEach((entry) => {
      const searchText = normalizeText(`${entry.card.dataset.provider || ""} ${entry.card.textContent}`);
      const matches = !query || searchText.includes(query);
      entry.card.hidden = !matches;

      if (matches) {
        visibleCount += 1;
      }
    });

    return visibleCount;
  }

  function updateNetworkDiagnosticCard(provider, result) {
    const entry = diagnosticCardMap.get(provider);
    if (!entry) {
      return;
    }

    entry.card.className = `diagnostic-item ${result.type}`;
    entry.badge.textContent = result.badge;
    entry.message.textContent = result.message;
    if (result.endpoint) {
      entry.endpoint.textContent = result.endpoint;
    }
  }

  function renderNetworkDiagnosticSummary(results) {
    const reachableCount = results.filter((item) => item.type === "success" || item.type === "info").length;
    const failedCount = results.filter((item) => item.type === "error").length;

    networkDiagnosticsSummary.textContent = t("optionsNetworkDiagnosticsSummary", [reachableCount, failedCount]);
  }

  function getProviderDisplayLabel(provider) {
    const map = {
      deepseek: t("optionsSectionDeepSeek"),
      openai: t("optionsSectionOpenAI"),
      gemini: t("optionsSectionGemini"),
      anthropic: t("optionsSectionAnthropic"),
      aitdee: t("optionsSectionAiTdEe"),
      giteeai: t("optionsSectionGiteeAI"),
      githubcopilot: t("optionsSectionGitHubCopilot"),
      doubao: t("optionsSectionDoubao"),
      ollama: t("optionsSectionOllama"),
      dockerai: t("optionsSectionDockerAI"),
      foundrylocal: t("optionsSectionFoundryLocal"),
      koboldcpp: t("optionsSectionKoboldCpp"),
    };

    return map[provider] || provider;
  }

  async function runProviderConnectionTest(provider) {
    const button = providerTestBtns[provider];
    if (button) {
      button.disabled = true;
    }

    setProviderState(provider, "info", t("optionsStateTesting"));
    setProviderStatus(provider, "info", t("optionsTestingConnection"));

    try {
      let result;

      switch (provider) {
        case "ollama":
          result = await testOllamaConnection();
          break;
        case "dockerai":
          result = await testDockeraiConnection();
          break;
        case "foundrylocal":
          result = await testFoundryLocalConnection();
          break;
        case "koboldcpp":
          result = await fetchKoboldcppInfo({ throwOnError: true });
          break;
        case "deepseek":
        case "openai":
        case "anthropic":
        case "aitdee":
        case "giteeai":
        case "doubao":
          result = await testRemoteProviderConnection(provider);
          break;
        case "githubcopilot":
          result = await testGitHubCopilotConnection();
          break;
        case "gemini":
          result = await testGeminiConnection();
          break;
        default:
          throw new Error(t("commonUnknownError"));
      }

      const successMessage = result?.message || t("optionsTestSuccess");
      setProviderState(provider, "success", t("optionsStateConnected"));
      setProviderStatus(provider, "success", successMessage);
    } catch (error) {
      setProviderState(provider, "error", t("optionsStateFailed"));
      setProviderStatus(provider, "error", error.message || t("commonUnknownError"));
    } finally {
      if (button) {
        button.disabled = false;
      }
    }
  }

  function setProviderState(provider, type, text) {
    const stateEl = providerStateEls[provider];
    if (!stateEl) {
      return;
    }

    stateEl.className = `provider-state ${type}`;
    stateEl.textContent = text;
  }

  function setProviderStatus(provider, type, text) {
    const statusEl = providerStatusEls[provider];
    if (!statusEl) {
      return;
    }

    statusEl.textContent = text;
    statusEl.className = `ollama-status ${type}`;
  }

  async function testOllamaConnection() {
    const response = await new Promise((resolve) => {
      chrome.runtime.sendMessage(
        {
          type: "ollama-list-models",
          url: ollamaUrl.value.trim(),
        },
        (message) => resolve({
          message,
          runtimeError: chrome.runtime.lastError,
        })
      );
    });

    if (response.runtimeError) {
      throw new Error(t("optionsCannotConnectBackground", response.runtimeError.message));
    }

    if (!response.message?.ok) {
      throw new Error(t("optionsCannotConnectOllama", response.message?.error || t("optionsOllamaEnsureRunning")));
    }

    const models = response.message.models || [];
    return {
      message: t("optionsTestSuccessWithCount", models.length),
    };
  }

  async function testDockeraiConnection() {
    const url = (dockeraiUrl.value.trim() || "http://localhost:12434").replace(/\/+$/, "");
    const response = await backgroundFetchJson(`${url}/v1/models`, {});
    if (!response.ok) {
      throw new Error(response.error || `HTTP ${response.status}`);
    }

    if (!Array.isArray(response.data?.data)) {
      throw new Error(t("optionsFetchDockerModelsFailed"));
    }

    return {
      message: t("optionsTestSuccessWithCount", response.data.data.length),
    };
  }

  async function testFoundryLocalConnection() {
    const url = (foundrylocalUrl.value.trim() || "http://127.0.0.1:55928/").replace(/\/+$/, "");
    const response = await backgroundFetchJson(`${url}/v1/models`, {});
    if (!response.ok) {
      throw new Error(response.error || `HTTP ${response.status}`);
    }

    if (!Array.isArray(response.data?.data)) {
      throw new Error(t("optionsFetchFoundryLocalModelsFailed"));
    }

    return {
      message: t("optionsTestSuccessWithCount", response.data.data.length),
    };
  }

  async function fetchKoboldcppInfo(options = {}) {
    const { throwOnError = false } = options;
    const url = (koboldcppUrl.value.trim() || "http://localhost:5001").replace(/\/+$/, "");
    koboldcppCurrentModel.textContent = "--";
    koboldcppVersion.textContent = "--";
    setProviderState("koboldcpp", "info", t("optionsStateTesting"));
    setProviderStatus("koboldcpp", "info", t("optionsFetchingCurrentModelVersion"));

    try {
      const modelResponse = await backgroundFetchJson(`${url}/api/v1/model`, {});
      const modelData = modelResponse.data || {};
      if (!modelResponse.ok || !modelData?.result) {
        throw new Error(modelResponse.error || t("optionsCannotGetModelName"));
      }

      koboldcppCurrentModel.textContent = modelData.result;

      try {
        const versionResponse = await backgroundFetchJson(`${url}/api/v1/info/version`, {});
        const versionData = versionResponse.data || {};
        koboldcppVersion.textContent = versionResponse.ok && versionData?.result ? versionData.result : "--";
      } catch {
        koboldcppVersion.textContent = "--";
      }

      const message = t("optionsTestSuccessModel", modelData.result);
      setProviderState("koboldcpp", "success", t("optionsStateConnected"));
      setProviderStatus("koboldcpp", "success", message);
      return { message };
    } catch (error) {
      const message = error?.message || t("commonUnknownError");
      koboldcppCurrentModel.textContent = "--";
      koboldcppVersion.textContent = "--";
      setProviderState("koboldcpp", "error", t("optionsStateFailed"));
      setProviderStatus("koboldcpp", "error", message);

      if (throwOnError) {
        throw error;
      }

      return { message };
    }
  }

  async function testRemoteProviderConnection(provider) {
    const config = getRemoteProviderConfig(provider);
    if (!config.apiKey || !config.model) {
      throw new Error(t("optionsTestMissingConfig"));
    }

    const response = await backgroundFetchJson(
      config.apiUrl,
      {
        method: "POST",
        headers: config.headers,
        body: JSON.stringify(config.body),
      }
    );
    if (!response.ok) {
      if (!response.status) {
        throw new Error(response.error || t("commonNetworkRequestFailed"));
      }

      throw new Error(response.error || `HTTP ${response.status}`);
    }

    return {
      message: t("optionsTestSuccessModel", config.model),
    };
  }

  async function testGitHubCopilotConnection() {
    const apiKey = githubcopilotKey.value.trim();
    const currentModel = githubcopilotModel.value.trim() || GITHUBCOPILOT_RECOMMENDED_MODELS[0];

    if (!apiKey || !currentModel) {
      throw new Error(t("optionsTestMissingConfig"));
    }

    const preferredModel = await resolveGitHubCopilotPreferredModel(apiKey, currentModel, GITHUBCOPILOT_FALLBACK_MODELS);
    if (!preferredModel) {
      throw new Error(t("githubModelsNoAccessModel", [currentModel, GITHUBCOPILOT_RECOMMENDED_MODELS[0]]));
    }

    if (preferredModel !== currentModel) {
      githubcopilotModel.value = preferredModel;
      refreshProviderIndicators();
    }

    return {
      message: t("optionsTestSuccessModel", preferredModel),
    };
  }

  async function testGeminiConnection() {
    const apiKey = geminiKey.value.trim();
    const model = geminiModel.value.trim();
    if (!apiKey || !model) {
      throw new Error(t("optionsTestMissingConfig"));
    }

    const response = await backgroundFetchJson(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: "ping" }],
            },
          ],
          generationConfig: {
            temperature: 0,
            maxOutputTokens: 8,
          },
        }),
      }
    );
    if (!response.ok) {
      throw new Error(response.error || `HTTP ${response.status}`);
    }

    return {
      message: t("optionsTestSuccessModel", model),
    };
  }

  function getRemoteProviderConfig(provider) {
    if (provider === "openai") {
      return {
        apiKey: openaiKey.value.trim(),
        model: openaiModel.value.trim(),
        apiUrl: "https://api.openai.com/v1/chat/completions",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey.value.trim()}`,
        },
        body: {
          model: openaiModel.value.trim() || "gpt-4.1-mini",
          messages: [{ role: "user", content: "ping" }],
          max_tokens: 8,
          temperature: 0,
        },
      };
    }

    if (provider === "deepseek") {
      return {
        apiKey: deepseekKey.value.trim(),
        model: deepseekModel.value.trim(),
        apiUrl: "https://api.deepseek.com/chat/completions",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${deepseekKey.value.trim()}`,
        },
        body: {
          model: deepseekModel.value.trim() || "deepseek-chat",
          messages: [{ role: "user", content: "ping" }],
          max_tokens: 1,
          temperature: 0,
        },
      };
    }

    if (provider === "anthropic") {
      return {
        apiKey: anthropicKey.value.trim(),
        model: anthropicModel.value.trim(),
        apiUrl: "https://api.anthropic.com/v1/messages",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": anthropicKey.value.trim(),
          "anthropic-version": "2023-06-01",
        },
        body: {
          model: anthropicModel.value.trim() || "claude-3-5-sonnet-latest",
          max_tokens: 8,
          messages: [{ role: "user", content: "ping" }],
        },
      };
    }

    if (provider === "aitdee") {
      return {
        apiKey: aitdeeKey.value.trim(),
        model: aitdeeModel.value.trim(),
        apiUrl: `${normalizeBaseUrl(getAiTdEeBaseUrl(), "https://ai.td.ee")}/v1/chat/completions`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${aitdeeKey.value.trim()}`,
        },
        body: {
          model: aitdeeModel.value.trim() || "gpt-4.1-mini",
          messages: [{ role: "user", content: "ping" }],
          max_tokens: 8,
          temperature: 0,
        },
      };
    }

    if (provider === "giteeai") {
      return {
        apiKey: giteeaiKey.value.trim(),
        model: giteeaiModel.value.trim(),
        apiUrl: "https://ai.gitee.com/v1/chat/completions",
        headers: {
          "Content-Type": "application/json",
          "X-Failover-Enabled": "true",
          Authorization: `Bearer ${giteeaiKey.value.trim()}`,
        },
        body: {
          model: giteeaiModel.value.trim() || "Qwen3-8B",
          messages: [{ role: "user", content: "ping" }],
          stream: false,
          max_tokens: 1,
          temperature: 0,
        },
      };
    }

    if (provider === "githubcopilot") {
      return {
        apiKey: githubcopilotKey.value.trim(),
        model: githubcopilotModel.value.trim(),
        apiUrl: "https://models.github.ai/inference/chat/completions",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${githubcopilotKey.value.trim()}`,
        },
        body: {
          model: githubcopilotModel.value.trim() || "openai/gpt-4.1-mini",
          messages: [{ role: "user", content: "ping" }],
          max_tokens: 8,
          temperature: 0,
        },
      };
    }

    return {
      apiKey: doubaoKey.value.trim(),
      model: doubaoModel.value.trim(),
      apiUrl: "https://ark.cn-beijing.volces.com/api/v3/chat/completions",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${doubaoKey.value.trim()}`,
      },
      body: {
        model: doubaoModel.value.trim() || "doubao-pro-256k",
        messages: [{ role: "user", content: "ping" }],
        max_tokens: 1,
        temperature: 0,
      },
    };
  }

  function getAiTdEeBaseUrl() {
    const selected = aitdeeUrlSelect?.value;
    if (selected && selected !== "__custom__") {
      return selected;
    }
    return aitdeeUrl?.value.trim() || "https://ai.td.ee";
  }

  function applyAiTdEeUrlSelection(value) {
    const normalized = normalizeBaseUrl(value, "https://ai.td.ee");
    const presetValues = ["https://ai.td.ee", "https://shop.pincc.ai"];
    if (presetValues.includes(normalized)) {
      aitdeeUrlSelect.value = normalized;
      aitdeeUrl.value = normalized;
    } else {
      aitdeeUrlSelect.value = "__custom__";
      aitdeeUrl.value = normalized;
    }
  }

  /**
   * 从 Ollama 获取本地模型列表，填充下拉框
   * 如果没有任何模型，自动拉取 deepseek-r1:1.5b
   */
  function fetchOllamaModels(selectedModel) {
    setOllamaStatus("info", t("optionsFetchingLocalModels"));
    ollamaRefreshBtn.disabled = true;

    chrome.runtime.sendMessage(
      {
        type: "ollama-list-models",
        url: ollamaUrl.value.trim(),
      },
      (response) => {
        ollamaRefreshBtn.disabled = false;

        if (chrome.runtime.lastError) {
          setOllamaStatus("error", t("optionsCannotConnectBackground", chrome.runtime.lastError.message));
          return;
        }

        if (!response?.ok) {
          setOllamaStatus("error", t("optionsCannotConnectOllama", response?.error || t("optionsOllamaEnsureRunning")));
          return;
        }

        const models = response.models || [];
        populateModelSelect(models, selectedModel);

        if (models.length === 0) {
          // 没有任何模型，自动拉取
          autoPullModel();
        } else {
          setOllamaStatus("success", t("optionsFoundLocalModels", models.length));
        }
      }
    );
  }

  /**
   * 填充模型下拉框
   */
  function populateModelSelect(models, selectedModel) {
    ollamaModel.innerHTML = "";

    if (models.length === 0) {
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = t("optionsNoLocalModels");
      ollamaModel.appendChild(opt);
      return;
    }

    models.forEach((m) => {
      const opt = document.createElement("option");
      opt.value = m.name;
      const sizeMB = m.size ? `${(m.size / 1024 / 1024 / 1024).toFixed(1)}GB` : "";
      opt.textContent = sizeMB ? `${m.name} (${sizeMB})` : m.name;
      ollamaModel.appendChild(opt);
    });

    // 选中之前保存的模型
    if (selectedModel) {
      const exists = models.some((m) => m.name === selectedModel);
      if (exists) {
        ollamaModel.value = selectedModel;
      }
    }
  }

  /**
   * 自动拉取qwen2.5:7b
   */
  function autoPullModel() {
    const modelToPull = "qwen2.5:7b";
    setOllamaStatus("info", t("optionsAutoPullingModel", modelToPull));
    ollamaRefreshBtn.disabled = true;

    chrome.runtime.sendMessage(
      {
        type: "ollama-pull-model",
        url: ollamaUrl.value.trim(),
        model: modelToPull,
      },
      (response) => {
        ollamaRefreshBtn.disabled = false;

        if (chrome.runtime.lastError) {
          setOllamaStatus("error", t("optionsPullFailed", chrome.runtime.lastError.message));
          return;
        }

        if (!response?.ok) {
          setOllamaStatus("error", t("optionsPullFailed", response?.error || t("commonUnknownError")));
          return;
        }

        setOllamaStatus("success", t("optionsPullCompleted", modelToPull));
        // 重新刷新模型列表
        fetchOllamaModels(modelToPull);
      }
    );
  }

  /**
   * 设置 Ollama 状态提示
   */
  function setOllamaStatus(type, text) {
    setProviderState(
      "ollama",
      type === "error" ? "error" : type === "success" ? "success" : "info",
      type === "error" ? t("optionsStateFailed") : type === "success" ? t("optionsStateConnected") : t("optionsStateTesting")
    );
    ollamaStatusEl.textContent = text;
    ollamaStatusEl.className = "ollama-status " + type;
  }

  /**
   * 从 Docker Desktop AI 获取模型列表
   */
  function fetchDockeraiModels(selectedModel) {
    setDockeraiStatus("info", t("optionsFetchingDockerModels"));
    dockeraiRefreshBtn.disabled = true;
    const url = dockeraiUrl.value.trim() || "http://localhost:12434";
    backgroundFetchJson(`${url.replace(/\/+$/, "")}/v1/models`, {})
      .then((response) => {
        dockeraiRefreshBtn.disabled = false;
        const data = response.data || {};
        if (!response.ok || !data.data || !Array.isArray(data.data)) {
          setDockeraiStatus("error", t("optionsFetchDockerModelsFailed"));
          return;
        }
        populateDockeraiModelSelect(data.data, selectedModel);
        setDockeraiStatus("success", t("optionsFoundDockerModels", data.data.length));
      })
      .catch(err => {
        dockeraiRefreshBtn.disabled = false;
        setDockeraiStatus("error", t("optionsCannotConnectDockerAI", err.message || t("commonUnknownError")));
      });
  }

  function fetchFoundryLocalModels(selectedModel) {
    setFoundryLocalStatus("info", t("optionsFetchingFoundryLocalModels"));
    foundrylocalRefreshBtn.disabled = true;
    const url = foundrylocalUrl.value.trim() || "http://127.0.0.1:55928/";
    backgroundFetchJson(`${url.replace(/\/+$/, "")}/v1/models`, {})
      .then((response) => {
        foundrylocalRefreshBtn.disabled = false;
        const data = response.data || {};
        if (!response.ok || !data.data || !Array.isArray(data.data)) {
          setFoundryLocalStatus("error", t("optionsFetchFoundryLocalModelsFailed"));
          return;
        }
        populateFoundryLocalModelSelect(data.data, selectedModel);
        setFoundryLocalStatus("success", t("optionsFoundDockerModels", data.data.length));
      })
      .catch((err) => {
        foundrylocalRefreshBtn.disabled = false;
        setFoundryLocalStatus("error", t("optionsCannotConnectFoundryLocal", err.message || t("commonUnknownError")));
      });
  }

  function populateDockeraiModelSelect(models, selectedModel) {
    dockeraiModel.innerHTML = "";
    if (!models.length) {
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = t("optionsNoModels");
      dockeraiModel.appendChild(opt);
      return;
    }
    models.forEach((m) => {
      const opt = document.createElement("option");
      opt.value = m.id || m.name || m.model || m;
      opt.textContent = m.id || m.name || m.model || m;
      dockeraiModel.appendChild(opt);
    });
    // 选中之前保存的模型或默认
    if (selectedModel) {
      const exists = Array.from(dockeraiModel.options).some(opt => opt.value === selectedModel);
      dockeraiModel.value = exists ? selectedModel : "docker.io/ai/qwen2.5:7B-Q4_0";
    } else {
      dockeraiModel.value = "docker.io/ai/qwen2.5:7B-Q4_0";
    }
  }

  function setDockeraiStatus(type, text) {
    setProviderState(
      "dockerai",
      type === "error" ? "error" : type === "success" ? "success" : "info",
      type === "error" ? t("optionsStateFailed") : type === "success" ? t("optionsStateConnected") : t("optionsStateTesting")
    );
    dockeraiStatusEl.textContent = text;
    dockeraiStatusEl.className = "ollama-status " + type;
  }

  function populateFoundryLocalModelSelect(models, selectedModel) {
    foundrylocalModel.innerHTML = "";
    if (!models.length) {
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = t("optionsNoModels");
      foundrylocalModel.appendChild(opt);
      return;
    }

    models.forEach((model) => {
      const opt = document.createElement("option");
      opt.value = model.id || model.name || model.model || model;
      opt.textContent = model.id || model.name || model.model || model;
      foundrylocalModel.appendChild(opt);
    });

    if (selectedModel) {
      const exists = Array.from(foundrylocalModel.options).some((opt) => opt.value === selectedModel);
      if (exists) {
        foundrylocalModel.value = selectedModel;
      }
    }
  }

  function setFoundryLocalStatus(type, text) {
    setProviderState(
      "foundrylocal",
      type === "error" ? "error" : type === "success" ? "success" : "info",
      type === "error" ? t("optionsStateFailed") : type === "success" ? t("optionsStateConnected") : t("optionsStateTesting")
    );
    foundrylocalStatusEl.textContent = text;
    foundrylocalStatusEl.className = "ollama-status " + type;
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initOptionsPage, { once: true });
} else {
  initOptionsPage();
}
