const readers = require('./url_to_markdown_readers.js');
const processor = require('./url_to_markdown_processor.js');
const filters = require('./url_to_markdown_common_filters.js');
const validURL = require('@7c/validurl');
const express = require('express');
const rateLimit = require('express-rate-limit');
const JSDOM = require('jsdom').JSDOM;
const port = process.env.PORT;
const app = express();

const rateLimiter = rateLimit({
	windowMs: 30 * 1000,
	max: 5,
	message: 'Rate limit exceeded',
	headers: true
});

app.set('trust proxy', 1);

app.use(rateLimiter);

app.use(express.urlencoded({
  extended: true,
  limit: '10mb'
}));

function send_headers(res) {
	res.header("Access-Control-Allow-Origin", '*');
	res.header("Access-Control-Allow-Methods", 'GET, POST');
 	res.header("Access-Control-Expose-Headers", 'X-Title');
 	res.header("Content-Type", 'text/markdown');
}

function read_url(url, res, options) {
		reader = readers.reader_for_url(url);
		send_headers(res);
		reader.read_url(url, res, options);
}

function get_options(query) {
	const title = query.title;
	const links = query.links;
	const clean = query.clean;

	let inline_title = false;
	let ignore_links = false;
	let improve_readability = true;

	if (title !== undefined) {
		inline_title = (title === 'true');
	}
	if (links !== undefined) {
		ignore_links = (links === 'false');
	}
	if (clean !== undefined) {
		improve_readability = (clean !== 'false');
	}
	return {
		inline_title: inline_title,
		ignore_links: ignore_links,
		improve_readability: improve_readability
	};
}

app.get('/', (req, res) => {
	const url = req.query.url;
	const options = get_options(req.query);
	if (url && validURL(url)) {
		read_url(url, res, options);		
	} else {
		res.status(400).send("Please specify a valid url query parameter");
	}
});

app.post('/', function(req, res) {
	let html = req.body.html;
	const url = req.body.url;
	const options = get_options(req.query);
	const id = '';
	if (readers.ignore_post(url)) {
		read_url(url, res, options);
		return;
	}
	if (!html) {
		res.status(400).send("Please provide a POST parameter called html");
	} else {	  	
		try {
			html = filters.strip_style_and_script_blocks(html);
			let document = new JSDOM(html);		
			let markdown = processor.process_dom(url, document, res, id, options);			
			send_headers(res);
			res.send(markdown);
		 } catch (error) {
		 	res.status(400).send("Could not parse that document");
		}
	}

});

app.listen(port, () => {	
})
