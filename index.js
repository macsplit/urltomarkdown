const https = require('https');
const turndown = require('turndown');
const { Readability } = require('@mozilla/readability');
const JSDOM = require('jsdom').JSDOM;
const common_filters = require('./url_to_markdown_common_filters');
const validURL = require('@7c/validurl');
const express = require('express');
const rateLimit = require('express-rate-limit');
const htmlEntities = require('html-entities');

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
	if (url && validURL(url)) {
		send_headers(res);
		read_url(url, res);
	} else {
		res.status(400).send("Please specify a valid url query parameter");
	}
});

app.post('/', function(req, res) {
	let html = req.body.html;
	let url = req.body.url;
	if (!html) {
		res.status(400).send("Please provide a POST parameter called html");
	} else {	  	
		//try {
		let document = new JSDOM(html);
		let markdown = process_dom(url, document, res);
		send_headers(res);
		res.send(markdown);
		/*} catch (error) {
			res.status(400).send("Could not parse that document");
		}*/
	}

});

app.listen(port, () => {	
})

function send_headers(res) {
	res.header("Access-Control-Allow-Origin", '*');
 	res.header("Access-Control-Expose-Headers", 'X-Title');
 	res.header("Content-Type", 'text/markdown');
}

function process_dom(url, document, res) {
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
	let result = (url) ? common_filters.filter(url, markdown) : markdown;
	return result;
}

function read_url(url, res) {
	JSDOM.fromURL(url).then((document)=>{
		let markdown = process_dom(url, document, res);
		res.send(markdown);
	}).catch((error)=> {
		res.status(400).send("Sorry, could not fetch and convert that URL");
	});
}

function clean(str) {
	str = str.replace(/<\/?[^>]+(>|$)/g, "");
	str = str.replace(/(\r\n|\n|\r)/gm, "");
	str = htmlEntities.decode(str);
	return str;
}

function format_table(table) {
	let result = "\n";

	let caption = table.match(/<caption[^>]*>((?:.|\n)*)<\/caption>/i);
	if (caption)
		result += clean(caption[1]) + "\n\n";

	let items = [];

	// collect data
	let rows = table.match(/(<tr[^>]*>(?:.|\n)*?<\/tr>)/gi);
	let n_rows = rows.length;
	for (let r=0;r<n_rows;r++) {
		let item_cols = [];
		let cols = rows[r].match(/<t[h|d][^>]*>(?:.|\n)*?<\/t[h|d]>/gi);
		for (let c=0;c<cols.length;c++)
			item_cols.push(clean(cols[c]));
		items.push(item_cols);
	}

	// find number of columns
	let n_cols=0;
	for (let r=0;r<n_rows;r++) {
		if (items[r].length > n_cols) {
			n_cols = items[r].length;
		}
	}

	// normalise columns
	for (let r=0;r<n_rows;r++) {
		for (let c=0;c<n_cols;c++) {
			if (typeof items[r][c] === 'undefined') {
				items[r].push("");
			}
		}
	}

	// correct widths
	let column_widths = [];
	for (let r=0;r<n_rows;r++) {
		for (let c=0;c<n_cols;c++) {
			column_widths.push(0);
		}
		for (let c=0;c<n_cols;c++) {
			let l = items[r][c].length;
			if (l>column_widths[c]) {
				column_widths[c]=l;
			}
		}
	}
	for (let r=0;r<n_rows;r++) {
		for (let c=0;c<n_cols;c++) {
			items[r][c] = items[r][c].padEnd(column_widths[c], " ");
		}
	}

	// output table
	if (n_rows >0 && n_cols > 0) {
		if (n_rows > 1) {
			result += "|";
			for (let c=0;c<n_cols;c++) {
				result += items[0][c];
				result += "|";
			}
		}
		result += "\n";
		result += "|";
		for (let c=0;c<n_cols;c++) {
			result += "-".repeat(column_widths[c]) + "|";
		}
		result += "\n";
		for (let r=1;r<n_rows;r++) {
			result += "|";
			for (let c=0;c<n_cols;c++) {
				result += items[r][c];
				result += "|";
			}
			result += "\n";
		}
	}

	return result;
}

function format_tables(html, replacements) {
	const tables = html.match(/(<table[^>]*>(?:.|\n)*?<\/table>)/gi);
	for (let t=0;t<tables.length;t++) {
		let table = tables[t];
		let markdown = format_table(table);
		let placeholder = "urltomarkdowntableplaceholder"+t+Math.random();
		replacements.placeholders[t] = placeholder;
		replacements.tables[t] = markdown;
		html = html.replace(table, "<p>"+placeholder+"</p>");
	}
	return html;
}

