var width = 400,
    height = 100;

var text = "A34bcS3";

var fonts = [ 'Roboto', 'Rozha One', 'Open Sans', 'Roboto Condensed', 'Oswald', 'Lora', 'Open Sans Condensed',
              'Barlow Condensed', 'Playfair Display', 'Barlow', 'Barlow Semi Condensed', 'PT Sans Narrow', 'Poppins',
              'Indie Flower', 'Anton', 'Fjalla One', 'Lobster', 'Spirax', 'Abril Fatface' ];
var weights = [ 'normal', 'bold', 'bolder', 'lighter' ];

var background = new Path({
  segments: [[0, 0],[width, 0], [width, height], [0, height]]
});
background.fillColor = 'red';

var posX = width / 2,
    posY = height / 2,
    dX = getRandomNumber(40, 140),
    dY;

var charLocation = new Point(-dX + posX, posY),
    char,
    characters = [];

for(var i=0; i<text.length; i++){
    dX = getRandomNumber(0, 40);
    dY = getRandomNumber(45, height - 45);

    charLocation = new Point(charLocation.x + 10 + dX, dY);
    char = new PointText(charLocation);

    var font = getRandomNumber(0, fonts.length),
        weight = getRandomNumber(0, weights.length),
        fontSize = getRandomNumber(30, 50);

    console.log(fonts[font]);

    char.style = {
        fontFamily: fonts[font],
        fontWeight: weight[weight],
        fontSize: fontSize,
        fillColor: 'white',
        justification: 'center'
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
    background.fillColor.hue += 0.5;
    for(var i=0; i<characters.length; i++){
        characters[i].rotate(rotation);
        characters[i].translate(xTranslate, yTranslate);

        incrementCounters();
        checkBorders();
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
