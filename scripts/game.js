/*jshint esversion: 6 */


function Game(updateDur) {
  this.timeGap = 0;
  this.lastUpdate = 0;
  this.lastDirKeyX = undefined;
  this.lastDirKeyY = undefined;
  this.updateDuration = updateDur; // milliseconds duration between update()
  this.paused = false;
  this.bg = new Image();
  this.boxy = undefined;
  this.pausedTxt = undefined;
  this.mode = 'init';
  this.pop = undefined;

  this.init = function() {
    this.bg.src = 'bg1.png';
    this.boxy = new Box(20,
                        20,
                        myColors.red,
                        20,
                        1
                      );
    this.lastUpdate = performance.now();
  };

  this.buildNets = function() {
    if (myNets !== undefined) {
      this.pop = [];
      for (let i in myNets) {
        let newHeight = 40; // pixels high of each net box
        let netYOffset = 4; // pixels between net boxes
        let newNet = new Net( /*   x     */  10,
                              /*   y     */  (i*newHeight)+(i*netYOffset),
                              /* width   */  200,
                              /* height  */  newHeight,
                              /*cellTotal*/  10,
                              /* color   */  randColor('rgba')
                            );
        newNet.init();
        // console.log('myPop[i].cells = ', myNets[i].cells);
        this.pop.push(newNet);
      }
    } else {
      console.log('nothing in myNets');
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
    // this.boxy.draw();
    if (this.pop !== undefined) {
      for (var i = 0; i < this.pop.length; i++) {
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
                this.boxy.update();
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
