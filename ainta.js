/**
 * https://www.npmjs.com/package/@0bdx/ainta
 * @version 0.0.1
 * @license Copyright (c) 2023 0bdx <0@0bdx.com> (0bdx.com)
 * SPDX-License-Identifier: MIT
 */
/**
 * ### A plain object containing optional configuration for `ainta` functions.
 * 
 * Exporting a plain `{}` is really a way to export the DefaultOptions type, and
 * avoid "File '.../ainta/src/default-options.js' is not a module.ts (2306)".
 *
 * @typedef {Object} DefaultOptions
 * @property {string} [begin]
 *    Optional text to begin the result with, eg a function name like "isOk()".
 * @property {'bigint'|'boolean'|'function'|'number'|'object'|'string'|'symbol'|'undefined'} [type]
 *    Optional JavaScript type to expect, eg "boolean" or "undefined".
 */

/** @type DefaultOptions */
const defaultOptions = {};

/** Any one of @0bdx/ainta's validation functions.
 * @typedef {function(any, string?, DefaultOptions?):string|false} Ainta */

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
 * @param {DefaultOptions} [options={}]
 *    Optional plain object containing optional configuration (default is `{}`)
 * @param {...Ainta} aintas
 *    Any number of functions, to apply `options` to.
 * @returns {[string[], ...Ainta[]]}
 *    The first item of the returned array is `results`. The remaining items
 *    are the passed-in functions, with `options` applied to them.
 */
function narrowAintas(
    options = defaultOptions,
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
 * ### Narrows a single validation function.
 *
 * @param {DefaultOptions} options
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
 * @param {DefaultOptions} [options={}]
 *    Optional plain object containing optional configuration (default is `{}`)
 * @returns {false|string}
 *    Returns `false` if `value` is valid, or an explanation if invalid.
 */
function aintaType(
    value,
    identifier,
    options = defaultOptions,
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
    if (options.type === void 0)
        return `${badOptionsType}is not set`;
    if (options.type === null)
        return `${badOptionsType}is null not type 'string'`;
    if (Array.isArray(options.type))
        return `${badOptionsType}is an array not type 'string'`;
    if (typeof options.type !== 'string')
        return `${badOptionsType}is type '${typeof options.type}' not 'string'`;
    if (!isRecognisedType(options.type))
        return `${badOptionsType}'${sanitiseString(options.type)}' not known`;

    return `${prefix} ${
        value === null
            ? 'is null not type'
            : Array.isArray(value)
                ? 'is an array not type'
                : `is type '${type}' not`
        } '${options.type}'`
    ;
}

const isRecognisedType = type => ['bigint','boolean','function','number',
    'object','string','symbol','undefined'].indexOf(type) !== -1;

const sanitiseString = str =>
    encodeURI(str.length <= 32 ? str
        : `${str.slice(0, 21)}...${str.slice(-8)}`);

/**
 * ### Validates a boolean.
 *
 * @param {any} value
 *    The value to validate.
 * @param {string} [identifier]
 *    Optional name to call `value` in the result, if invalid.
 * @param {DefaultOptions} [options={}]
 *    Optional plain object containing optional configuration (default is `{}`)
 * @returns {false|string}
 *    Returns `false` if `value` is valid, or an explanation if invalid.
 */
function aintaBoolean(
    value,
    identifier,
    options = defaultOptions,
) {
    // Use aintaType() to check whether `value` is a boolean.
    return aintaType(value, identifier, { ...options, type:'boolean' });
}

export { aintaBoolean, aintaType, narrowAintas as default };
