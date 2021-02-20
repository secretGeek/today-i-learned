function onStart() {
	applyLanguageClassesToPre();
	hljs.initHighlightingOnLoad();
	configureBreadcrumb(); //include TOC
	copyPreCodeOnClick();
	configureHeadingLinks();
}


function applyLanguageClassesToPre() {

	// this is the default language of code blocks in each topic category.
	// to override the default, use a fenced codeblock followed by lang, e.g.  "```plaintext"
	var topicLangs = {
		'powershell': 'powershell',
		'net': 'csharp',
		'net_core_MVC': 'csharp',
		'7z': '7z',
		'active_directory': 'active_directory',
		'airtable': 'powershell',
		'angular': 'javascript',
		'asp.net_mvc': 'csharp',
		'azure_devops': 'sql',
		'bower': 'javascript',
		'chocolatey': 'powershell',
		'cpu_analyzer': 'csharp',
		'csharp': 'csharp',
		'css': 'css',
		'csv': 'csv',
		'electron': 'javascript',
		'firebird': 'sql',
		'git': 'powershell',
		'go': 'go',
		'gulp': 'javascript',
		'html': 'html',
		'javascript': 'javascript',
		'jekyll': 'javascript',
		'jquery': 'javascript',
		'json': 'javascript',
		'linqpad': 'csharp',
		'linux': 'bash',
		'mercurial': 'powershell',
		'microsoft_terminal': 'powershell',
		'minecraft': 'python',
		'node': 'javascript',
		'npm': 'javascript',
		'nuget': 'powershell',
		'oracle': 'sql',
		'powershell': 'powershell',
		'python': 'python',
		'react': 'javascript',
		'robocopy': 'powershell',
		'r_language': 'r',
		'smallbasic': 'vbnet',
		'speech': 'powershell',
		'sqlite': 'sql',
		'sql_server': 'sql',
		'sql_server_reporting_services': 'sql',
		'sql_spatial': 'sql',
		'typescript': 'javascript',
		'usql': 'sql',
		'wordpress': 'php',
		'yarn': 'javascript',
	};

	var currentUrl = location.pathname;
	var parentUrl = currentUrl.substring(0, currentUrl.lastIndexOf("/"));
	var topicTitle = parentUrl.substring(parentUrl.lastIndexOf("/") + 1);

	if (topicLangs[topicTitle]) {
		for (let pre of $("pre")) {
			if (!pre.classList.contains("plaintext") && !hasClassWithPrefix(pre, "language-")) {
				pre.classList.add("language-" + topicLangs[topicTitle]); //powershell");
			}
		}
	}
}

function configureHeadingLinks() {
	let toc = [];
	let previousLevel = 0; //todo
	for (let hEl of $("h1, h2, h3, h4, h5, h6")) {
		const id = hEl.getAttribute("id");
		currentLevel = parseInt(hEl.outerHTML[2]); //e.g. h1 is "1"
		if (id) {
			if (currentLevel > previousLevel) {
				//toc.push("<ol>");
				while(currentLevel > previousLevel) {
					toc.push("<ol>");
					previousLevel++;
				}
				
				
			} else if (currentLevel < previousLevel) {
				//toc.push("</li></ol>");
				
				while(currentLevel < previousLevel) {
					toc.push("</li></ol>");
					previousLevel--;
				}
				
			} else {
				toc.push("</li>");
			}
			toc.push(`<li><a href="#${id}">${hEl.innerText}</a>`);
			previousLevel = currentLevel;
			
			
			const icon = htmlToElement('<a href="#" class="hover-link">🔗</a>');
			let iconTitle = `permalink to '${hEl.innerText}'`;
			hEl.appendChild(icon);
			icon.setAttribute("href", "#" + id);
			icon.setAttribute("title", iconTitle);
			hEl.classList.add("has-hover-link");
		}
	}
	while(currentLevel > 0) {
		toc.push("</li></ol>");
		currentLevel--;
	}
	console.log(toc.join("\n"));
	let tocHtml = `<details class='toc'><summary>toc&hellip;</summary>${toc.join("\n")}</details>`;
	$id('currentTitle').appendChild(htmlToElement(tocHtml));
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
    $id("breadcrumb").innerHTML = homeLink + joiner + "<span id='currentTitle'>index</span>";
  } else {
    $id("breadcrumb").innerHTML =
      homeLink + joiner + topicLink + joiner + `<span id='currentTitle'>${currentTitle}</span>`;
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