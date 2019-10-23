

var svgns = "http://www.w3.org/2000/svg";

// 20 x 32 is the ratio that need need to preserve for the grid

var vectorEditor = {
    svgPositionInfo: null,

    shapeBox: null,
    shapeBoxWidthPortion:  .12,
    shapeBoxWidth: 75, 
    shapeBoxHeight: 350,

    toolBox: null,
    toolBoxWidth: 475,
    toolBoxHeight: 50,
    toolBoxWidthPortion: .85,

    grid: null,
    gridX: null,
    gridY: null,
    gridWidth: null, // this will be set on initialization
    widthLimit: null,
    gridHeight: null, // this will be set on initialization
    heightLimit: null,
    gridVertLinesDefault: 32,
    gridHorzLinesDefault: 20,
    gridWidthHeightRatio: null, // this will be calculated on 
    usableGridFraction: .99,
    gridLineSpacing: null, // this will be calculated on initialization

    gridHorzCenter: null,
    gridVertCenter: null,

    currentShape: null,
    currentShapeSelection: null,
    isResizing: false,
    //cursorPerimeter: 4
    resizeAreaWidth: 4,

    heightInput: null,
    heightLabel: null,
    widthInput: null,
    widthLabel: null,
    diameterInput: null,
    diameterLabel: null
};

vectorEditor.svgOwnerDocument = null;
vectorEditor.svg;
vectorEditor.lineSpacing = 10;


vectorEditor.rectangleEdges = { left: "left", top: "top", right: "right", bottom: "bottom"};
vectorEditor.currentEdge = null;
vectorEditor.currentDimension = null;


vectorEditor.init = function(svg, height, width){
    self = this;
	if ( self.svgOwnerDocument == null )
        self.svgOwnerDocument = svg.ownerDocument;
    
    console.log(this.svgOwnerDocument);
    
    self.svg = svg;
    self.svgPositionInfo = svg.getBoundingClientRect();

    // finish setting up the grid variables
    self.gridWidthHeightRatio = self.gridVertLinesDefault/self.gridHorzLinesDefault;         
    self.gridWidth = self.svgPositionInfo.width - self.shapeBoxWidth;
    self.widthLimit = self.usableGridFraction * self.gridWidth;
    self.gridHeight = Math.round(self.gridWidth/self.gridWidthHeightRatio);
    self.heightLimit = self.usableGridFraction * self.gridHeight;
    self.gridLineSpacing = self.gridWidth/self.gridVertLinesDefault;  // this should be the same for both vert and horz lines
    
    // recalculate grid height
    self.toolBoxHeight = self.svgPositionInfo.height - self.gridHeight; 

    console.log("self.shapeBoxHeight: " + self.shapeBoxHeight);
    console.log("self.svgPosition.height: " + self.svgPositionInfo.height);
    if (self.shapeBoxWidth > self.svgPositionInfo.width) {
        window.alert("Shape Box width exceeds the width of the svg element!");
    }
    else if (self.shapeBoxHeight > self.svgPositionInfo.height) {
        window.alert("Shape Box height is exceeds the the height of the SVG element!");
    }
    else if ((self.shapeBoxWidth + self.toolBoxWidth) > self.svgPositionInfo.width) {
        window.alert("Shape Box width plus the tool box width exceeds the width of the svg element!");
    }
    else if ((self.shapeBoxWidth + self.toolBoxWidth) < self.svgPositionInfo.width) {
        window.alert("Shape Box width plus the tool box width is less than the width of the svg element!");
    }
    else if ((self.shapeBoxWidth +  self.gridWidth) > self.svgPositionInfo.width) {
        window.alert("Shape Box width plus the grid width exceeds the width of the svg element!");   
    }
    else if ((self.shapeBoxWidth +  self.gridWidth) < self.svgPositionInfo.width) {
        window.alert("Shape Box width plus the grid width is less than the width of the svg element!");   
    }
    else if ((self.toolBoxHeight + self.gridHeight) > self.svgPositionInfo.height) {
        window.alert("Tool box height plus the grid height exceeds the height of the svg element!");      
    }
    else if ((self.toolBoxHeight + self.gridHeight) < self.svgPositionInfo.height) {
        window.alert("Tool box height plus the grid height is less than the height of the svg element!");      
    }


    self.drawShapeBox();    
    self.drawToolBox();     
    self.drawGrid();    

};


