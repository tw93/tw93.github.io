
document.addEventListener("DOMContentLoaded", function(){
  window.onscroll = function () {
    if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) {
      document.getElementById("J_header").setAttribute('class', 'header-menu header-menu-overflow');
    } else {
      document.getElementById("J_header").setAttribute('class', 'header-menu header-menu-top');
    }
  }
});
