const formatter = require('./url_to_markdown_formatters.js');
const common_filters = require('./url_to_markdown_common_filters');
const { Readability } = require('@mozilla/readability');
const turndown = require('turndown');
const JSDOM = require('jsdom').JSDOM;
const service = new turndown();

module.exports = {
	process_dom: function (url, document, res, id = "", options) {
		let inline_title = options.inline_title ?? true;
		let ignore_links = options.ignore_links ?? false;
		let improve_readability = options.improve_readability ?? true;
		let title = document.window.document.querySelector('title');
		if (title)
			res.header("X-Title", encodeURIComponent(title.textContent));
		if (id) {
			let el = document.window.document.querySelector("#"+id);
			if (el) document = new JSDOM('<!DOCTYPE html>'+ el.innerHTML);			
		}
		let readable = null;
		if (improve_readability) {
			let reader = new Readability(document.window.document);
			readable_obj = reader.parse();
			if (readable_obj) {
				readable = readable_obj.content;
			}
		}
		if (!readable) {
			readable = document.window.document.documentElement.outerHTML;
		}
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
