jQuery.sap.declare("com.sap.build.standard.charitableDonationForm.model.formatter");

com.sap.build.standard.charitableDonationForm.model.formatter = {

	stringToBoolean: function (sValue) {
		if (sValue === "Y") {
			return true;
		}
else if (sValue === "X") {
			return true;
		} else {
			return false;
		}
	}
};