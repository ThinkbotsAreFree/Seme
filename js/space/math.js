


defineSeme(universe, "+", new Seme(
    {
        arity: 2,
        whoAmI: "+",
        func: function(a, b) {

            if (expect("+",[
                {
                    seme: a,
                    requirements: { expectedTypes: ["number"] }
                },
                {
                    seme: b,
                    requirements: { expectedTypes: ["number"] }
                }
            ])) {
                    return new Seme(a.value + b.value, "number", [s_number]);

            } else return nothing;
        }
    },
    "native",
    []
));



defineSeme(universe, "-", new Seme(
    {
        arity: 2,
        whoAmI: "-",
        func: function(a, b) {

            if (expect("-",[
                {
                    seme: a,
                    requirements: { expectedTypes: ["number"] }
                },
                {
                    seme: b,
                    requirements: { expectedTypes: ["number"] }
                }
            ])) {
                return new Seme(a.value - b.value, "number", [s_number]);

            } else return nothing;
        }
    },
    "native",
    []
));



defineSeme(universe, "*", new Seme(
    {
        arity: 2,
        whoAmI: "*",
        func: function(a, b) {

            if (expect("*",[
                {
                    seme: a,
                    requirements: { expectedTypes: ["number"] }
                },
                {
                    seme: b,
                    requirements: { expectedTypes: ["number"] }
                }
            ])) {
                return new Seme(a.value * b.value, "number", [s_number]);

            } else return nothing;
        }
    },
    "native",
    []
));



defineSeme(universe, "/", new Seme(
    {
        arity: 2,
        whoAmI: "/",
        func: function(a, b) {

            if (expect("/",[
                {
                    seme: a,
                    requirements: { expectedTypes: ["number"] }
                },
                {
                    seme: b,
                    requirements: { expectedTypes: ["number"] }
                }
            ])) {
                return new Seme(a.value / b.value, "number", [s_number]);

            } else return nothing;
        }
    },
    "native",
    []
));



defineSeme(universe, "<", new Seme(
    {
        arity: 2,
        whoAmI: "<",
        func: function(a, b) {

            if (expect("<",[
                {
                    seme: a,
                    requirements: { expectedTypes: ["number"] }
                },
                {
                    seme: b,
                    requirements: { expectedTypes: ["number"] }
                }
            ])) {
                return new Seme(a.value < b.value, "boolean", [s_boolean]);

            } else return nothing;
        }
    },
    "native",
    []
));



defineSeme(universe, ">", new Seme(
    {
        arity: 2,
        whoAmI: ">",
        func: function(a, b) {

            if (expect(">",[
                {
                    seme: a,
                    requirements: { expectedTypes: ["number"] }
                },
                {
                    seme: b,
                    requirements: { expectedTypes: ["number"] }
                }
            ])) {
                return new Seme(a.value > b.value, "boolean", [s_boolean]);

            } else return nothing;
        }
    },
    "native",
    []
));



defineSeme(universe, "=", new Seme(
    {
        arity: 2,
        whoAmI: "=",
        func: function(a, b) {
            return new Seme(a.isEqual(b), "boolean", [s_boolean]);
        }
    },
    "native",
    []
));



defineSeme(universe, "<=", new Seme(
    {
        arity: 2,
        whoAmI: "<=",
        func: function(a, b) {

            if (expect("<=",[
                {
                    seme: a,
                    requirements: { expectedTypes: ["number"] }
                },
                {
                    seme: b,
                    requirements: { expectedTypes: ["number"] }
                }
            ])) {
                return new Seme(a.value <= b.value, "boolean", [s_boolean]);

            } else return nothing;
        }
    },
    "native",
    []
));



defineSeme(universe, ">=", new Seme(
    {
        arity: 2,
        whoAmI: ">=",
        func: function(a, b) {

            if (expect(">=",[
                {
                    seme: a,
                    requirements: { expectedTypes: ["number"] }
                },
                {
                    seme: b,
                    requirements: { expectedTypes: ["number"] }
                }
            ])) {
                return new Seme(a.value >= b.value, "boolean", [s_boolean]);

            } else return nothing;
        }
    },
    "native",
    []
));



defineSeme(universe, "!=", new Seme(
    {
        arity: 2,
        whoAmI: "!=",
        func: function(a, b) {
            return new Seme(!a.isEqual(b), "boolean", [s_boolean]);
        }
    },
    "native",
    []
));



defineSeme(universe, "&", new Seme(
    {
        arity: 2,
        whoAmI: "&",
        func: function(a, b) {

            if (expect("&",[
                {
                    seme: a,
                    requirements: { expectedTypes: ["boolean"] }
                },
                {
                    seme: b,
                    requirements: { expectedTypes: ["boolean"] }
                }
            ])) {
                return new Seme(a.value && b.value, "boolean", [s_boolean]);

            } else return nothing;
        }
    },
    "native",
    []
));



defineSeme(universe, "|", new Seme(
    {
        arity: 2,
        whoAmI: "|",
        func: function(a, b) {

            if (expect("|",[
                {
                    seme: a,
                    requirements: { expectedTypes: ["boolean"] }
                },
                {
                    seme: b,
                    requirements: { expectedTypes: ["boolean"] }
                }
            ])) {
                return new Seme(a.value || b.value, "boolean", [s_boolean]);

            } else return nothing;
        }
    },
    "native",
    []
));



defineSeme(universe, "!", new Seme(
    {
        arity: 1,
        whoAmI: "!",
        func: function(a) {

            if (expect("!",[
                {
                    seme: a,
                    requirements: { expectedTypes: ["boolean"] }
                }
            ])) {
                return new Seme(!a.value, "boolean", [s_boolean]);

            } else return nothing;
        }
    },
    "native",
    []
));


