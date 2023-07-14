import { transliterate } from '@interslavic/utils';

export function latinToIpa(text: string) {
    return transliterate(text, 'art-x-interslv-fonipa');
}
