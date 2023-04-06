/**
 * ### The string name of a JavaScript type, eg `"boolean"` or `"undefined"`.
 * 
 * This is the complete set of possible values that JavaScript's built in
 * `typeof` is able to produce.
 * 
 * `typeof` has a few surprises up its sleeve. For example, `null` is "object"
 * and `NaN` is "number".
 *
 * @typedef {'bigint'|'boolean'|'function'|'number'|'object'|'string'|'symbol'|'undefined'} TypeOf
 */

/**
 * ### Describes the types an array can contain, eg `["object"]`.
 * 
 * - `["bigint","number"]` describes an array containing only numeric values
 * - `["boolean"]` describes an array containing only `true` and `false`
 * - `["string","undefined"]` can contain strings, `undefined` and 'empty slots'
 * - `[]` means an array which can contain any value
 *
 * @typedef {TypeOf[]} TypesOf
 */

/**
 * ### One type, or an array of certain types, eg `"number"` or `["string"]`.
 *
 * @typedef {TypeOf|TypesOf} TypeOrTypesOf
 */

// /**
//  * ### Extends JavaScript types, adding useful extras like "any" and "null".
//  *
//  * @typedef {TypeOf|'any'|'array'|'nan'|'null'} Kind
//  */

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
 * @typedef {object} Options
 * @property {string} [begin]
 *    Optional text to begin the result with, eg a function name like "isOk()".
 * @property {string[]} [enum]
 *    Optional array of strings.
 * @property {number} [gte]
 *    Optional minimum value. Short for 'Greater Than or Equal'.
 * @property {Rxish} [key]
 *    Optional object with a `test()` function. Typically a JavaScript `RegExp`.
 * @property {number} [least]
 *    Optional minimum length of an array.
 * @property {number} [lte]
 *    Optional maximum value. Short for 'Less Than or Equal'.
 * @property {number} [max]
 *    Optional maximum length of a string.
 * @property {number} [min]
 *    Optional minimum length of a string.
 * @property {number} [mod]
 *    Optional modulo which `value` must divide into without a remainder.
 * @property {number} [most]
 *    Optional maximum length of an array.
 * @property {boolean} [open]
 *    Optional flag. If true, an object can contain 'extra' properties -
 *    that is, key/value pairs not described in `options.schema`.
 * @property {boolean} [pass]
 *    Optional flag. If true, array items are validated using `options`.
 * @property {Rxish} [rx]
 *    Optional object with a `test()` function. Typically a JavaScript `RegExp`.
 * @property {Schema} [schema]
 *    Optional object which describes an object.
 * @property {TypeOrTypesOf} [type]
 *    Optional JavaScript type to expect, eg "number", ["object"] or "undefined".
 * @property {TypeOrTypesOf[]} [types]
 *    Optional array of JS types to expect, eg ["boolean"] for `true` or `false`
 *    or [["bigint","number"],"undefined"] for an optional array of numerics.  
 *    If missing, the property is allowed to be any type.
 */

/**
 * ### An object with a `test()` function. Typically a JavaScript `RegExp`.
 * 
 * @typedef {object} Rxish
 * @property {function(string):boolean} test
 *    The test function, which takes a string and returns `true` if it passes
 *    and `false` if it fails.
 */

/**
 * ### An object which describes an object's properties.
 * 
 * @typedef {Object.<string, Options>} Schema
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
