let Cache = () => ({
    data: {}, // flat object (no depth) where the keys are reference-strings (e.g. "#/key1/key2") and the values are the values

    getReferenceStringForValue(val) {
        return Object.entries(this.data).find(([k, v]) => v === val)[0] // note that === is pointer comparison
    },

    isValueSeen(val) {
        return Object.values(this.data).includes(val)
    },

    add(path, val) {
        this.data[path] = val
    },

    getValueFromReferenceString(referenceString) {
        return this.data[referenceString]
    },

})

module.exports.Cache = Cache