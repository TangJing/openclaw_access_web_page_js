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
 * @param {string|SVGAnimatedString|any} className - class 字符串或 SVGAnimatedString
 * @returns {string} - 处理后的 class 字符串
 */
function normalizeClass(className) {
  if (!className) return '';
  
  // 处理各种类型的 className
  let classStr = '';
  
  if (typeof className === 'string') {
    classStr = className;
  } else if (className && typeof className === 'object') {
    // SVGAnimatedString 或其他对象
    if (typeof className.baseVal === 'string') {
      classStr = className.baseVal;
    } else if (typeof className.toString === 'function') {
      classStr = String(className.toString());
    } else {
      classStr = String(className);
    }
  } else {
    classStr = String(className);
  }
  
  if (!classStr || classStr === '[object Object]') return '';
  return classStr.trim().split(/\s+/).join('|');
}

/**
 * 生成元素的唯一 key
 * @param {Element} element - DOM 元素
 * @returns {string|null} - 生成的 key，如果没有有效属性则返回 null
 */
function generateElementKey(element) {
  // 安全获取 id
  let id = '';
  try {
    id = element.id || '';
  } catch (e) {
    id = '';
  }

  // 安全获取 class
  let className = '';
  try {
    className = normalizeClass(element.className);
  } catch (e) {
    className = '';
  }

  // 安全获取 title
  let title = '';
  try {
    title = element.title || '';
  } catch (e) {
    title = '';
  }

  // 安全获取 innerText
  let innerText = '';
  try {
    if (element.innerText) {
      innerText = String(element.innerText).trim().slice(0, 100);
    }
  } catch (e) {
    innerText = '';
  }

  // 如果所有属性都为空，则不保存该元素
  if (!id && !className && !title && !innerText) {
    return null;
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

    // 跳过空 key 或 null
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

  return elementMap.size;
}

/**
 * 根据关键字搜索元素
 * @param {string} key - 搜索关键字
 * @returns {Object} - 匹配的元素对象，key 为 elementMap 的 key，value 为对应的 DOM 元素
 */
function searchElementsByKey(key) {
  if (!key) return {};

  const matchedKeys = keywordMap.get(key);
  if (!matchedKeys || matchedKeys.size === 0) {
    return {};
  }

  const result = {};
  matchedKeys.forEach(elementKey => {
    const element = elementMap.get(elementKey);
    if (element) {
      result[elementKey] = element;
    }
  });

  return result;
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

// 添加便捷的页面搜索助手（在控制台可直接使用）
window.$search = function(key) {
  if (!window.ElementCollector) {
    return {};
  }
  return window.ElementCollector.searchElementsByKey(key);
};

window.$collect = function() {
  if (!window.ElementCollector) {
    return 0;
  }
  return window.ElementCollector.collectAllElements();
};

window.$elements = function() {
  if (!window.ElementCollector) {
    return 0;
  }
  return window.ElementCollector.getElementCount();
};
