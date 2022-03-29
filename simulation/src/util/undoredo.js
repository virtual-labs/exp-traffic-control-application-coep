/**
 * Author : Harshal Chaudhari
 * 	
 * Nov 1-2012	
 */

draw2d.Toolundo = function(obj) {
	draw2d.Button.call(this, obj);
	this.setDimension(26, 25);
	this.setTooltip("undo");
};
draw2d.Toolundo.prototype = new draw2d.Button();
draw2d.Toolundo.prototype.type = "undo";
draw2d.Toolundo.prototype.url = "assert/images/undo";
draw2d.Toolundo.prototype.execute = function() {
	if($("#btnRunmode").val() == "OffMode") {
		if(this.palette.workflow.commandStack.getUndoLabel() === "delete figure") {
			var len = this.palette.workflow.commandStack.undostack.length;
			if(this.palette.workflow.commandStack.undostack[len - 1].figure.type == "draw2d.Node") {
				DCSSPACE.view.blockView.prototype.ExtendSequenceNo(this.palette.workflow.commandStack.undostack[len - 1].figure.getSequenceNo());
				DCSSPACE.collection.get(tab_id).get("functionBlockCollection").add(this.palette.workflow.commandStack.undostack[len - 1].figure.model);
				DCSSPACE.collection.get(tab_id).get("functionBlockCollection").sort();
				var SortedCollection = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").sortAsc(DCSSPACE.collection.get(tab_id).get("functionBlockCollection"));
				DCSSPACE.collection.get(tab_id).get("functionBlockCollection").models = SortedCollection;
			} else if(this.palette.workflow.commandStack.undostack[len - 1].figure.type == "draw2d.nodeConnetion") {
				var Sourcemodel = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(this.palette.workflow.getCommandStack().undostack[len - 1].figure.sourcePort.parentNode.getId());
				var connectionsrc = Sourcemodel.get("target");
				connectionsrc.push(this.palette.workflow.commandStack.undostack[len - 1].figure.getTarget().parentNode.getLabel());
				Sourcemodel.set({
					"target" : connectionsrc
				})
				//get Targetmodel and set source attribute
				var Targetemodel = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(this.palette.workflow.commandStack.undostack[len - 1].figure.targetPort.parentNode.getId());
				var connectiontarget = Targetemodel.get("source");
				connectiontarget.push(this.palette.workflow.commandStack.undostack[len - 1].figure.getSource().parentNode.getLabel());
				Targetemodel.set({
					"source" : connectiontarget
				});
				var node = this.palette.workflow.commandStack.undostack[len - 1].figure.targetPort.parentNode;
				if(node.getnodeName() == "ADD" || node.getnodeName() == "SUB" || node.getnodeName() == "MUL" || node.getnodeName() == "DIV" || node.getnodeName() == "AND" || node.getnodeName() == "OR") {
					node.addPort(this.palette.workflow.commandStack.undostack[len - 1].figure.removedInputPort, this.palette.workflow.commandStack.undostack[len - 1].figure.removedInputPort.originX, this.palette.workflow.commandStack.undostack[len - 1].figure.removedInputPort.originY);
				}
			}
			this.palette.workflow.commandStack.undo();
			//console.log(DCSSPACE.collection.toJSON());
		} else if(this.palette.workflow.commandStack.getUndoLabel() === "create connection") {
			var len = this.palette.workflow.commandStack.undostack.length;
			var srcmodel = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(this.palette.workflow.commandStack.undostack[len - 1].source.parentNode.getId());
			//get source model
			var targetmodel = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(this.palette.workflow.commandStack.undostack[len - 1].target.parentNode.getId());
			//get target model
			var srcarray = srcmodel.get('target');
			//get source model target attribute to remove target
			var tararray = targetmodel.get('source');
			// get target model source attribute to remove source
			if(this.palette.workflow.commandStack.undostack[len - 1].source.parentNode.getnodeName() == "CMP") {
				var index = srcarray.indexOf(this.palette.workflow.commandStack.undostack[len - 1].target.parentNode.getLabel() + "-" + this.palette.workflow.commandStack.undostack[len - 1].source.name);
				var indx = tararray.indexOf(this.palette.workflow.commandStack.undostack[len - 1].source.parentNode.getLabel() + "-" + this.palette.workflow.commandStack.undostack[len - 1].source.name)
			} else if(this.palette.workflow.commandStack.undostack[len - 1].target.parentNode.getnodeName() == "CMP" || this.palette.workflow.commandStack.undostack[len - 1].target.parentNode.getnodeName() == "LIM") {
				var index = srcarray.indexOf(this.palette.workflow.commandStack.undostack[len - 1].target.parentNode.getLabel() + "-" + this.palette.workflow.commandStack.undostack[len - 1].target.name);
				var indx = tararray.indexOf(this.palette.workflow.commandStack.undostack[len - 1].source.parentNode.getLabel() + "-" + this.palette.workflow.commandStack.undostack[len - 1].target.name)
			} else {
				var index = srcarray.indexOf(this.palette.workflow.commandStack.undostack[len - 1].target.parentNode.getLabel());
				var indx = tararray.indexOf(this.palette.workflow.commandStack.undostack[len - 1].source.parentNode.getLabel())
			}
			//iterate through source array to remove target
			/*for( i = 0; i < srcarray.length; i++) {
			 if(srcarray[i] === targetmodel.get('id')) {//check if target model id is present in source model target attributeSSSSSSSS
			 srcarray.splice(i, 1);
			 //remove matching element from array
			 }
			 }
			 //iterate through target array to remove source
			 for( j = 0; j < tararray.length; j++) {
			 if(tararray[j] === srcmodel.get('id')) {//check if source model id is present in target model source attribute
			 tararray.splice(j, 1);
			 //remove matching element from array
			 }
			 }*/
			if(index != -1)
				srcarray.splice(index, 1);
			if(indx != -1)
				tararray.splice(indx, 1);
			srcmodel.set({
				target : srcarray
			});
			//set new updated target attribute of source model
			targetmodel.set({
				source : tararray
			});
			//set new updated source attribute of target model
			var target = this.palette.workflow.commandStack.undostack[len - 1].target.parentNode;
			if(target.getnodeName() == "ADD" || target.getnodeName() == "SUB" || target.getnodeName() == "MUL" || target.getnodeName() == "DIV" || target.getnodeName() == "AND" || target.getnodeName() == "OR") {
				this.palette.workflow.commandStack.undostack[len - 1].connection.removedInputPort = target.removePortsatRuntime(target, target.getnodeName(), this.palette.workflow.commandStack.undostack[len - 1].target);
			}
			//set new updated source attribute of target model
			this.palette.workflow.commandStack.undo();
			//console.log(DCSSPACE.collection.toJSON());
		} else if(this.palette.workflow.commandStack.getUndoLabel() === "add figure") {
			var len = this.palette.workflow.commandStack.undostack.length;
			DCSSPACE.collection.get(tab_id).get("functionBlockCollection").remove(this.palette.workflow.commandStack.undostack[len - 1].figure.model);
			this.palette.workflow.commandStack.undo();
			//console.log(DCSSPACE.collection.toJSON());
		} else {
			this.palette.workflow.commandStack.undo();
		}
	}
}

