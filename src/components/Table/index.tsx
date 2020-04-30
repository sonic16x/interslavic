import { parseStr } from 'components/Text';
import * as React from 'react';
import './index.scss';
import { Clipboard } from 'components/Clipboard';

interface ITableProps {
    data: string[][];
}

export default class extends React.Component<ITableProps> {
    public render() {
        return (
            <table className={'table'}>
                <tbody>{this.renderBody()}</tbody>
            </table>
        );
    }

    private parseItem(raw): { str: string, attrs: any } {
        let [str, rawAttrs] = raw.split('@');
        str = parseStr(str);
        const attrs = {};
        if (!rawAttrs) {
            rawAttrs = '';
        }
        rawAttrs.split(';').forEach((rawExp) => {
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
            .map(({str, attrs}, i) => {
                if (str.includes('<') || str.includes('&')) {
                    return (
                        <td
                            key={i}
                            className={Object.keys(attrs).filter((w) => (w !== 'w' && w !== 'h')).join(' ')}
                            colSpan={attrs.w}
                            rowSpan={attrs.h}
                            style={{width: attrs.sw}}
                            dangerouslySetInnerHTML={{__html: str}}
                        />
                    );
                } else {
                    return (
                        <td
                            key={i}
                            className={Object.keys(attrs).filter((w) => (w !== 'w' && w !== 'h')).join(' ')}
                            colSpan={attrs.w}
                            rowSpan={attrs.h}
                            style={{width: attrs.sw}}
                        >
                            <Clipboard str={str}/>
                        </td>
                    );
                }
            });
    }

    private renderBody() {
        return this.props.data.map((row, i) => <tr key={i}>{this.renderRow(row)}</tr>);
    }
}
