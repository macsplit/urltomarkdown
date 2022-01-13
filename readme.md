# Convert a webpage to markdown

Provides a web service that downloads a requested web page and outputs a markdown version.

Example request:

	GET https://urltomarkdown.herokuapp.com/?url=https%3A%2F%2Fwww.mozilla.org%2Fen-GB%2Ffirefox%2F

Response:

	Meet our family of products
	---------------------------
	
	*   [![](https://www.mozilla.org/media/protocol/img/logos/firefox/browser/logo.eb1324e44442.svg)  
	
	...
	
	[Join Firefox](https://accounts.firefox.com/signup?entrypoint=mozilla.org-firefox_home&form_type=button&utm_source=mozilla.org-firefox_home&utm_medium=referral&utm_campaign=firefox-home&utm_content=secondary-join-firefox) [Learn more about joining Firefox](https://www.mozilla.org/en-GB/firefox/accounts/)

Inspired by [Heck Yeah Markdown](http://heckyesmarkdown.com)

## Also of interest:

A bookmarklet for SimpleNote on iOS/iPadOS (based on [simpleclip](https://gist.github.com/byrney/b21456682e77a0d51708)):

```
javascript:(
	function()
	{
		var request=new XMLHttpRequest();
		var url="https://urltomarkdown.herokuapp.com/?url="+encodeURIComponent(location.href);
		request.onreadystatechange=function()		{
			if(request.readyState==4&&request.status==200)			{
				location.href="simplenote://new?content="+encodeURIComponent(request.responseText);
			}
		};
		request.open("GET",url, true);
		request.send();
		}
)();
```
