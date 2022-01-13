var urlparser = require('url');

module.exports = {

	list: [
		{
			domain: /.*\.wikipedia\.org/,
			remove: [
				/(?:\\\[)?\[edit\]\([^\s]+\s+"[^"]+"\)(?:\\\])?/ig
			]
		}
	], 

  filter: function (url, data) {
	  let domain = urlparser.parse(url).hostname
	  for (let i=0;i<this.list.length;i++) {
	  	if (domain.match(this.list[i].domain)) {
	  		for (let j=0;j<this.list[i].remove.length; j++) {
	  			data = data.replace(this.list[i].remove[j],"");
	  		}
	  	}
	  }
	  return data;
  }

}