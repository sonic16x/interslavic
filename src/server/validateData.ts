import { wordErrorsTypes, wordErrorTextMaxLength } from 'consts'

import { validateLang } from 'utils'

export function validateData(data) {
    const captchaTokenIsOk = typeof data.captchaToken === 'string' && data.captchaToken.length !== 0
    const clientIdIsOk = typeof data.clientId === 'string' && data.clientId.length === 32
    const errorTypeIsOk = wordErrorsTypes.includes(data.errorType)
    const textIsOk = typeof data.text === 'string' &&
        data.text.length > 0 &&
        data.text.length <= wordErrorTextMaxLength
    
    const wordIdIsOk = typeof data.wordId === 'string' && data.wordId.length > 0
    const isvWord = typeof data.isvWord === 'string' && data.isvWord.length > 0
    const translatedWordIsOk = typeof data.translatedWord === 'string' && data.translatedWord.length > 0
    const langIsOk = validateLang(data.lang)

    return [
        captchaTokenIsOk,
        clientIdIsOk,
        errorTypeIsOk,
        textIsOk,
        wordIdIsOk,
        isvWord,
        translatedWordIsOk,
        langIsOk
    ].every(Boolean)
}
