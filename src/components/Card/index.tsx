import * as React from 'react';
import { connect } from 'react-redux';
import './index.scss';

export default class extends React.PureComponent<{title: string; id: string}> {
    public render() {
        return (
            <div className={'card'} id={this.props.id}>
                <div className={'card-body'}>
                    <h5 className={'card-title'}>{this.props.title}</h5>
                    {this.props.children}
                </div>
            </div>
        );
    }
}
