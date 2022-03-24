/**
 * Author : Harshal Chaudhari
 * 	
 * Nov 1-2012	
 */

//define(['SaveAndOpenJSONWriter'], function() {
	
draw2d.ToolSaveJSON = function(Obj) {
	draw2d.Button.call(this, Obj);
	this.setDimension(26, 25);
	this.setTooltip("Save");
};
draw2d.ToolSaveJSON.prototype = new draw2d.Button();
draw2d.ToolSaveJSON.prototype.type = "ToolSaveXML";
draw2d.ToolSaveJSON.prototype.url = "assert/images/SaveXML";
draw2d.ToolSaveJSON.prototype.execute = function(x, y) {
	DCSSPACE.saveFigure = DCSSPACE.SaveAndOpenJSONWriter(DCSSPACE.workflow);
	//console.log(JSON.stringify(DCSSPACE.saveFigure));
	//console.log(DCSSPACE.saveFigure);
};
draw2d.ToolSaveJSON.prototype.getImageUrl = function() {
	return this.url + ".jpg";
};
//});