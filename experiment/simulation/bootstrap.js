
/**
 * Harshal Chaudhari
 * 	
 * Nov 1-2012	
 */
var DCSSPACE = DCSSPACE || {};
DCSSPACE.collection;
DCSSPACE.saveFigure = [];
DCSSPACE.saveConnection = [];
DCSSPACE.SaveAndLoadFigure = [];
DCSSPACE.inputImageTable = [];
DCSSPACE.outputImageTable = [];
DCSSPACE.functionBlockImageTable = [];
var timeoutforPID, currentIOInput = null;
var tab_id, scancyclethread, flagForUpCounterCheck = false, flagForDownCounterCheck = false;

//define(['jquery', 'jqueryui', 'backbone', 'View', 'Collection', 'Model', 'logger', 'impromptu'], function() {
	$(document).ready(function() {
		var pageview = new DCSSPACE.view.pageview();
		
	});
//});
