sap.ui.define(["sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "./utilities",
    "sap/ui/core/routing/History"
], function(BaseController, MessageBox, Utilities, History) {
    "use strict";
    return BaseController.extend("spefar.app.controller.SearchFAR", {
        handleRouteMatched: function(oEvent) {
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
        },
        handleAmountLiveChange: function(oEvent){
        var sAmount = oEvent.getParameter("value");
         var a = sAmount.split(',').join('');
        var totalUsd = new Intl.NumberFormat('en-US').format(a);
        this.getView().byId("AMOUNT1").setValue(totalUsd);
        },
handleAmountLiveChangeTo: function(oEvent){
        var sAmount = oEvent.getParameter("value");
         var b = sAmount.split(',').join('');
        var totalUsd = new Intl.NumberFormat('en-US').format(b);
        this.getView().byId("AMOUNT2").setValue(totalUsd);
        },


        copy_eform: function() {
            var selected_item = this.getView().byId("eforms_tab").getSelectedItem();
            var eform_num = selected_item.mAggregations.cells[0].mProperties.text;
            if (eform_num !== "") {
                this.oRouter.navTo('FarRequest', {
                    value: eform_num + '#copy'
                });
            }
        },
        //REQ0737819:DPATEL11:FPDK900086:Batch-2:FAR lob/sublob changes : START
        _onusernameValueHelpRequest: function (oEvent) {
			var multi = false;
			var url = "/sap/opu/odata/sap/YFPSFIPFRDD00017_CPR_EFORM_SRV/";
			var oModelData = new sap.ui.model.odata.ODataModel(url, true);
			var relPath = "/eFormProductionAccts";
			var that = this;
			var id = oEvent.getSource().getId().split("-")[8];
			if (id == "REQUESTED_BY") {
				this.mtitle = "Choose value for On Behalf of";
			} else if (id == "PREPARED_BY") {
				this.mtitle = "Choose value for Prepared By";
			} else if (id == "APPROVED_BY") {
				this.mtitle = "Choose value for Approved By";
			} else if (id == "APPROVER") {
				this.mtitle = "Choose value for Approver";
			} else {

			}
			oModelData.read(relPath, null, [], false, function (oData, response) {
				},
				function (oError) {
					oModelData.fireRequestCompleted();
					var msg = JSON.parse(oError.response.body).error.message.value;
					//sap.m.MessageBox.error(msg);
					sap.m.MessageToast.show(msg);
				});
			var oValueHelpDialog_RespDiv = new sap.m.SelectDialog({
				title: this.mtitle,
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
					if (id === "REQUESTED_BY") {
						that.getView().byId(id).setValue(selected_comp);
					} else if (id === "PREPARED_BY") {
						that.getView().byId(id).setValue(selected_comp);
					} else if (id === "APPROVED_BY") {
						that.getView().byId(id).setValue(selected_comp);
					} else if (id === "APPROVER") {
						that.getView().byId(id).setValue(selected_comp);
					} else {

					}
				},

				// 		else 

			});

			oValueHelpDialog_RespDiv.setModel(oModelData);
			oValueHelpDialog_RespDiv.open();
		},
		_onlobValueHelpRequest: function (oEvent) {
			var lobid = this.getView().byId("oSelect_1");
			var sublob = this.getView().byId("PAYROLL_COMP");
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
			var sublob = this.getView().byId("PAYROLL_COMP");
			var lob = this.getView().byId("oSelect_1").getValue();
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
        _onInputValueHelpRequest: function(oEvent) {
            var sDialogName = "Dialog12";
            this.mDialogs = this.mDialogs || {};
            var oDialog = this.mDialogs[sDialogName];
            var oSource = oEvent.getSource();
            var oBindingContext = oSource.getBindingContext();
            var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
            var oView;
            if (!oDialog) {
                this.getOwnerComponent().runAsOwner(function() {
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
            var source_cont = oSource;
            return new Promise(function(fnResolve) {
                oDialog.attachEventOnce("afterOpen", null, fnResolve);
                oDialog.open();
                if (oView) {
                    oDialog.attachAfterOpen(function() {
                        oDialog.rerender();
                    });
                } else {
                    oView = oDialog.getParent();
                }
                oView.getController().setValueObject(source_cont);
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
            }.bind(this)).catch(function(err) {
                if (err !== undefined) {
                    MessageBox.error(err.message);
                }
            });
        },
        _onInputValueHelpRequest1: function(oEvent) {
            var sDialogName = "Dialog9";
            this.mDialogs = this.mDialogs || {};
            var oDialog = this.mDialogs[sDialogName];
            var oSource = oEvent.getSource();
            var oBindingContext = oSource.getBindingContext();
            var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
            var oView;
            if (!oDialog) {
                this.getOwnerComponent().runAsOwner(function() {
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
            return new Promise(function(fnResolve) {
                oDialog.attachEventOnce("afterOpen", null, fnResolve);
                oDialog.open();
                if (oView) {
                    oDialog.attachAfterOpen(function() {
                        oDialog.rerender();
                    });
                } else {
                    oView = oDialog.getParent();
                }
                oView.getController().setValueText(this.getView().byId("oSelect_1").getValue());
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
            }.bind(this)).catch(function(err) {
                if (err !== undefined) {
                    MessageBox.error(err.message);
                }
            });
        },
        _onButtonPress: function(oEvent) {
            var oBindingContext = oEvent.getSource().getBindingContext();
            return new Promise(function(fnResolve) {
                this.doNavigate("Test1", oBindingContext, fnResolve, "");
            }.bind(this)).catch(function(err) {
                if (err !== undefined) {
                    MessageBox.error(err.message);
                }
            });
        },
        clear_fields: function() {
            this.getView().byId("EFORM_NUM").setValue("");
            this.getView().byId("TITLE").setValue("");
            this.getView().byId("NAME").setValue("");
            this.getView().byId("APPROVED_BY").setValue("");
            this.getView().byId("APPROVER").setValue("");
            this.getView().byId("APPROVED_DT").setValue("");
            this.getView().byId("APPROVED_DT_TO").setValue("");
            this.getView().byId("CREATED_DT").setValue("");
            this.getView().byId("CREATED_DT_TO").setValue("");
            this.getView().byId("SUBMITED_DT").setValue("");
            this.getView().byId("SUBMITED_DT_TO").setValue("");
            this.getView().byId("PAYROLL_COMP").setValue("");
            this.getView().byId("PREPARED_BY").setValue("");
            this.getView().byId("REQUESTED_BY").setValue("");
            this.getView().byId("STATUS").setValue("");
            this.getView().byId("AMOUNT1").setValue("");
            this.getView().byId("AMOUNT2").setValue("");
            this.getView().byId("oSelect_1").setValue("");
        },
        search_records: function(oEvent) {
            var url = "/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/";
            var oModelData = new sap.ui.model.odata.ODataModel(url, true);
            this.getView().setModel(oModelData);
            var eform_num = this.getView().byId("EFORM_NUM").getValue();
            var title = this.getView().byId("TITLE").getValue();
            var approved_by = this.getView().byId("APPROVED_BY").getValue();
            var approver = this.getView().byId("APPROVER").getValue();
            var approved_dt = this.getView().byId("APPROVED_DT").getValue();
            var approved_dt_to = this.getView().byId("APPROVED_DT_TO").getValue();
            var created_dt = this.getView().byId("CREATED_DT").getValue();
            var created_dt_to = this.getView().byId("CREATED_DT_TO").getValue();
            var submited_dt = this.getView().byId("SUBMITED_DT").getValue();
            var submited_dt_to = this.getView().byId("SUBMITED_DT_TO").getValue();
            var lob = this.getView().byId("oSelect_1").getValue();
            var payroll_comp = this.getView().byId("PAYROLL_COMP").getValue();
            payroll_comp = payroll_comp.replace('&','%26');
            var prepared_by = this.getView().byId("PREPARED_BY").getValue();
            var requested_by = this.getView().byId("REQUESTED_BY").getValue();
            var status = this.getView().byId("STATUS").getValue();
            var amount11 = this.getView().byId("AMOUNT1").getValue();
            var amount1 = amount11.split(',').join('');
            var amount22 = this.getView().byId("AMOUNT2").getValue();
            var amount2 = amount22.split(',').join('');
            var relPath = "/eFormHeaders?$filter=EFORM_NUM eq '" + eform_num +
                "' and TITLE eq '" + title +
                "' and APPROVED_BY eq '" + approved_by +
                "' and APPROVER eq '" + approver +
                "' and (APPROVED_DT ge '" + approved_dt +
                "' and APPROVED_DT le '" + approved_dt_to +
                "') and (CREATED_DT ge '" + created_dt +
                "' and  CREATED_DT le '" + created_dt_to +
                "') and COFA_SUBLOB eq '" + payroll_comp +
                "' and COFA_LOB eq '" + lob +
                "' and PREPARER eq '" + prepared_by +
                "' and ON_BEHALF_OF eq '" + requested_by +
                "' and STATUS eq '" + status +
                "' and (TOTALUSD ge '" + amount1 +
                "' and TOTALUSD le '" + amount2 +
                "') and (SUBMITED_DT ge '" + submited_dt +
                "' and SUBMITED_DT le '" + submited_dt_to +
                "')";
            var that = this;
            oModelData.read(relPath, null, [], false, function(oData, response) {
                    that.getView().byId("eforms_tab").destroyItems();
                    var counter = response.data.results.length;
                    var i = 0;
                    var selected_box;
                    var license_cost;
                    var table = that.getView().byId("eforms_tab");
                    for (i = 0; i < counter; i++) {
                    var totalUsd;
                               if(response.data.results[i].TOTALUSD){
                               var totalUSD = response.data.results[i].TOTALUSD;
                             totalUsd = new Intl.NumberFormat('en-US').format(totalUSD);

                               }
                        var data = new sap.m.ColumnListItem({
                            cells: [
                                // new sap.m.Text({
                                //    text: "FAR"
                                // }),

                                new sap.m.Link({
                                    text: response.data.results[i].EFORM_NUM,
                                    press: function(oEvent) {
                                        that.oRouter.navTo('FarRequest', {
                                            value: oEvent.oSource.mProperties.text
                                        });
                                    }
                                }),

                                new sap.m.Text({
                                    text: response.data.results[i].TITLE
                                }),
                                new sap.m.Text({
                                    text: response.data.results[i].STATUS
                                }),
                                new sap.m.Text({
                                    text: response.data.results[i].CREATED_DT
                                }),
                                new sap.m.Text({
                                    text: totalUsd +'USD'
                                })
                            ]
                        });
                        table.addItem(data);
                    }
                },
                function(oError) {
                    oModelData.fireRequestCompleted();
                    var msg = JSON.parse(oError.response.body).error.message.value;
                    //sap.m.MessageBox.error(msg);
                    sap.m.MessageToast.show(msg);
                });
        },

        report: function(oEvent) {
            var url = "/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/";
            var oModelData = new sap.ui.model.odata.ODataModel(url, true);
            this.getView().setModel(oModelData);
            var eform_num = this.getView().byId("EFORM_NUM").getValue();
            var title = this.getView().byId("TITLE").getValue();
            var approved_by = this.getView().byId("APPROVED_BY").getValue();
            var approver = this.getView().byId("APPROVER").getValue();
            var approved_dt = this.getView().byId("APPROVED_DT").getValue();
            var approved_dt_to = this.getView().byId("APPROVED_DT_TO").getValue();
            var created_dt = this.getView().byId("CREATED_DT").getValue();
            var created_dt_to = this.getView().byId("CREATED_DT_TO").getValue();
            var submited_dt = this.getView().byId("SUBMITED_DT").getValue();
            var submited_dt_to = this.getView().byId("SUBMITED_DT_TO").getValue();
            var lob = this.getView().byId("oSelect_1").getValue();
            var payroll_comp = this.getView().byId("PAYROLL_COMP").getValue();
            var prepared_by = this.getView().byId("PREPARED_BY").getValue();
            var requested_by = this.getView().byId("REQUESTED_BY").getValue();
            var status = this.getView().byId("STATUS").getValue();
            var amount1 = this.getView().byId("AMOUNT1").getValue();
            var amount2 = this.getView().byId("AMOUNT2").getValue();
            var relPath = "/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/eFormHeaders?$filter=EFORM_NUM eq '" + eform_num +
                "' and TITLE eq '" + title +
                "' and APPROVED_BY eq '" + approved_by +
                "' and APPROVER eq '" + approver +
                "' and (APPROVED_DT ge '" + approved_dt +
                "' and APPROVED_DT le '" + approved_dt_to +
                "') and (CREATED_DT ge '" + created_dt +
                "' and  CREATED_DT le '" + created_dt_to +
                "') and COFA_SUBLOB eq '" + payroll_comp +
                "' and COFA_LOB eq '" + lob +
                "' and PREPARER eq '" + prepared_by +
                "' and ON_BEHALF_OF eq '" + requested_by +
                "' and STATUS eq '" + status +
                "' and (TOTALUSD ge '" + amount1 +
                "' and TOTALUSD le '" + amount2 +
                "') and (SUBMITED_DT ge '" + submited_dt +
                "' and SUBMITED_DT le '" + submited_dt_to +
                "')&$format=xlsx";

             var encodeUrl = encodeURI(relPath);
    sap.m.URLHelper.redirect(encodeUrl,true);

            },

        doNavigate: function(sRouteName, oBindingContext, fnPromiseResolve, sViaRelation) {
            var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
            var oModel = (oBindingContext) ? oBindingContext.getModel() : null;
            var sEntityNameSet;
            if (sPath !== null && sPath !== "") {
                if (sPath.substring(0, 1) === "/") {
                    sPath = sPath.substring(1);
                }
                sEntityNameSet = sPath.split("(")[0];
            }
            var sNavigationPropertyName;
            var sMasterContext = this.sMasterContext ? this.sMasterContext : sPath;
            if (sEntityNameSet !== null) {
                sNavigationPropertyName = sViaRelation || this.getOwnerComponent().getNavigationPropertyForNavigationWithContext(sEntityNameSet, sRouteName);
            }
            if (sNavigationPropertyName !== null && sNavigationPropertyName !== undefined) {
                if (sNavigationPropertyName === "") {
                    this.oRouter.navTo(sRouteName, {
                        context: sPath,
                        masterContext: sMasterContext
                    }, false);
                } else {
                    oModel.createBindingContext(sNavigationPropertyName, oBindingContext, null, function(bindingContext) {
                        if (bindingContext) {
                            sPath = bindingContext.getPath();
                            if (sPath.substring(0, 1) === "/") {
                                sPath = sPath.substring(1);
                            }
                        } else {
                            sPath = "undefined";
                        }
                        // If the navigation is a 1-n, sPath would be "undefined" as this is not supported in Build
                        if (sPath === "undefined") {
                            this.oRouter.navTo(sRouteName);
                        } else {
                            this.oRouter.navTo(sRouteName, {
                                context: sPath,
                                masterContext: sMasterContext
                            }, false);
                        }
                    }.bind(this));
                }
            } else {
                this.oRouter.navTo(sRouteName);
            }
            if (typeof fnPromiseResolve === "function") {
                fnPromiseResolve();
            }
        },
        onInit: function() {
            this.mBindingOptions = {};
            this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            //this.oRouter.getTarget("Page2").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
            var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/", true);
            this.getView().byId("oSelect_1").setModel(oModel);
        }
    });
}, /* bExport= */ true);