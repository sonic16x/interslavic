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
                <Table fontSize={'3.5vw'} data={tables.tableAbeceda} />
                <Text>
                    {`V latinici i cirilici jest možno vměsto {y}[b,B] pisati prosto {i}[b,B] i vměsto {ě}[g] pisati prosto {e}[g].
                    Napr. {r{y}[b]ba→r{i}[b]ba r{ě}[g]ka→r{e}[g]ka}[B]
                    Palatizacija i eufonija: {{k}[r]→{č}[r], {h}[r]→{š}[r], {g}[r]→{ž}[r], {c}[r]{j}[p]→{č}[r], {s}[r]{j}[p]→{š}[r], {zj}[r]→{ž}[r]}[B]
                    Napr.: {Grě{k}[r]→grě{č}[r]sky pra{h}[r]→pra{š}[r]ny Bo{g}[r]→bo{ž}[r]sky pro{s}[r]{ju}[p]→pro{š}[r]{u}[p]}[B]`}
                </Text>
                <Text indent={'0.5rem'}>
                    {`{1.}[B,m] Staroslovjansko jatj={ѣ}[g]={ě}[g] se može pisati bez diakritiky kako ie ili prosto e.
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
                <Table fontSize={'2.7vw'} data={tables.tableBrat} />
                <Table fontSize={'2.7vw'} data={tables.tableMuz} />
                <Text>
                    {`Mužske objekty, ktore aktivno dělajut někaky proces, sut {životne}[i]
                        (od pytanja KTO?) i po tutoj pričině imajut akuzativ rovny s genitivom.
                        Ostalne objekty sut {neživotne}[i] (od pytanija ČTO) i imajut v jednině akuzativ
                        rovny s nominativom.
                      napr.: {gospod peče {hlěb}[r].}[B] ({hlěb}[r,B] ne može pečti = jest neživotny)
                      {gospod vidi {člověka}[r]}[B]. ({člověk}[r,B] može viděti = jest životny)
                    `}
                </Text>
                <Text>
                    {`Slova mužskogo roda zakončeni na -{a}[r] imajut v jednině klonjenje po tvrdom
                            vzoru {žena}[r,B] ili mekkom vzoru {duša}[r,B], ale v množině i dvojině imajut normalny
                            mužsky vzor.
                            napr.: {vladyk-{a}[r], vladyk-{y}[b], vladyk-{ě}[g], vladyk-{u}[p], vladyk-{o}[p],}[B] ... (jednina)
                            {vladyk-{i}[b], vladyk-{ov}[p], vladyk-{a}[r]m, vladyk-{a}[r]m{i}[b],}[B] ... (množina)`}
                </Text>
                <Table fontSize={'2.7vw'} data={tables.tableZena} />
                <Table fontSize={'2.7vw'} data={tables.tableKost} />
                <Text>
                    {`Vse čiselniky zakončene na soglasniky –{T}[B] i –{Č}[B] ({PET}[B],{ŠEST}[B], ... {DESET}[B], {TRINADSET}[B], ...
                        {DVADESET}[B], {TYSEČ}[B]) imajut klonjenje kako {KOST}[B] v jednině: {šest, šest-{i}[b], šest-j{u}[p]}[B] ...
                        Dualne slova {OKO}[B], {UHO}[B] imajut dual rovne s množinoju vzora {KOST}[B] s palatizovanym
                        korenom: {oč-i, oč-ij, oč-am}[B] ... {uš-{i}[b], uš-{i}[b]j, uš-{a}[r]m}[B] ... where {čj,šj,žj → č,š,ž}[B].`}
                </Text>
                <Table data={tables.tableSelo} />
                <Table fontSize={'3.5vw'} data={tables.tableDen} />
                <Text>
                    {`Na razlišenje od staroslovjanskogo jezyka, specijalne vzory imajut svoje
                        klonjenje toliko v jednině. Množina i dual jest v normalnyh mekkyh vzorah:
                        {dn-{i}[b]=kost-{i}[b], imen-{a}[r]=polj-{a}[r], mater-{e}[g]=duš-{e}[g], dět-{i}[b]=kost-{i}[b]}[B], ...
                        Medžuslovjansky jezyk koristi nestale {[{e}[g]/·] i [{o}[p]/·]}[B] :
                        {ot{e}[g]c, od·ca Decemb{e}[g]r, Decemb·ra član{o}[p]k, član·ka p{e}[g]s, p·sa}[B] ...`}
                </Text>
                <Text align={'center'}>{`{naučno pravopisanje v slovniku i cirilica}[B]`}</Text>
                <div className={'tablesRow'}>
                    <Table fontSize={'2.7vw'} data={tables.tableNauc1} />
                    <Table fontSize={'2.7vw'} data={tables.tableNauc2} />
                    <Table fontSize={'2.7vw'} data={tables.tableKir} />
                </div>
                <Text align={'center'}>{`{zaimeniky}[B]`}</Text>
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