vectorEditor.drawShapeBox = function(){
    var self = this; // it won't know what 'this' is otherwise
    
    // this is the rectangle where the shapes go
    self.shapeBox = self.makeRectangle(0, 0, this.shapeBoxWidth, this.shapeBoxHeight, "none", "black", "id1", null);


    var textBox = this.svgOwnerDocument.createElementNS(svgns, "text");
    textBox.setAttributeNS(null, "fill", "blue");    
    textBox.setAttributeNS(null, "x", "10");
    textBox.setAttributeNS(null, "y", "15");
    textBox.setAttributeNS(null, "width", "30");
    var textNode = document.createTextNode('Select a');
    textBox.appendChild(textNode);    

    var textBox2 = this.svgOwnerDocument.createElementNS(svgns, "text");
    textBox2.setAttributeNS(null, "fill", "blue");    
    textBox2.setAttributeNS(null, "x", "10");
    textBox2.setAttributeNS(null, "y", "45");
    textBox2.setAttributeNS(null, "width", "30");    
    var textNode2 = document.createTextNode("shape");
    textBox2.appendChild(textNode2);    

    var textBox3 = this.svgOwnerDocument.createElementNS(svgns, "text");
    textBox3.setAttributeNS(null, "fill", "blue");    
    textBox3.setAttributeNS(null, "x", "10");
    textBox3.setAttributeNS(null, "y", "75");
    textBox3.setAttributeNS(null, "width", "30");    
    var textNode3 = document.createTextNode("below:");
    textBox3.appendChild(textNode3);    

    this.svg.appendChild(textBox);
    this.svg.appendChild(textBox2);
    this.svg.appendChild(textBox3);

    
    //These are the items that the user will select from 
    //draw square
    var item = new EventHandlingItem("click", function(e){ ve.drawShapeOnGrid(e.target);});
    this.makeSquare(15, 85, 40, "none", "blue", "square", new Array(item));
    // draw rectangle
    item = new EventHandlingItem("click", function(e){ ve.drawShapeOnGrid(e.target);});
    this.makeRectangle(5, 140, 60, 40, "none", "blue", "rectangle", new Array(item));
    // draw circle
    item = new EventHandlingItem("click", function(e){ ve.drawShapeOnGrid(e.target);});
    this.makeCircle(35, 210, 20, "none", "blue", "circle", new Array(item));
 

};

vectorEditor.drawToolBox = function(){
    //this.toolBoxHeight = this.svgPositionInfo.height * this.toolBoxHeightPortion;
    this.toolBox = this.makeRectangle(this.shapeBoxWidth, 0, this.toolBoxWidth, this.toolBoxHeight, "none", "blue", "ToolBoxRectangle", null);
    this.createCoordinateInputs();
};

vectorEditor.createCoordinateInputs = function() {    
    var self = this;

    var foreignObject = this.svgOwnerDocument.createElementNS(svgns, "foreignObject");
    foreignObject.setAttributeNS(null,'x', '150');
    foreignObject.setAttributeNS(null,'y', '5');
    foreignObject.setAttributeNS(null,'width', '500');
    foreignObject.setAttributeNS(null,'height', '30');
    var widthInput;
    var heightInput;      
    vectorEditor.widthInput = widthInput;
    vectorEditor.heightInput = heightInput;    

    var widthLabel = self.widthLabel  = self.diameterLabel = this.svgOwnerDocument.createElement("label");
    widthLabel.setAttribute("for", "widthInput");    
    widthLabel.setAttribute("id", "widthLabel");
    widthLabel.innerText = "Width (in):";

   
    widthInput = vectorEditor.widthInput =  self.diameterInput = this.svgOwnerDocument.createElement("input");
    widthInput.setAttribute("type", "text");
    widthInput.setAttribute("id", "widthInput");
    widthInput.style.align = "right";
    widthInput.setAttribute("disabled", "true");
    widthInput.className = "coord";  

    var heightLabel = self.heightLabel = this.svgOwnerDocument.createElement("label");
    heightLabel.setAttribute("for", "heightInput");    
    heightLabel.setAttribute("id", "heightLabel");
    heightLabel.innerText = "Height (in):";

    heightInput = vectorEditor.heightInput = this.svgOwnerDocument.createElement("input");
    heightInput.setAttribute("type", "text");
    heightInput.setAttribute("id", "heightInput");
    heightInput.style.align = "right";    
    heightInput.setAttribute("disabled", "true");
    heightInput.className = "coord"; 


    widthInput = new CoordInput(widthInput, "width", self.gridLineSpacing, heightInput, "height");
    heightInput = new CoordInput(heightInput, "height", self.gridLineSpacing, widthInput, "width");

    foreignObject.appendChild(widthLabel);
    foreignObject.appendChild(widthInput); 
    foreignObject.appendChild(heightLabel);
    foreignObject.appendChild(heightInput);
    
    this.svg.appendChild(foreignObject);
}

