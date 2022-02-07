// Модули Node.js
import { fileURLToPath } from "url";
import chokidar from 'chokidar';

// Собственные модули
import { copyCSS } from "./copyCSS.js";

// Настройки
import {files} from '../config.js';
const conf = files.watchCSS;

// Автоматическое копирование изменённых CSS файлов в папку сайта
export function watchCSS(){
    const watcher = chokidar.watch(conf.src, {
        ignored: ['node_modules/*']
    });
    watcher
        .on('add' | 'change', fpath => {
            console.log(`Файл ${fpath} скопирован в папку ${conf.dest}.`);
            copyCSS();
        })
}

export default watchCSS;

const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename){
    watchCSS();
}
