import { assert } from "chai";
import { correctTimeDelta } from "../src/timeTools.js";

describe("Тест функции автоматической коррекции форма ввода диапазона времени (ч:м):", function(){
    it("Коррекция не требуется для правильного формата времени.", function(){
        assert.deepEqual(correctTimeDelta(3,50), [3,50])
    });

    it("Учёт дробных часов.", function(){
        assert.deepEqual(correctTimeDelta(.5,0), [0,30])
    });

    it("Учёт дробных минут.", function(){
        assert.deepEqual(correctTimeDelta(5,10.5), [5,11])
    });

    it("Учёт случая, когда минут > 60", function(){
        assert.deepEqual(correctTimeDelta(3,125), [5,5])
    });

    it("Часы и минут — дробные числа, минут > 60", function(){
        assert.deepEqual(correctTimeDelta(5.5, 130.5), [7,41])
    })
})
