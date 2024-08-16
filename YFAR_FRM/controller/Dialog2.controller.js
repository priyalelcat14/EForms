sap.ui.define(["sap/ui/core/mvc/Controller",
  "sap/m/MessageBox",
  "./utilities",
  "sap/ui/core/routing/History"
], function(BaseController, MessageBox, Utilities, History) {
  "use strict";
  return BaseController.extend("spefar.app.controller.Dialog2", {
    setRouter: function(oRouter) {
      this.oRouter = oRouter;
    },
    getBindingParameters: function() {
      return {};
    },

    _onButtonPress1: function() {
      var url = "/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/";
      var oModelData = new sap.ui.model.odata.ODataModel(url, true);
      var rec = this.getView().byId("searchid1_inp").getValue();
      var relPath = "eFormProductionAccts?$filter=NAME eq '"+rec+"'";
      var that = this;
      oModelData.read(relPath, null, [], false, function(oData, response) {
          that.getView().byId("onbehalfof").destroyItems();
          var counter = response.data.results.length;
          var i = 0;
          var table = that.getView().byId("onbehalfof");
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
      // Selected value will be fetched and updated on OnBahalf of Field
      var selected_items = this.getView().byId("onbehalfof").getSelectedItems();
      var selected_comp = selected_items[0].mAggregations.cells[0].mProperties.text;
      var selected_comp_name = selected_items[0].mAggregations.cells[1].mProperties.text;

      var url = "/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/";
      var oModelData = new sap.ui.model.odata.ODataModel(url, true);

      var relPath = "eFormProductionAccts('" + selected_comp+ "')";
      var that = this;
      oModelData.read(relPath, null, [], false, function(oData, response) {
          window.userphone = response.data.PHONE;
          window.useremail = response.data.EMAIL;
          window.userid = response.data.USERID;

          });




      sap.ui.controller("spefar.app.controller.FarRequest").addonbehalfof(selected_comp_name,window.userphone,window.useremail);
      oDialog.close();
      //End of changes by NASNANI on 6 sept 2017
    },
    onInit: function() {
      this.mBindingOptions = {};
      this._oDialog = this.getView().getContent()[0];
      var url = "/sap/opu/odata/sap/YFPSFIFARDD0206_EFORM_SRV/";
      var oModelData = new sap.ui.model.odata.ODataModel(url, true);
      var relPath = "eFormProductionAccts";
      var that = this;
      oModelData.read(relPath, null, [], false, function(oData, response) {
          that.getView().byId("onbehalfof").destroyItems();
          var counter = response.data.results.length;
          var i = 0;
          var table = that.getView().byId("onbehalfof");
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
    onExit: function() {
      this._oDialog.destroy();
    }
  });
}, /* bExport= */ true);