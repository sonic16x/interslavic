import { getIntelligibilityMarks, IntelligibilityMark } from './intelligibilityMarks'

/**
 * How much every language weighs, 6 points in total:
 *
 *     ru = pl = be + uk = cs + sk = bg + mk = sl + sr + hr = 1 point
 *
 * which gives 2 points to each of the three groups - western, southern
 * and eastern.
 */
const LANGUAGE_WEIGHTS: Record<string, number> = {
    ru: 1,
    be: 0.5,
    uk: 0.5,
    pl: 1,
    cs: 0.5,
    sk: 0.5,
    bg: 0.5,
    mk: 0.5,
    sl: 0.5,
    sr: 0.25,
    hr: 0.25,
}

const ALL_LANGUAGES = Object.keys(LANGUAGE_WEIGHTS)

/**
 * How much of a language is lost to every mark: `-` loses it completely,
 * `~` loses a half of it, `+` loses nothing.
 */
const MARK_LOSS: Record<IntelligibilityMark, number> = {
    '+': 0,
    '~': 0.5,
    '-': 1,
}

export interface IUnintelligibility {
    /**
     * The weight of the languages the word is not intelligible in.
     */
    lost: number;
    /**
     * The weight of all the languages taken into account.
     */
    total: number;
    /**
     * How many of them have a problem, `-` and `~` alike.
     */
    issues: number;
}

/**
 * Weighs the languages the word is not intelligible in, against all the
 * languages it is judged by - the target ones when they are selected, all
 * of them otherwise. Languages without a mark still count towards the total,
 * but they add nothing to the loss: a missing mark is not held against the word.
 */
export function estimateUnintelligibility(sameInLanguages: string, targetLangs: string[] = []): IUnintelligibility {
    const marks = getIntelligibilityMarks(sameInLanguages)
    const langs = targetLangs.length ? targetLangs : ALL_LANGUAGES

    return langs.reduce<IUnintelligibility>((acc, lang) => {
        const weight = LANGUAGE_WEIGHTS[lang]
        if (!weight) {
            return acc
        }

        const loss = MARK_LOSS[marks[lang]] || 0

        return {
            lost: acc.lost + weight * loss,
            total: acc.total + weight,
            issues: acc.issues + (loss > 0 ? 1 : 0),
        }
    }, { lost: 0, total: 0, issues: 0 })
}
