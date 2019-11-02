import * as React from 'react';
import { connect } from 'react-redux';
import './index.scss';

interface IAboutProps {
    isVisible: boolean;
}

class About extends React.Component<IAboutProps> {
    public render() {
        const email = 'cherebedov.sergey@gmail.com';
        const github = 'https://github.com/scherebedov/interslavic';
        const source = 'http://steen.free.fr/interslavic';
        const tableUrl = 'https://docs.google.com/spreadsheets/d/14b7B41A847_PDD6S3dFBOVBIkt_Cdxnt1m4e6NjrWP0/edit?usp=sharing';

        return (
            <div className={'about' + (this.props.isVisible ? ' show' : '')}>
                <div className={'common'}>
                    <br/>
                    Using dictionary from <a target={'_blank'} href={source}>{source}</a>
                    <p>Authors of Interslavic/English/Polish dictionary: Jan van Steenbergen and Michał Swat</p>
                    <hr/>
                    <p>Please join the work to improve word translations for your native language.</p>
                    <a target={'_blank'} href={tableUrl}>Table with translations</a>
                    <hr/>
                    <p>Developer:</p>
                    <a target={'_blank'} href={`email:${email}`}>Sergey Cherebedov ({email})</a>
                    <hr/>
                    Source code (Github) <a target={'_blank'} href={github}>{github}</a>
                    <hr/>
                    <button
                        type={'button'}
                        className={'btn btn-primary shadow'}
                        onClick={() => window.history.back()}
                    >
                        Go back
                    </button>
                </div>
                <div className={'devInfo'}>
                    <p className={'text-muted buildHash'}>{HASH_ID}</p>
                    <p className={'text-muted buildHash'}>{DATE}</p>
                </div>
            </div>
        );
    }
}

function mapStateToProps({page, isLoading}) {
    return {
        isVisible: page === 'about' && !isLoading,
    };
}

export default connect(mapStateToProps)(About);
