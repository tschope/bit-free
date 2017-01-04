//Update August 2016 : I am working on a GUI and Auto increase betting system
//COMMAND//
//changeBet() ex: changeBet('0.00000005');

console.clear();
var startbalance = 0;
var stopAt = '?';
var round = 0;
var gameLost = 0;
var gameWin = 0;
var higherbet = 0;
startbalance = $('#balance').text();
var startValue = '0.00000001', // Don't lower the decimal point more than 4x of current balance
    highestbet = '0.00000256', // Max bet prevent high loss
    stopPercentage = 0.001, // In %. I wouldn't recommend going past 0.08
    maxWait = 500, // In milliseconds
    stopped = false,
    stopBefore = 3; // In minutes
var oldbet = 0.00000001;
document.getElementById("advertise_link_li").innerHTML = '<a href="#" onclick="startGame()" class="advertise_link">START BOT</a>';
var $loButton = $('#double_your_btc_bet_lo_button'),
    $hiButton = $('#double_your_btc_bet_hi_button');

function higherBet() {
    console.log('Highest bet: ' + higherbet);
}

function changeBet(bet) {
    startValue = bet;
}

function highestBet() {
    if (parseFloat($("#double_your_btc_stake").val()) >= parseFloat(highestbet)) {
        console.log('Max Bet!!! Reset!!' + highestBet);
        reset();
    }
}

function realtime(time) {
    var sec_num = parseInt(time, 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours != 0) {
        hours = hours + ' Hours ';
    } else {
        hours = '';
    }

    if (minutes != 0) {
        minutes = minutes + ' Minutes ';
    }
    else {
        minutes = '';
    }


    if (seconds < 10) {
        seconds = seconds;
    }
    var time = 'Playing time = ' + hours + minutes + seconds + ' Secondes';
    return time;
}

function roundnumb() {
    console.clear();
    if (round == stopAt) {
        stopGame()
    }
    else {
        round = round + 1;
        console.log('Round #' + round + ' / ' + stopAt);
    }

    var newbalance = $('#balance').text()
    var profit = (Number(newbalance) - Number(startbalance)).toFixed(8);
    console.log('Profit:' + profit + ' Bitcoin')
}
//Number of round. Type stopatRound(NUMBER_OF_ROUND) to change
//function stopatRound(limitRound){
//stopAt=limitRound;
//}
function multiply() {
    var current = $('#double_your_btc_stake').val();
    var multiply = (current * 2).toFixed(8);
    $('#double_your_btc_stake').val(multiply);
    console.log('Bet = ' + multiply);
    if (higherbet < multiply) {
        higherbet = multiply;
    }
}
function getRandomWait() {
    var wait = Math.floor(Math.random() * maxWait) + 100; //(Math.floor(Math.random() * 800) + 300)  ; // avant 100
    console.log('Waiting for ' + wait + 'ms before next bet.');
    return wait;
}
function startGame(limit) {
    document.getElementById("advertise_link_li").innerHTML = '<a href="#" onclick="stopGame()" class="advertise_link">STOP BOT</a>';
    starttime = (new Date()).getTime();
    startValue = prompt("Number of satoshi you want to bet?", '0.00000001');
    oldbet = startValue;
    highestbet = prompt("Number of satoshi you want to bet MAX?", '0.00000128');

    round = 0;
    gameLost = 0;
    gameWin = 0;
    console.log('Game started!');
    reset();
    $loButton.trigger('click');
    if (limit !== null) {
        stopAt = limit;
    }
    else {
        stopAt = -1;
    }

}
function stopGame() {
    document.getElementById("advertise_link_li").innerHTML = '<a href="#" onclick="startGame()" class="advertise_link">START BOT</a>';
    console.log('Game will stop soon! Let me finish.');
    stopped = true;
    startValue = oldbet;

}

function reset() {
    if (round % 100 === 0 && round != 0) {
        startValue = (startValue * 1.000).toFixed(8); //New bet after 100 round
        console.log('Round ' + round + ': bet change for ' + startValue);
    }
    $('#double_your_btc_stake').val(startValue);
}
// quick and dirty hack if you have very little bitcoins like 0.0000001
function deexponentize(number) {
    return number * 1000000;
}
function iHaveEnoughMoni() {
    var balance = deexponentize(parseFloat($('#balance').text()));
    var current = deexponentize($('#double_your_btc_stake').val());
    return ((balance * 2) / 100) * (current * 2) > stopPercentage / 100;
}
function stopBeforeRedirect() {
    var minutes = parseInt($('title').text());
    if (minutes < stopBefore) {
        console.log('Approaching redirect! Stop the game so we don\'t get redirected while loosing.');
        stopGame();
        return true;
    }
    return false;
}
// Unbind old shit
$('#double_your_btc_bet_lose').unbind();
$('#double_your_btc_bet_win').unbind();
// Loser
$('#double_your_btc_bet_lose').bind("DOMSubtreeModified", function (event) {

        if ($(event.currentTarget).is(':contains("lose")')) {
            gameLost = gameLost + 1;
            roundnumb();
            console.log('%cWin: ' + gameWin + ' Lost: ' + gameLost, 'color: #00CC00');
            endtime = (new Date()).getTime();
            var time = Math.floor((endtime - starttime ) / 1000);
            higherBet();
            console.log(realtime(time));
            console.log('You LOST!');
            multiply();
            highestBet();
            setTimeout(function () {
                $loButton.trigger('click');
            }, getRandomWait());
            //$loButton.trigger('click');
        }

    }
);
// Winner
$('#double_your_btc_bet_win').bind("DOMSubtreeModified", function (event) {
        if ($(event.currentTarget).is(':contains("win")')) {

            gameWin = gameWin + 1;
            roundnumb();
            console.log('%cWin: ' + gameWin + ' Lost: ' + gameLost, 'color: #FF0000');
            endtime = (new Date()).getTime();
            var time = Math.floor((endtime - starttime ) / 1000);
            console.log(realtime(time));
            higherBet();
            if (stopBeforeRedirect()) {
                return;
            }
            if (iHaveEnoughMoni()) {

                console.log('You WON!');
                reset();
                if (stopped) {
                    stopped = false;
                    return false;
                }
            }
            else {
                console.log('You WON! ');
            }
            setTimeout(function () {
                $loButton.trigger('click');
            }, getRandomWait());
        }

    }
);
