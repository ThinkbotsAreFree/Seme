
    

defineSeme(universe, "set", new Seme(
    {
        arity: 2,
        whoAmI: "set",
        func: function(semeName, newSeme) {

            if (expect("set",[
                {
                    seme: semeName,
                    requirements: { expectedTypes: ["name"] }
                }
            ])) {
                defineSeme(env[0].host, semeName.value, newSeme);
            }
            return nothing;
        }
    },
    "native",
    []
));

    

defineSeme(universe, "get", new Seme(
    {
        arity: 1,
        whoAmI: "get",
        func: function(semeName) {

            if (expect("get",[
                {
                    seme: semeName,
                    requirements: { expectedTypes: ["name"] }
                }
            ])) {
                return getActualSeme(0, semeName.value);

            } else return nothing;
        }
    },
    "native",
    []
));



defineSeme(universe, "as", new Seme(
    {
        arity: 3,
        whoAmI: "as",
        func: function(target, slotName, newSeme) {

            if (expect("as",[
                {
                    seme: slotName,
                    requirements: { expectedTypes: ["name"] }
                }
            ]))
                defineSeme(target, slotName.value, newSeme);
            return nothing;
        }
    },
    "native",
    []
));



defineSeme(universe, "of", new Seme(
    {
        arity: 2,
        whoAmI: "of",
        func: function(target, slotName) {

            if (expect("of",[
                {
                    seme: slotName,
                    requirements: { expectedTypes: ["name"] }
                }
            ])) {                
                return (lookup(target, slotName.value) || nothing);
            }
            return nothing;
        }
    },
    "native",
    []
));

    

defineSeme(universe, "namesof", new Seme(
    {
        arity: 1,
        whoAmI: "namesof",
        func: function(host) {
            return new Seme(
                Object.keys(host.names).join(' '),
                "block",
                [s_block]
            );
        }
    },
    "native",
    []
));



defineSeme(universe, "typeof", new Seme(
    {
        arity: 1,
        whoAmI: "typeof",
        func: function(seme) {
            return new Seme(
                seme.type,
                "block",
                [s_block]
            );
        }
    },
    "native",
    []
));



defineSeme(universe, "here", new Seme(
    {
        arity: 0,
        whoAmI: "here",
        func: function() {
            return env[0].host;
        }
    },
    "native",
    []
));

    

defineSeme(universe, "to", new Seme(
    {
        arity: 3,
        whoAmI: "to",
        func: function(semeName, argList, fBody) {

            if (expect("to",[
                {
                    seme: semeName,
                    requirements: { expectedTypes: ["name"] }
                },
                {
                    seme: argList,
                    requirements: { expectedTypes: ["block"] }
                },
                {
                    seme: fBody,
                    requirements: { expectedTypes: ["block"] }
                }
            ])) {            
                var id = defineSeme(env[0].host, semeName.value, fBody);            
                defineSeme(semes[id], "input", argList);
            }
            return nothing;
        }
    },
    "native",
    []
));

    

defineSeme(universe, "isa", new Seme(
    {
        arity: 2,
        whoAmI: "isa",
        func: function(target, newProto) {

            target.protoList.push(newProto.id);
            return nothing;
        }
    },
    "native",
    []
));

    

defineSeme(universe, "isnt", new Seme(
    {
        arity: 2,
        whoAmI: "isnt",
        func: function(target, delProto) {

            var index = target.protoList.indexOf(delProto.id);
            if (index > -1) target.protoList.splice(index, 1);
            return nothing;
        }
    },
    "native",
    []
));

    

defineSeme(universe, "output", new Seme(
    {
        arity: 1,
        whoAmI: "output",
        func: function(returnValue) {
            env.shift();
            env[0].readySemes.push(returnValue);
            return nothing;
        }
    },
    "native",
    []
));

    

defineSeme(universe, "do", new Seme(
    {
        arity: 1,
        whoAmI: "do",
        func: function(doBlock) {

            if (expect("do",[
                {
                    seme: doBlock,
                    requirements: { expectedTypes: ["block"] }
                }
            ])) {
                env[0].prependProgram(doBlock.value);
            }
            return nothing;
        }
    },
    "native",
    []
));

    

defineSeme(universe, "in", new Seme(
    {
        arity: 2,
        whoAmI: "in",
        func: function(host, doBlock) {

            if (expect("in",[
                {
                    seme: doBlock,
                    requirements: { expectedTypes: ["block"] }
                }
            ])) {
                createNewEnvironment(host);
                env[0].loadProgram(doBlock.value);
            }
            return nothing;
        }
    },
    "native",
    []
));

    

defineSeme(universe, "catch", new Seme(
    {
        arity: 2,
        whoAmI: "catch",
        func: function(catchTags, doBlock) {

            if (expect("catch",[
                {
                    seme: catchTags,
                    requirements: { expectedTypes: ["block"] }
                },
                {
                    seme: doBlock,
                    requirements: { expectedTypes: ["block"] }
                }
            ])) {
                env[0].catch = parseBlock(catchTags.value);
                createNewEnvironment(universe);
                env[0].loadProgram(doBlock.value);
                return env[0].throwValue;

            } else return nothing;
        }
    },
    "native",
    []
));

    

defineSeme(universe, "throw", new Seme(
    {
        arity: 2,
        whoAmI: "throw",
        func: function(catchTag, output) {

            if (expect("throw",[
                {
                    seme: catchTag,
                    requirements: { expectedTypes: ["name"] }
                }
            ]))
                envThrow(catchTag.value, output);
            return nothing;
        }
    },
    "native",
    []
));
    


defineSeme(universe, "if", new Seme(
    {
        arity: 2,
        whoAmI: "if",
        func: function(condition, thenBlock) {

            if (expect("if",[
                {
                    seme: condition,
                    requirements: { expectedTypes: ["boolean"] }
                },
                {
                    seme: thenBlock,
                    requirements: { expectedTypes: ["block"] }
                }
            ])) {
                if (condition.value)
                    env[0].prependProgram(thenBlock.value);
            }
            return nothing;
        }
    },
    "native",
    []
));

    

defineSeme(universe, "ife", new Seme(
    {
        arity: 3,
        whoAmI: "ife",
        func: function(condition, thenBlock, elseBlock) {

            if (expect("ife",[
                {
                    seme: condition,
                    requirements: { expectedTypes: ["boolean"] }
                },
                {
                    seme: thenBlock,
                    requirements: { expectedTypes: ["block"] }
                },
                {
                    seme: elseBlock,
                    requirements: { expectedTypes: ["block"] }
                }
            ])) {
                if (condition.value)
                    env[0].prependProgram(thenBlock.value);
                else
                    env[0].prependProgram(elseBlock.value);
            }
            return nothing;
        }
    },
    "native",
    []
));


