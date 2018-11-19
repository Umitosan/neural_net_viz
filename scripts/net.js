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

  this.init = function() {
    this.cells = [];
    let diameter = (this.width / 10) * 0.8;
    console.log('diam = ', diameter);
    let leftOffset = 4;
    let xGap = 170;
    let yGap = 30;
    let curIndex = 0;
    for (let i = 0; i < 4; i++) {  // left column
      let newCell = new Cell(   /*   x    */  this.x + diameter + leftOffset,
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
      let newCell = new Cell(   /*   x    */  (this.width / 2) + (diameter/2),
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
                                /* font     */  (""+tmpFontSize.toString()+"px bold courier"),
                                /* color    */  "black",
                                /* text     */  "Net Index: 0"
                                );
  };

  this.draw = function() {
    for (var i = 0; i < this.cells.length; i++) {
      this.cells[i].draw();
    }
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.moveTo(this.x,this.y);
    ctx.lineTo(this.x+this.width,this.y);
    ctx.lineTo(this.x+this.width,this.y+this.height);
    ctx.lineTo(this.x,this.y+this.height);
    ctx.lineTo(this.x,this.y);
    ctx.stroke();
    this.txtTitle.draw();
  };

  this.update = function() {
    for (var i = 0; i < this.cells.length; i++) {
      this.cells[i].update();
    }
  };

}




function Cell(x,y,rad,color,ind) {
  this.x = x;
  this.y = y;
  this.rad = rad;
  this.baseColor = color;
  this.curColor = color;
  this.strokeColor = "black";
  this.txt = undefined;
  this.index = ind;

  this.init = function() {
    let tmpFontSize = 16;
    this.txt = new TxtBox(  /*  x       */  this.x-3,
                            /*  y       */  this.y+3,
                            /* fontSize */  tmpFontSize,
                            /* font     */  (""+tmpFontSize.toString()+"px bold courier"),
                            /* color    */  "black",
                            /* text     */  this.index.toString()
                          );
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
    this.txt.draw();
  };

  this.update = function() {
    // nothin
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
