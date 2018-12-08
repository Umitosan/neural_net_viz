/*jshint esversion: 6 */


function Button(x,y,width,height,color,font,text) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.color = color;
  this.font = font;
  this.text = text;
  this.pressedColor = undefined;
  this.clicked = false;

  this.init = function() {
  };

  this.checkClicked = function(mX,mY) {
    if ( (mX > this.x) && (mX < (this.x+this.width)) && (mY > this.y) && (mY < (this.y+this.height)) ) {
      this.clicked = true;
    }
  };

  this.draw = function() {
    // BUTTON
    ctx.fillStyle = this.color;
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    roundRect(this.x, this.y, this.width, this.height, 4);
    ctx.fill();
    ctx.fillStyle = 'black';
    ctx.font = this.font;
    ctx.fillText(this.text,this.x+2,this.y+12);
  };

  this.update = function() {
  };

}
