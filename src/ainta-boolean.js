import aintaType from './ainta-type.js';

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
export default function aintaBoolean(
    value,
    identifier,
    options = {},
) {
    // Use aintaType() to check whether `value` is a boolean.
    return aintaType(value, identifier, { ...options, type:'boolean' });
}

/**
 * aintaBoolean() unit tests.
 * 
 * @param {aintaBoolean} f
 *     The `aintaBoolean()` function to test.
 * @returns {void}
 *     Does not return anything.
 * @throws
 *     Throws an `Error` if a test fails
 */
export function aintaBooleanTest(f) {
    const equal = (actual, expected) => { if (actual !== expected) throw Error(
        `actual:\n${actual}\n!== expected:\n${expected}\n`) };

    // Invalid `options.begin` is a TS error, but does not prevent normal use.
    // @TODO

    // Setting `options.type` is a TS error, but does not prevent normal use.
    // @ts-expect-error
    equal(f(true, 'flag', { type:'string' }),
        false);

    // Extra `options` values cause TS errors, but do not prevent normal use.
    // @ts-expect-error
    equal(f(Boolean(1), 'Boolean(1)', { begin:'Boolean Test', foo:'bar' }),
        false);

    // Typical usage.
    equal(f(true, null, { begin:'Boolean Test' }),
        false);
    equal(f(false, 'flag', {}),
        false);
    equal(f(Boolean(0), 'Boolean(0)', { begin:'Boolean Test' }),
        false);
    equal(f(null, 'nullish', { begin:'Boolean Test' }),
        "Boolean Test: `nullish` is null not type 'boolean'");
    equal(f(void 0, null, { begin:'Boolean Test' }),
        "Boolean Test: A value is type 'undefined' not 'boolean'");
    equal(f([], 'arr'),
        "`arr` is an array not type 'boolean'");
    // @ts-expect-error
    equal(f('true', void 0, { type:'boolean' }),
        "A value is type 'string' not 'boolean'");
}
