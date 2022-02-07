// Модули Node.js
import { fileURLToPath } from "url";

// Собственные модули
import watchPug from './watchPug.js';
import watchCSS from './watchJS.js';
import watchJS from './watchJS.js';
import serve from './serve.js';

export function dev(){
    watchPug();
    watchJS();
    watchCSS();
    serve();
}

export default dev;

const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename){
    dev();
}
