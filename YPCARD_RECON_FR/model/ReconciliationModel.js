sap.ui.define(
	["sap/ui/model/json/JSONModel",
		"sap/ui/core/ValueState",
		"sap/m/MessageBox",
		"sap/m/MessageToast",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sony/pcard/reconciliation/appYPCardReconciliation/controller/PCardReconciliationSearch.controller"
	],
	function (JSONModel, ValueState, MessageBox, MessageToast, Filter, FilterOperator, view) {
		"use strict";
		var sTittle;
		return {
			/**
			 * Initializes the models required by Reconciliation view
			 * @param  {model} oDataModel     Server side odata model
			 * @param  {component} component      Component for the application
			 */
			initialize: function com(component, oView, odataModel, Controller) {
				sTittle = "";
				this.Controller = Controller;
				this._serverModel = odataModel;
				//this._resourceBundle = resourceBundle;
				this._component = component;
				this._View = oView;
				var oHeaderModel = new JSONModel();

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
				oHeaderModel.setData(headerData);
				var oApproverModel = new JSONModel();
				var oCollectionModel = new JSONModel();
				var oCommentsModel = new JSONModel();
				this._component.setModel(oHeaderModel, "headerUserModel");
				this._component.setModel(new JSONModel(), "LobUserSearchModel");
				this._component.setModel(new JSONModel(), "uniqueLobModel");
				this._component.setModel(oApproverModel, "oApproverModel");
				this._component.setModel(oCommentsModel, "oCommentsModel");
				this._component.setModel(oCollectionModel, "oCollectionModel");
			},
			getFormData: function (sFormNum, action) {
				this.title = sFormNum;
				var oFormNumFilter = new Filter("EFORM_NUM", FilterOperator.EQ, sFormNum);
				var aFilter = [];
				aFilter.push(oFormNumFilter);

				var that = this;
				that._View.setBusy(true);
				this._serverModel.read("/ReconciliationHeaders", {
					filters: aFilter,
					urlParameters: {
						$expand: 'reconapproves'
					},
					success: function (data) {
						var oData = data.results;

						that.arr1 = oData;

						if (oData[0].IS_UNSUAL_ACT === "Yes") {
							that._component.getModel("headerUserModel").setProperty("/jusficationVisibleField6", true);
							that._component.getModel("headerUserModel").setProperty("/selectedIndex6", 0);
							that._component.getModel("headerUserModel").setProperty("/IS_ANY_UNUSUAL", "Yes");
						} else if (oData[0].IS_UNSUAL_ACT === "No") {
							that._component.getModel("headerUserModel").setProperty("/jusficationVisibleField6", false);
							that._component.getModel("headerUserModel").setProperty("/selectedIndex6", 1);
							that._component.getModel("headerUserModel").setProperty("/IS_ANY_UNUSUAL", "Yes");
						} else {
							that._component.getModel("headerUserModel").setProperty("/selectedIndex6", -1);
						}
						if (oData[0].USER_CHECK === "Y") {
							that._component.getModel("headerUserModel").setProperty("/jusficationVisibleField5", true);
							that._component.getModel("headerUserModel").setProperty("/selectedIndex5", true);
							that._component.getModel("headerUserModel").setProperty("/USER_CHECK", "Y");
							//REQ0481487:NSONI3:GWDK901951:03/05/2020:card holder checklist not checked on copy eform:START
							if (action === "copy") {
								that._component.getModel("headerUserModel").setProperty("/selectedIndex5", false);
								that._component.getModel("headerUserModel").setProperty("/selectedIndex6", -1);
							}
							//REQ0481487:NSONI3:GWDK901951:03/05/2020:card holder checklist not checked on copy eform:END
						}

						//supervisor checklist

						if (oData[0].IS_UNSUAL_ACT_S === "Yes") {
							that._component.getModel("headerUserModel").setProperty("/jusficationVisibleField6S", true);
							that._component.getModel("headerUserModel").setProperty("/selectedIndex6S", 0);
							that._component.getModel("headerUserModel").setProperty("/IS_ANY_UNUSUAL_S", "Yes");
						} else if (oData[0].IS_UNSUAL_ACT_S === "No") {
							that._component.getModel("headerUserModel").setProperty("/jusficationVisibleField6S", false);
							that._component.getModel("headerUserModel").setProperty("/selectedIndex6S", 1);
							that._component.getModel("headerUserModel").setProperty("/IS_ANY_UNUSUAL_S", "Yes");
						} else {
							that._component.getModel("headerUserModel").setProperty("/selectedIndex6S", -1);
						}
						if (oData[0].USER_CHECK_S === "Y") {
							that._component.getModel("headerUserModel").setProperty("/jusficationVisibleField5S", true);
							that._component.getModel("headerUserModel").setProperty("/selectedIndex5S", true);
							that._component.getModel("headerUserModel").setProperty("/USER_CHECK_S", "Y");
						}

						// Finance checklist

						if (oData[0].IS_UNSUAL_ACT_F === "Yes") {
							that._component.getModel("headerUserModel").setProperty("/jusficationVisibleField6F", true);
							that._component.getModel("headerUserModel").setProperty("/selectedIndex6F", 0);
							that._component.getModel("headerUserModel").setProperty("/IS_ANY_UNUSUAL_F", "Yes");
						} else if (oData[0].IS_UNSUAL_ACT_F === "No") {
							that._component.getModel("headerUserModel").setProperty("/jusficationVisibleField6F", false);
							that._component.getModel("headerUserModel").setProperty("/selectedIndex6F", 1);
							that._component.getModel("headerUserModel").setProperty("/IS_ANY_UNUSUAL_F", "Yes");
						} else {
							that._component.getModel("headerUserModel").setProperty("/selectedIndex6F", -1);
						}
						if (oData[0].USER_CHECK_F === "Y") {
							that._component.getModel("headerUserModel").setProperty("/jusficationVisibleField5F", true);
							that._component.getModel("headerUserModel").setProperty("/selectedIndex5F", true);
							that._component.getModel("headerUserModel").setProperty("/USER_CHECK_F", "Y");
						}
						if (oData[0].CARD_NUMBER === "00000") {
							oData[0].CARD_NUMBER = "";
						}
						if (oData[0].AMEX_STATEMENT === "00000000") {
							oData[0].AMEX_STATEMENT = "";
						}

						if (action !== "copy") {

							var headerData = {
								TITLE: oData[0].TITLE,
								Des: oData[0].DESCRIPTION,
								COMMENTS: "",
								FILE: "",
								PHONENUM: "",
								FILE_NAME: "myFileUpload",

								jusficationVisibleField6: that._component.getModel("headerUserModel").getProperty("/jusficationVisibleField6"),

								jusficationVisibleField6S: that._component.getModel("headerUserModel").getProperty("/jusficationVisibleField6S"),

								jusficationVisibleField6F: that._component.getModel("headerUserModel").getProperty("/jusficationVisibleField6F"),

								// REQ0481487:RMANDAL:GWDK901951:10/23/2019:Adding properties for User Id:START
								PREPARER_ID: oData[0].PREPARER_ID,
								CARD_HOLDER_NAME_ID: oData[0].CARD_HOLDER_NAME_ID,
								// REQ0481487:RMANDAL:GWDK901951:10/23/2019:Adding properties for User Id:END

								PREPARER: oData[0].PREPARER,
								REQUEST_DATE: oData[0].REQUEST_DATE,
								CARDHOLDERNAME: oData[0].CARD_HOLDER_NAME,
								LOB: oData[0].LOB,
								SLOB: oData[0].SLOB,
								PHONE_NUM: oData[0].CARD_HOLDER_PHONE,
								CARDNUMBER: oData[0].CARD_NUMBER,
								SUPERVISOR: oData[0].CARD_HOLDER_SUPERVISOR,
								DATE: oData[0].AMEX_STATEMENT,
								AMOUNT: oData[0].BILLED_AMOUNT,
								AMOUNT_USD: oData[0].BILLED_AMOUNT_USD + " USD",
								Doc_curr: oData[0].CURRENCY,
								IS_ANY_UNUSUAL: oData[0].IS_UNSUAL_ACT,
								USER_CHECK: oData[0].USER_CHECK,

								JUS_ANY_UNUSUAL: oData[0].JUS_ANY_UNUSUAL,

								IS_ANY_UNUSUAL_S: oData[0].IS_UNSUAL_ACT_S,
								USER_CHECK_S: oData[0].USER_CHECK_S,

								JUS_ANY_UNUSUAL_S: oData[0].JUS_ANY_UNUSUAL_S,

								IS_ANY_UNUSUAL_F: oData[0].IS_UNSUAL_ACT_F,
								USER_CHECK_F: oData[0].USER_CHECK_F,

								JUS_ANY_UNUSUAL_F: oData[0].JUS_ANY_UNUSUAL_F,
								isVisibleFinanceChecklist: false,
								isVisibleOperationChecklist: false,

								selectedIndex5: that._component.getModel("headerUserModel").getProperty("/selectedIndex5"),
								selectedIndex6: that._component.getModel("headerUserModel").getProperty("/selectedIndex6"),

								selectedIndex5S: that._component.getModel("headerUserModel").getProperty("/selectedIndex5S"),
								selectedIndex6S: that._component.getModel("headerUserModel").getProperty("/selectedIndex6S"),

								selectedIndex5F: that._component.getModel("headerUserModel").getProperty("/selectedIndex5F"),
								selectedIndex6F: that._component.getModel("headerUserModel").getProperty("/selectedIndex6F"),
								STATUS: oData[0].STATUS,
								isEnable: false,
								isEnable_C: false,
								Logged_In_User: that._component.getModel("headerUserModel").getProperty("/Logged_In_User")
							};
							that._component.getModel("headerUserModel").setData(headerData);

							that.getApprovers(that.title);
							that.Controller._getCurrencies();
							//that._component.getModel("oApproverModel").setData(oData[0].reconapproves);
							that.Controller.handleButtonEnable();
							//that.Controller.handleCheckBoxEnable(that._component.getModel("headerUserModel").getProperty("/Logged_In_User"),
							//that._component.getModel("headerUserModel").getProperty("/CARDHOLDERNAME"));
							that.getComments(that.title);
							that.getCollection(that.title);
						} else {

							var headerData = {

								TITLE: that._component.getModel("headerUserModel").getProperty("/TITLE"),
								Des: oData[0].DESCRIPTION,
								COMMENTS: "",
								FILE: "",
								PHONENUM: "",
								FILE_NAME: "myFileUpload",

								jusficationVisibleField5: that._component.getModel("headerUserModel").getProperty("/jusficationVisibleField5"),
								jusficationVisibleField6: that._component.getModel("headerUserModel").getProperty("/jusficationVisibleField6"),

								jusficationVisibleField5S: that._component.getModel("headerUserModel").getProperty("/jusficationVisibleField5S"),
								jusficationVisibleField6S: that._component.getModel("headerUserModel").getProperty("/jusficationVisibleField6S"),

								jusficationVisibleField5F: that._component.getModel("headerUserModel").getProperty("/jusficationVisibleField5F"),
								jusficationVisibleField6F: that._component.getModel("headerUserModel").getProperty("/jusficationVisibleField6F"),
								PREPARER: that._component.getModel("headerUserModel").getProperty("/Logged_In_User"),
								CARDHOLDERNAME: that._component.getModel("headerUserModel").getProperty("/Logged_In_User"),
								// REQ0481487:RMANDAL:GWDK901951:10/23/2019:Adding properties for User Id:START
								PREPARER_ID: that._component.getModel("headerUserModel").getProperty("/PREPARER_ID"),
								CARD_HOLDER_NAME_ID: that._component.getModel("headerUserModel").getProperty("/CARD_HOLDER_NAME_ID"),
								// REQ0481487:RMANDAL:GWDK901951:10/23/2019:Adding properties for User Id:END
								LOB: oData[0].LOB,
								SLOB: oData[0].SLOB,
								PHONE_NUM: that._component.getModel("headerUserModel").getProperty("/PHONE_NUM"),
								CARDNUMBER: oData[0].CARD_NUMBER,
								SUPERVISOR: that._component.getModel("headerUserModel").getProperty("/SUPERVISOR"),
								DATE: oData[0].AMEX_STATEMENT,
								AMOUNT: new Intl.NumberFormat('en-US').format(oData[0].BILLED_AMOUNT),
								AMOUNT_USD: new Intl.NumberFormat('en-US').format(oData[0].BILLED_AMOUNT_USD) + " USD",
								Doc_curr: oData[0].CURRENCY,

								IS_ANY_UNUSUAL: "",
								USER_CHECK: "",

								JUS_ANY_UNUSUAL: "",

								IS_ANY_UNUSUAL_S: "",
								USER_CHECK_S: "",

								JUS_ANY_UNUSUAL_S: "",

								IS_ANY_UNUSUAL_F: "",
								USER_CHECK_F: "",

								JUS_ANY_UNUSUAL_F: "",

								selectedIndex5: that._component.getModel("headerUserModel").getProperty("/selectedIndex5"),
								selectedIndex6: that._component.getModel("headerUserModel").getProperty("/selectedIndex6"),

								selectedIndex5S: that._component.getModel("headerUserModel").getProperty("/selectedIndex5S"),
								selectedIndex6S: that._component.getModel("headerUserModel").getProperty("/selectedIndex6S"),

								selectedIndex5F: that._component.getModel("headerUserModel").getProperty("/selectedIndex5F"),
								selectedIndex6F: that._component.getModel("headerUserModel").getProperty("/selectedIndex6F"),
								isVisibleFinanceChecklist: false,
								isVisibleOperationChecklist: false,
								isEnable: true,
								Logged_In_User: that._component.getModel("headerUserModel").getProperty("/Logged_In_User")
							};
							that._component.getModel("headerUserModel").setData(headerData);
							var sLoggedInUser = that._component.getModel("headerUserModel").getProperty("/Logged_In_User");
							var sCardHolder = that._component.getModel("headerUserModel").getProperty("/CARDHOLDERNAME");
							//that.Controller.handleCheckBoxEnable(sLoggedInUser,sCardHolder);
							//that.getDelegate();
							that.Controller._getCurrencies();
							that.Controller.handleButtonEnable();
							var date = that._component.getModel("headerUserModel").getProperty("/DATE");
							var d1;
							var d2;
							var d3;

							if (date) {

								var d1 = date.substr(0, 4);
								var d2 = date.substr(4, 2);
								var d3 = date.substr(6, 2);

								var date1 = d2 + "/" + d3 + "/" + d1;
								var title = that._component.getModel("headerUserModel").getProperty("/TITLE");

								that._component.getModel("headerUserModel").setProperty("/TITLE", "(" + date1 + ") " + title);
							}

							that._component.getModel("oApproverModel").setData([{}]);

						}
						that._View.setBusy(false);

					},
					error: function (error) {
						that._View.setBusy(false);

					}

				});

			},

			deleteAttachment: function (array2, array) {
				var filename = array2[0].FILE_NAME;
				if (filename !== "") {

					if (this._component.getModel("headerUserModel").getProperty("/PREPARER") === array2[0].CREATED_BY ||
						this._component.getModel("headerUserModel").getProperty("/CARDHOLDERNAME") === array2[0].CREATED_BY) {

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
					}
				}
			},

			getLobModelData: function (oData) {
				var data = {
					eLobUserSet: oData
				};
				this._component.getModel("LobUserSearchModel").setData(data);
				//console.log(this._component.getModel("LobUserSearchModel"));
			},
			getLobUniqueModelData: function (oData) {
				var uniqueSet = [];
				var arr2 = [];
				//REQ0730972:DPATEL11:FPDK900050:22/12/2021:Enhance Fiori Eforms to showLOB/SubLOB Name with Description:START
				oData.forEach(function (curr, index) {
					arr2.push({
						"LOB": curr.LOB,
						"SLOB_DESCRIPTION":curr.SLOB_DESCRIPTION
					});
				});
				//REQ0730972:DPATEL11:FPDK900050:22/12/2021:Enhance Fiori Eforms to showLOB/SubLOB Name with Description:STOP
				$.each(arr2, function (i, el) {
					if (jQuery.inArray(el, uniqueSet) === -1) uniqueSet.push(el);
				});
				var data = {
					uniqueLobSet: uniqueSet
				};
				// var oModel = new JSONModel();
				this._component.getModel("uniqueLobModel").setData(data);
			},
			getUserModelData: function (oData) {
				var data = {
					eUserSet: oData
				};
				this._component.getModel(this.USER_SEARCH_MODEL).setData(data);
				//console.log(this._component.getModel(this.USER_SEARCH_MODEL));
			},
			loadValuHelpConfig: function (sformNum, Action) {
				var sUserUrl = "/CardHolderNames";
				var sCurrentUserUrl = "/UserNameCollections";
				var sLobUrl = "/eFormLobs";
				var sLobUniqueUrl = "/eFormLobHeaders";
				var that = this;
				this._serverModel.read(sCurrentUserUrl, {
					success: function (data) {
						if (sformNum === "" || Action === "copy") {
							var oData = data.results;
							// REQ0481487:RMANDAL:GWDK901951:10/23/2019:Adding properties for User Id:START
							that._component.getModel("headerUserModel").setProperty("/PREPARER_ID", oData[0].UNAME);
							that._component.getModel("headerUserModel").setProperty("/CARD_HOLDER_NAME_ID", oData[0].UNAME);
							// REQ0481487:RMANDAL:GWDK901951:10/23/2019:Adding properties for User Id:END
							that._component.getModel("headerUserModel").setProperty("/PREPARER", oData[0].NAME_TEXT);
							that._component.getModel("headerUserModel").setProperty("/Logged_In_User", oData[0].NAME_TEXT);
							that._component.getModel("headerUserModel").setProperty("/PREPARER_KEY", oData[0].UNAME);
							that._component.getModel("headerUserModel").setProperty("/CARDHOLDERNAME", oData[0].NAME_TEXT);
							that._component.getModel("headerUserModel").setProperty("/CARDHOLDERNAME_KEY", oData[0].UNAME);
							that._component.getModel("headerUserModel").setProperty("/SUPERVISOR", oData[0].SUPERVISOR_NAME);
							that._component.getModel("headerUserModel").setProperty("/SUPERVISOR_KEY", oData[0].SUPERVISOR_ID);
							that._component.getModel("headerUserModel").setProperty("/PHONE_NUM", oData[0].USER_TEL);
							var oBundle = that._component.getModel("i18n").getResourceBundle();
							var sPreparer = that._component.getModel("headerUserModel").getProperty("/Logged_In_User");
							var sText = oBundle.getText("titleField", [sPreparer]);
							that._component.getModel("headerUserModel").setProperty("/TITLE", sText);
						} else {
							var oData = data.results;
							that._component.getModel("headerUserModel").setProperty("/Logged_In_User", oData[0].NAME_TEXT);
							// REQ0481487:RMANDAL:GWDK901951:10/23/2019:Adding properties for User Id:START
							that._component.getModel("headerUserModel").setProperty("/PREPARER_ID", oData[0].UNAME);
							that._component.getModel("headerUserModel").setProperty("/CARD_HOLDER_NAME_ID", oData[0].UNAME);
							// REQ0481487:RMANDAL:GWDK901951:10/23/2019:Adding properties for User Id:END

						}
					},
					error: function (error) {}
				});
				this._serverModel.read(sUserUrl, {
					success: function (data) {
						var data = {
							CARDHOLDERNAMES: data.results
						};
						var oCardHolderModel = new JSONModel();
						oCardHolderModel.setData(data);
						that._component.setModel(oCardHolderModel, "CardHolderModel");
						//var oData = data.results;
						//that._component.getModel("headerUserModel").setProperty("/CARDHOLDERNAMES",oData);
					},
					error: function (error) {}
				});
				this._serverModel.read(sLobUniqueUrl, {
					success: function (data) {
						var oData = data.results;
						that.getLobUniqueModelData(oData);
					},
					error: function (error) {
						var msg = JSON.parse(error.response.body).error.message.value;
						//MessageToast.show(msg);
						MessageBox.show(
							msg,
							MessageBox.Icon.ERROR,
							"Error"
						);
					}
				});
				this._serverModel.read(sLobUrl, {
					success: function (data) {
						var oData = data.results;
						that.getLobModelData(oData);
					},
					error: function (error) {
						var msg = JSON.parse(error.response.body).error.message.value;
						MessageBox.show(
							msg,
							MessageBox.Icon.ERROR,
							"Error"
						);
					}
				});
			},
			getDelegate: function (eFormNnum) {
				var sUrl = "/DelegateInfos";
				var that = this;
				var sFormNnum = eFormNnum;
				var aFilter = [];
				var oFilter = new Filter("EForm_Num", FilterOperator.EQ, sFormNnum);
				aFilter.push(oFilter);
				this._serverModel.read(sUrl, {
					filters: aFilter,
					success: function (data) {
						var oData = data.results;
						var delegateModel = new JSONModel();
						delegateModel.setData(oData);
						that._component.setModel(delegateModel, "delegateModel");

						var sLoggedInUser = that._component.getModel("headerUserModel").getProperty("/Logged_In_User");
						var approverData = that._component.getModel("oApproverModel").getData();
						var delegateData = that._component.getModel("delegateModel").getData();
						that.Controller.handleCheckBoxEnable(that._component.getModel("headerUserModel").getProperty("/Logged_In_User"),
							that._component.getModel("headerUserModel").getProperty("/CARDHOLDERNAME"));

						var arr = [];
						for (var i = 0; i < approverData.length; i++) {
							arr.push(approverData[i]);
						}
						for (var i = 0; i < delegateData.length; i++) {
							arr.push(delegateData[i]);
						}

						var approverData = arr;

						for (var i = 0; i < approverData.length; i++) {
							if (approverData[i].APPROVER_TYPE === "F" || approverData[i].User_Type === "F") {
								if (sLoggedInUser === approverData[i].APPR || sLoggedInUser === approverData[i].Delegate) {
									that._component.getModel("headerUserModel").setProperty("/isVisibleFinanceChecklist");

									that._component.getModel("headerUserModel").setProperty("/isFinanceAppr", true);
									that._component.getModel("headerUserModel").setProperty("/isEnable_F", true);
									that._component.getModel("headerUserModel").setProperty("/isEnable_S", false);
									//that._component.getModel("headerUserModel").setProperty("/isEnable",false);
									that._component.getModel("headerUserModel").setProperty("/isEnable_C", false);
									break;
								} else {
									if (that._component.getModel("headerUserModel").getProperty("/USER_CHECK_F") === "Y") {
										that._component.getModel("headerUserModel").setProperty("/isEnable_F", false);
										that._component.getModel("headerUserModel").setProperty("/isVisibleFinanceChecklist", true);
									} else {
										that._component.getModel("headerUserModel").setProperty("/isVisibleFinanceChecklist", false);
									}
								}

							}
							if (approverData[i].APPROVER_TYPE === "O" || approverData[i].User_Type === "O") {
								if (sLoggedInUser === approverData[i].APPR || sLoggedInUser === approverData[i].Delegate) {
									that._component.getModel("headerUserModel").setProperty("/isVisibleOperationChecklist", true);
									that._component.getModel("headerUserModel").setProperty("/isOperationAppr", true);
									that._component.getModel("headerUserModel").setProperty("/isEnable_S", true);
									that._component.getModel("headerUserModel").setProperty("/isEnable_F", false);
									//that._component.getModel("headerUserModel").setProperty("/isEnable",false);
									that._component.getModel("headerUserModel").setProperty("/isEnable_C", false);
									break;

								} else {
									if (that._component.getModel("headerUserModel").getProperty("/USER_CHECK_S") === "Y") {
										that._component.getModel("headerUserModel").setProperty("/isEnable_S", false);
										that._component.getModel("headerUserModel").setProperty("/isVisibleOperationChecklist", true);
									} else {
										that._component.getModel("headerUserModel").setProperty("/isVisibleOperationChecklist", false);
									}
								}

							}

						}
					},

					error: function (oError) {
						var msg = JSON.parse(oError.response.body).error.message.value;
						MessageBox.show(
							msg,
							MessageBox.Icon.ERROR,
							"Error"
						);
					}
				});
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
						// REQ0481487:RMANDAL:GWDK901951:11/20/2019:Group link for approval table:START
						/*var oData = data.results;
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

							if (oData[i].CREATION_DT === "") {
								oData[i].CREATION_DT = "";
							} else {
								var value = oData[i].CREATION_DT;
								var date = new Date(value);
								var month = date.getUTCMonth() + 1;
								var str = value.split("/");
								var str1 = str.splice(0, 1);
								var str2 = str.splice(0, 0, month);
								var str2 = str[0] + "/" + str[1] + "/" + str[2];
								oData[i].CREATION_DT = str2;

							}
						}
						that._component.getModel("oApproverModel").setData(oData);*/

						var aDataSet = [];
						data.results.forEach(function (item, index) {
							var sStatus, sDate;
							if (item.APPROVED === "X") {
								sStatus = "Approved";
							} else if (item.APPROVED === "R") {
								sStatus = "Rejected";
							} else {
								sStatus = "";
							}
							if (item.CREATION_DT === "") {
								sDate = "";
							} else {
								var value = item.CREATION_DT;
								var date = new Date(value);
								var month = date.getUTCMonth() + 1;
								var str = value.split("/");
								var str1 = str.splice(0, 1);
								var str2 = str.splice(0, 0, month);
								var str2 = str[0] + "/" + str[1] + "/" + str[2];
								sDate = str2;
							}
							aDataSet.push({
								ADDED_BY: item.ADDED_BY,
								// ADDED_BY_ID: item.ADDED_BY_ID,
								APPR: item.APPR,
								APPROVAL_DT: item.APPROVAL_DT,
								APPROVAL_TM: item.APPROVAL_TM,
								APPROVED: sStatus,
								APPROVED_BY: item.APPROVED_BY,
								APPROVED_BY_ID: item.APPROVED_BY_ID,
								APPROVER_TYPE: item.APPROVER_TYPE,
								APPR_ID: item.APPR_ID,
								CREATION_DT: sDate,
								GRP: (item.GRP === "X") ? true : false,
								MANUAL: (item.MANUAL === "X") ? true : false,
								REVIEWER_TYPE: item.REVIEWER_TYPE,
								isAppEnabled: false,
								isInput: false
							});
						});
						that._component.getModel("oApproverModel").setData(aDataSet);
						// REQ0481487:RMANDAL:GWDK901951:11/20/2019:Group link for approval table:END

						that.getDelegate(that.title);

					},
					error: function (oError) {
						var msg = JSON.parse(oError.response.body).error.message.value;
						MessageBox.show(
							msg,
							MessageBox.Icon.ERROR,
							"Error"
						);
					}
				});
			},
			saveEditedEntries: function (isSave, EmptyFlag, sForm_Id) {
				var oFormUpdateBatchDeferred = [],
					FormUpdateURL = "/ReconciliationHeaders";
				this._serverModel.setUseBatch(true); // set batch mode true to enable submitChanges callback to execute
				if (isSave === "") {
					sTittle = sForm_Id;
					var oFormItem = {};
					oFormItem.STATUS = "Withdrawn";
					oFormItem.EFORM_NUM = sForm_Id;
					oFormItem.reconapproves = [];
					oFormUpdateBatchDeferred.push(oFormItem);
					var tittle;
					oFormUpdateBatchDeferred.forEach(function (currentVal, index, array) {
						var oSaveFormDeferred = jQuery.Deferred();
						this._serverModel.create(FormUpdateURL,
							currentVal, {
								groupId: "updateSaveBatch",
								success: function (oResponse) {
									//MessageToast.show("Your Form is withdrawn successfully with Form id : " + oResponse.CHANGE_ID);
									MessageBox.show(
										"Your Form is withdrawn successfully with Form id : " + oResponse.EFORM_NUM,
										MessageBox.Icon.SUCCESS,
										"Success"
									);
									tittle = oResponse.EFORM_NUM;
									sTittle = tittle;
									this._component.getModel("headerUserModel").setProperty("/isEnableSave", true);
									this._component.getModel("headerUserModel").setProperty("/isEnableSubmit", true);
									this._component.getModel("headerUserModel").setProperty("/isEnableWithdraw", false);
									this._component.getModel("headerUserModel").setProperty("/STATUS", oResponse.STATUS);

									oSaveFormDeferred.resolve();
								}.bind(this),
								error: oSaveFormDeferred.reject
							});
						this.setTitle = tittle;
						//}
						//push individual deferred objects to batch deferred object
						oFormUpdateBatchDeferred.push(oSaveFormDeferred.promise());
					}.bind(this));
				}
				if (isSave === "Delete") {
					sTittle = sForm_Id;
					var oFormItem = {};
					oFormItem.STATUS = "Delete";
					oFormItem.EFORM_NUM = sForm_Id;
					oFormItem.reconapproves = [];
					oFormUpdateBatchDeferred.push(oFormItem);
					var tittle;
					var that = this;
					oFormUpdateBatchDeferred.forEach(function (currentVal, index, array) {
						var oSaveFormDeferred = jQuery.Deferred();
						this._serverModel.create(FormUpdateURL,
							currentVal, {
								groupId: "updateSaveBatch",
								success: function (oResponse) {

									MessageBox.show(
										"Your Form is Deleted successfully with Form id : " + oResponse.EFORM_NUM,
										MessageBox.Icon.SUCCESS,
										"Success"
									);
									that.Controller.onNavBackPostDelete();
									//   $.delay(3000,function(){that.Controller.onNavBack();
									//   });

									oSaveFormDeferred.resolve();
								}.bind(this),
								error: oSaveFormDeferred.reject
							});
						this.setTitle = tittle;
						//}
						//push individual deferred objects to batch deferred object
						oFormUpdateBatchDeferred.push(oSaveFormDeferred.promise());
					}.bind(this));
					//submit the request as batch
					this._serverModel.submitChanges({
						groupId: "updateSaveBatch"
					});
					return oFormUpdateBatchDeferred;
				}
				if ((isSave === "true") || (isSave === "false") || (isSave === "Withdraw")) {

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

					var aFormUpdatePayload = this._getFormEditPayload(isSave, sForm_Id);
					this._serverModel.setDeferredBatchGroups(["updateSaveBatch"]);
					var that = this;
					var tittle;
					if (aFormUpdatePayload) {
						var oSaveFormDeferred = jQuery.Deferred();
						//var pageTittle = this.getView().byId("pageId");
						var displayText = "";
						// if (currentVal.UpdateInd === this._getConfigurationValue("ENTITY_UPDATE_IND_CREATE_INSERT")) {
						FormUpdateURL = FormUpdateURL;
						this._serverModel.create(FormUpdateURL,
							aFormUpdatePayload, {
								groupId: "updateSaveBatch",
								success: function (oResponse) {
									if (isSave === "true") {
										//MessageToast.show("Your Form is saved successfully with Form id : " + oResponse.EFORM_NUM);
										MessageBox.show(
											"Your Form is saved successfully with Form id : " + oResponse.EFORM_NUM,
											MessageBox.Icon.SUCCESS,
											"Success"
										);
										var date = this._component.getModel("headerUserModel").getProperty("/DATE");
										var date1;

										if (date) {
											var aDate = date.split("/");
											var sDate = aDate[0] + aDate[1] + aDate[2];
											var date1 = aDate[1] + "/" + aDate[2] + "/" + aDate[0];
										}

										var title = this._component.getModel("headerUserModel").getProperty("/TITLE");
										this._component.getModel("headerUserModel").setProperty("/TITLE", title);
										this._component.getModel("headerUserModel").setProperty("/isEnableWithdraw", false);

										if (this._component.getModel("headerUserModel").getProperty("/STATUS") === "In Approval") {

											this._component.getModel("headerUserModel").setProperty("/isVisibleSubmit", false);
											//REQ0481487:NSONI3:GWDK901951:03/05/2020:Approve, Reject & Withdraw Button Visibility Change:START
											this._component.getModel("headerUserModel").setProperty("/isVisibleWithdraw", shouldDispWithdrw); 
											this._component.getModel("headerUserModel").setProperty("/isEnableWithdraw", shouldDispWithdrw); 
											// this._View.byId("b_approve").setVisible(true);
											// this._View.byId("b_reject").setVisible(true);
											//REQ0481487:NSONI3:GWDK901951:03/05/2020:Approve, Reject & Withdraw Button Visibility Change:END
											if (window.top.location.href.toLowerCase().indexOf("fiorilaunchpad") == -1) {
												this._View.byId("HOME").setVisible(true);
											}
										} else if (this._component.getModel("headerUserModel").getProperty("/STATUS") === "Rejected") {

											this._component.getModel("headerUserModel").setProperty("/isVisibleSubmit", false);
											//REQ0481487:NSONI3:GWDK901951:03/05/2020:Approve, Reject & Withdraw Button Visibility Change:START
											this._component.getModel("headerUserModel").setProperty("/isVisibleWithdraw", shouldDispWithdrw);
											this._component.getModel("headerUserModel").setProperty("/isEnableWithdraw", shouldDispWithdrw);
											// this._View.byId("b_approve").setVisible(true);
											// this._View.byId("b_reject").setVisible(false);
											//REQ0481487:NSONI3:GWDK901951:03/05/2020:Approve, Reject & Withdraw Button Visibility Change:END
											if (window.top.location.href.toLowerCase().indexOf("fiorilaunchpad") == -1) {
												this._View.byId("HOME").setVisible(true);
											}
										} else {
											//REQ0481487:NSONI3:GWDK901951:03/05/2020:Approve, Reject & Withdraw Button Visibility Change:START
											this._component.getModel("headerUserModel").setProperty("/isVisibleSubmit", true);
											this._component.getModel("headerUserModel").setProperty("/isVisibleWithdraw", false);
											// this._View.byId("b_approve").setVisible(false);
											// this._View.byId("b_reject").setVisible(false);
											//REQ0481487:NSONI3:GWDK901951:03/05/2020:Approve, Reject & Withdraw Button Visibility Change:END
											this._View.byId("HOME").setVisible(false);
										}
										this._component.getModel("headerUserModel").setProperty("/REQUEST_DATE", oResponse.REQUEST_DATE);
										this.title = oResponse.EFORM_NUM;
										this.getApprovers(oResponse.EFORM_NUM);
										this.REQUEST_DATE = oResponse.REQUEST_DATE;
									} else if (isSave === "false") {
										this._component.getModel("headerUserModel").setProperty("/isEnableSave", true);
										this._component.getModel("headerUserModel").setProperty("/isEnableSubmit", false);
										this._component.getModel("headerUserModel").setProperty("/isEnableWithdraw", shouldDispWithdrw);//REQ0481487:NSONI3:GWDK901951:03/05/2020:Approve, Reject & Withdraw Button Visibility Change
										this._component.getModel("headerUserModel").setProperty("/COMMENTS_ENABLED", false);

										this._component.getModel("headerUserModel").setProperty("/isVisibleSubmit", false);
										//REQ0481487:NSONI3:GWDK901951:03/05/2020:Approve, Reject & Withdraw Button Visibility Change:START
										this._component.getModel("headerUserModel").setProperty("/isVisibleWithdraw", shouldDispWithdrw);
										// this._View.byId("b_approve").setVisible(true);
										// this._View.byId("b_reject").setVisible(true);
										// this._View.byId("b_reject").setVisible(true);
										//REQ0481487:NSONI3:GWDK901951:03/05/2020:Approve, Reject & Withdraw Button Visibility Change:END
										if (window.top.location.href.toLowerCase().indexOf("fiorilaunchpad") == -1) {
											this._View.byId("HOME").setVisible(true);
										}
										// MessageToast.show("Your Form is submitted successfully with Form id : " + oResponse.EFORM_NUM);
										MessageBox.show(
											"Your Form is submitted successfully with Form id: " + oResponse.EFORM_NUM,
											MessageBox.Icon.SUCCESS,
											"Success"
										);

										this.title = oResponse.EFORM_NUM;

										this.getApprovers(oResponse.EFORM_NUM);
									} else {
										MessageBox.show(
											"Your Form is withdrawn successfully with Form id : " + oResponse.EFORM_NUM,
											MessageBox.Icon.SUCCESS,
											"Success"
										);

										tittle = oResponse.EFORM_NUM;
										sTittle = tittle;
										this._component.getModel("headerUserModel").setProperty("/isEnable", true);
										this._component.getModel("headerUserModel").setProperty("/isEnableSave", true);
										this._component.getModel("headerUserModel").setProperty("/isEnableSubmit", true);
										this._component.getModel("headerUserModel").setProperty("/isEnableWithdraw", false);
										this._component.getModel("headerUserModel").setProperty("/COMMENTS_ENABLED", true);
										this._component.getModel("headerUserModel").setProperty("/isVisibleSubmit", true);
										this._component.getModel("headerUserModel").setProperty("/isVisibleWithdraw", false);
										// this._View.byId("b_approve").setVisible(false);//REQ0481487:NSONI3:GWDK901951:03/05/2020:Approve, Reject & Withdraw Button Visibility Change	
										// this._View.byId("b_reject").setVisible(false);//REQ0481487:NSONI3:GWDK901951:03/05/2020:Approve, Reject & Withdraw Button Visibility Change
										this._View.byId("HOME").setVisible(false);
										this._component.getModel("headerUserModel").setProperty("/STATUS", oResponse.STATUS);
										this._component.getModel("headerUserModel").setProperty("/isEnable", true);
									}
									this._component.getModel("headerUserModel").setProperty("/STATUS", oResponse.STATUS);
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
									oSaveFormDeferred.reject();
								}
							}, this);
						this.setTitle = tittle;
						//}
						//push individual deferred objects to batch deferred object
						oFormUpdateBatchDeferred.push(oSaveFormDeferred.promise());
						//submit the request as batch
						this._serverModel.submitChanges({
							groupId: "updateSaveBatch"
						});
						return oFormUpdateBatchDeferred;
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
						oFormItem.ACTION = "save";
					} else if (this._component.getModel("headerUserModel").getProperty("/STATUS") === "Rejected") {
						oFormItem.STATUS = "Rejected";
						oFormItem.ACTION = "save";
					} else if (this._component.getModel("headerUserModel").getProperty("/STATUS") === "Data Saved") {
						oFormItem.STATUS = "Data Saved";
						oFormItem.ACTION = "save";
					} else {
						oFormItem.STATUS = "Data Saved";
					}

				} else if (isSave === "false") {
					oFormItem.STATUS = "In Approval";
				} else if (isSave === "Withdraw") {
					oFormItem.STATUS = "Withdrawn";
				}
				var date = this._component.getModel("headerUserModel").getProperty("/DATE");
				var date1;
				if (date) {
					var aDate = date.split("/");
					var sDate = aDate[0] + aDate[1] + aDate[2];
					date1 = aDate[1] + "/" + aDate[2] + "/" + aDate[0];
				}

				if (oLocalModel) {
					oFormItem.LOB = this._component.getModel("headerUserModel").getProperty("/LOB");
					oFormItem.EFORM_NUM = sForm_Id;
					oFormItem.DESCRIPTION = this._component.getModel("headerUserModel").getProperty("/Des");
					oFormItem.TITLE = this._component.getModel("headerUserModel").getProperty("/TITLE");
					oFormItem.TITLE2 = this._component.getModel("headerUserModel").getProperty("/TITLE").toUpperCase();
					oFormItem.SLOB = this._component.getModel("headerUserModel").getProperty("/SLOB");
					oFormItem.PREPARER = this._component.getModel("headerUserModel").getProperty("/PREPARER");
					oFormItem.CARD_HOLDER_NAME = this._component.getModel("headerUserModel").getProperty("/CARDHOLDERNAME");
					// REQ0481487:RMANDAL:GWDK901951:10/23/2019:Adding properties for User Id:START
					oFormItem.PREPARER_ID = this._component.getModel("headerUserModel").getProperty("/PREPARER_ID");
					oFormItem.CARD_HOLDER_NAME_ID = this._component.getModel("headerUserModel").getProperty("/CARD_HOLDER_NAME_ID");
					// REQ0481487:RMANDAL:GWDK901951:10/23/2019:Adding properties for User Id:END
					oFormItem.CARD_NUMBER = this._component.getModel("headerUserModel").getProperty("/CARDNUMBER");
					oFormItem.CARD_HOLDER_PHONE = this._component.getModel("headerUserModel").getProperty("/PHONE_NUM");
					oFormItem.CARD_HOLDER_SUPERVISOR = this._component.getModel("headerUserModel").getProperty("/SUPERVISOR");
					oFormItem.BILLED_AMOUNT = this._component.getModel("headerUserModel").getProperty("/AMOUNT").replace(/,/g, "");
					oFormItem.BILLED_AMOUNT_USD = this._component.getModel("headerUserModel").getProperty("/AMOUNT_USD").replace(/,/g, "");
					oFormItem.BILLED_AMOUNT_USD = oFormItem.BILLED_AMOUNT_USD.replace("USD", "").trim();
					oFormItem.CURRENCY = this._component.getModel("headerUserModel").getProperty("/Doc_curr");
					oFormItem.IS_UNSUAL_ACT = this._component.getModel("headerUserModel").getProperty("/IS_ANY_UNUSUAL");
					oFormItem.USER_CHECK = this._component.getModel("headerUserModel").getProperty("/USER_CHECK");

					// supervisor checklist

					oFormItem.IS_UNSUAL_ACT_S = this._component.getModel("headerUserModel").getProperty("/IS_ANY_UNUSUAL_S");
					oFormItem.USER_CHECK_S = this._component.getModel("headerUserModel").getProperty("/USER_CHECK_S");

					// Finance checklist

					oFormItem.IS_UNSUAL_ACT_F = this._component.getModel("headerUserModel").getProperty("/IS_ANY_UNUSUAL_F");
					oFormItem.USER_CHECK_F = this._component.getModel("headerUserModel").getProperty("/USER_CHECK_F");

					oFormItem.AMEX_STATEMENT = sDate;

					oFormItem.JUS_ANY_UNUSUAL = this._component.getModel("headerUserModel").getProperty("/JUS_ANY_UNUSUAL");

					//Supervisor checklist

					oFormItem.JUS_ANY_UNUSUAL_S = this._component.getModel("headerUserModel").getProperty("/JUS_ANY_UNUSUAL_S");

					//Finance Checklist

					oFormItem.JUS_ANY_UNUSUAL_F = this._component.getModel("headerUserModel").getProperty("/JUS_ANY_UNUSUAL_F");

					if ((this._component.getModel("headerUserModel").getProperty("/REQUEST_DATE") !== undefined) &&
						(this._component.getModel("headerUserModel").getProperty("/REQUEST_DATE") !== "")) {
						this.REQUEST_DATE = this._component.getModel("headerUserModel").getProperty("/REQUEST_DATE");
						oFormItem.REQUEST_DATE = this.REQUEST_DATE;
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
						oFormItem.REQUEST_DATE = this.REQUEST_DATE;

					}
					oFormItem.reconapproves = [];
					var oApprovers = this._component.getModel("oApproverModel").getData();
					for (var i = 0; i < oApprovers.length; i++) {
						var D = {};
						D.EFORM_NUM = this.title;
						D.ORGLEVEL = "";
						D.SEQUENCE = String(i + 1);
						// REQ0481487:RMANDAL:GWDK901951:10/24/2019:Adding properties for User Id:START
						if (oApprovers[i].APPROVED === "Approved") {
							D.APPROVED = "X";
						} else if (oApprovers[i].APPROVED === "Rejected") {
							D.APPROVED = "R";
						} else {
							D.APPROVED = "";
						}
						D.APPROVED_BY_ID = oApprovers[i].APPROVED_BY_ID;
						D.APPR_ID = oApprovers[i].APPR_ID;
						// D.ADDED_BY_ID = oApprovers[i].ADDED_BY_ID;
						// REQ0481487:RMANDAL:GWDK901951:10/24/2019:Adding properties for User Id:END
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
						if (D.APPR != "") {
							oFormItem.reconapproves[i] = D;
						}
						aUpdatedForms.push(oFormItem);
					}
				}
				var count = 0;
				return oFormItem;
			},
			setTittle: function () {
				sTittle = this.title;
				return sTittle;
			},
			getCollection: function () {
				var that = this;
				var model = this._component.getModel();
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
					count = 1;
				} else if (action === "Update") {

					oComments.FORM_NO = this.title;
					oComments.COMMENTS = array[0].COMMENTS;
					oComments.SEQUENCE = array[0].SEQUENCE;
					oComments.CREATOR = "";
					oComments.CR_DATE = "";
					oComments.TIME = "";
					count = 1;
				} else {
					if (this._component.getModel("headerUserModel").getProperty("/COMMENTS") !== "") {
						oComments.FORM_NO = this.title;
						oComments.COMMENTS = this._component.getModel("headerUserModel").getProperty("/COMMENTS");

						oComments.SEQUENCE = "";
						oComments.CREATOR = "";
						oComments.CR_DATE = "";
						oComments.TIME = "";
						count = 1;
					} else {
						MessageBox.show("No Comments to Save");
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
							var sText = oBundle.getText("title", [that.title]);
							that._View.byId("pageTitleId").setTitle(sText);
							if (sAction === "Deleted") {
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
							that._component.getModel("headerUserModel").setProperty("/COMMENTS", "");
							var sText = oBundle.getText("title", [that.title]);
							that._View.byId("pageTitleId").setText(sText);

							sap.ui.core.BusyIndicator.hide();

							//var model = that._component.getModel();
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
			}
		};
	},
	true);