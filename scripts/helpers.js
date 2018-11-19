/*jshint esversion: 6 */


function clearCanvas() {
  ctx.clearRect(-1, -1, canvas.width+1, canvas.height+1); // offset by 1 px because the whole canvas is offset initially (for better pixel accuracy)
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

function generalLoopReset() {
  if (State.myReq !== undefined) {  // reset game loop if already started
    cancelAnimationFrame(State.myReq);
  }
  softReset();
  myGame = new Game(State.simSpeed); // ms per update()
  myGame.init();
  State.myReq = requestAnimationFrame(gameLoop);
}

function randColor(type,lowBound,highBound,alphaSwitch = null) { // default alpha = 1
  // more muted colors example
      // return ( "#" + Math.round((getRandomIntInclusive(0,99999999) + 0x77000000)).toString(16) );
  // full spectum below
  let endAlpha;
  if (type === 'hex') {
    return ( "#" + Math.round((getRandomIntInclusive(0,0xffffff))).toString(16) );
  } else if (type === 'rgba') {
      if (alphaSwitch === null) {
        endAlpha = 1;
      } else if (alphaSwitch === 'rand') {
        endAlpha = getRandomIntInclusive(1,10) / 10;
      } else {
        endAlpha = alphaSwitch;
      }
      return ( 'rgba('+ getRandomIntInclusive(lowBound,highBound) +','+ getRandomIntInclusive(lowBound,highBound) +','+ getRandomIntInclusive(lowBound,highBound) +','+endAlpha+')' );
  } else {
    console.log("Not valid option for randColor()");
    return undefined;
  }
}

function TxtBox(x,y,fontSize,font,color,text) {
  // aprox center for cell's txt TxtBox
  this.x = x;
  this.y = y;
  this.fontSize = fontSize;
  this.font = font;
  this.color = color;
  this.text = text;

  this.draw = function() {
    // black number
    ctx.font = this.font;
    ctx.fillStyle = this.color;
    ctx.fillText(this.text,this.x,this.y);
  };
}


// Changes XML to JSON
function xmlToJson(xml) {

	// Create the return object
	var obj = {};

	if (xml.nodeType == 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
		obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) { // text
		obj = xml.nodeValue;
	}

	// do children
	if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
}
