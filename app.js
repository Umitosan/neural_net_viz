/*jshint esversion: 6 */


var myJson1,
    myNets,
    myJson2,
    myDataSetRows;

var xmlData;
var xmlDataString;
var domParserData;

var file1Loaded = false;
var file2Loaded = false;

var CANVAS,
    canH,
    canW,
    ctx,
    myGame;
var myColors = new Colors();

var defaultSimSpeed = 14; // milliseconds between updates

function Colors() {
  this.black = 'rgba(0, 0, 0, 1)';
  this.darkGrey = 'rgba(50, 50, 50, 1)';
  this.lightGreyTrans = 'rgba(50, 50, 50, 0.3)';
  this.greyReset = 'rgb(211,211,211)';
  this.lighterGreyReset = 'rgb(240,240,240)';
  this.lightGreyBox = 'rgba(220, 220, 220, 1)';
  this.white = 'rgba(250, 250, 250, 1)';
  this.red = 'rgba(230, 0, 0, 1)';
  this.cherry = 'rgba(242,47,8,1)';
  this.green = 'rgba(0, 230, 0, 1)';
  this.blue = 'rgba(0, 0, 230, 1)';
  this.electricBlue = 'rgba(20, 30, 230, 1)';
  this.lightgreen = 'rgba(144, 238, 144,1)';
}

var State = {
  myReq: undefined,
  loopRunning: false,
  gameStarted: false,
  lastFrameTimeMs: 0, // The last time the loop was run
  maxFPS: 60, // The maximum FPS allowed
  simSpeed: defaultSimSpeed, // speed of simulation loop
  playTime: 0,
  frameCounter: 0,
  lastKey: 'none',
  mouseX: 0,
  mouseY: 0,
  mouseLeftDown: false,
  mouseRightDown: false,
  totalKeysDown: 0,
  keysDown: {
              w: false,
              s: false,
              a: false,
              d: false,
              up: false,
              down: false,
              left: false,
              right: false,
              space: false
            }
};

function softReset() {
  console.log('soft reset!');
  myGame = undefined;
  State = {
    myReq: undefined,
    loopRunning: false,
    gameStarted: false,
    lastFrameTimeMs: 0, // The last time the loop was run
    maxFPS: 60, // The maximum FPS allowed
    simSpeed: defaultSimSpeed, // speed of simulation loop
    playTime: 0,
    frameCounter: 0,
    lastKey: 'none',
    mouseX: 0,
    mouseY: 0,
    mouseLeftDown: false,
    mouseRightDown: false,
    totalKeysDown: 0,
    keysDown: {
                w: false,
                s: false,
                a: false,
                d: false,
                up: false,
                down: false,
                left: false,
                right: false,
                space: false
              }
  };
}

function updateKeysTotal() {
  let total = 0;
  for (let k in State.keysDown) {
    if (State.keysDown[k] === true) {
      total += 1;
    }
  }
  State.totalKeysDown = total;
}

//////////////////////////////////////////////////////////////////////////////////
// KEYBOARD INPUT
//////////////////////////////////////////////////////////////////////////////////
function keyDown(event) {
    event.preventDefault(); // prevents page from scrolling within window frame
    State.lastKey = event.code;
    State.keyPressed = true;
    let code = event.keyCode;
    let keyWhich = event.which;
    switch (keyWhich) {
        case 37: // Left arrow key
          myGame.trySlide('left');
          State.keysDown.left = true;
          document.getElementById("key-left").style.backgroundColor = "pink";
          if (myGame.paused === false) { State.lastkey = 'left'; }
          break;
        case 39: //Right arrow key
          myGame.trySlide('right');
          State.keysDown.right = true;
          document.getElementById("key-right").style.backgroundColor = "pink";
          if (myGame.paused === false) { State.lastkey = 'right'; }
          break;
        case 38: // Up arrow key
          State.keysDown.up = true;
          document.getElementById("key-up").style.backgroundColor = "pink";
          if (myGame.paused === false) { State.lastkey = 'up'; }
          break;
        case 40: //Down arrow key
          State.keysDown.down = true;
          document.getElementById("key-down").style.backgroundColor = "pink";
          if (myGame.paused === false) { State.lastkey = 'down'; }
          break;
        case 65: // A key
          State.keysDown.a = true;
          document.getElementById("key-A").style.backgroundColor = "pink";
          if (myGame.paused === false) { State.lastkey = 'left'; }
          break;
        case 68: // D key
          State.keysDown.d = true;
          document.getElementById("key-D").style.backgroundColor = "pink";
          if (myGame.paused === false) { State.lastkey = 'right'; }
          break;
        case 87: // W key
          State.keysDown.w = true;
          document.getElementById("key-W").style.backgroundColor = "pink";
          if (myGame.paused === false) { State.lastkey = 'up'; }
          break;
        case 83: // S key
          State.keysDown.s = true;
          document.getElementById("key-S").style.backgroundColor = "pink";
          if (myGame.paused === false) { State.lastkey = 'down'; }
          break;
        case 90: // Z key
          if (State.gameStarted === true) {  State.lastkey = 'Z'; }
          break;
        case 191: // Slash key
          if (State.gameStarted === true) { State.lastkey = '/'; }
          break;
        case 32: // spacebar
          if (State.gameStarted === true) {
            if (myGame.paused === true) {
              myGame.unpauseIt();
            } else if (myGame.paused === false) {
              myGame.pauseIt();
            } else {
              //nothin
            }
            console.log('Game pause state = ', myGame.paused);
          }
          break;
        default: // Everything else
          // nothin
          break;
    } // switch
    updateKeysTotal();
    $("#lastkey-name").text("'"+event.code+"'");
    $("#lastkey-code").text(event.keyCode);
}