vectorEditor.drawGrid = function(){
    var self = this;
   // var lineSpacing = this.lineSpacing;
    var positionInfo = this.svgPositionInfo;
    
    var index = 0;
    var xAxis = self.gridX = this.shapeBoxWidth;   
    this.gridHorzCenter =  xAxis + ( self.gridWidth/2 );
    for (; index <= self.gridVertLinesDefault; index++) {
        var line = this.svgOwnerDocument.createElementNS(svgns, "line");
        xAxis += self.gridLineSpacing;   
        line.setAttributeNS(null, "x1", xAxis);
        line.setAttributeNS(null, "y1", this.toolBoxHeight);
        line.setAttributeNS(null, "x2", xAxis);
        line.setAttributeNS(null, "y2", this.toolBoxHeight + this.gridHeight);
        line.setAttributeNS(null, "stroke", "aqua");
        line.setAttributeNS(null, "stroke-width", "1");
        line.setAttributeNS(null, "shape-rendering","crispEdges");
        this.svg.appendChild(line);
    }
       
    
    index = 0;
    var yAxis = self.gridY = this.toolBoxHeight;    
    this.gridVertCenter = yAxis + ( self.gridHeight/2 );
    for (; index <= self.gridVertLinesDefault; index++) {
        var line = this.svgOwnerDocument.createElementNS(svgns, "line");        
        yAxis += self.gridLineSpacing;
        line.setAttributeNS(null, "x1", this.shapeBoxWidth);
        line.setAttributeNS(null, "y1", yAxis);
        line.setAttributeNS(null, "x2", positionInfo.width);
        line.setAttributeNS(null, "y2", yAxis);
        line.setAttributeNS(null, "stroke", "aqua");
        line.setAttributeNS(null, "stroke-width", "1");
        line.setAttributeNS(null, "shape-rendering","crispEdges");
        svg.appendChild(line);
    }
  

    this.grid = this.makeRectangle(self.gridX, self.gridY, self.gridWidth, self.gridHeight, "none", "black", "DrawingAreaRectangle", null);    

    // as soon as we leave the bounds of the grid, the resizing must stop
    this.grid.onblur = function() {
        self.isResizing = false;
    };

};

vectorEditor.makeShape = function (shape, id, eventFunctionDictionary, isEditable) {      
    ve = this;

    // this is necessary for this to work in Firefox 
    shape.setAttributeNS(null, "pointer-events", "all");
    if (id != null) {
        shape.setAttributeNS(null, "id", id);
    } 
    else if (isEditable === true) {
        shape.setAttributeNS(null, "id", "shapeBeingEdited");
    }
   
    if (eventFunctionDictionary !== null) {
        var count = eventFunctionDictionary.length;
        for (var index = 0; index < count; index++) {      
            shape.addEventListener(eventFunctionDictionary[index].eventName, eventFunctionDictionary[index].eventHandler);            
        }
    };

    if (isEditable === true) {
        ve.initEditableShape(shape, ve);
    }
    
    this.svg.appendChild(shape);

};

// Specific shapes

vectorEditor.makeCircle = function(cx, cy, r, fill, stroke, id, eventHandlingItems) { 
    var isEditableShape = false;

    // create the default circle
    if (cx == undefined) {
        isEditableShape = true;
        cx = this.gridHorzCenter;
        cy = this.gridVertCenter;
        r = Math.round(this.gridWidth * .25);
        fill = "none";
        stroke = "black";
        id = null;
        eventHandlingItems = null;                      
    }
    var shape = this.svgOwnerDocument.createElementNS(svgns, "circle");
    shape.setAttributeNS(null, "cx", cx);
    shape.setAttributeNS(null, "cy", cy);
    shape.setAttributeNS(null, "r",  r);
    shape.setAttributeNS(null, "stroke", stroke);
    shape.setAttributeNS(null, "fill", fill);
    shape.setAttributeNS(null, "class", "circle")

    this.makeShape(shape, id, eventHandlingItems, isEditableShape);    
    
    return shape;
};

vectorEditor.makeRectangle = function(x, y, width, height, fill, stroke, id, eventHandlingItems) {    
    var isEditableShape = false;   

    if (x == undefined) {
        isEditableShape = true;
        width = Math.round( this.gridWidth * .5 );
        height = Math.round(this.gridHeight * .5);
        x = Math.round(this.gridHorzCenter - (width / 2));
        y = Math.round(this.gridVertCenter - (height / 2));
        fill = "none";
        stroke = "black";
        id = null;
        eventHandlingItems = null;              
    }

    var shape = this.svgOwnerDocument.createElementNS(svgns, "rect");
    shape.setAttributeNS(null, "x", x);
    shape.setAttributeNS(null, "y", y);
    shape.setAttributeNS(null, "width", width);
    shape.setAttributeNS(null, "height", height);       
    shape.setAttributeNS(null, "fill", fill);
    shape.setAttributeNS(null, "stroke", stroke);    
    shape.setAttributeNS(null, "class", "rectangle")

    this.makeShape(shape, id, eventHandlingItems, isEditableShape);
        
    return shape;
};

