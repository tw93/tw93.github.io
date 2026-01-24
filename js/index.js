/**
 * Created by Tw93 on 2017/1/31.
 */
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

document.addEventListener("DOMContentLoaded", function () {

  var zoomImgs = Array.prototype.slice.call(document.querySelectorAll('.entry-content img'));
  if (zoomImgs.length > 0) {

      var stripOssProcess = function (url) {
        if (!url || typeof url !== 'string' || url.indexOf('x-oss-process=') === -1) return url;
        var hashIndex = url.indexOf('#');
        var hash = hashIndex >= 0 ? url.slice(hashIndex) : '';
        var beforeHash = hashIndex >= 0 ? url.slice(0, hashIndex) : url;
        var queryIndex = beforeHash.indexOf('?');
        if (queryIndex === -1) return url;
        var base = beforeHash.slice(0, queryIndex);
        var query = beforeHash.slice(queryIndex + 1);
        var params = query
          .split('&')
          .filter(function (param) {
            return param && param.indexOf('x-oss-process=') !== 0;
          });
        var cleaned = params.length ? base + '?' + params.join('&') : base;
        return cleaned + hash;
      };

      var getOriginalSrc = function (img) {
        var dataSrc = img.getAttribute('data-pswp-src');
        if (dataSrc) return dataSrc;
        var src = img.getAttribute('data-src') || img.currentSrc || img.src;
        return stripOssProcess(src);
      };

      var loadCSS = function (href) {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
      };

      loadCSS("/css/photoswipe.css");

      loadScript("/js/photoswipe.umd.min.js", function () {
        loadScript("/js/photoswipe-lightbox.umd.min.js", function () {
          if (typeof PhotoSwipeLightbox === 'undefined' || typeof PhotoSwipe === 'undefined') return;

          var lightbox = new PhotoSwipeLightbox({
            gallery: '.entry-content',
            children: 'img',
            pswpModule: PhotoSwipe,
            bgOpacity: 0.9,
            padding: { top: 20, bottom: 20, left: 20, right: 20 },
            mainClass: 'pswp--custom-bg pswp--minimal',
          });

          lightbox.addFilter('domItemData', function (itemData, element) {
            if (!element) return itemData;

            // Exclude small icons or specific excluded classes
            if (element.classList.contains('emoji') || element.classList.contains('no-zoom')) return null;

            var src = getOriginalSrc(element);

            // Filter out SVGs or other unwanted types if strictly needed (weekly does it)
            if (src && (src.indexOf('.svg') > -1 || src.indexOf('.gif') > -1)) {
                 // return null; // Removed strict filter to allow zooming gifs/svgs if desired, or keep to match weekly
            }

            // If we can't determine dimensions, PhotoSwipe v5 might struggle or just show it.
            // We can try to get natural dimensions if loaded, or simple attributes.
            // Ideally we need actual width/height.
            // Weekly uses naturalWidth || 1000.

            itemData.src = src;
            itemData.w = Number(element.getAttribute('data-width')) || element.naturalWidth || window.innerWidth;
            itemData.h = Number(element.getAttribute('data-height')) || element.naturalHeight || window.innerHeight;
            itemData.msrc = element.src;

            return itemData;
          });

          lightbox.on('uiRegister', function () {
            lightbox.pswp.ui.registerElement({
              name: 'custom-caption',
              order: 9,
              isButton: false,
              appendTo: 'root',
              html: 'Caption text',
              onInit: (el, pswp) => {
                pswp.on('change', () => {
                  const currSlideElement = pswp.currSlide.data.element;
                  let captionText = '';
                  if (currSlideElement) {
                    captionText = currSlideElement.getAttribute('alt') || '';
                  }
                  el.innerHTML = captionText ? '<div class="pswp-caption-content">' + captionText + '</div>' : '';
                });
              },
            });
          });

          lightbox.init();
        });
      });
  }

  addCodeCopy();

  if (!isPC()) {
    return;
  }
  var beforeScrollTop = document.documentElement.scrollTop;
  document.addEventListener("scroll", function () {
    var afterScrollTop = document.documentElement.scrollTop;
    var delta = afterScrollTop - beforeScrollTop;
    document.getElementById("J_header").setAttribute('class', (delta > 0 && afterScrollTop > 0) ? 'header-menu header-menu-overflow' : 'header-menu');
    beforeScrollTop = afterScrollTop;
  });

  var width = window.innerWidth;
  var height = 260;

  var canvas = document.getElementById('J_firework_canvas');
  if (!canvas) return; // Guard against missing canvas

  canvas.width = width;
  canvas.height = height;
  var ctx = canvas.getContext('2d', { alpha: true });

  var points = [];
  var isAnimating = true;

  var mouse = {
    x: 0,
    y: 9999,
  };

  // Pause animation when canvas is not visible
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        isAnimating = entry.isIntersecting;
      });
    }, { threshold: 0 });
    observer.observe(canvas);
  }

  function Point(x, y, speed, width, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.color = color;
    this.alpha = Math.random() - 0.1;
    this.speed = speed;

    this.active = true;

    this.physx = function () {
      this.y += this.speed;
      if (this.y > canvas.height) this.kill();
    };

    this.kill = function () {
      points.splice(points.indexOf(this), 1);
      this.active = false;
    };

    this.draw = function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2, true);
      ctx.fillStyle = this.color;
      ctx.lineWidth = this.width;

      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fill();
      ctx.restore();
    };
  };

  function drawFirework() {
    if (!isAnimating) {
      requestAnimationFrame(drawFirework);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Only create new points if mouse is in active area
    if (mouse.y < height) {
      for (var i = 0; i < 5; i++) {
        var posX = mouse.x + Math.random() * 10;
        var posY = mouse.y + Math.random() * 10;
        points.push(new Point(posX, posY, 1 + Math.random() * 2, 5, 'white'));
      }
    }

    for (var i in points) {
      if (points[i].active) {
        points[i].draw();
        points[i].physx();
      }
    }
    requestAnimationFrame(drawFirework);
  }

  // Check for prefers-reduced-motion
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion) {
    drawFirework();
  }

  document.onmousemove = function (e) {
    mouse.x = e.pageX;
    mouse.y = e.pageY;
  }
  document.onmouseout = function (e) {
    mouse.x = 0;
    mouse.y = 9999;
  }


  var qrTextEl = document.getElementById('J_qr_text');
  var isShowQr = qrTextEl && qrTextEl.offsetParent;
  isShowQr && loadScript('https://gw.alipayobjects.com/os/k/qa/qrcode.min.js', function () {
    QRCode && new QRCode(document.getElementById("J_qr_code"), {
      width: 128,
      height: 128,
      useSVG: true,
      text: window.location.href,
      correctLevel: QRCode.CorrectLevel.L
    });
  });

}, false);

