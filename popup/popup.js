document.addEventListener('DOMContentLoaded', () => {
  const actionBtn = document.getElementById('actionBtn');
  const status = document.getElementById('status');

  actionBtn.addEventListener('click', async () => {
    try {
      // 获取当前活动标签页
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // 向 content script 发送消息
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'getPageInfo' });
      
      status.textContent = `页面标题：${response.title}`;
    } catch (error) {
      status.textContent = '错误：无法连接到页面';
    }
  });
});
