import * as React from 'react';
import './index.scss';

interface IInfoPageProps {
    onClose: () => void;
}

interface IInfoPageState {}

export class InfoPage extends React.Component<IInfoPageProps, IInfoPageState> {
    public render() {
        return (
            <div className={'card infoPage'}>
                <img src={'logo.png'} className={'card-img shadow'} alt={'logo'}/>
                <div className={'card-body'}>
                    <h5 className={'card-title'}>Info page</h5>
                    <p className={'card-text'}>
                        Using dictionary from <a target={'_blank'} href={'http://steen.free.fr/interslavic/dynamic_dictionary.html'}>http://steen.free.fr/interslavic/dynamic_dictionary.html</a>
                        <br/>
                        Author <a target={'_blank'} href={'email:cherebedov.sergey@gmail.com'}>cherebedov.sergey@gmail.com</a>
                        <br/>
                        Github <a target={'_blank'} href={'https://github.com/scherebedov/interslavic'}>https://github.com/scherebedov/interslavic</a>
                    </p>
                    <button type={'button'} className={'btn btn-primary'} onClick={() => this.props.onClose()}>Go back</button>
                </div>
            </div>
        );
    }
}
