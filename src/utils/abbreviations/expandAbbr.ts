import { t } from "translations";

import { analyzeAbbr } from "./analyzeAbbr";

export function expandAbbr(abbr: string): string {
    const analyzed = analyzeAbbr(abbr);

    return analyzed.filter(shouldBeShownToUser).map((key) => t(key)).join(', ');
}

function shouldBeShownToUser(verbModifier: string): boolean {
    // "main verb" (as opposed to auxiliary) doesn't make sense to show in the UI
    return verbModifier !== 'verb-main';
}
