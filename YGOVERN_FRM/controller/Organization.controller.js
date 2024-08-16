sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History"
], function (BaseController, MessageBox, Utilities, History) {
	"use strict";
	return BaseController.extend("com.sap.build.standard.governmentApp.controller.Organization", {
		onInit: function () {
			this.mBindingOptions = {};
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.attachRouteMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function (oEvent) {
			if (oEvent.getParameters().name === "OrganizationPage") {
				this.getOwnerComponent().getModel("repTableModel").setProperty("/isEditedItems_EXP", true);
				this.Form_Num = this.getOwnerComponent().getModel("headerUserModel").getProperty("/FORM_NUM");
				var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
				if (!this.Form_Num) {
					this.Form_Num = "";
				}

				var sText = oBundle.getText("Title", [this.Form_Num]);
				this.getView().byId("pageTitleId_Org").setTitle(sText);

				if (this.getOwnerComponent().getModel("headerUserModel").getProperty("/action") === "copy") {

					var sText = oBundle.getText("Title", [""]);
					this.getView().byId("pageTitleId_Org").setTitle(sText);
				}
				this.action = this.getOwnerComponent().getModel("headerUserModel").getProperty("/action");
				this.getOwnerComponent().getItemData();
				this.bindingContext = oEvent.getParameter("arguments").context;
				if (this.bindingContext !== undefined && this.bindingContext !== "Expenditure" && this.bindingContext !== "Recipient" && this.bindingContext !==
					"Organisation" && this.bindingContext !== this.Form_Num) {
					var itemData = {
						EFORM_NUM: "",
						RECIPIENT_ORG: this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext +
							"/Organisation/RECIPIENT_ORG"),
						ORG_TYPE: this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext + "/Organisation/ORG_TYPE"),
						ORG_ADDRESS: this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext +
							"/Organisation/ORG_ADDRESS"),
						CITY: this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext + "/Organisation/CITY"),
						ORG_STATE: this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext + "/Organisation/ORG_STATE"),
						ORG_POSTAL_CODE: this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext +
							"/Organisation/ORG_POSTAL_CODE"),
						ORG_COUNTRY: this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext +
							"/Organisation/ORG_COUNTRY"),
						ORG_BUSSI: this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext + "/Organisation/ORG_BUSSI")
					}
					this.getView().getModel("itemUserModel1").setData(itemData);
					this.getView().getModel("itemUserModel1").updateBindings(true);
					var oValue = this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext +
						"/Organisation/ORG_COUNTRY");
					if (oValue === "South Korea") {
						this.getView().byId("orgWarnId").setVisible(true);
					} else {
						this.getView().byId("orgWarnId").setVisible(false);
					}
					this.getView().getModel("itemUserModel1").refresh();
				}
			}
		},
		handleNavBack: function () {
			window.from_dialog = "X";
			this.getView().getModel("itemUserModel1").setData({});
			if (this.Form_Num && this.action !== "copy") {
				if (this.getOwnerComponent().getModel("headerUserModel").getProperty("/isData") === true) {
					this.oRouter.navTo('GovernmentRevenue', {
						context: "Organisation"
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
					context: "Organisation"
				});
			}
		},
		_onStateValueHelpRequest: function () {
			var that = this;
			var lob = this.getOwnerComponent().getModel("itemUserModel1").getProperty("/ORG_STATE");
			var country = this.getOwnerComponent().getModel("itemUserModel1").getProperty("/ORG_COUNTRY");
			var oValueHelpDialog_RespDiv = new sap.m.SelectDialog({
				title: "Choose Value for State",
				items: {
					path: "/eFormStates",
					filters: [new sap.ui.model.Filter({
						filters: [new sap.ui.model.Filter({
							path: "COUNTRY",
							operator: sap.ui.model.FilterOperator.EQ,
							value1: country
						})],
						and: true
					})],
					template: new sap.m.StandardListItem({
						title: "{STATE}",
						description: "{NAME}",
						active: true
					})
				},
				//Shipping Point can be searched using Search Bar
				search: function (oEvent) {
					var sValue = oEvent.getParameter("value");
					var oFilter = new sap.ui.model.Filter(
						"NAME",
						sap.ui.model.FilterOperator.Contains, sValue
					);
					oEvent.getSource().getBinding("items").filter([oFilter]);
				},
				confirm: function (oEvent) {
					var oSelectedItem = oEvent.getParameter("selectedItem");
					if (oSelectedItem) {
						//sublob.setValue(oSelectedItem.getTitle());
						that.getOwnerComponent().getModel("itemUserModel1").setProperty("/ORG_STATE", oSelectedItem.getDescription());
					}
				}
			});
			var model = this.getOwnerComponent().getModel("oDataModel");
			oValueHelpDialog_RespDiv.setModel(model);
			oValueHelpDialog_RespDiv.open();
		},
		_onCountryValueHelpRequest: function () {
			var that = this;
			var lob = that.getOwnerComponent().getModel("itemUserModel1").getProperty("/ORG_COUNTRY");
			var oValueHelpDialog_RespDiv = new sap.m.SelectDialog({
				title: "Choose Value for Country",
				items: {
					path: "/eFormCountries",
					template: new sap.m.StandardListItem({
						title: "{NAME}",
						active: true
					})
				},
				//Shipping Point can be searched using Search Bar
				search: function (oEvent) {
					var sValue = oEvent.getParameter("value");
					var oFilter = new sap.ui.model.Filter(
						"NAME",
						sap.ui.model.FilterOperator.Contains, sValue
					);
					oEvent.getSource().getBinding("items").filter([oFilter]);
				},
				confirm: function (oEvent) {
					var oSelectedItem = oEvent.getParameter("selectedItem");
					if (oSelectedItem) {
						//lob.setValue(oSelectedItem.getTitle());
						that.getOwnerComponent().getModel("itemUserModel1").setProperty("/ORG_COUNTRY", oSelectedItem.getTitle());
						that.getOwnerComponent().getModel("itemUserModel1").setProperty("/RES_COUNTRY_ID", oSelectedItem.getTitle());
						var oValue = oSelectedItem.getTitle();
						if (oValue === "South Korea") {
							that.getView().byId("orgWarnId").setVisible(true);
						} else {
							that.getView().byId("orgWarnId").setVisible(false);
						}
						that.getOwnerComponent().getModel("itemUserModel1").setProperty("/ORG_STATE", "");
					}
				}
			});
			var model = this.getOwnerComponent().getModel("oDataModel");
			oValueHelpDialog_RespDiv.setModel(model);
			oValueHelpDialog_RespDiv.open();
		},
		handleMandatFields: function () {
			var status = false;
			var obj1 = this.getOwnerComponent().getModel("itemUserModel1").getProperty("/RECIPIENT_ORG");
			if (!obj1) {
				this.getOwnerComponent().getModel("itemUserModel1").setProperty("/VALSTATORGNAME", "Error");
				status = true;
			} else {
				this.getOwnerComponent().getModel("itemUserModel1").setProperty("/VALSTATORGNAME", "None");
			}
			var obj2 = this.getOwnerComponent().getModel("itemUserModel1").getProperty("/ORG_TYPE");
			if (!obj2) {
				this.getOwnerComponent().getModel("itemUserModel1").setProperty("/VALSTATORGTYPE", "Error");
				status = true;
			} else {
				this.getOwnerComponent().getModel("itemUserModel1").setProperty("/VALSTATORGTYPE", "None");
			}
			var obj3 = this.getOwnerComponent().getModel("itemUserModel1").getProperty("/ORG_ADDRESS");
			if (!obj3) {
				this.getOwnerComponent().getModel("itemUserModel1").setProperty("/VALSTATORGADDR", "Error");
				status = true;
			} else {
				this.getOwnerComponent().getModel("itemUserModel1").setProperty("/VALSTATORGADDR", "None");
			}
			var obj6 = this.getOwnerComponent().getModel("itemUserModel1").getProperty("/ORG_COUNTRY");
			if (!obj6) {
				this.getOwnerComponent().getModel("itemUserModel1").setProperty("/VALSTATORGCOUNTRY", "Error");
				status = true;
			} else {
				this.getOwnerComponent().getModel("itemUserModel1").setProperty("/VALSTATORGCOUNTRY", "None");
			}
			var obj5 = this.getOwnerComponent().getModel("itemUserModel1").getProperty("/ORG_STATE");
			if (!obj5) {
				this.getOwnerComponent().getModel("itemUserModel1").setProperty("/VALSTATORGSTATE", "Error");
				status = true;
			} else {
				this.getOwnerComponent().getModel("itemUserModel1").setProperty("/VALSTATORGSTATE", "None");
			}
			var obj4 = this.getOwnerComponent().getModel("itemUserModel1").getProperty("/CITY");
			if (!obj4) {
				this.getOwnerComponent().getModel("itemUserModel1").setProperty("/VALSTATORGCITY", "Error");
				status = true;
			} else {
				this.getOwnerComponent().getModel("itemUserModel1").setProperty("/VALSTATORGCITY", "None");
			}
			var obj7 = this.getOwnerComponent().getModel("itemUserModel1").getProperty("/ORG_BUSSI");
			if (!obj7) {
				this.getOwnerComponent().getModel("itemUserModel1").setProperty("/OrgBussiVStat", "Error");
				status = true;
			} else {
				this.getOwnerComponent().getModel("itemUserModel1").setProperty("/OrgBussiVStat", "None");
			}
			return status;
		},
		onPressOk: function () {
			//this.handleExpenseType();
			window.from_dialog = "X";
			var status = this.handleMandatFields();
			if (status === true) {
				return;
			}
			this.getOwnerComponent().getOkConfirm("ok");
			var obj = {};
			obj.obj1 = this.getOwnerComponent().getModel("itemUserModel1").getProperty("/RECIPIENT_ORG");
			obj.obj2 = this.getOwnerComponent().getModel("itemUserModel1").getProperty("/ORG_TYPE");
			obj.obj3 = this.getOwnerComponent().getModel("itemUserModel1").getProperty("/ORG_ADDRESS");
			obj.obj4 = this.getOwnerComponent().getModel("itemUserModel1").getProperty("/CITY");
			obj.obj5 = this.getOwnerComponent().getModel("itemUserModel1").getProperty("/ORG_STATE");
			obj.obj6 = this.getOwnerComponent().getModel("itemUserModel1").getProperty("/ORG_POSTAL_CODE");
			obj.obj7 = this.getOwnerComponent().getModel("itemUserModel1").getProperty("/ORG_COUNTRY");
			obj.obj8 = this.getOwnerComponent().getModel("itemUserModel1").getProperty("/ORG_BUSSI");
			this.getOwnerComponent().getModel("repTableModel").setProperty("/" + this.bindingContext + "/Organisation/RECIPIENT_ORG", obj.obj1);
			this.getOwnerComponent().getModel("repTableModel").setProperty("/" + this.bindingContext + "/Organisation/ORG_TYPE", obj.obj2)
			this.getOwnerComponent().getModel("repTableModel").setProperty("/" + this.bindingContext + "/Organisation/ORG_ADDRESS", obj.obj3)
			this.getOwnerComponent().getModel("repTableModel").setProperty("/" + this.bindingContext + "/Organisation/CITY", obj.obj4)
			this.getOwnerComponent().getModel("repTableModel").setProperty("/" + this.bindingContext + "/Organisation/ORG_STATE", obj.obj5)
			this.getOwnerComponent().getModel("repTableModel").setProperty("/" + this.bindingContext + "/Organisation/ORG_POSTAL_CODE", obj.obj6)
			this.getOwnerComponent().getModel("repTableModel").setProperty("/" + this.bindingContext + "/Organisation/ORG_COUNTRY", obj.obj7)
			this.getOwnerComponent().getModel("repTableModel").setProperty("/" + this.bindingContext + "/Organisation/title", obj.obj1)
			this.getOwnerComponent().getModel("repTableModel").setProperty("/" + this.bindingContext + "/Organisation/ORG_BUSSI", obj.obj8)
			this.getOwnerComponent().getModel("repTableModel").setProperty("/" + this.bindingContext + "/Organisation/text", obj.obj1);
			this.getView().getModel("itemUserModel1").setData({});
			if (this.Form_Num && this.action !== "copy") {
				if (this.getOwnerComponent().getModel("headerUserModel").getProperty("/isData") === true) {
					this.oRouter.navTo('GovernmentRevenue', {
						context: "Organisation"
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
					context: "Organisation"
				});
			}
		},
		onPressCancel: function () {
			window.from_dialog = "X";
			this.getView().getModel("itemUserModel1").setData({});
			if (this.Form_Num && this.action !== "copy") {
				if (this.getOwnerComponent().getModel("headerUserModel").getProperty("/isData") === true) {
					this.oRouter.navTo('GovernmentRevenue', {
						context: "Organisation"
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
					context: "Organisation"
				});
			}
		}
	});
}, true);