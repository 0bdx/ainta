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
 * `aintaNumber()` differs from `aintaType(..., { type:'number' })`, in that it
 * doesn't consider `NaN` to be a number
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
    let result = aintaType(value, identifier, { ...options, type:NUMBER });
    if (result) return result;

    // `aintaNumber()` differs from `aintaType(..., { type:'number' })`, in that
    // it doesn't consider `NaN` to be a number. At this point `typeof value` is
    // 'number' but it could be `NaN`, so use `isNaN()` to check. Note that the
    // newer `Number.isNaN()` is not necessary in this case.
    result = isNaN(value)
        ? 'is the special `NaN` value'

        // Compare `value` with the 'Greater Than or Equal' option, if present.
        : 'gte' in options && options.gte > value
            ? value + ' is not gte ' + options.gte

            // Compare `value` with the 'Less Than or Equal' option, if present.
            : 'lte' in options && options.lte < value
                ? value + ' is not lte ' + options.lte
                : '';

    return result
        ? buildResultPrefix(options.begin, identifier) + result
        : false;
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

    // Typical options.gte usage.
    equal(f(10, null, { gte:5 }),
        false);
    equal(f(2, null, { gte:5 }),
        "A value 2 is not gte 5");
    equal(f(0b100101, 'binary', { gte:37 }),
        false);
    equal(f(0b100100, 'binary', { gte:37 }),
        "`binary` 36 is not gte 37");
    equal(f(-55, null, { begin:'Number Test', gte:-55 }),
        false);
    equal(f(-55.0001, null, { begin:'Number Test', gte:-55 }),
        "Number Test: A value -55.0001 is not gte -55");
    equal(f(10e-3, '1%', { begin:'percent()', gte:10e-3 }),
        false);
    equal(f(Number(false), '0%', { begin:'percent()', gte:10e-3 }),
        "percent(): `0%` 0 is not gte 0.01");

    // Typical options.lte usage.
    equal(f(10, null, { lte:5 }),
        "A value 10 is not lte 5");
    equal(f(5, null, { lte:5 }),
        false);
    equal(f(0xabc, 'hex', { lte:37 }),
        "`hex` 2748 is not lte 37");
    equal(f(0x1bc, 'hex', { lte:5000 }),
        false);
    equal(f(-54.9999, null, { begin:'Number Test', lte:-55 }),
        "Number Test: A value -54.9999 is not lte -55");
    equal(f(-55.0001, null, { begin:'Number Test', lte:-55 }),
        false);
    equal(f(2 * 10e-3, '2%', { begin:'percent()', lte:10e-3 }),
        "percent(): `2%` 0.02 is not lte 0.01");
    equal(f(Number(false), '0%', { begin:'percent()', lte:10e-3 }),
        false);

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
