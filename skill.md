# Page JS Extension - AI 技能文档

## 项目概述

Page JS Extension 是一个 Chrome 扩展，用于自动收集页面 HTML 标签结构，并提供关键字搜索功能来快速定位页面元素。

## 核心功能

### 1. 自动收集
- 页面加载后自动收集所有 HTML 标签
- 构建双 Map 索引结构（elementMap + keywordMap）
- 支持所有网页自动注入

### 2. 关键字搜索
- 通过 id、class、title、innerText 搜索元素
- O(1) 时间复杂度查找
- 返回匹配的 DOM 元素引用

### 3. 数据结构

#### elementMap
```
Map<key, Element>
key 格式：id|class|title|innerText
- id: 元素的 id 属性
- class: 元素的 class（空格替换为 |）
- title: 元素的 title 属性
- innerText: 元素的文本内容（最多 100 字符）
```

#### keywordMap
```
Map<keyword, Set<keys>>
每个关键字映射到多个元素 key
```

## API 使用

### 全局对象：`window.ElementCollector`

#### 方法列表

| 方法 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `collectAllElements()` | 无 | `number` | 收集页面所有元素，返回数量 |
| `searchElementsByKey(key)` | `key: string` | `Element[]` | 根据关键字搜索元素 |
| `getElementCount()` | 无 | `number` | 获取已收集的元素数量 |
| `getKeywordCount()` | 无 | `number` | 获取索引的关键字数量 |
| `exportData()` | 无 | `Object` | 导出所有数据（调试用） |
| `clearData()` | 无 | `void` | 清空所有数据 |

## 使用示例

### 快速开始

```javascript
// 1. 检查 ElementCollector 是否可用
console.log(typeof ElementCollector);
// 输出 "object" 表示已加载
// 输出 "undefined" 表示未加载

// 2. 查看已收集的元素数量
ElementCollector.getElementCount();
```

### 完整 API 使用

```javascript
// 注意：首先在普通网页（如 https://www.example.com）上确保扩展已加载
// 在控制台输入以下命令

// 1. 检查 ElementCollector 是否可用
if (typeof ElementCollector !== 'undefined') {
  console.log('ElementCollector 已就绪');
} else {
  console.log('ElementCollector 未加载，请检查：');
  console.log('1. 扩展是否已安装并启用');
  console.log('2. 是否在普通网页上（非 chrome:// 等系统页面）');
  console.log('3. 页面是否已刷新');
}

// 2. 手动收集元素（页面加载后自动执行，可选）
ElementCollector.collectAllElements();

// 3. 通过 id 搜索
const header = ElementCollector.searchElementsByKey('header');

// 4. 通过 class 搜索
const buttons = ElementCollector.searchElementsByKey('btn');

// 5. 通过文本搜索
const loginBtn = ElementCollector.searchElementsByKey('登录');

// 6. 通过 title 搜索
const tooltip = ElementCollector.searchElementsByKey('提示文本');

// 7. 获取统计信息
console.log(`元素数量：${ElementCollector.getElementCount()}`);
console.log(`关键字数量：${ElementCollector.getKeywordCount()}`);

// 8. 导出数据
const data = ElementCollector.exportData();
console.log(data.elements); // 所有 key
console.log(data.keywords); // 所有关键字

// 9. 清空数据
ElementCollector.clearData();
```

### 快捷命令（推荐）

为了更方便地在控制台使用，提供了以下快捷命令：

```javascript
// $search(key) - 搜索元素
$search('header')        // 搜索包含 'header' 的元素
$search('btn')           // 搜索包含 'btn' 的元素
$search('登录')          // 搜索包含 '登录' 的元素

// $collect() - 重新收集元素
$collect()               // 返回收集的元素数量

// $elements() - 查看已收集的元素数量
$elements()              // 返回当前收集的元素数量
```

### 搜索结果处理

```javascript
// 搜索返回 Element 数组
const elements = ElementCollector.searchElementsByKey('btn');

// 遍历结果
elements.forEach((el, index) => {
  console.log(`元素 ${index}:`, el.tagName, el.id, el.className);
});

// 获取第一个匹配元素
const first = elements[0];

// 高亮显示搜索结果
elements.forEach(el => {
  el.style.border = '2px solid red';
  el.style.backgroundColor = 'yellow';
});

// 滚动到第一个匹配元素
if (elements.length > 0) {
  elements[0].scrollIntoView({ behavior: 'smooth' });
}
```

