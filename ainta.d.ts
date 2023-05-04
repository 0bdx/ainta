/**
 * Any one of `ainta`'s validation functions.
 */
export type Ainta = (value: any, identifier?: string, options?: Options) => false | string;
/**
 * ### The string name of a JavaScript type, eg `"boolean"` or `"undefined"`.
 *
 * This is the complete set of possible values that JavaScript's built in
 * `typeof` is able to produce.
 *
 * `typeof` has a few surprises up its sleeve. For example, `null` is "object"
 * and `NaN` is "number".
 */
export type TypeOf = 'bigint' | 'boolean' | 'function' | 'number' | 'object' | 'string' | 'symbol' | 'undefined';
/**
 * ### Describes the types an array can contain, eg `["object"]`.
 *
 * - `["bigint","number"]` describes an array containing only numeric values
 * - `["boolean"]` describes an array containing only `true` and `false`
 * - `["string","undefined"]` can contain strings, `undefined` and 'empty slots'
 * - `[]` means an array which can contain any value
 */
export type TypesOf = TypeOf[];
/**
 * ### One type, or an array of certain types, eg `"number"` or `["string"]`.
 */
export type TypeOrTypesOf = TypeOf | TypeOf[];
/**
 * ### A configuration object, used by all `ainta` functions.
 *
 * Each option is actually optional, so an empty object `{}` is perfectly valid.
 *
 * Different options are used by different `ainta` functions. For example:
 * - `options.before` is used all the `ainta` functions
 * - `options.gte` is only used by `aintaNumber()`
 * - `options.is` is used by `aintaBoolean()`, `aintaNumber()` and
 *   `aintaString()`.
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
     * Optional array of valid values.
     */
    is?: any[];
    /**
     * Optional array of invalid values.
     */
    isnt?: any[];
    /**
     * Optional object with a `test()` function. Typically a JavaScript `RegExp`.
     */
    key?: Rxish;
    /**
     * Optional minimum length of an array.
     */
    least?: number;
    /**
     * Optional maximum value. Short for 'Less Than or Equal'.
     */
    lte?: number;
    /**
     * Optional maximum length of a string.
     */
    max?: number;
    /**
     * Optional minimum length of a string.
     */
    min?: number;
    /**
     * Optional modulo which `value` must divide into without a remainder.
     */
    mod?: number;
    /**
     * Optional maximum length of an array.
     */
    most?: number;
    /**
     * Optional flag. If true, an object can contain 'extra' properties -
     * that is, key/value pairs not described in `options.schema`.
     */
    open?: boolean;
    /**
     * Optional flag. If true, array items are validated using `options`.
     */
    pass?: boolean;
    /**
     * Optional object with a `test()` function. Typically a JavaScript `RegExp`.
     */
    rx?: Rxish;
    /**
     * Optional string which tells `aintaList()` how to turn strings into arrays.
     */
    split?: string;
    /**
     * Optional object which describes an object.
     */
    schema?: Schema;
    /**
     * Optional JavaScript type to expect, eg "number", ["object"] or "undefined".
     */
    type?: TypeOrTypesOf;
    /**
     * Optional array of JS types to expect, eg ["boolean"] for `true` or `false`
     * or [["bigint","number"],"undefined"] for an optional array of numerics.
     * If missing, the property is allowed to be any type.
     */
    types?: TypeOrTypesOf[];
};
/**
 * ### An object with a `test()` function. Typically a JavaScript `RegExp`.
 */
export type Rxish = {
    /**
     *    The test function, which takes a string and returns `true` if it passes
     *    and `false` if it fails.
     */
    test: (arg0: string) => boolean;
};
/**
 * ### An object which describes an object's properties.
 */
export type Schema = {
    [x: string]: Options;
};
/**
 * ### Validates a value using JavaScript's native `Array.isArray()`.
 *
 * If the first argument passed to `aintaArray()` ain't an array, it returns
 * a short explanation of what went wrong.
 *
 * Else, if the array fails any of the following conditions, it also returns an
 * explanation of what went wrong:
 * - `options.is` - if set, this is an array containing valid items
 * - `options.least` - if set, there must be at least this number of items
 * - `options.most` - if set, there must not be more than this number of items
 * - `options.pass` - if set, each item is validated more deeply using `options`
 * - `options.types` - if set, all items must be one of these types
 *
 * If `options.is` and `.types` are both set, items are considered valid if they
 * are either in `options.is`, or are one of the `options.types`.
 * @TODO test that
 *
 * Otherwise, `aintaArray()` returns `false`.
 *
 * @example
 * import { aintaArray } from '@0bdx/ainta';
 *
 * aintaArray([1, 'two', 3], 'a', { types:['number','string'] });
 * // false
 *
 * aintaArray({});
 * // "A value is type 'object' not an array"
 *
 * aintaArray(null, 'list', { begin:'processList()' });
 * // "processList(): `list` is null not an array"
 *
 * aintaArray(['ok', null, {}], 'a', { types:['object','string'] });
 * // "`a[1]` is null, not one of the `options.types` 'object:string'"
 *
 * @param {any} value
 *    The value to validate.
 * @param {string} [identifier]
 *    Optional name to call `value` in the explanation, if invalid.
 * @param {Options} [options={}]
 *    The standard `ainta` configuration object (optional, defaults to `{}`).
 * @returns {false|string}
 *    Returns `false` if `value` is valid, or an explanation if not.
 */
