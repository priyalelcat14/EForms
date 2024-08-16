sap.ui.define(["sap/ui/core/mvc/Controller",
  "sap/m/MessageBox",
  "./utilities",
  "sap/ui/core/routing/History"
], function(BaseController, MessageBox, Utilities, History) {
  "use strict";
  var eform_num;
  var mode;
   var text2;
  return BaseController.extend("com.sap.build.standard.charitableDonationForm.controller.Dialog13", {
    setRouter: function(oRouter) {
      this.oRouter = oRouter;

    },
      setValueObject: function (oSource) {
                eform_num = oSource;

    },
    setMode: function (oSource) {
    mode = oSource;
    },
    getBindingParameters: function() {
      return {};

    },
    _onButtonPress: function() {
      var oDialog = this.getView().getContent()[0];

      sap.ui.controller("com.sap.build.standard.charitableDonationForm.controller.CreatePage").navigate_inbox();

      return new Promise(function(fnResolve) {
        oDialog.attachEventOnce("afterClose", null, fnResolve);
        oDialog.close();
      });

    },
    onInit: function() {
      this._oDialog = this.getView().getContent()[0];

        var url = "/sap/opu/odata/sap/YFPSFIPFRDD0024_CHARITABLE_FRM_SRV/";
                var oModelData = new sap.ui.model.odata.ODataModel(url, true);

                var relPath = "/eFormValidateApprovals?$filter=EFORM_NUM eq '" + window.eform_num_inbox + "' and ACTION eq '"+ window.mode_inbox + "'";
                var that = this;
                var msg_returned;
                mode = window.mode_inbox;

                oModelData.read(relPath, null, [], false, function(oData, response) {

                    var msg_type = response.data.results[0].MSG_TYPE;


    if ( msg_type == "E" )
{

// MessageBox.error(response.data.results[0].MSG);
 msg_returned = response.data.results[0].MSG + ".";
}
else
{
if ( mode == "A" )
{
  msg_returned = "The eForm has been successfully approved.";
  }
  else
  {
  msg_returned = "The eForm has been successfully rejected.";
  }
}

that.getView().byId("MESSAGE").setText(msg_returned);

});
    },
    onExit: function() {
      this._oDialog.destroy();

    }
  });
}, /* bExport= */ true);