## 项目结构

```
page_js/
├── manifest.json              # Chrome 扩展配置 (Manifest V3)
├── background/
│   └── background.js          # Service Worker 后台脚本
├── content_scripts/
│   ├── content.js             # 主注入脚本
│   └── lib/
│       └── element-collector.js  # 核心库（元素收集器）
├── popup/
│   ├── popup.html             # 弹出页面
│   ├── popup.css              # 弹出页面样式
│   └── popup.js               # 弹出页面逻辑
├── styles/
│   └── content.css            # 注入页面的样式
├── icons/                     # 扩展图标 (PNG 格式)
├── tests/                     # 单元测试
│   ├── element-collector.test.js
│   └── setup.js
├── package.json               # npm 配置
└── skill.md                   # 本文件
```

## 开发指南

### 安装依赖
```bash
npm install
```

### 运行测试
```bash
npm test
```

### 打包扩展
```bash
# 生成 page_js_extension.zip
python3 -c "
import zipfile
files = ['manifest.json', 'background/', 'content_scripts/', 'popup/', 'styles/', 'icons/']
with zipfile.ZipFile('page_js_extension.zip', 'w') as z:
    for f in files:
        # 递归添加文件
        pass
"
```

### 加载扩展
1. 打开 `chrome://extensions/`
2. 开启"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择项目根目录

## 注意事项

### 1. 特殊页面无法注入
以下页面类型不支持，`ElementCollector` 会是 `undefined`：
- `chrome://` 开头的页面（扩展管理页、设置页等）
- `chrome-extension://` 开头的页面
- 新标签页、书签页、历史记录页等系统页面
- 扩展程序商店页面

**解决方法**：在普通网页上使用，如 `https://www.example.com`

### 2. 需要刷新页面
安装或更新扩展后，需要刷新目标页面才能注入脚本。

**解决方法**：
1. 安装/更新扩展
2. 打开目标网页
3. 按 F5 刷新页面
4. 在控制台检查 `ElementCollector`

### 3. 检查扩展是否加载
在控制台执行：
```javascript
console.log(typeof ElementCollector);
// 输出 "object" 表示已加载
// 输出 "undefined" 表示未加载
```

### 4. 动态内容处理
SPA 应用路由切换后，需要手动重新收集：
```javascript
// 路由变化后
ElementCollector.collectAllElements();
```

### 3. 属性为空的处理
- 元素没有任何 id/class/title/innerText 时，不会被保存
- 部分属性为空时，只索引有值的属性
- 所有访问都有 try-catch 保护，不会报错

### 4. SVG 元素支持
- SVG 元素的 `className` 是 `SVGAnimatedString` 对象
- 已做特殊处理，自动转换为字符串

### 5. innerText 限制
- 超过 100 字符会被截断
- 某些元素（如 SVG）可能没有 innerText

## 测试覆盖

单元测试覆盖以下场景：
- ✅ HTML 基础标签（div, span, p, a, img, button, input）
- ✅ HTML 列表标签（ul, ol, li, dl, dt, dd）
- ✅ HTML 表格标签（table, tr, td, th）
- ✅ HTML 表单标签（form, label, select, option, textarea）
- ✅ HTML 语义化标签（header, nav, main, section, article, aside, footer）
- ✅ HTML 媒体标签（video, audio, source, track, figure, figcaption）
- ✅ HTML 其他标签（h1-h6, strong, em, mark, code, pre, blockquote, br, hr）
- ✅ SVG 标签（svg, circle, rect, path）
- ✅ class 多值分割
- ✅ innerText 搜索
- ✅ title 属性搜索
- ✅ 空属性处理
- ✅ 嵌套元素

## 常见问题

### Q: 为什么某些元素搜索不到？
A: 检查元素是否有 id/class/title/innerText 属性，没有任何属性的元素不会被保存。

### Q: 如何搜索 class 中包含多个类名的元素？
A: class 中的空格会被替换为 `|`，可以单独搜索每个类名：
```javascript
// <div class="btn primary large">
ElementCollector.searchElementsByKey('btn');    // 可以搜到
ElementCollector.searchElementsByKey('primary'); // 可以搜到
ElementCollector.searchElementsByKey('large');   // 可以搜到
```

### Q: 性能如何？
A: 使用 Map 和 Set 数据结构，搜索时间复杂度为 O(1)。

## 远程仓库

- Gitee: https://gitee.com/TonyDon/page_js.git
