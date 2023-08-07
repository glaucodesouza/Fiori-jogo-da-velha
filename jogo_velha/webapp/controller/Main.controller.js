sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox) {
        "use strict";
        return Controller.extend("jogovelha.controller.Main", {
            onInit: function () {
                
                //variável global vez 
                //(this, torna esta variável global à todo app)
                this.vez = 'X';

                //Matriz de possibilidades de vitória
                this.vitorias_possiveis = [
                    [1,2,3],
                    [4,5,6],
                    [7,8,9],
                    [1,5,9], //diagonais
                    [3,5,7], //diagonais
                    [1,4,7],
                    [2,5,8],
                    [3,6,9],
                ];

            },

            onClickCasa: function(oEvent) {
                //obter referencia do objeto que foi clicado
                let casa = oEvent.getSource();

                // obter imagem atual
                let imagem = casa.getSrc();

                // verificar se imagem e branco
                if (imagem == "../img/Branco.png") {

                    //comando para adicionar imagem
                    casa.setSrc("../img/" + this.vez + ".png");

                    //logica para verificar o ganhador do jogo
                    if (this.temVencedor()) {
                        // alert(this.vez + ` ganhou!`)
                        MessageBox.success(this.vez + ` ganhou!`);
                        return;
                    }

                    if (this.vez == 'X') {
                        this.vez = 'O';
                        //chamar função de jogada do computador
                        this.jogadaComputador();
                    } else {
                        this.vez = 'X';
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
                    return true;
                }
            },
            casasIguais: function(a,b,c){
                //get screen objects
                let casaA = this.byId("casa" + a);
                let casaB = this.byId("casa" + b);
                let casaC = this.byId("casa" + c);

                //get images from screen
                let imgA = casaA.getSrc();
                let imgB = casaB.getSrc();
                let imgC = casaC.getSrc();
                debugger;
                //check if images are equal
                if((imgA == imgB) && (imgB == imgC) && (imgA !== "../img/Branco.png")){
                    return true;
                }
            },

            jogadaComputador: function (){
                
                //Definir lista de pontos para X
                let listaPontosX = [];
                let listaPontosO = [];

                //Lista de jogadas  possíveis
                let jogadaInicial = []; //inicio do jogo
                let jogadaVitoria = []; //a vitopria é certa
                let jogadaRisco = []; //risco de perder
                let tentativa_vitoria = []; //aumenta a chance de vitória
                
                //cálculo da pontuação de cada possibilidade de vitória
                //LOOP em cada combinação de possibilidade de vitória
                this.vitorias_possiveis.forEach( (combinacao) => {
                    //zerar pontos iniciais
                    let pontosX = 0;
                    let pontosO = 0;
                    // debugger
                    //dentro das vitorias possiveis, fazer um loop para verificar cada casa daquela combinação
                    combinacao.forEach( (posicao) => {
                        let casa = this.byId("casa" + posicao);
                        let img = casa.getSrc(); // pegar a imagem da casa atual
                        //dar pontuação de acordo com quem jogou
                        if (img == '../img/X.png') {pontosX++};
                        if (img == '../img/O.png') {pontosO++};
                    });

                    //Atribuir ponto para combinação de possíveis vitórias
                    listaPontosX.push(pontosX);
                    listaPontosO.push(pontosO);

                });

                //jogar com base na maior pontuação (ou a maior prioridade pra não perder)
                // para cada possibilidade de vitória do jogador O, ver quantos pontos tem na mesma combinação
                //loop na lista de pontos do O
                listaPontosO.forEach((posicao, index) => {
                    //ver quantos pontos o jogador O tem
                    switch (posicao) {
                        case 0: //Onde eu Computador tenho menos pontuação
                            //ver se X tem 2 pontos, porque é onde to perdendo
                            if (listaPontosX[index] == 2) {
                                jogadaRisco.push(this.vitorias_possiveis[index]);
                            } else if (listaPontosX[index] == 1) {
                                jogadaInicial.push(this.vitorias_possiveis[index]);
                            }
                            break;

                        case 1: //Jogada neutra
                            if (listaPontosX[index] == 1) { //o outro tem 1, é jogada inicial
                                jogadaInicial.push(this.vitorias_possiveis[index]);
                            } else if (listaPontosX[index] == 0) {
                                tentativa_vitoria.push(this.vitorias_possiveis[index]);
                            }
                            break;

                        case 2: // é a Vitória mais certa
                            if (listaPontosX[index] == 0) {
                                jogadaVitoria.push(this.vitorias_possiveis[index]);
                            }
                    }
                });
                // debugger;
                //Jogar na combinação de maior prioridade
                if (jogadaVitoria.length > 0) {
                    //Prioridade: jogar nas combinações de vitória
                    this.jogadaIA(jogadaVitoria);

                } else if (jogadaRisco.length > 0) {
                    //Prioridade: Jogar onde eu posso perder
                    this.jogadaIA(jogadaRisco);

                } else if (tentativa_vitoria.length > 0) {
                    //Jogar onde posso tentar ganhar
                    this.jogadaIA(tentativa_vitoria);

                } else if (jogadaInicial.length > 0) {
                    this.jogadaIA(jogadaInicial);
                }

            },

            jogadaIA: function (dados) {
                //o jogador Computador O, fará a jogada aleatoriamente, dentro das prioridades calculadas
                //separar númertos das casas que posso jogar
                let numeros = [];
                debugger;
                //verificar se casa possível de seer jogada está vazia
                //loop nas combinações para ver se casa está vazia
                dados.forEach((combinacao) => {
                    //verificar cada casa individualmente
                    //outro loop
                    combinacao.forEach((num) => {
                        //verificar se a casa está vazia
                        let casa = this.byId("casa" + num);
                        let img = casa.getSrc();
                        if (img == '../img/Branco.png') {
                            numeros.push(num);
                        }
                    });
                });
                debugger;
                //jogada aleatória com valore spossíveis
                this.jogadaAleatoriaIA(numeros);
            },

            jogadaAleatoriaIA: function(numeros) {
                //Math random gera número aleatório entre 0 e 1 (0.1, 0.2, 0.3, etc)
                // random x Tamanho da Lista
                // Math.floor: retornar número inteiro do random
                let numeroAleatorio = Math.random() * numeros.length;
                let numeroInteiro = Math.floor(numeroAleatorio);
                let jogada = numeros[numeroInteiro];
                let casa = this.byId("casa" + jogada);

                if (!!casa) {
                    //Preencher "O" na casa
                    casa.setSrc("../img/O.png");
                }

                debugger;
                //logica para verificar o ganhador do jogo
                if (this.temVencedor()) {
                    // alert(this.vez + ` ganhou!`)
                    MessageBox.success(this.vez + ` ganhou!`);
                } else {
                    this.vez = 'X';
                }

            }
        });
    });
