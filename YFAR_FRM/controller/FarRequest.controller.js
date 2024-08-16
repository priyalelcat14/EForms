jQuery.sap.require("spefar.app.model.formatter");
sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageBox",
		"./utilities",
		"sap/ui/core/routing/History"
	], function (BaseController, MessageBox, Utilities, History) {
		"use strict";
		var index_counter = 0;
		var file_size;
		var copy_case;
		var createscene;
		window.isreject = "";
		return BaseController.extend("spefar.app.controller.FarRequest", {
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
				this.aRadioButtonGroupIds = [
					"sap_Responsive_Page_0-content-sap_m_IconTabBar-1500880096540-items-sap_m_IconTabFilter-5-content-sap_m_VBox-1504525446491-items-sap_m_HBox-1504525472373-items-sap_m_RadioButtonGroup-2",
					"sap_Responsive_Page_0-content-sap_m_IconTabBar-1500880096540-items-sap_m_IconTabFilter-5-content-sap_m_VBox-1504526961860-items-sap_m_HBox-1-items-sap_m_RadioButtonGroup-2",
					"sap_Responsive_Page_0-content-sap_m_IconTabBar-1500880096540-items-sap_m_IconTabFilter-5-content-sap_m_VBox-1504526981252-items-sap_m_HBox-1-items-sap_m_RadioButtonGroup-2",
					"sap_Responsive_Page_0-content-sap_m_IconTabBar-1500880096540-items-sap_m_IconTabFilter-5-content-sap_m_VBox-1504526985146-items-sap_m_HBox-1-items-sap_m_RadioButtonGroup-2",
					"sap_Responsive_Page_0-content-sap_m_IconTabBar-1500880096540-items-sap_m_IconTabFilter-5-content-sap_m_VBox-1504526991478-items-sap_m_HBox-1-items-sap_m_RadioButtonGroup-2",
					"sap_Responsive_Page_0-content-sap_m_IconTabBar-1500880096540-items-sap_m_IconTabFilter-1504533892033-content-sap_m_VBox-1504534068990-items-sap_m_HBox-1-items-sap_m_RadioButtonGroup-2",
					"sap_Responsive_Page_0-content-sap_m_IconTabBar-1500880096540-items-sap_m_IconTabFilter-1504533892033-content-sap_m_VBox-1504534068991-items-sap_m_HBox-1-items-sap_m_RadioButtonGroup-2",
					"sap_Responsive_Page_0-content-sap_m_IconTabBar-1500880096540-items-sap_m_IconTabFilter-1504533892033-content-sap_m_VBox-1504534068992-items-sap_m_HBox-1-items-sap_m_RadioButtonGroup-2",
					"sap_Responsive_Page_0-content-sap_m_IconTabBar-1500880096540-items-sap_m_IconTabFilter-1504533892033-content-sap_m_VBox-1504534068993-items-sap_m_HBox-1-items-sap_m_RadioButtonGroup-2",
					"sap_Responsive_Page_0-content-sap_m_IconTabBar-1500880096540-items-sap_m_IconTabFilter-1504533892033-content-sap_m_VBox-1504534068994-items-sap_m_HBox-1-items-sap_m_RadioButtonGroup-2"
				];
				this.handleRadioButtonGroupsSelectedIndex();
			},

			_onCurrencyChange: function (oEvent) {

				this.getView().byId("total_component_amt").setText("0");
				this.getView().byId("local_total_final").setValue("0");
				this.getView().byId("sum_usd_total_final").setText("0");

			},

			handleAmountFormatting: function (value) {
				if (value && this.flag !== true) {
					var oValue = value.split(',').join('');
					var totalUsd = new Intl.NumberFormat('en-US').format(oValue);
					return totalUsd;
				} else {
					return value;
				}
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

				if (this.getView().byId("component_table").sId === oEvent.getSource().getParent().getParent().sId) {
					this.flag = true;
					var oBindingPath = oEvent.getSource().getParent().oBindingContexts.undefined.sPath;
					this.getView().getModel().setProperty(oBindingPath + "/amount", totalUsd);
				}
				if (this.getView().byId("local_total_final").sId === oEvent.getSource().sId) {
					this._onChangeTotal();
				}

				if (this.getView().byId("maintab_fe_rfb_inp").sId === oEvent.getSource().sId) {
					this.getView().getModel().setProperty("/revised_far", totalUsd);

					//  var t1 = this.getView().byId("maintab_fe_rfb_inp").getValue().split(',').join('');
					//  var t2 = this.getView().byId("maintab_fe_ofb_inp").getValue().split(',').join('');
					//  var t3 = t1 - t2;
					//  t3 = new Intl.NumberFormat('en-US').format(t3);
					//  this.getView().byId("maintab_fe_tc_inp").setValue(t3);

				}
				//REQ0567864:NSONI3:GWDK902066:05/11/2020:Add new change request field for budget:START
				if (this.getView().byId("maintab_fe_reqChange_inp").sId === oEvent.getSource().sId) {
					var originalValue = this.getView().byId("maintab_fe_ofb_inp").getValue().split(',').join('');
					originalValue = originalValue === "" ? "0" : originalValue;
					var requestedValue = totalUsd.split(',').join('');
					requestedValue = requestedValue === "" ? "0" : requestedValue;
					var revisedValue = parseFloat(requestedValue) + parseFloat(originalValue);
					this.getView().byId("maintab_fe_rfb_inp").setValue(new Intl.NumberFormat('en-US').format(revisedValue));
					// this.getView().getModel().setProperty("/revised_far", new Intl.NumberFormat('en-US').format(revisedValue));
					// this.getView().getModel().setProperty("/requested_far", totalUsd);
				}
				//REQ0567864:NSONI3:GWDK902066:05/11/2020:Add new change request field for budget:END

			},

			handleRadioButtonGroupsSelectedIndex: function () {
				// Needed for RadioButtonGroups that have selectedIndex AND buttons bound
				var that = this;
				this.aRadioButtonGroupIds.forEach(function (sRadioButtonGroupId) {
					var oRadioButtonGroup = that.byId(sRadioButtonGroupId);
					var oButtonsBinding = oRadioButtonGroup ? oRadioButtonGroup.getBinding("buttons") : undefined;
					if (oButtonsBinding) {
						var oSelectedIndexBinding = oRadioButtonGroup.getBinding("selectedIndex");
						if (oSelectedIndexBinding) {
							oButtonsBinding.attachEventOnce("change", function () {
								oSelectedIndexBinding.refresh(true);
							});
						}
					}
				});
			},
			_onPageNavButtonPress: function () {
				// var oHistory = History.getInstance();
				// var sPreviousHash = oHistory.getPreviousHash();
				// var oQueryParams = this.getQueryParameters(window.location);
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				//var myloc = location;
				// myloc.reload();
				window.location.reload();
				oRouter.navTo("default", true);
			},
			// getQueryParameters: function(oLocation) {
			//     var oQuery = {};
			//     var aParams = oLocation.search.substring(1).split("&");
			//     for (var i = 0; i < aParams.length; i++) {
			//         var aPair = aParams[i].split("=");
			//         oQuery[aPair[0]] = decodeURIComponent(aPair[1]);
			//     }
			//     return oQuery;
			// },
			//REQ0737819:DPATEL11:FPDK900086:Batch-2:FAR lob/sublob changes : START
			_onbehalfofValueHelpRequest: function (oEvent) {
				var multi = false;
				var url = "/sap/opu/odata/sap/YFPSFIPFRDD00017_CPR_EFORM_SRV/";
				var oModelData = new sap.ui.model.odata.ODataModel(url, true);
				var relPath = "/eFormProductionAccts";
				var that = this;
				var name;
				var id;
				oModelData.read(relPath, null, [], false, function (oData, response) {
					},
					function (oError) {
						oModelData.fireRequestCompleted();
						var msg = JSON.parse(oError.response.body).error.message.value;
						//sap.m.MessageBox.error(msg);
						sap.m.MessageToast.show(msg);
					});
				var oValueHelpDialog_RespDiv = new sap.m.SelectDialog({
					title: "Choose value for 'On Behalf of'",
					items: {
						path: relPath,
						template: new sap.m.StandardListItem({
							title: "{USERID}",
							description: "{NAME}",

						})
					},
					multiSelect: multi,
					search: function (oEvent) {
						var sValue = oEvent.getParameter("value");
						var oTitleFilter = new sap.ui.model.Filter(
							"NAME",
							sap.ui.model.FilterOperator.Contains, sValue
						);

						var oFilter = new sap.ui.model.Filter([oTitleFilter], false);
						oEvent.getSource().getBinding("items").filter([oFilter]);

					},

					confirm: function (oEvent) {
						var selected_comp = oEvent.getParameters().selectedItems[0].getDescription();
						var selected_comp_cd = oEvent.getParameters().selectedItems[0].getTitle();

						var url = "/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/";
						var oModelData = new sap.ui.model.odata.ODataModel(url, true);

						var relPath = "eFormProductionAccts('" + selected_comp_cd + "')";
						var that = this;
						oModelData.read(relPath, null, [], false, function (oData, response) {
							window.userphone = response.data.PHONE;
							window.useremail = response.data.EMAIL;
							window.userid = response.data.USERID;

						});

						window.REQUESTED_BY_ID = selected_comp_cd;
						sap.ui.controller("spefar.app.controller.FarRequest").addonbehalfof(selected_comp, window.userphone, window.useremail);
						
						//that.addonbehalfof(selected_comp, window.userphone, window.useremail);
						//oDialog.close();
					},

					// 		else 

				});

				oValueHelpDialog_RespDiv.setModel(oModelData);
				oValueHelpDialog_RespDiv.open();
			},
			_onlobValueHelpRequest: function (oEvent) {
				var lobid = this.getView().byId("title_cofalob_inp");
				var sublob = this.getView().byId("title_cofasublob_inp");
				if (sublob.getValue() !== '') {
					sublob.setValue();
					sublob.setValueState("None");
				}
				var multi = false;
				var url = "/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/";
				var oModelData = new sap.ui.model.odata.ODataModel(url, true);
				var relPath = "/eFormLobs";
				var that = this;
				// var name;
				// var id;
				oModelData.read(relPath, null, [], false, function (oData, response) {
					},
					function (oError) {
						oModelData.fireRequestCompleted();
						var msg = JSON.parse(oError.response.body).error.message.value;
						sap.m.MessageToast.show(msg);
					});
				var oValueHelpDialog_RespDiv = new sap.m.SelectDialog({
					title: "Choose value for LOB",
					items: {
						path: relPath,
						template: new sap.m.StandardListItem({
							title: "{LOB}",
							description: "{SLOB_DESCRIPTION}"
						})
					},
					multiSelect: multi,
					search: function (oEvent) {
						var sValue = oEvent.getParameter("value");
						var oTitleFilter = new sap.ui.model.Filter(
							"SLOB_DESCRIPTION",
							sap.ui.model.FilterOperator.Contains, sValue
						);

						var oFilter = new sap.ui.model.Filter([oTitleFilter], false);
						oEvent.getSource().getBinding("items").filter([oFilter]);

					},

					confirm: function (oEvent) {
						var selected_comp = oEvent.getParameters().selectedItems[0].getDescription();
						var selected_comp_cd = oEvent.getParameters().selectedItems[0].getTitle();
						lobid.setValue(selected_comp_cd);
						lobid.setValueState("None");

					},
				});

				oValueHelpDialog_RespDiv.setModel(oModelData);
				oValueHelpDialog_RespDiv.open();
			},
			_onSubLobValueHelpRequest: function () {
				var sublob = this.getView().byId("title_cofasublob_inp");
				var lob = this.getView().byId("title_cofalob_inp").getValue();
				//var relPath = "eFormLobs?$filter=LOB eq '"+lob+"'";
				var relPath = "/eFormLobs";
				var url = "/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/";
				var oModelData = new sap.ui.model.odata.ODataModel(url, true);
				oModelData.read(relPath, null, [], false, function (oData, response) {
					},
					function (oError) {
						oModelData.fireRequestCompleted();
						var msg = JSON.parse(oError.response.body).error.message.value;
						sap.m.MessageToast.show(msg);
					});
				var oValueHelpDialog_RespDiv = new sap.m.SelectDialog({
					title: "Choose value for SUB-LOB",
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
					// Shipping Point can be searched using Search Bar
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
				oValueHelpDialog_RespDiv.setModel(oModelData);
				oValueHelpDialog_RespDiv.open(); // Opening value help dialog once
				// data is binded to standard list
				// item
			},
			//REQ0737819:DPATEL11:FPDK900086:Batch-2:FAR lob/sublob changes : END
			_onInputValueHelpRequest: function (oEvent) {
				var sDialogName = "Dialog2";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				var oSource = oEvent.getSource();
				var oBindingContext = oSource.getBindingContext();
				var sPath = oBindingContext ? oBindingContext.getPath() : null;
				var oView;
				if (!oDialog) {
					this.getOwnerComponent().runAsOwner(function () {
						oView = sap.ui.xmlview({
							viewName: "spefar.app.view." + sDialogName
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
			},
			_onInputValueHelpRequest1: function (oEvent) {
				var sDialogName = "Dialog5";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				var oSource = oEvent.getSource();
				var oBindingContext = oSource.getBindingContext();
				var sPath = oBindingContext ? oBindingContext.getPath() : null;
				var oView;
				if (!oDialog) {
					this.getOwnerComponent().runAsOwner(function () {
						oView = sap.ui.xmlview({
							viewName: "spefar.app.view." + sDialogName
						});
						this.getView().addDependent(oView);
						oView.getController().setRouter(this.oRouter);
						oView.getController().setValueObject(oSource);
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
			},
			_onInputValueHelpRequest2: function (oEvent) {
				var sDialogName = "Dialog1";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				var oSource = oEvent.getSource();
				var oBindingContext = oSource.getBindingContext();
				var sPath = oBindingContext ? oBindingContext.getPath() : null;
				var oView;
				if (!oDialog) {
					this.getOwnerComponent().runAsOwner(function () {
						oView = sap.ui.xmlview({
							viewName: "spefar.app.view." + sDialogName
						});
						this.getView().addDependent(oView);
						oView.getController().setRouter(this.oRouter);
						oView.getController().setValueObject(oSource);
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
			},

			_onRadioButtonGroupSelect: function () {
				//Begin of changes by NASNANI on 6 sept 2017
				var byc = this.getView().byId("con_byc").getSelected();
				var byt = this.getView().byId("con_byt").getSelected();
				if (byc == false && byt == true) {
					var table = this.getView().byId("component_table");
					table.setVisible(false);
					table.removeAllItems();
					var oTable = this.getView().byId("component_table");
					var aRows = this.getView().getModel().getProperty("/component_far");

					var i = 0;
					var no_of_items = aRows.length;
					var t = no_of_items - 1;
					for (i = t; i >= 0; i--) {
						aRows.splice(i, 1);
					}
					this.getView().getModel().setProperty("/component_far", aRows);

					var table1 = this.getView().byId("sum_component_table");
					table1.setVisible(false);
					this.getView().byId("total_con_amt_box").setVisible(false);
					this.getView().byId("sum_total_con_amt_box").setVisible(false);
					this.getView().byId("update_total_btn").setVisible(false);

					this.getView().byId("local_total_final").setEnabled(true);

				} else {
					var table = this.getView().byId("component_table");
					table.setVisible(true);
					var table1 = this.getView().byId("sum_component_table");
					table1.setVisible(true);
					this.getView().byId("total_con_amt_box").setVisible(true);
					this.getView().byId("sum_total_con_amt_box").setVisible(true);
					this.getView().byId("update_total_btn").setVisible(true);
					this.getView().byId("local_total_final").setEnabled(false);
				} //End of changes by NASNANI on 6 sept 2017
			},

			_onRadioButtonGroupSelect5: function () {},

			//_onRadioButtonGroupSelect9: function() {},
			_onUploadCollectionUploadComplete: function (oEvent) {
				var oFile = oEvent.getParameter("files")[0];
				var iStatus = oFile ? oFile.status : 500;
				var sResponseRaw = oFile ? oFile.responseRaw : "";
				var oSourceBindingContext = oEvent.getSource().getBindingContext();
				var sSourceEntityId = oSourceBindingContext ? oSourceBindingContext.getProperty("") : null;
				var oModel = this.getView().getModel();
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
				var aFiles = oEvent.getParameter("files");
				if (aFiles && aFiles.length) {
					var oFile = aFiles[0];
					var sFileName = oFile.name;
					var oDataModel = this.getView().getModel();
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

			_onButtonPress: function (oEvent) {
				//save button is pressed
				var selectedRequest = this.getView().byId("maintab_requestType").mProperties.value;
				if (selectedRequest == "Change") {
					var mandatory = 0;
					if (this.getView().byId("title_title_inp").getValue() === "") {
						this.getView().byId("title_title_inp").setValueState("Error");
						mandatory = mandatory + 1;
					} else {
						this.getView().byId("title_title_inp").setValueState("None");
						mandatory = mandatory - 1;
					}
					if (this.getView().byId("onbehalfof_inp").getValue() === "") {
						this.getView().byId("onbehalfof_inp").setValueState("Error");
						mandatory = mandatory + 1;
					} else {
						this.getView().byId("onbehalfof_inp").setValueState("None");
						mandatory = mandatory - 1;
					}
					if (this.getView().byId("title_cofalob_inp").getValue() === "") {
						this.getView().byId("title_cofalob_inp").setValueState("Error");
						mandatory = mandatory + 1;
					} else {
						this.getView().byId("title_cofalob_inp").setValueState("None");
						mandatory = mandatory - 1;
					}
					if (this.getView().byId("title_cofasublob_inp").getValue() === "") {
						this.getView().byId("title_cofasublob_inp").setValueState("Error");
						mandatory = mandatory + 1;
					} else {
						this.getView().byId("title_cofasublob_inp").setValueState("None");
						mandatory = mandatory - 1;
					}
					/* Changed by jatin REQ0284063 */

					if (this.getView().byId("maintab_farref_inp").getValue() === "") {
						this.getView().byId("maintab_farref_inp").setValueState("Error");
						mandatory = mandatory + 1;
					} else {
						this.getView().byId("maintab_farref_inp").setValueState("None");
						mandatory = mandatory - 1;
					}
					if (this.getView().byId("expectedloc_inp").getValue() === "") {
						this.getView().byId("expectedloc_inp").setValueState("Error");
						mandatory = mandatory + 1;
					} else {
						this.getView().byId("expectedloc_inp").setValueState("None");
						mandatory = mandatory - 1;
					}
					if (this.getView().byId("projsuper_inp").getValue() === "") {
						this.getView().byId("projsuper_inp").setValueState("Error");
						mandatory = mandatory + 1;
					} else {
						this.getView().byId("projsuper_inp").setValueState("None");
						mandatory = mandatory - 1;
					}
					if (this.getView().byId("maintab_fe_doc_inp").getValue() === "") {
						this.getView().byId("maintab_fe_doc_inp").setValueState("Error");
						mandatory = mandatory + 1;
					} else {
						this.getView().byId("maintab_fe_doc_inp").setValueState("None");
						mandatory = mandatory - 1;
					}

					//REQ0567864:NSONI3:GWDK902066:05/14/2020:Add new change request field for budget:START
					var originalValue = this.getView().byId("maintab_fe_ofb_inp").getValue().split(',').join('');
					originalValue = originalValue === "" ? "0" : originalValue;
					var reqChangeValue = this.getView().byId("maintab_fe_reqChange_inp").getValue().split(',').join('');
					reqChangeValue = reqChangeValue === "" ? "0" : reqChangeValue;
					var revisedValue = parseFloat(originalValue) + parseFloat(reqChangeValue);
					this.getView().getModel().setProperty("/revised_far", new Intl.NumberFormat('en-US').format(revisedValue));
					this.getView().getModel().setProperty("/requested_far", new Intl.NumberFormat('en-US').format(reqChangeValue));
					//REQ0567864:NSONI3:GWDK902066:05/14/2020:Add new change request field for budget:END
				}
				if (selectedRequest == "Create") {
					var mandatory = 0;
					if (this.getView().byId("title_title_inp").getValue() === "") {
						this.getView().byId("title_title_inp").setValueState("Error");
						mandatory = mandatory + 1;
					} else {
						this.getView().byId("title_title_inp").setValueState("None");
						mandatory = mandatory - 1;
					}
					if (this.getView().byId("onbehalfof_inp").getValue() === "") {
						this.getView().byId("onbehalfof_inp").setValueState("Error");
						mandatory = mandatory + 1;
					} else {
						this.getView().byId("onbehalfof_inp").setValueState("None");
						mandatory = mandatory - 1;
					}
					if (this.getView().byId("title_cofalob_inp").getValue() === "") {
						this.getView().byId("title_cofalob_inp").setValueState("Error");
						mandatory = mandatory + 1;
					} else {
						this.getView().byId("title_cofalob_inp").setValueState("None");
						mandatory = mandatory - 1;
					}
					if (this.getView().byId("title_cofasublob_inp").getValue() === "") {
						this.getView().byId("title_cofasublob_inp").setValueState("Error");
						mandatory = mandatory + 1;
					} else {
						this.getView().byId("title_cofasublob_inp").setValueState("None");
						mandatory = mandatory - 1;
					}
					if (this.getView().byId("costcenter_inp").getValue() === "") {
						this.getView().byId("costcenter_inp").setValueState("Error");
						mandatory = mandatory + 1;
					} else {
						this.getView().byId("costcenter_inp").setValueState("None");
						mandatory = mandatory - 1;
					}
					if (this.getView().byId("expectedloc_inp").getValue() === "") {
						this.getView().byId("expectedloc_inp").setValueState("Error");
						mandatory = mandatory + 1;
					} else {
						this.getView().byId("expectedloc_inp").setValueState("None");
						mandatory = mandatory - 1;
					}
					if (this.getView().byId("projsuper_inp").getValue() === "") {
						this.getView().byId("projsuper_inp").setValueState("Error");
						mandatory = mandatory + 1;
					} else {
						this.getView().byId("projsuper_inp").setValueState("None");
						mandatory = mandatory - 1;
					}
					if (this.getView().byId("telephone").getValue() === "") {
						this.getView().byId("telephone").setValueState("Error");
						mandatory = mandatory + 1;
					} else {
						this.getView().byId("telephone").setValueState("None");
						mandatory = mandatory - 1;
					}
					if (this.getView().byId("sch_compdate_inp").getValue() === "") {
						this.getView().byId("sch_compdate_inp").setValueState("Error");
						mandatory = mandatory + 1;
					} else {
						this.getView().byId("sch_compdate_inp").setValueState("None");
						mandatory = mandatory - 1;
					}
				}
				var curr_view = this.getView();
				// REQ0591945:NSONI3:GWDK902117:08/27/2020:update function from getText to getValue:START
				var TOTALUSD = this.getView().byId("usd_total_final").getValue().split(',').join('');
				// REQ0591945:NSONI3:GWDK902117:08/27/2020:update function from getText to getValue:END
				var TOTALLOC = this.getView().byId("local_total_final").getValue().split(',').join('');
				var s = {};
				s.PROJ_DESC = this.getView().byId("title_desc_inp").getValue();
				s.REQUEST_TYPE = this.getView().byId("maintab_requestType").mProperties.value;
				s.LOCALCURRENCY = this.getView().byId("localcurrency_inp").mProperties.value;
				s.TOTALUSD = TOTALUSD;
				s.TOTALLOC = TOTALLOC;
				// REQ0591945:NSONI3:GWDK902117:08/27/2020:Add Exchange Rate:START
				s.EXCHANGE_RATE = this.getView().byId("EXCHANGE_RATE").getValue();
				// REQ0591945:NSONI3:GWDK902117:08/27/2020:Add Exchange Rate:END

				if (window.status == 'In Approval') {
					s.STATUS = "In Approval";
					s.ACTION = "SAVE";
				}
				if (window.status == 'Data Saved') {
					s.STATUS = "Data Saved";
					s.ACTION = "SAVE";
				}
				if (window.status == 'Withdrawn') {
					s.STATUS = "Data Saved";
					s.ACTION = "SAVE";
				}
				if (window.status == 'Rejected') {
					s.STATUS = "Rejected";
					s.ACTION = "SAVE";
				}

				if (window.status == "") {
					s.STATUS = "Data Saved";
					s.ACTION = "SAVE";
				}

				s.STATUS_R = window.isreject;
				s.DESC_BJ = this.getView().byId("maintab_fe_dabj_inp").getValue();
				s.DESC_CHANGE = this.getView().byId("maintab_fe_doc_inp").getValue();
				s.THIS_CHANGE = this.getView().byId("maintab_fe_tc_inp").getValue();
				s.REV_FAR_BUDGET = this.getView().byId("maintab_fe_rfb_inp").getValue().split(',').join('');
				s.ORIG_FAR_BUDGET = this.getView().byId("maintab_fe_ofb_inp").getValue().split(',').join('');
				s.DATE_SUBMITTED = this.getView().byId("maintab_fe_ds_inp").getValue();
				s.SCH_COMPDATE = this.getView().byId("sch_compdate_inp").getValue();
				s.TELEPHONE = this.getView().byId("telephone").getValue();
				s.PROJ_SUPER = this.getView().byId("projsuper_inp").getValue();
				s.EXP_LOC = this.getView().byId("expectedloc_inp").getValue();

				s.WBS = this.getView().byId("wbs_inp").getValue();
				s.COMPANY_CODE = this.getView().byId("companycode_inp").getValue();
				s.COST_CENTER = this.getView().byId("costcenter_inp").getValue();
				s.FAR_REF = this.getView().byId("maintab_farref_inp").getValue();
				s.COFA_SUBLOB = this.getView().byId("title_cofasublob_inp").getValue();
				s.COFA_LOB = this.getView().byId("title_cofalob_inp").getValue();
				s.REQUESTER_PHONE = this.getView().byId("title_reqphone_inp").getValue();
				s.REQUESTER_EMAIL = this.getView().byId("title_reqemail_inp").getValue();
				s.PREPARER = this.getView().byId("title_prep_inp").getValue();
				s.ON_BEHALF_OF = this.getView().byId("onbehalfof_inp").getValue();
				s.TITLE = this.getView().byId("title_title_inp").getValue();
				var oModel = this.getView().getModel();
				var aRows = oModel.getProperty("/component_far");
				var loccurrency = this.getView().byId("localcurrency_inp").mProperties.value;
				s.headercomp_n = [];
				for (var t = 0; t < aRows.length; t++) {

					if (aRows[t].description != "") {
						s.headercomp_n.push({
							COMP_CURR: loccurrency,
							COMP_AMT: aRows[t].amount.split(',').join(''),
							COMP_DESC: aRows[t].description,
							COMP_ITEMNO: String(t + 1),
							EFORM_NUM: window.eform_num
						});
					}

				}
				if (window.eform_num == "1") {
					s.APPROVERS_DET = "";
					s.EFORM_NUM = "1";
					var gatewayUrl = "/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/";
					var oModel = new sap.ui.model.odata.ODataModel(gatewayUrl, true);
					var that88 = this;
					oModel.create("/eFormHeaders", s, null, function (oData, response) {
						window.eform_num = response.data.EFORM_NUM;
						if (window.eform_num != "1") {
							that88.getView().byId("title_eform_no").setText(window.eform_num);
						}
						window.eform_approvers = response.data.APPROVERS_DET;
						window.farformsavetext = response.data.MSG;
						var oModel = that88.getView().getModel();
						var usd_total_final = oModel.getProperty("/usd_tot_final");
						var totalUSD = response.data.TOTALUSD;
						var totalUsdFinal = new Intl.NumberFormat('en-US').format(totalUSD);
						// REQ0591945:NSONI3:GWDK902117:08/27/2020:Remove USD from total value:START
						// oModel.setProperty("/usd_tot_final", totalUsdFinal + ' USD');
						oModel.setProperty("/usd_tot_final", totalUsdFinal);
						// REQ0591945:NSONI3:GWDK902117:08/27/2020:Remove USD from total value:END

					});
				} else {
					s.APPROVERS_DET = "X";
					s.EFORM_NUM = window.eform_num;
					var b = curr_view.byId("approvers_table").getItems();
					s.headerapprover_n = [];
					for (var i = 0; i < b.length; i++) {
						var D = {};
						D.EFORM_NUM = window.eform_num;
						D.ORGLEVEL = "";
						D.SEQUENCE = String(i + 1);
						if (b[i].mAggregations.cells[0].getSelected() === true) {
							D.APPROVED = "X";
						} else {
							D.APPROVED = "";
						}
						D.REVIEWER_TYPE = b[i].mAggregations.cells[2].getText();
						D.APPROVED_BY = b[i].mAggregations.cells[3].getText();
						D.APPROVAL_DT = b[i].mAggregations.cells[4].getText();
						D.APPROVAL_TM = b[i].mAggregations.cells[5].getText();
						D.ADDED_BY = b[i].mAggregations.cells[7].getText();
						D.CREATION_DT = b[i].mAggregations.cells[8].getText();
						if (b[i].mAggregations.cells[6].getSelected() === true) {
							D.MANUAL = "X";
						} else {
							D.MANUAL = "";
						}
						// REQ0602256:NSONI3:GWDK902233:02/24/2021:call getValue or getText based on html elemnt type:START
						if (b[i].mAggregations.cells[1].mProperties.value !== undefined) {
							D.APPR = b[i].mAggregations.cells[1].getValue();
						} else {
							D.APPR = b[i].mAggregations.cells[1].getText();
						}
						// REQ0602256:NSONI3:GWDK902233:02/24/2021:call getValue or getText based on html elemnt type:END
						if (D.APPR != "") {
							s.headerapprover_n[i] = D;
						}

					}
					var gatewayUrl = "/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/";
					var oModel = new sap.ui.model.odata.ODataModel(gatewayUrl, true);
					var that88 = this;
					oModel.create("/eFormHeaders", s, null, function (oData, response) {
						window.farformsavetext = response.data.MSG;

						if (window.eform_num != "1") {
							that88.getView().byId("title_eform_no").setText(window.eform_num);
						}
					});
				}
				if (window.eform_num != "1") {
					this.getView().byId("page").setText("Fixed Asset Request - " + window.eform_num);

				}
				// this.getView().byId("withdrawBtn").setEnabled(true);
				//call and get approvers.
				var gatewayUrl = "/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/";
				var oModel = new sap.ui.model.odata.ODataModel(gatewayUrl, true);
				var relPath = "eFormApprovers?$filter=EFORM_NUM eq '" + window.eform_num + "'";
				var oTable = this.getView().byId("approvers_table");
				oModel.read(relPath, null, [], false, function (oData, response) {
					var counter = response.data.results.length;
					var i = 0;
					var oMod = window.oModel;
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
							approved: response.data.results[i].APPROVED,
							approver: response.data.results[i].APPR,
							reviewer_type: response.data.results[i].REVIEWER_TYPE,
							approved_by: response.data.results[i].APPROVED_BY,
							approval_date: response.data.results[i].APPROVAL_DT,
							approval_time: response.data.results[i].APPROVAL_TM,
							manual_addition: response.data.results[i].MANUAL,
							added_by: response.data.results[i].ADDED_BY,
							added_on: response.data.results[i].CREATION_DT,
							can_edit: Boolean(0),
							// REQ0602256:NSONI3:GWDK902117:01/18/2021:add grp link:START
							grp: response.data.results[i].GRP === "X" ? true : false
								// REQ0602256:NSONI3:GWDK902117:01/18/2021:add grp link:END
						};
						apRows.push(item);
					}
					oMod.setProperty("/approvers", apRows);
				});
				var dialogName = "Dialog3";
				var oSource = oEvent.getSource();
				this.dialogs = this.dialogs || {};
				var dialog = this.dialogs[dialogName];
				var view;
				if (!dialog) {
					view = sap.ui.xmlview({
						viewName: "spefar.app.view." + dialogName
					});
					dialog = view.getContent()[0];
					this.dialogs[dialogName] = dialog;
				}
				sap.ui.controller("spefar.app.controller.Dialog3").setresult(window.farformsavetext);
				dialog.open();
			},

			_onObjectMatched: function (oEvent) {
				// Displaying handled
				var eform_dsp = oEvent.getParameters().arguments.context;
				if (eform_dsp !== undefined) {
					if (eform_dsp.toLowerCase().indexOf("copy") > -1) {
						var array = eform_dsp.split('#');
						eform_dsp = array[0];
						copy_case = "X";
						window.eform_num = "1";
						this.getView().byId("PAGE_TITLE").setTitle("Fixed Asset Request");
					} else {
						copy_case = "";
					}
					if (copy_case !== "X") {
						window.eform_num = eform_dsp;
						this.getView().byId("PAGE_TITLE").setTitle("Fixed Asset Request - " + eform_dsp);
					}

					var url = "/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/";
					var oModelData = new sap.ui.model.odata.ODataModel(url, true);
					var relPath = "eFormGeneralInfos('" + window.eform_num + "')";
					var that = this;
					oModelData.read(relPath, null, [], false, function (oData, response) {
						if (response.data.STATUS == 'X') {
							window.can_edit = '';
						} else {
							window.can_edit = 'X';
						}
					});

					var relPath = "eFormGeneralInfos('1')";
					oModelData.read(relPath, null, [], false, function (oData, response) {
						window.logged_in_user = response.data.NAME;

					});

					var url = "/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/";
					var oModelData = new sap.ui.model.odata.ODataModel(url, true);
					var relPath = "/eFormHeaders?$filter=EFORM_NUM eq '" + eform_dsp + "'&$expand=headercomp_n,headerapprover_n&$format=json";
					var that = this;
					this.getView().byId("EDIT").setVisible(true);
					oModelData.read(relPath, null, [], false, function (oData, response) {

						if (response.data.results[0].EFORM_NUM == "X") {
							//User is not authorized to view the eform
							sap.m.MessageToast.show("You are not authorized to view the eForm");
							that._onPageNavButtonPress();
							return;
						}

						var totalUsd, totalUsdFinal, ORIG_FAR_BUDGET, REV_FAR_BUDGET;
						if (response.data.results[0].TOTALLOC) {
							var totalUSD = response.data.results[0].TOTALLOC;
							totalUsd = new Intl.NumberFormat('en-US').format(totalUSD);
						}
						if (response.data.results[0].TOTALUSD) {
							var totalUSD = response.data.results[0].TOTALUSD;
							totalUsdFinal = new Intl.NumberFormat('en-US').format(totalUSD);
						}
						if (response.data.results[0].ORIG_FAR_BUDGET) {
							var totalUSD = response.data.results[0].ORIG_FAR_BUDGET;
							ORIG_FAR_BUDGET = new Intl.NumberFormat('en-US').format(totalUSD);
						}
						if (response.data.results[0].REV_FAR_BUDGET) {
							var totalUSD = response.data.results[0].REV_FAR_BUDGET;
							REV_FAR_BUDGET = new Intl.NumberFormat('en-US').format(totalUSD);
						}
						//REQ0567864:NSONI3:GWDK902066:05/11/2020:Add new change request field for budget:START
						var requested_far_val = new Intl.NumberFormat('en-US').format("0");
						if (copy_case !== "X") {
							var reqValue = response.data.results[0].REV_FAR_BUDGET - response.data.results[0].ORIG_FAR_BUDGET;
							requested_far_val = new Intl.NumberFormat('en-US').format(reqValue);
						}
						if (copy_case === "X") {
							var originalValue = ORIG_FAR_BUDGET.split(',').join('');
							originalValue = originalValue === "" ? "0" : originalValue;
							var temp = requested_far_val.split(',').join('');
							temp = temp === "" ? "0" : temp;
							REV_FAR_BUDGET = new Intl.NumberFormat('en-US').format(parseFloat(originalValue) + parseFloat(temp));
						}
						//REQ0567864:NSONI3:GWDK902066:05/11/2020:Add new change request field for budget:END	

						var tabData = {
							form_no: response.data.results[0].EFORM_NUM,
							project_title: response.data.results[0].TITLE,
							request_type: response.data.results[0].REQUEST_TYPE,
							project_desc: response.data.results[0].PROJ_DESC,
							preparer: response.data.results[0].PREPARER,
							onbehalfof: response.data.results[0].ON_BEHALF_OF,
							reqphone: response.data.results[0].REQUESTER_PHONE,
							reqemail: response.data.results[0].REQUESTER_EMAIL,
							cofa_lob: response.data.results[0].COFA_LOB,
							cofa_sublob: response.data.results[0].COFA_SUBLOB,
							far_ref: response.data.results[0].FAR_REF,
							cost_center: response.data.results[0].COST_CENTER,
							comp_code: response.data.results[0].COMPANY_CODE,
							wbs: response.data.results[0].WBS,
							exp_loc: response.data.results[0].EXP_LOC,
							proj_super: response.data.results[0].PROJ_SUPER,
							tel: response.data.results[0].TELEPHONE,
							sch_comp: response.data.results[0].SCH_COMPDATE,
							date_sub: response.data.results[0].DATE_SUBMITTED,
							original_far: ORIG_FAR_BUDGET,
							//REQ0567864:NSONI3:GWDK902066:05/11/2020:Add new change request field for budget:START
							requested_far: requested_far_val,
							//REQ0567864:NSONI3:GWDK902066:05/11/2020:Add new change request field for budget:END
							revised_far: REV_FAR_BUDGET,
							this_change: response.data.results[0].THIS_CHANGE,
							desc_change: response.data.results[0].DESC_CHANGE,
							desc_bus_change: response.data.results[0].DESC_BJ,
							loc_currency: response.data.results[0].LOCALCURRENCY,
							localcurrency: [{
								name: "",
								exch: ""
							}],
							rwb_component: 1,
							component_far: [{
								id: 1,
								description: "",
								amount: ""
							}],
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
								can_edit: Boolean(0),
								grp: false
							}],
							//loc_tot_final: totalUsd + ' ' + response.data.results[0].LOCALCURRENCY,
							loc_tot_final: totalUsd,
							// REQ0591945:NSONI3:GWDK902117:08/27/2020:Remove 'USD' from total:START
							usd_tot_final: totalUsdFinal,
							// REQ0591945:NSONI3:GWDK902117:08/27/2020:Remove 'USD' from total:END
							far_number: "",
							requestmode: Boolean(0),
							comp_table_mode: Boolean(0),
							//REQ0591945:NSONI3:GWDK902117:08/25/2020:Add new exchange rate field:START
							EXCHANGE_RATE: response.data.results[0].EXCHANGE_RATE
								//REQ0591945:NSONI3:GWDK902117:08/25/2020:Add new exchange rate field:END
						};
						// creating a new data model
						var oModelTab1 = new sap.ui.model.json.JSONModel();
						//setting the data in the model
						oModelTab1.setData(tabData);
						oModelTab1.setSizeLimit(1000);
						that.getView().setModel(oModelTab1);
						window.oModel = that.getView().getModel();
						window.preparer = response.data.results[0].PREPARER;
						window.userid = response.data.results[0].ON_BEHALF_OF;
						window.phone = response.data.results[0].REQUESTER_PHONE;
						window.email = response.data.results[0].REQUESTER_EMAIL;
						window.projsuper_userid = response.data.results[0].PROJ_SUPER;
						window.projsuper_tel = response.data.results[0].TELEPHONE;
						window.status = response.data.results[0].STATUS;
						window.isreject = response.data.results[0].STATUS_R;
						var totalLOC = new Intl.NumberFormat('en-US').format(response.data.results[0].TOTALLOC);
						that.getView().byId("total_component_amt").setText(totalLOC + ' ' + response.data.results[0].LOCALCURRENCY);
						that.getView().byId("sum_tot_comp_amt").setText(totalLOC + ' ' + response.data.results[0].LOCALCURRENCY);

						that.getView().byId("page").setText("Fixed Asset Request - " + window.eform_num);

						//********** started nsoni 04/14/2021
						window.wbs_field_visibility_status = response.data.results[0].WBS_VISIBLITY_FLG;
						//********** ended nsoni 04/14/2021

						if (copy_case != "X") {

							var url = "/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/";
							var oModelData = new sap.ui.model.odata.ODataModel(url, true);
							var relPath = "eFormGeneralInfos('1')";
							var that8 = that;
							oModelData.read(relPath, null, [], false, function (oData, response) {
								if (window.preparer == response.data.NAME || window.userid == response.data.NAME) {
									if (window.status == 'In Approval') {
										that8.getView().byId("withdrawBtn").setEnabled(true);
									}
								}

							});

							var oTable = that.getView().byId("approvers_table");
							var counter = response.data.results[0]["headerapprover_n"].results.length;
							var i = 0;
							var oMod = that.getView().getModel();
							var apRows = oMod.getProperty("/approvers");
							var no_of_items = apRows.length;
							var t = no_of_items - 1;
							for (i = t; i >= 0; i--) {
								apRows.splice(i, 1);
							}
							oMod.setProperty("/approvers", apRows);
							for (i = 0; i < counter; i++) {
								var item = {
									approved: response.data.results[0]["headerapprover_n"].results[i].APPROVED,
									approver: response.data.results[0]["headerapprover_n"].results[i].APPR,
									reviewer_type: response.data.results[0]["headerapprover_n"].results[i].REVIEWER_TYPE,
									approved_by: response.data.results[0]["headerapprover_n"].results[i].APPROVED_BY,
									approval_date: response.data.results[0]["headerapprover_n"].results[i].APPROVAL_DT,
									approval_time: response.data.results[0]["headerapprover_n"].results[i].APPROVAL_TM,
									manual_addition: response.data.results[0]["headerapprover_n"].results[i].MANUAL,
									added_by: response.data.results[0]["headerapprover_n"].results[i].ADDED_BY,
									added_on: response.data.results[0]["headerapprover_n"].results[i].CREATION_DT,
									can_edit: Boolean(0),
									// REQ0602256:NSONI3:GWDK902117:01/18/2021:add grp link:START
									grp: response.data.results[0]["headerapprover_n"].results[i].GRP === "X" ? true : false
										// REQ0602256:NSONI3:GWDK902117:01/18/2021:add grp link:END
								};
								apRows.push(item);
							}
							oMod.setProperty("/approvers", apRows);
							that.getView().byId("saveBtn").setEnabled(true);
							that.getView().byId("submitBtn").setEnabled(true);

						} else {
							that.getView().byId("saveBtn").setEnabled(false);
							that.getView().byId("submitBtn").setEnabled(false);

						}

						var oTable = that.getView().byId("component_table");
						var aRows = window.oModel.getProperty("/component_far");
						var counter = response.data.results[0]["headercomp_n"].results.length;
						if (counter > 0) {
							var rbw_comp = window.oModel.getProperty("/rwb_component");
							rbw_comp = 0;
							window.oModel.setProperty("/rwb_component", rbw_comp);
						}
						var i = 0;
						var no_of_items = aRows.length;
						var t = no_of_items - 1;
						for (i = t; i >= 0; i--) {
							aRows.splice(i, 1);
						}
						window.oModel.setProperty("/component_far", aRows);
						for (i = 0; i < counter; i++) {
							var item = {
								id: response.data.results[0]["headercomp_n"].results[i].COMP_ITEMNO,
								description: response.data.results[0]["headercomp_n"].results[i].COMP_DESC,
								amount: response.data.results[0]["headercomp_n"].results[i].COMP_AMT
							};
							aRows.push(item);
						}
						window.oModel.setProperty("/component_far", aRows);
						that._onRadioButtonGroupSelect();
						that.changeOfRequestType();
						//odata call ends here
					});
					window.gen_info_onbehalfofinp_field = this.getView("FarRequest").byId("onbehalfof_inp");
					window.gen_info_reqphoneinp_field = this.getView("FarRequest").byId("title_reqphone_inp");
					window.gen_info_reqemailinp_field = this.getView("FarRequest").byId("title_reqemail_inp");
					window.maininfo_costcenterinp_field = this.getView("FarRequest").byId("costcenter_inp");
					window.maininfo_companycodeinp_field = this.getView("FarRequest").byId("companycode_inp");
					window.currview = this.getView("FarRequest");
					var relPath = "eFormLocCurrencies";
					oModelData.read(relPath, null, [], false, function (oData, response) {
						var counter = response.data.results.length;
						var i = 0;
						var oModel = window.oModel;
						var aRows = oModel.getProperty("/localcurrency");
						for (i = 0; i < counter; i++) {
							var item = {
								name: response.data.results[i].NAME,
								exch: response.data.results[i].EXCH
							};
							aRows.push(item);
						}
						oModel.setProperty("/localcurrency", aRows);
					});
					if (copy_case != "X") {
						var url = "/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/";
						var oModelData = new sap.ui.model.odata.ODataModel(url, true);
						var relPath = "eFormComments?$filter=FORM_NO eq '" + window.eform_num + "'";
						var that = this;
						oModelData.read(relPath, null, [], false, function (oData, response) {
							that.getView().byId("comments_table").destroyItems();
							var counter = response.data.results.length;
							var i = 0;
							for (i = 0; i < counter; i++) {
								var table = that.getView().byId("comments_table");
								var vedit = response.data.results[i].EDIT;
								var data = new sap.m.ColumnListItem({
									cells: [
										new sap.m.Text({
											text: response.data.results[i].SEQUENCE
										}),
										new sap.m.TextArea({
											value: response.data.results[i].COMMENTS,
											rows: 2,
											cols: 70,
											enabled: vedit
										}),
										new sap.m.Text({
											text: response.data.results[i].CREATOR
										}),
										new sap.m.Text({
											text: response.data.results[i].CR_DATE
										})
									]
								})
								table.addItem(data);
							}
						});
						var url = "/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/";
						var oModelData = new sap.ui.model.odata.ODataModel(url, true);
						var relPath = "eFormAttachments?$filter=EFORM_NUM eq '" + window.eform_num + "'";
						var that = this;
						oModelData.read(relPath, null, [], false, function (oData, response) {
							that.getView().byId("attachments").destroyItems();
							var counter = response.data.results.length;
							var i = 0;
							var selected_box;
							var license_cost;
							for (i = 0; i < counter; i++) {
								var table = that.getView().byId("attachments");
								var data = new sap.m.ColumnListItem({
									cells: [
										new sap.m.Link({
											text: response.data.results[i].FILE_NAME,
											press: function (oEvent) {
												var that2 = that;
												var oSource = oEvent.getSource();
												var relPath = "/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/eFormAttachments(EFORM_NUM='" + window.eform_num + "'" +
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
								table.addItem(data);
							}
						});
					}

					if (window.status == "In Approval") {

						this.getView().byId("saveBtn").setVisible(true);
						this.getView().byId("submitBtn").setVisible(false);
						this.getView().byId("withdrawBtn").setVisible(true);
						this.getView().byId("b_approve").setVisible(true);

						if (window.isreject == "Rejected") {
							this.getView().byId("b_reject").setVisible(false);
						} else {
							this.getView().byId("b_reject").setVisible(true);
						}

						this.getView().byId("EDIT").setVisible(true);
						if (window.top.location.href.toLowerCase().indexOf("fiorilaunchpad") == -1) {
							//S4R:NSONI3:GWDK902360:07/22/2021:Seting visibility of home icon false:START
							this.getView().byId("HOME").setVisible(false);
							//S4R:NSONI3:GWDK902360:07/22/2021:Seting visibility of home icon false:END
						}
						this.getView().byId("DELETE").setVisible(true);
					}

					if (window.status == "Data Saved") {

						this.getView().byId("saveBtn").setVisible(true);
						this.getView().byId("submitBtn").setVisible(true);
						this.getView().byId("withdrawBtn").setVisible(false);
						this.getView().byId("b_approve").setVisible(false);
						this.getView().byId("b_reject").setVisible(false);
						this.getView().byId("EDIT").setVisible(true);
						this.getView().byId("HOME").setVisible(false);
						this.getView().byId("DELETE").setVisible(true);

					}

					if (window.status == "Withdrawn") {

						this.getView().byId("saveBtn").setVisible(true);
						this.getView().byId("submitBtn").setVisible(true);
						this.getView().byId("withdrawBtn").setVisible(false);
						this.getView().byId("b_approve").setVisible(false);
						this.getView().byId("b_reject").setVisible(false);
						this.getView().byId("EDIT").setVisible(true);
						this.getView().byId("HOME").setVisible(false);
						this.getView().byId("DELETE").setVisible(true);

					}

					if (window.status == "Approved") {

						this.getView().byId("saveBtn").setVisible(false);
						this.getView().byId("submitBtn").setVisible(false);
						this.getView().byId("withdrawBtn").setVisible(false);
						this.getView().byId("b_approve").setVisible(false);
						this.getView().byId("b_reject").setVisible(false);
						this.getView().byId("EDIT").setVisible(true);
						if (window.top.location.href.toLowerCase().indexOf("fiorilaunchpad") == -1) {
							//S4R:NSONI3:GWDK902360:07/22/2021:Seting visibility of home icon false:START
							this.getView().byId("HOME").setVisible(false);
							//S4R:NSONI3:GWDK902360:07/22/2021:Seting visibility of home icon false:END
						}
						this.getView().byId("DELETE").setVisible(true);

					}

					if (copy_case == "X") {
						window.status = "";
						var oModel = window.oModel;
						var editmode = oModel.getProperty("/requestmode");
						editmode = Boolean(1);
						oModel.setProperty("/requestmode", editmode);
						var editmode1 = oModel.getProperty("/comp_table_mode");
						editmode1 = Boolean(1);
						oModel.setProperty("/comp_table_mode", editmode1);

						this.getView().byId("maintab_fe_ds_inp").setValue("");
						this.getView().byId("page").setText("Fixed Asset Request");

						this.getView().byId("saveBtn").setVisible(true);
						this.getView().byId("submitBtn").setVisible(true);
						this.getView().byId("submitBtn").setEnabled(true);
						this.getView().byId("withdrawBtn").setVisible(false);
						this.getView().byId("b_approve").setVisible(false);
						this.getView().byId("b_reject").setVisible(false);
						this.getView().byId("EDIT").setVisible(false);
						this.getView().byId("HOME").setVisible(false);
						this.getView().byId("DELETE").setVisible(false);

						this.getView().byId("title_eform_no").setText("");
						var url = "/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/";
						var oModelData = new sap.ui.model.odata.ODataModel(url, true);
						var relPath = "eFormGeneralInfos('1')";
						oModelData.read(relPath, null, [], false, function (oData, response) {
							window.preparer = response.data.NAME;
							window.userid = response.data.USERID;
							window.phone = response.data.PHONE;
							window.email = response.data.EMAIL;
						});
						this.getView().byId("title_prep_inp").setValue(window.preparer);
						this.getView().byId("onbehalfof_inp").setValue(window.preparer);
						this.getView().byId("title_reqphone_inp").setValue(window.phone);
						this.getView().byId("title_reqemail_inp").setValue(window.email);
						var url = "/sap/opu/odata/sap/YFPSFIPFRDD0015_EFORM_SRV/";
						var oModelData = new sap.ui.model.odata.ODataModel(url, true);
						var relPath = "eFormUsers(NAME='',FORM='FAR')";
						var that11 = this;
						oModelData.read(relPath, null, [], false, function (oData, response) {
							if (response.data.PAYMENT_MGR == 'X') {
								that11.getView().byId("wbs_inp").setValue("");
								that11.getView().byId("wbs_inp").setEnabled(true);

							} else {
								that11.getView().byId("wbs_inp").setEnabled(false);
							}
						});

						//REQ0602256:NSONI3:GWDK902117:02/02/2021:WBS field enable/disbale changes:START
						this.getView("FarRequest").byId("costcenter_inp").setValue("");
						this.getView().getModel().setProperty("cost_center", "");
						//REQ0602256:NSONI3:GWDK902227:02/09/2021:WBS field enable/disbale changes:START
						this.getView("FarRequest").byId("wbs_inp").setValue("");
						this.getView().getModel().setProperty("wbs", "");
						//REQ0602256:NSONI3:GWDK902227:02/09/2021:WBS field enable/disbale changes:END
						window.wbs_input_field = this.getView("FarRequest").byId("wbs_inp");
						//REQ0602256:NSONI3:GWDK902117:02/02/2021:WBS field enable/disbale changes:END

					} else {
						var oModel = window.oModel;
						var editmode = oModel.getProperty("/requestmode");
						editmode = Boolean(0);
						var editmode1 = oModel.getProperty("/comp_table_mode");
						editmode1 = Boolean(0);
						oModel.setProperty("/comp_table_mode", editmode1);
						oModel.setProperty("/requestmode", editmode);
						// this.getView().byId("saveBtn").setEnabled(false);
						// this.getView().byId("submitBtn").setEnabled(false);
						// this.getView().byId("EDIT").setVisible(true);
						this.getView().byId("wbs_inp").setEnabled(false);
						var url = "/sap/opu/odata/sap/YFPSFIPFRDD0015_EFORM_SRV/";
						var oModelData = new sap.ui.model.odata.ODataModel(url, true);
						var relPath = "eFormUsers(NAME='',FORM='FAR')";
						var that11 = this;
						oModelData.read(relPath, null, [], false, function (oData, response) {
							if (response.data.PAYMENT_MGR == 'X') {
								if (window.status == 'In Approval')

								{
									//that11.getView().byId("wbs_inp").setValue("");
									// that11.getView().byId("saveBtn").setEnabled(true);
									that11.getView().byId("wbs_inp").setEnabled(true);

								} else {
									that11.getView().byId("wbs_inp").setEnabled(false);
								}

							} else {
								that11.getView().byId("wbs_inp").setEnabled(false);
							}

						});
					}

					var url = "/sap/opu/odata/sap/YFPSFIPFRDD0015_EFORM_SRV/";
					var oModelData = new sap.ui.model.odata.ODataModel(url, true);
					var relPath = "eFormUsers(NAME='',FORM='ADMIN')";
					var that21 = this;
					oModelData.read(relPath, null, [], false, function (oData, response) {
						if (response.data.ADMIN == 'X' || response.data.NAME == that21.getView().byId("title_prep_inp").getValue() || response.data.NAME ==
							that21.getView().byId("onbehalfof_inp").getValue()) {
							that21.getView().byId("DELETE").setVisible(true);
						} else {
							that21.getView().byId("DELETE").setVisible(false);
						}

					});

					if (window.status != "Approved") {

						this.getView().byId("ADD_APP").setEnabled(true);
						this.getView().byId("DEL_APP").setEnabled(true);
						this.getView().byId("REVIEWER_TYPE").setEnabled(true);
						this.getView().byId("ENTRY_SEQUENCE").setEnabled(true);
						//  this.getView().byId("saveBtn").setEnabled(true);

					} else {

						this.getView().byId("ADD_APP").setEnabled(false);
						this.getView().byId("DEL_APP").setEnabled(false);
						this.getView().byId("REVIEWER_TYPE").setEnabled(false);
						this.getView().byId("ENTRY_SEQUENCE").setEnabled(false);
						// this.getView().byId("saveBtn").setEnabled(false);

					}

					var rwb = window.oModel.getProperty("/rwb_component");
					if (copy_case != "X") {
						this.getView().byId("local_total_final").setEnabled(false);

					} else {
						if (rwb == 0) {
							this.getView().byId("local_total_final").setEnabled(false);

						} else {
							this.getView().byId("local_total_final").setEnabled(true);
						}
					}

					// Enabling all buttons
					this.getView().byId("saveBtn").setEnabled(true);
					this.getView().byId("submitBtn").setEnabled(true);
					this.getView().byId("submitBtn").setEnabled(true);
					this.getView().byId("withdrawBtn").setEnabled(true);
					this.getView().byId("b_approve").setEnabled(true);
					this.getView().byId("b_reject").setEnabled(true);

				} else {
					//for create scenerio
					createscene = 'X';
					this.getView().byId("EDIT").setVisible(false);
					window.gen_info_onbehalfofinp_field = this.getView("FarRequest").byId("onbehalfof_inp");
					window.gen_info_reqphoneinp_field = this.getView("FarRequest").byId("title_reqphone_inp");
					window.gen_info_reqemailinp_field = this.getView("FarRequest").byId("title_reqemail_inp");
					window.maininfo_costcenterinp_field = this.getView("FarRequest").byId("costcenter_inp");
					window.maininfo_companycodeinp_field = this.getView("FarRequest").byId("companycode_inp");
					window.currview = this.getView("FarRequest");
					window.eform_num = "";
					window.projsuper_userid = "";
					window.projsuper_tel = "";
					//End of changes by NASNANI on 6 sept 2017

					//REQ0602256:NSONI3:GWDK902117:02/02/2021:WBS field enable/disbale changes:START
					window.wbs_input_field = this.getView("FarRequest").byId("wbs_inp");
					//REQ0602256:NSONI3:GWDK902117:02/02/2021:WBS field enable/disbale changes:END

					//Begin of changes by NASNANI on 7 sept 2017
					//Below is sampel data. It will be filled from ODATA service for Change/Display/Edit/Copy
					var tabData = {
						form_num: "",
						project_title: "",
						project_desc: "",
						preparer: "",
						onbehalfof: "",
						reqphone: "",
						reqemail: "",
						cofa_lob: "",
						cofa_sublob: "",
						request_type: "No Choice",
						far_ref: "",
						cost_center: "",
						comp_code: "",
						wbs: "",
						exp_loc: "",
						proj_super: "",
						tel: "",
						sch_comp: "",
						date_sub: "",
						original_far: "",
						//REQ0567864:NSONI3:GWDK902066:05/11/2020:Add new change request field for budget:START
						requested_far: "",
						//REQ0567864:NSONI3:GWDK902066:05/11/2020:Add new change request field for budget:END
						revised_far: "",
						this_change: "",
						desc_change: "",
						desc_bus_change: "",
						loc_currency: "",
						localcurrency: [{
							name: "",
							exch: ""
						}],
						rwb_component: 1,
						component_far: [{
							id: 1,
							description: "",
							amount: ""
						}],
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
						loc_tot_final: "0",
						usd_tot_final: "0",
						far_number: "",
						//REQ0591945:NSONI3:GWDK902117:08/25/2020:Add new exchange rate field:START
						EXCHANGE_RATE: ""
							//REQ0591945:NSONI3:GWDK902117:08/25/2020:Add new exchange rate field:END
					};
					// craeting a new data model
					var oModelTab = new sap.ui.model.json.JSONModel();
					//setting the data in the model
					oModelTab.setData(tabData);
					oModelTab.setSizeLimit(1000);
					this.getView().setModel(oModelTab);
					window.oModel = this.getView().getModel();
					//End of changes by NASNANI on 7 sept 2017
					var url = "/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/";
					var oModelData = new sap.ui.model.odata.ODataModel(url, true);
					var relPath = "eFormGeneralInfos('1')";
					oModelData.read(relPath, null, [], false, function (oData, response) {
						window.preparer = response.data.NAME;
						window.logged_in_user = response.data.NAME;
						window.userid = response.data.USERID;
						window.phone = response.data.PHONE;
						window.email = response.data.EMAIL;
					});
					var relPath = "eFormLocCurrencies";
					oModelData.read(relPath, null, [], false, function (oData, response) {
						var counter = response.data.results.length;
						var i = 0;
						var oModel = window.oModel;
						var aRows = oModel.getProperty("/localcurrency");
						for (i = 0; i < counter; i++) {
							var item = {
								name: response.data.results[i].NAME,
								exch: response.data.results[i].EXCH
							};
							aRows.push(item);
						}
						oModel.setProperty("/localcurrency", aRows);
					});

					this.getView().byId("wbs_inp").setEnabled(true);
					this.getView().byId("title_prep_inp").setValue(window.preparer);
					this.getView().byId("onbehalfof_inp").setValue(window.preparer);
					this.getView().byId("title_reqphone_inp").setValue(window.phone);
					this.getView().byId("title_reqemail_inp").setValue(window.email);
					window.oModel = this.getView().getModel();
					window.eform_num = "1";
					window.status = "";
					window.isreject = "";
					this.changeOfRequestType();

					this.getView().byId("saveBtn").setVisible(true);
					this.getView().byId("submitBtn").setVisible(true);
					this.getView().byId("submitBtn").setVisible(true);
					this.getView().byId("withdrawBtn").setVisible(false);
					this.getView().byId("b_approve").setVisible(false);
					this.getView().byId("b_reject").setVisible(false);
					this.getView().byId("EDIT").setVisible(false);
					this.getView().byId("HOME").setVisible(false);
					this.getView().byId("DELETE").setVisible(false);

					this.getView().byId("page").setText("Fixed Asset Request");

					var url = "/sap/opu/odata/sap/YFPSFIPFRDD0015_EFORM_SRV/";
					var oModelData = new sap.ui.model.odata.ODataModel(url, true);
					var relPath = "eFormUsers(NAME='',FORM='ADMIN')";
					var that21 = this;
					oModelData.read(relPath, null, [], false, function (oData, response) {
						if (response.data.ADMIN == 'X' || response.data.NAME == that21.getView().byId("title_prep_inp").getValue() || response.data.NAME ==
							that21.getView().byId("onbehalfof_inp").getValue()) {
							that21.getView().byId("DELETE").setVisible(true);
						} else {
							that21.getView().byId("DELETE").setVisible(false);
						}

					});

				}
				//********nsoni started 04/07/2021
				this.getView().byId("wbs_inp").setValueState("None");
				//********nsoni ended 4/07/2021
				// Function ends
			},
			onInit: function () {
				this.mBindingOptions = {};
				this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				this.oRouter.attachRouteMatched(this._onObjectMatched, this);
				//this.oRouter.getTarget("FarRequest").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
				//Begin of changes by NASNANI on 6 sept 2017
			},
			//Begin of changes by NASNANI on 6 sept 2017
			//This function is called from Dialog2 to update onBehalf of from selection
			addonbehalfof: function (selected_comp, uphone, uemail) {
				window.gen_info_onbehalfofinp_field.setValue(selected_comp);
				window.gen_info_reqphoneinp_field.setValue(uphone);
				window.gen_info_reqemailinp_field.setValue(uemail);
			},
			//This function is called from Dialog5 to update cost center of from selection
			addcostcenter: function (selected_costcenter, wbs_visibility_flag) {
				window.maininfo_costcenterinp_field.setValue(selected_costcenter);
				//REQ0602256:NSONI3:GWDK902117:02/02/2021:WBS field enable/disbale changes:START
				if (wbs_visibility_flag == "X") {
					window.wbs_input_field.setEnabled(false);
				} else {
					window.wbs_input_field.setEnabled(true);
				}
				window.wbs_input_field.setValue("");
				//REQ0602256:NSONI3:GWDK902117:02/02/2021:WBS field enable/disbale changes:END
			},
			//This function is called from Dialog1 to update company code of from selection
			addcompanycode: function (selected_companycode) {
				window.maininfo_companycodeinp_field.setValue(selected_companycode);
			},
			//End of changes by NASNANI on 6 sept 2017
			//This function is called from Dialog6 to update approver of from selection
			/**
			 *@memberOf spefar.app.controller.FarRequest
			 */
			//Begin of changes by NASNANI on 6 sept 2017
			//This function will add a new row in approver table depending upon position and type of approver
			add_approver: function () {
				var table = this.getView().byId("approvers_table");
				var num_of_entries = table.getItems().length;
				var all_entries = table.getItems();
				index_counter = index_counter + 1;
				var now = new Date();
				var nowdate = now.getUTCDate();
				var nowmonth = now.getUTCMonth() + 1;
				var nowyear = now.getUTCFullYear();
				window.now = nowmonth + "/" + nowdate + "/" + nowyear;
				//  window.now = this.getView().byId("sch_compdate_inp").getValue();
				var selected_item = this.getView().byId("approvers_table").getSelectedItem();
				if (selected_item.mAggregations.cells[1].mProperties.value == "Studio Finance" && this.getView().byId("ENTRY_SEQUENCE").getValue() ==
					"After" && table.indexOfItem(selected_item) != "0") {
					MessageBox.alert("You cannot add Approvers/Watchers after Studio Finance Users ");
					return;
				}

				if (selected_item.mAggregations.cells[1].mProperties.value == "Studio Finance" && this.getView().byId("ENTRY_SEQUENCE").getValue() ==
					"Before" && table.indexOfItem(selected_item) == "0") {
					MessageBox.alert("You cannot add Approvers/Watchers before Studio Finance Users ");
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
										valueHelpRequest: function (oEvent) {
											var sDialogName = "Dialog6";
											that.mDialogs = that.mDialogs || {};
											var oDialog = that.mDialogs[sDialogName];
											var oSource = oEvent.getSource();
											var oBindingContext = oSource.getBindingContext();
											var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
											var oView;
											that.getOwnerComponent().runAsOwner(function () {
												oView = sap.ui.xmlview({
													viewName: "spefar.app.view." + sDialogName
												});
												that.getView().addDependent(oView);
												oView.getController().setRouter(that.oRouter);
												oView.getController().setValueObject(oSource);
												oDialog = oView.getContent()[0];
												that.mDialogs[sDialogName] = oDialog;
											}.bind(that));
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
												var oModel = that.getView().getModel();
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
											}.bind(that)).catch(function (err) {
												if (err !== undefined) {
													MessageBox.error(err.message);
												}
											});
										}
									}),
									new sap.m.Text({
										text: this.getView().byId("REVIEWER_TYPE").getValue()
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
										text: window.logged_in_user
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
										valueHelpRequest: function (oEvent) {
											var sDialogName = "Dialog6";
											that.mDialogs = that.mDialogs || {};
											var oDialog = that.mDialogs[sDialogName];
											var oSource = oEvent.getSource();
											var oBindingContext = oSource.getBindingContext();
											var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
											var oView;
											that.getOwnerComponent().runAsOwner(function () {
												oView = sap.ui.xmlview({
													viewName: "spefar.app.view." + sDialogName
												});
												that.getView().addDependent(oView);
												oView.getController().setRouter(this.oRouter);
												oView.getController().setValueObject(oSource);
												oDialog = oView.getContent()[0];
												that.mDialogs[sDialogName] = oDialog;
											}.bind(that));
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
												var oModel = that.getView().getModel();
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
											}.bind(that)).catch(function (err) {
												if (err !== undefined) {
													MessageBox.error(err.message);
												}
											});
										}
									}),
									new sap.m.Text({
										text: this.getView().byId("REVIEWER_TYPE").getValue()
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
										text: window.logged_in_user
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
			delete_approver: function () {
					//This code was generated by the layout editor.
					var table = this.getView().byId("approvers_table");
					var selected_item = this.getView().byId("approvers_table").getSelectedItem();
					//deleting mannually added items
					if (selected_item.mAggregations.cells[0].mProperties.selected == false && selected_item.mAggregations.cells[6].mProperties.selected ==
						true) {
						table.removeItem(selected_item);
					} else {
						//  if (selected_item.mAggregations.cells[5].mProperties.selected == false) {
						//    MessageBox.alert("You cannot delete the Approver since its determined by COFA logic ");
						//  }
						if (selected_item.mAggregations.cells[0].mProperties.selected == true) {
							MessageBox.alert("You cannot delete the approver since it is already approved ");
						}
					}
				} //End of changes by NASNANI on 7 sept 2017
				,
			/**
			 *@memberOf spefar.app.controller.FarRequest
			 */
			//Begin of changes by NASNANI on 7 sept 2017
			changeOfRequestType: function () {
					//This code was generated by the layout editor.
					////Upgrade_1909_defect:REQ0595691:NSONI3:GWDK902117:08/25/2020:FAR dropdown defect issue solution:START
					var selectedRequest;
					if (this.getView().byId("maintab_requestType").getSelectedItem() === null) {
						selectedRequest = this.getView().byId("maintab_requestType").mProperties.value;
					} else {
						selectedRequest = this.getView().byId("maintab_requestType").getSelectedItem().getText();
					}
					// var selectedRequest = this.getView().byId("maintab_requestType").mProperties.value;
					//Upgrade_1909_defect:REQ0595691:NSONI3:GWDK902117:08/25/2020:FAR dropdown defect issue solution:END

					if (selectedRequest == "Create") {
						// Visible set true to some fields of Main Information Tab
						this.getView().byId("maintab_fe_cc").setVisible(true);
						this.getView().byId("maintab_fe_ccode").setVisible(true);
						this.getView().byId("maintab_fe_wbs").setVisible(true);
						this.getView().byId("maintab_fe_el").setVisible(true);
						this.getView().byId("maintab_fe_ps").setVisible(true);
						this.getView().byId("maintab_fe_tel").setVisible(true);
						this.getView().byId("maintab_fe_sc").setVisible(true);
						this.getView().byId("maintab_fe_ds").setVisible(true);
						this.getView().byId("maintab_fe_dabj").setVisible(true);
						this.getView().byId("maintab_attach_box").setVisible(true);
						// Visible set false to some fields of Main Information Tab
						this.getView().byId("maintab_fe_far").setVisible(false);

						this.getView().byId("maintab_fe_ofb").setVisible(false);
						//REQ0567864:NSONI3:GWDK902066:05/11/2020:Add new change request field for budget:START
						this.getView().byId("maintab_fe_reqChange").setVisible(false);
						//REQ0567864:NSONI3:GWDK902066:05/11/2020:Add new change request field for budget:END
						this.getView().byId("maintab_fe_rfb").setVisible(false);
						this.getView().byId("maintab_fe_tc").setVisible(false);
						this.getView().byId("maintab_fe_doc").setVisible(false);
						// visible set true for Project Details Tab
						this.getView().byId("projdet_form1").setVisible(true);
						this.getView().byId("projdet_vbox1").setVisible(true);
						this.getView().byId("projdet_vbox6").setVisible(true);
						this.getView().byId("projdet_lowbar_text").setVisible(false);
						//visible set true for summary page
						this.getView().byId("sum_project_details").setVisible(true);
						this.getView().byId("vbox_projectdetails").setVisible(true);
						this.getView().byId("sum_total_con_amt_box").setVisible(true);
						this.getView().byId("sum_totals").setVisible(true);
						this.getView().byId("sum_compcode").setVisible(true);
						this.getView().byId("sum_costcenter").setVisible(true);
						this.getView().byId("sum_wbs").setVisible(true);
						this.getView().byId("sum_exploc").setVisible(true);
						this.getView().byId("sum_projsuper").setVisible(true);
						this.getView().byId("sum_tel").setVisible(true);
						this.getView().byId("sum_schcomp").setVisible(true);
						this.getView().byId("sum_datesub").setVisible(true);
						this.getView().byId("sum_descbuschange").setVisible(true);
						//visible set false for summary page
						this.getView().byId("sum_farref").setVisible(false);

						this.getView().byId("sum_originalfar").setVisible(false);
						this.getView().byId("sum_revisedfar").setVisible(false);
						//REQ0567864:NSONI3:GWDK902066:05/11/2020:Add new change request field for budget:START
						this.getView().byId("sum_reqchangefar").setVisible(false);
						//REQ0567864:NSONI3:GWDK902066:05/11/2020:Add new change request field for budget:END
						this.getView().byId("sum_thischange").setVisible(false);
						this.getView().byId("sum_descchange").setVisible(false);
					}
					if (selectedRequest == "Change") {
						// Hiding at Main Information tab
						this.getView().byId("maintab_fe_cc").setVisible(false);
						this.getView().byId("maintab_fe_ccode").setVisible(false);

						this.getView().byId("maintab_fe_tel").setVisible(false);
						this.getView().byId("maintab_fe_sc").setVisible(false);
						this.getView().byId("maintab_fe_dabj").setVisible(false);
						//Displaying at Main Information tab
						this.getView().byId("maintab_fe_far").setVisible(true);
						this.getView().byId("maintab_fe_wbs").setVisible(true);
						this.getView().byId("maintab_fe_el").setVisible(true);
						this.getView().byId("maintab_fe_ps").setVisible(true);
						this.getView().byId("maintab_fe_ds").setVisible(true);
						this.getView().byId("maintab_fe_ofb").setVisible(true);
						//REQ0567864:NSONI3:GWDK902066:05/11/2020:Add new change request field for budget:START
						this.getView().byId("maintab_fe_reqChange").setVisible(true);
						//REQ0567864:NSONI3:GWDK902066:05/11/2020:Add new change request field for budget:END
						this.getView().byId("maintab_fe_rfb").setVisible(true);
						this.getView().byId("maintab_fe_tc").setVisible(true);
						this.getView().byId("maintab_fe_doc").setVisible(true);
						this.getView().byId("maintab_attach_box").setVisible(true);
						// Hiding at Project Details Tab
						this.getView().byId("projdet_form1").setVisible(false);
						this.getView().byId("projdet_vbox1").setVisible(false);
						this.getView().byId("projdet_vbox6").setVisible(false);
						this.getView().byId("projdet_lowbar_text").setVisible(true);
						this.getView().byId("sum_project_details").setVisible(false);
						this.getView().byId("vbox_projectdetails").setVisible(false);
						this.getView().byId("sum_total_con_amt_box").setVisible(false);
						this.getView().byId("sum_totals").setVisible(false);
						//visible set false for summary page
						this.getView().byId("sum_compcode").setVisible(false);
						this.getView().byId("sum_costcenter").setVisible(false);
						this.getView().byId("sum_tel").setVisible(false);
						this.getView().byId("sum_schcomp").setVisible(false);
						this.getView().byId("sum_descbuschange").setVisible(false);
						//visible set true for summary page
						this.getView().byId("sum_farref").setVisible(true);
						this.getView().byId("sum_wbs").setVisible(true);
						this.getView().byId("sum_exploc").setVisible(true);
						this.getView().byId("sum_datesub").setVisible(true);
						this.getView().byId("sum_projsuper").setVisible(true);
						this.getView().byId("sum_originalfar").setVisible(true);
						this.getView().byId("sum_revisedfar").setVisible(true);
						//REQ0567864:NSONI3:GWDK902066:05/11/2020:Add new change request field for budget:START
						this.getView().byId("sum_reqchangefar").setVisible(true);
						//REQ0567864:NSONI3:GWDK902066:05/11/2020:Add new change request field for budget:END
						this.getView().byId("sum_thischange").setVisible(true);
						this.getView().byId("sum_descchange").setVisible(true);
					}
				} //End of changes by NASNANI on 7 sept 2017
				,
			/**
			 *@memberOf spefar.app.controller.FarRequest
			 */
			updateFromTitleTab: function () {
				//This code was generated by the layout editor.
				//Fetching title tab data
			},
			//Begin of changes by NASNANI on 7 sept 2017
			add_component_table: function (oEvent) {
				var oModel = this.getView().getModel(); // the model
				var aRows = oModel.getProperty("/component_far"); // array with all rows in the model
				var table_items = this.getView().byId("component_table").getItems();
				var num_items = table_items.length;
				var newid = 0;
				if (num_items == 0) {
					newid = "1";
					window.comp_new_row = newid;
				}
				if (num_items == 1) {
					newid = "2";
					window.comp_new_row = newid;
				}
				if (num_items > 1) {
					newid = Number(window.comp_new_row) + Number(1);
					window.comp_new_row = newid;
				}
				var item = {
					id: newid,
					description: "",
					amount: ""
				}; // an empty object
				aRows.push(item); // add the item at the index
				oModel.setProperty("/component_far", aRows);
			},
			//add_construction: function()
			delete_component_table: function (oEvent) {
				//This code was generated by the layout editor.
				//  var table = this.getView().byId("component_table");
				//  var selected_items = this.getView().byId("component_table").getSelectedItems();
				//  var num_of_entries = selected_items.length;
				//  var counter = 0;
				//  for (counter = 0; counter < num_of_entries; counter++) {
				//    table.removeItem(selected_items[counter]);
				//  }
				var oModel = this.getView().getModel(); // the model
				var aRows = oModel.getProperty("/component_far"); // array with all rows in the model
				var dRows = aRows;
				var alength = aRows.length;
				var table = this.getView().byId("component_table");
				var selected_items = this.getView().byId("component_table").getSelectedItems();
				var num_of_entries = selected_items.length;
				var counter = 0;
				var index = 0;
				for (counter = 0; counter < num_of_entries; counter++) {
					var item1 = selected_items[counter];
					var cells = item1.getCells();
					for (var temp = 0; temp < alength; temp++) {
						if (aRows[temp].id == cells[0].mProperties.text) {
							index = temp;
							dRows.splice(index, 1);
							break;
						}
					}
				}
				oModel.setProperty("/component_far", dRows);
			},
			//delete_construction: function()
			updateallTotals: function () {
				//This code was generated by the layout editor.
				var loccurrency = this.getView().byId("localcurrency_inp").mProperties.value;
				this.getView().byId("summary_loccurrency").setText(loccurrency);
				var total_amount_local = 0;
				var total_amount_final = 0;
				//From Construction Table
				var table_items = this.getView().byId("component_table").getItems();
				var num_items = table_items.length;
				var total_amount = 0;
				for (var i = 0; i < num_items; i++) {
					var item1 = table_items[i];
					var cells = item1.getCells();
					var sAmount = cells[2].mProperties.value;
					var oAmount = sAmount.split(',').join('');
					var oModel = this.getView().getModel(); // the model
					var aRows = oModel.getProperty("/component_far");
					aRows[i].amount = oAmount;
					oModel.setProperty("/component_far", aRows);

					total_amount = Number(total_amount) + Number(oAmount);
				}
				var total_amount1 = new Intl.NumberFormat('en-US').format(total_amount);
				//  total_amount_local = total_amount1 + " " + loccurrency;
				total_amount_local = total_amount1;

				this.getView().byId("total_component_amt").setText(total_amount_local);
				this.getView().byId("sum_tot_comp_amt").setText(total_amount_local);

				this.getView().byId("local_total_final").setValue(total_amount_local);
				this.getView().byId("sum_local_total_final").setText(total_amount_local);
				var s = {};
				s.EXCH = String(total_amount);
				s.NAME = loccurrency;
				var gatewayUrl = "/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/";
				var oModel = new sap.ui.model.odata.ODataModel(gatewayUrl, true);
				var that = this;
				var tempamount;
				oModel.create("/eFormLocCurrencies", s, null, function (oData, response) {
					// REQ0591945:NSONI3:GWDK902117:08/27/2020:Remove USD from total value:START
					window.total_amount_final = response.data.EXCH;
					// REQ0591945:NSONI3:GWDK902117:08/27/2020:Remove USD from total value:END
					tempamount = response.data.EXCH;
				});
				total_amount_final = window.total_amount_final;
				var oModel = this.getView().getModel(); // the model
				var usd_total_final = oModel.getProperty("/usd_tot_final"); // array with all rows in the model
				total_amount_final = new Intl.NumberFormat('en-US').format(tempamount);

				// REQ0591945:NSONI3:GWDK902117:08/27/2020:Remove USD from total value:START
				// usd_total_final = total_amount_final + ' USD';
				usd_total_final = total_amount_final;
				// REQ0591945:NSONI3:GWDK902117:08/27/2020:Remove USD from total value:END

				// REQ0591945:NSONI3:GWDK902117:08/27/2020:Disable automatic update of total value:START
				// oModel.setProperty("/usd_tot_final", usd_total_final);
				// REQ0591945:NSONI3:GWDK902117:08/27/2020:Disable automatic update of total value:END
				this.getView().getModel().refresh();
			},
			/**
			 *@memberOf spefar.app.controller.FarRequest
			 */
			_onChangeTotal: function () {
				//This code was generated by the layout editor.
				var total_Inp = this.getView().byId("local_total_final").getValue();
				var loccurrency = this.getView().byId("localcurrency_inp").mProperties.value;
				var oModel = this.getView().getModel(); // the model
				window.total_amount_final = "";
				var total_amount_local = total_Inp;
				// + " " + loccurrency;
				this.getView().byId("total_component_amt").setText("");
				this.getView().byId("local_total_final").setValue(total_amount_local);
				this.getView().byId("sum_local_total_final").setText(total_amount_local);
				var total_Inp1 = total_Inp.split(',').join('');
				var s = {};
				s.EXCH = String(total_Inp1);
				s.NAME = loccurrency;
				var gatewayUrl = "/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/";
				var oModel = new sap.ui.model.odata.ODataModel(gatewayUrl, true);
				var that = this;
				oModel.create("/eFormLocCurrencies", s, null, function (oData, response) {
					window.total_amount_final = new Intl.NumberFormat('en-US').format(response.data.EXCH) + ' USD';
				});
				var total_amount_final = window.total_amount_final;
				var oModel = this.getView().getModel(); // the model
				var usd_total_final = oModel.getProperty("/usd_tot_final"); // array with all rows in the model
				usd_total_final = total_amount_final;
				//REQ0591945:NSONI3:GWDK902117:08/25/2020:Disable automatic USD value update:START
				// oModel.setProperty("/usd_tot_final", usd_total_final);
				//REQ0591945:NSONI3:GWDK902117:08/25/2020:Disable automatic USD value update:END
				this.getView().getModel().refresh();
			},
			_onInputValueHelpRequest6: function (oEvent) {
				var sDialogName = "Dialog7";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				var oSource = oEvent.getSource();
				var oBindingContext = oSource.getBindingContext();
				var sPath = oBindingContext ? oBindingContext.getPath() : null;
				var oView;
				if (!oDialog) {
					this.getOwnerComponent().runAsOwner(function () {
						oView = sap.ui.xmlview({
							viewName: "spefar.app.view." + sDialogName
						});
						this.getView().addDependent(oView);
						oView.getController().setRouter(this.oRouter);
						oView.getController().setValueObject(oSource);
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
			},
			_onInputValueHelpRequest10: function (oEvent) {
				var sDialogName = "Dialog10";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				var oSource = oEvent.getSource();
				var oBindingContext = oSource.getBindingContext();
				var sPath = oBindingContext ? oBindingContext.getPath() : null;
				var oView;
				if (!oDialog) {
					this.getOwnerComponent().runAsOwner(function () {
						oView = sap.ui.xmlview({
							viewName: "spefar.app.view." + sDialogName
						});
						this.getView().addDependent(oView);
						oView.getController().setRouter(this.oRouter);
						oView.getController().setValueObject(oSource);
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
			},
			_onInputValueHelpRequest4: function (oEvent) {
				var sDialogName = "Dialog8";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				var oSource = oEvent.getSource();
				var oBindingContext = oSource.getBindingContext();
				var sPath = oBindingContext ? oBindingContext.getPath() : null;
				var oView;
				if (!oDialog) {
					this.getOwnerComponent().runAsOwner(function () {
						oView = sap.ui.xmlview({
							viewName: "spefar.app.view." + sDialogName
						});
						this.getView().addDependent(oView);
						oView.getController().setRouter(this.oRouter);
						oView.getController().setValueObject(oSource);
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
			},
			_onInputValueHelpRequest5: function (oEvent) {
				var sDialogName = "Dialog9";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				var oSource = oEvent.getSource();
				var oBindingContext = oSource.getBindingContext();
				var sPath = oBindingContext ? oBindingContext.getPath() : null;
				var oView;
				if (!oDialog) {
					this.getOwnerComponent().runAsOwner(function () {
						oView = sap.ui.xmlview({
							viewName: "spefar.app.view." + sDialogName
						});
						this.getView().addDependent(oView);
						oView.getController().setRouter(this.oRouter);
						oView.getController().setValueObject(oSource);
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
					oView.getController().setValueText(this.getView().byId("title_cofalob_inp").getValue());
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
			},
			handleUploadComplete: function (oEvent) {
				var status = oEvent.getParameter("status");
				if (status === 201) {
					var sMsg = "Upload Success";
					oEvent.getSource().setValue("");
				} else {
					sMsg = "Upload Error";
				}
				var viewInstance = this.getView();
				viewInstance.setBusy(false);
				var url = "/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/";
				var oModelData = new sap.ui.model.odata.ODataModel(url, true);
				var relPath = "eFormAttachments?$filter=EFORM_NUM eq '" + window.eform_num + "'";
				var that = this;
				oModelData.read(relPath, null, [], false, function (oData, response) {
						// Get the values for the UI fields
						//  var companyData = response.data.results[0];
						//  var oViewModel = new sap.ui.model.json.JSONModel();
						//  oViewModel.setData(companyData);
						//  that.getView().setModel(oViewModel);
						that.getView().byId("attachments").destroyItems();
						var counter = response.data.results.length;
						var i = 0;
						var selected_box;
						var license_cost;
						for (i = 0; i < counter; i++) {
							var table = that.getView().byId("attachments");
							var data = new sap.m.ColumnListItem({
								cells: [
									new sap.m.Link({
										text: response.data.results[i].FILE_NAME,
										press: function (oEvent) {
											var that2 = that;
											var oSource = oEvent.getSource();
											var relPath = "/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/eFormAttachments(EFORM_NUM='" + window.eform_num + "'" +
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
							table.addItem(data);
						}
					},
					function (oError) {
						oModelData.fireRequestCompleted();
						var msg = JSON.parse(oError.response.body).error.message.value;
						//sap.m.MessageBox.error(msg);
						sap.m.MessageToast.show(msg);
					});
				MessageBox.alert(sMsg);
			},
			handleValueChange: function (oEvent) {
				file_size = oEvent.mParameters.files[0].size;
				file_size = (file_size / 1024);
			},
			handleUploadPress: function (oEvent) {
				var oFileUploader = this.getView().byId("fileUploader");
				if (oFileUploader.getValue() == "") {
					return;
				}
				var curr_view = this.getView();
				// REQ0591945:NSONI3:GWDK902117:08/27/2020:update getText funtion to getValue:START
				var TOTALUSD = this.getView().byId("usd_total_final").getValue().split(',').join('');
				// REQ0591945:NSONI3:GWDK902117:08/27/2020:update getText funtion to getValue:END
				var TOTALLOC = this.getView().byId("local_total_final").getValue().split(',').join('');
				var s = {};
				s.PROJ_DESC = this.getView().byId("title_desc_inp").getValue();
				s.REQUEST_TYPE = this.getView().byId("maintab_requestType").mProperties.value;
				s.LOCALCURRENCY = this.getView().byId("localcurrency_inp").mProperties.value;
				s.TOTALUSD = TOTALUSD;
				s.TOTALLOC = TOTALLOC;
				if (window.status == 'In Approval') {
					s.STATUS = "In Approval";
					s.ACTION = "SAVE";
				}
				if (window.status == 'Data Saved') {
					s.STATUS = "Data Saved";
					s.ACTION = "SAVE";
				}
				if (window.status == "") {
					s.STATUS = "Data Saved";
					s.ACTION = "SAVE";
				}
				if (window.status == 'Withdrawn') {
					s.STATUS = "Withdrawn Comments";
					s.ACTION = "SAVE";
				}

				s.STATUS_R = window.isreject;

				s.DESC_BJ = this.getView().byId("maintab_fe_dabj_inp").getValue();
				s.DESC_CHANGE = this.getView().byId("maintab_fe_doc_inp").getValue();
				s.THIS_CHANGE = this.getView().byId("maintab_fe_tc_inp").getValue();
				s.REV_FAR_BUDGET = this.getView().byId("maintab_fe_rfb_inp").getValue().split(',').join('');;
				s.ORIG_FAR_BUDGET = this.getView().byId("maintab_fe_ofb_inp").getValue().split(',').join('');;
				s.DATE_SUBMITTED = this.getView().byId("maintab_fe_ds_inp").getValue();
				s.SCH_COMPDATE = this.getView().byId("sch_compdate_inp").getValue();
				s.TELEPHONE = this.getView().byId("telephone").getValue();
				s.PROJ_SUPER = this.getView().byId("projsuper_inp").getValue();
				s.EXP_LOC = this.getView().byId("expectedloc_inp").getValue();
				s.WBS = this.getView().byId("wbs_inp").getValue();
				s.COMPANY_CODE = this.getView().byId("companycode_inp").getValue();
				s.COST_CENTER = this.getView().byId("costcenter_inp").getValue();
				s.FAR_REF = this.getView().byId("maintab_farref_inp").getValue();
				s.COFA_SUBLOB = this.getView().byId("title_cofasublob_inp").getValue();
				s.COFA_LOB = this.getView().byId("title_cofalob_inp").getValue();
				s.REQUESTER_PHONE = this.getView().byId("title_reqphone_inp").getValue();
				s.REQUESTER_EMAIL = this.getView().byId("title_reqemail_inp").getValue();
				s.PREPARER = this.getView().byId("title_prep_inp").getValue();
				s.ON_BEHALF_OF = this.getView().byId("onbehalfof_inp").getValue();
				s.TITLE = this.getView().byId("title_title_inp").getValue();
				var oModel = this.getView().getModel();
				var aRows = oModel.getProperty("/component_far");
				var loccurrency = this.getView().byId("localcurrency_inp").mProperties.value;
				s.headercomp_n = [];
				for (var t = 0; t < aRows.length; t++) {
					if (aRows[t].description != "") {
						s.headercomp_n.push({
							COMP_CURR: loccurrency,
							COMP_AMT: aRows[t].amount.split(',').join(''),
							COMP_DESC: aRows[t].description,
							COMP_ITEMNO: String(t + 1),
							EFORM_NUM: window.eform_num
						});
					}
				}
				if (window.eform_num == "1") {
					s.EFORM_NUM = "1";
					var gatewayUrl = "/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/";
					var oModel = new sap.ui.model.odata.ODataModel(gatewayUrl, true);
					var that88 = this;
					oModel.create("/eFormHeaders", s, null, function (oData, response) {
						window.eform_num = response.data.EFORM_NUM;
						window.status = response.data.STATUS;
						that88.getView().byId("title_eform_no").setText(window.eform_num);
					});
				} else {
					s.EFORM_NUM = window.eform_num;
					var gatewayUrl = "/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/";
					var oModel = new sap.ui.model.odata.ODataModel(gatewayUrl, true);
					oModel.create("/eFormHeaders", s, null, function (oData, response) {
						window.status = response.data.STATUS;
					});
				}
				this.getView().byId("page").setText("Fixed Asset Request - " + window.eform_num);

				var url = "/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/";
				var that = this;
				var userModel = new sap.ui.model.odata.ODataModel(url, true);
				var viewInstance = that.getView();
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
				headerParma2.setValue(oFileUploader.getValue() + '|' + window.eform_num + '|' + file_size);
				oFileUploader.insertHeaderParameter(headerParma2);
				headerParma3.setName('Content-Type');
				headerParma3.setValue('image/jpeg');
				oFileUploader.insertHeaderParameter(headerParma3);
				headerParma.setName('x-csrf-token');
				headerParma.setValue(csrf);
				oFileUploader.addHeaderParameter(headerParma);
				oFileUploader.upload();
			},
			attachment_delete: function () {
				var selected_item = this.getView().byId("attachments").getSelectedItem();
				var filename = selected_item.mAggregations.cells[0].mProperties.text;
				if (filename !== "") {
					var url = "/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/";
					var oModelData = new sap.ui.model.odata.ODataModel(url, true);
					var relPath = "eFormGeneralInfos('" + window.eform_num + "')";
					var that = this;
					var delete_indicator;
					oModelData.read(relPath, null, [], false, function (oData, response) {
						if (response.data.FAR == "X") {
							delete_indicator = "";
						} else {
							delete_indicator = "X";
						}
					});
					if (delete_indicator == "X") {
						var gatewayUrl = "/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/";
						var oModel = new sap.ui.model.odata.ODataModel(gatewayUrl, true);
						var that = this;
						oModel.remove("eFormAttachments(EFORM_NUM='" + window.eform_num + "'" + ",FILE_NAME='" + filename + "')", {
							success: jQuery.proxy(function () {
								jQuery.sap.require("sap.m.MessageToast");
								sap.m.MessageToast.show("Attachment deleted");
							}, this),
							error: jQuery.proxy(function (mResponse) {
								var body = mResponse.response.body;
								var res = body.split(",");
								console.log(res);
								sap.m.MessageBox.show("Attachment not deleted");
							}, this)
						});
						this.getView().byId("attachments").removeItem(selected_item);
					} else {
						MessageBox.alert("Attachment deletion possible only for FAR form Owner.");

					}

				}
			},
			_onButtonPressSubmit: function (oEvent) {
				var selectedRequest = this.getView().byId("maintab_requestType").mProperties.value;
				if (selectedRequest == "Change") {
					var mandatory = 0;
					if (this.getView().byId("title_title_inp").getValue() === "") {
						this.getView().byId("title_title_inp").setValueState("Error");
						mandatory = mandatory + 1;
					} else {
						this.getView().byId("title_title_inp").setValueState("None");
						mandatory = mandatory - 1;
					}
					if (this.getView().byId("onbehalfof_inp").getValue() === "") {
						this.getView().byId("onbehalfof_inp").setValueState("Error");
						mandatory = mandatory + 1;
					} else {
						this.getView().byId("onbehalfof_inp").setValueState("None");
						mandatory = mandatory - 1;
					}
					if (this.getView().byId("title_cofasublob_inp").getValue() === "") {
						this.getView().byId("title_cofalob_inp").setValueState("Error");
						mandatory = mandatory + 1;
					} else {
						this.getView().byId("title_cofalob_inp").setValueState("None");
						mandatory = mandatory - 1;
					}
					if (this.getView().byId("title_cofasublob_inp").getValue() === "") {
						this.getView().byId("title_cofasublob_inp").setValueState("Error");
						mandatory = mandatory + 1;
					} else {
						this.getView().byId("title_cofasublob_inp").setValueState("None");
						mandatory = mandatory - 1;
					}
					if (this.getView().byId("maintab_farref_inp").getValue() === "") {
						this.getView().byId("maintab_farref_inp").setValueState("Error");
						mandatory = mandatory + 1;
					} else {
						this.getView().byId("maintab_farref_inp").setValueState("None");
						mandatory = mandatory - 1;
					}
					if (this.getView().byId("expectedloc_inp").getValue() === "") {
						this.getView().byId("expectedloc_inp").setValueState("Error");
						mandatory = mandatory + 1;
					} else {
						this.getView().byId("expectedloc_inp").setValueState("None");
						mandatory = mandatory - 1;
					}
					if (this.getView().byId("projsuper_inp").getValue() === "") {
						this.getView().byId("projsuper_inp").setValueState("Error");
						mandatory = mandatory + 1;
					} else {
						this.getView().byId("projsuper_inp").setValueState("None");
						mandatory = mandatory - 1;
					}
					if (this.getView().byId("maintab_fe_doc_inp").getValue() === "") {
						this.getView().byId("maintab_fe_doc_inp").setValueState("Error");
						mandatory = mandatory + 1;
					} else {
						this.getView().byId("maintab_fe_doc_inp").setValueState("None");
						mandatory = mandatory - 1;
					}

					//REQ0567864:NSONI3:GWDK902066:05/14/2020:Add new change request field for budget:START
					var originalValue = this.getView().byId("maintab_fe_ofb_inp").getValue().split(',').join('');
					originalValue = originalValue === "" ? "0" : originalValue;
					var reqChangeValue = this.getView().byId("maintab_fe_reqChange_inp").getValue().split(',').join('');
					reqChangeValue = reqChangeValue === "" ? "0" : reqChangeValue;
					var revisedValue = parseFloat(originalValue) + parseFloat(reqChangeValue);
					this.getView().getModel().setProperty("/revised_far", new Intl.NumberFormat('en-US').format(revisedValue));
					this.getView().getModel().setProperty("/requested_far", new Intl.NumberFormat('en-US').format(reqChangeValue));
					//REQ0567864:NSONI3:GWDK902066:05/14/2020:Add new change request field for budget:END
				}
				if (selectedRequest == "Create") {
					var mandatory = 0;
					if (this.getView().byId("title_title_inp").getValue() === "") {
						this.getView().byId("title_title_inp").setValueState("Error");
						mandatory = mandatory + 1;
					} else {
						this.getView().byId("title_title_inp").setValueState("None");
						mandatory = mandatory - 1;
					}
					if (this.getView().byId("onbehalfof_inp").getValue() === "") {
						this.getView().byId("onbehalfof_inp").setValueState("Error");
						mandatory = mandatory + 1;
					} else {
						this.getView().byId("onbehalfof_inp").setValueState("None");
						mandatory = mandatory - 1;
					}
					if (this.getView().byId("title_cofalob_inp").getValue() === "") {
						this.getView().byId("title_cofalob_inp").setValueState("Error");
						mandatory = mandatory + 1;
					} else {
						this.getView().byId("title_cofalob_inp").setValueState("None");
						mandatory = mandatory - 1;
					}
					if (this.getView().byId("title_cofasublob_inp").getValue() === "") {
						this.getView().byId("title_cofasublob_inp").setValueState("Error");
						mandatory = mandatory + 1;
					} else {
						this.getView().byId("title_cofasublob_inp").setValueState("None");
						mandatory = mandatory - 1;
					}
					if (this.getView().byId("costcenter_inp").getValue() === "") {
						this.getView().byId("costcenter_inp").setValueState("Error");
						mandatory = mandatory + 1;
					} else {
						this.getView().byId("costcenter_inp").setValueState("None");
						mandatory = mandatory - 1;
					}
					if (this.getView().byId("expectedloc_inp").getValue() === "") {
						this.getView().byId("expectedloc_inp").setValueState("Error");
						mandatory = mandatory + 1;
					} else {
						this.getView().byId("expectedloc_inp").setValueState("None");
						mandatory = mandatory - 1;
					}
					if (this.getView().byId("projsuper_inp").getValue() === "") {
						this.getView().byId("projsuper_inp").setValueState("Error");
						mandatory = mandatory + 1;
					} else {
						this.getView().byId("projsuper_inp").setValueState("None");
						mandatory = mandatory - 1;
					}
					if (this.getView().byId("telephone").getValue() === "") {
						this.getView().byId("telephone").setValueState("Error");
						mandatory = mandatory + 1;
					} else {
						this.getView().byId("telephone").setValueState("None");
						mandatory = mandatory - 1;
					}
					if (this.getView().byId("sch_compdate_inp").getValue() === "") {
						this.getView().byId("sch_compdate_inp").setValueState("Error");
						mandatory = mandatory + 1;
					} else {
						this.getView().byId("sch_compdate_inp").setValueState("None");
						mandatory = mandatory - 1;
					}
				}
				if (mandatory == 0 || (selectedRequest == "Create" && mandatory == -9) || (selectedRequest == "Change" && mandatory == -8)) {
					var curr_view = this.getView();
					// REQ0591945:NSONI3:GWDK902117:08/27/2020:update getText funtion to getValue:START
					var TOTALUSD = this.getView().byId("usd_total_final").getValue().split(',').join('');
					// REQ0591945:NSONI3:GWDK902117:08/27/2020:update getText funtion to getValue:END
					var TOTALLOC = this.getView().byId("local_total_final").getValue().split(',').join('');
					var s = {};
					s.PROJ_DESC = this.getView().byId("title_desc_inp").getValue();
					s.REQUEST_TYPE = this.getView().byId("maintab_requestType").mProperties.value;
					s.LOCALCURRENCY = this.getView().byId("localcurrency_inp").mProperties.value;
					s.TOTALUSD = TOTALUSD;
					s.TOTALLOC = TOTALLOC;
					s.STATUS = "In Approval";
					s.STATUS_R = window.isreject;
					s.ACTION = "SUBMIT";
					s.DESC_BJ = this.getView().byId("maintab_fe_dabj_inp").getValue();
					s.DESC_CHANGE = this.getView().byId("maintab_fe_doc_inp").getValue();
					s.THIS_CHANGE = this.getView().byId("maintab_fe_tc_inp").getValue();
					s.REV_FAR_BUDGET = this.getView().byId("maintab_fe_rfb_inp").getValue().split(',').join('');
					s.ORIG_FAR_BUDGET = this.getView().byId("maintab_fe_ofb_inp").getValue().split(',').join('');
					s.DATE_SUBMITTED = this.getView().byId("maintab_fe_ds_inp").getValue();
					s.SCH_COMPDATE = this.getView().byId("sch_compdate_inp").getValue();
					s.TELEPHONE = this.getView().byId("telephone").getValue();
					s.PROJ_SUPER = this.getView().byId("projsuper_inp").getValue();
					s.EXP_LOC = this.getView().byId("expectedloc_inp").getValue();
					s.WBS = this.getView().byId("wbs_inp").getValue();
					s.COMPANY_CODE = this.getView().byId("companycode_inp").getValue();
					s.COST_CENTER = this.getView().byId("costcenter_inp").getValue();
					s.FAR_REF = this.getView().byId("maintab_farref_inp").getValue();
					s.COFA_SUBLOB = this.getView().byId("title_cofasublob_inp").getValue();
					s.COFA_LOB = this.getView().byId("title_cofalob_inp").getValue();
					s.REQUESTER_PHONE = this.getView().byId("title_reqphone_inp").getValue();
					s.REQUESTER_EMAIL = this.getView().byId("title_reqemail_inp").getValue();
					s.PREPARER = this.getView().byId("title_prep_inp").getValue();
					s.ON_BEHALF_OF = this.getView().byId("onbehalfof_inp").getValue();
					s.TITLE = this.getView().byId("title_title_inp").getValue();
					// REQ0591945:NSONI3:GWDK902117:08/28/2020:Add exchange rate:START
					s.EXCHANGE_RATE = this.getView().byId("EXCHANGE_RATE").getValue();
					// REQ0591945:NSONI3:GWDK902117:08/28/2020:Add exchange rate:END
					var oModel = this.getView().getModel();
					var aRows = oModel.getProperty("/component_far");
					var loccurrency = this.getView().byId("localcurrency_inp").mProperties.value;
					s.headercomp_n = [];
					for (var t = 0; t < aRows.length; t++) {
						if (aRows[t].description != "") {
							s.headercomp_n.push({
								COMP_CURR: loccurrency,
								COMP_AMT: aRows[t].amount.split(',').join(''),
								COMP_DESC: aRows[t].description,
								COMP_ITEMNO: String(t + 1),
								EFORM_NUM: window.eform_num
							});
						}
					}
					if (window.eform_num == "1") {
						s.APPROVERS_DET = "";
						s.EFORM_NUM = "1";
						var gatewayUrl = "/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/";
						var oModel = new sap.ui.model.odata.ODataModel(gatewayUrl, true);
						var that88 = this;
						oModel.create("/eFormHeaders", s, null, function (oData, response) {
							window.eform_num = response.data.EFORM_NUM;
							window.eform_approvers = response.data.APPROVERS_DET;
							window.farformsavetext = response.data.MSG;
							window.datesubmitted = response.data.DATE_SUBMITTED;
							window.status = response.data.STATUS;

							if (window.eform_num != "1") {
								that88.getView().byId("title_eform_no").setText(window.eform_num);
							}

						});
					} else {
						s.APPROVERS_DET = window.eform_approvers;
						s.EFORM_NUM = window.eform_num;
						var b = curr_view.byId("approvers_table").getItems();
						s.headerapprover_n = [];
						for (var i = 0; i < b.length; i++) {
							var D = {};
							D.EFORM_NUM = window.eform_num;
							D.ORGLEVEL = "";
							D.SEQUENCE = String(i + 1);
							if (b[i].mAggregations.cells[0].getSelected() === true) {
								D.APPROVED = "X";
							} else {
								D.APPROVED = "";
							}
							D.REVIEWER_TYPE = b[i].mAggregations.cells[2].getText();
							D.APPROVED_BY = b[i].mAggregations.cells[3].getText();
							D.APPROVAL_DT = b[i].mAggregations.cells[4].getText();
							D.APPROVAL_TM = b[i].mAggregations.cells[5].getText();
							D.ADDED_BY = b[i].mAggregations.cells[7].getText();
							D.CREATION_DT = b[i].mAggregations.cells[8].getText();
							if (b[i].mAggregations.cells[6].getSelected() === true) {
								D.MANUAL = "X";
							} else {
								D.MANUAL = "";
							}
							// REQ0602256:NSONI3:GWDK902117:01/25/2021:update getValue to getText to solve issue:START
							// D.APPR = b[i].mAggregations.cells[1].getValue();
							D.APPR = b[i].mAggregations.cells[1].getText();
							// REQ0602256:NSONI3:GWDK902117:01/25/2021:update getValue to getText to solve issue:END
							if (D.APPR != "") {
								s.headerapprover_n[i] = D;
							}
							//  s.headerapprover_n[i] = D;
						}
						var gatewayUrl = "/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/";
						var oModel = new sap.ui.model.odata.ODataModel(gatewayUrl, true);
						var that88 = this;
						oModel.create("/eFormHeaders", s, null, function (oData, response) {
							window.farformsavetext = response.data.MSG;

							if (window.eform_num != "1") {
								that88.getView().byId("title_eform_no").setText(window.eform_num);
							}

							window.status = response.data.STATUS;
							window.datesubmitted = response.data.DATE_SUBMITTED;
						});
					}

					if (window.eform_num != "1") {
						this.getView().byId("page").setText("Fixed Asset Request - " + window.eform_num);
					}

					this.getView().byId("maintab_fe_ds_inp").setValue(window.datesubmitted);
					//call and get approvers.
					var gatewayUrl = "/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/";
					var oModel = new sap.ui.model.odata.ODataModel(gatewayUrl, true);
					var relPath = "eFormApprovers?$filter=EFORM_NUM eq '" + window.eform_num + "'";
					var oTable = this.getView().byId("approvers_table");
					oModel.read(relPath, null, [], false, function (oData, response) {
						//oTable.destroyItems();
						var counter = response.data.results.length;
						var i = 0;
						var oMod = window.oModel;
						var apRows = oMod.getProperty("/approvers");
						var no_of_items = apRows.length;
						var t = no_of_items - 1;
						for (i = t; i >= 0; i--) {
							apRows.splice(i, 1);
						}
						oMod.setProperty("/approvers", apRows);
						for (i = 0; i < counter; i++) {
							var item = {
								approved: response.data.results[i].APPROVED,
								approver: response.data.results[i].APPR,
								reviewer_type: response.data.results[i].REVIEWER_TYPE,
								approved_by: response.data.results[i].APPROVED_BY,
								approval_date: response.data.results[i].APPROVAL_DT,
								approval_time: response.data.results[i].APPROVAL_TM,
								manual_addition: response.data.results[i].MANUAL,
								added_by: response.data.results[i].ADDED_BY,
								added_on: response.data.results[i].CREATION_DT,
								can_edit: Boolean(0),
								// REQ0602256:NSONI3:GWDK902117:01/18/2021:add grp link:START
								grp: response.data.results[i].GRP === "X" ? true : false
									// REQ0602256:NSONI3:GWDK902117:01/18/2021:add grp link:END
							};
							apRows.push(item);
						}
						oMod.setProperty("/approvers", apRows);
					});
					var dialogName = "Dialog3";
					var oSource = oEvent.getSource();
					this.dialogs = this.dialogs || {};
					var dialog = this.dialogs[dialogName];
					var view;
					if (!dialog) {
						view = sap.ui.xmlview({
							viewName: "spefar.app.view." + dialogName
						});
						dialog = view.getContent()[0];
						this.dialogs[dialogName] = dialog;
					}
					sap.ui.controller("spefar.app.controller.Dialog3").setresult(window.farformsavetext);
					dialog.open();

					if (window.eform_num != "1") {
						this.getView().byId("saveBtn").setVisible(true);
						this.getView().byId("submitBtn").setVisible(false);
						this.getView().byId("withdrawBtn").setVisible(true);
						this.getView().byId("b_approve").setVisible(true);
						this.getView().byId("b_reject").setVisible(true);
						this.getView().byId("EDIT").setVisible(false);
						if (window.top.location.href.toLowerCase().indexOf("fiorilaunchpad") == -1) {
							//S4R:NSONI3:GWDK902360:07/22/2021:Seting visibility of home icon false:START
							this.getView().byId("HOME").setVisible(false);
							//S4R:NSONI3:GWDK902360:07/22/2021:Seting visibility of home icon false:END
						}
						this.getView().byId("DELETE").setVisible(false);

					}

					var oMod = window.oModel;
					//  var displaymode = oMod.getProperty("/can_edit");
					//  displaymode = Boolean(0);
					//  oMod.setProperty("/can_edit", displaymode);
					//  oMod.refresh();

				} else {
					MessageBox.alert("Please update mandatory parameters");
				}
			},
			_onButtonPressWithdraw: function (oEvent) {
				var s = {};
				var that = this;
				var curr_view = this.getView();
				window.eform_withdraw;
				new Promise(function (fnResolve) {
					sap.m.MessageBox.confirm("Do you want to Cancel the workflow for FAR Approval process?", {
						title: "Confirm Withdraw",
						actions: ["Yes", "No"],
						onClose: function (sActionClicked) {
							if (sActionClicked === "Yes") {
								s.ACTION = "WITHDRAW";
								s.EFORM_NUM = window.eform_num;
								s.headercomp_n = [];
								s.headerapprover_n = [];
								var gatewayUrl = "/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/";
								var oModel = new sap.ui.model.odata.ODataModel(gatewayUrl, true);
								oModel.create("/eFormHeaders", s, null, function (oData, response) { //Successfully created
										var entry_created = response.data;
										//  window.status = response.data.STATUS;
										window.status = "Withdrawn";
										window.isreject = "";
										var url = "/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/";
										var oModelData = new sap.ui.model.odata.ODataModel(url, true);

										that.getView().byId("saveBtn").setVisible(true);
										that.getView().byId("submitBtn").setVisible(true);
										that.getView().byId("withdrawBtn").setVisible(false);
										that.getView().byId("b_approve").setVisible(false);
										that.getView().byId("b_reject").setVisible(false);
										that.getView().byId("EDIT").setVisible(true);
										that.getView().byId("HOME").setVisible(false);
										that.getView().byId("DELETE").setVisible(true);

										var oMod = window.oModel;
										var apRows = oMod.getProperty("/approvers");
										var no_of_items = apRows.length;
										var t = no_of_items - 1;
										for (var i = t; i >= 0; i--) {
											apRows.splice(i, 1);
										}
										oMod.setProperty("/approvers", apRows);
										var msg = window.eform_num + " withdrawn successfully.";
										MessageBox.alert(msg);
										var oModel = that.getView().getModel();
										var editmode = oModel.getProperty("/requestmode");
										editmode = Boolean(1);
										oModel.setProperty("/requestmode", editmode);
										var editmode1 = oModel.getProperty("/comp_table_mode");
										editmode1 = Boolean(1);
										oModel.setProperty("/comp_table_mode", editmode1);

										//REQ0602256:NSONI3:GWDK902227:02/09/2021:WBS field enable/disbale changes:START
										that.getView("FarRequest").byId("wbs_inp").setValue("");
										that.getView().getModel().setProperty("wbs", "");
										that.getView("FarRequest").byId("costcenter_inp").setValue("");
										that.getView().getModel().setProperty("cost_center", "");
										//REQ0602256:NSONI3:GWDK902227:02/09/2021:WBS field enable/disbale changes:END
									},
									function (error) {});
							} else {}
						}
					});
				}).catch(function (err) {
					if (err !== undefined) {
						MessageBox.error(err);
					}
				});
				if (window.eform_withdraw == "X") {}
			},
			_onButtonPressRefresh: function () {
				//call and get approvers.
				var gatewayUrl = "/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/";
				var oModel = new sap.ui.model.odata.ODataModel(gatewayUrl, true);
				var relPath = "eFormApprovers?$filter=EFORM_NUM eq '" + window.eform_num + "'";
				var oTable = this.getView().byId("approvers_table");
				oModel.read(relPath, null, [], false, function (oData, response) {
					//oTable.destroyItems();
					var counter = response.data.results.length;
					var i = 0;
					var oMod = window.oModel;
					var apRows = oMod.getProperty("/approvers");
					var no_of_items = apRows.length;
					var t = no_of_items - 1;
					for (i = t; i >= 0; i--) {
						apRows.splice(i, 1);
					}
					oMod.setProperty("/approvers", apRows);
					for (i = 0; i < counter; i++) {
						var item = {
							approved: response.data.results[i].APPROVED,
							approver: response.data.results[i].APPR,
							reviewer_type: response.data.results[i].REVIEWER_TYPE,
							approved_by: response.data.results[i].APPROVED_BY,
							approval_date: response.data.results[i].APPROVAL_DT,
							approval_time: response.data.results[i].APPROVAL_TM,
							manual_addition: response.data.results[i].MANUAL,
							added_by: response.data.results[i].ADDED_BY,
							added_on: response.data.results[i].CREATION_DT,
							can_edit: Boolean(0),
							// REQ0602256:NSONI3:GWDK902117:01/18/2021:add grp link:START
							grp: response.data.results[i].GRP === "X" ? true : false
								// REQ0602256:NSONI3:GWDK902117:01/18/2021:add grp link:END
						};
						apRows.push(item);
					}
					oMod.setProperty("/approvers", apRows);
				});
			},
			_onIconPress: function () {
				//call service to check current status of eform
				var url = "/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/";
				var oModelData = new sap.ui.model.odata.ODataModel(url, true);
				var relPath = "eFormGeneralInfos('" + window.eform_num + "')";
				var that = this;
				oModelData.read(relPath, null, [], false, function (oData, response) {
					if (response.data.STATUS == 'Data Saved') {
						var oModel = that.getView().getModel();
						var editmode = oModel.getProperty("/requestmode");
						editmode = Boolean(1);
						oModel.setProperty("/requestmode", editmode);
						var editmode1 = oModel.getProperty("/comp_table_mode");
						editmode1 = Boolean(1);
						oModel.setProperty("/comp_table_mode", editmode1);
						that.getView().byId("saveBtn").setEnabled(true);
						that.getView().byId("submitBtn").setEnabled(true);
						that.getView().byId("withdrawBtn").setEnabled(false);
						that._onRadioButtonGroupSelect();
						//  that.getView().byId("local_total_final").setEnabled(true);
						var rwb = window.oModel.getProperty("/rwb_component");

						if (rwb == 0) {
							that.getView().byId("local_total_final").setEnabled(false);

						} else {
							that.getView().byId("local_total_final").setEnabled(true);
						}

						MessageBox.alert("You can edit this FAR eForm.");
						var url = "/sap/opu/odata/sap/YFPSFIPFRDD0015_EFORM_SRV/";
						var oModelData = new sap.ui.model.odata.ODataModel(url, true);
						var relPath = "eFormUsers(NAME='',FORM='FAR')";
						var that12 = that;
						oModelData.read(relPath, null, [], false, function (oData, response) {
							if (response.data.PAYMENT_MGR == 'X' || window.can_edit == 'X') {
								that12.getView().byId("wbs_inp").setEnabled(true);

							} else {
								that12.getView().byId("wbs_inp").setEnabled(false);
							}
						});

					}
					if (response.data.STATUS == 'In Approval') {
						that._onButtonPressWithdraw();
						var url = "/sap/opu/odata/sap/YFPSFIPFRDD0015_EFORM_SRV/";
						var oModelData = new sap.ui.model.odata.ODataModel(url, true);
						var relPath = "eFormUsers(NAME='',FORM='FAR')";
						var that13 = that;
						oModelData.read(relPath, null, [], false, function (oData, response) {
							if (response.data.PAYMENT_MGR == 'X' || window.can_edit == 'X') {
								that13.getView().byId("wbs_inp").setEnabled(true);
							} else {
								that13.getView().byId("wbs_inp").setEnabled(false);
							}
						});
						//REQ0602256:NSONI3:GWDK902227:05/31/2021:WBS field enable/disbale changes:START
						that.getView("FarRequest").byId("costcenter_inp").setValue("");
						that.getView().getModel().setProperty("cost_center", "");
						//REQ0602256:NSONI3:GWDK902227:05/31/2021:WBS field enable/disbale changes:END
					}
					if (response.data.STATUS == 'Approved') {
						MessageBox.alert("You cannot edit this Approved FAR eForm.");
					}
					if (response.data.STATUS == 'Withdrawn') {
						var oModel = that.getView().getModel();
						var editmode = oModel.getProperty("/requestmode");
						editmode = Boolean(1);
						oModel.setProperty("/requestmode", editmode);
						var editmode1 = oModel.getProperty("/comp_table_mode");
						editmode1 = Boolean(1);
						oModel.setProperty("/comp_table_mode", editmode1);
						that.getView().byId("saveBtn").setEnabled(true);
						that.getView().byId("submitBtn").setEnabled(true);
						that.getView().byId("withdrawBtn").setEnabled(false);
						var rbw = window.oModel.getProperty("/rwb_component");

						if (rwb == 0) {
							that.getView().byId("local_total_final").setEnabled(false);

						} else {
							that.getView().byId("local_total_final").setEnabled(true);
						}
						MessageBox.alert("You can edit this FAR eForm.");
						var url = "/sap/opu/odata/sap/YFPSFIPFRDD0015_EFORM_SRV/";
						var oModelData = new sap.ui.model.odata.ODataModel(url, true);
						var relPath = "eFormUsers(NAME='',FORM='FAR')";
						var that14 = that;
						oModelData.read(relPath, null, [], false, function (oData, response) {
							if (response.data.PAYMENT_MGR == 'X' || window.can_edit == 'X') {
								that14.getView().byId("wbs_inp").setEnabled(true);

							} else {
								that14.getView().byId("wbs_inp").setEnabled(false);
							}
						});
					}
					if (response.data.STATUS == 'X') {
						MessageBox.alert("You cannot edit this FAR eForm.");
					}
				});

				//REQ0602256:NSONI3:GWDK902117:02/04/2021:WBS field enable/disbale changes:START
				window.wbs_input_field = this.getView("FarRequest").byId("wbs_inp");
				//REQ0602256:NSONI3:GWDK902227:02/09/2021:WBS field enable/disbale changes:START
				this.getView("FarRequest").byId("wbs_inp").setValue("");
				this.getView().getModel().setProperty("wbs", "");
				//REQ0602256:NSONI3:GWDK902227:02/09/2021:WBS field enable/disbale changes:END
				var rec = this.getView().byId("costcenter_inp").getValue().split(' ')[0];
				var path = "eFormCostCenters?$filter=NAME eq '" + rec + "' ";
				oModelData.read(path, null, [], false, function (oData, response) {
					var wbs_flag = response.data.results[0].WBS_VISIBLITY_FLG;
					if (wbs_flag == "X") {
						that.getView().byId("wbs_inp").setEnabled(false);
					} else {
						that.getView().byId("wbs_inp").setEnabled(true);
					}
				});
				//REQ0602256:NSONI3:GWDK902117:02/04/2021:WBS field enable/disbale changes:END
			},

			/*Handles printing of summary page.*/
			onPrintPress: function () {
				var title = this.getView().byId("PAGE_TITLE").getTitle();
				var commtTable = this.getView().byId("comments_table").getItems();
				var appTable = this.getView().byId("summary_approvers_table").getItems();
				var reqType = this.getView().byId("maintab_requestType").getValue();
				var s1, s2, s3, s4, s5, s6, s7, s8, s9, s10;

				s9 = this.getView().byId("sum_con_byc").getSelected();
				s10 = this.getView().byId("sum_con_byt").getSelected();
				var compTable = this.getView().byId("sum_component_table").getItems();

				if (s9 === true) {
					s9 = "checked";
				} else {
					s9 = "unchecked";
				}
				if (s10 === true) {
					s10 = "checked";
				} else {
					s10 = "unchecked";
				}

				var table1 =

					'<center><h3>Approvers</h3></center><hr>' +

					"<table width='100%'><tr><td style='border:1px solid black;'>Approved </td><td style='border:1px solid black;'> Approver  </td><td style='border:1px solid black;'> Reviewer Type  </td><td style='border:1px solid black;'> Approved By " +
					"</td><td style='border:1px solid black;'> Approval Date</td><td style='border:1px solid black;'> Approval Time (PST)  </td>" +
					"<td style='border:1px solid black;'> Manually added  </td><td style='border:1px solid black;'> Added By  </td><td style='border:1px solid black;'> Added On  </td></tr>";

				for (var i = 0; i < appTable.length; i++) {
					table1 = table1 +
						"<tr><td style='border:1px solid black;'>" + appTable[i].mAggregations.cells[0].getText() +
						"</td><td style='border:1px solid black;'> " + appTable[i].mAggregations.cells[1].getText() +
						"</td><td style='border:1px solid black;'>" +
						appTable[i].mAggregations.cells[2].getText() + "</td><td style='border:1px solid black;'>" +
						appTable[i].mAggregations.cells[3].getText() +
						"</td><td style='border:1px solid black;'>" + appTable[i].mAggregations.cells[4].getText() +
						"</td><td style='border:1px solid black;'>" + appTable[i].mAggregations.cells[5].getText() + " </td>" +
						"<td style='border:1px solid black;'>" + appTable[i].mAggregations.cells[6].getText() +
						" </td><td style='border:1px solid black;'>" + appTable[i].mAggregations.cells[7].getText() +
						" </td><td style='border:1px solid black;'>" +
						appTable[i].mAggregations.cells[8].getText() + "</td></tr>";
				}

				table1 = table1 +

					'</table>';

				table1 = table1 +
					'<center><h3>Comments</h3></center><hr>' +
					'<B>Comments: </B>' + this.getView().byId("comments_inp").getValue() + '<BR>' +
					"<table width='100%'><tr><td style='border:1px solid black;'> Id</td><td style='border:1px solid black;'> Comments </td><td style='border:1px solid black;'> Added By  </td>" +
					"<td style='border:1px solid black;'> Added On" +
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
				var localCurrencyTab;
				if (s9 === "checked") {
					localCurrencyTab =
						"<table width='100%'><tr><td style='border:1px solid black;'>Id </td><td style='border:1px solid black;'> Description " +
						"</td><td style='border:1px solid black;'>Amount</td></tr>";
					for (var i = 0; i < compTable.length; i++) {
						localCurrencyTab = localCurrencyTab +
							"<tr><td style='border:1px solid black;'>" + compTable[i].mAggregations.cells[0].getText() +
							"</td><td style='border:1px solid black;'> " + compTable[i].mAggregations.cells[1].getText() +
							"</td><td style='border:1px solid black;'>" +
							compTable[i].mAggregations.cells[2].getText() + "</tr>";
					}

					localCurrencyTab = localCurrencyTab +

						'</table>';
				} else {
					localCurrencyTab = "";
				}

				var table3 = table1 + '</BODY>';

				var reqTypeChange;
				if (reqType === "Create") {
					reqTypeChange =
						'<B>Cost Center (Requesting Department): </B>' + this.getView().getModel().getProperty("/cost_center") + '<BR>' +

						'<B>Company Code: </B>' + this.getView().getModel().getProperty("/comp_code") + '<BR>' +

						'<B>WBS: </B>' + this.getView().getModel().getProperty("/wbs") + '<BR>' +

						'<B>Expected Asset Location: </B>' + this.getView().getModel().getProperty("/exp_loc") + '<BR>' +

						'<B>Project Supervisor: </B> ' + this.getView().getModel().getProperty("/proj_super") + '<BR>' +

						'<B>Telephone: </B>' + this.getView().getModel().getProperty("/tel") + '<BR>' +

						'<B>Scheduled Completion: </B>' + this.getView().getModel().getProperty("/sch_comp") + '<BR>' +

						'<B>Date Submitted: </B>' + this.getView().getModel().getProperty("/date_sub") + '<BR>' +

						'<B>Detail Description and Business Justification: </B>' + this.getView().getModel().getProperty("/desc_bus_change") + '<BR>' +

						'<center><h3>Project Details</h3></center><hr>' +

						'<B>Local Currency: </B>' + this.getView().getModel().getProperty("/loc_currency") + '<BR>' +
						'<input type="radio"  value="By Component"' + s9 + '>' + ' By Component<BR>' +
						'<input type="radio"  value="By Total"' + s10 + '>' + ' By Total  <BR>' +
						localCurrencyTab +
						'<B>Total Component Amount: </B> Amount<BR>' +

						'<B>Total: </B> ' + this.getView().getModel().getProperty("/loc_tot_final") + '<BR>' +
						// REQ0591945:NSONI3:GWDK902117:08/28/2020:Add new exchange rate field:START
						'<B>Exchange Rate: </B> ' + this.getView().getModel().getProperty("/EXCHANGE_RATE") + '<BR>' +
						// REQ0591945:NSONI3:GWDK902117:08/28/2020:Add new exchange rate field:END
						'<B>Total(USD): </B> ' + this.getView().getModel().getProperty("/usd_tot_final") + '<BR>';
				} else {
					reqTypeChange =
						'<B>FAR Reference: </B>' + this.getView().getModel().getProperty("/far_ref") + '<BR>' +

						'<B>WBS: </B>' + this.getView().getModel().getProperty("/wbs") + '<BR>' +

						'<B>Expected Asset Location: </B>' + this.getView().getModel().getProperty("/exp_loc") + '<BR>' +

						'<B>Project Supervisor: </B>' + this.getView().getModel().getProperty("/proj_super") + '<BR>' +

						'<B>Date Submitted: </B>' + this.getView().getModel().getProperty("/date_sub") + '<BR>' +

						'<B>Original FAR Budget: </B>' + this.getView().getModel().getProperty("/original_far") + '<BR>' +

						//REQ0567864:NSONI3:GWDK902066:05/11/2020:Add new change request field for budget:START
						'<B>Requested Change: </B>' + this.getView().getModel().getProperty("/requested_far") + '<BR>' +
						//REQ0567864:NSONI3:GWDK902066:05/11/2020:Add new change request field for budget:END

						'<B>Revised FAR Budget: </B>' + this.getView().getModel().getProperty("/revised_far") + '<BR>' +

						'<B>This change will constitute an increase in: </B>' + this.getView().getModel().getProperty("/this_change") + '<BR>' +

						'<B>Description of change: </B> ' + this.getView().getModel().getProperty("/desc_change") + '<BR>';

				}

				var i;
				var header =
					'<center><h3>' + title + '</h3></center><hr>' +
					'<center><h3>Title Information</h3></center><hr>' +

					'<BODY>' +

					'<B>Title: </B>' + this.getView().getModel().getProperty("/project_title") + '<BR>' +

					'<B>Decsription: </B>' + this.getView().getModel().getProperty("/project_desc") + '<BR>' +

					'<B>Preparer: </B>' + this.getView().getModel().getProperty("/preparer") + '<BR>' +

					'<B>*On Behalf Of: </B>' + this.getView().getModel().getProperty("/onbehalfof") + '<BR>' +

					'<B>Requested Phone: </B>' + this.getView().getModel().getProperty("/reqphone") + '<BR>' +

					'<B>Requested Email.: </B>' + this.getView().getModel().getProperty("/reqemail") + '<BR>' +

					'<B>COFA - LOB: </B>' + this.getView().getModel().getProperty("/cofa_lob") + '<BR>' +

					'<B>COFA SUB-LOB: </B>' + this.getView().getModel().getProperty("/cofa_sublob") + '<BR>' +

					'<center><h3>Main Information</h3></center><hr>' +

					'<B>Request Type </B>' + this.getView().getModel().getProperty("/request_type") + '<BR>' +

					//On change scenario.
					reqTypeChange;

				//On Create scenario.

				var cltstrng = "width=500px,height=600px";
				var wind = window.open("", cltstrng);
				wind.document.write(header + table3);
				//wind.save();
				wind.print();

			},
			clearcomments: function () {
				this.getView().byId("comments_inp").setValue("");
			},
			savecomments: function () {
				var curr_view = this.getView();
				var s = {};
				s.PROJ_DESC = this.getView().byId("title_desc_inp").getValue();
				s.REQUEST_TYPE = this.getView().byId("maintab_requestType").mProperties.value;
				s.LOCALCURRENCY = this.getView().byId("localcurrency_inp").mProperties.value;
				// REQ0591945:NSONI3:GWDK902117:08/27/2020:update function from getText to Value:START
				s.TOTALUSD = this.getView().byId("usd_total_final").getValue().split(',').join('');
				// REQ0591945:NSONI3:GWDK902117:08/27/2020:update function from getText to Value:END
				s.TOTALLOC = this.getView().byId("local_total_final").getValue().split(',').join('');
				if (window.status == 'In Approval') {
					s.STATUS = "In Approval";
					s.ACTION = "SAVE";
				}
				if (window.status == 'Data Saved') {
					s.STATUS = "Data Saved";
					s.ACTION = "SAVE";
				}
				if (window.status == "") {
					s.STATUS = "Data Saved";
					s.ACTION = "SAVE";
				}
				if (window.status == 'Withdrawn') {
					s.STATUS = "Withdrawn Comments";
					s.ACTION = "SAVE";
				}

				s.STATUS_R = window.isreject;
				s.DESC_BJ = this.getView().byId("maintab_fe_dabj_inp").getValue();
				s.DESC_CHANGE = this.getView().byId("maintab_fe_doc_inp").getValue();
				s.THIS_CHANGE = this.getView().byId("maintab_fe_tc_inp").getValue();
				s.REV_FAR_BUDGET = this.getView().byId("maintab_fe_rfb_inp").getValue().split(',').join('');
				s.ORIG_FAR_BUDGET = this.getView().byId("maintab_fe_ofb_inp").getValue().split(',').join('');
				s.DATE_SUBMITTED = this.getView().byId("maintab_fe_ds_inp").getValue();
				s.SCH_COMPDATE = this.getView().byId("sch_compdate_inp").getValue();
				s.TELEPHONE = this.getView().byId("telephone").getValue();
				s.PROJ_SUPER = this.getView().byId("projsuper_inp").getValue();
				s.EXP_LOC = this.getView().byId("expectedloc_inp").getValue();
				s.WBS = this.getView().byId("wbs_inp").getValue();
				s.COMPANY_CODE = this.getView().byId("companycode_inp").getValue();
				s.COST_CENTER = this.getView().byId("costcenter_inp").getValue();
				s.FAR_REF = this.getView().byId("maintab_farref_inp").getValue();
				s.COFA_SUBLOB = this.getView().byId("title_cofasublob_inp").getValue();
				s.COFA_LOB = this.getView().byId("title_cofalob_inp").getValue();
				s.REQUESTER_PHONE = this.getView().byId("title_reqphone_inp").getValue();
				s.REQUESTER_EMAIL = this.getView().byId("title_reqemail_inp").getValue();
				s.PREPARER = this.getView().byId("title_prep_inp").getValue();
				s.ON_BEHALF_OF = this.getView().byId("onbehalfof_inp").getValue();
				s.TITLE = this.getView().byId("title_title_inp").getValue();
				var oModel = this.getView().getModel();
				var aRows = oModel.getProperty("/component_far");
				var loccurrency = this.getView().byId("localcurrency_inp").mProperties.value;
				s.headercomp_n = [];
				for (var t = 0; t < aRows.length; t++) {
					if (aRows[t].description != "") {
						s.headercomp_n.push({
							COMP_CURR: loccurrency,
							COMP_AMT: aRows[t].amount.split(',').join(''),
							COMP_DESC: aRows[t].description,
							COMP_ITEMNO: String(t + 1),
							EFORM_NUM: window.eform_num
						});
					}
				}
				if (window.eform_num == "1") {
					s.EFORM_NUM = "1";
					var that88 = this;
					var gatewayUrl = "/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/";
					var oModel = new sap.ui.model.odata.ODataModel(gatewayUrl, true);
					oModel.create("/eFormHeaders", s, null, function (oData, response) {
						window.eform_num = response.data.EFORM_NUM;
						that88.getView().byId("title_eform_no").setText(window.eform_num);
					});
				} else {
					s.EFORM_NUM = window.eform_num;
					var gatewayUrl = "/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/";
					var oModel = new sap.ui.model.odata.ODataModel(gatewayUrl, true);
					oModel.create("/eFormHeaders", s, null, function (oData, response) {});
				}
				this.getView().byId("page").setText("Fixed Asset Request - " + window.eform_num);
				var gatewayUrl = "/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/";
				var oModel = new sap.ui.model.odata.ODataModel(gatewayUrl, true);
				var c = {};
				c.FORM_NO = window.eform_num;
				c.COMMENTS = this.getView().byId("comments_inp").getValue();
				c.SEQUENCE = "";
				c.CREATOR = "";
				c.CR_DATE = "";
				c.TIME = "";
				var that = this;
				oModel.create("/eFormComments", c, null, function (oData, response) {
					if (response.data.FORM_NO == window.eform_num) {
						MessageBox.alert("Comment added successfully.");
					}
				});
				var url = "/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/";
				var oModelData = new sap.ui.model.odata.ODataModel(url, true);
				var relPath = "eFormComments?$filter=FORM_NO eq '" + window.eform_num + "'";
				var that = this;
				oModelData.read(relPath, null, [], false, function (oData, response) {
					that.getView().byId("comments_table").destroyItems();
					var counter = response.data.results.length;
					var i = 0;
					for (i = 0; i < counter; i++) {
						var table = that.getView().byId("comments_table");
						var vedit = response.data.results[i].EDIT;
						var data = new sap.m.ColumnListItem({
							cells: [
								new sap.m.Text({
									text: response.data.results[i].SEQUENCE
								}),
								new sap.m.TextArea({
									value: response.data.results[i].COMMENTS,
									rows: 2,
									cols: 70,
									enabled: vedit
								}),
								new sap.m.Text({
									text: response.data.results[i].CREATOR
								}),
								new sap.m.Text({
									text: response.data.results[i].CR_DATE
								})
							]
						})
						table.addItem(data);
					} //for
				}); //odata read
			},
			updatecomment: function (oEvent) {
				var curr_view = this.getView();
				var gatewayUrl = "/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/";
				var oModel = new sap.ui.model.odata.ODataModel(gatewayUrl, true);
				var selected_item = this.getView().byId("comments_table").getSelectedItem();
				var c = {};
				c.FORM_NO = window.eform_num;
				c.COMMENTS = selected_item.mAggregations.cells[1].mProperties.value;
				c.SEQUENCE = selected_item.mAggregations.cells[0].mProperties.text;
				c.CREATOR = "";
				c.CR_DATE = "";
				c.TIME = "";
				var that = this;
				oModel.create("/eFormComments", c, null, function (oData, response) {
					if (response.data.FORM_NO == window.eform_num) {
						MessageBox.alert("Comment updated successfully.");
					}
				});
				var url = "/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/";
				var oModelData = new sap.ui.model.odata.ODataModel(url, true);
				var relPath = "eFormComments?$filter=FORM_NO eq '" + window.eform_num + "'";
				var that = this;
				oModelData.read(relPath, null, [], false, function (oData, response) {
					that.getView().byId("comments_table").destroyItems();
					var counter = response.data.results.length;
					var i = 0;
					for (i = 0; i < counter; i++) {
						var table = that.getView().byId("comments_table");
						var vedit = response.data.results[i].EDIT;
						var data = new sap.m.ColumnListItem({
							cells: [
								new sap.m.Text({
									text: response.data.results[i].SEQUENCE
								}),
								new sap.m.TextArea({
									value: response.data.results[i].COMMENTS,
									rows: 2,
									cols: 70,
									enabled: vedit
								}),
								new sap.m.Text({
									text: response.data.results[i].CREATOR
								}),
								new sap.m.Text({
									text: response.data.results[i].CR_DATE
								})
							]
						})
						table.addItem(data);
					} //for
				}); //odata read
			},
			deletecomment: function (oEvent) {
				var curr_view = this.getView();
				var gatewayUrl = "/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/";
				var oModel = new sap.ui.model.odata.ODataModel(gatewayUrl, true);
				var selected_item = this.getView().byId("comments_table").getSelectedItem();
				var vseq = selected_item.mAggregations.cells[0].mProperties.text;
				vseq.trim();
				var vcr = selected_item.mAggregations.cells[2].mProperties.text;
				if (selected_item.mAggregations.cells[2].mProperties.text == this.getView().byId("onbehalfof_inp").getValue()) {
					var that = this;
					oModel.remove("eFormComments(FORM_NO='" + window.eform_num + "'" + ",SEQUENCE='" + vseq + "'" + ",CREATOR='" + vcr + "')", {
						success: jQuery.proxy(function () {
							jQuery.sap.require("sap.m.MessageToast");
							sap.m.MessageToast.show("Comment deleted successfully");
						}, this),
						error: jQuery.proxy(function (mResponse) {
							var body = mResponse.response.body;
							var res = body.split(",");
							console.log(res);
							sap.m.MessageBox.show("Comment not deleted.");
						}, this)
					});

					var url = "/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/";
					var oModelData = new sap.ui.model.odata.ODataModel(url, true);
					var relPath = "eFormComments?$filter=FORM_NO eq '" + window.eform_num + "'";
					var that = this;
					oModelData.read(relPath, null, [], false, function (oData, response) {
						that.getView().byId("comments_table").destroyItems();
						var counter = response.data.results.length;
						var i = 0;
						for (i = 0; i < counter; i++) {
							var table = that.getView().byId("comments_table");
							var vedit = response.data.results[i].EDIT;
							var data = new sap.m.ColumnListItem({
								cells: [
									new sap.m.Text({
										text: response.data.results[i].SEQUENCE
									}),
									new sap.m.TextArea({
										value: response.data.results[i].COMMENTS,
										rows: 2,
										cols: 70,
										enabled: vedit
									}),
									new sap.m.Text({
										text: response.data.results[i].CREATOR
									}),
									new sap.m.Text({
										text: response.data.results[i].CR_DATE
									})
								]
							})
							table.addItem(data);
						} //for
					}); //odata read

				} else {
					sap.m.MessageBox.show("Comment cannot be deleted for other user.");
				}

			},

			_ondeletepress: function () {

				if (window.eform_num == '1') {
					sap.m.MessageBox.show("Request not found in database.");
				} else {
					var that22 = this;
					new Promise(function (fnResolve) {
						sap.m.MessageBox.confirm("Do you want to delete FAR request?", {
							title: "Delete FAR",
							actions: ["Yes", "No"],
							onClose: function (sActionClicked) {
								if (sActionClicked === "Yes") {
									var s = {};
									s.ACTION = "DELETE";
									s.EFORM_NUM = window.eform_num;
									s.headercomp_n = [];
									s.headerapprover_n = [];
									var gatewayUrl = "/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/";
									var oModel = new sap.ui.model.odata.ODataModel(gatewayUrl, true);

									oModel.create("/eFormHeaders", s, null, function (oData, response) { //Successfully created
											that22._onPageNavButtonPress();
										},
										function (error) {});
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

			_onNavigateHome: function (value) {
				//S4R:NSONI3:GWDK902360:07/22/2021:Replacing old url with new url:START
				//OLD URL: /sap/bc/ui5_ui5/ui2/ushell/shells/abap/Fiorilaunchpad.html 
				//NEW URL: /sap/bc/ui2/flp
				window.location.href = "/sap/bc/ui2/flp";
				//S4R:NSONI3:GWDK902360:07/22/2021:Replacing old url with new url:END
				//window.close();
				//window.open("/sap/bc/ui5_ui5/ui2/ushell/shells/abap/Fiorilaunchpad.html");
			},

			approve_eform: function (value) {

				//***************nsoni started 04/07/2021
				var selectedRequest = this.getView().byId("maintab_requestType").mProperties.value;
				var url = "/sap/opu/odata/sap/YFPSFIPFRDD0015_EFORM_SRV/";
				var oModelData = new sap.ui.model.odata.ODataModel(url, true);
				var relPath = "eFormUsers(NAME='',FORM='FAR')";
				var that11 = this;
				var isWBSAdded = true;
				oModelData.read(relPath, null, [], false, function (oData, response) {
					if (selectedRequest == "Create") {
						if (response.data.PAYMENT_MGR == 'X' && window.wbs_field_visibility_status == 'X') {
							that11.getView().byId("wbs_inp").setEnabled(true);
							if (that11.getView().byId("wbs_inp").getValue() === "") {
								that11.getView().byId("wbs_inp").setValueState("Error");
								isWBSAdded = false;
							} else {
								that11.getView().byId("wbs_inp").setValueState("None");
							}
						}
					}
				});
				if (!isWBSAdded) {
					MessageBox.error("WBS field should not be empty.");
					return;
				}
				//***************nsoni ended

				var msg_returned = "";
				var sValue = jQuery.sap.getUriParameters().get("SOURCE");
				if (sValue == "INBOX") {
					var sDialogName = "Dialog13";
					window.eform_num_inbox = window.eform_num;
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
							viewName: "spefar.app.view." + sDialogName
						});
						this.getView().addDependent(oView);
						oView.getController().setRouter(this.oRouter);
						oView.getController().setValueObject(window.eform_num);
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
					var url = "/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/";
					var oModelData = new sap.ui.model.odata.ODataModel(url, true);
					var eform_num = window.eform_num;
					var relPath = "/eFormValidateApprovals?$filter=EFORM_NUM eq '" + eform_num + "' and ACTION eq 'A' and WBS eq '" + this.getView().byId(
						"wbs_inp").getValue() + "'";
					var that = this;
					var oSource = value.getSource();
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
											//S4R:NSONI3:GWDK902360:07/22/2021:Replacing old url with new url:START
											//OLD URL: /sap/bc/ui5_ui5/ui2/ushell/shells/abap/Fiorilaunchpad.html 
											//NEW URL: /sap/bc/ui2/flp
											window.open("/sap/bc/ui2/flp#WorkflowTask-displayInbox", "_self");
										} else {
											window.open(
												"/sap/bc/ui2/flp?&sap-ushell-config=headerless#Shell-runStandaloneApp?sap-ushell-SAPUI5.Component=cross.fnd.fiori.inbox&sap-ushell-url=/sap/bc/ui5_ui5/sap/ca_fiori_inbox",
												"_self");
											//S4R:NSONI3:GWDK902360:07/22/2021:Replacing old url with new url:END
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
			reject_eform: function (value) {
				var msg_returned = "";
				var sValue = jQuery.sap.getUriParameters().get("SOURCE");
				if (sValue == "INBOX") {
					window.eform_num_inbox = window.eform_num;
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
							viewName: "spefar.app.view." + sDialogName
						});
						this.getView().addDependent(oView);
						oView.getController().setRouter(this.oRouter);
						oView.getController().setValueObject(window.eform_num);
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
					var url = "/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/";
					var oModelData = new sap.ui.model.odata.ODataModel(url, true);
					var eform_num = window.eform_num;
					var relPath = "/eFormValidateApprovals?$filter=EFORM_NUM eq '" + eform_num + "' and ACTION eq 'R'";
					var that = this;
					oModelData.read(relPath, null, [], false, function (oData, response) {
						var msg_type = response.data.results[0].MSG_TYPE;
						if (msg_type == "E") {
							// MessageBox.error(response.data.results[0].MSG);
							msg_returned = response.data.results[0].MSG + ".";
						} else {
							msg_returned = "The Eform has been successfully rejected.";

							window.isreject = "Rejected";
						}
						new Promise(function (fnResolve) {
							sap.m.MessageBox.confirm(msg_returned + "Do you want to go to the Fiori My Inbox App?", {
								title: "Confirm Navigation",
								actions: ["Yes", "No"],
								onClose: function (sActionClicked) {
									if (sActionClicked === "Yes") {
										if (window.top.location.href.toLowerCase().indexOf("fiorilaunchpad") == -1) {
											//S4R:NSONI3:GWDK902360:07/22/2021:Replacing old url with new url:START
											//OLD URL: /sap/bc/ui5_ui5/ui2/ushell/shells/abap/Fiorilaunchpad.html 
											//NEW URL: /sap/bc/ui2/flp
											window.open("/sap/bc/ui2/flp#WorkflowTask-displayInbox", "_self");
										} else {
											window.open(
												"/sap/bc/ui2/flp?&sap-ushell-config=headerless#Shell-runStandaloneApp?sap-ushell-SAPUI5.Component=cross.fnd.fiori.inbox&sap-ushell-url=/sap/bc/ui5_ui5/sap/ca_fiori_inbox",
												"_self");
											//S4R:NSONI3:GWDK902360:07/22/2021:Replacing old url with new url:END
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

			navigate_inbox: function (value) {
				if (value !== "") {
					if (value == "Rejected") {

						window.status = value;
					}
				}
				//S4R:NSONI3:GWDK902360:07/22/2021:Replacing old url with new url:START
				//OLD URL: /sap/bc/ui5_ui5/ui2/ushell/shells/abap/Fiorilaunchpad.html 
				//NEW URL: /sap/bc/ui2/flp
				window.open("/sap/bc/ui2/flp", "_self");
				//S4R:NSONI3:GWDK902360:07/22/2021:Replacing old url with new url:END
				window.close();
			},

			onChangeofCompAmount: function (oEvent) {
				//This code was generated by the layout editor.
				var value = oEvent.getSource().getValue();
				var floatValue = parseFloat(value);
				oEvent.getSource().setValue(new Intl.NumberFormat('en-US').format(floatValue));
			},

			// REQ0602256:NSONI3:GWDK902117:01/18/2021:add new factory method to add data in approver table cells:START
			approverFlowFactory: function (sId, oContext) {
				var oTemplate;
				if (oContext.getProperty("isInput")) {

					oTemplate = new sap.m.ColumnListItem({
						cells: [
							new sap.m.CheckBox({
								text: "",
								selected: "{path:'approved',formatter:'spefar.app.model.formatter.stringToBoolean'}",
								editable: true,
								enabled: "{can_edit}",
								visible: true
							}),
							new sap.m.Input({
								value: "{approver}",
								enabled: "{can_edit}",
								// maxLength: 0,
								showValueHelp: true,
								valueHelpOnly: false,
								valueHelpRequest: [this._onInputValueHelpRequest10, this]
							}),
							new sap.m.Text({
								text: "{reviewer_type}"
							}),
							new sap.m.Text({
								text: "{approved_by}",
								wrapping: true
							}),
							new sap.m.Text({
								text: "{approval_date}"
							}),
							new sap.m.Text({
								text: "{approval_time}"
							}),
							new sap.m.CheckBox({
								editable: true,
								selected: "{path:'manual_addition',formatter:'spefar.app.model.formatter.stringToBoolean'}",
								enabled: "{can_edit}"
							}),
							new sap.m.Text({
								text: "{added_by}",
								wrapping: true
							}),
							new sap.m.Text({
								text: "{added_on}"
							})
						]
					});
				} else {
					oTemplate = new sap.m.ColumnListItem({
						cells: [
							new sap.m.CheckBox({
								text: "",
								selected: "{path:'approved',formatter:'spefar.app.model.formatter.stringToBoolean'}",
								editable: true,
								enabled: "{can_edit}",
								visible: true
							}),
							new sap.m.Link({
								text: "{approver}",
								enabled: "{grp}",
								press: [this._displayEmployees, this],
								wrapping: true
							}),
							new sap.m.Text({
								text: "{reviewer_type}"
							}),
							new sap.m.Text({
								text: "{approved_by}",
								wrapping: true
							}),
							new sap.m.Text({
								text: "{approval_date}"
							}),
							new sap.m.Text({
								text: "{approval_time}"
							}),
							new sap.m.CheckBox({
								editable: true,
								selected: "{path:'manual_addition',formatter:'spefar.app.model.formatter.stringToBoolean'}",
								enabled: "{can_edit}"
							}),
							new sap.m.Text({
								text: "{added_by}",
								wrapping: true
							}),
							new sap.m.Text({
								text: "{added_on}"
							})
						]
					});
				}
				return oTemplate;
			},
			// REQ0602256:NSONI3:GWDK902117:01/18/2021:add new factory method to add data in approver table cells:END

			// REQ0602256:NSONI3:GWDK902117:01/18/2021:add new this display employye method to pop up group data:START
			_displayEmployees: function (oEvent) {
					var oEventHandler = oEvent;
					var that = this;
					var sDept = oEvent.getSource().getText();
					var oFilterFormType = new sap.ui.model.Filter("FormTyp", sap.ui.model.FilterOperator.EQ, "FAR");
					var oFilterRole = new sap.ui.model.Filter("Role", sap.ui.model.FilterOperator.EQ, sDept);
					var gatewayUrl = "/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/";
					var oModel = new sap.ui.model.odata.ODataModel(gatewayUrl, true);
					oModel.read("/YFPSFIC00017_GRPSet", {
						async: false,
						filters: [oFilterFormType, oFilterRole],
						success: function (oData, oResponse) {
							if (!that._oPopover) {
								that._oPopover = sap.ui.xmlfragment("spefar.app.fragments.employee", that);
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
				// REQ0602256:NSONI3:GWDK902117:01/18/2021:add new this display employye method to pop up group data:END

		});
	},
	/* bExport= */
	true);