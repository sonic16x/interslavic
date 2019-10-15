import * as React from 'react';
import './index.scss';

export function parseStr(rawStr) {
    if (!rawStr) {
        return rawStr;
    }
    let result = rawStr;
    const res = rawStr.match(/\{[^<>{}]+\}+[\w]{1}/g);
    if (!res || !res.length) {
        return result;
    }
    res.forEach((item) => {
        const [str, color] = item.split('}');
        result = result.replace(item, `<span class="${color}">${str.slice(1)}</span>`);
    });
    return result;
}

export default class extends React.PureComponent {
    public render() {
        return (
            <p className={'customText'} dangerouslySetInnerHTML={{__html: parseStr(this.props.children)}} />
        );
    }
}
