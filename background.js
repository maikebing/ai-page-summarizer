// Service Worker - 后台处理
// 目前主要逻辑在 popup.js 中，这里预留扩展空间

chrome.runtime.onInstalled.addListener(() => {
  console.log("AI 页面总结器已安装");
});
