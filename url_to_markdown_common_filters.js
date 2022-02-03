var urlparser = require('url');

module.exports = {

	list: [
		{
			domain: /.*/,
			remove: [
				/\[¶\]\(#[^\s]+\s+"[^"]+"\)/g
			],
			replace: [
				{
					find: /\[([^\]]*)\]\(\/\/([^\)]*)\)/g,
					replacement: '[$1](https:$2)'
				}
			]
		},
		{
			domain: /.*\.wikipedia\.org/,
			remove: [
				/\*\*\[\^\]\(#cite_ref[^\)]+\)\*\*/g,
				/(?:\\\[)?\[edit\]\([^\s]+\s+"[^"]+"\)(?:\\\])?/ig
			]
		},
		{
			domain: /(?:.*\.)?medium\.com/,
			replace: [
				{
					find: '(https://miro.medium.com/max/60/',
					replacement: '(https://miro.medium.com/max/600/'
				}
			]
		}
	], 

	filter: function (url, data) {
		let domain = urlparser.parse(url).hostname  	  	
		for (let i=0;i<this.list.length;i++) {
			if (domain.match(this.list[i].domain)) {
				if (this.list[i].remove) {
					for (let j=0;j<this.list[i].remove.length; j++) {
						data = data.replaceAll(this.list[i].remove[j],"");
					}
				}
				if (this.list[i].replace) {
					for (let j=0;j<this.list[i].replace.length; j++) {
						data = data.replaceAll(this.list[i].replace[j].find,
							this.list[i].replace[j].replacement);
					}
				}
			}
		}
		return data;
	}

}