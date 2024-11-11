sap.ui.define([
    "./BaseController",
    "../model/formatter",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox"
],
    function (BaseController, formatter, JSONModel, Filter, FilterOperator, MessageBox) {
        "use strict";

        return BaseController.extend("acn.btpui5treinamento.controller.Worklist", {

            formatter: formatter,

            onInit: function () {
                this.setModel(new JSONModel({
                    nome: "",
                    id: "",
                    createdBy: "",
                    status: ""
                }), "oFilterModel")

                this.setModel(new JSONModel({
                    CurrentDate: new Date()
                }), "oDateControl")

                this.setModel(new JSONModel({
                    nome: "",
                    id: "",
                    cidade: "",
                    valorTotal: "",
                }), "oModelCreate")

                this.setModel(new JSONModel({
                    editable: true
                }), "oControl")
            },

            stringParaData: function (dataString) {
                const aCuts = dataString.split("/")
                const data = new Date(aCuts[2], aCuts[1] - 1, aCuts[0])

                return data
            },

            convertToEdmDateTime: function (Date) {
                var iso = Date.toISOString()
                var trim = `${iso.slice(0, -5)}z`

                return trim
            },

            onSearch: function (oEvent) {
                debugger
                var oSmart = this.getView().byId("smtUser")
                oSmart.rebindTable(true)
            },

            onRebindTable: function (oEvent) {
                //Smart Table
                var oBindinParams = oEvent.getParameter("bindingParams")
                //Parametros de tela
                var oFilterModel = this.getModel("oFilterModel").getData()
                if (oBindinParams) {
                    var aFields = Object.getOwnPropertyNames(oFilterModel)
                    if (aFields.length > 0) {
                        aFields.forEach(campo => {
                            if (oFilterModel[campo]) {
                                if (campo === 'nome') {
                                    oBindinParams.filters.push(new Filter(`${campo}`, FilterOperator.Contains, oFilterModel[campo]))
                                } else {
                                    oBindinParams.filters.push(new Filter(`${campo}`, FilterOperator.EQ, oFilterModel[campo]))
                                }
                            }
                        })
                    }

                    //var oDtrCreate = this.getView().byId("dtrCreate").getValue()
                    //if (oDtrCreate) {
                    //    var aDates = oDtrCreate.split('-')
                    //    aDates[0] = aDates[0].replace(/[" "]/g, "")
                    //    aDates[1] = aDates[1].replace(/[" "]/g, "")
                    //    if (aDates[0] === aDates[1]) {
                    //        oBindinParams.filters.push(new Filter("createdAt", FilterOperator.EQ, this.convertToEdmDateTime(this.stringParaData(aDates[0]))))
                    //    } else {
                    //        oBindinParams.filters.push(new Filter("createdAt", FilterOperator.BT, this.convertToEdmDateTime(this.stringParaData(aDates[0])), this.convertToEdmDateTime(this.stringParaData(aDates[1]))))
                    //    }
                    //}
                }
            },
            onCallNextScreen: function (oEvent) {
                debugger
                var sID = oEvent.getSource().getBindingContext().getObject().id
                var sNome = oEvent.getSource().getBindingContext().getObject().nome
                this.getRouter().navTo("RouterObject", {
                    ID: sID,
                    NOME: sNome,
                })
            },

            openDialog: function (sFragmentName) {
                if (this._oDialog) {
                    this.closeDialog()
                }
                var sPath = `acn.btpui5treinamento.fragment.${sFragmentName}`
                this._oDialog = sap.ui.xmlfragment(this.getView().getId(), sPath, this)
                this.getView().addDependent(this._oDialog)
                this._oDialog.setEscapeHandler(function () {
                    this.closeDialog()
                }.bind(this))
                this._oDialog.open()
            },

            openDialogEdit: function (sFragmentName) {
                if (this._oDialog) {
                    this.closeDialog()
                }
                var sPath = `acn.btpui5treinamento.fragment.${sFragmentName}`
                this._oDialog = sap.ui.xmlfragment(this.getView().getId(), sPath, this)
                this.getView().addDependent(this._oDialog)
                this._oDialog.setEscapeHandler(function () {
                    this.closeDialog()
                }.bind(this))
            },

            closeDialog: function () {
                this._oDialog.destroy()
                this._oDialog = null
                this.getModel("oModelCreate").setData({})
            },

            onCreateUser: function () {
                debugger
                this.getModel("oControl").setProperty("/editable", true)
                this.openDialog('pedido')
            },

            onCheckID: function (oEvent) {
                var oControl = oEvent.getParameters()
                var sValue = oControl.value
                sValue = sValue.replace(/\D/g, "")
                oEvent.getSource().setValue(sValue)
            },

            onCheckAmount: function (oEvent) {
                debugger
                var oControl = oEvent.getParameters()
                var sValue = oControl.value
                if (!sValue.includes(',')) {
                    var sValueLimDec = sValue.replace(/\D/g, "")
                    if (sValueLimDec.length > 7) {
                        sValue = sValue.slice(0, -1)
                        oEvent.getSource().setValue(sValue)
                    } else {
                        sValue = sValueLimDec.replace(/^0+(?!$)/, '')
                        let sConcat = ""
                        var iDiv = sValue
                        var bFind = false
                        while (iDiv >= 1000) {
                            bFind = true
                            var iMod = iDiv % 1000
                            iDiv = (iDiv / 1000) | 0
                            var sConcatStr = iDiv.toString()
                            var sMod = iMod.toString()
                            var sZeros = ""
                            for (let i = 0; i < 3 - sMod.length; i++) {
                                sZeros = sZeros + "0"
                            }
                            sMod = sZeros + sMod
                            sConcat = "." + sMod + sConcat
                        }
                        if (sValue) {
                            if (bFind) {
                                sConcat = sConcatStr + sConcat
                                oEvent.getSource().setValue(sConcat)
                            } else {
                                oEvent.getSource().setValue(sValue)
                            }
                        } else {
                            oEvent.getSource().setValue(sValue)
                        }
                    }
                } else {
                    sValue = sValue.replace(/[^0-9,.]/g, "")
                    sValue = sValue.replace(/(\,\d{2})\d+/, '$1');
                    oEvent.getSource().setValue(sValue)
                }
            },

            onSaveUser: function () {
                var oCheckModel = this.getModel("oControl").getData()
                if (!oCheckModel.editable) {
                    this.updateUser()
                    return
                }
                var sID = this.getView().byId("idIP").getValue()
                var isInterger = /^\d+$/.test(sID)
                var oSmart = this.getView().byId("smtUser")
                var oI18n = this.getModel("i18n").getResourceBundle()
                if (this._oDialog) {
                    this._oDialog.close()
                }
                if (!isInterger) {
                    MessageBox.error(oI18n.getText("errOnCreate"), {
                        actions: [`${oI18n.getText('ok')}`],
                        onClose: sAction => {
                            if (sAction === oI18n.getText('ok')) {
                                this._oDialog.open()
                                return
                            }
                        }
                    })
                    return
                }
                let sValueTotal_truncade = 0.00
                var sValueTotal = this.getView().byId("AmountIp").getValue()
                if (sValueTotal != undefined && sValueTotal != null && sValueTotal != "") {
                    sValueTotal = sValueTotal.replace(/[^0-9,]/g, "")
                    var isNumber = (!isNaN(sValueTotal) && !isNaN(parseFloat(sValueTotal))) || sValueTotal.includes(',');
                    if (!isNumber) {
                        MessageBox.error(oI18n.getText("errOnCreate3"), {
                            actions: [`${oI18n.getText('ok')}`],
                            onClose: sAction => {
                                if (sAction === oI18n.getText('ok')) {
                                    this._oDialog.open()
                                    return
                                }
                            }
                        })
                        return
                    }
                    let sValueTotal_replace = sValueTotal.replace(/,/g, '.')
                    sValueTotal_truncade = Math.round(sValueTotal_replace * 100) / 100;
                } else {
                    sValueTotal_truncade = this.getView().byId("AmountIp").getValue()
                }
                debugger
                var oCreate = {
                    id: sID,
                    nome: this.getModel("oModelCreate").getData().nome,
                    cidade: this.getModel("oModelCreate").getData().cidade,
                    valorTotal: sValueTotal_truncade,
                    status: this.getModel("oModelCreate").getData().status
                }
                var aFields = Object.getOwnPropertyNames(oCreate)
                var aValid = []
                if (aFields.length > 0) {
                    aFields.forEach(campo => {
                        if (oCreate[campo] === "" || oCreate[campo] === null || oCreate[campo] === undefined) {
                            aValid.push('X')
                        }
                    })
                }
                if (aValid.some(data => data === 'X')) {
                    MessageBox.error(oI18n.getText("errOnCreate2"), {
                        actions: [`${oI18n.getText('ok')}`],
                        onClose: sAction => {
                            if (sAction === oI18n.getText('ok')) {
                                this._oDialog.open()
                                return
                            }
                        }
                    })
                    return
                }
                this.closeDialog()
                this.getModel().create("/Pedidos", oCreate, {
                    success: oData => {
                        debugger
                        MessageBox.success(oI18n.getText("success"), {
                            actions: [`${oI18n.getText('ok')}`],
                            onClose: sAction => {
                                if (sAction === oI18n.getText('ok')) {
                                    oSmart.rebindTable(true)
                                    return
                                }
                            }
                        })
                    },
                    error: err => {
                        if (err.statusCode === '400') {
                            MessageBox.error(oI18n.getText("errOnCreate5"), {
                                actions: [`${oI18n.getText('ok')}`],
                                onClose: sAction => {
                                    if (sAction === oI18n.getText('ok')) {
                                        oSmart.rebindTable(true)
                                        return
                                    }
                                }
                            })
                            return
                        } else {
                            MessageBox.error(err)
                            return
                        }
                    }
                })
                
            },


            onEditUser: function () {
                this.getModel("oControl").setProperty("/editable", false)
                var iSelected = this.getView().byId("tbUser").getSelectedItems().length
                if (iSelected === 0) {
                    var oI18n = this.getModel("i18n").getResourceBundle()
                    MessageBox.error(oI18n.getText("errOnCreate4"))
                    return
                } else {
                    var sID = this.getView().byId("tbUser").getSelectedContexts()[0].getObject().id
                    if (sID) {
                        this.openDialogEdit("pedido")
                        this.getModel().read(`/Pedidos(${sID})`, {
                            success: oUser => {
                                this.getView().byId("idIP").setValue(oUser.id)
                                this.getModel("oModelCreate").setProperty("/nome", oUser.nome)
                                this.getModel("oModelCreate").setProperty("/cidade", oUser.cidade)
                                this.getView().byId("AmountIp").setValue(formatter.currencyFormat(oUser.valorTotal))
                                if (this._oDialog) {
                                    this._oDialog.open()
                                }
                            },
                            error: err => {
                                MessageBox.error(err)
                            }
                        })
                    }
                }
            },

            updateUser: function () {
                debugger
                var oI18n = this.getModel("i18n").getResourceBundle()
                var oSmart = this.getView().byId("smtUser")
                if (this._oDialog) {
                    this._oDialog.close()
                }
                let sValueTotal_truncade = 0.00
                var sValueTotal = this.getView().byId("AmountIp").getValue()
                if (sValueTotal != undefined && sValueTotal != null && sValueTotal != "") {
                    sValueTotal = sValueTotal.replace(/[^0-9,]/g, "")
                    var isNumber = (!isNaN(sValueTotal) && !isNaN(parseFloat(sValueTotal))) || sValueTotal.includes(',');
                    if (!isNumber) {
                        MessageBox.error(oI18n.getText("errOnCreate3"), {
                            actions: [`${oI18n.getText('ok')}`],
                            onClose: sAction => {
                                if (sAction === oI18n.getText('ok')) {
                                    this._oDialog.open()
                                    return
                                }
                            }
                        })
                        return
                    }
                    let sValueTotal_replace = sValueTotal.replace(/,/g, '.')
                    sValueTotal_truncade = Math.round(sValueTotal_replace * 100) / 100;
                } else {
                    sValueTotal_truncade = this.getView().byId("AmountIp").getValue()
                }
                var sID = this.getView().byId("idIP").getValue()
                var oUpdate = {
                    id: sID,
                    nome: this.getModel("oModelCreate").getData().nome,
                    valorTotal: sValueTotal_truncade,
                    status: this.getModel("oModelCreate").getData().status,
                }
                var aFields = Object.getOwnPropertyNames(oUpdate)
                var aValid = []
                if (aFields.length > 0) {
                    aFields.forEach(campo => {
                        if (oUpdate[campo] === "" || oUpdate[campo] === null || oUpdate[campo] === undefined) {
                            aValid.push('X')
                        }
                    })
                }
                if (aValid.some(data => data === 'X')) {
                    MessageBox.error(oI18n.getText("errOnUpdate"), {
                        actions: [`${oI18n.getText('ok')}`],
                        onClose: sAction => {
                            if (sAction === oI18n.getText('ok')) {
                                this._oDialog.open()
                                return
                            }
                        }
                    })
                    return
                }
                this.closeDialog()
                this.getModel().update(`/Pedidos(${oUpdate.id})`, oUpdate, {
                    success: oUser => {
                        MessageBox.success(oI18n.getText("update"), {
                            actions: [`${oI18n.getText('ok')}`],
                            onClose: sAction => {
                                if (sAction === oI18n.getText('ok')) {
                                    oSmart.rebindTable(true)
                                    return
                                }
                            }
                        })
                    },
                    error: err => {
                        console.log(err)
                    }
                })
            },

            handleSubmitChanges: function (oOptions) {
                var oModel = this.getModel()
                oModel.submitChanges({
                    groupId: oOptions.groupId,
                    success: data => {
                        if (!data.__batchResponses) {
                            oOptions.error()
                            return
                        }
                        var isError = data.__batchResponses.some(line => {
                            if (line.response) {
                                return line.response.statusCode[0] !== "2"
                            }
                            if (line.__changeResponses) {
                                return line.__changeResponses.some(item => {
                                    return item.statusCode[0] !== "2"
                                })
                            }
                        })
                        if (isError) {
                            oOptions.error()
                        } else {
                            oOptions.success()
                        }
                    },
                    error: err => {
                        oOptions.error()
                    }
                })
            },

            onDeleteUser: function () {
                debugger
                var oModel = this.getModel()
                var sGroup = jQuery.sap.uid()
                oModel.setDeferredGroups([sGroup])
                var iSelected = this.getView().byId("tbUser").getSelectedItems().length
                if (iSelected === 0) {
                    var oI18n = this.getModel("i18n").getResourceBundle()
                    MessageBox.error(oI18n.getText("errOnCreate4"))
                    return
                }
                var sID = this.getView().byId("tbUser").getSelectedContexts()[0].getObject().id
                var fnSubmitDelete = () => {
                    var oI18n = this.getModel("i18n").getResourceBundle()
                    this.handleSubmitChanges({
                        grouId: sGroup,
                        success: () => {
                            MessageBox.success(oI18n.getText("registroremovido"))
                        },
                        error: () => {
                            MessageBox.error(oI18n.getText("registronaoremovido"))
                        }
                    })
                }
                debugger
                this.getModel().read(`/Pedidos(${sID})`, {
                    urlParameters: {
                        "$expand": "produto,servico"
                    },
                    success: oData => {
                        if (oData) {
                            oModel.remove(`/Pedidos(${oData.id})`, {
                                groupId: sGroup
                            })
                            if (oData.produto.results.length > 0) {
                                oData.produto.results.forEach(item => {
                                    var sPath = oModel.createKey("/Produtos", {
                                        codProduto: encodeURIComponent(item.codProduto),
                                        id: encodeURIComponent(item.id)
                                    })
                                    oModel.remove(sPath , {
                                        groupId: sGroup
                                    })
                                })
                            }
                            if (oData.servico.results.length > 0) {
                                oData.servico.results.forEach(item => {
                                    var sPath = oModel.createKey("/Servicos", {
                                        codProduto: encodeURIComponent(item.codServico),
                                        id: encodeURIComponent(item.id)
                                    })
                                    oModel.remove(sPath, {
                                        groupId: sGroup
                                    })
                                })
                            }
                            fnSubmitDelete()
                        }
                    },
                    error: err => {
                        console.log(err)
                    }
                })
            }
        });
    });