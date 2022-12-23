const readers = require('../url_to_markdown_readers.js');

test('get html reader', () => {
	reader = readers.reader_for_url("https://en.wikipedia.org");
	expect(reader).toBeInstanceOf(readers.html_reader);
});

test('get stack overflow reader', () => {
	reader = readers.reader_for_url("https://stackoverflow.com/questions/0");
	expect(reader).toBeInstanceOf(readers.stack_reader);
});

test('get apple dev docs reader', () => {
	reader = readers.reader_for_url("https://developer.apple.com/documentation/swift/array");
	expect(reader).toBeInstanceOf(readers.apple_reader);
});