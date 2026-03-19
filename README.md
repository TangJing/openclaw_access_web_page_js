# Page JS Extension

一个 Chrome 扩展，专为 **AI 大模型操作网页** 设计。自动收集页面所有 DOM 元素并建立关键字索引，通过 CDP（Chrome DevTools Protocol）让 AI 能够以 **极低的 Token 消耗** 完成页面自动化操作。

## 🎯 核心用途

### 解决的问题
传统 AI 操作网页需要发送完整 DOM（数千行 HTML），消耗大量 Token。本插件将页面元素本地索引化，AI 只需发送关键字即可完成操作，**节省 95%+ 的 Token**。

### 适用场景
- ✅ AI 助手自动操作网页（点击、填充、选择等）
- ✅ 浏览器自动化测试
- ✅ RPA（机器人流程自动化）
- ✅ 网页数据采集

### 典型工作流

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  AI 大模型   │────▶│  CDP/控制台   │────▶│  本插件 API  │
│ (生成操作代码) │     │  (执行代码)   │     │  (定位元素)  │
└─────────────┘     └──────────────┘     └─────────────┘
       ▲                                        │
       │                                        ▼
       │                              ┌─────────────┐
       └──────────────────────────────│  返回结果   │
                                      └─────────────┘
```

---

## 🚀 功能特性

- **🤖 AI 友好**：专为大模型设计，最小化 Token 消耗
- **🔍 关键字搜索**：通过 id、class、title、innerText、aria-label 搜索元素
- **⚡ 高性能**：双 Map 索引结构，O(1) 时间复杂度查找
- **🌐 全局注入**：支持所有网页自动注入（`<all_urls>`）
- **📦 本地索引**：DOM 结构本地存储，无需发送给 AI
- **🎯 精确定位**：返回真实 DOM 引用，可直接操作

---

## 📦 安装方法

### 方法 1：开发者模式（推荐）

1. 打开 Chrome 浏览器，访问 `chrome://extensions/`
2. 开启右上角的 **"开发者模式"**
3. 点击 **"加载已解压的扩展程序"**
4. 选择 `page_js` 项目目录
5. 扩展安装完成

### 方法 2：使用打包文件

1. 下载 `page_js_extension.zip`
2. 解压到任意目录
3. 按方法 1 加载解压后的目录

---

## 🔧 使用方法

### 方案一：搭配 CDP 使用（推荐 AI 自动化）

通过 Chrome DevTools Protocol 远程执行插件 API：

```python
# Python 示例：使用 pychrome 库
import pychrome

# 连接 Chrome DevTools
browser = pychrome.Browser(url="http://127.0.0.1:9222")
tab = browser.new_tab()
tab.start()

# 启用 Runtime domain
tab.Runtime.enable()

# 执行插件 API
result = tab.Runtime.evaluate(expression="""
    const results = ElementCollector.searchElementsByKey('登录');
    const btn = Object.values(results)[0];
    if (btn) {
        btn.click();
        return { success: true };
    }
    return { success: false };
""")

print(result)
tab.close()
```

### 方案二：Chrome 控制台（手动调试）

在目标页面按 `F12` 打开控制台，直接调用：

```javascript
// 搜索并点击登录按钮
const results = ElementCollector.searchElementsByKey('登录');
const btn = Object.values(results)[0];
if (btn) btn.click();

// 填充输入框
const userField = ElementCollector.searchElementsByKey('username');
Object.values(userField)[0].value = 'admin';
```

### 方案三：浏览器自动化框架

```javascript
// Puppeteer 示例
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://example.com');
  
  // 等待插件注入
  await page.waitForFunction(() => window.ElementCollector);
  
  // 执行操作
  await page.evaluate(() => {
    const btns = ElementCollector.searchElementsByKey('提交');
    const btn = Object.values(btns)[0];
    if (btn) btn.click();
  });
  
  await browser.close();
})();
```

---

## 📖 API 文档

### 全局对象：`window.ElementCollector`