vectorEditor.makeSquare = function(x, y, length, fill, stroke, id, eventHandlingItems) {    
    var isEditableShape = false;
    
    // create the default square
    if (x == undefined) {
        isEditableShape = true;
        length = Math.round( this.gridWidth * .5 );
        x = Math.round(this.gridHorzCenter - (length / 2));
        y = Math.round(this.gridVertCenter - (length / 2));
        fill = "none";
        stroke = "black";
        id = null;
        eventHandlingItems = null;      
    }

    var shape = this.svgOwnerDocument.createElementNS(svgns, "rect");
    shape.setAttributeNS(null, "x", x);
    shape.setAttributeNS(null, "y", y);
    shape.setAttributeNS(null, "width", length);
    shape.setAttributeNS(null, "height", length);       
    shape.setAttributeNS(null, "fill", fill);
    shape.setAttributeNS(null, "stroke", stroke);
    shape.setAttributeNS(null, "class", "square")
        
    this.makeShape(shape, id, eventHandlingItems, isEditableShape);    

    return shape;
};

// end specific shapes

vectorEditor.drawShapeOnGrid = function(menuShape){ 
    var self = this;
    // construct the functionName from id
    var funcName = 'make' + menuShape.id.slice(0,1).toUpperCase() + menuShape.id.slice(1);
    for (var prop in this) {       

        if (prop == funcName) {            
            console.log(prop + ": " + this[prop]);    
            var shapeCreated = this[prop]();
          
            if (this.currentShapeSelection !== null) {
                this.currentShapeSelection.setAttributeNS(null, "fill", "none");                                                 
            }
            menuShape.setAttributeNS(null, "fill", "yellow");            
            this.currentShapeSelection = menuShape;               

            self.setCurrentShape(shapeCreated);
        }
    }    
};

vectorEditor.setCurrentShape = function(shape) {
    var self = this;

    if (self.currentShape !== null) {
        self.currentShape.remove();
    }
    self.currentShape = shape; 

    console.log("is this a circle?: " + shape.getAttributeNS(null, "class"));
    if (shape.getAttributeNS(null, "class") === "circle") {
        self.setInputControlsForCircle(shape);
        return;
    }

    self.widthLabel.innerText = "Width (in)";
    self.widthInput.dimension = "width";    
    self.heightInput.removeAttribute("hidden");    
    self.heightLabel.removeAttribute("hidden");    

    // set the input controls
    self.heightInput.setCurrentShape(shape);                        
    self.widthInput.setCurrentShape(shape);

    if (shape === null) {
        self.heightInput.setAttribute("disabled", "true");
        self.widthInput.setAttribute("disabled", "true");
    }
    else {
            self.heightInput.removeAttribute("disabled");
            self.widthInput.removeAttribute("disabled");   
    }
}

vectorEditor.setInputControlsForCircle = function(shape) {
    var self = this;

    self.widthInput.removeAttribute("disabled");
    self.widthInput.setDimension("radius");      
    self.widthLabel.innerText = "Diameter (in)";
    self.heightInput.setAttribute("hidden", true);    
    self.heightLabel.setAttribute("hidden", true); 

console.log("diameterInput dim: " + self.widthInput.dimension);
    // widthInput == diameterInput
    console.log("self:" + self);    
    self.widthInput.setDiameterInputCurrentShape(shape);
    console.log("diameterInput dim2: " + self.widthInput.dimension);

}

vectorEditor.handleMouseMove = function(event, ve) {    
    var element = ve.currentShape;
   
    var coords;
    if (element.tagName === 'rect') {
    // these are the coordinates for the object
        coords = {left: element.x.baseVal.value, top: element.y.baseVal.value, right: element.x.baseVal.value + element.width.baseVal.value, 
        bottom: element.y.baseVal.value + element.height.baseVal.value};
    }
    else if (element.tagName === 'circle') {
        coords = {cx: element.cx.baseVal.value, cy: element.cy.baseVal.value, r: element.r.baseVal.value};
    }

    // we need a translate function, and sensitivity variable for the cursor changing field
    // these are the coordinates for the mouse event    
    var translatedMousePoint = ve.translate({ x: event.clientX, y: event.clientY});

    ve.setCursorOnMouseMove(element, translatedMousePoint, coords, ve.resizeAreaWidth);  

};



