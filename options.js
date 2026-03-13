document.addEventListener("DOMContentLoaded", () => {
  const { t } = window.AppI18n;
  const deepseekKey = document.getElementById("deepseek-key");
  const deepseekModel = document.getElementById("deepseek-model");
  const doubaoKey = document.getElementById("doubao-key");
  const doubaoModel = document.getElementById("doubao-model");
  const ollamaUrl = document.getElementById("ollama-url");
  const ollamaModel = document.getElementById("ollama-model");
  const ollamaRefreshBtn = document.getElementById("ollama-refresh-btn");
  const ollamaStatusEl = document.getElementById("ollama-status");
  const dockeraiUrl = document.getElementById("dockerai-url");
  const dockeraiModel = document.getElementById("dockerai-model");
  const dockeraiRefreshBtn = document.getElementById("dockerai-refresh-btn");
  const dockeraiStatusEl = document.getElementById("dockerai-status");
  const koboldcppUrl = document.getElementById("koboldcpp-url");
  const koboldcppStatusEl = document.getElementById("koboldcpp-status");
  const koboldcppCurrentModel = document.getElementById("koboldcpp-current-model");
  const koboldcppVersion = document.getElementById("koboldcpp-version");
  const koboldcppRefreshBtn = document.getElementById("koboldcpp-refresh-btn");
  const giteeaiKey = document.getElementById("giteeai-key");
  const giteeaiModel = document.getElementById("giteeai-model");
  const saveBtn = document.getElementById("save-btn");
  const status = document.getElementById("status");

  // 加载已保存的设置
  chrome.storage.sync.get(
    [
      "deepseek_api_key", "deepseek_model",
      "doubao_api_key", "doubao_model",
      "ollama_url", "ollama_model",
      "dockerai_url", "dockerai_model",
      "koboldcpp_url",
      "giteeai_api_key", "giteeai_model"
    ],
    (data) => {
      deepseekKey.value = data.deepseek_api_key || "";
      deepseekModel.value = data.deepseek_model || "deepseek-chat";
      doubaoKey.value = data.doubao_api_key || "";
      doubaoModel.value = data.doubao_model || "doubao-pro-256k";
      ollamaUrl.value = data.ollama_url || "http://localhost:11434";
      ollamaModel.value = data.ollama_model || "qwen2.5:7b";
      dockeraiUrl.value = data.dockerai_url || "http://localhost:12434";
      dockeraiModel.value = data.dockerai_model || "docker.io/ai/qwen2.5:7B-Q4_0";
      koboldcppUrl.value = data.koboldcpp_url || "http://localhost:5001";
      giteeaiKey.value = data.giteeai_api_key || "";
      giteeaiModel.value = data.giteeai_model || "Qwen3-8B";

      // 加载完设置后自动刷新模型列表
      fetchOllamaModels(data.ollama_model || "qwen2.5:7b");
      fetchDockeraiModels(data.dockerai_model || "docker.io/ai/qwen2.5:7B-Q4_0");
      // koboldcpp: 获取当前模型名称
      fetchKoboldcppInfo();
      // koboldcpp 刷新按钮

      koboldcppRefreshBtn.addEventListener("click", () => {
        fetchKoboldcppInfo();
      });

      /**
       * 获取 KoboldCpp 当前模型名称和版本
       */
      function fetchKoboldcppInfo() {
        const url = (koboldcppUrl.value.trim() || "http://localhost:5001").replace(/\/+$/, "");
        koboldcppCurrentModel.textContent = "--";
        koboldcppVersion.textContent = "--";
        koboldcppStatusEl.textContent = t("optionsFetchingCurrentModelVersion");
        koboldcppStatusEl.className = "ollama-status info";
        // 获取模型名
        fetch(url + "/api/v1/model")
          .then(res => {
            if (!res.ok) throw new Error("HTTP " + res.status);
            return res.json();
          })
          .then(data => {
            if (data && data.result) {
              koboldcppCurrentModel.textContent = data.result;
              koboldcppStatusEl.textContent = t("optionsCurrentModelStatus", data.result);
              koboldcppStatusEl.className = "ollama-status success";
            } else {
              koboldcppCurrentModel.textContent = "--";
              koboldcppStatusEl.textContent = t("optionsCannotGetModelName");
              koboldcppStatusEl.className = "ollama-status error";
            }
          })
          .catch(err => {
            koboldcppCurrentModel.textContent = "--";
            koboldcppStatusEl.textContent = t("optionsFetchModelNameFailed", err.message || err);
            koboldcppStatusEl.className = "ollama-status error";
          });
        // 获取版本号
        fetch(url + "/api/v1/info/version")
          .then(res => {
            if (!res.ok) throw new Error("HTTP " + res.status);
            return res.json();
          })
          .then(data => {
            if (data && data.result) {
              koboldcppVersion.textContent = data.result;
            } else {
              koboldcppVersion.textContent = "--";
            }
          })
          .catch(() => {
            koboldcppVersion.textContent = "--";
          });
      }
    }
  );

  // Ollama 刷新按钮
  ollamaRefreshBtn.addEventListener("click", () => {
    fetchOllamaModels(ollamaModel.value);
  });

  // DockerAI 刷新按钮
  dockeraiRefreshBtn.addEventListener("click", () => {
    fetchDockeraiModels(dockeraiModel.value);
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
        dockerai_url: dockeraiUrl.value.trim(),
        dockerai_model: dockeraiModel.value,
        koboldcpp_url: koboldcppUrl.value.trim(),
        giteeai_api_key: giteeaiKey.value.trim(),
        giteeai_model: giteeaiModel.value.trim(),
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
    setOllamaStatus("info", t("optionsFetchingLocalModels"));
    ollamaRefreshBtn.disabled = true;

    chrome.runtime.sendMessage(
      { type: "ollama-list-models", url: ollamaUrl.value.trim() },
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
    fetch(`${url.replace(/\/+$/, "")}/v1/models`)
      .then(res => res.json())
      .then(data => {
        dockeraiRefreshBtn.disabled = false;
        if (!data.data || !Array.isArray(data.data)) {
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
    dockeraiStatusEl.textContent = text;
    dockeraiStatusEl.className = "ollama-status " + type;
  }
});
