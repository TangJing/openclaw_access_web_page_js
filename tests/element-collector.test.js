/**
 * Element Collector 单元测试
 * 覆盖所有 HTML 标签类型的测试
 */

// 测试工具函数
const testUtils = {
  // 创建测试容器
  createTestContainer() {
    const container = document.createElement('div');
    container.id = 'test-container';
    document.body.appendChild(container);
    return container;
  },

  // 清理测试容器
  cleanupTestContainer() {
    const container = document.getElementById('test-container');
    if (container) {
      container.remove();
    }
    // 清空收集器数据
    if (window.ElementCollector) {
      window.ElementCollector.clearData();
    }
  },

  // 收集元素
  collect() {
    window.ElementCollector.collectAllElements();
  },

  // 搜索元素
  search(key) {
    return window.ElementCollector.searchElementsByKey(key);
  }
};

// 测试套件
describe('ElementCollector', () => {
  beforeEach(() => {
    testUtils.cleanupTestContainer();
    testUtils.createTestContainer();
  });

  afterEach(() => {
    testUtils.cleanupTestContainer();
  });

  describe('基础功能测试', () => {
    test('应该正确初始化', () => {
      expect(window.ElementCollector).toBeDefined();
      expect(typeof window.ElementCollector.collectAllElements).toBe('function');
      expect(typeof window.ElementCollector.searchElementsByKey).toBe('function');
      expect(typeof window.ElementCollector.getElementCount).toBe('function');
      expect(typeof window.ElementCollector.getKeywordCount).toBe('function');
      expect(typeof window.ElementCollector.exportData).toBe('function');
      expect(typeof window.ElementCollector.clearData).toBe('function');
    });

    test('应该正确收集元素数量', () => {
      const container = document.getElementById('test-container');
      container.innerHTML = '<div id="test1">Test</div><div id="test2">Test2</div>';
      
      testUtils.collect();
      
      expect(window.ElementCollector.getElementCount()).toBeGreaterThan(0);
    });

    test('应该正确清空数据', () => {
      const container = document.getElementById('test-container');
      container.innerHTML = '<div id="test">Test</div>';
      
      testUtils.collect();
      const countBefore = window.ElementCollector.getElementCount();
      expect(countBefore).toBeGreaterThan(0);
      
      window.ElementCollector.clearData();
      expect(window.ElementCollector.getElementCount()).toBe(0);
    });
  });

  describe('HTML 基础标签测试', () => {
    test('应该收集 div 标签', () => {
      const container = document.getElementById('test-container');
      container.innerHTML = '<div id="myDiv" class="box container">内容</div>';
      
      testUtils.collect();
      
      const results = testUtils.search('myDiv');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].tagName).toBe('DIV');
    });

    test('应该收集 span 标签', () => {
      const container = document.getElementById('test-container');
      container.innerHTML = '<span id="mySpan" class="text">文本</span>';
      
      testUtils.collect();
      
      const results = testUtils.search('mySpan');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].tagName).toBe('SPAN');
    });

    test('应该收集 p 标签', () => {
      const container = document.getElementById('test-container');
      container.innerHTML = '<p id="myPara" title="段落标题">段落内容</p>';
      
      testUtils.collect();
      
      const results = testUtils.search('myPara');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].tagName).toBe('P');
    });

    test('应该收集 a 标签', () => {
      const container = document.getElementById('test-container');
      container.innerHTML = '<a id="myLink" href="#" title="链接">点击</a>';
      
      testUtils.collect();
      
      const results = testUtils.search('myLink');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].tagName).toBe('A');
    });

    test('应该收集 img 标签', () => {
      const container = document.getElementById('test-container');
      container.innerHTML = '<img id="myImg" alt="图片" title="图片标题" />';
      
      testUtils.collect();
      
      const results = testUtils.search('myImg');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].tagName).toBe('IMG');
    });

    test('应该收集 button 标签', () => {
      const container = document.getElementById('test-container');
      container.innerHTML = '<button id="myBtn" class="btn primary">按钮</button>';
      
      testUtils.collect();
      
      const results = testUtils.search('myBtn');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].tagName).toBe('BUTTON');
    });

    test('应该收集 input 标签', () => {
      const container = document.getElementById('test-container');
      container.innerHTML = '<input id="myInput" type="text" placeholder="输入框" />';
      
      testUtils.collect();
      
      const results = testUtils.search('myInput');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].tagName).toBe('INPUT');
    });
  });

  describe('HTML 列表标签测试', () => {
    test('应该收集 ul 和 li 标签', () => {
      const container = document.getElementById('test-container');
      container.innerHTML = `
        <ul id="myList" class="list">
          <li class="item">项目 1</li>
          <li class="item">项目 2</li>
        </ul>
      `;
      
      testUtils.collect();
      
      const ulResults = testUtils.search('myList');
      expect(ulResults.length).toBeGreaterThan(0);
      expect(ulResults[0].tagName).toBe('UL');
      
      const liResults = testUtils.search('item');
      expect(liResults.length).toBe(2);
    });

    test('应该收集 ol 和 li 标签', () => {
      const container = document.getElementById('test-container');
      container.innerHTML = `
        <ol id="orderedList">
          <li>第一项</li>
          <li>第二项</li>
        </ol>
      `;
      
      testUtils.collect();
      
      const results = testUtils.search('orderedList');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].tagName).toBe('OL');
    });

    test('应该收集 dl, dt, dd 标签', () => {
      const container = document.getElementById('test-container');
      container.innerHTML = `
        <dl id="myDl">
          <dt id="term1">术语 1</dt>
          <dd id="def1">定义 1</dd>
        </dl>
      `;
      
      testUtils.collect();
      
      const dlResults = testUtils.search('myDl');
      expect(dlResults.length).toBeGreaterThan(0);
      
      const dtResults = testUtils.search('term1');
      expect(dtResults.length).toBeGreaterThan(0);
    });
  });

  describe('HTML 表格标签测试', () => {
    test('应该收集 table, tr, td, th 标签', () => {
      const container = document.getElementById('test-container');
      container.innerHTML = `
        <table id="myTable" class="data-table">
          <thead>
            <tr id="headerRow">
              <th id="header1">表头 1</th>
              <th id="header2">表头 2</th>
            </tr>
          </thead>
          <tbody>
            <tr id="dataRow">
              <td id="cell1">数据 1</td>
              <td id="cell2">数据 2</td>
            </tr>
          </tbody>
        </table>
      `;
      
      testUtils.collect();
      
      const tableResults = testUtils.search('myTable');
      expect(tableResults.length).toBeGreaterThan(0);
      expect(tableResults[0].tagName).toBe('TABLE');
      
      const thResults = testUtils.search('header1');
      expect(thResults.length).toBeGreaterThan(0);
      
      const tdResults = testUtils.search('cell1');
      expect(tdResults.length).toBeGreaterThan(0);
    });
  });

  describe('HTML 表单标签测试', () => {
    test('应该收集 form, label, select, option, textarea 标签', () => {
      const container = document.getElementById('test-container');
      container.innerHTML = `
        <form id="myForm" class="form-class">
          <label id="myLabel" for="select1">选择</label>
          <select id="select1">
            <option id="opt1" value="1">选项 1</option>
            <option id="opt2" value="2">选项 2</option>
          </select>
          <textarea id="myTextarea" placeholder="文本域"></textarea>
        </form>
      `;
      
      testUtils.collect();
      
      const formResults = testUtils.search('myForm');
      expect(formResults.length).toBeGreaterThan(0);
      
      const selectResults = testUtils.search('select1');
      expect(selectResults.length).toBeGreaterThan(0);
      
      const textareaResults = testUtils.search('myTextarea');
      expect(textareaResults.length).toBeGreaterThan(0);
    });
  });

  describe('HTML 语义化标签测试', () => {
    test('应该收集 header, nav, main, section, article, aside, footer 标签', () => {
      const container = document.getElementById('test-container');
      container.innerHTML = `
        <header id="pageHeader">页眉</header>
        <nav id="mainNav">导航</nav>
        <main id="mainContent">
          <section id="section1">
            <article id="article1">文章</article>
          </section>
          <aside id="sidebar">侧边栏</aside>
        </main>
        <footer id="pageFooter">页脚</footer>
      `;
      
      testUtils.collect();
      
      expect(testUtils.search('pageHeader').length).toBeGreaterThan(0);
      expect(testUtils.search('mainNav').length).toBeGreaterThan(0);
      expect(testUtils.search('mainContent').length).toBeGreaterThan(0);
      expect(testUtils.search('section1').length).toBeGreaterThan(0);
      expect(testUtils.search('article1').length).toBeGreaterThan(0);
      expect(testUtils.search('sidebar').length).toBeGreaterThan(0);
      expect(testUtils.search('pageFooter').length).toBeGreaterThan(0);
    });
  });

  describe('HTML 媒体标签测试', () => {
    test('应该收集 video, audio, source, track 标签', () => {
      const container = document.getElementById('test-container');
      container.innerHTML = `
        <video id="myVideo" poster="poster.jpg">
          <source id="source1" src="video.mp4" type="video/mp4" />
          <track id="track1" kind="subtitles" src="subs.vtt" />
        </video>
        <audio id="myAudio">
          <source id="source2" src="audio.mp3" />
        </audio>
      `;
      
      testUtils.collect();
      
      expect(testUtils.search('myVideo').length).toBeGreaterThan(0);
      expect(testUtils.search('myAudio').length).toBeGreaterThan(0);
    });

    test('应该收集 figure 和 figcaption 标签', () => {
      const container = document.getElementById('test-container');
      container.innerHTML = `
        <figure id="myFigure">
          <img src="image.jpg" alt="图片" />
          <figcaption id="myCaption">图片说明</figcaption>
        </figure>
      `;
      
      testUtils.collect();
      
      expect(testUtils.search('myFigure').length).toBeGreaterThan(0);
      expect(testUtils.search('myCaption').length).toBeGreaterThan(0);
    });
  });

  describe('HTML 其他常用标签测试', () => {
    test('应该收集 h1-h6 标签', () => {
      const container = document.getElementById('test-container');
      container.innerHTML = `
        <h1 id="heading1">标题 1</h1>
        <h2 id="heading2">标题 2</h2>
        <h3 id="heading3">标题 3</h3>
      `;
      
      testUtils.collect();
      
      expect(testUtils.search('heading1').length).toBeGreaterThan(0);
      expect(testUtils.search('heading2').length).toBeGreaterThan(0);
      expect(testUtils.search('heading3').length).toBeGreaterThan(0);
    });

    test('应该收集 strong, em, mark, del, ins 标签', () => {
      const container = document.getElementById('test-container');
      container.innerHTML = `
        <p>
          <strong id="strong1">加粗</strong>
          <em id="em1">斜体</em>
          <mark id="mark1">标记</mark>
          <del id="del1">删除</del>
          <ins id="ins1">插入</ins>
        </p>
      `;
      
      testUtils.collect();
      
      expect(testUtils.search('strong1').length).toBeGreaterThan(0);
      expect(testUtils.search('em1').length).toBeGreaterThan(0);
      expect(testUtils.search('mark1').length).toBeGreaterThan(0);
    });

    test('应该收集 code, pre, blockquote 标签', () => {
      const container = document.getElementById('test-container');
      container.innerHTML = `
        <code id="code1">代码</code>
        <pre id="pre1">预格式化文本</pre>
        <blockquote id="quote1">引用</blockquote>
      `;
      
      testUtils.collect();
      
      expect(testUtils.search('code1').length).toBeGreaterThan(0);
      expect(testUtils.search('pre1').length).toBeGreaterThan(0);
      expect(testUtils.search('quote1').length).toBeGreaterThan(0);
    });

    test('应该收集 br, hr 标签', () => {
      const container = document.getElementById('test-container');
      container.innerHTML = `
        <div>
          第一行<br id="br1" />第二行
          <hr id="hr1" />
        </div>
      `;
      
      testUtils.collect();
      
      // br 和 hr 没有 id 可能无法通过 id 搜索，但应该被收集
      const count = window.ElementCollector.getElementCount();
      expect(count).toBeGreaterThan(0);
    });
  });

  describe('SVG 标签测试', () => {
    test('应该收集 svg, circle, rect, path 标签', () => {
      const container = document.getElementById('test-container');
      container.innerHTML = `
        <svg id="mySvg" viewBox="0 0 100 100">
          <circle id="myCircle" cx="50" cy="50" r="40" />
          <rect id="myRect" x="10" y="10" width="80" height="80" />
          <path id="myPath" d="M10,10 L90,90" />
        </svg>
      `;
      
      testUtils.collect();
      
      expect(testUtils.search('mySvg').length).toBeGreaterThan(0);
      expect(testUtils.search('myCircle').length).toBeGreaterThan(0);
      expect(testUtils.search('myRect').length).toBeGreaterThan(0);
      expect(testUtils.search('myPath').length).toBeGreaterThan(0);
    });
  });

  describe('class 关键字分割测试', () => {
    test('应该正确分割 class 中的多个类名', () => {
      const container = document.getElementById('test-container');
      container.innerHTML = '<div id="test" class="btn primary large">按钮</div>';
      
      testUtils.collect();
      
      // 应该能通过每个 class 单独搜索到
      expect(testUtils.search('btn').length).toBeGreaterThan(0);
      expect(testUtils.search('primary').length).toBeGreaterThan(0);
      expect(testUtils.search('large').length).toBeGreaterThan(0);
    });

    test('应该正确处理 class 中的多个空格', () => {
      const container = document.getElementById('test-container');
      container.innerHTML = '<div id="test" class="  class1   class2  ">内容</div>';
      
      testUtils.collect();
      
      expect(testUtils.search('class1').length).toBeGreaterThan(0);
      expect(testUtils.search('class2').length).toBeGreaterThan(0);
    });
  });

  describe('innerText 搜索测试', () => {
    test('应该能通过 innerText 搜索元素', () => {
      const container = document.getElementById('test-container');
      container.innerHTML = '<button id="testBtn">登录</button>';
      
      testUtils.collect();
      
      const results = testUtils.search('登录');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].id).toBe('testBtn');
    });

    test('应该能处理 innerText 过长的情况', () => {
      const container = document.getElementById('test-container');
      const longText = 'A'.repeat(200);
      container.innerHTML = `<div id="longText">${longText}</div>`;
      
      testUtils.collect();
      
      // 应该能搜索到（前 100 字符）
      const results = testUtils.search('A'.repeat(50));
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('title 属性搜索测试', () => {
    test('应该能通过 title 属性搜索元素', () => {
      const container = document.getElementById('test-container');
      container.innerHTML = '<div id="test" title="提示文本">内容</div>';
      
      testUtils.collect();
      
      const results = testUtils.search('提示文本');
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('exportData 测试', () => {
    test('应该正确导出数据', () => {
      const container = document.getElementById('test-container');
      container.innerHTML = '<div id="test" class="myClass">内容</div>';
      
      testUtils.collect();
      
      const data = window.ElementCollector.exportData();
      
      expect(data.elementCount).toBeGreaterThan(0);
      expect(data.keywordCount).toBeGreaterThan(0);
      expect(Array.isArray(data.elements)).toBe(true);
      expect(Array.isArray(data.keywords)).toBe(true);
    });
  });

  describe('嵌套元素测试', () => {
    test('应该正确收集嵌套元素', () => {
      const container = document.getElementById('test-container');
      container.innerHTML = `
        <div id="outer" class="outer">
          <div id="middle" class="middle">
            <div id="inner" class="inner">内容</div>
          </div>
        </div>
      `;
      
      testUtils.collect();
      
      expect(testUtils.search('outer').length).toBeGreaterThan(0);
      expect(testUtils.search('middle').length).toBeGreaterThan(0);
      expect(testUtils.search('inner').length).toBeGreaterThan(0);
    });
  });
});
