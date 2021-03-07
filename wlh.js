// https://css-tricks.com/snippets/javascript/get-url-variables/
function getQueryVariable(variable)
{
	 var query = window.location.search.substring(1);
	 var vars = query.split("&");
	 for (var i=0;i<vars.length;i++) {
		 var pair = vars[i].split("=");
		 if(pair[0] == variable){return pair[1];}
	 }

	 return null;//undefined;
}

function go() {

let actualTarget = getQueryVariable('to');
let target = null; 
if (actualTarget !== null) {
	target = decodeURIComponent(actualTarget).replace(".html",".md");
}

let topic = getQueryVariable('topic');
if (topic !== null) {
	topic = decodeURIComponent(topic);
}



if (/\/01_summary.md$/.test(target)) {
	topic = target.replace(/\/(.*)\/01_summary.md$/, '$1');
	target = '';
}

fetch("links.json")
  .then(response => response.json())
  .then(json => {

	let found = {};
	//let targeted = {};
	//let ontopic = {};
	let i = 0;
	for(let link of json) {
		if (target != '' && link.Absolute == target) {
			console.log(JSON.stringify(link));
			if (found[link.OnTopic] == undefined) {
				found[link.OnTopic] = [];

			}
			found[link.OnTopic].push(link);
		}
		if (topic != '' && link.ToTopic == topic) {
			console.log(JSON.stringify(link));
			if (found[link.OnTopic] == undefined) {
				found[link.OnTopic] = [];
			}
			found[link.OnTopic].push(link);
		}
		i++;
	}

	let result = '<div>';

	let title = '';

	if (topic === "undefined" || topic === undefined || topic === '' || topic === null) {
			title = `${target}`;
	} else {
		title = `the topic: ${topic}`;
	}

	result += `<p>What links to <mark>${title}</mark> ?</p>\n`;

	if (Object.keys(found).length > 0) {
		result+= '<ul>\n';
		for (let foundTopic in found) {
			if (found.hasOwnProperty(foundTopic)) {
				result+= `<li>${foundTopic}\n`;
				result+= '<ul>\n';
				for(let link of found[foundTopic]) {
					result+= `<li><a href='${link.On.replace('.md','.html')}'>${link.OnTitle}</a></li>\n`;
				}
				result+= '</ul></li>\n';
			}
		}
		result+= '</ul>\n';
	} else {
		result += `<p>No links to this page...</p>`;
	}

	//if (!(topic === "undefined" || topic === undefined || topic === null || topic === '')) {
	if (!(topic === null)) {
		result += `<h2>See also</h2>\n<ul><li><a href='?topic=${topic}'>links to topic: ${topic}</a></li></ul>`;
		result += `</div>`;
		//thisTopic = topic;
	} else {
		let thisTopic = target.split('/')[1];
		result += `<h2>See also</h2>\n<ul><li><a href='?topic=${thisTopic}'>links to topic: ${thisTopic}</a></li></ul>`;
		result += `</div>`;

	}
	
	
	
	let targetElement = $id('target');
	const list = htmlToElement(result);
	targetElement.appendChild(list);
	});
}

go();


/* ####################### */
/* ####################### */
/* ## utility functions ## */
/* ####################### */
/*    #################    */
/*       ###########       */
/*          #####          */
/*            #            */

function $id(id) {
	return document.getElementById(id);
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
