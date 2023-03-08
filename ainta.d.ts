/**
 * Any one of `ainta`'s validation functions.
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
     * Optional minimum value. Short for 'Greater Than or Equal'.
     */
    gte?: number;
    /**
     * Optional maximum value. Short for 'Less Than or Equal'.
     */
    lte?: number;
    /**
     * Optional JavaScript type to expect, eg "boolean" or "undefined".
     */
    type?: 'bigint' | 'boolean' | 'function' | 'number' | 'object' | 'string' | 'symbol' | 'undefined';
};
/**
 * ### Validates a value using JavaScript's native `Array.isArray()`.
 *
 * If the first argument passed to `aintaArray()` ain't an array, it returns
 * a short explanation of what went wrong. Otherwise it returns `false`.
 *
 * @example
 * import { aintaArray } from '@0bdx/ainta';
 *
 * aintaArray([1, 2, 3]);
 * // false
 *
 * aintaArray({});
 * // "A value is type 'object' not an array"
 *
 * aintaArray(null, 'list', { begin:'processList()' });
 * // "processList(): `list` is null not an array"
 *
 * @param {any} value
 *    The value to validate.
 * @param {string} [identifier]
 *    Optional name to call `value` in the explanation, if invalid.
 * @param {Options} [options={}]
 *    The standard `ainta` configuration object (optional, defaults to `{}`)
 * @returns {false|string}
 *    Returns `false` if `value` is valid, or an explanation if not.
 */
export function aintaArray(value: any, identifier?: string, options?: any): false | string;
/**
 * ### Validates a boolean.
 *
 * If the first argument passed to `aintaBoolean()` ain't a boolean, it returns
 * a short explanation of what went wrong. Otherwise it returns `false`.
 *
 * @example
 * import { aintaBoolean } from '@0bdx/ainta';
 *
 * aintaBoolean(true);
 * // false
 *
 * aintaBoolean(1234);
 * // "A value is type 'number' not 'boolean'"
 *
 * aintaBoolean(null, 'isDone', { begin:'doThings()' });
 * // "doThings(): `isDone` is null not type 'boolean'"
 *
 * @param {any} value
 *    The value to validate.
 * @param {string} [identifier]
 *    Optional name to call `value` in the explanation, if invalid.
 * @param {Options} [options={}]
 *    The standard `ainta` configuration object (optional, defaults to `{}`)
 * @returns {false|string}
 *    Returns `false` if `value` is valid, or an explanation if not.
 */
export function aintaBoolean(value: any, identifier?: string, options?: any): false | string;
/**
 * ### Validates that a value is exactly `null`.
 *
 * If the first argument passed to `aintaNull()` ain't a `null`, it returns
 * a short explanation of what went wrong. Otherwise it returns `false`.
 *
 * @example
 * import { aintaNull } from '@0bdx/ainta';
 *
 * aintaNull(null);
 * // false
 *
 * aintaNull();
 * // "A value is type 'undefined' not null"
 *
 * aintaNull(false, 'x', { begin:'expectNull()' });
 * // "expectNull(): `x` is type 'boolean' not null"
 *
 * @param {any} value
 *    The value to validate.
 * @param {string} [identifier]
 *    Optional name to call `value` in the explanation, if invalid.
 * @param {Options} [options={}]
 *    The standard `ainta` configuration object (optional, defaults to `{}`)
 * @returns {false|string}
 *    Returns `false` if `value` is valid, or an explanation if not.
 */
