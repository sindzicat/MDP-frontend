import {assert} from 'chai';
import { compareObjects } from '../src/utils.js';

describe('Сравнение объектов', function(){
    it("Два объекта не равны, если у них разное количество ключей", function () {
        const obj1 = {a:1, b:2, c:3};
        const obj2 = {a:1, b:2};
        assert.isNotTrue(compareObjects(obj1, obj2));
    });

    it("Два объекта не равны, если их ключи не совпадают", function(){
        const obj1 = {a:1, b:2, d:3};
        const obj2 = {a:1, b:2, c:3};
        assert.isNotTrue(compareObjects(obj1, obj2));
    });
    
        it("Два объекта не равны, если не совпадают типы значений для одинаковых ключей", function(){
            const obj1 = {a:1, b:2, c:3};
            const obj2 = {a:1, b:2, c:"Hello"};
            assert.isNotTrue(compareObjects(obj1, obj2))
        })

    it("Два объекта не равны, если их значения-числа не совпадают", function(){
        const obj1 = {a:1, b:2, c:3};
        const obj2 = {a:1, b:3, c:3};
        assert.isNotTrue(compareObjects(obj1, obj2));
    });

    it("Два объекта не равны, если их значения-строки не совпадают", function(){
        const obj1 = {a:"abc", b:"cde", c:"qq"};
        const obj2 = {a:"abc", b:"cde", c:"gg"};
        assert.isNotTrue(compareObjects(obj1, obj2));
    });
})