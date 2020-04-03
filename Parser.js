let {speacialRootChar} = require("./Config")
let {Cache} = require("./ExistingValuesCache")

let buildCache = (obj, existingValues, basePath) => {
    if(typeof(obj) === "object") {
        Object.entries(obj).map(([key, val]) => {
            if(typeof(val) !== "string" || val.charAt(0) !== speacialRootChar) {
                let currentPath = basePath + "/" + key
                existingValues.add(currentPath, val)
                buildCache(val, existingValues, currentPath) // fix val
            }
        })
    }
}

let resolveReferences = (obj, existingValues) => {
    if(typeof(obj) === "object") {
        Object.entries(obj).map(([key, val]) => {
            if(typeof(val) === "string" && val.charAt(0) === speacialRootChar) {
                // assume it is a reference
                obj[key] = existingValues.getValueFromReferenceString(val)
            } else {
                resolveReferences(val, existingValues) // fix val
            }
        })
    }
}

let parser = str => {
    let obj = JSON.parse(str)
    let existingValues = Cache()
    buildCache(obj, existingValues, speacialRootChar)
    resolveReferences(obj, existingValues)
    return obj
}

module.exports.parser = parser