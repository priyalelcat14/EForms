sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageToast"
], function (BaseController, MessageBox, Utilities, History, JSONModel, Filter, FilterOperator, MessageToast) {

	var eform_num = "";
	var e_form_num;
	var GovernmentEform;
	return BaseController.extend("com.sap.build.standard.governmentApp.controller.GovernmentRevenue", {
		handleRouteMatched: function (oEvent) {

			var oParams = {};

			if (oEvent.mParameters.data.context) {
				this.sContext = oEvent.mParameters.data.context;
				var oPath;
				if (this.sContext) {
					oPath = {
						path: "/" + this.sContext,
						parameters: oParams
					};
					this.getView().bindObject(oPath);
				}
			}

			this.handleRadioButtonGroupsSelectedIndex();

		},

		navigate_inbox: function () {
			// window.open("/sap/bc/ui5_ui5/ui2/ushell/shells/abap/Fiorilaunchpad.html", "_self");
			window.open("/sap/bc/ui2/flp", "_self");
			window.close();
		},

		approve_eform: function (value) {
			var msg_returned = "";

			var sValue = jQuery.sap.getUriParameters().get("SOURCE");

			if (sValue == "INBOX") {
				var sDialogName = "Dialog13";
				window.eform_num_inbox = this.title;
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
						viewName: "com.sap.build.standard.governmentApp.view." + sDialogName
					});
					this.getView().addDependent(oView);
					oView.getController().setRouter(this.oRouter);
					oView.getController().setValueObject(this.title);

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
					var oModel = this.getOwnerComponent().getModel("oDataModel");
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
				var eform_num = this.title;
				var relPath = "/eFormValidateApprovals";
				var that = this;
				var aFilter = [];
				var oFilter1 = new sap.ui.model.Filter(
					"EFORM_NUM",
					sap.ui.model.FilterOperator.EQ, eform_num
				);
				var oFilter2 = new sap.ui.model.Filter(
					"ACTION",
					sap.ui.model.FilterOperator.EQ, 'A'
				);
				aFilter.push(oFilter1);
				aFilter.push(oFilter2);

				this.getOwnerComponent().getModel("oDataModel").read("/eFormValidateApprovals", {
					filters: aFilter,

					success: function (oData, response) {

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
									// if (sActionClicked === "Yes") {
									// 	if (window.top.location.href.toLowerCase().indexOf("fiorilaunchpad") == -1) {
									// 		window.open("/sap/bc/ui5_ui5/ui2/ushell/shells/abap/Fiorilaunchpad.html#WorkflowTask-displayInbox", "_self");
									// 	} else {
									// 		window.open(
									// 			"/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchpad.html?&sap-ushell-config=headerless#Shell-runStandaloneApp?sap-ushell-SAPUI5.Component=cross.fnd.fiori.inbox&sap-ushell-url=/sap/bc/ui5_ui5/sap/ca_fiori_inbox",
									// 			"_self");
									// 	}
									// }
									if (sActionClicked === "Yes") {
										if (window.top.location.href.toLowerCase().indexOf("fiorilaunchpad") == -1) {
											// window.open("/sap/bc/ui5_ui5/ui2/ushell/shells/abap/Fiorilaunchpad.html#WorkflowTask-displayInbox", "_self");
											window.open("/sap/bc/ui2/flp#WorkflowTask-displayInbox", "_self");
										} else {
											// window.open(
											// 	"/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchpad.html?&sap-ushell-config=headerless#Shell-runStandaloneApp?sap-ushell-SAPUI5.Component=cross.fnd.fiori.inbox&sap-ushell-url=/sap/bc/ui5_ui5/sap/ca_fiori_inbox",
											// 	"_self");
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

					}
				});
			}

		},

		approve_reject_button_dsp: function () {
			//Check and display Approve and Reject buttons if applicable
			var url = "/sap/opu/odata/sap/YFPSFIPFRDD0029_GOVERN_EFORM_SRV/";
			var oModelData = new sap.ui.model.odata.ODataModel(url, true);
			var eform_num = e_form_num;
			var relPath = "/eFormDetermineApproverLogins?$filter=EFORM_NUM eq '" + eform_num + "'";
			var that = GovernmentEform;

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

		reject_eform: function (value) {

			var msg_returned = "";

			var sValue = jQuery.sap.getUriParameters().get("SOURCE");

			if (sValue == "INBOX") {
				window.eform_num_inbox = this.title;
				window.mode_inbox = "R";
				var sDialogName = "Dialog13";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];

				var oSource = value.getSource();
				var oBindingContext = oSource.getBindingContext();
				var sPath = oBindingContext ? oBindingContext.getPath() : null;
				var oView;
				//if (!oDialog) {
				this.getOwnerComponent().runAsOwner(function () {
					oView = sap.ui.xmlview({
						viewName: "com.sap.build.standard.governmentApp.view." + sDialogName
					});
					this.getView().addDependent(oView);
					oView.getController().setRouter(this.oRouter);
					oView.getController().setValueObject(this.title);
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
					var oModel = this.getOwnerComponent().getModel("oDataModel");
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

				var oModelData = this.getOwnerComponent().getModel("oDataModel");
				var eform_num = this.title;
				var relPath = "/eFormValidateApprovals";
				var that = this;
				var aFilter = [];
				var oFilter1 = new sap.ui.model.Filter(
					"EFORM_NUM",
					sap.ui.model.FilterOperator.EQ, eform_num
				);
				var oFilter2 = new sap.ui.model.Filter(
					"ACTION",
					sap.ui.model.FilterOperator.EQ, 'R'
				);
				aFilter.push(oFilter1);
				aFilter.push(oFilter2);

				this.getOwnerComponent().getModel("oDataModel").read(relPath, {
					filters: aFilter,

					success: function (oData, response) {

						var msg_type = response.data.results[0].MSG_TYPE;
						if (msg_type == "E") {

							// MessageBox.error(response.data.results[0].MSG);
							msg_returned = response.data.results[0].MSG + ".";
						} else {
							msg_returned = "The Eform has been successfully rejected.";
							that.getOwnerComponent().getModel("headerUserModel").setProperty("/STATUS", "Rejected");
						}

						new Promise(function (fnResolve) {
							sap.m.MessageBox.confirm(msg_returned + "Do you want to go to the Fiori My Inbox App?", {
								title: "Confirm Navigation",
								actions: ["Yes", "No"],
								onClose: function (sActionClicked) {
									// if (sActionClicked === "Yes") {
									// 	if (window.top.location.href.toLowerCase().indexOf("fiorilaunchpad") == -1) {
									// 		window.open("/sap/bc/ui5_ui5/ui2/ushell/shells/abap/Fiorilaunchpad.html#WorkflowTask-displayInbox", "_self");
									// 	} else {
									// 		window.open(
									// 			"/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchpad.html?&sap-ushell-config=headerless#Shell-runStandaloneApp?sap-ushell-SAPUI5.Component=cross.fnd.fiori.inbox&sap-ushell-url=/sap/bc/ui5_ui5/sap/ca_fiori_inbox",
									// 			"_self");
									// 	}
									// }
									if (sActionClicked === "Yes") {
										if (window.top.location.href.toLowerCase().indexOf("fiorilaunchpad") == -1) {
											// window.open("/sap/bc/ui5_ui5/ui2/ushell/shells/abap/Fiorilaunchpad.html#WorkflowTask-displayInbox", "_self");
											window.open("/sap/bc/ui2/flp#WorkflowTask-displayInbox", "_self");
										} else {
											// window.open(
											// 	"/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchpad.html?&sap-ushell-config=headerless#Shell-runStandaloneApp?sap-ushell-SAPUI5.Component=cross.fnd.fiori.inbox&sap-ushell-url=/sap/bc/ui5_ui5/sap/ca_fiori_inbox",
											// 	"_self");
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

					}
				});

			}

		},
		_onNavigateHome: function (value) {
			// window.location.href = "/sap/bc/ui5_ui5/ui2/ushell/shells/abap/Fiorilaunchpad.html";
			window.location.href = "/sap/bc/ui2/flp";
			//window.close();
			//window.open("/sap/bc/ui5_ui5/ui2/ushell/shells/abap/Fiorilaunchpad.html");
		},

		handleRadioButtonGroupsSelectedIndex: function () {
			var that = this;
			this.aRadioButtonGroupIds.forEach(function (sRadioButtonGroupId) {
				var oRadioButtonGroup = that.byId(sRadioButtonGroupId);
				var oButtonsBinding = oRadioButtonGroup ? oRadioButtonGroup.getBinding("buttons") : undefined;
				if (oButtonsBinding) {
					var oSelectedIndexBinding = oRadioButtonGroup.getBinding("selectedIndex");
					var iSelectedIndex = oRadioButtonGroup.getSelectedIndex();
					oButtonsBinding.attachEventOnce("change", function () {
						if (oSelectedIndexBinding) {
							oSelectedIndexBinding.refresh(true);
						} else {
							oRadioButtonGroup.setSelectedIndex(iSelectedIndex);
						}
					});
				}
			});

		},

		//this method is not called from anywere in all views/controllers checked by nsoni
		onPressEdit: function () {
			//REQ0470877:RMANDAL:GWDK901935:11/07/2019:Validation to check if user is authorised to edit the form:START
			// var sLoggedInUser = this._component.getModel("headerUserModel").getProperty("/Logged_In_User");
			// var sPreparer = this._component.getModel("headerUserModel").getProperty("/PREPARER");
			// var sCardHolder = this._component.getModel("headerUserModel").getProperty("/CARDHOLDERNAME");

			var sCurrentUser = sap.ushell.Container.getUser().getId();
			var sPreparerId = this._component.getModel("headerUserModel").getProperty("/PREPARERID");
			var sOnBehalfOfId = this._component.getModel("headerUserModel").getProperty("/ONBEHALFOFID");

			if ((sCurrentUser !== sPreparerId) && (sCurrentUser !== sOnBehalfOfId)) {
				MessageBox.show("You are not authorized to Edit this form");
				//REQ0470877:RMANDAL:GWDK901935:11/07/2019:Validation to check if user is authorised to edit the form:END
				this.edit = false;
			} else {
				if (this._component.getModel("headerUserModel").getProperty("/STATUS") === "In Approval") {
					this.onPressWithdraw();

					this.edit = false;

				} else if (this._component.getModel("headerUserModel").getProperty("/STATUS") === ("Data Saved" || "Rejected")) {
					this.edit = true;
					this._component.getModel("headerUserModel").setProperty("/isEnable", true);

				} else if (this._component.getModel("headerUserModel").getProperty("/STATUS") === "Approved") {
					this._component.getModel("headerUserModel").setProperty("/isEnable", false);
					this._component.getModel("headerUserModel").setProperty("/isEnable_C", false);
					MessageBox.show("Form is already Approved");
					this.edit = false;
				} else if (this._component.getModel("headerUserModel").getProperty("/STATUS") === "Withdrawn") {
					this.edit = true;
					this._component.getModel("headerUserModel").setProperty("/isEnable", true);
				}
			}
		},

		_onEditPress: function (oEvent) {
			var model = this.getOwnerComponent().getModel("oDataModel");
			var that = this;
			model.read("/eFormInitialInfos('" + eform_num + "')", {
				success: function (oData, response) {
					if (response.data.STATUS == "Not Authorised") {
						// edit is allowed
						MessageBox.alert("You cannot edit this eForm.");
						return;
					}
					if (response.data.STATUS == "Data Saved" || response.data.STATUS == "Rejected" || response.data.STATUS == "Withdrawn") {
						// edit is allowed
						that.edit = true;
						that._component.getModel("headerUserModel").setProperty("/isEnable", true);
						MessageBox.alert("You can edit this eForm.");
						that.handleButtonEnable();
						that.getView().getModel("headerUserModel").setProperty("/COMMENTS_ENABLED", true);

					}
					if (response.data.STATUS == "In Approval") {
						that.onPressWithdraw();

						that.edit = false;
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
		onPhoneNumChange: function (oEvent) {
			var value = oEvent.getParameter("value");
			if (value !== "") {
				var regx = /[^0-9-]/g;
				var regx1 = new RegExp("-");

				var res = regx.test(value);
				if (res === true) {
					var result = value.match(regx);
					var substr = value.replace(result, '');
					this._component.getModel("headerUserModel").setProperty("/PHONE_NUM", substr);
					sap.ui.getCore().byId(oEvent.getParameter("id")).setValue(this._component.getModel("headerUserModel").getProperty("/PHONE_NUM"));
					this._component.getModel("headerUserModel").getProperty("/PHONE_NUM");

				}
			}
		},

		onHandleDeletePress: function (oEvent) {
			var oModel = this.getView().getModel("repTableModel");
			var aRows = oModel.getData();

			var oParent = oEvent.getSource().getParent();
			var oPar_Parent = oParent.getParent().sId;
			var aTable = sap.ui.getCore().byId(oPar_Parent);

			//   var aTable    = this.getView().byId("yourtable");
			var aContexts = aTable.getSelectedContexts();
			for (var i = aContexts.length - 1; i >= 0; i--) {
				var oThisObj = aContexts[i].getObject();
				var index = $.map(aRows, function (obj, index) {
					if (obj === oThisObj) {
						return index;
					}
				})
				aRows.splice(index, 1);
			}
			oModel.setData(aRows);
			aTable.removeSelections(true);
			this.getSummaryTotal();
		},

		//  onHandleDeletePress: function(oEvent){
		//  var arr = this.getView().getModel("repTableModel");
		//  var removeValFromIndex = [];
		//  var oParent = oEvent.getSource().getParent();
		//              var oPar_Parent = oParent.getParent().sId;
		//             var  oTableId =sap.ui.getCore().byId(oPar_Parent);
		//             var selected_item = oTableId.getSelectedItems();
		//              var array = this.getView().getModel("repTableModel").getData();

		//           var  array2 =[];
		//         for(var i=0;i<selected_item.length;i++){
		//         var sContext = selected_item[i].getBindingContextPath();
		//         var ObjIndex = parseFloat(sContext.substr(1));
		//         removeValFromIndex.push(ObjIndex);

		//         }
		//         for(var i=0;i<removeValFromIndex.length;i++){
		//         var array1 = array.splice(removeValFromIndex[i], 1);
		//         }
		//  this.getView().getModel("repTableModel").setData(array);
		//  this.getSummaryTotal();
		//  },
		onNavBack: function () {

			this.title = "";
			this.getOwnerComponent().getModel("repTableModel").setData({});
			this.getOwnerComponent().getModel("headerUserModel").setData({});
			this.getOwnerComponent().getModel("itemUserModel").setData({});
			this.getOwnerComponent().getModel("repTableModel").setProperty("/isEditedItems_EXP", false);
			this._component.getModel("headerUserModel").setProperty("/action", "");
			var oReciTab = this.byId("tblRecipient");
			var oReciTab1 = this.byId("tblRecipient1");

			oReciTab.destroyItems();
			oReciTab1.destroyItems();

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			//oRouter.navTo("default", true);

		},

		onHandleCopyPress: function (oEvent) {
			var oParent = oEvent.getSource().getParent();
			var oPar_Parent = oParent.getParent().sId;
			var oTableId = sap.ui.getCore().byId(oPar_Parent);
			var selected_item = oTableId.getSelectedItems();
			var array = this.getView().getModel("repTableModel").getData();
			var array3 = [];
			var arr = [];
			if (this.oSourceView != "Create") {

				var data = this.getOwnerComponent().getModel("repTableModel").getData();

				if (data.length > 0) {
					for (var i = 0; i < data.length; i++) {
						arr.push(data[i]);
					}
				}

			}
			for (var i = 0; i < selected_item.length; i++) {

				var sContext = selected_item[i].getBindingContextPath();
				var index = parseFloat(sContext.substr(1));

				obj = {
					Recipient: {

						IS_REL_IND: array[index].Recipient.IS_REL_IND,

						RECIPIENT_ADD: array[index].Recipient.RECIPIENT_ADD,

						RECIPIENT_CITY: array[index].Recipient.RECIPIENT_CITY,

						RECIPIENT_COUNTRY: array[index].Recipient.RECIPIENT_COUNTRY,

						RECIPIENT_FIRST_NAME: array[index].Recipient.RECIPIENT_FIRST_NAME,

						RECIPIENT_LAST_NAME: array[index].Recipient.RECIPIENT_LAST_NAME,

						RECIPIENT_OTHER_RELATION: array[index].Recipient.RECIPIENT_OTHER_RELATION,

						RECIPIENT_PC: array[index].Recipient.RECIPIENT_PC,

						RECIPIENT_STATE: array[index].Recipient.RECIPIENT_STATE,

						RECIPIENT_TITLE: array[index].Recipient.RECIPIENT_TITLE,

						RECI_BUSSI: array[index].Recipient.RECI_BUSSI,

						Res_sel1: array[index].Recipient.Res_sel1,

						Res_sel2: array[index].Recipient.Res_sel2,

						Res_sel3: array[index].Recipient.Res_sel3,

						form_Justification1: array[index].Recipient.form_Justification1,

						form_Justification2: array[index].Recipient.form_Justification2,

						form_Justification3: array[index].Recipient.form_Justification3,

						title: array[index].Recipient.title

					},
					Organisation: {

						CITY: array[index].Organisation.CITY,

						ORG_ADDRESS: array[index].Organisation.ORG_ADDRESS,

						ORG_BUSSI: array[index].Organisation.ORG_BUSSI,

						ORG_COUNTRY: array[index].Organisation.ORG_COUNTRY,

						ORG_POSTAL_CODE: array[index].Organisation.ORG_POSTAL_CODE,

						ORG_STATE: array[index].Organisation.ORG_STATE,

						ORG_TYPE: array[index].Organisation.ORG_TYPE,

						RECIPIENT_ORG: array[index].Organisation.RECIPIENT_ORG,

						title: array[index].Organisation.title
					},
					Expense: {
						Amount1: array[index].Expense.Amount1,
						Amount2: array[index].Expense.Amount2,
						Amount3: array[index].Expense.Amount3,
						Amount4: array[index].Expense.Amount4,
						Amount5: array[index].Expense.Amount5,
						Amount6: array[index].Expense.Amount6,
						COMPANY_CODE: array[index].Expense.COMPANY_CODE,
						DATE_OF_EXP: array[index].Expense.DATE_OF_EXP,
						EXP_DES: array[index].Expense.EXP_DES,
						EXP_SUBCAT: array[index].Expense.EXP_SUBCAT,

						EXP_TYPE: array[index].Expense.EXP_TYPE,

						GEN_LEDGER: array[index].Expense.GEN_LEDGER,

						GEN_LEDGER_AREA: array[index].Expense.GEN_LEDGER_AREA,

						HotelCity_EXP: array[index].Expense.HotelCity_EXP,

						HotelName_EXP: array[index].Expense.HotelName_EXP,

						IS_Expense: array[index].Expense.IS_Expense,

						IS_TRAVEL: array[index].Expense.IS_TRAVEL,

						LOCALCURRENCY: array[index].Expense.LOCALCURRENCY,

						OTHERTRAVEL_EXP: array[index].Expense.OTHERTRAVEL_EXP,

						PAYMENT_METHOD: array[index].Expense.PAYMENT_METHOD,

						REQ_AMT_EXP: array[index].Expense.REQ_AMT_EXP,

						REQ_AMT_EXP_USD: array[index].Expense.REQ_AMT_EXP_USD,

						SummaryTotals_Value1: array[index].Expense.SummaryTotals_Value1,

						SummaryTotals_Value2: array[index].Expense.SummaryTotals_Value2,

						SummaryTotals_Value3: array[index].Expense.SummaryTotals_Value3,

						TRAVEL_EXPENSE: array[index].Expense.TRAVEL_EXPENSE,

						TravelDest_EXP: array[index].Expense.TravelDest_EXP,

						TravelOrgin_EXP: array[index].Expense.TravelOrgin_EXP,

						title: array[index].Expense.title

					}

				};
				arr.push(obj);
			}
			this.getView().getModel("repTableModel").setData(arr);
			this.getSummaryTotal();

		},
		getQueryParameters: function (oLocation) {

			var oQuery = {};
			var aParams = oLocation.search.substring(1).split("&");
			for (var i = 0; i < aParams.length; i++) {
				var aPair = aParams[i].split("=");
				oQuery[aPair[0]] = decodeURIComponent(aPair[1]);
			}
			return oQuery;

		},
		onHandleConfirmApprover: function (oEvent) {
			var aContexts = oEvent.getParameter("selectedContexts");
			if (aContexts && aContexts.length) {

				var valueName,
					//REQ0470877:RMANDAL:GWDK901935:11/06/2019:Passing User Id:START
					sUserId;
				//REQ0470877:RMANDAL:GWDK901935:11/06/2019:Passing User Id:END

				aContexts.map(function (oContext) {
					valueName = oContext.getObject().NAME;
					//REQ0470877:RMANDAL:GWDK901935:11/06/2019:Passing User Id:START
					sUserId = oContext.getObject().USERID;
					//REQ0470877:RMANDAL:GWDK901935:11/06/2019:Passing User Id:END
				});

				this.getView().getModel("oApproverModel").setProperty(this.sPath + "/APPR", valueName);
				//REQ0470877:RMANDAL:GWDK901935:11/06/2019:Passing User Id:START
				this.getView().getModel("oApproverModel").setProperty(this.sPath + "/APPR_ID", sUserId);
				//REQ0470877:RMANDAL:GWDK901935:11/06/2019:Passing User Id:END
			}
		},

		_onInputValueHelpRequest: function (oEvent) {

			var sDialogName = "Dialog2";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			var oSource = oEvent.getSource();
			var oBindingContext = oSource.getBindingContext();
			var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
			var oView;
			if (!oDialog) {
				this.getOwnerComponent().runAsOwner(function () {
					oView = sap.ui.xmlview({
						viewName: "com.sap.build.standard.governmentApp.view." + sDialogName
					});
					this.getView().addDependent(oView);
					oView.getController().setRouter(this.oRouter);
					oDialog = oView.getContent()[0];
					this.mDialogs[sDialogName] = oDialog;
				}.bind(this));
			}

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

				var oModel = this.getOwnerComponent().getModel("oDataModel");
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

		},
		convertTextToIndexFormatter: function (sTextValue) {

			/*  var oRadioButtonGroup =
 this.byId("sap_Responsive_Page_0-content-sap_m_IconTabBar-1500880096540-items-sap_m_IconTabFilter-5-content-build_simple_form_Form-1504523675169-formContainers-build_simple_form_FormContainer-1-formElements-build_simple_form_For+
mElement-1516077132590-fields-sap_m_RadioButtonGroup-1516078394904");*/
			var oButtonsBindingInfo = oRadioButtonGroup.getBindingInfo("buttons");
			if (oButtonsBindingInfo && oButtonsBindingInfo.binding) {
				// look up index in bound context
				var sTextBindingPath = oButtonsBindingInfo.template.getBindingPath("text");
				return oButtonsBindingInfo.binding.getContexts(oButtonsBindingInfo.startIndex, oButtonsBindingInfo.length).findIndex(function (
					oButtonContext) {
					return oButtonContext.getProperty(sTextBindingPath) === sTextValue;
				});
			} else {
				// look up index in static items
				return oRadioButtonGroup.getButtons().findIndex(function (oButton) {
					return oButton.getText() === sTextValue;
				});
			}

		},
		_onRadioButtonGroupSelect: function (oEvent) {

			this.radioButton = true;
			if (oEvent.getParameters().selectedIndex === 1) {
				this.getView().getModel("headerUserModel").setProperty("/selectedIndex_SPE", 1);

				this.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField_Exp", true);
				this.getView().getModel("headerUserModel").setProperty("/SPE_Visible", false);

				this.getView().getModel("headerUserModel").setProperty("/Is_SPE", "No");

			} else if (oEvent.getParameters().selectedIndex === 0) {
				this.getView().getModel("headerUserModel").setProperty("/selectedIndex_SPE", 0);
				this.getView().getModel("headerUserModel").setProperty("/SPE_Visible", true);

				this.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField_SPE", false);
				this.getView().getModel("headerUserModel").setProperty("/Is_SPE", "Yes");
			}
		},
		convertTextToIndexFormatter1: function (sTextValue) {

			/* var oRadioButtonGroup =
 this.byId("sap_Responsive_Page_0-content-sap_m_IconTabBar-1500880096540-items-sap_m_IconTabFilter-5-content-build_simple_form_Form-1504523675169-formContainers-build_simple_form_FormContainer-1-formElements-build_simple_form_For+
mElement-1516081646322-fields-sap_m_RadioButtonGroup-1516081729093");*/
			var oButtonsBindingInfo = oRadioButtonGroup.getBindingInfo("buttons");
			if (oButtonsBindingInfo && oButtonsBindingInfo.binding) {
				// look up index in bound context
				var sTextBindingPath = oButtonsBindingInfo.template.getBindingPath("text");
				return oButtonsBindingInfo.binding.getContexts(oButtonsBindingInfo.startIndex, oButtonsBindingInfo.length).findIndex(function (
					oButtonContext) {
					return oButtonContext.getProperty(sTextBindingPath) === sTextValue;
				});
			} else {
				// look up index in static items
				return oRadioButtonGroup.getButtons().findIndex(function (oButton) {
					return oButton.getText() === sTextValue;
				});
			}

		},
		_onRadioButtonGroupSelect1: function (oEvent) {

			this.radioButton1 = true;
			if (oEvent.getParameters().selectedIndex === 1) {
				this.getView().getModel("headerUserModel").setProperty("/selectedIndex_Exp", 1);
				this.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField_Exp", true);
				this.getView().getModel("headerUserModel").setProperty("/Exp", false);
				this.getView().getModel("headerUserModel").setProperty("/NoExp", true);
				this.getView().getModel("headerUserModel").setProperty("/Is_Exp", "No");

			} else if (oEvent.getParameters().selectedIndex === 0) {
				this.getView().getModel("headerUserModel").setProperty("/selectedIndex_Exp", 0);
				this.getView().getModel("headerUserModel").setProperty("/Exp", true);
				this.getView().getModel("headerUserModel").setProperty("/NoExp", false);
				this.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField_Exp", false);
				this.getView().getModel("headerUserModel").setProperty("/Is_Exp", "Yes");
			}
		},

		convertTextToIndexFormatter2: function (sTextValue) {

			var oRadioButtonGroup = this.byId(
				"sap_Responsive_Page_0-content-sap_m_IconTabBar-1500880096540-items-sap_m_IconTabFilter-1500880495714-content-sap_m_NavigationBar-1516088419857-contentLeft-sap_m_RadioButtonGroup-1516088556640"
			);
			var oButtonsBindingInfo = oRadioButtonGroup.getBindingInfo("buttons");
			if (oButtonsBindingInfo && oButtonsBindingInfo.binding) {
				// look up index in bound context
				var sTextBindingPath = oButtonsBindingInfo.template.getBindingPath("text");
				return oButtonsBindingInfo.binding.getContexts(oButtonsBindingInfo.startIndex, oButtonsBindingInfo.length).findIndex(function (
					oButtonContext) {
					return oButtonContext.getProperty(sTextBindingPath) === sTextValue;
				});
			} else {
				// look up index in static items
				return oRadioButtonGroup.getButtons().findIndex(function (oButton) {
					return oButton.getText() === sTextValue;
				});
			}

		},
		_onRadioButtonGroupSelect2: function (oEvent) {
			this.radioButton2 = true;
			if (oEvent.getParameters().selectedIndex === 1) {
				this.getView().getModel("headerUserModel").setProperty("/selectedIndex2", 1);

				this.getView().getModel("headerUserModel").setProperty("/VALUE2", "No");

			} else if (oEvent.getParameters().selectedIndex === 0) {
				this.getView().getModel("headerUserModel").setProperty("/selectedIndex2", 0);

				this.getView().getModel("headerUserModel").setProperty("/VALUE2", "Yes");
			}

		},
		convertTextToIndexFormatter3: function (sTextValue) {

			var oRadioButtonGroup = this.byId(
				"sap_Responsive_Page_0-content-sap_m_IconTabBar-1500880096540-items-sap_m_IconTabFilter-1500880495714-content-sap_m_NavigationBar-1516088975730-contentLeft-sap_m_RadioButtonGroup-1516089114523"
			);
			var oButtonsBindingInfo = oRadioButtonGroup.getBindingInfo("buttons");
			if (oButtonsBindingInfo && oButtonsBindingInfo.binding) {
				// look up index in bound context
				var sTextBindingPath = oButtonsBindingInfo.template.getBindingPath("text");
				return oButtonsBindingInfo.binding.getContexts(oButtonsBindingInfo.startIndex, oButtonsBindingInfo.length).findIndex(function (
					oButtonContext) {
					return oButtonContext.getProperty(sTextBindingPath) === sTextValue;
				});
			} else {
				// look up index in static items
				return oRadioButtonGroup.getButtons().findIndex(function (oButton) {
					return oButton.getText() === sTextValue;
				});
			}

		},
		_onRadioButtonGroupSelect3: function (oEvent) {

			this.radioButton3 = true;
			if (oEvent.getParameters().selectedIndex === 1) {
				this.getView().getModel("headerUserModel").setProperty("/selectedIndex3", 1);

				this.getView().getModel("headerUserModel").setProperty("/VALUE3", "No");
				this.getView().getModel("headerUserModel").setProperty("/JUST3", "");
			} else if (oEvent.getParameters().selectedIndex === 0) {
				this.getView().getModel("headerUserModel").setProperty("/selectedIndex3", 0);
				this.getView().getModel("headerUserModel").setProperty("/VALUE3", "Yes");
			}
		},
		convertTextToIndexFormatter4: function (sTextValue) {

			var oRadioButtonGroup = this.byId(
				"sap_Responsive_Page_0-content-sap_m_IconTabBar-1500880096540-items-sap_m_IconTabFilter-1500880495714-content-sap_m_NavigationBar-1516088981890-contentLeft-sap_m_RadioButtonGroup-1516089236263"
			);
			var oButtonsBindingInfo = oRadioButtonGroup.getBindingInfo("buttons");
			if (oButtonsBindingInfo && oButtonsBindingInfo.binding) {
				// look up index in bound context
				var sTextBindingPath = oButtonsBindingInfo.template.getBindingPath("text");
				return oButtonsBindingInfo.binding.getContexts(oButtonsBindingInfo.startIndex, oButtonsBindingInfo.length).findIndex(function (
					oButtonContext) {
					return oButtonContext.getProperty(sTextBindingPath) === sTextValue;
				});
			} else {
				// look up index in static items
				return oRadioButtonGroup.getButtons().findIndex(function (oButton) {
					return oButton.getText() === sTextValue;
				});
			}

		},
		_onRadioButtonGroupSelect4: function (oEvent) {
			this.radioButton4 = true;
			if (oEvent.getParameters().selectedIndex === 1) {
				this.getView().getModel("headerUserModel").setProperty("/selectedIndex4", 1);

				this.getView().getModel("headerUserModel").setProperty("/VALUE4", "No");

			} else if (oEvent.getParameters().selectedIndex === 0) {
				this.getView().getModel("headerUserModel").setProperty("/selectedIndex4", 0);

				this.getView().getModel("headerUserModel").setProperty("/VALUE4", "Yes");
			}
		},
		convertTextToIndexFormatter5: function (sTextValue) {

			var oRadioButtonGroup = this.byId(
				"sap_Responsive_Page_0-content-sap_m_IconTabBar-1500880096540-items-sap_m_IconTabFilter-1500880495714-content-sap_m_NavigationBar-1516088985836-contentLeft-sap_m_RadioButtonGroup-1516089280891"
			);
			var oButtonsBindingInfo = oRadioButtonGroup.getBindingInfo("buttons");
			if (oButtonsBindingInfo && oButtonsBindingInfo.binding) {
				// look up index in bound context
				var sTextBindingPath = oButtonsBindingInfo.template.getBindingPath("text");
				return oButtonsBindingInfo.binding.getContexts(oButtonsBindingInfo.startIndex, oButtonsBindingInfo.length).findIndex(function (
					oButtonContext) {
					return oButtonContext.getProperty(sTextBindingPath) === sTextValue;
				});
			} else {
				// look up index in static items
				return oRadioButtonGroup.getButtons().findIndex(function (oButton) {
					return oButton.getText() === sTextValue;
				});
			}

		},
		_onRadioButtonGroupSelect5: function (oEvent) {
			this.radioButton5 = true;
			if (oEvent.getParameters().selectedIndex === 1) {
				this.getView().getModel("headerUserModel").setProperty("/selectedIndex5", 1);

				this.getView().getModel("headerUserModel").setProperty("/VALUE5", "No");

			} else if (oEvent.getParameters().selectedIndex === 0) {
				this.getView().getModel("headerUserModel").setProperty("/selectedIndex5", 0);

				this.getView().getModel("headerUserModel").setProperty("/VALUE5", "Yes");
			}

		},
		convertTextToIndexFormatter6: function (sTextValue) {

			var oRadioButtonGroup = this.byId(
				"sap_Responsive_Page_0-content-sap_m_IconTabBar-1500880096540-items-sap_m_IconTabFilter-1500880495714-content-sap_m_NavigationBar-1516098882945-contentLeft-sap_m_RadioButtonGroup-1516103373142"
			);
			var oButtonsBindingInfo = oRadioButtonGroup.getBindingInfo("buttons");
			if (oButtonsBindingInfo && oButtonsBindingInfo.binding) {
				// look up index in bound context
				var sTextBindingPath = oButtonsBindingInfo.template.getBindingPath("text");
				return oButtonsBindingInfo.binding.getContexts(oButtonsBindingInfo.startIndex, oButtonsBindingInfo.length).findIndex(function (
					oButtonContext) {
					return oButtonContext.getProperty(sTextBindingPath) === sTextValue;
				});
			} else {
				// look up index in static items
				return oRadioButtonGroup.getButtons().findIndex(function (oButton) {
					return oButton.getText() === sTextValue;
				});
			}

		},
		getApprovers: function (eFormNnum) {

			var sUrl = "/Approvers";
			var that = this;
			var sFormNnum = eFormNnum;
			var aFilter = [];
			var oFilter = new Filter("EFORM_NUM", FilterOperator.EQ, sFormNnum);
			aFilter.push(oFilter);
			this._serverModel.read(sUrl, {
				filters: aFilter,
				success: function (data) {
					//REQ0470877:RMANDAL:GWDK901935:11/04/2019:Display Employees of groups:START
					/*		var oData = data.results;
							for (var i = 0; i < oData.length; i++) {
								if (oData[i].APPROVED === "X") {
									oData[i].APPROVED = true;
								} else {
									oData[i].APPROVED = false;
								}
								if (oData[i].MANUAL === "X") {
									oData[i].MANUAL = true;
								} else {
									oData[i].MANUAL = false;
								}
								oData[i].isAppEnabled = false;
								that._component.getModel("oApproverModel").setData(oData);*/

					var aDataSet = [];
					data.results.forEach(function (item, index) {
						var sStatus;
						if (item.APPROVED === "X") {
							sStatus = "Approved";
						} else if (item.APPROVED === "R") {
							sStatus = "Rejected";
						} else {
							sStatus = "";
						}
						aDataSet.push({
							ADDED_BY: item.ADDED_BY,
							ADDED_BY_ID: item.ADDED_BY_ID,
							APPR: item.APPR,
							APPROVAL_DT: item.APPROVAL_DT,
							APPROVAL_TM: item.APPROVAL_TM,
							APPROVED: sStatus,
							APPROVED_BY: item.APPROVED_BY,
							APPROVED_BY_ID: item.APPROVED_BY_ID,
							APPROVER_TYPE: item.APPROVER_TYPE,
							APPR_ID: item.APPR_ID,
							CREATION_DT: item.CREATION_DT,
							GRP: (item.GRP === "X") ? true : false,
							MANUAL: (item.MANUAL === "X") ? true : false,
							REVIEWER_TYPE: item.REVIEWER_TYPE,
							isAppEnabled: false,
							isInput: false
						});
					});
					that._component.getModel("oApproverModel").setData(aDataSet);
					//REQ0470877:RMANDAL:GWDK901935:11/04/2019:Display Employees of groups:END
				}
			});
		},

		//REQ0470877:RMANDAL:GWDK901935:11/06/2019:Factory function for link and valuehelp template in approval flow table:START
		approverFlowFactory: function (sId, oContext) {
			var oTemplate;
			if (oContext.getProperty("isInput")) {

				oTemplate = new sap.m.ColumnListItem({
					cells: [
						new sap.m.Text({
							text: "{oApproverModel>APPROVED}"
						}),
						new sap.m.Input({
							value: "{oApproverModel>APPR}",
							showValueHelp: true,
							valueHelpOnly: true,
							valueHelpRequest: [this.onHandleApproverValueHelp, this]
						}),
						new sap.m.Text({
							text: "{oApproverModel>REVIEWER_TYPE}"
						}),
						new sap.m.Text({
							text: "{oApproverModel>APPROVED_BY}",
							wrapping: true
						}),
						new sap.m.Text({
							text: "{oApproverModel>APPROVAL_DT}"
						}),
						new sap.m.Text({
							text: "{oApproverModel>APPROVAL_TM}"
						}),
						new sap.m.CheckBox({
							editable: "{oApproverModel>isAppEnabled}",
							selected: "{oApproverModel>MANUAL}"
						}),
						new sap.m.Text({
							text: "{oApproverModel>ADDED_BY}",
							wrapping: true
						}),
						new sap.m.Text({
							text: "{oApproverModel>CREATION_DT}"
						})
					]
				});
			} else {
				oTemplate = new sap.m.ColumnListItem({
					cells: [
						new sap.m.Text({
							text: "{oApproverModel>APPROVED}"
						}),
						new sap.m.Link({
							text: "{oApproverModel>APPR}",
							enabled: "{oApproverModel>GRP}",
							press: [this._displayEmployees, this],
							wrapping: true
						}),
						new sap.m.Text({
							text: "{oApproverModel>REVIEWER_TYPE}"
						}),
						new sap.m.Text({
							text: "{oApproverModel>APPROVED_BY}",
							wrapping: true
						}),
						new sap.m.Text({
							text: "{oApproverModel>APPROVAL_DT}"
						}),
						new sap.m.Text({
							text: "{oApproverModel>APPROVAL_TM}"
						}),
						new sap.m.CheckBox({
							editable: "{oApproverModel>isAppEnabled}",
							selected: "{oApproverModel>MANUAL}"
						}),
						new sap.m.Text({
							text: "{oApproverModel>ADDED_BY}",
							wrapping: true
						}),
						new sap.m.Text({
							text: "{oApproverModel>CREATION_DT}"
						})
					]
				});
			}
			return oTemplate;
		},
		//REQ0470877:RMANDAL:GWDK901935:11/06/2019:Factory function for link and valuehelp template in approval flow table:START

		_onRadioButtonGroupSelect6: function (oEvent) {
			this.radioButton6 = true;
			if (oEvent.getParameters().selectedIndex === 1) {
				this.getView().getModel("headerUserModel").setProperty("/selectedIndex6", 1);

				this.getView().getModel("headerUserModel").setProperty("/VALUE6", "No");

			} else if (oEvent.getParameters().selectedIndex === 0) {
				this.getView().getModel("headerUserModel").setProperty("/selectedIndex6", 0);

				this.getView().getModel("headerUserModel").setProperty("/VALUE6", "Yes");
			}
		},
		convertTextToIndexFormatter7: function (sTextValue) {

			var oRadioButtonGroup = this.byId(
				"sap_Responsive_Page_0-content-sap_m_IconTabBar-1500880096540-items-sap_m_IconTabFilter-1500880495714-content-sap_m_NavigationBar-1516098886294-contentLeft-sap_m_RadioButtonGroup-1516103577192"
			);
			var oButtonsBindingInfo = oRadioButtonGroup.getBindingInfo("buttons");
			if (oButtonsBindingInfo && oButtonsBindingInfo.binding) {
				// look up index in bound context
				var sTextBindingPath = oButtonsBindingInfo.template.getBindingPath("text");
				return oButtonsBindingInfo.binding.getContexts(oButtonsBindingInfo.startIndex, oButtonsBindingInfo.length).findIndex(function (
					oButtonContext) {
					return oButtonContext.getProperty(sTextBindingPath) === sTextValue;
				});
			} else {
				// look up index in static items
				return oRadioButtonGroup.getButtons().findIndex(function (oButton) {
					return oButton.getText() === sTextValue;
				});
			}

		},
		handleAmoutFormatterByTotal: function (oEvent) {
			var sAmount = oEvent;
			var options2 = {
				currency: 'USD'
			};

			var totalUsd = new Intl.NumberFormat('en-US', options2).format(sAmount);
			return totalUsd;

		},
		getSummaryTotal: function () {
			var arr = this.getView().getModel("repTableModel").getData();
			this.SummaryTotals_Value1 = 0.00;
			this.SummaryTotals_Value2 = 0.00;
			this.SummaryTotals_Value3 = 0.00;
			this.SummaryTotals_Value4 = 0.00;
			this.SummaryTotals_Value5 = 0.00;
			this.SummaryTotals_Value6 = 0.00;
			this.SummaryTotals_Value7 = 0.00;
			var SummaryTotals_Value1, SummaryTotals_Value2, SummaryTotals_Value3, SummaryTotals_Value4, SummaryTotals_Value5,
				SummaryTotals_Value6, SummaryTotals_Value7;

			if (arr.length > 0) {

				for (var i = 0; i < arr.length; i++) {
					var v1 = 0;
					var v2 = 0;
					var v3 = 0;
					var v4 = 0;
					var v5 = 0;
					var v6 = 0;
					var v7 = 0;
					var expenseType = arr[i].Expense.EXP_TYPE;
					var that = this;
					if (expenseType === "Promotional & Marketing Expense") {

						var total1 = arr[i].Expense.Amount1;
						if (total1) {
							var index1 = total1.indexOf("$");
							var index2 = total1.indexOf(" USD");
							if (index1 !== -1 || index2 !== -1) {
								var total1 = total.substr(index1 + 1, index2 - 1);
								total1 = parseFloat(total1);
							} else {
								//REQ0470877:RMANDAL:GWDK901935:09/12/2019:MODIFY:START
								var a = total1.replace(/,/g, "").trim();
								//REQ0470877:RMANDAL:GWDK901935:09/12/2019:MODIFY:END
								total1 = parseFloat(a);
							}
							if (isNaN(that.SummaryTotals_Value1)) {
								var indexOfComma = that.SummaryTotals_Value1.indexOf(",");
								if (indexOfComma !== -1) {
									that.SummaryTotals_Value1 = that.SummaryTotals_Value1.replace(/,/g, "").trim();
									that.SummaryTotals_Value1 = parseFloat(that.SummaryTotals_Value1);
								}
							}
							that.SummaryTotals_Value1 = parseFloat(that.SummaryTotals_Value1);
							that.SummaryTotals_Value1 = that.handleAmoutFormatterByTotal(that.SummaryTotals_Value1 + total1);
						}

					}
					if (expenseType === "Entertainment") {
						var total1 = arr[i].Expense.Amount2;
						if (total1) {
							var index1 = total1.indexOf("$");
							var index2 = total1.indexOf(" USD");
							if (index1 !== -1 || index2 !== -1) {
								var total1 = total1.substr(index1 + 1, index2 - 1);
								total1 = parseFloat(total1);
							} else {

								//REQ0470877:RMANDAL:GWDK901935:09/12/2019:MODIFY:START
								var a = total1.replace(/,/g, "").trim();
								//REQ0470877:RMANDAL:GWDK901935:09/12/2019:MODIFY:END
								total1 = parseFloat(a);
							}
							if (isNaN(that.SummaryTotals_Value2)) {
								var indexOfComma = that.SummaryTotals_Value2.indexOf(",");
								if (indexOfComma !== -1) {
									that.SummaryTotals_Value2 = that.SummaryTotals_Value2.replace(",", "").trim();
									that.SummaryTotals_Value2 = parseFloat(that.SummaryTotals_Value2);
								}
							}
							that.SummaryTotals_Value2 = parseFloat(that.SummaryTotals_Value2);

							that.SummaryTotals_Value2 = that.handleAmoutFormatterByTotal(that.SummaryTotals_Value2 + total1);
							//that.getOwnerComponent().getModel("headerUserModel").setProperty("/SummaryTotals_Value2","$"+that.SummaryTotals_Value2+" USD");
						}
					}
					if (expenseType === "Company Logo Gifts") {
						var total1 = arr[i].Expense.Amount3;
						if (total1) {
							var index1 = total1.indexOf("$");
							var index2 = total1.indexOf(" USD");
							if (index1 !== -1 || index2 !== -1) {
								var total1 = total1.substr(index1 + 1, index2 - 1);
								total1 = parseFloat(total1);
							} else {
								//REQ0470877:RMANDAL:GWDK901935:09/12/2019:MODIFY:START
								var a = total1.replace(/,/g, "").trim();
								//REQ0470877:RMANDAL:GWDK901935:09/12/2019:MODIFY:END
								total1 = parseFloat(a);
							}
							if (isNaN(that.SummaryTotals_Value3)) {
								var indexOfComma = that.SummaryTotals_Value3.indexOf(",");
								if (indexOfComma !== -1) {
									that.SummaryTotals_Value3 = that.SummaryTotals_Value3.replace(",", "").trim();
									that.SummaryTotals_Value3 = parseFloat(that.SummaryTotals_Value3);
								}
							}
							that.SummaryTotals_Value3 = parseFloat(that.SummaryTotals_Value3);

							that.SummaryTotals_Value3 = that.handleAmoutFormatterByTotal(that.SummaryTotals_Value3 + total1);
							//that.getOwnerComponent().getModel("headerUserModel").setProperty("/SummaryTotals_Value3","$"+that.SummaryTotals_Value3+" USD");
						}
					}
					if (expenseType === "Non Company Logo Gifts") {
						var total1 = arr[i].Expense.Amount4;
						if (total1) {
							var index1 = total1.indexOf("$");
							var index2 = total1.indexOf(" USD");
							if (index1 !== -1 || index2 !== -1) {
								var total1 = total1.substr(index1 + 1, index2 - 1);
								total1 = parseFloat(total1);
							} else {
								//REQ0470877:RMANDAL:GWDK901935:09/12/2019:MODIFY:START
								var a = total1.replace(/,/g, "").trim();
								//REQ0470877:RMANDAL:GWDK901935:09/12/2019:MODIFY:END
								total1 = parseFloat(a);
							}
							if (isNaN(that.SummaryTotals_Value4)) {
								var indexOfComma = that.SummaryTotals_Value4.indexOf(",");
								if (indexOfComma !== -1) {
									that.SummaryTotals_Value4 = that.SummaryTotals_Value4.replace(",", "").trim();
									that.SummaryTotals_Value4 = parseFloat(that.SummaryTotals_Value4);
								}
							}
							that.SummaryTotals_Value4 = parseFloat(that.SummaryTotals_Value4);
							that.SummaryTotals_Value4 = that.handleAmoutFormatterByTotal(that.SummaryTotals_Value4 + total1);
							//that.getOwnerComponent().getModel("headerUserModel").setProperty("/SummaryTotals_Value4","$"+that.SummaryTotals_Value4+" USD");
						}
					}
					if (expenseType === "Payment authorized by written local law") {
						var total1 = arr[i].Expense.Amount5;
						if (total1) {
							var index1 = total1.indexOf("$");
							var index2 = total1.indexOf(" USD");
							if (index1 !== -1 || index2 !== -1) {
								var total1 = total1.substr(index1 + 1, index2 - 1);
								total1 = parseFloat(total1);
							} else {
								//REQ0470877:RMANDAL:GWDK901935:09/12/2019:MODIFY:START
								var a = total1.replace(/,/g, "").trim();
								//REQ0470877:RMANDAL:GWDK901935:09/12/2019:MODIFY:END
								total1 = parseFloat(a);
							}
							if (isNaN(that.SummaryTotals_Value5)) {
								var indexOfComma = that.SummaryTotals_Value5.indexOf(",");
								if (indexOfComma !== -1) {
									that.SummaryTotals_Value5 = that.SummaryTotals_Value5.replace(",", "").trim();
									that.SummaryTotals_Value5 = parseFloat(that.SummaryTotals_Value5);
								}
							}
							that.SummaryTotals_Value5 = parseFloat(that.SummaryTotals_Value5);
							that.SummaryTotals_Value5 = that.handleAmoutFormatterByTotal(that.SummaryTotals_Value5 + total1);
							//that.getOwnerComponent().getModel("headerUserModel").setProperty("/SummaryTotals_Value5","$"+that.SummaryTotals_Value5+" USD");}
						}
					}
					if (expenseType === "Emergency facilitating payment") {
						var total1 = arr[i].Expense.Amount6;
						if (total1) {
							var index1 = total1.indexOf("$");
							var index2 = total1.indexOf(" USD");
							if (index1 !== -1 || index2 !== -1) {
								var total1 = total1.substr(index1 + 1, index2 - 1);
								total1 = parseFloat(total1);
							} else {
								//REQ0470877:RMANDAL:GWDK901935:09/12/2019:MODIFY:START
								var a = total1.replace(/,/g, "").trim();
								//REQ0470877:RMANDAL:GWDK901935:09/12/2019:MODIFY:END
								total1 = parseFloat(a);
							}
							if (isNaN(that.SummaryTotals_Value6)) {
								var indexOfComma = that.SummaryTotals_Value6.indexOf(",");
								if (indexOfComma !== -1) {
									that.SummaryTotals_Value6 = that.SummaryTotals_Value6.replace(",", "").trim();
									that.SummaryTotals_Value6 = parseFloat(that.SummaryTotals_Value6);
								}
							}
							that.SummaryTotals_Value6 = parseFloat(that.SummaryTotals_Value6);
							that.SummaryTotals_Value6 = that.handleAmoutFormatterByTotal(that.SummaryTotals_Value6 + total1);
							//that.getOwnerComponent().getModel("headerUserModel").setProperty("/SummaryTotals_Value6","$"+that.SummaryTotals_Value6+" USD");
						}
					}

					if (isNaN(that.SummaryTotals_Value7)) {
						var index1 = that.SummaryTotals_Value7.indexOf("$");
						var index2 = that.SummaryTotals_Value7.indexOf(" USD");
						if (index1 !== -1 || index2 !== -1) {
							that.SummaryTotals_Value7 = that.SummaryTotals_Value7.substr(index1 + 1, index2 - 1);
							var indexOfComma = that.SummaryTotals_Value7.indexOf(",");
							if (indexOfComma !== -1) {
								that.SummaryTotals_Value7 = that.SummaryTotals_Value7.replace(",", "").trim();
								that.SummaryTotals_Value7 = parseFloat(that.SummaryTotals_Value7);
								//that.SummaryTotals_Value7 = parseFloat(total1);
							} else {

								var a = that.SummaryTotals_Value7.replace(/,/g, "").trim();
								that.SummaryTotals_Value7 = parseFloat(a);
							}
						}

					}
					//var v7 = parseFloat(that.SummaryTotals_Value7.split(',').join(''));
					if (isNaN(that.SummaryTotals_Value6)) {
						var v6 = parseFloat(that.SummaryTotals_Value6.split(',').join(''));
					} else {
						var v6 = parseFloat(that.SummaryTotals_Value6);

					}

					if (isNaN(that.SummaryTotals_Value5)) {
						var v5 = parseFloat(that.SummaryTotals_Value5.split(',').join(''));
					} else {
						var v5 = parseFloat(that.SummaryTotals_Value5);

					}

					if (isNaN(that.SummaryTotals_Value4)) {
						var v4 = parseFloat(that.SummaryTotals_Value4.split(',').join(''));
					} else {
						var v4 = parseFloat(that.SummaryTotals_Value4);

					}

					if (isNaN(that.SummaryTotals_Value3)) {
						var v3 = parseFloat(that.SummaryTotals_Value3.split(',').join(''));
					} else {
						var v3 = parseFloat(that.SummaryTotals_Value3);

					}

					if (isNaN(that.SummaryTotals_Value2)) {
						var v2 = parseFloat(that.SummaryTotals_Value2.split(',').join(''));
					} else {
						var v2 = parseFloat(that.SummaryTotals_Value2);

					}

					if (isNaN(that.SummaryTotals_Value1)) {

						var v1 = parseFloat(that.SummaryTotals_Value1.split(',').join(''));
					} else {
						var v1 = parseFloat(that.SummaryTotals_Value1);

					}
					if (isNaN(that.SummaryTotals_Value7)) {
						var v7 = parseFloat(that.SummaryTotals_Value7.split(',').join(''));
					} else {
						var v7 = parseFloat(that.SummaryTotals_Value7);

					}

					var total = v1 + v2 + v3 + v4 + v5 + v6;
					that.SummaryTotals_Value7 = that.handleAmoutFormatterByTotal(total);

					//that.SummaryTotals_Value7=  that.handleAmoutFormatterByTotal(that.SummaryTotals_Value7 + that.SummaryTotals_Value6 + that.SummaryTotals_Value5 +that.SummaryTotals_Value4+that.SummaryTotals_Value3+that.SummaryTotals_Value2+that.SummaryTotals_Value1);
					//that.getOwnerComponent().getModel("headerUserModel").setProperty("/SummaryTotals_Value7","$"+that.SummaryTotals_Value7+" USD");

					// }

				}
				that.getOwnerComponent().getModel("headerUserModel").setProperty("/SummaryTotals_Value1", "$" + that.SummaryTotals_Value1 + " USD");
				that.getOwnerComponent().getModel("headerUserModel").setProperty("/SummaryTotals_Value2", "$" + that.SummaryTotals_Value2 + " USD");
				that.getOwnerComponent().getModel("headerUserModel").setProperty("/SummaryTotals_Value3", "$" + that.SummaryTotals_Value3 + " USD");
				that.getOwnerComponent().getModel("headerUserModel").setProperty("/SummaryTotals_Value4", "$" + that.SummaryTotals_Value4 + " USD");
				that.getOwnerComponent().getModel("headerUserModel").setProperty("/SummaryTotals_Value5", "$" + that.SummaryTotals_Value5 + " USD");
				that.getOwnerComponent().getModel("headerUserModel").setProperty("/SummaryTotals_Value6", "$" + that.SummaryTotals_Value6 + " USD");
				that.getOwnerComponent().getModel("headerUserModel").setProperty("/SummaryTotals_Value7", "$" + that.SummaryTotals_Value7 + " USD");

			}

		},

		_onRadioButtonGroupSelect7: function (oEvent) {
			this.radioButton7 = true;
			if (oEvent.getParameters().selectedIndex === 1) {
				this.getView().getModel("headerUserModel").setProperty("/selectedIndex7", 1);
				this.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField7", true);
				this.getView().getModel("headerUserModel").setProperty("/VALUE7", "No");
				this.getView().getModel("headerUserModel").setProperty("/JUST7", "");
			} else if (oEvent.getParameters().selectedIndex === 0) {
				this.getView().getModel("headerUserModel").setProperty("/selectedIndex7", 0);
				this.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField7", false);
				this.getView().getModel("headerUserModel").setProperty("/VALUE7", "Yes");
			}
		},
		convertTextToIndexFormatter8: function (sTextValue) {

			var oRadioButtonGroup = this.byId(
				"sap_Responsive_Page_0-content-sap_m_IconTabBar-1500880096540-items-sap_m_IconTabFilter-1504533892033-content-sap_m_VBox-1504534068990-items-sap_m_HBox-1-items-sap_m_RadioButtonGroup-2"
			);
			var oButtonsBindingInfo = oRadioButtonGroup.getBindingInfo("buttons");
			if (oButtonsBindingInfo && oButtonsBindingInfo.binding) {
				// look up index in bound context
				var sTextBindingPath = oButtonsBindingInfo.template.getBindingPath("text");
				return oButtonsBindingInfo.binding.getContexts(oButtonsBindingInfo.startIndex, oButtonsBindingInfo.length).findIndex(function (
					oButtonContext) {
					return oButtonContext.getProperty(sTextBindingPath) === sTextValue;
				});
			} else {
				// look up index in static items
				return oRadioButtonGroup.getButtons().findIndex(function (oButton) {
					return oButton.getText() === sTextValue;
				});
			}

		},
		_onRadioButtonGroupSelect8: function () {

		},
		convertTextToIndexFormatter9: function (sTextValue) {

			var oRadioButtonGroup = this.byId(
				"sap_Responsive_Page_0-content-sap_m_IconTabBar-1500880096540-items-sap_m_IconTabFilter-1504533892033-content-sap_m_VBox-1504534068991-items-sap_m_HBox-1-items-sap_m_RadioButtonGroup-2"
			);
			var oButtonsBindingInfo = oRadioButtonGroup.getBindingInfo("buttons");
			if (oButtonsBindingInfo && oButtonsBindingInfo.binding) {
				// look up index in bound context
				var sTextBindingPath = oButtonsBindingInfo.template.getBindingPath("text");
				return oButtonsBindingInfo.binding.getContexts(oButtonsBindingInfo.startIndex, oButtonsBindingInfo.length).findIndex(function (
					oButtonContext) {
					return oButtonContext.getProperty(sTextBindingPath) === sTextValue;
				});
			} else {
				// look up index in static items
				return oRadioButtonGroup.getButtons().findIndex(function (oButton) {
					return oButton.getText() === sTextValue;
				});
			}

		},
		_onRadioButtonGroupSelect9: function () {

		},
		convertTextToIndexFormatter10: function (sTextValue) {

			var oRadioButtonGroup = this.byId(
				"sap_Responsive_Page_0-content-sap_m_IconTabBar-1500880096540-items-sap_m_IconTabFilter-1504533892033-content-sap_m_VBox-1504534068992-items-sap_m_HBox-1-items-sap_m_RadioButtonGroup-2"
			);
			var oButtonsBindingInfo = oRadioButtonGroup.getBindingInfo("buttons");
			if (oButtonsBindingInfo && oButtonsBindingInfo.binding) {
				// look up index in bound context
				var sTextBindingPath = oButtonsBindingInfo.template.getBindingPath("text");
				return oButtonsBindingInfo.binding.getContexts(oButtonsBindingInfo.startIndex, oButtonsBindingInfo.length).findIndex(function (
					oButtonContext) {
					return oButtonContext.getProperty(sTextBindingPath) === sTextValue;
				});
			} else {
				// look up index in static items
				return oRadioButtonGroup.getButtons().findIndex(function (oButton) {
					return oButton.getText() === sTextValue;
				});
			}

		},
		_onRadioButtonGroupSelect10: function () {

		},
		convertTextToIndexFormatter11: function (sTextValue) {

			var oRadioButtonGroup = this.byId(
				"sap_Responsive_Page_0-content-sap_m_IconTabBar-1500880096540-items-sap_m_IconTabFilter-1504533892033-content-sap_m_VBox-1504534068993-items-sap_m_HBox-1-items-sap_m_RadioButtonGroup-2"
			);
			var oButtonsBindingInfo = oRadioButtonGroup.getBindingInfo("buttons");
			if (oButtonsBindingInfo && oButtonsBindingInfo.binding) {
				// look up index in bound context
				var sTextBindingPath = oButtonsBindingInfo.template.getBindingPath("text");
				return oButtonsBindingInfo.binding.getContexts(oButtonsBindingInfo.startIndex, oButtonsBindingInfo.length).findIndex(function (
					oButtonContext) {
					return oButtonContext.getProperty(sTextBindingPath) === sTextValue;
				});
			} else {
				// look up index in static items
				return oRadioButtonGroup.getButtons().findIndex(function (oButton) {
					return oButton.getText() === sTextValue;
				});
			}

		},
		_onRadioButtonGroupSelect11: function () {

		},
		convertTextToIndexFormatter12: function (sTextValue) {

			var oRadioButtonGroup = this.byId(
				"sap_Responsive_Page_0-content-sap_m_IconTabBar-1500880096540-items-sap_m_IconTabFilter-1504533892033-content-sap_m_VBox-1504534068994-items-sap_m_HBox-1-items-sap_m_RadioButtonGroup-2"
			);
			var oButtonsBindingInfo = oRadioButtonGroup.getBindingInfo("buttons");
			if (oButtonsBindingInfo && oButtonsBindingInfo.binding) {
				// look up index in bound context
				var sTextBindingPath = oButtonsBindingInfo.template.getBindingPath("text");
				return oButtonsBindingInfo.binding.getContexts(oButtonsBindingInfo.startIndex, oButtonsBindingInfo.length).findIndex(function (
					oButtonContext) {
					return oButtonContext.getProperty(sTextBindingPath) === sTextValue;
				});
			} else {
				// look up index in static items
				return oRadioButtonGroup.getButtons().findIndex(function (oButton) {
					return oButton.getText() === sTextValue;
				});
			}

		},
		_onRadioButtonGroupSelect12: function (oEvent) {

		},
		_onUploadCollectionUploadComplete: function (oEvent) {

			var oFile = oEvent.getParameter("files")[0];
			var iStatus = oFile ? oFile.status : 500;
			var sResponseRaw = oFile ? oFile.responseRaw : "";
			var oSourceBindingContext = oEvent.getSource().getBindingContext();
			var sSourceEntityId = oSourceBindingContext ? oSourceBindingContext.getProperty("") : null;
			var oModel = this.getOwnerComponent().getModel("oDataModel");

			return new Promise(function (fnResolve, fnReject) {
				if (iStatus !== 200) {
					fnReject(new Error("Upload failed"));
				} else if (oModel.hasPendingChanges()) {
					fnReject(new Error("Please save your changes, first"));
				} else if (!sSourceEntityId) {
					fnReject(new Error("No source entity key"));
				} else {
					try {
						var oResponse = JSON.parse(sResponseRaw);
						var oNewEntityInstance = {};

						oNewEntityInstance[""] = oResponse["ID"];
						oNewEntityInstance[""] = sSourceEntityId;
						oModel.createEntry("", {
							properties: oNewEntityInstance
						});
						oModel.submitChanges({
							success: function (oResponse) {
								var oChangeResponse = oResponse.__batchResponses[0].__changeResponses[0];
								if (oChangeResponse && oChangeResponse.response) {
									oModel.resetChanges();
									fnReject(new Error(oChangeResponse.message));
								} else {
									oModel.refresh();
									fnResolve();
								}
							},
							error: function (oError) {
								fnReject(new Error(oError.message));
							}
						});
					} catch (err) {
						var message = typeof err === "string" ? err : err.message;
						fnReject(new Error("Error: " + message));
					}
				}
			}).catch(function (err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		_onUploadCollectionChange: function (oEvent) {

			var oUploadCollection = oEvent.getSource();
			var aFiles = oEvent.getParameter('files');

			if (aFiles && aFiles.length) {
				var oFile = aFiles[0];
				var sFileName = oFile.name;

				var oDataModel = this.getOwnerComponent().getModel("oDataModel");
				if (oUploadCollection && sFileName && oDataModel) {
					var sXsrfToken = oDataModel.getSecurityToken();
					var oCsrfParameter = new sap.m.UploadCollectionParameter({
						name: "x-csrf-token",
						value: sXsrfToken
					});
					oUploadCollection.addHeaderParameter(oCsrfParameter);
					var oContentDispositionParameter = new sap.m.UploadCollectionParameter({
						name: "content-disposition",
						value: "inline; filename=\"" + encodeURIComponent(sFileName) + "\""
					});
					oUploadCollection.addHeaderParameter(oContentDispositionParameter);
				} else {
					throw new Error("Not enough information available");
				}
			}
		},
		_onUploadCollectionTypeMissmatch: function () {
			return new Promise(function (fnResolve) {
				sap.m.MessageBox.warning(
					"The file you are trying to upload does not have an authorized file type (JPEG, JPG, GIF, PNG, TXT, PDF, XLSX, DOCX, PPTX).", {
						title: "Invalid File Type",
						onClose: function () {
							fnResolve();
						}
					});
			}).catch(function (err) {
				if (err !== undefined) {
					MessageBox.error(err);
				}
			});

		},
		_onUploadCollectionFileSizeExceed: function () {
			return new Promise(function (fnResolve) {
				sap.m.MessageBox.warning("The file you are trying to upload is too large (10MB max).", {
					title: "File Too Large",
					onClose: function () {
						fnResolve();
					}
				});
			}).catch(function (err) {
				if (err !== undefined) {
					MessageBox.error(err);
				}
			});

		},

		openAttachment: function (oEvent) {
			var oSource = oEvent.getSource();
			var relPath = "/sap/opu/odata/sap/YFPSFIPFRDD0029_GOVERN_EFORM_SRV/eFormAttachments(EFORM_NUM='" + this.title + "'" +
				",FILE_NAME='" + oSource.getText() + "')/$value";
			window.open(relPath, '_blank');

		},

		onRefresh: function () {
			if (this.title) {
				this.getApprovers(this.title);
			}
		},
		_onButtonPress: function (oEvent) {

			var sDialogName = "Dialog3";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			var oSource = oEvent.getSource();
			var oBindingContext = oSource.getBindingContext();
			var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
			var oView;
			if (!oDialog) {
				this.getOwnerComponent().runAsOwner(function () {
					oView = sap.ui.xmlview({
						viewName: "com.sap.build.standard.governmentApp.view." + sDialogName
					});
					this.getView().addDependent(oView);
					oView.getController().setRouter(this.oRouter);
					oDialog = oView.getContent()[0];
					this.mDialogs[sDialogName] = oDialog;
				}.bind(this));
			}

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

				var oModel = this.getOwnerComponent().getModel("oDataModel");
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

		},
		_onButtonPress1: function (oEvent) {

			var sDialogName = "Dialog4";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			var oSource = oEvent.getSource();
			var oBindingContext = oSource.getBindingContext();
			var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
			var oView;
			if (!oDialog) {
				this.getOwnerComponent().runAsOwner(function () {
					oView = sap.ui.xmlview({
						viewName: "com.sap.build.standard.governmentApp.view." + sDialogName
					});
					this.getView().addDependent(oView);
					oView.getController().setRouter(this.oRouter);
					oDialog = oView.getContent()[0];
					this.mDialogs[sDialogName] = oDialog;
				}.bind(this));
			}

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

				var oModel = this.getOwnerComponent().getModel("oDataModel");
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

		},

		onInit: function () {

			var Rdmodel = new sap.ui.model.json.JSONModel();
			Rdmodel.setData({
				modelData: {
					riskData: [{
						"Text": "Yes",
						"Selected": true
					}, {
						"Text": "No",
						"Selected": false
					}]
				}
			});
			sap.ui.getCore().setModel(Rdmodel);

			this.mBindingOptions = {};
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);

			//Added by Akankshya
			this._component = this.getOwnerComponent();
			this._oView = this.getView();
			this._serverModel = this._component.getModel("oDataModel");
			var headerUserModel = new JSONModel();
			var oApproverModel = new JSONModel();
			var oCollectionModel = new JSONModel();
			var oCommentsModel = new JSONModel();

			this._component.setModel(headerUserModel, "headerUserModel");
			this._component.setModel(oApproverModel, "oApproverModel");
			this._component.setModel(oCollectionModel, "oCollectionModel");
			this._component.setModel(oCommentsModel, "oCommentsModel");
			this._component.setModel(new JSONModel(), "itemUserModel");
			this._component.setModel(new JSONModel(), "repTableModel");

			//this.odataModel= this._component.getModel("odataModel");
			this.oRouter.attachRouteMatched(this._onObjectMatched, this);

		},

		//Added by Akankshya

		_onObjectMatched: function (oEvent) {

			oContextView = oEvent.getParameter("arguments").context;
			this.oSourceView = oContextView;
			this.getView().byId("pageId").setTitle("Government Expenditure Request Form");
			var oEvent = oEvent;
			this.Form_Num = "";

			GovernmentEform = this;
			//Reset display of Approve & reject buttons
			this.getView().byId("b_approve").setVisible(false);
			this.getView().byId("b_reject").setVisible(false);

			if (oEvent.getParameters().name === "GovernmentRevenueSearch") {
				this.getView().byId("idPreparerBox").setVisible(false);
				this.getView().byId("idPreparerBox1").setVisible(false);

				this.Form_Num = oEvent.getParameters().arguments.context;
				//Set Approve/Reject buttons
				e_form_num = this.Form_Num;
				this.approve_reject_button_dsp();

				if (window.from_dialog !== "X") {
					this.onNavBack();
				} else {
					window.from_dialog = "";
				}
				if (this.Form_Num !== undefined) {

					this.title = this.Form_Num;
					this._component.getModel("headerUserModel").setProperty("/FORM_NUM", this.Form_Num);

					var oBundle = this._component.getModel("i18n").getResourceBundle();
					var sText = oBundle.getText("Title", [this.Form_Num]);

					this.getView().byId("pageTitleId").setText(sText);

					this.handleButtonEnable();
					var isEditedItems = this.getOwnerComponent().getModel("repTableModel").getProperty("/isEditedItems_EXP");
					if (isEditedItems) {
						//this.getFormData(this.title);
						if (this._component.getModel("headerUserModel").getProperty("/isEnable") === true) {
							this._component.getModel("headerUserModel").setProperty("/isEnable", true);
						}
						this.getSummaryTotal();
					} else {
						this._component.getModel("headerUserModel").setProperty("/isEnable", false);
						this.getFormData(this.title);
						this.getSummaryTotal();

					}
					if (!isEditedItems) {
						var model = this.getOwnerComponent().getModel("oDataModel");
						var that = this;
						model.read("/eFormInitialInfos('" + this.Form_Num + "')", {
							success: function (oData, response) {
								var status = that._component.getModel("headerUserModel").getProperty("/STATUS");
								if ((status !== "Approved") && (response.data.IS_GEFR_COMP === "X")) {
									// edit is allowed
									that.edit = true;
									that._component.getModel("headerUserModel").setProperty("/isEnable", true);

									that.handleButtonEnable(true);
									that.getView().getModel("headerUserModel").setProperty("/COMMENTS_ENABLED", true);

								}
							}
						});
					}

					//var sLoggedInUser =  this._component.getModel("headerUserModel").getProperty("/Logged_In_User");
					//var approverData = this._component.getModel("oApproverModel").getData();

				}
			} else if (oEvent.getParameters().name === "GovernmentRevenueCopy") {
				this.Form_Num = oEvent.getParameters().arguments.context;
				this.getView().byId("idPreparerBox").setVisible(false);
				this.getView().byId("idPreparerBox1").setVisible(false);
				if (this.Form_Num !== undefined) {

					this.title = "";
					this.title1 = this.Form_Num;

					var oBundle = this._component.getModel("i18n").getResourceBundle();
					// this._component.getModel("headerUserModel").setProperty("/FORM_NUM",this.Form_Num);
					if (this.getOwnerComponent().getModel("headerUserModel").getProperty("/FORM_NUM") &&
						this.getOwnerComponent().getModel("headerUserModel").getProperty("/isData")) {
						this.title = this.getOwnerComponent().getModel("headerUserModel").getProperty("/FORM_NUM");
						var oBundle = this._component.getModel("i18n").getResourceBundle();
						var sText = oBundle.getText("Title", [this.title]);
						this.getView().byId("pageTitleId").setText(sText);
					} else {
						this.title = "";
						var oBundle = this._component.getModel("i18n").getResourceBundle();
						var sText = oBundle.getText("Title", [""]);
						this.getView().byId("pageTitleId").setText(sText);
					}

					var isEditedItems = this.getOwnerComponent().getModel("repTableModel").getProperty("/isEditedItems_EXP");
					if (isEditedItems) {
						//this.getFormData(this.title);
						if (this._component.getModel("headerUserModel").getProperty("/isEnable") === true) {
							this._component.getModel("headerUserModel").setProperty("/isEnable", true);
						}
						this.getSummaryTotal();
					} else {
						//this._component.getModel("headerUserModel").setProperty("/isEnable",true);
						this.getFormData(this.title1, "copy");
						this.getSummaryTotal();

					}
					var sLoggedInUser = this._component.getModel("headerUserModel").getProperty("/LoggedInUser");

				}
				this.handleButtonEnable();

				this.getView().getModel("headerUserModel").setProperty("/isVisibleWithdraw", false);
			} else if (oEvent.getParameters().name === "GovernmentRevenue") {

				if (window.from_dialog !== "X") {
					this.onNavBack();
				} else {
					window.from_dialog = "";
				}

				this.sTittle = "";

				if (this.getOwnerComponent().getModel("headerUserModel").getProperty("/FORM_NUM")) {
					this.title = this.getOwnerComponent().getModel("headerUserModel").getProperty("/FORM_NUM");
					var oBundle = this._component.getModel("i18n").getResourceBundle();
					var sText = oBundle.getText("Title", [this.title]);
					this.getView().byId("pageTitleId").setText(sText);
				} else {
					var oBundle = this._component.getModel("i18n").getResourceBundle();
					var sText = oBundle.getText("Title", [""]);
					this.getView().byId("pageTitleId").setText(sText);
				}

				var headerData = {

					FILE_NAME: "myFileUpload",
					jusficationVisibleField1: false,
					jusficationVisibleField2: false,
					jusficationVisibleField3: false,
					jusficationVisibleField4: false,
					jusficationVisibleField6: false,
					jusficationVisibleField5: false,
					selectedIndex_SPE: -1,

					selectedIndex_Exp: -1,
					selectedIndex2: -1,
					selectedIndex1: -1,
					selectedIndex3: -1,
					selectedIndex4: -1,
					selectedIndex5: -1,
					selectedIndex6: -1,
					selectedIndex7: -1,
					isEnable_Edit: false,
					isEnable_Delete: false,
					SummaryTotals_Value1: "$0.00 USD",
					SummaryTotals_Value2: "$0.00 USD",
					SummaryTotals_Value3: "$0.00 USD",
					SummaryTotals_Value4: "$0.00 USD",
					SummaryTotals_Value5: "$0.00 USD",
					SummaryTotals_Value6: "$0.00 USD",
					SummaryTotals_Value7: "$0.00 USD",
					Exp: false,
					NoExp: true,
					Activity: "",
					Loc_act: "",
					buss_des: "",
					TITLE: "",
					Des: "",
					PREPARER: "",
					ONBEHALFOF: "",
					//REQ0470877:RMANDAL:GWDK901935:10/23/2019:Passing User Id:START
					PREPARERID: "",
					ONBEHALFOFID: "",
					//REQ0470877:RMANDAL:GWDK901935:10/23/2019:Passing User Id:END
					REQ_TITLE: "",
					PHONE_NUM: "",
					LOCATION: "",
					SLOB: "",
					LOB: "",
					SPE_Visible: false,
					ValueState1: "None",
					ValueState2: "None",
					ValueState3: "None",
					ValueState4: "None",
					ValueState5: "None",
					ValueState6: "None",
					ValueState7: "None",
					ValueState8: "None",
					ValueState9: "None",
					ValueState10: "None",
					ValueState11: "None",
					ValueState12: "None",
					ValueState13: "None",
					REQUEST_DATE: "",
					action: "create"

				};

				var aConfirm = this.getOwnerComponent().getOkConfirm();
				if (aConfirm === 0) {
					this.getOwnerComponent().getItemData();
					// this.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField_Exp",true);
					//this.getView().getModel("headerUserModel").setProperty("/Exp",false);
					//this.getView().getModel("headerUserModel").setProperty("/NoExp",true);
					//this.getView().getModel("headerUserModel").setProperty("/Is_Exp","No");
				}

				var repModel = {
						Exp: "Add Expense Information"
					}
					//  this._component.getModel("repTableModel").setData(repModel);

				var isEditedItems = this.getOwnerComponent().getModel("repTableModel").getProperty("/isEditedItems_EXP");
				if (!isEditedItems) {

					var oReciTab = this.byId("tblRecipient");
					var oReciTab1 = this.byId("tblRecipient1");
					if (oReciTab.getItems().length === 0) {
						oReciTab.destroyItems();
						oReciTab1.destroyItems();

					}
					this.getInitialData("create");
					this._component.getModel("headerUserModel").setData(headerData);
					this.handleButtonEnable();
					this.getSummaryTotal();
					//this._component.getModel("itemUserModel").setData(itemData);
					this.getView().getModel("oApproverModel").setData({});
					this.getView().getModel("oCollectionModel").setData({});
					this.getView().getModel("oCommentsModel").setData({});
					//this.loadValuHelpConfig("");

				}
				this.getSummaryTotal();
				if (this.getView().getModel("headerUserModel").getProperty("/PREPARER") === this.getView().getModel("headerUserModel").getProperty(
						"/ONBEHALFOF")) {
					this.getView().byId("idPreparerBox").setVisible(false);
					this.getView().byId("idPreparerBox1").setVisible(false);
				} else {
					this.getView().byId("idPreparerBox").setVisible(true);
					this.getView().byId("idPreparerBox1").setVisible(true);

				}
			}

		},

		handleButtonEnable: function (isGerfTrue) {
			//REQ0470877:NSONI3:GWDK901998:01/28/2020:CHANGE SUBMIT BUTTON VISIBILITY:START
			var sCurrentUser = sap.ushell.Container.getUser().getId();
			var sPreparerId = this._component.getModel("headerUserModel").getProperty("/PREPARERID");
			var sOnBehalfOfId = this._component.getModel("headerUserModel").getProperty("/ONBEHALFOFID");
			var isVisibleSubmitStatus = (sCurrentUser == sPreparerId || sCurrentUser == sOnBehalfOfId) ? true : false;
			//REQ0470877:NSONI3:GWDK901998:01/28/2020:CHANGE SUBMIT BUTTON VISIBILITY:END
			this.status = this.getView().getModel("headerUserModel").getProperty("/STATUS");

			if (this.status === "In Approval") {

				this.getView().getModel("headerUserModel").setProperty("/isEnableSave", true);
				this.getView().getModel("headerUserModel").setProperty("/isEnableSubmit", false);
				this.getView().getModel("headerUserModel").setProperty("/isEnableWithdraw", true);
				this.getView().getModel("headerUserModel").setProperty("/isVisibleSubmit", false);
				this.getView().getModel("headerUserModel").setProperty("/isVisibleWithdraw", true);
				//       this.getView().byId("b_approve").setVisible(true);
				//                   this.getView().byId("b_reject").setVisible(true);
				if (window.top.location.href.toLowerCase().indexOf("fiorilaunchpad") == -1) {
					// this.getView().byId("HOME").setVisible(true);
					this.getView().byId("HOME").setVisible(false);
				}

			} else if (this.status === "Data Saved") {
				this.getView().getModel("headerUserModel").setProperty("/isEnableSave", true);
				this.getView().getModel("headerUserModel").setProperty("/isEnableSubmit", true);
				this.getView().getModel("headerUserModel").setProperty("/isEnableWithdraw", false);
				//REQ0470877:NSONI3:GWDK901998:01/28/2020:CHANGE SUBMIT BUTTON VISIBILITY:START
				// this.getView().getModel("headerUserModel").setProperty("/isVisibleSubmit", true);// add below line and comment this to update submit button visibility by nsoni
				this.getView().getModel("headerUserModel").setProperty("/isVisibleSubmit", isVisibleSubmitStatus);
				//REQ0470877:NSONI3:GWDK901998:01/28/2020:CHANGE SUBMIT BUTTON VISIBILITY:END
				this.getView().getModel("headerUserModel").setProperty("/isVisibleWithdraw", false);
				//  this.getView().byId("b_approve").setVisible(false);
				//  this.getView().byId("b_reject").setVisible(false);
				this.getView().byId("HOME").setVisible(false);

			} else if (this.status === "Withdrawn") {
				this.getView().getModel("headerUserModel").setProperty("/isEnableSave", true);
				this.getView().getModel("headerUserModel").setProperty("/isEnableSubmit", true);
				this.getView().getModel("headerUserModel").setProperty("/isEnableWithdraw", false);
				//REQ0470877:NSONI3:GWDK901998:01/28/2020:CHANGE SUBMIT BUTTON VISIBILITY:START
				// this.getView().getModel("headerUserModel").setProperty("/isVisibleSubmit", true);// add below line and comment this to update submit button visibility by nsoni
				this.getView().getModel("headerUserModel").setProperty("/isVisibleSubmit", isVisibleSubmitStatus);
				//REQ0470877:NSONI3:GWDK901998:01/28/2020:CHANGE SUBMIT BUTTON VISIBILITY:END
				this.getView().getModel("headerUserModel").setProperty("/isVisibleWithdraw", false);
				//   this.getView().byId("b_approve").setVisible(false);
				//   this.getView().byId("b_reject").setVisible(false);
				this.getView().byId("HOME").setVisible(false);
			} else if (this.status === "Approved") {
				this.getView().getModel("headerUserModel").setProperty("/isEnableSave", false);
				this.getView().getModel("headerUserModel").setProperty("/isEnableSubmit", false);
				this.getView().getModel("headerUserModel").setProperty("/isEnableWithdraw", false);
				this.getView().getModel("headerUserModel").setProperty("/isVisibleSubmit", false);
				this.getView().getModel("headerUserModel").setProperty("/isVisibleWithdraw", false);
				//   this.getView().byId("b_approve").setVisible(false);
				//   this.getView().byId("b_reject").setVisible(false);
				if (window.top.location.href.toLowerCase().indexOf("fiorilaunchpad") == -1) {
					// this.getView().byId("HOME").setVisible(true);
					this.getView().byId("HOME").setVisible(false);
				}
			} else if (this.status === "Rejected") {
				this.getView().getModel("headerUserModel").setProperty("/isEnableSave", true);
				this.getView().getModel("headerUserModel").setProperty("/isEnableSubmit", false);
				this.getView().getModel("headerUserModel").setProperty("/isEnableWithdraw", true);
				this.getView().getModel("headerUserModel").setProperty("/isVisibleSubmit", false);
				this.getView().getModel("headerUserModel").setProperty("/isVisibleWithdraw", true);
				//   this.getView().byId("b_approve").setVisible(true);
				//   this.getView().byId("b_reject").setVisible(false);
				if (window.top.location.href.toLowerCase().indexOf("fiorilaunchpad") == -1) {
					// this.getView().byId("HOME").setVisible(true);
					this.getView().byId("HOME").setVisible(false);
				}
			} else if (!this.status) {
				this.getView().getModel("headerUserModel").setProperty("/isEnableSave", true);
				this.getView().getModel("headerUserModel").setProperty("/isEnableSubmit", true);
				this.getView().getModel("headerUserModel").setProperty("/isEnableWithdraw", false);
				//REQ0470877:NSONI3:GWDK901998:01/28/2020:CHANGE SUBMIT BUTTON VISIBILITY:START
				// this.getView().getModel("headerUserModel").setProperty("/isVisibleSubmit", true);// add below line and comment this to update submit button visibility by nsoni
				this.getView().getModel("headerUserModel").setProperty("/isVisibleSubmit", isVisibleSubmitStatus);
				//REQ0470877:NSONI3:GWDK901998:01/28/2020:CHANGE SUBMIT BUTTON VISIBILITY:END
				this.getView().getModel("headerUserModel").setProperty("/isVisibleWithdraw", false);
				//   this.getView().byId("b_approve").setVisible(false);
				//   this.getView().byId("b_reject").setVisible(false);
				this.getView().byId("HOME").setVisible(false);

			}
		},

		getFormData: function (sFormNum, action) {
			eform_num = sFormNum;
			var that = this;
			var oFormNumFilter = new Filter("EFORM_NUM", FilterOperator.EQ, sFormNum);
			var aFilter = [];
			aFilter.push(oFormNumFilter);

			var that = this;

			this._serverModel.read("/eGovermentHeaders", {
				filters: aFilter,
				urlParameters: {
					$expand: 'eGovernmentItemSet'
				},
				success: function (data) {
					var oData = data.results;

					that.arr1 = oData;

					if (action !== "copy") {

						var headerData = {
							FORM_NUM: that.title,
							LOB: oData[0].LOB,
							isEnable_Edit: true,
							isEnable_Delete: true,
							Des: oData[0].DESCRIPTION,
							TITLE: oData[0].TITLE,
							REQUEST_DATE: oData[0].REQUEST_DATE,
							REQ_TITLE: oData[0].REQ_TITLE,
							LOCATION: oData[0].LOCATION,
							SLOB: oData[0].SUB_LOB,
							REC_COUNTRY: oData[0].COUNTRY_ACTIVITY,
							RES_COUNTRY: oData[0].COUNTRY,
							ACTIVITY: oData[0].ACTIVITY,
							ONBEHALFOF: oData[0].ON_BEHALF_OF,
							PREPARER: oData[0].PREPARER,
							//REQ0470877:RMANDAL:GWDK901935:10/23/2019:Fetching User Id:START
							ONBEHALFOFID: oData[0].ON_BEHALF_OF_ID,
							PREPARERID: oData[0].PREPARER_ID,
							//REQ0470877:RMANDAL:GWDK901935:10/23/2019:Fetching User Id:END
							REQ_EMAIL: oData[0].EMAIL,
							PHONE_NUM: oData[0].PHONE_NUM,
							VALUE1: oData[0].RADOIVALUE1,
							VALUE2: oData[0].IS_AMOUNT,
							VALUE3: oData[0].IS_PAYMENT_1,
							VALUE4: oData[0].IS_PAYMENT_2,
							VALUE5: oData[0].IS_ACTION,
							VALUE6: oData[0].IS_CONFIRMED,
							VALUE7: oData[0].IS_VERIFIED,
							Activity: oData[0].ACTIVITY,
							Loc_act: oData[0].LOC_ACTIVITY,
							buss_des: oData[0].BUSS_DES,
							SPE_Reason: oData[0].ARE_ANY_REC,
							SPE_List: oData[0].LIST_EMP,
							Is_Exp: oData[0].IS_EMERGENCY,

							SummaryTotals_Value1: "$" + that.handleAmoutFormatterByTotal(oData[0].AMOUNT_EXPTYP1) + " USD",
							SummaryTotals_Value2: "$" + that.handleAmoutFormatterByTotal(oData[0].AMOUNT_EXPTYP2) + " USD",
							SummaryTotals_Value3: "$" + that.handleAmoutFormatterByTotal(oData[0].AMOUNT_EXPTYP3) + " USD",
							SummaryTotals_Value4: "$" + that.handleAmoutFormatterByTotal(oData[0].AMOUNT_EXPTYP4) + " USD",
							SummaryTotals_Value5: "$" + that.handleAmoutFormatterByTotal(oData[0].AMOUNT_EXPTYP5) + " USD",
							SummaryTotals_Value6: "$" + that.handleAmoutFormatterByTotal(oData[0].AMOUNT_EXPTYP6) + " USD",
							SummaryTotals_Value7: "$" + that.handleAmoutFormatterByTotal(oData[0].AMOUNT) + " USD",

							STATUS: oData[0].STATUS,
							isEnable: false,

						};
						that.getView().byId("idPreparerBox").setVisible(true);
						that.getView().byId("idPreparerBox1").setVisible(true);
						that._component.getModel("headerUserModel").setData(headerData);
						if (that.getView().getModel("headerUserModel").getProperty("/PREPARER") === that.getView().getModel("headerUserModel").getProperty(
								"/ONBEHALFOF")) {
							that.getView().byId("idPreparerBox1").setVisible(false);
							that.getView().byId("idPreparerBox").setVisible(false);
						} else {
							that.getView().byId("idPreparerBox").setVisible(true);
							that.getView().byId("idPreparerBox1").setVisible(true);
						}
						that.handleButtonEnable();
						that.getInitialData("display");

						if (oData[0].STATUS == "Data Saved" || oData[0].STATUS == "Rejected" || oData[0].STATUS == "Withdrawn") {
							that.getView().getModel("headerUserModel").setProperty("/COMMENTS_ENABLED", true);
						} else {
							that.getView().getModel("headerUserModel").setProperty("/COMMENTS_ENABLED", false);
						}

						if (oData[0].RADOIVALUE1 === "No") {
							that.getView().getModel("headerUserModel").setProperty("/selectedIndex1", 1);
						} else if (oData[0].RADOIVALUE1 === "Yes") {
							that.getView().getModel("headerUserModel").setProperty("/selectedIndex1", 0);
						} else {
							that.getView().getModel("headerUserModel").setProperty("/selectedIndex1", -1);
						}
						if (oData[0].IS_AMOUNT === "No") {
							that.getView().getModel("headerUserModel").setProperty("/selectedIndex2", 1);
						} else if (oData[0].IS_AMOUNT === "Yes") {
							that.getView().getModel("headerUserModel").setProperty("/selectedIndex2", 0);
						} else {
							that.getView().getModel("headerUserModel").setProperty("/selectedIndex2", -1);
						}
						if (oData[0].IS_PAYMENT_1 === "No") {
							that.getView().getModel("headerUserModel").setProperty("/selectedIndex3", 1);
						} else if (oData[0].IS_PAYMENT_1 === "Yes") {
							that.getView().getModel("headerUserModel").setProperty("/selectedIndex3", 0);
						} else {
							that.getView().getModel("headerUserModel").setProperty("/selectedIndex3", -1);
						}

						if (oData[0].IS_PAYMENT_2 === "No") {
							that.getView().getModel("headerUserModel").setProperty("/selectedIndex4", 1);
						} else if (oData[0].IS_PAYMENT_2 === "Yes") {
							that.getView().getModel("headerUserModel").setProperty("/selectedIndex4", 0);
						} else {
							that.getView().getModel("headerUserModel").setProperty("/selectedIndex4", -1);
						}
						if (oData[0].IS_ACTION === "No") {
							that.getView().getModel("headerUserModel").setProperty("/selectedIndex5", 1);
						} else if (oData[0].IS_ACTION === "Yes") {
							that.getView().getModel("headerUserModel").setProperty("/selectedIndex5", 0);
						} else {
							that.getView().getModel("headerUserModel").setProperty("/selectedIndex5", -1);
						}

						if (oData[0].IS_CONFIRMED === "No") {
							that.getView().getModel("headerUserModel").setProperty("/selectedIndex6", 1);
						} else if (oData[0].IS_CONFIRMED === "Yes") {
							that.getView().getModel("headerUserModel").setProperty("/selectedIndex6", 0);
						} else {
							that.getView().getModel("headerUserModel").setProperty("/selectedIndex6", -1);
						}
						if (oData[0].IS_VERIFIED === "No") {
							that.getView().getModel("headerUserModel").setProperty("/selectedIndex7", 1);
						} else if (oData[0].IS_VERIFIED === "Yes") {
							that.getView().getModel("headerUserModel").setProperty("/selectedIndex7", 0);
						} else {
							that.getView().getModel("headerUserModel").setProperty("/selectedIndex7", -1);
						}
						if (oData[0].ARE_ANY_REC === "No") {
							that.getView().getModel("headerUserModel").setProperty("/selectedIndex_SPE", 1);

							that.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField_Exp", true);
							that.getView().getModel("headerUserModel").setProperty("/SPE_Visible", false);

							that.getView().getModel("headerUserModel").setProperty("/Is_SPE", "No");

						} else if (oData[0].ARE_ANY_REC === "Yes") {
							that.getView().getModel("headerUserModel").setProperty("/selectedIndex_SPE", 0);
							that.getView().getModel("headerUserModel").setProperty("/SPE_Visible", true);

							that.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField_SPE", false);
							that.getView().getModel("headerUserModel").setProperty("/Is_SPE", "Yes");
						}
						if (oData[0].IS_EMERGENCY === "No") {
							that.getView().getModel("headerUserModel").setProperty("/selectedIndex_Exp", 1);
							that.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField_Exp", true);
							that.getView().getModel("headerUserModel").setProperty("/Exp", false);
							that.getView().getModel("headerUserModel").setProperty("/NoExp", true);
							that.getView().getModel("headerUserModel").setProperty("/Is_Exp", "No");

						} else if (oData[0].IS_EMERGENCY === "Yes") {
							that.getView().getModel("headerUserModel").setProperty("/selectedIndex_Exp", 0);
							that.getView().getModel("headerUserModel").setProperty("/Exp", true);
							that.getView().getModel("headerUserModel").setProperty("/NoExp", false);
							that.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField_Exp", false);
							that.getView().getModel("headerUserModel").setProperty("/Is_Exp", "Yes");
						} else {
							that.getView().getModel("headerUserModel").setProperty("/selectedIndex_Exp", -1);
							that.getView().getModel("headerUserModel").setProperty("/Exp", false);
							that.getView().getModel("headerUserModel").setProperty("/NoExp", true);
							that.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField_Exp", false);
							that.getView().getModel("headerUserModel").setProperty("/Is_Exp", "");
						}
						var arr = oData[0].eGovernmentItemSet;
						var arr1 = [];
						value = arr.results;
						if (arr.results.length > 0) {
							for (var i = 0; i < arr.results.length; i++) {
								var obj = {
									"Recipient": {},
									"Organisation": {},
									"Expense": {}
								};
								obj.Recipient.RECIPIENT_FIRST_NAME = value[i].RECIPIENT_FIRST_NAME;
								obj.Recipient.RECIPIENT_LAST_NAME = value[i].RECIPIENT_LAST_NAME;
								obj.Recipient.RECIPIENT_TITLE = value[i].RECIPIENT_TITLE;
								obj.Recipient.RECIPIENT_ADD = value[i].RECIPIENT_ADDRESS;
								obj.Recipient.RECIPIENT_CITY = value[i].REC_CITY;
								obj.Recipient.RECIPIENT_STATE = value[i].REC_STATE;
								obj.Recipient.RECIPIENT_PC = value[i].REC_POSTAL_CODE;
								obj.Recipient.RECIPIENT_COUNTRY = value[i].REC_COUNTRY;
								obj.Recipient.RECI_BUSSI = value[i].RECI_BUSSI;
								obj.Recipient.IS_REL_IND = value[i].IS_REL_IND

								obj.Recipient.RECIPIENT_OTHER_RELATION = value[i].REC_OTHER_REL
								obj.Recipient.Res_sel1 = value[i].RECI_REL
								obj.Recipient.Res_sel2 = value[i].IS_REL_GOV
								obj.Recipient.Res_sel3 = value[i].RECI_IS_PENDING

								obj.Recipient.form_Justification2 = value[i].RECI_EXPLANATION
								obj.Recipient.form_Justification1 = value[i].RECI_DESCRIBE_REL
								obj.Recipient.form_Justification3 = value[i].RECI_EXPL_PENDING

								obj.Organisation.RECIPIENT_ORG = value[i].RECIPIENT_ORG;
								obj.Organisation.ORG_BUSSI = value[i].ORG_BUSSI
								obj.Organisation.ORG_TYPE = value[i].ORG_TYPE;
								obj.Organisation.ORG_ADDRESS = value[i].ORG_ADDRESS;
								obj.Organisation.CITY = value[i].CITY;
								obj.Organisation.ORG_COUNTRY = value[i].ORG_COUNTRY;
								obj.Organisation.ORG_STATE = value[i].ORG_STATE;
								obj.Organisation.ORG_POSTAL_CODE = value[i].ORG_POSTAL_CODE;
								obj.Expense.EXP_TYPE = value[i].EXP_TYPE;
								obj.Expense.EXP_SUBCAT = value[i].EXP_SUBTYPE;
								obj.Expense.EXP_DES = value[i].EXP_DES;
								obj.Expense.PAYMENT_METHOD = value[i].PAYMENT_METHOD;
								obj.Expense.DATE_OF_EXP = value[i].DATE_OF_EXP;
								obj.Expense.REQ_AMT_EXP = value[i].REQ_AMT_EXP;
								obj.Expense.LOCALCURRENCY = value[i].LOCALCURRENCY;
								obj.Expense.GEN_LEDGER_AREA = value[i].GEN_LEDGER_AREA;
								obj.Expense.GEN_LEDGER = value[i].GEN_LEDGER;
								obj.Expense.COMPANY_CODE = value[i].COMPANY_CODE;
								obj.Expense.IS_TRAVEL = value[i].IS_HOL;
								obj.Expense.IS_Expense = value[i].IS_EXPENSE;
								obj.Expense.TRAVEL_EXPENSE = value[i].TRAVEL_EXPENSE;
								obj.Expense.OTHERTRAVEL_EXP = value[i].OTHERTRAVEL_EXP;
								obj.Expense.TravelOrgin_EXP = value[i].TRAVELORGIN_EXP;
								obj.Expense.TravelDest_EXP = value[i].TRAVELDEST_EXP;
								obj.Expense.HotelName_EXP = value[i].HOTELNAME_EXP;
								obj.Expense.HotelCity_EXP = value[i].HOTELCITY_EXP;
								obj.Expense.REQ_AMT_EXP_USD = value[i].REQ_AMT_EXP_USD;
								var temp = value[i].REQ_AMT_EXP_USD;

								if (value[i].EXP_TYPE === "Promotional & Marketing Expense") {
									obj.Expense.Amount1 = temp

								} else {
									obj.Expense.Amount1 = 0

								}
								if (value[i].EXP_TYPE === "Entertainment") {
									obj.Expense.Amount2 = temp

								} else {
									obj.Expense.Amount2 = 0
								}
								if (value[i].EXP_TYPE === "Company Logo Gifts") {
									obj.Expense.Amount3 = temp

								} else {
									obj.Expense.Amount3 = 0
								}
								if (value[i].EXP_TYPE === "Non Company Logo Gifts") {
									obj.Expense.Amount4 = temp

								} else {
									obj.Expense.Amount4 = 0
								}
								if (value[i].EXP_TYPE === "Payment authorized by written local law") {
									obj.Expense.Amount5 = temp

								} else {
									obj.Expense.Amount5 = 0
								}
								if (value[i].EXP_TYPE === "Emergency facilitating payment") {
									obj.Expense.Amount6 = temp

								} else {
									obj.Expense.Amount6 = 0;
								}

								if (!value[i].EXP_TYPE) {
									obj.Expense.title = "Add Expense Information";
								} else {
									obj.Expense.title = value[i].EXP_TYPE + " - " + that.handleAmoutFormatterByTotal(value[i].REQ_AMT_EXP_USD) + " USD";
								}
								if (!value[i].RECIPIENT_ORG) {
									obj.Organisation.title = "Add Organization Information";
								} else {
									obj.Organisation.title = value[i].RECIPIENT_ORG;
								}
								if (!value[i].RECIPIENT_FIRST_NAME) {
									obj.Recipient.title = "Add Recipient Information";
								} else {
									obj.Recipient.title = value[i].RECIPIENT_LAST_NAME + "," + value[i].RECIPIENT_FIRST_NAME;
								}

								arr1.push(obj);
							}
							that.getView().getModel("repTableModel").setData(arr1);
						}
						if (arr.results.length === 0) {
							var oReciTab = that.byId("tblRecipient");
							var oReciTab1 = that.byId("tblRecipient1");

							oReciTab.destroyItems();
							oReciTab1.destroyItems();
						}

						//that.getSummaryTotal();
						that.getApprovers(that.title);
						//that._component.getModel("oApproverModel").setData(oData[0].reconapproves);
						//that.Controller.handleButtonEnable();
						that.getComments(that.title);
						that.getCollection(that.title);
					} else {

						if (that.getOwnerComponent().getModel("headerUserModel").getProperty("/FORM_NUM")) {
							// that.title=that.getOwnerComponent().getModel("headerUserModel").getProperty("/FORM_NUM");
							that.title = "";
							var oBundle = that._component.getModel("i18n").getResourceBundle();
							var sText = oBundle.getText("Title", [that.title]);
							that.getView().byId("pageTitleId").setText(sText);
						} else {

							var oBundle = that._component.getModel("i18n").getResourceBundle();
							var sText = oBundle.getText("Title", [""]);
							that.getView().byId("pageTitleId").setText(sText);
						}

						var headerData = {

							FORM_NUM: that.title1,
							LOB: oData[0].LOB,
							isEnable_Edit: false,
							isEnable_Delete: false,
							Des: oData[0].DESCRIPTION,
							TITLE: oData[0].TITLE,
							REQUEST_DATE: oData[0].REQUEST_DATE,
							REQ_TITLE: oData[0].REQ_TITLE,
							LOCATION: oData[0].LOCATION,
							SLOB: oData[0].SUB_LOB,
							RES_COUNTRY: oData[0].COUNTRY,
							REC_COUNTRY: oData[0].COUNTRY_ACTIVITY,
							ACTIVITY: oData[0].ACTIVITY,
							ONBEHALFOF: oData[0].ON_BEHALF_OF,
							PREPARER: oData[0].PREPARER,
							//REQ0470877:RMANDAL:GWDK901935:10/23/2019:Fetching User Id:START
							ONBEHALFOFID: oData[0].ON_BEHALF_OF_ID,
							PREPARERID: oData[0].PREPARER_ID,
							//REQ0470877:RMANDAL:GWDK901935:10/23/2019:Fetching User Id:END
							REQ_EMAIL: oData[0].EMAIL,
							PHONE_NUM: oData[0].PHONE_NUM,
							VALUE1: oData[0].RADOIVALUE1,
							VALUE2: oData[0].IS_AMOUNT,
							VALUE3: oData[0].IS_PAYMENT_1,
							VALUE4: oData[0].IS_PAYMENT_2,
							VALUE5: oData[0].IS_ACTION,
							VALUE6: oData[0].IS_CONFIRMED,
							VALUE7: oData[0].IS_VERIFIED,
							Activity: oData[0].ACTIVITY,
							Loc_act: oData[0].LOC_ACTIVITY,
							buss_des: oData[0].BUSS_DES,
							SPE_Reason: oData[0].ARE_ANY_REC,
							SPE_List: oData[0].LIST_EMP,
							Is_Exp: oData[0].IS_EMERGENCY,
							SummaryTotals_Value1: "$" + that.handleAmoutFormatterByTotal(oData[0].AMOUNT_EXPTYP1) + " USD",
							SummaryTotals_Value2: "$" + that.handleAmoutFormatterByTotal(oData[0].AMOUNT_EXPTYP2) + " USD",
							SummaryTotals_Value3: "$" + that.handleAmoutFormatterByTotal(oData[0].AMOUNT_EXPTYP3) + " USD",
							SummaryTotals_Value4: "$" + that.handleAmoutFormatterByTotal(oData[0].AMOUNT_EXPTYP4) + " USD",
							SummaryTotals_Value5: "$" + that.handleAmoutFormatterByTotal(oData[0].AMOUNT_EXPTYP5) + " USD",
							SummaryTotals_Value6: "$" + that.handleAmoutFormatterByTotal(oData[0].AMOUNT_EXPTYP6) + " USD",
							SummaryTotals_Value7: "$" + that.handleAmoutFormatterByTotal(oData[0].AMOUNT) + " USD",
							action: "copy",
							STATUS: "",
							isEnable: true,

						};

						that._component.getModel("headerUserModel").setData(headerData);
						that._component.getModel("headerUserModel").setProperty("/isEnable", true);
						that._component.getModel("headerUserModel").setProperty("/isEnable_Edit", false);
						that._component.getModel("headerUserModel").setProperty("/isEnable_Delete", false);
						that._component.getModel("headerUserModel").setProperty("/action", "copy");

						that.getInitialData("create");

						if (oData[0].RADOIVALUE1 === "No") {
							that.getView().getModel("headerUserModel").setProperty("/selectedIndex1", 1);
						} else if (oData[0].RADOIVALUE1 === "Yes") {
							that.getView().getModel("headerUserModel").setProperty("/selectedIndex1", 0);
						} else {
							that.getView().getModel("headerUserModel").setProperty("/selectedIndex1", -1);
						}
						if (oData[0].IS_AMOUNT === "No") {
							that.getView().getModel("headerUserModel").setProperty("/selectedIndex2", 1);
						} else if (oData[0].IS_AMOUNT === "Yes") {
							that.getView().getModel("headerUserModel").setProperty("/selectedIndex2", 0);
						} else {
							that.getView().getModel("headerUserModel").setProperty("/selectedIndex2", -1);
						}
						if (oData[0].IS_PAYMENT_1 === "No") {
							that.getView().getModel("headerUserModel").setProperty("/selectedIndex3", 1);
						} else if (oData[0].IS_PAYMENT_1 === "Yes") {
							that.getView().getModel("headerUserModel").setProperty("/selectedIndex3", 0);
						} else {
							that.getView().getModel("headerUserModel").setProperty("/selectedIndex3", -1);
						}

						if (oData[0].IS_PAYMENT_2 === "No") {
							that.getView().getModel("headerUserModel").setProperty("/selectedIndex4", 1);
						} else if (oData[0].IS_PAYMENT_2 === "Yes") {
							that.getView().getModel("headerUserModel").setProperty("/selectedIndex4", 0);
						} else {
							that.getView().getModel("headerUserModel").setProperty("/selectedIndex4", -1);
						}
						if (oData[0].IS_ACTION === "No") {
							that.getView().getModel("headerUserModel").setProperty("/selectedIndex5", 1);
						} else if (oData[0].IS_ACTION === "Yes") {
							that.getView().getModel("headerUserModel").setProperty("/selectedIndex5", 0);
						} else {
							that.getView().getModel("headerUserModel").setProperty("/selectedIndex5", -1);
						}

						if (oData[0].IS_CONFIRMED === "No") {
							that.getView().getModel("headerUserModel").setProperty("/selectedIndex6", 1);
						} else if (oData[0].IS_CONFIRMED === "Yes") {
							that.getView().getModel("headerUserModel").setProperty("/selectedIndex6", 0);
						} else {
							that.getView().getModel("headerUserModel").setProperty("/selectedIndex6", -1);
						}
						if (oData[0].IS_VERIFIED === "No") {
							that.getView().getModel("headerUserModel").setProperty("/selectedIndex7", 1);
						} else if (oData[0].IS_VERIFIED === "Yes") {
							that.getView().getModel("headerUserModel").setProperty("/selectedIndex7", 0);
						} else {
							that.getView().getModel("headerUserModel").setProperty("/selectedIndex7", -1);
						}
						if (oData[0].ARE_ANY_REC === "No") {
							that.getView().getModel("headerUserModel").setProperty("/selectedIndex_SPE", 1);

							that.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField_Exp", true);
							that.getView().getModel("headerUserModel").setProperty("/SPE_Visible", false);

							that.getView().getModel("headerUserModel").setProperty("/Is_SPE", "No");

						} else if (oData[0].ARE_ANY_REC === "Yes") {
							that.getView().getModel("headerUserModel").setProperty("/selectedIndex_SPE", 0);
							that.getView().getModel("headerUserModel").setProperty("/SPE_Visible", true);

							that.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField_SPE", false);
							that.getView().getModel("headerUserModel").setProperty("/Is_SPE", "Yes");
						}
						if (oData[0].IS_EMERGENCY === "No") {
							that.getView().getModel("headerUserModel").setProperty("/selectedIndex_Exp", 1);
							that.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField_Exp", true);
							that.getView().getModel("headerUserModel").setProperty("/Exp", false);
							that.getView().getModel("headerUserModel").setProperty("/NoExp", true);
							that.getView().getModel("headerUserModel").setProperty("/Is_Exp", "No");

						} else if (oData[0].IS_EMERGENCY === "Yes") {
							that.getView().getModel("headerUserModel").setProperty("/selectedIndex_Exp", 0);
							that.getView().getModel("headerUserModel").setProperty("/Exp", true);
							that.getView().getModel("headerUserModel").setProperty("/NoExp", false);
							that.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField_Exp", false);
							that.getView().getModel("headerUserModel").setProperty("/Is_Exp", "Yes");
						} else {
							that.getView().getModel("headerUserModel").setProperty("/selectedIndex_Exp", -1);
							that.getView().getModel("headerUserModel").setProperty("/Exp", false);
							that.getView().getModel("headerUserModel").setProperty("/NoExp", true);
							that.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField_Exp", false);
							that.getView().getModel("headerUserModel").setProperty("/Is_Exp", "");
						}
						var arr = oData[0].eGovernmentItemSet;
						var arr1 = [];
						value = arr.results;
						if (arr.results.length > 0) {
							for (var i = 0; i < arr.results.length; i++) {
								var obj = {
									"Recipient": {},
									"Organisation": {},
									"Expense": {}
								};
								obj.Recipient.RECIPIENT_FIRST_NAME = value[i].RECIPIENT_FIRST_NAME;
								obj.Recipient.RECIPIENT_LAST_NAME = value[i].RECIPIENT_LAST_NAME;
								obj.Recipient.RECIPIENT_TITLE = value[i].RECIPIENT_TITLE;
								obj.Recipient.RECIPIENT_ADD = value[i].RECIPIENT_ADDRESS;
								obj.Recipient.RECIPIENT_CITY = value[i].REC_CITY;
								obj.Recipient.RECIPIENT_STATE = value[i].REC_STATE;
								obj.Recipient.RECIPIENT_PC = value[i].REC_POSTAL_CODE;
								obj.Recipient.RECIPIENT_COUNTRY = value[i].REC_COUNTRY;
								obj.Recipient.RECI_BUSSI = value[i].RECI_BUSSI;
								obj.Recipient.IS_REL_IND = value[i].IS_REL_IND

								obj.Recipient.RECIPIENT_OTHER_RELATION = value[i].REC_OTHER_REL
								obj.Recipient.Res_sel1 = value[i].RECI_REL
								obj.Recipient.Res_sel2 = value[i].IS_REL_GOV
								obj.Recipient.Res_sel3 = value[i].RECI_IS_PENDING

								obj.Recipient.form_Justification2 = value[i].RECI_EXPLANATION
								obj.Recipient.form_Justification1 = value[i].RECI_DESCRIBE_REL
								obj.Recipient.form_Justification3 = value[i].RECI_EXPL_PENDING

								obj.Organisation.RECIPIENT_ORG = value[i].RECIPIENT_ORG;
								obj.Organisation.ORG_BUSSI = value[i].ORG_BUSSI
								obj.Organisation.ORG_TYPE = value[i].ORG_TYPE;
								obj.Organisation.ORG_ADDRESS = value[i].ORG_ADDRESS;
								obj.Organisation.CITY = value[i].CITY;
								obj.Organisation.ORG_COUNTRY = value[i].ORG_COUNTRY;
								obj.Organisation.ORG_STATE = value[i].ORG_STATE;
								obj.Organisation.ORG_POSTAL_CODE = value[i].ORG_POSTAL_CODE;
								obj.Expense.EXP_TYPE = value[i].EXP_TYPE;
								obj.Expense.EXP_SUBCAT = value[i].EXP_SUBTYPE;
								obj.Expense.EXP_DES = value[i].EXP_DES;
								obj.Expense.PAYMENT_METHOD = value[i].PAYMENT_METHOD;
								obj.Expense.DATE_OF_EXP = value[i].DATE_OF_EXP;
								obj.Expense.REQ_AMT_EXP = value[i].REQ_AMT_EXP;
								obj.Expense.LOCALCURRENCY = value[i].LOCALCURRENCY;
								obj.Expense.GEN_LEDGER_AREA = value[i].GEN_LEDGER_AREA;
								obj.Expense.GEN_LEDGER = value[i].GEN_LEDGER;
								obj.Expense.COMPANY_CODE = value[i].COMPANY_CODE;
								obj.Expense.IS_TRAVEL = value[i].IS_HOL;
								obj.Expense.IS_Expense = value[i].IS_EXPENSE;
								obj.Expense.TRAVEL_EXPENSE = value[i].TRAVEL_EXPENSE;
								obj.Expense.OTHERTRAVEL_EXP = value[i].OTHERTRAVEL_EXP;
								obj.Expense.TravelOrgin_EXP = value[i].TRAVELORGIN_EXP;
								obj.Expense.TravelDest_EXP = value[i].TRAVELDEST_EXP;
								obj.Expense.HotelName_EXP = value[i].HOTELNAME_EXP;
								obj.Expense.HotelCity_EXP = value[i].HOTELCITY_EXP;

								obj.Expense.REQ_AMT_EXP_USD = value[i].REQ_AMT_EXP_USD;
								var temp = value[i].REQ_AMT_EXP_USD;

								if (value[i].EXP_TYPE === "Promotional & Marketing Expense") {
									obj.Expense.Amount1 = temp

								} else {
									obj.Expense.Amount1 = 0

								}
								if (value[i].EXP_TYPE === "Entertainment") {
									obj.Expense.Amount2 = temp

								} else {
									obj.Expense.Amount2 = 0
								}
								if (value[i].EXP_TYPE === "Company Logo Gifts") {
									obj.Expense.Amount3 = temp

								} else {
									obj.Expense.Amount3 = 0
								}
								if (value[i].EXP_TYPE === "Non Company Logo Gifts") {
									obj.Expense.Amount4 = temp

								} else {
									obj.Expense.Amount4 = 0
								}
								if (value[i].EXP_TYPE === "Payment authorized by written local law") {
									obj.Expense.Amount5 = temp

								} else {
									obj.Expense.Amount5 = 0
								}
								if (value[i].EXP_TYPE === "Emergency facilitating payment") {
									obj.Expense.Amount6 = temp

								} else {
									obj.Expense.Amount6 = 0;
								}

								if (!value[i].EXP_TYPE) {
									obj.Expense.title = "Add Expense Information";
								} else {
									obj.Expense.title = value[i].EXP_TYPE + " - " + that.handleAmoutFormatterByTotal(value[i].REQ_AMT_EXP_USD) + " USD";
								}
								if (!value[i].RECIPIENT_ORG) {
									obj.Organisation.title = "Add Organization Information";
								} else {
									obj.Organisation.title = value[i].RECIPIENT_ORG;
								}
								if (!value[i].RECIPIENT_FIRST_NAME) {
									obj.Recipient.title = "Add Recipient Information";
								} else {
									obj.Recipient.title = value[i].RECIPIENT_LAST_NAME + "," + value[i].RECIPIENT_FIRST_NAME;
								}

								arr1.push(obj);
							}
							that.getView().getModel("repTableModel").setData(arr1);
						}

						//that._component.getModel("headerUserModel").setData(headerData);
						if (that.getView().getModel("headerUserModel").getProperty("/PREPARER") === that.getView().getModel("headerUserModel").getProperty(
								"/ONBEHALFOF")) {
							that.getView().byId("idPreparerBox1").setVisible(false);
							that.getView().byId("idPreparerBox").setVisible(false);
						} else {
							that.getView().byId("idPreparerBox").setVisible(true);
							that.getView().byId("idPreparerBox1").setVisible(true);
						}
						that.handleButtonEnable();
						that._component.getModel("oCollectionModel").setData({});
						that._component.getModel("oCommentsModel").setData({});
						//that.getSummaryTotal();
						that._component.getModel("oApproverModel").setData({});

						if (arr.results.length === 0) {
							var oReciTab = that.byId("tblRecipient");
							var oReciTab1 = that.byId("tblRecipient1");

							oReciTab.destroyItems();
							oReciTab1.destroyItems();
						}

					}

				},
				error: function (error) {

				}

			});

		},

		onPressSave: function (oEvent) {
			var isSave = "true";
			var speEmployeeRdbtn = this.byId('Are_Any_Id');
			var emergencyRdbtn = this.byId('Is_Emg_ID');
			var activity = this._component.getModel("headerUserModel").getProperty("/Activity");
			var location = this._component.getModel("headerUserModel").getProperty("/Loc_act");
			var describe = this._component.getModel("headerUserModel").getProperty("/buss_des");
			var spe_List = this._component.getModel("headerUserModel").getProperty("/SPE_List");
			var country = this._component.getModel("headerUserModel").getProperty("/RES_COUNTRY");
			var country_Rec = this._component.getModel("headerUserModel").getProperty("/REC_COUNTRY");

			var formTitle = this._component.getModel("headerUserModel").getProperty("/TITLE");
			var formDes = this._component.getModel("headerUserModel").getProperty("/Des");
			var preparer = this._component.getModel("headerUserModel").getProperty("/PREPARER");
			var formOnBehalfOf = this._component.getModel("headerUserModel").getProperty("/ONBEHALFOF");
			var formReqTitle = this._component.getModel("headerUserModel").getProperty("/REQ_TITLE");
			var formReqEmail = this._component.getModel("headerUserModel").getProperty("/REQ_EMAIL");
			var formPhNum = this._component.getModel("headerUserModel").getProperty("/PHONE_NUM");
			var formLocation = this._component.getModel("headerUserModel").getProperty("/LOCATION");
			var formOfc_Div = this._component.getModel("headerUserModel").getProperty("/OFC_DIV");
			var formAmt_SLob = this._component.getModel("headerUserModel").getProperty("/SLOB");
			var formAmt_LOB = this._component.getModel("headerUserModel").getProperty("/LOB");

			var aItems = this.getOwnerComponent().getModel("repTableModel").getData();
			var mandCount = 0;
			var mandCount1 = 0;
			this.mandCount2 = 0;
			if (!aItems.length) {
				var mandCount1 = 1;
			}
			if (aItems.length) {

				if ((this.getView().getModel("headerUserModel").getProperty("/selectedIndex_Exp") === 0) && (aItems.length > 1)) {
					if (this._component.getModel("headerUserModel").getProperty("/STATUS") === "In Approval") {
						this.mandCount2 = 1;

					}
					MessageBox.error(
						"Only one recipient may be listed per form upon the selection of the Emergency Facilitating Payment Type. Please complete a seperate form for each Recipient receiving an Emergency Facilitating Payment and allocate the amount" +
						" accordingly if the payment was made to multiple Recipients.");
				}
			}

			for (var i = 0; i < aItems.length; i++) {
				if (aItems[i].Expense.EXP_TYPE && aItems[i].Recipient.RECIPIENT_FIRST_NAME && aItems[i].Organisation.RECIPIENT_ORG) {
					mandCount = 0;
				} else {

					mandCount = mandCount + 1;
				}
			}
			if (mandCount > 0) {
				MessageBox.error("Please enter all the mandatory table list items");
			}

			if (mandCount1 > 0) {
				MessageBox.error("Please enter atleast one table list item");
			}
			var count = 0;
			if (speEmployeeRdbtn.getSelectedIndex() === -1) {
				count = count + 1;
				speEmployeeRdbtn.setValueState("Error");
			} else {
				if (speEmployeeRdbtn.getSelectedIndex() == 0) {
					if (this.byId('SPE_List').getValue() == "") {
						count = count + 1;
						this.byId('SPE_List').setValueState("Error");
					} else {
						this.byId('SPE_List').setValueState("None");
					}

				} else {
					this.byId('SPE_List').setValueState("None");
					speEmployeeRdbtn.setValueState("None");
				}

			}

			if (emergencyRdbtn.getSelectedIndex() === -1) {
				count = count + 1;
				emergencyRdbtn.setValueState("Error");
			} else {
				emergencyRdbtn.setValueState("None");
			}

			if (this._component.getModel("headerUserModel").getProperty("/Exp") === true) {
				if (this._component.getModel("headerUserModel").getProperty("/selectedIndex2") === -1) {
					count = count + 1;
					this._component.getModel("headerUserModel").setProperty("/ValueState_emg1", "Error");
				} else {
					this._component.getModel("headerUserModel").setProperty("/ValueState_emg1", "None");
				}
				if (this._component.getModel("headerUserModel").getProperty("/selectedIndex3") === -1) {
					count = count + 1;
					this._component.getModel("headerUserModel").setProperty("/ValueState_emg2", "Error");
				} else {
					this._component.getModel("headerUserModel").setProperty("/ValueState_emg2", "None");
				}
				if (this._component.getModel("headerUserModel").getProperty("/selectedIndex4") === -1) {
					count = count + 1;
					this._component.getModel("headerUserModel").setProperty("/ValueState_emg3", "Error");
				} else {
					this._component.getModel("headerUserModel").setProperty("/ValueState_emg3", "None");
				}

				if (this._component.getModel("headerUserModel").getProperty("/selectedIndex5") === -1) {
					count = count + 1;
					this._component.getModel("headerUserModel").setProperty("/ValueState_emg4", "Error");
				} else {
					this._component.getModel("headerUserModel").setProperty("/ValueState_emg4", "None");
				}

				if (this._component.getModel("headerUserModel").getProperty("/selectedIndex6") === -1) {
					count = count + 1;
					this._component.getModel("headerUserModel").setProperty("/ValueState_emg5", "Error");
				} else {
					this._component.getModel("headerUserModel").setProperty("/ValueState_emg5", "None");
				}
				if (this._component.getModel("headerUserModel").getProperty("/selectedIndex7") === -1) {
					count = count + 1;
					this._component.getModel("headerUserModel").setProperty("/ValueState_emg6", "Error");
				} else {
					this._component.getModel("headerUserModel").setProperty("/ValueState_emg6", "None");
				}
			}
			if (formTitle === "" || formTitle === undefined || formTitle === null) {
				count = count + 1;
				this._component.getModel("headerUserModel").setProperty("/ValueState1", "Error");
			} else {
				this._component.getModel("headerUserModel").setProperty("/ValueState1", "None");
			}

			if (formDes === "" || formDes === undefined || formDes === null) {
				count = count + 1;
				this._component.getModel("headerUserModel").setProperty("/ValueState_DES", "Error");
			} else {
				this._component.getModel("headerUserModel").setProperty("/ValueState_DES", "None");
			}

			if (formReqTitle === "" || formReqTitle === undefined || formReqTitle === null) {
				count = count + 1;
				this._component.getModel("headerUserModel").setProperty("/ValueState3", "Error");
			} else {
				this._component.getModel("headerUserModel").setProperty("/ValueState3", "None");
			}
			if (formReqEmail === "" || formReqEmail === undefined || formReqEmail === null) {
				count = count + 1;
				this._component.getModel("headerUserModel").setProperty("/ValueState4", "Error");
			} else {
				this._component.getModel("headerUserModel").setProperty("/ValueState4", "None");
			}
			if (formPhNum === "" || formPhNum === undefined || formPhNum === null) {
				count = count + 1;
				this._component.getModel("headerUserModel").setProperty("/ValueState5", "Error");
			} else {
				this._component.getModel("headerUserModel").setProperty("/ValueState5", "None");
			}
			if (formLocation === "" || formLocation === undefined || formLocation === null) {
				count = count + 1;
				this._component.getModel("headerUserModel").setProperty("/ValueState2", "Error");
			} else {
				this._component.getModel("headerUserModel").setProperty("/ValueState2", "None");
			}

			if (country === "" || country === undefined || country === null) {
				count = count + 1;
				this._component.getModel("headerUserModel").setProperty("/ValueState11", "Error");
			} else {
				this._component.getModel("headerUserModel").setProperty("/ValueState11", "None");
			}

			if (country_Rec === "" || country_Rec === undefined || country_Rec === null) {
				count = count + 1;
				this._component.getModel("headerUserModel").setProperty("/ValueState111", "Error");
			} else {
				this._component.getModel("headerUserModel").setProperty("/ValueState111", "None");
			}

			if (activity === "" || activity === undefined || activity === null) {
				count = count + 1;
				this._component.getModel("headerUserModel").setProperty("/ValueState6", "Error");
			} else {
				this._component.getModel("headerUserModel").setProperty("/ValueState6", "None");
			}

			if (location === "" || location === undefined || location === null) {
				count = count + 1;
				this._component.getModel("headerUserModel").setProperty("/ValueState7", "Error");
			} else {
				this._component.getModel("headerUserModel").setProperty("/ValueState7", "None");
			}

			if (describe === "" || describe === undefined || describe === null) {
				count = count + 1;
				this._component.getModel("headerUserModel").setProperty("/ValueState8", "Error");
			} else {
				this._component.getModel("headerUserModel").setProperty("/ValueState8", "None");
			}

			if (count !== 0) {
				MessageBox.error("Please enter all the mandatory fields");

			}
			if (this.mandCount2 !== 1) {
				var oFormSaveDeferred = this.saveEditedEntries(isSave, this.isEmptyFlag, this.title);
			}
		},

		onPressWithdraw: function () {

			var oModel = this.getOwnerComponent().getModel("oDataModel");
			var that1 = this;
			oModel.read("/eFormInitialInfos('" + eform_num + "')", {
				success: function (oData, response) {
					if (response.data.STATUS == "Not Authorised") {
						// edit is not allowed
						MessageBox.alert("You cannot withdraw this eForm.");
						return;
					} else {

						var s = {};
						var that = that1;
						var curr_view = that1.getView();
						var oFormSaveDeferred
							// this.eform_withdraw;
						new Promise(function (fnResolve) {
							sap.m.MessageBox.confirm("Do you want to Cancel the workflow for Government Expenditure Form process? ", {
								title: "Confirm Withdraw",
								actions: ["Yes", "No"],
								onClose: function (sActionClicked) {
									if (sActionClicked === "Yes") {
										var oAction = "Withdraw";

										oFormSaveDeferred = that.saveEditedEntries(oAction, that.isEmptyFlag, that.title);
										that.getView().getModel("headerUserModel").setProperty("/COMMENTS_ENABLED", true);

									} else if (sActionClicked === "No") {

										//   that.getOwnerComponent().getModel("headerUserModel").setProperty("/isEnableSubmit", false);
										//    that.getOwnerComponent().getModel("headerUserModel").setProperty("/isEnable", false);
										//   that.getOwnerComponent().getModel("headerUserModel").setProperty("/isEnableSave", false);
										//   that.handleButtonEnable();
									}
								}
							});
						}).catch(function (err) {
							if (err !== undefined) {
								MessageBox.error(err);
							}
						}.bind(this));

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

		//Print for Government Expenditure Form

		onPrintPress: function () {

			var header;

			var appTable = this.getView().getModel("oApproverModel").getData();

			var aItems = this.getOwnerComponent().getModel("repTableModel").getData();

			var aItemUser = this.getOwnerComponent().getModel("itemUserModel").getData();

			var headers = this.getOwnerComponent().getModel("headerUserModel").getData();

			var collection = this.getOwnerComponent().getModel("oCollectionModel").getData();

			var comment = this.getOwnerComponent().getModel("oCommentsModel").getData();

			var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

			//for header data

			var header =
				"<body><table width='100%' ><tr><th style='border:1px solid black; background-color: #dddddd;'>" + this.getView().byId("pageId").getTitle() +
				"</th></tr></table>" +
				"<table width='100%' ><tr><th style='border:1px solid black;'>" + headers.FORM_NUM +
				" - " + headers.TITLE + "</td></tr></table><table width='100%' ><tr><td style='border:1px solid black;'>" + oBundle.getText("Decs") +
				"</td><td style='border:1px solid black;'>" +
				headers.Des + "</td></tr>" + "<tr><td style='border:1px solid black;'>" + oBundle.getText("Preparer") +
				"</td><td style='border:1px solid black;'>" +
				headers.PREPARER + "</td></tr>" + "<tr><td style='border:1px solid black;'>" + oBundle.getText("OnBehalfOf") +
				"</td><td style='border:1px solid black;'>" +

				headers.ONBEHALFOF + "</td></tr>" +
				"<tr><td style='border:1px solid black;'>" + oBundle.getText("RequestorTitle") + "</td><td style='border:1px solid black;'>" +

				headers.REQ_TITLE + "</td></tr>" +
				"<tr><td style='border:1px solid black;'>" + oBundle.getText("RequesterEmail") + "</td><td style='border:1px solid black;'>" +

				headers.REQ_EMAIL + "</td></tr>" +
				"<tr><td style='border:1px solid black;'>" + oBundle.getText("Requester_Office_Phone_Number") +
				"</td><td style='border:1px solid black;'>" +

				headers.PHONE_NUM + "</td></tr>" +
				"<tr><td style='border:1px solid black;'>" + oBundle.getText("Requestor_Office_Location") +
				"</td><td style='border:1px solid black;'>" +

				headers.LOCATION + "</td></tr>" +

				"<tr><td style='border:1px solid black;'>" + oBundle.getText("Country") + "</td><td style='border:1px solid black;'>" +

				headers.RES_COUNTRY + "</td></tr>" +
				"<tr><td style='border:1px solid black;'>" + oBundle.getText("LOB") + "</td><td style='border:1px solid black;'>" +

				headers.LOB + "</td></tr>" +
				"<tr><td style='border:1px solid black;'>" + oBundle.getText("SLOB") + "</td><td style='border:1px solid black;'>" +

				headers.SLOB + "</td></tr>" + "<tr><td style='border:1px solid black;'>" + oBundle.getText("Activity") +
				"</td><td style='border:1px solid black;'>" +

				headers.Activity + "</td></tr>" +

				//REQ0470877:NSONI3:GWDK901935:01/10/2020:ADD COUNTRY:START
				"<tr><td style='border:1px solid black;'>" + oBundle.getText("CountryActivity") +
				"</td><td style='border:1px solid black;'>" +
				headers.REC_COUNTRY + "</td></tr>" +
				//REQ0470877:NSONI3:GWDK901935:01/10/2020:ADD COUNTRY:END

				"<tr><td style='border:1px solid black;'>" + oBundle.getText("LocationActivity") + "</td><td  style='border:1px solid black;'>" +

				headers.Loc_act + "</td></tr>" +
				"<tr><td style='border:1px solid black;'>" + oBundle.getText("Bussi") + "</td><td style='border:1px solid black;'>" +

				headers.buss_des + "</td></tr>" +
				"<tr><td style='border:1px solid black;'>" + oBundle.getText("AreAny") + "</td><td  style='border:1px solid black;'>" +

				headers.Is_SPE + "</td></tr>";

			//REQ0470877:NSONI3:GWDK901935:12/10/2019:ADD IF CONDITION TO HIDE SPE LIST:START
			if (headers.Is_SPE == "Yes") {
				header = header + "<tr><td style='border:1px solid black;'>" + oBundle.getText("List") + "</td><td style='border:1px solid;'>" +
					headers.SPE_List + "</td></tr>";
			}
			// REQ0470877:NSONI3:GWDK901935:12/10/2019:ADD IF CONDITION TO HIDE SPE LIST:END

			header = header + "<tr><td style='border:1px solid black;'>" + oBundle.getText("IsEmer") + "</td><td style='border:1px solid;'>" +

				headers.Is_Exp + "</td></tr>"

			+ "</table>" +
			"<table width='100%' ><tr><th style='border:1px solid black;'>" +
			"Summary Totals" + "</th></tr></table><table width='100%' ><tr><td style='border:1px solid black;'>" + oBundle.getText(
					"SummaryTotals_text1") + "</td><td style='border:1px solid black;'>" +
				headers.SummaryTotals_Value1 + "</td></tr>" + "<tr><td style='border:1px solid black;'>" + oBundle.getText("SummaryTotals_text2") +
				"</td><td style='border:1px solid black;'>" +
				headers.SummaryTotals_Value2 + "</td></tr>" + "<tr><td style='border:1px solid black;'>" + oBundle.getText("SummaryTotals_text3") +
				"</td><td style='border:1px solid black;'>" +

				headers.SummaryTotals_Value3 + "</td></tr>" +
				"<tr><td style='border:1px solid black;'>" + oBundle.getText("SummaryTotals_text4") + "</td><td style='border:1px solid black;'>" +

				headers.SummaryTotals_Value4 + "</td></tr>" +
				"<tr><td style='border:1px solid black;'>" + oBundle.getText("SummaryTotals_text5") + "</td><td style='border:1px solid black;'>" +

				headers.SummaryTotals_Value5 + "</td></tr>" +
				"<tr><td style='border:1px solid black;'>" + oBundle.getText("SummaryTotals_text6") + "</td><td style='border:1px solid black;'>" +

				headers.SummaryTotals_Value6 + "</td></tr>" +
				"<tr><td style='border:1px solid black;'>" + oBundle.getText("SummaryTotals_text7") + "</td><td style='border:1px solid black;'>" +

				headers.SummaryTotals_Value7 + "</td></tr>";
			//REQ0470877:NSONI3:GWDK901935:12/11/2019:Emergency Facilitating Payment Print:START
			if (headers.Is_Exp == "Yes") {
				header = header + "<tr><td style='border:1px solid black;'>" + oBundle.getText("EmgncyQues1") +
					"</td><td style='border:1px solid black;'>" +

					headers.VALUE2 + "</td></tr>" +
					"<tr><td style='border:1px solid black;'>" + oBundle.getText("EmgncyQues2") + "</td><td style='border:1px solid black;'>" +

					headers.VALUE3 + "</td></tr>" + "<tr><td style='border:1px solid black;'>" + oBundle.getText("EmgncyQues3") +
					"</td><td style='border:1px solid black;'>" +

					headers.VALUE4 + "</td></tr>" +
					"<tr><td style='border:1px solid black;'>" + oBundle.getText("EmgncyQues4") + "</td><td style='border:1px solid black;'>" +

					headers.VALUE5 + "</td></tr>" + "<tr><td style='border:1px solid black;'>" + oBundle.getText("EmgncyQues5") +
					"</td><td style='border:1px solid black;'>" +

					headers.VALUE6 + "</td></tr>" +
					"<tr><td style='border:1px solid black;'>" + oBundle.getText("EmgncyQues6") + "</td><td style='border:1px solid black;'>" +

					headers.VALUE7 + "</td></tr>";
			}
			header = header +
				"</table>" +

				"</body>";
			//REQ0470877:NSONI3:GWDK901935:12/11/2019:Emergency Facilitating Payment Print:END 
			//for approval data
			var tableApprover = "";
			if (appTable.length > 0) {
				var tableApprover =

					'<center><h3>Approvers</h3></center><hr>' +

					"<table width='100%'><tr><td style='border:1px solid black;'>" + oBundle.getText("Approved") +
					"</td><td style='border:1px solid black;'>" + oBundle.getText("Approver") +
					"</td><td style='border:1px solid black;'>" + oBundle.getText("Reviewer_Type") + " </td>" +
					"<td style='border:1px solid black;'>" + oBundle.getText("Approved_By") +
					"</td><td style='border:1px solid black;'>" + oBundle.getText("Approval_Date") + " </td>" +
					"<td style='border:1px solid black;'>" +
					oBundle.getText("Approval_Time(PST)") + " </td>" + "<td style='border:1px solid black;'>" +
					oBundle.getText("Manual_Addition") + " </td>" + "<td style='border:1px solid black;'>" +
					oBundle.getText("Added_By") + " </td>" + "<td style='border:1px solid black;'>" +
					oBundle.getText("Added_On") + " </td>"
				"</tr>";

				for (var i = 0; i < appTable.length; i++) {
					var isApproved = "";
					if (this.getView().getModel("oApproverModel").getData()[i].APPROVED === "Approved") {
						isApproved = "Approved";
					} else if (this.getView().getModel("oApproverModel").getData()[i].APPROVED === "Rejected") {
						isApproved = "Rejected";
					} else {
						isApproved = "";
					}

					if (this.getView().getModel("oApproverModel").getData()[i].MANUAL == false) {
						isManual = "No";
					} else {
						isManual = "Yes";
					}

					tableApprover = tableApprover +
						"<tr><td style='border:1px solid black;'>" + isApproved + "</td><td style='border:1px solid black;'> " + appTable[i].APPR +
						"</td><td style='border:1px solid black;'>" +
						appTable[i].REVIEWER_TYPE + "</td><td style='border:1px solid black;'>" +
						appTable[i].APPROVED_BY +
						"</td><td style='border:1px solid black;'>" + appTable[i].APPROVAL_DT + "</td><td style='border:1px solid black;'>" +
						appTable[i].APPROVAL_TM + " </td>" +
						"<td style='border:1px solid black;'>" + isManual + " </td><td style='border:1px solid black;'>" + appTable[i].ADDED_BY +
						" </td><td style='border:1px solid black;'>" +
						appTable[i].CREATION_DT + "</td></tr>";
				}
				tableApprover = tableApprover + "</table>"
			};

			//For item data-Recipient

			var itemsDet = "";

			if (aItems.length > 0) {

				for (var i = 0; i < aItems.length; i++) {

					var num = i + 1;
					itemsDet = itemsDet + "<body><table width='100%' ><tr><th style='border:1px solid black; background-color: #dddddd;'>" + oBundle.getText(
							"ReciDetTitle") + "</th></tr></table>" +
						"<table width='100%' ><tr><th style='border:1px solid black;'>" +
						oBundle.getText("ReciInfo") + num + oBundle.getText("OutOf") + " " + aItems.length +
						"</td></tr></table><table width='100%' ><tr><td style='border:1px solid black;'>" + oBundle.getText("ReciLName") +
						"</td><td style='border:1px solid black;'>" +
						aItems[i].Recipient.RECIPIENT_LAST_NAME + "</td></tr>" + "<tr><td style='border:1px solid black;'>" + oBundle.getText(
							"ReciFName") + "</td><td style='border:1px solid black;'>" +
						aItems[i].Recipient.RECIPIENT_FIRST_NAME + "</td></tr>" + "<tr><td style='border:1px solid black;'>" + oBundle.getText(
							"ReciJobTitle") + "</td><td style='border:1px solid black;'>" +

						aItems[i].Recipient.RECIPIENT_TITLE + "</td></tr>" +
						//REQ0592780:PJAIN6:GWDK902131:09/04/2020:NEW FIELD ADDED:START
						"<tr><td style='border:1px solid black;'>" + oBundle.getText("ReciBussiR") + "</td><td style='border:1px solid black;'>" +

						aItems[i].Recipient.RECI_BUSSI + "</td></tr>" +
						//REQ0592780:PJAIN6:GWDK902131:09/04/2020:NEW FIELD ADDED:END
						"<tr><td style='border:1px solid black;'>" + oBundle.getText("ReciAdd") + "</td><td style='border:1px solid black;'>" +

						aItems[i].Recipient.RECIPIENT_ADD + "</td></tr>" +
						"<tr><td style='border:1px solid black;'>" + oBundle.getText("ReciCountry") + "</td><td style='border:1px solid black;'>" +

						aItems[i].Recipient.RECIPIENT_COUNTRY + "</td></tr>" +
						"<tr><td style='border:1px solid black;'>" + oBundle.getText("ReciState") + "</td><td style='border:1px solid black;'>" +

						aItems[i].Recipient.RECIPIENT_STATE + "</td></tr>" +
						"<tr><td style='border:1px solid black;'>" + oBundle.getText("ReciCity") + "</td><td style='border:1px solid black;'>" +

						aItems[i].Recipient.RECIPIENT_CITY + "</td></tr>" +

						"<tr><td style='border:1px solid black;'>" + oBundle.getText("ReciPostal") + "</td><td style='border:1px solid black;'>" +

						aItems[i].Recipient.RECIPIENT_PC + "</td></tr>"
						//REQ0592780:PJAIN6:GWDK902131:09/04/2020:NEW FIELD ADDED:START
						+ "<tr><td style='border:1px solid black;'>" + oBundle.getText("ReciQues1") + "</td><td style='border:1px solid black;'>" +

						aItems[i].Recipient.IS_REL_IND + "</td></tr>" +
						"<tr><td style='border:1px solid black;'>" + oBundle.getText("ReciQues2") + "</td><td style='border:1px solid black;'>" +

						aItems[i].Recipient.Res_sel1 + "</td></tr>";
					if (aItems[i].Recipient.Res_sel1 == "Yes") {
						itemsDet = itemsDet + "<tr><td style='border:1px solid black;'>" + oBundle.getText("form_Justification1") +
							"</td><td style='border:1px solid black;'>" +

							aItems[i].Recipient.form_Justification1 + "</td></tr>";
					}
					itemsDet = itemsDet + "<tr><td style='border:1px solid black;'>" + oBundle.getText("ReciQues3") +
						"</td><td style='border:1px solid black;'>" +

						aItems[i].Recipient.Res_sel2 + "</td></tr>";
					if (aItems[i].Recipient.Res_sel2 == "Yes") {
						itemsDet = itemsDet + "<tr><td style='border:1px solid black;'>" + oBundle.getText("form_Justification1") +
							"</td><td style='border:1px solid black;'>" +

							aItems[i].Recipient.form_Justification2 + "</td></tr>";
					}
					itemsDet = itemsDet + "<tr><td style='border:1px solid black;'>" + oBundle.getText("ReciQues4") +
						"</td><td style='border:1px solid black;'>" +

						aItems[i].Recipient.Res_sel3 + "</td></tr>";
					if (aItems[i].Recipient.Res_sel3 == "Yes") {
						itemsDet = itemsDet + "<tr><td style='border:1px solid black;'>" + oBundle.getText("form_Justification1") +
							"</td><td style='border:1px solid black;'>" +

							aItems[i].Recipient.form_Justification3 + "</td></tr>";
					}
					itemsDet = itemsDet +
						//REQ0592780:PJAIN6:GWDK902131:09/04/2020:NEW FIELD ADDED:END
						"</table><table width='100%' ><tr><th style='border:1px solid black;'>" +
						oBundle.getText("OrgInfo") + num + oBundle.getText("OutOf") + " " + aItems.length +
						"</td></tr></table><table width='100%' ><tr><td style='border:1px solid black;'>" + oBundle.getText("OrgName") +
						"</td><td style='border:1px solid black;'>" +

						aItems[i].Organisation.RECIPIENT_ORG + "</td></tr>" + "<tr><td style='border:1px solid black;'>" + oBundle.getText("OrgType") +
						"</td><td style='border:1px solid black;'>" +

						aItems[i].Organisation.ORG_TYPE + "</td></tr>" +

						//REQ0592780:NSONI3:GWDK902131:09/07/2020:ADD BUSINESS RATINALE IN PRINT:START
						"<tr><td style='border:1px solid black;'>" + oBundle.getText("OrgBussiR") +
						"</td><td style='border:1px solid black;'>" +
						aItems[i].Organisation.ORG_BUSSI + "</td></tr>" +
						//REQ0592780:NSONI3:GWDK902131:09/07/2020:ADD BUSINESS RATINALE IN PRINT:END

						"<tr><td style='border:1px solid black;'>" + oBundle.getText("OrgAdd") + "</td><td  style='border:1px solid black;'>" +
						aItems[i].Organisation.ORG_ADDRESS + "</td></tr>" +
						"<tr><td style='border:1px solid black;'>" + oBundle.getText("OrgCountry") + "</td><td style='border:1px solid black;'>" +
						//REQ0470877:RMANDAL:GWDK901935:12/10/2019:ADD COUNTRY IN ORGANIZATION:START // Nikunj was here
						aItems[i].Organisation.ORG_COUNTRY + "</td></tr>" +
						//REQ0470877:RMANDAL:GWDK901935:12/10/2019:ADD COUNTRY IN ORGANIZATION:END
						"<tr><td style='border:1px solid black;'>" + oBundle.getText("OrgState") + "</td><td style='border:1px solid black;'>" +

						aItems[i].Organisation.ORG_STATE + "</td></tr>" + "<tr><td style='border:1px solid black;'>" + oBundle.getText("OrgCity") +
						"</td><td style='border:1px solid black;'>" +

						aItems[i].Organisation.CITY + "</td></tr>" + "<tr><td style='border:1px solid black;'>" + oBundle.getText("OrgPincode") +
						"</td><td style='border:1px solid black;'>" +

						aItems[i].Organisation.ORG_POSTAL_CODE + "</td></tr></table><table width='100%' ><tr><th style='border:1px solid black;'>" +
						oBundle.getText("ExpInfo") + num + oBundle.getText("OutOf") + " " + aItems.length +
						"</td></tr></table><table width='100%' ><tr><td style='border:1px solid black;'>" + oBundle.getText("ExpType") +
						"</td><td style='border:1px solid black;'>" +

						aItems[i].Expense.EXP_TYPE + "</td></tr>" + "<tr><td style='border:1px solid black;'>" + oBundle.getText("ExpSubCat") +
						"</td><td style='border:1px solid black;'>" +

						aItems[i].Expense.EXP_SUBCAT + "</td></tr>" +
						"<tr><td style='border:1px solid black;'>" + oBundle.getText("ExpDes") + "</td><td  style='border:1px solid black;'>" +

						aItems[i].Expense.EXP_DES + "</td></tr>" +
						"<tr><td style='border:1px solid black;'>" + oBundle.getText("ExpPayMethod") + "</td><td style='border:1px solid black;'>" +
						aItems[i].Expense.PAYMENT_METHOD + "</td></tr>" +

						"<tr><td style='border:1px solid black;'>" + oBundle.getText("ExpIsTravel") + "</td><td style='border:1px solid black;'>" +
						aItems[i].Expense.IS_TRAVEL + "</td></tr>";

					//REQ0470877:NSONI3:GWDK901935:01/10/2020:TRAVEL EXPENSE CHANGES:START
					if (aItems[i].Expense.IS_TRAVEL == "Yes") {
						itemsDet = itemsDet +
							"<tr><td style='border:1px solid black;'>" + oBundle.getText("ExpTravelExpense") +
							"</td><td style='border:1px solid black;'>" +

							aItems[i].Expense.TRAVEL_EXPENSE + "</td></tr>";

						if (aItems[i].Expense.TRAVEL_EXPENSE == "Other") {
							itemsDet = itemsDet +
								"<tr><td style='border:1px solid black;'>" + oBundle.getText("ExpOther") +
								"</td><td style='border:1px solid black;'>" +

								aItems[i].Expense.OTHERTRAVEL_EXP + "</td></tr>";
						} else if (aItems[i].Expense.TRAVEL_EXPENSE == "Hotel") {
							itemsDet = itemsDet +
								"<tr><td style='border:1px solid black;'>" + oBundle.getText("ExpHotelName") +
								"</td><td style='border:1px solid black;'>" +

								aItems[i].Expense.HotelName_EXP + "</td></tr>" + "<tr><td style='border:1px solid black;'>" + oBundle.getText("ExpHotelCity") +
								"</td><td style='border:1px solid black;'>" +
								aItems[i].Expense.HotelCity_EXP + "</td></tr>";
						} else {
							itemsDet = itemsDet +
								"<tr><td style='border:1px solid black;'>" + oBundle.getText("ExpTravOrigin") +
								"</td><td style='border:1px solid black;'>" +

								aItems[i].Expense.TravelOrgin_EXP + "</td></tr>" + "<tr><td style='border:1px solid black;'>" + oBundle.getText("ExpTravDest") +
								"</td><td style='border:1px solid black;'>" +

								aItems[i].Expense.TravelDest_EXP + "</td></tr>";
						}

					}
					//REQ0470877:NSONI3:GWDK901935:01/10/2020:TRAVEL EXPENSE CHANGES:END

					itemsDet = itemsDet + "<tr><td style='border:1px solid black;'>" + oBundle.getText("ExpProposedDate") +
						"</td><td style='border:1px solid black;'>" +
						aItems[i].Expense.DATE_OF_EXP + "</td></tr>" + "<tr><td style='border:1px solid black;'>" + oBundle.getText("ExpReqAmt") +
						"</td><td style='border:1px solid black;'>" +

						aItems[i].Expense.REQ_AMT_EXP + "</td></tr>" + "<tr><td style='border:1px solid black;'>" + oBundle.getText("ExpCCode") +
						"</td><td style='border:1px solid black;'>" +

						aItems[i].Expense.COMPANY_CODE + "</td></tr>" + "<tr><td style='border:1px solid black;'>" + oBundle.getText("ExpGLArea") +
						"</td><td style='border:1px solid black;'>" +

						aItems[i].Expense.GEN_LEDGER_AREA + "</td></tr>" + "<tr><td style='border:1px solid black;'>" + oBundle.getText("ExpGL") +
						"</td><td style='border:1px solid black;'>" +

						aItems[i].Expense.GEN_LEDGER + "</td></tr>";

				}

				itemsDet = itemsDet + "</table>";

			}

			//REQ0470877:RMANDAL:GWDK901935:12/11/2019:ADD COMMENTS SECTION:START //Nikunj was here
			var commentsStr = "";
			if (comment.length > 0) {
				commentsStr =
					'<center><h3>Comments</h3></center><hr>' +
					"<table width='100%'> " +
					"<tr><td style='border:1px solid black;'>" + oBundle.getText("Id") + "</td><td style='border:1px solid black;'>" +
					oBundle.getText("Comments") + "</td><td style='border:1px solid black;'>" + oBundle.getText("AddedBy") +
					" </td>" +
					"<td style='border:1px solid black;'>" + oBundle.getText("AddedOn") +
					"</td></tr>";
				for (var i = 0; i < comment.length; i++) {
					commentsStr = commentsStr + "<tr><td style='border:1px solid black;'>" + comment[i].SEQUENCE +
						"</td><td style='border:1px solid black;'>" + comment[i].COMMENTS +
						"</td><td style='border:1px solid black;'>" +
						comment[i].CREATOR + "</td><td style='border:1px solid black;'>" +
						comment[i].CR_DATE + "</td>" +
						'</tr>';
				}
				commentsStr = commentsStr + '</table>';
			}
			//REQ0470877:RMANDAL:GWDK901935:12/11/2019:ADD COMMENTS SECTION:END

			var cltstrng = "width=500px,height=600px";
			var wind = window.open("", cltstrng);
			wind.document.write(header + itemsDet + tableApprover + commentsStr);
			wind.print();
		},

		onPressDelete: function () {
			//REQ0470877:RMANDAL:GWDK901935:11/07/2019:Validation to check if user is authorised to delete the form:START
			// var sLoggedInUser = this._component.getModel("headerUserModel").getProperty("/Logged_In_User");
			// var sPreparer = this._component.getModel("headerUserModel").getProperty("/PREPARER");
			// var sCardHolder = this._component.getModel("headerUserModel").getProperty("/CARDHOLDERNAME");

			var sCurrentUser = sap.ushell.Container.getUser().getId();
			var sPreparerId = this._component.getModel("headerUserModel").getProperty("/PREPARERID");
			var sOnBehalfOfId = this._component.getModel("headerUserModel").getProperty("/ONBEHALFOFID");

			if ((sCurrentUser !== sPreparerId) && (sCurrentUser !== sOnBehalfOfId)) {
				MessageBox.error("You are not authorized to Delete this form");
				//REQ0470877:RMANDAL:GWDK901935:11/07/2019:Validation to check if user is authorised to delete the form:END
			} else {
				var s = {};
				var that = this;
				var curr_view = this.getView();
				var oFormSaveDeferred
					// this.eform_withdraw;
				new Promise(function (fnResolve) {
					sap.m.MessageBox.confirm("Are you sure you want to delete the form?", {
						title: "Confirm Delete",
						actions: ["Yes", "No"],
						onClose: function (sActionClicked) {
							if (sActionClicked === "Yes") {
								var oAction = "Delete";
								oFormSaveDeferred = that.saveEditedEntries(oAction, that.isEmptyFlag, that.title);

							} else if (sActionClicked === "No") {

								//this.getOwnerComponent().getModel("headerUserModel").setProperty("/isEnableSubmit", false);
								//this.getOwnerComponent().getModel("headerUserModel").setProperty("/isEnableSave", false);
							}
						}
					});
				}).catch(function (err) {
					if (err !== undefined) {
						MessageBox.error(err);
					}
				}.bind(this));
				jQuery.when.apply(oFormSaveDeferred)
					.done(function () {

					}.bind(this))
					.fail(function (oError) {

					}.bind(this));

			}
		},
		onPressSubmit: function () {
			var isSave = "false";

			var speEmployeeRdbtn = this.byId('Are_Any_Id');
			var emergencyRdbtn = this.byId('Is_Emg_ID');
			var activity = this._component.getModel("headerUserModel").getProperty("/Activity");
			var location = this._component.getModel("headerUserModel").getProperty("/Loc_act");
			var describe = this._component.getModel("headerUserModel").getProperty("/buss_des");
			var country = this._component.getModel("headerUserModel").getProperty("/RES_COUNTRY");
			var country_Rec = this._component.getModel("headerUserModel").getProperty("/REC_COUNTRY");
			var formTitle = this._component.getModel("headerUserModel").getProperty("/TITLE");
			var formDes = this._component.getModel("headerUserModel").getProperty("/Des");
			var formOnBehalfOf = this._component.getModel("headerUserModel").getProperty("/ONBEHALFOF");
			var formReqTitle = this._component.getModel("headerUserModel").getProperty("/REQ_TITLE");
			var formReqEmail = this._component.getModel("headerUserModel").getProperty("/REQ_EMAIL");
			var formPhNum = this._component.getModel("headerUserModel").getProperty("/PHONE_NUM");
			var formLocation = this._component.getModel("headerUserModel").getProperty("/LOCATION");
			var formOfc_Div = this._component.getModel("headerUserModel").getProperty("/OFC_DIV");
			var formAmt_SLob = this._component.getModel("headerUserModel").getProperty("/SLOB");
			var formAmt_LOB = this._component.getModel("headerUserModel").getProperty("/LOB");
			var aItems = this.getOwnerComponent().getModel("repTableModel").getData();
			var mandCount = 0;
			var mandCount1 = 0;
			var mandCount2 = 0;
			if (!aItems.length) {
				var mandCount1 = 1;
			}
			if (aItems.length) {
				if ((this.getView().getModel("headerUserModel").getProperty("/selectedIndex_Exp") === 0) && (aItems.length > 1)) {

					var mandCount2 = mandCount2 + 1;
				} else {

					var mandCount2 = 0;
				}
			}
			for (var i = 0; i < aItems.length; i++) {
				if (aItems[i].Expense.EXP_TYPE && aItems[i].Recipient.RECIPIENT_FIRST_NAME && aItems[i].Organisation.RECIPIENT_ORG) {
					mandCount = 0;
				} else {

					mandCount = mandCount + 1;
				}
			}

			var count = 0;
			if (speEmployeeRdbtn.getSelectedIndex() === -1) {
				count = count + 1;
				speEmployeeRdbtn.setValueState("Error");
			} else {
				if (speEmployeeRdbtn.getSelectedIndex() == 0) {
					if (this.byId('SPE_List').getValue() == "") {
						count = count + 1;
						this.byId('SPE_List').setValueState("Error");
					} else {
						this.byId('SPE_List').setValueState("None");
					}

				} else {
					this.byId('SPE_List').setValueState("None");
					speEmployeeRdbtn.setValueState("None");
				}

			}

			if (emergencyRdbtn.getSelectedIndex() === -1) {
				count = count + 1;
				emergencyRdbtn.setValueState("Error");
			} else {
				emergencyRdbtn.setValueState("None");
			}

			if (this._component.getModel("headerUserModel").getProperty("/Exp") === true) {
				if (this._component.getModel("headerUserModel").getProperty("/selectedIndex2") === -1) {
					count = count + 1;
					this._component.getModel("headerUserModel").setProperty("/ValueState_emg1", "Error");
				} else {
					this._component.getModel("headerUserModel").setProperty("/ValueState_emg1", "None");
				}
				if (this._component.getModel("headerUserModel").getProperty("/selectedIndex3") === -1) {
					count = count + 1;
					this._component.getModel("headerUserModel").setProperty("/ValueState_emg2", "Error");
				} else {
					this._component.getModel("headerUserModel").setProperty("/ValueState_emg2", "None");
				}
				if (this._component.getModel("headerUserModel").getProperty("/selectedIndex4") === -1) {
					count = count + 1;
					this._component.getModel("headerUserModel").setProperty("/ValueState_emg3", "Error");
				} else {
					this._component.getModel("headerUserModel").setProperty("/ValueState_emg3", "None");
				}

				if (this._component.getModel("headerUserModel").getProperty("/selectedIndex5") === -1) {
					count = count + 1;
					this._component.getModel("headerUserModel").setProperty("/ValueState_emg4", "Error");
				} else {
					this._component.getModel("headerUserModel").setProperty("/ValueState_emg4", "None");
				}

				if (this._component.getModel("headerUserModel").getProperty("/selectedIndex6") === -1) {
					count = count + 1;
					this._component.getModel("headerUserModel").setProperty("/ValueState_emg5", "Error");
				} else {
					this._component.getModel("headerUserModel").setProperty("/ValueState_emg5", "None");
				}
				if (this._component.getModel("headerUserModel").getProperty("/selectedIndex7") === -1) {
					count = count + 1;
					this._component.getModel("headerUserModel").setProperty("/ValueState_emg6", "Error");
				} else {
					this._component.getModel("headerUserModel").setProperty("/ValueState_emg6", "None");
				}
			}
			if (formTitle === "" || formTitle === undefined || formTitle === null) {
				count = count + 1;
				this._component.getModel("headerUserModel").setProperty("/ValueState1", "Error");
			} else {
				this._component.getModel("headerUserModel").setProperty("/ValueState1", "None");
			}

			if (formDes === "" || formDes === undefined || formDes === null) {
				count = count + 1;
				this._component.getModel("headerUserModel").setProperty("/ValueState_DES", "Error");
			} else {
				this._component.getModel("headerUserModel").setProperty("/ValueState_DES", "None");
			}

			if (formReqTitle === "" || formReqTitle === undefined || formReqTitle === null) {
				count = count + 1;
				this._component.getModel("headerUserModel").setProperty("/ValueState3", "Error");
			} else {
				this._component.getModel("headerUserModel").setProperty("/ValueState3", "None");
			}
			if (formReqEmail === "" || formReqEmail === undefined || formReqEmail === null) {
				count = count + 1;
				this._component.getModel("headerUserModel").setProperty("/ValueState4", "Error");
			} else {
				this._component.getModel("headerUserModel").setProperty("/ValueState4", "None");
			}
			if (formPhNum === "" || formPhNum === undefined || formPhNum === null) {
				count = count + 1;
				this._component.getModel("headerUserModel").setProperty("/ValueState5", "Error");
			} else {
				this._component.getModel("headerUserModel").setProperty("/ValueState5", "None");
			}
			if (formLocation === "" || formLocation === undefined || formLocation === null) {
				count = count + 1;
				this._component.getModel("headerUserModel").setProperty("/ValueState2", "Error");
			} else {
				this._component.getModel("headerUserModel").setProperty("/ValueState2", "None");
			}

			if (country === "" || country === undefined || country === null) {
				count = count + 1;
				this._component.getModel("headerUserModel").setProperty("/ValueState11", "Error");
			} else {
				this._component.getModel("headerUserModel").setProperty("/ValueState11", "None");
			}

			if (country_Rec === "" || country_Rec === undefined || country_Rec === null) {
				count = count + 1;
				this._component.getModel("headerUserModel").setProperty("/ValueState111", "Error");
			} else {
				this._component.getModel("headerUserModel").setProperty("/ValueState111", "None");
			}

			if (activity === "" || activity === undefined || activity === null) {
				count = count + 1;
				this._component.getModel("headerUserModel").setProperty("/ValueState6", "Error");
			} else {
				this._component.getModel("headerUserModel").setProperty("/ValueState6", "None");
			}

			if (location === "" || location === undefined || location === null) {
				count = count + 1;
				this._component.getModel("headerUserModel").setProperty("/ValueState7", "Error");
			} else {
				this._component.getModel("headerUserModel").setProperty("/ValueState7", "None");
			}

			if (describe === "" || describe === undefined || describe === null) {
				count = count + 1;
				this._component.getModel("headerUserModel").setProperty("/ValueState8", "Error");
			} else {
				this._component.getModel("headerUserModel").setProperty("/ValueState8", "None");
			}

			//REQ0470877:RMANDAL:GWDK901935:11/06/2019:Adding validation to check if approval flow is generated before submitting form:START
			if (this._component.getModel("oApproverModel").getData().length === 0) {
				MessageBox.error("Form cannot be submitted, as no approver found in approval flow.");
				return;
			}
			//REQ0470877:RMANDAL:GWDK901935:11/06/2019:Adding validation to check if approval flow is generated before submitting form:END

			if (count === 0 && mandCount === 0 && mandCount1 === 0 && mandCount2 === 0) {

				var oFormSaveDeferred = this.saveEditedEntries(isSave, this.isEmptyFlag, this.title);
			} else if (mandCount1 > 0) {
				MessageBox.error("Please enter atleast one table list item");
			} else if (mandCount > 0) {
				MessageBox.error("Please enter all the mandatory table list items");
			} else if (mandCount2 > 0) {
				MessageBox.error(
					"Only one recipient may be listed per form upon the selection of the Emergency Facilitating Payment Type. Please complete a seperate form for each Recipient receiving an Emergency Facilitating Payment and allocate the amount" +
					" accordingly if the payment was made to multiple Recipients.");
			} else {
				MessageBox.error("Please enter all the mandatory fields");
			}
		},
		onHandlePress: function () {

			var arr = [];

			var data = this.getOwnerComponent().getModel("repTableModel").getData();

			if (data.length > 0) {
				for (var i = 0; i < data.length; i++) {
					arr.push(data[i]);
				}
			}

			obj = {
				Recipient: {
					title: "Add Recipient Information",

				},
				Organisation: {
					title: "Add Organization Information",
				},
				Expense: {
					title: "Add Expense Information"
				}

			};

			arr.push(obj);
			this.getOwnerComponent().getModel("repTableModel").setData(arr);

		},

		handleDelete: function (oEvent) {

			var index = oEvent.getSource().getParent();
			var table = oEvent.getSource().getParent().getParent();
			var indexNumber = table.indexOfItem(index);
			table.removeItem(indexNumber);
		},

		handleAddRecipient: function (oEvent) {
			bindingContext = oEvent.getSource().getParent().getBindingContextPath();
			var subPath = bindingContext.substr(bindingContext.indexOf("/") + 1);
			this.oRouter.navTo("RecipientPage", {
				context: subPath
			});

		},

		handleAddExpense: function (oEvent) {
			bindingContext = oEvent.getSource().getParent().getBindingContextPath();
			var subPath = bindingContext.substr(bindingContext.indexOf("/") + 1);

			this.oRouter.navTo('ExpensePage', {
				context: subPath
			});

		},

		handleAddOrganization: function (oEvent) {
			bindingContext = oEvent.getSource().getParent().getBindingContextPath();
			var subPath = bindingContext.substr(bindingContext.indexOf("/") + 1);
			this.oRouter.navTo('OrganizationPage', {
				context: subPath
			});

		},

		_onStateValueHelpRequest: function () {
			var that = this;
			var lob = this.getOwnerComponent().getModel("headerUserModel").getProperty("/RES_STATE");
			var oValueHelpDialog_RespDiv = new sap.m.SelectDialog({
				title: "Choose Value for State",
				items: {
					path: "/eFormState",
					filters: [new sap.ui.model.Filter({
						filters: [new sap.ui.model.Filter({
							path: "STATE",
							operator: sap.ui.model.FilterOperator.EQ,
							value1: lob
						})],
						and: true
					})],
					template: new sap.m.StandardListItem({
						title: "{SUBLOB}",

						active: true
					})
				},
				//Shipping Point can be searched using Search Bar
				search: function (oEvent) {
					var sValue = oEvent.getParameter("value");
					var oFilter = new sap.ui.model.Filter(
						"STATE",
						sap.ui.model.FilterOperator.EQ, sValue
					);
					oEvent.getSource().getBinding("items").filter([oFilter]);
				},
				confirm: function (oEvent) {
					var oSelectedItem = oEvent.getParameter("selectedItem");
					if (oSelectedItem) {
						//sublob.setValue(oSelectedItem.getTitle());
						that.getOwnerComponent().getModel("headerUserModel").setProperty("/RES_STATE", oSelectedItem.getTitle());
					}
				}
			});
			var model = this.getOwnerComponent().getModel("oDataModel");
			oValueHelpDialog_RespDiv.setModel(model);
			oValueHelpDialog_RespDiv.open();

		},

		_onCountryValueHelpRequest: function () {

			var that = this;
			var lob = that.getOwnerComponent().getModel("headerUserModel").getProperty("/COUNTRY");
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
						if (oSelectedItem.getTitle() === "South Korea") {
							that.getView().byId("WarnId1").setVisible(true);
							that.getView().byId("WarnId2").setVisible(true);
						} else {
							that.getView().byId("WarnId1").setVisible(false);
							that.getView().byId("WarnId2").setVisible(false);
						}
						that.getOwnerComponent().getModel("headerUserModel").setProperty("/RES_COUNTRY", oSelectedItem.getTitle());
						that.getOwnerComponent().getModel("headerUserModel").setProperty("/RES_COUNTRY_ID", oSelectedItem.getTitle());

					}
				}
			});
			var model = this.getOwnerComponent().getModel("oDataModel");
			oValueHelpDialog_RespDiv.setModel(model);
			oValueHelpDialog_RespDiv.open();
		},

		_onCountryValueHelpRequest1: function () {

			var that = this;
			var lob = that.getOwnerComponent().getModel("headerUserModel").getProperty("/COUNTRY");
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

						that.getOwnerComponent().getModel("headerUserModel").setProperty("/REC_COUNTRY", oSelectedItem.getTitle());
						that.getOwnerComponent().getModel("headerUserModel").setProperty("/REC_COUNTRY_ID", oSelectedItem.getTitle());

					}
				}
			});
			var model = this.getOwnerComponent().getModel("oDataModel");
			oValueHelpDialog_RespDiv.setModel(model);
			oValueHelpDialog_RespDiv.open();
		},
		_onSubLobValueHelpRequest: function () {
			// var sublob = this.getView().byId("i_sublob");
			var that = this;
			var lob = this.getOwnerComponent().getModel("headerUserModel").getProperty("/LOB");
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
						//sublob.setValue(oSelectedItem.getTitle());
						that.getOwnerComponent().getModel("headerUserModel").setProperty("/SLOB", oSelectedItem.getTitle());
					}
				}
			});
			var model = this.getOwnerComponent().getModel("oDataModel");
			oValueHelpDialog_RespDiv.setModel(model);
			oValueHelpDialog_RespDiv.open();
		},
		_onLobValueHelpRequest: function () {

			var that = this;
			var lob = that.getOwnerComponent().getModel("headerUserModel").getProperty("/LOB");
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
						//lob.setValue(oSelectedItem.getTitle());
						that.getOwnerComponent().getModel("headerUserModel").setProperty("/LOB", oSelectedItem.getTitle());

					}
				}
			});
			var model = this.getOwnerComponent().getModel("oDataModel");
			oValueHelpDialog_RespDiv.setModel(model);
			oValueHelpDialog_RespDiv.open();
		},

		onHandleUserValueHelp: function (oEvent) {

			this.onGetCardholderNames();

		},
		onHandleApproverValueHelp: function (oEvent) {
			var b = oEvent.getSource().getParent().getBindingContextPath();

			this.sPath = b;
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
						that._oDialog6 = sap.ui.xmlfragment("com.sap.build.standard.governmentApp.fragments.Approver_Dialog", that);
						that._oDialog6.setModel(that.getView().getModel("CardHolderModel1"));
						that.getView().addDependent(that._oDialog6);
					}
					that._oDialog6.setMultiSelect(false);
					that._oDialog6.open();
					that.handleSearch(undefined, "UserDialogId2");
				},
				error: function (error) {}
			});
		},

		onGetCardholderNames: function () {
			var sUserUrl = "/CardHolderNames";
			var that = this;
			this.getOwnerComponent().getModel("oDataModel").read(sUserUrl, {

				success: function (data) {
					var data = {
						CARDHOLDERNAMES: data.results
					};
					var oCardHolderModel = new JSONModel();
					oCardHolderModel.setData(data)
					that._component.setModel(oCardHolderModel, "CardHolderModel");
					if (!that._oDialog5) {
						that._oDialog5 = sap.ui.xmlfragment("com.sap.build.standard.governmentApp.fragments.User_Dialog", that);
						that._oDialog5.setModel(that.getOwnerComponent().getModel("oDataModel"));
						that.getView().addDependent(that._oDialog5);
					}
					that._oDialog5.setMultiSelect(false);
					that._oDialog5.open();
					that.handleSearch(undefined, "UserDialogId");
				},
				error: function (error) {}
			});
		},
		onHandleConfirmUser: function (oEvent) {
			var aContexts = oEvent.getParameter("selectedContexts");
			if (aContexts && aContexts.length) {

				var value;
				var valueName;
				var valuenum;
				var email;

				aContexts.map(function (oContext) {
					valueName = oContext.getObject().UserName;
					value = oContext.getObject().UserId;
					valuenum = oContext.getObject().UserNum;
					email = oContext.getObject().Email;
				});
				this.getView().byId("idPreparerBox").setVisible(true);
				this.getView().byId("idPreparerBox1").setVisible(true);

				this._component.getModel("headerUserModel").setProperty("/ONBEHALFOF", valueName);

				//REQ0470877:RMANDAL:GWDK901935:10/31/2019:Passing User Id:START
				this._component.getModel("headerUserModel").setProperty("/ONBEHALFOFID", value);
				//REQ0470877:RMANDAL:GWDK901935:10/31/2019:Passing User Id:END

				this._component.getModel("headerUserModel").setProperty("/REQ_EMAIL", email);
				this._component.getModel("headerUserModel").setProperty("/PHONE_NUM", valuenum);

			}
		},
		handleSearch: function (oEvent, DialogName) {
			// build filter array
			var aFilter = [];
			if (oEvent) {
				var sQuery = oEvent.getParameter("value");
				if (sQuery) {

					if (oEvent.getParameters().id === "UserDialogId") {
						//REQ0470877:RMANDAL:GWDK901935:11/06/2019:Filtering on user id and user name:START
						var oUserNameFilter = new Filter("UserName", FilterOperator.Contains, sQuery),
							oUserIdFilter = new Filter("UserId", FilterOperator.Contains, sQuery);
						aFilter.push(new Filter([oUserNameFilter, oUserIdFilter], false));
						//REQ0470877:RMANDAL:GWDK901935:11/06/2019:Filtering on user id and user name:END
					}
					if (oEvent.getParameters().id === "UserDialogId1") {
						//REQ0470877:RMANDAL:GWDK901935:11/06/2019:Filtering on user id and user name:START
						var oUserNameFilter = new Filter("NAME", FilterOperator.Contains, sQuery),
							oUserIdFilter = new Filter("USERID", FilterOperator.Contains, sQuery);
						aFilter.push(new Filter([oUserNameFilter, oUserIdFilter], false));
						//REQ0470877:RMANDAL:GWDK901935:11/06/2019:Filtering on user id and user name:END
					}
					if (oEvent.getParameters().id === "UserDialogId2") {
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

				if (DialogName === "UserDialogId") {
					//REQ0470877:RMANDAL:GWDK901935:11/06/2019:Filtering on user id and user name:START
					var oUserNameFilter = new Filter("UserName", FilterOperator.Contains, sQuery),
						oUserIdFilter = new Filter("UserId", FilterOperator.Contains, sQuery);
					aFilter.push(new Filter([oUserNameFilter, oUserIdFilter], false));
					//REQ0470877:RMANDAL:GWDK901935:11/06/2019:Filtering on user id and user name:END
				}
				if (DialogName === "UserDialogId1") {
					//REQ0470877:RMANDAL:GWDK901935:11/06/2019:Filtering on user id and user name:START
					var oUserNameFilter = new Filter("NAME", FilterOperator.Contains, sQuery),
						oUserIdFilter = new Filter("USERID", FilterOperator.Contains, sQuery);
					aFilter.push(new Filter([oUserNameFilter, oUserIdFilter], false));
					//REQ0470877:RMANDAL:GWDK901935:11/06/2019:Filtering on user id and user name:END
				}
				if (DialogName === "UserDialogId2") {
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

		getInitialData: function (action) {
			this.getOwnerComponent().getModel("oDataModel").read("/eFormInitialInfos('1')", {
				success: function (oData, response) {
					if (action === "create") {
						//this._component.getModel("headerUserModel").setProperty("/TITLE",response.data.NAME + ', Government Expenditure Form');

						this._component.getModel("headerUserModel").setProperty("/ONBEHALFOF", response.data.NAME);
						this._component.getModel("headerUserModel").setProperty("/PREPARER", response.data.NAME);
						//REQ0470877:RMANDAL:GWDK901935:10/23/2019:Passing User Id:START
						this._component.getModel("headerUserModel").setProperty("/ONBEHALFOFID", response.data.USERID);
						this._component.getModel("headerUserModel").setProperty("/PREPARERID", response.data.USERID);
						//REQ0470877:RMANDAL:GWDK901935:10/23/2019:Passing User Id:END
						this._component.getModel("headerUserModel").setProperty("/LoggedInUser", response.data.NAME);
						this._component.getModel("headerUserModel").setProperty("/PHONE_NUM", response.data.PHONE);
						this._component.getModel("headerUserModel").setProperty("/REQ_EMAIL", response.data.EMAIL);
					}
					if (action === "display") {
						//this._component.getModel("headerUserModel").setProperty("/TITLE",response.data.NAME + ', Government Expenditure Form');

						this._component.getModel("headerUserModel").setProperty("/LoggedInUser", response.data.NAME);

					}

				}.bind(this),
				error: function (oError) {
					var response = JSON.parse(oError.responseText);
					MessageBox.show(
						response.error.message.value,
						MessageBox.Icon.ERROR,
						"Error"
					);
					sap.ui.core.BusyIndicator.hide();
				}
			}, this);
		},
		saveEditedEntries: function (isSave, EmptyFlag, sForm_Id) {

			var FormUpdateURL = "/eGovermentHeaders";

			if (isSave === "") {
				sTittle = sForm_Id;
				var oFormItem = {};
				oFormItem.STATUS = "Withdrawn",
					oFormItem.EFORM_NUM = sForm_Id;
				// oFormItem.reconapproves = [];

				var tittle;

				this._serverModel.create(FormUpdateURL,
					currentVal, {

						success: function (oResponse) {
							//MessageToast.show("Your Form is withdrawn successfully with Form id : " + oResponse.CHANGE_ID);
							MessageBox.show(
								oResponse.EFORM_NUM + " is withdrawn successfully.",
								MessageBox.Icon.SUCCESS,
								"Success"
							);
							tittle = oResponse.EFORM_NUM;

							this.getView().byId("pageId").setTitle("Government Expenditure Request Form" + tittle);
							sTittle = tittle;
							this._component.getModel("headerUserModel").setProperty("/isEnableSave", true);
							this._component.getModel("headerUserModel").setProperty("/isEnableSubmit", true);
							this._component.getModel("headerUserModel").setProperty("/isEnableWithdraw", false);
							this._component.getModel("headerUserModel").setProperty("/Stauts", oResponse.STATUS);
							this._component.getModel("headerUserModel").setProperty("/COMMENTS_ENABLED", true);

						}.bind(this),
						error: function () {}
					}, this);
				this.setTitle = tittle;
			}

			if (isSave === "Delete") {
				sTittle = sForm_Id;
				var oFormItem = {};
				oFormItem.STATUS = "Delete",
					oFormItem.EFORM_NUM = sForm_Id;

				oFormItem.eGovernmentItemSet = [];
				oFormItem.ApproverSet = [];

				var tittle;
				var that = this;

				this._serverModel.create(FormUpdateURL,
					oFormItem, {

						success: function (oResponse) {

							MessageBox.show(
								oResponse.EFORM_NUM + " is deleted successfully.",
								MessageBox.Icon.SUCCESS,
								"Success"
							);
							e_form_num = oResponse.EFORM_NUM;
							setTimeout(that.approve_reject_button_dsp, 1000);
							this.getOwnerComponent().getModel("headerUserModel").setProperty("/STATUS", "Delete")

							this.onNavBack();

						}.bind(this),
						error: function () {}
					});
				this.setTitle = tittle;

			}
			if ((isSave === "true") || (isSave === "false") || (isSave === "Withdraw")) {

				var aFormUpdatePayload = this._getFormEditPayload(isSave, this.title);
				//REQ0470877:NSONI3:GWDK901998:02/03/2020:CHANGE SUBMIT BUTTON VISIBILITY:START
				var sCurrentUser = sap.ushell.Container.getUser().getId();
				var sPreparerId = this._component.getModel("headerUserModel").getProperty("/PREPARERID");
				var sOnBehalfOfId = this._component.getModel("headerUserModel").getProperty("/ONBEHALFOFID");
				var isVisibleSubmitStatus = (sCurrentUser == sPreparerId || sCurrentUser == sOnBehalfOfId) ? true : false;
				//REQ0470877:NSONI3:GWDK901998:02/03/2020:CHANGE SUBMIT BUTTON VISIBILITY:END
				var that = this;
				var tittle;
				if (aFormUpdatePayload) {
					var oSaveFormDeferred = jQuery.Deferred();
					//var pageTittle = this.getView().byId("pageId");
					var displayText = "";

					FormUpdateURL = FormUpdateURL;
					this._serverModel.create(FormUpdateURL,
						aFormUpdatePayload, {

							success: function (oResponse) {
								if (isSave === "true") {

									MessageBox.show(
										oResponse.EFORM_NUM + " is saved successfully",
										MessageBox.Icon.SUCCESS,
										"Success"
									);
									e_form_num = oResponse.EFORM_NUM;
									setTimeout(that.approve_reject_button_dsp, 1000);
									eform_num = oResponse.EFORM_NUM;
									this.title = oResponse.EFORM_NUM;
									this.getOwnerComponent().getModel("headerUserModel").setProperty("/FORM_NUM", this.title);
									this.getOwnerComponent().getModel("headerUserModel").setProperty("/isData", true);
									var oBundle = this._component.getModel("i18n").getResourceBundle();
									var sText = oBundle.getText("Title", [oResponse.EFORM_NUM]);
									this.getView().byId("pageTitleId").setText(sText);
									this._component.getModel("headerUserModel").setProperty("/isEnableWithdraw", true);

									if (this._component.getModel("headerUserModel").getProperty("/STATUS") === "In Approval") {
										this._component.getModel("headerUserModel").setProperty("/isVisibleSubmit", false);
										this._component.getModel("headerUserModel").setProperty("/isVisibleWithdraw", true);
										//     this.getView().byId("b_approve").setVisible(true);
										//    this.getView().byId("b_reject").setVisible(true);
										if (window.top.location.href.toLowerCase().indexOf("fiorilaunchpad") == -1) {
											this.getView().byId("HOME").setVisible(true);
										}
									}

									//Begin of changes for Reject status for save scenario
									else if (this._component.getModel("headerUserModel").getProperty("/STATUS") === "Rejected") {

										this._component.getModel("headerUserModel").setProperty("/isVisibleSubmit", false);
										this._component.getModel("headerUserModel").setProperty("/isVisibleWithdraw", true);
										//      this.getView().byId("b_approve").setVisible(true);
										//     this.getView().byId("b_reject").setVisible(false);
										if (window.top.location.href.toLowerCase().indexOf("fiorilaunchpad") == -1) {
											// this.getView().byId("HOME").setVisible(true);
											this.getView().byId("HOME").setVisible(false);
										}

									}

									//End of changes for Reject status for save scenario
									else {
										//REQ0470877:NSONI3:GWDK901998:02/03/2020:CHANGE SUBMIT BUTTON VISIBILITY:START
										// this._component.getModel("headerUserModel").setProperty("/isVisibleSubmit", true);
										this._component.getModel("headerUserModel").setProperty("/isVisibleSubmit", isVisibleSubmitStatus);
										//REQ0470877:NSONI3:GWDK901998:02/03/2020:CHANGE SUBMIT BUTTON VISIBILITY:END
										this._component.getModel("headerUserModel").setProperty("/isVisibleWithdraw", false);
										//     this.getView().byId("b_approve").setVisible(false);
										//    this.getView().byId("b_reject").setVisible(false);
										this.getView().byId("HOME").setVisible(false);
									}

									this._component.getModel("headerUserModel").setProperty("/REQUEST_DATE", oResponse.REQUEST_DATE);
									this._component.getModel("headerUserModel").setProperty("/COMMENTS_ENABLED", true);
									this.title = oResponse.EFORM_NUM;
									this.getApprovers(oResponse.EFORM_NUM);
									this.REQUEST_DATE = oResponse.REQUEST_DATE;
								} else if (isSave === "false") {
									this._component.getModel("headerUserModel").setProperty("/isEnableSave", true);
									this._component.getModel("headerUserModel").setProperty("/isEnableSubmit", false);
									this._component.getModel("headerUserModel").setProperty("/isEnableWithdraw", true);
									this._component.getModel("headerUserModel").setProperty("/COMMENTS_ENABLED", false);

									this._component.getModel("headerUserModel").setProperty("/isVisibleSubmit", false);
									this._component.getModel("headerUserModel").setProperty("/isVisibleWithdraw", true);
									//      this.getView().byId("b_approve").setVisible(true);
									//     this.getView().byId("b_reject").setVisible(true);
									if (window.top.location.href.toLowerCase().indexOf("fiorilaunchpad") == -1) {
										// this.getView().byId("HOME").setVisible(true);
										this.getView().byId("HOME").setVisible(false);
									}

									this.title = oResponse.EFORM_NUM;
									var oBundle = this._component.getModel("i18n").getResourceBundle();
									var sText = oBundle.getText("Title", [oResponse.EFORM_NUM]);
									this.getView().byId("pageTitleId").setText(sText);
									this.getOwnerComponent().getModel("headerUserModel").setProperty("/FORM_NUM", this.title);
									this.getOwnerComponent().getModel("headerUserModel").setProperty("/isData", true);

									this.getApprovers(oResponse.EFORM_NUM);
									MessageBox.show(
										oResponse.EFORM_NUM + " is submitted successfully.",
										MessageBox.Icon.SUCCESS,
										"Success"
									);
									e_form_num = oResponse.EFORM_NUM;
									setTimeout(that.approve_reject_button_dsp, 1000);
									eform_num = oResponse.EFORM_NUM;
									this.getOwnerComponent().getModel("headerUserModel").setProperty("/STATUS", oResponse.STATUS);

								} else {

									this.getApprovers(oResponse.EFORM_NUM);
									MessageBox.show(
										oResponse.EFORM_NUM + " is withdrawn successfully.",
										MessageBox.Icon.SUCCESS,
										"Success"
									);
									e_form_num = oResponse.EFORM_NUM;
									setTimeout(that.approve_reject_button_dsp, 1000);
									this.getOwnerComponent().getModel("headerUserModel").setProperty("/STATUS", oResponse.STATUS);
									tittle = oResponse.EFORM_NUM;
									sTittle = tittle;
									this._component.getModel("headerUserModel").setProperty("/isEnable", true);
									this._component.getModel("headerUserModel").setProperty("/isEnableSave", true);
									this._component.getModel("headerUserModel").setProperty("/isEnableSubmit", true);
									this._component.getModel("headerUserModel").setProperty("/isEnableWithdraw", false);
									this._component.getModel("headerUserModel").setProperty("/COMMENTS_ENABLED", true);
									//REQ0470877:NSONI3:GWDK901998:02/03/2020:CHANGE SUBMIT BUTTON VISIBILITY:START
									// this._component.getModel("headerUserModel").setProperty("/isVisibleSubmit", true);
									this._component.getModel("headerUserModel").setProperty("/isVisibleSubmit", isVisibleSubmitStatus);
									//REQ0470877:NSONI3:GWDK901998:02/03/2020:CHANGE SUBMIT BUTTON VISIBILITY:END

									this._component.getModel("headerUserModel").setProperty("/isVisibleWithdraw", false);
									//      this.getView().byId("b_approve").setVisible(false);
									//     this.getView().byId("b_reject").setVisible(false);
									this.getView().byId("HOME").setVisible(false);
									this._component.getModel("headerUserModel").setProperty("/Stauts", oResponse.STATUS);
								}
								this._component.getModel("headerUserModel").setProperty("/Status", oResponse.STATUS);
								oSaveFormDeferred.resolve();
							}.bind(this),
							error: function (oError) {
								var msg = JSON.parse(oError.response.body).error.message.value;
								//MessageToast.show(msg);
								MessageBox.show(
									msg,
									MessageBox.Icon.ERROR,
									"Error"
								);

							}
						}, this);
					this.setTitle = tittle;

				}
			}
		},
		/**
		 * Calculates and returns the payload for the save service request
		 * @return {array} array of Form objects as payload
		 */
		_getFormEditPayload: function (isSave, sForm_Id) {
			var aUpdatedForms = [];
			if (sForm_Id === undefined) {
				sForm_Id = "";
			} else {
				sForm_Id = sForm_Id;
			}
			var Array2 = this._component.getModel("headerUserModel").getData();
			var oLocalModel = [Array2];
			var newUpdatedEntries = [];
			var oFormItem = {};
			//var oApproverTableData = this._component.getModel("headerUserModel").getProperty("/Approvers");
			if (isSave === "true") {
				if (this._component.getModel("headerUserModel").getProperty("/STATUS") === "In Approval") {
					oFormItem.STATUS = "In Approval";
					oFormItem.ACTION = "Save";

				}

				// Begin of change for Rejected Status while save scenario
				else if (this._component.getModel("headerUserModel").getProperty("/STATUS") === "Rejected") {
					oFormItem.STATUS = "Rejected";
					oFormItem.ACTION = "Save";
				}
				// End of change for Rejected Status while save scenario
				else {
					oFormItem.STATUS = "Data Saved";
				}

			} else if (isSave === "false") {
				oFormItem.STATUS = "In Approval";
				oFormItem.ACTION = "Submit";

			} else if (isSave === "Withdraw") {
				oFormItem.STATUS = "Withdrawn";
			}
			var date = this._component.getModel("headerUserModel").getProperty("/DATE");
			if (date) {
				var aDate = date.split("/");
				var sDate = aDate[0] + aDate[1] + aDate[2];
			}
			if (oLocalModel) {
				oFormItem.LOB = this._component.getModel("headerUserModel").getProperty("/LOB");
				oFormItem.EFORM_NUM = sForm_Id;
				oFormItem.DESCRIPTION = this._component.getModel("headerUserModel").getProperty("/Des");
				oFormItem.TITLE = this._component.getModel("headerUserModel").getProperty("/TITLE");
				if (oFormItem.TITLE) {
					oFormItem.TITLE2 = this._component.getModel("headerUserModel").getProperty("/TITLE").toUpperCase();
				}
				oFormItem.SUB_LOB = this._component.getModel("headerUserModel").getProperty("/SLOB");
				oFormItem.ACTIVITY = this._component.getModel("headerUserModel").getProperty("/ACTIVITY");
				//  REQ0470877:RMANDAL:GWDK901935:10/23/2019:Passing User Id:START
				oFormItem.ON_BEHALF_OF_ID = this._component.getModel("headerUserModel").getProperty("/ONBEHALFOFID");
				oFormItem.PREPARER_ID = this._component.getModel("headerUserModel").getProperty("/PREPARERID");
				// REQ0470877:RMANDAL:GWDK901935:10/23/2019:Passing User Id:END
				oFormItem.ON_BEHALF_OF = this._component.getModel("headerUserModel").getProperty("/ONBEHALFOF");
				oFormItem.PREPARER = this._component.getModel("headerUserModel").getProperty("/PREPARER");
				oFormItem.REQ_TITLE = this._component.getModel("headerUserModel").getProperty("/REQ_TITLE");
				oFormItem.LOCATION = this._component.getModel("headerUserModel").getProperty("/LOCATION");
				oFormItem.COUNTRY = this._component.getModel("headerUserModel").getProperty("/RES_COUNTRY");
				oFormItem.COUNTRY_ACTIVITY = this._component.getModel("headerUserModel").getProperty("/REC_COUNTRY");

				oFormItem.EMAIL = this._component.getModel("headerUserModel").getProperty("/REQ_EMAIL");
				oFormItem.PHONE_NUM = this._component.getModel("headerUserModel").getProperty("/PHONE_NUM");
				oFormItem.RADOIVALUE1 = this._component.getModel("headerUserModel").getProperty("/VALUE1");
				if (this._component.getModel("headerUserModel").getProperty("/selectedIndex_Exp") === 0) {

					oFormItem.IS_AMOUNT = this._component.getModel("headerUserModel").getProperty("/VALUE2");
					oFormItem.IS_PAYMENT_1 = this._component.getModel("headerUserModel").getProperty("/VALUE3");
					oFormItem.IS_PAYMENT_2 = this._component.getModel("headerUserModel").getProperty("/VALUE4");
					oFormItem.IS_ACTION = this._component.getModel("headerUserModel").getProperty("/VALUE5");
					oFormItem.IS_CONFIRMED = this._component.getModel("headerUserModel").getProperty("/VALUE6");
					oFormItem.IS_VERIFIED = this._component.getModel("headerUserModel").getProperty("/VALUE7");
				} else {
					oFormItem.IS_AMOUNT = "";
					oFormItem.IS_PAYMENT_1 = "";
					oFormItem.IS_PAYMENT_2 = "";
					oFormItem.IS_ACTION = "";
					oFormItem.IS_CONFIRMED = "";
					oFormItem.IS_VERIFIED = "";
				}
				oFormItem.AMOUNT = this._component.getModel("headerUserModel").getProperty("/SummaryTotals_Value7");

				oFormItem.AMOUNT_EXPTYP6 = this._component.getModel("headerUserModel").getProperty("/SummaryTotals_Value6").split(",").join("");
				oFormItem.AMOUNT_EXPTYP5 = this._component.getModel("headerUserModel").getProperty("/SummaryTotals_Value5").split(",").join("");
				oFormItem.AMOUNT_EXPTYP4 = this._component.getModel("headerUserModel").getProperty("/SummaryTotals_Value4").split(",").join("");
				oFormItem.AMOUNT_EXPTYP3 = this._component.getModel("headerUserModel").getProperty("/SummaryTotals_Value3").split(",").join("");
				oFormItem.AMOUNT_EXPTYP2 = this._component.getModel("headerUserModel").getProperty("/SummaryTotals_Value2").split(",").join("");
				oFormItem.AMOUNT_EXPTYP1 = this._component.getModel("headerUserModel").getProperty("/SummaryTotals_Value1").split(",").join("");
				oFormItem.AMOUNT = this._component.getModel("headerUserModel").getProperty("/SummaryTotals_Value7").split(",").join("");

				var index1;
				var index2;
				index1 = oFormItem.AMOUNT_EXPTYP6.indexOf("$");
				index2 = oFormItem.AMOUNT_EXPTYP6.indexOf(" USD");
				if (index1 !== -1 || index2 !== -1) {
					oFormItem.AMOUNT_EXPTYP6 = oFormItem.AMOUNT_EXPTYP6.substr(index1 + 1, index2 - 1);
				}

				index1 = oFormItem.AMOUNT_EXPTYP5.indexOf("$");
				index2 = oFormItem.AMOUNT_EXPTYP5.indexOf(" USD");
				if (index1 !== -1 || index2 !== -1) {
					oFormItem.AMOUNT_EXPTYP5 = oFormItem.AMOUNT_EXPTYP5.substr(index1 + 1, index2 - 1);
				}

				index1 = oFormItem.AMOUNT_EXPTYP4.indexOf("$");
				index2 = oFormItem.AMOUNT_EXPTYP4.indexOf(" USD");
				if (index1 !== -1 || index2 !== -1) {
					oFormItem.AMOUNT_EXPTYP4 = oFormItem.AMOUNT_EXPTYP4.substr(index1 + 1, index2 - 1);
				}

				index1 = oFormItem.AMOUNT_EXPTYP3.indexOf("$");
				index2 = oFormItem.AMOUNT_EXPTYP3.indexOf(" USD");
				if (index1 !== -1 || index2 !== -1) {
					oFormItem.AMOUNT_EXPTYP3 = oFormItem.AMOUNT_EXPTYP3.substr(index1 + 1, index2 - 1);
				}

				index1 = oFormItem.AMOUNT_EXPTYP2.indexOf("$");
				index2 = oFormItem.AMOUNT_EXPTYP2.indexOf(" USD");
				if (index1 !== -1 || index2 !== -1) {
					oFormItem.AMOUNT_EXPTYP2 = oFormItem.AMOUNT_EXPTYP2.substr(index1 + 1, index2 - 1);
				}

				index1 = oFormItem.AMOUNT_EXPTYP1.indexOf("$");
				index2 = oFormItem.AMOUNT_EXPTYP1.indexOf(" USD");
				if (index1 !== -1 || index2 !== -1) {
					oFormItem.AMOUNT_EXPTYP1 = oFormItem.AMOUNT_EXPTYP1.substr(index1 + 1, index2 - 1);
				}

				index1 = oFormItem.AMOUNT.indexOf("$");
				index2 = oFormItem.AMOUNT.indexOf(" USD");
				if (index1 !== -1 || index2 !== -1) {
					oFormItem.AMOUNT = oFormItem.AMOUNT.substr(index1 + 1, index2 - 1);
				}

				oFormItem.ACTIVITY = this._component.getModel("headerUserModel").getProperty("/Activity");
				oFormItem.LOC_ACTIVITY = this._component.getModel("headerUserModel").getProperty("/Loc_act");
				oFormItem.BUSS_DES = this._component.getModel("headerUserModel").getProperty("/buss_des");

				if (this._component.getModel("headerUserModel").getProperty("/selectedIndex_SPE") === 0) {
					oFormItem.LIST_EMP = this._component.getModel("headerUserModel").getProperty("/SPE_List");
				} else {
					oFormItem.LIST_EMP = "";
				}
				oFormItem.ARE_ANY_REC = this._component.getModel("headerUserModel").getProperty("/Is_SPE");

				oFormItem.IS_EMERGENCY = this._component.getModel("headerUserModel").getProperty("/Is_Exp");

				if ((this._component.getModel("headerUserModel").getProperty("/REQUEST_DATE") !== undefined) &&
					(this._component.getModel("headerUserModel").getProperty("/REQUEST_DATE") !== "")) {

					var requestDate = this._component.getModel("headerUserModel").getProperty("/REQUEST_DATE");
					var arr = requestDate.split("/");

					this.REQUEST_DATE = arr[2] + arr[0] + arr[1];

				} else {
					var date = new Date();
					var month = (date.getUTCMonth() + 1).toString();
					var day = date.getUTCDate().toString();
					if ((date.getUTCMonth() + 1).toString().length === 1) {
						month = "0" + month;
					}
					if (date.getUTCDate().toString().length === 1) {
						day = "0" + day;
					}

					this.REQUEST_DATE = date.getUTCFullYear().toString() + month + day;

					//oFormItem.REQUEST_DATE = this.REQUEST_DATE;
				}

				oFormItem.eGovernmentItemSet = [];
				oFormItem.ApproverSet = [];
				var oApprovers = this._component.getModel("oApproverModel").getData();
				for (var i = 0; i < oApprovers.length; i++) {
					var D = {};
					D.EFORM_NUM = this.title;
					D.ORGLEVEL = "";
					D.SEQUENCE = String(i + 1);
					if (oApprovers[i].APPROVED === "Approved") {
						D.APPROVED = "X";
					} else if (oApprovers[i].APPROVED === "Rejected") {
						D.APPROVED = "R";
					} else {
						D.APPROVED = "";
					}
					D.REVIEWER_TYPE = oApprovers[i].REVIEWER_TYPE;
					D.APPROVED_BY = oApprovers[i].APPROVED_BY;
					D.APPROVAL_DT = oApprovers[i].APPROVAL_DT;
					D.APPROVAL_TM = oApprovers[i].APPROVAL_TM;
					D.ADDED_BY = oApprovers[i].ADDED_BY;
					D.APPROVER_TYPE = oApprovers[i].APPROVER_TYPE;
					D.CREATION_DT = oApprovers[i].CREATION_DT;
					if (oApprovers[i].MANUAL === true) {
						D.MANUAL = "X";
					} else {
						D.MANUAL = "";
					}
					D.APPR = oApprovers[i].APPR;
					//  REQ0470877:RMANDAL:GWDK901935:11/06/2019:Passing User Id:START
					D.APPR_ID = oApprovers[i].APPR_ID;
					D.ADDED_BY_ID = oApprovers[i].ADDED_BY_ID;
					D.APPROVED_BY_ID = oApprovers[i].APPROVED_BY_ID;
					//  REQ0470877:RMANDAL:GWDK901935:11/06/2019:Passing User Id:END
					if (D.APPR != "") {
						oFormItem.ApproverSet[i] = D;
					}
				}

				var aItems = this.getOwnerComponent().getModel("repTableModel").getData();

				for (var i = 0; i < aItems.length; i++) {
					var item = {};
					item.EFORM_NUM = this.title;

					item.RECIPIENT_FIRST_NAME = aItems[i].Recipient.RECIPIENT_FIRST_NAME;
					item.RECIPIENT_LAST_NAME = aItems[i].Recipient.RECIPIENT_LAST_NAME;
					item.RECIPIENT_TITLE = aItems[i].Recipient.RECIPIENT_TITLE;
					item.RECIPIENT_ADDRESS = aItems[i].Recipient.RECIPIENT_ADD;
					item.REC_CITY = aItems[i].Recipient.RECIPIENT_CITY;
					item.REC_STATE = aItems[i].Recipient.RECIPIENT_STATE;
					item.REC_POSTAL_CODE = aItems[i].Recipient.RECIPIENT_PC;
					item.REC_COUNTRY = aItems[i].Recipient.RECIPIENT_COUNTRY;
					item.RECI_BUSSI = aItems[i].Recipient.RECI_BUSSI;
					item.ORG_BUSSI = aItems[i].Organisation.ORG_BUSSI;
					item.IS_REL_IND = aItems[i].Recipient.IS_REL_IND;
					// item.IS_REL_GOV = aItems[i].Recipient.IS_REL_GOV;
					item.REC_OTHER_REL = aItems[i].Recipient.RECIPIENT_OTHER_RELATION;
					if (aItems[i].Recipient.Res_sel1 === 0) {
						aItems[i].Recipient.Res_sel1 = "Yes";
					} else if (aItems[i].Recipient.Res_sel1 === 1) {
						aItems[i].Recipient.Res_sel1 = "No";
					}
					// item.IS_REL_GOV = aItems[i].Recipient.Res_sel1;
					if (aItems[i].Recipient.Res_sel2 === 0) {
						aItems[i].Recipient.Res_sel2 = "Yes"
					} else if (aItems[i].Recipient.Res_sel2 === 1) {
						aItems[i].Recipient.Res_sel2 = "No"
					}

					if (aItems[i].Recipient.Res_sel3 === 0) {
						aItems[i].Recipient.Res_sel3 = "Yes"
					} else if (aItems[i].Recipient.Res_sel3 === 1) {
						aItems[i].Recipient.Res_sel3 = "No"
					}

					//item.IS_REL_GOV = aItems[i].Recipient.Res_sel3;
					item.RECI_EXPLANATION = aItems[i].Recipient.form_Justification2;
					item.RECI_DESCRIBE_REL = aItems[i].Recipient.form_Justification1;
					item.RECI_EXPL_PENDING = aItems[i].Recipient.form_Justification3;

					item.RECI_REL = aItems[i].Recipient.Res_sel1;
					item.IS_REL_GOV = aItems[i].Recipient.Res_sel2;
					item.RECI_IS_PENDING = aItems[i].Recipient.Res_sel3;

					item.RECIPIENT_ORG = aItems[i].Organisation.RECIPIENT_ORG;
					item.ORG_TYPE = aItems[i].Organisation.ORG_TYPE;
					item.ORG_ADDRESS = aItems[i].Organisation.ORG_ADDRESS;
					item.CITY = aItems[i].Organisation.CITY;
					item.ORG_COUNTRY = aItems[i].Organisation.ORG_COUNTRY;
					item.ORG_STATE = aItems[i].Organisation.ORG_STATE;
					item.ORG_POSTAL_CODE = aItems[i].Organisation.ORG_POSTAL_CODE;
					item.EXP_TYPE = aItems[i].Expense.EXP_TYPE;
					item.EXP_DES = aItems[i].Expense.EXP_DES;
					item.DATE_OF_EXP = aItems[i].Expense.DATE_OF_EXP;
					if (aItems[i].Expense.REQ_AMT_EXP !== undefined) {
						if (isNaN(aItems[i].Expense.REQ_AMT_EXP)) {
							var indexOfComma = aItems[i].Expense.REQ_AMT_EXP.indexOf(",");
							if (indexOfComma !== -1) {
								aItems[i].Expense.REQ_AMT_EXP = aItems[i].Expense.REQ_AMT_EXP.split(",").join("");
								//aItems[i].Expense.REQ_AMT_EXP = parseFloat(aItems[i].Expense.REQ_AMT_EXP);
								item.REQ_AMT_EXP = aItems[i].Expense.REQ_AMT_EXP;
							}
						} else {
							item.REQ_AMT_EXP = aItems[i].Expense.REQ_AMT_EXP;
						}
					}
					if (aItems[i].Expense.REQ_AMT_EXP_USD !== undefined) {
						if (isNaN(aItems[i].Expense.REQ_AMT_EXP_USD)) {
							var indexOfComma = aItems[i].Expense.REQ_AMT_EXP_USD.indexOf(",");
							if (indexOfComma !== -1) {
								aItems[i].Expense.REQ_AMT_EXP_USD = aItems[i].Expense.REQ_AMT_EXP_USD.split(",").join("");
								//aItems[i].Expense.REQ_AMT_EXP_USD = parseFloat(aItems[i].Expense.REQ_AMT_EXP_USD);
								item.REQ_AMT_EXP_USD = aItems[i].Expense.REQ_AMT_EXP_USD;
							}
						} else {
							item.REQ_AMT_EXP_USD = aItems[i].Expense.REQ_AMT_EXP_USD;
						}
					}

					item.COMPANY_CODE = aItems[i].Expense.COMPANY_CODE;
					item.EXP_SUBTYPE = aItems[i].Expense.EXP_SUBCAT;
					item.PAYMENT_METHOD = aItems[i].Expense.PAYMENT_METHOD;
					item.GEN_LEDGER_AREA = aItems[i].Expense.GEN_LEDGER_AREA;
					item.GEN_LEDGER = aItems[i].Expense.GEN_LEDGER;
					item.LOCALCURRENCY = aItems[i].Expense.LOCALCURRENCY;
					item.IS_HOL = aItems[i].Expense.IS_TRAVEL;
					item.IS_EXPENSE = aItems[i].Expense.IS_Expense;
					item.TRAVEL_EXPENSE = aItems[i].Expense.TRAVEL_EXPENSE;
					item.OTHERTRAVEL_EXP = aItems[i].Expense.OTHERTRAVEL_EXP;
					item.TRAVELORGIN_EXP = aItems[i].Expense.TravelOrgin_EXP;
					item.TRAVELDEST_EXP = aItems[i].Expense.TravelDest_EXP;
					item.HOTELNAME_EXP = aItems[i].Expense.HotelName_EXP;
					item.HOTELCITY_EXP = aItems[i].Expense.HotelCity_EXP;

					oFormItem.eGovernmentItemSet[i] = item;
				}

				var count = 0;
				return oFormItem;
			}

		},

		deleteAapprover: function (oEvent) {
			//This code was generated by the layout editor.
			var oParent = oEvent.getSource().getParent();
			var oPar_Parent = oParent.getParent().sId;
			var oTableId = sap.ui.getCore().byId(oPar_Parent);
			var selected_item = oTableId.getSelectedItem();
			var array = this.getView().getModel("oApproverModel").getData();
			var array2 = [];

			//deleting mannually added items

			var sContext = selected_item.getBindingContextPath();

			var isApproved = this.getView().getModel("oApproverModel").getProperty(sContext + "/APPROVED");
			var isManual = this.getView().getModel("oApproverModel").getProperty(sContext + "/MANUAL");

			//REQ0470877:RMANDAL:GWDK901935:11/06/2019:Validation to validate if logged in user can delete watcher/approver:START
			var sCurrentUserId = sap.ushell.Container.getUser().getId(),
				sAddedById = this.getView().getModel("oApproverModel").getProperty(sContext + "/ADDED_BY_ID");

			if (sCurrentUserId !== sAddedById) {
				MessageToast.show("You cannot delete approver/watcher");
				return;
			}
			//REQ0470877:RMANDAL:GWDK901935:11/06/2019:Validation to validate if logged in user can delete watcher/approver:END

			if (isApproved === "Approved" && isManual === true) {
				MessageBox.show("You cannot delete the approver since it is already approved ");
			} else if (isApproved === "" && isManual === true) {
				array2 = array.splice(sContext.substr(1), 1);
				this.getView().getModel("oApproverModel").setData(array);
			}

		},
		onClearComment: function (oEvent) {
			this.getView().getModel("headerUserModel").setProperty("/COMMENTS", "");
		},
		saveComments: function (oEvent) {
			this.saveComments();
		},

		handleValueChange: function (oEvent) {
			this.file_size = oEvent.getParameter("files")[0].size;
			this.file_size = (this.file_size / 1024);
			this.oFileUploaderId = oEvent.getParameter("id");
		},
		handleUploadPress: function (oEvent) {
			var oFileUploader = sap.ui.getCore().byId(this.oFileUploaderId);
			var oFileData = this.getView().getModel("headerUserModel").getProperty("/FILE");
			if (!oFileData) {
				MessageBox.show("Please select the file", {
					title: "Alert"
				});
				return;
			}
			if (this.title === undefined) {
				this.sTittle = "";
			} else {
				this.sTittle = this.sTittle;
			}
			var userModel = this.getOwnerComponent().getModel("oDataModel");
			var viewInstance = this.getView();
			if (this.getView().getModel("headerUserModel").getProperty("/FILE_NAME") == "") {
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
			headerParma2.setValue(this.getView().getModel("headerUserModel").getProperty("/FILE") + '|' + this.title + '|' + this.file_size +
				'|' + 'GEF');
			oFileUploader.insertHeaderParameter(headerParma2);
			headerParma3.setName('Content-Type');
			headerParma3.setValue('image/jpeg');
			oFileUploader.insertHeaderParameter(headerParma3);
			headerParma.setName('x-csrf-token');
			headerParma.setValue(csrf);
			oFileUploader.addHeaderParameter(headerParma);
			oFileUploader.upload();
		},
		getCollection: function () {
			var that = this;
			var model = this._component.getModel("oDataModel");
			var relPath = "/eFormAttachments";
			var that = this;
			var oFilter = new sap.ui.model.Filter(
				"EFORM_NUM",
				sap.ui.model.FilterOperator.EQ, this.title
			);
			this._serverModel.read(relPath, {
				filters: [oFilter],
				success: function (oData, response) {
					that._component.getModel("oCollectionModel").setData(oData.results);
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

		onhandleUploadComplete: function (oEvent) {
			var status = oEvent.getParameter("status");
			if (status === 201) {
				var sMsg = "Upload Success";
				oEvent.getSource().setValue("");
			} else {
				sMsg = "Upload Error";
			}
			var temp = oEvent.getParameter("response");
			var eform_number = temp.substr(temp.indexOf("EFORM_NUM='") + 11, 10);
			//this.sTittle = this.title();
			this.sTittle = eform_number;
			if (this.sTittle) {
				this.Form_Num = this.sTittle;
				this.title = this.sTittle;
				var oBundle = this._component.getModel("i18n").getResourceBundle();
				var sText = oBundle.getText("Title", [this.sTittle]);
				this.getView().byId("pageTitleId").setText(sText);
				var viewInstance = this.getView();
				viewInstance.setBusy(false);
				this.getCollection();
			}
		},

		onApproverTypeChange: function (oEvent) {
			var oParent = oEvent.getSource().getParent();
			var oPar_Parent = oParent.getParent().sId;
			var oTableId = sap.ui.getCore().byId(oPar_Parent);
			var selected_item = oTableId.getSelectedItem();
			if (selected_item === null) {
				MessageBox.show("Please select a approver");
			} else {
				var array = this.getView().getModel("oApproverModel").getData();
				var array2 = [];
				var sContext = selected_item.getBindingContextPath();
				var oParent = oEvent.getSource().getParent();
				var sReviewType = oParent.getAggregation("content")[3].getProperty("value");
				var sPosition = oParent.getAggregation("content")[5].getProperty("value");
				return [sReviewType, sPosition, sContext];
			}

		},
		saveComments: function (action, array) {
			var oComments = {};
			var that = this;
			var sAction = action;
			var count = 0;
			if (action === "Delete") {
				oComments.FORM_NO = this.title;
				oComments.COMMENTS = array[0].COMMENTS;
				oComments.SEQUENCE = array[0].SEQUENCE;
				oComments.CREATOR = "";
				oComments.CR_DATE = "";
				oComments.TIME = "";
				oComments.ACTION = "Delete";
				if (this.getView().getModel("headerUserModel").getProperty("/STATUS") === "Data Saved") {
					count = 1;
				} else {
					count = 0;
				}
			} else if (action === "Update") {

				oComments.FORM_NO = this.title;
				oComments.COMMENTS = array[0].COMMENTS;
				oComments.SEQUENCE = array[0].SEQUENCE;
				oComments.CREATOR = "";
				oComments.CR_DATE = "";
				oComments.TIME = "";
				if (this.getView().getModel("headerUserModel").getProperty("/STATUS") === "Data Saved") {
					count = 1;
				} else {
					count = 0;
				}
			} else {
				if (this._component.getModel("headerUserModel").getProperty("/COMMENTS")) {
					oComments.FORM_NO = this.title;
					oComments.COMMENTS = this._component.getModel("headerUserModel").getProperty("/COMMENTS");

					oComments.SEQUENCE = "";
					oComments.CREATOR = "";
					oComments.CR_DATE = "";
					oComments.TIME = "";
					count = 2;
				} else {
					MessageBox.show("Please enter the comment", {
						title: "Alert"
					});
					count = 0;
				}
			}
			if (count === 1) {
				this._serverModel.create("/eFormComments", oComments, {
					async: false,
					success: function (oData, response) {
						var eform_number = oData.FORM_NO;
						that.title = oData.FORM_NO;
						var msg1 = eform_number;
						var oBundle = that._component.getModel("i18n").getResourceBundle();
						var sText = oBundle.getText("Title", [eform_number]);
						that.getView().byId("pageTitleId").setText(sText);
						if (sAction === "Delete") {
							var msg = "Comments deleted successfully";
						} else if (sAction === "Update") {
							var msg = "Comments updated successfully";
						} else {
							var msg = "Comments saved successfully";
						}

						MessageBox.show(
							msg,
							MessageBox.Icon.SUCCESS,
							"Success"
						);
						that.onClearComment();
						sap.ui.core.BusyIndicator.hide();

						//var model = that._component.getModel("oDataModel");
						count = 0;
						that.getComments();
					}
				});
			}
			if (count === 2) {
				this._serverModel.create("/eFormComments", oComments, {
					async: false,
					success: function (oData, response) {
						var eform_number = oData.FORM_NO;
						that.title = oData.FORM_NO;
						var msg1 = eform_number;
						var oBundle = that._component.getModel("i18n").getResourceBundle();
						var sText = oBundle.getText("Title", [eform_number]);
						that.getView().byId("pageTitleId").setText(sText);

						var msg = "Comments saved successfully";

						MessageBox.show(
							msg,
							MessageBox.Icon.SUCCESS,
							"Success"
						);
						that.onClearComment();
						sap.ui.core.BusyIndicator.hide();

						//var model = that._component.getModel("oDataModel");
						count = 0;
						that.getComments();
					}
				});

			}
		},

		getComments: function () {
			var that = this;
			var oFilter = new Filter(
				"FORM_NO",
				FilterOperator.EQ, that.title
			);
			var relPath = "/eFormComments";
			that._serverModel.read(relPath, {
				filters: [oFilter],
				success: function (oData, response) {
					var oData = oData.results;
					that._component.getModel("oCommentsModel").setData(oData);
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

		//REQ0470877:RMANDAL:GWDK901935:11/06/2019:Adding new row in the approver flow table:START

		/*onAddApprovers: function (oEvent) {
			var aToolBarInfo = this.onApproverTypeChange(oEvent);

			if (aToolBarInfo.length > 0) {
				var aApprovers = this.getView().getModel("oApproverModel").getData();
				var newApprovers = [];

				if (aApprovers.length > 0) {
					aApprovers.forEach(function (curr) {
						newApprovers.push(curr);
					});

				}

				if (aToolBarInfo[1] === "After") {
					var index = parseFloat(aToolBarInfo[2].substr(1)) + 1;
					newApprovers.splice(index, 0, {
						APPROVED: false,
						APPR: "",
						REVIEWER_TYPE: aToolBarInfo[0],
						APPROVED_BY: "",
						APPROVAL_DT: "",
						APPROVAL_TM: "",
						MANUAL: true,
						ADDED_BY: this._component.getModel("headerUserModel").getProperty("/LoggedInUser"),
						CREATION_DT: ""
					});
				}
				if (aToolBarInfo[1] === "Before") {

					var index = parseFloat(aToolBarInfo[2].substr(1));
					if (newApprovers[index].APPROVED === true) {
						MessageBox.show("Manual Approvers/Watchers can not be added before an approved item.")
					} else {
						newApprovers.splice(index, 0, {
							APPROVED: false,
							APPR: "",
							REVIEWER_TYPE: aToolBarInfo[0],
							APPROVED_BY: "",
							APPROVAL_DT: "",
							APPROVAL_TM: "",
							MANUAL: true,
							ADDED_BY: this._component.getModel("headerUserModel").getProperty("/LoggedInUser"),
							CREATION_DT: ""
						});
					}
				}
				this.getView().getModel("oApproverModel").setData(newApprovers);
			}

		},
*/
		onAddApprovers: function (oEvent) {
			var oToolbar = oEvent.getSource().getParent(),
				oTable = oToolbar.getParent(),
				sItem = oTable.getSelectedItem(),
				sReviewType = oToolbar.getAggregation("content")[3].getProperty("value"),
				sPosition = oToolbar.getAggregation("content")[5].getProperty("value"),
				oTableModel = this.getOwnerComponent().getModel("oApproverModel"),
				oDataSet = oTableModel.getData();

			if (sItem) {
				var sIndex = oTable.getItems().indexOf(oTable.getSelectedItem()),
					aRows = oTable.getItems();

				if (oTableModel.getProperty(aRows[sIndex].getBindingContextPath()).APPROVED === "Approved") {
					MessageToast.show("Manual Approvers/Watchers can not be added before an approved item.");
				} else {
					sIndex = (sPosition === "Before") ? Number(sIndex) : Number(sIndex + 1);
					var sCurrentUserName = sap.ushell.Container.getUser().getFullName();
					var sCurrentUserId = sap.ushell.Container.getUser().getId();
					oDataSet.splice(sIndex, 0, {
						ADDED_BY: sCurrentUserName,
						ADDED_BY_ID: sCurrentUserId,
						APPR: "",
						APPROVAL_DT: "",
						APPROVAL_TM: "",
						APPROVED: "",
						APPROVED_BY: "",
						APPROVED_BY_ID: "",
						APPROVER_TYPE: "",
						APPR_ID: "",
						CREATION_DT: "",
						GRP: "",
						MANUAL: true,
						REVIEWER_TYPE: sReviewType,
						isAppEnabled: false,
						isInput: true
					});
					this.getView().getModel("oApproverModel").setData(oDataSet);
				}
			} else {
				MessageToast.show("Please select a approver");
			}
		},
		//REQ0470877:RMANDAL:GWDK901935:10/06/2019:Adding new row in the approver flow table:END

		deleteComment: function (oEvent) {
			var oParent = oEvent.getSource().getParent();
			var oPar_Parent = oParent.getParent().sId;
			var oTableId = sap.ui.getCore().byId(oPar_Parent);
			var selected_item = oTableId.getSelectedItem();
			var array = this.getView().getModel("oCommentsModel").getData();
			var array2 = [];

			//deleting mannually added items

			var sContext = selected_item.getBindingContextPath()

			var array2 = array.splice(sContext.substr(1), 1);

			//this.getView().getModel("oCommentsModel").setData(array);
			this.saveComments("Delete", array2);
		},

		updateComment: function (oEvent) {
			var oParent = oEvent.getSource().getParent();
			var oPar_Parent = oParent.getParent().sId;
			var oTableId = sap.ui.getCore().byId(oPar_Parent);
			var selected_item = oTableId.getSelectedItem();
			var array = this.getView().getModel("oCommentsModel").getData();
			var array2 = [];

			//deleting mannually added items

			var sContext = selected_item.getBindingContextPath()

			var array2 = array.splice(sContext.substr(1), 1);

			this.saveComments("Update", array2);
		},

		attachmentDate: function (value) {
			if (value !== (undefined || "")) {
				var date = new Date(value);
				var month = date.getUTCMonth() + 1;
				var str = value.split("/");
				var str1 = str.splice(0, 1);
				var str2 = str.splice(0, 0, month);
				var str2 = str[0] + "/" + str[1] + "/" + str[2];
				return str2;
			}
		},
		deleteAttachment: function (array2, array, finalArr) {
			var sLoggedInUser = this._component.getModel("headerUserModel").getProperty("/LoggedInUser");
			var filename = array2[0].FILE_NAME;
			if (filename !== "") {

				if (
					(this._component.getModel("headerUserModel").getProperty("/PREPARER") === sLoggedInUser) ||
					(this._component.getModel("headerUserModel").getProperty("/ONBEHALOF") === sLoggedInUser)
				) {

					var that = this;
					this._serverModel.read("/eFormAttachments(EFORM_NUM='" + this.title + "'" + ",FILE_NAME='" + array2[0].FILE_NAME + "')", {

						success: function (oData, response) {
							if (array.length == 0) {
								array[0] = {};
							}

							that._component.getModel("oCollectionModel").setData(array);
							//MessageToast.alert("Attachment deleted successfully.");
							MessageBox.show(
								"Attachment deleted successfully.",
								MessageBox.Icon.SUCCESS,
								"Success"
							);

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
				} else if (sLoggedInUser === array2[0].CREATED_BY) {

					var that = this;
					this._serverModel.read("/eFormAttachments(EFORM_NUM='" + this.title + "'" + ",FILE_NAME='" + array2[0].FILE_NAME + "')", {

						success: function (oData, response) {
							if (array.length == 0) {
								array[0] = {};
							}

							that._component.getModel("oCollectionModel").setData(array);
							//MessageToast.alert("Attachment deleted successfully.");
							MessageBox.show(
								"Attachment deleted successfully.",
								MessageBox.Icon.SUCCESS,
								"Success"
							);

						},

						error: function (oError) {
							var response = JSON.parse(oError.responseText);
							MessageBox.show(
								response.error.message.value,
								MessageBox.Icon.ERROR,
								"Error"
							);
							sap.ui.core.BusyIndicator.hide();
							//Begin of code for attachment delete
							that._component.getModel("oCollectionModel").setData(finalArr);
							//End of code for attachemnt delete
						}
					});

				} else {

					//Begin of code for attachment delete
					this._component.getModel("oCollectionModel").setData(finalArr);
					//End of code for attachemnt delete

					MessageBox.show("You cannot delete this attachment.",
						MessageBox.Icon.ERROR,
						"Error"
					);

				}
			}
		},

		onExit: function () {

			this.title = "";

			var oReciTab = this.byId("tblRecipient");
			var oReciTab1 = this.byId("tblRecipient1");

			oReciTab.destroyItems();
			oReciTab1.destroyItems();

			this._component.getModel("headerUserModel").setData({});

			this.getView().getModel("oApproverModel").setData({});
			this.getView().getModel("oCollectionModel").setData({});
			this.getView().getModel("oCommentsModel").setData({});
		},

		onDeleteAttachment: function (oEvent) {
			var oParent = oEvent.getSource().getParent();
			var oPar_Parent = oParent.getParent().sId;
			var oTableId = sap.ui.getCore().byId(oPar_Parent);
			var selected_item = oTableId.getSelectedItem();
			var array = this.getView().getModel("oCollectionModel").getData();
			var array2 = [];

			//Begin of code for attachment delete

			var finalArr = [];

			$.each(array, function (index, value) {

				var oTemp = {
					CREATED_BY: value.CREATED_BY,

					CREATION_DT: value.CREATION_DT,

					CREATION_TIME: value.CREATION_TIME,

					EFORM_NUM: value.EFORM_NUM,

					FILE_NAME: value.FILE_NAME,

					FILE_SIZE: value.FILE_SIZE,

					FORMNAME: value.FORMNAME,

					MIME_TYPE: value.MIME_TYPE

				}

				finalArr.push(value);

			});

			//End of code for attachment delete

			var sContext = selected_item.getBindingContextPath();

			var array2 = array.splice(sContext.substr(1), 1);

			//Begin of code for attachment delete

			this.deleteAttachment(array2, array, finalArr);

			//End of code for attachment delete
			// commented for delete attachment/uncomment it       this.deleteAttachment(array2,array);
		},

		//REQ0470877:RMANDAL:GWDK901935:11/04/2019:Display Employees of groups:START
		_displayEmployees: function (oEvent) {
				var oEventHandler = oEvent;
				var that = this;
				var sDept = oEvent.getSource().getText();
				var oFilterFormType = new sap.ui.model.Filter("FormTyp", sap.ui.model.FilterOperator.EQ, "GEF");
				var oFilterRole = new sap.ui.model.Filter("Role", sap.ui.model.FilterOperator.EQ, sDept);
				this.getOwnerComponent().getModel("oDataModel").read("/YFPSFICDS00017_GROUPSet", {
					async: false,
					filters: [oFilterFormType, oFilterRole],
					success: function (oData, oResponse) {
						if (!that._oPopover) {
							that._oPopover = sap.ui.xmlfragment("com.sap.build.standard.governmentApp.fragments.employee", that);
							that.getView().addDependent(that._oPopover);
						}
						that._oPopover.setModel(new sap.ui.model.json.JSONModel(oData));
						that._oPopover.openBy(oEventHandler.getSource());
					},
					error: function (oError) {
						sap.m.MessageBox.show(oError.message, {
							icon: MessageBox.Icon.ERROR,
							title: "Error"
						});
					}
				}).bind(this);
			}
			//REQ0470877:RMANDAL:GWDK901935:11/04/2019:Display Employees of groups:END
	});
}, /* bExport= */ true);