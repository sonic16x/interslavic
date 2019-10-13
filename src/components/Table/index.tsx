import * as React from 'react';
import './index.scss';

interface IGrammarProps {
    header: string[];
    data: string[][];
}

export default class extends React.Component<IGrammarProps> {
    public render() {
        return (
            <table className={'customTable'}>
                <thead>{this.renderHeader()}</thead>
                <tbody>{this.renderBody()}</tbody>
            </table>
        );
    }

    private parseStr(rawStr) {
        if (!rawStr) {
            return rawStr;
        }
        let result = rawStr;
        const res = rawStr.match(/\{\w+\}+\w{1}/g);
        if (!res || !res.length) {
            return result;
        }
        res.forEach((item) => {
            const [str, color] = item.split('}');
            result = result.replace(item, `<span class="${color}">${str.slice(1)}</span>`);
        });
        return result;
    }

    private parseItem(raw): { str: string, attrs: any } {
        let [str, rawAttrs] = raw.split('@');
        str = this.parseStr(str);
        const attrs = {};
        if (!rawAttrs) {
            rawAttrs = '';
        }
        rawAttrs.split('#').forEach((rawExp) => {
            const exp = rawExp.split('=');
            if (exp.length === 1) {
                exp.push(true);
            }
            attrs[exp[0]] = exp[1];
        });
        return {
            str,
            attrs,
        };
    }

    private renderRow(row: string[]) {
        return row
            .map((item) => this.parseItem(item))
            .map(({str, attrs}, i) => (
                <td
                    key={i}
                    className={Object.keys(attrs).join(' ')}
                    colSpan={attrs.w}
                    dangerouslySetInnerHTML={{__html: str}}
                />
            ));
    }

    private renderBody() {
        return this.props.data.map((row, i) => <tr key={i}>{this.renderRow(row)}</tr>);
    }

    private renderHeader() {
        return (
            <tr>
                {this.renderRow(this.props.header)}
            </tr>
        );
    }
}