export function aintaArray(value: any, identifier?: string, options?: Options): false | string;
/**
 * ### Validates a boolean.
 *
 * If the first argument passed to `aintaBoolean()` ain't a boolean, it returns
 * a short explanation of what went wrong.
 *
 * Else, if the first argument fails the following condition, it also returns
 * an explanation of what went wrong:
 * - `options.is` - if set, this is an array that may contain `true` or `false`
 *
 * Otherwise, `aintaBoolean()` returns `false`.
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
 * aintaBoolean(false. 'shouldBeAffirmative', { is:[ true ] });
 * // "`shouldBeAffirmative` false is not in 'true'"
 *
 * @param {any} value
 *    The value to validate.
 * @param {string} [identifier]
 *    Optional name to call `value` in the explanation, if invalid.
 * @param {Options} [options={}]
 *    The standard `ainta` configuration object (optional, defaults to `{}`).
 * @returns {false|string}
 *    Returns `false` if `value` is valid, or an explanation if not.
 */
export function aintaBoolean(value: any, identifier?: string, options?: Options): false | string;
/**
 * ### Validates that a value is a simple object of key/value pairs.
 *
 * A ‘dictionary’ is a JavaScript object with arbitrary key/value pairs. Often,
 * all the values will be of the same type - eg, Node.js's `process.env` object,
 * where every value is a string.
 *
 * If the first argument passed to `aintaDictionary()` ain't a dictionary, it
 * returns a short explanation of what went wrong.
 *
 * Else, if the dictionary fails any of the following conditions, it also
 * returns an explanation of what went wrong:
 * - `options.key` - if set, all keys must pass this `RexExp`-like object
 * - `options.least` - if set, there must be at least this number of properties
 * - `options.most` - if set, there must not be more than this number of properties
 * - `options.pass` - if set, each property is validated more deeply using `options`
 * - `options.types` - if set, all values must be one of these types
 *
 * Otherwise, `aintaDictionary()` returns `false`.
 *
 * @example
 * import { aintaDictionary } from '@0bdx/ainta';
 *
 * aintaDictionary({ zero:0, one:1 }, 'all_num', { types:['number'] });
 * // false
 *
 * aintaDictionary([]);
 * // "A value is an array, not type 'object'"
 *
 * aintaDictionary(null, 'lookupTable', { begin:'processLUT()' });
 * // "processLUT(): `lookupTable` is null not a dictionary"
 *
 * aintaDictionary({ zero:0, one:'1' }, 'all_num', { types:['number'] });
 * // "`all_num[1]` is type 'string', not the `options.types` 'number'"
 *
 * @param {any} value
 *    The value to validate.
 * @param {string} [identifier]
 *    Optional name to call `value` in the explanation, if invalid.
 * @param {Options} [options={}]
 *    The standard `ainta` configuration object (optional, defaults to `{}`).
 * @returns {false|string}
 *    Returns `false` if `value` is valid, or an explanation if not.
 */
export function aintaDictionary(value: any, identifier?: string, options?: Options): false | string;
/**
 * ### Validates a function or class.
 *
 * If the first argument passed to `aintaFunction()` ain't a function or class,
 * it returns a short explanation of what went wrong.
 *
 * Else, if `options.schema` is set, but the function (assumed to be a class)
 * does not conform to that schema, an explanation is returned. `options.open`
 * determines whether static members not in `.schema` are allowed.
 *
 * Otherwise, `aintaFunction()` returns `false`.
 *
 * @TODO discuss static vs instance methods and properties
 * @TODO figure out best way to validate instance methods and properties
 *
 * @example
 * import { aintaFunction } from '@0bdx/ainta';
 *
 * aintaFunction(function increment(n){ return n+1 });
 * // false
 *
 * aintaFunction(1234);
 * // "A value is type 'number' not 'function'"
 *
 * aintaFunction(null, 'callback', { begin:'runCallback()' });
 * // "runCallback(): `callback` is null not type 'function'"
 *
 * aintaObject(class{ static staticNum = 123 }, 'Anon', { open:true });
 * // false
 *
 * aintaFunction(class{}, 'Anon', { schema:{ staticNum:{ types:['number']} } });
 * // "`Anon.staticNum` is missing"
 *
 * @param {any} value
 *    The value to validate.
 * @param {string} [identifier]
 *    Optional name to call `value` in the explanation, if invalid.
 * @param {Options} [options={}]
 *    The standard `ainta` configuration object (optional, defaults to `{}`).
 *    `options.open` determines whether properties not in `.schema` are allowed.
 * @returns {false|string}
 *    Returns `false` if `value` is valid, or an explanation if not.
 */
