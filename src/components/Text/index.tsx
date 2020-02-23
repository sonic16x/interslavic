import * as React from 'react';
import './index.scss';

function matchStr(str) {
    return str.match(/\{[^{}]+\}+\[[\w,]+\]/g);
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
}

export default class extends React.PureComponent<ITextProps> {
    public render() {
        const style = {
            textAlign: this.props.align || 'start',
            textIndent: this.props.indent,
        };
        return (
            <p
                style={style}
                className={'custom-text'}
                dangerouslySetInnerHTML={{__html: parseStr(this.props.children)}}
            />
        );
    }
}
