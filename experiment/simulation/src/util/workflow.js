/**
 * Author : Harshal Chaudhari
 *
 * Nov 1-2012
 */

//define(['jquery', 'draw2d'], function() {

	draw2d.workflow = function(id) {
		draw2d.Workflow.call(this, id);
		this.enabled = true;

	};
	draw2d.workflow.prototype = new draw2d.Workflow();
	draw2d.workflow.prototype.type = "Workflow";
	draw2d.workflow.prototype.onKeyDown = function(_27aa, ctrl) {
		if($("#btnRunmode").val() == "OffMode") {
			if(_27aa == 46 && this.currentSelection !== null) {
				var labelInSourceNode, labelInTargetnode, index, indx;
				var SourceNodeName = this.currentSelection.parent.getheader() + "-" + this.currentSelection.parent.getSequenceNo();
				var TargetNodeName = this.currentSelection.targetPort.parentNode.getheader() + "-" + this.currentSelection.targetPort.parentNode.getSequenceNo();
				var oThis = this;
				$("#delete-confirm").html('Do you want to remove connection from ' + SourceNodeName + ' to ' + TargetNodeName + '?').dialog({
					resizable : false,
					title : 'Confirm Deletion',
					height : 150,
					width : 350,
					modal : true,
					draggable : false,
					buttons : {
						"Delete" : function() {
							var sourcemodel = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(oThis.currentSelection.parent.getId());
							//get source model
							var targetmodel = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(oThis.currentSelection.targetPort.parentNode.getId());
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
									labelInSourceNode = oThis.currentSelection.targetPort.parentNode.getLabel() + "-" + oThis.currentSelection.sourcePort.name;
									//get label from source node
									labelInTargetnode = oThis.currentSelection.sourcePort.parentNode.getLabel() + "-" + oThis.currentSelection.sourcePort.name// get label from target node
								} else if(targetNode == "CMP" || targetNode == "LIM") {
									labelInSourceNode = oThis.currentSelection.targetPort.parentNode.getLabel() + "-" + oThis.currentSelection.targetPort.name;
									labelInTargetnode = oThis.currentSelection.sourcePort.parentNode.getLabel() + "-" + oThis.currentSelection.targetPort.name;
								} else {
									labelInSourceNode = oThis.currentSelection.targetPort.parentNode.getLabel();
									labelInTargetnode = oThis.currentSelection.sourcePort.parentNode.getLabel();
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
							oThis.currentSelection.removePort(sourceNode);
							oThis.currentSelection.removePort(targetNode);
							oThis.commandStack.execute(oThis.currentSelection.createCommand(new draw2d.EditPolicy(draw2d.EditPolicy.DELETE)));
							$(this).dialog("close");
						},
						Cancel : function() {
							$(this).dialog("close");
						}
					}
				});

			} else {
				if(_27aa == 90 && ctrl) {
					if(this.commandStack.undostack.length > 0) {
						if(this.commandStack.getUndoLabel() === "delete figure") {
							var len = this.commandStack.undostack.length;
							if(this.commandStack.undostack[len - 1].figure.type == "draw2d.Node") {
								DCSSPACE.view.blockView.prototype.ExtendSequenceNo(this.commandStack.undostack[len - 1].figure.getSequenceNo());
								DCSSPACE.collection.get(tab_id).get("functionBlockCollection").add(this.commandStack.undostack[len - 1].figure.model);
								DCSSPACE.collection.get(tab_id).get("functionBlockCollection").sort();
								var SortedCollection = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").sortAsc(DCSSPACE.collection.get(tab_id).get("functionBlockCollection"));
								DCSSPACE.collection.get(tab_id).get("functionBlockCollection").models = SortedCollection;
							} else if(this.commandStack.undostack[len - 1].figure.type == "draw2d.nodeConnetion") {
								//get Sourcemodel and set target attribute
								var Sourcemodel = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(this.getCommandStack().undostack[len - 1].figure.sourcePort.parentNode.getId());
								var connectionsrc = Sourcemodel.get("target");
								connectionsrc.push(this.commandStack.undostack[len - 1].figure.getTarget().parentNode.getLabel());
								Sourcemodel.set({
									"target" : connectionsrc
								})
								//get Targetmodel and set source attribute
								var Targetemodel = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(this.commandStack.undostack[len - 1].figure.targetPort.parentNode.getId());
								var connectiontarget = Targetemodel.get("source");
								connectiontarget.push(this.commandStack.undostack[len - 1].figure.getSource().parentNode.getLabel());
								Targetemodel.set({
									"source" : connectiontarget
								});
								var node = this.commandStack.undostack[len - 1].figure.targetPort.parentNode;
								if(node.getnodeName() == "ADD" || node.getnodeName() == "SUB" || node.getnodeName() == "MUL" || node.getnodeName() == "DIV" || node.getnodeName() == "AND" || node.getnodeName() == "OR") {
									node.addPort(this.commandStack.undostack[len - 1].figure.removedInputPort, this.commandStack.undostack[len - 1].figure.removedInputPort.originX, this.commandStack.undostack[len - 1].figure.removedInputPort.originY);
								}
							}
							this.commandStack.undo();
							//console.log(DCSSPACE.collection.toJSON());
						} else if(this.commandStack.getUndoLabel() === "create connection") {
							var len = this.commandStack.undostack.length;
							var srcmodel = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(this.commandStack.undostack[len - 1].source.parentNode.getId());
							//get source model
							var targetmodel = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(this.commandStack.undostack[len - 1].target.parentNode.getId());
							//get target model
							var srcarray = srcmodel.get('target');
							//get source model target attribute to remove target
							var tararray = targetmodel.get('source');
							// get target model source attribute to remove source
							if(this.commandStack.undostack[len - 1].source.parentNode.getnodeName() == "CMP") {
								var index = srcarray.indexOf(this.commandStack.undostack[len - 1].target.parentNode.getLabel() + "-" + this.commandStack.undostack[len - 1].source.name);
								var indx = tararray.indexOf(this.commandStack.undostack[len - 1].source.parentNode.getLabel() + "-" + this.commandStack.undostack[len - 1].source.name)
							} else if(this.commandStack.undostack[len - 1].target.parentNode.getnodeName() == "CMP" || this.commandStack.undostack[len - 1].target.parentNode.getnodeName() == "LIM") {
								var index = srcarray.indexOf(this.commandStack.undostack[len - 1].target.parentNode.getLabel() + "-" + this.commandStack.undostack[len - 1].target.name);
								var indx = tararray.indexOf(this.commandStack.undostack[len - 1].source.parentNode.getLabel() + "-" + this.commandStack.undostack[len - 1].target.name)
							} else {
								var index = srcarray.indexOf(this.commandStack.undostack[len - 1].target.parentNode.getLabel());
								var indx = tararray.indexOf(this.commandStack.undostack[len - 1].source.parentNode.getLabel())
							}
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
							var target = this.commandStack.undostack[len - 1].target.parentNode;
							if(target.getnodeName() == "ADD" || target.getnodeName() == "SUB" || target.getnodeName() == "MUL" || target.getnodeName() == "DIV" || target.getnodeName() == "AND" || target.getnodeName() == "OR") {
								this.commandStack.undostack[len - 1].connection.removedInputPort = target.removePortsatRuntime(target, target.getnodeName(), this.commandStack.undostack[len - 1].target);
							}
							this.commandStack.undo();
							//console.log(DCSSPACE.collection.toJSON());
						} else if(this.commandStack.getUndoLabel() === "add figure") {
							var len = this.commandStack.undostack.length;
							DCSSPACE.collection.get(tab_id).get("functionBlockCollection").remove(this.commandStack.undostack[len - 1].figure.model);
							this.commandStack.undo();
							///console.log(DCSSPACE.collection.toJSON());
						} else {
							this.commandStack.undo();
						}
					}

				} else {
					if(_27aa == 89 && ctrl) {
						if(this.commandStack.redostack.length > 0) {
							if(this.commandStack.getRedoLabel() === "delete figure") {
								var len = this.commandStack.redostack.length;
								if(this.commandStack.redostack[len - 1].figure.type == "draw2d.Node") {
									this.commandStack.redostack[len - 1].figure.model = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(this.commandStack.redostack[len - 1].figure.getId());
									// add model to current figure to retrive at undo operation
									DCSSPACE.view.blockView.prototype.ReduceSequenceNo(this.commandStack.redostack[len - 1].figure.getSequenceNo() + 1)// Update Sequence Number of block
									DCSSPACE.collection.get(tab_id).get("functionBlockCollection").remove(this.commandStack.redostack[len - 1].figure.getId());
									// remove model from collection
								} else if(this.commandStack.redostack[len - 1].figure.type == "draw2d.nodeConnetion") {
									//get Sourcemodel and set target attribute
									var Sourcemodel = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(this.getCommandStack().redostack[len - 1].figure.sourcePort.parentNode.getId());
									var connectionsrc = Sourcemodel.get("target");
									//connectionsrc.push(this.commandStack.redostack[len - 1].figure.getTarget().parentNode.getheader());
									var index = connectionsrc.indexOf(this.commandStack.redostack[len - 1].figure.getTarget().parentNode.getLabel())
									// if element exist then remove
									if(index != -1) {
										connectionsrc.splice(index, 1);
									}
									Sourcemodel.set({
										"target" : connectionsrc
									})
									//get Targetmodel and set source attribute
									var Targetemodel = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(this.commandStack.redostack[len - 1].figure.targetPort.parentNode.getId());
									var connectiontarget = Targetemodel.get("source");
									var indx = connectiontarget.indexOf(this.commandStack.redostack[len - 1].figure.getSource().parentNode.getLabel())
									// if element exist then remove
									if(indx != -1) {
										connectiontarget.splice(indx, 1);
									}
									Targetemodel.set({
										"source" : connectiontarget
									});
									var targetNode = this.commandStack.redostack[len - 1].figure.targetPort.parentNode;
									if(targetNode.getnodeName() == "ADD" || targetNode.getnodeName() == "SUB" || targetNode.getnodeName() == "MUL" || targetNode.getnodeName() == "DIV" || targetNode.getnodeName() == "AND" || targetNode.getnodeName() == "OR") {
										this.commandStack.redostack[len - 1].figure.removedInputPort = targetNode.removePortsatRuntime(targetNode, targetNode.getnodeName(), this.commandStack.redostack[len - 1].figure.targetPort);
									}
								}

								this.commandStack.redo();
								//console.log(DCSSPACE.collection.toJSON());
							} else if(this.commandStack.getRedoLabel() === "create connection") {
								var len = this.commandStack.redostack.length;
								var srcmodel = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(this.commandStack.redostack[len - 1].source.parentNode.getId());
								//get source model
								var tarmodel = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(this.commandStack.redostack[len - 1].target.parentNode.getId());
								//get target model
								var srcarray = srcmodel.get("target");
								//get source model target attribute to remove target
								var tararray = tarmodel.get("source");
								// get target model ssource attribute to remove source
								if(this.commandStack.redostack[len - 1].source.parentNode.getnodeName() == "CMP") {
									srcarray.push(this.commandStack.redostack[len - 1].target.parentNode.getLabel() + "-" + this.commandStack.redostack[len - 1].source.name);
									tararray.push(this.commandStack.redostack[len - 1].source.parentNode.getLabel() + "-" + this.commandStack.redostack[len - 1].source.name)
								}else if(this.commandStack.redostack[len - 1].target.parentNode.getnodeName() == "CMP" || this.commandStack.redostack[len - 1].target.parentNode.getnodeName() == "LIM") {
									srcarray.push(this.commandStack.redostack[len - 1].target.parentNode.getLabel() + "-" + this.commandStack.redostack[len - 1].target.name);
									tararray.push(this.commandStack.redostack[len - 1].source.parentNode.getLabel() + "-" + this.commandStack.redostack[len - 1].target.name)
								} else {
									srcarray.push(this.commandStack.redostack[len - 1].target.parentNode.getLabel());
									//Push target attrubute name in sourcearray
									tararray.push(this.commandStack.redostack[len - 1].source.parentNode.getLabel());
									//Push source attrubute name in targetarray
								}
								srcmodel.set({
									"target" : srcarray
								});
								tarmodel.set({
									"source" : tararray
								});
								var targetNode = this.commandStack.redostack[len - 1].target.parentNode;
								if(targetNode.getnodeName() == "ADD" || targetNode.getnodeName() == "SUB" || targetNode.getnodeName() == "MUL" || targetNode.getnodeName() == "DIV" || targetNode.getnodeName() == "AND" || targetNode.getnodeName() == "OR") {
									targetNode.addPort(this.commandStack.redostack[len - 1].connection.removedInputPort, this.commandStack.redostack[len - 1].connection.removedInputPort.originX, this.commandStack.redostack[len - 1].connection.removedInputPort.originY);
								}
								this.commandStack.redo();
								//console.log(DCSSPACE.collection.toJSON());
							} else if(this.commandStack.getRedoLabel() === "add figure") {
								var len = this.commandStack.redostack.length;
								DCSSPACE.collection.get(tab_id).get("functionBlockCollection").add(this.commandStack.redostack[len - 1].figure.model);
								this.commandStack.redo();
								//console.log(DCSSPACE.collection.toJSON());
							} else {
								this.commandStack.redo();
							}
						}

					}
				}
			}
		}
	};
	draw2d.workflow.prototype.getHTMLId = function() {
		return {
			id : this.html.id,
			iEnable : this.enabled
		}
	}
	draw2d.workflow.prototype.isEnabled = function() {
		return this.enabled;
	}
//});
