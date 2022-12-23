const processor = require('../url_to_markdown_processor.js');
const JSDOM = require('jsdom').JSDOM;

const test_html_document =
	"<html><head><title>test page</title></head>" +
	"<body><p>first paragraph</p>" +
	"<h2>heading 2</h2><p>second paragraph</p>" +
	"<h3>heading 3</h3><p>third paragraph</p>" +
	"<p><em>italics</em> <strong>bold</strong></p>" +
	"<p><a href='http://some.url/link'>link</a></p>" +
	"<p><img alt='photo' src='http://some.url/img'></img></p>" +
	"</body></html>";

const expected_markdown_output =
	"# test page\nfirst paragraph\n\nheading 2\n---------\n\nsecond paragraph\n\n" +
	"### heading 3\n\nthird paragraph\n\n_italics_ **bold**\n\n" +
	"[link](http://some.url/link)\n\n![photo](http://some.url/img)";

test('process html', () => {

	const doc = new JSDOM(test_html_document);
	const res = { header: (header, value) => {} };
	const inline_title = true;
	const ignore_links = false;

	let actual_markdown_output = processor.process_dom(
		"http://some.url", doc, res, inline_title, ignore_links
	);

	expect(actual_markdown_output).toBe(expected_markdown_output);
})