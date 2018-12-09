/*jshint esversion: 6 */


function Cell(x,y,size,shape,color,ind) {
  this.origX = x;
  this.origY = y;
  this.x = x;
  this.y = y;
  this.size = size;
  this.baseSize = size;
  this.shape = shape; // tri, arc, quad
  this.baseColor = color;
  this.curColor = color;
  this.strokeColor = myColors.black;
  this.txt = undefined;
  this.index = ind;
  this.clickSelected = false;
  this.status = undefined;
  this.broadcastCoeff = undefined;
  this.decayRate = undefined;
  this.internalCoeff = undefined;
  this.curPostLinks = undefined;
  this.refractoryPeriod = undefined;
  this.xOffset = undefined;
  this.dim = false;

  this.init = function() {
    let tmpFontSize = 16;
    if ((this.size/2) < 14) {
      this.xOffset = 10;
    } else {
      this.xOffset = -3;
    }
    this.txt = new TxtBox(  /*  x       */  this.x+this.xOffset,
                            /*  y       */  this.y+3,
                            /* fontSize */  tmpFontSize,
                            /* font     */  (""+tmpFontSize.toString()+"px bold tahoma"),  // [font style][font weight][font size][font face]
                            /* color    */  myColors.black,
                            /* text     */  this.index.toString()
                          );
  };

  this.changePos = function(newX,newY) {
    this.x = newX;
    this.y = newY;
    this.txt.x = this.x+this.xOffset;
    this.txt.y = this.y+3;
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
        if (this.dim === true) {
          ctx.globalAlpha = 0.2;
        } else {
          ctx.globalAlpha = 1;
        }
        ctx.lineWidth = 1;
        ctx.strokeStyle = myColors.black;
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
    if (this.dim === true) {
      ctx.globalAlpha = 0.2;
    } else {
      ctx.globalAlpha = 1;
    }
    if (this.clickSelected === true) { // if selected make thick outline
      ctx.fillStyle = this.curColor;
      ctx.strokeStyle = myColors.black;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 1;
      this.size = this.baseSize * 1.5;
    } else {
      ctx.fillStyle = this.curColor;
      ctx.strokeStyle = this.strokeColor;
      ctx.lineWidth = 1;
    }
    ctx.save();
    ctx.translate(this.x,this.y);
    if (this.shape === 'tri') {
      ctx.moveTo(-this.size/2,this.size/2);
      ctx.lineTo(0,-this.size/2);
      ctx.lineTo(this.size/2,this.size/2);
      ctx.lineTo(-this.size/2,this.size/2);
    } else if (this.shape === 'arc') {
      ctx.arc(0,0,this.size/2,0,2*Math.PI);
    } else if (this.shape === 'quad') {
      ctx.rect(-this.size/2,-this.size/2,this.size,this.size);
    } else {
      console.log('cell shape draw probs');
    }
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    // index at center of cell
    this.txt.draw();
    // HITBOXES
    // ctx.save();
    // ctx.translate(this.x,this.y);
    // ctx.beginPath();
    // ctx.strokeStyle = "green";
    // ctx.lineWidth = 1;
    // ctx.rect(-this.size/2,-this.size/2,this.size,this.size);
    // ctx.stroke();
    // ctx.restore();
  }; // draw

  this.update = function() {
  };

}
