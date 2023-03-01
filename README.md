# @0bdx/ainta

Utilities for validating values in 0bdx apps, libraries and websites.

∅&nbsp; __Version:__ 0.0.1  
∅&nbsp; __NPM:__ <https://www.npmjs.com/package/@0bdx/ainta>  
∅&nbsp; __Repo:__ <https://github.com/0bdx/ainta>  
∅&nbsp; __Homepage:__ <https://0bdx.com/ainta>

@TODO add an overview

## Examples

### Basic usage:

```js
import { aintaBoolean } from '@0bdx/ainta';

function isBool(arg) {
    const result = aintaBoolean(arg, 'arg', { begin:'isBool()' });
    if (result) return result;
    return "It's a boolean!";
}

isBool(12345); // "isBool(): `arg` is type 'number' not 'boolean'"
isBool(false); // "It's a boolean!"
```

### Passing in the special `results` property:

```js
import { aintaStringArray } from '@0bdx/ainta';

function isStrArr(a) {
    const results = [];
    if (aintaStringArray(a, { max:2, results })) return results;
    return "It's an array of strings, and there's no more than two!";
}

isStrArr(12345); // [ "A value is type 'number' not an array" ]
isStrArr([8,9]); // [ "Item 0 of a value is type 'number' not 'string'" ]
isStrArr(['a']); // "It's an array of strings, and there's no more than two!"
```

### Typical usage of `adjustAintas()`:

```js
import adjustAintas, { aintaInteger } from '@0bdx/ainta';

function bothInts(a, b) {
    const [ results, aaInteger ] =
        adjustAintas({ begin:'bothInts()', gte:0 }, aintaInteger);
    aaInteger(a, 'a', { lte:1000 });
    aaInteger(b, 'b', { lte:50 });
    if (results.length) return results;
    return "a and b are both integers, and both in range!";
}

bothInts(1,99); // [ "bothInts(): `b` is 99 which is greater than 50" ]
bothInts(0.25); // [ "bothInts(): `a` is 0.25 not an integer",
                //   "bothInts(): `b` is type 'undefined' not 'number'" ]
bothInts(12,3); // "a and b are both integers, and both in range!"
```
