"use strict";

/**
Сравнение объектов. Пока значениями
сравниваемых объектов могут быть только
числа и строки. 
*/
export function compareObjects(obj1, obj2){
    // 1. Проверим, что число ключей у объектов одинаково.
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length != keys2.length){
        return false
    } else {
        // 2. Проверим, что ключи объектов совпадают
        for (const k of keys1){
            if (!keys2.includes(k)){
                return false;
            }
        }
        // 3. Проверим, что значения объектов совпадают
        // Пока предполагается, что значения объектов — строки и числа.
        // В противном случае NonImplementedError
        for (const k of keys1){
            if (["string", "number"].includes(typeof k)){
                if (obj1[k] !== obj2[k]){
                    return false;
                }
            } else {
                throw "NonImplemetedError: Функция compareObjects умеет сравнивать только объекты, которые хранят только строки и числа."
            }
        }
    }
    return true;
}