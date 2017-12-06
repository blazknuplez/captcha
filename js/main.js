var width = 400,
    height = 100;

var text = getRandomString();

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var encoder = new GIFEncoder();
encoder.setRepeat(1);
//encoder.setSize(400, 200);
encoder.setQuality(5);
encoder.setFrameRate(30);
encoder.start();
var generating = false;

var frames = 0;

var fonts = [ 'Roboto', 'Rozha One', 'Open Sans', 'Roboto Condensed', 'Oswald', 'Lora', 'Open Sans Condensed',
    'Barlow Condensed', 'Playfair Display', 'Barlow', 'Barlow Semi Condensed', 'PT Sans Narrow', 'Poppins',
    'Indie Flower', 'Anton', 'Fjalla One', 'Lobster', 'Spirax', 'Abril Fatface' ];
var weights = [ 'normal', 'bold', 'bolder', 'lighter' ];

var colorPrimary = '#5696e6';
var colorSecondary = '#064ee6';

var background = new Path({
    segments: [[0, 0],[width, 0], [width, height], [0, height]]
});
background.fillColor = colorPrimary;

var polyList = [];
var polyData = [];
var currentX1 = -25;
var currentX2 = 25;
var currentY1 = -25;
var currentY2 = 25;
var deltaX = 50;
for(var r=0; r<4; r++){
    for(var c=0; c<15; c++){
        var patternPath = new Path();
        var x1, x2;
        x1 = c == 0 ? currentX1 : polyList[polyList.length - 1].segments[1].point.x;
        x2 = getRandomNumber(10, 50);
        patternPath.add(new Point(x1, currentY1));
        patternPath.add(new Point(x2 + x1, currentY1));
        patternPath.add(new Point(x1 + x2 / 2, currentY2));
        patternPath.closed = true;
        currentX1 += deltaX;
        currentX2 += deltaX;
        patternPath.fillColor = {
            gradient: {
                stops: [colorPrimary, getRandomColor()],
            },
            origin: patternPath.bounds.topLeft,
            destination: patternPath.bounds.bottomRight
        };

        var data = {
            rotation: getDecRandomNumber(0, 2),
            currentScaleX: 0,
            maxScaleX: getDecRandomNumber(0, 2),
            scaleXstep: 0.003,
        };

        polyList.push(patternPath);
        polyData.push(data);
        polyData.push(data);
    }
    currentX1 = -25;
    currentX2 = 25;
    currentY1 += 35;
    currentY2 += 35;
}

currentX1 = -25;
currentX2 = 25;
currentY1 = 25;
currentY2 = -25;

for(var r=0; r<4; r++){
    for(var c=0; c<15; c++){
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

        var patternPath = new Path();
        patternPath.add(new Point(x1, currentY1));
        patternPath.add(new Point(x2, currentY1));
        patternPath.add(new Point(x3, currentY2));
        patternPath.closed = true;

        patternPath.fillColor = {
            gradient: {
                stops: [colorPrimary, getRandomColor()],
            },
            origin: patternPath.bounds.topLeft,
            destination: patternPath.bounds.bottomRight
        };
        currentX1 += deltaX;
        currentX2 += deltaX;
        var data = {
            rotation: getDecRandomNumber(0, 2),
            currentScaleX: 0,
            maxScaleX: getDecRandomNumber(0, 2),
            scaleXstep: 0.003
        };

        polyList.push(patternPath);
        polyData.push(data);
    }

    currentX1 = -25;
    currentX2 = 25;
    currentY1 += 35;
    currentY2 += 35;
}



var posX = -20,
    posY = height / 2,
    dX = getDecRandomNumber(0, 20),
    dY = 45;

var charLocation,
    char,
    characters = [],
    charData = [];

for(var i=0; i<text.length; i++){
    dX += getRandomNumber(20, 40);
    dY = 30 + (dY + getDecRandomNumber(0, 40)) % 60;

    charLocation = new Point(dX, dY);
    char = new PointText(charLocation);

    var font = getRandomNumber(0, fonts.length),
        weight = getRandomNumber(0, weights.length),
        fontSize = getRandomNumber(30, 50);

    char.style = {
        fontFamily: fonts[font],
        fontWeight: weight[weight],
        fontSize: fontSize,
        fillColor: {
            gradient: {
                stops: [colorSecondary, colorSecondary],
            },
            origin: new Point(charLocation.x, charLocation.y),
            destination: new Point(charLocation.x + 20, dY + 20)
        },
        justification: 'left'
    };

    char.opacity = 0.75;

    var rotation = getRandomNumber(0, 40),
        skewX = getDecRandomNumber(0, 20),
        skewY = getDecRandomNumber(0, 20);

    char.rotate(rotation);
    char.skew(new Point(skewX, skewY));
    char.content = text[i];

    var data = {
        currentSkew: 0,
        maxSkew: getDecRandomNumber(0, 30),
        skewStep: getDecRandomNumber(0, 0.1),
        rotationStep: getDecRandomNumber(0, 1),
        currentScale: 0,
        maxScale: getDecRandomNumber(0, 0.5),
        scaleStep: 0.005,
        visibilityStep: getRandomNumber(50, 100),
        visibilityDuration: getRandomNumber(0, 60)
    };

    console.log(data);

    charData.push(data);
    characters.push(char);
}


