sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
], function (Controller, JSONModel) {
	"use strict";

	var selectProdType = "";
	var selectStatus = "";
	var oselectStatus = "";
	return Controller.extend("com.spe.gpas.YGPAS_API.controller.SearchGpas", {

		onInit: function () {
			this._component = this.getOwnerComponent();
			this._serverModel = this._component.getModel("oDataModel");
			selectProdType = "";
			selectStatus = "";
			oselectStatus = "";
		},

		onPressSearch: function () {
			
			var license = this.getView().byId("License").getValue();
			var prod_name = this.getView().byId("Prod_name").getValue();

			var myfilter = [];
			if (license !== null && license !== "") {
				var u = new sap.ui.model.Filter("LICENSE_NO", sap.ui.model.FilterOperator.EQ, license);
				myfilter.push(u);
			}
			if (prod_name !== null && prod_name !== "") {
				var d = new sap.ui.model.Filter("PROD_NAME", sap.ui.model.FilterOperator.EQ, prod_name);
				myfilter.push(d);
			}
			if (selectProdType !== null && selectProdType !== "") {
				var c = new sap.ui.model.Filter("PROD_TYPE", sap.ui.model.FilterOperator.EQ, selectProdType);
				myfilter.push(c);
			}
			if (selectStatus !== null && selectStatus !== "") {
				var h = new sap.ui.model.Filter("STATUS", sap.ui.model.FilterOperator.EQ, selectStatus);
				myfilter.push(h);
			}
			if (oselectStatus !== null && oselectStatus !== "") {
				var i = new sap.ui.model.Filter("STATUS_O", sap.ui.model.FilterOperator.EQ, oselectStatus);
				myfilter.push(i);
			}

			if (myfilter.length > 0) {
				this.loadOdataSearchModel(myfilter);
			} else {
				this.loadOdataSearchModel();
			}
		},
		loadOdataSearchModel: function (mainFilters) {
			var that = this;
			var url = "/SearchSet";
			if (mainFilters !== undefined) {
				if (mainFilters.length > 0) {
					this._serverModel.read(url, {
						filters: mainFilters,
						success: function (oData) {
							var data = oData.results;
							that.arr1 = [];
							that.arr1 = data;
							if (mainFilters) {
								that.getSearchFormModelData(data);
							}
						},
						error: function (error) {}
					});
				}
			} else {
				this._serverModel.read(url, {
					success: function (oData) {
						var data = oData.results;
						that.arr1 = [];
						that.arr1 = data;
						that.getSearchFormModelData(data);
					}
				});
			}
		},
		getSearchFormModelData: function (oData) {
			for (var i = 0; i < oData.length; i++) {
				if (oData[i].PROD_TYPE === 'T') {
					oData[i].PROD_TYPE = "Television";
				} else if (oData[i].PROD_TYPE === 'F') {
					oData[i].PROD_TYPE = "Feature";
				}
				if (oData[i].STATUS === 'A') {
					oData[i].STATUS = "Active";
				} else if (oData[i].STATUS === 'I') {
					oData[i].STATUS = "Inactive";
				}
				if (oData[i].STATUS_O === 'A') {
					oData[i].STATUS_O = "Active";
				} else if (oData[i].STATUS_O === 'I') {
					oData[i].STATUS_O = "Inactive";
				}
			}
			var data = {
				searchHeaders: oData,
				totalCount: oData.length
			};
			var mainSearchModel = new JSONModel();
			this._component.setModel(mainSearchModel, "mainSearchModel");
			this._component.getModel("mainSearchModel").setData(data);
		},
		onSelectProdType: function (oEvent) {
			if (oEvent.getParameters().selectedIndex === 0) {
				selectProdType = 'F';
			} else if (oEvent.getParameters().selectedIndex === 1) {
				selectProdType = 'T';
			} else if (oEvent.getParameters().selectedIndex === 2) {
				selectProdType = '';
			}
		},
		onSelectStatus: function (oEvent) {
			if (oEvent.getParameters().selectedIndex === 0) {
				selectStatus = 'A';
			} else if (oEvent.getParameters().selectedIndex === 1) {
				selectStatus = 'I';
			} else if (oEvent.getParameters().selectedIndex === 2) {
				selectStatus = '';
			}
		},
		onSelectStatus_O: function (oEvent) {
			if (oEvent.getParameters().selectedIndex === 0) {
				oselectStatus = 'A';
			} else if (oEvent.getParameters().selectedIndex === 1) {
				oselectStatus = 'I';
			} else if (oEvent.getParameters().selectedIndex === 2) {
				oselectStatus = '';
			}
		},
		onPressEdit: function (oEvent) {
			//this.onExit();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

			var selected_item = this.getView().byId("eforms_tab").getSelectedItem();
			var licenseNo = selected_item.getAggregation("cells")[0].getProperty("text");
			// if (licenseNo !== "") {
			// 	licenseNo = licenseNo + "+edit";
			// 	oRouter.navTo("EditLicense", {
			// 		context: licenseNo
			// 	});
			// }
			if (licenseNo !== "") {
				oRouter.navTo("EditLicense", {
					context: licenseNo
				});
			}

		},
		onPressView: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var selected_item = this.getView().byId("eforms_tab").getSelectedItem();
			var licenseNo = selected_item.getAggregation("cells")[0].getProperty("text");
			if (licenseNo !== "") {
				licenseNo = licenseNo;
				oRouter.navTo("EditLicenseView", {
					context: licenseNo
				});
			}
		},
		onPressNew: function (oEvent) {

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("EditLicenseNew");
		}

	});

});