export enum SlavicLanguage {
  Belarusian = 'bel',
  Bosnian = 'bos',
  Bulgarian = 'bul',
  Croatian = 'hrv',
  Czech = 'ces',
  Kashubian = 'csb',
  LowerSorbian = 'dsb',
  Macedonian = 'mkd',
  Montenegrin = 'cnr',
  OldChurchSlavonic = 'chu',
  OldRussian = 'orv',
  Polabian = 'pox',
  Polish = 'pol',
  Russian = 'rus',
  Rusyn = 'rue',
  Serbian = 'srp',
  Silesian = 'sli',
  Slovak = 'slk',
  Slovenian = 'slv',
  Ukrainian = 'ukr',
  UpperSorbian = 'hsb',
}

export enum IntelligibilityLevel {
  Full = '+',
  Incomplete = '~',
  Disputed = '#',
  Other1 = '()',
  Unknown = '?',
}

export type IIntelligibilityReport = Partial<Record<SlavicLanguage, IntelligibilityLevel>>;

const BEFORE_PARENTHESES = /^([^(]*)/;
const OPEN_PARENTHESES = /\(([^)]+)\)/;

export function parseIntelligibility(encoded: string): IIntelligibilityReport {
  const [, beforeParentheses] = BEFORE_PARENTHESES.exec(encoded);
  const [, parenthesizedPart] = OPEN_PARENTHESES.exec(encoded) || [];

  return {
    ...parseIntellgibilityFragment(beforeParentheses),
    ...parseIntellgibilityFragment(parenthesizedPart, IntelligibilityLevel.Other1),
  };
}

function parseIntellgibilityFragment(encoded: string, override?: IntelligibilityLevel): IIntelligibilityReport {
  const result = {};
  if (!encoded) {
    return result;
  }

  const tokens = encoded.split(/\s+/);
  for (const token of tokens) {
    const stripped = token.replace(/[^a-z]/g, '');
    const symbols = token.replace(/[a-z]/g, '');

    const report = override
      ? expandRegionalTag(stripped, override)
      : expandRegionalToken(stripped, symbols);

    Object.assign(result, report);
  }

  return result;
}

function expandRegionalToken(tag: string, encodedIntelligibility: string): IIntelligibilityReport {
  switch (encodedIntelligibility) {
    case '~': return expandRegionalTag(tag, IntelligibilityLevel.Incomplete);
    case '#': return expandRegionalTag(tag, IntelligibilityLevel.Disputed);
    case '': return expandRegionalTag(tag, IntelligibilityLevel.Full);
    default: return expandRegionalTag(tag, IntelligibilityLevel.Unknown);
  }
}

function expandRegionalTag(tag: string, intelligibility: IntelligibilityLevel): IIntelligibilityReport {
  const L = SlavicLanguage;

  switch (tag) {
    case 'v': // Eastern Slavic langauges
      return reportFragment(
        intelligibility,
        L.Russian,
        L.Belarusian,
        L.Ukrainian,
        L.Rusyn,
        L.OldChurchSlavonic,
        L.OldRussian,
      );
    case 'ru':
      return reportFragment(intelligibility, L.Russian);
    case 'be':
      return reportFragment(intelligibility, L.Belarusian);
    case 'uk':
      return reportFragment(intelligibility, L.Ukrainian);
    case 'rue':
      return reportFragment(intelligibility, L.Rusyn);
    case 'cu':
      return reportFragment(intelligibility, L.OldChurchSlavonic);
    case 'ub':
      return reportFragment(intelligibility, L.Ukrainian, L.Belarusian);

    case 'z': // Western Slavic languages
      return reportFragment(
        intelligibility,
        L.Polish,
        L.Slovak,
        L.Czech,
        L.Polabian,
        L.Kashubian,
        L.Silesian,
        L.UpperSorbian,
        L.LowerSorbian,
      );
    case 'pl':
      return reportFragment(intelligibility, L.Polish);
    case 'sk':
      return reportFragment(intelligibility, L.Slovak);
    case 'cz':
      return reportFragment(intelligibility, L.Czech);
    case 'cs':
      return reportFragment(intelligibility, L.Czech, L.Slovak);
    case 'csb':
      return reportFragment(intelligibility, L.Kashubian);
    case 'dsb':
      return reportFragment(intelligibility, L.LowerSorbian);
    case 'hsb':
      return reportFragment(intelligibility, L.UpperSorbian);
    case 'sb':
      return reportFragment(intelligibility, L.LowerSorbian, L.UpperSorbian);

    case 'j': // Southern Slavic Languages
      return reportFragment(
        intelligibility,
        L.Bulgarian,
        L.Macedonian,
        L.Bosnian,
        L.Croatian,
        L.Montenegrin,
        L.Serbian,
        L.Slovenian,
      );
    case 'bg':
      return reportFragment(intelligibility, L.Bulgarian);
    case 'mk':
      return reportFragment(intelligibility, L.Macedonian);
    case 'sr':
      return reportFragment(intelligibility, L.Serbian);
    case 'hr':
      return reportFragment(intelligibility, L.Croatian);
    case 'sl':
      return reportFragment(intelligibility, L.Slovenian);
    case 'bm':
      return reportFragment(intelligibility, L.Bulgarian, L.Macedonian);
    case 'yu':
      return reportFragment(intelligibility, L.Slovenian, L.Croatian, L.Serbian, L.Bosnian, L.Montenegrin);
    case 'sh':
      return reportFragment(intelligibility, L.Serbian, L.Croatian, L.Bosnian, L.Montenegrin);

    case 'ps': // Praslovjansky
      return reportFragment(intelligibility,
        L.Polish,
        L.Slovak,
        L.Czech,
        L.Polabian,
        L.Kashubian,
        L.Silesian,
        L.UpperSorbian,
        L.LowerSorbian,
        L.Bulgarian,
        L.Macedonian,
        L.Bosnian,
        L.Croatian,
        L.Serbian,
        L.Slovenian,
        L.Russian,
        L.Belarusian,
        L.Ukrainian,
        L.Rusyn,
        L.OldChurchSlavonic,
        L.OldRussian,
      );
    default:
      // Slovio, Novoslovienskij, Slovioski, ...
      // 'sx', 'n', 'ns', 'i', 'ij', 'in', 'iw', 'iz', 'jc', 'jn', 're'
      return reportFragment(intelligibility);
  }
}

function reportFragment(value: IntelligibilityLevel, ...langs: SlavicLanguage[]): IIntelligibilityReport {
  const result = {};

  for (const lang of langs) {
    result[lang] = value;
  }

  return result;
}
