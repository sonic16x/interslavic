import { tableColumnsLetters } from 'consts';

export const getHeaderMap = (line) => new Map(line.map((field, i) => [field, tableColumnsLetters[i]]));
