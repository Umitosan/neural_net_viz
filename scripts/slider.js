/*jshint esversion: 6 */

function Slider(x,y,width,height,nodeTotal,pColor) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.nodeTotal = nodeTotal;
  this.primaryColor = pColor;
  this.activeNode = 0;

  this.init = function() {

  };

  this.setActiveNode = function(nodeIndex) {
    this.activeNode = nodeIndex;
  };

  this.draw = function() {
    // box
    // ctx.beginPath();
    // ctx.lineWidth = 1;
    // ctx.strokeStyle = 'green';
    // ctx.rect(this.x,this.y,this.width,this.height);
    // ctx.stroke();
    // mid line
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = this.primaryColor;
    ctx.moveTo( this.x,this.y+(this.height/2) );
    ctx.lineTo( this.x+this.width,this.y+(this.height/2) );
    ctx.stroke();
    // node cirlces
    for (let i = 0; i < this.nodeTotal; i++) {
      let xOffset = i * (this.width/(this.nodeTotal-1));
      let yOffset = this.height/2;
      let nodeRad;
      ctx.beginPath();
      if (this.activeNode === i) {
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'gold';
        nodeRad = 12;
        ctx.lineWidth = 2;
      } else {
        ctx.strokeStyle = 'black';
        ctx.fillStyle = this.primaryColor;
        nodeRad = 8;
        ctx.lineWidth = 2;
      }
      ctx.arc(this.x+xOffset,this.y+yOffset,nodeRad,0,2*Math.PI); // x, y, radius, sAngle, eAngle
      ctx.fill();
      ctx.stroke();
    }
  };

  this.update = function() {

  };

}