vectorEditor.translate = function(point){    
    var newPoint = { x: point.x - this.svgPositionInfo.x, y: point.y - this.svgPositionInfo.y};
    return newPoint;
};

/* functions for resizability */
// this only works for rectangles and squares
vectorEditor.isCursorOverLine = function(mousePos, linePos, resizeAreaWidth){    
    if ( (mousePos >= linePos - resizeAreaWidth) && (mousePos <= linePos + resizeAreaWidth)){
       return true;
    }
    else {
        return false;
    }
};

vectorEditor.haveExceededBounds = function(mousePoint, coords) {
    var self = this;
    if ( (mousePoint.x <= self.gridX) || (mousePoint.x >= self.gridWidth)) {
        console.log("Bounds exceeded!");
        return true;
    }
    else {
        return false;
    }
}


vectorEditor.isCursorOverCircle = function(mousePosX, mousePosY, cx, cy, r) {
    var self = this;
    var distanceFromCenter =  vectorEditor.calculateDistanceFromCenter(mousePosX, mousePosY, cx, cy);
    console.log("dist: " + distanceFromCenter);
    if ( (distanceFromCenter <= (r + self.resizeAreaWidth)) && (distanceFromCenter >= (r - self.resizeAreaWidth)) ) {
        return true;
    }
    else {
        return false;
    }
}

vectorEditor.calculateDistanceFromCenter = function(mousePosX, mousePosY, cx, cy) {
    return Math.sqrt(Math.pow(mousePosX - cx, 2) + Math.pow(mousePosY - cy, 2));
}