export function aintaFunction(value: any, identifier?: string, options?: Options): false | string;
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
 *    The standard `ainta` configuration object (optional, defaults to `{}`).
 * @returns {false|string}
 *    Returns `false` if `value` is valid, or an explanation if not.
 */
export function aintaNull(value: any, identifier?: string, options?: Options): false | string;
/**
 * ### Validates a number.
 *
 * If the first argument passed to `aintaNumber()` ain't a number, it returns
 * a short explanation of what went wrong.
 *
 * Else, if the first argument fails any of the following conditions, it also
 * returns an explanation of what went wrong:
 * - `options.gte` - if set, the value must be Greater Than or Equal to this
 * - `options.is` - if set, this is an array containing valid numbers
 * - `options.lte` - if set, the value must be Less Than or Equal to this
 * - `options.mod` - if set, the value must be divisible by this
 *
 * Otherwise, `aintaNumber()` returns `false`.
 *
 * `aintaNumber()` differs from `aintaType(..., { type:'number' })`, in that it
 * doesn't consider `NaN` to be a number.
 *
 * @TODO Add options.isnt, eg:
 * - `options.isnt` - if set, this is an array containing invalid numbers
 * - (by default, `.isnt` is [`NaN`], so set it to `[]` if `NaN` should be valid)
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
 * aintaNumber('99', 'redBalloons', { begin:'fly()' });
 * // "fly(): `redBalloons` is type 'string' not 'number'"
 *
 * @param {any} value
 *    The value to validate.
 * @param {string} [identifier]
 *    Optional name to call `value` in the explanation, if invalid.
 * @param {Options} [options={}]
 *    The standard `ainta` configuration object (optional, defaults to `{}`).
 * @returns {false|string}
 *    Returns `false` if `value` is valid, or an explanation if not.
 *    Also returns an explanation if any of the `options` it uses are invalid.
 */
export function aintaNumber(value: any, identifier?: string, options?: Options): false | string;
/**
 * ### Validates that a value is a regular JavaScript object.
 *
 * If the first argument passed to `aintaObject()` ain't an object, it returns
 * a short explanation of what went wrong.
 *
 * Else, if the first argument fails any of the following conditions, it also
 * returns an explanation of what went wrong:
 * - `options.is` - if set, this is an array containing valid classes
 * - `options.open` - if set, properties not in `options.schema` are allowed
 * - `options.schema` - if set, the value must conform to this
 *
 * Otherwise, `aintaObject()` returns `false`.
 *
 * `aintaObject()` differs from `aintaType(..., { type:'object' })`, in that
 * it doesn't consider `null` or an array to be an object.
 *
 * @example
 * import { aintaObject } from '@0bdx/ainta';
 *
 * aintaObject({ red:0xFF0000 }, 'palette', { open:true });
 * // false
 *
 * aintaObject([]);
 * // "A value is an array not type 'object'"
 *
 * aintaObject(null, 'lookup', { begin:'processLookup()' });
 * // "processLookup(): `lookup` is null not an object"
 *
 * const schema = { red: { rx:/^#[a-f0-9]{6}$/i, types:['string'] } };
 * aintaObject({ red:0xFF0000 }, 'palette', { schema });
 * // "`palette.red` is type 'number' not 'string'"
 *
 * @param {any} value
 *    The value to validate.
 * @param {string} [identifier]
 *    Optional name to call `value` in the explanation, if invalid.
 * @param {Options} [options={}]
 *    The standard `ainta` configuration object (optional, defaults to `{}`).
 *    `options.open` determines whether properties not in `.schema` are allowed.
 * @returns {false|string}
 *    Returns `false` if `value` is valid, or an explanation if not.
 */
