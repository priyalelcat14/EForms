sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History"
], function (BaseController, MessageBox, Utilities, History) {
	"use strict";
	return BaseController.extend("com.sap.build.standard.governmentApp.controller.Recipient", {
		handleNavBack: function () {
			window.from_dialog = "X";
			this.getView().getModel("itemUserModel2").setData({});
			if (this.Form_Num && this.action !== "copy") {
				if (this.getOwnerComponent().getModel("headerUserModel").getProperty("/isData") === true) {
					this.oRouter.navTo('GovernmentRevenue', {
						context: "Recipient"
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
					context: "Recipient"
				});
			}

		},
		onRelChange: function () {
			if (this.getView().byId("comBoxId_rec").getSelectedItem()) {
				if (this.getView().byId("comBoxId_rec").getSelectedItem().getText() === "Other") {
					this.getOwnerComponent().getModel("itemUserModel2").setProperty("/jusficationVisibleform_other", true);

				} else {
					this.getOwnerComponent().getModel("itemUserModel2").setProperty("/jusficationVisibleform_other", false);
				}

			} else {
				this.getOwnerComponent().getModel("itemUserModel2").setProperty("/jusficationVisibleform_other", false);
			}
		},
		onInit: function () {
			this.mBindingOptions = {};
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.attachRouteMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function (oEvent) {
			if (oEvent.getParameters().name === "RecipientPage") {
				this.getOwnerComponent().getModel("repTableModel").setProperty("/isEditedItems_EXP", true);
				this.getOwnerComponent().getItemData();
				this.action = this.getOwnerComponent().getModel("headerUserModel").getProperty("/action");
				this.Form_Num = this.getOwnerComponent().getModel("headerUserModel").getProperty("/FORM_NUM");
				var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

				if (!this.Form_Num) {
					this.Form_Num = "";
				}

				var sText = oBundle.getText("Title", [this.Form_Num]);
				this.getView().byId("pageTitleId_Rec").setTitle(sText);

				if (this.getOwnerComponent().getModel("headerUserModel").getProperty("/action") === "copy") {

					var sText = oBundle.getText("Title", [""]);
					this.getView().byId("pageTitleId_Rec").setTitle(sText);
				}
				if (this.getOwnerComponent().getModel("repTableModel") === undefined) {
					this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(), "repTableModel");
				}
				this.bindingContext = oEvent.getParameter("arguments").context;
				if (this.bindingContext !== undefined && this.bindingContext !== "Expenditure" && this.bindingContext !== "Recipient" && this.bindingContext !==
					"Organisation" && this.bindingContext !== this.Form_Num) {
					var itemData = {
						RECIPIENT_FIRST_NAME: this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext +
							"/Recipient/RECIPIENT_FIRST_NAME"),
						RECIPIENT_LAST_NAME: this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext +
							"/Recipient/RECIPIENT_LAST_NAME"),
						RECIPIENT_TITLE: this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext +
							"/Recipient/RECIPIENT_TITLE"),
						RECIPIENT_ADD: this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext +
							"/Recipient/RECIPIENT_ADD"),
						RECIPIENT_CITY: this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext +
							"/Recipient/RECIPIENT_CITY"),
						RECIPIENT_STATE: this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext +
							"/Recipient/RECIPIENT_STATE"),
						RECIPIENT_PC: this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext +
							"/Recipient/RECIPIENT_PC"),
						RECIPIENT_COUNTRY: this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext +
							"/Recipient/RECIPIENT_COUNTRY"),
						RECI_BUSSI: this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext + "/Recipient/RECI_BUSSI"),
						IS_REL_IND: this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext + "/Recipient/IS_REL_IND"),

						form_Justification2: this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext +
							"/Recipient/form_Justification2"),
						form_Justification1: this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext +
							"/Recipient/form_Justification1"),
						form_Justification3: this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext +
							"/Recipient/form_Justification3"),

						RECIPIENT_OTHER_RELATION: this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext +
							"/Recipient/RECIPIENT_OTHER_RELATION"),
						jusficationVisibleform_Justification1: false,
						jusficationVisibleform_Justification2: false,
						jusficationVisibleform_Justification3: false
					}

					var oValue = this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext +
						"/Recipient/RECIPIENT_COUNTRY");
					if (oValue === "South Korea") {
						this.getView().byId("reciWarnId").setVisible(true);
					} else {
						this.getView().byId("reciWarnId").setVisible(false);
					}
					this.getView().getModel("itemUserModel2").setData(itemData);
					if (this.getOwnerComponent().getModel("itemUserModel2").getProperty("/IS_REL_IND")) {
						if (this.getOwnerComponent().getModel("itemUserModel2").getProperty("/IS_REL_IND") === "Other") {
							this.getOwnerComponent().getModel("itemUserModel2").setProperty("/jusficationVisibleform_other", true);

						} else {
							this.getOwnerComponent().getModel("itemUserModel2").setProperty("/jusficationVisibleform_other", false);
						}

					} else {
						this.getOwnerComponent().getModel("itemUserModel2").setProperty("/jusficationVisibleform_other", false);
					}
					if (this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext + "/Recipient/Res_sel1") === "Yes" ||
						this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext + "/Recipient/Res_sel1") === 0) {
						this.getOwnerComponent().getModel("itemUserModel2").setProperty("/jusficationVisibleform_Justification1", true);
						this.getOwnerComponent().getModel("itemUserModel2").setProperty("/Res_sel1", 0);

						// this.getView().byId("rb1").setSelectedIndex(0);

					} else if (this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext + "/Recipient/Res_sel1") ===
						"No" ||
						this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext + "/Recipient/Res_sel1") === 1
					) {
						this.getOwnerComponent().getModel("itemUserModel2").setProperty("/jusficationVisibleform_Justification1", false);
						this.getOwnerComponent().getModel("itemUserModel2").setProperty("/Res_sel1", 1);
						this.getOwnerComponent().getModel("itemUserModel2").setProperty("/form_Justification1", "");
						//this.getView().byId("rb1").setSelectedIndex(1);
					} else {
						this.getOwnerComponent().getModel("itemUserModel2").setProperty("/jusficationVisibleform_Justification1", false);
						this.getOwnerComponent().getModel("itemUserModel2").setProperty("/Res_sel1", -1);
						this.getOwnerComponent().getModel("itemUserModel2").setProperty("/form_Justification1", "");
						this.getView().byId("rb1").setSelectedIndex(-1);
					}
					if (this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext + "/Recipient/Res_sel2") === "Yes" ||
						this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext + "/Recipient/Res_sel2") === 0) {
						this.getOwnerComponent().getModel("itemUserModel2").setProperty("/jusficationVisibleform_Justification2", true);
						this.getOwnerComponent().getModel("itemUserModel2").setProperty("/Res_sel2", 0)
					} else if (this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext + "/Recipient/Res_sel2") ===
						"No" ||
						this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext + "/Recipient/Res_sel2") === 1) {
						this.getOwnerComponent().getModel("itemUserModel2").setProperty("/jusficationVisibleform_Justification2", false);
						this.getOwnerComponent().getModel("itemUserModel2").setProperty("/Res_sel2", 1);
						this.getOwnerComponent().getModel("itemUserModel2").setProperty("/form_Justification2", "");
					} else {
						this.getOwnerComponent().getModel("itemUserModel2").setProperty("/jusficationVisibleform_Justification2", false);
						this.getOwnerComponent().getModel("itemUserModel2").setProperty("/Res_sel2", -1);
						this.getOwnerComponent().getModel("itemUserModel2").setProperty("/form_Justification2", "");
					}

					if (this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext + "/Recipient/Res_sel3") === "Yes" ||
						this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext + "/Recipient/Res_sel3") === 0) {
						this.getOwnerComponent().getModel("itemUserModel2").setProperty("/jusficationVisibleform_Justification3", true);
						this.getOwnerComponent().getModel("itemUserModel2").setProperty("/Res_sel3", 0)
					} else if (this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext + "/Recipient/Res_sel3") ===
						"No" ||
						this.getOwnerComponent().getModel("repTableModel").getProperty("/" + this.bindingContext + "/Recipient/Res_sel3") === 1) {
						this.getOwnerComponent().getModel("itemUserModel2").setProperty("/jusficationVisibleform_Justification3", false);
						this.getOwnerComponent().getModel("itemUserModel2").setProperty("/Res_sel3", 1);
						this.getOwnerComponent().getModel("itemUserModel2").setProperty("/form_Justification3", "");

					} else {
						this.getOwnerComponent().getModel("itemUserModel2").setProperty("/jusficationVisibleform_Justification3", false);
						this.getOwnerComponent().getModel("itemUserModel2").setProperty("/Res_sel3", -1);
						this.getOwnerComponent().getModel("itemUserModel2").setProperty("/form_Justification3", "");
					}
					this.getView().getModel("itemUserModel2").updateBindings(true);
					this.getView().getModel("itemUserModel2").refresh();

				}
			}
		},
		//  _onCountryValueHelpRequest : function() {
		//            var that = this;
		//            var  lob = that.getOwnerComponent().getModel("itemUserModel2").getProperty("/RECIPIENT_COUNTRY");
		//            var oValueHelpDialog_RespDiv = new sap.m.SelectDialog({
		//                title: "Choose Value for Country",
		//                items: {
		//                    path: "/eFormCountries",
		//                    template: new sap.m.StandardListItem({
		//                        title: "{NAME}",
		//                        active: true
		//                    })
		//                },
		//Shipping Point can be searched using Search Bar
		//                search: function(oEvent) {
		//                    var sValue = oEvent.getParameter("value");
		//                    var oFilter = new sap.ui.model.Filter(
		//                        "COUNTRY",
		//                        sap.ui.model.FilterOperator.Contains, sValue
		//                    );
		//                    oEvent.getSource().getBinding("items").filter([oFilter]);
		//                },
		//                confirm: function(oEvent) {
		//                    var oSelectedItem = oEvent.getParameter("selectedItem");
		//                    if (oSelectedItem) {
		//                        //lob.setValue(oSelectedItem.getTitle());
		//                      that.getOwnerComponent().getModel("itemUserModel2").setProperty("/RECIPIENT_COUNTRY",oSelectedItem.getTitle());
		//                      that.getOwnerComponent().getModel("itemUserModel2").setProperty("/RECIPIENT_COUNTRY_ID",oSelectedItem.getTitle());
		//                    }
		//                }
		//            });
		//            var model = this.getOwnerComponent().getModel("oDataModel");
		//            oValueHelpDialog_RespDiv.setModel(model);
		//            oValueHelpDialog_RespDiv.open();
		//        },
		_onStateValueHelpRequest: function () {
			var that = this;
			var lob = this.getOwnerComponent().getModel("itemUserModel2").getProperty("/RECIPIENT_STATE");
			var country = this.getOwnerComponent().getModel("itemUserModel2").getProperty("/RECIPIENT_COUNTRY");
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
						that.getOwnerComponent().getModel("itemUserModel2").setProperty("/RECIPIENT_STATE", oSelectedItem.getDescription());
					}
				}
			});
			var model = this.getOwnerComponent().getModel("oDataModel");
			oValueHelpDialog_RespDiv.setModel(model);
			oValueHelpDialog_RespDiv.open();
		},
		_onCountryValueHelpRequest: function () {
			var that = this;
			var lob = that.getOwnerComponent().getModel("itemUserModel2").getProperty("/RECIPIENT_COUNTRY");
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
						that.getOwnerComponent().getModel("itemUserModel2").setProperty("/RECIPIENT_COUNTRY", oSelectedItem.getTitle());
						that.getOwnerComponent().getModel("itemUserModel2").setProperty("/RES_COUNTRY_ID", oSelectedItem.getTitle());
						var oValue = oSelectedItem.getTitle();
						if (oValue === "South Korea") {
							that.getView().byId("reciWarnId").setVisible(true);
						} else {
							that.getView().byId("reciWarnId").setVisible(false);
						}
						that.getOwnerComponent().getModel("itemUserModel2").setProperty("/RECIPIENT_STATE", "");
					}
				}
			});
			var model = this.getOwnerComponent().getModel("oDataModel");
			oValueHelpDialog_RespDiv.setModel(model);
			oValueHelpDialog_RespDiv.open();
		},
		handleRouteMatched: function (oEvent) {
			this.getView().byId("just3").setVisible("false");
			this.getView().byId("ResTextBox3").setVisible("false");
			this.getView().byId("just1").setVisible("false");
			this.getView().byId("ResTextBox1").setVisible("false");
			this.getView().byId("just2").setVisible("false");
			this.getView().byId("ResTextBox2").setVisible("false");
		},
		onRodioBtnSelect_Any_Family: function (oEvent) {
			if (oEvent.getParameters().selectedIndex === 1) {
				this.getOwnerComponent().getModel("itemUserModel2").setProperty("/jusficationVisibleform_Justification2", false);
				this.getOwnerComponent().getModel("itemUserModel2").setProperty("/Res_sel2,", 1);
				this.getOwnerComponent().getModel("itemUserModel2").setProperty("/form_Justification2", "")

			} else if (oEvent.getParameters().selectedIndex === 0) {
				this.getOwnerComponent().getModel("itemUserModel2").setProperty("/jusficationVisibleform_Justification2", true);
				this.getOwnerComponent().getModel("itemUserModel2").setProperty("/Res_sel2", 0);

			}
		},
		onRodioBtnSelect_Any_Relation: function (oEvent) {
			if (oEvent.getParameters().selectedIndex === 1) {
				this.getOwnerComponent().getModel("itemUserModel2").setProperty("/jusficationVisibleform_Justification1", false);
				this.getOwnerComponent().getModel("itemUserModel2").setProperty("/Res_sel1", 1)
				this.getOwnerComponent().getModel("itemUserModel2").setProperty("/form_Justification1", "")
			} else if (oEvent.getParameters().selectedIndex === 0) {
				this.getOwnerComponent().getModel("itemUserModel2").setProperty("/jusficationVisibleform_Justification1", true);
				this.getOwnerComponent().getModel("itemUserModel2").setProperty("/Res_sel1", 0);
			}
		},
		onRodioBtnSelect_Any_Pending: function (oEvent) {
			if (oEvent.getParameters().selectedIndex === 1) {
				this.getOwnerComponent().getModel("itemUserModel2").setProperty("/jusficationVisibleform_Justification3", false);
				this.getOwnerComponent().getModel("itemUserModel2").setProperty("/Res_sel3", 1)
				this.getOwnerComponent().getModel("itemUserModel2").setProperty("/form_Justification3", "")
			} else if (oEvent.getParameters().selectedIndex === 0) {
				this.getOwnerComponent().getModel("itemUserModel2").setProperty("/jusficationVisibleform_Justification3", true);
				this.getOwnerComponent().getModel("itemUserModel2").setProperty("/Res_sel3", 0)
			}
		},
		handleMandatFields: function () {
			var status = false;
			var obj1 = this.getOwnerComponent().getModel("itemUserModel2").getProperty("/RECIPIENT_LAST_NAME");
			if (!obj1) {
				this.getOwnerComponent().getModel("itemUserModel2").setProperty("/ReciLNameVStat", "Error");
				status = true;
			} else {
				this.getOwnerComponent().getModel("itemUserModel2").setProperty("/ReciLNameVStat", "None");
			}
			var obj2 = this.getOwnerComponent().getModel("itemUserModel2").getProperty("/RECIPIENT_FIRST_NAME");
			if (!obj2) {
				this.getOwnerComponent().getModel("itemUserModel2").setProperty("/ReciFNameVStat", "Error");
				status = true;
			} else {
				this.getOwnerComponent().getModel("itemUserModel2").setProperty("/ReciFNameVStat", "None");
			}
			var obj3 = this.getOwnerComponent().getModel("itemUserModel2").getProperty("/RECIPIENT_TITLE");
			if (!obj3) {
				this.getOwnerComponent().getModel("itemUserModel2").setProperty("/ReciTitleVStat", "Error");
				status = true;
			} else {
				this.getOwnerComponent().getModel("itemUserModel2").setProperty("/ReciTitleVStat", "None");
			}
			var obj4 = this.getOwnerComponent().getModel("itemUserModel2").getProperty("/RECIPIENT_COUNTRY");
			if (!obj4) {
				this.getOwnerComponent().getModel("itemUserModel2").setProperty("/ReciCountryVStat", "Error");
				status = true;
			} else {
				this.getOwnerComponent().getModel("itemUserModel2").setProperty("/ReciCountryVStat", "None");
			}
			var obj5 = this.getOwnerComponent().getModel("itemUserModel2").getProperty("/RECIPIENT_STATE");
			if (!obj5) {
				this.getOwnerComponent().getModel("itemUserModel2").setProperty("/ReciStateVStat", "Error");
				status = true;
			} else {
				this.getOwnerComponent().getModel("itemUserModel2").setProperty("/ReciStateVStat", "None");
			}
			var obj6 = this.getOwnerComponent().getModel("itemUserModel2").getProperty("/IS_REL_IND");
			if (!obj6) {
				this.getOwnerComponent().getModel("itemUserModel2").setProperty("/ReciRelVStat", "Error");
				status = true;
			} else {
				this.getOwnerComponent().getModel("itemUserModel2").setProperty("/ReciRelVStat", "None");
			}

			var obj7 = this.getOwnerComponent().getModel("itemUserModel2").getProperty("/RECI_BUSSI");
			if (!obj7) {
				this.getOwnerComponent().getModel("itemUserModel2").setProperty("/ReciBussiVStat", "Error");
				status = true;
			} else {
				this.getOwnerComponent().getModel("itemUserModel2").setProperty("/ReciBussiVStat", "None");
			}
			var obj8 = this.getOwnerComponent().getModel("itemUserModel2").getProperty("/Res_sel1");
			if (obj8 === -1) {
				this.getOwnerComponent().getModel("itemUserModel2").setProperty("/ValueState15", "Error");
				status = true;
			} else {
				this.getOwnerComponent().getModel("itemUserModel2").setProperty("/ValueState15", "None");
			}
			var obj9 = this.getOwnerComponent().getModel("itemUserModel2").getProperty("/Res_sel2");
			if (obj9 === -1) {
				this.getOwnerComponent().getModel("itemUserModel2").setProperty("/ValueState16", "Error");
				status = true;
			} else {
				this.getOwnerComponent().getModel("itemUserModel2").setProperty("/ValueState16", "None");
			}
			var obj10 = this.getOwnerComponent().getModel("itemUserModel2").getProperty("/Res_sel3");
			if (obj10 === -1) {
				this.getOwnerComponent().getModel("itemUserModel2").setProperty("/ValueState17", "Error");
				status = true;
			} else {
				this.getOwnerComponent().getModel("itemUserModel2").setProperty("/ValueState17", "None");
			}
			var obj11 = this.getOwnerComponent().getModel("itemUserModel2").getProperty("/form_Justification1");
			if ((obj8 === 0 && obj11 !== "") || (obj8 === -1 && obj11 === "") || (obj8 === 1 && obj11 === "")) {
				this.getOwnerComponent().getModel("itemUserModel2").setProperty("/ValueStateJustification1", "None");

			} else {
				status = true;
				this.getOwnerComponent().getModel("itemUserModel2").setProperty("/ValueStateJustification1", "Error");
			}
			var obj12 = this.getOwnerComponent().getModel("itemUserModel2").getProperty("/form_Justification2");
			if ((obj9 === 0 && obj12 !== "") || (obj9 === -1 && obj12 === "") || (obj9 === 1 && obj12 === "")) {
				this.getOwnerComponent().getModel("itemUserModel2").setProperty("/ValueStateJustification2", "None");

			} else {
				status = true;
				this.getOwnerComponent().getModel("itemUserModel2").setProperty("/ValueStateJustification2", "Error");
			}
			var obj13 = this.getOwnerComponent().getModel("itemUserModel2").getProperty("/form_Justification3");
			if ((obj10 === 0 && obj13 !== "") || (obj10 === -1 && obj13 === "") || (obj10 === 1 && obj13 === "")) {
				this.getOwnerComponent().getModel("itemUserModel2").setProperty("/ValueStateJustification3", "None");

			} else {
				status = true;
				this.getOwnerComponent().getModel("itemUserModel2").setProperty("/ValueStateJustification3", "Error");
			}
			return status;
		},
		onPressOk: function () {
			// this.handleExpenseType();
			window.from_dialog = "X";
			var status = this.handleMandatFields();
			if (status === true) {
				return;
			}
			this.getOwnerComponent().getOkConfirm("ok");
			var arr = [];
			var obj = {};
			obj.obj1 = this.getOwnerComponent().getModel("itemUserModel2").getProperty("/RECIPIENT_LAST_NAME");
			obj.obj2 = this.getOwnerComponent().getModel("itemUserModel2").getProperty("/RECIPIENT_FIRST_NAME");
			if (obj.obj1 === undefined) {
				obj.obj1 = "";
			}
			if (obj.obj2 === undefined) {
				obj.obj2 = "";
			}
			obj.obj3 = this.getOwnerComponent().getModel("itemUserModel2").getProperty("/RECIPIENT_TITLE");
			obj.obj4 = this.getOwnerComponent().getModel("itemUserModel2").getProperty("/RECIPIENT_ADD");
			obj.obj5 = this.getOwnerComponent().getModel("itemUserModel2").getProperty("/RECIPIENT_CITY");
			obj.obj6 = this.getOwnerComponent().getModel("itemUserModel2").getProperty("/RECIPIENT_STATE");
			obj.obj7 = this.getOwnerComponent().getModel("itemUserModel2").getProperty("/RECIPIENT_PC");
			obj.obj8 = this.getOwnerComponent().getModel("itemUserModel2").getProperty("/RECIPIENT_COUNTRY");
			obj.obj9 = this.getOwnerComponent().getModel("itemUserModel2").getProperty("/form_Justification2");
			obj.obj10 = this.getOwnerComponent().getModel("itemUserModel2").getProperty("/form_Justification1");
			obj.obj11 = this.getOwnerComponent().getModel("itemUserModel2").getProperty("/form_Justification3");
			if (this.getView().byId("rb1").getSelectedIndex() === 0) {
				obj.obj12 = 0;

			} else if (this.getView().byId("rb1").getSelectedIndex() === 1) {
				obj.obj12 = 1;
			} else {
				obj.obj12 = -1;
			}
			if (this.getView().byId("rb2").getSelectedIndex() === 0) {
				obj.obj13 = 0;

			} else if (this.getView().byId("rb2").getSelectedIndex() === 1) {
				obj.obj13 = 1;
			} else {
				obj.obj13 = -1;
			}
			if (this.getView().byId("rb3").getSelectedIndex() === 0) {
				obj.obj14 = 0;

			} else if (this.getView().byId("rb3").getSelectedIndex() === 1) {
				obj.obj14 = 1;
			} else {
				obj.obj14 = -1;
			}
			//obj.obj12 = this.getOwnerComponent().getModel("itemUserModel2").getProperty("/Res_sel1");
			//obj.obj13 = this.getOwnerComponent().getModel("itemUserModel2").getProperty("/Res_sel2");
			//obj.obj14 = this.getOwnerComponent().getModel("itemUserModel2").getProperty("/Res_sel3");
			obj.obj15 = this.getOwnerComponent().getModel("itemUserModel2").getProperty("/IS_REL_IND");
			obj.obj16 = this.getOwnerComponent().getModel("itemUserModel2").getProperty("/RECIPIENT_OTHER_RELATION");
			obj.obj17 = this.getOwnerComponent().getModel("itemUserModel2").getProperty("/RECI_BUSSI");
			this.getOwnerComponent().getModel("repTableModel").setProperty("/" + this.bindingContext + "/Recipient/RECIPIENT_LAST_NAME", obj.obj1);
			this.getOwnerComponent().getModel("repTableModel").setProperty("/" + this.bindingContext + "/Recipient/RECIPIENT_FIRST_NAME", obj.obj2)
			this.getOwnerComponent().getModel("repTableModel").setProperty("/" + this.bindingContext + "/Recipient/RECIPIENT_TITLE", obj.obj3)
			this.getOwnerComponent().getModel("repTableModel").setProperty("/" + this.bindingContext + "/Recipient/RECIPIENT_ADD", obj.obj4)
			this.getOwnerComponent().getModel("repTableModel").setProperty("/" + this.bindingContext + "/Recipient/RECIPIENT_CITY", obj.obj5)
			this.getOwnerComponent().getModel("repTableModel").setProperty("/" + this.bindingContext + "/Recipient/RECIPIENT_STATE", obj.obj6)
			this.getOwnerComponent().getModel("repTableModel").setProperty("/" + this.bindingContext + "/Recipient/RECIPIENT_PC", obj.obj7)
			this.getOwnerComponent().getModel("repTableModel").setProperty("/" + this.bindingContext + "/Recipient/RECIPIENT_COUNTRY", obj.obj8)
			this.getOwnerComponent().getModel("repTableModel").setProperty("/" + this.bindingContext + "/Recipient/title", obj.obj1 + ", " +
				obj.obj2);
			this.getOwnerComponent().getModel("repTableModel").setProperty("/" + this.bindingContext + "/Recipient/form_Justification2", obj.obj9);
			this.getOwnerComponent().getModel("repTableModel").setProperty("/" + this.bindingContext + "/Recipient/form_Justification1", obj.obj10);
			this.getOwnerComponent().getModel("repTableModel").setProperty("/" + this.bindingContext + "/Recipient/form_Justification3", obj.obj11);
			this.getOwnerComponent().getModel("repTableModel").setProperty("/" + this.bindingContext + "/Recipient/Res_sel1", obj.obj12);
			this.getOwnerComponent().getModel("repTableModel").setProperty("/" + this.bindingContext + "/Recipient/Res_sel2", obj.obj13);
			this.getOwnerComponent().getModel("repTableModel").setProperty("/" + this.bindingContext + "/Recipient/Res_sel3", obj.obj14);
			this.getOwnerComponent().getModel("repTableModel").setProperty("/" + this.bindingContext + "/Recipient/IS_REL_IND", obj.obj15);
			this.getOwnerComponent().getModel("repTableModel").setProperty("/" + this.bindingContext + "/Recipient/RECIPIENT_OTHER_RELATION",
				obj.obj16);
			this.getOwnerComponent().getModel("repTableModel").setProperty("/" + this.bindingContext + "/Recipient/RECI_BUSSI", obj.obj17);
			// begin of changes for header data

			// end of changes for header data
			this.getView().getModel("itemUserModel2").setData({});
			if (this.Form_Num && this.action !== "copy") {
				if (this.getOwnerComponent().getModel("headerUserModel").getProperty("/isData") === true) {
					this.oRouter.navTo('GovernmentRevenue', {
						context: "Recipient"
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
					context: "Recipient"
				});
			}
		},
		onPressCancel: function () {
			window.from_dialog = "X";
			this.getView().getModel("itemUserModel2").setData({});
			if (this.Form_Num && this.action !== "copy") {
				this.oRouter.navTo("GovernmentRevenueSearch", {
					context: this.Form_Num
				});
			} else if (this.action === "copy") {
				this.oRouter.navTo("GovernmentRevenueCopy", {
					context: this.Form_Num
				});
			} else {
				this.oRouter.navTo('GovernmentRevenue', {
					context: "Recipient"
				});

			}
		}
	});
}, true);