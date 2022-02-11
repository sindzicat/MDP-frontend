'use strict';

const hourWords = ['hour', 'hours', 'h', 'час', 'часа', 'часов', 'часы', 'ч'];
// Сортировка от элемента наибольшей длины до элемента наименьшей длины
hourWords.sort((a,b) => b.length - a.length);
const rHour = new RegExp(hourWords.join('|'), 'y');

const minuteWords = ['minute', 'minutes', 'm', 'минут', 'минута', 'минуты', 'м'];
// Сортировка от элемента наибольшей длины до элемента наименьшей длины
minuteWords.sort((a,b) => b.length - a.length);
const rMinute = new RegExp(minuteWords.join('|'), 'y');

function isDigit(smb){ return "0123456789".includes(smb) }

export function correctTimeDelta(h,m){
    let resHours, resMinutes;
    if (h%1 === 0){
        resHours = h;
    } else {
        resHours = Math.floor(h);
        resMinutes += h%1 * 60;
    }
    if (resMinutes%60 !== 0){
        resHours += Math.floor(resMinutes / 60);
        resMinutes = resMinutes%60;
    }
    return [resHours, resMinutes];
}

export function parseTimeDelta(timeDeltaInput){
    let timeNums = [];
    let setHours = {
        isTyped: false,
        word: undefined,
        pos: undefined
    };
    let setMinutes = {
        isTyped: false,
        word: undefined,
        pos: undefined
    };

    // Для поиска числа
    const rNum = /\d+\.\d+|\d+\.|\.\d+|\d+/y;
    // Для поиска дробных минут
    const fracMinutesRgx = new RegExp(String.raw`(?<=(?:${rNum.source}).*?)(${rNum.source})`, 'g');

    function parseNumber(){
        if (timeNums.length === 2){ // Часы и минуты уже введены
            return {
                    status: 'err',
                    errPos: i,
                    errMsg: 'Требуется максимум два числа (часы и минуты). Найдено третье число.'
                }
        } else { // Извлекаем число и анализируем его
            rNum.lastIndex = i; // Позиция начала поиска
            const match = rNum.exec(timeDeltaInput);
            const num = Number(match[0]);
            
            // Дробные минуты не допускаются
            if (
                timeNums.length === 1 && // Наше число второе, т.е. минуты
                num%1 !== 0 // число минут дробное
            ) {
                return {
                    status: 'err',
                    errPos: i,
                    errMsg: "Дробное число минут не допускается."
                }
            } else { // Принимаем число
                timeNums.push(num);
                i += match[0].length-1;
            }
        }
    }

    let i = 0; // Выносим из цикла, чтобы работали внутренние функции.
    for (; i < timeDeltaInput.length; i++){
        const s = timeDeltaInput[i]; // Анализируемый символ
        if (s === ' '){ // Проверка на пробел
            continue;
        } else if (isDigit(s)){ // Мы нашли число
            let out = parseNumber();
            if (out !== undefined){
                return out;
            }
        } else if (s === '.'){ // Возможно, эта точка — начало числа
            if (
                i+1 < timeDeltaInput.length && // Если точка НЕ в конце строки.
                isDigit(timeDeltaInput[i+1]) // Следующий символ после точки — цифра.
            ){
                let out = parseNumber();
                if (out !== undefined){
                    return out;
                }
            } else {
                return {
                        status: 'err',
                        errPos: i,
                        errMsg: 'Недопустимый символ: . (эта точка не является частью числа).'
                    }
            }
        } else if (s === ':'){ // Нашли двоеточие
            if (timeNums.length === 0){ // Двоеточие НЕ может идти до первого числа
                return {
                    status: 'err',
                    errPos: i,
                    errMsg: 'Двоеточие не может идти до первого числа.'
                }
            } else if (timeNums.length > 1){ // Двоеточение НЕ может идти после второго числа
                return {
                    status: 'err',
                    errPos: i,
                    errMsg: 'Двоеточие не может идти после второго числа.'
                }
            } else if (setHours.isTyped){ // Двоеточие НЕ нужно, когда введено слово «часы».
                return {
                    status: 'err',
                    errPos: i,
                    errMsg: `Двоеточение не нужно, когда уже введено слово ${setHours.word}.`
                }
            } // В остальных случаях continue.
        } else { // Остальные символы являются частью какого-то слова.
            // Ищем различные формы записи слова "часы":
            rHour.lastIndex = i; // Позиция начала поиска.
            const matchHour = timeDeltaInput.match(rHour);
            if (matchHour === null){ // Мы не нашли слова "часы", но какой-то символ есть.
                // Ищем различные формы записи слова "минуты":
                rMinute.lastIndex = i; // Позиция начала поиска.
                const matchMinute = timeDeltaInput.match(rMinute);
                if (matchMinute === null){ // Мы не нашли слова "минуты", но какой-то символ есть.
                    return {
                        status: 'err',
                        errPos: i,
                        errMsg: `Недопустимый символ: ${s}`
                    }
                } else { // Мы обнаружили слово "минуты"
                    if (setMinutes.isTyped){ // Слово "минуты" уже было введено
                        return {
                            status: 'err',
                            errPos: i,
                            errMsg: `Вы уже ввели слово ${setMinutes.word}. Дважды задавать минуты в одном поле ввода нельзя.`
                        }
                    } else if (timeNums.length === 0) { // слово не может идти до чисел
                        return {
                            status: 'err',
                            errPos: i,
                            errMsg: "Вы должны начать с ввода числа (часы или миниуты)."
                        }
                    } else if (timeNums.length === 1 && setHours.isTyped){ // не может быть два слова между числами
                        return {
                            status: 'err',
                            errPos: i,
                            errMsg: `После первого числа требуется одно слово: или часы или минуты. Вы вводите второе слово ${setMinutes.word}.`
                        }
                    } else { // Слово "минуты" встречается впервые
                            setMinutes.isTyped = true;
                            setMinutes.word = matchMinute[0];
                            setMinutes.pos = (setHours.pos === 1) ? 2 : 1;
                            i += setMinutes.word.length -1;
                        }
                    // Раз введены минуты, проверим, что сами минуты являются дробным числом.
                    let m = timeNums.slice(-1)[0];
                    // Определим позицию дробных минут:
                    if (String(m).includes('.')){
                        let ind;
                        if (timeNums.length === 1){
                            ind = (new RegExp(rNum.source, 'g')).exec(timeDeltaInput).index;
                        } else {
                            ind = fracMinutesRgx.exec(timeDeltaInput).index;
                        }
                        return {
                            status: 'err',
                            errPos: ind,
                            errMsg: "Дробное число минут не допускается."
                        }
                    }
                }
            } else { // Мы нашли слово "часы".
                if (setHours.isTyped){ // Слово "часы" уже было введено
                    return {
                        status: 'err',
                        errPos: i,
                        errMsg: `Вы уже ввели слово ${setHours.word}. Дважды задавать часы в одном поле ввода нельзя.`
                    }
                } else if (timeNums.length === 0){ // слово не может идти до чисел
                    return {
                        status: 'err',
                        errPos: i,
                        errMsg: "Вы должны начать с ввода числа (часы или миниуты)."
                    }
                } else if (timeNums.length === 1 && setMinutes.isTyped){ // не может быть два слова между числами
                    return {
                        status: 'err',
                        errPos: i,
                        errMsg: `После первого числа требуется одно слово: или часы или минуты. Вы вводите второе слово ${setHours.word}.`
                    }
                } else { // Слово "часы" встречается впервые.
                    setHours.isTyped = true;
                    setHours.word = matchHour[0];
                    setHours.pos = (setMinutes.pos === 1) ? 2 : 1;
                    i += setHours.word.length - 1;
                }
            }
        }
    }
    if (setMinutes.pos < setHours.pos){
        timeNums.reverse();
    } else if (timeNums.length === 1){
        // Дробные минуты не допускаются.
        let m = timeNums[0];
        console.log(m)
        if (String(m).includes('.')) {
            let ind;
            if (timeNums.length === 1){
                ind = (new RegExp(rNum.source, 'g')).exec(timeDeltaInput).index;
            } else {
                ind = fracMinutesRgx.exec(timeDeltaInput).index;
            }
            return {
                status: 'err',
                errPos: ind,
                errMsg: "Дробное число минут не допускается."
            }
        }
        // Приводим timeNums к формату [часы, минуты]
        timeNums = [0, timeNums[0]];
    }
    const [h, m] = timeNums;
    return {
        status: 'ok',
        hours: h,
        minutes: m
    }
}
