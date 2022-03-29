/**
 * Author : Harshal Chaudhari
 * 	
 * Nov 1-2012	
 */

/*Todo:
 *     Create draw2d.outputport() on draw2d.Node() object to connect to node objects
 * */

//define(['nodeConnection'], function() {
	draw2d.MyOutputPort = function() {
		//constructor to call output port
		draw2d.OutputPort.call(this);
		this.connection = [];
		// Array to store connection object
		this.target = [];
		// Array to store target labels
		this.source = [];
		// Array to store source labels
	};
	draw2d.MyOutputPort.prototype = new draw2d.OutputPort();
	//variable of draw2d.MyOutputPort class *unused*
	draw2d.MyOutputPort.prototype.type = "MyOutputPort";

	// Output port drag and drop function //
	draw2d.MyOutputPort.prototype.onDrop = function(port) {
		if($("#btnRunmode").val() == "OffMode") {
			if(this.getMaxFanOut() <= this.getFanOut()) {
				return;
			}
			var cmdcon = new draw2d.CommandConnect(this.parentNode.workflow, this, port);
			if(cmdcon.source.name.split("-")[0] != cmdcon.target.name.split("-")[0]) {
				// if same block source port not connect to same  block	// Self looping
				if(this.parentNode.id == port.parentNode.id) {
					//if(this.parentNode.getnodeName() === "PID") {
						//cmdcon.setConnection(new draw2d.nodeConnection(this, cmdcon.target));
						//setting connection object which is in draw2d.nodeConnetion
						//this.parentNode.workflow.getCommandStack().execute(cmdcon);
					//}
				} else {/* check for Node object connection constraint */
					var targetNode = cmdcon.target.parentNode.getnodeName();
					var sourceNode = cmdcon.source.parentNode.getnodeName();
					var isValid = true;
					switch(sourceNode) {
						case "AI"  :
						case "PID" :
						case "ADD" :
						case "SUB" :
						case "MUL" :
						case "DIV":
						case "CPT":
							switch(targetNode) {
								case "DI":
								case "DO":
								case "AND" :
								case "OR" :
								case "NOT":
								case "OND":
								case "OFFD" :
								case "RTO":
								case "UPCTR" :
								case "DWCTR":
								case "DC":
									isValid = false;
									$("#alertbox").css({"display" : "block"}).html("Connection not allowed").dialog({
										title : "Warning",
										width : 200,
										height : 120,
										modal : true,
										draggable : false,
										resizable : false,
										buttons : [{
											text : "Ok",
											click: function(){
												isValid = false;
												$(this).dialog("close");
											}
										}]	
									});
								}
							break;
						case "DI"  :
						case "RTO"  :
						case "OND" :
						case "OFFD" :
						case "UPCTR" :
						case "DWCTR" :
						case "CMP" :
						case "AND" :
						case "OR" :
						case "NOT" :
						case "DC" :
						case "LIM" :
							switch(targetNode) {
								case "AI":
								case "AO":
								case "ADD" :
								case "SUB" :
								case "MUL":
								case "DIV":
								case "PID" :
								case "CPT":
								case "CMP" :
								case "LIM" :
									isValid = false;
									$("#alertbox").css({"display" : "block"}).html("Connection not allowed").dialog({
										title : "Warning",
										width : 200,
										height : 120,
										modal : true,
										draggable : false,
										resizable : false,
										buttons : [{
											text : "Ok",
											click: function(){
												isValid = false;
												$(this).dialog("close");
											}
										}]	
									});
							};
							break;
						case "AO" :
						switch(targetNode) {
								case "AO":
								case "DI":
								case "DO":
								case "AND" :
								case "OR" :
								case "NOT":
								case "OND":
								case "OFFD" :
								case "RTO":
								case "UPCTR" :
								case "DWCTR":
								case "DC":
									isValid = false;
									$("#alertbox").css({"display" : "block"}).html("Connection not allowed").dialog({
										title : "Warning",
										width : 200,
										height : 120,
										modal : true,
										draggable : false,
										resizable : false,
										buttons : [{
											text : "Ok",
											click: function(){
												isValid = false;
												$(this).dialog("close");
											}
										}]	
									});
							};
							break;
							case "DO" :
						switch(targetNode) {
								case "DO":
								case "AI":
								case "AO":
								case "ADD" :
								case "SUB" :
								case "MUL":
								case "DIV":
								case "PID" :
								case "CPT":
								case "CMP" :
								case "LIM" :
									isValid = false;
									$("#alertbox").css({"display" : "block"}).html("Connection not allowed").dialog({
										title : "Warning",
										width : 200,
										height : 120,
										modal : true,
										draggable : false,
										resizable : false,
										buttons : [{
											text : "Ok",
											click: function(){
												isValid = false;
												$(this).dialog("close");
											}
										}]	
									});							};
							break;

					}
					if(isValid) {
						var src = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(this.parentNode.getId());
						// Get source model from collection
						var tar = DCSSPACE.collection.get(tab_id).get("functionBlockCollection").get(cmdcon.target.parentNode.getId());
						//if(src.get("label") != "" && tar.get("label") != "") {
							// Get target model from collection
							var tarsource = tar.get('source');
							var srctarget = src.get("target");
							//pid can have only one source
							var isTarSource = (tarsource == null || tarsource.length == 0) ? true : false;
							if(targetNode == "PID" && isTarSource)
								this.checkconnection(cmdcon, tarsource, srctarget, src, tar);
							else {
								if(!isTarSource) {// execute if tarsource array is not null and size is greator thsn 0
									var temp = (sourceNode == "CMP") ? // check if same element is already connected to target element
										tarsource.indexOf(this.parentNode.getLabel() + "-" + cmdcon.source.name) : 
									(targetNode == "CMP" || targetNode == "LIM") ? tarsource.indexOf(this.parentNode.getLabel() + "-" + cmdcon.target.name) :
									(targetNode == "ADD" || targetNode == "SUB" || targetNode == "MUL" || targetNode == "DIV") ?
										-1 : tarsource.indexOf(this.parentNode.getLabel());
									if(temp == -1) { // if same element is not exist in tarsource array
										if((targetNode === "AND" || targetNode === "OR" || targetNode === "ADD" || targetNode === "SUB" || targetNode === "MUL" || targetNode === "DIV") && cmdcon.target.getConnections().size < 1) {
											this.checkconnection(cmdcon, tarsource, srctarget, src, tar);// set connection here
											cmdcon.target.parentNode.addPortsatRuntime(cmdcon.target.parentNode, cmdcon.target.parentNode.workflow, targetNode, cmdcon.target);
										} else if((targetNode != "NOT" || targetNode != "AO" || targetNode != "DO" ) && cmdcon.target.getConnections().size == 0 || targetNode == "CPT") {
											this.checkconnection(cmdcon, tarsource, srctarget, src, tar);
										}
									}

								} else {// execute at first time connection. When tarsource array is null & size is 0
									if((targetNode === "AND" || targetNode === "OR" || targetNode === "ADD" || targetNode === "SUB" || targetNode === "MUL" || targetNode === "DIV")) {
										this.checkconnection(cmdcon, tarsource, srctarget, src, tar);
										// set connection here
										cmdcon.target.parentNode.addPortsatRuntime(cmdcon.target.parentNode, cmdcon.target.parentNode.workflow, targetNode, cmdcon.target);
									} else
										this.checkconnection(cmdcon, tarsource, srctarget, src, tar);
								}
							}
						//} else {
						//	alert("Please configure " + this.parentNode.getheader() + " & " + cmdcon.target.parentNode.getheader() + " blocks first");
							//return false;
						//}
					}
				}
			}
		}
	};
	/*
	 Function to check two block do not connect more than once.
	 * */
	draw2d.MyOutputPort.prototype.checkconnection = function(cmdcon, targetNodeSourceArray, sourceNodeTargetArray, sourceModel, targetModel) {
		var index, indx;
		var con = new draw2d.nodeConnection(this, cmdcon.target);
		this.connection.push(con);
		cmdcon.setConnection(con);
		this.parentNode.workflow.getCommandStack().execute(cmdcon);
		var targetNode = cmdcon.target.parentNode.getnodeName();
		var sourceNode = cmdcon.source.parentNode.getnodeName();
		this.target = sourceNodeTargetArray != null ? sourceNodeTargetArray : []; // set this.target to sourceNodeTargetArray
		this.source = targetNodeSourceArray != null ? targetNodeSourceArray : []; 
		//case if sourceNode is CMP
		if(sourceNode == "CMP"){
			index = this.target.indexOf(cmdcon.target.parentNode.getLabel()+ "-" + cmdcon.source.name);
			indx = this.source.indexOf(cmdcon.source.parentNode.getLabel()+ "-" + cmdcon.source.name);
			if(index == -1){
				this.target.push(cmdcon.target.parentNode.getLabel()+ "-" + cmdcon.source.name);	
			}
			if(indx == -1){
				this.source.push(cmdcon.source.parentNode.getLabel()+ "-" + cmdcon.source.name);	
			}
		}else if(targetNode == "CMP" || targetNode == "LIM"){ //case if targetNode is CMP
			index = this.target.indexOf(cmdcon.target.parentNode.getLabel()+ "-" + cmdcon.target.name); //check if same label is already present in target ayyay
			indx = this.source.indexOf(cmdcon.source.parentNode.getLabel()+ "-" + cmdcon.target.name); // check if same label is already present in source array
			if(index == -1){
				this.target.push(cmdcon.target.parentNode.getLabel()+ "-" + cmdcon.target.name);
			}
			if(indx == -1){
				this.source.push(cmdcon.source.parentNode.getLabel()+ "-" + cmdcon.target.name);
			}
		}else{ 
		if(targetNode == "ADD" || targetNode == "SUB" || targetNode == "MUL" || targetNode == "DIV") {
				this.target.push(cmdcon.target.parentNode.getLabel());
				this.source.push(cmdcon.source.parentNode.getLabel());
			} else {
			index = this.target.indexOf(cmdcon.target.parentNode.getLabel());
			indx = this.source.indexOf(cmdcon.source.parentNode.getLabel());
			if(index == -1){
				this.target.push(cmdcon.target.parentNode.getLabel());
			}
			if(indx == -1){
				this.source.push(cmdcon.source.parentNode.getLabel());
			}
			}
	}
		
		sourceModel.set({
			"target" : this.target
		});
		// set model target attribute
		targetModel.set({
			"source" : this.source
		});
				// set modcel source attribiute
				//console.log(DCSSPACE.collection.get(tab_id).get("functionBlockCollection").toJSON());
	}
	
//});
