const https = require('https');
const turndown = require('turndown');
const { Readability } = require('@mozilla/readability');
const JSDOM = require('jsdom').JSDOM;
const common_filters = require('./url_to_markdown_common_filters');
const apple_dev_parser = require('./url_to_markdown_apple_dev_docs.js');
const table_to_markdown = require('./html_table_to_markdown.js');
const validURL = require('@7c/validurl');
const express = require('express');
const rateLimit = require('express-rate-limit');
const htmlentities = require('html-entities');

const port = process.env.PORT;

const app = express();

const service = new turndown();

const apple_dev_prefix = "https://developer.apple.com";

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
	const url = req.query.url;
	const title = req.query.title;
	const links = req.query.links;
	let inline_title = false;
	let ignore_links = false;
	if (title) {
		inline_title = (title === 'true');
	}
	if (links) {
		ignore_links = (links === 'false');
	}
	if (url && validURL(url)) {
		send_headers(res);
		if (url.startsWith(apple_dev_prefix)) {
			read_apple_url(url, res, inline_title, ignore_links);
		} else {
			read_url(url, res, inline_title, ignore_links);
		}
	} else {
		res.status(400).send("Please specify a valid url query parameter");
	}
});

app.post('/', function(req, res) {
	const html = req.body.html;
	const url = req.body.url;
	const links = req.query.links;
	const title = req.query.title;
	let ignore_links = false;
	let inline_title = false;
	if (title) {
		inline_title = (title === 'true');
	}
	if (links) {
		ignore_links = (links === 'false');
	}
	if (!html) {
		res.status(400).send("Please provide a POST parameter called html");
	} else {	  	
		//try {
			let document = new JSDOM(html);
			let markdown = process_dom(url, document, res, inline_title, ignore_links);
			send_headers(res);
			res.send(markdown);
		 //} catch (error) {
		//	res.status(400).send("Could not parse that document");
		//}
	}

});

app.listen(port, () => {	
})

function send_headers(res) {
	res.header("Access-Control-Allow-Origin", '*');
 	res.header("Access-Control-Expose-Headers", 'X-Title');
 	res.header("Content-Type", 'text/markdown');
}

function process_dom(url, document, res, inline_title, ignore_links) {
	let title = document.window.document.querySelector('title');
	if (title)
		res.header("X-Title", encodeURIComponent(title.textContent));
	let reader = new Readability(document.window.document);
	let readable = reader.parse().content;
	let replacements = []
	readable = format_tables(readable, replacements);
	readable = format_code_blocks(readable, replacements);
	let markdown = service.turndown(readable);
	for (let i=0;i<replacements.length;i++) {
		markdown = markdown.replace(replacements[i].placeholder, replacements[i].replacement);
	}
	let result = (url) ? common_filters.filter(url, markdown, ignore_links) : markdown;
	if (inline_title && title) {
		result = "# " + title.textContent + "\n" + result;
	}
	return result;
}

function read_url(url, res, inline_title, ignore_links) {
	JSDOM.fromURL(url).then((document)=>{
		let markdown = process_dom(url, document, res, inline_title, ignore_links);
		res.send(markdown);
	}).catch((error)=> {
		res.status(400).send("Sorry, could not fetch and convert that URL");
	});
}

function read_apple_url(url, res, inline_title, ignore_links) {
	json_url = apple_dev_parser.dev_doc_url(url);
	https.get(json_url,(apple_res) => {
	    let body = "";
	    apple_res.on("data", (chunk) => {
	        body += chunk;
	    });
	    apple_res.on("end", () => {
            let json = JSON.parse(body);
            let markdown = apple_dev_parser.parse_dev_doc_json(json, inline_title, ignore_links);
            res.send(markdown);
	    });
	})
}

function format_tables(html, replacements) {
	const start = replacements.length;
	const tables = html.match(/(<table[^>]*>(?:.|\n)*?<\/table>)/gi);
	if (tables) {
		for (let t=0;t<tables.length;t++) {
			let table = tables[t];
			let markdown = table_to_markdown.convert(table);
			let placeholder = "urltomarkdowntableplaceholder"+t+Math.random();
			replacements[start+t] = { placeholder: placeholder, replacement: markdown};
			html = html.replace(table, "<p>"+placeholder+"</p>");
		}
	}
	return html;
}

function format_code_blocks(html, replacements) {
	const start = replacements.length;
	const code_blocks = html.match(/(<pre[^>]*>(?:.|\n)*?<\/pre>)/gi);
	if (code_blocks) {
		for (let cb=0;cb<code_blocks.length;cb++) {
			let code_block = code_blocks[cb];
			let markdown = code_block_to_markdown(code_block);
			let placeholder = "urltomarkdowncodeblockplaceholder"+cb+Math.random();
			replacements[start+cb] = { placeholder: placeholder, replacement: markdown};
			html = html.replace(code_block, "<p>"+placeholder+"</p>");
		}
	}
	return html;
}

function code_block_to_markdown (html) {
	const match_pre = /^<pre[^>]*>([\s\S]*)<\/pre>$/ig.exec(html);
	let inner_html = match_pre[1];
	const match_code = /^\s*<code[^>]*>[\r\n]*([\s\S]*)<\/code>\s*$/ig.exec(inner_html);
	if (match_code && match_code[1])
		inner_html = match_code[1];
	inner_html = inner_html.replace(/(<([^>]+)>)/ig, "");
	inner_html = htmlentities.decode(inner_html);	
	const markdown = "```\n"+inner_html+"\n```\n";
	return markdown;
}
