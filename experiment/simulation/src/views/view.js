/**
 * Harshal Chaudhari
 *
 * Nov 1-2012
 */
//define(['draw2d', 'workflow', 'jqxcore', 'jqxmenu', 'nodeFigure', 'toolBox', 'commandChangeSequenceNo', 'parseJsonAtCompileTime', 'ScanCycle'], function() {
	DCSSPACE.view = function() {
		var cntAI = 0, cntAO = 0, cntDI = 0, cntDO = 0, cntPID = 0, cntADD = 0, cntSUB = 0, cntMUL = 0, cntDIV = 0, cntAND = 0, cntOR = 0, cntNOT = 0, cntTON = 0, cntTOFF = 0, cntUP = 0, cntDOWN = 0, cntLIM = 0, cntCPT = 0, cntCMP = 0, cntDC = 0, cntRTO = 0,cntRESET=0;
		var arraySequenceNo = [];
		var globalPID = {};
		var view = Backbone.View.extend({
			el : $("#canvasdiv"),
			initialize : function() {
				views = {};
				//console.log("View");
				DCSSPACE.collection.get(tab_id).get("functionBlockCollection").bind("add", function(m, temp, data) {
					if(data.id != undefined) {
						views[m.cid] = new blockView({
							data : data,
							model : m,
							id : "view_" + m.cid
						});
					}
				}, this);
				DCSSPACE.collection.get(tab_id).get("functionBlockCollection").bind("remove", function(m) {
					//views[m.cid].remove();
					delete views[m.cid];
				}, this);
				this.render();
			},
			render : function() {
				var currentworkspace = DCSSPACE.collection.get(tab_id).get("workflow");
				$("#sidediv").accordion();
				this.disableSelection(document.body);
				//var toolwindow = new draw2d.Toolbox();
				//currentworkspace.setToolWindow(toolwindow);
				//toolwindow.setPosition(10, 40);
				$(".btn").draggable({
					helper : "clone",
					stop : function(event, ui) {
						var data = {
							evt : event.originalEvent,
							workspace : DCSSPACE.collection.get(tab_id).get("workflow")
						};
						switch(ui.helper.context.id) {
							case "AI":
								data.id = ui.helper.context.id + "-" + (++cntAI);
								break;
							case "AO":
								data.id = ui.helper.context.id + "-" + (++cntAO);
								break;
							case "DI":
								data.id = ui.helper.context.id + "-" + (++cntDI);
								break;
							case "DO":
								data.id = ui.helper.context.id + "-" + (++cntDO);
								break;
							case "PID":
								data.id = ui.helper.context.id + "-" + (++cntPID);
								break;
							case "ADD":
								data.id = ui.helper.context.id + "-" + (++cntADD);
								break;
							case "SUB":
								data.id = ui.helper.context.id + "-" + (++cntSUB);
								break;
							case "MUL":
								data.id = ui.helper.context.id + "-" + (++cntMUL);
								break;
							case "DIV":
								data.id = ui.helper.context.id + "-" + (++cntDIV);
								break;
							case "AND":
								data.id = ui.helper.context.id + "-" + (++cntAND);
								break;
							case "OR":
								data.id = ui.helper.context.id + "-" + (++cntOR);
								break;
							case "NOT":
								data.id = ui.helper.context.id + "-" + (++cntNOT);
								break;
							case "OND":
								data.id = ui.helper.context.id + "-" + (++cntTON);
								break;
							case "OFFD":
								data.id = ui.helper.context.id + "-" + (++cntTOFF);
								break;
							case "UPCTR":
								data.id = ui.helper.context.id + "-" + (++cntUP);
								break;
							case "DWCTR":
								data.id = ui.helper.context.id + "-" + (++cntDOWN);
								break;
							case "RTO":
								data.id = ui.helper.context.id + "-" + (++cntRTO);
								break;
							case "RESET":
								data.id = ui.helper.context.id + "-" + (++cntRESET);
								break;
							case "LIM":
								data.id = ui.helper.context.id + "-" + (++cntLIM);
								break;
							case "CPT":
								data.id = ui.helper.context.id + "-" + (++cntCPT);
								break;
							case "CMP":
								data.id = ui.helper.context.id + "-" + (++cntCMP);
								break;
							case "DC":
								data.id = ui.helper.context.id + "-" + (++cntDC);
								break;
						}
						if(event.originalEvent.pageX >= 220) {
							if($("#btnRunmode").val() == "OffMode" && DCSSPACE.workflow.isEnabled()) {
								DCSSPACE.collection.get(tab_id).get("functionBlockCollection").add(new DCSSPACE.model.FunctionBlockModel(), data);
								var menu = new draw2d.FlowMenu(currentworkspace);
								currentworkspace.addSelectionListener(menu);
							}
						}
					}
				});
				return this;
			},
			/* Function for deselect body contents */
			disableSelection : function(target) {
				if( typeof target.onselectstart != "undefined")//IE
					target.onselectstart = function() {
						return false;
					}
				else if( typeof target.style.MozUserSelect != "undefined")//Firefox
					target.style.MozUserSelect = "none"
				else//All other
					target.onmousedown = function() {
						return false
					}
				target.style.cursor = "default"
			}
		});
		var blockView = Backbone.View.extend({
			el : '.createElement',
			initialize : function(formalObj) {
				//console.log("block view");
				var nodeObj = this.block(formalObj.data);
				this.updateView(nodeObj);
				this.PIDconfiguration();
			},
			render : function() {
				return this;
			},
			updateView : function(nodeobj) {
				var Areacollection = DCSSPACE.collection.get(tab_id);
				nodeobj.setSequenceNo(Areacollection.get("functionBlockCollection").get(nodeobj.getId()).get("sequenceNo"));
				nodeobj.setFooter("#" + Areacollection.get("functionBlockCollection").get(nodeobj.getId()).get("sequenceNo"));
				//console.log(DCSSPACE.collection.toJSON());
			},
			block : function(data) {
				var uniqueNo = data.id.split("-")[1];
				var Obj = new draw2d.node();
				Obj.setheader(data.id.split("-")[0]);
				Obj.setLabel(data.id.split("-")[0] + "#" + uniqueNo);
				switch(data.id.split("-")[0]) {
					case "AI":
					case "AO":
					case "DI":
					case "DO":
						Obj.setTagName("None");
						break;

					case "AND":
					case "OR" :
					case "ADD":
					case "SUB":
					case "MUL":
					case "DIV":
					case "DC" :
						Obj.top_right.style.display = "none";
						break;
					case "LIM":
						Obj.top_right.style.display = "none";
						this.model.set({
							"Low" : "",
							"High" : "",
							"Actual" : "",
						});
						break;
					case "CMP":
							Obj.top_right.style.display = "none";
						
							this.model.set({
								"Low" : "",
								"High" : "",
								"Actual" : "",
								"LT" : "",
								"GT" : "",
								"EQL" : "",
								"NEQL" : "",
								"inrange" : ""
							});
							break;
					case "UPCTR":
					case "DWCTR":
					case "OND":
					case "OFFD":
					case "RTO":
						Obj.setDimension(150, 191);
					
						this.model.set({
							"Preset" : 0,
							"ACC" : "" ,
							"prevInput": 0
						});
						break;
					case "NOT":
					case "CPT":
						Obj.top_right.style.display = "block";
					
						break;
				}
				var self = this;
				Obj.onDoubleClick = function() {
					$("#information").html(self.informationBlock(self.model));
				};
				Obj.btnReset.onclick = function() {
					var mode=$('#mode-selected').val();
					var mod = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(Obj.getId());
					var ajaxUrl,ajxFlag=false;
					// switch(parseInt(mode)){
					// case 1:
						// ajaxUrl='../../setConfigure.do';
						// ajxFlag=true;
						// break;
// 						
					// case 2:
						// ajaxUrl='../../setConfigureMM.do';
						// ajxFlag=true;
						// break;
					// case 3:
						//call vlab stop method
						
						mod.set({
							"ACC" : 0
						});
						DCSSPACE.view.blockView.prototype.blocksetContent(mod);
						DCSSPACE.view.blockView.prototype.informationBlock(mod);
						//break;
						
					//}
					
					
					if(ajxFlag==true){
					var jsonObj = {
							"area" : tab_id,
							"label"  : mod.get("label"),
							"type" : oThis.getnodeName(),
							"attr" :{
							"outputValue" :  "1",
							}
							
					};
					
					$.ajax({
						url : ajaxUrl,
						data : JSON.stringify(jsonObj),
						type : "POST",
						dataType : 'json',
						async : false,
						contentType : 'application/json',
						success : function() {
							alert("Thanks!");
						}
					});
					}
				}
				Obj.footer.onclick = function() {
					if($("#btnRunmode").val() == "OffMode") {
						var blockCollection = DCSSPACE.collection.get(tab_id).get("functionBlockCollection");
						$("#SequenceNo").css({
							"display" : "block"
						}).dialog({
							open : function(event, ui) {
								Obj.workflow.getCommandStack().execute(new draw2d.CommandChangeSequenceNo(data.workspace, Obj));
								$("#txtSequenceNo").val(blockCollection.get(Obj.getId()).get("sequenceNo"));
							},
							title : "Set Sequence No",
							height : 150,
							width : 250,
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
									var txtsequenceNo = parseInt($("#txtSequenceNo").val());
									if(txtsequenceNo != '' && txtsequenceNo > blockCollection.length && arraySequenceNo.indexOf(txtsequenceNo) == -1) {
										DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(Obj.getId()).set({
											"sequenceNo" : txtsequenceNo
										});
										//Sort collection according to sequence no
										blockCollection.sort();
										var SortedCollection = blockCollection.sortAsc(blockCollection);
										blockCollection.models = SortedCollection;
										arraySequenceNo.splice(0, arraySequenceNo.length);
										// remove all element
										for(var i = 0; i < blockCollection.models.length; i++) {
											var m = blockCollection.models[i].get("sequenceNo")
											arraySequenceNo.push(m);
										}
										DCSSPACE.view.blockView.prototype.updateView(Obj);
										//console.log(DCSSPACE.collection.toJSON());
										$(this).dialog("close");
									} else if(arraySequenceNo.indexOf(txtsequenceNo) == -1 && arraySequenceNo.length > 0) {
										blockCollection.get(Obj.getId()).set({
											"sequenceNo" : txtsequenceNo
										});
										arraySequenceNo.splice(0, arraySequenceNo.length);
										// remove all element
										for(var i = 0; i < blockCollection.models.length; i++) {
											var m = blockCollection.models[i].get("sequenceNo")
											arraySequenceNo.push(m);
										}
										DCSSPACE.view.blockView.prototype.updateView(Obj);
										//Sort collection according to sequence no
										blockCollection.sort();
										var SortedCollection = blockCollection.sortAsc(blockCollection);
										blockCollection.models = SortedCollection;
										//console.log(DCSSPACE.collection.toJSON());
										$(this).dialog("close");
									} else {
										alert("Sequence Number already exist!");
									}
								}
							}, {
								text : "Cancel",
								click : function() {
									$("#SequenceNo").css({
										"display" : "none"
									});
									$(this).dialog("close");
								}
							}],
						});
					}
				}
				data.workspace.addFigure(Obj, data.evt.pageX - 205, data.evt.pageY - 200);
				this.model.set({
					"label" : Obj.getLabel(),
					"sequenceNo" : this.getMaxSequenceNo(),
					"isEnable" : !(Obj.isDisable()),
					"Tag-name" : "",
					"id" : Obj.getId(),
					"blockid" : Obj.getheader(),
					"block" : Obj,
					"x" : Obj.getX(),
					"y" : Obj.getY(),
					"workspace" : Obj.workflow
				});
				Obj.model = this.model;
				//set model to Node object for future used
				Obj.CommandAdd(Obj.workflow, Obj, data.evt.pageX - 205, data.evt.pageY - 50);
				// call CommandAdd method of Node for undo/redo operation
				if(data.id.split("-")[1] == "AI" || data.id.split("-")[1] == "DI") {
					Obj.removePort(Obj.ports.data[0]);
					 // remove port its added twice.
				}
				$("#information").html(this.informationBlock(this.model));
				this.blocksetContent(this.model)
				return Obj;
			},
			blocksetContent : function(model) {
				var node = model.get("blockid").split("-")[0];
				switch(node) {
					case "UPCTR" :
					case "DWCTR" :
						//model.get("block").addButton("counter");
						model.get("block").setContent("<table height='100%' style='margin-top:0px;color:white; border-color:black'><tr valign='middle' align='center'><td width='300' height='50%'>Output: " + model.get('Output') + "</td></tr><tr><td><hr style='border-color: black; border-style: solid;' /></td></tr><tr><td width='150'>ACC : " + model.get('ACC') + "</td></tr><tr><td width='150'>Preset: " + model.get('Preset') + "</td></tr></table>");
						return model.get("block");
						break;
					case "OND" :
					case "OFFD" :
					case "RTO" :
						model.get("block").setContent("<table height='100%' style='margin-top:0px;color:white; border-color:black'><tr valign='middle' align='center'><td width='300' height='50%'>Output: " + model.get('Output') + "</td></tr><tr><td><hr style='border-color: black; border-style: solid;' /></td></tr><tr><td width='150'>ACC : " + model.get('ACC') + "</td></tr><tr><td width='150'>Preset: " + model.get('Preset') + "</td></tr></table>");
						return model.get("block");
						break;
					case "PID" :
						model.get("block").setContent("<table width='100%' height='100%' style='margin-top:0px;color:white; font-size:12'><tr><td align='center'>Value: " + model.get('Output') + "</td></tr></table>");
						return model.get("block");
						break;
					case "AI" :
					case "DI" :
					case "AO" :
					case "DO" :
						model.get("block").setContent("<table height='100%' style='margin-top:0px;color:white'><tr valign='middle' align='center'><td width='300'>Value: " + model.get('Output') + "</td></tr></table>");
						break;
					case "LIM" :
						model.get("block").setContent("<table height='100%' style='margin-top:0px;color:white'><tr valign='middle' align='center'><td width='50%'><table style='width:100%; height:100%;color:white'><tr><td nowrap='nowrap'>Low: " + model.get("Low") + "</td></tr><tr><td nowrap='nowrap'>Actual: " + model.get("Actual") + "</td></tr><tr><td nowrap='nowrap'>High: " + model.get("High") + "</td></tr></table></td><td width='1' bgcolor='black'>&nbsp;</td><td style='width:50%' nowrap='nowrap'>Value: " + model.get("Output") + "</td></tr></table>");
						break;
					case "CMP" :
						model.get("block").setContent("<table height='100%' style='margin-top:0px;color:white'><tr valign='middle' align='center'><td width='50%'><table style='width:100%; height:100%;color:white'><tr><td nowrap='nowrap'>Low: " + model.get("Low") + "</td></tr><tr><td nowrap='nowrap'>Actual: " + model.get("Actual") + "</td></tr><tr><td nowrap='nowrap'>High: " + model.get("High") + "</td></tr></table></td><td width='1' bgcolor='black'>&nbsp;</td><td style='width:50%' nowrap='nowrap'><table style='width:100%; height:100%;color:white'><tr><td nowrap='nowrap' align='right'>LT:  " + model.get("LT") + "</td></tr><tr><td nowrap='nowrap' align='right'>GT: " + model.get("GT") + "</td></tr><tr><td nowrap='nowrap' align='right'>EQL: " + model.get("EQL") + "</td></tr><tr><td nowrap='nowrap' align='right'>NEQL: " + model.get("NEQL") + "</td></tr><tr><td nowrap='nowrap' align='right'>InRange: " + model.get("inrange") + "</td></tr></table></td></tr></table>");
						break;
					default :
						model.get("block").setContent("<table width='100%' height='100%' style='margin-top:0px;color:white'><tr valign='middle' align='center'><td width='69' align='center'>Output: " + model.get("Output") + "</td></tr></table>");
						break;
				}
			},
			informationBlock : function(model) {
				var html;
				var node = model.get('blockid').split("-")[0];
				switch(node) {
					case "AI":
					case "DI":
					case "AO":
					case "DO":
						var par = model.get('id').toString();
						var mapaddress = model.get('Map-Address') != undefined ? model.get('Map-Address') : '';
						html = "<div style=width:'100%'><table border='0' width='100%' class='infoblock'><tr class='propertyTitle'><td align='center'>Property Window</td></tr>" + "<tr><td><label id='lbltype' class='propertyLabels'>Type: </label><label>" + model.get('blockid') + "</label></td></tr>" + "<tr><td><label id='lblLabel' class='propertyLabels'>Label:</label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.IOBloackConfig(" + "'" + model.get('id') + "'" + ");> " + model.get('label') + "</label></td></tr>" + "<tr><td><label id='lblTagname' class='propertyLabels'>Tag Name: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.IOBloackConfig(" + "'" + model.get('id') + "'" + ");>" + model.get('Tag-name') + "</label></td></tr>" + "<tr><td><label id='lblMapAddress' class='propertyLabels'>Map Address: </label><label>" + mapaddress + "</label></td></tr>" + "<tr><td><label id='lblInput' class='propertyLabels'>Input: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.SettingInputvalues(" + "'" + model.get('id') + "'" + ");>" + model.get('Input') + "</label></td></tr>" + "<tr><td><label id='lblOutput' class='propertyLabels'>Output: </label><label>" + model.get('Output') + "</label></td></tr></table></div>";
						return html;
						break;
					case "OFFD":
						var html = "<div style=width:'100%'><table border='0' width='100%' class='infoblock'><tr class='propertyTitle'><td align='center'>Property Window</td></tr>" + "<tr><td><label id='lbltype' class='propertyLabels'>Type: " + model.get('blockid') + "</label></td></tr>" + "<tr><td><label id='lblLabel' class='propertyLabels'>Label: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.TimerAndCntBlockConfig(" + "'" + model.get('id') + "'" + ");>" + model.get('label') + "</label></td></tr>" + "<tr><td><label id='lblInput' class='propertyLabels'>Input: </label><label>" + model.get('Input') + "</label></td></tr>" + "<tr><td><label id='lblOutput' class='propertyLabels'>Output: </label><label>" + model.get('Output') + "</label></td></tr>" + "<tr><td><label id='lbltimeduration' class='propertyLabels'>Time Duration: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.TimerAndCntBlockConfig(" + "'" + model.get('id') + "'" + ");>" + model.get('Preset') + "</label></td></tr></table></div>";
						return html;
						break;
					case "OND":
					case "RTO":
						var html = "<div style=width:'100%'><table border='0' width='100%' class='infoblock'><tr class='propertyTitle'><td align='center'>Property Window</td></tr>" + "<tr><td><label id='lbltype' class='propertyLabels'>Type: " + model.get('blockid') + "</label></td></tr>" + "<tr><td><label id='lblLabel' class='propertyLabels'>Label: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.TimerAndCntBlockConfig(" + "'" + model.get('id') + "'" + ");>" + model.get('label') + "</label></td></tr>" + "<tr><td><label id='lblInput' class='propertyLabels'>Input: </label><label>" + model.get('Input') + "</label></td></tr>" + "<tr><td><label id='lblOutput' class='propertyLabels'>Output: </label><label>" + model.get('Output') + "</label></td></tr>" + "<tr><td><label id='lblAccumlator' class='propertyLabels'>Accumlator: </label><label>" + model.get('ACC')+ "</label></td></tr>" + "<tr><td><label id='lbltimeduration' class='propertyLabels'>Time Duration: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.TimerAndCntBlockConfig(" + "'" + model.get('id') + "'" + ");>" + model.get('Preset') + "</label></td></tr></table></div>";
						return html;
						break;
					case "UPCTR":
					case "DWCTR":
						var cnttype = model.get('id').split("-")[0] == "UPCTR" ? "Up" : "Down";
						var html = "<div style=width:'100%'><table border='0' width='100%' class='infoblock'><tr class='propertyTitle'><td align='center'>Property Window</td></tr>" + "<tr><td><label id='lbltype' class='propertyLabels'>Type: " + model.get('blockid') + "</label></td></tr>" + "<tr><td><label id='lblLabel' class='propertyLabels'>Label: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.PIDBlockConfig(" + "'" + model.get('id') + "'" + ");>" + model.get('label') + "</label></td></tr>" + "<tr><td><label id='lblInput' class='propertyLabels'>Input: </label><label>" + model.get('Input') + "</label></td></tr>" + "<tr><td><label id='lblOutput' class='propertyLabels'>Output: </label><label>" + model.get('Output') + "</label></td></tr>" + "<tr><td><label id='lblcnttype' class='propertyLabels'>Counter Type: </label><label>" + cnttype + " counter</label></td></tr>" + "<tr><td><label id='lblpreset' class='propertyLabels'>Preset: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.PIDBlockConfig(" + "'" + model.get('id') + "'" + ");>" + model.get('Preset') + "</label></td></tr>" + "<tr><td><label id='lblcount' class='propertyLabels'>Count: </label><label>" + model.get('Preset') + "</label></td></tr></table></div>";
						return html;
						break;
					case "PID":
						var controllerType = model.get('Controller Type');
						switch(controllerType) {
							case "P":
								var html = "<div style=width:'100%'><table border='1' width='100%' class='infoblock'><tr class='propertyTitle'><td align='center'>Property Window</td></tr>" + "<tr><td><label id='lbltype' class='propertyLabels'>Type: " + model.get('blockid') + "</label></td></tr>" + "<tr><td><label id='lblLabel' class='propertyLabels'>Label: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.PIDBlockConfig(" + "'" + model.get('id') + "'" + ");>" + model.get('label') + "</label></td></tr>" + "<tr><td><label id='lblmode' class='propertyLabels'>Mode: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.PIDBlockConfig(" + "'" + model.get('id') + "'" + ");>" + model.get('Mode') + "</label></td></tr>" + "<tr><td><label id='lblActiontype' class='propertyLabels'>Action Type: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.PIDBlockConfig(" + "'" + model.get('id') + "'" + ");>" + model.get('Action Type') + "</label></td></tr>" + "<tr><td><label id='lblcontrollertype' class='propertyLabels'>Controller Type: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.PIDBlockConfig(" + "'" + model.get('id') + "'" + ");>" + model.get('Controller Type') + "</label></td></tr>" + "<tr><td><label id='lblpornlgain' class='propertyLabels'>Propertional Gain: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.PIDBlockConfig(" + "'" + model.get('id') + "'" + ");>" + model.get('Propertional Gain') + "</label></td></tr>" + "<tr><td><label id='lblsetpoint' class='propertyLabels'>Set Point: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.PIDBlockConfig(" + "'" + model.get('id') + "'" + ");>" + model.get('Set Point') + "</label></td></tr>" + "<tr><td><label id='lblmaxval' class='propertyLabels'>Max Value: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.PIDBlockConfig(" + "'" + model.get('id') + "'" + ");>" + model.get('Max Value') + "</label></td></tr>" + "<tr><td><label id='lblminval' class='propertyLabels'>Min Value: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.PIDBlockConfig(" + "'" + model.get('id') + "'" + ");>" + model.get('Min Value') + "</label></td></tr>" + "<tr><td><label id='lblpornlbias' class='propertyLabels'>Proportional Bias: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.PIDBlockConfig(" + "'" + model.get('id') + "'" + ");>" + model.get('Proportional Bias') + "</label></td></tr></table></div>";
								return html;
								break;
							case "PI":
								var html = "<div style=width:'100%'><table border='1' width='100%' class='infoblock'><tr class='propertyTitle'><td align='center'>Property Window</td></tr>" + "<tr><td><label id='lbltype' class='propertyLabels'>Type: " + model.get('blockid') + "</label></td></tr>" + "<tr><td><label id='lblLabel' class='propertyLabels'>Label: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.PIDBlockConfig(" + "'" + model.get('id') + "'" + ");>" + model.get('label') + "</label></td></tr>" + "<tr><td><label id='lblmode' class='propertyLabels'>Mode: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.PIDBlockConfig(" + "'" + model.get('id') + "'" + ");>" + model.get('Mode') + "</label></td></tr>" + "<tr><td><label id='lblActiontype' class='propertyLabels'>Action Type: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.PIDBlockConfig(" + "'" + model.get('id') + "'" + ");>" + model.get('Action Type') + "</label></td></tr>" + "<tr><td><label id='lblcontrollertype' class='propertyLabels'>Controller Type: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.PIDBlockConfig(" + "'" + model.get('id') + "'" + ");>" + model.get('Controller Type') + "</label></td></tr>" + "<tr><td><label id='lblPIDtype' class='propertyLabels'>PID Type: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.PIDBlockConfig(" + "'" + model.get('id') + "'" + ");>" + model.get('PID Type') + "</label></td></tr>" + "<tr><td><label id='lblpornlgain' class='propertyLabels'>Propertional Gain: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.PIDBlockConfig(" + "'" + model.get('id') + "'" + ");>" + model.get('Propertional Gain') + "</label></td></tr>" + "<tr><td><label id='lblsetpoint' class='propertyLabels'>Set Point: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.PIDBlockConfig(" + "'" + model.get('id') + "'" + ");>" + model.get('Set Point') + "</label></td></tr>" + "<tr><td><label id='lblmaxval' class='propertyLabels'>Max Value: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.PIDBlockConfig(" + "'" + model.get('id') + "'" + ");>" + model.get('Max Value') + "</label></td></tr>" + "<tr><td><label id='lblminval' class='propertyLabels'>Min Value: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.PIDBlockConfig(" + "'" + model.get('id') + "'" + ");>" + model.get('Min Value') + "</label></td></tr>" + "<tr><td><label id='lblInitialop' class='propertyLabels'>Intial Output: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.PIDBlockConfig(" + "'" + model.get('id') + "'" + ");>" + model.get('Intial Output') + "</label></td></tr>" + "<tr><td><label id='lblIntegralgain' class='propertyLabels'>Integral Gain: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.PIDBlockConfig(" + "'" + model.get('id') + "'" + ");>" + model.get('Integral Gain') + "</label></td></tr></table></div>";
								return html;
								break;
							case "PD":
								var html = "<div style=width:'100%'><table border='1' width='100%' class='infoblock'><tr class='propertyTitle'><td align='center'>Property Window</td></tr>" + "<tr><td><label id='lbltype' class='propertyLabels'>Type: " + model.get('blockid') + "</label></td></tr>" + "<tr><td><label id='lblLabel' class='propertyLabels'>Label: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.PIDBlockConfig(" + "'" + model.get('id') + "'" + ");>" + model.get('label') + "</label></td></tr>" + "<tr><td><label id='lblmode' class='propertyLabels'>Mode: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.PIDBlockConfig(" + "'" + model.get('id') + "'" + ");>" + model.get('Mode') + "</label></td></tr>" + "<tr><td><label id='lblActiontype' class='propertyLabels'>Action Type: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.PIDBlockConfig(" + "'" + model.get('id') + "'" + ");>" + model.get('Action Type') + "</label></td></tr>" + "<tr><td><label id='lblcontrollertype' class='propertyLabels'>Controller Type: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.PIDBlockConfig(" + "'" + model.get('id') + "'" + ");>" + model.get('Controller Type') + "</label></td></tr>" + "<tr><td><label id='lblPIDtype' class='propertyLabels'>PID Type: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.PIDBlockConfig(" + "'" + model.get('id') + "'" + ");>" + model.get('PID Type') + "</label></td></tr>" + "<tr><td><label id='lblpornlgain' class='propertyLabels'>Propertional Gain: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.PIDBlockConfig(" + "'" + model.get('id') + "'" + ");>" + model.get('Propertional Gain') + "</label></td></tr>" + "<tr><td><label id='lblsetpoint' class='propertyLabels'>Set Point: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.PIDBlockConfig(" + "'" + model.get('id') + "'" + ");>" + model.get('Set Point') + "</label></td></tr>" + "<tr><td><label id='lblmaxval' class='propertyLabels'>Max Value: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.PIDBlockConfig(" + "'" + model.get('id') + "'" + ");>" + model.get('Max Value') + "</label></td></tr>" + "<tr><td><label id='lblminval' class='propertyLabels'>Min Value: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.PIDBlockConfig(" + "'" + model.get('id') + "'" + ");>" + model.get('Min Value') + "</label></td></tr>" + "<tr><td><label id='lblpornlbias' class='propertyLabels'>Proportional Bias: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.PIDBlockConfig(" + "'" + model.get('id') + "'" + ");>" + model.get('Proportional Bias') + "</label></td></tr>" + "<tr><td><label id='lblDerivativegain' class='propertyLabels'>Derivative Gain: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.PIDBlockConfig(" + "'" + model.get('id') + "'" + ");>" + model.get('Derivative Gain') + "</label></td></tr>" + "<tr><td><label id='lblRate' class='propertyLabels'>Rate: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.PIDBlockConfig(" + "'" + model.get('id') + "'" + ");>" + model.get('Rate') + "</label></td></tr></table></div>";
								return html;
								break;
							case "PID":
								var html = "<div style=width:'100%'><table border='1' width='100%' class='infoblock'><tr class='propertyTitle'><td align='center'>Property Window</td></tr>" + "<tr><td><label id='lbltype' class='propertyLabels'>Type: " + model.get('blockid') + "</label></td></tr>" + "<tr><td><label id='lblLabel' class='propertyLabels'>Label: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.PIDBlockConfig(" + "'" + model.get('id') + "'" + ");>" + model.get('label') + "</label></td></tr>" + "<tr><td><label id='lblmode' class='propertyLabels'>Mode: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.PIDBlockConfig(" + "'" + model.get('id') + "'" + ");>" + model.get('Mode') + "</label></td></tr>" + "<tr><td><label id='lblActiontype' class='propertyLabels'>Action Type: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.PIDBlockConfig(" + "'" + model.get('id') + "'" + ");>" + model.get('Action Type') + "</label></td></tr>" + "<tr><td><label id='lblcontrollertype' class='propertyLabels'>Controller Type: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.PIDBlockConfig(" + "'" + model.get('id') + "'" + ");>" + model.get('Controller Type') + "</label></td></tr>" + "<tr><td><label id='lblPIDtype' class='propertyLabels'>PID Type: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.PIDBlockConfig(" + "'" + model.get('id') + "'" + ");>" + model.get('PID Type') + "</label></td></tr>" + "<tr><td><label id='lblpornlgain' class='propertyLabels'>Propertional Gain: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.PIDBlockConfig(" + "'" + model.get('id') + "'" + ");>" + model.get('Propertional Gain') + "</label></td></tr>" + "<tr><td><label id='lblsetpoint' class='propertyLabels'>Set Point: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.PIDBlockConfig(" + "'" + model.get('id') + "'" + ");>" + model.get('Set Point') + "</label></td></tr>" + "<tr><td><label id='lblmaxval' class='propertyLabels'>Max Value: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.PIDBlockConfig(" + "'" + model.get('id') + "'" + ");>" + model.get('Max Value') + "</label></td></tr>" + "<tr><td><label id='lblminval' class='propertyLabels'>Min Value: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.PIDBlockConfig(" + "'" + model.get('id') + "'" + ");>" + model.get('Min Value') + "</label></td></tr>" + "<tr><td><label id='lblpornlbias' class='propertyLabels'>Proportional Bias: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.PIDBlockConfig(" + "'" + model.get('id') + "'" + ");>" + model.get('Proportional Bias') + "</label></td></tr>" + "<tr><td><label id='lblDerivativegain' class='propertyLabels'>Derivative Gain: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.PIDBlockConfig(" + "'" + model.get('id') + "'" + ");>" + model.get('Derivative Gain') + "</label></td></tr>" + "<tr><td><label id='lblInitialop' class='propertyLabels'>Intial Output: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.PIDBlockConfig(" + "'" + model.get('id') + "'" + ");>" + model.get('Intial Output') + "</label></td></tr>" + "<tr><td><label id='lblIntegralgain' class='propertyLabels'>Integral Gain: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.PIDBlockConfig(" + "'" + model.get('id') + "'" + ");>" + model.get('Integral Gain') + "</label></td></tr>" + "<tr><td><label id='lblRate' class='propertyLabels'>Rate: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.PIDBlockConfig(" + "'" + model.get('id') + "'" + ");>" + model.get('Rate') + "</label></td></tr></table></div>";
								return html;
								break;
							default:
								var html = "";
								return html;
								break;
						}
						break;
					case "CMP":
						var html = "<div style=width:'100%'><table border='0' width='100%' class='infoblock'><tr class='propertyTitle'><td align='center'>Property Window</td></tr>" + "<tr><td><label id='lbltype' class='propertyLabels'>Type: " + model.get('id') + "</label></td></tr>" + "<tr><td><label id='lblLabel' class='propertyLabels'>Label: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.LabelChangeConfig(" + "'" + model.get('blockid') + "'" + ");>" + model.get('label') + "</label></td></tr>" + "<tr><td><label id='lblLow' class='propertyLabels'>Low value: </label><label>" + model.get('Low') + "</label></td></tr>" + "<tr><td><label id='lblHigh' class='propertyLabels'>High Value: </label><label>" + model.get('High') + "</label></td></tr>" + "<tr><td><label id='lblActual' class='propertyLabels'>Actual Value: </label><label>" + model.get('Actual') + "</label></td></tr>" + "<tr><td><label id='lblLT' class='propertyLabels'>LT: </label><label>" + model.get('LT') + "</label></td></tr>" + "<tr><td><label id='lblGT' class='propertyLabels'>GT: </label><label>" + model.get('GT') + "</label></td></tr>" + "<tr><td><label id='lblEQL' class='propertyLabels'>EQL: </label><label>" + model.get('EQL') + "</label></td></tr>" + "<tr><td><label id='lblNEQL' class='propertyLabels'>NEQL: </label><label>" + model.get('NEQL') + "</label></td></tr>" + "<tr><td><label id='lblInRange' class='propertyLabels'>Inrange: </label><label>" + model.get('inrange') + "</label></td></tr></table></div>";
						return html;
						break;
					case "LIM":
						var html = "<div style=width:'100%'><table border='0' width='100%' class='infoblock'><tr class='propertyTitle'><td align='center'>Property Window</td></tr>" + "<tr><td><label id='lbltype' class='propertyLabels'>Type: " + model.get('id') + "</label></td></tr>" + "<tr><td><label id='lblLabel' class='propertyLabels'>Label: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.LabelChangeConfig(" + "'" + model.get('blockid') + "'" + ");>" + model.get('label') + "</label></td></tr>" + "<tr><td><label id='lblLow' class='propertyLabels'>Low value: </label><label>" + model.get('Low') + "</label></td></tr>" + "<tr><td><label id='lblHigh' class='propertyLabels'>High Value: </label><label>" + model.get('High') + "</label></td></tr>" + "<tr><td><label id='lblActual' class='propertyLabels'>Actual Value: </label><label>" + model.get('Actual') + "</label></td></tr>" + "<tr><td><label id='lbloutput' class='propertyLabels'>Output: </label><label>" + model.get('output') + "</label></td></tr></table></div>";
						return html;
						break;
					default:
						var html = "<div style=width:'100%'><table border='0' width='100%' class='infoblock'><tr class='propertyTitle'><td align='center'>Property Window</td></tr>" + "<tr><td><label id='lbltype' class='propertyLabels'>Type: " + model.get('blockid') + "</label></td></tr>" + "<tr><td><label id='lblLabel' class='propertyLabels'>Label: </label><label class='PropertyLabelValues' onclick=DCSSPACE.view.blockView.prototype.LabelChangeConfig(" + "'" + model.get('blockid') + "'" + ");>" + model.get('label') + "</label></td></tr>" + "<tr><td><label id='lblLow' class='propertyLabels'>Input: </label><label>" + model.get('Input') + "</label></td></tr>" + "<tr><td><label id='lbloutput' class='propertyLabels'>Output: </label><label>" + model.get('Output') + "</label></td></tr></table></div>";
						return html;
						break;
				}
			},
			PIDconfiguration : function() {
				$("#selModeType").val("select");
				$("#actiontype,#controlType, #required, #propbaise, #typeconfig, #piValue, #derivativeGain, #rate").css({
					"display" : "none"
				});
				$("#selModeType").change(function() {
					$("#lblerror").css({
						"display" : "none"
					});
					var selModeType = $("#selModeType").val();
					switch(selModeType) {
						case "Auto":
							$("#manualvalue").css({
								"display" : "none"
							});
							$("#actiontype,#controlType").css({
								"display" : "block"
							});
							$("#ddlActiontype,#controlIDType").val("select");
							$("#actiontype").focus();
							$("#controlIDType").change(function() {
								$("#lblerror").css({
									"display" : "none"
								});
								var controlIDType = $("#controlIDType").val();
								switch(controlIDType) {
									case "P":
										$("#required,#propbaise").css({
											"display" : "block"
										});
										$("#setPoint").focus();
										$("#typeconfig,#piValue,#rate,#derivativeGain").css({
											"display" : "none"
										});
										break;
									case "PI":
										$("#required,#typeconfig,#piValue,#propbaise,#rate").css({
											"display" : "block"
										});
										$("#ddlPIDtype").focus();
										$("#derivativeGain").css({
											"display" : "none"
										});
										break;
									case "PD":
										$("#required,#propbaise,#typeconfig,#derivativeGain,#rate").css({
											"display" : "block"
										});
										$("#ddlPIDtype").focus();
										$("#piValue").css({
											"display" : "none"
										});
										break;
									case "PID":
										$("#required,#propbaise,#typeconfig,#piValue,#derivativeGain,#rate").css({
											"display" : "block"
										});
										$("#ddlPIDtype").focus();
										break;
									case "select":
										$("#required,#propbaise,#typeconfig,#piValue,#derivativeGain,#rate").css({
											"display" : "none"
										});
										break;
								}
							});
							break;
						case "Manual":
							$("#manualvalue").css({
								"display" : "block"
							});
							$("#txtmanualvalue").focus();
							$("#actiontype,#controlType,#required,#propbaise,#typeconfig,#piValue,#derivativeGain,#rate").css({
								"display" : "none"
							});
							break;
						case "select":
							$("#actiontype,#controlType,#required,#propbaise,#typeconfig,#piValue,#derivativeGain,#rate,#manualvalue").css({
								"display" : "none"
							});
							break;
					}
				});
			},
			ReduceSequenceNo : function(value) {
				var AllModels = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").models.sort();
				$.each(AllModels, function(i) {
					var currentBlockSequenceNo = AllModels[i].get("sequenceNo");
					if(currentBlockSequenceNo >= value) {
						AllModels[i].get("block").setSequenceNo(currentBlockSequenceNo - 1);
						AllModels[i].set({
							"sequenceNo" : AllModels[i].get("block").getSequenceNo()
						});
						DCSSPACE.view.blockView.prototype.updateView(AllModels[i].get("block"));
						//console.log(AllModels);
						if(AllModels[i + 1] != undefined)
							value = AllModels[i + 1].get("sequenceNo");
						//set next element sequence no to value
					}
				});
			},
			ExtendSequenceNo : function(value) {
				var AllModels = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").models;
				$.each(AllModels, function(i) {
					var currentBlockSequenceNo = AllModels[i].get("sequenceNo");
					if(currentBlockSequenceNo >= value) {
						AllModels[i].get("block").setSequenceNo(currentBlockSequenceNo + 1);
						AllModels[i].set({
							"sequenceNo" : AllModels[i].get("block").getSequenceNo()
						});
						DCSSPACE.view.blockView.prototype.updateView(AllModels[i].get("block"));
						//console.log(AllModels);
						if(AllModels[i + 1] != undefined)
							value = AllModels[i + 1].get("sequenceNo");
						//set next element sequence no to value
					}
				});
			},
			getMaxSequenceNo : function() {
				var m = [];
				var blockCollection = DCSSPACE.collection.get(tab_id).get("functionBlockCollection");
				if(blockCollection.models.length > 0) {
					for(var i = 0; i < blockCollection.models.length; i++) {
						if(blockCollection.models[i].get("sequenceNo") != null) {
							m.push(blockCollection.models[i].get("sequenceNo"));
						} else if(m.length == 0) {
							return m.length + 1;
						}
					}
					return m[m.length - 1] + 1;
				}
			},
			IOBloackConfig : function(objname) {
				if($("#btnRunmode").val() == "OffMode") {
					var IOModel = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(objname);
					$("#ddltagname").val(IOModel.get("Map-Address"));
					$("#txtlabel").val(IOModel.get("label"));
					IOModel.get("Map-Address") != "" ? $("#txtMappingAddress").val(IOModel.get("Map-Address")) : $("#txtMappingAddress").val($("#ddltagname").val());
					IOModel.get("description") != "" ? $("#lblDesc").val(IOModel.get("description")) : "";
					oThis = IOModel.get("block");
					$("#Functionalblocktag").css({
						"display" : "block"
					}).dialog({
						title : 'Configuration',
						height : 270,
						width : 300,
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
								oThis.setTagName($("#ddltagname option:selected").text());
								oThis.showToolTip($("#lblDesc").val());
								IOModel.set({
									"description" : $("#lblDesc").val(),
									"Tag-name" : oThis.getTagName(),
									"Map-Address" : $("#ddltagname").val()
								});
								DCSSPACE.view.blockView.prototype.updateView(oThis);
								DCSSPACE.view.blockView.prototype.informationBlock(IOModel);
								//console.log(DCSSPACE.collection.toJSON());
								$(this).dialog("close");
							}
						}, {
							text : "Close",
							click : function() {
								$("#Functionalblocktag").css({
									"display" : "none"
								});
								$(this).dialog("close");
							}
						}],
					})
				}
			},
			resetBlockConfig : function(objName) {
			if($("#btnRunmode").val() == "OffMode") {
				var resetModel = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(objName);
				oThis = resetModel.get("block");
				$("#txtRstlbl").val(resetModel.get("label")); resetModel.get("description") != "" ? $("#lblRstDesc").val(resetModel.get("description")) : $("#lblRstDesc").val(''); resetModel.get("rstcntname") != "" ? $("#ddlrstSelectCounterName").val(resetModel.get("rstcntname")) : $("#ddlrstSelectCounterName").val('none');
				$("#resetdiv").css({
					"display" : "block"
				}).dialog({
					title : 'Configuration',
					height : 190,
					width : 300,
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
							oThis.showToolTip($("#lblDesc").val());
							resetModel.set({
								"description" : $("#lblDesc").val(),
								"rstcntname" : $("#ddlrstSelectCounterName").val(),
							});
							DCSSPACE.view.blockView.prototype.updateView(oThis);
							DCSSPACE.view.blockView.prototype.informationBlock(resetModel);
							//console.log(DCSSPACE.collection.toJSON());
							$(this).dialog("close");
						}
					}, {
						text : "Close",
						click : function() {
							$("#resetdiv").css({
								"display" : "none"
							});
							$(this).dialog("close");
						}
					}],
				})
			}
		},
		modelsIterator : function(models) {// itreator for reset block to get ddlrstSelectCounterName option
			if(models != null && models.length > 0) {
				$.each(models, function(j) {
					var objName = models[j].get("blockid");
					if(objName == "UPCTR" || objName == "DWCTR" || objName == "RTO") {
						var sequenceNo = models[j].get("sequenceNo");
						var cntlabel = models[j].get("label");
						var optionValue = objName + "-" + sequenceNo;
						if($('#ddlrstSelectCounterName>option:selected').text() == "None"){
							$("#ddlrstSelectCounterName").html("");
						}
						var option = "<option value=" + cntlabel + ">" + optionValue + "</option>";
						$("#ddlrstSelectCounterName").append(option);
					}
				});
			}/*
			else{
							$("#ddlrstSelectCounterName").html("<option value='none'>None</option>");
						}*/
			
		},
			
			TimerAndCntBlockConfig : function(objname) {
				if($("#btnRunmode").val() == "OffMode") {
					var TimerModel = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(objname);
					oThis = TimerModel.get("block");
					$("#txtTimerCounterlbl").val(TimerModel.get("label")); TimerModel.get("description") != "" ? $("#lblTimerDesc").val(TimerModel.get("description")) : $("#lblTimerDesc").val('');
					$("#txtpreset").val(TimerModel.get("Preset"));
					$("#TimerConfig").css({
						"display" : "block"
					}).dialog({
						title : 'Configuration',
						height : 240,
						width : 300,
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
								// Validate & submit block details in model
								var presetvalue = $("#txtpreset").val();
								oThis.showToolTip($("#lblTimerDesc").val());
								TimerModel.set({
									"description" : $("#lblTimerDesc").val(),
									"Preset" : presetvalue
								});
								//console.log(DCSSPACE.collection.toJSON());
								DCSSPACE.view.blockView.prototype.blocksetContent(TimerModel);
								DCSSPACE.view.blockView.prototype.informationBlock(TimerModel);
								$(this).dialog("close");
							}
						}, {
							text : "Close",
							click : function() {
								$("#TimerConfig").css({
									"display" : "none"
								});
								$("#lbl").text('');
								$(this).dialog("close");
							}
						}],
					});
				}
			},
			PIDBlockConfig : function(objname) {
				var PIDModel = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(objname);
				var oThis = PIDModel.get("block");
				PIDModel.set({"PreviousEp" : 0});
				$("#lblPIDlabel").val(PIDModel.get("label")); PIDModel.get("description") != "" ? $("#lblDescription").val(PIDModel.get("description")) : $("#lblDescription").val("");
				var mode = PIDModel.get("Mode");
				if(mode != undefined) {
					switch(mode) {
						case "Auto":
							$("#selModeType").val("Auto");
							if($("#ddlActiontype").val() === PIDModel.get("Action Type")) {
								$("#ddlActiontype").val(PIDModel.get("Action Type"));
							} else {
								$("#ddlActiontype").val("select");
							}
							$("#setPoint").val(PIDModel.get("Set Point"));
							$("#maxvalue").val(PIDModel.get("Max Value"));
							$("#minvalue").val(PIDModel.get("Min Value"));
							$("#propbaiseValue").val(PIDModel.get("Proportional Bias"));
							$("#propgain").val(PIDModel.get("Propertional Gain"));
							$("#actiontype,#controlType").css({
								"display" : "block"
							});
							var ControllerType = PIDModel.get("Controller Type");
							switch(ControllerType) {
								case "P":
									$("#controlIDType").val("P");

									$("#required,#propbaise").css({
										"display" : "block"
									});
									$("#typeconfig,#piValue,#rate,#derivativeGain").css({
										"display" : "none"
									});
									break;
								case "PI":
									$("#required,#typeconfig,#piValue,#rate,#propbaise").css({
										"display" : "block"
									});
									$("#controlIDType").val("PI");
									if($("#ddlPIDtype").val() === PIDModel.get("PID Type")) {
										$("#ddlPIDtype").val(PIDModel.get("PID Type"));
									} else {
										$("#ddlPIDtype").val("select");
									}
									//$("#propbaiseValue").val(PIDModel.get("Proportional Bias"));
									$("#controllerValue").val(PIDModel.get("Intial Output"));
									$("#intergalGainValue").val(PIDModel.get("Integral Gain"));
									$("#rateValue").val(PIDModel.get("Rate"));
									$("#derivativeGain").css({
										"display" : "none"
									});
									break
								case "PD":
									$("#controlIDType").val("PD");
									if($("#ddlPIDtype").val() === PIDModel.get("PID Type")) {
										$("#ddlPIDtype").val(PIDModel.get("PID Type"));
									} else {
										$("#ddlPIDtype").val("select");
									}
									//$("#propbaiseValue").val(PIDModel.get("Proportional Bias"));
									$("#derivativeGainValue").val(PIDModel.get("Derivative Gain"));
									$("#rateValue").val(PIDModel.get("Rate"));
									$("#required,#propbaise,#typeconfig,#derivativeGain,#rate").css({
										"display" : "block"
									});
									$("#piValue").css({
										"display" : "none"
									});
									break;
								case"PID":
									$("#controlIDType").val("PID");
									if($("#ddlPIDtype").val() === PIDModel.get("PID Type")) {
										$("#ddlPIDtype").val(PIDModel.get("PID Type"));
									} else {
										$("#ddlPIDtype").val("select");
									}
									//$("#propbaiseValue").val(PIDModel.get("Proportional Bias"));
									$("#controllerValue").val(PIDModel.get("Intial Output"));
									$("#intergalGainValue").val(PIDModel.get("Integral Gain"));
									$("#derivativeGainValue").val(PIDModel.get("Derivative Gain"));
									$("#rateValue").val(PIDModel.get("Rate"));
									$("#required,#propbaise,#typeconfig,#piValue,#derivativeGain,#rate").css({
										"display" : "block"
									});
									break
							}
							break;
						case "Manual":
							$("#selModeType").val("Manual");
							$("#manualvalue").css({
								"display" : "block"
							});
							$("#txtmanualvalue").val(PIDModel.get("Output"));
							break;
						case "select":
							$("#selModeType").val("select");
							$("#manualvalue,#actiontype,#ddlActiontype,,#propbaise,#typeconfig,#piValue,#derivativeGain,#rate,#required").css({
								"display" : "none"
							});
							$("#ddlActiontype,#controlIDType").val("select");
							break;
					}
				} else {
					$("#selModeType").val("select");
					$("#manualvalue,#actiontype,#controlType,#propbaise,#typeconfig,#piValue,#derivativeGain,#rate,#required").css({
						"display" : "none"
					});
					$("#ddlActiontype,#controlIDType").val("select");
				}
				$("#PIDConfig").css({
					"display" : "block"
				}).dialog({
					title : 'Configuration',
					height : 450,
					width : 450,
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
							//console.log("Submit");
							PIDModel.set({
								"description" : $("#lblDescription").val()
							});
							oThis.showToolTip($("#lblDescription").val());
							var flag = DCSSPACE.view.blockView.prototype.validate();
							if(flag) {
								var selModeType = $("#selModeType").val();
								switch(selModeType) {
									case "Auto":
										PIDModel.set({
											"Mode" : $("#selModeType").val(),
											"Action Type" : $("#ddlActiontype").val(),
											"Controller Type" : $("#controlIDType").val(),
											"Propertional Gain" : $("#propgain").val(),
											"Set Point" : $("#setPoint").val(),
											"Max Value" : $("#maxvalue").val(),
											"Min Value" : $("#minvalue").val()
										});
										var controlIDType = $("#controlIDType").val();
										switch(controlIDType) {
											case "P":
												PIDModel.set({
													"Proportional Bias" : $("#propbaiseValue").val()
												});
												break;
											case "PI":
												PIDModel.set({
													"PID Type" : $("#ddlPIDtype").val(),
													"Proportional Bias" : $("#propbaiseValue").val(),
													"Intial Output" : $("#controllerValue").val(),
													"Integral Gain" : $("#intergalGainValue").val(),
													"Rate" : $("#rateValue").val()
												});
												break;
											case "PD":
												PIDModel.set({
													"PID Type" : $("#ddlPIDtype").val(),
													"Proportional Bias" : $("#propbaiseValue").val(),
													"Derivative Gain" : $("#derivativeGainValue").val(),
													"Rate" : $("#rateValue").val()
												});
												break;
											case "PID":
												PIDModel.set({
													"PID Type" : $("#ddlPIDtype").val(),
													"Intial Output" : $("#controllerValue").val(),
													"Integral Gain" : $("#intergalGainValue").val(),
													"Proportional Bias" : $("#propbaiseValue").val(),
													"Derivative Gain" : $("#derivativeGainValue").val(),
													"Rate" : $("#rateValue").val()
												});
												break
										}
										$("#information").html(DCSSPACE.view.blockView.prototype.informationBlock(PIDModel));
										DCSSPACE.view.blockView.prototype.updateView(PIDModel.get("block"));
										//console.dir(DCSSPACE.collection.toJSON());
										$(this).dialog("close");
										break;
									case "Manual":
										//set manual value
										PIDModel.set({
											"Output" : $("#txtmanualvalue").val(),
											"Mode" : $("#selModeType").val()
										});
										$(this).dialog("close");
										break;
									case "select":
										$(this).dialog("close");
										break;
								}
							}
						}
					}, {
						text : "Close",
						click : function() {
							$("#PIDConfig").css({
								"display" : "none"
							});
							$(this).dialog("close");
						}
					}, {
						text : "Default",
						click : function() {
							$("#manualvalue").css({
								"display" : "none"
							});
							$("#selModeType").val("Auto");
							$("#ddlActiontype").val("direct");
							$("#controlIDType").val("PID");
							$("#ddlPIDtype").val("Non-Interacting");
							$("#actiontype,#controlType,#required,#propbaise,#typeconfig,#piValue,#derivativeGain,#rate").css({
								"display" : "block"
							});
						}
					}],
				})
			},
			validate : function() {
				if($("#selModeType").val() == "Auto") {
					if($("#ddlActiontype").val() == "select") {
						$("#lblerror").css({
							"display" : "block"
						}).text("Please select Action Type");
						return false;
					} else if($("#controlIDType").val() == "select") {
						$("#lblerror").css({
							"display" : "block"
						}).text("Please select Controller Type");
						$("#controlIDType").focus();
						return false;
					} else if($("#setPoint").val() == "" || parseInt($("#setPoint").val()) < 0 || parseInt($("#setPoint").val()) > 100) {
						$("#lblerror").css({
							"display" : "block"
						}).text("Please enter set point value between 0-100");
						$("#setPoint").focus();
						return false;
					} else if($("#maxvalue").val() == "" || parseInt($("#maxvalue").val()) < 0 || parseInt($("#maxvalue").val()) > 100) {
						$("#lblerror").css({
							"display" : "block"
						}).text("Please enter Max value between 0-100");
						$("#maxvalue").focus();
						return false;
					} else if($("#minvalue").val() == "" || parseInt($("#minvalue").val()) < 0 || parseInt($("#minvalue").val()) > 100) {
						$("#lblerror").css({
							"display" : "block"
						}).text("Please enter Min value between 0-100");
						$("#minvalue").focus();
						return false;
					} else if($("#propgain").val() == "" || parseFloat($("#propgain").val()) < 0.01 || parseFloat($("#propgain").val()) > 100) {
						$("#lblerror").css({
							"display" : "block"
						}).text("Please enter Propertional Gain between 0.01-100");
						$("#propgain").focus();
						return false;
					} else if($("#controlIDType").val() == "P") {
						if($("#propbaiseValue").val() == "" || parseInt($("#propbaiseValue").val()) < 0 || parseInt($("#propbaiseValue").val()) > 100) {
							$("#lblerror").css({
								"display" : "block"
							}).text("Please enter Propertional Bias between 0-100");
							$("#propbaiseValue").focus();
							return false;
						} else {
							return true;
						}
					} else if($("#controlIDType").val() == "PI") {
						if($("#ddlPIDtype").val() == "select") {
							$("#lblerror").css({
								"display" : "block"
							}).text("Please select PID Type");
							$("#ddlPIDtype").focus();
							return false;
						} else if($("#controllerValue").val() == "" || parseInt($("#controllerValue").val()) < 40 || parseInt($("#controllerValue").val()) > 60) {
							$("#lblerror").css({
								"display" : "block"
							}).text("Please enter Initial control output between 40-60");
							$("#derivativeGainValue").focus();
							return false;
						} else if($("#intergalGainValue").val() == "" || parseFloat($("#intergalGainValue").val()) < 0.001 || parseFloat($("#intergalGainValue").val()) > 100) {
							$("#lblerror").css({
								"display" : "block"
							}).text("Please enter Integral Gain between 0.001-100");
							$("#derivativeGainValue").focus();
							return false;
						} else {
							return true;
						}
					} else if($("#controlIDType").val() == "PD") {
						if($("#propbaiseValue").val() == "" || parseInt($("#propbaiseValue").val()) < 0 || parseInt($("#propbaiseValue").val()) > 100) {
							$("#lblerror").css({
								"display" : "block"
							}).text("Please enter Propertional Bias between 0-100");
							$("#propbaiseValue").focus();
							return false;
						} else if($("#derivativeGainValue").val() == "" || parseInt($("#derivativeGainValue").val()) < 0 || parseInt($("#derivativeGainValue").val()) > 60) {
							$("#lblerror").css({
								"display" : "block"
							}).text("Please enter Derivative Gain between 0-60");
							$("#derivativeGainValue").focus();
							return false;
						} else if($("#rateValue").val() == "" || parseInt($("#rateValue").val()) < 0 || parseInt($("#rateValue").val()) > 5) {
							$("#lblerror").css({
								"display" : "block"
							}).text("Please enter Integral Gain between 0-5");
							$("#rateValue").focus();
							return false;
						} else if($("#ddlPIDtype").val() == "select") {
							$("#lblerror").css({
								"display" : "block"
							}).text("Please select PID Type");
							$("#ddlPIDtype").focus();
							return false;
						} else {
							return true;
						}
					} else if($("#controlIDType").val() == "PID") {
						if($("#ddlPIDtype").val() == "select") {
							$("#lblerror").css({
								"display" : "block"
							}).text("Please select PID Type");
							$("#ddlPIDtype").focus();
							return false;
						} else if($("#propbaiseValue").val() == "" || parseInt($("#propbaiseValue").val()) < 0 || parseInt($("#propbaiseValue").val()) > 100) {
							$("#lblerror").css({
								"display" : "block"
							}).text("Please enter Propertional Bias between 0-100");
							$("#propbaiseValue").focus();
							return false;
						} else if($("#derivativeGainValue").val() == "" || parseInt($("#derivativeGainValue").val()) < 0 || parseInt($("#derivativeGainValue").val()) > 60) {
							$("#lblerror").css({
								"display" : "block"
							}).text("Please enter Derivative Gain between 0-60");
							$("#derivativeGainValue").focus();
							return false;
						} else if($("#controllerValue").val() == "" || parseInt($("#controllerValue").val()) < 40 || parseInt($("#controllerValue").val()) > 60) {
							$("#lblerror").css({
								"display" : "block"
							}).text("Please enter Initial control output between 40-60");
							$("#derivativeGainValue").focus();
							return false;
						} else if($("#intergalGainValue").val() == "" || parseFloat($("#intergalGainValue").val()) < 0.001 || parseFloat($("#intergalGainValue").val()) > 100) {
							$("#lblerror").css({
								"display" : "block"
							}).text("Please enter Integral Gain between 0.001-100");
							$("#derivativeGainValue").focus();
							return false;
						} else if($("#rateValue").val() == "" || parseInt($("#rateValue").val()) < 0 || parseInt($("#rateValue").val()) > 5) {
							$("#lblerror").css({
								"display" : "block"
							}).text("Please enter Integral Gain between 0-5");
							$("#rateValue").focus();
							return false;
						} else {
							return true;
						}
					}
				} else {
					return true;
				}
			},
			LabelChangeConfig : function(objname) {
				if($("#btnRunmode").val() == "OffMode") {
					var Model = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(objname);
					var oThis = Model.get("block");
					$("#txtlbl").val(Model.get("label"));
					Model.get("description") != "" ? $("#lblFBDesc").val(Model.get("description")) : $("#lblFBDesc").val('');
					$("#labeldiv").css({
						"display" : "block"
					}).dialog({
						title : 'Configuration',
						height : 210,
						width : 300,
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
								Model.set({
									"label" : oThis.getLabel(),
									"description" : $("#lblFBDesc").val()
								});
								oThis.showToolTip($("#lblFBDesc").val());
								DCSSPACE.view.blockView.prototype.updateView(oThis);
								DCSSPACE.view.blockView.prototype.informationBlock(Model);
								//console.log(DCSSPACE.collection.toJSON());
								$(this).dialog("close");
							}
						}, {
							text : "Close",
							click : function() {
								$("#labeldiv").css({
									"display" : "none"
								});
								$(this).dialog("close");
							}
						}],
					});
				}
			},
			SettingInputvalues : function(objname) {
				var mod = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(objname);
				var oThis = mod.get("block");
				$("#txtvalue").val('');
				$("#EditDiv").css({
					"display" : "none"
				}).dialog({
					title : "Input Box",
					height : 136,
					width : 250,
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
							DCSSPACE.view.blockView.prototype.setConfigureCall($("#txtvalue").val(),mod,oThis);
							$(this).dialog("close");
						}
					}, {
						text : "Cancel",
						click : function() {
							$("#Functionalblocktag").css({
								"display" : "none"
							});
							$(this).dialog("close");
						}
					}],
				});
			},
			 setConfigureCall : function(configValue,mod,oThis){

				var mode=$('#mode-selected').val();
				var ajaxUrl,ajxFlag=false;
				switch(parseInt(mode)){
				case 1:
					ajaxUrl='../../setConfigure.do';
					ajxFlag=true;
					break;
					
				case 2:
					ajaxUrl='../../setConfigureMM.do';
					ajxFlag=true;
					break;
				case 3:
					
					break;
					
				}
				
				if(configValue === "" || isNaN(configValue)) {
					alert("invalid input");
					$("#txtvalue").val('');
					$("#txtvalue").focus();
					return false;
				} else if(configValue != null) {
					var input = parseInt(configValue);
					// logic for setting Input & output label of connection
					for(var i = 0; i < oThis.outputPort.connection.length; i++) {
						if(oThis == oThis.outputPort.connection[i].parent) {
							oThis.outputPort.connection[i].getLabel(true).setText(configValue);
						} else {
							alert("false");
						}
					}

					
					mod.set({
						"Input" : configValue
					});
					mod.set({
						"Output" : configValue
					});
					
					if(ajxFlag==true){
					
					var jsonObj = {
							"area" : tab_id,
							"label"  : mod.get("label"),
							"type" : oThis.getnodeName(),
							"attr" :{
							"outputValue" :  mod.get("Input"),
							}
							
					};
					
					$.ajax({
						url : ajaxUrl,
						data : JSON.stringify(jsonObj),
						type : "POST",
						dataType : 'json',
						async : false,
						contentType : 'application/json',
						success : function() {
							alert("Thanks!");
						}
					});
					}
					else{
						
						$("#information").html(DCSSPACE.view.blockView.prototype.informationBlock(mod));
						DCSSPACE.view.blockView.prototype.blocksetContent(mod);
					}
					
					
					
				
					//console.log(DCSSPACE.collection.toJSON());
				} else {
					alert("Invalid Input");
				}
				
			
			}
			
			
		});
		var pageview = Backbone.View.extend({
			el : $("#maincanvasdiv"),
			initialize : function() {
				//console.log("Page View");
				this.TabsCreationAndSelection();
				// create tab and bind select and close tab events
				this.tabDisabledMenu();
				// call tab "disalbe" menu
				this.initializeWorkspace();
				// initialize workspace at first time
				this.bindDOMElementEvent();
				// register all events
			},
			TabsCreationAndSelection : function() {
				var tab_counter = 1, WorkSpace;
				var $tabs = $("#tabs").tabs({
					tabTemplate : "<li id='area" + tab_counter + "' class='litag'><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close'>Remove Tab</span></li>",
					add : function(event, ui) {
						ui.panel.style.height = "100%";
						tab_id = ui.panel.id
						//DCSSPACE.view.pageview.prototype.tabDisabledMenu(ui.tab.parentElement.id);
					},
					select : function(event, ui) {
						tab_id = ui.panel.id;
						WorkSpace = DCSSPACE.collection.get(tab_id).get("workflow");
						tab_id = WorkSpace.html.id;
						DCSSPACE.view.view.prototype.el = $("#" + tab_id);
						DCSSPACE.workflow = DCSSPACE.collection.get(tab_id).get("workflow");
						//DCSSPACE.view.pageview.prototype.tabDisabledMenu(ui.tab.parentElement.id);
					}
				});
				// addTab button: just opens the dialog
				$("#add_tab").button().click(function() {
					if($("#btnRunmode").val() == "OffMode") {
						var tab_title = "Area " + tab_counter;
						$tabs.tabs("add", "#Area-" + tab_counter, tab_title);
						WorkSpace = new draw2d.workflow(tab_id);
						DCSSPACE.collection.add(new DCSSPACE.model.AreaModel({
							id : WorkSpace.html.id,
							workflow : WorkSpace,
							isEnabled : WorkSpace.enabled
						}));
						view = new DCSSPACE.view.view();
						tab_counter++;
					}

				});
				// close icon: removing the tab on click
				$("#tabs span.ui-icon-close").live("click", function() {
					if($("#btnRunmode").val() == "OffMode") {
						var index = $("li", $tabs).index($(this).parent());
						$tabs.tabs("remove", index);
					}
				});
			},
			tabDisabledMenu : function() {
				var contextMenu = $("#jqxMenu").jqxMenu({
					width : '120px',
					height : '80px',
					autoOpenPopup : false,
					mode : 'popup'
				});
				$("#jqxMenu").bind('itemclick', function(event) {
					var item = $(event.args).text();
					switch (item) {
						case "Disable tab":
							DCSSPACE.collection.get(tab_id).get("workflow").enabled = false;
							DCSSPACE.collection.get(tab_id).set({
								"isEnabled" : DCSSPACE.collection.get(tab_id).get("workflow").enabled
							});
							$("#" + DCSSPACE.collection.get(tab_id).get("workflow").html.id).attr({
								"disabled" : true
							});
							$("#" + DCSSPACE.collection.get(tab_id).get("workflow").html.id).fadeTo('slow', 0.3);
							break;
						case "Enable tab" :
							DCSSPACE.collection.get(tab_id).get("workflow").enabled = true;
							DCSSPACE.collection.get(tab_id).set({
								"isEnabled" : DCSSPACE.collection.get(tab_id).get("workflow").enabled
							});
							$("#" + DCSSPACE.collection.get(tab_id).get("workflow").html.id).removeAttr('disabled');
							$("#" + DCSSPACE.collection.get(tab_id).get("workflow").html.id).fadeTo('slow', 1);
							break;
					}

				});
				// open the context menu when the user presses the mouse right button on tab.
				$("li").live('mousedown', function(event) {
					if($("#btnRunmode").val() == "OffMode") {
						var rightClick = DCSSPACE.view.pageview.prototype.isRightClick(event);
						if(rightClick) {
							var scrollTop = $(window).scrollTop();
							var scrollLeft = $(window).scrollLeft();
							if(DCSSPACE.collection.get(tab_id).get("isEnabled") == true) {
								$("#enablemenu").css({
									"display" : "none"
								});
								$("#disablemenu").css({
									"display" : "block"
								});
							} else {
								$("#enablemenu").css({
									"display" : "block"
								});
								$("#disablemenu").css({
									"display" : "none"
								});
							}
							contextMenu.jqxMenu('open', parseInt(event.clientX) + 5 + scrollLeft, parseInt(event.clientY) + 5 + scrollTop);
							return false;
						}
					}
				});
			},
			isRightClick : function(event) {
				var rightclick;
				if(!event)
					var event = window.event;
				if(event.which)
					rightclick = (event.which == 3);
				else if(event.button)
					rightclick = (event.button == 2);
				return rightclick;
			},
			initializeWorkspace : function() {
				var WorkSpace = new draw2d.workflow("Area-0");
				tab_id = WorkSpace.html.id;
				DCSSPACE.collection = new DCSSPACE.Collection.DCSCollection();
				DCSSPACE.collection.add(new DCSSPACE.model.AreaModel({
					id : WorkSpace.html.id,
					workflow : WorkSpace,
					isEnabled : WorkSpace.enabled
				}));
				//DCSSPACE.view.pageview.prototype.tabDisabledMenu("area0");
				DCSSPACE.workflow = DCSSPACE.collection.get(tab_id).get("workflow");
				view = new DCSSPACE.view.view();
			},
			bindDOMElementEvent : function() {
				var dwrsetInterval;
				$("#ddlPIDtype").change(function() {
					$("#lblerror").css({
						"display" : "none"
					});
				});
				//Configure CPT Stmt change event
				$("#ddlStatement").live("change", function() {
					switch($("#ddlStatement").val()) {
						case "if":
							$("#statementview").html("if ( <label id='lblcondition'>condition</label> ) {<br /><br /> <label id='lblExpression1'>Expression1;</label> <br /><br /> }")
							$("#txtCondition").val('');
							$("#txtCondition").focus();
							$("#txrExperssion1").val('');
							$("#txrExperssion2").css({
								"display" : "none"
							});
							$("#lblexperssion2").css({
								"display" : "none"
							});
							break;
						case "if-else":
							$("#statementview").html("if ( <label id='lblcondition'>condition</label> )  { <br /><br /> <label id='lblExpression1'>Expression1;</label> <br /><br /> } else { <br /><br /> <label id='lblExpression2'>Expression2;</label> <br /><br /> }")
							$("#txtCondition").val('');
							$("#txtCondition").focus();
							$("#txrExperssion1").val('');
							$("#txrExperssion2").css({
								"display" : "block"
							});
							$("#lblexperssion2").css({
								"display" : "block"
							});
							$("#txrExperssion2").val('');
							break;
						case "do-while":
							$("#statementview").html("do { <br /><br /> <label id='lblExpression1'>Expression1;</label> <br /><br /> }while ( <label id='lblcondition'>condition</label> );");
							$("#txtCondition").val('');
							$("#txtCondition").focus();
							$("#txrExperssion1").val('');
							$("#txrExperssion2").css({
								"display" : "none"
							});
							$("#lblexperssion2").css({
								"display" : "none"
							});
							break;
						case "while":
							$("#statementview").html("while ( <label id='lblcondition'>condition</label> ){ <br /><br /> <label id='lblExpression1'>Expression1;</label> <br /><br /> }");
							$("#txtCondition").val('');
							$("#txtCondition").focus();
							$("#txrExperssion1").val('');
							$("#txrExperssion2").css({
								"display" : "none"
							});
							$("#lblexperssion2").css({
								"display" : "none"
							});
							break;
					}
				});
				$("#txtCondition").bind("keyup", function() {$("#txtCondition").val() != '' ? $("#lblcondition").html($("#txtCondition").val()) : $("#lblcondition").html('condition');
				});
				$("#txrExperssion1").bind("keyup", function() {$("#txrExperssion1").val() != '' ? $("#lblExpression1").html($("#txrExperssion1").val()) : $("#lblExpression1").html("Experssion1");
				});
				$("#txrExperssion2").bind("keyup", function() {
					if($("#txrExperssion1").val() != '') {$("#txrExperssion2").val() != '' ? $("#lblExpression2").html($("#txrExperssion2").val()) : $("#lblExpression1").html("Experssion2");
					} else {
						alert("Please enter Experssion1");
					}
				});
				// Allow only numeric value disable character on Edit menu textbox
				$(".eventoninput").live("keypress", function(evt) {
					$("#lblerror").css({
						"display" : "none"
					});
					var charCode = (evt.which) ? evt.which : evt.keyCode
					if(charCode > 31 && (charCode != 46 || $(this).val().indexOf('.') != -1) && (charCode < 48 || charCode > 57))
						return false;
					return true;
				});
				// DO not allow space
				$(".nospace").live("keypress", function(evt) {
					$("#lblerror").css({
						"display" : "none"
					});
					$("#lbl").text('');
					var charCode = (evt.which) ? evt.which : evt.keyCode;
					if(charCode == 32)
						return false;
					return true;
				});
				//Run mode event
				$("#btnRunmode").bind("click", function() {
					var mode=3;//$('#mode-selected').val();
					var ajaxUrl,ajxFlag=false;
					switch(parseInt(mode)){
					case 1:
						ajaxUrl='../../run.do';
						ajxFlag=true;
						break;
						
					case 2:
						ajxFlag=true;
						ajaxUrl='../../runMM.do';
						break;
					case 3:
						//call vlab stop method
						scancyclethread = setInterval(function() {
							DCSSPACE.scanCycle.ScanInstructionTable();
						}, 1000);
						break;
					}
					$("#btnRunmode").val('RunMode');
					$('#mode-selected').attr({"disabled" : true});
					$("#sidediv").fadeTo('slow', 0.3);
					$("#btnClear,#btnCompile,#btnClear,#btnRunmode").attr({
						"disabled" : true
					});
					$("#btnStop,#btnDownload").attr({
						"disabled" : false
					});
					for(var i = 0; i < DCSSPACE.collection.length; i++) {
						var ws = DCSSPACE.collection.at(i).get("workflow");
						ws.setBackgroundImage("/DCSFrontend/DCSEditor/assert/images/workspaceBackground.jpg", true);
						for(var k = 1; k < ws.figures.size; k++) {
							if(ws.figures.data[k].type == "draw2d.FlowMenu")
								ws.figures.data[k].html.style.display = "none";
						}
					}
					if(ajxFlag==true){
					
					$.ajax({
						url : ajaxUrl,
						type : "POST",
						success : function() {
							alert("Thanks!");
						}
				});
					}
					
				});
				//Stop mode event
				$("#btnStop").bind("click", function() {
					var mode=3;//$('#mode-selected').val();
					var ajaxUrl,ajxFlag=false;
					switch(parseInt(mode)){
					case 1:
						ajaxUrl='../../stop.do';
						ajxFlag=true;
						clearInterval(dwrsetInterval);
						break;
						
					case 2:
						ajxFlag=true;
						clearInterval(dwrsetInterval);
						ajaxUrl='../../stopMM.do';
						break;
					case 3:
						//call vlab stop method
						DCSSPACE.scanCycle.StopScanCycle();
						// stop scan cycle
						break;
					}
					$("#btnRunmode").val('OffMode');
					$('#mode-selected').attr({"disabled" : false});
					$("#sidediv").fadeTo('slow', 1);
					$("#btnClear,#btnCompile").attr({
						"disabled" : false
					});
					$("#btnRunmode,#btnDownload,#btnStop").attr({
						"disabled" : true
					});
					$("#AI").attr({
						"disabled" : false // enable panel div in off mode
					});
					
					// logic to clear or resetset ("?") input label value at stop button
					for(var i = 0; i < DCSSPACE.collection.length; i++) {
						var functionBlockCollection = DCSSPACE.collection.at(i).get("functionBlockCollection").models
						$.each(functionBlockCollection, function(p) {
							var id = functionBlockCollection[p].attributes.blockid.split("-")[0];
							if(id == "OND" || id == "OFFD" || id == "RTO" || id == "UPCTR" || id == "DWCTR") {
								functionBlockCollection[p].set({
									"Output" : 0,
									"Input" : 0,
									"ACC" : 0, 
								});
							}else if(id == "CMP"){
								functionBlockCollection[p].set({
									"High":"",
									"Low":"",
									"Actual":"",
									"LT":"",
									"GT":"",
									"NEQL":"",
									"EQL":"",
								"inrange":""
								});
							}
							
							else {
								functionBlockCollection[p].set({
									"Output" :0,
									"Input" : 0,
								});
							}
							DCSSPACE.view.blockView.prototype.blocksetContent(functionBlockCollection[p]);
						});
						var ws = DCSSPACE.collection.at(i).get("workflow");
						ws.setBackgroundImage("/DCS_Draw2d/assert/images/workspaceBackground.jpg", false);
						for(var k = 0; k < ws.figures.size; k++) {
							if(ws.figures.data[k].type == "draw2d.Node" && ws.figures.data[k].outputPort != undefined && ws.figures.data[k].outputPort.connection != undefined){
								var p = 0;
								while(p < ws.figures.data[k].outputPort.connection.length){
									ws.figures.data[k].outputPort.connection[p].getLabel(true).setText("?");
									p++;
								}
								p=0;									
							}
							if(ws.figures.data[k].type == "draw2d.FlowMenu")
								ws.figures.data[k].html.style.display = "block";
						}
					}
					if(ajxFlag==true){
					
					$.ajax({
						url : ajaxUrl,
						type : "POST",
						success : function() {
							alert("Thanks!");
						}
					});
					}
				});
				// Clear button event
				$("#btnClear").live("click", function() {
					
					DCSSPACE.view.pageview.prototype.clearWorkspace();
				});
				//Compile button event
				$("#btnCompile").live("click", function() {
				var flag;	
				var mode=3//$('#mode-selected').val();
					var ajaxUrl,ajxFlag=false;
					switch(parseInt(mode)){
					case 1:
						ajaxUrl='../../compile.do';
						ajxFlag=true;
						break;
						
					case 2:
						ajaxUrl='../../compileMM.do';
						ajxFlag=true;
						break;
					case 3:
						//call vlab stop method
						break;
						
					}
					var models = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").models;
					if(models.length > 0) {
						for(var i = 0; i < models.length; i++) {
							var id = models[i].get("blockid");
							if(id == "AI" || id == "DI") {
								var targetArray = models[i].get("target");
								if(targetArray == null || targetArray.length == 0) {
									flag = false;
									$("#alertbox").html("Please first fix all connection").dialog({
										title : "warning",
										height : 136,
										width : 250,
										draggable : false,
										modal : true,
										resizable : false,
										buttons : [{
											text : "Ok",
											click : function() {
												$(this).dialog("close");
												return false;
											}
										}]
									});
								} else {
									flag = true;
								}

							} else if(id == "AO" || id == "DO") {
								var sourceArray = models[i].get("source");
								if(sourceArray == null || sourceArray.length == 0) {
									flag = false;
									$("#alertbox").css({"display" : "block"}).html("Please first fix all connection").dialog({
										title : "warning",
										title : "Input Box",
										height : 136,
										width : 250,
										draggable : false,
										modal : true,
										resizable : false,
										buttons : [{
											text : "Ok",
											click : function() {
												$(this).dialog("close");
												return false;
											}
										}]
									});
								} else {
									flag = true;
								}
							}
						}
						if(flag) {
							DCSSPACE.saveFigure = DCSSPACE.JSONWriter();
							//console.log(JSON.stringify(DCSSPACE.saveFigure));
								if(ajxFlag==true){
							$.ajax({

								url : ajaxUrl,
								data : JSON.stringify(DCSSPACE.saveFigure),
								type : "POST",
								dataType : 'json',
								async : false,
								contentType : 'application/json',
								success : function() {
									alert("Thanks!");
								}
										
										});}
								else{
									
									//console.log(DCSSPACE.saveFigure);
										DCSSPACE.ParseJSON(DCSSPACE.saveFigure); //vlab
								}
							$("#btnRunmode").attr({
								"disabled" : false
							});
						
						}
					} else {
						//alert("Workspace is empty");
						$("#alertbox").css({"display" : "block" }).html("Workspace is empty").dialog({
							title : "Warning",
							modal : true,
							resizable : false,
							height : 125,
							width : 250,
							draggable : false,
							buttons: [{
								text : "Ok",
								click : function(){
									$(this).dialog("close");
								}
							}]
						});
					}
				});
				//Configure dropdown change event
				$("#ddltagname").live("change", function() {$("#ddltagname").val() == "select" ? $("#txtMappingAddress").val('') : $("#txtMappingAddress").val($("#ddltagname").val());
					$("#txtlabel").val('');
				});
				$("#btnDownload").live("click", function() {
					dwrScript.load(); 	
					//console.log("loaded");
					dwrsetInterval = setInterval('dwrScript.startPolling()',4000);
			});
		//}
			$('#mode-selected').live("change", function(){
				if($('#mode-selected').val() == 1){
					$("#LIM, #CPT, #CMP, #DC, #RTO").css({"display" : "block"});
					$("#btnDownload").css({"display" : "block"});
				}else if($('#mode-selected').val() == 2){
					$("#LIM, #CPT, #CMP, #DC, #RTO").css({"display" : "block"});
					$("#btnDownload").css({"display" : "block"});
					
				}else if($('#mode-selected').val() == 3){
					$("#LIM, #CPT, #CMP, #DC, #RTO").css({"display" : "none"});
					$("#btnDownload").css({"display" : "none"});
				}
				
				
				
				
//					DCSSPACE.view.pageview.prototype.clearWorkspace();
				
			});
			},
			clearWorkspace : function(){

				//var flag = confirm("Do you really want to clear Workspace?");
				$("#alertbox").css({"display" : "block"}).html("Do you really want to clear Workspace?").dialog({
					title : "Confirmation",
					width : 290,
					height : 125,
					modal : true,
					draggable : false,
					resizable : false,
					buttons:[{
						text :"Yes",
						click : function(){
							DCSSPACE.collection.get(tab_id).get("workflow").clear();
							var clearCollection = DCSSPACE.collection.get(tab_id).get("functionBlockCollection");
							for(var i = 0; i < clearCollection.length; ) {
								clearCollection.remove(clearCollection.models[i]);
							}
							$("#information").html("");
							//console.log(DCSSPACE.collection.toJSON());
							$(this).dialog("close");
						}
					},{
						text :"No",
						click : function(){
							$(this).dialog("close");
						}
					}]
				});
			
			}
		
			
			
		});
		
		return {
			pageview : pageview,
			view : view,
			blockView : blockView,
			globalPID : globalPID
		}
	}();
//});