draw2d.Toolundo.prototype.getImageUrl = function() {
	return this.url + ".jpeg";
};

draw2d.Toolredo = function(obj) {
	draw2d.Button.call(this, obj);
	this.setDimension(26, 25);
	this.setTooltip("redo");
};
draw2d.Toolredo.prototype = new draw2d.Button();
draw2d.Toolredo.prototype.type = "undo";
draw2d.Toolredo.prototype.url = "assert/images/redo";
draw2d.Toolredo.prototype.execute = function() {
	//this.palette.workflow.getCommandStack().redo();
	if(this.palette.workflow.getCommandStack().getRedoLabel() === "delete figure") {
		var len = this.palette.workflow.getCommandStack().redostack.length;
		if(this.palette.workflow.commandStack.redostack[len - 1].figure.type == "draw2d.Node") {
			this.palette.workflow.getCommandStack().redostack[len - 1].figure.model = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(this.palette.workflow.getCommandStack().redostack[len - 1].figure.getId());
			DCSSPACE.view.blockView.prototype.ReduceSequenceNo(this.palette.workflow.commandStack.redostack[len - 1].figure.getSequenceNo() + 1)// Update Sequence Number of block
			// add model to current figure to retrive at undo operation
			DCSSPACE.collection.get(tab_id).get("functionBlockCollection").remove(this.palette.workflow.getCommandStack().redostack[len - 1].figure.getId());
			// remove model from collection
		} else if(this.palette.workflow.commandStack.redostack[len - 1].figure.type == "draw2d.nodeConnetion") {
			var Sourcemodel = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(this.palette.workflow.getCommandStack().redostack[len - 1].figure.sourcePort.parentNode.getId());
			var connectionsrc = Sourcemodel.get("target");
			//connectionsrc.push(this.commandStack.redostack[len - 1].figure.getTarget().parentNode.getheader());
			var index = connectionsrc.indexOf(this.palette.workflow.commandStack.redostack[len - 1].figure.getTarget().parentNode.getLabel());
			// if element exist then remove
			if(index != -1) {
				connectionsrc.splice(index, 1);
			}
			Sourcemodel.set({
				"target" : connectionsrc
			})
			//get Targetmodel and set source attribute
			var Targetemodel = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(this.palette.workflow.commandStack.redostack[len - 1].figure.targetPort.parentNode.getId());
			var connectiontarget = Targetemodel.get("source");
			var indx = connectiontarget.indexOf(this.palette.workflow.commandStack.redostack[len - 1].figure.getSource().parentNode.getLabel())
			// if element exist then remove
			if(indx != -1) {
				connectiontarget.splice(indx, 1);
			}
			Targetemodel.set({
				"source" : connectiontarget
			});
			var targetNode = this.palette.workflow.commandStack.redostack[len - 1].figure.targetPort.parentNode;
			if(targetNode.getnodeName() == "ADD" || targetNode.getnodeName() == "SUB" || targetNode.getnodeName() == "MUL" || targetNode.getnodeName() == "DIV" || targetNode.getnodeName() == "AND" || targetNode.getnodeName() == "OR") {
				this.palette.workflow.commandStack.redostack[len - 1].figure.removedInputPort = targetNode.removePortsatRuntime(targetNode, targetNode.getnodeName(), this.palette.workflow.commandStack.redostack[len - 1].figure.targetPort);
			}
		}
		this.palette.workflow.getCommandStack().redo();
		//console.log(DCSSPACE.collection.toJSON());
	} else if(this.palette.workflow.commandStack.getRedoLabel() === "create connection") {
		var len = this.palette.workflow.commandStack.redostack.length;
		var srcmodel = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(this.palette.workflow.commandStack.redostack[len - 1].source.parentNode.getId());
		//get source model
		var tarmodel = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(this.palette.workflow.commandStack.redostack[len - 1].target.parentNode.getId());
		//get target model
		var srcarray = srcmodel.get("target");
		//get source model target attribute to remove target
		var tararray = tarmodel.get("source");
		// get target model ssource attribute to remove source
		if(this.palette.workflow.commandStack.redostack[len - 1].source.parentNode.getnodeName() == "CMP") {
			srcarray.push(this.palette.workflow.commandStack.redostack[len - 1].target.parentNode.getLabel() + "-" + this.palette.workflow.commandStack.redostack[len - 1].source.name);
			tararray.push(this.palette.workflow.commandStack.redostack[len - 1].source.parentNode.getLabel() + "-" + this.palette.workflow.commandStack.redostack[len - 1].source.name)
		} else if(this.palette.workflow.commandStack.redostack[len - 1].target.parentNode.getnodeName() == "CMP" || this.palette.workflow.commandStack.redostack[len - 1].target.parentNode.getnodeName() == "LIM") {
			srcarray.push(this.palette.workflow.commandStack.redostack[len - 1].target.parentNode.getLabel() + "-" + this.palette.workflow.commandStack.redostack[len - 1].target.name);
			tararray.push(this.palette.workflow.commandStack.redostack[len - 1].source.parentNode.getLabel() + "-" + this.palette.workflow.commandStack.redostack[len - 1].target.name)
		} else {
			srcarray.push(this.palette.workflow.commandStack.redostack[len - 1].target.parentNode.getLabel());
			//Push target attrubute name in sourcearray
			tararray.push(this.palette.workflow.commandStack.redostack[len - 1].source.parentNode.getLabel());
			//Push source attrubute name in targetarray
		}
		//srcarray.push(this.palette.workflow.commandStack.redostack[len - 1].target.parentNode.getheader());
		//Push target attrubute name in sourcearray
		//tararray.push(this.palette.workflow.commandStack.redostack[len - 1].source.parentNode.getheader());
		//Push source attrubute name in targetarray
		srcmodel.set({
			"target" : srcarray
		});
		tarmodel.set({
			"source" : tararray
		});
		var targetNode = this.palette.workflow.commandStack.redostack[len - 1].target.parentNode;
		if(targetNode.getnodeName() == "ADD" || targetNode.getnodeName() == "SUB" || targetNode.getnodeName() == "MUL" || targetNode.getnodeName() == "DIV" || targetNode.getnodeName() == "AND" || targetNode.getnodeName() == "OR") {
			targetNode.addPort(this.palette.workflow.commandStack.redostack[len - 1].connection.removedInputPort, this.palette.workflow.commandStack.redostack[len - 1].connection.removedInputPort.originX, this.palette.workflow.commandStack.redostack[len - 1].connection.removedInputPort.originY);
		}
		this.palette.workflow.commandStack.redo();
		//console.log(DCSSPACE.collection.toJSON());
	} else if(this.palette.workflow.commandStack.getRedoLabel() === "add figure") {
		var len = this.palette.workflow.commandStack.redostack.length;
		DCSSPACE.collection.get(tab_id).get("functionBlockCollection").add(this.palette.workflow.commandStack.redostack[len - 1].figure.model);
		this.palette.workflow.commandStack.redo();
		//console.log(DCSSPACE.collection.toJSON());
	} else {
		this.palette.workflow.getCommandStack().redo();
	}
	//draw2d.ToolGeneric.prototype.execute.call(this);
}

draw2d.Toolredo.prototype.getImageUrl = function() {
	return this.url + ".jpeg";
};
