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
  this.linkAnimDur = 20; // ms
  this.curLinkAnimOffset = 0;
  this.totalAnimLines = 20;

  this.init = function() {
    let tmpFontSize = 16;
    if ((this.size/2) < 14) {
      this.xOffset = 13;
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

  this.drawNormalLinkLines = function() {
    if (this.curPostLinks !== undefined) { // draw each post link
      for (var i = 0; i < this.curPostLinks.length; i++) {
        let postIndex = this.curPostLinks[i].postCellIndex;
        let cell1x = this.x;
        let cell1y = this.y;
        let cell2x = myGame.curNet.cells[postIndex].x;
        let cell2y = myGame.curNet.cells[postIndex].y;
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

  this.drawpLinkLines = function() {
    if (this.curPostLinks !== undefined) {
      for (let ind = 0; ind < this.curPostLinks.length; ind++) {
        let postIndex = this.curPostLinks[ind].postCellIndex;
        let linkCoeff = this.curPostLinks[ind].linkCoeff;
        let cell1x = this.x;
        let cell1y = this.y;
        let cell2x = myGame.curNet.cells[postIndex].x;
        let cell2y = myGame.curNet.cells[postIndex].y;
        let pxoff = this.curLinkAnimOffset;
        for (let j = 0; j < this.totalAnimLines; j++) {
          // draw 1 segmented anim line
          ctx.beginPath();
          if (this.dim === true) {
            ctx.globalAlpha = 0.2;
          } else {
            ctx.globalAlpha = 1;
          }
          if ((j % 2) === 0) {
            ctx.strokeStyle = myColors.black;
          } else {
            ctx.strokeStyle = myColors.green;
          }
          ctx.lineWidth = 1.5;
          // handle first and last lines so they don't draw beyond target cells
          let baseXlen = ((cell2x - cell1x) / this.totalAnimLines);
          let baseYlen = ((cell2y - cell1y) / this.totalAnimLines);
          let xoff = baseXlen * ((pxoff / 20)); // amount to move by animation
          let yoff = baseYlen * ((pxoff / 20)); // amount to move by animation
          if (j === 0) {
            ctx.moveTo( cell1x , cell1y );
            ctx.lineTo( cell1x + (baseXlen * (j+1)) + xoff, cell1y + (baseYlen * (j+1)) + yoff);
            // ctx.lineTo( cell1x + (baseXlen * (i+1)) + xoff, cell1y + (baseYlen * (i+1)) - 2 + yoff);
            // ctx.lineTo( cell1x + (baseXlen * (i+1)) + xoff, cell1y + (baseYlen * (i+1)) + 2 + yoff);
          } else if ( (j === (this.totalAnimLines - 1)) || (j === (this.totalAnimLines - 2)) ) {
            let sX = cell1x + (baseXlen * j) + xoff;
            let sY = cell1y + (baseYlen * j) + yoff;
            if ( ((cell1x > cell2x) && (sX < cell2x)) || ((cell1x < cell2x) && (sX > cell2x)) ||
                 ((cell1y > cell2y) && (sY < cell2y)) || ((cell1y < cell2y) && (sY > cell2y)) ){
              // don't draw line
            } else {
              ctx.moveTo(sX, sY);
              ctx.lineTo(cell2x, cell2y);
            }
          } else { // values are ok
            ctx.moveTo( cell1x + (baseXlen * j) + xoff, cell1y + (baseYlen * j) + yoff);
            ctx.lineTo( cell1x + (baseXlen * (j+1)) + xoff, cell1y + (baseYlen * (j+1)) + yoff);
            // ctx.lineTo( cell1x + (baseXlen * (i+1)) + xoff, cell1y + (baseYlen * (i+1)) - 2 + yoff);
            // ctx.lineTo( cell1x + (baseXlen * (i+1)) + xoff, cell1y + (baseYlen * (i+1)) + 2 + yoff);
          }
          ctx.stroke();
        } // for
        if (this.clickSelected === true) {
          this.drawpLinkLineCoeff(ind,cell2x,cell2y);
        }
      } // for curPostLinks
    }
  };

  this.drawpLinkLineCoeff = function(pLinkIndex,c2x,c2y) {
    // draw link linkCoeff text for each line
    let linkCoeff = this.curPostLinks[pLinkIndex].linkCoeff;
    let xHalfway =  this.x + ((c2x -  this.x) / 2);
    let yHalfway =  this.y + ((c2y -  this.y) / 2);
    let textLength = linkCoeff.toString().length;
    let boxWidth = (textLength + 3) * 10; // number of characters * pixels per character
    let boxHeight = 19;
    ctx.clearRect(xHalfway+4,yHalfway-20,boxWidth,boxHeight); // white space to draw on
    ctx.strokeStyle = myColors.black;
    ctx.lineWidth = 1;
    ctx.rect(xHalfway+4,yHalfway-20,boxWidth,boxHeight);
    ctx.stroke();
    ctx.font = "14px Helvetica";
    ctx.fillStyle = myColors.black;
    ctx.fillText("LC "+linkCoeff,xHalfway+6,yHalfway-6); // slight offset to make sure text is visible
  };

  this.drawLinks = function() {
    if (this.status === "excited") {
      this.drawpLinkLines();
    } else {
      this.drawNormalLinkLines();
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
      ctx.lineWidth = 3;
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
    this.txt.draw();  // index at center of cell
    // CELL HITBOXES
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
    if (this.dim === false) {
      if ( (performance.now() % this.linkAnimDur) < 17 ) {
        if (this.curLinkAnimOffset > ((this.totalAnimLines*2) - 2)) {
          this.curLinkAnimOffset = 0;
        } else {
          this.curLinkAnimOffset += 1;
        }
      }
    }
  };

}
