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

                    //logica para verificar o ganhador do jogo
                    if (this.temVencedor()) {
                        alert(this.vez + ` ganhou!`)
                    }

                    if (this.vez == 'X') {
                        this.vez = 'O'
                    } else {
                        this.vez = 'X'
                    }
                }

            },

            temVencedor: function() {
                //test possible combination for the winner
                if (this.casasIguais(1,2,3) || 
                    this.casasIguais(4,5,6) ||
                    this.casasIguais(7,8,9) ||
                    this.casasIguais(1,4,7) || 
                    this.casasIguais(2,5,8) || 
                    this.casasIguais(3,6,9) ||
                    this.casasIguais(1,5,9) ||
                    this.casasIguais(3,5,7)){
                    return true
                }
            },
            casasIguais(a,b,c){
                //get screen objects
                let casaA = this.byId("casa" + a)
                let casaB = this.byId("casa" + b)
                let casaC = this.byId("casa" + c)

                //get images from screen
                let imgA = casaA.getSrc()
                let imgB = casaB.getSrc()
                let imgC = casaC.getSrc()

                //check if images are equal
                if((imgA == imgB) && (imgB == imgC) && (imgA !== "../img/Branco.png")){
                    return true
                }



            }
        });
    });
