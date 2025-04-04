import { Component } from 'react'

import { Clipboard, Hint, parseStr } from 'components'

import './Table.scss'

interface ITableProps {
    data: string[][];
}

export class Table extends Component<ITableProps> {
    public render() {
        return (
            <table className="table">
                <tbody>{this.renderBody()}</tbody>
            </table>
        )
    }

    private parseItem(raw): { str: string, attrs: any, tips: string } {
        // use negative lookahead for @] to avoid splitting by @ inside []
        let [str, rawAttrs, tips] = raw.split(/@(?!])/)
        str = parseStr(str)
        rawAttrs ??= ''
        tips ??= ''

        const attrs = {}
        rawAttrs.split(';').forEach((rawExp) => {
            const exp = rawExp.split('=')
            if (exp.length === 1) {
                exp.push(true)
            }
            attrs[exp[0]] = exp[1]
        })

        return {
            str,
            attrs,
            tips,
        }
    }

    private getClassName(attrs: any) {
        return [
            'custom-text',
            ...Object.keys(attrs).filter((w) => (w !== 'w' && w !== 'h' && w !== 'lang'))
        ].join(' ')
    }

    private renderRow(row: string[]) {
        return row
            .map((item) => this.parseItem(item))
            .map(({ str, attrs, tips }, i) => {
                if (tips) {
                    return (
                        <td
                            key={i}
                            className={this.getClassName(attrs)}
                            colSpan={attrs.w}
                            rowSpan={attrs.h}
                            style={{ width: attrs.sw }}
                        >
                            <Hint
                                className="with-tips"
                                shortTitle={str}
                                title={tips}
                            />
                        </td>
                    )
                } else if (str.includes('<') || str.includes('&')) {
                    return (
                        <td
                            key={i}
                            className={this.getClassName(attrs)}
                            colSpan={attrs.w}
                            rowSpan={attrs.h}
                            style={{ width: attrs.sw }}
                            dangerouslySetInnerHTML={{ __html: str }}
                        />
                    )
                } else {
                    return (
                        <td
                            key={i}
                            className={this.getClassName(attrs)}
                            colSpan={attrs.w}
                            rowSpan={attrs.h}
                            style={{ width: attrs.sw }}
                        >
                            <Clipboard str={str} lang={attrs.lang}/>
                        </td>
                    )
                }
            })
    }

    private renderBody() {
        return this.props.data.map((row, i) => <tr key={i}>{this.renderRow(row)}</tr>)
    }
}
