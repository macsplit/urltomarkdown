const table_to_markdown = require('./html_table_to_markdown.js');
const htmlEntities = require('html-entities');

module.exports = {
	format_tables: function (html, replacements) {
		const start = replacements.length;
		const tables = html.match(/(<table[^>]*>(?:.|\n)*?<\/table>)/gi);
		if (tables) {
			for (let t=0;t<tables.length;t++) {
				const table = tables[t];
				let markdown = table_to_markdown.convert(table);
				let placeholder = "urltomarkdowntableplaceholder"+t+Math.random();
				replacements[start+t] = { placeholder: placeholder, replacement: markdown};
				html = html.replace(table, "<p>"+placeholder+"</p>");
			}
		}
		return html;
	},
	format_codeblocks: function (html, replacements) {
		const start = replacements.length;
		const codeblocks = html.match(/(<pre[^>]*>(?:.|\n)*?<\/pre>)/gi);
		if (codeblocks) {
			for (let c=0;c<codeblocks.length;c++) {
				const codeblock = codeblocks[c];
				let filtered = codeblock;
				filtered = filtered.replace(/<br[^>]*>/g, "\n");
				filtered = filtered.replace(/<p>/g, "\n");
				filtered = filtered.replace(/<\/?[^>]+(>|$)/g, "");		
				filtered = htmlEntities.decode(filtered);
				let markdown = "```\n"+filtered+"\n```\n";
				let placeholder = "urltomarkdowncodeblockplaceholder"+c+Math.random();
				replacements[start+c] = { placeholder: placeholder, replacement: markdown};
				html = html.replace(codeblock, "<p>"+placeholder+"</p>");
			}
		}
		return html;
	}
}