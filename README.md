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
