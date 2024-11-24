const STATUS_MAP: Record<string, [string, string]> = {
    "9*": ["🌱", 'suggestedNewWord'],
    "98": ["⚠️", 'intelligibilityIssues'],
    '99': ["⛔️", 'suggestedForRemoval'],
};

export function annotateWordType(wordType: string): [string, string] {
    return STATUS_MAP[wordType] || fallback(wordType);
}

function fallback(wordType: string): [string, string] {
    return wordType.length === 2 && wordType[0] === '9'
        ? STATUS_MAP['9*']
        : ['', ''];
}
