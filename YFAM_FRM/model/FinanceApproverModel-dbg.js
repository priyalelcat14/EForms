sap.ui.define(
	["sap/ui/model/json/JSONModel",
		"sap/ui/core/ValueState",
		"sap/m/MessageBox",
		"sap/m/MessageToast",
		"sony/finance/maintaince/app/controller/FinanceMaintagePage.controller",
		"sap/ui/core/format/DateFormat"
	],
	function (JSONModel, ValueState, MessageBox, MessageToast, view, DateFormat) {
		"use strict";
		var sTittle;
		return {

			APPROVER_CLIENT_MODEL: "approverEditClientModel",
			APPROVER_MODEL: "approverModel",

			OLD_APPROVER_MODEL: "oldapproverModel",
			USER_SEARCH_MODEL: "userSearchModel",

			/**
			 * Initializes the models required by FinanceMaintainPage view  ( Form_EDIT_MODEL & PERSON_SEARCH_MODEL)
			 * @param  {model} oDataModel     Server side odata model

			 * @param  {component} component      Component for the application
			 */
			initialize: function (oDataModel, component, oView) {
				sTittle = "";
				this._serverModel = oDataModel;
				//this._resourceBundle = resourceBundle;
				this._component = component;
				this._View = oView;
				this._busyIndicator = this._View.byId("busyDialog");

				//this.INITIAL_PERSON_SEARCH_MODEL_DATA = this._getNewPersonSearchModel();

				// set the limit size
				var userSearchModel = new JSONModel(this.INITIAL_PERSON_SEARCH_MODEL_DATA);
				var LobSearchModel = new JSONModel();
				var oData_Old_Approver_model = new JSONModel(this.INITIAL_OLD_APPROVER_MODEL_DATA);
				var before_Old_Approver_model = new JSONModel();
				//var docTypeModel = new JSONModel();
				var uniqueLOBModel = new JSONModel();
				var displayModel = new JSONModel();
				userSearchModel.setSizeLimit(1000);
				this._component.setModel(before_Old_Approver_model, "approverEditClientModel");
				this._component.setModel(oData_Old_Approver_model, this.OLD_APPROVER_MODEL);
				this._component.setModel(new JSONModel(this.INITIAL_APPROVER_MODEL_DATA), this.APPROVER_MODEL);
				this._component.setModel(userSearchModel, this.USER_SEARCH_MODEL);
				this._component.setModel(LobSearchModel, "LobUserSearchModel");
				//this._component.setModel(LobSearchModel, "LobUserSearchModel");
				this._component.setModel(uniqueLOBModel, "uniqueLobModel");
				//this._component.setModel(docTypeModel, "headerUserModel");
				this._component.setModel(displayModel, "DisplayModel");
				var selFormModel = this._component.getModel("selFormDataSet"),
					headerData;
				if (selFormModel !== undefined) {
					var oFormHeaderInfo = this._component.getModel("selFormDataSet").getData();
					headerData = {
						user: "",
						lob: "",
						sublob: "",
						title: oFormHeaderInfo.TITLE,
						Description: oFormHeaderInfo.DESCRIPTION,
						userReplace: "",
						replaceWithUser: "",
						Status: oFormHeaderInfo.STATUS
					};
				} else {
					headerData = {
						user: "",
						lob: "",
						sublob: "",
						title: "",
						Description: "",
						userReplace: "",
						replaceWithUser: "",
						Status: ""
					};
				}
				this._component.getModel("headerUserModel").setData(headerData);
			},

			getApproverModelData: function (oData, REC_TYPE, oInstance) {
				this._busyIndicator.open();
				var userModelArray = this._component.getModel("userSearchModel").getProperty("/eUserSet");
				if (!userModelArray) {
					var sUserUrl = "/eFormUsers";
					var that = this;
					this._serverModel.read(sUserUrl, {
						success: function (data) {
							var oData1 = data.results;
							that.getUserModelData(oData1);
							that.getApproverModelAfterUserLoad(oData, REC_TYPE, oInstance);
							that._busyIndicator.close();
						},
						error: function (error) {
							that._busyIndicator.close();
							var msg = JSON.parse(error.response.body).error.message.value;
							MessageToast.show(msg);

						}
					}, this);
					userModelArray = this._component.getModel("userSearchModel").getProperty("/eUserSet");
				} else {
					this.getApproverModelAfterUserLoad(oData, REC_TYPE, oInstance);
					this._busyIndicator.close();
				}

				//console.log(this._component.getModel(this.OLD_APPROVER_MODEL));
			},

			getApproverModelAfterUserLoad: function (oData, REC_TYPE, oInstance) {
				var aData = [];
				var userModelArray = this._component.getModel("userSearchModel").getProperty("/eUserSet");
				if (!REC_TYPE) {
					// oData.forEach(function (curr, index) {
					// 	var userId = curr.UNAME;
					// 	userModelArray.forEach(function (curr1, index1) {
					// 		if (userId === curr1.USERID) {
					// 			curr.uname = curr1.NAME;
					// 		}
					// 	});

					// });

					for (var i = 0; i < oData.length; i++) {
						if (oData[i].LOC_OBJ_ITEM === "X") {
							var locked = false;
						} else if (oData[i].LOC_OBJ === "X") {
							var locked = true;
						} else {
							var locked = false;
						}

						var oDataLocal = {

							"LOB": oData[i].LOB,
							"UNAME1": oData[i].NAME_TEXT,
							// "UNAME1": oData[i].uname,
							"SLOB_DESCRIPTION": oData[i].SLOB_DESCRIPTION,
							"SUBLOB": oData[i].SUBLOB,
							"FA": oData[i].FA,
							"UNAME": oData[i].UNAME,
							"isEnable": false,
							"STATUS": "",
							"REC_TYPE": "B",
							"OP_INDICATOR": "",
							"CHANGE_ID": "",
							"LOC_OBJ": oData[i].LOC_OBJ,
							"isChanged": false,
							"isVisibleLocked": locked,
							"isDefaultEnable": false,
							"ChangedRowFlag": false,
							"OLD_UNAME": oData[i].OLD_UNAME,
							"OLD_NAME_TEXT": oData[i].OLD_NAME_TEXT,
							"OLD_USER_VISIBLE": false,
							"REQUESTED_BY": oData[i].REQUESTED_BY,
							"CREATION_DAT": oData[i].CREATION_DAT
						};
						aData.push(oDataLocal);

					}
					if (aData.length > 0) {
						oInstance.byId("btnAddRow").setEnabled(false);
						oInstance.byId("btnDeleteRow").setEnabled(false);
						oInstance.byId("btnCopyRow").setEnabled(false);
					} else {
						oInstance.byId("btnAddRow").setEnabled(true);
						oInstance.byId("btnDeleteRow").setEnabled(true);
						oInstance.byId("btnCopyRow").setEnabled(true);
					}
					var data = {
						eFormFiMaintSet: aData
					};
					this._component.getModel(this.OLD_APPROVER_MODEL).setData(data);
					this._component.getModel(this.APPROVER_MODEL).setData(data);
					this._component.getModel("approverEditClientModel").setData(data);

				} else if (REC_TYPE === 'A') {
					oData.forEach(function (curr, index) {
						var userId = curr.UNAME;
						userModelArray.forEach(function (curr1, index1) {
							if (userId === curr1.USERID) {
								curr.uname = curr1.NAME;
							}
						});

					});

					for (var i = 0; i < oData.length; i++) {
						if (oData[i].LOC_OBJ_ITEM === "X") {
							var locked = false;
						} else if (oData[i].LOC_OBJ === "X") {
							var locked = true;
						} else {
							var locked = false;
						}

						var changeFlag;
						if (oData[i].OP_INDICATOR === "U" || oData[i].OP_INDICATOR === "I") {
							changeFlag = true;
						} else {
							changeFlag = false;
						}

						var oDataLocal = {

							"LOB": oData[i].LOB,
							// "UNAME1": oData[i].uname,
							"UNAME1": oData[i].NAME_TEXT,
							"SLOB_DESCRIPTION": oData[i].SLOB_DESCRIPTION,
							"SUBLOB": oData[i].SUBLOB,
							"FA": oData[i].FA,
							"UNAME": oData[i].UNAME,
							"LOC_OBJ": oData[i].LOC_OBJ,
							"isEnable": false,
							"STATUS": "",
							"isSaved": oData[i].STATUS,
							"REC_TYPE": "A",
							"OP_INDICATOR": oData[i].OP_INDICATOR,
							"CHANGE_ID": "",
							"isVisibleLocked": locked,
							"isChanged": false,
							"isDefaultEnable": false,
							"ChangedRowFlag": changeFlag,
							"OLD_UNAME": oData[i].OLD_UNAME,
							"OLD_NAME_TEXT": oData[i].OLD_NAME_TEXT,
							"OLD_USER_VISIBLE": true,
							"REQUESTED_BY": oData[i].REQUESTED_BY,
							"CREATION_DAT": oData[i].CREATION_DAT
						};
						aData.push(oDataLocal);
					}
					var data = {
						eFormFiMaintSet: aData
					};
					this._component.getModel(this.OLD_APPROVER_MODEL).setData(data);
					var sSource = jQuery.sap.getUriParameters().get("SOURCE");
					if (oData.length > 0 && sSource !== null) {
						this._component.getModel("selFormDataSet").setProperty("/REQUESTED_BY_ID", oData[0].REQUESTED_BY);
						this._component.getModel("headerUserModel").setProperty("/title", oData[0].TITLE);
						this._component.getModel("headerUserModel").setProperty("/Description", oData[0].DESCRIPTION);
						this._component.getModel("headerUserModel").setProperty("/Status", oData[0].STATUS);
					}

				}
				if (REC_TYPE === 'B') {
					oData.forEach(function (curr, index) {
						var userId = curr.UNAME;
						userModelArray.forEach(function (curr1, index1) {
							if (userId === curr1.USERID) {
								curr.uname = curr1.NAME;
							}
						});

					});

					for (var i = 0; i < oData.length; i++) {

						var oDataLocal = {

							"LOB": oData[i].LOB,
							// "UNAME1": oData[i].uname,
							"UNAME1": oData[i].NAME_TEXT,
							"SLOB_DESCRIPTION": oData[i].SLOB_DESCRIPTION,
							"SUBLOB": oData[i].SUBLOB,
							"FA": oData[i].FA,
							"UNAME": oData[i].UNAME,
							"LOC_OBJ": oData[i].LOC_OBJ,
							"isEnable": false,
							"STATUS": "",
							"REC_TYPE": "B",
							"OP_INDICATOR": "",
							"CHANGE_ID": "",
							"isChanged": false,
							"isDefaultEnable": false,
							"ChangedRowFlag": "",
							"OLD_UNAME": oData[i].OLD_UNAME,
							"OLD_NAME_TEXT": oData[i].OLD_NAME_TEXT,
							"OLD_USER_VISIBLE": false,
							"REQUESTED_BY": oData[i].REQUESTED_BY,
							"CREATION_DAT": oData[i].CREATION_DAT
						};
						aData.push(oDataLocal);
					}
					if (aData.length > 0) {
						oInstance.byId("btnAddRow").setEnabled(false);
						oInstance.byId("btnDeleteRow").setEnabled(false);
						oInstance.byId("btnCopyRow").setEnabled(false);
					} else {
						oInstance.byId("btnAddRow").setEnabled(true);
						oInstance.byId("btnDeleteRow").setEnabled(true);
						oInstance.byId("btnCopyRow").setEnabled(true);
					}
					var data = {
						eFormFiMaintSet: aData
					};
					//this._component.getModel(this.OLD_APPROVER_MODEL).setData(data);
					this._component.getModel(this.APPROVER_MODEL).setData(data);
					this._component.getModel("approverEditClientModel").setData(data);
				}
			},
			getLobUniqueModelData: function (oData) {
				var uniqueSet = [];
				var arr2 = [];
				oData.forEach(function (curr, index) {
					arr2.push({
						"LOB": curr.LOB
					});
				});
				jQuery.each(arr2, function (i, el) {
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

			getLobModelData: function (oData) {

				var data = {

					eLobUserSet: oData
				};
				this._component.getModel("LobUserSearchModel").setData(data);
				//console.log(this._component.getModel("LobUserSearchModel"));
			},

			loadValuHelpConfig: function () {
				var sUserUrl = "/eFormUsers";
				var sLobUrl = "/eFormLobSet";
				var sLobUniqueUrl = "/eFormLobHeaders";
				var sDocTyp = "/eFormDocTypeHeaders";
				var that = this;
				this._serverModel.read(sUserUrl, {
					success: function (data) {
						var oData = data.results;
						that.getUserModelData(oData);

					},
					error: function (error) {
						var msg = JSON.parse(error.response.body).error.message.value;

						MessageToast.show(msg);
					}
				});
				this._serverModel.read(sDocTyp, {
					success: function (data) {
						var oData = data.results;
						//that.getDocTypModelData(oData);

					},
					error: function (error) {
						var msg = JSON.parse(error.response.body).error.message.value;

						MessageToast.show(msg);
					}
				});
				this._serverModel.read(sLobUniqueUrl, {
					success: function (data) {
						var oData = data.results;
						that.getLobUniqueModelData(oData);

					},
					error: function (error) {
						var msg = JSON.parse(error.response.body).error.message.value;

						MessageToast.show(msg);
					}
				});
				this._serverModel.read(sLobUrl, {
					success: function (data) {
						var oData = data.results;
						that.getLobModelData(oData);

					},
					error: function (error) {
						var msg = JSON.parse(error.response.body).error.message.value;

						MessageToast.show(msg);
					}
				});
				this._serverModel.read(sLobUrl, {
					success: function (data) {
						var oData = data.results;
						that.getLobModelData(oData);

					},
					error: function (error) {
						var msg = JSON.parse(error.response.body).error.message.value;

						MessageToast.show(msg);
					}
				});
			},

			saveEditedEntries: function (isSave, EmptyFlag, sFormTitle, sFormDes, sForm_Id, oView, sStatus) {
				var oFormUpdateBatchDeferred = [],
					FormUpdateURL = "/eFormAfterMaintananceSet";
				this._serverModel.setUseBatch(true); // set batch mode true to enable submitChanges callback to execute
				if (isSave === "withdraw") {
					sTittle = sFormTitle;

					var oFormItem = {};

					oFormItem.STATUS = "withdraw";

					oFormItem.CHANGE_ID = sForm_Id;
					oFormUpdateBatchDeferred.push(oFormItem);

					var tittle;
					oFormUpdateBatchDeferred.forEach(function (currentVal, index, array) {
						var oSaveFormDeferred = jQuery.Deferred();
						this._serverModel.create(FormUpdateURL,
							currentVal, {
								groupId: "updateSaveBatch",
								success: function (oResponse) {
									oView.byId("idIconTabFilter3").setVisible(true);
									oView.byId("idIconTabFilter4").setVisible(true);
									MessageToast.show("Your Form is withdrawn successfully with Form id : " + oResponse.CHANGE_ID);

									tittle = oResponse.CHANGE_ID;
									sTittle = tittle;
									this._component.getModel("DisplayModel").setProperty("/Readonly", true);
									this._component.getModel("DisplayModel").setProperty("/Readonly1", true);

									this._component.getModel("headerUserModel").setProperty("/Status", oResponse.STATUS);
									oView.getController().getApproverData([new sap.ui.model.Filter("EformNum", sap.ui.model.FilterOperator.EQ, tittle)]);
									oView.getController().buttonVisibility();
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
				if (EmptyFlag === false) {
					var aFormUpdatePayload = this._getFormEditPayload(isSave, sFormTitle, sFormDes, sForm_Id, sStatus);

					this._serverModel.setDeferredBatchGroups(["updateSaveBatch"]);
					var that = this;
					var tittle;
					if (aFormUpdatePayload) {
						var sPreparer = this._component.getModel("selFormDataSet").getProperty("/REQUESTED_BY_ID");
						aFormUpdatePayload.forEach(function (currentVal, index, array) {
							var oSaveFormDeferred = jQuery.Deferred();

							//var pageTittle = this.getView().byId("pageId");
							var displayText = "";
							// if (currentVal.UpdateInd === this._getConfigurationValue("ENTITY_UPDATE_IND_CREATE_INSERT")) {
							FormUpdateURL = FormUpdateURL;
							this._serverModel.create(FormUpdateURL,
								currentVal, {
									groupId: "updateSaveBatch",
									success: function (oResponse) {
										oView.byId("idIconTabFilter3").setVisible(true);
										oView.byId("idIconTabFilter4").setVisible(true);
										if (isSave === "true" && oResponse.CHANGE_FLAG !== "1") {
											MessageToast.show("Your Form is saved successfully with Form id : " + oResponse.CHANGE_ID);
										}
										if (isSave === "true" && oResponse.CHANGE_FLAG === "1") {
											displayText = "Your Form is saved successfully with Form id : " + oResponse.CHANGE_ID +
												" but the new entries are already locked in a different Request.";
											// MessageToast.show();
										}
										if (isSave !== "true" && oResponse.CHANGE_FLAG !== "1") {
											MessageToast.show("Your Form is submitted successfully with Form id : " + oResponse.CHANGE_ID);
										}
										if (isSave !== "true" && oResponse.CHANGE_ID === "") {
											oResponse.STATUS = "Save";
											displayText = "Your Form submission is failed as some of the entries are already locked by another request.";
											// MessageToast.show("Your Form is submitted successfully with Form id : " + oResponse.CHANGE_ID + "but the entry is alraedy locked.");
										}
										if (displayText !== "") {
											MessageToast.show(displayText);
										}
										this._component.getModel("headerUserModel").setProperty("/Status", oResponse.STATUS);
										tittle = oResponse.CHANGE_ID;
										sTittle = tittle;

										oSaveFormDeferred.resolve();
									}.bind(this),
									error: function (oError) {
										var msg = JSON.parse(oError.response.body).error.message.value;

										MessageToast.show(msg);
										oSaveFormDeferred.reject();
									}
								}, this);
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
				}
			},

			/**
			 * Calculates and returns the payload for the save service request
			 * @return {array} array of Form objects as payload
			 */
			_getFormEditPayload: function (isSave, sTitle, sDesc, sForm_Id, sStatus) {

				var aUpdatedForms = [];
				if (sForm_Id === "") {
					sTittle = sTittle;
				} else {
					sTittle = sForm_Id;
				}
				var Array1 = this.arr1;
				var Array2 = this._component.getModel("oldapproverModel").getData();
				//var Array3 =  this._component.getModel("oDeletedModel").getData();
				var oLocalModel = [];
				var oLocalModelOld = [];
				var TITLE = sTitle;
				var TITLE_2 = (sTitle.length > 15) ? sTitle.substring(0, 15) : sTitle;
				TITLE_2 = TITLE_2.toUpperCase();
				var DESCRIPTION = sDesc;

				jQuery.each(Array1, function (index, value) {
					oLocalModelOld.push(value);
				});

				jQuery.each(Array2, function (index, value) {
					oLocalModel.push(value);
				});

				var NewForms = oLocalModel;
				var oldForms = oLocalModelOld;
				var newUpdatedEntries = [];

				var oFormItem = {};

				if (NewForms && isSave != "true") {

					NewForms[0].forEach(function (currentVal, index, array) {

						oFormItem = {};

						oFormItem.LOB = currentVal.LOB;
						oFormItem.ACTION = "SUBMIT";
						oFormItem.FA = currentVal.FA;
						oFormItem.REQUESTED_BY = currentVal.REQUESTED_BY;
						oFormItem.CREATION_DAT = currentVal.CREATION_DAT;
						oFormItem.SLOB_DESCRIPTION = currentVal.SLOB_DESCRIPTION;
						oFormItem.SUBLOB = currentVal.SUBLOB;

						oFormItem.UNAME = currentVal.UNAME;
						oFormItem.STATUS = "In process";
						oFormItem.REC_TYPE = "A";
						oFormItem.OP_INDICATOR = currentVal.OP_INDICATOR;
						oFormItem.CHANGE_ID = sTittle;
						oFormItem.TITLE = TITLE;
						oFormItem.TITLE_2 = TITLE_2;
						//oFormItem.CHANGE_FLAG = CHANGE_FLAG,
						oFormItem.DESCRIPTION = DESCRIPTION;
						aUpdatedForms.push(oFormItem);
					}.bind(this));
				}
				if (oldForms && isSave != "true") {
					// CASE 1
					// If there has been modifications like SPLIT of any of the Forms , then OLD_Form_MODEL data needs to be sent with Delete
					// And EDIT_Form_MODEL Data satisfying the conditions need to be sent as Insert

					oldForms.forEach(function (currentVal, index, array) {
						oFormItem = {};

						oFormItem.LOB = currentVal.LOB;
						oFormItem.FA = currentVal.FA;
						oFormItem.TITLE_2 = TITLE_2;
						oFormItem.REQUESTED_BY = currentVal.REQUESTED_BY;
						//oFormItem.CHANGE_FLAG = CHANGE_FLAG,
						oFormItem.SLOB_DESCRIPTION = currentVal.SLOB_DESCRIPTION;
						oFormItem.SUBLOB = currentVal.SUBLOB;
						oFormItem.CREATION_DAT = currentVal.CREATION_DAT;
						// oFormItem.TO_AMT = currentVal.TO_AMT,
						oFormItem.UNAME = currentVal.UNAME;
						oFormItem.STATUS = "In process";
						oFormItem.ACTION = "SUBMIT";
						oFormItem.REC_TYPE = "B";
						oFormItem.OP_INDICATOR = "";
						oFormItem.CHANGE_ID = sTittle;
						oFormItem.TITLE = TITLE;
						oFormItem.DESCRIPTION = DESCRIPTION;
						aUpdatedForms.push(oFormItem);
					}.bind(this));
				}

				if (this.finalDeletedArray && isSave != "true") {
					// CASE 1
					// If there has been modifications like SPLIT of any of the Forms , then OLD_Form_MODEL data needs to be sent with Delete
					// And EDIT_Form_MODEL Data satisfying the conditions need to be sent as Insert

					this.finalDeletedArray.forEach(function (currentVal, index) {

						oFormItem = {};

						oFormItem.LOB = currentVal.LOB;
						oFormItem.FA = currentVal.FA;
						oFormItem.TITLE_2 = TITLE_2;
						// oFormItem.CHANGE_FLAG = CHANGE_FLAG,
						// oFormItem.SEQUENCE = currentVal.SEQUENCE,
						oFormItem.SLOB_DESCRIPTION = currentVal.SLOB_DESCRIPTION;
						oFormItem.SUBLOB = currentVal.SUBLOB;
						oFormItem.REQUESTED_BY = currentVal.REQUESTED_BY;
						oFormItem.CREATION_DAT = currentVal.CREATION_DAT;
						//oFormItem.TO_AMT = currentVal.TO_AMT,
						oFormItem.UNAME = currentVal.UNAME;
						oFormItem.STATUS = "In process";
						oFormItem.ACTION = "SUBMIT";
						oFormItem.REC_TYPE = "B";
						oFormItem.OP_INDICATOR = "D";
						oFormItem.CHANGE_ID = sTittle;
						oFormItem.TITLE = TITLE;
						oFormItem.DESCRIPTION = DESCRIPTION;
						aUpdatedForms.push(oFormItem);
					}.bind(this));
				}

				if (NewForms && isSave === "true") {
					// CASE 1
					// If there has been modifications like SPLIT of any of the Forms , then OLD_Form_MODEL data needs to be sent with Delete
					// And EDIT_Form_MODEL Data satisfying the conditions need to be sent as Insert

					NewForms[0].forEach(function (currentVal, index, array) {
						oFormItem = {};

						oFormItem.LOB = currentVal.LOB;
						oFormItem.FA = currentVal.FA;
						oFormItem.TITLE_2 = TITLE_2;
						// oFormItem.CHANGE_FLAG = CHANGE_FLAG,
						//oFormItem.SEQUENCE = currentVal.SEQUENCE,
						oFormItem.SLOB_DESCRIPTION = currentVal.SLOB_DESCRIPTION;
						oFormItem.CREATION_DAT = currentVal.CREATION_DAT;
						oFormItem.SUBLOB = currentVal.SUBLOB;
						// oFormItem.TO_AMT = currentVal.TO_AMT,
						oFormItem.UNAME = currentVal.UNAME;
						if (sStatus !== "" && sStatus !== "withdraw") {
							oFormItem.STATUS = sStatus;
						} else {
							oFormItem.STATUS = "Save";
						}
						oFormItem.REQUESTED_BY = currentVal.REQUESTED_BY;
						oFormItem.ACTION = "SAVE";
						oFormItem.REC_TYPE = "A";
						oFormItem.OP_INDICATOR = currentVal.OP_INDICATOR;
						oFormItem.CHANGE_ID = sTittle;
						oFormItem.TITLE = TITLE;
						oFormItem.DESCRIPTION = DESCRIPTION;
						aUpdatedForms.push(oFormItem);
					}.bind(this));
				}

				if (this.finalDeletedArray && isSave === "true") {
					// CASE 1
					// If there has been modifications like SPLIT of any of the Forms , then OLD_Form_MODEL data needs to be sent with Delete
					// And EDIT_Form_MODEL Data satisfying the conditions need to be sent as Insert

					this.finalDeletedArray.forEach(function (currentVal, index) {
						oFormItem = {};

						oFormItem.LOB = currentVal.LOB;
						oFormItem.FA = currentVal.FA;
						oFormItem.TITLE_2 = TITLE_2;
						oFormItem.REQUESTED_BY = currentVal.REQUESTED_BY;
						// oFormItem.CHANGE_FLAG = CHANGE_FLAG,
						// oFormItem.SEQUENCE = currentVal.SEQUENCE,
						oFormItem.SLOB_DESCRIPTION = currentVal.SLOB_DESCRIPTION;
						oFormItem.CREATION_DAT = currentVal.CREATION_DAT;
						oFormItem.SUBLOB = currentVal.SUBLOB;
						// oFormItem.TO_AMT = currentVal.TO_AMT,
						oFormItem.UNAME = currentVal.UNAME;
						if (sStatus !== "" && sStatus !== "withdraw") {
							oFormItem.STATUS = sStatus;
						} else {
							oFormItem.STATUS = "Save";
						}
						oFormItem.ACTION = "SAVE";
						oFormItem.REC_TYPE = "A";
						oFormItem.OP_INDICATOR = "D";
						oFormItem.CHANGE_ID = sTittle;
						oFormItem.TITLE = TITLE;
						oFormItem.DESCRIPTION = DESCRIPTION;
						aUpdatedForms.push(oFormItem);
					}.bind(this));
				}
				if (oldForms && isSave === "true") {
					// CASE 1
					// If there has been modifications like SPLIT of any of the Forms , then OLD_Form_MODEL data needs to be sent with Delete
					// And EDIT_Form_MODEL Data satisfying the conditions need to be sent as Insert

					oldForms.forEach(function (currentVal, index, array) {
						oFormItem = {};

						oFormItem.LOB = currentVal.LOB;
						oFormItem.FA = currentVal.FA;
						oFormItem.TITLE_2 = TITLE_2;
						oFormItem.REQUESTED_BY = currentVal.REQUESTED_BY;
						//oFormItem.CHANGE_FLAG = CHANGE_FLAG,
						//oFormItem.SEQUENCE = currentVal.SEQUENCE,
						oFormItem.SLOB_DESCRIPTION = currentVal.SLOB_DESCRIPTION;
						oFormItem.CREATION_DAT = currentVal.CREATION_DAT;
						oFormItem.SUBLOB = currentVal.SUBLOB;
						// oFormItem.TO_AMT = currentVal.TO_AMT,
						oFormItem.UNAME = currentVal.UNAME;
						if (sStatus !== "" && sStatus !== "withdrawn") {
							oFormItem.STATUS = sStatus;
						} else {
							oFormItem.STATUS = "Save";
						}
						oFormItem.ACTION = "SAVE";
						oFormItem.REC_TYPE = "B";
						oFormItem.OP_INDICATOR = "";
						oFormItem.CHANGE_ID = sTittle;
						oFormItem.TITLE = TITLE;
						oFormItem.DESCRIPTION = DESCRIPTION;
						aUpdatedForms.push(oFormItem);
					}.bind(this));

				}

				/* aUpdatedForms.forEach(function(currentVal, index) {

				   if ((currentVal.OP_INDICATOR !== "" && currentVal.REC_TYPE === "A") || (currentVal.OP_INDICATOR === "" && currentVal.REC_TYPE ===
				       "B")) {
				     if (sTittle && currentVal.STATUS === "In process") {
				       currentVal.CHANGE_ID = sTittle;
				     }
				     newUpdatedEntries.push(currentVal);

				   }
				 });*/

				var count = 0;
				aUpdatedForms.forEach(function (currentVal, index, array) {
					if (currentVal.OP_INDICATOR !== "") {
						count = count + 1;

					}
				});

				if (count > 0 || (this._component.getModel("headerUserModel").getProperty("/Status") === "Save" && isSave != "true")) {
					return aUpdatedForms;
				} else {
					MessageToast.show("No changes made.");
				}

			},

			setTittle: function () {

				return sTittle;
			},

			//Save the deleted entries for later execution.
			isDeletedArray: function (oDeletedOld) {
				if (oDeletedOld.length === 0) {
					return;
				} else {
					this.finalDeletedArray = [];
					var that = this;
					this.arr1.forEach(function (curr, index) {
						oDeletedOld[0].forEach(function (curr1, index1) {
							if (

								(curr.LOB === curr1.LOB) &&

								(curr.SLOB_DESCRIPTION === curr1.SLOB_DESCRIPTION) &&
								(curr.SUBLOB === curr1.SUBLOB) &&
								(curr.FA === curr1.FA) &&
								(curr.UNAME === curr1.UNAME) &&
								(curr1.OP_INDICATOR !== ("U" || "I"))
							) {

								that.finalDeletedArray.push(curr);
							}
						});

					});

				}

			},

			loadFormIDOdataModel: function (mainFilters, REC_TYPE, viewInstance) {
				var that = this;
				var oInstance = viewInstance;
				var sURL = "/eFormAfterMaintananceSet";
				this._busyIndicator.open();
				if (mainFilters && REC_TYPE === 'A') {
					this._serverModel.read(sURL, {
						filters: mainFilters,
						success: function (data) {
							var oData = data.results;
							that.arr1 = [];
							that.arr1 = oData;
							if (mainFilters) {
								that.getApproverModelData(oData, REC_TYPE, oInstance);
							}
							that._busyIndicator.close();
						},
						error: function (error) {
							that._busyIndicator.close();
						}

					});
				} else if (mainFilters && REC_TYPE === 'B') {
					this._serverModel.read(sURL, {
						filters: mainFilters,
						success: function (data) {
							var oData = data.results;
							if (oData.length > 0) {
								oInstance.byId("btnAddRow").setEnabled(false);
								oInstance.byId("btnDeleteRow").setEnabled(false);
								oInstance.byId("btnCopyRow").setEnabled(false);
							} else {
								oInstance.byId("btnAddRow").setEnabled(true);
								oInstance.byId("btnDeleteRow").setEnabled(true);
								oInstance.byId("btnCopyRow").setEnabled(true);
							}
							that.arr1 = [];
							that.arr1 = oData;
							if (mainFilters) {
								that.getApproverModelData(oData, REC_TYPE, oInstance);

							}
							that._busyIndicator.close();
						},
						error: function (error) {
							that._busyIndicator.close();
						}

					});
				}

			},

			loadOdataModel: function (mainFilters, viewInstance) {
				this._busyIndicator.open();
				var that = this;
				var oInstance = viewInstance;
				var sURL = "/eFormFiMaintSet";
				if (mainFilters) {
					this._serverModel.read(sURL, {
						filters: mainFilters,
						success: function (data) {
							var oData = data.results;
							that.arr1 = [];
							that.arr1 = oData;
							if (mainFilters) {
								that.getApproverModelData(oData, undefined, oInstance);
							}
							that._busyIndicator.close();
						},
						error: function (error) {
							that._busyIndicator.close();
						}
					});
				} else {
					this._serverModel.read(sURL, {
						success: function (data) {
							var oData = data.results;

							that.arr1 = [];
							that.arr1 = oData;
							that.getApproverModelData(oData, undefined, oInstance);
							that._busyIndicator.close();
						},
						error: function (error) {
							that._busyIndicator.close();
						}
					});
				}

			},

			getApproverData: function (aFilter, oViewInstance) {
				this._busyIndicator.open();
				var that = this;
				var oView = oViewInstance;
				this._serverModel.read("/eformApproversSet", {
					filters: aFilter,
					success: function (oData, oResponse) {
						oData.results.forEach(function (item, index) {
							if (item.Appr === "FIA_MAN") {
								item.approver_name = "Compliance";
							}
						});
						var oApproverModel = new JSONModel(oData),
							oTable = oView.byId("approvers");
						oApproverModel.setSizeLimit(100);
						oTable.setModel(oApproverModel);
						oTable.bindAggregation("items", {
							path: "/results",
							template: new sap.m.ColumnListItem({
								cells: [
									new sap.m.Text().bindProperty("text", {
										parts: [{
											path: "Approved"
										}],
										formatter: function (cValue) {
											if (cValue === "X") {
												return "Approved";
											} else if (cValue === "R") {
												return "Rejected";
											} else {
												return "";
											}
										}
									}),
									new sap.m.Link({
										text: "{approver_name}",
										press: [oView.displayEmployees, oView],
										wrapping: true
									}).bindProperty("enabled", {
										parts: [{
											path: "Grp"
										}],
										formatter: function (cValue) {
											if (cValue === "X") {
												return true;
											} else {
												return false;
											}
										}
									}).data("sKey", "{Appr}"),
									new sap.m.Text({
										text: "{ReviewerType}"
									}),
									new sap.m.Text({
										text: "{ApprovedBy_name}"
									}),
									new sap.m.Text().bindProperty("text", {
										parts: [{
											path: "ApprovedDt"
										}],
										formatter: function (cValue) {
											if (cValue === "00000000" || cValue === null || cValue === undefined) {
												return "";
											} else {
												var dateFormat = DateFormat.getDateInstance({
													pattern: "MM/dd/yyyy"
												});
												var year = cValue.substring(0, 4);
												var month = cValue.substring(4, 6);
												var day = cValue.substring(6, 8);
												var sDate = month + "/" + day + "/" + year;
												return dateFormat.format(new Date(sDate));
											}
										}
									}),
									new sap.m.Text().bindProperty("text", {
										parts: [{
											path: "ApprovedDt"
										}, {
											path: "ApprovedTm"
										}],
										formatter: function (sDate, sTime) {
											if ((sDate === "00000000" || sDate === null || sDate === undefined) || (sTime === "00000000" || sTime === null ||
													sTime === undefined)) {
												return "";
											} else {
												var timeFormat = DateFormat.getDateTimeInstance({
													pattern: "hh:mm:ss a"
												});
												var year = sDate.substring(0, 4);
												var month = sDate.substring(4, 6);
												var day = sDate.substring(6, 8);
												var sCDate = month + "/" + day + "/" + year;
												var hour = sTime.substring(0, 2);
												var minute = sTime.substring(2, 4);
												var second = sTime.substring(4, 6);
												var sCTime = hour + ":" + minute + ":" + second;
												return timeFormat.format(new Date(sCDate + " " + sCTime));
											}
										}
									}),
									new sap.m.CheckBox({
										enabled: false,
										selected: "{Manual}"
									}),
									new sap.m.Text({
										text: "{CreatedBy_name}"
									}),
									new sap.m.Text().bindProperty("text", {
										parts: [{
											path: "CreationDt"
										}],
										formatter: function (cValue) {
											if (cValue === "00000000" || cValue === null || cValue === undefined) {
												return "";
											} else {
												var dateFormat = DateFormat.getDateInstance({
													pattern: "MM/dd/yyyy"
												});
												var year = cValue.substring(0, 4);
												var month = cValue.substring(4, 6);
												var day = cValue.substring(6, 8);
												var sDate = month + "/" + day + "/" + year;
												return dateFormat.format(new Date(sDate));
											}
										}
									}),
								]
							})
						});
						that._busyIndicator.close();
					},
					error: function (oError) {
						that._busyIndicator.close();
					}
				});
			},

			submitApproverData: function (oPayload) {
				var that = this;
				this._busyIndicator.open();
				this._serverModel.create("/eFormHeaders", oPayload, {
					success: function (oData, oResponse) {
						that._busyIndicator.close();
					},
					error: function (oError) {
						that._busyIndicator.close();
					}
				});
			},

			submitComment: function (oPayload, aFilters, oViewInstance) {
				var that = this,
					aFilter = aFilters,
					oView = oViewInstance;
				this._busyIndicator.open();
				this._serverModel.create("/eFormCommentSet", oPayload, {
					success: function (oData, oResponse) {
						that._busyIndicator.close();
						that.getCommentData(aFilter, oView);
					},
					error: function (oError) {
						that._busyIndicator.close();
					}
				});
			},

			getCommentData: function (aFilter, oViewInstance) {
				this._busyIndicator.open();
				var that = this;
				var oView = oViewInstance;
				this._serverModel.read("/eFormCommentSet", {
					filters: aFilter,
					success: function (oData, oResponse) {
						var oCommentModel = new JSONModel(oData),
							oList = oView.byId("commentList");
						oCommentModel.setSizeLimit(1000);
						oList.setModel(oCommentModel);
						oList.bindAggregation("items", {
							path: "/results",
							template: new sap.m.FeedListItem({
								senderActive: false,
								sender: "{CREATOR_NAME}",
								text: "{COMMENTS}",
								showIcon: false
							}).bindProperty("timestamp", {
								parts: [{
									path: "CR_DATE"
								}, {
									path: "TIME"
								}],
								formatter: function (sDate, sTime) {
									if ((sDate === "00000000" || sDate === null || sDate === undefined) || (sTime === "00000000" || sTime === null ||
											sTime === undefined)) {
										return "";
									} else {
										var timeFormat = DateFormat.getDateTimeInstance({
											pattern: "MM/dd/yyyy hh:mm:ss a"
										});
										var hour = sTime.substring(0, 2);
										var minute = sTime.substring(2, 4);
										var second = sTime.substring(4, 6);
										var sCTime = hour + ":" + minute + ":" + second;
										return timeFormat.format(new Date(sDate + " " + sCTime));
									}
								}
							})
						});
						that._busyIndicator.close();
					},
					error: function (oError) {
						that._busyIndicator.close();
					}
				});
			},

			getEmployee: function (aFilter, oViewInstance, oEventHandler) {
				this._busyIndicator.open();
				var that = this,
					aFilters = aFilter,
					oView = oViewInstance,
					oEvent = oEventHandler.getSource();
				this._serverModel.read("/eformGrpApproverSet", {
					filters: aFilters,
					success: function (oData, oResponse) {
						that._busyIndicator.close();
						if (!oView._oPopover) {
							oView._oPopover = sap.ui.xmlfragment("sony.finance.maintaince.app.Fragments.employee", oView);
							oView.getView().addDependent(oView._oPopover);
						}
						oView._oPopover.setModel(new sap.ui.model.json.JSONModel(oData));
						oView._oPopover.openBy(oEvent);
					},
					error: function (oError) {
						that._busyIndicator.close();
						sap.m.MessageBox.show(oError.message, {
							icon: MessageBox.Icon.ERROR,
							title: "Error"
						});
					}
				});
			}

		};
	},
	true);