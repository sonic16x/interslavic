import * as React from 'react';
import { connect } from 'react-redux';
import './index.scss';
import { hideDetailAction } from 'actions';

interface IDetailModalProps {
    close: () => void;
    item: any;
    rawItem: string[];
}

function getGender(pos: string) {
    if (pos.indexOf('m.') !== -1) {
        return 'male';
    }
    if (pos.indexOf('f.') !== -1) {
        return 'female';
    }
    return false;
}

function isAnimated(pos: string): boolean {
    return pos.indexOf('anim.') !== -1;
}

class Header extends React.Component<IDetailModalProps> {
    constructor(props) {
        super(props);
    }
    public render() {
        if (!this.props.item) {
            return '';
        }
        return (
            <div className={'modal show'} role={'dialog'} onClick={() => this.props.close()}>
                <div className={'modal-dialog'} role={'document'}>
                    <div className={'modal-content'}>
                        <div className={'modal-header'}>
                            <h5 className={'modal-title'}>{this.props.rawItem[0]}</h5>
                            <button
                                type={'button'}
                                className={'close'}
                                data-dismiss={'modal'}
                                aria-label={'Close'}
                                onClick={() => this.props.close()}
                            >
                                <span aria-hidden={'true'}>&times;</span>
                            </button>
                        </div>
                        <div className={'modal-body'}>
                            <p>{this.props.item.pos}</p>
                            <p>Gender: {getGender(this.props.item.pos)}</p>
                            <p>Animated: {isAnimated(this.props.item.pos).toString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        close: () => dispatch(hideDetailAction()),
    };
}

function mapStateToProps({detailModal, results, rawResults}) {
    return {item: results[detailModal], rawItem: rawResults[detailModal]};
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
