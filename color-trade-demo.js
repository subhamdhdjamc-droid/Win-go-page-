/* ==========================================
   COLOR TRADE DEMO
   Virtual/demo balance only
========================================== */

const ROUND_TIME = 30;

let timeLeft = ROUND_TIME;
let roundNumber = 1;

let balance = 10000;

let selectedPrediction = null;
let selectedColor = null;
let selectedAmount = 100;

let demoPrediction = null;

let history = [];

let stats = {
    total: 0,
    big: 0,
    small: 0
};


/* ==========================================
   ROUND ID
========================================== */

function createRoundId(){

    const today = new Date();

    const year = today.getFullYear();

    const month =
        String(today.getMonth() + 1)
        .padStart(2,"0");

    const day =
        String(today.getDate())
        .padStart(2,"0");

    return (
        "CT" +
        year +
        month +
        day +
        String(roundNumber).padStart(4,"0")
    );
}


/* ==========================================
   BALANCE DISPLAY
========================================== */

function updateBalance(){

    document.getElementById("balance")
        .innerText =
        balance.toFixed(2);

}


/* ==========================================
   AMOUNT INPUT
========================================== */

function updateAmount(){

    const input =
        document.getElementById("amountInput");

    let amount =
        Number(input.value);

    if(isNaN(amount)){
        amount = 0;
    }

    selectedAmount = amount;

    document.getElementById("selectedAmount")
        .innerText =
        amount.toFixed(2);

}


/* ==========================================
   QUICK AMOUNT
========================================== */

function setAmount(amount){

    const input =
        document.getElementById("amountInput");

    input.value = amount;

    selectedAmount = amount;

    document.getElementById("selectedAmount")
        .innerText =
        amount.toFixed(2);

    showToast(
        "Amount selected: ₹" + amount
    );

}


/* ==========================================
   SELECT BIG / SMALL
========================================== */

function selectPrediction(value, button){

    selectedPrediction = value;

    document.querySelectorAll(".predict-btn")
        .forEach(btn => {

            btn.classList.remove("active");

        });

    button.classList.add("active");

    showToast(
        "Prediction: " + value
    );

}


/* ==========================================
   SELECT COLOR
========================================== */

function selectColor(value, button){

    selectedColor = value;

    document.querySelectorAll(".color-btn")
        .forEach(btn => {

            btn.style.boxShadow = "";

        });


    if(value === "GREEN"){

        button.style.boxShadow =
            "0 0 20px rgba(0,230,118,.35)";

    }


    if(value === "RED"){

        button.style.boxShadow =
            "0 0 20px rgba(255,59,92,.35)";

    }


    if(value === "VIOLET"){

        button.style.boxShadow =
            "0 0 20px rgba(168,85,247,.35)";

    }


    showToast(
        "Color: " + value
    );

}


/* ==========================================
   CONFIRM DEMO PREDICTION
========================================== */

function placeDemoPrediction(){

    if(!selectedPrediction && !selectedColor){

        showToast(
            "Select Big/Small or Color first"
        );

        return;
    }


    let amount =
        Number(
            document.getElementById(
                "amountInput"
            ).value
        );


    if(!amount || amount <= 0){

        showToast(
            "Enter a valid amount"
        );

        return;
    }


    if(amount > balance){

        showToast(
            "Insufficient demo balance"
        );

        return;
    }


    if(timeLeft <= 2){

        showToast(
            "Round is closing..."
        );

        return;
    }


    /*
       Demo balance is reserved when
       prediction is confirmed.
    */

    balance -= amount;

    updateBalance();


    demoPrediction = {

        round: createRoundId(),

        amount: amount,

        type: selectedPrediction,

        color: selectedColor

    };


    showToast(
        "Demo prediction confirmed • ₹" +
        amount
    );

}


/* ==========================================
   TIMER
========================================== */

function updateTimer(){

    const timer =
        document.getElementById("timer");

    const bar =
        document.getElementById("timerBar");


    timer.innerText =
        "00:" +
        String(timeLeft).padStart(2,"0");


    const percentage =
        (timeLeft / ROUND_TIME) * 100;


    bar.style.width =
        percentage + "%";


    if(timeLeft <= 5){

        timer.classList.add("warning");

    }else{

        timer.classList.remove("warning");

    }

}


/* ==========================================
   TIMER LOOP
========================================== */

setInterval(function(){

    timeLeft--;

    updateTimer();


    if(timeLeft <= 0){

        generateResult();

        timeLeft = ROUND_TIME;

        roundNumber++;


        document.getElementById("roundId")
            .innerText =
            createRoundId();

    }

},1000);


/* ==========================================
   GENERATE RANDOM RESULT
========================================== */

function generateResult(){

    const number =
        Math.floor(Math.random() * 10);


    const type =
        number >= 5
        ? "BIG"
        : "SMALL";


    let color;


    /*
       Demo color mapping
    */

    if(number === 0 || number === 5){

        color = "GREEN";

    }
    else if(
        number === 1 ||
        number === 3 ||
        number === 7 ||
        number === 9
    ){

        color = "RED";

    }
    else{

        color = "VIOLET";

    }


    const result = {

        round: createRoundId(),

        number: number,

        type: type,

        color: color

    };


    /*
       Resolve previous demo prediction
    */

    resolvePrediction(result);


    addHistory(result);

    showLastResult(result);

    updateStats(result);


    selectedPrediction = null;
    selectedColor = null;

    demoPrediction = null;

    clearSelections();

}


