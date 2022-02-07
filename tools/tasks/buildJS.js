// Модули Node.js
import { fileURLToPath } from "url";
import { createRequire } from 'module';

// Аналог __require из CommonJS
const require = createRequire(import.meta.url);

// Импорт в стиле CommonJS
const esbuild = require('esbuild');

// Настройки
import { files } from "../config.js";
const conf = files.buildJS;

// Сборка JS бандла.
export function buildJS(){
    esbuild.build({
        // Настройки для Esbuild: 
        // https://esbuild.github.io/api
        entryPoints: conf.entryPoints,
        bundle: true,
        minify: true,
        sourcemap: true,
        target: "es6",
        charset: 'utf8',
        outfile: conf.outfile
    })
}

export default buildJS;

const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename){
    buildJS();
}
