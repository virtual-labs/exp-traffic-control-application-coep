/**
 * Author : Harshal Chaudhari
 *
 * Nov 1-2012
 ** Create draw2d.Connection() object and add context menu on connection object
 */

draw2d.nodeConnection = function(src, target) {
	draw2d.Connection.call(this);
	this.parent = src.parentNode;
	this.sourcePort = src;
	this.targetPort = target;
	this.setCanDrag(false);
	this.setSelectable(true);
	this.lineSegments = [];
	this.setColor(new draw2d.Color(0, 255, 0));
	this.setLineWidth(2);
	this.sourceAnchor.setOwner(src);
	this.targetAnchor.setOwner(target);
	//this.setRouter(new draw2d.FanConnectionRouter());
	//this.outputlbl = new draw2d.Label("?");
	//this.outputlbl.setId("OutputLabel");
	//this.addFigure(this.outputlbl, new draw2d.StartConnectionLocator(this));
	this.Inputlbl = new draw2d.Label("?");
	this.Inputlbl.setId("InputLabel");
	this.addFigure(this.Inputlbl, new draw2d.StartConnectionLocator(this));
	this.arrowConnector = new draw2d.ArrowConnectionDecorator();
	this.arrowConnector.setBackgroundColor(new draw2d.Color(0, 255, 0));
	this.setTargetDecorator(this.arrowConnector);
	// set arrow at target side

};
draw2d.nodeConnection.prototype = new draw2d.Connection();
draw2d.nodeConnection.prototype.type = "draw2d.nodeConnetion";
// Set workflow area for connection
draw2d.nodeConnection.prototype.setWorkflow = function(workspace) {
	draw2d.Connection.prototype.setWorkflow.call(this, workspace);
};

