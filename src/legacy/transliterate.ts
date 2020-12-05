/*
* Adapted from http://steen.free.fr http://steen.free.fr/scripts/transliteration.js
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

    iSource = iSource.replace(/\t/g, " ");
    iSource = iSource.replace(/\n/g, " ");

    while (iSource != "") {
        var nextW = "";
        var nextSpace = iSource.indexOf(" ");

        if (nextSpace == -1) {
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
            result += leesteken;
            iSource = iSource.substring(nextSpace + 1, iSource.length);
        }
    }
    return result;
}

export function transliterateW (iW, type, flav, nms)
{ 	
    iW = "%" + iW + "%";
    let OrigW = iW;
    iW = iW.toLowerCase();
    if (nms == 1) { iW = nmsify (iW); }

    iW = iW.replace (/ŕ/g,"ř");
    var aPos = iW.indexOf ("ř");
    var vowel = /[aeiouyąęųåėȯèòěê]/;
    if  ((aPos > 1) && (iW.charAt (aPos - 1) != "%") && (vowel.test (iW.charAt (aPos - 1)) == false) && (vowel.test (iW.charAt (aPos + 1)) == false)) { 
        iW = iW.substring (0, aPos) + "ŕ" + iW.substring (aPos + 1, iW.length); 
    }

    iW = iW.replace (/rj/g, "Rj");
    iW = iW.replace (/jr/g, "jR");
    var rPos = iW.indexOf ("r"); var vowel = /[aeiouyąęųåėȯèòěê]/;
    if  ((rPos > 1) && (iW.charAt (rPos - 1) != "%") && (vowel.test (iW.charAt (rPos - 1)) == false) && (vowel.test (iW.charAt (rPos + 1)) == false))  { 
        iW = iW.substring (0, rPos) + "ṙ" + iW.substring (rPos + 1, iW.length); 
        /* 
        iW = iW.replace (/’ṙ/, "ṙ");
        iW = iW.replace (/jṙ/, "ŕ"); 
        */
        iW = iW.replace (/([šžčc])ṙ/g,"$1ŕ");
    }
    iW = iW.replace (/R/g, "r");
    iW = iW.replace (/x/g,"ks");

    iW = iW.replace (/([ńľřťďśź])j/g,"$1ıj");
    iW = iW.replace (/([dsz])j/g,"$1#j"); 
    iW = iW.replace (/%obj/g,"ob#j"); 
    iW = iW.replace (/%neobj/g,"neob#j"); 
    iW = iW.replace (/%vj/g,"v#j");


    /* FLAVORIZACIJE */

    if ((flav == "2") || (flav == "3") || (flav == "4")) {
        iW = iW.replace (/ê/g,"ě");
        iW = iW.replace (/ȯ%/g,"o%");
        iW = iW.replace (/ŭ/g,"v");
        iW = iW.replace (/[ṱḓ]/g,"");
        iW = iW.replace (/[’`]/g,"#%");
        iW = iW.replace (/([čšžj])ě/g,"$1e");
    }

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

    if (flav == "4")  {
        iW = iW.replace (/ě/g,"e");
        iW = iW.replace (/y/g,"i");
    }

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

    /* Latinica */

    if (type == 1)
    {	
        if (flav == "2")  { 
            iW = iW.replace (/ṙ/g,"r");
            iW = iW.replace (/ř/g,"ŕ");
            iW = iW.replace (/ľ/g,"ĺ");
            iW = iW.replace (/ť/g,"t́");
            iW = iW.replace (/ď/g,"d́");
            iW = iW.replace (/([čšžj])ŕ/g,"$1r");
        }
        else if ((flav == "3") || (flav == "4") || (flav == "J"))
        { 
            iW = iW.replace (/[ṙŕ]/g,"r");
            iW = iW.replace (/ȯ/g,"ă");
        }
        else if (flav == "S")
        { 
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

    /* Kirilica */
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

        if (flav == "1")	{
            iW = iW.replace (/ṙ/g,"ър");
            iW = iW.replace (/ŕ/g,"ьр");
            iW = iW.replace (/ě/g,"Ê");
            iW = iW.replace (/[ḓṱ]/g,"");
        }
        else {
            iW = iW.replace (/[ṙŕ]/g,"р");
            iW = iW.replace (/ė/g,"е");
            if (flav == "J")  {
                iW = iW.replace (/є/g,"е");
                iW = iW.replace (/л#ј/g,"љ");
                iW = iW.replace (/н#ј/g,"њ");
            }
            if (flav == "2") {
                iW = iW.replace (/є/g,"ѣ"); // DŠ  !!!
            }
        }

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
            if (flav == "1")	{
                iW = iW.replace (/[йь]е/g,"ѥ");
                iW = iW.replace (/[йь]и/g,"ӥ");
                iW = iW.replace (/ш[чћ]/g,"щ");
            }
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

    /* Glagolica */

    else if (type == 7)  {
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
            iW = iW.replace(/[ij]/g,"ⰻ"); /* ⰺ: INITIAL IZHE */
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
    }
    /* D.Š. Variant Glagolica */
    /*
    if (type == 7) {
        if (flav == "2") {
            iW = iW.replace(/tı/g, "ť");
            iW = iW.replace(/dı/g, "ď");
            iW = iW.replace(/sı/g, "ś");
            iW = iW.replace(/zı/g, "ź");
            iW = iW.replace(/lı/g, "ľ");
            iW = iW.replace(/nı/g, "ń");
            iW = iW.replace(/rı/g, "ř");
            iW = iW.replace(/ı/g, "");
        }
        else {
            iW = iW.replace(/ŕ/g, "r");
        }
        iW = iW.replace(/ŕ/g, "ır");
        iW = iW.replace(/([ščžj])ı/g, "$1");

        iW = iW.replace(/ľ/g, "ⰾⱐ"); // ль
        iW = iW.replace(/lj/g, "ⰾⱐ"); // ль
        iW = iW.replace(/ń/g, "ⱀⱐ"); // нь
        iW = iW.replace(/nj/g, "ⱀⱐ"); // нь
        iW = iW.replace(/[ŕṙ]/g, "ⱏⱃ"); // ьр
        iW = iW.replace(/ř/g, "ⱏⱃ"); // рь
        iW = iW.replace(/ť/g, "ⱅⱐ"); // ть
        iW = iW.replace(/ď/g, "ⰴⱐ"); // дь
        iW = iW.replace(/ś/g, "ⱄⱐ"); // сь
        iW = iW.replace(/ź/g, "ⰸⱐ"); // зь

        iW = iW.replace(/ć/g, "ⱍⱐ");  // чь
        iW = iW.replace(/đ/g, "ⰼ"); // džerv
        iW = iW.replace(/a/g, "ⰰ"); // а
        iW = iW.replace(/å/g, "ⱉ"); // от
        iW = iW.replace(/b/g, "ⰱ"); // б
        iW = iW.replace(/v/g, "ⰲ"); // в
        iW = iW.replace(/g/g, "ⰳ"); // г
        iW = iW.replace(/d/g, "ⰴ"); // д
        iW = iW.replace(/e/g, "ⰵ"); // е
        iW = iW.replace(/ě/g, "ⱑ"); // ять
        iW = iW.replace(/ž/g, "ⰶ"); // ж
        iW = iW.replace(/z/g, "ⰸ"); // з
        iW = iW.replace(/i/g, "ⰻ"); // и
        iW = iW.replace(/j/g, "ⰹ"); // иже
        iW = iW.replace(/k/g, "ⰽ"); // к
        iW = iW.replace(/l/g, "ⰾ"); // л
        iW = iW.replace(/m/g, "ⰿ"); // м
        iW = iW.replace(/n/g, "ⱀ"); // н
        iW = iW.replace(/o/g, "ⱁ"); // он
        iW = iW.replace(/p/g, "ⱂ"); // п
        iW = iW.replace(/[rṙ]/g, "ⱃ"); // р
        iW = iW.replace(/s/g, "ⱄ"); // с
        iW = iW.replace(/t/g, "ⱅ"); // т
        iW = iW.replace(/u/g, "ⱆ"); // у
        iW = iW.replace(/f/g, "ⱇ"); // ф
        iW = iW.replace(/h/g, "ⱈ"); // х
        iW = iW.replace(/c/g, "ⱌ"); // ц
        iW = iW.replace(/č/g, "ⱍ"); // ч
        iW = iW.replace(/š/g, "ⱎ"); // ш
        iW = iW.replace(/yj/g, "ⱐⰹⰺ"); // ыј=ъјі
        iW = iW.replace(/y/g, "ⱐⰹ"); // ы=ъј
        iW = iW.replace(/ę/g, "ⱔ"); // ѧ small yus
        iW = iW.replace(/ų/g, "ⱘ"); // ѫ big yus
        iW = iW.replace(/òj/g, "ⱏⰺ"); // ъі
        iW = iW.replace(/ò/g, "ⱏ"); // ъ
        iW = iW.replace(/`/g, "’");
        iW = iW.replace(/ı/g, "ⱐ"); // ь

        iW = iW.replace(/ⱎⱍⱐ/g, "ⱋ");  // шчь=щ
        iW = iW.replace(/[ⰹⰺⱐ]ⰰ/g, "ⱝ"); // [јіь]а
        iW = iW.replace(/[ⰹⰺⱐ]ⱔ/g, "ⱗ"); // [јіь]ѧ
        iW = iW.replace(/[ⰹⰺⱐ]ⰻ/g, "ⰺ"); // [јіь]и
        iW = iW.replace(/[ⰹⰺⱐ]ⱁ/g, "ⱖ"); // [јіь]о
        iW = iW.replace(/[ⰹⰺⱐ]ⱆ/g, "ⱓ"); // [јіь]у
        iW = iW.replace(/[ⰹⰺⱐ]ⱘ/g, "ⱙ"); // [јіь]ѫ

        iW = iW.replace(/ⰻⰵ/g, "ⰺⰵ"); // ие
        iW = iW.replace(/ⰻⰰ/g, "ⰺⰰ"); // иа
        iW = iW.replace(/ⰻⱁ/g, "ⰺⱁ"); // ио
        iW = iW.replace(/ⰻⱆ/g, "ⰺⱆ"); // иу
    }

    */

    iW = iW.replace (/jj/g,"j");
    iW = iW.replace (/[#ı%]/g,"");
    OrigW = OrigW.replace (/%/g,"");

    /** Hoofdletters maken **/

    let iW_first = iW.charAt (0);
    let iW_rest = iW.substring (1);

    iW = iW.replace (/℅/g,"%");

    return iW;
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
