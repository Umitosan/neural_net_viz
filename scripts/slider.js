/*jshint esversion: 6 */

function Slider(x,y,width,height,nodeTotal,pColor) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.nodeTotal = nodeTotal;
  this.primaryColor = pColor;
  this.activeNode = 0;
  this.nodes = undefined;

  this.init = function() {
    this.nodes = [];
    for (let i = 0; i < this.nodeTotal; i++) {
      let tmpNode = {};
      let xOffset = this.x + (i * (this.width/(this.nodeTotal-1)));
      let yOffset = this.y + this.height/2;
      let newColor = this.primaryColor;
      tmpNode = {
        x: xOffset,
        y: yOffset,
        color: newColor,
        rad: 8
      };
      this.nodes.push(tmpNode);
    }
  };

  this.checkNodeClicked = function(mX,mY) {
    // if ( (mX > (this.x-this.nodes[0].rad)) && (mX < (this.x+this.width+this.nodes[0].rad)) && (mY > this.y) && (mY < (this.y+this.height)) ) { // check if within slider box first
    //   for (let i = 0; i < this.nodes.length; i++) { // check if clicked each slider node
    //     let node = this.nodes[i];
    //     let extra = 6; // this is extra pixels to check on hitbox size
    //     if ( (mX > (node.x-node.rad-extra)) && (mX < (node.x+node.rad+extra+extra)) &&
    //          (mY > (node.y-node.rad-extra)) && (mY < (node.y+node.rad+extra+extra)) ) {
    //       this.activeNode = i;
    //       myGame.curNet.loadStimRound(i);
    //     }
    //   }
    // }
  };

  this.goForward = function() {
    this.activeNode += 1;
    // if ( (this.activeNode + 1) < this.nodes.length ) {
    //   this.activeNode += 1;
    // } else {
    //   console.log('cant goForward on slider');
    // }
  };

  this.goBack = function() {
    this.activeNode -= 1;
    // if ( (this.activeNode - 1) >= 0 ) {
    //   this.activeNode -= 1;
    // } else {
    //   console.log('cant goBack on slider');
    // }
  };

  this.draw = function() {
    ctx.save();
    ctx.lineWidth = 1;
    // mid line
    ctx.beginPath();
    ctx.strokeStyle = this.primaryColor;
    ctx.moveTo( this.x,this.y+(this.height/2) );
    ctx.lineTo( this.x+this.width,this.y+(this.height/2) );
    ctx.stroke();
    // node ticks
    for (let i = 0; i < this.nodeTotal; i++) {
      let rad;
      ctx.beginPath();
      ctx.strokeStyle = 'black';
      if (this.activeNode === i) {
        ctx.fillStyle = 'gold';
        rad = 12;
      } else {
        ctx.fillStyle = this.nodes[i].color;
        rad = this.nodes[i].rad;
      }
      ctx.arc(  this.nodes[i].x,
                this.nodes[i].y,
                rad,
                0,
                2*Math.PI
                ); // x, y, radius, sAngle, eAngle
      ctx.fill();
      ctx.stroke();
    } // for
    ctx.restore();
  };

  this.update = function() {
  };
} // slider


