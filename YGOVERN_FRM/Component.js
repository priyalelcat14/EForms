sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"com/sap/build/standard/governmentApp/model/models"
], function (UIComponent, Device, models) {
	"use strict";

	var navigationWithContext = {

	};

	return UIComponent.extend("com.sap.build.standard.governmentApp.Component", {

		metadata: {
			manifest: "json"
		},

		init: function () {
			this.count = 0;
			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			// set the FLP model
			this.setModel(models.createFLPModel(), "FLP");

			// set the dataSource model
			this.setModel(new sap.ui.model.json.JSONModel({}), "dataSource");

			if (this.getModel("itemUserModel") === undefined) {
				this.setModel(new sap.ui.model.json.JSONModel(), "itemUserModel");
			}
			if (this.getModel("itemUserModel1") === undefined) {
				this.setModel(new sap.ui.model.json.JSONModel(), "itemUserModel1");
			}
			if (this.getModel("itemUserMode2") === undefined) {
				this.setModel(new sap.ui.model.json.JSONModel(), "itemUserModel2");
			}

			UIComponent.prototype.init.apply(this, arguments);

			this.getRouter().initialize();
		},
		getOkConfirm: function (action) {

			if (action === "ok") {
				this.count = 1;
			}
			return this.count;
		},

		getItemData: function () {
			var itemData = {
				EFORM_NUM: "",

				RECIPIENT_ID: "",
				RECIPIENT_TITLE: "",
				RECI_BUSSI: "",
				ORG_BUSSI: "",
				RECIPIENT_ADDRESS: "",
				REC_CITY: "",
				REC_STATE: "",
				REC_POSTAL_CODE: "",
				REC_COUNTRY: "",
				IS_REL_IND: "",
				IS_REL_GOV: "",
				RECIPIENT_ORG: "",
				ORG_TYPE: "",
				ORG_ADDRESS: "",
				CITY: "",
				ORG_STATE: "",
				ORG_POSTAL_CODE: "",
				ORG_COUNTRY: "",
				EXP_TYPE: "",
				EXP_SUBCAT: "",
				EXP_DES: "",
				PAYMENT_METHOD: "",
				IS_EXPENSE: "",
				DATE_OF_EXP: "",
				REQ_AMT_EXP: "",
				AMOUNT_DONATION_USD: "",
				COMPANY_CODE: "",
				GEN_LEDGER_AREA: "",
				GEN_LEDGER: "",
				LOCALCURRENCY: "USD",
				VALSTATORGNAME: "None",
				VALSTATORGTYPE: "None",
				VALSTATORGADDR: "None",
				VALSTATORGCOUNTRY: "None",
				VALSTATORGSTATE: "None",
				VALSTATORGCITY: "None",
				ReciLNameVStat: "None",
				ReciFNameVStat: "None",
				ReciTitleVStat: "None",
				ReciBussiVStat: "None",
				OrgBussiVStat: "None",
				ReciStateVStat: "None",
				ReciCountryVStat: "None",
				ReciRelVStat: "None",
				ExpTypeVStat: "None",
				ExpSubCatVStat: "None",
				ExpDesVStat: "None",
				ExpPayMethodVStat: "None",
				ExpIsHolVStat: "None",
				ExpIsTravelVStat: "None",
				ExpTravelExpenseVStat: "None",
				OthTravelVStat: "None",
				TravelOriginVStat: "None",
				TravelDestVStat: "None",
				HotelNameVStat: "None",
				HotelCityVStat: "None",
				ExpDateVStat: "None",
				ReqAmtVStat: "None",
				ExpComCodeVStat: "None",
				ExpGLAreaVStat: "None",
				ExpGLVStat: "None",
				localcurrency: [{
					name: "",
					exch: ""
				}],
				jusficationVisibleform_Justification1: false,
				jusficationVisibleform_Justification2: false,
				jusficationVisibleform_Justification3: false,
				SummaryTotals_Value1: "$0.00 USD",
				SummaryTotals_Value2: "$0.00 USD",
				SummaryTotals_Value3: "$0.00 USD",
				SummaryTotals_Value4: "$0.00 USD",
				SummaryTotals_Value5: "$0.00 USD",
				SummaryTotals_Value6: "$0.00 USD",
				SummaryTotals_Value7: "$0.00 USD"
			};

		},
		createContent: function () {
			var app = new sap.m.App({
				id: "GovernmentAppRoute" //update id to remove conflit of same id "App" in GWD by nsoni
			});
			var appType = "App";
			var appBackgroundColor = "#FFFFFF";
			if (appType === "App" && appBackgroundColor) {
				app.setBackgroundColor(appBackgroundColor);
			}

			return app;
		},

		getNavigationPropertyForNavigationWithContext: function (sEntityNameSet, targetPageName) {
			var entityNavigations = navigationWithContext[sEntityNameSet];
			return entityNavigations == null ? null : entityNavigations[targetPageName];
		}
	});

});