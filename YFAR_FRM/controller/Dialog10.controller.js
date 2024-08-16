sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History"
], function (BaseController, MessageBox, Utilities, History) {
	"use strict";
	var value_obj;
	return BaseController.extend("spefar.app.controller.Dialog10", {
		setRouter: function (oRouter) {
			this.oRouter = oRouter;
		},
		getBindingParameters: function () {
			return {};
		},
		_onButtonPress2: function () {
			var oDialog = this.getView().getContent()[0];
			return new Promise(function (fnResolve) {
				oDialog.attachEventOnce("afterClose", null, fnResolve);
				oDialog.close();
			});
		},
		_onButtonPress1: function () {
			var url = "/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/";
			var oModelData = new sap.ui.model.odata.ODataModel(url, true);
			var filtertype = this.getView().byId("dropdown_inp1").mProperties.value;
			var searchinp = this.getView().byId("farsearch_inp1").getValue();
			if (filtertype === "Title") {
				var relPath = "eFormFars?$filter=TITLE eq '" + searchinp + "'";
			}
			if (filtertype === "On Behalf Of") {
				var relPath = "eFormFars?$filter=ON_BEHALF_OF eq '" + searchinp + "'";
			}
			if (filtertype === "FAR Id") {
				var relPath = "eFormFars?$filter=EFORM_NUM eq '" + searchinp + "'";
			}
			var that = this;
			oModelData.read(relPath, null, [], false, function (oData, response) {
				that.getView().byId("fartable").destroyItems();
				var counter = response.data.results.length;
				var i = 0;
				var otable = that.getView().byId("fartable");
				for (i = 0; i < counter; i++) {
					var data = new sap.m.ColumnListItem({
						cells: [
							new sap.m.Text({
								text: response.data.results[i].ON_BEHALF_OF
							}), new sap.m.Text({
								text: response.data.results[i].STATUS
							}), new sap.m.Text({
								text: response.data.results[i].EFORM_NUM
							}), new sap.m.Text({
								text: response.data.results[i].TITLE
							})
						]
					});
					otable.addItem(data);
				}
			});
		},
		_onButtonPress3: function () {
			var oDialog = this.getView().getContent()[0];
			//Begin of changes by NASNANI on 6 sept 2017
			// Selected value will be fetched and updated on approver of Field
			var selected_items = this.getView().byId("fartable").getSelectedItems();
			var selected_far = selected_items[0].mAggregations.cells[2].mProperties.text;
			if (value_obj !== undefined) {
				value_obj.setValue(selected_far);
			}
			var url = "/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/";
			var oModelData = new sap.ui.model.odata.ODataModel(url, true);
			var relPath = "eFormFars('" + selected_far + "')";
			oModelData.read(relPath, null, [], false, function (oData, response) {
				
				//original value
				var originalValue = window.oModel.getProperty("/original_far");
				originalValue = response.data.ORIG_FAR_BUDGET;
				//REQ0567864:NSONI3:GWDK902066:05/15/2020:Add new change request field for budget:START
				originalValue = originalValue === "" ? "0" : originalValue;
				//REQ0567864:NSONI3:GWDK902066:05/15/2020:Add new change request field for budget:END
				oModel.setProperty("/original_far", originalValue);
				
				//REQ0567864:NSONI3:GWDK902066:05/13/2020:Add new change request field for budget:START
				var reqChangeValue = window.oModel.getProperty("/requested_far");
				reqChangeValue = reqChangeValue === "" ? "0" : reqChangeValue;
				var newRevisedValue = parseFloat(originalValue.split(',').join('')) + parseFloat(reqChangeValue.split(',').join(''));
				var temp1 = new Intl.NumberFormat('en-US').format(newRevisedValue);
				//REQ0567864:NSONI3:GWDK902066:05/13/2020:Add new change request field for budget:END
				
				// revised value
				var revisedValue = window.oModel.getProperty("/revised_far");
				revisedValue = response.data.REV_FAR_BUDGET;
				//REQ0567864:NSONI3:GWDK902066:05/13/2020:Add new change request field for budget:START
				oModel.setProperty("/revised_far", temp1);
				//REQ0567864:NSONI3:GWDK902066:05/13/2020:Add new change request field for budget:END
				
				
				var temp = window.oModel.getProperty("/proj_super");
				temp = response.data.PROJ_SUPER;
				oModel.setProperty("/proj_super", temp);
				var temp = window.oModel.getProperty("/exp_loc");
				temp = response.data.EXP_LOC;
				oModel.setProperty("/exp_loc", temp);
				var temp = window.oModel.getProperty("/wbs");
				temp = response.data.WBS;
				oModel.setProperty("/wbs", temp);
			});
			oDialog.close();
		},
		//Begin of changes by NASNANI on 6 sept 2017
		setValueObject: function (oSource) {
			value_obj = oSource;
		},
		//End of changes by NASNANI on 6 sept 2017
		onInit: function () {
			this.mBindingOptions = {};
			this._oDialog = this.getView().getContent()[0];
			var url = "/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/";
			var oModelData = new sap.ui.model.odata.ODataModel(url, true);
			var relPath = "eFormFars";
			var that = this;
			oModelData.read(relPath, null, [], false, function (oData, response) {
				that.getView().byId("fartable").destroyItems();
				var counter = response.data.results.length;
				var i = 0;
				var table = that.getView().byId("fartable");
				for (i = 0; i < counter; i++) {
					var data = new sap.m.ColumnListItem({
						cells: [
							new sap.m.Text({
								text: response.data.results[i].ON_BEHALF_OF
							}), new sap.m.Text({
								text: response.data.results[i].STATUS
							}), new sap.m.Text({
								text: response.data.results[i].EFORM_NUM
							}), new sap.m.Text({
								text: response.data.results[i].TITLE
							})
						]
					});
					table.addItem(data);
				}
			});
		},
		onExit: function () {
			this._oDialog.destroy();
		}
	});
}, /* bExport= */ true);