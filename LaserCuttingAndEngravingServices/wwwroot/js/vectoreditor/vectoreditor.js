
(function (global) {
    var svgns = "http://www.w3.org/2000/svg";

    // VectorEditor constructor
    function VectorEditor() {
        var length;
        var width;
        var svg;
        var svgOwnerDocument;
        var currentShape;
        var currentText;
        var rectWidth;
        var rectHeight;
    };

    //#region Methods
    VectorEditor.prototype.createRectangle = function (x, y, width, height, fill, stroke) {
        var self = this;
        self.rectWidth = width;
        self.rectHeight = height;

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
        text.setAttributeNS(null, "x", x + 25);
        text.setAttributeNS(null, "y", y + 25);
        //text.setAttribute("width", "150");
        //text.setAttribute("height", "75"); 
        //text.setAttribute("textLength", "200px");
        text.setAttribute("font-size", "18px");
        text.setAttribute("fill", "green");
        text.textContent = "(place holder)";
        
        self.svg.appendChild(text);

        console.log(text);
        self.currentShape = shape;
        self.currentText = text;
    }

    VectorEditor.prototype.exportSVG = function () {
        var self = this;
        var textTool = global.document.getElementsByClassName('text-edit')[0];
        var shapeBeingEdited = self.currentShape;
        var clonedShapeBeingEdited = self.svg.cloneNode(true);/*shapeBeingEdited.cloneNode(true)*/;
        clonedShapeBeingEdited.setAttributeNS(null, "x", "3in");
        clonedShapeBeingEdited.setAttributeNS(null, "y", "3in");
        var normalizedWidth = 4;//TODO: this will be selected nameplate dims  //clonedShapeBeingEdited.getAttributeNS(null, "width") / self.gridLineSpacing;
        var normalizedHeight = 2;//TODO: this will be selected nameplate dims //clonedShapeBeingEdited.getAttributeNS(null, "height") / self.gridLineSpacing;;
        console.log("Normalized width: " + normalizedWidth);
        console.log("Normalized height: " + normalizedHeight);
        clonedShapeBeingEdited.setAttributeNS(null, "width", normalizedWidth + "in");
        clonedShapeBeingEdited.setAttributeNS(null, "height", normalizedHeight + "in");

        var svg = document.createElement('svg');
        svg.setAttribute("width", "32in");    // eventually this will be the size of the laser bed
        svg.setAttribute("height", "20in"); // eventually this will be the size of the laser bed

        
        svg.appendChild(clonedShapeBeingEdited);

        // first create a clone of our svg node so we don't mess the original one
        var clone = svg.cloneNode(true);
        

        // parse the styles
        self.parseStyles(clone);

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
})(window);
