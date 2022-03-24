/**
 * Author : Harshal Chaudhari
 * 	
 * Nov 1-2012	
 */


DCSSPACE.JSONWriter = function() {
	var DCS = {}, Area = [], Figureattr = [], result = {}, blockobject = {}, completeSingleBlockObject = {}, blockattr = {};
	var f = null, canvas;
	var totalTabCounter = DCSSPACE.collection.length;
	for(var j = 0; j < totalTabCounter; j++) {
		canvas = DCSSPACE.collection.models[j].get("workflow");
		var figures = canvas.getFigures();
		for(var i = 0; i < figures.getSize(); i++) {
			f = figures.get(i);
			if(f.type == "draw2d.Node") 
			{
				blockattr["blockType"] = getBlockType(f);
				blockattr[f.getnodeName()] = f.getModelAttrubutes()
				if(getBlockType(f) == "PID"){
					blockattr[f.getnodeName()]["attr"] = f.getPIDAttrubutes();					
				}else if(getBlockType(f) == "CPT"){
					blockattr[f.getnodeName()]["attr"] = f.getCPTAttrubutes();	
				}else if(getBlockType(f) == "OND" || getBlockType(f)=="OFFD" || getBlockType(f)=="RTO" || getBlockType(f)=="UPCTR" || getBlockType(f)=="DWCTR" ){
					blockattr[f.getnodeName()]["attr"] = f.getTimerAndCounterAttrubutes();
				}
				blockobject = blockattr;
				blockattr ={};
				Figureattr.push(blockobject);
			}
		}
		result = {
			id : canvas.html.id,
			isEnable : canvas.enabled,
			attr : Figureattr
		};
		Area.push(result);
		blockobject ={};
		Figureattr = [];
		result = {};
	}
	DCS = {
		areaCollection : Area
	}
	DCSSPACE.SaveAndLoadFigure = result;
	return DCS;
}

var getBlockType = function(figure){
		return figure.getnodeName()
	}