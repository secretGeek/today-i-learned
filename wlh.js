
/* UTILITY FUNCTIONS */
// via https://css-tricks.com/snippets/javascript/get-url-variables/
function getQueryVariable(variable)
{
	 var query = window.location.search.substring(1);
	 var vars = query.split("&");
	 for (var i=0;i<vars.length;i++) {
		 var pair = vars[i].split("=");
		 if(pair[0] == variable){return pair[1];}
	 }

	 return null;
}
/* end Utility Functions */

async function ShowLinks() {

	let actualTarget = getQueryVariable('to');
	let target = null;
	if (actualTarget !== null) {
		//target = decodeURIComponent(actualTarget).replace(".html",".md");
		target = actualTarget.replace(/%2F/g,'/').replace(".html",".md");
	}

	let topic = getQueryVariable('topic');
	if (topic !== null) {
		topic = topic.replace(/%2F/g,'/');
	}

	if (/\/01_summary.md$/.test(target)) {
		topic = target.replace(/\/(.*)\/01_summary.md$/, '$1');
		target = '';
	}

	const wlh = await findWhatLinksHere(topic, target);
	if (wlh != null) {
		const html = await buildHtmlWlh(topic, target, wlh);//, 'target');
		//let targetElement = $id('target');
		$id('target').appendChild(htmlToElement(html));
	}
}

const findWhatLinksHere = async (topic, target) =>
	fetch("links.json")
		.then(response => response.json())
		.then(json => {
			let found = {};
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
			}

			return found;
		});

// given a topic of interest, or a target url, and a list of found urls,
// construct the relevant html.
async function buildHtmlWlh(topic, target, found) {
	let result = '<div>';
	const title = topic === null? `<q>${target}</q>` : `the topic: <q>${topic}</q>`;

	result += `<p>What links to ${title}?</p>\n`;

	if (Object.keys(found).length > 0) {
		result+= '<ul>\n';
		for (let foundTopic in found) {
			if (found.hasOwnProperty(foundTopic)) {
				result+= `<li>${foundTopic.replace(/_/g," ")}\n`;
				result+= '<ul>\n';
				let topicLinks = [];
				for(let link of found[foundTopic]) {
					//result+= `<li><a href='${link.On.replace('.md','.html')}'>${link.OnTitle}</a></li>\n`;
					topicLinks.push(`<li><a href='${link.On.replace('.md','.html')}'>${link.OnTitle}</a></li>`);
				}
				// Turn our array of links into a 'set' and back to an array, to remove duplicates. Sneaky eh.
				topicLinks = Array.from(new Set(topicLinks));
				result += topicLinks.join("\n");
				result+= '</ul></li>\n';
			}
		}
		result+= '</ul>\n';
	} else {
		result += `<p>No links to this page.</p>`;
	}

	if (topic === null) {
		let thisTopic = target.split('/')[1];
		result += `<h3>See also</h3>\n<ul><li><a href='?topic=${thisTopic}'>What links to the topic: <q>${thisTopic}</q>?</a></li></ul>`;
		result += `</div>`;
	}

	return result;
}

// Main method here...
ShowLinks();
