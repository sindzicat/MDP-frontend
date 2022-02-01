"use strict";

const input = document.querySelector('input');
const inputValue = input.value;

function isNumber(s){
    return "0123456789".includes(s);
}

function isSpace(s){
    return s === " " || s === "\t"
}

function wrongSymbol(s){
    return !("0123456789 \t:hmчм".includes(s))
}

function parseTimeDelta(timeDeltaInput){
    let hoursInput = "";
    let minutesInput = "";
    let timePart = 1;  // 1, 2 или 3
    for (const s of timeDeltaInput){
        if (wrongSymbol(s)){
            return {
                status: 'err',
                err: `Недопустимый символ: ${s}`
            }
        } else if (isSpace(s)) {
            if (timePart === 1 && hoursInput.length > 0){
                timePart = 2; // Мы выделили часы из строки
            } else {
                continue;
            }
        } else if (isNumber(s)){
            if (timePart === 1){
                hoursInput += s;
            } else {
                minutesInput += s;
            }
        } else if ("чh:".includes(s)){
            if (timePart <= 2){
                timePart = 3;
            } else {
                return {
                    status: 'err',
                    err: `Вы уже ввели часы!`
                }
            }
        } else if ("mм".includes(s)){
            if (timePart <= 2){
                minutesInput = hoursInput;
                hoursInput = "0";
                timePart = 3;
            }
        }
    }
    return {
        status: 'ok',
        hours: +hoursInput,
        minutes: +minutesInput
    }
}

console.log(parseTimeDelta(inputValue));

input.addEventListener('input', (e) => console.log(parseTimeDelta(e.target.value)));