function keyUp(event) {
  event.preventDefault(); // prevents page from scrolling within window frame
  if (State.keysDown.total === 0) { State.keyPressed = false; }
  let code = event.keyCode;
  switch (code) {
      case 37: // Left key
        State.keysDown.left = false;
        document.getElementById("key-left").style.backgroundColor = "lightblue";
        if (myGame.paused === false) { /*something*/ }
        break;
      case 39: //Right key
        State.keysDown.right = false;
        document.getElementById("key-right").style.backgroundColor = "lightblue";
        if (myGame.paused === false) { /*something*/ }
        break;
      case 38: // Up key
        State.keysDown.up = false;
        document.getElementById("key-up").style.backgroundColor = "lightblue";
        if (myGame.paused === false) { /*something*/ }
        break;
      case 40: //Down key
        State.keysDown.down = false;
        document.getElementById("key-down").style.backgroundColor = "lightblue";
        if (myGame.paused === false) { /*something*/ }
        break;
      case 65: // A key
        State.keysDown.a = false;
        document.getElementById("key-A").style.backgroundColor = "lightblue";
        if (myGame.paused === false) { /*something*/ }
        break;
      case 68: // D key
        State.keysDown.d = false;
        document.getElementById("key-D").style.backgroundColor = "lightblue";
        if (myGame.paused === false) { /*something*/ }
        break;
      case 87: // W key
        State.keysDown.w = false;
        document.getElementById("key-W").style.backgroundColor = "lightblue";
        if (myGame.paused === false) { /*something*/ }
        break;
      case 83: // S key
        State.keysDown.s = false;
        document.getElementById("key-S").style.backgroundColor = "lightblue";
        if (myGame.paused === false) { /*something*/ }
        break;
      case 90: // Z key
        if (State.gameStarted === true) { /*something*/ }
        break;
      case 191: // Slash key
        if (State.gameStarted === true) { /*something*/ }
        break;
      case 32: // spacebar
        // nothin
        break;
      default: // Everything else
        // nothin
        break;
  } // switch
  updateKeysTotal();
  // for (let k in State.keysDown) { // after letting go of a key, check and update direction if there's only one key still down
  //   if (State.keysDown[k] === true) {
  //     if (k === 'a') {
  //       myGame.updateLastDirKeyX('left');
  //     } else if (k === 'd') {
  //       myGame.updateLastDirKeyX('right');
  //     } else if (k === 'w') {
  //       myGame.updateLastDirKeyY('up');
  //     } else if (k === 's') {
  //       myGame.updateLastDirKeyY('down');
  //     } else { // for up left right down strings
  //       // notin
  //     }
  //   }
  // } // for
} // keyUp

//////////////////////////////////////////////////////////////////////////////////
// MOUSE INPUT
//////////////////////////////////////////////////////////////////////////////////
function mDown(evt) {
    if (evt.button === 0) {  // left-click
      // console.log('MOUSE: left down');
      // console.log('Mouse X,Y: '+State.mouseX+" , "+State.mouseY );
      myGame.tryLeftClick(State.mouseX,State.mouseY);
      if (State.mouseRightDown === false) { State.mouseLeftDown = true; } // only allow one mouse button down at a time, ignore change if both are down
    } else if (evt.button === 2) { // right-click
      // console.log('MOUSE: right down');
      if (State.mouseLeftDown === false) { State.mouseRightDown = true; }
    }
}

