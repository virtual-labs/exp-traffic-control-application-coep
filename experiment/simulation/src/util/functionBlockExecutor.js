/**
 * Author : Harshal Chaudhari
 *
 * Nov 1-2012
 */

DCSSPACE.functionBlockExecutor = (function() {
	var flag = 0;
	var blockExecutor = function() {
		$.each(DCSSPACE.areaForExection, function(cnt) {
			var areaName = DCSSPACE.areaForExection[cnt].id;
			var functionBlockCollection = DCSSPACE.collection.get(areaName).get("functionBlockCollection");
			var inputTable = DCSSPACE.areaForExection[cnt].inputImageTable;
			var functionBlockTable = DCSSPACE.areaForExection[cnt].functionBlockImageTable;
			var outputTable = DCSSPACE.areaForExection[cnt].outputImageTable;
			//iterate through FunctionBlockTable and execute block
			$.each(functionBlockTable, function(i) {
				switch(functionBlockTable[i].blockType) {
					case "ADD":
						var inputs = DCSSPACE.functionBlockExecutor.getSourceValues(functionBlockTable[i].ADD, areaName, inputTable, functionBlockTable);
						var output = 0;
						for(var k = 0; k < inputs.length; k++) {
							output = !isNaN(inputs[k]) ? output + inputs[k] : "?";
						}
						functionBlockCollection.get(functionBlockTable[i].ADD.id).set({
							"Output" : output
						});
						DCSSPACE.functionBlockExecutor.updateView(functionBlockCollection, functionBlockTable[i].ADD.id);
						break;
					case "SUB":
						var output = 0;
						var inputs = DCSSPACE.functionBlockExecutor.getSourceValues(functionBlockTable[i].SUB, areaName, inputTable, functionBlockTable);
						//inputs.sort();
						for(var k = 0; k < inputs.length; k++) {
							output = !isNaN(inputs[k]) ? inputs[k] - output : "?";
						}
						functionBlockCollection.get(functionBlockTable[i].SUB.id).set({
							"Output" : output
						});
						DCSSPACE.functionBlockExecutor.updateView(functionBlockCollection, functionBlockTable[i].SUB.id);
						break;
					case "MUL":
						var output = 1;
						var inputs = DCSSPACE.functionBlockExecutor.getSourceValues(functionBlockTable[i].MUL, areaName, inputTable, functionBlockTable);
						for(var k = 0; k < inputs.length; k++) {
							output = !isNaN(inputs[k]) ? inputs[k] * output : "?";
						}
						functionBlockCollection.get(functionBlockTable[i].MUL.id).set({
							"Output" : output
						});
						DCSSPACE.functionBlockExecutor.updateView(functionBlockCollection, functionBlockTable[i].MUL.id);
						break;
					case "DIV":
						var output = 1;
						var inputs = DCSSPACE.functionBlockExecutor.getSourceValues(functionBlockTable[i].DIV, areaName, inputTable, functionBlockTable);
						//inputs.sort();
						output=!isNaN(inputs[0]) ? inputs[0] : 0;
						for(var k = 1; k < inputs.length; k++) {
							output = !isNaN(inputs[k]) ?  output/inputs[k]  : 0;
						}
						functionBlockCollection.get(functionBlockTable[i].DIV.id).set({
							"Output" : output
						});
						DCSSPACE.functionBlockExecutor.updateView(functionBlockCollection, functionBlockTable[i].DIV.id);
						break;
					case "AND":
						var ANDModel = functionBlockCollection.get(functionBlockTable[i].AND.id);
						var output = 1;
						var inputs = DCSSPACE.functionBlockExecutor.getSourceValues(functionBlockTable[i].AND, areaName, inputTable, functionBlockTable);
						inputs.sort();
						for(var k = 0; k < inputs.length; k++) {
							output = !isNaN(inputs[k]) ? output * inputs[k] : "?";
						}
						ANDModel.set({
							"Output" : output
						});
						DCSSPACE.functionBlockExecutor.updateView(functionBlockCollection, functionBlockTable[i].AND.id);
						break;
					case "OR":
						var ORModel = functionBlockCollection.get(functionBlockTable[i].OR.id);
						var output = 0;
						var inputs = DCSSPACE.functionBlockExecutor.getSourceValues(functionBlockTable[i].OR, areaName, inputTable, functionBlockTable);
						inputs.sort();
						for(var k = 0; k < inputs.length; k++) {
							output = !isNaN(inputs[k]) ? inputs.indexOf(1) != -1 ? 1 : 0 : "?";
						}
						ORModel.set({
							"Output" : output
						});
						DCSSPACE.functionBlockExecutor.updateView(functionBlockCollection, functionBlockTable[i].OR.id);
						break;
					case "NOT":
						var NOTModel = functionBlockCollection.get(functionBlockTable[i].NOT.id);
						var output = 0;
						var inputs = DCSSPACE.functionBlockExecutor.getSourceValues(functionBlockTable[i].NOT, areaName, inputTable, functionBlockTable);
						output = !isNaN(inputs[0]) ? inputs[0] == 0 ? 1 : 0 : "?";
						NOTModel.set({
							"Output" : output
						});
						DCSSPACE.functionBlockExecutor.updateView(functionBlockCollection, functionBlockTable[i].NOT.id);
						break;
					case "OND":
						var ONDModel = functionBlockCollection.get(functionBlockTable[i].OND.id);
						var output = ONDModel.get("Output") != "" ? parseInt(ONDModel.get("Output")) : 0;
						var interval = 100;
						var setTimeoutONDvariable = null;
						var acc = ONDModel.get("ACC") != "" ? parseInt(ONDModel.get("ACC")) : 0;
						var preset = parseInt(ONDModel.get("Preset"));
						var previousOutputForOND = ONDModel.get("prevInput");
						var inputs = DCSSPACE.functionBlockExecutor.getSourceValues(functionBlockTable[i].OND, areaName, inputTable, functionBlockTable);
						if(inputs[0] == 1 && previousOutputForOND == inputs[0]) {
							var autorefresh = function() {
								if(acc < preset) {
									acc = acc + interval;
									acc = acc > preset ? preset : acc;
									output = 0;
									var currentIOInput = DCSSPACE.functionBlockExecutor.getSourceValues(functionBlockTable[i].OND, areaName, inputTable, functionBlockTable);
									if(currentIOInput[0] == 0) {
										window.clearInterval(setTimeoutONDvariable);
										acc = 0;
										output = 0;
									}
								} else if(acc == preset && acc != 0) {
									window.clearInterval(setTimeoutONDvariable);
									output = 1;
								}
								ONDModel.set({
									"Output" : output,
									"ACC" : acc
								});
								DCSSPACE.functionBlockExecutor.updateView(functionBlockCollection, functionBlockTable[i].OND.id);
							}
							setTimeoutONDvariable = setInterval(autorefresh, 50);
						} else if(inputs[0] == 0){
							window.clearInterval(setTimeoutONDvariable);
							acc = 0;
							output = 0;
						}
						functionBlockCollection.get(functionBlockTable[i].OND.id).set({
								"Output" : output,
								"ACC" : acc
						});
						ONDModel.set({ "prevInput" : inputs[0] }) ;
							DCSSPACE.functionBlockExecutor.updateView(functionBlockCollection, functionBlockTable[i].OND.id);
						break;
					case "OFFD":
				
						var OFFDModel = functionBlockCollection.get(functionBlockTable[i].OFFD.id);
						var output = OFFDModel.get("Output") != "" ? parseInt(OFFDModel.get("Output")) : 0;
						var setTimeoutOFFDvariable = null;
						var interval = 100;
						var setTimeoutOFFDvariable = null;
						var preset = parseInt(OFFDModel.get("Preset"));
						var previousOutputForOFFD = OFFDModel.get("prevInput");
						var acc = OFFDModel.get("ACC") != "" ? parseInt(OFFDModel.get("ACC")) : 0;
						var inputs = DCSSPACE.functionBlockExecutor.getSourceValues(functionBlockTable[i].OFFD, areaName, inputTable, functionBlockTable);
						if(inputs[0] == 0 && previousOutputForOFFD != inputs[0]) {
							var autorefresh = function() {
								if(acc < preset) {
									acc = acc + interval;
									acc = acc > preset ? preset : acc;
									output = 1 ;
									var currentIOInput = DCSSPACE.functionBlockExecutor.getSourceValues(functionBlockTable[i].OFFD, areaName, inputTable, functionBlockTable);
									if(currentIOInput[0] == 1) {
										window.clearInterval(setTimeoutOFFDvariable);
										acc = 0;
										output = 0;
									}
								} else if(acc == preset && acc != 0) {
									window.clearInterval(setTimeoutOFFDvariable);
									output = 0;
								}
								OFFDModel.set({
									"Output" : output,
									"ACC" : acc
								});
								DCSSPACE.functionBlockExecutor.updateView(functionBlockCollection, functionBlockTable[i].OFFD.id);
							}
							setTimeoutOFFDvariable = setInterval(autorefresh, 50);
						} else if(inputs[0] == 1) {
							window.clearInterval(setTimeoutOFFDvariable);
							acc = 0;
							output = 1 ;
						}
						OFFDModel.set({
							"Output" : output,
							"ACC" : acc
						});
						OFFDModel.set({
							"prevInput" : inputs[0]
						});
						DCSSPACE.functionBlockExecutor.updateView(functionBlockCollection, functionBlockTable[i].OFFD.id);
						break;
				
					

					case "RTO":
						var RTOModel = functionBlockCollection.get(functionBlockTable[i].RTO.id);
						var output = RTOModel.get("Output") != "" ? parseInt(RTOModel.get("Output")) : 0;
						var interval = 100;
						var setTimeoutRTOvariable = null;
						var acc = RTOModel.get("ACC") != "" ? parseInt(RTOModel.get("ACC")) : 0;
						var preset = parseInt(RTOModel.get("Preset"));
						var previousOutputForRTO = RTOModel.get("prevInput");
						var inputs = DCSSPACE.functionBlockExecutor.getSourceValues(functionBlockTable[i].RTO, areaName, inputTable, functionBlockTable);
						var retainValue;
						
						if(inputs[0] == 1 && previousOutputForRTO == inputs[0] && flag==0) {
							var autorefresh = function() {
								if(acc < preset) {
									acc = acc + interval;
									acc = acc > preset ? preset : acc;
									output = 0;
									var currentIOInput = DCSSPACE.functionBlockExecutor.getSourceValues(functionBlockTable[i].RTO, areaName, inputTable, functionBlockTable);
									if(currentIOInput[0] == 0) {
										window.clearInterval(setTimeoutRTOvariable);
										//acc=0;
										acc = parseInt(RTOModel.get("ACC"));
										output = 0;
										//retainValue =acc+(preset-acc);
										//console.log(acc);
									}
								} else if(acc == preset && acc != 0) {
									//console.log("aa")
									window.clearInterval(setTimeoutRTOvariable);
									//acc=0;
									output = 1;
								}
								RTOModel.set({
									"Output" : output,
									"ACC" : acc,
									"RetainValue" : retainValue
								});
								DCSSPACE.functionBlockExecutor.updateView(functionBlockCollection, functionBlockTable[i].RTO.id);
							}
							setTimeoutRTOvariable = setInterval(autorefresh, 50);

						} else if(inputs[0] == 0 &&(acc == preset && acc != 0)) {
							window.clearInterval(setTimeoutRTOvariable);
							acc = RTOModel.get("ACC");
							//acc = 0;
							output = 1;
						}

						functionBlockCollection.get(functionBlockTable[i].RTO.id).set({
							"Output" : output,
							"ACC" : acc,

						});
						RTOModel.set({
							"prevInput" : inputs[0]
						});
						DCSSPACE.functionBlockExecutor.updateView(functionBlockCollection, functionBlockTable[i].RTO.id);
						break;

					case "UPCTR":
						var UPCTRModel = functionBlockCollection.get(functionBlockTable[i].UPCTR.id);
						var output = UPCTRModel.get("Output") != "" ? parseInt(UPCTRModel.get("Output")) : 0;
						var acc = UPCTRModel.get("ACC") != "" ? parseInt(UPCTRModel.get("ACC")) : 0;
						var previousOutputForUPCTR = UPCTRModel.get("prevInput");
						var preset = parseInt(UPCTRModel.get("Preset"));
						var inputs = DCSSPACE.functionBlockExecutor.getSourceValues(functionBlockTable[i].UPCTR, areaName, inputTable, functionBlockTable);
						if(inputs[0] == 1 && previousOutputForUPCTR != inputs[0]) {
							acc = acc + 1;
							output = acc == preset ? 1 : 0;
						}
						UPCTRModel.set({
							"Output" : output,
							"ACC" : acc
						});
						UPCTRModel.set({"prevInput" : inputs[0]});
						DCSSPACE.functionBlockExecutor.updateView(functionBlockCollection, functionBlockTable[i].UPCTR.id);
						break;
					case "DWCTR":
						var DWCTRModel = functionBlockCollection.get(functionBlockTable[i].DWCTR.id);
						var output = DWCTRModel.get("Output") == "" ? 0 : parseInt(DWCTRModel.get("Output"));
						var preset = parseInt(DWCTRModel.get("Preset"));
						var acc =  DWCTRModel.get("ACC") === "" ? preset : parseInt(DWCTRModel.get("ACC"));
						var previousOutputForDWCTR = DWCTRModel.get("prevInput");
						var inputs = DCSSPACE.functionBlockExecutor.getSourceValues(functionBlockTable[i].DWCTR, areaName, inputTable, functionBlockTable);
						if((inputs[0] == 0 || inputs[0]==1) && acc==preset){
							output= 1;
						}
						if(inputs[0] == 1 && previousOutputForDWCTR != inputs[0])
						{
							acc = acc - 1;
							output = 1 ;
						}else if(acc==0 ){
							output=0;
						}
						DWCTRModel.set({
							"Output" : output,
							"ACC" : acc
						});
						DWCTRModel.set({"prevInput" : inputs[0]});
						DCSSPACE.functionBlockExecutor.updateView(functionBlockCollection, functionBlockTable[i].DWCTR.id);
						break;
						
					case "RESET":
							var RESETModel = functionBlockCollection.get(functionBlockTable[i].RESET.id);
							var output = RESETModel.get("Output") == "" ? 0 : parseFloat(RESETModel.get("Output"));
							var accociatedCntlabel = RESETModel.get("rstcntname");
							var inputs = DCSSPACE.functionBlockExecutor.getSourceValues(functionBlockTable[i].RESET, areaName, inputTable, functionBlockTable);
							var getAssociatedCntModel = functionBlockCollection.where({
								"label" : accociatedCntlabel
							});
							var blockName = getAssociatedCntModel[0].get("blockid");
							if(inputs[0] == 1) {
														if(blockName == "UPCTR") {
															getAssociatedCntModel[0].set({
																	"ACC" : 0
																});
														} else if(blockName == "RTO") {
															    flag = 1;
															    getAssociatedCntModel[0].set({
															        "ACC" : 0 
																}); 
														}
										       getAssociatedCntModel[0].set({
										            	"Output" : 0 
										          });
									
							}else if(inputs[0] == 0 ) {
								flag =0;
							}
							
							if(inputs[0] == 1){
								if(blockName == "DWCTR") {
								flag=1;
									var presetVal = getAssociatedCntModel[0].get("Preset");
									getAssociatedCntModel[0].set({
												"ACC" : presetVal,
												"Output" : 1,
										});
									}
							}else  if(inputs[0] == 0 ) {
									flag = 0;
								}
							RESETModel.set({
								"Output" : inputs[0]
							});
							getAssociatedCntModel[0].set({
								"resetOutput" : output
							});
							DCSSPACE.functionBlockExecutor.updateView(functionBlockCollection, functionBlockTable[i].RESET.id);
							break;
					case "PID":
						console.log(DCSSPACE.view.globalPID);
						
						var PIDModel = functionBlockCollection.get(functionBlockTable[i].PID.id);
						var PIDInput = DCSSPACE.functionBlockExecutor.getSourceValues(functionBlockTable[i].PID, areaName, inputTable, functionBlockTable);
						var PIDOutput = isNaN(PIDModel.get("Output")) ? parseInt(PIDModel.get("Output")) : 0;
						var mode = PIDModel.get("Mode");
						var setPointValue = parseFloat(PIDModel.get("Set Point"));
						var maxValue = parseFloat(PIDModel.get("Max Value"));
						var minValue = parseFloat(PIDModel.get("Min Value"));
						var minValue = parseFloat(PIDModel.get("Min Value"));
						var pGain = parseFloat(PIDModel.get("Propertional Gain"));
						var controllerType = PIDModel.get("Controller Type");
						var actionType = PIDModel.get("Action Type");
						var pidType = PIDModel.get("PID Type");
						var iGain = parseFloat(PIDModel.get("Integral Gain"));
						var initialControllerOutput = parseFloat(PIDModel.get("Intial Output"));
						var scanTime = parseFloat(PIDModel.get("Rate"));
						var dGain = parseFloat(PIDModel.get("Derivative Gain"));
						var pBias = parseFloat(PIDModel.get("Proportional Bias"));
						var PreviousEp = PIDModel.get("PreviousEp");
						var pidobj = {
							PIDInput : PIDInput,
							pidType : pidType,
							actionType : actionType,
							sp : setPointValue,
							maxValue : maxValue,
							minValue : minValue,
							kp : pGain,
							ki : iGain,
							kd : dGain,
							p0 : pBias,
							initialControllerOutput : initialControllerOutput,
							scanTime : scanTime,
							block : functionBlockTable[i].PID,
							PIDModel : PIDModel,
							functionBlockCollection : functionBlockCollection,
							areaName : areaName,
							outputTable : outputTable,
							PreviousEp : PreviousEp,
							PIDModel : PIDModel
						}
						/*
						if ($.isEmptyObject(DCSSPACE.view.globalPID)){
													DCSSPACE.view.globalPID = pidobj ; 
												}*/
						
						DCSSPACE.view.globalPID = pidobj ; 
						if(!isNaN(PIDInput[0])) {
							switch(controllerType) {
								case "P":
									var pBias = parseInt(PIDModel.get("Proportional Bias"));
									var ep = parseFloat(setPointValue - PIDInput);
									//((PIDInput - setPointValue) / (maxValue - minValue)) * 100;
									//PIDOutput = ep * pGain + pBias;
									PIDOutput = actionType == "direct" ? ep * pGain + pBias : (-ep) * pGain + pBias;
									PIDModel.set({
										"Output" : PIDOutput
									});
									DCSSPACE.functionBlockExecutor.updateView(functionBlockCollection, functionBlockTable[i].PID.id);
									break;
								case "PI":
									PIDOutput = PItypeImplementation(DCSSPACE.view.globalPID);
									PIDModel.set({
										"Output" : PIDOutput
									});
									DCSSPACE.functionBlockExecutor.updateView(functionBlockCollection, functionBlockTable[i].PID.id);
									break;
								case "PD":
									PIDOutput = PDtypeImplementation(pidobj);
									PIDModel.set({
										"Output" : PIDOutput
									});

									DCSSPACE.functionBlockExecutor.updateView(functionBlockCollection, functionBlockTable[i].PID.id);
									break;
								case "PID":
									PIDOutput = PIDtypeImplementation(pidobj);
									PIDModel.set({
										"Output" : PIDOutput
									});

									DCSSPACE.functionBlockExecutor.updateView(functionBlockCollection, functionBlockTable[i].PID.id);
									break;
							}
							break;
						}
				}

			});	//functionblockTable scan completed
			//outputtable scan started
			ScanOutputBlockTable(outputTable, functionBlockCollection, areaName, inputTable, functionBlockTable);
		});
	}
	//Excution for PI type
	var PItypeImplementation = function(pidobj) {
		var pidType = pidobj.pidType;
		var actionType = pidobj.actionType;
		//var ep = ((pidobj.PIDInput - pidobj.sp) / (pidobj.maxValue - pidobj.minValue));
		var ep = pidobj.sp - pidobj.PIDInput;

		if(pidType == "non-interacting") {//parallel
			if(actionType == "direct"){
				
				//var output = (ep * pidobj.kp) + (pidobj.ki * pidobj.ki * (pidobj.PreviousEp + ep)) + pidobj.initialControllerOutput + pidobj.p0;
				var output = (ep * pidobj.kp) + (pidobj.ki * (pidobj.PreviousEp + ep))+ pidobj.initialControllerOutput + pidobj.p0;
				pidobj.initialControllerOutput = (pidobj.ki * (pidobj.PreviousEp + ep)) + pidobj.initialControllerOutput;
			
			}else{
					//var output = (-ep) * pidobj.kp - (pidobj.ki * (pidobj.PreviousEp + ep)) + pidobj.initialControllerOutput + pidobj.p0;
					var output = (-ep) * pidobj.kp - (pidobj.kp * pidobj.ki * (pidobj.PreviousEp + ep))+ pidobj.initialControllerOutput + pidobj.p0;
					pidobj.initialControllerOutput = pidobj.initialControllerOutput - (pidobj.ki * (pidobj.PreviousEp + ep));
			}
				pidobj.PIDModel.set({
							"Intial Output" : pidobj.initialControllerOutput
						});
			
			if(output < pidobj.minValue){
				output = pidobj.minValue;
			}
				
			else if(output >= pidobj.maxValue){
				output = pidobj.maxValue;
			}
			
			
			DCSSPACE.functionBlockExecutor.updateView(pidobj.functionBlockCollection, pidobj.block.id);		
								
			pidobj.PIDModel.set({"PreviousEp" : ep});
			return output.toFixed(2);
		} else {//interacting
			if(actionType == "direct"){
				var output = (ep * pidobj.kp) + (pidobj.kp * pidobj.ki * (pidobj.PreviousEp + ep)) + pidobj.initialControllerOutput + pidobj.p0;
				
				pidobj.initialControllerOutput = ((pidobj.kp * pidobj.ki * (pidobj.PreviousEp + ep)) + pidobj.initialControllerOutput);
			}else{
				var output = (-ep) * pidobj.kp - (pidobj.kp * pidobj.ki * (pidobj.PreviousEp + ep)) + pidobj.initialControllerOutput + pidobj.p0;
				pidobj.initialControllerOutput = (pidobj.initialControllerOutput - (pidobj.kp * pidobj.ki * (pidobj.PreviousEp + ep)));
			}
			pidobj.PIDModel.set({
							"Intial Output" : pidobj.initialControllerOutput
						});
			
			if(output < pidobj.minValue){
				output = pidobj.minValue;
			}else if(output >= pidobj.maxValue){
				output = pidobj.maxValue;
			}
						
			
				
			//PITypeExecuteinloop(output, ep, pidobj);
			pidobj.PIDModel.set({"PreviousEp" : ep});
			return output.toFixed(2);
		}
	};
	
	//Excution for PD typeo
	var PDtypeImplementation = function(pidobj) {
		var pidType = pidobj.pidType;
		var actionType = pidobj.actionType;
		//var ep = ((pidobj.PIDInput - pidobj.sp) / (pidobj.maxValue - pidobj.minValue));
		var ep = pidobj.sp - pidobj.PIDInput;
		pidobj.Ep = ep;
		if(pidType == "non-interacting") {//parallel
			if(actionType == "direct"){
				var output = ep * pidobj.kp + (pidobj.kd / pidobj.scanTime) * (ep - pidobj.PreviousEp) + pidobj.p0;
				
			}
				
				
			else{
				var output = (-ep) * pidobj.kp - ((pidobj.kd / pidobj.scanTime) * (ep - pidobj.PreviousEp)) + pidobj.p0;
				
			}
				
				
			//PDTypeExecuteinloop(output, ep, pidobj);
			//return output.toFixed(2);
		} else {// interacting
			if(actionType == "direct"){
				var output = ep * pidobj.kp + (pidobj.kd / pidobj.scanTime) * pidobj.kp * (ep - pidobj.PreviousEp) + pidobj.p0;
				
			}
				
				
			else{
				var output = (-ep) * pidobj.kp - ((pidobj.kd / pidobj.scanTime) * pidobj.kp * (ep - pidobj.PreviousEp)) + pidobj.p0;
				
			}
				
				
			//PDTypeExecuteinloop(output, ep, pidobj);
			
		}
		pidobj.initialControllerOutput = (output);
		if(output < pidobj.minValue){
				output = pidobj.minValue;
			}else if(output >= pidobj.maxValue){
				output = pidobj.maxValue;
			}
			pidobj.PIDModel.set({"PreviousEp" : ep});
		return output.toFixed(2);	
	};
	
	//Excution for PID type
	var PIDtypeImplementation = function(pidobj) {
		var pidType = pidobj.pidType;
		var actionType = pidobj.actionType;
		//var ep = ((pidobj.PIDInput - pidobj.sp) / (pidobj.maxValue - pidobj.minValue));
		var ep = pidobj.sp - pidobj.PIDInput;
		pidobj.Ep = ep;
		if(pidType == "non-interacting") {//parallel
			if(actionType == "direct"){
				var output = (ep * pidobj.kp) + (pidobj.ki * (pidobj.PreviousEp + ep)) + ((pidobj.kd / pidobj.scanTime) * (ep - pidobj.PreviousEp)) + pidobj.initialControllerOutput + pidobj.p0;
				pidobj.initialControllerOutput = ((pidobj.ki * (pidobj.PreviousEp + ep)) + pidobj.initialControllerOutput);
			}else{
				var output = (-ep) * pidobj.kp - (pidobj.ki * (pidobj.PreviousEp + ep)) - ((pidobj.kd / pidobj.scanTime) * (ep - pidobj.PreviousEp)) + pidobj.initialControllerOutput + pidobj.p0;
					pidobj.initialControllerOutput = (pidobj.initialControllerOutput - (pidobj.ki * (pidobj.PreviousEp + ep)));
			}
			pidobj.PIDModel.set({
							"Intial Output" : pidobj.initialControllerOutput
						});
			//PIDTypeExecuteinloop(output, ep, pidobj);
			//return output.toFixed(2);
		} else {// interacting
			if(actionType == "direct"){
				var output = (ep * pidobj.kp) + (pidobj.kp * pidobj.ki * (pidobj.PreviousEp + ep)) + ((pidobj.kd / pidobj.scanTime) * pidobj.kp * (ep - pidobj.PreviousEp)) + pidobj.initialControllerOutput + pidobj.p0;
				pidobj.initialControllerOutput = ((pidobj.kp * pidobj.ki * (pidobj.PreviousEp + ep)) + pidobj.initialControllerOutput);
			}
				
			else{
				var output = (-ep) * pidobj.kp - (pidobj.kp * pidobj.ki * (pidobj.PreviousEp + ep)) - ((pidobj.kd / pidobj.scanTime) * pidobj.kp * (ep - pidobj.PreviousEp)) + pidobj.initialControllerOutput + pidobj.p0;
				pidobj.initialControllerOutput = (pidobj.initialControllerOutput - (pidobj.kp * pidobj.ki * (pidobj.PreviousEp + ep)));
			}
				pidobj.PIDModel.set({
							"Intial Output" : pidobj.initialControllerOutput
						});
				
			//PIDTypeExecuteinloop(output, ep, pidobj);
			//return output.toFixed(2);
		}
		pidobj.PIDModel.set({"PreviousEp" : ep});
		if(output < pidobj.minValue){
				output = pidobj.minValue;
			}else if(output >= pidobj.maxValue){
				output = pidobj.maxValue;
			}
		return output.toFixed(2);	
	};
	
	var updateView = function(functionBlockCollection, id) {
		//$("#information").html(functionBlockCollection.get(id));
		DCSSPACE.view.blockView.prototype.blocksetContent(functionBlockCollection.get(id));
		var block = functionBlockCollection.get(id).get("block");
		DCSSPACE.functionBlockExecutor.setConnectionLabel(block, functionBlockCollection);
	};
	var getSourceValues = function(block, areaName, inputTable, functionBlockTable) {
		var data = [];
		var vals;
		var functionBlockCollection = DCSSPACE.collection.get(areaName).get("functionBlockCollection");
		if(block.isEnable) {
			var sourceArray = block.source;
			if(sourceArray != null) {
				if(sourceArray != null || sourceArray.length != 0) {
					for(var j = 0; j < sourceArray.length; j++) {
						//scan outputimagetable and check if target element exist
						$.each(inputTable, function(p) {
							if(inputTable[p].blockType == "AI") {
								if(inputTable[p].AI.label == sourceArray[j]) {
									vals=!isNaN(parseInt(functionBlockCollection.get(inputTable[p].AI.id).get("Output"))) ? parseInt(functionBlockCollection.get(inputTable[p].AI.id).get("Output")) : 0;
									
									data.push(vals);
								}
							} else if(inputTable[p].blockType == "DI") {
								if(inputTable[p].DI.label == sourceArray[j]) {
									vals=!isNaN(parseInt(functionBlockCollection.get(inputTable[p].DI.id).get("Output"))) ? parseInt(functionBlockCollection.get(inputTable[p].DI.id).get("Output")) : 0 ;
									
									data.push(vals);
								}
							}
						});
						//scan functionBlockimagetable and check if target element exist
						$.each(functionBlockTable, function(q) {
							switch(functionBlockTable[q].blockType) {
								case "ADD":
									if(functionBlockTable[q].ADD.label == sourceArray[j])
										data.push(parseInt(functionBlockCollection.get(functionBlockTable[q].ADD.id).get("Output")));
									break;
								case "SUB":
									if(functionBlockTable[q].SUB.label == sourceArray[j])
										data.push(parseInt(functionBlockCollection.get(functionBlockTable[q].SUB.id).get("Output")));
									break;
								case "MUL":
									if(functionBlockTable[q].MUL.label == sourceArray[j])
										data.push(parseInt(functionBlockCollection.get(functionBlockTable[q].MUL.id).get("Output")));
									break;
								case "DIV":
									if(functionBlockTable[q].DIV.label == sourceArray[j])
										data.push(parseInt(functionBlockCollection.get(functionBlockTable[q].DIV.id).get("Output")));
									break;
								case "PID":
									if(functionBlockTable[q].PID.label == sourceArray[j])
										data.push(parseInt(functionBlockCollection.get(functionBlockTable[q].PID.id).get("Output")));
									break;
								case "AND":
									if(functionBlockTable[q].AND.label == sourceArray[j])
										data.push(parseInt(functionBlockCollection.get(functionBlockTable[q].AND.id).get("Output")));
									break;
								case "OR":
									if(functionBlockTable[q].OR.label == sourceArray[j])
										data.push(parseInt(functionBlockCollection.get(functionBlockTable[q].OR.id).get("Output")));
									break;
								case "NOT":
									if(functionBlockTable[q].NOT.label == sourceArray[j])
										data.push(parseInt(functionBlockCollection.get(functionBlockTable[q].NOT.id).get("Output")));
									break;
								case "OND":
									if(functionBlockTable[q].OND.label == sourceArray[j])
										data.push(parseInt(functionBlockCollection.get(functionBlockTable[q].OND.id).get("Output")));
									break;
								case "OFFD":
									if(functionBlockTable[q].OFFD.label == sourceArray[j])
										data.push(parseInt(functionBlockCollection.get(functionBlockTable[q].OFFD.id).get("Output")));
									break;

								case "RTO":
									if(functionBlockTable[q].RTO.label == sourceArray[j])
										data.push(parseInt(functionBlockCollection.get(functionBlockTable[q].RTO.id).get("Output")));
									break;

								case "UPCTR":
									if(functionBlockTable[q].UPCTR.label == sourceArray[j])
										data.push(parseInt(functionBlockCollection.get(functionBlockTable[q].UPCTR.id).get("Output")));
									break;
								case "DWCTR":
									if(functionBlockTable[q].DWCTR.label == sourceArray[j])
										data.push(parseInt(functionBlockCollection.get(functionBlockTable[q].DWCTR.id).get("Output")));
									break;
							}
						});
					}
				}
			}

		}
		return data;
	};
	
	var setConnectionLabel = function(block, functionBlockCollection) {
		if(block.outputPort != null){
		if(block.outputPort.connection != null || addblock.outputPort.connection != undefined) {
			for(var z = 0; z < block.outputPort.connection.length; z++) {
				block.outputPort.connection[z].getLabel(true).setText(functionBlockCollection.get(block.id).get("Output"));
			}
		}
		}
	};
	
	var ScanOutputBlockTable = function(outputTable, functionBlockCollection,areaName, inputTable, functionBlockTable){
		$.each(outputTable, function(i) {
			switch(outputTable[i].blockType) {
			case "AO":
				var inputs = DCSSPACE.functionBlockExecutor.getSourceValues(outputTable[i].AO, areaName, inputTable, functionBlockTable);
				var output = 0;
				for(var k = 0; k < inputs.length; k++) {
					output = !isNaN(inputs[k]) ? output + inputs[k] : "?";
				}
				functionBlockCollection.get(outputTable[i].AO.id).set({
					"Output" : output
				});
				DCSSPACE.functionBlockExecutor.updateView(functionBlockCollection, outputTable[i].AO.id);
				break;
			case "DO":
				var inputs = DCSSPACE.functionBlockExecutor.getSourceValues(outputTable[i].DO, areaName, inputTable, functionBlockTable);
				var output = 0;
				for(var k = 0; k < inputs.length; k++) {
					output = !isNaN(inputs[k]) ? output + inputs[k] : "?";
				}
				functionBlockCollection.get(outputTable[i].DO.id).set({
					"Output" : output
				});
				DCSSPACE.functionBlockExecutor.updateView(functionBlockCollection, outputTable[i].DO.id);
				break;
			}
		});
	};
	return {
		blockExecutor : blockExecutor,
		getSourceValues : getSourceValues,
		setConnectionLabel : setConnectionLabel,
		updateView : updateView,
		PItypeImplementation : PItypeImplementation,
		//PITypeExecuteinloop : PITypeExecuteinloop
	}
})(this);
