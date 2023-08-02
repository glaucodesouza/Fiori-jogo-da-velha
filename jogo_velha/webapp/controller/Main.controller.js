sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";
        return Controller.extend("jogovelha.controller.Main", {
            onInit: function () {
                this.vez = 'X'

            },

            onClickCasa: function(oEvent) {
                //obter referencia do objeto que foi clicado
                let casa = oEvent.getSource()

                // obter imagem atual
                let imagem = casa.getSrc()

                // verificar se imagem e branco
                if (imagem == "../img/Branco.png") {

                    //comando para adicionar imagem
                    casa.setSrc("../img/" + this.vez + ".png");

                    if (this.vez == 'X') {
                        this.vez = 'O'
                    } else {
                        this.vez = 'X'
                    }
                }

            }
        });
    });