vectorEditor.setCursorOnMouseMove = function(element, mousePoint, coords, resizeAreaWidth){
    var shapeName = element.tagName;


    // squares and rectangles
    // check the left line first
    switch (shapeName){
    case "rect":
        /*if (this.haveExceededBounds(mousePoint, coords) == true) {  // this is not quite the same as the onblur for the main rectangle
            vectorEditor.isResizing = false;
            element.style.cursor = "auto";
            element.mouseIsDown = false;
            return;
        }*/
        if (this.isCursorOverLine(mousePoint.x, coords.left, resizeAreaWidth) === true) {               
            console.log('***isCursorOverLine: ' + mousePoint.x + ' ' + coords.left);         
            element.style.cursor = "ew-resize";
            if (element.mouseIsDown === true) {
                vectorEditor.isResizing = true;      
                vectorEditor.currentEdge = vectorEditor.rectangleEdges.left;             
                vectorEditor.currentDimension = "width";
            }
            else {
                vectorEditor.isResizing = false;
            }  
        }   
        else if (this.isCursorOverLine(mousePoint.x, coords.right, resizeAreaWidth) === true) {            
            element.style.cursor = "ew-resize";
            if (element.mouseIsDown === true) {
                vectorEditor.isResizing = true;                                
                vectorEditor.currentEdge = vectorEditor.rectangleEdges.right;             
                vectorEditor.currentDimension = "width";
            }
            else {
                vectorEditor.isResizing = false;
            }
        }
        else if (this.isCursorOverLine(mousePoint.y, coords.top, resizeAreaWidth) === true) {                      
            element.style.cursor = "ns-resize"; 
            if (element.mouseIsDown === true) {
                vectorEditor.isResizing = true;
                vectorEditor.currentEdge = vectorEditor.rectangleEdges.top;             
                vectorEditor.currentDimension = "height";
            }
            else {
                vectorEditor.isResizing = false;
            }
        }
        else if (this.isCursorOverLine(mousePoint.y, coords.bottom, resizeAreaWidth) === true) {
            element.style.cursor = "ns-resize"; 
            if (element.mouseIsDown === true) {
                vectorEditor.isResizing = true;
                vectorEditor.currentEdge = vectorEditor.rectangleEdges.bottom;             
                vectorEditor.currentDimension = "height";
            }
            else {
                vectorEditor.isResizing = false;
            }   
        }
        else {          
                element.style.cursor = "auto";
        }
        break;        
        case "circle":
        if (this.isCursorOverCircle(mousePoint.x, mousePoint.y, coords.cx, coords.cy, coords.r) === true) {      
           if (Math.abs(mousePoint.x - coords.cx)  > Math.abs(mousePoint.y - coords.cy)) {                
                element.style.cursor = "ew-resize"; 
                if (element.mouseIsDown) {
                    vectorEditor.isResizing = true;
                    vectorEditor.currentDimension = "radius";
                }           
                else {
                    vectorEditor.isResizing = false;
                }
            }
            else {
                element.style.cursor = "ns-resize"; 
                if (element.mouseIsDown) {
                    vectorEditor.isResizing = true;
                    vectorEditor.currentDimension = "radius";
                }                   
                else {
                    vectorEditor.isResizing = false;
                }
            }
        }
        else {          
                element.style.cursor = "auto";
        }
        break;
        default:
    }
    
    if (shapeName === 'circle') {
        if (vectorEditor.isResizing){
            var distance = vectorEditor.calculateDistanceFromCenter(mousePoint.x, mousePoint.y, coords.cx, coords.cy);
            if ((distance*2) > vectorEditor.heightLimit) {                
                console.log("The radius exceeds the maximum area available!");              
                distance = vectorEditor.heightLimit/2;                
                vectorEditor.isResizing = false;
            }
            else {                  
                element.setAttributeNS(null, "r", distance);
            }                                       
            vectorEditor.diameterInput.setDiameterInputNormalizedValue(distance);
        }
    }
    else {
        switch (vectorEditor.currentEdge)
        {
            case "left":         
            if (vectorEditor.isResizing === true) {
                var curX = element.getAttributeNS(null, "x");
                var curWidth = element.getAttributeNS(null, "width");
                var newWidth = curWidth - (mousePoint.x - curX);
                if (newWidth > vectorEditor.widthLimit) {          // ALSO NEED TO CHECK FOR THE BOUNDARY
                    console.log("Width limit exceeded");
                    newWidth = vectorEditor.widthLimit;
                }                
                element.setAttributeNS(null, "x", mousePoint.x);           
                element.setAttributeNS(null, "width", newWidth);      
                vectorEditor.widthInput.setNormalizedValue(newWidth);
                if (element.className.baseVal === "square") {
                    element.setAttributeNS(null, "height", newWidth); // yes we are setting height to width, because this is a square
                    vectorEditor.heightInput.setNormalizedValue(newWidth);
                }
            }
            break;
            case "right":
            if (vectorEditor.isResizing === true) {
                var x = element.getAttributeNS(null, "x");
                var newWidth = mousePoint.x - x;
                element.setAttributeNS(null, "width", newWidth);                  
                vectorEditor.widthInput.setNormalizedValue(newWidth);
                if (element.className.baseVal === "square") {
                    element.setAttributeNS(null, "height", newWidth); // yes we are setting height to width, because this is a square
                    vectorEditor.heightInput.setNormalizedValue(newWidth);
                }
            }
            break;
            case "top":
            if (vectorEditor.isResizing === true) {
                var curY = element.getAttributeNS(null, "y");
                var curHeight = element.getAttributeNS(null, "height");
                var newHeight = curHeight - (mousePoint.y - curY);
                element.setAttributeNS(null, "y", mousePoint.y);           
                element.setAttributeNS(null, "height", newHeight);                
                vectorEditor.heightInput.setNormalizedValue(newHeight);
                if (element.className.baseVal === "square") {
                    element.setAttributeNS(null, "width", newHeight); // yes we are setting height to width, because this is a square
                    vectorEditor.widthInput.setNormalizedValue(newHeight);
                }
            }
            break;
            case "bottom":
            if (vectorEditor.isResizing === true) {
                var y = element.getAttributeNS(null, "y");
                var newHeight = mousePoint.y - y;
                element.setAttributeNS(null, "height", newHeight);                   
                vectorEditor.heightInput.setNormalizedValue(newHeight);
                if (element.className.baseVal === "square") {
                    element.setAttributeNS(null, "width", newHeight); // yes we are setting height to width, because this is a square
                    vectorEditor.widthInput.setNormalizedValue(newHeight);
                }
            }
            break;
            default:
            ;
        }
    }

}

/* end functions for resizability */


