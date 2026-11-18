import { ITranslateResult } from 'services'

interface IWordStatus {
    icon: string;
    text: string;
}

export const getWordStatus = (item: ITranslateResult): IWordStatus | undefined => {
    if (item.remove) {
        return {
            icon: '⛔️',
            text: 'suggestedForRemoval',
        }
    }

    if (item.new) {
        return {
            icon: '🌱',
            text: 'suggestedNewWord',
        }
    }
}
