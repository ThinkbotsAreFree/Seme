


defineSeme(universe, "name", new Seme(
    {
        arity: 1,
        whoAmI: "name",
        func: function(datum) {

            if (expect("name",[
                {
                    seme: datum,
                    requirements: { expectedTypes: [ "block" ] }
                },
                {
                    seme: datum,
                    requirements: { castableTo: [ "name" ] }
                }
            ])) {
                
                return new Seme(
                    datum.value,
                    "name",
                    [s_name]
                );
                
            } else return nothing;
        }
    },
    "native",
    []
));



defineSeme(universe, "boolean", new Seme(
    {
        arity: 1,
        whoAmI: "boolean",
        func: function(datum) {

            if (expect("boolean",[
                {
                    seme: datum,
                    requirements: { expectedTypes: [ "block" ] }
                },
                {
                    seme: datum,
                    requirements: { castableTo: [ "boolean" ] }
                }
            ])) {
                
                return new Seme(
                    datum.value,
                    "boolean",
                    [s_boolean]
                );
                
            } else return nothing;
        }
    },
    "native",
    []
));



defineSeme(universe, "number", new Seme(
    {
        arity: 1,
        whoAmI: "number",
        func: function(datum) {

            if (expect("number",[
                {
                    seme: datum,
                    requirements: { expectedTypes: [ "block" ] }
                },
                {
                    seme: datum,
                    requirements: { castableTo: [ "number" ] }
                }
            ])) {
                
                return new Seme(
                    datum.value,
                    "number",
                    [s_number]
                );
                
            } else return nothing;
        }
    },
    "native",
    []
));



defineSeme(universe, "block", new Seme(
    {
        arity: 1,
        whoAmI: "block",
        func: function(datum) {

            if (expect("block",[
                {
                    seme: datum,
                    requirements: { expectedTypes: [ "name", "number", "boolean" ] }
                }
            ])) {
                
                return new Seme(
                    datum.value,
                    "block",
                    [s_block]
                );
                
            } else return nothing;
        }
    },
    "native",
    []
));



defineSeme(universe, "..", new Seme(
    {
        arity: 2,
        whoAmI: "..",
        func: function(datum1, datum2) {


            if (expect("..",[
                {
                    seme: datum1,
                    requirements: { expectedTypes: [ "block" ] }
                },
                {
                    seme: datum2,
                    requirements: { expectedTypes: [ "block" ] }
                }
            ])) {
                return new Seme(
                    datum1.value+datum2.value,
                    "block",
                    [s_block]
                );
            } else return nothing;
        }
    },
    "native",
    []
));



defineSeme(universe, "sentence", new Seme(
    {
        arity: 2,
        whoAmI: "sentence",
        func: function(datum1, datum2) {


            if (expect("sentence",[
                {
                    seme: datum1,
                    requirements: { expectedTypes: [ "name", "block" ] }
                },
                {
                    seme: datum2,
                    requirements: { expectedTypes: [ "name", "block" ] }
                }
            ])) {
                return new Seme(
                    datum1.value+' '+datum2.value,
                    "block",
                    [s_block]
                );
            } else return nothing;
        }
    },
    "native",
    []
));



defineSeme(universe, "fput", new Seme(
    {
        arity: 2,
        whoAmI: "fput",
        func: function(datum1, datum2) {

            if (expect("fput",[
                {
                    seme: datum2,
                    requirements: { expectedTypes: [ "block" ] }
                }
            ])) {
                return new Seme(
                    datum1.toString()+' '+datum2.value,
                    "block",
                    [s_block]
                );

            } else return nothing;
        }
    },
    "native",
    []
));



defineSeme(universe, "lput", new Seme(
    {
        arity: 2,
        whoAmI: "lput",
        func: function(datum1, datum2) {

            if (expect("lput",[
                {
                    seme: datum2,
                    requirements: { expectedTypes: [ "block" ] }
                }
            ])) {
                return new Seme(
                    datum1.value+' '+datum2.toString(),
                    "block",
                    [s_block]
                );

            } else return nothing;
        }
    },
    "native",
    []
));