draw2d.nodeConnection.prototype.getLabel = function(flag) {
	//var label = flag ? this.outputlbl : this.Inputlbl;
	return this.Inputlbl;
};
draw2d.nodeConnection.prototype.getNodeConnection = function() {
	return this;
};
//context menu on connection line
draw2d.nodeConnection.prototype.getContextMenu = function() {
	var menu = new draw2d.Menu();
	var oThis = this;
	if($("#btnRunmode").val() == "OffMode" && DCSSPACE.workflow.isEnabled()) {
		menu.appendMenuItem(new draw2d.MenuItem("Disconnect", null, function() {
			var labelInSourceNode, labelInTargetnode, index, indx;
			var sourceNodeName = oThis.sourcePort.parentNode.getheader() + "-" + oThis.sourcePort.parentNode.getSequenceNo();
			var targetNodeName = oThis.targetPort.parentNode.getheader() + "-" + oThis.targetPort.parentNode.getSequenceNo();
			$("#delete-confirm").html('Do you want to remove connection from ' + sourceNodeName + ' to ' + targetNodeName + '?').dialog({
				resizable : false,
				title : 'Confirm Deletion',
				height : 150,
				width : 350,
				modal : true,
				draggable : false,
				buttons : {
					"Delete" : function() {
						var sourcemodel = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(oThis.sourcePort.parentNode.getId());
						//get source model
						var targetmodel = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(oThis.targetPort.parentNode.getId());
						// get target model
						// get type of objects
						var sourceNode = sourcemodel.get("blockid").split("-")[0];
						var targetNode = targetmodel.get("blockid").split("-")[0];
						var src = sourcemodel.get("target");
						// get source array of source node model
						var tar = targetmodel.get("source");
						// get target array of target node model
						if(sourcemodel != null && targetmodel != null) {
							if(sourceNode == "CMP") {
								labelInSourceNode = oThis.targetPort.parentNode.getLabel() + "-" + oThis.sourcePort.name;
								//get label from source node
								labelInTargetnode = oThis.sourcePort.parentNode.getLabel() + "-" + oThis.sourcePort.name// get label from target node
							} else if(targetNode == "CMP" || targetNode == "LIM") {
								labelInSourceNode = oThis.targetPort.parentNode.getLabel() + "-" + oThis.targetPort.name;
								labelInTargetnode = oThis.sourcePort.parentNode.getLabel() + "-" + oThis.targetPort.name;
							} else {
								labelInSourceNode = oThis.targetPort.parentNode.getLabel();
								labelInTargetnode = oThis.sourcePort.parentNode.getLabel();
							}
							index = src.indexOf(labelInSourceNode);
							// get index if label is already exist in source array
							indx = tar.indexOf(labelInTargetnode);
							//get index if label is already exist in target array
							src.splice(index, 1);
							tar.splice(indx, 1);
							sourcemodel.set({// set source model target attribute
								"target" : src
							});
							targetmodel.set({
								"source" : tar
							});
						}
						/*
						 * call removePort(), pass parameter as NodeObj name if name is ADD, SUB, MUL, DIV, AND, OR then remove port.
						 */
						oThis.removePort(sourceNode);
						oThis.removePort(targetNode);
						oThis.workflow.getCommandStack().execute(new draw2d.CommandDelete(oThis));
						$(this).dialog("close");
					},
					Cancel : function() {
						$(this).dialog("close");
					}
				}
			});
			/*
			 var txt = 'Do you want to remove connection from ' + sourceNodeName + ' to ' + targetNodeName + '?';
			 $.prompt(txt, {
			 buttons : {
			 Delete : true,
			 Cancel : false
			 },
			 callback : function(e, v, m, f) {
			 if(v) {
			 var sourcemodel = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(oThis.sourcePort.parentNode.getId());
			 //get source model
			 var targetmodel = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(oThis.targetPort.parentNode.getId());
			 // get target model
			 // get type of objects
			 var sourceNode = sourcemodel.get("blockid").split("-")[0];
			 var targetNode = targetmodel.get("blockid").split("-")[0];
			 var src = sourcemodel.get("target");
			 // get source array of source node model
			 var tar = targetmodel.get("source");
			 // get target array of target node model
			 if(sourcemodel != null && targetmodel != null) {
			 if(sourceNode == "CMP") {
			 labelInSourceNode = oThis.targetPort.parentNode.getLabel() + "-" + oThis.sourcePort.name;
			 //get label from source node
			 labelInTargetnode = oThis.sourcePort.parentNode.getLabel() + "-" + oThis.sourcePort.name// get label from target node
			 } else if(targetNode == "CMP" || targetNode == "LIM") {
			 labelInSourceNode = oThis.targetPort.parentNode.getLabel() + "-" + oThis.targetPort.name;
			 labelInTargetnode = oThis.sourcePort.parentNode.getLabel() + "-" + oThis.targetPort.name;
			 } else {
			 labelInSourceNode = oThis.targetPort.parentNode.getLabel();
			 labelInTargetnode = oThis.sourcePort.parentNode.getLabel();
			 }
			 index = src.indexOf(labelInSourceNode);
			 // get index if label is already exist in source array
			 indx = tar.indexOf(labelInTargetnode);
			 //get index if label is already exist in target array
			 src.splice(index, 1);
			 tar.splice(indx, 1);
			 sourcemodel.set({// set source model target attribute
			 "target" : src
			 });
			 targetmodel.set({
			 "source" : tar
			 });
			 }
			 /*
			 * call removePort(), pass parameter as NodeObj name if name is ADD, SUB, MUL, DIV, AND, OR then remove port.
			 /
			 oThis.removePort(sourceNode);
			 oThis.removePort(targetNode);

			 oThis.workflow.getCommandStack().execute(new draw2d.CommandDelete(oThis));
			 }
			 }
			 });*/

			/*
			 var ans = confirm("Delete connection from " + sourceNodeName + " to " + targetNodeName);
			 if(ans == true) {
			 var sourcemodel = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(oThis.sourcePort.parentNode.getId());
			 //get source model
			 var targetmodel = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(oThis.targetPort.parentNode.getId());
			 // get target model
			 // get type of object
			 var sourceNode = sourcemodel.get("blockid").split("-")[0];
			 var targetNode = targetmodel.get("blockid").split("-")[0];
			 var src = sourcemodel.get("target");
			 // get source array of source node model
			 var tar = targetmodel.get("source");
			 // get target array of target node model
			 if(sourcemodel != null && targetmodel != null) {
			 if(sourceNode == "CMP") {
			 labelInSourceNode = oThis.targetPort.parentNode.getLabel() + "-" + oThis.sourcePort.name;
			 //get label from source node
			 labelInTargetnode = oThis.sourcePort.parentNode.getLabel() + "-" + oThis.sourcePort.name// get label from target node
			 } else if(targetNode == "CMP" || targetNode == "LIM") {
			 labelInSourceNode = oThis.targetPort.parentNode.getLabel() + "-" + oThis.targetPort.name;
			 labelInTargetnode = oThis.sourcePort.parentNode.getLabel() + "-" + oThis.targetPort.name;
			 } else {
			 labelInSourceNode = oThis.targetPort.parentNode.getLabel();
			 labelInTargetnode = oThis.sourcePort.parentNode.getLabel();
			 }
			 index = src.indexOf(labelInSourceNode);
			 // get index if label is already exist in source array
			 indx = tar.indexOf(labelInTargetnode);
			 //get index if label is already exist in target array
			 src.splice(index, 1);
			 tar.splice(indx, 1);
			 sourcemodel.set({// set source model target attribute
			 "target" : src
			 });
			 targetmodel.set({
			 "source" : tar
			 });
			 }
			 /*
			 * call removePort(), pass parameter as NodeObj name if name is ADD, SUB, MUL, DIV, AND, OR then remove port.
			 /
			 oThis.removePort(sourceNode);
			 oThis.removePort(targetNode);

			 oThis.workflow.getCommandStack().execute(new draw2d.CommandDelete(oThis));
			 }*/

		}));
		menu.appendMenuItem(new draw2d.MenuItem("Blue", null, function() {
			oThis.setColor(new draw2d.Color(0, 0, 255));
			oThis.arrowConnector.setBackgroundColor(new draw2d.Color(0, 0, 255));
			oThis.paint();
		}));
		menu.appendMenuItem(new draw2d.MenuItem("Green", null, function() {
			oThis.setColor(new draw2d.Color(0, 255, 0));
			oThis.arrowConnector.setBackgroundColor(new draw2d.Color(0, 255, 0));
			oThis.paint();
		}));

		menu.appendMenuItem(new draw2d.MenuItem("Black", null, function() {
			oThis.setColor(new draw2d.Color(0, 0, 0));
			oThis.arrowConnector.setBackgroundColor(new draw2d.Color(0, 0, 0));
			oThis.paint();
		}));
	}
	return menu;
};
draw2d.nodeConnection.prototype.removePort = function(nodeName) {
	switch(nodeName) {
		case "ADD":
		case "SUB":
		case "MUL":
		case "DIV":
		case "AND":
		case "OR" :
			this.removedInputPort = this.parent.removePortsatRuntime(this.targetPort.parentNode, this.targetPort.parentNode.getnodeName(), this.targetPort);
			break;
	}
}
draw2d.nodeConnection.prototype.getConnectionAttrubutes = function() {
	var source = {
		node : this.getSource().getParent().getId(),
		Port : this.getSource().getName()
	}
	var target = {
		node : this.getTarget().getParent().getId(),
		Port : this.getTarget().getName()
	}
	return {
		type : this.type,
		id : this.id,
		Source : source,
		Target : target
	}
}
/* create a draw2d.ConnectionLocator to set position of I/O label */
draw2d.StartConnectionLocator = function(/*:draw2d.Connection*/connection) {
	draw2d.ConnectionLocator.call(this, connection);
};
draw2d.StartConnectionLocator.prototype = new draw2d.ConnectionLocator;
draw2d.StartConnectionLocator.prototype.type = "draw2d.ConnectionLocator";
/* Set position of I/O label */
draw2d.StartConnectionLocator.prototype.relocate = function(target) {
	//if(target.getId() === "OutputLabel")
	target.setPosition(this.connection.getStartX() + 5, this.connection.getStartY() - 20);
	//else
	//target.setPosition(this.connection.getEndX() - 30, this.connection.getEndY() - 15);
};
