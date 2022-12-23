const apple_dev_parser = require('./url_to_markdown_apple_dev_docs.js');
const processor = require('./url_to_markdown_processor.js');
const JSDOM = require('jsdom').JSDOM;
const https = require('https');

const failure_message  = "Sorry, could not fetch and convert that URL";

const apple_dev_prefix = "https://developer.apple.com";
const stackoverflow_prefix = "https://stackoverflow.com/questions";

class html_reader {
	read_url(url, res, inline_title, ignore_links) {
		JSDOM.fromURL(url).then((document)=>{
			let markdown = processor.process_dom(url, document, res, inline_title, ignore_links);
			res.send(markdown);
		}).catch((error)=> {
			res.status(400).send(failure_message);
		});
	}
}

class apple_reader {
	read_url(url, res, inline_title, ignore_links) {
		let json_url = apple_dev_parser.dev_doc_url(url);
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
		});
	}
}

class stack_reader {
	read_url(url, res, inline_title, ignore_links) {
		JSDOM.fromURL(url).then((document)=>{
			let markdown_q = processor.process_dom(url, document, res, inline_title, ignore_links, 'question');
			let markdown_a = processor.process_dom(url, document, res, false, ignore_links, 'answers');
			if (markdown_a.startsWith('Your Answer')) {
				res.send(markdown_q);
			}
			else {
				res.send(markdown_q + "\n\n## Answer\n"+ markdown_a);
			}
		}).catch((error)=> {
			res.status(400).send(failure_message);
		});
	}
}

module.exports = {
	html_reader,
	stack_reader,
	apple_reader,
	reader_for_url: function (url) {
		if (url.startsWith(apple_dev_prefix)) {
			return new apple_reader;
		} else if (url.startsWith(stackoverflow_prefix)) {		
			return new stack_reader;
		} else {
			return new html_reader;
		}
	},
	ignore_post: function(url) {
		if (url) {
			if (url.startsWith(stackoverflow_prefix)) {
				return true;
			}
		} else {
			return false;
		}
	}
}