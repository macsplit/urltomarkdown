const https = require('https');
const turndown = require('turndown');
const { Readability } = require('@mozilla/readability');
const JSDOM = require('jsdom').JSDOM;
const common_filters = require('./url_to_markdown_common_filters');
const table_to_markdown = require('./html_table_to_markdown.js');
const validURL = require('@7c/validurl');
const express = require('express');
const rateLimit = require('express-rate-limit');

const port = process.env.PORT;

const app = express();

const service = new turndown();

const rateLimiter = rateLimit({
	windowMs: 30 * 1000,
	max: 5,
	message: 'Rate limit exceeded',
	headers: true
});

app.use(rateLimiter);

app.use(express.urlencoded({
  extended: true,
  limit: '10mb'
}));

app.get('/', (req, res) => {
	url = req.query.url;
	title = req.query.title;
	links = req.query.links;
	let inline_title = false;
	if (title)
		inline_title = !!JSON.parse(title);
	if (links)
		links = !JSON.parse(links);
	if (url && validURL(url)) {
		send_headers(res);
		read_url(url, res, inline_title, links);
	} else {
		res.status(400).send("Please specify a valid url query parameter");
	}
});

app.post('/', function(req, res) {
	let html = req.body.html;
	let url = req.body.url;
	let inline_title = false;
	title = req.query.title;
	if (title)
		inline_title = !!JSON.parse(title);
	if (!html) {
		res.status(400).send("Please provide a POST parameter called html");
	} else {	  	
		try {
		let document = new JSDOM(html);
		let markdown = process_dom(url, document, res, inline_title);
		send_headers(res);
		res.send(markdown);
		} catch (error) {
			res.status(400).send("Could not parse that document");
		}
	}

});

app.listen(port, () => {	
})

function send_headers(res) {
	res.header("Access-Control-Allow-Origin", '*');
 	res.header("Access-Control-Expose-Headers", 'X-Title');
 	res.header("Content-Type", 'text/markdown');
}

function process_dom(url, document, res, inline_title) {
	let title = document.window.document.querySelector('title');
	if (title)
		res.header("X-Title", encodeURIComponent(title.textContent));
	let reader = new Readability(document.window.document);
	let readable = reader.parse().content;
	let replacement = {placeholders:[], tables:[]}
	readable = format_tables(readable, replacement);
	let markdown = service.turndown(readable);
	for (let i=0;i<replacement.placeholders.length;i++) {
		markdown = markdown.replace(replacement.placeholders[i], replacement.tables[i]);
	}
	let result = (url) ? common_filters.filter(url, markdown, links) : markdown;
	if (inline_title && title) {
		result = "# " + title.textContent + "\n" + result;
	}
	return result;
}

function read_url(url, res, inline_title, links) {
	JSDOM.fromURL(url).then((document)=>{
		let markdown = process_dom(url, document, res, inline_title, links);
		res.send(markdown);
	}).catch((error)=> {
		res.status(400).send("Sorry, could not fetch and convert that URL");
	});
}

function format_tables(html, replacements) {
	const tables = html.match(/(<table[^>]*>(?:.|\n)*?<\/table>)/gi);
	if (tables) {
		for (let t=0;t<tables.length;t++) {
			let table = tables[t];
			let markdown = table_to_markdown.convert(table);
			let placeholder = "urltomarkdowntableplaceholder"+t+Math.random();
			replacements.placeholders[t] = placeholder;
			replacements.tables[t] = markdown;
			html = html.replace(table, "<p>"+placeholder+"</p>");
		}
	}
	return html;
}

