import aintaType from './ainta-type.js';
import {
    _IS_NOT_,
    CANNOT_OPTIONS,
    ENUM,
    FUNCTION,
    MAX,
    MIN,
    STRING,
} from './constants.js';
import {
    buildResultPrefix,
    saq,
    validateArrayOfStringsOption,
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
 * aintaString(99, 'redBalloons', { begin:'fly()' });
 * // "fly(): `redBalloons` is type 'number' not 'string'"
 * 
 * equal(f('Fum!', null, { enum:['Fee','Fi','Fo'] }),
 * // "A value 'Fum!' is not in 'Fee:Fi:Fo'"
 *
 * @param {any} value
 *    The value to validate.
 * @param {string} [identifier]
 *    Optional name to call `value` in the explanation, if invalid.
 * @param {import('./options').Options} [options={}]
 *    The standard `ainta` configuration object (optional, defaults to `{}`).
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
    result =
        validateArrayOfStringsOption(ENUM, optionsEnum, hasEnum)
     || validateNumericOption(MAX, optionsMax, hasMax, false, true)
     || validateNumericOption(MIN, optionsMin, hasMin, false, true)
     || validateRxishOption(optionsRx, hasRx)

    // If `options.max` and `options.min` are both being used, but `max` is less
    // than `min`, return a helpful result.
     || (hasMax && hasMin && optionsMax < optionsMin
        ? CANNOT_OPTIONS + 'max` < `options.min`'

        // Check that `value` exists in the `options.enum` array, if set.
        : hasEnum && optionsEnum.indexOf(value) == -1
            ? saq(value) + ' is not in ' + saq(optionsEnum.join(':'))

            // Check that `value` is not longer than `options.max`, if set.
            : hasMax && optionsMax < value.length
                ? saq(value) + _IS_NOT_ + MAX + ' ' + optionsMax

                // Check that `value` is not shorter than `options.max`, if set.
                : hasMin && optionsMin > value.length
                    ? saq(value) + _IS_NOT_ + MIN + ' ' + optionsMin

                    // Test if `value` passes the RegExp option, if set.
                    : hasRx && !optionsRx.test(value)
                        ? saq(value) + ' fails '
                            + (optionsRx instanceof RegExp
                                ? optionsRx
                                : 'custom test ' + FUNCTION)
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
    equal(f('6', 'six', { enum:[] }),
        "`six` cannot be validated, `options.enum` is empty");

    // Invalid `options.max` produces a helpful result.
    equal(f('1', 'one', { begin:'Max', max:null }),
        "Max: `one` cannot be validated, `options.max` is null not type 'number'");
    // @ts-expect-error
    equal(f('2', undefined, { max:[], min:false }), // the `min` error is ignored
        "A value cannot be validated, `options.max` is an array not type 'number'");
    // @ts-expect-error
    equal(f('3', null, { begin:'Three', max:BigInt(123) }),
        "Three: A value cannot be validated, `options.max` is type 'bigint' not 'number'");
    // @ts-expect-error
    equal(f('4', 'nope', { max:NaN, rx:0 }), // the `rx` error is ignored
        "`nope` cannot be validated, `options.max` is the special `NaN` value");
    equal(f('5', '', { max:-1 }),
        "A value cannot be validated, `options.max` is negative");

    // Invalid `options.min` produces a helpful result.
    equal(f('1', 'one', { begin:'Max', min:null }),
        "Max: `one` cannot be validated, `options.min` is null not type 'number'");
    // @ts-expect-error
    equal(f('2', undefined, { min:[], rx:false }), // the `rx` error is ignored
        "A value cannot be validated, `options.min` is an array not type 'number'");
    // @ts-expect-error
    equal(f('3', null, { begin:'Three', min:{} }),
        "Three: A value cannot be validated, `options.min` is type 'object' not 'number'");
    // @ts-expect-error
    equal(f('4', 'nope', { min:NaN, rx:0 }), // the `rx` error is ignored
        "`nope` cannot be validated, `options.min` is the special `NaN` value");

    // Invalid combination of `options.max` and `.min` produces a helpful result.
    equal(f('5', 'five', { max:5, min:5.001 }),
        "`five` cannot be validated, `options.max` < `options.min`");
    equal(f('6', '', { begin:'impossible range', max:0, min:Infinity }),
        "impossible range: A value cannot be validated, `options.max` < `options.min`");

    // Invalid `options.rx` produces a helpful result.
    equal(f('1', 'one', { begin:'%', rx:null }),
        "%: `one` cannot be validated, `options.rx` is null not type 'object'");
    // @ts-expect-error
    equal(f('2', 'two', { rx:[] }),
        "`two` cannot be validated, `options.rx` is an array not type 'object'");
    // @ts-expect-error
    equal(f('3', null, { begin:'Three', rx:Boolean(1) }),
        "Three: A value cannot be validated, `options.rx` is type 'boolean' not 'object'");
    // @ts-expect-error
    equal(f('4', void 0, { rx:NaN }),
        "A value cannot be validated, `options.rx` is type 'number' not 'object'");
    // @ts-expect-error
    equal(f('5', 'five', { rx:{} }),
        "`five` cannot be validated, `options.rx.test` is type 'undefined' not 'function'");
    equal(f('6', '6', { begin:'six()', rx:{ test:null } }),
        "six(): `6` cannot be validated, `options.rx.test` is null not type 'function'");
    // @ts-expect-error
    equal(f('7', null, { begin:'seven()', rx:{ test:[] } }),
        "seven(): A value cannot be validated, `options.rx.test` is an array not type 'function'");
    // @ts-expect-error
    equal(f('8', '', { rx:{ test:8 } }),
        "A value cannot be validated, `options.rx.test` is type 'number' not 'function'");

    // Typical usage without `options.enum`, `.max`, `.min` or `.rx`.
    equal(f(''),
        false);
    equal(f(String(123), null, { begin:'String Test' }),
        false);
    equal(f(JSON.stringify([true,{}]), 'stringified JSON', {}),
        false);
    equal(f((33.33).toString(), "(33.33).toString()", { begin:'String Test' }),
        false);
    equal(f(NaN),
        "A value is type 'number' not 'string'");
    equal(f(void 0, null, { begin:'String Test' }),
        "String Test: A value is type 'undefined' not 'string'");
    equal(f(Symbol('not-a-string')),
        "A value is type 'symbol' not 'string'");
    equal(f(["N","o","p","e"], 'arr'),
        "`arr` is an array not type 'string'");
    equal(f(null, null, { begin: 'NULL' }),
        "NULL: A value is null not type 'string'");
    equal(f(123, void 0, { type:'number' }),
        "A value is type 'number' not 'string'");

    // Typical `options.enum` usage.
    equal(f('b', null, { enum:['a','b','c'] }),
        false);
    equal(f('B', null, { enum:['a','b','c'] }),
        "A value 'B' is not in 'a:b:c'");
    equal(f('', 'empty', { enum:['Full',''] }),
        false);
    equal(f(' ', 'empty', { enum:['Full',''] }),
        "`empty` ' ' is not in 'Full:'");
    equal(f('same', null, { begin:'String Test', enum:['same','same'] }),
        false);
    equal(f('but different', null, { begin:'String Test', enum:['same','same'] }),
        "String Test: A value 'but different' is not in 'same:same'");
    equal(f('%', '0.01', { begin:'percent()', enum:['%'] }),
        false);
    equal(f('1234567890'.repeat(5), '0.01', { begin:'percent()', enum:['1 percent'] }),
        "percent(): `0.01` '123456789012345678901...34567890' is not in '1 percent'");
    equal(f('too many items to log', null, { enum:Array(100).fill(0).map((_,i)=>i+'') }),
        "A value 'too many items to log' is not in '0:1:2:3:4:5:6:7:8:9:1...97:98:99'");
    equal(f('one item too long', null, { enum:['1234567890'.repeat(5)] }),
        "A value 'one item too long' is not in '123456789012345678901...34567890'");
    equal(f('ascii pnc', null, { enum:[' !"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~'] }),
        "A value 'ascii pnc' is not in ' !%22#$%25&'()*+,-./:;%3C=%3E...%5D%5E_%60%7B%7C%7D~'");
    equal(f('ñóþë', null, { enum:['⠁⠿⡀⣿','¡¦¾×ÿ'] }),
        "A value '%C3%B1%C3%B3%C3%BE%C3%AB' is not in "
        + "'%E2%A0%81%E2%A0%BF%E2%A1%80%E2%A3%BF:%C2%A1%C2%A6%C2%BE%C3%97%C3%BF'");

    // Typical `options.max` usage.
    equal(f('abcd', null, { max:3 }),
        "A value 'abcd' is not max 3");
    equal(f('abc', null, { max:3 }),
        false);
    equal(f(' !"#$%&\'()*+,-./:;<=>?@', 'ascii low pnc', { max:0 }),
        "`ascii low pnc` ' !%22#$%25&'()*+,-./:;%3C=%3E?@' is not max 0");
    equal(f('', 'ascii low pnc', { max:0 }),
        false);
    equal(f('[\\]^_`{|}~', null, { begin:'ASCII high pnc', max:9 }),
        "ASCII high pnc: A value '%5B%5C%5D%5E_%60%7B%7C%7D~' is not max 9");
    equal(f('[\\]^_`{|}~', null, { begin:'ASCII high pnc', max:10 }),
        false);
    equal(f('a', 'is allowed,', { begin:'Non-integer', max:10e-3 }),
        "Non-integer: `is allowed,` 'a' is not max 0.01");
    equal(f('', 'is allowed,', { begin:'Non-integer', max:10e-3 }),
        false);

    // Using `options.enum` and `options.max` together.
    equal(f('abcde', null, { enum:['abc'], max:5 }),
        "A value 'abcde' is not in 'abc'");
    equal(f('abcdef', null, { enum:['abcdef'], max:5 }),
        "A value 'abcdef' is not max 5");
    equal(f('abc', null, { enum:['abc'], max:5 }),
        false);

    // Typical `options.min` usage.
    equal(f('ab', null, { min:3 }),
        "A value 'ab' is not min 3");
    equal(f('abc', null, { min:3 }),
        false);
    equal(f(' !"#$%&\'()*+,-./:;<=>?@', 'ascii low pnc', { min:24 }),
        "`ascii low pnc` ' !%22#$%25&'()*+,-./:;%3C=%3E?@' is not min 24");
    equal(f(' !"#$%&\'()*+,-./:;<=>?@', 'ascii low pnc', { min:23 }),
        false);
    equal(f(' !"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~', '', { begin:'all', min:33.01 }),
        "all: A value ' !%22#$%25&'()*+,-./:;%3C=%3E...%5D%5E_%60%7B%7C%7D~' is not min 33.01");
    equal(f(' !"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~', '', { begin:'all', min:33 }),
        false);
    equal(f('', 'empty_string,', { begin:'Min One', min:1 }),
        "Min One: `empty_string,` '' is not min 1");
    equal(f('', 'empty_string,', { begin:'Min Zero', min:0 }),
        false);

    // Using `options.enum` and `options.min` together.
    equal(f('abcde', null, { enum:['abc'], min:5 }),
        "A value 'abcde' is not in 'abc'");
    equal(f('abc', null, { enum:['abc'], min:5 }),
        "A value 'abc' is not min 5");
    equal(f('abcde', null, { enum:['abcde'], min:5 }),
        false);

    // Using `options.max` and `options.min` together.
    equal(f('abcdef', null, { max:5, min:5 }),
        "A value 'abcdef' is not max 5");
    equal(f('abcde', null, { max:5, min:5 }),
        false);
    equal(f('abcd', null, { max:5, min:5 }),
        "A value 'abcd' is not min 5");

    // Using `options.enum`, `.max` and `.min` together.
    equal(f('abcde', null, { enum:['abcd','123456','xyz'], max:5, min:4 }),
        "A value 'abcde' is not in 'abcd:123456:xyz'");
    equal(f('123456', null, { enum:['abcd','123456','xyz'], max:5, min:4 }),
        "A value '123456' is not max 5");
    equal(f('xyz', null, { enum:['abcd','123456','xyz'], max:5, min:4 }),
        "A value 'xyz' is not min 4");
    equal(f('abcd', null, { enum:['abcd','123456','xyz'], max:5, min:4 }),
        false);

    // Typical `options.rx` usage.
    equal(f('A', null, { rx:/a/ }),
        "A value 'A' fails /a/");
    equal(f('A', null, { rx:/a/i }),
        false);
    equal(f('ñóþë', 'Latin-1 Supplement', { rx:/^¡¦¾×ÿ$/ }),
        "`Latin-1 Supplement` '%C3%B1%C3%B3%C3%BE%C3%AB' fails /^¡¦¾×ÿ$/"); // @TODO encode rx here
    equal(f('¡¦¾×ÿ', 'Latin-1 Supplement', { rx:/^¡¦¾×ÿ$/ }),
        false);
    equal(f('⡁⠉', null, { begin:'Braille Patterns', rx:/⡀/ }),
        "Braille Patterns: A value '%E2%A1%81%E2%A0%89' fails /⡀/"); // @TODO encode rx here
    equal(f('⠁⠿⡀⣿', null, { begin:'Braille Patterns', rx:/⡀/ }),
        false);
    equal(f('A', 'custom', { begin:'Not an Rx', rx:{ test:str => str === 'a'} }),
        "Not an Rx: `custom` 'A' fails custom test function");
    equal(f('a', 'custom', { begin:'Not an Rx', rx:{ test:str => str === 'a'} }),
        false);

    // Using `options.enum` and `options.rx` together.
    equal(f('abc', null, { enum:['foo','bar','baz'], rx:/a/ }),
        "A value 'abc' is not in 'foo:bar:baz'");
    equal(f('foo', null, { enum:['foo','bar','baz'], rx:/a/ }),
        "A value 'foo' fails /a/");
    equal(f('baz', null, { enum:['foo','bar','baz'], rx:/a/ }),
        false);

    // Using `options.max` and `options.rx` together.
    equal(f('abc', null, { max:2, rx:/a/ }),
        "A value 'abc' is not max 2");
    equal(f('AB', null, { max:2, rx:/a/ }),
        "A value 'AB' fails /a/");
    equal(f('ab', null, { max:2, rx:/a/ }),
        false);

    // Using `options.min` and `options.rx` together.
    equal(f('a', null, { min:2, rx:/a/ }),
        "A value 'a' is not min 2");
    equal(f('ab', null, { min:2, rx:/A/ }),
        "A value 'ab' fails /A/");
    equal(f('ab', null, { min:2, rx:/a/ }),
        false);

    // Using `options.max`, `.min` and `.rx` together.
    equal(f('a', null, { max:2, min:2, rx:/a/ }),
        "A value 'a' is not min 2");
    equal(f('abc', null, { max:2, min:2, rx:/a/ }),
        "A value 'abc' is not max 2");
    equal(f('AB', null, { max:2, min:2, rx:/a/ }),
        "A value 'AB' fails /a/");
    equal(f('ab', null, { max:2, min:2, rx:/a/ }),
        false);

    // Using `options.enum`, `.max`, `.min` and `.rx` together.
    equal(f('abcde', null, { enum:['abcd','----','123456','xyz'], max:5, min:4, rx:/^[a-z]+$/ }),
        "A value 'abcde' is not in 'abcd:----:123456:xyz'");
    equal(f('123456', null, { enum:['abcd','----','123456','xyz'], max:5, min:4, rx:/^[a-z]+$/ }),
        "A value '123456' is not max 5");
    equal(f('xyz', null, { enum:['abcd','----','123456','xyz'], max:5, min:4, rx:/^[a-z]+$/ }),
        "A value 'xyz' is not min 4");
    equal(f('----', null, { enum:['abcd','----','123456','xyz'], max:5, min:4, rx:/^[a-z]+$/ }),
        "A value '----' fails /^[a-z]+$/"); // @TODO maybe encode rx here
    equal(f('abcd', null, { enum:['abcd','----','123456','xyz'], max:5, min:4, rx:/^[a-z]+$/ }),
        false);

    // Extra `options` values cause TS errors, but do not prevent normal use.
    // @ts-expect-error
    equal(f(String(1), "String(1)", { begin:'String Test', foo:'bar' }),
        false);
    // @ts-expect-error
    equal(f(BigInt(1), 'BigInt(1)', { begin:'String Test', foo:'bar' }),
        "String Test: `BigInt(1)` is type 'bigint' not 'string'");

    // Invalid `options.begin` is a TS error, but does not prevent normal use.
    // @ts-expect-error
    equal(f('0.01', '1%', { begin:['a','b','c'] }),
        false);
    // @ts-expect-error
    equal(f(NaN, '1%', { begin:['a','b','c'] }),
        "a,b,c: `1%` is type 'number' not 'string'");

    // `options.enum`, `.max`, `.min` and `.rx` are ignored if set to `undefined`.
    equal(f('', 'enum', { enum:void 0 }),
        false);
    equal(f(0, 'enum', { enum:void 0 }),
        "`enum` is type 'number' not 'string'");
    equal(f('', 'max', { max:undefined }),
        false);
    equal(f(null, 'max', { max:undefined }),
        "`max` is null not type 'string'");
    equal(f('', 'min', { min:void(0) }),
        false);
    equal(f([], 'min', { min:void(0) }),
        "`min` is an array not type 'string'");
    equal(f('', 'rx', { enum:[''], rx:({}).nope }),
        false);
    equal(f('a', 'rx', { enum:[''], rx:({}).nope }),
        "`rx` 'a' is not in ''");

    // Invalid `options.type` is a TS error, but does not prevent normal use.
    // @ts-expect-error
    equal(f('PI', 'π', { type:'3.14-ish' }),
        false);
    // @ts-expect-error
    equal(f(Math.PI, 'π', { type:'3.14-ish' }),
        "`π` is type 'number' not 'string'");

    // In fact, `options.type` is ignored, even if it's a valid type.
    equal(f(String(Infinity), 'String(Infinity)', { type:'boolean' }),
        false);
    equal(f(true, 'Yes', { type:'boolean' }),
        "`Yes` is type 'boolean' not 'string'");
}
