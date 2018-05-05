


semes = {}; // explicit semes



function Seme(value, type, protoList, helpComment) {

    this.id = '#'; // no id
    this.value = value;
    this.type = type;
    this.protoList = protoList;
    this.names = {};
    this.links = 0;
}



Seme.prototype.makeImplicit = function() {

    var name = this.names;
    delete semes[this.id];
    for (var n in name) {
        semes[name[n]].links -= 1;
        if (semes[name[n]].links <= 0)
            semes[name[n]].makeImplicit();
    }
};



Seme.prototype.setName = function(name, targetId) {

    this.names[name] = targetId;
    semes[targetId].links += 1;
};



Seme.prototype.getName = function(name) {

    return this.name[target];
};



Seme.prototype.againstRequirements = function(requirements) {

    if (requirements.expectedTypes)
        if (!requirements.expectedTypes.includes(this.type))
            return {
                id: 2,
                description: `needs a ${requirements.expectedTypes.join(' or ')} (got a ${this.type}: "${this.value}")`
            };

    if ((requirements.expectedFormat == "tile coordinates")
        && (!/^[A-Z]\d+$/.test(this.value))) {
            
        return {
            id: 4,
            description: `needs coordinates (got: ${this.value})`
        };
    }

    if ((requirements.shouldBeInteger)
        && (this.value !== parseInt(this.value)))
        return {
            id: 5,
            description: `needs an integer (got: ${this.value})`
        };

    if (requirements.range) {
        var outcome = true;
        if (requirements.range.min)
            outcome = outcome && this.value >= requirements.range.min;
        if (requirements.range.max)
            outcome = outcome && this.value <= requirements.range.max;
        if (!outcome) {
            var desc;
            if (requirements.range.min && requirements.range.max)
                desc = `needs a number between ${requirements.range.min} and ${requirements.range.max} (got: ${this.value})`;
            if (requirements.range.min)
                desc = `needs a number that's not less than ${requirements.range.min} (got: ${this.value})`;
            if (requirements.range.max)
                desc = `needs a number that's not greater than ${requirements.range.max} (got: ${this.value})`;
            return {
                id: 6,
                description: desc
            };
        }
    }

    if ((requirements.notEmpty)
        && (this.value.toString().trim() == ''))
        return {
            id: 7,
            description: `needs a non-empty value`
        };

    if (requirements.castableTo) {

        if (requirements.castableTo.includes("name"))
            if (/\s/.test(this.value))
                return {
                    id: 8,
                    description: `needs a valid name format (got: ${this.value})`
                };

        if (requirements.castableTo.includes("number"))
            if (isNaN(this.value))
                return {
                    id: 9,
                    description: `needs a valid number format (got: ${this.value})`
                };

        if (requirements.castableTo.includes("boolean"))
            if (!((String.prototype.toLowerCase(item.token) == "true") || (String.prototype.toLowerCase(item.token) == "false")))
                return {
                    id: 10,
                    description: `needs a valid boolean format (got: ${this.value})`
                };
        }
        

    return false
};



Seme.prototype.toString = function() {

    if (this.value.whoAmI) return this.value.whoAmI;

    if (this.type == "block")
        return '['+this.value+']';

    else if (this.type == "name")
        return "'"+this.value;

    else
        return this.value;
}



Seme.prototype.isEqual = function(seme) {
    return ((this.type == seme.type) &&
        (this.value == seme.value));
}



function makeSemeExplicit(seme) {

    var id = newId();
    seme.id = id;
    semes[id] = seme;
    return id;
};



var newId = (function(){
    var current = "0";
    var addOne = function(s) {
        let newNumber = '';
        let continueAdding = true;
        for (let i = s.length - 1; i>= 0; i--) {
            if (continueAdding) {
                let num = parseInt(s[i], 10) + 1;
                if (num < 10) {
                    newNumber += num;
                    continueAdding = false;
                } else {
                    newNumber += '0';
                    if (i==0) newNumber += '1';
                }
            } else {  
                newNumber +=s[i];
            }
        }
        return newNumber.split("").reverse().join("");
    }	
    return function() {
        current = addOne(current);
        return "#"+current;
    };
})();



function getOriginalSeme(representation) {

    if (!representation || (representation == nothing))
        return s_nothing;

    var semeName = representation.toString();

    // boolean
    if ((semeName == "true") || (semeName == "false")) return new Seme(
        (semeName == "true"),
        "boolean",
        ["#3"] // s_boolean
    );

    // number
    if (!isNaN(semeName)) return new Seme(
        parseFloat(semeName),
        "number",
        ["#4"] // s_number
    );

    // block
    if (((semeName.startsWith('[')) && (semeName.endsWith(']'))) ||
        ((semeName.startsWith('"')) && (semeName.endsWith('"')))) return new Seme(
        semeName.substring(1,semeName.length-1),
        "block",
        ["#5"] // s_block
    );

    // name
    return new Seme(
        semeName,
        "name",
        ["#2"] // s_name
    );
}



function getActualSeme(envId, semeName) {

    var outcome = lookup(env[envId].host, semeName)
    protoLoop = [];

    if (outcome != lookupFailed)
        return outcome;

    else {
        if (envId < env.length-1)
            return getActualSeme(envId+1, semeName);
        else
            return getOriginalSeme(semeName);
    }
}



var protoLoop = [];



function lookup(where, semeName) {

    if (protoLoop.includes(where)) return lookupFailed;
    protoLoop.push(where);

    if (where.names[semeName])
        return semes[where.names[semeName]];

    else {

        for (var p=0; p<where.protoList.length; p++) {

            var outcome = lookup(semes[where.protoList[p]], semeName);
            if (outcome != lookupFailed) return outcome;
        }

        return lookupFailed;
    }        
}



function defineSeme(host, semeName, newSeme) {

    var newSemeId = (newSeme.id == '#') ? makeSemeExplicit(newSeme) : newSeme.id;

    host.setName(semeName, newSemeId);

    return newSemeId;
}



function getSemeList(source) {

    var parsed = parse(source);
    var list = [];
    
    for (var p=0; p<parsed.length; p++) {

        list.push(getOriginalSeme(parsed[p].token));
    }
    return list;
}