function mUp(evt) {
    if (evt.button === 0) {  // left-click
      // console.log('MOUSE: left up');
      myGame.revertNetClick();
      State.mouseLeftDown = false;
    } else if (evt.button === 2) { // right-click
      // console.log('MOUSE: left up');
      State.mouseRightDown = false;
    }
}

//////////////////////////////////////////////////////////////////////////////////
// GAME LOOP
//////////////////////////////////////////////////////////////////////////////////
function gameLoop(timestamp) {
  // timestamp is automatically returnd from requestAnimationFrame
  // timestamp uses performance.now() to compute the time
  State.myReq = requestAnimationFrame(gameLoop);

  if ( (State.loopRunning === true) && (State.gameStarted === true) ) { myGame.update(); }

  clearCanvas();
  if (State.gameStarted === false) {
    myGame.drawBG();
  } else {
    myGame.draw();
  }

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
$(document).ready(function() {

  CANVAS =  $('#canvas')[0];
  ctx =  CANVAS.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  canH = CANVAS.height;
  canW = CANVAS.width;
  CANVAS.addEventListener("keydown",keyDown);
  CANVAS.addEventListener("keyup",keyUp);
  CANVAS.addEventListener("mousedown", mDown);
  CANVAS.addEventListener("mouseup", mUp);
  $('body').on('contextmenu', '#canvas', function(e){ return false; }); // prevent right click context menu default action
  CANVAS.addEventListener('mousemove', function(evt) {
      let rect = CANVAS.getBoundingClientRect();
      State.mouseX = evt.clientX - rect.left + - 0.5;
      State.mouseY = evt.clientY - rect.top;
      $("#coords-x").text(Math.round(State.mouseX));
      $("#coords-y").text(Math.round(State.mouseY));
  }, false);

  //INPUT
  var leftMouseDown = false;

  // this is to correct for canvas blurryness on single pixel wide lines etc
  // important when animating to reduce rendering artifacts and other oddities
  // ctx.translate(0.5, 0.5);

  // start things up!
  myGame = new Game(State.simSpeed); // ms per update()
  myGame.init();
  State.myReq = requestAnimationFrame(gameLoop);
  State.loopRunning = true;
  State.gameStarted = false;
  myGame.mode = 'init';

  $('#start-btn').click(function() {
    // console.log("start button clicked");
    // console.log("myGame.mode = ", myGame.mode);
    // console.log("file1Loaded = ", file1Loaded);
    // console.log("file2Loaded = ", file2Loaded);
    if ( ((myGame.mode === 'init') && (file1Loaded === true)) && (file2Loaded === true) ) {
      myGame.mode = 'sim';
      console.log('mode now sim');
      myGame.buildNets();
      myGame.loadStimulus();
      State.gameStarted = true;
      CANVAS.focus();  // set focus to canvas on start so keybindings work, if needed
      $('#mode-current-status')[0].innerText = 'simulate';
      // $(".float-input").css('display', 'block'); // show number input
      myGame.updateDuration = (State.simSpeed);
      myGame.lastUpdate = performance.now();
    } else {
      if ((file1Loaded !== true) || (file1Loaded !== true)) {
        console.log('must load both files before starting');
      }
      console.log('must reset before starting again');
    }
  });

  $('#reset-btn').click(function() {
    console.log("reset button clicked");
    generalLoopReset();
    State.loopRunning = true;
    State.gameStarted = false;
    myGame.mode = 'init';
    $('#pause-btn')[0].innerText = 'PAUSE';
    $('#mode-current-status')[0].innerText = 'init';
  });

  $('#pause-btn').click(function() {
    console.log("pause button clicked");
    if (myGame.paused === false) {
      myGame.pauseIt();
      $('#pause-btn')[0].innerText = 'UN-PAUSE';
    } else if (myGame.paused === true) {
      myGame.unpauseIt();
      $('#pause-btn')[0].innerText = 'PAUSE';
    }
  });

  let linesRemainToProcess = 10;  // approximate recursive groups to process
  function printJsonAsHTML(someObj, indentLvl=0) {
    // console.log('linesRemainToProcess=',linesRemainToProcess);
    let finalStrHTMLarr = "";
    let textSizeSwitch = true;
    let margin = indentLvl * 20;
    let textStartSize = 18;
    let textSize = textStartSize - indentLvl;
    for (let i in someObj) {
      if( someObj.hasOwnProperty(i) ) {
        if (typeof someObj[i] === 'object') {
          if (Array.isArray(someObj[i]) === true) { // beginning of array
            finalStrHTMLarr += "<p style='margin-left: "+margin+"px; font-size: "+textSize+"px;'>"+i+": " + "(arr length=" + someObj[i].length + ")" + "</p>";
            linesRemainToProcess -= 1;
            if (linesRemainToProcess < 1) {
              // skip it
            } else {
              finalStrHTMLarr += printJsonAsHTML(someObj[i], indentLvl+1);
            }
          } else { // non-array obj
            finalStrHTMLarr += "<p style='margin-left: "+margin+"px; font-size: "+textSize+"px;'>"+i+": " + "(obj length=" + Object.keys(someObj[i]).length + ")" + "</p>";
            linesRemainToProcess -= 1;
            if (linesRemainToProcess < 1) {
              // skip it
            } else {
              finalStrHTMLarr += printJsonAsHTML(someObj[i], indentLvl+1);
            }
          }
        } else if (typeof someObj[i] === 'string') {
          finalStrHTMLarr += "<p style='margin-left: "+margin+"px; font-size: "+textSize+"px;'>"+i+": '" + "<span class='greenString'>" + someObj[i] + "</span>" + "'" + "</p>";
          linesRemainToProcess -= 1;
        } else if (typeof someObj[i] === 'number') {
          finalStrHTMLarr += "<p style='margin-left: "+margin+"px; font-size: "+textSize+"px;'>"+i+": " + "<span class='redNum'>" + someObj[i] + "</span>" + "</p>";
          linesRemainToProcess -= 1;
        } else {
          console.log('undefined type');
        }
      } else {
        console.log("someObj.hasOwnProperty(i) = false");
      }
    } // for
    return finalStrHTMLarr;
  } // printJsonAsHTML


  function getFileJSON1(evt) {
    linesRemainToProcess = 100;
    let myFile = evt.target.files[0];
    let curOutputLines = 0;
    let reader = new FileReader();
    let outputDivLeft = $('#htmlOutputLeft')[0];
    let errLeft = $("#err-msg-left")[0];
    errLeft.innerText = "";
    reader.onload = function() {
      let text = reader.result;
      // console.log("file preview: ", reader.result.substring(0, 100));
      myJson1 = JSON.parse(reader.result);
      if (myJson1.Population.nets[0] !== undefined) {
        file1Loaded = true;
        myNets = myJson1.Population.nets;
        let finalJsonStrHTML = printJsonAsHTML(myJson1);
        $("#err-msg-left").css('color', 'blue');
        errLeft.innerText = "File GOOD: found NETS";
        outputDivLeft.innerHTML = finalJsonStrHTML;
      } else {
        errLeft.innerText = "file BAD: no NETS!";
        outputDivLeft.innerHTML = "No Nets and or Population found in JSON";
      }
    };
    reader.readAsText(myFile);
  }

  function getFileJSON2(evt) {
    linesRemainToProcess = 100;
    let myFile = evt.target.files[0];
    let curOutputLines = 0;
    let reader = new FileReader();
    let outputDivRight = $("#htmlOutputRight")[0];
    let errRight = $("#err-msg-right")[0];
    errRight.innerText = "";
    reader.onload = function() {
      let text = reader.result;
      console.log("file preview: ", reader.result.substring(0, 100));
      myJson2 = JSON.parse(reader.result);
      if (typeof myJson2[0] === "undefined") { // must be object
        if (myJson2.dataSetRows[0].dataFrames[0].stimulusRounds[0] !== undefined) {
          file2Loaded = true;
          myDataSetRows = myJson2.dataSetRows;
          let finalJsonStrHTML = printJsonAsHTML(myJson2);
          $("#err-msg-right").css('color', 'blue');
          errRight.innerText = "File GOOD: dataSetRows found";
          outputDivRight.innerHTML = finalJsonStrHTML;
          myGame.loadStimulus();
        } else {
          errRight.innerText = "File BAD: no Net_0 found!";
          outputDivRight.innerHTML = "JSON format: BAD";
        }
      } else {
        errRight.innerText = "Bad File: expected JSON object!";
        outputDivRight.innerHTML = "JSON format: BAD";
      }
    };
    reader.readAsText(myFile);
  }

  $('#file-in-left').on("change", getFileJSON1);

  $('#file-in-right').on("change", getFileJSON2);

  $('#btn-submit').on("click", function() {
    console.log("submit button clicked");
  });

});
