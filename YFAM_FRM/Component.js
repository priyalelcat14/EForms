sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",

	"sony/finance/maintaince/app/model/models"
], function (UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("sony.finance.maintaince.app.Component", {

		metadata: {
			manifest: "json"
		},

		config: {
			fullWidth: true //Set your fullscreen parameter here!

		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {

			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
			// create the views based on the url/hash
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			var docTypeModel = new sap.ui.model.json.JSONModel();
			this.setModel(docTypeModel, "headerUserModel");

			// create and set the ODataModel
			var oModel = new sap.ui.model.odata.v2.ODataModel(
				"/sap/opu/odata/sap/YFPSFIPFRDD0224_EFORM_SRV/");
			this.setModel(oModel, "odataModel");

			var omodel = new sap.ui.model.json.JSONModel({
				isVisible: true,
				isEnable: false
			});
			this.setModel(omodel, "userModel");
			// omodel.setProperty("isVisible",false);

			var data = {
				ProductCollection: [{
						ProductId: 1239102,
						Name: "Power3",
						Category: "Projector",
						SupplierName: "Titanium",
						Description: "A very powerful projector",
						WeightMeasure: "1467",
						WeightUnit: "g",
						Price: 856.49,
						CurrencyCode: "EUR",
						Status: "Available",
						Quantity: "3",
						UoM: "PC",
						Width: "51",
						Depth: "42",
						Height: "18",
						DimUnit: "cm",
						isEnable: false
					}, {
						ProductId: 1239102,
						Name: "Power3",
						Category: "Projector",
						SupplierName: "Titanium",
						Description: "A very powerful projector",
						WeightMeasure: "1467",
						WeightUnit: "g",
						Price: "856.49",
						CurrencyCode: "EUR",
						Status: "Available",
						Quantity: "3",
						UoM: "PC",
						Width: "51",
						Depth: "42",
						Height: "18",
						DimUnit: "cm",
						isEnable: false
					}

				]
			};
			var uiJsonModel = new sap.ui.model.json.JSONModel(data);
			this.setModel(uiJsonModel, "UiModel");
			uiJsonModel.setProperty("/isEdit", false);

		}
	});
});