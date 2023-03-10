import aintaType from './ainta-type.js';
import {
    _IS_NOT_,
    CANNOT_OPTIONS,
    MAX,
    MIN,
    STRING,
} from './constants.js';
import {
    buildResultPrefix,
    validateEnumOption,
    validateNumericOption,
    validateRxishOption,
} from './helpers.js';
import emptyOptions from './options.js';

/**
 * ### Validates a string.
 *
 * If the first argument passed to `aintaString()` ain't a string, it returns
 * a short explanation of what went wrong.
 * 
 * Else, if the first argument fails any of the following conditions, it also
 * returns an explanation of what went wrong:
 * - `options.enum` - if set, this is an array of valid strings
 * - `options.max` - if set, this is the maximum allowed string length
 * - `options.min` - if set, this is the minimum allowed string length
 * - `options.rx` - if set, this is an object which has a `test()` function
 * 
 * Otherwise, `aintaString()` returns `false`.
 *
 * @example
 * import { aintaString } from '@0bdx/ainta';
 * 
 * aintaString("Ok!");
 * // false
 *
 * aintaString(["N","o","p","e"]);
 * // "A value is an array not type 'string'"
 *
 * aintaString(99, 'redBalloons', { begin:'fly()' });
 * // "fly(): `redBalloons` is type 'number' not 'string'"
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
export default function aintaString(
    value,
    identifier,
    options = emptyOptions,
) {
    // Use aintaType() to check whether `typeof value` is 'string'.
    // If not, bail out right away.
    let result = aintaType(value, identifier, { ...options, type:STRING });
    if (result) return result;

    // If `options.enum`, `.max`, `.min` or `.rx` are invalid, return a
    // helpful result. Note that setting these to `undefined` may be useful in
    // some cases, so that `{ max:undefined }` acts the same way as `{}`, which
    // is why we use `options.max !== undefined` instead of `"max" in options`.
    const optionsEnum = options.enum;
    const hasEnum = optionsEnum !== void 0;
    const optionsMax = options.max;
    const hasMax = optionsMax !== void 0;
    const optionsMin = options.min;
    const hasMin = optionsMin !== void 0;
    const optionsRx = options.rx;
    const hasRx = optionsRx !== void 0;
    result = validateEnumOption(optionsEnum, hasEnum)
     || validateNumericOption(MAX, optionsMax, hasMax)
     || validateNumericOption(MIN, optionsMin, hasMin)
     || validateRxishOption(optionsRx, hasRx)

    // If `options.max` and `options.min` are both being used, but `max` is
    // less than `min`, return a helpful result.
     || (hasMax && hasMin && optionsMax < optionsMin
        ? CANNOT_OPTIONS + 'max` < `options.min`'

        // Xx.
        : hasEnum && optionsEnum.indexOf(value) == -1
            ? 'enum issue @TODO'

            // Check that `value` is not longer than the 'max' option, if set.
            : hasMax && optionsMax < value.length
                ? value + _IS_NOT_ + MAX + ' ' + optionsMax

                // Check that `value` is not shorter than 'min' option, if set.
                : hasMin && optionsMin > value.length
                    ? value + _IS_NOT_ + MIN + ' ' + optionsMin

                    // Test if `value` passes the 'RegExp' option, if set.
                    : hasRx && !optionsRx.test(value)
                        ? value + ' fails ' + optionsRx
                        : ''
    );

    return result
        ? buildResultPrefix(options.begin, identifier) + result
        : false;
}

/**
 * aintaString() unit tests.
 * 
 * @param {aintaString} f
 *    The `aintaString()` function to test.
 * @returns {void}
 *    Does not return anything.
 * @throws
 *    Throws an `Error` if a test fails
 */
