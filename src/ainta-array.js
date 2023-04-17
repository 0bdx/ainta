import aintaFunction from './ainta-function.js';
import aintaNumber from './ainta-number.js';
import aintaObject from './ainta-object.js';
import aintaString from './ainta-string.js';
import {
    _BT_OPT_IS_BT_,
    _IS_NOT_,
    _NOT_,
    _NOT_A_REGULAR_,
    _NOT_AN_ARRAY,
    _OF_,
    AN_ARRAY,
    CANNOT_OPTIONS,
    FUNCTION,
    IS_,
    IS_NOT_IN,
    IS_NULL,
    IS_TYPE_,
    IS,
    LEAST,
    MOST,
    NULL,
    NUMBER,
    OBJECT,
    ONE,
    PASS,
    STRING,
    THE_BT_OPT_TYPES_BT_,
    TYPE_,
    TYPES,
} from './constants.js';
import {
    buildResultPrefix,
    containsOrContainsTheClassOf,
    isArray,
    quote,
    saq,
    saqArray,
    validateArrayOfTypesOption,
    validateArrayOption,
    validateBooleanOption,
    validateNumericOption,
} from './helpers.js';
import emptyOptions from './options.js';

/**
 * ### Validates a value using JavaScript's native `Array.isArray()`.
 *
 * If the first argument passed to `aintaArray()` ain't an array, it returns
 * a short explanation of what went wrong.
 *
 * Else, if the array fails any of the following conditions, it also returns an
 * explanation of what went wrong:
 * - `options.is` - if set, this is an array containing valid items
 * - `options.least` - if set, there must be at least this number of items
 * - `options.most` - if set, there must not be more than this number of items
 * - `options.pass` - if set, each item is validated more deeply using `options`
 * - `options.types` - if set, all items must be one of these types
 * 
 * If `options.is` and `.types` are both set, items are considered valid if they
 * are either in `options.is`, or are one of the `options.types`.
 * @TODO test that
 * 
 * Otherwise, `aintaArray()` returns `false`.
 * 
 * @example
 * import { aintaArray } from '@0bdx/ainta';
 * 
 * aintaArray([1, 'two', 3], 'a', { types:['number','string'] });
 * // false
 *
 * aintaArray({});
 * // "A value is type 'object' not an array"
 *
 * aintaArray(null, 'list', { begin:'processList()' });
 * // "processList(): `list` is null not an array"
 *
 * aintaArray(['ok', null, {}], 'a', { types:['object','string'] });
 * // "`a[1]` is null, not one of the `options.types` 'object:string'"
 *
 * @param {any} value
 *    The value to validate.
 * @param {string} [identifier]
 *    Optional name to call `value` in the explanation, if invalid.
 * @param {import('./options').Options} [options={}]
 *    The standard `ainta` configuration object (optional, defaults to `{}`).
 * @returns {false|string}
 *    Returns `false` if `value` is valid, or an explanation if not.
 */
export default function aintaArray(
    value,
    identifier,
    options = emptyOptions,
) {
    // Check that `value` is an array. If not, bail out right away.
    if (!isArray(value))
        return buildResultPrefix(options.begin, identifier) + (
            value === null
                ? IS_NULL
                : IS_TYPE_ + quote(typeof value)
        ) + _NOT_AN_ARRAY;

    // Will probably be needed several times, below.
    const length = value.length;

    // If any of the `options` properties are invalid, return a helpful result.
    // Note that setting these to `undefined` may be useful in some cases, so
    // that `{ is:undefined }` acts the same way as `{}`, which is why we use
    // `options.is !== void 0` instead of `"is" in options`.
    const optionsIs = options.is;
    const hasIs = optionsIs !== void 0;
    const optionsLeast = options.least;
    const hasLeast = optionsLeast !== void 0;
    const optionsMost = options.most;
    const hasMost = optionsMost !== void 0;
    const optionsPass = options.pass;
    const hasPass = optionsPass !== void 0;
    const optionsTypes = options.types;
    const hasTypes = optionsTypes !== void 0;
    const result =
        validateArrayOption(IS, optionsIs, hasIs, [])
     || validateNumericOption(LEAST, optionsLeast, hasLeast, false, true)
     || validateNumericOption(MOST, optionsMost, hasMost, false, true)
     || validateBooleanOption(PASS, optionsPass, hasPass)
     || validateArrayOfTypesOption(TYPES, optionsTypes, hasTypes)

    // If `options.least` and `options.most` are both being used, but `least` is
    // more than `most`, return a helpful result.
     || (hasLeast && hasMost && optionsLeast > optionsMost
        ? CANNOT_OPTIONS + 'least` > `options.most`'

        // Check that the length is not less than `options.least`, if set.
        : hasLeast && optionsLeast > length
            ? 'has length ' + length + ' < `options.' + LEAST + '` ' + optionsLeast

            // Check that the length is not more than `options.most`, if set.
            : hasMost && optionsMost < length
                ? 'has length ' + length + ' > `options.' + MOST + '` ' + optionsMost
                : ''
    );

    // If any of the validation above has failed, return an explanation.
    return result
        ? buildResultPrefix(options.begin, identifier, 'An array ') + result

        // Otherwise, check that every item conforms to `options`.
        : validateEveryItem(value, length, options, hasIs, hasTypes, identifier);
}

