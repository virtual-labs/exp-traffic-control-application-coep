/**
 * Harshal Chaudhari
 * 	
 * Nov 1-2012	
 */

DCSSPACE.Collection = (function() {
	var FunctionalBlockcollection = Backbone.Collection.extend({
		model : DCSSPACE.FunctionBlockModel,
		initialize : function() {
			//console.log("FunctoinalBlock Collection");
		},
		comparator : function(model){
			return - model.get("sequenceNo");
		},
		sortAsc : function(collection){
			var collectionArray = [];
			for(var i=collection.length-1; i>=0; i--){
				collectionArray.push(collection.models[i])
			}
			return collectionArray;
		}
	});
	
	var DCSCollection = Backbone.Collection.extend({
		model : DCSSPACE.AreaModel,
		initialize : function(){
			//console.log("Area Collection");
		}
	});
	
	
	return {
		FunctionalBlockcollection: FunctionalBlockcollection,
		DCSCollection : DCSCollection
	}
	
})();
