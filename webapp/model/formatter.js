sap.ui.define([

], function () {
    return {
        getIcon: function (sValue) {
            if (!sValue) {
                return ""
            }

            if (sValue === 'system') {
                return 'sap-icon://it-system'
            } else {
                return 'sap-icon://customer'
            }
        },

        getState: function (sValue) {
            if (!sValue) {
                return ""
            }

            if (sValue === 'system') {
                return 'Success'
            } else {
                return 'Error'
            }
        },

        getInfo: function (sValue) {
            if (!sValue) {
                return ""
            }
            var oI18n = this.getModel('i18n').getResourceBundle()

            if (sValue === 'system') {
                return `${oI18n.getText("infoCreate1")}`
            } else {
                return `${oI18n.getText("infoCreate2")}`
            }
        },


        getIconS: function (sValue) {
            if (!sValue && sValue != null) {
                return ""
            }
            if (sValue === 'Pago') {
                return 'sap-icon://sys-enter-2'
            } else if (sValue === 'Pendente') {
                return 'sap-icon://pending'
            } else {
                return 'sap-icon://decline'
            }
        },

        getStateS: function (sValue) {
            if (!sValue && sValue != null) {
                return ""
            }
            if (sValue === 'Pago') {
                return 'Success'
            } else if (sValue === 'Pendente') {
                return 'Error'
            } else {
                return 'Warning'
            }
        },

        getStatePaid: function (sValue) {
            if (!sValue && sValue != null) {
                return ""
            }
            var oI18n = this.getModel('i18n').getResourceBundle()
            if (sValue === 'Pendente') {
                return `${oI18n.getText("pendente")}`
            } else if (sValue === 'Pago') {
                return `${oI18n.getText("pago")}`
            }else {
                return `${oI18n.getText("recusado")}`
            }
        },
        getFullDate: function (sValue) {
            if (!sValue) {
                return ""
            }

            var oDateOffSet = new Date(sValue)

            var sDay = oDateOffSet.getDate().toString().length === 1 ? `0${oDateOffSet.getDate().toString()}` : `${oDateOffSet.getDate().toString()}`
            var sMonth = (oDateOffSet.getMonth() + 1).toString().length === 1 ? `0${oDateOffSet.getMonth() + 1}` : `${oDateOffSet.getMonth() + 1}`
            var sYear = oDateOffSet.getFullYear().toString()

            var sHour = oDateOffSet.getHours().toString().length === 1 ? `0${oDateOffSet.getHours().toString()}` : `${oDateOffSet.getHours().toString()}`
            var sMinute = oDateOffSet.getMinutes().toString().length === 1 ? `0${oDateOffSet.getMinutes().toString()}` : `${oDateOffSet.getMinutes().toString()}`
            var sSecond = oDateOffSet.getSeconds().toString().length === 1 ? `0${oDateOffSet.getSeconds().toString()}` : `${oDateOffSet.getSeconds().toString()}`

            return `${sDay}/${sMonth}/${sYear} ${sHour}:${sMinute}:${sSecond}`
        },

        getUserDate: function (sValue) {
            if (!sValue) {
                return ""
            }

            var oDateOffSet = new Date(sValue)

            var sDay = oDateOffSet.getDate().toString().length === 1 ? `0${oDateOffSet.getDate().toString()}` : `${oDateOffSet.getDate().toString()}`
            var sMonth = (oDateOffSet.getMonth() + 1).toString().length === 1 ? `0${oDateOffSet.getMonth() + 1}` : `${oDateOffSet.getMonth() + 1}`
            var sYear = oDateOffSet.getFullYear().toString()

            return `${sDay}/${sMonth}/${sYear}`
        },

        currencyFormat: function (sValue) {

            if (!sValue) {
                return ""
            }

            var formatter = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })
            var newValue = formatter.format(sValue)
            var sReturn = newValue.slice(3)

            return sReturn
        },

        typeCurrency: function (sValue) {
            var oI18n = this.getModel("i18n").getResourceBundle()

            switch (sValue) {
                case '1':
                    return `${oI18n.getText("m1")}`
                case '2':
                    return `${oI18n.getText("m2")}`
                case '3':
                    return `${oI18n.getText("m3")}`
                default:
                    return `${oI18n.getText("merr")}`
            }
        },

        getFormatCurrency: function(sValue){
            if (!sValue) {
                return ""
            }
            sValue.replace('.',',');

        }
    }
})