import aintaType from './ainta-type.js';
import {
    _IS_NOT_,
    CANNOT_OPTIONS,
    GTE,
    IS_NAN,
    LTE,
    NUMBER,
} from './constants.js';
import { buildResultPrefix, validateOptionNumber } from './helpers.js';
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
 *    Also returns an explanation if any of the `options` it uses are invalid.
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

    // If `options.gte` or `options.lte` is invalid, return a helpful result.
    // Note that setting these to `undefined` may be useful in some cases, eg
    // `{ gte:undefined }` as well as `{}`, so we don't use `"gte" in options`.
    const { begin } = options;
    const optionsGte = options.gte;
    const hasGte = optionsGte !== void 0;
    result = validateOptionNumber(GTE, optionsGte, hasGte, begin, identifier);
    if (result) return result;
    const optionsLte = options.lte;
    const hasLte = optionsLte !== void 0;
    result = validateOptionNumber(LTE, optionsLte, hasLte, begin, identifier);
    if (result) return result;

    // If `options.gte` and `options.lte` are both being used, but `gte` is
    // greater than `lte`, return a helpful result.
    result = hasGte && hasLte && optionsGte > optionsLte
        ? CANNOT_OPTIONS + 'gte` > `options.lte`'

        // `aintaNumber()` differs from `aintaType(..., { type:'number' })`,
        // in that it doesn't consider `NaN` to be a number. At this point,
        // `typeof value` is 'number' but it could be `NaN`, so use `isNaN()`
        // to check. Note that `Number.isNaN()` is not necessary in this case.
        : isNaN(value)
            ? IS_NAN

            // Compare `value` with the 'Greater Than or Equal' option, if present.
            : hasGte && optionsGte > value
                ? value + _IS_NOT_ + GTE + ' ' + optionsGte

                // Compare `value` with the 'Less Than or Equal' option, if present.
                : hasLte && optionsLte < value
                    ? value + _IS_NOT_ + LTE + ' ' + optionsLte
                    : '';

    return result
        ? buildResultPrefix(begin, identifier) + result
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

    // Invalid `options.gte` produces a helpful result.
    equal(f(1, 'one', { gte:null }),
        "`one` cannot be validated, `options.gte` is null not type 'number'");
    // @ts-expect-error
    equal(f(2, undefined, { gte:[] }),
        "A value cannot be validated, `options.gte` is an array not type 'number'");
    // @ts-expect-error
    equal(f(3, 'three', { gte:true }),
        "`three` cannot be validated, `options.gte` is type 'boolean' not 'number'");
    equal(f(4, 'nope', { begin:'NaN', gte:NaN }),
        "NaN: `nope` cannot be validated, `options.gte` is the special `NaN` value");

    // Invalid `options.lte` produces a helpful result.
    equal(f(1, 'one', { begin:'Lte', lte:null }),
        "Lte: `one` cannot be validated, `options.lte` is null not type 'number'");
    // @ts-expect-error
    equal(f(2, undefined, { lte:[] }),
        "A value cannot be validated, `options.lte` is an array not type 'number'");
    // @ts-expect-error
    equal(f(3, null, { begin:'Three', lte:Symbol('abc') }),
        "Three: A value cannot be validated, `options.lte` is type 'symbol' not 'number'");
    equal(f(4, 'nope', { lte:NaN }),
        "`nope` cannot be validated, `options.lte` is the special `NaN` value");

    // Invalid combination of `options.gte` and `options.lte` produces a helpful result.
    equal(f(5, 'five', { gte:5.001, lte:5 }),
        "`five` cannot be validated, `options.gte` > `options.lte`");
    equal(f(6, '', { begin:'impossible range', gte:Infinity, lte:-Infinity }),
        "impossible range: A value cannot be validated, `options.gte` > `options.lte`");

    // Typical usage without `options.gte` or `options.lte`.
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
    equal(f(BigInt(99)),
        "A value is type 'bigint' not 'number'");
    equal(f([123], 'arr'),
        "`arr` is an array not type 'number'");
    equal(f(null, null, { begin: 'arr' }),
        "arr: A value is null not type 'number'");
    equal(f('123', void 0, { type:'string' }),
        "A value is type 'string' not 'number'");

    // Typical `options.gte` usage.
    equal(f(Infinity, null, { gte:5 }),
        false);
    equal(f(2, null, { gte:5 }),
        "A value 2 is not gte 5");
    equal(f(0b100101, 'binary', { gte:37 }),
        false);
    equal(f(0b100100, 'binary', { gte:37 }),
        "`binary` 36 is not gte 37");
    equal(f(-Infinity, null, { begin:'Number Test', gte:-Infinity }),
        false);
    equal(f(-55.0001, null, { begin:'Number Test', gte:-55 }),
        "Number Test: A value -55.0001 is not gte -55");
    equal(f(10e-3, '1%', { begin:'percent()', gte:10e-3 }),
        false);
    equal(f(Number(false), '0%', { begin:'percent()', gte:10e-3 }),
        "percent(): `0%` 0 is not gte 0.01");

    // Typical `options.lte` usage.
    equal(f(-1.0, null, { lte:-5 }),
        "A value -1 is not lte -5");
    equal(f(-Infinity, null, { lte:-5 }),
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

    // Using `options.gte` and `options.lte` together.
    equal(f(4, null, { gte:5, lte:5 }),
        "A value 4 is not gte 5");
    equal(f(5, null, { gte:5, lte:5 }),
        false);
    equal(f(5.001, null, { gte:5, lte:5 }),
        "A value 5.001 is not lte 5");

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

    // `options.gte` is ignored if it's set to `undefined`.
    equal(f(0, 'z', { gte:void 0 }),
        false);
    equal(f('', 'z', { gte:void 0 }),
        "`z` is type 'string' not 'number'");

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
