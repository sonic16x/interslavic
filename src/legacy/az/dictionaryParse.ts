export const DictionaryParse = function (
    paradigms?: any,
    tags?: any,
    prefixes?: any,
    suffixes?: any,

    word?: any,
    paradigmIdx?: any,
    formIdx?: any,
    prefix?: any,
    suffix?: any,
) {
    this.paradigms = paradigms;
    this.tags = tags;
    this.prefixes = prefixes;
    this.suffixes = suffixes;

    this.word = word;
    this.paradigmIdx = paradigmIdx;
    this.paradigm = this.paradigms[paradigmIdx];
    this.formIdx = formIdx;
    this.formCnt = this.paradigm.length / 3;
    this.tag = this.tags[this.paradigm[this.formCnt + formIdx]];
    this.score = 1;
    this.prefix = prefix || '';
    this.suffix = suffix || '';
}

DictionaryParse.prototype.base = function () {
    if (this._base) {
        return this._base;
    }

    this._base = this.word.substring(
        this.prefixes[this.paradigm[(this.formCnt << 1) + this.formIdx]].length,
        this.word.length - this.suffixes[this.paradigm[this.formIdx]].length,
    );

    return this._base;
}

DictionaryParse.prototype.inflect = function (tag, grammemes) {
    if (!grammemes && typeof tag === 'number') {
        // Inflect to specific formIdx
        return new DictionaryParse(
            this.paradigms,
            this.tags,
            this.prefixes,
            this.suffixes,

            this.prefixes[this.paradigm[(this.formCnt << 1) + tag]] + this.base() + this.suffixes[this.paradigm[tag]],
            this.paradigmIdx,
            tag,
            this.prefix,
            this.suffix,
        );
    }

    for (var formIdx = 0; formIdx < this.formCnt; formIdx++) {
        if (this.tags[this.paradigm[this.formCnt + formIdx]].matches(tag, grammemes)) {
            return new DictionaryParse(
                this.paradigms,
                this.tags,
                this.prefixes,
                this.suffixes,

                this.prefixes[this.paradigm[(this.formCnt << 1) + formIdx]] + this.base() + this.suffixes[this.paradigm[formIdx]],
                this.paradigmIdx,
                formIdx,
                this.prefix,
                this.suffix,
            );
        }
    }

    return false;
}

DictionaryParse.prototype.toString = function () {
    if (this.prefix) {
        var pref = this.prefixes[this.paradigm[(this.formCnt << 1) + this.formIdx]];
        return pref + this.prefix + this.word.substr(pref.length) + this.suffix;
    } else {
        return this.word + this.suffix;
    }
}

DictionaryParse.prototype.normalize = function (keepPOS) {
    return this.inflect(keepPOS ? { POS: this.tag.POS } : 0);
}

DictionaryParse.prototype.pluralize = function (number) {
    if (!this.tag.NOUN && !this.tag.ADJF && !this.tag.PRTF) {
        return this;
    }

    if (typeof number == 'number') {
        number = number % 100;
        if ((number % 10 == 0) || (number % 10 > 4) || (number > 4 && number < 21)) {
            number = 'many';
        } else if (number % 10 == 1) {
            number = 'one';
        } else {
            number = 'few';
        }
    }

    if (this.tag.NOUN && !this.tag.nomn && !this.tag.accs) {
        return this.inflect([number == 'one' ? 'sing' : 'plur', this.tag.CAse]);
    } else if (number == 'one') {
        return this.inflect(['sing', this.tag.nomn ? 'nomn' : 'accs'])
    } else if (this.tag.NOUN && (number == 'few')) {
        return this.inflect(['sing', 'gent']);
    } else if ((this.tag.ADJF || this.tag.PRTF) && this.tag.femn && (number == 'few')) {
        return this.inflect(['plur', 'nomn']);
    } else {
        return this.inflect(['plur', 'gent']);
    }
}
