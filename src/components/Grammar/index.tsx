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
                <Text>{`{abeceda i pravopisanje}[B]`}</Text>
                <Table data={tables.tableAbeceda} fontSize={'3.5vw'} />
                <Text>
                    {`V latinici i cirilici jest možno vměsto {y}[b,B] pisati prosto {i}[b,B] i vměsto {ě}[g] pisati prosto {e}[g].
                    Napr. {r{y}[b]ba→r{i}[b]ba r{ě}[g]ka→r{e}[g]ka}[B]
                    Palatizacija i eufonija: {{k}[r]→{č}[r], {h}[r]→{š}[r], {g}[r]→{ž}[r], {c}[r]{j}[p]→{č}[r], {s}[r]{j}[p]→{š}[r], {zj}[r]→{ž}[r]}[B]
                    Napr.: {Grě{k}[r]→grě{č}[r]sky pra{h}[r]→pra{š}[r]ny Bo{g}[r]→bo{ž}[r]sky pro{s}[r]{ju}[p]→pro{š}[r]{u}[p]}[B]`}
                </Text>
                <Table data={tables.tableBrat} />
                <Table data={tables.tableMuz} />
                <Table data={tables.tableZena} />
                <Table data={tables.tableKost} />
                <Table data={tables.tableSelo} />
                <Table data={tables.tableDen} />
                <Text>{`{naučno pravopisanje v slovniku i cirilica}[B]`}</Text>
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
