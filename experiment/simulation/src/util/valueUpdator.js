DCSSPACE.valueUpdator = function(json) {
	var model;
	var dwrData = json.input.data;

	$.each(dwrData, function(i) {
		for ( var keys in dwrData) {
			var p = dwrData[keys];
			model = DCSSPACE.collection.get(p.area).get(
					"functionBlockCollection").get(p.blockid);
			
			if(model != undefined){
			switch (p.blocktype) {
			case "AI":
			case "DI":
				model.set({
					"Output" : p.value
				});
				break;
			}
			 DCSSPACE.view.blockView.prototype.blocksetContent(model);
		}
		}
	});
	
	dwrData = json.fbtable.data;
	$.each(dwrData, function(i) {
		for ( var keys in dwrData) {
			var p = dwrData[keys];
			model = DCSSPACE.collection.get(p.area).get(
					"functionBlockCollection").get(p.blockid);
			if(model != undefined){
			switch (p.blocktype) {
			case "ADD":
			case "SUB":
			case "MUL":
			case "DIV":
			case "AND":
			case "OR":
			case "NOT":
			case "PID":
			case "LIM":
			case "CPT":
			case "DC":
				model.set({
					"Output" : p.value[p.label +"-general"]
				});
				break;
			
			case "UPCTR":
			case "DWCTR":
				model.set({
					"Output" : p.value[p.label +"-general"],
					"ACC" : p.value[p.label +"-acc"]
				});
				break;
			case "OND":
			case "OFFD":
			case "RTO":
				model.set({
					"Output" : p.value[p.label +"-general"],
					"ACC" : p.value[p.label +"-acc"]
				});
				break;
			case "CMP":
				model.set({
					"LT" : p.value[p.label+"-lt"],
					"GT" : p.value[p.label+"-gt"],
					"EQL" : p.value[p.label+"-eql"],
					"NEQL" : p.value[p.label+"-neql"],
					"inrange" : p.value[p.label+"-inrange"],
				});
				break;
				

			}
			
			//$("#information").html(DCSSPACE.view.blockView.prototype.informationBlock(model));
			 DCSSPACE.view.blockView.prototype.blocksetContent(model);
		}
		}
	});
	
	dwrData = json.output.data;

	$.each(dwrData, function(i) {
		for ( var keys in dwrData) {
			var p = dwrData[keys];
			model = DCSSPACE.collection.get(p.area).get(
					"functionBlockCollection").get(p.blockid);
			if(model != undefined){
			switch (p.blocktype) {
			case "AO":
			case "DO":
				model.set({
					"Output" : p.value
				});
				break;
			}
			//$("#information").html(DCSSPACE.view.blockView.prototype.informationBlock(model));
			 DCSSPACE.view.blockView.prototype.blocksetContent(model);
			}
		}
	});

	
}
