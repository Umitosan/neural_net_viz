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
  this.curDragCell = undefined;

  this.init = function() {
    this.bg.src = 'bg1.png';
    this.lastUpdate = performance.now();
  };

  this.buildNets = function() {
    if (myNets !== undefined) {
      this.pop = [];
      let cTotal = myJson.Population.totalCellCount;
      let netBoxWidth = canW - 100 ;
      let netBoxHeight = canH - 100;
      // for (let i in myNets) {
        // let netXYoffset = 4; // pixels between net boxes
        // let newNet = new Net( /*   x     */  20 + (i*netBoxWidth)+(i*netXYoffset),
        let newNet = new Net( /*   x     */  40,
                              /*   y     */  40,
                              /* width   */  netBoxWidth,
                              /* height  */  netBoxHeight,
                              /*cellTotal*/  cTotal,
                              /* color   */  randColor('rgba',120,255) // randColor(type,lowBound,highBound,alphaSwitch = null)
                            );
        newNet.init();
        this.pop.push(newNet);
      // }
    } else {
      console.log('nothing in myNets');
    }
  };

  this.loadStimulus = function() {
    if ( (this.pop !== undefined) && (myStim !== undefined) ) {
      this.pop[0].loadNetStim();
    }
  };

  this.tryLeftClick = function(mouseX,mouseY) {
    this.tryClickNet(mouseX,mouseY);
    this.pop[0].currentDataFrameSlider.checkNodeClicked(mouseX,mouseY);
  };

  this.tryClickNet = function(mouseX,mouseY) {
    for (let i = 0; i < this.pop[0].cells.length; i++) {
      let cell = this.pop[0].cells[i];
      if ( (mouseX > (cell.x-cell.rad)) && (mouseX < (cell.x+cell.rad)) &&
           (mouseY > (cell.y-cell.rad)) && (mouseY < (cell.y+cell.rad)) ) {
        // console.log("cell hit, change color");
        this.curDragCell = this.pop[0].cells[i];
        cell.curColor = "pink";
      }
    }
  };

  this.revertNetClick = function() {
    this.curDragCell = undefined;
    for (let i = 0; i < this.pop[0].cells.length; i++) {
      this.pop[0].cells[i].curColor = this.pop[0].cells[i].baseColor;
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
