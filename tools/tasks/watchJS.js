// Модули Node.js
import { fileURLToPath } from "url";
import chokidar from 'chokidar';

// Собственные модули
import bundleJS from './buildJS.js';

// Настройки
import { files} from '../config.js';
const conf = files.wathchJS;

// Наблюдение за изменениями в JS файлах.
export function watchJS(){
    const watcher = chokidar.watch(conf.src, {
            ignored: ['node_modules/*']
        });
    watcher
        .on('add', (fpath) => {
            console.log(`Добавлен файл ${fpath}`);
            bundleJS();
        })
        .on('change', (fpath) => {
            console.log(`Добавлен файл ${fpath}`);
            bundleJS();
        })
}

export default watchJS;

const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename){
    watchJS();
}