/*  THESE FUNCTIONS SHOULD PROBABLY BE MEMBERS OF THE EDITABLE SHAPE ITSELF */
vectorEditor.initEditableShape = function (shape, ve){    
    console.log("init editable shape");
    shape.mouseIsDown = false;            
    shape.mouseIsMovingTimout = null;
    shape.centerTimer  = null;

    ve.grid.addEventListener("mousemove", function(event){
        ve.handleMouseMove(event, ve);
    },false);
    shape.addEventListener("mousemove", function(event){
       ve.handleMouseMove(event, ve);
    }, false);    

    shape.addEventListener("mousedown", function(event){
        if (self.centerTimer !== null) {
            clearTimeout(self.centerTimer);
            self.centerTimer = null;
        }
        shape.mouseIsDown = true;    
        return false;    
    }, false);

    ve.grid.addEventListener("mousedown", function(event){
        if (self.centerTimer !== null) {
            clearTimeout(self.centerTimer);
            self.centerTimer = null;
        }
        shape.mouseIsDown = true;        
       // ve.svgOwnerDocument.getElementById("dvTest").innerText = "mouse is down, from grid";     
        return false;
    }, false);

    shape.addEventListener("mouseup", function(event){
        shape.mouseIsDown = false;   
        /*** This should not be necessary for squares and circles ***/        
        if (vectorEditor.isResizing === true) {
            self.centerTimer = setTimeout(function(){          
                if (shape.className.baseVal === "square") { 
                    shape.center("2d");   
                }
                else if (shape.className.baseVal === "circle") { 
                    shape.center("radius");
                }
                else {                    
                    shape.center(vectorEditor.currentDimension);
                }
            }, 1500);
        }     
        console.log("shape.addEventListener,shape.mouseIsDown: " + shape.mouseIsDown); 

    }, false);

    ve.grid.addEventListener("mouseup", function(event){
        shape.mouseIsDown = false;   
        if (vectorEditor.isResizing === true) {
            self.centerTimer = setTimeout(function(){          
                if (shape.className.baseVal !== "square") { 
                    shape.center(vectorEditor.currentDimension);
                }                
                else if (shape.className.baseVal === "circle") { 
                    shape.center("radius");
                }                
                else {
                    shape.center("2d");   
                }
            }, 1500);
        }
        console.log("ve.grid.addEventListener,shape.mouseIsDown: " + shape.mouseIsDown);
    }, false);

    ve.svg.addEventListener("mouseup", function(event) {
        console.log("ve.svg.addEventListener:  mouseup");
        shape.mouseIsDown = false;          
        if (vectorEditor.isResizing === true) {
            self.centerTimer = setTimeout(function(){          
                if (shape.className.baseVal !== "square") { 
                    shape.center(vectorEditor.currentDimension);
                }                
                else if (shape.className.baseVal === "circle") { 
                    shape.center("radius");
                }                
                else {
                    shape.center("2d");   
                }
            }, 1500);
        }
        vectorEditor.isResizing = false;
    }, false);

    shape.center = function(dimension) {      
        switch (dimension)
        {
            case "width":
            {
                var x = self.gridHorzCenter - shape.getAttributeNS(null,"width")/2;
                shape.setAttributeNS(null, "x", x);    
            }        
            break;
            case "height":
            {
                var y = self.gridVertCenter - shape.getAttributeNS(null,"height")/2;
                shape.setAttributeNS(null, "y", y);              
            }
            break;
            case "2d":
            {
                var x = self.gridHorzCenter - shape.getAttributeNS(null,"width")/2;
                var y = self.gridVertCenter - shape.getAttributeNS(null,"height")/2;                
                shape.setAttributeNS(null, "x", x);    
                shape.setAttributeNS(null, "y", y);              
            }
            break;
            case "radius":
            {
                // DO WE NEED TO DO ANYTHING HERE?
            }
            break;
            default:
                ;
            }
        }
   
    shape.resizeInCenter = function(dimension, value) {      
        console.log("Resize called: " + dimension);
        switch (dimension)
        {
            case "width":
            {
                var x = self.gridHorzCenter - value/2;
                shape.setAttributeNS(null, "x", x);              
                shape.setAttributeNS(null, "width", value);              
            }        
            break;
            case "height":
            {
                var y = self.gridVertCenter - value/2;
                shape.setAttributeNS(null, "y", y);              
                shape.setAttributeNS(null, "height", value);              
            }
            break;
            case "radius":
            {
                shape.setAttributeNS(null, "r", value/2);              
            }
            break;
            default:
                ;
            }
        }
    shape.ondragstart = function () { return false; };
}

