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
				/\[[^\]]*\]\(#cite_ref[^\)]+\)/g
			],
			replace: [
				{
					find: /\(https:\/\/upload.wikimedia.org\/wikipedia\/([^\/]+)\/thumb\/([^\)]+\..{3,4})\/[^\)]+\)/ig,
					replacement: '(https://upload.wikimedia.org/wikipedia/$1/$2)'
				},
				{
					find: /\n\n([^\n]+)\n\-{40,}\n/ig,
					replacement: (match, title) => {
						return '\n\n'+title+'\n'+'-'.repeat(title.length)+'\n'
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
				}
			]
		}
	], 

	filter: function (url, data, links=true) {
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

		// this filter needs to be defined here, to access the URL
		data = data.replaceAll(/\[([^\]]*)\]\(\/([^\/][^\)]*)\)/g,
 			(match, title, address) => {
				return "["+title+"]("+base_address+"/"+address+")";
  			}
		);

		// removes inline links and refs
		if (!links) {
			data = data.replaceAll(/([^!])\[\[?([^\]]+\]?)\]\([^\)]+\)/g, '$1*$2*');
			data = data.replaceAll(/\*\\\[([^\\]+)\\\]\*/g, '[$1]');
		}

		return data;
	}

}
