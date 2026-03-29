import { Dawg } from './dawg';
import { Tag } from './tag';
import { getParsers } from './parsers';

const defaults = {
    ignoreCase: true,
    parsers: [
        'Dictionary?',
        'PrefixKnown',
        'PrefixUnknown?',
        'SuffixKnown?',
    ],
    forceParse: false,
    normalizeScore: true
};

export class AzClass {
    private initialized: boolean;
    private knownPrefixes: string[];
    private prefixes: string[];
    private particles: string[];
    private replacements?: string[][];
    private words: Dawg;
    private predictionSuffixes: Dawg[];
    private probabilities?: Dawg;
    private grammemes: {
        [key: string]: {
            internal: string,
            parent: string,
            external: string,
            externalFull: string,
        },
    };
    private tags;
    private config;
    private suffixes: string[];
    private paradigms: Uint16Array[];
    private parsers;

    public init(files) {
        this.initialized = false;

        this.knownPrefixes = files['config.json'].knownPrefixes;
        this.prefixes = files['config.json'].prefixes;
        this.particles = files['config.json'].particles;
        this.replacements = files['config.json'].replacements;

        this.words = new Dawg(files['words.dawg'], 'words');

        this.predictionSuffixes = new Array(3);

        for (let prefix = 0; prefix < 3; prefix++) {
            this.predictionSuffixes[prefix] = new Dawg(files[`prediction-suffixes-${prefix}.dawg`], 'probs');
        }

        if (files['p_t_given_w.intdawg']) {
            this.probabilities = new Dawg(files['p_t_given_w.intdawg'], 'int');
        }

        this.grammemes = {};

        const grammemesJson = files['grammemes.json'];

        this.grammemes = grammemesJson.reduce((all, [internal, parent, external, externalFull]) => {
            const grammeme = {
                internal, parent, external, externalFull,
            };

            return {
                ...all,
                [internal]: grammeme,
                [external]: grammeme,
            };
        }, {});

        this.tags = files['gramtab-opencorpora-int.json'].map((tag) => new Tag(this.grammemes, tag));
        this.suffixes = files['suffixes.json'];

        const list = new Uint16Array(files['paradigms.array']);
        const count = list[0];
        let pos = 1;

        this.paradigms = [];
        for (let i = 0; i < count; i++) {
            const size = list[pos++];

            this.paradigms.push(list.subarray(pos, pos + size));
            pos += size;
        }

        this.parsers = getParsers(
            this.words,
            this.paradigms,
            this.tags,
            this.prefixes,
            this.suffixes,
            this.predictionSuffixes,
            this.replacements,
            this.particles,
            this.knownPrefixes,
        );

        this.initialized = true;

        return this;
    }

    public morph(word, config) {
        if (!this.initialized) {
            throw new Error('Please call Az.Morph.init() before using this module.');
        }

        this.config = config ? Object.assign(defaults, config) : defaults;

        var parses = [];
        var matched = false;
        for (var i = 0; i < this.config.parsers.length; i++) {
            var name = this.config.parsers[i];
            var terminal = name[name.length - 1] != '?';
            name = terminal ? name : name.slice(0, -1);

            var vars = this.parsers[name](word, this.config);
            for (var j = 0; j < vars.length; j++) {
                vars[j].parser = name;
                matched = true;
            }

            parses = parses.concat(vars);
            if (matched && terminal) {
                break;
            }
        }

        let total = 0;
        for (let i = 0; i < parses.length; i++) {
            if (parses[i].parser == 'Dictionary') {
                const rawScore = this.probabilities?.getInt(parses[i] + ':' + parses[i].tag);

                if (typeof rawScore !== undefined) {
                    parses[i].score = rawScore / 1000000;
                    total += parses[i].score;
                } else {
                    parses[i].score = 1;
                    total += parses[i].score;
                }
            }
        }

        // Normalize Dictionary & non-Dictionary scores separately
        if (this.config.normalizeScore) {
            if (total > 0) {
                for (var i = 0; i < parses.length; i++) {
                    if (parses[i].parser == 'Dictionary') {
                        parses[i].score /= total;
                    }
                }
            }

            total = 0;
            for (var i = 0; i < parses.length; i++) {
                if (parses[i].parser != 'Dictionary') {
                    total += parses[i].score;
                }
            }
            if (total > 0) {
                for (var i = 0; i < parses.length; i++) {
                    if (parses[i].parser != 'Dictionary') {
                        parses[i].score /= total;
                    }
                }
            }
        }

        parses.sort( (a, b) => b.score - a.score);

        return parses;
    }
}

let instance;

function getInstance() {
    if (!instance) {
        instance = new AzClass();
    }

    return instance;
}

export const Az = getInstance();
