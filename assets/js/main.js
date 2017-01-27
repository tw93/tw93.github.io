document.addEventListener("DOMContentLoaded", function () {
  isPC() && document.addEventListener("scroll", _dealHeadShow);
}, false);

function _dealHeadShow() {
  if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
    document.getElementById("J_header").setAttribute('class', 'header-menu header-menu-overflow');
  } else {
    document.getElementById("J_header").setAttribute('class', 'header-menu header-menu-top');
  }
}

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
