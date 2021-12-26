import { addLangs, langs, wordErrorsTypes, wordErrorTextMaxLength } from 'consts';

export function validateData(data) {
    const captchaTokenIsOk = typeof data.captchaToken === 'string' && data.captchaToken.length !== 0;
    const clientIdIsOk = typeof data.clientId === 'string' && data.clientId.length === 32;
    const errorTypeIsOk = wordErrorsTypes.includes(data.errorType);
    const textIsOk = typeof data.text === 'string' && data.text.length > 0 && data.text.length <= wordErrorTextMaxLength;
    const wordIdIsOk = typeof data.wordId === 'string' && data.wordId.length > 0;
    const isvWord = typeof data.isvWord === 'string' && data.isvWord.length > 0;
    const translatedWordIsOk = typeof data.translatedWord === 'string' && data.translatedWord.length > 0;

    const validLangs: string[] = [
        'en',
        ...langs,
        ...addLangs,
    ].reduce((acc, lang) => [...acc, `isv-${lang}`, `${lang}-isv`], []);

    const langIsOk = data.lang && validLangs.includes(data.lang);

    return captchaTokenIsOk && clientIdIsOk && errorTypeIsOk && textIsOk && wordIdIsOk && isvWord && translatedWordIsOk && langIsOk;
}
