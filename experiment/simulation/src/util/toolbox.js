/**
 * Author : Harshal Chaudhari
 * 	
 * Nov 1-2012	
 */

//define(['undoRedo', 'saveXML', 'OpenXML'], function(){


draw2d.Toolbox = function() {
	draw2d.ToolPalette.call(this, "Tools");
	// Undo button
	this.undoTool = new draw2d.Toolundo(this);
	this.undoTool.setPosition(13, 6);
	this.undoTool.setEnabled(false);
	this.addChild(this.undoTool);
	//Redo button
	this.redoTool = new draw2d.Toolredo(this);
	this.redoTool.setPosition(50, 6);
	this.redoTool.setEnabled(false);
	this.addChild(this.redoTool);
	//SaveXML Button
	this.SaveXML = new draw2d.ToolSaveJSON(this);
	this.SaveXML.setPosition(100, 6);
	this.SaveXML.setEnabled(true);
	this.addChild(this.SaveXML);

	this.OpenXML = new draw2d.ToolOpenXML(this);
	this.OpenXML.setPosition(120, 6);
	this.OpenXML.setEnabled(true);
	this.addChild(this.OpenXML);
	
	this.setDimension(170, 53);
	this.setCanDrag(false);
	this.setBackgroundColor(new draw2d.Color(230, 230, 250));
};
draw2d.Toolbox.prototype = new draw2d.ToolPalette();
draw2d.Toolbox.prototype.type = "ToolBox";
draw2d.Toolbox.prototype.onSetDocumentDirty = function() {
	this.undoTool.setEnabled(this.workflow.getCommandStack().canUndo());
	this.redoTool.setEnabled(this.workflow.getCommandStack().canRedo());
};

//});