function validateEveryItem(value, length, options, hasIs, hasTypes, identifier) {
    const { begin, is, pass, types } = options;

    // If no types are defined, the item can be any type, or even `undefined`.
    // Note that `validateArrayOption()` will already have failed an empty `is`.
    const definesTypes = hasTypes && types.length;

    // Step through each item in the `value` array.
    // In 2023, `for` loops run 3x faster than array methods on the V8 engine.
    for (let i=0; i<length; i++) {
        const item = value[i];
        const type = typeof item;
        const SQI = '[' + i + ']';

        // If the item is in `options.is` (or is an instance of a class in `is`),
        // then it's valid, and any `options.types` checks can be skipped.
        if (hasIs && containsOrContainsTheClassOf(is, item)) continue;

        // If the item did not just validate because of `options.is`, and no
        // `options.types` have been defined, then it's invalid.
        if (hasIs && !definesTypes) {
            return buildResultPrefix(
                begin,
                identifier && identifier + SQI,
                '`' + SQI + _OF_ + AN_ARRAY + '` '
            ) + IS_NOT_IN + _BT_OPT_IS_BT_ + saqArray(is);
        }

        // If the item's type is not one of `options.is`, and is not included
        // in `options.types`, return an explanation of the problem.
        if (definesTypes && types.indexOf(type) === -1) {
            return buildResultPrefix(
                begin,
                identifier && identifier + SQI,
                '`' + SQI + _OF_ + AN_ARRAY + '` '
            ) + IS_ + (
                item === null
                    ? NULL
                    : isArray(item)
                        ? AN_ARRAY
                        : TYPE_ + quote(type)
            ) + ',' + _NOT_ + (
                types.length === 1
                    ? THE_BT_OPT_TYPES_BT_ + quote(types[0])
                    : ONE + _OF_ + THE_BT_OPT_TYPES_BT_ + saq(types.join(':'))
            );
        }

        // If the item is `null` or an array, don't let it match 'object' in
        // `options.types`.
        if (definesTypes && type === OBJECT) {
            const result = item === null
                ? NULL
                : isArray(item)
                    ? AN_ARRAY
                    : '';
            if (result) return buildResultPrefix(
                begin,
                identifier && identifier + SQI,
                '`' + SQI + _OF_ + AN_ARRAY + '` '
            ) + IS_ + result + ',' + _NOT_A_REGULAR_ + OBJECT;
        }

        // The item's type is included in `options.types`, but if `options.pass`
        // is set to `true` the item may still be invalid.
        if (pass) {
            const itemIdentifier = identifier
                ? identifier + '[' + i + ']'
                : SQI + _OF_ + AN_ARRAY
            let result;
            switch (type) {
                case FUNCTION:
                    result = aintaFunction(item, itemIdentifier, options);
                    if (result) return result;
                    break;
                case NUMBER:
                    result = aintaNumber(item, itemIdentifier, options);
                    if (result) return result;
                    break;
                case OBJECT:
                    if (item === null) break; // @TODO a bit hacky, revisit this
                    if (Array.isArray(item)) break; // @TODO a bit hacky, revisit this
                    result = aintaObject(item, itemIdentifier, options);
                    if (result) return result;
                    break;
                case STRING:
                    result = aintaString(item, itemIdentifier, options);
                    if (result) return result;
                    break;
            }
        }
    }

    return false;
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
    const e2l = e => (e.stack.split('\n')[2].match(/([^\/]+\.js:\d+):\d+\)?$/)||[])[1];
    const equal = (actual, expected) => { if (actual === expected) return;
        try { throw Error() } catch(err) { throw Error(`actual:\n${actual}\n` +
            `!== expected:\n${expected}\n...at ${e2l(err)}\n`) } };

    // Invalid `options.is` produces a helpful result.
    equal(f([1], 'one', { begin:'Is', is:null }),
        "Is: `one` cannot be validated, `options.is` is null not an array");
    // @ts-expect-error
    equal(f([2], undefined, { is:{} }),
        "An array cannot be validated, `options.is` is type 'object' not an array");
    equal(f([3], 'three', { is:[] }),
        "`three` cannot be validated, `options.is` is empty");
    equal(f([4], 'four', { is:[true,'123'] }), // `options.is` is valid, because `mustContain` is `[]`
        "`four[0]` is not in `options.is` 'true:123'");

    // Invalid `options.least` produces a helpful result.
    equal(f([1], 'one', { begin:'Least', least:null }),
        "Least: `one` cannot be validated, `options.least` is null not type 'number'");
    // @ts-expect-error
    equal(f([2], undefined, { least:[], most:{} }), // the `most` error is ignored
        "An array cannot be validated, `options.least` is an array not type 'number'");
    // @ts-expect-error
    equal(f([3], null, { begin:'Three', least:Symbol(3) }),
        "Three: An array cannot be validated, `options.least` is type 'symbol' not 'number'");
    // @ts-expect-error
    equal(f([4], 'nope', { least:NaN, types:true }), // the `types` error is ignored
        "`nope` cannot be validated, `options.least` is the special `NaN` value");
    equal(f([5], '', { least:-1 }),
        "An array cannot be validated, `options.least` is negative");

    // Invalid `options.most` produces a helpful result.
    equal(f([1], 'one', { begin:'Most', most:null }),
        "Most: `one` cannot be validated, `options.most` is null not type 'number'");
    // @ts-expect-error
    equal(f([2], undefined, { most:[], pass:123 }), // the `pass` error is ignored
        "An array cannot be validated, `options.most` is an array not type 'number'");
    // @ts-expect-error
    equal(f([3], null, { begin:'Three', most:{} }),
        "Three: An array cannot be validated, `options.most` is type 'object' not 'number'");
    // @ts-expect-error
    equal(f([4], 'nope', { most:NaN, types:0 }), // the `types` error is ignored
        "`nope` cannot be validated, `options.most` is the special `NaN` value");
    equal(f([5], '', { begin:'Negative', most:-0.001 }),
        "Negative: An array cannot be validated, `options.most` is negative");

    // Invalid combination of `options.least` and `.most` produces a helpful result.
    equal(f([5], 'five', { least:1.001, most:1 }),
        "`five` cannot be validated, `options.least` > `options.most`");
    equal(f([6], '', { begin:'impossible range', least:Infinity, most:9999999 }),
        "impossible range: An array cannot be validated, `options.least` > `options.most`");

    // Invalid `options.pass` produces a helpful result.
    equal(f([1], 'one', { begin:'Pass', pass:null }),
        "Pass: `one` cannot be validated, `options.pass` is null not type 'boolean'");
    // @ts-expect-error
    equal(f([2], undefined, { pass:[], types:123 }), // the `types` error is ignored
        "An array cannot be validated, `options.pass` is an array not type 'boolean'");
    // @ts-expect-error
    equal(f([3], null, { begin:'Three', pass:0 }),
        "Three: An array cannot be validated, `options.pass` is type 'number' not 'boolean'");

    // If `options.pass` is `true`, invalid options sent to `aintaNumber()` or
    // `aintaString()` can produce helpful results... but only if an array item
    // actually triggers their use.
    equal(f(['1'], 'one', { begin:'Pass', mod:0, pass:true }),
        false);
    equal(f(['2'], 'two', { begin:'Pass', mod:0, pass:true, types:['number'] }),
        "Pass: `two[0]` is type 'string', not the `options.types` 'number'");
    equal(f(['3','3',3,'3'], 'three', { begin:'Pass', mod:0, pass:true }),
        "Pass: `three[2]` cannot be validated, `options.mod` is zero");
    equal(f([4], 'four', { begin:'Pass', max:44, min:77, pass:true }),
        false);
    equal(f([5], 'five', { begin:'Pass', max:44, min:77, pass:true, types:['string'] }),
        "Pass: `five[0]` is type 'number', not the `options.types` 'string'");
    equal(f([6,'6'], 'six', { begin:'Pass', max:44, min:77, pass:true }),
        "Pass: `six[1]` cannot be validated, `options.max` < `options.min`");

    // Invalid `options.types` produces a helpful result.
    equal(f([1], 'one', { types:null }),
        "`one` cannot be validated, `options.types` is null not an array");
    // @ts-expect-error
    equal(f([2], undefined, { types:77 }),
        "An array cannot be validated, `options.types` is type 'number' not an array");
    equal(f([3], 'three', { types:['string',null,'bigint'] }),
        "`three` cannot be validated, `options.types[1]` is null not type 'string'");
    equal(f([4], 'four', { types:['string','bigint',[]] }),
        "`four` cannot be validated, `options.types[2]` is an array not type 'string'");
    // @ts-expect-error
    equal(f([5], 'five', { types:[123,'string','bigint'] }),
        "`five` cannot be validated, `options.types[0]` is type 'number' not 'string'");
    // @ts-expect-error
    equal(f([6], 'six', { types:['string','bigint','Number','undefined'] }),
        "`six` cannot be validated, `options.types[2]` 'Number' not known");

    // Typical usage without `options.is`, `.least`, `.most`, `.pass` or `.types`.
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

    // Typical `options.is` boolean usage.
    equal(f([true], null, { is:[3,'false',true] }),
        false);
    equal(f([false], null, { is:[3,'false',true] }),
        "`[0] of an array` is not in `options.is` '3:false:true'"); // @TODO it's unclear what the problem really is - improve readability
    equal(f([false], 'negatory', { is:[false] }),
        false);
    equal(f([true,'false',true,false], 'negatory', { is:[true,'false'] }),
        "`negatory[3]` is not in `options.is` 'true:false'"); // @TODO it's unclear what the problem really is - improve readability
    equal(f([1,true], 'repeat values', { begin:'Array of booleans Test', is:[1,true,true] }),
        false);
    equal(f([1,false], 'repeat values', { begin:'Array of booleans Test', is:[1,true,true] }),
        "Array of booleans Test: `repeat values[1]` is not in `options.is` '1:true:true'");
    equal(f([true], null, { begin:'neverFails()', is:[true,false]}),
        false);
    equal(f([false], null, { begin:'neverFails()', is:[true,false]}),
        false);
    equal(f([true], 'too_many_items_to_log', { is:Array(10).fill(0).map(_=>false) }),
        "`too_many_items_to_log[0]` is not in `options.is` 'false:false:false:fal...se:false'");

    // @TODO Typical `options.is` function usage.
    // @TODO Typical `options.is` null usage.
    // @TODO Typical `options.is` number usage.
    // @TODO Typical `options.is` string usage.

    // Typical `options.is` object usage.
    class Foo { constructor(n) { this.n = n } }
    const foo = new Foo();
    equal(f([new Foo(3)], null, { is:[3,'2',true,Foo], open:true }),
        false);
    equal(f([{n:2}], null, { is:[3,'2',true,void 0,Foo], open:true }),
        "`[0] of an array` is not in `options.is` '3:2:true:undefined:Foo'");
    equal(f([new Promise(()=>{})], 'new Promise()', { is:[Foo,{},Promise,null] }),
        false);
    equal(f([{n:4}], 'new Promise()', { is:[Foo,{},Promise,null] }),
        "`new Promise()[0]` is not in `options.is` 'Foo:Object:Promise:null'");
    equal(f([foo], 'foo', { is:[foo], open:true }),
        false);
    equal(f([{n:2}], 'foo', { is:[foo], open:true }),
        "`foo[0]` is not in `options.is` 'Foo'");
    // @TODO more `options.is` object tests

    // Typical `options.least` usage.
    equal(f([1,2], null, { least:3 }),
        "An array has length 2 < `options.least` 3");
    equal(f([1,2,3], null, { least:3 }),
        false);
    equal(f([], 'empty_array,', { least:0 }),
        false);

    // Typical `options.most` usage.
    equal(f([1,2], null, { most:1 }),
        "An array has length 2 > `options.most` 1");
    equal(f([1], null, { most:3 }),
        false);
    equal(f([1], null, { most:0 }),
        "An array has length 1 > `options.most` 0");
    equal(f([], 'empty_array,', { most:0 }),
        false);

    // Using `options.least` and `options.most` together.
    equal(f('a|b|c|d|e|f'.split('|'), null, { least:5, most:5 }),
        "An array has length 6 > `options.most` 5");
    equal(f(Array(5), null, { least:5, most:5 }),
        false);
    equal(f([1,2,3,4], null, { least:5, most:5 }),
        "An array has length 4 < `options.least` 5");

    // Typical `options.pass` usage.
    equal(f([0,-Infinity,NaN], 'numbers', { pass:true }),
        "`numbers[2]` is the special `NaN` value not a regular number");
    equal(f([0,-Infinity,NaN], 'numbers', { pass:false }),
        false);
    equal(f([0,-1,-10], void 0, { begin:'Numbers', gte:0, pass:true }),
        "Numbers: `[1] of an array` -1 is not gte 0");
    equal(f([0,1,10], void 0, { begin:'Numbers', gte:0, pass:true }),
        false);
    equal(f([0,-10,100,11], 'multiples_of_10', { begin:'Numbers', mod:10, pass:true }),
        "Numbers: `multiples_of_10[3]` 11 is not divisible by 10");
    equal(f([0,-10,100,11], 'multiples_of_10', { begin:'Numbers', mod:10, pass:false }),
        false);

    // Basic `options.types` usage - properties can be any type.
    const everyType = [{},null,[],Math,/a/,()=>0,1,NaN,'a',false,void 0,BigInt(1),Symbol('a')];
    equal(f(everyType, 'everyType', { begin:'Anything goes', types:[] }),
        false);

    // Typical `options.types` usage - items must be of one type.
    equal(f([0,false,[],'three'], `bool_array`, { begin:' ', types:['boolean'] }),
        " : `bool_array[0]` is type 'number', not the `options.types` 'boolean'");
    equal(f([,,,[]], 'ok', { types:['undefined'] }),
        "`ok[3]` is an array, not the `options.types` 'undefined'");
    equal(f([void 0,null], '', { begin:'All undefined', types:['undefined'] }),
        "All undefined: `[1] of an array` is null, not the `options.types` 'undefined'");
    equal(f([{},null,[],Math], 'objs', { begin:'Has a null', types:['object'] }),
        "Has a null: `objs[1]` is null, not a regular object");
    equal(f([{},new Date(),[],Math], 'objs', { begin:'Has an array', types:['object'] }),
        "Has an array: `objs[2]` is an array, not a regular object");
    equal(f([{},Math], 'objs', { begin:'All objects', types:['object'] }),
        false);

    // Typical `options.types` usage - items must be of two types.
    equal(f(['0',null], 'bool_and_str_array', { types:['boolean','string'] }),
        "`bool_and_str_array[1]` is null, not one of the `options.types` 'boolean:string'");
    equal(f(['0',false,[],'three'], null, { types:['boolean','string'] }),
        "`[2] of an array` is an array, not one of the `options.types` 'boolean:string'");
    equal(f([-0,NaN,Infinity,BigInt(77)], void 0, { begin:'All numeric', types:['number','bigint'] }),
        false);

    // Using `options.pass` with an empty `options.types`.
    equal(f(everyType, '', {
        min:2, lte:0, pass:true, types:[] }),
        "`[6] of an array` 1 is not lte 0");
    equal(f(everyType, 'everyType', {
        min:2, lte:1, pass:true, types:[] }),
        "`everyType[7]` is the special `NaN` value not a regular number");
    equal(f(everyType, undefined, { begin: 'Every Type',
        min:2, pass:true, types:[] }),
        "Every Type: `[7] of an array` is the special `NaN` value not a regular number");
    everyType[7] = 2;
    equal(f(everyType, 'everyType', { begin: 'Every Type',
        min:2, pass:true, types:[] }),
        "Every Type: `everyType[8]` 'a' is not min 2");
    equal(f(everyType, '', {
        min:1, pass:true, types:[] }),
        false);

    // Using `options.pass` and `options.types` together.
    equal(f([-1,'',0,77], 'arr', { begin:'negative or non-empty str',
        lte:0, min:1, pass:true, types:['number','string'] }), // aintaString() uses min:1
        "negative or non-empty str: `arr[1]` '' is not min 1");
    equal(f([-1,'a',0,77], '', { begin:'negative or non-empty str',
        lte:0, min:1, pass:true, types:['number','string'] }), // aintaNumber() uses lte:0
        "negative or non-empty str: `[3] of an array` 77 is not lte 0");
    equal(f([-1,'a',0,-77], '', { begin:'negative or non-empty str',
        lte:0, min:1, pass:true, types:['number','string'] }),
        false);
    equal(f([-1,'',0,77], '', { begin:'negative or non-empty str',
        lte:0, min:1, pass:false, types:['number','string'] }), // pass is false
        false);

    // Using `options.pass` to validate an array of objects with a schema.
    // @TODO output better wording than `[2] of an array.a`
    // @TODO differentiate wording from aintaFunction()
    equal(f([{a:0},{a:1},{a:'2'},{a:3}], '', { begin:'obj.a is a number',
        pass:true, schema:{ a:{ types:['number']} }, types:['object'] }),
        "obj.a is a number: `[2] of an array.a` is type 'string', not the `options.types` 'number'");
    equal(f([{a:0},[],{a:1},{a:2},null,{a:3}], '', { begin:'The array is not allowed',
        pass:true, schema:{ a:{ types:['number']} }, types:['object'] }),
        "The array is not allowed: `[1] of an array` is an array, not a regular object");
    equal(f([{a:0},{a:1},{a:2},null,{a:3}], '', { begin:'The null is not allowed',
        pass:true, schema:{ a:{ types:['number']} }, types:['object'] }),
        "The null is not allowed: `[3] of an array` is null, not a regular object");
    equal(f([{a:0},{a:1},{a:'2'},{a:3}], '', { begin:'pass is false',
        pass:false, schema:{ a:{ types:['number']} }, types:['object'] }),
        false);

    // Using `options.pass` to validate an array of classes with a schema.
    // @TODO output better wording than `[2] of an array.a`
    // @TODO differentiate wording from aintaObject()
    equal(f([class{static a=0},class{static a=1},class{static a='2'},class{static a=3}],
        '', { begin:'obj.a is a number',
        pass:true, schema:{ a:{ types:['number']} }, types:['function'] }),
        "obj.a is a number: `[2] of an array.a` is type 'string', not the `options.types` 'number'");
    equal(f([class{static a=0},[],class{static a=1},class{static a=2},null,class{static a=3}],
            '', { begin:'The array is not allowed',
        pass:true, schema:{ a:{ types:['number']} }, types:['function'] }),
        "The array is not allowed: `[1] of an array` is an array, not the `options.types` 'function'");
    equal(f([class{static a=0},class{static a=1},{a:'2'},class{static a=3}],
        '', { begin:'pass is false',
        pass:false, schema:{ a:{ types:['number']} }, types:['function'] }),
        "pass is false: `[2] of an array` is type 'object', not the `options.types` 'function'");
    equal(f([class{static a=0},class{static a=1},{a:'2'},class{static a=3}],
        '', { begin:'pass is false',
        pass:false, schema:{ a:{ types:['number']} }, types:['function','object'] }),
        false);

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

    // Invalid `options.gte` is a TS error, but does not prevent normal use,
    // unless:
    // - `options.pass` is `true`
    // - AND numbers are allowed
    // - AND one of the items is a number
    // @ts-expect-error
    equal(f(''.split(','), null, { gte:[] }),
        false);
    // @ts-expect-error
    equal(f(/123/, null, { gte:[] }),
        "A value is type 'object' not an array");
    // @ts-expect-error
    equal(f(['str'], '', { gte:[], types:['string'] }),
        false);
    // @ts-expect-error
    equal(f([123], '', { gte:[], types:['string'] }),
        "`[0] of an array` is type 'number', not the `options.types` 'string'");
    // @ts-expect-error
    equal(f([123], false, { gte:[], types:['number','string'] }),
        false);
    // @ts-expect-error
    equal(f([null], false, { gte:[], types:['number','string'] }),
        "`[0] of an array` is null, not one of the `options.types` 'number:string'");
    // @ts-expect-error
    equal(f([123], void 0, { gte:[], types:['number','string'] }),
        false);
    // @ts-expect-error
    equal(f([null], void 0, { gte:[], types:['number','string'] }),
        "`[0] of an array` is null, not one of the `options.types` 'number:string'");
    // @ts-expect-error
    equal(f([123], 'pass is `true`', { gte:[], pass:true, types:['number','string'] }),
        "`pass is `true`[0]` cannot be validated, `options.gte` is an array not type 'number'");
    equal(f([123], 'pass is `true`', { gte:124, pass:true, types:['number','string'] }),
        "`pass is `true`[0]` 123 is not gte 124");
    equal(f([123], 'pass is `true`', { gte:123, pass:true, types:['number','string'] }),
        false);

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
