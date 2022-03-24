/**
 * Author : Harshal Chaudhari
 *
 * Nov 1-2012
 */

draw2d.ButtonDelete = function(calledobj) {
	draw2d.Button.call(this, calledobj, 16, 16);
	this.setTooltip("Delete");
};
draw2d.ButtonDelete.prototype = new draw2d.Button();
draw2d.ButtonDelete.prototype.type = "ButtonDelete";
draw2d.ButtonDelete.prototype.url = "../assert/images/ButtonDelete";
draw2d.ButtonDelete.prototype.execute = function() {
	if($("#btnRunmode").val() == "OffMode") {
		var id = this.palette.workflow.currentSelection.getheader() + "-" + this.palette.workflow.currentSelection.getSequenceNo();
		var oThis = this;
		$("#delete-confirm").html('Are you sure you want to remove block ' + id + '?').dialog({
			resizable : false,
			title : 'Confirm Deletion',
			height : 120,
			width : 330,
			modal : true,
			draggable : false,
			buttons : {
				"Delete" : function() {
					oThis.palette.currentFigure.model = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(oThis.palette.currentFigure.getId());
					DCSSPACE.view.blockView.prototype.ReduceSequenceNo(oThis.palette.currentFigure.getSequenceNo() + 1);	// Update Sequence Number of block
					var sourcemodel = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(oThis.palette.currentFigure.getId());
					var sourceNode = sourcemodel.get("blockid").split("-")[0];
					var CurrentNodeLabel = sourcemodel.get("label");
					if(sourcemodel != null) {
					var models = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").models;
					$.each(models, function(j){
						var source = models[j].get("source");
						var target = models[j].get("target");
						var blockid = models[j].get("blockid");
						var block = models[j].get("block");
						if(source != null){
							for(var k=0; k< source.length; k++){
								if(blockid == "CMP" || blockid == "LIM"){
								if(source[k].split("-")[0] == CurrentNodeLabel){
									source.splice(k,1);
								}
							}else{
								if(CurrentNodeLabel.split("#")[0] == "CMP" || CurrentNodeLabel.split("#")[0] == "LIM"){
									if(source[k].split("-")[0] == CurrentNodeLabel){
										source.splice(k,1);
										k=k-1;
										if(blockid == "ADD" || blockid == "SUB" || blockid == "MUL" || blockid == "DIV" || blockid == "AND" || blockid == "OR"){
											removedInputPort =block.removePortsatRuntime(block, blockid, block.outputPort);
										}
									}
								}else{
									if(source[k] == CurrentNodeLabel){
										source.splice(k,1);
										if(blockid == "ADD" || blockid == "SUB" || blockid == "MUL" || blockid == "DIV" || blockid == "AND" || blockid == "OR"){
											removedInputPort =block.removePortsatRuntime(block, blockid, block.outputPort);
										}
									}
								}
							}
						}
						}
						if(target != null){
							for(var x=0; x< target.length; x++){
								if(blockid == "CMP" || blockid == "LIM"){
								if(target[x].split("-")[0] == CurrentNodeLabel){
									target.splice(x,1);
								}
								}else{
									if(CurrentNodeLabel.split("#")[0] == "CMP" || CurrentNodeLabel.split("#")[0] == "LIM"){
										if(target[x].split("-")[0] == CurrentNodeLabel){
											target.splice(x,1);
											x=x-1;
											if(blockid == "ADD" || blockid == "SUB" || blockid == "MUL" || blockid == "DIV" || blockid == "AND" || blockid == "OR"){
												removedInputPort =block.removePortsatRuntime(block, blockid, block.outputPort);
											}
										}
									}else{
										if(target[x] == CurrentNodeLabel){
											target.splice(x,1);
											if(blockid == "ADD" || blockid == "SUB" || blockid == "MUL" || blockid == "DIV" || blockid == "AND" || blockid == "OR"){
												removedInputPort =block.removePortsatRuntime(block, blockid, block.outputPort);
											}
										}
									}
									
								}
							}
						}
						models[j].set({
								"target" : target
						});
						models[j].set({
								"source" : source
						});
										
					});
				}
					
					DCSSPACE.collection.get(tab_id).get("functionBlockCollection").remove(DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(oThis.palette.currentFigure.getId()));
					//Remove model from collection
					oThis.palette.workflow.getCommandStack().execute(new draw2d.CommandDelete(oThis.palette.workflow.getCurrentSelection()));
					// delete current figure
					$(this).dialog("close");
				},
				Cancel : function() {
					$(this).dialog("close");
				}
			}
		});
		/*var ans = confirm("Do you want to delete " + blockName + " block");
		 if(ans) {
		 this.palette.currentFigure.model = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(this.palette.currentFigure.getId());
		 // add model into node object to retrive model at undo/redo
		 DCSSPACE.view.blockView.prototype.ReduceSequenceNo(this.palette.currentFigure.getSequenceNo() + 1);
		 // Update Sequence Number of block
		 DCSSPACE.collection.get(tab_id).get("functionBlockCollection").remove(DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(this.palette.currentFigure.getId()));
		 //Remove model from collection
		 this.palette.workflow.getCommandStack().execute(new draw2d.CommandDelete(this.palette.workflow.getCurrentSelection()));
		 // delete current figure
		 }*/

	} else {
		alert("Not allowed");
	}
};
draw2d.ButtonDelete.prototype.getImageUrl = function() {
	return this.url + ".jpeg";
};

draw2d.ButtonDelete.prototype.hide = function() {
	this.html.style.display = "none";
};
draw2d.ButtonDelete.prototype.show = function() {
	this.html.style.display = "block";
};