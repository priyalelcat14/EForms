sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel"
], function (BaseController, MessageBox, Utilities, History, JSONModel) {
	"use strict";
	var compCode;
	return BaseController.extend("com.sap.build.standard.governmentApp.controller.Expense", {
		onInit: function () {
			this.mBindingOptions = {};
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);

			this.getOwnerComponent().setModel(new JSONModel(), "ExpenseTypeModel")
			this.oRouter.attachRouteMatched(this._onObjectMatched, this);
		},
		currencyCalculation: function (oEvent) {
			var exprnseType = this.getView().byId("ExpTypeId").getValue();
			var loccurrency = this.getView().byId("CurrId").getValue();
			var total_Inp = this.getView().byId("amtId").getValue();
			var obj = {};
			obj.obj1 = this.getOwnerComponent().getModel("itemUserModel").getProperty("/EXP_TYPE");
			obj.obj17 = this.getOwnerComponent().getModel("itemUserModel").getProperty("/EXP_SUBCAT");
			if (obj.obj17 === undefined) {
				obj.obj17 = "";
			}
			var total_Inp1 = total_Inp.split(',').join('');
			var s = {};
			s.EXCH = String(total_Inp1).split(",").join();
			s.NAME = loccurrency;
			var model = this.getOwnerComponent().getModel("oDataModel");
			var that = this;
			model.create("/eFormLocCurrencys", s, { //POST call to OData with reportheader JSON object
				async: true,
				success: function (oData, response) {
					var temp = new Intl.NumberFormat('en-US').format(oData.EXCH);
					that.getView().getModel("itemUserModel").setProperty("/AMOUNT_DONATION_USD", temp);
					that.getView().getModel("repTableModel").setProperty("/" + that.bindingContext + "/Expense/REQ_AMT_EXP_USD", temp);
					if (exprnseType === "Promotional & Marketing Expense") {
						that.getView().getModel("repTableModel").setProperty("/" + that.bindingContext + "/Expense/Amount1", temp);
						that.getOwnerComponent().getModel("repTableModel").setProperty("/" + that.bindingContext + "/Expense/title", obj.obj1 + "- " +
							obj.obj17 + "(" + temp + ")");
					} else {
						that.getView().getModel("repTableModel").setProperty("/" + that.bindingContext + "/Expense/Amount1", "");
					}
					if (exprnseType === "Entertainment") {
						that.getView().getModel("repTableModel").setProperty("/" + that.bindingContext + "/Expense/Amount2", temp);
						that.getOwnerComponent().getModel("repTableModel").setProperty("/" + that.bindingContext + "/Expense/title", obj.obj1 + "- " +
							obj.obj17 + "(" + temp + ")");
					} else {
						that.getView().getModel("repTableModel").setProperty("/" + that.bindingContext + "/Expense/Amount2", "");
					}
					if (exprnseType === "Company Logo Gifts") {
						that.getView().getModel("repTableModel").setProperty("/" + that.bindingContext + "/Expense/Amount3", temp);
						that.getOwnerComponent().getModel("repTableModel").setProperty("/" + that.bindingContext + "/Expense/title", obj.obj1 + "- " +
							obj.obj17 + "(" + temp + ")");
					} else {
						that.getView().getModel("repTableModel").setProperty("/" + that.bindingContext + "/Expense/Amount3", "");
					}
					if (exprnseType === "Non Company Logo Gifts") {
						that.getView().getModel("repTableModel").setProperty("/" + that.bindingContext + "/Expense/Amount4", temp);
						that.getOwnerComponent().getModel("repTableModel").setProperty("/" + that.bindingContext + "/Expense/title", obj.obj1 + "- " +
							obj.obj17 + "(" + temp + ")");
					} else {
						that.getView().getModel("repTableModel").setProperty("/" + that.bindingContext + "/Expense/Amount4", "");
					}
					if (exprnseType === "Payment authorized by written local law") {
						that.getView().getModel("repTableModel").setProperty("/" + that.bindingContext + "/Expense/Amount5", temp);
						that.getOwnerComponent().getModel("repTableModel").setProperty("/" + that.bindingContext + "/Expense/title", obj.obj1 + "- " +
							obj.obj17 + "(" + temp + ")");
					} else {
						that.getView().getModel("repTableModel").setProperty("/" + that.bindingContext + "/Expense/Amount5", "");
					}
					if (exprnseType === "Emergency facilitating payment") {
						that.getView().getModel("repTableModel").setProperty("/" + that.bindingContext + "/Expense/Amount6", temp);
						that.getOwnerComponent().getModel("repTableModel").setProperty("/" + that.bindingContext + "/Expense/title", obj.obj1 + "- " +
							obj.obj17 + "(" + temp + ")");
					} else {
						that.getView().getModel("repTableModel").setProperty("/" + that.bindingContext + "/Expense/Amount6", "");
					}
					that.getView().getModel("itemUserModel").setData({});
					if (that.Form_Num && that.action !== "copy") {
						if (that.getOwnerComponent().getModel("headerUserModel").getProperty("/isData") === true) {
							that.oRouter.navTo('GovernmentRevenue', {
								context: "Expenditure"
							});
						} else {
							that.oRouter.navTo("GovernmentRevenueSearch", {
								context: that.Form_Num
							});
						}
					} else if (that.getOwnerComponent().getModel("headerUserModel").getProperty("/action") === "copy") {
						that.oRouter.navTo("GovernmentRevenueCopy", {
							context: that.Form_Num
						});
					} else {
						that.oRouter.navTo('GovernmentRevenue', {
							context: "Expenditure"
						});
					}
				},
				error: function (oError) {
					var response = JSON.parse(oError.responseText);
					MessageBox.show(
						response.error.message.value,
						MessageBox.Icon.ERROR,
						"Error"
					);
				}
			});
		},
		onExpRadio1: function () {
			var oSelected = this.getView().byId("holId").getSelectedButton().getProperty("text");
			if (oSelected === "Yes") {
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/IS_Expense", "Yes");
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/is_exp_index", 0);
			} else {
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/IS_Expense", "No");
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/is_exp_index", 1);
			}
		},

		onChangeComboBox: function (oEvent) {
			var newval = oEvent.getParameter("newValue");
			var key = oEvent.getSource().getSelectedItem();

			if (newval !== "" && key === null) {
				oEvent.getSource().setValue("");

			}
		},

		getRadioValues: function () {
			if (this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext + "/Expense/IS_TRAVEL") === "Yes") {
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/is_hol_index", 0);
			} else if (this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext + "/Expense/IS_TRAVEL") ===
				"No") {
				this.getOwnerComponent().getModel("itemUserModel").setProperty("is_hol_index", 1);
			} else {
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/is_hol_index", -1);
			}
			if (this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext + "/Expense/IS_Expense") === "Yes") {
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/is_exp_index", 0);
			} else if (this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext + "/Expense/IS_Expense") ===
				"No") {
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/is_exp_index", 1);
			} else {
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/is_exp_index", -1)
			}
		},
		_onObjectMatched: function (oEvent) {
			if (oEvent.getParameters().name === "ExpensePage") {
				this.getOwnerComponent().getModel("repTableModel").setProperty("/isEditedItems_EXP", true);
				this.Form_Num = this.getOwnerComponent().getModel("headerUserModel").getProperty("/FORM_NUM");
				var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
				if (!this.Form_Num) {
					this.Form_Num = "";
				}
				var sText = oBundle.getText("Title", [this.Form_Num]);
				this.getView().byId("pageTitleId_Exp").setTitle(sText);
				if (this.getOwnerComponent().getModel("headerUserModel").getProperty("/action") === "copy") {
					var sText = oBundle.getText("Title", [""]);
					this.getView().byId("pageTitleId_Exp").setTitle(sText);
				}
				this.action = this.getOwnerComponent().getModel("headerUserModel").getProperty("/action");
				this.getOwnerComponent().getItemData();
				this.bindingContext = oEvent.getParameter("arguments").context;
				if (this.getOwnerComponent().getModel("repTableModel") === undefined) {
					this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(), "repTableModel");
				}
				if (this.bindingContext !== undefined && this.bindingContext !== "Expenditure" && this.bindingContext !== "Recipient" && this.bindingContext !==
					"Organisation" && this.bindingContext !== this.Form_Num) {
					var itemData = {
						EXP_TYPE: this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext + "/Expense/EXP_TYPE"),
						EXP_SUBCAT: this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext + "/Expense/EXP_SUBCAT"),
						EXP_DES: this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext + "/Expense/EXP_DES"),
						PAYMENT_METHOD: this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext +
							"/Expense/PAYMENT_METHOD"),
						IS_Expense: this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext + "/Expense/IS_Expense"),
						DATE_OF_EXP: this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext + "/Expense/DATE_OF_EXP"),
						REQ_AMT_EXP: this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext + "/Expense/REQ_AMT_EXP"),
						COMPANY_CODE: this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext +
							"/Expense/COMPANY_CODE"),
						GEN_LEDGER_AREA: this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext +
							"/Expense/GEN_LEDGER_AREA"),
						GEN_LEDGER: this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext + "/Expense/GEN_LEDGER"),
						LOCALCURRENCY: this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext +
							"/Expense/LOCALCURRENCY"),
						IS_HOL: this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext + "/Expense/IS_HOL"),
						//        IS_EXP: this.getOwnerComponent().getModel("repTableModel").getProperty("/"+this.bindingContext +"/Expense/IS_EXP"),
						IS_TRAVEL: this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext + "/Expense/IS_TRAVEL"),
						TRAVEL_EXPENSE: this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext +
							"/Expense/TRAVEL_EXPENSE"),
						OTHERTRAVEL_EXP: this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext +
							"/Expense/OTHERTRAVEL_EXP"),
						TravelOrgin_EXP: this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext +
							"/Expense/TravelOrgin_EXP"),
						TravelDest_EXP: this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext +
							"/Expense/TravelDest_EXP"),
						HotelName_EXP: this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext +
							"/Expense/HotelName_EXP"),
						HotelCity_EXP: this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext +
							"/Expense/HotelCity_EXP"),
						SummaryTotals_Value1: this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext +
							"/Expense/SummaryTotals_Value1"),
						SummaryTotals_Value2: this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext +
							"/Expense/SummaryTotals_Value2"),
						SummaryTotals_Value3: this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext +
							"/Expense/SummaryTotals_Value3"),
						SummaryTotals_Value4: this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext +
							"/Expense/SummaryTotals_Value4"),
						SummaryTotals_Value5: this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext +
							"/Expense/SummaryTotals_Value5"),
						SummaryTotals_Value6: this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext +
							"/Expense/SummaryTotals_Value6"),
						SummaryTotals_Value7: this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext +
							"/Expense/SummaryTotals_Value7")
					}
					this.getView().getModel("itemUserModel").setData(itemData);
					this.handleSummaryTotal();
					this.getRadioValues();
					this.bindingCurrency();
					this.handleExpenseSubCat();
					var oCurrency = this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext +
						"/Expense/LOCALCURRENCY")
					if (oCurrency === "KRW") {
						this.getView().byId("ExpWarnId").setVisible(true);
					} else {
						this.getView().byId("ExpWarnId").setVisible(false);
					}
					if (this.getOwnerComponent().getModel("itemUserModel").getProperty("/TRAVEL_EXPENSE") === "Airfare") {
						this.getView().byId("AirfareId1").setVisible(true);
						this.getView().byId("AirfareId2").setVisible(true);
						this.getView().byId("HotelId1").setVisible(false);
						this.getView().byId("HotelId2").setVisible(false);
						this.getView().byId("OtherId").setVisible(false);
					} else if (this.getOwnerComponent().getModel("itemUserModel").getProperty("/TRAVEL_EXPENSE") === "Transportation") {
						this.getView().byId("AirfareId1").setVisible(true);
						this.getView().byId("AirfareId2").setVisible(true);
						this.getView().byId("HotelId1").setVisible(false);
						this.getView().byId("HotelId2").setVisible(false);
						this.getView().byId("OtherId").setVisible(false);
					} else if (this.getOwnerComponent().getModel("itemUserModel").getProperty("/TRAVEL_EXPENSE") === "Hotel") {
						this.getView().byId("AirfareId1").setVisible(false);
						this.getView().byId("AirfareId2").setVisible(false);
						this.getView().byId("HotelId1").setVisible(true);
						this.getView().byId("HotelId2").setVisible(true);
						this.getView().byId("OtherId").setVisible(false);
					} else if (this.getOwnerComponent().getModel("itemUserModel").getProperty("/TRAVEL_EXPENSE") === "Other") {
						this.getView().byId("AirfareId1").setVisible(false);
						this.getView().byId("AirfareId2").setVisible(false);
						this.getView().byId("HotelId1").setVisible(false);
						this.getView().byId("HotelId2").setVisible(false);
						this.getView().byId("OtherId").setVisible(true);
					}
					//  var oSelected1 = this.getOwnerComponent().getModel("repTableModel").getProperty("/"+this.bindingContext +"/Expense/IS_HOL");
					var oSelected1 = this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext + "/Expense/IS_Expense");
					if (oSelected1 === "Yes") {
						this.getOwnerComponent().getModel("itemUserModel").setProperty("/IS_Expense", "Yes");
						this.getOwnerComponent().getModel("itemUserModel").setProperty("/is_exp_index", 0);
					} else {
						this.getOwnerComponent().getModel("itemUserModel").setProperty("/IS_Expense", "No");
						this.getOwnerComponent().getModel("itemUserModel").setProperty("/is_exp_index", 1);
					}
					this.handlePaymentMethod();
					// var oSelected = this.getOwnerComponent().getModel("repTableModel").getProperty("/"+this.bindingContext +"/Expense/IS_EXPENSE");
					var oSelected = this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext + "/Expense/IS_TRAVEL");
					if (oSelected === "Yes") {
						this.getView().byId("travRelId").setVisible(true);
						this.getOwnerComponent().getModel("itemUserModel").setProperty("/IS_TRAVEL", "Yes");
						this.getOwnerComponent().getModel("itemUserModel").setProperty("/is_hol_index", 0);
					} else {
						this.getView().byId("travRelId").setVisible(false);
						this.getOwnerComponent().getModel("itemUserModel").setProperty("/IS_TRAVEL", "No");
						this.getOwnerComponent().getModel("itemUserModel").setProperty("/is_hol_index", 1);
					}
					this.getView().getModel("itemUserModel").updateBindings(true);
					this.getView().getModel("itemUserModel").refresh();
				}
			}
		},
		onCurrencySelection: function () {
			var oCurrency = this.getView().byId("CurrId").getValue();
			if (oCurrency === "KRW") {
				this.getView().byId("ExpWarnId").setVisible(true);
			} else {
				this.getView().byId("ExpWarnId").setVisible(false);
			}
			// this.convertCurrency();
		},
		convertCurrency: function () {
			var total_Inp = this.getView().byId("amtId").getValue();
			var loccurrency = this.getView().byId("CurrId").getValue();
			var total_Inp1 = total_Inp.split(',').join('');
			var s = {};
			s.EXCH = String(total_Inp1).replace(",", "");
			s.NAME = loccurrency;
			var model = this.getOwnerComponent().getModel("oDataModel");
			var that = this;
			model.create("/eFormLocCurrencys", s, { //POST call to OData with reportheader JSON object
				async: true,
				success: function (oData, response) {
					var temp = new Intl.NumberFormat('en-US').format(oData.EXCH);
					that.getView().getModel("itemUserModel").setProperty("/AMOUNT_DONATION_USD", temp);
					//     that.getView().byId("AMOUNT_DONATION_USD").setText(temp);
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
		bindingCurrency: function () {
			var oHeaderModel = this.getOwnerComponent().getModel("headerUserModel");
			var oCountry = oHeaderModel.getProperty("/REC_COUNTRY");
			var oModel = this.getOwnerComponent().getModel("oDataModel");
			var that = this;
			var oItemModel = that.getOwnerComponent().getModel("itemUserModel");
			if (oItemModel.getProperty("/LOCALCURRENCY") == undefined ||

				oItemModel.getProperty("/LOCALCURRENCY") == "") {
				var sPath = "/eFormLocCurrencys" + "(" + "'" + oCountry + "'" + ")";

				oModel.read(sPath, {
					success: function (oData, response) {
						that.defaultCurrency(oData);
					}
				})
			}
		},

		defaultCurrency: function (oData) {

			var oItemModel = this.getOwnerComponent().getModel("itemUserModel");
			if (oData.NAME) {
				oItemModel.setProperty("/LOCALCURRENCY", oData.NAME);
			} else {
				oItemModel.setProperty("/LOCALCURRENCY", this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext +
					"/Expense/LOCALCURRENCY"));
			}

		},
		onLoadCurr: function () {
			var model = this.getOwnerComponent().getModel("oDataModel");
			var that = this;
			model.read("/eFormLocCurrencys", {
				success: function (oData, response) {
					var counter = response.data.results.length;
					var i = 0;
					var aRows = [];
					for (i = 0; i < counter; i++) {
						var item = {
							name: response.data.results[i].NAME,
							exch: response.data.results[i].EXCH
						};
						aRows.push(item);
					}
					var oJason = new sap.ui.model.json.JSONModel();
					oJason.setSizeLimit(500);
					oJason.setData({
						currcomb: aRows
					});
					that.getView().setModel(oJason, "curr");
					//     oModel.setProperty("/localcurrency", aRows);
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
		handleSummaryTotal: function () {
			var val1 = this.getOwnerComponent().getModel("itemUserModel").getProperty("/SummaryTotals_Value1");
			var val2 = this.getOwnerComponent().getModel("itemUserModel").getProperty("/SummaryTotals_Value2");
			var val3 = this.getOwnerComponent().getModel("itemUserModel").getProperty("/SummaryTotals_Value3");
			var val4 = this.getOwnerComponent().getModel("itemUserModel").getProperty("/SummaryTotals_Value4");
			var val5 = this.getOwnerComponent().getModel("itemUserModel").getProperty("/SummaryTotals_Value5");
			var val6 = this.getOwnerComponent().getModel("itemUserModel").getProperty("/SummaryTotals_Value6");
			var val7 = this.getOwnerComponent().getModel("itemUserModel").getProperty("/SummaryTotals_Value7");
			if (val1 === undefined) {
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/SummaryTotals_Value1", "$0.00 USD");
			}
			if (val2 === undefined) {
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/SummaryTotals_Value2", "$0.00 USD");
			}
			if (val3 === undefined) {
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/SummaryTotals_Value3", "$0.00 USD");
			}
			if (val4 === undefined) {
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/SummaryTotals_Value4", "$0.00 USD");
			}
			if (val5 === undefined) {
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/SummaryTotals_Value5", "$0.00 USD");
			}
			if (val6 === undefined) {
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/SummaryTotals_Value6", "$0.00 USD");
			}
			if (val7 === undefined) {
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/SummaryTotals_Value7", "$0.00 USD");
			}
		},
		handleTravelExpense: function () {
			if (this.getOwnerComponent().getModel("itemUserModel").getProperty("/TRAVEL_EXPENSE") === "Airfare") {
				this.getView().byId("AirfareId1").setVisible(true);
				this.getView().byId("AirfareId2").setVisible(true);
				this.getView().byId("HotelId1").setVisible(false);
				this.getView().byId("HotelId2").setVisible(false);
				this.getView().byId("OtherId").setVisible(false);
			} else if (this.getOwnerComponent().getModel("itemUserModel").getProperty("/TRAVEL_EXPENSE") === "Transportation") {
				this.getView().byId("AirfareId1").setVisible(true);
				this.getView().byId("AirfareId2").setVisible(true);
				this.getView().byId("HotelId1").setVisible(false);
				this.getView().byId("HotelId2").setVisible(false);
				this.getView().byId("OtherId").setVisible(false);
			} else if (this.getOwnerComponent().getModel("itemUserModel").getProperty("/TRAVEL_EXPENSE") === "Hotel") {
				this.getView().byId("AirfareId1").setVisible(false);
				this.getView().byId("AirfareId2").setVisible(false);
				this.getView().byId("HotelId1").setVisible(true);
				this.getView().byId("HotelId2").setVisible(true);
				this.getView().byId("OtherId").setVisible(false);
			} else if (this.getOwnerComponent().getModel("itemUserModel").getProperty("/TRAVEL_EXPENSE") === "Other") {
				this.getView().byId("AirfareId1").setVisible(false);
				this.getView().byId("AirfareId2").setVisible(false);
				this.getView().byId("HotelId1").setVisible(false);
				this.getView().byId("HotelId2").setVisible(false);
				this.getView().byId("OtherId").setVisible(true);
			}
			this.clearValues();
		},
		clearValues: function () {
			this.getOwnerComponent().getModel("itemUserModel").setProperty("/OTHERTRAVEL_EXP", "");
			this.getOwnerComponent().getModel("itemUserModel").setProperty("/TravelOrgin_EXP", "");
			this.getOwnerComponent().getModel("itemUserModel").setProperty("/TravelDest_EXP", "");
			this.getOwnerComponent().getModel("itemUserModel").setProperty("/HotelName_EXP", "");
			this.getOwnerComponent().getModel("itemUserModel").setProperty("/HotelCity_EXP", "");
		},
		handlePaymentMethod: function (oEvent) {

			//Upgrade_1909_defect:REQ0595691:NSONI3:GWDK902157:10/09/2020:GEF dropdown defect issue solution:START
			var selectedmentMethodType;
			if (this.getView().byId("payment_method_type").getSelectedItem() === null) {
				selectedmentMethodType = this.getView().byId("payment_method_type").mProperties.value;
			} else {
				selectedmentMethodType = this.getView().byId("payment_method_type").getSelectedItem().getText();
			}
			if (selectedmentMethodType === "Cash") {
				this.getView().byId("expHolId").setVisible(true);
			} else {
				this.getView().byId("expHolId").setVisible(false);
			}
			//old code
			// if (this.getOwnerComponent().getModel("itemUserModel").getProperty("/PAYMENT_METHOD") === "Cash") {
			// 	this.getView().byId("expHolId").setVisible(true);
			// } else {
			// 	this.getView().byId("expHolId").setVisible(false);
			// }
			//Upgrade_1909_defect:REQ0595691:NSONI3:GWDK902152:10/07/2020:PCL dropdown defect issue solution:END

		},

		handleExpenseSubCat: function (oEvent) {
			//REQ0470877:RMANDAL:GWDK901935:09/12/2019:MODIFY:START
			if (oEvent !== undefined && oEvent !== null) {
				var newval = oEvent.getParameter("newValue");
				var key = oEvent.getSource().getSelectedItem();

				if (newval !== "" && key === null) {
					oEvent.getSource().setValue("");
				}
			}
			//REQ0470877:RMANDAL:GWDK901935:09/12/2019:MODIFY:END
			var expenseType = this.getOwnerComponent().getModel("itemUserModel").getProperty("/EXP_TYPE");
			if (expenseType === "Promotional & Marketing Expense" || expenseType === "Entertainment") {
				this.getView().byId("ExpSubCatId").setVisible(true);
			} else {
				this.getView().byId("ExpSubCatId").setVisible(false);
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/EXP_SUBCAT", "");
			}
		},
		onTravSelect: function () {
			var oSelected = this.getView().byId("expId").getSelectedButton().getProperty("text");
			if (oSelected === "Yes") {
				this.getView().byId("travRelId").setVisible(true);
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/IS_TRAVEL", "Yes");
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/is_hol_index", 0);
			} else {
				this.getView().byId("travRelId").setVisible(false);
				this.getView().byId("AirfareId1").setVisible(false);
				this.getView().byId("AirfareId2").setVisible(false);
				this.getView().byId("HotelId1").setVisible(false);
				this.getView().byId("HotelId2").setVisible(false);
				this.getView().byId("OtherId").setVisible(false);

				this.getOwnerComponent().getModel("itemUserModel").setProperty("/TRAVEL_EXPENSE", "");
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/IS_TRAVEL", "No");
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/is_hol_index", 1);
				this.clearValues();
			}
		},
		handleExpenseType: function () {
			var arr = [];
			var expenseType = this.getOwnerComponent().getModel("itemUserModel").getProperty("/EXP_TYPE");
			var expenseValue = this.getOwnerComponent().getModel("itemUserModel").getProperty("/REQ_AMT_EXP");
			if (expenseValue !== "") {
				if (expenseType === "Promotional & Marketing Expense")
					this.getOwnerComponent().getModel("repTableModel").setProperty("/" + this.bindingContext + "/Expense/SummaryTotals_Value1", "$" +
						expenseValue + " " + "USD");
			}
			if (expenseType === "Entertainment") {
				this.getOwnerComponent().getModel("repTableModel").setProperty("/" + this.bindingContext + "/Expense/SummaryTotals_Value2", "$" +
					expenseValue + " " + "USD");
			}
			if (expenseType === "Company Logo Gifts") {
				this.getOwnerComponent().getModel("repTableModel").setProperty("/" + this.bindingContext + "/Expense/SummaryTotals_Value3", "$" +
					expenseValue + " " + "USD");
			}
			if (expenseType === "Non Company Logo Gifts") {
				this.getOwnerComponent().getModel("repTableModel").setProperty("/" + this.bindingContext + "/Expense/SummaryTotals_Value4", "$" +
					expenseValue + " " + "USD");
			}
			if (expenseType === "Payment authorized by written local law") {
				this.getOwnerComponent().getModel("repTableModel").setProperty("/" + this.bindingContext + "/Expense/SummaryTotals_Value5", "$" +
					expenseValue + " " + "USD");
			}
			if (expenseType === "Emergency facilitating payment") {
				this.getOwnerComponent().getModel("repTableModel").setProperty("/" + this.bindingContext + "/Expense/SummaryTotals_Value6", "$" +
					expenseValue + " " + "USD");
			}
			if (expenseType === "Total Requested Amount") {
				this.getOwnerComponent().getModel("repTableModel").setProperty("/" + this.bindingContext + "/Expense/SummaryTotals_Value7", "$" +
					expenseValue + " " + "USD");
			}
			arr.push({
				expenseType: expenseType,
				expenseValue: expenseValue
			})
			this.getOwnerComponent().getModel("ExpenseTypeModel").setData(arr);
		},

		handleAmoutFormatterByTotal: function (oEvent) {
			//new code
			var sAmount = oEvent.getParameter("value");
			if (sAmount < 0) {
				return;
			}
			var a = sAmount.split(',').join('');
			var str1;
			var str2;
			var regx = /[^0-9]/g;
			var res = regx.test(a);
			if (res === false) {
				var totalUsd = new Intl.NumberFormat('en-US').format(a);
				sap.ui.getCore().byId(oEvent.getParameter("id")).setValue(totalUsd);
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/REQ_AMT_EXP", totalUsd);

			} else {
				var result = a.match(regx);
				var substr = a.replace(result, '');
				var totalUsd;
				if (a.indexOf(".") !== -1) {
					var index = a.indexOf(".");
					str1 = a.substr(0, index);
					str2 = a.substr(index);
					var result1 = str1.match(regx);
					if (result1 !== null) {
						str1.replace(result1, '');
					}
					var result2 = str2.match(regx);
					if (result2[0] === "." && result2[1] !== null) {
						str2.replace(result2[1], '');
					}
					totalUsd = new Intl.NumberFormat('en-US').format(str1);
					totalUsd = totalUsd + str2;
				} else {
					totalUsd = new Intl.NumberFormat('en-US').format(substr);
				}
				sap.ui.getCore().byId(oEvent.getParameter("id")).setValue(totalUsd);
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/REQ_AMT_EXP", totalUsd);

			}

		},

		handleAmountFormatting: function (value) {
			if (value && this.flag !== true) {
				var a = value.split(',').join('');;
				var totalUsd = new Intl.NumberFormat('en-US').format(a);
				if ((a.indexOf(".") !== -1) && (totalUsd.indexOf(".") === -1)) {
					totalUsd = totalUsd + "." + a.split(".")[1];
				}
				return totalUsd;
				// end of addition by jatin REQ-0313798

			} else {
				return value;
			}
		},
		_onCompanyCodeValueHelpRequest: function () {
			var ccode = this.getView().byId("CompCodeId");
			var oValueHelpDialog_CardHolderName = new sap.m.SelectDialog({ //Using SelectDialog control that will allow single selection along with Search field capability
				title: "Choose Value for Company Code)",
				items: {
					path: "/eFormCompanyCodes",
					template: new sap.m.StandardListItem({
						title: "{CODE}",
						description: "{TEXT}",
					})
				},
				//Shipping Point can be searched using Search Bar
				search: function (oEvent) {
					var sValue = oEvent.getParameter("value");
					var oFilter = new sap.ui.model.Filter(
						"TEXT",
						sap.ui.model.FilterOperator.Contains, sValue
					);
					oEvent.getSource().getBinding("items").filter([oFilter]);
				},
				//On click of Confirm, value is set to input field
				confirm: function (oEvent) {
					//           that.byId('input_glaccount').setValue("");
					//           that.byId('input_wbs').setValue("");
					compCode = oEvent.getParameter("selectedItem").getTitle();
					var oSelectedItem = oEvent.getParameter("selectedItem");
					if (oSelectedItem) {
						ccode.setValue(oSelectedItem.getTitle());
						ccode.setValueState("None");
					}
				}
			});
			var model = this.getOwnerComponent().getModel("oDataModel"); // Setting oServiceModel defined in Copmponent.js to this value help dialog
			oValueHelpDialog_CardHolderName.setModel(model);
			oValueHelpDialog_CardHolderName.open(); //Opening value help dialog once data is binded to standard list item
		},
		onGLValueHelp: function () {
			var that = this;
			var compCode = this.getOwnerComponent().getModel("itemUserModel").getProperty("/COMPANY_CODE");
			var oValueHelpDialog_RespDiv = new sap.m.SelectDialog({
				title: "Choose Value for General Ledger",
				items: {
					path: "/FisshSaknrGenericSet",
					filters: [new sap.ui.model.Filter({
						filters: [new sap.ui.model.Filter({
							path: "BUKRS",
							operator: sap.ui.model.FilterOperator.EQ,
							value1: compCode
						})],
						and: true
					})],
					template: new sap.m.StandardListItem({
						title: "{Saknr}",
						description: "{Txt50}",
						active: true
					})
				},
				//Shipping Point can be searched using Search Bar
				search: function (oEvent) {
					var sValue = oEvent.getParameter("value");
					var oFilter = new sap.ui.model.Filter(
						"Saknr",
						sap.ui.model.FilterOperator.Contains, sValue
					);
					oEvent.getSource().getBinding("items").filter([oFilter]);
				},
				confirm: function (oEvent) {
					var oSelectedItem = oEvent.getParameter("selectedItem");
					if (oSelectedItem) {
						//sublob.setValue(oSelectedItem.getTitle());
						that.getOwnerComponent().getModel("itemUserModel").setProperty("/GEN_LEDGER", oSelectedItem.getTitle());
					}
				}
			});
			var model = this.getOwnerComponent().getModel("oDataModel");
			oValueHelpDialog_RespDiv.setModel(model);
			oValueHelpDialog_RespDiv.open();
		},
		handleMandatFields: function () {
			var status = false;
			var obj1 = this.getOwnerComponent().getModel("itemUserModel").getProperty("/EXP_TYPE");
			if (!obj1) {
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/ExpTypeVStat", "Error");
				status = true;
			} else {
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/ExpTypeVStat", "None");
			}
			var obj2 = this.getOwnerComponent().getModel("itemUserModel").getProperty("/EXP_SUBCAT");
			if (!obj2 && (obj1 === "Promotional & Marketing Expense" || obj1 === "Entertainment")) {
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/ExpSubCatVStat", "Error");
				status = true;
			} else {
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/ExpSubCatVStat", "None");
			}
			var obj3 = this.getOwnerComponent().getModel("itemUserModel").getProperty("/EXP_DES");
			if (!obj3) {
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/ExpDesVStat", "Error");
				status = true;
			} else {
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/ExpDesVStat", "None");
			}
			var obj4 = this.getOwnerComponent().getModel("itemUserModel").getProperty("/PAYMENT_METHOD");
			if (!obj4) {
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/ExpPayMethodVStat", "Error");
				status = true;
			} else {
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/ExpPayMethodVStat", "None");
			}
			var obj16 = this.getView().byId("holId").getSelectedButton();
			if ((!obj16) && (obj4 === "Cash")) {
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/ExpIsHolVStat", "Error");
				status = true;
			} else {
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/ExpIsHolVStat", "None");
			}
			var obj17 = this.getView().byId("expId").getSelectedButton();
			if (obj17) {
				var obj17t = this.getView().byId("expId").getSelectedButton().getProperty("text");
			} else {
				var obj17t = "X";
			}
			if ((!obj17)) {
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/ExpIsTravelVStat", "Error");
				status = true;
			} else {
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/ExpIsTravelVStat", "None");
			}
			var obj5 = this.getOwnerComponent().getModel("itemUserModel").getProperty("/TRAVEL_EXPENSE");
			if (!obj5 && (obj17t === "Yes")) {
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/ExpTravelExpenseVStat", "Error");
				status = true;
			} else {
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/ExpTravelExpenseVStat", "None");
			}
			var obj6 = this.getOwnerComponent().getModel("itemUserModel").getProperty("/OTHERTRAVEL_EXP");
			if (!obj6 && (obj5 === "Other" && obj17t === "Yes")) {
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/OthTravelVStat", "Error");
				status = true;
			} else {
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/OthTravelVStat", "None");
			}
			var obj7 = this.getOwnerComponent().getModel("itemUserModel").getProperty("/TravelOrgin_EXP");
			if (!obj7 && (obj17t === "Yes" && (obj5 === "Airfare" || obj5 === "Transportation"))) {
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/TravelOriginVStat", "Error");
				status = true;
			} else {
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/TravelOriginVStat", "None");
			}
			var obj8 = this.getOwnerComponent().getModel("itemUserModel").getProperty("/TravelDest_EXP");
			if (!obj8 && (obj17t === "Yes" && (obj5 === "Airfare" || obj5 === "Transportation"))) {
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/TravelDestVStat", "Error");
				status = true;
			} else {
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/TravelDestVStat", "None");
			}
			var obj9 = this.getOwnerComponent().getModel("itemUserModel").getProperty("/HotelName_EXP");
			if (!obj9 && (obj5 === "Hotel" && obj17t === "Yes")) {
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/HotelNameVStat", "Error");
				status = true;
			} else {
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/HotelNameVStat", "None");
			}
			var obj10 = this.getOwnerComponent().getModel("itemUserModel").getProperty("/HotelCity_EXP");
			if (!obj10 && (obj5 === "Hotel" && obj17t === "Yes")) {
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/HotelCityVStat", "Error");
				status = true;
			} else {
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/HotelCityVStat", "None");
			}
			var obj11 = this.getOwnerComponent().getModel("itemUserModel").getProperty("/DATE_OF_EXP");
			if (!obj11) {
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/ExpDateVStat", "Error");
				status = true;
			} else {
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/ExpDateVStat", "None");
			}
			// var obj12=this.getOwnerComponent().getModel("itemUserModel").getProperty("/REQ_AMT_EXP");
			var obj12 = this.getView().byId("amtId").getValue();
			if (!obj12) {
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/ReqAmtVStat", "Error");
				status = true;
			} else {
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/ReqAmtVStat", "None");
			}
			var obj13 = this.getOwnerComponent().getModel("itemUserModel").getProperty("/COMPANY_CODE");
			if (!obj13) {
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/ExpComCodeVStat", "Error");
				status = true;
			} else {
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/ExpComCodeVStat", "None");
			}
			var obj14 = this.getOwnerComponent().getModel("itemUserModel").getProperty("/GEN_LEDGER_AREA");
			if (!obj14) {
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/ExpGLAreaVStat", "Error");
				status = true;
			} else {
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/ExpGLAreaVStat", "None");
			}
			var obj15 = this.getOwnerComponent().getModel("itemUserModel").getProperty("/GEN_LEDGER");
			if (!obj15) {
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/ExpGLVStat", "Error");
				status = true;
			} else {
				this.getOwnerComponent().getModel("itemUserModel").setProperty("/ExpGLVStat", "None");
			}
			return status;
		},
		onPressOk: function () {
			window.from_dialog = "X";
			var status = this.handleMandatFields();
			if (status === true) {
				var errMsg = this.getView().getModel("i18n").getResourceBundle().getText("errorExpMandat");
				MessageBox.error(errMsg);
				return;
			}
			this.handleExpenseType();
			this.getOwnerComponent().getOkConfirm("ok");
			//        this.getOwnerComponent().getModel("repTableModel").setProperty("/Exp",this.getOwnerComponent().getModel("itemUserModel").getProperty("/EXP_TYPE"))
			var obj = {};
			obj.obj1 = this.getOwnerComponent().getModel("itemUserModel").getProperty("/EXP_TYPE");
			obj.obj2 = this.getOwnerComponent().getModel("itemUserModel").getProperty("/EXP_DES");
			obj.obj3 = this.getOwnerComponent().getModel("itemUserModel").getProperty("/PAYMENT_METHOD");
			obj.obj4 = this.getOwnerComponent().getModel("itemUserModel").getProperty("/IS_TRAVEL");
			obj.obj5 = this.getOwnerComponent().getModel("itemUserModel").getProperty("/IS_Expense");
			obj.obj6 = this.getOwnerComponent().getModel("itemUserModel").getProperty("/TRAVEL_EXPENSE");
			obj.obj7 = this.getOwnerComponent().getModel("itemUserModel").getProperty("/OTHERTRAVEL_EXP");
			obj.obj8 = this.getOwnerComponent().getModel("itemUserModel").getProperty("/TravelOrgin_EXP");
			obj.obj9 = this.getOwnerComponent().getModel("itemUserModel").getProperty("/TravelDest_EXP");
			obj.obj10 = this.getOwnerComponent().getModel("itemUserModel").getProperty("/HotelName_EXP");
			obj.obj11 = this.getOwnerComponent().getModel("itemUserModel").getProperty("/HotelCity_EXP");
			obj.obj12 = this.getOwnerComponent().getModel("itemUserModel").getProperty("/DATE_OF_EXP");
			obj.obj13 = this.getOwnerComponent().getModel("itemUserModel").getProperty("/REQ_AMT_EXP");
			obj.obj14 = this.getOwnerComponent().getModel("itemUserModel").getProperty("/COMPANY_CODE");
			obj.obj15 = this.getOwnerComponent().getModel("itemUserModel").getProperty("/GEN_LEDGER_AREA");
			obj.obj16 = this.getOwnerComponent().getModel("itemUserModel").getProperty("/GEN_LEDGER");
			obj.obj17 = this.getOwnerComponent().getModel("itemUserModel").getProperty("/EXP_SUBCAT");
			if (obj.obj13 === undefined) {
				obj.obj13 = "";
			}
			if (obj.obj1 === undefined) {
				obj.obj1 = "";
			}
			if (obj.obj17 === undefined) {
				obj.obj17 = "";
			}
			obj.obj18 = this.getOwnerComponent().getModel("itemUserModel").getProperty("/EXP_SUBCAT");
			obj.obj19 = this.getOwnerComponent().getModel("itemUserModel").getProperty("/LOCALCURRENCY");
			//obj.obj20=this.getView().getModel("itemUserModel").getProperty("/AMOUNT_DONATION_USD");
			//       var total_Inp = this.getView().byId("amtId").getValue();
			//            var loccurrency = this.getView().byId("CurrId").getValue();
			//                var total_Inp1 = total_Inp.split(',').join('');
			//              var s = {};
			//              s.EXCH = String(total_Inp1).split(",").join();
			//              s.NAME = loccurrency;
			//     var model = this.getOwnerComponent().getModel("oDataModel");
			//    var that = this;
			//     model.create("/eFormLocCurrencys", s, { //POST call to OData with reportheader JSON object
			//             async: true,
			//            success: function(oData, response) {
			//    var temp =  new Intl.NumberFormat('en-US').format(oData.EXCH);
			//    that.getView().getModel("itemUserModel").setProperty("/AMOUNT_DONATION_USD", temp);
			//     that.getView().byId("AMOUNT_DONATION_USD").setText(temp);
			var that = this;
			that.getOwnerComponent().getModel("repTableModel").setProperty("/" + that.bindingContext + "/Expense/EXP_TYPE", obj.obj1);
			that.getOwnerComponent().getModel("repTableModel").setProperty("/" + that.bindingContext + "/Expense/EXP_DES", obj.obj2)
			that.getOwnerComponent().getModel("repTableModel").setProperty("/" + that.bindingContext + "/Expense/PAYMENT_METHOD", obj.obj3)
			that.getOwnerComponent().getModel("repTableModel").setProperty("/" + that.bindingContext + "/Expense/IS_TRAVEL", obj.obj4)
			that.getOwnerComponent().getModel("repTableModel").setProperty("/" + that.bindingContext + "/Expense/IS_Expense", obj.obj5)
			that.getOwnerComponent().getModel("repTableModel").setProperty("/" + that.bindingContext + "/Expense/TRAVEL_EXPENSE", obj.obj6)
			that.getOwnerComponent().getModel("repTableModel").setProperty("/" + that.bindingContext + "/Expense/OTHERTRAVEL_EXP", obj.obj7)
			that.getOwnerComponent().getModel("repTableModel").setProperty("/" + that.bindingContext + "/Expense/TravelOrgin_EXP", obj.obj8)
			that.getOwnerComponent().getModel("repTableModel").setProperty("/" + that.bindingContext + "/Expense/TravelDest_EXP", obj.obj9)
			that.getOwnerComponent().getModel("repTableModel").setProperty("/" + that.bindingContext + "/Expense/HotelName_EXP", obj.obj10)
			that.getOwnerComponent().getModel("repTableModel").setProperty("/" + that.bindingContext + "/Expense/HotelCity_EXP", obj.obj11)
			that.getOwnerComponent().getModel("repTableModel").setProperty("/" + that.bindingContext + "/Expense/DATE_OF_EXP", obj.obj12)
			that.getOwnerComponent().getModel("repTableModel").setProperty("/" + that.bindingContext + "/Expense/REQ_AMT_EXP", obj.obj13)
			that.getOwnerComponent().getModel("repTableModel").setProperty("/" + that.bindingContext + "/Expense/COMPANY_CODE", obj.obj14)
			that.getOwnerComponent().getModel("repTableModel").setProperty("/" + that.bindingContext + "/Expense/GEN_LEDGER_AREA", obj.obj15)
			that.getOwnerComponent().getModel("repTableModel").setProperty("/" + that.bindingContext + "/Expense/GEN_LEDGER", obj.obj16)
				//that.getOwnerComponent().getModel("repTableModel").setProperty("/"+that.bindingContext +"/Expense/title",obj.obj1+"- " +obj.obj17 +"(" + temp +")");
			that.getOwnerComponent().getModel("repTableModel").setProperty("/" + that.bindingContext + "/Expense/EXP_SUBCAT", obj.obj18)
			that.getOwnerComponent().getModel("repTableModel").setProperty("/" + that.bindingContext + "/Expense/LOCALCURRENCY", obj.obj19)
				//that.getOwnerComponent().getModel("repTableModel").setProperty("/"+that.bindingContext +"/Expense/REQ_AMT_EXP1",temp)
			that.getOwnerComponent().getModel("repTableModel").setProperty("/isEditedItems_EXP", true);
			this.currencyCalculation();
			//              }
			//              ,
			//                 sap.ui.core.BusyIndicator.hide();
			//              }
			//           });
		},
		onPressCancel: function () {
			window.from_dialog = "X";
			this.getView().getModel("itemUserModel").setData({});
			if (this.Form_Num && this.action !== "copy") {
				if (this.getOwnerComponent().getModel("headerUserModel").getProperty("/isData") === true) {
					this.oRouter.navTo('GovernmentRevenue', {
						context: "Expenditure"
					});
				} else {
					this.oRouter.navTo("GovernmentRevenueSearch", {
						context: this.Form_Num
					});
				}
			} else if (this.action === "copy") {
				this.oRouter.navTo("GovernmentRevenueCopy", {
					context: this.Form_Num
				});
			} else {
				this.oRouter.navTo('GovernmentRevenue', {
					context: "Expenditure"
				});
			}
		},
		handleNavBack: function () {
			window.from_dialog = "X";
			this.getView().getModel("itemUserModel").setData({});
			if (this.Form_Num && this.action !== "copy") {
				if (this.getOwnerComponent().getModel("headerUserModel").getProperty("/isData") === true) {
					this.oRouter.navTo('GovernmentRevenue', {
						context: "Expenditure"
					});
				} else {
					this.oRouter.navTo("GovernmentRevenueSearch", {
						context: this.Form_Num
					});
				}
			} else if (this.action === "copy") {
				this.oRouter.navTo("GovernmentRevenueCopy", {
					context: this.Form_Num
				});
			} else {
				this.oRouter.navTo('GovernmentRevenue', {
					context: "Expenditure"
				});
			}
		},
	});
}, true)