import { createRef, PureComponent } from 'react'

import { getCaseTips } from 'utils'

import { Card, Link, Text } from 'components'
import { Table } from 'components/Table'

import './Grammar.scss'

import tables from './tables.json'

const titles = {
    abeceda: 'Abeceda',
    imeniky: 'Imenniky',
    zaimeniky: 'Zaimenniky',
    pridavniky: 'Pridavniky',
    glagoly: 'Glagoly',
    byti: 'Neredne glagoly',
    prislovniky: 'Prislovniky',
    predlogy: 'Prědlogy',
    ciselniky: 'Čislovniky',
    sovezniky: 'Svezniky',
    cestice: 'Čestice',
    medzuslovniky: 'Medžuslovniky',
    podredne: 'Podredne izrěčenja',
    // naucno: 'Naučno pravopisanje i kirilica',
    glagolica: 'Glagolica',
    primetky: 'Primětky (*)',
    podrobnosti: 'Podrobne pravila (linky)',
}

/* eslint-disable max-len */
export class Grammar extends PureComponent {
    private containerRef
    private activeId
    private userEvent
    constructor(props) {
        super(props)
        this.activeId = 'abeceda'
        this.containerRef = createRef()
        this.onScroll = this.onScroll.bind(this)
        this.onWheel = this.onWheel.bind(this)
    }
    private addCaseTips = (type: string) => (row: any[]) => {
        const elemArr = row[0].split('@')
        if(['N', 'A', 'G', 'L', 'I', 'D', 'V'].includes(elemArr[0])) elemArr[2] = getCaseTips(elemArr[0], type)
        row[0] = elemArr.join('@')
        
        return row
    }
    public render() {
        return (
            <div
                className="grammar-container color-theme--light"
                onWheel={this.onWheel}
                onScroll={this.onScroll}
                ref={this.containerRef}
                lang="isv"
            >
                <div className="grammar">
                    <h4 className="grammar__title">Osnovna gramatika medžuslovjanskogo jezyka</h4>
                    <br/>
                    <Card title="Sodržanje" id="content" className="grammar__content">
                        {Object.keys(titles).map((id) => (
                            <Link
                                className="list-group-item link"
                                key={id}
                                id={this.getLinkId(id)}
                                onClick={() => this.userEvent = false}
                                href={`#${id}`}
                            >
                                {titles[id]}
                            </Link>
                        ))}
                    </Card>
                    <Card title={titles.abeceda} id="abeceda">
                        <Table data={tables.tableAbeceda} />
                        <Text>
                            {`V latinici i kirilici jest možno vměsto {y}[b,B] pisati prosto {i}[b,B] i vměsto {ě}[g,B] pisati prosto {e}[g,B].
                                {Napriměr:}[i] {r{y}[b]ba→r{i}[b]ba}[B], {r{ě}[g]ka→r{e}[g]ka}[B]`}
                        </Text>
                        <Text>
                            {`Palatalizacija i evfonija: {{k}[k]→{č}[k], {h}[k]→{š}[k], {g}[k]→{ž}[k], {c}[k]{j}[p]→{č}[k], {s}[k]{j}[p]→{š}[k], {zj}[k]→{ž}[k]}[B]
                                {Napriměr:}[i] {Gre{k}[k]→gre{č}[k]sky}[B], {pra{h}[k]→pra{š}[k]ny}[B], {Bo{g}[k]→bo{ž}[k]sky}[B], {pro{s}[k]{iti}[p]→pro{š}[k]{u}[p]}[B]`}
                        </Text>
                        <Text indent="0.5rem">
                            {'{1.}[B,m] Staroslovjanska bukva {ѣ}[k,B] ({ě}[g,B]/{є}[g,B]) se može pisati bez diakritiky kako {ie}[g,B] ili prosto {e}[g,B]. Podobno {č}[k,B], {š}[k,B], {ž}[k,B] se mogut pisati kako {cz}[k,B], {sz}[k,B], {zs}[k,B].'}
                        </Text>
                        <Text indent="0.5rem">
                            {'{2.}[B,m] Staroslovjanska bukva {щ}[k,B] jest na početkah slov kako {šč}[k,B], ale potom kako {č}[k,B] ({Napriměr:}[i] {ščit}[k,B], {pomoč}[k,B], {občina}[k,B], {svěča}[k,B])'}
                        </Text>
                        <Text indent="0.5rem">
                            {'{3.}[B,m] V kirilici možno koristiti ligatury: {шч}[k,B] → {щ}[k,B], {ју}[k,B] → {ю}[k,B], {ја}[k,B] → {я}[k,B]'}
                        </Text>
                        <Text>
                            {'Medžuslovjansky jezyk drži morfologično pravopisanje. Koren slov se piše ravno v vsih padežah. Anglijske, latinske i grečske slova imajut svoje originalno pravopisanje ale s medžuslovjanskymi zakončenjami ({arhitektur}[k,B]{a}[k], {biolog}[k,B]{ija}[k] ...).'}
                        </Text>
                    </Card>
                    <Card title={titles.imeniky} id="imeniky">
                        <Table data={tables.tableBrat.map(this.addCaseTips('noun'))} />
                        <Table data={tables.tableMuz.map(this.addCaseTips('noun'))} />
                        <Text>
                            {'Mužske objekty, ktore aktivno dělajut někaky proces, sut {žive}[i] (od pytanja KTO?) i po tutoj pričině imajut akuzativ ravny s genitivom.'}
                        </Text>
                        <Text>
                            {`Ostale objekty sut {nežive}[i] (od pytanja ČTO) i imajut v jednině akuzativ ravny s nominativom.
                            {Napriměr:}[i]
                               - {gospod peče {hlěb}[k].}[B] ({hlěb}[k,B] ne može pekti sebe = jest neživy)
                               - {gospod vidi {člověka}[k]}[B]. ({člověk}[k,B] može viděti = jest živy)`}
                        </Text>
                        <Text>
                            {`Slova mužskogo roda zakončeni na -{a}[r,B] imajut v jednině klonjenje po tvrdom vzoru {žena}[k,B] ili mekkom vzoru {duša}[k,B], ale v množině i dvojině imajut normalny mužsky vzor.
                             {Napriměr:}[i]
                               - {vladyk-{a}[r], vladyk-{y}[b], vladyk-{ě}[g,B], vladyk-{u}[p], vladyk-{o}[p],}[B] ... (jednina)
                               - {vladyk-{i}[b], vladyk-{ov}[p], vladyk-{a}[r]m, vladyk-{a}[r]m{i}[b],}[B] ... (množina)`}
                        </Text>
                        <Table data={tables.tableZena.map(this.addCaseTips('noun'))} />
                        <Table data={tables.tableKost.map(this.addCaseTips('noun'))} />
                        <Text>
                            {'Vse čislovniky zakončene na soglasky –{T}[B] i –{Č}[B] ({PET}[B], {ŠEST}[B], ... {DESET}[B], {TRINADSET}[B], ... {DVADESET}[B], {TYSEČ}[B]) imajut klonjenje kako {KOST}[B] v jednině: {šest, šest-{i}[b], šest-j{u}[p]}[B] ...'}
                        </Text>
                        <Text>
                            {'Dvojinne slova {OKO}[B], {UHO}[B] imajut dvojinu ravnu s množinoju vzora {KOST}[B] s palatalizovanym korenem: {oč-{i}[b], oč-{ij}[b], oč-{a}[r]m}[B] ... {uš-{i}[b], uš-{i}[b]j, uš-{a}[r]m}[B] ... kde {čj,šj,žj → č,š,ž}[B].'}
                        </Text>
                        <Table data={tables.tableSelo.map(this.addCaseTips('noun'))} />
                        <Table data={tables.tableDen.map(this.addCaseTips('noun'))} />
                        <Text>
                            {`Na različenje od staroslovjanskogo jezyka, specijalne vzory imajut svoje klonjenje toliko v jednině. Množina i dual jest v normalnyh mekkyh vzorah:
                            - {dn-{i}[b]=kost-{i}[b], imen-{a}[r]=polj-{a}[r], mater-{e}[g]=duš-{e}[g], dět-{i}[b]=kost-{i}[b]}[B], ...`}
                        </Text>
                        <Text>
                            {`Medžuslovjansky jezyk koristi nestale {[{e}[g]/·] i [{o}[p]/·]}[B]:
                            - {ot{e}[g]c - od·ca, Decemb{e}[g]r - Decemb·ra, član{o}[p]k - član·ka, p{e}[g]s - p·sa}[B] ...`}
                        </Text>
                    </Card>
                    <Card title={titles.zaimeniky} id="zaimeniky">
                        <Table data={tables.tableMest.map(this.addCaseTips('noun'))} />
                        <Table data={tables.tableTojTaTo.map(this.addCaseTips('adjective'))} />
                        <Table data={tables.tableOnOnaOno.map(this.addCaseTips('noun'))} />
                        <Text>
                            {`Mekky	vzor klonjenja {(-{e}[g]g{o}[p], -{e}[g]m{u}[p], ...)}[B] imajut zaimenniky:
                            - {MOJ-MOJA-MOJE, TVOJ-TVOJA-TVOJE, NAŠ-NAŠA-NAŠE, VAŠ-VAŠA-VAŠE, VSEj-VSA-VSE, KOJ, KOJA, KOJE, ČIJ, ČIJA, ČIJE ...}[B]`}
                        </Text>
                        <Text>
                            {`Tvar {n}[k,B]- pišemo toliko v padežah s prědlogom:
                            - {slyšu j{e}[g]go, rabotaju za {n}[k]j{e}[g]go, idu s {n}[k]j{i}[b]m{i}[b], pišu j{e}[g]m{u}[p], idu k {n}[k]j{e}[g]m{u}[p]}[B]`}
                        </Text>
                    </Card>
                    <Card title={titles.pridavniky} id="pridavniky">
                        <Table data={tables.tableDobry.map(this.addCaseTips('adjective'))} />
                        <Table data={tables.tableSvezi.map(this.addCaseTips('adjective'))} />
                        <br/>
                        <Table data={tables.tableGradacija} />
                        <Text>
                            {'{skračenje: tvrd-{ěj}[s]-ši→tvrd-ši krat-{čej}[s]-ši→krat-ši bogat-{ěj}[s]-ši→bogat-ši}[B]'}
                        </Text>
                    </Card>
                    <Card title={titles.glagoly} id="glagoly">
                        <Table data={tables.tableImeti} />
                        <Text>
                            {`Pasivny prošly particip tvrdyh glagolov {–{i}[b]ti –{e}[g]ti –{u}[p]ti –yti}[B] jest {–{i}[b]ty –{e}[g]ty –{u}[p]ty –{y}[b]ty:}[B]
                            {piti→pity, kleti→klety, obuti→obuty, kryti→kryty}[B] ...	vse	druge imajut {–▪ny}[B].`}
                        </Text>
                        <Table data={tables.tableVariti} />
                        <Text>
                            {`Pasivny	prošly	particip	mekkyh	glagolov jest {–j{e}[g]ni –j{e}[g]na –j{e}[g]no}[B],
                            ale {dj→dž (viděti, vidžu, vidiš, vidženy),
                            tj→č (vratiti, vraču, vratiš, vračeny)
                            sj→š (prositi, prošu, prosiš, prošeny),
                            stj→šč (koristiti, korišču, koristiš, koriščeny)}[B]`}
                        </Text>
                        <Text>
                            {`Pasivny prošly particip	vsih ostalyh glagolov {–{a}[r]ti –{ě}[g]ti –▪ti jest –{a}[r]ny –{ě}[g]ny –{e}[g]ny:
                            dělati→dělany, pekti→pek–eny→pečeny ...}[B]`}
                        </Text>
                        <Table data={tables.tableVremena} />
                        <Text>
                            {`Aktivne glagolne participy mogut tvoriti aktivny nastoječi i aktivny prošly prislovniky:
                            {dělati → {dělaj}[k]-{u}[p]-č, děl-{a}[r]-v
                             variti → var-{e}[g]-č, var-{i}[b]-v}[B]`}
                        </Text>
                    </Card>
                    <Card title={titles.byti} id="byti">
                        <Table data={tables.tableByti} />
                        <br/>
                        <Text>
                            {'{Neredne glagoly VĚDĚTI, DATI, IDTI, JESTI}[k,B]'}
                        </Text>
                        <Text>
                            {`{věděti}[B], věděnje – věm, věš, vě, věmo, věte, vědut ... věděl, věděh ... vědi!, vědite!
                            {dati}[B], danje – dam, daš, da, damo, date, dadut ... dal, dah ... daj! dajte!
                            {idti}[B], idenje – idu, ideš, ide, idemo, idete, idut ... išel, ideh ... idi!, idite!
                            {jesti}[B], jedenje – jedu, jedeš, jede, jedemo, jedete, jedut ... jedl, jedeh ... jedi!, jedite!
                             {({krasti}[B], kradenje – kradu, kradeš, krade, krademo ... kradl, kradeh ... kradi!, ...)}[s]`}
                        </Text>
                    </Card>
                    <Card title={titles.prislovniky} id="prislovniky">
                        <Text>
                            {`Poslě tvrdyh soglasok jest zakončenje {-{o}[p]}[B], poslě mekkyh {č š ž j}[B,k] jest {-{e}[g]}[B].
                            {Napriměr:}[i] {dobr-{o}[p]}[B], {bystr-{o}[p]}[B], {už-{e}[g]}[B], {daž-{e}[g]}[B], {menš-{e}[g]}[B]`}
                        </Text>
                        <Text>
                            {`Prislovniky iz pridavnikov zakončenyh na {-sk{y}[b]}[B] imajut zakončenje {-sk{y}[b]}[B].
                            {Napriměr:}[i] pridavnik {poljsk{y}[b],{a}[r],{o}[p]}[B] → prislovnik {poljsk{y}[b]}[B]`}
                        </Text>
                        <Table data={tables.tableGradacija2} />
                    </Card>
                    <Card title={titles.predlogy} id="predlogy">
                        <Table data={tables.tablePredlogy} />
                    </Card>
                    <Card title={titles.ciselniky} id="ciselniky">
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
                            {sto, sta (SELO)}[b]
                            {tyseč, tyseči (KOST)}[g]
                            milion, miliona (GRAD)}[B]`}
                        </Text>
                    </Card>
                    <Card title={titles.sovezniky} id="sovezniky">
                        <Table data={tables.tableSovezniky} />
                    </Card>
                    <Card title={titles.cestice} id="cestice">
                        <Table data={tables.tableCestice} />
                    </Card>
                    <Card title={titles.medzuslovniky} id="medzuslovniky">
                        <Text>
                            {`{oh! ah! uva! lutě!}[B]
                            «značenje medžuslovnika takože imajut vse izrěčenja v navodnicah»`}
                        </Text>
                    </Card>
                    <Card title={titles.podredne} id="podredne">
                        <Text>
                            {`{..., kde ... ..., ktoromu..., tako ..., kako ... toliko ..., koliko ... ..., že ...}[B]
                            tvary {iže, jegože, jimže}[B], ... sut relativne zaimenniky od on, ona, ono `}
                        </Text>
                    </Card>
                    {/*<Card title={titles.naucno} id="naucno">*/}
                    {/*    <div className="tablesRow">*/}
                    {/*        <Table data={tables.tableNauc1} />*/}
                    {/*        <Table data={tables.tableNauc2} />*/}
                    {/*        <Table data={tables.tableKir} />*/}
                    {/*    </div>*/}
                    {/*</Card>*/}
                    <Card title={titles.glagolica} id="glagolica">
                        <Table data={tables.tableGlagoljica} />
                    </Card>
                    <Card title={titles.primetky} id="primetky">
                        <Text>
                            {'1. Dvojina je shranila se nyně jedino v slovenskom i lužičskyh jezykah, tomu vměsto tutoj formy jest rekomendovano koristati množinu.'}
                        </Text>
                        <Text>
                            {'2. Prosto prošlo vrěme (aorist, imperfect) je shranilo se jedino v česti slovjanskyh jezykov, tomu vměsto njego jest rekomendovano koristati glagol byti + l-particip (pisah → jesm pisal).'}
                        </Text>
                    </Card>
                    <Card title={titles.podrobnosti} id="podrobnosti">
                        <div className="text-start">
                            <p>
                                Pri stvorjenju tutoj stranice jest upotrěbjeny dokument «Medžuslovjansky jezyk. Abeceda i pravopisanie» (Januar 2018):&nbsp;
                                <Link
                                    external
                                    href="https://interslavic-language.org/doc/ns-pregled.pdf"
                                    className="inline"
                                >
                                    [PDF]
                                </Link>
                            </p>
                            <p>
                                Podrobne pravila pravopisanja je možno najdti na oficialnyh sajtah:&nbsp;
                                <Link
                                    external
                                    href="http://steen.free.fr/interslavic/grammar.html"
                                    className="inline"
                                >
                                    steen.free.fr/interslavic/grammar.html
                                </Link>
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        )
    }

    private onWheel() {
        this.userEvent = true
    }
    private onScroll() {
        const scrollPosition = this.containerRef.current.scrollTop
        let activeId
        let minDistance = Number.MAX_SAFE_INTEGER
        const diff = this.containerRef.current.offsetTop + 100
        const distance = {}
        const titleElements = Object.keys(titles).map((id) => document.getElementById(id))
        titleElements.forEach((item) => {
            const id = item.getAttribute('id')
            distance[id] = Math.abs((item.offsetTop - diff) - scrollPosition)
        })
        for (const id in distance) {
            if (distance[id] < minDistance) {
                minDistance = distance[id]
                activeId = id
            }
        }
        if (activeId !== this.activeId) {
            document.getElementById(this.getLinkId(this.activeId)).classList.remove('selected')
            document.getElementById(this.getLinkId(activeId)).classList.add('selected')
            this.activeId = activeId
            if (this.userEvent) {
                // location.hash = activeId;
            }
        }
    }
    private getLinkId(id: string): string {
        return `link_${id}`
    }
}
