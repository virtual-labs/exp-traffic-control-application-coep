/**
 * Harshal Chaudhari
 * 	
 * Nov 1-2012	
 */
//define(['functionBlockExecutor'], function() {
DCSSPACE.scanCycle = (function() {
	var inputImageTable = [];
	var outputImageTable = [];

	var ScanInstructionTable = function() {
		//console.log("Run mode");
		DCSSPACE.functionBlockExecutor.blockExecutor();
	}
	var StopScanCycle  = function(){
		clearInterval(scancyclethread);
		if(timeoutforPID != null)
			window.clearTimeout(timeoutforPID);
		//console.log("Stop");
	}
	return{
		ScanInstructionTable : ScanInstructionTable,
		StopScanCycle : StopScanCycle
	}
})(this)
//});
