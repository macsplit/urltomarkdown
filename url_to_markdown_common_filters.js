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
				replacement: '[$1](https://$2)'
				}
			]
		},
		{
			domain: /.*\.wikipedia\.org/,
			remove: [
				/\*\*\[\^\]\(#cite_ref[^\)]+\)\*\*/g,
				/(?:\\\[)?\[edit\]\([^\s]+\s+"[^"]+"\)(?:\\\])?/ig,
				/\^\s\[Jump up to[^\)]*\)/ig,
				/\[[^\]]*\]\(#cite_ref[^\)]+\)/g,
				/\[\!\[Edit this at Wikidata\].*/g
			],
			replace: [
				{
					find: /\(https:\/\/upload.wikimedia.org\/wikipedia\/([^\/]+)\/thumb\/([^\)]+\..{3,4})\/[^\)]+\)/ig,
					replacement: '(https://upload.wikimedia.org/wikipedia/$1/$2)'
				},
				{
					find: /\n(.+)\n\-{32,}\n/ig,
					replacement: (match, title) => {
						return '\n'+title+'\n'+'-'.repeat(title.length)+'\n'
					}
				}

			]
		},
		{
			domain: /(?:.*\.)?medium\.com/,
			replace: [
				{
					find: '(https://miro.medium.com/max/60/',
					replacement: '(https://miro.medium.com/max/600/'
				},
				{
					find: /\s*\[\s*!\[([^\]]+)\]\(([^\)]+)\)\s*\]\(([^\?\)]*)\?[^\)]*\)\s*/g,
					replacement: '\n![$1]($2)\n[$1]($3)\n\n'
				}
			]
		},
		{
			domain: /(?:.*\.)?stackoverflow\.com/,
			remove: [
				/\* +Links(.|\r|\n)*Three +\|/g
			]
		}
	],

	filter: function (url, data, ignore_links=false) {
		let domain='';
		let base_address='';
		if (url) {
			url = new URL(url);
			if (url) {
				base_address = url.protocol+"//"+url.hostname;
				domain = url.hostname;
			}
		}

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

		// make relative URLs absolute
		data = data.replaceAll(/\[([^\]]*)\]\(\/([^\/][^\)]*)\)/g,
 			(match, title, address) => {
				return "["+title+"]("+base_address+"/"+address+")";
  			}
		);

		// remove inline links and refs
		if (ignore_links) {
			data = data.replaceAll(/\[\[?([^\]]+\]?)\]\([^\)]+\)/g, '$1');
			data = data.replaceAll(/[\\\[]+([0-9]+)[\\\]]+/g, '[$1]');
		}

		return data;
	}

}
