sap.ui.define([
	"sony/finance/maintaince/app/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sony/finance/maintaince/app/model/models",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function (BaseController, JSONModel, FinanceApproverModel, Filter, FilterOperator, MessageToast, MessageBox) {
	"use strict";
	var that = this;
	return BaseController.extend("sony.finance.maintaince.app.controller.SearchPage", {
		onInit: function () {
			var component = this.getOwnerComponent();
			var oViewSearchModel,
				oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oViewSearchModel = new JSONModel();
			component.setModel(oViewSearchModel, "mainSearchModel");

			oRouter.attachRouteMatched(this._onObjectMatched, this);
			var view = this.getView();
			FinanceApproverModel.initialize(
				component.getModel("odataModel"),
				component, view);
		},
		_onObjectMatched: function () {
			FinanceApproverModel.loadOdataSearchModel();
		},
		/*On click of Form Number.
		Navigates to FinanceAprroverMaintanance Screen.*/
		handleLinkPress: function (oEvent) {
			//FinanceApproverModel.destroy();
			var formNum = oEvent.getSource().getText();
			var stitle = oEvent.getSource().getParent().getAggregation("cells")[1].getProperty("text");
			var sDescription = oEvent.getSource().getParent().getAggregation("cells")[1].getProperty("text");
			this.getOwnerComponent().getModel("headerUserModel").setProperty("/title", stitle);
			this.getOwnerComponent().getModel("headerUserModel").setProperty("/Description", sDescription);
			var sPath = oEvent.getSource().getParent().getBindingContextPath();
			var oFormInfo = this.getOwnerComponent().getModel("mainSearchModel").getProperty(sPath);
			this.getOwnerComponent().getModel("headerUserModel").setProperty("/Status", oFormInfo.STATUS);
			this.getOwnerComponent().setModel(new JSONModel(oFormInfo), "selFormDataSet");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("FinanceMaintagePageSearch", {
				value: formNum
			});
		},
		// Format date value coming from back end.
		getDateValue: function (oValue) {
			var value = oValue;
			var date = value.substr(6, 2);
			var month = value.substr(4, 2);
			var year = value.substr(0, 4);
			var finalDate = month + "/" + date + "/" + year;
			return finalDate;
		},
		onCreate: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("FinanceMaintagePage");
		},
		onSearchFormNumber: function () {
			var filters = [];
			var mainFilters = [];
			//var aUserFilter1 = [];
			//var oTempUsr = [];
			// var oLobTempFilter = [];
			// var oSLOBTemp = [];
			var aTitle = this.getView().byId("idTitle").getValue().toUpperCase();
			if (aTitle) {
				var oTitle = new Filter("TITLE_2", FilterOperator.Contains, aTitle);
				filters.push(oTitle);
			}
			var aFormId = this.getView().byId("idFormNum").getValue().toUpperCase();
			if (aFormId) {
				var oFormId = new Filter("CHANGE_ID", FilterOperator.Contains, aFormId);
				// var aFormIdFilter = [];
				filters.push(oFormId);
			}
			var fromDateId = this.getView().byId("searchDateRangeId").getDateValue();
			var toDateId = this.getView().byId("searchDateRangeId").getSecondDateValue();
			if (fromDateId && toDateId) {
				var oFromMonth = (fromDateId.getUTCMonth() + 1).toString();
				if (oFromMonth.length === 1) {
					oFromMonth = "0" + oFromMonth;
				}
				var oToMonth = (toDateId.getUTCMonth() + 1).toString();
				if (oToMonth.length === 1) {
					oToMonth = "0" + oToMonth;
				}
				var oToDate = (toDateId.getUTCDate() + 1).toString();
				if (oToDate.length === 1) {
					oToDate = "0" + oToDate;
				}
				var oFromDate = (fromDateId.getUTCDate() + 1).toString();
				if (oFromDate.length === 1) {
					oFromDate = "0" + oFromDate;
				}
				var stoDate = toDateId.getUTCFullYear().toString() + oToMonth + oToDate;
				var sfromDate = fromDateId.getUTCFullYear().toString() + oFromMonth + oFromDate;
				var oDate = new Filter("CREATION_DATE", FilterOperator.BT, sfromDate, stoDate);
				// var aFormIdFilter = [];
				filters.push(oDate);
			}
			if (filters.length > 0) {
				mainFilters.push(new Filter({
					filters: filters,
					and: true
				}));
				FinanceApproverModel.loadOdataSearchModel(mainFilters);
			} else {
				FinanceApproverModel.loadOdataSearchModel();
			}

		},

		onClear: function (oEvent) {
			this.getView().byId("idTitle").setValue("");
			this.getView().byId("idFormNum").setValue("");
			this.getView().byId("searchDateRangeId").setValue("");
			FinanceApproverModel.loadOdataSearchModel();
		}
	});
});