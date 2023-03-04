/**
 * Any one of @0bdx/ainta's validation functions.
 */
export type Ainta = (arg0: any, arg1: string | null, arg2: any | null) => string | false;
/**
 * ### A configuration object, used by all `ainta` functions.
 *
 * Each option is actually optional, so an empty object `{}` is perfectly valid.
 *
 * Different options are used by different `ainta` functions. For example:
 * - `options.keys` is only used by `aintaEnum()`
 * - `options.gte` is only used by `aintaNumber()` and `aintaInteger()`
 * - `options.before` is used all the `ainta` functions
 */
export type Options = {
    /**
     * Optional text to begin the result with, eg a function name like "isOk()".
     */
    begin?: string;
    /**
     * Optional JavaScript type to expect, eg "boolean" or "undefined".
     */
    type?: 'bigint' | 'boolean' | 'function' | 'number' | 'object' | 'string' | 'symbol' | 'undefined';
};
/**
 * ### Validates a boolean.
 *
 * @param {any} value
 *    The value to validate.
 * @param {string} [identifier]
 *    Optional name to call `value` in the result, if invalid.
 * @param {Options} [options={}]
 *    Optional plain object containing optional configuration (default is `{}`)
 * @returns {false|string}
 *    Returns `false` if `value` is valid, or an explanation if invalid.
 */
export function aintaBoolean(value: any, identifier?: string, options?: any): false | string;
/**
 * ### Validates a value using JavaScript's native `typeof`.
 *
 * Due to the way `typeof` works, these are all valid, so return `false`:
 * - `aintaType(null, { type:'object' })`
 * - `aintaType([99], { type:'object' })`
 * - `aintaType(NaN, { type:'number' })`
 *
 * @param {any} value
 *    The value to validate.
 * @param {string} [identifier]
 *    Optional name to call `value` in the result, if invalid.
 * @param {Options} [options={}]
 *    Optional plain object containing optional configuration (default is `{}`)
 * @returns {false|string}
 *    Returns `false` if `value` is valid, or an explanation if invalid.
 */
export function aintaType(value: any, identifier?: string, options?: any): false | string;
/** Any one of @0bdx/ainta's validation functions.
 * @typedef {function(any, string?, Options?):string|false} Ainta */
/**
 * ### Narrows multiple validation functions, and aggregates their results.
 *
 * @example
 *     import narrowAintas, { aintaInteger } from '@0bdx/ainta';
 *
 *     function bothInts(a, b) {
 *         const [ results, naInteger ] = narrowAintas(
 *             { begin:'bothInts()', gte:0 }, aintaInteger);
 *         naInteger(a, 'a', { lte:1000 });
 *         naInteger(b, 'b', { lte:50 });
 *         if (results.length) return results;
 *         return "a and b are both integers, and both in range!";
 *     }
 *
 *     bothInts(1, 99);
 *     // [ "bothInts(): `b` is 99 which is greater than 50" ]
 *
 *     bothInts(0.25);
 *     // [ "bothInts(): `a` is 0.25 not an integer",
 *     //   "bothInts(): `b` is type 'undefined' not 'number'" ]
 *
 *     bothInts(12, 3);
 *     // "a and b are both integers, and both in range!"
 *
 * @param {Options} [options={}]
 *    Optional plain object containing optional configuration (default is `{}`)
 * @param {...Ainta} aintas
 *    Any number of functions, to apply `options` to.
 * @returns {[string[], ...Ainta[]]}
 *    The first item of the returned array is `results`. The remaining items
 *    are the passed-in functions, with `options` applied to them.
 */
declare function narrowAintas(options?: any, ...aintas: Ainta[]): [string[], ...Ainta[]];
export { narrowAintas as default };
