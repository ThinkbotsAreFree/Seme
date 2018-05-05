


defineSeme(universe, "print", new Seme(
    {
        arity: 1,
        whoAmI: "print",
        func: function(txt) {

            postMessage({
                action: "print",
                content: txt.value
            });
            return nothing;
        }
    },
    "native",
    []
));



defineSeme(universe, "show", new Seme(
    {
        arity: 1,
        whoAmI: "show",
        func: function(txt) {

            postMessage({
                action: "print",
                content: txt.toString()
            });
            return nothing;
        }
    },
    "native",
    []
));
    


defineSeme(universe, "help", new Seme(
    {
        arity: 1,
        whoAmI: "help",
        func: function(seme) {
            var wanted = seme.value.whoAmI || seme.value;
            if (help[wanted])
                postMessage({
                    action: "print",
                    content: `The function "${wanted}" ${help[wanted]}`
                });
            else
                postMessage({
                    action: "print",
                    content: `No help about "${wanted}".`
                });
            return nothing;
        }
    },
    "native",
    []
));
    


defineSeme(universe, "cls", new Seme(
    {
        arity: 0,
        whoAmI: "cls",
        func: function(txt) {

            postMessage({
                action: "cls",
            });
            return nothing;
        }
    },
    "native",
    []
));



function getColRow(coordinates) {

    return {
        col: coordinates.substring(0,1),
        row: coordinates.substring(1)-1
    }
}



function tileCreatorFactory(type) {
    return function(title, coordinates, width, height) {
        
        if (expect(type,[
            {
                seme: title,
                requirements: { expectedTypes: ["name"] }
            },
            {
                seme: coordinates,
                requirements: { expectedFormat: "tile coordinates" }
            },
            {
                seme: width,
                requirements: {
                    expectedTypes: ["number"],
                    shouldBeInteger: true,
                    range: { min: 1 }
                }
            },
            {
                seme: height,
                requirements: {
                    expectedTypes: ["number"],
                    shouldBeInteger: true,
                    range: { min: 1 }
                }
            },
        ])) {
            var colrow = getColRow(coordinates.value);
            postMessage({
                action: "createTile",
                content: {
                    title: title.value,                    
                    type: type,
                    column: colrow.col,
                    position: colrow.row,
                    width: width.value,
                    height: height.value
                }
            });
            postMessage({action:"drawAll"});
        }
        return nothing;
    }
}



defineSeme(universe, "editor", new Seme(
    {
        arity: 4,
        whoAmI: "editor",
        func: tileCreatorFactory("editor")
    },
    "native",
    []
));



defineSeme(universe, "console", new Seme(
    {
        arity: 4,
        whoAmI: "console",
        func: tileCreatorFactory("console")
    },
    "native",
    []
));



defineSeme(universe, "board", new Seme(
    {
        arity: 4,
        whoAmI: "board",
        func: tileCreatorFactory("board")
    },
    "native",
    []
));



defineSeme(universe, "grid", new Seme(
    {
        arity: 4,
        whoAmI: "grid",
        func: function(tileName, x, y, icon) {

            if (expect("grid",[
                {
                    seme: tileName,
                    requirements: { expectedTypes: ["name"] }
                },
                {
                    seme: icon,
                    requirements: { expectedTypes: ["name"] }
                },
                {
                    seme: x,
                    requirements: {
                        expectedTypes: ["number"],
                        shouldBeInteger: true,
                        range: { min: 1 }
                    }
                },
                {
                    seme: y,
                    requirements: {
                        expectedTypes: ["number"],
                        shouldBeInteger: true,
                        range: { min: 1 }
                    }
                },
            ])) {
                postMessage({
                action: "setGrid",
                content: {
                    tileName: tileName.value,
                    x: x.value-1,
                    y: y.value-1,
                    icon: icon.value
                    }
                });
            }
            return nothing;
        }
    },
    "native",
    []
));



