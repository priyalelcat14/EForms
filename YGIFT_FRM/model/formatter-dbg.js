sap.ui.define([], function() {
	"use strict";
	return {
		approvalText : function(sText){
			if(sText === "X"){
				return true;
			}else if(sText === "R"){
				return false;
			}
			else {
				return false;
				
			}
		},
		
	stringToBoolean: function (sValue) {
		if (sValue === "Y") {
			return true;
		} 
		else 	if (sValue === "X") {
			return true;
		}else {
			return false;
		}
	}
	};
});