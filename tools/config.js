// Все пути даются относительно корня проекта.
// Здесь только пути к файлам.

export const files = {
    serve: {
        files: ["build/*"],
        baseDir: "build"
    },
    buildJS: {
        entryPoints: ["src/script.js"],
        outfile: "build/script.js"
    },
    wathchJS: {
        src: 'src/script.js',
        dest: 'build/'
    },
    renderHTML: {
        src: 'src/index.pug',
        dest: 'build/index.html'
    },
    watchPug: {
        src: 'src/index.pug',
        dest: 'build/index.html'
    },
    watchCSS: {
        src: 'src/**/*.css',
        dest: 'build'
    },
    runTests: {
        src: 'tests/test*.js'
    }
}

files.copyCSS = files.watchCSS;

export default files;
