document.addEventListener("DOMContentLoaded", function () {
  if (/\(i[^;]+;( U;)? CPU.+Mac OS X/.test(navigator.userAgent)) {
    document.addEventListener("touchmove", dealHeadShow, true);
  }
  document.addEventListener("scroll", dealHeadShow, false);
}, false);

function dealHeadShow() {
  if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
    document.getElementById("J_header").setAttribute('class', 'header-menu header-menu-overflow');
  } else {
    document.getElementById("J_header").setAttribute('class', 'header-menu header-menu-top');
  }
}
