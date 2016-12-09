var tempo = 2;
var intervalo = 0;
var qtsPerdidas = 0;
var maxAposta = 0.00000256;
var carteira = parseFloat($("#balance").text());
var perdaTotal = 5; //%

function perdeu() { return $("#double_your_btc_bet_lose").text().indexOf("lose")>-1; }
function aposta() { $('#double_your_btc_bet_lo_button').click(); }
function maxima() {
    return parseFloat($("#double_your_btc_stake").val()) > maxAposta;
}
function zera() {
    qtsPerdidas = 0;
    $("#double_your_btc_min").click();
    //$("#double_your_btc_stake").val("0.00000032");
}
function aumenta() { $("#double_your_btc_2x").click(); }
function aumentaVai() {
    aumenta();
    aumenta();
    aposta();
}
function verifica() {
    if(perdeu()) {
        qtsPerdidas++;
        if(qtsPerdidas>=2) {
            if(maxima()) {
                if(parseFloat($("#balance").text())>=carteira-(carteira*perdaTotal/100)) {
                    pusha("Perdeu " + perdaTotal + "%.");
                    stop();
                } else {
                    pusha("Apostou o máximo " + maxAposta + " BTC.");
                    zera();
                    aposta();
                }
            } else {
                aumentaVai();
            }
        }
    } else {
        pusha("Carteira " + parseFloat($("#balance").text()) + " BTC.");
        zera();
        aposta();
    }
}
function stop() {
    qtsPerdidas = 0;
    clearInterval(intervalo);
    intervalo = 0;
    console.info("Perdeu muito: " + perdaTotal + " %");
}
function run() {
    carteira = parseFloat($("#balance").text());
    intervalo = setInterval(function(){
        verifica();
    }, tempo*1000);
}
function pusha(texto) {
    console.info(texto);
}
run();