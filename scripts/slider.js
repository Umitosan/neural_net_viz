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
      }
      this.nodes.push(tmpNode);
    }
  };

  this.checkNodeClicked = function(mX,mY) {
    if ( (mX > (this.x-this.nodes[0].rad)) && (mX < (this.x+this.width+this.nodes[0].rad)) && (mY > this.y) && (mY < (this.y+this.height)) ) { // check if within slider box first
      for (let i = 0; i < this.nodes.length; i++) { // check if clicked each slider node
        let node = this.nodes[i];
        let extra = 6; // this is extra pixels to check on hitbox size
        if ( (mX > (node.x-node.rad-extra)) && (mX < (node.x+node.rad+extra+extra)) &&
             (mY > (node.y-node.rad-extra)) && (mY < (node.y+node.rad+extra+extra)) ) {
          this.activeNode = i;
          myGame.curNet.loadStimRoundInd(i);
        }
      }
    }
  };

  this.goForward = function() {
    if ( (this.activeNode + 1) < this.nodes.length ) {
      this.activeNode += 1;
      // console.log('new active node = ', this.activeNode);
    } else {
      console.log('cant goForward on slider');
    }
  };

  this.goBack = function() {
    if ( (this.activeNode - 1) >= 0 ) {
      this.activeNode -= 1;
      // console.log('new active node = ', this.activeNode);
    } else {
      console.log('cant goBack on slider');
    }
  };

  this.draw = function() {
    // mid line
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = this.primaryColor;
    ctx.moveTo( this.x,this.y+(this.height/2) );
    ctx.lineTo( this.x+this.width,this.y+(this.height/2) );
    ctx.stroke();
    // node cirlces
    for (let i = 0; i < this.nodeTotal; i++) {
      let rad;
      ctx.beginPath();
      ctx.lineWidth = 2;
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
      // HITBOXES
      // let extra = 6;
      // ctx.beginPath();
      // ctx.lineWidth = 1;
      // ctx.strokeStyle = 'black';
      // ctx.rect( this.nodes[i].x - this.nodes[i].rad - extra,
      //           this.nodes[i].y - this.nodes[i].rad - extra,
      //           this.nodes[i].rad * 2 + (extra*2),
      //           this.nodes[i].rad * 2 + (extra*2)
      //         );
      // ctx.stroke();
    } // for
  };

  this.update = function() {
  };
} // slider


/*jshint esversion: 6 */

function SliderType2(x,y,width,height,nodeTotal,pColor) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.nodeTotal = nodeTotal;
  this.primaryColor = pColor;
  this.activeNode = 0;
  this.nodes = undefined;
  this.dragging = false;

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
      }
      this.nodes.push(tmpNode);
    }
  };

  this.checkNodeClicked = function(mX,mY) {
    if ( (mX > (this.x-this.nodes[0].rad)) && (mX < (this.x+this.width+this.nodes[0].rad)) && (mY > this.y) && (mY < (this.y+this.height)) ) { // check if within slider box first
      for (let i = 0; i < this.nodes.length; i++) { // check if clicked each slider node
        let node = this.nodes[i];
        let extra = 6; // this is extra pixels to check on hitbox size
        if ( (mX > (node.x-node.rad-extra)) && (mX < (node.x+node.rad+extra+extra)) &&
             (mY > (node.y-node.rad-extra)) && (mY < (node.y+node.rad+extra+extra)) ) {
          this.activeNode = i;
          myGame.curNet.loadStimRoundInd(i);
        }
      }
    }
  };

  this.goForward = function() {
    if ( (this.activeNode + 1) < this.nodes.length ) {
      this.activeNode += 1;
      // console.log('new active node = ', this.activeNode);
    } else {
      console.log('cant goForward on slider');
    }
  };

  this.goBack = function() {
    if ( (this.activeNode - 1) >= 0 ) {
      this.activeNode -= 1;
      // console.log('new active node = ', this.activeNode);
    } else {
      console.log('cant goBack on slider');
    }
  };

  this.draw = function() {
    // mid line
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = this.primaryColor;
    ctx.moveTo( this.x,this.y+(this.height/2) );
    ctx.lineTo( this.x+this.width,this.y+(this.height/2) );
    ctx.stroke();
    // node cirlces
    for (let i = 0; i < this.nodeTotal; i++) {
      let rad;
      ctx.beginPath();
      ctx.lineWidth = 1;
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
      // HITBOXES
      // let extra = 6;
      // ctx.beginPath();
      // ctx.lineWidth = 1;
      // ctx.strokeStyle = 'black';
      // ctx.rect( this.nodes[i].x - this.nodes[i].rad - extra,
      //           this.nodes[i].y - this.nodes[i].rad - extra,
      //           this.nodes[i].rad * 2 + (extra*2),
      //           this.nodes[i].rad * 2 + (extra*2)
      //         );
      // ctx.stroke();
    } // for
  };

  this.update = function() {
  };
} // slider
