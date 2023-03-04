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
export default defaultOptions;
