// SET CURSOR POSITION
$.fn.setCursorPosition = function (pos) {
    this.each(function (pos, elem) {
        if (elem.setSelectionRange) {
            elem.setSelectionRange(pos, pos);
        }
        else if (elem.createTextRange) {
            var range = elem.createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }

    });

    return this;
};


(function (global) {
    var svgns = "http://www.w3.org/2000/svg";

    // Edit States
    var EditableCreate = "EditableCreate - 0";

    var EditingNoFocus_I = "EditingNoFocus_I(1)"
    var EditingNoFocus = "EditingNoFocus(2)";

    var EditingFocusNoInput_I = "EditingFocusNoInput_I(3)";
    var EditingFocusNoInput = "EditingFocusNoInput(4)";

    var EditingFocusInput = "EditingFocusInput(5)";

    var EditingFocusInputKeyDown_I = "EditFocusInputKeyDown_I(6)";
    var EditingFocusInputKeyDown = "EditingFocusInputKeyDown(7)";
    var Editing = "Editing(8)";
    var Save = "Save(9)";
    var PromptEdit = "PromptEdit(10)";
    var PromptEditLeave = "PromptEditLeave(11)";

    // VectorEditor constructor
    function VectorEditor() {
        var length;
        var width;
        var svg = $("#dvSVGContainer");
        var svgOwnerDocument;
        var currentShape;
        var currentText = null;
        var rectWidth;
        var rectHeight;
        console.log("INIITED");

        $(svg).click(function () {
            console.log("svg click");
        });
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

  

    VectorEditor.prototype.showEditTools = function (container, show, showDisplayEditToolsButton) {
        if (show) {    
            console.log("showing edit tools");
            container.css("visibility", "visible");
            container.find(".EditTool").css("visibility", "visible");
        }
        else {                        
            container.css("visibility", "hidden");
            container.find(".EditTool").css("visibility", "hidden");
        }
        if (showDisplayEditToolsButton) {
            container.find(".DisplayEditToolsButton").css("visibility", "visible");
        }
        else {
            container.find(".DisplayEditToolsButton").css("visibility", "hidden");
        }
    }


    VectorEditor.prototype.isAtEdge = function (mousePoint, textEditJQ, rect, svgDiv, editTextContainerJQ) {
        console.log("Mouse moving");
        console.log(mousePoint);
        var moveEdgeWidth = 4;

       // var parentRect = svgDiv.getBoundingClientRect();
        if (
            (mousePoint.y < rect.top + moveEdgeWidth && mousePoint.y > rect.top - moveEdgeWidth)
            ||
            (mousePoint.y > rect.bottom - moveEdgeWidth && mousePoint.y < rect.bottom + moveEdgeWidth)
            ||
            (mousePoint.x < rect.left + moveEdgeWidth && mousePoint.x > rect.left - moveEdgeWidth)
            ||
            (mousePoint.x > rect.right - moveEdgeWidth && mousePoint.x < rect.right + moveEdgeWidth)
        ) {
            console.log("Is at edge.");
            $(textEditJQ).css("cursor", "move");
            //dragElement(textEditJQ[0], svgDiv, editTextContainerJQ[0]); 
            return false;
        }
        else {
            $(textEditJQ).css("cursor", "auto");
            return true;
        }
    }


    VectorEditor.prototype.createTextBox = function (id, textEdit, svgDiv) {
        var self = this;
        var btnDisplayEditTools = $(textEdit).find(".DisplayEditToolsButton").first();
        var trEditToolsJQ = $(textEdit).find(".trEditTools");
        var divEditTools = $(trEditToolsJQ).find(".edit-tools-div");
        var editTextContainer = $(textEdit).find("#editTextContainer");       
        var editBoxJQ = $(textEdit).find(".editable-create");    
        var statusSpan = $(textEdit).find(".editing-status span");     
        console.log("status span1:" + statusSpan);
        textEdit.font = "normal 15px arial"; 
  
        console.log(editBoxJQ);

        //#region divEditTools
        divEditTools[0].timer = null;

        //Working on the BLUR STILL
        $(divEditTools).mouseleave(function () {
            console.log("The blur");
           // divEditTools[0].timer = setTimeout(self.setEditToolsStatus, 4000, textEdit, divEditTools, btnDisplayEditTools, Save, self);                
        });

        $(divEditTools).mousemove(function () {
            
            if (divEditTools[0].timer) {
                console.log("mousemove: " + divEditTools[0].timer);
                clearTimeout(divEditTools[0].timer);
            }
        });
        //#endregion divEditTools
        //#region editBox
        $(editBoxJQ).mouseover(function () {
            //console.log("mouseover");
            //console.log($(this));
            //$(this)[0].className += " MouseOver";//.addClass("mouseover");
            //console.log($(this)[0]);
            //self.setEditToolsStatus(textEdit, divEditTools, btnDisplayEditTools, EditingFocusNoInput);
            if (textEdit.status == EditingNoFocus_I) {
                setEditingStatus(EditingFocusNoInput_I);
            }
            else {
                setEditingStatus(EditingFocusNoInput);
            }
        });

        $(editBoxJQ).mousedown(function () {
            if (textEdit.status === EditingFocusNoInput_I) {
                setEditingStatus(EditingFocusInput);
            }
         
            //self.setEditToolsStatus(textEdit, divEditTools, btnDisplayEditTools, PromptEdit);
        });

        $(editBoxJQ).keydown(function (e) {
            
            if (textEdit.isDirty) {
                setEditingStatus(EditingFocusInputKeyDown, e);
            }
            else {
                setEditingStatus(EditingFocusInputKeyDown_I, e);
            }
        });

        $(editBoxJQ).mouseleave(function () {
            console.log("mouse leave");
            if (textEdit.IsDirty) {
                setEditingStatus(EditingNoFocus);
            }
            else {
                setEditingStatus(EditingNoFocus_I);
            }

           /* if (textEdit.Status === PromptEdit) {
                // start a timer which can only be deactivated from within promptEdit. It is attached to divEditTools                
                divEditTools[0].timer = setTimeout(self.setEditToolsStatus, 500, textEdit, divEditTools, btnDisplayEditTools, Save, self);
            }*/
        });

        $(editBoxJQ).focusout(function () {
            console.log("focus out");
           // $(this).removeClass("MouseDown");
        });
        //#endregion editBox
        //#region btnDisplayEditTools
        $(btnDisplayEditTools).mouseenter(function () {
            console.log("mouse enter");
            // kill timeout here
            if (divEditTools[0].timer) {
                clearTimeout(divEditTools[0].timer);
            }
        });

        btnDisplayEditTools.click(function (e) {
            console.log("found edit tools button");
            /* CLEAR ANY EXISTING TIMERS HERE */
           // self.setEditToolsStatus(textEdit, divEditTools, btnDisplayEditTools, EditingNoFocus, self, statusSpan);
        });

        //#endregion btnDisplayEditTools            

        // Start of in editing but without focus or input
        //self.setEditToolsStatus(textEdit, divEditTools, btnDisplayEditTools, EditingNoFocus, self, statusSpan);   
        setEditingStatus(EditingNoFocus_I);
        //divEditTools[0].timer = setTimeout(function () {            
        //    self.setEditToolsStatus(textEdit, divEditTools, btnDisplayEditTools, Save, self, statusSpan);   
        //}, 1000);  // ** change back to 4000 after testing

        function setEditingStatus(status, sender) {
            textEdit.prevStatus = textEdit.status;
            textEdit.status = status;
            $(statusSpan).text(status);
            console.log("Editing Status: " + status);
            switch (status) {
               
                case EditingNoFocus_I:
                    $(editBoxJQ).removeClass();
                    $(editBoxJQ).addClass("editing-no-focus-start");
                    self.showEditTools(divEditTools, true, false);
                    break;
                case EditingNoFocus:
                    console.log("EditingNoFocus");
                    $(editBoxJQ).removeClass();
                    $(editBoxJQ).addClass("editing-no-focus");
                    self.showEditTools(divEditTools, true, false);
                    break;
                case EditingFocusNoInput_I:
                    $(editBoxJQ).removeClass("");
                    $(editBoxJQ).addClass("editing-focus-no-input-start");
                    break;
                case EditingFocusNoInput:                  
                    $(editBoxJQ).removeClass();
                    $(editBoxJQ).addClass("editing-focus-no-input");
                    // reset timer to transition to Save Status
                   //if (divEditTools[0].timer) {
                   //     clearTimeout(divEditTools[0].timer);
                   // }
                   // divEditTools[0].timer = setTimeout(function () {
                   //     setEditingStatus(Save);
                   // }, 3000);
                    break;
                case EditingFocusInput:  // called by mousedown
                    if (!$(editBoxJQ).hasClass("editing-focus-input")) {
                        $(editBoxJQ).removeClass("");
                        $(editBoxJQ).addClass("editing-focus-input");

                        // we don't want to remove the text we have already manually entered
                        if (!textEdit.isDirty) {
                            $(editBoxJQ).text("__");

                            editBoxJQ[0].addEventListener("click", setEditCaret);

                            var e = new jQuery.Event("mousedown");
                            e.pageX = 3;
                            e.pageY = 3;
                            $(editBoxJQ).trigger(e);

                        }
                        //
                        //self.triggerMouseEvent(editBoxJQ[0], "click");                      
                    }
                    else { 
                        console.log("mousedown");
                        // reset timer to transition to Save Status
                        /*if (divEditTools[0].timer) {
                            console.log("Clear timer");
                            clearTimeout(divEditTools[0].timer);
                        }
                        divEditTools[0].timer = setTimeout(function () {
                            setEditingStatus(Save);
                        }, 3000);*/
                    }                    
                    break;
                //case EditingFocusInput:
                //    break;

                case EditingFocusInputKeyDown_I:
                    textEdit.isDirty = true;
                    if (!$(editBoxJQ).hasClass("editing-focus-input-keydown")) {  // this only gets called once to remove the placeholder text
                        console.log("EditingFocusInputKeyDown_I");
                        console.log(sender.key);
                        $(editBoxJQ).width(50);
                        $(editBoxJQ).text("");
                    }

                case EditingFocusInputKeyDown:
                        $(editBoxJQ).removeClass("");
                        $(editBoxJQ).addClass("editing-focus-input-keydown");

                    $(editBoxJQ).css("font", textEdit.font);
                    // reset timer to transition to Save Status
                    if (divEditTools[0].timer) {
                        clearTimeout(divEditTools[0].timer);
                    }
                    //divEditTools[0].timer = setTimeout(function () {
                    //    setEditingStatus(Save);
                    //}, 3000);
                    break;
                case Save:
                    self.showEditTools(divEditTools, false, false);
                    break;
                case PromptEdit:

                    console.log("PromptEdit");
                    self.showEditTools(divEditTools, false, true);
                    //btnDisplayEditTools.css("visibility", "visible");

                    //divEditTools[0].timer = setTimeout(self.setEditToolsStatus, 2000, textEdit, divEditTools, btnDisplayEditTools, Save, self);                              
                    break;
                default:
                    break;
            }
        } 


        function setEditCaret() {
            //self.triggerMouseEvent(editBoxJQ[0], "focus");
            console.log("heard click");
            console.log(window.getSelection());
            //editBoxJQ[0].select(0);
            self.placeCaretAtEnd(editBoxJQ[0]);
            //$(editBoxJQ).setCursorPosition(0);
            editBoxJQ[0].removeEventListener("click", setEditCaret);
        }

        $(textEdit).mousemove(function (e) {
            //self.setEditToolsStatus(textEdit, divEditTools, btnDisplayEditTools, PromptEdit);
            return;

            var rect = editBoxJQ[0].getBoundingClientRect();
            //console.log(rect);
            //console.log("X: " + e.clientX);
            //console.log("Y: " + e.clientY);
            var mousePoint = { x: e.clientX, y: e. clientY }
            //console.log(e); 
            self.isAtEdge(mousePoint, editBoxJQ, rect, svgDiv[0], editTextContainer);
            console.log("Mousemove");
        });
      

        //#region position the new line in the correct place
        var pos = self.getPreviousTextEditPos(id); 
        pos.left += 35;
        pos.top += 35;
        console.log(pos);

        $(textEdit).parent().css({ position: 'relative' });
        $(textEdit).css({ top: pos.top, left: pos.left, position: 'absolute' });
       // $(textEdit).attr("id", "tbdiv" + id);
        //textEdit.style.cssText = "border-style: solid; height: 75px; width: 300px;background-color: orange";
        $(svgDiv).append($(textEdit));

        var tbdivheader = $(textEdit).find("tb-div-header").first();//("#tbdivheader");
        //var editTextContainer = $(textEdit).find("#editTextContainer");
        console.log("tbdivheader ");
        console.log(tbdivheader);
        //$(tbdivheader).attr("id", "tbdiv" + id + "header");
        
        console.log(tbdivheader);

        dragElement(textEdit[0], svgDiv[0], editTextContainer[0]);
        //textEdit[0].dragElement(textEdit[0]);

        //svgDiv.appendChild(textEdit);


        //#endregion position the new line in the correct place

        return;

    }

    VectorEditor.prototype.placeCaretAtEnd = function (el) {
        el.focus();
        if (typeof window.getSelection != "undefined"
            && typeof document.createRange != "undefined") {
            
            var range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);            
            range.setStart(el, 0);
            range.setEnd(el, 0);
            console.log("rnage");
            console.log(range);

            var sel = window.getSelection();            
            console.log(sel);

            sel.removeAllRanges();            
            console.log(sel);

            
            sel.addRange(range);
            console.log("selection");
            console.log(sel);

        } else if (typeof document.body.createTextRange != "undefined") {  // this only works in IEf, although IE11 tends to choose the code above
            var textRange = document.body.createTextRange();
            textRange.moveToElementText(el);
            textRange.collapse(false);
            console.log("textrange");
            console.log(textRange)
            textRange.select();
        }
    }

    VectorEditor.prototype.triggerMouseEvent = function(node, eventType) {
        var clickEvent = document.createEvent('MouseEvents');
        clickEvent.initEvent(eventType, true, true);
        node.dispatchEvent(clickEvent);
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
    var header = $(elem).find(".tb-div-header").first()[0];// document.getElementsByClassName("tb-div-header")[0];
    console.log("Header");
    console.log(header);

    if (header) {//ById(elem.id + "header")) {
        //var header = document.getElementById(elem.id + "header");      
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
        if (
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
