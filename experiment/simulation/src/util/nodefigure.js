/**
 * Author : Harshal Chaudhari
 *
 * Nov 1-2012
 */

/* Todo:
 *     create draw2d.Node() and in that create HTML element.
 *     It create a draw2d.Node() object */

//define(['buttonDelete', 'outputPort', 'inputPort', 'JSONReader', 'JSONWriter'], function() {
	draw2d.node = function() {
		this.cornerWidth = 15;
		this.cornerHeight = 15;
		this.outputPort = null;
		this.inputPort = null;
		this.disable = false;
		draw2d.Node.call(this);
		this.setDimension(150, 180);
		this.originalHeight = -1;
		this.setResizeable(false);

	};
	draw2d.node.prototype = new draw2d.Node();
	draw2d.node.prototype.type = "draw2d.Node";
	draw2d.node.prototype.setLineWidth = 2;
	draw2d.node.prototype.setColor = "#B9D3F6"
	/* Create HTML element add them on workspace*/
	draw2d.node.prototype.createHTMLElement = function() {
		var item = document.createElement("div");
		item.onmouseover = function() {
			item.style.shadowBlur = 100;
			item.style.shadowColor = "#FFE873";
		}
		$(item).addClass("createElement");
		item.id = this.id;
		$(item).css({
			left : this.x,
			top : this.y,
			height : this.height,
			width : this.width,
			zIndex : draw2d.Figure.ZOrderBaseIndex
		});
		this.top_right = document.createElement("div");
		$(this.top_right).addClass("topright");
		$(this.top_right).css({
			width : this.cornerWidth + 9,
			height : this.cornerHeight + 5
		});
		this.tagname = document.createElement("div");
		$(this.tagname).addClass("label");
		$(this.tagname).css({
			height : this.cornerHeight + 6
		});
		//this.tagname.innerHTML = "TagName:?";

		this.header = document.createElement("div");
		$(this.header).addClass("header");
		$(this.header).css({
			height : this.cornerHeight + 5
		});
		this.textarea = document.createElement("div");
		$(this.textarea).addClass("textarea");
		$(this.textarea).css({
			top : this.cornerHeight + 31
		});
		this.footer = document.createElement("div");
		$(this.footer).addClass("footer");
		$(this.footer).css({
			height : this.cornerHeight + 5
		});

		this.btnReset = document.createElement('input');
		$(this.btnReset).attr('type', 'reset');
		$(this.btnReset).attr('name', 'btnreset');
		$(this.btnReset).attr('value', 'Reset');

		item.appendChild(this.top_right);
		item.appendChild(this.header);
		item.appendChild(this.tagname);
		item.appendChild(this.textarea);
		item.appendChild(this.footer);
		item.appendChild(this.btnReset);
		return item;
	};
	/*Todo: set dimension for all html element created in above function. */
	draw2d.node.prototype.setDimension = function(w, h) {
		draw2d.Node.prototype.setDimension.call(this, w, h);
		$(this.top_right).css({
			left : Math.max(1, (this.width - this.cornerWidth - 8))
		});
		//if(this.getnodeName() == "PID" || this.getnodeName()  == "AND" || this.getnodeName()  == "OR" || this.getnodeName()  == "ADD" || this.getnodeName()  == "SUB" || this.getnodeName()  == "MUL" || this.getnodeName()  == "DIV"){
		$(this.textarea).css({
			width : Math.max(1, (this.width - 1)),
			height : Math.max(1, (this.height - this.cornerHeight * 2) - 40)
		});

		$(this.header).css({
			width : Math.max(1, (this.width))
		});
		$(this.tagname).css({
			width : Math.max(1, (this.width))
		});
		$(this.footer).css({
			width : Math.max(1, (this.width)),
			top : Math.max(1, (this.height - this.cornerHeight) - 5)
		});
		$(this.btnReset).css({
			top : Math.max(1, (this.height - this.cornerHeight) + 17)
		});
		if(this.ports.data[1] !== undefined && this.ports.data[1] !== null) {
			this.ports.data[1].setPosition(this.width + 5, (this.height / 2) + 3);
		}
		if(this.ports.data[0] !== undefined) {
			if(this.ports.data[0].name.split("-")[0] == "output") {
				this.ports.data[0].setPosition(this.width + 5, (this.height / 2) + 3);
			} else {
				this.ports.data[0].setPosition(-5, (this.height / 2) + 3);
			}
		}
	};
	/* Add a html button element in draw2d.node object */
	draw2d.node.prototype.addButton = function(id) {
		oThis = this;
		if(id === "counter") {
			$(this.btnReset).addClass("btnreset");
			this.btnReset.style.display = "block";
		}
	};
	draw2d.node.prototype.setheader = function(header) {
		this.header.innerHTML = header;
	};
	draw2d.node.prototype.getheader = function() {
		return $(this.header).text();
	};
	draw2d.node.prototype.setSequenceNo = function(no) {
		this.sequenceNo = no;
	};
	draw2d.node.prototype.getSequenceNo = function() {
		return this.sequenceNo;
	};
	/* Set Title of Node object */
	draw2d.node.prototype.setTagName = function(title) {
		this.tagname.innerHTML = title;
	};
	/* Method to get name of node object */
	draw2d.node.prototype.getTagName = function(title) {
		return $(this.tagname).text();
	};
	/* set totel count of node object */
	draw2d.node.prototype.setFooter = function(title) {
		this.footer.innerHTML = title;
	};
	/* set inner content of node object */
	draw2d.node.prototype.setContent = function(_2bc9) {
		this.textarea.innerHTML = _2bc9;
	};
	draw2d.node.prototype.setLabel = function(name) {
		this.name = name;
	}
	draw2d.node.prototype.getLabel = function() {
		return this.name;
	}
	draw2d.node.prototype.isDisable = function() {
		return this.disable;
	}
	draw2d.node.prototype.getnodeName = function() {
		return this.getheader().split("-")[0];
	};
	draw2d.node.prototype.onDragstart = function(x, y) {
		var flag = draw2d.Node.prototype.onDragstart.call(this, x, y);
		if(this.header === null) {
			return false;
		}
		if(y < this.cornerHeight && x < this.width && x > (this.width - this.cornerWidth)) {
			/* check if Node object is Logic control & PID block and sets toggle functionality.
			 Logic control & PID block does not have toggle functionality*/
			if(this.getnodeName() === "AND" || this.getnodeName() === "OR" || this.getnodeName() === "PID" || this.getnodeName() === "ADD" || this.getnodeName() === "SUB" || this.getnodeName() === "MUL" || this.getnodeName() === "DIV" || this.getnodeName() === "LIM" || this.getnodeName() === "CMP" || this.getnodeName() === "DC") {
				this.top_right.style.display = "none";
			} else {
				this.top_right.style.display = "block";
				this.toggle();
			}
			return false;
		}
		if(this.originalHeight == -1) {
			if(this.canDrag === true && x < parseInt(this.width) && y < parseInt(this.height)) {
				return true;
			}
		} else {
			return flag;
		}

	};
	draw2d.node.prototype.setCanDrag = function(flag) {
		draw2d.Node.prototype.setCanDrag.call(this, flag);
		this.html.style.cursor = "";
		if(this.header === null) {
			return;
		}
		if(flag) {
			this.header.style.cursor = "move";
		} else {
			this.header.style.cursor = "defalut";
		}
	};
	//------------------------------Set workspace for elements----------------------------
	draw2d.node.prototype.setWorkflow = function(workspace) {
		draw2d.Node.prototype.setWorkflow.call(this, workspace);
		if(workspace !== null && this.inputPort === null) {
			this.CreatePorts(this, workspace, this.getnodeName());
		}
	};
	//-------------------Create IO Ports----------------------------------------------------
	var cnt = 1;
	draw2d.node.prototype.CreatePorts = function(oThis, workspace, nodeId) {
		switch(nodeId) {
			case "ADD" :
			case "SUB" :
			case "MUL" :
			case "DIV" :
			case "AND" :
			case "OR" :
				oThis.inputPort = oThis.InputPort(workspace);
				oThis.outputPort = oThis.OutputPort(workspace);
				oThis.addPort(oThis.inputPort, -2, 50);
				oThis.addPort(oThis.outputPort, oThis.width + 2, oThis.height / 2);
				break;
			case "AI":
			case "DI":
				oThis.OutputPort(workspace);
				oThis.addPort(oThis.outputPort, oThis.width + 2, oThis.height / 1.8);
				break;
			case "PID" :
				oThis.inputPort = oThis.InputPort(workspace);
				oThis.outputPort = oThis.OutputPort(workspace);
				oThis.addPort(oThis.inputPort, -2, oThis.height / 2);
				oThis.addPort(oThis.outputPort, oThis.width + 2, oThis.height / 2);
				//oThis.LoopInputPort = oThis.InputPort(workspace);
				//oThis.LoopOutputPort = oThis.OutputPort(workspace);
				//oThis.addPort(oThis.LoopInputPort, oThis.width / 2, 0);
				//oThis.addPort(oThis.LoopOutputPort, oThis.width + 2, oThis.height / 2.7);
				break;
			case "LIM" :
				oThis.LowinputPort = oThis.InputPort(workspace);
				oThis.LowinputPort.setName("Low");
				oThis.addPort(oThis.LowinputPort, -2, oThis.height / 2.8);
				oThis.ActualinputPort = oThis.InputPort(workspace);
				oThis.addPort(oThis.ActualinputPort, -2, oThis.height / 1.8);
				oThis.ActualinputPort.setName("Actual");
				oThis.HighinputPort = oThis.InputPort(workspace);
				oThis.addPort(oThis.HighinputPort, -2, oThis.height / 1.3);
				oThis.HighinputPort.setName("High");
				oThis.outputPort = oThis.OutputPort(workspace);
				oThis.addPort(oThis.outputPort, oThis.width + 2, oThis.height / 2);
				break;
			case "CMP" :
				oThis.LowinputPort = oThis.InputPort(workspace);
				oThis.addPort(oThis.LowinputPort, -2, oThis.height / 2.8);
				oThis.LowinputPort.setName("Low");
				oThis.ActualinputPort = oThis.InputPort(workspace);
				oThis.addPort(oThis.ActualinputPort, -2, oThis.height / 1.8);
				oThis.ActualinputPort.setName("Actual");
				oThis.HighinputPort = oThis.InputPort(workspace);
				oThis.addPort(oThis.HighinputPort, -2, oThis.height / 1.3);
				oThis.HighinputPort.setName("High");

				oThis.LToutputPort = oThis.OutputPort(workspace);
				oThis.addPort(oThis.LToutputPort, oThis.width + 2, oThis.height / 3.1);
				oThis.LToutputPort.setName("LT");
				oThis.GToutputPort = oThis.OutputPort(workspace);
				oThis.addPort(oThis.GToutputPort, oThis.width + 2, oThis.height / 2.3);
				oThis.GToutputPort.setName("GT");
				oThis.EQLoutputPort = oThis.OutputPort(workspace);
				oThis.addPort(oThis.EQLoutputPort, oThis.width + 2, oThis.height / 1.45);
				oThis.EQLoutputPort.setName("NEQL");
				oThis.NEQLoutputPort = oThis.OutputPort(workspace);
				oThis.addPort(oThis.NEQLoutputPort, oThis.width + 2, oThis.height / 1.2);
				oThis.NEQLoutputPort.setName("Inrange");
				oThis.InRangeoutputPort = oThis.OutputPort(workspace);
				oThis.addPort(oThis.InRangeoutputPort, oThis.width + 2, oThis.height / 1.8);
				oThis.InRangeoutputPort.setName("EQL");
				break;
			case "DC":
				oThis.LatchInputPort = oThis.InputPort(workspace);
				oThis.addPort(oThis.LatchInputPort, -2, oThis.height / 2.5);
				oThis.UnlatchInputPort = oThis.InputPort(workspace);
				oThis.addPort(oThis.UnlatchInputPort, -2, oThis.height / 1.3);
				oThis.outputPort = oThis.OutputPort(workspace);
				oThis.addPort(oThis.outputPort, oThis.width + 2, oThis.height / 2);
				break;
			case "AO":
			case "DO":
			case "RESET":
				oThis.inputPort = oThis.InputPort(workspace);
				//oThis.outputPort = oThis.OutputPort(workspace);
				oThis.addPort(oThis.inputPort, -2, oThis.height / 2);
				//oThis.addPort(oThis.outputPort, oThis.width + 2, oThis.height / 2);
				break;
			default :
				oThis.inputPort = oThis.InputPort(workspace);
				oThis.outputPort = oThis.OutputPort(workspace);
				oThis.addPort(oThis.inputPort, -2, oThis.height / 2);
				oThis.addPort(oThis.outputPort, oThis.width + 2, oThis.height / 2);
				break;
		}
	};
	draw2d.node.prototype.InputPort = function(workspace) {
		var ip = new draw2d.InputPort();
		var DCSSPACEIP = new DCSSPACE.inputs.MyInputPort(ip);
		this.inputPort = DCSSPACEIP.input;
		this.inputPort.setWorkflow(workspace);
		this.inputPort.setName("input-" + (cnt));
		this.inputPort.setBackgroundColor(new draw2d.Color(247, 98, 98));
		return this.inputPort;
	}
	draw2d.node.prototype.OutputPort = function(workspace) {
		this.outputPort = new draw2d.MyOutputPort();
		//oThis.outputPort.setMaxFanOut(5);
		this.outputPort.setWorkflow(workspace);
		this.outputPort.setName("output-" + (cnt++));
		this.outputPort.setBackgroundColor(new draw2d.Color(24, 195, 41));
		return this.outputPort;
	}
	//-----------------------------add ports at runtime----------------------------------------
	draw2d.node.prototype.addPortsatRuntime = function(oThis, workspace, objId, targetport) {
		var hpos;

		//find index of target port if it is 0 then set hpos value oThis.ports.data[0].originY otherwisw set hpos value oThis.ports.data[oThis.ports.size - 1].originY
		var index = oThis.ports.data.indexOf(targetport);
		// get position of last port bcaz each time we need to add port at end
		if(index == 0 && oThis.ports.size <= 2) {// oThis.ports.size <= 2 bcaz always at initial 2 ports are persent on oThis object
			for(var i = 0; i < oThis.ports.size; i++) {
				if(oThis.ports.data[i].name.split("-")[0] != "output") {// bcaz oThis.ports.data[1] is for Output Port
					if(oThis.ports.data[i].originY >= 50)
						hpos = oThis.ports.data[0].originY;
				}
			}
		} else {
			hpos = oThis.ports.data[oThis.ports.size - 1].originY;
			// set y position of last port to hpos
		}

		if(hpos + 15 >= oThis.height - 15) {
			this.setDimensionAfterAddPort(oThis.width, oThis.height + 20);
		}
		oThis.inputPort = oThis.InputPort(workspace);
		if(objId === "AND" || objId === "OR" || objId === "ADD" || objId === "SUB" || objId === "MUL" || objId === "DIV") {
			oThis.addPort(oThis.inputPort, -2, hpos + 15);
			oThis.paint();
		}

	}
	// Remove ports at runtime
	draw2d.node.prototype.removePortsatRuntime = function(oThis, objId, targetPort) {
		var removedInputPort;
		if(oThis.getHeight() > 170) {
			oThis.setDimensionAfterAddPort(oThis.width, oThis.height - 10);
		}
		if(objId === "AND" || objId === "OR" || objId === "ADD" || objId === "SUB" || objId === "MUL" || objId === "DIV") {
			var index = oThis.ports.data.indexOf(targetPort)
			if(index != -1) {
				for(var i = 0; i < oThis.ports.size; i++) {
					if(oThis.ports.data[i].name.split("-")[0] != "output") {// bcaz oThis.ports.data[1] is for Output Port
						if(oThis.ports.data[i].getConnections().data[0] == undefined) {
							removedInputPort = oThis.ports.data[i];
							oThis.removePort(oThis.ports.data[i]);
							oThis.paint();
						}
					}
				}
			}
		}
		return removedInputPort;
	}
	draw2d.node.prototype.setDimensionAfterAddPort = function(w, h) {
		draw2d.Node.prototype.setDimension.call(this, w, h);
		$(this.top_right).css({
			left : Math.max(1, (this.width - this.cornerWidth - 8))
		});
		$(this.textarea).css({
			width : Math.max(1, (this.width - 2)),
			height : Math.max(1, (this.height - this.cornerHeight * 2) - 40)
		});
		$(this.header).css({
			width : Math.max(1, (this.width))
		});
		$(this.tagname).css({
			width : Math.max(1, (this.width))
		});
		$(this.description).css({
			width : Math.max(1, (this.width))
		});
		$(this.footer).css({
			width : Math.max(1, (this.width)),
			top : Math.max(1, (this.height - this.cornerHeight) - 5)
		});
		$(this.btnReset).css({
			top : Math.max(1, (this.height - this.cornerHeight) + 17)
		});
		if(this.ports.data[1].name.split("-")[0] == "output") {
			this.ports.data[1].setPosition(this.width + 5, (this.height / 2));
		}
	};
	/* Node object toggle functionality */
	draw2d.node.prototype.toggle = function() {
		if(this.originalHeight == -1) {
			this.originalHeight = this.height;
			this.setDimension(this.width, this.cornerHeight * 2 + 40);
			if(this.getnodeName() == "CPT"|| this.getnodeName() == "NOT" || this.getnodeName() === "UPCTR" || this.getnodeName() === "DWCTR" || this.getnodeName() === "OND" || this.getnodeName() === "OFFD" || this.getnodeName() === "RTO") {
				this.btnReset.style.display = 'none';
				this.setDimension(this.width, this.cornerHeight * 2 + 41);
				this.footer.style.top = "51px";
			}
		} else {
			this.setDimension(this.width, this.originalHeight);
			if(this.getnodeName() == "CPT" || this.getnodeName() == "NOT" || this.getnodeName() === "UPCTR" || this.getnodeName() === "DWCTR" || this.getnodeName() === "OND" || this.getnodeName() === "OFFD" || this.getnodeName() === "RTO") {
				this.btnReset.style.display = 'block';
				this.textarea.style.height = "121px";
			}
			this.originalHeight = -1;
		}
	};
	//....................Design Right click menu......................
	draw2d.node.prototype.getContextMenu = function() {
		var menu = new draw2d.Menu();
		menu.parent = this;
		var oThis = this;
		if($("#btnRunmode").val() == "OffMode" && DCSSPACE.workflow.isEnabled()) {
			menu.appendMenuItem(new draw2d.MenuItem("Delete", "/DCS_Draw2d/assert/images/ButtonDelete.jpeg", function() {
				var ans = confirm("Do you want to delete " + oThis.getnodeName() + " block");
				if(ans) {
					oThis.model = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(oThis.getId());
					// add model into node object to retrive model at undo/redo
					DCSSPACE.view.blockView.prototype.ReduceSequenceNo(oThis.getSequenceNo() + 1);
					// Update Sequence Number of block
					DCSSPACE.collection.get(tab_id).get("functionBlockCollection").remove(DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(oThis.getId()));
					//remove a model from collection
					oThis.workflow.getCommandStack().execute(new draw2d.CommandDelete(oThis));
					// remove current figure
					//console.log(DCSSPACE.collection.toJSON());
				}
			}));
			if(oThis.disable == false) {
				menu.appendMenuItem(new draw2d.MenuItem("Disable", null, function() {
					oThis.disable = true;
					oThis.setAlpha(0.4);
					oThis.alphaBeforeOnDrag = oThis.getAlpha();
					DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(oThis.getId()).set({
						"isEnable" : !(oThis.disable)
					});
					//oThis.workflow.getCommandStack().execute(new draw2d.commandDisablesBlock(oThis.workflow, oThis));
					//console.log(DCSSPACE.collection.get(tab_id).toJSON());
				}));
			} else {
				menu.appendMenuItem(new draw2d.MenuItem("Enable", null, function() {
					oThis.disable = false;
					oThis.setAlpha(1);
					oThis.alphaBeforeOnDrag = oThis.getAlpha();
					DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(oThis.getId()).set({
						"isEnable" : !(oThis.disable)
					});
					//oThis.workflow.getCommandStack().execute(new draw2d.commandDisablesBlock(oThis.workflow, oThis));
					//console.log(DCSSPACE.collection.get(tab_id).toJSON());
				}));
			}
		}
		if(($("#btnRunmode").val() == "OffMode" || ($("#btnRunmode").val() == "RunMode" && oThis.getnodeName() == "PID")) && DCSSPACE.workflow.isEnabled()) {
			menu.appendMenuItem(new draw2d.MenuItem("Configure", "", function() {
				if(oThis.getnodeName() === "PID") {
					DCSSPACE.view.blockView.prototype.PIDBlockConfig(oThis.getId());
				} else if(oThis.getnodeName() === "AI" || oThis.getnodeName() === "AO" || oThis.getnodeName() === "DI" || oThis.getnodeName() === "DO") {
					if(oThis.getnodeName() === "AI") {
						$("#ddltagname").html("<option value='none'>None</option>");
					} else if(oThis.getnodeName() === "AO") {
						$("#ddltagname").html("<option value='none'>None</option>");
					} else if(oThis.getnodeName() === "DI") {
						$("#ddltagname").html("<option value='none'>None</option>");
					} else if(oThis.getnodeName() === "DO") {
						$("#ddltagname").html("<option value='none'>None</option>");
					}
					DCSSPACE.view.blockView.prototype.IOBloackConfig(oThis.getId());

				} else if(oThis.getnodeName() === "OND" || oThis.getnodeName() === "OFFD" || oThis.getnodeName() === "RTO" || oThis.getnodeName() === "UPCTR" || oThis.getnodeName() === "DWCTR") {
					DCSSPACE.view.blockView.prototype.TimerAndCntBlockConfig(oThis.getId());
				} else if(oThis.getnodeName() === "CPT") {
					var CPTModel = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(oThis.getId());
					$("#CPTConfig").tabs({//create tabs
						collapsible : true,
					});
					 var labeltxt = CPTModel.get("label") != undefined ? CPTModel.get("label") : "";
					$("#txtCPTlabel").val(labeltxt);
					CPTModel.get("description") != "" ? $("#lblCPTDesc").val(CPTModel.get("description")) : $("#lblCPTDesc").val('');
					// set labels on blocks connected to CPT block
					if(CPTModel.get("source") != null) {
						var CPTsrcstring = "";
						var CPTsrc = CPTModel.get("source");
						for(var i = 0; i < CPTsrc.length; i++) {
							if(CPTsrc != null || CPTsrc.length <= 0) {
								CPTsrcstring = CPTsrcstring + CPTsrc[i];
								CPTsrcstring = CPTsrcstring + ", ";
							}
						}
						$("#lblavlsrc").html(CPTsrcstring);
					} else {
						$("#lblavlsrc").text("No Source connection");
					}

					$("#CPTConfig").css({
						"display" : "block"
					}).dialog({
						title : 'Configuration',
						height : 580,
						width : 390,
						draggable : false,
						show : {
							effect : "drop",
							direction : "up"
						},
						hide : {
							effect : "drop",
							direction : "down"
						},
						modal : true,
						resizable : false,
						buttons : [{
							text : "Submit",
							click : function() {
								// Validate & Submit CPT block details in CPT model
								if($("#txtCPTlabel").val() != '') {
									if(CPTModel.get("label") != txtlabel) {
										if(!DCSSPACE.view.blockView.prototype.checkForUniqueLabel(txtlabel)) {
											oThis.setLabel($("#txtCPTlabel").val());
											oThis.showToolTip($("#lblCPTDesc").val());
											CPTModel.set({
												"label" : $("#txtCPTlabel").val(),
												"description" : $("#lblCPTDesc").val()
											});
											$("#txtCPTlabel").focus();
											if($("#ddlStatement").val() != 'select') {
												if($("#txtCondition").val() != '') {
													if($("#txrExperssion1").val() != '') {
														CPTModel.set({
															"Statement" : $("#ddlStatement").val(),
															"Condition" : $("#txtCondition").val(),
															"Experssion1" : $("#txrExperssion1").val(),
															"Experssion2" : $("#txrExperssion2").val(),
														});
														//console.log(DCSSPACE.collection.toJSON());
														$(this).dialog("close");
													} else {
														alert("Please enter experssion1")
														$("#txrExperssion1").focus();
													}
												} else {
													alert("Please enter condition")
													$("#txtCondition").focus();
												}
											} else {
												$(this).dialog("close");
												// if user want to set only Label not condition.
											}
										} else {
											alert("Label already exist");
											$("#txtCPTlabel").val('').focus();
										}
									}else{
										oThis.setLabel($("#txtCPTlabel").val());
										oThis.showToolTip($("#lblCPTDesc").val());
											CPTModel.set({
												"label" : $("#txtCPTlabel").val(),
												"description" : $("#lblCPTDesc").val()
											}); 	
											if($("#ddlStatement").val() != 'select') {
												if($("#txtCondition").val() != '') {
													if($("#txrExperssion1").val() != '') {
														CPTModel.set({
															"Statement" : $("#ddlStatement").val(),
															"Condition" : $("#txtCondition").val(),
															"Experssion1" : $("#txrExperssion1").val(),
															"Experssion2" : $("#txrExperssion2").val(),
														});
														//console.log(DCSSPACE.collection.toJSON());
														$(this).dialog("close");
													} else {
														alert("Please enter experssion1")
														$("#txrExperssion1").focus();
													}
												} else {
													alert("Please enter condition")
													$("#txtCondition").focus();
												}
											} else {
												$(this).dialog("close");
												// if user want to set only Label not condition.
											}
									}
								} else {
									alert("Please enter Label")
									$("#txtCPTlabel").focus();
								}

							}
						}, {
							text : "Close",
							click : function() {
								$("#TimerConfig").css({
									"display" : "none"
								});
								$(this).dialog("close");
							}
						}],
					});
				} else if(oThis.getnodeName() === "ADD" || oThis.getnodeName() === "SUB" || oThis.getnodeName() === "MUL" || oThis.getnodeName() === "DIV" || oThis.getnodeName() === "CMP" || oThis.getnodeName() === "LIM" || oThis.getnodeName() === "AND" || oThis.getnodeName() === "OR" || oThis.getnodeName() === "NOT" || oThis.getnodeName() === "DC") {
					DCSSPACE.view.blockView.prototype.LabelChangeConfig(oThis.getId());
				} else if(oThis.getnodeName() == "RESET") {
				oThis.getCounterForReset();
				// set ddlrstSelectCounterName
				DCSSPACE.view.blockView.prototype.resetBlockConfig(oThis.getId());
			}
			}));
		}
		if($("#btnRunmode").val() == "RunMode" && DCSSPACE.workflow.isEnabled()) {
			if(oThis.getnodeName() == "AI") {
				menu.appendMenuItem(new draw2d.MenuItem("Edit", "ButtonDelete.jpeg", function() {
					DCSSPACE.view.blockView.prototype.SettingInputvalues(oThis.getId());
				}));
			}
			if(oThis.getnodeName() == "DI") {
					menu.appendMenuItem(new draw2d.MenuItem("Toggle", "", function() {
						var DImodel = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(oThis.getId());
						var currentValue = DImodel.get("Output") === "" ? 0 : parseInt(DImodel.get("Output"));
						if(currentValue === 0) {
							currentValue = 1;
							DImodel.set({
								"Output" : currentValue
							});
						//currentIOInput = currentValue;
						} else {
							currentValue = 0;
							DImodel.set({
								"Output" : currentValue
							});
						//currentIOInput = currentValue;
						}
						DCSSPACE.view.blockView.prototype.setConfigureCall(currentValue,DImodel,oThis);
						$("#information").html(DCSSPACE.view.blockView.prototype.informationBlock(DImodel));
						DCSSPACE.view.blockView.prototype.blocksetContent(DImodel);
					}));
				}
		}

		return menu;
	};
	draw2d.node.prototype.getCounterForReset = function() {
	//var models = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").models;
	$("#ddlrstSelectCounterName").html("");
	var UPCTRmodels = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").where({
		"blockid" : "UPCTR"
	});
	var DWCTRmodels = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").where({
		"blockid" : "DWCTR"
	});
	var RTOmodels = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").where({
		"blockid" : "RTO"
	});
	if(UPCTRmodels != null || DWCTRmodels != null || RTOmodels != null) {
		DCSSPACE.view.blockView.prototype.modelsIterator(UPCTRmodels);
		DCSSPACE.view.blockView.prototype.modelsIterator(DWCTRmodels);
		DCSSPACE.view.blockView.prototype.modelsIterator(RTOmodels);
	}
}
	//----------------------Desing object flow Menu................//
	draw2d.FlowMenu = function(workspace) {
		this.actionDelete = new draw2d.ButtonDelete(this);
		draw2d.ToolPalette.call(this);
		this.setDropShadow(0);
		this.setDimension(0, 0);
		this.currentFigure = null;
		this.myworkflow = workspace;
		this.workflow = workspace;
		this.added = false;
		this.setDeleteable(false);
		this.setCanDrag(false);
		this.setResizeable(false);
		this.setSelectable(false);
		this.setColor(null);
		this.scrollarea.style.borderBottom = "0px";
		this.actionDelete.setPosition(0, 0);
		this.addChild(this.actionDelete);
	};
	draw2d.FlowMenu.prototype = new draw2d.ToolPalette();
	draw2d.FlowMenu.prototype.type = "draw2d.FlowMenu";
	draw2d.FlowMenu.prototype.setAlpha = function(alphaval) {
		draw2d.Figure.prototype.setAlpha.call(this, alphaval);
	};
	draw2d.FlowMenu.prototype.hasTitleBar = function() {
		return false;
	};
	draw2d.FlowMenu.prototype.onSelectionChanged = function(obj) {
		if(obj == this.currentFigure) {
			return;
		}
		if( obj instanceof draw2d.Line) {
			return;
		}
		if(this.added == true) {
			this.myworkflow.removeFigure(this);
			this.added = false;
		}
		if(obj !== null && this.added == false) {
			if(this.myworkflow.getEnableSmoothFigureHandling() == true) {
				this.setAlpha(0.01);
			}
			this.myworkflow.addFigure(this, 100, 100);
			this.added = true;
		}
		if(this.currentFigure !== null) {
			this.currentFigure.detachMoveListener(this);
		}
		this.currentFigure = obj;
		if(this.currentFigure !== null) {
			this.currentFigure.attachMoveListener(this);
			this.onOtherFigureMoved(this.currentFigure);
		}
	};
	draw2d.FlowMenu.prototype.setWorkflow = function(workspace) {
		draw2d.Figure.prototype.setWorkflow.call(this, workspace);
	};
	draw2d.FlowMenu.prototype.onOtherFigureMoved = function(obj) {
		var pos = obj.getPosition();
		this.setPosition(pos.x + obj.getWidth() + 7, pos.y - 16);
	};
	/*
	 * Function to call Undo/Redo stack
	 */
	draw2d.node.prototype.onKeyDown = function(ASCIIval, ctrl) {
		if($("#btnRunmode").val() == "OffMode") {
			if(ASCIIval == 46) {
			var id = this.getheader() +"-" + this.getSequenceNo();
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
							this.model = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(oThis.getId());
							DCSSPACE.view.blockView.prototype.ReduceSequenceNo(oThis.getSequenceNo() + 1);
							var sourcemodel = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(oThis.getId());
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
											k=k-1;
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
												}
											}else{
												if(target[x] == CurrentNodeLabel){
													target.splice(x,1);
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
							
							DCSSPACE.collection.get(tab_id).get("functionBlockCollection").remove(oThis.getId());
							// remove model from collection
							oThis.workflow.getCommandStack().execute(new draw2d.CommandDelete(oThis));
							// remove current figure
							$(this).dialog("close");
						},
						Cancel : function() {
							$(this).dialog("close");
						}
					}
				});

				/*
				var txt = 'Are you sure you want to remove block '+ id + '?';
								$.prompt(txt, {
									buttons : {
										Delete : true,
										Cancel : false
									},
									callback : function(e, v, m, f) {
										if(v) {
											this.model = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(oThis.getId());
											// add model into node object to retrive model at undo/redo
											DCSSPACE.view.blockView.prototype.ReduceSequenceNo(oThis.getSequenceNo() + 1);
											// Update Sequence Number of block
											DCSSPACE.collection.get(tab_id).get("functionBlockCollection").remove(oThis.getId());
											// remove model from collection
											oThis.workflow.getCommandStack().execute(new draw2d.CommandDelete(oThis));
											// remove current figure
										} 
									}
								});*/
				
			} else if(ASCIIval === 90 && ctrl) {
				if(this.workflow.commandStack.getUndoLabel() === "delete figure") {
					var len = this.workflow.commandStack.undostack.length;
					if(this.workflow.commandStack.undostack[len - 1].figure.type == "draw2d.Node") {
						DCSSPACE.view.blockView.prototype.ExtendSequenceNo(this.workflow.currentSelection.getSequenceNo());
						DCSSPACE.collection.get(tab_id).get("functionBlockCollection").add(this.workflow.currentSelection.model);
						DCSSPACE.collection.get(tab_id).get("functionBlockCollection").sort();
						var SortedCollection = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").sortAsc(DCSSPACE.collection.get(tab_id).get("functionBlockCollection"));
						DCSSPACE.collection.get(tab_id).get("functionBlockCollection").models = SortedCollection;
					} else if(this.workflow.commandStack.undostack[len - 1].figure.type == "draw2d.nodeConnetion") {
						//get Sourcemodel and set target attribute
						var Sourcemodel = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(this.workflow.getCommandStack().undostack[len - 1].figure.sourcePort.parentNode.getId());
						var connectionsrc = Sourcemodel.get("target");
						connectionsrc.push(this.workflow.commandStack.undostack[len - 1].figure.getTarget().parentNode.getLabel());
						Sourcemodel.set({
							"target" : connectionsrc
						})
						//get Targetmodel and set source attribute
						var Targetemodel = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(this.workflow.commandStack.undostack[len - 1].figure.targetPort.parentNode.getId());
						var connectiontarget = Targetemodel.get("source");
						connectiontarget.push(this.workflow.commandStack.undostack[len - 1].figure.getSource().parentNode.getLabel());
						Targetemodel.set({
							"source" : connectiontarget
						});
						var node = this.workflow.commandStack.undostack[len - 1].figure.targetPort.parentNode;
						if(node.getnodeName() == "ADD" || node.getnodeName() == "SUB" || node.getnodeName() == "MUL" || node.getnodeName() == "DIV" || node.getnodeName() == "AND" || node.getnodeName() == "OR") {
							node.addPort(this.workflow.commandStack.undostack[len - 1].figure.removedInputPort, this.workflow.commandStack.undostack[len - 1].figure.removedInputPort.originX, this.workflow.commandStack.undostack[len - 1].figure.removedInputPort.originY);
						}
					}
					this.workflow.commandStack.undo();
					//console.log(DCSSPACE.collection.toJSON());
				} else if(this.workflow.commandStack.getUndoLabel() === "create connection") {
					var len = this.workflow.commandStack.undostack.length;
					var srcmodel = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(this.workflow.commandStack.undostack[len - 1].source.parentNode.getId());
					//get source model
					var targetmodel = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(this.workflow.commandStack.undostack[len - 1].target.parentNode.getId());
					//get target model
					var srcarray = srcmodel.get('target');
					var tararray = targetmodel.get('source');

					if(this.workflow.commandStack.undostack[len - 1].source.parentNode.getnodeName() == "CMP") {
						var index = srcarray.indexOf(this.workflow.commandStack.undostack[len - 1].target.parentNode.getLabel() + "-" + this.workflow.commandStack.undostack[len - 1].source.name);
						var indx = tararray.indexOf(this.workflow.commandStack.undostack[len - 1].source.parentNode.getLabel() + "-" + this.workflow.commandStack.undostack[len - 1].source.name)
					} else if(this.workflow.commandStack.undostack[len - 1].target.parentNode.getnodeName() == "CMP" || this.workflow.commandStack.undostack[len - 1].target.parentNode.getnodeName() == "LIM") {
						var index = srcarray.indexOf(this.workflow.commandStack.undostack[len - 1].target.parentNode.getLabel() + "-" + this.workflow.commandStack.undostack[len - 1].target.name);
						var indx = tararray.indexOf(this.workflow.commandStack.undostack[len - 1].source.parentNode.getLabel() + "-" + this.workflow.commandStack.undostack[len - 1].target.name)
					} else {
						var index = srcarray.indexOf(this.workflow.commandStack.undostack[len - 1].target.parentNode.getLabel());
						var indx = tararray.indexOf(this.workflow.commandStack.undostack[len - 1].source.parentNode.getLabel())
					}
					if(index != -1)
						srcarray.splice(index, 1);
					if(indx != -1)
						tararray.splice(indx, 1);
					srcmodel.set({
						"target" : srcarray
					});
					targetmodel.set({
						"source" : tararray
					});
					var target = this.workflow.commandStack.undostack[len - 1].target.parentNode;
					if(target.getnodeName() == "ADD" || target.getnodeName() == "SUB" || target.getnodeName() == "MUL" || target.getnodeName() == "DIV" || target.getnodeName() == "AND" || target.getnodeName() == "OR") {
						this.workflow.commandStack.undostack[len - 1].connection.removedInputPort = target.removePortsatRuntime(target, target.getnodeName(), this.workflow.commandStack.undostack[len - 1].target);
					}
					//set new updated source attribute of target model
					this.workflow.commandStack.undo();
					//console.log(DCSSPACE.collection.toJSON());
				} else if(this.workflow.commandStack.getUndoLabel() === "add figure") {
					var len = this.workflow.commandStack.undostack.length;
					DCSSPACE.collection.get(tab_id).get("functionBlockCollection").remove(this.workflow.commandStack.undostack[len - 1].figure.model);
					this.workflow.commandStack.undo();
					//console.log(DCSSPACE.collection.toJSON());
				} else {
					this.workflow.commandStack.undo();
				}
			} else if(ASCIIval === 89 && ctrl) {
				if(this.workflow.commandStack.getRedoLabel() === "delete figure") {
					var len = this.workflow.commandStack.redostack.length;
					if(this.workflow.commandStack.redostack[len - 1].figure.type == "draw2d.Node") {
						this.workflow.commandStack.redostack[len - 1].figure.model = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(this.workflow.commandStack.redostack[len - 1].figure.getId());
						// add model to current figure to retrive at undo operation
						DCSSPACE.view.blockView.prototype.ReduceSequenceNo(this.workflow.commandStack.redostack[len - 1].figure.getSequenceNo() + 1)// Update Sequence Number of block
						DCSSPACE.collection.get(tab_id).get("functionBlockCollection").remove(this.workflow.commandStack.redostack[len - 1].figure.getId());
						// remove model from collection
					} else if(this.workflow.commandStack.redostack[len - 1].figure.type == "draw2d.nodeConnetion") {
						//get Sourcemodel and set target attribute
						var Sourcemodel = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(this.workflow.getCommandStack().redostack[len - 1].figure.sourcePort.parentNode.getId());
						var connectionsrc = Sourcemodel.get("target");
						//connectionsrc.push(this.commandStack.redostack[len - 1].figure.getTarget().parentNode.getTagname());
						var index = connectionsrc.indexOf(this.workflow.commandStack.redostack[len - 1].figure.getTarget().parentNode.getLabel())
						// if element exist then remove
						if(index != -1) {
							connectionsrc.splice(index, 1);
						}
						Sourcemodel.set({
							"target" : connectionsrc
						})
						//get Targetmodel and set source attribute
						var Targetemodel = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(this.workflow.commandStack.redostack[len - 1].figure.targetPort.parentNode.getId());
						var connectiontarget = Targetemodel.get("source");
						var indx = connectiontarget.indexOf(this.workflow.commandStack.redostack[len - 1].figure.getSource().parentNode.getLabel())
						// if element exist then remove
						if(indx != -1) {
							connectiontarget.splice(indx, 1);
						}
						Targetemodel.set({
							"source" : connectiontarget
						});
						var targetNode = this.workflow.commandStack.redostack[len - 1].figure.targetPort.parentNode;
						if(targetNode.getnodeName() == "ADD" || targetNode.getnodeName() == "SUB" || targetNode.getnodeName() == "MUL" || targetNode.getnodeName() == "DIV" || targetNode.getnodeName() == "AND" || targetNode.getnodeName() == "OR") {
							this.workflow.commandStack.redostack[len - 1].figure.removedInputPort = targetNode.removePortsatRuntime(targetNode, targetNode.getnodeName(), this.workflow.commandStack.redostack[len - 1].figure.targetPort);
						}
					}

					this.workflow.getCommandStack().redo();
					//console.log(DCSSPACE.DCSSPACE.collection.toJSON());
				} else if(this.workflow.commandStack.getRedoLabel() === "create connection") {
					var len = this.workflow.commandStack.redostack.length;
					var srcmodel = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(this.workflow.commandStack.redostack[len - 1].source.parentNode.getId());
					//get source model
					var tarmodel = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(this.workflow.commandStack.redostack[len - 1].target.parentNode.getId());
					//get target model
					var srcarray = srcmodel.get("target");
					//get source model target attribute to remove target
					var tararray = tarmodel.get("source");
					// get target model ssource attribute to remove source
					if(this.workflow.commandStack.redostack[len - 1].source.parentNode.getnodeName() == "CMP") {
						srcarray.push(this.workflow.commandStack.redostack[len - 1].target.parentNode.getLabel() + "-" + this.workflow.commandStack.redostack[len - 1].source.name);
						tararray.push(this.workflow.commandStack.redostack[len - 1].source.parentNode.getLabel() + "-" + this.workflow.commandStack.redostack[len - 1].source.name)
					} else if(this.workflow.commandStack.redostack[len - 1].target.parentNode.getnodeName() == "CMP" || this.workflow.commandStack.redostack[len - 1].target.parentNode.getnodeName() == "LIM") {
						srcarray.push(this.workflow.commandStack.redostack[len - 1].target.parentNode.getLabel() + "-" + this.workflow.commandStack.redostack[len - 1].target.name);
						tararray.push(this.workflow.commandStack.redostack[len - 1].source.parentNode.getLabel() + "-" + this.workflow.commandStack.redostack[len - 1].target.name)
					} else {
						srcarray.push(this.workflow.commandStack.redostack[len - 1].target.parentNode.getLabel());
						//Push target attrubute name in sourcearray
						tararray.push(this.workflow.commandStack.redostack[len - 1].source.parentNode.getLabel());
						//Push source attrubute name in targetarray
					}
					srcmodel.set({
						"target" : srcarray
					});
					tarmodel.set({
						"source" : tararray
					});
					var targetNode = this.workflow.commandStack.redostack[len - 1].target.parentNode;
					if(targetNode.getnodeName() == "ADD" || targetNode.getnodeName() == "SUB" || targetNode.getnodeName() == "MUL" || targetNode.getnodeName() == "DIV" || targetNode.getnodeName() == "AND" || targetNode.getnodeName() == "OR") {
						targetNode.addPort(this.workflow.commandStack.redostack[len - 1].connection.removedInputPort, this.workflow.commandStack.redostack[len - 1].connection.removedInputPort.originX, this.workflow.commandStack.redostack[len - 1].connection.removedInputPort.originY);
					}
					this.workflow.commandStack.redo();
					//console.log(DCSSPACE.collection.toJSON());
				} else if(this.workflow.commandStack.getRedoLabel() === "add figure") {
					var len = this.workflow.commandStack.redostack.length;
					DCSSPACE.collection.get(tab_id).get("functionBlockCollection").add(this.workflow.commandStack.redostack[len - 1].figure.model);
					this.workflow.commandStack.redo();
					//console.log(DCSSPACE.collection.toJSON());
				} else {
					this.workflow.getCommandStack().redo();
				}
			}
		}
	}
	draw2d.node.prototype.CommandAdd = function(canvas, figure, x, y, parent) {
		this.workflow.getCommandStack().execute(new draw2d.CommandAdd(canvas, figure, x, y, parent));
	};
	draw2d.node.prototype.getModelAttrubutes = function() {
		var TagName;
		if(this.getnodeName() == "AI" || this.getnodeName() == "AO" || this.getnodeName() == "DI" || this.getnodeName() == "DO")	
			return {
			id : this.id,
			//x : this.x,
			//y : this.y,
			//width : this.width,
			//height : this.height,
			blockType : this.getnodeName(),
			//Name : this.model.get("Name"),
			label : this.model.get("label"),
			tagName : this.model.get("Tag-name"),
			//MappingAddress : this.model.get("Map-Address"),
			sequenceNumber : parseInt(this.model.get("sequenceNo")),
			//Input : this.model.get("Input"),
			//Output : this.model.get("Output"),
			source : this.model.get("source"),
			target : this.model.get("target"),
			isEnable : this.model.get("isEnable")
		}
		else
			return {
			id : this.model.get("id"),
			blockType : this.getnodeName(),
			label : this.model.get("label"),
			sequenceNumber : parseInt(this.model.get("sequenceNo")),
			source : this.model.get("source"),
			target : this.model.get("target"),
			isEnable : this.model.get("isEnable")
		}
		
	}

	draw2d.node.prototype.getPIDAttrubutes = function() {
		return {
			mode : this.model.get("Mode"),
			actionType : this.model.get("Action Type"),
			controllerType : this.model.get("Controller Type"),
			derivativeGain : this.model.get("Derivative Gain"),
			integralGain : this.model.get("Integral Gain"),
			intialOutput : this.model.get("Intial Output"),
			maxValue : this.model.get("Max Value"),
			minValue : this.model.get("Min Value"),
			PIDType : this.model.get("PID Type"),
			propertionalGain : this.model.get("Propertional Gain"),
			proportionalBias : this.model.get("Proportional Bias"),
			rate : this.model.get("Rate"),
			setPoint : this.model.get("Set Point")
		}
	}
	draw2d.node.prototype.getCPTAttrubutes = function() {
		var experssion_2;
		var flag = this.model.get("Experssion2") != undefined || this.model.get("Experssion2") != null ? experssion_2 = this.model.get("Experssion2") : experssion_2 = null
		return {
			statement : this.model.get("Statement"),
			condition : this.model.get("Condition"),
			experssion1 : this.model.get("Experssion1"),
			experssion2 : experssion_2,
		}
	}
	draw2d.node.prototype.getTimerAndCounterAttrubutes = function() {
		return {
			presetValue : this.model.get("Preset")
		}
	}
	draw2d.node.prototype.showToolTip = function(tooltip){
		$("#"+this.html.id).attr("title", tooltip);
	}
//});