defineSeme(universe, "read", new Seme(
    {
        arity: 1,
        whoAmI: "read",
        func: function(tileName) {

            if (expect("read",[
                {
                    seme: tileName,
                    requirements: {
                        expectedTypes: [ "name" ]
                    }
                }
            ])) {
                postMessage({
                    action: "readTileContent",
                    content: tileName.value
                });
                suspended = true;
            }
            return nothing;
        }
    },
    "native",
    []
));



defineSeme(universe, "write", new Seme(
    {
        arity: 2,
        whoAmI: "write",
        func: function(tileName, txt) {

            if (expect("write",[
                {
                    seme: tileName,
                    requirements: {
                        expectedTypes: [ "name" ]
                    }
                }
            ])) {
                postMessage({
                    action: "writeTileContent",
                    content: {
                        tileName: tileName.value,
                        txt: txt.value
                    }
                });
            }
            return nothing;
        }
    },
    "native",
    []
));



defineSeme(universe, "color", new Seme(
    {
        arity: 2,
        whoAmI: "color",
        func: function(tileName, color) {

            if (expect("color",[
                {
                    seme: tileName,
                    requirements: {
                        expectedTypes: [ "name" ]
                    }
                },
                {
                    seme: color,
                    requirements: {
                        expectedTypes: [ "number" ],
                        shouldBeInteger: true,
                        range: { min: 0, max: 360 }
                    }
                }
            ])) {
                postMessage({
                    action: "setTileColor",
                    content: {
                        tileName: tileName.value,
                        color: color.value
                    }
                });
            }
            return nothing;
        }
    },
    "native",
    []
));



defineSeme(universe, "locate", new Seme(
    {
        arity: 2,
        whoAmI: "locate",
        func: function(tileName, coordinates) {

            if (expect("locate",[
                {
                    seme: tileName,
                    requirements: {
                        expectedTypes: [ "name" ]
                    }
                },
                {
                    seme: coordinates,
                    requirements: { expectedFormat: "tile coordinates" }
                }
                ])) {
                var cr = getColRow(coordinates.value);
                postMessage({
                    action: "locateTile",
                    content: {
                        tileName: tileName.value,
                        column: cr.col,
                        row: cr.row
                    }
                });
            }
            return nothing;
        }
    },
    "native",
    []
));



defineSeme(universe, "resize", new Seme(
    {
        arity: 3,
        whoAmI: "resize",
        func: function(tileName, width, height) {

            if (expect("resize",[
                {
                    seme: tileName,
                    requirements: {
                        expectedTypes: [ "name" ]
                    }
                },
                {
                    seme: width,
                    requirements: {
                        expectedTypes: ["number"],
                        shouldBeInteger: true,
                        range: { min: 1 }
                    }
                },
                {
                    seme: height,
                    requirements: {
                        expectedTypes: ["number"],
                        shouldBeInteger: true,
                        range: { min: 1 }
                    }
                },
                ])) {
                postMessage({
                    action: "resizeTile",
                    content: {
                        tileName: tileName.value,
                        width: width.value,
                        height: height.value
                    }
                });
            }
            return nothing;
        }
    },
    "native",
    []
));



defineSeme(universe, "gridsize", new Seme(
    {
        arity: 3,
        whoAmI: "gridsize",
        func: function(tileName, width, height) {

            if (expect("gridsize",[
                {
                    seme: tileName,
                    requirements: {
                        expectedTypes: [ "name" ]
                    }
                },
                {
                    seme: width,
                    requirements: {
                        expectedTypes: ["number"],
                        shouldBeInteger: true,
                        range: { min: 1 }
                    }
                },
                {
                    seme: height,
                    requirements: {
                        expectedTypes: ["number"],
                        shouldBeInteger: true,
                        range: { min: 1 }
                    }
                },
                ])) {
                postMessage({
                    action: "resizeGrid",
                    content: {
                        tileName: tileName.value,
                        width: width.value,
                        height: height.value
                    }
                });
            }
            return nothing;
        }
    },
    "native",
    []
));