defineSeme(universe, "reverse", new Seme(
    {
        arity: 1,
        whoAmI: "reverse",
        func: function(datum) {

            if (expect("reverse",[
                {
                    seme: datum,
                    requirements: { expectedTypes: [ "block" ] }
                }
            ])) {
                return new Seme(
                    parseBlock(datum.value).reverse().join(' '),
                    "block",
                    [s_block]
                );

            } else return nothing;
        }
    },
    "native",
    []
));



defineSeme(universe, "gensym", new Seme(
    {
        arity: 0,
        whoAmI: "gensym",
        func: function() {
            return new Seme(
                "G"+newId(),
                "name",
                [s_name]
            );
        }
    },
    "native",
    []
));



var firstOfBlock = function(datum) {

    if (expect("first",[
        {
            seme: datum,
            requirements: {
                expectedTypes: [ "name", "block" ],
                nonEmpty: true
            }
        }
    ])) {
        var first;
        if (datum.type == "block")
            first = parseBlock(datum.value)[0];
        else
            first = datum.value.slice(0,1);
        return getOriginalSeme(first);

    } else return nothing;
}



var lastOfBlock = function(datum) {

    if (expect("first",[
        {
            seme: datum,
            requirements: {
                expectedTypes: [ "name", "block" ],
                nonEmpty: true
            }
        }
    ])) {
        var last;
        if (datum.type == "block") {
            var pb = parseBlock(datum.value);
            last = pb[pb.length-1];
        } else
            last = datum.value.slice(-1,1);
        return getOriginalSeme(last);

    } else return nothing;
}



var butfirstOfBlock = function(datum) {

    if (expect("butfirst",[
        {
            seme: datum,
            requirements: {
                expectedTypes: [ "name", "block" ],
                nonEmpty: true
            }
        }
    ])) {
        var butfirst;
        if (datum.type == "block") {
            butfirst = parseBlock(datum.value);
            butfirst.shift();
            butfirst = butfirst.join(' ');
        } else
            butfirst = datum.value.slice(1);
        return new Seme(
            butfirst,
            "block",
            [s_block]
        );

    } else return nothing;
}



var butlastOfBlock = function(datum) {

    if (expect("butlast",[
        {
            seme: datum,
            requirements: {
                expectedTypes: [ "name", "block" ],
                nonEmpty: true
            }
        }
    ])) {
        var butlast;
        if (datum.type == "block") {
            butlast = parseBlock(datum.value);
            butlast.pop();
            butlast = butlast.join(' ');
        } else
        butlast = datum.value.slice(0, -1);
        return new Seme(
            butlast,
            "block",
            [s_block]
        );

    } else return nothing;
}



defineSeme(universe, "first", new Seme(
    {
        arity: 1,
        whoAmI: "first",
        func: firstOfBlock
    },
    "native",
    []
));



defineSeme(universe, "firsts", new Seme(
    {
        arity: 1,
        whoAmI: "firsts",
        func: function(datum) {

            if (expect("firsts",[
                {
                    seme: datum,
                    requirements: {
                        expectedTypes: [ "block" ],
                        nonEmpty: true
                    }
                }
            ])) {
                var list = getSemeList(datum.value);
                var result = [];
                for (var l=0; l<list.length; l++) {
                    if (!expect("firsts",[
                        {
                            seme: list[l],
                            requirements: {
                                expectedTypes: [ "block" ],
                                notEmpty: true
                            }
                        }
                    ])) { return nothing; }
                    result.push(firstOfBlock(list[l]));                    
                }
                return new Seme(
                    result.join(' '),
                    "block",
                    [s_block]
                );
            } else return nothing;
        }
    },
    "native",
    []
));



defineSeme(universe, "butfirst", new Seme(
    {
        arity: 1,
        whoAmI: "butfirst",
        func: butfirstOfBlock
    },
    "native",
    []
));



