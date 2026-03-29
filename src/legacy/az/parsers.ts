import { DictionaryParse } from "./dictionaryParse";

export function getParsers(
    words,
    paradigms,
    tags,
    prefixes,
    suffixes,
    predictionSuffixes,
    replacements,
    particles,
    knownPrefixes,
) {
    const Parsers: any = {}

    Parsers.Dictionary = function (word, config) {
        var isCapitalized =
            !config.ignoreCase && word.length &&
            (word[0].toLocaleLowerCase() != word[0]) &&
            (word.substr(1).toLocaleUpperCase() != word.substr(1));
        word = word.toLocaleLowerCase();

        var opts = words.findAll(word,replacements);

        var vars = [];
        for (var i = 0; i < opts.length; i++) {
            for (var j = 0; j < opts[i][1].length; j++) {
                var w = new DictionaryParse(
                    paradigms,
                    tags,
                    prefixes,
                    suffixes,
                    opts[i][0],
                    opts[i][1][j][0],
                    opts[i][1][j][1],
                );
                if (config.ignoreCase || !w.tag.isCapitalized() || isCapitalized) {
                    vars.push(w);
                }
            }
        }
        return vars;
    }

    Parsers.PrefixKnown = function (word, config) {
        var isCapitalized =
            !config.ignoreCase && word.length &&
            (word[0].toLocaleLowerCase() != word[0]) &&
            (word.substr(1).toLocaleUpperCase() != word.substr(1));
        word = word.toLocaleLowerCase();
        var parses = [];
        for (var i = 0; i < knownPrefixes.length; i++) {
            if (word.length - knownPrefixes[i].length < 3) {
                continue;
            }

            if (word.substr(0, knownPrefixes[i].length) == knownPrefixes[i]) {
                var end = word.substr(knownPrefixes[i].length);
                var right = Parsers.Dictionary(end, config);
                for (var j = 0; j < right.length; j++) {
                    if (!right[j].tag.isProductive()) {
                        continue;
                    }
                    if (!config.ignoreCase && right[j].tag.isCapitalized() && !isCapitalized) {
                        continue;
                    }
                    right[j].score *= 0.7;
                    right[j].prefix = knownPrefixes[i];
                    parses.push(right[j]);
                }
            }
        }
        return parses;
    }

    Parsers.PrefixUnknown = function (word, config) {
        var isCapitalized =
            !config.ignoreCase && word.length &&
            (word[0].toLocaleLowerCase() != word[0]) &&
            (word.substr(1).toLocaleUpperCase() != word.substr(1));
        word = word.toLocaleLowerCase();
        var parses = [];
        for (var len = 1; len <= 5; len++) {
            if (word.length - len < 3) {
                break;
            }
            var end = word.substr(len);
            var right = Parsers.Dictionary(end, config);
            for (var j = 0; j < right.length; j++) {
                if (!right[j].tag.isProductive()) {
                    continue;
                }
                if (!config.ignoreCase && right[j].tag.isCapitalized() && !isCapitalized) {
                    continue;
                }
                right[j].score *= 0.3;
                right[j].prefix = word.substr(0, len);
                parses.push(right[j]);
            }
        }
        return parses;
    }

    // Отличие от предсказателя по суффиксам в pymorphy2: найдя подходящий суффикс, проверяем ещё и тот, что на символ короче
    Parsers.SuffixKnown = function (word, config) {
        if (word.length < 4) {
            return [];
        }
        var isCapitalized =
            !config.ignoreCase && word.length &&
            (word[0].toLocaleLowerCase() != word[0]) &&
            (word.substr(1).toLocaleUpperCase() != word.substr(1));
        word = word.toLocaleLowerCase();
        var parses = [];
        var minlen = 1;
        var coeffs = [0, 0.2, 0.3, 0.4, 0.5, 0.6];
        var used = {};
        for (var i = 0; i < prefixes.length; i++) {
            if (prefixes[i].length && (word.substr(0, prefixes[i].length) != prefixes[i])) {
                continue;
            }
            var base = word.substr(prefixes[i].length);
            for (var len = 5; len >= minlen; len--) {
                if (len >= base.length) {
                    continue;
                }
                var left = base.substr(0, base.length - len);
                var right = base.substr(base.length - len);
                var entries = predictionSuffixes[i].findAll(right, replacements, 0, 0);
                if (!entries) {
                    continue;
                }

                var p = [];
                var max = 1;
                for (var j = 0; j < entries.length; j++) {
                    var suffix = entries[j][0];
                    var stats = entries[j][1];

                    for (var k = 0; k < stats.length; k++) {
                        var parse = new DictionaryParse(
                            paradigms,
                            tags,
                            prefixes,
                            suffixes,
                            prefixes[i] + left + suffix,
                            stats[k][1],
                            stats[k][2],
                            );
                        // Why there is even non-productive forms in suffix DAWGs?
                        if (!parse.tag.isProductive()) {
                            continue;
                        }
                        if (!config.ignoreCase && parse.tag.isCapitalized() && !isCapitalized) {
                            continue;
                        }
                        var key = parse.toString() + ':' + stats[k][1] + ':' + stats[k][2];
                        if (key in used) {
                            continue;
                        }
                        max = Math.max(max, stats[k][0]);
                        parse.score = stats[k][0] * coeffs[len];
                        p.push(parse);
                        used[key] = true;
                    }
                }
                if (p.length > 0) {
                    for (var j = 0; j < p.length; j++) {
                        p[j].score /= max;
                    }
                    parses = parses.concat(p);
                    // Check also suffixes 1 letter shorter
                    minlen = Math.max(len - 1, 1);
                }
            }
        }
        return parses;
    }

    return Parsers;
}
