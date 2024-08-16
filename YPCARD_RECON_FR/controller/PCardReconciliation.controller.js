sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sony/pcard/reconciliation/appYPCardReconciliation/model/ReconciliationModel",
	"sap/ui/model/Filter",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/model/FilterOperator"
], function (Controller, ReconciliationModel, Filter, MessageToast, MessageBox, FilterOperator) {
	"use strict";
	var e_form_num;
	return Controller.extend("sony.pcard.reconciliation.appYPCardReconciliation.controller.PCardReconciliation", {
		onInit: function () {

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this._component = this.getOwnerComponent();
			this._oView = this.getView();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.odataModel = this._component.getModel("odataModel");
			ReconciliationModel.initialize(this._component, this._oView, this.odataModel, this);

			this.view = this.getView();
			this.radioButton1 = "";
			this.radioButton2 = "";
			this.radioButton3 = "";
			this.radioButton4 = "";
			this.radioButton5 = "";
			this.radioButton6 = "";
			this.edit = false;

			// this.getOwnerComponent().getModel("DisplayModel").setProperty("/Readonly", true);

			oRouter.attachRouteMatched(this._onObjectMatched, this);
			//this._getCurrencies();

		},

		navigate_inbox: function () {
			// window.open("/sap/bc/ui5_ui5/ui2/ushell/shells/abap/Fiorilaunchpad.html", "_self");
			window.open("/sap/bc/ui2/flp", "_self");
			window.close();
		},

		approve_eform: function (value) {
			var msg_returned = "";

			var sValue = jQuery.sap.getUriParameters().get("SOURCE");
			if (sValue == "DUMMY") {
				var sDialogName = "Dialog13";
				window.eform_num_inbox = this.sTittle;
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
						viewName: "sony.pcard.reconciliation.appYPCardReconciliation.view." + sDialogName
					});
					this.getView().addDependent(oView);
					oView.getController().setRouter(this.oRouter);
					oView.getController().setValueObject(this.sTittle);
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
				var eform_num = this.sTittle;
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

				//REQ0574233:NSONI3:GWDK902073:05/25/2020:PCR changes related to checklist:START
				var selectedIndex5 = this.getOwnerComponent().getModel("headerUserModel").getProperty("/selectedIndex5") === true ? "Y" : "N";
				var selectedIndex6 = this.getOwnerComponent().getModel("headerUserModel").getProperty("/selectedIndex6") === 0 ? "Yes" : "No";
				var justificationText = this.getOwnerComponent().getModel("headerUserModel").getProperty("/JUS_ANY_UNUSUAL");
				var oFilter3 = new sap.ui.model.Filter(
					"USER_CHECK",
					sap.ui.model.FilterOperator.EQ, selectedIndex5
				);
				var oFilter4 = new sap.ui.model.Filter(
					"IS_UNSUAL_ACT",
					sap.ui.model.FilterOperator.EQ, selectedIndex6
				);
				var oFilter5 = new sap.ui.model.Filter(
					"JUS_ANY_UNUSUAL",
					sap.ui.model.FilterOperator.EQ, justificationText
				);
				aFilter.push(oFilter3);
				aFilter.push(oFilter4);
				aFilter.push(oFilter5);
				if (this.getOwnerComponent().getModel("headerUserModel").getProperty("/selectedIndex5S") === true) {
					var selectedIndex5S = this.getOwnerComponent().getModel("headerUserModel").getProperty("/selectedIndex5S") === true ? "Y" : "N";
					var selectedIndex6S = this.getOwnerComponent().getModel("headerUserModel").getProperty("/selectedIndex6S") === 0 ? "Yes" : "No";
					var JUS_ANY_UNUSUAL_S = this.getOwnerComponent().getModel("headerUserModel").getProperty("/JUS_ANY_UNUSUAL_S");
					var oFilter6 = new sap.ui.model.Filter(
						"USER_CHECK_S",
						sap.ui.model.FilterOperator.EQ, selectedIndex5S
					);
					var oFilter7 = new sap.ui.model.Filter(
						"IS_UNSUAL_ACT_S",
						sap.ui.model.FilterOperator.EQ, selectedIndex6S
					);
					var oFilter8 = new sap.ui.model.Filter(
						"JUS_ANY_UNUSUAL_S",
						sap.ui.model.FilterOperator.EQ, JUS_ANY_UNUSUAL_S
					);
					aFilter.push(oFilter6);
					aFilter.push(oFilter7);
					aFilter.push(oFilter8);
				}
				if (this.getOwnerComponent().getModel("headerUserModel").getProperty("/selectedIndex5F") === true) {
					var selectedIndex5F = this.getOwnerComponent().getModel("headerUserModel").getProperty("/selectedIndex5F") === true ? "Y" : "N";
					var selectedIndex6F = this.getOwnerComponent().getModel("headerUserModel").getProperty("/selectedIndex6F") === 0 ? "Yes" : "No";
					var JUS_ANY_UNUSUAL_F = this.getOwnerComponent().getModel("headerUserModel").getProperty("/JUS_ANY_UNUSUAL_F");
					var oFilter9 = new sap.ui.model.Filter(
						"USER_CHECK_F",
						sap.ui.model.FilterOperator.EQ, selectedIndex5F
					);
					var oFilter10 = new sap.ui.model.Filter(
						"IS_UNSUAL_ACT_F",
						sap.ui.model.FilterOperator.EQ, selectedIndex6F
					);
					var oFilter11 = new sap.ui.model.Filter(
						"JUS_ANY_UNUSUAL_F",
						sap.ui.model.FilterOperator.EQ, JUS_ANY_UNUSUAL_F
					);
					aFilter.push(oFilter9);
					aFilter.push(oFilter10);
					aFilter.push(oFilter11);
				}
				//REQ0574233:NSONI3:GWDK902073:05/25/2020:PCR changes related to checklist:END

				this.odataModel.read("/eFormValidateApprovals", {
					filters: aFilter,

					success: function (oData, response) {

						var msg_type = response.data.results[0].MSG_TYPE;
						var stay_option = "";
						if (msg_type == "E") {
							// MessageBox.error(response.data.results[0].MSG);
							msg_returned = response.data.results[0].MSG + ".";
							if (response.data.results[0].MSG ==
								"Please update the checklist questions and acceptance checkbox at the bottom of the form and save first before approving it"
							) {
								stay_option = "X";
							}

						} else {
							msg_returned = "The eForm has been successfully approved.";
						}
						if (stay_option == "X") {
							new Promise(function (fnResolve) {
								sap.m.MessageBox.confirm(msg_returned + "Do you want to go to the Fiori My Inbox App?", {
									title: "Confirm Navigation",
									actions: ["Stay", "Yes", "No"],
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
						} else {

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
					}
				});
			}

		},

		reject_eform: function (value) {

			var msg_returned = "";

			var sValue = jQuery.sap.getUriParameters().get("SOURCE");
			if (sValue == "DUMMY") {
				window.eform_num_inbox = this.sTittle;
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
						viewName: "sony.pcard.reconciliation.appYPCardReconciliation.view." + sDialogName
					});
					this.getView().addDependent(oView);
					oView.getController().setRouter(this.oRouter);
					oView.getController().setValueObject(this.sTittle);
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
				var oModelData = this.getView().getModel();
				var eform_num = this.sTittle;
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

				//REQ0574233:NSONI3:GWDK902073:05/25/2020:PCR changes related to checklist:START
				var selectedIndex5 = this.getOwnerComponent().getModel("headerUserModel").getProperty("/selectedIndex5") === true ? "Y" : "N";
				var selectedIndex6 = this.getOwnerComponent().getModel("headerUserModel").getProperty("/selectedIndex6") === 0 ? "Yes" : "No";
				var justificationText = this.getOwnerComponent().getModel("headerUserModel").getProperty("/JUS_ANY_UNUSUAL");
				var oFilter3 = new sap.ui.model.Filter(
					"USER_CHECK",
					sap.ui.model.FilterOperator.EQ, selectedIndex5
				);
				var oFilter4 = new sap.ui.model.Filter(
					"IS_UNSUAL_ACT",
					sap.ui.model.FilterOperator.EQ, selectedIndex6
				);
				var oFilter5 = new sap.ui.model.Filter(
					"JUS_ANY_UNUSUAL",
					sap.ui.model.FilterOperator.EQ, justificationText
				);
				aFilter.push(oFilter3);
				aFilter.push(oFilter4);
				aFilter.push(oFilter5);
				if (this.getOwnerComponent().getModel("headerUserModel").getProperty("/selectedIndex5S") === true) {
					var selectedIndex5S = this.getOwnerComponent().getModel("headerUserModel").getProperty("/selectedIndex5S") === true ? "Y" : "N";
					var selectedIndex6S = this.getOwnerComponent().getModel("headerUserModel").getProperty("/selectedIndex6S") === 0 ? "Yes" : "No";
					var JUS_ANY_UNUSUAL_S = this.getOwnerComponent().getModel("headerUserModel").getProperty("/JUS_ANY_UNUSUAL_S");
					var oFilter6 = new sap.ui.model.Filter(
						"USER_CHECK_S",
						sap.ui.model.FilterOperator.EQ, selectedIndex5S
					);
					var oFilter7 = new sap.ui.model.Filter(
						"IS_UNSUAL_ACT_S",
						sap.ui.model.FilterOperator.EQ, selectedIndex6S
					);
					var oFilter8 = new sap.ui.model.Filter(
						"JUS_ANY_UNUSUAL_S",
						sap.ui.model.FilterOperator.EQ, JUS_ANY_UNUSUAL_S
					);
					aFilter.push(oFilter6);
					aFilter.push(oFilter7);
					aFilter.push(oFilter8);
				}
				if (this.getOwnerComponent().getModel("headerUserModel").getProperty("/selectedIndex5F") === true) {
					var selectedIndex5F = this.getOwnerComponent().getModel("headerUserModel").getProperty("/selectedIndex5F") === true ? "Y" : "N";
					var selectedIndex6F = this.getOwnerComponent().getModel("headerUserModel").getProperty("/selectedIndex6F") === 0 ? "Yes" : "No";
					var JUS_ANY_UNUSUAL_F = this.getOwnerComponent().getModel("headerUserModel").getProperty("/JUS_ANY_UNUSUAL_F");
					var oFilter9 = new sap.ui.model.Filter(
						"USER_CHECK_F",
						sap.ui.model.FilterOperator.EQ, selectedIndex5F
					);
					var oFilter10 = new sap.ui.model.Filter(
						"IS_UNSUAL_ACT_F",
						sap.ui.model.FilterOperator.EQ, selectedIndex6F
					);
					var oFilter11 = new sap.ui.model.Filter(
						"JUS_ANY_UNUSUAL_F",
						sap.ui.model.FilterOperator.EQ, JUS_ANY_UNUSUAL_F
					);
					aFilter.push(oFilter9);
					aFilter.push(oFilter10);
					aFilter.push(oFilter11);
				}
				//REQ0574233:NSONI3:GWDK902073:05/25/2020:PCR changes related to checklist:END

				this.odataModel.read(relPath, {
					filters: aFilter,

					success: function (oData, response) {

						var msg_type = response.data.results[0].MSG_TYPE;
						var stay_option = "";
						if (msg_type == "E") {

							// MessageBox.error(response.data.results[0].MSG);
							msg_returned = response.data.results[0].MSG + ".";
							if (response.data.results[0].MSG ==
								"Please update the checklist questions and acceptance checkbox at the bottom of the form and save first before approving it"
							) {
								stay_option = "X";
							}

						} else {
							that.getView().getModel("headerUserModel").setProperty("/STATUS", "Rejected");
							msg_returned = "The Eform has been successfully rejected.";
						}
						if (stay_option == "X") {
							new Promise(function (fnResolve) {
								sap.m.MessageBox.confirm(msg_returned + "Do you want to go to the Fiori My Inbox App?", {
									title: "Confirm Navigation",
									actions: ["Stay", "Yes", "No"],
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
						} else {
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

		_getCurrencies: function () {

			var relPath = "/eFormLocCurrencies";

			var that = this;
			this.odataModel.read(relPath, {

				success: function (oData, response) {
					that.getView().getModel("headerUserModel").setProperty("/localcurrency", oData.results);
					if (!that.getView().getModel("headerUserModel").getProperty("/Doc_curr")) {
						that.getView().getModel("headerUserModel").setProperty("/Doc_curr", "USD");
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

		_onChangeTotal: function () {
			//This code was generated by the layout editor.
			var total_Inp = this.getView().getModel("headerUserModel").getProperty("/AMOUNT");
			var loccurrency = this.getView().getModel("headerUserModel").getProperty("/Doc_curr");

			this.total_amount_final = "";

			var total_Inp1 = total_Inp.split(',').join('');
			var s = {};
			s.EXCH = String(total_Inp1);
			s.NAME = loccurrency;

			var that = this;
			this.odataModel.create("/eFormLocCurrencies",
				s, {

					success: function (oResponse) {
						//changed by jatin REQ0297871

						/*  that.total_amount_final = new Intl.NumberFormat('en-US').format(oResponse.EXCH) + ' USD';*/

						that.total_amount_final = oResponse.EXCH + ' USD';
						//end of changed by jatin REQ0297871 
						that.getView().getModel("headerUserModel").setProperty("/AMOUNT_USD", that.total_amount_final);
					}
				});

		},

		attachmentDate: function (value) {

			if (value) {
				var date = new Date(value);
				var month = date.getUTCMonth() + 1;
				var str = value.split("/");
				var str1 = str.splice(0, 1);
				var str2 = str.splice(0, 0, month);
				var str2 = str[0] + "/" + str[1] + "/" + str[2];
				return "abc";
			} else {
				var str = "";
				return str;
			}

		},

		onPrintPress: function () {

			var i;

			var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			var sText = oBundle.getText("ProcurementApplicationCard", [""]);
			var commtTable = this.getOwnerComponent().getModel("oCommentsModel").getData();
			var appTable = this.getOwnerComponent().getModel("oApproverModel").getData();
			var attTable = this.getOwnerComponent().getModel("oCollectionModel").getData();

			var selectedIndex6 = this.getOwnerComponent().getModel("headerUserModel").getProperty("/selectedIndex6");

			var selectedIndex5 = this.getOwnerComponent().getModel("headerUserModel").getProperty("/selectedIndex5");
			var sLoggedInUser = this._component.getModel("headerUserModel").getProperty("/Logged_In_User");

			//supervisor checklist

			var selectedIndex6S = this.getOwnerComponent().getModel("headerUserModel").getProperty("/selectedIndex6S");

			var selectedIndex5S = this.getOwnerComponent().getModel("headerUserModel").getProperty("/selectedIndex5S");

			//Finance checklist

			var selectedIndex6F = this.getOwnerComponent().getModel("headerUserModel").getProperty("/selectedIndex6F");
			var selectedIndex4F = this.getOwnerComponent().getModel("headerUserModel").getProperty("/selectedIndex4F");
			var selectedIndex5F = this.getOwnerComponent().getModel("headerUserModel").getProperty("/selectedIndex5F");

			if (selectedIndex6 === 0) {
				selectedIndex6 = "YES";
				var s4 = '<B>' + oBundle.getText("form_text5") + ': </B>' +
					selectedIndex6 +
					'<BR>' +
					'<B>' + oBundle.getText("form_Justification1") + ': </B>' +
					this.getOwnerComponent().getModel("headerUserModel").getProperty("/JUS_ANY_UNUSUAL") +
					'<BR>'
			} else {
				selectedIndex6 = "NO";
				var s4 = '<B>' + oBundle.getText("form_text5") + ': </B>' +
					selectedIndex6 +
					'<BR>'
			}

			if (selectedIndex5 === true) {
				selectedIndex5 = "YES";
				var s7 = '<B>' + oBundle.getText("form_text7") + ': </B>' +
					selectedIndex5 +
					'<BR>'

			} else {
				selectedIndex5 = "NO";
				var s7 = '<B>' + oBundle.getText("form_text7") + ': </B>' +
					selectedIndex5 +
					'<BR>'
			}

			//supervisor checklist

			if (selectedIndex6S === 0) {
				selectedIndex6S = "YES";
				var s4_S = '<B>' + oBundle.getText("form_text5") + ': </B>' +
					selectedIndex6 +
					'<BR>' +
					'<B>' + oBundle.getText("form_Justification1") + ': </B>' +
					this.getOwnerComponent().getModel("headerUserModel").getProperty("/JUS_ANY_UNUSUAL_S") +
					'<BR>'
			} else {
				selectedIndex6S = "NO";
				var s4_S = '<B>' + oBundle.getText("form_text5") + ': </B>' +
					selectedIndex6S +
					'<BR>'
			}

			if (selectedIndex5S === true) {
				selectedIndex5S = "YES";
				var s7_S = '<B>' + oBundle.getText("form_text7") + ': </B>' +
					selectedIndex5S +
					'<BR>'

			} else {
				selectedIndex5S = "NO";
				var s7_S = '<B>' + oBundle.getText("form_text7") + ': </B>' +
					selectedIndex5S +
					'<BR>'
			}

			//Finance Checklist

			if (selectedIndex6F === 0) {
				selectedIndex6F = "YES";
				var s4_F = '<B>' + oBundle.getText("form_text5") + ': </B>' +
					selectedIndex6F +
					'<BR>' +
					'<B>' + oBundle.getText("form_Justification1") + ': </B>' +
					this.getOwnerComponent().getModel("headerUserModel").getProperty("/JUS_ANY_UNUSUAL_F") +
					'<BR>'
			} else {
				selectedIndex6F = "NO";
				var s4_F = '<B>' + oBundle.getText("form_text5") + ': </B>' +
					selectedIndex6F +
					'<BR>'
			}

			if (selectedIndex5F === true) {
				selectedIndex5F = "YES";
				var s7_F = '<B>' + oBundle.getText("form_text7") + ': </B>' +
					selectedIndex5F +
					'<BR>'

			} else {
				selectedIndex5F = "NO";
				var s7_F = '<B>' + oBundle.getText("form_text7") + ': </B>' +
					selectedIndex5S +
					'<BR>'
			}

			var supervisorChecklist = "";
			var financeChecklist = "";
			if ((this._component.getModel("headerUserModel").getProperty("/isFinanceAppr") === true) || (this._component.getModel(
					"headerUserModel").getProperty("/USER_CHECK_F") === "Y")) {
				financeChecklist = '<BR>' + '<B>' + oBundle.getText("Finance Checklist") + ': </B>' + '<BR>' + '<B>' + oBundle.getText(
					"form_text1") + ': </B>' + '<BR>' + s7_F + s4_F;
			} else {
				financeChecklist = "";
			}
			if ((this._component.getModel("headerUserModel").getProperty("/isOperationAppr") === true) || (this._component.getModel(
					"headerUserModel").getProperty("/USER_CHECK_S") === "Y")) {
				supervisorChecklist = '<BR>' + '<B>' + oBundle.getText("Supervisor Checklist") + ': </B>' + '<BR>' + '<B>' + oBundle.getText(
					"form_text1") + ': </B>' + '<BR>' + s7_S + s4_S;
			} else {
				supervisorChecklist = "";
			}

			var table1 = "";
			var tableApprover = "";
			var attachtable = "";
			if (commtTable.length > 0) {
				table1 = '<center><h3>' + oBundle.getText("form_Comments") + '</h3></center><hr>' +

					"<table width='100%'><tr><td style='border:1px solid black;'>" + oBundle.getText("Id") +
					"</td><td style='border:1px solid black;'>" + oBundle.getText("Comments") + "</td><td style='border:1px solid black;'>" + oBundle
					.getText("AddedBy") +
					" </td>" +
					"<td style='border:1px solid black;'>" + oBundle.getText("AddedOn") +
					"</td></tr>";

				for (var i = 0; i < commtTable.length; i++) {
					table1 = table1 + "<tr><td style='border:1px solid black;'>" + commtTable[i].SEQUENCE +
						"</td><td style='border:1px solid black;'>" + commtTable[i].COMMENTS + "</td><td style='border:1px solid black;'>" +
						commtTable[i].CREATOR + "</td><td style='border:1px solid black;'>" +
						commtTable[i].CR_DATE + "</td>" +

						'</tr>';
				}

				table1 = table1 + '</table>';
			}
			if (appTable.length > 0) {
				var tableApprover =

					'<center><h3>Approvers</h3></center><hr>' +

					"<table width='100%'><tr><td style='border:1px solid black;'>" + oBundle.getText("Approved") +
					"</td><td style='border:1px solid black;'>" + oBundle.getText("Approver") +
					"</td><td style='border:1px solid black;'>" + oBundle.getText("Reviewer  Type") + " </td>" +
					"<td style='border:1px solid black;'>" + oBundle.getText("Approved By") +
					"</td><td style='border:1px solid black;'>" + oBundle.getText("Approval Date") + " </td>" +
					"<td style='border:1px solid black;'>" +
					oBundle.getText("Approval Time(PST)") + " </td>" + "<td style='border:1px solid black;'>" +
					oBundle.getText("Manual Addition") + " </td>" + "<td style='border:1px solid black;'>" +
					oBundle.getText("Added By") + " </td>" + "<td style='border:1px solid black;'>" +
					oBundle.getText("Added On") + " </td>"
				"</tr>";

				for (var i = 0; i < appTable.length; i++) {
					var isApproved = "";
					var isManual = "";
					if (appTable[i].APPROVED === true) {
						isApproved = "Yes";
					} else {
						isApproved = "No";
					}
					if (appTable[i].MANUAL === true) {
						isManual = "Yes";
					} else {
						isManual = "No";
					}
					tableApprover = tableApprover +
						"<tr><td style='border:1px solid black;'>" + isApproved + "</td><td style='border:1px solid black;'> " + appTable[i].APPR +
						"</td><td style='border:1px solid black;'>" +
						appTable[i].REVIEWER_TYPE + "</td><td style='border:1px solid black;'>" +
						appTable[i].APPROVED_BY +
						"</td><td style='border:1px solid black;'>" + appTable[i].APPROVAL_DT + "</td><td style='border:1px solid black;'>" + appTable[i]
						.APPROVAL_TM + " </td>" +
						"<td style='border:1px solid black;'>" + isManual + " </td><td style='border:1px solid black;'>" + appTable[i].ADDED_BY +
						" </td><td style='border:1px solid black;'>" +
						appTable[i].CREATION_DT + "</td></tr>";
				}
				tableApprover = tableApprover + "</table>"
			};

			if (attTable.length > 0) {

				attachtable = '<center><h3>' + oBundle.getText("Attachments") + '</h3></center><hr>' +

					"<table width='100%'><tr><td style='border:1px solid black;'>" + oBundle.getText("File Name") +
					"</td><td style='border:1px solid black;'>" + oBundle.getText("Creation Date") + "</td><td style='border:1px solid black;'>" +
					oBundle.getText("Creation Date(PST)") +
					" </td>" +
					"<td style='border:1px solid black;'>" + oBundle.getText("Size") +
					"</td><td style='border:1px solid black;'>" + oBundle.getText("Creator") +
					"</td></tr>";

				for (var i = 0; i < attTable.length; i++) {
					attachtable = attachtable + "<tr><td style='border:1px solid black;'>" + attTable[i].FILE_NAME +
						"</td><td style='border:1px solid black;'>" + attTable[i].CREATION_DT + "</td><td style='border:1px solid black;'>" +
						attTable[i].CREATION_TIME + "</td><td style='border:1px solid black;'>" +
						attTable[i].FILE_SIZE + "</td><td style='border:1px solid black;'>" +
						attTable[i].CREATED_BY + "</td>" +

						'</tr>';
				}

				attachtable = attachtable + '</table>';
			}

			var amount = this.handleAmountFormatting(this.getView().getModel("headerUserModel").getProperty("/AMOUNT"));
			var amount1 = this.getView().getModel("headerUserModel").getProperty("/AMOUNT_USD");

			var header =
				"<body><center><h3>" + this.getView().byId("pageTitleId").getText() + "</h3></center><BR>" +

				'<B>' + oBundle.getText("form_Preparer") + ':</B>' + this.getView().getModel("headerUserModel").getProperty("/PREPARER") + '<BR>' +

				'<B>' + oBundle.getText("form_CardHolderName") + ':</B> ' + this.getView().getModel("headerUserModel").getProperty(
					"/CARDHOLDERNAME") + '<BR>' +

				'<B>' + oBundle.getText("form_CardHolderphone") + ': </B>' + this.getView().getModel("headerUserModel").getProperty("/PHONE_NUM") +
				'<BR>' +

				'<B>' + oBundle.getText("form_CardHolderSupervisor") + ': </B>' + this.getView().getModel("headerUserModel").getProperty(
					"/SUPERVISOR") + '<BR>' +

				'<B>' + oBundle.getText("form_AmexStatementDate") + ': </B>' + this.getView().getModel("headerUserModel").getProperty("/DATE") +
				'<BR>' +
				'<B>' + oBundle.getText("form_CardNumber") + ': </B>' + this.getView().getModel("headerUserModel").getProperty("/CARDNUMBER") +
				'<BR>' +
				'<B>' + oBundle.getText("form_LOB") + ': </B>' + this.getView().getModel("headerUserModel").getProperty("/LOB") + '<BR>' +
				'<B>' + oBundle.getText("form_SLOB") + ': </B>' + this.getView().getModel("headerUserModel").getProperty("/SLOB") + '<BR>' +
				'<B>' + oBundle.getText("form_BilledAmount_Doc") + ': </B>' + amount + " " + this._component.getModel("headerUserModel").getProperty(
					"/Doc_curr") + '<BR>' +
				'<B>' + oBundle.getText("form_BilledAmount_USD") + ': </B>' + amount1 + '<BR>' +
				'<BR>' + '<B>' + oBundle.getText("Cardholder Checklist") + ': </B>' + '<BR>' +
				'<B>' + oBundle.getText("form_text1") + ': </B>' + '<BR>' + s7 + s4 + supervisorChecklist + financeChecklist + "</body>";

			var cltstrng = "width=500px,height=600px";
			var wind = window.open("", cltstrng);
			wind.document.write(header + tableApprover + attachtable + table1);
			//wind.save();
			wind.print();

		},
		/*on navigating back.*/
		onNavBack: function () {
			this.Form_Num = "";
			this.title = "";
			this.edit = false;
			var headerData = {
				DES: "",
				TITLE: "",
				COMMENTS: "",
				FILE: "",
				PHONENUM: "",
				FILE_NAME: "myFileUpload",
				jusficationVisibleField1: false,
				jusficationVisibleField2: false,
				jusficationVisibleField3: false,
				jusficationVisibleField4: false,
				jusficationVisibleField6: false,
				jusficationVisibleField5: false,
				selectedIndex2: -1,
				selectedIndex1: -1,
				selectedIndex3: -1,
				selectedIndex4: -1,
				selectedIndex5: false,
				selectedIndex6: -1,
				PREPARER: "",
				CARDHOLDERNAME: "",
				// REQ0481487:RMANDAL:GWDK901951:10/23/2019:Adding properties for User Id:START
				PREPARER_ID: "",
				CARD_HOLDER_NAME_ID: "",
				// REQ0481487:RMANDAL:GWDK901951:10/23/2019:Adding properties for User Id:END
				LOB: "",
				SLOB: "",
				PHONE_NUM: "",
				CARDNUMBER: "",
				SUPERVISOR: "",
				DATE: "",
				AMOUNT: "0.00",
				AMOUNT_USD: "0.00",
				CommentSet: [{
					Id: "",
					Comments: "",
					Comments_AddedBy: "",
					Comments_AddedOn: ""
				}],
			};
			this.getView().getModel("headerUserModel").setData(headerData);
			this.getView().getModel("oApproverModel").setData({});
			this.getView().getModel("oCollectionModel").setData({});
			this.getView().getModel("oCommentsModel").setData({});

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

			//oRouter.navTo("PCardReconciliationSearch");
		},

		onNavBackPostDelete: function () {
			this.Form_Num = "";
			this.title = "";
			var headerData = {
				DES: "",
				TITLE: "",

				COMMENTS: "",
				FILE: "",
				PHONENUM: "",
				FILE_NAME: "myFileUpload",
				jusficationVisibleField1: false,
				jusficationVisibleField2: false,
				jusficationVisibleField3: false,
				jusficationVisibleField4: false,
				jusficationVisibleField6: false,
				jusficationVisibleField5: false,
				selectedIndex2: -1,
				selectedIndex1: -1,
				selectedIndex3: -1,
				selectedIndex4: -1,
				selectedIndex5: false,
				selectedIndex6: -1,
				PREPARER: "",
				CARDHOLDERNAME: "",
				LOB: "",
				SLOB: "",
				PHONE_NUM: "",
				CARDNUMBER: "",
				SUPERVISOR: "",
				DATE: "",
				AMOUNT: "0.00",
				AMOUNT_USD: "0.00",
				CommentSet: [{
					Id: "",
					Comments: "",
					Comments_AddedBy: "",
					Comments_AddedOn: ""
				}],
			};
			this.getView().getModel("headerUserModel").setData(headerData);
			this.getView().getModel("oApproverModel").setData({});
			this.getView().getModel("oCollectionModel").setData({});
			this.getView().getModel("oCommentsModel").setData({});

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

			oRouter.navTo("PCardReconciliationSearch");
		},

		handleButtonEnable: function () {

			this.status = this.getView().getModel("headerUserModel").getProperty("/STATUS");
			this.getView().byId("b_edit").setVisible(true);
			this.getView().byId("b_delete").setVisible(true);

			//REQ0481487:NSONI3:GWDK901951:03/05/2020:Approve, Reject & Withdraw Button Visibility Change:START
			var sLoggedInUser = this._component.getModel("headerUserModel").getProperty("/Logged_In_User");
			var sPreparer = this._component.getModel("headerUserModel").getProperty("/PREPARER");
			var sCardHolder = this._component.getModel("headerUserModel").getProperty("/CARDHOLDERNAME");
			var shouldDispWithdrw = false;
			if ((sLoggedInUser !== sPreparer) && (sLoggedInUser !== sCardHolder)) {
				shouldDispWithdrw = false;
			} else {
				shouldDispWithdrw = true;
			}
			//REQ0481487:NSONI3:GWDK901951:03/05/2020:Approve, Reject & Withdraw Button Visibility Change:END

			if (this.status === "In Approval") {

				this.getView().getModel("headerUserModel").setProperty("/isEnableSave", true);
				this.getView().getModel("headerUserModel").setProperty("/isEnableSubmit", false);
				this.getView().getModel("headerUserModel").setProperty("/isEnableWithdraw", shouldDispWithdrw); //REQ0481487:NSONI3:GWDK901951:03/05/2020:Approve, Reject & Withdraw Button Visibility Change
				this.getView().getModel("headerUserModel").setProperty("/isVisibleSubmit", false);
				this.getView().getModel("headerUserModel").setProperty("/isVisibleWithdraw", shouldDispWithdrw); //REQ0481487:NSONI3:GWDK901951:03/05/2020:Approve, Reject & Withdraw Button Visibility Change
				if (window.top.location.href.toLowerCase().indexOf("fiorilaunchpad") == -1) {
					// this.getView().byId("HOME").setVisible(true);
					this.getView().byId("HOME").setVisible(false);
				}
			} else if (this.status === "Data Saved") {
				this.getView().getModel("headerUserModel").setProperty("/isEnableSave", true);
				this.getView().getModel("headerUserModel").setProperty("/isEnableSubmit", true);
				this.getView().getModel("headerUserModel").setProperty("/isEnableWithdraw", false);
				this.getView().getModel("headerUserModel").setProperty("/isVisibleSubmit", true);
				this.getView().getModel("headerUserModel").setProperty("/isVisibleWithdraw", false);
				// this.getView().byId("b_approve").setVisible(false);//REQ0481487:NSONI3:GWDK901951:03/05/2020:Approve, Reject & Withdraw Button Visibility Change
				// this.getView().byId("b_reject").setVisible(false);//REQ0481487:NSONI3:GWDK901951:03/05/2020:Approve, Reject & Withdraw Button Visibility Change
				this.getView().byId("HOME").setVisible(false);

			} else if (this.status === "Withdrawn") {
				this.getView().getModel("headerUserModel").setProperty("/isEnableSave", true);
				this.getView().getModel("headerUserModel").setProperty("/isEnableSubmit", true);
				this.getView().getModel("headerUserModel").setProperty("/isEnableWithdraw", false);
				this.getView().getModel("headerUserModel").setProperty("/isVisibleSubmit", true);
				this.getView().getModel("headerUserModel").setProperty("/isVisibleWithdraw", false);
				// this.getView().byId("b_approve").setVisible(false);//REQ0481487:NSONI3:GWDK901951:03/05/2020:Approve, Reject & Withdraw Button Visibility Change
				// this.getView().byId("b_reject").setVisible(false);//REQ0481487:NSONI3:GWDK901951:03/05/2020:Approve, Reject & Withdraw Button Visibility Change
				this.getView().byId("HOME").setVisible(false);
			} else if (this.status === "Approved") {
				this.getView().getModel("headerUserModel").setProperty("/isEnableSave", false);
				this.getView().getModel("headerUserModel").setProperty("/isEnableSubmit", false);
				this.getView().getModel("headerUserModel").setProperty("/isEnableWithdraw", false);
				this.getView().getModel("headerUserModel").setProperty("/isVisibleSubmit", false);
				this.getView().getModel("headerUserModel").setProperty("/isVisibleWithdraw", false);
				// this.getView().byId("b_approve").setVisible(false);//REQ0481487:NSONI3:GWDK901951:03/05/2020:Approve, Reject & Withdraw Button Visibility Change
				// this.getView().byId("b_reject").setVisible(false);//REQ0481487:NSONI3:GWDK901951:03/05/2020:Approve, Reject & Withdraw Button Visibility Change
				if (window.top.location.href.toLowerCase().indexOf("fiorilaunchpad") == -1) {
					// this.getView().byId("HOME").setVisible(true);
					this.getView().byId("HOME").setVisible(false);
				}
			} else if (this.status === "Rejected") {
				this.getView().getModel("headerUserModel").setProperty("/isEnableSave", true);
				this.getView().getModel("headerUserModel").setProperty("/isEnableSubmit", false);
				this.getView().getModel("headerUserModel").setProperty("/isEnableWithdraw", shouldDispWithdrw); //REQ0481487:NSONI3:GWDK901951:03/05/2020:Approve, Reject & Withdraw Button Visibility Change
				this.getView().getModel("headerUserModel").setProperty("/isVisibleSubmit", false);
				this.getView().getModel("headerUserModel").setProperty("/isVisibleWithdraw", shouldDispWithdrw); //REQ0481487:NSONI3:GWDK901951:03/05/2020:Approve, Reject & Withdraw Button Visibility Change
				if (window.top.location.href.toLowerCase().indexOf("fiorilaunchpad") == -1) {
					// this.getView().byId("HOME").setVisible(true);
					this.getView().byId("HOME").setVisible(false);
				}
			} else if (!this.status) {
				this.getView().getModel("headerUserModel").setProperty("/isEnableSave", true);
				this.getView().getModel("headerUserModel").setProperty("/isEnableSubmit", true);
				this.getView().getModel("headerUserModel").setProperty("/isEnableWithdraw", false);
				this.getView().getModel("headerUserModel").setProperty("/isVisibleSubmit", true);
				this.getView().getModel("headerUserModel").setProperty("/isVisibleWithdraw", false);
				// this.getView().byId("b_approve").setVisible(false);//REQ0481487:NSONI3:GWDK901951:03/05/2020:Approve, Reject & Withdraw Button Visibility Change
				// this.getView().byId("b_reject").setVisible(false);//REQ0481487:NSONI3:GWDK901951:03/05/2020:Approve, Reject & Withdraw Button Visibility Change
				this.getView().byId("HOME").setVisible(false);
				this.getView().byId("b_edit").setVisible(false);
				this.getView().byId("b_delete").setVisible(false);

			}
			// REQ0481487: RMANDAL: GWDK901951:11/19/2019:Validation for button visibility: START
			if (this.status === "Rejected" || this.status === "In Approval") {
				var that = this;
				var oModel = this.getOwnerComponent().getModel("odataModel");
				var aFilter = [];
				var oFilter1 = new sap.ui.model.Filter(
					"EFORM_NUM",
					sap.ui.model.FilterOperator.EQ, this.Form_Num
				);
				aFilter.push(oFilter1);
				oModel.read("/eFormValidateApprovals", {
					filters: aFilter,
					success: function (oData, oResponse) {
						var cFlag = oResponse.data.results[0].MSG_TYPE;
						if (cFlag === 'E') {
							that.getView().byId("b_approve").setVisible(false);
							that.getView().byId("b_reject").setVisible(false);
						} else if (cFlag === 'S' && that.status === "In Approval") {
							that.getView().byId("b_approve").setVisible(true);
							that.getView().byId("b_reject").setVisible(true);
							// that.getView().getModel("headerUserModel").setProperty("/isVisibleWithdraw", false);//REQ0481487:NSONI3:GWDK901951:03/05/2020:Approve, Reject & Withdraw Button Visibility Change
						} else if ((cFlag === 'S' && that.status === "Rejected")) {
							that.getView().byId("b_approve").setVisible(true);
							that.getView().byId("b_reject").setVisible(false);
						} else {
							that.getView().byId("b_approve").setVisible(false);
							that.getView().byId("b_reject").setVisible(false);
						}
					},
					error: function (oError) {}
				});
			}
			// REQ0481487:RMANDAL:GWDK901951:11/19/2019:Validation for button visibility:END
		},
		_onObjectMatched: function (oEvent) {
			var oEvent = oEvent;
			this.Form_Num = "";
			this.action = "";
			this.validateDate = 0;
			this.onNavBack();
			if (oEvent.getParameters().name === "PCardReconciliationSerachPage") {

				this.Form_Num = oEvent.getParameters().arguments.context;

				if (this.Form_Num !== undefined) {
					ReconciliationModel.loadValuHelpConfig(this.Form_Num);
					this.sTittle = this.Form_Num;

					var oBundle = this._component.getModel("i18n").getResourceBundle();
					var sText = oBundle.getText("title", [this.Form_Num]);

					this.getView().byId("pageTitleId").setText(sText);
					ReconciliationModel.getFormData(this.sTittle);
					this.getView().getModel("headerUserModel").setProperty("/isEnable", false);

					var sLoggedInUser = this._component.getModel("headerUserModel").getProperty("/Logged_In_User");
					var approverData = this._component.getModel("oApproverModel").getData();

					this.handleButtonEnable(); //REQ0481487:NSONI3:GWDK901951:03/05/2020:Approve, Reject & Withdraw Button Visibility Change
				}
			}
			if (oEvent.getParameters().name === "PCardReconciliationCopy") {
				this.action = "copy";
				this.Form_Num = oEvent.getParameters().arguments.context;

				if (this.Form_Num !== undefined) {
					ReconciliationModel.loadValuHelpConfig(this.Form_Num, "copy");
					this.sTittle = "";

					var oBundle = this._component.getModel("i18n").getResourceBundle();
					var sText = oBundle.getText("title", [""]);
					this.getView().byId("pageTitleId").setText(sText);
					ReconciliationModel.getFormData(this.Form_Num, "copy");
					var sLoggedInUser = this._component.getModel("headerUserModel").getProperty("/Logged_In_User");
					var sPreparer = this._component.getModel("headerUserModel").getProperty("/PREPARER");
					var sCardHolder = this._component.getModel("headerUserModel").getProperty("/CARDHOLDERNAME");
					// this.handleCheckBoxEnable(sLoggedInUser,sCardHolder);//REQ0481487:NSONI3:GWDK901951:03/05/2020:card holder checklist not checked on copy eform

				}
				this.handleButtonEnable(); //REQ0481487:NSONI3:GWDK901951:03/05/2020:Approve, Reject & Withdraw Button Visibility Change
				this.getView().getModel("headerUserModel").setProperty("/isVisibleWithdraw", false); //REQ0481487:NSONI3:GWDK901951:03/05/2020:Approve, Reject & Withdraw Button Visibility Change
			} else if (this.Form_Num === (undefined || "")) {
				this.sTittle = "";

				var oBundle = this._component.getModel("i18n").getResourceBundle();
				var sText = oBundle.getText("title", [""]);
				this.getView().byId("pageTitleId").setText(sText);
				var oHeaderModel = new sap.ui.model.json.JSONModel();

				// REQ0481487:RMANDAL:GWDK901951:10/23/2019:Adding properties for User Id: START
				var headerData = {
					DES: "",
					TITLE: "",

					COMMENTS: "",
					FILE: "",
					PHONENUM: "",
					FILE_NAME: "myFileUpload",
					jusficationVisibleField1: false,
					jusficationVisibleField2: false,
					jusficationVisibleField3: false,
					jusficationVisibleField4: false,
					jusficationVisibleField6: false,
					jusficationVisibleField5: false,
					selectedIndex2: -1,
					selectedIndex1: -1,
					selectedIndex3: -1,
					selectedIndex4: -1,
					selectedIndex5: false,
					selectedIndex6: -1,

					jusficationVisibleField1S: false,
					jusficationVisibleField2S: false,
					jusficationVisibleField3S: false,
					jusficationVisibleField4S: false,
					jusficationVisibleField6S: false,
					jusficationVisibleField5S: false,
					jusficationVisibleField1F: false,
					jusficationVisibleField2F: false,
					jusficationVisibleField3F: false,
					jusficationVisibleField4F: false,
					jusficationVisibleField6F: false,
					jusficationVisibleField5F: false,
					PREPARER: "",
					PREPARER_ID: "",
					CARDHOLDERNAME: "",
					CARD_HOLDER_NAME_ID: "",
					LOB: "",
					SLOB: "",
					PHONE_NUM: "",
					CARDNUMBER: "",
					SUPERVISOR: "",
					DATE: "",
					AMOUNT: "",
					AMOUNT_USD: "",
					CommentSet: [{
						Id: "",
						Comments: "",
						Comments_AddedBy: "",
						Comments_AddedOn: "",

					}],
					isVisibleFinanceChecklist: false,
					isVisibleOperationChecklist: false
				};
				// REQ0481487:RMANDAL:GWDK901951:10/23/2019:Adding properties for User ID: END
				oHeaderModel.setData(headerData);
				this.edit = true;
				this._component.setModel(oHeaderModel, "headerUserModel");
				this._getCurrencies();
				this.handleButtonEnable();
				ReconciliationModel.loadValuHelpConfig("");

			}
		},

		handleChange: function (oEvent) {
			var oText = this.getView().getModel("headerUserModel").getProperty("/Date");
			var oDP = oEvent.oSource;
			var sValue = oEvent.getParameter("value");
			var bValid = oEvent.getParameter("valid");
			this.validateDate = 0;

			if (bValid) {
				oDP.setValueState(sap.ui.core.ValueState.None);
				this.validateDate = 0;
				var date = this._component.getModel("headerUserModel").getProperty("/DATE");

				if (date) {
					var aDate = date.split("/");
					var sDate = aDate[0] + aDate[1] + aDate[2];
				}

				var date1 = aDate[1] + "/" + aDate[2] + "/" + aDate[0]
				var title = this._component.getModel("headerUserModel").getProperty("/TITLE");
				if (title.indexOf("(") !== -1) {
					var str1 = title.substr(title.indexOf("("), title.indexOf(")") + 2);
					var str2;
					if (str1.includes("/")) {
						title = title.replace(str1, "(" + date1 + ") ");
						this._component.getModel("headerUserModel").setProperty("/TITLE", title.trim());
					} else {
						this._component.getModel("headerUserModel").setProperty("/TITLE", "(" + date1 + ") " + title.trim());
					}
				} else {
					this._component.getModel("headerUserModel").setProperty("/TITLE", "(" + date1 + ") " + title.trim());
				}
			} else {
				oDP.setValueState(sap.ui.core.ValueState.Error);
				this.validateDate = 1;
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

			//REQ0481487:NSONI3:GWDK901951:03/03/2020:Validation to validate if logged in user can delete watcher/approver:START
			var sCurrentUserId = sap.ushell.Container.getUser().getId();
			var sLoggedInUser = this._component.getModel("headerUserModel").getProperty("/Logged_In_User");
			var sAddedBy = this.getView().getModel("oApproverModel").getProperty(sContext + "/ADDED_BY");

			if (sLoggedInUser !== sAddedBy) {
				MessageToast.show("You cannot delete approver/watcher");
				return;
			}
			//REQ0481487:NSONI3:GWDK901951:03/03/2020:Validation to validate if logged in user can delete watcher/approver:END

			if (isApproved === true && isManual === true) {
				MessageBox.show("You cannot delete the approver since it is already approved ");

			}
			//REQ0481487:NSONI3:GWDK901951:03/02/2020:DELETE BUTTON NOT WORK IN APPROVER FLOW:START
			else if (isApproved === "" && isManual === true) {

				var array2 = array.splice(sContext.substr(1), 1);
				this.getView().getModel("oApproverModel").setData(array);

			}
			//REQ0481487:NSONI3:GWDK901951:03/02/2020:DELETE BUTTON NOT WORK IN APPROVER FLOW:END
			else if (isApproved === false && isManual === true) {

				var array2 = array.splice(sContext.substr(1), 1);
				this.getView().getModel("oApproverModel").setData(array);

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
			ReconciliationModel.saveComments("Delete", array2);
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

			ReconciliationModel.saveComments("Update", array2);
		},

		attachmentDate: function (value) {
			if ((value !== undefined) || (value !== "")) {
				var date = new Date(value);
				var month = date.getUTCMonth() + 1

				var str = value.split("/");
				var str1 = str.splice(0, 1);
				var str2 = str.splice(0, 0, month);
				var str2 = str[0] + "/" + str[1] + "/" + str[2];
				return str2;

			}
		},

		onDeleteAttachment: function (oEvent) {
			var oParent = oEvent.getSource().getParent();
			var oPar_Parent = oParent.getParent().sId;
			var oTableId = sap.ui.getCore().byId(oPar_Parent);
			var selected_item = oTableId.getSelectedItem();
			var array = this.getView().getModel("oCollectionModel").getData();
			var array2 = [];

			var sContext = selected_item.getBindingContextPath();

			var array2 = array.splice(sContext.substr(1), 1);

			ReconciliationModel.deleteAttachment(array2, array);
		},

		handleIconTabBarSelect: function (oEvent) {
			var sLoggedInUser = this._component.getModel("headerUserModel").getProperty("/Logged_In_User");
			var sPreparer = this._component.getModel("headerUserModel").getProperty("/PREPARER");
			var sCardHolder = this._component.getModel("headerUserModel").getProperty("/CARDHOLDERNAME");
			var oKey = oEvent.getParameter("selectedKey");
			if (oKey === "pCardSummary") {

				//  this.getView().getModel("headerUserModel").setProperty("/isEnable",false);
				// this.getView().getModel("headerUserModel").setProperty("/isEnable_S",false);
				// this.getView().getModel("headerUserModel").setProperty("/isEnable_F",false);

			} else {

				if (this.action === "copy") {
					this.getView().getModel("headerUserModel").setProperty("/isEnable", true);
					this.getView().getModel("headerUserModel").setProperty("/isEnable_S", true);
					this.getView().getModel("headerUserModel").setProperty("/isEnable_F", true);
					this.handleCheckBoxEnable(sLoggedInUser, sCardHolder);
				} else if (this.action !== "copy") {
					var sLoggedInUser = this._component.getModel("headerUserModel").getProperty("/Logged_In_User");
					var sPreparer = this._component.getModel("headerUserModel").getProperty("/PREPARER");
					var sCardHolder = this._component.getModel("headerUserModel").getProperty("/CARDHOLDERNAME");
					//this._component.getModel("headerUserModel").setProperty("/isEnable",true);

					if ((sLoggedInUser !== sPreparer) && (sLoggedInUser !== sCardHolder)) {
						//changes by jatin
						this._component.getModel("headerUserModel").setProperty("/isEnable", false);
						//this._component.getModel("headerUserModel").setProperty("/isEnable_C",false);
						//this.getView().getModel("headerUserModel").setProperty("/isEnable_S",false);
						// this.getView().getModel("headerUserModel").setProperty("/isEnable_F",false);
						//end of changes by jatin
					}
					if ((sLoggedInUser === sPreparer) || (sLoggedInUser === sCardHolder)) {
						if (this.edit === false) {
							this._component.getModel("headerUserModel").setProperty("/isEnable", false);
							this.handleCheckBoxEnable(sLoggedInUser, sCardHolder);
							//  this.getView().getModel("headerUserModel").setProperty//("/isEnable_S",false);
							//  this.getView().getModel("headerUserModel").setProperty("/isEnable_F",false);
						} else {
							this._component.getModel("headerUserModel").setProperty("/isEnable", true);
							this.getView().getModel("headerUserModel").setProperty("/isEnable_S", true);
							this.getView().getModel("headerUserModel").setProperty("/isEnable_F", true);
							this.handleCheckBoxEnable(sLoggedInUser, sCardHolder);
						}
					}

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

		openAttachment: function (oEvent) {
			var oSource = oEvent.getSource();
			var relPath = "/sap/opu/odata/sap/YFPSFIPFRDD0020_PCARDREC_EFROM_SRV/eFormAttachments(EFORM_NUM='" + this.sTittle + "'" +
				",FILE_NAME='" + oSource.getText() + "')/$value";
			window.open(relPath, '_blank');

		},

		onRefresh: function () {
			if (this.sTittle) {
				ReconciliationModel.getApprovers(this.sTittle);
			}
		},

		//REQ0481487:RMANDAL:GWDK901951:11/20/2019:Adding new row in the approver flow table:START
		/*		onAddApprovers: function (oEvent) {
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
							var index = parseInt(aToolBarInfo[2].substr(1)) + 1;
							newApprovers.splice(index, 0, {
								APPROVED: false,
								APPR: "",
								// REQ0481487:RMANDAL:GWDK901951:10/24/2019:Adding properties for User Id:START
								APPR_ID: "",
								APPROVED_BY_ID: "",
								// REQ0481487:RMANDAL:GWDK901951:10/24/2019:Adding properties for User Id:END
								REVIEWER_TYPE: aToolBarInfo[0],
								APPROVED_BY: "",
								APPROVAL_DT: "",
								APPROVAL_TM: "",
								MANUAL: true,
								ADDED_BY: this.getView().getModel("headerUserModel").getProperty("/Logged_In_User"),
								CREATION_DT: ""
							});
						}
						if (aToolBarInfo[1] === "Before") {

							var index = parseInt(aToolBarInfo[2].substr(1));
							if (newApprovers[index].APPROVED === true) {
								MessageBox.show("Manual Approvers/Watchers can not be added before an approved item.")
							} else {
								newApprovers.splice(index, 0, {
									APPROVED: false,
									// REQ0481487:RMANDAL:GWDK901951:10/24/2019:Adding properties for User Id:START
									APPR_ID: "",
									APPROVED_BY_ID: "",
									// REQ0481487:RMANDAL:GWDK901951:10/24/2019:Adding properties for User Id:END
									APPR: "",
									REVIEWER_TYPE: aToolBarInfo[0],
									APPROVED_BY: "",
									APPROVAL_DT: "",
									APPROVAL_TM: "",
									MANUAL: true,
									ADDED_BY: this.getView().getModel("headerUserModel").getProperty("/Logged_In_User"),
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
		//REQ0481487:RMANDAL:GWDK901951:11/20/2019:Adding new row in the approver flow table:END

		onHandleConfirmUser: function (oEvent) {
			var aContexts = oEvent.getParameter("selectedContexts");
			if (aContexts && aContexts.length) {
				MessageBox.show("You have chosen " + aContexts.map(function (oContext) {
					return oContext.getObject().UserName;
				}).join(", "));
				var value;
				var valueName;
				var valuenum;
				var valSup;
				aContexts.map(function (oContext) {
					valueName = oContext.getObject().UserName;
					value = oContext.getObject().UserId;
					valuenum = oContext.getObject().UserNum;
					valSup = oContext.getObject().UserSupervisor;
				});
			}

			// REQ0481487:RMANDAL:GWDK901951:11/20/2019:Passing User id for approval table:START
			if (this.inputId.includes("table") === false) {
				// REQ0481487:RMANDAL:GWDK901951:11/20/2019:Passing User id for approval table:END
				this.getView().getModel("headerUserModel").setProperty("/CARDHOLDERNAME", valueName);
				// REQ0481487:RMANDAL:GWDK901951:10/23/2019:Adding properties for User Id:START
				this.getView().getModel("headerUserModel").setProperty("/CARD_HOLDER_NAME_ID", value);
				// REQ0481487:RMANDAL:GWDK901951:10/23/2019:Adding properties for User Id:END
				this.getView().getModel("headerUserModel").setProperty("/CARDHOLDERNAME_KEY", value);
				this.getView().getModel("headerUserModel").setProperty("/PHONE_NUM", valuenum);
				this.getView().getModel("headerUserModel").setProperty("/SUPERVISOR", valSup);
				var oBundle = this._component.getModel("i18n").getResourceBundle();

				this.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField6", false);

				var sText = oBundle.getText("titleField", [valueName]);
				this._component.getModel("headerUserModel").setProperty("/TITLE", sText);
				var date = this._component.getModel("headerUserModel").getProperty("/DATE");
				var d1;
				var d2;
				var d3;

				if (date) {
					if (date.includes("/")) {
						var aDate = date.split("/");
						var sDate = aDate[0] + aDate[1] + aDate[2];

						var date1 = aDate[1] + "/" + aDate[2] + "/" + aDate[0];
						var title = this._component.getModel("headerUserModel").getProperty("/TITLE");
						if (title.indexOf("(") !== -1) {
							var str1 = title.substr(title.indexOf("("), title.indexOf(")") + 2);
							var str2;
							if (str1.includes("/")) {
								title = title.replace(str1, "(" + date1 + ") ");
								this._component.getModel("headerUserModel").setProperty("/TITLE", title.trim());
							} else {
								this._component.getModel("headerUserModel").setProperty("/TITLE", "(" + date1 + ") " + title.trim());
							}
						} else {
							this._component.getModel("headerUserModel").setProperty("/TITLE", "(" + date1 + ") " + title.trim());
						}
					} else {

						var d1 = date.substr(0, 4);
						var d2 = date.substr(4, 2);
						var d3 = date.substr(6, 2);

						var date1 = d2 + "/" + d3 + "/" + d1;
						var title = this._component.getModel("headerUserModel").getProperty("/TITLE");

						this._component.getModel("headerUserModel").setProperty("/TITLE", "(" + date1 + ") " + title);

					}
				}

				this.handleCheckBoxEnable(this.getView().getModel("headerUserModel").getProperty("/Logged_In_User"),
					this.getView().getModel("headerUserModel").getProperty("/CARDHOLDERNAME"), "change");
			} else {
				this.getView().getModel("oApproverModel").setProperty(this.sPath + "/APPR", valueName);
				// REQ0481487:RMANDAL:GWDK901951:10/24/2019:Adding properties for User Id:START
				this.getView().getModel("oApproverModel").setProperty(this.sPath + "/APPR_ID", value);
				// REQ0481487:RMANDAL:GWDK901951:10/24/2019:Adding properties for User Id:END

			}
		},
		onHandleUserValueHelp: function (oEvent) {
			this.inputId = oEvent.getSource().getId();

			if (!this._oDialog5) {
				this._oDialog5 = sap.ui.xmlfragment("sony.pcard.reconciliation.appYPCardReconciliation.Fragments.User_Dialog", this);
				this._oDialog5.setModel(this.getView().getModel("oldapproverModel"));
				this.getView().addDependent(this._oDialog5);
			}
			this._oDialog5.setMultiSelect(false);
			this._oDialog5.open();
			this.handleSearch(undefined, "UserDialogId");
		},
		onHandleApproverValueHelp: function (oEvent) {
			// REQ0481487:RMANDAL:GWDK901951:11/20/2019:Passing User id for approval table:START
			this.inputId = oEvent.getSource().getParent().getParent().getId();
			// REQ0481487:RMANDAL:GWDK901951:11/20/2019:Passing User id for approval table:END

			var b = oEvent.getSource().getParent().getBindingContextPath();
			var context = b.substr(b.indexOf("/"), b.lastIndexOf("/"));
			if (context === "") {
				this.sPath = b;

			}
			if (!this._oDialog5) {
				this._oDialog5 = sap.ui.xmlfragment("sony.pcard.reconciliation.appYPCardReconciliation.Fragments.User_Dialog", this);
				this._oDialog5.setModel(this.getView().getModel("oldapproverModel"));
				this.getView().addDependent(this._oDialog5);
			}
			this._oDialog5.setMultiSelect(false);
			this._oDialog5.open();
			this.handleSearch(undefined, "UserDialogId");
		},
		onCardNumChange: function (oEvent) {
			var value = oEvent.getParameter("value");
			if (value !== "") {
				var regx = /[^0-9]|-/g;
				var res = regx.test(value);
				if (res === true) {
					var result = value.match(regx);
					var substr = value.replace(result, '');
					this._component.getModel("headerUserModel").setProperty("/CARDNUMBER", substr);
					sap.ui.getCore().byId(oEvent.getParameter("id")).setValue(this._component.getModel("headerUserModel").getProperty("/CARDNUMBER"));

				}
			}

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
					this._component.getModel("headerUserModel").setProperty("/PHONENUM", substr);
					sap.ui.getCore().byId(oEvent.getParameter("id")).setValue(this._component.getModel("headerUserModel").getProperty("/PHONENUM"));
					this._component.getModel("headerUserModel").getProperty("/PHONENUM");

				}
			}
		},
		handleAmoutFormatterByTotal: function (oEvent) {
			var sAmount = oEvent.getParameter("value");
			//deep change
			var test = sAmount.split(',').join('');
			var test = test.split('+').join('');
			var test = test.split('-').join('');
			var test = test.split('.').join('');
			if (isNaN(Number(test))) {
				MessageBox.error("Please enter the Numeric value in USD Amount");
				this._component.getModel("headerUserModel").setProperty("/ValueState7", "Error");
			} else {
				this._component.getModel("headerUserModel").setProperty("/ValueState7", "None");
				//deep change end 
				var a = sAmount.split(',').join('');
				var str1;
				var str2;
				var regx = /[^0-9]/g;
				var res = regx.test(a);
				if (res === false) {
					var totalUsd = new Intl.NumberFormat('en-US').format(a);
					sap.ui.getCore().byId(oEvent.getParameter("id")).setValue(totalUsd);
					//sap.ui.getCore().byId(oEvent.getParameter("id")).setValue(parseInt(a));
					this._component.getModel("headerUserModel").setProperty("/AMOUNT", totalUsd);
					//this._component.getModel("headerUserModel").setProperty("/AMOUNT", parseInt(a));

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
					this._component.getModel("headerUserModel").setProperty("/AMOUNT", totalUsd);
					//this._component.getModel("headerUserModel").setProperty("/AMOUNT_USD",totalUsd);
				}
				this._onChangeTotal()
			}

		},
		handleSearch: function (oEvent, DialogName) {
			// build filter array
			var aFilter = [];
			if (oEvent) {
				var sQuery = oEvent.getParameter("value");
				if (sQuery) {
					if (oEvent.getParameters().id === "sLoBDialogId") {
						aFilter.push(new Filter("SLOB", FilterOperator.Contains, sQuery));
					}
					if (oEvent.getParameters().id === "LoBDialogId") {
						aFilter.push(new Filter("LOB", FilterOperator.Contains, sQuery));
					}
					if (oEvent.getParameters().id === "UserDialogId") {
						// REQ0481487:RMANDAL:GWDK901951:11/20/2019:Search on user name and user id:START
						var oUserNameFilter = new Filter("UserName", FilterOperator.Contains, sQuery),
							oUserIdFilter = new Filter("UserId", FilterOperator.Contains, sQuery);
						aFilter.push(new Filter([oUserNameFilter, oUserIdFilter], false));
						// REQ0481487:RMANDAL:GWDK901951:11/20/2019:Search on user name and user id:END
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
				if (DialogName === "sLoBDialogId") {
					aFilter.push(new Filter("SLOB", FilterOperator.Contains, sQuery));
				}
				if (DialogName === "LoBDialogId") {
					aFilter.push(new Filter("LOB", FilterOperator.Contains, sQuery));
				}
				if (DialogName === "UserDialogId") {
					// REQ0481487:RMANDAL:GWDK901951:11/20/2019:Search on user name and user id:START
					var oUserNameFilter = new Filter("UserName", FilterOperator.Contains, sQuery),
						oUserIdFilter = new Filter("UserId", FilterOperator.Contains, sQuery);
					aFilter.push(new Filter([oUserNameFilter, oUserIdFilter], false));
					// REQ0481487:RMANDAL:GWDK901951:11/20/2019:Search on user name and user id:END
				}
				// filter binding
				var oList = sap.ui.getCore().byId(DialogName);
				var oBinding = oList.getBinding("items");
				oBinding.filter(aFilter);
				sQuery = "";
			}
		},
		onHandleConfirmLOB: function (oEvent) {
			var aContexts = oEvent.getParameter("selectedContexts");
			if (aContexts && aContexts.length) {
				//  MessageBox.show("You have chosen " + aContexts.map(function(oContext) {
				//    return oContext.getObject().LOB;
				//  }).join(", "));
				var value;
				aContexts.map(function (oContext) {
					value = oContext.getObject().LOB;
				});
			}
			//var InputValue = sap.ui.getCore().byId(this.inputId);
			this.getView().getModel("headerUserModel").setProperty("/LOB", value);
			//InputValue.setValue(value);
		},
		onHandleConfirmSLOB: function (oEvent) {
			var aContexts = oEvent.getParameter("selectedContexts");
			if (aContexts && aContexts.length) {
				//   MessageBox.show("You have chosen " + aContexts.map(function(oContext) {
				//     return oContext.getObject().SLOB;
				//   }).join(", "));
				var value;
				var valueName;
				aContexts.map(function (oContext) {
					value = oContext.getObject().SLOB;
					valueName = oContext.getObject().SLOB_DESCRIPTION;
				});
			}
			var InputValue = sap.ui.getCore().byId(this.inputId);
			InputValue.setValue(value);
		},
		handleConfirm: function () {
			console.log("abc");
		},
		onHandleConfirm: function (oEvent) {
			var aContexts = oEvent.getParameter("selectedContexts");
			if (aContexts && aContexts.length) {
				MessageBox.show("You have chosen " + aContexts.map(function (oContext) {
					return oContext.getObject().UserName;
				}).join(", "));
				var value;
				var valueName;
				aContexts.map(function (oContext) {
					value = oContext.getObject().UserName;
				});
			}
			this.getView().getModel("headerUserModel").setProperty("/CARDHOLDERNAME", value);

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
				this._oDialog2 = sap.ui.xmlfragment("sony.pcard.reconciliation.appYPCardReconciliation.Fragments.LOB_Dialog", this);
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
				this._oDialog3 = sap.ui.xmlfragment("sony.pcard.reconciliation.appYPCardReconciliation.Fragments.SLOB_Dialog", this);
				this._oDialog3.setModel(this.getView().getModel("oldapproverModel"));
				this.getView().addDependent(this._oDialog3);
			}
			this._oDialog3.setMultiSelect(false);
			this._oDialog3.open();
			this.handleSearch(undefined, "sLoBDialogId");
		},
		FormatTiltle: function (text) {
			return jQuery.sap.formatMessage(this._component.getModel("i18n").getProperty("title") + "{1}", ["", ""]);
		},
		OnCurrencySelect: function (oEvent) {
			//if(oEvent.getParameter("selectedItem").getProperty("key") ==="OTHER"){
			// instantiate dialog
			//if (!this._dialog) {
			//  this._dialog = sap.ui.xmlfragment("sony.pcard.reconciliation.appYPCardReconciliation.Fragments.CardHolderNameDialog");
			//}
			// open dialog
			// jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._dialog);
			// this._dialog.open();
			//}
		},
		onClearComment: function (oEvent) {
			this.getView().getModel("headerUserModel").setProperty("/COMMENTS", "");
		},
		saveComments: function (oEvent) {
			ReconciliationModel.saveComments();
		},
		handleValueChange: function (oEvent) {
			this.file_size = oEvent.getParameter("files")[0].size;
			this.file_size = (this.file_size / 1024);
			this.oFileUploaderId = oEvent.getParameter("id");
		},
		handleUploadPress: function (oEvent) {
			var oFileUploader = sap.ui.getCore().byId(this.oFileUploaderId);
			if (this.getView().getModel("headerUserModel").getProperty("/FILE") === "") {
				return;
			}
			if (this.sTittle === undefined) {
				this.sTittle = "";
			} else {
				this.sTittle = this.sTittle;
			}
			var userModel = this.odataModel;
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
			headerParma2.setValue(this.getView().getModel("headerUserModel").getProperty("/FILE") + '|' + this.sTittle + '|' + this.file_size +
				'|' + 'PCR');
			oFileUploader.insertHeaderParameter(headerParma2);
			headerParma3.setName('Content-Type');
			headerParma3.setValue('image/jpeg');
			oFileUploader.insertHeaderParameter(headerParma3);
			headerParma.setName('x-csrf-token');
			headerParma.setValue(csrf);
			oFileUploader.addHeaderParameter(headerParma);
			oFileUploader.upload();
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
			this.sTittle = ReconciliationModel.setTittle();
			this.sTittle = eform_number;
			if (this.sTittle) {
				this.Form_Num = this.sTittle;
				ReconciliationModel.title = this.sTittle;
				var oBundle = this._component.getModel("i18n").getResourceBundle();
				var sText = oBundle.getText("title", [this.sTittle]);
				this.getView().byId("pageTitleId").setText(sText);
				var viewInstance = this.getView();
				viewInstance.setBusy(false);
				ReconciliationModel.getCollection();
			}
		},
		onRodioBtnSelect1: function (oEvent) {
			this.radioButton1 = true;
			if (oEvent.getParameters().selectedIndex === 1) {
				this.getView().getModel("headerUserModel").setProperty("/selectedIndex1", 1);
				this.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField1", true);
				this.getView().getModel("headerUserModel").setProperty("/ARE_ALL_GOODS", "No");
				this.getView().getModel("headerUserModel").setProperty("/JUST_ALL_GOODS", "");
			} else if (oEvent.getParameters().selectedIndex === 0) {
				this.getView().getModel("headerUserModel").setProperty("/selectedIndex1", 0);
				this.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField1", false);
				this.getView().getModel("headerUserModel").setProperty("/ARE_ALL_GOODS", "Yes");
			}
		},
		onRodioBtnSelect2: function (oEvent) {
			this.radioButton2 = true;
			if (oEvent.getParameters().selectedIndex === 1) {
				this.getView().getModel("headerUserModel").setProperty("/selectedIndex2", 1);
				this.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField2", true);
				this.getView().getModel("headerUserModel").setProperty("/ARE_ALL_VENDORS", "No");
			} else if (oEvent.getParameters().selectedIndex === 2) {
				this.getView().getModel("headerUserModel").setProperty("/selectedIndex2", 2);
				this.getView().getModel("headerUserModel").setProperty("/ARE_ALL_VENDORS", "Not Applicable");
				this.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField2", false);
			}
			// this.getView().getModel("headerUserModel").setProperty("/JUST_ALL_GOODS",true);
			else if (oEvent.getParameters().selectedIndex === 0) {
				this.getView().getModel("headerUserModel").setProperty("/selectedIndex2", 0);
				this.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField2", false);
				this.getView().getModel("headerUserModel").setProperty("/ARE_ALL_VENDORS", "Yes");
				this.getView().getModel("headerUserModel").setProperty("/JUST_ALL_VENDORS", "");
			}
		},
		onRodioBtnSelect3: function (oEvent) {
			this.radioButton3 = true;
			if (oEvent.getParameters().selectedIndex === 1) {
				this.getView().getModel("headerUserModel").setProperty("/selectedIndex3", 1);
				this.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField3", true);
				this.getView().getModel("headerUserModel").setProperty("/ARE_ALL_AMT", "No");
				// this.getView().getModel("headerUserModel").setProperty("/JUST_ALL_AMT",true);
			} else if (oEvent.getParameters().selectedIndex === 0) {
				this.getView().getModel("headerUserModel").setProperty("/selectedIndex3", 0);
				this.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField3", false);
				this.getView().getModel("headerUserModel").setProperty("/ARE_ALL_AMT", "Yes");
				this.getView().getModel("headerUserModel").setProperty("/JUST_ALL_AMT", "");
			}
		},
		onRodioBtnSelect4: function (oEvent) {
			this.radioButton4 = true;
			if (oEvent.getParameters().selectedIndex === 1) {
				this.getView().getModel("headerUserModel").setProperty("/selectedIndex4", 1);
				this.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField4", true);
				this.getView().getModel("headerUserModel").setProperty("/ARE_ALL_DOCUMENTS", "No");
			} else if (oEvent.getParameters().selectedIndex === 0) {
				this.getView().getModel("headerUserModel").setProperty("/selectedIndex4", 0);
				this.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField4", false);
				this.getView().getModel("headerUserModel").setProperty("/ARE_ALL_DOCUMENTS", "Yes");
				this.getView().getModel("headerUserModel").setProperty("/JUST_ALL_DOCUMENTS", "");
			}
		},
		onRodioBtnSelect5: function (oEvent) {

			if (oEvent.getParameters().selectedIndex === 0) {
				this.radioButton6 = false;
				this.getView().getModel("headerUserModel").setProperty("/selectedIndex6", 0);
				this.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField6", true);
				this.getView().getModel("headerUserModel").setProperty("/IS_ANY_UNUSUAL", "Yes");
				this.getView().getModel("headerUserModel").setProperty("/JUS_ANY_UNUSUAL", "");

			} else if (oEvent.getParameters().selectedIndex === 1) {
				this.radioButton6 = true;
				this.getView().getModel("headerUserModel").setProperty("/selectedIndex6", 1);
				this.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField6", false);
				this.getView().getModel("headerUserModel").setProperty("/IS_ANY_UNUSUAL", "No");

			}
		},
		onChecked: function (oEvent) {
			this.radioButton5 = true;
			if (oEvent.getParameter("selected") === true) {
				this.getView().getModel("headerUserModel").setProperty("/selectedIndex5", true);
				this.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField5", true);
				this.getView().getModel("headerUserModel").setProperty("/USER_CHECK", "Yes");
			} else {
				this.getView().getModel("headerUserModel").setProperty("/selectedIndex5", false);
				this.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField5", false);
				this.getView().getModel("headerUserModel").setProperty("/USER_CHECK", "No");
			}
		},

		//Supervisor checklist radio button select.
		onRodioBtnSelect1S: function (oEvent) {
			this.radioButton1S = true;
			if (oEvent.getParameters().selectedIndex === 1) {
				this.getView().getModel("headerUserModel").setProperty("/selectedIndex1S", 1);
				this.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField1S", true);
				this.getView().getModel("headerUserModel").setProperty("/ARE_ALL_GOODS_S", "No");
				this.getView().getModel("headerUserModel").setProperty("/JUST_ALL_GOODS_S", "");
			} else if (oEvent.getParameters().selectedIndex === 0) {
				this.getView().getModel("headerUserModel").setProperty("/selectedIndex1S", 0);
				this.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField1S", false);
				this.getView().getModel("headerUserModel").setProperty("/ARE_ALL_GOODS_S", "Yes");
			}
		},
		onRodioBtnSelect2S: function (oEvent) {
			this.radioButton2S = true;
			if (oEvent.getParameters().selectedIndex === 1) {
				this.getView().getModel("headerUserModel").setProperty("/selectedIndex2S", 1);
				this.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField2S", true);
				this.getView().getModel("headerUserModel").setProperty("/ARE_ALL_VENDORS_S", "No");
			} else if (oEvent.getParameters().selectedIndex === 2) {
				this.getView().getModel("headerUserModel").setProperty("/selectedIndex2_S", 2);
				this.getView().getModel("headerUserModel").setProperty("/ARE_ALL_VENDORS_S", "Not Applicable");
				this.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField2S", false);
			}
			// this.getView().getModel("headerUserModel").setProperty("/JUST_ALL_GOODS_S",true);
			else if (oEvent.getParameters().selectedIndex === 0) {
				this.getView().getModel("headerUserModel").setProperty("/selectedIndex2S", 0);
				this.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField2S", false);
				this.getView().getModel("headerUserModel").setProperty("/ARE_ALL_VENDORS_S", "Yes");
				this.getView().getModel("headerUserModel").setProperty("/JUST_ALL_VENDORS_S", "");
			}
		},
		onRodioBtnSelect3S: function (oEvent) {
			this.radioButton3S = true;
			if (oEvent.getParameters().selectedIndex === 1) {
				this.getView().getModel("headerUserModel").setProperty("/selectedIndex3S", 1);
				this.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField3S", true);
				this.getView().getModel("headerUserModel").setProperty("/ARE_ALL_AMT_S", "No");
				// this.getView().getModel("headerUserModel").setProperty("/JUST_ALL_AMT_S",true);
			} else if (oEvent.getParameters().selectedIndex === 0) {
				this.getView().getModel("headerUserModel").setProperty("/selectedIndex3S", 0);
				this.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField3S", false);
				this.getView().getModel("headerUserModel").setProperty("/ARE_ALL_AMT_S", "Yes");
				this.getView().getModel("headerUserModel").setProperty("/JUST_ALL_AMT_S", "");
			}
		},
		onRodioBtnSelect4S: function (oEvent) {
			this.radioButton4S = true;
			if (oEvent.getParameters().selectedIndex === 1) {
				this.getView().getModel("headerUserModel").setProperty("/selectedIndex4S", 1);
				this.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField4S", true);
				this.getView().getModel("headerUserModel").setProperty("/ARE_ALL_DOCUMENTS_S", "No");
			} else if (oEvent.getParameters().selectedIndex === 0) {
				this.getView().getModel("headerUserModel").setProperty("/selectedIndex4S", 0);
				this.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField4S", false);
				this.getView().getModel("headerUserModel").setProperty("/ARE_ALL_DOCUMENTS_S", "Yes");
				this.getView().getModel("headerUserModel").setProperty("/JUST_ALL_DOCUMENTS_S", "");
			}
		},
		onRodioBtnSelect5S: function (oEvent) {

			if (oEvent.getParameters().selectedIndex === 1) {
				this.radioButton6S = false;
				this.getView().getModel("headerUserModel").setProperty("/selectedIndex6S", 1);
				this.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField6S", false);
				this.getView().getModel("headerUserModel").setProperty("/IS_ANY_UNUSUAL_S", "No");
				this.getView().getModel("headerUserModel").setProperty("/JUS_ANY_UNUSUAL_S", "");

			} else if (oEvent.getParameters().selectedIndex === 0) {
				this.radioButton6S = true;
				this.getView().getModel("headerUserModel").setProperty("/selectedIndex6S", 0);
				this.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField6S", true);
				this.getView().getModel("headerUserModel").setProperty("/IS_ANY_UNUSUAL_S", "Yes");

			}
		},
		onChecked_S: function (oEvent) {
			this.radioButton5S = true;
			if (oEvent.getParameter("selected") === true) {
				this.getView().getModel("headerUserModel").setProperty("/selectedIndex5S", true);
				this.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField5S", true);
				this.getView().getModel("headerUserModel").setProperty("/USER_CHECK_S", "Yes");
			} else {
				this.getView().getModel("headerUserModel").setProperty("/selectedIndex5S", false);
				this.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField5S", false);
				this.getView().getModel("headerUserModel").setProperty("/USER_CHECK_S", "No");
			}
		},

		//Finance checklist radio button select.
		onRodioBtnSelect1F: function (oEvent) {
			this.radioButton1F = true;
			if (oEvent.getParameters().selectedIndex === 1) {
				this.getView().getModel("headerUserModel").setProperty("/selectedIndex1F", 1);
				this.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField1F", true);
				this.getView().getModel("headerUserModel").setProperty("/ARE_ALL_GOODS_F", "No");
				this.getView().getModel("headerUserModel").setProperty("/JUST_ALL_GOODS_F", "");
			} else if (oEvent.getParameters().selectedIndex === 0) {
				this.getView().getModel("headerUserModel").setProperty("/selectedIndex1F", 0);
				this.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField1F", false);
				this.getView().getModel("headerUserModel").setProperty("/ARE_ALL_GOODS_F", "Yes");
			}
		},
		onRodioBtnSelect2F: function (oEvent) {
			this.radioButton2F = true;
			if (oEvent.getParameters().selectedIndex === 1) {
				this.getView().getModel("headerUserModel").setProperty("/selectedIndex2F", 1);
				this.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField2F", true);
				this.getView().getModel("headerUserModel").setProperty("/ARE_ALL_VENDORS_F", "No");
			} else if (oEvent.getParameters().selectedIndex === 2) {
				this.getView().getModel("headerUserModel").setProperty("/selectedIndex2F", 2);
				this.getView().getModel("headerUserModel").setProperty("/ARE_ALL_VENDORS_F", "Not Applicable");
				this.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField2F", false);
			}
			// this.getView().getModel("headerUserModel").setProperty("/JUST_ALL_GOODS_F",true);
			else if (oEvent.getParameters().selectedIndex === 0) {
				this.getView().getModel("headerUserModel").setProperty("/selectedIndex2F", 0);
				this.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField2F", false);
				this.getView().getModel("headerUserModel").setProperty("/ARE_ALL_VENDORS_F", "Yes");
				this.getView().getModel("headerUserModel").setProperty("/JUST_ALL_VENDORS_F", "");
			}
		},
		onRodioBtnSelect3F: function (oEvent) {
			this.radioButton3F = true;
			if (oEvent.getParameters().selectedIndex === 1) {
				this.getView().getModel("headerUserModel").setProperty("/selectedIndex3F", 1);
				this.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField3F", true);
				this.getView().getModel("headerUserModel").setProperty("/ARE_ALL_AMT_F", "No");
				// this.getView().getModel("headerUserModel").setProperty("/JUST_ALL_AMT_F",true);
			} else if (oEvent.getParameters().selectedIndex === 0) {
				this.getView().getModel("headerUserModel").setProperty("/selectedIndex3F", 0);
				this.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField3F", false);
				this.getView().getModel("headerUserModel").setProperty("/ARE_ALL_AMT_F", "Yes");
				this.getView().getModel("headerUserModel").setProperty("/JUST_ALL_AMT_F", "");
			}
		},
		onRodioBtnSelect4F: function (oEvent) {
			this.radioButton4F = true;
			if (oEvent.getParameters().selectedIndex === 1) {
				this.getView().getModel("headerUserModel").setProperty("/selectedIndex4F", 1);
				this.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField4F", true);
				this.getView().getModel("headerUserModel").setProperty("/ARE_ALL_DOCUMENTS_F", "No");
			} else if (oEvent.getParameters().selectedIndex === 0) {
				this.getView().getModel("headerUserModel").setProperty("/selectedIndex4F", 0);
				this.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField4F", false);
				this.getView().getModel("headerUserModel").setProperty("/ARE_ALL_DOCUMENTS_F", "Yes");
				this.getView().getModel("headerUserModel").setProperty("/JUST_ALL_DOCUMENTS_F", "");
			}
		},
		onRodioBtnSelect5F: function (oEvent) {

			if (oEvent.getParameters().selectedIndex === 1) {
				this.radioButton6F = false;
				this.getView().getModel("headerUserModel").setProperty("/selectedIndex6F", 1);
				this.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField6F", false);
				this.getView().getModel("headerUserModel").setProperty("/IS_ANY_UNUSUAL_F", "No");
				this.getView().getModel("headerUserModel").setProperty("/JUS_ANY_UNUSUAL_F", "");

			} else if (oEvent.getParameters().selectedIndex === 0) {
				this.radioButton6F = true;
				this.getView().getModel("headerUserModel").setProperty("/selectedIndex6F", 0);
				this.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField6F", true);
				this.getView().getModel("headerUserModel").setProperty("/IS_ANY_UNUSUAL_F", "Yes");

			}
		},
		onChecked_F: function (oEvent) {
			this.radioButton5F = true;
			if (oEvent.getParameter("selected") === true) {
				this.getView().getModel("headerUserModel").setProperty("/selectedIndex5F", true);
				this.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField5F", true);
				this.getView().getModel("headerUserModel").setProperty("/USER_CHECK_F", "Yes");
			} else {
				this.getView().getModel("headerUserModel").setProperty("/selectedIndex5F", false);
				this.getView().getModel("headerUserModel").setProperty("/jusficationVisibleField5F", false);
				this.getView().getModel("headerUserModel").setProperty("/USER_CHECK_F", "No");
			}
		},
		handleCardHolderValueHelp: function () {
			if (!this._dialog1) {
				this._dialog1 = sap.ui.xmlfragment("sony.pcard.reconciliation.appYPCardReconciliation.Fragments.CardHolder_Dialog");
			}
			// open dialog
			//jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._dialog1);
			//this._dialog1.setModel(this.getView().getModel("CardHolderModel"));
			this.getView().addDependent(this._dialog1);
			this._dialog1.open();
			this.handleSearch(undefined, "UserDialogId");
		},
		onPressEdit: function () {
			var sLoggedInUser = this._component.getModel("headerUserModel").getProperty("/Logged_In_User");
			var sPreparer = this._component.getModel("headerUserModel").getProperty("/PREPARER");
			var sCardHolder = this._component.getModel("headerUserModel").getProperty("/CARDHOLDERNAME");

			if ((sLoggedInUser !== sPreparer) && (sLoggedInUser !== sCardHolder)) {
				//MessageBox.show("You are not authorized to Edit this form");
				MessageBox.alert("You are not authorized to Edit this form.");
				this.edit = false;
			} else {
				if (this._component.getModel("headerUserModel").getProperty("/STATUS") === "In Approval") {
					this.onPressWithdraw();
					this.handleCheckBoxEnable(sLoggedInUser, sCardHolder);
					this.edit = false;

				} else if (this._component.getModel("headerUserModel").getProperty("/STATUS") === "Data Saved" ||
					this._component.getModel("headerUserModel").getProperty("/STATUS") === "Rejected" ||
					this._component.getModel("headerUserModel").getProperty("/STATUS") === "Withdrawn") {
					this.edit = true;
					this._component.getModel("headerUserModel").setProperty("/isEnable", true);
					this.handleCheckBoxEnable(sLoggedInUser, sCardHolder);
					this.handleButtonEnable() //REQ0481487:NSONI3:GWDK901951:03/05/2020:Approve, Reject & Withdraw Button Visibility Change
					MessageBox.alert("You can edit this form.");
				} else if (this._component.getModel("headerUserModel").getProperty("/STATUS") === "Approved") {
					this._component.getModel("headerUserModel").setProperty("/isEnable", false);
					this._component.getModel("headerUserModel").setProperty("/isEnable_C", false);
					// MessageBox.show("Form is already Approved");
					MessageBox.alert("Form is already Approved.");
					this.edit = false;
				}
			}
		},
		handleCheckBoxEnable: function (sPreparer, sCardHolder, action) {
			var that = this;
			if (action === "change") {

				if (sPreparer === sCardHolder) {

					that._component.getModel("headerUserModel").setProperty("/isEnable_C", true);

				} else {

					that._component.getModel("headerUserModel").setProperty("/isEnable_C", false);
					if (action === "change") {
						that.getView().getModel("headerUserModel").setProperty("/selectedIndex5", false);
						that.getView().getModel("headerUserModel").setProperty("/selectedIndex6", -1);
						that.getView().getModel("headerUserModel").setProperty("/USER_CHECK", "No");

						that.getView().getModel("headerUserModel").setProperty("/JUS_ANY_UNUSUAL", "");
						that.getView().getModel("headerUserModel").setProperty("jusficationVisibleField6", false);
						//that.getView().getModel("headerUserModel").setProperty("/form_Justification1","");

						this.getView().getModel("headerUserModel").setProperty("/IS_ANY_UNUSUAL", "");

					}
				}
				// }});

				//ReconciliationModel.getDelegate();
				return;
			}
			var cardHolderDelegate;
			if (this.getView().getModel("delegateModel") != undefined) {
				var delagate = this.getView().getModel("delegateModel").getData();

				for (var i = 0; i < delagate.length; i++) {
					if (delagate[i].User_Type === "C")
						cardHolderDelegate = delagate[i].Delegate;
				}
			}
			if (action !== "change") {
				if (sPreparer === sCardHolder) {

					this._component.getModel("headerUserModel").setProperty("/isEnable_C", true);

				} else if (sPreparer === cardHolderDelegate) {
					this._component.getModel("headerUserModel").setProperty("/isEnable_C", true);
					//REQ0481487:NSONI3:GWDK901951:03/05/2020:card holder checklist not checked on copy eform:START
					this._component.getModel("headerUserModel").setProperty("/selectedIndex5", false);
					this._component.getModel("headerUserModel").setProperty("/selectedIndex6", -1);
					//REQ0481487:NSONI3:GWDK901951:03/05/2020:card holder checklist not checked on copy eform:END
				} else {

					this._component.getModel("headerUserModel").setProperty("/isEnable_C", false);
					if (action === "change") {
						this.getView().getModel("headerUserModel").setProperty("/selectedIndex5", false);
						this.getView().getModel("headerUserModel").setProperty("/selectedIndex6", -1);
						this.getView().getModel("headerUserModel").setProperty("/USER_CHECK", "No");

						this.getView().getModel("headerUserModel").setProperty("/JUS_ANY_UNUSUAL", "");
						this.getView().getModel("headerUserModel").setProperty("jusficationVisibleField6", false);
						//this.getView().getModel("headerUserModel").setProperty("/form_Justification1","");
						this.getView().getModel("headerUserModel").setProperty("/IS_ANY_UNUSUAL", "");

					}
				}
			}
		},

		onPressDelete: function () {
			var sLoggedInUser = this._component.getModel("headerUserModel").getProperty("/Logged_In_User");
			var sPreparer = this._component.getModel("headerUserModel").getProperty("/PREPARER");
			var sCardHolder = this._component.getModel("headerUserModel").getProperty("/CARDHOLDERNAME");

			if ((sLoggedInUser !== sPreparer) && (sLoggedInUser !== sCardHolder)) {
				MessageBox.show("You are not authorized to Delete this form");
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
								oFormSaveDeferred = ReconciliationModel.saveEditedEntries(oAction, that.isEmptyFlag, that.sTittle);

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

						if (this.getOwnerComponent().getModel("headerUserModel").getProperty("/STATUS") === "Delete") {
							this.onNavBackPostDelete();
						}

					}.bind(this))
					.fail(function (oError) {

					}.bind(this));

			}
		},

		onPressWithdraw: function () {
			var s = {};
			var that = this;
			var curr_view = this.getView();
			var oFormSaveDeferred
				// this.eform_withdraw;
			new Promise(function (fnResolve) {
				sap.m.MessageBox.confirm("Do you want Withdraw the form ?", {
					title: "Confirm Withdraw",
					actions: ["Yes", "No"],
					onClose: function (sActionClicked) {
						if (sActionClicked === "Yes") {
							var oAction = "Withdraw";

							oFormSaveDeferred = ReconciliationModel.saveEditedEntries(oAction, that.isEmptyFlag, that.sTittle);
							//REQ0481487:NSONI3:GWDK901951:03/05/2020:Refresh approver list after withdraw:START
							if (that.sTittle) {
								ReconciliationModel.getFormData(that.sTittle, oAction);
								ReconciliationModel.getApprovers(that.sTittle);

							}
							//REQ0481487:NSONI3:GWDK901951:03/05/2020:Refresh approver list after withdraw:END

						} else if (sActionClicked === "No") {

							that.getOwnerComponent().getModel("headerUserModel").setProperty("/isEnableSubmit", false);
							that.getOwnerComponent().getModel("headerUserModel").setProperty("/isEnable", false);
							that.getOwnerComponent().getModel("headerUserModel").setProperty("/isEnableSave", false);
							that.handleButtonEnable();
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

					this.getOwnerComponent().getModel("headerUserModel").setProperty("/Readonly", true);
					this.getOwnerComponent().getModel("headerUserModel").setProperty("/Readonly1", true);
					that._component.getModel("headerUserModel").setProperty("/isEnable", true);
					// this.getView().byId("oBtnCancel").setVisible(false);
					// this.getView().byId("oBtnSave").setEnabled(true);
					//  this.getView().byId("oBtnSubmit").setEnabled(true);
					if (this.sTittle) {
						// this.sTitle = ReconciliationModel.setTittle();
						if (this.sTittle) {
							//this.Form_Num = this.sTitle;
							var oBundle = this._component.getModel("i18n").getResourceBundle();
							var sText = oBundle.getText("title", [this.sTittle]);
							this.getView().byId("pageTitleId").setText(sText);
						}
					}

				}.bind(this))
				.fail(function (oError) {

				}.bind(this));

		},
		onPressSave: function (oEvent) {
			var isSave = "true";
			var FormUpdateURL = "/ReconciliationHeaders";
			var formTitle = this._component.getModel("headerUserModel").getProperty("/TITLE");
			var formDes = this._component.getModel("headerUserModel").getProperty("/Des");
			var formCardHolder = this._component.getModel("headerUserModel").getProperty("/CARDHOLDERNAME");
			var formPhNum = this._component.getModel("headerUserModel").getProperty("/PHONE_NUM");
			var formCardNum = this._component.getModel("headerUserModel").getProperty("/CARDNUMBER");
			var formDate = this._component.getModel("headerUserModel").getProperty("/DATE");
			var formAmt = this._component.getModel("headerUserModel").getProperty("/AMOUNT");
			var formAmt_USD = this._component.getModel("headerUserModel").getProperty("/AMOUNT_USD");
			var formAmt_SLob = this._component.getModel("headerUserModel").getProperty("/LOB");
			var formAmt_LOB = this._component.getModel("headerUserModel").getProperty("/SLOB");
			var count = 0;
			if (formTitle === "") {
				//MessageBox.show("Please enter the form title");
				this._component.getModel("headerUserModel").setProperty("/ValueState1", "Error");
			} else {
				this._component.getModel("headerUserModel").setProperty("/ValueState1", "None");
			}
			if (formDes === ("" || undefined)) {
				//MessageBox.show("Please enter the form Description");
				this._component.getModel("headerUserModel").setProperty("/ValueState101", "Error");
			} else {
				this._component.getModel("headerUserModel").setProperty("/ValueState101", "None");
			}
			if (formCardHolder === "") {
				//MessageBox.show("Please enter Card Holder Name");
				this._component.getModel("headerUserModel").setProperty("/ValueState2", "Error");
			} else {
				this._component.getModel("headerUserModel").setProperty("/ValueState2", "None");
			}
			if ((formPhNum === "") || (formPhNum === undefined)) {
				//MessageBox.show("Please enter Phone Number");
				this._component.getModel("headerUserModel").setProperty("/ValueState3", "Error");
			} else {
				if (formPhNum.length < 10) {
					MessageBox.error("Phone Number should be atleast 10 digits long");
					this._component.getModel("headerUserModel").setProperty("/ValueState3", "Error");
				} else {
					this._component.getModel("headerUserModel").setProperty("/ValueState3", "None");
				}
			}
			if (formCardNum === "" || formCardNum.length !== 5) {

				MessageBox.error("Please enter last five digits of Card Number");
				this._component.getModel("headerUserModel").setProperty("/ValueState4", "Error");
				count = count + 1;
			} else {
				this._component.getModel("headerUserModel").setProperty("/ValueState4", "None");
			}
			if (formDate === "") {
				//MessageBox.show("Please enter the Amex Date");
				this._component.getModel("headerUserModel").setProperty("/ValueState5", "Error");
			} else {
				this._component.getModel("headerUserModel").setProperty("/ValueState5", "None");
			}
			if (formAmt === "" || formAmt === "0") {
				//MessageBox.show("Please enter the Document Amount");
				this._component.getModel("headerUserModel").setProperty("/ValueState6", "Error");
			} else {
				this._component.getModel("headerUserModel").setProperty("/ValueState6", "None");
			}
			if (formAmt_USD === "" || formAmt_USD === "0") {
				// MessageBox.show("Please enter the  USD Amount");
				this._component.getModel("headerUserModel").setProperty("/ValueState7", "Error");
			} else {
				this._component.getModel("headerUserModel").setProperty("/ValueState7", "None");
			}
			if (formAmt_LOB === "") {
				// MessageBox.show("Please enter the  LOB");
				this._component.getModel("headerUserModel").setProperty("/ValueState8", "Error");
			} else {
				this._component.getModel("headerUserModel").setProperty("/ValueState8", "None");
			}
			if (formAmt_SLob === "") {
				//MessageBox.show("Please enter the SubLob");
				this._component.getModel("headerUserModel").setProperty("/ValueState9", "Error");
			} else {
				this._component.getModel("headerUserModel").setProperty("/ValueState9", "None");
			}

			if ((this.getView().getModel("headerUserModel").getProperty("/selectedIndex5") === true)) {

				this._component.getModel("headerUserModel").setProperty("/ValueState14", "None");
			} else {
				if (this._component.getModel("headerUserModel").getProperty("/PREPARER") === this._component.getModel("headerUserModel").getProperty(
						"/CARDHOLDERNAME")) {
					this._component.getModel("headerUserModel").setProperty("/ValueState14", "Error");
				} else {
					this._component.getModel("headerUserModel").setProperty("/ValueState14", "None");
				}
			}
			if ((this.getView().getModel("headerUserModel").getProperty("/selectedIndex6") === 0) || (this.getView().getModel("headerUserModel")
					.getProperty("/selectedIndex6") === 1)) {

				this._component.getModel("headerUserModel").setProperty("/ValueState15", "None");
			} else {

				if (this._component.getModel("headerUserModel").getProperty("/Logged_In_User") === this._component.getModel("headerUserModel").getProperty(
						"/CARDHOLDERNAME")) {
					this._component.getModel("headerUserModel").setProperty("/ValueState15", "Error");
				} else {
					this._component.getModel("headerUserModel").setProperty("/ValueState15", "None");
				}

			}

			if (this.getView().getModel("headerUserModel").getProperty("/selectedIndex6") === 0 && this.getView().getModel("headerUserModel").getProperty(
					"/JUS_ANY_UNUSUAL") === "") {

				if (this._component.getModel("headerUserModel").getProperty("/Logged_In_User") === this._component.getModel("headerUserModel").getProperty(
						"/CARDHOLDERNAME")) {
					this.getView().getModel("headerUserModel").setProperty("/ValueState20", "Error");
				} else {
					this.getView().getModel("headerUserModel").setProperty("/ValueState20", "None");
				}
			} else {

				this.getView().getModel("headerUserModel").setProperty("/ValueState20", "None");
			}

			//Supervisor Checklist

			if ((this.getView().getModel("headerUserModel").getProperty("/selectedIndex5S") === true)) {

				this._component.getModel("headerUserModel").setProperty("/ValueState14S", "None");
			} else {
				this._component.getModel("headerUserModel").setProperty("/ValueState14S", "Error");
			}
			if ((this.getView().getModel("headerUserModel").getProperty("/selectedIndex6S") === 0) || (this.getView().getModel(
					"headerUserModel").getProperty("/selectedIndex6S") === 1)) {

				this._component.getModel("headerUserModel").setProperty("/ValueState15S", "None");
			} else {
				this._component.getModel("headerUserModel").setProperty("/ValueState15S", "Error");
			}

			if (this.getView().getModel("headerUserModel").getProperty("/selectedIndex6S") === 0 && this.getView().getModel("headerUserModel").getProperty(
					"/JUS_ANY_UNUSUAL_S") === "") {

				this.getView().getModel("headerUserModel").setProperty("/ValueState20S", "Error");
			} else {
				this.getView().getModel("headerUserModel").setProperty("/ValueState20S", "None");
			}

			// Finannce Checklist

			if ((this.getView().getModel("headerUserModel").getProperty("/selectedIndex5F") === true)) {

				this._component.getModel("headerUserModel").setProperty("/ValueState14F", "None");
			} else {
				this._component.getModel("headerUserModel").setProperty("/ValueState14F", "Error");
			}
			if ((this.getView().getModel("headerUserModel").getProperty("/selectedIndex6F") === 0) || (this.getView().getModel(
					"headerUserModel").getProperty("/selectedIndex6F") === 1)) {

				this._component.getModel("headerUserModel").setProperty("/ValueState15F", "None");
			} else {
				this._component.getModel("headerUserModel").setProperty("/ValueState15F", "Error");
			}

			if (this.getView().getModel("headerUserModel").getProperty("/selectedIndex6F") === 0 && this.getView().getModel("headerUserModel").getProperty(
					"/JUS_ANY_UNUSUAL_F") === "") {

				this.getView().getModel("headerUserModel").setProperty("/ValueState20F", "Error");
			} else {
				this.getView().getModel("headerUserModel").setProperty("/ValueState20F", "None");
			}

			if (count === 0) {
				var oFormSaveDeferred = ReconciliationModel.saveEditedEntries(isSave, this.isEmptyFlag, this.sTittle);
				jQuery.when.apply(this, oFormSaveDeferred)
					.done(function () {
						this.sTittle = ReconciliationModel.setTittle();
						if (this.sTittle) {
							this.sTittle = this.sTittle;
							var oBundle = this._component.getModel("i18n").getResourceBundle();
							var sText = oBundle.getText("title", [this.sTittle]);
							this.getView().byId("pageTitleId").setText(sText);
							//jQuery.sap.formatMessage(" {0} " +this._component.getModel("i18n").getProperty("title") + "{1}" ,["",this.sTittle]);
						}
					}.bind(this))
					.fail(function (oError) {}.bind(this));
			}
		},
		onPressSubmit: function () {
			var isSave = "false";
			var FormUpdateURL = "/ReconciliationHeaders";
			var formTitle = this._component.getModel("headerUserModel").getProperty("/TITLE");
			var formDes = this._component.getModel("headerUserModel").getProperty("/Des");
			var formCardHolder = this._component.getModel("headerUserModel").getProperty("/CARDHOLDERNAME");
			var formPhNum = this._component.getModel("headerUserModel").getProperty("/PHONE_NUM");
			var formCardNum = this._component.getModel("headerUserModel").getProperty("/CARDNUMBER");
			var formDate = this._component.getModel("headerUserModel").getProperty("/DATE");
			var formAmt = this._component.getModel("headerUserModel").getProperty("/AMOUNT");
			var formAmt_USD = this._component.getModel("headerUserModel").getProperty("/AMOUNT_USD");
			var formAmt_SLob = this._component.getModel("headerUserModel").getProperty("/LOB");
			var formAmt_LOB = this._component.getModel("headerUserModel").getProperty("/SLOB");
			var count = 0;
			var mandatory_radio = 0;
			if (formTitle === "") {
				MessageBox.error("Please enter the form title");
				this._component.getModel("headerUserModel").setProperty("/ValueState1", "Error");
				count = count + 1;
			} else {
				this._component.getModel("headerUserModel").setProperty("/ValueState1", "None");
			}
			if ((formDes === "") || (formDes === undefined)) {
				MessageBox.error("Please enter the form Description");
				this._component.getModel("headerUserModel").setProperty("/ValueState101", "Error");
				count = count + 1;
			} else {
				this._component.getModel("headerUserModel").setProperty("/ValueState101", "None");
			}
			if (formCardHolder === "") {
				MessageBox.error("Please enter Card Holder Name");
				this._component.getModel("headerUserModel").setProperty("/ValueState2", "Error");
				count = count + 1;
			} else {
				this._component.getModel("headerUserModel").setProperty("/ValueState2", "None");
			}
			if ((formPhNum === "") || (formPhNum === undefined)) {
				MessageBox.error("Please enter Phone Number");
				this._component.getModel("headerUserModel").setProperty("/ValueState3", "Error");
				count = count + 1;
			} else {
				if (formPhNum.length < 10) {
					count = count + 1;
					MessageBox.error("Phone Number should be atleast 10 digits long");
					this._component.getModel("headerUserModel").setProperty("/ValueState3", "Error");
				} else {
					this._component.getModel("headerUserModel").setProperty("/ValueState3", "None");
				}

			}
			if (formCardNum === "" || formCardNum.length !== 5) {
				MessageBox.error("Please enter last five digits of Card Number");
				this._component.getModel("headerUserModel").setProperty("/ValueState4", "Error");
				count = count + 1;
			} else {
				this._component.getModel("headerUserModel").setProperty("/ValueState4", "None");
			}
			if ((formDate === "") || (this.validateDate !== 0)) {
				MessageBox.error("Please enter the Amex Date");
				this._component.getModel("headerUserModel").setProperty("/ValueState5", "Error");
				count = count + 1;
			} else {
				this._component.getModel("headerUserModel").setProperty("/ValueState5", "None");
			}
			if (formAmt === "" || formAmt === "0") {
				MessageBox.error("Please enter the Document Amount");
				this._component.getModel("headerUserModel").setProperty("/ValueState6", "Error");
				count = count + 1;
			} else {
				this._component.getModel("headerUserModel").setProperty("/ValueState6", "None");
			}
			if (formAmt_USD === "" || formAmt_USD === "0") {
				MessageBox.error("Please enter the  USD Amount");
				this._component.getModel("headerUserModel").setProperty("/ValueState7", "Error");
				count = count + 1;
			} else {
				this._component.getModel("headerUserModel").setProperty("/ValueState7", "None");
			}
			if (formAmt_LOB === "") {
				MessageBox.error("Please enter the  LOB");
				this._component.getModel("headerUserModel").setProperty("/ValueState8", "Error");
				count = count + 1;
			} else {
				this._component.getModel("headerUserModel").setProperty("/ValueState8", "None");
			}
			if (formAmt_SLob === "") {
				MessageBox.error("Please enter the SubLob");
				this._component.getModel("headerUserModel").setProperty("/ValueState9", "Error");
				count = count + 1;
			} else {
				this._component.getModel("headerUserModel").setProperty("/ValueState9", "None");
			}

			//Start of addition by Ankit

			if ((this.getView().getModel("headerUserModel").getProperty("/selectedIndex5") === true)) {

				this._component.getModel("headerUserModel").setProperty("/ValueState14", "None");
			} else {

				if (this._component.getModel("headerUserModel").getProperty("/Logged_In_User") === this._component.getModel("headerUserModel").getProperty(
						"/CARDHOLDERNAME")) {
					count = count + 1;
					mandatory_radio = mandatory_radio + 1;
					this._component.getModel("headerUserModel").setProperty("/ValueState14", "Error");
				} else {
					this._component.getModel("headerUserModel").setProperty("/ValueState14", "None");
				}
			}
			if ((this.getView().getModel("headerUserModel").getProperty("/selectedIndex6") === 0) || (this.getView().getModel("headerUserModel")
					.getProperty("/selectedIndex6") === 1)) {

				this._component.getModel("headerUserModel").setProperty("/ValueState15", "None");
			} else {

				if (this._component.getModel("headerUserModel").getProperty("/Logged_In_User") === this._component.getModel("headerUserModel").getProperty(
						"/CARDHOLDERNAME")) {
					count = count + 1;
					mandatory_radio = mandatory_radio + 1;
					this._component.getModel("headerUserModel").setProperty("/ValueState15", "Error");
				} else {
					this._component.getModel("headerUserModel").setProperty("/ValueState15", "None");
				}

			}

			if (mandatory_radio > 0) {

				MessageBox.error("Please select all mandatory Checklist Options");
			}

			//End of addition by Ankit
			this.jus = 0;

			if (this.getView().getModel("headerUserModel").getProperty("/selectedIndex6") === 0 && this.getView().getModel("headerUserModel").getProperty(
					"/JUS_ANY_UNUSUAL") === "") {

				if (this._component.getModel("headerUserModel").getProperty("/Logged_In_User") === this._component.getModel("headerUserModel").getProperty(
						"/CARDHOLDERNAME")) {
					count = count + 1;
					this.jus = this.jus + 1;
					this._component.getModel("headerUserModel").setProperty("/ValueState20", "Error");
				} else {
					this._component.getModel("headerUserModel").setProperty("/ValueState20", "None");
				}

			} else {
				this.getView().getModel("headerUserModel").setProperty("/ValueState20", "None");
			}

			if (this.jus > 0) {
				MessageBox.error("Please enter all mandatory Checklist Justification");
			}

			if (formTitle === "") {
				// this.isEmptyFlag = true;
			} else {
				//this.isEmptyFlag = false;
			}
			if (count === 0) {
				var oFormSaveDeferred = ReconciliationModel.saveEditedEntries(isSave, this.isEmptyFlag, this.sTittle);
				jQuery.when.apply(this, oFormSaveDeferred)
					.done(function () {
						this.sTittle = ReconciliationModel.setTittle();
						if (this.sTittle) {
							this.Form_Num = this.sTittle;
							var oBundle = this._component.getModel("i18n").getResourceBundle();
							var sText = oBundle.getText("title", [this.sTittle]);
							this.getView().byId("pageTitleId").setText(sText);
							//jQuery.sap.formatMessage(" {0} " +this._component.getModel("i18n").getProperty("title") + "{1}" ,["",this.sTittle]);
						}
					}.bind(this))
					.fail(function (oError) {}.bind(this));
			}
		},

		// REQ0481487:RMANDAL:GWDK901951:11/20/2019:Adding factory function:START
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
							valueHelpOnly: false,
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
		// REQ0481487:RMANDAL:GWDK901951:11/20/2019:Adding factory function:END

		// REQ0481487:RMANDAL:GWDK901951:11/20/2019:Function to display employees of group:START
		_displayEmployees: function (oEvent) {
				var oEventHandler = oEvent;
				var that = this;
				var sDept = oEvent.getSource().getText();
				var oFilterFormType = new sap.ui.model.Filter("FormTyp", sap.ui.model.FilterOperator.EQ, "PCR");
				var oFilterRole = new sap.ui.model.Filter("Role", sap.ui.model.FilterOperator.EQ, sDept);
				this.getOwnerComponent().getModel("odataModel").read("/YFPSFIC00017_GRPSet", {
					async: false,
					filters: [oFilterFormType, oFilterRole],
					success: function (oData, oResponse) {
						if (!that._oPopover) {
							that._oPopover = sap.ui.xmlfragment("sony.pcard.reconciliation.appYPCardReconciliation.Fragments.employee", that);
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
			// REQ0481487:RMANDAL:GWDK901951:11/20/2019:Function to display employees of group:END
	});
});