const htmlEntities = require('html-entities');
const justify = require('justify-text');

module.exports = {

	max_width: 100,
	clean(str) {
		str = str.replace(/<\/?[^>]+(>|$)/g, "");
		str = str.replace(/(\r\n|\n|\r)/gm, "");
		str = htmlEntities.decode(str);
		return str;
	},
	convert: function (table) {
		let result = "\n";

		let caption = table.match(/<caption[^>]*>((?:.|\n)*)<\/caption>/i);
		if (caption)
			result += this.clean(caption[1]) + "\n\n";

		let items = [];

		// collect data
		let rows = table.match(/(<tr[^>]*>(?:.|\n)*?<\/tr>)/gi);
		let n_rows = rows.length;
		for (let r=0;r<n_rows;r++) {
			let item_cols = [];
			let cols = rows[r].match(/<t[h|d][^>]*>(?:.|\n)*?<\/t[h|d]>/gi);
			for (let c=0;c<cols.length;c++)
				item_cols.push(this.clean(cols[c]));
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
				column_widths.push(3);
			}
			for (let c=0;c<n_cols;c++) {
				let l = items[r][c].length;
				if (l>column_widths[c]) {
					column_widths[c] = l;
				}
			}
		}

		let total_width = column_widths.reduce((p, a) => p + a, 0);

		if (total_width < this.max_width) {

			// pad
			for (let r=0;r<n_rows;r++) {
				for (let c=0;c<n_cols;c++) {
					items[r][c] = justify.ljust(items[r][c], column_widths[c], " ");
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
		} else {

			// too wide so output indented instead

			result += "\n";
			for (let r=1;r<n_rows;r++) {
				if (items[0][0] || items[r][0])
					result += "* ";
				if (items[0][0]) {
					result += items[0][0];
					result += ": ";
				}
				if (items[r][0])
					result += items[r][0];
				if (items[0][0] || items[r][0])
					result += "\n";
				for (let c=1;c<n_cols;c++) {
					if (items[0][c] || items[r][c])
						result += "  * ";
					if (items[0][c]) {
						result += items[0][c];
						result += ": ";
					}
					if (items[r][c])
						result += items[r][c];
					if (items[0][c] || items[r][c])
						result += "\n";
				}
			}
		}

		return result;
	}

}