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
  this.currentDataFrame = undefined;
  this.currentDataFrameSlider = undefined;
  this.stimRound = undefined;

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
    let topScreenOffset = 170;
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
                                        /* height */  140,
                                        /* font   */  "16px Ariel",
                                        /* color  */  "blue"
    );
    this.txtStatusRight.init();
    this.txtStatusRight.addLine("Need Stimulus");
    this.txtStatusLeft = new TxtGroup( /* x       */  2,
                                        /* y      */  2,
                                        /* width  */  200,
                                        /* height */  140,
                                        /* font   */  "16px Ariel",
                                        /* color  */  "blue"
    );
    this.txtStatusLeft.init();
    this.txtStatusLeft.addLine("Need Stimulus");
    this.buildPostLinks();
  }; // INIT

  this.buildPostLinks = function() {
    let ind = 0;
    for (let key in myNets.n_0.cells) {
      this.cells[ind].loadPostLinks(myNets.n_0.cells[key]);
      ind += 1;
    }
  };

  this.loadNetStim = function() {
    this.currentDataFrame = myStim.dataSetRow_0.dataFrame_0;
    this.stimRound = this.currentDataFrame.stimulusRound_1;
    // this.currentDataFrame.stimulusRound_1.cells.c_0
    this.txtStatusRight.clear();
    this.txtStatusRight.addLine("DataSetRow: 0");
    this.txtStatusRight.addLine("DataFrame: 0");
    this.txtStatusRight.addLine("StimRound: 1");
    this.buildDataFrameInterface();
  };

  this.getStimRoundCount = function() {
    let count = 0;
    for (let key in this.currentDataFrame) {
      if (key.slice(0,4) === 'stim') {
        count++;
      }
    }
    return count;
  }

  this.buildDataFrameInterface = function() {
    console.log('building dataFrame UI');
    let stimRoundTotal = this.getStimRoundCount();
    // Slider(x,y,width,height,nodeTotal)
    let newSlider = new Slider( /* x         */  (canW-504)/2,
                                /* y         */  40,
                                /* width     */  504,
                                /* height    */  60,
                                /* nodeTotal */  stimRoundTotal,
                                /* pColor    */  this.color
                              );
    newSlider.init();
    this.currentDataFrameSlider = newSlider;
  };

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
    if (this.currentDataFrameSlider !== undefined) { this.currentDataFrameSlider.draw(); }
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
    for (let key in cellObj.postLinks) {
      this.curPostLinks.push( parseInt(cellObj.postLinks[key].postCellIndex) );
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
    ctx.lineWidth = 2;
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
