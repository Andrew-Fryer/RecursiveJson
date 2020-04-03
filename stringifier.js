
// existingValues will be a flat object (no depth) where the keys are reference-strings (e.g. "#/key1/key2") and the values are the values

// === must be pointer comparison
getReferenceString = (val, existingValues) => Object.entries(existingValues).find(([k, v]) => v === val)[0]
isValueSeen = (val, existingValues) => Object.values(existingValues).includes(val)

// Object -> Object
replaceDuplicateReferencesWithReferenceStrings = (obj, existingValues, basePath) => {
    if(typeof(obj) === "object") {
        Object.entries(obj).map(([key, val]) => {
            if(isValueSeen(val, existingValues)) {
                obj[key] = getReferenceString(val, existingValues)
            } else {
                currentPath = basePath + "/" + key
                existingValues[currentPath] = val // add to cache
                replaceDuplicateReferencesWithReferenceStrings(val, existingValues, currentPath) // fix val
            }
        })
    }
}

// Object -> String
stringifier = obj => {
    replaceDuplicateReferencesWithReferenceStrings(obj, {}, "#") // mutates obj
    return JSON.stringify(obj)
}

getValue = (referenceString, existingValues) => existingValues[referenceString]



// Object -> Object
buildCache = (obj, existingValues, basePath) => {
    if(typeof(obj) === "object") {
        Object.entries(obj).map(([key, val]) => {
            if(typeof(val) !== "string" || val.charAt(0) !== "#") {
                currentPath = basePath + "/" + key
                existingValues[currentPath] = val // add to cache
                buildCache(val, existingValues, currentPath) // fix val
            }
        })
    }
}

// Object -> Object
resolveReferences = (obj, existingValues) => {
    if(typeof(obj) === "object") {
        Object.entries(obj).map(([key, val]) => {
            if(typeof(val) === "string" && val.charAt(0) === "#") {
                // assume it is a reference
                obj[key] = getValue(val, existingValues)
            } else {
                resolveReferences(val, existingValues) // fix val
            }
        })
    }
}

// String -> Object
parser = str => {
    obj = JSON.parse(str)
    existingValues = {}
    buildCache(obj, existingValues, "#")
    resolveReferences(obj, {})
    return obj
}

// Test:
obj = {
    "a": {},
    "c": {},
}
obj.b = obj.a
obj.c.d = obj.a

console.log(obj)

str = stringifier(obj)
console.log(str)

console.log(parser(str))


/* _____________________________________________________________________________________
Here's the plan:
-tranverse the object
    -everytime we encounter a value we check if it is in our 'cache'
        -if it is we just "return" the reference string
        -if it isn't then we first have to add an entry to the cache, and then call f on the value and then "return" the reference value
    

Here is the immediate issue:
Deciding where to put the value and where to put the reference is artibrary.
So, we will arbitrarily (because I don't want to rely on ordering garantees from js on keys in an object) put the value in the first time we see it and then refer to it by that position later on.
When we parse this in, we may come across a reference to a value we have never seen before. I'm saying now that that is okay. We will make 2 passes. We will build up the cache on the first, and build the full object on the second.

Second issue:
Will I need to treat arrays any differently from objects?

Third issue:
Ideally, I'd like a whole data type for references to values elsewhere in the Json. We're going to use strings and assume that anything begining with "#" is a refernce.

TODO: make cache its own class
*/