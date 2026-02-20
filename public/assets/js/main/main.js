function isCookieSet(name) {
  return document.cookie
    .split("; ")
    .some((cookie) => cookie.startsWith(name + "="));
}

function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(n) {
  let a = `; ${document.cookie}`.match(`;\\s*${n}=([^;]+)`);
  return a ? decodeURIComponent(a[1]) : "";
}

function deleteCookie(name, path = '/') {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=' + path;
}

export {
    isCookieSet,
    setCookie,
    getCookie,
    deleteCookie
}
