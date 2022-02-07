# Журнал изменений

## Версия 0.1.0 2022-02-07

1. Реализован компонент для ввода пользователем диапазона времени (часы и минуты) в поле ввода. Данный компонент распознаёт типичные ошибки и выводит человекопонятные сообщения, где именно произошла ошибка и в чём она заключается. Файлы:
    * `src/timeTools.js`,
    * `src/script.js`.

2. Модульная реализация самописного сборщика сайта devtools (см. файлы в папке `tools`). Особенностью реализации является то, что файлы отдельных задач могут как запускаться независимо, так и импортироваться и использоваться в составе составных задач (см. `tools/tasks/bild.js` и `tools/tasks/dev.js`).
<br><br>
На текущий момент времени задачи используют синхронный режим работы. Этого пока более, чем достаточно в плане скорости работы. В планах переписать часть задач на использование потоков Node.js.

3. Реализованы модульные тесты с использованием фреймворка [`Mocha.js`](https://mochajs.org/). См. файлы в папке `tests` и файл `tools/tasks/runTests.js`.