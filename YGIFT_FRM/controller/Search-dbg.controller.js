sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageBox"
], function(Controller, MessageBox) {
  "use strict";
  var todaydate;
  return Controller.extend("YGIFT_FRM.controller.Search", {
/**
         * Called when a controller is instantiated and its View controls (if available) are already created.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         * @memberOf sony.pcard.appYPCardApplication.view.SearchApplicationCard
         */
        onInit: function() {
            this.Router = sap.ui.core.UIComponent.getRouterFor(this);

            var model = this.getOwnerComponent().getModel("oData");
            var that = this;
            model.read("/eFormInitialInfos('1')", {
                success: function(oData, response) {
                    that.getView().byId("PREPARED_BY").setValue(response.data.NAME);
                    todaydate = response.data.DATE;
                },
                error: function(oError) {
                    var response = JSON.parse(oError.responseText);
                    MessageBox.show(
                        response.error.message.value,
                        MessageBox.Icon.ERROR,
                        "Error"
                    );
                    sap.ui.core.BusyIndicator.hide();
                }
            });

            this.Router.attachRouteMatched(this._onObjectMatched, this);

        },

        _onObjectMatched : function()
        {
        this.getView().byId("eforms_tab").destroyItems();;
        },



        clear_fields: function() {
            this.getView().byId("EFORM_NUM").setValue("");
            this.getView().byId("TITLE").setValue("");
            this.getView().byId("APPROVED_BY").setValue("");
            this.getView().byId("APPROVER").setValue("");
            this.getView().byId("APPROVED_DT").setValue("");
            this.getView().byId("APPROVED_DT_TO").setValue("");
            this.getView().byId("CREATED_DT").setValue("");
            this.getView().byId("CREATED_DT_TO").setValue("");
            this.getView().byId("SUBMITED_DT").setValue("");
            this.getView().byId("SUBMITED_DT_TO").setValue("");
            this.getView().byId("PREPARED_BY").setValue("");
            this.getView().byId("REQUESTED_BY").setValue("");
            this.getView().byId("STATUS").setValue("");
        },
         report_records: function(oEvent) {
            var model = this.getOwnerComponent().getModel("oData");
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
            var prepared_by = this.getView().byId("PREPARED_BY").getValue();
            var on_behalf_of = this.getView().byId("REQUESTED_BY").getValue();
            var status = this.getView().byId("STATUS").getValue();
             var relPath = "/sap/opu/odata/sap/YFPSFIPFRDD0028_GIFT_EFORM_SRV/eFormGiftFormHs?$filter=EFORM_NUM eq '" + eform_num +
                "' and TITLE eq '" + title +
                "' and APPROVED_BY eq '" + approved_by +
                "' and APPROVER eq '" + approver +
                "' and (APPROVED_DT ge '" + approved_dt +
                "' and APPROVED_DT le '" + approved_dt_to +
                "') and (REQUEST_DATE ge '" + created_dt +
                "' and  REQUEST_DATE le '" + created_dt_to +
                "') and PREPARER eq '" + prepared_by +
                "' and ON_BEHALF_OF eq '" + on_behalf_of +
                "' and STATUS eq '" + status +
                "' and (DATE_SUBMITTED ge '" + submited_dt +
                "' and DATE_SUBMITTED le '" + submited_dt_to +
                "')&$format=xlsx";
             var encodeUrl = encodeURI(relPath);
    sap.m.URLHelper.redirect(encodeUrl,true);
            },
        search_records: function(oEvent) {
            var model = this.getOwnerComponent().getModel("oData");
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
            var prepared_by = this.getView().byId("PREPARED_BY").getValue();
            var on_behalf_of = this.getView().byId("REQUESTED_BY").getValue();
            var status = this.getView().byId("STATUS").getValue();
            var relPath = "/eFormGiftFormHs";
            var that = this;
            var myfilter = [];
            var oFilter1 = new sap.ui.model.Filter(
                "EFORM_NUM",
                sap.ui.model.FilterOperator.EQ, eform_num
            );
            myfilter.push(oFilter1);
            var oFilter2 = new sap.ui.model.Filter(
                "TITLE",
                sap.ui.model.FilterOperator.EQ, title
            );
            myfilter.push(oFilter2);
            var oFilter3 = new sap.ui.model.Filter(
                "APPROVED_BY",
                sap.ui.model.FilterOperator.EQ, approved_by
            );
            myfilter.push(oFilter3);
            var oFilter4 = new sap.ui.model.Filter(
                "APPROVER",
                sap.ui.model.FilterOperator.EQ, approver
            );
            myfilter.push(oFilter4);
             var oFilter5 = new sap.ui.model.Filter(
                "REQUEST_DATE",
                sap.ui.model.FilterOperator.BT, created_dt, created_dt_to
            );
            myfilter.push(oFilter5);
            var oFilter6 = new sap.ui.model.Filter(
                "APPROVED_DT",
                sap.ui.model.FilterOperator.BT, approved_dt, approved_dt_to
            );
            myfilter.push(oFilter6);
            var oFilter7 = new sap.ui.model.Filter(
                "DATE_SUBMITTED",
                sap.ui.model.FilterOperator.BT, submited_dt, submited_dt_to
            );
            myfilter.push(oFilter7);
            var oFilter10 = new sap.ui.model.Filter(
                "PREPARER",
                sap.ui.model.FilterOperator.EQ, prepared_by
            );
            myfilter.push(oFilter10);
            var oFilter12 = new sap.ui.model.Filter(
                "STATUS",
                sap.ui.model.FilterOperator.EQ, status
            );
            myfilter.push(oFilter12);
             var oFilter13 = new sap.ui.model.Filter(
                "ON_BEHALF_OF",
                sap.ui.model.FilterOperator.EQ, on_behalf_of
            );
            myfilter.push(oFilter13);
            var model = this.getOwnerComponent().getModel("oData");
            this.getView().byId("eforms_tab").destroyItems();
            var that = this;
            model.read(relPath, {
                filters: myfilter,
                success: function(oData, response) {
                    var counter = oData.results.length;
                    var i = 0;
                    var selected_box;
                    var license_cost;
                    var table = that.getView().byId("eforms_tab");
                    for (i = 0; i < counter; i++) {
                        var data = new sap.m.ColumnListItem({
                            cells: [
                                new sap.m.Link({
                                    text: oData.results[i].EFORM_NUM,
                                    press: function(oEvent) {
                                        that.Router.navTo('GiftOrder', {
                                            value: oEvent.oSource.mProperties.text
                                        });
                                    }
                                }),
                                new sap.m.Text({
                                    text: oData.results[i].TITLE
                                }),
                                new sap.m.Text({
                                    text: oData.results[i].STATUS
                                }),
                                new sap.m.Text({
                                    text: oData.results[i].REQUEST_DATE
                                }),
                                new sap.m.Text({
                                    text: '0 USD'
                                })
                            ]
                        });
                        table.addItem(data);
                    }
                },
                error: function(oError) {
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


        bindTable:function()
        {
        },



        _onApprover_ValueHelp: function() {
            var cardholder = this.getView().byId("APPROVER");
            var that2 = this;
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
                search: function(oEvent) {
                    var sValue = oEvent.getParameter("value");
                    var oFilter = new sap.ui.model.Filter(
                        "NAME",
                        sap.ui.model.FilterOperator.Contains, sValue
                    );
                    oEvent.getSource().getBinding("items").filter([oFilter]);
                },
                //On click of Confirm, value is set to input field
                confirm: function(oEvent) {
                    var oSelectedItem = oEvent.getParameter("selectedItem");
                    if (oSelectedItem) {
                        cardholder.setValue(oSelectedItem.getDescription());
                    }
                }
            });
            var model = this.getOwnerComponent().getModel("oData");
            oValueHelpDialog_CardHolderName.setModel(model);
            oValueHelpDialog_CardHolderName.open();
        },
        _onApprovedBy_ValueHelp: function() {
            var cardholder = this.getView().byId("APPROVED_BY");
            var that2 = this;
            var oValueHelpDialog_CardHolderName = new sap.m.SelectDialog({
                title: "Choose Value for Approved By",
                items: {
                    path: "/eFormProductionAccts",
                    template: new sap.m.StandardListItem({
                        title: "{USERID}",
                        description: "{NAME}",
                        active: true
                    })
                },
                search: function(oEvent) {
                    var sValue = oEvent.getParameter("value");
                    var oFilter = new sap.ui.model.Filter(
                        "NAME",
                        sap.ui.model.FilterOperator.Contains, sValue
                    );
                    oEvent.getSource().getBinding("items").filter([oFilter]);
                },
                //On click of Confirm, value is set to input field
                confirm: function(oEvent) {
                    var oSelectedItem = oEvent.getParameter("selectedItem");
                    if (oSelectedItem) {
                        cardholder.setValue(oSelectedItem.getDescription());
                    }
                }
            });
            var model = this.getOwnerComponent().getModel("oData");
            oValueHelpDialog_CardHolderName.setModel(model);
            oValueHelpDialog_CardHolderName.open();
        },
        _onBehalfOf_ValueHelp: function() {
            var cardholder = this.getView().byId("REQUESTED_BY");
            var that2 = this;
            var oValueHelpDialog_CardHolderName = new sap.m.SelectDialog({
                title: "Choose Value for On Behalf Of",
                items: {
                    path: "/eFormProductionAccts",
                    template: new sap.m.StandardListItem({
                        title: "{USERID}",
                        description: "{NAME}",
                        active: true
                    })
                },
                search: function(oEvent) {
                    var sValue = oEvent.getParameter("value");
                    var oFilter = new sap.ui.model.Filter(
                        "NAME",
                        sap.ui.model.FilterOperator.Contains, sValue
                    );
                    oEvent.getSource().getBinding("items").filter([oFilter]);
                },
                //On click of Confirm, value is set to input field
                confirm: function(oEvent) {
                    var oSelectedItem = oEvent.getParameter("selectedItem");
                    if (oSelectedItem) {
                        cardholder.setValue(oSelectedItem.getDescription());
                    }
                }
            });
            var model = this.getOwnerComponent().getModel("oData");
            oValueHelpDialog_CardHolderName.setModel(model);
            oValueHelpDialog_CardHolderName.open();
        },
        _onPreparer_ValueHelp: function() {
            var cardholder = this.getView().byId("PREPARED_BY");
            var that2 = this;
            var oValueHelpDialog_CardHolderName = new sap.m.SelectDialog({
                title: "Choose Value for Preparer",
                items: {
                    path: "/eFormProductionAccts",
                    template: new sap.m.StandardListItem({
                        title: "{USERID}",
                        description: "{NAME}",
                        active: true
                    })
                },
                search: function(oEvent) {
                    var sValue = oEvent.getParameter("value");
                    var oFilter = new sap.ui.model.Filter(
                        "NAME",
                        sap.ui.model.FilterOperator.Contains, sValue
                    );
                    oEvent.getSource().getBinding("items").filter([oFilter]);
                },
                //On click of Confirm, value is set to input field
                confirm: function(oEvent) {
                    var oSelectedItem = oEvent.getParameter("selectedItem");
                    if (oSelectedItem) {
                        cardholder.setValue(oSelectedItem.getDescription());
                    }
                }
            });
            var model = this.getOwnerComponent().getModel("oData");
            oValueHelpDialog_CardHolderName.setModel(model);
            oValueHelpDialog_CardHolderName.open();
        },
 copy_eform: function(oEvent) {
               var selected_item = this.getView().byId("eforms_tab").getSelectedItem();
            var eform_num = selected_item.mAggregations.cells[0].mProperties.text;
            if (eform_num !== "") {
                this.Router.navTo('GiftOrder', {
                    value: eform_num + '#copy'
                });
            }
            },
        onCreatePressFromSearch: function(oEvent) {
                this.Router.navTo('GiftOrder1' , true);
            }
    });
});