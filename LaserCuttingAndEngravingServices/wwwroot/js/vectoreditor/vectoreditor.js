
(function (global) {
    var svgns = "http://www.w3.org/2000/svg";

    // VectorEditor constructor
    function VectorEditor() {
        var length;
        var width;
        var svg;
        var svgOwnerDocument;
        var currentShape;
        var currentText = null;
        var rectWidth;
        var rectHeight;
    };

    //#region Methods
    VectorEditor.prototype.createRectangle = function (x, y, width, height, fill, stroke) {
        var self = this;

        self.svg.setAttributeNS(null, "width", width);

        console.log("The height: " + self.svg.getAttributeNS(null, "height"));
        self.svg.setAttributeNS(null, "height", height);
        self.rectWidth = width;
        self.rectHeight = height;

        // remove any existing rectangle
        self.removeRectangle();

        var shape = this.svgOwnerDocument.createElementNS(svgns, "rect");
        shape.setAttributeNS(null, "x", x);
        shape.setAttributeNS(null, "y", y);
        shape.setAttributeNS(null, "width", width);
        shape.setAttributeNS(null, "height", height);
        shape.setAttributeNS(null, "fill", fill);
        shape.setAttributeNS(null, "stroke", stroke);
        shape.setAttributeNS(null, "class", "rectangle") 

        shape.setAttribute("id", "rect");
        self.svg.appendChild(shape);

        var text = this.svgOwnerDocument.createElementNS(svgns, "text");
        text.setAttributeNS(null, "x", x+30);
        text.setAttributeNS(null, "y", y + 30);
        //text.addEventListener("mousemove", function () { window.alert("mousemove"); });
        //text.setAttribute("width", "150");
        //text.setAttribute("height", "75"); 
        //text.setAttribute("textLength", "200px");
        text.setAttribute("font-size", "18px");
        text.setAttribute("font-family", "Courier New");
        text.setAttribute("fill", "green");
        text.textContent = "(place holder)";
        text.style.zIndex = 10;
        self.svg.appendChild(text);

        console.log(text);
        self.currentShape = shape;
        self.currentText = text;
    }

    VectorEditor.prototype.removeRectangle = function () {
        var self = this;
        if (self.currentShape != null) {
            console.log("pre remove child");
            self.svg.removeChild(self.currentShape);
            self.currentShape = null;
        }
    }

    //#region textbox methods

    VectorEditor.prototype.createTextBox = function (id, textEdit, svgDiv) {
        var self = this;
        var pos = self.getPreviousTextEditPos(id); 
        pos.left += 35;
        pos.top += 35;
        console.log(pos);

        $(textEdit).parent().css({ position: 'relative' });
        $(textEdit).css({ top: pos.top, left: pos.left, position: 'absolute' });
        $(textEdit).attr("id", "tbdiv" + id);
        //textEdit.style.cssText = "border-style: solid; height: 75px; width: 300px;background-color: orange";
        $(svgDiv).append($(textEdit));

        var tbdivheader = $(textEdit).find("#tbdivheader");
        var editTextContainer = $(textEdit).find("#editTextContainer");
        console.log("tbdivheader ");
        console.log(tbdivheader);
        $(tbdivheader).attr("id", "tbdiv" + id + "header");
        $(editTextContainer).attr("id", "editTextContainer" + id);
        
        console.log(tbdivheader);

        /*textEdit[0].dragElement = new */dragElement(textEdit[0], svgDiv[0], editTextContainer[0]);
        //textEdit[0].dragElement(textEdit[0]);

        //svgDiv.appendChild(textEdit);


        return;
        var text = this.svgOwnerDocument.createElementNS(svgns, "text");
        text.setAttributeNS(null, "x", 30);
        text.setAttributeNS(null, "y", 90);
        //text.addEventListener("mousemove", function () { window.alert("mousemove"); });
        //text.setAttribute("width", "150");
        //text.setAttribute("height", "75"); 
        //text.setAttribute("textLength", "200px");
        text.setAttribute("id", id);
        text.setAttribute("font-size", "18px");
        text.setAttribute("font-family", "Courier New");
        text.setAttribute("fill", "green");
        
        text.textContent = "(new Text Box)";
        text.style.zIndex = 15;
        //textEdit.appendChild(text);
        self.svg.appendChild(text);//Edit);
       
        //self.svg.appendChild(text);

        console.log(text);
    }

    VectorEditor.prototype.getPreviousTextEditPos = function (id) {
        var left = parseInt($("#" + "tbdiv" + (id - 1)).css("left"));
        if (!left) {
            left = 0;
        }
        console.log("left");
        console.log(left);

        var top = parseInt($("#" + "tbdiv" + (id - 1)).css("top"));
        if (!top) {
            top = 0;
        }

        var pos = { left: left, top: top };
        return pos;
    }

    VectorEditor.prototype.setTextBoxContent = function (textContent, id) {
        var self = this;
        // was not able to get this to work with JQuery
        document.getElementById(id).textContent = textContent;
    }

    //#endregion text box methods

    VectorEditor.prototype.exportSVG = function () {
        var self = this;
        var textTool = global.document.getElementsByClassName('text-edit')[0];
        var shapeBeingEdited = self.currentShape;
        console.log("children: " + self.svg.children[1]);
        var clonedShapeBeingEdited = self.svg.cloneNode(true);/*shapeBeingEdited.cloneNode(true)*/;
        clonedShapeBeingEdited.setAttributeNS(null, "x", "3in");
        clonedShapeBeingEdited.setAttributeNS(null, "y", "3in");
        var normalizedWidth = 500;//TODO: this will be selected nameplate dims  //clonedShapeBeingEdited.getAttributeNS(null, "width") / self.gridLineSpacing;
        var normalizedHeight = 150;//TODO: this will be selected nameplate dims //clonedShapeBeingEdited.getAttributeNS(null, "height") / self.gridLineSpacing;;
        console.log("Normalized width: " + normalizedWidth);
        console.log("Normalized height: " + normalizedHeight);
        clonedShapeBeingEdited.setAttributeNS(null, "width", normalizedWidth + "px");
        clonedShapeBeingEdited.setAttributeNS(null, "height", normalizedHeight + "px");

        var svg = document.createElement('svg');
        svg.setAttribute("width", "1280px");    // eventually this will be the size of the laser bed
        svg.setAttribute("height", "800px"); // eventually this will be the size of the laser bed

        
        svg.appendChild(clonedShapeBeingEdited);

        // first create a clone of our svg node so we don't mess the original one
        var clone = svg.cloneNode(true);
        
        console.log("All Children: ");
        console.log(self.svg.children);
        // parse the styles
        self.parseStyles(clone);

        // create a doctype
        var svgDocType = document.implementation.createDocumentType('svg', "-//W3C//DTD SVG 1.1//EN", "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd");
        // a fresh svg document
        var svgDoc = document.implementation.createDocument('http://www.w3.org/2000/svg', 'svg', svgDocType);
        // replace the documentElement with our clone 
        svgDoc.replaceChild(clone, svgDoc.documentElement);
        console.log(svgDoc.children);
        // get the data
        var svgData = (new XMLSerializer()).serializeToString(svgDoc);

        var dataURI = 'data:image/svg+xml; charset=utf8, ' + encodeURIComponent(svgData.replace(/></g, '>\n\r<'));
        console.log("dataURI: " + dataURI);
        //test code to see
        //$("#svgURIDisplay").attr("src", dataURI); 
        $("#objSVGDisplay").attr("data", dataURI);

        var blob = vectorEditor.dataURItoBlob(dataURI);
        blobOuter = blob;
        console.log("blob: " + blob);
        vectorEditor.uploadFile(blob);  // upload the file to the server

        return dataURI;
    }

    VectorEditor.prototype.parseStyles = function (svg) {
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
    
    VectorEditor.prototype.dataURItoBlob = function (dataURI) {
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

    VectorEditor.prototype.uploadFile = function (file) {
        var url = './sendfile.php';
        var xhr = new XMLHttpRequest();
        var fd = new FormData();

        xhr.open("POST", "/PanelTags/UploadSVG", true);
        xhr.onreadystatechange = function () {
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

    //#endregion Methods

    global.vectorEditor = new VectorEditor();
    // sets svg to the first occurence of an svg
    var svgs = window.document.getElementsByTagName("svg");
    if (svgs) {
        global.vectorEditor.svg = svgs[0];
        global.vectorEditor.svgOwnerDocument = svgs[0].ownerDocument;
    }
    console.log(global.vectorEditor);
  
}
)(window);

function dragElement(elem, svgDiv, editTextContainer) {
    
    console.log("svgDiv");
    console.log($(svgDiv).offset());
    var parentRect = svgDiv.getBoundingClientRect();
    var editTextContainer = editTextContainer;

    console.log(elem);
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    console.log("Pos1: " + pos1 + ", Pos2 :" + pos2 + ", Pos3: " + pos3 + ", Pos4: " + pos4);
    if (document.getElementById(elem.id + "header")) {
        var header = document.getElementById(elem.id + "header");      
            header.onmousedown = dragMouseDown;
            console.log(header);
    } else {
        /* otherwise, move the DIV from anywhere inside the DIV:*/
        elem.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {      
        console.log("Dragmousedown prototype");
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        console.log("Pos3 " +  pos3);
        pos3 = e.clientX;
        pos4 = e.clientY;        
        document.addEventListener("mouseup", closeDragElement);// onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.addEventListener("mousemove", elementDrag);//onmousemove = elementDrag;
    }

    function elementDrag(e) {
        console.log("ELEMENT Drag");
        
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        var rect = editTextContainer.getBoundingClientRect();
        console.log(rect);
        if (!isWithinBounds(rect)) {
            return;
        }
        // set the element's new position:
        console.log("Top: " + elem.offsetTop);
        elem.style.top = (elem.offsetTop - pos2) + "px";
        elem.style.left = (elem.offsetLeft - pos1) + "px";
    }

    function isWithinBounds(rect) {
       /* if (
            (rect.top >= parentRect.top && rect.bottom <= parentRect.bottom) &&
            (rect.left >= parentRect.left && rect.right <= parentRect.right)
        ) {
            return true;
        }
        else*/ if (
            ((pos2 > 0) && (rect.top < parentRect.top))
            ||
            ((pos2 < 0) && (rect.bottom > parentRect.bottom))
            ||
            ((pos1 > 0) && (rect.left < parentRect.left))
            ||
            ((pos1 < 0) && (rect.right > parentRect.right))
        ) {
            console.log("Not within bounds.");
            return false;
        }
        else {
            return true;
        }
    }

    function closeDragElement() {
        console.log("Closedragelement");
        
        /* stop moving when mouse button is released:*/
        //document.onmouseup = null;
        document.removeEventListener("mouseup", closeDragElement);
        //document.onmousemove = null;
        document.removeEventListener("mousemove", elementDrag);
    }
}
/*dragElement.prototype.dragMouseDown = function (e) {
    var self = this;


    console.log("Dragmousedown prototype");
    console.log(self);
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    console.log("Pos3 " + self.pos3);
    self.pos3 = e.clientX;
    self.pos4 = e.clientY;
    
    document.addEventListener("mouseup", dragElement.prototype.closeDragElement);// onmouseup = closeDragElement;

    // call a function whenever the cursor moves:
    document.addEventListener("mousemove", dragElement.prototype.elementDrag);//onmousemove = elementDrag;
}

dragElement.prototype.elementDrag = function (e) {
    console.log("ELEMENT Drag");
    var self = this;

    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    self.pos1 = self.pos3 - e.clientX;
    self.pos2 = self.pos4 - e.clientY;
    self.pos3 = e.clientX;
    self.pos4 = e.clientY;
    
    // set the element's new position:
    self.elem.style.top = (self.elem.offsetTop - self.pos2) + "px";
    self.elem.style.left = (self.elem.offsetLeft - self.pos1) + "px";
}
*/
/*dragElement.prototype.closeDragElement = function () {
    console.log("Closedragelement");
    var self = this;*/
    /* stop moving when mouse button is released:*/
    //document.onmouseup = null;
 /*   document.removeEventListener("mouseup", dragElement.prototype.closeDragElement);
    //document.onmousemove = null;
    document.removeEventListener("mousemove", dragElement.prototype.elementDrag);
}*/