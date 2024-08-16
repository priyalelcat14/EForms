sap.ui.define(["sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "./utilities",
    "sap/ui/core/routing/History"
    ], function(BaseController, MessageBox, Utilities, History) {
    "use strict";
    return BaseController.extend("spefar.app.controller.Dialog3", {
    setRouter: function (oRouter) {
                                this.oRouter = oRouter;
        },
getBindingParameters: function () {
                return {};
        },
onInit: function () {
                        this.mBindingOptions = {};
        this._oDialog = this.getView().getContent()[0];
        var currview =  this.getView();
        window.dialog3 = currview;
        },
setresult: function(rtext) {
      if ( rtext == "" )
      {
        var a = window.dialog3.byId("farnumber");
        a.setText("No FAR form created.");
      }
      else {
        var a = window.dialog3.byId("farnumber");
        a.setText(rtext);
      }
      },
       _onButtonPress3: function() {
        var oDialog = this.getView().getContent()[0];
         return new Promise(function(fnResolve) {
        oDialog.attachEventOnce("afterClose", null, fnResolve);
        oDialog.close();
        });
      },
onExit: function () {
                                this._oDialog.destroy();
        }
});
}, /* bExport= */true);