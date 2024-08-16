sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox"
], function (Controller, MessageBox) {
	"use strict";
	var todaydate = "";
	return Controller.extend("com.sap.build.standard.charitableDonationForm.controller.SearchPage", {
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf sony.pcard.appYPCardApplication.view.SearchApplicationCard
		 */
		onInit: function () {
			this.Router = sap.ui.core.UIComponent.getRouterFor(this);
			var model = this.getOwnerComponent().getModel("oData");

			var that = this;
			model.read("/eFormInitialInfos('1')", {

				success: function (oData, response) {

					that.getView().byId("PREPARED_BY").setValue(response.data.NAME);
					todaydate = response.data.DATE;

				},

				error: function (oError) {
					var response = JSON.parse(oError.responseText);
					MessageBox.show(
						response.error.message.value,
						MessageBox.Icon.ERROR,
						"Error"
					);
					sap.ui.core.BusyIndicator.hide();
				}
			});

		},

		clear_fields: function () {
			this.getView().byId("EFORM_NUM").setValue("");
			this.getView().byId("TITLE").setValue("");
			this.getView().byId("NAME").setValue("");
			this.getView().byId("APPROVED_BY").setValue("");
			this.getView().byId("APPROVER").setValue("");
			this.getView().byId("APPROVED_DT").setValue("");
			this.getView().byId("APPROVED_DT_TO").setValue("");
			this.getView().byId("CREATED_DT").setValue("");
			this.getView().byId("CREATED_DT_TO").setValue("");
			this.getView().byId("SUBMITED_DT").setValue("");
			this.getView().byId("SUBMITED_DT_TO").setValue("");
			this.getView().byId("PREPARED_BY").setValue("");
			this.getView().byId("SUBLOB").setValue("");
			this.getView().byId("LOB").setValue("");
			this.getView().byId("REQUESTED_BY").setValue("");
			this.getView().byId("STATUS").setValue("");
			this.getView().byId("AMOUNT1").setValue("");
			this.getView().byId("AMOUNT2").setValue("");
		},

		report_records: function (oEvent) {

			var model = this.getOwnerComponent().getModel("oData");
			var eform_num = this.getView().byId("EFORM_NUM").getValue();
			var title = this.getView().byId("TITLE").getValue();
			var approved_by = this.getView().byId("APPROVED_BY").getValue();
			var approver = this.getView().byId("APPROVER").getValue();
			var approved_dt = this.getView().byId("APPROVED_DT").getValue();
			var approved_dt_to = this.getView().byId("APPROVED_DT_TO").getValue();
			var created_dt = this.getView().byId("CREATED_DT").getValue();
			var created_dt_to = this.getView().byId("CREATED_DT_TO").getValue();
			var submited_dt = this.getView().byId("SUBMITED_DT").getValue();
			var submited_dt_to = this.getView().byId("SUBMITED_DT_TO").getValue();
			var lob = this.getView().byId("LOB").getValue();
			var sublob = this.getView().byId("SUBLOB").getValue();
			var prepared_by = this.getView().byId("PREPARED_BY").getValue();
			var on_behalf_of = this.getView().byId("REQUESTED_BY").getValue();
			var cardholder = this.getView().byId("NAME").getValue();
			var status = this.getView().byId("STATUS").getValue();
			var amount11 = this.getView().byId("AMOUNT1").getValue();
			var amount1 = amount11.split(',').join('');
			var amount22 = this.getView().byId("AMOUNT2").getValue();
			var amount2 = amount22.split(',').join('');

			var relPath = "/sap/opu/odata/sap/YFPSFIPFRDD0024_CHARITABLE_FRM_SRV/eFormHeaders?$filter=EFORM_NUM eq '" + eform_num +
				"' and TITLE eq '" + title +
				"' and APPROVED_BY eq '" + approved_by +
				"' and APPROVER eq '" + approver +
				"' and (APPROVED_DT ge '" + approved_dt +
				"' and APPROVED_DT le '" + approved_dt_to +
				"') and (REQUEST_DATE ge '" + created_dt +
				"' and  REQUEST_DATE le '" + created_dt_to +
				"') and SUBLOB eq '" + sublob +
				"' and LOB eq '" + lob +
				"' and PREPARER eq '" + prepared_by +
				"' and ON_BEHALF_OF eq '" + on_behalf_of +
				"' and DEPARTMENT_HEAD eq '" + cardholder +
				"' and STATUS eq '" + status +
				"' and (AMOUNT_DONATION_USD ge '" + amount1 +
				"' and AMOUNT_DONATION_USD le '" + amount2 +
				"') and (DATE_SUBMITTED ge '" + submited_dt +
				"' and DATE_SUBMITTED le '" + submited_dt_to +
				"')&$format=xlsx";

			var encodeUrl = encodeURI(relPath);
			sap.m.URLHelper.redirect(encodeUrl, true);

		},

		handleAmountLiveChange: function (oEvent) {
			var sAmount = oEvent.getParameter("value");
			var a = sAmount.split(',').join('');
			var totalUsd = new Intl.NumberFormat('en-US').format(a);
			this.getView().byId("AMOUNT1").setValue(totalUsd);
		},
		handleAmountLiveChangeTo: function (oEvent) {
			var sAmount = oEvent.getParameter("value");
			var b = sAmount.split(',').join('');
			var totalUsd = new Intl.NumberFormat('en-US').format(b);
			this.getView().byId("AMOUNT2").setValue(totalUsd);
		},

		search_records: function (oEvent) {
			var model = this.getOwnerComponent().getModel("oData");
			var eform_num = this.getView().byId("EFORM_NUM").getValue();
			var title = this.getView().byId("TITLE").getValue();
			var approved_by = this.getView().byId("APPROVED_BY").getValue();
			var approver = this.getView().byId("APPROVER").getValue();
			var approved_dt = this.getView().byId("APPROVED_DT").getValue();
			var approved_dt_to = this.getView().byId("APPROVED_DT_TO").getValue();
			var created_dt = this.getView().byId("CREATED_DT").getValue();
			var created_dt_to = this.getView().byId("CREATED_DT_TO").getValue();
			var submited_dt = this.getView().byId("SUBMITED_DT").getValue();
			var submited_dt_to = this.getView().byId("SUBMITED_DT_TO").getValue();
			var lob = this.getView().byId("LOB").getValue();
			var sublob = this.getView().byId("SUBLOB").getValue();
			var prepared_by = this.getView().byId("PREPARED_BY").getValue();
			var on_behalf_of = this.getView().byId("REQUESTED_BY").getValue();
			var cardholder = this.getView().byId("NAME").getValue();
			var status = this.getView().byId("STATUS").getValue();
			var amount11 = this.getView().byId("AMOUNT1").getValue();
			var amount1 = amount11.split(',').join('');
			var amount22 = this.getView().byId("AMOUNT2").getValue();
			var amount2 = amount22.split(',').join('');
			var relPath = "/eFormHeaders";
			var that = this;
			var myfilter = [];
			var oFilter1 = new sap.ui.model.Filter(
				"EFORM_NUM",
				sap.ui.model.FilterOperator.EQ, eform_num
			);
			myfilter.push(oFilter1);
			var oFilter2 = new sap.ui.model.Filter(
				"TITLE",
				sap.ui.model.FilterOperator.EQ, title
			);
			myfilter.push(oFilter2);
			var oFilter3 = new sap.ui.model.Filter(
				"APPROVED_BY",
				sap.ui.model.FilterOperator.EQ, approved_by
			);
			myfilter.push(oFilter3);
			var oFilter4 = new sap.ui.model.Filter(
				"APPROVER",
				sap.ui.model.FilterOperator.EQ, approver
			);
			myfilter.push(oFilter4);

			var oFilter5 = new sap.ui.model.Filter(
				"REQUEST_DATE",
				sap.ui.model.FilterOperator.BT, created_dt, created_dt_to
			);

			myfilter.push(oFilter5);
			var oFilter6 = new sap.ui.model.Filter(
				"APPROVED_DT",
				sap.ui.model.FilterOperator.BT, approved_dt, approved_dt_to
			);
			myfilter.push(oFilter6);
			var oFilter7 = new sap.ui.model.Filter(
				"DATE_SUBMITTED",
				sap.ui.model.FilterOperator.BT, submited_dt, submited_dt_to
			);
			myfilter.push(oFilter7);
			var oFilter8 = new sap.ui.model.Filter(
				"LOB",
				sap.ui.model.FilterOperator.EQ, lob
			);
			myfilter.push(oFilter8);
			var oFilter9 = new sap.ui.model.Filter(
				"SUBLOB",
				sap.ui.model.FilterOperator.EQ, sublob
			);
			myfilter.push(oFilter9);
			var oFilter10 = new sap.ui.model.Filter(
				"PREPARER",
				sap.ui.model.FilterOperator.EQ, prepared_by
			);
			myfilter.push(oFilter10);

			var oFilter11 = new sap.ui.model.Filter(
				"DEPARTMENT_HEAD",
				sap.ui.model.FilterOperator.EQ, cardholder
			);
			myfilter.push(oFilter11);
			var oFilter12 = new sap.ui.model.Filter(
				"STATUS",
				sap.ui.model.FilterOperator.EQ, status
			);
			myfilter.push(oFilter12);

			var oFilter13 = new sap.ui.model.Filter(
				"ON_BEHALF_OF",
				sap.ui.model.FilterOperator.EQ, on_behalf_of
			);
			myfilter.push(oFilter13);

			var oFilter14 = new sap.ui.model.Filter(
				"AMOUNT_DONATION_USD",
				sap.ui.model.FilterOperator.BT, amount1, amount2
			);
			myfilter.push(oFilter14);

			var model = this.getOwnerComponent().getModel("oData");
			this.getView().byId("eforms_tab").destroyItems();
			var that = this;
			model.read(relPath, {
				filters: myfilter,
				success: function (oData, response) {

					var counter = oData.results.length;
					var i = 0;
					var selected_box;
					var license_cost;
					var table = that.getView().byId("eforms_tab");
					for (i = 0; i < counter; i++) {

						var temp = oData.results[i].AMOUNT_DONATION_USD + 'USD';
						var data = new sap.m.ColumnListItem({
							cells: [
								new sap.m.Link({
									text: oData.results[i].EFORM_NUM,
									press: function (oEvent) {
										that.Router.navTo('CreatePage', {
											value: oEvent.oSource.mProperties.text
										});
									}
								}),
								new sap.m.Text({
									text: oData.results[i].TITLE
								}),
								new sap.m.Text({
									text: oData.results[i].STATUS
								}),
								new sap.m.Text({
									text: oData.results[i].REQUEST_DATE
								}),
								new sap.m.Text({
									text: temp
								})
							]
						});
						table.addItem(data);
					}

				},
				error: function (oError) {
					var response = JSON.parse(oError.responseText);
					MessageBox.show(
						response.error.message.value,
						MessageBox.Icon.ERROR,
						"Error"
					);
					sap.ui.core.BusyIndicator.hide();
				}
			});
		},

		_onLobValueHelpRequest: function () {
			var lob = this.getView().byId("LOB");
			var oValueHelpDialog_RespDiv = new sap.m.SelectDialog({
				title: "Choose Value for COFA Lob",
				items: {
					path: "/eFormLobs",
					template: new sap.m.StandardListItem({
						title: "{LOB}",
						description: "{SLOB_DESCRIPTION}",
						active: true
					})
				},
				//Shipping Point can be searched using Search Bar
				search: function (oEvent) {
					var sValue = oEvent.getParameter("value");
					var oFilter = new sap.ui.model.Filter(
						"LOB",
						sap.ui.model.FilterOperator.Contains, sValue
					);
					var oFilter2 = new sap.ui.model.Filter(
						"SLOB_DESCRIPTION",
						sap.ui.model.FilterOperator.Contains, sValue
					);

					oEvent.getSource().getBinding("items").filter([oFilter2]);
				},

				confirm: function (oEvent) {

					var oSelectedItem = oEvent.getParameter("selectedItem");
					if (oSelectedItem) {
						lob.setValue(oSelectedItem.getTitle());
					}
				}

			});

			var model = this.getOwnerComponent().getModel("oData");
			oValueHelpDialog_RespDiv.setModel(model);
			oValueHelpDialog_RespDiv.open();
		},

		_onSubLobValueHelpRequest: function () {
			var sublob = this.getView().byId("SUBLOB");
			var lob = this.getView().byId("LOB").getValue();
			var oValueHelpDialog_RespDiv = new sap.m.SelectDialog({
				title: "Choose Value for COFA SubLob",
				items: {
					path: "/eFormLobs",

					filters: [new sap.ui.model.Filter({
						filters: [new sap.ui.model.Filter({
							path: "LOB",
							operator: sap.ui.model.FilterOperator.EQ,
							value1: lob
						})],
						and: true
					})],

					template: new sap.m.StandardListItem({
						title: "{SUBLOB}",
						description: "{SLOB_DESCRIPTION}",
						active: true
					})
				},
				//Shipping Point can be searched using Search Bar
				search: function (oEvent) {
					var sValue = oEvent.getParameter("value");

					var oFilter = new sap.ui.model.Filter(
						"SLOB_DESCRIPTION",
						sap.ui.model.FilterOperator.EQ, sValue
					);

					oEvent.getSource().getBinding("items").filter([oFilter]);
				},

				confirm: function (oEvent) {

					var oSelectedItem = oEvent.getParameter("selectedItem");
					if (oSelectedItem) {
						sublob.setValue(oSelectedItem.getTitle());
					}
				}

			});

			var model = this.getOwnerComponent().getModel("oData");
			oValueHelpDialog_RespDiv.setModel(model);
			oValueHelpDialog_RespDiv.open();
		},

		_onDep_ValueHelp: function () {

			var cardholder = this.getView().byId("NAME");
			var that2 = this;
			var oValueHelpDialog_CardHolderName = new sap.m.SelectDialog({
				title: "Choose Value for Department Head",
				items: {
					path: "/eFormProductionAccts",
					template: new sap.m.StandardListItem({
						title: "{USERID}",
						description: "{NAME}",

						active: true
					})
				},

				search: function (oEvent) {
					var sValue = oEvent.getParameter("value");
					var oFilter = new sap.ui.model.Filter(
						"NAME",
						sap.ui.model.FilterOperator.Contains, sValue
					);
					oEvent.getSource().getBinding("items").filter([oFilter]);
				},

				//On click of Confirm, value is set to input field
				confirm: function (oEvent) {

					var oSelectedItem = oEvent.getParameter("selectedItem");
					if (oSelectedItem) {
						cardholder.setValue(oSelectedItem.getDescription());

					}
				}

			});

			var model = this.getOwnerComponent().getModel("oData");
			oValueHelpDialog_CardHolderName.setModel(model);

			oValueHelpDialog_CardHolderName.open();
		},

		_onApprover_ValueHelp: function () {

			var cardholder = this.getView().byId("APPROVER");
			var that2 = this;
			var oValueHelpDialog_CardHolderName = new sap.m.SelectDialog({
				title: "Choose Value for Approver",
				items: {
					path: "/eFormProductionAccts",
					template: new sap.m.StandardListItem({
						title: "{USERID}",
						description: "{NAME}",

						active: true
					})
				},

				search: function (oEvent) {
					var sValue = oEvent.getParameter("value");
					var oFilter = new sap.ui.model.Filter(
						"NAME",
						sap.ui.model.FilterOperator.Contains, sValue
					);
					oEvent.getSource().getBinding("items").filter([oFilter]);
				},

				//On click of Confirm, value is set to input field
				confirm: function (oEvent) {

					var oSelectedItem = oEvent.getParameter("selectedItem");
					if (oSelectedItem) {
						cardholder.setValue(oSelectedItem.getDescription());

					}
				}

			});

			var model = this.getOwnerComponent().getModel("oData");
			oValueHelpDialog_CardHolderName.setModel(model);

			oValueHelpDialog_CardHolderName.open();
		},

		_onApprovedBy_ValueHelp: function () {

			var cardholder = this.getView().byId("APPROVED_BY");
			var that2 = this;
			var oValueHelpDialog_CardHolderName = new sap.m.SelectDialog({
				title: "Choose Value for Approved By",
				items: {
					path: "/eFormProductionAccts",
					template: new sap.m.StandardListItem({
						title: "{USERID}",
						description: "{NAME}",

						active: true
					})
				},

				search: function (oEvent) {
					var sValue = oEvent.getParameter("value");
					var oFilter = new sap.ui.model.Filter(
						"NAME",
						sap.ui.model.FilterOperator.Contains, sValue
					);
					oEvent.getSource().getBinding("items").filter([oFilter]);
				},

				//On click of Confirm, value is set to input field
				confirm: function (oEvent) {

					var oSelectedItem = oEvent.getParameter("selectedItem");
					if (oSelectedItem) {
						cardholder.setValue(oSelectedItem.getDescription());

					}
				}

			});

			var model = this.getOwnerComponent().getModel("oData");
			oValueHelpDialog_CardHolderName.setModel(model);

			oValueHelpDialog_CardHolderName.open();
		},

		_onBehalfOf_ValueHelp: function () {

			var cardholder = this.getView().byId("REQUESTED_BY");
			var that2 = this;
			var oValueHelpDialog_CardHolderName = new sap.m.SelectDialog({
				title: "Choose Value for On Behalf Of",
				items: {
					path: "/eFormProductionAccts",
					template: new sap.m.StandardListItem({
						title: "{USERID}",
						description: "{NAME}",

						active: true
					})
				},

				search: function (oEvent) {
					var sValue = oEvent.getParameter("value");
					var oFilter = new sap.ui.model.Filter(
						"NAME",
						sap.ui.model.FilterOperator.Contains, sValue
					);
					oEvent.getSource().getBinding("items").filter([oFilter]);
				},

				//On click of Confirm, value is set to input field
				confirm: function (oEvent) {

					var oSelectedItem = oEvent.getParameter("selectedItem");
					if (oSelectedItem) {
						cardholder.setValue(oSelectedItem.getDescription());

					}
				}

			});

			var model = this.getOwnerComponent().getModel("oData");
			oValueHelpDialog_CardHolderName.setModel(model);

			oValueHelpDialog_CardHolderName.open();
		},

		_onPreparer_ValueHelp: function () {

			var cardholder = this.getView().byId("PREPARED_BY");
			var that2 = this;
			var oValueHelpDialog_CardHolderName = new sap.m.SelectDialog({
				title: "Choose Value for Preparer",
				items: {
					path: "/eFormProductionAccts",
					template: new sap.m.StandardListItem({
						title: "{USERID}",
						description: "{NAME}",

						active: true
					})
				},

				search: function (oEvent) {
					var sValue = oEvent.getParameter("value");
					var oFilter = new sap.ui.model.Filter(
						"NAME",
						sap.ui.model.FilterOperator.Contains, sValue
					);
					oEvent.getSource().getBinding("items").filter([oFilter]);
				},

				//On click of Confirm, value is set to input field
				confirm: function (oEvent) {

					var oSelectedItem = oEvent.getParameter("selectedItem");
					if (oSelectedItem) {
						cardholder.setValue(oSelectedItem.getDescription());

					}
				}

			});

			var model = this.getOwnerComponent().getModel("oData");
			oValueHelpDialog_CardHolderName.setModel(model);

			oValueHelpDialog_CardHolderName.open();
		},

		copy_eform: function (oEvent) {
			var selected_item = this.getView().byId("eforms_tab").getSelectedItem();
			var eform_num = selected_item.mAggregations.cells[0].mProperties.text;
			if (eform_num !== "") {
				this.Router.navTo('CreatePage', {
					value: eform_num + '#copy'
				});
			}
		},

		onCreatePressFromSearch: function (oEvent) {

				this.Router.navTo('CreatePage1', true);

			}
			/**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 * @memberOf sony.pcard.appYPCardApplication.view.SearchApplicationCard
			 */
			//  onBeforeRendering: function() {
			//
			//  },
			/**
			 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
			 * This hook is the same one that SAPUI5 controls get after being rendered.
			 * @memberOf sony.pcard.appYPCardApplication.view.SearchApplicationCard
			 */
			//  onAfterRendering: function() {
			//
			//  },
			/**
			 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
			 * @memberOf sony.pcard.appYPCardApplication.view.SearchApplicationCard
			 */
			//  onExit: function() {
			//
			//  }
	});
});