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

aintaBoolean(true);
// false

aintaBoolean(1234);
// "A value is type 'number' not 'boolean'"

aintaBoolean(null, 'isDone', { begin:'doThings()' });
// "doThings(): `isDone` is null not type 'boolean'"
```

### Using the `narrowAintas()` helper:

In the example below, `narrowAintas()` is used to narrow `aintaInteger()`
into `naInteger()`, and then capture its validation results:

- `begin:'bothNatural()'` sets a prefix, added to all explanations
- `gte:0` checks that the value is not negative
- `lte:1000` and `lte:50` specify different maximum values for each argument
- `if (results.length)` checks whether there were any problems

```js
import narrowAintas, { aintaInteger } from '@0bdx/ainta';

function bothNatural(a, b) {
    const [ results, naInteger ] = narrowAintas(
        { begin:'bothNatural()', gte:0 },
        aintaInteger
    );
    naInteger(a, 'a', { lte:1000 });
    naInteger(b, 'b', { lte:50 });
    if (results.length) return results;
    return "a and b are both natural numbers, in range!";
}

bothNatural(-5, 0.25);
// [ "bothNatural(): `a` is -5 not gte 0",
//   "bothNatural(): `b` is 0.25 not an integer" ]

bothNatural(99, 200);
// [ "bothNatural(): `b` is 200 not lte 50" ]

bothNatural(12, 3);
// "a and b are both natural numbers, in range!"
```
