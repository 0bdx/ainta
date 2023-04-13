# @0bdx/ainta

__Utilities for validating values in 0bdx apps, libraries and websites.__

∅&nbsp; __Version:__ 0.0.16  
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

In the example below, `narrowAintas()` is used to narrow `aintaNumber()`
into `aintaNatural()`, and then capture its validation results:

- `begin:'bothNatural()'` sets a prefix, added to all explanations
- `gte:0` checks that the value is not negative
- `mod:1` checks that the value is an integer
- `lte:1000` and `lte:50` specify different maximum values for each argument
- `if (results.length)` checks whether there were any problems

```js
import narrowAintas, { aintaNumber } from '@0bdx/ainta';

function bothNatural(a, b) {
    const [ results, aintaNatural ] = narrowAintas(
        { begin:'bothNatural()', gte:0, mod:1 },
        aintaNumber
    );
    aintaNatural(a, 'a', { lte:1000 });
    aintaNatural(b, 'b', { lte:50 });
    if (results.length) return results;
    return "a and b are both natural numbers, in range!";
}

bothNatural(-5, 12.34);
// [ "bothNatural(): `a` -5 is not gte 0",
//   "bothNatural(): `b` 23.45 is not divisible by 1" ]

bothNatural(99, 200);
// [ "bothNatural(): `b` 200 is not lte 50" ]

bothNatural(12, 3);
// "a and b are both natural numbers, in range!"
```
