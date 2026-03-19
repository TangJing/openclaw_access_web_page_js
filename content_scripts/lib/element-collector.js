/**
 * 页面元素收集器
 * 自动收集页面 HTML 标签，提供搜索功能
 */

// 存储所有元素的 Map: key -> element
// key 格式：id|class|title|innerText (class 中的空格用 | 分割)
const elementMap = new Map();

// 存储关键字到 element keys 的映射关系
// key: 拆分后的单个关键字 -> value: Set<elementMap 的 keys>
const keywordMap = new Map();

/**
 * 将 class 字符串中的空格替换为 |
 * @param {string|SVGAnimatedString} className - class 字符串或 SVGAnimatedString
 * @returns {string} - 处理后的 class 字符串
 */
function normalizeClass(className) {
  if (!className) return '';
  // 处理 SVGAnimatedString 对象
  const classStr = typeof className === 'string' ? className : className.baseVal || String(className);
  if (!classStr) return '';
  return String(classStr).trim().split(/\s+/).join('|');
}

/**
 * 生成元素的唯一 key
 * @param {Element} element - DOM 元素
 * @returns {string} - 生成的 key
 */
function generateElementKey(element) {
  const id = element.id || '';
  const className = normalizeClass(element.className);
  const title = element.title || '';
  // 处理 innerText 可能不存在的情况（如 SVG 元素）
  let innerText = '';
  if (element.innerText) {
    innerText = String(element.innerText).trim().slice(0, 100);
  }
  
  return [id, className, title, innerText].join('|');
}

/**
 * 将 key 拆分为独立的关键字
 * @param {string} key - 完整的 key
 * @returns {string[]} - 关键字数组
 */
function splitKey(key) {
  if (!key) return [];
  return key.split('|').filter(k => k.length > 0);
}

/**
 * 收集页面所有 HTML 标签
 * 构建 elementMap 和 keywordMap
 */
function collectAllElements() {
  // 清空现有数据
  elementMap.clear();
  keywordMap.clear();
  
  // 获取页面所有元素
  const allElements = document.querySelectorAll('*');
  
  allElements.forEach((element, index) => {
    const key = generateElementKey(element);
    
    // 跳过空 key
    if (!key) return;
    
    // 存入 elementMap
    elementMap.set(key, element);
    
    // 构建 keywordMap
    const keywords = splitKey(key);
    keywords.forEach(keyword => {
      if (!keywordMap.has(keyword)) {
        keywordMap.set(keyword, new Set());
      }
      keywordMap.get(keyword).add(key);
    });
  });
  
  console.log(`[ElementCollector] 已收集 ${elementMap.size} 个元素`);
  return elementMap.size;
}

/**
 * 根据关键字搜索元素
 * @param {string} key - 搜索关键字
 * @returns {Element[]} - 匹配的元素数组
 */
function searchElementsByKey(key) {
  if (!key) return [];
  
  const matchedKeys = keywordMap.get(key);
  if (!matchedKeys || matchedKeys.size === 0) {
    console.log(`[ElementCollector] 未找到匹配关键字 "${key}" 的元素`);
    return [];
  }
  
  const elements = [];
  matchedKeys.forEach(elementKey => {
    const element = elementMap.get(elementKey);
    if (element) {
      elements.push(element);
    }
  });
  
  console.log(`[ElementCollector] 找到 ${elements.length} 个匹配元素`);
  return elements;
}

/**
 * 获取 elementMap 的大小
 * @returns {number} - 元素数量
 */
function getElementCount() {
  return elementMap.size;
}

/**
 * 获取 keywordMap 的大小
 * @returns {number} - 关键字数量
 */
function getKeywordCount() {
  return keywordMap.size;
}

/**
 * 导出所有数据（用于调试）
 * @returns {Object} - 导出的数据
 */
function exportData() {
  return {
    elementCount: elementMap.size,
    keywordCount: keywordMap.size,
    elements: Array.from(elementMap.keys()),
    keywords: Array.from(keywordMap.keys())
  };
}

/**
 * 清空所有数据
 */
function clearData() {
  elementMap.clear();
  keywordMap.clear();
  console.log('[ElementCollector] 数据已清空');
}

// 导出 API
window.ElementCollector = {
  collectAllElements,
  searchElementsByKey,
  getElementCount,
  getKeywordCount,
  exportData,
  clearData
};

// 自动收集（页面加载完成后）
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', collectAllElements);
} else {
  collectAllElements();
}

console.log('[ElementCollector] 模块已加载');
