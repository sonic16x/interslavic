import * as React from 'react';
import { connect } from 'react-redux';
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
    // public componentDidUpdate() {
    //
    // }
    // public shouldComponentUpdate(prevProps) {
    //     return prevProps.count !== this.props.count;
    // }
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
        if (!this.containerRef.current) {
            const { count, children } = this.props;
            return splitUp(children, count);
        }
        const elements = [];
        let count = 0;
        Array.from(this.containerRef.current.children).forEach((column: any) => {
            count += column.children.length;
            Array.from(column.children).forEach((item: any) => elements.push(item.offsetHeight));
        });
        const totalHeight = elements.reduce((acc, item) => (acc + item), 0);
        const columnHeight = Math.ceil(totalHeight / this.props.count);
        let temp = 0;
        let index = 0;
        const columns = [];
        elements.forEach((height, i) => {
            temp += height;
            if (temp >= columnHeight) {
                temp = 0;
                index++;
            } else {
                if (!columns[index]) {
                    columns[index] = [];
                }
                columns[index].push(this.props.children[i]);
            }
        });
        return columns;
    }
}
