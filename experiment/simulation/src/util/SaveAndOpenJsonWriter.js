DCSSPACE.SaveAndOpenJSONWriter = function(canvas) {

	var result = [];
	var figures = canvas.getFigures();
	var i = 0;
	var f = null;
	for( i = 0; i < figures.getSize(); i++) {
		f = figures.get(i);
		if(f.type == "draw2d.Node")
			result.push(f);
	}
	var lines = canvas.getLines();
	for(var j = 0; j < lines.getSize(); j++) {
		result.push(lines.data[j]);
	}
	return result;
}