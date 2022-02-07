// Внешние модули
import 'dotenv/config';
import {execa} from 'execa';

// Настройки
import { files } from "../config.js";
const conf = files.runTests;

// Путь к исполняемому файлу mocha
let mocha;
if (process.platform == 'win32'){
    mocha = process.env.MOCHA_WINDOWS;
    console.log(mocha)
} else {
    throw ("NonImplementedError: Извините, поддержка Linux и MacOS ещё не реализована.")
}

// Запуск всех тестов
export function runTests(){
    try{
        execa(mocha, ['--bail', conf.src]).stdout.pipe(process.stdout);
    } catch (err) {
        console.error(err);
    }
    
}
