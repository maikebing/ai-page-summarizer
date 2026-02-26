document.addEventListener("DOMContentLoaded", () => {
  const deepseekKey = document.getElementById("deepseek-key");
  const deepseekModel = document.getElementById("deepseek-model");
  const doubaoKey = document.getElementById("doubao-key");
  const doubaoModel = document.getElementById("doubao-model");
  const ollamaUrl = document.getElementById("ollama-url");
  const ollamaModel = document.getElementById("ollama-model");
  const ollamaRefreshBtn = document.getElementById("ollama-refresh-btn");
  const ollamaStatusEl = document.getElementById("ollama-status");
  const saveBtn = document.getElementById("save-btn");
  const status = document.getElementById("status");

  // 加载已保存的设置
  chrome.storage.sync.get(
    ["deepseek_api_key", "deepseek_model", "doubao_api_key", "doubao_model", "ollama_url", "ollama_model"],
    (data) => {
      deepseekKey.value = data.deepseek_api_key || "";
      deepseekModel.value = data.deepseek_model || "deepseek-chat";
      doubaoKey.value = data.doubao_api_key || "";
      doubaoModel.value = data.doubao_model || "doubao-pro-256k";
      ollamaUrl.value = data.ollama_url || "http://localhost:11434";

      // 加载完设置后自动刷新模型列表
      fetchOllamaModels(data.ollama_model || "");
    }
  );

  // 刷新按钮
  ollamaRefreshBtn.addEventListener("click", () => {
    fetchOllamaModels(ollamaModel.value);
  });

  saveBtn.addEventListener("click", () => {
    chrome.storage.sync.set(
      {
        deepseek_api_key: deepseekKey.value.trim(),
        deepseek_model: deepseekModel.value.trim(),
        doubao_api_key: doubaoKey.value.trim(),
        doubao_model: doubaoModel.value.trim(),
        ollama_url: ollamaUrl.value.trim(),
        ollama_model: ollamaModel.value,
      },
      () => {
        status.classList.remove("hidden");
        setTimeout(() => status.classList.add("hidden"), 3000);
      }
    );
  });

  /**
   * 从 Ollama 获取本地模型列表，填充下拉框
   * 如果没有任何模型，自动拉取 deepseek-r1:1.5b
   */
  function fetchOllamaModels(selectedModel) {
    setOllamaStatus("info", "⏳ 正在获取本地模型列表...");
    ollamaRefreshBtn.disabled = true;

    chrome.runtime.sendMessage(
      { type: "ollama-list-models", url: ollamaUrl.value.trim() },
      (response) => {
        ollamaRefreshBtn.disabled = false;

        if (chrome.runtime.lastError) {
          setOllamaStatus("error", "❌ 无法连接后台服务：" + chrome.runtime.lastError.message);
          return;
        }

        if (!response?.ok) {
          setOllamaStatus("error", "❌ 无法连接 Ollama：" + (response?.error || "请确认 Ollama 已启动"));
          return;
        }

        const models = response.models || [];
        populateModelSelect(models, selectedModel);

        if (models.length === 0) {
          // 没有任何模型，自动拉取
          autoPullModel();
        } else {
          setOllamaStatus("success", `✅ 找到 ${models.length} 个本地模型`);
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
      opt.textContent = "暂无本地模型";
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
   * 自动拉取 deepseek-r1:1.5b
   */
  function autoPullModel() {
    const modelToPull = "qwen2.5:7b";
    setOllamaStatus("info", `⏳ 未找到本地模型，正在自动拉取 ${modelToPull}，请耐心等待...`);
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
          setOllamaStatus("error", "❌ 拉取失败：" + chrome.runtime.lastError.message);
          return;
        }

        if (!response?.ok) {
          setOllamaStatus("error", "❌ 拉取失败：" + (response?.error || "未知错误"));
          return;
        }

        setOllamaStatus("success", `✅ ${modelToPull} 拉取完成！`);
        // 重新刷新模型列表
        fetchOllamaModels(modelToPull);
      }
    );
  }

  /**
   * 设置 Ollama 状态提示
   */
  function setOllamaStatus(type, text) {
    ollamaStatusEl.textContent = text;
    ollamaStatusEl.className = "ollama-status " + type;
  }
});
