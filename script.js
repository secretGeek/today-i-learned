/* on start... */
function onStart() {
  applyLanguageClassesToPre();
  hljs.initHighlightingOnLoad();
  configureBreadcrumb();
  copyPreCodeOnClick();
  let tocParent = $id("currentTitle");
  configurePermalinksAndToc(tocParent); //include TOC

  //var root = document.documentElement;
  //root.style.setProperty('--main-hue', 0)
}

function applyLanguageClassesToPre() {
  // this is the default language of code blocks in each topic category.
  // to override the default, use a fenced codeblock followed by lang, e.g.  "```plaintext"
  var topicLangs = {
    powershell: "powershell",
    net: "csharp",
    net_core_MVC: "csharp",
    "7z": "7z",
    active_directory: "active_directory",
    airtable: "powershell",
    angular: "javascript",
    "asp.net_mvc": "csharp",
    azure_devops: "sql",
    bower: "javascript",
    chocolatey: "powershell",
    cpu_analyzer: "csharp",
    csharp: "csharp",
    css: "css",
    csv: "csv",
    electron: "javascript",
    firebird: "sql",
    git: "powershell",
    go: "go",
    gulp: "javascript",
    html: "html",
    javascript: "javascript",
    jekyll: "javascript",
    jquery: "javascript",
    json: "javascript",
    linqpad: "csharp",
    linux: "bash",
    mercurial: "powershell",
    microsoft_terminal: "powershell",
    minecraft: "python",
    node: "javascript",
    npm: "javascript",
    nuget: "powershell",
    oracle: "sql",
    powershell: "powershell",
    python: "python",
    react: "javascript",
    robocopy: "powershell",
    r_language: "r",
    smallbasic: "vbnet",
    speech: "powershell",
    sqlite: "sql",
    sql_server: "sql",
    sql_server_reporting_services: "sql",
    sql_spatial: "sql",
    typescript: "javascript",
    usql: "sql",
    wordpress: "php",
    yarn: "javascript",
  };

  var currentUrl = location.pathname;
  var parentUrl = currentUrl.substring(0, currentUrl.lastIndexOf("/"));
  var topicTitle = parentUrl.substring(parentUrl.lastIndexOf("/") + 1);

  if (topicLangs[topicTitle]) {
    for (let pre of $("pre")) {
      if (
        !pre.classList.contains("plaintext") &&
        !hasClassWithPrefix(pre, "language-")
      ) {
        pre.classList.add("language-" + topicLangs[topicTitle]);
      }
    }
  }
}