function SliderType2(x,y,width,height,nodeTotal,pColor) {
  this.x = x + 0.5;
  this.y = y + 0.5;
  this.width = width;
  this.height = height;
  this.nodeTotal = nodeTotal;
  this.primaryColor = pColor;
  this.activeNode = 0;
  this.nodes = undefined;
  this.dragging = false;
  this.txtIndexLabel = undefined;

  this.init = function() {
    console.log('new slider');
    this.nodes = [];
    let gap = (this.width / (this.nodeTotal - 1)); // gap between nodes on slider
    for (let i = 0; i < this.nodeTotal; i++) {
      let tmpNode = {};
      let xOffset = this.x + (i*gap);
      let yOffset = this.y;
      let newColor = this.primaryColor;
      tmpNode = {
        x: xOffset,
        y: yOffset,
        color: newColor
      };
      this.nodes.push(tmpNode);
    }
  };

  this.checkNodeClicked = function(mX,mY) {
    let extraGap = 4; // this is extra pixels to check on hitbox size
    let bestXdistance = 100000; // currently found nearest X of node
    let nearestNodeIndex = 0;
    if (  ((mX >= (this.x-extraGap)) && (mX <= (this.x+this.width+(extraGap*2)))) &&
          ((mY >= this.y-extraGap) && (mY <= (this.y+this.height+(extraGap*2))))  ) { // check if within slider box first
      for (let i = 0; i < this.nodes.length; i++) { // check if clicked each slider node
        // get NEAREST node to click
        let measurement = Math.abs(mX - this.nodes[i].x); // distance from click to node.x
        if ( measurement < bestXdistance) {
          bestXdistance = measurement;
          nearestNodeIndex = i;
        }
      } // for
      this.activeNode = nearestNodeIndex;
      // console.log('this.nodes[i] = ', this.nodes[nearestNodeIndex]);
      // console.log('active Node now = ', nearestNodeIndex);
      myGame.curNet.loadStimRoundByInd(nearestNodeIndex);
    } // if
  };


  this.goForward = function() {
    if ( (this.activeNode + 1) < this.nodes.length ) {
      this.activeNode += 1;

    } else {
      console.log('cant goForward on slider');
    }
  };

  this.goBack = function() {
    if ( (this.activeNode - 1) >= 0 ) {
      this.activeNode -= 1;
    } else {
      console.log('cant goBack on slider');
    }
  };

  this.draw = function() {
    // mid line
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'grey';
    ctx.moveTo( this.x,this.y+(this.height/2) );
    ctx.lineTo( this.x+this.width,this.y+(this.height/2) );
    ctx.stroke();
    // hitbox
    // let gap = 4;
    // ctx.beginPath();
    // ctx.lineWidth = 1;
    // ctx.strokeStyle = 'green';
    // ctx.rect(this.x-gap,this.y-gap,this.width+(gap*2),this.height+(gap*2));
    // ctx.stroke();
    // node lines
    for (let i = 0; i < this.nodes.length; i++) {
      let curNode = this.nodes[i];
      ctx.beginPath();
      ctx.strokeStyle = 'grey';
      ctx.moveTo(Math.round(curNode.x), curNode.y);
      ctx.lineTo(Math.round(curNode.x), curNode.y+this.height);
      ctx.stroke();
    } // for
    // top/bot filigree
    let curNode = this.nodes[this.activeNode];
    let tSize = 10;
    let boxSize = 10;
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.fillStyle = this.primaryColor;
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;

    let yoff = 2;
    // top
    // ctx.moveTo(curNode.x-tSize, curNode.y-yoff);
    // ctx.lineTo(curNode.x, curNode.y-yoff-tSize);
    // ctx.lineTo(curNode.x+tSize, curNode.y-yoff);
    // ctx.lineTo(curNode.x-tSize, curNode.y-yoff);
    // ctx.fill();
    // bot
    // ctx.beginPath();
    // ctx.moveTo(curNode.x-tSize, curNode.y+this.height+yoff);
    // ctx.lineTo(curNode.x, curNode.y+yoff+this.height+tSize);
    // ctx.lineTo(curNode.x+tSize, curNode.y+yoff+this.height);
    // ctx.lineTo(curNode.x-tSize, curNode.y+this.height+yoff);
    // ctx.fill();

    // left
    ctx.moveTo(curNode.x-boxSize, curNode.y+this.height);
    ctx.lineTo(curNode.x-boxSize-tSize, curNode.y+(this.height/2));
    ctx.lineTo(curNode.x-boxSize, curNode.y);
    ctx.lineTo(curNode.x-boxSize, curNode.y+this.height);
    ctx.fill();
    // right
    ctx.moveTo(curNode.x+boxSize, curNode.y+this.height);
    ctx.lineTo(curNode.x+boxSize+tSize, curNode.y+(this.height/2));
    ctx.lineTo(curNode.x+boxSize, curNode.y);
    ctx.lineTo(curNode.x+boxSize, curNode.y+this.height);
    ctx.fill();
    // box
    ctx.beginPath();
    ctx.fillStyle = this.primaryColor;
    ctx.strokeStyle = 'black';
    ctx.rect(curNode.x-boxSize, curNode.y-1,boxSize*2,this.height+2);
    // ctx.rect(curNode.x-1, curNode.y-1,2,this.height+2);
    ctx.fill();
    ctx.stroke();
    // node label
    ctx.save();
    ctx.font = "14pt Helvetica";
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.shadowBlur = 4;
    ctx.fillStyle = 'black';
    ctx.fillText(this.activeNode,curNode.x-5,curNode.y+16);
    ctx.restore();
  }; // draw

  this.update = function() {
  };
} // slider
