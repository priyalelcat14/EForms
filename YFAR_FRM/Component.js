sap.ui.define([
  "sap/ui/core/UIComponent",
  "sap/ui/Device",
  "spefar/app/model/models"

  //Begin of changes by NASNANI on 6 sept 2017
    //"generated/app/localService/mockserver"
    //End of changes by NASNANI on 6 sept 2017
    
    ], function(UIComponent, Device, models, server) {
      "use strict";
        
        //Begin of changes by NASNANI on 6 sept 2017
      // TODO remove the following demo code
      // ---------------------------- TEMP MOCKSERVER CODE------------------------------------------
      //server.init();
      // ---------------------------- END TEMP MOCKSERVER CODE--------------------------------------
      //End of changes by NASNANI on 6 sept 2017

  var navigationWithContext = {

  };

  return UIComponent.extend("spefar.app.Component", {

    metadata: {
      manifest: "json"
    },

     config : {
  fullWidth : true, //Set your fullscreen parameter here!

  },

    /**
     * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
     * @public
     * @override
     */
    init: function() {
      //Begin of changes by NASNANI on 6 sept 2017
      // set the device model
      //this.setModel(models.createDeviceModel(), "device");
      // set the FLP model
      //this.setModel(models.createFLPModel(), "FLP");

      // set the dataSource model
      //this.setModel(new sap.ui.model.json.JSONModel({"uri":"\"/here/goes/your/serviceUrl/\""}), "dataSource");
      //End of changes by NASNANI on 6 sept 2017

      // call the base component's init function
      UIComponent.prototype.init.apply(this, arguments);

      // create the views based on the url/hash
      this.getRouter().initialize();
    },

    createContent: function() {
      var app = new sap.m.App({
        id: "App"
      });
      var appType = "App";
      var appBackgroundColor = "#FFFFFF";
      if (appType === "App" && appBackgroundColor) {
        app.setBackgroundColor(appBackgroundColor);
      }

      return app;
    },

    getNavigationPropertyForNavigationWithContext: function(sEntityNameSet, targetPageName) {
      var entityNavigations = navigationWithContext[sEntityNameSet];
      return entityNavigations == null ? null : entityNavigations[targetPageName];
    }
  });

});