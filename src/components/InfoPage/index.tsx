import * as React from 'react';
import { connect } from 'react-redux';
import './index.scss';
import { setPageAction } from 'actions';

interface IInfoPageProps {
    close: () => void;
    isVisible: boolean;
}

class InfoPage extends React.Component<IInfoPageProps> {
    public render() {
        const email = 'cherebedov.sergey@gmail.com';
        const github = 'https://github.com/scherebedov/interslavic';
        const source = 'http://steen.free.fr/interslavic/dynamic_dictionary.html';
        const sourceEmail = 'wenedyk@yahoo.co.uk';
        const sourceName = 'Jan van Steenbergen';
        const tableUrl = 'https://docs.google.com/spreadsheets/d/14b7B41A847_PDD6S3dFBOVBIkt_Cdxnt1m4e6NjrWP0/edit?usp=sharing';

        return (
            <div className={'infoPage' + (this.props.isVisible ? ' show' : '')}>
                <img src={'logo.png'} className={'card-img shadow'} alt={'logo'}/>
                <h5>Info page</h5>
                <hr/>
                Using dictionary from <a target={'_blank'} href={source}>{source}</a>
                <p>Author of Interslavic/English/Polish dictionary:</p>
                <a href={`email:${sourceEmail}`}>{sourceName}&nbsp;({sourceEmail})</a>
                <hr/>
                <a target={'_blank'} href={tableUrl}>Table with translations</a>
                <hr/>
                <p>Developer</p>
                <a target={'_blank'} href={`email:${email}`}>{email}</a>
                <hr/>
                Source code (Github) <a target={'_blank'} href={github}>{github}</a>
                <hr/>
                <button
                    type={'button'}
                    className={'btn btn-primary shadow'}
                    onClick={() => this.props.close()}
                >
                    Go back
                </button>
                <p className={'text-muted buildHash'}>{HASH_ID}</p>
                <p className={'text-muted buildHash'}>{DATE}</p>
            </div>
        );
    }
}

function mapStateToProps({page, isLoading}) {
    return {
        isVisible: page === 'info' && !isLoading,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        close: () => dispatch(setPageAction('translator')),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(InfoPage);
