// Модули Node.js
import { fileURLToPath } from "url";
import browserSync from "browser-sync";

// Настройки
import { files } from "../config.js";
const conf = files.serve;

// Экземпляр BrowserSync.
// https://browsersync.io/docs/api#api-create
const bs = browserSync.create();

// Запуск BrowserSync с настройками.
export function serve() {
    bs.init({
        // Настройки для BrowserSync.
        // Описание опций см. https://browsersync.io/docs/options
        files: conf.files,
        watch: true,
        server: {
            baseDir: conf.baseDir,
            directory: true,
        },
        port: 3000,
        online: false,
        notify: false,
        open: false,
        ui: false
    })
}

export default serve

const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename){
    serve();
}
