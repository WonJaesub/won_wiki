var express = require('express');
var router = express.Router();
var Content = require('../db/model/content');

function makeIndex(depthArray, stringArray, currentIndex, idx_string) {
	var retstr = "";
	for(; currentIndex<depthArray.length; currentIndex++) { 
		retstr += "<span class='toc-item'>" +
		          "<a href='#s-" + idx_string[currentIndex].substr(0, idx_string[currentIndex].length-1) + "'>" +
		          idx_string[currentIndex] + "</a> " + stringArray[currentIndex] + "</span>";
		if( (currentIndex+1 == depthArray.length) ||
			((currentIndex+1 < depthArray.length) && (depthArray[currentIndex] > depthArray[currentIndex+1]))) {
			return [retstr, currentIndex];
		} else if((currentIndex+1 < depthArray.length) && (depthArray[currentIndex] < depthArray[currentIndex+1])) {
			retstr += "<div class='toc-indent'>";
			var ret = makeIndex(depthArray, stringArray, currentIndex+1, idx_string);
			
			retstr += ret[0] + "</div>";
			currentIndex = ret[1];
		}
	}
	console.log(currentIndex);
	console.log(retstr);
	return [retstr, currentIndex];
}

/* GET home page. */
//router.get('/:userid', function(req, res, next) {
router.get( '/:title*' , function(req, res, next) {
	Content.findOne({title : req.params.title + req.params[0]}, function(err, content) {
		if(err){return next(err);}
	    if(content){
	    	var txt = "";
	    	var idx_string = new Array();
	    	if(content.idx !== null) {
	    		var idx_tmp = new Array();
	    		content.idx.forEach(function(con) {
	    			idx_tmp.push(con[1]);
	    		});
	    		var start_depth = 7;
	    		var q = [0,0,0,0,0,0,0];
	    		var before_depth = 0;
	    		idx_tmp.forEach(function(con) {
	    			if(con < start_depth)
	    				start_depth = con;
	    			if(before_depth != 0 && before_depth > con) {
	    				for (var i=con+1; i<q.length; i++) {
	    					q[i] = 0;
	    				}
	    			}
	    			q[con]++;
	    			rs = ""
	    			for(var i=start_depth; i<=con; i++) {
	    				rs += q[i] + ".";
	    			}
	    			idx_string.push(rs);
	    			before_depth = con;
	    		});
	    		txt += "<div class='wiki-heading-content'>" + content.content[0] + "</div>";
	    		for(var i=0; i<content.idx.length; i++) {
	    			txt+= "<h"+content.idx[i][1]+" class='wiki-heading' style='cursor: pointer;'>" + 
	    			"<a id='s-" + idx_string[i].substr(0, idx_string[i].length-1) + "' href='#toc'>" + 
	    			idx_string[i] + "</a> " + content.idx[i][0].replace(/(={1,6}) ([^=].*) \1/, "$2") + "</h2>";
	    			txt+= "<div class='wiki-heading-content'><div class='wiki-paragraph'>" + content.content[i+1] + "</div></div>";
	    		}
	    	} else { // idx is null
	    		txt = content.content.join('');
	    	}
	    	
	    	// 目次作り
	    	txt = txt.replace(/\[目次\]\r\n/g, function(match, contents, offset, input_string) {
	    		if(content.idx !== null) {
		    		var depthArray = new Array();
		    		var stringArray = new Array();
		    		content.idx.forEach(function(con) {
		    			stringArray.push(con[0].replace(/(={1,6}) ([^=].*) \1/, "$2"));
		    			depthArray.push(con[1]);
		    		});
		    		
		    		var retstr = "<div class='wiki-macro-toc' id='toc'><div class='toc-indent'>";
		    		var ret = makeIndex(depthArray, stringArray, 0, idx_string)
		    		retstr += ret[0] + "</div></div>";
		    		return retstr;
	    		} else {
	    			return "<div class='toc-indent'></div>";
	    		}
	    	});
	    	txt = require('../public/editFunctions')(txt);
	    	
	    	var text = txt;
	    	var idx = text.match(/(={1,6}) [^=]*? \1/g);
			
	    	text = text.split(/(={1,6}) [^=]*? \1/);
	    	// なんか分からない要素があってスライスする
	    	// 喫水インデックスに問題あり
	    	//console.log(idx);
	    	for (var i = 0; i < text.length; i++) { 
	    		text.splice(i + 1, 1); 
	    	} 
	    	//console.log(text);
	    	text = text.join('');
	    	text = text.replace(/(\|\|[\s\S]*?\|\|\r\n\r\n)/g, '');
	    	//console.log(text);
	    	
	    	
			
	    	return res.render('index', {title: content.title, content: txt, finalModifiedDate: content.finalModifiedDate});
	    } else {
	    	return res.render('notExist', {title: req.params.title + req.params[0]});
	    }
	}); // end of Content.findOne
});

module.exports = router;
