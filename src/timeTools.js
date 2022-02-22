'use strict';

const hourWords = ['hour', 'hours', 'h', 'час', 'часа', 'часов', 'часы', 'ч', ':'];
// Сортировка от элемента наибольшей длины до элемента наименьшей длины
hourWords.sort((a,b) => b.length - a.length);
const rHour = new RegExp(hourWords.join('|'), 'y');

const minuteWords = ['minute', 'minutes', 'm', 'минут', 'минута', 'минуты', 'м'];
// Сортировка от элемента наибольшей длины до элемента наименьшей длины
minuteWords.sort((a,b) => b.length - a.length);
const rMinute = new RegExp(minuteWords.join('|'), 'y');

const rWord = /\.?[^\d:\n ]+/y

// Для поиска числа со знаком
const rNum = /(?:\+|\-){0,1}\s*(?:\d+\.\d+|\d+\.|\.\d+|\d+)/y;

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

// Лексер. Разбор ввода времени на смысловые единицы.
export function scanTimeDelta(timeDeltaInput){
    const elements = [];
    let error;

    function scanNumber(){
        // Поиск числа
        rNum.lastIndex = i;
        const match = rNum.exec(timeDeltaInput);
        if (match === null){ // Число не найдено.
            // Ситуация, что число не обнаружено, возможна только
            // тогда, когда первым символом является либо точка,
            // либо плюс или минус. В остальных случаях первым
            // символом поиска является цифра, и поиск обязательно
            // найдёт хоть какое-то число.
            const symbolName = {
                '+': 'Символ плюса',
                '-': 'Символ минуса',
                '.': 'Символ точки'
            }[timeDeltaInput[i]]
            error = {
                status: 'err',
                errPos: i,
                errCode: 1,
                errMsg: `${symbolName} в позиции ${i} не является частью числа.`
            };
            return 'err';
        } else { // Мы нашли число.
            // Уберём пробелы между знаком числа и самим числом.
            const num = Number(match[0].replace(' ', ''));
            elements.push({
                type: 'number',
                raw: match[0],
                num: num,
                pos: i,
            });
            i += match[0].length - 1;
            return 'ok';
        }
    }

    function scanWord(){
        // Ищем слово "часы" ("час", "часов", "hour", "h" и т.д.):
        rHour.lastIndex = i;
        const matchHour = rHour.exec(timeDeltaInput);
        if (matchHour !== null){ // найдено слово "часы"
            elements.push({
                type: 'word hour',
                word: matchHour[0],
                pos: i,
            });
            i += matchHour[0].length - 1;
            return 'ok';
        }
        // if-else не нужен, т.к. в предыдущем блоке return.
        
        // Ищем слово "минуты" ("минут", "minutes"  и т.д.):
        rMinute.lastIndex = i;
        const matchMinute = rMinute.exec(timeDeltaInput);
        if (matchMinute !== null){ // найдено слово "минуты"
            elements.push({
                type: 'word minute',
                word: matchMinute[0],
                pos: i
            });
            i += matchMinute[0].length - 1;
            return 'ok';
        }
        // if-else не нужен, т.к. в предыдущем блоке return.

        // Если два предыдущих блока не сработали,
        // это означает, что мы нашли недопустимое слово.
        // Прочтём это слово целиком.
        rWord.lastIndex = i;
        const matchWord = rWord.exec(timeDeltaInput);
        error = {
            status: 'err',
            errPos: i,
            errCode: 2,
            errMsg: `Недопустимый текст: ${matchWord[0]}`
        };
        return 'err';
    }

    // Сканирование текста
    const inputMaxLength = 30; // Максимальная длина ввода
    // Пользователь может обмануть веб-интерфейс через DevTools,
    // поэтому добавим проверку длины строки на JS.
    if (timeDeltaInput.length > 30){
        return {
            status: 'err',
            errPos: 30,
            errMsg: `Превышена максимальная длина ввода. Допускается не более ${inputMaxLength} символов.`
        }
    }
    let i = 0;
    for (; i < timeDeltaInput.length; i++){
        const s = timeDeltaInput[i];
        if (s === ' '){
            continue;
        } else if ('0123456789.-+'.includes(s)){
            let ans = scanNumber();
            if (ans === 'err'){
                return error;
            }
        } else {
            let ans = scanWord();
            if (ans === 'err'){
                return error;
            }
        }
    }
    return {
        status: 'ok',
        elements: elements
    };
}

// Парсер. Анализ смысловых единиц из ввода времени.
export function parseTimeDelta(timeDeltaInput){
    const ans = scanTimeDelta(timeDeltaInput);
    if (ans.status === 'err'){
        return ans;
    }

    const elements = ans.elements;
    let hours = 0;
    let minutes = 0;

    let i = 0;
    for (; i < elements.length; i++){
        const curEl = elements[i];
        const nextEl = (i + 1 < elements.length) ? elements[i+1] : {type: 'none'}

        if (curEl.type === 'number'){
            // 1) После числа идёт другое число или конец строки.
            if (['number', 'none'].includes(nextEl.type)){
                // Текущее число — минуты
                minutes += curEl.num;
            // 2) После числа идёт двоеточие (специальный формат).
            } else if (nextEl.raw === ':'){
                const el3 = (i + 2 < elements.length) ? elements[i+2] : {type: 'none', num: 0};
                if (['number','none'].includes(el3.type)){
                    // Имеем формат вида <часы>:<минуты> или <часы>:[конец строки]
                    hours += curEl.num;
                    minutes += el3.num;
                    i += 2;
                } else {
                    // Имеем некорректный формат <часы>:<слово>
                    return {
                        status: 'err',
                        errPos: el3.pos,
                        errMsg: `Перед словом ${el3.word} должно быть число.`
                    }
                }
            // 3) После числа идёт любое корректное слово
            } else {
                if (nextEl.type.endsWith('hour')){
                    hours += curEl.num;
                    i += 1;
                } else {
                    minutes += curEl.num;
                    i += 1;
                }
            }
        } else { // Если элемент не число, то он является словом.
            return {
                status: 'err',
                errPos: curEl.pos,
                errMsg: `Перед словом ${curEl.word} должно идти число.`
            }
        }
    }
    // Коррекция значений часов и минут
    const [h, m] = correctTimeDelta(hours, minutes);
    // Проверка границ планирования
    if (h > 18){
        return {
            status: 'err',
            errPos: -1,
            errMsg: `Нельзя планировать более, чем на 18 часов. У вас запланировано на ${formatTimeDelta(h, 0, false)}.`
        }
    }
    // Отрицательное время не допустимо
    if (h < 0 || m < 0){
        return {
            status: 'err',
            errPos: -1,
            errMsg: `Отрицательное время не допускается. У вас получилось ${formatTimeDelta(h, m)}.`
        }
    }
    // Если все барьеры пройдены, то значение часов и минут введено корректно.
    return {
        status: 'ok',
        hours: h,
        minutes: m
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