vectorEditor.exportSVG = function() {
  var shapeBeingEdited =  vectorEditor.currentShape;// document.getElementById('shapeBeingEdited');
  var clonedShapeBeingEdited  = shapeBeingEdited.cloneNode(true);
  clonedShapeBeingEdited.setAttributeNS(null, "x", "3in");
  clonedShapeBeingEdited.setAttributeNS(null, "y", "3in");  
  var normalizedWidth = clonedShapeBeingEdited.getAttributeNS(null, "width") / self.gridLineSpacing;  
  var normalizedHeight = clonedShapeBeingEdited.getAttributeNS(null, "height") / self.gridLineSpacing;;      
  console.log("Normalized width: " + normalizedWidth);
  console.log("Normalized height: " + normalizedHeight);
  clonedShapeBeingEdited.setAttributeNS(null, "width", normalizedWidth + "in");
  clonedShapeBeingEdited.setAttributeNS(null, "height", normalizedHeight + "in");


// TOKNOW: WHY ONT JUST CLONE THE CURRENT SVG DOC?
    // create and configure svg element
  var svg = document.createElement('svg');
  svg.setAttribute("width", "32in");    // eventually this will be the size of the laser bed
  svg.setAttribute("height", "20in"); // eventually this will be the size of the laser bed
  
  svg.appendChild(clonedShapeBeingEdited);

  // first create a clone of our svg node so we don't mess the original one
  var clone = svg.cloneNode(true);
  // parse the styles
  vectorEditor.parseStyles(clone);

  // create a doctype
  var svgDocType = document.implementation.createDocumentType('svg', "-//W3C//DTD SVG 1.1//EN", "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd");
  // a fresh svg document
  var svgDoc = document.implementation.createDocument('http://www.w3.org/2000/svg', 'svg', svgDocType);
  // replace the documentElement with our clone 
  svgDoc.replaceChild(clone, svgDoc.documentElement);
  // get the data
  var svgData = (new XMLSerializer()).serializeToString(svgDoc);

  var dataURI = 'data:image/svg+xml; charset=utf8, ' + encodeURIComponent(svgData.replace(/></g, '>\n\r<'));
  var blob = vectorEditor.dataURItoBlob(dataURI);
  blobOuter = blob;
  console.log("blob: " + blob);
  vectorEditor.uploadFile(blob);  // upload the file to the server
  return;
  // now you've got your svg data, the following will depend on how you want to download it
  // e.g yo could make a Blob of it for FileSaver.js
  /*
  var blob = new Blob([svgData.replace(/></g, '>\n\r<')]);
  saveAs(blob, 'myAwesomeSVG.svg');
  */
  // here I'll just make a simple a with download attribute

  /*** THIS IS NOT WHAT WE WANT TO DO ***/
  /*
  var a = document.createElement('a');
  a.href = 'data:image/svg+xml; charset=utf8, ' + encodeURIComponent(svgData.replace(/></g, '>\n\r<'));
  a.download = 'myAwesomeSVG.svg';
  a.innerHTML = 'download the svg file';
  document.body.appendChild(a);
    */
  /*** THIS IS NOT WHAT WE WANT TO DO ***/

};

vectorEditor.dataURItoBlob = function(dataURI) {
            // convert base64/URLEncoded data component to raw binary data held in a string
  var byteString;
  if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1]);
  else
      byteString = unescape(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to a typed array
  var ia = new Uint8Array(byteString.length);
  for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], { type: mimeString });
}

var blobOuter = null;


vectorEditor.uploadFile = function(file){
  var url = './sendfile.php';
  var xhr = new XMLHttpRequest();
  var fd = new FormData();

  xhr.open("POST", "/PanelTags/UploadSVG", true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
    // Every thing ok, file uploaded
      console.log(xhr.responseText); // handle response.
    }
  };
  
  fd.append("SVGFile", file);
  // THis is not used anywhere, curious how to get TO THIS DATA
  fd.append("fname", "shape.svg");
  xhr.send(fd);
}


vectorEditor.parseStyles = function(svg) {
  var styleSheets = [];
  var i;
  // get the stylesheets of the document (ownerDocument in case svg is in <iframe> or <object>)
  var docStyles = svg.ownerDocument.styleSheets;

  // transform the live StyleSheetList to an array to avoid endless loop
  for (i = 0; i < docStyles.length; i++) {
    styleSheets.push(docStyles[i]);
  }

  if (!styleSheets.length) {
    return;
  }

  var defs = svg.querySelector('defs') || document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  if (!defs.parentNode) {
    svg.insertBefore(defs, svg.firstElementChild);
  }
  svg.matches = svg.matches || svg.webkitMatchesSelector || svg.mozMatchesSelector || svg.msMatchesSelector || svg.oMatchesSelector;


  // iterate through all document's stylesheets
  for (i = 0; i < styleSheets.length; i++) {
    var currentStyle = styleSheets[i]

    var rules;
    try {
      rules = currentStyle.cssRules;
    } catch (e) {
      continue;
    }
    // create a new style element
    var style = document.createElement('style');
    // some stylesheets can't be accessed and will throw a security error
    var l = rules && rules.length;
    // iterate through each cssRules of this stylesheet
    for (var j = 0; j < l; j++) {
      // get the selector of this cssRules
      var selector = rules[j].selectorText;
      // probably an external stylesheet we can't access
      if (!selector) {
        continue;
      }

      // is it our svg node or one of its children ?
      if ((svg.matches && svg.matches(selector)) || svg.querySelector(selector)) {

        var cssText = rules[j].cssText;
        // append it to our <style> node
        style.innerHTML += cssText + '\n';
      }
    }
    // if we got some rules
    if (style.innerHTML) {
      // append the style node to the clone's defs
      defs.appendChild(style);
    }
  }

};

/*vectorEditor.checkIfCentered
gridHorzCenter.
only after mouseup and when typing in coordinates*/
