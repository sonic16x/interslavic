function createReplacer(map: Record<string, string>) {
  let maxLength = 1;
  for (const key of Object.keys(map)) {
    maxLength = Math.max(maxLength, key.length);
  }

  function remapText(str: string) {
    let result = '';
    for (let i = 0; i < str.length; i++) {
      let matched = false;
      for (let l = maxLength; l >= 1; l--) {
        const chunk = str.slice(i, i + l);
        const replacement = map[chunk];
        if (replacement !== undefined) {
          result += replacement;
          i += l - 1;
          matched = true;
          break;
        }
      }
      if (!matched) {
        result += str[i];
      }
    }
    return result;
  }

  return remapText;
}

function invertMapping(map: Record<string, string>): Record<string, string> {
  const inverted: Record<string, string> = {};
  for (const [key, value] of Object.entries(map)) {
    inverted[value] = key;
  }
  return inverted;
}

// Base Cyrillic to Latin mapping (covers most Slavic languages)
const baseCyrillicToLatinMap = {
  // Standard Cyrillic letters
  'а': 'a', 'А': 'A',
  'б': 'b', 'Б': 'B',
  'в': 'v', 'В': 'V',
  'г': 'g', 'Г': 'G',
  'д': 'd', 'Д': 'D',
  'е': 'e', 'Е': 'E',
  'ж': 'ž', 'Ж': 'Ž',
  'з': 'z', 'З': 'Z',
  'и': 'i', 'И': 'I',
  'й': 'j', 'Й': 'J',
  'к': 'k', 'К': 'K',
  'л': 'l', 'Л': 'L',
  'м': 'm', 'М': 'M',
  'н': 'n', 'Н': 'N',
  'о': 'o', 'О': 'O',
  'п': 'p', 'П': 'P',
  'р': 'r', 'Р': 'R',
  'с': 's', 'С': 'S',
  'т': 't', 'Т': 'T',
  'у': 'u', 'У': 'U',
  'ф': 'f', 'Ф': 'F',
  'х': 'h', 'Х': 'H',
  'ц': 'c', 'Ц': 'C',
  'ч': 'č', 'Ч': 'Č',
  'ш': 'š', 'Ш': 'Š',
  'щ': 'šč', 'Щ': 'Šč',
  'ь': 'ь', 'Ь': 'Ь', // Soft sign preserved for special handling
  'ы': 'y', 'Ы': 'Y',
  'э': 'e', 'Э': 'E',
  'ю': 'ju', 'Ю': 'Ju',
  'я': 'ja', 'Я': 'Ja',
};

// Language-specific mappings
const languageSpecificMaps = {
  // Russian specific
  ru: {
    'ё': 'jo', 'Ё': 'Jo',
    'ъ': '', 'Ъ': '', // Hard sign usually omitted
  },
  
  // Ukrainian specific  
  uk: {
    'є': 'je', 'Є': 'Je',
    'і': 'i', 'І': 'I',
    'ї': 'ji', 'Ї': 'Ji', 
    'ґ': 'g', 'Ґ': 'G',
    'ё': 'jo', 'Ё': 'Jo', // Sometimes used
  },
  
  // Belarusian specific
  be: {
    'ё': 'jo', 'Ё': 'Jo',
    'і': 'i', 'І': 'I',
    'ў': 'ŭ', 'Ў': 'Ŭ',
    'ъ': '', 'Ъ': '',
  },
  
  // Bulgarian specific
  bg: {
    'ъ': 'ă', 'Ъ': 'Ă',
    'ю': 'ju', 'Ю': 'Ju',
    'я': 'ja', 'Я': 'Ja',
  },
  
  // Macedonian specific
  mk: {
    'ѓ': 'gj', 'Ѓ': 'Gj',
    'ѕ': 'dz', 'Ѕ': 'Dz', 
    'ј': 'j', 'Ј': 'J',
    'љ': 'lj', 'Љ': 'Lj',
    'њ': 'nj', 'Њ': 'Nj',
    'ќ': 'kj', 'Ќ': 'Kj',
    'џ': 'dž', 'Џ': 'Dž',
  },
  
  // Serbian specific (Cyrillic)
  sr: {
    'ђ': 'đ', 'Ђ': 'Đ',
    'ј': 'j', 'Ј': 'J',
    'љ': 'lj', 'Љ': 'Lj',
    'њ': 'nj', 'Њ': 'Nj',
    'ћ': 'ć', 'Ћ': 'Ć',
    'џ': 'dž', 'Џ': 'Dž',
  },
};

// Create combined mappings for each Cyrillic language
const cyrillicToLatinMaps = {
  ru: { ...baseCyrillicToLatinMap, ...languageSpecificMaps.ru },
  uk: { ...baseCyrillicToLatinMap, ...languageSpecificMaps.uk },
  be: { ...baseCyrillicToLatinMap, ...languageSpecificMaps.be },
  bg: { ...baseCyrillicToLatinMap, ...languageSpecificMaps.bg },
  mk: { ...baseCyrillicToLatinMap, ...languageSpecificMaps.mk },
  sr: { ...baseCyrillicToLatinMap, ...languageSpecificMaps.sr },
};

// Base Latin to Cyrillic (reverse of base mapping)
const baseLatinToCyrillicMap = invertMapping(baseCyrillicToLatinMap);