export function aintaNull(value: any, identifier?: string, options?: any): false | string;
/**
 * ### Validates a number.
 *
 * If the first argument passed to `aintaNumber()` ain't a number, it returns
 * a short explanation of what went wrong. Otherwise it returns `false`.
 *
 * `aintaNumber()` differs from `aintaType(..., { type:'number' })`, in that it
 * doesn't consider `NaN` to be a number
 *
 * @example
 * import { aintaNumber } from '@0bdx/ainta';
 *
 * aintaNumber(-Infinity);
 * // false
 *
 * aintaNumber(NaN);
 * // "A value is the special `NaN` value"
 *
 * aintaNumber('99', 'redBalloons', { begin:'flyBalloons()' });
 * // "flyBalloons(): `redBalloons` is type 'string' not 'number'"
 *
 * @param {any} value
 *    The value to validate.
 * @param {string} [identifier]
 *    Optional name to call `value` in the explanation, if invalid.
 * @param {Options} [options={}]
 *    The standard `ainta` configuration object (optional, defaults to `{}`)
 * @returns {false|string}
 *    Returns `false` if `value` is valid, or an explanation if not.
 */
export function aintaNumber(value: any, identifier?: string, options?: any): false | string;
/**
 * ### Validates a value using JavaScript's native `typeof`.
 *
 * If the `typeof` the first argument passed to `aintaType()` ain't
 * `option.type`, it returns a short explanation of what went wrong. Otherwise
 * it returns `false`.
 *
 * Due to the way `typeof` works, these are all valid, so return `false`:
 * - `aintaType(null, { type:'object' })`
 * - `aintaType([99], { type:'object' })`
 * - `aintaType(NaN, { type:'number' })`
 *
 * @example
 * import { aintaType } from '@0bdx/ainta';
 *
 * aintaType(0.5, 'half', { type:'number' });
 * // false
 *
 * aintaType(n => n / 2, 'half', { type:'number' });
 * // "`half` is type 'function' not 'number'"
 *
 * @param {any} value
 *    The value to validate.
 * @param {string} [identifier]
 *    Optional name to call `value` in the explanation, if invalid.
 * @param {Options} [options={}]
 *    The standard `ainta` configuration object (optional, defaults to `{}`)
 * @returns {false|string}
 *    Returns `false` if `value` is valid, or an explanation if not.
 */
export function aintaType(value: any, identifier?: string, options?: any): false | string;
/** Any one of `ainta`'s validation functions.
 * @typedef {function(any, string?, Options?):string|false} Ainta */
/**
 * ### Narrows any number of `ainta` functions, and aggregates their results.
 *
 * This helper:
 * 1. Narrows (applies shared options to) multiple `ainta` functions
 * 2. Aggregates the strings returned by those functions
 *
 * In the example below, `narrowAintas()` is used to narrow `aintaInteger()`
 * into `naInteger()`, and then capture its validation results:
 * - `begin:'bothNatural()'` sets a prefix, added to all explanations
 * - `gte:0` checks that the value is not negative
 * - `lte:1000` and `lte:50` specify different maximum values for each argument
 * - `if (results.length)` checks whether there were any problems
 *
 * @example
 * import narrowAintas, { aintaInteger } from '@0bdx/ainta';
 *
 * function bothNatural(a, b) {
 *     const [ results, naInteger ] = narrowAintas(
 *         { begin:'bothNatural()', gte:0 },
 *         aintaInteger
 *     );
 *     naInteger(a, 'a', { lte:1000 });
 *     naInteger(b, 'b', { lte:50 });
 *     if (results.length) return results;
 *     return "a and b are both natural numbers, in range!";
 * }
 *
 * bothNatural(-5, 0.25);
 * // [ "bothNatural(): `a` is -5 not gte 0",
 * //   "bothNatural(): `b` is 0.25 not an integer" ]
 *
 * bothNatural(99, 200);
 * // [ "bothNatural(): `b` is 200 not lte 50" ]
 *
 * bothNatural(12, 3);
 * // "a and b are both natural numbers, in range!"
 *
 * @param {Options} [options={}]
 *    The standard `ainta` configuration object (optional, defaults to `{}`)
 * @param {...Ainta} aintas
 *    Any number of `ainta` functions, to apply `options` to.
 * @returns {[string[], ...Ainta[]]}
 *    The first item of the returned array will contain aggregated results. The
 *    remaining items are the passed-in functions, with `options` applied.
 */
declare function narrowAintas(options?: any, ...aintas: Ainta[]): [string[], ...Ainta[]];
export { narrowAintas as default };
