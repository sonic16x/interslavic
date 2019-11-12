export function toBCP47(code: string) {
  switch (code) {
    case 'isv': return 'art-x-isv';
    case 'sr': return 'sr-Cyrl';
    default: return code;
  }
}
