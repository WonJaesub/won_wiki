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
		var ret = "<table>";
		contents = contents.trim();
		contents = contents.split(/\r\n/);
		contents.forEach(function(content) {
			ret += "<tr>";
			content = content.trim().replace(/\|\|([^|\r\n]+)/g, function(mat, conts, off, in_string) {
				console.log(conts);
				conts = conts.trim();
				return "<td>"+conts+"</td>";
			});
			ret += content;
			ret += "</tr>";
		});
		ret += "</table>";
		return ret;
	});
	//console.log(result);
	
	result = result.replace(/\r\n/g, "<br>");
	//result = result.replace(/\\/g, '');
	result = result.replace(/\\([\[\]\|\=\-\'\"])/g, '$1');
	
	return result;
}

module.exports = edit;