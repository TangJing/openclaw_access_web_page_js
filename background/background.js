// Background Service Worker
// 在 Manifest V3 中，background page 被 service worker 替代

// 监听扩展安装事件
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
  } else if (details.reason === 'update') {
  }
});

// 监听来自 popup 或 content script 的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  if (message.action === 'getPageInfo') {
    // 处理请求
    sendResponse({ status: 'ok' });
  }
  
  return true; // 保持消息通道开放用于异步响应
});

// 监听标签页更新
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
  }
});