export function aintaObject(value: any, identifier?: string, options?: Options): false | string;
/**
 * ### Validates a string.
 *
 * If the first argument passed to `aintaString()` ain't a string, it returns
 * a short explanation of what went wrong.
 *
 * Else, if the first argument fails any of the following conditions, it also
 * returns an explanation of what went wrong:
 * - `options.is` - if set, this is an array containing valid strings
 * - `options.max` - if set, this is the maximum allowed string length
 * - `options.min` - if set, this is the minimum allowed string length
 * - `options.rx` - if set, this is an object which has a `test()` function
 *
 * Otherwise, `aintaString()` returns `false`.
 *
 * @example
 * import { aintaString } from '@0bdx/ainta';
 *
 * aintaString("Ok!");
 * // false
 *
 * aintaString(["N","o","p","e"]);
 * // "A value is an array not type 'string'"
 *
 * aintaString(99, 'redBalloons', { begin:'fly()' });
 * // "fly(): `redBalloons` is type 'number' not 'string'"
 *
 * aintaString(99, 'redBalloons', { begin:'fly()' });
 * // "fly(): `redBalloons` is type 'number' not 'string'"
 *
 * equal(f('Fum!', null, { is:['Fee','Fi','Fo'] }),
 * // "A value 'Fum!' is not in `options.is` 'Fee:Fi:Fo'"
 *
 * @param {any} value
 *    The value to validate.
 * @param {string} [identifier]
 *    Optional name to call `value` in the explanation, if invalid.
 * @param {Options} [options={}]
 *    The standard `ainta` configuration object (optional, defaults to `{}`).
 * @returns {false|string}
 *    Returns `false` if `value` is valid, or an explanation if not.
 *    Also returns an explanation if any of the `options` it uses are invalid.
 */
export function aintaString(value: any, identifier?: string, options?: Options): false | string;
/**
 * ### Validates a value using JavaScript's native `typeof`.
 *
 * If the `typeof` the first argument passed to `aintaType()` ain't
 * `option.type`, it returns a short explanation of what went wrong. Otherwise
 * it returns `false`.
 *
 * Due to the way `typeof` works, these cases are all valid, so return `false`:
 * - `aintaType(null, { type:'object' })`
 * - `aintaType([99], { type:'object' })`
 * - `aintaType(NaN, { type:'number' })`
 *
 * To avoid returning `false` in these cases, use these functions instead:
 * - `aintaObject(null)`
 * - `aintaObject([99])`
 * - `aintaNumber(NaN)`
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
 *    The standard `ainta` configuration object (optional, defaults to `{}`).
 * @returns {false|string}
 *    Returns `false` if `value` is valid, or an explanation if not.
 *    Also returns an explanation if `options.type` is invalid.
 */
export function aintaType(value: any, identifier?: string, options?: Options): false | string;
/** Any one of `ainta`'s validation functions.
 * @typedef {Function} Ainta
 * @param {any} value
 *    The value to validate.
 * @param {string} [identifier]
 *    Optional name to call `value` in the explanation, if invalid.
 * @param {Options} [options={}]
 *    The standard `ainta` configuration object (optional, defaults to `{}`).
 * @returns {false|string}
 *    Returns `false` if `value` is valid, or an explanation if not.
 */
/**
 * ### Narrows any number of `ainta` functions, and aggregates their results.
 *
 * This helper:
 * 1. Narrows (applies shared options to) multiple `ainta` functions
 * 2. Aggregates the strings returned by those functions
 *
 * In the example below, `narrowAintas()` is used to narrow `aintaInteger()`
 * into `aInteger()`, and then capture its validation results:
 * - `begin:'bothNatural()'` sets a prefix, added to all explanations
 * - `gte:0` checks that the value is not negative
 * - `lte:1000` and `lte:50` specify different maximum values for each argument
 * - `if (results.length)` checks whether there were any problems
 *
 * @example
 * import narrowAintas, { aintaInteger } from '@0bdx/ainta';
 *
 * function bothNatural(a, b) {
 *     const [ results, aInteger ] = narrowAintas(
 *         { begin:'bothNatural()', gte:0 },
 *         aintaInteger
 *     );
 *     aInteger(a, 'a', { lte:1000 });
 *     aInteger(b, 'b', { lte:50 });
 *     if (results.length) return results;
 *     return "`a` and `b` are both natural numbers, in range!";
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
 * // "`a` and `b` are both natural numbers, in range!"
 *
 * @param {Options} [options={}]
 *    The standard `ainta` configuration object (optional, defaults to `{}`).
 * @param {...(Ainta|Ainta[])} aintas
 *    Any number of `ainta` functions, to apply `options` to.
 *    - An array of `ainta` functions is treated as an 'OR' list
 * @returns {[string[], ...Ainta[]]}
 *    The first item of the returned array will contain aggregated results. The
 *    remaining items are the passed-in functions, with `options` applied.
 */
declare function narrowAintas(options?: Options, ...aintas: (Ainta | Ainta[])[]): [string[], ...Ainta[]];
export { narrowAintas as default };
