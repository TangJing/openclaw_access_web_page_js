// Background Service Worker
// 在 Manifest V3 中，background page 被 service worker 替代

// 监听扩展安装事件
chrome.runtime.onInstalled.addListener((details) => {
  console.log('扩展已安装', details);
  
  if (details.reason === 'install') {
    console.log('首次安装，初始化设置');
  } else if (details.reason === 'update') {
    console.log(`从版本 ${details.previousVersion} 更新`);
  }
});

// 监听来自 popup 或 content script 的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('收到消息:', message, '来自:', sender);
  
  if (message.action === 'getPageInfo') {
    // 处理请求
    sendResponse({ status: 'ok' });
  }
  
  return true; // 保持消息通道开放用于异步响应
});

// 监听标签页更新
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    console.log(`标签页 ${tabId} 加载完成: ${tab.title}`);
  }
});

console.log('Background service worker 已启动');
