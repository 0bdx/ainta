/**
 * https://www.npmjs.com/package/@0bdx/ainta
 * @version 0.0.1
 * @license Copyright (c) 2023 0bdx <0@0bdx.com> (0bdx.com)
 * SPDX-License-Identifier: MIT
 */
/**
 * ### A plain object containing optional configuration for `aintaType()`.
 *
 * @typedef {Object} AintaOptions
 * @property {string} [begin]
 *     Optional text to begin the result with, eg a function name like "isOk()".
 * @property {'bigint'|'boolean'|'function'|'number'|'object'|'string'|'symbol'|'undefined'} [type]
 *     Optional JavaScript type to expect, eg "boolean" or "undefined".
 */

/**
 * ### Validates a value using JavaScript's native `typeof`.
 * 
 * Due to the way `typeof` works, these are all valid, so return `false`:
 * - `aintaType(null, { type:'object' })`
 * - `aintaType([99], { type:'object' })`
 * - `aintaType(NaN, { type:'number' })`
 *
 * @param {any} value
 *     The value to validate.
 * @param {string} [identifier]
 *     Optional name to call `value` in the result, if invalid.
 * @param {AintaOptions} [options={}]
 *     Optional plain object containing optional configuration (default is `{}`)
 * @returns {false|string}
 *     Returns `false` if `value` is valid, or an explanation if invalid.
 */
function aintaType(
    value,
    identifier,
    options = {},
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

const sanitiseString = str => {
    if (str.length <= 32) return encodeURI(str);
    return encodeURI(`${str.slice(0, 21)}...${str.slice(-8)}`);
};

export { aintaType };
