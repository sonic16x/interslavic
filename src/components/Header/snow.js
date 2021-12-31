var marginbottom, marginright, timer, snowmax = 40,
    snowcolor = new Array("#b9dff5", "#7fc7ff", "#7fb1ff", "#7fc7ff", "#b9dff5"), snowtype = new Array("Times"),
    snowletter = "&#10052;", sinkspeed = .4, snowmaxsize = 40, snowminsize = 10, snowingzone = 1, snow = new Array,
    i_snow = 0, x_mv = new Array, crds = new Array, lftrght = new Array;

function randommaker(n) {
    return Math.floor(n * Math.random());
}

function movesnow() {
    for (let i = 0; i <= snowmax; i++) crds[i] += x_mv[i], snow[i].posy += snow[i].sink, snow[i].style.left = snow[i].posx + lftrght[i] * Math.sin(crds[i]) + "px", snow[i].style.top = snow[i].posy + "px", (snow[i].posy >= marginbottom - 2 * snow[i].size || parseInt(snow[i].style.left) > marginright - 3 * lftrght[i]) && (1 == snowingzone && (snow[i].posx = randommaker(marginright - snow[i].size)), 2 == snowingzone && (snow[i].posx = randommaker(marginright / 2 - snow[i].size)), 3 == snowingzone && (snow[i].posx = randommaker(marginright / 2 - snow[i].size) + marginright / 4), 4 == snowingzone && (snow[i].posx = randommaker(marginright / 2 - snow[i].size) + marginright / 2), snow[i].posy = 0);
    setTimeout(() => requestAnimationFrame(movesnow), 50);
}

export function initsnow() {
    for (let i = 0; i <= snowmax; i++) document.body.insertAdjacentHTML("beforeend", "<span id='s" + i + "' style='user-select:none;position:fixed;top:-" + snowmaxsize + "'>" + snowletter + "</span>");
    marginbottom = document.documentElement.clientHeight + 50, marginright = document.body.clientWidth - 15;
    let n = snowmaxsize - snowminsize;
    for (let i = 0; i <= snowmax; i++) crds[i] = 0, lftrght[i] = 15 * Math.random(), x_mv[i] = .03 + Math.random() / 10, snow[i] = document.getElementById("s" + i), snow[i].style.fontFamily = snowtype[randommaker(snowtype.length)], snow[i].size = randommaker(n) + snowminsize, snow[i].style.fontSize = snow[i].size + "px", snow[i].style.color = snowcolor[randommaker(snowcolor.length)], snow[i].style.zIndex = 1e3, snow[i].sink = sinkspeed * snow[i].size / 5, 1 == snowingzone && (snow[i].posx = randommaker(marginright - snow[i].size)), 2 == snowingzone && (snow[i].posx = randommaker(marginright / 2 - snow[i].size)), 3 == snowingzone && (snow[i].posx = randommaker(marginright / 2 - snow[i].size) + marginright / 4), 4 == snowingzone && (snow[i].posx = randommaker(marginright / 2 - snow[i].size) + marginright / 2), snow[i].posy = randommaker(2 * marginbottom - marginbottom - 2 * snow[i].size), snow[i].style.left = snow[i].posx + "px", snow[i].style.top = snow[i].posy + "px";
    movesnow()
}


