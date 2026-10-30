// /notes/: lightbox per note, and on the index page search, filters, sorting
// and endless scrolling. The first 30 notes arrive as HTML; scrolling further
// reads the month pages, and a search or filter reads /notes/index.json plus
// the /notes/html/YYYY-MM.json months it shows; /en/notes/ reads the same
// files under its own data-base. Every note's HTML comes from
// _plugins/notes.rb, never built here.
(function () {
  var PAGE = 30;
  var FIRST = 10;
  var list = document.getElementById('J_notes');
  if (!list) return;
  var assetV = window.ASSET_VERSION ? '?v=' + window.ASSET_VERSION : '';
  var base = list.getAttribute('data-base') || '/notes/';

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
          // A tap anywhere closes on phones, as a click on the backdrop does
          // with a mouse; the default only toggles the controls.
          tapAction: 'close',
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
    var note = unfold.closest('.note');
    note.classList.remove('note-fold');
    note.querySelectorAll('.note-fold-mark').forEach(function (mark) { mark.remove(); });
  });

  list.addEventListener('click', function (e) {
    var img = e.target.closest && e.target.closest('.note-img');
    if (!img) return;
    e.preventDefault();
    if (lightboxState === 'ready') return open(img);
    pending = img;
    loadLightbox();
  });

  // GIFs loop while on screen and stop once scrolled past. A video starts on
  // the first click on its poster, and starting one pauses whichever one was
  // playing. The poster is an <img> that hides once frames arrive.
  var clips = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) entry.target.play().catch(function () {});
      else entry.target.pause();
    });
  }, { threshold: 0.5 });
  var watch = function () {
    list.querySelectorAll('.note-gif video').forEach(function (clip) { clips.observe(clip); });
  };
  watch();
  list.addEventListener('click', function (e) {
    var player = e.target.closest && e.target.closest('.note-player:not(.note-gif):not(.is-playing)');
    if (!player) return;
    e.preventDefault();
    player.classList.add('is-loading');
    player.querySelector('video').play().catch(function () {
      player.classList.remove('is-loading');
    });
  });
  list.addEventListener('playing', function (e) {
    var player = e.target.closest('.note-player');
    if (player) player.classList.replace('is-loading', 'is-playing') || player.classList.add('is-playing');
  }, true);
  list.addEventListener('error', function (e) {
    var player = e.target.closest && e.target.closest('.note-player');
    if (player) player.classList.remove('is-loading');
    // A resized copy missing on R2 falls back to the original it was made from.
    var img = e.target;
    var sized = img.tagName === 'IMG' && /\/notes\/\d+\/([\w-]+)\.webp$/.exec(img.currentSrc || img.src);
    if (!sized) return;
    img.removeAttribute('srcset');
    img.src = 'https://cdn.tw93.fun/notes/' + sized[1] + '.jpg';
  }, true);
  list.addEventListener('play', function (e) {
    if (e.target.closest('.note-gif')) return;
    list.querySelectorAll('.note-player:not(.note-gif) video').forEach(function (video) {
      if (video !== e.target) video.pause();
    });
  }, true);

  var bar = document.getElementById('J_notes_bar');
  if (!bar) return;

  var input = document.getElementById('J_notes_q');
  var cat = document.getElementById('J_notes_c');
  var year = document.getElementById('J_notes_y');
  var type = document.getElementById('J_notes_t');
  var sort = document.getElementById('J_notes_sort');
  var find = document.getElementById('J_notes_find');
  var more = document.getElementById('J_notes_more');
  var olderText = more ? more.textContent : '';
  var empty = document.getElementById('J_notes_empty');
  var state = { q: '', c: '', t: '', y: '', sort: '' };
  var index = null;
  var indexLoading = null;
  var textLoading = null;
  var chunks = {};
  var results = [];
  var shown = 0;
  var token = 0;
  var busy = false;
  var retryFilter = false;
  // A new filter keeps the old notes on screen, dimmed if the wait runs
  // long, until its first batch is ready to replace them, so the archive
  // below never moves up into the gap.
  var fresh = false;
  var waitTimer = null;
  var settle = function () {
    fresh = false;
    clearTimeout(waitTimer);
    list.classList.remove('is-waiting');
    list.innerHTML = '';
    list.hidden = false;
    list.parentElement.classList.remove('is-initial');
    if (empty) empty.hidden = results.length > 0;
  };
  // Endless scrolling stops after this many notes so an old phone's memory
  // stays flat; past it the link opens the next month page, or loads the next
  // results when filtering.
  var LIMIT = 240;
  var limit = LIMIT;

  // Without a filter the next notes come from the month pages, in the order
  // the archive links list them, so scrolling never downloads the index.
  var months = Array.prototype.map.call(document.querySelectorAll('.notes-archive a'), function (a) { return a.href; });
  var monthAt = 0;
  var mode = 'months';

  var params = new URLSearchParams(location.search);
  Object.keys(state).forEach(function (key) { state[key] = params.get(key) || ''; });
  if ((params.get('tag') || '').trim()) state.q = '#' + params.get('tag').trim();

  var loadIndex = function () {
    if (!indexLoading) {
      indexLoading = fetch(base + 'index.json' + assetV)
        .then(function (res) {
          if (!res.ok) throw new Error('Notes request failed');
          return res.json();
        })
        .then(function (items) {
          items.forEach(function (item) {
            var day = new Date(item.t * 1000 + 8 * 3600 * 1000);
            var month = day.getUTCMonth() + 1;
            item.y = String(day.getUTCFullYear());
            item.m = item.y + '-' + (month < 10 ? '0' : '') + month;
          });
          index = items;
        });
      indexLoading.catch(function () { indexLoading = null; });
    }
    return indexLoading;
  };

  // The text a search matches, one string per index entry in the same order.
  // A prefetch asks at low priority, so a category tapped meanwhile is not
  // stuck behind it.
  var loadText = function (low) {
    if (!textLoading) {
      textLoading = Promise.all([loadIndex(), fetch(base + 'search.json' + assetV, low === true ? { priority: 'low' } : {}).then(function (res) {
          if (!res.ok) throw new Error('Notes request failed');
          return res.json();
        })])
        .then(function (both) {
          var text = both[1];
          index.forEach(function (item, i) { item.s = (text[i] || '').toLowerCase(); });
        });
      textLoading.catch(function () { textLoading = null; });
    }
    return textLoading;
  };

  var loadMonth = function (m) {
    if (!chunks[m]) {
      chunks[m] = fetch(base + 'html/' + m + '.json' + assetV).then(function (res) {
          if (!res.ok) throw new Error('Notes request failed');
          return res.json();
        });
      chunks[m].catch(function () { delete chunks[m]; });
    }
    return chunks[m];
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
      return fetch(months[monthAt]).then(function (res) {
        if (!res.ok) throw new Error('Month request failed');
        return res.text();
      }).then(function (html) {
        if (mine !== token) return false;
        var page = new DOMParser().parseFromString(html, 'text/html');
        if (!page.querySelector('#J_notes')) throw new Error('Invalid month page');
        page.querySelectorAll('#J_notes > .note').forEach(function (note) {
          if (!document.getElementById(note.id)) list.appendChild(document.adoptNode(note));
        });
        monthAt += 1;
        watch();
        return true;
      });
    }
    // A new filter's first batch is small, so the first screen waits on the
    // fewest month files; the sentinel fetches the rest right after.
    var next = results.slice(shown, shown + (fresh ? FIRST : PAGE));
    if (!next.length) {
      if (fresh) settle();
      return Promise.resolve(false);
    }
    var keys = next.map(function (item) { return item.m; }).filter(function (m, i, all) { return all.indexOf(m) === i; });
    return Promise.all(keys.map(loadMonth)).then(function (maps) {
      if (mine !== token) return false;
      var html = Object.assign.apply(null, [{}].concat(maps));
      var holder = document.createElement('div');
      holder.innerHTML = next.map(function (item) { return html[item.i] || ''; }).join('');
      var words = terms();
      if (words.length) {
        // A match may sit in the folded part, so searched notes open in full.
        holder.querySelectorAll('.note-fold').forEach(function (note) { note.classList.remove('note-fold'); });
        holder.querySelectorAll('.note-fold-mark').forEach(function (mark) { mark.remove(); });
      }
      highlight(holder, words);
      if (fresh) settle();
      while (holder.firstChild) list.appendChild(holder.firstChild);
      watch();
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

  // A menu is as wide as the option it shows, so its chevron sits right after
  // the word instead of after the longest option.
  var ruler = document.createElement('span');
  ruler.className = 'notes-ruler';
  bar.appendChild(ruler);
  var fit = function () {
    [cat, year, type, sort].forEach(function (select) {
      ruler.textContent = select.options[select.selectedIndex].text;
      select.style.width = ruler.offsetWidth + 18 + 'px';
    });
  };
  var searching = function (on) {
    bar.classList.toggle('is-searching', on);
    find.setAttribute('aria-expanded', String(on));
  };

  var syncControls = function () {
    input.value = state.q;
    if (state.q.trim()) searching(true);
    [[cat, 'c'], [year, 'y'], [type, 't'], [sort, 'sort']].forEach(function (entry) {
      var select = entry[0], key = entry[1];
      select.value = state[key];
      if (select.selectedIndex < 0) select.value = '';
      state[key] = select.value;
    });
    fit();
  };

  // Endless scrolling. Re-observing after each batch makes the observer report
  // again while the sentinel is still within reach, so a tall screen keeps
  // filling; it stops once nothing is left, and apply() re-arms it.
  var sentinel = document.createElement('div');
  sentinel.className = 'notes-sentinel';
  list.parentNode.insertBefore(sentinel, list.nextSibling);
  var failedFilter = function () {
    retryFilter = true;
    clearTimeout(waitTimer);
    list.classList.remove('is-waiting');
    if (list.parentElement.classList.contains('is-initial')) list.hidden = true;
    if (more) {
      more.textContent = more.getAttribute('data-retry');
      more.href = location.href;
      more.hidden = false;
    }
  };
  var step = function () {
    if (busy) return;
    busy = true;
    var mine = token;
    if (more) more.hidden = true;
    observer.unobserve(sentinel);
    renderMore().then(function (left) {
      if (mine !== token) return;
      busy = false;
      if (!left) return;
      if (more && list.children.length >= limit && (mode === 'results' ? shown < results.length : months[monthAt])) {
        more.textContent = mode === 'months' ? olderText : more.getAttribute('data-more');
        more.href = mode === 'months' ? months[monthAt] : '#';
        more.hidden = false;
        return;
      }
      observer.observe(sentinel);
    }, function () {
      if (mine !== token) return;
      busy = false;
      if (fresh) { failedFilter(); return; }
      clearTimeout(waitTimer);
      list.classList.remove('is-waiting');
      if (more) {
        more.textContent = mode === 'months' ? olderText : more.getAttribute('data-more');
        more.href = mode === 'months' ? months[monthAt] : '#';
        more.hidden = false;
      }
    });
  };
  var observer = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) step();
  }, { rootMargin: '800px 0px' });

  if (more) more.addEventListener('click', function (e) {
    if (mode !== 'results') return;
    e.preventDefault();
    if (retryFilter) { apply(); return; }
    limit = list.children.length + LIMIT;
    step();
  });

  var apply = function () {
    var mine = ++token;
    limit = LIMIT;
    mode = 'results';
    busy = false;
    retryFilter = false;
    if (more) more.hidden = true;
    syncControls();
    syncUrl();
    // Until the new results are in, scrolling must not load more of the old.
    observer.unobserve(sentinel);
    clearTimeout(waitTimer);
    waitTimer = setTimeout(function () { list.classList.add('is-waiting'); }, 450);
    (terms().length ? loadText() : loadIndex()).then(function () {
      if (mine !== token) return;
      compute();
      shown = 0;
      fresh = true;
      step();
    }, function () {
      if (mine !== token) return;
      failedFilter();
    });
  };

  var timer = null;
  input.addEventListener('input', function () {
    clearTimeout(timer);
    timer = setTimeout(function () { state.q = input.value; apply(); }, 150);
  });
  // The small index loads once the page is idle, so a category answers at
  // once even on a phone, where the tap itself is the first sign of intent.
  // The search text, about 360KB, follows while idle on desktop; a phone
  // waits until someone reaches for the search field, to spare its data.
  var idle = window.requestIdleCallback || function (fn) { setTimeout(fn, 1200); };
  var desktop = window.matchMedia && matchMedia('(pointer: fine)').matches;
  var preload = function () {
    idle(function () {
      loadIndex().then(function () { if (desktop) idle(function () { loadText(true).catch(function () {}); }); }, function () {});
    });
  };
  if (document.readyState === 'complete') preload();
  else window.addEventListener('load', preload, { once: true });
  ['pointerover', 'focusin', 'touchstart'].forEach(function (name) {
    bar.addEventListener(name, function () { loadIndex().catch(function () {}); }, { once: true, passive: true });
    find.addEventListener(name, function () { loadText().catch(function () {}); }, { once: true, passive: true });
  });
  cat.addEventListener('change', function () { state.c = cat.value; fit(); apply(); });
  year.addEventListener('change', function () { state.y = year.value; fit(); apply(); });
  type.addEventListener('change', function () { state.t = type.value; fit(); apply(); });
  sort.addEventListener('change', function () { state.sort = sort.value; fit(); apply(); });
  if (document.fonts) document.fonts.ready.then(fit);
  var dropQuery = function () {
    clearTimeout(timer);
    input.value = '';
    if (state.q) {
      state.q = '';
      apply();
    }
  };
  // The icon opens the field and closes it again, as Escape does, dropping
  // its words so what is shown always matches it.
  var tapping = false;
  find.addEventListener('pointerdown', function () { tapping = true; });
  find.addEventListener('click', function () {
    tapping = false;
    if (!bar.classList.contains('is-searching')) {
      searching(true);
      input.focus();
      return;
    }
    searching(false);
    dropQuery();
  });
  // An empty field folds away once attention leaves it, unless that was a
  // tap on the icon, which closes it itself. A field with words stays, since
  // they still decide what the list shows.
  input.addEventListener('blur', function () {
    setTimeout(function () {
      if (!tapping && !input.value && document.activeElement !== input) searching(false);
    }, 0);
  });
  input.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    searching(false);
    dropQuery();
    find.focus();
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
  syncUrl();
  if (filtering()) apply();
  else observer.observe(sentinel);
})();
