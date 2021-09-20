let res=25, eq = [], clrs = [], p = [], font, last = 0, clr, factor = 50;

function preload() {
    font = loadFont('./Rubik-font.ttf');
}
function setup() {
    createCanvas(window.innerWidth-window.innerWidth%(res*2)-100, window.innerHeight-window.innerHeight%(res*2)-100);

    clrs.push(color(255, 0, 0)); // red
    clrs.push(color(0, 255, 0)); // green
    clrs.push(color(0, 0, 255)); // blue
    clrs.push(color(255, 0, 255)); // purple
    clrs.push(color(0, 255, 255)); // cyne
    clrs.push(color(205, 205, 0)); // yellow

    textSize(20);
    clr = clrs[int(Math.random()*clrs.length)];
    factor = 1.0;
    res = 25;
}

function isdigit(x) {
    return ('0' <= x && x <= '9');
}

function fix(s) {
    s = s.toLowerCase();
    let nigga = false;
    let pp = "";

    for (let i = 0; i < s.length; i++) {
        if (s[i] != ' ') pp += s[i];
    }

    s = pp;
    let c;

    let v = [];
    for (let i =0; i < s.length; i++) {
        if (s[i] == '+') i++;
        if (s[i] == '=' || s[i] == '\u2264' || s[i] == '\u2265' || s[i] == '<' || s[i] == '>') {
            nigga = true;
            c = s[i];
            i++;
        }

        let tmp = "";
        if (s[i] == '-') tmp += s[i++];
        while (i < s.length && s[i] != '-' && s[i] != '+' && !(s[i] == '=' || s[i] == '\u2264' || s[i] == '\u2265' || s[i] == '<' || s[i] == '>')) tmp += s[i++];

        if (nigga) {
            if (tmp[tmp.length-1] == 'y') {
                if (tmp[0] == '-') tmp = tmp.substr(1, tmp.length);
                else tmp = '-'+tmp;
            }
        } else {
            if (tmp[tmp.length-1] != 'y') {
                if (tmp[0] == '-') tmp = tmp.substr(1, tmp.length);
                else tmp = '-'+tmp;
            }
        }

        v.push(tmp);
        i--;
    }

    let m, a, b;
    m = a = b = 0;

    let cm = 0;
    for (let i = 0; i < v.length; i++) {
        if (v[i][v[i].length-1] == 'x') cm = 0;
        else if (v[i][v[i].length-1] == 'y') cm = 1;
        else cm = 2;

        if (!isdigit(v[i][v[i].length-1])) v[i] = v[i].substr(0, v[i].length-1);
        if (v[i] == "-") v[i] = "-1";
        if (v[i] == "") v[i] = "1";

        if (cm==0) m = float(v[i]);
        if (cm==1) a = float(v[i]);
        if (cm==2) b = float(v[i]);
    };

    eq.push(new equation(m, a, b, c, clr));

    console.log('a: ', a);
    console.log('b: ', b);
    console.log('m: ', m);
}

