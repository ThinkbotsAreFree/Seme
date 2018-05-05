



function parse(source) {

    var pb = parseBlock(source);
    var result = [];
    var item;

    for (var i=0; i<pb.length; i++) {

        item = { token: pb[i] };

        if (item.token.slice(0,1)=="'") {
            item.quote = true;
            item.token = item.token.slice(1);
        }

        var lastChar = item.token.slice(-1);

        if (lastChar == "'") {
            item.access = true;
            item.token = item.token.slice(0,item.token.length-1);
        }

        if ((item.token.slice(-1) == ":")
            || (item.token.slice(-1) == ";")
            || (item.token.slice(-1) == "?")) {
            item.apply = true;
            item.token = item.token.slice(0,item.token.length-1);
        }

        if ((item.token[0]=='[') || (item.token[0]=='"')) item.block = true;

        if ((String.prototype.toLowerCase(item.token) == "true") || (String.prototype.toLowerCase(item.token) == "false"))
            item.boolean = true;

        if (String.prototype.toLowerCase(item.token) == "nothing")
            item = { token: nothing, nothing: true };

        if ((!item.quote) && (!isNaN(item.token))) item.number = true;
        
        if ((!item.quote) && (!item.block) && (!item.number)) item.reference = true;
        
        if ([
                '+',
                '-',
                '*',
                '/',
                '%',
                '&',
                '|',
                '!',
                '=',
                '!=',
                '<',
                '>',
                '<=',
                '>=',
                '..'
            ].includes(item.token)) item.apply = true;

            if (item.block) {
                item.path = [];
            } else
                item.path = item.token.split("'");
    
            if (item.token != '') result.push(item);
    }
    
    return result;
}






/*
function whiteSplit(txt) {

    return txt.trim().replace(/\s+/g,' ').split(' ')
}
*/


importScripts("blockParser.js");
parseBlock = function(source) {

    var result = [];
    try {
        result = blockParser.parse(source);
    } catch(e) {
        parserError = e.message;
    }
    return result;
}