defineSeme(universe, "butfirsts", new Seme(
    {
        arity: 1,
        whoAmI: "butfirsts",
        func: function(datum) {

            if (expect("butfirsts",[
                {
                    seme: datum,
                    requirements: {
                        expectedTypes: [ "block" ],
                        nonEmpty: true
                    }
                }
            ])) {
                var list = getSemeList(datum.value);
                var result = [];
                for (var l=0; l<list.length; l++) {
                    if (!expect("butfirsts",[
                        {
                            seme: list[l],
                            requirements: {
                                expectedTypes: [ "block" ],
                                notEmpty: true
                            }
                        }
                    ])) { return nothing; }
                    result.push(butfirstOfBlock(list[l]));
                }
                return new Seme(
                    result.join(' '),
                    "block",
                    [s_block]
                );
            } else return nothing;
        }
    },
    "native",
    []
));



defineSeme(universe, "last", new Seme(
    {
        arity: 1,
        whoAmI: "last",
        func: lastOfBlock
    },
    "native",
    []
));



defineSeme(universe, "lasts", new Seme(
    {
        arity: 1,
        whoAmI: "lasts",
        func: function(datum) {

            if (expect("lasts",[
                {
                    seme: datum,
                    requirements: {
                        expectedTypes: [ "block" ],
                        nonEmpty: true
                    }
                }
            ])) {
                var list = getSemeList(datum.value);
                var result = [];
                for (var l=0; l<list.length; l++) {
                    if (!expect("lasts",[
                        {
                            seme: list[l],
                            requirements: {
                                expectedTypes: [ "block" ],
                                notEmpty: true
                            }
                        }
                    ])) { return nothing; }
                    result.push(lastOfBlock(list[l]));                    
                }
                return new Seme(
                    result.join(' '),
                    "block",
                    [s_block]
                );
            } else return nothing;
        }
    },
    "native",
    []
));



defineSeme(universe, "butlast", new Seme(
    {
        arity: 1,
        whoAmI: "butlast",
        func: butlastOfBlock
    },
    "native",
    []
));



defineSeme(universe, "butlasts", new Seme(
    {
        arity: 1,
        whoAmI: "butlasts",
        func: function(datum) {

            if (expect("butlasts",[
                {
                    seme: datum,
                    requirements: {
                        expectedTypes: [ "block" ],
                        nonEmpty: true
                    }
                }
            ])) {
                var list = getSemeList(datum.value);
                var result = [];
                for (var l=0; l<list.length; l++) {
                    if (!expect("butlasts",[
                        {
                            seme: list[l],
                            requirements: {
                                expectedTypes: [ "block" ],
                                notEmpty: true
                            }
                        }
                    ])) { return nothing; }
                    result.push(butlastOfBlock(list[l]));
                }
                return new Seme(
                    result.join(' '),
                    "block",
                    [s_block]
                );
            } else return nothing;
        }
    },
    "native",
    []
));



defineSeme(universe, "item", new Seme(
    {
        arity: 2,
        whoAmI: "item",
        func: function(index, datum) {

            if (expect("item",[
                {
                    seme: index,
                    requirements: {
                        expectedTypes: [ "number" ],
                        range: { min: 1 },
                        shouldBeInteger: true
                    }
                },
                {
                    seme: datum,
                    requirements: { expectedTypes: [ "name", "block" ] }
                }
            ])) {
                if (datum.type == "name")
                    return getOriginalSeme(datum.value.charAt(index.value-1));
                else
                    return getOriginalSeme(parseBlock(datum.value)[index-1]);

            } else return nothing;
        }
    },
    "native",
    []
));



defineSeme(universe, "pick", new Seme(
    {
        arity: 1,
        whoAmI: "pick",
        func: function(datum) {

            if (expect("pick",[
                {
                    seme: datum,
                    requirements: { expectedTypes: [ "name", "block" ] }
                }
            ])) {
                if (datum.type == "name") {
                    var index = Math.floor(Math.random()*datum.value.length)
                    return getOriginalSeme(datum.value.charAt(index));
                } else {
                    var pb = parseBlock(datum.value);
                    var index = Math.floor(Math.random()*pb.length)
                    return getOriginalSeme(pb[index]);
                }

            } else return nothing;
        }
    },
    "native",
    []
));



