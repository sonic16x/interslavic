import { getLatin } from '../getLatin/getLatin'

import { distance, LANGS } from '@interslavic/levenshtein'

type SupportedLang = (typeof LANGS)[number]

const isSupported = (lang: string): lang is SupportedLang => (LANGS as readonly string[]).includes(lang)

/**
 * Translation variants of one language: "car (n.), automobile; auto" -> [car, automobile, auto];
 * phrases only for a phrase lemma ("morska trava" ~ "морская водоросль"), a word is not compared to an explanation.
 */
function variants(translations: string, phrases = false): string[] {
    return translations
        .replace(/\s*[([{][^)\]}]*[)\]}]/g, '')
        .split(/[,;]/)
        .map((s) => s.trim())
        .filter((s) => s && (phrases || !s.includes(' ')))
}

/** "!kot (m.), kotka" -> [kot, kotka]: the lemmas of an isv cell, row marks and brackets dropped. */
export function splitLemmas(isv: string): string[] {
    return isv
        .replace(/^[!#]+/, '')
        .replace(/\s*(\([^)]*\)|\[[^\]]*\])/g, '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
}

/** Join key with slovosbor: standard isv-Latn (tvrđa = tvrdža), no diacritics, no punctuation ("Dobry dėnj!"). */
export function foldLemma(lemma: string): string {
    return getLatin(lemma, '3').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
        .replace(/[^\p{L}\s]+/gu, ' ').replace(/\s+/g, ' ').trim()
}

/** The language a reader of a result understands: the non-isv side of the search. */
export function readerLang({ from, to }: { from: string; to: string }): string {
    return from === 'isv' ? to : from
}

/** Translations closer than this are cognates of the lemma. NOTE: set by hand; recalibrate on a labelled set. */
export const COGNATE_DISTANCE = 0.35

/** Translations farther than this are likely unintelligible. */
export const UNRELATED_DISTANCE = 0.65

/** ✅ / ⚠️ / 🚫 for a lemma in `lang` by distance to its closest translation; '' when unknown. */
export function lemmaMark(lemma: string, translations: string, lang: string): string {
    const d = lemmaDistance(lemma, translations, lang)
    if (d === null) { return '' }

    return d <= COGNATE_DISTANCE ? '✅' : d <= UNRELATED_DISTANCE ? '⚠️' : '🚫'
}

/** The translation in `lang` closest to a lemma, or null when it cannot be told. */
export function closestTranslation(
    lemma: string, translations: string, lang: string,
): { word: string; distance: number } | null {
    if (!isSupported(lang)) { return null }

    return variants(translations.replace(/^!/, ''), lemma.includes(' '))
        .map((word) => ({ word, distance: distance(word, lang, lemma) }))
        .reduce((best, x) => (!best || x.distance < best.distance ? x : best), null)
}

/** Distance from a lemma to the closest translation in `lang`, or null when it cannot be told. */
export function lemmaDistance(lemma: string, translations: string, lang: string): number | null {
    return closestTranslation(lemma, translations, lang)?.distance ?? null
}

/**
 * Order of lemma indices for a reader of `lang`: the closest lemma first, ties and unknowns keep the row order.
 * One metric behind one function: its inside can change without touching the UI.
 */
export function rankLemmas(lemmas: string[], translations: string, lang: string): number[] {
    const dist = lemmas.map((lemma) => lemmaDistance(lemma, translations, lang))
    
    return lemmas
        .map((_, i) => i)
        .sort((a, b) => (dist[a] ?? Infinity) - (dist[b] ?? Infinity) || a - b)
}
