(function() {
  'use strict';

  let searchData = [];
  let searchModal, searchInput, searchResults, searchBtn, searchClose;
  let selectedIndex = -1;
  let isDataLoaded = false;

  // Initialize
  function init() {
    searchModal = document.getElementById('search-modal');
    searchInput = document.getElementById('search-input');
    searchResults = document.getElementById('search-results');
    searchBtn = document.getElementById('search-btn');
    searchClose = document.getElementById('search-close');

    if (!searchModal || !searchInput || !searchResults) return;

    bindEvents();
  }

  // Bind events
  function bindEvents() {
    // Open search
    searchBtn.addEventListener('click', openSearch);

    // Close search
    searchClose.addEventListener('click', closeSearch);
    searchModal.addEventListener('click', function(e) {
      if (e.target === searchModal) closeSearch();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
      // '/' to open search
      if (e.key === '/' && !isSearchOpen()) {
        e.preventDefault();
        openSearch();
        return;
      }

      // ESC to close search
      if (e.key === 'Escape' && isSearchOpen()) {
        closeSearch();
        return;
      }

      if (!isSearchOpen()) return;

      // Arrow keys navigation
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

    // Search input
    searchInput.addEventListener('input', debounce(performSearch, 200));
  }

  // Open search
  function openSearch() {
    searchModal.classList.add('active');
    searchModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Show empty state
    showEmptyState();

    // Delay focus to ensure smooth animation
    setTimeout(() => searchInput.focus(), 100);

    // Lazy load search data
    if (!isDataLoaded) {
      loadSearchData();
    }
  }

  // Close search
  function closeSearch() {
    searchModal.classList.remove('active');
    searchModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    searchInput.value = '';
    searchResults.innerHTML = '';
    selectedIndex = -1;
  }

  // Check if search is open
  function isSearchOpen() {
    return searchModal.classList.contains('active');
  }

  // Load search data
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

  // Perform search
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

    // Detect current page language
    const isEnglishPage = window.location.pathname.includes('/en/');

    // Filter articles by language
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

  // Show empty state
  function showEmptyState() {
    searchResults.innerHTML = '<div class="search-empty-state">Type to search articles...</div>';
  }

  // Display search results
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

    // Bind click events for each result
    searchResults.querySelectorAll('.search-result-item').forEach((item, index) => {
      item.addEventListener('mouseenter', () => {
        selectedIndex = index;
        updateSelection();
      });
    });
  }

  // Highlight text
  function highlightText(text, query) {
    if (!text) return '';
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  // Escape regex special characters
  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Navigate results
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

    // Scroll to visible area
    items[selectedIndex].scrollIntoView({
      block: 'nearest',
      behavior: 'smooth'
    });
  }

  // Update selection state
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

  // Show error
  function showError() {
    searchResults.innerHTML = '<div class="search-error">Failed to load search data</div>';
  }

  // Debounce
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

  // Initialize when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
