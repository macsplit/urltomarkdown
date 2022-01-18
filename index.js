const https = require('https');
const turndown = require('turndown');
const { Readability } = require('@mozilla/readability');
const JSDOM = require('jsdom').JSDOM;
const common_filters = require('./url_to_markdown_common_filters');
const validURL = require('@7c/validurl');

service = new turndown();

const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
	windowMs: 30 * 1000,
	max: 5,
	message: 'Rate limit exceeded',
	headers: true
});

const express = require('express')
const app = express()
const port = process.env.PORT

app.use(rateLimiter)

app.get('/', (req, res) => {
	url = req.query.url;
 	res.header("Access-Control-Allow-Origin", '*');
	if (url && validURL(url)) {
		read_url(url, res);
	} else {
		res.status(400).send("Please specify a valid url query parameter");
	}
});

app.listen(port, () => {	
})

function read_url(url, res) {
	JSDOM.fromURL(url).then((document)=>{
		let title = document.window.document.querySelector('title');
		if (title)
			res.header("X-Title", title.textContent);
		let reader = new Readability(document.window.document);
		let article = reader.parse();
		let markdown = service.turndown(article.content);
		let result = common_filters.filter(url, markdown);
		res.send(result);
	}).catch((error)=> {
		res.status(400).send("Sorry, could not fetch and convert that URL");
	});
}
