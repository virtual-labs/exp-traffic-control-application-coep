/**
 * Harshal Chaudhari
 * 	
 * Nov 1-2012	
 */
DCSSPACE.model = (function(){
	var FunctionBlockModel = Backbone.Model.extend({
		initialize:function(){
			//console.log("FunctionalBlock model");
			this.parent = this;
	},
	defaults : {
		id : "",
		source: null,
		target : null,
		Input : 0 ,
		Output : 0,
		block : null,
		label : "",
		sequenceNo: null,
		disable : false,
		description : ""
	},	
	idAttribute : "FunctionBlock"
	});
	
	var AreaModel = Backbone.Model.extend({
		model : FunctionBlockModel,
		initialize : function(){
			//console.log("Area Model");
			this.set({functionBlockCollection : new DCSSPACE.Collection.FunctionalBlockcollection()});
			//functionBlockCollection = this.functionBlockCollection
		},
		defaults : {
			functionBlockCollection : ""
		},
		idAttributes : "Area",
		getFunctionBlockCollection : function(){
			return this.functionBlockCollection;
		}
	});
	return {
		FunctionBlockModel : FunctionBlockModel,
		AreaModel : AreaModel
	}
})();
