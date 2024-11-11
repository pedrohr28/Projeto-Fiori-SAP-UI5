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

        return BaseController.extend("acn.btpui5treinamento.controller.Object", {

            formatter: formatter,

            onInit: function () {
                debugger
                this.setModel(new JSONModel({}), "objectModel")
                this.setModel(new JSONModel({ produtos: [] }), "produtosModel")
                this.getRouter().getRoute("RouterObject").attachMatched(this._onObjectMatched, this)
                this.setModel(new JSONModel({
                    id: "",
                    codProduto: "",
                    createdBy: "",
                    descricaoProduto: "",
                    fabricante: "",
                    valorTotalProduto: ""
                }), "oFilterModel")

                this.setModel(new JSONModel({
                    CurrentDate: new Date()
                }), "oDateControl")

                this.setModel(new JSONModel({
                    id: "",
                    codProduto: "",
                    createdBy: "",
                    descricaoProduto: "",
                    fabricante: "",
                    valorTotalProduto: ""
                }), "oModelCreate")

                this.setModel(new JSONModel({
                    editable: true,
                    editableId: true
                }), "oControl")

                this.setModel(new JSONModel({
                    id: ""
                }), "oIdModel")
            },

            _onObjectMatched: function (oEvent) {
                debugger
                var sID = oEvent.getParameter("arguments").ID
                this.getModel("oIdModel").setProperty("/id", sID)
                this.getModel("objectModel").setProperty("/id", sID)
                this.getModel().read(`/Pedidos(${sID})`, {
                    urlParameters: {
                        "$expand": "produto"
                    },
                    success: oData => {
                        debugger
                        this.getModel("objectModel").setData(oData)
                        this.getModel("produtosModel").setProperty("/produtos", oData.produto.results)
                    },
                    error: err => {
                        debugger
                        console.log(err)
                    }
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

            onUpdateTable: function (sID) {
                this.getModel().read(`/Pedidos(${sID})`, {
                    urlParameters: {
                        "$expand": "produto"
                    },
                    success: oData => {
                        debugger
                        this.getModel("objectModel").setData(oData)
                        this.getModel("produtosModel").setProperty("/produtos", oData.produto.results)
                    },
                    error: err => {
                        debugger
                        console.log(err)
                    }
                })
            },

            onCreateProduct: function () {
                debugger
                this.getModel("oControl").setProperty("/editable", true)
                this.openDialog('produto')
                var sID = this.getModel("oIdModel").getProperty("/id")
                this.getView().byId("idProdIP").setValue(sID)
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

            updateProduct: function () {
                debugger
                var oI18n = this.getModel("i18n").getResourceBundle()
                var oSmart = this.getView().byId("smtProduct")
                if (this._oDialog) {
                    this._oDialog.close()
                }
                let sValueTotal_truncade = 0.00
                var sValueTotal = this.getView().byId("AmounProdtIp").getValue()
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
                    sValueTotal_truncade = this.getView().byId("AmounProdtIp").getValue()
                }
                var sID = this.getView().byId("idProdIP").getValue()
                var sIDProd = this.getView().byId("idPrdIp").getValue()
                var oUpdate = {
                    id: sID,
                    codProduto: sIDProd,
                    descricaoProduto: this.getModel("oModelCreate").getData().descricaoProduto,
                    fabricante: this.getModel("oModelCreate").getData().fabricante,
                    valorTotalProduto: sValueTotal_truncade
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
                var oModel = this.getModel()
                var sPath = oModel.createKey("/Produtos", {
                    codProduto: encodeURIComponent(oUpdate.codProduto),
                    id: encodeURIComponent(oUpdate.id)
                })
                this.getModel().update(sPath, oUpdate, {
                    success: oUser => {
                        MessageBox.success(oI18n.getText("update"), {
                            actions: [`${oI18n.getText('ok')}`],
                            onClose: sAction => {
                                if (sAction === oI18n.getText('ok')) {
                                    this.onUpdateTable(oUpdate.id)
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

            onSaveProduct: function () {
                debugger
                var oCheckModel = this.getModel("oControl").getData()
                if (!oCheckModel.editable) {
                    this.updateProduct()
                    return
                }
                var sID = this.getView().byId("idProdIP").getValue()
                var isInterger = /^\d+$/.test(sID)
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
                var sValueTotal = this.getView().byId("AmounProdtIp").getValue()
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
                    sValueTotal_truncade = this.getView().byId("AmounProdtIp").getValue()
                }
                var sIDProd = this.getView().byId("idPrdIp").getValue()
                var oCreate = {
                    id: sID,
                    codProduto: sIDProd,
                    descricaoProduto: this.getModel("oModelCreate").getData().descricaoProduto,
                    fabricante: this.getModel("oModelCreate").getData().fabricante,
                    valorTotalProduto: sValueTotal_truncade
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
                var oTable = this.byId("smtProduct")
                this.getModel().create("/Produtos", oCreate, {
                    success: () => {
                        debugger
                        MessageBox.success(oI18n.getText("successProduto"), {
                            actions: [`${oI18n.getText('ok')}`],
                            onClose: sAction => {
                                if (sAction === oI18n.getText('ok')) {
                                    debugger
                                    this.onUpdateTable(sID)
                                    oTable.rebindTable(true)
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
                                        oTable.rebindTable(true)
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

            onEditProduct: function () {
                debugger
                var iSelected = this.getView().byId("smtProduct").getSelectedItems().length
                if (iSelected === 0) {
                    var oI18n = this.getModel("i18n").getResourceBundle()
                    MessageBox.error(oI18n.getText("errOnCreate6"))
                    return
                } else {
                    this.getModel("oControl").setProperty("/editable", false)
                    var sID = this.getView().byId("smtProduct").getSelectedContexts()[0].getObject().id
                    var sIDProd = this.getView().byId("smtProduct").getSelectedContexts()[0].getObject().codProduto
                    var oModel = this.getModel()
                    if (sID && sIDProd) {
                        this.openDialogEdit("produto")
                        var sPath = oModel.createKey("/Produtos", {
                            codProduto: encodeURIComponent(sIDProd),
                            id: encodeURIComponent(sID)
                        })
                        this.getModel().read(sPath, {
                            success: oUser => {
                                this.getView().byId("idProdIP").setValue(oUser.id)
                                this.getView().byId("idPrdIp").setValue(oUser.codProduto)
                                this.getModel("oModelCreate").setProperty("/fabricante", oUser.fabricante)
                                this.getModel("oModelCreate").setProperty("/descricaoProduto", oUser.descricaoProduto)
                                this.getView().byId("AmounProdtIp").setValue(formatter.currencyFormat(oUser.valorTotalProduto))
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
            onDeleteProduct: function () {
                debugger
                var oModel = this.getModel()
                var sGroup = jQuery.sap.uid()
                var oI18n = this.getModel("i18n").getResourceBundle()
                oModel.setDeferredGroups([sGroup])
                var iSelected = this.getView().byId("smtProduct").getSelectedItems().length
                if (iSelected === 0) {
                    var oI18n = this.getModel("i18n").getResourceBundle()
                    MessageBox.error(oI18n.getText("errOnCreate4"))
                    return
                }
                var sID = this.getView().byId("smtProduct").getSelectedContexts()[0].getObject().id
                var sIDProd = this.getView().byId("smtProduct").getSelectedContexts()[0].getObject().codProduto
                debugger
                var sPath = oModel.createKey("/Produtos", {
                    codProduto: encodeURIComponent(sIDProd),
                    id: encodeURIComponent(sID)
                })
                var oTable = this.getView().byId("smtProduct");
                this.getModel().remove(sPath, {
                    success: () => {
                        debugger
                        MessageBox.success(oI18n.getText("produtoremovido"))
                        this.onUpdateTable(sID)
                        oTable.rebindTable(true)
                    },
                    error: err => {
                        debugger
                        MessageBox.error(oI18n.getText("registronaoremovido"))
                        oTable.rebindTable(true)
                        console.log(err)
                    }
                })
            }

        });
    });
