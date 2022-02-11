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
    let resHours = h;
    let resMinutes = m;
    if (h%1 !== 0){
        resHours = Math.floor(h);
        resMinutes += h%1 * 60;
    }
    if (resMinutes >= 60){
        resHours += Math.floor(resMinutes / 60);
        resMinutes = resMinutes%60;
    }
    return [resHours, resMinutes];
}

export function parseTimeDelta(timeDeltaInput){
    const timeNums = [];
    // Элементы списка timeNums — объекты с ключами:
    // raw — текстовое представление числа, как оно введено пользователем,
    // val — самое число,
    // pos — позиция числа в тексте.
    const hourWord = {
        isTyped: false,
        word: '',
        pos: undefined
    };
    const minuteWord = {
        isTyped: false,
        word: '',
        pos: undefined
    };

    // Для поиска числа
    const rNum = /\d+\.\d+|\d+\.|\.\d+|\d+/y;

    function parseNumber(){
        if (timeNums.length === 2){ // Часы и минуты уже введены
            return {
                    status: 'err',
                    errPos: i,
                    errMsg: 'Требуется максимум два числа (часы и минуты). Найдено третье число.'
                }
        } else { // Извлекаем число из строки и анализируем его
            rNum.lastIndex = i; // Позиция начала поиска
            const match = rNum.exec(timeDeltaInput);
            const num = Number(match[0]);

            // Дробные минуты не допускаются
            if (
                timeNums.length === 1 && // Наше число второе, т.е. минуты
                match[0].includes('.') // значение минут дробное
            ) {
                return {
                    status: 'err',
                    errPos: i,
                    errMsg: "Дробное число минут не допускается."
                }
            } else { // Принимаем число
                timeNums.push({
                    raw: match[0],
                    val: num,
                    pos: i
                });
                i += match[0].length-1;
            }
        }
    }

    if (timeDeltaInput === ''){
        return {
            status: 'err',
            errPos: 0,
            errMsg: 'Ничего не введено'
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
            } else if (hourWord.isTyped){ // Двоеточие НЕ нужно, когда введено слово «часы».
                return {
                    status: 'err',
                    errPos: i,
                    errMsg: `Двоеточение не нужно, когда уже введено слово ${hourWord.word}.`
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
                    if (minuteWord.isTyped){ // Слово "минуты" уже было введено
                        return {
                            status: 'err',
                            errPos: i,
                            errMsg: `Вы уже ввели слово ${minuteWord.word}. Дважды задавать минуты в одном поле ввода нельзя.`
                        }
                    } else if (timeNums.length === 0) { // слово не может идти до чисел
                        return {
                            status: 'err',
                            errPos: i,
                            errMsg: "Вы должны начать с ввода числа (часы или миниуты)."
                        }
                    } else if (timeNums.length === 1 && hourWord.isTyped){ // не может быть два слова между числами
                        return {
                            status: 'err',
                            errPos: i,
                            errMsg: `После первого числа требуется одно слово: или часы или минуты. Вы вводите второе слово ${minuteWord.word}.`
                        }
                    } else { // Слово "минуты" встречается впервые
                            minuteWord.isTyped = true;
                            minuteWord.word = matchMinute[0];
                            minuteWord.pos = (hourWord.pos === 1) ? 2 : 1;
                            i += minuteWord.word.length -1;
                        }
                    // Раз введены минуты, проверим, что сами минуты являются дробным числом.
                    let m = timeNums.slice(-1)[0];
                    // Определим позицию дробных минут:
                    if (m.raw.includes('.')){
                        return {
                            status: 'err',
                            errPos: m.pos,
                            errMsg: "Дробное число минут не допускается."
                        }
                    }
                }
            } else { // Мы нашли слово "часы".
                if (hourWord.isTyped){ // Слово "часы" уже было введено
                    return {
                        status: 'err',
                        errPos: i,
                        errMsg: `Вы уже ввели слово ${hourWord.word}. Дважды задавать часы в одном поле ввода нельзя.`
                    }
                } else if (timeNums.length === 0){ // слово не может идти до чисел
                    return {
                        status: 'err',
                        errPos: i,
                        errMsg: "Вы должны начать с ввода числа (часы или миниуты)."
                    }
                } else if (timeNums.length === 1 && minuteWord.isTyped){ // не может быть два слова между числами
                    return {
                        status: 'err',
                        errPos: i,
                        errMsg: `После первого числа требуется одно слово: или часы или минуты. Вы вводите второе слово ${hourWord.word}.`
                    }
                } else { // Слово "часы" встречается впервые.
                    hourWord.isTyped = true;
                    hourWord.word = matchHour[0];
                    hourWord.pos = (minuteWord.pos === 1) ? 2 : 1;
                    i += hourWord.word.length - 1;
                }
            }
        }
    }
    if (minuteWord.pos < hourWord.pos){ // Пользователь указал минуты, а потом часы ¯\_(ツ)_/¯
        timeNums.reverse();
    } else if (timeNums.length === 1){
        // Дробные минуты не допускаются.
        let m = timeNums[0];
        if (m.raw.includes('.')) {
            return {
                status: 'err',
                errPos: m.pos,
                errMsg: "Дробное число минут не допускается."
            }
        }
        // Приводим timeNums к формату [часы, минуты]
        timeNums.splice(
            0, // вставляем в начало списка
            0, // ничего не удаляем
            {val:0} // вставляем объект для часов
        )
    }
    const [h, m] = timeNums;
    return {
        status: 'ok',
        hours: h.val,
        minutes: m.val
    }
}

export function formatTimeDelta(h,m, full=true){
    let strHour = String(h);
    let strMinute = String(m);
    let hourWord = '';
    let minuteWord = '';

    if (strHour.length >= 2 && strHour.slice(-2,-1) === '1'){
        hourWord = 'часов';
    } else {
        let lastSymbol = strHour.slice(-1);
        if ('056789'.includes(lastSymbol)){
            hourWord = 'часов';
        } else if ('234'.includes(lastSymbol)){
            hourWord = 'часа';
        } else { // последний символ = 1
            hourWord = 'час';
        }
    }

    if (strMinute.length >= 2 && strMinute.slice(-2,-1) === '1'){
        minuteWord = 'минут';
    } else {
        let lastSymbol = strMinute.slice(-1);
        if ('056789'.includes(lastSymbol)){
            minuteWord = 'минут';
        } else if ('234'.includes(lastSymbol)){
            minuteWord = 'минуты';
        } else { // последний символ = 1
            minuteWord = 'минута'
        }
    }

    // https://ru.wikipedia.org/wiki/Законы_де_Моргана
    if (!(full || (h === 0 && m === 0))){
        if (h === 0){
            return `${m} ${minuteWord}`;
        } else if (m === 0){
            return `${h} ${hourWord}`
        }
    }
    return `${h} ${hourWord} ${m} ${minuteWord}`;
}
