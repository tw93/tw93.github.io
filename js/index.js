/**
 * Created by Tw93 on 2017/1/31.
 */
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

document.addEventListener("DOMContentLoaded", function () {
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
  canvas.width = width;
  canvas.height = height;
  var ctx = canvas.getContext('2d');

  var points = [];

  var mouse = {
    x: 0,
    y: 9999,
  };

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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < 5; i++) {
      var posX = mouse.x + Math.random() * 10;
      var posY = mouse.y + Math.random() * 10;

      points.push(new Point(posX, posY, 1 + Math.random() * 2, 5, 'white'));
    }

    for (var i in points) {
      if (points[i].active) {
        points[i].draw();
        points[i].physx();
      }
    }
    requestAnimationFrame(drawFirework);
  }

  drawFirework();

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

  var zoomImgs = document.querySelectorAll('.entry-content img');
  (zoomImgs && zoomImgs.length > 0) && loadScript("https://gw.alipayobjects.com/os/k/y4/intense.min.js", function () {
    Intense && Intense(zoomImgs);
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
