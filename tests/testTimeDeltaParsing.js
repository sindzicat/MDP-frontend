import {assert} from 'chai';
import {parseTimeDelta} from '../src/timeTools.js';

const WRONG_LATIN_SYMBOLS = "abcdefgijklnopqrstuvwxyz";

describe("Функция разбора ввода отрезка времени", function(){
    describe("Сообщает о некорректных символах", function(){
        describe("Считает любую английскую букву, кроме h и m некорректными", function(){
            for (const s of WRONG_LATIN_SYMBOLS){
                it(`Проверка для латинской буквы ${s}`, function(){
                    assert.deepStrictEqual(parseTimeDelta(s), {
                        status: 'err',
                        errPos: 0,
                        errCode: 2,
                        errMsg: 'Недопустимый текст: '+ s
                    })
                })
            }
        });

        describe("Проверка правильности определения позиции некорректного символа.", function(){
            for (const s of WRONG_LATIN_SYMBOLS){
                it(`Проверка для латинской буквы ${s}`, function(){
                    assert.deepStrictEqual(parseTimeDelta('1'+s), {
                        status: 'err',
                        errPos: 1,
                        errCode: 2,
                        errMsg: 'Недопустимый текст: ' + s
                    })
                })
            }
        })
    })

    describe("Анализ группы 0", function(){
        it("Проверка, что строка начинается с числа", function(){
            assert.deepStrictEqual(parseTimeDelta('h 5'), {
                status: 'err',
                errPos: 0,
                errMsg: "Перед словом h должно идти число."
            })
        })
        it("Пропуск пробельных символов в начале строки", function(){
            assert.deepStrictEqual(parseTimeDelta('   h 5'), {
                status: 'err',
                errPos: 3,
                errMsg: "Перед словом h должно идти число."
            })
        })
    })

    describe("Извлекает диапазон времени", function(){
        const h = 5;
        const m = 30;
        const arr = [
            '5:30',
            ' 5:30',
            '5 :30',
            '5: 30',
            '5:30 ',
            ' 5 : 30 ',
            '5h30m',
            ' 5 h 30 m',
            '5h30'
        ]
        for (const t of arr){
            it (t, function(){
                assert.deepStrictEqual(parseTimeDelta(t), {
                    status: 'ok',
                    hours: h,
                    minutes: m
                })
            })
        }

        it("Просто число означает минуты", function(){
        assert.deepStrictEqual(parseTimeDelta(" 5 "), {
            status: 'ok',
            hours: 0,
            minutes: 5
        })
    })
    })

    
})