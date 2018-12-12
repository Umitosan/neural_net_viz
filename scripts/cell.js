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
  this.pLinkLines = undefined;
  this.pLinkDur = 50; // ms

  this.init = function() {
    this.pLinkLines = [];
    if (this.index === 0) {
      for (let i = 0; i < 20; i++) {
        let x1 = (i*20);
        let x2 = (i*20)+18;
        let newObj = {'x1':x1,'y1':120,'x2':x2,'y2':120};
        this.pLinkLines.push(newObj);
      }
      console.log('this.pLinkLinkes = ', this.pLinkLines);
    }
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
      ctx.lineWidth = 4;
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

    // pLinkLines
    if (this.index === 0) {
      for (let i = 0; i < this.pLinkLines.length; i++) {
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'red';
        ctx.globalAlpha = 1;
        ctx.moveTo(this.pLinkLines[i].x1,this.pLinkLines[i].y1);
        ctx.lineTo(this.pLinkLines[i].x2,this.pLinkLines[i].y2);
        ctx.stroke();
      }
    }
  }; // draw

  this.update = function() {
    let vel = 1;
    if (this.index === 0) {
      if ( (performance.now() % this.pLinkDur) < 18 ) {
        if (this.pLinkLines[0].x1 > 18) {
          this.pLinkLines.pop();
          this.pLinkLines.unshift({'x1':0,'y1':120,'x2':18,'y2':120});
        }
        for (let i = 0; i < this.pLinkLines.length; i++) {
          this.pLinkLines[i].x1 += vel;
          this.pLinkLines[i].x2 += vel;
        }
      }
    }
  };

}
