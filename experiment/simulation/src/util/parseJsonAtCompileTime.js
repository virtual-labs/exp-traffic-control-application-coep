
/**
 * Author : Harshal Chaudhari
 * 	
 * Nov 1-2012	
 */


DCSSPACE.ParseJSON = function(jsonObj) {
	DCSSPACE.areaForExection = [];
	var totalNoOfBlocksInArea, totalNoOfArea, areaCollectionAttr, block ={};
	inputImageTable = [];
	outputImageTable = [];
	functionBlockImageTable =[];
	totalNoOfArea = jsonObj.areaCollection.length;
	$.each(jsonObj.areaCollection, function(i) {
		if(jsonObj.areaCollection[i].isEnable) {
			areaCollectionAttr = jsonObj.areaCollection[i].attr;
			totalNoOfBlocksInArea = jsonObj.areaCollection[i].attr.length;
			if(areaCollectionAttr != undefined || areaCollectionAttr != null){
				$.each(areaCollectionAttr, function(j){
					if(areaCollectionAttr[j].blockType == "AI" || areaCollectionAttr[j].blockType =="DI"){
						inputImageTable.push(areaCollectionAttr[j]);
					}else if(areaCollectionAttr[j].blockType == "AO" || areaCollectionAttr[j].blockType =="DO"){
						outputImageTable.push(areaCollectionAttr[j]);
					}else{
						functionBlockImageTable.push(areaCollectionAttr[j]);
					}
				});
				block = {
					id: jsonObj.areaCollection[i].id,
					inputImageTable : inputImageTable,
					outputImageTable : outputImageTable,
					functionBlockImageTable : functionBlockImageTable
				}
				inputImageTable = [];
				outputImageTable = [];
				functionBlockImageTable = [];
				
			}
			DCSSPACE.areaForExection.push(block);
		}
		//console.log(DCSSPACE.areaForExection);
	});
}
