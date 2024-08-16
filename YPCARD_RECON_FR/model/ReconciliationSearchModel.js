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
			initialize: function (oDataModel, component, oView) {

				this._serverModel = oDataModel;
				//this._resourceBundle = resourceBundle;
				this._component = component;
				this._View = oView;
				//REQ0730972:DPATEL11:FPDK900050:22/12/2021:Enhance Fiori Eforms to showLOB/SubLOB Name with Description:START
				var oHeaderModel = new JSONModel();
				var headerData = {
						LOB: ""
				};
				oHeaderModel.setData(headerData);
				this._component.setModel(oHeaderModel, "headerUserModel");
				//REQ0730972:DPATEL11:FPDK900050:22/12/2021:Enhance Fiori Eforms to showLOB/SubLOB Name with Description:END

				//this.INITIAL_PERSON_SEARCH_MODEL_DATA = this._getNewPersonSearchModel();

			},
			getLobModelData: function (oData) {
				var data = {
					eLobUserSet: oData
				};
				var oModel = new JSONModel();
				this._component.setModel(oModel, "LobUserSearchModel");
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
				//REQ0730972:DPATEL11:FPDK900050:22/12/2021:Enhance Fiori Eforms to showLOB/SubLOB Name with Description:END
				jQuery.each(arr2, function (i, el) {
					if (jQuery.inArray(el, uniqueSet) === -1) uniqueSet.push(el);
				});
				var data = {
					uniqueLobSet: uniqueSet
				};
				var oModel = new JSONModel();
				this._component.setModel(oModel, "uniqueLobModel");
				this._component.getModel("uniqueLobModel").setData(data);
			},
			getUserModelData: function (oData) {
				var data = {
					eUserSet: oData
				};
				this._component.getModel(this.USER_SEARCH_MODEL).setData(data);
				//console.log(this._component.getModel(this.USER_SEARCH_MODEL));
			},
			loadValuHelpConfig: function () {
				var sUserUrl = "/CardHolderNames";
				var sCurrentUserUrl = "/UserNameCollections";
				var sLobUrl = "/eFormLobs";
				var sLobUniqueUrl = "/eFormLobHeaders";
				var that = this;
				that._View.setBusy(true);

				this._serverModel.read(sCurrentUserUrl, {
					success: function (data) {
						var oData = data.results;

						var sPreparer = oData.NAME_TEXT;
						that._View.byId("PREPARED_BY").setValue(sPreparer);

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
						that._View.setBusy(false);

					},
					error: function (error) {
						that._View.setBusy(false);

					}
				});
				this._serverModel.read(sLobUniqueUrl, {
					success: function (data) {
						var oData = data.results;
						that.getLobUniqueModelData(oData);
					},
					error: function (error) {
						var msg = JSON.parse(oError.response.body).error.message.value;
						MessageToast.show(msg);
					}
				});
				this._serverModel.read(sLobUrl, {
					success: function (data) {
						var oData = data.results;
						that.getLobModelData(oData);
					},
					error: function (error) {
						var msg = JSON.parse(oError.response.body).error.message.value;
						MessageToast.show(msg);
					}
				});
			},

			loadOdataSearchModel: function (mainFilters) {
				debugger;
				var that = this;
				var sURL = "/ReconciliationHeaders";
				if (mainFilters !== undefined) {
					if (mainFilters.length > 0) {
						//that._View.setBusy(true);
						this._serverModel.read(sURL, {
							filters: mainFilters,
							success: function (data) {
								debugger;
								var oData = data.results;
								that.arr1 = [];
								that.arr1 = oData;
								if (mainFilters) {
									that.getSearchFormModelData(oData);

								}
								//that._View.setBusy(false);

							},
							error: function (error) {
								debugger;
								that._View.setBusy(false);
							}

						});
					}
				} else {
					this._serverModel.read(sURL, {

						success: function (data) {
							var oData = data.results;
							that.arr1 = [];
							that.arr1 = oData;

							that.getSearchFormModelData(oData);

						}
					});
				}
			},

			getSearchFormModelData: function (oData) {
				var data = {
					eFormSearchHeaders: oData
				};

				var searchModel = new JSONModel();
				this._component.setModel(searchModel, "mainSearchModel");
				this._component.getModel("mainSearchModel").setData(data);
			}

		};
	});