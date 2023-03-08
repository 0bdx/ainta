import aintaType from './ainta-type.js';
import { NUMBER } from './constants.js';
import { buildResultPrefix } from './helpers.js';
import emptyOptions from './options.js';

/**
 * ### Validates a number.
 *
 * If the first argument passed to `aintaNumber()` ain't a number, it returns
 * a short explanation of what went wrong. Otherwise it returns `false`.
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
 * aintaNumber('99', 'redBalloons', { begin:'flyBalloons()' });
 * // "flyBalloons(): `redBalloons` is type 'string' not 'number'"
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
export default function aintaNumber(
    value,
    identifier,
    options = emptyOptions,
) {
    // Use aintaType() to check whether `typeof value` is 'number'.
    // If not, bail out right away.
    const result = aintaType(value, identifier, { ...options, type:NUMBER });
    if (result) return result;

    // If `value` is JavaScript's special `NaN` then `typeof value` is 'number'.
    // aintaNumber() differs from `aintaType(..., { type:'number' })`, in that
    // it considers `NaN` to not be a number.
    // Note that `value` must be a number here - `Number.isNaN()` is not needed.
    if (isNaN(value)) return buildResultPrefix(options.begin, identifier) +
        'is the special `NaN` value';

    return false;
}

/**
 * aintaNumber() unit tests.
 * 
 * @param {aintaNumber} f
 *    The `aintaNumber()` function to test.
 * @returns {void}
 *    Does not return anything.
 * @throws
 *    Throws an `Error` if a test fails
 */
export function aintaNumberTest(f) {
    const equal = (actual, expected) => { if (actual !== expected) throw Error(
        `actual:\n${actual}\n!== expected:\n${expected}\n`) };

    // Typical usage.
    equal(f(-Infinity),
        false);
    equal(f(5.5e5, null, { begin:'Number Test' }),
        false);
    equal(f(0b100100, 'binary', {}),
        false);
    equal(f(Number('33.333'), "Number('33.333')", { begin:'Number Test' }),
        false);
    equal(f(NaN),
        "A value is the special `NaN` value");
    equal(f(parseInt('abc', 10), 'abc', {}),
        "`abc` is the special `NaN` value");
    equal(f(void 0, null, { begin:'Number Test' }),
        "Number Test: A value is type 'undefined' not 'number'");
    equal(f([123], 'arr'),
        "`arr` is an array not type 'number'");
    equal(f('123', void 0, { type:'string' }),
        "A value is type 'string' not 'number'");

    // Extra `options` values cause TS errors, but do not prevent normal use.
    // @ts-expect-error
    equal(f(Number('0'), "Number('0')", { begin:'Number Test', foo:'bar' }),
        false);
    // @ts-expect-error
    equal(f(BigInt(1), 'BigInt(1)', { begin:'Number Test', foo:'bar' }),
        "Number Test: `BigInt(1)` is type 'bigint' not 'number'");

    // Invalid `options.begin` is a TS error, but does not prevent normal use.
    // @ts-expect-error
    equal(f(10e-3, '1%', { begin:['a','b','c'] }),
        false);
    // @ts-expect-error
    equal(f(NaN, '1%', { begin:['a','b','c'] }),
        "a,b,c: `1%` is the special `NaN` value");

    // Invalid `options.type` is a TS error, but does not prevent normal use.
    // @ts-expect-error
    equal(f(Math.PI, 'π', { type:String }),
        false);
    // @ts-expect-error
    equal(f('PI', 'π', { type:String }),
        "`π` is type 'string' not 'number'");

    // In fact, `options.type` is ignored, even if it's a valid type.
    equal(f(Number(Infinity), 'Number(Infinity)', { type:'undefined' }),
        false);
    equal(f(void 0, 'The Black Hole', { type:'undefined' }),
        "`The Black Hole` is type 'undefined' not 'number'");
}