function equation(m, a, b, c, clr) {
    this.m = m;
    this.a = a;
    this.b = b;

    this.f = function(x) {
        return (this.m*x+this.b)/this.a;
    }

    this.render = function() {
        beginShape();

        push();
        clr.setAlpha(50);
        fill(clr);
        clr.setAlpha(200);
        strokeWeight(2);
        stroke(clr);

        if (!a) {
            if (c != '>' && c != '<') line (-b/m * res/factor, -1000*res/factor, -b/m * res/factor, 1000*res/factor);
            else {
                for (let i = -height/2; i < height/2; i+=10) {
                    line(-b/m * res/factor, i, -b/m * res/factor, i+10);
                    i += 10;
                }
            }
            push();
            noStroke();
            vertex(-b/m * res/factor, -1000*res/factor);
            vertex(-b/m * res/factor, 1000*res/factor);

            if (c == '\u2265' || c == '>') {
                vertex(1000*res/factor, -1000*res/factor);
                vertex(1000*res/factor, 1000*res/factor);
            }

            if (c == '\u2264' || c == '<') {
                vertex(-1000*res/factor, -1000*res/factor);
                vertex(-1000*res/factor, 1000*res/factor);
            }
            pop();
        } else {
            if (c != '>' && c != '<') line(-1000*res/factor, -this.f(-1000)*res/factor, 1000*res/factor, -this.f(1000)*res/factor);
            else {
                for (let i = -width/2; i < width/2; i += 10) {
                    line(i, -this.f(i/res/factor)*res/factor, i+10, -this.f((i+10)/res/factor)*res/factor);
                    i += 10;
                }
            }

            push();
            noStroke();
            vertex(-1000*res/factor, -this.f(-1000)*res/factor);
            vertex(1000*res/factor, -this.f(1000)*res/factor);
            if (m < 0) {
                if (c == '\u2265' || c == '>') {
                    vertex(1000*res/factor, -1000*res/factor);
                }

                if (c == '\u2264' || c == '<') {
                    vertex(-1000*res/factor, 1000*res/factor);
                }
            } else if (m > 0) {
                if (c == '\u2265' || c == '>') {
                    vertex(-1000*res/factor, -1000*res/factor);
                }

                if (c == '\u2264' || c == '<') {
                    vertex(1000*res/factor, 1000*res/factor);
                }
            } else {
                if (c == '\u2265' || c == '>') {
                    vertex(-1000*res/factor, -1000*res/factor);
                    vertex(1000*res/factor, -1000*res/factor);
                }

                if (c == '\u2264' || c == '<') {
                    vertex(-1000*res/factor, 1000*res/factor);
                    vertex(1000*res/factor, 1000*res/factor);
                }
            }
            pop();
        }

        endShape();
        pop();
    }
}
function inter(a, b) {
    let x, y;
    if (a.a == 0) {
        if (b.a == 0) {
            return;
        }

        x = a.b/-a.m;
        y = b.f(x);
    } else if (b.a == 0) {
        x = b.b/-b.m;
        y = a.f(x);
    } else {
        if (a.m/a.a == b.m/b.a) return;
        x = (b.b/b.a-a.b/a.a)/(a.m/a.a-b.m/b.a);
        y = a.f(x);
    }

    fill(0);
    p.push(createVector(x, y));
}
function addE() {
    var s = prompt("Add an equation: ", "");
    s = s.replace("<=", '\u2264');
    s = s.replace(">=", '\u2265');
    console.log(s);
    fix(s);
    if (eq.length != last) {
        p = [];
        for (let i = 0; i < eq.length; i++) {
            for (let j = i+1; j < eq.length; j++) {
                inter(eq[i], eq[j]);
            }
        }

        last = eq.length;
    }

    idk();
}
function rmE() {
    eq.pop();
    if (eq.length != last) {
        p = [];
        for (let i = 0; i < eq.length; i++) {
            for (let j = i+1; j < eq.length; j++) {
                inter(eq[i], eq[j]);
            }
        }

        last = eq.length;
    }
    idk();
}
function idk() {
    let pp = "";
    for (let i = 0; i < p.length; i++) {
         pp += "("+p[i].x+', ' + p[i].y+")";
         if (i != p.length-1) pp += ", ";
    }

    document.getElementById("cum").innerHTML = "Intersections: " + pp;
}
function changeFactor() {
    var s = prompt("Factor: ", "");
    factor = float(s);
}
function changeRes() {
    var s = prompt("Resulotion: ", "");
    res = float(s);
}
function colorstuff() {
    var s = prompt("Resulotion: ", "");
    clr = color(s);
}

function draw() {
    background(255);
    frameRate(10);

    //~~~~~~~~~~~~~~grid~~~~~~~~~~~~~~~~~~~
    push();
    stroke(0, 50);
    for (let i = 0; i <= width; i+=res) {
        line(i, 0, i, height);
    }

    for (let i = 0; i <= height; i+=res) {
        line(0, i, width, i);
    }

    stroke(0);
    strokeWeight(2);
    line(width/2, 0, width/2, height);
    line(0, height/2, width, height/2);
    pop();
    //~~~~~~~~~~~~~~grid~~~~~~~~~~~~~~~~~~~
    translate(width/2, height/2);

    for (let i = 0; i < eq.length; i++) {
        eq[i].render();
    }

    //~~~~~~~~~~~~~points~~~~~~~~~~~~
    fill(0);
    noStroke();
    let mn = 1000000.0, ind = 0;
    for (let i = 0; i < p.length; i++) {
        ellipse(p[i].x*res/factor, -p[i].y*res/factor, 5);
        if (dist(mouseX-width/2, mouseY-height/2, p[i].x*res/factor, -p[i].y*res/factor) < mn) {
            mn = dist(mouseX-width/2, mouseY-height/2, p[i].x*res/factor, -p[i].y*res/factor);
            ind = i;
        }
    }

    if (p.length) {
        if (mn <= 20) {
            fill(0);
            let w = font.textBounds("("+p[ind].x+', ' + p[ind].y+")", p[ind].x*res/factor, -p[ind].y*res/factor);
            rect(w.x-5, w.y-5, w.w+10, w.h+10);
            fill(255);
            text("("+p[ind].x+', ' + p[ind].y+")", p[ind].x*res/factor-3, -p[ind].y*res/factor-3);
        }
    }
}
