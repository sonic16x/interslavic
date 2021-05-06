export const tableStrToArray = (str) => str
    .replace(/#/g, '')
    .replace(/\r/g, '')
    .split(/\n|\t/)
    .map((l) => l.trim())
;
