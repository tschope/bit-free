var tempo = 1800; //1.2 segundos
var intervalo = 0;
var qtsPerdidas = 0;
var valorInicial = parseFloat($("#balance").text());
var valorFinal = 0;
var maxBit = 0.00000064;
var maisToshi = 0.00000001;
var valMultip = 2.25; //Valor multiplicador básico
var arregao = false;
function perdeu() {
    return $("#double_your_btc_bet_lose").text().indexOf("lose") > -1;
}
function aposta() {
    //var numb = Math.floor((Math.random() * 10) + 1);
    //if (numb >= 6) {
        $('#double_your_btc_bet_hi_button').click();
    //} else {
    //    $('#double_your_btc_bet_lo_button').click();
    //}
}
function maxima() {
    return parseFloat($("#double_your_btc_stake").val()) > maxBit;
}
function zera() {
    qtsPerdidas = 0;
    $("#double_your_btc_min").click();
}
function aumenta() {
    $("#double_your_btc_2x").click();
    //parseFloat($("#double_your_btc_stake").val(parseFloat($("#double_your_btc_stake").val()) + maisToshi));
}
function aumentaVai() {
    aumenta();
    //aumenta();
    aposta();
}
function poemMultip() {
    //var Multi = parseFloat(Math.floor(Math.random() * 3) + 3 + "." + Math.floor(Math.random() * 99));
    var Multi = valMultip;
    $("#double_your_btc_payout_multiplier").val(Multi);
    $("#double_your_btc_payout_multiplier").text(Multi);
}
function ligaSom() {
    $('#manual_enable_sounds').prop('checked', true);
}
function mute() {
    $('#manual_enable_sounds').prop('checked', false);
}
function verifica() {
    if (perdeu()) {
        qtsPerdidas++;
        if (qtsPerdidas >= 2) {
            if (maxima()) {
                if(!arregao){
                    zera();
                    aposta();
                }else{
                    stop();
                    console.info("Perdeu muito");
                }
            } else {
                aumentaVai();
            }
        }
    } else {
        zera();
        aposta();
    }
}
function stop() {
    valorFinal = parseFloat($("#balance").text());
    console.info('Valor Inicial:' + valorInicial);
    console.info('Valor Final:' + valorFinal);
    if ((valorFinal - valorInicial) < 0) {
        console.info("PERDEU!");
    } else {
        console.info("GANHOU!");
    }
    qtsPerdidas = 0;
    clearInterval(intervalo);
    intervalo = 0;
}
function run() {
    console.info('Valor Inicial:' + valorInicial);
    poemMultip();
    intervalo = setInterval(function () {
        verifica();
    }, tempo);
}
run();
