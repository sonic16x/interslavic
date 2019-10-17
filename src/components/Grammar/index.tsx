import * as React from 'react';
import { connect } from 'react-redux';
import './index.scss';
import { setPageAction } from 'actions';
import Table from 'components/Table';
import tables from './tables.json';
import Text from 'components/Text';
import Card from 'components/Card';

interface IGrammarProps {
    close: () => void;
    isVisible: boolean;
}

class Grammar extends React.Component<IGrammarProps> {
    public render() {
        const titles = {
            abeceda: 'abeceda i pravopisanje',
            imeniky: 'imeniky',
            nauchno: 'naučno pravopisanje v slovniku i cirilica',
            zaimeniky: 'zaimeniky',
            pridavniky: 'pridavniky',
            glagoly: 'glagoly',
            byti: 'neredny glagol BYTI',
            vedeti: 'neredne glagoly VĚDĚTI, DATI, IDTI, JESTI',
            prislovniky: 'prislovniky',
            predlogy: 'prědlogy',
            ciselniky: 'čiselniky',
            sovezniky: 'sovezniky',
            castice: 'častice',
            medzuslovniky: 'medžuslovniky',
            podredne: 'podredne izrěčenja',
            glagoljica: 'glagoljica',
        };
        return (
            <div className={'grammarContainer'}>
                <div className={'grammar' + (this.props.isVisible ? ' show' : '')}>
                    <br/>
                    <h3>MEDŽUSLOVJANSKY JEZYK</h3>
                    <h4>Osnovna gramatika</h4>
                    <Card title={'Sodržanje'} id={'content'}>
                        <div className={'list-group list-group-flush'}>
                            {Object.keys(titles).map((id, i) => (
                                <a className={'list-group-item link'} key={i} href={`#${id}`}>{titles[id]}</a>
                            ))}
                        </div>
                    </Card>
                    <Card title={titles.abeceda} id={'abeceda'}>
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
                    </Card>
                    <Card title={titles.imeniky} id={'imeniky'}>
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
                    </Card>
                    <Card title={titles.nauchno} id={'nauchno'}>
                        <div className={'tablesRow'}>
                            <Table data={tables.tableNauc1} />
                            <Table data={tables.tableNauc2} />
                            <Table data={tables.tableKir} />
                        </div>
                    </Card>
                    <Card title={titles.zaimeniky} id={'zaimeniky'}>
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
                    </Card>
                    <Card title={titles.pridavniky} id={'pridavniky'}>
                        <Table data={tables.tableDobry} />
                        <Table data={tables.tableSvezi} />
                        <br/>
                        <Table data={tables.tableGradacija} />
                        <Text>
                        {`{kračenje: tvrd-{ěj}[s]-ši→tvrd-ši krat-{čej}[s]-ši→krat-ši bogat-{ěj}[s]-ši→bogat-ši}[B]`}
                        </Text>
                    </Card>
                    <Card title={titles.glagoly} id={'glagoly'}>
                        <Table data={tables.tableImeti} />
                        <Text>
                            {`Pasivny prošly participij tvrdyh glagolov {–{i}[b]ti –{e}[g]ti –{u}[p]ti –yti}[B] jest {–{i}[b]ty –{e}[g]ty –{u}[p]ty –{y}[b]ty:}[B]
                            {piti→pity, kleti→klety, obuti→obuty, kryti→kryty}[B] ...	vse	druge imajut {–▪ny}[B].`}
                        </Text>
                        <Table data={tables.tableVariti} />
                        <Text>
                            {`Pasivny	prošly	participij	mekkyh	glagolov jest {–j{e}[g]ni –j{e}[g]na –j{e}[g]no}[B], ale
                            {dj→dž (viděti, vidžu, vidiš, vidženy),	tj→č (vratiti, vraču, vratiš, vračeny)
                            sj→š (prositi, prošu, prosiš, prošeny), stj→šč (koristiti, korišču, koristiš, koriščeny)...}[B]`}
                        </Text>
                        <Text>
                            {`Pasivny prošly participij	vsih ostalnyh glagolov {–{a}[r]ti –{ě}[g]ti –▪ti jest –{a}[r]ny –{ě}[g]ny – {e}[g]ny:
                            dělati→dělany, pekti→pek–eny→pečeny ...}[B]`}
                        </Text>
                        <Table data={tables.tableVremena} />
                        <Text>
                            {`Aktivne glagolne participija možut tvoriti aktivny sučny i aktivny prošly
                        prislovniky: {dělati → dělaj-{u}[p]-č, děl-{a}[r]-v variti → var-{e}[g]-č, var-{i}[b]-v}[B]`}
                        </Text>
                    </Card>
                    <Card title={titles.byti} id={'byti'}>
                        <Table data={tables.tableByti} />
                    </Card>
                    <Card title={titles.vedeti} id={'vedeti'}>
                        <Text>
                            {`{věděti, věděnje – věm, věš, vě, věmo, věte, vědut ... věděl, věděh ... vědi!, vědite!
                            dati, danje – dam, daš, da, damo, date, dadut ... dal, dah ... daj! dajte!
                            idti, idenje – idu, ideš, ide, idemo, idete, idut ... išel, ideh ... idi!, idite!
                            jesti, jedenje – jedu, jedeš, jede, jedemo, jedete, jedut ... jedl, jedeh ... jedi!, jedite!}[B]
                             {(krasti, kradenje – kradu, kradeš, krade, krademo ... kradl, kradeh ... kradi!, ...)}[s]`}
                        </Text>
                    </Card>
                    <Card title={titles.prislovniky} id={'prislovniky'}>
                        <Text>
                            {`Poslě tvrdyh soglasnikov jest zakončenje -{o}[p], poslě mekkyh č š ž j jest -{e}[g].
                            napr.: dobr-{o}[p] bystr-{o}[p] už-{e}[g] daž-{e}[g] menš-{e}[g]
                            Prislovniky iz pridavnikov zakončenyh na {-sk{y}[b]}[B] imajut zakončenje {-sk{y}[b]}[B].
                            napr.: pridavnik {poljsk{y}[b],{a}[r],{o}[p]}[B] → prislovnik {poljsk{y}[b]}[B]`}
                        </Text>
                        <Table data={tables.tableGradacija2} />
                    </Card>
                    <Card title={titles.predlogy} id={'predlogy'}>
                        <Table data={tables.tablePredlogy} />
                    </Card>
                    <Card title={titles.ciselniky} id={'ciselniky'}>
                        <Table data={tables.tableNumbers} />
                        <Text>
                            {`{25 746}[B] = dvadeset pet	tyseč sedmset četyrideset šest.
                            {25 746.}[B] = dvadeset pet tyseč sedmset četyrideset šesty.
                            dva, dvoh, dvom, dvoma tri, trěh, trěm, trěmi četyri, četyrěh, četyrěm, četyrěmi
                            {jedin, jednogo (TOJ)}[B] pet, peti... 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20 (KOST)
                            nula, nuly (ŽENA) sto, sta (SĚLO) tyseč, tyseči (KOST) milion, miliona (GRAD) `}
                        </Text>
                    </Card>
                    <Card title={titles.sovezniky} id={'sovezniky'}>
                        <Table data={tables.tableSovezniky} />
                    </Card>
                    <Card title={titles.castice} id={'castice'}>
                        <Text>
                            {`soglašenja: {da, ej}[B] odpora: {ne, ni}[B] pytanja: {li}[B] naglašenja: {ako ... potom ... inako}[B]`}
                        </Text>
                    </Card>
                    <Card title={titles.medzuslovniky} id={'medzuslovniky'}>
                        <Text>
                            {`{oh! ah! uva! lutě!}[B]«značenje medžuslovnika takože imajut vse izrěčenja v navodnikah»`}
                        </Text>
                    </Card>
                    <Card title={titles.podredne} id={'podredne'}>
                        <Text>
                            {`{..., kde ... ..., ktoromu..., tako ..., kako ... toliko ..., koliko ... ..., že ...}[B]
                            tvary {iže, jegože, jimže}[B], ... sut relativne zaimeniky od on, ona, ono `}
                        </Text>
                    </Card>
                    <Card title={titles.glagoljica} id={'glagoljica'}>
                        <Table data={tables.tableGlagoljica} />
                    </Card>
                    <br/>
                    <br/>
                    <br/>
                </div>
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
