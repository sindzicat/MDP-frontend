import path from 'path';

export function subPath(fpath, workDir=undefined){
    let p = path.resolve(fpath).replace(workDir || path.resolve('.'), '');
    if (p.startsWith(path.sep)){
        p = p.slice(1);
    }
    if (p.includes(path.sep)){
        p = p
            .split(path.sep)
            .splice(1)
            .join('/')
    }
    return p;
}

export default subPath;