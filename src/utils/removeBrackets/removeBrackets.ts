export function removeBrackets(text: string, left: string, right: string): string {
    const posOpen = text.indexOf(left);

    if (posOpen !== -1) {
        const posClose = text.indexOf(right);
        if (posClose > posOpen) {
            return removeBrackets((text.slice(0, posOpen) + text.slice(posClose + 1))
                .replace('  ', ' ').trim(), left, right);
        }
    }
    
    return text;
}
