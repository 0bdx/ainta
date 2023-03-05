import {
    IS_AN_ARRAY,
    IS_TYPE,
    NOT,
    NULL,
} from './constants.js';
import { buildResultPrefix, isArray, quote } from './helpers.js';
import emptyOptions from './options.js';

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
 * @param {import('./options').Options} [options={}]
 *    The standard `ainta` configuration object (optional, defaults to `{}`)
 * @returns {false|string}
 *    Returns `false` if `value` is valid, or an explanation if not.
 */
export default function aintaNull(
    value,
    identifier,
    options = emptyOptions,
) {
    // Process the happy path as quickly as possible.
    if (value === null) return false;

    // Generate an explanation of what went wrong.
    return buildResultPrefix(options.begin, identifier) + (
        isArray(value)
            ? IS_AN_ARRAY
            : IS_TYPE + quote(typeof value)
        ) + NOT + NULL
    ;
}

/**
 * aintaNull() unit tests.
 * 
 * @param {aintaNull} f
 *    The `aintaNull()` function to test.
 * @returns {void}
 *    Does not return anything.
 * @throws
 *    Throws an `Error` if a test fails
 */
export function aintaNullTest(f) {
    const equal = (actual, expected) => { if (actual !== expected) throw Error(
        `actual:\n${actual}\n!== expected:\n${expected}\n`) };

    // Typical usage.
    equal(f(null),
        false);
    equal(f(null, null, { begin:'Null Test' }),
        false);
    equal(f(null, 'x', {}),
        false);
    equal(f(null, 'NULL', { begin:'Null Test' }),
        false);
    equal(f(),
        "A value is type 'undefined' not null");
    equal(f(false, 'NULL', { begin:'Null Test' }),
        "Null Test: `NULL` is type 'boolean' not null");
    equal(f(void 0, null, { begin:'Null Test' }),
        "Null Test: A value is type 'undefined' not null");
    equal(f([], 'arr'),
        "`arr` is an array not null");
    equal(f('nope', void 0, { type:'string' }),
        "A value is type 'string' not null");

    // Extra `options` values cause TS errors, but do not prevent normal use.
    // @ts-expect-error
    equal(f(null, 'NULL', { begin:'Null Test', foo:'bar' }),
        false);
    // @ts-expect-error
    equal(f(['x','y','z'], 'NULL', { begin:'Null Test', foo:'bar' }),
        "Null Test: `NULL` is an array not null");

    // Invalid `options.begin` is a TS error, but does not prevent normal use.
    // @ts-expect-error
    equal(f(null, '--', { begin:77 }),
        false);
    // @ts-expect-error
    equal(f({}, '--', { begin:77 }),
        "77: `--` is type 'object' not null");

    // Invalid `options.type` is a TS error, but does not prevent normal use.
    // @ts-expect-error
    equal(f(null, undefined, { type:100 }),
        false);
    // @ts-expect-error
    equal(f([], undefined, { type:100 }),
        "A value is an array not null");

    // In fact, `options.type` is ignored, even if it's a valid type.
    equal(f(null, 'null', { type:'number' }),
        false);
    equal(f(99.999, 'Nearly one hundred', { type:'number' }),
        "`Nearly one hundred` is type 'number' not null");
}
