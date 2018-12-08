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
  this.curNet = undefined; // myJson1.Population.nets
  this.curDragCell = undefined;
  this.curSelectedCell = undefined;
  // this.btnRandCellPos = undefined;
  // this.testButton2 = undefined;

  this.init = function() {
    // this.bg.src = 'bg1.png';
    this.bg.src = 'neurons_splash1.jpg';
    this.lastUpdate = performance.now();
  };

  this.buildNets = function() {
    let randNetColor = randColor('rgba',120,255); // randColor(type,lowBound,highBound,alphaSwitch = null)
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
                            /* color   */  randNetColor
                          );
      newNet.init();
      this.pop.push(newNet);
      this.curNet = this.pop[0];
    } else {
      console.log('nothing in myNets');
    }
    // Button(x,y,width,height,color,font,text)
    // this.btnRandCellPos = new Button(canW-60,114,48,18,randNetColor,"12px tahoma",'RANDO!',this.randomizeCellPos);
    // this.testButton2 = new Button(canW-100,80,40,20,randNetColor,"12px tahoma",'button');
  };

  this.randomizeCellPos = function() { // rem: 'this' = button (not this 'game') cuz func passed are arg duh
    console.log('randomizeCellPos works cuz button was clicked');
    let cTotal = myJson1.Population.totalCellCount;
    // let cols = Math.ceil(Math.sqrt(cTotal))+2;
    // let rows = Math.floor(Math.sqrt(cTotal))+1;
    let cols = 11;
    let rows = 5;
    let matrix = [];
    for (let i = 0; i < rows; i++) {
      let newCol = [];
      for (let j = 0; j < cols; j++) {
        newCol.push(0);
      }
      matrix.push(newCol);
    }
    console.log('cols,rows = ', cols, rows);
    for (let i = 0; i < myGame.curNet.cells.length; i++) { // look for new unused location on matrix and mark it 1 when filled
      let newX,newY;
      let tryR = 0;
      let tryC = 0;
      let checkVal = 0;
      while (checkVal < 1) {
        tryR = getRandomIntInclusive(0,rows-1);
        tryC = getRandomIntInclusive(0,cols-1);
        checkVal = matrix[tryR][tryC];
        // console.log('matrix[tryR][tryC] = ',matrix[tryR][tryC]);
        if (matrix[tryR][tryC] === 0) {
          matrix[tryR][tryC] += 1; // show matrix location is filled
          break;
        } else {
          // try again
        }
      }
      console.log('item filled at ',tryR,tryC);
      console.assert(matrix[tryR][tryC] > 0);
      newY = (tryR * ((canH - 180) / rows)) + 180;
      newX = tryC * (canW / cols) + 40;
      // newY = tryR * (canH / rows);
      // newX = tryC * (canW / cols);
      console.log('cell ['+i+'] '+'filled at R,C '+tryR+','+tryC);
      myGame.curNet.cells[i].changePos(newX,newY);
    }
    console.log('matrix after = ', matrix);
  };

  this.loadStimulus = function() {
    if ( (this.curNet !== undefined) && (myDataSetRows !== undefined) ) {
      this.curNet.loadDataFrameByInd(0);
    }
  };

  this.tryLeftClick = function(mouseX,mouseY) {
    if ( (file1Loaded === true) && (this.mode === "sim") ) {
      this.tryClickNet(mouseX,mouseY);
      if (file2Loaded === true) {
        // this.curNet.currentDataFrameSlider.checkNodeClicked(mouseX,mouseY);
        this.curNet.currentDataFrameSlider2.checkNodeClicked(mouseX,mouseY);
        this.curNet.tryClickButtons(mouseX,mouseY);
        // this.btnRandCellPos.checkClicked(mouseX,mouseY);
        // this.testButton2.checkClicked(mouseX,mouseY);
      }
    }
  };

  this.tryClickNet = function(mouseX,mouseY) {
    for (let i = 0; i < this.curNet.cells.length; i++) {
      let cell = this.curNet.cells[i];
      if ( (mouseX > (cell.x-cell.rad)) && (mouseX < (cell.x+cell.rad)) &&
           (mouseY > (cell.y-cell.rad)) && (mouseY < (cell.y+cell.rad)) ) {
        this.curDragCell = this.curNet.cells[i];
        this.curSelectedCell = this.curNet.cells[i];
        this.curNet.unselectCells();
        this.curSelectedCell.clickSelected = true;
        this.updateCellDetails();
      }
    }
  };

  this.revertNetClick = function() {
    if ( (file1Loaded === true) && (this.mode === "sim") ) {
      this.curDragCell = undefined;
      this.curSelectedCell = undefined;
      this.curNet.dataFrameButtonL.clicked = false;
      // this.curNet.dataFrameButtonR.clicked = false;
    }
  };

  // broadcastCoeff: 1
  // decayRate: 0.25
  // internalCoeff:6.939
  // postLinks: (4) [{…}, {…}, {…}, {…}]
  // refractoryPeriod: 1

  this.updateCellDetails = function() {
    this.curNet.txtStatusLeft.clear();
    this.curNet.txtStatusLeft.addLine("Cell# "+this.curSelectedCell.index);
    this.curNet.txtStatusLeft.addLine("broadcastCoeff: "+this.curSelectedCell.broadcastCoeff);
    this.curNet.txtStatusLeft.addLine("decayRate: "+this.curSelectedCell.decayRate);
    this.curNet.txtStatusLeft.addLine("internalCoeff: "+this.curSelectedCell.internalCoeff);
    this.curNet.txtStatusLeft.addLine("postLinks: ("+this.curSelectedCell.curPostLinks.length+")");
    this.curNet.txtStatusLeft.addLine("refractoryPeriod: "+this.curSelectedCell.refractoryPeriod);
  };

  this.trySlide = function(someDir) {
    if (this.mode === 'sim') {
      if (someDir === 'right') {
        this.curNet.nextStimRound();
      } else if (someDir === 'left') {
        this.curNet.prevStimRound();
      } else {
        console.log('not valid slide direction');
      }
    } else {
      console.log('game not ready in sim mode');
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
    // ctx.drawImage(this.bg,0,0,CANVAS.width,CANVAS.height);
    let scaler = 0.7; // 0.7 is good at full rez
    ctx.drawImage( this.bg,-340,0,(2048*scaler),(1151*scaler) ); // orig size 2048 x 1151
  };

  this.draw = function() {  // draw everything!
    if (this.curNet !== undefined) { this.curNet.draw(); }
    // if (this.pop !== undefined) {
    //   for (var i = 0; i < 1; i++) { // all nets or just 1
    //     this.pop[i].draw();
    //   }
    // }
    // if (this.btnRandCellPos !== undefined) { this.btnRandCellPos.draw(); }
    // if (this.testButton2 !== undefined) { this.testButton2.draw(); }
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
                this.curNet.update();
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
