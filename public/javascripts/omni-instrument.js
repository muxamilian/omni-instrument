(function() {



  /* ***************************** *
   * CONSTANTS and other variables *
   * ***************************** */

  var PITCHES = {
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

  var TEXT_OFFSET = 3;

  var canvas = document.getElementById('canvas');
  var c = canvas.getContext('2d');

  // Set font to Ubuntu in the ultra-light version
  c.font = "normal 300 10px Ubuntu";

  var ongoingTouches = [];

  var startFrq = 100;
  var endFrq = 4000;

  // Yes, it's a cumbersome name
  var log2OfEndFrqDividedByStartFrq = caltulateLog2OfEndFrqDividedByStartFrq();
  window.getStartFrq = function() { return startFrq; }
  window.setStartFrq = function(val) {
    startFrq = val;
    log2OfEndFrqDividedByStartFrq = caltulateLog2OfEndFrqDividedByStartFrq();
  }

  window.getEndFrq   = function() { return endFrq; }
  window.setEndFrq   = function(val) {
    endFrq = val;
    log2OfEndFrqDividedByStartFrq = caltulateLog2OfEndFrqDividedByStartFrq();
  }

  var STANDARD_COLOR_1 = "#e11";

  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  var aCtx = new AudioContext();

  // 0 = Sine wave, 1 = Square wave, 2 = Sawtooth wave, 3 = Triangle wave
  var soundType = 0;
  window.getSoundType = function() { return soundType; }
  window.setSoundType = function(val) { soundType = val; }



  /* ***************** *
   * Utility functions *
   * ***************** */

  var isDigit = (function() {
    var re = /^\d$/;
    return function(c) {
      return re.test(c);
    }
  }());

  function splitPitchName(pitchName) {
    var nonNumCounter = 0;
    for (var i=0; i<pitchName.length; i++) {
      if (isDigit(pitchName.charAt(i)))
        break;
      nonNumCounter += 1;
    }
    return {text: pitchName.slice(0,nonNumCounter),
            number: pitchName.slice(nonNumCounter)};
  }

  function caltulateLog2OfEndFrqDividedByStartFrq() {
    return Math.log(endFrq/startFrq)/Math.LN2;
  }

  // The creation of this formulas was based on simple trial and error.
  function pixelToFrq(pixelNum) {
    return startFrq * Math.pow(2, ((pixelNum-canvas.height)/canvas.height) * -log2OfEndFrqDividedByStartFrq);
  }

  function frqToPixel(frq) {
    return canvas.height - (Math.log(frq/startFrq)/Math.LN2)/log2OfEndFrqDividedByStartFrq * canvas.height;
  }

  function ongoingTouchIndexById(idToFind) {
    for (var i=0; i<ongoingTouches.length; i++) {
      var id = ongoingTouches[i].identifier;

      if (id == idToFind) {
        return i;
      }
    }
    // not found
    return -1;
  }



  /* ********************************************** *
   * All event Listeners and the according handlers *
   * ********************************************** */

  // resize the canvas to fill browser window dynamically
  window.addEventListener('resize', resizeCanvas, false);

  function resizeCanvas() {
    // for retina displays
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;

    /*
    Your drawings need to be inside this function otherwise they will be reset when
    you resize the browser window and the canvas goes will be cleared.
    */

    drawLines();
  }



  canvas.addEventListener('touchstart', startHandler, false);
  canvas.addEventListener('mousedown', function(event) {
    event.changedTouches = [event];
    startHandler(event);
  }, false);

  function startHandler(event) {
    event.preventDefault();
    var touches = event.changedTouches;

    for (var i=0; i<touches.length; i++) {
      touches[i].oscillator = aCtx.createOscillator();
      // 0 stands for "sine wave"
      touches[i].oscillator.type = soundType;
      // The frequency of the sine wave is dependent on the position
      touches[i].oscillator.frequency.value = pixelToFrq(touches[i].pageY);
      touches[i].oscillator.connect(aCtx.destination);
      touches[i].oscillator.noteOn(0);

      ongoingTouches.push(touches[i]);
    }
  }

  canvas.addEventListener('touchmove', moveHandler, false);
  canvas.addEventListener('mousemove', function(event) {
    event.changedTouches = [event];
    moveHandler(event);
  }, false);

  function moveHandler(event) {
    event.preventDefault();
    var touches = event.changedTouches;

    for (var i=0; i<touches.length; i++) {
      var index = ongoingTouchIndexById(touches[i].identifier);
      if (index == -1)
        continue;
      ongoingTouches[index].oscillator.noteOff(0);

      touches[i].oscillator = aCtx.createOscillator();
      // 0 stands for "sine wave"
      touches[i].oscillator.type = soundType;
      // The frequency of the sine wave is dependent on the position
      touches[i].oscillator.frequency.value = pixelToFrq(touches[i].pageY);
      touches[i].oscillator.connect(aCtx.destination);

      touches[i].oscillator.noteOn(0);
      ongoingTouches.splice(index, 1, touches[i]);
    }
  }

  canvas.addEventListener('touchend', endHandler, false);
  canvas.addEventListener('touchcancel', endHandler, false);
  canvas.addEventListener('touchleave', endHandler, false);
  canvas.addEventListener('mouseup', function(event) {
    event.changedTouches = [event];
    endHandler(event);
  }, false);
  canvas.addEventListener('mouseout', function(event) {
    event.changedTouches = [event];
    endHandler(event);
  }, false);
  canvas.addEventListener('mouseleave', function(event) {
    event.changedTouches = [event];
    endHandler(event);
  }, false);

  function endHandler(event) {
    event.preventDefault();
    var touches = event.changedTouches;

    for (var i=0; i<touches.length; i++) {
      var index = ongoingTouchIndexById(touches[i].identifier);
      if (index == -1)
        continue;

      ongoingTouches[index].oscillator.noteOff(0);
      ongoingTouches.splice(index, 1);
    }
  }

  function drawLines() {
    c.clearRect(0, 0, canvas.width, canvas.height);

    for (var pitch in PITCHES) {
      var pixelNum = frqToPixel(pitch);
      c.beginPath();
      c.moveTo(0, pixelNum);
      c.lineTo(canvas.width, pixelNum);
      c.stroke();

      c.save();
      c.fillStyle = STANDARD_COLOR_1;
      c.fillText(splitPitchName(PITCHES[pitch]).text,
                 TEXT_OFFSET,
                 pixelNum - TEXT_OFFSET);
      var textWidth = c.measureText(splitPitchName(PITCHES[pitch]).text).width;
      c.font = "normal 300 9px Ubuntu";
      c.fillText(splitPitchName(PITCHES[pitch]).number,
                 (TEXT_OFFSET+0.75) + textWidth,
                 pixelNum - (TEXT_OFFSET-2));
      c.restore();
    }
  }



  /* ************************************************** *
   * Call resizeCanvas immediately after the page loads *
   * ************************************************** */

  resizeCanvas();



  /* *************** *
   * Debugging stuff *
   * *************** */

  window.c = c;
  window.frqToPixel = frqToPixel;
  window.pixelToFrq = pixelToFrq;

})();
