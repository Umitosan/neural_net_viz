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

// old xml parser
// function getFileXML(evt) {
//   // console.log(evt);
//   let myFile = evt.target.files[0];
//   let reader = new FileReader();
//   reader.onload = function(){
//     var text = reader.result;
//     var outputDiv = $('#output')[0];
//     outputDiv.innerText = text;
//     console.log("file preview: ", reader.result.substring(0, 100));
//   };
//   reader.readAsText(myFile);
//   reader.onloadend = function(){
//       xmlData = $(reader.result); // obj
//       xmlDataString = reader.result; // str
//       domParserData = (new DOMParser()).parseFromString(reader.result, "text/xml");
//       let inputs = domParserData.getElementsByTagName("inputs");
//       let stim = domParserData.getElementsByTagName("stimulus");
//       newJSON = xmlToJson(domParserData);
//       console.log('inputs nodes = ', inputs);
//       console.dir(newJSON);
//   };
// }
// $('#file-in').on("change", getFileXML);

// function getFileXML(evt) {
//   console.log(evt);
// }

// old json to simple string
function printJsonAsString(someObj, indentLvl=0) {
  let finalStr = "";
  let finalStrHTML = "";
  // let indentStr = "" + indentLvl;   // bebug indent lvl
  let indentStr = indentLvl + "  ";
  for (let j = 0; j < indentLvl; j++) {
    indentStr += "  ";
  }
  for (let i in someObj) {
    if( someObj.hasOwnProperty(i) ) {
      if (typeof someObj[i] === 'object') {
        if (Array.isArray(someObj[i]) === true) { // beginning of array
          finalStr += indentStr + i + ": " + "(arr length=" + someObj[i].length + ")" + "\n";
          finalStr += printJsonAsString(someObj[i], indentLvl+1);
        } else { // non-array obj
          finalStr += indentStr + i + ": " + "(obj length=" + Object.keys(someObj[i]).length + ")" + "\n";
          finalStr += printJsonAsString(someObj[i], indentLvl+1);
        }
      } else if (typeof someObj[i] === 'string') {
        finalStr += indentStr + i + ": '" + someObj[i] + "'" + "\n";
      } else if (typeof someObj[i] === 'number') {
        finalStr += indentStr + i + ": " + someObj[i] + "\n";
      } else {
        console.log('undefined type');
      }
    } else {
      console.log("someObj.hasOwnProperty(i) = false");
    }
  } // for
  return finalStr;
} // printJsonAsString
