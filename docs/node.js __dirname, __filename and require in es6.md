# Как сделать __dirname, __filename и require в es6 на Node.js

## __filename

```js
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url);
```

## __dirname

```js
import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = dirname(fileURLToPath(import.meta.url))
```

## require

```js
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
```

## Источники:

1. [Node.js: Using __dirname and __filename with ES Modules](https://www.kindacode.com/article/node-js-using-__dirname-and-__filename-with-es-modules/)
2. [Node.js: How to Use “Import” and “Require” in the Same File](https://www.kindacode.com/article/node-js-how-to-use-import-and-require-in-the-same-file/)