defineSeme(universe, "remove", new Seme(
    {
        arity: 2,
        whoAmI: "remove",
        func: function(datum1, datum2) {

            if (expect("remove",[
                {
                    seme: datum2,
                    requirements: { expectedTypes: [ "block" ] }
                }
            ])) {

                var pb = parseBlock(datum2.value);
                var result = [];
                for (var i=0; i<pb.length; i++)
                    if (getOriginalSeme(pb[i]).value != datum1.value)
                        result.push(pb[i]);
                return getOriginalSeme('['+result.join(' ')+']');

            } else return nothing;
        }
    },
    "native",
    []
));



defineSeme(universe, "remdup", new Seme(
    {
        arity: 1,
        whoAmI: "remdup",
        func: function(datum) {

            if (expect("remdup",[
                {
                    seme: datum,
                    requirements: { expectedTypes: [ "block" ] }
                }
            ])) {

                var pb = parseBlock(datum.value);
                var result = [];
                for (var i=0; i<pb.length; i++)
                    if (!result.includes(pb[i]))
                        result.push(pb[i]);
                return getOriginalSeme('['+result.join(' ')+']');

            } else return nothing;
        }
    },
    "native",
    []
));



defineSeme(universe, "empty", new Seme(
    {
        arity: 1,
        whoAmI: "empty",
        func: function(datum) {

            if (expect("empty",[
                {
                    seme: datum,
                    requirements: { expectedTypes: [ "block" ] }
                }
            ])) {
                
                return new Seme(
                    parseBlock(datum.value).length == 0,
                    "boolean",
                    [s_boolean]
                );
                
            } else return nothing;
        }
    },
    "native",
    []
));



defineSeme(universe, "member", new Seme(
    {
        arity: 2,
        whoAmI: "member",
        func: function(datum, container) {

            if (expect("member",[
                {
                    seme: container,
                    requirements: { expectedTypes: [ "block" ] }
                }
            ])) {
                var content = parseBlock(container.value)
                    .map(seme => getOriginalSeme(seme));
                var outcome = false;
                for (var c=0; c<content.length; c++) {
                    if (content[c].isEqual(datum)) {
                        outcome = true;
                        break;
                    }
                }
                return new Seme(
                    outcome,
                    "boolean",
                    [s_boolean]
                );
                
            } else return nothing;
        }
    },
    "native",
    []
));



defineSeme(universe, "anymember", new Seme(
    {
        arity: 2,
        whoAmI: "anymember",
        func: function(items, container) {

            if (expect("anymember",[
                {
                    seme: items,
                    requirements: { expectedTypes: [ "block" ] }
                },
                {
                    seme: container,
                    requirements: { expectedTypes: [ "block" ] }
                }
            ])) {
                var data = parseBlock(items.value)
                    .map(seme => getOriginalSeme(seme));
                var content = parseBlock(container.value)
                    .map(seme => getOriginalSeme(seme));
                var outcome = false;
                for (var d=0; d<data.length; d++) {
                    var included = false;
                    for (var c=0; c<content.length; c++) {
                        if (content[c].isEqual(data[d])) {
                            included = true;
                            break;
                        }
                    }
                    if (included) {
                        outcome = true;
                        break;
                    }
                }
                return new Seme(
                    outcome,
                    "boolean",
                    [s_boolean]
                );
                
            } else return nothing;
        }
    },
    "native",
    []
));



defineSeme(universe, "allmembers", new Seme(
    {
        arity: 2,
        whoAmI: "allmembers",
        func: function(items, container) {

            if (expect("allmembers",[
                {
                    seme: items,
                    requirements: { expectedTypes: [ "block" ] }
                },
                {
                    seme: container,
                    requirements: { expectedTypes: [ "block" ] }
                }
            ])) {
                var data = parseBlock(items.value)
                    .map(seme => getOriginalSeme(seme));
                var content = parseBlock(container.value)
                    .map(seme => getOriginalSeme(seme));
                var outcome = true;
                for (var d=0; d<data.length; d++) {
                    var included = false;
                    for (var c=0; c<content.length; c++) {
                        if (content[c].isEqual(data[d])) {
                            included = true;
                            break;
                        }
                    }
                    if (!included) {
                        outcome = false;
                        break;
                    }
                }
                return new Seme(
                    outcome,
                    "boolean",
                    [s_boolean]
                );
                
            } else return nothing;
        }
    },
    "native",
    []
));


