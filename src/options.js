/**
 * ### A configuration object, used by all `ainta` functions.
 * 
 * Each option is actually optional, so an empty object `{}` is perfectly valid.
 * 
 * Different options are used by different `ainta` functions. For example:
 * - `options.before` is used all the `ainta` functions
 * - `options.enum` is only used by `aintaString()` and `aintaArray()`
 * - `options.gte` is only used by `aintaNumber()`
 *
 * @typedef {Object} Options
 * @property {string} [begin]
 *    Optional text to begin the result with, eg a function name like "isOk()".
 * @property {string[]} [enum]
 *    Optional array of strings. TODO discuss
 * @property {number} [gte]
 *    Optional minimum value. Short for 'Greater Than or Equal'.
 * @property {number} [lte]
 *    Optional maximum value. Short for 'Less Than or Equal'.
 * @property {number} [max]
 *    Optional maximum length of a string. TODO or array?
 * @property {number} [min]
 *    Optional minimum length of a string. TODO or array?
 * @property {number} [mod]
 *    Optional modulo which `value` must divide into without a remainder.
 * @property {Rxish} [rx]
 *    Optional object with a `test()` function. Typically a JavaScript `RegExp`.
 * @property {'bigint'|'boolean'|'function'|'number'|'object'|'string'|'symbol'|'undefined'} [type]
 *    Optional JavaScript type to expect, eg "boolean" or "undefined".
 */

/**
 * ### An object with a `test()` function. Typically a JavaScript `RegExp`.
 * 
 * @typedef {Object} Rxish
 * @property {function(string):boolean} test
 *    The test function, which takes a string and returns `true` if it passes
 *    and `false` if it fails.
 */

/**
 * ### An empty object with the `Options` type, used by all `ainta` functions.
 * 
 * Using an empty `{}` is really a way to export the `Options` type, and avoid a
 * "File '.../ainta/src/options.js' is not a module. ts(2306)" error.
 * 
 * @type Options
 */
const emptyOptions = {};
export default emptyOptions;
