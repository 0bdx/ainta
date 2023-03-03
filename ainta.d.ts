/**
 * ### A plain object containing optional configuration for `aintaType()`.
 */
export type AintaTypeOptions = {
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
 * ### A plain object containing optional configuration for `aintaBoolean()`.
 */
export type AintaBooleanOptions = {
    /**
     * Optional text to begin the result with, eg a function name like "isOk()".
     */
    begin?: string;
};
/**
 * ### A plain object containing optional configuration for `aintaBoolean()`.
 *
 * @typedef {Object} AintaBooleanOptions
 * @property {string} [begin]
 *     Optional text to begin the result with, eg a function name like "isOk()".
 */
/**
 * ### Validates a boolean.
 *
 * @param {any} value
 *     The value to validate.
 * @param {string} [identifier]
 *     Optional name to call `value` in the result, if invalid.
 * @param {AintaBooleanOptions} [options={}]
 *     Optional plain object containing optional configuration (default is `{}`)
 * @returns {false|string}
 *     Returns `false` if `value` is valid, or an explanation if invalid.
 */
export function aintaBoolean(value: any, identifier?: string, options?: AintaBooleanOptions): false | string;
/**
 * https://www.npmjs.com/package/@0bdx/ainta
 * @version 0.0.1
 * @license Copyright (c) 2023 0bdx <0@0bdx.com> (0bdx.com)
 * SPDX-License-Identifier: MIT
 */
/**
 * ### A plain object containing optional configuration for `aintaType()`.
 *
 * @typedef {Object} AintaTypeOptions
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
 * @param {AintaTypeOptions} [options={}]
 *     Optional plain object containing optional configuration (default is `{}`)
 * @returns {false|string}
 *     Returns `false` if `value` is valid, or an explanation if invalid.
 */
export function aintaType(value: any, identifier?: string, options?: AintaTypeOptions): false | string;
