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
  this.curDataFrameStimRounds = undefined;
  this.curStimRound = undefined;
  this.curStimRoundIndex = undefined;

  this.init = function() {
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
      let newCell = new Cell(   /*   x    */  this.x,
                                /*   y    */  topScreenOffset + (yGap*i),
                                /* radius */  diameter/2,
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
      let newCell = new Cell(   /*   x    */  (this.x + this.width),
                                /*   y    */  topScreenOffset + (yGap*i),
                                /* radius */  diameter/2,
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
      let newCell = new Cell(   /*   x    */  (this.width / 2) + (diameter/2) + leftOffset,
                                /*   y    */  topScreenOffset + (yGap*i),
                                /* radius */  diameter/2,
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
                                /* font     */  (""+tmpFontSize.toString()+"px bold courier"),  // [font style][font weight][font size][font face]
                                /* color    */  "black",
                                /* text     */  "Net Index: 0"
                                );
    // TxtGroup(x,y,height,width,font,color="black")
    this.txtStatusRight = new TxtGroup( /* x      */  canW - 202,
                                        /* y      */  2,
                                        /* width  */  200,
                                        /* height */  120,
                                        /* font   */  "16px Ariel",
                                        /* color  */  "blue"
    );
    this.txtStatusRight.init();
    this.txtStatusRight.addLine("Need Stimulus");
    this.txtStatusLeft = new TxtGroup( /* x       */  2,
                                        /* y      */  2,
                                        /* width  */  200,
                                        /* height */  120,
                                        /* font   */  "16px Ariel",
                                        /* color  */  "blue"
    );
    this.txtStatusLeft.init();
    this.txtStatusLeft.addLine("Need Stimulus");
    this.buildPostLinks();
  }; // INIT

  this.buildPostLinks = function() {
    for (let i = 0; i < myNets[0].cells.length; i++) {
      this.cells[i].loadPostLinks(myNets[0].cells[i]);
    }
  };

  // myDataSetRows2[0]["dataFrames"][0]['stimulusRounds'][0]["cells"][0]

  this.loadNetStim = function() {
    this.curDataFrameStimRounds = myDataSetRows[0].dataFrames[0].stimulusRounds;  // load just one dataFrame
    this.loadStimRound(0);
    this.txtStatusRight.clear();
    this.txtStatusRight.addLine("DataSetRow: 0");
    this.txtStatusRight.addLine("DataFrame: 0");
    this.txtStatusRight.addLine("StimRound: 1");
    this.buildDataFrameInterface();
  };

  this.loadStimRound = function(loadIndex) {
    this.curStimRoundIndex = loadIndex;
    this.curStimRound = this.curDataFrameStimRounds[loadIndex].cells;
    // console.log('this.curStimRound = ', this.curStimRound);
    this.loadCellStatus();
  };


  // myGame.curNet.curDataFrameStimRounds[0].cells.length
  this.loadCellStatus = function() {
    let ind = 0;
    for (let i = 0; i < this.curStimRound.length; i++) {
      let newStatus = this.curStimRound[i].status;
      this.cells[ind].status = newStatus;
      if (newStatus === 'excited') {
        this.cells[ind].curColor = 'red';
      } else {
        this.cells[ind].curColor = this.cells[ind].baseColor;
      }
      ind++;
    }
  };

  this.nextStimRound = function() {
    if ((this.curStimRoundIndex + 1) >= this.curDataFrameStimRounds.length) {
      console.log('at edge right');
    } else {
      this.loadStimRound(this.curStimRoundIndex + 1);
      this.currentDataFrameSlider2.goForward(); // update UI
    }
  };

  this.prevStimRound = function() {
    if ((this.curStimRoundIndex - 1) < 0) {
      console.log('at edge left');
    } else {
    this.loadStimRound(this.curStimRoundIndex - 1);
    this.currentDataFrameSlider2.goBack(); // update UI
    }
  };

  this.getStimRoundCountAll = function() {
    let count = 0;
    for (let i = 0; i < this.curDataFrameStimRounds.length; i++) {
      for (let j = 0; j < this.curDataFrameStimRounds[i].length; j++) {
        count++;
      }
    }
    return count;
  };

  this.buildDataFrameInterface = function() {
    let stimRoundTotal = this.curDataFrameStimRounds.length;
    let newSlider2 = new SliderType2( /* x         */  (canW-(stimRoundTotal*2))/2,
                                      /* y         */  130,
                                      /* width     */  (stimRoundTotal*2)-2, // each node needs 2 pixels
                                      /* height    */  20,
                                      /* nodeTotal */  stimRoundTotal,
                                      /* pColor    */  this.color
                              );
    newSlider2.init();
    this.currentDataFrameSlider2 = newSlider2;
  }; // buildDataFrameInterface

  this.draw = function() {
    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i].drawLinks();
    }
    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i].draw();
    }
    this.txtTitle.draw();
    this.txtStatusLeft.draw();
    this.txtStatusRight.draw();
    if (this.currentDataFrameSlider2 !== undefined) { this.currentDataFrameSlider2.draw(); }
  };

  this.update = function() {
  };

} // Net



