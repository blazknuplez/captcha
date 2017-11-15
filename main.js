var width = 400,
    height = 100;

var text = "FUCK";

var fonts = [ 'Roboto', 'Rozha One', 'Open Sans', 'Roboto Condensed', 'Oswald', 'Lora', 'Open Sans Condensed',
    'Barlow Condensed', 'Playfair Display', 'Barlow', 'Barlow Semi Condensed', 'PT Sans Narrow', 'Poppins',
    'Indie Flower', 'Anton', 'Fjalla One', 'Lobster', 'Spirax', 'Abril Fatface' ];
var weights = [ 'normal', 'bold', 'bolder', 'lighter' ];

var background = new Path({
    segments: [[0, 0],[width, 0], [width, height], [0, height]]
});
background.fillColor = '#2851ee';

var polyList = [];
var currentX1 = -25;
var currentX2 = 25;
var currentY1 = -25;
var currentY2 = 25;
var deltaX = 50;
for(var r=0; r<3; r++){
    for(var c=0; c<20; c++){
        var patternPath = new Path();
        patternPath.fillColor = getRandomColor();
        var x1, x2;
        x1 = c == 0 ? currentX1 : polyList[polyList.length - 1].segments[1].point.x;
        x2 = getRandomNumber(10, 50);
        patternPath.add(new Point(x1, currentY1));
        patternPath.add(new Point(x2 + x1, currentY1));
        patternPath.add(new Point(x1 + x2 / 2, currentY2));
        patternPath.closed = true;
        currentX1 += deltaX;
        currentX2 += deltaX;
        polyList.push(patternPath);
    }
    currentX1 = -25;
    currentX2 = 25;
    currentY1 += 50;
    currentY2 += 50;
}

currentX1 = -25;
currentX2 = 25;
currentY1 = 25;
currentY2 = -25;

for(var r=0; r<3; r++){
    for(var c=0; c<20; c++){
        var patternPath = new Path();
        patternPath.fillColor = getRandomColor();
        var x1, x2, x3;
        if(c == 0){
            x1 = currentX1;
            x2 = polyList[r * 20 + c].segments[2].point.x;
            x3 = currentX1;
        } else {
            x1 = polyList[polyList.length - 1].segments[1].point.x;
            x2 = polyList[r * 20 + c].segments[2].point.x;
            x3 = polyList[r * 20 + c].segments[0].point.x;
        }

        patternPath.add(new Point(x1, currentY1));
        patternPath.add(new Point(x2, currentY1));
        patternPath.add(new Point(x3, currentY2));
        patternPath.closed = true;
        patternPath.closed = true;
        currentX1 += deltaX;
        currentX2 += deltaX;

        polyList.push(patternPath);
    }

    currentX1 = -25;
    currentX2 = 25;
    currentY1 += 50;
    currentY2 += 50;
}



var posX = width / 2,
    posY = height / 2,
    dX = getRandomNumber(40, 140),
    dY;

var charLocation = new Point(-dX + posX, posY),
    char,
    characters = [];

for(var i=0; i<text.length; i++){
    dX = getRandomNumber(10, 40);
    dY = getRandomNumber(45, height - 45);

    charLocation = new Point(charLocation.x + 10 + dX, dY);
    char = new PointText(charLocation);

    var font = getRandomNumber(0, fonts.length),
        weight = getRandomNumber(0, weights.length),
        fontSize = getRandomNumber(30, 50);

    char.style = {
        fontFamily: fonts[font],
        fontWeight: weight[weight],
        fontSize: fontSize,
        fillColor: '#36a7ee',
        justification: 'left'
    };

    var rotation = getRandomNumber(-120, 120),
        skew = getRandomNumber(0, 6);

    char.rotate(rotation, charLocation);
    char.skew(new Point(skew, posY)); //TODO: learn how the fuck this shit works
    char.content = text[i];
    characters.push(char);
}


var maxRotation = 180,
    currentRotation = 0,
    rotation = 1;

var maxXtranslate = 400,
    currentXtranslate = 0,
    xTranslate = 1;

var maxYtranslate = 100,
    currentYtranslate = 0,
    yTranslate = 1;

function onFrame(event) {
    //background.fillColor.hue += 0.5;
    for(var i=0; i<characters.length; i++){
        characters[i].rotate(rotation);
        characters[i].translate(xTranslate, yTranslate);

        if(event.count % text.length == i){
            characters[i].visible = !characters[i].visible;
        }

        incrementCounters();
        checkBorders();
    }

    for(var i=0; i<polyList.length; i++){
        var speed = i < 20 ? 2 :
                    i < 40 ? 0.5 : -2;
        polyList[i].rotate(speed);
        //polyList[i].translate(xTranslate, yTranslate);
    }
}

function incrementCounters() {
    currentRotation++;
    currentXtranslate++;
    currentYtranslate++;
}

function checkBorders(){
    if(currentRotation > Math.abs(maxRotation)){
        rotation = -rotation;
        currentRotation = 0;
    }
    if(currentXtranslate > Math.abs(maxXtranslate)){
        xTranslate = -xTranslate;
        currentXtranslate = 0;
    }
    if(currentYtranslate > Math.abs(maxYtranslate)){
        yTranslate = -yTranslate;
        currentYtranslate = 0;
    }
}

function getRandomNumber(minNumber, maxNumber) {
    return Math.floor((Math.random() * maxNumber) + minNumber);
}

function getRandomColor(){
    var rgb1 = rgb("#2851ee");
    var rgb2 = rgb("#268fee");
    var rgb3 = [];
    for (var i=0; i<3; i++) rgb3[i] = rgb1[i]+Math.random()*(rgb2[i]-rgb1[i])|0;

    var newColor = '#' + rgb3
        .map(function(n){ return n.toString(16) })
        .map(function(s){ return "00".slice(s.length)+s}).join('');

    return newColor;
}

function rgb(string){
    return string.match(/\w\w/g).map(function(b){ return parseInt(b,16) })
}
