---
name: page_js_operation
description: 在网页执行点击/输入/选择/勾选等操作前定位元素
tools:
  - cdp
---

# Page JS CDP 网页操作 Skill

本 Skill 通过 Chrome DevTools Protocol (CDP) 调用 Page JS Extension API 来操作网页元素。

## 工作流程

1. **首次启动检查** → 检查插件是否安装（仅一次，结果缓存）
2. **获取标签集合** → 调用 `ElementCollector.exportData()` 获取页面元素
3. **AI 分析标签** → 分析可用元素，确定目标
4. **CDP 执行操作** → 执行 click/input/change 等操作

## 操作模板

### 检查插件是否可用（首次启动）
```javascript
typeof ElementCollector !== 'undefined'
```

### 获取页面元素清单
```javascript
ElementCollector.exportData()
// 返回：{ elements: [...], keywords: [...], elementCount: N }
```

### 点击元素
```javascript
const results = ElementCollector.searchElementsByKey('{关键字}');
const element = Object.values(results)[0];
if (element) element.click();
```

### 填充输入框
```javascript
const inputs = ElementCollector.searchElementsByKey('{关键字}');
const input = Object.values(inputs)[0];
if (input) {
  input.value = '{值}';
  input.dispatchEvent(new Event('input', { bubbles: true }));
}
```

### 选择下拉选项
```javascript
const selects = ElementCollector.searchElementsByKey('{关键字}');
const select = Object.values(selects)[0];
if (select) {
  select.value = '{选项 value}';
  select.dispatchEvent(new Event('change', { bubbles: true }));
}
```

### 勾选复选框
```javascript
const checks = ElementCollector.searchElementsByKey('{关键字}');
const check = Object.values(checks)[0];
if (check) {
  check.checked = true;
  check.dispatchEvent(new Event('change', { bubbles: true }));
}
```

## CDP 命令参考

| 操作 | CDP Runtime.evaluate 表达式 |
|------|---------------------------|
| 检查插件 | `typeof ElementCollector !== 'undefined'` |
| 获取清单 | `ElementCollector.exportData()` |
| 点击 | `ElementCollector.searchElementsByKey('btn')[0].click()` |
| 填充 | `ElementCollector.searchElementsByKey('input')[0].value = 'text'` |
| 选择 | `ElementCollector.searchElementsByKey('select')[0].value = 'option'` |
| 勾选 | `ElementCollector.searchElementsByKey('checkbox')[0].checked = true` |
| 收集 | `ElementCollector.collectAllElements()` |
| 计数 | `ElementCollector.getElementCount()` |

## 常见关键字

| 操作 | 推荐关键字 |
|------|-----------|
| 登录 | `'登录'`, `'login'`, `'signin'` |
| 注册 | `'注册'`, `'signup'` |
| 搜索 | `'搜索'`, `'search'` |
| 提交 | `'提交'`, `'submit'`, `'确定'` |
| 取消 | `'取消'`, `'cancel'` |
| 用户名 | `'username'`, `'用户名'`, `'account'` |
| 密码 | `'password'`, `'密码'` |
| 邮箱 | `'email'`, `'邮箱'`, `'mail'` |

## 安全提示

- 确保 Chrome 扩展已安装并启用
- 目标页面不能是 `chrome://` 等系统页面
- 操作前确认页面已完全加载
- 动态内容需先调用 `collectAllElements()` 重新收集

## 隐私说明

**本插件完全运行在浏览器本地环境，不与外界服务器做任何通讯。**

- **本地运行**：所有代码在浏览器沙箱中执行
- **无网络请求**：不发送任何数据到外部服务器
- **内存数据**：所有收集的元素数据仅存储在内存中，页面关闭即清除
- **仅解决 Token 问题**：设计目的是避免将全量 HTML 发送给 LLM，节省 Token 消耗
- **无隐私泄露风险**：数据不出浏览器，不存在隐私泄露问题

**代码完全开源，可由用户自行下载源码安装：**
- [GitHub 仓库](https://github.com/TangJing/openclaw_access_web_page_js)
