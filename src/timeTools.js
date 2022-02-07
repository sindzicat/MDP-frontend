"use strict";

/**
 * Набор допустимых символов для указания диапазона времени.
 */
const ALLOWED_SYMBOLS = "0123456789 :hmчм"

/**
 * Проверяется, является ли заданный символ числом, что соответствует обозначению \d в регулярных выражениях.
 * @param {string} s 
 * @returns {boolean} True, если заданный символ — число.
 */
function isNumber(s){
    if (s.length > 1) throw "Функции isNumber требуется только один символ.";
    return "0123456789".includes(s);
}

/**
 * Проверяется, что рассматриваемый символ является НЕдопустимым символом при указании пользователем диапазона времени.
 * @param {string} s 
 * @returns {boolean} True, если заданный символ НЕ допустим при указании пользователем диапазона времени.
 */
function wrongSymbol(s){
    if (s.length > 1) throw "Функции isNumber требуется только один символ.";
    return !(ALLOWED_SYMBOLS.includes(s))
}

// Зададим новый тип данных, как здесь люди рекомендуют: https://stackoverflow.com/a/28763616
/**
 * @typedef {object} TimeDeltaParseResult
 * @property {string} status — статус обработки: 'ok', если всё правильно, или 'err' в случае ошибки.
 * @property {string} err — сообщение об ошибке. Если status == 'ok, этого поля не будет.
 * @property {number} errPos — номер символа, где обнаружена ошибка (отсчёт от нуля).  Если status == 'ok, этого поля не будет.
 * @property {string} hours — какое количество часов ввёл пользователь. Если status == 'err', этого поля не будет.
 * @property {string} minutes — какое количество минут ввёл пользователь. Если status == 'err', этого поля не будет.
 */

/**
 * Из введённой пользователем строки вычленяются часы и минуты заданного пользователем диапазона времени. Если пользователь ввёл диапазон времени в неверном формате, выдаётся сообщение с подсказкой об ошибке.
 * @param {string} timeDeltaInput 
 * @returns {TimeDeltaParseResult} Объект, который содержит число часов и минут, введённых пользователем. Если пользователь допустил ошибку при вводе диапазона времени, объект содержит информацию об этой ошибке.
 */
export function parseTimeDelta(timeDeltaInput){
    let pos = 0;
    let numbers = [];
    let lastNumber = "";
    for (let i = 0; i < timeDeltaInput.length; i++){
        const s = timeDeltaInput[i]; // анализируемый символ
        if (wrongSymbol(s)){
            return {
                status: 'err',
                errPos: i,
                err: 'Недопустимый символ: ' + s
            }
        } else if (pos === 0){
            if (s === " "){
                continue
            } else if (isNumber(s)){
                pos++;
                lastNumber += s;
            } else {
                return {
                    status: 'err',
                    errPos: i,
                    err: "Вы должны начать с ввода числа (часы или миниуты)."
                }
            }
        } else if (pos === 1){
            if (isNumber(s)){
                lastNumber += s;
            } else if (" hmчм:".includes(s)){
                pos++;
                numbers.push(+lastNumber);
                lastNumber = "";
            }
        } else if (pos === 2){
            if (s === " hч:"){
                continue;
            } else if ("мm".includes(s)){
                pos = 4;
            } else if (isNumber(s)){
                pos++;
                lastNumber += s;
            }
        } else if (pos === 3){
            if (isNumber(s)){
                lastNumber += s;
            } else if (" mм".includes(s)){
                pos++;
                numbers.push(+lastNumber);
                lastNumber = "";
            }
        } else if (pos === 4){
            if (!" mм".includes(s)){
                return {
                    status: 'err',
                    errPos: i,
                    err: "В конце пишутся m латинская или м русская или ничего."
                }
            }
        }
    }
    if (lastNumber !== ""){
        numbers.push(+lastNumber)
    }
    if (numbers.length == 1){
        numbers = [0, numbers[0]]
    }
    return {
        status: 'ok',
        hours: numbers[0],
        minutes: numbers[1]
    }
}

// console.log(parseTimeDelta("5:30"))