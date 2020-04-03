let {speacialRootChar} = require("./Config")
let {Cache} = require("./ExistingValuesCache")

let replaceDuplicateReferencesWithReferenceStrings = (obj, existingValues, basePath) => {
    if(typeof(obj) === "object") {
        Object.entries(obj).map(([key, val]) => {
            if(existingValues.isValueSeen(val)) {
                obj[key] = existingValues.getReferenceStringForValue(val)
            } else {
                let currentPath = basePath + "/" + key
                existingValues.add(currentPath, val)
                replaceDuplicateReferencesWithReferenceStrings(val, existingValues, currentPath) // fix val
            }
        })
    }
}

stringifier = obj => {
    replaceDuplicateReferencesWithReferenceStrings(obj, Cache(), speacialRootChar) // mutates obj
    return JSON.stringify(obj)
}

module.exports.stringifier = stringifier