// Модули Node.js
import { fileURLToPath } from "url";
import chokidar from 'chokidar';

// Собственные модули
import renderHTML from "./renderHTML.js";

// Настройки
import { files} from '../config.js';
const conf = files.watchPug;

// Отслеживание изменений в pug файлах.
export function watchPug(){
    const watcher = chokidar.watch(conf.src, {
        ignored: ['node_modules/*']
    });
    watcher
        .on('add', (fpath) => {
            console.log(`Добавлен файл ${fpath}`);
            renderHTML();
        })
        .on('change', (fpath) => {
            console.log(`Изменился файл ${fpath}`)
            renderHTML();
        })
}

export default watchPug;

const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename){
    watchPug();
}