function isPC() {
  var userAgentInfo = navigator.userAgent;
  var Agents = ["Android", "iPhone", "Windows Phone", "iPad", "iPod"];
  var flag = true;
  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false;
      break;
    }
  }
  return flag;
}

function loadScript(url, callback) {
  var script = document.createElement("script")
  script.type = "text/javascript";
  if (script.readyState) {
    script.onreadystatechange = function () {
      if (script.readyState == "loaded" ||
        script.readyState == "complete") {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {
    script.onload = function () {
      callback();
    };
  }
  script.src = url;
  document.body.appendChild(script);
}

function addCodeCopy() {
  var highlights = document.querySelectorAll('.highlighter-rouge > div.highlight');
  highlights.forEach(function (highlight) {
    if (highlight.querySelector('.highlight-header')) return;

    var header = document.createElement('div');
    header.className = 'highlight-header';
    header.innerHTML = '<div class="highlight-dots"><span class="dot-red"></span><span class="dot-yellow"></span><span class="dot-green"></span></div><span class="copy-btn">Copy</span>';
    highlight.insertBefore(header, highlight.firstChild);

    var copyBtn = header.querySelector('.copy-btn');
    copyBtn.addEventListener('click', function () {
      var code = highlight.querySelector('pre').innerText;
      navigator.clipboard.writeText(code).then(function () {
        copyBtn.textContent = '✓ Copied';
        copyBtn.style.color = '#27c93f';
        setTimeout(function () {
          copyBtn.textContent = 'Copy';
          copyBtn.style.color = '';
        }, 2000);
      })["catch"](function (err) {
        console.error('Failed to copy: ', err);
        copyBtn.textContent = '✗ Failed';
        setTimeout(function () {
          copyBtn.textContent = 'Copy';
        }, 2000);
      });
    });
  });
}
