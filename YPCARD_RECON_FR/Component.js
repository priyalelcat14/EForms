sap.ui.define([
  "sap/ui/core/UIComponent",
  "sap/ui/Device",
  "sony/pcard/reconciliation/appYPCardReconciliation/model/models"
], function(UIComponent, Device, models) {
  "use strict";

  return UIComponent.extend("sony.pcard.reconciliation.appYPCardReconciliation.Component", {

    metadata: {
      manifest: "json"
    },

    /**
     * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
     * @public
     * @override
     */
    init: function() {

     // create and set the ODataModel
            var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/YFPSFIPFRDD0020_PCARDREC_EFROM_SRV/");
            this.setModel(oModel,"odataModel");
        // call the base component's init function
      UIComponent.prototype.init.apply(this, arguments);
        // create the views based on the url/hash
        this.getRouter().initialize();
      // set the device model
      this.setModel(models.createDeviceModel(), "device");

    }
  });
});