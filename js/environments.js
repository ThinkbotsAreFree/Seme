


function Environment(host) {

    this.host = host;
    this.program = [];
    this.readySemes = [];
    this.outputSemes = [];
    this.receiver = host;
    this.accessFlag = false;
    this.applyFlag = false;
    this.consumers = [];
    this.catch = [];
    this.throwValue = nothing;
    this.error = false;
}



Environment.prototype.loadProgram = function(source) {

    this.program = parse(source);
    
    this.receiver = this.host;
};



Environment.prototype.step = function() {

    if (this.readySemes.length == 0) {

        var programItem = this.pullFromProgramPushToReadySemes();
        this.setActionFlags(programItem);
    }

    this.dispatchSeme(this.readySemes.shift());

    if (debug) this.debugRefreshWatchers();
};



Environment.prototype.debugRefreshWatchers = function() {
    postMessage({
        action: "log",
        content: {
            watcherId: "receiver",
            output: JSON.stringify(env[0].receiver,null,4)
        }
    });
    postMessage({
        action: "log",
        content: {
            watcherId: "readySemes",
            output: JSON.stringify(env[0].readySemes,null,4)
        }
    });
    postMessage({
        action: "log",
        content: {
            watcherId: "consumers",
            output: JSON.stringify(env[0].consumers,null,4)
        }
    });
    postMessage({
        action: "log",
        content: {
            watcherId: "program",
            output: JSON.stringify(env[0].program,null,4)
        }
    });
};



Environment.prototype.pullFromProgramPushToReadySemes = function() {

    var programItem = this.program.shift();
    var seme = this.fetchSeme(programItem);

    if (this.accessFlag) this.prepareAccessor();

    this.readySemes.push(seme);
    return programItem;
};



Environment.prototype.fetchSeme = function(programItem) {

    var seme;
    var pathLength = programItem.path.length-1;

    if (pathLength <= 0) {

        seme = (programItem.quote || programItem.block) ?
            getOriginalSeme(programItem.token) :
            getActualSeme(0, programItem.token);

    } else  {

        seme = programItem.quote ?
            getOriginalSeme(programItem.path[0]) :
            getActualSeme(0, programItem.path[0]);

        var pathFinder = 0;
        while ((pathFinder < pathLength) &&  (seme != lookupFailed)) {
            pathFinder += 1;
            seme = lookup(seme, programItem.path[pathFinder]);
            protoLoop = [];
        }
    }
    return seme;
;}



Environment.prototype.prepareAccessor = function() {

    this.consumers.unshift({
        "seme": {
            "id": "#",
            "value": {
                "whoAmI": "accessor",
                "arity": 2,
                "func": function(host, slot) {
                    var result = lookup(host, slot.value);
                    protoLoop = [];
                    return result;
                }
            },
            "type": "native",
            "protoList": [],
            "names": {},
            "links": 0
        },
        "arity": 2,
        "inbox": [
            this.receiver
        ]
    });
};



Environment.prototype.setActionFlags = function(programItem) {

    this.accessFlag = programItem.access;
    this.applyFlag = programItem.apply;
};



Environment.prototype.dispatchSeme = function(seme) {
//log(seme);
    if (this.accessFlag) {

        this.receiver = seme;

    } else {
        this.receiver = this.host;

        if (this.applyFlag)
            this.makeNewConsumer(seme);
        else
            this.makeNewProduct(seme);
    }
};



Environment.prototype.makeNewConsumer = function(seme) {

    this.consumers.unshift({
        seme: seme,
        arity: this.getArity(seme),
        inbox: []
    });
    this.applyFlag = false;
    this.checkReadyToCall(this.consumers[0]);
};



Environment.prototype.getArity = function(seme) {

    if (seme.type == "native")

        return seme.value.arity;

    else if (seme.type == "block") {

        if (semes[seme.names["input"]])
            return parse(semes[seme.names["input"]].value).length;
        else
            return 0;

    } else {
        this.error = {
            id: 2,
            description: `needs an executable (got a ${seme.type}: "${seme.value}")`
        };
    }
};



Environment.prototype.makeNewProduct = function(seme) {

    if (this.consumers.length == 0) {

        var val = seme.value.whoAmI || seme.value;
        this.error = {
            id: 1,
            description: `Unused value "${val}"`
        };

    } else {
        this.consumers[0].inbox.push(seme);
        this.checkReadyToCall(this.consumers[0]);
    }
};



Environment.prototype.checkReadyToCall = function(consumer) {

    if (consumer.inbox.length == consumer.arity) this.makeCall(consumer);
};



Environment.prototype.makeCall = function(consumer) {

    if (consumer.seme.type == "native") {

        var output = consumer.seme.value.func.apply(this, consumer.inbox);
        if (!this.error)
            if (output != nothing)
                this.readySemes.unshift(output);

    } else {

        var newEnvHost = new Seme('', "block", []);

        var argNames = parseBlock(semes[consumer.seme.names.input].value);

        for (var a=0; a<consumer.arity; a++) {

            defineSeme(newEnvHost, argNames[a], consumer.inbox[a]);
        }

        createNewEnvironment(newEnvHost);
        env[0].loadProgram(consumer.seme.value);
    }

    this.consumers.shift();
};



Environment.prototype.prependProgram = function(source) {

    this.program = parse(source).concat(this.program);
}



env = [];



function createNewEnvironment(host) {

    env.unshift(new Environment(host));
}



function terminateEnvironment() {

    for (var n in env[0].names)
        semes[env[0].host.names[n]].makeImplicit();
    env.shift();
}


