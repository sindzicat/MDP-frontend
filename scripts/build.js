import pug from "pug";
import fs from "fs";
import path from 'path';
import beautify from 'js-beautify';
import * as cheerio from 'cheerio';
import chokidar from 'chokidar';
import browserSync from "browser-sync";
import __dirname from './__dirname.js';

const html_beautify = beautify.html_beautify

const sourceFile = "src/app.pug";
const outputFile = "build/app.html";
const rootFolder = path.resolve('.');
const buildFolder = path.join(rootFolder, 'build')

export const renderHTML = (fpath) => {
    // Читаем содержимое файла
    const fileContent = fs.readFileSync(fpath, {encoding: 'utf-8'});
    // Настраиваем рендеринг документа
    const doc = {
        name: path.basename(fpath, path.extname(fpath)),
        path: path.resolve(fpath),
        fullURL: false,  // показывать ли префикс URL адреса
        rootPath: __dirname
    }
    let imgNum = 1;  // порядковый номер изображения
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
    // Рендерим документ
    let renderedHTML = "";
    try {
        renderedHTML = pug.render(fileContent, options);
    } catch (err) {
        console.error(`При рендеринге файла ${fpath} произошла ошибка:`);
        console.error(err)
    }
    // Делаем HTML человекочитаемым
    const prettyHTML = html_beautify(renderedHTML);
    // Формируем путь выходного файла
    // const p = path.parse(fpath);
    // const outputFilePath = path.join(p.root, p.dir, p.name+'.html');
    // Пишем HTML в итоговый файл
    fs.writeFileSync(outputFile, prettyHTML);
}

const log = console.log.bind(console);

const pugWatcher = chokidar.watch(sourceFile, {
    ignored: ['node_modules/*']
});
pugWatcher
    .on('add', fpath => {
        // log(`Добавлен файл ${fpath}`);
        renderHTML(fpath)
    })
    .on('change', fpath => {
        // log(`Обновился файл ${fpath}`);
        renderHTML(fpath)
    });

const cssWatcher = chokidar.watch("src/**/*.css", {
    ignored: ['node_modules/*']
})
cssWatcher
    .on('add', fpath => {
        fs.copyFileSync(fpath, path.join(buildFolder, path.basename(fpath)));
    })
    .on('change', fpath => {
        fs.copyFileSync(fpath, path.join(buildFolder, path.basename(fpath)));
    })

const jsWatcher = chokidar.watch('src/**/*.js', {
    ignored: ['node_modules/*']
})
jsWatcher
    .on('add', fpath => {
        fs.copyFileSync(fpath, path.join(buildFolder, path.basename(fpath)));
    })
    .on('change', fpath => {
        fs.copyFileSync(fpath, path.join(buildFolder, path.basename(fpath)));
    })

const bs = browserSync.create();

bs.init({
    files: ["build/*"],
    watch: true,
    watchOptions: {
        ignored: "*.pug"
    },
    server: {
        baseDir: "build",
        directory: true
    },
    port: 3000,
    online: false,
    notify: false,
    open: false,
    ui: false
})