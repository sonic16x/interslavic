import { Card } from 'components/Card';
import Table from 'components/Table';
import Text from 'components/Text';
import * as React from 'react';
import './index.scss';
import tables from './tables.json';

const titles = {
    abeceda: 'Abeceda',
    imeniky: 'Imeniky',
    zaimeniky: 'Zaimeniky',
    pridavniky: 'Pridavniky',
    glagoly: 'Glagoly',
    byti: 'Neredne glagoly',
    prislovniky: 'Prislovniky',
    predlogy: 'Prědlogy',
    ciselniky: 'Čiselniky',
    sovezniky: 'Sovezniky',
    cestice: 'Čestice',
    medzuslovniky: 'Medžuslovniky',
    podredne: 'Podredne izrěčenja',
    // naucno: 'Naučno pravopisanje i kirilica',
    glagolica: 'Glagolica',
    primetky: 'Primětky (*)',
    podrobnosti: 'Podrobne pravila (linki)',
};

class Grammar extends React.PureComponent {
    private containerRef;
    private activeId;
    private userEvent;
    constructor(props) {
        super(props);
        this.activeId = 'abeceda';
        this.containerRef = React.createRef();
        this.onScroll = this.onScroll.bind(this);
        this.onWheel = this.onWheel.bind(this);
    }
    public render() {
        return (
            <div
                className={'grammar-container'}
                onWheel={this.onWheel}
                onScroll={this.onScroll}
                ref={this.containerRef}
            >
                <div className={'grammar'}>
                    <h4 className={'grammar__title'}>Osnovna gramatika medžuslovjanskogo jezyka</h4>
                    <br/>
                    <Card title={'Sodržanje'} id={'content'} className={'grammar__content'}>
                        {Object.keys(titles).map((id, i) => (
                            <a
                                className={'list-group-item link'}
                                key={i}
                                id={this.getLinkId(id)}
                                onClick={() => this.userEvent = false}
                                href={`#${id}`}
                            >
                                {titles[id]}
                            </a>
                        ))}
                    </Card>
                    <Card title={titles.abeceda} id={'abeceda'}>
                        <Table data={tables.tableAbeceda} />
                        <Text>
                            {`V latinici i kirilici jest možno vměsto {y}[b,B] pisati prosto {i}[b,B] i vměsto {ě}[g,B] pisati prosto {e}[g,B].
                                {Napriměr:}[i] {r{y}[b]ba→r{i}[b]ba}[B], {r{ě}[g]ka→r{e}[g]ka}[B]`}
                        </Text>
                        <Text>
                            {`Palatizacija i eufonija: {{k}[k]→{č}[k], {h}[k]→{š}[k], {g}[k]→{ž}[k], {c}[k]{j}[p]→{č}[k], {s}[k]{j}[p]→{š}[k], {zj}[k]→{ž}[k]}[B]
                                {Napriměr:}[i] {Grě{k}[k]→grě{č}[k]sky}[B], {pra{h}[k]→pra{š}[k]ny}[B], {Bo{g}[k]→bo{ž}[k]sky}[B], {pro{s}[k]{ju}[p]→pro{š}[k]{u}[p]}[B]`}
                        </Text>
                        <Text indent={'0.5rem'}>
                            {`{1.}[B,m] Staroslovjansko jatj={ѣ}[g,B]={ě}[g,B] se može pisati bez diakritiky kako {ie}[g,B] ili prosto {e}[g,B]. Podobno {č}[k,B], {š}[k,B], {ž}[k,B] se mogut pisati kako {cz}[k,B], {sz}[k,B], {zs}[k,B].`}
                        </Text>
                        <Text indent={'0.5rem'}>
                            {`{2.}[B,m] Staroslovjansko {щ}[k,B] jest na početkah slov kako {šč}[k,B], ale potom kako {č}[k,B] ({Napriměr:}[i] {ščit}[k,B], {pomoč}[k,B], {občina}[k,B], {svěča}[k,B])`}
                        </Text>
                        <Text indent={'0.5rem'}>
                            {`{3.}[B,m] V kirilici možno koristiti ligatury: {шч}[k,B] → {щ}[k,B], {ьу}[k,B]/{ју}[k,B] → {ю}[k,B], {ьа}[k,B]/{ја}[k,B] → {я}[k,B]`}
                        </Text>
                        <Text>
                            {`Medžuslovjansky jezyk drži morfologično pravopisanje. Koren slov se piše ravno v vsih padežah. Anglijske, latinske i grečske slova imajut svoje originalno pravopisanje ale s medžuslovjanskymi zakončenjami ({arhitektur}[k,B]{a}[k], {biolog}[k,B]{ija}[k] ...).`}
                        </Text>
                    </Card>
                    <Card title={titles.imeniky} id={'imeniky'}>
                        <Table data={tables.tableBrat} />
                        <Table data={tables.tableMuz} />
                        <Text>
                            {`Mužske objekty, ktore aktivno dělajut někaky proces, sut {životne}[i] (od pytanja KTO?) i po tutoj pričině imajut akuzativ ravny s genitivom.`}
                        </Text>
                        <Text>
                            {`Ostalne objekty sut {neživotne}[i] (od pytanija ČTO) i imajut v jednině akuzativ ravny s nominativom.
                            {Napriměr:}[i]
                               - {gospod peče {hlěb}[k].}[B] ({hlěb}[k,B] ne može pečti = jest neživotny)
                               - {gospod vidi {člověka}[k]}[B]. ({člověk}[k,B] može viděti = jest životny)`}
                        </Text>
                        <Text>
                            {`Slova mužskogo roda zakončeni na -{a}[r,B] imajut v jednině klonjenje po tvrdom vzoru {žena}[k,B] ili mekkom vzoru {duša}[k,B], ale v množině i dvojině imajut normalny mužsky vzor.
                             {Napriměr:}[i]
                               - {vladyk-{a}[r], vladyk-{y}[b], vladyk-{ě}[g,B], vladyk-{u}[p], vladyk-{o}[p],}[B] ... (jednina)
                               - {vladyk-{i}[b], vladyk-{ov}[p], vladyk-{a}[r]m, vladyk-{a}[r]m{i}[b],}[B] ... (množina)`}
                        </Text>
                        <Table data={tables.tableZena} />
                        <Table data={tables.tableKost} />
                        <Text>
                            {`Vse čiselniky zakončene na soglasniky –{T}[B] i –{Č}[B] ({PET}[B], {ŠEST}[B], ... {DESET}[B], {TRINADSET}[B], ... {DVADESET}[B], {TYSEČ}[B]) imajut klonjenje kako {KOST}[B] v jednině: {šest, šest-{i}[b], šest-j{u}[p]}[B] ...`}
                        </Text>
                        <Text>
                            {`Dualne slova {OKO}[B], {UHO}[B] imajut dual ravne s množinoju vzora {KOST}[B] s palatizovanym korenom: {oč-{i}[b], oč-{ij}[b], oč-{a}[r]m}[B] ... {uš-{i}[b], uš-{i}[b]j, uš-{a}[r]m}[B] ... where {čj,šj,žj → č,š,ž}[B].`}
                        </Text>
                        <Table data={tables.tableSelo} />
                        <Table data={tables.tableDen} />
                        <Text>
                            {`Na različenje od staroslovjanskogo jezyka, specijalne vzory imajut svoje klonjenje toliko v jednině. Množina i dual jest v normalnyh mekkyh vzorah:
                            - {dn-{i}[b]=kost-{i}[b], imen-{a}[r]=polj-{a}[r], mater-{e}[g]=duš-{e}[g], dět-{i}[b]=kost-{i}[b]}[B], ...`}
                        </Text>
                        <Text>
                            {`Medžuslovjansky jezyk koristi nestale {[{e}[g]/·] i [{o}[p]/·]}[B]:
                            - {ot{e}[g]c - od·ca, Decemb{e}[g]r - Decemb·ra, član{o}[p]k - član·ka, p{e}[g]s - p·sa}[B] ...`}
                        </Text>
                    </Card>
                    <Card title={titles.zaimeniky} id={'zaimeniky'}>
                        <Table data={tables.tableMest} />
                        <Table data={tables.tableTojTaTo} />
                        <Table data={tables.tableOnOnaOno} />
                        <Text>
                            {`Mekky	vzor klonjenja {(-{e}[g]g{o}[p], -{e}[g]m{u}[p], ...)}[B] imajut zaimeniky:
                            - {MOJ-MOJA-MOJE, TVOJ-TVOJA-TVOJE, NAŠ-NAŠA-NAŠE, VAŠ-VAŠA-VAŠE, VSEj-VSA-VSE, KOJ, KOJA, KOJE, ČIJ, ČIJA, ČIJE ...}[B]`}
                        </Text>
                        <Text>
                            {`Tvar {n}[k,B]- pišemo toliko v padežah s prědlogom:
                            - {slyšu j{e}[g]go, rabotaju za {n}[k]j{e}[g]go, idu s {n}[k]j{i}[b]m{i}[b], pišu j{e}[g]m{u}[p], idu k {n}[k]j{e}[g]m{u}[p]}[B]`}
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
                            {`Pasivny	prošly	participij	mekkyh	glagolov jest {–j{e}[g]ni –j{e}[g]na –j{e}[g]no}[B],
                            ale {dj→dž (viděti, vidžu, vidiš, vidženy),
                            tj→č (vratiti, vraču, vratiš, vračeny)
                            sj→š (prositi, prošu, prosiš, prošeny),
                            stj→šč (koristiti, korišču, koristiš, koriščeny)}[B]`}
                        </Text>
                        <Text>
                            {`Pasivny prošly participij	vsih ostalnyh glagolov {–{a}[r]ti –{ě}[g]ti –▪ti jest –{a}[r]ny –{ě}[g]ny –{e}[g]ny:
                            dělati→dělany, pekti→pek–eny→pečeny ...}[B]`}
                        </Text>
                        <Table data={tables.tableVremena} />
                        <Text>
                            {`Aktivne glagolne participija možut tvoriti aktivny sučny i aktivny prošly prislovniky:
                            {dělati → {dělaj}[k]-{u}[p]-č, děl-{a}[r]-v
                             variti → var-{e}[g]-č, var-{i}[b]-v}[B]`}
                        </Text>
                    </Card>
                    <Card title={titles.byti} id={'byti'}>
                        <Table data={tables.tableByti} />
                        <br/>
                        <Text>
                            {`{Neredne glagoly VĚDĚTI, DATI, IDTI, JESTI}[k,B]`}
                        </Text>
                        <Text>
                            {`{věděti}[B], věděnje – věm, věš, vě, věmo, věte, vědut ... věděl, věděh ... vědi!, vědite!
                            {dati}[B], danje – dam, daš, da, damo, date, dadut ... dal, dah ... daj! dajte!
                            {idti}[B], idenje – idu, ideš, ide, idemo, idete, idut ... išel, ideh ... idi!, idite!
                            {jesti}[B], jedenje – jedu, jedeš, jede, jedemo, jedete, jedut ... jedl, jedeh ... jedi!, jedite!
                             {({krasti}[B], kradenje – kradu, kradeš, krade, krademo ... kradl, kradeh ... kradi!, ...)}[s]`}
                        </Text>
                    </Card>
                    <Card title={titles.prislovniky} id={'prislovniky'}>
                        <Text>
                            {`Poslě tvrdyh soglasnikov jest zakončenje {-{o}[p]}[B], poslě mekkyh {č š ž j}[B,k] jest {-{e}[g]}[B].
                            {Napriměr:}[i] {dobr-{o}[p]}[B], {bystr-{o}[p]}[B], {už-{e}[g]}[B], {daž-{e}[g]}[B], {menš-{e}[g]}[B]`}
                        </Text>
                        <Text>
                            {`Prislovniky iz pridavnikov zakončenyh na {-sk{y}[b]}[B] imajut zakončenje {-sk{y}[b]}[B].
                            {Napriměr:}[i] pridavnik {poljsk{y}[b],{a}[r],{o}[p]}[B] → prislovnik {poljsk{y}[b]}[B]`}
                        </Text>
                        <Table data={tables.tableGradacija2} />
                    </Card>
                    <Card title={titles.predlogy} id={'predlogy'}>
                        <Table data={tables.tablePredlogy} />
                    </Card>
                    <Card title={titles.ciselniky} id={'ciselniky'}>
                        <Table data={tables.tableNumbers} />
                        <Text>
                            {`{25 746}[B] = dvadeset pet	tyseč sedmsto četyrideset šest.
                            {25 746}[B] = dvadeset pet tyseč sedmsto četyrideset šesty.`}
                        </Text>
                        <Text>
                            {`{{dva, dvoh, dvom, dvoma}[r]
                            {tri, trěh, trěm, trěmi}[k]
                            {četyri, četyrěh, četyrěm, četyrěmi}[k]
                            jedin, jednogo (TOJ)
                            {pet, peti... 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20 (KOST)}[g]
                            {nula, nuly (ŽENA)}[p]
                            {sto, sta (SĚLO)}[b]
                            {tyseč, tyseči (KOST)}[g]
                            milion, miliona (GRAD)}[B]`}
                        </Text>
                    </Card>
                    <Card title={titles.sovezniky} id={'sovezniky'}>
                        <Table data={tables.tableSovezniky} />
                    </Card>
                    <Card title={titles.cestice} id={'cestice'}>
                        <Table data={tables.tableCestice} />
                    </Card>
                    <Card title={titles.medzuslovniky} id={'medzuslovniky'}>
                        <Text>
                            {`{oh! ah! uva! lutě!}[B]
                            «značenje medžuslovnika takože imajut vse izrěčenja v navodnikah»`}
                        </Text>
                    </Card>
                    <Card title={titles.podredne} id={'podredne'}>
                        <Text>
                            {`{..., kde ... ..., ktoromu..., tako ..., kako ... toliko ..., koliko ... ..., že ...}[B]
                            tvary {iže, jegože, jimže}[B], ... sut relativne zaimeniky od on, ona, ono `}
                        </Text>
                    </Card>
                    {/*<Card title={titles.naucno} id={'naucno'}>*/}
                    {/*    <div className={'tablesRow'}>*/}
                    {/*        <Table data={tables.tableNauc1} />*/}
                    {/*        <Table data={tables.tableNauc2} />*/}
                    {/*        <Table data={tables.tableKir} />*/}
                    {/*    </div>*/}
                    {/*</Card>*/}
                    <Card title={titles.glagolica} id={'glagolica'}>
                        <Table data={tables.tableGlagoljica} />
                    </Card>
                    <Card title={titles.primetky} id={'primetky'}>
                        <Text>
                            {`1. Dvojina je shranila se nyně jedino v slovenskom i lužičskyh jezykah, tomu vměsto tutoj formy jest rekomendovano koristati množinu.`}
                        </Text>
                        <Text>
                            {`2. Prosto prošlo vrěme (aorist, imperfect) je shranilo se jedino v česti slovjanskyh jezykov, tomu vměsto njego jest rekomendovano koristati glagol byti + l-participij (pisah → jesm pisal).`}
                        </Text>
                    </Card>
                    <Card title={titles.podrobnosti} id={'podrobnosti'}>
                        <Text>
                            {`Pri sozdanji tutoj stranicy jest upotrěbjeny dokument «Medžuslovjansky jezyk. Abeceda i pravopisanie» (Januar 2018): <a href="http://interslavic-language.org/doc/ns-pregled.pdf" target="_blank">[PDF]</a>`}
                        </Text>
                        <Text>
                            {`Podrobne pravila pravopisanja je možno najdti na oficialnyh sajtah:`}
                        </Text>
                        <Text>
                            {`● <a href="http://www.neoslavonic.org" target="_blank">http://www.neoslavonic.org</a>`}
                        </Text>
                        <Text>
                            {`● <a href="http://steen.free.fr/interslavic/grammar.html" target="_blank">http://steen.free.fr/interslavic/grammar.html</a>`}
                        </Text>
                    </Card>
                </div>
            </div>
        );
    }
    private onWheel() {
        this.userEvent = true;
    }
    private onScroll() {
        const scrollPosition = this.containerRef.current.scrollTop;
        let activeId;
        let minDistance = Number.MAX_SAFE_INTEGER;
        const diff = this.containerRef.current.offsetTop + 100;
        const distance = {};
        const titleElements = Object.keys(titles).map((id) => document.getElementById(id));
        titleElements.forEach((item) => {
            const id = item.getAttribute('id');
            distance[id] = Math.abs((item.offsetTop - diff) - scrollPosition);
        });
        for (const id in distance) {
            if (distance[id] < minDistance) {
                minDistance = distance[id];
                activeId = id;
            }
        }
        if (activeId !== this.activeId) {
            document.getElementById(this.getLinkId(this.activeId)).classList.remove('selected');
            document.getElementById(this.getLinkId(activeId)).classList.add('selected');
            this.activeId = activeId;
            if (this.userEvent) {
                // location.hash = activeId;
            }
        }
    }
    private getLinkId(id) {
        return `link_${id}`;
    }
}

export default Grammar;
