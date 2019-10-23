import * as React from 'react';
import { connect } from 'react-redux';
import './index.scss';
import { hideDetailAction, setAlphabetTypeAction } from 'actions';
import { declensionNoun } from 'utils/legacy/declensionNoun';
import { LineSelector } from 'components/LineSelector';
import {
    getGender,
    getPartOfSpeech,
    getVerbType,
    isAnimated,
    isPlural,
} from 'utils/wordDetails';
import { getCyrillic, getLatin } from 'utils/translator';

interface IDetailModalProps {
    close: () => void;
    item: any;
    alphabetType: string;
    flavorisationType: string;
    setAlphabetType: (type: string) => void;
    rawItem: string[];
}

const alphabetType = [
    {
        name: 'Latin',
        value: 'latin',
    },
    {
        name: 'Cyrillic',
        value: 'cyrillic',
    },
];

class DetailModal extends React.Component<IDetailModalProps> {
    constructor(props) {
        super(props);
    }
    public render() {
        if (!this.props.item) {
            return '';
        }
        const pos = getPartOfSpeech(this.props.item.details);

        return (
            <div className={'modal show'} role={'dialog'} onClick={() => this.props.close()}>
                <div className={'modal-dialog'} role={'document'} onClick={(e) => e.stopPropagation()}>
                    <div className={'modal-content'}>
                        <div className={'modal-header'}>
                            <h5 className={'modal-title'}>{this.props.rawItem[0]} <i>({pos})</i></h5>
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
                            <LineSelector
                                options={alphabetType}
                                value={this.props.alphabetType}
                                onSelect={(type) => this.props.setAlphabetType(type)}
                            />
                            <br/>
                            {this.renderBody(pos)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    private renderBody(pos) {
        switch (pos) {
            case 'noun':
                return this.renderNounDetails();
            default:
                return '';
        }
    }
    private formatStr(str: string): string {
        if (!str) {
            return '';
        }
        switch (this.props.alphabetType) {
            case 'latin':
                return getLatin(str, this.props.flavorisationType);
            case 'cyrillic':
                return getCyrillic(str, this.props.flavorisationType);
        }
    }
    private renderNounDetails() {
        const word = this.props.rawItem[0];
        const gender = getGender(word);
        const animated = isAnimated(word);
        const cases = declensionNoun(word, gender, animated);

        return (
           <div>
               <table className={'table table-sm table-bordered table-striped'}>
                   <thead>
                   <tr>
                       <th>Case</th>
                       <th>Singular</th>
                       <th>Plural</th>
                   </tr>
                   </thead>
                   <tbody>
                   {Object.keys(cases).map((item, i) => (
                       <tr key={i}>
                           <td>{item}</td>
                           <td>{this.formatStr(cases[item][0])}</td>
                           <td>{this.formatStr(cases[item][1])}</td>
                       </tr>
                   ))}
                   </tbody>
               </table>
           </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        close: () => dispatch(hideDetailAction()),
        setAlphabetType: (type) => dispatch(setAlphabetTypeAction(type)),
    };
}

function mapStateToProps({detailModal, results, rawResults, alphabetType, flavorisationType}) {
    return {
        item: results[detailModal],
        rawItem: rawResults[detailModal],
        alphabetType,
        flavorisationType,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailModal);
