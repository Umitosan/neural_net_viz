/*jshint esversion: 6 */


function Net(x,y,width,height,cellTotal,color) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.cellTotal = cellTotal;
  this.color = color;
  this.cells = undefined;
  this.txtTitle = undefined;
  this.txtStatusRight = undefined;
  this.txtStatusLeft = undefined;
  this.currentDataFrameSlider2 = undefined;
  this.curDataFrame = undefined;
  this.curDataFrameIndex = undefined;
  this.curDataFrameLength = undefined;
  this.curDataFrameStimRounds = undefined;
  this.curStimRound = undefined;
  this.curStimRoundIndex = undefined;

  // buttons
  this.dataFrameButtonL = undefined;
  this.dataFrameButtonR = undefined;
  this.dimCellsButton = undefined;

  this.init = function() {
    this.curDataFrameLength = myDataSetRows[0].dataFrames.length;
    console.log('this.curDataFrameLength = ', this.curDataFrameLength);
    this.cells = [];
    //   "inputCellCount": "4",
    //   "outputCellCount": "10",
    //   "totalCellCount": "20",
    let inputCellCount = myJson1.Population.inputCellCount;
    let outputCellCount = myJson1.Population.outputCellCount;
    let totalCellCount = myJson1.Population.totalCellCount;
    let bodyCellCount = totalCellCount - inputCellCount - outputCellCount; // for middle column
    let diameter = (this.width / totalCellCount) * 0.8;
    let leftOffset = 4;
    let topScreenOffset = 190;
    let xGap = 170;
    let curIndex = 0;
    // LEFT COLUMN - input cells column
    for (let i = 0; i < inputCellCount; i++) {
      let yGap =  (canH - topScreenOffset) / inputCellCount;
      let xOff;
      if (i % 2 === 0) {
        xOff = -8;
      } else {
        xOff = 8;
      }
      let newCell = new Cell(   /*   x    */  this.x+xOff,
                                /*   y    */  topScreenOffset + (yGap*i),
                                /* size   */  diameter,
                                /* shape  */  'tri',
                                /* color  */  this.color,
                                /* index  */  curIndex
                              );
      newCell.init();
      this.cells.push(newCell);
      curIndex += 1;
    } // for left col
    // RIGHT COLUMN - output cells
    for (let i = 0; i < outputCellCount; i++) {
      let yGap =  (canH - topScreenOffset) / outputCellCount;
      let xOff;
      if (i % 2 === 0) {
        xOff = -8;
      } else {
        xOff = 8;
      }
      let newCell = new Cell(   /*   x    */  (this.x + this.width)+xOff,
                                /*   y    */  topScreenOffset + (yGap*i),
                                /* size   */  diameter,
                                /* shape  */  'quad',
                                /* color  */  this.color,
                                /* index  */  curIndex
                              );
      newCell.init();
      this.cells.push(newCell);
      curIndex += 1;
    } // for right col
    // MIDDLE COLUMN - body cells column
    for (let i = 0; i < bodyCellCount; i++) {  // middle column
      let yGap =  (canH - topScreenOffset) / bodyCellCount;
      let xOff;
      if (i % 2 === 0) {
        xOff = -8;
      } else {
        xOff = 8;
      }
      let newCell = new Cell(   /*   x    */  (this.width / 2) + (diameter/2) + leftOffset+xOff,
                                /*   y    */  topScreenOffset + (yGap*i),
                                /* size   */  diameter,
                                /* shape  */  'arc',
                                /* color  */  this.color,
                                /* index  */  curIndex
                              );
      newCell.init();
      this.cells.push(newCell);
      curIndex += 1;
    } // for mid col
    let tmpFontSize = 30;
    this.txtTitle = new TxtBox( /*  x       */  (canH / 2)+(tmpFontSize),
                                /*  y       */  tmpFontSize+5,
                                /* fontSize */  tmpFontSize,
                                /* font     */  (""+tmpFontSize.toString()+"px Helvetica"),  // [font style][font weight][font size][font face]
                                /* color    */  myColors.black,
                                /* text     */  "Net Index: 0"
                                );
    // TxtGroup(x,y,height,width,font,color=myColors.black)
    this.txtStatusRight = new TxtGroup( /* x      */  canW - 202,
                                        /* y      */  2,
                                        /* width  */  200,
                                        /* height */  135,
                                        /* font   */  "14px tahoma",
                                        /* color  */  "blue"
    );
    this.txtStatusRight.init();
    this.txtStatusRight.addLine("[Need Stimulus file]");
    this.txtStatusLeft = new TxtGroup( /* x       */  2,
                                        /* y      */  2,
                                        /* width  */  200,
                                        /* height */  135,
                                        /* font   */  "14px tahoma",
                                        /* color  */  "blue"
    );
    this.txtStatusLeft.init();
    this.txtStatusLeft.addLine("[Select a Cell]");
    this.buildCellData();
    // (x,y,width,height,color,font,text)
    this.dataFrameButtonL = new Button( /* x      */ this.txtStatusRight.x+12,
                                        /* y      */ this.txtStatusRight.y+30,
                                        /* width  */ 16,
                                        /* height */ 16,
                                        /* color  */ myColors.lightgreen,
                                        /* font   */ '14px Helvetica',
                                        /* text   */ '<');
    this.dataFrameButtonR = new Button( /* x      */ canW-64,
                                        /* y      */ this.txtStatusRight.y+30,
                                        /* width  */ 16,
                                        /* height */ 16,
                                        /* color  */ myColors.lightgreen,
                                        /* font   */ '14px Helvetica',
                                        /* text   */ '>');
    this.dimCellsButton = new Button(   /* x      */ canW-80,
                                        /* y      */ this.txtStatusRight.y+100,
                                        /* width  */ 40,
                                        /* height */ 16,
                                        /* color  */ myColors.lightgreen,
                                        /* font   */ '14px Helvetica',
                                        /* text   */ 'dim it');
  }; // INIT


  // broadcastCoeff: 1
  // decayRate: 0.25
  // internalCoeff:6.939
  // postLinks: (4) [{…}, {…}, {…}, {…}]
  // refractoryPeriod: 1

  this.buildCellData = function() {
    for (let i = 0; i < myNets[0].cells.length; i++) {
      cellObj = myNets[0].cells[i];
      this.cells[i].broadcastCoeff = cellObj.broadcastCoeff;
      this.cells[i].decayRate = cellObj.decayRate;
      this.cells[i].internalCoeff = cellObj.internalCoeff;
      this.cells[i].refractoryPeriod = cellObj.refractoryPeriod;
      this.cells[i].curPostLinks = [];
      for (let j = 0; j < cellObj.postLinks.length; j++) {
        this.cells[i].curPostLinks.push( cellObj.postLinks[j].postCellIndex );
      }
    }
  };

  // myDataSetRows2[0]["dataFrames"][0]['stimulusRounds'][0]["cells"][0]
  this.loadDataFrameByInd = function(ind) {
    // if (this.curDataFrame !== undefined) { console.log('this.curDataFrame before: ', this.curDataFrame); }
    this.curDataFrame = myDataSetRows[0].dataFrames[ind];
    // console.log('this.curDataFrame after: ', this.curDataFrame);
    this.curDataFrameIndex = ind;
    this.curDataFrameStimRounds = this.curDataFrame.stimulusRounds;  // load just one dataFrame
    this.loadStimRoundByInd(0); // load stim round 0 by default when changing dataFrames
    this.txtStatusRight.clear();
    this.txtStatusRight.addLine("DataSetRow: 0");
    this.txtStatusRight.addLine("DataFrame: "+(this.curDataFrameIndex));
    this.txtStatusRight.addLine("StimRound: "+(this.curStimRoundIndex+1)); // stim rounds count from 1 instead of 0
    this.buildDataFrameInterface();
    this.refreshTxtStatusRight();
  };

  this.loadStimRoundByInd = function(ind) {
    this.curStimRoundIndex = ind;
    this.curStimRound = this.curDataFrameStimRounds[ind].cells;
    this.loadCellStatus();
    this.refreshTxtStatusRight();
    this.dimInactiveCells();
  };

  this.refreshTxtStatusRight = function() {  // clear and update the nubmers in the UI in the box
    this.txtStatusRight.clear();
    this.txtStatusRight.addLine("DataSetRow: 0");
    this.txtStatusRight.addLine("DataFrame: "+(this.curDataFrameIndex));
    this.txtStatusRight.addLine("StimRound: "+(this.curStimRoundIndex+1)); // stim rounds count from 1 instead of 0
  };

  // myGame.curNet.curDataFrameStimRounds[0].cells.length
  this.loadCellStatus = function() {
    let ind = 0;
    for (let i = 0; i < this.curStimRound.length; i++) {
      let newStatus = this.curStimRound[i].status;
      this.cells[ind].status = newStatus;
      if (newStatus === 'excited') {
        this.cells[ind].curColor = myColors.lightgreen;
      } else {
        this.cells[ind].curColor = this.cells[ind].baseColor;
      }
      ind++;
    }
  };

  this.unselectCells = function() {
    for (var i = 0; i < this.cells.length; i++) {
      this.cells[i].clickSelected = false;
      this.cells[i].size = this.cells[i].baseSize;
    }
  };

  this.nextStimRound = function() {
    if ((this.curStimRoundIndex + 1) >= this.curDataFrameStimRounds.length) {
      console.log('at edge right');
    } else {
      this.loadStimRoundByInd(this.curStimRoundIndex + 1);
      this.currentDataFrameSlider2.goForward(); // update UI
    }
  };

  this.prevStimRound = function() {
    if ((this.curStimRoundIndex - 1) < 0) {
      console.log('at edge left');
    } else {
    this.loadStimRoundByInd(this.curStimRoundIndex - 1);
    this.currentDataFrameSlider2.goBack(); // update UI
    }
  };

  this.buildDataFrameInterface = function() {
    let stimRoundTotal = this.curDataFrameStimRounds.length;
    let newSlider2 = new SliderType2( /* x         */  (canW/4),
                                      /* y         */  130,
                                      /* width     */  (canW/2),
                                      /* height    */  20,
                                      /* nodeTotal */  stimRoundTotal,
                                      /* pColor    */  this.color
                              );
    newSlider2.init();
    this.currentDataFrameSlider2 = newSlider2;
  }; // buildDataFrameInterface

  this.tryClickButtons = function(mouseX,mouseY) {
    console.log('net tryClickButtons');
    this.dataFrameButtonL.checkClicked(mouseX,mouseY);
    this.dataFrameButtonR.checkClicked(mouseX,mouseY);
    this.dimCellsButton.checkClicked(mouseX,mouseY);
  };

  this.dimInactiveCells = function() {
    console.log('dimming cells now');
    for (var i = 0; i < this.cells.length; i++) {
      if (this.cells[i].status === 'labile') {
        this.cells[i].dim = true;
      } else {
        this.cells[i].dim = false;
      }
    }
  };

  this.draw = function() {
    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i].drawLinks();
    }
    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i].draw();
    }
    ctx.globalAlpha = 1;
    this.txtTitle.draw();
    this.txtStatusLeft.draw();
    this.txtStatusRight.draw();
    if (this.currentDataFrameSlider2 !== undefined) { this.currentDataFrameSlider2.draw(); }
    if (this.dataFrameButtonR !== undefined) { this.dataFrameButtonR.draw(); }
    if (this.dataFrameButtonL !== undefined) { this.dataFrameButtonL.draw(); }
    if (this.dimCellsButton !== undefined) { this.dimCellsButton.draw(); }
  };

  this.update = function() {
    if (this.dataFrameButtonL !== undefined) {
      if (this.dataFrameButtonL.clicked === true) {
        console.log('try go back DataFrame');
        if (this.curDataFrameIndex === 0) {
          console.log('cant load previous DataFrame');
        } else {
          this.loadDataFrameByInd(this.curDataFrameIndex-1);
        }
        console.log('this.curDataFrameIndex = ', this.curDataFrameIndex);
        this.dataFrameButtonL.clicked = false;
      }
    }
    if (this.dataFrameButtonR !== undefined) {
      if (this.dataFrameButtonR.clicked === true) {
        console.log('try go forward DataFrame');
        if ((this.curDataFrameIndex + 1) === this.curDataFrameLength) {
          console.log('cant load next DataFrame: at end of DataSetRow');
        } else {
          this.loadDataFrameByInd(this.curDataFrameIndex+1);
        }
        console.log('this.curDataFrameIndex = ', this.curDataFrameIndex);
        this.dataFrameButtonR.clicked = false;
      }
    }
    if (this.dimCellsButton !== undefined) {
      if (this.dimCellsButton.clicked === true) {
      console.log('dimCellsButton clicked');
      this.dimInactiveCells();
      this.dimCellsButton.clicked = false;
      }
    }
  };

} // Net
