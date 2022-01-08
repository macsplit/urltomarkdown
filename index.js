const https = require('https');
const turndown = require('turndown');
const { Readability } = require('@mozilla/readability');
const JSDOM = require('jsdom').JSDOM;

service = new turndown();

const express = require('express')
const app = express()
const port = 4040

app.get('/', (req, res) => {
	url = req.query.url;
	read_url(url, res);
});

app.listen(port, () => {	
})

function read_url(url, res) {
	JSDOM.fromURL(url).then((document)=>{
		let reader = new Readability(document.window.document);
		let article = reader.parse();
		let result = service.turndown(article.content);
		res.send(result);
	});
}
