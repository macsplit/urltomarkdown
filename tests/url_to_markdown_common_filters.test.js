const filters = require('../url_to_markdown_common_filters.js');

const test_markdown = "![photo](https://upload.wikimedia.org/wikipedia/en/thumb/1/1b/photo.svg/20px-photo.svg.png)";
const expected_markdown = "![photo](https://upload.wikimedia.org/wikipedia/en/1/1b/photo.svg)";

test('filter', () => {
		let filtered_markdown = filters.filter("https://en.wikipedia.org/wiki/test", test_markdown);
		expect(filtered_markdown).toBe(expected_markdown);
});

const test_html_with_styleblock = 
	"<html><body><style>p { font-weight: bold; }</style><p>Bold?</p></body></html>";

const expected_html =
	"<html><body><p>Bold?</p></body></html>";

test('strip style block', () => {
	let output_html = filters.strip_style_blocks(test_html_with_styleblock);
	expect(output_html).toBe(expected_html);
})