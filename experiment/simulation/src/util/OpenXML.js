/**
 * Author : Harshal Chaudhari
 * 	
 * Nov 1-2012	
 */


draw2d.ToolOpenXML = function(Obj) {
	draw2d.Button.call(this, Obj);
	this.setDimension(26, 25);
	this.setTooltip("Open");
};
draw2d.ToolOpenXML.prototype = new draw2d.Button();
draw2d.ToolOpenXML.prototype.type = "ToolOpenXML";
draw2d.ToolOpenXML.prototype.url = "assert/images/SaveXML";
draw2d.ToolOpenXML.prototype.execute = function() {
	DCSSPACE.saveConnection = DCSSPACE.JSONReader(DCSSPACE.workflow, DCSSPACE.saveFigure);
};
draw2d.ToolOpenXML.prototype.getImageUrl = function() {
	return this.url + ".jpg";
};
