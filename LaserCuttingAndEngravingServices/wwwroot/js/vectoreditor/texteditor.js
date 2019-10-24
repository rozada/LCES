(function (global) {
    var textTool = window.document.getElementsByClassName('text-edit')[0];
    global.textTool = textTool;
    //Make the DIV element draggagle:
    dragElement(textTool);

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
    var textInput = $(textTool).children('textarea:first');
    console.log("textInput: ");
    console.log(textInput); 
    var svg;
    if (!global.vectorEditor.svg) {
        svg = window.document.getElementsByTagName("svg")[0];
        
        global.vectorEditor.svg = svg;
    }
    else {
        svg = global.vectorEditor.svg;
    }
    
    svg.addEventListener("click", function () {
        $(textInput).css("border-style", "none");  
        console.log("textInput:");
        console.log(textInput);
        //var rect = txt.getBoundingClientRect();
        var textInputOffset = $(textInput).offset();
        console.log("textInput offset: ");
        console.log(textInputOffset);
        var textToolOffset = $(textTool).offset();
        console.log("textTool offset: ");
        console.log(textToolOffset);

        var svgOffset = $(svg).offset();
        console.log("svgoffset: ");
        console.log(svgOffset);
        var svgTextOffset = {
            left: textInputOffset.left - svgOffset.left,
            top: textInputOffset.top - svgOffset.top
        }
        console.log("svgTextOffset: ");
        console.log(svgTextOffset);
        global.vectorEditor.currentText.setAttributeNS(null, "x", svgTextOffset.left);
        global.vectorEditor.currentText.setAttributeNS(null, "y", svgTextOffset.top);
        global.vectorEditor.currentText.textContent = $(textInput).val();
    });

    $(textInput).click(function () {
        $(this).css("border-style", "dashed");
    });

    function resizeIt() {
        var str = $('#txt').val();
        
        var cols = parseInt($('#txt').attr('cols'));
        var fontSize = $('#txt').css('font-size');
        var lineHeight = Math.floor(parseInt(fontSize.replace('px', '')) * 1.5);
        
        var lines = $('#txt').val().split("\n");
        var linecount = 0;
       
        console.log("cols: " + cols);
        for (var i = 0; i < lines.length; i++) {
            //code here using lines[i] which will give you each line
            var lineTemp;
            var index = 0;
            // need a while statemnet
            console.log('lines[0]: ' + lines[0]);
            
            while (index < lines[i].length) {
                lineTemp = lines[i].substring(index, cols);
                index = index + cols;
                console.log("index: " + index + " cols: " + cols);
                linecount++;
                console.log("linetemp (inside while): " + lineTemp);
            }            
            //lineTemp = lines[i].substring(index);

            //linecount++;
            //console.log("linetemp: " + lineTemp);
            console.log("linecount: " + linecount);

        }

        /*$A(str.split("\n")).each(function (l) {
            linecount += Math.ceil(l.length / cols); // Take into account long lines
        })*/
        
        var scrollHeight = $('#txt').get(0).scrollHeight;
        console.log("textarea: " + scrollHeight);
        var numberOfLines = Math.floor(scrollHeight / lineHeight);
        $('#txt').attr('rows', linecount);
    };

    // You could attach to keyUp, etc. if keydown doesn't work
    $('#txt').keydown(function () {
        
       // resizeIt();
    });

   // resizeIt(); //Initial on load
})(window);