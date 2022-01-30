const htmlEntities = require('html-entities');

module.exports = {

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

}