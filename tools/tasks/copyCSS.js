// Модули Node.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from "url";
import { createRequire } from 'module';

// Аналог __require из CommonJS
const require = createRequire(import.meta.url);

// Внешние модули (CommonJS)
const fg = require('fast-glob');

// Собственные модули
import subPath from "../modules/subPath.js";

// Настройки
import {files} from '../config.js';
const conf = files.copyCSS;

// Копирование CSS файлов в папку сайта
export function copyCSS(){
    const cssFiles = fg.sync(conf.src);
    for (const fpath of cssFiles){
        console.log(subPath(fpath));
        fs.copyFileSync(fpath, path.join(conf.dest, subPath(fpath)))
    }
}

export default copyCSS;

const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename){
    copyCSS();
}
