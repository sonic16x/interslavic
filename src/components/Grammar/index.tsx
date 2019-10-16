import * as React from 'react';
import { connect } from 'react-redux';
import './index.scss';
import { setPageAction } from 'actions';
import Table from 'components/Table';
import tables from './tables.json';
import Text from 'components/Text';
import Columns from 'components/Columns';

interface IGrammarProps {
    close: () => void;
    isVisible: boolean;
}

interface IGrammarState {
    columnsCount: number;
}

class Grammar extends React.Component<IGrammarProps, IGrammarState> {
    constructor(props) {
        super(props);
        this.state = {
            columnsCount: this.getColumnsCount(),
        };
        this.resizeCallback = this.resizeCallback.bind(this);
        window.addEventListener('resize', this.resizeCallback);
    }
    public componentWillUnmount() {
        window.removeEventListener('resize', this.resizeCallback);
    }
    public render() {
        return (
            <div className={'grammar' + (this.props.isVisible ? ' show' : '')}>
                <Columns count={this.state.columnsCount}>
                    <br/>
                    <h3>MEDŽUSLOVJANSKY JEZYK</h3>
                    <Text align={'center'}>{`{abeceda i pravopisanje}[B]`}</Text>
                    <Table data={tables.tableAbeceda} />
                    <Text>
                        {`V latinici i cirilici jest možno vměsto {y}[b,B] pisati prosto {i}[b,B] i vměsto {ě}[g,B] pisati prosto {e}[g,B].
                    Napr. {r{y}[b]ba→r{i}[b]ba r{ě}[g]ka→r{e}[g]ka}[B]
                    Palatizacija i eufonija: {{k}[r]→{č}[r], {h}[r]→{š}[r], {g}[r]→{ž}[r], {c}[r]{j}[p]→{č}[r], {s}[r]{j}[p]→{š}[r], {zj}[r]→{ž}[r]}[B]
                    Napr.: {Grě{k}[r]→grě{č}[r]sky pra{h}[r]→pra{š}[r]ny Bo{g}[r]→bo{ž}[r]sky pro{s}[r]{ju}[p]→pro{š}[r]{u}[p]}[B]`}
                    </Text>
                    <Text indent={'0.5rem'}>
                        {`{1.}[B,m] Staroslovjansko jatj={ѣ}[g,B]={ě}[g,B] se može pisati bez diakritiky kako ie ili prosto e.
                         Podobno {č}[r,B], {š}[r,B], {ž}[r,B] se mogut pisati kako {cz}[r,B], {sz}[r,B], {zs}[r,B].`}
                    </Text>
                    <Text indent={'0.5rem'}>
                        {`{2.}[B,m] Staroslovjansko щ jest na počatkah slov kako {šč}[r,B], ale potom kako {č}[r,B].(napr. {ščit}[r,B], {pomoč}[r,B], {občina}[r,B], {svěča}[r,B])`}
                    </Text>
                    <Text indent={'0.5rem'}>
                        {`{3.}[B,m] V cirilici možno koristiti ligatury
                        {шч}[r,B] → {щ}[r,B] {ьу}[r,B] / {ју}[r,B] → {ю}[r,B] {ьа}[r,B] / {ја}[r,B] → {я}[r,B]
                        Medžuslovjansky jezyk drži morfologično pravopisanje. Koren slov se piše
                        rovno v vsih padežah. Englijske, latinske i grečske slova imajut svoje orig.
                        pravopisanje ale s medžuslovjanskymi zakončenjami ({architektura}[r,B], {biologija}[r,B] ...).`}
                    </Text>
                    <Text align={'center'}>{'{imeniky}[B]'}</Text>
                    <Table data={tables.tableBrat} />
                    <Table data={tables.tableMuz} />
                    <Text>
                        {`Mužske objekty, ktore aktivno dělajut někaky proces, sut {životne}[i]
                        (od pytanja KTO?) i po tutoj pričině imajut akuzativ rovny s genitivom.
                        Ostalne objekty sut {neživotne}[i] (od pytanija ČTO) i imajut v jednině akuzativ
                        rovny s nominativom.
                      napr.: {gospod peče {hlěb}[r].}[B] ({hlěb}[r,B] ne može pečti = jest neživotny)
                      {gospod vidi {člověka}[r]}[B]. ({člověk}[r,B] može viděti = jest životny)`}
                    </Text>
                    <Text>
                        {`Slova mužskogo roda zakončeni na -{a}[r] imajut v jednině klonjenje po tvrdom
                            vzoru {žena}[r,B] ili mekkom vzoru {duša}[r,B], ale v množině i dvojině imajut normalny
                            mužsky vzor.
                            napr.: {vladyk-{a}[r], vladyk-{y}[b], vladyk-{ě}[g,B], vladyk-{u}[p], vladyk-{o}[p],}[B] ... (jednina)
                            {vladyk-{i}[b], vladyk-{ov}[p], vladyk-{a}[r]m, vladyk-{a}[r]m{i}[b],}[B] ... (množina)`}
                    </Text>
                    <Table data={tables.tableZena} />
                    <Table data={tables.tableKost} />
                    <Text>
                        {`Vse čiselniky zakončene na soglasniky –{T}[B] i –{Č}[B] ({PET}[B],{ŠEST}[B], ... {DESET}[B], {TRINADSET}[B], ...
                        {DVADESET}[B], {TYSEČ}[B]) imajut klonjenje kako {KOST}[B] v jednině: {šest, šest-{i}[b], šest-j{u}[p]}[B] ...
                        Dualne slova {OKO}[B], {UHO}[B] imajut dual rovne s množinoju vzora {KOST}[B] s palatizovanym
                        korenom: {oč-i, oč-ij, oč-am}[B] ... {uš-{i}[b], uš-{i}[b]j, uš-{a}[r]m}[B] ... where {čj,šj,žj → č,š,ž}[B].`}
                    </Text>
                    <Table data={tables.tableSelo} />
                    <Table data={tables.tableDen} />
                    <Text>
                        {`Na razlišenje od staroslovjanskogo jezyka, specijalne vzory imajut svoje
                        klonjenje toliko v jednině. Množina i dual jest v normalnyh mekkyh vzorah:
                        {dn-{i}[b]=kost-{i}[b], imen-{a}[r]=polj-{a}[r], mater-{e}[g]=duš-{e}[g], dět-{i}[b]=kost-{i}[b]}[B], ...
                        Medžuslovjansky jezyk koristi nestale {[{e}[g]/·] i [{o}[p]/·]}[B] :
                        {ot{e}[g]c, od·ca Decemb{e}[g]r, Decemb·ra član{o}[p]k, član·ka p{e}[g]s, p·sa}[B] ...`}
                    </Text>
                    <Text align={'center'}>{`{naučno pravopisanje v slovniku i cirilica}[B]`}</Text>
                    <div className={'tablesRow'}>
                        <Table data={tables.tableNauc1} />
                        <Table data={tables.tableNauc2} />
                        <Table data={tables.tableKir} />
                    </div>
                    <Text align={'center'}>{`{zaimeniky}[B]`}</Text>
                    <Table data={tables.tableMest} />
                    <Table data={tables.tableTojTaTo} />
                    <Table data={tables.tableOnOnaOno} />
                    <Text>
                        {`Mekky	vzor klonjenja {(-{e}[g]g{o}[p], -{e}[g]m{u}[p], ...)}[B] imajut zaimeniky:
                        {MOJ-MOJA-MOJE, TVOJ-TVOJA-TVOJE, NAŠ-NAŠA-NAŠE, VAŠ-VAŠA-VAŠE,
                        VSEj-VSA-VSE, KOJ, KOJA, KOJE, ČIJ, ČIJA, ČIJE ...}[B]
                        Tvar {n}[r]- pišemo toliko v padežah s prědlogom:
                        {slyšu jego, rabotaju za {n}[r]j{e}[g]go, idu s {n}[r]j{i}[b]m{i}[b], pišu j{e}[g]m{u}[p], idu k {n}[r]j{e}[g]m{u}[p]}[B]`}
                    </Text>
                    <Text align={'center'}>{`{pridavniky}[B]`}</Text>
                    <Table data={tables.tableDobry} />
                    <Table data={tables.tableSvezi} />
                    <br/>
                    <Table data={tables.tableGradacija} />
                    <Text>
                        {`{kračenje: tvrd-{ěj}[s]-ši→tvrd-ši krat-{čej}[s]-ši→krat-ši bogat-{ěj}[s]-ši→bogat-ši}[B]`}
                    </Text>
                    <Table data={tables.tableImeti} />
                    <Table data={tables.tableVariti} />
                    <Table data={tables.tableVremena} />
                    <Table data={tables.tableByti} />
                    <Table data={tables.tableGradacija2} />
                    <Table data={tables.tableNumbers} />
                </Columns>
            </div>
        );
    }
    private getColumnsCount() {
        const width = window.innerWidth;
        if (width > 1150) {
            return 3;
        }
        if (width > 800) {
            return 2;
        }
        return 1;
    }
    private resizeCallback() {
        this.setState({
            columnsCount: this.getColumnsCount(),
        });
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