function configurePermalinksAndToc(tocParent) {
  // consider: include images as indented outline/toc elements (list their caption if they have, or their title, or their alt text, or their name.)

  let toc = [];
  let tocLength = 0;
  let previousLevel = 1;
  for (let hEl of $("h1, h2, h3, h4, h5, h6")) {
    const id = hEl.getAttribute("id");
    currentLevel = parseInt(hEl.outerHTML[2]); //e.g. h1 is "1"

    if (id && currentLevel > 1) {
      if (currentLevel > previousLevel) {
        while (currentLevel > previousLevel) {
          toc.push("<ul>");
          previousLevel++;
        }
      } else if (currentLevel < previousLevel) {
        while (currentLevel < previousLevel) {
          toc.push("</li></ul>");
          previousLevel--;
        }
      } else {
        toc.push("</li>");
      }
      toc.push(`<li><a href="#${id}">${htmlEncode(hEl.innerText)}</a>`);
      tocLength++;
      previousLevel = currentLevel;

      const icon = htmlToElement('<a href="#" class="hover-link">🔗</a>');
      let iconTitle = `permalink to '${hEl.innerText}'`;
      hEl.appendChild(icon);
      icon.setAttribute("href", "#" + id);
      icon.setAttribute("title", iconTitle);
      hEl.classList.add("has-hover-link");
    }
  }
  while (currentLevel > 1) {
    toc.push("</li></ul>");
    currentLevel--;
  }
  console.log(toc.join("\n"));

  // only should toc if it contains more than 1 item
  if (tocParent != null && tocLength > 1) {
    let tocHtml = `<details class='toc'><summary>toc&hellip;</summary>${toc.join(
      "\n"
    )}</details>`;
    let title = tocParent.innerText;
    if (title != "content") {
      tocParent.appendChild(htmlToElement(tocHtml));
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
  topicTitle = topicTitle.replace(/_/g, " ");

  if (currentTitle == "01_summary") {
    currentTitle = "content";
  } else {
    currentTitle = currentTitle.replace(/_/g, " ");
    //TODO: currentTitle = 'h1' of the current page....
    var h1 = $("h1")[0];
    currentTitle = htmlEncode(h1.innerText);
  }

  var joiner = " &rsaquo; ";
  var homeLink =
    "<a href='/'><span class='emoji-silhouette'>🏠</span></a>" +
    joiner +
    "<a href='/index.html#topics'>Topics</a>";
  var topicLink = "<a href='" + topicTOC + "'>" + topicTitle + "</a>";
  if (topicTitle == "today-i-learned" || topicTitle == "") {
    homeLink =
      "<a href='/'><span class='emoji-silhouette'>🏠</span></a>" +
      joiner +
      "<span id='currentTitle'><a href='/index.html#topics'>Topics</a></span>";
    //homeLink = "<a href='/' id='currentTitle'><span class='emoji-silhouette'>🏠</span></a>";// + joiner + "";// + joiner + "<a href='/index.html#topics'>Topics</a>";
    $id("breadcrumb").innerHTML = homeLink; // + joiner + "<span id='currentTitle'>index</span>";
  } else {
    $id("breadcrumb").innerHTML =
      `<a id='linksHere' href='/wlh.html?to=${encodeURIComponent(
        currentUrl
      )}' style='float:right;vertical-align:top' title='what link here?'>wlh?</span>` +
      homeLink +
      joiner +
      topicLink +
      joiner +
      `<span id='currentTitle'>${currentTitle}</span>`;
  }
}

/*

Pre and Code's copy to clipboard module
=======================================

Pre and Code items:
1. can be copied to CLIPBOARD
2. have injected button for copy (pre does)

**Bonus** `code` elements with short content have their content added as a `data-content` 
attribute so that special values (like `bug`) can be custom styled by style.css.

--This relies on the clipboard-utility

*/

function copyPreCodeOnClick() {
  for (let pre of $("pre")) {
    let el = htmlToElement(
      "<button class='copy-text btn btn-sm' title='copy code to clipboard'>copy</button>"
    );
    el.setAttribute("title", "Click to copy text to clipboard.");
    el.setAttribute("onclick", "copyNextElement(this);");

    let inserted = pre.parentNode.insertBefore(el, pre);
  }

  for (let code of $("code")) {
    let codeText = code.innerText;

    // Taking the content of the code block, and putting it into a `data-content` attribute, 
	// allows us to set style rules specific to that content. 
	// e.g.
	//
	//     code[data-content='tip']::after { content: " 💡";}
	//
	// adds an emoji prefix to any place we've written `tip`.
	//
	// All the `code` tags we currently have special rules for::
	// - tip
	// - note
	// - todo
	// - draft
	// - error
	// - bug
	// - warning
	// - overdue
	// - hot
	// - new
	// - scary
	// - verified
	// - fun
	// - hard
	// - easy
	// - bonus
    if (codeText.length < 100) {
      code.setAttribute("data-content", codeText.toLowerCase());
    }

    // Only allow copy to clipboard if text is longer than 2 chars,
    // AND if code is not inside an anchor.
    if (codeText.length <= 2 || code.closest("a") != null) continue;

    code.setAttribute("title", "Click to copy text to clipboard.");
    code.setAttribute("onclick", "copyItemText(this);");
  }

  // Now undo any damage that was done to codes inside pres.
  for (let codeInPre of $("pre code")) {
    codeInPre.removeAttribute("onclick");
    codeInPre.removeAttribute("title");
  }
}

/* final part of pre/code clipboard library... these are what happens on a click of pre/code. */
function copyNextElement(item) {
  var nextElement = item.nextSibling;
  copyToClipboard(nextElement.textContent, item);
}

function copyItemText(item) {
  copyToClipboard(item.textContent, item);
}

/*
//
// End of Pre and Code's copy to clipboard module
//
*/

/*
*
* Clipboard Utility:
*
*
- Relied on by "Pre and Code's copy to clipboard module"... does not rely on that module.
- Relies on ... actually it just chains to... triggers.... -> showFloatingMessage

*/

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

function htmlEncode(text) {
  return document.createElement("a").appendChild(document.createTextNode(text))
    .parentNode.innerHTML;
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

// true if the element has a class name starting with prefix, eg. "has(el, 'lang-')" -- do any classes start with "lang-" ?
function hasClassWithPrefix(element, prefix) {
  for (var c of element.classList) {
    if (c.indexOf(prefix) == 0) return true;
  }
  return false;
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
