import {
    _NOT_,
    _NOT_AN_ARRAY,
    IS_NULL,
    IS_TYPE_,
} from './constants.js';
import { buildResultPrefix, isArray, quote } from './helpers.js';
import emptyOptions from './options.js';

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
 * @param {import('./options').Options} [options={}]
 *    The standard `ainta` configuration object (optional, defaults to `{}`)
 * @returns {false|string}
 *    Returns `false` if `value` is valid, or an explanation if not.
 */
export default function aintaArray(
    value,
    identifier,
    options = emptyOptions,
) {
    // Process the happy path as quickly as possible.
    if (isArray(value)) return false;

    // Generate an explanation of what went wrong.
    return buildResultPrefix(options.begin, identifier) + (
        value === null
            ? IS_NULL
            : IS_TYPE_ + quote(typeof value)
        ) + _NOT_AN_ARRAY
    ;
}

/**
 * aintaArray() unit tests.
 * 
 * @param {aintaArray} f
 *    The `aintaArray()` function to test.
 * @returns {void}
 *    Does not return anything.
 * @throws
 *    Throws an `Error` if a test fails
 */
export function aintaArrayTest(f) {
    const equal = (actual, expected) => { if (actual !== expected) throw Error(
        `actual:\n${actual}\n!== expected:\n${expected}\n`) };

    // Typical usage.
    equal(f([]),
        false);
    equal(f([1, 2, 3], void 0, { begin:'Array Test' }),
        false);
    equal(f(Array(3), '3 empty slots', {}),
        false);
    equal(f('a|b|c'.split('|'), 'list', { begin:'Array Test' }),
        false);
    equal(f(),
        "A value is type 'undefined' not an array");
    equal(f(null, 'list', { begin:'Array Test' }),
        "Array Test: `list` is null not an array");
    equal(f(void 0, null, { begin:'Array Test' }),
        "Array Test: A value is type 'undefined' not an array");
    equal(f({ length:1, push(){}, pop(){} }, 'pseudo-array'),
        "`pseudo-array` is type 'object' not an array");
    equal(f(123, void 0, { type:'number' }),
        "A value is type 'number' not an array");

    // Extra `options` values cause TS errors, but do not prevent normal use.
    // @ts-expect-error
    equal(f([[[[]]]], 'deeply-nested', { begin:'Array Test', foo:'bar' }),
        false);
    // @ts-expect-error
    equal(f('[[[[]]]]', 'deeply-nested', { begin:'Array Test', foo:'bar' }),
        "Array Test: `deeply-nested` is type 'string' not an array");

    // Invalid `options.begin` is a TS error, but does not prevent normal use.
    // @ts-expect-error
    equal(f(Array(0), undefined, { begin:77 }),
        false);
    // @ts-expect-error
    equal(f(Array.constructor, undefined, { begin:77 }),
        "77: A value is type 'function' not an array");

    // Invalid `options.gte` is a TS error, but does not prevent normal use.
    // @ts-expect-error
    equal(f(''.split(','), null, { gte:[] }),
        false);
    // @ts-expect-error
    equal(f(/123/, null, { gte:[] }),
        "A value is type 'object' not an array");

    // Invalid `options.type` is a TS error, but does not prevent normal use.
    // @ts-expect-error
    equal(f([], undefined, { type:100 }),
        false);
    // @ts-expect-error
    equal(f(new ArrayBuffer(8), undefined, { type:100 }),
        "A value is type 'object' not an array");

    // In fact, `options.type` is ignored, even if it's a valid type.
    equal(f(new Array(3), 'null', { type:'number' }),
        false);
    equal(f(NaN, 'not a number', { type:'number' }), // no mention of the special `NaN` value
        "`not a number` is type 'number' not an array");
}