// Latin script language specific adjustments
const latinLanguageAdjustments = {
  // Polish specific
  pl: {
    'ą': 'а̨', 'Ą': 'А̨',
    'ć': 'ць', 'Ć': 'Ць', 
    'ę': 'е̨', 'Ę': 'Е̨',
    'ł': 'л', 'Ł': 'Л',
    'ń': 'нь', 'Ń': 'Нь',
    'ó': 'о', 'Ó': 'О',
    'ś': 'сь', 'Ś': 'Сь',
    'ź': 'зь', 'Ź': 'Зь',
    'ż': 'ж', 'Ż': 'Ж',
    // Digraphs
    'ch': 'х', 'Ch': 'Х', 'CH': 'Х',
    'cz': 'ч', 'Cz': 'Ч', 'CZ': 'Ч',
    'dz': 'ѕ', 'Dz': 'Ѕ', 'DZ': 'Ѕ',
    'dż': 'џ', 'Dż': 'Џ', 'DŻ': 'Џ',
    'rz': 'ж', 'Rz': 'Ж', 'RZ': 'Ж',
    'sz': 'ш', 'Sz': 'Ш', 'SZ': 'Ш',
  },
  
  // Czech specific
  cs: {
    'á': 'а', 'Á': 'А',
    'č': 'ч', 'Č': 'Ч', 
    'ď': 'дь', 'Ď': 'Дь',
    'é': 'е', 'É': 'Е',
    'ě': 'е', 'Ě': 'Е',
    'í': 'и', 'Í': 'И',
    'ň': 'нь', 'Ň': 'Нь',
    'ó': 'о', 'Ó': 'О',
    'ř': 'рж', 'Ř': 'Рж',
    'š': 'ш', 'Š': 'Ш',
    'ť': 'ть', 'Ť': 'Ть',
    'ú': 'у', 'Ú': 'У',
    'ů': 'у', 'Ů': 'У',
    'ý': 'ы', 'Ý': 'Ы',
    'ž': 'ж', 'Ž': 'Ж',
    // Digraphs
    'ch': 'х', 'Ch': 'Х', 'CH': 'Х',
  },
  
  // Slovak specific  
  sk: {
    'á': 'а', 'Á': 'А',
    'ä': 'а', 'Ä': 'А',
    'č': 'ч', 'Č': 'Ч',
    'ď': 'дь', 'Ď': 'Дь', 
    'é': 'е', 'É': 'Е',
    'í': 'и', 'Í': 'И',
    'ĺ': 'ль', 'Ĺ': 'Ль',
    'ľ': 'ль', 'Ľ': 'Ль',
    'ň': 'нь', 'Ň': 'Нь',
    'ó': 'о', 'Ó': 'О',
    'ô': 'уо', 'Ô': 'Уо',
    'ŕ': 'рь', 'Ŕ': 'Рь',
    'š': 'ш', 'Š': 'Ш',
    'ť': 'ть', 'Ť': 'Ть',
    'ú': 'у', 'Ú': 'У',
    'ý': 'ы', 'Ý': 'Ы',
    'ž': 'ж', 'Ž': 'Ж',
    // Digraphs  
    'ch': 'х', 'Ch': 'Х', 'CH': 'Х',
    'dz': 'ѕ', 'Dz': 'Ѕ', 'DZ': 'Ѕ',
    'dž': 'џ', 'Dž': 'Џ', 'DŽ': 'Џ',
  },
  
  // Croatian specific
  hr: {
    'č': 'ч', 'Č': 'Ч',
    'ć': 'ћ', 'Ć': 'Ћ',
    'đ': 'ђ', 'Đ': 'Ђ',
    'š': 'ш', 'Š': 'Ш',
    'ž': 'ж', 'Ž': 'Ж',
    // Digraphs
    'dž': 'џ', 'Dž': 'Џ', 'DŽ': 'Џ',
    'lj': 'љ', 'Lj': 'Љ', 'LJ': 'Љ',
    'nj': 'њ', 'Nj': 'Њ', 'NJ': 'Њ',
  },
  
  // Slovenian specific
  sl: {
    'č': 'ч', 'Č': 'Ч',
    'š': 'ш', 'Š': 'Ш', 
    'ž': 'ж', 'Ž': 'Ж',
  },
};

// Create combined Latin to Cyrillic mappings
const latinToCyrillicMaps = {
  pl: { ...baseLatinToCyrillicMap, ...latinLanguageAdjustments.pl },
  cs: { ...baseLatinToCyrillicMap, ...latinLanguageAdjustments.cs },
  sk: { ...baseLatinToCyrillicMap, ...latinLanguageAdjustments.sk },
  hr: { ...baseLatinToCyrillicMap, ...latinLanguageAdjustments.hr },
  sl: { ...baseLatinToCyrillicMap, ...latinLanguageAdjustments.sl },
};

// Create converter functions for each language
const cyrillicConverters = Object.fromEntries(
  Object.entries(cyrillicToLatinMaps).map(([lang, map]) => [
    lang, 
    createReplacer(map)
  ])
);

const latinConverters = Object.fromEntries(
  Object.entries(latinToCyrillicMaps).map(([lang, map]) => [
    lang,
    createReplacer(map)
  ])
);

// Language categories
const cyrillicLanguages = ['ru', 'uk', 'be', 'bg', 'mk', 'sr'];
const latinLanguages = ['pl', 'cs', 'sk', 'hr', 'sl'];

/**
 * Main transliteration function - converts input text to target language's script
 */
export function transliterateToLanguage(text: string, targetLang: string): string {
  if (!text) return text;
  
  // If target language uses Cyrillic script
  if (cyrillicLanguages.includes(targetLang)) {
    // Convert any Latin input to this language's Cyrillic
    return latinConverters[targetLang] ? 
      createReplacer(invertMapping(cyrillicToLatinMaps[targetLang]))(text) : 
      text;
  }
  
  // If target language uses Latin script
  if (latinLanguages.includes(targetLang)) {
    // Convert any Cyrillic input to this language's Latin
    return cyrillicConverters[targetLang] ? 
      createReplacer(invertMapping(latinToCyrillicMaps[targetLang]))(text) :
      text;
  }
  
  return text;
}