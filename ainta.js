/**
 * https://www.npmjs.com/package/@0bdx/ainta
 * @version 0.0.1
 * @license Copyright (c) 2023 0bdx <0@0bdx.com> (0bdx.com)
 * SPDX-License-Identifier: MIT
 */
/**
 * ### Strings used by many `ainta` functions.
 * @private
 * 
 * Using constants this way helps avoid typos, and can help reduce the size of
 * minified code.
 */

/** @constant {string} ARRAY The literal string "array" */
const ARRAY = 'array';

/** @constant {string} BIGINT The literal string "bigint" */
const BIGINT = 'bigint';

/** @constant {string} BOOLEAN The literal string "boolean" */
const BOOLEAN = 'boolean';

/** @constant {string} FUNCTION The literal string "function" */
const FUNCTION = 'function';

/** @constant {string} NULL The literal string "null" */
const NULL = 'null';

/** @constant {string} NUMBER The literal string "number" */
const NUMBER = 'number';

/** @constant {string} OBJECT The literal string "object" */
const OBJECT = 'object';

/** @constant {string} STRING The literal string "string" */
const STRING = 'string';

/** @constant {string} SYMBOL The literal string "symbol" */
const SYMBOL = 'symbol';

/** @constant {string} UNDEFINED The literal string "undefined" */
const UNDEFINED = 'undefined';

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
function aintaType(
    value,
    identifier,
    options = emptyOptions,
) {
    // Process the happy path as quickly as possible.
    const type = typeof value;
    if (type === options.type) return false;

    // If `identifier` was not set, fall back to the default, "A value".
    // If `options.begin` was set, append ": ".
    const ident = identifier ? `\`${identifier}\`` : 'A value';
    const prefix = options.begin ? `${options.begin}: ${ident}` : ident;

    // If `options.type` is invalid, produce a helpful result.
    const badOptionsType = prefix + ' cannot be validated, `options.type` ';
    const isAnArray = 'is an ' + ARRAY;
    const isNull = 'is ' + NULL;
    const isType = 'is type ';
    const not = ' not ';
    const notType = not + 'type ';
    const str = `'${STRING}'`;
    if (options.type === void 0)
        return `${badOptionsType}is${not}set`;
    if (options.type === null)
        return badOptionsType + isNull + notType + str;
    if (Array.isArray(options.type))
        return badOptionsType + isAnArray + notType + str;
    if (typeof options.type !== STRING)
        return badOptionsType + isType + `'${typeof options.type}'` + not + str;
    if (!isRecognisedType(options.type))
        return `${badOptionsType}'${sanitiseString(options.type)}'${not}known`;

    return `${prefix} ${
        value === null
            ? isNull + notType
            : Array.isArray(value)
                ? isAnArray + notType
                : `${isType}'${type}'${not}`
        }'${options.type}'`
    ;
}

const isRecognisedType = type => [
    BIGINT,
    BOOLEAN,
    FUNCTION,
    NUMBER,
    OBJECT,
    STRING,
    SYMBOL,
    UNDEFINED,
].indexOf(type) !== -1;

const sanitiseString = str =>
    encodeURI(str.length <= 32 ? str
        : `${str.slice(0, 21)}...${str.slice(-8)}`);

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
function aintaBoolean(
    value,
    identifier,
    options = emptyOptions,
) {
    // Use aintaType() to check whether `value` is a boolean.
    return aintaType(value, identifier, { ...options, type:BOOLEAN });
}

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
function narrowAintas(
    options = emptyOptions,
    ...aintas
) {
    // Create an empty array, which the passed-in functions can add messages to.
    const results = [];

    // `results` becomes the first item of the returned array. The remaining
    // items are all functions with `options` applied to them.
    return [
        results,
        ...aintas.map(ainta => narrowAinta(options, ainta, results)),
    ];
}

/**
 * Narrows a single validation function.
 * @private
 *
 * @param {Options} options
 *    Optional plain object containing optional configuration (default is `{}`)
 * @param {Ainta} ainta
 *    A function to apply `options` to.
 * @param {string[]} results
 *    Stores a message for each invalid value that the function finds.
 *    Note that this array may be shared with other `BoundBadCheck` functions.
 * @return {Ainta}
 *    A new validation function, which has been narrowed and is ready to use.
 */
const narrowAinta = (options, ainta, results) =>
    (value, identifier, overrideOptions) => {
        const result =
            ainta(value, identifier, { ...options, ...overrideOptions });
        if (result) results.push(result);
        return result;
    };

export { aintaBoolean, aintaType, narrowAintas as default };
