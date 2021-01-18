function onStart() {
	hljs.initHighlightingOnLoad();
	configureBreadcrumb();
	copyPreCodeOnClick();
	configureLinks();
}

function configureLinks() {
	for (let hEl of $("h1, h2, h3, h4, h5, h6")) {
		const id = hEl.getAttribute("id");
		if (id) {
			const icon = htmlToElement('<a href="#" class="hover-link">🔗</a>');
			hEl.appendChild(icon);
			icon.setAttribute("href", "#" + id);
			hEl.classList.add("has-hover-link");
		}
	}
}

function configureBreadcrumb() {
  var currentUrl = location.pathname;
  var currentPage = currentUrl.substring(currentUrl.lastIndexOf("/") + 1);
  var parentUrl = currentUrl.substring(0, currentUrl.lastIndexOf("/"));
  var currentTitle = currentPage.substring(0, currentPage.lastIndexOf("."));
  var topicTOC = parentUrl + "/01_summary.html";
  var topicTitle = parentUrl.substring(parentUrl.lastIndexOf("/") + 1);
  if (currentTitle == "01_summary") currentTitle = "contents";
  topicTitle = topicTitle.replace(/_/g, " ");
  currentTitle = currentTitle.replace(/_/g, " ");
  var homeLink = "<a href='/index.html#topics'>Topics</a>";
  var joiner = " &rsaquo; ";
  var topicLink = "<a href='" + topicTOC + "'>" + topicTitle + "</a>";
  if (topicTitle == "today-i-learned" || topicTitle == "") {
    $id("breadcrumb").innerHTML = homeLink + joiner + "index";
  } else {
    $id("breadcrumb").innerHTML =
      homeLink + joiner + topicLink + joiner + currentTitle;
  }
}

function copyPreCodeOnClick() {
  for (let pre of $("pre")) {
    let el = htmlToElement(
      "<button class='copy-text btn btn-sm' title='copy code to clipboard'>copy</button>"
    );
    el.setAttribute("title", "Click to copy text to clipboard.");
    el.setAttribute("onclick", "copyNextElement(this);");

    let inserted = pre.parentNode.insertBefore(el, pre);

    //code.setAttribute('title', "Click to copy.");
    //code.setAttribute('onclick', "copyItemText(this);");
  }

  //for(let preOrCode of $('pre, code')) {
  for (let code of $("code")) {
    code.setAttribute("title", "Click to copy text to clipboard.");
    code.setAttribute("onclick", "copyItemText(this);");
  }

  for (let codeInPre of $("pre code")) {
    codeInPre.removeAttribute("onclick");
    codeInPre.removeAttribute("title");
  }
}

/* on start... */

function copyNextElement(item) {
  var nextElement = item.nextSibling;
  copyToClipboard(nextElement.textContent, item);
}

function copyItemText(item) {
  copyToClipboard(item.textContent, item);
}

function copyToClipboard(value, element) {
  const textArea = document.createElement("textarea");
  textArea.style.position = "absolute";
  var rect = element.getBoundingClientRect();

  // top is at current height, to avoid causing a scroll on IE/Safari.
  var top =
    rect.top +
    ((document.documentElement && document.documentElement.scrollTop) ||
      document.body.scrollTop);
  textArea.style.top = top + "px";
  textArea.style.left = "-100%"; // off screen
  textArea.style.width = "200px";
  textArea.textContent = value.trim();
  element.parentNode.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  textArea.parentNode.removeChild(textArea);
  showFloatingMessage("copied to clipboard.", element);
}

// Message will be displayed near the element and disappear soon after
function showFloatingMessage(message, element) {
  var rect = element.getBoundingClientRect();
  const tip = document.createElement("span");
  tip.innerText = message;
  tip.classList.add("floating-message");
  tip.style.position = "absolute";
  var top =
    rect.top +
    ((document.documentElement && document.documentElement.scrollTop) ||
      document.body.scrollTop);
  tip.style.top = top + "px";
  tip.style.left = rect.left + (rect.right - rect.left) / 2 + "px";
  document.body.appendChild(tip);

  // apply 'fade-message-out' to make it fade with css animation -- and then remove it altogether.
  setTimeout(function () {
    tip.classList.add("fade-message-out");
    setTimeout(function () {
      tip.parentNode.removeChild(tip);
    }, 1000);
  }, 10);
}

/* ####################### */
/* ####################### */
/* ## utility functions ## */
/* ####################### */
/*    #################    */
/*       ###########       */
/*          #####          */
/*            #            */

function htmlToElement(html) {
  var template = document.createElement("template");
  html = html.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = html;
  return template.content.firstChild;
}

function $(selector) {
  return document.querySelectorAll(selector);
}

function $id(id) {
  return document.getElementById(id);
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

// add the class of className to all elements that match the selector
function addClass(selector, className) {
  for (var _i = 0, _a = $(selector); _i < _a.length; _i++) {
    var example = _a[_i];
    example.classList.add(className);
  }
}

// remove the class className from all elements that match the selector
function removeClass(selector, className) {
  for (var _i = 0, _a = $(selector); _i < _a.length; _i++) {
    var example = _a[_i];
    example.classList.remove(className);
  }
}

// remove the class of className from all elements that have a class of className
function removeAllClass(className) {
  for (var _i = 0, _a = $("." + className); _i < _a.length; _i++) {
    var example = _a[_i];
    example.classList.remove(className);
  }
}

function htmlToElement(html) {
  var template = document.createElement("template");
  html = html.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = html;
  return template.content.firstChild;
}

/*            #            */
/*          #####          */
/*       ###########       */
/*    #################    */
/* ####################### */
/* ## utility functions ## */
/* ####################### */
/* ####################### */

onStart();