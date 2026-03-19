# Page JS Extension

一个 Chrome 扩展，自动收集页面 HTML 标签结构，支持通过关键字快速搜索和定位页面元素。

## 功能特性

- 🚀 **自动收集**：页面加载后自动收集所有 HTML 标签
- 🔍 **关键字搜索**：通过 id、class、title、innerText 等关键字快速搜索元素
- 📦 **双 Map 结构**：elementMap 存储元素，keywordMap 存储关键字映射关系
- 🌐 **全局注入**：支持所有网页自动注入
- 🎯 **精确定位**：返回匹配的 DOM 元素引用

## 项目结构

```
page_js/
├── manifest.json              # 扩展配置文件 (Manifest V3)
├── background/
│   └── background.js          # Service Worker 后台脚本
├── content_scripts/
│   ├── content.js             # 主注入脚本
│   └── lib/
│       └── element-collector.js  # 元素收集器核心库
├── popup/
│   ├── popup.html             # 弹出页面
│   ├── popup.css              # 弹出页面样式
│   └── popup.js               # 弹出页面逻辑
├── styles/
│   └── content.css            # 注入页面的样式
└── icons/
    ├── icon16.svg             # 16x16 图标
    ├── icon48.svg             # 48x48 图标
    └── icon128.svg            # 128x128 图标
```

## 安装方法

### 方法 1：开发者模式（推荐开发时使用）

1. 打开 Chrome 浏览器，访问 `chrome://extensions/`
2. 开启右上角的 **"开发者模式"**
3. 点击 **"加载已解压的扩展程序"**
4. 选择 `page_js` 项目目录
5. 扩展安装完成

### 方法 2：使用打包文件

1. 下载 `page_js_extension.zip`
2. 解压到任意目录
3. 按方法 1 加载解压后的目录

### 图标转换（可选）

项目中的图标为 SVG 格式，如需正式发布，请转换为 PNG：

```bash
# 使用 ImageMagick 转换
convert icons/icon16.svg icons/icon16.png
convert icons/icon48.svg icons/icon48.png
convert icons/icon128.svg icons/icon128.png
```

## 使用说明

### API 接口

扩展在全局 `window.ElementCollector` 对象上提供以下方法：

#### `collectAllElements()`
收集页面所有 HTML 标签，构建索引。

```javascript
ElementCollector.collectAllElements();
```

#### `searchElementsByKey(key)`
根据关键字搜索元素。

```javascript
// 搜索 class 包含 'btn' 的元素
const btns = ElementCollector.searchElementsByKey('btn');

// 搜索 id 为 'header' 的元素
const headers = ElementCollector.searchElementsByKey('header');

// 搜索文本包含 '登录' 的元素
const logins = ElementCollector.searchElementsByKey('登录');
```

#### `getElementCount()`
获取已收集的元素数量。

```javascript
const count = ElementCollector.getElementCount();
```

#### `getKeywordCount()`
获取索引的关键字数量。

```javascript
const keywordCount = ElementCollector.getKeywordCount();
```

#### `exportData()`
导出所有数据（用于调试）。

```javascript
const data = ElementCollector.exportData();
console.log(data);
```

#### `clearData()`
清空所有收集的数据。

```javascript
ElementCollector.clearData();
```

### 数据格式

#### elementMap
```
key 格式：id|class|title|innerText
- id: 元素的 id 属性
- class: 元素的 class（空格替换为 |）
- title: 元素的 title 属性
- innerText: 元素的文本内容（最多 100 字符）
```

示例 key：`header|nav|main-menu|首页`

#### keywordMap
```
关键字 -> Set<elementMap keys>
```

## 技术架构

- **Manifest V3**：使用最新的 Chrome 扩展规范
- **Service Worker**：替代传统的 background page
- **Content Scripts**：注入页面执行脚本
- **双 Map 索引**：O(1) 时间复杂度搜索

## 注意事项

1. 某些特殊页面无法注入：
   - `chrome://` 开头的页面
   - `chrome-extension://` 开头的页面
   - 新标签页、设置页等系统页面

2. 动态加载的内容（如 SPA 路由切换后）需要手动调用 `collectAllElements()` 重新收集

3. 图标文件需要 PNG 格式才能正常显示

## 开发

```bash
# 克隆项目
git clone https://gitee.com/TonyDon/page_js.git

# 进入项目目录
cd page_js

# 安装依赖（如有）
npm install

# 修改代码后重新加载扩展
# 在 chrome://extensions/ 页面点击刷新按钮
```

## 参与贡献

1. Fork 本仓库
2. 新建 `Feat_xxx` 分支
3. 提交代码
4. 新建 Pull Request

## 许可证

MIT License

## 相关链接

- [Gitee 仓库](https://gitee.com/TonyDon/page_js)
- [Chrome 扩展开发文档](https://developer.chrome.com/docs/extensions/)
