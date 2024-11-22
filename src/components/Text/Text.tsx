import type { FC,ReactNode } from 'react';

function matchStr(str) {
    return str.match(/\{[^{}]*\}+\[[\w,]+\]/g);
}

export function parseStr(rawStr) {
    if (!rawStr) {
        return rawStr;
    }
    let result = rawStr;
    const res = matchStr(rawStr);
    if (!res || !res.length) {
        return result.split('\n').join('<br/>');
    }
    res.forEach((item) => {
        const [str, params] = item.split('}[');
        const text = str.slice(1);
        const classList = params.slice(0, -1).split(',').join(' ');
        result = result.replace(item, `<span class="${classList}">${text}</span>`);
    });
    
    return parseStr(result);
}

interface ITextProps {
    align?: 'start' | 'center' | 'end';
    indent?: string;
    children?: ReactNode
}

export const Text: FC<ITextProps> = ({ children, align, indent }) => (
    <p
        style={{
            textAlign: align || 'start',
            textIndent: indent,
        }}
        className="custom-text"
        dangerouslySetInnerHTML={{ __html: parseStr(children) }}
    />
)
