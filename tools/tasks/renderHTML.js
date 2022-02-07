// Модули Node.js
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createRequire } from 'module';
import { dirname } from "path";

// Внешние модули (es6)
import pug from "pug";
import * as cheerio from 'cheerio';

// Аналог __require из CommonJS
const require = createRequire(import.meta.url);

// Аналог __filename из CommonJS
const __filename = fileURLToPath(import.meta.url);

// Внешние модули (CommonJS)
const html_beautify = require('js-beautify').html;
const fg = require('fast-glob');

// Собственные модули
import subPath from "../modules/subPath.js";

// Настройки
import { files } from "../config.js";
const conf = files.renderHTML;

// Преобразование pug -> html для одного файла.
function renderHTMLFile(fpath, dest){
    // Читаем содержимое файла
    const fileContent = fs.readFileSync(fpath, {encoding: 'utf-8'});
    // Настраиваем рендеринг документа.
    const doc = {
        name: path.basename(fpath, path.extname(fpath)),
        path: path.resolve(fpath),
        fullURL: false,  // показывать ли префикс URL адреса.
        rootPath: dirname(__filename)
    }
    let imgNum = 1;  // порядковый номер изображения.
    const options = {
        filename: fpath,
        doc: doc,
        imgRef: (n) => `<a href="#img-${n}">${n}</a>`,
        figCapN: () => `Рис. ${imgNum++}`,
        lq: '&laquo;',   // ALT+0171 «
        rq: '&laquo;',   // ALT+0187 »
        deg: '&deg;',    // ALT+0176 °
        url: (s, showFullURL) => `<a href="${s}">${doc.fullURL || showFullURL ? s : s.replace(/^https?:\/\/(?:www.)?/g, '').replace(/\/$/g, '')}</a>`,
        filters: {
            'codeblock': function (text, props) {
                const $ = cheerio.load('<pre></pre>');
                // $(selector).text(code) автоматически выполняет преобразование HTML тегов
                $('pre').text(text);
                const {lang} = props;
                if (lang) {
                    $('pre').prop("lang", lang);
                }
                return $('body').html()
            },
        }
    }
    // Рендерим документ.
    let renderedHTML = "";
    try {
        renderedHTML = pug.render(fileContent, options);
    } catch (err) {
        console.error(`При рендеринге файла ${fpath} произошла ошибка:`);
        console.error(err)
    }
    // Делаем HTML человекочитаемым.
    const prettiedHTML = html_beautify(renderedHTML);
    // Формируем путь выходного файла.
    let outputFilePath = '';
    if (conf.dest.endsWith('.html')){
        outputFilePath = conf.dest;
    } else {
        const p = path.parse(fpath)
        outputFilePath = path.join(dest, subPath(fpath), p.name+'.html');
    }
    // Пишем HTML в итоговый файл.
    fs.writeFileSync(outputFilePath, prettiedHTML);
}

// Преобразование pug -> html для произвольного числа файлов.
export function renderHTML(){
    const fpaths = fg.sync(conf.src);
    console.log(conf.src, fpaths);
    for (const fpath of fpaths){
        renderHTMLFile(fpath, conf.dest)
    }
}

export default renderHTML

if (process.argv[1] === __filename){
    renderHTML();
}
