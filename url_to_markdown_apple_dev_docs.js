module.exports = {
	
	dev_references: [],


	dev_doc_url: function (url) {

		let query_parts = url.split('?');

		let queryless = query_parts[0];

		if (queryless.endsWith('/')) {
		    queryless = queryless.slice(0, -1)
		}

		let parts = queryless.split("/");

		let json_url = "https://developer.apple.com/tutorials/data";

		for (let i=3; i<parts.length;i++) {
		    json_url += "/" + parts[i];
		}
		json_url += ".json";

		return json_url;

	},

	parse_dev_doc_json: function (json, inline_title = true, ignore_links = false) {
		let text = "";

		if (inline_title) {
			if (typeof json.metadata !== 'undefined') {
				if (typeof json.metadata.title !== 'undefined') {
					text += "# "+json.metadata.title + "\n\n";
				}
			}
		}

		if (typeof json.references !== 'undefined') {
			this.dev_references = json.references;
		}	
	    if (typeof json.primaryContentSections !== 'undefined') {
    		text += this.process_sections(json.primaryContentSections, ignore_links);
		} else if (typeof json.sections !== 'undefined') {
    		text += this.process_sections(json.sections, ignore_links);
		}
	return text;
	},

	process_sections: function (sections, ignore_links) {
		let text = "";

		sections.forEach((section, i) => {

	        if (typeof section.kind !== 'undefined') {
	            if (section.kind == 'declarations') {
	                if (typeof section.declarations !== 'undefined') {
	                    section.declarations.forEach((declaration, i) => {

	                        if (typeof declaration.tokens !== undefined) {
	                            token_text = "";
	                            declaration.tokens.forEach((token, i) => {                          
	                                token_text += token.text;
	                            });
	                            text += token_text;
	                        }

	                        if (typeof declaration.languages !== undefined) {
	                        	if (declaration.languages.length) {
	                            	language_text = "\nLanguages: " + declaration.languages.join(', ');
	                            	text += " "+language_text;
	                        	}
	                        }

	                        if (typeof declaration.platforms !== undefined) {
	                            if (declaration.platforms.length) {
	                            	platform_text = "\nPlatforms: " + declaration.platforms.join(', ');
	                            	text += " "+platform_text;
	                        	}
	                        }
	                    });
	                    text += "\n\n";
	                }
	            } else if (section.kind == 'content') {
	            	text += this.process_content_section(section, ignore_links);
	            }
	        }

	        if (typeof section.title !== 'undefined') {
	            if (typeof section.kind !== 'undefined' && section.kind == 'hero') {
	                text += "# " + section.title + "\n";
	            } else {
	                text += "## " + section.title;
	            }
	        }


	        if (typeof section.content !== 'undefined') {
	            section.content.forEach((sectionContent, i) => {
	                if (typeof sectionContent.type !== 'undefined') {
	                    if (sectionContent.type == 'text') {
	                        text += sectionContent.text + "\n";
	                    }
	                }
	            });
	        }

	    });

	return text;
	
	},
	process_content_section(section, ignore_links) {
		text = "";
		section.content.forEach((content, i) => {
			
            if (typeof content.type != 'undefined') {
                if (content.type == 'paragraph') {
                    if (typeof content.inlineContent !== 'undefined') {
                        inline_text = "";
                        content.inlineContent.forEach((inline, i) => {                                  
                            if (typeof inline.type !== 'undefined') {
                                if (inline.type == "text") {
                                    inline_text += inline.text;
                                } else if (inline.type == "link") {
                                	if (ignore_links) {
                                		inline_text += inline.title;
                                	} else {
 	                                   inline_text += "["+inline.title+"]("+inline.destination+")";
                                	}
                                } else if (inline.type == "reference") {
                                	if (typeof inline.identifier !== 'undefined') {
	                                	if (typeof this.dev_references[inline.identifier] !== 'undefined') {
				                			inline_text += this.dev_references[inline.identifier].title;
				                		}
			                		}
                				} else if (inline.type == 'codeVoice') {
	            					if (typeof inline.code !== 'undefined') {
	            						inline_text += "`"+inline.code+"`";
	            					}
	            				}
                            }                                   
                        });
                        text += inline_text + "\n\n";
                    }
                } else if (content.type == 'codeListing') {                         
                    code_text = "\n```\n";
                    code_text += content.code.join("\n");
                    code_text += "\n```\n\n";
                    text += code_text;
                } else if (content.type == 'unorderedList') {
                	if (typeof content.items !== 'undefined') {
                		content.items.forEach((list_item, i) => {
                			text += "* " + this.process_content_section(list_item, ignore_links);
                		});
                	}
                } else if (content.type == 'orderedList') {
                	if (typeof content.items !== 'undefined') {
                		n=0;
                		content.items.forEach((list_item, i) => {
                			n = n + 1;
                			text += n + ". " + this.process_content_section(list_item, ignore_links);
                		});
                	}
                } else if (content.type == 'heading') {
	            	if (typeof content.level !== 'undefined' && typeof content.text !== 'undefined') {
	            		text += "#".repeat(content.level);
	            		text += " " + content.text + "\n\n";
	            	}
	            }
            }
        });

        return text;
	}
}
