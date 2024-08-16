sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History"
], function (BaseController, MessageBox, Utilities, History) {
	"use strict";
	var value_obj;
	jQuery.sap.require("jquery.sap.storage");

	return BaseController.extend("spefar.app.controller.Dialog5", {
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
		_onButtonPress3: function () {
			var oDialog = this.getView().getContent()[0];
			//Begin of changes by NASNANI on 6 sept 2017
			// Selected value will be fetched and updated on OnBahalf of Field
			var selected_items = this.getView().byId("costcenter_table").getSelectedItems();
			var selected_costcenter = selected_items[0].mAggregations.cells[0].mProperties.text;
			selected_costcenter = selected_costcenter + " " + selected_items[0].mAggregations.cells[1].mProperties.text;

			//REQ0602256:NSONI3:GWDK902117:02/02/2021:WBS field enable/disbale changes:START
			var wbs_visibility_flag = selected_items[0].mAggregations.cells[2].mProperties.text;
			sap.ui.controller("spefar.app.controller.FarRequest").addcostcenter(selected_costcenter, wbs_visibility_flag);
			//REQ0602256:NSONI3:GWDK902117:02/02/2021:WBS field enable/disbale changes:END

			oDialog.close();
			//return new Promise(function (fnResolve) {
			//    oDialog.attachEventOnce("afterClose", null, fnResolve);
			//    oDialog.close();
			//});
			//End of changes by NASNANI on 6 sept 2017
		},
		_onButtonPress1: function () {

			var url = "/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/";
			var oModelData = new sap.ui.model.odata.ODataModel(url, true);
			var rec = this.getView().byId("costcenter_searchinp").getValue();

			var relPath = "eFormCostCenters?$filter=NAME eq '" + rec + "' ";
			var that = this;
			oModelData.read(relPath, null, [], false, function (oData, response) {
				that.getView().byId("costcenter_table").destroyItems();
				var counter = response.data.results.length;
				var i = 0;
				var otable = that.getView().byId("costcenter_table");
				for (i = 0; i < counter; i++) {
					var data = new sap.m.ColumnListItem({
						cells: [
							new sap.m.Text({
								text: response.data.results[i].COSTCENTER
							}), new sap.m.Text({
								text: response.data.results[i].NAME
							}),
							//REQ0602256:NSONI3:GWDK902117:02/02/2021:WBS field enable/disbale changes:START
							new sap.m.Text({
								text: response.data.results[i].WBS_VISIBLITY_FLG
							})
							//REQ0602256:NSONI3:GWDK902117:02/02/2021:WBS field enable/disbale changes:END
						]
					});
					otable.addItem(data);
				}
			});
		},
		setValueObject: function (oSource) {
			value_obj = oSource;
		},
		onInit: function () {
			this.mBindingOptions = {};
			this._oDialog = this.getView().getContent()[0];
			var url = "/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/";
			var oModelData = new sap.ui.model.odata.ODataModel(url, true);
			var relPath = "eFormCostCenters";

			var that = this;
			oModelData.read(relPath, null, [], false, function (oData, response) {
					that.getView().byId("costcenter_table").destroyItems();
					var counter = response.data.results.length;
					var i = 0;
					var table = that.getView().byId("costcenter_table");
					for (i = 0; i < counter; i++) {
						var data = new sap.m.ColumnListItem({
							cells: [
								new sap.m.Text({
									text: response.data.results[i].COSTCENTER
								}), new sap.m.Text({
									text: response.data.results[i].NAME
								}),
								//REQ0602256:NSONI3:GWDK902117:02/02/2021:WBS field enable/disbale changes:START
								new sap.m.Text({
									text: response.data.results[i].WBS_VISIBLITY_FLG
								})
								//REQ0602256:NSONI3:GWDK902117:02/02/2021:WBS field enable/disbale changes:END
							]
						});
						table.addItem(data);
					}
				},
				function (oError) {
					oModelData.fireRequestCompleted();
					var msg = JSON.parse(oError.response.body).error.message.value;
					//sap.m.MessageBox.error(msg);
					sap.m.MessageToast.show(msg);
				});
		},
		onExit: function () {
			this._oDialog.destroy();
		}
	});
}, /* bExport= */ true);