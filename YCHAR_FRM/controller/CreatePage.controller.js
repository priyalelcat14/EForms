jQuery.sap.require("com.sap.build.standard.charitableDonationForm.model.formatter");
sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History"
], function (BaseController, MessageBox, Utilities, History) {
	"use strict";
	var copy_case;
	var create_case;
	var display_case;
	var edit_case;
	var validate_error;
	var eform_number = "";
	var eform_status = "Data Saved";
	var file_size;
	var index_counter = 0;
	var logger_name = "";
	var logged_userid = "";
	var request_date = "";
	var tempdialog;
	var CharitableForm;
	return BaseController.extend("com.sap.build.standard.charitableDonationForm.controller.CreatePage", {
		handleRouteMatched: function (oEvent) {},
		_onPageNavButtonPress: function () {
			//  var oHistory = History.getInstance();
			//  var sPreviousHash = oHistory.getPreviousHash();
			//  var oQueryParams = this.getQueryParameters(window.location);
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			//var myloc = location;
			// myloc.reload();
			window.location.reload();
			oRouter.navTo("default", true);
		},
		getQueryParameters: function (oLocation) {
			var oQuery = {};
			var aParams = oLocation.search.substring(1).split("&");
			for (var i = 0; i < aParams.length; i++) {
				var aPair = aParams[i].split("=");
				oQuery[aPair[0]] = decodeURIComponent(aPair[1]);
			}
			return oQuery;
		},

		approve_reject_button_dsp: function () {
			//Check and display Approve and Reject buttons if applicable
			var url = "/sap/opu/odata/sap/YFPSFIPFRDD0024_CHARITABLE_FRM_SRV/";
			var oModelData = new sap.ui.model.odata.ODataModel(url, true);
			var eform_num = eform_number;
			var relPath = "/eFormDetermineApproverLogins?$filter=EFORM_NUM eq '" + eform_num + "'";
			var that = CharitableForm;

			oModelData.read(relPath, null, [], false, function (oData, response) {
				var msg_type = response.data.results[0].MSG_TYPE;
				if (msg_type == "S") {
					that.getView().byId("b_approve").setVisible(true);
					that.getView().byId("b_reject").setVisible(true);
				} else {
					that.getView().byId("b_approve").setVisible(false);
					that.getView().byId("b_reject").setVisible(false);
				}
			});
		},
		_onObjectMatched: function (oEvent) {
			// Displaying handled
			var eform_dsp = oEvent.getParameters().arguments.context;
			CharitableForm = this;
			//Reset display of Approve & reject buttons
			this.getView().byId("b_approve").setVisible(false);
			this.getView().byId("b_reject").setVisible(false);
			if (eform_dsp !== undefined) {
				if (eform_dsp.toLowerCase().indexOf("copy") > -1) {
					//Copy scenario
					var array = eform_dsp.split('#');
					eform_dsp = array[0];
					eform_number = eform_dsp;
					copy_case = "X";
				} else {
					//Display scenario
					copy_case = "";
					eform_number = eform_dsp;
				}
				this.displayfields();
			} else {
				var localData = {
					EFORM_NUM: "",
					REQUEST_DATE: "",
					TITLE: "Untitled Charitable Expenditure Request",
					DESC_PR: "",
					PREPARER: "",
					ON_BEHALF_OF: "",
					REQUESTER_TITLE: "",
					REQUESTER_PHONE: "",
					REQUESTER_OFFICE_LOCATION: "",
					DEPARTMENT: "",
					DEPARTMENT_HEAD: "",
					ORGANIZATION_NAME: "",
					AMOUNT_DONATION: "",
					AMOUNT_DONATION_USD: "",
					CURRENCY: "USD",
					localcurrency: [{
						name: "",
						exch: ""
					}],

					USERS: [{
						USERID: "",
						NAME: ""
					}],
					DEPUSERS: [{
						USERID: "",
						NAME: ""
					}],

					LOBS: [{
						LOB: "",
						SLOB_DESCRIPTION: ""
					}],

					SUBLOBS: [{
						SUBLOB: "",
						SLOB_DESCRIPTION: ""
					}],

					COUNTRIES: [{
						COUNTRY: "",
						NAME: ""
					}],

					STATES: [{
						STATE: "",
						NAME: ""
					}],

					PROPOSED_DT_DONATION: "",
					ORGANIZATION_ADDRESS: "",
					CITY: "",
					STATE: "",
					POSTAL_CODE: "",
					COUNTRY: "",
					LOB: "",
					SUBLOB: "",
					ORGANIZATION_CHECK_1: 2,
					ORGANIZATION_CHECK_2: "Y",
					ORGANIZATION_CHECK_3: 2,
					ORGANIZATION_CHECK_4: 2,
					CONTRIBUTION_QUESTIONNAIRE_1: 2,
					CONTRIBUTION_QUESTIONNAIRE_2: 2,
					CONTRIBUTION_QUESTIONNAIRE_3: "",
					CONTRIBUTION_QUESTIONNAIRE_4: "",
					CONTRIBUTION_QUESTIONNAIRE_5: "",
					CONTRIBUTION_QUESTIONNAIRE_6: "",
					CONTRIBUTION_QUESTIONNAIRE_7: "",
					CONTRIBUTION_QUESTIONNAIRE_8: 2,
					ORGANIZATION_DESCRIPTION: "",
					BUSINESS_RATIONALE_1: "",
					REQUEST_DESCRIPTION: "",
					BUSINESS_AFFILIATION_1: "",
					BUSINESS_AFFILIATION_2: 2,
					BUSINESS_AFFILIATION_3: 2,
					BUSINESS_AFFILIATION_4: 2,
					GOVERNMENT_AFFILIATION_1: 2,
					GOVERNMENT_AFFILIATION_2: 2,
					GOVERNMENT_AFFILIATION_3: 2,
					GOVERNMENT_AFFILIATION_4: 2,
					GOVERNMENT_AFFILIATION_5: 2,
					GOVERNMENT_AFFILIATION_6: 2,
					CONTRIBUTION_QUESTIONNAIRE_1_TEXT: "",
					CONTRIBUTION_QUESTIONNAIRE_2_TEXT: "",
					CONTRIBUTION_QUESTIONNAIRE_8_TEXT: "",
					BUSINESS_AFFILIATION_2_TEXT: "",
					BUSINESS_AFFILIATION_3_TEXT: "",
					BUSINESS_AFFILIATION_4_TEXT: "",
					RED_FLAGS_TEXT: "",
					ORGANIZATION_CHECK_1_TEXT: "",
					GOVERNMENT_AFFILIATION_1_TEXT: "",
					GOVERNMENT_AFFILIATION_2_TEXT: "",
					COMPANY_CODE: "",
					GENERAL_LEDGER: "",
					DATE_SUBMITTED: "",
					STATUS: "",
					TITLE_SRCH: "",
					CREATED_DT: "",
					REQUEST_DATE: "",
					requestmode: Boolean(1),
					PAYMENT_METHOD: "",
					comp_table_mode: Boolean(1),
					CONTACTS: [{
						CONTACT_ID: "",
						CONTACT_NAME: "",
						CONTACT_METHOD: "",
						CONTACT_DETAILS: "",
						can_edit: Boolean(1)
					}],
					approvers: [{
						approved: "",
						approver: "",
						reviewer_type: "",
						approved_by: "",
						approval_date: "",
						approval_time: "",
						manual_addition: false,
						added_by: "",
						added_on: "",
						can_edit: Boolean(0)
					}],
				};
				var oModelTab1 = new sap.ui.model.json.JSONModel();
				oModelTab1.setData(localData);
				oModelTab1.setSizeLimit(1000);
				this.getView().setModel(oModelTab1);
				//calling initial info method to prefill data
				var model = this.getOwnerComponent().getModel("oData");
				var that = this;
				model.read("/eFormInitialInfos('1')", {
					success: function (oData, response) {
						that.getView().byId("PREPARER").setText(response.data.NAME);
						that.getView().byId("ON_BEHALF_OF").setValue(response.data.NAME);
						logger_name = response.data.NAME;
						logged_userid = response.data.USERID;
						that.getView().byId("REQUESTER_PHONE").setValue(response.data.PHONE);
						that.getView().byId("REQUEST_DATE").setText(response.data.DATE);

						var that1 = that;

						var lob = that.getView().byId("ON_BEHALF_OF").getValue();
						var oFilter = new sap.ui.model.Filter(
							"USERID",
							sap.ui.model.FilterOperator.EQ, lob
						);
						model.read("/eFormDepartmentHeads", {
							filters: [oFilter],
							success: function (oData, response) {
								var counter = response.data.results.length;
								var i = 0;
								var oModel = that1.getView().getModel();
								var aRows = oModel.getProperty("/DEPUSERS");
								for (i = 0; i < counter; i++) {
									var item = {
										USERID: response.data.results[i].USERID,
										NAME: response.data.results[i].NAME
									};
									aRows.push(item);
								}
								oModel.setProperty("/DEPUSERS", aRows);
							},
							error: function (oError) {
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
					error: function (oError) {
						var response = JSON.parse(oError.responseText);
						MessageBox.show(
							response.error.message.value,
							MessageBox.Icon.ERROR,
							"Error"
						);
						sap.ui.core.BusyIndicator.hide();
					}
				});
				var model = this.getOwnerComponent().getModel("oData");
				var that = this;
				model.read("/eFormLocCurrencys", {
					success: function (oData, response) {
						var counter = response.data.results.length;
						var i = 0;
						var oModel = that.getView().getModel();
						var aRows = oModel.getProperty("/localcurrency");
						for (i = 0; i < counter; i++) {
							var item = {
								name: response.data.results[i].NAME,
								exch: response.data.results[i].EXCH
							};
							aRows.push(item);
						}
						oModel.setProperty("/localcurrency", aRows);
					},
					error: function (oError) {
						var response = JSON.parse(oError.responseText);
						MessageBox.show(
							response.error.message.value,
							MessageBox.Icon.ERROR,
							"Error"
						);
						sap.ui.core.BusyIndicator.hide();
					}
				});

				//filling users
				var model = this.getOwnerComponent().getModel("oData");
				var that1 = this;
				model.read("/eFormProductionAccts", {
					success: function (oData, response) {
						var counter = response.data.results.length;
						var i = 0;
						var oModel = that1.getView().getModel();
						var aRows = oModel.getProperty("/USERS");
						for (i = 0; i < counter; i++) {
							var item = {
								USERID: response.data.results[i].USERID,
								NAME: response.data.results[i].NAME
							};
							aRows.push(item);
						}
						oModel.setProperty("/USERS", aRows);
					},
					error: function (oError) {
						var response = JSON.parse(oError.responseText);
						MessageBox.show(
							response.error.message.value,
							MessageBox.Icon.ERROR,
							"Error"
						);
						sap.ui.core.BusyIndicator.hide();
					}
				});

				var model = this.getOwnerComponent().getModel("oData");

				var model = this.getOwnerComponent().getModel("oData");
				var that1 = this;
				model.read("/eFormLobs", {
					success: function (oData, response) {
						var counter = response.data.results.length;
						var i = 0;
						var oModel = that1.getView().getModel();
						var aRows = oModel.getProperty("/LOBS");
						for (i = 0; i < counter; i++) {
							var item = {
								LOB: response.data.results[i].LOB,
								SLOB_DESCRIPTION: response.data.results[i].SLOB_DESCRIPTION
							};
							aRows.push(item);
						}
						oModel.setProperty("/LOBS", aRows);
					},
					error: function (oError) {
						var response = JSON.parse(oError.responseText);
						MessageBox.show(
							response.error.message.value,
							MessageBox.Icon.ERROR,
							"Error"
						);
						sap.ui.core.BusyIndicator.hide();
					}
				});

				var model = this.getOwnerComponent().getModel("oData");
				var that1 = this;
				model.read("/eFormCountries", {
					success: function (oData, response) {
						var counter = response.data.results.length;
						var i = 0;
						var oModel = that1.getView().getModel();
						var aRows = oModel.getProperty("/COUNTRIES");
						for (i = 0; i < counter; i++) {
							var item = {
								COUNTRY: response.data.results[i].COUNTRY,
								NAME: response.data.results[i].NAME
							};
							aRows.push(item);
						}
						oModel.setProperty("/COUNTRIES", aRows);
					},
					error: function (oError) {
						var response = JSON.parse(oError.responseText);
						MessageBox.show(
							response.error.message.value,
							MessageBox.Icon.ERROR,
							"Error"
						);
						sap.ui.core.BusyIndicator.hide();
					}
				});

				this.onChangeORGANIZATION_CHECK_1();

				this.onChangeCONTRIBUTION_QUESTIONNAIRE_1();
				this.onChangeCONTRIBUTION_QUESTIONNAIRE_2();
				this.onChangeCONTRIBUTION_QUESTIONNAIRE_8();
				this.onChangeBUSINESS_AFFILIATION_2();
				this.onChangeBUSINESS_AFFILIATION_3();
				this.onChangeBUSINESS_AFFILIATION_4();
				this.onChangeRED_FLAGS();
				this.onChangeGOVERNMENT_AFFILIATION_1();
				this.onChangeGOVERNMENT_AFFILIATION_2();
				this.resetInputFields();
				this.resetAttachments();
				this.resetComments();
				eform_number = "";
				eform_status = "Data Saved";
				//  this.getView().byId("b_approve").setVisible(false);
				//        this.getView().byId("b_reject").setVisible(false);
				this.getView().byId("HOME").setVisible(false);
				this.getView().byId("b_save").setVisible(true);
				this.getView().byId("b_submit").setVisible(true);
				this.getView().byId("b_withdraw").setVisible(false);
				this.getView().byId("b_print").setVisible(true);
				this.getView().byId("b_delete").setVisible(false);
				this.getView().byId("b_edit").setVisible(false);
				var msg1 = " ";
				var oResourceModel = this.getView().getModel("i18n").getResourceBundle();
				var oText = oResourceModel.getText("CharitableDonationForm", [msg1]);
				this.getView().byId("page1").setText(oText);
			} // end of create scenerio
		}, //End of _onObjectMatched
		resetAttachments: function () {
			this.getView().byId("t_attachment1").destroyItems();
			this.getView().byId("t_attachment2").destroyItems();
		},
		resetComments: function () {
			this.getView().byId("t_comment1").destroyItems();
			this.getView().byId("t_comment2").destroyItems();
		},

		onChangeCOUNTRY: function (oEvent) {
			if (oEvent != undefined) {
				this.getView().byId("STATE").setValue("");
			}
			var model = this.getOwnerComponent().getModel("oData");
			var that1 = this;
			var lob = this.getView().byId("COUNTRY").getValue();
			var oFilter = new sap.ui.model.Filter(
				"COUNTRY",
				sap.ui.model.FilterOperator.EQ, lob
			);
			model.read("/eFormStates", {
				filters: [oFilter],
				success: function (oData, response) {
					var counter = response.data.results.length;
					var i = 0;
					var oModel = that1.getView().getModel();

					var aRows = oModel.getProperty("/STATES");

					var no_of_items = aRows.length;
					var t = no_of_items - 1;
					for (i = t; i >= 0; i--) {
						aRows.splice(i, 1);
					}
					oModel.setProperty("/STATES", aRows);

					var aRows = oModel.getProperty("/STATES");
					for (i = 0; i < counter; i++) {
						var item = {
							STATE: response.data.results[i].STATE,
							NAME: response.data.results[i].NAME
						};
						aRows.push(item);
					}
					oModel.setProperty("/STATES", aRows);
				},
				error: function (oError) {
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

		_onprintpress: function (oEvent) {

			if (this.getView().byId("ORGANIZATION_CHECK_1").getSelectedButton() == undefined) {
				var v1 = "Not Selected";
			} else {
				var v1 = this.getView().byId("ORGANIZATION_CHECK_1").getSelectedButton().getText();
			}

			if (this.getView().byId("ORGANIZATION_CHECK_3").getSelectedButton() == undefined) {
				var v2 = "Not Selected";
			} else {
				var v2 = this.getView().byId("ORGANIZATION_CHECK_3").getSelectedButton().getText();
			}

			if (this.getView().byId("ORGANIZATION_CHECK_4").getSelectedButton() == undefined) {
				var v3 = "Not Selected";
			} else {
				var v3 = this.getView().byId("ORGANIZATION_CHECK_4").getSelectedButton().getText();
			}

			if (this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_1").getSelectedButton() == undefined) {
				var v4 = "Not Selected";
			} else {
				var v4 = this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_1").getSelectedButton().getText();
			}

			if (this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_2").getSelectedButton() == undefined) {
				var v5 = "Not Selected";
			} else {
				var v5 = this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_2").getSelectedButton().getText();
			}

			if (this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_8").getSelectedButton() == undefined) {
				var v6 = "Not Selected";
			} else {
				var v6 = this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_8").getSelectedButton().getText();
			}

			if (this.getView().byId("BUSINESS_AFFILIATION_2").getSelectedButton() == undefined) {
				var v7 = "Not Selected";
			} else {
				var v7 = this.getView().byId("BUSINESS_AFFILIATION_2").getSelectedButton().getText();
			}

			if (this.getView().byId("BUSINESS_AFFILIATION_3").getSelectedButton() == undefined) {
				var v8 = "Not Selected";
			} else {
				var v8 = this.getView().byId("BUSINESS_AFFILIATION_3").getSelectedButton().getText();
			}

			if (this.getView().byId("BUSINESS_AFFILIATION_4").getSelectedButton() == undefined) {
				var v9 = "Not Selected";
			} else {
				var v9 = this.getView().byId("BUSINESS_AFFILIATION_4").getSelectedButton().getText();
			}

			if (this.getView().byId("GOVERNMENT_AFFILIATION_1").getSelectedButton() == undefined) {
				var v10 = "Not Selected";
			} else {
				var v10 = this.getView().byId("GOVERNMENT_AFFILIATION_1").getSelectedButton().getText();
			}

			if (this.getView().byId("GOVERNMENT_AFFILIATION_2").getSelectedButton() == undefined) {
				var v11 = "Not Selected";
			} else {
				var v11 = this.getView().byId("GOVERNMENT_AFFILIATION_2").getSelectedButton().getText();
			}

			if (this.getView().byId("GOVERNMENT_AFFILIATION_3").getSelectedButton() == undefined) {
				var v12 = "Not Selected";
			} else {
				var v12 = this.getView().byId("GOVERNMENT_AFFILIATION_3").getSelectedButton().getText();
			}

			if (this.getView().byId("GOVERNMENT_AFFILIATION_4").getSelectedButton() == undefined) {
				var v13 = "Not Selected";
			} else {
				var v13 = this.getView().byId("GOVERNMENT_AFFILIATION_4").getSelectedButton().getText();
			}

			if (this.getView().byId("GOVERNMENT_AFFILIATION_5").getSelectedButton() == undefined) {
				var v14 = "Not Selected";
			} else {
				var v14 = this.getView().byId("GOVERNMENT_AFFILIATION_5").getSelectedButton().getText();
			}

			if (this.getView().byId("GOVERNMENT_AFFILIATION_6").getSelectedButton() == undefined) {
				var v15 = "Not Selected";
			} else {
				var v15 = this.getView().byId("GOVERNMENT_AFFILIATION_6").getSelectedButton().getText();
			}

			var header;
			var table3;
			var commtTable = this.getView().byId("t_comment1").getItems();
			var appTable = this.getView().byId("approvers_table").getItems();

			var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			var attTable = this.getView().byId("t_attachment2").getItems();

			var contactTable = this.getView().byId("CONTACTS").getItems();
			var con_tab = "";

			if (contactTable.length > 0) {

				con_tab = '<center><h3>' + oBundle.getText("ContactInformation") + '</h3></center><hr>'

				+

				"<table width='100%'><tr><td style='border:1px solid black;'>"

				+ oBundle.getText("ContactName") +
					"</td><td style='border:1px solid black;'>"

				+ oBundle.getText("ContactMethod") +
					"</td><td style='border:1px solid black;'>" + oBundle.getText("ContactDetails") +
					" </td></tr>";

				for (var i = 0; i < contactTable.length; i++) {
					con_tab = con_tab + "<tr><td style='border:1px solid black;'>" + contactTable[i].mAggregations.cells[0].getValue() +
						"</td><td style='border:1px solid black;'>" + contactTable[i].mAggregations.cells[1].getValue() +
						"</td><td style='border:1px solid black;'>" +
						contactTable[i].mAggregations.cells[2].getValue() + "</td>" +
						'</tr>';
				}

				con_tab = con_tab + '</table>';

			}

			var table1 = "";
			var tableApprover = "";
			var attachtable = "";
			if (commtTable.length > 0) {
				table1 = '<center><h3>' + oBundle.getText("CommentTitle") + '</h3></center><hr>' +

					"<table width='100%'><tr><td style='border:1px solid black;'>" + oBundle.getText("Id") +
					"</td><td style='border:1px solid black;'>" + oBundle.getText("Comments") + "</td><td style='border:1px solid black;'>" + oBundle
					.getText("AddedBy") +
					" </td>" +
					"<td style='border:1px solid black;'>" + oBundle.getText("AddedOn") +
					"</td></tr>";

				for (var i = 0; i < commtTable.length; i++) {
					table1 = table1 + "<tr><td style='border:1px solid black;'>" + commtTable[i].mAggregations.cells[0].getText() +
						"</td><td style='border:1px solid black;'>" + commtTable[i].mAggregations.cells[1].getValue() +
						"</td><td style='border:1px solid black;'>" +
						commtTable[i].mAggregations.cells[2].getText() + "</td><td style='border:1px solid black;'>" +
						commtTable[i].mAggregations.cells[3].getText() + "</td>" +

						'</tr>';
				}

				table1 = table1 + '</table>';
			}
			if (appTable.length > 0) {
				var tableApprover =

					'<center><h3>Approvers</h3></center><hr>' +

					"<table width='100%'><tr><td style='border:1px solid black;'>" + oBundle.getText("Approved") +
					"</td><td style='border:1px solid black;'>" + oBundle.getText("Approver") +
					"</td><td style='border:1px solid black;'>" + oBundle.getText("ReviewerType") + " </td>" +
					"<td style='border:1px solid black;'>" + oBundle.getText("ApprovedBy") +
					"</td><td style='border:1px solid black;'>" + oBundle.getText("ApprovalDate") + " </td>" + "<td style='border:1px solid black;'>" +
					oBundle.getText("ApprovalTime(PST)") + " </td>" + "<td style='border:1px solid black;'>" +
					oBundle.getText("ManualAddition") + " </td>" + "<td style='border:1px solid black;'>" +
					oBundle.getText("AddedBy") + " </td>" + "<td style='border:1px solid black;'>" +
					oBundle.getText("AddedOn") + " </td>"
				"</tr>";

				for (var i = 0; i < appTable.length; i++) {
					var isApproved = "";
					if (this.getView().getModel().getProperty("/approvers")[i].approved === "X") {
						isApproved = "Yes";
					} else {
						isApproved = "No";
					}

					var isManual = "";
					if (this.getView().getModel().getProperty("/approvers")[i].manual_addition === "X") {
						isManual = "Yes";
					} else {
						isManual = "No";
					}

					tableApprover = tableApprover +
						"<tr><td style='border:1px solid black;'>" + isApproved + "</td><td style='border:1px solid black;'> " + appTable[i].mAggregations
						.cells[1].getText() + "</td><td style='border:1px solid black;'>" +
						appTable[i].mAggregations.cells[2].getText() + "</td><td style='border:1px solid black;'>" +
						appTable[i].mAggregations.cells[3].getText() +
						"</td><td style='border:1px solid black;'>" + appTable[i].mAggregations.cells[4].getText() +
						"</td><td style='border:1px solid black;'>" + appTable[i].mAggregations.cells[5].getText() + " </td>" +
						"<td style='border:1px solid black;'>" + isManual + " </td><td style='border:1px solid black;'>" + appTable[i].mAggregations.cells[
							7].getText() + " </td><td style='border:1px solid black;'>" +
						appTable[i].mAggregations.cells[8].getText() + "</td></tr>";
				}
				tableApprover = tableApprover + "</table>"
			};

			if (attTable.length > 0) {

				attachtable = '<center><h3>' + oBundle.getText("Attachments") + '</h3></center><hr>' +

					"<table width='100%'><tr><td style='border:1px solid black;'>" + oBundle.getText("FileName") +
					"</td><td style='border:1px solid black;'>" + oBundle.getText("CreationDate") + "</td><td style='border:1px solid black;'>" +
					oBundle.getText("CreationTime(PST)") +
					" </td>" +
					"<td style='border:1px solid black;'>" + oBundle.getText("FileSize") +
					"</td><td style='border:1px solid black;'>" + oBundle.getText("Creator") +
					"</td></tr>";

				for (var i = 0; i < commtTable.length; i++) {
					attachtable = attachtable + "<tr><td style='border:1px solid black;'>" + attTable[i].mAggregations.cells[0].getText() +
						"</td><td style='border:1px solid black;'>" + attTable[i].mAggregations.cells[1].getText() +
						"</td><td style='border:1px solid black;'>" +
						attTable[i].mAggregations.cells[2].getText() + "</td><td style='border:1px solid black;'>" +
						attTable[i].mAggregations.cells[3].getText() + "</td>" + "<td style='border:1px solid black;'>" +
						attTable[i].mAggregations.cells[4].getText() + "</td>" +

						'</tr>';
				}

				attachtable = attachtable + '</table>';
			}
			if (this.getView().getModel().getProperty("/card_type") === "Ariba System Card") {
				var s = "<tr><td style='border:1px solid black;'>" + oBundle.getText("EMDTitle") + "</td><td style='border:1px solid black;'>" +

					this.getView().getModel().getProperty("/emd_title") + "</td></tr>" +
					"<tr><td style='border:1px solid black;'>" + oBundle.getText("AribaCardName") + "</td><td style='border:1px solid black;'>" +

					this.getView().getModel().getProperty("/ariba_card_name") + "</td></tr>";
			} else {
				var s = "";
			}

			header =
				'<B>' + this.getView().getModel().getProperty("/EFORM_NUM") + '-</B>' + this.getView().getModel().getProperty("/DESC_PR") + '<BR>' +
				'<center><h3>Title Information</h3></center>' +

				'</br> <hr>' +

				'<B>' + oBundle.getText("Title") + ':</B>' + this.getView().getModel().getProperty("/TITLE") + '<BR>' +

				'<B>' + oBundle.getText("Description") + ':</B>' + this.getView().getModel().getProperty("/DESC_PR") + '<BR>' +

				'<B>' + oBundle.getText("Preparer") + ':</B>' + this.getView().getModel().getProperty("/PREPARER") + '<BR>' +

				'<B>' + oBundle.getText("OnBehalfof") + ':</B>' + this.getView().getModel().getProperty("/ON_BEHALF_OF") + '<BR>' +

				'<B>' + oBundle.getText("RequesterTitle") + ':</B>' + this.getView().getModel().getProperty("/REQUESTER_TITLE") + '<BR>' +

				'<B>' + oBundle.getText("RequesterOfficePhoneNumber") + ':</B>' + this.getView().getModel().getProperty("/REQUESTER_PHONE") +
				'<BR>' +

				'<B>' + oBundle.getText("RequesterOfficeLocation") + ':</B>' + this.getView().getModel().getProperty("/REQUESTER_OFFICE_LOCATION") +
				'<BR>' +

				'<B>' + oBundle.getText("Lob") + ':</B>' + this.getView().getModel().getProperty("/LOB") + '<BR>' +

				'<B>' + oBundle.getText("Sublob") + ':</B>' + this.getView().getModel().getProperty("/SUBLOB") + '<BR>' +

				'<B>' + oBundle.getText("DepartmentHead") + ':</B>' + this.getView().getModel().getProperty("/DEPARTMENT_HEAD") + '<BR>' +

				'<center><h3>' + oBundle.getText("RecipientInformation") + '</h3></center>' +

				'</br> <hr>' +

				'<B>' + oBundle.getText("OrganizationName") + ':</B>' + this.getView().getModel().getProperty("/ORGANIZATION_NAME") + '<BR>' +
				'<B>' + oBundle.getText("AmountandCurrencyDonation") + ':</B>' + this.getView().getModel().getProperty("/AMOUNT_DONATION_USD") +
				'<BR>' +
				'<B>' + oBundle.getText("ProposedDateofDonation") + ':</B>' + this.getView().getModel().getProperty("/PROPOSED_DT_DONATION") +
				'<BR>' +
				'<B>' + oBundle.getText("OrganizationAddress") + ':</B>' + this.getView().getModel().getProperty("/ORGANIZATION_ADDRESS") + '<BR>' +
				'<B>' + oBundle.getText("City") + ':</B>' + this.getView().getModel().getProperty("/CITY") + '<BR>' +
				'<B>' + oBundle.getText("State") + ':</B>' + this.getView().getModel().getProperty("/STATE") + '<BR>' +
				'<B>' + oBundle.getText("PostalCode") + ':</B>' + this.getView().getModel().getProperty("/POSTAL_CODE") + '<BR>' +
				'<B>' + oBundle.getText("Country") + ':</B>' + this.getView().getModel().getProperty("/COUNTRY") + '<BR>' +

				'</br>'

			+ con_tab +

				'</br>' +

				'<B>' + oBundle.getText("Organizationisa501(c)(3)nonprofitagency") + '</B>' + v1 + '<BR>' +
				this.getView().byId("ORGANIZATION_CHECK_1_TEXT").getValue() + '<BR>' +
				'<B>' + oBundle.getText("SPEhaspreviouslydonatedtothisorganization") + '</B>' + v2 + '<BR>' +
				'<B>' + oBundle.getText("HighRiskDueDiligence1") + oBundle.getText("AntiBriberyPolicy") + oBundle.getText("HighRiskDueDiligence2") +
				'</B>' + v3 + '<BR>' +
				'<B>' + oBundle.getText("IsthisOrganizationconsidered") + ':</B>' + v4 + '<BR>' +

				'<center><h3>' + oBundle.getText("ContributionQuestionnaire") + '</h3></center>' +

				'</br> <hr>' +
				'<B>' + oBundle.getText("AreSPEowneditems") + ':</B>' + v5 + '<BR>' + this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_2_TEXT").getValue() +
				'<BR>' +
				'<B>' + oBundle.getText("PaymentMethod1") + ':</B>' + this._getPaymentItems() + '<BR>' +
				'<B>' + oBundle.getText("IsContribution") + ':</B>' + v6 + '<BR>' + this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_8_TEXT").getValue() +
				'<BR>' +
				'<B>' + oBundle.getText("DescriptionoftheOrganization") + ':</B>' + this.getView().byId("ORGANIZATION_DESCRIPTION").getValue() +
				'<BR>' +
				'<B>' + oBundle.getText("DescriptionofRequest(grant/program/event1") + ':</B>' + this.getView().byId("REQUEST_DESCRIPTION").getValue() +
				'<BR>' +

				'<center><h3>' + oBundle.getText("Employee/BusinessAffiation") + '</h3></center>' +
				'</br> <hr>' +
				'<B>' + oBundle.getText("Whatisthebusinessrationale1") + oBundle.getText("AntiBriberyPolicy") + oBundle.getText(
					"Whatisthebusinessrationale2") + ':</B>' + '<BR>' +
				this.getView().byId("BUSINESS_RATIONALE_1").getValue() + '<BR>' +
				'<B>' + oBundle.getText("AreanySPEEmployeesinvolvedintheeffort") + '</B>' + '<BR>' +
				this.getView().byId("BUSINESS_AFFILIATION_1").getValue() + '<BR>' +

				'<B>' + oBundle.getText("DoesanyoneatSPEhave") + ':</B>' +
				v7 + '<BR>' + this.getView().byId("BUSINESS_AFFILIATION_2_TEXT").getValue() + '<BR>' +

				'<B>' + oBundle.getText("Willtherebeanyadvertising") + ':</B>' +
				v8 + '<BR>' + this.getView().byId("BUSINESS_AFFILIATION_3_TEXT").getValue() + '<BR>' +

				'<B>' + oBundle.getText("Arethereanypendingoranticipateddecisions1") + oBundle.getText("AntiBriberyPolicy") + oBundle.getText(
					"Arethereanypendingoranticipateddecisions2") + '</B>' +
				v9 + '<BR>' + this.getView().byId("BUSINESS_AFFILIATION_4_TEXT").getValue() + '<BR>' +

				'<center><h3>Government Affiliation</h3></center>' + '</br> <hr>' +

				oBundle.getText("AntiBriberyPolicy") + '<BR>' +
				'<B>' + oBundle.getText("IsthedonationconsistentwithSPE1") + oBundle.getText("IsthedonationconsistentwithSPE2") + ':</B>' +
				v10 + '<BR>' +
				this.getView().byId("GOVERNMENT_AFFILIATION_1_TEXT").getValue() + '<BR>' +
				'<B>' + oBundle.getText("Isthereanyknownrelationship1") + oBundle.getText("Isthereanyknownrelationship2") + oBundle.getText(
					"AntiBriberyPolicy") + oBundle.getText("Isthereanyknownrelationship3") + ':</B>' +
				v11 + '<BR>' +
				this.getView().byId("GOVERNMENT_AFFILIATION_2_TEXT").getValue() + '<BR>' +
				'<B>' + oBundle.getText("Thedonationandintended") + ':</B>' +
				v12 + '<BR>' +
				'<B>' + oBundle.getText("AGovernmentOfficialwhoisadecision1") + oBundle.getText("AGovernmentOfficialwhoisadecision2") + '</B>' +
				v13 + '<BR>' +
				'<B>' + oBundle.getText("Isthereanysuggestion") + ':</B>' +
				v14 + '<BR>' +
				'<B>' + oBundle.getText("AnyadditionalRedFlag1") + oBundle.getText("AntiBriberyPolicy") + oBundle.getText("AnyadditionalRedFlag2") +
				':</B>' +
				v15 + '<BR>' +
				this.getView().byId("RED_FLAGS_TEXT").getValue() + '<BR>';

			var cltstrng = "width=500px,height=600px";
			var wind = window.open("", cltstrng);

			wind.document.write(header + tableApprover + table1);
			wind.print();

		},

		onChangeComboBox: function (oEvent) {
			var newval = oEvent.getParameter("newValue");
			var key = oEvent.getSource().getSelectedItem();

			if (newval !== "" && key === null) {
				oEvent.getSource().setValue("");
				oEvent.getSource().setValueState("Error");
			} else {
				oEvent.getSource().setValueState("None");
			}
		},

		navigate_inbox: function () {
            	// S4R:PJAIN6:GWDK902351:07/22/2021:Replacing old url with new url:START   
			// window.open("/sap/bc/ui5_ui5/ui2/ushell/shells/abap/Fiorilaunchpad.html", "_self");
               window.open("/sap/bc/ui2/flp", "_self");
               	// S4R:PJAIN6:GWDK902351:07/22/2021:Replacing old url with new url:END
			window.close();
		},

		onChangeOnBehalfOf: function () {

			var user = this.getView().byId("ON_BEHALF_OF").getSelectedItem().getAdditionalText();

			if (user) {
				this.getView().byId("DEPARTMENT_HEAD").setValue("");
				var model = this.getOwnerComponent().getModel("oData");
				var that3 = this;

				model.read("/eFormProductionAccts('" + user + "')", {
					success: function (oData, response) {
						that3.getView().byId("REQUESTER_PHONE").setValue(oData.PHONE);
					},
					error: function (oError) {
						var response = JSON.parse(oError.responseText);
						MessageBox.show(
							response.error.message.value,
							MessageBox.Icon.ERROR,
							"Error"
						);
						sap.ui.core.BusyIndicator.hide();
					}
				});

				var model = this.getOwnerComponent().getModel("oData");
				var that1 = this;
				var lob = this.getView().byId("ON_BEHALF_OF").getValue();
				var oFilter = new sap.ui.model.Filter(
					"USERID",
					sap.ui.model.FilterOperator.EQ, lob
				);
				model.read("/eFormDepartmentHeads", {
					filters: [oFilter],
					success: function (oData, response) {
						var counter = response.data.results.length;
						var i = 0;
						var oModel = that1.getView().getModel();

						var aRows = oModel.getProperty("/DEPUSERS");

						var no_of_items = aRows.length;
						var t = no_of_items - 1;
						for (i = t; i >= 0; i--) {
							aRows.splice(i, 1);
						}
						oModel.setProperty("/DEPUSERS", aRows);

						var aRows = oModel.getProperty("/DEPUSERS");
						for (i = 0; i < counter; i++) {
							var item = {
								USERID: response.data.results[i].USERID,
								NAME: response.data.results[i].NAME
							};
							aRows.push(item);
						}
						oModel.setProperty("/DEPUSERS", aRows);
					},
					error: function (oError) {
						var response = JSON.parse(oError.responseText);
						MessageBox.show(
							response.error.message.value,
							MessageBox.Icon.ERROR,
							"Error"
						);
						sap.ui.core.BusyIndicator.hide();
					}
				});

			}

		},

		_onLiveChange_Business_phone: function (oEvent) {
			//  var value = this.getView().byId("REQUESTER_PHONE").getValue();
			var value = oEvent.getParameter("value");
			if (value !== "") {
				var regx = /[^0-9-]/g;

				var res = regx.test(value);
				if (res === true) {
					var result = value.match(regx);
					var substr = value.replace(result, '');
					oEvent.getSource().setValue(substr);
				}
			}

		},

		_onRefreshApprovers: function (oEvent) {
			if (eform_number != "") {
				var model = this.getOwnerComponent().getModel("oData");
				var relPath = "/eFormApprovers";
				var that1 = this;
				var oFilter = new sap.ui.model.Filter(
					"EFORM_NUM",
					sap.ui.model.FilterOperator.EQ, eform_number
				);
				model.read(relPath, {
					filters: [oFilter],
					success: function (oData, response) {
						var counter = oData.results.length;
						var i = 0;
						var oMod = that1.getView().getModel();
						var apRows = oMod.getProperty("/approvers");
						var no_of_items = apRows.length;
						var t = no_of_items - 1;
						for (i = t; i >= 0; i--) {
							apRows.splice(i, 1);
						}
						oMod.setProperty("/approvers", apRows);
						//oTable.destroyItems();
						for (i = 0; i < counter; i++) {
							var item = {
								approved: oData.results[i].APPROVED,
								approver: oData.results[i].APPR,
								reviewer_type: oData.results[i].REVIEWER_TYPE,
								approved_by: oData.results[i].APPROVED_BY,
								approval_date: oData.results[i].APPROVAL_DT,
								approval_time: oData.results[i].APPROVAL_TM,
								manual_addition: oData.results[i].MANUAL,
								added_by: oData.results[i].ADDED_BY,
								added_on: oData.results[i].CREATION_DT,
								can_edit: Boolean(0)
							};
							apRows.push(item);
						}
						oMod.setProperty("/approvers", apRows);
					},
					error: function (oError) {
						var response = JSON.parse(oError.responseText);
						MessageBox.show(
							response.error.message.value,
							MessageBox.Icon.ERROR,
							"Error"
						);
						sap.ui.core.BusyIndicator.hide();
					}
				});
			}
		},

		displayfields: function () {
			this.resetInputFields();
			var model = this.getOwnerComponent().getModel("oData");
			var relPath = "/eFormHeaders";
			var that = this;
			if (copy_case !== "X") {
				this.approve_reject_button_dsp();
			}
			var oFilter = new sap.ui.model.Filter(
				"EFORM_NUM",
				sap.ui.model.FilterOperator.EQ, eform_number
			);
			model.read(relPath, {
				filters: [oFilter],
				urlParameters: {
					"$expand": "header_contacts"
				},
				success: function (oData, response) {
					//creating local json model
					var localData = {
						EFORM_NUM: oData.results[0].EFORM_NUM,
						REQUEST_DATE: oData.results[0].REQUEST_DATE,
						TITLE: oData.results[0].TITLE,
						DESC_PR: oData.results[0].DESC_PR,
						PREPARER: oData.results[0].PREPARER,
						ON_BEHALF_OF: oData.results[0].ON_BEHALF_OF,
						REQUESTER_TITLE: oData.results[0].REQUESTER_TITLE,
						REQUESTER_PHONE: oData.results[0].REQUESTER_PHONE,
						REQUESTER_OFFICE_LOCATION: oData.results[0].REQUESTER_OFFICE_LOCATION,
						DEPARTMENT: oData.results[0].DEPARTMENT,
						DEPARTMENT_HEAD: oData.results[0].DEPARTMENT_HEAD,
						ORGANIZATION_NAME: oData.results[0].ORGANIZATION_NAME,
						AMOUNT_DONATION: new Intl.NumberFormat('en-US').format(oData.results[0].AMOUNT_DONATION),
						AMOUNT_DONATION_USD: new Intl.NumberFormat('en-US').format(oData.results[0].AMOUNT_DONATION_USD),
						CURRENCY: oData.results[0].CURRENCY,
						PROPOSED_DT_DONATION: oData.results[0].PROPOSED_DT_DONATION,
						ORGANIZATION_ADDRESS: oData.results[0].ORGANIZATION_ADDRESS,
						CITY: oData.results[0].CITY,
						STATE: oData.results[0].STATE,
						POSTAL_CODE: oData.results[0].POSTAL_CODE,
						COUNTRY: oData.results[0].COUNTRY,
						LOB: oData.results[0].LOB,
						SUBLOB: oData.results[0].SUBLOB,
						ORGANIZATION_CHECK_1: parseInt(oData.results[0].ORGANIZATION_CHECK_1),
						ORGANIZATION_CHECK_2: oData.results[0].ORGANIZATION_CHECK_2,
						ORGANIZATION_CHECK_3: parseInt(oData.results[0].ORGANIZATION_CHECK_3),
						ORGANIZATION_CHECK_4: parseInt(oData.results[0].ORGANIZATION_CHECK_4),
						CONTRIBUTION_QUESTIONNAIRE_1: parseInt(oData.results[0].CONTRIBUTION_QUESTIONNAIRE_1),
						CONTRIBUTION_QUESTIONNAIRE_2: parseInt(oData.results[0].CONTRIBUTION_QUESTIONNAIRE_2),
						CONTRIBUTION_QUESTIONNAIRE_3: oData.results[0].CONTRIBUTION_QUESTIONNAIRE_3,
						CONTRIBUTION_QUESTIONNAIRE_4: oData.results[0].CONTRIBUTION_QUESTIONNAIRE_4,
						CONTRIBUTION_QUESTIONNAIRE_5: oData.results[0].CONTRIBUTION_QUESTIONNAIRE_5,
						CONTRIBUTION_QUESTIONNAIRE_6: oData.results[0].CONTRIBUTION_QUESTIONNAIRE_6,
						CONTRIBUTION_QUESTIONNAIRE_7: oData.results[0].CONTRIBUTION_QUESTIONNAIRE_7,
						CONTRIBUTION_QUESTIONNAIRE_8: parseInt(oData.results[0].CONTRIBUTION_QUESTIONNAIRE_8),
						ORGANIZATION_DESCRIPTION: oData.results[0].ORGANIZATION_DESCRIPTION,
						BUSINESS_RATIONALE_1: oData.results[0].BUSINESS_RATIONALE_1,
						REQUEST_DESCRIPTION: oData.results[0].REQUEST_DESCRIPTION,
						BUSINESS_AFFILIATION_1: oData.results[0].BUSINESS_AFFILIATION_1,
						BUSINESS_AFFILIATION_2: parseInt(oData.results[0].BUSINESS_AFFILIATION_2),
						BUSINESS_AFFILIATION_3: parseInt(oData.results[0].BUSINESS_AFFILIATION_3),
						BUSINESS_AFFILIATION_4: parseInt(oData.results[0].BUSINESS_AFFILIATION_4),
						GOVERNMENT_AFFILIATION_1: parseInt(oData.results[0].GOVERNMENT_AFFILIATION_1),
						GOVERNMENT_AFFILIATION_2: parseInt(oData.results[0].GOVERNMENT_AFFILIATION_2),
						GOVERNMENT_AFFILIATION_3: parseInt(oData.results[0].GOVERNMENT_AFFILIATION_3),
						GOVERNMENT_AFFILIATION_4: parseInt(oData.results[0].GOVERNMENT_AFFILIATION_4),
						GOVERNMENT_AFFILIATION_5: parseInt(oData.results[0].GOVERNMENT_AFFILIATION_5),
						GOVERNMENT_AFFILIATION_6: parseInt(oData.results[0].GOVERNMENT_AFFILIATION_6),
						CONTRIBUTION_QUESTIONNAIRE_1_TEXT: oData.results[0].CONTRIBUTION_QUESTIONNAIRE_1_TEXT,
						CONTRIBUTION_QUESTIONNAIRE_2_TEXT: oData.results[0].CONTRIBUTION_QUESTIONNAIRE_2_TEXT,
						CONTRIBUTION_QUESTIONNAIRE_8_TEXT: oData.results[0].CONTRIBUTION_QUESTIONNAIRE_8_TEXT,
						BUSINESS_AFFILIATION_2_TEXT: oData.results[0].BUSINESS_AFFILIATION_2_TEXT,
						BUSINESS_AFFILIATION_3_TEXT: oData.results[0].BUSINESS_AFFILIATION_3_TEXT,
						BUSINESS_AFFILIATION_4_TEXT: oData.results[0].BUSINESS_AFFILIATION_4_TEXT,
						RED_FLAGS_TEXT: oData.results[0].RED_FLAGS_TEXT,
						ORGANIZATION_CHECK_1_TEXT: oData.results[0].ORGANIZATION_CHECK_1_TEXT,
						GOVERNMENT_AFFILIATION_1_TEXT: oData.results[0].GOVERNMENT_AFFILIATION_1_TEXT,
						GOVERNMENT_AFFILIATION_2_TEXT: oData.results[0].GOVERNMENT_AFFILIATION_2_TEXT,

						COMPANY_CODE: oData.results[0].COMPANY_CODE,
						GENERAL_LEDGER: oData.results[0].GENERAL_LEDGER,
						DATE_SUBMITTED: oData.results[0].DATE_SUBMITTED,
						STATUS: oData.results[0].STATUS,
						TITLE_SRCH: oData.results[0].TITLE_SRCH,
						CREATED_DT: oData.results[0].CREATED_DT,
						REQUEST_DATE: oData.results[0].REQUEST_DATE,
						PAYMENT_METHOD: "",
						requestmode: Boolean(0),
						comp_table_mode: Boolean(0),
						CONTACTS: [{
							CONTACT_ID: "",
							CONTACT_NAME: "",
							CONTACT_METHOD: "",
							CONTACT_DETAILS: "",
							can_edit: Boolean(0)
						}],
						localcurrency: [{
							name: "",
							exch: ""
						}],

						USERS: [{
							USERID: "",
							NAME: ""
						}],

						DEPUSERS: [{
							USERID: "",
							NAME: ""
						}],

						LOBS: [{
							LOB: "",
							SLOB_DESCRIPTION: ""
						}],

						SUBLOBS: [{
							SUBLOB: "",
							SLOB_DESCRIPTION: ""
						}],

						COUNTRIES: [{
							COUNTRY: "",
							NAME: ""
						}],

						STATES: [{
							STATE: "",
							NAME: ""
						}],

						approvers: [{
							approved: "",
							approver: "",
							reviewer_type: "",
							approved_by: "",
							approval_date: "",
							approval_time: "",
							manual_addition: false,
							added_by: "",
							added_on: "",
							can_edit: Boolean(0)
						}],
					};
					var oModelTab = new sap.ui.model.json.JSONModel();
					oModelTab.setData(localData);
					oModelTab.setSizeLimit(1000);
					that.getView().setModel(oModelTab);
					eform_number = oData.results[0].EFORM_NUM;
					eform_status = oData.results[0].STATUS;
					//payment method add

					if (oData.results[0].PAYMENT_METHOD != "") {
						var paycheck = oData.results[0].PAYMENT_METHOD;
						var array = paycheck.split(',');
						var newval = [];
						for (var i = 0; i < array.length; i++) {

							switch (array[i]) {

							case "Check":
								newval.push("0");
								break;
							case "ACH":
								newval.push("1");
								break;
							case "Wire":
								newval.push("2");
								break;
							case "Non-Cash":
								newval.push("3");
								break;
							}

						}
						that.getView().byId("PAYMENT_METHOD").setSelectedKeys(newval);
						that.getView().byId("PAYMENT_METHOD_S").setText(oData.results[0].PAYMENT_METHOD);
					}
					that.onChangeORGANIZATION_CHECK_1();
					that.onChangeCONTRIBUTION_QUESTIONNAIRE_1();
					that.onChangeCONTRIBUTION_QUESTIONNAIRE_2();
					that.onChangeCONTRIBUTION_QUESTIONNAIRE_8();
					that.onChangeBUSINESS_AFFILIATION_2();
					that.onChangeBUSINESS_AFFILIATION_3();
					that.onChangeBUSINESS_AFFILIATION_4();
					that.onChangeGOVERNMENT_AFFILIATION_1();
					that.onChangeGOVERNMENT_AFFILIATION_2();
					that.onChangeRED_FLAGS();

					that.getView().byId("b_delete").setVisible(true);
					that.getView().byId("b_edit").setVisible(true);

					if (eform_status == "Approved") {
						//   that.getView().byId("b_approve").setVisible(false);
						//   that.getView().byId("b_reject").setVisible(false);
						that.getView().byId("HOME").setVisible(false);
						that.getView().byId("b_save").setVisible(false);
						that.getView().byId("b_submit").setVisible(false);
						that.getView().byId("b_withdraw").setVisible(false);
						that.getView().byId("b_print").setVisible(true);
						if (window.top.location.href.toLowerCase().indexOf("fiorilaunchpad") == -1) {
							// S4R:PJAIN6:GWDK902351:07/22/2021:Seting visibility of home icon false:START
							// that.getView().byId("HOME").setVisible(true);
							   that.getView().byId("HOME").setVisible(false);
							// S4R:PJAIN6:GWDK902351:07/22/2021:Seting visibility of home icon false:END   
						}
					}
					if (eform_status == "In Approval") {
						//       that.getView().byId("b_approve").setVisible(true);
						//       that.getView().byId("b_reject").setVisible(true);
						if (window.top.location.href.toLowerCase().indexOf("fiorilaunchpad") == -1) {
							// that.getView().byId("HOME").setVisible(true);
							that.getView().byId("HOME").setVisible(false);
						}

						that.getView().byId("b_save").setVisible(true);
						that.getView().byId("b_submit").setVisible(false);
						that.getView().byId("b_withdraw").setVisible(true);
						that.getView().byId("b_print").setVisible(true);

					}

					if (eform_status == "Data Saved" || eform_status == "Withdrawn") {
						//        that.getView().byId("b_approve").setVisible(false);
						//        that.getView().byId("b_reject").setVisible(false);
						that.getView().byId("HOME").setVisible(false);
						that.getView().byId("b_save").setVisible(true);
						that.getView().byId("b_submit").setVisible(true);
						that.getView().byId("b_withdraw").setVisible(false);
						that.getView().byId("b_print").setVisible(true);

					}

					if (eform_status == "Rejected") {
						//         that.getView().byId("b_approve").setVisible(true);
						//        that.getView().byId("b_reject").setVisible(false);
						if (window.top.location.href.toLowerCase().indexOf("fiorilaunchpad") == -1) {
							// S4R:PJAIN6:GWDK902351:07/22/2021:Seting visibility of home icon false:START
							// that.getView().byId("HOME").setVisible(true);
							   that.getView().byId("HOME").setVisible(false);
						    // S4R:PJAIN6:GWDK902351:07/22/2021:Seting visibility of home icon false:END	   
						}
						that.getView().byId("b_save").setVisible(true);
						that.getView().byId("b_submit").setVisible(false);
						that.getView().byId("b_withdraw").setVisible(true);
						that.getView().byId("b_print").setVisible(true);

					}

					// filling contacts
					var oTable = that.getView().byId("CONTACTS");
					window.oModel = that.getView().getModel();
					var aRows = that.getView().getModel().getProperty("/CONTACTS");
					var counter = response.data.results[0]["header_contacts"].results.length;
					var i = 0;
					var no_of_items = aRows.length;
					var t = no_of_items - 1;
					for (i = t; i >= 0; i--) {
						aRows.splice(i, 1);
					}
					window.oModel.setProperty("/CONTACTS", aRows);
					for (i = 0; i < counter; i++) {
						var item = {
							CONTACT_NAME: response.data.results[0]["header_contacts"].results[i].CONTACT_NAME,
							CONTACT_METHOD: response.data.results[0]["header_contacts"].results[i].CONTACT_METHOD,
							CONTACT_DETAILS: response.data.results[0]["header_contacts"].results[i].CONTACT_DETAILS,
						}; // an empty object
						aRows.push(item);
					}
					window.oModel.setProperty("/CONTACTS", aRows);
					// filling local currencies
					var model = that.getOwnerComponent().getModel("oData");
					var that1 = that;
					model.read("/eFormLocCurrencys", {
						success: function (oData, response) {
							var counter = response.data.results.length;
							var i = 0;
							var oModel = that1.getView().getModel();
							var aRows = oModel.getProperty("/localcurrency");
							for (i = 0; i < counter; i++) {
								var item = {
									name: response.data.results[i].NAME,
									exch: response.data.results[i].EXCH
								};
								aRows.push(item);
							}
							oModel.setProperty("/localcurrency", aRows);
						},
						error: function (oError) {
							var response = JSON.parse(oError.responseText);
							MessageBox.show(
								response.error.message.value,
								MessageBox.Icon.ERROR,
								"Error"
							);
							sap.ui.core.BusyIndicator.hide();
						}
					});

					var model = that.getOwnerComponent().getModel("oData");
					var that1 = that;
					var user1 = that.getView().byId("ON_BEHALF_OF").getValue();
					var oFilter = new sap.ui.model.Filter(
						"USERID",
						sap.ui.model.FilterOperator.EQ, user1
					);
					model.read("/eFormDepartmentHeads", {
						filters: [oFilter],
						success: function (oData, response) {
							var counter = response.data.results.length;
							var i = 0;
							var oModel = that1.getView().getModel();
							var aRows = oModel.getProperty("/DEPUSERS");
							for (i = 0; i < counter; i++) {
								var item = {
									USERID: response.data.results[i].USERID,
									NAME: response.data.results[i].NAME
								};
								aRows.push(item);
							}
							oModel.setProperty("/DEPUSERS", aRows);
						},
						error: function (oError) {
							var response = JSON.parse(oError.responseText);
							MessageBox.show(
								response.error.message.value,
								MessageBox.Icon.ERROR,
								"Error"
							);
							sap.ui.core.BusyIndicator.hide();
						}
					});

					//filling users
					var model = that.getOwnerComponent().getModel("oData");
					var that1 = that;
					model.read("/eFormProductionAccts", {
						success: function (oData, response) {
							var counter = response.data.results.length;
							var i = 0;
							var oModel = that1.getView().getModel();
							var aRows = oModel.getProperty("/USERS");
							for (i = 0; i < counter; i++) {
								var item = {
									USERID: response.data.results[i].USERID,
									NAME: response.data.results[i].NAME
								};
								aRows.push(item);
							}
							oModel.setProperty("/USERS", aRows);
						},
						error: function (oError) {
							var response = JSON.parse(oError.responseText);
							MessageBox.show(
								response.error.message.value,
								MessageBox.Icon.ERROR,
								"Error"
							);
							sap.ui.core.BusyIndicator.hide();
						}
					});

					//filling lob

					var model = that.getOwnerComponent().getModel("oData");
					var that1 = that;
					model.read("/eFormLobs", {
						success: function (oData, response) {
							var counter = response.data.results.length;
							var i = 0;
							var oModel = that1.getView().getModel();
							var aRows = oModel.getProperty("/LOBS");
							for (i = 0; i < counter; i++) {
								var item = {
									LOB: response.data.results[i].LOB,
									SLOB_DESCRIPTION: response.data.results[i].SLOB_DESCRIPTION
								};
								aRows.push(item);
							}
							oModel.setProperty("/LOBS", aRows);
						},
						error: function (oError) {
							var response = JSON.parse(oError.responseText);
							MessageBox.show(
								response.error.message.value,
								MessageBox.Icon.ERROR,
								"Error"
							);
							sap.ui.core.BusyIndicator.hide();
						}
					});

					that.onChangeLOB();

					var model = that.getOwnerComponent().getModel("oData");
					var that1 = that;
					model.read("/eFormCountries", {
						success: function (oData, response) {
							var counter = response.data.results.length;
							var i = 0;
							var oModel = that1.getView().getModel();
							var aRows = oModel.getProperty("/COUNTRIES");
							for (i = 0; i < counter; i++) {
								var item = {
									COUNTRY: response.data.results[i].COUNTRY,
									NAME: response.data.results[i].NAME
								};
								aRows.push(item);
							}
							oModel.setProperty("/COUNTRIES", aRows);
						},
						error: function (oError) {
							var response = JSON.parse(oError.responseText);
							MessageBox.show(
								response.error.message.value,
								MessageBox.Icon.ERROR,
								"Error"
							);
							sap.ui.core.BusyIndicator.hide();
						}
					});

					that.onChangeCOUNTRY();

					// copy case scenerio
					if (copy_case == "X") {
						eform_number = "";
						eform_status = "Data Saved";
						var oModel = that.getView().getModel();
						var editmode = oModel.getProperty("/requestmode");
						editmode = Boolean(1);
						oModel.setProperty("/requestmode", editmode);

						var editmode = oModel.getProperty("/comp_table_mode");
						editmode = Boolean(1);
						oModel.setProperty("/comp_table_mode", editmode);

						var msg1 = " ";
						var oResourceModel = that.getView().getModel("i18n").getResourceBundle();
						var oText = oResourceModel.getText("CharitableDonationForm", [msg1]);
						that.getView().byId("page1").setText(oText);

						that.getView().byId("b_delete").setVisible(false);
						that.getView().byId("b_edit").setVisible(false);
						//        that.getView().byId("b_approve").setVisible(false);
						//        that.getView().byId("b_reject").setVisible(false);
						that.getView().byId("HOME").setVisible(false);
						that.getView().byId("b_save").setVisible(true);
						that.getView().byId("b_submit").setVisible(true);
						that.getView().byId("b_withdraw").setVisible(false);
						that.getView().byId("b_print").setVisible(true);

						var model = that.getOwnerComponent().getModel("oData");
						var that1 = that;
						model.read("/eFormInitialInfos('1')", {
							success: function (oData, response) {
								that.getView().byId("PREPARER").setText(response.data.NAME);
								that.getView().byId("ON_BEHALF_OF").setValue(response.data.NAME);
								logger_name = response.data.NAME;
								logged_userid = response.data.USERID;
								that.getView().byId("TITLE").setValue("Untitled Charitable Expenditure Request");
								that.getView().byId("REQUESTER_PHONE").setValue(response.data.PHONE);
								that.getView().byId("REQUEST_DATE").setText(response.data.DATE);
							},
							error: function (oError) {
								var response = JSON.parse(oError.responseText);
								MessageBox.show(
									response.error.message.value,
									MessageBox.Icon.ERROR,
									"Error"
								);
								sap.ui.core.BusyIndicator.hide();
							}
						});

					} else {
						// fetching logger in user
						var model = that.getOwnerComponent().getModel("oData");
						var that1 = that;
						model.read("/eFormInitialInfos('1')", {
							success: function (oData, response) {
								logger_name = response.data.NAME;
								logged_userid = response.data.USERID;
							},
							error: function (oError) {
								var response = JSON.parse(oError.responseText);
								MessageBox.show(
									response.error.message.value,
									MessageBox.Icon.ERROR,
									"Error"
								);
								sap.ui.core.BusyIndicator.hide();
							}
						});
						//fill approvers from backend
						that.fillApprovers(that);
						// fill comments from backend
						that.fillComments(that);
						// fill attachments from backend
						that.fillAttachments(that);
						var msg1 = eform_number;
						var oResourceModel = that.getView().getModel("i18n").getResourceBundle();
						var oText = oResourceModel.getText("CharitableDonationForm", [msg1]);
						that.getView().byId("page1").setText(oText);

						var model = that.getOwnerComponent().getModel("oData");
						var that90 = that;
						model.read("/eFormInitialInfos('" + eform_number + "')", {
							success: function (oData, response) {

								if (response.data.CSR == "X") {
									// edit is allowed
									var oModel = that90.getView().getModel();
									var editmode = oModel.getProperty("/requestmode");
									editmode = Boolean(1);
									oModel.setProperty("/requestmode", editmode);
									var editmode = oModel.getProperty("/requestmode");
									editmode = Boolean(1);
									oModel.setProperty("/comp_table_mode", editmode);

									if (response.data.STATUS == "Data Saved" || response.data.STATUS == "Withdrawn") {

										//       that90.getView().byId("b_approve").setVisible(false);
										//                   that90.getView().byId("b_reject").setVisible(false);
										that90.getView().byId("HOME").setVisible(false);
										that90.getView().byId("b_save").setVisible(true);
										that90.getView().byId("b_submit").setVisible(true);
										that90.getView().byId("b_withdraw").setVisible(false);
										that90.getView().byId("b_print").setVisible(true);

									}

									if (response.data.STATUS == "Rejected") {

										//      that90.getView().byId("b_approve").setVisible(true);
										//      that90.getView().byId("b_reject").setVisible(false);
										if (window.top.location.href.toLowerCase().indexOf("fiorilaunchpad") == -1) {
											// S4R:PJAIN6:GWDK902351:07/22/2021:Seting visibility of home icon false:START
											// that90.getView().byId("HOME").setVisible(true);
											that90.getView().byId("HOME").setVisible(false);
											// S4R:PJAIN6:GWDK902351:07/22/2021:Seting visibility of home icon false:END
										}
										that90.getView().byId("b_save").setVisible(true);
										that90.getView().byId("b_submit").setVisible(false);
										that90.getView().byId("b_withdraw").setVisible(true);
										that90.getView().byId("b_print").setVisible(true);

									}

									if (response.data.STATUS == "In Approval") {

										//      that90.getView().byId("b_approve").setVisible(true);
										//                  that90.getView().byId("b_reject").setVisible(true);

										if (window.top.location.href.toLowerCase().indexOf("fiorilaunchpad") == -1) {
											// S4R:PJAIN6:GWDK902351:07/22/2021:Seting visibility of home icon false:START
											// that90.getView().byId("HOME").setVisible(true);
											   that90.getView().byId("HOME").setVisible(false);
											// S4R:PJAIN6:GWDK902351:07/22/2021:Seting visibility of home icon false:END   
										}

										//  that90.getView().byId("HOME").setVisible(true);
										that90.getView().byId("b_save").setVisible(true);
										that90.getView().byId("b_submit").setVisible(false);
										that90.getView().byId("b_withdraw").setVisible(true);
										that90.getView().byId("b_print").setVisible(true);

									}

									if (response.data.STATUS == "Approved") {

										//               that90.getView().byId("b_approve").setVisible(false);
										//               that90.getView().byId("b_reject").setVisible(false);

										if (window.top.location.href.toLowerCase().indexOf("fiorilaunchpad") == -1) {
											// S4R:PJAIN6:GWDK902351:07/22/2021:Seting visibility of home icon false:START
											// that90.getView().byId("HOME").setVisible(true);
											that90.getView().byId("HOME").setVisible(false);
											// S4R:PJAIN6:GWDK902351:07/22/2021:Seting visibility of home icon false:END
										}

										//  that90.getView().byId("HOME").setVisible(true);
										that90.getView().byId("b_save").setVisible(false);
										that90.getView().byId("b_submit").setVisible(false);
										that90.getView().byId("b_withdraw").setVisible(false);
										that90.getView().byId("b_print").setVisible(true);

									}

								}

							},
							error: function (oError) {
								var response = JSON.parse(oError.responseText);
								MessageBox.show(
									response.error.message.value,
									MessageBox.Icon.ERROR,
									"Error"
								);
								sap.ui.core.BusyIndicator.hide();
							}
						});

					}
				},
				error: function (oError) {
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

		onChangeLOB: function (oEvent) {

			if (oEvent != undefined) {
				this.getView().byId("SUBLOB").setValue("");
			}

			var model = this.getOwnerComponent().getModel("oData");
			var that1 = this;
			var lob = this.getView().byId("LOB").getValue();
			var oFilter = new sap.ui.model.Filter(
				"LOB",
				sap.ui.model.FilterOperator.EQ, lob
			);
			model.read("/eFormLobs", {
				filters: [oFilter],
				success: function (oData, response) {
					var counter = response.data.results.length;
					var i = 0;
					var oModel = that1.getView().getModel();

					var aRows = oModel.getProperty("/SUBLOBS");

					var no_of_items = aRows.length;
					var t = no_of_items - 1;
					for (i = t; i >= 0; i--) {
						aRows.splice(i, 1);
					}
					oModel.setProperty("/SUBLOBS", aRows);

					var aRows = oModel.getProperty("/SUBLOBS");
					for (i = 0; i < counter; i++) {
						var item = {
							SUBLOB: response.data.results[i].SUBLOB,
							SLOB_DESCRIPTION: response.data.results[i].SLOB_DESCRIPTION
						};
						aRows.push(item);
					}
					oModel.setProperty("/SUBLOBS", aRows);
				},
				error: function (oError) {
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

		fillApprovers: function (that) {
			var model = that.getOwnerComponent().getModel("oData");
			var relPath = "/eFormApprovers";
			var that1 = that;
			var oFilter = new sap.ui.model.Filter(
				"EFORM_NUM",
				sap.ui.model.FilterOperator.EQ, eform_number
			);
			model.read(relPath, {
				filters: [oFilter],
				success: function (oData, response) {
					var counter = oData.results.length;
					var i = 0;
					var oMod = that1.getView().getModel();
					var apRows = oMod.getProperty("/approvers");
					var no_of_items = apRows.length;
					var t = no_of_items - 1;
					for (i = t; i >= 0; i--) {
						apRows.splice(i, 1);
					}
					oMod.setProperty("/approvers", apRows);
					//oTable.destroyItems();
					for (i = 0; i < counter; i++) {
						var item = {
							approved: oData.results[i].APPROVED,
							approver: oData.results[i].APPR,
							reviewer_type: oData.results[i].REVIEWER_TYPE,
							approved_by: oData.results[i].APPROVED_BY,
							approval_date: oData.results[i].APPROVAL_DT,
							approval_time: oData.results[i].APPROVAL_TM,
							manual_addition: oData.results[i].MANUAL,
							added_by: oData.results[i].ADDED_BY,
							added_on: oData.results[i].CREATION_DT,
							can_edit: Boolean(0)
						};
						apRows.push(item);
					}
					oMod.setProperty("/approvers", apRows);
				},
				error: function (oError) {
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
		fillComments: function (that) {
			var relPath = "/eFormComments";
			var model = that.getOwnerComponent().getModel("oData");
			var that1 = that;
			var oFilter = new sap.ui.model.Filter(
				"FORM_NO",
				sap.ui.model.FilterOperator.EQ, eform_number
			);
			model.read(relPath, {
				filters: [oFilter],
				success: function (oData, response) {
					that1.getView().byId("t_comment1").destroyItems();
					var counter = oData.results.length;
					var i = 0;
					for (i = 0; i < counter; i++) {
						var table = that1.getView().byId("t_comment1");
						var vedit = oData.results[i].EDIT;
						var data = new sap.m.ColumnListItem({
							cells: [
								new sap.m.Text({
									text: oData.results[i].SEQUENCE
								}),
								new sap.m.TextArea({
									value: oData.results[i].COMMENTS,
									rows: 2,
									cols: 70,
									enabled: vedit
								}),
								new sap.m.Text({
									text: oData.results[i].CREATOR
								}),
								new sap.m.Text({
									text: oData.results[i].CR_DATE
								})
							]
						})
						table.addItem(data);
					} //for
					that1.getView().byId("t_comment2").destroyItems();
					var counter = oData.results.length;
					var i = 0;
					for (i = 0; i < counter; i++) {
						var table = that1.getView().byId("t_comment2");
						var vedit = oData.results[i].EDIT;
						var data = new sap.m.ColumnListItem({
							cells: [
								new sap.m.Text({
									text: oData.results[i].SEQUENCE
								}),
								new sap.m.TextArea({
									value: oData.results[i].COMMENTS,
									rows: 2,
									cols: 70,
									enabled: vedit
								}),
								new sap.m.Text({
									text: oData.results[i].CREATOR
								}),
								new sap.m.Text({
									text: oData.results[i].CR_DATE
								})
							]
						})
						table.addItem(data);
					} //for
				},
				error: function (oError) {
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
		fillAttachments: function (that_1) {
			var model = that_1.getOwnerComponent().getModel("oData");
			var relPath = "/eFormAttachments";
			var that = that_1;
			var oFilter = new sap.ui.model.Filter(
				"EFORM_NUM",
				sap.ui.model.FilterOperator.EQ, eform_number
			);
			model.read(relPath, {
				filters: [oFilter],
				success: function (oData, response) {
					that.getView().byId("t_attachment1").destroyItems();
					that.getView().byId("t_attachment2").destroyItems();
					var counter = oData.results.length;
					var i = 0;
					for (i = 0; i < counter; i++) {
						var table1 = that.getView().byId("t_attachment1");
						var table2 = that.getView().byId("t_attachment2");
						var data1 = new sap.m.ColumnListItem({
							cells: [
								new sap.m.Link({
									text: response.data.results[i].FILE_NAME,
									press: function (oEvent) {
										var that2 = that;
										var oSource = oEvent.getSource();
										var relPath = "/sap/opu/odata/sap/YFPSFIPFRDD0024_CHARITABLE_FRM_SRV/eFormAttachments(EFORM_NUM='" + eform_number +
											"'" + ",FILE_NAME='" + oSource.getText() + "')/$value";
										window.open(relPath, '_blank');
									}
								}),
								new sap.m.Text({
									text: response.data.results[i].CREATION_DT
								}),
								new sap.m.Text({
									text: response.data.results[i].CREATION_TIME
								}),
								new sap.m.Text({
									text: response.data.results[i].FILE_SIZE
								}),
								new sap.m.Text({
									text: response.data.results[i].CREATED_BY
								})
							]
						});
						var data2 = new sap.m.ColumnListItem({
							cells: [
								new sap.m.Link({
									text: response.data.results[i].FILE_NAME,
									press: function (oEvent) {
										var that2 = that;
										var oSource = oEvent.getSource();
										var relPath = "/sap/opu/odata/sap/YFPSFIPFRDD0024_CHARITABLE_FRM_SRV/eFormAttachments(EFORM_NUM='" + eform_number +
											"'" + ",FILE_NAME='" + oSource.getText() + "')/$value";
										window.open(relPath, '_blank');
									}
								}),
								new sap.m.Text({
									text: response.data.results[i].CREATION_DT
								}),
								new sap.m.Text({
									text: response.data.results[i].CREATION_TIME
								}),
								new sap.m.Text({
									text: response.data.results[i].FILE_SIZE
								}),
								new sap.m.Text({
									text: response.data.results[i].CREATED_BY
								})
							]
						});
						table1.addItem(data1);
						table2.addItem(data2);
					}
				},
				error: function (oError) {
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
		resetInputFields: function () {
			this.getView().byId("TITLE").setValueState("None");
			this.getView().byId("DESC_PR").setValueState("None");
			this.getView().byId("ON_BEHALF_OF").setValueState("None");
			this.getView().byId("REQUESTER_TITLE").setValueState("None");
			this.getView().byId("REQUESTER_PHONE").setValueState("None");
			this.getView().byId("REQUESTER_OFFICE_LOCATION").setValueState("None");
			this.getView().byId("LOB").setValueState("None");
			this.getView().byId("SUBLOB").setValueState("None");
			this.getView().byId("DEPARTMENT_HEAD").setValueState("None");
			this.getView().byId("ORGANIZATION_NAME").setValueState("None");
			this.getView().byId("AMOUNT_DONATION").setValueState("None");
			this.getView().byId("PROPOSED_DT_DONATION").setValueState("None");
			this.getView().byId("ORGANIZATION_ADDRESS").setValueState("None");
			this.getView().byId("CITY").setValueState("None");
			this.getView().byId("STATE").setValueState("None");
			this.getView().byId("POSTAL_CODE").setValueState("None");
			this.getView().byId("COUNTRY").setValueState("None");
			this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_1").setValueState("None");
			this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_1_TEXT").setValueState("None");
			this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_2").setValueState("None");
			this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_2_TEXT").setValueState("None");
			this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_8").setValueState("None");
			this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_8_TEXT").setValueState("None");
			this.getView().byId("ORGANIZATION_DESCRIPTION").setValueState("None");
			this.getView().byId("BUSINESS_RATIONALE_1").setValueState("None");
			this.getView().byId("BUSINESS_AFFILIATION_2").setValueState("None");
			this.getView().byId("BUSINESS_AFFILIATION_2_TEXT").setValueState("None");
			this.getView().byId("BUSINESS_AFFILIATION_3").setValueState("None");
			this.getView().byId("BUSINESS_AFFILIATION_3_TEXT").setValueState("None");
			this.getView().byId("BUSINESS_AFFILIATION_4").setValueState("None");
			this.getView().byId("BUSINESS_AFFILIATION_4_TEXT").setValueState("None");
			this.getView().byId("GOVERNMENT_AFFILIATION_1").setValueState("None");
			this.getView().byId("GOVERNMENT_AFFILIATION_2").setValueState("None");
			this.getView().byId("GOVERNMENT_AFFILIATION_3").setValueState("None");
			this.getView().byId("GOVERNMENT_AFFILIATION_4").setValueState("None");
			this.getView().byId("GOVERNMENT_AFFILIATION_5").setValueState("None");
			this.getView().byId("GOVERNMENT_AFFILIATION_6").setValueState("None");
			this.getView().byId("RED_FLAGS_TEXT").setValueState("None");
		},
		_onApproverHelpRequest: function (oEvent) {
			var input_1 = oEvent.getSource();
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
				search: function (oEvent) {
					var sValue = oEvent.getParameter("value");
					var oFilter = new sap.ui.model.Filter(
						"NAME",
						sap.ui.model.FilterOperator.Contains, sValue
					);
					oEvent.getSource().getBinding("items").filter([oFilter]);
				},
				//On click of Confirm, value is set to input field
				confirm: function (oEvent) {
					var oSelectedItem = oEvent.getParameter("selectedItem");
					if (oSelectedItem) {
						input_1.setValue(oSelectedItem.getDescription());
					}
				}
			});
			var model = this.getOwnerComponent().getModel("oData");
			oValueHelpDialog_CardHolderName.setModel(model);
			oValueHelpDialog_CardHolderName.open();
		},
		_onCurrencyChange: function () {
			//This code was generated by the layout editor.
			var total_Inp = this.getView().byId("AMOUNT_DONATION").getValue();
			var loccurrency = this.getView().byId("CURRENCY").getValue();
			if (loccurrency == 'USD') {
				this.getView().byId("AMOUNT_USD").setVisible(false);
				this.getView().byId("AMOUNT_USD_S").setVisible(false);
			} else {
				this.getView().byId("AMOUNT_USD").setVisible(true);
				this.getView().byId("AMOUNT_USD_S").setVisible(true);
			}
			var total_Inp1 = total_Inp.split(',').join('');
			var s = {};
			s.EXCH = String(total_Inp1);
			s.NAME = loccurrency;
			var model = this.getOwnerComponent().getModel("oData");
			var that = this;
			model.create("/eFormLocCurrencys", s, { //POST call to OData with reportheader JSON object
				async: false,
				success: function (oData, response) {
					var temp = new Intl.NumberFormat('en-US').format(response.data.EXCH);
					that.getView().byId("AMOUNT_DONATION_USD").setText(temp);
				},
				error: function (oError) {
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
		_validateFields: function () {
			var mandatory = 0;
			var mandatory2 = 0;
			if (this.getView().byId("TITLE").getValue() === "") {
				this.getView().byId("TITLE").setValueState("Error");
				mandatory = 1;
			} else {
				this.getView().byId("TITLE").setValueState("None");
			}
			if (this.getView().byId("DESC_PR").getValue() === "") {
				this.getView().byId("DESC_PR").setValueState("Error");
				mandatory = 1;
			} else {
				this.getView().byId("DESC_PR").setValueState("None");
			}
			if (this.getView().byId("ON_BEHALF_OF").getValue() === "") {
				this.getView().byId("ON_BEHALF_OF").setValueState("Error");
				mandatory = 1;
			} else {
				this.getView().byId("ON_BEHALF_OF").setValueState("None");
			}
			if (this.getView().byId("REQUESTER_TITLE").getValue() === "") {
				this.getView().byId("REQUESTER_TITLE").setValueState("Error");
				mandatory = 1;
			} else {
				this.getView().byId("REQUESTER_TITLE").setValueState("None");
				// mandatory = mandatory - 1;
			}
			if (this.getView().byId("REQUESTER_PHONE").getValue() === "") {
				this.getView().byId("REQUESTER_PHONE").setValueState("Error");
				mandatory = 1;
			} else {
				this.getView().byId("REQUESTER_PHONE").setValueState("None");
			}
			if (this.getView().byId("REQUESTER_OFFICE_LOCATION").getValue() === "") {
				this.getView().byId("REQUESTER_OFFICE_LOCATION").setValueState("Error");
				mandatory = 1;
			} else {
				this.getView().byId("REQUESTER_OFFICE_LOCATION").setValueState("None");
			}
			if (this.getView().byId("LOB").getValue() === "") {
				this.getView().byId("LOB").setValueState("Error");
				mandatory = 1;
			} else {
				this.getView().byId("LOB").setValueState("None");
				// mandatory = mandatory - 1;
			}
			if (this.getView().byId("SUBLOB").getValue() === "") {
				this.getView().byId("SUBLOB").setValueState("Error");
				mandatory = 1;
			} else {
				this.getView().byId("SUBLOB").setValueState("None");
			}
			if (this.getView().byId("DEPARTMENT_HEAD").getValue() === "") {
				this.getView().byId("DEPARTMENT_HEAD").setValueState("Error");
				mandatory = 1;
			} else {
				this.getView().byId("DEPARTMENT_HEAD").setValueState("None");
			}
			if (this.getView().byId("ORGANIZATION_NAME").getValue() === "") {
				this.getView().byId("ORGANIZATION_NAME").setValueState("Error");
				mandatory = 1;
			} else {
				this.getView().byId("ORGANIZATION_NAME").setValueState("None");
			}
			if (this.getView().byId("AMOUNT_DONATION").getValue() === "") {
				this.getView().byId("AMOUNT_DONATION").setValueState("Error");
				mandatory = 1;
			} else {
				this.getView().byId("AMOUNT_DONATION").setValueState("None");
			}
			if (this.getView().byId("PROPOSED_DT_DONATION").getValue() === "") {
				this.getView().byId("PROPOSED_DT_DONATION").setValueState("Error");
				mandatory = 1;
			} else {
				this.getView().byId("PROPOSED_DT_DONATION").setValueState("None");
			}
			if (this.getView().byId("ORGANIZATION_ADDRESS").getValue() === "") {
				this.getView().byId("ORGANIZATION_ADDRESS").setValueState("Error");
				mandatory = 1;
			} else {
				this.getView().byId("ORGANIZATION_ADDRESS").setValueState("None");
			}
			if (this.getView().byId("CITY").getValue() === "") {
				this.getView().byId("CITY").setValueState("Error");
				mandatory = 1;
			} else {
				this.getView().byId("CITY").setValueState("None");
			}
			if (this.getView().byId("STATE").getValue() === "") {
				this.getView().byId("STATE").setValueState("Error");
				mandatory = 1;
			} else {
				this.getView().byId("STATE").setValueState("None");
			}
			if (this.getView().byId("POSTAL_CODE").getValue() === "") {
				this.getView().byId("POSTAL_CODE").setValueState("Error");
				mandatory = 1;
			} else {
				this.getView().byId("POSTAL_CODE").setValueState("None");
			}
			if (this.getView().byId("COUNTRY").getValue() === "") {
				this.getView().byId("COUNTRY").setValueState("Error");
				mandatory = 1;
			} else {
				this.getView().byId("COUNTRY").setValueState("None");
			}

			if (this.getView().byId("ORGANIZATION_CHECK_1").getSelectedIndex() > 1) {
				this.getView().byId("ORGANIZATION_CHECK_1").setValueState("Error");
				mandatory = 1;
			} else {
				this.getView().byId("ORGANIZATION_CHECK_1").setValueState("None");
				this.getView().byId("ORGANIZATION_CHECK_1_TEXT").setValueState("None");
				if (this.getView().byId("ORGANIZATION_CHECK_1").getSelectedIndex() == 1) {
					if (this.getView().byId("ORGANIZATION_CHECK_1_TEXT").getValue() === "") {
						this.getView().byId("ORGANIZATION_CHECK_1_TEXT").setValueState("Error");
						mandatory2 = 1;
					} else {
						this.getView().byId("ORGANIZATION_CHECK_1_TEXT").setValueState("None");
					}
				}
			}

			if (this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_1").getSelectedIndex() > 1) {
				this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_1").setValueState("Error");
				mandatory = 1;
			} else {
				this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_1").setValueState("None");
				this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_1_TEXT").setValueState("None");
				if (this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_1").getSelectedIndex() == 0) {
					if (this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_1_TEXT").getValue() === "") {
						this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_1_TEXT").setValueState("Error");
						mandatory2 = 1;
					} else {
						this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_1_TEXT").setValueState("None");
					}
				}
			}
			if (this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_2").getSelectedIndex() > 1) {
				this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_2").setValueState("Error");
				mandatory = 1;
			} else {
				this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_2").setValueState("None");
				this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_2_TEXT").setValueState("None");
				if (this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_2").getSelectedIndex() == 0) {
					if (this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_2_TEXT").getValue() === "") {
						this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_2_TEXT").setValueState("Error");
						mandatory2 = 1;
					} else {
						this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_2_TEXT").setValueState("None");
					}
				}
			}
			if (this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_8").getSelectedIndex() > 1) {
				this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_8").setValueState("Error");
				mandatory = 1;
			} else {
				this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_8").setValueState("None");
				this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_8_TEXT").setValueState("None");
				if (this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_8").getSelectedIndex() == 1) {
					if (this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_8_TEXT").getValue() === "") {
						this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_8_TEXT").setValueState("Error");
						mandatory2 = 1;
					} else {
						this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_8_TEXT").setValueState("None");
					}
				}
			}
			if (this.getView().byId("ORGANIZATION_DESCRIPTION").getValue() === "") {
				this.getView().byId("ORGANIZATION_DESCRIPTION").setValueState("Error");
				mandatory = 1;
			} else {
				this.getView().byId("ORGANIZATION_DESCRIPTION").setValueState("None");
			}
			if (this.getView().byId("REQUEST_DESCRIPTION").getValue() === "") {
				this.getView().byId("REQUEST_DESCRIPTION").setValueState("Error");
				mandatory = 1;
			} else {
				this.getView().byId("REQUEST_DESCRIPTION").setValueState("None");
			}
			if (this.getView().byId("BUSINESS_RATIONALE_1").getValue() === "") {
				this.getView().byId("BUSINESS_RATIONALE_1").setValueState("Error");
				mandatory = 1;
			} else {
				this.getView().byId("BUSINESS_RATIONALE_1").setValueState("None");
			}
			if (this.getView().byId("BUSINESS_AFFILIATION_1").getValue() === "") {
				this.getView().byId("BUSINESS_AFFILIATION_1").setValueState("Error");
				mandatory = 1;
			} else {
				this.getView().byId("BUSINESS_AFFILIATION_1").setValueState("None");
			}
			if (this.getView().byId("BUSINESS_AFFILIATION_2").getSelectedIndex() > 1) {
				this.getView().byId("BUSINESS_AFFILIATION_2").setValueState("Error");
				mandatory = 1;
			} else {
				this.getView().byId("BUSINESS_AFFILIATION_2").setValueState("None");
				this.getView().byId("BUSINESS_AFFILIATION_2_TEXT").setValueState("None");
				if (this.getView().byId("BUSINESS_AFFILIATION_2").getSelectedIndex() == 0) {
					if (this.getView().byId("BUSINESS_AFFILIATION_2_TEXT").getValue() === "") {
						this.getView().byId("BUSINESS_AFFILIATION_2_TEXT").setValueState("Error");
						mandatory2 = 1;
					} else {
						this.getView().byId("BUSINESS_AFFILIATION_2_TEXT").setValueState("None");
					}
				}
			}
			if (this.getView().byId("BUSINESS_AFFILIATION_3").getSelectedIndex() > 1) {
				this.getView().byId("BUSINESS_AFFILIATION_3").setValueState("Error");
				mandatory = 1;
			} else {
				this.getView().byId("BUSINESS_AFFILIATION_3").setValueState("None");
				this.getView().byId("BUSINESS_AFFILIATION_3_TEXT").setValueState("None");
				if (this.getView().byId("BUSINESS_AFFILIATION_3").getSelectedIndex() == 0) {
					if (this.getView().byId("BUSINESS_AFFILIATION_3_TEXT").getValue() === "") {
						this.getView().byId("BUSINESS_AFFILIATION_3_TEXT").setValueState("Error");
						mandatory2 = 1;
					} else {
						this.getView().byId("BUSINESS_AFFILIATION_3_TEXT").setValueState("None");
					}
				}
			}
			if (this.getView().byId("BUSINESS_AFFILIATION_4").getSelectedIndex() > 1) {
				this.getView().byId("BUSINESS_AFFILIATION_4").setValueState("Error");
				mandatory = 1;
			} else {
				this.getView().byId("BUSINESS_AFFILIATION_4").setValueState("None");
				this.getView().byId("BUSINESS_AFFILIATION_4_TEXT").setValueState("None");
				if (this.getView().byId("BUSINESS_AFFILIATION_4").getSelectedIndex() == 0) {
					if (this.getView().byId("BUSINESS_AFFILIATION_4_TEXT").getValue() === "") {
						this.getView().byId("BUSINESS_AFFILIATION_4_TEXT").setValueState("Error");
						mandatory2 = 1;
					} else {
						this.getView().byId("BUSINESS_AFFILIATION_4_TEXT").setValueState("None");
					}
				}
			}
			if (this.getView().byId("GOVERNMENT_AFFILIATION_1").getSelectedIndex() > 1) {
				this.getView().byId("GOVERNMENT_AFFILIATION_1").setValueState("Error");
				mandatory = 1;
			} else {
				this.getView().byId("GOVERNMENT_AFFILIATION_1").setValueState("None");
			}
			if (this.getView().byId("GOVERNMENT_AFFILIATION_2").getSelectedIndex() > 1) {
				this.getView().byId("GOVERNMENT_AFFILIATION_2").setValueState("Error");
				mandatory = 1;
			} else {
				this.getView().byId("GOVERNMENT_AFFILIATION_2").setValueState("None");
			}
			if (this.getView().byId("GOVERNMENT_AFFILIATION_3").getSelectedIndex() > 1) {
				this.getView().byId("GOVERNMENT_AFFILIATION_3").setValueState("Error");
				mandatory = 1;
			} else {
				this.getView().byId("GOVERNMENT_AFFILIATION_3").setValueState("None");
			}
			if (this.getView().byId("GOVERNMENT_AFFILIATION_4").getSelectedIndex() > 1) {
				this.getView().byId("GOVERNMENT_AFFILIATION_4").setValueState("Error");
				mandatory = 1;
			} else {
				this.getView().byId("GOVERNMENT_AFFILIATION_4").setValueState("None");
			}
			if (this.getView().byId("GOVERNMENT_AFFILIATION_5").getSelectedIndex() > 1) {
				this.getView().byId("GOVERNMENT_AFFILIATION_5").setValueState("Error");
				mandatory = 1;
			} else {
				this.getView().byId("GOVERNMENT_AFFILIATION_5").setValueState("None");
			}
			if (this.getView().byId("GOVERNMENT_AFFILIATION_6").getSelectedIndex() > 1) {
				this.getView().byId("GOVERNMENT_AFFILIATION_6").setValueState("Error");
				mandatory = 1;
			} else {
				this.getView().byId("GOVERNMENT_AFFILIATION_6").setValueState("None");
			}
			if (this.getView().byId("RED_FLAGS_TEXT").getVisible() == true) {
				if (this.getView().byId("RED_FLAGS_TEXT").getValue() == "") {
					this.getView().byId("RED_FLAGS_TEXT").setValueState("Error");
					mandatory2 = 1;
				} else {
					this.getView().byId("RED_FLAGS_TEXT").setValueState("None");
				}
			}

			if (this.getView().byId("GOVERNMENT_AFFILIATION_1").getSelectedIndex() > 1) {
				this.getView().byId("GOVERNMENT_AFFILIATION_1").setValueState("Error");
				mandatory = 1;
			} else {
				this.getView().byId("GOVERNMENT_AFFILIATION_1").setValueState("None");
				this.getView().byId("GOVERNMENT_AFFILIATION_1_TEXT").setValueState("None");
				if (this.getView().byId("GOVERNMENT_AFFILIATION_1").getSelectedIndex() == 1) {
					if (this.getView().byId("GOVERNMENT_AFFILIATION_1_TEXT").getValue() === "") {
						this.getView().byId("GOVERNMENT_AFFILIATION_1_TEXT").setValueState("Error");
						mandatory2 = 1;
					} else {
						this.getView().byId("GOVERNMENT_AFFILIATION_1_TEXT").setValueState("None");
					}
				}
			}

			if (this.getView().byId("GOVERNMENT_AFFILIATION_2").getSelectedIndex() > 1) {
				this.getView().byId("GOVERNMENT_AFFILIATION_2").setValueState("Error");
				mandatory = 1;
			} else {
				this.getView().byId("GOVERNMENT_AFFILIATION_2").setValueState("None");
				this.getView().byId("GOVERNMENT_AFFILIATION_2_TEXT").setValueState("None");
				if (this.getView().byId("GOVERNMENT_AFFILIATION_2").getSelectedIndex() == 0) {
					if (this.getView().byId("GOVERNMENT_AFFILIATION_2_TEXT").getValue() === "") {
						this.getView().byId("GOVERNMENT_AFFILIATION_2_TEXT").setValueState("Error");
						mandatory2 = 1;
					} else {
						this.getView().byId("GOVERNMENT_AFFILIATION_2_TEXT").setValueState("None");
					}
				}
			}

			if (mandatory == 1 || mandatory2 == 1) {
				validate_error = "X";
			} else {
				validate_error = "";
			}
		},
		onSavePress: function (oEvent) {
			//Perform validations
			this._validateFields();
			var model = this.getOwnerComponent().getModel("oData");
			var s = {};
			s.EFORM_NUM = eform_number;
			s.TITLE = this.getView().byId("TITLE").getValue();
			s.DESC_PR = this.getView().byId("DESC_PR").getValue();
			s.PREPARER = this.getView().byId("PREPARER").getText();
			s.REQUEST_DATE = this.getView().byId("REQUEST_DATE").getText();
			s.ON_BEHALF_OF = this.getView().byId("ON_BEHALF_OF").getValue();
			s.REQUESTER_TITLE = this.getView().byId("REQUESTER_TITLE").getValue();
			s.REQUESTER_PHONE = this.getView().byId("REQUESTER_PHONE").getValue();
			s.REQUESTER_OFFICE_LOCATION = this.getView().byId("REQUESTER_OFFICE_LOCATION").getValue();
			//  s.DEPARTMENT = this.getView().byId("DEPARTMENT").getValue();
			s.LOB = this.getView().byId("LOB").getValue();
			s.SUBLOB = this.getView().byId("SUBLOB").getValue();
			s.DEPARTMENT_HEAD = this.getView().byId("DEPARTMENT_HEAD").getValue();
			s.ORGANIZATION_NAME = this.getView().byId("ORGANIZATION_NAME").getValue();
			s.AMOUNT_DONATION = this.getView().byId("AMOUNT_DONATION").getValue().split(',').join('');
			s.AMOUNT_DONATION_USD = this.getView().byId("AMOUNT_DONATION_USD").getText().split(',').join('');
			s.CURRENCY = this.getView().byId("CURRENCY").getValue();
			s.PROPOSED_DT_DONATION = this.getView().byId("PROPOSED_DT_DONATION").getValue();
			s.ORGANIZATION_ADDRESS = this.getView().byId("ORGANIZATION_ADDRESS").getValue();
			s.CITY = this.getView().byId("CITY").getValue();
			s.STATE = this.getView().byId("STATE").getValue();
			s.POSTAL_CODE = this.getView().byId("POSTAL_CODE").getValue();
			s.COUNTRY = this.getView().byId("COUNTRY").getValue();
			s.ORGANIZATION_CHECK_1 = String(this.getView().byId("ORGANIZATION_CHECK_1").getSelectedIndex());
			s.ORGANIZATION_CHECK_2 = this.getView().byId("ORGANIZATION_CHECK_2").getSelected();
			s.ORGANIZATION_CHECK_3 = String(this.getView().byId("ORGANIZATION_CHECK_3").getSelectedIndex());
			s.ORGANIZATION_CHECK_4 = String(this.getView().byId("ORGANIZATION_CHECK_4").getSelectedIndex());
			s.CONTRIBUTION_QUESTIONNAIRE_1 = String(this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_1").getSelectedIndex());
			s.CONTRIBUTION_QUESTIONNAIRE_2 = String(this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_2").getSelectedIndex());
			s.CONTRIBUTION_QUESTIONNAIRE_3 = this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_3").getSelected();
			s.CONTRIBUTION_QUESTIONNAIRE_4 = this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_4").getSelected();
			s.CONTRIBUTION_QUESTIONNAIRE_5 = this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_5").getSelected();
			s.CONTRIBUTION_QUESTIONNAIRE_6 = this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_6").getSelected();
			s.CONTRIBUTION_QUESTIONNAIRE_7 = this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_7").getSelected();
			s.CONTRIBUTION_QUESTIONNAIRE_8 = String(this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_8").getSelectedIndex());
			s.ORGANIZATION_DESCRIPTION = this.getView().byId("ORGANIZATION_DESCRIPTION").getValue();
			s.BUSINESS_RATIONALE_1 = this.getView().byId("BUSINESS_RATIONALE_1").getValue();
			s.REQUEST_DESCRIPTION = this.getView().byId("REQUEST_DESCRIPTION").getValue();
			s.BUSINESS_AFFILIATION_1 = this.getView().byId("BUSINESS_AFFILIATION_1").getValue();
			s.BUSINESS_AFFILIATION_2 = String(this.getView().byId("BUSINESS_AFFILIATION_2").getSelectedIndex());
			s.BUSINESS_AFFILIATION_3 = String(this.getView().byId("BUSINESS_AFFILIATION_3").getSelectedIndex());
			s.BUSINESS_AFFILIATION_4 = String(this.getView().byId("BUSINESS_AFFILIATION_4").getSelectedIndex());
			s.GOVERNMENT_AFFILIATION_1 = String(this.getView().byId("GOVERNMENT_AFFILIATION_1").getSelectedIndex());
			s.GOVERNMENT_AFFILIATION_2 = String(this.getView().byId("GOVERNMENT_AFFILIATION_2").getSelectedIndex());
			s.GOVERNMENT_AFFILIATION_3 = String(this.getView().byId("GOVERNMENT_AFFILIATION_3").getSelectedIndex());
			s.GOVERNMENT_AFFILIATION_4 = String(this.getView().byId("GOVERNMENT_AFFILIATION_4").getSelectedIndex());
			s.GOVERNMENT_AFFILIATION_5 = String(this.getView().byId("GOVERNMENT_AFFILIATION_5").getSelectedIndex());
			s.GOVERNMENT_AFFILIATION_6 = String(this.getView().byId("GOVERNMENT_AFFILIATION_6").getSelectedIndex());
			s.CONTRIBUTION_QUESTIONNAIRE_1_TEXT = this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_1_TEXT").getValue();
			s.CONTRIBUTION_QUESTIONNAIRE_2_TEXT = this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_2_TEXT").getValue();
			s.CONTRIBUTION_QUESTIONNAIRE_8_TEXT = this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_8_TEXT").getValue();
			s.BUSINESS_AFFILIATION_2_TEXT = this.getView().byId("BUSINESS_AFFILIATION_2_TEXT").getValue();
			s.BUSINESS_AFFILIATION_3_TEXT = this.getView().byId("BUSINESS_AFFILIATION_3_TEXT").getValue();
			s.BUSINESS_AFFILIATION_4_TEXT = this.getView().byId("BUSINESS_AFFILIATION_4_TEXT").getValue();
			s.RED_FLAGS_TEXT = this.getView().byId("RED_FLAGS_TEXT").getValue();
			s.ORGANIZATION_CHECK_1_TEXT = this.getView().byId("ORGANIZATION_CHECK_1_TEXT").getValue();
			s.GOVERNMENT_AFFILIATION_1_TEXT = this.getView().byId("GOVERNMENT_AFFILIATION_1_TEXT").getValue();
			s.GOVERNMENT_AFFILIATION_2_TEXT = this.getView().byId("GOVERNMENT_AFFILIATION_2_TEXT").getValue();

			var checkpayitems = this.getView().byId("PAYMENT_METHOD").getSelectedItems();
			var checkpay;
			for (var i = 0; i < checkpayitems.length; i++) {
				if (i == 0) {
					checkpay = checkpayitems[i].getText();
				} else {
					checkpay = checkpay + ',' + checkpayitems[i].getText();
				}
			}
			s.PAYMENT_METHOD = checkpay;

			var buttonclicked;
			if (oEvent != undefined) {
				if (oEvent.mParameters.id.toLowerCase().indexOf("b_submit") > -1) {
					buttonclicked = "Submit";
					if (validate_error == 'X') {
						MessageBox.show(
							"Please enter required parameters to proceed",
							MessageBox.Icon.ERROR,
							"Error"
						);
						return;
					}
					// s.ACTION = 'Submit'
					s.STATUS = 'In Approval';
				} else {
					// s.ACTION = 'Save'
					buttonclicked = "Save";
					if (validate_error == 'X') {
						MessageBox.show(
							"Please enter mandatory parameters",
							MessageBox.Icon.ERROR,
							"Error"
						);
					}
					if (eform_status == 'In Approval') {
						s.STATUS = 'In Approval';
					}
					if (eform_status == 'Data Saved') {
						s.STATUS = "Data Saved";
					}
					if (eform_status == 'Withdrawn') {
						s.STATUS = "Data Saved";
					}
					if (eform_status == 'Rejected') {
						s.STATUS = "Rejected";
					}

				}
			} else {
				s.STATUS = eform_status;
			}
			s.header_approvers = [];
			var b = this.getView().byId("approvers_table").getItems();
			for (var i = 0; i < b.length; i++) {
				var D = {};
				D.EFORM_NUM = eform_number;
				D.ORGLEVEL = "";
				D.SEQUENCE = String(i + 1);
				if (b[i].mAggregations.cells[0].getSelected() === true) {
					D.APPROVED = "X";
				} else {
					D.APPROVED = "";
				}
				D.REVIEWER_TYPE = b[i].mAggregations.cells[2].getText();
				D.APPROVED_BY = b[i].mAggregations.cells[3].getText();
				D.APPROVAL_DT = b[i].mAggregations.cells[4].getText();
				D.APPROVAL_TM = b[i].mAggregations.cells[5].getText();
				D.ADDED_BY = b[i].mAggregations.cells[7].getText();
				D.CREATION_DT = b[i].mAggregations.cells[8].getText();
				if (b[i].mAggregations.cells[6].getSelected() === true) {
					D.MANUAL = "X";

				} else {
					D.MANUAL = "";

				}

				var temp;
				if (b[i].mAggregations.cells[1].mProperties.value !== undefined) {
					temp = b[i].mAggregations.cells[1].mProperties.value;
				} else {
					temp = b[i].mAggregations.cells[1].mProperties.text;
				}

				D.APPR = temp;

				if (D.APPR != "") {
					s.header_approvers[i] = D;
				}
			}
			s.header_contacts = [];
			var b = this.getView().byId("CONTACTS").getItems();
			var emptycontact;
			for (var i = 0; i < b.length; i++) {
				var D = {};
				D.EFORM_NUM = eform_number;
				D.CONTACT_ID = "";
				D.CONTACT_NAME = b[i].mAggregations.cells[0].getValue();
				D.CONTACT_METHOD = b[i].mAggregations.cells[1].getValue();
				D.CONTACT_DETAILS = b[i].mAggregations.cells[2].getValue();
				s.header_contacts[i] = D;
				if (D.CONTACT_NAME == "" || D.CONTACT_METHOD == "" || D.CONTACT_DETAILS == "") {
					emptycontact = "X";
				}

			}

			if (emptycontact == "X" || b.length == 0) {

				MessageBox.show(
					"Please enter missing contact details",
					MessageBox.Icon.ERROR,
					"Error"
				);
				if (s.STATUS == 'In Approval') {
					return;
				}

			}

			var that88 = this;
			model.create("/eFormHeaders", s, { //POST call to OData with reportheader JSON object
				async: false,
				success: function (oData, response) {
					eform_number = oData.EFORM_NUM;
					var fnumber = that88.getView().getModel().getProperty("/EFORM_NUM")
					that88.getView().getModel().setProperty("/EFORM_NUM", eform_number);

					var msg1 = eform_number;
					var oResourceModel = that88.getView().getModel("i18n").getResourceBundle();
					var oText = oResourceModel.getText("CharitableDonationForm", [msg1]);
					that88.getView().byId("page1").setText(oText);
					eform_status = oData.STATUS;
					setTimeout(that88.approve_reject_button_dsp, 1000);
					if (oData.STATUS == 'Data Saved' || oData.STATUS == 'Withdrawn') {

						//          that88.getView().byId("b_approve").setVisible(false);
						//          that88.getView().byId("b_reject").setVisible(false);
						that88.getView().byId("HOME").setVisible(false);
						that88.getView().byId("b_save").setVisible(true);
						that88.getView().byId("b_submit").setVisible(true);
						that88.getView().byId("b_withdraw").setVisible(false);
						that88.getView().byId("b_print").setVisible(true);

					}
					if (oData.STATUS == 'In Approval') {

						//         that88.getView().byId("b_approve").setVisible(true);
						//         that88.getView().byId("b_reject").setVisible(true);
						if (window.top.location.href.toLowerCase().indexOf("fiorilaunchpad") == -1) {
							// S4R:PJAIN6:GWDK902351:07/22/2021:Seting visibility of home icon false:START
							// that88.getView().byId("HOME").setVisible(true);
							  that88.getView().byId("HOME").setVisible(false);
						// S4R:PJAIN6:GWDK902351:07/22/2021:Seting visibility of home icon false:END	  
						}

						//that88.getView().byId("HOME").setVisible(true);
						that88.getView().byId("b_save").setVisible(true);
						that88.getView().byId("b_submit").setVisible(false);
						that88.getView().byId("b_withdraw").setVisible(true);
						that88.getView().byId("b_print").setVisible(true);
					}
					//fetch approvers
					var relPath = "/eFormApprovers";
					var that1 = that88;
					var oFilter = new sap.ui.model.Filter(
						"EFORM_NUM",
						sap.ui.model.FilterOperator.EQ, eform_number
					);
					model.read(relPath, {
						filters: [oFilter],
						success: function (oData, response) {
							var counter = oData.results.length;
							var i = 0;
							var oMod = that1.getView().getModel();
							var apRows = oMod.getProperty("/approvers");
							var no_of_items = apRows.length;
							var t = no_of_items - 1;
							for (i = t; i >= 0; i--) {
								apRows.splice(i, 1);
							}
							oMod.setProperty("/approvers", apRows);
							//oTable.destroyItems();
							for (i = 0; i < counter; i++) {
								var item = {
									approved: oData.results[i].APPROVED,
									approver: oData.results[i].APPR,
									reviewer_type: oData.results[i].REVIEWER_TYPE,
									approved_by: oData.results[i].APPROVED_BY,
									approval_date: oData.results[i].APPROVAL_DT,
									approval_time: oData.results[i].APPROVAL_TM,
									manual_addition: oData.results[i].MANUAL,
									added_by: oData.results[i].ADDED_BY,
									added_on: oData.results[i].CREATION_DT,
									can_edit: Boolean(0)
								};
								apRows.push(item);
							}
							oMod.setProperty("/approvers", apRows);
						},
						error: function (oError) {
							var response = JSON.parse(oError.responseText);
							MessageBox.show(
								response.error.message.value,
								MessageBox.Icon.ERROR,
								"Error"
							);
							sap.ui.core.BusyIndicator.hide();
						}
					});
					var msg = oData.MSG;
					MessageBox.show(
						msg,
						MessageBox.Icon.SUCCESS
					);
					sap.ui.core.BusyIndicator.hide();
				},
				error: function (oError) {
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

		approve_eform: function (value) {
			var msg_returned = "";
			var sValue = jQuery.sap.getUriParameters().get("SOURCE");
			if (sValue == "INBOX") {
				var sDialogName = "Dialog13";
				window.eform_num_inbox = eform_number;
				window.mode_inbox = "A";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				var oSource = value.getSource();
				var oBindingContext = oSource.getBindingContext();
				var sPath = oBindingContext ? oBindingContext.getPath() : null;
				var oView;
				//if (!oDialog) {
				this.getOwnerComponent().runAsOwner(function () {
					oView = sap.ui.xmlview({
						viewName: "com.sap.build.standard.charitableDonationForm.view." + sDialogName
					});
					this.getView().addDependent(oView);
					oView.getController().setRouter(this.oRouter);
					oView.getController().setValueObject(eform_number);
					oView.getController().setMode("A");
					oDialog = oView.getContent()[0];
					this.mDialogs[sDialogName] = oDialog;
				}.bind(this));
				// }
				return new Promise(function (fnResolve) {
					oDialog.attachEventOnce("afterOpen", null, fnResolve);
					oDialog.open();
					if (oView) {
						oDialog.attachAfterOpen(function () {
							oDialog.rerender();
						});
					} else {
						oView = oDialog.getParent();
					}
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
				}.bind(this)).catch(function (err) {
					if (err !== undefined) {
						MessageBox.error(err.message);
					}
				});
			} else {
				var url = "/sap/opu/odata/sap/YFPSFIPFRDD0024_CHARITABLE_FRM_SRV/";
				var oModelData = new sap.ui.model.odata.ODataModel(url, true);
				var eform_num = eform_number;
				var relPath = "/eFormValidateApprovals?$filter=EFORM_NUM eq '" + eform_num + "' and ACTION eq 'A'";
				var that = this;
				var oSource = value.getSource();
				oModelData.read(relPath, null, [], false, function (oData, response) {
					var msg_type = response.data.results[0].MSG_TYPE;
					if (msg_type == "E") {
						// MessageBox.error(response.data.results[0].MSG);
						msg_returned = response.data.results[0].MSG + ".";
					} else {
						msg_returned = "The eForm has been successfully approved.";
					}
					new Promise(function (fnResolve) {
						sap.m.MessageBox.confirm(msg_returned + "Do you want to go to the Fiori My Inbox App?", {
							title: "Confirm Navigation",
							actions: ["Yes", "No"],
							onClose: function (sActionClicked) {
									// S4R:PJAIN6:GWDK902351:07/22/2021:Replacing old url with new url:START
								// if (sActionClicked === "Yes") {
								// 	if (window.top.location.href.toLowerCase().indexOf("fiorilaunchpad") == -1) {
								// 		window.open("/sap/bc/ui5_ui5/ui2/ushell/shells/abap/Fiorilaunchpad.html#WorkflowTask-displayInbox", "_self");
								// 	} else {
								// 		window.open(
								// 			"/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchpad.html?&sap-ushell-config=headerless#Shell-runStandaloneApp?sap-ushell-SAPUI5.Component=cross.fnd.fiori.inbox&sap-ushell-url=/sap/bc/ui5_ui5/sap/ca_fiori_inbox",
								// 			"_self");
								// 	}
								// }
								if (sActionClicked === "Yes") {
									if (window.top.location.href.toLowerCase().indexOf("fiorilaunchpad") == -1) {
										// window.open("/sap/bc/ui5_ui5/ui2/ushell/shells/abap/Fiorilaunchpad.html#WorkflowTask-displayInbox", "_self");
										window.open("/sap/bc/ui2/flp#WorkflowTask-displayInbox", "_self");
									} else {
										// window.open(
										// 	"/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchpad.html?&sap-ushell-config=headerless#Shell-runStandaloneApp?sap-ushell-SAPUI5.Component=cross.fnd.fiori.inbox&sap-ushell-url=/sap/bc/ui5_ui5/sap/ca_fiori_inbox",
										// 	"_self");
											window.open(
											"/sap/bc/ui2/flp?&sap-ushell-config=headerless#Shell-runStandaloneApp?sap-ushell-SAPUI5.Component=cross.fnd.fiori.inbox&sap-ushell-url=/sap/bc/ui5_ui5/sap/ca_fiori_inbox",
											"_self");
									}
								}
									// S4R:PJAIN6:GWDK902351:07/22/2021:Replacing old url with new url:START
								if (sActionClicked === "No") {
									if (window.top.location.href.toLowerCase().indexOf("fiorilaunchpad") == -1) {
										window.close();
										window.open("https://sharepoint.spe.sony.com/myspe/", "_self");
									} else {
										window.history.go(-1);
									}
								}
							}
						});
					}).catch(function (err) {
						if (err !== undefined) {
							MessageBox.error(err);
						}
					});
				});
			}
		},

		reject_eform: function (value) {
			var msg_returned = "";
			var sValue = jQuery.sap.getUriParameters().get("SOURCE");
			if (sValue == "INBOX") {
				window.eform_num_inbox = eform_number;
				window.mode_inbox = "R";
				var sDialogName = "Dialog13";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				var oSource = value.getSource();
				var oBindingContext = oSource.getBindingContext();
				var sPath = oBindingContext ? oBindingContext.getPath() : null;
				var oView;
				//if (!oDialog) {
				this.getOwnerComponent().runAsOwner(function () {
					oView = sap.ui.xmlview({
						viewName: "com.sap.build.standard.charitableDonationForm.view." + sDialogName
					});
					this.getView().addDependent(oView);
					oView.getController().setRouter(this.oRouter);
					oView.getController().setValueObject(eform_number);
					oView.getController().setMode("R");
					oDialog = oView.getContent()[0];
					this.mDialogs[sDialogName] = oDialog;
				}.bind(this));
				// }
				return new Promise(function (fnResolve) {
					oDialog.attachEventOnce("afterOpen", null, fnResolve);
					oDialog.open();
					if (oView) {
						oDialog.attachAfterOpen(function () {
							oDialog.rerender();
						});
					} else {
						oView = oDialog.getParent();
					}
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
				}.bind(this)).catch(function (err) {
					if (err !== undefined) {
						MessageBox.error(err.message);
					}
				});
			} else {
				var url = "/sap/opu/odata/sap/YFPSFIPFRDD0024_CHARITABLE_FRM_SRV/";
				var oModelData = new sap.ui.model.odata.ODataModel(url, true);
				var eform_num = eform_number;
				var relPath = "/eFormValidateApprovals?$filter=EFORM_NUM eq '" + eform_num + "' and ACTION eq 'R'";
				var that = this;
				oModelData.read(relPath, null, [], false, function (oData, response) {
					var msg_type = response.data.results[0].MSG_TYPE;
					if (msg_type == "E") {
						// MessageBox.error(response.data.results[0].MSG);
						msg_returned = response.data.results[0].MSG + ".";
					} else {
						eform_status = "Rejected";
						msg_returned = "The Eform has been successfully rejected.";
					}
					new Promise(function (fnResolve) {
						sap.m.MessageBox.confirm(msg_returned + "Do you want to go to the Fiori My Inbox App?", {
							title: "Confirm Navigation",
							actions: ["Yes", "No"],
							onClose: function (sActionClicked) {
									// S4R:PJAIN6:GWDK902351:07/22/2021:Replacing old url with new url:START
								// if (sActionClicked === "Yes") {
								// 	if (window.top.location.href.toLowerCase().indexOf("fiorilaunchpad") == -1) {
								// 		window.open("/sap/bc/ui5_ui5/ui2/ushell/shells/abap/Fiorilaunchpad.html#WorkflowTask-displayInbox", "_self");
								// 	} else {
								// 		window.open(
								// 			"/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchpad.html?&sap-ushell-config=headerless#Shell-runStandaloneApp?sap-ushell-SAPUI5.Component=cross.fnd.fiori.inbox&sap-ushell-url=/sap/bc/ui5_ui5/sap/ca_fiori_inbox",
								// 			"_self");
								// 	}
								// }
									if (sActionClicked === "Yes") {
									if (window.top.location.href.toLowerCase().indexOf("fiorilaunchpad") == -1) {
										// window.open("/sap/bc/ui5_ui5/ui2/ushell/shells/abap/Fiorilaunchpad.html#WorkflowTask-displayInbox", "_self");
										window.open("/sap/bc/ui2/flp#WorkflowTask-displayInbox", "_self");
									} else {
										// window.open(
										// 	"/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchpad.html?&sap-ushell-config=headerless#Shell-runStandaloneApp?sap-ushell-SAPUI5.Component=cross.fnd.fiori.inbox&sap-ushell-url=/sap/bc/ui5_ui5/sap/ca_fiori_inbox",
										// 	"_self");
											window.open(
											"/sap/bc/ui2/flp?&sap-ushell-config=headerless#Shell-runStandaloneApp?sap-ushell-SAPUI5.Component=cross.fnd.fiori.inbox&sap-ushell-url=/sap/bc/ui5_ui5/sap/ca_fiori_inbox",
											"_self");
									}
								}
									// S4R:PJAIN6:GWDK902351:07/22/2021:Replacing old url with new url:END
								if (sActionClicked === "No") {
									if (window.top.location.href.toLowerCase().indexOf("fiorilaunchpad") == -1) {
										window.close();
										window.open("https://sharepoint.spe.sony.com/myspe/", "_self");
									} else {
										window.history.go(-1);
									}
								}
							}
						});
					}).catch(function (err) {
						if (err !== undefined) {
							MessageBox.error(err);
						}
					});
				});
			}
		},

		_onNavigateHome: function (value) {
				// S4R:PJAIN6:GWDK902351:07/22/2021:Replacing old url with new url:START
			// window.location.href = "/sap/bc/ui5_ui5/ui2/ushell/shells/abap/Fiorilaunchpad.html";
			window.location.href = "/sap/bc/ui2/flp";
				// S4R:PJAIN6:GWDK902351:07/22/2021:Replacing old url with new url:END
		},

		handleSelectionChange: function () {
			this._getPaymentItems();
		},

		_getPaymentItems: function () {

			var checkpayitems = this.getView().byId("PAYMENT_METHOD").getSelectedItems();
			var checkpay = "";
			for (var i = 0; i < checkpayitems.length; i++) {
				if (i == 0) {
					checkpay = checkpayitems[i].getText();
				} else {
					checkpay = checkpay + ',' + checkpayitems[i].getText();
				}
			}
			this.getView().byId("PAYMENT_METHOD_S").setText(checkpay);
			return checkpay;
		},
		_onLobValueHelpRequest: function () {
			var lob = this.getView().byId("LOB");
			var that = this;
			var oValueHelpDialog_RespDiv = new sap.m.SelectDialog({
				title: "Choose Value for COFA Lob",
				items: {
					path: "/eFormLobs",
					template: new sap.m.StandardListItem({
						title: "{LOB}",
						description: "{SLOB_DESCRIPTION}",
						active: true
					})
				},
				//Shipping Point can be searched using Search Bar
				search: function (oEvent) {
					var sValue = oEvent.getParameter("value");
					var oFilter = new sap.ui.model.Filter(
						"LOB",
						sap.ui.model.FilterOperator.Contains, sValue
					);
					var oFilter2 = new sap.ui.model.Filter(
						"SLOB_DESCRIPTION",
						sap.ui.model.FilterOperator.Contains, sValue
					);
					oEvent.getSource().getBinding("items").filter([oFilter2]);
				},
				confirm: function (oEvent) {
					var oSelectedItem = oEvent.getParameter("selectedItem");
					if (oSelectedItem) {
						lob.setValue(oSelectedItem.getTitle());
						that.getView().byId("SUBLOB").setValue("");
					}
				}
			});
			var model = this.getOwnerComponent().getModel("oData");
			oValueHelpDialog_RespDiv.setModel(model);
			oValueHelpDialog_RespDiv.open();
		},
		_onCountryValueHelpRequest: function () {
			var lob = this.getView().byId("COUNTRY");
			var that = this;
			var oValueHelpDialog_RespDiv = new sap.m.SelectDialog({
				title: "Choose Value for Country",
				items: {
					path: "/eFormCountries",
					template: new sap.m.StandardListItem({
						title: "{COUNTRY}",
						description: "{NAME}",
						active: true
					})
				},
				//Shipping Point can be searched using Search Bar
				search: function (oEvent) {
					var sValue = oEvent.getParameter("value");
					var oFilter = new sap.ui.model.Filter(
						"NAME",
						sap.ui.model.FilterOperator.Contains, sValue
					);
					oEvent.getSource().getBinding("items").filter([oFilter]);
				},
				confirm: function (oEvent) {
					var oSelectedItem = oEvent.getParameter("selectedItem");
					if (oSelectedItem) {
						lob.setValue(oSelectedItem.getDescription());
					}
				}
			});
			var model = this.getOwnerComponent().getModel("oData");
			oValueHelpDialog_RespDiv.setModel(model);
			oValueHelpDialog_RespDiv.open();
		},
		_onStateValueHelpRequest: function () {
			var lob = this.getView().byId("STATE");
			var country = this.getView().byId("COUNTRY").getValue();
			if (country == "") {
				MessageBox.show(
					"Please enter country to view states.",
					MessageBox.Icon.ERROR,
					"Error"
				);
				return;
			}
			var that = this;
			var oValueHelpDialog_RespDiv = new sap.m.SelectDialog({
				title: "Choose Value for State/Region",
				items: {
					path: "/eFormStates",
					filters: [new sap.ui.model.Filter({
						filters: [new sap.ui.model.Filter({
							path: "COUNTRY",
							operator: sap.ui.model.FilterOperator.EQ,
							value1: country
						})],
						and: true
					})],
					template: new sap.m.StandardListItem({
						title: "{STATE}",
						description: "{NAME}",
						active: true
					})
				},
				//Shipping Point can be searched using Search Bar
				search: function (oEvent) {
					var sValue = oEvent.getParameter("value");
					var oFilter = new sap.ui.model.Filter(
						"NAME",
						sap.ui.model.FilterOperator.Contains, sValue
					);
					oEvent.getSource().getBinding("items").filter([oFilter]);
				},
				confirm: function (oEvent) {
					var oSelectedItem = oEvent.getParameter("selectedItem");
					if (oSelectedItem) {
						lob.setValue(oSelectedItem.getDescription());
					}
				}
			});
			var model = this.getOwnerComponent().getModel("oData");
			oValueHelpDialog_RespDiv.setModel(model);
			oValueHelpDialog_RespDiv.open();
		},
		_onBehalfOf_ValueHelp: function () {
			var cardholder = this.getView().byId("ON_BEHALF_OF");
			var that2 = this;
			var oValueHelpDialog_CardHolderName = new sap.m.SelectDialog({ //Using SelectDialog control that will allow single selection along with Search field capability
				title: "Choose Value for On Behalf Of",
				items: {
					path: "/eFormProductionAccts",
					template: new sap.m.StandardListItem({
						title: "{USERID}",
						description: "{NAME}",
						active: true
					})
				},
				//Shipping Point can be searched using Search Bar
				search: function (oEvent) {
					var sValue = oEvent.getParameter("value");
					var oFilter = new sap.ui.model.Filter(
						"NAME",
						sap.ui.model.FilterOperator.Contains, sValue
					);
					oEvent.getSource().getBinding("items").filter([oFilter]);
				},
				//On click of Confirm, value is set to input field
				confirm: function (oEvent) {
					var oSelectedItem = oEvent.getParameter("selectedItem");
					if (oSelectedItem) {
						cardholder.setValue(oSelectedItem.getDescription());
						var model = that2.getOwnerComponent().getModel("oData");
						var that3 = that2;
						var user = oSelectedItem.getTitle();
						model.read("/eFormProductionAccts('" + user + "')", {
							success: function (oData, response) {

								that3.getView().byId("REQUESTER_PHONE").setValue(oData.PHONE);
								// that3.getView().byId("i_business_phone").setValue(oData.PHONE);
								// that3.getView().byId("i_email_id").setValue(oData.EMAIL);
								//  that3.getView().byId("i_management_level").setText(oData.MANAGEMENT_LEVEL);
							},
							error: function (oError) {
								var response = JSON.parse(oError.responseText);
								MessageBox.show(
									response.error.message.value,
									MessageBox.Icon.ERROR,
									"Error"
								);
								sap.ui.core.BusyIndicator.hide();
							}
						});
					}
				}
			});
			var model = this.getOwnerComponent().getModel("oData"); // Setting oServiceModel defined in Copmponent.js to this value help dialog
			oValueHelpDialog_CardHolderName.setModel(model);
			oValueHelpDialog_CardHolderName.open(); //Opening value help dialog once data is binded to standard list item
		},
		_onDepHeadValueHelpRequest: function () {
			var cardholder = this.getView().byId("DEPARTMENT_HEAD");
			var that2 = this;
			var userid = that2.getView().byId("ON_BEHALF_OF").getValue();
			var oValueHelpDialog_CardHolderName = new sap.m.SelectDialog({ //Using SelectDialog control that will allow single selection along with Search field capability
				title: "Choose Value for Department Head",
				items: {
					path: "/eFormDepartmentHeads",
					filters: [new sap.ui.model.Filter({
						filters: [new sap.ui.model.Filter({
							path: "USERID",
							operator: sap.ui.model.FilterOperator.EQ,
							value1: userid
						})],
						and: true
					})],
					template: new sap.m.StandardListItem({
						title: "{USERID}",
						description: "{NAME}",
						active: true
					})
				},
				//Shipping Point can be searched using Search Bar
				search: function (oEvent) {
					var sValue = oEvent.getParameter("value");
					var oFilter = new sap.ui.model.Filter(
						"NAME",
						sap.ui.model.FilterOperator.Contains, sValue
					);
					oEvent.getSource().getBinding("items").filter([oFilter]);
				},
				//On click of Confirm, value is set to input field
				confirm: function (oEvent) {
					var oSelectedItem = oEvent.getParameter("selectedItem");
					if (oSelectedItem) {
						cardholder.setValue(oSelectedItem.getDescription());
						var model = that2.getOwnerComponent().getModel("oData");
						var that3 = that2;
						var user = oSelectedItem.getTitle();
						model.read("/eFormProductionAccts('" + user + "')", {
							success: function (oData, response) {
								// that3.getView().byId("i_business_phone").setValue(oData.PHONE);
								// that3.getView().byId("i_email_id").setValue(oData.EMAIL);
								//  that3.getView().byId("i_management_level").setText(oData.MANAGEMENT_LEVEL);
							},
							error: function (oError) {
								var response = JSON.parse(oError.responseText);
								MessageBox.show(
									response.error.message.value,
									MessageBox.Icon.ERROR,
									"Error"
								);
								sap.ui.core.BusyIndicator.hide();
							}
						});
					}
				}
			});
			var model = this.getOwnerComponent().getModel("oData"); // Setting oServiceModel defined in Copmponent.js to this value help dialog
			oValueHelpDialog_CardHolderName.setModel(model);
			oValueHelpDialog_CardHolderName.open(); //Opening value help dialog once data is binded to standard list item
		},

		onChangeORGANIZATION_CHECK_1: function () {
			if (this.getView().byId("ORGANIZATION_CHECK_1").getSelectedIndex() == 1) {
				this.getView().byId("ORGANIZATION_CHECK_1_TEXT").setVisible(true);
			} else {
				this.getView().byId("ORGANIZATION_CHECK_1_TEXT").setVisible(false);
				this.getView().byId("ORGANIZATION_CHECK_1_TEXT").setValue("");
			}
		},

		onChangeCONTRIBUTION_QUESTIONNAIRE_1: function () {
			if (this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_1").getSelectedIndex() == 0) {
				this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_1_TEXT").setVisible(true);
			} else {
				this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_1_TEXT").setVisible(false);
				this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_1_TEXT").setValue("");
			}
		},
		onChangeCONTRIBUTION_QUESTIONNAIRE_2: function () {
			if (this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_2").getSelectedIndex() == 0) {
				this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_2_TEXT").setVisible(true);
				//  this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_2_TEXT").setValue("");
			} else {
				this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_2_TEXT").setVisible(false);
				this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_2_TEXT").setValue("");
			}
		},
		onChangeCONTRIBUTION_QUESTIONNAIRE_8: function () {
			if (this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_8").getSelectedIndex() == 1) {
				this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_8_TEXT").setVisible(true);
				// this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_8_TEXT").setValue("");
				this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_8_MSG").setVisible(false);
				this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_8_MSG_S").setVisible(false);
			} else {
				this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_8_TEXT").setVisible(false);
				this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_8_MSG").setVisible(true);
				this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_8_MSG_S").setVisible(true);
				this.getView().byId("CONTRIBUTION_QUESTIONNAIRE_8_TEXT").setValue("");
			}
		},
		onChangeBUSINESS_AFFILIATION_2: function () {
			if (this.getView().byId("BUSINESS_AFFILIATION_2").getSelectedIndex() == 0) {
				this.getView().byId("BUSINESS_AFFILIATION_2_TEXT").setVisible(true);
				// this.getView().byId("BUSINESS_AFFILIATION_2_TEXT").setValue("");
			} else {
				this.getView().byId("BUSINESS_AFFILIATION_2_TEXT").setVisible(false);
				this.getView().byId("BUSINESS_AFFILIATION_2_TEXT").setValue("");
			}
		},
		onChangeBUSINESS_AFFILIATION_3: function () {
			if (this.getView().byId("BUSINESS_AFFILIATION_3").getSelectedIndex() == 0) {
				this.getView().byId("BUSINESS_AFFILIATION_3_TEXT").setVisible(true);
				this.getView().byId("BUSINESS_AFFILIATION_3_MSG").setVisible(true);
				this.getView().byId("BUSINESS_AFFILIATION_3_MSG_S").setVisible(true);
				//  this.getView().byId("BUSINESS_AFFILIATION_3_TEXT").setValue("");
			} else {
				this.getView().byId("BUSINESS_AFFILIATION_3_TEXT").setVisible(false);
				this.getView().byId("BUSINESS_AFFILIATION_3_MSG").setVisible(false);
				this.getView().byId("BUSINESS_AFFILIATION_3_MSG_S").setVisible(false);
				this.getView().byId("BUSINESS_AFFILIATION_3_TEXT").setValue("");
			}
		},
		onChangeBUSINESS_AFFILIATION_4: function () {
			if (this.getView().byId("BUSINESS_AFFILIATION_4").getSelectedIndex() == 0) {
				this.getView().byId("BUSINESS_AFFILIATION_4_TEXT").setVisible(true);
				// this.getView().byId("BUSINESS_AFFILIATION_4_TEXT").setValue("");
			} else {
				this.getView().byId("BUSINESS_AFFILIATION_4_TEXT").setVisible(false);
				this.getView().byId("BUSINESS_AFFILIATION_4_TEXT").setValue("");
			}
		},

		onChangeGOVERNMENT_AFFILIATION_1: function () {
			if (this.getView().byId("GOVERNMENT_AFFILIATION_1").getSelectedIndex() == 1) {
				this.getView().byId("GOVERNMENT_AFFILIATION_1_TEXT").setVisible(true);
				// this.getView().byId("GOVERNMENT_AFFILIATION_1_TEXT").setValue("");
			} else {
				this.getView().byId("GOVERNMENT_AFFILIATION_1_TEXT").setVisible(false);
				this.getView().byId("GOVERNMENT_AFFILIATION_1_TEXT").setValue("");
			}
		},

		onChangeGOVERNMENT_AFFILIATION_2: function () {
			if (this.getView().byId("GOVERNMENT_AFFILIATION_2").getSelectedIndex() == 0) {
				this.getView().byId("GOVERNMENT_AFFILIATION_2_TEXT").setVisible(true);
				// this.getView().byId("GOVERNMENT_AFFILIATION_2_TEXT").setValue("");
			} else {
				this.getView().byId("GOVERNMENT_AFFILIATION_2_TEXT").setVisible(false);
				this.getView().byId("GOVERNMENT_AFFILIATION_2_TEXT").setValue("");
			}
		},

		onChangeRED_FLAGS: function () {
			if (this.getView().byId("GOVERNMENT_AFFILIATION_3").getSelectedIndex() == 0 ||
				this.getView().byId("GOVERNMENT_AFFILIATION_4").getSelectedIndex() == 0 ||
				this.getView().byId("GOVERNMENT_AFFILIATION_5").getSelectedIndex() == 0 ||
				this.getView().byId("GOVERNMENT_AFFILIATION_6").getSelectedIndex() == 0) {
				this.getView().byId("RED_FLAGS_TEXT").setVisible(true);
			} else {
				this.getView().byId("RED_FLAGS_TEXT").setVisible(false);
				this.getView().byId("RED_FLAGS_TEXT").setValue("");
			}
		},
		_onhandleValueChange: function (oEvent) {
			file_size = oEvent.mParameters.files[0].size;
			file_size = (file_size / 1024);
		},
		_onhandleUploadPress: function (oEvent) {
			if (oEvent.mParameters.id.toLowerCase().indexOf("b_upload1") > -1) {
				var oFileUploader = this.getView().byId("i_fileUploader1");
				if (oFileUploader.getValue() == "") {
					MessageBox.alert("Please select the file");
					return;
				}
			}
			if (oEvent.mParameters.id.toLowerCase().indexOf("b_upload2") > -1) {
				var oFileUploader = this.getView().byId("i_fileUploader2");
				if (oFileUploader.getValue() == "") {
					MessageBox.alert("Please select the file");
					return;
				}
			}
			var userModel = this.getOwnerComponent().getModel("oData");
			var viewInstance = this.getView();
			if (oFileUploader.getName() == "") {
				return;
			}
			viewInstance.setBusy(true);
			// Set CSRF
			userModel.refreshSecurityToken();
			var csrf = userModel.getSecurityToken();
			//Add to header and upload
			oFileUploader.destroyHeaderParameters();
			oFileUploader.setSendXHR(true);
			var headerParma = new sap.ui.unified.FileUploaderParameter();
			var headerParma2 = new sap.ui.unified.FileUploaderParameter();
			var headerParma3 = new sap.ui.unified.FileUploaderParameter();
			headerParma2.setName('slug');
			headerParma2.setValue(oFileUploader.getValue() + '|' + eform_number + '|' + file_size + '|' + 'CEF');
			oFileUploader.insertHeaderParameter(headerParma2);
			headerParma3.setName('Content-Type');
			headerParma3.setValue('image/jpeg');
			oFileUploader.insertHeaderParameter(headerParma3);
			headerParma.setName('x-csrf-token');
			headerParma.setValue(csrf);
			oFileUploader.addHeaderParameter(headerParma);
			oFileUploader.upload();
		},
		handleAmountFormatting: function (value) {
			if (value && this.flag !== true) {
				var oValue = value.split(',').join('');;
				var totalUsd = new Intl.NumberFormat('en-US').format(oValue);
				return totalUsd;
			} else {
				return value;
			}
		},

		_onDeleteAttachment: function (oEvent) {
			var model = this.getOwnerComponent().getModel("oData");
			if (oEvent.mParameters.id.toLowerCase().indexOf("b_deleteattachment1") > -1) {
				var selected_item = this.getView().byId("t_attachment1").getSelectedItem();
			}
			if (oEvent.mParameters.id.toLowerCase().indexOf("b_deleteattachment2") > -1) {
				var selected_item = this.getView().byId("t_attachment2").getSelectedItem();
			}
			var filename = selected_item.mAggregations.cells[0].mProperties.text;
			if (filename !== "") {
				if (logger_name == this.getView().byId("PREPARER").getText() ||
					logger_name == this.getView().byId("ON_BEHALF_OF").getValue()) {
					var that = this;
					model.read("/eFormAttachments(EFORM_NUM='" + eform_number + "'" + ",FILE_NAME='" + filename + "')", {
						success: function (oData, response) {
							that.getView().byId("t_attachment1").removeItem(selected_item);
							that.getView().byId("t_attachment2").removeItem(selected_item);
							that.fillAttachments(that);
							MessageBox.alert("Attachment deleted successfully.");
						},
						error: function (oError) {
							var response = JSON.parse(oError.responseText);
							MessageBox.show(
								response.error.message.value,
								MessageBox.Icon.ERROR,
								"Error"
							);
							sap.ui.core.BusyIndicator.hide();
						}
					});
				} else if (logger_name == selected_item.getCells()[4].getText()) {
					var that = this;
					model.read("/eFormAttachments(EFORM_NUM='" + eform_number + "'" + ",FILE_NAME='" + filename + "')", {
						success: function (oData, response) {
							that.getView().byId("t_attachment1").removeItem(selected_item);
							that.getView().byId("t_attachment2").removeItem(selected_item);
							that.fillAttachments(that);
							MessageBox.alert("Attachment deleted successfully.");
						},
						error: function (oError) {
							var response = JSON.parse(oError.responseText);
							MessageBox.show(
								response.error.message.value,
								MessageBox.Icon.ERROR,
								"Error"
							);
							sap.ui.core.BusyIndicator.hide();
						}
					});
				} else {
					MessageBox.alert("You cannot delete this attachment.");

				}

			}

		},

		_onhandleUploadComplete: function (oEvent) {
			var status = oEvent.getParameter("status");
			if (status === 201) {
				var sMsg = "Upload Success";
				oEvent.getSource().setValue("");
			} else {
				sMsg = "Upload Error";
			}
			var temp = oEvent.getParameter("response");
			// S4R:PJAIN6:GWDK902384:08/05/2021:EFORM_NUM ISSUE:START
			// eform_number = temp.slice(118, 128);
			// var start=temp.search("CEF");
			eform_number = temp.substr(temp.indexOf("EFORM_NUM='") + 11, 10);;
			// S4R:PJAIN6:GWDK902384:08/05/2021:EFORM_NUM ISSUE:END
			var oResourceModel = this.getView().getModel("i18n").getResourceBundle();
			var msg1 = eform_number;
			var oText = oResourceModel.getText("CharitableDonationForm", [msg1]);
			this.getView().byId("page1").setText(oText);
			var viewInstance = this.getView();
			viewInstance.setBusy(false);
			var model = this.getOwnerComponent().getModel("oData");
			var relPath = "/eFormAttachments";
			var that = this;
			var oFilter = new sap.ui.model.Filter(
				"EFORM_NUM",
				sap.ui.model.FilterOperator.EQ, eform_number
			);
			model.read(relPath, {
				filters: [oFilter],
				success: function (oData, response) {
					that.getView().byId("t_attachment1").destroyItems();
					that.getView().byId("t_attachment2").destroyItems();
					var counter = oData.results.length;
					var i = 0;
					for (i = 0; i < counter; i++) {
						var table1 = that.getView().byId("t_attachment1");
						var table2 = that.getView().byId("t_attachment2");
						var data1 = new sap.m.ColumnListItem({
							cells: [
								new sap.m.Link({
									text: response.data.results[i].FILE_NAME,
									press: function (oEvent) {
										var that2 = that;
										var oSource = oEvent.getSource();
										var relPath = "/sap/opu/odata/sap/YFPSFIPFRDD0024_CHARITABLE_FRM_SRV/eFormAttachments(EFORM_NUM='" + eform_number +
											"'" + ",FILE_NAME='" + oSource.getText() + "')/$value";
										window.open(relPath, '_blank');
									}
								}),
								new sap.m.Text({
									text: response.data.results[i].CREATION_DT
								}),
								new sap.m.Text({
									text: response.data.results[i].CREATION_TIME
								}),
								new sap.m.Text({
									text: response.data.results[i].FILE_SIZE
								}),
								new sap.m.Text({
									text: response.data.results[i].CREATED_BY
								})
							]
						});
						var data2 = new sap.m.ColumnListItem({
							cells: [
								new sap.m.Link({
									text: response.data.results[i].FILE_NAME,
									press: function (oEvent) {
										var that2 = that;
										var oSource = oEvent.getSource();
										var relPath = "/sap/opu/odata/sap/YFPSFIPFRDD0024_CHARITABLE_FRM_SRV/eFormAttachments(EFORM_NUM='" + eform_number +
											"'" + ",FILE_NAME='" + oSource.getText() + "')/$value";
										window.open(relPath, '_blank');
									}
								}),
								new sap.m.Text({
									text: response.data.results[i].CREATION_DT
								}),
								new sap.m.Text({
									text: response.data.results[i].CREATION_TIME
								}),
								new sap.m.Text({
									text: response.data.results[i].FILE_SIZE
								}),
								new sap.m.Text({
									text: response.data.results[i].CREATED_BY
								})
							]
						});
						table1.addItem(data1);
						table2.addItem(data2);
					}
				},
				error: function (oError) {
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
		_onSaveComment: function (oEvent) {
			var c = {};
			var model = this.getOwnerComponent().getModel("oData");
			c.FORM_NO = eform_number;
			c.FORMNAME = "CEF";
			if (oEvent.mParameters.id.toLowerCase().indexOf("b_save1") > -1) {
				c.COMMENTS = this.getView().byId("i_comment1").getValue();
			}
			if (oEvent.mParameters.id.toLowerCase().indexOf("b_save2") > -1) {
				c.COMMENTS = this.getView().byId("i_comment2").getValue();
			}
			if (c.COMMENTS == "") {
				MessageBox.alert("Please enter the comment");
				return;
			}
			c.SEQUENCE = "";
			c.CREATOR = "";
			c.CR_DATE = "";
			c.TIME = "";
			c.ACTION = "";
			var that = this;
			var that88 = this;
			model.create("/eFormComments", c, {
				async: false,
				success: function (oData, response) {
					eform_number = oData.FORM_NO;
					var msg1 = eform_number;
					var fnumber = that88.getView().getModel().getProperty("/EFORM_NUM")
					that88.getView().getModel().setProperty("/EFORM_NUM", eform_number);

					var oResourceModel = that88.getView().getModel("i18n").getResourceBundle();
					var oText = oResourceModel.getText("CharitableDonationForm", [msg1]);
					that88.getView().byId("page1").setText(oText);
					var msg = "Comment added successfully";
					MessageBox.show(
						msg,
						MessageBox.Icon.SUCCESS
					);
					sap.ui.core.BusyIndicator.hide();
					var relPath = "/eFormComments";
					var model = that88.getOwnerComponent().getModel("oData");
					var that1 = that88;
					var oFilter = new sap.ui.model.Filter(
						"FORM_NO",
						sap.ui.model.FilterOperator.EQ, eform_number
					);
					model.read(relPath, {
						filters: [oFilter],
						success: function (oData, response) {
							that1.getView().byId("t_comment1").destroyItems();
							var counter = oData.results.length;
							var i = 0;
							for (i = 0; i < counter; i++) {
								var table = that1.getView().byId("t_comment1");
								var vedit = oData.results[i].EDIT;
								var data = new sap.m.ColumnListItem({
									cells: [
										new sap.m.Text({
											text: oData.results[i].SEQUENCE
										}),
										new sap.m.TextArea({
											value: oData.results[i].COMMENTS,
											rows: 2,
											cols: 70,
											enabled: vedit
										}),
										new sap.m.Text({
											text: oData.results[i].CREATOR
										}),
										new sap.m.Text({
											text: oData.results[i].CR_DATE
										})
									]
								})
								table.addItem(data);
							} //for
							that1.getView().byId("t_comment2").destroyItems();
							var counter = oData.results.length;
							var i = 0;
							for (i = 0; i < counter; i++) {
								var table = that1.getView().byId("t_comment2");
								var vedit = oData.results[i].EDIT;
								var data = new sap.m.ColumnListItem({
									cells: [
										new sap.m.Text({
											text: oData.results[i].SEQUENCE
										}),
										new sap.m.TextArea({
											value: oData.results[i].COMMENTS,
											rows: 2,
											cols: 70,
											enabled: vedit
										}),
										new sap.m.Text({
											text: oData.results[i].CREATOR
										}),
										new sap.m.Text({
											text: oData.results[i].CR_DATE
										})
									]
								})
								table.addItem(data);
							} //for
						},
						error: function (oError) {
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
				error: function (oError) {
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
		_onClearComment: function (oEvent) {
			this.getView().byId("i_comment1").setValue("");
			this.getView().byId("i_comment2").setValue("");
		},
		_UpdateComment: function (oEvent) {
			var model = this.getOwnerComponent().getModel("oData");
			if (oEvent.mParameters.id.toLowerCase().indexOf("b_update1") > -1) {
				var selected_item = this.getView().byId("t_comment1").getSelectedItem();
			}
			if (oEvent.mParameters.id.toLowerCase().indexOf("b_update2") > -1) {
				var selected_item = this.getView().byId("t_comment2").getSelectedItem();
			}
			var c = {};
			c.FORM_NO = eform_number;
			c.COMMENTS = selected_item.mAggregations.cells[1].mProperties.value;
			c.SEQUENCE = selected_item.mAggregations.cells[0].mProperties.text;
			c.CREATOR = "";
			c.CR_DATE = "";
			c.TIME = "";
			c.ACTION = "";
			var that = this;
			if (selected_item.mAggregations.cells[2].mProperties.text == logger_name) {
				model.create("/eFormComments", c, {
					async: false,
					success: function (oData, response) {
						var msg = "Comment updated successfully";
						MessageBox.show(
							msg,
							MessageBox.Icon.SUCCESS
						);
						sap.ui.core.BusyIndicator.hide();
						var relPath = "/eFormComments";
						var model = that.getOwnerComponent().getModel("oData");
						var that1 = that;
						var oFilter = new sap.ui.model.Filter(
							"FORM_NO",
							sap.ui.model.FilterOperator.EQ, eform_number
						);
						model.read(relPath, {
							filters: [oFilter],
							success: function (oData, response) {
								that1.getView().byId("t_comment1").destroyItems();
								var counter = oData.results.length;
								var i = 0;
								for (i = 0; i < counter; i++) {
									var table = that1.getView().byId("t_comment1");
									var vedit = oData.results[i].EDIT;
									var data = new sap.m.ColumnListItem({
										cells: [
											new sap.m.Text({
												text: oData.results[i].SEQUENCE
											}),
											new sap.m.TextArea({
												value: oData.results[i].COMMENTS,
												rows: 2,
												cols: 70,
												enabled: vedit
											}),
											new sap.m.Text({
												text: oData.results[i].CREATOR
											}),
											new sap.m.Text({
												text: oData.results[i].CR_DATE
											})
										]
									})
									table.addItem(data);
								} //for
								that1.getView().byId("t_comment2").destroyItems();
								var counter = oData.results.length;
								var i = 0;
								for (i = 0; i < counter; i++) {
									var table = that1.getView().byId("t_comment2");
									var vedit = oData.results[i].EDIT;
									var data = new sap.m.ColumnListItem({
										cells: [
											new sap.m.Text({
												text: oData.results[i].SEQUENCE
											}),
											new sap.m.TextArea({
												value: oData.results[i].COMMENTS,
												rows: 2,
												cols: 70,
												enabled: vedit
											}),
											new sap.m.Text({
												text: oData.results[i].CREATOR
											}),
											new sap.m.Text({
												text: oData.results[i].CR_DATE
											})
										]
									})
									table.addItem(data);
								} //for
							},
							error: function (oError) {
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
					error: function (oError) {
						var response = JSON.parse(oError.responseText);
						MessageBox.show(
							response.error.message.value,
							MessageBox.Icon.ERROR,
							"Error"
						);
						sap.ui.core.BusyIndicator.hide();
					}
				});
			} else {
				sap.m.MessageBox.show("Comment cannot be updated.");
			}
		},
		_DeleteComment: function (oEvent) {
			var model = this.getOwnerComponent().getModel("oData");
			if (oEvent.mParameters.id.toLowerCase().indexOf("b_delete1") > -1) {
				var selected_item = this.getView().byId("t_comment1").getSelectedItem();
			}
			if (oEvent.mParameters.id.toLowerCase().indexOf("b_delete2") > -1) {
				var selected_item = this.getView().byId("t_comment2").getSelectedItem();
			}
			var c = {};
			c.FORM_NO = eform_number;
			c.COMMENTS = selected_item.mAggregations.cells[1].mProperties.value;
			c.SEQUENCE = selected_item.mAggregations.cells[0].mProperties.text;
			c.CREATOR = "";
			c.CR_DATE = "";
			c.TIME = "";
			c.ACTION = "Delete";
			var that = this;
			if (selected_item.mAggregations.cells[2].mProperties.text == logger_name) {
				model.create("/eFormComments", c, {
					async: false,
					success: function (oData, response) {
						var msg = "Comment deleted successfully";
						MessageBox.show(
							msg,
							MessageBox.Icon.SUCCESS
						);
						sap.ui.core.BusyIndicator.hide();
						var relPath = "/eFormComments";
						var model = that.getOwnerComponent().getModel("oData");
						var that1 = that;
						var oFilter = new sap.ui.model.Filter(
							"FORM_NO",
							sap.ui.model.FilterOperator.EQ, eform_number
						);
						model.read(relPath, {
							filters: [oFilter],
							success: function (oData, response) {
								that1.getView().byId("t_comment1").destroyItems();
								var counter = oData.results.length;
								var i = 0;
								for (i = 0; i < counter; i++) {
									var table = that1.getView().byId("t_comment1");
									var vedit = oData.results[i].EDIT;
									var data = new sap.m.ColumnListItem({
										cells: [
											new sap.m.Text({
												text: oData.results[i].SEQUENCE
											}),
											new sap.m.TextArea({
												value: oData.results[i].COMMENTS,
												rows: 2,
												cols: 70,
												enabled: vedit
											}),
											new sap.m.Text({
												text: oData.results[i].CREATOR
											}),
											new sap.m.Text({
												text: oData.results[i].CR_DATE
											})
										]
									})
									table.addItem(data);
								} //for
								that1.getView().byId("t_comment2").destroyItems();
								var counter = oData.results.length;
								var i = 0;
								for (i = 0; i < counter; i++) {
									var table = that1.getView().byId("t_comment2");
									var vedit = oData.results[i].EDIT;
									var data = new sap.m.ColumnListItem({
										cells: [
											new sap.m.Text({
												text: oData.results[i].SEQUENCE
											}),
											new sap.m.TextArea({
												value: oData.results[i].COMMENTS,
												rows: 2,
												cols: 70,
												enabled: vedit
											}),
											new sap.m.Text({
												text: oData.results[i].CREATOR
											}),
											new sap.m.Text({
												text: oData.results[i].CR_DATE
											})
										]
									})
									table.addItem(data);
								} //for
							},
							error: function (oError) {
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
					error: function (oError) {
						var response = JSON.parse(oError.responseText);
						MessageBox.show(
							response.error.message.value,
							MessageBox.Icon.ERROR,
							"Error"
						);
						sap.ui.core.BusyIndicator.hide();
					}
				});
			} else {
				sap.m.MessageBox.show("Comment cannot be deleted by other user.");
			}
		},
		_add_approver: function () {
			var table = this.getView().byId("approvers_table");
			var num_of_entries = table.getItems().length;
			var all_entries = table.getItems();
			index_counter = index_counter + 1;
			var selected_item = this.getView().byId("approvers_table").getSelectedItem();
			if (selected_item.mAggregations.cells[1].mProperties.value == "EMD Clerk" && this.getView().byId("ENTRY_SEQUENCE").getValue() ==
				"After" && table.indexOfItem(selected_item) != "0") {
				MessageBox.alert("You cannot add Approvers/Watchers after EMD Clerk ");
				return;
			}
			if (selected_item.mAggregations.cells[0].mProperties.selected == false || this.getView().byId("ENTRY_SEQUENCE").getValue() ==
				"After") {
				if (this.getView().byId("ENTRY_SEQUENCE").getValue() == "After") {
					var index = table.indexOfItem(selected_item) + 1;
				} else {
					if (table.indexOfItem(selected_item) > 0) {
						var index = table.indexOfItem(selected_item);
						if (index == 0) {
							index = 1;
						}
					} else {
						index = 0;
					}
				}
				table.removeAllItems();
				var counter = 0;
				var x = 1;
				var that = this;
				for (counter = 0; counter < num_of_entries; counter++) {
					x = x + 1;
					if (counter == index) {
						var data = new sap.m.ColumnListItem({
							cells: [
								new sap.m.CheckBox({
									editable: false,
									selected: false
								}),
								new sap.m.Input({
									showValueHelp: Boolean("true"),
									valueHelpOnly: Boolean("true"),
									id: "approver" + index_counter,
									valueHelpRequest: [that._onApproverHelpRequest, that]
								}),
								new sap.m.Text({
									text: this.getView().byId("REVIEWER_TYPE").getValue()
								}),
								new sap.m.Text({
									text: ""
								}),
								new sap.m.Text({
									text: ""
								}),
								new sap.m.Text({
									text: ""
								}),
								new sap.m.CheckBox({
									editable: false,
									selected: true
								}),
								new sap.m.Text({
									text: logger_name
								}),
								new sap.m.Text({
									text: ""
								})
							]
						});
						table.addItem(data);
					}
					table.addItem(all_entries[counter]);
					if (counter === (num_of_entries - 1) && (index === num_of_entries)) {
						var data = new sap.m.ColumnListItem({
							cells: [
								new sap.m.CheckBox({
									editable: false,
									selected: false
								}),
								new sap.m.Input({
									showValueHelp: Boolean("true"),
									valueHelpOnly: Boolean("true"),
									id: "approver2" + index_counter,
									valueHelpRequest: [that._onApproverHelpRequest, that]
								}),
								new sap.m.Text({
									text: this.getView().byId("REVIEWER_TYPE").getValue()
								}),
								new sap.m.Text({
									text: ""
								}),
								new sap.m.Text({
									text: ""
								}),
								new sap.m.Text({
									text: ""
								}),
								new sap.m.CheckBox({
									editable: false,
									selected: true
								}),
								new sap.m.Text({
									text: logger_name
								}),
								new sap.m.Text({
									text: ""
								})
							]
						});
						table.addItem(data);
					}
				}
			} else {
				MessageBox.alert("You cannot add Approvers/Watchers before an Approved Item ");
			}
		},
		_delete_approver: function () {
			//This code was generated by the layout editor.
			var table = this.getView().byId("approvers_table");
			var selected_item = this.getView().byId("approvers_table").getSelectedItem();
			//deleting mannually added items
			if (selected_item.mAggregations.cells[0].mProperties.selected == false && selected_item.mAggregations.cells[6].mProperties.selected ==
				true) {
				table.removeItem(selected_item);
			} else {
				//  if (selected_item.mAggregations.cells[5].mProperties.selected == false) {
				//    MessageBox.alert("You cannot delete the Approver since its determined by COFA logic ");
				//  }
				if (selected_item.mAggregations.cells[0].mProperties.selected == true) {
					MessageBox.alert("You cannot delete the approver since it is already approved ");
				}
			}
		},
		_onSubLobValueHelpRequest: function () {
			var sublob = this.getView().byId("SUBLOB");
			var lob = this.getView().byId("LOB").getValue();
			var oValueHelpDialog_RespDiv = new sap.m.SelectDialog({
				title: "Choose Value for COFA SubLob",
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
				//Shipping Point can be searched using Search Bar
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
					}
				}
			});
			var model = this.getOwnerComponent().getModel("oData");
			oValueHelpDialog_RespDiv.setModel(model);
			oValueHelpDialog_RespDiv.open();
		},
		_onEditPress: function (oEvent) {
			var model = this.getOwnerComponent().getModel("oData");
			var that = this;
			model.read("/eFormInitialInfos('" + eform_number + "')", {
				success: function (oData, response) {
					if (response.data.STATUS == "Not Authorised") {
						// edit is allowed
						MessageBox.alert("You cannot edit this eForm.");
						return;
					}
					if (response.data.STATUS == "Data Saved" || response.data.STATUS == "Withdrawn") {
						// edit is allowed
						var oModel = that.getView().getModel();
						var editmode = oModel.getProperty("/requestmode");
						editmode = Boolean(1);
						oModel.setProperty("/requestmode", editmode);
						var editmode = oModel.getProperty("/requestmode");
						editmode = Boolean(1);
						oModel.setProperty("/comp_table_mode", editmode);
						MessageBox.alert("You can edit this eForm.");

						//        that.getView().byId("b_approve").setVisible(false);
						//          that.getView().byId("b_reject").setVisible(false);
						that.getView().byId("HOME").setVisible(false);
						that.getView().byId("b_save").setVisible(true);
						that.getView().byId("b_submit").setVisible(true);
						that.getView().byId("b_withdraw").setVisible(false);
						that.getView().byId("b_print").setVisible(true);
					}

					if (response.data.STATUS == "Rejected") {
						// edit is allowed
						var oModel = that.getView().getModel();
						var editmode = oModel.getProperty("/requestmode");
						editmode = Boolean(1);
						oModel.setProperty("/requestmode", editmode);
						var editmode = oModel.getProperty("/requestmode");
						editmode = Boolean(1);
						oModel.setProperty("/comp_table_mode", editmode);
						MessageBox.alert("You can edit this eForm.");
						//        that.getView().byId("b_approve").setVisible(true);
						//                   that.getView().byId("b_reject").setVisible(false);
						if (window.top.location.href.toLowerCase().indexOf("fiorilaunchpad") == -1) {
							// S4R:PJAIN6:GWDK902351:07/22/2021:Seting visibility of home icon false:START
							// that.getView().byId("HOME").setVisible(true);
							   that.getView().byId("HOME").setVisible(false);
							// S4R:PJAIN6:GWDK902351:07/22/2021:Seting visibility of home icon false:END
						}
						that.getView().byId("b_save").setVisible(true);
						that.getView().byId("b_submit").setVisible(false);
						that.getView().byId("b_withdraw").setVisible(true);
						that.getView().byId("b_print").setVisible(true);

					}

					if (response.data.STATUS == "In Approval") {
						that._onWithdrawPress();

					}
					if (response.data.STATUS == "Approved") {
						MessageBox.alert("You cannot edit this approved eForm.");
						return;
					}
				},
				error: function (oError) {
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
		_onDeletePress: function (oEvent) {
			var model = this.getOwnerComponent().getModel("oData");
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var that = this;
			model.read("/eFormInitialInfos('" + eform_number + "')", {
				success: function (oData, response) {
					if (response.data.STATUS == "Not Authorised") {
						// edit is allowed
						MessageBox.alert("You cannot Delete this eForm.");
						return;
					} else {
						eform_status = "Delete";
						that.onSavePress();
						that.oRouter.navTo("default", true);
					}
				},
				error: function (oError) {
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
		_onWithdrawPress: function (oEvent) {

			var oModel = this.getOwnerComponent().getModel("oData");
			var that1 = this;
			oModel.read("/eFormInitialInfos('" + eform_number + "')", {
				success: function (oData, response) {
					if (response.data.STATUS == "Not Authorised") {
						// edit is not allowed
						MessageBox.alert("You cannot withdraw this eForm.");
						return;
					} else {

						var model = that1.getOwnerComponent().getModel("oData");
						var s = {};
						var that = that1;
						var curr_view = that1.getView();
						window.eform_withdraw;
						new Promise(function (fnResolve) {
							sap.m.MessageBox.confirm("Do you want to Cancel the workflow for Charitable Expenditure Form process?", {
								title: "Confirm Withdraw",
								actions: ["Yes", "No"],
								onClose: function (sActionClicked) {
									if (sActionClicked === "Yes") {
										eform_status = "Withdrawn";
										that.onSavePress();
										var oModel = that.getView().getModel();
										var editmode = oModel.getProperty("/requestmode");
										editmode = Boolean(1);
										oModel.setProperty("/requestmode", editmode);
										var editmode = oModel.getProperty("/comp_table_mode");
										editmode = Boolean(1);
										oModel.setProperty("/comp_table_mode", editmode);
										MessageBox.alert("You can edit this eForm.");
										//        that.getView().byId("b_approve").setVisible(false);
										//        that.getView().byId("b_reject").setVisible(false);
										that.getView().byId("HOME").setVisible(false);
										that.getView().byId("b_save").setVisible(true);
										that.getView().byId("b_submit").setVisible(true);
										that.getView().byId("b_withdraw").setVisible(false);
										that.getView().byId("b_print").setVisible(true);

									} else {}
								}
							});
						}).catch(function (err) {
							if (err !== undefined) {
								MessageBox.error(err);
							}
						});
						if (window.eform_withdraw == "X") {}

					}
				},
				error: function (oError) {
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
		handleAmountFormatting: function (value) {
			if (value && this.flag !== true) {
				var oValue = value.split(',').join('');;
				var totalUsd = new Intl.NumberFormat('en-US').format(oValue);
				return totalUsd;
			} else {
				return value;
			}
		},
		handleAmoutFormatterByTotal: function (oEvent) {

			var sAmount = oEvent.getParameter("value");
			var a = sAmount.split(',').join('');
			var str1;
			var str2;
			var regx = /[^0-9]/g;
			var res = regx.test(a);
			if (res === false) {
				var totalUsd = new Intl.NumberFormat('en-US').format(a);
				sap.ui.getCore().byId(oEvent.getParameter("id")).setValue(totalUsd);
			} else {
				var result = a.match(regx);
				var substr = a.replace(result, '');
				var totalUsd;
				if (a.indexOf(".") !== -1) {
					var index = a.indexOf(".");
					str1 = a.substr(0, index);
					str2 = a.substr(index);
					var result1 = str1.match(regx);
					if (result1 !== null) {
						str1.replace(result1, '');
					}
					var result2 = str2.match(regx);
					if (result2[0] === "." && result2[1] !== null) {
						str2.replace(result2[1], '');
					}
					totalUsd = new Intl.NumberFormat('en-US').format(str1);
					totalUsd = totalUsd + str2;
				} else {
					totalUsd = new Intl.NumberFormat('en-US').format(substr);
				}
				sap.ui.getCore().byId(oEvent.getParameter("id")).setValue(totalUsd);
			}

			if (this.getView().byId("AMOUNT_DONATION").sId === oEvent.getSource().sId) {
				this.getView().getModel().setProperty("/AMOUNT_DONATION", totalUsd);
				this._onCurrencyChange();
			}
		},
		_add_contact: function () {
			var oModel = this.getView().getModel(); // the model
			var aRows = oModel.getProperty("/CONTACTS"); // array with all rows in the model
			var table_items = this.getView().byId("CONTACTS").getItems();
			var num_items = table_items.length;
			var item = {
				CONTACT_NAME: "",
				CONTACT_METHOD: "",
				CONTACT_DETAILS: ""
			}; // an empty object
			aRows.push(item); // add the item at the index
			oModel.setProperty("/CONTACTS", aRows);
		},
		_copy_contact: function () {
			var oModel = this.getView().getModel(); // the model
			var aRows = oModel.getProperty("/CONTACTS"); // array with all rows in the model
			var dRows = aRows;
			var alength = aRows.length;
			var table = this.getView().byId("CONTACTS");
			var selected_items = this.getView().byId("CONTACTS").getSelectedItems();
			var num_of_entries = selected_items.length;
			var counter = 0;
			var index = 0;
			for (counter = 0; counter < num_of_entries; counter++) {
				var item1 = selected_items[counter];
				var cells = item1.getCells();
				//  for (var temp = 0; temp < alength; temp++) {
				var item = {
					CONTACT_NAME: cells[0].mProperties.value,
					CONTACT_METHOD: cells[1].mProperties.value,
					CONTACT_DETAILS: cells[2].mProperties.value
				}; // an empty object
				dRows.push(item); // add the item at the index
				// }
			}
			oModel.setProperty("/CONTACTS", dRows);
		},
		_delete_contact: function () {
			//This code was generated by the layout editor.
			var oModel = this.getView().getModel(); // the model
			var aRows = oModel.getProperty("/CONTACTS"); // array with all rows in the model
			var dRows = aRows;
			var alength = aRows.length;
			var table = this.getView().byId("CONTACTS");
			var selected_items = this.getView().byId("CONTACTS").getSelectedItems();
			var num_of_entries = selected_items.length;
			var counter = 0;
			var index = 0;
			for (counter = 0; counter < num_of_entries; counter++) {
				var item1 = selected_items[counter];
				var cells = item1.getCells();
				for (var temp = 0; temp < alength; temp++) {
					if (aRows[temp].CONTACT_NAME == cells[0].mProperties.value &&
						aRows[temp].CONTACT_METHOD == cells[1].mProperties.value &&
						aRows[temp].CONTACT_DETAILS == cells[2].mProperties.value) {
						index = temp;
						dRows.splice(index, 1);
						break;
					}
				}
			}
			oModel.setProperty("/CONTACTS", dRows);
		},
		onInit: function () {
			this.mBindingOptions = {};
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("CreatePage").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.attachRouteMatched(this._onObjectMatched, this);
		}
	});
}, /* bExport= */ true);