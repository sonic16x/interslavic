import { readStringMapDawg, readByteCompletionDawg } from 'dawgjs/factories';
import { encodeUtf8 } from 'dawgjs/codec';

export class Dawg {
    private format;
    private dawgjs;

    constructor(buffer, format) {
        this.format = format;

        if (format === 'words') {
            this.dawgjs = readStringMapDawg(buffer, this.deserializerWord, 1, true);
        }
        if (format === 'probs') {
            this.dawgjs = readStringMapDawg(buffer, this.deserializerProbs, 1, true);
        }
        if (format === 'int') {
            this.dawgjs = readByteCompletionDawg(buffer);
        }
    }
    public findAll(str: string, replaces?: string[][]) {
        const results = [
            this.getStr(str),
            ...this.getAllReplaces(str, replaces).map((rep) => this.getStr(rep)),
        ];

        return results.filter(Boolean);
    }
    public getInt(str): number {
        const index = this.dawgjs.dictionary.followBytes(encodeUtf8(str));
        const hasValue = this.dawgjs.dictionary.hasValue(index);
        const value = this.dawgjs.dictionary.value(index) ^ (1 << 31);

        if (hasValue) {
            return value;
        }

        return;
    }
    private getStr(str) {
        const indexes = this.dawgjs.getArray(str);

        if (indexes.length) {
            return [
                str,
                indexes,
            ];
        }

        return;
    }
    private getAllReplaces(str, replaces) {
        const allReplaces = [];

        if (!replaces || !replaces.length) {
            return allReplaces;
        }

        for (let i = 0; i < str.length; i++) {
            const char = str[i];

            replaces.forEach(([from, to]) => {
                if (char === from) {
                    allReplaces.push(`${str.slice(0, i)}${to}${str.slice(i + 1)}`);
                }
            });
        }

        return allReplaces;
    }
    private deserializerWord(bytes) {
        let view = new DataView(bytes.buffer);

        const paradigmId = view.getUint16(0);
        const indexInParadigm = view.getUint16(2);

        return [paradigmId, indexInParadigm];
    }
    private deserializerProbs(bytes) {
        let view = new DataView(bytes.buffer);

        const paradigmId = view.getUint16(0);
        const indexInParadigm = view.getUint16(2);
        const indexInParadigm2 = view.getUint16(4);

        return [paradigmId, indexInParadigm, indexInParadigm2];
    }
}
