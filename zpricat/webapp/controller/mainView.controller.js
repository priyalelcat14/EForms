sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("valio.zpricat.controller.mainView", {
            onInit: function () {

            },
        onPress:function(){
            debugger;
            var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("DetailView");

        }

        });
    });
