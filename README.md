# @0bdx/ainta

Utilities for validating values in 0bdx apps, libraries and websites.

∅&nbsp; __Version:__ 0.0.1  
∅&nbsp; __NPM:__ <https://www.npmjs.com/package/@0bdx/ainta>  
∅&nbsp; __Repo:__ <https://github.com/0bdx/ainta>  
∅&nbsp; __Homepage:__ <https://0bdx.com/ainta>

@TODO add an overview

### Typical usage:

```js
import bindAintas, { aintaInteger } from '@0bdx/ainta';

function sayOk(n) {
    const [ messages, aintaInt ] = bindAintas('sayOk()', aintaInteger);
    if (aintaInt(n, 'n', 0, 2000)) return messages;
    return 'ok!';
}

sayOk(null); // sayOk(): 'n' is null not type 'number'
sayOk(7777); // sayOk(): 'n' 7777 is greater than 2000
sayOk(1234); // ok!
```
