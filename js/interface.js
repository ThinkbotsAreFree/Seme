
var ui = {

    textareaId: 0,
    
    enhancedTextareas: {},
    
    tiles: {},
    
    columns: {},
    
    initialize: function() {
    
        var workspace = document.getElementById("workspace");
        workspace.innerHTML = '';
        var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (var a = 0; a<26; a++) {
            this.columns[alphabet[a]] = [];
            workspace.innerHTML += `
                <div
                    class="column"
                    id="col${alphabet[a]}"
                    style="">
                </div>
            `;
        }
    },
    
    createTile: function(tileOptions) {
        
        var tile = Object.assign({
            type: "console",
            width: 4,
            height: 3,
            color: Math.floor(Math.random()*360),
            column: 'A',
            position: 0,
            gridW: 5,
            gridH: 5,
            content: {
                output: '',
                input: '',
                editor: '',
                board: ''
            },
            inputStack: [],
            stackIndex: -1,
            icons: []
        }, tileOptions);
        
        this.setTileTitle(tile);

        // actually create the tile
        this.tiles[tile.title] = tile;

        this.insertTileIntoNewCoordinates(tile.title, tile.column, tile.position);
    },

    setTileTitle: function(tile) {

        // if we have no title, set it to "tile's type" + a number
        if ((!tile.title) || (tile.title == ''))
            tile.title =
                (tileOptions.type || "console")+(Object.keys(this.tiles).length+1);

        // tile names are unique
        if (ui.tiles[tile.title]) {
            // this should raise an exception
            alert("tile already exists");
            return;
        }
    },

    setTileCoordinates: function(tileName, column, position) {

        this.removeTileFromCurrentCoordinates(tileName);
        this.insertTileIntoNewCoordinates(tileName, column, position);
        this.drawAll();
    },

    removeTileFromCurrentCoordinates: function(tileName) {

        for (var t in this.tiles) {

            if ((this.tiles[t].column == this.tiles[tileName].column)
                && (this.tiles[t].position > this.tiles[tileName].position))
                this.tiles[t].position -= 1;
        }
        this.tiles[tileName].column = 'none';
        this.tiles[tileName].position = 'none';        
    },

    insertTileIntoNewCoordinates: function(tileName, column, wantedPosition) {

        var position = Math.max(wantedPosition, 0);
        var maxPosition = 0;
        for (var t in this.tiles) {

            if (this.tiles[t].column == column) {
                maxPosition = Math.max(maxPosition, this.tiles[t].position);
                if (this.tiles[t].position >= position)
                    this.tiles[t].position += 1;
            }
        }
        this.tiles[tileName].column = column;
        this.tiles[tileName].position = Math.min(position, maxPosition+1);
    },

    setTileType: function(tileName, tileType) {

        this.tiles[tileName].type = tileType;
        this.redrawTile(tileName);
    },
    
    buildTileHTML: function(type, width, height, color, title, tileContent) {
    
        var w = (width*160-10)+"px";
        var h = (height*160-10)+"px";
        
        var content = Object.assign({
            output: '',
            input: '',
            editor: '',
            board: ''
        }, tileContent);
        
        var component;
    
        switch (type) {
        
            case "console":
                component = `<div class="title" onclick="ui.changeColor(this);" style="border-bottom: 1px solid hsl(${color},60%,40%);">${title}</div><div class="output">${content.output}</div><input placeholder="▶" type="text" style="background-color:hsl(${color},60%,40%);" onkeyup="ui.consoleInput(event, this)" value="${content.input}">`;
                break;
                
            case "editor":
                ui.textareaId++;
                component = `<div class="title" onclick="ui.changeColor(this);">${title}</div><textarea id="TA${ui.textareaId}" style="background-color:hsl(${color},60%,40%);" onfocus="ui.enhance(this)" onkeyup="ui.editorInput(this)">${content.editor}</textarea>`;
                break;
                
            case "board":
                component = `<div class="title" onclick="ui.changeColor(this);" style="border-bottom: 1px solid hsl(${color},60%,40%);">${title}</div><div class="board">${content.board}</div>`;
                break;
                
            default:
                // this should not happen
                alert("wrong tile type: "+type);
        }
    
        return `
            <div
                class="tile" id="tile_${title}" 
                style="background-color:hsl(${color},50%,50%);border:1px solid hsl(${color},50%,50%);width:${w};height:${h};">${component}</div>
        `;
    },

    buildGridHTML: function(tile) {

        var html = '<table class="grid">';
        var cellSize = Math.min(
            Math.floor((tile.width*160-10-64)/tile.gridW)-6,
            Math.floor((tile.height*160-10-64)/tile.gridH)-6
        );
        var imgSize = Math.floor(cellSize*0.8)
        for (var y=0; y<tile.gridH; y++) {
            html += "<tr>";
            for (var x=0; x<tile.gridW; x++) {
                html += `<td style="
                    background-color: hsl(${tile.color},60%,40%);
                    width: ${cellSize}px;
                    height: ${cellSize}px;
                "><div class="gridCell">`;
                if (tile.icons['x'+x+'y'+y])
                    html += '<img src="../icons/'+tile.icons['x'+x+'y'+y]+'.png" '+
                        `style="width:${imgSize}px;height:${imgSize}px;">`;
                html += "</div></td>";
            }
            html += "</tr>";
        }
        html += "</table>";
        return html;
    },
    
    editorInput: function(elem) {
        
        this.tiles[elem.parentNode.childNodes[0].innerHTML].content.editor = elem.value;
    },
    
    consoleInput: function(event, elem) {
        
        var tileName = elem.parentNode.childNodes[0].innerHTML;
        this.tiles[tileName].content.input = elem.value;

        if (event.keyCode == "27") { // escape

            elem.value = '';
        
        } else if (event.keyCode == "38") { // up arrow

            if (this.tiles[tileName].stackIndex == -1)
                this.tiles[tileName].stackIndex = this.tiles[tileName].inputStack.length;

            this.tiles[tileName].stackIndex -= 1;

            if (this.tiles[tileName].stackIndex == -1)
                this.tiles[tileName].stackIndex = this.tiles[tileName].inputStack.length-1;

            elem.value = this.tiles[tileName].inputStack[this.tiles[tileName].stackIndex];

        } else if (event.keyCode == "40") { // down arrow

            if (this.tiles[tileName].stackIndex == -1)
                this.tiles[tileName].stackIndex = -1;

            this.tiles[tileName].stackIndex += 1;

            if (this.tiles[tileName].stackIndex == this.tiles[tileName].inputStack.length )
                this.tiles[tileName].stackIndex = 0;

            elem.value = this.tiles[tileName].inputStack[this.tiles[tileName].stackIndex];
        }
        
        if (event.keyCode == "13") {

            if (elem.value != this.tiles[tileName].inputStack[this.tiles[tileName].inputStack.length-1])
                this.tiles[tileName].inputStack.push(elem.value);
            this.tiles[tileName].stackIndex = -1;

            this.activeConsoleName = tileName;


            if (this.tiles[tileName].listener) {

            } else {

                this.tiles[tileName].content.output += "➜ "+elem.value+'\n';
                
                sys.postMessage({
                    order: "console input",
                    debug: debug.turnedOn,
                    input: elem.value,
                    tileName: tileName
                });
            }
            

            if (!debug.turnedOn) {
                this.tiles[tileName].content.input = '';
                elem.value = '';
                this.redrawTile(tileName);
                this.focusInput();
            }
        }
    },
    
    changeColor: function(elem) {
        
        var tileName = elem.innerHTML;
        this.tiles[tileName].color = Math.floor(Math.random()*360);
        this.redrawTile(tileName, elem.parentNode);
        if (this.tiles[tileName].type == "console")
            setTimeout(new Function("document.querySelector('#tile_"+tileName+" input').focus();"),10);
        else if (this.tiles[tileName].type == "editor")
            setTimeout(new Function("document.querySelector('#tile_"+tileName+" textarea').focus();"),10);
    },
    
    redrawTile: function(tileName, elem) {
        
        elem = elem || document.getElementById("tile_"+tileName);

        if (this.tiles[tileName].type=="board")
            this.tiles[tileName].content.board =
                this.buildGridHTML(this.tiles[tileName]);
        
        var newHTML = this.buildTileHTML(
            this.tiles[tileName].type,
            this.tiles[tileName].width,
            this.tiles[tileName].height,
            this.tiles[tileName].color,
            tileName,
            this.tiles[tileName].content
        );
        elem.outerHTML = newHTML;
    },
    
    drawAll: function() {
    
        this.initialize();

        for (var t in this.tiles) {

            this.columns[this.tiles[t].column][this.tiles[t].position] = t;
        }
        
        var totalWidth = 0;
        
        for (var c in this.columns) if (this.columns[c].length > 0) {
            
            this.columns[c] = this.columns[c].filter( e => e );

            var maxWidth = 0;
        
            for (var tile=0; tile<this.columns[c].length; tile++) {
                //alert(JSON.stringify(this.columns[c]));
                maxWidth = Math.max(maxWidth, this.tiles[this.columns[c][tile]].width);
            
                if (this.tiles[this.columns[c][tile]].type=="board")
                    this.tiles[this.columns[c][tile]].content.board =
                        this.buildGridHTML(this.tiles[this.columns[c][tile]]);

                document.getElementById("col"+c).innerHTML +=
                    this.buildTileHTML(
                        this.tiles[this.columns[c][tile]].type,
                        this.tiles[this.columns[c][tile]].width,
                        this.tiles[this.columns[c][tile]].height,
                        this.tiles[this.columns[c][tile]].color,
                        this.columns[c][tile],
                        this.tiles[this.columns[c][tile]].content
                    );
            }
            
            document.getElementById("col"+c).style.width = (maxWidth*160)+"px";
            totalWidth += maxWidth;
        }
        
        document.getElementById("workspace").style["min-width"] = (totalWidth*160)+"px";
    },
    
    enhance: function(elem) {
        if (!this.enhancedTextareas[elem.id])
            this.enhancedTextareas[elem.id] =
                new EnhancedTextarea(elem, { indentChar: ' ', indentLevel: 4 });
    },
    
    printToConsole: function(tileName, content, scratch) {
        
        var consoleElem = document.getElementById("tile_"+tileName);
        ui.tiles[tileName].content.output =
            (scratch ? '' : ui.tiles[tileName].content.output) + content + '\n';
        consoleElem.childNodes[1].innerHTML = ui.tiles[tileName].content.output;
        consoleElem.childNodes[1].scrollTop = consoleElem.childNodes[1].scrollHeight;
        this.focusInput();
    },

    print: function(content) {

        this.printToConsole(this.activeConsoleName, content);
    },

    log: function(content) {

        document.getElementById(content.watcherId).innerHTML = content.output;
    },

    consolelog: function(content) {

        console.log(content);
    },

    newEditor: function(content) {
        
    },

    focusInput: function() {
        setTimeout(new Function("document.querySelector('#tile_"+this.activeConsoleName+" input').focus();"),10);
    },

    cls: function() {
        document.querySelector("#tile_"+this.activeConsoleName+" .output").innerHTML = '';
        this.tiles[this.activeConsoleName].content.output = '';
    },

    setGrid: function(content) {

        if (content.icon == "nothing")
            delete this.tiles[content.tileName].icons['x'+content.x+'y'+content.y];
        else
            this.tiles[content.tileName].icons['x'+content.x+'y'+content.y] = content.icon;
        this.redrawTile(content.tileName);
    },

    showError: function(content) {

        this.print(content);
    },

    readTileContent: function(tileName) {

        var val;
        var success = false;

        if (this.tiles[tileName]) {
            
            if (this.tiles[tileName].type == "console") {
                val = this.tiles[tileName].content.input;
                success = true;
            } else if (this.tiles[tileName].type == "editor") {
                val = this.tiles[tileName].content.editor;
                success = true;
            } else success = false;
        }

        sys.postMessage({
            order: "requested value",
            success: success,
            value: '['+val+']'
        });        
    },
    
    writeTileContent: function(content) {

        if (this.tiles[content.tileName]) {
            
            if (this.tiles[content.tileName].type == "console")
                this.tiles[content.tileName].content.input = content.txt;

            else if (this.tiles[content.tileName].type == "editor")
                this.tiles[content.tileName].content.editor = content.txt;

            this.redrawTile(content.tileName);
        }
    },

    setTileColor: function(content) {

        if (this.tiles[content.tileName]) {

            this.tiles[content.tileName].color = content.color;
            this.redrawTile(content.tileName);
        }
    },

    locateTile: function(content) {

        if (this.tiles[content.tileName]) {

            this.setTileCoordinates(content.tileName, content.column, content.row);
            this.drawAll();
        }
    },

    resizeTile: function(content) {

        if (this.tiles[content.tileName]) {

            this.tiles[content.tileName].width = content.width;
            this.tiles[content.tileName].height = content.height;
            this.redrawTile(content.tileName);
        }
    },

    resizeGrid: function(content) {

        if (this.tiles[content.tileName]) {

            this.tiles[content.tileName].gridW = content.width;
            this.tiles[content.tileName].gridH = content.height;
            this.redrawTile(content.tileName);
        }
    }
}
