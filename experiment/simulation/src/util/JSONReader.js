/**
 * Author : Harshal Chaudhari
 * 	
 * Nov 1-2012	
 */


DCSSPACE.JSONReader = function(canvas, json) {
	var node = null;
	$.each(json, function(i, figure) {
		var source = null;
		var target = null;
		for(i in figure) {
			var val = figure[i];
			figure.setWorkflow(canvas);
			if(figure.type == "draw2d.nodeConnetion") {
				figure.targetPort.setWorkflow(canvas);
				figure.targetAnchor.owner.setWorkflow(canvas);
				figure.sourcePort.setWorkflow(canvas);
				figure.sourceAnchor.owner.setWorkflow(canvas);
				figure.Inputlbl.setWorkflow(canvas);
				figure.outputlbl.setWorkflow(canvas);
			}
			if(i === "source") {
				node = canvas.getFigure(val.node);
				source = node.getPort(val.port);
			} else if(i === "target") {
				node = canvas.getFigure(val.node);
				target = node.getPort(val.port);
			}
		}
		if(source !== null && target !== null) {
			figure.setSource(source);
			figure.setTarget(target);
		}
		canvas.addFigure(figure, figure.x, figure.y);
		if(figure.type == "draw2d.Node") {
			figure.model.set({"workspace" : canvas});
			var model = new DCSSPACE.model.FunctionBlockModel()
			model = figure.model;
			DCSSPACE.collection.get(tab_id).get("functionBlockCollection").add(model);
			// add model into collection
		}
	});
	//console.log(DCSSPACE.collection.toJSON());
}