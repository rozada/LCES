(function (global) {
    var svgns = "http://www.w3.org/2000/svg";
    var textTool = window.document.getElementsByClassName('text-edit')[0];
    global.textTool = textTool;
    //Make the DIV element draggable:
    dragElement(textTool);

    //#region dragging functionality
    function dragElement(elmnt) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (document.getElementById(elmnt.id + "header")) {
            /* if present, the header is where you move the DIV from:*/
            document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
        } else {
            /* otherwise, move the DIV from anywhere inside the DIV:*/
            elmnt.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            /* stop moving when mouse button is released:*/
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
    //#endregion dragging functionality
    var svg;
    if (!global.vectorEditor.svg) {
        svg = window.document.getElementsByTagName("svg")[0];
        
        global.vectorEditor.svg = svg;
    }
    else {
        svg = global.vectorEditor.svg;
    }

    var textInput = $('#txt');

    function centerTextEditor() {
        
        var textInputWidth = $(textInput).width();
        var textInputHeight = $(textInput).height();
        var rcWidth = global.vectorEditor.rectWidth;
        var rcHeight = global.vectorEditor.rectHeight;
        var leftPos = (rcWidth / 2 - textInputWidth / 2) + "px";
        var topPos = (rcHeight / 2 - textInputHeight / 2) + "px";
        console.log(leftPos);
        $(textTool).css({ left: leftPos, top: topPos });
    }
    global.vectorEditor.centerTextEditor = centerTextEditor;

    
    svg.addEventListener("click", function () {
        // this was set in the vectorEditor.js
        var currentShape = global.vectorEditor.currentShape;

        // stop displaying the border around the input box
        $(textInput).css("border-style", "none");  

        console.log("textInput:");
        console.log(textInput);

        return;  /*  NOT SURE HOW THIS CODE *WAS* USED */
        //var rect = txt.getBoundingClientRect();
        var textInputOffset = $(textInput).offset();
        console.log("textInput offset: ");
        console.log(textInputOffset);
        var currentShapeOffset = $(currentShape).offset();
        console.log("currentShape offset: ");
        console.log(currentShapeOffset);        

        var svgOffset = $(svg).offset();
        console.log("svgoffset: ");
        console.log(svgOffset);
        var svgTextOffset = {
            left: textInputOffset.left - currentShapeOffset.left,
            top: textInputOffset.top - currentShapeOffset.top
        }
        console.log("svgTextOffset: ");
        console.log(svgTextOffset);
        global.vectorEditor.currentText.setAttributeNS(null, "x", svgTextOffset.left);
        global.vectorEditor.currentText.setAttributeNS(null, "y", svgTextOffset.top);
        /*** new test ***/
        global.vectorEditor.currentText.setAttributeNS(null, "dy", "13");      


        console.log("SVG Container");
        console.log($(textInput).text());
        setSVGTextContent($(textInput).html(), svgTextOffset.left, svgTextOffset.top);
    });

    $(textInput).click(function () {
        $(this).css("border-style", "dashed");
    });


    function setSVGTextContent(text, left, top) {
        var lines = text.split("<br>");
       
        console.log("parse text input: " + lines.length);
        var maxWidth = 0;

        for (var i = 0; i < lines.length; i++) {
            console.log('lines[0]: ' + lines[i]);
            var currentText = global.vectorEditor.currentText;
            var textAlignment = $(textInput).css("text-align");
            console.log("TA: " + textAlignment);
            
            if (i === 0) {
                currentText.textContent = lines[i];
                var rect = currentText.getBoundingClientRect();
                maxWidth = rect.width;
            }
            else {
                addTextLine(currentText, lines[i], left, top, i, maxWidth, textAlignmentToTextAnchor(textAlignment));
            }
        }
    }

    function textAlignmentToTextAnchor(textAlignment) {
        switch (textAlignment) {
            case "left":
                return "start";
                break;
            case "center":
                return "middle";
                break;
            case "right":
                return "end";
                break;
            default:
                console.log("Unknown textAlignment type");
        }
    }

    function xPositionForSVGText(textAnchor, line, maxWidth) {
        switch (textAnchor) {
            case "start":
                return 0;
                break;
            case "middle":
                var tempTspan = global.vectorEditor.svgOwnerDocument.createElementNS(svgns, "tspan");
                tempTspan.setAttributeNS(null, "x", 0);
                tempTspan.setAttributeNS(null, "y", 0);        // TODO:  REMOVE 18 AND Base this on font size        /
                tempTspan.textContent = line;

                var rect = tempTspan.getBoundingClientRect();

                if (rect.width > maxWidth) {
                    maxWidth = rect.width;
                }                
                return maxWidth / 2;  // this is the center point
            case "end":
                var tempTspan = global.vectorEditor.svgOwnerDocument.createElementNS(svgns, "tspan");
                tempTspan.setAttributeNS(null, "x", 0);
                tempTspan.setAttributeNS(null, "y", 0);        // TODO:  REMOVE 18 AND Base this on font size        /
                tempTspan.textContent = line;

                var rect = tempTspan.getBoundingClientRect();

                if (rect.width > maxWidth) {
                    return rect.width
                }
                return maxWidth;  // this is the rightmost side
            default:
                console.log("Unknown textAlignment type");
        }
    }
    

    function addTextLine(currentText, line, left, top, lineNum, maxWidth, textAnchor) {
        // tempTspan is only used to calculate the center point for each line item
        var tempTspan = global.vectorEditor.svgOwnerDocument.createElementNS(svgns, "tspan");
        tempTspan.setAttributeNS(null, "x", 0);
        tempTspan.setAttributeNS(null, "y", 0);        // TODO:  REMOVE 18 AND Base this on font size        /
        /*** new test ***/
        tempTspan.setAttributeNS(null, "y", "13");      

        tempTspan.textContent = line;
        
        var rect = tempTspan.getBoundingClientRect();
        
        if (rect.width > maxWidth) {
            maxWidth = rect.width;
        }
        var xPosition = xPositionForSVGText(textAnchor, line, maxWidth);// maxWidth / 2;        

        var tspan = global.vectorEditor.svgOwnerDocument.createElementNS(svgns, "tspan");
        tspan.setAttributeNS(null, "x", (left + xPosition) + "px");  // we calculate the width first from the tempTspan
        tspan.setAttributeNS(null, "y", (top + (lineNum * 18)) + "px");        // TODO:  REMOVE 18 AND Base this on font size
        /*** new test ***/
        tspan.setAttributeNS(null, "y", (top + (lineNum * 18) + 13) + "px");      

        tspan.setAttributeNS(null,"text-anchor", textAnchor);// // TODO: EMULATE THE SPAN
        tspan.setAttributeNS(null,"alignment-baseline", "central");
        tspan.textContent = line;

        currentText.appendChild(tspan);
    }

    $("#divLeftAlign").click(function () {
        console.log("divLeftalign");
        $("#editTextContainer").css('text-align', 'left');
        $(this).addClass('text-alignment-selected');
        $("#divCenterAlign").removeClass('text-alignment-selected');
        $("#divRightAlign").removeClass('text-alignment-selected');
    });
    $("#divCenterAlign").click(function () {
        console.log("divCenteralign");
        $("#editTextContainer").css('text-align', 'center');
        $(this).addClass('text-alignment-selected');
        $("#divLeftAlign").removeClass('text-alignment-selected');
        $("#divRightAlign").removeClass('text-alignment-selected');
    });
    $("#divRightAlign").click(function () {
        console.log("divRightalign");
        $("#editTextContainer").css('text-align',  'right');
        $(this).addClass('text-alignment-selected');
        $("#divLeftAlign").removeClass('text-alignment-selected');
        $("#divCenterAlign").removeClass('text-alignment-selected');
    });

})(window);