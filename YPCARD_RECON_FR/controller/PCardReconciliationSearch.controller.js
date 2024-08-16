sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sony/pcard/reconciliation/appYPCardReconciliation/model/ReconciliationSearchModel",
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, JSONModel, ReconciliationSearchModel, MessageToast, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("sony.pcard.reconciliation.appYPCardReconciliation.controller.PCardReconciliationSearch", {

		onInit: function () {
			var component = this.getOwnerComponent();
			this._component = this.getOwnerComponent();
			this._oView = this.getView();

			this.odataModel = this._component.getModel("odataModel");
			ReconciliationSearchModel.initialize(this.odataModel, this._component, this._oView);
			ReconciliationSearchModel.loadValuHelpConfig();
			var oViewSearchModel,
				oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oViewSearchModel = new JSONModel();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.attachRouteMatched(this._onObjectMatched, this);
			var view = this.getView();

		},
		_onObjectMatched: function () {
			//this.getView().byId("eforms_tab").destroyItems();
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
						//REQ0481487:NSONI3:GWDK902027:03/13/2020:User f4 search help:START
						var oUserNameFilter = new Filter("UserName", FilterOperator.Contains, sQuery);
						var	oUserIdFilter = new Filter("UserId", FilterOperator.Contains, sQuery);
						aFilter.push(new Filter([oUserNameFilter, oUserIdFilter], false));
						// aFilter.push(new Filter("UserName", FilterOperator.Contains, sQuery));
						//REQ0481487:NSONI3:GWDK902027:03/13/2020:User f4 search help:END
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
					aFilter.push(new Filter("UserName", FilterOperator.Contains, sQuery));
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

			if (!this._oDialog4) {
				this._oDialog4 = sap.ui.xmlfragment("sony.pcard.reconciliation.appYPCardReconciliation.Fragments.User1_Dialog", this);
				this._oDialog4.setModel(this.getView().getModel("oldapproverModel"));
				this.getView().addDependent(this._oDialog4);
			}
			this._oDialog4.setMultiSelect(false);
			this._oDialog4.open();
			this.handleSearch(undefined, "UserDialogId");
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
			//REQ0730972:DPATEL11:FPDK900050:22/12/2021:Enhance Fiori Eforms to showLOB/SubLOB Name with Description:START
			this.getView().getModel("headerUserModel").setProperty("/LOB",value);
			//REQ0730972:DPATEL11:FPDK900050:22/12/2021:Enhance Fiori Eforms to showLOB/SubLOB Name with Description:END
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
					return oContext.getObject().UserName;
				}).join(", "));
				var value;
				var valueName;
				var valuenum;
				aContexts.map(function (oContext) {
					valueName = oContext.getObject().UserName;
					value = oContext.getObject().UserId;
					valuenum = oContext.getObject().UserNum;
				});
			}
			if (this.getView().byId("NAME").getId() === this.inputId) {
				this.getView().byId("NAME").setValue(valueName);
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
			//REQ0730972:DPATEL11:FPDK900050:22/12/2021:Enhance Fiori Eforms to showLOB/SubLOB Name with Description:START
			//var sSelectedLob = sap.ui.getCore().byId(this.inputId).getValue();
			var sSelectedLob = this.getView().getModel("headerUserModel").getProperty("/LOB");
			//REQ0730972:DPATEL11:FPDK900050:22/12/2021:Enhance Fiori Eforms to showLOB/SubLOB Name with Description:END
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
			this.getSLOValueHelp(oEvent);
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
			this.getView().byId("LOB").setValue("");
			this.getView().byId("SUBLOB").setValue("");
			this.getView().byId("PREPARED_BY").setValue("");
			this.getView().byId("NAME").setValue("");
			this.getView().byId("STATUS").setValue("");
			this.getView().byId("AMOUNT1").setValue("");
			//amount11.split(',').join('');
			// var amount22 = this.getView().byId("AMOUNT2").setValue("");
			//var amount2 = amount22.split(',').join('');
			this.getView().byId("CARD_NUM").setValue("");
			this.getView().byId("SUBMITED_DT").setValue("");
			this.getView().byId("CREATED_DT").setValue("");
			this.getView().byId("SUBMITED_DT_TO").setValue("");
			this.getView().byId("CREATED_DT_TO").setValue("");
		},
		/*On click of Form Number.
		      Navigates to FinanceAprroverMaintanance Screen.*/
		handleLinkPress: function (oEvent) {
			this.onExit();
			//  this.clear_fields();
			var formNum = oEvent.getSource().getText();

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("PCardReconciliationSerachPage", {
				context: formNum
			});
		},
		copy_eform: function (oEvent) {
			this.onExit();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var selected_item = this.getView().byId("eforms_tab").getSelectedItem();
			var eform_num = selected_item.mAggregations.cells[0].mProperties.text;
			if (eform_num !== "") {
				// this.clear_fields();
				oRouter.navTo('PCardReconciliationCopy', {
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
			oRouter.navTo("PCardReconciliation");
		},

		report_records: function (oEvent) {

			var model = this.getOwnerComponent().getModel();
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
			var cardholder = this.getView().byId("NAME").getValue();
			var status = this.getView().byId("STATUS").getValue();
			var amount11 = this.getView().byId("AMOUNT1").getValue();
			var amount1 = amount11.split(',').join('');

			var cardNum = this.getView().byId("CARD_NUM").getValue();

			var relPath = "/sap/opu/odata/sap/YFPSFIPFRDD0020_PCARDREC_EFROM_SRV/ReconciliationHeaders?$filter=EFORM_NUM eq '" + eform_num +
				"' and TITLE eq '" + title +
				"' and APPROVED_BY eq '" + approved_by +
				"' and APPROVER eq '" + approver +
				"' and (APPROVED_DT ge '" + approved_dt +
				"' and APPROVED_DT le '" + approved_dt_to +
				"') and (REQUEST_DATE ge '" + created_dt +
				"' and  REQUEST_DATE le '" + created_dt_to +
				"') and SLOB eq '" + sublob +
				"' and LOB eq '" + lob +
				"' and PREPARER eq '" + prepared_by +
				"' and CARD_HOLDER_NAME eq '" + cardholder +
				"' and CARD_NUMBER eq '" + cardNum +
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
			var model = this.getOwnerComponent().getModel();
			var eform_num = this.getView().byId("EFORM_NUM").getValue();
			var title = this.getView().byId("TITLE").getValue();
			var approved_by = this.getView().byId("APPROVED_BY").getValue();
			var approver = this.getView().byId("APPROVER").getValue();
			var approved_dt = this.getView().byId("APPROVED_DT").getValue();
			var approved_dt_to = this.getView().byId("APPROVED_DT_TO").getValue();
			//          if(approved_dt && approved_dt_to){
			//    var oFromMonth = (approved_dt.getUTCMonth()+1).toString();
			//    if(oFromMonth.length === 1){
			//    	oFromMonth = "0" + oFromMonth;
			//    }
			//    var oToMonth = (approved_dt_to.getUTCMonth()+1).toString();
			//    if(oToMonth.length === 1){
			//    	oToMonth = "0" + oToMonth;
			//    }
			//     var oToDate = (approved_dt_to.getUTCDate()+1).toString();
			//    if(oToDate.length === 1){
			//    	oToDate = "0" + oToDate;
			//    }
			//     var oFromDate = (approved_dt.getUTCDate()+1).toString();
			//    if(oFromDate.length === 1){
			//     	oFromDate = "0" + oFromDate;
			//     }
			//     var toDate1 = oToMonth + "/" + oToDate + "/" + approved_dt_to.getUTCFullYear().toString();
			//    var fromDate1 =  oFromMonth + "/" + oFromDate + "/" + approved_dt.getUTCFullYear().toString();
			//           }

			var created_dt = this.getView().byId("CREATED_DT").getValue();
			var created_dt_to = this.getView().byId("CREATED_DT_TO").getValue();
			//          if(created_dt && created_dt_to){
			//     var oFromMonth = (created_dt.getUTCMonth()+1).toString();
			//     if(oFromMonth.length === 1){
			//     	oFromMonth = "0" + oFromMonth;
			//     }
			//     var oToMonth = (created_dt_to.getUTCMonth()+1).toString();
			//     if(oToMonth.length === 1){
			//     	oToMonth = "0" + oToMonth;
			//     }
			//      var oToDate = (created_dt_to.getUTCDate()+1).toString();
			//     if(oToDate.length === 1){
			//     	oToDate = "0" + oToDate;
			//     }
			//      var oFromDate = (created_dt.getUTCDate()+1).toString();
			//     if(oFromDate.length === 1){
			//     	oFromDate = "0" + oFromDate;
			//     }
			//    var  toCreated = created_dt_to.getUTCFullYear().toString() + oToMonth + oToDate ;
			//      var fromCreated =  created_dt.getUTCFullYear().toString()+ oFromMonth +  oFromDate;
			//          }
			var submited_dt = this.getView().byId("SUBMITED_DT").getValue();
			var submited_dt_to = this.getView().byId("SUBMITED_DT_TO").getValue();
			//           if(submited_dt && submited_dt_to){
			//      var oFromMonth = (submited_dt.getUTCMonth()+1).toString();
			//      if(oFromMonth.length === 1){
			//      	oFromMonth = "0" + oFromMonth;
			//      }
			//      var oToMonth = (submited_dt_to.getUTCMonth()+1).toString();
			//      if(oToMonth.length === 1){
			//      	oToMonth = "0" + oToMonth;
			//      }
			//       var oToDate = (submited_dt_to.getUTCDate()+1).toString();
			//      if(oToDate.length === 1){
			//      	oToDate = "0" + oToDate;
			//      }
			//       var oFromDate = (submited_dt.getUTCDate()+1).toString();
			//      if(oFromDate.length === 1){
			//      	oFromDate = "0" + oFromDate;
			//      }

			//        var toDate  =   oToMonth  +"/" +  oToDate+ "/" +submited_dt_to.getUTCFullYear().toString();
			//       var fromDate  =  oFromMonth +"/" +   oFromDate +"/" +  submited_dt.getUTCFullYear().toString() ;
			//           }
			var lob = this.getView().byId("LOB").getValue();
			var sublob = this.getView().byId("SUBLOB").getValue();
			var prepared_by = this.getView().byId("PREPARED_BY").getValue();
			var cardholder = this.getView().byId("NAME").getValue();
			var status = this.getView().byId("STATUS").getValue();
			var amount11 = this.getView().byId("AMOUNT1").getValue();
			var amount1 = amount11.split(',').join('');
			// var amount22 = this.getView().byId("AMOUNT2").getValue();
			//var amount2 = amount22.split(',').join('');
			var cardNum = this.getView().byId("CARD_NUM").getValue();

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
			var oFilter8 = new sap.ui.model.Filter(
				"LOB",
				sap.ui.model.FilterOperator.EQ, lob
			);
			myfilter.push(oFilter8);
			var oFilter9 = new sap.ui.model.Filter(
				"SLOB",
				sap.ui.model.FilterOperator.EQ, sublob
			);
			myfilter.push(oFilter9);
			var oFilter10 = new sap.ui.model.Filter(
				"PREPARER",
				sap.ui.model.FilterOperator.EQ, prepared_by
			);
			myfilter.push(oFilter10);
			var oFilter11 = new sap.ui.model.Filter(
				"CARD_HOLDER_NAME",
				sap.ui.model.FilterOperator.EQ, cardholder
			);
			myfilter.push(oFilter11);
			var oFilter12 = new sap.ui.model.Filter(
				"STATUS",
				sap.ui.model.FilterOperator.EQ, status
			);
			myfilter.push(oFilter12);
			var oFilter13 = new sap.ui.model.Filter(
				"BILLED_AMOUNT",
				sap.ui.model.FilterOperator.BT, amount1, amount1
			);
			myfilter.push(oFilter13);
			var oFilter14 = new sap.ui.model.Filter(
				"CARD_NUMBER",
				sap.ui.model.FilterOperator.EQ, cardNum
			);
			myfilter.push(oFilter14);
			if (myfilter.length > 0) {

				ReconciliationSearchModel.loadOdataSearchModel(myfilter);
			} else {
				ReconciliationSearchModel.loadOdataSearchModel();
			}

		},
		onExit: function () {

		}
	});
});