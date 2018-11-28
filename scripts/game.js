/*jshint esversion: 6 */


function Game(updateDur) {
  this.timeGap = 0;
  this.lastUpdate = 0;
  this.lastDirKeyX = undefined;
  this.lastDirKeyY = undefined;
  this.updateDuration = updateDur; // milliseconds duration between update()
  this.paused = false;
  this.bg = new Image();
  this.pausedTxt = undefined;
  this.mode = 'init';
  this.pop = undefined;
  this.curNet = undefined;
  this.curDragCell = undefined;

  this.init = function() {
    this.bg.src = 'bg1.png';
    this.lastUpdate = performance.now();
  };

  this.buildNets = function() {
    if (myNets !== undefined) {
      this.pop = [];
      let cTotal = myJson1.Population.totalCellCount;
      let netBoxWidth = canW - 100 ;
      let netBoxHeight = canH - 100;
      let newNet = new Net( /*   x     */  40,
                            /*   y     */  40,
                            /* width   */  netBoxWidth,
                            /* height  */  netBoxHeight,
                            /*cellTotal*/  cTotal,
                            /* color   */  randColor('rgba',120,255) // randColor(type,lowBound,highBound,alphaSwitch = null)
                          );
      newNet.init();
      this.pop.push(newNet);
      this.curNet = this.pop[0];
    } else {
      console.log('nothing in myNets');
    }
  };

  this.loadStimulus = function() {
    if ( (this.pop !== undefined) && (myStim !== undefined) ) {
      this.curNet.loadNetStim();
    }
  };

  this.tryLeftClick = function(mouseX,mouseY) {
    if ( (file1Loaded === true) && (this.mode === "sim") ) {
      this.tryClickNet(mouseX,mouseY);
      if (file2Loaded === true) {
        // this.curNet.currentDataFrameSlider.checkNodeClicked(mouseX,mouseY);
        this.curNet.currentDataFrameSlider2.checkNodeClicked(mouseX,mouseY);
      }
    }
  };

  this.tryClickNet = function(mouseX,mouseY) {
    for (let i = 0; i < this.curNet.cells.length; i++) {
      let cell = this.curNet.cells[i];
      if ( (mouseX > (cell.x-cell.rad)) && (mouseX < (cell.x+cell.rad)) &&
           (mouseY > (cell.y-cell.rad)) && (mouseY < (cell.y+cell.rad)) ) {
        this.curDragCell = this.curNet.cells[i];
      }
    }
  };

  this.revertNetClick = function() {
    if ( (file1Loaded === true) && (this.mode === "sim") ) {
      this.curDragCell = undefined;
    }
  };

  this.trySlide = function(someDir) {
    if (file2Loaded === true) {
      if (someDir === 'right') {
        this.curNet.nextStimRound();
      } else if (someDir === 'left') {
        this.curNet.prevStimRound();
      } else {
        console.log('not valid slide direction');
      }
    } else {
      console.log('need stimulus file');
    }
  };

  this.pauseIt = function() {
    myGame.paused = true;
    // this.pausedTxt.show = true;
  };
  this.unpauseIt = function() {
    myGame.paused = false;
    // this.pausedTxt.show = false;
    // this prevents pac from updating many times after UNpausing
    this.lastUpdate = performance.now();
    this.timeGap = 0;
  };

  this.drawBG = function() { // display background over canvas
    ctx.imageSmoothingEnabled = false;  // turns off AntiAliasing
    ctx.drawImage(this.bg,0,0,CANVAS.width,CANVAS.height);
  };

  this.draw = function() {  // draw everything!
    if (this.pop !== undefined) {
      for (var i = 0; i < 1; i++) { // all nets or just 1
        this.pop[i].draw();
      }
    }
  }; // end draw

  this.update = function() {
      if (this.paused === false) { // performance based update: myGame.update() runs every myGame.updateDuration milliseconds
            this.timeGap = performance.now() - this.lastUpdate;

            if ( this.timeGap >= this.updateDuration ) { // this update is restricted to updateDuration
              let timesToUpdate = this.timeGap / this.updateDuration;
              for (let i=1; i < timesToUpdate; i++) { // update children objects
                // if (timesToUpdate > 2) {
                //   console.log('timesToUpdate = ', timesToUpdate);
                // }

                // general update area
                // general update area
                // general update area
                if (State.mouseLeftDown) {
                  if (this.curDragCell !== undefined) {
                    this.curDragCell.changePos(State.mouseX,State.mouseY);
                  }
                }
              }
              this.lastUpdate = performance.now();
            } // end if

            // if (this.mode === "draw") { // run this every update cycle regardless of timing
            //   // general draw area
            // } else {
            //   // mode is none
            // }

      } else if (this.paused === true) {
        // PAUSED! do nothin
      } else {
        console.log('game pause issue');
      }

  }; // end update

} // end myGame
