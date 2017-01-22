document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("scroll", dealHeadShow, false);
  if (/\(i[^;]+;( U;)? CPU.+Mac OS X/.test(navigator.userAgent)) {
    document.addEventListener("touchmove", dealHeadShow, false);
  }
}, false);

function dealHeadShow() {
  if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
    document.getElementById("J_header").setAttribute('class', 'header-menu header-menu-overflow');
  } else {
    document.getElementById("J_header").setAttribute('class', 'header-menu header-menu-top');
  }
}
