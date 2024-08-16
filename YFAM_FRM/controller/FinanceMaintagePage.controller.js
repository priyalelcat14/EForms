sap.ui.define([
	"sony/finance/maintaince/app/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sony/finance/maintaince/app/model/FinanceApproverModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageToast"
], function (BaseController, JSONModel, FinanceApproverModel, Filter, FilterOperator, MessageToast) {
	"use strict";
	var sForm_Id;
	return BaseController.extend("sony.finance.maintaince.app.controller.FinanceMaintagePage", {
		onInit: function () {
			var Replace_With_User_name = "";
			this.aDeletedItems = [];
			this.isEmptyFlag = false;
			this.Form_flag = false;
			//FPDK900068 :DPATEL11: PRS:DEV:DPATEL11:REQ0737264:FIA_USERID_FIELD_CHANGES : START
			this._component = this.getOwnerComponent();
			this._oView = this.getView();
			this.odataModel = this._component.getModel("odataModel");
			FinanceApproverModel.initialize(this.odataModel, this._component, this._oView);
			FinanceApproverModel.loadValuHelpConfig();
			//FPDK900068 :DPATEL11: PRS:DEV:DPATEL11:REQ0737264:FIA_USERID_FIELD_CHANGES : END
			this.component = this.getOwnerComponent();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.view = this.getView();

			// this.getOwnerComponent().getModel("DisplayModel").setProperty("/Readonly", true);

			oRouter.attachRouteMatched(this._onObjectMatched, this);
			// oRouter.getRouteattachRouteMatched(this._onObjectMatchedPage, this);

		},
		_onNavigateHome: function (value) {
			// S4R:PJAIN6:GWDK902351:07/22/2021:Replacing old url with new url:START
			// window.open("/sap/bc/ui5_ui5/ui2/ushell/shells/abap/Fiorilaunchpad.html", "_self");
			window.open("/sap/bc/ui2/flp", "_self");
			// S4R:PJAIN6:GWDK902351:07/22/2021:Replacing old url with new url:END

		},
		navigate_inbox: function () {
			// S4R:PJAIN6:GWDK902351:07/22/2021:Replacing old url with new url:START
			// window.open("/sap/bc/ui5_ui5/ui2/ushell/shells/abap/Fiorilaunchpad.html", "_self");
			window.open("/sap/bc/ui2/flp", "_self");
			// S4R:PJAIN6:GWDK902351:07/22/2021:Replacing old url with new url:END

			if (window.close() === undefined) {
				window.close();
			}
		},

		/*on navigating back.*/
		onNavBack: function () {
			this.NavBack = true;
			this.getView().byId("userLabelId").clearSelection();
			this.getView().byId("userLabelId1").clearSelection();
			this.getView().byId("userLabeReplacelId").clearSelection();
			this.getView().byId("multiLobId").destroyTokens();
			this.getView().byId("multiSlobId").destroyTokens();
			this.Form_Num = "";
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

			oRouter.navTo("SearchPage");
		},

		//To open the form in edit mode.
		onPressFormEdit: function () {
			if (this.getOwnerComponent().getModel("headerUserModel").getProperty("/Status") === "In process") {
				MessageToast.show("This form is already submitted,so no changes are possible.Only the form can be withdrawn.");
				this.getOwnerComponent().getModel("DisplayModel").setProperty("/Readonly", false);
				this.getOwnerComponent().getModel("DisplayModel").setProperty("/Readonly1", false);
			} else if (this.getOwnerComponent().getModel("headerUserModel").getProperty("/Status") === "Completed") {
				MessageToast.show("This form is already Approved,so no changes are possible.");
				this.getOwnerComponent().getModel("DisplayModel").setProperty("/Readonly", false);
				this.getOwnerComponent().getModel("DisplayModel").setProperty("/Readonly1", false);
			} else if (this.getOwnerComponent().getModel("headerUserModel").getProperty("/Status") === "Rejected") {
				MessageToast.show("This form is Rejected,so no changes are possible.");
				this.getOwnerComponent().getModel("DisplayModel").setProperty("/Readonly", false);
				this.getOwnerComponent().getModel("DisplayModel").setProperty("/Readonly1", false);
			} else if (this.getOwnerComponent().getModel("headerUserModel").getProperty("/Save")) {
				this.getOwnerComponent().getModel("DisplayModel").setProperty("/Readonly", false);
			} else {
				this.getOwnerComponent().getModel("DisplayModel").setProperty("/Readonly", true);
			}
		},
		handleSelectionFinishLob: function () {

			var arr1 = [];
			arr1 = this.getModel("LobUserSearchModel").getProperty("/eLobUserSet");

			var sSelectedLob = this.getView().byId("multiLobId").getTokens();
			var arr2 = [];
			sSelectedLob.forEach(function (curr1, index1) {
				arr1.forEach(function (curr, index) {
					var sObject = {};
					if (curr.LOB === curr1.getProperty("text")) {
						sObject.SLOB = curr.SLOB;
						sObject.SLOB_DESCRIPTION = curr.SLOB_DESCRIPTION;
						arr2.push(sObject);

					}
				});
			});
			// var oSLob = {};
			// oSLob.SLOB = "";
			//var FinalArray = [];
			// for (var i = 0; i < arr2.length; i++) {
			//  var SLOB = arr2[i];
			//  FinalArray.push({
			//  "SLOB": SLOB
			// });
			//}

			var uniqueSLOB = [];
			jQuery.each(arr2, function (i, el) {
				if (jQuery.inArray(el, uniqueSLOB) === -1) uniqueSLOB.push(el);
			});
			this.getModel("LobUserSearchModel").setProperty("/esLob", uniqueSLOB);
			var sLob = this.getView().byId("multiSlobId");
			sLob.getModel("LobUserSearchModel").updateBindings(true);
			sLob.getModel("LobUserSearchModel").refresh();
			// sLob.setModel("LobUserSearchModel");
		},

		getRecType_A: function (mainFilters) {
			var curr = this.Form_Num;
			var REC_TYPE = 'A';
			var filters = [];
			var oChangeId = new Filter("CHANGE_ID", FilterOperator.Contains, curr);
			if (mainFilters) {
				mainFilters.forEach(function (curr) {
					filters.push(curr);
				});

				filters.push(oChangeId);
			} else {
				filters.push(oChangeId);
			}

			var oFormType = new Filter("REC_TYPE", FilterOperator.Contains, REC_TYPE);
			if (mainFilters) {
				filters.push(oFormType);
			} else {
				filters.push(oFormType);
			}
			var that = this;
			if (mainFilters) {
				FinanceApproverModel.loadFormIDOdataModel(filters, REC_TYPE, that);
			} else {
				FinanceApproverModel.loadFormIDOdataModel(filters, REC_TYPE, that);
			}
		},
		getRecType_B: function (mainFilters) {
			var curr = this.Form_Num;
			var REC_TYPE = 'B';
			var filters = [];
			var oChangeId = new Filter("CHANGE_ID", FilterOperator.Contains, curr);
			if (mainFilters) {
				mainFilters.forEach(function (curr) {
					filters.push(curr);
				});

				filters.push(oChangeId);
			} else {
				filters.push(oChangeId);
			}

			var oFormType = new Filter("REC_TYPE", FilterOperator.Contains, REC_TYPE);
			if (mainFilters) {
				filters.push(oFormType);
			} else {
				filters.push(oFormType);
			}
			var that = this;
			if (mainFilters) {
				FinanceApproverModel.loadFormIDOdataModel(filters, REC_TYPE, that);
			} else {
				FinanceApproverModel.loadFormIDOdataModel(filters, REC_TYPE, that);
			}
		},

		_onObjectMatched: function (oEvent) {
			this.Form_Num = "";
			this.getView().byId("idIconTabBar").setSelectedKey("BeforeKey");

			FinanceApproverModel.initialize(
				this.component.getModel("odataModel"),

				this.component, this.view);

			this.getView().byId("b_home").setVisible(false);

			//oRouter.navTo("FinanceMaintagePageSearch");
			var oEvent = oEvent,
				oDataSet;
			this.byId("approvers").unbindAggregation("items");
			this.byId("commentList").unbindAggregation("items");
			if (this.NavBack !== true) {
				if (oEvent.getParameters().name === "FinanceMaintagePageSearch") {

					FinanceApproverModel.loadValuHelpConfig();
					this.Form_Num = oEvent.getParameters().arguments.value;
					if (this.Form_Num !== undefined) {
						this.Form_flag = true;
						sForm_Id = this.Form_Num;
						this.getView().byId("pageTitleId").setText("Finance Approval Request Form : " + this.Form_Num);
						this.view.byId("idIconTabFilter3").setVisible(true);
						this.view.byId("idIconTabFilter4").setVisible(true);

					}
					if (this.Form_flag === true) {
						var sSource = jQuery.sap.getUriParameters().get("SOURCE");
						this.getOwnerComponent().getModel("DisplayModel").setProperty("/Readonly", false);
						this.getOwnerComponent().getModel("DisplayModel").setProperty("/Readonly1", false);

						if (sSource !== null) {
							oDataSet = {
								LOGIN_ID: sap.ushell.Container.getUser().getId(),
								LOGIN_NAME: sap.ushell.Container.getUser().getFullName(),
								REQUESTED_BY: "",
								REQUESTED_BY_ID: "",
								TITLE: "",
								DESCRIPTION: "",
								STATUS: ""
							};
							this.getOwnerComponent().setModel(new JSONModel(oDataSet), "selFormDataSet");
						}
						this.getRecType_A();
						this.getRecType_B();

						this.getApproverData([new Filter("EformNum", FilterOperator.EQ, this.Form_Num)]);
						this.getCommentData([new Filter("FORM_NO", FilterOperator.EQ, this.Form_Num)]);
						this.buttonVisibility();
					}
				} else {
					oDataSet = {
						REQUESTED_BY: sap.ushell.Container.getUser().getFullName(),
						REQUESTED_BY_ID: sap.ushell.Container.getUser().getId(),
						TITLE: "",
						DESCRIPTION: "",
						STATUS: ""
					};
					this.getOwnerComponent().setModel(new JSONModel(oDataSet), "selFormDataSet");
					this.byId("btnAddRow").setEnabled(true);
					this.byId("btnDeleteRow").setEnabled(true);
					this.byId("btnCopyRow").setEnabled(true);
					this.view.byId("idIconTabFilter3").setVisible(false);
					this.view.byId("idIconTabFilter4").setVisible(false);
					FinanceApproverModel.loadValuHelpConfig();
					this.getOwnerComponent().getModel("DisplayModel").setProperty("/Readonly", true);
					sForm_Id = "";
					this.Form_flag = false;
					this.getView().byId("pageTitleId").setText("Finance Approval Request Form");
					// FinanceApproverModel.loadOdataModel();
					var headerData = {
						user: "",
						lob: "",
						sublob: "",
						title: "",
						Description: "",
						userReplace: "",
						replaceWithUser: "",
						Status: ""
					};
					this.getOwnerComponent().getModel("headerUserModel").setData(headerData);
					this.buttonVisibility();
				}
			}
			this.NavBack = false;
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

						aFilter.push(new Filter("NAME", FilterOperator.Contains, sQuery));
					}
					//FPDK900068 :DPATEL11: PRS:DEV:DPATEL11:REQ0737264:FIA_USERID_FIELD_CHANGES : START
					if (oEvent.getParameters().id === "UserDialogId1") {

						aFilter.push(new sap.ui.model.Filter("NAME", FilterOperator.Contains, sQuery));
					}
					//FPDK900068 :DPATEL11: PRS:DEV:DPATEL11:REQ0737264:FIA_USERID_FIELD_CHANGES : END
					if (oEvent.getParameters().id === "sLoBDesDialogId") {

						aFilter.push(new Filter("NAME", FilterOperator.Contains, sQuery));
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

					aFilter.push(new Filter("NAME", FilterOperator.Contains, sQuery));
				}
				//FPDK900068 :DPATEL11: PRS:DEV:DPATEL11:REQ0737264:FIA_USERID_FIELD_CHANGES : START
				if (DialogName === "UserDialogId1") {

					aFilter.push(new sap.ui.model.Filter("NAME", FilterOperator.Contains, sQuery));
				}
				//FPDK900068 :DPATEL11: PRS:DEV:DPATEL11:REQ0737264:FIA_USERID_FIELD_CHANGES : END
				if (DialogName === "sLoBDesDialogId") {

					aFilter.push(new Filter("NAME", FilterOperator.Contains, sQuery));
				}
				// filter binding
				var oList = sap.ui.getCore().byId(DialogName);
				var oBinding = oList.getBinding("items");
				oBinding.filter(aFilter);
				sQuery = "";
			}

			// filter binding
			// var oList = this.getView().byId(DialogName);
			//var oBinding = oList.getBinding("items");
			// oBinding.filter(aFilter);
			// sQuery = "";

		},
		onReplaceSearch: function () {
			var oTableId = this.byId("userTableId");
			//FPDK900068 :DPATEL11: PRS:DEV:DPATEL11:REQ0737264:FIA_USERID_FIELD_CHANGES : START
			var sReplaceUserName = this.Replace_With_User_name;
			var sRepalaceId = this.getView().byId("userLabeReplacelId").getValue();
				
			//var sReplaceUserName = this.getView().byId("userLabeReplacelId").getValue();
			//var sRepalaceId = this.getView().byId("userLabeReplacelId").getSelectedItem().getKey();
			var sUserToReplace = this.getView().byId("userLabelId1").getValue();
			var sUserIdToReplace = this.getView().byId("userLabelId1").getValue();
			//var sUserIdToReplace = this.getView().byId("userLabelId1").getSelectedItem().getKey();
			//FPDK900068 :DPATEL11: PRS:DEV:DPATEL11:REQ0737264:FIA_USERID_FIELD_CHANGES : END
			var oData = this.getModel("oldapproverModel").getProperty("/eFormFiMaintSet");
			/* var oUserToReplace = [];
			 oData1.forEach(function(curr,index){
			   if(curr.UNAME === sUserToReplace){
			   oUserToReplace.push(curr);
			   }
			 });
			 oUserToReplace.forEach(function(curr,index){
			   curr.
			 });
			 */

			for (var i = 0; i < oData.length; i++) {
				if (this.getModel("oldapproverModel").getProperty("/eFormFiMaintSet/" + i + "/UNAME") === sUserIdToReplace) {
					this.getModel("oldapproverModel").setProperty("/eFormFiMaintSet/" + i + "/UNAME", sRepalaceId);
					this.getModel("oldapproverModel").setProperty("/eFormFiMaintSet/" + i + "/UNAME1", sReplaceUserName);
					this.getModel("oldapproverModel").setProperty("/eFormFiMaintSet/" + i + "/ChangedRowFlag", true);
					this.getModel("oldapproverModel").setProperty("/eFormFiMaintSet/" + i + "/OP_INDICATOR", "U");
					this.getModel("oldapproverModel").setProperty("/eFormFiMaintSet/" + i + "/CHANGE_FLAG", 1);
					oTableId.getModel("oldapproverModel").updateBindings(true);
					oTableId.getModel("oldapproverModel").refresh();
					oTableId.setModel("oldapproverModel");
				}
			}
		},

		//On press of Withdraw button.
		//Works when the form is submitted and the user wants to withdraw the form.

		onPressWithdraw: function (oEvent) {
			var s = {};
			var that = this;
			var curr_view = this.getView();
			var oFormSaveDeferred;
			// this.eform_withdraw;
			// new Promise(function (fnResolve) {
			sap.m.MessageBox.confirm("Do you want to Cancel the workflow for FI Approval process?", {
				title: "Confirm Withdraw",
				actions: ["Yes", "No"],
				onClose: function (sActionClicked) {
					if (sActionClicked === "Yes") {
						var oAction = "withdraw";
						var sStatus = that.getOwnerComponent().getModel("headerUserModel").getProperty("/Status");
						sStatus = (sStatus === undefined || sStatus === null) ? "" : sStatus;
						oFormSaveDeferred = FinanceApproverModel.saveEditedEntries(oAction, that.isEmptyFlag, "", "", that.Form_Num, that.view,
							sStatus);
						jQuery.when.apply(oFormSaveDeferred)
							.done(function () {
								var sTittle = FinanceApproverModel.setTittle();
								this.getOwnerComponent().getModel("DisplayModel").setProperty("/Readonly", true);
								this.getOwnerComponent().getModel("DisplayModel").setProperty("/Readonly1", true);
								if (sTittle) {
									this.getView().byId("pageTitleId").setText("Finance Approval Request Form" + " : " + sTittle);
								}
							}.bind(that))
							.fail(function (oError) {

							}.bind(that));
					}
				}
			});
			// }).catch(function (err) {
			// 	if (err !== undefined) {
			// 		sap.m.MessageBox.error(err);
			// 	}
			// }.bind(this));
		},

		onPressSave: function (oEvent) {

			var isSave = "true";
			var FormUpdateURL = "/eFormAfterMaintananceSet";
			var formTitle = this.getView().byId("sFormTitleId").getValue();
			var formDesc = this.getView().byId("sFormDescId").getValue();
			// var formTitle =this.getView().byId("sFormTitleId").getValue();

			// var oData = this.getModel("oldapproverModel").getData().eFormFiMaintSet;

			if (formTitle === "") {
				MessageToast.show("Please enter the form title");
				this.getView().byId("sFormTitleId").setValueState("Error");
			} else {
				this.getView().byId("sFormTitleId").setValueState("None");
			}
			this.isRowKeyEmpty();
			this.isFARListComplete();
			//FinanceApproverModel.isDeletedArray(this.aDeletedItems);

			if (this.FAflag > 0 || formTitle === "" || this.isRowEmptyCount > 0) {
				this.isEmptyFlag = true;
			} else {
				this.isEmptyFlag = false;
			}

			var sStatus = this.getOwnerComponent().getModel("headerUserModel").getProperty("/Status");
			sStatus = (sStatus === undefined || sStatus === null) ? "" : sStatus;
			var oFormSaveDeferred = FinanceApproverModel.saveEditedEntries(isSave, this.isEmptyFlag, formTitle, formDesc, this.Form_Num, this
				.view,
				sStatus);

			jQuery.when.apply(this, oFormSaveDeferred)
				.done(function () {
					var sTittle = FinanceApproverModel.setTittle();
					if (sTittle) {
						this.submitApproverData(sTittle, 'SAVE');
						this.Form_Num = sTittle;
						this.getView().byId("pageTitleId").setText("Finance Approval Request Form" + " : " + sTittle);
						if (this.isEmptyFlag === false) {
							var oChange_IdFilter = new Filter("CHANGE_ID", FilterOperator.EQ, sTittle);
							var aFilters = [];
							aFilters.push(oChange_IdFilter);

							this.getRecType_A(aFilters);
							this.getRecType_B(aFilters);

							this.getApproverData([new Filter("EformNum", FilterOperator.EQ, sTittle)]);
							this.buttonVisibility();

						}
					}

				}.bind(this))
				.fail(function (oError) {

				}.bind(this));

		},

		onPressSubmit: function () {

			var formTitle = this.getView().byId("sFormTitleId").getValue();
			if (formTitle === "") {
				MessageToast.show("Please enter the form title");
				this.getView().byId("sFormTitleId").setValueState("Error");
			} else {
				this.getView().byId("sFormTitleId").setValueState("None");
			}
			var formDesc = this.getView().byId("sFormDescId").getValue();

			//FinanceApproverModel.isDeletedArray(this.aDeletedItems);

			if (this.FAflag > 0 || formTitle === "" || this.isRowEmptyCount > 0) {
				this.isEmptyFlag = true;
			} else {
				this.isEmptyFlag = false;
			}
			this.isRowKeyEmpty();
			this.isFARListComplete();
			var sStatus = this.getOwnerComponent().getModel("headerUserModel").getProperty("/Status");
			sStatus = (sStatus === undefined || sStatus === null) ? "" : sStatus;
			var oFormSaveDeferred = FinanceApproverModel.saveEditedEntries("", this.isEmptyFlag, formTitle, formDesc, this.Form_Num, this.view,
				sStatus);
			jQuery.when.apply(this, oFormSaveDeferred)
				.done(function () {
					var sTittle = FinanceApproverModel.setTittle();
					if (sTittle) {
						this.submitApproverData(sTittle, 'SUBMIT');
						this.getView().byId("pageTitleId").setText("Maintance Approver Maintanance " + " " + sTittle);
						if (window.top.location.href.toLowerCase().indexOf("fiorilaunchpad") == -1) {
							// S4R:PJAIN6:GWDK902351:07/22/2021:Seting visibility of home icon false:START
							// this.getView().byId("b_home").setVisible(true);
							this.getView().byId("b_home").setVisible(false);
							// S4R:PJAIN6:GWDK902351:07/22/2021:Seting visibility of home icon false:END
						}
						if (this.isEmptyFlag === false) {
							var oChange_IdFilter = new Filter("CHANGE_ID", FilterOperator.EQ, sTittle);
							var aFilters = [];
							aFilters.push(oChange_IdFilter);

							this.getRecType_A(aFilters);
							this.getRecType_B(aFilters);
							this.buttonVisibility();
						}
					}
				}.bind(this))
				.fail(function (oError) {

				}.bind(this));

		},

		/*Validation Check ,if the user has entered all seven approver levels for a form Id for a set of lob and sublob combination.
		Called from onPressSubmit and onPressSave functions.
		*/

		isFARListComplete: function () {
			var oTableId = this.byId("userTableId");
			var oData = this.getModel("oldapproverModel").getData().eFormFiMaintSet;
			var arrLobCombination = [];
			var aNewData = [];
			oData.forEach(function (curr, index) {
				if (curr.OP_INDICATOR === ("I") && curr.isSaved !== ("Save" || "withdraw")) {
					arrLobCombination.push({
						LOB: curr.LOB,
						SLOB: curr.SUBLOB
					});
					aNewData.push(curr);
				}

			});
			this.FAflag = 0;
			var uniqueSLOB = [];
			jQuery.each(arrLobCombination, function (i, el) {
				if (jQuery.inArray(el, uniqueSLOB) === -1) uniqueSLOB.push(el);
			});

			uniqueSLOB.forEach(function (curr) {
				var FAValues = [];
				aNewData.forEach(function (curr1) {

					if (curr.LOB === curr1.LOB && curr.SLOB === curr1.SUBLOB) {
						FAValues.push(curr1.FA);

					}

				}, this);

				if (FAValues.indexOf("FA1") === -1) {
					this.FAflag = this.FAflag + 1;
				}
				if (FAValues.indexOf("FA2") === -1) {
					this.FAflag = this.FAflag + 1;
				}

				if (FAValues.indexOf("FA3") === -1) {
					this.FAflag = this.FAflag + 1;
				}
				if (FAValues.indexOf("FA4") === -1) {
					this.FAflag = this.FAflag + 1;
				}
				if (FAValues.indexOf("FA5") === -1) {
					this.FAflag = this.FAflag + 1;
				}
				if (FAValues.indexOf("SPE CFO") === -1) {
					this.FAflag = this.FAflag + 1;
				}
				if (FAValues.indexOf("DCFO/CAO") === -1) {
					this.FAflag = this.FAflag + 1;
				}
				if (this.FAflag > 0) {
					MessageToast.show("Please enter all the Seven level of approvers to save successfully");
				}
			}, this);
		},

		//check on the table for empty key entries .

		isRowKeyEmpty: function () {
			var oTableId = this.byId("userTableId");
			var oData = this.getModel("oldapproverModel").getData().eFormFiMaintSet;
			var that = this;

			that.isRowEmptyCount = 0;
			oData.forEach(function (curr, index) {
				if (curr.OP_INDICATOR === "I" && (
						curr.LOB === "" ||
						curr.SUBLOB === "" ||
						curr.UNAME === "" ||
						curr.FA === ""
					)) {
					//that.isEmptyFlag = true;
					that.isRowEmptyCount = that.isRowEmptyCount + 1;
					that.getModel("oldapproverModel").setProperty("/eFormFiMaintSet/" + index + "/ValueState", "Error");
					oTableId.getModel("oldapproverModel").getData();
					oTableId.getModel("oldapproverModel").updateBindings(true);
					oTableId.getModel("oldapproverModel").refresh();
				} else if (curr.OP_INDICATOR === "I") {
					//that.isEmptyFlag = false;
					//that.isRowEmptyCount =that.isRowEmptyCount;
					that.getModel("oldapproverModel").setProperty("/eFormFiMaintSet/" + index + "/ValueState", "None");
					oTableId.getModel("oldapproverModel").getData();
					oTableId.getModel("oldapproverModel").updateBindings(true);
					oTableId.getModel("oldapproverModel").refresh();
				}

			});
		},

		onSearch: function () {

			var filters = [];
			var mainFilters = [];
			var aUserFilter1 = [];
			var oTempUsr = [];
			var oLobTempFilter = [];
			var oSLOBTemp = [];
			//FPDK900068 :DPATEL11: PRS:DEV:DPATEL11:REQ0737264:FIA_USERID_FIELD_CHANGES : START
			var aUserFilter = this.getView().byId("userLabelId").getTokens();
			//var aUserFilter = this.getView().byId("userLabelId").getSelectedItems();
			//FPDK900068 :DPATEL11: PRS:DEV:DPATEL11:REQ0737264:FIA_USERID_FIELD_CHANGES : END

			for (var i = 0; i < aUserFilter.length; i++) {
				aUserFilter1.push(aUserFilter[i].getKey());
			}
			var aLobFilter = this.getView().byId("multiLobId").getTokens();

			var aLobFilter1 = [];
			for (var i = 0; i < aLobFilter.length; i++) {
				aLobFilter1.push(aLobFilter[i].getText());
			}
			var aSubLobFilter = this.getView().byId("multiSlobId").getTokens();

			var aSubLobFilter1 = [];
			for (var i = 0; i < aSubLobFilter.length; i++) {
				aSubLobFilter1.push(aSubLobFilter[i].getText());
			}

			if (aUserFilter1) {
				aUserFilter1.forEach(function (curr, index) {
					var oUserFilter = new sap.ui.model.Filter("UNAME", FilterOperator.EQ, curr);
					oTempUsr.push(oUserFilter);

					//filters.push(oUserFilter);

				});
				if (oTempUsr.length !== 0) {
					filters.push(new sap.ui.model.Filter({
						filters: oTempUsr,
						and: false
					}));
				}
			}

			if (aLobFilter1) {
				aLobFilter1.forEach(function (curr, index) {
					var oLobFilter = new sap.ui.model.Filter("LOB", FilterOperator.EQ, curr);
					oLobTempFilter.push(oLobFilter);
				});
				if (oLobTempFilter.length !== 0) {
					filters.push(new sap.ui.model.Filter({
						filters: oLobTempFilter,
						and: false
					}));
				}
			}
			if (aSubLobFilter1) {
				aSubLobFilter1.forEach(function (curr, index) {
					var oSubLobFilter = new sap.ui.model.Filter("SUBLOB", FilterOperator.EQ, curr);
					oSLOBTemp.push(oSubLobFilter);
				});
				if (oSLOBTemp.length !== 0) {
					filters.push(new sap.ui.model.Filter({
						filters: oSLOBTemp,
						and: false
					}));
				}
			}

			if (filters) {
				mainFilters.push(new sap.ui.model.Filter({
					filters: filters,
					and: true
				}));
				this.mainFilters = mainFilters;
			}

			if (filters.length === 0 && this.Form_flag === false) {
				FinanceApproverModel.loadOdataModel([], this);
			} else if (filters.length !== 0 && this.Form_flag === false) {
				FinanceApproverModel.loadOdataModel(mainFilters, this);
			} else if (filters.length !== 0 && this.Form_flag === true) {
				this.getRecType_A(mainFilters);
				this.getRecType_B(mainFilters);
				// FinanceApproverModel.loadFormIDOdataModel(mainFilters,REC_TYPE1);
			}

			// this.getView().byId("sLObMultiSelectId").setSelectedItems(aSubLobFilter);
		},

		onAddPress: function () {
			var oTableId = this.byId("userTableId");
			//var items = oTableId.getSelectedItems();
			var aMaintainaceList = [];

			var oUiModel = this.getModel("oldapproverModel");
			var oldArray = oUiModel.getProperty("/eFormFiMaintSet");
			//oldArray

			for (var i = 0; i < oldArray.length; i++) {
				aMaintainaceList.push(oldArray[i]);
			}
			aMaintainaceList.push({

				"LOB": "",

				"SLOB_DESCRIPTION": "",
				"SUBLOB": "",
				"FA": "",
				"UNAME": "",
				"isEnable": true,
				"STATUS": "In process",
				"REC_TYPE": "A",
				"OP_INDICATOR": "I",
				"CHANGE_ID": "",
				"CHANGE_FLAG": 1,
				"isVisibleLocked": false,
				"isChanged": true
			});
			oUiModel.setProperty("/eFormFiMaintSet", aMaintainaceList);
			oUiModel.setProperty("/isChanged", true);
			oUiModel.setProperty("/ChangedRowFlag", true);
			oTableId.getModel("oldapproverModel").updateBindings(true);
			oTableId.getModel("oldapproverModel").refresh();

			// Removing selections
			oTableId.removeSelections(true);

		},
		onEditPress: function () {
			var oTableId = this.byId("userTableId");
			var selectedRow = oTableId.getSelectedItems();
			//selectedRow.getModel();
			selectedRow.forEach(function (curr, index) {
				var path = curr.getBindingContextPath();
				if (oTableId.getModel("oldapproverModel").getProperty(path + "/LOC_OBJ") === "X") {
					oTableId.getModel("oldapproverModel").setProperty(path + "/isEnable", false);
					if (oTableId.getModel("oldapproverModel").getProperty(path + "/ChangedRowFlag") === true) {
						oTableId.getModel("oldapproverModel").setProperty(path + "/ChangedRowFlag", true);
					} else {
						oTableId.getModel("oldapproverModel").setProperty(path + "/ChangedRowFlag", false);
					}
					oTableId.getModel("oldapproverModel").setProperty(path + "/OP_INDICATOR", "");
					MessageToast.show("This row can not be  edited as it is already locked");
				} else {
					oTableId.getModel("oldapproverModel").setProperty(path + "/isEnable", true);
					oTableId.getModel("oldapproverModel").setProperty(path + "/ChangedRowFlag", true);
					if (oTableId.getModel("oldapproverModel").getProperty(path + "/OP_INDICATOR") === "I") {
						oTableId.getModel("oldapproverModel").setProperty(path + "/OP_INDICATOR", "I");
					} else {
						oTableId.getModel("oldapproverModel").setProperty(path + "/OP_INDICATOR", "U");
					}
				}

				oTableId.getModel("oldapproverModel").setProperty(path + "/REC_TYPE", "A");
				oTableId.getModel("oldapproverModel").getData();
				oTableId.getModel("oldapproverModel").updateBindings(true);
				oTableId.getModel("oldapproverModel").refresh();
			});
		},

		onRemovePress: function () {
			var oTable = this.byId("userTableId"),
				selectedRow = oTable.getSelectedItems(),
				oUiModel = this.getModel("oldapproverModel"),
				aMaintainaceList = [],
				oldArray = oUiModel.getProperty("/eFormFiMaintSet");

			for (var i = 0; i < oldArray.length; i++) {
				aMaintainaceList.push(oldArray[i]);
			}
			for (i = selectedRow.length - 1; i >= 0; i--) {
				var path = selectedRow[i].getBindingContextPath();
				var index = path.lastIndexOf("/");
				var ObjIndex = path.substr(index + 1);
				aMaintainaceList.splice(ObjIndex, 1);
			}
			oUiModel.setProperty("/eFormFiMaintSet", aMaintainaceList);
			oTable.getModel("oldapproverModel").updateBindings(true);
			oTable.getModel("oldapproverModel").refresh();
			oTable.removeSelections();
		},

		onCopyPress: function () {
			var oTable = this.byId("userTableId"),
				iSelRow = oTable.getSelectedItems().length;
			if (iSelRow === 1) {
				var oSelItem = oTable.getSelectedItem(),
					sPath = oSelItem.getBindingContextPath(),
					aMaintainaceList = [],
					oUiModel = this.getModel("oldapproverModel"),
					oldArray = oUiModel.getProperty("/eFormFiMaintSet"),
					oSelItemData = oUiModel.getProperty(sPath);

				for (var i = 0; i < oldArray.length; i++) {
					aMaintainaceList.push(oldArray[i]);
				}
				aMaintainaceList.push({

					"LOB": oSelItemData.LOB,
					"SLOB_DESCRIPTION": oSelItemData.SLOB_DESCRIPTION,
					"SUBLOB": oSelItemData.SUBLOB,
					"FA": oSelItemData.FA,
					"UNAME": oSelItemData.UNAME,
					"isEnable": oSelItemData.isEnable,
					"STATUS": oSelItemData.STATUS,
					"REC_TYPE": oSelItemData.REC_TYPE,
					"OP_INDICATOR": oSelItemData.OP_INDICATOR,
					"CHANGE_ID": oSelItemData.CHANGE_ID,
					"CHANGE_FLAG": oSelItemData.CHANGE_FLAG,
					"isVisibleLocked": oSelItemData.isVisibleLocked,
					"isChanged": oSelItemData.isChanged
				});
				oUiModel.setProperty("/eFormFiMaintSet", aMaintainaceList);
				oUiModel.setProperty("/isChanged", true);
				oUiModel.setProperty("/ChangedRowFlag", true);
				oTable.getModel("oldapproverModel").updateBindings(true);
				oTable.getModel("oldapproverModel").refresh();

				// Removing selections
				oTable.removeSelections(true);
				oTable.getItems()[sPath.split("/")[2]].setSelected(true);

			} else if (iSelRow === 0) {
				MessageToast.show("Select record to copy");
			} else {
				MessageToast.show("Select only 1 record for copy");
			}
		},

		handleReplaceValueHelp: function () {
			if (!this._oDialog1) {
				this._oDialog1 = sap.ui.xmlfragment("sony.finance.maintaince.app.Fragments.UserReplace_Dialog", this);
				this._oDialog1.setModel(this.getView().getModel("oldapproverModel"));

			}
			this.getView().addDependent(this._oDialog1);

			//this._oDialog1.setMultiSelect(true);
			this._oDialog1.open();

		},
		//FPDK900068 :DPATEL11: PRS:DEV:DPATEL11:REQ0737264:FIA_USERID_FIELD_CHANGES : START
		handleUserValueHelp1: function (oEvent) {
			this.inputId = oEvent.getSource().getId();
			var InputValue = sap.ui.getCore().byId(this.inputId);
			//this.UserName = oEvent.getSource().getParent().getAggregation("cells")[4].getId();
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("sony.finance.maintaince.app.Fragments.User_Dialog", this);
				this._oDialog.setModel(this.getView().getModel("userSearchModel	"));
				this.getView().addDependent(this._oDialog);
			}

			// this._oDialog.setMultiSelect(true);
			this._oDialog.open();
			this.handleSearch(undefined, "UserDialogId");
		},
		
		handleUserValueHelp2: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			var InputValue = sap.ui.getCore().byId(this.inputId);
			//this.UserName = oEvent.getSource().getParent().getAggregation("cells")[4].getId();
			if (!this._oDialog10) {
				this._oDialog10 = sap.ui.xmlfragment("sony.finance.maintaince.app.Fragments.User_Dialog1", this);
				this._oDialog10.setModel(this.getView().getModel("userSearchModel"));
				this.getView().addDependent(this._oDialog10);
			}
			if (InputValue === this.getView().byId("userLabelId")) {
				this._oDialog10.setMultiSelect(true);
			}

			//this._oDialog.setMultiSelect(true);
			this._oDialog10.open();
			this.handleSearch(undefined, "UserDialogId1");
		},
		////FPDK900068 :DPATEL11: PRS:DEV:DPATEL11:REQ0737264:FIA_USERID_FIELD_CHANGES : END
		/*On User value help open*/
		handleUserValueHelp: function (oEvent) {

			this.inputId = oEvent.getSource().getId();
			this.UserName = oEvent.getSource().getParent().getAggregation("cells")[4].getId();
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("sony.finance.maintaince.app.Fragments.User_Dialog", this);
				this._oDialog.setModel(this.getView().getModel("oldapproverModel"));
				this.getView().addDependent(this._oDialog);
			}

			// this._oDialog.setMultiSelect(true);
			this._oDialog.open();
			this.handleSearch(undefined, "UserDialogId");
		},

		/*On Doc Type value help open*/
		handleDocTypValueHelp: function (oEvent) {

			this.inputId = oEvent.getSource().getId();
			if (!this._oDialog5) {
				this._oDialog5 = sap.ui.xmlfragment("sony.finance.maintaince.app.Fragments.Doc_Typ_Dialog", this);
				this._oDialog5.setModel(this.getView().getModel("oldapproverModel"));
				this.getView().addDependent(this._oDialog5);
			}

			// this._oDialog.setMultiSelect(true);
			this._oDialog5.open();
		},
		handleLOBValueHelpHeader: function (oEvent) {

			this.inputId = this.getView().byId("multiLobId");

			if (!this._oDialog2) {
				this._oDialog2 = sap.ui.xmlfragment("sony.finance.maintaince.app.Fragments.LOB_Dialog", this);
				this._oDialog2.setModel(this.getView().getModel("oldapproverModel"));
				this.getView().addDependent(this._oDialog2);
			}
			//FPDK900068 :DPATEL11: PRS:DEV:DPATEL11:REQ0737264:FIA_USERID_FIELD_CHANGES : START
			//this._oDialog2.setMultiSelect(true);
			this._oDialog2.open();
			this.handleSearch(undefined, "LoBDialogId");
			//FPDK900068 :DPATEL11: PRS:DEV:DPATEL11:REQ0737264:FIA_USERID_FIELD_CHANGES : END
		},
		handleLOBValueHelp: function (oEvent) {

			this.inputId = oEvent.getSource().getId();

			if (!this._oDialog2) {
				this._oDialog2 = sap.ui.xmlfragment("sony.finance.maintaince.app.Fragments.LOB_Dialog", this);
				this._oDialog2.setModel(this.getView().getModel("oldapproverModel"));
				this.getView().addDependent(this._oDialog2);
			}

			this._oDialog2.setMultiSelect(false);
			this._oDialog2.open();
			this.handleSearch(undefined, "LoBDialogId");
		},

		handleSLOBValueHelp: function (oEvent) {
			this.getSLOValueHelp(oEvent);
			this.Slob = oEvent.getSource().getParent().getAggregation("cells")[2].getId();
			this.inputId = oEvent.getSource().getId();
			if (!this._oDialog3) {
				this._oDialog3 = sap.ui.xmlfragment("sony.finance.maintaince.app.Fragments.SLOB_Dialog", this);
				this._oDialog3.setModel(this.getView().getModel("oldapproverModel"));
				this.getView().addDependent(this._oDialog3);
			}

			this._oDialog3.setMultiSelect(false);
			this._oDialog3.open();
			this.handleSearch(undefined, "sLoBDialogId");
		},

		/*On SLOB Description value help open*/
		handleSLOBDesValueHelp: function (oEvent) {

			this.inputId = oEvent.getSource().getId();
			if (!this._oDialog4) {
				this._oDialog4 = sap.ui.xmlfragment("sony.finance.maintaince.app.Fragments.SLOB_Description_Dialog", this);
				this._oDialog4.setModel(this.getView().getModel("oldapproverModel"));
				this.getView().addDependent(this._oDialog4);
			}

			// this._oDialog3.setMultiSelect(true);
			this._oDialog4.open();

		},
		handleSLOBValueHelpHeader: function (oEvent) {
			this.handleSelectionFinishLob();
			this.inputId = this.getView().byId("multiSlobId");
			this.Slob = this.getView().byId("multiSlobId");
			//this.inputId = oEvent.getSource().getId();
			if (!this._oDialog3) {
				this._oDialog3 = sap.ui.xmlfragment("sony.finance.maintaince.app.Fragments.SLOB_Dialog", this);
				this._oDialog3.setModel(this.getView().getModel("oldapproverModel"));
				this.getView().addDependent(this._oDialog3);
			}

			//this._oDialog3.setMultiSelect(true);
			this._oDialog3.open();
			this.handleSearch(undefined, "multiSlobId");

		},
		/*On User Dialog value help confirm.*/
		onHandleConfirm: function (oEvent) {
			var aContexts = oEvent.getParameter("selectedContexts");
			var InputValue = sap.ui.getCore().byId(this.inputId);
			if (aContexts && aContexts.length) {

				MessageToast.show("You have chosen " + aContexts.map(function (oContext) {
					return oContext.getObject().USERID;
				}).join(", "));
				var value;
				var valueName;
				aContexts.map(function (oContext) {
					value = oContext.getObject().USERID;
					valueName = oContext.getObject().NAME;
				});
			}
			if (this.getView().byId("userLabeReplacelId") === InputValue) {
				this.Replace_With_User_name = valueName;
			}

			//var InputValue = sap.ui.getCore().byId(this.inputId);
			//var InputName = sap.ui.getCore().byId(this.UserName);
			
			InputValue.setValue(value);
			InputValue.data("key", valueName);
			
			// InputValue.setValue(value);
			// InputName.setValue(valueName);
			//this._oDialog.close();
		},
		/*On LOB Dialog value help confirm.*/
		//FPDK900068 :DPATEL11: PRS:DEV:DPATEL11:REQ0737264:FIA_USERID_FIELD_CHANGES : START
		onHandleConfirm1: function (oEvent) {
			var aContexts = oEvent.getParameter("selectedContexts");
			var InputValue = this.getView().byId("userLabelId");
			//var valueName;
			aContexts.map(function (oContext) {
				InputValue.addToken(new sap.m.Token({
					text: oContext.getObject().NAME,
					key: oContext.getObject().USERID
				}));
			});
		},
		//FPDK900068 :DPATEL11: PRS:DEV:DPATEL11:REQ0737264:FIA_USERID_FIELD_CHANGES : END
		onHandleConfirmLOB: function (oEvent) {
			if (this.inputId === this.getView().byId("multiLobId")) {
				this.onHandleConfirmLOBHeader(oEvent);
			} else {
				var aContexts = oEvent.getParameter("selectedContexts");

				if (aContexts && aContexts.length) {

					MessageToast.show("You have chosen " + aContexts.map(function (oContext) {
						return oContext.getObject().LOB;
					}).join(", "));
					var value;

					aContexts.map(function (oContext) {
						value = oContext.getObject().LOB;

					});
				}

				var InputValue = sap.ui.getCore().byId(this.inputId);

				InputValue.setValue(value);

				//this.getSLOValueHelp();
				// this._oDialog2.destroy();
			}
		},
		/*On LOB Dialog value help confirm.*/
		onHandleConfirmLOBHeader: function (oEvent) {
			var aContexts = oEvent.getParameter("selectedContexts");

			if (aContexts && aContexts.length) {

				MessageToast.show("You have chosen " + aContexts.map(function (oContext) {
					return oContext.getObject().LOB;
				}).join(", "));
				var oValue = [];

				aContexts.map(function (oContext) {
					var token = new sap.m.Token();
					oValue.push(token.setText(oContext.getObject().LOB));

				});
			}

			var InputValue = this.getView().byId("multiLobId");
			InputValue.setTokens(oValue);

			this.handleSelectionFinishLob();
			// this._oDialog2.destroy();
		},
		/*  onHandleClose: function() {
		    if (this._oDialog2) {
		      this._oDialog2.close();
		    }
		    if (this._oDialog) {
		      this._oDialog.close();
		    }
		    if (this._oDialog3) {
		      this._oDialog3.close();
		    }
		    if (this._oDialog4) {
		      this._oDialog4.close();
		    }
		  },*/

		/*On SLob description OK press*/

		onHandleConfirmSLOB_DES: function (oEvent) {
			var aContexts = oEvent.getParameter("selectedContexts");

			if (aContexts && aContexts.length) {

				MessageToast.show("You have chosen " + aContexts.map(function (oContext) {
					return oContext.getObject().SLOB_DESCRIPTION;
				}).join(", "));
				var value;
				aContexts.map(function (oContext) {
					value = oContext.getObject().SLOB_DESCRIPTION;
				});
			}

			var InputValue = sap.ui.getCore().byId(this.inputId);
			InputValue.setValue(value);
			// this._oDialog4.close();
		},

		_onButtonPressApprove: function (value) {
			var msg_returned = "";
			var url = "/sap/opu/odata/sap/YFPSFIPFRDD0224_EFORM_SRV/";
			var oModelData = new sap.ui.model.odata.ODataModel(url, true);
			var eform_num = this.Form_Num;
			var relPath = "/eFormValidateApprovals?$filter=EFORM_NUM eq '" + eform_num + "' and ACTION eq 'A'";
			var that = this;
			oModelData.read(relPath, null, [], false, function (oData, response) {

				var msg_type = response.data.results[0].MSG_TYPE;
				if (msg_type == "E") {
					// sap.m.MessageBox.error(response.data.results[0].MSG);
					msg_returned = response.data.results[0].MSG + ".";
				} else {
					msg_returned = "The eForm has been successfully approved.";
				}
				new Promise(function (fnResolve) {
					sap.m.MessageBox.confirm(msg_returned + "Do you want to go to the Fiori My Inbox App?", {
						title: "Confirm Navigation",
						actions: ["Yes", "No"],
						onClose: function (sActionClicked) {
							// S4R:PJAIN6:GWDK902351:07/22/2021:Replacing old url with new url:START
							// if (sActionClicked === "Yes") {
							// 	if (window.top.location.href.toLowerCase().indexOf("fiorilaunchpad") === -1) {
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
							// S4R:PJAIN6:GWDK902351:07/22/2021:Replacing old url with new url:END

							if (sActionClicked === "No") {
								if (window.top.location.href.toLowerCase().indexOf("fiorilaunchpad") === -1) {
									if (window.close() === undefined) {
										window.close();
									}
									window.open("https://sharepoint.spe.sony.com/myspe/", "_self");
								} else {
									if (jQuery.sap.getUriParameters().get("SOURCE") !== null) {
										if (window.close() === undefined) {
											window.close();
										}
									} else {
										window.history.go(-1);
									}
								}
							}
						}
					});
				}).catch(function (err) {
					if (err !== undefined) {
						sap.m.MessageBox.error(err);
					}
				});
			});
		},

		_onButtonPressReject: function (value) {

			var msg_returned = "";
			var url = "/sap/opu/odata/sap/YFPSFIPFRDD0224_EFORM_SRV/";
			var oModelData = new sap.ui.model.odata.ODataModel(url, true);
			var eform_num = this.Form_Num;
			var relPath = "/eFormValidateApprovals?$filter=EFORM_NUM eq '" + eform_num + "' and ACTION eq 'R'";
			var that = this;
			oModelData.read(relPath, null, [], false, function (oData, response) {

				var msg_type = response.data.results[0].MSG_TYPE;
				if (msg_type == "E") {

					msg_returned = response.data.results[0].MSG + ".";
				} else {
					msg_returned = "The Eform has been successfully rejected.";
				}

				new Promise(function (fnResolve) {
					sap.m.MessageBox.confirm(msg_returned + "Do you want to go to the Fiori My Inbox App?", {
						title: "Confirm Navigation",
						actions: ["Yes", "No"],
						onClose: function (sActionClicked) {
							// S4R:PJAIN6:GWDK902351:07/22/2021:Replacing old url with new url:START
							// if (sActionClicked === "Yes") {
							// 	if (window.top.location.href.toLowerCase().indexOf("fiorilaunchpad") === -1) {
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
							// S4R:PJAIN6:GWDK902351:07/22/2021:Replacing old url with new url:START

							if (sActionClicked === "No") {
								if (window.top.location.href.toLowerCase().indexOf("fiorilaunchpad") === -1) {
									if (window.close() === undefined) {
										window.close();
									}
									window.open("https://sharepoint.spe.sony.com/myspe/", "_self");
								} else {
									if (jQuery.sap.getUriParameters().get("SOURCE") !== null) {
										if (window.close() === undefined) {
											window.close();
										}
									} else {
										window.history.go(-1);
									}
								}
							}
						}
					});
				}).catch(function (err) {
					if (err !== undefined) {
						sap.m.MessageBox.error(err);
					}
				});

			});
		},

		getSLOValueHelp: function (oEvent) {

			var arr1 = [];
			arr1 = this.getModel("LobUserSearchModel").getProperty("/eLobUserSet");

			var sSelectedLob = oEvent.getSource().getParent().getAggregation("cells")[0].getProperty("value");
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
			this.getModel("LobUserSearchModel").setProperty("/esLob", arr2);
			//var sLob = this.getView().byId("sLObMultiSelectId");
			this.getModel("LobUserSearchModel").updateBindings(true);
			this.getModel("LobUserSearchModel").refresh();
			// this.setModel("LobUserSearchModel");
		},

		/*Value help search for SLOB Description based on SLOB Value Selected*/
		getSLOB_DesValueHelp: function () {

			var arr1 = [];
			arr1 = this.getModel("LobUserSearchModel").getProperty("/eLobUserSet");

			var sSelectedLob = sap.ui.getCore().byId(this.inputId).getValue();
			var arr2 = [];

			arr1.forEach(function (curr, index) {
				var sLobObj = {};
				if (curr.SLOB === sSelectedLob) {
					sLobObj.SLOB_DESCRIPTION = curr.SLOB_DESCRIPTION;
					arr2.push(sLobObj);

				}
			});

			var uniqueSLOB = [];
			jQuery.each(arr2, function (i, el) {
				if (jQuery.inArray(el, uniqueSLOB) === -1) uniqueSLOB.push(el);
			});
			this.getModel("LobUserSearchModel").setProperty("/esLob_Desc", uniqueSLOB);
			//var sLob = this.getView().byId("sLObMultiSelectId");
			this.getModel("LobUserSearchModel").updateBindings(true);
			this.getModel("LobUserSearchModel").refresh();
			// this.setModel("LobUserSearchModel");
		},

		/*On SLOB Dialog value help confirm.*/

		onHandleConfirmSLOB: function (oEvent) {
			if (this.inputId === this.getView().byId("multiSlobId")) {
				this.onHandleConfirmSLOBHeader(oEvent);
			} else {
				var aContexts = oEvent.getParameter("selectedContexts");

				if (aContexts && aContexts.length) {

					MessageToast.show("You have chosen " + aContexts.map(function (oContext) {
						return oContext.getObject().SLOB;
					}).join(", "));
					var value;
					var valueName;
					aContexts.map(function (oContext) {
						value = oContext.getObject().SLOB;
						valueName = oContext.getObject().SLOB_DESCRIPTION;
					});
				}

				var InputValue = sap.ui.getCore().byId(this.inputId);

				InputValue.setValue(value);
				var InputName = sap.ui.getCore().byId(this.Slob);
				InputName.setValue(valueName);
				this.getSLOB_DesValueHelp();
			}
			// this._oDialog3.close();
		},

		/*On SLOB Dialog value help confirm.*/

		onHandleConfirmSLOBHeader: function (oEvent) {
			var aContexts = oEvent.getParameter("selectedContexts");

			if (aContexts && aContexts.length) {

				MessageToast.show("You have chosen " + aContexts.map(function (oContext) {
					return oContext.getObject().SLOB;
				}).join(", "));
				var oValue = [];

				//var valueName;
				aContexts.map(function (oContext) {
					var token = new sap.m.Token();
					oValue.push(token.setText(oContext.getObject().SLOB));
					//valueName = oContext.getObject().SLOB_DESCRIPTION;
				});
			}

			var InputValue = this.getView().byId("multiSlobId");

			InputValue.setTokens(oValue);
			/*var InputName = sap.ui.getCore().byId(this.Slob);
			InputName.setValue(valueName);*/
			//this.getSLOB_DesValueHelp();
			// this._oDialog3.close();
		},

		/*On SLOB Dialog value help confirm.*/

		onHandleConfirmDocTyp: function (oEvent) {
			var aContexts = oEvent.getParameter("selectedContexts");

			if (aContexts && aContexts.length) {

				MessageToast.show("You have chosen " + aContexts.map(function (oContext) {
					return oContext.getObject().DOC_TYPE;
				}).join(", "));
				var value;
				aContexts.map(function (oContext) {
					value = oContext.getObject().DOC_TYPE;
				});
			}

			var InputValue = sap.ui.getCore().byId(this.inputId);
			InputValue.setValue(value);
			this.getDocTypValueHelp();
			// this._oDialog3.close();
		},

		/*On User Dialog value help cancel.*/
		onCloseDialog: function () {
			this._oDialog.close();
		},

		handleIconTabBarSelect: function (oEvent) {
			var selectedKey = oEvent.getParameter("key");

			if (selectedKey === "BeforeKey") {
				this.getView().byId("oBtnSave").setVisible(false);
				this.getView().byId("oBtnSubmit").setVisible(false);
				this.getView().byId("oBtnCancel").setVisible(false);
				this.getView().byId("b_home").setVisible(false);
				this.getView().byId("oBtnApprove").setVisible(false);
				this.getView().byId("oBtnReject").setVisible(false);
			}

			if (selectedKey === "AfterKey" || selectedKey === "Approver" || selectedKey === "Comment") {
				if (this.getOwnerComponent().getModel("headerUserModel").getProperty("/Status") === "Save") {
					this.getView().byId("b_home").setVisible(false);
				} else {
					if (window.top.location.href.toLowerCase().indexOf("fiorilaunchpad") == -1) {
						// S4R:PJAIN6:GWDK902351:07/22/2021:Seting visibility of home icon false:START
						// this.getView().byId("b_home").setVisible(true);
						this.getView().byId("b_home").setVisible(false);
						// S4R:PJAIN6:GWDK902351:07/22/2021:Seting visibility of home icon false:END
					}
				}

				this.buttonVisibility();
			}
		},

		callFragment: function () {
			if (!this.oFragment) {
				this.oFragment = sap.ui.xmlfragment("sony.finance.maintaince.app.Fragments.Approver_Table");
				return this.oFragment;
			}
		},

		addWatcher: function (oEvent) {
			var oTable = oEvent.getSource().getParent().getParent(),
				sItem = oTable.getSelectedItem();

			if (sItem) {
				var sIndex = oTable.getItems().indexOf(oTable.getSelectedItem()),
					cPosition = this.byId("ENTRY_SEQUENCE").getSelectedKey(),
					aRows = oTable.getItems();

				sIndex = (cPosition === "B") ? Number(sIndex) : Number(sIndex + 1);

				aRows.splice(sIndex, 0, {});
				var sCurrentUserName = sap.ushell.Container.getUser().getFullName();
				for (var i = 0; i < aRows.length; i++) {
					if (i === sIndex) {
						oTable.addItem(new sap.m.ColumnListItem({
							cells: [
								new sap.m.Text(),
								new sap.m.Input({
									showValueHelp: true,
									valueHelpOnly: true,
									valueHelpRequest: [this.valueHelpUser, this]
								}),
								new sap.m.Text({
									text: "WATCHER"
								}),
								new sap.m.Text(),
								new sap.m.Text(),
								new sap.m.Text(),
								new sap.m.CheckBox({
									enabled: false,
									selected: true
								}),
								new sap.m.Text({
									text: sCurrentUserName
								}),
								new sap.m.Text()
							]
						}));
					} else {
						oTable.addItem(aRows[i]);
					}
				}
			} else {
				MessageToast.show("Select record to add watcher.");
			}
		},

		deleteWatcher: function (oEvent) {
			var oTable = oEvent.getSource().getParent().getParent(),
				sItem = oTable.getSelectedItem();

			if (sItem) {
				if (sItem.getCells()[1].getMetadata().getName() === "sap.m.Input") {
					oTable.removeItem(sItem);
				} else {
					var sCurrentUser = sap.ushell.Container.getUser().getId();
					if (sItem.getModel().getProperty(sItem.getBindingContextPath()).CreatedBy === sCurrentUser) {
						if (sItem.getModel().getProperty(sItem.getBindingContextPath()).Manual) {
							oTable.removeItem(sItem);
						} else {
							MessageToast.show("You can only delete approver.");
						}
					} else {
						MessageToast.show("You cannot delete approver.");
					}
				}
			} else {
				MessageToast.show("Select record to delete watcher.");
			}

		},

		onCommentPost: function (oEvent) {
			var sCurrentUser = sap.ushell.Container.getUser().getId();
			var sCurrentUserName = sap.ushell.Container.getUser().getFullName();
			var sComment = oEvent.getParameter("value"),
				oEntry = {
					FORM_NO: this.Form_Num,
					CREATOR: sCurrentUser,
					CREATOR_NAME: sCurrentUserName,
					COMMENTS: sComment
				};
			var that = this;
			FinanceApproverModel.submitComment(oEntry, [new Filter("FORM_NO", FilterOperator.EQ, this.Form_Num)], that);
		},

		valueHelpUser: function (oEvent) {
			var oControl = oEvent.getSource();
			this.valueHelp = new sap.m.SelectDialog({
				title: "Select User",
				growing: true,
				growingThreshold: 20,
				noDataText: "No Data",
				search: [this.valueHelpUserSearch, this],
				confirm: [this.valueHelpUserConfirm, this],
				cancel: [this.valueHelpUserConfirm, this]
			});

			var oUserDataSet = this.getOwnerComponent().getModel("userSearchModel").getProperty("/eUserSet"),
				oModel = new JSONModel({
					"oControl": oControl,
					"results": oUserDataSet
				});

			oModel.setSizeLimit(oUserDataSet.length);
			this.valueHelp.setModel(oModel);
			this.valueHelp.bindAggregation("items", {
				path: "/results",
				template: new sap.m.StandardListItem({
					title: "{NAME}",
					description: "{USERID}"
				})
			});
			this.valueHelp.open();
		},

		valueHelpUserSearch: function (oEvent) {
			var sQuery = oEvent.getParameter("value"),
				oFilterUid = new Filter("USERID", FilterOperator.Contains, sQuery),
				oFilterUname = new Filter("NAME", FilterOperator.Contains, sQuery),
				oFilter = new Filter([oFilterUid, oFilterUname], false);

			oEvent.getSource().getBinding("items").filter(oFilter);
		},

		valueHelpUserConfirm: function (oEvent) {
			var sItem = oEvent.getParameter("selectedItem");
			if (sItem !== undefined) {
				var oControl = oEvent.getSource().getModel().getProperty("/oControl"),
					sId = sItem.getDescription(),
					sName = sItem.getTitle();

				oControl.data("sKey", sId);
				oControl.setValue(sName);
			}
		},

		refreshApprovers: function () {
			this.getApproverData([new Filter("EformNum", FilterOperator.EQ, this.Form_Num)]);
		},

		getApproverData: function (aFilters) {
			var that = this;
			FinanceApproverModel.getApproverData(aFilters, that);
		},

		getCommentData: function (aFilters) {
			var that = this;
			FinanceApproverModel.getCommentData(aFilters, that);
		},

		submitApproverData: function (sFormNo, cAction) {
			var aTableItems = this.byId("approvers").getItems(),
				oPayload = {
					CHANGE_ID: sFormNo,
					ACTION: cAction,
					eformApproversSet: []
				};
			var sCurrentUser = sap.ushell.Container.getUser().getId();
			var sCurrentUserName = sap.ushell.Container.getUser().getFullName();
			aTableItems.forEach(function (item, index) {
				var sPath = item.getBindingContextPath();
				if (sPath === undefined) {
					oPayload.eformApproversSet.push({
						AddedBy: sCurrentUser,
						Appr: item.getCells()[1].data("sKey"),
						Approved: "",
						ApprovedBy: "",
						ApprovedBy_name: "",
						ApprovedDt: "",
						ApprovedTm: "",
						CreatedBy: sCurrentUser,
						CreatedBy_name: sCurrentUserName,
						CreationDt: "",
						EformNum: sFormNo,
						Manual: true,
						ReviewerType: "WATCHER",
						Sequence: Number(index + 1),
						approver_name: item.getCells()[1].getValue()
					});
				} else {
					var oRowData = item.getModel().getProperty(sPath);
					oPayload.eformApproversSet.push({
						AddedBy: oRowData.AddedBy,
						Appr: oRowData.Appr,
						Approved: oRowData.Approved,
						ApprovedBy: oRowData.ApprovedBy,
						ApprovedBy_name: oRowData.ApprovedBy_name,
						ApprovedDt: oRowData.ApprovedDt,
						ApprovedTm: oRowData.ApprovedTm,
						CreatedBy: oRowData.CreatedBy,
						CreatedBy_name: oRowData.CreatedBy_name,
						CreationDt: oRowData.CreationDt,
						EformNum: oRowData.EformNum,
						Manual: oRowData.Manual,
						ReviewerType: oRowData.ReviewerType,
						Sequence: Number(index + 1),
						approver_name: oRowData.approver_name
					});
				}
			}.bind(this));
			FinanceApproverModel.submitApproverData(oPayload);
		},

		displayEmployees: function (oEvent) {
			var oEventHandler = oEvent,
				that = this,
				aFilter = [new Filter("FORM_TYP", FilterOperator.EQ, "FIA"), new Filter("ROLE", FilterOperator.EQ, oEventHandler.getSource().data(
					"sKey"))];
			FinanceApproverModel.getEmployee(aFilter, that, oEventHandler);
		},

		userValidity: function () {
			var aFilter = [new Filter("EFORM_NUM", FilterOperator.EQ, this.Form_Num)];
			return new Promise(function (resolve, reject) {
				this.getOwnerComponent().getModel("odataModel").read("/eFormValidateApprovals", {
					filters: aFilter,
					success: function (oData, oResponse) {
						resolve(oData);
					},
					error: function (oError) {
						reject(oError);
					}

				});
			}.bind(this));
		},

		buttonVisibility: function () {
			var tabKey = this.getView().byId("idIconTabBar").getSelectedKey();
			if (tabKey === "BeforeKey") {
				this.getView().byId("oBtnSave").setVisible(false);
			} else {
				this.getView().byId("oBtnSave").setVisible(true);
			}
			this.getView().byId("btnDelete").setVisible(false);
			this.getView().byId("btnEdit").setVisible(false);
			this.getView().byId("oBtnSubmit").setVisible(false);
			this.getView().byId("oBtnCancel").setVisible(false);
			this.getView().byId("oBtnApprove").setVisible(false);
			this.getView().byId("oBtnReject").setVisible(false);
			var sStatus = this.getOwnerComponent().getModel("headerUserModel").getProperty("/Status"),
				oSelModel = this.getOwnerComponent().getModel("selFormDataSet"),
				sRequestorId = oSelModel.getProperty("/REQUESTED_BY_ID"),
				sLoginId = sap.ushell.Container.getUser().getId();
			switch (sStatus) {
			case "Save":
				if (tabKey !== "BeforeKey") {
					if ((sRequestorId === sLoginId) && (this.Form_Num !== "" || this.Form_Num !== null || this.Form_Num !== undefined)) {
						this.getView().byId("btnEdit").setVisible(true);
						this.getView().byId("oBtnSubmit").setVisible(true);
						this.getView().byId("btnDelete").setVisible(true);
					}
				}
				break;
			case "In process":
				if (sRequestorId === sLoginId) {
					this.getView().byId("btnDelete").setVisible(true);
				}
				var isCurrentApprover = this.userValidity();
				isCurrentApprover.then(function (oData) {
					var sFlag = oData.results[0].MSG_TYPE;
					if (tabKey !== "BeforeKey") {
						if (sFlag === "S" && (sRequestorId === sLoginId)) {
							this.getView().byId("oBtnCancel").setVisible(true);
							this.getView().byId("oBtnApprove").setVisible(true);
							this.getView().byId("oBtnReject").setVisible(true);

						} else if (sFlag === "S" && (sRequestorId !== sLoginId)) {
							this.getView().byId("oBtnApprove").setVisible(true);
							this.getView().byId("oBtnReject").setVisible(true);
						} else if (sFlag === "E" && (sRequestorId === sLoginId)) {
							this.getView().byId("oBtnCancel").setVisible(true);
						}
					}
				}.bind(this));
				break;
			case "Completed":
				this.getView().byId("oBtnSave").setVisible(false);
				break;
			case "Rejected":
				if (tabKey !== "BeforeKey") {
					this.getView().byId("oBtnSave").setVisible(true);
				}
				if (sRequestorId === sLoginId) {
					this.getView().byId("btnDelete").setVisible(true);
				}
				break;
			case "withdraw":
				if (tabKey !== "BeforeKey") {
					this.getView().byId("btnEdit").setVisible(true);
				}
				if (sRequestorId === sLoginId) {
					this.getView().byId("btnDelete").setVisible(true);
				}
				break;
			}
		},

		onPressFormDelete: function () {
			var that = this;
			sap.m.MessageBox.confirm("Do you want to delete form?", {
				title: "Confirm Delete",
				actions: ["Yes", "No"],
				onClose: function (sActionClicked) {
					if (sActionClicked === "Yes") {
						var oDeleteOperation = that.deleteForm();
						oDeleteOperation.then(function (oData) {
							if (window.top.location.href.toLowerCase().indexOf("fiorilaunchpad") == -1) {
								if (window.close() === undefined) {
									window.close();
								}
								window.open("https://sharepoint.spe.sony.com/myspe/", "_self");
							} else {
								window.history.go(-1);
							}
						}.bind(that));
					}
				}
			});
		},

		deleteForm: function () {
			var sUrl = "/eformDeleteSet('" + this.Form_Num + "')",
				oBusy = this.getView().byId("busyDialog");
			oBusy.open();
			return new Promise(function (resolve, reject) {
				this.getOwnerComponent().getModel("odataModel").remove(sUrl, {
					success: function (oData, oResponse) {
						oBusy.close();
						resolve(oData);
					},
					error: function (oError) {
						oBusy.close();
						reject(oError);
					}

				});
			}.bind(this));
		},

		formaterUser: function (sId, sDesc) {
			if (sId !== undefined && sId !== null && sId !== "") {
				if (sDesc !== undefined || sDesc !== null || sDesc !== "") {
					return sDesc + " (" + sId + ")";
				} else {
					return sId;
				}
			} else {
				return "";
			}
		},

		onPressPrint: function () {
			var sHeaderContent, sBeforeContent, sAfterContent, sApproverContent, sCommentContent;

			sBeforeContent = this.getCodeForBeforeTable();
			sAfterContent = this.getCodeForAfterTable();
			sApproverContent = this.getCodeForApproverTable();
			sCommentContent = this.getCodeForCommentTable();
			sHeaderContent = "<body>" +
				"<center><H1>" + this.getView().byId("pageTitleId").getText() + "</H1></center>" +
				"<center><H2>" + this.getOwnerComponent().getModel("headerUserModel").getProperty("/Description") + "</H2></center><hr>";
			// "<table width='100%' style='text-align:center;border:1px solid black;'>" +
			// "<tr>" +
			// "<td style='text-align:center;border:1px solid black;'><b>Description</b></td>" +
			// "<td style='text-align:center;border:1px solid black;'>" +
			// this.getOwnerComponent().getModel("headerUserModel").getProperty("/Description") +
			// "</td>" +
			// "</tr>" +
			// "<tr>" +
			// "<td style='text-align:center;border:1px solid black;'><b>Preparer</b></td>" +
			// "<td style='text-align:center;border:1px solid black;'>" +
			// this.getOwnerComponent().getModel("selFormDataSet").getProperty("/REQUESTED_BY_ID") +
			// "</td>" +
			// "</tr>" +
			// "</table>";

			var oPrintWindow = window.open();
			oPrintWindow.document.write(sHeaderContent + sBeforeContent + sAfterContent + sApproverContent + sCommentContent + "</body>");
			oPrintWindow.print("", "Layout=Landscape");
		},

		getCodeForBeforeTable: function () {
			var sHeader, sContent = "",
				oTableData = this.byId("tableBefore").getItems();

			sHeader = "<H2>Before Change Table Entries</H2><table width='100%' style='text-align:center;border:1px solid black;'>" +
				"<thead><tr>" +
				"<th style='text-align:center;border:1px solid black;'>LOB</th>" +
				"<th style='text-align:center;border:1px solid black;'>Sub LOB</th>" +
				"<th style='text-align:center;border:1px solid black;'>Sub LOB Description</th>" +
				"<th style='text-align:center;border:1px solid black;'>FA</th>" +
				"<th style='text-align:center;border:1px solid black;'>User Name</th>" +
				"<th style='text-align:center;border:1px solid black;'>User Id</th>" +
				"</tr></thead>";

			if (oTableData.length > 0) {
				oTableData.forEach(function (item, index) {
					sContent = sContent +
						"<tr>" +
						"<td style='text-align:center;border:1px solid black;'>" + item.getCells()[0].getText() + "</td>" +
						"<td style='text-align:center;border:1px solid black;'>" + item.getCells()[1].getText() + "</td>" +
						"<td style='text-align:center;border:1px solid black;'>" + item.getCells()[2].getText() + "</td>" +
						"<td style='text-align:center;border:1px solid black;'>" + item.getCells()[3].getText() + "</td>" +
						"<td style='text-align:center;border:1px solid black;'>" + item.getCells()[4].getText() + "</td>" +
						"<td style='text-align:center;border:1px solid black;'>" + item.getCells()[5].getText() + "</td>" +
						"</tr>";
				}.bind(this));
			}

			return sHeader + sContent + "</table><br/>";
		},

		getCodeForAfterTable: function () {
			var sHeader, sContent = "",
				oTableData = this.byId("userTableId").getItems();

			sHeader = "<H2>After Change Table Entries</H2><table width='100%' style='text-align:center;border:1px solid black;'>" +
				"<thead><tr>" +
				"<th style='text-align:center;border:1px solid black;'>LOB</th>" +
				"<th style='text-align:center;border:1px solid black;'>Sub LOB</th>" +
				"<th style='text-align:center;border:1px solid black;'>Sub LOB Description</th>" +
				"<th style='text-align:center;border:1px solid black;'>FA</th>" +
				"<th style='text-align:center;border:1px solid black;'>User Name</th>" +
				"<th style='text-align:center;border:1px solid black;'>User Id</th>" +
				"<th style='text-align:center;border:1px solid black;'>Previous User</th>" +
				"<th style='text-align:center;border:1px solid black;'>Change Flag</th>" +
				"<th style='text-align:center;border:1px solid black;'>Lock Flag</th>" +
				"</tr></thead>";

			if (oTableData.length > 0) {
				oTableData.forEach(function (item, index) {
					sContent = sContent +
						"<tr>" +
						"<td style='text-align:center;border:1px solid black;'>" + item.getCells()[0].getValue() + "</td>" +
						"<td style='text-align:center;border:1px solid black;'>" + item.getCells()[1].getValue() + "</td>" +
						"<td style='text-align:center;border:1px solid black;'>" + item.getCells()[2].getValue() + "</td>" +
						"<td style='text-align:center;border:1px solid black;'>" + item.getCells()[3].getValue() + "</td>" +
						"<td style='text-align:center;border:1px solid black;'>" + item.getCells()[4].getValue() + "</td>" +
						"<td style='text-align:center;border:1px solid black;'>" + item.getCells()[5].getValue() + "</td>" +
						"<td style='text-align:center;border:1px solid black;'>" + item.getCells()[6].getText() + "</td>" +
						"<td style='border:1px solid black;text-align:center;'>" + ((item.getCells()[7].getVisible()) ? "X" : "") + "</td>" +
						"<td style='border:1px solid black;text-align:center;'>" + ((item.getCells()[8].getVisible()) ? "X" : "") + "</td>" +
						"</tr>";
				}.bind(this));
			}

			return sHeader + sContent + "</table><br/>";
		},

		getCodeForApproverTable: function () {
			var sHeader, sContent = "",
				oTableData = this.byId("approvers").getItems();

			sHeader = "<H2>Approval Flow</H2><table width='100%' style='text-align:center;border:1px solid black;'>" +
				"<thead><tr>" +
				"<th style='text-align:center;border:1px solid black;'>Approved/Rejected</th>" +
				"<th style='text-align:center;border:1px solid black;'>Approver</th>" +
				"<th style='text-align:center;border:1px solid black;'>Reviewer Type</th>" +
				"<th style='text-align:center;border:1px solid black;'>Approved By</th>" +
				"<th style='text-align:center;border:1px solid black;'>Date</th>" +
				"<th style='text-align:center;border:1px solid black;'>Time (PST)</th>" +
				"<th style='text-align:center;border:1px solid black;'>Manually Added</th>" +
				"<th style='text-align:center;border:1px solid black;'>Added By</th>" +
				"<th style='text-align:center;border:1px solid black;'>Added On</th>" +
				"</tr></thead>";

			if (oTableData.length > 0) {
				oTableData.forEach(function (item, index) {
					var oControl = item.getCells()[1];
					sContent = sContent +
						"<tr>" +
						"<td style='text-align:center;border:1px solid black;'>" + item.getCells()[0].getText() + "</td>" +
						"<td style='text-align:center;border:1px solid black;'>" +
						((oControl.getMetadata().getName() === "sap.m.Input") ? oControl.getValue() : oControl.getText()) +
						"</td>" +
						"<td style='text-align:center;border:1px solid black;'>" + item.getCells()[2].getText() + "</td>" +
						"<td style='text-align:center;border:1px solid black;'>" + item.getCells()[3].getText() + "</td>" +
						"<td style='text-align:center;border:1px solid black;'>" + item.getCells()[4].getText() + "</td>" +
						"<td style='text-align:center;border:1px solid black;'>" + item.getCells()[5].getText() + "</td>" +
						"<td style='border:1px solid black;text-align:center;'>" + ((item.getCells()[6].getSelected()) ? "X" : "") + "</td>" +
						"<td style='text-align:center;border:1px solid black;'>" + item.getCells()[7].getText() + "</td>" +
						"<td style='text-align:center;border:1px solid black;'>" + item.getCells()[8].getText() + "</td>" +
						"</tr>";
				}.bind(this));
			}

			return sHeader + sContent + "</table><br/>";
		},

		getCodeForCommentTable: function () {
			var sHeader, sContent = "",
				oTableData = this.byId("commentList").getItems();

			sHeader = "<H2>Comments</H2>" +
				"<table width='100%' style='text-align:center;border:1px solid black;'>" +
				"<thead><tr>" +
				"<th style='text-align:center;border:1px solid black;'>Comment</th>" +
				"<th style='text-align:center;border:1px solid black;'>Time</th>" +
				"<th style='text-align:center;border:1px solid black;'>Added By</th>" +
				"</tr></thead>";

			if (oTableData.length > 0) {
				oTableData.forEach(function (item, index) {
					sContent = sContent +
						"<tr>" +
						"<td style='text-align:center;border:1px solid black;'>" + item.getText() + "</td>" +
						"<td style='text-align:center;border:1px solid black;'>" + item.getTimestamp() + "</td>" +
						"<td style='text-align:center;border:1px solid black;'>" + item.getSender() + "</td>" +
						"</tr>";
				}.bind(this));
			}

			return sHeader + sContent + "</table><br/><hr>";
		}

	});
});