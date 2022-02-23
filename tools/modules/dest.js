// Модули Node.js
import fs from 'fs';
import path from 'path';

export function dest(srcFilePath, targetDirPaths, secure=true){
    // Абсолютный путь к рабочей директории:
    const workDir = path.resolve('.');

    // Абсолютный путь к исходному файлу srcFilePath.
    const srcPath = path.resolve(srcFilePath);
    
    // Проверим, что файл srcPath существует
    // и что это именно файл, а не папка.
    if (!fs.existsSync(srcPath)){
        throw `Файл или каталог ${srcPath} не существует.`
    }
    if (fs.statSync(srcPath).isDirectory()){
        throw `Требуется указать путь к файлу. Вы указали путь к каталогу "${srcPath}".`
    }

    // Мы не можем выходить за пределы рабочей директории при
    // включённой опции secure:
    const errMsg = 'Нельзя выходить за пределы рабочей директории. Если вы хотите разрешить выход за пределы рабочей директории, используйте опцию secure=false. Выключая опцию secure, вы снижаете безопасность работы программы.';

    if (secure && !srcPath.startsWith(workDir)){
        throw errMsg;
    }

    // Проверим, лежит ли исходный файл в корне рабочей
    // директории, или же находится в некоторой подпапке.
    let hasSubFolder = false;
    if (path.parse(srcFilePath).dir !== ''){
        hasSubFolder = true;
    }

    // Список выходных путей:
    let destPaths = [];

    if (typeof targetDirPaths === 'string'){
        targetDirPaths = [targetDirPaths];
    }
    for (const fpath of targetDirPaths){
        // Абсолютный путь к директории назначения.
        const destPath = path.resolve(fpath);

        // Проверим, что каталог destPath существует, и 
        // что это именно папка, а не файл
        if (!fs.existsSync(destPath)){
            throw `Файл или каталог ${destPath} не существует.`
        }
        if (!fs.statSync(destPath).isDirectory()){
            throw `Требуется указать путь к папке. Вы указали путь к файлу "${destPath}"`
        }

        // Мы не можем выйти за пределы рабочей директории
        // при включённой опции secure.
        if (secure && !destPath.startsWith(workDir)){
            throw errMsg;
        }

        // Сформируем выходной путь для файла.

        // Сколько элементов абсолютного пути следует пропустить
        // чтобы получить относительный путь относительно целевой папки.
        const ofs = workDir.split(path.sep).length + hasSubFolder;

        // Относительный путь относительно целевой папки.
        const relPath = srcPath.split(path.sep).slice(ofs).join(path.sep);

        // Итоговый выходной путь для файла или каталога
        destPaths.push(path.join(destPath, relPath));
    }
    return destPaths;
}

export default dest
