 sap.ui.define([
 	"sap/ui/core/mvc/Controller",
 	"sap/m/MessageToast",
 	"sap/ui/model/json/JSONModel",
 	"sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/m/MessageBox", "sap/ui/core/routing/History"
 ], function (Controller, MessageToast, JSONModel, Filter, FilterOperator, MessageBox, History) {
 	"use strict";
 	var selectDirection = "";
 	var selectEpisodic = false;
 	var selectProdType = "";
 	var selectChartOfAcc = "";
 	return Controller.extend("com.spe.gpas.YGPAS_API.controller.EditLicense", {

 		onInit: function () {
 			this._component = this.getOwnerComponent();
 			this._oView = this.getView();
 			this._serverModel = this._component.getModel("oDataModel");
 			var headerUserModel = new JSONModel();
 			var outboundSapToLasModel = new JSONModel();
 			var inboundLasToSapModel = new JSONModel();
 			this._component.setModel(headerUserModel, "headerUserModel");
 			this._component.setModel(outboundSapToLasModel, "outboundSapToLasModel");
 			this._component.setModel(inboundLasToSapModel, "inboundLasToSapModel");

 			// this.getView().byId("holId").setSelectedIndex(null);
 			this.getView().byId("Production_Type").setSelectedIndex(null);
 			this.getView().byId("Chart_of_Account").setSelectedIndex(null);
 			this.getView().byId("directionID").setSelectedIndex(null);
 			//this.getView().byId("statusID").setSelectedIndex(null);
 			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
 			oRouter.attachRouteMatched(this._onObjectMatched, this);
 		},
 		_onObjectMatched: function (oEvent) {

 			var licNo = oEvent.getParameters().arguments.context;
 			var action = oEvent.getParameters().name;

 			if (action === "EditLicenseView") {
 				this.getView().byId("save").setVisible(false);
 				this.getHeaderData(licNo, action);

 			} else if (action === "EditLicense") {
 				this.getView().byId("save").setVisible(true);
 				this.getHeaderData(licNo, action);

 			} else if (action === "EditLicenseNew") {

 				this.getView().byId("from").setValue("");
 				this.getView().byId("To").setValue("");
 				this.getView().byId("Add").setValue("");
 				//To clear fields and set to defaults
 				this._component.setModel(new JSONModel(), "headerUserModel");
 				this._component.setModel(new JSONModel(), "outboundSapToLasModel");
 				this._component.setModel(new JSONModel(), "inboundLasToSapModel");
 				this.getView().byId("Accounting_Package").setSelectedKey('A');
 				this.getView().byId("sstatus").setSelectedKey('A');
 				this.getView().byId("lstatus").setSelectedKey('A');

 				//Fields Visibility
 				this.getView().byId("save").setVisible(true);

 				this.getView().byId("Production_Type").setSelectedIndex(0);
 				selectProdType = 'F';
 				if (this.getView().byId("Production_Type").getSelectedIndex() == 0) {
 					this._component.getModel("headerUserModel").setProperty("/is_coa_enabled", false);
 					this._component.getModel("headerUserModel").setProperty("/is_cp_enabled", false);
 				} else {
 					this._component.getModel("headerUserModel").setProperty("/is_coa_enabled", true);
 					this._component.getModel("headerUserModel").setProperty("/is_cp_enabled", true);
 				}
 				this._component.getModel("headerUserModel").setProperty(0, "/PROD_TYPE");

 				this.getView().byId("Chart_of_Account").setSelectedIndex(0);
 				selectChartOfAcc = 'S';
 				this._component.getModel("headerUserModel").setProperty(0, "/CHART_OF_ACC");

 				selectDirection = 'O';
 				this.byId("tblRecipient1").setVisible(false);
 				this.byId("tblRecipient").setVisible(true);

 				this.getView().byId("directionID").setSelectedIndex(0);
 				this._component.getModel("headerUserModel").setProperty(0, "/DIRECTION");

 				selectEpisodic = true;
 				this.byId("range").setVisible(false);
 				this.byId("from").setVisible(false);
 				this.byId("To").setVisible(false);
 				this.byId("addrange").setVisible(false);
 				this.byId("single").setVisible(true);
 				this.byId("add").setVisible(true);
 				this.byId("Add").setVisible(true);
 				//this.getView().byId("holId").setSelectedIndex(0);
 				this._component.getModel("headerUserModel").setProperty(0, "/IS_EPISODIC");
 				this._component.getModel("headerUserModel").setProperty("/is_enabled", true);
 				this._component.getModel("headerUserModel").setProperty("/is_lic_enabled", true);

 			} else {

 				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
 				oRouter.navTo("default");
 			}
 		},
 		getHeaderData: function (licNo, action) {
 			if (licNo !== "" && licNo !== undefined) {
 				var n = new Filter("LICENSE_NO", FilterOperator.EQ, licNo);
 				var myFilter = [];
 				myFilter.push(n);
 				var that = this;
 				this._serverModel.read("/GL_PRD_HEADERSet", {
 					filters: myFilter,
 					success: function (oData) {
 						if (oData.results.length > 0) {
 							var data = oData.results;
 							var header = {
 								LICENSE_NO: data[0].LICENSE_NO,
 								PROD_NAME: data[0].PROD_NAME,
 								PROD_TYPE: data[0].PROD_TYPE === 'F' ? 0 : 1,
 								CHECK_PREFIX:data[0].CHECK_PREFIX,
 								ACC_PKG: data[0].ACC_PKG,
 								CHART_OF_ACC: data[0].CHART_OF_ACC === 'S' ? 0 : 1,
 								STATUS: data[0].STATUS,
 								STATUS_O: data[0].STATUS_O,
 								IS_EPISODIC: data[0].IS_EPISODIC === true ? 0 : 1,
 								PROD_DESC: data[0].PROD_DESC,
 								DIRECTION: 0,
 								is_enabled: action === "EditLicenseView" ? false : true,
 								is_lic_enabled: false,
 								is_coa_enabled: (data[0].PROD_TYPE === 'F' || action === "EditLicenseView") ? false : true,
 								is_cp_enabled: (data[0].PROD_TYPE === 'F' || action === "EditLicenseView") ? false : true
 							};
 							selectProdType = data[0].PROD_TYPE;
 							selectChartOfAcc = data[0].CHART_OF_ACC;
 							selectEpisodic = data[0].IS_EPISODIC;
 							selectDirection = 'O';

 							if (selectDirection === 'O') {
 								that.byId("tblRecipient1").setVisible(false);
 								that.byId("tblRecipient").setVisible(true);
 							} else {
 								that.byId("tblRecipient1").setVisible(true);
 								that.byId("tblRecipient").setVisible(false);
 							}

 							if (selectEpisodic === true) {
 								that.byId("range").setVisible(true);
 								that.byId("from").setVisible(true);
 								that.byId("To").setVisible(true);
 								that.byId("addrange").setVisible(true);
 								that.byId("single").setVisible(false);
 								that.byId("add").setVisible(false);
 								that.byId("Add").setVisible(false);
 							} else {
 								that.byId("range").setVisible(false);
 								that.byId("from").setVisible(false);
 								that.byId("To").setVisible(false);
 								that.byId("addrange").setVisible(false);
 								that.byId("single").setVisible(true);
 								that.byId("add").setVisible(true);
 								that.byId("Add").setVisible(true);
 							}
 							if (selectProdType === 'F') {
 								//that.getView().byId("Chart_of_Account").setEnabled(false);
 								that.byId("range").setVisible(false);
 								that.byId("from").setVisible(false);
 								that.byId("To").setVisible(false);
 								that.byId("addrange").setVisible(false);
 								that.byId("single").setVisible(true);
 								that.byId("add").setVisible(true);
 								that.byId("Add").setVisible(true);
 							}

 						} else {
 							//that.getView().byId("Chart_of_Account").setEnabled(true);
 							that.byId("range").setVisible(true);
 							that.byId("from").setVisible(true);
 							that.byId("To").setVisible(true);
 							that.byId("addrange").setVisible(true);
 							that.byId("single").setVisible(false);
 							that.byId("add").setVisible(false);
 							that.byId("Add").setVisible(false);
 						}

 						that._component.getModel("headerUserModel").setData(header);
 						that.getItemTablesData(data[0].LICENSE_NO, action);
 					},

 					error: function (error) {
 						console.log("Data Error...." + error);
 					}
 				});
 			}

 		},

 		getItemTablesData: function (LICENSE_NO, action) {

 			var inboundURL = "/GL_PRD_INBOUNDSet";
 			var outboundURL = "/GL_PRD_OUTBOUNDSet";
 			var that = this;
 			var licenseNo = LICENSE_NO;
 			var aFilter = [];
 			var oFilter = new Filter("LICENSE_NO", FilterOperator.EQ, licenseNo);
 			aFilter.push(oFilter);
 			this._serverModel.read(inboundURL, {
 				filters: aFilter,
 				success: function (data) {
 					var aDataSet = [];
 					data.results.forEach(function (item, index) {
 						aDataSet.push({
 							STATUS: item.STATUS,
 							GL_RPOD_ID: item.GL_RPOD_ID,
 							PROJ_EXT: item.PROJ_EXT,
 							MPM: item.MPM,
 							is_enabled: action === "EditLicenseView" ? false : true

 						});
 					});
 					that._component.getModel("inboundLasToSapModel").setData(aDataSet);
 				}
 			});
 			this._serverModel.read(outboundURL, {
 				filters: aFilter,
 				success: function (data) {
 					var aDataSet = [];
 					data.results.forEach(function (item, index) {
 						aDataSet.push({
 							STATUS: item.STATUS,
 							GL_RPOD_ID: item.GL_RPOD_ID,
 							PROJ_EXT: item.PROJ_EXT,
 							MPM: item.MPM,
 							is_enabled: action === "EditLicenseView" ? false : true,

 						});
 					});
 					that._component.getModel("outboundSapToLasModel").setData(aDataSet);
 				}
 			});
 		},
 		inboundLasToSapFactory: function (sId, oContext) {
 			var oTemplate = new sap.m.ColumnListItem({
 				cells: [
 					new sap.m.Text({
 						text: "{inboundLasToSapModel>GL_RPOD_ID}"
 					}),
 					new sap.m.Input({
 						enabled: "{inboundLasToSapModel>is_enabled}",
 						value: "{inboundLasToSapModel>PROJ_EXT}",
 						showValueHelp: true,
 						valueHelpRequest: [this.onHandleSapProjectValueHelp, this]

 					}),
 					new sap.m.Input({
 						enabled: "{inboundLasToSapModel>is_enabled}",
 						value: "{inboundLasToSapModel>MPM}"
 					})
 				]
 			});
 			return oTemplate;
 		},
 		outboundSapToLasFactory: function (sId, oContext) {

 			var oTemplate = new sap.m.ColumnListItem({
 				cells: [
 					new sap.m.Text({
 						text: "{outboundSapToLasModel>GL_RPOD_ID}"
 					}),
 					new sap.m.Input({
 						enabled: "{outboundSapToLasModel>is_enabled}",
 						value: "{outboundSapToLasModel>PROJ_EXT}",
 						showValueHelp: true,
 						valueHelpRequest: [this.onHandleSapProjectValueHelp, this]
 					}),
 					new sap.m.Input({
 						enabled: "{outboundSapToLasModel>is_enabled}",
 						value: "{outboundSapToLasModel>MPM}"
 					})
 				]
 			});
 			return oTemplate;
 		},
 		onHandleSapProjectValueHelp: function (oEvent) {
 			var b = oEvent.getSource().getParent().getBindingContextPath();

 			this.sPath = b;
 			var that = this;
 			var sUserUrl = "/Yfpsish0389ProjectSet";
 			this.getOwnerComponent().getModel("oDataModel").read(sUserUrl, {

 				success: function (data) {
 					var data = {
 						project: data.results
 					};
 					var osap_projectModel = new JSONModel();
 					osap_projectModel.setData(data);
 					that._component.setModel(osap_projectModel, "osap_projectModel");
 					if (!that._oDialog6) {
 						that._oDialog6 = sap.ui.xmlfragment("com.spe.gpas.YGPAS_API.view.sap_project", that);
 						that._oDialog6.setModel(that.getView().getModel("osap_projectModel"));
 						that.getView().addDependent(that._oDialog6);
 					}
 					that._oDialog6.setMultiSelect(false);
 					that._oDialog6.open();

 				},
 				error: function (error) {}
 			});
 		},
 		handleSearch: function (oEvent) {
 			var aFilter = [];
 			var sValue = oEvent.getParameter("value");
 			var oProjectdefFilter = new Filter("PSPNR", FilterOperator.Contains, sValue),
 				oprojectDescFilter = new Filter("POST1", FilterOperator.Contains, sValue);
 			aFilter.push(new Filter([oProjectdefFilter, oprojectDescFilter], false));

 			var oList = oEvent.getSource();
 			var oBinding = oList.getBinding("items");
 			oBinding.filter(aFilter);
 			sValue = "";
 		},

 		onHandleConfirmProject: function (oEvent) {

 			var aContexts = oEvent.getParameter("selectedContexts");
 			if (aContexts && aContexts.length) {
 				var projectDef,

 					projectDesc;

 				aContexts.map(function (oContext) {
 					projectDef = oContext.getObject().PSPNR;

 					projectDesc = oContext.getObject().POST1;

 				});
 				if (selectDirection == 'O') {
 					this._component.getModel("outboundSapToLasModel").setProperty(this.sPath + "/PROJ_EXT", projectDef);
 				} else {
 					this._component.getModel("inboundLasToSapModel").setProperty(this.sPath + "/PROJ_EXT", projectDef);
 				}
 			}

 		},
 		onPressSaveBtn: function (oEvent) {
 			var licenseNo = this._component.getModel("headerUserModel").getProperty("/LICENSE_NO");
 			var prodName = this._component.getModel("headerUserModel").getProperty("/PROD_NAME");
 			var prodType = this._component.getModel("headerUserModel").getProperty("/PROD_TYPE");
 			var accPackage = this._component.getModel("headerUserModel").getProperty("/ACC_PKG");
 			var chartOfAcc = this._component.getModel("headerUserModel").getProperty("/CHART_OF_ACC");
 			var isEpisodic = this._component.getModel("headerUserModel").getProperty("/IS_EPISODIC");
 			var status = this._component.getModel("headerUserModel").getProperty("/STATUS");
 			var status_o = this._component.getModel("headerUserModel").getProperty("/STATUS_O");
 			var check_prefix = this._component.getModel("headerUserModel").getProperty("/CHECK_PREFIX");
 			var oFormItem = {};

 			oFormItem.LICENSE_NO = licenseNo;
 			oFormItem.PROD_NAME = prodName;
 			oFormItem.CHECK_PREFIX = check_prefix;
 			oFormItem.PROD_TYPE = prodType === 1 ? 'T' : 'F';
 			oFormItem.ACC_PKG = (accPackage === undefined ? 'A' : accPackage) + '';
 			oFormItem.CHART_OF_ACC = chartOfAcc === 1 ? 'C' : 'S';
 			oFormItem.IS_EPISODIC = isEpisodic === 1 ? false : true;

 			oFormItem.STATUS = status;
 			oFormItem.STATUS_O = status_o;

 			oFormItem.GL_PRD_OUTBOUNDSet = [];
 			oFormItem.GL_PRD_INBOUNDSet = [];

 			var outboundSapToLasModel = this._component.getModel("outboundSapToLasModel").getData();
 			var inboundLasToSapModel = this._component.getModel("inboundLasToSapModel").getData();

 			for (var i = 0; i < outboundSapToLasModel.length; i++) {
 				var D = {};
 				D.LICENSE_NO = licenseNo;
 				// D.STATUS = outboundSapToLasModel[i].STATUS;
 				D.GL_RPOD_ID = outboundSapToLasModel[i].GL_RPOD_ID + '';
 				D.PROJ_EXT = outboundSapToLasModel[i].PROJ_EXT;
 				D.MPM = outboundSapToLasModel[i].MPM;
 				oFormItem.GL_PRD_OUTBOUNDSet[i] = D;
 			}

 			for (var j = 0; j < inboundLasToSapModel.length; j++) {
 				var D1 = {};
 				D1.LICENSE_NO = licenseNo;
 				// D1.STATUS = inboundLasToSapModel[j].STATUS;
 				D1.GL_RPOD_ID = inboundLasToSapModel[j].GL_RPOD_ID + '';
 				D1.PROJ_EXT = inboundLasToSapModel[j].PROJ_EXT;
 				D1.MPM = inboundLasToSapModel[j].MPM;
 				oFormItem.GL_PRD_INBOUNDSet[j] = D1;
 			}

 			var that = this;
 			this._serverModel.create("/GL_PRD_HEADERSet", oFormItem, {
 				async: false,
 				success: function (response) {
 					MessageBox.show(
 						"License details saved successfully",
 						MessageBox.Icon.SUCCESS,
 						"Success"
 					);
 					that.getHeaderData(licenseNo);
 				},
 				error: function (error) {
 					var response = JSON.parse(error.responseText);
 					MessageBox.show(
 						response.error.message.value,
 						MessageBox.Icon.ERROR,
 						"Error"
 					);
 				}

 			});
 		},

 		onExpRadio1: function (oEvent) {
 			// if (oEvent.getParameters().selectedIndex === 0) {
 			// 	this.byId("range").setVisible(true);
 			// 	this.byId("from").setVisible(true);
 			// 	this.byId("To").setVisible(true);
 			// 	this.byId("addrange").setVisible(true);
 			// 	this.byId("single").setVisible(false);
 			// 	this.byId("add").setVisible(false);
 			// 	this.byId("Add").setVisible(false);
 			// 	selectEpisodic = true;

 			// } else if (oEvent.getParameters().selectedIndex === 1) {
 			// 	this.byId("range").setVisible(false);
 			// 	this.byId("from").setVisible(false);
 			// 	this.byId("To").setVisible(false);
 			// 	this.byId("addrange").setVisible(false);
 			// 	this.byId("single").setVisible(true);
 			// 	this.byId("add").setVisible(true);
 			// 	this.byId("Add").setVisible(true);
 			// 	selectEpisodic = false;
 			// }
 		},
 		onSelectDirection: function (oEvent) {
 			if (oEvent.getParameters().selectedIndex === 0) {
 				selectDirection = 'O';
 				this.byId("tblRecipient1").setVisible(false);
 				this.byId("tblRecipient").setVisible(true);
 			} else if (oEvent.getParameters().selectedIndex === 1) {
 				selectDirection = 'I';
 				this.byId("tblRecipient1").setVisible(true);
 				this.byId("tblRecipient").setVisible(false);
 			}
 		},

 		onChartOfAccRadio: function (oEvent) {
 			if (oEvent.getParameters().selectedIndex === 0) {
 				selectChartOfAcc = 'S';
 			} else if (oEvent.getParameters().selectedIndex === 1) {
 				selectChartOfAcc = 'C';
 			}

 		},
 		// onSelectStatus: function (oEvent) {
 		// 	if (oEvent.getParameters().selectedIndex === 0) {
 		// 		selectStatus = 'A';
 		// 	} else if (oEvent.getParameters().selectedIndex === 1) {
 		// 		selectStatus = 'I';
 		// 	}

 		// },
 		onProdTypeRadio: function (oEvent) {
 			if (oEvent.getParameters().selectedIndex === 0) {
 				selectProdType = 'F';
 				this.getView().byId("Chart_of_Account").setSelectedIndex(0);
 				//this.getView().byId("Chart_of_Account").setEnabled(false);
 				this._component.getModel("headerUserModel").setProperty("/is_coa_enabled", false);
 				this._component.getModel("headerUserModel").setProperty("/is_cp_enabled", false);
 				this.byId("range").setVisible(false);
 				this.byId("from").setVisible(false);
 				this.byId("To").setVisible(false);
 				this.byId("addrange").setVisible(false);
 				this.byId("single").setVisible(true);
 				this.byId("add").setVisible(true);
 				this.byId("Add").setVisible(true);
 				selectEpisodic = false;

 			} else if (oEvent.getParameters().selectedIndex === 1) {
 				selectProdType = 'T';
 				this.getView().byId("Chart_of_Account").setEnabled(true);
 				this._component.getModel("headerUserModel").setProperty("/is_cp_enabled", true);
 				this.byId("range").setVisible(true);
 				this.byId("from").setVisible(true);
 				this.byId("To").setVisible(true);
 				this.byId("addrange").setVisible(true);
 				this.byId("single").setVisible(false);
 				this.byId("add").setVisible(false);
 				this.byId("Add").setVisible(false);
 				selectEpisodic = true;
 			}

 		},

 		addRange: function (oEvent) {

 			var from = this.byId("from").getProperty("value");
 			var To = this.byId("To").getProperty("value");
 			var flag = from;
 			var fromChar = from.charAt(0);
 			var toChar = To.charAt(0);
 			var isChar = false;
 			if (fromChar.toUpperCase() != from.toLowerCase() && toChar.toUpperCase() != toChar.toLowerCase()) {
 				from = from.slice(1, from.length + 1);
 				To = To.slice(1, To.length + 1);
 				from = parseInt(from);
 				To = parseInt(To);
 				isChar = true;
 				if (from.toString().length < 5) {
 					//iszeroes = true;
 					flag = flag.slice(0, (6 - from.toString().length));
 					fromChar = flag;

 				}
 				isChar = true;
 			}
 			from = parseInt(from);
 			To = parseInt(To);
 			if (from === "" && To === "") {
 				this.byId("from").setValueState("Error");
 				this.byId("To").setValueState("Error");
 				MessageToast.show("Please enter values in the field");
 			} else if (from === "" || To === "") {
 				if (from === "") {
 					MessageToast.show("Please add From value");
 					this.byId("from").setValueState("Error");

 				} else {
 					MessageToast.show("Please add To value");
 					this.byId("To").setValueState("Error");
 				}
 			} else if (parseInt(from) > parseInt(To)) {
 				MessageToast.show("Please add correct range");
 				this.byId("from").setValueState("Error");
 				this.byId("To").setValueState("Error");
 			} else if (To - from > 50) {
 				MessageToast.show("Maximum range of 50 can be added");
 				this.byId("from").setValueState("Error");
 				this.byId("To").setValueState("Error");
 			} else {
 				this.byId("from").setValueState("None");
 				this.byId("To").setValueState("None");
 				var temp = parseInt(from);
 				var tempa = parseInt(from);
 				var from = parseInt(from);
 				var To = parseInt(To);
 				var table1 = this.getView().byId("tblRecipient");
 				var table = this.getView().byId("tblRecipient1");
 				var msg = 'Range added';
 				MessageToast.show(msg);

 				//LAS to SAP data add
 				if (selectDirection === 'I') {
 					this.byId("tblRecipient1").setVisible(true);
 					this.byId("tblRecipient").setVisible(false);
 					for (var i = from; i <= To; i++) {
 						var lasToSapmodel = this._component.getModel("inboundLasToSapModel");
 						var oDataSet = lasToSapmodel.getData();
 						var sIndex = oDataSet.length;
 						if (sIndex === undefined) {
 							oDataSet = [];
 						}
 						oDataSet.splice(sIndex, 0, {
 							GL_RPOD_ID: isChar === true ? fromChar + temp++ : temp++,
 							PROJ_EXT: "",
 							MPM: ""
 						});
 						if (temp.toString().length > from.toString().length) {
 							fromChar = fromChar.slice(0, 6 - (temp.toString().length));
 						}
 						this.getView().getModel("inboundLasToSapModel").setData(oDataSet);

 					}
 				}

 				//SAP TO LAS data add
 				if (selectDirection === 'O') {
 					this.byId("tblRecipient1").setVisible(false);
 					this.byId("tblRecipient").setVisible(true);
 					for (var j = from; j <= To; j++) {
 						var sapToLasmodel = this._component.getModel("outboundSapToLasModel");
 						var oDataSet1 = sapToLasmodel.getData();
 						var sIndex1 = oDataSet1.length;
 						if (sIndex1 === undefined) {
 							oDataSet1 = [];
 						}
 						oDataSet1.splice(sIndex1, 0, {
 							GL_RPOD_ID: isChar === true ? fromChar + temp++ : temp++,
 							PROJ_EXT: "",
 							MPM: ""
 						});
 						if (temp.toString().length > from.toString().length) {
 							fromChar = fromChar.slice(0, 6 - (temp.toString().length));
 						}
 						this.getView().getModel("outboundSapToLasModel").setData(oDataSet1);
 					}
 				}

 			}
 			this.byId("from").setValue("");
 			this.byId("To").setValue("");
 		},
 		onAdd: function () {
 			var add = this.byId("Add").getProperty("value");
 			// var iconTab = this.getView().byId("idIconTabBar");
 			if (add == "") {
 				this.byId("Add").setValueState("Error");
 				MessageToast.show("Please enter value");
 			} else {

 				//LAS to SAP data add
 				if (selectDirection === 'I') {
 					this.byId("tblRecipient1").setVisible(true);
 					this.byId("tblRecipient").setVisible(false);
 					var lasToSapmodel = this._component.getModel("inboundLasToSapModel");
 					var oDataSet = lasToSapmodel.getData();
 					var sIndex = oDataSet.length;
 					if (sIndex === undefined) {
 						oDataSet = [];
 					}
 					oDataSet.splice(sIndex, 0, {
 						GL_RPOD_ID: add,
 						PROJ_EXT: "",
 						MPM: ""
 					});
 					this.getView().getModel("inboundLasToSapModel").setData(oDataSet);
 				}

 				//SAP TO LAS data add
 				if (selectDirection === 'O') {
 					this.byId("tblRecipient1").setVisible(false);
 					this.byId("tblRecipient").setVisible(true);
 					var sapToLasmodel = this._component.getModel("outboundSapToLasModel");
 					var oDataSet1 = sapToLasmodel.getData();
 					var sIndex1 = oDataSet1.length;
 					if (sIndex1 === undefined) {
 						oDataSet1 = [];
 					}
 					oDataSet1.splice(sIndex1, 0, {
 						GL_RPOD_ID: add,
 						PROJ_EXT: "",
 						MPM: ""
 					});
 					this.getView().getModel("outboundSapToLasModel").setData(oDataSet1);
 				}
 			}
 			this.byId("Add").setValue("");
 		},
 		onDeleteInboundLasToSap: function (oEvent) {
 			//This code was generated by the layout editor.
 			var oParent = oEvent.getSource().getParent();
 			var oPar_Parent = oParent.getParent().sId;
 			var oTableId = sap.ui.getCore().byId(oPar_Parent);
 			var selected_item = oTableId.getSelectedItem();
 			var array = this.getView().getModel("inboundLasToSapModel").getData();
 			var array2 = [];

 			//deleting mannually added items

 			var sContext = selected_item.getBindingContextPath();

 			array2 = array.splice(sContext.substr(1), 1);
 			this.getView().getModel("inboundLasToSapModel").setData(array);
 		},
 		onDeleteOutboundSapToLas: function (oEvent) {
 			//This code was generated by the layout editor.
 			var oParent = oEvent.getSource().getParent();
 			var oPar_Parent = oParent.getParent().sId;
 			var oTableId = sap.ui.getCore().byId(oPar_Parent);
 			var selected_item = oTableId.getSelectedItem();
 			var array = this.getView().getModel("outboundSapToLasModel").getData();
 			var array2 = [];

 			//deleting mannually added items

 			var sContext = selected_item.getBindingContextPath();

 			array2 = array.splice(sContext.substr(1), 1);
 			this.getView().getModel("outboundSapToLasModel").setData(array);
 		},
 		onCancel: function (oEvent) {
 			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
 			oRouter.navTo("default");

 		}

 	});

 });