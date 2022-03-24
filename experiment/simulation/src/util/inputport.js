/**
 * Author : Harshal Chaudhari
 * 	
 * Nov 1-2012	
 */

DCSSPACE.inputs = (function(){
var type;
var MyPort = function(_2130, obj) {
	this.input = _2130;
	draw2d.InputPort.call(this.input, obj);
	this.input.setHideIfConnected(true);
	this.input.type = "MyInputPort";
	this.input.onDrop = function(port) {
	if(port.getMaxFanOut && port.getMaxFanOut() <= port.getFanOut()) {
		return;
	}
	if(this.parentNode.id == port.parentNode.id) {
	} else {
		/*var _2132 = new draw2d.CommandConnect(this.parentNode.workflow, port, this);
		_2132.target.parentNode.Outputlabel.style.display = "block";
		_2132.target.parentNode.setOutputLabel("?");
		this.parentNode.Inputlabel.style.display = "block";
		this.parentNode.setInputLabel("?");
		_2132.setConnection(new draw2d.ContextmenuConnection());
		this.parentNode.workflow.getCommandStack().execute(_2132);*/
	}
	
	}
};
return {
	MyInputPort : MyPort
	}
})(this)