/* ==========================================
   RESOLVE DEMO PREDICTION
========================================== */

function resolvePrediction(result){

    if(!demoPrediction){

        return;
    }


    let matched = false;


    if(
        demoPrediction.type &&
        demoPrediction.type === result.type
    ){

        matched = true;

    }


    if(
        demoPrediction.color &&
        demoPrediction.color === result.color
    ){

        matched = true;

    }


    /*
       Demo result only.

       If prediction matches,
       return the reserved demo amount
       plus a simple demo reward.

       This is NOT real-money logic.
    */

    if(matched){

        const reward =
            demoPrediction.amount * 2;

        balance += reward;

        showToast(
            "Prediction matched! +₹" +
            reward.toFixed(2)
        );

    }
    else{

        showToast(
            "Prediction did not match"
        );

    }


    updateBalance();

}


/* ==========================================
   HISTORY
========================================== */

function addHistory(result){

    history.unshift(result);


    if(history.length > 20){

        history.pop();

    }


    renderHistory();

}


/* ==========================================
   RENDER HISTORY
========================================== */

function renderHistory(){

    const list =
        document.getElementById(
            "historyList"
        );


    list.innerHTML = `

        <div class="history-row header-row">

            <div>ROUND</div>
            <div>NUM</div>
            <div>TYPE</div>
            <div>COLOR</div>

        </div>

    `;


    history.forEach(item => {

        let colorClass;


        if(item.color === "GREEN"){

            colorClass = "mini-green";

        }
        else if(item.color === "RED"){

            colorClass = "mini-red";

        }
        else{

            colorClass = "mini-violet";

        }


        let typeClass =
            item.type === "BIG"
            ? "badge-big"
            : "badge-small";


        const shortRound =
            item.round.slice(-6);


        list.innerHTML += `

            <div class="history-row">

                <div class="history-round">
                    #${shortRound}
                </div>

                <div class="history-number">
                    ${item.number}
                </div>

                <div class="history-type">

                    <span class="result-badge ${typeClass}">
                        ${item.type}
                    </span>

                </div>

                <div class="history-color">

                    <span
                        class="mini-dot ${colorClass}">
                    </span>

                    ${item.color}

                </div>

            </div>

        `;

    });


    document.getElementById(
        "historyCount"
    ).innerText =
        history.length + " Results";

}


/* ==========================================
   LAST RESULT
========================================== */

function showLastResult(result){

    document.getElementById(
        "lastNumber"
    ).innerText =
        result.number;


    document.getElementById(
        "lastRound"
    ).innerText =
        result.round;


    const type =
        document.getElementById(
            "lastType"
        );


    const color =
        document.getElementById(
            "lastColor"
        );


    type.innerText =
        result.type;


    type.className =
        "result-badge " +
        (
            result.type === "BIG"
            ? "badge-big"
            : "badge-small"
        );


    color.innerText =
        result.color;


    color.className =
        "result-badge " +
        (
            result.color === "GREEN"
            ? "badge-green"
            : result.color === "RED"
            ? "badge-red"
            : "badge-violet"
        );

}


/* ==========================================
   STATISTICS
========================================== */

function updateStats(result){

    stats.total++;


    if(result.type === "BIG"){

        stats.big++;

    }
    else{

        stats.small++;

    }


    document.getElementById(
        "totalRounds"
    ).innerText =
        stats.total;


    document.getElementById(
        "bigCount"
    ).innerText =
        stats.big;


    document.getElementById(
        "smallCount"
    ).innerText =
        stats.small;

}


/* ==========================================
   CLEAR SELECTIONS
========================================== */

function clearSelections(){

    document.querySelectorAll(
        ".predict-btn"
    ).forEach(btn => {

        btn.classList.remove(
            "active"
        );

    });


    document.querySelectorAll(
        ".color-btn"
    ).forEach(btn => {

        btn.style.boxShadow = "";

    });

}


/* ==========================================
   NAVIGATION DEMO
========================================== */

function navClick(button, name){

    document.querySelectorAll(
        ".nav-item"
    ).forEach(item => {

        item.classList.remove(
            "active"
        );

    });


    button.classList.add("active");


    if(name !== "Game"){

        showToast(
            name + " section • Coming in next part"
        );

    }

}


/* ==========================================
   TOAST
========================================== */

let toastTimer;


function showToast(message){

    const toast =
        document.getElementById(
            "toast"
        );


    toast.innerText =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(function(){

            toast.classList.remove(
                "show"
            );

        },1800);

}


/* ==========================================
   INITIALIZE
========================================== */

document.getElementById(
    "roundId"
).innerText =
    createRoundId();


document.getElementById(
    "amountInput"
).value =
    selectedAmount;


document.getElementById(
    "selectedAmount"
).innerText =
    selectedAmount.toFixed(2);


updateBalance();

updateTimer();
