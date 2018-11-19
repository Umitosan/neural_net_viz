/*jshint esversion: 6 */


function Net(x,y,width,height,cellTotal,color) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.cellTotal = cellTotal;
  this.color = color;
  this.cells = undefined;

  this.init = function() {
    this.cells = [];
    let rad = this.height / 6;
    let xSpacing = (this.width - (this.width*0.10)) / (this.cellTotal);
    for (let i = 0; i < cellTotal; i++) {
      this.cells.push(new Cell( /*   x    */  this.x + xSpacing + (xSpacing * i),
                                /*   y    */  this.y + (this.height / 2),
                                /* radius */  rad,
                                /* color  */  this.color
                              ));
    }
    console.dir(this.cells);
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
  };

  this.update = function() {
    for (var i = 0; i < this.cells.length; i++) {
      this.cells[i].update();
    }
  };

}




function Cell(x,y,rad,color) {
  this.x = x;
  this.y = y;
  this.rad = rad;
  this.color = color;

  this.init = function() {

  };

  this.draw = function() {
    // context.arc(x,y,r,sAngle,eAngle,counterclockwise);
    // sAngle = start angle, eAngle = end angle....   uses radiens
    // counterclockwise	Optional
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 1;
    ctx.arc(this.x,this.y,this.rad,0,2*Math.PI);
    ctx.fill();
    ctx.stroke();
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
