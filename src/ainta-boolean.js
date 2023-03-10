import aintaType from './ainta-type.js';
import { BOOLEAN } from './constants.js';
import emptyOptions from './options.js';

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
 * @param {import('./options').Options} [options={}]
 *    The standard `ainta` configuration object (optional, defaults to `{}`)
 * @returns {false|string}
 *    Returns `false` if `value` is valid, or an explanation if not.
 */
export default function aintaBoolean(
    value,
    identifier,
    options = emptyOptions,
) {
    // Use aintaType() to check whether `value` is a boolean.
    return aintaType(value, identifier, { ...options, type:BOOLEAN });
}

/**
 * aintaBoolean() unit tests.
 * 
 * @param {aintaBoolean} f
 *    The `aintaBoolean()` function to test.
 * @returns {void}
 *    Does not return anything.
 * @throws
 *    Throws an `Error` if a test fails
 */
export function aintaBooleanTest(f) {
    const equal = (actual, expected) => { if (actual !== expected) throw Error(
        `actual:\n${actual}\n!== expected:\n${expected}\n`) };

    // Typical usage.
    equal(f(true),
        false);
    equal(f(true, null, { begin:'Boolean Test' }),
        false);
    equal(f(false, 'flag', {}),
        false);
    equal(f(Boolean(0), 'Boolean(0)', { begin:'Boolean Test' }),
        false);
    equal(f(123),
        "A value is type 'number' not 'boolean'");
    equal(f(null, 'nullish', { begin:'Boolean Test' }),
        "Boolean Test: `nullish` is null not type 'boolean'");
    equal(f(void 0, null, { begin:'Boolean Test' }),
        "Boolean Test: A value is type 'undefined' not 'boolean'");
    equal(f([], 'arr'),
        "`arr` is an array not type 'boolean'");
    equal(f('true', void 0, { type:'boolean' }),
        "A value is type 'string' not 'boolean'");

    // Extra `options` values cause TS errors, but do not prevent normal use.
    // @ts-expect-error
    equal(f(Boolean(1), 'Boolean(1)', { begin:'Boolean Test', foo:'bar' }),
        false);
    // @ts-expect-error
    equal(f(BigInt(1), 'BigInt(1)', { begin:'Boolean Test', foo:'bar' }),
        "Boolean Test: `BigInt(1)` is type 'bigint' not 'boolean'");

    // Invalid `options.begin` is a TS error, but does not prevent normal use.
    // @ts-expect-error
    equal(f(true, 'yes', { begin:['a','b','c'] }),
        false);
    // @ts-expect-error
    equal(f(NaN, 'num', { begin:['a','b','c'] }),
        "a,b,c: `num` is type 'number' not 'boolean'");

    // Invalid `options.type` is a TS error, but does not prevent normal use.
    // @ts-expect-error
    equal(f(false, 'no', { type:String }),
        false);
    // @ts-expect-error
    equal(f([], 'obj', { type:String }),
        "`obj` is an array not type 'boolean'");

    // In fact, `options.type` is ignored, even if it's a valid type.
    equal(f(Boolean(0), 'Boolean(0)', { type:'number' }),
        false);
    equal(f(99.999, 'Nearly one hundred', { type:'number' }),
        "`Nearly one hundred` is type 'number' not 'boolean'");
}
