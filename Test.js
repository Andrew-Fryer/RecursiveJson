let {parser} = require("./Parser")
let {stringifier} = require("./Stringifier")

bar = "bar"
blart = {}
blart.next = blart
obj = {
    "a": {},
    "c": {
        "asdf" : bar,
    },
    "foo" : bar,
    "blart" : blart,
}
obj.b = obj.a
obj.c.d = obj.a

console.log(obj)

str = stringifier(obj)
console.log(str)

console.log(parser(str))