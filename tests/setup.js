/**
 * Jest 测试配置文件
 * 加载 element-collector.js 到测试环境
 */

const fs = require('fs');
const path = require('path');

// 读取并执行 element-collector.js
const collectorPath = path.join(__dirname, '../content_scripts/lib/element-collector.js');
const collectorCode = fs.readFileSync(collectorPath, 'utf-8');

// 在全局执行代码
eval(collectorCode);

// 模拟 chrome API
global.chrome = {
  runtime: {
    onMessage: {
      addListener: () => {}
    },
    sendMessage: () => {}
  },
  tabs: {
    query: () => Promise.resolve([]),
    sendMessage: () => Promise.resolve({})
  }
};
