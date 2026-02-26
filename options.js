document.addEventListener("DOMContentLoaded", () => {
  const deepseekKey = document.getElementById("deepseek-key");
  const deepseekModel = document.getElementById("deepseek-model");
  const doubaoKey = document.getElementById("doubao-key");
  const doubaoModel = document.getElementById("doubao-model");
  const saveBtn = document.getElementById("save-btn");
  const status = document.getElementById("status");

  // 加载已保存的设置
  chrome.storage.sync.get(
    ["deepseek_api_key", "deepseek_model", "doubao_api_key", "doubao_model"],
    (data) => {
      deepseekKey.value = data.deepseek_api_key || "";
      deepseekModel.value = data.deepseek_model || "deepseek-chat";
      doubaoKey.value = data.doubao_api_key || "";
      doubaoModel.value = data.doubao_model || "doubao-pro-256k";
    }
  );

  saveBtn.addEventListener("click", () => {
    chrome.storage.sync.set(
      {
        deepseek_api_key: deepseekKey.value.trim(),
        deepseek_model: deepseekModel.value.trim(),
        doubao_api_key: doubaoKey.value.trim(),
        doubao_model: doubaoModel.value.trim(),
      },
      () => {
        status.classList.remove("hidden");
        setTimeout(() => status.classList.add("hidden"), 3000);
      }
    );
  });
});
