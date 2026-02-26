// Service Worker - 后台处理

chrome.runtime.onInstalled.addListener(() => {
  console.log("AI 页面总结器已安装");

  // 点击扩展图标直接打开侧边栏
  if (chrome.sidePanel?.setPanelBehavior) {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {});
  }
});
