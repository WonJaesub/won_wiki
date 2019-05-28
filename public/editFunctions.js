function edit(text) {
	
	// delete backslash
	var result = text.replace(/\\"/g, "\"");
	
	// for file(picture)
	// [[file:attach/00.png|width=300]]
	result = result.replace(/\[\[file:([^\|\]]*?)\|width=([\d]*?)\]\]/g, 
			"<a class='wiki-link-internal' href='/w/$1' title='file:$1' rel='nofollow'>" +
			"<span class='wiki-image-align-normal' style='width:$2px;'>" +
			"<span class='wiki-image-wrapper' style='width: 100%;'>" +
			"<img class='wiki-image' width='100%' src='/s/$1' alt='file:$1'></span></span></a>");
	
	// for file(picture)
	// [[file:attach/00.png]]
	result = result.replace(/\[\[file:([^]*?)\]\]/g, 
			"<a class='wiki-link-internal' href='/w/$1' title='file:$1' rel='nofollow'>" +
			"<span class='wiki-image-align-normal'>" +
			"<span class='wiki-image-wrapper' style='width: 100%;'>" +
			"<img class='wiki-image' width='100%' src='/s/$1' alt='file:$1'></span></span></a>");
	
	// for link
	// [[asdf|qwer]] -> <a href="/w/asdf">qwer</a>
	result = result.replace(/\[\[([^\|\]]*?)\|([^\|]*?)\]\]/g, "<a href='/w/$1' title='$1'>$2</a>");
	
	// for link
	// [[asdf]] -> <a href="/w/asdf">asdf</a>
	result = result.replace(/\[\[([^\[\]]*)\]\]/g, "<a href='/w/$1' title='$1'>$1</a>");
	
	// for table
	result = result.replace(/(\|\|[\s\S]*?\|\|)\r\n\r\n/g, function(match, contents, offset, input_string) {
		var ret = "</div><div class='wiki-table-wrap'><table class='wiki-table'><tbody>";
		contents = contents.trim();
		contents = contents.split(/\r\n/);
		contents.forEach(function(content) {
			ret += "<tr>";
			content = content.trim().split(/\|\|/);
			for(var i=1; i<content.length-1; i++) {
				ret += "<td>" +content[i]+ "</td>";
			}
			ret += "</tr>";
		});
		ret += "</tbody></table></div><div class='wiki-paragraph'>";
		return ret;
	});
	
	// for hr
	result = result.replace(/-{4,9}\r\n/, function(match, contents, offset, input_string) {
		return "<hr class='wiki-hr-" + match.trim().length + "'>";
	});	
	
	// for br
	// [br] -> <br>
	result = result.replace(/\[br\]/g, "<br>");
	
	// for footnote
	// [* asdfasdfasdf]
	var footnote = [];
	var fn_count = 0;
	//var fn = result.match(/\[\* (.*?)\]/g);
	result = result.replace(/\[\*(.*?) (.*?)\]/g, function(match, capture1, capture2) {
		fn_count++;
		
		var re;
		var ret = "<a class='wiki-fn-content' title href='#fn-";
		if(capture1 === "")
		{
			footnote.push([fn_count, capture2]);
			re = fn_count;
		} else {
			footnote.push([capture1, capture2]);
			re = capture1;
		}
		ret += re + "' data-original-title>";
		ret += "<span class='target' id='rfn-" + fn_count + "'></span>[";
		ret += re + "]</a>";
		return ret;
	}); 
	
	result = result.replace(/\r\n/g, "<br>");
	//result = result.replace(/\\/g, '');
	result = result.replace(/\\([\[\]\|\=\-\'\"])/g, '$1');
	
	if(footnote.length !== 0) {
		result += "<div class='wiki-macro-footnote'>";
		for(var i=0; i<footnote.length; i++) {
			result += "<span class='footnote-list'><span class='target' id='fn-"+footnote[i][0]+"'></span>";
			result += "<a href='#rfn-"+(i+1)+"'>["+footnote[i][0]+"]</a> ";
			result += footnote[i][1] + "</span>";
		};
		result += "</div>";
	}
	
	return result;
}

module.exports = edit;