export function aintaStringTest(f) {
    const equal = (actual, expected) => { if (actual !== expected) throw Error(
        `actual:\n${actual}\n!== expected:\n${expected}\n`) };

    // Invalid `options.enum` produces a helpful result.
    equal(f('1', 'one', { enum:null, max:null }), // the `max` error is ignored
        "`one` cannot be validated, `options.enum` is null not an array");
/*
    // @ts-expect-error
    equal(f('2', undefined, { enum:'nope' }),
        "A value cannot be validated, `options.enum` is type 'string' not an array");
    equal(f('3', 'three', { enum:['0','1','2',null,'4','5'] }),
        "`three` cannot be validated, `options.enum[3]` is null not type 'string'");
    // @ts-expect-error
    equal(f('4', 'four', { enum:['0','1','2','3',['4'],5] }),
        "`four` cannot be validated, `options.enum[4]` is an array not type 'string'");
    // @ts-expect-error
    equal(f('5', 'five', { enum:['0','1','2','3','4',NaN] }),
        "`five` cannot be validated, `options.enum[5]` is type 'number' not 'string'");

    // Invalid `options.lte` produces a helpful result.
    equal(f(1, 'one', { begin:'Lte', lte:null }),
        "Lte: `one` cannot be validated, `options.lte` is null not type 'number'");
    // @ts-expect-error
    equal(f(2, undefined, { lte:[], mod:false }), // the `mod` error is ignored
        "A value cannot be validated, `options.lte` is an array not type 'number'");
    // @ts-expect-error
    equal(f(3, null, { begin:'Three', lte:Symbol('abc') }),
        "Three: A value cannot be validated, `options.lte` is type 'symbol' not 'number'");
    equal(f(4, 'nope', { lte:NaN, mod:0 }), // the `mod` error is ignored
        "`nope` cannot be validated, `options.lte` is the special `NaN` value");

    // Invalid combination of `options.gte` and `options.lte` produces a helpful result.
    equal(f(5, 'five', { gte:5.001, lte:5 }),
        "`five` cannot be validated, `options.gte` > `options.lte`");
    equal(f(6, '', { begin:'impossible range', gte:Infinity, lte:-Infinity }),
        "impossible range: A value cannot be validated, `options.gte` > `options.lte`");

    // Invalid `options.mod` produces a helpful result.
    equal(f(1, 'one', { begin:'%', mod:null }),
        "%: `one` cannot be validated, `options.mod` is null not type 'number'");
    // @ts-expect-error
    equal(f(2, 'two', { mod:[] }),
        "`two` cannot be validated, `options.mod` is an array not type 'number'");
    // @ts-expect-error
    equal(f(3, null, { begin:'Three', mod:Boolean(0) }),
        "Three: A value cannot be validated, `options.mod` is type 'boolean' not 'number'");
    equal(f(4, void 0, { mod:NaN }),
        "A value cannot be validated, `options.mod` is the special `NaN` value");
    equal(f(5, 'five', { mod:0 }),
        "`five` cannot be validated, `options.mod` is zero");

    // Typical usage without `options.gte`, `.lte` or `.mod`.
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

    // Typical `options.mod` usage.
    equal(f(1, null, { mod:5 }),
        "A value 1 is not divisible by 5");
    equal(f(5, null, { mod:5 }),
        false);
    equal(f(0b101, 'binary', { mod:0b10 }),
        "`binary` 5 is not divisible by 2");
    equal(f(0b100, 'binary', { mod:0b10 }),
        false);
    equal(f(-54.9999, null, { begin:'Number Test', mod:55.5 }),
        "Number Test: A value -54.9999 is not divisible by 55.5");
    equal(f(-55.5, null, { begin:'Number Test', mod:55.5 }),
        false);
    equal(f(2 * 10e-3, '2%', { begin:'percent()', mod:3 * 10e-3 }),
        "percent(): `2%` 0.02 is not divisible by 0.03");
    equal(f(Number(false), '0%', { begin:'percent()', mod:10e-3 }),
        false);

    // Using `options.gte` and `options.mod` together.
    equal(f(5, null, { gte:8, mod:5 }),
        "A value 5 is not gte 8");
    equal(f(8, null, { gte:8, mod:5 }),
        "A value 8 is not divisible by 5");
    equal(f(10, null, { gte:8, mod:5 }),
        false);

    // Using `options.gte` and `options.mod` together.
    equal(f(5, 'integer', { begin:'>', lte:1, mod:1 }),
        ">: `integer` 5 is not lte 1");
    equal(f(0.5, 'integer', { begin:'>', lte:1, mod:1 }),
        ">: `integer` 0.5 is not divisible by 1");
    equal(f(-5, 'integer', { begin:'>', lte:1, mod:1 }),
        false);

    // Using `options.gte`, `.lte` and `.mod` together.
    equal(f(0, 'impossible', { gte:1, lte:2, mod:3 }),
        "`impossible` 0 is not gte 1");
    equal(f(3, 'impossible', { gte:1, lte:2, mod:3 }),
        "`impossible` 3 is not lte 2");
    equal(f(1.5, 'impossible', { gte:1, lte:2, mod:3 }),
        "`impossible` 1.5 is not divisible by 3");
    equal(f(0, '', { begin:'possible', gte:1, lte:4, mod:3 }),
        "possible: A value 0 is not gte 1");
    equal(f(6, '', { begin:'possible', gte:1, lte:4, mod:3 }),
        "possible: A value 6 is not lte 4");
    equal(f(3,'', { begin:'possible', gte:1, lte:4, mod:3 }),
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

    // `options.gte`, `.lte` and `.mod` are ignored if set to `undefined`.
    equal(f(0, 'gte', { gte:void 0 }),
        false);
    equal(f('', 'gte', { gte:void 0 }),
        "`gte` is type 'string' not 'number'");
    equal(f(0, 'lte', { lte:undefined }),
        false);
    equal(f(NaN, 'lte', { lte:undefined }),
        "`lte` is the special `NaN` value");
    equal(f(0, 'mod', { gte:0, mod:({}).nope }),
        false);
    equal(f(-0.001, 'mod', { gte:0, mod:({}).nope }),
        "`mod` -0.001 is not gte 0");

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
*/
}
