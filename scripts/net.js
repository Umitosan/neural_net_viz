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
  this.txtStatus = undefined;
  this.stimRound = undefined;

  this.init = function() {
    this.cells = [];
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
                                /*   y    */  (this.y + diameter/2) + (diameter*1.4) + ((diameter*i) + (yGap*i)),
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
                                /*   y    */  (this.y + diameter/2) + (diameter) + ((diameter*i) + (yGap*i)),
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
                                /*   y    */  (this.height / 2) + (diameter/2),
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
    let statusFontSize = 20;
    this.txtStatus = new TxtBox( /*  x      */  canW-200,
                                /*   y      */  40,
                                /* fontSize */  statusFontSize,
                                /* font     */  (""+statusFontSize.toString()+"px bold courier"),  // [font style][font weight][font size][font face]
                                /* color    */  "black",
                                /* text     */  "Status"+"\n"+"-prop 1\n"
                                );
    // TxtGroup(x,y,height,width,font,color="black")
    this.txtStatus = new TxtGroup(  /* x      */  canW - 202,
                                    /* y      */  2,
                                    /* height */  200,
                                    /* width  */  200,
                                    /* font   */  "20px courier",
                                    /* color  */  "blue"
    );
    this.txtStatus.init();
    this.txtStatus.addLine("Need Stimulus");
  };

  this.loadNetStim = function() {
    this.stimRound = myStim.dataSetRow_0.dataFrame_0.stimulusRound_1;
    this.txtStatus.clear();
    this.txtStatus.addLine("DataSetRow: 0");
    this.txtStatus.addLine("DataFrame: 0");
    this.txtStatus.addLine("StimRound: 1");
  };

  this.draw = function() {
    for (var i = 0; i < this.cells.length; i++) {
      this.cells[i].draw();
    }
    this.txtTitle.draw();
    this.txtStatus.draw();
  };

  this.update = function() {
  };

} // Net




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
    // hitbox
    // ctx.save();
    // ctx.translate(this.x,this.y);
    // ctx.beginPath();
    // ctx.strokeStyle = "green";
    // ctx.lineWidth = 1;
    // ctx.moveTo(-this.rad,-this.rad);
    // ctx.lineTo(this.rad,-this.rad);
    // ctx.lineTo(this.rad,this.rad);
    // ctx.lineTo(-this.rad,this.rad);
    // ctx.lineTo(-this.rad,-this.rad);
    // ctx.stroke();
    // ctx.restore();
  };

  this.update = function() {

  };

}


// function Box(x,y,color,size,vel) {
//   this.x = x;
//   this.y = y;
//   this.color = color;
//   this.size =  size;
//   this.xVel = vel;
//   this.yVel = vel;
//
//   this.draw = function() {
//     ctx.beginPath();
//     ctx.rect(this.x,this.y,this.size,this.size);
//     ctx.fillStyle = this.color;
//     ctx.fill();
//     // ctx.stroke();
//   };
//
//   this.update = function() {
//     if ((this.xVel > 0) && ((this.x + this.size + this.xVel) > canW)) {
//       this.xVel *= -1;
//     }
//     if ((this.xVel < 0) && ((this.x + this.xVel) < 0)) {
//       this.xVel *= -1;
//     }
//     if ((this.yVel > 0) && ((this.y + this.size + this.yVel) > canH)) {
//       this.yVel *= -1;
//     }
//     if ((this.yVel < 0) && ((this.y + this.yVel) < 0)) {
//       this.yVel *= -1;
//     }
//     this.x += this.xVel;
//     this.y += this.yVel;
//   };
//
// } // end box