| 方法 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `collectAllElements()` | 无 | `number` | 收集页面所有元素，返回数量 |
| `searchElementsByKey(key)` | `key: string` | `Object` | 根据关键字搜索元素，返回 `{key: DOM}` 对象 |
| `getElementCount()` | 无 | `number` | 获取已收集的元素数量 |
| `getKeywordCount()` | 无 | `number` | 获取索引的关键字数量 |
| `exportData()` | 无 | `Object` | 导出所有数据（调试用） |
| `clearData()` | 无 | `void` | 清空所有数据 |

### 返回值格式

`searchElementsByKey(key)` 返回对象：
```javascript
{
  "header|nav||": <DOM Element>,
  "btn|primary||登录": <DOM Element>,
  ...
}
```

**使用方式：**
```javascript
const results = ElementCollector.searchElementsByKey('btn');
const firstElement = Object.values(results)[0];  // 获取第一个元素
firstElement.click();  // 直接操作
```

### 快捷命令（控制台专用）

```javascript
$search('登录')     // 搜索元素
$collect()          // 重新收集
$elements()         // 查看元素数量
```

---

## 💡 AI 操作示例

### 登录操作
```javascript
// AI 生成代码
const users = ElementCollector.searchElementsByKey('username');
const pwds = ElementCollector.searchElementsByKey('password');
const btns = ElementCollector.searchElementsByKey('登录');

Object.values(users)[0].value = 'admin';
Object.values(pwds)[0].value = '123456';
Object.values(btns)[0].click();
```

### 表单填写
```javascript
// 填写搜索表单
const searchInput = ElementCollector.searchElementsByKey('搜索');
const searchBtn = ElementCollector.searchElementsByKey('search');

Object.values(searchInput)[0].value = '关键词';
Object.values(searchBtn)[0].click();
```

### 下拉选择
```javascript
// 选择下拉选项
const selects = ElementCollector.searchElementsByKey('country');
const select = Object.values(selects)[0];
select.value = 'CN';
select.dispatchEvent(new Event('change'));
```

---

## 🏗️ 技术架构

### 数据结构

```
elementMap: Map<key, Element>
  key 格式：id|class|title|innerText|aria-label
  
keywordMap: Map<keyword, Set<keys>>
  倒排索引，O(1) 查找
```

### 组件说明

| 组件 | 说明 |
|------|------|
| `element-collector.js` | 核心库，注入页面 MAIN world |
| `content.js` | 消息转发，ISOLATED world |
| `background.js` | Service Worker，扩展生命周期管理 |
| `popup/` | 扩展弹出界面（可选） |

---

## ⚠️ 注意事项

### 不支持的页面
- `chrome://` 开头的页面
- `chrome-extension://` 开头的页面
- 新标签页、设置页等系统页面

### 动态内容
SPA 路由切换后需重新收集：
```javascript
ElementCollector.collectAllElements();
```

### 元素标识
确保元素有以下属性之一才能被索引：
- `id`
- `class`
- `title`
- `innerText`（文本内容）
- `aria-label`（无障碍标签）

---

## 📦 开发

```bash
# 克隆项目
git clone https://gitee.com/TonyDon/page_js.git
cd page_js

# 安装测试依赖
npm install

# 运行测试
npm test

# 修改代码后
# 在 chrome://extensions/ 页面点击刷新按钮
```

---

## 📊 Token 节省对比

| 操作 | 传统方式 | 本插件 | 节省率 |
|------|----------|--------|--------|
| 点击按钮 | ~5000 tokens | ~100 tokens | 98% |
| 表单填写 | ~8000 tokens | ~200 tokens | 97.5% |
| 页面导航 | ~5000 tokens | ~150 tokens | 97% |
| **平均** | | | **~95%+** |

---

## 📄 许可证

MIT License

## 🔗 相关链接

- [Gitee 仓库](https://gitee.com/TonyDon/page_js)
- [Chrome 扩展开发文档](https://developer.chrome.com/docs/extensions/)
- [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/)
