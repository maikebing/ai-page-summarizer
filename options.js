document.addEventListener("DOMContentLoaded", () => {
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
  const saveBtn = document.getElementById("save-btn");
  const status = document.getElementById("status");

  // 加载已保存的设置
  chrome.storage.sync.get(
    [
      "deepseek_api_key", "deepseek_model",
      "doubao_api_key", "doubao_model",
      "ollama_url", "ollama_model",
      "dockerai_url", "dockerai_model",
      "koboldcpp_url"
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
        koboldcppStatusEl.textContent = "⏳ 正在获取当前模型和版本...";
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
              koboldcppStatusEl.textContent = `✅ 当前模型：${data.result}`;
              koboldcppStatusEl.className = "ollama-status success";
            } else {
              koboldcppCurrentModel.textContent = "--";
              koboldcppStatusEl.textContent = "❌ 未获取到模型名称";
              koboldcppStatusEl.className = "ollama-status error";
            }
          })
          .catch(err => {
            koboldcppCurrentModel.textContent = "--";
            koboldcppStatusEl.textContent = "❌ 获取模型名称失败: " + (err.message || err);
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
   * 自动拉取qwen2.5:7b
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

  /**
   * 从 Docker Desktop AI 获取模型列表
   */
  function fetchDockeraiModels(selectedModel) {
    setDockeraiStatus("info", "⏳ 正在获取 Docker Desktop AI 模型列表...");
    dockeraiRefreshBtn.disabled = true;
    const url = dockeraiUrl.value.trim() || "http://localhost:12434";
    fetch(`${url.replace(/\/+$/, "")}/v1/models`)
      .then(res => res.json())
      .then(data => {
        dockeraiRefreshBtn.disabled = false;
        if (!data.data || !Array.isArray(data.data)) {
          setDockeraiStatus("error", "❌ 获取模型失败");
          return;
        }
        populateDockeraiModelSelect(data.data, selectedModel);
        setDockeraiStatus("success", `✅ 找到 ${data.data.length} 个模型`);
      })
      .catch(err => {
        dockeraiRefreshBtn.disabled = false;
        setDockeraiStatus("error", "❌ 无法连接 Docker Desktop AI: " + (err.message || "未知错误"));
      });
  }

  function populateDockeraiModelSelect(models, selectedModel) {
    dockeraiModel.innerHTML = "";
    if (!models.length) {
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = "暂无模型";
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
