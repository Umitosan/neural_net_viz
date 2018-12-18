/*jshint esversion: 6 */


function TxtGroup(x,y,width,height,font,color=myColors.black) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.font = font;
  this.fontSize = 14;
  this.color = color;
  this.lines = undefined;
  this.mouseOver = false;

  this.init = function() {
    this.lines = [];
  };

  this.clear = function() {
    this.lines = [];
  };

  this.addLine = function(newTxt) {
    let len = this.lines.length;
    let xOffset = (this.width * 0.2);
    this.lines.push(new TxtBox( /* x        */  this.x + xOffset,
                                /* y        */  this.y + 4 + ((len+1) * this.fontSize * 1.4),
                                /* fonSize  */  this.fontSize,
                                /* font     */  this.font,
                                /* color    */  this.color,
                                /* text     */  newTxt
                                ));
  };

  this.draw = function() {
    // bound box
    ctx.beginPath();
    ctx.strokeStyle = myColors.black;
    ctx.lineWidth = '2';
    ctx.rect(this.x,this.y,this.width,this.height);
    ctx.stroke();
    for (var i = 0; i < this.lines.length; i++) {
      this.lines[i].draw();
    }
  };

  this.update = function() {
    // check if mouse in box
    if (  (State.mouseX > this.x) && (State.mouseX < (this.x+this.width)) &&
          (State.mouseY > this.y) && (State.mouseY < (this.y+this.height))  ) {
      if (this.mouseOver === false) {
        this.mouseOver = true;
        $('.input-data-frame').css('display','block');
      }
    } else {
      if (this.mouseOver === true) {
        this.mouseOver = false;
        $('.input-data-frame').css('display','none');
      }
    }
  };

}

function TxtBox(x,y,fontSize,font,color,text) {
  this.x = x;
  this.y = y;
  this.fontSize = fontSize;
  this.font = font;
  this.color = color;
  this.text = text;

  this.draw = function() {
    ctx.font = this.font;
    ctx.fillStyle = this.color;
    ctx.fillText(this.text,this.x,this.y);
  };
}
