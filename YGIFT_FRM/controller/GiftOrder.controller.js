var that;
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/m/MessagePopover",
	"sap/m/MessagePopoverItem",
	"YGIFT_FRM/model/formatter"
], function (Controller, MessageBox, MessagePopover, MessagePopoverItem, formatter) {
	"use strict";
	var copy_case;
	var create_case;
	var compCode;
	var display_case;
	var edit_case;
	var validate_error;
	var e_form_num = "";
	var eform_status = "Data Saved";
	var file_size;
	var index_counter = 0;
	var logger_name = "";
	var button_press;
	var aMockMessages;
	var flag_check = 0;
	var rec_cat;
	var occasion;
	var gift;
	var giftpurch;
	var GiftOrder;
	return Controller.extend("YGIFT_FRM.controller.GiftOrder", {
		formatter: formatter,

		_onObjectMatched: function (oEvent) {
			// Displaying handled
			this.flag;
			GiftOrder = this;
			//Reset display of Approve & reject buttons
			this.getView().byId("b_approve").setVisible(false);
			this.getView().byId("b_reject").setVisible(false);
			var eform_dsp = oEvent.getParameters().arguments.context;
			if (eform_dsp !== undefined) {
				if (eform_dsp.toLowerCase().indexOf("copy") > -1) {
					//Copy scenario
					var array = eform_dsp.split('#');
					eform_dsp = array[0];
					e_form_num = eform_dsp;
					copy_case = "X";

				} else {
					//Display scenario
					copy_case = "";
					e_form_num = eform_dsp;
				}
				this.displayfields();

			} else {
				var localData = {
					REC_CATEGORY: "",
					OCCASION: "",
					OCCASION_DESC: "",
					GIFT: "",
					GIFT_DESC: "",
					HOW_PURCHASED: "",
					GIFT_PURCHASED: -1,
					AWARD_TYPE: -1,
					DATE_OF_PURCHASE: "",
					DELIVERY_DATE: "",
					INP_AMOUNT: "",
					RECIPIENT: "",
					EMP_RECIPIENT: "",
					REC_TITLE: "",
					COMP_NAME: "",
					ADDRESS_TYPE: "",
					ADDRESS: "",
					STREET: "",
					CITY: "",
					ZIP: "",
					PHONE_TYPE: "",
					PHONE_NUMBER: "",
					CARD_MESSAGED: "",
					CARD_SIGNED: "",
					PROJECT_TYPE: "",
					COMPANY_CODE: "",
					COST_CENTER: "",
					ACC_PROJECT: "",
					ACC_GL: "",
					ACC_MPM: "",
					ACC_AMOUNT: "",
					POP_TITLE: "",
					EFORM_NUM: "",
					TITLE: "",
					DESC: "",
					ON_BEHALF_OF: "",
					PREPARER: "",
					// :NSONI3:GWDK902098:07/28/2020:Passing User Id:START
					PREPARER_ID: sap.ushell.Container.getUser().getId(),
					ON_BEHALF_OF_ID: sap.ushell.Container.getUser().getId(),
					// :NSONI3:GWDK902098:07/28/2020:Passing User Id:END
					REQUESTER_PHONE: "",
					REQUESTER_EMAIL: "",
					REQUEST_TYPE: "",
					PURPOSE: "",
					TERRITORY: "",
					REQ_DESC: "",
					APPROVE_BY_DATE: "",
					CUSTOMER_COMPANY: "",
					INSTRUCTIONS: "",
					LOB: "",
					SUBLOB: "",
					RECI_COUNTRY: "",
					STATE: "",

					suppliers: [{
						EformNum: '',
						LineNum: '',
						PROJECT_TYPE: "K (Cost Center)",
						COMPANY_CODE: "",
						COST_CENTER: "",
						ACC_PROJECT: "",
						ACC_GL: "",
						ACC_MPM: "",
						ACC_AMOUNT: "",
						CURRENCY_ACC: "",
					}],
					USERS: [{
						USERID: "",
						NAME: ""
					}],

					LOBS: [{
						LOB: "",
						SLOB_DESCRIPTION: ""
					}],
					STATES: [{
						NAME: "",
						STATE: ""
					}],
					RECICOUNTRY: [{
						NAME: "",
						COUNTRY: ""
					}],

					SUBLOBS: [{
						SUBLOB: "",
						SLOB_DESCRIPTION: ""
					}],
					REQUEST_DATE: "",
					DATE_NEEDED: "",
					VENDOR_NAME: "",
					VENDOR_ADDRESS: "",
					COMPANY_NAME: "",
					GENE_LEDGER: "",
					WBS_ELEMENT: "",
					AMOUNT: "",
					INVOICE_DESC: "",
					AMOUNT_DONATION: "",
					AMOUNT_DONATION_USD: "",
					CURRENCY: "USD",
					COUNTRY: "",
					countryName: [{
						name: "Australia"
					}, {
						name: "Phillipines"
					}, {
						name: "Japan"
					}],
					localcurrency: [{
						name: "",
						exch: ""
					}],
					requestmode: Boolean(1),
					approvers: [{
						approved: "",
						approver: "",
						// :NSONI3:GWDK902098:07/28/2020:Passing User Id:START
						approver_Id: "",
						approved_by_Id: "",
						// :NSONI3:GWDK902098:07/28/2020:Passing User Id:END
						reviewer_type: "",
						approved_by: "",
						approval_date: "",
						approval_time: "",
						manual_addition: false,
						added_by: "",
						added_on: "",
						can_edit: Boolean(0)
					}],
				};
				this.visibleFalse();
				localData.suppliers.splice(0, 1);
				localData.approvers.splice(0, 1);
				var oModelTab = new sap.ui.model.json.JSONModel();
				oModelTab.setData(localData);
				oModelTab.setSizeLimit(10000);
				this.getView().setModel(oModelTab);
				this.getView().byId("save_button").setEnabled(true);
				this.getView().byId("withdraw_button").setVisible(false);

				this.getView().byId("submit_button").setVisible(true);
				this.getView().byId("print_button").setEnabled(true);
				this.getView().byId("b_delete").setVisible(false);
				this.getView().byId("b_edit").setVisible(false);
				e_form_num = "";
				//calling initial info method to prefill data
				var model = this.getOwnerComponent().getModel("oData");
				var that = this;
				model.read("/eFormInitialInfos('1')", {
					success: function (oData, response) {
						var name = oData.NAME;

						logger_name = oData.NAME;
						that.getView().byId("text_request_date").setText(oData.DATE);
						that.getView().byId("input_on_behalf_of").setValue(name);
						that.getView().byId("text_Preparer").setText(name);
						that.getView().byId("input_emailid").setValue(oData.EMAIL);
						that.getView().byId("REQUESTER_PHONE").setValue(oData.PHONE);

						// :NSONI3:GWDK902098:07/28/2020:Passing User Id:START
						that.getView().byId("text_Preparer").data("key", response.data.USERID);
						that.getView().byId("input_on_behalf_of").data("key", response.data.USERID);
						// :NSONI3:GWDK902098:07/28/2020:Passing User Id:END

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

				var model = that.getOwnerComponent().getModel("oData");
				var that1 = this;
				model.read("/eFormProductionAccts", {
					success: function (oData, response) {
						var counter = response.data.results.length;
						var i = 0;
						var oModel = that1.getView().getModel();
						var aRows = oModel.getProperty("/USERS");
						for (i = 0; i < counter; i++) {
							var item = {
								USERID: response.data.results[i].USERID,
								NAME: response.data.results[i].NAME
							};
							aRows.push(item);
						}
						oModel.setProperty("/USERS", aRows);
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

				var model = that.getOwnerComponent().getModel("oData");
				var that1 = this;
				model.read("/eFormLobs", {
					success: function (oData, response) {
						var counter = response.data.results.length;
						var i = 0;
						var oModel = that1.getView().getModel();
						var aRows = oModel.getProperty("/LOBS");
						for (i = 0; i < counter; i++) {
							var item = {
								LOB: response.data.results[i].LOB,
								SLOB_DESCRIPTION: response.data.results[i].SLOB_DESCRIPTION
							};
							aRows.push(item);
						}
						oModel.setProperty("/LOBS", aRows);
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

				model.read("/eFormCountries", {
					success: function (oData, response) {
						var counter = response.data.results.length;
						var i = 0;
						var oModel = that1.getView().getModel();
						var aRows = oModel.getProperty("/RECICOUNTRY");
						for (i = 0; i < counter; i++) {
							var item = {
								NAME: response.data.results[i].NAME,
								COUNTRY: response.data.results[i].COUNTRY
							};
							aRows.push(item);
						}
						oModel.setProperty("/RECICOUNTRY", aRows);
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

				var msg1 = "";
				var oResourceModel = this.getView().getModel("i18n").getResourceBundle();
				var oText = oResourceModel.getText("GiftOrderForm", [msg1]);
				this.getView().byId("page").setText(oText);

				this.bindingCurrency();
				this.resetFields();
				this.resetAttachments();
				this.resetComments();

				eform_status = "Data Saved";
			}
		},
		visibleFalse: function () {
			this.getView().byId("frmEmpRec_S").setVisible(false);
			this.getView().byId("frmEmpReceipient").setVisible(false);
			this.getView().byId("frmOccDesc_s").setVisible(false);
			this.getView().byId("frmOccDesc").setVisible(false);
			this.getView().byId("frmAwardType_s").setVisible(false);
			this.getView().byId("frmAwardType").setVisible(false);
			this.getView().byId("frmGiftDesc_s").setVisible(false);
			this.getView().byId("frmGiftDesc").setVisible(false);
			this.getView().byId("frmHowHead_s").setVisible(false);
			this.getView().byId("frmHowHead").setVisible(false);
			this.getView().byId("frmHowItem_s").setVisible(false);
			this.getView().byId("frmHowItem").setVisible(false);
			this.getView().byId("giftpurchasedate_s").setVisible(false);
			this.getView().byId("giftpurchasedate").setVisible(false);
			// this.getView().byId("b_approve").setVisible(false);
			//  this.getView().byId("b_reject").setVisible(false);
			this.getView().byId("b_home").setVisible(false);
			this.getView().byId("AMOUNT_USD").setVisible(false);
			this.getView().byId("AMOUNT_USD_s").setVisible(false);

		},

		_onNavigateHome: function (value) {
			window.open("/sap/bc/ui2/flp", "_self");

		},
		navigate_inbox: function () {
			window.open("/sap/bc/ui2/flp", "_self");
			window.close();
		},

		approve_reject_button_dsp: function () {
			//Check and display Approve and Reject buttons if applicable
			var url = "/sap/opu/odata/sap/YFPSFIPFRDD0028_GIFT_EFORM_SRV/";
			var oModelData = new sap.ui.model.odata.ODataModel(url, true);
			var eform_num = e_form_num;
			var relPath = "/eFormDetermineApproverLogins?$filter=EFORM_NUM eq '" + eform_num + "'";
			var that = GiftOrder;

			oModelData.read(relPath, null, [], false, function (oData, response) {
				var msg_type = response.data.results[0].MSG_TYPE;
				if (msg_type == "S") {
					that.getView().byId("b_approve").setVisible(true);
					that.getView().byId("b_reject").setVisible(true);
				} else {
					that.getView().byId("b_approve").setVisible(false);
					that.getView().byId("b_reject").setVisible(false);
				}
			});
		},
		handleCurrency_Account: function (oEvent) {
			var table = this.byId('supplier_table');
			var index = oEvent.getSource().getParent().getParent();
			this.indxItem = table.indexOfItem(index);
			var total_Inp = table.getItems()[this.indxItem].getCells()[7].getItems()[0].getValue();
			var loccurrency = oEvent.getSource().getValue();
			var total_Inp1 = total_Inp.split(',').join('');
			// REQ0492330:RMANDAL:GWDK901959:11/27/2019:Currency conversion:START
			if (!isNaN(total_Inp1)) {
				var s = {};
				s.EXCH = String(total_Inp1);
				s.NAME = loccurrency;
				var model = this.getOwnerComponent().getModel("oData");
				var that = this;
				model.create("/eFormLocCurrencys", s, {
					async: false,
					success: function (oData, response) {
						var temp = new Intl.NumberFormat('en-US').format(oData.EXCH);
						var oTable = that.byId('supplier_table');
						oTable.getItems()[that.indxItem].getCells()[7].getItems()[0].setValue(temp);
						oTable.getItems()[that.indxItem].getCells()[7].getItems()[2].setValue(loccurrency);

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
			}
			// REQ0492330:RMANDAL:GWDK901959:11/27/2019:Currency conversion:END
		},

		onChangeEmpRecipeint: function () {
			var user = this.getView().byId("inpEmpRecipient").getSelectedItem().getAdditionalText();

			if (user) {

				var model = this.getOwnerComponent().getModel("oData");
				var that3 = this;

				model.read("/eFormProductionAccts('" + user + "')", {
					success: function (oData, response) {},
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
			}

		},

		onChangeCombo: function (oEvent) {
			var newval = oEvent.getParameter("newValue");
			var key = oEvent.getSource().getSelectedItem();

			if (newval !== "" && key === null) {
				oEvent.getSource().setValue("");
				oEvent.getSource().setValueState("Error");

			} else
				oEvent.getSource().setValueState("None");

		},
		// REQ0657166:PJAIN6:GWDK902243:04/08/2021:Dropdown to F4 Help:START
		_empRecepient_ValueHelp: function(oEvt){
		    	var employee = oEvt.getSource();
		var oValueHelpDialog_RespDiv = new sap.m.SelectDialog({
			title: "Choose Value for Employee Recepient",
			items: {
				path: "/eFormProductionAccts",
				template: new sap.m.StandardListItem({
					title: "{NAME}",
					description: "{USERID}",
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
					//employee.setValue(oSelectedItem.getTitle());
					employee.setValue(oSelectedItem.getTitle());
				
					employee.data("key", oSelectedItem.getDescription());

					//              employee.setValueState("None");
				}
			}
		});
		var model = this.getOwnerComponent().getModel("oData");
		oValueHelpDialog_RespDiv.setModel(model);
		oValueHelpDialog_RespDiv.open();	
		},

	// REQ0657166:PJAIN6:GWDK902243:04/08/2021:Dropdown to F4 Help:END

		_onInputValueHelpCurrency: function (oEvent) {
			var currency = oEvent.getSource();
			var table = this.byId('supplier_table');
			var index = oEvent.getSource().getParent().getParent();
			this.indxItem = table.indexOfItem(index);
			var total_Inp = table.getItems()[this.indxItem].getCells()[7].getItems()[0].getValue();
			this.loccurrency = oEvent.getSource().getValue();
			this.total_Inp1 = total_Inp.split(',').join('');
			this.s = {};
			this.s.EXCH = String(this.total_Inp1);
			//this.s.NAME = this.loccurrency;
			var oValueHelpDialog_WBSElement = new sap.m.SelectDialog({
				title: "Choose Value for Currency",
				items: {

					path: "/eFormLocCurrencys",

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
				//On click of Confirm, value is set to input field
				confirm: function (oEvent) {
					var oSelectedItem = oEvent.getParameter("selectedItem");
					if (oSelectedItem) {
						currency.setValue(oSelectedItem.getTitle());
						currency.setValueState("None");
					}
					// REQ0492330:RMANDAL:GWDK901959:11/27/2019:Currency conversion:START
					if (!isNaN(that.s.EXCH)) {
						var model = that.getOwnerComponent().getModel("oData");
						that.s.NAME = currency.getValue();
						model.create("/eFormLocCurrencys", that.s, {
							async: false,
							success: function (oData, response) {
								var temp = new Intl.NumberFormat('en-US').format(oData.EXCH);
								var oTable = that.byId('supplier_table');
								oTable.getItems()[that.indxItem].getCells()[7].getItems()[0].setValue(temp);
								oTable.getItems()[that.indxItem].getCells()[7].getItems()[2].setValue(that.s.NAME);

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
					}
					// REQ0492330:RMANDAL:GWDK901959:11/27/2019:Currency conversion:END
				}
			});
			var model = this.getOwnerComponent().getModel("oData");
			oValueHelpDialog_WBSElement.setModel(model);
			oValueHelpDialog_WBSElement.open();
		},

		handleEmpCategory: function (oEvt) {
			var selectedItem = oEvt.getParameter("selectedItem").getText();

			if (selectedItem === "Employee") {
				this.byId('frmEmpRec_S').setProperty("visible", true);
				this.byId('frmEmpReceipient').setProperty("visible", true);
				this.byId('frmRecipient').setProperty("visible", false);
				this.byId('frmRecp_S').setProperty("visible", false);
				this.getView().getModel().setProperty("/RECIPIENT", "");
			} else if (selectedItem !== "Employee") {
				this.byId('frmEmpReceipient').setProperty("visible", false);
				this.byId('frmEmpRec_S').setProperty("visible", false);
				this.byId('frmRecp_S').setProperty("visible", true);
				this.byId('frmRecipient').setProperty("visible", true);
				this.getView().getModel().setProperty("/EMP_RECIPIENT", "");
			}
		},

		onChangeOnBehalfOf: function () {
			var user = this.getView().byId("input_on_behalf_of").getSelectedItem().getAdditionalText();

			if (user) {

				var model = this.getOwnerComponent().getModel("oData");
				var that3 = this;

				model.read("/eFormProductionAccts('" + user + "')", {
					success: function (oData, response) {
						that3.getView().byId("REQUESTER_PHONE").setValue(oData.PHONE);
						that3.getView().byId("input_emailid").setValue(oData.EMAIL);
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
			}

		},

		_handleAmount: function (oEvent) {
			var sAmount = oEvent.getParameter("value");
			var oAmount_T = sAmount.split(',').join('');
			var regx = /[^0-9]/g;
			var res = regx.test(oAmount_T);
			if (res === false) {
				var totalUsd = new Intl.NumberFormat('en-US').format(oAmount_T);
				sap.ui.getCore().byId(oEvent.getParameter("id")).setValue(totalUsd);
			} else {
				var result = oAmount_T.match(regx);
				if (result[0] === ".") {
					var totalUsd = new Intl.NumberFormat('en-US').format(oAmount_T);
					sap.ui.getCore().byId(oEvent.getParameter("id")).setValue(totalUsd);

				} else {
					var sub_str = oAmount_T.replace(result, '');
					sub_str = sub_str.replace(sub_str, '');
					var totalUsd = new Intl.NumberFormat('en-US').format(sub_str);
					sap.ui.getCore().byId(oEvent.getParameter("id")).setValue(totalUsd);
				}
			}
			if (this.getView().byId("acc_amount").sId === oEvent.getSource().sId) {
				this.getView().getModel().setProperty("/ACC_AMOUNT", totalUsd);
			}

		},

		_onCurrencyChangeAcc: function (oEvent) {
			var table = this.byId('supplier_table');
			var index = oEvent.getSource().getParent().getParent();
			this.indxItem = table.indexOfItem(index);
			var total_Inp = table.getItems()[this.indxItem].getCells()[7].getItems()[0].getValue();
			var loccurrency = table.getItems()[this.indxItem].getCells()[7].getItems()[2].getValue();
			var total_Inp1 = total_Inp.split(',').join('');
			var s = {};
			s.EXCH = String(total_Inp1);
			s.NAME = loccurrency;
			var model = this.getOwnerComponent().getModel("oData");
			var that = this;
			// REQ0492330:RMANDAL:GWDK901959:11/27/2019:Currency conversion:START
			if (!isNaN(s.EXCH)) {
				model.create("/eFormLocCurrencys", s, {
					async: false,
					success: function (oData, response) {
						var temp = new Intl.NumberFormat('en-US').format(oData.EXCH);
						var oTable = that.byId('supplier_table');
						oTable.getItems()[that.indxItem].getCells()[7].getItems()[0].setValue(temp);

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
			}
			// REQ0492330:RMANDAL:GWDK901959:11/27/2019:Currency conversion:END
		},

		_onCurrencyChange: function () {
			//This code was generated by the layout editor.
			var total_Inp = this.getView().byId("inpAmount").getValue();
			var loccurrency = this.getView().byId("CURRENCY").getValue();
			if (loccurrency === 'USD') {
				this.getView().byId("AMOUNT_USD").setVisible(false);
				this.getView().byId("AMOUNT_USD_s").setVisible(false);
				//     this.getView().byId("amount_s1").setVisible(false);
			} else {
				this.getView().byId("AMOUNT_USD").setVisible(true);
				this.getView().byId("AMOUNT_USD_s").setVisible(true);
				//     this.getView().byId("amount_s1").setVisible(true);
			}
			var total_Inp1 = total_Inp.split(',').join('');
			var s = {};
			s.EXCH = String(total_Inp1);
			s.NAME = loccurrency;
			// REQ0492330:RMANDAL:GWDK901959:11/27/2019:Currency conversion:START
			if (!isNaN(s.EXCH)) {
				var model = this.getOwnerComponent().getModel("oData");
				var that = this;
				model.create("/eFormLocCurrencys", s, { //POST call to OData with reportheader JSON object
					async: false,
					success: function (oData, response) {
						var temp = new Intl.NumberFormat('en-US').format(oData.EXCH);
						that.getView().byId("AMOUNT_DONATION_USD").setText(temp);
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
			}
			// REQ0492330:RMANDAL:GWDK901959:11/27/2019:Currency conversion:END
		},

		onChangeCountry: function (oEvent) {
			if (oEvent != undefined) {
				this.getView().byId("inpState").setValue("");
			}

			var model = this.getOwnerComponent().getModel("oData");
			var that1 = this;
			var country = this.getView().byId("inpCountry").getValue();
			var oFilter = new sap.ui.model.Filter(
				"COUNTRY",
				sap.ui.model.FilterOperator.EQ, country
			);
			model.read("/eFormStates", {
				filters: [oFilter],
				success: function (oData, response) {
					var counter = response.data.results.length;
					var i = 0;
					var oModel = that1.getView().getModel();

					var aRows = oModel.getProperty("/STATES");

					var no_of_items = aRows.length;
					var t = no_of_items - 1;
					for (i = t; i >= 0; i--) {
						aRows.splice(i, 1);
					}
					oModel.setProperty("/STATES", aRows);

					var aRows = oModel.getProperty("/STATES");
					for (i = 0; i < counter; i++) {
						var item = {
							NAME: response.data.results[i].NAME,
							STATE: response.data.results[i].STATE
						};
						aRows.push(item);
					}
					oModel.setProperty("/STATES", aRows);
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

		onChangeLOB: function (oEvent) {

			if (oEvent != undefined) {
				this.getView().byId("input_sublob").setValue("");
			}

			var model = this.getOwnerComponent().getModel("oData");
			var that1 = this;
			var lob = this.getView().byId("input_lob").getValue();
			var oFilter = new sap.ui.model.Filter(
				"LOB",
				sap.ui.model.FilterOperator.EQ, lob
			);
			model.read("/eFormLobs", {
				filters: [oFilter],
				success: function (oData, response) {
					var counter = response.data.results.length;
					var i = 0;
					var oModel = that1.getView().getModel();

					var aRows = oModel.getProperty("/SUBLOBS");

					var no_of_items = aRows.length;
					var t = no_of_items - 1;
					for (i = t; i >= 0; i--) {
						aRows.splice(i, 1);
					}
					oModel.setProperty("/SUBLOBS", aRows);

					var aRows = oModel.getProperty("/SUBLOBS");
					for (i = 0; i < counter; i++) {
						var item = {
							SUBLOB: response.data.results[i].SUBLOB,
							SLOB_DESCRIPTION: response.data.results[i].SLOB_DESCRIPTION
						};
						aRows.push(item);
					}
					oModel.setProperty("/SUBLOBS", aRows);
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

		onChangeLOB: function (oEvent) {

			if (oEvent != undefined) {
				this.getView().byId("input_sublob").setValue("");
			}

			var model = this.getOwnerComponent().getModel("oData");
			var that1 = this;
			var lob = this.getView().byId("input_lob").getValue();
			var oFilter = new sap.ui.model.Filter(
				"LOB",
				sap.ui.model.FilterOperator.EQ, lob
			);
			model.read("/eFormLobs", {
				filters: [oFilter],
				success: function (oData, response) {
					var counter = response.data.results.length;
					var i = 0;
					var oModel = that1.getView().getModel();

					var aRows = oModel.getProperty("/SUBLOBS");

					var no_of_items = aRows.length;
					var t = no_of_items - 1;
					for (i = t; i >= 0; i--) {
						aRows.splice(i, 1);
					}
					oModel.setProperty("/SUBLOBS", aRows);

					var aRows = oModel.getProperty("/SUBLOBS");
					for (i = 0; i < counter; i++) {
						var item = {
							SUBLOB: response.data.results[i].SUBLOB,
							SLOB_DESCRIPTION: response.data.results[i].SLOB_DESCRIPTION
						};
						aRows.push(item);
					}
					oModel.setProperty("/SUBLOBS", aRows);
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

		handleSelection: function (oEvent) {
			var table = this.byId('supplier_table');
			var indx = table.indexOfItem(oEvent.getSource().getParent());
			var selectedKey = oEvent.getParameter("selectedItem").getKey();
			if (selectedKey === "project") {
				oEvent.getSource().setSelectedKey("project");
				this.getView().getModel().setProperty("/suppliers/" + [indx] + "/isComp", false);
				table.getItems()[indx].getCells()[3].setValueState("None");
				this.getView().getModel().setProperty("/suppliers/" + [indx] + "/isWBS", true);
				table.getItems()[indx].getCells()[3].setValue("");
			} else if (selectedKey === "cost") {
				oEvent.getSource().setSelectedKey("cost");
				this.getView().getModel().setProperty("/suppliers/" + [indx] + "/isComp", true);
				table.getItems()[indx].getCells()[3].setEnabled(true);
				this.getView().getModel().setProperty("/suppliers/" + [indx] + "/isWBS", false);
				table.getItems()[indx].getCells()[4].setValue("");
			}
		},
		onChangeComboBox1: function (oEvent) {
			var table = this.byId('supplier_table');
			var indx = table.indexOfItem(oEvent.getSource().getParent());
			var selectedKey = oEvent.getParameter("value");
			if (selectedKey === "P (Project)") {
				oEvent.getSource().setSelectedKey("project");
				this.getView().getModel().setProperty("/suppliers/" + [indx] + "/isComp", false);
				table.getItems()[indx].getCells()[3].setValueState("None");
				this.getView().getModel().setProperty("/suppliers/" + [indx] + "/isWBS", true);
				table.getItems()[indx].getCells()[3].setValue("");

			} else if (selectedKey === "K (Cost Center)") {
				oEvent.getSource().setSelectedKey("cost");
				this.getView().getModel().setProperty("/suppliers/" + [indx] + "/isComp", true);
				table.getItems()[indx].getCells()[3].setEnabled(true);
				this.getView().getModel().setProperty("/suppliers/" + [indx] + "/isWBS", false);
				table.getItems()[indx].getCells()[4].setValue("");
			}
		},

		_onInputValueHelpRequestProjectWBS: function (oEvt) {
			var table = this.byId('supplier_table');
			var index = oEvt.getSource().getParent();
			var indxNumber = table.indexOfItem(oEvt.getSource().getParent());
			var compCode = table.getItems()[indxNumber].getCells()[2].getValue();
			var wbs = oEvt.getSource();
			var oFilter = [new sap.ui.model.Filter("BUKRS", sap.ui.model.FilterOperator.EQ, compCode)];
			var oValueHelpDialog_WBSElement = new sap.m.SelectDialog({ //Using SelectDialog control that will allow single selection along with Search field capability
				title: "Choose Value for WBS Element",
				items: {
					path: "/HWbselemSet",
					filters: oFilter,
					template: new sap.m.StandardListItem({
						title: "{Posid}",
						description: "{Post1}",
						active: true
					})
				},
				//Shipping Point can be searched using Search Bar
				search: function (oEvent) {
					var sValue = oEvent.getParameter("value");
					var oFilter = new sap.ui.model.Filter(
						"Post1",
						sap.ui.model.FilterOperator.Contains, sValue
					);
					oEvent.getSource().getBinding("items").filter([oFilter]);
				},
				//On click of Confirm, value is set to input field
				confirm: function (oEvent) {
					var oSelectedItem = oEvent.getParameter("selectedItem");
					if (oSelectedItem) {
						wbs.setValue(oSelectedItem.getTitle());
						//                        wbs.setValueState("None");
					}
				}
			});
			var model = this.getOwnerComponent().getModel("oData"); // Setting oServiceModel defined in Copmponent.js to this value help dialog
			oValueHelpDialog_WBSElement.setModel(model);
			oValueHelpDialog_WBSElement.open(); //Opening value help dialog once data is binded to standard
		},

		_onInputValueHelpRequestCompCode: function (oEvt) {

			this.companyCode = oEvt.getSource();
			var oValueHelpDialog_compCode = new sap.m.SelectDialog({
				title: "Choose Value for Company Code",
				items: {
					path: "/eFormCompanyCodes",
					template: new sap.m.StandardListItem({
						title: "{CODE}",
						description: "{TEXT}",
						active: true
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

				confirm: function (oEvent) {
					var oSelectedItem = oEvent.getParameter("selectedItem");
					if (oSelectedItem) {
						that.companyCode.setValue(oSelectedItem.getTitle());

						// Begin of Changes for clearing Cost Center, Project WBS and GL

						that.companyCode.getParent().getAggregation("cells")[3].setValue("");
						that.companyCode.getParent().getAggregation("cells")[4].setValue("");
						that.companyCode.getParent().getAggregation("cells")[5].setValue("");

						// End of Changes for clearing Cost Center, Project WBS and GL
					}
				}
			});
			var model = this.getOwnerComponent().getModel("oData");
			oValueHelpDialog_compCode.setModel(model);
			oValueHelpDialog_compCode.open();
		},

		_onInputValueHelpRequestCostCenter: function (oEvt) {

			var costCenter = oEvt.getSource();
			var oValueHelpDialog_RespDiv = new sap.m.SelectDialog({
				title: "Choose Value Cost Center",
				items: {
					path: "/eFormCostCenters",
					template: new sap.m.StandardListItem({
						title: "{COSTCENTER}",
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
						costCenter.setValue(oSelectedItem.getTitle());
						//              costCenter.setValueState("None");
					}
				}
			});
			var model = this.getOwnerComponent().getModel("oData");
			oValueHelpDialog_RespDiv.setModel(model);
			oValueHelpDialog_RespDiv.open();
		},

		_onInputValueHelpRequestGL: function (oEvt) {
			var table = this.byId('supplier_table');
			var index = oEvt.getSource().getParent();
			var indxNumber = table.indexOfItem(oEvt.getSource().getParent());
			var compCode = table.getItems()[indxNumber].getCells()[2].getValue();
			var oFilter = [new sap.ui.model.Filter("BUKRS", sap.ui.model.FilterOperator.EQ, compCode)];
			var GL = oEvt.getSource();
			var oValueHelpDialog_RespDiv = new sap.m.SelectDialog({
				title: "Choose Value for GL",

				items: {
					filters: oFilter,
					path: "/FisshSaknrGenericSet",

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
						GL.setValue(oSelectedItem.getTitle());
						//                GL.setValueState("None");
					}
				}
			});
			var model = this.getOwnerComponent().getModel("oData");
			oValueHelpDialog_RespDiv.setModel(model);
			oValueHelpDialog_RespDiv.open();
		},

		_onInputValueHelpRequestMPM: function (oEvt) {

			var MPM = oEvt.getSource();
			var oValueHelpDialog_RespDiv = new sap.m.SelectDialog({
				title: "Choose Value for MPM",
				items: {
					path: "/eFormMPMs",
					template: new sap.m.StandardListItem({
						title: "{Material}",
						description: "{Material_Desc}",
						active: true
					})
				},
				//Shipping Point can be searched using Search Bar
				search: function (oEvent) {
					var sValue = oEvent.getParameter("value");
					var oFilter = new sap.ui.model.Filter(
						"Material",
						sap.ui.model.FilterOperator.Contains, sValue
					);
					oEvent.getSource().getBinding("items").filter([oFilter]);
				},

				confirm: function (oEvent) {
					var oSelectedItem = oEvent.getParameter("selectedItem");
					if (oSelectedItem) {
						MPM.setValue(oSelectedItem.getTitle());
						//              MPM.setValueState("None");
					}
				}
			});
			var model = this.getOwnerComponent().getModel("oData");
			oValueHelpDialog_RespDiv.setModel(model);
			oValueHelpDialog_RespDiv.open();
		},

		_onLobValueHelpRequest: function () {
			var lob = this.getView().byId("input_lob");
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
						"SLOB_DESCRIPTION",
						sap.ui.model.FilterOperator.Contains, sValue
					);
					oEvent.getSource().getBinding("items").filter([oFilter]);
				},
				liveChange: function (oEvent) {
					var sValue = oEvent.getParameter("value");
					var oFilter = new sap.ui.model.Filter(
						"SLOB_DESCRIPTION",
						sap.ui.model.FilterOperator.Contains, sValue
					);
					oEvent.getSource().getBinding("items").filter([oFilter]);
				},
				confirm: function (oEvent) {
					var oSelectedItem = oEvent.getParameter("selectedItem");
					if (oSelectedItem) {
						lob.setValue(oSelectedItem.getTitle());
						lob.setValueState("None");
					}
				}
			});
			var model = this.getOwnerComponent().getModel("oData");
			oValueHelpDialog_RespDiv.setModel(model);
			oValueHelpDialog_RespDiv.open();
		},

		_onSubLobValueHelpRequest: function () {
			var sublob = this.getView().byId("input_sublob");
			var lob = this.getView().byId("input_lob").getValue();
			var oValueHelpDialog_RespDiv = new sap.m.SelectDialog({ //Using SelectDialog control that will allow single selection along with Search field capability
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
						sublob.setValueState("None");
					}
				}
			});
			var model = this.getOwnerComponent().getModel("oData"); // Setting oServiceModel defined in Copmponent.js to this value help dialog
			oValueHelpDialog_RespDiv.setModel(model);
			oValueHelpDialog_RespDiv.open(); //Opening value help dialog once data is binded to standard list item

		},

		_onPressCopySupplierList: function () {
			var oModel = this.getView().getModel();
			var aRows = oModel.getProperty("/suppliers");
			var alength = aRows.length;
			var table = this.getView().byId("supplier_table");
			var table_items = this.getView().byId("supplier_table").getSelectedItems();
			var num_items = table_items.length;
			var counter = 0;
			var index = 0;
			for (counter = 0; counter < num_items; counter++) {
				var item1 = table_items[counter];
				var cells = item1.getCells();
				// Begin of changes for enabling WBS and Cost center on selection

				var mEnableWbs, mEnableCostCenter;
				var AccCat = cells[1].getValue();
				if (AccCat === "P (Project)") {
					mEnableWbs = true;
					mEnableCostCenter = false;
				} else {
					mEnableWbs = false;
					mEnableCostCenter = true;
				}

				// End of changes for enabling WBS and Cost center on selection
				for (var temp = 0; temp < alength; temp++) {
					var item = {
						EformNum: e_form_num,
						LineNum: parseInt(cells[0].getText()),
						PROJECT_TYPE: cells[1].getValue(),
						COMPANY_CODE: cells[2].getValue(),
						COST_CENTER: cells[3].getValue(),
						ACC_PROJECT: cells[4].getValue(),
						ACC_GL: cells[5].getValue(),
						ACC_MPM: cells[6].getValue(),
						ACC_AMOUNT: cells[7].getItems()[0].getValue(),
						CURRENCY_ACC: cells[7].getItems()[2].getValue(),
						// Begin of changes for enabling WBS and Cost center on selection
						isWBS: mEnableWbs,
						isComp: mEnableCostCenter,

						// End of changes for enabling WBS and Cost center on selection
					};
					aRows.push(item);
					break;
				}
			}
			for (var j = 1; j <= table.getModel().getData().suppliers.length; j++) {
				var index = j - 1;
				oModel.setProperty("/suppliers/" + index + "/LineNum", j.toString());
			}
			oModel.setProperty("/suppliers", aRows);
		},

		_onPressDeleteSupplierList: function () {
			var oModel = this.getView().getModel();
			var aRows = oModel.getProperty("/suppliers");
			var table = this.getView().byId("supplier_table");
			var aContexts = table.getSelectedContexts();
			for (var i = aContexts.length - 1; i >= 0; i--) {
				var oThisObj = aContexts[i].getObject();
				var index = $.map(aRows, function (obj, index) {
					if (obj === oThisObj) {
						return index;
					}
				})
				aRows.splice(index, 1);
			}
			for (var j = 1; j <= table.getModel().getData().suppliers.length; j++) {
				var index = j - 1;
				oModel.setProperty("/suppliers/" + index + "/LineNum", j.toString());
			}
			oModel.setProperty("/suppliers", aRows);
			table.removeSelections(true);
		},

		_onPressAddSupplierList: function () {
			var oModel = this.getView().getModel();
			var aRows = oModel.getProperty("/suppliers");
			var table = this.getView().byId("supplier_table");

			var arr = [];

			var data = this.getView().getModel().getProperty("/suppliers");

			if (data.length > 0) {
				for (var i = 0; i < data.length; i++) {
					arr.push(data[i]);
				}
			}

			var obj = {
				EformNum: e_form_num,
				LineNum: "",
				PROJECT_TYPE: "K (Cost Center)",
				COMPANY_CODE: "",
				COST_CENTER: "",
				ACC_PROJECT: "",
				ACC_GL: "",
				ACC_MPM: "",
				ACC_AMOUNT: "",
				CURRENCY_ACC: "USD",
				isWBS: false,
				isComp: true

			};
			arr.push(obj);

			this.getView().getModel().setProperty("/suppliers", arr);
			for (var j = 1; j <= table.getModel().getData().suppliers.length; j++) {
				var index = j - 1;
				oModel.setProperty("/suppliers/" + index + "/LineNum", j.toString());
			}

			//oModel.setProperty("/suppliers",aRows);
		},

		handleGiftPurchased: function (oEvent) {

			var index = oEvent.getParameters().selectedIndex;
			if (index === 0) {
				var oResourceModel = this.getView().getModel("i18n").getResourceBundle();
				var oText = oResourceModel.getText("Howwasgiftpurchased");
				this.byId('frmNoteShow').setProperty("visible", true);
				this.byId('giftpurchasedate').setProperty("visible", true);
				this.byId('giftpurchasedate_s').setProperty("visible", true);
				this.byId('frmHowHead').setProperty("visible", true);
				this.byId('frmHowHead_s').setProperty("visible", true);
				this.byId('how_gift_purchased').setProperty("text", oText);
				this.byId('how_gift_purchased_s').setProperty("text", oText);
				this.byId('frmHowItem').setProperty("visible", true);
				this.byId('frmHowItem_s').setProperty("visible", true);
			} else {
				var oResourceModel = this.getView().getModel("i18n").getResourceBundle();
				var oText = oResourceModel.getText("Howwillgiftpurchased");
				this.byId('frmNoteShow').setProperty("visible", false);
				this.byId('giftpurchasedate').setProperty("visible", false);
				this.byId('giftpurchasedate_s').setProperty("visible", false);
				this.byId('frmHowHead').setProperty("visible", true);
				this.byId('frmHowHead_s').setProperty("visible", true);
				this.byId('how_gift_purchased').setProperty("text", oText);
				this.byId('how_gift_purchased_s').setProperty("text", oText);
				this.byId('frmHowItem').setProperty("visible", true);
				this.byId('frmHowItem_s').setProperty("visible", true);
				this.byId('dtpGiftDelivery').setValueState("None");
				this.getView().getModel().setProperty("/DATE_OF_PURCHASE", "");
			}
		},

		_onLobValueHelpRequest: function () {
			var lob = this.getView().byId("input_lob");
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
						"SLOB_DESCRIPTION",
						sap.ui.model.FilterOperator.Contains, sValue
					);
					oEvent.getSource().getBinding("items").filter([oFilter]);
				},
				confirm: function (oEvent) {
					var oSelectedItem = oEvent.getParameter("selectedItem");
					if (oSelectedItem) {
						lob.setValue(oSelectedItem.getTitle());
						lob.setValueState("None");
					}
				}
			});
			var model = this.getOwnerComponent().getModel("oData");
			oValueHelpDialog_RespDiv.setModel(model);
			oValueHelpDialog_RespDiv.open();
		},

		_onSubLobValueHelpRequest: function () {
			var sublob = this.getView().byId("input_sublob");
			var lob = this.getView().byId("input_lob").getValue();
			var oValueHelpDialog_RespDiv = new sap.m.SelectDialog({ //Using SelectDialog control that will allow single selection along with Search field capability
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
						sublob.setValueState("None");
					}
				}
			});
			var model = this.getOwnerComponent().getModel("oData"); // Setting oServiceModel defined in Copmponent.js to this value help dialog
			oValueHelpDialog_RespDiv.setModel(model);
			oValueHelpDialog_RespDiv.open(); //Opening value help dialog once data is binded to standard list item

		},

		oMessagePopover: function (oEvent) {
			var msgPopover = sap.ui.getCore().byId('oMsgPopover');
			msgPopover.destroyItems();
			for (var j = 0; j < this.items.length; j++) {
				msgPopover.addItem(new sap.m.MessagePopoverItem({
					title: this.items[j]
				}));
			}
			this.oMessagePopover1.openBy(oEvent.getSource());

		},

		handleOccasionChange: function (oEvt) {

			var selectedItem = oEvt.getParameter("selectedItem").getText();

			if (selectedItem === "Award") {
				this.byId('frmOccDesc').setProperty("visible", true);
				this.byId('frmAwardType').setProperty("visible", true);
				this.byId('frmOccDesc_s').setProperty("visible", true);
				this.byId('frmAwardType_s').setProperty("visible", true);
			} else if (selectedItem === "Other") {
				this.byId('frmOccDesc').setProperty("visible", true);
				this.byId('inpOccasionDescription').setProperty("valueState", "None");
				this.byId('inpOccasionDescription').setProperty("value", "");
				this.byId('frmOccDesc_s').setProperty("visible", true);
				this.byId('frmAwardType').setProperty("visible", false);
				this.byId('frmAwardType_s').setProperty("visible", false);
				this.getView().getModel().setProperty("/AWARD_TYPE", -1);
			} else {
				this.byId('frmOccDesc').setProperty("visible", false);
				this.byId('frmOccDesc_s').setProperty("visible", false);
				this.byId('frmAwardType').setProperty("visible", false);
				this.byId('frmAwardType_s').setProperty("visible", false);
				this.getView().getModel().setProperty("/AWARD_TYPE", -1);
				this.getView().getModel().setProperty("/OCCASION_DESC", "");

			}
		},

		handleGiftChange: function (oEvent) {
			var selectedItem = oEvent.getParameter("selectedItem").getText();
			if (selectedItem === "Other") {
				this.byId('frmGiftDesc').setProperty("visible", true);
				this.byId('inpGiftDescription').setProperty("valueState", "None");
				this.byId('inpGiftDescription').setProperty("value", "");
				this.byId('frmGiftDesc_s').setProperty("visible", true);
			} else if (selectedItem !== "Other") {
				this.byId('frmGiftDesc').setProperty("visible", false);
				this.byId('frmGiftDesc_s').setProperty("visible", false);
			}
		},

		oMessagePopoverOpen: function () {
			var msgPopover = sap.ui.getCore().byId('oMsgPopover');
			msgPopover.destroyItems();
			for (var j = 0; j < that.items.length; j++) {
				msgPopover.addItem(new sap.m.MessagePopoverItem({
					title: that.items[j]
				}));
			}
		},

		onPrintPress: function () {

			var i;
			var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			var sText = oBundle.getText("GiftOrderForm", [""]);
			var commtTable = this.getView().byId("t_comment1").getItems();
			var appTable = this.getView().byId("approver_table").getItems();
			var attTable = this.getView().byId("t_attachment1").getItems();
			var accountTable = this.byId('supplier_table').getItems();
			var table1 = "";
			var tableApprover = "";
			var attachtable = "";
			var accountingTab = "";
			var table2 = "";
			var accountingTable = this.byId('supplier_table');

			if (accountTable.length > 0) {
				accountingTab = accountingTab + '<center><h3>' + oBundle.getText("accountingInfo") + '</h3></center><hr>' +

					"<table width='100%'><tr><td style='border:1px solid black;'>" + oBundle.getText("line") +
					"</td><td style='border:1px solid black;'>" + oBundle.getText("accountingCategory") +
					"</td><td style='border:1px solid black;'>" +
					oBundle.getText("companyCode") +
					" </td>" +
					"<td style='border:1px solid black;'>" + oBundle.getText("costCenter") +
					"</td>" +
					"<td style='border:1px solid black;'>" + oBundle.getText("ProjectWBS") +
					"</td>" +
					"<td style='border:1px solid black;'>" + oBundle.getText("GL") +
					"</td>" +
					"<td style='border:1px solid black;'>" + oBundle.getText("mpm") +
					"</td>" +
					"<td style='border:1px solid black;'>" + oBundle.getText("amount") +
					"</td></tr>";

				for (var i = 0; i < accountTable.length; i++) {
					accountingTab = accountingTab + "<tr><td style='border:1px solid black;'>" + accountingTable.getItems()[i].getCells()[0].getText() +
						"</td><td style='border:1px solid black;'>" + accountingTable.getItems()[i].getCells()[1].getValue() +
						"</td><td style='border:1px solid black;'>" +
						accountingTable.getItems()[i].getCells()[2].getValue() + "</td><td style='border:1px solid black;'>" +
						accountingTable.getItems()[i].getCells()[3].getValue() + "</td>" + "<td style='border:1px solid black;'>" +
						accountingTable.getItems()[i].getCells()[4].getValue() + "</td>" +
						"<td style='border:1px solid black;'>" +
						accountingTable.getItems()[i].getCells()[5].getValue() + "</td>" +
						"<td style='border:1px solid black;'>" +
						accountingTable.getItems()[i].getCells()[6].getValue() + "</td>" +
						"<td style='border:1px solid black;'>" +
						accountingTable.getItems()[i].getCells()[7].getItems()[0].getValue() + " " + " " + accountingTable.getItems()[i].getCells()[7]
						.getItems()[
							2].getValue() + "</td>" +

						'</tr>';
				}

				accountingTab = accountingTab + '</table>';
			}

			if (commtTable.length > 0) {
				table1 = '<center><h3>' + oBundle.getText("CommentTitle") + '</h3></center><hr>' +

					"<table width='100%'><tr><td style='border:1px solid black;'>" + oBundle.getText("Id") +
					"</td><td style='border:1px solid black;'>" + oBundle.getText("Comments") + "</td><td style='border:1px solid black;'>" +
					oBundle
					.getText("AddedBy") +
					" </td>" +
					"<td style='border:1px solid black;'>" + oBundle.getText("AddedOn") +
					"</td></tr>";

				for (var i = 0; i < commtTable.length; i++) {
					table1 = table1 + "<tr><td style='border:1px solid black;'>" + commtTable[i].mAggregations.cells[0].getText() +
						"</td><td style='border:1px solid black;'>" + commtTable[i].mAggregations.cells[1].getValue() +
						"</td><td style='border:1px solid black;'>" +
						commtTable[i].mAggregations.cells[2].getText() + "</td><td style='border:1px solid black;'>" +
						commtTable[i].mAggregations.cells[3].getText() + "</td>" +

						'</tr>';
				}

				table1 = table1 + '</table>';
			}
			if (appTable.length > 0) {
				var tableApprover =

					'<center><h3>Approvers</h3></center><hr>' +

					"<table width='100%'><tr><td style='border:1px solid black;'>" + oBundle.getText("Approved") +
					"</td><td style='border:1px solid black;'>" + oBundle.getText("Approver") +
					"</td><td style='border:1px solid black;'>" + oBundle.getText("ReviewerType") + " </td>" +
					"<td style='border:1px solid black;'>" + oBundle.getText("ApprovedBy") +
					"</td><td style='border:1px solid black;'>" + oBundle.getText("ApprovalDate") + " </td>" +
					"<td style='border:1px solid black;'>" +
					oBundle.getText("ApprovalTime(PST)") + " </td>" + "<td style='border:1px solid black;'>" +
					oBundle.getText("ManualAddition") + " </td>" + "<td style='border:1px solid black;'>" +
					oBundle.getText("AddedBy") + " </td>" + "<td style='border:1px solid black;'>" +
					oBundle.getText("AddedOn") + " </td>" +
					"</tr>";

				for (var i = 0; i < appTable.length; i++) {
					var isApproved = "";
					if (this.getView().getModel().getProperty("/approvers")[i].approved === "X") {
						isApproved = "Yes";
					} else {
						isApproved = "No";
					}
					var isManual = "";
					if (this.getView().getModel().getProperty("/approvers")[i].manual_addition === "X") {
						isManual = "Yes";
					} else {
						isManual = "No";
					}

					tableApprover = tableApprover +
						"<tr><td style='border:1px solid black;'>" + isApproved + "</td><td style='border:1px solid black;'> " + appTable[i].mAggregations
						.cells[1].getText() + "</td><td style='border:1px solid black;'>" +
						appTable[i].mAggregations.cells[2].getText() + "</td><td style='border:1px solid black;'>" +
						appTable[i].mAggregations.cells[3].getText() +
						"</td><td style='border:1px solid black;'>" + appTable[i].mAggregations.cells[4].getText() +
						"</td><td style='border:1px solid black;'>" + appTable[i].mAggregations.cells[5].getText() + " </td>" +
						"<td style='border:1px solid black;'>" + isManual + " </td><td style='border:1px solid black;'>" + appTable[i].mAggregations.cells[
							7].getText() + " </td><td style='border:1px solid black;'>" +
						appTable[i].mAggregations.cells[8].getText() + "</td></tr>";
				}
				tableApprover = tableApprover + "</table>";
			}

			if (attTable.length > 0) {

				attachtable = '<center><h3>' + oBundle.getText("Attachments") + '</h3></center><hr>' +

					"<table width='100%'><tr><td style='border:1px solid black;'>" + oBundle.getText("FileName") +
					"</td><td style='border:1px solid black;'>" + oBundle.getText("CreationDate") + "</td><td style='border:1px solid black;'>" +
					oBundle.getText("CreationTime(PST)") +
					" </td>" +
					"<td style='border:1px solid black;'>" + oBundle.getText("FileSize") +
					"</td><td style='border:1px solid black;'>" + oBundle.getText("Creator") +
					"</td></tr>";

				for (var i = 0; i < attTable.length; i++) {
					attachtable = attachtable + "<tr><td style='border:1px solid black;'>" + attTable[i].mAggregations.cells[0].getProperty("text") +
						"</td><td style='border:1px solid black;'>" + attTable[i].mAggregations.cells[1].getText() +
						"</td><td style='border:1px solid black;'>" +
						attTable[i].mAggregations.cells[2].getText() + "</td><td style='border:1px solid black;'>" +
						attTable[i].mAggregations.cells[3].getText() + "</td>" + "<td style='border:1px solid black;'>" +
						attTable[i].mAggregations.cells[4].getText() + "</td>" +

						'</tr>';
				}

				attachtable = attachtable + '</table>';
			}

			var selectedItem = this.getView().byId("cmbRecipientCategory").getValue();

			if (selectedItem === "Employee") {
				var recp =
					"<tr><td style='border:1px solid black;'>" + oBundle.getText("empRecipient") + "</td><td style='border:1px solid black;'>" +
					this.getView().getModel().getProperty("/EMP_RECIPIENT") + "</td></tr>";

			} else if (selectedItem !== "Employee") {
				var recp = "<tr><td style='border:1px solid black;'>" + oBundle.getText("Recipient") +
					"</td><td style='border:1px solid black;'>" +
					this.getView().getModel().getProperty("/RECIPIENT") + "</td></tr>";
			}

			var selectedItem1 = this.getView().byId("cmbOccasion").getValue();

			if (selectedItem1 === "Award") {

				if (this.getView().getModel().getProperty("/AWARD_TYPE") === 0) {
					var occTyp = "Win";
				} else if (this.getView().getModel().getProperty("/AWARD_TYPE") === 1) {
					var occTyp = "Nomination";
				} else {
					var occTyp = "";
				}

				var occ = "<tr><td style='border:1px solid black;'>" + oBundle.getText("occasionDesc") +
					"</td><td style='border:1px solid black;'>" +
					this.getView().getModel().getProperty("/OCCASION_DESC") + "</td></tr>" +
					"<tr><td style='border:1px solid black;'>" + oBundle.getText("awardType") + "</td><td style='border:1px solid black;'>" +
					occTyp + "</td></tr>";
			} else if (selectedItem1 === "Other") {
				var occ = "<tr><td style='border:1px solid black;'>" + oBundle.getText("occasionDesc") +
					"</td><td style='border:1px solid black;'>" +
					this.getView().getModel().getProperty("/OCCASION_DESC") + "</td></tr>";

			} else {
				var occ = "";
			}

			var selectedItem2 = this.getView().byId("cmbGift").getValue();
			var giftDes = "";
			if (selectedItem2 === "Other") {

				var giftDes = "<tr><td style='border:1px solid black;'>" + oBundle.getText("giftDesc") +
					"</td><td style='border:1px solid black;'>" +
					this.getView().getModel().getProperty("/GIFT_DESC") + "</td></tr>";
			} else if (selectedItem2 !== "Other") {
				var giftDes = "";
			}

			var index = this.getView().byId("rdbtnGiftPurchased").getSelectedIndex();
			var giftPur = "";
			if (index === 0) {
				var purchaseDate = this.getView().getModel().getProperty("/DATE_OF_PURCHASE");
				if (purchaseDate === "00000000") {
					purchaseDate = "";
				}
				var giftPur = "<tr><td style='border:1px solid black;'>" + oBundle.getText("Howwasgiftpurchased") +
					"</td><td style='border:1px solid black;'>" +
					this.getView().getModel().getProperty("/HOW_PURCHASED") + "</td></tr>" +

					"<tr><td style='border:1px solid black;'>" + oBundle.getText("dateOfPurchase") + "</td><td style='border:1px solid black;'>" +
					purchaseDate + "</td></tr>";

			} else if (index === 1) {
				var giftPur = "<tr><td style='border:1px solid black;'>" + oBundle.getText("Howwillgiftpurchased") +
					"</td><td style='border:1px solid black;'>" +
					this.getView().getModel().getProperty("/HOW_PURCHASED") + "</td></tr>";
			} else {
				var giftPur = "";
			}
			var hasTheGiftPurchasedId = this.getView().getModel().getProperty("/GIFT_PURCHASED");
			var hasTheGiftPurchased = "";
			if (hasTheGiftPurchasedId === 0) {
				hasTheGiftPurchased = "Yes";
			} else if (hasTheGiftPurchasedId === 1) {
				hasTheGiftPurchased = "No";
			} else if (hasTheGiftPurchasedId === -1) {
				hasTheGiftPurchased = "";
			}

			if (this.getView().getModel().getProperty("/card_type") === "Ariba System Card") {
				var s = "<tr><td style='border:1px solid black;'>" + oBundle.getText("EMDTitle") + "</td><td style='border:1px solid black;'>" +

					this.getView().getModel().getProperty("/emd_title") + "</td></tr>" +
					"<tr><td style='border:1px solid black;'>" + oBundle.getText("AribaCardName") + "</td><td style='border:1px solid black;'>" +

					this.getView().getModel().getProperty("/ariba_card_name") + "</td></tr>";
			} else {
				var s = "";
			}

			var header =
				"<body><table width='100%' ><tr><th style='border:1px solid black; background-color: #dddddd;'>" + this.getView().byId("page").getText() +
				"</th></tr></table>" +
				"<table width='100%' ><tr><th style='border:1px solid black;'>" +
				this.getView().getModel().getProperty("/TITLE") +
				"</td></tr></table><table width='100%' ><tr><td style='border:1px solid black;'>" + oBundle.getText("Description") +
				"</td><td style='border:1px solid black;'>" +
				this.getView().getModel().getProperty("/DESC") + "</td></tr>" + "<tr><td style='border:1px solid black;'>" + oBundle.getText(
					"RequestDate") + "</td><td style='border:1px solid black;'>" +

				this.getView().getModel().getProperty("/REQUEST_DATE") + "</td></tr>" +
				"<tr><td style='border:1px solid black;'>" + oBundle.getText("Preparer") + "</td><td style='border:1px solid black;'>" +

				this.getView().getModel().getProperty("/PREPARER") + "</td></tr>" +
				"<tr><td style='border:1px solid black;'>" + oBundle.getText("OnBehalfof") + "</td><td style='border:1px solid black;'>" +

				this.getView().getModel().getProperty("/ON_BEHALF_OF") + "</td></tr>" +

				"<tr><td style='border:1px solid black;'>" + oBundle.getText("Lob") + "</td><td style='border:1px solid black;'>" +
				this.getView().getModel().getProperty("/LOB") + "</td></tr>" +

				"<tr><td style='border:1px solid black;'>" + oBundle.getText("SubLob") + "</td><td style='border:1px solid black;'>" +
				this.getView().getModel().getProperty("/SUBLOB") + "</td></tr>" +
				"<tr><td style='border:1px solid black;'>" + oBundle.getText("E-MailAddress") + "</td><td style='border:1px solid black;'>" +
				this.getView().getModel().getProperty("/REQUESTER_EMAIL") + "</td></tr>" +

				"<tr><td style='border:1px solid black;'>" + oBundle.getText("ReqPhoneNumber") + "</td><td style='border:1px solid black;'>" +
				this.getView().getModel().getProperty("/REQUESTER_PHONE") + "</td></tr>" +

				"<tr><td style='border:1px solid black;'>" + oBundle.getText("territory") + "</td><td style='border:1px solid black;'>" +
				this.getView().getModel().getProperty("/TERRITORY") + "</td></tr>" +

				"<tr><td style='border:1px solid black;'>" + oBundle.getText("recipientCategory") + "</td><td style='border:1px solid black;'>" +
				this.getView().getModel().getProperty("/REC_CATEGORY") + "</td></tr>" + recp + s +

				"<tr><td style='border:1px solid black;'>" + oBundle.getText("recipientTitle") + "</td><td style='border:1px solid black;'>" +
				this.getView().getModel().getProperty("/REC_TITLE") + "</td></tr>" +

				"<tr><td style='border:1px solid black;'>" + oBundle.getText("companyName") + "</td><td style='border:1px solid black;'>" +
				this.getView().getModel().getProperty("/COMP_NAME") +

				"<tr><td style='border:1px solid black;'>" + oBundle.getText("recipientCountry") + "</td><td style='border:1px solid black;'>" +
				this.getView().getModel().getProperty("/RECI_COUNTRY") + "</td></tr>" +

				"<tr><td style='border:1px solid black;'>" + oBundle.getText("occasion") + "</td><td style='border:1px solid black;'>" +
				this.getView().getModel().getProperty("/OCCASION") + "</td></tr>" +
				occ +
				"<tr><td style='border:1px solid black;'>" + oBundle.getText("Gift") + "</td><td style='border:1px solid black;'>" +
				this.getView().getModel().getProperty("/GIFT") + "</td></tr>" +

				giftDes +
				"<tr><td style='border:1px solid black;'>" + oBundle.getText("HastheGiftBeenPurchased") +
				"</td><td style='border:1px solid black;'>" +
				hasTheGiftPurchased + "</td></tr>" +
				giftPur +
				"<tr><td style='border:1px solid black;'>" + oBundle.getText("dateOfDelivery") + "</td><td style='border:1px solid black;'>" +
				this.getView().getModel().getProperty("/DELIVERY_DATE") + "</td></tr>" +
				"<tr><td style='border:1px solid black;'>" + oBundle.getText("amount") + "</td><td style='border:1px solid black;'>" +
				this.getView().getModel().getProperty("/INP_AMOUNT") + " " + this.getView().getModel().getProperty("/CURRENCY") + "</td></tr>" +
				"<tr><td style='border:1px solid black;'>" + oBundle.getText("AmountUSD") + "</td><td style='border:1px solid black;'>" +
				this.getView().getModel().getProperty("/AMOUNT_DONATION_USD") + "</td></tr>" +
				"<tr><td style='border:1px solid black;'>" + oBundle.getText("AddressType") + "</td><td style='border:1px solid black;'>" +
				this.getView().getModel().getProperty("/ADDRESS_TYPE") + "</td></tr>" +
				"<tr><td style='border:1px solid black;'>" + oBundle.getText("Address") + "</td><td style='border:1px solid black;'>" +
				this.getView().getModel().getProperty("/ADDRESS") + "</td></tr>" +

				"<tr><td style='border:1px solid black;'>" + oBundle.getText("country") + "</td><td style='border:1px solid black;'>" +
				this.getView().getModel().getProperty("/COUNTRY") + "</td></tr>" +
				"<tr><td style='border:1px solid black;'>" + oBundle.getText("City") + "</td><td style='border:1px solid black;'>" +
				this.getView().getModel().getProperty("/CITY") + "</td></tr>" +
				"<tr><td style='border:1px solid black;'>" + oBundle.getText("state") + "</td><td style='border:1px solid black;'>" +
				this.getView().getModel().getProperty("/STATE") + "</td></tr>" +

				"<tr><td style='border:1px solid black;'>" + oBundle.getText("postalCode") + "</td><td style='border:1px solid black;'>" +
				this.getView().getModel().getProperty("/ZIP") + "</td></tr>" +
				"<tr><td style='border:1px solid black;'>" + oBundle.getText("phoneType") + "</td><td style='border:1px solid black;'>" +
				this.getView().getModel().getProperty("/PHONE_TYPE") + "</td></tr>" +
				"<tr><td style='border:1px solid black;'>" + oBundle.getText("phoneNumber") + "</td><td style='border:1px solid black;'>" +
				this.getView().getModel().getProperty("/PHONE_NUMBER") + "</td></tr>" +
				"<tr><td style='border:1px solid black;'>" + oBundle.getText("cardMessage") + "</td><td style='border:1px solid black;'>" +
				this.getView().getModel().getProperty("/CARD_MESSAGED") + "</td></tr>" +
				"<tr><td style='border:1px solid black;'>" + oBundle.getText("cardTobeSignedBy") + "</td><td style='border:1px solid black;'>" +
				this.getView().byId("txtCardSigned").getValue() + "</td></tr></table>" +

				"</body>";

			var cltstrng = "width=500px,height=600px";
			var wind = window.open("", cltstrng);
			wind.document.write(header + accountingTab + tableApprover + attachtable + table1);
			//wind.save();
			wind.print();

		},

		handleMessagePopoverPress: function (oEvent) {
			oMessagePopover.toggle(oEvent.getSource());
		},

		handleAmoutFormatterByTotal: function (oEvent) {
			var sAmount = oEvent.getParameter("value");
			var a = sAmount.split(',').join('');
			var str1;
			var str2;
			var regx = /[^0-9]/g;
			var res = regx.test(a);
			if (res === false) {
				var totalUsd = new Intl.NumberFormat('en-US').format(a);
				sap.ui.getCore().byId(oEvent.getParameter("id")).setValue(totalUsd);
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
			}
			if (this.getView().byId("inpAmount").sId === oEvent.getSource().sId) {
				this.getView().getModel().setProperty("/AMOUNT", totalUsd);
			}
			this._onCurrencyChange();
		},

		onBusinessPhoneLiveChange: function (oEvent) {
			var value = oEvent.getParameter("value");
			if (value !== "") {
				var regx = /[^0-9-]/g;

				var res = regx.test(value);
				if (res === true) {
					var result = value.match(regx);
					var substr = value.replace(result, '');
					oEvent.getSource().setValue(substr);
				}
			}

		},
		handleAmountFormatting: function (value) {
			if (value && this.flag !== true) {
				var oValue = value.split(',').join('');;
				var totalUsd = new Intl.NumberFormat('en-US').format(oValue);
				return totalUsd;
			} else {
				return value;
			}
		},
		bindingCurrency: function () {
			var model = this.getOwnerComponent().getModel("oData");
			var that = this;
			model.read("/eFormLocCurrencys", {
				success: function (oData, response) {
					var counter = response.data.results.length;
					var i = 0;
					var oModel = that.getView().getModel();
					var aRows = oModel.getProperty("/localcurrency");
					for (i = 0; i < counter; i++) {
						var item = {
							name: response.data.results[i].NAME,
							exch: response.data.results[i].EXCH
						};
						aRows.push(item);
					}
					oModel.setProperty("/localcurrency", aRows);
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
		showData: function () {
			// create scenerio begins here
			//creating local json model
			var localData = {
				EFORM_NUM: "",
				TITLE: "",
				DESC: "",
				ON_BEHALF_OF: "",
				REQUESTER_PHONE: "",
				REQUESTER_EMAIL: "",
				REQUEST_TYPE: "",
				PURPOSE: "",
				TERRITORY: "",
				APPROVE_BY_DATE: "",
				CUSTOMER_COMPANY: "",
				INSTRUCTIONS: "",
				REQUEST_DATE: "",
				DATE_NEEDED: "",
				VENDOR_NAME: "",
				VENDOR_ADDRESS: "",
				COMPANY_CODE: "",
				COMPANY_NAME: "",
				GENE_LEDGER: "",
				WBS_ELEMENT: "",
				AMOUNT: "",
				INVOICE_DESC: "",
				AMOUNT_DONATION: "",
				AMOUNT_DONATION_USD: "",
				CURRENCY: "USD",
				localcurrency: [{
					name: "",
					exch: ""
				}],
				requestmode: Boolean(1),
				approvers: [{
					approved: "",
					approver: "",
					reviewer_type: "",
					approved_by: "",
					approval_date: "",
					approval_time: "",
					manual_addition: false,
					added_by: "",
					added_on: "",
					can_edit: Boolean(0)
				}],
			};
			var model = this.getOwnerComponent().getModel("oData");
			var that = this;
			model.read("/eFormLocCurrencys", {
				success: function (oData, response) {
					var counter = response.data.results.length;
					var i = 0;
					var oModel = that.getView().getModel();
					var aRows = oModel.getProperty("/localcurrency");
					for (i = 0; i < counter; i++) {
						var item = {
							name: response.data.results[i].NAME,
							exch: response.data.results[i].EXCH
						};
						aRows.push(item);
					}
					oModel.setProperty("/localcurrency", aRows);
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
			var oModelTab = new sap.ui.model.json.JSONModel();
			oModelTab.setData(localData);
			oModelTab.setSizeLimit(10000);
			this.getView().setModel(oModelTab);
			this.getView().byId("save_button").setEnabled(true);
			this.getView().byId("withdraw_button").setVisible(false);

			this.getView().byId("submit_button").setVisible(true);
			this.getView().byId("print_button").setEnabled(true);
			this.getView().byId("b_delete").setVisible(false);
			this.getView().byId("b_edit").setVisible(false);
			e_form_num = "";
			//calling initial info method to prefill data
			var model = this.getOwnerComponent().getModel("oData");
			var that = this;
			model.read("/eFormInitialInfos('1')", {
				success: function (oData, response) {
					var name = oData.NAME;
					var title = name + '-' + 'Gift Order Form';
					logger_name = oData.NAME;
					that.getView().byId("input_title").setValue(title);
					that.getView().byId("text_request_date").setText(oData.DATE);
					that.getView().byId("input_on_behalf_of").setValue(name);
					that.getView().byId("text_Preparer").setText(name);
					that.getView().byId("input_emailid").setValue(oData.EMAIL);
					that.getView().byId("REQUESTER_PHONE").setValue(oData.PHONE);
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
			this.resetFields();
			this.resetAttachments();
			this.resetComments();
			e_form_num = "";
			eform_status = "Data Saved";
		},

		onInit: function () {

			that = this;
			this.btnIncrementAfter = 0;

			var oModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oModel, "viewData");
			this.getView().getModel("viewData").setProperty("/Footval", []);
			sap.m.DatePicker.prototype.onAfterRendering = function (e) {

				$('#' + e.srcControl.getId() + "-inner").prop('readonly', true);

			};

			this.mBindingOptions = {};
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.attachRouteMatched(this._onObjectMatched, this);
		},

		fillComments: function (that) {
			var relPath = "/eFormComments";
			var model = that.getOwnerComponent().getModel("oData");
			var that1 = that;
			var oFilter = new sap.ui.model.Filter(
				"FORM_NO",
				sap.ui.model.FilterOperator.EQ, e_form_num
			);
			model.read(relPath, {
				filters: [oFilter],
				success: function (oData, response) {
					that1.getView().byId("t_comment1").destroyItems();
					var counter = oData.results.length;
					var i = 0;
					for (i = 0; i < counter; i++) {
						var table = that1.getView().byId("t_comment1");
						var vedit = oData.results[i].EDIT;
						var data = new sap.m.ColumnListItem({
							cells: [
								new sap.m.Text({
									text: oData.results[i].SEQUENCE
								}),
								new sap.m.TextArea({
									value: oData.results[i].COMMENTS,
									rows: 2,
									cols: 70,
									enabled: vedit
								}),
								new sap.m.Text({
									text: oData.results[i].CREATOR
								}),
								new sap.m.Text({
									text: oData.results[i].CR_DATE
								})
							]
						})
						table.addItem(data);
					} //for
					that1.getView().byId("t_comment2").destroyItems();
					var counter = oData.results.length;
					var i = 0;
					for (i = 0; i < counter; i++) {
						var table = that1.getView().byId("t_comment2");
						var vedit = oData.results[i].EDIT;
						var data = new sap.m.ColumnListItem({
							cells: [
								new sap.m.Text({
									text: oData.results[i].SEQUENCE
								}),
								new sap.m.TextArea({
									value: oData.results[i].COMMENTS,
									rows: 2,
									cols: 70,
									enabled: vedit
								}),
								new sap.m.Text({
									text: oData.results[i].CREATOR
								}),
								new sap.m.Text({
									text: oData.results[i].CR_DATE
								})
							]
						})
						table.addItem(data);
					} //for
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
		fillAttachments: function (that_1) {
			var model = that_1.getOwnerComponent().getModel("oData");
			var relPath = "/eFormAttachments";
			var that = that_1;
			var oFilter = new sap.ui.model.Filter(
				"EFORM_NUM",
				sap.ui.model.FilterOperator.EQ, e_form_num
			);
			model.read(relPath, {
				filters: [oFilter],
				success: function (oData, response) {
					that.getView().byId("t_attachment1").destroyItems();
					that.getView().byId("t_attachment2").destroyItems();
					var counter = oData.results.length;
					var i = 0;
					for (i = 0; i < counter; i++) {
						var table1 = that.getView().byId("t_attachment1");
						var table2 = that.getView().byId("t_attachment2");
						var data1 = new sap.m.ColumnListItem({
							cells: [
								new sap.m.Link({
									text: response.data.results[i].FILE_NAME,
									press: function (oEvent) {
										var that2 = that;
										var oSource = oEvent.getSource();
										var relPath = "/sap/opu/odata/sap/YFPSFIPFRDD0028_GIFT_EFORM_SRV/eFormAttachments(EFORM_NUM='" + e_form_num + "'" +
											",FILE_NAME='" + oSource.getText() + "')/$value";
										window.open(relPath, '_blank');
									}
								}),
								new sap.m.Text({
									text: response.data.results[i].CREATION_DT
								}),
								new sap.m.Text({
									text: response.data.results[i].CREATION_TIME
								}),
								new sap.m.Text({
									text: response.data.results[i].FILE_SIZE
								}),
								new sap.m.Text({
									text: response.data.results[i].CREATED_BY
								})
							]
						});
						var data2 = new sap.m.ColumnListItem({
							cells: [
								new sap.m.Link({
									text: response.data.results[i].FILE_NAME,
									press: function (oEvent) {
										var that2 = that;
										var oSource = oEvent.getSource();
										var relPath = "/sap/opu/odata/sap/YFPSFIPFRDD0028_GIFT_EFORM_SRV/eFormAttachments(EFORM_NUM='" + e_form_num + "'" +
											",FILE_NAME='" + oSource.getText() + "')/$value";
										window.open(relPath, '_blank');
									}
								}),
								new sap.m.Text({
									text: response.data.results[i].CREATION_DT
								}),
								new sap.m.Text({
									text: response.data.results[i].CREATION_TIME
								}),
								new sap.m.Text({
									text: response.data.results[i].FILE_SIZE
								}),
								new sap.m.Text({
									text: response.data.results[i].CREATED_BY
								})
							]
						});
						table1.addItem(data1);
						table2.addItem(data2);
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
		displayfields: function () {
			this.getView().byId("b_delete").setVisible(true);
			this.getView().byId("b_edit").setVisible(true);
			this.getView().byId("textarea_comments").setValue("");
			this.getView().byId("textarea_comments2").setValue("");
			var model = this.getOwnerComponent().getModel("oData");
			var relPath = "/eFormGiftFormHs";
			var that1 = this;
			if (copy_case !== "X") {
				this.approve_reject_button_dsp();
			}
			var oFilter = new sap.ui.model.Filter(
				"EFORM_NUM",
				sap.ui.model.FilterOperator.EQ, e_form_num
			);

			model.read(relPath, {
				filters: [oFilter],
				urlParameters: {
					"$expand": "GiftForm_H_Approvers,GiftForm_H_Items"
				},
				success: function (oData, response) {

					// :NSONI3:GWDK902098:07/28/2020:Passing User Id:START
					that1.getView().byId("text_Preparer").data("key", oData.results[0].PREPARER_ID);
					that1.getView().byId("input_on_behalf_of").data("key", oData.results[0].ON_BEHALF_OF_ID);
					// :NSONI3:GWDK902098:07/28/2020:Passing User Id:END

					//creating local json model

					var gift_purch = oData.results[0].GIFT_PURCHASED;
					var award_type = oData.results[0].AWARD_TYPE;

					if (gift_purch === "")
						gift_purch = parseInt(-1);
					else
						gift_purch = parseInt(oData.results[0].GIFT_PURCHASED);

					if (award_type === "")
						award_type = parseInt(-1);
					else
						award_type = parseInt(oData.results[0].AWARD_TYPE);

					var localData = {
						// :NSONI3:GWDK902098:07/28/2020:Passing User Id:START
						PREPARER_ID: oData.results[0].PREPARER_ID,
						ON_BEHALF_OF_ID: oData.results[0].ON_BEHALF_OF_ID,
						// :NSONI3:GWDK902098:07/28/2020:Passing User Id:END
						ADDRESS: oData.results[0].ADDRESS,
						EFORM_NUM: oData.results[0].EFORM_NUM,
						TITLE: oData.results[0].TITLE,
						DESC: oData.results[0].DESCRIP,
						REQUEST_DATE: oData.results[0].REQUEST_DATE,
						PREPARER: oData.results[0].PREPARER,
						ON_BEHALF_OF: oData.results[0].ON_BEHALF_OF,
						REQUESTER_PHONE: oData.results[0].REQUESTER_PHONE,
						REQUESTER_EMAIL: oData.results[0].REQUESTER_EMAIL,
						LOB: oData.results[0].LOB,
						SUBLOB: oData.results[0].SUBLOB,
						TERRITORY: oData.results[0].TERRITORY,
						RECI_COUNTRY: oData.results[0].RECIPIENT_COUNTRY,
						REC_CATEGORY: oData.results[0].RECIEPIENT_CAT,
						RECIPIENT: oData.results[0].RECIPIENT,
						EMP_RECIPIENT: oData.results[0].EMPLOYEE_RECIPIENT,
						COMP_NAME: oData.results[0].COMPANY_SHOW,
						REC_TITLE: oData.results[0].RECIPIENT_TITLE,
						OCCASION: oData.results[0].OCCASION,
						OCCASION_DESC: oData.results[0].OCCASION_DESC,
						GIFT: oData.results[0].GIFT,
						GIFT_DESC: oData.results[0].GIFT_DESC,
						HOW_PURCHASED: oData.results[0].GIFT_PURCHASED_DESC,
						DATE_OF_PURCHASE: oData.results[0].DATE_OF_PURCHASE,
						COUNTRY: oData.results[0].COUNTRY,
						STATE: oData.results[0].STATE,
						DELIVERY_DATE: oData.results[0].DATE_OF_DLVRY,
						ADDRESS_TYPE: oData.results[0].ADDRESS_TYPE,
						STREET: oData.results[0].COUNTRY,
						STATE: oData.results[0].STATE,
						CITY: oData.results[0].CITY,
						ZIP: oData.results[0].ZIP,
						PHONE_TYPE: oData.results[0].PHONE_TYPE,
						PHONE_NUMBER: oData.results[0].PHONE_NUM,
						CARD_MESSAGED: oData.results[0].CARD_MESSAGE,
						CARD_SIGNED: oData.results[0].CARD_SIGNED_BY,
						AMOUNT_DONATION_USD: new Intl.NumberFormat('en-US').format(oData.results[0].AMOUNT_CONVERTED),
						CURRENCY: oData.results[0].CURRENCY,
						INP_AMOUNT: new Intl.NumberFormat('en-US').format(oData.results[0].AMOUNT),
						requestmode: Boolean(0),
						GIFT_PURCHASED: gift_purch,
						AWARD_TYPE: award_type,
						localcurrency: [{
							name: "",
							exch: ""
						}],
						USERS: [{
							USERID: "",
							NAME: ""
						}],

						LOBS: [{
							LOB: "",
							SLOB_DESCRIPTION: ""
						}],
						STATES: [{
							NAME: "",
							STATE: ""
						}],
						RECICOUNTRY: [{
							NAME: "",
							COUNTRY: ""

						}],

						SUBLOBS: [{
							SUBLOB: "",
							SLOB_DESCRIPTION: ""
						}],
						suppliers: [],
						approvers: [{
							approved: "",
							approver: "",
							// :NSONI3:GWDK902098:07/28/2020:Passing User Id:START
							approver_Id: "",
							approved_by_Id: "",
							// :NSONI3:GWDK902098:07/28/2020:Passing User Id:END
							reviewer_type: "",
							approved_by: "",
							approval_date: "",
							approval_time: "",
							manual_addition: false,
							added_by: "",
							added_on: "",
							can_edit: Boolean(0)
						}],
					};

					var oModelTab = new sap.ui.model.json.JSONModel();
					oModelTab.setData(localData);
					oModelTab.setSizeLimit(10000);
					that1.getView().setModel(oModelTab);
					that1.bindingCurrency();

					e_form_num = oData.results[0].EFORM_NUM;
					eform_status = oData.results[0].STATUS;
					rec_cat = oData.results[0].RECIEPIENT_CAT;
					occasion = oData.results[0].OCCASION;
					gift = oData.results[0].GIFT;

					var bpRows = oModelTab.getProperty("/suppliers");
					var counter = oData.results[0].GiftForm_H_Items.results.length;
					var no_of_items = bpRows.length;
					var t = no_of_items - 1;
					var i;
					for (i = t; i >= 0; i--) {
						bpRows.splice(i, 1);
					}
					oModelTab.setProperty("/suppliers", bpRows);

					for (i = 0; i < counter; i++) {

						var item = {
							EformNum: oData.results[0].GiftForm_H_Items.results[i].EFORM_NUM,
							LineNum: oData.results[0].GiftForm_H_Items.results[i].LINE_NUM,
							PROJECT_TYPE: oData.results[0].GiftForm_H_Items.results[i].ACCOUNT_CATEGORY,
							COMPANY_CODE: oData.results[0].GiftForm_H_Items.results[i].COMPANY_CODE,
							COST_CENTER: oData.results[0].GiftForm_H_Items.results[i].COST_CENTER,
							ACC_PROJECT: oData.results[0].GiftForm_H_Items.results[i].WBS_ELEMENT,
							ACC_GL: oData.results[0].GiftForm_H_Items.results[i].GENE_LEDGER,
							ACC_MPM: oData.results[0].GiftForm_H_Items.results[i].MPM,
							ACC_AMOUNT: new Intl.NumberFormat('en-US').format(oData.results[0].GiftForm_H_Items.results[i].AMOUNT),
							CURRENCY_ACC: oData.results[0].GiftForm_H_Items.results[i].CURRENCY_ACC,
							isComp: Boolean(0),
							isWBS: Boolean(0),
							can_edit: Boolean(0),
						};
						bpRows.push(item);
					}
					oModelTab.setProperty("/suppliers", bpRows);

					var model = that1.getOwnerComponent().getModel("oData");

					model.read("/eFormProductionAccts", {
						success: function (oData, response) {
							var counter = response.data.results.length;
							var i = 0;
							var oModel = that1.getView().getModel();
							var aRows = oModelTab.getProperty("/USERS");
							for (i = 0; i < counter; i++) {
								var item = {
									USERID: response.data.results[i].USERID,
									NAME: response.data.results[i].NAME
								};
								aRows.push(item);
							}
							oModelTab.setProperty("/USERS", aRows);
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

					model.read("/eFormLobs", {
						success: function (oData, response) {
							var counter = response.data.results.length;
							var i = 0;

							var aRows = oModelTab.getProperty("/LOBS");
							for (i = 0; i < counter; i++) {
								var item = {
									LOB: response.data.results[i].LOB,
									SLOB_DESCRIPTION: response.data.results[i].SLOB_DESCRIPTION
								};
								aRows.push(item);
							}
							oModelTab.setProperty("/LOBS", aRows);
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

					model.read("/eFormCountries", {
						success: function (oData, response) {
							var counter = response.data.results.length;
							var i = 0;

							var aRows = oModelTab.getProperty("/RECICOUNTRY");
							for (i = 0; i < counter; i++) {
								var item = {
									NAME: response.data.results[i].NAME,
									COUNTRY: response.data.results[i].COUNTRY
								};
								aRows.push(item);
							}
							oModelTab.setProperty("/RECICOUNTRY", aRows);
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

					if (eform_status === 'In Approval') {
						//  that1.getView().byId("b_approve").setVisible(true);
						// that1.getView().byId("b_reject").setVisible(true);
						that1.getView().byId("submit_button").setVisible(false);
						that1.getView().byId("withdraw_button").setVisible(true);
						that1.getView().byId("save_button").setVisible(true);

						if (window.top.location.href.toLowerCase().indexOf("fiorilaunchpad") == -1) {
							// that1.getView().byId("b_home").setVisible(true);
							that1.getView().byId("b_home").setVisible(false);
							
						}

					} else if (eform_status === "Approved") {
						that1.getView().byId("save_button").setVisible(false);
						//   that1.getView().byId("b_approve").setVisible(false);
						// that1.getView().byId("b_reject").setVisible(false);
						that1.getView().byId("submit_button").setVisible(false);
						that1.getView().byId("withdraw_button").setVisible(false);
						if (window.top.location.href.toLowerCase().indexOf("fiorilaunchpad") == -1) {
							// that1.getView().byId("b_home").setVisible(true);
							that1.getView().byId("b_home").setVisible(false);
						}
					} else if (eform_status == 'Data Saved' || eform_status == "Withdrawn") {
						//  that1.getView().byId("b_approve").setVisible(false);
						//  that1.getView().byId("b_reject").setVisible(false);
						that1.getView().byId("b_home").setVisible(false);
						that1.getView().byId("submit_button").setVisible(true);
						that1.getView().byId("save_button").setVisible(true);
						that1.getView().byId("withdraw_button").setVisible(false);
					} else if (eform_status === "Rejected") {
						that1.getView().byId("save_button").setVisible(true);
						that1.getView().byId("submit_button").setVisible(false);
						that1.getView().byId("withdraw_button").setVisible(true);
						//    that1.getView().byId("b_approve").setVisible(true);
						//    that1.getView().byId("b_reject").setVisible(false);
						that1.getView().byId("b_home").setVisible(false);
						that1.getView().byId("print_button").setEnabled(true);

						if (window.top.location.href.toLowerCase().indexOf("fiorilaunchpad") == -1) {
							// that1.getView().byId("b_home").setVisible(true);
							that1.getView().byId("b_home").setVisible(false);
						}
					}

					if (rec_cat === "Employee") {
						that1.byId('frmEmpRec_S').setProperty("visible", true);
						that1.byId('frmEmpReceipient').setProperty("visible", true);
						that1.byId('frmRecipient').setProperty("visible", false);
						that1.byId('frmRecp_S').setProperty("visible", false);

					} else if (rec_cat !== "Employee") {
						that1.byId('frmEmpReceipient').setProperty("visible", false);
						that1.byId('frmEmpRec_S').setProperty("visible", false);
						that1.byId('frmRecp_S').setProperty("visible", true);
						that1.byId('frmRecipient').setProperty("visible", true);

					}

					if (occasion === "Award") {
						that1.byId('frmOccDesc').setProperty("visible", true);
						that1.byId('frmAwardType').setProperty("visible", true);
						that1.byId('frmOccDesc_s').setProperty("visible", true);
						that1.byId('frmAwardType_s').setProperty("visible", true);
					} else if (occasion === "Other") {
						that1.byId('frmOccDesc').setProperty("visible", true);

						that1.byId('frmOccDesc_s').setProperty("visible", true);
						that1.byId('frmAwardType').setProperty("visible", false);
						that1.byId('frmAwardType_s').setProperty("visible", false);

					} else {
						that1.byId('frmOccDesc').setProperty("visible", false);
						that1.byId('frmOccDesc_s').setProperty("visible", false);
						that1.byId('frmAwardType').setProperty("visible", false);
						that1.byId('frmAwardType_s').setProperty("visible", false);

					}

					if (gift === "Other") {
						that1.byId('frmGiftDesc').setProperty("visible", true);
						that1.byId('inpGiftDescription').setProperty("valueState", "None");

						that1.byId('frmGiftDesc_s').setProperty("visible", true);
					} else {
						that1.byId('frmGiftDesc').setProperty("visible", false);
						that1.byId('frmGiftDesc_s').setProperty("visible", false);
					}

					if (gift_purch == 0) {
						var oResourceModel = that1.getView().getModel("i18n").getResourceBundle();
						var oText = oResourceModel.getText("Howwasgiftpurchased");
						that1.byId('frmNoteShow').setProperty("visible", true);
						that1.byId('giftpurchasedate').setProperty("visible", true);
						that1.byId('giftpurchasedate_s').setProperty("visible", true);
						that1.byId('giftpurchasedate_s').setProperty("visible", true);
						that1.byId('frmHowHead').setProperty("visible", true);
						that1.byId('frmHowHead_s').setProperty("visible", true);
						that1.byId('frmHowItem').setProperty("visible", true);
						that1.byId('frmHowItem_s').setProperty("visible", true);
						that1.byId('how_gift_purchased').setProperty("text", oText);
						that1.byId('how_gift_purchased_s').setProperty("text", oText);

					} else if (gift_purch == 1) {
						var oResourceModel = that1.getView().getModel("i18n").getResourceBundle();
						var oText = oResourceModel.getText("Howwillgiftpurchased");
						that1.byId('frmNoteShow').setProperty("visible", false);
						that1.byId('giftpurchasedate').setProperty("visible", false);
						that1.byId('giftpurchasedate_s').setProperty("visible", false);
						that1.byId('frmHowHead').setProperty("visible", true);
						that1.byId('frmHowHead_s').setProperty("visible", true);
						that1.byId('frmHowItem').setProperty("visible", true);
						that1.byId('frmHowItem_s').setProperty("visible", true);
						that1.byId('how_gift_purchased').setProperty("text", oText);
						that1.byId('how_gift_purchased_s').setProperty("text", oText);

					}

					if (that1.byId('CURRENCY').getValue() !== 'USD') {
						that1.getView().byId("AMOUNT_USD").setVisible(true);
						that1.getView().byId("AMOUNT_USD_s").setVisible(true);

					} else if (that1.byId('CURRENCY').getValue() === "USD") {
						that1.getView().byId("AMOUNT_USD").setVisible(false);
						that1.getView().byId("AMOUNT_USD_s").setVisible(false);

					}

					if (copy_case == "X") {
						that1.getView().byId("save_button").setVisible(true);
						that1.getView().byId("b_delete").setVisible(false);
						that1.getView().byId("b_edit").setVisible(false);
						that1.getView().byId("withdraw_button").setVisible(false);
						//   that1.getView().byId("b_reject").setVisible(false);
						//   that1.getView().byId("b_approve").setVisible(false);
						that1.getView().byId("b_home").setVisible(false);
						that1.getView().byId("approver_table").destroyItems();

						e_form_num = "";
						eform_status = "Data Saved";
						var oModel = that1.getView().getModel();
						var editmode = oModel.getProperty("/requestmode");
						editmode = Boolean(1);
						oModel.setProperty("/requestmode", editmode);
						var table = that1.getView().byId('supplier_table');
						if (table.getItems().length > 0) {
							for (var i = 0; i < table.getItems().length; i++) {
								if (table.getItems()[i].getCells()[1].getValue() === "P (Project)") {

									that1.getView().getModel().setProperty("/suppliers/" + [i] + "/isComp", false);
									table.getItems()[i].getCells()[3].setValueState("None");
									that1.getView().getModel().setProperty("/suppliers/" + [i] + "/isWBS", true);
								} else if (table.getItems()[i].getCells()[1].getValue() === "K (Cost Center)") {
									that1.getView().getModel().setProperty("/suppliers/" + [i] + "/isComp", true);
									that1.getView().getModel().setProperty("/suppliers/" + [i] + "/isWBS", false);

								}
							}
						}

						that1.getView().byId("save_button").setEnabled(true);
						that1.getView().byId("submit_button").setEnabled(true);
						that1.getView().byId("submit_button").setVisible(true);
						that1.getView().byId("withdraw_button").setVisible(false);
						that1.getView().byId("print_button").setEnabled(true);
						var model = that1.getOwnerComponent().getModel("oData");
						var that = that1;
						model.read("/eFormInitialInfos('1')", {
							success: function (oData, response) {
								var name = oData.NAME;

								logger_name = oData.NAME;

								that.getView().byId("text_request_date").setText(oData.DATE);
								that.getView().byId("text_Preparer").setText(name);
								that.getView().byId("input_on_behalf_of").setValue(name);
								that.getView().byId("input_emailid").setValue(oData.EMAIL);
								that.getView().byId("REQUESTER_PHONE").setValue(oData.PHONE);

								// :NSONI3:GWDK902098:07/28/2020:Passing user id:START
								that.getView().byId("text_Preparer").data("key", response.data.USERID);
								that.getView().byId("input_on_behalf_of").data("key", response.data.USERID);
								// :NSONI3:GWDK902098:07/28/2020:Passing user id:END
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
					} else {
						//fill approvers from backend
						that1.fillApprovers(that1);
						// fill comments from backend
						that1.fillComments(that1);
						// fill attachments from backend
						that1.fillAttachments(that1);

						var model = that1.getOwnerComponent().getModel("oData");

						model.read("/eFormInitialInfos('1')", {
							success: function (oData, response) {
								var name = oData.NAME;

								logger_name = oData.NAME;

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

					}
					var msg1 = e_form_num;
					//                      eform_status = oData.results[0].STATUS;
					var oResourceModel = that1.getView().getModel("i18n").getResourceBundle();
					var oText = oResourceModel.getText("GiftOrderForm", [msg1]);
					that1.getView().byId("page").setText(oText);

					that1.resetFields();
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
		fillApprovers: function (that) {
			var model = that.getOwnerComponent().getModel("oData");
			var relPath = "/eFormApprovers";
			var that1 = that;
			var oFilter = new sap.ui.model.Filter(
				"EFORM_NUM",
				sap.ui.model.FilterOperator.EQ, e_form_num
			);
			model.read(relPath, {
				filters: [oFilter],
				success: function (oData, response) {
					var counter = oData.results.length;
					var i = 0;
					var oMod = that1.getView().getModel();
					var apRows = oMod.getProperty("/approvers");
					var no_of_items = apRows.length;
					var t = no_of_items - 1;
					for (i = t; i >= 0; i--) {
						apRows.splice(i, 1);
					}
					oMod.setProperty("/approvers", apRows);
					//oTable.destroyItems();
					for (i = 0; i < counter; i++) {
						var item = {
							approved: oData.results[i].APPROVED,
							approver: oData.results[i].APPR,
							// :NSONI3:GWDK902098:07/28/2020:pass id as key:START
							approver_Id: oData.results[i].APPR_ID,
							approved_by_Id: oData.results[i].APPROVED_BY_ID,
							// :NSONI3:GWDK902098:07/28/2020:pass id as key:START
							reviewer_type: oData.results[i].REVIEWER_TYPE,
							approved_by: oData.results[i].APPROVED_BY,
							approval_date: oData.results[i].APPROVAL_DT,
							approval_time: oData.results[i].APPROVAL_TM,
							manual_addition: oData.results[i].MANUAL,
							added_by: oData.results[i].ADDED_BY,
							added_on: oData.results[i].CREATION_DT,
							can_edit: Boolean(0)
						};
						apRows.push(item);
					}
					oMod.setProperty("/approvers", apRows);
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

		_onBehalfOf_ValueHelp: function () {
			var ssModel = this.getOwnerComponent().getModel("oData");
			var onbehalf = this.getView().byId("input_on_behalf_of");
			var oValueHelpDialog_CardHolderName = new sap.m.SelectDialog({ //Using SelectDialog control that will allow single selection along with Search field capability
				title: "Choose Value for On Behalf Of",
				items: {
					path: "/eFormProductionAccts",
					template: new sap.m.StandardListItem({
						title: "{USERID}",
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
				//On click of Confirm, value is set to input field
				confirm: function (oEvent) {
					var oSelectedItem = oEvent.getParameter("selectedItem");
					//   if (oSelectedItem) {
					onbehalf.setValue(oSelectedItem.getDescription());
					// :NSONI3:GWDK902098:07/28/2020:Passing user id:START
					onbehalf.data("key", oSelectedItem.getTitle());
					// :NSONI3:GWDK902098:07/28/2020:Passing user id:END
					onbehalf.setValueState("None");
					var title = oEvent.getParameter("selectedItem").getTitle();
					var that3 = that;
					ssModel.read("/eFormProductionAccts('" + title + "')", {
						success: function (oData, response) {
							that3.getView().byId("REQUESTER_PHONE").setValue(oData.PHONE);
							that3.getView().byId("input_emailid").setValue(oData.EMAIL);
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

					//  }
				}
			});
			var model = this.getOwnerComponent().getModel("oData"); // Setting oServiceModel defined in Copmponent.js to this value help dialog
			oValueHelpDialog_CardHolderName.setModel(model);
			oValueHelpDialog_CardHolderName.open(); //Opening value help dialog once data is binded to standard list item
		},
		setEmpty: function () {
			var that = this;
			that.getView().byId("input_RequestType").setValue('');
			that.getView().byId("text_purpose").setValue('');
			that.getView().byId("text_instruction").setValue('');
			that.getView().byId("input_VendorName").setValue('');
			that.getView().byId("text_address").setValue('');
			that.getView().byId("input_payingentity").setValue('');
			that.getView().byId("input_glaccount").setValue('');
			that.getView().byId("input_wbs").setValue('');
			that.getView().byId("input_amount").setValue('');
			that.getView().byId("text_amnt_s").setText('');
			that.getView().byId("AMOUNT_DONATION_USD").setText('');
			that.getView().byId("text_invoice").setValue('');
			that.getView().byId("DP2").setValue('');
			that.getView().byId("input_lob").setValue('');
			that.getView().byId("input_sublob").setValue('');
			that.getView().byId("oSelectCountry").setValue('');
			that.getView().byId("date_Approver").setValue('');
			that.getView().byId("inpCustomer").setValue('');
			that.getView().byId("text_ReqDesc").setValue('');
		},
		_onRequestTypeValueHelpRequest: function () {
			var that = this;
			var table = this.getView().byId("approver_table");

			var i;
			for (i = 0; i < table.getItems().length; i++) {
				if (table.getItems()[i].getCells()[6].getSelected() != true) {
					table.removeItem(table.getItems()[i]);
				}
			}

			var reqtype = this.getView().byId("input_RequestType");
			var oValueHelpDialog_RespDiv = new sap.m.SelectDialog({
				title: "Choose Value for Request Type",
				items: {
					path: "/eFormRequestTypes",
					template: new sap.m.StandardListItem({
						title: "{RequestType}",
						// description: "{RequestId}",
						active: true
					})
				},
				//Shipping Point can be searched using Search Bar
				search: function (oEvent) {
					var sValue = oEvent.getParameter("value");
					var oFilter = new sap.ui.model.Filter(
						"RequestType",
						sap.ui.model.FilterOperator.Contains, sValue
					);
					oEvent.getSource().getBinding("items").filter([oFilter]);
				},
				confirm: function (oEvent) {
					that.setEmpty();
					that.getView().byId("input_RequestType").setValueState('None');
					that.getView().byId("text_purpose").setValueState('None');
					that.getView().byId("text_instruction").setValueState('None');
					that.getView().byId("input_VendorName").setValueState('None');
					that.getView().byId("text_address").setValueState('None');
					that.getView().byId("input_payingentity").setValueState('None');
					that.getView().byId("input_glaccount").setValueState('None');
					that.getView().byId("input_wbs").setValueState('None');
					that.getView().byId("input_amount").setValueState('None');
					that.getView().byId("text_invoice").setValueState('None');
					that.getView().byId("DP2").setValueState('None');
					that.getView().byId("input_lob").setValueState('None');
					that.getView().byId("input_sublob").setValueState('None');
					that.getView().byId("oSelectCountry").setValueState('None');
					that.getView().byId("date_Approver").setValueState('None');
					that.getView().byId("inpCustomer").setValueState('None');

					var oSelectedItem = oEvent.getParameter("selectedItem");
					if (oSelectedItem) {
						reqtype.setValue(oSelectedItem.getTitle());
						reqtype.setValueState("None");
						if ((oSelectedItem.getTitle() === 'Miscellaneous') || (oSelectedItem.getTitle() === 'Sign-Off: BRD') || (oSelectedItem.getTitle() ===
								'Sign-Off: UAT') || (oSelectedItem.getTitle() === 'Sign-Off: Other') || (oSelectedItem.getTitle() ===
								'Sign-Off: FD/Level 7 Approval') || (oSelectedItem.getTitle() === 'Contract Approval Form') || (oSelectedItem.getTitle() ===
								'Residual Payment Control')) {
							that.flag = "A";
							that.getView().byId("request_Desc_s").setVisible(false);
							that.getView().byId("request_Desc").setVisible(false);
							that.getView().byId("territory").setVisible(false);
							that.getView().byId("approver_Date").setVisible(false);
							that.getView().byId("customer_company").setVisible(false);
							that.getView().byId("territory_s").setVisible(false);
							that.getView().byId("approver_Date_s").setVisible(false);
							that.getView().byId("customer_company_s").setVisible(false);
							that.getView().byId("purpose").setVisible(true);
							that.getView().byId("instruction").setVisible(true);
							that.getView().byId("dateneeded").setVisible(false);
							that.getView().byId("vendorname").setVisible(false);
							that.getView().byId("vendoradd").setVisible(false);
							that.getView().byId("lob").setVisible(false);
							that.getView().byId("sublob").setVisible(false);
							that.getView().byId("payingentity").setVisible(false);
							that.getView().byId("glaccount").setVisible(false);
							that.getView().byId("wbs").setVisible(false);
							that.getView().byId("AMOUNT_USD").setVisible(false);
							that.getView().byId("amount_s1").setVisible(false);
							that.getView().byId("amount").setVisible(false);
							that.getView().byId("invoice").setVisible(false);
							that.getView().byId("purpose_s").setVisible(true);
							that.getView().byId("instruction_s").setVisible(true);
							that.getView().byId("dateneeded_s").setVisible(false);
							that.getView().byId("vendorname_s").setVisible(false);
							that.getView().byId("vendoradd_s").setVisible(false);
							that.getView().byId("payingentity_s").setVisible(false);
							that.getView().byId("glaccount_s").setVisible(false);
							that.getView().byId("wbs_s").setVisible(false);
							that.getView().byId("amount_s").setVisible(false);
							that.getView().byId("invoice_s").setVisible(false);
							that.getView().byId("lob_s").setVisible(false);
							that.getView().byId("sublob_s").setVisible(false);
						} else if (oSelectedItem.getTitle() === 'Production Accounting Payment Request') {
							that.flag = "B";
							that.getView().byId("request_Desc_s").setVisible(false);
							that.getView().byId("request_Desc").setVisible(false);
							that.getView().byId("territory").setVisible(false);
							that.getView().byId("approver_Date").setVisible(false);
							that.getView().byId("customer_company").setVisible(false);
							that.getView().byId("territory_s").setVisible(false);
							that.getView().byId("approver_Date_s").setVisible(false);
							that.getView().byId("customer_company_s").setVisible(false);
							that.getView().byId("purpose").setVisible(true);
							that.getView().byId("instruction").setVisible(true);
							that.getView().byId("dateneeded").setVisible(true);
							that.getView().byId("vendorname").setVisible(true);
							that.getView().byId("vendoradd").setVisible(true);
							that.getView().byId("payingentity").setVisible(true);
							that.getView().byId("glaccount").setVisible(true);
							that.getView().byId("wbs").setVisible(true);
							that.getView().byId("lob").setVisible(false);
							that.getView().byId("sublob").setVisible(false);
							that.getView().byId("amount").setVisible(true);
							that.getView().byId("invoice").setVisible(true);
							that.getView().byId("purpose_s").setVisible(true);
							that.getView().byId("instruction_s").setVisible(true);
							that.getView().byId("dateneeded_s").setVisible(true);
							that.getView().byId("vendorname_s").setVisible(true);
							that.getView().byId("vendoradd_s").setVisible(true);
							that.getView().byId("payingentity_s").setVisible(true);
							that.getView().byId("glaccount_s").setVisible(true);
							that.getView().byId("wbs_s").setVisible(true);
							that.getView().byId("amount_s").setVisible(true);
							that.getView().byId("invoice_s").setVisible(true);
							that.getView().byId("lob_s").setVisible(false);
							that.getView().byId("sublob_s").setVisible(false);
						} else if (oSelectedItem.getTitle() === 'SPHE Media Budget Authorization') {
							that.flag = "C";
							that.getView().byId("request_Desc_s").setVisible(false);
							that.getView().byId("request_Desc").setVisible(false);
							that.getView().byId("territory").setVisible(false);
							that.getView().byId("approver_Date").setVisible(false);
							that.getView().byId("customer_company").setVisible(false);
							that.getView().byId("territory_s").setVisible(false);
							that.getView().byId("approver_Date_s").setVisible(false);
							that.getView().byId("customer_company_s").setVisible(false);
							that.getView().byId("purpose").setVisible(true);
							that.getView().byId("instruction").setVisible(true);
							that.getView().byId("dateneeded").setVisible(false);
							that.getView().byId("vendorname").setVisible(false);
							that.getView().byId("vendoradd").setVisible(false);
							that.getView().byId("lob").setVisible(false);
							that.getView().byId("sublob").setVisible(false);
							that.getView().byId("payingentity").setVisible(true);
							that.getView().byId("glaccount").setVisible(false);
							that.getView().byId("wbs").setVisible(false);
							that.getView().byId("amount").setVisible(true);
							that.getView().byId("AMOUNT_USD").setVisible(false);
							that.getView().byId("amount_s1").setVisible(false);
							that.getView().byId("invoice").setVisible(true);
							that.getView().byId("purpose_s").setVisible(true);
							that.getView().byId("instruction_s").setVisible(true);
							that.getView().byId("dateneeded_s").setVisible(false);
							that.getView().byId("vendorname_s").setVisible(false);
							that.getView().byId("vendoradd_s").setVisible(false);
							that.getView().byId("payingentity_s").setVisible(true);
							that.getView().byId("glaccount_s").setVisible(false);
							that.getView().byId("wbs_s").setVisible(false);
							that.getView().byId("amount_s").setVisible(true);
							that.getView().byId("invoice_s").setVisible(true);
							that.getView().byId("lob_s").setVisible(false);
							that.getView().byId("sublob_s").setVisible(false);
						} else if (oSelectedItem.getTitle() === 'OPC Exception') {
							that.flag = "D";
							that.getView().byId("request_Desc_s").setVisible(true);
							that.getView().byId("request_Desc").setVisible(true);
							that.getView().byId("territory").setVisible(false);
							that.getView().byId("approver_Date").setVisible(false);
							that.getView().byId("customer_company").setVisible(false);
							that.getView().byId("territory_s").setVisible(false);
							that.getView().byId("approver_Date_s").setVisible(false);
							that.getView().byId("customer_company_s").setVisible(false);
							that.getView().byId("purpose").setVisible(false);
							that.getView().byId("instruction").setVisible(false);
							that.getView().byId("lob").setVisible(true);
							that.getView().byId("sublob").setVisible(true);
							that.getView().byId("dateneeded").setVisible(false);
							that.getView().byId("vendorname").setVisible(false);
							that.getView().byId("vendoradd").setVisible(false);
							that.getView().byId("payingentity").setVisible(true);
							that.getView().byId("glaccount").setVisible(false);
							that.getView().byId("wbs").setVisible(false);
							that.getView().byId("amount").setVisible(false);
							that.getView().byId("AMOUNT_USD").setVisible(false);
							that.getView().byId("invoice").setVisible(false);
							that.getView().byId("purpose_s").setVisible(false);
							that.getView().byId("instruction_s").setVisible(false);
							that.getView().byId("dateneeded_s").setVisible(false);
							that.getView().byId("vendorname_s").setVisible(false);
							that.getView().byId("vendoradd_s").setVisible(false);
							that.getView().byId("payingentity_s").setVisible(true);
							that.getView().byId("glaccount_s").setVisible(false);
							that.getView().byId("wbs_s").setVisible(false);
							that.getView().byId("amount_s").setVisible(false);
							that.getView().byId("invoice_s").setVisible(false);
							that.getView().byId("lob_s").setVisible(true);
							that.getView().byId("sublob_s").setVisible(true);
							that.getView().byId("amount_s1").setVisible(false);
						} else if (oSelectedItem.getTitle() === 'Japan TV Channels') {
							that.flag = "E";

							that.getView().byId("request_Desc_s").setVisible(true);
							that.getView().byId("request_Desc").setVisible(true);
							that.getView().byId("instruction_s").setVisible(false);
							that.getView().byId("purpose").setVisible(false);
							that.getView().byId("instruction").setVisible(false);
							that.getView().byId("lob").setVisible(true);
							that.getView().byId("sublob").setVisible(true);
							that.getView().byId("payingentity").setVisible(true);
							that.getView().byId("territory").setVisible(true);
							that.getView().byId("approver_Date").setVisible(true);
							that.getView().byId("customer_company").setVisible(true);
							that.getView().byId("purpose_s").setVisible(false);
							that.getView().byId("dateneeded_s").setVisible(false);
							that.getView().byId("vendorname_s").setVisible(false);
							that.getView().byId("vendoradd_s").setVisible(false);
							that.getView().byId("glaccount_s").setVisible(false);
							that.getView().byId("wbs_s").setVisible(false);
							that.getView().byId("amount_s").setVisible(true);
							that.getView().byId("payingentity_s").setVisible(true);
							that.getView().byId("invoice_s").setVisible(false);
							that.getView().byId("lob_s").setVisible(true);
							that.getView().byId("sublob_s").setVisible(true);
							that.getView().byId("territory_s").setVisible(true);
							that.getView().byId("approver_Date_s").setVisible(true);
							that.getView().byId("customer_company_s").setVisible(true);
							that.getView().byId("glaccount").setVisible(false);
							that.getView().byId("wbs").setVisible(false);
							that.getView().byId("amount").setVisible(true);
							that.getView().byId("invoice").setVisible(false);
							that.getView().byId("dateneeded").setVisible(false);
							that.getView().byId("vendorname").setVisible(false);
							that.getView().byId("vendoradd").setVisible(false);
						}

					}
				}
			});
			var model = this.getOwnerComponent().getModel("oData");
			oValueHelpDialog_RespDiv.setModel(model);
			oValueHelpDialog_RespDiv.open();
		},
		_onPayingEntityValueHelpRequest: function () {
			var ccode = this.getView().byId("input_payingentity");
			var oValueHelpDialog_CardHolderName = new sap.m.SelectDialog({ //Using SelectDialog control that will allow single selection along with Search field capability
				title: "Choose Value for Paying Entity (Company)",
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
					that.byId('input_glaccount').setValue("");
					that.byId('input_wbs').setValue("");
					compCode = oEvent.getParameter("selectedItem").getTitle();
					var oSelectedItem = oEvent.getParameter("selectedItem");
					if (oSelectedItem) {
						ccode.setValue(oSelectedItem.getTitle());
						ccode.setValueState("None");
					}
				}
			});
			var model = this.getOwnerComponent().getModel("oData"); // Setting oServiceModel defined in Copmponent.js to this value help dialog
			oValueHelpDialog_CardHolderName.setModel(model);
			oValueHelpDialog_CardHolderName.open(); //Opening value help dialog once data is binded to standard list item
		},
		_onPayingEntity2ValueHelpRequest: function () {
			var ccode = this.getView().byId("input_payingentity2");
			var oValueHelpDialog_CardHolderName = new sap.m.SelectDialog({ //Using SelectDialog control that will allow single selection along with Search field capability
				title: "Choose Value for Paying Entity (Company)",
				items: {
					path: "/eFormCompanyCodes",
					template: new sap.m.StandardListItem({
						title: "{CODE}",
						description: "{TEXT}",
						active: true
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
					var oSelectedItem = oEvent.getParameter("selectedItem");
					if (oSelectedItem) {
						ccode.setValue(oSelectedItem.getDescription());
						ccode.setValueState("None");
					}
				}
			});
			var model = this.getOwnerComponent().getModel("oData"); // Setting oServiceModel defined in Copmponent.js to this value help dialog
			oValueHelpDialog_CardHolderName.setModel(model);
			oValueHelpDialog_CardHolderName.open(); //Opening value help dialog once data is binded to standard list item
		},
		_onWBSElementValueHelpRequest: function () {
			var wbs = this.getView().byId("input_wbs");
			//var compCode = this.byId('input_payingentity').getValue();
			var oFilter = [new sap.ui.model.Filter("BUKRS", sap.ui.model.FilterOperator.EQ, compCode)];
			var oValueHelpDialog_WBSElement = new sap.m.SelectDialog({ //Using SelectDialog control that will allow single selection along with Search field capability
				title: "Choose Value for WBS Element",
				items: {
					path: "/HWbselemSet",
					filters: oFilter,
					template: new sap.m.StandardListItem({
						title: "{Posid}",
						description: "{Post1}",
						active: true
					})
				},
				//Shipping Point can be searched using Search Bar
				search: function (oEvent) {
					var sValue = oEvent.getParameter("value");
					var oFilter = new sap.ui.model.Filter(
						"Post1",
						sap.ui.model.FilterOperator.Contains, sValue
					);
					oEvent.getSource().getBinding("items").filter([oFilter]);
				},
				//On click of Confirm, value is set to input field
				confirm: function (oEvent) {
					var oSelectedItem = oEvent.getParameter("selectedItem");
					if (oSelectedItem) {
						wbs.setValue(oSelectedItem.getTitle());
						wbs.setValueState("None");
					}
				}
			});
			var model = this.getOwnerComponent().getModel("oData"); // Setting oServiceModel defined in Copmponent.js to this value help dialog
			oValueHelpDialog_WBSElement.setModel(model);
			oValueHelpDialog_WBSElement.open(); //Opening value help dialog once data is binded to standard
		},
		_onGLAccountValueHelpRequest: function () {
			var glaccount = this.getView().byId("input_glaccount");
			//var compCode = this.byId('input_payingentity').getValue();
			var oFilter = [new sap.ui.model.Filter("BUKRS", sap.ui.model.FilterOperator.EQ, compCode)];
			var oValueHelpDialog_GLAccount = new sap.m.SelectDialog({ //Using SelectDialog control that will allow single selection along with Search field capability
				title: "Choose Value for GL Account",
				items: {
					path: "/FisshSaknrGenericSet",
					filters: oFilter,
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
				//On click of Confirm, value is set to input field
				confirm: function (oEvent) {
					var oSelectedItem = oEvent.getParameter("selectedItem");
					if (oSelectedItem) {
						glaccount.setValue(oSelectedItem.getTitle());
						glaccount.setValueState("None");
					}
				}
			});
			var model = this.getOwnerComponent().getModel("oData"); // Setting oServiceModel defined in Copmponent.js to this value help dialog
			oValueHelpDialog_GLAccount.setModel(model);
			oValueHelpDialog_GLAccount.open(); //Opening value help dialog once data is binded to standard
		},
		_onLiveChange_Title: function () {
			if (this.getView().byId("input_title").getValue() === "") {
				this.getView().byId("input_title").setValueState("Error");
				this.getView().byId("input_title").setValueStateText("(Required)");
			} else {
				this.getView().byId("input_title").setValueState("None");
			}
		},
		_onLiveChange_Purpose: function () {
			if (this.getView().byId("text_purpose").getValue() === "") {
				this.getView().byId("text_purpose").setValueState("Error");
				this.getView().byId("text_purpose").setValueStateText("(Required)");
			} else {
				this.getView().byId("text_purpose").setValueState("None");
			}
		},
		_onLiveChange_Inst: function () {
			if (this.getView().byId("text_instruction").getValue() === "") {
				this.getView().byId("text_instruction").setValueState("Error");
				this.getView().byId("text_instruction").setValueStateText("(Required)");
			} else {
				this.getView().byId("text_instruction").setValueState("None");
			}
		},
		_onLiveChange_Vendor: function () {
			if (this.getView().byId("input_VendorName").getValue() === "") {
				this.getView().byId("input_VendorName").setValueState("Error");
				this.getView().byId("input_VendorName").setValueStateText("(Required)");
			} else {
				this.getView().byId("input_VendorName").setValueState("None");
			}
		},
		_onLiveChange_VendorAdd: function () {
			if (this.getView().byId("text_address").getValue() === "") {
				this.getView().byId("text_address").setValueState("Error");
				this.getView().byId("text_address").setValueStateText("(Required)");
			} else {
				this.getView().byId("text_address").setValueState("None");
			}
		},
		_onLiveChange_Amount: function (oEvent) {
			if (this.getView().byId("input_amount").getValue() === "") {
				this.getView().byId("input_amount").setValueState("Error");
				this.getView().byId("input_amount").setValueStateText("(Required)");
			} else {
				var sAmount = oEvent.getParameter("value");
				var a = sAmount.split(',').join('');
				var str1;
				var str2;
				var regx = /[^0-9]/g;
				var res = regx.test(a);
				if (res === false) {
					var totalUsd = new Intl.NumberFormat('en-US').format(a);
					this.getView().byId("input_amount").setValue(totalUsd);
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
					this.getView().byId("input_amount").setValue(totalUsd);
				}
				this.getView().byId("input_amount").setValueState("None");
			}
		},
		_onLiveChange_dateNeeded: function () {
			if (this.getView().byId("DP2").getValue() === "") {
				this.getView().byId("DP2").setValueState("Error");
				this.getView().byId("DP2").setValueStateText("(Required)");
			} else {
				this.getView().byId("DP2").setValueState("None");
			}
		},
		_onLiveChange_InvoiceDesc: function () {
			if (this.getView().byId("text_invoice").getValue() === "") {
				this.getView().byId("text_invoice").setValueState("Error");
				this.getView().byId("text_invoice").setValueStateText("(Required)");
			} else {
				this.getView().byId("text_invoice").setValueState("None");
			}
		},
		_onLiveChange_CardHolderName: function () {
			if (this.getView().byId("input_cardholdername").getValue() === "") {
				this.getView().byId("input_cardholdername").setValueState("Error");
				this.getView().byId("input_cardholdername").setValueStateText("(Required)");
			} else {
				this.getView().byId("input_cardholdername").setValueState("None");
			}
		},
		_onLiveChange_Desc: function () {
			if (this.getView().byId("text_desc").getValue() === "") {
				this.getView().byId("text_desc").setValueState("Error");
				this.getView().byId("text_desc").setValueStateText("(Required)");
			} else {
				this.getView().byId("text_desc").setValueState("None");
			}
		},
		_onLiveChange_Dept: function () {
			if (this.getView().byId("input_department").getValue() === "") {
				this.getView().byId("input_department").setValueState("Error");
				this.getView().byId("input_department").setValueStateText("(Required)");
			} else {
				this.getView().byId("input_department").setValueState("None");
			}
		},
		_onLiveChange_Phone: function () {
			if (this.getView().byId("REQUESTER_PHONE").getValue() === "") {
				this.getView().byId("REQUESTER_PHONE").setValueState("Error");
				this.getView().byId("REQUESTER_PHONE").setValueStateText("(Required)");
			} else {
				this.getView().byId("REQUESTER_PHONE").setValueState("None");
			}
		},
		_onLiveChange_EmpTitle: function () {
			if (this.getView().byId("input_employee_title").getValue() === "") {
				this.getView().byId("input_employee_title").setValueState("Error");
				this.getView().byId("input_employee_title").setValueStateText("(Required)");
			} else {
				this.getView().byId("input_employee_title").setValueState("None");
			}
		},
		_onLiveChange_CheckBox: function () {
			if (this.getView().byId("tnc_check").getSelected() === false) {
				this.getView().byId("tnc_check").setValueState("Error");
			} else {
				this.getView().byId("tnc_check").setValueState("None");
			}
		},
		_onApproverHelpRequest: function (oEvent) {
			var input_1 = oEvent.getSource();
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
						input_1.setValue(oSelectedItem.getDescription());
						// :NSONI3:GWDK902098:07/28/2020:Passing user id:START
						input_1.data("key", oSelectedItem.getTitle());
						// :NSONI3:GWDK902098:07/28/2020:Passing user id:END
					}
				}
			});
			var model = this.getOwnerComponent().getModel("oData");
			oValueHelpDialog_CardHolderName.setModel(model);
			oValueHelpDialog_CardHolderName.open();
		},
		onAfterRendering: function () {
			// this.initialTableRecord();
		},
		initialTableRecord: function () {
			var table = this.byId('approver_table');
			var data = new sap.m.ColumnListItem({
				cells: [
					new sap.m.CheckBox({
						editable: false,
						selected: false
					}),
					new sap.m.Input({
						showValueHelp: Boolean("true"),
						valueHelpOnly: Boolean("true"),
						id: "approver" + index_counter,
						valueHelpRequest: [this._onApproverHelpRequest, this]
					}),
					new sap.m.Select({
						items: [
							new sap.ui.core.Item({
								text: "Watcher"
							}),
							new sap.ui.core.Item({
								text: "Approver"
							})
						]
					}),
					new sap.m.Text({
						text: ""
					}),
					new sap.m.Text({
						text: ""
					}),
					new sap.m.Text({
						text: ""
					}),
					new sap.m.CheckBox({
						editable: false,
						selected: true
					}),
					new sap.m.Text({
						text: logger_name
					}),
					new sap.m.Text({
						text: ""
					})
				]
			});
			table.addItem(data);
		},
		_add_approver: function () {
			var selectedType = this.byId('REVIEWER_TYPE').getValue();
			var table = this.getView().byId("approver_table");
			var all_entries = table.getItems();
			index_counter = index_counter + 1;
			var num_of_entries = table.getItems().length;

			var selected_item = this.getView().byId("approver_table").getSelectedItem();
			if (selected_item.mAggregations.cells[1].mProperties.value == "EMD Clerk" && this.getView().byId("ENTRY_SEQUENCE").getValue() ==
				"After" && table.indexOfItem(selected_item) != "0") {
				MessageBox.alert("You cannot add Approvers/Watchers after EMD Clerk ");
				return;
			}
			if (selected_item.mAggregations.cells[0].mProperties.selected == false || this.getView().byId("ENTRY_SEQUENCE").getValue() ==
				"After") {
				if (this.getView().byId("ENTRY_SEQUENCE").getValue() == "After") {
					var index = table.indexOfItem(selected_item) + 1;
				} else {
					if (table.indexOfItem(selected_item) > 0) {
						var index = table.indexOfItem(selected_item);
						if (index == 0) {
							index = 1;
						}
					} else {
						index = 0;
					}
				}
				table.removeAllItems();
				var counter = 0;
				var x = 1;
				var that = this;
				for (counter = 0; counter < num_of_entries; counter++) {
					x = x + 1;
					if (counter == index) {
						var data = new sap.m.ColumnListItem({
							cells: [
								new sap.m.CheckBox({
									editable: false,
									selected: false
								}),
								new sap.m.Input({
									showValueHelp: Boolean("true"),
									valueHelpOnly: Boolean("true"),
									id: "approver" + index_counter,
									valueHelpRequest: [that._onApproverHelpRequest, that]
								}).data("key", ""), // :NSONI3:GWDK902098:07/30/2020:Passing user id
								new sap.m.Text({
									text: this.getView().byId("REVIEWER_TYPE").getValue()
								}),
								new sap.m.Text({
									text: ""
								}).data("key", ""), // :NSONI3:GWDK902098:07/30/2020:Passing user id
								new sap.m.Text({
									text: ""
								}),
								new sap.m.Text({
									text: ""
								}),
								new sap.m.CheckBox({
									editable: false,
									selected: true
								}),
								new sap.m.Text({
									text: logger_name
								}),
								new sap.m.Text({
									text: ""
								})
							]
						});
						table.addItem(data);
					}
					table.addItem(all_entries[counter]);
					if (counter === (num_of_entries - 1) && (index === num_of_entries)) {
						var data = new sap.m.ColumnListItem({
							cells: [
								new sap.m.CheckBox({
									editable: false,
									selected: false
								}),
								new sap.m.Input({
									showValueHelp: Boolean("true"),
									valueHelpOnly: Boolean("true"),
									id: "approver2" + index_counter,
									valueHelpRequest: [that._onApproverHelpRequest, that]
								}).data("key", ""), // :NSONI3:GWDK902098:07/30/2020:Passing user id
								new sap.m.Text({
									text: this.getView().byId("REVIEWER_TYPE").getValue()
								}),
								new sap.m.Text({
									text: ""
								}).data("key", ""), // :NSONI3:GWDK902098:07/30/2020:Passing user id
								new sap.m.Text({
									text: ""
								}),
								new sap.m.Text({
									text: ""
								}),
								new sap.m.CheckBox({
									editable: false,
									selected: true
								}),
								new sap.m.Text({
									text: logger_name
								}),
								new sap.m.Text({
									text: ""
								})
							]
						});
						table.addItem(data);
					}
				}
			} else {
				MessageBox.alert("You cannot add Approvers/Watchers before an Approved Item ");
			}

		},

		_onRefreshApprovers: function (oEvent) {
			if (e_form_num != "") {
				var model = this.getOwnerComponent().getModel("oData");
				var relPath = "/eFormApprovers";
				var that1 = this;
				var oFilter = new sap.ui.model.Filter(
					"EFORM_NUM",
					sap.ui.model.FilterOperator.EQ, e_form_num
				);
				model.read(relPath, {
					filters: [oFilter],
					success: function (oData, response) {
						var counter = oData.results.length;
						var i = 0;
						var oMod = that1.getView().getModel();
						var apRows = oMod.getProperty("/approvers");
						var no_of_items = apRows.length;
						var t = no_of_items - 1;
						for (i = t; i >= 0; i--) {
							apRows.splice(i, 1);
						}
						oMod.setProperty("/approvers", apRows);
						//oTable.destroyItems();
						for (i = 0; i < counter; i++) {
							var item = {
								approved: oData.results[i].APPROVED,
								approver: oData.results[i].APPR,
								// :NSONI3:GWDK902098:07/28/2020:pass approver and approvedBy id:START
								approver_Id: oData.results[i].APPR_ID,
								approved_by_Id: oData.results[i].APPROVED_BY_ID,
								// :NSONI3:GWDK902098:07/28/2020:pass approver and approvedBy id:END
								reviewer_type: oData.results[i].REVIEWER_TYPE,
								approved_by: oData.results[i].APPROVED_BY,
								approval_date: oData.results[i].APPROVAL_DT,
								approval_time: oData.results[i].APPROVAL_TM,
								manual_addition: oData.results[i].MANUAL,
								added_by: oData.results[i].ADDED_BY,
								added_on: oData.results[i].CREATION_DT,
								can_edit: Boolean(0)
							};
							apRows.push(item);
						}
						oMod.setProperty("/approvers", apRows);
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
			}
		},
		_delete_approver: function () {

			var table = this.getView().byId("approver_table");
			var deleteOne = this.getView().getModel("i18n").getResourceBundle().getText("addOneItem");
			if (table.getItems().length === 0) {

				this.getView().getModel("viewData").getProperty("/Footval").Msg = deleteOne;
				this.getView().getModel("viewData").getProperty("/Footval").FieldName = "";

				return;
			}
			if (table.getSelectedItems().length === 0) {
				MessageBox.show('Please Select at Least one Item to Delete', {
					title: "Error",
					icon: sap.m.MessageBox.Icon.ERROR,
				});
				return;
			}
			var selected_item = this.getView().byId("approver_table").getSelectedItem();
			//deleting mannually added items
			if (selected_item.mAggregations.cells[0].mProperties.selected == false && selected_item.mAggregations.cells[6].mProperties.selected ==
				true) {
				table.removeItem(selected_item);
				if (table.getItems().length === 0) {
					this.byId('txtPosition').setProperty('visible', false);
					this.byId('ENTRY_SEQUENCE').setProperty('visible', false);
				}
			} else {
				//  if (selected_item.mAggregations.cells[5].mProperties.selected == false) {
				//    MessageBox.alert("You cannot delete the Approver since its determined by COFA logic ");
				//  }
				if (selected_item.mAggregations.cells[0].mProperties.selected == true) {
					MessageBox.alert("You cannot delete the approver since it is already approved ");
				}
			}
		},
		_onSaveComment: function (oEvent) {
			var c = {};
			var oModel = this.getOwnerComponent().getModel("oData");
			c.FORM_NO = e_form_num;
			c.FORMNAME = "GOF";
			if (oEvent.getSource().getId().includes("save_cmnt")) {
				c.COMMENTS = this.getView().byId("textarea_comments").getValue();
				this.getView().byId("textarea_comments").setValue('');
			} else {
				c.COMMENTS = this.getView().byId("textarea_comments2").getValue();
				this.getView().byId("textarea_comments2").setValue('');
			}
			c.SEQUENCE = "";
			c.CREATOR = "";
			c.CR_DATE = "";
			c.TIME = "";
			c.ACTION = "";
			var that = this;
			if (c.COMMENTS == "") {
				MessageBox.alert("Please enter the comment");
				return;
			}
			oModel.create("/eFormComments", c, {
				async: false,
				success: function (oData, response) {
					e_form_num = oData.FORM_NO;
					var msg1 = e_form_num;
					var oResourceModel = that.getView().getModel("i18n").getResourceBundle();
					var oText = oResourceModel.getText("GiftOrderForm", [msg1]);
					that.getView().byId("page").setText(oText);
					var msg = "Comment added successfully";
					MessageBox.show(
						msg,
						MessageBox.Icon.SUCCESS
					);
					sap.ui.core.BusyIndicator.hide();
					var relPath = "/eFormComments";
					var oModel = that.getOwnerComponent().getModel("oData");
					var oFilter = new sap.ui.model.Filter(
						"FORM_NO",
						sap.ui.model.FilterOperator.EQ, e_form_num
					);
					oModel.read(relPath, {
						filters: [oFilter],
						success: function (oData, response) {
							that.getView().byId("t_comment1").destroyItems();
							var counter = oData.results.length;
							var i = 0;
							for (i = 0; i < counter; i++) {
								var table = that.getView().byId("t_comment1");
								var vedit = oData.results[i].EDIT;
								var data = new sap.m.ColumnListItem({
									cells: [
										new sap.m.Text({
											text: oData.results[i].SEQUENCE
										}),
										new sap.m.TextArea({
											value: oData.results[i].COMMENTS,
											rows: 2,
											cols: 70,
											enabled: vedit
										}),
										new sap.m.Text({
											text: oData.results[i].CREATOR
										}),
										new sap.m.Text({
											text: oData.results[i].CR_DATE
										})
									]
								})
								table.addItem(data);
							} //for
							that.getView().byId("t_comment2").destroyItems();
							var counter = oData.results.length;
							var i = 0;
							for (i = 0; i < counter; i++) {
								var table = that.getView().byId("t_comment2");
								var vedit = oData.results[i].EDIT;
								var data = new sap.m.ColumnListItem({
									cells: [
										new sap.m.Text({
											text: oData.results[i].SEQUENCE
										}),
										new sap.m.TextArea({
											value: oData.results[i].COMMENTS,
											rows: 2,
											cols: 70,
											enabled: vedit
										}),
										new sap.m.Text({
											text: oData.results[i].CREATOR
										}),
										new sap.m.Text({
											text: oData.results[i].CR_DATE
										})
									]
								})
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
		_onClearCommentsPress: function () {
			this.getView().byId("textarea_comments").setValue("");
		},
		_onClearCommentsPress2: function () {
			this.getView().byId("textarea_comments2").setValue("");
		},
		_onhandleValueChange: function (oEvent) {
			file_size = oEvent.getParameters().files[0].size;
			file_size = (file_size / 1024);
		},
		_onPressDeleteAttachment: function (oEvent) {
			var model = this.getOwnerComponent().getModel("oData");
			if (oEvent.getSource().getId().includes("button_delete_attachment"))
				var selected_item = this.getView().byId("t_attachment1").getSelectedItem();
			else
				var selected_item = this.getView().byId("t_attachment2").getSelectedItem();
			if (selected_item === null)
				MessageBox.show(
					"Please select any attachment to delete",
					MessageBox.Icon.Error,
					"No Attachemnt Selected")
			else {
				var filename = selected_item.getCells()[0].getText();
				if (filename !== "") {
					if (logger_name == this.getView().byId("text_Preparer").getText() ||
						logger_name == this.getView().byId("input_on_behalf_of").getValue()
					) {
						var that = this;
						model.read("/eFormAttachments(EFORM_NUM='" + e_form_num + "'" + ",FILE_NAME='" + filename + "')", {
							success: function (oData, response) {
								that.getView().byId("t_attachment1").removeItem(selected_item);
								that.getView().byId("t_attachment2").removeItem(selected_item);
								that.fillAttachments(that);
								MessageBox.alert("Attachment deleted successfully.");
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
					} else if (selected_item.getCells()[4].getText() == logger_name) {
						var that = this;
						model.read("/eFormAttachments(EFORM_NUM='" + e_form_num + "'" + ",FILE_NAME='" + filename + "')", {
							success: function (oData, response) {
								that.getView().byId("t_attachment1").removeItem(selected_item);
								that.getView().byId("t_attachment2").removeItem(selected_item);
								that.fillAttachments(that);
								MessageBox.alert("Attachment deleted successfully.");
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

					} else {
						MessageBox.show(
							"You cannot delete this attachment.",
							MessageBox.Icon.ERROR,
							"Error"
						);

					}
				}
			}
		},
		_onhandleUploadPress: function (oEvent) {
			if (oEvent.mParameters.id.toLowerCase().indexOf("b_upload1") > -1) {
				var oFileUploader = this.getView().byId("i_fileUploader1");
				if (oFileUploader.getValue() == "") {
					MessageBox.alert("Please select the file");
					return;
				}
			}
			if (oEvent.mParameters.id.toLowerCase().indexOf("b_upload2") > -1) {
				var oFileUploader = this.getView().byId("i_fileUploader2");
				if (oFileUploader.getValue() == "") {
					MessageBox.alert("Please select the file");
					return;
				}
			}
			var userModel = this.getOwnerComponent().getModel("oData");
			var viewInstance = this.getView();
			if (oFileUploader.getName() == "") {
				return;
			}
			viewInstance.setBusy(true);
			// Set CSRF
			userModel.refreshSecurityToken();
			var csrf = userModel.getSecurityToken();
			//Add to header and upload
			oFileUploader.destroyHeaderParameters();
			oFileUploader.setSendXHR(true);
			var headerParma = new sap.ui.unified.FileUploaderParameter();
			var headerParma2 = new sap.ui.unified.FileUploaderParameter();
			var headerParma3 = new sap.ui.unified.FileUploaderParameter();
			headerParma2.setName('slug');
			headerParma2.setValue(oFileUploader.getValue() + '|' + e_form_num + '|' + file_size + '|' + 'GOF');
			oFileUploader.insertHeaderParameter(headerParma2);
			headerParma3.setName('Content-Type');
			headerParma3.setValue('image/jpeg');
			oFileUploader.insertHeaderParameter(headerParma3);
			headerParma.setName('x-csrf-token');
			headerParma.setValue(csrf);
			oFileUploader.addHeaderParameter(headerParma);
			oFileUploader.upload();
		},
		_onhandleUploadComplete: function (oEvent) {
			var status = oEvent.getParameter("status");
			if (status === 201) {
				var sMsg = "Upload Success";
				oEvent.getSource().setValue("");
				MessageBox.show(
					"Attachment Uploaded Successfully",
					MessageBox.Icon.SUCCESS,
					sMsg)
			} else {
				sMsg = "Upload Error";
				MessageBox.show(
					"Error Uploading Attachment",
					MessageBox.Icon.ERROR,
					sMsg
				)
			}
			var temp = oEvent.getParameter("response");
				// S4R:PJAIN6:GWDK902384:08/05/2021:EFORM_NUM ISSUE:START
			// e_form_num = temp.slice(114, 124);
			// var start=temp.search("GOF");
			e_form_num = temp.substr(temp.indexOf("EFORM_NUM='") + 11, 10);
				// S4R:PJAIN6:GWDK902384:08/05/2021:EFORM_NUM ISSUE:END
			var oResourceModel = this.getView().getModel("i18n").getResourceBundle();
			var oText = oResourceModel.getText("GiftOrderForm", e_form_num);
			this.getView().byId("page").setText(oText);
			var viewInstance = this.getView();
			viewInstance.setBusy(false);
			var oModel = this.getOwnerComponent().getModel("oData");
			var relPath = "/eFormAttachments";
			var that = this;
			var oFilter = new sap.ui.model.Filter(
				"EFORM_NUM",
				sap.ui.model.FilterOperator.EQ, e_form_num
			);
			oModel.read(relPath, {
				filters: [oFilter],
				success: function (oData, response) {
					that.getView().byId("t_attachment1").destroyItems();
					that.getView().byId("t_attachment2").destroyItems();
					var counter = oData.results.length;
					var i = 0;
					for (i = 0; i < counter; i++) {
						var table1 = that.getView().byId("t_attachment1");
						var table2 = that.getView().byId("t_attachment2");
						var data1 = new sap.m.ColumnListItem({
							cells: [
								new sap.m.Link({
									text: response.data.results[i].FILE_NAME,
									press: function (oEvent) {
										var that2 = that;
										var oSource = oEvent.getSource();
										var relPath = "/sap/opu/odata/sap/YFPSFIPFRDD0028_GIFT_EFORM_SRV/eFormAttachments(EFORM_NUM='" + e_form_num + "'" +
											",FILE_NAME='" + oSource.getText() + "')/$value";
										window.open(relPath, '_blank');
									}
								}),
								new sap.m.Text({
									text: response.data.results[i].CREATION_DT
								}),
								new sap.m.Text({
									text: response.data.results[i].CREATION_TIME
								}),
								new sap.m.Text({
									text: response.data.results[i].FILE_SIZE
								}),
								new sap.m.Text({
									text: response.data.results[i].CREATED_BY
								})
							]
						});
						var data2 = new sap.m.ColumnListItem({
							cells: [
								new sap.m.Link({
									text: response.data.results[i].FILE_NAME,
									press: function (oEvent) {
										var that2 = that;
										var oSource = oEvent.getSource();
										var relPath = "/sap/opu/odata/sap/YFPSFIPFRDD0028_GIFT_EFORM_SRV/eFormAttachments(EFORM_NUM='" + e_form_num + "'" +
											",FILE_NAME='" + oSource.getText() + "')/$value";
										window.open(relPath, '_blank');
									}
								}),
								new sap.m.Text({
									text: response.data.results[i].CREATION_DT
								}),
								new sap.m.Text({
									text: response.data.results[i].CREATION_TIME
								}),
								new sap.m.Text({
									text: response.data.results[i].FILE_SIZE
								}),
								new sap.m.Text({
									text: response.data.results[i].CREATED_BY
								})
							]
						});
						table1.addItem(data1);
						table2.addItem(data2);
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

		_onFinalSavePress: function () {
			button_press = 'Save';
			var title = this.getView().byId("input_title");
			var reci_Country = this.byId('inpRecipientCountry');
			var dateNeeded = this.getView().byId('DP2');
			var desc = this.getView().byId("text_desc");
			var onbehalfof = this.getView().byId("input_on_behalf_of");
			var phone = this.getView().byId("REQUESTER_PHONE");
			var email = this.getView().byId("input_emailid");
			var lob = this.byId('input_lob');
			var sublob = this.byId('input_sublob');
			var recipientCategory = this.getView().byId("cmbRecipientCategory");
			var occasion = this.getView().byId('cmbOccasion');
			var occasionDesc = this.getView().byId("inpOccasionDescription");
			var gift = this.getView().byId("cmbGift");
			var awardtype = this.getView().byId("rdbtnAwardType");
			var giftDesc = this.getView().byId("inpGiftDescription");
			var hasGift = this.getView().byId("rdbtnGiftPurchased");
			var howWasGift = this.byId('cmbHowPurchased');
			var giftDelivery = this.byId('dtpGiftDelivery');
			var dateOfDelivery = this.getView().byId("dtpDelivery");
			var amount = this.byId('inpAmount');
			var amount_usd = this.byId('AMOUNT_DONATION_USD');
			var curr = this.byId('CURRENCY');
			var recipient = this.getView().byId("inpRecipient");
			var empRecipient = this.byId('inpEmpRecipient');
			var recipientTitle = this.getView().byId('inpRecipientTitle');
			var companyName = this.getView().byId("inpCompanyName");
			var address = this.getView().byId("inpAddress");
			var street = this.getView().byId("inpCountry");
			var city = this.getView().byId("inpCity");
			var zip = this.byId('inpZIP');
			var phoneType = this.byId('inpPhoneType');
			var phoneNumber = this.getView().byId("inpPhoneNumber");
			var cardMessage = this.byId('txtCardMessage');
			var cardTobeSignedBy = this.byId('txtCardSigned');
			var territory = this.byId('cmbReqTerritory');
			var requiredFields = "Please Enter Mandatory Parameters";
			var accounting_table = this.byId('supplier_table');
			var count = 0;
			var error_flag = 0;

			if (phone.getValue().length < 10 && phone.getValue() != "") {
				MessageBox.show(
					"Please enter Requestor Phone of atleast 10 digits.",
					MessageBox.Icon.WARNING,
					"Warning"
				);
				phone.setValueState("Error");

			}

			if (phoneNumber.getValue().length < 10 && phoneNumber.getValue() != "") {
				MessageBox.show(
					"Please enter Phone of atleast 10 digits.",
					MessageBox.Icon.WARNING,
					"Warning"
				);
				phoneNumber.setValueState("Error");

			}

			if (amount.getValue() != "" && amount.getValue() != 0) {
				if (accounting_table.getItems().length == 0) {
					MessageBox.show(
						"Total Split Amount in Accounting section must be equal to total Amount in Gift Information Section. ",
						MessageBox.Icon.WARNING,
						"Warning"
					);

				} else {
					for (var i = 0; i < accounting_table.getItems().length; i++) {
						if (accounting_table.getItems()[i].getCells()[7].getItems()[2].getValue() != curr.getValue()) {
							error_flag = error_flag + 1;
							accounting_table.getItems()[i].getCells()[7].getItems()[2].setValueState("Error");
							curr.setValueState("Error");
						} else

							accounting_table.getItems()[i].getCells()[7].getItems()[2].setValueState("None");

					}
				}
			}

			if (error_flag !== 0) {
				MessageBox.show(
					"Currency Keys in Accounting tab and Gift Information tab are not identical.",
					MessageBox.Icon.WARNING,
					"Warning"
				);

			} else {
				curr.setValueState("None");
			}

			if (amount.getValue() != "" && accounting_table.getItems().length != 0 && error_flag == 0) {
				var acc_sum = 0;

				for (var i = 0; i < accounting_table.getItems().length; i++) {

					acc_sum = acc_sum + Number(accounting_table.getItems()[i].getCells()[7].getItems()[0].getValue().split(',').join(''));

				}

				if (acc_sum != Number(amount.getValue().split(',').join(''))) {
					MessageBox.show(
						"Total Split Amount in Accounting section must be equal to total Amount in Gift Information Section.",
						MessageBox.Icon.WARNING,
						"Warning"
					);

				}

			}

			if (dateOfDelivery.getValue() !== "") {

				var today = new Date();
				var dd = today.getDate();
				var mm = today.getMonth() + 1; //January is 0!
				var yyyy = today.getFullYear();

				if (dd < 10) {
					dd = '0' + dd
				}

				if (mm < 10) {
					mm = '0' + mm
				}

				today = mm + '/' + dd + '/' + yyyy;
				if (new Date(dateOfDelivery.getValue()) <= new Date(today)) {
					//REQ0492330:NSONI3:GWDK902007:02/17/2020:CHANGE THE WARNING MESSAGE OF DELIVERY DATE ROMOVE BORDER COLOUR:START
					dateOfDelivery.setValueState('None');
					dateOfDelivery.setValueStateText('');
					MessageBox.show(
						"Approval should be obtained prior to giving gifts.", //"Delivery date cannot be in past",
						MessageBox.Icon.WARNING,
						"Warning"
					);
					//REQ0492330:NSONI3:GWDK902007:02/17/2020:CHANGE THE WARNING MESSAGE OF DELIVERY DATE ROMOVE BORDER COLOUR:END

				} else {
					dateOfDelivery.setValueState('None');
					dateOfDelivery.setValueStateText('');
				}
			}

			if (accounting_table.getItems().length > 0) {
				for (var i = 0; i < accounting_table.getItems().length; i++) {
					if (accounting_table.getItems()[i].getCells()[2].getValue() === "") {
						count = count + 1;
						accounting_table.getItems()[i].getCells()[2].setValueState("Error");
					} else if (accounting_table.getItems()[i].getCells()[2].getValue() !== "") {
						accounting_table.getItems()[i].getCells()[2].setValueState("None");
					}

					if (accounting_table.getItems()[i].getCells()[5].getValue() === "") {
						count = count + 1;
						accounting_table.getItems()[i].getCells()[5].setValueState("Error");
					} else if (accounting_table.getItems()[i].getCells()[5].getValue() !== "") {
						accounting_table.getItems()[i].getCells()[5].setValueState("None");
					}

					if (accounting_table.getItems()[i].getCells()[7].getItems()[0].getValue() === "") {
						count = count + 1;
						accounting_table.getItems()[i].getCells()[7].getItems()[0].setValueState("Error");
					} else if (accounting_table.getItems()[i].getCells()[7].getItems()[0].getValue() !== "") {
						accounting_table.getItems()[i].getCells()[7].getItems()[0].setValueState("None");
					}

					if (accounting_table.getItems()[i].getCells()[1].getValue() === "K (Cost Center)") {
						if (accounting_table.getItems()[i].getCells()[3].getValue() === "") {
							count = count + 1;
							accounting_table.getItems()[i].getCells()[3].setValueState("Error");
						} else if (accounting_table.getItems()[i].getCells()[3].getValue() !== "") {
							accounting_table.getItems()[i].getCells()[3].setValueState("None");
						}
					}

					if (accounting_table.getItems()[i].getCells()[1].getValue() === "P (Project)") {
						if (accounting_table.getItems()[i].getCells()[4].getValue() === "") {
							count = count + 1;
							accounting_table.getItems()[i].getCells()[4].setValueState("Error");
						} else if (accounting_table.getItems()[i].getCells()[4].getValue() !== "") {
							accounting_table.getItems()[i].getCells()[4].setValueState("None");
						}
					}

				}
			}

			if (occasion.getValue() === "Other") {
				if (occasionDesc.getValue() === "") {
					count = count + 1;
					occasionDesc.setValueState('Error');
					occasionDesc.setValueStateText('Required');
				} else if (occasionDesc.getValue() !== "") {
					occasionDesc.setValueState('None');
					occasionDesc.setValueStateText('');
				}
			}

			if (occasion.getValue() === "Award") {

				if (awardtype.getSelectedIndex() === -1) {
					count = count + 1;
					awardtype.setValueState('Error');

				} else if (awardtype.getSelectedIndex() !== -1) {
					awardtype.setValueState('None');

				}
				if (occasionDesc.getValue() === "") {
					count = count + 1;
					occasionDesc.setValueState('Error');
					occasionDesc.setValueStateText('Required');
				} else if (occasionDesc.getValue() !== "") {
					occasionDesc.setValueState('None');
					occasionDesc.setValueStateText('');
				}
			}

			if (curr.getValue() === "") {
				count = count + 1;
				curr.setValueState('Error');
				curr.setValueStateText('Required');
			} else if (occasionDesc.getValue() !== "") {
				curr.setValueState('None');
				curr.setValueStateText('');
			}

			if (gift.getValue() === "Other") {
				if (giftDesc.getValue() === "") {
					count = count + 1;
					giftDesc.setValueState('Error');
					giftDesc.setValueStateText('Required');
				} else if (giftDesc.getValue() !== "") {
					giftDesc.setValueState('None');
					giftDesc.setValueStateText('');
				}

			}

			if (title.getValue() === "") {
				count = count + 1;
				title.setValueState('Error');
				title.setValueStateText('Required');
			} else if (title.getValue() !== "") {
				title.setValueState('None');
				title.setValueStateText('');
			}

			if (reci_Country.getValue() === "") {
				count = count + 1;
				reci_Country.setValueState('Error');
				reci_Country.setValueStateText('Required');
			} else if (reci_Country.getValue() !== "") {
				reci_Country.setValueState('None');
				reci_Country.setValueStateText('');
			}

			if (email.getValue() === "") {
				count = count + 1;
				email.setValueState('Error');
				email.setValueStateText('Required');
			} else if (email.getValue() !== "") {
				email.setValueState('None');
				email.setValueStateText('');
			}

			if (desc.getValue() === "") {
				count = count + 1;
				desc.setValueState('Error');
				desc.setValueStateText('Required');
			} else if (desc.getValue() !== "") {
				desc.setValueState('None');
				desc.setValueStateText('');
			}
			if (onbehalfof.getValue() === "") {
				count = count + 1;
				onbehalfof.setValueState('Error');
				onbehalfof.setValueStateText('Required');
			} else if (onbehalfof.getValue() !== "") {
				onbehalfof.setValueState('None');
				onbehalfof.setValueStateText('');
			}
			if (phone.getValue() === "") {
				count = count + 1;
				phone.setValueState('Error');
				phone.setValueStateText('Required');
			} else if (phone.getValue() !== "") {
				phone.setValueState('None');
				phone.setValueStateText('');
			}

			if (lob.getValue() === "") {
				count = count + 1;
				lob.setValueState('Error');
				lob.setValueStateText('Required');
			} else if (lob.getValue() !== "") {
				lob.setValueState('None');
				lob.setValueStateText('');
			}

			if (sublob.getValue() === "") {
				count = count + 1;
				sublob.setValueState('Error');
				sublob.setValueStateText('Required');
			} else if (sublob.getValue() !== "") {
				sublob.setValueState('None');
				sublob.setValueStateText('');
			}

			if (recipientCategory.getValue() === "") {
				count = count + 1;
				recipientCategory.setValueState('Error');
				recipientCategory.setValueStateText('Required');
			} else if (recipientCategory.getValue() !== "") {
				recipientCategory.setValueState('None');
				recipientCategory.setValueStateText('');
			}

			if (occasion.getValue() === "") {
				count = count + 1;
				occasion.setValueState('Error');
				occasion.setValueStateText('Required');
			} else if (occasion.getValue() !== "") {
				occasion.setValueState('None');
				occasion.setValueStateText('');
			}

			if (gift.getValue() === "") {
				count = count + 1;
				gift.setValueState('Error');
				gift.setValueStateText('Required');
			} else if (gift.getValue() !== "") {
				gift.setValueState('None');
				gift.setValueStateText('');
			}

			if (hasGift.getSelectedIndex() === -1) {
				count = count + 1;
				hasGift.setValueState('Error');

			} else if (hasGift.getSelectedIndex() == 0) {
				hasGift.setValueState('None');
				if (howWasGift.getValue() === "") {
					count = count + 1;
					howWasGift.setValueState('Error');
					howWasGift.setValueStateText('Required');
				} else if (howWasGift.getValue() !== "") {
					howWasGift.setValueState('None');
					howWasGift.setValueStateText('');
				}
				if (giftDelivery.getValue() === "") {
					count = count + 1;
					giftDelivery.setValueState('Error');
					giftDelivery.setValueStateText('Required');
				} else if (giftDelivery.getValue() !== "") {
					giftDelivery.setValueState('None');
					giftDelivery.setValueStateText('');
				}

			}

			if (amount.getValue() === "") {
				count = count + 1;
				amount.setValueState('Error');
				amount.setValueStateText('Required');
			} else if (amount.getValue() !== "") {
				amount.setValueState('None');
				amount.setValueStateText('');
			}

			if (recipientTitle.getValue() === "") {
				count = count + 1;
				recipientTitle.setValueState('Error');
				recipientTitle.setValueStateText('Required');
			} else if (recipientTitle.getValue() !== "") {
				recipientTitle.setValueState('None');
				recipientTitle.setValueStateText('');
			}
			if (companyName.getValue() === "") {
				count = count + 1;
				companyName.setValueState('Error');
				companyName.setValueStateText('Required');
			} else if (companyName.getValue() !== "") {
				companyName.setValueState('None');
				companyName.setValueStateText('');
			}

			if (phoneType.getValue() === "") {
				count = count + 1;
				phoneType.setValueState('Error');
				phoneType.setValueStateText('Required');
			} else if (phoneType.getValue() !== "") {
				phoneType.setValueState('None');
				phoneType.setValueStateText('');
			}
			if (phoneNumber.getValue() === "") {
				count = count + 1;
				phoneNumber.setValueState('Error');
				phoneNumber.setValueStateText('Required');
			} else if (phoneNumber.getValue() !== "") {
				phoneNumber.setValueState('None');
				phoneNumber.setValueStateText('');
			}

			if (cardMessage.getValue() === "") {
				count = count + 1;
				cardMessage.setValueState('Error');
				cardMessage.setValueStateText('Required');
			} else if (cardMessage.getValue() !== "") {
				cardMessage.setValueState('None');
				cardMessage.setValueStateText('');
			}
			if (cardTobeSignedBy.getValue() === "") {
				count = count + 1;
				cardTobeSignedBy.setValueState('Error');
				cardTobeSignedBy.setValueStateText('Required');
			} else if (cardTobeSignedBy.getValue() !== "") {
				cardTobeSignedBy.setValueState('None');
				cardTobeSignedBy.setValueStateText('');
			}

			if (territory.getValue() === "") {
				count = count + 1;
				territory.setValueState('Error');
				territory.setValueStateText('Required');
			} else if (territory.getValue() !== "") {
				territory.setValueState('None');
				territory.setValueStateText('');
			}

			if (recipientCategory.getValue() !== "Employee") {
				if (recipient.getValue() === "") {
					count = count + 1;
					recipient.setValueState('Error');
					recipient.setValueStateText('Required');
				} else if (recipient.getValue() !== "") {
					recipient.setValueState('None');
					recipient.setValueStateText('');
				}
			}

			if (recipientCategory.getValue() === "Employee") {
				if (empRecipient.getValue() === "") {
					count = count + 1;
					empRecipient.setValueState('Error');
					empRecipient.setValueStateText('Required');
				} else if (empRecipient.getValue() !== "") {
					empRecipient.setValueState('None');
					empRecipient.setValueStateText('');
				}
			}

			if (count !== 0) {
				sap.m.MessageBox.show(requiredFields, {
					title: "Warning",
					icon: sap.m.MessageBox.Icon.WARNING,
				});
			}

			if (eform_status == 'In Approval') {
				this._postDataToBackend('In Approval');
			} else if (eform_status == 'Rejected') {
				this._postDataToBackend('Rejected');

			} else {
				this._postDataToBackend('Data Saved');
			}
		},

		_onFinalSubmitPress: function () {
			button_press = 'Submit';
			var title = this.getView().byId("input_title");

			var dateNeeded = this.getView().byId('DP2');
			var desc = this.getView().byId("text_desc");
			var onbehalfof = this.getView().byId("input_on_behalf_of");
			var phone = this.getView().byId("REQUESTER_PHONE");
			var email = this.getView().byId("input_emailid");
			var lob = this.byId('input_lob');
			var reci_Country = this.byId("inpRecipientCountry");
			var sublob = this.byId('input_sublob');
			var recipientCategory = this.getView().byId("cmbRecipientCategory");
			var occasion = this.getView().byId('cmbOccasion');
			var occasionDesc = this.getView().byId("inpOccasionDescription");
			var gift = this.getView().byId("cmbGift");
			var awardtype = this.getView().byId("rdbtnAwardType");
			var giftDesc = this.getView().byId("inpGiftDescription");
			var hasGift = this.getView().byId("rdbtnGiftPurchased");
			var howWasGift = this.byId('cmbHowPurchased');
			var giftDelivery = this.byId('dtpGiftDelivery');
			var dateOfDelivery = this.getView().byId("dtpDelivery");
			var amount = this.byId('inpAmount');
			var amount_usd = this.byId('AMOUNT_DONATION_USD');
			var curr = this.byId('CURRENCY');
			var recipient = this.getView().byId("inpRecipient");
			var empRecipient = this.byId('inpEmpRecipient');
			var recipientTitle = this.getView().byId('inpRecipientTitle');
			var companyName = this.getView().byId("inpCompanyName");
			var address = this.getView().byId("inpAddress");
			var street = this.getView().byId("inpCountry");
			var city = this.getView().byId("inpCity");
			var zip = this.byId('inpZIP');
			var phoneType = this.byId('inpPhoneType');
			var phoneNumber = this.getView().byId("inpPhoneNumber");
			var cardMessage = this.byId('txtCardMessage');
			var cardTobeSignedBy = this.byId('txtCardSigned');
			var territory = this.byId('cmbReqTerritory');
			var requiredFields = "Please Enter Mandatory Parameters";
			var accounting_table = this.byId('supplier_table');
			var count = 0;
			var error_flag = 0;

			if (reci_Country.getValue() === "") {
				count = count + 1;
				reci_Country.setValueState('Error');
				reci_Country.setValueStateText('Required');
			} else if (reci_Country.getValue() !== "") {
				reci_Country.setValueState('None');
				reci_Country.setValueStateText('');
			}

			if (curr.getValue() === "") {
				count = count + 1;
				curr.setValueState('Error');
				curr.setValueStateText('Required');
			} else if (occasionDesc.getValue() !== "") {
				curr.setValueState('None');
				curr.setValueStateText('');
			}

			if (accounting_table.getItems().length > 0) {
				for (var i = 0; i < accounting_table.getItems().length; i++) {
					if (accounting_table.getItems()[i].getCells()[2].getValue() === "") {
						count = count + 1;
						accounting_table.getItems()[i].getCells()[2].setValueState("Error");
					} else if (accounting_table.getItems()[i].getCells()[2].getValue() !== "") {
						accounting_table.getItems()[i].getCells()[2].setValueState("None");
					}

					if (accounting_table.getItems()[i].getCells()[5].getValue() === "") {
						count = count + 1;
						accounting_table.getItems()[i].getCells()[5].setValueState("Error");
					} else if (accounting_table.getItems()[i].getCells()[5].getValue() !== "") {
						accounting_table.getItems()[i].getCells()[5].setValueState("None");
					}

					if (accounting_table.getItems()[i].getCells()[7].getItems()[0].getValue() === "") {
						count = count + 1;
						accounting_table.getItems()[i].getCells()[7].getItems()[0].setValueState("Error");
					} else if (accounting_table.getItems()[i].getCells()[7].getItems()[0].getValue() !== "") {
						accounting_table.getItems()[i].getCells()[7].getItems()[0].setValueState("None");
					}

					if (accounting_table.getItems()[0].getCells()[1].getValue() === "K (Cost Center)") {
						if (accounting_table.getItems()[i].getCells()[3].getValue() === "") {
							count = count + 1;
							accounting_table.getItems()[i].getCells()[3].setValueState("Error");
						} else if (accounting_table.getItems()[i].getCells()[3].getValue() !== "") {
							accounting_table.getItems()[i].getCells()[3].setValueState("None");
						}
					}

					if (accounting_table.getItems()[0].getCells()[1].getValue() === "P (Project)") {

						if (accounting_table.getItems()[i].getCells()[4].getValue() === "") {
							count = count + 1;
							accounting_table.getItems()[i].getCells()[4].setValueState("Error");
						} else if (accounting_table.getItems()[i].getCells()[4].getValue() !== "") {
							accounting_table.getItems()[i].getCells()[4].setValueState("None");
						}
					}

				}
			}

			if (occasion.getValue() === "Other") {
				if (occasionDesc.getValue() === "") {
					count = count + 1;
					occasionDesc.setValueState('Error');
					occasionDesc.setValueStateText('Required');
				} else if (occasionDesc.getValue() !== "") {
					occasionDesc.setValueState('None');
					occasionDesc.setValueStateText('');
				}
			}

			if (hasGift.getSelectedIndex() === -1) {
				count = count + 1;
				hasGift.setValueState('Error');

			} else if (hasGift.getSelectedIndex() == 0 || hasGift.getSelectedIndex() == 1) {
				hasGift.setValueState('None');
				if (howWasGift.getValue() === "") {
					count = count + 1;
					howWasGift.setValueState('Error');
					howWasGift.setValueStateText('Required');
				} else if (howWasGift.getValue() !== "") {
					howWasGift.setValueState('None');
					howWasGift.setValueStateText('');
				}

			}

			if (occasion.getValue() === "Award") {

				if (awardtype.getSelectedIndex() === -1) {
					count = count + 1;
					awardtype.setValueState('Error');

				} else if (awardtype.getSelectedIndex() !== -1) {
					awardtype.setValueState('None');

				}
				if (occasionDesc.getValue() === "") {
					count = count + 1;
					occasionDesc.setValueState('Error');
					occasionDesc.setValueStateText('Required');
				} else if (occasionDesc.getValue() !== "") {
					occasionDesc.setValueState('None');
					occasionDesc.setValueStateText('');
				}
			}

			if (gift.getValue() === "Other") {
				if (giftDesc.getValue() === "") {
					count = count + 1;
					giftDesc.setValueState('Error');
					giftDesc.setValueStateText('Required');
				} else if (giftDesc.getValue() !== "") {
					giftDesc.setValueState('None');
					giftDesc.setValueStateText('');
				}

			}

			if (title.getValue() === "") {
				count = count + 1;
				title.setValueState('Error');
				title.setValueStateText('Required');
			} else if (title.getValue() !== "") {
				title.setValueState('None');
				title.setValueStateText('');
			}

			if (email.getValue() === "") {
				count = count + 1;
				email.setValueState('Error');
				email.setValueStateText('Required');
			} else if (email.getValue() !== "") {
				email.setValueState('None');
				email.setValueStateText('');
			}

			if (desc.getValue() === "") {
				count = count + 1;
				desc.setValueState('Error');
				desc.setValueStateText('Required');
			} else if (desc.getValue() !== "") {
				desc.setValueState('None');
				desc.setValueStateText('');
			}
			if (onbehalfof.getValue() === "") {
				count = count + 1;
				onbehalfof.setValueState('Error');
				onbehalfof.setValueStateText('Required');
			} else if (onbehalfof.getValue() !== "") {
				onbehalfof.setValueState('None');
				onbehalfof.setValueStateText('');
			}
			if (phone.getValue() === "") {
				count = count + 1;
				phone.setValueState('Error');
				phone.setValueStateText('Required');
			} else if (phone.getValue() !== "") {
				phone.setValueState('None');
				phone.setValueStateText('');
			}

			if (lob.getValue() === "") {
				count = count + 1;
				lob.setValueState('Error');
				lob.setValueStateText('Required');
			} else if (lob.getValue() !== "") {
				lob.setValueState('None');
				lob.setValueStateText('');
			}

			if (sublob.getValue() === "") {
				count = count + 1;
				sublob.setValueState('Error');
				sublob.setValueStateText('Required');
			} else if (sublob.getValue() !== "") {
				sublob.setValueState('None');
				sublob.setValueStateText('');
			}

			if (recipientCategory.getValue() === "") {
				count = count + 1;
				recipientCategory.setValueState('Error');
				recipientCategory.setValueStateText('Required');
			} else if (recipientCategory.getValue() !== "") {
				recipientCategory.setValueState('None');
				recipientCategory.setValueStateText('');
			}

			if (occasion.getValue() === "") {
				count = count + 1;
				occasion.setValueState('Error');
				occasion.setValueStateText('Required');
			} else if (occasion.getValue() !== "") {
				occasion.setValueState('None');
				occasion.setValueStateText('');
			}

			if (gift.getValue() === "") {
				count = count + 1;
				gift.setValueState('Error');
				gift.setValueStateText('Required');
			} else if (gift.getValue() !== "") {
				gift.setValueState('None');
				gift.setValueStateText('');
			}

			if (hasGift.getSelectedIndex() === -1) {
				count = count + 1;
				hasGift.setValueState('Error');

			} else if (hasGift.getSelectedIndex() == 0) {
				hasGift.setValueState('None');
				if (howWasGift.getValue() === "") {
					count = count + 1;
					howWasGift.setValueState('Error');
					howWasGift.setValueStateText('Required');
				} else if (howWasGift.getValue() !== "") {
					howWasGift.setValueState('None');
					howWasGift.setValueStateText('');
				}
				if (giftDelivery.getValue() === "") {
					count = count + 1;
					giftDelivery.setValueState('Error');
					giftDelivery.setValueStateText('Required');
				} else if (giftDelivery.getValue() !== "") {
					giftDelivery.setValueState('None');
					giftDelivery.setValueStateText('');
				}

			}

			if (amount.getValue() === "") {
				count = count + 1;
				amount.setValueState('Error');
				amount.setValueStateText('Required');
			} else if (amount.getValue() !== "") {
				amount.setValueState('None');
				amount.setValueStateText('');
			}

			if (recipientTitle.getValue() === "") {
				count = count + 1;
				recipientTitle.setValueState('Error');
				recipientTitle.setValueStateText('Required');
			} else if (recipientTitle.getValue() !== "") {
				recipientTitle.setValueState('None');
				recipientTitle.setValueStateText('');
			}
			if (companyName.getValue() === "") {
				count = count + 1;
				companyName.setValueState('Error');
				companyName.setValueStateText('Required');
			} else if (companyName.getValue() !== "") {
				companyName.setValueState('None');
				companyName.setValueStateText('');
			}

			if (phoneType.getValue() === "") {
				count = count + 1;
				phoneType.setValueState('Error');
				phoneType.setValueStateText('Required');
			} else if (phoneType.getValue() !== "") {
				phoneType.setValueState('None');
				phoneType.setValueStateText('');
			}
			if (phoneNumber.getValue() === "") {
				count = count + 1;
				phoneNumber.setValueState('Error');
				phoneNumber.setValueStateText('Required');
			} else if (phoneNumber.getValue() !== "") {
				phoneNumber.setValueState('None');
				phoneNumber.setValueStateText('');
			}

			if (cardMessage.getValue() === "") {
				count = count + 1;
				cardMessage.setValueState('Error');
				cardMessage.setValueStateText('Required');
			} else if (cardMessage.getValue() !== "") {
				cardMessage.setValueState('None');
				cardMessage.setValueStateText('');
			}
			if (cardTobeSignedBy.getValue() === "") {
				count = count + 1;
				cardTobeSignedBy.setValueState('Error');
				cardTobeSignedBy.setValueStateText('Required');
			} else if (cardTobeSignedBy.getValue() !== "") {
				cardTobeSignedBy.setValueState('None');
				cardTobeSignedBy.setValueStateText('');
			}

			if (territory.getValue() === "") {
				count = count + 1;
				territory.setValueState('Error');
				territory.setValueStateText('Required');
			} else if (territory.getValue() !== "") {
				territory.setValueState('None');
				territory.setValueStateText('');
			}

			if (recipientCategory.getValue() !== "Employee") {
				if (recipient.getValue() === "") {
					count = count + 1;
					recipient.setValueState('Error');
					recipient.setValueStateText('Required');
				} else if (recipient.getValue() !== "") {
					recipient.setValueState('None');
					recipient.setValueStateText('');
				}
			}

			if (recipientCategory.getValue() === "Employee") {
				if (empRecipient.getValue() === "") {
					count = count + 1;
					empRecipient.setValueState('Error');
					empRecipient.setValueStateText('Required');
				} else if (empRecipient.getValue() !== "") {
					empRecipient.setValueState('None');
					empRecipient.setValueStateText('');
				}
			}
			if (phone.getValue().length < 10 && phone.getValue() != "") {
				MessageBox.show(
					"Please enter Requestor Phone of atleast 10 digits.",
					MessageBox.Icon.ERROR,
					"Error"
				);
				phone.setValueState("Error");
				return;
			}

			if (phoneNumber.getValue().length < 10 && phoneNumber.getValue() != "") {
				MessageBox.show(
					"Please enter Phone of atleast 10 digits.",
					MessageBox.Icon.ERROR,
					"Error"
				);
				phoneNumber.setValueState("Error");
				return;
			}

			if (amount.getValue() != "" && amount.getValue() != 0) {
				if (accounting_table.getItems().length == 0) {
					MessageBox.show(
						"Total Split Amount in Accounting section must be equal to total Amount in Gift Information Section. ",
						MessageBox.Icon.ERROR,
						"Error"
					);

					return;
				} else {
					for (var i = 0; i < accounting_table.getItems().length; i++) {
						if (accounting_table.getItems()[i].getCells()[7].getItems()[2].getValue() != curr.getValue()) {
							error_flag = error_flag + 1;
							accounting_table.getItems()[i].getCells()[7].getItems()[2].setValueState("Error");
							curr.setValueState("Error");
						} else
							accounting_table.getItems()[i].getCells()[7].getItems()[2].setValueState("None");

					}
				}
			}

			if (error_flag !== 0) {
				MessageBox.show(
					"Currency Keys in Accounting Section and Gift Information Section are not identical.",
					MessageBox.Icon.ERROR,
					"Error"
				);
				return;
			} else {
				curr.setValueState("None");
			}

			if (amount.getValue() != "" && accounting_table.getItems().length != 0 && error_flag == 0) {
				var acc_sum = 0;

				for (var i = 0; i < accounting_table.getItems().length; i++) {

					acc_sum = acc_sum + Number(accounting_table.getItems()[i].getCells()[7].getItems()[0].getValue().split(',').join(''));

				}

				if (acc_sum != Number(amount.getValue().split(',').join(''))) {
					MessageBox.show(
						"Total Split Amount in Accounting section must be equal to total Amount in Gift Information Section.",
						MessageBox.Icon.ERROR,
						"Error"
					);
					return;
				}
			}

			if (dateOfDelivery.getValue() !== "") {

				var today = new Date();
				var dd = today.getDate();
				var mm = today.getMonth() + 1; //January is 0!
				var yyyy = today.getFullYear();

				if (dd < 10) {
					dd = '0' + dd
				}

				if (mm < 10) {
					mm = '0' + mm
				}

				today = mm + '/' + dd + '/' + yyyy;
				if (new Date(dateOfDelivery.getValue()) <= new Date(today)) {
					//REQ0492330:NSONI3:GWDK902007:02/17/2020:CHANGE THE WARNING MESSAGE OF DELIVERY DATE ROMOVE BORDER COLOUR:START
					dateOfDelivery.setValueState('None');
					dateOfDelivery.setValueStateText('');
					// REQ0492330:RMANDAL:GWDK901959:11/21/2019:Past Date Validation:START
					MessageBox.show(
						"Approval should be obtained prior to giving gifts", // "Delivery date cannot be in past",
						MessageBox.Icon.WARNING,
						"Warning"
					);
					//REQ0492330:NSONI3:GWDK902007:02/17/2020:CHANGE THE WARNING MESSAGE OF DELIVERY DATE ROMOVE BORDER COLOUR:END
					// return;
					// REQ0492330:RMANDAL:GWDK901959:11/21/2019:Past Date Validation:END
				} else {
					dateOfDelivery.setValueState('None');
					dateOfDelivery.setValueStateText('');
				}
			}

			if (count !== 0) {
				sap.m.MessageBox.show(requiredFields, {
					title: "Warning",
					icon: sap.m.MessageBox.Icon.WARNING,
				});
				return;
			}

			this._postDataToBackend('In Approval');
		},
		_postDataToBackend: function (status) {
			var title = this.getView().byId("input_title").getValue();
			var desc = this.getView().byId("text_desc").getValue();
			var reqdate = this.getView().byId("text_request_date").getText();
			var onbehalfof = this.getView().byId("input_on_behalf_of").getValue();
			var preparer = this.getView().byId("text_Preparer").getText();
			// :NSONI3:GWDK902098:07/28/2020:Passing user ID:START
			var PREPARER_ID = this.getView().byId("text_Preparer").data("key");
			var ON_BEHALF_OF_ID = this.getView().byId("input_on_behalf_of").data("key");
			// :NSONI3:GWDK902098:07/28/2020:Passing user ID:END
			var email = this.getView().byId("input_emailid").getValue();
			var phone = this.getView().byId("REQUESTER_PHONE").getValue();
			var lob = this.getView().byId("input_lob").getValue();
			var sublob = this.getView().byId("input_sublob").getValue();
			var recipientCategory = this.getView().byId("cmbRecipientCategory").getValue();
			var occasion = this.getView().byId('cmbOccasion').getValue();
			var occasionDesc = this.getView().byId("inpOccasionDescription").getValue();
			var gift = this.getView().byId("cmbGift").getValue();
			var giftDesc = this.getView().byId("inpGiftDescription").getValue();
			var awardtype = this.getView().byId("rdbtnAwardType");
			var hasGift = this.getView().byId("rdbtnGiftPurchased");
			var howWasGift = this.byId('cmbHowPurchased').getValue();
			var giftDesc = this.getView().byId("inpGiftDescription").getValue();
			var giftDelivery = this.byId('dtpGiftDelivery').getValue();
			var dateOfDelivery = this.getView().byId("dtpDelivery").getValue();
			var amount = this.byId('inpAmount').getValue().split(',').join('');
			var selectedCurrency = this.byId('CURRENCY').getValue();
			var AmountConv = this.byId('AMOUNT_DONATION_USD').getText().split(',').join('');
			var recipient = this.getView().byId("inpRecipient").getValue();
			var recipient_emp = this.getView().byId("inpEmpRecipient").getValue();
		
		    //var recipient_id = this.getView().byId("inpEmpRecipient").data("key");
	
			var recipientTitle = this.getView().byId('inpRecipientTitle').getValue();
			var companyName = this.getView().byId("inpCompanyName").getValue();
			var addressType = this.getView().byId("inpAddress").getValue();
			var address = this.getView().byId("txtOrgAddress").getValue();
			var street = this.getView().byId("inpCountry").getValue();
			var city = this.getView().byId("inpCity").getValue();
			var zip = this.byId('inpZIP').getValue();
			var phoneType = this.byId('inpPhoneType').getValue();
			var phoneNumber = this.getView().byId("inpPhoneNumber").getValue();
			var cardMessage = this.byId('txtCardMessage').getValue();
			var territory = this.byId('cmbReqTerritory').getValue();
			var cardTobeSignedBy = this.byId('txtCardSigned').getValue();
			var recipient_country = this.byId('inpRecipientCountry').getValue();
			var state = this.byId('inpState').getValue();
			var accountingTable = this.byId('supplier_table');

			var data = {};

			if (hasGift.getSelectedIndex() === -1) {
				data.GIFT_PURCHASED = "";
			} else if (hasGift.getSelectedIndex() === 1) {
				data.GIFT_PURCHASED = hasGift.getSelectedIndex().toString();
			} else if (hasGift.getSelectedIndex() === 0) {
				data.DATE_OF_PURCHASE = this.getView().byId("dtpGiftDelivery").getValue();
				data.GIFT_PURCHASED = hasGift.getSelectedIndex().toString();
			}

			if (awardtype.getSelectedIndex() === -1) {
				data.AWARD_TYPE = "";
			} else if (awardtype.getSelectedIndex() !== -1) {
				data.AWARD_TYPE = awardtype.getSelectedIndex().toString();
			}

			data.EFORM_NUM = e_form_num;
			data.TITLE = title;
			data.DESCRIP = desc;
			data.ON_BEHALF_OF = onbehalfof;
			data.REQUEST_DATE = reqdate;
			data.PREPARER = preparer;
			// :NSONI3:GWDK902098:07/28/2020:Passing user ID:START
			data.PREPARER_ID = PREPARER_ID;
			data.ON_BEHALF_OF_ID = ON_BEHALF_OF_ID;
			// :NSONI3:GWDK902098:07/28/2020:Passing user ID:END
			data.REQUESTER_PHONE = phone;
			data.REQUESTER_EMAIL = email;
			data.RECIEPIENT_CAT = recipientCategory;
			data.OCCASION = occasion;
			data.OCCASION_DESC = occasionDesc;
			data.GIFT = gift;
			data.TITLE2 = title;
			data.DATE_OF_DLVRY = dateOfDelivery;
			data.DATE_SUBMITTED = "";
			data.RECIPIENT = recipient;
			data.EMPLOYEE_RECIPIENT = recipient_emp;
			data.RECIPIENT_TITLE = recipientTitle;
			data.COMPANY_SHOW = companyName;
			data.AMOUNT = amount;
			data.ADDRESS_TYPE = addressType;
			data.STATE = state;
			data.ADDRESS = address;
			data.COUNTRY = street;
			data.CITY = city;
			data.ZIP = zip;
			data.GIFT_DESC = giftDesc;
			data.GIFT_PURCHASED_DESC = howWasGift;
			data.STATUS = status;
			data.PHONE_TYPE = phoneType;
			data.PHONE_NUM = phoneNumber;
			data.CARD_MESSAGE = cardMessage;
			data.CARD_SIGNED_BY = cardTobeSignedBy;
			data.AMOUNT_CONVERTED = AmountConv;
			data.CURRENCY = selectedCurrency;
			data.SUBLOB = sublob;
			data.LOB = lob;
			data.TERRITORY = territory;
			data.RECIPIENT_COUNTRY = recipient_country;
			data.ACTION = button_press;

			var itemData = [];

			for (var i = 0; i < accountingTable.getItems().length; i++) {
				itemData.push({
					EFORM_NUM: e_form_num,
					LINE_NUM: accountingTable.getItems()[i].getCells()[0].getText(),
					ACCOUNT_CATEGORY: accountingTable.getItems()[i].getCells()[1].getValue(),
					COMPANY_CODE: accountingTable.getItems()[i].getCells()[2].getValue(),
					GENE_LEDGER: accountingTable.getItems()[i].getCells()[5].getValue(),
					WBS_ELEMENT: accountingTable.getItems()[i].getCells()[4].getValue(),
					COST_CENTER: accountingTable.getItems()[i].getCells()[3].getValue(),
					AMOUNT: accountingTable.getItems()[i].getCells()[7].getItems()[0].getValue().split(',').join(''),
					CURRENCY_ACC: accountingTable.getItems()[i].getCells()[7].getItems()[2].getValue(),
					MPM: accountingTable.getItems()[i].getCells()[6].getValue()
				});
			}

			if (button_press === "Save")
				data.ACTION = "Save";
			else if (button_press === "Submit")
				data.ACTION = "Submit";

			var approverData = [];
			var approvertable = this.getView().byId("approver_table").getModel().getData();
			var oModel = this.getOwnerComponent().getModel("oData");
			sap.ui.core.BusyIndicator.show();
			var i = null;
			var approved = null;
			var manual = null
			var table = this.getView().byId("approver_table").getItems();
			for (i = 0; i < table.length; i++) {
				if (table[i].getCells()[0].getSelected() === true)
					approved = 'X';
				else
					approved = '';
				if (table[i].getCells()[6].getSelected() === true)
					manual = 'X';
				else
					manual = '';

				var temp;
				if (table[i].getCells()[1].mProperties.value !== undefined) {
					temp = table[i].getCells()[1].getValue();
				} else {
					temp = table[i].getCells()[1].getText();
				}

				approverData.push({
					EFORM_NUM: e_form_num,
					ORGLEVEL: "",
					SEQUENCE: String(i + 1),
					APPROVED: approved,
					APPR: temp,
					APPR_ID: table[i].getCells()[1].data("key"), // :NSONI3:GWDK902098:07/28/2020:pass id as key
					REVIEWER_TYPE: table[i].getCells()[2].getText(),
					APPROVED_BY: table[i].getCells()[3].getText(),
					APPROVED_BY_ID: table[i].getCells()[3].data("key"), // :NSONI3:GWDK902098:07/28/2020:pass id as key
					APPROVAL_DT: table[i].getCells()[4].getText(),
					APPROVAL_TM: table[i].getCells()[5].getText(),
					MANUAL: manual,
					ADDED_BY: table[i].getCells()[7].getText()
				});

			}

			data.GiftForm_H_Items = itemData;
			data.GiftForm_H_Approvers = approverData;

			var that = this;
			oModel.create("/eFormGiftFormHs", data, {
				async: false,
				success: function (oData, response) {
					if (status === 'In Approval' && button_press === 'Submit') {
						that.getView().byId("save_button").setVisible(true);
						that.getView().byId("withdraw_button").setVisible(true);
						that.getView().byId("submit_button").setVisible(false);
						//  that.getView().byId("b_approve").setVisible(true);
						//  that.getView().byId("b_reject").setVisible(true);
						if (window.top.location.href.toLowerCase().indexOf("fiorilaunchpad") == -1) {
							// that.getView().byId("b_home").setVisible(true);
							that.getView().byId("b_home").setVisible(false);
						}

						var formnum = oData.EFORM_NUM;
						var msg = formnum.concat(' is submitted successfuly');
						MessageBox.show(
							msg,
							MessageBox.Icon.SUCCESS);
						setTimeout(that.approve_reject_button_dsp, 1000);
					} else if (status === 'In Approval' && button_press === 'Save') {
						that.getView().byId("save_button").setEnabled(true);
						that.getView().byId("withdraw_button").setVisible(true);

						that.getView().byId("submit_button").setVisible(false);
						//    that.getView().byId("b_approve").setVisible(true);
						//   that.getView().byId("b_reject").setVisible(true);
						if (window.top.location.href.toLowerCase().indexOf("fiorilaunchpad") == -1) {
							// that.getView().byId("b_home").setVisible(true);
							that.getView().byId("b_home").setVisible(false);
						}

						var formnum = oData.EFORM_NUM;
						var msg = formnum.concat(' is saved successfuly');
						MessageBox.show(
							msg,
							MessageBox.Icon.SUCCESS);
						setTimeout(that.approve_reject_button_dsp, 1000);
					}
					if (status === 'Withdrawn') {
						that.getView().byId("save_button").setEnabled(true);
						that.getView().byId("withdraw_button").setVisible(false);

						that.getView().byId("submit_button").setVisible(true);
						that.getView().byId("print_button").setEnabled(true);
						//   that.getView().byId("b_approve").setVisible(false);
						//    that.getView().byId("b_reject").setVisible(false);
						that.getView().byId("b_home").setVisible(false);
						var model = that.getView().getModel();
						var editmode = model.getProperty("/requestmode");
						editmode = Boolean(1);
						model.setProperty("/requestmode", editmode);
						var formnum = oData.EFORM_NUM;
						var msg = formnum.concat(' is withdrawn Successfuly');
						MessageBox.show(
							msg,
							MessageBox.Icon.SUCCESS);
						setTimeout(that.approve_reject_button_dsp, 1000);
					}
					if (status === 'Data Saved') {
						//    that.getView().byId("b_approve").setVisible(false);
						//    that.getView().byId("b_reject").setVisible(false);
						that.getView().byId("submit_button").setVisible(true);
						that.getView().byId("b_home").setVisible(false);
						var formnum = oData.EFORM_NUM;
						var msg = formnum.concat(' is saved Successfuly');
						MessageBox.show(
							msg,
							MessageBox.Icon.SUCCESS
						);
						setTimeout(that.approve_reject_button_dsp, 1000);
					}

					if (status === 'Rejected') {
						//   that.getView().byId("b_approve").setVisible(true);
						//      that.getView().byId("b_reject").setVisible(false);
						that.getView().byId("save_button").setVisible(true);
						that.getView().byId("submit_button").setVisible(false);
						that.getView().byId("withdraw_button").setVisible(true);
						that.getView().byId("print_button").setVisible(true);
						var formnum = oData.EFORM_NUM;
						var msg = formnum.concat(' is saved Successfuly');
						MessageBox.show(
							msg,
							MessageBox.Icon.SUCCESS
						);
						setTimeout(that.approve_reject_button_dsp, 1000);
					}

					if (status === 'Delete') {
						var formnum = oData.EFORM_NUM;
						var msg = formnum.concat(' is deleted Successfuly');
						MessageBox.show(
							msg,
							MessageBox.Icon.SUCCESS);
						setTimeout(that.approve_reject_button_dsp, 1000);
					}
					e_form_num = oData.EFORM_NUM;
					eform_status = oData.STATUS;
					//fetch approvers
					var relPath = "/eFormApprovers";
					var oFilter = new sap.ui.model.Filter(
						"EFORM_NUM",
						sap.ui.model.FilterOperator.EQ, e_form_num
					);
					oModel.read(relPath, {
						filters: [oFilter],
						success: function (oData, response) {
							var table = that.getView().byId('approver_table');
							table.removeAllItems(true);
							var counter = oData.results.length;
							var i = 0;
							var oMod = that.getView().getModel();
							var apRows = oMod.getProperty("/approvers");
							var no_of_items = apRows.length;
							var t = no_of_items - 1;
							for (i = t; i >= 0; i--) {
								apRows.splice(i, 1);
							}
							oMod.setProperty("/approvers", apRows);
							//oTable.destroyItems();
							for (i = 0; i < counter; i++) {
								var item = {
									approved: oData.results[i].APPROVED,
									approver: oData.results[i].APPR,
									// :NSONI3:GWDK902098:07/28/2020:pass id as key:START
									approver_Id: oData.results[i].APPR_ID,
									approved_by_Id: oData.results[i].APPROVED_BY_ID,
									// :NSONI3:GWDK902098:07/28/2020:pass id as key:END
									reviewer_type: oData.results[i].REVIEWER_TYPE,
									approved_by: oData.results[i].APPROVED_BY,
									approval_date: oData.results[i].APPROVAL_DT,
									approval_time: oData.results[i].APPROVAL_TM,
									manual_addition: oData.results[i].MANUAL,
									added_by: oData.results[i].ADDED_BY,
									added_on: oData.results[i].CREATION_DT,
									can_edit: Boolean(0)
								};
								apRows.push(item);
							}
							oMod.setProperty("/approvers", apRows);
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
					var oResourceModel = that.getView().getModel("i18n").getResourceBundle();
					var oText = oResourceModel.getText("GiftOrderForm", [e_form_num]);
					that.getView().byId("page").setText(oText);
					sap.ui.core.BusyIndicator.hide();
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
		resetFields: function () {
			this.getView().byId("input_title").setValueState("None");
			this.getView().byId("text_desc").setValueState("None");
			this.getView().byId("input_on_behalf_of").setValueState("None");

			this.getView().byId("input_emailid").setValueState("None");
			this.getView().byId("REQUESTER_PHONE").setValueState("None");
			this.getView().byId("input_lob").setValueState("None");
			this.getView().byId("input_sublob").setValueState("None");
			this.getView().byId("cmbRecipientCategory").setValueState("None");
			this.getView().byId("inpEmpRecipient").setValueState("None");
			this.getView().byId('cmbOccasion').setValueState("None");
			this.getView().byId("inpOccasionDescription").setValueState("None");
			this.getView().byId("cmbGift").setValueState("None");
			this.getView().byId("inpGiftDescription").setValueState("None");
			this.getView().byId("rdbtnAwardType").setValueState("None");
			this.getView().byId("rdbtnGiftPurchased").setValueState("None");
			this.byId('cmbHowPurchased').setValueState("None");
			this.byId('dtpGiftDelivery').setValueState("None");
			this.getView().byId("dtpDelivery").setValueState("None");
			this.byId('inpAmount').setValueState("None");
			this.byId('CURRENCY').setValueState("None");
			this.byId("inpRecipient").setValueState("None");
			this.byId('inpRecipientTitle').setValueState("None");
			this.byId("inpCompanyName").setValueState("None");

			this.byId('inpPhoneType').setValueState("None");
			this.byId("inpPhoneNumber").setValueState("None");
			this.byId('txtCardMessage').setValueState("None");
			this.byId('cmbReqTerritory').setValueState("None");
			this.byId('txtCardSigned').setValueState("None");
			this.byId('inpRecipientCountry').setValueState("None");

		},
		resetAttachments: function () {
			this.getView().byId("t_attachment1").destroyItems();
			this.getView().byId("t_attachment2").destroyItems();
		},
		resetComments: function () {
			this.getView().byId("textarea_comments").setValue("");
			this.getView().byId("textarea_comments2").setValue("");
			this.getView().byId("t_comment1").destroyItems();
			this.getView().byId("t_comment2").destroyItems();
		},
		_onPressEditForm: function () {
			var oModel = this.getOwnerComponent().getModel("oData");
			var that = this;
			oModel.read("/eFormInitialInfos('" + e_form_num + "')", {
				success: function (oData, response) {
					if (response.data.STATUS == "Not Authorised") {
						// edit is not allowed
						MessageBox.alert("You cannot edit this eForm.");
						return;
					}
					if (response.data.STATUS == "Data Saved" || response.data.STATUS == "Rejected" || response.data.STATUS == "Withdrawn") {
						// edit is allowed

						var model = that.getView().getModel();
						var editmode = model.getProperty("/requestmode");
						editmode = Boolean(1);
						model.setProperty("/requestmode", editmode);

						var table = that.byId('supplier_table');
						if (table.getItems().length > 0) {
							for (var i = 0; i < table.getItems().length; i++) {
								if (table.getItems()[i].getCells()[1].getValue() === "P (Project)") {

									that.getView().getModel().setProperty("/suppliers/" + [i] + "/isComp", false);
									table.getItems()[i].getCells()[3].setValueState("None");
									that.getView().getModel().setProperty("/suppliers/" + [i] + "/isWBS", true);
								} else if (table.getItems()[i].getCells()[1].getValue() === "K (Cost Center)") {
									that.getView().getModel().setProperty("/suppliers/" + [i] + "/isComp", true);
									that.getView().getModel().setProperty("/suppliers/" + [i] + "/isWBS", false);

								}
							}
						}
						MessageBox.alert("You can edit this eForm.");

						that.bindingCurrency();
					}
					if (response.data.STATUS == "In Approval") {
						that._onButtonPressWithdraw();
					}
					if (response.data.STATUS == "Approved") {
						MessageBox.alert("You cannot edit this approved eForm.");
						return;
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

		_onButtonPressApprove: function (value) {
			var msg_returned = "";

			var sValue = jQuery.sap.getUriParameters().get("SOURCE");

			if (sValue == "INBOX") {
				var sDialogName = "Dialog1";
				//               window.eform_num_inbox = this.getView().byId("EFORM_NUM").getText();
				window.eform_num_inbox = e_form_num;
				window.mode_inbox = "A";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];

				var oSource = value.getSource();
				var oBindingContext = oSource.getBindingContext();
				var sPath = oBindingContext ? oBindingContext.getPath() : null;
				var oView;
				//if (!oDialog) {
				this.getOwnerComponent().runAsOwner(function () {
					oView = sap.ui.xmlview({
						viewName: "YGIFT_FRM.view." + sDialogName
					});
					this.getView().addDependent(oView);
					oView.getController().setRouter(this.oRouter);
					//      oView.getController().setValueObject(this.getView().byId("EFORM_NUM").getText());
					oView.getController().setValueObject(e_form_num);

					oView.getController().setMode("A");
					//oView.getController().setRequestType(cpr_eform.getView().byId("REQUEST_TYPE").getValue());
					oDialog = oView.getContent()[0];
					this.mDialogs[sDialogName] = oDialog;
				}.bind(this));
				// }
				return new Promise(function (fnResolve) {
					oDialog.attachEventOnce("afterOpen", null, fnResolve);
					oDialog.open();
					if (oView) {
						oDialog.attachAfterOpen(function () {
							oDialog.rerender();
						});
					} else {
						oView = oDialog.getParent();
					}
					var oModel = this.getView().getModel();
					if (oModel) {
						oView.setModel(oModel);
					}
					if (sPath) {
						var oParams = oView.getController().getBindingParameters();
						oView.bindObject({
							path: sPath,
							parameters: oParams
						});
					}
				}.bind(this)).catch(function (err) {
					if (err !== undefined) {
						MessageBox.error(err.message);
					}
				});
			} else {
				var msg_returned = "";
				var url = "/sap/opu/odata/sap/YFPSFIPFRDD0028_GIFT_EFORM_SRV/";
				var oModelData = new sap.ui.model.odata.ODataModel(url, true);
				var eform_num = e_form_num;
				var relPath = "/eFormValidateApprovals?$filter=EFORM_NUM eq '" + eform_num + "' and ACTION eq 'A'";
				var that = this;
				oModelData.read(relPath, null, [], false, function (oData, response) {

					var msg_type = response.data.results[0].MSG_TYPE;
					if (msg_type == "E") {
						// MessageBox.error(response.data.results[0].MSG);
						msg_returned = response.data.results[0].MSG + ".";
					} else {
						msg_returned = "The eForm has been successfully approved.";
					}
					new Promise(function (fnResolve) {
						sap.m.MessageBox.confirm(msg_returned + "Do you want to go to the Fiori My Inbox App?", {
							title: "Confirm Navigation",
							actions: ["Yes", "No"],
							onClose: function (sActionClicked) {
								if (sActionClicked === "Yes") {
									if (window.top.location.href.toLowerCase().indexOf("fiorilaunchpad") == -1) {
										window.open("/sap/bc/ui2/flp#WorkflowTask-displayInbox", "_self");
									} else {
										window.open(
											"/sap/bc/ui2/flp?&sap-ushell-config=headerless#Shell-runStandaloneApp?sap-ushell-SAPUI5.Component=cross.fnd.fiori.inbox&sap-ushell-url=/sap/bc/ui5_ui5/sap/ca_fiori_inbox",
											"_self");
									}
								}
								if (sActionClicked === "No") {
									if (window.top.location.href.toLowerCase().indexOf("fiorilaunchpad") == -1) {
										window.close();
										window.open("https://sharepoint.spe.sony.com/myspe/", "_self");
									} else {
										window.history.go(-1);
									}
								}
							}
						});
					}).catch(function (err) {
						if (err !== undefined) {
							MessageBox.error(err);
						}
					});
				});
			}
		},

		_onButtonPressReject: function (value) {
			var msg_returned = "";
			var sValue = jQuery.sap.getUriParameters().get("SOURCE");

			if (sValue == "INBOX") {
				// window.eform_num_inbox = this.getView().byId("EFORM_NUM").getText();
				window.eform_num_inbox = e_form_num;
				window.mode_inbox = "R";
				var sDialogName = "Dialog1";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];

				var oSource = value.getSource();
				var oBindingContext = oSource.getBindingContext();
				var sPath = oBindingContext ? oBindingContext.getPath() : null;
				var oView;
				//if (!oDialog) {
				this.getOwnerComponent().runAsOwner(function () {
					oView = sap.ui.xmlview({
						viewName: "YGIFT_FRM.view." + sDialogName
					});
					this.getView().addDependent(oView);
					oView.getController().setRouter(this.oRouter);
					//                 oView.getController().setValueObject(this.getView().byId("EFORM_NUM").getText());
					oView.getController().setValueObject(e_form_num);
					oView.getController().setMode("R");

					//oView.getController().setRequestType(cpr_eform.getView().byId("REQUEST_TYPE").getValue());
					oDialog = oView.getContent()[0];
					this.mDialogs[sDialogName] = oDialog;
				}.bind(this));
				// }
				return new Promise(function (fnResolve) {
					oDialog.attachEventOnce("afterOpen", null, fnResolve);
					oDialog.open();
					if (oView) {
						oDialog.attachAfterOpen(function () {
							oDialog.rerender();
						});
					} else {
						oView = oDialog.getParent();
					}
					var oModel = this.getView().getModel();
					if (oModel) {
						oView.setModel(oModel);
					}
					if (sPath) {
						var oParams = oView.getController().getBindingParameters();
						oView.bindObject({
							path: sPath,
							parameters: oParams
						});
					}
				}.bind(this)).catch(function (err) {
					if (err !== undefined) {
						MessageBox.error(err.message);
					}
				});
			} else {
				var msg_returned = "";

				var url = "/sap/opu/odata/sap/YFPSFIPFRDD0028_GIFT_EFORM_SRV/";
				var oModelData = new sap.ui.model.odata.ODataModel(url, true);
				var eform_num = e_form_num;
				var relPath = "/eFormValidateApprovals?$filter=EFORM_NUM eq '" + eform_num + "' and ACTION eq 'R'";
				var that = this;
				oModelData.read(relPath, null, [], false, function (oData, response) {

					var msg_type = response.data.results[0].MSG_TYPE;
					if (msg_type == "E") {

						msg_returned = response.data.results[0].MSG + ".";
					} else {
						eform_status = "Rejected";
						msg_returned = "The Eform has been successfully rejected.";
					}

					new Promise(function (fnResolve) {
						sap.m.MessageBox.confirm(msg_returned + "Do you want to go to the Fiori My Inbox App?", {
							title: "Confirm Navigation",
							actions: ["Yes", "No"],
							onClose: function (sActionClicked) {
								if (sActionClicked === "Yes") {
									window.open("/sap/bc/ui2/flp#WorkflowTask-displayInbox", "_self");
								}

								if (sActionClicked === "No") {
									window.open("/sap/bc/ui2/flp", "_self");
									window.close();
								}

							}
						});
					}).catch(function (err) {
						if (err !== undefined) {
							MessageBox.error(err);
						}
					});

				});
			}

		},

		_onPressDeleteForm: function () {
			var oModel = this.getOwnerComponent().getModel("oData");
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var that = this;
			oModel.read("/eFormInitialInfos('" + e_form_num + "')", {
				success: function (oData, response) {
					if (response.data.STATUS == "Not Authorised") {
						// edit is allowed
						MessageBox.alert("You cannot Delete this eForm.");
						return;
					} else {
						new Promise(function (fnResolve) {
							sap.m.MessageBox.confirm("Are you sure you want to delete this form?", {
								title: "Confirm Delete",
								actions: ["Yes", "No"],
								onClose: function (sActionClicked) {
									if (sActionClicked === "Yes") {
										that._postDataToBackend('Delete');
										that.oRouter.navTo("Search", {
											from: "GiftOrder"
										}, false);
									} else {}
								}
							});
						}).catch(function (err) {
							if (err !== undefined) {
								MessageBox.error(err);
							}
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
					sap.ui.core.BusyIndicator.hide();
				}
			});
		},
		_onButtonPressWithdraw: function (oEvent) {

			var oModel = this.getOwnerComponent().getModel("oData");
			var that1 = this;
			oModel.read("/eFormInitialInfos('" + e_form_num + "')", {
				success: function (oData, response) {
					if (response.data.STATUS == "Not Authorised") {
						// edit is not allowed
						MessageBox.alert("You cannot withdraw this eForm.");
						return;
					} else {

						var oModel = that1.getOwnerComponent().getModel("oData");
						var s = {};
						var that = that1;
						var curr_view = that1.getView();
						window.eform_withdraw;
						new Promise(function (fnResolve) {
							sap.m.MessageBox.confirm("Do you want to Cancel the workflow for Gift Order Process", {
								title: "Confirm Withdraw",
								actions: ["Yes", "No"],
								onClose: function (sActionClicked) {
									if (sActionClicked === "Yes") {
										that._postDataToBackend('Withdrawn');
									} else {}
								}
							});
						}).catch(function (err) {
							if (err !== undefined) {
								MessageBox.error(err);
							}
						});
						if (window.eform_withdraw == "X") {}
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
		_onPressUpdateComment: function (oEvent) {
			var c = {};
			var oModel = this.getOwnerComponent().getModel("oData");
			if (oEvent.getSource().getId().includes("buton_update_cmt"))
				var selected_item = this.getView().byId("t_comment1").getSelectedItem();
			else
				var selected_item = this.getView().byId("t_comment2").getSelectedItem();
			if (selected_item === null)
				MessageBox.alert("Select any comment to update");
			else {
				var c = {};
				c.FORM_NO = e_form_num;
				c.COMMENTS = selected_item.getCells()[1].getValue();
				c.SEQUENCE = selected_item.getCells()[0].getText();
				c.CREATOR = "";
				c.CR_DATE = "";
				c.TIME = "";
				c.ACTION = "";
				var that = this;
				if (selected_item.getCells()[2].getText() == logger_name) {
					oModel.create("/eFormComments", c, {
						async: false,
						success: function (oData, response) {
							var msg = "Comment updated successfully";
							MessageBox.show(
								msg,
								MessageBox.Icon.SUCCESS
							);
							sap.ui.core.BusyIndicator.hide();
							var relPath = "/eFormComments";
							var oModel = that.getOwnerComponent().getModel("oData");
							var oFilter = new sap.ui.model.Filter(
								"FORM_NO",
								sap.ui.model.FilterOperator.EQ, e_form_num
							);
							oModel.read(relPath, {
								filters: [oFilter],
								success: function (oData, response) {
									that.getView().byId("t_comment1").destroyItems();
									var counter = oData.results.length;
									var i = 0;
									for (i = 0; i < counter; i++) {
										var table = that.getView().byId("t_comment1");
										var vedit = oData.results[i].EDIT;
										var data = new sap.m.ColumnListItem({
											cells: [
												new sap.m.Text({
													text: oData.results[i].SEQUENCE
												}),
												new sap.m.TextArea({
													value: oData.results[i].COMMENTS,
													rows: 2,
													cols: 70,
													enabled: vedit
												}),
												new sap.m.Text({
													text: oData.results[i].CREATOR
												}),
												new sap.m.Text({
													text: oData.results[i].CR_DATE
												})
											]
										})
										table.addItem(data);
									} //for
									that.getView().byId("t_comment2").destroyItems();
									var counter = oData.results.length;
									var i = 0;
									for (i = 0; i < counter; i++) {
										var table = that.getView().byId("t_comment2");
										var vedit = oData.results[i].EDIT;
										var data = new sap.m.ColumnListItem({
											cells: [
												new sap.m.Text({
													text: oData.results[i].SEQUENCE
												}),
												new sap.m.TextArea({
													value: oData.results[i].COMMENTS,
													rows: 2,
													cols: 70,
													enabled: vedit
												}),
												new sap.m.Text({
													text: oData.results[i].CREATOR
												}),
												new sap.m.Text({
													text: oData.results[i].CR_DATE
												})
											]
										})
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
				} else {
					MessageBox.alert("Comment cannot be updated");
				}
			}
		},
		_onPressDeleteComment: function (oEvent) {
			var c = {};
			var oModel = this.getOwnerComponent().getModel("oData");
			if (oEvent.getSource().getId().includes("button_delete_cmt"))
				var selected_item = this.getView().byId("t_comment1").getSelectedItem();
			else
				var selected_item = this.getView().byId("t_comment2").getSelectedItem();
			if (selected_item === null)
				MessageBox.alert("Select any comment to delete");
			else {
				var c = {};
				c.FORM_NO = e_form_num;
				c.COMMENTS = selected_item.getCells()[1].getValue();
				c.SEQUENCE = selected_item.getCells()[0].getText();
				c.CREATOR = "";
				c.CR_DATE = "";
				c.TIME = "";
				c.ACTION = "Delete";
				var that = this;
				if (selected_item.getCells()[2].getText() == logger_name) {
					oModel.create("/eFormComments", c, {
						async: false,
						success: function (oData, response) {
							var msg = "Comment deleted successfully";
							MessageBox.show(
								msg,
								MessageBox.Icon.SUCCESS
							);
							sap.ui.core.BusyIndicator.hide();
							var relPath = "/eFormComments";
							var oModel = that.getOwnerComponent().getModel("oData");
							var oFilter = new sap.ui.model.Filter(
								"FORM_NO",
								sap.ui.model.FilterOperator.EQ, e_form_num
							);
							oModel.read(relPath, {
								filters: [oFilter],
								success: function (oData, response) {
									that.getView().byId("t_comment1").destroyItems();
									var counter = oData.results.length;
									var i = 0;
									for (i = 0; i < counter; i++) {
										var table = that.getView().byId("t_comment1");
										var vedit = oData.results[i].EDIT;
										var data = new sap.m.ColumnListItem({
											cells: [
												new sap.m.Text({
													text: oData.results[i].SEQUENCE
												}),
												new sap.m.TextArea({
													value: oData.results[i].COMMENTS,
													rows: 2,
													cols: 70,
													enabled: vedit
												}),
												new sap.m.Text({
													text: oData.results[i].CREATOR
												}),
												new sap.m.Text({
													text: oData.results[i].CR_DATE
												})
											]
										})
										table.addItem(data);
									} //for
									that.getView().byId("t_comment2").destroyItems();
									var counter = oData.results.length;
									var i = 0;
									for (i = 0; i < counter; i++) {
										var table = that.getView().byId("t_comment2");
										var vedit = oData.results[i].EDIT;
										var data = new sap.m.ColumnListItem({
											cells: [
												new sap.m.Text({
													text: oData.results[i].SEQUENCE
												}),
												new sap.m.TextArea({
													value: oData.results[i].COMMENTS,
													rows: 2,
													cols: 70,
													enabled: vedit
												}),
												new sap.m.Text({
													text: oData.results[i].CREATOR
												}),
												new sap.m.Text({
													text: oData.results[i].CR_DATE
												})
											]
										})
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
				} else {
					MessageBox.alert("Comment cannot be deleted");
				}
			}
		},

		// :NSONI3:GWDK902098:07/30/2020:Table beautification:Start
		// approverFlowFactory: function (sId, oContext) {
		// 	var oTemplate;
		// 	if (oContext.getProperty("isInput")) {

		// 		oTemplate = new sap.m.ColumnListItem({
		// 			cells: [
		// 				new sap.m.Text({
		// 					text: "{approved}"
		// 				}),
		// 				new sap.m.Input({
		// 					value: "{approver}",
		// 					showValueHelp: true,
		// 					valueHelpOnly: true,
		// 					valueHelpRequest: [this._onInputValueHelpRequest10, this]
		// 				}).data("key", "{approver_Id}"),
		// 				new sap.m.Text({
		// 					text: "{reviewer_type}"
		// 				}),
		// 				new sap.m.Text({
		// 					text: "{approved_by}",
		// 					wrapping: true
		// 				}).data("key", "{approved_by_Id}"),
		// 				new sap.m.Text({
		// 					text: "{approval_date}"
		// 				}),
		// 				new sap.m.Text({
		// 					text: "{approval_time}"
		// 				}),
		// 				new sap.m.CheckBox({
		// 					editable: "{can_edit}",
		// 					selected: "{manual_addition}"
		// 				}),
		// 				new sap.m.Text({
		// 					text: "{added_by}",
		// 					wrapping: true
		// 				}),
		// 				new sap.m.Text({
		// 					text: "{added_on}"
		// 				})
		// 			]
		// 		});
		// 	} else {
		// 		oTemplate = new sap.m.ColumnListItem({

		// 			cells: [
		// 				new sap.m.Text({
		// 					text: "{approved}"
		// 				}),
		// 				new sap.m.Link({
		// 					text: "{approver}",
		// 					enabled: "{GRP}",
		// 					press: [this._displayEmployees, this],
		// 					wrapping: true
		// 				}).data("key", "{approver_Id}"),
		// 				new sap.m.Text({
		// 					text: "{reviewer_type}"
		// 				}),
		// 				new sap.m.Text({
		// 					text: "{approved_by}",
		// 					wrapping: true
		// 				}).data("key", "{approved_by_Id}"),
		// 				new sap.m.Text({
		// 					text: "{approval_date}"
		// 				}),
		// 				new sap.m.Text({
		// 					text: "{approval_time}"
		// 				}),
		// 				new sap.m.CheckBox({
		// 					editable: "{can_edit}",
		// 					selected: "{manual_addition}"
		// 				}),
		// 				new sap.m.Text({
		// 					text: "{added_by}",
		// 					wrapping: true
		// 				}),
		// 				new sap.m.Text({
		// 					text: "{added_on}"
		// 				})
		// 			]
		// 		});
		// 	}
		// 	return oTemplate;
		// },

		// _displayEmployees: function (oEvent) {
		// 		var oEventHandler = oEvent;
		// 		var that = this;
		// 		var sDept = oEvent.getSource().getText();
		// 		var oFilterFormType = new sap.ui.model.Filter("FormTyp", sap.ui.model.FilterOperator.EQ, "PCS");
		// 		var oFilterRole = new sap.ui.model.Filter("Role", sap.ui.model.FilterOperator.EQ, sDept);
		// 		this.getOwnerComponent().getModel("oDataModel").read("/YFPSFIC00017_GRPSet", {
		// 			async: false,
		// 			filters: [oFilterFormType, oFilterRole],
		// 			success: function (oData, oResponse) {
		// 				if (!that._oPopover) {
		// 					that._oPopover = sap.ui.xmlfragment("sony.pcard.appYPCardApplication.view.employee", that);
		// 					that.getView().addDependent(that._oPopover);
		// 				}
		// 				that._oPopover.setModel(new sap.ui.model.json.JSONModel(oData));
		// 				that._oPopover.openBy(oEventHandler.getSource());
		// 			},
		// 			error: function (oError) {
		// 				sap.m.MessageBox.show(oError.message, {
		// 					icon: MessageBox.Icon.ERROR,
		// 					title: "Error"
		// 				});
		// 			}
		// 		}).bind(this);
		// 	}
		// 	// :NSONI3:GWDK902098:07/30/2020:Table beautification:Start
	});
});