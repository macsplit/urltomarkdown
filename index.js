const https = require('https');
const turndown = require('turndown');
const { Readability } = require('@mozilla/readability');
const JSDOM = require('jsdom').JSDOM;
const common_filters = require('./url_to_markdown_common_filters');
const validURL = require('@7c/validurl');
const express = require('express');
const app = express();
const rateLimit = require('express-rate-limit');
const service = new turndown();

const port = process.env.PORT;

const rateLimiter = rateLimit({
	windowMs: 30 * 1000,
	max: 5,
	message: 'Rate limit exceeded',
	headers: true
});

app.use(rateLimiter);

app.use(express.urlencoded({
  extended: true
}));

app.get('/', (req, res) => {
	url = req.query.url;
	if (url && validURL(url)) {
		send_headers(res);
		read_url(url, res);
	} else {
		res.status(400).send("Please specify a valid url query parameter");
	}
});

app.post('/', function(req, res) {
	let html;

	if (req.body) {
		html = req.body.html;
	  if (!html) {
	  	res.status(400).send("Please provide a POST parameter called html");
	  } else {	  	
		  try {
		  	let document = new JSDOM(html);
		  	let markdown = process_dom(document, res);
		  	res.send(markdown);
			} catch (error) {
				res.status(400).send("Could not parse that document");
			}
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

function process_dom(document, res) {
	let title = document.window.document.querySelector('title');
	if (title)
		res.header("X-Title", encodeURIComponent(title.textContent));
	let reader = new Readability(document.window.document);
	let article = reader.parse();
	let markdown = service.turndown(article.content);
	return markdown;
}

function read_url(url, res) {
	JSDOM.fromURL(url).then((document)=>{
		let markdown = process_dom(document, res);
		let result = common_filters.filter(url, markdown);
		res.send(result);
	}).catch((error)=> {
		res.status(400).send("Sorry, could not fetch and convert that URL");
	});
}
