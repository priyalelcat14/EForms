jQuery.sap.declare("spefar.app.model.formatter");

spefar.app.model.formatter = {

	stringToBoolean: function (sValue) {
		if (sValue === "Y") {
			return true;
		} 
else if (sValue === "X") {
			return true;
		}  else {
			return false;
		}
	}
};