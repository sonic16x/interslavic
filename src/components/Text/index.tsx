import * as React from 'react';
import './index.scss';

function matchStr(str) {
    return str.match(/\{[^{}]+\}+\[[^<>{}]+\]/g);
}

export function parseStr(rawStr) {
    if (!rawStr) {
        return rawStr;
    }
    let result = rawStr;
    const res = matchStr(rawStr);
    if (!res || !res.length) {
        return result;
    }
    res.forEach((item) => {
        const [str, params] = item.split('}[');
        const text = str.slice(1);
        const classList = params.slice(0, -1).split(',').join(' ');
        result = result.replace(item, `<span class="${classList}">${text}</span>`);
    });
    return matchStr(result) ? parseStr(result) : result.split('\n').join('<br/>');
}

export default class extends React.PureComponent {
    public render() {
        return (
            <p className={'customText'} dangerouslySetInnerHTML={{__html: parseStr(this.props.children)}} />
        );
    }
}
