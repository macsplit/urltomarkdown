const formatters = require('../url_to_markdown_formatters.js');

const test_html_table = 
	"<html><body><table>"+
	"<tr><td>One</td><td>Two</td></tr>"+
	"<tr><td>1</td><td>2</td></tr>"+
	"</table></body></html>";

const expected_markdown_table =
	"\n|One|Two|\n|---|---|\n|1  |2  |\n";

test('format table', () => {
	let replacements = [];
	formatters.format_tables(test_html_table, replacements);
	let output_markdown_table = replacements[0].replacement;
	expect(output_markdown_table).toBe(expected_markdown_table);
});

const test_html_codeblock = 
	"<html><body><pre><code>" +
	"#include &lt;stdio.h&gt;\n" +
	"int main() {\n" +
	"\tprintf(\"hello world\");\n" +
	"}" +
	"</code></pre></body></html>";

const expected_markdown_codeblock =
	"```\n#include <stdio.h>\nint main() {\n\tprintf(\"hello world\");\n}\n```\n";

test('format code block', () => {
	let replacements = [];
	formatters.format_codeblocks(test_html_codeblock, replacements);
	let output_markdown_codeblock = replacements[0].replacement;
	expect(output_markdown_codeblock).toBe(expected_markdown_codeblock);
})