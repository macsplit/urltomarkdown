const formatter = require('./url_to_markdown_formatters.js');
const common_filters = require('./url_to_markdown_common_filters');
const { Readability } = require('@mozilla/readability');
const turndown = require('turndown');
const JSDOM = require('jsdom').JSDOM;
const service = new turndown();

module.exports = {
	process_dom: function (url, document, res, inline_title, ignore_links, id="") {
		let title = document.window.document.querySelector('title');
		if (title)
			res.header("X-Title", encodeURIComponent(title.textContent));
		if (id) {		
			document = new JSDOM('<!DOCTYPE html>'+ document.window.document.querySelector("#"+id).innerHTML);	
		}
		let reader = new Readability(document.window.document);
		let readable = reader.parse().content;
		let replacements = [];
		readable = formatter.format_codeblocks(readable, replacements);
		readable = formatter.format_tables(readable, replacements);		
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

}