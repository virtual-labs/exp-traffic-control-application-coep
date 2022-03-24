/**
 * Author : Harshal Chaudhari
 * 	
 * Nov 1-2012	
 */


draw2d.CommandChangeSequenceNo = function(canvas, figure) {
	this.label = "ChangeSequenceNo";
	this.oldSequenceNo = figure.sequenceNo;
	this.figure = figure;
	this.workflow = canvas;
}

draw2d.CommandChangeSequenceNo.prototype = new draw2d.Command();
draw2d.CommandChangeSequenceNo.prototype.type = "draw2d.Command";
draw2d.CommandChangeSequenceNo.prototype.execute = function() {
	//this.redo();
}
draw2d.CommandChangeSequenceNo.prototype.redo = function(){
	DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(this.figure.getId()).set({
		"sequenceNo" : this.newSequenceNo
	});
	DCSSPACE.view.blockView.prototype.updateView(this.figure); // Update Sequence Number of figure
}

draw2d.CommandChangeSequenceNo.prototype.undo = function(){
	this.newSequenceNo = this.figure.getSequenceNo();
	DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(this.figure.getId()).set({
		"sequenceNo" : this.oldSequenceNo
	});
	DCSSPACE.view.blockView.prototype.updateView(this.figure); // Update Sequence Number of figure
}
