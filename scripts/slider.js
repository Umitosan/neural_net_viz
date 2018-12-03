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
    if (  ((mX >= (this.x-extraGap)) && (mX <= (this.x+this.width+(extraGap*2)))) &&
          ((mY >= this.y-extraGap) && (mY <= (this.y+this.height+(extraGap*2))))  ) { // check if within slider box first
      for (let i = 0; i < this.nodes.length; i++) { // check if clicked each slider node
        if ( (mX === this.nodes[i].x) || (mX === this.nodes[i].x-1)) {
          // console.log('mX, mY = '+mX+','+mY);
          this.activeNode = i;
          // console.log('this.nodes[i] = ', this.nodes[i]);
          // console.log('active Node now = ', i);
          myGame.curNet.loadStimRoundByInd(i);
        }
      }
    }
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
      ctx.moveTo(curNode.x, curNode.y);
      ctx.lineTo(curNode.x, curNode.y+this.height);
      ctx.stroke();
    } // for
    // top/bot filigree
    let curNode = this.nodes[this.activeNode];
    let tSize = 8;
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'lightgreen';
    ctx.lineWidth = 1;
    let yoff = 2;
    ctx.moveTo(curNode.x, curNode.y-yoff);
    ctx.lineTo(curNode.x-tSize, curNode.y-yoff-tSize);
    ctx.lineTo(curNode.x+tSize, curNode.y-yoff-tSize);
    ctx.lineTo(curNode.x, curNode.y-yoff);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.moveTo(curNode.x, curNode.y+this.height+yoff);
    ctx.lineTo(curNode.x-tSize, curNode.y+yoff+tSize+this.height);
    ctx.lineTo(curNode.x+tSize, curNode.y+yoff+tSize+this.height);
    ctx.lineTo(curNode.x, curNode.y+this.height+yoff);
    ctx.fill();
    ctx.stroke();
    // box
    ctx.beginPath();
    ctx.fillStyle = 'lightgreen';
    ctx.strokeStyle = 'black';
    ctx.rect(curNode.x-2, curNode.y-1,4,this.height+2);
    ctx.fill();
    ctx.stroke();
    // node label
    ctx.font = "20px bold courier";
    ctx.fillStyle = 'green';
    ctx.fillText(this.activeNode,curNode.x-4,curNode.y-20);
  }; // draw

  this.update = function() {
  };
} // slider
