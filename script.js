function configureBreadcrumb() {
	var currentUrl = location.pathname;
	var currentPage = currentUrl.substring(currentUrl.lastIndexOf("/") + 1);
	var parentUrl = currentUrl.substring(0, currentUrl.lastIndexOf("/"));
	var currentTitle = currentPage.substring(0, currentPage.lastIndexOf('.'));
	var topicTOC = parentUrl + '/01_summary.html';
	var topicTitle = parentUrl.substring(parentUrl.lastIndexOf("/") + 1);
	if (currentTitle == "01_summary") currentTitle = "contents";
	topicTitle = topicTitle.replace(/_/g, " ");
	currentTitle = currentTitle.replace(/_/g, " ");
	var homeLink = "<a href='/index.html#topics'>Topics</a>";
	var joiner = " &rsaquo; ";
	var topicLink = "<a href='" + topicTOC + "'>" + topicTitle + "</a>";
	if (topicTitle == "today-i-learned" || topicTitle == "")
	{
		$id('breadcrumb').innerHTML = homeLink + joiner + "index";
	} 
	else 
	{
		$id('breadcrumb').innerHTML = homeLink + joiner + topicLink + joiner + currentTitle;
	}
}

function copyPreCodeOnClick() {
	for(let preOrCode of $('pre, code')) {
		preOrCode.setAttribute('title', "Click to copy.");
		preOrCode.setAttribute('onclick', "copyItemText(this);");
	}

	for(let codeInPre of $('pre code' )) {
		codeInPre.removeAttribute('onclick', undefined);
	}
}

/* on start.... */
configureBreadcrumb();
copyPreCodeOnClick();


function copyItemText(item) {
	item.setAttribute('title', "Copied. Click to copy again.");
	copytext(item.textContent);
}

function copytext(copyText) {
	const textArea = document.createElement('textarea');
	textArea.style.position = "absolute";
	textArea.style.left = "-100%";
	textArea.textContent = copyText;
	document.body.appendChild(textArea);
	textArea.select();
	document.execCommand("copy");
}



/* utility functions */
function htmlToElement(html) {
	var template = document.createElement('template');
	html = html.trim(); // Never return a text node of whitespace as the result
	template.innerHTML = html;
	return (template.content.firstChild);
}

function $(selector) {
	return document.querySelectorAll(selector);
}

function $id(id) {
	return document.getElementById(id);
}

function isEmpty(obj) {
	return (Object.keys(obj).length === 0 && obj.constructor === Object);
}

//add the class of className to all elements that match the selector
function addClass(selector, className) {
	for (var _i = 0, _a = $(selector); _i < _a.length; _i++) {
		var example = _a[_i];
		example.classList.add(className);
	}
}

//remove the class className from all elements that match the selector
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
