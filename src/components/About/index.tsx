import * as React from 'react';
import { worksheetUrl } from 'consts';
import './index.scss';

class About extends React.Component {
    public render() {
        const email = 'cherebedov.sergey@gmail.com';
        const github = 'https://github.com/scherebedov/interslavic';
        const source = 'http://steen.free.fr/interslavic';

        return (
            <div className={'about'}>
                <div className={'aboutContent'}>
                    <br/>
                    <h4>Interslavic language dictionary</h4>
                    <div className={'common'}>
                        <br/>
                        Using vocabulary from <a target={'_blank'} href={source}>{source}</a>
                        <p>Authors of Interslavic/English/Polish translations: Jan van Steenbergen and Michał Swat</p>
                        <hr/>
                        <p>Please join the work to improve word translations for your native language.</p>
                        <a target={'_blank'} href={worksheetUrl}>Table with translations</a>
                        <hr/>
                        <p>Developer:</p>
                        <a target={'_blank'} href={`email:${email}`}>Sergey Cherebedov ({email})</a>
                        <hr/>
                        Source code (Github) <a target={'_blank'} href={github}>{github}</a>
                        <hr/>
                        <button
                            type={'button'}
                            aria-label={'Go back'}
                            className={'btn btn-primary shadow'}
                            onClick={() => window.history.back()}
                        >
                            Go back
                        </button>
                    </div>
                    <div className={'devInfo'}>
                        <p className={'text-muted buildHash'}>{DATE}</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default About;
