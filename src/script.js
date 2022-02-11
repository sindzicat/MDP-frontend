"use strict";
import { parseTimeDelta, formatTimeDelta, correctTimeDelta } from './timeTools.js';

const input = document.querySelector('input');
const node = document.querySelector('.output');
const translationData = {
    ok: "всё правильно",
    err: "возникла ошибка",
}

function showParsingResult(val){
    const resObj = parseTimeDelta(val);
    node.textContent = `
статус: ${translationData[resObj.status]}
часы: ${resObj?.hours || "(не определено)"}
минуты: ${resObj?.minutes || "(не определено)"}
ошибка: ${resObj?.errMsg || "(ошибки нет)"}
номер символа, где возникла ошибка: ${resObj?.errPos+1 || ""}
    `
}

showParsingResult(input.value);

function processTimeDelta(inputNode){
    const parseRes = parseTimeDelta(inputNode.value);
    if (parseRes.status === 'ok'){
        let {hours, minutes} = parseRes;
        let [h,m] = correctTimeDelta(hours, minutes);
        inputNode.value = formatTimeDelta(h,m, false);
    }

}

processTimeDelta(input);

input.addEventListener('input', function(el){
    showParsingResult(el.target.value)
});

// Потеря фокуса при нажатии Enter
input.addEventListener('keydown', function(event){
    if (['Enter', 'NumpadEnter'].includes(event.code)){
        this.blur();
    }
});

input.addEventListener('blur', function(el){
    processTimeDelta(el.target);
})
