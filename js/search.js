(function() {
  'use strict';

  let searchData = [];
  let searchModal, searchInput, searchResults, searchBtn, searchClose;
  let selectedIndex = -1;
  let isDataLoaded = false;

  // 初始化
  function init() {
    searchModal = document.getElementById('search-modal');
    searchInput = document.getElementById('search-input');
    searchResults = document.getElementById('search-results');
    searchBtn = document.getElementById('search-btn');
    searchClose = document.getElementById('search-close');

    if (!searchModal || !searchInput || !searchResults) return;

    bindEvents();
  }

  // 绑定事件
  function bindEvents() {
    // 打开搜索
    searchBtn.addEventListener('click', openSearch);

    // 关闭搜索
    searchClose.addEventListener('click', closeSearch);
    searchModal.addEventListener('click', function(e) {
      if (e.target === searchModal) closeSearch();
    });

    // 键盘快捷键
    document.addEventListener('keydown', function(e) {
      // '/' 打开搜索
      if (e.key === '/' && !isSearchOpen()) {
        e.preventDefault();
        openSearch();
        return;
      }

      // ESC 关闭搜索
      if (e.key === 'Escape' && isSearchOpen()) {
        closeSearch();
        return;
      }

      if (!isSearchOpen()) return;

      // 上下键导航
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        navigateResults(1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        navigateResults(-1);
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault();
        const selected = searchResults.querySelectorAll('.search-result-item')[selectedIndex];
        if (selected) {
          window.location.href = selected.getAttribute('href');
        }
      }
    });

    // 搜索输入
    searchInput.addEventListener('input', debounce(performSearch, 200));
  }

  // 打开搜索
  function openSearch() {
    searchModal.classList.add('active');
    searchModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // 显示空状态提示
    showEmptyState();

    // 延迟聚焦以确保动画流畅
    setTimeout(() => searchInput.focus(), 100);

    // 懒加载搜索数据
    if (!isDataLoaded) {
      loadSearchData();
    }
  }

  // 关闭搜索
  function closeSearch() {
    searchModal.classList.remove('active');
    searchModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    searchInput.value = '';
    searchResults.innerHTML = '';
    selectedIndex = -1;
  }

  // 判断搜索是否打开
  function isSearchOpen() {
    return searchModal.classList.contains('active');
  }

  // 加载搜索数据
  function loadSearchData() {
    fetch('/search.json')
      .then(response => response.json())
      .then(data => {
        searchData = data;
        isDataLoaded = true;
      })
      .catch(err => {
        console.error('Failed to load search data:', err);
        showError();
      });
  }

  // 执行搜索
  function performSearch() {
    const query = searchInput.value.trim().toLowerCase();

    if (!query) {
      showEmptyState();
      return;
    }

    if (!isDataLoaded) {
      searchResults.innerHTML = '<div class="search-loading">Loading...</div>';
      return;
    }

    // 检测当前页面语言
    const isEnglishPage = window.location.pathname.includes('/en/');

    // 根据语言过滤文章
    const filteredData = isEnglishPage
      ? searchData.filter(post => post.lang === 'en-US')
      : searchData.filter(post => post.lang === 'zh-CN');

    const results = filteredData.filter(post => {
      return post.title.toLowerCase().includes(query) ||
             post.summary.toLowerCase().includes(query) ||
             post.content.toLowerCase().includes(query) ||
             post.categories.some(cat => cat.toLowerCase().includes(query));
    });

    displayResults(results, query);
  }

  // 显示空状态
  function showEmptyState() {
    searchResults.innerHTML = '<div class="search-empty-state">Type to search articles...</div>';
  }

  // 显示搜索结果
  function displayResults(results, query) {
    selectedIndex = -1;

    if (results.length === 0) {
      searchResults.innerHTML = '<div class="search-no-results">No results found</div>';
      return;
    }

    const html = results.slice(0, 10).map((post, index) => {
      const highlightedTitle = highlightText(post.title, query);
      const highlightedSummary = highlightText(post.summary || post.content, query);
      const category = post.categories[0] || '';

      return `
        <a href="${post.url}" class="search-result-item" data-index="${index}" role="option">
          <div class="search-result-content">
            <div class="search-result-title">${highlightedTitle}</div>
            <div class="search-result-summary">${highlightedSummary}</div>
          </div>
          <div class="search-result-meta">
            ${category ? `<span class="search-result-category">${category}</span>` : ''}
            <span class="search-result-date">${post.date}</span>
          </div>
        </a>
      `;
    }).join('');

    searchResults.innerHTML = html;

    // 为每个结果绑定点击事件
    searchResults.querySelectorAll('.search-result-item').forEach((item, index) => {
      item.addEventListener('mouseenter', () => {
        selectedIndex = index;
        updateSelection();
      });
    });
  }

  // 高亮文本
  function highlightText(text, query) {
    if (!text) return '';
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  // 转义正则表达式特殊字符
  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // 导航结果
  function navigateResults(direction) {
    const items = searchResults.querySelectorAll('.search-result-item');
    if (items.length === 0) return;

    selectedIndex += direction;

    if (selectedIndex < 0) {
      selectedIndex = items.length - 1;
    } else if (selectedIndex >= items.length) {
      selectedIndex = 0;
    }

    updateSelection();

    // 滚动到可见区域
    items[selectedIndex].scrollIntoView({
      block: 'nearest',
      behavior: 'smooth'
    });
  }

  // 更新选中状态
  function updateSelection() {
    const items = searchResults.querySelectorAll('.search-result-item');
    items.forEach((item, index) => {
      if (index === selectedIndex) {
        item.classList.add('selected');
        item.setAttribute('aria-selected', 'true');
      } else {
        item.classList.remove('selected');
        item.setAttribute('aria-selected', 'false');
      }
    });
  }

  // 显示错误
  function showError() {
    searchResults.innerHTML = '<div class="search-error">Failed to load search data</div>';
  }

  // 防抖
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // 当 DOM 加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
