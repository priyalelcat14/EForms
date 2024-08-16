function initModel() {
	var sUrl = "/sap/opu/odata/sap/YFPSFIPFRDD0389_GL_PRODUCTION_SRV/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}