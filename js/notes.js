// /notes/: lightbox per note, and on the index page search, filters, sorting
// and endless scrolling. The first 30 notes arrive as HTML; scrolling further
// reads the month pages, and a search or filter reads /notes/index.json plus
// the /notes/html/YYYY.json years it shows. Every note's HTML comes from
// _plugins/notes.rb, never built here.
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
  var type = document.getElementById('J_notes_t');
  var sort = document.getElementById('J_notes_sort');
  var status = document.getElementById('J_notes_status');
  var more = document.getElementById('J_notes_more');
  var state = { q: '', c: '', t: '', y: '', sort: '' };
  var index = null;
  var indexLoading = null;
  var chunks = {};
  var results = [];
  var shown = 0;
  var token = 0;
  var busy = false;

  // Without a filter the next notes come from the month pages, in the order
  // the archive links list them, so scrolling never downloads the index.
  var months = Array.prototype.map.call(document.querySelectorAll('.notes-archive a'), function (a) { return a.href; });
  var monthAt = 0;
  var mode = 'months';

  var params = new URLSearchParams(location.search);
  Object.keys(state).forEach(function (key) { state[key] = params.get(key) || ''; });
  if (params.get('tag')) state.q = '#' + params.get('tag');

  var loadIndex = function () {
    if (!indexLoading) {
      indexLoading = fetch('/notes/index.json' + assetV)
        .then(function (res) { return res.json(); })
        .then(function (items) {
          items.forEach(function (item) {
            item.s = item.s.toLowerCase();
            item.y = String(new Date(item.t * 1000 + 8 * 3600 * 1000).getUTCFullYear());
          });
          index = items;
        });
    }
    return indexLoading;
  };

  var loadYear = function (y) {
    if (!chunks[y]) chunks[y] = fetch('/notes/html/' + y + '.json' + assetV).then(function (res) { return res.json(); });
    return chunks[y];
  };

  var filtering = function () {
    return !!(state.q.trim() || state.c || state.t || state.y || state.sort);
  };

  var terms = function () {
    return state.q.toLowerCase().split(/\s+/).filter(Boolean);
  };

  var compute = function () {
    var words = terms();
    results = index.filter(function (item) {
      if (state.c && item.c !== state.c) return false;
      if (state.t && item.f.indexOf(state.t) === -1) return false;
      if (state.y && item.y !== state.y) return false;
      for (var i = 0; i < words.length; i++) if (item.s.indexOf(words[i]) === -1) return false;
      return true;
    });
    var key = { like: 'l', reply: 'r', bookmark: 'b' }[state.sort];
    if (key) results.sort(function (a, b) { return b[key] - a[key] || b.t - a.t; });
    else if (state.sort === 'old') results.sort(function (a, b) { return a.t - b.t; });
  };

  var highlight = function (root, words) {
    if (!words.length) return;
    var pattern = new RegExp(words.map(function (t) { return t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).join('|'), 'gi');
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

  // Resolves true while there may be more to show. A batch started before the
  // filter changed is dropped, so a slow response never lands in new results.
  var renderMore = function () {
    var mine = token;
    if (mode === 'months') {
      if (monthAt >= months.length) return Promise.resolve(false);
      return fetch(months[monthAt++]).then(function (res) { return res.text(); }).then(function (html) {
        if (mine !== token) return false;
        var page = new DOMParser().parseFromString(html, 'text/html');
        page.querySelectorAll('#J_notes > .note').forEach(function (note) {
          if (!document.getElementById(note.id)) list.appendChild(document.adoptNode(note));
        });
        return true;
      });
    }
    var next = results.slice(shown, shown + PAGE);
    if (!next.length) return Promise.resolve(false);
    var years = next.map(function (item) { return item.y; }).filter(function (y, i, all) { return all.indexOf(y) === i; });
    return Promise.all(years.map(loadYear)).then(function (maps) {
      if (mine !== token) return false;
      var html = Object.assign.apply(null, [{}].concat(maps));
      var holder = document.createElement('div');
      holder.innerHTML = next.map(function (item) { return html[item.i] || ''; }).join('');
      var words = terms();
      if (words.length) {
        // A match may sit in the folded part, so searched notes open in full.
        holder.querySelectorAll('.note-fold').forEach(function (note) { note.classList.remove('note-fold'); });
        holder.querySelectorAll('.note-unfold').forEach(function (link) { link.remove(); });
      }
      highlight(holder, words);
      while (holder.firstChild) list.appendChild(holder.firstChild);
      shown += next.length;
      return true;
    });
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
    type.value = state.t;
    sort.value = state.sort;
    bar.querySelectorAll('.notes-chip-group button').forEach(function (button) {
      button.setAttribute('aria-pressed', String(button.getAttribute('data-value') === state.c));
    });
  };

  // Endless scrolling. Re-observing after each batch makes the observer report
  // again while the sentinel is still within reach, so a tall screen keeps
  // filling; it stops once nothing is left, and apply() re-arms it.
  var sentinel = document.createElement('div');
  sentinel.className = 'notes-sentinel';
  list.parentNode.insertBefore(sentinel, list.nextSibling);
  var step = function () {
    if (busy) return;
    busy = true;
    var mine = token;
    if (more) more.hidden = true;
    observer.unobserve(sentinel);
    renderMore().then(function (left) {
      if (mine !== token) return;
      busy = false;
      if (left) observer.observe(sentinel);
    }, function () { if (mine === token) busy = false; });
  };
  var observer = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) step();
  }, { rootMargin: '800px 0px' });

  var apply = function () {
    var mine = ++token;
    mode = 'results';
    busy = false;
    syncUrl();
    syncControls();
    loadIndex().then(function () {
      if (mine !== token) return;
      compute();
      list.innerHTML = '';
      shown = 0;
      status.hidden = !filtering();
      status.textContent = results.length ? '找到 ' + results.length + ' 条' : '没有找到相关的 Notes';
      step();
    });
  };

  var timer = null;
  input.addEventListener('input', function () {
    clearTimeout(timer);
    timer = setTimeout(function () { state.q = input.value; apply(); }, 150);
  });
  // The index loads when someone reaches for the bar, not on every visit.
  ['pointerover', 'focusin', 'touchstart'].forEach(function (name) {
    bar.addEventListener(name, loadIndex, { once: true, passive: true });
  });
  year.addEventListener('change', function () { state.y = year.value; apply(); });
  type.addEventListener('change', function () { state.t = type.value; apply(); });
  sort.addEventListener('change', function () { state.sort = sort.value; apply(); });
  bar.addEventListener('click', function (e) {
    var button = e.target.closest('button');
    if (!button) return;
    state.c = button.getAttribute('data-value');
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

  syncControls();
  if (filtering()) apply();
  else observer.observe(sentinel);
})();
