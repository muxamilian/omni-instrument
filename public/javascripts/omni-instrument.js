(function() {

  var pitches = {
    16: "C0",
    17: "C♯0",
    18: "D0",
    19: "D♯0",
    21: "E0",
    22: "F0",
    23: "F♯0",
    25: "G0",
    26: "G♯0",
    28: "A0",
    30: "A♯0",
    31: "B0",

    33: "C1",
    35: "C♯1",
    37: "D1",
    39: "D♯1",
    41: "E1",
    44: "F1",
    47: "F♯1",
    49: "G1",
    52: "G♯1",
    55: "A1",
    58: "A♯1",
    62: "B1",

    65: "C2",
    69: "C♯2",
    73: "D2",
    78: "D♯2",
    82: "E2",
    87: "F2",
    92: "F♯2",
    98: "G2",
    104: "G♯2",
    110: "A2",
    117: "A♯2",
    123: "B2",

    131: "C3",
    139: "C♯3",
    147: "D3",
    156: "D♯3",
    165: "E3",
    175: "F3",
    185: "F♯3",
    196: "G3",
    208: "G♯3",
    220: "A3",
    233: "A♯3",
    247: "B3",

    262: "C4",
    277: "C♯4",
    294: "D4",
    311: "D♯4",
    330: "E4",
    349: "F4",
    370: "F♯4",
    392: "G4",
    415: "G♯4",
    440: "A4",
    466: "A♯4",
    494: "B4",

    523: "C5",
    554: "C♯5",
    587: "D5",
    622: "D♯5",
    659: "E5",
    698: "F5",
    740: "F♯5",
    784: "G5",
    831: "G♯5",
    880: "A5",
    932: "A♯5",
    988: "B5",

    1047: "C6",
    1109: "C♯6",
    1175: "D6",
    1245: "D♯6",
    1319: "E6",
    1397: "F6",
    1480: "F♯6",
    1568: "G6",
    1661: "G♯6",
    1760: "A6",
    1865: "A♯6",
    1976: "B6",

    2093: "C7",
    2218: "C♯7",
    2349: "D7",
    2489: "D♯7",
    2637: "E7",
    2794: "F7",
    2960: "F♯7",
    3136: "G7",
    3322: "G♯7",
    3520: "A7",
    3729: "A♯7",
    3951: "B7",

    4168: "C8",
    4435: "C♯8",
    4699: "D8",
    4978: "D♯8",
    5274: "E8",
    5588: "F8",
    5920: "F♯8",
    6272: "G8",
    6645: "G♯8",
    7040: "A8",
    7459: "A♯8",
    7902: "B8",

    8372: "C9",
    8870: "C♯9",
    9397: "D9",
    9956: "D♯9",
    10548: "E9",
    11175: "F9",
    11840: "F♯9",
    12544: "G9",
    13290: "G♯9",
    14080: "A9",
    14917: "A♯9",
    15804: "B9",

    16744: "C10",
    17740: "C♯10",
    18795: "D10",
    19912: "D♯10",
    21096: "E10",
    22351: "F10",
    23680: "F♯10",
    25088: "G10",
    26580: "G♯10",
    28160: "A10",
    29835: "A♯10",
    31609: "B10",
  }

  var canvas = document.getElementById('canvas');
  var c = canvas.getContext('2d');

  // resize the canvas to fill browser window dynamically
  window.addEventListener('resize', resizeCanvas, false);

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // for retina displays
    canvas.width = canvas.width * window.devicePixelRatio;
    canvas.height = canvas.height * window.devicePixelRatio;

    /*
    Your drawings need to be inside this function otherwise they will be reset when
    you resize the browser window and the canvas goes will be cleared.
    */
    drawStuff();
  }



  // IMPORTANT STUFF
  var TEXT_OFFSET = 5;

  var startFrq = 15;
  var endFrq = 10000;

  function getStartFrq() { return startFrq; }
  function setStartFrq(val) { startFrq = val; }
  function getEndFrq() { return endFrq; }
  function setEndFrq(val) { endFrq = val; }

  function getRange() {
    return endFrq - startFrq;
  }

  var STANDARD_BLUE = "#06f";

  var isDigit = (function() {
    var re = /^\d$/;
    return function(c) {
      return re.test(c);
    }
  }());

  function splitPitchName(pitchName) {
    var nonNumCounter = 0;
    for (var i=0; i<pitchName.length; i++) {
      if (isDigit(pitchName.charAt(i))) {
        break;
      } else {
        nonNumCounter += 1;
      }
    }

    return {text: pitchName.slice(0,nonNumCounter),
            number: pitchName.slice(nonNumCounter)};
  }

  function pixelToFrq(pixelNum) {
    return ((pixelNum/canvas.height) * getRange()) + start_frq;
  }

  function frqToPixel(frq) {
    return Math.round((frq/getRange()) * canvas.height) - 1;
  }

  // You must always add 0.5 in order that the line is drawn in the right way.
  function drawLines() {
    for (var pitch in pitches) {
      var pixelNum = frqToPixel(pitch);
      c.beginPath();
      c.moveTo(0.5, ((canvas.height-1) - pixelNum) + 0.5);
      c.lineTo(canvas.width + 0.5, ((canvas.height-1) - pixelNum) + 0.5);
      c.stroke();

      c.save();
      c.fillStyle = STANDARD_BLUE;
      c.fillText(splitPitchName(pitches[pitch]).text,
                 TEXT_OFFSET*window.devicePixelRatio,
                 ((canvas.height-1) - pixelNum) - TEXT_OFFSET*window.devicePixelRatio);
      var textWidth = c.measureText(splitPitchName(pitches[pitch]).text).width;
      console.log(textWidth);
      c.font = "normal 300 9px Ubuntu";
      c.fillText(splitPitchName(pitches[pitch]).number,
                 (TEXT_OFFSET+0.75)*window.devicePixelRatio + textWidth,
                 ((canvas.height-1) - pixelNum) - (TEXT_OFFSET-2)*window.devicePixelRatio);
      c.restore();
    }
  }

  function drawStuff() {
    // Set font to Ubuntu in the ultra-light version
    c.font = "normal 300 10px Ubuntu";
    drawLines();
  }

  // Add event listener for touch events and draw a circle there.
  canvas.addEventListener('touchmove', function(event) {
    for (var i = 0; i < event.touches.length; i++) {
      var touch = event.touches[i];
      c.beginPath();
      c.arc(touch.pageX, touch.pageY, 20, 0, 2*Math.PI, true);
      c.fill();
      c.stroke();
    }
  }, false);

  // Call resizeCanvas when the page loads for the first time.
  resizeCanvas();

  window.c = c;
})();
