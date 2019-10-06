import * as React from 'react';
import './index.scss';

interface IInfoPageProps {
    onClose: () => void;
}

export class InfoPage extends React.Component<IInfoPageProps> {
    public render() {
        const email = 'cherebedov.sergey@gmail.com';
        const github = 'https://github.com/scherebedov/interslavic';
        const source = 'http://steen.free.fr/interslavic/dynamic_dictionary.html';
        const buildHash = Array.prototype.slice.call(document.getElementsByTagName('script'))
            .find(({src}) => src.indexOf('scherebedov') !== -1).src.split('/').pop().split('.').shift();
        return (
            <div className={'card infoPage'}>
                <img src={'logo.png'} className={'card-img shadow'} alt={'logo'}/>
                <div className={'card-body'}>
                    <h5 className={'card-title'}>Info page</h5>
                    <p className={'card-text'}>
                        Using dictionary from <a target={'_blank'} href={source}>{source}</a>
                        <br/>
                        Author <a target={'_blank'} href={`email:${email}`}>{email}</a>
                        <br/>
                        Github <a target={'_blank'} href={github}>{github}</a>
                    </p>
                    <button
                        type={'button'}
                        className={'btn btn-primary'}
                        onClick={() => this.props.onClose()}
                    >
                        Go back
                    </button>
                    <p className={'fixed-bottom text-muted buildHash'}>{buildHash}</p>
                </div>
            </div>
        );
    }
}
