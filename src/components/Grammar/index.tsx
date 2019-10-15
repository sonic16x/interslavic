import * as React from 'react';
import { connect } from 'react-redux';
import './index.scss';
import { setPageAction } from 'actions';
import Table from 'components/Table';
import tables from './tables.json';
import Text from 'components/Text';

interface IGrammarProps {
    close: () => void;
    isVisible: boolean;
}

class Grammar extends React.Component<IGrammarProps> {
    public render() {
        return (
            <div className={'container grammar' + (this.props.isVisible ? ' show' : '')}>
                <h4>MEDŽUSLOVJANSKY JEZYK</h4>
                <Text align={'center'}>{`{abeceda i pravopisanje}[B]`}</Text>
                <Table data={tables.tableAbeceda} fontSize={'3.5vw'} />
                <Text indent={'0.5rem'}>
                    {`V latinici i cirilici jest možno vměsto {y}[b,B] pisati prosto {i}[b,B] i vměsto {ě}[g] pisati prosto {e}[g].
                    Napr. {r{y}[b]ba→r{i}[b]ba r{ě}[g]ka→r{e}[g]ka}[B]
                    Palatizacija i eufonija: {{k}[r]→{č}[r], {h}[r]→{š}[r], {g}[r]→{ž}[r], {c}[r]{j}[p]→{č}[r], {s}[r]{j}[p]→{š}[r], {zj}[r]→{ž}[r]}[B]
                    Napr.: {Grě{k}[r]→grě{č}[r]sky pra{h}[r]→pra{š}[r]ny Bo{g}[r]→bo{ž}[r]sky pro{s}[r]{ju}[p]→pro{š}[r]{u}[p]}[B]`}
                </Text>
                <Text indent={'0.5rem'}>
                    {`{1.}[B,m] Staroslovjansko jatj={ѣ}[g]={ě}[g] se može pisati bez diakritiky kako ie ili prosto e.
                         Podobno {č}[r], {š}[r], {ž}[r] se mogut pisati kako {cz}[r], {sz}[r], {zs}[r].`}
                </Text>
                <Text indent={'0.5rem'}>
                    {`{2.}[B,m] Staroslovjansko щ jest na počatkah slov kako {šč}[r], ale potom kako {č}[r].(napr. {ščit}[r], {pomoč}[r], {občina}[r], {svěča}[r])`}
                </Text>
                <Text indent={'0.5rem'}>
                    {`{3.}[B,m] V cirilici možno koristiti ligatury
                        {шч}[r] → {щ}[r] {ьу}[r] / {ју}[r] → {ю}[r] {ьа}[r] / {ја}[r] → {я}[r]
                        Medžuslovjansky jezyk drži morfologično pravopisanje. Koren slov se piše
                        rovno v vsih padežah. Englijske, latinske i grečske slova imajut svoje orig.
                        pravopisanje ale s medžuslovjanskymi zakončenjami ({architektura}[r], {biologija}[r] ...).`}
                </Text>
                <Text align={'center'}>{'{imeniky}[B]'}</Text>
                <Table data={tables.tableBrat} />
                <Table data={tables.tableMuz} />
                <Table data={tables.tableZena} />
                <Table data={tables.tableKost} />
                <Table data={tables.tableSelo} />
                <Table data={tables.tableDen} />
                <Text align={'center'}>{`{naučno pravopisanje v slovniku i cirilica}[B]`}</Text>
                <div className={'tablesRow'}>
                    <Table fontSize={'2.7vw'} data={tables.tableNauc1} />
                    <Table fontSize={'2.7vw'} data={tables.tableNauc2} />
                    <Table fontSize={'2.7vw'} data={tables.tableKir} />
                </div>
                <Table data={tables.tableMest} />
                <Table data={tables.tableTojTaTo} fontSize={'2.5vw'} />
            </div>
        );
    }
}

function mapStateToProps({page, isLoading}) {
    return {
        isVisible: page === 'grammar' && !isLoading,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        close: () => dispatch(setPageAction('dictionary')),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Grammar);