var maxRotation = 180,
    currentRotation = 0,
    rotation = 0;

var maxXtranslate = 400,
    currentXtranslate = 0,
    xTranslate = 0;

var maxYtranslate = 100,
    currentYtranslate = 0,
    yTranslate = 0;

var skew = new Point(1, 1);

function onFrame(event) {
    //background.fillColor.hue += 0.5;

    if(generating && frames < 100){
        encoder.addFrame(context);
        frames++;
        $("span#progress").text(frames + "%");
    } else if(generating && frames == 100) {
        generating = false;
        encoder.finish();
        var name = $("input#name").val();
        encoder.download(name);
    }

    for(var i=0; i<characters.length; i++){
        characters[i].rotate(Math.sin(event.count / (charData[i].rotationStep * 35)));
        characters[i].translate(xTranslate, yTranslate);

        charData[i].currentScale += charData[i].scaleStep;
        characters[i].scale(1 + charData[i].scaleStep, 1 + charData[i].scaleStep);

        charData[i].currentSkew += charData[i].skewStep;
        characters[i].skew(new Point(charData[i].skewStep, charData[i].skewStep));

        if(event.count % 150 == charData[i].visibilityStep)
            characters[i].visible = false;
        else if (event.count % 150 == (charData[i].visibilityStep + charData[i].visibilityDuration) % 150)
            characters[i].visible = true;


        checkCharBorders(i);
        incrementCounters();
        checkBorders();
    }

    for(var i=0; i<polyList.length; i++){
        polyList[i].rotate(polyData[i].rotation / 3);

        polyData[i].currentScaleX = polyData[i].currentScaleX + polyData[i].scaleXstep;
        polyList[i].scale(1 + polyData[i].scaleXstep, 1 + polyData[i].scaleXstep);
        checkPolyBorders(i);
    }
}

function incrementCounters() {
    currentRotation++;
    currentXtranslate++;
    currentYtranslate++;
}

function checkCharBorders(i){
    if(Math.abs(charData[i].currentScale) > Math.abs(charData[i].maxScale)){
        charData[i].scaleStep = -charData[i].scaleStep;
        charData[i].currentScale = 0;
    }

    if(Math.abs(charData[i].currentSkew) > Math.abs(charData[i].maxSkew)){
        charData[i].skewStep = -charData[i].skewStep;
        charData[i].currentSkew = 0;
    }
}

function checkPolyBorders(i) {

    if(Math.abs(polyData[i].currentScaleX) > Math.abs(polyData[i].maxScaleX )){
        polyData[i].scaleXstep = -polyData[i].scaleXstep;
        polyData[i].currentScaleX = 0;
    }
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

function getDecRandomNumber(minNumber, maxNumber) {
    var sign = getRandomNumber(0, 2) == 0 ? -1 : 1;
    return sign * ((Math.random() * maxNumber) + minNumber);
}

function getRandomColor(){
    var rgb1 = rgb(colorPrimary);
    var rgb2 = rgb(colorSecondary);
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

function getUnicodeChar(){
    return String.fromCharCode(0x2600 + Math.random() * (0x2B50-0x2600+1));
}

$('body').on('click', 'button#generate', function() {
    frames = 0;
    generating = true;
});

function getRandomString() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

////////////////////
/*
var keyboardText = "" + text;
for(var i=0; i<30 - text.length; i++){
    var char = getUnicodeChar();
    while(text.indexOf(char) >= 0){
        char = getUnicodeChar();
    }
    keyboardText += char;
}

keyboardText = keyboardText.split('').sort(function(){return 0.5-Math.random()}).join('');
for(var i=0; i<3; i++){
    for(var j=0; j<10; j++){
        $("#keyboard").append("<span class='character'>" + keyboardText[i * 10 + j] + "</span>");
    }
    $("#keyboard").append("<br>");
}

$('body').on('click', 'span.character', function() {
    var currentVal = $('#input').val();
    $('#input').val(currentVal + ($(this).text()));
});

$('body').on('click', 'button', function() {
    var currentVal = $('#input').val();
    alert(currentVal == text);
});
*/
