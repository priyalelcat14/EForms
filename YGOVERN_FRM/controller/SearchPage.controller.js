sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/model/FilterOperator"
], function (Controller, JSONModel, Filter, MessageToast, MessageBox, FilterOperator) {
	"use strict";

	return Controller.extend("com.sap.build.standard.governmentApp.controller.SearchPage", {

		onInit: function () {

			var component = this.getOwnerComponent();
			this._component = this.getOwnerComponent();
			this._oView = this.getView();

			this.odataModel = this._component.getModel("odataModel");

			var oViewSearchModel,
				oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oViewSearchModel = new JSONModel();
			//component.setModel(oViewSearchModel, "mainSearchModel");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.attachRouteMatched(this._onObjectMatched, this);
			var view = this.getView();

		},
		_onObjectMatched: function () {
			//REQ0470877:RMANDAL:GWDK901935:11/06/2019:Keeping table items on navigating back from create page:START
			// this.getView().byId("eforms_tab").destroyItems();
			//REQ0470877:RMANDAL:GWDK901935:11/06/2019:Keeping table items on navigating back from create page:END
		},
		clear_fields: function () {
			this.getView().byId("EFORM_NUM").setValue("");
			this.getView().byId("TITLE").setValue("");
			this.getView().byId("APPROVED_BY").setValue("");
			this.getView().byId("APPROVER").setValue("");
			this.getView().byId("APPROVED_DT").setValue("");
			this.getView().byId("APPROVED_DT_TO").setValue("");
			this.getView().byId("LOB").setValue("");
			this.getView().byId("SUBLOB").setValue("");
			this.getView().byId("PREPARED_BY").setValue("");
			this.getView().byId("NAME").setValue("");
			this.getView().byId("STATUS").setValue("");

			this.getView().byId("SUBMITED_DT").setValue("");
			this.getView().byId("CREATED_DT").setValue("");
			this.getView().byId("SUBMITED_DT_TO").setValue("");
			this.getView().byId("CREATED_DT_TO").setValue("");
		},

		handleSearch: function (oEvent, DialogName) {
			// build filter array
			var aFilter = [];
			if (oEvent) {
				var sQuery = oEvent.getParameter("value");
				if (sQuery) {
					if (oEvent.getParameters().id === "sLoBDialogId1") {
						aFilter.push(new Filter("SLOB", FilterOperator.Contains, sQuery));
					}
					if (oEvent.getParameters().id === "LoBDialogId1") {
						aFilter.push(new Filter("LOB", FilterOperator.Contains, sQuery));
					}
					if (oEvent.getParameters().id === "UserDialogId1") {
						//REQ0470877:RMANDAL:GWDK901935:11/06/2019:Filtering on user id and user name:START
						var oUserNameFilter = new Filter("NAME", FilterOperator.Contains, sQuery),
							oUserIdFilter = new Filter("USERID", FilterOperator.Contains, sQuery);
						aFilter.push(new Filter([oUserNameFilter, oUserIdFilter], false));
						//REQ0470877:RMANDAL:GWDK901935:11/06/2019:Filtering on user id and user name:END
					}
				}
				// filter binding
				var oList = oEvent.getSource();
				var oBinding = oList.getBinding("items");
				oBinding.filter(aFilter);
				sQuery = "";
			}
			if (!oEvent && DialogName) {
				sQuery = "";
				if (DialogName === "sLoBDialogId1") {
					aFilter.push(new Filter("SLOB", FilterOperator.Contains, sQuery));
				}
				if (DialogName === "LoBDialogId1") {
					aFilter.push(new Filter("LOB", FilterOperator.Contains, sQuery));
				}
				if (DialogName === "UserDialogId1") {
					//REQ0470877:RMANDAL:GWDK901935:11/06/2019:Filtering on user id and user name:START
					var oUserNameFilter = new Filter("NAME", FilterOperator.Contains, sQuery),
						oUserIdFilter = new Filter("USERID", FilterOperator.Contains, sQuery);
					aFilter.push(new Filter([oUserNameFilter, oUserIdFilter], false));
					//REQ0470877:RMANDAL:GWDK901935:11/06/2019:Filtering on user id and user name:END
				}
				// filter binding
				var oList = sap.ui.getCore().byId(DialogName);
				var oBinding = oList.getBinding("items");
				oBinding.filter(aFilter);
				sQuery = "";
			}
		},
		onHandleUserValueHelp: function (oEvent) {
			this.inputId = oEvent.getSource().getId();
            
			var sUserUrl = "/eFormProductionAccts";
			var that = this;
			this.getOwnerComponent().getModel("oDataModel").read(sUserUrl, {

				success: function (data) {
					var data = {
						CARDHOLDERNAMES: data.results
					};
					var oCardHolderModel = new JSONModel();
					oCardHolderModel.setData(data)
					that._component.setModel(oCardHolderModel, "CardHolderModel1");
					if (!that._oDialog6) {
						that._oDialog6 = sap.ui.xmlfragment("com.sap.build.standard.governmentApp.fragments.User1_Dialog", that);
						that._oDialog6.setModel(that.getView().getModel("CardHolderModel1"));
						that.getView().addDependent(that._oDialog6);
					}
					that._oDialog6.setMultiSelect(false);
					that._oDialog6.open();
					that.handleSearch(undefined, "UserDialogId1");
				}
			});
		},
		onHandleConfirmLOB: function (oEvent) {
			var aContexts = oEvent.getParameter("selectedContexts");
			if (aContexts && aContexts.length) {
				//   MessageToast.show("You have chosen " + aContexts.map(function(oContext) {
				//     return oContext.getObject().LOB;
				//   }).join(", "));
				var value;
				aContexts.map(function (oContext) {
					value = oContext.getObject().LOB;
				});
			}
			var InputValue = sap.ui.getCore().byId(this.inputId);
			//this.getView().getModel("headerUserModel").setProperty("/LOB",value);
			InputValue.setValue(value);
		},
		onHandleConfirmSLOB: function (oEvent) {
			var aContexts = oEvent.getParameter("selectedContexts");
			if (aContexts && aContexts.length) {
				//  MessageToast.show("You have chosen " + aContexts.map(function(oContext) {
				//    return oContext.getObject().SLOB;
				//  }).join(", "));
				var value;
				var valueName;
				aContexts.map(function (oContext) {
					value = oContext.getObject().SLOB;

				});
			}
			var InputValue = sap.ui.getCore().byId(this.inputId);
			InputValue.setValue(value);
		},
		handleConfirm: function () {
			console.log("abc");
		},
		onHandleConfirmUser: function (oEvent) {
			var aContexts = oEvent.getParameter("selectedContexts");
			if (aContexts && aContexts.length) {
				MessageToast.show("You have chosen " + aContexts.map(function (oContext) {
					return oContext.getObject().NAME;
				}).join(", "));
				var value;
				var valueName;
				var valuenum;
				aContexts.map(function (oContext) {
					valueName = oContext.getObject().NAME;
					value = oContext.getObject().USERID;

				});
			}
			if (this.getView().byId("REQUESTER").getId() === this.inputId) {
				this.getView().byId("REQUESTER").setValue(valueName);
			}
			if (this.getView().byId("APPROVER").getId() === this.inputId) {
				this.getView().byId("APPROVER").setValue(valueName);
			}
			if (this.getView().byId("APPROVED_BY").getId() === this.inputId) {
				this.getView().byId("APPROVED_BY").setValue(valueName);
			}
			if (this.getView().byId("PREPARED_BY").getId() === this.inputId) {
				this.getView().byId("PREPARED_BY").setValue(valueName);
			}

			//this.getView().getModel("headerUserModel").setProperty("/CARDHOLDERNAME_KEY",value);
			//this.getView().getModel("headerUserModel").setProperty("/PHONE_NUM",valuenum);

		},
		getSLOValueHelp: function (oEvent) {
			var arr1 = [];
			arr1 = this.getView().getModel("LobUserSearchModel").getProperty("/eLobUserSet");
			var sSelectedLob = this.getView().getModel("headerUserModel").getProperty("/LOB");
			var arr2 = [];
			arr1.forEach(function (curr, index) {
				if (curr.LOB === sSelectedLob) {
					arr2.push({
						"SLOB": curr.SLOB,
						"SLOB_DESCRIPTION": curr.SLOB_DESCRIPTION
					});
				}
			});
			var oSLob = {};
			oSLob.SLOB = "";
			var FinalArray = [];
			for (var i = 0; i < arr2.length; i++) {
				var SLOB = arr2[i];
				FinalArray.push({
					"SLOB": SLOB
				});
			}
			var uniqueSLOB = [];
			jQuery.each(arr2, function (i, el) {
				if (jQuery.inArray(el, uniqueSLOB) === -1) uniqueSLOB.push(el);
			});
			this.getView().getModel("LobUserSearchModel").setProperty("/esLob", arr2);
			//var sLob = this.getView().byId("sLObMultiSelectId");
			this.getView().getModel("LobUserSearchModel").updateBindings(true);
			this.getView().getModel("LobUserSearchModel").refresh();
			this.getView().setModel("LobUserSearchModel");
		},
		handleLOBValueHelp: function (oEvent) {
			this.inputId = oEvent.getSource().getId();
			if (!this._oDialog2) {
				this._oDialog2 = sap.ui.xmlfragment("sony.pcard.reconciliation.appYPCardReconciliation.Fragments.LOB1_Dialog", this);
				this._oDialog2.setModel(this.getView().getModel("oldapproverModel"));
				this.getView().addDependent(this._oDialog2);
			}
			this._oDialog2.setMultiSelect(false);
			this._oDialog2.open();
			this.handleSearch(undefined, "LoBDialogId");
		},
		handleSLOBValueHelp: function (oEvent) {
			this.getSLOValueHelp(oEvent)
				// this.Slob = oEvent.getSource().getParent().getAggregation("cells")[2].getId();
			this.inputId = oEvent.getSource().getId();
			if (!this._oDialog3) {
				this._oDialog3 = sap.ui.xmlfragment("sony.pcard.reconciliation.appYPCardReconciliation.Fragments.SLOB1_Dialog", this);
				this._oDialog3.setModel(this.getView().getModel("oldapproverModel"));
				this.getView().addDependent(this._oDialog3);
			}
			this._oDialog3.setMultiSelect(false);
			this._oDialog3.open();
			this.handleSearch(undefined, "sLoBDialogId");
		},
		clear_fields: function () {
			this.getView().byId("EFORM_NUM").setValue("");
			this.getView().byId("TITLE").setValue("");
			this.getView().byId("APPROVED_BY").setValue("");
			this.getView().byId("APPROVER").setValue("");
			this.getView().byId("APPROVED_DT").setValue("");
			this.getView().byId("APPROVED_DT_TO").setValue("");
			this.getView().byId("REQUESTER").setValue("");
			this.getView().byId("PREPARED_BY").setValue("");

			this.getView().byId("STATUS").setValue("");

			this.getView().byId("SUBMITED_DT").setValue("");
			this.getView().byId("CREATED_DT").setValue("");
			this.getView().byId("SUBMITED_DT_TO").setValue("");
			this.getView().byId("CREATED_DT_TO").setValue("");
		},
		/*On click of Form Number.
		      Navigates to FinanceAprroverMaintanance Screen.*/
		handleLinkPress: function (oEvent) {
			this.onExit();
			this.clear_fields();
			var formNum = oEvent.getSource().getText();

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("GovernmentRevenueSearch", {
				context: formNum
			});
		},
		copy_eform: function (oEvent) {
			this.onExit();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var selected_item = this.getView().byId("eforms_tab").getSelectedItem();
			var eform_num = selected_item.mAggregations.cells[0].mProperties.text;
			if (eform_num !== "") {
				//this.clear_fields();
				oRouter.navTo('GovernmentRevenueCopy', {
					context: eform_num
				});
			}
		},

		// Format date value coming from back end.
		getDateValue: function (oValue) {
			if (oValue) {
				var value = oValue;
				var date = value.substr(6, 2);
				var month = value.substr(4, 2);
				var year = value.substr(0, 4);
				var finalDate = month + "/" + date + "/" + year;
				return finalDate;
			}
		},
		onCreate: function () {
			this.onExit();
			//this.clear_fields();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("GovernmentRevenue", {
				context: "Create"
			});
		},

		report_records: function (oEvent) {

			var model = this.getOwnerComponent().getModel("oDataModel");
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

			//     var lob = this.getView().byId("LOB").getValue();
			//    var sublob = this.getView().byId("SUBLOB").getValue();
			var prepared_by = this.getView().byId("PREPARED_BY").getValue();
			//   var cardholder = this.getView().byId("NAME").getValue();
			var status = this.getView().byId("STATUS").getValue();
			//    var amount11 = this.getView().byId("AMOUNT1").getValue();
			//    var amount1 = amount11.split(',').join('');

			var REQUESTER = this.getView().byId("REQUESTER").getValue();

			var relPath = "/sap/opu/odata/sap/YFPSFIPFRDD0029_GOVERN_EFORM_SRV/eGovermentHeaders?$filter=EFORM_NUM eq '" + eform_num +
				"' and TITLE eq '" + title +
				"' and APPROVED_BY eq '" + approved_by +
				"' and APPROVER eq '" + approver +
				"' and (APPROVED_DT ge '" + approved_dt +
				"' and APPROVED_DT le '" + approved_dt_to +
				"') and (REQUEST_DATE ge '" + created_dt +
				"' and REQUEST_DATE le '" + created_dt_to +

				"') and PREPARER eq '" + prepared_by +
				"' and ON_BEHALF_OF eq '" + REQUESTER +

				"' and STATUS eq '" + status +
				"' and (DATE_SUBMITTED ge '" + submited_dt +
				"' and DATE_SUBMITTED le '" + submited_dt_to +
				"')&$format=xlsx";

			var encodeUrl = encodeURI(relPath);
			sap.m.URLHelper.redirect(encodeUrl, true);

		},

		getDate: function (value) {
			var value1 = value.substr(0, 4);
			var value2 = value.substr(4, 2);
			var value3 = value.substr(6, 2);
			return (value2 + "/" + value3 + "/" + value1);
		},

		onSearchFormNumber: function () {
			var filters = [];
			var mainFilters = [];
			var model = this.getOwnerComponent().getModel("oDataModel");
			var eform_num = this.getView().byId("EFORM_NUM").getValue();
			var title = this.getView().byId("TITLE").getValue();
			var approved_by = this.getView().byId("APPROVED_BY").getValue();
			var approver = this.getView().byId("APPROVER").getValue();
			var approved_dt = this.getView().byId("APPROVED_DT").getValue();
			var approved_dt_to = this.getView().byId("APPROVED_DT_TO").getValue();

			var created_dt = this.getView().byId("CREATED_DT").getValue();
			var created_dt_to = this.getView().byId("CREATED_DT_TO").getValue();
			var REQUESTER = this.getView().byId("REQUESTER").getValue();
			var submited_dt = this.getView().byId("SUBMITED_DT").getValue();
			var submited_dt_to = this.getView().byId("SUBMITED_DT_TO").getValue();

			//        var lob = this.getView().byId("LOB").getValue();
			//        var sublob = this.getView().byId("SUBLOB").getValue();
			var prepared_by = this.getView().byId("PREPARED_BY").getValue();

			var status = this.getView().byId("STATUS").getValue();

			//        var cardNum = this.getView().byId("CARD_NUM").getValue();

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
			if (created_dt_to !== null) {
				var oFilter5 = new sap.ui.model.Filter(
					"REQUEST_DATE",
					sap.ui.model.FilterOperator.BT, created_dt, created_dt_to
				);
				myfilter.push(oFilter5);
			}
			if (approved_dt_to !== null) {

				var oFilter6 = new sap.ui.model.Filter(
					"APPROVED_DT",
					sap.ui.model.FilterOperator.BT, approved_dt, approved_dt_to
				);

				myfilter.push(oFilter6);
			}
			if (submited_dt_to !== null) {
				var oFilter7 = new sap.ui.model.Filter(
					"DATE_SUBMITTED",
					sap.ui.model.FilterOperator.BT, submited_dt, submited_dt_to
				);
				myfilter.push(oFilter7);
			}
			//        var oFilter8 = new sap.ui.model.Filter(
			//           "LOB",
			//           sap.ui.model.FilterOperator.EQ, lob
			//       );
			//       myfilter.push(oFilter8);
			//       var oFilter9 = new sap.ui.model.Filter(
			//          "SLOB",
			//          sap.ui.model.FilterOperator.EQ, sublob
			//      );
			//       myfilter.push(oFilter9);
			var oFilter10 = new sap.ui.model.Filter(
				"PREPARER",
				sap.ui.model.FilterOperator.EQ, prepared_by
			);
			myfilter.push(oFilter10);
			var oFilter11 = new sap.ui.model.Filter(
				"ON_BEHALF_OF",
				sap.ui.model.FilterOperator.EQ, REQUESTER
			);
			myfilter.push(oFilter11);
			var oFilter12 = new sap.ui.model.Filter(
				"STATUS",
				sap.ui.model.FilterOperator.EQ, status
			);
			myfilter.push(oFilter12);

			if (myfilter.length > 0) {

				this.loadOdataSearchModel(myfilter);
			} else {
				this.loadOdataSearchModel();
			}

		},
		loadOdataSearchModel: function (mainFilters) {
			var that = this;
			var sURL = "/eGovermentHeaders";
			if (mainFilters !== undefined) {
				if (mainFilters.length > 0) {
					//       this._serverModel.read(sURL, {
					this.getOwnerComponent().getModel("oDataModel").read(sURL, {
						filters: mainFilters,
						success: function (data) {
							var oData = data.results;
							that.arr1 = [];
							that.arr1 = oData;
							if (mainFilters) {
								that.getSearchFormModelData(oData);

							}
						},
						error: function (error) {

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

					}
				});
			}
		},

		getSearchFormModelData: function (oData) {
			var data = {
				eFormSearchHeaders: oData
			};

			var searchModel = new JSONModel();
			this._component.setModel(searchModel, "mainSearchModel");
			this._component.getModel("mainSearchModel").setData(data);
		},
		onExit: function () {

		}
	});
});