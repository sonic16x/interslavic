import * as React from 'react';
import './index.scss';

function splitUp(arr, n) {
    const rest = arr.length % n;
    let restUsed = rest;
    const partLength = Math.floor(arr.length / n);
    const result = [];

    for (let i = 0; i < arr.length; i += partLength) {
        let end = partLength + i;
        let add = false;

        if (rest !== 0 && restUsed) {
            end++;
            restUsed--;
            add = true;
        }

        result.push(arr.slice(i, end)); // part of the array

        if (add) {
            i++;
        }
    }

    return result;
}

interface IColumnsProps {
    count: number;
    children: any;
}

export default class extends React.Component<IColumnsProps> {
    private containerRef;
    constructor(props) {
        super(props);
        this.containerRef = React.createRef();
    }
    public render() {
        const columns = this.getColumns();
        return (
            <div className={'columns'} ref={this.containerRef}>
                {columns.map((items, i) => (
                    <div key={i} className={'column'}>{items}</div>
                ))}
            </div>
        );
    }
    private getColumns() {
        const { count, children } = this.props;
        if (count === 1) {
            return [children];
        }
        if (!this.containerRef.current) {
            return splitUp(children, count);
        }
        const elementsHeight = [];
        Array.from(this.containerRef.current.children).forEach((column: any) => {
            Array.from(column.children).forEach((item: any) => elementsHeight.push(item.offsetHeight));
        });
        const totalHeight = elementsHeight.reduce((acc, item) => (acc + item), 0);
        const columnHeight = Math.ceil(totalHeight / this.props.count);
        let tempHeight = 0;
        let columnIndex = 0;
        const columns = [];
        elementsHeight.forEach((height, i) => {
            if (tempHeight >= columnHeight) {
                tempHeight = height;
                columnIndex++;
            } else {
                tempHeight += height;
            }
            if (!columns[columnIndex]) {
                columns[columnIndex] = [];
            }
            columns[columnIndex].push(this.props.children[i]);
        });
        return columns;
    }
}
