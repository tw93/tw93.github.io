// /notes/: lightbox per note, and on the index page search, filters, sorting
// and endless scrolling over /notes/data.json. The first 30 notes arrive as
// HTML, so the data is fetched only once someone searches, filters or scrolls
// past them. Every note's HTML comes from _plugins/notes.rb, never built here.
(function () {
  var PAGE = 30;
  var list = document.getElementById('J_notes');
  if (!list) return;
  var assetV = window.ASSET_VERSION ? '?v=' + window.ASSET_VERSION : '';

  // Lightbox: the photos of one note form one gallery.
  var lightbox = null;
  var lightboxState = 'idle';
  var pending = null;

  var loadLightbox = function () {
    if (lightboxState !== 'idle') return;
    lightboxState = 'loading';
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/css/photoswipe.css' + assetV;
    document.head.appendChild(link);
    loadScript('/js/photoswipe.umd.min.js' + assetV, function () {
      loadScript('/js/photoswipe-lightbox.umd.min.js' + assetV, function () {
        if (typeof PhotoSwipeLightbox === 'undefined') return;
        lightbox = new PhotoSwipeLightbox({
          pswpModule: PhotoSwipe,
          bgOpacity: 0.9,
          padding: { top: 20, bottom: 20, left: 20, right: 20 },
          mainClass: 'pswp--custom-bg pswp--minimal',
        });
        var sample = document.querySelector('.note-img');
        keepLightboxCorners(lightbox, sample ? parseFloat(getComputedStyle(sample).borderTopLeftRadius) || 0 : 0);
        lightbox.init();
        lightboxState = 'ready';
        if (pending) open(pending);
      });
    });
  };

  var open = function (img) {
    var imgs = Array.prototype.slice.call(img.closest('.note').querySelectorAll('.note-img'));
    var items = imgs.map(function (el) {
      return {
        src: el.getAttribute('data-pswp-src'),
        msrc: el.currentSrc || el.src,
        w: Number(el.getAttribute('data-width')),
        h: Number(el.getAttribute('data-height')),
        element: el,
        thumbCropped: !el.closest('.note-media-1'),
      };
    });
    lightbox.loadAndOpen(imgs.indexOf(img), items);
  };

  list.addEventListener('pointerover', function (e) {
    if (e.target.classList && e.target.classList.contains('note-img')) loadLightbox();
  });
  // Folded long notes open in place; the link to the note's page is the
  // fallback without JS.
  list.addEventListener('click', function (e) {
    var unfold = e.target.closest && e.target.closest('.note-unfold');
    if (!unfold) return;
    e.preventDefault();
    unfold.closest('.note').classList.remove('note-fold');
    unfold.remove();
  });

  list.addEventListener('click', function (e) {
    var img = e.target.closest && e.target.closest('.note-img');
    if (!img) return;
    e.preventDefault();
    if (lightboxState === 'ready') return open(img);
    pending = img;
    loadLightbox();
  });

  var bar = document.getElementById('J_notes_bar');
  if (!bar) return;

  var input = document.getElementById('J_notes_q');
  var year = document.getElementById('J_notes_y');
  var sort = document.getElementById('J_notes_sort');
  var status = document.getElementById('J_notes_status');
  var more = document.getElementById('J_notes_more');
  var state = { q: '', c: '', t: '', y: '', sort: '' };
  var data = null;
  var loading = null;
  var results = [];
  var computed = false;
  var shown = 0;

  var params = new URLSearchParams(location.search);
  Object.keys(state).forEach(function (key) { state[key] = params.get(key) || ''; });
  if (params.get('tag')) state.q = '#' + params.get('tag');

  var decode = function (html) {
    return html.replace(/<[^>]+>/g, ' ')
      .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&')
      .toLowerCase();
  };

  var load = function () {
    if (!loading) {
      loading = fetch('/notes/data.json' + assetV)
        .then(function (res) { return res.json(); })
        .then(function (items) {
          items.forEach(function (item) {
            item.s = decode(item.h);
            item.y = String(new Date(item.t * 1000 + 8 * 3600 * 1000).getUTCFullYear());
          });
          data = items;
          return items;
        });
    }
    return loading;
  };

  var filtering = function () {
    return !!(state.q.trim() || state.c || state.t || state.y || state.sort);
  };

  var compute = function () {
    var terms = state.q.toLowerCase().split(/\s+/).filter(Boolean);
    results = data.filter(function (item) {
      if (state.c && item.c !== state.c) return false;
      if (state.t && item.f.indexOf(state.t) === -1) return false;
      if (state.y && item.y !== state.y) return false;
      for (var i = 0; i < terms.length; i++) if (item.s.indexOf(terms[i]) === -1) return false;
      return true;
    });
    var key = { like: 'l', reply: 'r', bookmark: 'b' }[state.sort];
    if (key) results.sort(function (a, b) { return b[key] - a[key] || b.t - a.t; });
    else if (state.sort === 'old') results.sort(function (a, b) { return a.t - b.t; });
    computed = true;
  };

  var highlight = function (root, terms) {
    if (!terms.length) return;
    var pattern = new RegExp(terms.map(function (t) { return t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).join('|'), 'gi');
    root.querySelectorAll('.note-body').forEach(function (body) {
      var walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT);
      var nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      // Built from text nodes, so a term like "&" never lands inside an entity.
      nodes.forEach(function (node) {
        var text = node.nodeValue;
        pattern.lastIndex = 0;
        if (!pattern.test(text)) return;
        pattern.lastIndex = 0;
        var frag = document.createDocumentFragment();
        var last = 0;
        var match;
        while ((match = pattern.exec(text))) {
          frag.appendChild(document.createTextNode(text.slice(last, match.index)));
          var mark = document.createElement('mark');
          mark.textContent = match[0];
          frag.appendChild(mark);
          last = match.index + match[0].length;
        }
        frag.appendChild(document.createTextNode(text.slice(last)));
        node.parentNode.replaceChild(frag, node);
      });
    });
  };

  var renderMore = function () {
    var next = results.slice(shown, shown + PAGE);
    if (!next.length) return false;
    var holder = document.createElement('div');
    holder.innerHTML = next.map(function (item) { return item.h; }).join('');
    var terms = state.q.toLowerCase().split(/\s+/).filter(Boolean);
    if (terms.length) {
      // A match may sit in the folded part, so searched notes open in full.
      holder.querySelectorAll('.note-fold').forEach(function (note) { note.classList.remove('note-fold'); });
      holder.querySelectorAll('.note-unfold').forEach(function (link) { link.remove(); });
    }
    highlight(holder, terms);
    while (holder.firstChild) list.appendChild(holder.firstChild);
    shown += next.length;
    return true;
  };

  var syncUrl = function () {
    var query = new URLSearchParams();
    Object.keys(state).forEach(function (key) { if (state[key]) query.set(key, state[key]); });
    var search = query.toString();
    history.replaceState(null, '', location.pathname + (search ? '?' + search : ''));
  };

  var syncControls = function () {
    input.value = state.q;
    year.value = state.y;
    sort.value = state.sort;
    bar.querySelectorAll('.notes-chip-group').forEach(function (group) {
      var key = group.getAttribute('data-key');
      group.querySelectorAll('button').forEach(function (button) {
        button.setAttribute('aria-pressed', String(button.getAttribute('data-value') === state[key]));
      });
    });
  };

  var apply = function () {
    syncUrl();
    syncControls();
    load().then(function () {
      compute();
      list.innerHTML = '';
      shown = 0;
      renderMore();
      observer.unobserve(sentinel);
      observer.observe(sentinel);
      if (more) more.hidden = true;
      if (filtering()) {
        status.hidden = false;
        status.textContent = results.length ? '找到 ' + results.length + ' 条' : '没有找到相关的 Notes';
      } else {
        status.hidden = true;
      }
    });
  };

  var timer = null;
  input.addEventListener('input', function () {
    clearTimeout(timer);
    timer = setTimeout(function () { state.q = input.value; apply(); }, 150);
  });
  input.addEventListener('focus', load, { once: true });
  year.addEventListener('change', function () { state.y = year.value; apply(); });
  sort.addEventListener('change', function () { state.sort = sort.value; apply(); });
  bar.addEventListener('click', function (e) {
    var button = e.target.closest('button');
    if (!button) return;
    var key = button.parentNode.getAttribute('data-key');
    var value = button.getAttribute('data-value');
    state[key] = state[key] === value && key === 't' ? '' : value;
    apply();
  });

  // Category and hashtag links inside notes filter in place.
  list.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('a.note-cat, a.note-tag');
    if (!link) return;
    e.preventDefault();
    var url = new URL(link.href);
    state = { q: url.searchParams.get('q') || '', c: url.searchParams.get('c') || '', t: '', y: '', sort: '' };
    apply();
    bar.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Endless scrolling: before any filter, continue after the 30 notes the page
  // shipped with; the "更早的 Notes" link stays as the fallback without JS.
  var sentinel = document.createElement('div');
  sentinel.className = 'notes-sentinel';
  list.parentNode.insertBefore(sentinel, list.nextSibling);
  // Re-observing after each batch makes the observer report again while the
  // sentinel is still within reach, so a tall screen keeps filling.
  var observer = new IntersectionObserver(function (entries) {
    if (!entries[0].isIntersecting) return;
    // Stops once every result is shown; apply() re-arms it for a new filter.
    var step = function () {
      observer.unobserve(sentinel);
      if (renderMore()) observer.observe(sentinel);
    };
    if (computed) return step();
    load().then(function () {
      if (computed) return step();
      compute();
      shown = list.querySelectorAll('.note').length;
      if (more) more.hidden = true;
      step();
    });
  }, { rootMargin: '800px 0px' });
  observer.observe(sentinel);

  syncControls();
  if (filtering()) apply();
})();
