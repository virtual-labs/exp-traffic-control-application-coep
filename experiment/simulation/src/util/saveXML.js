
define(['SaveAndOpenJSONWriter'], function() {
	
draw2d.ToolSaveXML = function(Obj) {
	draw2d.Button.call(this, Obj);
	this.setDimension(26, 25);
	this.setTooltip("Save");
};
draw2d.ToolSaveXML.prototype = new draw2d.Button();
draw2d.ToolSaveXML.prototype.type = "ToolSaveXML";
draw2d.ToolSaveXML.prototype.url = "assert/images/SaveXML";
draw2d.ToolSaveXML.prototype.execute = function(x, y) {
	DCSSPACE.saveFigure = DCSSPACE.SaveAndOpenJSONWriter(DCSSPACE.workflow);
	//console.log(JSON.stringify(DCSSPACE.saveFigure));
	//console.log(DCSSPACE.saveFigure);
};
draw2d.ToolSaveXML.prototype.getImageUrl = function() {
	return this.url + ".jpg";
};
});