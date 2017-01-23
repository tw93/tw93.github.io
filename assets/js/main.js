document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("gesturechange", dealHeadShow);
  document.addEventListener("scroll", dealHeadShow);
}, false);

function dealHeadShow() {
  if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
    document.getElementById("J_header").setAttribute('class', 'header-menu header-menu-overflow');
  } else {
    document.getElementById("J_header").setAttribute('class', 'header-menu header-menu-top');
  }
}
