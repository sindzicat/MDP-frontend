// Модули Node.js
import { fileURLToPath } from "url";

// Собственные модули
import renderHTML from "./renderHTML.js";
import buildJS from "./buildJS.js";

// Однократная сборка сайта.
export function build(){
    renderHTML();
    buildJS();
    console.log('Сделано.')
}

export default build;

const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename){
    build();
}
