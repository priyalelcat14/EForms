sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function (JSONModel, Device) {
	"use strict";

	return {

		createDeviceModel: function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("TwoWay");
			return oModel;
		},

		initialize: function (oDataModel, component, oView) {

			this._serverModel = oDataModel;
			//this._resourceBundle = resourceBundle;
			this._component = component;
			this._View = oView;
			this._busyIndicator = this._View.byId("busyDialog");

			//this.INITIAL_PERSON_SEARCH_MODEL_DATA = this._getNewPersonSearchModel();

		},

		loadOdataSearchModel: function (mainFilters) {
			this._busyIndicator.open();
			var that = this;
			var sURL = "/eFormSeachHeaders";
			if (mainFilters !== undefined) {
				if (mainFilters.length > 0) {
					this._serverModel.read(sURL, {
						filters: mainFilters,
						success: function (data) {
							var oData = data.results;
							that.arr1 = [];
							that.arr1 = oData;
							if (mainFilters) {
								that.getSearchFormModelData(oData);

							}
							that._busyIndicator.close();
						},
						error: function (error) {
							that._busyIndicator.close();
						}

					});
				}
			} else {
				this._serverModel.read(sURL, {

					success: function (data) {
						var oData = data.results;
						that.arr1 = [];
						that.arr1 = oData;

						that.getSearchFormModelData(oData);
						that._busyIndicator.close();
					}
				});
			}
		},

		getSearchFormModelData: function (oData) {
			var data = {
				eFormSearchHeaders: oData
			};
			this._component.getModel("mainSearchModel").setData(data);
		}

	};
});