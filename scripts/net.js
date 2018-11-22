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
  this.stimRoundPostLinkList = undefined;

  this.init = function() {
    this.cells = [];
    this.stimRoundPostLinkList = myNets[0].cells;
    let diameter = (this.width / 10) * 0.8;
    let leftOffset = 4;
    let xGap = 170;
    let yGap = 34;
    let curIndex = 0;
    for (let i = 0; i < 4; i++) {  // left column
      let off = leftOffset;
      if (i === 1) { off = leftOffset*12*1; }
      if (i === 2) { off = leftOffset*12*2; }
      let newCell = new Cell(   /*   x    */  this.x + diameter + off,
                                /*   y    */  (this.y + diameter/2 + 40) + (diameter*1.4) + ((diameter*i) + (yGap*i)),
                                /* radius */  diameter/2,
                                /* color  */  this.color,
                                /* index  */  curIndex
                              );
      newCell.init();
      this.cells.push(newCell);
      curIndex += 1;
    }
    for (let i = 0; i < 5; i++) {  // middle column
      let off = leftOffset;
      if (i === 1) { off = leftOffset*12*1; }
      if (i === 2) { off = leftOffset*12*2; }
      if (i === 3) { off = leftOffset*12*1; }
      let newCell = new Cell(   /*   x    */  (this.width / 2) + (diameter/2) + off,
                                /*   y    */  (this.y + diameter/2 + 40) + (diameter) + ((diameter*i) + (yGap*i)),
                                /* radius */  diameter/2,
                                /* color  */  this.color,
                                /* index  */  curIndex
                              );
      newCell.init();
      this.cells.push(newCell);
      curIndex += 1;
    }
    for (let i = 0; i < 1; i++) { // right
      let newCell = new Cell(   /*   x    */  (this.x + this.width) - diameter - leftOffset,
                                /*   y    */  (this.height / 2 + 40) + (diameter/2),
                                /* radius */  diameter/2,
                                /* color  */  this.color,
                                /* index  */  curIndex
                              );
      newCell.init();
      this.cells.push(newCell);
      curIndex += 1;
    }
    // console.dir(this.cells);
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
  };

  this.loadNetStim = function() {
    this.currentDataFrame = myStim.dataSetRow_0.dataFrame_0;
    this.txtStatusRight.clear();
    this.txtStatusRight.addLine("DataSetRow: 0");
    this.txtStatusRight.addLine("DataFrame: 0");
    this.txtStatusRight.addLine("StimRound: 1");
    this.buildDataFrameInterface();
    this.buildPostLinks();
  };

  this.buildPostLinks = function() {
    for (let i = 0; i < this.stimRoundPostLinkList.length; i++) {
      this.cells[i].loadPostLinks(this.stimRoundPostLinkList[i]);
      // console.log("this.stimRoundPostLinkList[i] = ", this.stimRoundPostLinkList[i]);
    }
  };

  this.buildDataFrameInterface = function() {
    console.log('building data frame interface');
    // Slider(x,y,width,height,nodeTotal)
    let newSlider = new Slider( /* x         */  (canW-504)/2,
                                /* y         */  40,
                                /* width     */  504,
                                /* height    */  60,
                                /* nodeTotal */  8,
                                /* pColor    */  this.color
                              );
    newSlider.init();                          
    this.currentDataFrameSlider = newSlider;
  };

  this.draw = function() {
    if (this.stimRoundPostLinkList !== undefined) {
      for (let i = 0; i < this.cells.length; i++) {
        this.cells[i].drawLinks();
      }
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

  this.loadPostLinks = function(cellsObj) {
    this.curPostLinks = [];
    let linksObj = cellsObj.postLinks;
    for (var i = 0; i < linksObj.length; i++) {
      this.curPostLinks.push(linksObj[i].postCellIndex);
    }
    // console.log('this.curPostLinks = ', this.curPostLinks);
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
