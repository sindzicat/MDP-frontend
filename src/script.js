"use strict";
import { parseTimeDelta } from './timeTools.js';

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
ошибка: ${resObj?.err || "(ошибки нет)"}
номер символа, где возникла ошибка: ${resObj?.errPos+1 || ""}
    `
}

showParsingResult(input.value);

input.addEventListener('input', (e) => console.log(showParsingResult(e.target.value)));