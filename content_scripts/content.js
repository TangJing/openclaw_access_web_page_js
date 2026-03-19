// Content Script - 注入到网页中执行

console.log('Content script 已加载');

// 监听来自 popup 或 background 的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Content script 收到消息:', message);
  
  if (message.action === 'getPageInfo') {
    sendResponse({
      title: document.title,
      url: window.location.href,
      timestamp: new Date().toISOString()
    });
  }
  
  return true; // 保持消息通道开放
});

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM 加载完成');
  
  // 调用自动收集 HTML 标签方法
  if (window.ElementCollector) {
    window.ElementCollector.collectAllElements();
  }
});

// 可以在这里添加页面操作逻辑
function injectElement() {
  /*
  const div = document.createElement('div');
  div.id = 'page-js-injected';
  div.textContent = 'Page JS Extension';
  div.style.position = 'fixed';
  div.style.bottom = '10px';
  div.style.right = '10px';
  div.style.padding = '10px';
  div.style.background = '#4285f4';
  div.style.color = 'white';
  div.style.borderRadius = '4px';
  div.style.zIndex = '9999';
  //document.body.appendChild(div);
  */
}

// 当 body 可用时注入元素
if (document.body) {
  injectElement();
} else {
  document.addEventListener('DOMContentLoaded', injectElement);
}
