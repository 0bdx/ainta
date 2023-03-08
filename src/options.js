/**
 * ### A configuration object, used by all `ainta` functions.
 * 
 * Each option is actually optional, so an empty object `{}` is perfectly valid.
 * 
 * Different options are used by different `ainta` functions. For example:
 * - `options.keys` is only used by `aintaEnum()`
 * - `options.gte` is only used by `aintaNumber()` and `aintaInteger()`
 * - `options.before` is used all the `ainta` functions
 *
 * @typedef {Object} Options
 * @property {string} [begin]
 *    Optional text to begin the result with, eg a function name like "isOk()".
 * @property {number} [gte]
 *    Optional minimum value. Short for 'Greater Than or Equal'.
 * @property {number} [lte]
 *    Optional maximum value. Short for 'Less Than or Equal'.
 * @property {'bigint'|'boolean'|'function'|'number'|'object'|'string'|'symbol'|'undefined'} [type]
 *    Optional JavaScript type to expect, eg "boolean" or "undefined".
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
