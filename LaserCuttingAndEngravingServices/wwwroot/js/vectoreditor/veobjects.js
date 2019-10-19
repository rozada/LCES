
function EventHandlingItem(eventName, eventHandler) {
	this.eventName = eventName;
	this.eventHandler = eventHandler;
};


var inputExt =  {
	onkeyup: function(event) {
		window.alert("test");//setTimeout(function(){console.log("Timed out"), 3000});
	}
}

function validateQty(event) {
    var key = window.event ? event.keyCode : event.which;
console.log("Event keycode "  + key);
	if (key == 8 || key == 46
 	|| key == 37 || key == 39 
 	|| key == 190) { 		
		console.log("AM returning true: ");
	    return true;
	}
	else if ( key < 48 || key > 57 ) {
    	return false;
	}
	else return true;
};

function parseInput(inputValue) {
	var occurrences = (inputValue.match(/\./g) || []).length;// inputValue.split(",").length - 1;

	console.log("occurrences: " + occurrences);
	if (occurrences > 1) {
		return null;
	}
	else {
		return new Intl.NumberFormat('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(inputValue);
	}

}

function CoordInput(inputObject, dim, gridLineSpacing, otherInputObject, dim2) {
	inputObject.style.width = "50px";
	var self = this;
	self.currentShape = null;
	self.dimension = dim;
	self.dimension2 = dim2;
	self.inputObject = inputObject;
    self.otherInputObject = otherInputObject;
    console.log("SELF.otherInputObject: " + self.otherInputObject);
	self.keyTimer = null;
	self.originalValue = null;
    self.gridLineSpacing = gridLineSpacing;
	self.onkeyup =  function(event) {
		if (event.keyCode === 13) {	//checking for <enter>
			self.processCoordInput();
			return;
		}
		self.keyTimer = setTimeout(self.processCoordInput, 1500);		
	}

	self.processCoordInput = function() {
			if (self.currentShape !== null) {
				var formattedValue = parseInput(self.inputObject.value);				
				if (formattedValue !== null) {
					self.inputObject.value = formattedValue;
	      			console.log("Current shape className: " + self.currentShape.className);
		          if (self.currentShape.className.baseVal === "square") {  // if this is a square the other input element must change as well
	    		    console.log("Current shape is square");
	        		self.otherInputObject.value = formattedValue;
	      		   }
					self.originalValue = self.inputObject.value;				
				}
				else {
					self.inputObject.value = self.originalValue;
				}
				self.currentShape.resizeInCenter(self.dimension, self.denormalizeValue(self.inputObject.value));
				if (self.currentShape.className.baseVal === "square") {
					self.currentShape.resizeInCenter(self.dimension2, self.denormalizeValue(self.inputObject.value));
			}
		}     
	}

	self.setDimension = function(dim) {
		self = this;
		self.dimension = dim;
	}

	self.onkeydown = function(event) {		
		if (self.keyTimer !== null) {
			clearTimeout(self.keyTimer);
			self.keyTimer = null;
		}
		return validateQty(event);
	}

    self.onfocus = function(event) {
      this.setSelectionRange(0, this.value.length);
    }

    self.ondblclick = function(event) {
      this.setSelectionRange(0, this.value.length);
    }
	
    self.onblur = function(event) {
    	self.processCoordInput();
    }

	self.setCurrentShape = function(newShape) {
		self.currentShape = newShape;
    	var currentShapeValue = self.currentShape.getAttributeNS(null, self.dimension);    	
		self.setNormalizedValue(currentShapeValue);
		self.originalValue = currentShapeValue; 		
	}

	self.setDiameterInputCurrentShape = function(newShape) {
		self.currentShape = newShape;
    	var currentShapeValue = self.currentShape.getAttributeNS(null, "r");    	    	
		self.setDiameterInputNormalizedValue(currentShapeValue);
		self.originalValue = currentShapeValue; 	
	}

  self.setNormalizedValue = function(value) {
    self.inputObject.value = value/self.gridLineSpacing;
  }

  self.setDiameterInputNormalizedValue = function(value) {
    self.inputObject.value = (value/self.gridLineSpacing) * 2;
  }


  self.denormalizeValue = function(value) {
    return value * self.gridLineSpacing;
  }

	_.extend(inputObject, this);
	return inputObject;
}
// end CoordInput definition