//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
function Cell(x,y,rad,color,ind) {
  this.x = x;
  this.y = y;
  this.rad = rad;
  this.baseColor = color;
  this.curColor = color;
  this.strokeColor = "black";
  this.txt = undefined;
  this.index = ind;
  this.hover = false;
  this.status = undefined;
  this.curPostLinks = undefined;

  this.init = function() {
    let tmpFontSize = 16;
    this.txt = new TxtBox(  /*  x       */  this.x-3,
                            /*  y       */  this.y+3,
                            /* fontSize */  tmpFontSize,
                            /* font     */  (""+tmpFontSize.toString()+"px bold courier"),  // [font style][font weight][font size][font face]
                            /* color    */  "black",
                            /* text     */  this.index.toString()
                          );
  };

  this.changePos = function(newX,newY) {
    this.x = newX;
    this.y = newY;
    this.txt.x = this.x-3;
    this.txt.y = this.y+3;
  };

  this.loadPostLinks = function(cellObj) {
    this.curPostLinks = [];
    for (let i = 0; i < cellObj.postLinks.length; i++) {
      this.curPostLinks.push( cellObj.postLinks[i].postCellIndex );
    }
  };

  this.drawLinks = function() {
    // DRAW POST LINKS
    if (this.curPostLinks !== undefined) { // draw each post link
      for (var i = 0; i < this.curPostLinks.length; i++) {
        let postIndex = this.curPostLinks[i];
        let cell1x = this.x;
        let cell1y = this.y;
        let cell2x = myGame.pop[0].cells[postIndex].x;
        let cell2y = myGame.pop[0].cells[postIndex].y;
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'black';
        ctx.moveTo(cell1x,cell1y);
        ctx.lineTo(cell2x,cell2y);
        ctx.stroke();
      }
    }
  };

  this.draw = function() {
    // context.arc(x,y,r,sAngle,eAngle,counterclockwise);
    // sAngle = start angle, eAngle = end angle....   uses radiens
    // counterclockwise	Optional
    ctx.beginPath();
    ctx.fillStyle = this.curColor;
    ctx.strokeStyle = this.strokeColor;
    ctx.lineWidth = 1;
    ctx.arc(this.x,this.y,this.rad,0,2*Math.PI);
    ctx.fill();
    ctx.stroke();
    // index at center of cell
    this.txt.draw();
    // HITBOXES
    // ctx.save();
    // ctx.translate(this.x,this.y);
    // ctx.beginPath();
    // ctx.strokeStyle = "green";
    // ctx.lineWidth = 1;
    // ctx.rect(-this.rad,-this.rad,this.rad*2,this.rad*2);
    // ctx.stroke();
    // ctx.restore();
  }; // draw

  this.update = function() {

  };

}
