


/*
 *
 * helpers
 * 
 */



function log(txt) {

    postMessage({action:"consolelog",content:JSON.stringify(txt,null,4)});
}



/*
 *
 * Symbols
 * 
 */



var nothing = Symbol("nothing");
var lookupFailed = Symbol("lookupFailed");



/*
 *
 * Parsers
 * 
 */


importScripts("parsers.js");



/*
 *
 * Semes
 * 
 */



importScripts("semes.js");



var universe = getOriginalSeme("universe"); makeSemeExplicit(universe);         // #1
var s_name = getOriginalSeme("nameSeme"); makeSemeExplicit(s_name);             // #2
var s_boolean = getOriginalSeme("booleanSeme"); makeSemeExplicit(s_boolean);    // #3
var s_number = getOriginalSeme("numberSeme"); makeSemeExplicit(s_number);       // #4
var s_block = getOriginalSeme("blockSeme"); makeSemeExplicit(s_block);          // #5
var s_nothing = getOriginalSeme("nothingSeme"); makeSemeExplicit(nothing);      // #6



/*
 *
 * Environments
 * 
 */



importScripts("environments.js");



createNewEnvironment(universe);

    

/*
 *
 * Space
 * 
 */



function expect(executor, argReq) {

    for (var ar=0; ar<argReq.length; ar++) {

        var problem = argReq[ar].seme.againstRequirements(argReq[ar].requirements);

        if (problem) {
            env[0].error = {
                id: problem.id,
                description: `"${executor}" ${problem.description}`
            };
            return false;
        }
    }
    return true;
}



importScripts("space/base.js");
importScripts("space/math.js");
importScripts("space/ui.js");
importScripts("space/logo.js");



/*
 *
 * Engine
 * 
 */



importScripts("help.js");



var debug = false;
var emergencyShutdown = false;
var parserError = false;



function checkUnsatisfiedConsumers() {

    if ((env[0].program.length == 0)
        && (env[0].readySemes.length == 0)
        && (env[0].consumers.length > 0))
        env[0].error = {
            id: 3,
            description: `"${env[0].consumers[0].seme.value.whoAmI || env[0].consumers[0].seme.value}" needs more arguments`
        };
}



function checkParserError() {

    if (parserError)
        env[0].error = {
            id: 0,
            description: "Syntax Error ("+parserError.slice(0,parserError.length-1)+")"
        };
    parserError = false;
}



function envThrow(catchTag, output) {

    while ((env.length > 1) && (!env[0].catch.includes(catchTag)))
        terminateEnvironment();

    if (output.value != nothing)
        env[0].readySemes.unshift(output);

    if ((!env[0].catch.includes(catchTag)) && (catchTag == "error")) {
        postMessage({
            action: "showError",
            content: output.value
        });
        emergencyShutdown = true;
    } else {
        env[0].error = false;
    }
}



function isThereFatalError() {

    if (!env[0].error) checkUnsatisfiedConsumers();
    if (!env[0].error) checkParserError();

    if (env[0].error)
        envThrow(
            "error", 
            new Seme("Error "+env[0].error.id+": "+env[0].error.description+'.',"block", [s_block])
        );
    
    if (emergencyShutdown) {
        toBeDone = [];
        env[0].program = [];
        env[0].readySemes = [];
        env[0].consumers = [];
    }

    env[0].error = false;
    return emergencyShutdown;
}



function stepRun() {

    if ((toBeDone.length > 0) || 
        (env[0].program.length > 0) ||
        (env[0].readySemes.length > 0)) {

        if ((!env[0].error) &&
            ((env[0].program.length > 0) || (env[0].readySemes.length > 0))) {

                env[0].step();

                if (!suspended) {
        
                    if (isThereFatalError()) return;

                    if ((env[0].program.length == 0)
                        && (env[0].readySemes.length == 0)
                        && (env.length > 1))
                        terminateEnvironment();
                }
                
        } else {

            if (toBeDone.length > 0) env[0].loadProgram(toBeDone.shift());
            isThereFatalError();

        }
    }
}



function run() {

    while ((
        (toBeDone.length > 0) ||
        (env[0].program.length > 0) ||
        (env[0].readySemes.length > 0)
    ) && (!suspended)) stepRun();
}



function resume() {

    suspended = false;
    run();
    // what did you expect?
}



var toBeDone = [];
var suspended = false;



onmessage = function(e) {

    if (e.data.order == "step") { stepRun(); return; }

    emergencyShutdown = false;

    if (e.data.debug) debug = true;

    if (e.data.order == "console input") {
        toBeDone.push(e.data.input);
        if (!debug)
            if (toBeDone.length == 1) run();
    }

    if (e.data.order == "requested value") {

        if (e.data.success)
            env[0].readySemes.unshift(getOriginalSeme(e.data.value));

        else env[0].error = {
            id: 11,
            description: `invalid tile name`
        };

        resume();
    }
}







