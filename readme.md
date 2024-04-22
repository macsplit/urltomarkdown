# Convert a webpage to markdown

Provides a web service that downloads a requested web page and outputs a markdown version.

Example request, supply url:

	GET https://urltomarkdown.herokuapp.com/?url=https%3A%2F%2Fwww.mozilla.org%2Fen-GB%2Ffirefox%2F

Response:

```
Meet our family of products
---------------------------

*   [![](https://www.mozilla.org/media/protocol/img/logos/firefox/browser/logo.eb1324e44442.svg)  

	...

[Join Firefox](https://accounts.firefox.com/signup?entrypoint=mozilla.org-firefox_home&form_type=button&utm_source=mozilla.org-firefox_home&utm_medium=referral&utm_campaign=firefox-home&utm_content=secondary-join-firefox) [Learn more about joining Firefox](https://www.mozilla.org/en-GB/firefox/accounts/)
```

Optionally request inline title:

	GET https://urltomarkdown.herokuapp.com/?url=https%3A%2F%2Fwww.mozilla.org%2Fen-GB%2Ffirefox%2F&title=true

Response:

```
# Firefox - Protect your life online with privacy-first products — Mozilla (UK)
Meet our family of products
---------------------------
	...
```

Title is also returned in HTTP header.

```
X-Title: Firefox%20-%20Protect%20your%20life%20online%20with%20privacy-first%20products%20%E2%80%94%20Mozilla%20(UK)
```

Optionally suppress links:

	GET https://urltomarkdown.herokuapp.com/?url=https%3A%2F%2Fwww.mozilla.org%2Fen-GB%2Ffirefox%2F&links=false

Alternative POST request, supply url and html in POST body:

	POST https://urltomarkdown.herokuapp.com/?title=true&links=false
		
		url=https%3A%2F%2Fwww.mozilla.org%2Fen-GB%2Ffirefox%2F
		
		html=%3C!doctype%20html%3E%3Chtml%20...

See [API Documentation](https://macsplit.github.io/urltomarkdown_docs.html)

Inspired by [Heck Yeah Markdown](http://heckyesmarkdown.com)

## Also of interest:

### Bookmarklet

A bookmarklet for SimpleNote on iOS/iPadOS (based on [simpleclip](https://gist.github.com/byrney/b21456682e77a0d51708)):

```
javascript:(
	function()
	{
		var request=new XMLHttpRequest();
		var url="https://urltomarkdown.herokuapp.com/?url="+encodeURIComponent(location.href);
		request.onreadystatechange=function()		{
			if(request.readyState==4&&request.status==200) {
				let text = '# ' + decodeURIComponent(request.getResponseHeader('X-Title')) +  '\n' + request.responseText;
				location.href="simplenote://new?content="+encodeURIComponent(text);

			}
		};
		request.open("GET",url, true);
		request.send();
		}
)();
```

### Safari Snippets

Using [Safari Snippets](https://apps.apple.com/us/app/safari-snippets/id1126048257)
 to inject the following code solves the issue that some sites prevent javascript bookmarklets accessing a resource on a different domain

```
var request=new XMLHttpRequest();
var herokuurl="https://urltomarkdown.herokuapp.com/";

request.onreadystatechange=function()	
{
		if(request.readyState==4&&request.status==200) {
		let text = '# ' + decodeURIComponent(request.getResponseHeader('X-Title')) +  '\n' + request.responseText;
		location.href="simplenote://new?content="+encodeURIComponent(text);
		}
};

request.open("POST", herokuurl, true);
request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
html=document.documentElement.innerHTML;
request.send("html="+encodeURIComponent(html)+"&url="+encodeURIComponent(window.location.href));
```
