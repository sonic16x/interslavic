import {
  transliterateToLanguage,
} from './slavicTransliteration';

describe('slavicTransliteration', () => {
  describe('transliterateToLanguage', () => {
    test.each([
      // Search in Cyrillic languages - convert Latin input to target Cyrillic
      ['privet', 'ru', 'привет'],
      ['Moskva', 'ru', 'Москва'],
      ['horošo', 'ru', 'хорошо'],
      ['jožik', 'ru', 'јожик'],
      
      ['Ukrajina', 'uk', 'Украјина'],
      ['Kyiv', 'uk', 'Київ'],
      ['diďko', 'uk', 'дідько'],
      ['je', 'uk', 'је'],
      ['ji', 'uk', 'ји'],
      
      ['Srbija', 'sr', 'Србија'],
      ['đak', 'sr', 'ђак'],
      ['ljubav', 'sr', 'љубав'],
      ['njiva', 'sr', 'њива'],
      ['ćuprija', 'sr', 'ћуприја'],
      ['džem', 'sr', 'џем'],
      
      ['Makedonija', 'mk', 'Македонија'],
      ['gjavo', 'mk', 'ѓаво'],
      ['džvaka', 'mk', 'џвака'],
      ['ljubov', 'mk', 'љубов'],
      
      ['Belarus', 'be', 'Беларус'],
      ['ŭrad', 'be', 'ўрад'],
      
      ['Bălgarija', 'bg', 'България'],
      ['hăbav', 'bg', 'хъбав'],
      
      // Search in Latin languages - convert Cyrillic input to target Latin
      ['Далмација', 'hr', 'Dalmacija'],
      ['човјек', 'hr', 'čovjek'],
      ['љето', 'hr', 'ljeto'],
      ['њива', 'hr', 'njiva'],
      ['џем', 'hr', 'džem'],
      
      ['привет', 'pl', 'privet'],
      ['час', 'pl', 'czas'],
      ['школа', 'pl', 'szkoła'],
      ['жека', 'pl', 'rzeka'],
      
      ['честина', 'cs', 'čeština'],
      ['прибех', 'cs', 'příběh'],
      ['хлеба', 'cs', 'chleba'],
      
      ['словенчина', 'sk', 'slovenčina'],
      ['дьакуйем', 'sk', 'ďakujem'],
      ['хлиеб', 'sk', 'chlieb'],
      
      ['словенщина', 'sl', 'slovenščina'],
      ['чешња', 'sl', 'češnja'],
    ])('should convert %s to %s script for %s language', (input, targetLang, expected) => {
      expect(transliterateToLanguage(input, targetLang)).toBe(expected);
    });
  });

  describe('edge cases', () => {
    test.each([
      ['', 'ru', ''],
      ['123', 'ru', '123'],
      ['hello', 'unknown', 'hello'],
    ])('should handle edge case: "%s" for %s -> "%s"', (input, targetLang, expected) => {
      expect(transliterateToLanguage(input, targetLang)).toBe(expected);
    });
  });

  describe('non-Slavic languages should pass through unchanged', () => {
    test.each([
      // English
      ['hello world', 'en', 'hello world'],
      ['Hello World', 'en', 'Hello World'],
      ['привет', 'en', 'привет'], // Cyrillic in English should stay
      ['cześć', 'en', 'cześć'], // Latin with diacritics in English should stay
      
      // German  
      ['Guten Tag', 'de', 'Guten Tag'],
      ['Bücher', 'de', 'Bücher'],
      
      // French
      ['Bonjour', 'fr', 'Bonjour'],
      ['café', 'fr', 'café'],
      
      // Italian
      ['Ciao', 'it', 'Ciao'],
      ['città', 'it', 'città'],
      
      // Spanish
      ['Hola', 'es', 'Hola'],
      ['niño', 'es', 'niño'],
      
      // Any unknown language code
      ['test text', 'xyz', 'test text'],
      ['测试', 'zh', '测试'],
      ['テスト', 'ja', 'テスト'],
    ])('should not transliterate %s for %s language', (input, targetLang, expected) => {
      expect(transliterateToLanguage(input, targetLang)).toBe(expected);
    });
  });

  describe('case preservation', () => {
    test.each([
      ['PRIVET', 'ru', 'ПРИВЕТ'],
      ['Privet', 'ru', 'Привет'],
      ['СРБИЈА', 'hr', 'SRBIJA'],
      ['Србија', 'hr', 'Srbija'],
    ])('should preserve case: %s -> %s (%s)', (input, targetLang, expected) => {
      expect(transliterateToLanguage(input, targetLang)).toBe(expected);
    });
  });

  describe('digraph handling', () => {
    test.each([
      // Latin digraphs to Cyrillic
      ['ljubav', 'sr', 'љубав'],
      ['njiva', 'sr', 'њива'],
      ['džem', 'sr', 'џем'],
      ['chleb', 'ru', 'хлеб'],
      ['czas', 'ru', 'час'],
      ['szkoła', 'ru', 'школа'],
      
      // Cyrillic digraphs to Latin
      ['љето', 'hr', 'ljeto'],
      ['њива', 'hr', 'njiva'],
      ['џем', 'hr', 'džem'],
      ['школа', 'pl', 'szkoła'],
      ['час', 'cs', 'czas'],
    ])('should handle digraphs correctly: %s -> %s (%s)', (input, targetLang, expected) => {
      expect(transliterateToLanguage(input, targetLang)).toBe(expected);
    });
  });
}); 