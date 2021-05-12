/*
* Source http://steen.free.fr http://steen.free.fr/scripts/transliteration.js
*/

/* tslint:disable */

export function transliterate(iSource, type, flav, caps, nms) {
    var text = iSource;
    var result = "";

    if (!flav) {
        flav = "2";
    }
    if (caps == 0) {
    }
    else if (caps == 1) {
        iSource = iSource.toUpperCase();
    }
    else if (caps == 2) {
        iSource = iSource.toLowerCase();
    }

    if (nms != "2") {
        nms = 1;
    }

    if ((type == 2) && (flav == "2")) {
        flav = "3";
    }

    iSource = iSource.replace(/{/g, "<{");
    iSource = iSource.replace(/}/g, "}>");

    iSource = iSource.replace(/'''/g, "❸");
    iSource = iSource.replace(/''/g, "❷");
    iSource = iSource.replace(/'‘’‛/g, "’");
    iSource = iSource.replace(/\t/g, "₮");
    iSource = iSource.replace(/\n/g, "₦");

    var teken = [];
    teken[0] = '!';
    teken[1] = '"';
    teken[2] = '&';
    teken[3] = '(';
    teken[4] = ')';
    teken[5] = ',';
    teken[6] = '-';
    teken[7] = '.';
    teken[8] = '/';
    teken[9] = ':';
    teken[10] = ';';
    teken[11] = 'Ƹ';
    teken[12] = 'Ǯ';
    teken[13] = '?';
    teken[14] = '[';
    teken[15] = ']';
    teken[16] = '{';
    teken[17] = '}';
    teken[18] = '|';
    teken[19] = '«';
    teken[20] = '»';
    teken[21] = '–';
    teken[22] = '—';
    teken[23] = '‚';
    teken[24] = '%';
    teken[25] = '“';
    teken[26] = '”';
    teken[27] = '„';
    teken[28] = '‟';
    teken[29] = '|';
    teken[30] = '=';
    teken[31] = '₮';
    teken[32] = '₦';
    teken[33] = '❷';
    teken[34] = '❸';

    while (iSource != "") {
        var nextW = "";
        var nextSpace = iSource.indexOf(" ");
        var nextHook = iSource.indexOf("<");

        var x;
        for (x in teken) {
            if ((iSource.indexOf(teken[x]) < nextSpace) && (iSource.indexOf(teken[x]) > -1)) {
                nextSpace = iSource.indexOf(teken[x]);
            }
            else if ((nextSpace == -1) && (iSource.indexOf(teken[x]) > -1)) {
                nextSpace = iSource.indexOf(teken[x]);
            }
        }


        if ((nextHook != -1) && ((nextSpace == -1) || (nextHook < nextSpace))) {
            nextW = iSource.substring(0, nextHook);
            iSource = iSource.substring(nextHook + 1, iSource.length);
            result += transliterateW(nextW, type, flav, nms);
            result += "<";

            var nextRHook = iSource.indexOf(">");
            if (nextRHook != -1) {
                nextW = iSource.substring(0, nextRHook);
                iSource = iSource.substring(nextRHook + 1, iSource.length);

                if ((type > 4) && (nextW.indexOf("|") != -1)) {
                    nextW = nextW.substring(nextW.indexOf("|") + 1, nextW.length);
                    result = result.substring(0, result.length - 1) + transliterateW(nextW, type, flav, nms);
                    result += ">";
                }
                else if ((type < 5) && (nextW.indexOf("|") != -1)) {
                    nextW = nextW.substring(0, nextW.indexOf("|"));
                    result += nextW;
                }
                else {
                    result += nextW;
                    result += ">";
                }
            }
        }
        else if (nextSpace == -1) {
            nextW = iSource;
            iSource = "";
            result += transliterateW(nextW, type, flav, nms);
        }
        else if (nextSpace == 0) {
            result += iSource.charAt(nextSpace);
            iSource = iSource.substring(1, iSource.length);
        }
        else {
            nextW = iSource.substring(0, nextSpace);
            result += transliterateW(nextW, type, flav, nms);

            var leesteken = iSource.charAt(nextSpace);
            if (type == 17) {
                if (leesteken == ".") {
                    leesteken = "።";
                }
                else if (leesteken == ",") {
                    leesteken = "፣";
                }
                else if (leesteken == ";") {
                    leesteken = "፤";
                }
                else if (leesteken == ":") {
                    leesteken = "፥";
                }
            }
            else if (type == 18) {
                if (leesteken == ".") {
                    leesteken = "।";
                }
            }
            result += leesteken;
            iSource = iSource.substring(nextSpace + 1, iSource.length);
        }

    }
    result = result.replace(/<{/g, "");
    result = result.replace(/}>/g, "");
    result = result.replace(/₮/g, '\t');
    result = result.replace(/₦/g, '\n');
    result = result.replace(/❸/g, "'''");
    result = result.replace(/❷/g, "''");


    return result;
}

export function transliterateW (iW, type, flav, nms)
{
    //symbol % marks the borders of the %word%
    iW = "%" + iW + "%";
    let OrigW = iW;
    iW = iW.toLowerCase();
    if (nms == 1) { iW = nmsify (iW); }

    // 'ŕ' remains between two consonants, in other cases is replaced by 'ř'
    iW = iW.replace (/ŕ/g,"ř");
    var aPos = iW.indexOf ("ř");
    var vowel = /[aeiouyąęųåėȯèòěê]/;
    if  ((aPos > 1) && (iW.charAt (aPos - 1) != "%") && (vowel.test (iW.charAt (aPos - 1)) == false) && (vowel.test (iW.charAt (aPos + 1)) == false)) {
        iW = iW.substring (0, aPos) + "ŕ" + iW.substring (aPos + 1, iW.length);
    }

    // 'r' is replaced by 'ŕ' or 'ṙ' between two consonants except 'j': 'ŕ' after [šžčc], 'ṙ' in other cases
    iW = iW.replace (/rj/g, "Rj");
    iW = iW.replace (/jr/g, "jR");
    var rPos = iW.indexOf ("r");
    var vowel = /[aeiouyąęųåėȯèòěê]/;
    if  ((rPos > 1) && (iW.charAt (rPos - 1) != "%") && (vowel.test (iW.charAt (rPos - 1)) == false) && (vowel.test (iW.charAt (rPos + 1)) == false))  {
        iW = iW.substring (0, rPos) + "ṙ" + iW.substring (rPos + 1, iW.length);
        // iW = iW.replace (/’ṙ/, "ṙ");
        // iW = iW.replace (/jṙ/, "ŕ");
        iW = iW.replace (/([šžčc])ṙ/g,"$1ŕ");
    }
    iW = iW.replace (/R/g, "r");
    // 'x' is replaced by 'ks'
    iW = iW.replace (/x/g,"ks");
    // inserting auxiliary symbol 'ı' after soft consonants
    iW = iW.replace (/([ńľřťďśź])j/g,"$1ıj");
    // interting delimiter # in some cases
    iW = iW.replace (/([dsz])j/g,"$1#j");
    iW = iW.replace (/%obj/g,"ob#j");
    iW = iW.replace (/%neobj/g,"neob#j");
    iW = iW.replace (/%vj/g,"v#j");


    /* FLAVORIZACIJE */

    // 2 - ethymological, 3 - standard, 4 - slovianto
    if ((flav == "2") || (flav == "3") || (flav == "4")) {
        iW = iW.replace (/ê/g,"ě");
        iW = iW.replace (/ȯ%/g,"o%");
        iW = iW.replace (/ŭ/g,"v");
        iW = iW.replace (/[ṱḓ]/g,"");
        iW = iW.replace (/[’`]/g,"#%");
        iW = iW.replace (/([čšžj])ě/g,"$1e");
    }
    // 3 - standard, 4 - slovianto
    if ((flav == "3") || (flav == "4"))  {
        iW = iW.replace (/[ęė]/g,"e");
        iW = iW.replace (/å/g,"a");
        iW = iW.replace (/ȯ/g,"o");
        iW = iW.replace (/ų/g,"u");
        iW = iW.replace (/ć/g,"č");
        iW = iW.replace (/đ/g,"dž");
        iW = iW.replace (/ř/g,"r");
        iW = iW.replace (/ľ/g,"l");
        iW = iW.replace (/ń/g,"n");
        iW = iW.replace (/ť/g,"t");
        iW = iW.replace (/ď/g,"d");
        iW = iW.replace (/ś/g,"s");
        iW = iW.replace (/ź/g,"z");
    }
    // slovianto
    if (flav == "4")  {
        iW = iW.replace (/ě/g,"e");
        iW = iW.replace (/y/g,"i");
    }
    // northern flavorisation
    else if (flav == "S")  {
        iW = iW.replace (/ć/g,"č");
        iW = iW.replace (/đ/g,"dž");
        iW = iW.replace (/ṱ/g,"t");
        iW = iW.replace (/ḓ/g,"d");
        iW = iW.replace (/[êė]/g,"e");
        iW = iW.replace (/[åȯ]/g,"o");
        iW = iW.replace (/ų/g,"u");
        iW = iW.replace (/ŭ/g,"v");
        iW = iW.replace (/([šžčcj])ę/g,"$1a");
        iW = iW.replace (/ę/g,"ja");
        iW = iW.replace (/([šžčcj])ě/g,"$1e");
        iW = iW.replace (/([ŕṙ])%/g,"r%");
        iW = iW.replace (/ṙ/g,"or");
        iW = iW.replace (/ŕ/g,"er");
        iW = iW.replace (/([kgh])y/g,"$1i");
        iW = iW.replace (/[`’]/g,"#%");
    }
    // southern flavorisation
    else if (flav == "J") {
        iW = iW.replace (/ų/g,"u");
        iW = iW.replace (/ŭ/g,"v");
        iW = iW.replace (/ľ/g,"l");
        iW = iW.replace (/ř/g,"r");
        iW = iW.replace (/ń/g,"n");
        iW = iW.replace (/ť/g,"t");
        iW = iW.replace (/ď/g,"d");
        iW = iW.replace (/ś/g,"s");
        iW = iW.replace (/ź/g,"z");
        iW = iW.replace (/šč/g,"št");
        iW = iW.replace (/[ṱḓ]/g,"");
        iW = iW.replace (/å/g,"a");
        iW = iW.replace (/[ęė]/g,"e");
        iW = iW.replace (/ê/g,"ě");
        iW = iW.replace (/y/g,"i");
        iW = iW.replace (/ȯ%/g,"o%");
        iW = iW.replace (/([šžčcj])ě/g,"$1e");
        iW = iW.replace (/[`’]/g,"#%");
        iW = iW.replace (/ı/g,"");
    }

    /* PISMA I PRAVOPISY */

    /* Latin alphabet */
    if (type == 1) {
        //ethymological
        if (flav == "2")  { 
            iW = iW.replace (/ṙ/g,"r");
            iW = iW.replace (/ř/g,"ŕ");
            iW = iW.replace (/ľ/g,"ĺ");
            iW = iW.replace (/ť/g,"t́");
            iW = iW.replace (/ď/g,"d́");
            iW = iW.replace (/([čšžj])ŕ/g,"$1r");
        }
        //standard, slovianto, southern
        else if ((flav == "3") || (flav == "4") || (flav == "J")) {
            iW = iW.replace (/[ṙŕ]/g,"r");
            iW = iW.replace (/ȯ/g,"ă");
        }
        //northern
        else if (flav == "S") {
            iW = iW.replace (/ě/g,"ьe");
            iW = jgedoe (iW, type);
            iW = iW.replace (/Ьıь/g,"i");
            iW = iW.replace (/([čšžj])ь/g,"$1i");
            iW = iW.replace (/ь/g,"i");
            /* iW = iW.replace (/li/g,"lii");
            iW = iW.replace (/l/g,"ł");
            iW = iW.replace (/łe/g,"le");
            iW = iW.replace (/łi/g,"l");
            iW = iW.replace (/ii/g,"i");
            iW = iW.replace (/łi/g,"l");
            iW = iW.replace (/łЬ/g,"l"); */
            iW = iW.replace (/h/g,"ch");
            iW = iW.replace (/lЬ/g,"ľ");
            iW = iW.replace (/nЬ/g,"ń");
            iW = iW.replace (/rЬ/g,"ŕ");
            iW = iW.replace (/tЬ/g,"ť");
            iW = iW.replace (/dЬ/g,"ď");
            iW = iW.replace (/sЬ/g,"ś");
            iW = iW.replace (/zЬ/g,"ź");
            iW = iW.replace (/Ь/g,"j");
        }
    }

    /* ASCII */
    else if (type == 2)  {
        iW = iW.replace (/[ṙŕ]/g,"r");
        iW = iW.replace (/š/g,"sz");
        iW = iW.replace (/[ćč]/g,"cz");
        iW = iW.replace (/ž/g,"zs");
        iW = iW.replace (/đ/g,"dzs");
        iW = iW.replace (/ě/g,"je");
        iW = iW.replace (/å/g,"a");
        iW = iW.replace (/[ęė]/g,"e");
        iW = iW.replace (/ȯ/g,"o");
        iW = iW.replace (/ų/g,"u");
    }

    /* Polish alphabet */
    else if (type == 3)  {
        iW = jgedoe (iW, type);
        iW = iW.replace (/å/g,"a");
        iW = iW.replace (/ė/g,"e");
        iW = iW.replace (/ě/g,"ьe");
        iW = iW.replace (/ȯ/g,"o");
        iW = iW.replace (/ṙ/g,"or");
        iW = iW.replace (/ŕ/g,"er");
        iW = iW.replace (/ŭ/g,"u");
        iW = iW.replace (/[ṱḓ’]/g,"");
        iW = iW.replace (/lь/g,"ĺ");
        iW = iW.replace (/lЬ/g,"ĺ");
        iW = iW.replace (/li/g,"ĺi");
        iW = iW.replace (/rzь/g,"rz");
        iW = iW.replace (/ь/g,"i");
        iW = iW.replace (/Ь/g,"ь");
        iW = iW.replace (/ьý/g,"ьí");
        iW = iW.replace (/ų/g,"ą");
        iW = iW.replace (/š/g,"sz");
        iW = iW.replace (/č/g,"cz");
        iW = iW.replace (/rь/g,"ŕ");
        iW = iW.replace (/ž/g,"ż");
        iW = iW.replace (/v/g,"w");
        iW = iW.replace (/h/g,"ch");
        iW = iW.replace (/l/g,"ł");
        iW = iW.replace (/ĺ/g,"l");
        iW = iW.replace (/tь/g,"ť");
        iW = iW.replace (/ti/g,"ti");
        iW = iW.replace (/dь/g,"ď");
        iW = iW.replace (/di/g,"di");
        iW = iW.replace (/cь/g,"ć");
        iW = iW.replace (/ci/g,"ci");
        iW = iW.replace (/dzь/g,"dź");
        iW = iW.replace (/dzi/g,"dzi");
        iW = iW.replace (/sь/g,"ś");
        iW = iW.replace (/zь/g,"ź");
        iW = iW.replace (/lь/g,"ĺ");
        iW = iW.replace (/nь/g,"ń");
        iW = iW.replace (/ь/g,"j");
        iW = iW.replace (/ii/g,"i");
        iW = iW.replace (/ji/g,"i");
        iW = iW.replace (/iy/g,"i");
        iW = iW.replace (/jy/g,"i");
        iW = iW.replace (/([kg])y/g,"$1i");
        iW = iW.replace (/([kg])e/g,"$1ie");
        iW = iW.replace (/jn/g,"#jn");
        iW = iW.replace (/js/g,"#js");
        iW = iW.replace (/cyj/g,"cj");
        iW = iW.replace (/cyi/g,"cji");
        iW = iW.replace (/lij/g,"li");
        iW = iW.replace (/ya/g,"ja");
        iW = iW.replace (/yą/g,"ją");
        iW = iW.replace (/yu/g,"ju");
        iW = iW.replace (/yo/g,"jo");
        iW = iW.replace (/rzj/g,"rj");
        iW = iW.replace (/#/g,"");
    }

    /* Cyrillic alphabet: 5 - standard, 6 - traditional */
    if ((type == 5) || (type == 6)) {
        iW = iW.replace (/lj/g,"љ");
        iW = iW.replace (/nj/g,"њ");
        iW = iW.replace (/a/g,"а");
        iW = iW.replace (/å/g,"ӑ");
        iW = iW.replace (/b/g,"б");
        iW = iW.replace (/c/g,"ц");
        iW = iW.replace (/ć/g,"ћ");
        iW = iW.replace (/č/g,"ч");
        iW = iW.replace (/[dḓ]/g,"д");
        iW = iW.replace (/ď/g,"дь");
        iW = iW.replace (/đ/g,"ђ");
        iW = iW.replace (/e/g,"е");
        iW = iW.replace (/ę/g,"ѧ");
        iW = iW.replace (/ě/g,"є");
        iW = iW.replace (/f/g,"ф");
        iW = iW.replace (/g/g,"г");
        iW = iW.replace (/h/g,"х");
        iW = iW.replace (/i/g,"и");
        iW = iW.replace (/j/g,"ј");
        iW = iW.replace (/k/g,"к");
        iW = iW.replace (/l/g,"л");
        iW = iW.replace (/ľ/g,"ль");
        iW = iW.replace (/m/g,"м");
        iW = iW.replace (/n/g,"н");
        iW = iW.replace (/ń/g,"нь");
        iW = iW.replace (/o/g,"о");
        iW = iW.replace (/ȯ/g,"ъ");
        iW = iW.replace (/p/g,"п");
        iW = iW.replace (/r/g,"р");
        iW = iW.replace (/ř/g,"рь");
        iW = iW.replace (/s/g,"с");
        iW = iW.replace (/ś/g,"сь");
        iW = iW.replace (/š/g,"ш");
        iW = iW.replace (/[tṱ]/g,"т");
        iW = iW.replace (/ť/g,"ть");
        iW = iW.replace (/u/g,"у");
        iW = iW.replace (/ų/g,"ѫ");
        iW = iW.replace (/ŭ/g,"ў");
        iW = iW.replace (/v/g,"в");
        iW = iW.replace (/y/g,"ы");
        iW = iW.replace (/z/g,"з");
        iW = iW.replace (/ź/g,"зь");
        iW = iW.replace (/ž/g,"ж");
        iW = iW.replace (/’/g,"ъ");
        iW = iW.replace (/`/g,"’");
        // extended notation
        if (flav == "1")	{
            iW = iW.replace (/ṙ/g,"ър");
            iW = iW.replace (/ŕ/g,"ьр");
            iW = iW.replace (/ě/g,"Ê");
            iW = iW.replace (/[ḓṱ]/g,"");
        }
        // any flavorisation
        else { 
            iW = iW.replace (/[ṙŕ]/g,"р");
            iW = iW.replace (/ė/g,"е");
            // southern
            if (flav == "J")  {
                iW = iW.replace (/є/g,"е");
                iW = iW.replace (/л#ј/g,"љ");
                iW = iW.replace (/н#ј/g,"њ");
            }
            // ethymological
            if (flav == "2") {
                //returned letter "ѣ" at the request of users
                iW = iW.replace (/є/g,"ѣ"); // DŠ  !!!
            }
        }
        // traditional iotated cyrillic
        if (type == 6)  {
            iW = iW.replace (/љ/g,"ль");
            iW = iW.replace (/њ/g,"нь");
            iW = iW.replace (/[êє]/g,"ѣ");
            iW = iW.replace (/[јь]а/g,"я");
            iW = iW.replace (/[јь]ѣ/g,"ꙓ");
            iW = iW.replace (/[јь]ѧ/g,"ѩ");
            iW = iW.replace (/[јь]у/g,"ю");
            iW = iW.replace (/[јь]ѫ/g,"ѭ");
            iW = iW.replace (/ј/g,"й");
            iW = iW.replace (/ė/g,"ь");
            iW = iW.replace (/ȯ/g,"ъ");
            iW = iW.replace (/ṙ/g,"ър");
            iW = iW.replace (/ŕ/g,"ьр");
            iW = iW.replace (/ьь/g,"ь");
            // extended notation
            if (flav == "1")	{
                iW = iW.replace (/[йь]е/g,"ѥ");
                iW = iW.replace (/[йь]и/g,"ӥ");
                iW = iW.replace (/ш[чћ]/g,"щ");
            }
            // any flavorisation
            else {
                iW = iW.replace (/([#%аеєиоуы])е/g,"$1э");
                iW = iW.replace (/([#%])й([еи])/g,"$1$2");
                iW = iW.replace (/([аеєиоуы])й([еи])/g,"$1$2");
                iW = iW.replace (/й([еи])/g,"ь$1");
                iW = iW.replace (/ѣ/g,"е");
                iW = iW.replace (/ьıь/g,"ь");
            }
            iW = iW.replace (/#/g,"’");
        }
    }

    /* Glagolitic alphabet */
    /*else if (type == 7)  {
        if (flav == "J") {
            iW = iW.replace (/[ŕṙ]/g,"r");
            iW = iW.replace (/ȯ/g,"o");
            iW = iW.replace (/ě/g,"e");
        } else {
            iW = iW.replace(/ı/g,"");
            iW = jgedoe (iW, type);
            iW = iW.replace(/Ьj/g,"ⰹ");
            iW = iW.replace(/ь([ei])/g,"ⱐj$1");
            iW = iW.replace(/je/g,"e");
            iW = iW.replace(/ji/g,"i");
            iW = iW.replace(/[jь]a/g,"ě");
            iW = iW.replace(/[jь]ę/g,"ⱗ");
            iW = iW.replace(/[jь]o/g,"ⱖ");
            iW = iW.replace(/[jь]ų/g,"ⱙ");
            iW = iW.replace(/[jь]u/g,"ⱓ");
            iW = iW.replace(/šč/g,"ⱋ");
            iW = iW.replace(/dz/g,"ⰷ");
            iW = iW.replace(/[aå]/g,"ⰰ");
            iW = iW.replace(/b/g,"ⰱ");
            iW = iW.replace(/c/g,"ⱌ");
            iW = iW.replace(/ć/g,"ⰼ");
            iW = iW.replace(/č/g,"ⱍ");
            iW = iW.replace(/d/g,"ⰴ");
            iW = iW.replace(/e/g,"ⰵ");
            iW = iW.replace(/[ėьЬ]/g,"ⱐ");
            iW = iW.replace(/ę/g,"ⱔ");
            iW = iW.replace(/ě/g,"ⱑ");
            iW = iW.replace(/f/g,"ⱇ");
            iW = iW.replace(/g/g,"ⰳ");
            iW = iW.replace(/h/g,"ⱈ");
            iW = iW.replace(/[ij]/g,"ⰻ"); // ⰺ: INITIAL IZHE
            iW = iW.replace(/k/g,"ⰽ");
            iW = iW.replace(/l/g,"ⰾ");
            iW = iW.replace(/m/g,"ⰿ");
            iW = iW.replace(/n/g,"ⱀ");
            iW = iW.replace(/o/g,"ⱁ");
            iW = iW.replace(/[ȯ#]/g,"ⱏ");
            iW = iW.replace(/p/g,"ⱂ");
            iW = iW.replace(/r/g,"ⱃ");
            iW = iW.replace(/ṙ/g,"ⱃⱏ");
            iW = iW.replace(/ŕ/g,"ⱃⱐ");
            iW = iW.replace(/s/g,"ⱄ");
            iW = iW.replace(/š/g,"ⱎ");
            iW = iW.replace(/t/g,"ⱅ");
            iW = iW.replace(/þ/g,"ⱚ");
            iW = iW.replace(/u/g,"ⱆ");
            iW = iW.replace(/ŭ/g,"ⱛ");
            iW = iW.replace(/ų/g,"ⱘ");
            iW = iW.replace(/v/g,"ⰲ");
            iW = iW.replace(/y/g,"ⱏⰹ");
            iW = iW.replace(/z/g,"ⰸ");
            iW = iW.replace(/ž/g,"ⰶ");
        }
    }*/

    /* Glagolitic alphabet by Rafail Gasparyan */
    else if (type == 7) {
        const GL_AZU = 'ⰰ';
        const GL_BUKY = 'ⰱ';
        const GL_VEDE = 'ⰲ';
        const GL_GLAGOLI = 'ⰳ';
        const GL_DOBRO = 'ⰴ';
        const GL_YESTU = 'ⰵ';
        const GL_ZHIVETE = 'ⰶ';
        const GL_DZELO = 'ⰷ';
        const GL_ZEMLJA = 'ⰸ';
        const GL_IZHE = 'ⰹ';
        const GL_INITIAL_IZHE = 'ⰺ';
        const GL_I = 'ⰻ';
        const GL_DJERVI = 'ⰼ';
        const GL_KAKO = 'ⰽ';
        const GL_LJUDIJE = 'ⰾ';
        const GL_MYSLITE = 'ⰿ';
        const GL_NASHI = 'ⱀ';
        const GL_ONU = 'ⱁ';
        const GL_POKOJI = 'ⱂ';
        const GL_RITSI = 'ⱃ';
        const GL_SLOVO = 'ⱄ';
        const GL_TVRIDO = 'ⱅ';
        const GL_UKU = 'ⱆ';
        const GL_FRITU = 'ⱇ';
        const GL_HERU = 'ⱈ';
        const GL_OTU = 'ⱉ';
        const GL_PE = 'ⱊ';
        const GL_SHTA = 'ⱋ';
        const GL_TSI = 'ⱌ';
        const GL_CHRIVI = 'ⱍ';
        const GL_SHA = 'ⱎ';
        const GL_YERU = 'ⱏ';
        const GL_YERI = 'ⱐ';
        const GL_YATI = 'ⱑ';
        const GL_SPIDERY_HA = 'ⱒ';
        const GL_YU = 'ⱓ';
        const GL_SMALL_YUS = 'ⱔ';
        const GL_SMALL_YUS_WITH_TAIL = 'ⱕ';
        const GL_YO = 'ⱖ';
        const GL_IOTATED_SMALL_YUS = 'ⱗ';
        const GL_BIG_YUS = 'ⱘ';
        const GL_IOTATED_BIG_YUS = 'ⱙ';
        const GL_FITA = 'ⱚ';
        const GL_IZHITSA = 'ⱛ';
        const GL_SHTAPIC = 'ⱜ';
        const GL_TROKUTASTI_A = 'ⱝ';
        const GL_LATINATE_MYSLITE = 'ⱞ';

        iW = iW.replace(/ı/g,"");
        iW = iW.replace (/ṙ/g,"r");
        iW = iW.replace (/ř/g,"ŕ");
        iW = iW.replace (/([čšžj])ŕ/g,"$1r");
        //standard, slovianto
        if (flav == "3" || flav == "4") {
            iW = iW.replace (/ŕ/g,"r");
        }
        //southern
        if (flav == "J") {
            iW = iW.replace (/ŕ/g,"r");
            iW = iW.replace (/ȯ/g,"o");
            iW = iW.replace (/ě/g,"e");
        } 
        iW = iW.replace (/ń/g,"nь");
        iW = iW.replace (/ľ/g,"lь");
        iW = iW.replace (/ŕ/g,"rь");
        iW = iW.replace (/ť/g,"tь");
        iW = iW.replace (/ď/g,"dь");
        iW = iW.replace (/ś/g,"sь");
        iW = iW.replace (/ź/g,"zь");
        iW = iW.replace (/([ln])ьę/g,"$1" + GL_IOTATED_SMALL_YUS);
        iW = iW.replace (/([ln])ьų/g,"$1" + GL_IOTATED_BIG_YUS);
        iW = iW.replace (/([dzrstln])ьu/g,"$1" + GL_YU);
        iW = iW.replace (/([dzrstln])ьa/g,"$1" + GL_TROKUTASTI_A);
        iW = iW.replace (/([dzrstln])ьje/g,"$1" + GL_YERI + GL_YESTU);
        iW = iW.replace (/([dzrstln])ьję/g,"$1" + GL_IOTATED_SMALL_YUS);
        iW = iW.replace (/([dzrstln])ьji/g,"$1" + GL_IZHE + GL_I);
        iW = iW.replace (/([dzrstln])ьju/g,"$1" + GL_YERI + GL_YU);
        iW = iW.replace (/([dzrstln])ьjų/g,"$1" + GL_IOTATED_BIG_YUS);
        iW = iW.replace (/([dzrstln])ьja/g, "$1" + GL_YERI + GL_TROKUTASTI_A);
        iW = iW.replace (/([dzrstln])ьjo/g,"$1" + GL_YO);

        iW = iW.replace (/([%aeėioȯuyąęųåěê])jo/g,"$1" + GL_IZHE + GL_ONU);

        iW = iW.replace (/je/g,GL_IZHE + GL_YESTU);
        iW = iW.replace (/ję/g,GL_IOTATED_SMALL_YUS);
        iW = iW.replace (/ji/g,GL_IZHE + GL_I);
        iW = iW.replace (/ju/g,GL_YU);
        iW = iW.replace (/jų/g,GL_IOTATED_BIG_YUS);
        iW = iW.replace (/ja/g,GL_TROKUTASTI_A);
        iW = iW.replace (/jo/g,GL_YO);

        iW = iW.replace (/lj/g,GL_LJUDIJE + GL_YERI);
        iW = iW.replace (/nj/g,GL_NASHI + GL_YERI);
        iW = iW.replace (/(šč|šć)/g,GL_SHTA);
        iW = iW.replace (/a/g,GL_AZU);
        iW = iW.replace (/å/g,GL_OTU);
        iW = iW.replace (/b/g,GL_BUKY);
        iW = iW.replace (/c/g,GL_TSI);
        iW = iW.replace (/ć/g,GL_SHTA);
        iW = iW.replace (/č/g,GL_CHRIVI);
        iW = iW.replace (/[dḓ]/g,GL_DOBRO);
        iW = iW.replace (/dž/g,GL_DOBRO + GL_ZHIVETE);
        iW = iW.replace (/đ/g,GL_DJERVI);
        iW = iW.replace (/[eė]/g,GL_YESTU);
        iW = iW.replace (/ę/g,GL_SMALL_YUS);
        iW = iW.replace (/[êě]/g,GL_YATI);
        iW = iW.replace (/f/g,GL_FRITU);
        iW = iW.replace (/g/g,GL_GLAGOLI);
        iW = iW.replace (/h/g,GL_HERU);
        iW = iW.replace (/i/g,GL_I);
        iW = iW.replace (/j/g,GL_IZHE);
        iW = iW.replace (/k/g,GL_KAKO);
        iW = iW.replace (/l/g,GL_LJUDIJE);
        iW = iW.replace (/m/g,GL_LATINATE_MYSLITE);
        iW = iW.replace (/n/g,GL_NASHI);
        iW = iW.replace (/o/g,GL_ONU);
        iW = iW.replace (/ȯ/g,GL_YERU);
        iW = iW.replace (/p/g,GL_POKOJI);
        iW = iW.replace (/[rṙ]/g,GL_RITSI);
        iW = iW.replace (/s/g,GL_SLOVO);
        iW = iW.replace (/š/g,GL_SHA);
        iW = iW.replace (/[tṱ]/g,GL_TVRIDO);
        iW = iW.replace (/u/g,GL_UKU);
        iW = iW.replace (/ų/g,GL_BIG_YUS);
        iW = iW.replace (/[vŭ]/g,GL_VEDE);
        iW = iW.replace (/y/g,GL_YERI + GL_IZHE);
        iW = iW.replace (/z/g,GL_ZEMLJA);
        iW = iW.replace (/ž/g,GL_ZHIVETE);
        iW = iW.replace (/ь/g,GL_YERI);
        iW = iW.replace (/[’#]/g,GL_YERU);
        iW = iW.replace (/`/g,"’");
    }

    /* IPA */
    else if (type == 10)  {
        iW = iW.replace (/nads([eę])/g,"nac$1");
        iW = iW.replace (/([ľńřťďśź])ıj/g,"$1i̯");
        iW = iW.replace (/e/g,"ɛ");
        iW = iW.replace (/ė/g,"ɜ");
        iW = iW.replace (/ě/g,"ьɛ");
        iW = iW.replace (/ę/g,"ьæ");
        iW = iW.replace (/ŕ/g,"ьǝr");
        iW = iW.replace (/([ščžj])ь/g,"$1");
        iW = iW.replace (/y/g,"ɪ");
        iW = iW.replace (/å/g,"ɒ");
        iW = iW.replace (/o/g,"ɔ");
        iW = iW.replace (/[ŕṙ]/g,"ər");
        iW = iW.replace (/[ȯ’]/g,"ə");
        iW = iW.replace (/ų/g,"ʊ");
        iW = iW.replace (/c/g,"t͡s");
        iW = iW.replace (/č/g,"t͡ʃ");
        iW = iW.replace (/šć/g,"ɕt͡ɕ");
        iW = iW.replace (/ć/g,"t͡ɕ");
        iW = iW.replace (/dz/g,"d͡z");
        iW = iW.replace (/dž/g,"d͡ʒ");
        iW = iW.replace (/žđ/g,"ʑd͡ʑ");
        iW = iW.replace (/đ/g,"d͡ʑ");
        iW = iW.replace (/x/g,"ks");
        iW = iW.replace (/h/g,"x");
        iW = iW.replace (/š/g,"ʃ");
        iW = iW.replace (/ž/g,"ʒ");
        iW = iW.replace (/sť/g,"sʲtʲ");
        iW = iW.replace (/zď/g,"zʲdʲ");
        iW = iW.replace (/ť/g,"tʲ");
        iW = iW.replace (/tь/g,"tʲ");
        iW = iW.replace (/ď/g,"dʲ");
        iW = iW.replace (/dь/g,"dʲ");
        iW = iW.replace (/ś/g,"sʲ");
        iW = iW.replace (/sь/g,"sʲ");
        iW = iW.replace (/ź/g,"zʲ");
        iW = iW.replace (/zь/g,"zʲ");
        iW = iW.replace (/ř/g,"rʲ");
        iW = iW.replace (/r[ьj]/g,"rʲ");
        iW = iW.replace (/ń/g,"ɲ");
        iW = iW.replace (/n[ьj]/g,"ɲ");
        iW = iW.replace (/ľ/g,"ʎ");
        iW = iW.replace (/l[ьj]/g,"ʎ");
        iW = iW.replace (/ь/g,"j");
        iW = iW.replace (/l/g,"ɫ");
        iW = iW.replace (/ɫ([ii̯e])/g,"l$1");
        iW = iW.replace (/t͡sj/g,"t͡sʲ");
        iW = iW.replace (/d͡zj/g,"d͡zʲ");
    }

    /* Albansky */
    else if (type == 11) {
        iW = iW.replace (/[ŕṙ]/g,"ër");
        iW = iW.replace (/[ĺŀ]/g,"ël");
        iW = iW.replace (/å/g,"a");
        iW = iW.replace (/ě/g,"je");
        iW = iW.replace (/[ėȯ’]/g,"ë");
        iW = iW.replace (/ų/g,"u");
        iW = iW.replace (/ę/g,"je");
        iW = iW.replace (/ć/g,"q");
        iW = iW.replace (/đ/g,"xh");
        iW = iW.replace (/šj/g,"š");
        iW = iW.replace (/čj/g,"č");
        iW = iW.replace (/žj/g,"ž");
        iW = iW.replace (/jj/g,"j");
        iW = jgedoe (iW, type);
        iW = iW.replace (/rЬ/g,"R");
        iW = iW.replace (/rь/g,"Rj");
        iW = iW.replace (/rj/g,"Rj");
        iW = iW.replace (/ri/g,"Ri");
        iW = iW.replace (/%r/g,"%rr");
        iW = iW.replace (/R/g,"r");
        iW = iW.replace (/[Ьь]/g,"j");
        iW = iW.replace (/dž/g,"xh");
        iW = iW.replace (/dz/g,"x");
        iW = iW.replace (/šč/g,"shq");
        iW = iW.replace (/š/g,"sh");
        iW = iW.replace (/ž/g,"zh");
        iW = iW.replace (/[ćč]/g,"ç");
        iW = iW.replace (/tj/g,"q");
        iW = iW.replace (/dj/g,"gj");
        iW = iW.replace (/sj/g,"s");
        iW = iW.replace (/zj/g,"z");
        iW = iW.replace (/le/g,"Ľe");
        iW = iW.replace (/li/g,"Ľi");
        iW = iW.replace (/lj/g,"Ľ");
        iW = iW.replace (/l/g,"ll");
        iW = iW.replace (/Ľ/g,"l");
        iW = iW.replace (/y/g,"i");
    }

    /* Armensky */
    else if (type == 12)  {
        iW = jgedoe (iW, type);
        iW = iW.replace (/ıь/g,"i");
        iW = iW.replace (/[ěę]/g,"je");
        iW = iW.replace (/[ṙŕ]/g,"ȯr");
        iW = iW.replace (/dź/g,"dž");
        iW = iW.replace (/šj/g,"š");
        iW = iW.replace (/čj/g,"č");
        iW = iW.replace (/žj/g,"ž");
        iW = iW.replace (/jj/g,"j");
        iW = iW.replace (/dz/g,"ձ");
        iW = iW.replace (/dž/g,"ջ");
        iW = iW.replace (/a/g,"ա");
        iW = iW.replace (/b/g,"բ");
        iW = iW.replace (/g/g,"գ");
        iW = iW.replace (/d/g,"դ");
        iW = iW.replace (/%e/g,"է");
        iW = iW.replace (/e/g,"ե");
        iW = iW.replace (/z/g,"զ");
        iW = iW.replace (/[åėȯ’]/g,"ը");
        iW = iW.replace (/ž/g,"ժ");
        iW = iW.replace (/[iy]/g,"ի");
        iW = iW.replace (/l/g,"լ");
        iW = iW.replace (/h/g,"խ");
        iW = iW.replace (/c/g,"ծ");
        iW = iW.replace (/k/g,"կ");
        iW = iW.replace (/m/g,"մ");
        iW = iW.replace (/[jь]/g,"յ");
        iW = iW.replace (/Ь/g,"");
        iW = iW.replace (/n/g,"ն");
        iW = iW.replace (/š/g,"շ");
        iW = iW.replace (/%o/g,"%օ");
        iW = iW.replace (/o/g,"ո");
        iW = iW.replace (/[čć]/g,"չ");
        iW = iW.replace (/p/g,"պ");
        iW = iW.replace (/%r/g,"%ռ");
        iW = iW.replace (/r/g,"ր");
        iW = iW.replace (/s/g,"ս");
        iW = iW.replace (/v/g,"վ");
        iW = iW.replace (/t/g,"տ");
        iW = iW.replace (/[uų]/g,"ու");
        iW = iW.replace (/f/g,"ֆ");
        iW = iW.replace (/,/g,",");
        iW = iW.replace (String.fromCharCode(46),":");
        iW = iW.replace (String.fromCharCode(63),"՞");
        iW = iW.replace (/;/g,"՝");
        iW = iW.replace (/!/g,"՜");
        iW = iW.replace (/«/g,"«");
        iW = iW.replace (/»/g,"»");
    }

    /* Gruzinsky */
    else if (type == 13) {
        iW = jgedoe (iW, type);
        iW = iW.replace (/ıь/g,"i");
        iW = iW.replace (/ć/g,"č");
        iW = iW.replace (/dź/g,"dž");
        iW = iW.replace (/ṙ/g,"or");
        iW = iW.replace (/ŕ/g,"or");
        iW = iW.replace (/[ěę]/g,"je");
        iW = iW.replace (/ij/g,"i");
        iW = iW.replace (/ji/g,"i");
        iW = iW.replace (/Ь/g,"");
        iW = iW.replace (/[iyjь]/g,"ი");
        iW = iW.replace (/იი/g,"ი");
        iW = iW.replace (/dž/g,"ჯ");
        iW = iW.replace (/[aå]/g,"ა");
        iW = iW.replace (/b/g,"ბ");
        iW = iW.replace (/g/g,"გ");
        iW = iW.replace (/d/g,"დ");
        iW = iW.replace (/[eė]/g,"ე");
        iW = iW.replace (/v/g,"ვ");
        iW = iW.replace (/z/g,"ზ");
        iW = iW.replace (/k/g,"კ");
        iW = iW.replace (/l/g,"ლ");
        iW = iW.replace (/m/g,"მ");
        iW = iW.replace (/n/g,"ნ");
        iW = iW.replace (/[oȯ’]/g,"ო");
        iW = iW.replace (/p/g,"პ");
        iW = iW.replace (/ž/g,"ჟ");
        iW = iW.replace (/r/g,"რ");
        iW = iW.replace (/s/g,"ს");
        iW = iW.replace (/t/g,"ტ");
        iW = iW.replace (/[uų]/g,"უ");
        iW = iW.replace (/f/g,"ფ");
        iW = iW.replace (/h/g,"ხ");
        iW = iW.replace (/š/g,"შ");
        iW = iW.replace (/[ćč]/g,"ჩ");
        iW = iW.replace (/c/g,"ც");
    }

    /* Grečsky */
    else if (type == 14)  {
        iW = iW.replace (/čt/g,"tzj");
        iW = iW.replace (/ć/g,"č");
        iW = iW.replace (/šč/g,"stzj");
        iW = iW.replace (/dź/g,"dzj");
        iW = iW.replace (/ṙ/g,"or");
        iW = iW.replace (/ŕ/g,"er");
        iW = iW.replace (/ę/g,"ě");
        iW = iW.replace (/pě/g,"pje");
        iW = iW.replace (/bě/g,"bje");
        iW = iW.replace (/vě/g,"vje");
        iW = iW.replace (/mě/g,"mje");
        iW = iW.replace (/tě/g,"tje");
        iW = iW.replace (/dě/g,"dje");
        iW = iW.replace (/ně/g,"nje");
        iW = iW.replace (/å/g,"a");
        iW = iW.replace (/ě/g,"e");
        iW = iW.replace (/ȯ/g,"o");
        iW = iW.replace (/ų/g,"u");
        iW = iW.replace (/š/g,"sj");
        iW = iW.replace (/ž/g,"zj");
        iW = iW.replace (/č/g,"tzj");
        iW = iW.replace (/jj/g,"j");
        iW = iW.replace (/ıj/g,"ϊ");

        iW = jgedoe (iW, type);

        iW = iW.replace (/ogo%/g,"ogω%");
        iW = iW.replace (/ego%/g,"egω%");
        iW = iW.replace (/%od/g,"%ωt");
        iW = iW.replace (/%v`/g,"%vo");
        iW = iW.replace (/%s`/g,"%so");
        iW = iW.replace (/Ь/g,"");
        iW = iW.replace (/jь/g,"ь");
        iW = iW.replace (/ija/g,"ьa");
        iW = iW.replace (/ije/g,"ьe");
        iW = iW.replace (/iji/g,"ьi");
        iW = iW.replace (/ijo/g,"ьo");
        iW = iW.replace (/iju/g,"ьu");
        iW = iW.replace (/tj/g,"t");
        iW = iW.replace (/dj/g,"d");
        iW = iW.replace (/sj/g,"s");
        iW = iW.replace (/zj/g,"z");
        iW = iW.replace (/rj/g,"r");
        iW = iW.replace (/ks/g,"ξ");
        iW = iW.replace (/ps/g,"ψ");
        iW = iW.replace (/a/g,"VαV");
        iW = iW.replace (/v/g,"β");
        iW = iW.replace (/b/g,"μπ");
        iW = iW.replace (/g/g,"γ");
        iW = iW.replace (/d/g,"δ");
        iW = iW.replace (/e/g,"VεV");
        iW = iW.replace (/z/g,"ζ");
        iW = iW.replace (/i/g,"VηV");
        iW = iW.replace (/j/g,"ι");
        iW = iW.replace (/ь/g,"ι");
        iW = iW.replace (/k/g,"κ");
        iW = iW.replace (/l/g,"λ");
        iW = iW.replace (/m/g,"μ");
        iW = iW.replace (/n/g,"ν");
        iW = iW.replace (/o/g,"VοV");
        iW = iW.replace (/p/g,"π");
        iW = iW.replace (/r/g,"ρ");
        iW = iW.replace (/s%/g,"ς%");
        iW = iW.replace (/s/g,"σ");
        iW = iW.replace (/t/g,"τ");
        iW = iW.replace (/y/g,"VυV");
        iW = iW.replace (/u/g,"VουV");
        iW = iW.replace (/f/g,"φ");
        iW = iW.replace (/h/g,"χ");
        iW = iW.replace (/c/g,"τζ");
        iW = iW.replace (/%ι/g,"%ϊ");
        iW = iW.replace (/VιV/g,"VϊV");
        iW = iW.replace (/V/g,"");
        iW = iW.replace (/;/g,"·");
        iW = iW.replace (String.fromCharCode(63),";");
    }

    /* Vugorsky */
    else if (type == 15)
    {
        iW = iW.replace (/ć/g,"ť");
        iW = iW.replace (/đ/g,"ď");
        iW = jgedoe (iW, type);
        iW = iW.replace (/a/g,"á");
        iW = iW.replace (/å/g,"a");
        iW = iW.replace (/[ěę]/g,"je");
        iW = iW.replace (/ė/g,"e");
        iW = iW.replace (/[ṙŕ]/g,"ör");
        iW = iW.replace (/y/g,"ü");
        iW = iW.replace (/[ȯ’]/g,"ö");
        iW = iW.replace (/ų/g,"ú");
        iW = iW.replace (/ć/g,"č");
        iW = iW.replace (/dź/g,"dž");
        iW = iW.replace (/šj/g,"š");
        iW = iW.replace (/čj/g,"č");
        iW = iW.replace (/žj/g,"ž");
        iW = iW.replace (/jj/g,"j");
        iW = iW.replace (/sЬ/g,"s");
        iW = iW.replace (/zЬ/g,"z");
        iW = iW.replace (/rЬ/g,"r");
        iW = iW.replace (/[Ьь]/g,"j");
        iW = iW.replace (/tj/g,"ty");
        iW = iW.replace (/dj/g,"gy");
        iW = iW.replace (/lj/g,"ly");
        iW = iW.replace (/nj/g,"ny");
        iW = iW.replace (/yj/g,"y");
        iW = iW.replace (/s/g,"sz");
        iW = iW.replace (/š/g,"s");
        iW = iW.replace (/ž/g,"zs");
        iW = iW.replace (/č/g,"cs");
    }

    /* Latvijsky */
    else if (type == 16)
    {
        iW = iW.replace (/ć/g,"č");
        iW = iW.replace (/đ/g,"dž");
        iW = jgedoe (iW, type);
        iW = iW.replace (/ṙ/g,"or");
        iW = iW.replace (/ŕ/g,"er");
        iW = iW.replace (/å/g,"a");
        iW = iW.replace (/[ȯ’]/g,"o");
        iW = iW.replace (/[ěę]/g,"ьē");
        iW = iW.replace (/ė/g,"e");
        iW = iW.replace (/i/g,"ьi");
        iW = iW.replace (/y/g,"i");
        iW = iW.replace (/ų/g,"ū");
        iW = iW.replace (/šj/g,"š");
        iW = iW.replace (/čj/g,"č");
        iW = iW.replace (/žj/g,"ž");
        iW = iW.replace (/jj/g,"j");
        iW = iW.replace (/tЬ/g,"ķ");
        iW = iW.replace (/dЬ/g,"ģ");
        iW = iW.replace (/rЬ/g,"Ŗ");
        iW = iW.replace (/lЬ/g,"ļ");
        iW = iW.replace (/nЬ/g,"ņ");
        iW = iW.replace (/Ь/g,"");
        iW = iW.replace (/tь/g,"ķ");
        iW = iW.replace (/dь/g,"ģ");
        iW = iW.replace (/rь/g,"Ŗ");
        iW = iW.replace (/lь/g,"ļ");
        iW = iW.replace (/nь/g,"ņ");
        iW = iW.replace (/jь/g,"j");
        iW = iW.replace (/ьī/g,"ī");
        iW = iW.replace (/ьi/g,"i");
        iW = iW.replace (/ь/g,"i");
    }

    /* Rumunsky */
    else if (type == 19)  {
        iW = jgedoe (iW, type);
        iW = iW.replace (/ı/g,"j");
        iW = iW.replace (/[ŕṙ]/g,"ăr");
        iW = iW.replace (/[ęė]/g,"e");
        iW = iW.replace (/ų/g,"u");
        iW = iW.replace (/ě/g,"je");
        iW = iW.replace (/([čšžj])j/g,"$1");
        iW = iW.replace (/čt/g,"št");
        iW = iW.replace (/đ/g,"ǯ");
        iW = iW.replace (/dž/g,"ǯ");
        iW = iW.replace (/å/g,"a");
        iW = iW.replace (/ć/g,"č");
        iW = iW.replace (/[ȯ’]/g,"ă");
        iW = iW.replace (/y/g,"î");
        iW = iW.replace (/c/g,"ț");
        iW = iW.replace (/k([aăou%])/g,"c$1");
        iW = iW.replace (/k([eiî])/g,"ch$1");
        iW = iW.replace (/k/g,"c");
        iW = iW.replace (/cs/g,"x");
        iW = iW.replace (/g([eiî])/g,"gh$1");
        iW = iW.replace (/ča/g,"cea");
        iW = iW.replace (/č([ăou%])/g,"ci$1");
        iW = iW.replace (/č([eiî])/g,"c$1");
        iW = iW.replace (/č/g,"ci");
        iW = iW.replace (/ǯa/g,"gea");
        iW = iW.replace (/ǯ([ăou%])/g,"gi$1");
        iW = iW.replace (/ǯ([eiî])/g,"g$1");
        iW = iW.replace (/[ij]/g,"i");
        iW = iW.replace (/š/g,"ș");
        iW = iW.replace (/ž/g,"j");
        iW = iW.replace (/Ь/g,"");
        iW = iW.replace (/ьa/g,"ea");
        iW = iW.replace (/ьi/g,"ii");
        iW = iW.replace (/ь/g,"i");
        iW = iW.replace (/ii/g,"i");
    }

    /* Welsh */ 
    else if (type == 20)  {
        iW = jgedoe (iW, type);
        iW = iW.replace (/ı/g,"j");
        iW = iW.replace (/å/g,"a");
        iW = iW.replace (/[ęěė]/g,"e");
        iW = iW.replace (/[uų]/g,"w");
        iW = iW.replace (/y/g,"u");
        iW = iW.replace (/[ŕṙ]/g,"yr");
        iW = iW.replace (/[ȯ’]/g,"y");
        iW = iW.replace (/([čšžj])j/g,"$1");
        iW = iW.replace (/ć/g,"č");
        iW = iW.replace (/čt/g,"č");
        iW = iW.replace (/d[źž]/g,"ǯ");
        iW = iW.replace (/c/g,"ts");
        iW = iW.replace (/k/g,"c");
        iW = iW.replace (/č([aeow])/g,"ti$1");
        iW = iW.replace (/č/g,"ts");
        iW = iW.replace (/ǯ([aeow])/g,"di$1");
        iW = iW.replace (/ǯ/g,"dz");
        iW = iW.replace (/š([aeow])/g,"si$1");
        iW = iW.replace (/š/g,"s");
        iW = iW.replace (/ž([aeow])/g,"zi$1");
        iW = iW.replace (/ž/g,"z");
        iW = iW.replace (/f/g,"ff");
        iW = iW.replace (/vv/g,"vyv");
        iW = iW.replace (/v/g,"f");
        iW = iW.replace (/l([ьЬei])/g,"L$1");
        iW = iW.replace (/l/g,"ll");
        iW = iW.replace (/L/g,"l");
        iW = iW.replace (/ьi/g,"i");
        iW = iW.replace (/[ьj]/g,"i");
        iW = iW.replace (/Ь/g,"");
        iW = iW.replace (/ii/g,"i");
    }
    /* Etiopsky */
    else if (type == 17)  {
        iW = iW.replace (/å/g,"a");
        iW = iW.replace (/([jčšžćđ])e/g,"$1E");
        iW = iW.replace (/[eė]/g,"ä");
        iW = iW.replace (/E/g,"e");
        iW = iW.replace (/[ěę]/g,"jä");
        iW = iW.replace (/jj/g,"j");
        iW = iW.replace (/[y]/g,"i");
        iW = iW.replace (/ȯ/g,"o");
        iW = iW.replace (/ų/g,"u");
        iW = iW.replace (/ù/g,"w");
        iW = iW.replace (/[ŕṙ]/g,"r");
        iW = iW.replace (/[ĺŀ]/g,"l");
        iW = iW.replace (/ć/g,"č");
        iW = iW.replace (/dž/g,"ǧ");
        iW = iW.replace (/đ/g,"ǧ");
        iW = iW.replace (/[’ı]/g,"");
        iW = iW.replace (/nj/g,"ñ");
        iW = iW.replace (/ń/g,"ñ");
        iW = iW.replace (/n#j/g,"ñ");
        iW = jgedoe (iW, type);
        iW = iW.replace(/Ь/g,"");
        iW = iW.replace(/ь/g,"j");
        iW = iW.replace(/bä/g,"በ");
        iW = iW.replace(/bu/g,"ቡ");
        iW = iW.replace(/bi/g,"ቢ");
        iW = iW.replace(/ba/g,"ባ");
        iW = iW.replace(/be/g,"ቤ");
        iW = iW.replace(/bə/g,"ብ");
        iW = iW.replace(/bo/g,"ቦ");
        iW = iW.replace(/b/g,"ብ");
        iW = iW.replace(/cä/g,"ጸ");
        iW = iW.replace(/cu/g,"ጹ");
        iW = iW.replace(/ci/g,"ጺ");
        iW = iW.replace(/ca/g,"ጻ");
        iW = iW.replace(/ce/g,"ጼ");
        iW = iW.replace(/cə/g,"ጽ");
        iW = iW.replace(/co/g,"ጾ");
        iW = iW.replace(/c/g,"ጽ");
        iW = iW.replace(/čä/g,"ቸ");
        iW = iW.replace(/ču/g,"ቹ");
        iW = iW.replace(/či/g,"ቺ");
        iW = iW.replace(/ča/g,"ቻ");
        iW = iW.replace(/če/g,"ቼ");
        iW = iW.replace(/čə/g,"ች");
        iW = iW.replace(/čo/g,"ቾ");
        iW = iW.replace(/č/g,"ች");
        iW = iW.replace(/dä/g,"ደ");
        iW = iW.replace(/du/g,"ዱ");
        iW = iW.replace(/di/g,"ዲ");
        iW = iW.replace(/da/g,"ዳ");
        iW = iW.replace(/de/g,"ዴ");
        iW = iW.replace(/də/g,"ድ");
        iW = iW.replace(/do/g,"ዶ");
        iW = iW.replace(/d/g,"ድ");
        iW = iW.replace(/fä/g,"ፈ");
        iW = iW.replace(/fu/g,"ፉ");
        iW = iW.replace(/fi/g,"ፊ");
        iW = iW.replace(/fa/g,"ፋ");
        iW = iW.replace(/fe/g,"ፌ");
        iW = iW.replace(/fə/g,"ፍ");
        iW = iW.replace(/fo/g,"ፎ");
        iW = iW.replace(/f/g,"ፍ");
        iW = iW.replace(/gä/g,"ገ");
        iW = iW.replace(/gu/g,"ጉ");
        iW = iW.replace(/gi/g,"ጊ");
        iW = iW.replace(/ga/g,"ጋ");
        iW = iW.replace(/ge/g,"ጌ");
        iW = iW.replace(/gə/g,"ግ");
        iW = iW.replace(/go/g,"ጎ");
        iW = iW.replace(/g/g,"ግ");
        iW = iW.replace(/ǧä/g,"ጀ");
        iW = iW.replace(/ǧu/g,"ጁ");
        iW = iW.replace(/ǧi/g,"ጂ");
        iW = iW.replace(/ǧa/g,"ጃ");
        iW = iW.replace(/ǧe/g,"ጄ");
        iW = iW.replace(/ǧə/g,"ጅ");
        iW = iW.replace(/ǧo/g,"ጆ");
        iW = iW.replace(/ǧ/g,"ጅ");
        iW = iW.replace(/hä/g,"ኸ");
        iW = iW.replace(/hu/g,"ኹ");
        iW = iW.replace(/hi/g,"ኺ");
        iW = iW.replace(/ha/g,"ኻ");
        iW = iW.replace(/he/g,"ኼ");
        iW = iW.replace(/hə/g,"ኽ");
        iW = iW.replace(/ho/g,"ኾ");
        iW = iW.replace(/h/g,"ኽ");
        iW = iW.replace(/jä/g,"የ");
        iW = iW.replace(/ju/g,"ዩ");
        iW = iW.replace(/ji/g,"ዪ");
        iW = iW.replace(/ja/g,"ያ");
        iW = iW.replace(/je/g,"ዬ");
        iW = iW.replace(/jə/g,"ይ");
        iW = iW.replace(/jo/g,"ዮ");
        iW = iW.replace(/j/g,"ይ");
        iW = iW.replace(/kä/g,"ከ");
        iW = iW.replace(/ku/g,"ኩ");
        iW = iW.replace(/ki/g,"ኪ");
        iW = iW.replace(/ka/g,"ካ");
        iW = iW.replace(/ke/g,"ኬ");
        iW = iW.replace(/kə/g,"ክ");
        iW = iW.replace(/ko/g,"ኮ");
        iW = iW.replace(/k/g,"ክ");
        iW = iW.replace(/lä/g,"ለ");
        iW = iW.replace(/lu/g,"ሉ");
        iW = iW.replace(/li/g,"ሊ");
        iW = iW.replace(/la/g,"ላ");
        iW = iW.replace(/le/g,"ሌ");
        iW = iW.replace(/lə/g,"ል");
        iW = iW.replace(/lo/g,"ሎ");
        iW = iW.replace(/l/g,"ል");
        iW = iW.replace(/mä/g,"መ");
        iW = iW.replace(/mu/g,"ሙ");
        iW = iW.replace(/mi/g,"ሚ");
        iW = iW.replace(/ma/g,"ማ");
        iW = iW.replace(/me/g,"ሜ");
        iW = iW.replace(/mə/g,"ም");
        iW = iW.replace(/mo/g,"ሞ");
        iW = iW.replace(/m/g,"ም");
        iW = iW.replace(/nä/g,"ነ");
        iW = iW.replace(/nu/g,"ኑ");
        iW = iW.replace(/ni/g,"ኒ");
        iW = iW.replace(/na/g,"ና");
        iW = iW.replace(/ne/g,"ኔ");
        iW = iW.replace(/nə/g,"ን");
        iW = iW.replace(/no/g,"ኖ");
        iW = iW.replace(/n/g,"ን");
        iW = iW.replace(/ñä/g,"ኘ");
        iW = iW.replace(/ñu/g,"ኙ");
        iW = iW.replace(/ñi/g,"ኚ");
        iW = iW.replace(/ña/g,"ኛ");
        iW = iW.replace(/ñe/g,"ኜ");
        iW = iW.replace(/ñə/g,"ኝ");
        iW = iW.replace(/ño/g,"ኞ");
        iW = iW.replace(/ñ/g,"ኝ");
        iW = iW.replace(/pä/g,"ፐ");
        iW = iW.replace(/pu/g,"ፑ");
        iW = iW.replace(/pi/g,"ፒ");
        iW = iW.replace(/pa/g,"ፓ");
        iW = iW.replace(/pe/g,"ፔ");
        iW = iW.replace(/pə/g,"ፕ");
        iW = iW.replace(/po/g,"ፖ");
        iW = iW.replace(/p/g,"ፕ");
        iW = iW.replace(/rä/g,"ረ");
        iW = iW.replace(/ru/g,"ሩ");
        iW = iW.replace(/ri/g,"ሪ");
        iW = iW.replace(/ra/g,"ራ");
        iW = iW.replace(/re/g,"ሬ");
        iW = iW.replace(/rə/g,"ር");
        iW = iW.replace(/ro/g,"ሮ");
        iW = iW.replace(/r/g,"ር");
        iW = iW.replace(/sä/g,"ሰ");
        iW = iW.replace(/su/g,"ሱ");
        iW = iW.replace(/si/g,"ሲ");
        iW = iW.replace(/sa/g,"ሳ");
        iW = iW.replace(/se/g,"ሴ");
        iW = iW.replace(/sə/g,"ስ");
        iW = iW.replace(/so/g,"ሶ");
        iW = iW.replace(/s/g,"ስ");
        iW = iW.replace(/šä/g,"ሸ");
        iW = iW.replace(/šu/g,"ሹ");
        iW = iW.replace(/ši/g,"ሺ");
        iW = iW.replace(/ša/g,"ሻ");
        iW = iW.replace(/še/g,"ሼ");
        iW = iW.replace(/šə/g,"ሽ");
        iW = iW.replace(/šo/g,"ሾ");
        iW = iW.replace(/š/g,"ሽ");
        iW = iW.replace(/tä/g,"ተ");
        iW = iW.replace(/tu/g,"ቱ");
        iW = iW.replace(/ti/g,"ቲ");
        iW = iW.replace(/ta/g,"ታ");
        iW = iW.replace(/te/g,"ቴ");
        iW = iW.replace(/tə/g,"ት");
        iW = iW.replace(/to/g,"ቶ");
        iW = iW.replace(/t/g,"ት");
        iW = iW.replace(/vä/g,"ቨ");
        iW = iW.replace(/vu/g,"ቩ");
        iW = iW.replace(/vi/g,"ቪ");
        iW = iW.replace(/va/g,"ቫ");
        iW = iW.replace(/ve/g,"ቬ");
        iW = iW.replace(/və/g,"ቭ");
        iW = iW.replace(/vo/g,"ቮ");
        iW = iW.replace(/v/g,"ቭ");
        iW = iW.replace(/w/g,"ዌ");
        iW = iW.replace(/zä/g,"ዘ");
        iW = iW.replace(/zu/g,"ዙ");
        iW = iW.replace(/zi/g,"ዚ");
        iW = iW.replace(/za/g,"ዛ");
        iW = iW.replace(/ze/g,"ዜ");
        iW = iW.replace(/zə/g,"ዝ");
        iW = iW.replace(/zo/g,"ዞ");
        iW = iW.replace(/z/g,"ዝ");
        iW = iW.replace(/žä/g,"ዠ");
        iW = iW.replace(/žu/g,"ዡ");
        iW = iW.replace(/ži/g,"ዢ");
        iW = iW.replace(/ža/g,"ዣ");
        iW = iW.replace(/že/g,"ዤ");
        iW = iW.replace(/žə/g,"ዥ");
        iW = iW.replace(/žo/g,"ዦ");
        iW = iW.replace(/ž/g,"ዥ");
        iW = iW.replace(/ä/g,"አ");
        iW = iW.replace(/u/g,"ኡ");
        iW = iW.replace(/i/g,"ኢ");
        iW = iW.replace(/a/g,"ኣ");
        iW = iW.replace(/e/g,"ኤ");
        iW = iW.replace(/ə/g,"እ");
        iW = iW.replace(/o/g,"ኦ");
    }

    /* Devanagari */
    else if (type == 18)  {
        iW = iW.replace (/ı/g,"i");
        iW = iW.replace (/#/g,"");
        iW = jgedoe (iW, type);
        iW = iW.replace(/tЬ/g,"ť");
        iW = iW.replace(/tь/g,"ťj");
        iW = iW.replace(/dЬ/g,"ď");
        iW = iW.replace(/dь/g,"ďj");
        iW = iW.replace(/rЬ/g,"r");
        iW = iW.replace(/rь/g,"rj");
        iW = iW.replace(/lЬ/g,"lj");
        iW = iW.replace(/lь/g,"lj");
        iW = iW.replace(/nЬ/g,"ň");
        iW = iW.replace(/nь/g,"ň");
        iW = iW.replace(/sЬ/g,"s");
        iW = iW.replace(/sь/g,"sj");
        iW = iW.replace(/zЬ/g,"z");
        iW = iW.replace(/zь/g,"zj");
        iW = iW.replace(/Ь/g,"");
        iW = iW.replace(/ь/g,"j");
        iW = iW.replace(/[aå]/g,"ā");
        iW = iW.replace(/j[ěė]/g,"jē");
        iW = iW.replace(/[ěė]/g,"jē");
        iW = iW.replace(/é/g,"ai");
        iW = iW.replace(/e/g,"ē");
        iW = iW.replace(/ę/g,"ēṁ");
        iW = iW.replace(/i/g,"ī");
        iW = iW.replace(/[yì]/g,"i");
        iW = iW.replace(/o/g,"ō");
        iW = iW.replace(/ȯ/g,"a");
        iW = iW.replace(/ų/g,"ūṁ");
        iW = iW.replace(/[ṙŕ]/g,"ar");
        iW = iW.replace(/c/g,"ts");
        iW = iW.replace(/[ćč]/g,"c");
        iW = iW.replace(/ď/g,"ḍ");
        iW = iW.replace(/j/g,"y");
        iW = iW.replace(/dź/g,"j");
        iW = iW.replace(/dž/g,"j");
        iW = iW.replace(/h/g,"k‍ẖ");
        iW = iW.replace(/ľ/g,"ly");
        iW = iW.replace(/ň/g,"ñ");
        iW = iW.replace(/ř/g,"ṛ");
        iW = iW.replace(/ś/g,"ṣ");
        iW = iW.replace(/š/g,"ś");
        iW = iW.replace(/ť/g,"ṭ");
        iW = iW.replace(/ź/g,"z");
        iW = iW.replace(/ž/g,"zh");
        iW = iW.replace(/zh/g,"झ़#");
        iW = iW.replace(/k‍ẖ/g,"ख़#");
        iW = iW.replace(/b/g,"ब#");
        iW = iW.replace(/c/g,"च#");
        iW = iW.replace(/d/g,"द#");
        iW = iW.replace(/ḍ/g,"ड#");
        iW = iW.replace(/f/g,"फ़#");
        iW = iW.replace(/g/g,"ग#");
        iW = iW.replace(/h/g,"ह#");
        iW = iW.replace(/j/g,"ज#");
        iW = iW.replace(/k/g,"क#");
        iW = iW.replace(/l/g,"ल#");
        iW = iW.replace(/m/g,"म#");
        iW = iW.replace(/n/g,"न#");
        iW = iW.replace(/ñ/g,"ञ#");
        iW = iW.replace(/p/g,"प#");
        iW = iW.replace(/r/g,"र#");
        iW = iW.replace(/ṛ/g,"ड़#");
        iW = iW.replace(/t/g,"त#");
        iW = iW.replace(/ṭ/g,"ट#");
        iW = iW.replace(/s/g,"स#");
        iW = iW.replace(/ṣ/g,"ष#");
        iW = iW.replace(/ś/g,"श#");
        iW = iW.replace(/v/g,"व#");
        iW = iW.replace(/y/g,"य#");
        iW = iW.replace(/z/g,"ज़#");
        iW = iW.replace(/#ai/g,"ै");
        iW = iW.replace(/#a/g,"");
        iW = iW.replace(/#ā/g,"ा");
        iW = iW.replace(/#i/g,"ि");
        iW = iW.replace(/#ī/g,"ी");
        iW = iW.replace(/#u/g,"ु");
        iW = iW.replace(/#ūṁ/g,"ूँ");
        iW = iW.replace(/#ēṁ/g,"ें");
        iW = iW.replace(/#ē/g,"े");
        iW = iW.replace(/#ō/g,"ो");
        iW = iW.replace(/#%/g,"%");
        iW = iW.replace(/#/g,"्");
        iW = iW.replace(/ai/g,"ऐ");
        iW = iW.replace(/ā/g,"आ");
        iW = iW.replace(/i/g,"इ");
        iW = iW.replace(/ī/g,"ई");
        iW = iW.replace(/u/g,"उ");
        iW = iW.replace(/ūṁ/g,"ऊँ");
        iW = iW.replace(/ū/g,"ऊ");
        iW = iW.replace(/ēṁ/g,"एँ");
        iW = iW.replace(/ē/g,"ए");
        iW = iW.replace(/ō/g,"ओ");
        iW = iW.replace(/0/g,"०");
        iW = iW.replace(/1/g,"१");
        iW = iW.replace(/2/g,"२");
        iW = iW.replace(/3/g,"३");
        iW = iW.replace(/4/g,"४");
        iW = iW.replace(/5/g,"५");
        iW = iW.replace(/6/g,"६");
        iW = iW.replace(/7/g,"७");
        iW = iW.replace(/8/g,"८");
        iW = iW.replace(/9/g,"९");
    }

    /* Abur */
    else if (type == 21) {
        iW = iW.replace (/ṙ/g,"ȯr");
        iW = iW.replace (/ŕ/g,"ėr");
        iW = iW.replace (/šć/g,"šč");
        iW = iW.replace (/ć/g,"");
        iW = iW.replace (/đ/g,"");
        iW = jgedoe (iW, type);
        iW = iW.replace (/[jь]a/g,"");
        iW = iW.replace (/[jь]u/g,"");
        iW = iW.replace (/dz/g,"");
        iW = iW.replace (/dž/g,"");
        iW = iW.replace (/šč/g,"");
        iW = iW.replace (/l[ьЬ]/g,"");
        iW = iW.replace (/n[ьЬ]/g,"");
        iW = iW.replace (/r[ьЬ]/g,"");
        iW = iW.replace (/t[ьЬ]/g,"");
        iW = iW.replace (/d[ьЬ]/g,"");
        iW = iW.replace (/Ь/g,"");
        iW = iW.replace (/ь/g,"");
        iW = iW.replace (/a/g,"");
        iW = iW.replace (/å/g,"");
        iW = iW.replace (/b/g,"");
        iW = iW.replace (/c/g,"");
        iW = iW.replace (/č/g,"");
        iW = iW.replace (/d/g,"");
        iW = iW.replace (/e/g,"");
        iW = iW.replace (/ė/g,"");
        iW = iW.replace (/ę/g,"");
        iW = iW.replace (/ě/g,"");
        iW = iW.replace (/f/g,"");
        iW = iW.replace (/g/g,"");
        iW = iW.replace (/h/g,"");
        iW = iW.replace (/i/g,"");
        iW = iW.replace (/[jь]/g,"");
        iW = iW.replace (/k/g,"");
        iW = iW.replace (/l/g,"");
        iW = iW.replace (/m/g,"");
        iW = iW.replace (/n/g,"");
        iW = iW.replace (/o/g,"");
        iW = iW.replace (/ȯ/g,"");
        iW = iW.replace (/p/g,"");
        iW = iW.replace (/r/g,"");
        iW = iW.replace (/s/g,"");
        iW = iW.replace (/š/g,"");
        iW = iW.replace (/t/g,"");
        iW = iW.replace (/u/g,"");
        iW = iW.replace (/ų/g,"");
        iW = iW.replace (/v/g,"");
        iW = iW.replace (/y/g,"");
        iW = iW.replace (/z/g,"");
        iW = iW.replace (/ž/g,"");
    }

    /* Japanese (katakana) */
    else if (type == 22)  {
        iW = iW.replace(/y/g,"i");
        iW = iW.replace(/[ṙŕ]/g,"r");
        iW = iW.replace(/ll/g,"ッl");
        iW = iW.replace(/nn/g,"ッn");
        iW = iW.replace(/rr/g,"ッr");
        iW = iW.replace(/tt/g,"ッt");
        iW = iW.replace(/dd/g,"ッd");
        iW = iW.replace(/ss/g,"ッs");
        iW = iW.replace(/zz/g,"ッz");
        iW = iW.replace(/vv/g,"ッv");
        iW = iW.replace(/dža/g,"ヂャ");
        iW = iW.replace(/dže/g,"ヂェ");
        iW = iW.replace(/dži/g,"ヂー");
        iW = iW.replace(/džo/g,"ヂョ");
        iW = iW.replace(/džu/g,"ヂュ");
        iW = iW.replace(/dž/g,"ヂ");
        iW = iW.replace(/sa/g,"サ");
        iW = iW.replace(/se/g,"セ");
        iW = iW.replace(/si/g,"スィ");
        iW = iW.replace(/so/g,"ソ");
        iW = iW.replace(/su/g,"スー");
        iW = iW.replace(/sě/g,"スィェ");
        iW = iW.replace(/s/g,"ス");
        iW = iW.replace(/za/g,"ザ");
        iW = iW.replace(/ze/g,"ゼ");
        iW = iW.replace(/zi/g,"ズィ");
        iW = iW.replace(/zo/g,"ゾ");
        iW = iW.replace(/zu/g,"ズー");
        iW = iW.replace(/zě/g,"ズィェ");
        iW = iW.replace(/z/g,"ズ");
        iW = iW.replace(/ša/g,"シャ");
        iW = iW.replace(/še/g,"シェ");
        iW = iW.replace(/ši/g,"シー");
        iW = iW.replace(/šo/g,"ショ");
        iW = iW.replace(/šu/g,"シュ");
        iW = iW.replace(/š/g,"シ");
        iW = iW.replace(/ža/g,"ジャ");
        iW = iW.replace(/že/g,"ジェ");
        iW = iW.replace(/ži/g,"ジー");
        iW = iW.replace(/žo/g,"ジョ");
        iW = iW.replace(/žu/g,"ジュ");
        iW = iW.replace(/ž/g,"ジ");
        iW = iW.replace(/ta/g,"タ");
        iW = iW.replace(/te/g,"テ");
        iW = iW.replace(/ti/g,"ティ");
        iW = iW.replace(/to/g,"トー");
        iW = iW.replace(/tu/g,"トゥ");
        iW = iW.replace(/tě/g,"ティェ");
        iW = iW.replace(/t/g,"ト");
        iW = iW.replace(/da/g,"ダ");
        iW = iW.replace(/de/g,"デ");
        iW = iW.replace(/di/g,"ディ");
        iW = iW.replace(/do/g,"ドー");
        iW = iW.replace(/du/g,"ドゥ");
        iW = iW.replace(/dě/g,"ディェ");
        iW = iW.replace(/d/g,"ド");
        iW = iW.replace(/ča/g,"チャ");
        iW = iW.replace(/če/g,"チェ");
        iW = iW.replace(/či/g,"チー");
        iW = iW.replace(/čo/g,"チョ");
        iW = iW.replace(/ču/g,"チュ");
        iW = iW.replace(/č/g,"チ");
        iW = iW.replace(/ca/g,"ツァ");
        iW = iW.replace(/ce/g,"ツェ");
        iW = iW.replace(/ci/g,"ツィ");
        iW = iW.replace(/co/g,"ツォ");
        iW = iW.replace(/cu/g,"ツー");
        iW = iW.replace(/cě/g,"ツィェ");
        iW = iW.replace(/c/g,"ツ");
        iW = iW.replace(/ka/g,"カ");
        iW = iW.replace(/ke/g,"ケ");
        iW = iW.replace(/ki/g,"キ");
        iW = iW.replace(/ko/g,"コ");
        iW = iW.replace(/ku/g,"クー");
        iW = iW.replace(/kě/g,"キェ");
        iW = iW.replace(/k/g,"ク");
        iW = iW.replace(/ga/g,"ガ");
        iW = iW.replace(/ge/g,"ゲ");
        iW = iW.replace(/gi/g,"ギ");
        iW = iW.replace(/go/g,"ゴ");
        iW = iW.replace(/gu/g,"グー");
        iW = iW.replace(/gě/g,"ギェ");
        iW = iW.replace(/g/g,"グ");
        iW = iW.replace(/ha/g,"ハ");
        iW = iW.replace(/he/g,"ヘ");
        iW = iW.replace(/hi/g,"ヒ");
        iW = iW.replace(/ho/g,"ホ");
        iW = iW.replace(/hu/g,"ホゥ");
        iW = iW.replace(/hě/g,"ヒェ");
        iW = iW.replace(/h/g,"フ");
        iW = iW.replace(/pa/g,"パ");
        iW = iW.replace(/pe/g,"ペ");
        iW = iW.replace(/pi/g,"ピ");
        iW = iW.replace(/po/g,"ポ");
        iW = iW.replace(/pu/g,"プー");
        iW = iW.replace(/pě/g,"ピェ");
        iW = iW.replace(/pja/g,"ピャ");
        iW = iW.replace(/pje/g,"ピェ");
        iW = iW.replace(/pjo/g,"ピョ");
        iW = iW.replace(/pju/g,"ピュ");
        iW = iW.replace(/p/g,"プ");
        iW = iW.replace(/ba/g,"バ");
        iW = iW.replace(/be/g,"ベ");
        iW = iW.replace(/bi/g,"ビ");
        iW = iW.replace(/bo/g,"ボ");
        iW = iW.replace(/bu/g,"ブー");
        iW = iW.replace(/bě/g,"ビェ");
        iW = iW.replace(/bja/g,"ビャ");
        iW = iW.replace(/bje/g,"ビェ");
        iW = iW.replace(/bjo/g,"ビョ");
        iW = iW.replace(/bju/g,"ビュ");
        iW = iW.replace(/b/g,"ブ");
        iW = iW.replace(/ma/g,"マ");
        iW = iW.replace(/me/g,"メ");
        iW = iW.replace(/mi/g,"ミ");
        iW = iW.replace(/mo/g,"モ");
        iW = iW.replace(/mu/g,"ムー");
        iW = iW.replace(/mě/g,"ミェ");
        iW = iW.replace(/mja/g,"ミャ");
        iW = iW.replace(/mje/g,"ミェ");
        iW = iW.replace(/mjo/g,"ミョ");
        iW = iW.replace(/mju/g,"ミュ");
        iW = iW.replace(/m/g,"ム");
        iW = iW.replace(/na/g,"ナ");
        iW = iW.replace(/ne/g,"ネ");
        iW = iW.replace(/ni/g,"ニ");
        iW = iW.replace(/no/g,"ノ");
        iW = iW.replace(/nu/g,"ヌ");
        iW = iW.replace(/ně/g,"ニェ");
        iW = iW.replace(/nja/g,"ニャ");
        iW = iW.replace(/nje/g,"ニェ");
        iW = iW.replace(/njo/g,"ニョ");
        iW = iW.replace(/nju/g,"ニュ");
        iW = iW.replace(/n/g,"ン");
        iW = iW.replace(/ra/g,"ラ");
        iW = iW.replace(/re/g,"レ");
        iW = iW.replace(/ri/g,"リ");
        iW = iW.replace(/ro/g,"ロ");
        iW = iW.replace(/ru/g,"ルー");
        iW = iW.replace(/rě/g,"リェ");
        iW = iW.replace(/rja/g,"リャ");
        iW = iW.replace(/rje/g,"リェ");
        iW = iW.replace(/rjo/g,"リョ");
        iW = iW.replace(/rju/g,"リュ");
        iW = iW.replace(/r/g,"ル");
        iW = iW.replace(/la/g,"ラ゙");
        iW = iW.replace(/le/g,"レ゙");
        iW = iW.replace(/li/g,"リ゙");
        iW = iW.replace(/lo/g,"ロ゙");
        iW = iW.replace(/lu/g,"ル゙ー");
        iW = iW.replace(/lě/g,"リ゙ェ");
        iW = iW.replace(/lja/g,"リ゙ャ");
        iW = iW.replace(/lje/g,"リ゙ェ");
        iW = iW.replace(/ljo/g,"リ゙ョ");
        iW = iW.replace(/lju/g,"リ゙ュ");
        iW = iW.replace(/l/g,"ル゙");
        iW = iW.replace(/fa/g,"ファ");
        iW = iW.replace(/fe/g,"フェ");
        iW = iW.replace(/fi/g,"フィ");
        iW = iW.replace(/fo/g,"フォ");
        iW = iW.replace(/fu/g,"フー");
        iW = iW.replace(/fě/g,"フィェ");
        iW = iW.replace(/fja/g,"フャ");
        iW = iW.replace(/fje/g,"フィェ");
        iW = iW.replace(/fjo/g,"フョ");
        iW = iW.replace(/fju/g,"フュ");
        iW = iW.replace(/f/g,"フ");
        iW = iW.replace(/va/g,"ヴァ");
        iW = iW.replace(/ve/g,"ヴェ");
        iW = iW.replace(/vi/g,"ヴィ");
        iW = iW.replace(/vo/g,"ヴォ");
        iW = iW.replace(/vu/g,"ヴ");
        iW = iW.replace(/vě/g,"ヴィェ");
        iW = iW.replace(/vja/g,"ヴャ");
        iW = iW.replace(/vje/g,"ヴィェ");
        iW = iW.replace(/vjo/g,"ヴョ");
        iW = iW.replace(/vju/g,"ヴュ");
        iW = iW.replace(/v/g,"フ");
        iW = iW.replace(/ja/g,"ヤ");
        iW = iW.replace(/je/g,"イェ");
        iW = iW.replace(/ji/g,"イィ");
        iW = iW.replace(/jo/g,"ヨ");
        iW = iW.replace(/ju/g,"ユ");
        iW = iW.replace(/j/g,"イ");
        iW = iW.replace(/a/g,"ア");
        iW = iW.replace(/e/g,"エ");
        iW = iW.replace(/i/g,"イ");
        iW = iW.replace(/o/g,"オ");
        iW = iW.replace(/u/g,"ウ");
    }


    iW = iW.replace (/jj/g,"j");
    iW = iW.replace (/[#ı%]/g,"");
    OrigW = OrigW.replace (/%/g,"");

    /** Hoofdletters maken **/
    let iW_first = iW.charAt (0);
    let iW_rest = iW.substring (1);

    if (type == 10 || (OrigW.charAt (0) == OrigW.charAt (0).toLowerCase())) {
        iW = iW.toLowerCase();
    }
    else if ((OrigW.length > 1) && (OrigW.charAt (1) == OrigW.charAt (1).toLowerCase())) {
        if (type == 21) {
            iW = abur_upper (iW_first) + iW_rest.toLowerCase();
        } else {
            iW = iW_first.toUpperCase() + iW_rest.toLowerCase();
        }
    } else  {
        if (type == 21) { 
            iW = abur_upper (iW); 
        } else {
            iW = iW.toUpperCase();
        }
    }

    iW = iW.replace (/℅/g,"%");

    var grs = iW.lastIndexOf ("ς");
    if ((grs == "0") && (OrigW.indexOf ("s") == -1)) { 
        iW = iW.replace (/ς/g,"Σ");
    }
    else if (iW.charAt (grs - 1) != iW.charAt (grs - 1).toLowerCase()) { 
        iW = iW.replace (/ς/g,"Σ");
    }

    return iW;
}

function abur_upper (iW)
{
    let i = 0;
    let endresult = "";
    let resultChar = "";
    while (i < iW.length)
    {
        let nextChar = iW.charAt (i);
        if (nextChar == "") { resultChar = ""; }
        else if (nextChar == "") { resultChar = ""; }
        else if (nextChar == "") { resultChar = ""; }
        else if (nextChar == "") { resultChar = ""; }
        else if (nextChar == "") { resultChar = ""; }
        else if (nextChar == "") { resultChar = ""; }
        else if (nextChar == "") { resultChar = ""; }
        else if (nextChar == "") { resultChar = ""; }
        else if (nextChar == "") { resultChar = ""; }
        else if (nextChar == "") { resultChar = ""; }
        else if (nextChar == "") { resultChar = ""; }
        else if (nextChar == "") { resultChar = ""; }
        else if (nextChar == "") { resultChar = ""; }
        else if (nextChar == "") { resultChar = ""; }
        else if (nextChar == "") { resultChar = ""; }
        else if (nextChar == "") { resultChar = ""; }
        else if (nextChar == "") { resultChar = ""; }
        else if (nextChar == "") { resultChar = ""; }
        else if (nextChar == "") { resultChar = ""; }
        else if (nextChar == "") { resultChar = ""; }
        else if (nextChar == "") { resultChar = ""; }
        else if (nextChar == "") { resultChar = ""; }
        else if (nextChar == "") { resultChar = ""; }
        else if (nextChar == "") { resultChar = ""; }
        else if (nextChar == "") { resultChar = ""; }
        else if (nextChar == "") { resultChar = ""; }
        else if (nextChar == "") { resultChar = ""; }
        else if (nextChar == "") { resultChar = ""; }
        else if (nextChar == "") { resultChar = ""; }
        else if (nextChar == "") { resultChar = ""; }
        else if (nextChar == "") { resultChar = ""; }
        else if (nextChar == "") { resultChar = ""; }
        else if (nextChar == "") { resultChar = ""; }
        else if (nextChar == "") { resultChar = ""; }
        else if (nextChar == "") { resultChar = ""; }
        else if (nextChar == "") { resultChar = ""; }
        else if (nextChar == "") { resultChar = ""; }
        else if (nextChar == "") { resultChar = ""; }
        else if (nextChar == "") { resultChar = ""; }
        else if (nextChar == "") { resultChar = ""; }
        else if (nextChar == "") { resultChar = ""; }
        else if (nextChar == "") { resultChar = ""; }
        else if (nextChar == "") { resultChar = ""; }
        else if (nextChar == "") { resultChar = ""; }
        else if (nextChar == "") { resultChar = ""; }
        else if (nextChar == "") { resultChar = ""; }
        else			  { resultChar = nextChar; }

        i++;
        endresult += resultChar;
    }
    return endresult;
}

function nmsify (iW)
{
    iW = iW.replace (/[яꙗ]/g,"#a");
    iW = iW.replace (/ьа/g,"#a");
    iW = iW.replace (/ѥ/g,"#e");
    iW = iW.replace (/ье/g,"#e");
    iW = iW.replace (/ї/g,"#i");
    iW = iW.replace (/ьи/g,"#i");
    iW = iW.replace (/ё/g,"#o");
    iW = iW.replace (/ьо/g,"#o");
    iW = iW.replace (/ю/g,"#u");
    iW = iW.replace (/ьу/g,"#u");
    iW = iW.replace (/ѩ/g,"#ę");
    iW = iW.replace (/ьѧ/g,"#ę");
    iW = iW.replace (/ѭ/g,"#ų");
    iW = iW.replace (/ьѫ/g,"#ų");
    iW = iW.replace (/нь/g,"ń");
    iW = iW.replace (/н#/g,"nj");
    iW = iW.replace (/њ/g,"nj");
    iW = iW.replace (/ль/g,"ĺ");
    iW = iW.replace (/л#/g,"lj");
    iW = iW.replace (/љ/g,"lj");
    iW = iW.replace (/рь/g,"ŕ");
    iW = iW.replace (/р#/g,"ŕ");
    iW = iW.replace (/ть/g,"ť");
    iW = iW.replace (/т#/g,"ť");
    iW = iW.replace (/дь/g,"ď");
    iW = iW.replace (/д#/g,"ď");
    iW = iW.replace (/сь/g,"ś");
    iW = iW.replace (/с#/g,"ś");
    iW = iW.replace (/зь/g,"ź");
    iW = iW.replace (/з#/g,"ź");
    iW = iW.replace (/ь%/g,"%");
    iW = iW.replace (/[ђѓ]/g,"đ");
    iW = iW.replace (/[ћќ]/g,"ć");
    iW = iW.replace (/ѕ/g,"dz");
    iW = iW.replace (/џ/g,"dž");
    iW = iW.replace (/а/g,"a");
    iW = iW.replace (/б/g,"b");
    iW = iW.replace (/в/g,"v");
    iW = iW.replace (/[гґ]/g,"g");
    iW = iW.replace (/д/g,"d");
    iW = iW.replace (/[еэ]/g,"e");
    iW = iW.replace (/[єѣ]/g,"ě");
    iW = iW.replace (/ж/g,"ž");
    iW = iW.replace (/[зꙁꙀ]/g,"z");
    iW = iW.replace (/[иіѵѷ]/g,"i");
    iW = iW.replace (/[йјь#]/g,"j");
    iW = iW.replace (/к/g,"k");
    iW = iW.replace (/л/g,"l");
    iW = iW.replace (/м/g,"m");
    iW = iW.replace (/н/g,"n");
    iW = iW.replace (/[оѡ]/g,"o");
    iW = iW.replace (/п/g,"p");
    iW = iW.replace (/р/g,"r");
    iW = iW.replace (/с/g,"s");
    iW = iW.replace (/[тѳ]/g,"t");
    iW = iW.replace (/[уȣѹ]/g,"u");
    iW = iW.replace (/ф/g,"f");
    iW = iW.replace (/х/g,"h");
    iW = iW.replace (/ц/g,"c");
    iW = iW.replace (/ч/g,"č");
    iW = iW.replace (/ш/g,"š");
    iW = iW.replace (/щ/g,"šč");
    iW = iW.replace (/[ыꙑ]/g,"y");
    iW = iW.replace (/ъ/g,"ȯ"); //Fixed by D.Š - old translation is 'q'
    iW = iW.replace (/ў/g,"ŭ");
    iW = iW.replace (/ѧ/g,"ę");
    iW = iW.replace (/ѫ/g,"ų");
    iW = iW.replace (/ѱ/g,"ps");
    iW = iW.replace (/ѯ/g,"ks");
    iW = iW.replace (/ӑ/g,"å"); //Added by D.Š

    iW = iW.replace (/⁙/g,".");

    iW = iW.replace (/zsk/g,"z#sk");
    iW = iW.replace (/zst/g,"z#st");
    iW = iW.replace (/%izs/g,"%iz#s");
    iW = iW.replace (/%bezs/g,"%bez#s");
    iW = iW.replace (/%razs/g,"%raz#s");
    iW = iW.replace (/%råzs/g,"%råz#s");
    iW = iW.replace (/konjug/g,"kon#jug");
    iW = iW.replace (/konjun/g,"kon#jun");
    iW = iW.replace (/injek/g,"in#jek");

    iW = iW.replace (/s[xz]/g,"š");
    iW = iW.replace (/c[xz]/g,"č");
    iW = iW.replace (/z[xs]/g,"ž");
    iW = iW.replace (/ż/g,"ž");
    iW = iW.replace (/ye/g,"ě");

    iW = iW.replace (/qu/g,"kv");
    iW = iW.replace (/ŀ/g,"ȯl");
    iW = iW.replace (/[ăq`]/g,"’");
    iW = iW.replace (/ch/g,"h");
    iW = iW.replace (/w/g,"v");
    iW = iW.replace (/x/g,"ks");

    iW = iW.replace (/[áàâā]/g,"a");
    iW = iW.replace (/[íìîīĭı]/g,"i");
    iW = iW.replace (/[úûůū]/g,"u");
    iW = iW.replace (/[ąǫũ]/g,"ų");
    iW = iW.replace (/ù/g,"ŭ");
    iW = iW.replace (/[éē]/g,"e");
    iW = iW.replace (/[ĕëè]/g,"ė");
    iW = iW.replace (/[œóô]/g,"o");
    iW = iW.replace (/[ŏöò]/g,"ȯ");
    iW = iW.replace (/ý/g,"y");
    iW = iW.replace (/ł/g,"l");
    iW = iW.replace (/ç/g,"c");
    iW = iW.replace (/ʒ/g,"z");
    iW = iW.replace (/ĵ/g,"j");
    iW = iW.replace (/[ĺļǉ]/g,"ľ");
    iW = iW.replace (/[ňñņǌ]/g,"ń");
    iW = iW.replace (/ř/g,"ŕ");
    iW = iW.replace (/t́/g,"ť");
    iW = iW.replace (/d́/g,"ď");

    iW = iW.replace (/([jćđšžč])y/g,"$1i");
    iW = iW.replace (/jj/g,"j");

    return iW;
}

function jgedoe (iW, type)
{

    /* (V)j(V)	= j */
    /* Cj(C)  	= Ь */
    /* CjV		= ь */

    iW = iW.replace (/ć/g,"cj");
    iW = iW.replace (/đ/g,"dzj");
    iW = iW.replace (/ľ/g,"lj");
    iW = iW.replace (/ń/g,"nj");
    iW = iW.replace (/ř/g,"rj");
    iW = iW.replace (/ď/g,"dj");
    iW = iW.replace (/ť/g,"tj");
    iW = iW.replace (/ś/g,"sj");
    iW = iW.replace (/ź/g,"zj");

    var i = 0;
    var wLength = iW.length;
    var nextChar = "";
    var resC = "";
    var result = "";

    while (i < wLength)
    {
        nextChar = iW.charAt (i);
        resC = nextChar;
        var vowel = /[aäåeęěėioȯuųyъ]/;

        switch (nextChar)
        {
            case "j":
                if  (iW.charAt (i - 1) == "%") { resC = "j"; break; }
                else if  (iW.charAt (i - 1) == "#")	{ resC = "j"; break; }
                else if (iW.charAt (i - 1) == "j")	{ resC = "j"; break; }
                else if ((vowel.test (iW.charAt (i - 1)) == false)
                    && (vowel.test (iW.charAt (i + 1)) == true)) { resC = "ь"; break; }
                else if ((vowel.test (iW.charAt (i - 1)) == false)
                    && (vowel.test (iW.charAt (i + 1)) == false)) { resC = "Ь"; break; }
                else { resC = "j"; break; }
        }
        i++;
        result += resC;
    }
    return result;
}
