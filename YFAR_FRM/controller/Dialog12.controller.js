sap.ui.define(["sap/ui/core/mvc/Controller",
  "sap/m/MessageBox",
  "./utilities",
  "sap/ui/core/routing/History"
], function(BaseController, MessageBox, Utilities, History) {
  "use strict";
  var value_obj;
  return BaseController.extend("spefar.app.controller.Dialog12", {
    setRouter: function(oRouter) {
      this.oRouter = oRouter;
    },
    getBindingParameters: function() {
      return {};
    },
    _onButtonPress2: function() {
      var oDialog = this.getView().getContent()[0];
      return new Promise(function(fnResolve) {
        oDialog.attachEventOnce("afterClose", null, fnResolve);
        oDialog.close();
      });
    },
    _onButtonPress3: function() {
      var oDialog = this.getView().getContent()[0];
      //Begin of changes by NASNANI on 6 sept 2017
      // Selected value will be fetched and updated on approver of Field
      var selected_items = this.getView().byId("approver").getSelectedItems();
      var selected_approver = selected_items[0].mAggregations.cells[1].mProperties.text;
      if (value_obj !== undefined) {
        value_obj.setValue(selected_approver);
      }
      oDialog.close();
      //return new Promise(function (fnResolve) {
      //    oDialog.attachEventOnce("afterClose", null, fnResolve);
      //    oDialog.close();
      //});
      //End of changes by NASNANI on 6 sept 2017
    },
    //Begin of changes by NASNANI on 6 sept 2017
    setValueObject: function (oSource) {
                value_obj = oSource;
 if (value_obj.sId.toLowerCase().indexOf("requested_by") > -1 )
                {
                  this.getView().byId("dialog_main").setTitle("Choose Value for On Behalf Of");
                }
 if (value_obj.sId.toLowerCase().indexOf("prepared_by") > -1 )
                {
                  this.getView().byId("dialog_main").setTitle("Choose Value for Preparer");
                }
    },
    //End of changes by NASNANI on 6 sept 2017
    onInit: function() {
      this.mBindingOptions = {};
      this._oDialog = this.getView().getContent()[0];
            var url = "/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/";
      var oModelData = new sap.ui.model.odata.ODataModel(url, true);
      var relPath = "eFormProductionAccts";
      var that = this;
      oModelData.read(relPath, null, [], false, function(oData, response) {
          that.getView().byId("approver").destroyItems();
          var counter = response.data.results.length;
          var i = 0;
          var table = that.getView().byId("approver");
          for (i = 0; i < counter; i++) {
            var data = new sap.m.ColumnListItem({
              cells: [
                new sap.m.Text({
                  text: response.data.results[i].USERID
                }), new sap.m.Text({
                  text: response.data.results[i].NAME
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
        _onButtonPress1: function() {
      var url = "/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/";
      var oModelData = new sap.ui.model.odata.ODataModel(url, true);
      var rec = this.getView().byId("searchid2_inp").getValue();
      var relPath = "eFormProductionAccts?$filter=NAME eq '"+rec+"'";
      var that = this;
      oModelData.read(relPath, null, [], false, function(oData, response) {
          that.getView().byId("approver").destroyItems();
          var counter = response.data.results.length;
          var i = 0;
          var table = that.getView().byId("approver");
          for (i = 0; i < counter; i++) {
            var data = new sap.m.ColumnListItem({
              cells: [
                new sap.m.Text({
                  text: response.data.results[i].USERID
                }), new sap.m.Text({
                  text: response.data.results[i].NAME
                })
              ]
            });
            table.addItem(data);
          }
          });
    },
    onExit: function() {
      this._oDialog.destroy();
    }
  });
}, /* bExport= */ true);