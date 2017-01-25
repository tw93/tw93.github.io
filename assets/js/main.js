document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("scroll", _dealHeadShow);
  if (/\(i[^;]+;( U;)? CPU.+Mac OS X/.test(navigator.userAgent)) {
    var scrollInterval = null;
    document.addEventListener("touchmove", function () {
      scrollInterval = window.setInterval(_dealHeadShow, 100);
    });
    document.addEventListener("touchend", function () {
      clearInterval(scrollInterval);
    });
  }
}, false);

function _dealHeadShow() {
  if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
    document.getElementById("J_header").setAttribute('class', 'header-menu header-menu-overflow');
  } else {
    document.getElementById("J_header").setAttribute('class', 'header-menu header-menu-top');
  }
}
